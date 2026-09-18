/**
 * MAE101 · Chương 6 — Matrices (Ma trận), học theo từng slide.
 * Deck 'mae6' (MAE6), 17 slide, render sẵn lên CDN images/academy/MAE101/v1/mae6/NNN.webp.
 * Nội dung bám đúng scripts/slides-src/mae101-ch6.mjs + Nicholson "Linear Algebra
 * with Applications" ch.2–3 và syllabus FLM (sylID 13137).
 *
 * MỌI phép tính trong phần giảng đều đã kiểm tay (và đối chiếu lại bằng máy):
 *   · Cộng/nhân vô hướng: [1 2; 3 4] + [5 0; −1 2] = [6 2; 2 6]; 2·[1 2; 3 4] = [2 4; 6 8]
 *   · Chuyển vị: [1 2 3; 4 5 6]^T = [1 4; 2 5; 3 6]
 *   · Phản đối xứng: B = [0 2 −3; −2 0 1; 3 −1 0] ⇒ B^T = −B, đường chéo toàn 0
 *   · Ax: [2 1 −1; −3 −1 2; −2 1 2]·(2, 3, −1) = (8, −11, −3) ✓ (khớp hệ ở Chương 5)
 *     dạng tổ hợp cột: 2(2,−3,−2) + 3(1,−1,1) − 1(−1,2,2) = (8, −11, −3) ✓
 *   · Nhân ma trận: A = [1 2 0; −1 3 4] (2×3), B = [2 1; 0 3; −1 2] (3×2) ⇒ AB = [2 7; −6 16]
 *     kiểm chéo: (AB)^T = [2 −6; 7 16] = B^T A^T ✓
 *   · Không giao hoán: [1 1; 0 1]·[1 0; 1 1] = [2 1; 1 1] nhưng [1 0; 1 1]·[1 1; 0 1] = [1 1; 1 2]
 *   · Tích 0 mà không thừa số nào bằng 0: [1 0; 0 0]·[0 0; 0 1] = [0 0; 0 0]
 *   · Quay: R90 = [0 −1; 1 0] ⇒ R90·(1,0) = (0,1); R90·(0,1) = (−1,0); R90² = [−1 0; 0 −1] = R180
 *   · Gauss-Jordan: [2 1 | 1 0; 1 1 | 0 1] → R1↔R2 → R2−2R1 → −R2 → R1−R2
 *     ⇒ A⁻¹ = [1 −1; −1 2]; kiểm lại A·A⁻¹ = I ✓; và A⁻¹·(3,2) = (1,1) giải đúng Ax = (3,2)
 *   · Công thức 2×2: A = [4 7; 2 6], det = 24 − 14 = 10 ⇒ A⁻¹ = [0,6 −0,7; −0,2 0,4]; A·A⁻¹ = I ✓
 *   · Suy biến: [1 2; 2 4] có det = 4 − 4 = 0 ⇒ không khả nghịch
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'mae6';

export default {
  title: '6.0 — Slide bài giảng: Ma trận (17 slide)|||6.0 — Slide bài giảng: Ma trận (17 slide)',
  slug: 'mae101-6-0-slides-ma-tran',
  type: 'DOCUMENT',
  description: 'Toàn bộ 17 slide Chương 6 MAE101 — ma trận và các loại đặc biệt, cộng và nhân vô hướng, chuyển vị, ma trận đối xứng, Ax như tổ hợp tuyến tính các cột, hệ Ax = b, điều kiện cỡ khi nhân hai ma trận và ví dụ nhân từng bước, tính chất phép nhân với bẫy AB khác BA, biến đổi ma trận trong mặt phẳng, ma trận quay, ma trận nghịch đảo, Gauss-Jordan tìm nghịch đảo và công thức nhanh cho ma trận 2×2 — mỗi slide kèm giảng song ngữ, ma trận cụ thể đã kiểm tay và bẫy hay gặp khi thi.',
  content: [
    walkHead(D, 1, 17),
    walk(D, [
      [1, 'Chapter 6 — Matrices (cover)',
        `<p class="y-chinh">🎯 Chapter 6 of MAE101: the <strong>matrix</strong> itself — how to add, multiply, transpose and invert one, and what it does to points in the plane.</p>
<ul>
<li><strong>Where this sits</strong> — Chapter 5 used matrices as bookkeeping for solving systems. Chapter 6 promotes the matrix to an object with its own algebra: it can be added, scaled, multiplied and (sometimes) inverted.</li>
<li><strong>Two readings of the same object</strong> — a matrix is a rectangular table of numbers, and simultaneously a <em>machine</em> that eats a vector and returns a vector. Both readings appear on every slide of this deck.</li>
<li><strong>What this deck covers</strong> — 17 slides: matrix size and the special types, addition and scalar multiplication, transpose, symmetric and skew-symmetric matrices, Ax as a combination of columns, the system Ax = b, matrix multiplication with a fully worked example, the algebra of multiplication, transformations of the plane, rotation, the inverse, Gauss-Jordan, and the 2×2 shortcut.</li>
</ul>
<p class="meo">💡 The one habit that carries the whole chapter: write the size under every matrix before you compute. Almost every error in Chapter 6 is a size error wearing a disguise.</p>`,
        `<p class="y-chinh">🎯 Chương 6 của MAE101: chính bản thân <strong>ma trận</strong> — cách cộng, nhân, chuyển vị, nghịch đảo, và nó làm gì với các điểm trong mặt phẳng.</p>
<ul>
<li><strong>Chương này nằm ở đâu</strong> — Chương 5 dùng ma trận như một sổ ghi để giải hệ. Chương 6 nâng ma trận lên thành một đối tượng có đại số riêng: cộng được, nhân được với số, nhân được với nhau và (đôi khi) nghịch đảo được.</li>
<li><strong>Hai cách đọc cùng một vật</strong> — ma trận là một bảng số chữ nhật, đồng thời là một <em>cỗ máy</em> ăn vào một vectơ và trả ra một vectơ. Cả hai cách đọc đều xuất hiện ở mọi slide của bộ này.</li>
<li><strong>Bộ slide này gồm</strong> — 17 slide: cỡ ma trận và các loại đặc biệt, cộng và nhân vô hướng, chuyển vị, ma trận đối xứng và phản đối xứng, Ax như tổ hợp các cột, hệ Ax = b, phép nhân hai ma trận với một ví dụ giải đủ, đại số của phép nhân, biến đổi mặt phẳng, ma trận quay, ma trận nghịch đảo, Gauss-Jordan, và công thức nhanh cho ma trận 2×2.</li>
</ul>
<p class="meo">💡 Một thói quen gánh cả chương: ghi cỡ ma trận xuống dưới mỗi ma trận trước khi tính. Gần như mọi lỗi ở Chương 6 đều là lỗi cỡ được hoá trang lại.</p>`],

      [2, 'Contents — six blocks of Chapter 6',
        `<p class="y-chinh">🎯 Chapter 6 runs through six blocks, each one built on the one before.</p>
<ol>
<li><strong>Matrices, size and special types</strong> — slide 3: the m×n table, the entry a(i,j), and the square, identity, zero, diagonal and triangular families.</li>
<li><strong>Addition, scalar multiplication and transpose</strong> — slides 4–6: entrywise arithmetic, the rules that behave exactly like real numbers, the transpose, and symmetric versus skew-symmetric matrices.</li>
<li><strong>Matrix times vector, and the system Ax = b</strong> — slides 7–8: Ax as a linear combination of the columns of A, and the whole of Chapter 5 rewritten as one equation.</li>
<li><strong>Multiplying two matrices</strong> — slides 9–11: the size condition, the row-times-column formula, one example done in full, then associativity, distributivity and the failure of commutativity.</li>
<li><strong>Matrix transformations of the plane</strong> — slides 12–13: rotation, reflection, scaling and projection, with the rotation matrix worked out at 90 degrees.</li>
<li><strong>The inverse</strong> — slides 14–16: what A inverse means, Gauss-Jordan on the block [A | I], and the 2×2 shortcut. Slide 17 is the summary.</li>
</ol>`,
        `<p class="y-chinh">🎯 Chương 6 chạy qua sáu khối, khối sau dựng trên khối trước.</p>
<ol>
<li><strong>Ma trận, cỡ và các loại đặc biệt</strong> — slide 3: bảng m×n, phần tử a(i,j), và các họ vuông, đơn vị, không, chéo, tam giác.</li>
<li><strong>Cộng, nhân vô hướng và chuyển vị</strong> — slide 4–6: số học theo từng phần tử, những quy tắc hành xử y hệt số thực, phép chuyển vị, và ma trận đối xứng so với phản đối xứng.</li>
<li><strong>Ma trận nhân vectơ, và hệ Ax = b</strong> — slide 7–8: Ax như tổ hợp tuyến tính các cột của A, và toàn bộ Chương 5 được viết lại thành một phương trình.</li>
<li><strong>Nhân hai ma trận</strong> — slide 9–11: điều kiện cỡ, công thức hàng nhân cột, một ví dụ giải đủ từng bước, rồi tính kết hợp, phân phối và chuyện không giao hoán.</li>
<li><strong>Biến đổi ma trận trong mặt phẳng</strong> — slide 12–13: quay, đối xứng, co giãn và chiếu, cùng ma trận quay được tính cụ thể ở góc 90 độ.</li>
<li><strong>Ma trận nghịch đảo</strong> — slide 14–16: A mũ trừ một nghĩa là gì, Gauss-Jordan trên khối [A | I], và công thức nhanh cho 2×2. Slide 17 là phần tổng kết.</li>
</ol>`],

      [3, 'What is a matrix — size and special types',
        `<p class="y-chinh">🎯 An m×n matrix is a rectangular table with m rows and n columns; the entry in row i and column j is written a(i,j).</p>
<ul>
<li><strong>Reading the size</strong> — rows first, columns second, always. A matrix with 2 rows and 3 columns, such as [1 2 3; 4 5 6], is 2×3 and never 3×2. Saying the size out loud before computing prevents most of this chapter's mistakes.</li>
<li><strong>Reading an entry</strong> — a(2,3) is the number in row 2, column 3. In [1 2 3; 4 5 6] that is 6. The first index is the row, exactly like the size convention.</li>
<li><strong>Square</strong> — m = n. Only square matrices can have an inverse (slide 14), a determinant or eigenvalues, so squareness is the gate to most of the theory ahead.</li>
<li><strong>Identity I</strong> — square, 1s down the main diagonal, 0s everywhere else: I(2) = [1 0; 0 1], I(3) = [1 0 0; 0 1 0; 0 0 1]. It is the number 1 of matrix algebra: AI = IA = A.</li>
<li><strong>Zero matrix</strong> — every entry 0. It plays the role of 0: A + 0 = A. Careful though, its multiplicative behaviour has a surprise waiting on slide 11.</li>
<li><strong>Diagonal</strong> — square with every off-diagonal entry 0, for example [3 0; 0 −5]. These are the easy matrices: you multiply them by multiplying the diagonal entries.</li>
<li><strong>Upper and lower triangular</strong> — upper triangular has all zeros <em>below</em> the main diagonal, [2 7; 0 3]; lower triangular has all zeros <em>above</em> it, [2 0; 7 3]. The row echelon forms of Chapter 5 are essentially upper triangular.</li>
<li><strong>The main diagonal</strong> — the entries a(1,1), a(2,2), a(3,3), … running top-left to bottom-right. Every definition above is stated relative to it, so locate it first.</li>
</ul>
<p class="meo">💡 The names describe where the <em>zeros</em> are, not where the numbers are. Ask "which region is forced to be zero?" and each definition answers itself.</p>
<p class="pitfall">⚠️ Two habitual slips: reversing the size (calling a 2×3 matrix 3×2), and assuming a diagonal matrix must have nonzero diagonal entries. [3 0; 0 0] is perfectly diagonal — and, as slide 14 will show, not invertible.</p>`,
        `<p class="y-chinh">🎯 Ma trận cỡ m×n là một bảng chữ nhật gồm m hàng và n cột; phần tử ở hàng i cột j viết là a(i,j).</p>
<ul>
<li><strong>Đọc cỡ</strong> — hàng trước, cột sau, luôn luôn như vậy. Ma trận có 2 hàng 3 cột như [1 2 3; 4 5 6] là 2×3 chứ không bao giờ là 3×2. Đọc to cỡ ra trước khi tính sẽ chặn phần lớn lỗi của chương này.</li>
<li><strong>Đọc một phần tử</strong> — a(2,3) là số ở hàng 2, cột 3. Trong [1 2 3; 4 5 6] đó là số 6. Chỉ số đầu là hàng, đúng như quy ước cỡ.</li>
<li><strong>Ma trận vuông</strong> — m = n. Chỉ ma trận vuông mới có thể có nghịch đảo (slide 14), định thức hay trị riêng, nên tính vuông là cánh cổng vào hầu hết lý thuyết phía sau.</li>
<li><strong>Ma trận đơn vị I</strong> — vuông, đường chéo chính toàn số 1, còn lại toàn 0: I(2) = [1 0; 0 1], I(3) = [1 0 0; 0 1 0; 0 0 1]. Nó đóng vai số 1 của đại số ma trận: AI = IA = A.</li>
<li><strong>Ma trận không</strong> — mọi phần tử bằng 0. Nó đóng vai số 0: A + 0 = A. Nhưng cẩn thận, hành vi của nó trong phép nhân có một bất ngờ đợi sẵn ở slide 11.</li>
<li><strong>Ma trận chéo</strong> — vuông và mọi phần tử ngoài đường chéo đều bằng 0, ví dụ [3 0; 0 −5]. Đây là loại ma trận dễ chịu nhất: nhân chúng chỉ là nhân các số trên đường chéo.</li>
<li><strong>Tam giác trên và tam giác dưới</strong> — tam giác trên có toàn số 0 <em>dưới</em> đường chéo chính, [2 7; 0 3]; tam giác dưới có toàn số 0 <em>trên</em> đường chéo, [2 0; 7 3]. Các dạng bậc thang ở Chương 5 về bản chất là tam giác trên.</li>
<li><strong>Đường chéo chính</strong> — dãy phần tử a(1,1), a(2,2), a(3,3), … chạy từ góc trên trái xuống góc dưới phải. Mọi định nghĩa ở trên đều phát biểu dựa vào nó, nên hãy xác định nó trước tiên.</li>
</ul>
<p class="meo">💡 Các tên gọi mô tả chỗ đặt <em>số 0</em>, không phải chỗ đặt các con số. Cứ hỏi "vùng nào bắt buộc phải bằng 0?" là mỗi định nghĩa tự trả lời chính nó.</p>
<p class="pitfall">⚠️ Hai lỗi thành nếp: đảo ngược cỡ (gọi ma trận 2×3 là 3×2), và mặc định ma trận chéo phải có các số trên đường chéo khác 0. [3 0; 0 0] vẫn là ma trận chéo hoàn toàn hợp lệ — và như slide 14 sẽ cho thấy, nó không khả nghịch.</p>`],

      [4, 'Addition and scalar multiplication',
        `<p class="y-chinh">🎯 Two matrices can be added only if they have the <strong>same size</strong>, and then you simply add corresponding entries; a scalar multiplies every entry.</p>
<ul>
<li><strong>The size condition</strong> — A + B exists only when A and B are both m×n, and the sum is again m×n. A 2×3 plus a 3×2 is not a hard sum, it is an undefined one.</li>
<li><strong>The worked sum on the slide</strong> — [1 2; 3 4] + [5 0; −1 2]: entry by entry 1+5 = 6, 2+0 = 2, 3+(−1) = 2, 4+2 = 6, giving <strong>[6 2; 2 6]</strong>.</li>
<li><strong>Scalar multiplication</strong> — cA multiplies <em>every</em> entry by c. On the slide, 2·[1 2; 3 4] = <strong>[2 4; 6 8]</strong>: all four entries doubled, not just the diagonal and not just the first row.</li>
<li><strong>Subtraction</strong> — A − B is defined as A + (−1)B, so it is again entrywise and again needs matching sizes.</li>
<li><strong>The rules match real numbers</strong> — A + B = B + A (commutative), (A + B) + C = A + (B + C) (associative), c(A + B) = cA + cB and (c + d)A = cA + dA (distributive).</li>
<li><strong>Neutral and opposite</strong> — A + 0 = A where 0 is the zero matrix of the same size, and A + (−A) = 0. Addition therefore behaves exactly as you expect; it is <em>multiplication</em> that will misbehave, starting at slide 11.</li>
<li><strong>Why it is this simple</strong> — addition treats a matrix as a list of independent numbers. No mixing of rows and columns happens, which is precisely why it cannot cause any surprises.</li>
</ul>
<p class="meo">💡 Solve mixed expressions such as 2A − 3B in one pass: go entry by entry through both matrices computing 2a(i,j) − 3b(i,j). Building 2A and 3B as separate matrices first doubles the writing and the chances of an error.</p>
<p class="pitfall">⚠️ Multiplying only part of a matrix by the scalar — writing 2·[1 2; 3 4] = [2 2; 3 4] because only the first entry got doubled. And remember cA = 0 does not force A = 0: it also happens when c = 0.</p>`,
        `<p class="y-chinh">🎯 Chỉ cộng được hai ma trận khi chúng <strong>cùng cỡ</strong>, và khi đó chỉ việc cộng các phần tử tương ứng; nhân vô hướng thì nhân mọi phần tử.</p>
<ul>
<li><strong>Điều kiện cỡ</strong> — A + B chỉ tồn tại khi cả A và B đều là m×n, và tổng lại là m×n. Một ma trận 2×3 cộng một ma trận 3×2 không phải phép cộng khó, mà là phép cộng không có nghĩa.</li>
<li><strong>Phép cộng đã giải trên slide</strong> — [1 2; 3 4] + [5 0; −1 2]: từng ô một, 1+5 = 6, 2+0 = 2, 3+(−1) = 2, 4+2 = 6, cho ra <strong>[6 2; 2 6]</strong>.</li>
<li><strong>Nhân vô hướng</strong> — cA nhân <em>mọi</em> phần tử với c. Trên slide, 2·[1 2; 3 4] = <strong>[2 4; 6 8]</strong>: cả bốn ô đều nhân đôi, không phải chỉ đường chéo và cũng không phải chỉ hàng đầu.</li>
<li><strong>Phép trừ</strong> — A − B được định nghĩa là A + (−1)B, nên cũng theo từng phần tử và cũng đòi hai ma trận cùng cỡ.</li>
<li><strong>Các quy tắc giống hệt số thực</strong> — A + B = B + A (giao hoán), (A + B) + C = A + (B + C) (kết hợp), c(A + B) = cA + cB và (c + d)A = cA + dA (phân phối).</li>
<li><strong>Phần tử trung hoà và phần tử đối</strong> — A + 0 = A với 0 là ma trận không cùng cỡ, và A + (−A) = 0. Vậy phép cộng hành xử đúng như bạn mong đợi; chính <em>phép nhân</em> mới là thứ giở chứng, bắt đầu từ slide 11.</li>
<li><strong>Vì sao lại đơn giản đến thế</strong> — phép cộng coi ma trận như một danh sách các số độc lập. Không có chuyện trộn hàng với cột, và đó đúng là lý do nó không thể gây bất ngờ nào.</li>
</ul>
<p class="meo">💡 Với biểu thức hỗn hợp như 2A − 3B, hãy giải trong một lượt: đi từng ô qua cả hai ma trận và tính 2a(i,j) − 3b(i,j). Dựng riêng 2A rồi 3B trước sẽ tăng gấp đôi lượng chữ phải viết và gấp đôi cơ hội sai.</p>
<p class="pitfall">⚠️ Chỉ nhân một phần ma trận với số — viết 2·[1 2; 3 4] = [2 2; 3 4] vì chỉ có ô đầu được nhân đôi. Và nhớ rằng cA = 0 không bắt buộc A = 0: điều đó cũng xảy ra khi c = 0.</p>`],

      [5, 'Transpose',
        `<p class="y-chinh">🎯 The transpose A(T) turns rows into columns: row i of A becomes column i of A(T), so an m×n matrix becomes n×m.</p>
<ul>
<li><strong>The worked example on the slide</strong> — A = [1 2 3; 4 5 6] is 2×3. Row 1 is (1, 2, 3) and becomes column 1; row 2 is (4, 5, 6) and becomes column 2. Result: <strong>A(T) = [1 4; 2 5; 3 6]</strong>, size 3×2.</li>
<li><strong>Entry rule</strong> — the entry of A(T) in row i, column j equals a(j,i). The two indices simply swap places, which is the whole definition in one line.</li>
<li><strong>The diagonal stays put</strong> — a(1,1), a(2,2), … are unmoved, because swapping i and j does nothing when i = j. Transposing is a mirror reflection across the main diagonal.</li>
<li><strong>Property 1 — (A(T))(T) = A</strong> — transposing twice returns the original. Reflecting twice in the same mirror is the identity.</li>
<li><strong>Property 2 — (A + B)(T) = A(T) + B(T)</strong> — transpose passes straight through a sum, and likewise (cA)(T) = cA(T).</li>
<li><strong>Property 3 — (AB)(T) = B(T)A(T)</strong> — the order <strong>reverses</strong>. This is the property worth memorising, and it is also the only one that catches people out.</li>
<li><strong>A check of property 3</strong> — take A = [1 2 0; −1 3 4] and B = [2 1; 0 3; −1 2] from slide 10, where AB = [2 7; −6 16] and so (AB)(T) = [2 −6; 7 16]. Computing B(T)A(T) with B(T) = [2 0 −1; 1 3 2] and A(T) = [1 −1; 2 3; 0 4] gives [2 −6; 7 16] as well. The two agree.</li>
<li><strong>Why the reversal is forced</strong> — sizes demand it. If A is m×n and B is n×p, then A(T) is n×m and B(T) is p×n, so A(T)B(T) is usually not even defined, while B(T)A(T) is p×m, the correct size for (AB)(T).</li>
</ul>
<p class="meo">💡 Verify a transpose by checking one asymmetric entry, not all of them: a(1,2) of A must land at position (2,1) of A(T). If it did, the rest almost certainly followed.</p>
<p class="pitfall">⚠️ Writing (AB)(T) = A(T)B(T). It is wrong, and usually not even a legal product. The same reversal appears again for inverses on slide 16: (AB) inverse = B inverse times A inverse.</p>`,
        `<p class="y-chinh">🎯 Phép chuyển vị A(T) biến hàng thành cột: hàng i của A trở thành cột i của A(T), nên ma trận m×n biến thành n×m.</p>
<ul>
<li><strong>Ví dụ đã giải trên slide</strong> — A = [1 2 3; 4 5 6] cỡ 2×3. Hàng 1 là (1, 2, 3) và trở thành cột 1; hàng 2 là (4, 5, 6) và trở thành cột 2. Kết quả: <strong>A(T) = [1 4; 2 5; 3 6]</strong>, cỡ 3×2.</li>
<li><strong>Quy tắc theo phần tử</strong> — phần tử của A(T) ở hàng i cột j bằng a(j,i). Hai chỉ số chỉ đơn giản đổi chỗ cho nhau, và đó là trọn vẹn định nghĩa trong một dòng.</li>
<li><strong>Đường chéo đứng yên</strong> — a(1,1), a(2,2), … không nhúc nhích, vì đổi chỗ i với j chẳng làm gì khi i = j. Chuyển vị chính là lấy gương phản chiếu qua đường chéo chính.</li>
<li><strong>Tính chất 1 — (A(T))(T) = A</strong> — chuyển vị hai lần thì quay về ma trận ban đầu. Soi hai lần trong cùng một cái gương là không soi gì cả.</li>
<li><strong>Tính chất 2 — (A + B)(T) = A(T) + B(T)</strong> — chuyển vị đi xuyên thẳng qua phép cộng, và tương tự (cA)(T) = cA(T).</li>
<li><strong>Tính chất 3 — (AB)(T) = B(T)A(T)</strong> — thứ tự <strong>đảo ngược</strong>. Đây là tính chất đáng học thuộc, và cũng là tính chất duy nhất hay làm người ta vấp.</li>
<li><strong>Kiểm lại tính chất 3</strong> — lấy A = [1 2 0; −1 3 4] và B = [2 1; 0 3; −1 2] ở slide 10, nơi AB = [2 7; −6 16] nên (AB)(T) = [2 −6; 7 16]. Tính B(T)A(T) với B(T) = [2 0 −1; 1 3 2] và A(T) = [1 −1; 2 3; 0 4] cũng cho ra [2 −6; 7 16]. Hai vế khớp nhau.</li>
<li><strong>Vì sao bắt buộc phải đảo</strong> — chính cỡ ma trận ép như vậy. Nếu A là m×n và B là n×p thì A(T) là n×m còn B(T) là p×n, nên A(T)B(T) thường còn không có nghĩa, trong khi B(T)A(T) là p×m, đúng cỡ của (AB)(T).</li>
</ul>
<p class="meo">💡 Kiểm một phép chuyển vị bằng cách soi một ô bất đối xứng thôi, đừng soi hết: ô a(1,2) của A bắt buộc phải rơi vào vị trí (2,1) của A(T). Nếu nó rơi đúng thì phần còn lại gần như chắc chắn cũng đúng.</p>
<p class="pitfall">⚠️ Viết (AB)(T) = A(T)B(T). Sai, và thường còn không phải một tích hợp lệ. Đúng kiểu đảo thứ tự đó sẽ xuất hiện lại với nghịch đảo ở slide 16: (AB) nghịch đảo bằng B nghịch đảo nhân A nghịch đảo.</p>`],

      [6, 'Symmetric and skew-symmetric matrices',
        `<p class="y-chinh">🎯 A square matrix is <strong>symmetric</strong> when A = A(T), and <strong>skew-symmetric</strong> when A = −A(T).</p>
<ul>
<li><strong>Symmetric, in entries</strong> — a(i,j) = a(j,i) for every pair. The matrix reads the same reflected across the main diagonal, which is why the diagonal itself is unconstrained.</li>
<li><strong>The example on the slide</strong> — A = [1 2 3; 2 5 −1; 3 −1 4]. Check the mirror pairs: a(1,2) = a(2,1) = 2, a(1,3) = a(3,1) = 3, a(2,3) = a(3,2) = −1. All three match, so A = A(T).</li>
<li><strong>Skew-symmetric, in entries</strong> — a(i,j) = −a(j,i). The mirror pairs are now opposites rather than equal.</li>
<li><strong>The diagonal is forced to zero</strong> — putting i = j gives a(i,i) = −a(i,i), hence 2a(i,i) = 0 and a(i,i) = 0. A skew-symmetric matrix <em>must</em> have a zero diagonal; this is a proof, not a convention.</li>
<li><strong>The example on the slide</strong> — B = [0 2 −3; −2 0 1; 3 −1 0]. Diagonal all zeros ✓, and the pairs are opposite: 2 against −2, −3 against 3, 1 against −1. So B(T) = −B.</li>
<li><strong>Square is compulsory</strong> — if A is m×n with m not equal to n, then A(T) is n×m and the equation A = A(T) compares two matrices of different sizes. It cannot even be asked.</li>
<li><strong>Two useful facts</strong> — A + A(T) is always symmetric and A − A(T) is always skew-symmetric, so every square matrix splits as A = half of (A + A(T)) plus half of (A − A(T)): a symmetric part plus a skew part.</li>
<li><strong>Where they show up</strong> — symmetric matrices carry distances and quadratic forms (and, in Chapter 7, always have real eigenvalues); skew-symmetric matrices carry rotations and cross products.</li>
</ul>
<p class="meo">💡 Test symmetry with your eyes: fold the matrix along the main diagonal. Equal numbers meeting means symmetric, opposite numbers meeting with zeros on the fold means skew-symmetric.</p>
<p class="pitfall">⚠️ Calling [0 2 −3; −2 0 1; 3 −1 5] skew-symmetric. The mirror pairs are right but a(3,3) = 5, and a nonzero diagonal entry rules it out on its own. Note also that the zero matrix is the only matrix that is both symmetric and skew-symmetric.</p>`,
        `<p class="y-chinh">🎯 Ma trận vuông là <strong>đối xứng</strong> khi A = A(T), và <strong>phản đối xứng</strong> khi A = −A(T).</p>
<ul>
<li><strong>Đối xứng, xét theo phần tử</strong> — a(i,j) = a(j,i) với mọi cặp. Ma trận đọc y hệt nhau khi soi qua đường chéo chính, và đó là lý do bản thân đường chéo không bị ràng buộc gì.</li>
<li><strong>Ví dụ trên slide</strong> — A = [1 2 3; 2 5 −1; 3 −1 4]. Kiểm các cặp soi gương: a(1,2) = a(2,1) = 2, a(1,3) = a(3,1) = 3, a(2,3) = a(3,2) = −1. Cả ba cặp đều khớp, vậy A = A(T).</li>
<li><strong>Phản đối xứng, xét theo phần tử</strong> — a(i,j) = −a(j,i). Các cặp soi gương giờ đối nhau chứ không bằng nhau.</li>
<li><strong>Đường chéo bị ép về 0</strong> — đặt i = j sẽ được a(i,i) = −a(i,i), suy ra 2a(i,i) = 0 và a(i,i) = 0. Ma trận phản đối xứng <em>bắt buộc</em> có đường chéo toàn 0; đây là một chứng minh chứ không phải quy ước.</li>
<li><strong>Ví dụ trên slide</strong> — B = [0 2 −3; −2 0 1; 3 −1 0]. Đường chéo toàn 0 ✓, và các cặp đối nhau: 2 với −2, −3 với 3, 1 với −1. Vậy B(T) = −B.</li>
<li><strong>Vuông là bắt buộc</strong> — nếu A là m×n với m khác n thì A(T) là n×m, và đẳng thức A = A(T) đang so hai ma trận khác cỡ. Câu hỏi đó thậm chí không đặt ra được.</li>
<li><strong>Hai sự thật hữu ích</strong> — A + A(T) luôn đối xứng còn A − A(T) luôn phản đối xứng, nên mọi ma trận vuông đều tách được thành A = một nửa của (A + A(T)) cộng một nửa của (A − A(T)): một phần đối xứng cộng một phần phản đối xứng.</li>
<li><strong>Chúng xuất hiện ở đâu</strong> — ma trận đối xứng mang khoảng cách và dạng toàn phương (và ở Chương 7, luôn có trị riêng thực); ma trận phản đối xứng mang phép quay và tích có hướng.</li>
</ul>
<p class="meo">💡 Kiểm tính đối xứng bằng mắt: gập ma trận theo đường chéo chính. Các số bằng nhau chồng lên nhau là đối xứng; các số đối nhau chồng lên nhau kèm số 0 nằm trên nếp gập là phản đối xứng.</p>
<p class="pitfall">⚠️ Gọi [0 2 −3; −2 0 1; 3 −1 5] là phản đối xứng. Các cặp soi gương đúng thật nhưng a(3,3) = 5, mà chỉ riêng một ô khác 0 trên đường chéo đã đủ loại. Cũng lưu ý ma trận không là ma trận duy nhất vừa đối xứng vừa phản đối xứng.</p>`],

      [7, 'Matrix times vector — what Ax really is',
        `<p class="y-chinh">🎯 If A is m×n and x has n entries, then Ax is the <strong>linear combination of the columns of A</strong> whose coefficients are the entries of x.</p>
<ul>
<li><strong>The formula on the slide</strong> — writing A by its columns, [a1 a2 a3] times the column (x1, x2, x3) equals x1·a1 + x2·a2 + x3·a3. Each x(i) is a <em>weight</em> placed on a whole column, not a number multiplied into one entry.</li>
<li><strong>The size rule</strong> — the number of entries of x must equal the number of <em>columns</em> of A, and the result Ax has as many entries as A has <em>rows</em>. So A of size m×n times x of size n×1 is m×1.</li>
<li><strong>Worked example, column view</strong> — with A = [2 1 −1; −3 −1 2; −2 1 2] and x = (2, 3, −1): 2·(2, −3, −2) + 3·(1, −1, 1) + (−1)·(−1, 2, 2) = (4, −6, −4) + (3, −3, 3) + (1, −2, −2) = <strong>(8, −11, −3)</strong>.</li>
<li><strong>Same answer, row view</strong> — entry i of Ax is row i of A dotted with x: 2(2) + 1(3) + (−1)(−1) = 8; −3(2) + (−1)(3) + 2(−1) = −11; −2(2) + 1(3) + 2(−1) = −3. Identical, as it must be.</li>
<li><strong>Which view to use when</strong> — the row view is faster for grinding out numbers; the column view is the one that explains <em>why</em>, and it is the view Chapters 7 and 8 build on.</li>
<li><strong>Linearity</strong> — A(x + y) = Ax + Ay and A(cx) = c(Ax). These two identities are exactly what makes x mapped to Ax a <em>linear</em> transformation, the subject of slide 12.</li>
<li><strong>The special case Ix = x</strong> — the identity leaves every vector alone, since the combination picks out x1 times e1 plus x2 times e2 plus ….</li>
<li><strong>The consequence worth remembering</strong> — the set of all possible values of Ax, as x ranges over everything, is exactly the span of the columns of A. Solvability of Ax = b on the next slide is nothing but the question of whether b lies in that span.</li>
</ul>
<p class="meo">💡 Compute Ax by the rows and check it by the columns (or the reverse). Two independent routes to the same vector is the cheapest error check in the whole chapter.</p>
<p class="pitfall">⚠️ Multiplying entrywise: reading A times x as (a(1,1)x1, a(2,2)x2, …). That is not matrix multiplication at all. The other classic is trying Ax with x too short or too long — count the columns of A first, always.</p>`,
        `<p class="y-chinh">🎯 Nếu A cỡ m×n và x có n phần tử thì Ax chính là <strong>tổ hợp tuyến tính các cột của A</strong> với hệ số là các phần tử của x.</p>
<ul>
<li><strong>Công thức trên slide</strong> — viết A theo các cột, [a1 a2 a3] nhân với cột (x1, x2, x3) bằng x1·a1 + x2·a2 + x3·a3. Mỗi x(i) là một <em>trọng số</em> đặt lên trọn một cột, không phải một số nhân vào một ô.</li>
<li><strong>Quy tắc cỡ</strong> — số phần tử của x phải bằng số <em>cột</em> của A, và kết quả Ax có số phần tử bằng số <em>hàng</em> của A. Vậy A cỡ m×n nhân x cỡ n×1 cho ra m×1.</li>
<li><strong>Ví dụ giải theo cách cột</strong> — với A = [2 1 −1; −3 −1 2; −2 1 2] và x = (2, 3, −1): 2·(2, −3, −2) + 3·(1, −1, 1) + (−1)·(−1, 2, 2) = (4, −6, −4) + (3, −3, 3) + (1, −2, −2) = <strong>(8, −11, −3)</strong>.</li>
<li><strong>Cùng đáp án, cách hàng</strong> — phần tử thứ i của Ax là hàng i của A nhân vô hướng với x: 2(2) + 1(3) + (−1)(−1) = 8; −3(2) + (−1)(3) + 2(−1) = −11; −2(2) + 1(3) + 2(−1) = −3. Giống hệt, và bắt buộc phải giống.</li>
<li><strong>Khi nào dùng cách nào</strong> — cách hàng nhanh hơn khi phải cày ra con số; cách cột mới là cách giải thích <em>vì sao</em>, và đó là cách mà Chương 7 với Chương 8 dựng tiếp lên.</li>
<li><strong>Tính tuyến tính</strong> — A(x + y) = Ax + Ay và A(cx) = c(Ax). Đúng hai đẳng thức này làm cho phép x biến thành Ax trở thành một biến đổi <em>tuyến tính</em>, chủ đề của slide 12.</li>
<li><strong>Trường hợp riêng Ix = x</strong> — ma trận đơn vị để nguyên mọi vectơ, vì tổ hợp đó chỉ lấy x1 nhân e1 cộng x2 nhân e2 cộng ….</li>
<li><strong>Hệ quả đáng nhớ</strong> — tập tất cả giá trị có thể của Ax, khi x chạy khắp nơi, đúng bằng không gian sinh bởi các cột của A. Chuyện hệ Ax = b ở slide sau có nghiệm hay không chẳng qua là câu hỏi b có nằm trong không gian sinh đó hay không.</li>
</ul>
<p class="meo">💡 Tính Ax theo hàng rồi kiểm lại theo cột (hoặc ngược lại). Hai con đường độc lập dẫn tới cùng một vectơ là phép kiểm lỗi rẻ nhất trong cả chương.</p>
<p class="pitfall">⚠️ Nhân theo từng phần tử: đọc Ax thành (a(1,1)x1, a(2,2)x2, …). Đó hoàn toàn không phải phép nhân ma trận. Lỗi kinh điển còn lại là thử Ax với x quá ngắn hoặc quá dài — hãy đếm số cột của A trước, lần nào cũng vậy.</p>`],

      [8, 'Ax = b — a whole system in one equation',
        `<p class="y-chinh">🎯 Every linear system of m equations in n unknowns compresses into the single matrix equation Ax = b.</p>
<ul>
<li><strong>The example on the slide</strong> — [2 1 −1; −3 −1 2; −2 1 2] times the column (x, y, z) equals (8, −11, −3). This is precisely the system 2x + y − z = 8, −3x − y + 2z = −11, −2x + y + 2z = −3 from Chapter 5.</li>
<li><strong>The three pieces</strong> — A is the m×n coefficient matrix, x is the n×1 column of unknowns, and b is the m×1 column of right-hand sides. Sizes chain correctly: m×n times n×1 gives m×1, which matches b.</li>
<li><strong>Row reading</strong> — row i of A dotted with x reproduces equation i exactly. Nothing has been added or lost, only the letters x, y, z have been factored out.</li>
<li><strong>Column reading</strong> — by slide 7, solving Ax = b means finding weights on the columns of A that build b: x(2, −3, −2) + y(1, −1, 1) + z(−1, 2, 2) = (8, −11, −3).</li>
<li><strong>The solution</strong> — Chapter 5 found (x, y, z) = (2, 3, −1), and slide 7 verified that this combination does produce (8, −11, −3). One unique solution, as all three pivots predicted.</li>
<li><strong>When is there a solution</strong> — exactly when b is a linear combination of the columns of A. Inconsistency is the geometric statement that b sticks out of the span of those columns.</li>
<li><strong>Link back to the augmented matrix</strong> — [A | b] of Chapter 5 is just A and b written side by side. Gaussian elimination is therefore the method for solving Ax = b, and it will be the method again on slide 15 for finding the inverse.</li>
<li><strong>Homogeneous case</strong> — Ax = 0 always has x = 0, the trivial solution. Chapter 5's structure theorem survives untouched in the new notation.</li>
</ul>
<p class="meo">💡 Once A is invertible (slide 14), Ax = b has the one-line answer x = A inverse times b. That is why the whole second half of this chapter exists: it turns solving a system into evaluating a formula.</p>
<p class="pitfall">⚠️ Writing the unknowns as a <em>row</em> (x, y, z) beside A. Sizes then fail: 1×3 times 3×3 is not the product you want. In Ax = b the vector x must be a column, standing to the right of A.</p>`,
        `<p class="y-chinh">🎯 Mọi hệ tuyến tính gồm m phương trình n ẩn đều nén lại thành một phương trình ma trận duy nhất Ax = b.</p>
<ul>
<li><strong>Ví dụ trên slide</strong> — [2 1 −1; −3 −1 2; −2 1 2] nhân cột (x, y, z) bằng (8, −11, −3). Đây đúng là hệ 2x + y − z = 8, −3x − y + 2z = −11, −2x + y + 2z = −3 của Chương 5.</li>
<li><strong>Ba thành phần</strong> — A là ma trận hệ số cỡ m×n, x là cột ẩn cỡ n×1, và b là cột vế phải cỡ m×1. Các cỡ nối nhau đúng: m×n nhân n×1 cho m×1, khớp với b.</li>
<li><strong>Đọc theo hàng</strong> — hàng i của A nhân vô hướng với x tái tạo chính xác phương trình thứ i. Không thêm và không mất gì, chỉ là các chữ x, y, z đã được đặt ra ngoài.</li>
<li><strong>Đọc theo cột</strong> — theo slide 7, giải Ax = b là đi tìm các trọng số đặt lên những cột của A sao cho dựng được b: x(2, −3, −2) + y(1, −1, 1) + z(−1, 2, 2) = (8, −11, −3).</li>
<li><strong>Nghiệm</strong> — Chương 5 đã tìm ra (x, y, z) = (2, 3, −1), và slide 7 đã kiểm rằng tổ hợp đó thật sự cho ra (8, −11, −3). Một nghiệm duy nhất, đúng như ba pivot đã báo trước.</li>
<li><strong>Khi nào có nghiệm</strong> — đúng khi b là một tổ hợp tuyến tính của các cột của A. Vô nghiệm chính là cách nói hình học rằng b thò ra ngoài không gian sinh bởi những cột đó.</li>
<li><strong>Nối lại với ma trận bổ sung</strong> — [A | b] của Chương 5 chỉ là A và b viết cạnh nhau. Vậy khử Gauss chính là phương pháp giải Ax = b, và nó sẽ lại là phương pháp ở slide 15 để tìm ma trận nghịch đảo.</li>
<li><strong>Trường hợp thuần nhất</strong> — Ax = 0 luôn có x = 0, tức nghiệm tầm thường. Định lý về cấu trúc nghiệm của Chương 5 vẫn nguyên vẹn trong ký hiệu mới.</li>
</ul>
<p class="meo">💡 Khi A khả nghịch (slide 14), hệ Ax = b có đáp án gọn một dòng: x = A nghịch đảo nhân b. Đó là lý do tồn tại của cả nửa sau chương này: nó biến việc giải hệ thành việc thay số vào một công thức.</p>
<p class="pitfall">⚠️ Viết các ẩn thành một <em>hàng</em> (x, y, z) đặt bên cạnh A. Khi đó cỡ hỏng ngay: 1×3 nhân 3×3 không phải tích bạn muốn. Trong Ax = b thì x bắt buộc là cột và đứng bên phải A.</p>`],

      [9, 'Matrix multiplication — the size rule and the formula',
        `<p class="y-chinh">🎯 AB exists only when the number of <strong>columns of A</strong> equals the number of <strong>rows of B</strong>; then A of size m×n times B of size n×p gives AB of size m×p.</p>
<ul>
<li><strong>The formula on the slide</strong> — the entry of AB in row i, column j is the sum over k from 1 to n of a(i,k)·b(k,j). In words: row i of A dotted with column j of B.</li>
<li><strong>The size picture</strong> — write (m×n)(n×p). The two inner numbers must agree and then vanish; the two outer numbers survive as the size of the product. That single line is the whole compatibility rule.</li>
<li><strong>Not "hard", but undefined</strong> — if A is 2×3 and B is 4×2 then AB simply does not exist. There is no partial credit for computing something anyway; the right answer is "not defined".</li>
<li><strong>Order matters for existence alone</strong> — with A of size 2×3 and B of size 3×2, AB is 2×2 while BA is 3×3. Two products, two different sizes, so they cannot possibly be equal.</li>
<li><strong>Counting the work</strong> — each entry of AB costs n multiplications and n − 1 additions, and there are m·p entries. A 3×3 product is 27 multiplications, which is why care matters more than speed.</li>
<li><strong>Column reading of AB</strong> — column j of AB equals A times column j of B. So multiplication is just slide 7 repeated once per column of B, which is the cleanest way to see what is happening.</li>
<li><strong>The role of the identity</strong> — AI = IA = A whenever the sizes allow, so I really is the 1 of this algebra.</li>
<li><strong>Why this strange rule</strong> — it is designed so that applying B then A to a vector equals applying the single matrix AB: A(Bx) = (AB)x. Composition of transformations is the reason for the definition, as slide 13 will demonstrate with rotations.</li>
</ul>
<p class="meo">💡 Before you multiply, write the two sizes down as (m×n)(n×p) and cancel the inner pair. Ten seconds spent there saves the minute you would otherwise spend computing a product that does not exist.</p>
<p class="pitfall">⚠️ Multiplying entrywise like addition — [1 2; 3 4] times [5 0; −1 2] is <em>not</em> [5 0; −3 8]. The other trap is compatibility in one direction: AB may be perfectly legal while BA is undefined, so "AB exists" never implies "BA exists".</p>`,
        `<p class="y-chinh">🎯 AB chỉ tồn tại khi số <strong>cột của A</strong> bằng số <strong>hàng của B</strong>; khi đó A cỡ m×n nhân B cỡ n×p cho AB cỡ m×p.</p>
<ul>
<li><strong>Công thức trên slide</strong> — phần tử của AB ở hàng i cột j là tổng theo k từ 1 tới n của a(i,k)·b(k,j). Nói bằng lời: hàng i của A nhân vô hướng với cột j của B.</li>
<li><strong>Bức tranh về cỡ</strong> — viết (m×n)(n×p). Hai số ở trong phải trùng nhau rồi biến mất; hai số ở ngoài sống sót thành cỡ của tích. Đúng một dòng đó là trọn quy tắc tương thích.</li>
<li><strong>Không phải "khó", mà là không có nghĩa</strong> — nếu A cỡ 2×3 còn B cỡ 4×2 thì AB đơn giản là không tồn tại. Không có điểm an ủi cho việc cứ tính đại ra một thứ gì đó; đáp án đúng là "không xác định".</li>
<li><strong>Thứ tự quyết định cả sự tồn tại</strong> — với A cỡ 2×3 và B cỡ 3×2, AB là 2×2 còn BA là 3×3. Hai tích, hai cỡ khác nhau, nên chúng không thể nào bằng nhau.</li>
<li><strong>Đếm khối lượng tính</strong> — mỗi ô của AB tốn n phép nhân và n − 1 phép cộng, mà có tất cả m·p ô. Một tích 3×3 là 27 phép nhân, nên cẩn thận quan trọng hơn nhanh.</li>
<li><strong>Đọc AB theo cột</strong> — cột j của AB bằng A nhân cột j của B. Vậy phép nhân chỉ là slide 7 lặp lại mỗi cột của B một lần, và đó là cách nhìn sạch nhất để thấy chuyện gì đang diễn ra.</li>
<li><strong>Vai trò của ma trận đơn vị</strong> — AI = IA = A mỗi khi cỡ cho phép, nên I đúng là số 1 của đại số này.</li>
<li><strong>Vì sao lại có quy tắc kỳ cục ấy</strong> — nó được thiết kế để việc áp B rồi áp A lên một vectơ bằng đúng việc áp một ma trận duy nhất AB: A(Bx) = (AB)x. Phép hợp thành các biến đổi mới là lý do của định nghĩa, và slide 13 sẽ minh hoạ bằng phép quay.</li>
</ul>
<p class="meo">💡 Trước khi nhân hãy viết hai cỡ ra thành (m×n)(n×p) rồi khử cặp số ở trong. Mười giây bỏ ra ở đó tiết kiệm nguyên một phút bạn sẽ mất để tính một tích vốn không tồn tại.</p>
<p class="pitfall">⚠️ Nhân theo từng phần tử như phép cộng — [1 2; 3 4] nhân [5 0; −1 2] <em>không</em> phải là [5 0; −3 8]. Bẫy còn lại là tương thích một chiều: AB có thể hợp lệ hoàn toàn trong khi BA không xác định, nên "AB tồn tại" không bao giờ suy ra "BA tồn tại".</p>`],

      [10, 'Worked example — multiplying two matrices step by step',
        `<p class="y-chinh">🎯 With A = [1 2 0; −1 3 4] and B = [2 1; 0 3; −1 2], the product is <strong>AB = [2 7; −6 16]</strong>.</p>
<ul>
<li><strong>Step 1 — check the sizes</strong> — A is 2×3 and B is 3×2. Columns of A = rows of B = 3, so the product exists, and (2×3)(3×2) gives AB of size <strong>2×2</strong>: four entries to compute.</li>
<li><strong>Step 2 — entry (1,1)</strong> — row 1 of A is (1, 2, 0), column 1 of B is (2, 0, −1): 1(2) + 2(0) + 0(−1) = 2 + 0 + 0 = <strong>2</strong>.</li>
<li><strong>Step 3 — entry (1,2)</strong> — row 1 of A with column 2 of B, which is (1, 3, 2): 1(1) + 2(3) + 0(2) = 1 + 6 + 0 = <strong>7</strong>.</li>
<li><strong>Step 4 — entry (2,1)</strong> — row 2 of A is (−1, 3, 4), column 1 of B is (2, 0, −1): (−1)(2) + 3(0) + 4(−1) = −2 + 0 − 4 = <strong>−6</strong>.</li>
<li><strong>Step 5 — entry (2,2)</strong> — row 2 of A with column 2 of B: (−1)(1) + 3(3) + 4(2) = −1 + 9 + 8 = <strong>16</strong>.</li>
<li><strong>Assemble</strong> — placing each number where it belongs gives AB = [2 7; −6 16], and it is 2×2 as predicted in step 1.</li>
<li><strong>Check by columns</strong> — column 1 of AB should equal A times (2, 0, −1) = 2(1, −1) + 0(2, 3) + (−1)(0, 4) = (2, −2) + (0, 0) + (0, −4) = (2, −6) ✓, which matches the first column found above.</li>
<li><strong>What BA would be</strong> — B is 3×2 and A is 2×3, so BA exists too but is 3×3, a completely different object from the 2×2 matrix AB. Concrete proof that order matters.</li>
</ul>
<p class="meo">💡 Point the left index finger along the row and the right index finger down the column, multiplying the pair under your fingertips and adding as you go. Physically tracking both pointers is what stops you from sliding onto the wrong row.</p>
<p class="pitfall">⚠️ Taking a column of A against a row of B — the definition is strictly <em>row of the left matrix</em> with <em>column of the right matrix</em>. And when a row of A contains a 0, still write the term 0(−1) = 0 rather than skipping it; skipped terms are how an entry ends up shifted into the wrong slot.</p>`,
        `<p class="y-chinh">🎯 Với A = [1 2 0; −1 3 4] và B = [2 1; 0 3; −1 2], tích là <strong>AB = [2 7; −6 16]</strong>.</p>
<ul>
<li><strong>Bước 1 — kiểm cỡ</strong> — A là 2×3 và B là 3×2. Số cột của A = số hàng của B = 3, nên tích tồn tại, và (2×3)(3×2) cho AB cỡ <strong>2×2</strong>: phải tính bốn ô.</li>
<li><strong>Bước 2 — ô (1,1)</strong> — hàng 1 của A là (1, 2, 0), cột 1 của B là (2, 0, −1): 1(2) + 2(0) + 0(−1) = 2 + 0 + 0 = <strong>2</strong>.</li>
<li><strong>Bước 3 — ô (1,2)</strong> — hàng 1 của A với cột 2 của B, tức (1, 3, 2): 1(1) + 2(3) + 0(2) = 1 + 6 + 0 = <strong>7</strong>.</li>
<li><strong>Bước 4 — ô (2,1)</strong> — hàng 2 của A là (−1, 3, 4), cột 1 của B là (2, 0, −1): (−1)(2) + 3(0) + 4(−1) = −2 + 0 − 4 = <strong>−6</strong>.</li>
<li><strong>Bước 5 — ô (2,2)</strong> — hàng 2 của A với cột 2 của B: (−1)(1) + 3(3) + 4(2) = −1 + 9 + 8 = <strong>16</strong>.</li>
<li><strong>Ráp lại</strong> — đặt mỗi con số vào đúng chỗ của nó được AB = [2 7; −6 16], và nó cỡ 2×2 đúng như đã dự đoán ở bước 1.</li>
<li><strong>Kiểm lại theo cột</strong> — cột 1 của AB phải bằng A nhân (2, 0, −1) = 2(1, −1) + 0(2, 3) + (−1)(0, 4) = (2, −2) + (0, 0) + (0, −4) = (2, −6) ✓, khớp đúng cột đầu tìm được ở trên.</li>
<li><strong>BA sẽ là gì</strong> — B là 3×2 còn A là 2×3, nên BA cũng tồn tại nhưng cỡ 3×3, một vật hoàn toàn khác so với ma trận 2×2 là AB. Bằng chứng cụ thể rằng thứ tự có ý nghĩa.</li>
</ul>
<p class="meo">💡 Chỉ ngón trỏ trái chạy dọc hàng và ngón trỏ phải chạy dọc cột, nhân cặp số nằm dưới hai đầu ngón rồi cộng dồn. Chính việc bám vật lý hai con trỏ mới giữ cho bạn không trượt sang nhầm hàng.</p>
<p class="pitfall">⚠️ Lấy một cột của A nhân với một hàng của B — định nghĩa nói rõ là <em>hàng của ma trận bên trái</em> nhân <em>cột của ma trận bên phải</em>. Và khi một hàng của A có số 0, vẫn hãy viết số hạng 0(−1) = 0 chứ đừng bỏ qua; những số hạng bị bỏ qua chính là cách một ô bị đẩy lệch sang ô khác.</p>`],

      [11, 'Properties of multiplication — and the one that fails',
        `<p class="y-chinh">🎯 Matrix multiplication is associative and distributive, but it is <strong>not commutative</strong>: in general AB is different from BA.</p>
<ul>
<li><strong>Associative</strong> — (AB)C = A(BC), whenever the sizes allow. You may regroup a long product any way you like, which is what lets A(Bx) be rewritten as (AB)x.</li>
<li><strong>Distributive</strong> — A(B + C) = AB + AC and (A + B)C = AC + BC. Note that <em>both</em> versions are needed, precisely because you cannot move a factor across the product.</li>
<li><strong>Scalars slide freely</strong> — c(AB) = (cA)B = A(cB). Numbers commute with everything even though matrices do not.</li>
<li><strong>Not commutative — the slide's counterexample</strong> — take A = [1 1; 0 1] and B = [1 0; 1 1].</li>
<li><strong>Computing AB</strong> — row 1: 1(1) + 1(1) = 2 and 1(0) + 1(1) = 1; row 2: 0(1) + 1(1) = 1 and 0(0) + 1(1) = 1. So <strong>AB = [2 1; 1 1]</strong>.</li>
<li><strong>Computing BA</strong> — row 1: 1(1) + 0(0) = 1 and 1(1) + 0(1) = 1; row 2: 1(1) + 1(0) = 1 and 1(1) + 1(1) = 2. So <strong>BA = [1 1; 1 2]</strong>. Same two matrices, different products.</li>
<li><strong>A second failure — no zero-divisor law</strong> — [1 0; 0 0] times [0 0; 0 1] = [0 0; 0 0]. A product can be the zero matrix with neither factor zero, which never happens with real numbers.</li>
<li><strong>A third failure — no cancellation</strong> — AB = AC does not imply B = C, unless A happens to be invertible (slide 14). Dividing both sides by a matrix is not a legal move.</li>
<li><strong>When they do commute</strong> — with the identity (AI = IA), with a scalar multiple of the identity, with a matrix's own powers and its inverse (A times A inverse = A inverse times A = I). These are the exceptions, not the rule.</li>
</ul>
<p class="meo">💡 Treat every matrix expression as if the letters were a sequence of instructions carried out in order. You would not put on your shoes before your socks; likewise you may not slide A past B.</p>
<p class="pitfall">⚠️ Expanding (A + B)² as A² + 2AB + B². The truth is A² + AB + BA + B², and AB + BA collapses to 2AB only if A and B commute. The same warning applies to (A + B)(A − B), which is A² − AB + BA − B², not A² − B².</p>`,
        `<p class="y-chinh">🎯 Phép nhân ma trận có tính kết hợp và phân phối, nhưng <strong>không giao hoán</strong>: nói chung AB khác BA.</p>
<ul>
<li><strong>Kết hợp</strong> — (AB)C = A(BC), mỗi khi cỡ cho phép. Bạn được nhóm lại một tích dài theo kiểu nào tuỳ thích, và đó là thứ cho phép viết lại A(Bx) thành (AB)x.</li>
<li><strong>Phân phối</strong> — A(B + C) = AB + AC và (A + B)C = AC + BC. Lưu ý rằng cần <em>cả hai</em> phiên bản, đúng vì bạn không được chuyển một thừa số qua bên kia tích.</li>
<li><strong>Số vô hướng trượt tự do</strong> — c(AB) = (cA)B = A(cB). Các con số giao hoán với mọi thứ dù ma trận thì không.</li>
<li><strong>Không giao hoán — phản ví dụ trên slide</strong> — lấy A = [1 1; 0 1] và B = [1 0; 1 1].</li>
<li><strong>Tính AB</strong> — hàng 1: 1(1) + 1(1) = 2 và 1(0) + 1(1) = 1; hàng 2: 0(1) + 1(1) = 1 và 0(0) + 1(1) = 1. Vậy <strong>AB = [2 1; 1 1]</strong>.</li>
<li><strong>Tính BA</strong> — hàng 1: 1(1) + 0(0) = 1 và 1(1) + 0(1) = 1; hàng 2: 1(1) + 1(0) = 1 và 1(1) + 1(1) = 2. Vậy <strong>BA = [1 1; 1 2]</strong>. Vẫn hai ma trận đó, hai tích khác nhau.</li>
<li><strong>Đổ vỡ thứ hai — không có luật tích bằng 0</strong> — [1 0; 0 0] nhân [0 0; 0 1] = [0 0; 0 0]. Một tích có thể bằng ma trận không mà không thừa số nào bằng 0, điều không bao giờ xảy ra với số thực.</li>
<li><strong>Đổ vỡ thứ ba — không được giản ước</strong> — AB = AC không suy ra B = C, trừ khi A tình cờ khả nghịch (slide 14). Chia hai vế cho một ma trận không phải một nước đi hợp lệ.</li>
<li><strong>Khi nào chúng giao hoán thật</strong> — với ma trận đơn vị (AI = IA), với bội vô hướng của ma trận đơn vị, với chính các luỹ thừa của nó và với nghịch đảo của nó (A nhân A nghịch đảo bằng A nghịch đảo nhân A bằng I). Đó là ngoại lệ chứ không phải quy tắc.</li>
</ul>
<p class="meo">💡 Hãy coi mọi biểu thức ma trận như một dãy thao tác làm theo đúng thứ tự. Bạn không đi giày trước khi đi tất; cũng vậy, bạn không được trượt A qua bên kia B.</p>
<p class="pitfall">⚠️ Khai triển (A + B)² thành A² + 2AB + B². Sự thật là A² + AB + BA + B², và AB + BA chỉ gộp thành 2AB nếu A với B giao hoán. Cảnh báo y hệt áp cho (A + B)(A − B), vốn bằng A² − AB + BA − B² chứ không phải A² − B².</p>`],

      [12, 'Matrix transformations of the plane',
        `<p class="y-chinh">🎯 The map T(x) = Ax sends every point of the plane to a new point, and the four entries of A decide which geometric move it performs.</p>
<ul>
<li><strong>What makes it a transformation</strong> — feed a 2×1 column in, get a 2×1 column out. Because A(x + y) = Ax + Ay and A(cx) = c(Ax), the map is <em>linear</em>: straight lines stay straight and the origin never moves.</li>
<li><strong>Rotation by an angle</strong> — A = [cos θ −sin θ; sin θ cos θ] turns the whole plane counter-clockwise about the origin. Slide 13 works this one out in detail.</li>
<li><strong>Reflection in the x-axis</strong> — A = [1 0; 0 −1] keeps the first coordinate and flips the sign of the second: the point (3, 2) becomes (3, −2). Reflection in the y-axis is [−1 0; 0 1].</li>
<li><strong>Scaling by k</strong> — A = [k 0; 0 k] multiplies every vector by k: (3, 2) becomes (3k, 2k). With k greater than 1 the picture is stretched, with k between 0 and 1 it shrinks, and with k negative it also flips through the origin.</li>
<li><strong>Projection onto the x-axis</strong> — A = [1 0; 0 0] flattens the plane onto the horizontal axis: (3, 2) becomes (3, 0). Information is destroyed here, which will matter on slide 14.</li>
<li><strong>How to read a matrix off the picture</strong> — column 1 of A is the image of (1, 0) and column 2 is the image of (0, 1). Decide where those two basis vectors should go and the matrix writes itself.</li>
<li><strong>Composing transformations</strong> — doing T(B) first and then T(A) is the single transformation with matrix AB. Order matters here for a concrete reason: rotating then reflecting is not the same picture as reflecting then rotating.</li>
<li><strong>A note on projection</strong> — [1 0; 0 0] sends both (3, 2) and (3, 7) to (3, 0). Two different inputs with the same output means the move cannot be undone, which is exactly what "not invertible" will mean.</li>
</ul>
<p class="meo">💡 Forgot a standard matrix? Rebuild it in ten seconds: draw where (1, 0) and (0, 1) go, then write those two images as the columns. That recipe reproduces every row of the table on this slide.</p>
<p class="pitfall">⚠️ Matrix transformations can never move the origin: A·0 = 0 always. A translation such as "shift everything two units right" is therefore <em>not</em> a matrix transformation of this kind, even though it feels like an equally simple geometric move.</p>`,
        `<p class="y-chinh">🎯 Ánh xạ T(x) = Ax đưa mỗi điểm của mặt phẳng tới một điểm mới, và bốn phần tử của A quyết định nó thực hiện phép biến hình nào.</p>
<ul>
<li><strong>Điều gì làm nó thành một biến đổi</strong> — đưa vào một cột 2×1, nhận ra một cột 2×1. Vì A(x + y) = Ax + Ay và A(cx) = c(Ax) nên ánh xạ này <em>tuyến tính</em>: đường thẳng vẫn thẳng và gốc toạ độ không bao giờ dịch chuyển.</li>
<li><strong>Quay một góc</strong> — A = [cos θ −sin θ; sin θ cos θ] xoay cả mặt phẳng ngược chiều kim đồng hồ quanh gốc. Slide 13 sẽ tính kỹ trường hợp này.</li>
<li><strong>Đối xứng qua trục Ox</strong> — A = [1 0; 0 −1] giữ nguyên toạ độ thứ nhất và đổi dấu toạ độ thứ hai: điểm (3, 2) thành (3, −2). Đối xứng qua trục Oy là [−1 0; 0 1].</li>
<li><strong>Co giãn hệ số k</strong> — A = [k 0; 0 k] nhân mọi vectơ với k: (3, 2) thành (3k, 2k). Với k lớn hơn 1 thì hình giãn ra, với k nằm giữa 0 và 1 thì co lại, còn k âm thì hình còn bị lật qua gốc toạ độ.</li>
<li><strong>Chiếu lên trục Ox</strong> — A = [1 0; 0 0] ép cả mặt phẳng xuống trục ngang: (3, 2) thành (3, 0). Ở đây thông tin bị phá huỷ, và điều đó sẽ có ý nghĩa ở slide 14.</li>
<li><strong>Cách đọc ma trận ra từ hình vẽ</strong> — cột 1 của A là ảnh của (1, 0) và cột 2 là ảnh của (0, 1). Cứ quyết định hai vectơ cơ sở ấy phải đi đâu là ma trận tự viết ra.</li>
<li><strong>Hợp thành các biến đổi</strong> — làm T(B) trước rồi T(A) sau chính là một biến đổi duy nhất với ma trận AB. Thứ tự có ý nghĩa ở đây vì một lý do rất cụ thể: quay rồi lấy đối xứng không cho ra cùng bức hình với lấy đối xứng rồi quay.</li>
<li><strong>Một lưu ý về phép chiếu</strong> — [1 0; 0 0] đưa cả (3, 2) lẫn (3, 7) về (3, 0). Hai đầu vào khác nhau cho cùng một đầu ra nghĩa là phép biến đổi này không hoàn tác được, và đó đúng là điều mà "không khả nghịch" sẽ nói tới.</li>
</ul>
<p class="meo">💡 Quên mất một ma trận chuẩn? Dựng lại nó trong mười giây: vẽ xem (1, 0) và (0, 1) đi đâu, rồi viết hai ảnh đó thành hai cột. Công thức ấy tái tạo được mọi dòng trong bảng ở slide này.</p>
<p class="pitfall">⚠️ Biến đổi ma trận không bao giờ dịch được gốc toạ độ: luôn có A·0 = 0. Vậy một phép tịnh tiến kiểu "dời mọi thứ sang phải hai đơn vị" <em>không</em> phải biến đổi ma trận loại này, dù cảm giác nó cũng là một phép biến hình đơn giản y như vậy.</p>`],

      [13, 'Rotation example — the 90 degree case',
        `<p class="y-chinh">🎯 The rotation matrix is R(θ) = [cos θ −sin θ; sin θ cos θ]; at θ = 90 degrees it becomes [0 −1; 1 0] and sends (1, 0) to (0, 1).</p>
<ul>
<li><strong>Step 1 — evaluate the trigonometry</strong> — cos 90 = 0 and sin 90 = 1, so R(90) = [0 −1; 1 0]. Every entry of the general formula is now a concrete number.</li>
<li><strong>Step 2 — apply it to (1, 0)</strong> — first entry: 0(1) + (−1)(0) = 0; second entry: 1(1) + 0(0) = 1. Result <strong>(0, 1)</strong>.</li>
<li><strong>Step 3 — check against geometry</strong> — the point (1, 0) sits one unit along the positive x-axis; rotating it a quarter turn counter-clockwise should land it one unit up the positive y-axis, at (0, 1). The algebra agrees exactly.</li>
<li><strong>A second check</strong> — apply R(90) to (0, 1): first entry 0(0) + (−1)(1) = −1, second entry 1(0) + 0(1) = 0, giving (−1, 0). The y-axis unit vector swings onto the negative x-axis, again just as the picture demands.</li>
<li><strong>Reading it by columns</strong> — column 1 of R(90) is (0, 1), the image of (1, 0); column 2 is (−1, 0), the image of (0, 1). The matrix is literally a record of where the two basis vectors land.</li>
<li><strong>Composing rotations</strong> — R(90)·R(90) = [0 −1; 1 0]² = [−1 0; 0 −1], which is R(180). Two quarter turns make a half turn, and the matrix arithmetic reproduces it: the angles add.</li>
<li><strong>Other useful angles</strong> — at θ = 45 degrees, cos and sin are both about 0.7071, so R(45) sends (1, 0) to roughly (0.7071, 0.7071), a point on the line y = x at distance 1 from the origin.</li>
<li><strong>Rotation never changes length</strong> — the columns of R(θ) each have length 1 and are perpendicular, so distances and angles survive untouched. That is exactly what "rotation" should mean.</li>
<li><strong>Undoing a rotation</strong> — rotating by −θ undoes it, and R(−θ) is the transpose of R(θ). So for rotations the inverse is just the transpose, the cheapest inverse in the whole chapter.</li>
</ul>
<p class="meo">💡 To recall the sign pattern, test the matrix on (1, 0): with [cos θ −sin θ; sin θ cos θ] you get (cos θ, sin θ), the correct point on the unit circle. Put the minus sign in the wrong corner and you rotate clockwise instead.</p>
<p class="pitfall">⚠️ Two common slips: placing the minus on sin θ in the bottom-left instead of the top-right, which rotates the wrong way; and feeding the calculator degrees when it is in radian mode, so cos 90 comes out as −0.448 instead of 0.</p>`,
        `<p class="y-chinh">🎯 Ma trận quay là R(θ) = [cos θ −sin θ; sin θ cos θ]; ở θ = 90 độ nó thành [0 −1; 1 0] và đưa (1, 0) tới (0, 1).</p>
<ul>
<li><strong>Bước 1 — tính lượng giác</strong> — cos 90 = 0 và sin 90 = 1, nên R(90) = [0 −1; 1 0]. Mọi phần tử của công thức tổng quát giờ đã thành số cụ thể.</li>
<li><strong>Bước 2 — áp lên (1, 0)</strong> — phần tử thứ nhất: 0(1) + (−1)(0) = 0; phần tử thứ hai: 1(1) + 0(0) = 1. Kết quả <strong>(0, 1)</strong>.</li>
<li><strong>Bước 3 — đối chiếu với hình học</strong> — điểm (1, 0) nằm cách gốc một đơn vị trên nửa dương trục Ox; quay nó một phần tư vòng ngược chiều kim đồng hồ thì phải đáp xuống điểm cách gốc một đơn vị trên nửa dương trục Oy, tức (0, 1). Đại số khớp chính xác.</li>
<li><strong>Một phép kiểm thứ hai</strong> — áp R(90) lên (0, 1): phần tử đầu 0(0) + (−1)(1) = −1, phần tử sau 1(0) + 0(1) = 0, cho ra (−1, 0). Vectơ đơn vị của trục Oy quét sang nửa âm trục Ox, lại đúng như hình vẽ đòi hỏi.</li>
<li><strong>Đọc theo cột</strong> — cột 1 của R(90) là (0, 1), tức ảnh của (1, 0); cột 2 là (−1, 0), tức ảnh của (0, 1). Ma trận theo nghĩa đen là bản ghi chép xem hai vectơ cơ sở đáp xuống đâu.</li>
<li><strong>Hợp thành hai phép quay</strong> — R(90)·R(90) = [0 −1; 1 0]² = [−1 0; 0 −1], chính là R(180). Hai phần tư vòng thành nửa vòng, và số học ma trận tái tạo đúng điều đó: các góc cộng lại.</li>
<li><strong>Vài góc hữu dụng khác</strong> — ở θ = 45 độ, cos và sin đều xấp xỉ 0,7071, nên R(45) đưa (1, 0) tới khoảng (0,7071; 0,7071), một điểm nằm trên đường y = x và cách gốc đúng 1 đơn vị.</li>
<li><strong>Phép quay không đổi độ dài</strong> — hai cột của R(θ) đều có độ dài 1 và vuông góc nhau, nên khoảng cách và góc đều nguyên vẹn. Đó đúng là điều mà chữ "quay" phải có nghĩa.</li>
<li><strong>Hoàn tác một phép quay</strong> — quay góc −θ là hoàn tác, và R(−θ) chính là chuyển vị của R(θ). Vậy với phép quay thì nghịch đảo chỉ là chuyển vị, nghịch đảo rẻ nhất trong cả chương.</li>
</ul>
<p class="meo">💡 Muốn nhớ dấu nằm ở đâu, hãy thử ma trận lên (1, 0): với [cos θ −sin θ; sin θ cos θ] bạn nhận được (cos θ, sin θ), đúng điểm cần có trên đường tròn đơn vị. Đặt dấu trừ sai góc là quay ngược lại theo chiều kim đồng hồ.</p>
<p class="pitfall">⚠️ Hai lỗi hay gặp: đặt dấu trừ vào sin θ ở góc dưới trái thay vì góc trên phải, làm phép quay đi sai chiều; và bấm máy tính theo độ trong khi máy đang ở chế độ radian, khiến cos 90 ra −0,448 thay vì 0.</p>`],

      [14, 'The inverse matrix',
        `<p class="y-chinh">🎯 For a square matrix A, the inverse is the matrix A(−1) with A·A(−1) = A(−1)·A = I; it exists exactly when det(A) is not zero.</p>
<ul>
<li><strong>The definition</strong> — both products must give the identity, and both must be I of the same size n×n. A matrix satisfying this is called <strong>invertible</strong> (or non-singular).</li>
<li><strong>Square is compulsory</strong> — if A were m×n with m different from n, then A·A(−1) and A(−1)·A would be identities of two different sizes. The definition cannot even be stated, so only square matrices are candidates.</li>
<li><strong>Square is not enough</strong> — A is invertible precisely when det(A) is not 0. When det(A) = 0 the matrix is called <strong>singular</strong> and has no inverse whatsoever.</li>
<li><strong>A concrete singular matrix</strong> — A = [1 2; 2 4] has det = 1(4) − 2(2) = 4 − 4 = 0. Its second row is twice the first, so it collapses the plane onto a line, and nothing can unfold a line back into a plane.</li>
<li><strong>A concrete invertible matrix</strong> — A = [2 1; 1 1] has det = 2(1) − 1(1) = 1, not 0, so A(−1) exists. Slide 15 builds it by Gauss-Jordan and slide 16 by formula; both give [1 −1; −1 2].</li>
<li><strong>Verifying an inverse</strong> — multiply and look for I: [2 1; 1 1]·[1 −1; −1 2] = [2(1)+1(−1), 2(−1)+1(2); 1(1)+1(−1), 1(−1)+1(2)] = [1 0; 0 1] ✓.</li>
<li><strong>Why we want it — solving systems</strong> — from Ax = b, multiply on the left by A(−1) to get x = A(−1)b. With A = [2 1; 1 1] and b = (3, 2): x = [1 −1; −1 2]·(3, 2) = (3 − 2, −3 + 4) = <strong>(1, 1)</strong>. Check: 2(1) + 1 = 3 ✓ and 1 + 1 = 2 ✓.</li>
<li><strong>Uniqueness</strong> — a matrix has at most one inverse. If B and C both worked, then B = BI = B(AC) = (BA)C = IC = C, so they are the same matrix.</li>
<li><strong>Geometric reading</strong> — invertible means the transformation of slide 12 can be undone. Rotation and reflection are invertible; projection [1 0; 0 0] is not, because it throws information away.</li>
</ul>
<p class="meo">💡 For a 2×2 matrix, compute ad − bc before anything else. One subtraction tells you whether an inverse exists at all, and it saves you from grinding through an elimination that was doomed from the start.</p>
<p class="pitfall">⚠️ Writing a matrix "division" such as B/A, or A(−1) as 1/A. Neither notation exists; write A(−1)B or BA(−1) and keep the side straight, because they differ. And note that A(−1) is <em>not</em> obtained by inverting each entry: the inverse of [2 1; 1 1] is [1 −1; −1 2], nowhere near [1/2 1; 1 1].</p>`,
        `<p class="y-chinh">🎯 Với ma trận vuông A, nghịch đảo là ma trận A(−1) thoả A·A(−1) = A(−1)·A = I; nó tồn tại đúng khi det(A) khác 0.</p>
<ul>
<li><strong>Định nghĩa</strong> — cả hai tích đều phải cho ra ma trận đơn vị, và cả hai đều phải là I cùng cỡ n×n. Ma trận thoả điều này gọi là <strong>khả nghịch</strong> (không suy biến).</li>
<li><strong>Vuông là bắt buộc</strong> — nếu A là m×n với m khác n thì A·A(−1) và A(−1)·A sẽ là hai ma trận đơn vị khác cỡ nhau. Định nghĩa thậm chí không phát biểu được, nên chỉ ma trận vuông mới là ứng viên.</li>
<li><strong>Vuông thôi thì chưa đủ</strong> — A khả nghịch đúng khi det(A) khác 0. Khi det(A) = 0 thì ma trận gọi là <strong>suy biến</strong> và hoàn toàn không có nghịch đảo.</li>
<li><strong>Một ma trận suy biến cụ thể</strong> — A = [1 2; 2 4] có det = 1(4) − 2(2) = 4 − 4 = 0. Hàng hai gấp đôi hàng một, nên nó ép cả mặt phẳng xuống một đường thẳng, mà không gì mở lại được một đường thẳng thành mặt phẳng.</li>
<li><strong>Một ma trận khả nghịch cụ thể</strong> — A = [2 1; 1 1] có det = 2(1) − 1(1) = 1, khác 0, nên A(−1) tồn tại. Slide 15 dựng nó bằng Gauss-Jordan còn slide 16 bằng công thức; cả hai đều cho [1 −1; −1 2].</li>
<li><strong>Kiểm một nghịch đảo</strong> — nhân ra rồi nhìn xem có phải I không: [2 1; 1 1]·[1 −1; −1 2] = [2(1)+1(−1), 2(−1)+1(2); 1(1)+1(−1), 1(−1)+1(2)] = [1 0; 0 1] ✓.</li>
<li><strong>Vì sao cần nó — để giải hệ</strong> — từ Ax = b, nhân bên trái với A(−1) được x = A(−1)b. Với A = [2 1; 1 1] và b = (3, 2): x = [1 −1; −1 2]·(3, 2) = (3 − 2, −3 + 4) = <strong>(1, 1)</strong>. Kiểm lại: 2(1) + 1 = 3 ✓ và 1 + 1 = 2 ✓.</li>
<li><strong>Tính duy nhất</strong> — một ma trận có nhiều nhất một nghịch đảo. Nếu cả B lẫn C đều thoả thì B = BI = B(AC) = (BA)C = IC = C, vậy chúng là cùng một ma trận.</li>
<li><strong>Đọc theo hình học</strong> — khả nghịch nghĩa là phép biến đổi ở slide 12 hoàn tác được. Quay và đối xứng thì khả nghịch; phép chiếu [1 0; 0 0] thì không, vì nó vứt bỏ thông tin.</li>
</ul>
<p class="meo">💡 Với ma trận 2×2, hãy tính ad − bc trước mọi thứ khác. Một phép trừ cho biết có nghịch đảo hay không, và nó cứu bạn khỏi việc cày nguyên một bài khử vốn đã thất bại ngay từ đầu.</p>
<p class="pitfall">⚠️ Viết "phép chia" ma trận kiểu B/A, hay viết A(−1) thành 1/A. Cả hai ký hiệu đều không tồn tại; hãy viết A(−1)B hoặc BA(−1) và giữ đúng bên, vì chúng khác nhau. Và lưu ý A(−1) <em>không</em> phải là lấy nghịch đảo từng phần tử: nghịch đảo của [2 1; 1 1] là [1 −1; −1 2], chẳng liên quan gì tới [1/2 1; 1 1].</p>`],

      [15, 'Gauss-Jordan for the inverse — worked in full',
        `<p class="y-chinh">🎯 Glue A to the identity, row-reduce until the left half becomes I, and the right half is A(−1): [A | I] reduces to [I | A(−1)].</p>
<ul>
<li><strong>Setup</strong> — take A = [2 1; 1 1] from the slide and write the 2×4 block <strong>[A | I] = [2 1 | 1 0; 1 1 | 0 1]</strong>. From here only the row operations of Chapter 5 are used.</li>
<li><strong>Step 1 — swap R1 and R2</strong> — putting the leading 1 on top avoids fractions: <strong>[1 1 | 0 1; 2 1 | 1 0]</strong>.</li>
<li><strong>Step 2 — R2 becomes R2 − 2R1</strong> — entrywise: 2 − 2(1) = 0, 1 − 2(1) = −1, 1 − 2(0) = 1, 0 − 2(1) = −2, giving <strong>[1 1 | 0 1; 0 −1 | 1 −2]</strong>. The left half is now upper triangular.</li>
<li><strong>Step 3 — R2 becomes −R2</strong> — this turns the pivot into 1: <strong>[1 1 | 0 1; 0 1 | −1 2]</strong>.</li>
<li><strong>Step 4 — R1 becomes R1 − R2</strong> — clearing above the second pivot: 1 − 1 = 0 in the left half, and 0 − (−1) = 1, 1 − 2 = −1 on the right, giving <strong>[1 0 | 1 −1; 0 1 | −1 2]</strong>.</li>
<li><strong>Step 5 — read the answer</strong> — the left half is I, so the right half is the inverse: <strong>A(−1) = [1 −1; −1 2]</strong>.</li>
<li><strong>Verify, always</strong> — [2 1; 1 1]·[1 −1; −1 2] = [1 0; 0 1] ✓. Two minutes of elimination deserve fifteen seconds of checking.</li>
<li><strong>What happens for a singular matrix</strong> — try A = [1 2; 2 4]: R2 becomes R2 − 2R1 gives [1 2 | 1 0; 0 0 | −2 1]. A zero row appears in the left half, so it can never become I. That is the algorithm's own way of announcing det = 0, with no determinant computed.</li>
<li><strong>Why the method works</strong> — each row operation is multiplication on the left by an elementary matrix E. Reducing A to I means E(k)···E(1)A = I, so the same sequence applied to I produces exactly that product, which is A(−1).</li>
<li><strong>Scale</strong> — this is the practical method for 3×3 and larger, where the adjugate-style formulas become unusable. Work on the full augmented block and never on the halves separately.</li>
</ul>
<p class="meo">💡 Apply every operation across the <strong>whole</strong> row, all four entries at once. The most common failure in this algorithm is reducing the left half correctly while forgetting to carry one of the operations into the right half.</p>
<p class="pitfall">⚠️ Stopping at row echelon form. [1 1 | 0 1; 0 1 | −1 2] has a triangular left half but it is not I, and reading [0 1; −1 2] as the inverse is wrong. You must continue until the left half is exactly the identity — Gauss-<em>Jordan</em>, not Gauss.</p>`,
        `<p class="y-chinh">🎯 Ghép A với ma trận đơn vị, khử hàng tới khi nửa trái thành I, và nửa phải chính là A(−1): [A | I] rút gọn về [I | A(−1)].</p>
<ul>
<li><strong>Chuẩn bị</strong> — lấy A = [2 1; 1 1] trên slide và viết khối 2×4 <strong>[A | I] = [2 1 | 1 0; 1 1 | 0 1]</strong>. Từ đây chỉ dùng đúng các phép biến đổi hàng của Chương 5.</li>
<li><strong>Bước 1 — đổi chỗ R1 với R2</strong> — đưa hàng có số 1 dẫn đầu lên trên để tránh phân số: <strong>[1 1 | 0 1; 2 1 | 1 0]</strong>.</li>
<li><strong>Bước 2 — R2 thành R2 − 2R1</strong> — từng ô một: 2 − 2(1) = 0, 1 − 2(1) = −1, 1 − 2(0) = 1, 0 − 2(1) = −2, cho <strong>[1 1 | 0 1; 0 −1 | 1 −2]</strong>. Nửa trái giờ đã là tam giác trên.</li>
<li><strong>Bước 3 — R2 thành −R2</strong> — việc này biến pivot thành 1: <strong>[1 1 | 0 1; 0 1 | −1 2]</strong>.</li>
<li><strong>Bước 4 — R1 thành R1 − R2</strong> — dọn phía trên pivot thứ hai: 1 − 1 = 0 ở nửa trái, và 0 − (−1) = 1, 1 − 2 = −1 ở nửa phải, cho <strong>[1 0 | 1 −1; 0 1 | −1 2]</strong>.</li>
<li><strong>Bước 5 — đọc đáp án</strong> — nửa trái đã là I, nên nửa phải chính là nghịch đảo: <strong>A(−1) = [1 −1; −1 2]</strong>.</li>
<li><strong>Luôn luôn kiểm lại</strong> — [2 1; 1 1]·[1 −1; −1 2] = [1 0; 0 1] ✓. Hai phút khử xứng đáng được mười lăm giây soát lại.</li>
<li><strong>Chuyện gì xảy ra với ma trận suy biến</strong> — thử A = [1 2; 2 4]: R2 thành R2 − 2R1 cho [1 2 | 1 0; 0 0 | −2 1]. Một hàng 0 hiện ra ở nửa trái, nên nó không bao giờ thành I được. Đó là cách bản thân thuật toán báo det = 0, chẳng cần tính định thức nào.</li>
<li><strong>Vì sao phương pháp này chạy được</strong> — mỗi phép biến đổi hàng là một phép nhân bên trái với một ma trận sơ cấp E. Rút gọn A về I nghĩa là E(k)···E(1)A = I, nên đúng dãy phép đó áp lên I sẽ tạo ra chính cái tích ấy, tức A(−1).</li>
<li><strong>Về quy mô</strong> — đây là phương pháp thực dụng cho ma trận 3×3 trở lên, nơi các công thức kiểu ma trận phụ hợp trở nên không dùng nổi. Hãy làm việc trên trọn khối ghép chứ đừng tách riêng hai nửa.</li>
</ul>
<p class="meo">💡 Áp mỗi phép biến đổi lên <strong>trọn</strong> hàng, cả bốn ô cùng lúc. Kiểu hỏng phổ biến nhất của thuật toán này là rút gọn nửa trái rất đúng nhưng quên mang một phép biến đổi sang nửa phải.</p>
<p class="pitfall">⚠️ Dừng lại ở dạng bậc thang. [1 1 | 0 1; 0 1 | −1 2] có nửa trái tam giác nhưng nó chưa phải I, và đọc [0 1; −1 2] thành nghịch đảo là sai. Phải đi tiếp tới khi nửa trái đúng bằng ma trận đơn vị — Gauss-<em>Jordan</em> chứ không phải Gauss.</p>`],

      [16, 'Shortcut for 2x2 matrices',
        `<p class="y-chinh">🎯 For A = [a b; c d] with ad − bc not zero, A(−1) = 1/(ad − bc) times [d −b; −c a].</p>
<ul>
<li><strong>The recipe in three moves</strong> — swap a and d, change the signs of b and c, then divide everything by the determinant ad − bc. Nothing else moves.</li>
<li><strong>The determinant first</strong> — compute ad − bc before applying the recipe. If it is 0 there is no inverse, and the formula would be asking you to divide by zero.</li>
<li><strong>Worked example</strong> — A = [4 7; 2 6]. Determinant: 4(6) − 7(2) = 24 − 14 = <strong>10</strong>, not 0, so the inverse exists.</li>
<li><strong>Apply the recipe</strong> — swap 4 and 6 to get [6 7; 2 4], negate b and c to get [6 −7; −2 4], divide by 10: <strong>A(−1) = [0.6 −0.7; −0.2 0.4]</strong>.</li>
<li><strong>Verify</strong> — [4 7; 2 6]·[0.6 −0.7; −0.2 0.4]: entry (1,1) is 4(0.6) + 7(−0.2) = 2.4 − 1.4 = 1; entry (1,2) is 4(−0.7) + 7(0.4) = −2.8 + 2.8 = 0; entry (2,1) is 2(0.6) + 6(−0.2) = 1.2 − 1.2 = 0; entry (2,2) is 2(−0.7) + 6(0.4) = −1.4 + 2.4 = 1. The product is I ✓.</li>
<li><strong>Agreement with slide 15</strong> — for A = [2 1; 1 1] the determinant is 2(1) − 1(1) = 1, and the recipe gives (1/1)[1 −1; −1 2] = [1 −1; −1 2], exactly what Gauss-Jordan produced. Two methods, one answer.</li>
<li><strong>Product rule</strong> — (AB)(−1) = B(−1)A(−1): the order <strong>reverses</strong>, just as it did for transposes on slide 5. Proof in one line: (AB)(B(−1)A(−1)) = A(BB(−1))A(−1) = AIA(−1) = I.</li>
<li><strong>Other identities</strong> — (A(−1))(−1) = A, (cA)(−1) = (1/c)A(−1) for c not 0, and (A(T))(−1) = (A(−1))(T).</li>
<li><strong>When to use which method</strong> — the formula for 2×2 only; from 3×3 upward, Gauss-Jordan on [A | I] from slide 15 is faster and far less error-prone.</li>
</ul>
<p class="meo">💡 The formula is worth memorising as a picture: the main diagonal <em>swaps</em>, the anti-diagonal <em>changes sign</em>, and the whole thing is divided by ad − bc. Three words, and it never leaves you.</p>
<p class="pitfall">⚠️ Changing the sign of a and d instead of b and c, and forgetting to divide by the determinant at all. Both errors survive the eye test and are only caught by multiplying A by your answer and demanding I. Also remember (AB)(−1) is not A(−1)B(−1).</p>`,
        `<p class="y-chinh">🎯 Với A = [a b; c d] và ad − bc khác 0 thì A(−1) = 1/(ad − bc) nhân [d −b; −c a].</p>
<ul>
<li><strong>Công thức gồm ba thao tác</strong> — đổi chỗ a với d, đổi dấu b và c, rồi chia tất cả cho định thức ad − bc. Không có gì khác bị động tới.</li>
<li><strong>Tính định thức trước</strong> — hãy tính ad − bc trước khi áp công thức. Nếu nó bằng 0 thì không có nghịch đảo, và công thức đang bảo bạn chia cho 0.</li>
<li><strong>Ví dụ có giải</strong> — A = [4 7; 2 6]. Định thức: 4(6) − 7(2) = 24 − 14 = <strong>10</strong>, khác 0, nên nghịch đảo tồn tại.</li>
<li><strong>Áp công thức</strong> — đổi chỗ 4 với 6 được [6 7; 2 4], đổi dấu b và c được [6 −7; −2 4], chia cho 10: <strong>A(−1) = [0,6 −0,7; −0,2 0,4]</strong>.</li>
<li><strong>Kiểm lại</strong> — [4 7; 2 6]·[0,6 −0,7; −0,2 0,4]: ô (1,1) là 4(0,6) + 7(−0,2) = 2,4 − 1,4 = 1; ô (1,2) là 4(−0,7) + 7(0,4) = −2,8 + 2,8 = 0; ô (2,1) là 2(0,6) + 6(−0,2) = 1,2 − 1,2 = 0; ô (2,2) là 2(−0,7) + 6(0,4) = −1,4 + 2,4 = 1. Tích bằng I ✓.</li>
<li><strong>Khớp với slide 15</strong> — với A = [2 1; 1 1] thì định thức là 2(1) − 1(1) = 1, và công thức cho (1/1)[1 −1; −1 2] = [1 −1; −1 2], đúng thứ mà Gauss-Jordan đã tạo ra. Hai phương pháp, một đáp án.</li>
<li><strong>Quy tắc với tích</strong> — (AB)(−1) = B(−1)A(−1): thứ tự <strong>đảo ngược</strong>, y như với chuyển vị ở slide 5. Chứng minh gọn một dòng: (AB)(B(−1)A(−1)) = A(BB(−1))A(−1) = AIA(−1) = I.</li>
<li><strong>Vài đẳng thức khác</strong> — (A(−1))(−1) = A, (cA)(−1) = (1/c)A(−1) với c khác 0, và (A(T))(−1) = (A(−1))(T).</li>
<li><strong>Khi nào dùng cách nào</strong> — công thức chỉ dành cho 2×2; từ 3×3 trở lên thì Gauss-Jordan trên [A | I] ở slide 15 nhanh hơn và ít sai hơn nhiều.</li>
</ul>
<p class="meo">💡 Nên nhớ công thức dưới dạng một bức hình: đường chéo chính <em>đổi chỗ</em>, đường chéo phụ <em>đổi dấu</em>, rồi cả cụm chia cho ad − bc. Ba từ, và nó sẽ không bao giờ rời bỏ bạn.</p>
<p class="pitfall">⚠️ Đổi dấu a và d thay vì b và c, và quên hẳn việc chia cho định thức. Cả hai lỗi đều lọt qua được phép nhìn bằng mắt, chỉ bị bắt khi nhân A với đáp án của bạn và đòi cho ra I. Cũng nhớ rằng (AB)(−1) không phải A(−1)B(−1).</p>`],

      [17, 'Summary — five things to carry out of Chapter 6',
        `<p class="y-chinh">🎯 Five statements. If you can say all five without notes, Chapter 6 is done.</p>
<ol>
<li><strong>A matrix is an m×n table, and the easy operations are entrywise</strong> — addition needs identical sizes and adds corresponding entries, [1 2; 3 4] + [5 0; −1 2] = [6 2; 2 6]; a scalar multiplies every entry, 2[1 2; 3 4] = [2 4; 6 8]; the transpose swaps rows with columns, [1 2 3; 4 5 6] transposed is [1 4; 2 5; 3 6], and (AB)(T) = B(T)A(T) reverses the order.</li>
<li><strong>Ax is a combination of the columns of A</strong> — so a linear system becomes the single equation Ax = b: [2 1 −1; −3 −1 2; −2 1 2](x, y, z) = (8, −11, −3), with solution (2, 3, −1).</li>
<li><strong>AB needs columns of A to equal rows of B</strong> — then (m×n)(n×p) gives m×p, and entry (i,j) is row i of A dotted with column j of B: [1 2 0; −1 3 4]·[2 1; 0 3; −1 2] = [2 7; −6 16]. Multiplication is associative and distributive but <strong>not commutative</strong>: [1 1; 0 1][1 0; 1 1] = [2 1; 1 1] while [1 0; 1 1][1 1; 0 1] = [1 1; 1 2].</li>
<li><strong>T(x) = Ax is a geometric move of the plane</strong> — rotation [cos θ −sin θ; sin θ cos θ], reflection [1 0; 0 −1], scaling [k 0; 0 k], projection [1 0; 0 0]; the columns of A are the images of (1, 0) and (0, 1), and at 90 degrees the rotation matrix [0 −1; 1 0] sends (1, 0) to (0, 1).</li>
<li><strong>A(−1) exists only for square A with det(A) not zero</strong> — find it by Gauss-Jordan, [A | I] reducing to [I | A(−1)], which turned [2 1; 1 1] into [1 −1; −1 2]; for 2×2 use 1/(ad − bc) times [d −b; −c a]; and (AB)(−1) = B(−1)A(−1).</li>
</ol>
<p class="meo">💡 One workflow for any matrix question: write the sizes → check the operation is even defined → compute row-by-column → verify with a second route (columns, or a product against I). Sizes first, arithmetic second, check third.</p>
<p class="pitfall">⚠️ The marks lost most often in this chapter: assuming AB = BA; multiplying matrices entrywise the way you add them; forgetting that (AB)(T) and (AB)(−1) both reverse the order; and trying to invert a matrix that is not square or whose determinant is 0.</p>`,
        `<p class="y-chinh">🎯 Năm câu. Nói được cả năm câu mà không cần nhìn tài liệu là xong Chương 6.</p>
<ol>
<li><strong>Ma trận là bảng m×n, và các phép dễ đều theo từng phần tử</strong> — phép cộng đòi hai ma trận cùng cỡ và cộng các ô tương ứng, [1 2; 3 4] + [5 0; −1 2] = [6 2; 2 6]; nhân vô hướng nhân mọi ô, 2[1 2; 3 4] = [2 4; 6 8]; chuyển vị đổi hàng thành cột, [1 2 3; 4 5 6] chuyển vị thành [1 4; 2 5; 3 6], và (AB)(T) = B(T)A(T) đảo ngược thứ tự.</li>
<li><strong>Ax là tổ hợp các cột của A</strong> — nên một hệ tuyến tính trở thành đúng một phương trình Ax = b: [2 1 −1; −3 −1 2; −2 1 2](x, y, z) = (8, −11, −3), với nghiệm (2, 3, −1).</li>
<li><strong>AB đòi số cột của A bằng số hàng của B</strong> — khi đó (m×n)(n×p) cho m×p, và ô (i,j) là hàng i của A nhân vô hướng cột j của B: [1 2 0; −1 3 4]·[2 1; 0 3; −1 2] = [2 7; −6 16]. Phép nhân có tính kết hợp và phân phối nhưng <strong>không giao hoán</strong>: [1 1; 0 1][1 0; 1 1] = [2 1; 1 1] còn [1 0; 1 1][1 1; 0 1] = [1 1; 1 2].</li>
<li><strong>T(x) = Ax là một phép biến hình của mặt phẳng</strong> — quay [cos θ −sin θ; sin θ cos θ], đối xứng [1 0; 0 −1], co giãn [k 0; 0 k], chiếu [1 0; 0 0]; các cột của A chính là ảnh của (1, 0) và (0, 1), và ở góc 90 độ ma trận quay [0 −1; 1 0] đưa (1, 0) tới (0, 1).</li>
<li><strong>A(−1) chỉ tồn tại khi A vuông và det(A) khác 0</strong> — tìm nó bằng Gauss-Jordan, [A | I] rút gọn về [I | A(−1)], cách đã biến [2 1; 1 1] thành [1 −1; −1 2]; với 2×2 thì dùng 1/(ad − bc) nhân [d −b; −c a]; và (AB)(−1) = B(−1)A(−1).</li>
</ol>
<p class="meo">💡 Một quy trình cho mọi câu hỏi về ma trận: ghi cỡ ra → kiểm xem phép toán có nghĩa hay không → tính theo hàng nhân cột → kiểm lại bằng con đường thứ hai (theo cột, hoặc nhân thử để ra I). Cỡ trước, tính sau, kiểm sau cùng.</p>
<p class="pitfall">⚠️ Những điểm mất nhiều nhất ở chương này: mặc định AB = BA; nhân ma trận theo từng phần tử y như khi cộng; quên rằng (AB)(T) và (AB)(−1) đều đảo ngược thứ tự; và cố nghịch đảo một ma trận không vuông hoặc có định thức bằng 0.</p>`],
    ]),
  ].join('\n'),
};
