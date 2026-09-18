/**
 * MAE101 · Chương 5 — Linear Systems (Hệ phương trình tuyến tính), học theo từng slide.
 * Deck 'mae5' (MAE5), 16 slide, render sẵn lên CDN images/academy/MAE101/v1/mae5/NNN.webp.
 * Nội dung bám syllabus FLM (sylID 13137) + Nicholson "Linear Algebra with Applications" ch.1.
 * Mọi phép khử trong phần giảng đều đã kiểm tay:
 *   [2 1 −1 | 8; −3 −1 2 | −11; −2 1 2 | −3] → R2+1.5R1, R3+R1, R3−4R2 → nghiệm (2, 3, −1)
 *   REF [1 −1 2 | 3; 0 2 −1 | 4; 0 0 3 | 6] → thế ngược z=2, y=3, x=2
 *   RREF [1 0 2 | 3; 0 1 −1 | 5] → x1 = 3−2t, x2 = 5+t, x3 = t.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'mae5';

export default {
  title: '5.0 — Slide bài giảng: Hệ phương trình tuyến tính (16 slide)|||5.0 — Slide bài giảng: Hệ phương trình tuyến tính (16 slide)',
  slug: 'mae101-5-0-slides-he-tuyen-tinh',
  type: 'DOCUMENT',
  description: 'Toàn bộ 16 slide Chương 5 MAE101 — phương trình tuyến tính và ý nghĩa hình học, ma trận hệ số và ma trận bổ sung, ba phép biến đổi sơ cấp, dạng bậc thang và bậc thang rút gọn, khử Gauss và Gauss-Jordan giải từng bước, biến chính và biến tự do, hệ vô nghiệm và hệ thuần nhất — mỗi slide kèm giảng song ngữ, ma trận cụ thể và bẫy hay gặp khi thi.',
  content: [
    walkHead(D, 1, 16),
    walk(D, [
      [1, 'Chapter 5 — Linear Systems (cover)',
        `<p class="y-chinh">🎯 Chapter 5 of MAE101: <strong>systems of linear equations</strong> — how to solve them mechanically with matrices instead of guessing.</p>
<ul>
<li><strong>The whole chapter in one move</strong> — a system such as 2x + y − z = 8 is rewritten as a table of numbers (its augmented matrix), the table is cleaned up by row operations, and the answer is read straight off.</li>
<li><strong>Why it matters</strong> — linear systems are the computational core of linear algebra: matrix inverses, determinants, eigenvectors, least squares and every engineering model built on them all reduce to solving one.</li>
<li><strong>What this deck covers</strong> — 16 slides: linear equations and their geometry, the three-outcome theorem, augmented matrices, the three elementary row operations, REF and RREF, Gaussian and Gauss-Jordan elimination, pivot versus free variables, inconsistency, and homogeneous systems.</li>
</ul>
<p class="meo">💡 Everything in this chapter is bookkeeping on rows. Once you trust that row operations never change the solution set, the rest is arithmetic done carefully.</p>`,
        `<p class="y-chinh">🎯 Chương 5 của MAE101: <strong>hệ phương trình tuyến tính</strong> — cách giải bằng máy móc với ma trận thay vì mò nghiệm.</p>
<ul>
<li><strong>Cả chương gói trong một nước đi</strong> — một hệ như 2x + y − z = 8 được viết lại thành một bảng số (ma trận bổ sung của nó), dọn bảng đó bằng các phép biến đổi hàng, rồi đọc thẳng ra đáp án.</li>
<li><strong>Vì sao quan trọng</strong> — hệ tuyến tính là lõi tính toán của đại số tuyến tính: ma trận nghịch đảo, định thức, vectơ riêng, bình phương tối thiểu và mọi mô hình kỹ thuật dựng trên chúng đều quy về việc giải một hệ.</li>
<li><strong>Bộ slide này gồm</strong> — 16 slide: phương trình tuyến tính và hình học của nó, định lý ba khả năng, ma trận bổ sung, ba phép biến đổi hàng sơ cấp, REF và RREF, khử Gauss và Gauss-Jordan, biến chính so với biến tự do, hệ vô nghiệm, và hệ thuần nhất.</li>
</ul>
<p class="meo">💡 Mọi thứ trong chương này đều là ghi sổ trên các hàng. Khi đã tin rằng phép biến đổi hàng không làm đổi tập nghiệm thì phần còn lại chỉ là tính toán cho cẩn thận.</p>`],

      [2, 'Contents — five blocks of Chapter 5',
        `<p class="y-chinh">🎯 Chapter 5 runs through five blocks, each one feeding the next.</p>
<ol>
<li><strong>Linear equations and systems, and their geometry</strong> — slides 3–5: what counts as linear, lines and planes, and the theorem that a system has exactly one of three outcomes.</li>
<li><strong>Matrix form and the three row operations</strong> — slides 6–7: coefficient matrix A, augmented matrix [A|b], swap, scale and add.</li>
<li><strong>Echelon forms</strong> — slides 8–9: row echelon form (REF) and the unique reduced form (RREF).</li>
<li><strong>The two algorithms</strong> — slides 10–12: Gaussian elimination plus back-substitution, worked in full, then Gauss-Jordan.</li>
<li><strong>Structure of the solution set</strong> — slides 13–15: pivot and free variables, inconsistent systems, homogeneous systems. Slide 16 is the summary.</li>
</ol>`,
        `<p class="y-chinh">🎯 Chương 5 chạy qua năm khối, khối trước nuôi khối sau.</p>
<ol>
<li><strong>Phương trình, hệ tuyến tính và hình học của chúng</strong> — slide 3–5: thế nào là tuyến tính, đường thẳng và mặt phẳng, và định lý nói hệ chỉ rơi vào đúng một trong ba khả năng.</li>
<li><strong>Dạng ma trận và ba phép biến đổi hàng</strong> — slide 6–7: ma trận hệ số A, ma trận bổ sung [A|b], đổi chỗ, nhân hằng số và cộng bội.</li>
<li><strong>Các dạng bậc thang</strong> — slide 8–9: dạng bậc thang (REF) và dạng bậc thang rút gọn duy nhất (RREF).</li>
<li><strong>Hai thuật toán</strong> — slide 10–12: khử Gauss cộng thế ngược, giải đủ từng bước, rồi đến Gauss-Jordan.</li>
<li><strong>Cấu trúc tập nghiệm</strong> — slide 13–15: biến chính và biến tự do, hệ vô nghiệm, hệ thuần nhất. Slide 16 là phần tổng kết.</li>
</ol>`],

      [3, 'Linear equations and systems',
        `<p class="y-chinh">🎯 A linear equation in n unknowns has the shape a₁x₁ + a₂x₂ + ⋯ + aₙxₙ = b: every unknown appears to the first power only and is multiplied by a constant.</p>
<ul>
<li><strong>The parts</strong> — a₁, …, aₙ are the <em>coefficients</em>, b is the <em>right-hand side</em> (constant term), and x₁, …, xₙ are the unknowns. Coefficients and b are fixed numbers; only the x's are unknown.</li>
<li><strong>What is allowed</strong> — 2x + y − z = 8 is linear. So is 3x₁ + πx₂ = √5: the constants may be as ugly as they like, linearity is a statement about the <em>unknowns</em>.</li>
<li><strong>What is not allowed</strong> — x², xy, x/y, √x, sin x, 2ˣ. Any unknown raised to a power other than 1, or two unknowns multiplied together, breaks linearity.</li>
<li><strong>A system</strong> — m equations in the same n unknowns, considered together. Example with m = 3, n = 3: 2x + y − z = 8, −3x − y + 2z = −11, −2x + y + 2z = −3.</li>
<li><strong>What a solution is</strong> — an ordered tuple (x₁, x₂, …, xₙ) that satisfies <em>every</em> equation at the same time. Satisfying only some of them is worth nothing.</li>
<li><strong>Checking a candidate</strong> — substitute (2, 3, −1) into the system above: 2(2) + 3 − (−1) = 8 ✓, −3(2) − 3 + 2(−1) = −11 ✓, −2(2) + 3 + 2(−1) = −3 ✓. All three hold, so it is a genuine solution.</li>
<li><strong>Vocabulary</strong> — a system with at least one solution is <em>consistent</em>; one with none is <em>inconsistent</em>.</li>
</ul>
<p class="meo">💡 Fast linearity test: cover every unknown with your thumb. If what remains beside each one is a plain number, the equation is linear; if an unknown is still peeking out, it is not.</p>
<p class="pitfall">⚠️ Exam trap: calling xy = 0 linear "because there are no squares". The product of two unknowns is degree 2 and is not linear. Equally, 1/x = 3 is not linear even though x appears once.</p>`,
        `<p class="y-chinh">🎯 Phương trình tuyến tính n ẩn có dạng a₁x₁ + a₂x₂ + ⋯ + aₙxₙ = b: mọi ẩn chỉ xuất hiện ở bậc 1 và được nhân với một hằng số.</p>
<ul>
<li><strong>Các thành phần</strong> — a₁, …, aₙ là <em>hệ số</em>, b là <em>vế phải</em> (số hạng tự do), còn x₁, …, xₙ là các ẩn. Hệ số và b là những số cố định; chỉ các x mới là ẩn.</li>
<li><strong>Cái gì được phép</strong> — 2x + y − z = 8 là tuyến tính. 3x₁ + πx₂ = √5 cũng vậy: hằng số xấu đến đâu cũng được, tính tuyến tính là nói về <em>các ẩn</em>.</li>
<li><strong>Cái gì không được phép</strong> — x², xy, x/y, √x, sin x, 2ˣ. Bất kỳ ẩn nào mang bậc khác 1, hoặc hai ẩn nhân với nhau, đều phá vỡ tính tuyến tính.</li>
<li><strong>Một hệ</strong> — m phương trình trên cùng n ẩn, xét đồng thời. Ví dụ với m = 3, n = 3: 2x + y − z = 8, −3x − y + 2z = −11, −2x + y + 2z = −3.</li>
<li><strong>Nghiệm là gì</strong> — một bộ có thứ tự (x₁, x₂, …, xₙ) thoả <em>mọi</em> phương trình cùng lúc. Chỉ thoả một vài phương trình thì không có giá trị gì.</li>
<li><strong>Kiểm một bộ ứng viên</strong> — thay (2, 3, −1) vào hệ trên: 2(2) + 3 − (−1) = 8 ✓, −3(2) − 3 + 2(−1) = −11 ✓, −2(2) + 3 + 2(−1) = −3 ✓. Cả ba đều đúng, vậy đó là nghiệm thật.</li>
<li><strong>Từ vựng</strong> — hệ có ít nhất một nghiệm gọi là <em>tương thích</em> (consistent); hệ không có nghiệm nào gọi là <em>không tương thích</em> (inconsistent), tức vô nghiệm.</li>
</ul>
<p class="meo">💡 Cách kiểm tuyến tính nhanh: lấy ngón tay che từng ẩn lại. Nếu bên cạnh mỗi ẩn chỉ còn một con số thuần thì phương trình là tuyến tính; nếu vẫn còn một ẩn ló ra thì không phải.</p>
<p class="pitfall">⚠️ Bẫy thi: gọi xy = 0 là tuyến tính "vì có thấy bình phương đâu". Tích hai ẩn là bậc 2, không tuyến tính. Tương tự 1/x = 3 cũng không tuyến tính dù x chỉ xuất hiện một lần.</p>`],

      [4, 'Geometric meaning with two unknowns',
        `<p class="y-chinh">🎯 Each linear equation in two unknowns is a <strong>straight line</strong>; solving a system means finding where the lines meet.</p>
<ul>
<li><strong>One equation, one line</strong> — ax + by = c draws a line in the plane. Every point on that line is a solution of that single equation, so one equation in two unknowns already has infinitely many solutions.</li>
<li><strong>Case 1 — the lines cross</strong> — exactly one common point, so the system has a <strong>unique solution</strong>. Example: x + y = 3 and x − y = 1 meet at (2, 1).</li>
<li><strong>Case 2 — the lines are parallel</strong> — no common point, so the system is <strong>inconsistent</strong>. Example: x + y = 3 and x + y = 5; the same left-hand side cannot equal two different numbers.</li>
<li><strong>Case 3 — the lines coincide</strong> — every point is common, so there are <strong>infinitely many solutions</strong>. Example: x + y = 3 and 2x + 2y = 6, where the second equation is just the first doubled.</li>
<li><strong>How to tell cases 2 and 3 apart</strong> — both have proportional coefficients. If the right-hand side follows the same proportion the lines coincide; if it does not, they are parallel.</li>
<li><strong>Three unknowns</strong> — each equation is now a <strong>plane</strong> in space. Two planes meet in a line (infinitely many solutions), three planes usually meet in a single point (unique), and planes can also be parallel or share a whole common line.</li>
<li><strong>The moral</strong> — the algebra of slides 10–12 is only an automatic way of finding these intersections when there are too many unknowns to draw.</li>
</ul>
<p class="meo">💡 Sketch two lines on scrap paper before you start eliminating. Knowing in advance whether to expect one point, none, or a whole line tells you immediately whether your final answer is plausible.</p>
<p class="pitfall">⚠️ Reading "two equations, two unknowns" as "therefore a unique solution". The count of equations proves nothing on its own: x + y = 3 with 2x + 2y = 7 has two equations, two unknowns and no solution at all.</p>`,
        `<p class="y-chinh">🎯 Mỗi phương trình tuyến tính hai ẩn là một <strong>đường thẳng</strong>; giải hệ chính là tìm chỗ các đường thẳng gặp nhau.</p>
<ul>
<li><strong>Một phương trình, một đường thẳng</strong> — ax + by = c vẽ nên một đường thẳng trong mặt phẳng. Mọi điểm trên đường đó đều là nghiệm của riêng phương trình ấy, nên một phương trình hai ẩn đã có vô số nghiệm.</li>
<li><strong>Trường hợp 1 — hai đường cắt nhau</strong> — đúng một điểm chung, nên hệ có <strong>nghiệm duy nhất</strong>. Ví dụ: x + y = 3 và x − y = 1 gặp nhau tại (2, 1).</li>
<li><strong>Trường hợp 2 — hai đường song song</strong> — không có điểm chung, nên hệ <strong>vô nghiệm</strong>. Ví dụ: x + y = 3 và x + y = 5; cùng một vế trái không thể bằng hai số khác nhau.</li>
<li><strong>Trường hợp 3 — hai đường trùng nhau</strong> — mọi điểm đều chung, nên có <strong>vô số nghiệm</strong>. Ví dụ: x + y = 3 và 2x + 2y = 6, phương trình sau chỉ là phương trình trước nhân đôi.</li>
<li><strong>Phân biệt trường hợp 2 với 3</strong> — cả hai đều có hệ số tỉ lệ với nhau. Nếu vế phải cũng theo đúng tỉ lệ đó thì hai đường trùng nhau; nếu không theo thì chúng song song.</li>
<li><strong>Với ba ẩn</strong> — mỗi phương trình giờ là một <strong>mặt phẳng</strong> trong không gian. Hai mặt phẳng cắt nhau theo một đường thẳng (vô số nghiệm), ba mặt phẳng thường gặp nhau tại một điểm (duy nhất), và mặt phẳng cũng có thể song song hoặc chung nguyên một đường thẳng.</li>
<li><strong>Bài học rút ra</strong> — phần đại số ở slide 10–12 chỉ là cách tìm các giao đó một cách tự động khi số ẩn nhiều đến mức không vẽ nổi.</li>
</ul>
<p class="meo">💡 Hãy phác hai đường thẳng ra giấy nháp trước khi bắt đầu khử. Biết trước là sẽ ra một điểm, không điểm nào, hay cả một đường thẳng sẽ giúp bạn biết ngay đáp án cuối có hợp lý không.</p>
<p class="pitfall">⚠️ Hiểu "hai phương trình, hai ẩn" thành "vậy có nghiệm duy nhất". Số phương trình tự nó không chứng minh được gì: x + y = 3 với 2x + 2y = 7 có hai phương trình, hai ẩn và không có nghiệm nào cả.</p>`],

      [5, 'Number of solutions — exactly three cases',
        `<p class="y-chinh">🎯 Theorem: every linear system falls into <strong>exactly one</strong> of three cases — a unique solution, no solution, or infinitely many.</p>
<ul>
<li><strong>Case 1 — consistent with a unique solution</strong> — the augmented matrix reduces to something like [1 0 0 | 2; 0 1 0 | 3; 0 0 1 | −1], giving (x, y, z) = (2, 3, −1) and nothing else.</li>
<li><strong>Case 2 — inconsistent, no solution</strong> — elimination produces a row [0 0 0 | c] with c ≠ 0, which reads 0 = c. Impossible, so the solution set is empty.</li>
<li><strong>Case 3 — consistent with infinitely many solutions</strong> — elimination leaves at least one column without a pivot, so at least one unknown is free and can take any real value.</li>
<li><strong>What can never happen</strong> — a linear system can never have exactly 2, exactly 5, or any other finite number of solutions greater than one. "Exactly two solutions" is always a wrong answer in this chapter.</li>
<li><strong>Why two solutions force infinitely many</strong> — if u and v are both solutions then so is every point on the line through them: u + t(v − u) satisfies the system for every real t. Linearity is what spreads two solutions into a continuum.</li>
<li><strong>The geometric mirror</strong> — one point, no point, or a whole line/plane of points. Exactly the three pictures from slide 4.</li>
<li><strong>How you decide in practice</strong> — reduce the matrix, then look: a bad row [0 0 0 | c≠0] ⇒ case 2; otherwise count pivots — pivots equal to the number of unknowns ⇒ case 1, fewer ⇒ case 3.</li>
</ul>
<p class="meo">💡 Turn the theorem into a two-question checklist: first "is there a contradictory row?", then "is every unknown a pivot?". Those two answers pin down the case every time.</p>
<p class="pitfall">⚠️ Concluding "infinitely many solutions" just because there are more unknowns than equations. That guarantees no unique solution, but the system may still be inconsistent — x + y + z = 1 together with x + y + z = 2 has three unknowns, two equations, and no solution.</p>`,
        `<p class="y-chinh">🎯 Định lý: mọi hệ tuyến tính rơi vào <strong>đúng một</strong> trong ba khả năng — nghiệm duy nhất, vô nghiệm, hoặc vô số nghiệm.</p>
<ul>
<li><strong>Khả năng 1 — có nghiệm và nghiệm duy nhất</strong> — ma trận bổ sung rút gọn về dạng như [1 0 0 | 2; 0 1 0 | 3; 0 0 1 | −1], cho (x, y, z) = (2, 3, −1) và không còn gì khác.</li>
<li><strong>Khả năng 2 — vô nghiệm</strong> — quá trình khử sinh ra một hàng [0 0 0 | c] với c ≠ 0, đọc ra là 0 = c. Vô lý, nên tập nghiệm rỗng.</li>
<li><strong>Khả năng 3 — có nghiệm và vô số nghiệm</strong> — khử xong vẫn còn ít nhất một cột không có pivot, nên có ít nhất một ẩn tự do nhận giá trị thực bất kỳ.</li>
<li><strong>Điều không bao giờ xảy ra</strong> — hệ tuyến tính không bao giờ có đúng 2, đúng 5, hay bất kỳ số nghiệm hữu hạn nào lớn hơn một. "Đúng hai nghiệm" luôn là đáp án sai trong chương này.</li>
<li><strong>Vì sao hai nghiệm kéo theo vô số nghiệm</strong> — nếu u và v đều là nghiệm thì mọi điểm trên đường thẳng nối chúng cũng là nghiệm: u + t(v − u) thoả hệ với mọi số thực t. Chính tính tuyến tính đã trải hai nghiệm thành cả một dải liên tục.</li>
<li><strong>Tấm gương hình học</strong> — một điểm, không điểm nào, hoặc cả một đường thẳng / mặt phẳng điểm. Đúng ba bức tranh ở slide 4.</li>
<li><strong>Thực tế bạn quyết định thế nào</strong> — rút gọn ma trận rồi nhìn: có hàng xấu [0 0 0 | c≠0] ⇒ khả năng 2; nếu không thì đếm pivot — số pivot bằng số ẩn ⇒ khả năng 1, ít hơn ⇒ khả năng 3.</li>
</ul>
<p class="meo">💡 Biến định lý thành bảng kiểm hai câu: trước hết "có hàng mâu thuẫn không?", rồi "mọi ẩn có đều là pivot không?". Hai câu trả lời đó chốt được khả năng nào, lần nào cũng đúng.</p>
<p class="pitfall">⚠️ Kết luận "vô số nghiệm" chỉ vì số ẩn nhiều hơn số phương trình. Điều đó chỉ bảo đảm không có nghiệm duy nhất, chứ hệ vẫn có thể vô nghiệm — x + y + z = 1 đi cùng x + y + z = 2 có ba ẩn, hai phương trình, và không có nghiệm nào.</p>`],

      [6, 'Coefficient matrix and augmented matrix',
        `<p class="y-chinh">🎯 Strip a system down to its numbers: the coefficients form the matrix A, and gluing the right-hand side on as one extra column gives the augmented matrix [A|b].</p>
<ul>
<li><strong>The system on the slide</strong> — 2x + y − z = 8, −3x − y + 2z = −11, −2x + y + 2z = −3.</li>
<li><strong>Coefficient matrix A</strong> — read row by row: [2 1 −1; −3 −1 2; −2 1 2]. Three rows because there are three equations, three columns because there are three unknowns.</li>
<li><strong>Augmented matrix [A|b]</strong> — the same thing plus the constants: [2 1 −1 | 8; −3 −1 2 | −11; −2 1 2 | −3]. The bar is only a visual reminder of where the equals sign used to be.</li>
<li><strong>What each part means</strong> — every <em>row</em> is one whole equation, every <em>column</em> on the left belongs to one unknown (column 1 to x, column 2 to y, column 3 to z), and the last column is b.</li>
<li><strong>Zeros are compulsory</strong> — if an equation is x + 2z = 4, the missing y must be written as a 0: the row is [1 0 2 | 4], not [1 2 | 4]. Columns only align if every slot is filled.</li>
<li><strong>Keep the order fixed</strong> — before building the matrix, rewrite every equation with the unknowns in the same order and the constants alone on the right.</li>
<li><strong>Why bother</strong> — the letters x, y, z do no work during elimination; carrying them costs writing and invites mistakes. The matrix keeps only the information that changes.</li>
</ul>
<p class="meo">💡 Sizes are your safety net: a system of m equations in n unknowns always gives an A of size m×n and an [A|b] of size m×(n+1). If your matrix has the wrong shape, you dropped a term.</p>
<p class="pitfall">⚠️ The two classic entry mistakes: forgetting a zero for a missing unknown, and losing a minus sign by writing −3x − y + 2z = −11 as the row [3 1 2 | 11]. Copy signs exactly, including the one on b.</p>`,
        `<p class="y-chinh">🎯 Lột hệ xuống còn các con số: các hệ số lập nên ma trận A, dán thêm vế phải thành một cột nữa thì được ma trận bổ sung [A|b].</p>
<ul>
<li><strong>Hệ trên slide</strong> — 2x + y − z = 8, −3x − y + 2z = −11, −2x + y + 2z = −3.</li>
<li><strong>Ma trận hệ số A</strong> — đọc theo từng hàng: [2 1 −1; −3 −1 2; −2 1 2]. Ba hàng vì có ba phương trình, ba cột vì có ba ẩn.</li>
<li><strong>Ma trận bổ sung [A|b]</strong> — vẫn thế nhưng thêm các hằng số: [2 1 −1 | 8; −3 −1 2 | −11; −2 1 2 | −3]. Gạch đứng chỉ là dấu nhắc mắt về chỗ dấu bằng từng nằm.</li>
<li><strong>Từng phần nghĩa là gì</strong> — mỗi <em>hàng</em> là trọn một phương trình, mỗi <em>cột</em> bên trái thuộc về một ẩn (cột 1 là x, cột 2 là y, cột 3 là z), còn cột cuối là b.</li>
<li><strong>Số 0 là bắt buộc</strong> — nếu một phương trình là x + 2z = 4 thì ẩn y vắng mặt phải được viết thành số 0: hàng đó là [1 0 2 | 4], không phải [1 2 | 4]. Các cột chỉ thẳng hàng khi mọi ô đều được điền.</li>
<li><strong>Giữ nguyên thứ tự ẩn</strong> — trước khi lập ma trận, hãy viết lại mọi phương trình với các ẩn theo cùng một thứ tự và hằng số đứng riêng bên phải.</li>
<li><strong>Việc gì phải làm vậy</strong> — các chữ x, y, z chẳng làm gì trong lúc khử; mang chúng theo vừa tốn chữ vừa dễ sai. Ma trận chỉ giữ lại đúng phần thông tin có thay đổi.</li>
</ul>
<p class="meo">💡 Kích thước là lưới an toàn: hệ m phương trình n ẩn luôn cho A cỡ m×n và [A|b] cỡ m×(n+1). Ma trận sai hình là bạn đã làm rơi một số hạng.</p>
<p class="pitfall">⚠️ Hai lỗi ghi số kinh điển: quên số 0 cho ẩn vắng mặt, và mất dấu trừ khi viết −3x − y + 2z = −11 thành hàng [3 1 2 | 11]. Hãy chép dấu chính xác, kể cả dấu của b.</p>`],

      [7, 'The three elementary row operations',
        `<p class="y-chinh">🎯 Three operations on the rows of [A|b] are allowed, and none of them changes the solution set.</p>
<ul>
<li><strong>Operation 1 — swap</strong> — exchange two rows, written Rᵢ ↔ Rⱼ. This just reorders the equations, and order never mattered.</li>
<li><strong>Operation 2 — scale</strong> — multiply one row by a constant c ≠ 0, written Rᵢ → cRᵢ. Multiplying 2x + y = 8 by 3 gives 6x + 3y = 24, the same equation in disguise.</li>
<li><strong>Operation 3 — add a multiple of another row</strong> — Rᵢ → Rᵢ + cRⱼ. This is the workhorse: it is how zeros are created under a pivot.</li>
<li><strong>Worked micro-example</strong> — with R1 = [2 1 −1 | 8] and R3 = [−2 1 2 | −3], the operation R3 → R3 + R1 gives [−2+2, 1+1, 2+(−1) | −3+8] = [0 2 1 | 5]. The x entry is now 0.</li>
<li><strong>Why c ≠ 0 in operation 2</strong> — multiplying a row by 0 would turn a real equation into 0 = 0 and silently throw information away. That is the one forbidden scaling.</li>
<li><strong>Every operation is reversible</strong> — swap undoes itself, Rᵢ → cRᵢ is undone by Rᵢ → (1/c)Rᵢ, and Rᵢ → Rᵢ + cRⱼ is undone by Rᵢ → Rᵢ − cRⱼ. Reversibility is exactly why no solution can be gained or lost.</li>
<li><strong>Row equivalence</strong> — two matrices linked by a chain of these operations are called <em>row equivalent</em>, written A ~ B, and they represent systems with identical solution sets.</li>
</ul>
<p class="meo">💡 Write the operation you used beside every new matrix ("R3 → R3 − 4R2"). It costs one line and makes an arithmetic slip findable instead of fatal.</p>
<p class="pitfall">⚠️ In Rᵢ → Rᵢ + cRⱼ only <strong>row i changes</strong>; row j stays exactly as it was. Overwriting both rows at once is the most common way students corrupt an elimination — and column operations are not allowed at all, because they would scramble which unknown is which.</p>`,
        `<p class="y-chinh">🎯 Có ba phép được phép làm trên các hàng của [A|b], và không phép nào làm đổi tập nghiệm.</p>
<ul>
<li><strong>Phép 1 — đổi chỗ</strong> — hoán vị hai hàng, viết Rᵢ ↔ Rⱼ. Việc này chỉ sắp xếp lại thứ tự các phương trình, mà thứ tự thì chưa bao giờ quan trọng.</li>
<li><strong>Phép 2 — nhân hằng số</strong> — nhân một hàng với hằng số c ≠ 0, viết Rᵢ → cRᵢ. Nhân 2x + y = 8 với 3 được 6x + 3y = 24, vẫn là phương trình đó khoác áo khác.</li>
<li><strong>Phép 3 — cộng bội của hàng khác</strong> — Rᵢ → Rᵢ + cRⱼ. Đây là con ngựa kéo chính: nó là cách tạo ra các số 0 nằm dưới pivot.</li>
<li><strong>Ví dụ nhỏ có giải</strong> — với R1 = [2 1 −1 | 8] và R3 = [−2 1 2 | −3], phép R3 → R3 + R1 cho [−2+2, 1+1, 2+(−1) | −3+8] = [0 2 1 | 5]. Ô của x giờ đã bằng 0.</li>
<li><strong>Vì sao phải c ≠ 0 ở phép 2</strong> — nhân một hàng với 0 sẽ biến một phương trình thật thành 0 = 0 và âm thầm vứt mất thông tin. Đó là phép nhân duy nhất bị cấm.</li>
<li><strong>Mọi phép đều đảo ngược được</strong> — đổi chỗ tự nó hoàn tác, Rᵢ → cRᵢ được hoàn tác bằng Rᵢ → (1/c)Rᵢ, còn Rᵢ → Rᵢ + cRⱼ được hoàn tác bằng Rᵢ → Rᵢ − cRⱼ. Chính tính đảo ngược này bảo đảm không nghiệm nào bị thêm vào hay mất đi.</li>
<li><strong>Tương đương hàng</strong> — hai ma trận nối với nhau bằng một chuỗi các phép trên gọi là <em>tương đương hàng</em>, viết A ~ B, và chúng biểu diễn những hệ có tập nghiệm y hệt nhau.</li>
</ul>
<p class="meo">💡 Hãy ghi phép biến đổi đã dùng bên cạnh mỗi ma trận mới ("R3 → R3 − 4R2"). Tốn một dòng nhưng biến một lỗi tính tay từ chỗ chí mạng thành chỗ tìm lại được.</p>
<p class="pitfall">⚠️ Trong Rᵢ → Rᵢ + cRⱼ thì <strong>chỉ hàng i đổi</strong>; hàng j giữ nguyên như cũ. Ghi đè cả hai hàng cùng lúc là cách phổ biến nhất khiến cả bài khử hỏng — và phép biến đổi cột thì hoàn toàn không được phép, vì nó sẽ làm loạn ẩn nào là ẩn nào.</p>`],

      [8, 'Row echelon form (REF)',
        `<p class="y-chinh">🎯 A matrix is in row echelon form when its nonzero rows form a descending staircase, with all zeros below each leading entry.</p>
<ul>
<li><strong>Condition 1</strong> — any row of all zeros sits at the <strong>bottom</strong> of the matrix, below every nonzero row.</li>
<li><strong>Condition 2</strong> — in each nonzero row the first nonzero entry, called the <strong>pivot</strong> (or leading entry), lies strictly to the <strong>right</strong> of the pivot in the row above it.</li>
<li><strong>Condition 3</strong> — every entry <strong>below</strong> a pivot is 0. This follows from condition 2 but is worth checking separately when you verify your work.</li>
<li><strong>The example on the slide</strong> — [1 −1 2 | 3; 0 2 −1 | 4; 0 0 3 | 6]. Pivots are 1 (row 1, column 1), 2 (row 2, column 2) and 3 (row 3, column 3): each is one step further right, and everything under them is 0.</li>
<li><strong>Reading it back</strong> — the rows say x − y + 2z = 3, 2y − z = 4, 3z = 6. The last equation has a single unknown, which is the point of the whole staircase.</li>
<li><strong>Solving by back-substitution</strong> — 3z = 6 ⇒ z = 2; then 2y − 2 = 4 ⇒ 2y = 6 ⇒ y = 3; then x − 3 + 4 = 3 ⇒ x = 2. Solution (2, 3, 2).</li>
<li><strong>Not unique</strong> — a matrix has many valid REFs, because the pivots need not be 1 and different choices of operations give different staircases. Two classmates can both be right with different REFs.</li>
</ul>
<p class="meo">💡 Check REF with your eyes, not with algebra: cover the pivots with a pencil line and the region below-left of that line must be entirely zeros.</p>
<p class="pitfall">⚠️ "One step right each row" is a minimum, not an exact rule — a pivot may jump two or more columns, and that is exactly what produces a free variable. A row like [0 0 1 | 4] below [1 2 3 | 5] is perfectly valid REF.</p>`,
        `<p class="y-chinh">🎯 Ma trận ở dạng bậc thang khi các hàng khác 0 xếp thành một bậc thang đi xuống, và mọi số dưới mỗi phần tử dẫn đầu đều bằng 0.</p>
<ul>
<li><strong>Điều kiện 1</strong> — mọi hàng toàn số 0 nằm ở <strong>dưới cùng</strong> ma trận, dưới mọi hàng khác 0.</li>
<li><strong>Điều kiện 2</strong> — trong mỗi hàng khác 0, phần tử khác 0 đầu tiên, gọi là <strong>pivot</strong> (phần tử dẫn đầu), nằm thực sự về <strong>bên phải</strong> pivot của hàng ngay trên.</li>
<li><strong>Điều kiện 3</strong> — mọi phần tử <strong>dưới</strong> một pivot đều bằng 0. Điều này suy ra từ điều kiện 2 nhưng vẫn nên kiểm riêng khi soát lại bài.</li>
<li><strong>Ví dụ trên slide</strong> — [1 −1 2 | 3; 0 2 −1 | 4; 0 0 3 | 6]. Các pivot là 1 (hàng 1, cột 1), 2 (hàng 2, cột 2) và 3 (hàng 3, cột 3): mỗi cái lùi thêm một bước sang phải, và mọi thứ bên dưới chúng đều là 0.</li>
<li><strong>Đọc ngược lại</strong> — các hàng nói x − y + 2z = 3, 2y − z = 4, 3z = 6. Phương trình cuối chỉ còn một ẩn, và đó chính là mục đích của cả cái bậc thang.</li>
<li><strong>Giải bằng thế ngược</strong> — 3z = 6 ⇒ z = 2; rồi 2y − 2 = 4 ⇒ 2y = 6 ⇒ y = 3; rồi x − 3 + 4 = 3 ⇒ x = 2. Nghiệm (2, 3, 2).</li>
<li><strong>Không duy nhất</strong> — một ma trận có nhiều dạng bậc thang hợp lệ, vì pivot không nhất thiết bằng 1 và chọn phép biến đổi khác nhau sẽ ra bậc thang khác nhau. Hai bạn cùng lớp có thể cùng đúng với hai REF khác nhau.</li>
</ul>
<p class="meo">💡 Kiểm REF bằng mắt chứ đừng bằng đại số: lấy bút gạch một đường qua các pivot, vùng nằm phía dưới bên trái đường đó bắt buộc phải toàn số 0.</p>
<p class="pitfall">⚠️ "Mỗi hàng lùi sang phải một bước" là mức tối thiểu chứ không phải quy tắc chính xác — pivot có thể nhảy hai cột trở lên, và đó đúng là thứ sinh ra biến tự do. Một hàng như [0 0 1 | 4] nằm dưới [1 2 3 | 5] vẫn là REF hoàn toàn hợp lệ.</p>`],

      [9, 'Reduced row echelon form (RREF)',
        `<p class="y-chinh">🎯 RREF is row echelon form plus two extra demands: every pivot equals 1, and every pivot is the only nonzero entry in its column.</p>
<ul>
<li><strong>Extra condition 1 — leading 1s</strong> — each pivot must be exactly 1. If a pivot is 3, apply Rᵢ → (1/3)Rᵢ to fix it.</li>
<li><strong>Extra condition 2 — clean columns</strong> — in a pivot column, every other entry is 0, <em>above</em> the pivot as well as below. REF only cleans below; RREF cleans both directions.</li>
<li><strong>The example on the slide</strong> — [1 0 0 | 2; 0 1 0 | 3; 0 0 1 | −1]. Three leading 1s, and each of columns 1, 2, 3 contains nothing else but zeros.</li>
<li><strong>Reading the answer</strong> — the rows say x = 2, y = 3, z = −1 directly. No back-substitution, no arithmetic: the last column <em>is</em> the solution.</li>
<li><strong>Turning the REF of slide 8 into RREF</strong> — from [1 −1 2 | 3; 0 2 −1 | 4; 0 0 3 | 6]: R3 → (1/3)R3 gives [0 0 1 | 2]; R2 → (1/2)(R2 + R3) gives [0 1 0 | 3]; then R1 → R1 + R2 − 2R3 gives [1 0 0 | 2]. Result: x = 2, y = 3, z = 2, matching the back-substitution.</li>
<li><strong>Uniqueness</strong> — REF is not unique, but <strong>RREF is</strong>: each matrix has exactly one reduced row echelon form, whatever route you take to get there.</li>
<li><strong>Why uniqueness is useful</strong> — it makes RREF a canonical fingerprint. Two people who both reduce correctly must end with identical matrices, so a mismatch proves someone made an arithmetic error.</li>
</ul>
<p class="meo">💡 Quick RREF test, in order: are all zero rows at the bottom, is every pivot a 1, does each pivot lie right of the one above, and is every pivot column otherwise all zeros? Four yeses means RREF.</p>
<p class="pitfall">⚠️ Stopping at "pivots are 1" and calling it RREF. [1 2 0 | 3; 0 1 0 | 4] has leading 1s but the 2 sits above the second pivot, so it is only REF. Also note the last column is never a pivot column in a consistent system — a leading 1 there means the row reads 0 = 1.</p>`,
        `<p class="y-chinh">🎯 RREF là dạng bậc thang cộng thêm hai đòi hỏi: mọi pivot bằng 1, và mỗi pivot là phần tử khác 0 duy nhất trong cột của nó.</p>
<ul>
<li><strong>Điều kiện thêm 1 — pivot bằng 1</strong> — mỗi pivot phải đúng bằng 1. Nếu pivot đang là 3 thì dùng Rᵢ → (1/3)Rᵢ để sửa.</li>
<li><strong>Điều kiện thêm 2 — cột sạch</strong> — trong một cột có pivot, mọi ô còn lại đều bằng 0, <em>trên</em> pivot cũng như dưới. REF chỉ dọn phía dưới; RREF dọn cả hai chiều.</li>
<li><strong>Ví dụ trên slide</strong> — [1 0 0 | 2; 0 1 0 | 3; 0 0 1 | −1]. Ba số 1 dẫn đầu, và mỗi cột 1, 2, 3 không chứa gì ngoài các số 0.</li>
<li><strong>Đọc đáp án</strong> — các hàng nói thẳng x = 2, y = 3, z = −1. Không thế ngược, không tính toán gì: cột cuối <em>chính là</em> nghiệm.</li>
<li><strong>Biến REF ở slide 8 thành RREF</strong> — từ [1 −1 2 | 3; 0 2 −1 | 4; 0 0 3 | 6]: R3 → (1/3)R3 cho [0 0 1 | 2]; R2 → (1/2)(R2 + R3) cho [0 1 0 | 3]; rồi R1 → R1 + R2 − 2R3 cho [1 0 0 | 2]. Kết quả: x = 2, y = 3, z = 2, khớp đúng với cách thế ngược.</li>
<li><strong>Tính duy nhất</strong> — REF thì không duy nhất, nhưng <strong>RREF thì duy nhất</strong>: mỗi ma trận có đúng một dạng bậc thang rút gọn, đi đường nào tới cũng vậy.</li>
<li><strong>Duy nhất thì có lợi gì</strong> — nó khiến RREF thành một dấu vân tay chuẩn. Hai người cùng rút gọn đúng thì bắt buộc phải ra hai ma trận y hệt nhau, nên lệch nhau là bằng chứng có người tính sai.</li>
</ul>
<p class="meo">💡 Cách kiểm RREF nhanh, theo thứ tự: hàng 0 đã nằm dưới cùng chưa, mọi pivot có bằng 1 không, mỗi pivot có nằm bên phải pivot phía trên không, và mỗi cột pivot còn lại có toàn số 0 không? Bốn câu "có" nghĩa là RREF.</p>
<p class="pitfall">⚠️ Dừng ở chỗ "các pivot đã bằng 1" rồi gọi đó là RREF. [1 2 0 | 3; 0 1 0 | 4] có các số 1 dẫn đầu nhưng số 2 vẫn nằm trên pivot thứ hai, nên nó mới chỉ là REF. Cũng lưu ý cột cuối không bao giờ là cột pivot trong hệ có nghiệm — một số 1 dẫn đầu ở đó nghĩa là hàng ấy đọc ra 0 = 1.</p>`],

      [10, 'Gaussian elimination — the procedure',
        `<p class="y-chinh">🎯 Gaussian elimination: sweep the augmented matrix into row echelon form top-down, then solve bottom-up by back-substitution.</p>
<ul>
<li><strong>Step 1 — choose the pivot</strong> — find the leftmost column that is not all zeros, and bring a nonzero entry of it into the current pivot position, swapping rows if necessary.</li>
<li><strong>Step 2 — clear below</strong> — for every row beneath, apply Rᵢ → Rᵢ − (aᵢ/pivot)Rₚ so the entry under the pivot becomes 0. This is the only place real arithmetic happens.</li>
<li><strong>Step 3 — move on</strong> — drop down one row and right at least one column, then repeat steps 1–2 on the smaller block that remains.</li>
<li><strong>Step 4 — stop and read</strong> — when you run out of rows or columns the matrix is in REF. Check for a row [0 0 0 | c≠0] first: if there is one, stop, the system is inconsistent.</li>
<li><strong>Step 5 — back-substitute</strong> — solve the bottom equation (one unknown), carry that value up into the row above, and keep climbing until the top row is solved.</li>
<li><strong>Cost</strong> — the method needs roughly n³/3 multiplications for an n×n system, which is why it, and not Cramer's rule, is what real software uses.</li>
<li><strong>Practical tip</strong> — if you may swap rows, put a row whose leading entry is 1 (or the largest in absolute value) on top. That keeps fractions out of the work and, numerically, keeps rounding error small.</li>
</ul>
<p class="meo">💡 Think of it as clearing one column at a time, always downward and never revisiting a finished column. Any step that puts a nonzero number back under an earlier pivot means you went the wrong way.</p>
<p class="pitfall">⚠️ Two procedural errors: using a row you have <em>already reduced</em> as the pivot row again (it undoes the zeros you made), and dividing by a pivot that is 0. A zero in the pivot position is not a dead end — swap in a row below that has a nonzero entry there.</p>`,
        `<p class="y-chinh">🎯 Khử Gauss: quét ma trận bổ sung về dạng bậc thang theo chiều từ trên xuống, rồi giải ngược từ dưới lên bằng thế ngược.</p>
<ul>
<li><strong>Bước 1 — chọn pivot</strong> — tìm cột trái nhất chưa phải toàn số 0, và đưa một phần tử khác 0 của cột đó về vị trí pivot hiện hành, đổi chỗ hàng nếu cần.</li>
<li><strong>Bước 2 — dọn phía dưới</strong> — với mọi hàng bên dưới, dùng Rᵢ → Rᵢ − (aᵢ/pivot)Rₚ để ô nằm dưới pivot thành 0. Đây là chỗ duy nhất có tính toán thật.</li>
<li><strong>Bước 3 — đi tiếp</strong> — tụt xuống một hàng và sang phải ít nhất một cột, rồi lặp lại bước 1–2 trên khối nhỏ hơn còn lại.</li>
<li><strong>Bước 4 — dừng và đọc</strong> — khi hết hàng hoặc hết cột thì ma trận đã ở dạng bậc thang. Hãy kiểm hàng [0 0 0 | c≠0] trước tiên: có một hàng như vậy thì dừng, hệ vô nghiệm.</li>
<li><strong>Bước 5 — thế ngược</strong> — giải phương trình dưới cùng (chỉ một ẩn), mang giá trị đó lên hàng phía trên, cứ thế leo lên tới khi giải xong hàng đầu.</li>
<li><strong>Chi phí</strong> — phương pháp cần khoảng n³/3 phép nhân cho hệ n×n, và đó là lý do phần mềm thật dùng nó chứ không dùng quy tắc Cramer.</li>
<li><strong>Mẹo thực hành</strong> — nếu được đổi chỗ hàng, hãy đưa hàng có phần tử dẫn đầu bằng 1 (hoặc lớn nhất về trị tuyệt đối) lên trên. Làm vậy tránh được phân số, và về mặt số học còn giữ sai số làm tròn nhỏ.</li>
</ul>
<p class="meo">💡 Hãy hình dung đây là việc dọn từng cột một, luôn đi xuống và không bao giờ quay lại cột đã xong. Bước nào đặt lại một số khác 0 xuống dưới pivot cũ nghĩa là bạn đã đi sai hướng.</p>
<p class="pitfall">⚠️ Hai lỗi quy trình: dùng lại một hàng <em>đã rút gọn rồi</em> làm hàng pivot (nó phá mất các số 0 vừa tạo), và chia cho pivot bằng 0. Số 0 ở vị trí pivot không phải ngõ cụt — hãy đổi chỗ lên một hàng bên dưới có phần tử khác 0 ở đó.</p>`],

      [11, 'Worked example — Gaussian elimination step by step',
        `<p class="y-chinh">🎯 Solve 2x + y − z = 8, −3x − y + 2z = −11, −2x + y + 2z = −3 by full elimination; the answer is (2, 3, −1).</p>
<ul>
<li><strong>Start</strong> — augmented matrix [2 1 −1 | 8; −3 −1 2 | −11; −2 1 2 | −3]. Pivot 1 is the 2 in row 1, column 1.</li>
<li><strong>Step 1a — R2 → R2 + 1.5R1</strong> — 1.5·R1 = [3 1.5 −1.5 | 12], so R2 becomes [−3+3, −1+1.5, 2−1.5 | −11+12] = <strong>[0 0.5 0.5 | 1]</strong>.</li>
<li><strong>Step 1b — R3 → R3 + R1</strong> — R3 becomes [−2+2, 1+1, 2−1 | −3+8] = <strong>[0 2 1 | 5]</strong>. Column 1 is now cleared: [2 1 −1 | 8; 0 0.5 0.5 | 1; 0 2 1 | 5].</li>
<li><strong>Step 2 — R3 → R3 − 4R2</strong> — the multiplier is 2 ÷ 0.5 = 4, so R3 becomes [0, 2−4(0.5), 1−4(0.5) | 5−4(1)] = <strong>[0 0 −1 | 1]</strong>.</li>
<li><strong>Row echelon form reached</strong> — [2 1 −1 | 8; 0 0.5 0.5 | 1; 0 0 −1 | 1], with pivots 2, 0.5 and −1 marching right.</li>
<li><strong>Step 3 — bottom row</strong> — it reads −z = 1, hence <strong>z = −1</strong>.</li>
<li><strong>Step 4 — middle row</strong> — 0.5y + 0.5z = 1 ⇒ 0.5y + 0.5(−1) = 1 ⇒ 0.5y = 1.5 ⇒ <strong>y = 3</strong>.</li>
<li><strong>Step 5 — top row</strong> — 2x + y − z = 8 ⇒ 2x + 3 − (−1) = 8 ⇒ 2x + 4 = 8 ⇒ 2x = 4 ⇒ <strong>x = 2</strong>. Unique solution <strong>(x, y, z) = (2, 3, −1)</strong>.</li>
<li><strong>Verify</strong> — equation 3: −2(2) + 3 + 2(−1) = −4 + 3 − 2 = −3 ✓. Three pivots for three unknowns, so this really is case 1 of slide 5.</li>
</ul>
<p class="meo">💡 Substituting the answer back into the <em>original</em> equations (not the reduced ones) is the only check that catches an error made in the very first row operation. It takes fifteen seconds.</p>
<p class="pitfall">⚠️ Sign errors dominate here. R2 → R2 + 1.5R1 means <em>plus</em>, because the entry to kill is −3 and the pivot is +2; taking the multiplier as −1.5 leaves [−6 …] instead of a zero. Compute the multiplier as −(entry)/(pivot) and write it down before touching the row.</p>`,
        `<p class="y-chinh">🎯 Giải 2x + y − z = 8, −3x − y + 2z = −11, −2x + y + 2z = −3 bằng khử đầy đủ; đáp án là (2, 3, −1).</p>
<ul>
<li><strong>Xuất phát</strong> — ma trận bổ sung [2 1 −1 | 8; −3 −1 2 | −11; −2 1 2 | −3]. Pivot thứ nhất là số 2 ở hàng 1, cột 1.</li>
<li><strong>Bước 1a — R2 → R2 + 1,5R1</strong> — 1,5·R1 = [3 1,5 −1,5 | 12], nên R2 thành [−3+3, −1+1,5, 2−1,5 | −11+12] = <strong>[0 0,5 0,5 | 1]</strong>.</li>
<li><strong>Bước 1b — R3 → R3 + R1</strong> — R3 thành [−2+2, 1+1, 2−1 | −3+8] = <strong>[0 2 1 | 5]</strong>. Cột 1 đã sạch: [2 1 −1 | 8; 0 0,5 0,5 | 1; 0 2 1 | 5].</li>
<li><strong>Bước 2 — R3 → R3 − 4R2</strong> — hệ số nhân là 2 ÷ 0,5 = 4, nên R3 thành [0, 2−4(0,5), 1−4(0,5) | 5−4(1)] = <strong>[0 0 −1 | 1]</strong>.</li>
<li><strong>Đã về dạng bậc thang</strong> — [2 1 −1 | 8; 0 0,5 0,5 | 1; 0 0 −1 | 1], các pivot 2; 0,5 và −1 lùi dần sang phải.</li>
<li><strong>Bước 3 — hàng dưới cùng</strong> — nó đọc ra −z = 1, vậy <strong>z = −1</strong>.</li>
<li><strong>Bước 4 — hàng giữa</strong> — 0,5y + 0,5z = 1 ⇒ 0,5y + 0,5(−1) = 1 ⇒ 0,5y = 1,5 ⇒ <strong>y = 3</strong>.</li>
<li><strong>Bước 5 — hàng đầu</strong> — 2x + y − z = 8 ⇒ 2x + 3 − (−1) = 8 ⇒ 2x + 4 = 8 ⇒ 2x = 4 ⇒ <strong>x = 2</strong>. Nghiệm duy nhất <strong>(x, y, z) = (2, 3, −1)</strong>.</li>
<li><strong>Kiểm lại</strong> — phương trình 3: −2(2) + 3 + 2(−1) = −4 + 3 − 2 = −3 ✓. Ba pivot cho ba ẩn, nên đây đúng là khả năng 1 ở slide 5.</li>
</ul>
<p class="meo">💡 Thay đáp án ngược vào các phương trình <em>gốc</em> (đừng thay vào phương trình đã rút gọn) là phép kiểm duy nhất bắt được lỗi phát sinh ngay ở phép biến đổi hàng đầu tiên. Nó tốn mười lăm giây.</p>
<p class="pitfall">⚠️ Lỗi dấu chiếm phần lớn ở đây. R2 → R2 + 1,5R1 là dấu <em>cộng</em>, vì ô cần triệt tiêu là −3 còn pivot là +2; lấy hệ số nhân thành −1,5 sẽ ra [−6 …] chứ không ra số 0. Hãy tính hệ số nhân theo công thức −(ô cần khử)/(pivot) và viết nó ra trước khi đụng vào hàng.</p>`],

      [12, 'Gauss-Jordan elimination',
        `<p class="y-chinh">🎯 Gauss-Jordan keeps going after REF: clear <em>above</em> the pivots too, scale each pivot to 1, and the solution can be read off with no back-substitution.</p>
<ul>
<li><strong>The extra phase</strong> — starting from the bottom pivot and working upward, use Rᵢ → Rᵢ − (entry)Rₚ to zero out every entry sitting <em>above</em> each pivot, then scale each pivot row to make the pivot 1.</li>
<li><strong>Applied to the example of slide 11</strong> — the REF was [2 1 −1 | 8; 0 0.5 0.5 | 1; 0 0 −1 | 1]. R3 → −R3 gives [0 0 1 | −1]; R2 → 2(R2 − 0.5R3) gives [0 1 0 | 3]; R1 → (1/2)(R1 − R2 + R3) gives [1 0 0 | 2].</li>
<li><strong>The RREF on the slide</strong> — [1 0 0 | 2; 0 1 0 | 3; 0 0 1 | −1], so <strong>x = 2, y = 3, z = −1</strong>, exactly the answer found by back-substitution.</li>
<li><strong>Why it feels easier</strong> — the last column is literally the answer vector. No equations to re-solve and no chance of a mistake while substituting upward.</li>
<li><strong>Why it is not always better</strong> — Gauss-Jordan needs about n³/2 multiplications versus n³/3 for Gauss plus back-substitution, roughly 50% more arithmetic. For hand computation on a 3×3 the difference is small; for a large machine computation it is not.</li>
<li><strong>Where Gauss-Jordan wins outright</strong> — when you need the RREF itself: computing a matrix inverse by reducing [A|I] to [I|A⁻¹], finding a rank, or describing the general solution with free parameters.</li>
<li><strong>Same rules, same guarantee</strong> — it uses only the three elementary row operations, so the solution set is untouched throughout.</li>
</ul>
<p class="meo">💡 Clear upward starting from the <em>last</em> pivot. Going top-down in this phase re-introduces nonzero entries in columns you have already cleaned and doubles the work.</p>
<p class="pitfall">⚠️ Reading [1 0 0 | 2; 0 1 0 | 3; 0 0 1 | −1] as "x = 2, y = 3, z = 1" by dropping the minus. Also beware that RREF only reads off this cleanly when every unknown has a pivot; with a free variable the last column is not the whole answer — see slide 13.</p>`,
        `<p class="y-chinh">🎯 Gauss-Jordan đi tiếp sau REF: dọn luôn phần <em>trên</em> các pivot, đưa mỗi pivot về 1, và nghiệm đọc được ngay mà không cần thế ngược.</p>
<ul>
<li><strong>Giai đoạn thêm</strong> — bắt đầu từ pivot dưới cùng rồi đi ngược lên, dùng Rᵢ → Rᵢ − (ô)Rₚ để triệt tiêu mọi ô nằm <em>trên</em> mỗi pivot, sau đó nhân hàng pivot để pivot bằng 1.</li>
<li><strong>Áp dụng vào ví dụ slide 11</strong> — REF là [2 1 −1 | 8; 0 0,5 0,5 | 1; 0 0 −1 | 1]. R3 → −R3 cho [0 0 1 | −1]; R2 → 2(R2 − 0,5R3) cho [0 1 0 | 3]; R1 → (1/2)(R1 − R2 + R3) cho [1 0 0 | 2].</li>
<li><strong>RREF trên slide</strong> — [1 0 0 | 2; 0 1 0 | 3; 0 0 1 | −1], vậy <strong>x = 2, y = 3, z = −1</strong>, đúng bằng đáp án tìm được bằng thế ngược.</li>
<li><strong>Vì sao thấy dễ hơn</strong> — cột cuối chính là vectơ nghiệm theo nghĩa đen. Không phải giải lại phương trình nào và không có cơ hội sai khi thế ngược lên.</li>
<li><strong>Vì sao không phải lúc nào cũng tốt hơn</strong> — Gauss-Jordan cần khoảng n³/2 phép nhân so với n³/3 của Gauss cộng thế ngược, tức nhiều hơn chừng 50% phép tính. Với bài 3×3 làm tay thì chênh lệch nhỏ; với tính toán lớn trên máy thì không nhỏ.</li>
<li><strong>Chỗ Gauss-Jordan thắng tuyệt đối</strong> — khi bạn cần chính cái RREF: tìm ma trận nghịch đảo bằng cách rút gọn [A|I] về [I|A⁻¹], tìm hạng, hoặc mô tả nghiệm tổng quát theo tham số tự do.</li>
<li><strong>Cùng luật, cùng bảo đảm</strong> — nó chỉ dùng ba phép biến đổi hàng sơ cấp, nên tập nghiệm không hề bị động tới trong suốt quá trình.</li>
</ul>
<p class="meo">💡 Hãy dọn ngược lên bắt đầu từ pivot <em>cuối cùng</em>. Làm từ trên xuống ở giai đoạn này sẽ đưa các số khác 0 quay lại những cột đã dọn xong và làm gấp đôi công việc.</p>
<p class="pitfall">⚠️ Đọc [1 0 0 | 2; 0 1 0 | 3; 0 0 1 | −1] thành "x = 2, y = 3, z = 1" vì đánh rơi dấu trừ. Cũng lưu ý RREF chỉ đọc gọn như vậy khi mọi ẩn đều có pivot; có biến tự do thì cột cuối không phải toàn bộ đáp án — xem slide 13.</p>`],

      [13, 'Pivot variables and free variables',
        `<p class="y-chinh">🎯 In the RREF, a column with a pivot gives a <strong>pivot (basic) variable</strong>; a column without one gives a <strong>free variable</strong> that becomes a parameter.</p>
<ul>
<li><strong>The rule</strong> — look only at the left-hand columns of [A|b]. Column j has a pivot ⇒ xⱼ is determined; column j has no pivot ⇒ xⱼ is free.</li>
<li><strong>The example on the slide</strong> — [1 0 2 | 3; 0 1 −1 | 5], a system of 2 equations in 3 unknowns. Pivots sit in columns 1 and 2, so x₁ and x₂ are pivot variables; column 3 has none, so x₃ is free.</li>
<li><strong>Introduce the parameter</strong> — set x₃ = t, where t may be any real number. Every choice of t gives one solution of the system.</li>
<li><strong>Solve for the pivot variables</strong> — row 1 says x₁ + 2x₃ = 3 ⇒ <strong>x₁ = 3 − 2t</strong>; row 2 says x₂ − x₃ = 5 ⇒ <strong>x₂ = 5 + t</strong>.</li>
<li><strong>General solution</strong> — (x₁, x₂, x₃) = (3 − 2t, 5 + t, t), t ∈ ℝ. Take t = 0 to get (3, 5, 0) and t = 1 to get (1, 6, 1); check both in the original rows if you want proof.</li>
<li><strong>Vector form</strong> — the same answer is (3, 5, 0) + t(−2, 1, 1): a particular solution plus t times a direction. Geometrically the solution set is a straight line in space.</li>
<li><strong>Counting</strong> — with n unknowns and r pivots there are exactly <strong>n − r</strong> free variables. Here n = 3, r = 2, so 1 free variable and a one-parameter family. Two free variables would give a plane of solutions.</li>
</ul>
<p class="meo">💡 Count first, solve second: circle the pivot columns, and n − r tells you immediately how many parameters your final answer must contain. An answer with the wrong number of parameters is wrong before you check the arithmetic.</p>
<p class="pitfall">⚠️ Two traps. First, the right-hand column never counts as a pivot column when deciding which variables are free. Second, solve for the pivot variables <em>in terms of</em> the free ones, never the other way round — writing t = (3 − x₁)/2 is legal algebra but answers the wrong question.</p>`,
        `<p class="y-chinh">🎯 Trong RREF, cột có pivot cho một <strong>biến chính (biến cơ sở)</strong>; cột không có pivot cho một <strong>biến tự do</strong>, và biến này trở thành tham số.</p>
<ul>
<li><strong>Quy tắc</strong> — chỉ nhìn các cột bên trái của [A|b]. Cột j có pivot ⇒ xⱼ được xác định; cột j không có pivot ⇒ xⱼ là tự do.</li>
<li><strong>Ví dụ trên slide</strong> — [1 0 2 | 3; 0 1 −1 | 5], hệ 2 phương trình 3 ẩn. Pivot nằm ở cột 1 và cột 2, nên x₁ và x₂ là biến chính; cột 3 không có pivot nên x₃ tự do.</li>
<li><strong>Đặt tham số</strong> — cho x₃ = t, với t là số thực bất kỳ. Mỗi cách chọn t cho một nghiệm của hệ.</li>
<li><strong>Giải các biến chính</strong> — hàng 1 nói x₁ + 2x₃ = 3 ⇒ <strong>x₁ = 3 − 2t</strong>; hàng 2 nói x₂ − x₃ = 5 ⇒ <strong>x₂ = 5 + t</strong>.</li>
<li><strong>Nghiệm tổng quát</strong> — (x₁, x₂, x₃) = (3 − 2t, 5 + t, t), t ∈ ℝ. Lấy t = 0 được (3, 5, 0) và t = 1 được (1, 6, 1); muốn chắc thì thay cả hai vào các hàng ban đầu để kiểm.</li>
<li><strong>Dạng vectơ</strong> — vẫn đáp án đó viết thành (3, 5, 0) + t(−2, 1, 1): một nghiệm riêng cộng t lần một vectơ chỉ phương. Về hình học, tập nghiệm là một đường thẳng trong không gian.</li>
<li><strong>Đếm số lượng</strong> — với n ẩn và r pivot thì có đúng <strong>n − r</strong> biến tự do. Ở đây n = 3, r = 2, nên có 1 biến tự do và một họ nghiệm một tham số. Hai biến tự do sẽ cho cả một mặt phẳng nghiệm.</li>
</ul>
<p class="meo">💡 Đếm trước, giải sau: khoanh tròn các cột pivot, rồi n − r cho biết ngay đáp án cuối phải chứa bao nhiêu tham số. Đáp án sai số tham số là đã sai trước cả khi soát phép tính.</p>
<p class="pitfall">⚠️ Hai cái bẫy. Một, cột vế phải không bao giờ được tính là cột pivot khi xét ẩn nào tự do. Hai, phải giải các biến chính <em>theo</em> biến tự do chứ không được ngược lại — viết t = (3 − x₁)/2 vẫn đúng về đại số nhưng đang trả lời sai câu hỏi.</p>`],

      [14, 'Inconsistent systems — spotting no solution',
        `<p class="y-chinh">🎯 If elimination ever produces a row [0 0 … 0 | c] with c ≠ 0, the system is inconsistent — stop immediately.</p>
<ul>
<li><strong>What the row says</strong> — reading it back as an equation gives 0·x₁ + 0·x₂ + ⋯ + 0·xₙ = c, that is 0 = c with c ≠ 0. No choice of unknowns can make that true.</li>
<li><strong>Consequence</strong> — since row operations preserve the solution set, the original system has no solution either. The answer is "vô nghiệm", not a number.</li>
<li><strong>Worked example</strong> — x + y = 3, 2x + 2y = 7 gives [1 1 | 3; 2 2 | 7]. Apply R2 → R2 − 2R1: [2−2, 2−2 | 7−6] = <strong>[0 0 | 1]</strong>, i.e. 0 = 1 ⇒ inconsistent. Geometrically the two lines are parallel.</li>
<li><strong>The harmless twin</strong> — a row [0 0 … 0 | 0] means 0 = 0, which is always true. It is a redundant equation, carries no information, and is simply pushed to the bottom and ignored.</li>
<li><strong>Telling them apart</strong> — only the entry in the <em>last</em> column decides. Same zeros on the left, c ≠ 0 ⇒ no solution; c = 0 ⇒ the row is just dead weight.</li>
<li><strong>Stop early</strong> — the moment the bad row appears you are done; continuing to reduce wastes time and cannot rescue the system.</li>
<li><strong>In rank language</strong> — the system is consistent exactly when rank(A) = rank([A|b]). A bad row is precisely the case where the augmented matrix has one more pivot than A does.</li>
</ul>
<p class="meo">💡 Scan the last column before anything else once you reach REF. A pivot in the right-hand column is the only signature of inconsistency, and it takes one glance to see.</p>
<p class="pitfall">⚠️ The classic mark-loser: seeing [0 0 0 | 5], noting "the left side is all zeros so x, y, z can be anything", and answering "infinitely many solutions". It is the exact opposite — that row makes the system impossible. Infinitely many solutions come from a <em>missing pivot</em> in a left column, never from a nonzero c.</p>`,
        `<p class="y-chinh">🎯 Nếu trong lúc khử xuất hiện một hàng [0 0 … 0 | c] với c ≠ 0 thì hệ vô nghiệm — dừng lại ngay.</p>
<ul>
<li><strong>Hàng đó nói gì</strong> — đọc ngược thành phương trình được 0·x₁ + 0·x₂ + ⋯ + 0·xₙ = c, tức 0 = c với c ≠ 0. Không cách chọn ẩn nào làm điều đó đúng được.</li>
<li><strong>Hệ quả</strong> — vì phép biến đổi hàng giữ nguyên tập nghiệm nên hệ ban đầu cũng không có nghiệm. Đáp án là "vô nghiệm", không phải một con số.</li>
<li><strong>Ví dụ đã giải</strong> — x + y = 3, 2x + 2y = 7 cho [1 1 | 3; 2 2 | 7]. Dùng R2 → R2 − 2R1: [2−2, 2−2 | 7−6] = <strong>[0 0 | 1]</strong>, tức 0 = 1 ⇒ vô nghiệm. Về hình học, hai đường thẳng song song.</li>
<li><strong>Người anh em vô hại</strong> — hàng [0 0 … 0 | 0] nghĩa là 0 = 0, luôn đúng. Đó là một phương trình thừa, không mang thông tin gì, cứ đẩy xuống dưới cùng rồi bỏ qua.</li>
<li><strong>Phân biệt hai loại</strong> — chỉ ô ở cột <em>cuối</em> mới quyết định. Bên trái toàn 0 như nhau, c ≠ 0 ⇒ vô nghiệm; c = 0 ⇒ hàng đó chỉ là gánh nặng chết.</li>
<li><strong>Dừng sớm</strong> — hàng xấu vừa hiện ra là xong việc; khử tiếp chỉ tốn thời gian và không cứu được hệ.</li>
<li><strong>Nói bằng ngôn ngữ hạng</strong> — hệ có nghiệm đúng khi rank(A) = rank([A|b]). Hàng xấu chính là trường hợp ma trận bổ sung có nhiều hơn A đúng một pivot.</li>
</ul>
<p class="meo">💡 Khi vừa về tới REF, hãy quét cột cuối trước mọi thứ khác. Một pivot nằm ở cột vế phải là dấu hiệu duy nhất của vô nghiệm, và chỉ cần liếc một cái là thấy.</p>
<p class="pitfall">⚠️ Lỗi mất điểm kinh điển: thấy [0 0 0 | 5] rồi nghĩ "vế trái toàn số 0 nên x, y, z muốn bằng gì cũng được", và trả lời "vô số nghiệm". Thực tế đúng ngược lại — hàng đó làm hệ trở nên bất khả. Vô số nghiệm sinh ra từ việc <em>thiếu pivot</em> ở một cột bên trái, không bao giờ từ một số c khác 0.</p>`],

      [15, 'Homogeneous systems',
        `<p class="y-chinh">🎯 A homogeneous system has every right-hand side equal to 0; it is never inconsistent, and the only question is whether it has solutions besides the zero one.</p>
<ul>
<li><strong>Definition</strong> — a₁x₁ + a₂x₂ + ⋯ + aₙxₙ = 0 for every equation, so the augmented matrix looks like [A | 0] with a last column of pure zeros.</li>
<li><strong>The trivial solution</strong> — x₁ = x₂ = ⋯ = xₙ = 0 always works, since every equation becomes 0 = 0. A homogeneous system is therefore <strong>always consistent</strong>.</li>
<li><strong>What follows</strong> — case 2 of slide 5 is ruled out. Only two outcomes remain: the trivial solution alone, or infinitely many solutions.</li>
<li><strong>The deciding condition</strong> — nontrivial solutions exist <strong>exactly when there is at least one free variable</strong>, i.e. when the number of pivots r is less than the number of unknowns n.</li>
<li><strong>The useful special case</strong> — if there are <em>more unknowns than equations</em> (n &gt; m), then r ≤ m &lt; n, so a free variable is guaranteed and nontrivial solutions must exist. This is a theorem, not a tendency.</li>
<li><strong>Worked example</strong> — x + 2y − z = 0, 2x + 4y − 2z = 0. Apply R2 → R2 − 2R1: [0 0 0 | 0]. Only one pivot for three unknowns, so y = s and z = t are free and x = −2s + t; the solution set is a whole plane through the origin.</li>
<li><strong>Why the zero column stays zero</strong> — every row operation combines rows, and any combination of zeros is still 0. So you may work with A alone and remember the last column is all zeros.</li>
</ul>
<p class="meo">💡 Before eliminating, compare counts: more unknowns than equations means you can already assert that nontrivial solutions exist. The elimination then only has to describe them.</p>
<p class="pitfall">⚠️ Answering "no solution" for a homogeneous system — impossible, x = 0 is always there. The other slip is the converse of the count rule: n ≤ m does <em>not</em> prove the trivial solution is the only one. Three equations in three unknowns can still leave a free variable if the rows are dependent, as in the example above.</p>`,
        `<p class="y-chinh">🎯 Hệ thuần nhất có mọi vế phải bằng 0; nó không bao giờ vô nghiệm, và câu hỏi duy nhất là nó còn nghiệm nào ngoài nghiệm 0 hay không.</p>
<ul>
<li><strong>Định nghĩa</strong> — a₁x₁ + a₂x₂ + ⋯ + aₙxₙ = 0 ở mọi phương trình, nên ma trận bổ sung có dạng [A | 0] với cột cuối toàn số 0.</li>
<li><strong>Nghiệm tầm thường</strong> — x₁ = x₂ = ⋯ = xₙ = 0 luôn đúng, vì mọi phương trình đều thành 0 = 0. Vậy hệ thuần nhất <strong>luôn có nghiệm</strong>.</li>
<li><strong>Kéo theo điều gì</strong> — khả năng 2 ở slide 5 bị loại hẳn. Chỉ còn hai kết cục: chỉ mỗi nghiệm tầm thường, hoặc vô số nghiệm.</li>
<li><strong>Điều kiện quyết định</strong> — nghiệm không tầm thường tồn tại <strong>đúng khi có ít nhất một biến tự do</strong>, tức khi số pivot r nhỏ hơn số ẩn n.</li>
<li><strong>Trường hợp đặc biệt hay dùng</strong> — nếu <em>số ẩn nhiều hơn số phương trình</em> (n &gt; m) thì r ≤ m &lt; n, nên chắc chắn có biến tự do và bắt buộc phải có nghiệm không tầm thường. Đây là định lý chứ không phải xu hướng.</li>
<li><strong>Ví dụ đã giải</strong> — x + 2y − z = 0, 2x + 4y − 2z = 0. Dùng R2 → R2 − 2R1: [0 0 0 | 0]. Chỉ một pivot cho ba ẩn, nên y = s và z = t tự do còn x = −2s + t; tập nghiệm là nguyên một mặt phẳng đi qua gốc toạ độ.</li>
<li><strong>Vì sao cột 0 vẫn là 0</strong> — mọi phép biến đổi hàng đều là tổ hợp các hàng, mà tổ hợp của các số 0 vẫn bằng 0. Nên có thể làm việc với riêng A và nhớ rằng cột cuối toàn số 0.</li>
</ul>
<p class="meo">💡 Trước khi khử hãy so số lượng: ẩn nhiều hơn phương trình là đã khẳng định được có nghiệm không tầm thường. Việc khử sau đó chỉ còn nhiệm vụ mô tả chúng.</p>
<p class="pitfall">⚠️ Trả lời "vô nghiệm" cho hệ thuần nhất — không thể, vì x = 0 luôn có sẵn. Lỗi còn lại là dùng ngược quy tắc đếm: n ≤ m <em>không</em> chứng minh được nghiệm tầm thường là nghiệm duy nhất. Ba phương trình ba ẩn vẫn có thể còn biến tự do nếu các hàng phụ thuộc nhau, như đúng ví dụ ở trên.</p>`],

      [16, 'Summary — five things to carry out of Chapter 5',
        `<p class="y-chinh">🎯 Five statements. If you can say all five without notes, Chapter 5 is done.</p>
<ol>
<li><strong>Write the system as a matrix and reduce it</strong> — a linear system becomes the augmented matrix [A|b], for example [2 1 −1 | 8; −3 −1 2 | −11; −2 1 2 | −3], and the three elementary row operations (swap, scale by c ≠ 0, add a multiple of another row) never change its solution set.</li>
<li><strong>Two forms, two algorithms</strong> — Gaussian elimination reaches row echelon form and finishes with back-substitution; Gauss-Jordan continues to the unique RREF, where the answer sits in the last column: [1 0 0 | 2; 0 1 0 | 3; 0 0 1 | −1] gives (2, 3, −1).</li>
<li><strong>Exactly three outcomes</strong> — unique solution, no solution, or infinitely many; never exactly two. A row [0 0 0 | c] with c ≠ 0 means no solution, while [0 0 0 | 0] is merely a redundant equation.</li>
<li><strong>Pivots decide the shape of the answer</strong> — pivot columns give basic variables, pivot-free columns give free parameters, and with n unknowns and r pivots there are n − r of them: [1 0 2 | 3; 0 1 −1 | 5] gives x₁ = 3 − 2t, x₂ = 5 + t, x₃ = t.</li>
<li><strong>Homogeneous systems are special</strong> — [A|0] always has the trivial solution, so it is never inconsistent; it has nontrivial solutions exactly when a free variable exists, which is guaranteed whenever there are more unknowns than equations.</li>
</ol>
<p class="meo">💡 One workflow for any system: build [A|b] → eliminate downward to REF → check for [0 0 0 | c≠0] → count pivots against unknowns → equal ⇒ unique, fewer ⇒ parametrise the free variables → substitute the answer back into the original equations.</p>
<p class="pitfall">⚠️ The three marks lost most often: mistaking [0 0 0 | c≠0] for infinitely many solutions, changing both rows during Rᵢ → Rᵢ + cRⱼ, and treating the last column as a pivot column when counting free variables.</p>`,
        `<p class="y-chinh">🎯 Năm câu. Nói được cả năm câu mà không cần nhìn tài liệu là xong Chương 5.</p>
<ol>
<li><strong>Viết hệ thành ma trận rồi rút gọn</strong> — hệ tuyến tính trở thành ma trận bổ sung [A|b], ví dụ [2 1 −1 | 8; −3 −1 2 | −11; −2 1 2 | −3], và ba phép biến đổi hàng sơ cấp (đổi chỗ, nhân với c ≠ 0, cộng bội của hàng khác) không bao giờ làm đổi tập nghiệm của nó.</li>
<li><strong>Hai dạng, hai thuật toán</strong> — khử Gauss đưa về dạng bậc thang rồi kết thúc bằng thế ngược; Gauss-Jordan đi tiếp tới RREF duy nhất, nơi đáp án nằm sẵn ở cột cuối: [1 0 0 | 2; 0 1 0 | 3; 0 0 1 | −1] cho (2, 3, −1).</li>
<li><strong>Đúng ba kết cục</strong> — nghiệm duy nhất, vô nghiệm, hoặc vô số nghiệm; không bao giờ đúng hai nghiệm. Hàng [0 0 0 | c] với c ≠ 0 nghĩa là vô nghiệm, còn [0 0 0 | 0] chỉ là một phương trình thừa.</li>
<li><strong>Pivot quyết định hình dạng đáp án</strong> — cột có pivot cho biến chính, cột không pivot cho tham số tự do, và với n ẩn cùng r pivot thì có n − r tham số: [1 0 2 | 3; 0 1 −1 | 5] cho x₁ = 3 − 2t, x₂ = 5 + t, x₃ = t.</li>
<li><strong>Hệ thuần nhất là trường hợp riêng</strong> — [A|0] luôn có nghiệm tầm thường nên không bao giờ vô nghiệm; nó có nghiệm không tầm thường đúng khi tồn tại biến tự do, điều chắc chắn xảy ra khi số ẩn nhiều hơn số phương trình.</li>
</ol>
<p class="meo">💡 Một quy trình cho mọi hệ: lập [A|b] → khử xuống tới REF → kiểm xem có [0 0 0 | c≠0] không → đếm pivot so với số ẩn → bằng nhau ⇒ nghiệm duy nhất, ít hơn ⇒ đặt tham số cho biến tự do → thay đáp án ngược lại vào các phương trình gốc.</p>
<p class="pitfall">⚠️ Ba điểm mất nhiều nhất khi thi: nhầm [0 0 0 | c≠0] thành vô số nghiệm; sửa cả hai hàng khi làm Rᵢ → Rᵢ + cRⱼ; và tính cột cuối như một cột pivot khi đếm biến tự do.</p>`],
    ]),
  ].join('\n'),
};
