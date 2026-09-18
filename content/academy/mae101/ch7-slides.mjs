/**
 * MAE101 · Chương 7 — Determinants & Eigenvalues (Định thức, Nghịch đảo & Trị riêng), học theo từng slide.
 * Deck 'mae7' (MAE7), 17 slide, render sẵn lên CDN images/academy/MAE101/v1/mae7/NNN.webp.
 * Nội dung bám scripts/slides-src/mae101-ch7.mjs + Nicholson "Linear Algebra with Applications" ch.3 & 5.
 *
 * MỌI phép tính trong phần giảng đều đã kiểm tay VÀ kiểm lại bằng máy:
 *   slide 6  — A = [1 2 3; 0 4 5; 1 0 6]: C11 = 24, C12 = 5, C13 = −4 ⇒ det A = 1(24)+2(5)+3(−4) = 22
 *   slide 7  — Sarrus trên đúng A đó: (24 + 10 + 0) − (12 + 0 + 0) = 22 (khớp cofactor)
 *   slide 10 — A = [1 2 3; 2 5 3; 1 0 8]: R2−2R1, R3−R1, R3+2R2 → tam giác [1 2 3; 0 1 −3; 0 0 −1] ⇒ det = −1
 *   slide 12 — A = [1 2 3; 0 1 4; 5 6 0]: det A = 1; cofactor = [−24 20 −5; 18 −15 4; 5 −4 1]
 *              ⇒ adj A = [−24 18 5; 20 −15 −4; −5 4 1] = A⁻¹ (vì det A = 1)
 *   slide 14 — hệ 2x+y−z=8, −3x−y+2z=−11, −2x+y+2z=−3: det A = −1, det A1 = −2, det A2 = −3, det A3 = 1
 *              ⇒ (x, y, z) = (2, 3, −1) — khớp đúng kết quả khử Gauss ở Chương 5
 *   slide 16 — A = [4 1; 2 3]: λ² − 7λ + 10 = 0 ⇒ λ = 5, 2; vector riêng (1, 1) và (1, −2)
 *              (kiểm chéo: vết = 4+3 = 7 = 5+2 ✓, det = 12−2 = 10 = 5·2 ✓)
 *   slide 17 — P = [1 1; 1 −2], D = diag(5, 2), det P = −3, P⁻¹ = [2/3 1/3; 1/3 −1/3];
 *              nhân lại P D P⁻¹ = [4 1; 2 3] = A ✓
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'mae7';

export default {
  title: '7.0 — Slide bài giảng: Định thức & Trị riêng (17 slide)|||7.0 — Slide bài giảng: Định thức & Trị riêng (17 slide)',
  slug: 'mae101-7-0-slides-dinh-thuc',
  type: 'DOCUMENT',
  description: 'Toàn bộ 17 slide Chương 7 MAE101 — định thức 2×2 và ý nghĩa diện tích, minor và cofactor, khai triển theo hàng/cột, quy tắc Sarrus cho 3×3, tính chất định thức và cách tính nhanh bằng biến đổi hàng, định thức với tính khả nghịch, ma trận phụ hợp và công thức nghịch đảo, quy tắc Cramer, trị riêng và vector riêng, chéo hoá A = PDP⁻¹ — mỗi slide kèm giảng song ngữ, ma trận cụ thể đã kiểm tay và bẫy hay gặp khi thi.',
  content: [
    walkHead(D, 1, 17),
    walk(D, [
      [1, 'Chapter 7 — Determinants and Eigenvalues (cover)',
        `<p class="y-chinh">🎯 Chapter 7 of MAE101: the <strong>determinant</strong> — one number squeezed out of a square matrix that decides whether the matrix is invertible, and the <strong>eigenvalues</strong> that come from it.</p>
<ul>
<li><strong>The whole chapter in one line</strong> — every square matrix A carries a single scalar det A, and det A = 0 is exactly the boundary between "A has an inverse" and "A does not".</li>
<li><strong>Where it comes from</strong> — Chapter 5 solved systems by elimination and Chapter 6 built the matrix algebra; here the same questions get answered by a formula instead of a procedure.</li>
<li><strong>What this deck covers</strong> — 17 slides: determinants of 2×2 and 3×3 matrices, minors and cofactors, cofactor expansion, the Sarrus rule, the properties that make determinants cheap to compute, invertibility, the adjugate inverse formula, Cramer's rule, and eigenvalues, eigenvectors and diagonalisation.</li>
<li><strong>Source</strong> — Nicholson, <em>Linear Algebra with Applications</em>, chapters 3 and 5, following the FLM syllabus for MAE101.</li>
</ul>
<p class="meo">💡 Keep one sentence in your head for the whole chapter: det A is a <em>volume-scaling factor</em>. Zero volume means the matrix has crushed space flat, and nothing crushed flat can be un-crushed — that is why det A = 0 blocks the inverse.</p>`,
        `<p class="y-chinh">🎯 Chương 7 của MAE101: <strong>định thức</strong> — một con số vắt ra từ ma trận vuông, quyết định ma trận đó có khả nghịch hay không, và <strong>trị riêng</strong> sinh ra từ chính con số ấy.</p>
<ul>
<li><strong>Cả chương gói trong một câu</strong> — mọi ma trận vuông A đều mang một số vô hướng det A, và det A = 0 chính là ranh giới giữa "A có nghịch đảo" với "A không có".</li>
<li><strong>Nó đến từ đâu</strong> — Chương 5 giải hệ bằng phép khử, Chương 6 dựng đại số ma trận; ở đây cùng những câu hỏi đó được trả lời bằng một công thức thay vì một quy trình.</li>
<li><strong>Bộ slide này gồm</strong> — 17 slide: định thức ma trận 2×2 và 3×3, minor và cofactor, khai triển cofactor, quy tắc Sarrus, các tính chất giúp tính định thức rẻ đi, tính khả nghịch, công thức nghịch đảo qua ma trận phụ hợp, quy tắc Cramer, và trị riêng, vector riêng cùng phép chéo hoá.</li>
<li><strong>Nguồn</strong> — Nicholson, <em>Linear Algebra with Applications</em>, chương 3 và 5, bám syllabus FLM của MAE101.</li>
</ul>
<p class="meo">💡 Hãy giữ một câu trong đầu cho cả chương: det A là <em>hệ số phóng thể tích</em>. Thể tích bằng 0 nghĩa là ma trận đã ép không gian bẹp dí, mà thứ đã bẹp thì không phục hồi lại được — đó chính là lý do det A = 0 chặn đường nghịch đảo.</p>`],

      [2, 'Contents — six blocks of Chapter 7',
        `<p class="y-chinh">🎯 Chapter 7 runs through six blocks, each one built on the block before it.</p>
<ol>
<li><strong>Determinants of small matrices</strong> — slides 3–7: the 2×2 formula ad − bc, minors and cofactors, cofactor expansion along any row or column, a fully worked 3×3, and the Sarrus shortcut.</li>
<li><strong>Properties of determinants</strong> — slides 8–9: transpose, row swaps, proportional rows, scaling, the product rule det(AB) = det A · det B, and triangular matrices.</li>
<li><strong>Computing determinants fast</strong> — slide 10: row-reduce to a triangular matrix and multiply the diagonal, the method that actually scales.</li>
<li><strong>Determinants and invertibility</strong> — slide 11: the central theorem, A is invertible if and only if det A ≠ 0.</li>
<li><strong>Two formulas that use determinants</strong> — slides 12–14: the adjugate inverse formula and Cramer's rule, with a worked three-unknown system.</li>
<li><strong>Eigenvalues</strong> — slides 15–17: the equation Ax = λx, the characteristic equation det(A − λI) = 0, a worked 2×2, and diagonalisation A = PDP⁻¹.</li>
</ol>`,
        `<p class="y-chinh">🎯 Chương 7 chạy qua sáu khối, khối sau dựng trên khối trước.</p>
<ol>
<li><strong>Định thức của ma trận nhỏ</strong> — slide 3–7: công thức 2×2 là ad − bc, minor và cofactor, khai triển cofactor theo hàng hoặc cột bất kỳ, một ví dụ 3×3 giải đủ, và lối tắt Sarrus.</li>
<li><strong>Tính chất định thức</strong> — slide 8–9: chuyển vị, đổi chỗ hàng, hàng tỉ lệ, nhân hệ số, quy tắc tích det(AB) = det A · det B, và ma trận tam giác.</li>
<li><strong>Tính định thức cho nhanh</strong> — slide 10: biến đổi hàng đưa về ma trận tam giác rồi nhân đường chéo, đây mới là cách dùng được với ma trận lớn.</li>
<li><strong>Định thức và tính khả nghịch</strong> — slide 11: định lý trung tâm, A khả nghịch khi và chỉ khi det A ≠ 0.</li>
<li><strong>Hai công thức dùng định thức</strong> — slide 12–14: công thức nghịch đảo qua ma trận phụ hợp và quy tắc Cramer, kèm một hệ ba ẩn giải đủ.</li>
<li><strong>Trị riêng</strong> — slide 15–17: phương trình Ax = λx, phương trình đặc trưng det(A − λI) = 0, một ví dụ 2×2 giải đủ, và phép chéo hoá A = PDP⁻¹.</li>
</ol>`],

      [3, 'Determinant of a 2x2 matrix',
        `<p class="y-chinh">🎯 For a 2×2 matrix the determinant is a single number: det [a b; c d] = ad − bc, the main diagonal product minus the other diagonal product.</p>
<ul>
<li><strong>The formula</strong> — with A = [a b; c d], det A = ad − bc. Multiply top-left by bottom-right, multiply top-right by bottom-left, subtract the second from the first.</li>
<li><strong>Notation</strong> — det A and the vertical-bar form |A| mean the same thing. The bars are not absolute value: det [1 0; 0 −1] = −1, a genuinely negative number.</li>
<li><strong>Worked number</strong> — det [3 1; 2 4] = 3(4) − 1(2) = 12 − 2 = 10. Another: det [4 1; 2 3] = 12 − 2 = 10 as well, the matrix used again on slide 16.</li>
<li><strong>Geometric meaning</strong> — |det A| is the <strong>area</strong> of the parallelogram spanned by the two rows (or the two columns) of A. The matrix [3 0; 0 2] stretches the unit square into a 3-by-2 rectangle, and its determinant is 6.</li>
<li><strong>What the sign records</strong> — a positive determinant means the two vectors keep the same orientation as the standard axes; a negative one means the plane has been flipped over.</li>
<li><strong>The zero case</strong> — det A = 0 means the two rows are <strong>parallel</strong>, so the parallelogram collapses to a segment of zero area. For [1 2; 2 4] we get 4 − 4 = 0, and row 2 is exactly twice row 1.</li>
<li><strong>Why we care already</strong> — the 2×2 inverse is A⁻¹ = (1/(ad − bc))[d −b; −c a], so ad − bc sitting in a denominator is the reason det A = 0 kills the inverse.</li>
</ul>
<p class="meo">💡 Draw the two diagonals as a big X across the matrix. The stroke going down-right is the plus term, the stroke going up-right is the minus term. That picture survives into Sarrus on slide 7.</p>
<p class="pitfall">⚠️ Two reflexes to break: writing bc − ad (the answer comes out with the wrong sign), and treating |A| as "make it positive". Determinants are freely negative, and the sign carries real information about orientation.</p>`,
        `<p class="y-chinh">🎯 Với ma trận 2×2, định thức là một con số duy nhất: det [a b; c d] = ad − bc, tích đường chéo chính trừ tích đường chéo còn lại.</p>
<ul>
<li><strong>Công thức</strong> — với A = [a b; c d] thì det A = ad − bc. Nhân góc trên trái với góc dưới phải, nhân góc trên phải với góc dưới trái, rồi lấy cái trước trừ cái sau.</li>
<li><strong>Ký hiệu</strong> — det A và dạng hai gạch đứng |A| là một. Hai gạch đó không phải trị tuyệt đối: det [1 0; 0 −1] = −1, một số âm thật sự.</li>
<li><strong>Tính thử bằng số</strong> — det [3 1; 2 4] = 3(4) − 1(2) = 12 − 2 = 10. Một cái nữa: det [4 1; 2 3] = 12 − 2 = 10, đúng ma trận sẽ dùng lại ở slide 16.</li>
<li><strong>Ý nghĩa hình học</strong> — |det A| là <strong>diện tích</strong> hình bình hành tạo bởi hai vector hàng (hoặc hai vector cột) của A. Ma trận [3 0; 0 2] kéo hình vuông đơn vị thành hình chữ nhật 3 nhân 2, và định thức của nó bằng 6.</li>
<li><strong>Dấu ghi lại điều gì</strong> — định thức dương nghĩa là hai vector giữ nguyên chiều so với hệ trục chuẩn; định thức âm nghĩa là mặt phẳng đã bị lật ngược.</li>
<li><strong>Trường hợp bằng 0</strong> — det A = 0 nghĩa là hai hàng <strong>cùng phương</strong>, nên hình bình hành sụp thành một đoạn thẳng diện tích 0. Với [1 2; 2 4] ta có 4 − 4 = 0, và hàng 2 đúng bằng hai lần hàng 1.</li>
<li><strong>Vì sao đã phải quan tâm ngay</strong> — nghịch đảo 2×2 là A⁻¹ = (1/(ad − bc))[d −b; −c a], nên chính việc ad − bc nằm dưới mẫu là lý do det A = 0 giết chết nghịch đảo.</li>
</ul>
<p class="meo">💡 Hãy vẽ hai đường chéo thành một chữ X lớn đè lên ma trận. Nét đi xuống phải là số hạng cộng, nét đi lên phải là số hạng trừ. Hình ảnh đó còn dùng tiếp cho Sarrus ở slide 7.</p>
<p class="pitfall">⚠️ Hai phản xạ cần bỏ: viết bc − ad (đáp án ra ngược dấu), và hiểu |A| là "làm cho nó dương". Định thức được phép âm thoải mái, và dấu của nó mang thông tin thật về chiều.</p>`],

      [4, 'Minors and cofactors',
        `<p class="y-chinh">🎯 The minor Mᵢⱼ is the determinant of what is left after deleting row i and column j; the cofactor Cᵢⱼ is that minor with a checkerboard sign attached.</p>
<ul>
<li><strong>Minor</strong> — for an n×n matrix A, delete row i and column j, and take the determinant of the (n−1)×(n−1) matrix that remains. That number is Mᵢⱼ.</li>
<li><strong>Cofactor</strong> — Cᵢⱼ = (−1)^(i+j) · Mᵢⱼ. Same number, possibly flipped in sign, depending only on the position (i, j).</li>
<li><strong>The sign rule</strong> — i + j even gives +, i + j odd gives −. For a 3×3 the sign board is [+ − +; − + −; + − +], starting with + at position (1, 1).</li>
<li><strong>Worked minor</strong> — in A = [1 2 3; 0 4 5; 1 0 6], deleting row 1 and column 1 leaves [4 5; 0 6], so M₁₁ = 24 − 0 = 24 and C₁₁ = (+1)(24) = 24.</li>
<li><strong>Worked cofactor with a sign flip</strong> — deleting row 1 and column 2 leaves [0 5; 1 6], so M₁₂ = 0 − 5 = −5 and C₁₂ = (−1)^(1+2)(−5) = +5. The minor is negative, the cofactor is positive.</li>
<li><strong>One more</strong> — deleting row 1 and column 3 leaves [0 4; 1 0], so M₁₃ = 0 − 4 = −4 and C₁₃ = (+1)(−4) = −4.</li>
<li><strong>Why the alternating sign exists</strong> — it is what makes the expansions of slide 5 agree no matter which row or column you pick. Without it, different rows would give different "determinants".</li>
</ul>
<p class="meo">💡 Do not memorise (−1)^(i+j). Put your finger on entry (1, 1), call it +, and step one square at a time: every step left, right, up or down flips the sign, exactly like a chessboard.</p>
<p class="pitfall">⚠️ The classic loss of marks is confusing Mᵢⱼ with Cᵢⱼ. The minor never carries a sign of its own beyond its arithmetic; the cofactor is the one that goes into the expansion. Here M₁₂ = −5 but C₁₂ = +5 — plug the wrong one in and the determinant is off by 10.</p>`,
        `<p class="y-chinh">🎯 Minor Mᵢⱼ là định thức của phần còn lại sau khi xoá hàng i và cột j; cofactor Cᵢⱼ là chính minor đó gắn thêm một dấu theo kiểu bàn cờ.</p>
<ul>
<li><strong>Minor</strong> — với ma trận A cỡ n×n, xoá hàng i và cột j rồi lấy định thức của ma trận (n−1)×(n−1) còn lại. Con số đó là Mᵢⱼ.</li>
<li><strong>Cofactor</strong> — Cᵢⱼ = (−1)^(i+j) · Mᵢⱼ. Vẫn con số ấy, có thể bị đổi dấu, và điều đó chỉ phụ thuộc vào vị trí (i, j).</li>
<li><strong>Quy tắc dấu</strong> — i + j chẵn cho dấu +, i + j lẻ cho dấu −. Với ma trận 3×3, bảng dấu là [+ − +; − + −; + − +], bắt đầu bằng + ở vị trí (1, 1).</li>
<li><strong>Tính thử một minor</strong> — trong A = [1 2 3; 0 4 5; 1 0 6], xoá hàng 1 và cột 1 còn lại [4 5; 0 6], nên M₁₁ = 24 − 0 = 24 và C₁₁ = (+1)(24) = 24.</li>
<li><strong>Một cofactor có đổi dấu</strong> — xoá hàng 1 và cột 2 còn lại [0 5; 1 6], nên M₁₂ = 0 − 5 = −5 và C₁₂ = (−1)^(1+2)(−5) = +5. Minor âm, còn cofactor thì dương.</li>
<li><strong>Thêm một cái nữa</strong> — xoá hàng 1 và cột 3 còn lại [0 4; 1 0], nên M₁₃ = 0 − 4 = −4 và C₁₃ = (+1)(−4) = −4.</li>
<li><strong>Vì sao phải có dấu xen kẽ</strong> — chính nó làm cho các khai triển ở slide 5 cho cùng một kết quả dù chọn hàng hay cột nào. Không có nó thì mỗi hàng sẽ cho một "định thức" khác nhau.</li>
</ul>
<p class="meo">💡 Đừng học thuộc (−1)^(i+j). Hãy đặt ngón tay vào ô (1, 1), gọi nó là +, rồi bước từng ô một: mỗi bước sang trái, sang phải, lên hay xuống đều đổi dấu, y hệt bàn cờ vua.</p>
<p class="pitfall">⚠️ Chỗ mất điểm kinh điển là lẫn Mᵢⱼ với Cᵢⱼ. Minor không tự mang dấu nào ngoài kết quả tính của nó; cofactor mới là thứ đi vào khai triển. Ở đây M₁₂ = −5 nhưng C₁₂ = +5 — thay nhầm cái là định thức lệch mất 10.</p>`],

      [5, 'Cofactor expansion along any row or column',
        `<p class="y-chinh">🎯 A determinant can be expanded along <strong>any</strong> row or <strong>any</strong> column: multiply each entry by its cofactor and add. The answer never depends on the choice.</p>
<ul>
<li><strong>Expansion along row i</strong> — det A = aᵢ₁Cᵢ₁ + aᵢ₂Cᵢ₂ + ⋯ + aᵢₙCᵢₙ, a sum of n terms, one per column.</li>
<li><strong>Expansion along column j</strong> — det A = a₁ⱼC₁ⱼ + a₂ⱼC₂ⱼ + ⋯ + aₙⱼCₙⱼ, a sum of n terms, one per row.</li>
<li><strong>The theorem</strong> — all 2n expansions of an n×n matrix give exactly the same number. That is what lets us speak of "the" determinant at all.</li>
<li><strong>It is recursive</strong> — each cofactor of an n×n matrix is itself an (n−1)×(n−1) determinant, so a 4×4 becomes four 3×3s, each of which becomes three 2×2s, and 2×2 is where the recursion stops with ad − bc.</li>
<li><strong>Zeros are free</strong> — a term aᵢⱼCᵢⱼ with aᵢⱼ = 0 contributes nothing, and you never have to compute that cofactor. Choosing a row with two zeros in a 3×3 cuts the work from three minors to one.</li>
<li><strong>Cost warning</strong> — done blindly this costs about n! multiplications: 24 for a 4×4, 120 for a 5×5, and over three million for a 10×10. That is why slide 10 exists.</li>
<li><strong>Degenerate cases</strong> — a matrix with a whole row of zeros has determinant 0 by expanding along that row, and the identity matrix has determinant 1 by the same reasoning applied repeatedly.</li>
</ul>
<p class="meo">💡 Before you expand, scan every row and every column and count the zeros. Expanding along the line with the most zeros is free marks and free time, and it is always allowed.</p>
<p class="pitfall">⚠️ Expanding along row 2 or column 2 while still using the row-1 sign pattern + − +. The sign belongs to the <em>position</em>, so row 2 starts with −: det A = −a₂₁M₂₁ + a₂₂M₂₂ − a₂₃M₂₃. Forget that and the whole answer flips sign.</p>`,
        `<p class="y-chinh">🎯 Định thức có thể khai triển theo <strong>bất kỳ</strong> hàng hay <strong>bất kỳ</strong> cột nào: nhân từng phần tử với cofactor của nó rồi cộng lại. Kết quả không bao giờ phụ thuộc vào lựa chọn đó.</p>
<ul>
<li><strong>Khai triển theo hàng i</strong> — det A = aᵢ₁Cᵢ₁ + aᵢ₂Cᵢ₂ + ⋯ + aᵢₙCᵢₙ, tổng của n số hạng, mỗi cột một số hạng.</li>
<li><strong>Khai triển theo cột j</strong> — det A = a₁ⱼC₁ⱼ + a₂ⱼC₂ⱼ + ⋯ + aₙⱼCₙⱼ, tổng của n số hạng, mỗi hàng một số hạng.</li>
<li><strong>Định lý</strong> — cả 2n cách khai triển của ma trận n×n đều cho đúng một con số. Chính điều đó cho phép ta nói "cái" định thức của ma trận.</li>
<li><strong>Nó có tính đệ quy</strong> — mỗi cofactor của ma trận n×n lại là một định thức (n−1)×(n−1), nên một ma trận 4×4 thành bốn ma trận 3×3, mỗi cái lại thành ba ma trận 2×2, và 2×2 là chỗ đệ quy dừng lại với ad − bc.</li>
<li><strong>Số 0 thì miễn phí</strong> — số hạng aᵢⱼCᵢⱼ với aᵢⱼ = 0 không đóng góp gì, và bạn không cần tính cofactor đó. Chọn một hàng có hai số 0 trong ma trận 3×3 giảm công từ ba minor xuống còn một.</li>
<li><strong>Cảnh báo chi phí</strong> — làm mù quáng thì cách này tốn khoảng n! phép nhân: 24 cho 4×4, 120 cho 5×5, và hơn ba triệu cho 10×10. Đó là lý do slide 10 tồn tại.</li>
<li><strong>Vài trường hợp suy biến</strong> — ma trận có nguyên một hàng toàn số 0 thì định thức bằng 0, thấy ngay khi khai triển theo hàng đó; còn ma trận đơn vị có định thức bằng 1, cũng bằng lập luận đó lặp lại.</li>
</ul>
<p class="meo">💡 Trước khi khai triển, hãy quét hết các hàng và các cột rồi đếm số 0. Khai triển theo dòng nhiều số 0 nhất là điểm cho không và thời gian cho không, mà lúc nào cũng được phép.</p>
<p class="pitfall">⚠️ Khai triển theo hàng 2 hay cột 2 mà vẫn dùng bảng dấu + − + của hàng 1. Dấu thuộc về <em>vị trí</em>, nên hàng 2 bắt đầu bằng dấu −: det A = −a₂₁M₂₁ + a₂₂M₂₂ − a₂₃M₂₃. Quên chuyện đó là cả đáp án đảo dấu.</p>`],

      [6, 'Worked example — cofactor expansion of a 3x3',
        `<p class="y-chinh">🎯 Expand A = [1 2 3; 0 4 5; 1 0 6] along row 1 and get det A = 22.</p>
<ul>
<li><strong>Set up</strong> — expanding along row 1 gives det A = 1·C₁₁ + 2·C₁₂ + 3·C₁₃, with the sign pattern + − + attached to the three minors.</li>
<li><strong>Step 1 — C₁₁</strong> — delete row 1, column 1, leaving [4 5; 0 6]. Its determinant is 4(6) − 5(0) = 24, and the sign is +, so <strong>C₁₁ = 24</strong>.</li>
<li><strong>Step 2 — C₁₂</strong> — delete row 1, column 2, leaving [0 5; 1 6]. Its determinant is 0(6) − 5(1) = −5, and the sign is −, so <strong>C₁₂ = −(−5) = 5</strong>.</li>
<li><strong>Step 3 — C₁₃</strong> — delete row 1, column 3, leaving [0 4; 1 0]. Its determinant is 0(0) − 4(1) = −4, and the sign is +, so <strong>C₁₃ = −4</strong>.</li>
<li><strong>Step 4 — combine</strong> — det A = 1(24) + 2(5) + 3(−4) = 24 + 10 − 12 = <strong>22</strong>.</li>
<li><strong>Cross-check along column 1</strong> — det A = 1·C₁₁ + 0·C₂₁ + 1·C₃₁. The middle term dies because a₂₁ = 0. For C₃₁, delete row 3 and column 1, leaving [2 3; 4 5]: its determinant is 10 − 12 = −2 and the sign is +, so C₃₁ = −2. Then det A = 1(24) + 0 + 1(−2) = 22 ✓ — the same number the row-1 expansion gave.</li>
<li><strong>Conclusion</strong> — det A = 22 ≠ 0, so by slide 11 this matrix is invertible.</li>
</ul>
<p class="meo">💡 Row 2 here is [0 4 5] and column 1 is [1 0 1] — both contain a zero, so either is cheaper than row 1. Expanding along column 1 needs only two minors instead of three, and it lands on the same 22.</p>
<p class="pitfall">⚠️ Watch the second term. The minor M₁₂ is −5, the cofactor C₁₂ is +5, and the entry a₁₂ is 2, so the contribution is +10, not −10. Students who skip the sign board turn 22 into 2 here.</p>`,
        `<p class="y-chinh">🎯 Khai triển A = [1 2 3; 0 4 5; 1 0 6] theo hàng 1 và được det A = 22.</p>
<ul>
<li><strong>Dựng bài</strong> — khai triển theo hàng 1 cho det A = 1·C₁₁ + 2·C₁₂ + 3·C₁₃, với bảng dấu + − + gắn vào ba minor.</li>
<li><strong>Bước 1 — C₁₁</strong> — xoá hàng 1, cột 1, còn lại [4 5; 0 6]. Định thức của nó là 4(6) − 5(0) = 24, dấu là +, nên <strong>C₁₁ = 24</strong>.</li>
<li><strong>Bước 2 — C₁₂</strong> — xoá hàng 1, cột 2, còn lại [0 5; 1 6]. Định thức của nó là 0(6) − 5(1) = −5, dấu là −, nên <strong>C₁₂ = −(−5) = 5</strong>.</li>
<li><strong>Bước 3 — C₁₃</strong> — xoá hàng 1, cột 3, còn lại [0 4; 1 0]. Định thức của nó là 0(0) − 4(1) = −4, dấu là +, nên <strong>C₁₃ = −4</strong>.</li>
<li><strong>Bước 4 — cộng lại</strong> — det A = 1(24) + 2(5) + 3(−4) = 24 + 10 − 12 = <strong>22</strong>.</li>
<li><strong>Kiểm chéo bằng cột 1</strong> — det A = 1·C₁₁ + 0·C₂₁ + 1·C₃₁. Số hạng giữa chết vì a₂₁ = 0; còn C₃₁ lấy hàng 1 và hàng 2 sau khi xoá cột 1, tức [2 3; 4 5], định thức là 10 − 12 = −2, dấu là +. Vậy det A = 1(24) + 0 + 1(−2) = 22 ✓ — đúng bằng kết quả khai triển theo hàng 1.</li>
<li><strong>Kết luận</strong> — det A = 22 ≠ 0, nên theo slide 11 ma trận này khả nghịch.</li>
</ul>
<p class="meo">💡 Hàng 2 ở đây là [0 4 5] và cột 1 là [1 0 1] — cả hai đều chứa một số 0, nên chọn cái nào cũng rẻ hơn hàng 1. Khai triển theo cột 1 chỉ cần hai minor thay vì ba, và vẫn về đúng con số 22.</p>
<p class="pitfall">⚠️ Cẩn thận số hạng thứ hai. Minor M₁₂ là −5, cofactor C₁₂ là +5, và phần tử a₁₂ là 2, nên đóng góp là +10 chứ không phải −10. Ai bỏ qua bảng dấu sẽ biến 22 thành 2 ngay tại chỗ này.</p>`],

      [7, 'The Sarrus rule for 3x3 matrices',
        `<p class="y-chinh">🎯 Sarrus is a memorised six-term formula for 3×3 determinants: three downward diagonal products added, three upward diagonal products subtracted.</p>
<ul>
<li><strong>The formula</strong> — det A = a₁₁a₂₂a₃₃ + a₁₂a₂₃a₃₁ + a₁₃a₂₁a₃₂ − a₁₃a₂₂a₃₁ − a₁₁a₂₃a₃₂ − a₁₂a₂₁a₃₃.</li>
<li><strong>How to lay it out</strong> — copy columns 1 and 2 again to the right of the matrix, then read the three full down-right diagonals as plus terms and the three full down-left diagonals as minus terms.</li>
<li><strong>Same example, A = [1 2 3; 0 4 5; 1 0 6]</strong> — plus terms: 1·4·6 = 24, then 2·5·1 = 10, then 3·0·0 = 0.</li>
<li><strong>Minus terms</strong> — 3·4·1 = 12, then 1·5·0 = 0, then 2·0·6 = 0.</li>
<li><strong>Result</strong> — det A = (24 + 10 + 0) − (12 + 0 + 0) = 34 − 12 = <strong>22</strong>, exactly the cofactor answer of slide 6.</li>
<li><strong>When it is worth it</strong> — for a dense 3×3 with no zeros, Sarrus is faster than three minors and less error-prone if you draw the diagonals. For a 3×3 full of zeros, cofactor expansion still wins.</li>
<li><strong>Where it comes from</strong> — it is not a separate theorem; multiply out the row-1 cofactor expansion of a general 3×3 and you get exactly these six terms.</li>
</ul>
<p class="meo">💡 Write the copied columns 1 and 2 physically on your paper before drawing diagonals. The mistakes come from tracing the wrap-around in your head, never from the multiplication itself.</p>
<p class="pitfall">⚠️ Sarrus works for <strong>3×3 only</strong>. There is no 4×4 version: the "diagonal trick" on a 4×4 produces 8 terms while the real determinant has 24, so the answer is simply wrong. For n ≥ 4 use cofactor expansion or, better, row reduction. Also note there is no 2×2 Sarrus either — that case is just ad − bc.</p>`,
        `<p class="y-chinh">🎯 Sarrus là công thức sáu số hạng học thuộc cho định thức 3×3: cộng ba tích theo đường chéo xuôi, trừ ba tích theo đường chéo ngược.</p>
<ul>
<li><strong>Công thức</strong> — det A = a₁₁a₂₂a₃₃ + a₁₂a₂₃a₃₁ + a₁₃a₂₁a₃₂ − a₁₃a₂₂a₃₁ − a₁₁a₂₃a₃₂ − a₁₂a₂₁a₃₃.</li>
<li><strong>Cách bày ra giấy</strong> — chép lại cột 1 và cột 2 thêm một lần nữa vào bên phải ma trận, rồi đọc ba đường chéo đầy đủ đi xuống phải là các số hạng cộng, và ba đường chéo đầy đủ đi xuống trái là các số hạng trừ.</li>
<li><strong>Vẫn ví dụ cũ, A = [1 2 3; 0 4 5; 1 0 6]</strong> — các số hạng cộng: 1·4·6 = 24, rồi 2·5·1 = 10, rồi 3·0·0 = 0.</li>
<li><strong>Các số hạng trừ</strong> — 3·4·1 = 12, rồi 1·5·0 = 0, rồi 2·0·6 = 0.</li>
<li><strong>Kết quả</strong> — det A = (24 + 10 + 0) − (12 + 0 + 0) = 34 − 12 = <strong>22</strong>, đúng bằng đáp án cofactor ở slide 6.</li>
<li><strong>Khi nào nên dùng</strong> — với ma trận 3×3 dày đặc, không có số 0, Sarrus nhanh hơn ba minor và ít sai hơn nếu bạn chịu vẽ đường chéo. Còn với ma trận 3×3 đầy số 0 thì khai triển cofactor vẫn thắng.</li>
<li><strong>Nó từ đâu ra</strong> — nó không phải một định lý riêng; cứ nhân bung khai triển cofactor theo hàng 1 của ma trận 3×3 tổng quát là ra đúng sáu số hạng này.</li>
</ul>
<p class="meo">💡 Hãy chép hẳn cột 1 và cột 2 ra giấy trước khi vẽ đường chéo. Lỗi sai đến từ việc vẽ đường vòng qua mép trong đầu, chứ không bao giờ đến từ phép nhân.</p>
<p class="pitfall">⚠️ Sarrus chỉ đúng cho <strong>3×3</strong>. Không hề có phiên bản 4×4: "mẹo đường chéo" áp lên ma trận 4×4 sinh ra 8 số hạng trong khi định thức thật có 24, nên đáp án đơn giản là sai. Với n ≥ 4 phải dùng khai triển cofactor, hoặc tốt hơn là biến đổi hàng. Cũng lưu ý không có Sarrus cho 2×2 — trường hợp đó chỉ là ad − bc.</p>`],

      [8, 'Properties of determinants',
        `<p class="y-chinh">🎯 Four properties describe how det A reacts to row operations — and they are what make a determinant cheap to compute instead of expensive.</p>
<ul>
<li><strong>Transpose</strong> — det(Aᵀ) = det A. Rows and columns play identical roles, which is precisely why expansion along a column is as valid as along a row.</li>
<li><strong>Swapping two rows</strong> — the determinant <strong>changes sign</strong>. Swapping [1 2; 3 4] (det = −2) into [3 4; 1 2] gives 6 − 4 = 2. One swap flips the sign, two swaps restore it.</li>
<li><strong>Two proportional rows</strong> — det A = 0. If one row is a multiple of another (identical rows being the case with multiplier 1), the determinant vanishes: det [1 2; 2 4] = 4 − 4 = 0.</li>
<li><strong>Scaling one row</strong> — multiplying a single row by k multiplies det A by k. From det [1 2; 3 4] = −2, doubling row 1 gives det [2 4; 3 4] = 8 − 12 = −4 = 2(−2).</li>
<li><strong>The operation that costs nothing</strong> — adding a multiple of one row to another leaves det A completely <strong>unchanged</strong>. This is the property slide 10 is built on.</li>
<li><strong>A row of zeros</strong> — det A = 0, since scaling that row by any k must multiply the determinant by k while leaving the matrix alone.</li>
<li><strong>All of it holds for columns</strong> — because of det(Aᵀ) = det A, every statement above is equally true with "row" replaced by "column".</li>
</ul>
<p class="meo">💡 Sort the three elementary row operations by their price: adding a multiple is free, swapping costs one sign, scaling by k costs a factor of k. Keep a running note of that price beside your work and you can reduce as aggressively as you like.</p>
<p class="pitfall">⚠️ The scaling rule is per <em>row</em>, not per matrix. For an n×n matrix det(kA) = kⁿ det A, because every one of the n rows got multiplied: for 3×3, det(2A) = 8 det A, not 2 det A. And determinants are not additive — det(A + B) ≠ det A + det B in general.</p>`,
        `<p class="y-chinh">🎯 Bốn tính chất mô tả det A phản ứng thế nào với phép biến đổi hàng — và chính chúng làm cho việc tính định thức rẻ đi thay vì đắt đỏ.</p>
<ul>
<li><strong>Chuyển vị</strong> — det(Aᵀ) = det A. Hàng và cột đóng vai trò y hệt nhau, và đó chính là lý do khai triển theo cột cũng hợp lệ như theo hàng.</li>
<li><strong>Đổi chỗ hai hàng</strong> — định thức <strong>đổi dấu</strong>. Đổi [1 2; 3 4] (det = −2) thành [3 4; 1 2] cho 6 − 4 = 2. Một lần đổi chỗ là đảo dấu, hai lần thì trả lại như cũ.</li>
<li><strong>Hai hàng tỉ lệ</strong> — det A = 0. Nếu một hàng là bội của hàng khác (hai hàng giống hệt nhau là trường hợp bội bằng 1) thì định thức triệt tiêu: det [1 2; 2 4] = 4 − 4 = 0.</li>
<li><strong>Nhân một hàng với hệ số</strong> — nhân đúng một hàng với k thì det A được nhân thêm k. Từ det [1 2; 3 4] = −2, nhân đôi hàng 1 cho det [2 4; 3 4] = 8 − 12 = −4 = 2(−2).</li>
<li><strong>Phép không tốn gì</strong> — cộng một bội của hàng này vào hàng khác thì det A <strong>hoàn toàn không đổi</strong>. Đây là tính chất mà cả slide 10 dựng lên trên nó.</li>
<li><strong>Một hàng toàn số 0</strong> — det A = 0, vì nhân hàng đó với k bất kỳ phải nhân định thức lên k trong khi ma trận vẫn y nguyên.</li>
<li><strong>Tất cả đều đúng với cột</strong> — do det(Aᵀ) = det A, mọi phát biểu trên vẫn đúng khi thay chữ "hàng" bằng chữ "cột".</li>
</ul>
<p class="meo">💡 Hãy xếp ba phép biến đổi hàng sơ cấp theo giá của chúng: cộng bội thì miễn phí, đổi chỗ tốn một dấu, nhân với k tốn một hệ số k. Ghi cái giá đang chạy đó bên cạnh bài làm là bạn tha hồ rút gọn mạnh tay.</p>
<p class="pitfall">⚠️ Quy tắc nhân hệ số là tính theo từng <em>hàng</em>, không phải theo cả ma trận. Với ma trận n×n thì det(kA) = kⁿ det A, vì cả n hàng đều bị nhân: với 3×3, det(2A) = 8 det A chứ không phải 2 det A. Và định thức không cộng tính — nói chung det(A + B) ≠ det A + det B.</p>`],

      [9, 'The product rule and triangular matrices',
        `<p class="y-chinh">🎯 Two facts do most of the heavy lifting: det(AB) = det A · det B, and the determinant of a triangular matrix is just the product of its diagonal.</p>
<ul>
<li><strong>The product rule</strong> — for square matrices of the same size, det(AB) = det A · det B. Remarkable, given how tangled matrix multiplication is compared with multiplying two numbers.</li>
<li><strong>Numerical check</strong> — A = [1 2; 3 4] with det A = −2, B = [2 0; 1 3] with det B = 6. Then AB = [4 6; 10 12], and det(AB) = 48 − 60 = −12 = (−2)(6). ✓</li>
<li><strong>Consequence for inverses</strong> — from AA⁻¹ = I and det I = 1 we get det A · det(A⁻¹) = 1, hence <strong>det(A⁻¹) = 1/det A</strong>. This only makes sense when det A ≠ 0 — another sighting of the theorem on slide 11.</li>
<li><strong>Consequence for powers</strong> — det(Aᵏ) = (det A)ᵏ, since Aᵏ is just A multiplied by itself k times.</li>
<li><strong>Triangular matrices</strong> — if every entry below the main diagonal is 0 (upper triangular) or every entry above it is 0 (lower triangular), then det A = a₁₁a₂₂⋯aₙₙ.</li>
<li><strong>Why that is true</strong> — expand along the first column of an upper triangular matrix: only a₁₁ survives, and the remaining minor is triangular again, so the argument repeats down the diagonal.</li>
<li><strong>Two easy examples</strong> — det [1 2 3; 0 1 −3; 0 0 −1] = 1·1·(−1) = −1, and det [2 0 0; 7 5 0; 1 9 3] = 2·5·3 = 30, even though the lower half is full of numbers.</li>
<li><strong>The identity and diagonal matrices</strong> — det I = 1, and a diagonal matrix is triangular both ways, so its determinant is also the product of the diagonal.</li>
</ul>
<p class="meo">💡 Put the two facts together and you have the whole strategy of slide 10: row-reduce A to a triangular matrix (cheap), multiply the diagonal (trivial), and correct for any swaps or scalings you performed.</p>
<p class="pitfall">⚠️ det(AB) = det A · det B is true, but there is no such rule for sums, and no rule saying det(A + B) relates to det A and det B at all. Also, a triangular matrix with a single 0 on the diagonal has determinant 0 no matter how large the other diagonal entries are — one zero factor kills the product.</p>`,
        `<p class="y-chinh">🎯 Hai sự kiện gánh phần lớn công việc nặng: det(AB) = det A · det B, và định thức của ma trận tam giác chỉ là tích các phần tử trên đường chéo.</p>
<ul>
<li><strong>Quy tắc tích</strong> — với hai ma trận vuông cùng cỡ, det(AB) = det A · det B. Rất đáng kinh ngạc, xét việc phép nhân ma trận rối rắm đến thế nào so với nhân hai con số.</li>
<li><strong>Kiểm bằng số</strong> — A = [1 2; 3 4] có det A = −2, B = [2 0; 1 3] có det B = 6. Khi đó AB = [4 6; 10 12], và det(AB) = 48 − 60 = −12 = (−2)(6). ✓</li>
<li><strong>Hệ quả cho nghịch đảo</strong> — từ AA⁻¹ = I và det I = 1 ta có det A · det(A⁻¹) = 1, suy ra <strong>det(A⁻¹) = 1/det A</strong>. Điều này chỉ có nghĩa khi det A ≠ 0 — lại một lần nữa gặp định lý ở slide 11.</li>
<li><strong>Hệ quả cho luỹ thừa</strong> — det(Aᵏ) = (det A)ᵏ, vì Aᵏ chỉ là A nhân với chính nó k lần.</li>
<li><strong>Ma trận tam giác</strong> — nếu mọi phần tử dưới đường chéo chính đều bằng 0 (tam giác trên) hoặc mọi phần tử trên nó đều bằng 0 (tam giác dưới), thì det A = a₁₁a₂₂⋯aₙₙ.</li>
<li><strong>Vì sao đúng</strong> — khai triển theo cột đầu của ma trận tam giác trên: chỉ mỗi a₁₁ sống sót, và minor còn lại lại là ma trận tam giác, nên lập luận cứ thế lặp lại dọc đường chéo.</li>
<li><strong>Hai ví dụ dễ</strong> — det [1 2 3; 0 1 −3; 0 0 −1] = 1·1·(−1) = −1, và det [2 0 0; 7 5 0; 1 9 3] = 2·5·3 = 30, dù nửa dưới đầy số.</li>
<li><strong>Ma trận đơn vị và ma trận chéo</strong> — det I = 1, còn ma trận chéo là tam giác theo cả hai kiểu nên định thức của nó cũng là tích đường chéo.</li>
</ul>
<p class="meo">💡 Ghép hai sự kiện này lại là ra nguyên chiến lược của slide 10: biến đổi hàng đưa A về tam giác (rẻ), nhân đường chéo (dễ như không), rồi bù lại cho những lần đổi chỗ hay nhân hệ số mà bạn đã làm.</p>
<p class="pitfall">⚠️ det(AB) = det A · det B thì đúng, nhưng không có quy tắc nào như vậy cho phép cộng, và cũng không có quy tắc nào nối det(A + B) với det A và det B cả. Ngoài ra, ma trận tam giác chỉ cần một số 0 trên đường chéo là định thức bằng 0, dù các phần tử chéo còn lại có lớn đến đâu — một thừa số 0 giết cả tích.</p>`],

      [10, 'Worked example — determinant by row reduction',
        `<p class="y-chinh">🎯 Reduce A = [1 2 3; 2 5 3; 1 0 8] to triangular form using only "add a multiple of a row", then read det A = −1 off the diagonal.</p>
<ul>
<li><strong>Why this method</strong> — adding a multiple of one row to another does not change the determinant at all, so the whole reduction is free; the cost is about n³/3 operations instead of n! .</li>
<li><strong>Step 1 — clear column 1</strong> — R2 → R2 − 2R1 turns [2 5 3] into [2−2, 5−4, 3−6] = <strong>[0 1 −3]</strong>, and R3 → R3 − R1 turns [1 0 8] into [1−1, 0−2, 8−3] = <strong>[0 −2 5]</strong>.</li>
<li><strong>After step 1</strong> — the matrix is [1 2 3; 0 1 −3; 0 −2 5], with the determinant unchanged.</li>
<li><strong>Step 2 — clear column 2</strong> — R3 → R3 + 2R2 turns [0 −2 5] into [0, −2+2, 5+2(−3)] = [0, 0, 5 − 6] = <strong>[0 0 −1]</strong>.</li>
<li><strong>Upper triangular form reached</strong> — [1 2 3; 0 1 −3; 0 0 −1], and no swap and no scaling were used anywhere.</li>
<li><strong>Read the answer</strong> — det A = 1 · 1 · (−1) = <strong>−1</strong>. No correction factor is needed, precisely because only the free operation was used.</li>
<li><strong>Bookkeeping if you had swapped</strong> — each row swap would multiply the final answer by −1, and a step Rᵢ → cRᵢ would mean dividing the diagonal product by c to recover det A.</li>
<li><strong>Cross-check by cofactor</strong> — expanding the original along row 1: 1(5·8 − 3·0) − 2(2·8 − 3·1) + 3(2·0 − 5·1) = 40 − 2(13) + 3(−5) = 40 − 26 − 15 = −1 ✓.</li>
</ul>
<p class="meo">💡 This is the method to use the moment n reaches 4. A 4×4 by cofactors is 24 multiplications spread over four 3×3s; by row reduction it is a handful of subtractions and one product of four numbers.</p>
<p class="pitfall">⚠️ Row reduction for a <em>determinant</em> is not the same as row reduction for a <em>system</em>. Solving a system lets you scale rows freely because the solution set does not care; here every scaling changes the number you are computing. Write down each swap and each scale factor as you go, or the final answer will be off by a factor you can no longer reconstruct.</p>`,
        `<p class="y-chinh">🎯 Đưa A = [1 2 3; 2 5 3; 1 0 8] về dạng tam giác chỉ bằng phép "cộng bội của một hàng", rồi đọc det A = −1 ngay trên đường chéo.</p>
<ul>
<li><strong>Vì sao dùng cách này</strong> — cộng một bội của hàng này vào hàng khác hoàn toàn không làm đổi định thức, nên cả quá trình rút gọn là miễn phí; chi phí khoảng n³/3 phép tính thay vì n! .</li>
<li><strong>Bước 1 — dọn cột 1</strong> — R2 → R2 − 2R1 biến [2 5 3] thành [2−2, 5−4, 3−6] = <strong>[0 1 −3]</strong>, và R3 → R3 − R1 biến [1 0 8] thành [1−1, 0−2, 8−3] = <strong>[0 −2 5]</strong>.</li>
<li><strong>Sau bước 1</strong> — ma trận là [1 2 3; 0 1 −3; 0 −2 5], và định thức vẫn giữ nguyên.</li>
<li><strong>Bước 2 — dọn cột 2</strong> — R3 → R3 + 2R2 biến [0 −2 5] thành [0, −2+2, 5+2(−3)] = [0, 0, 5 − 6] = <strong>[0 0 −1]</strong>.</li>
<li><strong>Đã về tam giác trên</strong> — [1 2 3; 0 1 −3; 0 0 −1], và không hề dùng phép đổi chỗ hay phép nhân hệ số ở bất kỳ đâu.</li>
<li><strong>Đọc đáp án</strong> — det A = 1 · 1 · (−1) = <strong>−1</strong>. Không cần hệ số điều chỉnh nào, đúng vì chỉ dùng mỗi phép miễn phí.</li>
<li><strong>Ghi sổ nếu có đổi chỗ</strong> — mỗi lần đổi chỗ hai hàng sẽ nhân đáp án cuối với −1, còn một bước Rᵢ → cRᵢ nghĩa là phải chia tích đường chéo cho c mới lấy lại được det A.</li>
<li><strong>Kiểm chéo bằng cofactor</strong> — khai triển ma trận gốc theo hàng 1: 1(5·8 − 3·0) − 2(2·8 − 3·1) + 3(2·0 − 5·1) = 40 − 2(13) + 3(−5) = 40 − 26 − 15 = −1 ✓.</li>
</ul>
<p class="meo">💡 Đây là cách phải dùng ngay khi n chạm tới 4. Ma trận 4×4 tính bằng cofactor là 24 phép nhân rải trên bốn ma trận 3×3; còn bằng biến đổi hàng thì chỉ là vài phép trừ và một tích của bốn con số.</p>
<p class="pitfall">⚠️ Biến đổi hàng để tính <em>định thức</em> không giống biến đổi hàng để giải <em>hệ</em>. Giải hệ thì bạn nhân hàng thoải mái vì tập nghiệm không quan tâm; ở đây mỗi lần nhân hệ số là đổi luôn con số bạn đang tính. Hãy ghi lại từng lần đổi chỗ và từng hệ số nhân khi làm, nếu không đáp án cuối sẽ lệch một hệ số mà bạn không dựng lại được nữa.</p>`],

      [11, 'Determinants and invertibility',
        `<p class="y-chinh">🎯 The central theorem of the chapter: a square matrix A is invertible <strong>if and only if</strong> det A ≠ 0.</p>
<ul>
<li><strong>Statement</strong> — A is invertible ⟺ det A ≠ 0. Both directions hold, so the determinant is a complete test, not merely a hint.</li>
<li><strong>Vocabulary</strong> — a matrix with det A = 0 is called <strong>singular</strong> (or degenerate); one with det A ≠ 0 is <strong>non-singular</strong> or invertible.</li>
<li><strong>The equivalent statements</strong> — for a square A these all say the same thing: det A ≠ 0, A⁻¹ exists, Ax = 0 has only x = 0, Ax = b has exactly one solution for every b, the rows are linearly independent, and the RREF of A is I.</li>
<li><strong>What singular means for the system</strong> — det A = 0 makes Ax = 0 have nonzero solutions, so Ax = b has either no solution or infinitely many. Never exactly one.</li>
<li><strong>Numerical illustration</strong> — [1 2; 2 4] has det = 0 and is singular; its rows are proportional, and x = (2, −1) satisfies Ax = 0. Meanwhile [1 2 3; 0 4 5; 1 0 6] has det = 22 ≠ 0 and is invertible.</li>
<li><strong>Why this is a shortcut</strong> — checking invertibility used to mean running Gauss-Jordan to the end and seeing whether I appeared. Now one number decides it, and slide 10 computes that number quickly.</li>
<li><strong>Geometric reading</strong> — det A = 0 means the transformation x ↦ Ax squashes space into a lower dimension (a plane onto a line, space onto a plane). Information is lost, so no inverse map can exist.</li>
</ul>
<p class="meo">💡 When a problem asks "for which values of k is A invertible?", compute det A as a polynomial in k and solve det A = 0. The answer is "every k except the roots" — a standard exam shape.</p>
<p class="pitfall">⚠️ det A ≠ 0 certifies that an inverse <em>exists</em>; it does not tell you what the inverse is. And the theorem applies to <strong>square</strong> matrices only — a 2×3 matrix has no determinant at all, so asking whether its determinant is zero is meaningless rather than false.</p>`,
        `<p class="y-chinh">🎯 Định lý trung tâm của chương: ma trận vuông A khả nghịch <strong>khi và chỉ khi</strong> det A ≠ 0.</p>
<ul>
<li><strong>Phát biểu</strong> — A khả nghịch ⟺ det A ≠ 0. Cả hai chiều đều đúng, nên định thức là một phép kiểm trọn vẹn chứ không chỉ là gợi ý.</li>
<li><strong>Từ vựng</strong> — ma trận có det A = 0 gọi là <strong>suy biến</strong> (singular); ma trận có det A ≠ 0 gọi là không suy biến, tức khả nghịch.</li>
<li><strong>Các phát biểu tương đương</strong> — với A vuông, tất cả những câu sau nói cùng một điều: det A ≠ 0, A⁻¹ tồn tại, Ax = 0 chỉ có nghiệm x = 0, Ax = b có đúng một nghiệm với mọi b, các hàng độc lập tuyến tính, và RREF của A là I.</li>
<li><strong>Suy biến nghĩa là gì với hệ phương trình</strong> — det A = 0 làm cho Ax = 0 có nghiệm khác 0, nên Ax = b hoặc vô nghiệm hoặc có vô số nghiệm. Không bao giờ đúng một nghiệm.</li>
<li><strong>Minh hoạ bằng số</strong> — [1 2; 2 4] có det = 0 nên suy biến; hai hàng của nó tỉ lệ, và x = (2, −1) thoả Ax = 0. Trong khi đó [1 2 3; 0 4 5; 1 0 6] có det = 22 ≠ 0 nên khả nghịch.</li>
<li><strong>Vì sao đây là lối tắt</strong> — trước kia muốn kiểm khả nghịch phải chạy Gauss-Jordan tới cùng rồi xem có ra I không. Giờ chỉ một con số quyết định, mà slide 10 lại tính con số đó rất nhanh.</li>
<li><strong>Đọc theo hình học</strong> — det A = 0 nghĩa là phép biến đổi x ↦ Ax ép không gian xuống số chiều thấp hơn (mặt phẳng dẹp thành đường thẳng, không gian dẹp thành mặt phẳng). Thông tin mất đi, nên không thể có ánh xạ ngược.</li>
</ul>
<p class="meo">💡 Khi đề hỏi "với những giá trị k nào thì A khả nghịch?", hãy tính det A thành một đa thức theo k rồi giải det A = 0. Đáp án là "mọi k trừ các nghiệm đó" — một dạng đề rất chuẩn.</p>
<p class="pitfall">⚠️ det A ≠ 0 chứng nhận rằng nghịch đảo <em>tồn tại</em>; nó không cho biết nghịch đảo đó là gì. Và định lý chỉ áp dụng cho ma trận <strong>vuông</strong> — ma trận 2×3 không hề có định thức, nên hỏi định thức của nó có bằng 0 không là câu hỏi vô nghĩa chứ không phải câu sai.</p>`],

      [12, 'Worked example — the adjugate and the inverse formula',
        `<p class="y-chinh">🎯 The adjugate is the transpose of the cofactor matrix, and A⁻¹ = (1/det A)·adj(A). Worked here on A = [1 2 3; 0 1 4; 5 6 0].</p>
<ul>
<li><strong>Recipe in three moves</strong> — compute the cofactor Cᵢⱼ of every entry, arrange them into the cofactor matrix, then <strong>transpose</strong> it to get adj(A). Finally divide by det A.</li>
<li><strong>Step 1 — the determinant</strong> — expanding along row 1: det A = 1(1·0 − 4·6) − 2(0·0 − 4·5) + 3(0·6 − 1·5) = −24 + 40 − 15 = <strong>1</strong>. Non-zero, so the inverse exists.</li>
<li><strong>Step 2 — cofactors of row 1</strong> — C₁₁ = +(0 − 24) = −24, C₁₂ = −(0 − 20) = 20, C₁₃ = +(0 − 5) = −5.</li>
<li><strong>Step 3 — cofactors of row 2</strong> — C₂₁ = −(0 − 18) = 18, C₂₂ = +(0 − 15) = −15, C₂₃ = −(6 − 10) = 4.</li>
<li><strong>Step 4 — cofactors of row 3</strong> — C₃₁ = +(8 − 3) = 5, C₃₂ = −(4 − 0) = −4, C₃₃ = +(1 − 0) = 1. Cofactor matrix: [−24 20 −5; 18 −15 4; 5 −4 1].</li>
<li><strong>Step 5 — transpose</strong> — adj(A) = <strong>[−24 18 5; 20 −15 −4; −5 4 1]</strong>. Rows became columns; this is the step everyone forgets.</li>
<li><strong>Step 6 — divide</strong> — A⁻¹ = (1/1)·adj(A) = [−24 18 5; 20 −15 −4; −5 4 1], since det A happens to be 1.</li>
<li><strong>Verification</strong> — row 1 of A times column 1 of A⁻¹ is 1(−24) + 2(20) + 3(−5) = −24 + 40 − 15 = 1 ✓, and row 1 times column 2 is 1(18) + 2(−15) + 3(4) = 18 − 30 + 12 = 0 ✓ — the first row of the identity.</li>
</ul>
<p class="meo">💡 The identity A·adj(A) = (det A)·I holds for <em>every</em> square matrix, even singular ones. Multiplying A by your adjugate and checking that det A appears down the diagonal is a complete self-check before you ever divide.</p>
<p class="pitfall">⚠️ Three traps in a row: forgetting the transpose (which gives the inverse of Aᵀ instead of A), forgetting the alternating signs while building the cofactor matrix, and dividing by det A when it is 0. For n ≥ 4 this formula becomes brutally slow — n² cofactors each of size (n−1)×(n−1) — so use Gauss-Jordan on [A|I] instead and keep the adjugate for 2×2 and 3×3.</p>`,
        `<p class="y-chinh">🎯 Ma trận phụ hợp là chuyển vị của ma trận cofactor, và A⁻¹ = (1/det A)·adj(A). Ở đây giải trên A = [1 2 3; 0 1 4; 5 6 0].</p>
<ul>
<li><strong>Công thức ba nước</strong> — tính cofactor Cᵢⱼ của từng phần tử, xếp chúng thành ma trận cofactor, rồi <strong>chuyển vị</strong> ma trận đó để được adj(A). Cuối cùng chia cho det A.</li>
<li><strong>Bước 1 — tính định thức</strong> — khai triển theo hàng 1: det A = 1(1·0 − 4·6) − 2(0·0 − 4·5) + 3(0·6 − 1·5) = −24 + 40 − 15 = <strong>1</strong>. Khác 0, nên nghịch đảo tồn tại.</li>
<li><strong>Bước 2 — cofactor của hàng 1</strong> — C₁₁ = +(0 − 24) = −24, C₁₂ = −(0 − 20) = 20, C₁₃ = +(0 − 5) = −5.</li>
<li><strong>Bước 3 — cofactor của hàng 2</strong> — C₂₁ = −(0 − 18) = 18, C₂₂ = +(0 − 15) = −15, C₂₃ = −(6 − 10) = 4.</li>
<li><strong>Bước 4 — cofactor của hàng 3</strong> — C₃₁ = +(8 − 3) = 5, C₃₂ = −(4 − 0) = −4, C₃₃ = +(1 − 0) = 1. Ma trận cofactor: [−24 20 −5; 18 −15 4; 5 −4 1].</li>
<li><strong>Bước 5 — chuyển vị</strong> — adj(A) = <strong>[−24 18 5; 20 −15 −4; −5 4 1]</strong>. Hàng thành cột; đây đúng là bước ai cũng quên.</li>
<li><strong>Bước 6 — chia</strong> — A⁻¹ = (1/1)·adj(A) = [−24 18 5; 20 −15 −4; −5 4 1], vì det A tình cờ bằng 1.</li>
<li><strong>Kiểm lại</strong> — hàng 1 của A nhân cột 1 của A⁻¹ cho 1(−24) + 2(20) + 3(−5) = −24 + 40 − 15 = 1 ✓, còn hàng 1 nhân cột 2 cho 1(18) + 2(−15) + 3(4) = 18 − 30 + 12 = 0 ✓ — đúng hàng đầu của ma trận đơn vị.</li>
</ul>
<p class="meo">💡 Đẳng thức A·adj(A) = (det A)·I đúng với <em>mọi</em> ma trận vuông, kể cả ma trận suy biến. Nhân A với ma trận phụ hợp bạn vừa lập rồi xem det A có hiện ra dọc đường chéo không là một phép tự kiểm trọn vẹn, làm trước cả khi chia.</p>
<p class="pitfall">⚠️ Ba cái bẫy nối nhau: quên chuyển vị (làm ra nghịch đảo của Aᵀ chứ không phải của A), quên dấu xen kẽ khi lập ma trận cofactor, và chia cho det A khi nó bằng 0. Với n ≥ 4 công thức này chậm tàn bạo — n² cofactor, mỗi cái cỡ (n−1)×(n−1) — nên hãy dùng Gauss-Jordan trên [A|I] và chỉ để dành ma trận phụ hợp cho 2×2 với 3×3.</p>`],

      [13, "Cramer's rule",
        `<p class="y-chinh">🎯 For a square system Ax = b with det A ≠ 0, each unknown is a ratio of two determinants: xᵢ = det(Aᵢ)/det A.</p>
<ul>
<li><strong>The formula</strong> — xᵢ = det(Aᵢ)/det A for i = 1, 2, …, n, where Aᵢ is A with its <strong>i-th column replaced by b</strong>. Everything else in A stays untouched.</li>
<li><strong>What it needs</strong> — the system must be square (n equations, n unknowns) and det A ≠ 0. That is exactly the case of a unique solution from slide 11.</li>
<li><strong>Solving for one unknown only</strong> — this is the rule's real selling point. If a problem asks only for z, compute det A and det A₃ and stop; no elimination and no back-substitution.</li>
<li><strong>2×2 in full</strong> — for ax + by = e and cx + dy = f, x = (ed − bf)/(ad − bc) and y = (af − ec)/(ad − bc). The same denominator serves both unknowns.</li>
<li><strong>A quick 2×2 example</strong> — 2x + y = 5, x − y = 1. det A = −2 − 1 = −3; det A₁ = det [5 1; 1 −1] = −5 − 1 = −6 so x = 2; det A₂ = det [2 5; 1 1] = 2 − 5 = −3 so y = 1. Check: 2(2) + 1 = 5 ✓.</li>
<li><strong>Where it comes from</strong> — substitute x = A⁻¹b = (1/det A)adj(A)b and read off row i; the entry is exactly the cofactor expansion of det(Aᵢ). Cramer is the adjugate formula in disguise.</li>
<li><strong>Cost reality</strong> — an n×n system needs n + 1 determinants. For n = 10 that is eleven determinants where Gaussian elimination needs one sweep, which is why no numerical library uses Cramer.</li>
</ul>
<p class="meo">💡 Use Cramer when n is 2 or 3 <em>and</em> only one unknown is wanted, or when the answer must stay symbolic in a parameter. Otherwise elimination is faster and less error-prone.</p>
<p class="pitfall">⚠️ Cramer says nothing when det A = 0 — it does not mean "no solution", it means the rule does not apply and you must go back to elimination to see whether the system is inconsistent or has infinitely many solutions. Two mechanical traps as well: replacing a <em>row</em> instead of a column, and forgetting that the denominator is always the original det A, never det(Aᵢ).</p>`,
        `<p class="y-chinh">🎯 Với hệ vuông Ax = b có det A ≠ 0, mỗi ẩn là một tỉ số của hai định thức: xᵢ = det(Aᵢ)/det A.</p>
<ul>
<li><strong>Công thức</strong> — xᵢ = det(Aᵢ)/det A với i = 1, 2, …, n, trong đó Aᵢ là A với <strong>cột thứ i thay bằng b</strong>. Mọi thứ còn lại của A giữ nguyên.</li>
<li><strong>Điều kiện cần</strong> — hệ phải vuông (n phương trình, n ẩn) và det A ≠ 0. Đó đúng là trường hợp nghiệm duy nhất ở slide 11.</li>
<li><strong>Chỉ giải một ẩn thôi</strong> — đây mới là điểm bán hàng thật của quy tắc. Nếu đề chỉ hỏi z, hãy tính det A và det A₃ rồi dừng; không khử, không thế ngược.</li>
<li><strong>Trường hợp 2×2 viết đủ</strong> — với ax + by = e và cx + dy = f thì x = (ed − bf)/(ad − bc) và y = (af − ec)/(ad − bc). Cùng một mẫu số phục vụ cả hai ẩn.</li>
<li><strong>Một ví dụ 2×2 nhanh</strong> — 2x + y = 5, x − y = 1. det A = −2 − 1 = −3; det A₁ = det [5 1; 1 −1] = −5 − 1 = −6 nên x = 2; det A₂ = det [2 5; 1 1] = 2 − 5 = −3 nên y = 1. Kiểm: 2(2) + 1 = 5 ✓.</li>
<li><strong>Nó từ đâu ra</strong> — thay x = A⁻¹b = (1/det A)adj(A)b rồi đọc hàng thứ i; phần tử đó đúng bằng khai triển cofactor của det(Aᵢ). Cramer chính là công thức ma trận phụ hợp khoác áo khác.</li>
<li><strong>Thực tế về chi phí</strong> — hệ n×n cần n + 1 định thức. Với n = 10 là mười một định thức, trong khi khử Gauss chỉ cần một lượt quét, và đó là lý do không thư viện tính toán nào dùng Cramer.</li>
</ul>
<p class="meo">💡 Hãy dùng Cramer khi n là 2 hoặc 3 <em>và</em> đề chỉ hỏi một ẩn, hoặc khi đáp án phải giữ dạng ký hiệu theo một tham số. Ngoài ra thì khử Gauss vẫn nhanh hơn và ít sai hơn.</p>
<p class="pitfall">⚠️ Cramer không nói gì khi det A = 0 — điều đó không có nghĩa "vô nghiệm", mà nghĩa là quy tắc không áp dụng được và bạn phải quay lại phép khử để xem hệ vô nghiệm hay vô số nghiệm. Thêm hai bẫy máy móc nữa: thay <em>hàng</em> thay vì thay cột, và quên rằng mẫu số luôn là det A gốc chứ không bao giờ là det(Aᵢ).</p>`],

      [14, "Worked example — a three-unknown system by Cramer",
        `<p class="y-chinh">🎯 Solve 2x + y − z = 8, −3x − y + 2z = −11, −2x + y + 2z = −3 with Cramer's rule; the answer is (2, 3, −1).</p>
<ul>
<li><strong>Set up</strong> — A = [2 1 −1; −3 −1 2; −2 1 2] and b = (8, −11, −3). Four determinants will be needed: det A plus one per unknown.</li>
<li><strong>Step 1 — det A</strong> — expand along row 1: 2((−1)(2) − 2(1)) − 1((−3)(2) − 2(−2)) + (−1)((−3)(1) − (−1)(−2)) = 2(−4) − 1(−2) + (−1)(−5) = −8 + 2 + 5 = <strong>−1</strong>. Non-zero, so Cramer applies.</li>
<li><strong>Step 2 — det A₁</strong> — replace column 1 by b: [8 1 −1; −11 −1 2; −3 1 2]. Expanding: 8(−4) − 1(−22 + 6) + (−1)(−11 − 3) = −32 + 16 + 14 = <strong>−2</strong>, so x = (−2)/(−1) = <strong>2</strong>.</li>
<li><strong>Step 3 — det A₂</strong> — replace column 2 by b: [2 8 −1; −3 −11 2; −2 −3 2]. Expanding: 2(−22 + 6) − 8(−6 + 4) + (−1)(9 − 22) = −32 + 16 + 13 = <strong>−3</strong>, so y = (−3)/(−1) = <strong>3</strong>.</li>
<li><strong>Step 4 — det A₃</strong> — replace column 3 by b: [2 1 8; −3 −1 −11; −2 1 −3]. Expanding: 2(3 + 11) − 1(9 − 22) + 8(−3 − 2) = 28 + 13 − 40 = <strong>1</strong>, so z = 1/(−1) = <strong>−1</strong>.</li>
<li><strong>Answer</strong> — (x, y, z) = <strong>(2, 3, −1)</strong>, the same solution Gaussian elimination produced in Chapter 5 on this exact system.</li>
<li><strong>Verify in the original equations</strong> — 2(2) + 3 − (−1) = 8 ✓; −3(2) − 3 + 2(−1) = −6 − 3 − 2 = −11 ✓; −2(2) + 3 + 2(−1) = −4 + 3 − 2 = −3 ✓. All three hold.</li>
<li><strong>Effort comparison</strong> — four 3×3 determinants here, versus one elimination sweep plus back-substitution in Chapter 5. For three unknowns the two are comparable; from four unknowns on, elimination pulls far ahead.</li>
</ul>
<p class="meo">💡 Compute det A first and write it down once. If it turns out to be 0 you stop immediately, having spent one determinant instead of four.</p>
<p class="pitfall">⚠️ The negative denominator is where marks die. det A = −1, so every division flips sign: det A₃ = 1 gives z = −1, not +1. Write each quotient as an explicit fraction with its own signs before simplifying, and keep b in the correct column — it goes into column i for the unknown xᵢ, in the same row order as the equations.</p>`,
        `<p class="y-chinh">🎯 Giải 2x + y − z = 8, −3x − y + 2z = −11, −2x + y + 2z = −3 bằng quy tắc Cramer; đáp án là (2, 3, −1).</p>
<ul>
<li><strong>Dựng bài</strong> — A = [2 1 −1; −3 −1 2; −2 1 2] và b = (8, −11, −3). Sẽ cần bốn định thức: det A cộng thêm mỗi ẩn một cái.</li>
<li><strong>Bước 1 — det A</strong> — khai triển theo hàng 1: 2((−1)(2) − 2(1)) − 1((−3)(2) − 2(−2)) + (−1)((−3)(1) − (−1)(−2)) = 2(−4) − 1(−2) + (−1)(−5) = −8 + 2 + 5 = <strong>−1</strong>. Khác 0, nên Cramer dùng được.</li>
<li><strong>Bước 2 — det A₁</strong> — thay cột 1 bằng b: [8 1 −1; −11 −1 2; −3 1 2]. Khai triển: 8(−4) − 1(−22 + 6) + (−1)(−11 − 3) = −32 + 16 + 14 = <strong>−2</strong>, nên x = (−2)/(−1) = <strong>2</strong>.</li>
<li><strong>Bước 3 — det A₂</strong> — thay cột 2 bằng b: [2 8 −1; −3 −11 2; −2 −3 2]. Khai triển: 2(−22 + 6) − 8(−6 + 4) + (−1)(9 − 22) = −32 + 16 + 13 = <strong>−3</strong>, nên y = (−3)/(−1) = <strong>3</strong>.</li>
<li><strong>Bước 4 — det A₃</strong> — thay cột 3 bằng b: [2 1 8; −3 −1 −11; −2 1 −3]. Khai triển: 2(3 + 11) − 1(9 − 22) + 8(−3 − 2) = 28 + 13 − 40 = <strong>1</strong>, nên z = 1/(−1) = <strong>−1</strong>.</li>
<li><strong>Đáp án</strong> — (x, y, z) = <strong>(2, 3, −1)</strong>, đúng bằng nghiệm mà khử Gauss đã cho ở Chương 5 trên chính hệ này.</li>
<li><strong>Kiểm lại vào phương trình gốc</strong> — 2(2) + 3 − (−1) = 8 ✓; −3(2) − 3 + 2(−1) = −6 − 3 − 2 = −11 ✓; −2(2) + 3 + 2(−1) = −4 + 3 − 2 = −3 ✓. Cả ba đều đúng.</li>
<li><strong>So công sức</strong> — ở đây là bốn định thức 3×3, so với một lượt khử cộng thế ngược ở Chương 5. Với ba ẩn thì hai cách ngang nhau; từ bốn ẩn trở lên, phép khử bỏ xa Cramer.</li>
</ul>
<p class="meo">💡 Hãy tính det A trước tiên và ghi nó ra một lần. Nếu nó hoá ra bằng 0 thì bạn dừng ngay, chỉ tốn một định thức thay vì bốn.</p>
<p class="pitfall">⚠️ Mẫu số âm là chỗ điểm chết. det A = −1, nên mọi phép chia đều đảo dấu: det A₃ = 1 cho z = −1 chứ không phải +1. Hãy viết từng thương thành phân số rõ ràng kèm dấu của nó rồi mới rút gọn, và đặt b vào đúng cột — nó vào cột i khi tính ẩn xᵢ, theo đúng thứ tự hàng của các phương trình.</p>`],

      [15, 'Eigenvalues and eigenvectors',
        `<p class="y-chinh">🎯 A scalar λ is an eigenvalue of a square matrix A when there is a <strong>nonzero</strong> vector x with Ax = λx; that x is an eigenvector for λ.</p>
<ul>
<li><strong>The defining equation</strong> — Ax = λx. Multiplying by A does not rotate x at all; it only stretches it by the factor λ, or reverses it if λ is negative.</li>
<li><strong>Why x ≠ 0 is required</strong> — the zero vector satisfies A0 = λ0 for every λ, so allowing it would make every number an eigenvalue and the concept useless. λ itself is allowed to be 0, however.</li>
<li><strong>Rearranging</strong> — Ax = λx becomes Ax − λx = 0, then (A − λI)x = 0. Note the I: you subtract λ from the <em>diagonal</em>, not from every entry.</li>
<li><strong>The key step</strong> — a homogeneous system (A − λI)x = 0 has a nonzero solution exactly when A − λI is singular, which by slide 11 means det(A − λI) = 0.</li>
<li><strong>Characteristic equation</strong> — det(A − λI) = 0. Expanding the determinant gives the characteristic polynomial, of degree n for an n×n matrix, so there are at most n eigenvalues.</li>
<li><strong>Two-stage procedure</strong> — first solve the characteristic equation for λ; then, for each λ found, solve the homogeneous system (A − λI)x = 0 to get the eigenvectors.</li>
<li><strong>Eigenvectors come in families</strong> — if x is an eigenvector then so is 2x, −x, and any nonzero multiple, because A(cx) = cAx = c(λx) = λ(cx). The solution set of (A − λI)x = 0 is the eigenspace of λ.</li>
<li><strong>Two free checks</strong> — the sum of the eigenvalues equals the trace (the diagonal sum) and their product equals det A. Both take seconds and catch most algebra slips.</li>
</ul>
<p class="meo">💡 Read Ax = λx as "A leaves this direction alone". Eigenvectors are the axes along which a complicated transformation is nothing more than a scaling, which is what makes them the backbone of vibration analysis, PageRank and principal component analysis.</p>
<p class="pitfall">⚠️ Writing det(A − λ) instead of det(A − λI): subtracting a scalar from a matrix is undefined, and subtracting λ from every entry gives a different, wrong polynomial. The other classic is solving (A − λI)x = 0 and reporting x = 0 as the eigenvector — that solution always exists and is precisely the one you must discard.</p>`,
        `<p class="y-chinh">🎯 Số vô hướng λ là trị riêng của ma trận vuông A khi tồn tại vector <strong>khác 0</strong> là x sao cho Ax = λx; vector x đó là vector riêng ứng với λ.</p>
<ul>
<li><strong>Phương trình định nghĩa</strong> — Ax = λx. Nhân với A không hề xoay x đi đâu cả; nó chỉ kéo giãn x với hệ số λ, hoặc lật ngược x nếu λ âm.</li>
<li><strong>Vì sao bắt buộc x ≠ 0</strong> — vector không thoả A0 = λ0 với mọi λ, nên cho phép nó thì mọi con số đều thành trị riêng và khái niệm này vô dụng. Tuy vậy bản thân λ vẫn được phép bằng 0.</li>
<li><strong>Biến đổi lại</strong> — Ax = λx thành Ax − λx = 0, rồi (A − λI)x = 0. Chú ý chữ I: bạn trừ λ khỏi <em>đường chéo</em>, chứ không phải khỏi mọi phần tử.</li>
<li><strong>Bước then chốt</strong> — hệ thuần nhất (A − λI)x = 0 có nghiệm khác 0 đúng khi A − λI suy biến, mà theo slide 11 thì điều đó nghĩa là det(A − λI) = 0.</li>
<li><strong>Phương trình đặc trưng</strong> — det(A − λI) = 0. Khai triển định thức đó ra được đa thức đặc trưng, bậc n với ma trận n×n, nên có nhiều nhất n trị riêng.</li>
<li><strong>Quy trình hai chặng</strong> — trước hết giải phương trình đặc trưng để tìm λ; sau đó với mỗi λ tìm được, giải hệ thuần nhất (A − λI)x = 0 để lấy vector riêng.</li>
<li><strong>Vector riêng đi thành họ</strong> — nếu x là vector riêng thì 2x, −x và mọi bội khác 0 của x cũng vậy, vì A(cx) = cAx = c(λx) = λ(cx). Tập nghiệm của (A − λI)x = 0 chính là không gian riêng của λ.</li>
<li><strong>Hai phép kiểm miễn phí</strong> — tổng các trị riêng bằng vết ma trận (tổng đường chéo) và tích của chúng bằng det A. Cả hai chỉ tốn vài giây mà bắt được hầu hết lỗi đại số.</li>
</ul>
<p class="meo">💡 Hãy đọc Ax = λx thành "A để yên phương này". Vector riêng là những trục mà dọc theo đó một phép biến đổi phức tạp chỉ còn là một phép giãn, và đó là điều khiến chúng thành xương sống của phân tích dao động, thuật toán PageRank và phân tích thành phần chính.</p>
<p class="pitfall">⚠️ Viết det(A − λ) thay vì det(A − λI): trừ một số vô hướng khỏi ma trận là phép không xác định, còn trừ λ khỏi mọi phần tử lại cho ra một đa thức khác và sai. Lỗi kinh điển còn lại là giải (A − λI)x = 0 rồi báo x = 0 là vector riêng — nghiệm đó lúc nào cũng có và đúng là nghiệm phải loại bỏ.</p>`],

      [16, 'Worked example — eigenvalues and eigenvectors of a 2x2',
        `<p class="y-chinh">🎯 For A = [4 1; 2 3] the eigenvalues are λ = 5 and λ = 2, with eigenvectors (1, 1) and (1, −2).</p>
<ul>
<li><strong>Step 1 — form A − λI</strong> — subtract λ from the diagonal only: A − λI = [4−λ, 1; 2, 3−λ].</li>
<li><strong>Step 2 — characteristic equation</strong> — det(A − λI) = (4 − λ)(3 − λ) − (1)(2) = 12 − 7λ + λ² − 2 = <strong>λ² − 7λ + 10 = 0</strong>.</li>
<li><strong>Step 3 — solve it</strong> — factor as (λ − 5)(λ − 2) = 0, giving <strong>λ₁ = 5 and λ₂ = 2</strong>.</li>
<li><strong>Sanity check</strong> — trace A = 4 + 3 = 7 = 5 + 2 ✓, and det A = 12 − 2 = 10 = 5 × 2 ✓. Both checks pass, so the roots are right.</li>
<li><strong>Step 4 — eigenvector for λ₁ = 5</strong> — A − 5I = [−1 1; 2 −2], so the system is −x₁ + x₂ = 0 (the second row 2x₁ − 2x₂ = 0 is the same equation doubled). Hence x₂ = x₁ and <strong>x = (1, 1)</strong>.</li>
<li><strong>Step 5 — eigenvector for λ₂ = 2</strong> — A − 2I = [2 1; 2 1], so the system is 2x₁ + x₂ = 0, giving x₂ = −2x₁ and <strong>x = (1, −2)</strong>.</li>
<li><strong>Verify λ₁</strong> — A(1, 1) = (4 + 1, 2 + 3) = (5, 5) = 5(1, 1) ✓.</li>
<li><strong>Verify λ₂</strong> — A(1, −2) = (4 − 2, 2 − 6) = (2, −4) = 2(1, −2) ✓. Both eigenpairs are confirmed.</li>
</ul>
<p class="meo">💡 The rows of A − λI must be dependent if λ is genuinely an eigenvalue — that is what det = 0 means. When the two rows of a 2×2 do <em>not</em> reduce to one equation, your λ is wrong; treat that as an instant error detector.</p>
<p class="pitfall">⚠️ Three failures to avoid: expanding (4 − λ)(3 − λ) as 12 − λ² and losing the linear term, subtracting λ from all four entries instead of the diagonal, and picking the eigenvector (1, 2) for λ = 2 by reading the row [2 1] as coefficients-become-components. The row says 2x₁ + x₂ = 0, so the vector is (1, −2) — the signs and the swap both matter.</p>`,
        `<p class="y-chinh">🎯 Với A = [4 1; 2 3], các trị riêng là λ = 5 và λ = 2, với vector riêng (1, 1) và (1, −2).</p>
<ul>
<li><strong>Bước 1 — lập A − λI</strong> — chỉ trừ λ trên đường chéo: A − λI = [4−λ, 1; 2, 3−λ].</li>
<li><strong>Bước 2 — phương trình đặc trưng</strong> — det(A − λI) = (4 − λ)(3 − λ) − (1)(2) = 12 − 7λ + λ² − 2 = <strong>λ² − 7λ + 10 = 0</strong>.</li>
<li><strong>Bước 3 — giải nó</strong> — phân tích thành (λ − 5)(λ − 2) = 0, cho <strong>λ₁ = 5 và λ₂ = 2</strong>.</li>
<li><strong>Kiểm nhanh</strong> — vết của A là 4 + 3 = 7 = 5 + 2 ✓, và det A = 12 − 2 = 10 = 5 × 2 ✓. Cả hai phép kiểm đều đạt, nên hai nghiệm là đúng.</li>
<li><strong>Bước 4 — vector riêng ứng với λ₁ = 5</strong> — A − 5I = [−1 1; 2 −2], nên hệ là −x₁ + x₂ = 0 (hàng hai 2x₁ − 2x₂ = 0 chỉ là phương trình đó nhân đôi). Suy ra x₂ = x₁ và <strong>x = (1, 1)</strong>.</li>
<li><strong>Bước 5 — vector riêng ứng với λ₂ = 2</strong> — A − 2I = [2 1; 2 1], nên hệ là 2x₁ + x₂ = 0, cho x₂ = −2x₁ và <strong>x = (1, −2)</strong>.</li>
<li><strong>Kiểm λ₁</strong> — A(1, 1) = (4 + 1, 2 + 3) = (5, 5) = 5(1, 1) ✓.</li>
<li><strong>Kiểm λ₂</strong> — A(1, −2) = (4 − 2, 2 − 6) = (2, −4) = 2(1, −2) ✓. Cả hai cặp riêng đều được xác nhận.</li>
</ul>
<p class="meo">💡 Các hàng của A − λI bắt buộc phải phụ thuộc nhau nếu λ thật sự là trị riêng — đó chính là ý nghĩa của det = 0. Khi hai hàng của một ma trận 2×2 <em>không</em> rút về cùng một phương trình thì λ của bạn sai; hãy coi đó là máy báo lỗi tức thì.</p>
<p class="pitfall">⚠️ Ba lỗi cần tránh: khai triển (4 − λ)(3 − λ) thành 12 − λ² làm mất số hạng bậc nhất; trừ λ khỏi cả bốn phần tử thay vì chỉ đường chéo; và chọn vector riêng (1, 2) cho λ = 2 vì đọc hàng [2 1] thành "hệ số chuyển thẳng thành toạ độ". Hàng đó nói 2x₁ + x₂ = 0, nên vector là (1, −2) — cả dấu lẫn thứ tự hoán đổi đều quan trọng.</p>`],

      [17, 'Summary — diagonalisation and the whole of Chapter 7',
        `<p class="y-chinh">🎯 If an n×n matrix has n linearly independent eigenvectors it can be written A = PDP⁻¹, and that identity is where the whole chapter lands.</p>
<ol>
<li><strong>Computing a determinant</strong> — cofactor expansion along the row or column with the most zeros, the Sarrus rule for 3×3 only, or row reduction to a triangular matrix and then the product of the diagonal. On [1 2 3; 0 4 5; 1 0 6] the first two agree on 22; on [1 2 3; 2 5 3; 1 0 8] the third gives −1.</li>
<li><strong>Determinant decides invertibility</strong> — A is invertible ⟺ det A ≠ 0, and then A⁻¹ = (1/det A)·adj(A) with adj(A) the transpose of the cofactor matrix, as computed on slide 12.</li>
<li><strong>Cramer's rule</strong> — for a square system with det A ≠ 0, xᵢ = det(Aᵢ)/det A. On slide 14 that gave (2, 3, −1) from det A = −1 and det A₁, det A₂, det A₃ = −2, −3, 1.</li>
<li><strong>Eigenvalues</strong> — solve det(A − λI) = 0, then solve (A − λI)x = 0 for each root. For [4 1; 2 3]: λ = 5 with x = (1, 1), and λ = 2 with x = (1, −2).</li>
<li><strong>Diagonalisation</strong> — put the eigenvectors in the columns of P and the matching eigenvalues on the diagonal of D. Here P = [1 1; 1 −2] and D = [5 0; 0 2], and multiplying out P D P⁻¹ with P⁻¹ = [2/3 1/3; 1/3 −1/3] returns exactly [4 1; 2 3] = A ✓.</li>
<li><strong>Why anyone wants it</strong> — Aᵏ = PDᵏP⁻¹, and raising a diagonal matrix to a power just raises each diagonal entry. A hundredth power costs two multiplications instead of ninety-nine.</li>
</ol>
<p class="meo">💡 One workflow for any square matrix: compute det A by the cheapest route → non-zero means invertible → small system and one unknown wanted means Cramer, otherwise elimination → eigenvalues from det(A − λI) = 0 → check the trace and the determinant against the roots → enough independent eigenvectors means A = PDP⁻¹.</p>
<p class="pitfall">⚠️ The four marks most often lost in this chapter: using Sarrus on a 4×4, forgetting the transpose in adj(A), dividing by a negative det A without flipping the sign in Cramer, and writing det(A − λI) as det(A) − λ. And one conceptual trap: not every matrix is diagonalisable — [1 1; 0 1] has the single eigenvalue λ = 1 with only a one-dimensional eigenspace, so no invertible P exists for it.</p>`,
        `<p class="y-chinh">🎯 Nếu ma trận n×n có đủ n vector riêng độc lập tuyến tính thì nó viết được thành A = PDP⁻¹, và đẳng thức đó là nơi cả chương này đáp xuống.</p>
<ol>
<li><strong>Tính định thức</strong> — khai triển cofactor theo hàng hoặc cột nhiều số 0 nhất, quy tắc Sarrus chỉ cho 3×3, hoặc biến đổi hàng về ma trận tam giác rồi lấy tích đường chéo. Trên [1 2 3; 0 4 5; 1 0 6] hai cách đầu cùng cho 22; trên [1 2 3; 2 5 3; 1 0 8] cách thứ ba cho −1.</li>
<li><strong>Định thức quyết định tính khả nghịch</strong> — A khả nghịch ⟺ det A ≠ 0, và khi đó A⁻¹ = (1/det A)·adj(A) với adj(A) là chuyển vị của ma trận cofactor, đúng như đã tính ở slide 12.</li>
<li><strong>Quy tắc Cramer</strong> — với hệ vuông có det A ≠ 0 thì xᵢ = det(Aᵢ)/det A. Ở slide 14 nó cho (2, 3, −1) từ det A = −1 và det A₁, det A₂, det A₃ lần lượt là −2, −3, 1.</li>
<li><strong>Trị riêng</strong> — giải det(A − λI) = 0, rồi với mỗi nghiệm lại giải (A − λI)x = 0. Với [4 1; 2 3]: λ = 5 cho x = (1, 1), và λ = 2 cho x = (1, −2).</li>
<li><strong>Chéo hoá</strong> — đặt các vector riêng vào các cột của P và các trị riêng tương ứng lên đường chéo của D. Ở đây P = [1 1; 1 −2] và D = [5 0; 0 2], nhân bung P D P⁻¹ với P⁻¹ = [2/3 1/3; 1/3 −1/3] trả về đúng [4 1; 2 3] = A ✓.</li>
<li><strong>Người ta cần nó để làm gì</strong> — Aᵏ = PDᵏP⁻¹, mà nâng một ma trận chéo lên luỹ thừa chỉ là nâng từng phần tử trên đường chéo. Luỹ thừa một trăm tốn hai phép nhân thay vì chín mươi chín.</li>
</ol>
<p class="meo">💡 Một quy trình cho mọi ma trận vuông: tính det A bằng đường rẻ nhất → khác 0 nghĩa là khả nghịch → hệ nhỏ mà chỉ hỏi một ẩn thì dùng Cramer, còn lại thì khử Gauss → tìm trị riêng từ det(A − λI) = 0 → đối chiếu vết và định thức với các nghiệm → đủ vector riêng độc lập thì A = PDP⁻¹.</p>
<p class="pitfall">⚠️ Bốn chỗ mất điểm nhiều nhất trong chương này: dùng Sarrus cho ma trận 4×4; quên chuyển vị khi lập adj(A); chia cho det A âm mà không đổi dấu trong Cramer; và viết det(A − λI) thành det(A) − λ. Thêm một bẫy về khái niệm: không phải ma trận nào cũng chéo hoá được — [1 1; 0 1] chỉ có duy nhất trị riêng λ = 1 với không gian riêng một chiều, nên không tồn tại ma trận P khả nghịch nào cho nó.</p>`],
    ]),
  ].join('\n'),
};
