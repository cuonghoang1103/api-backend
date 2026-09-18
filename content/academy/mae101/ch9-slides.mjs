/**
 * MAE101 · Chương 9 — Vector Spaces: Basis & Dimension (Không gian vector: Cơ sở & Số chiều),
 * học theo từng slide. Deck 'mae9' (MAE9), 17 slide, ảnh render sẵn trên CDN
 * images/academy/MAE101/v1/mae9/NNN.webp. Nội dung bám đúng scripts/slides-src/mae101-ch9.mjs,
 * syllabus FLM (sylID 13137) + Nicholson "Linear Algebra with Applications" ch.5-6.
 *
 * MỌI PHÉP TÍNH TRONG PHẦN GIẢNG ĐỀU ĐÃ KIỂM TAY (và kiểm lại bằng script):
 *   · Slide 4  W = {(x,y,z) : x + 2y − z = 0}: (0,0,0) ✓; (1,0,1)+(0,1,2)=(1,1,3) → 1+2−3=0 ✓;
 *              2(1,0,1)=(2,0,2) → 2+0−2=0 ✓. Phản ví dụ: x+y=1 (thiếu 0), xy=0 (không đóng cộng),
 *              x ≥ 0 (không đóng nhân: −1·(1,0)=(−1,0)).
 *   · Slide 6  span{(1,0,1),(0,1,1)} = (c1, c2, c1+c2) ⇒ z = x + y, tức mặt phẳng x + y − z = 0.
 *              Kiểm: (1,0,1) → 1+0−1=0 ✓, (0,1,1) → 0+1−1=0 ✓. (3,2,5) ∈ span (5=3+2), (7,1,4) ∉ (4≠8).
 *   · Slide 8  Cột (1,2,3),(2,5,7),(1,3,5) → REF [1 2 1; 0 1 1; 0 0 1], 3 pivot ⇒ ĐỘC LẬP.
 *              Cột (1,1,0),(0,1,1),(1,2,1) → REF [1 0 1; 0 1 1; 0 0 0], 2 pivot ⇒ PHỤ THUỘC,
 *              nghiệm c = t(−1,−1,1) ⇒ v3 = v1 + v2. Và (1,2),(2,4): v2 = 2v1 ⇒ phụ thuộc.
 *   · Slide 9  {(1,1),(1,−1)} là cơ sở của R²: 3(1,1) + 2(1,−1) = (5,1) ✓.
 *   · Slide 10 Mặt phẳng x + 2y − z = 0: đặt y=s, z=t ⇒ (t−2s, s, t) = s(−2,1,0) + t(1,0,1),
 *              kiểm (−2)+2(1)−0 = 0 ✓ và 1+0−1 = 0 ✓ ⇒ dim = 2.
 *   · Slide 11 W = span{(1,2,1),(2,4,3),(3,6,4)}. Cách HÀNG: REF [1 2 1; 0 0 1; 0 0 0] ⇒
 *              cơ sở {(1,2,1),(0,0,1)}, dim 2. Cách CỘT: REF [1 2 3; 0 1 1; 0 0 0], pivot cột 1,2 ⇒
 *              cơ sở {(1,2,1),(2,4,3)}. Đối chiếu: (1,2,1)+(2,4,3) = (3,6,4) = v3 ✓.
 *   · Slide 12 u=(1,2,2), v=(2,−1,2): u·v = 2−2+4 = 4; ‖u‖ = ‖v‖ = 3; u−v = (−1,3,0),
 *              d = √10 ≈ 3,162; cos θ = 4/9 ≈ 0,4444 ⇒ θ ≈ 63,6°. ‖(1,2,2,4)‖ = √25 = 5.
 *              Trực giao: (1,2,2)·(2,1,−2) = 2+2−4 = 0; Pythagoras ‖(3,3,0)‖² = 18 = 9 + 9 ✓.
 *   · Slide 13 {(1,1,0),(1,−1,0),(0,0,1)} trực giao (3 tích vô hướng đều 0). Khai triển x=(3,1,5):
 *              4/2 = 2, 2/2 = 1, 5/1 = 5 ⇒ 2(1,1,0) + 1(1,−1,0) + 5(0,0,1) = (3,1,5) ✓.
 *   · Slide 15 A = [1 2 1; 2 4 3; 3 6 4]: R2−2R1 = (0,0,1), R3−3R1 = (0,0,1), R3−R2 = (0,0,0)
 *              ⇒ rank = 2; pivot ở cột 1 và cột 3 ⇒ cơ sở column space = {(1,2,3),(1,3,4)}.
 *   · Slide 16 Cùng A đó: n = 3 cột, rank 2 ⇒ nullity 1; null space = span{(−2,1,0)},
 *              kiểm A(−2,1,0) = (0,0,0) ✓ trên cả ba hàng.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'mae9';

export default {
  title: '9.0 — Slide bài giảng: Không gian vector (17 slide)|||9.0 — Slide bài giảng: Không gian vector (17 slide)',
  slug: 'mae101-9-0-slides-khong-gian-vector',
  type: 'VIDEO',
  description: 'Toàn bộ 17 slide Chương 9 MAE101 — không gian con của Rⁿ, tổ hợp tuyến tính và tập sinh, độc lập tuyến tính kiểm bằng khử Gauss, cơ sở và số chiều, tích vô hướng cùng tập trực giao/trực chuẩn, hạng ma trận, nullity và định lý hạng-nullity — mỗi slide kèm giảng song ngữ, ví dụ giải từng bước và bẫy hay gặp khi thi.',
  content: [
    walkHead(D, 1, 17),
    walk(D, [
      [1, 'Chapter 9 — Vector Spaces: Basis and Dimension (cover)',
        `<p class="y-chinh">🎯 Chapter 9 of MAE101: <strong>vector spaces</strong> — how to describe an infinite set of vectors with a finite, minimal list, and count how big it really is.</p>
<ul>
<li><strong>The whole chapter in one move</strong> — a subspace such as the plane x + 2y − z = 0 holds infinitely many points, yet two well-chosen vectors generate every one of them. That short list is a <em>basis</em>, and its length is the <em>dimension</em>.</li>
<li><strong>Why it matters</strong> — basis and dimension are the vocabulary in which every later result is stated: rank, nullity, diagonalisability, least squares, and the solution structure of Ax = b all reduce to counting pivots.</li>
<li><strong>What this deck covers</strong> — 17 slides: subspaces of Rⁿ, linear combinations and span, linear independence and how to test it, basis, dimension, the dot product in n dimensions, orthogonal and orthonormal sets, rank, nullity, and the rank-nullity theorem.</li>
</ul>
<p class="meo">💡 Everything here is Chapter 5 seen from a higher shelf: the same Gaussian elimination, but now the <strong>number of pivots</strong> is the answer rather than a step on the way to one.</p>`,
        `<p class="y-chinh">🎯 Chương 9 của MAE101: <strong>không gian vector</strong> — cách mô tả một tập vô hạn vector bằng một danh sách hữu hạn và tối thiểu, rồi đếm xem nó thật sự lớn cỡ nào.</p>
<ul>
<li><strong>Cả chương gói trong một nước đi</strong> — một không gian con như mặt phẳng x + 2y − z = 0 chứa vô số điểm, thế mà hai vector chọn khéo sinh ra được từng điểm một. Danh sách ngắn đó là <em>cơ sở</em>, và độ dài của nó là <em>số chiều</em>.</li>
<li><strong>Vì sao quan trọng</strong> — cơ sở và số chiều là bộ từ vựng để phát biểu mọi kết quả về sau: hạng, nullity, chéo hoá được hay không, bình phương tối thiểu, và cấu trúc nghiệm của Ax = b đều quy về việc đếm pivot.</li>
<li><strong>Bộ slide này gồm</strong> — 17 slide: không gian con của Rⁿ, tổ hợp tuyến tính và tập sinh, độc lập tuyến tính cùng cách kiểm, cơ sở, số chiều, tích vô hướng trong n chiều, tập trực giao và trực chuẩn, hạng, nullity, và định lý hạng-nullity.</li>
</ul>
<p class="meo">💡 Mọi thứ ở đây là Chương 5 nhìn từ kệ cao hơn: vẫn phép khử Gauss đó, nhưng giờ <strong>số pivot</strong> chính là đáp án chứ không còn là một bước trên đường đi tới đáp án.</p>`],

      [2, 'Contents — six blocks of Chapter 9',
        `<p class="y-chinh">🎯 Chapter 9 runs through six blocks, each one built on the block before it.</p>
<ol>
<li><strong>Subspaces of Rⁿ</strong> — slides 3–4: the three defining conditions, and a worked test on the plane x + 2y − z = 0.</li>
<li><strong>Linear combinations and span</strong> — slides 5–6: what a combination is, why every span is automatically a subspace, and the span of two vectors drawn as a plane.</li>
<li><strong>Linear independence</strong> — slides 7–8: the trivial-solution definition, then the mechanical test by putting vectors in columns and eliminating.</li>
<li><strong>Basis and dimension</strong> — slides 9–11: spanning plus independent, why every basis has the same length, and the recipe for extracting a basis from a spanning list.</li>
<li><strong>Geometry in n dimensions</strong> — slides 12–13: dot product, norm, distance, then orthogonal and orthonormal sets and the expansion theorem.</li>
<li><strong>Rank and nullity</strong> — slides 14–16: rank as the number of pivots, row space and column space, nullity, and rank + nullity = n. Slide 17 is the summary.</li>
</ol>`,
        `<p class="y-chinh">🎯 Chương 9 chạy qua sáu khối, khối sau dựng trên khối trước.</p>
<ol>
<li><strong>Không gian con của Rⁿ</strong> — slide 3–4: ba điều kiện định nghĩa, và một bài kiểm giải đủ trên mặt phẳng x + 2y − z = 0.</li>
<li><strong>Tổ hợp tuyến tính và tập sinh</strong> — slide 5–6: tổ hợp là gì, vì sao mọi span tự động là không gian con, và span của hai vector vẽ ra một mặt phẳng.</li>
<li><strong>Độc lập tuyến tính</strong> — slide 7–8: định nghĩa bằng nghiệm tầm thường, rồi cách kiểm máy móc bằng cách xếp vector thành cột và khử.</li>
<li><strong>Cơ sở và số chiều</strong> — slide 9–11: vừa sinh vừa độc lập, vì sao mọi cơ sở có cùng độ dài, và công thức rút cơ sở ra từ một danh sách sinh.</li>
<li><strong>Hình học trong n chiều</strong> — slide 12–13: tích vô hướng, độ dài, khoảng cách, rồi tập trực giao, trực chuẩn và định lý khai triển.</li>
<li><strong>Hạng và nullity</strong> — slide 14–16: hạng là số pivot, row space và column space, nullity, và rank + nullity = n. Slide 17 là phần tổng kết.</li>
</ol>`],

      [3, 'Subspaces of Rn — the three conditions',
        `<p class="y-chinh">🎯 A subset W of Rⁿ is a <strong>subspace</strong> exactly when it contains the zero vector and is closed under both addition and scalar multiplication.</p>
<ul>
<li><strong>Condition 1 — contains zero</strong> — the vector 0 = (0, 0, …, 0) must lie in W. This is the cheapest test there is, so run it first: if 0 is missing, stop, W is not a subspace.</li>
<li><strong>Condition 2 — closed under addition</strong> — whenever u and v are in W, the sum u + v must also be in W. You may never leave the set by adding two of its own members.</li>
<li><strong>Condition 3 — closed under scalar multiplication</strong> — for every u in W and every real number c, the vector cu must be in W. Note that c may be negative or zero.</li>
<li><strong>What "subspace" buys you</strong> — W is then a vector space in its own right: all eight axioms are inherited from Rⁿ for free, so nothing else needs checking.</li>
<li><strong>The two trivial subspaces</strong> — the set {0} alone is a subspace (dimension 0), and Rⁿ itself is a subspace of Rⁿ. Every other subspace sits strictly between them.</li>
<li><strong>Typical geometry in R³</strong> — the only subspaces are: the origin alone, a line through the origin, a plane through the origin, and all of R³. Nothing that misses the origin qualifies.</li>
<li><strong>Disproving is cheap</strong> — to prove W is a subspace you must argue for <em>all</em> vectors; to disprove it, one concrete counter-example suffices. Always hunt for the counter-example first.</li>
</ul>
<p class="meo">💡 Condition 3 with c = 0 forces 0 into W, so conditions 2 and 3 nearly imply condition 1 — with one exception: the <strong>empty set</strong>. That is why "contains 0" is stated separately and checked first.</p>
<p class="pitfall">⚠️ The classic trap: a set that does not contain the zero vector is <strong>never</strong> a subspace. W = {(x, y) : x + y = 1} fails instantly because 0 + 0 = 0 ≠ 1. Any equation with a nonzero right-hand side, and any "shifted" line or plane, is disqualified before you check anything else.</p>`,
        `<p class="y-chinh">🎯 Tập con W của Rⁿ là <strong>không gian con</strong> đúng khi nó chứa vector 0 và đóng với cả phép cộng lẫn phép nhân vô hướng.</p>
<ul>
<li><strong>Điều kiện 1 — chứa vector 0</strong> — vector 0 = (0, 0, …, 0) phải nằm trong W. Đây là phép kiểm rẻ nhất, nên hãy chạy nó trước: thiếu số 0 là dừng luôn, W không phải không gian con.</li>
<li><strong>Điều kiện 2 — đóng với phép cộng</strong> — hễ u và v thuộc W thì tổng u + v cũng phải thuộc W. Không bao giờ được rời khỏi tập bằng cách cộng hai phần tử của chính nó.</li>
<li><strong>Điều kiện 3 — đóng với nhân vô hướng</strong> — với mọi u thuộc W và mọi số thực c, vector cu phải thuộc W. Lưu ý c có thể âm hoặc bằng 0.</li>
<li><strong>Làm không gian con thì được gì</strong> — khi đó W tự nó đã là một không gian vector: cả tám tiên đề được thừa hưởng miễn phí từ Rⁿ, nên không phải kiểm gì thêm.</li>
<li><strong>Hai không gian con tầm thường</strong> — tập chỉ có {0} là không gian con (số chiều 0), và chính Rⁿ cũng là không gian con của Rⁿ. Mọi không gian con khác nằm hẳn giữa hai cái đó.</li>
<li><strong>Hình học điển hình trong R³</strong> — chỉ có bốn loại không gian con: riêng gốc toạ độ, một đường thẳng qua gốc, một mặt phẳng qua gốc, và toàn bộ R³. Thứ gì không đi qua gốc đều loại.</li>
<li><strong>Bác bỏ thì rẻ</strong> — muốn chứng minh W là không gian con thì phải lập luận cho <em>mọi</em> vector; muốn bác bỏ thì một phản ví dụ cụ thể là đủ. Hãy luôn đi săn phản ví dụ trước.</li>
</ul>
<p class="meo">💡 Điều kiện 3 với c = 0 đã ép 0 phải nằm trong W, nên điều kiện 2 và 3 gần như suy ra điều kiện 1 — trừ đúng một ngoại lệ: <strong>tập rỗng</strong>. Chính vì thế "chứa 0" được nêu riêng và kiểm đầu tiên.</p>
<p class="pitfall">⚠️ Bẫy kinh điển: tập không chứa vector 0 thì <strong>KHÔNG BAO GIỜ</strong> là không gian con. W = {(x, y) : x + y = 1} trượt ngay lập tức vì 0 + 0 = 0 ≠ 1. Mọi phương trình có vế phải khác 0, và mọi đường thẳng hay mặt phẳng bị "dịch đi", đều bị loại trước khi bạn kịp kiểm gì khác.</p>`],

      [4, 'Worked example — testing whether a set is a subspace',
        `<p class="y-chinh">🎯 Show that W = {(x, y, z) : x + 2y − z = 0} is a subspace of R³, by checking all three conditions in order.</p>
<ul>
<li><strong>Step 1 — does it contain 0?</strong> — substitute (0, 0, 0): 0 + 2(0) − 0 = 0 ✓. The zero vector satisfies the equation, so condition 1 holds.</li>
<li><strong>Step 2 — closed under addition?</strong> — take u = (x₁, y₁, z₁) and v = (x₂, y₂, z₂) in W, so x₁ + 2y₁ − z₁ = 0 and x₂ + 2y₂ − z₂ = 0. Then for u + v: (x₁+x₂) + 2(y₁+y₂) − (z₁+z₂) = (x₁ + 2y₁ − z₁) + (x₂ + 2y₂ − z₂) = 0 + 0 = 0 ✓.</li>
<li><strong>Step 3 — closed under scalars?</strong> — for cu = (cx₁, cy₁, cz₁): cx₁ + 2cy₁ − cz₁ = c(x₁ + 2y₁ − z₁) = c·0 = 0 ✓.</li>
<li><strong>Step 4 — conclusion</strong> — all three conditions hold, so W <strong>is a subspace</strong> of R³. Geometrically it is a plane through the origin with normal vector (1, 2, −1).</li>
<li><strong>Numerical sanity check</strong> — (1, 0, 1) is in W since 1 + 0 − 1 = 0, and (0, 1, 2) is in W since 0 + 2 − 2 = 0. Their sum (1, 1, 3) gives 1 + 2 − 3 = 0 ✓, and 2(1, 0, 1) = (2, 0, 2) gives 2 + 0 − 2 = 0 ✓.</li>
<li><strong>The general rule</strong> — every <strong>homogeneous</strong> linear equation (right-hand side 0), and every homogeneous system, defines a subspace. The solution set of Ax = 0 is always a subspace of Rⁿ.</li>
<li><strong>Three counter-examples worth memorising</strong> — {(x, y) : x + y = 1} fails condition 1; {(x, y) : xy = 0} fails condition 2, since (1, 0) + (0, 1) = (1, 1) has product 1 ≠ 0; {(x, y) : x ≥ 0} fails condition 3, since (−1)(1, 0) = (−1, 0) has a negative first entry.</li>
</ul>
<p class="meo">💡 Run the checks in the order 1 → 3 → 2: the zero test is instant, the scalar test usually just factors out c, and only the addition test needs real writing. Most non-subspaces die on step 1 or step 3.</p>
<p class="pitfall">⚠️ Verifying closure on <em>one specific pair</em> of vectors and calling it proof. "(1,0,1) + (0,1,2) is in W, therefore closed" proves nothing — the argument must use general u and v. Conversely, a single failing pair <strong>is</strong> a complete disproof; the asymmetry is the whole point.</p>`,
        `<p class="y-chinh">🎯 Chứng minh W = {(x, y, z) : x + 2y − z = 0} là không gian con của R³, bằng cách kiểm đủ ba điều kiện theo thứ tự.</p>
<ul>
<li><strong>Bước 1 — có chứa 0 không?</strong> — thay (0, 0, 0): 0 + 2(0) − 0 = 0 ✓. Vector không thoả phương trình, vậy điều kiện 1 đúng.</li>
<li><strong>Bước 2 — đóng với phép cộng?</strong> — lấy u = (x₁, y₁, z₁) và v = (x₂, y₂, z₂) thuộc W, tức x₁ + 2y₁ − z₁ = 0 và x₂ + 2y₂ − z₂ = 0. Khi đó với u + v: (x₁+x₂) + 2(y₁+y₂) − (z₁+z₂) = (x₁ + 2y₁ − z₁) + (x₂ + 2y₂ − z₂) = 0 + 0 = 0 ✓.</li>
<li><strong>Bước 3 — đóng với nhân vô hướng?</strong> — với cu = (cx₁, cy₁, cz₁): cx₁ + 2cy₁ − cz₁ = c(x₁ + 2y₁ − z₁) = c·0 = 0 ✓.</li>
<li><strong>Bước 4 — kết luận</strong> — cả ba điều kiện đều đúng, vậy W <strong>là không gian con</strong> của R³. Về hình học, đó là một mặt phẳng qua gốc toạ độ với vector pháp tuyến (1, 2, −1).</li>
<li><strong>Kiểm lại bằng số cụ thể</strong> — (1, 0, 1) thuộc W vì 1 + 0 − 1 = 0, và (0, 1, 2) thuộc W vì 0 + 2 − 2 = 0. Tổng của chúng (1, 1, 3) cho 1 + 2 − 3 = 0 ✓, còn 2(1, 0, 1) = (2, 0, 2) cho 2 + 0 − 2 = 0 ✓.</li>
<li><strong>Quy tắc tổng quát</strong> — mọi phương trình tuyến tính <strong>thuần nhất</strong> (vế phải bằng 0), và mọi hệ thuần nhất, đều định nghĩa một không gian con. Tập nghiệm của Ax = 0 luôn là không gian con của Rⁿ.</li>
<li><strong>Ba phản ví dụ đáng thuộc lòng</strong> — {(x, y) : x + y = 1} trượt điều kiện 1; {(x, y) : xy = 0} trượt điều kiện 2, vì (1, 0) + (0, 1) = (1, 1) có tích bằng 1 ≠ 0; {(x, y) : x ≥ 0} trượt điều kiện 3, vì (−1)(1, 0) = (−1, 0) có toạ độ đầu âm.</li>
</ul>
<p class="meo">💡 Hãy kiểm theo thứ tự 1 → 3 → 2: phép kiểm số 0 là tức thì, phép kiểm nhân vô hướng thường chỉ cần đặt c ra ngoài, và chỉ phép kiểm cộng mới phải viết thật. Đa số tập không phải không gian con chết ngay ở bước 1 hoặc bước 3.</p>
<p class="pitfall">⚠️ Kiểm tính đóng trên <em>một cặp vector cụ thể</em> rồi coi đó là chứng minh. "(1,0,1) + (0,1,2) vẫn thuộc W, vậy là đóng" chẳng chứng minh được gì — lập luận phải dùng u và v tổng quát. Ngược lại, một cặp làm hỏng <strong>đã là</strong> một bác bỏ trọn vẹn; chính sự bất đối xứng đó mới là điều cần nhớ.</p>`],

      [5, 'Linear combination and span',
        `<p class="y-chinh">🎯 A <strong>linear combination</strong> of v₁, …, v_k is any expression c₁v₁ + c₂v₂ + ⋯ + c_kv_k, and the set of all of them is the <strong>span</strong>.</p>
<ul>
<li><strong>The definition</strong> — c₁v₁ + c₂v₂ + ⋯ + c_kv_k where the coefficients cᵢ run over all real numbers. Only scaling and adding are allowed: no products of vectors, no powers.</li>
<li><strong>A concrete combination</strong> — with v₁ = (1, 0, 1) and v₂ = (0, 1, 1), the choice c₁ = 3, c₂ = 2 gives 3(1, 0, 1) + 2(0, 1, 1) = (3, 2, 5). That single vector is one member of the span.</li>
<li><strong>Span as a set</strong> — span{v₁, …, v_k} = {c₁v₁ + ⋯ + c_kv_k : cᵢ real}. It is not one vector but the entire infinite collection reachable from the list.</li>
<li><strong>Span is always a subspace</strong> — it contains 0 (take every cᵢ = 0), the sum of two combinations is a combination, and a scalar times a combination is a combination. So all three conditions of slide 3 hold automatically.</li>
<li><strong>How the size grows</strong> — span of one nonzero vector is a <strong>line</strong> through the origin; span of two non-parallel vectors is a <strong>plane</strong>; span of three independent vectors in R³ is all of R³.</li>
<li><strong>"Spanning set" vocabulary</strong> — if span{v₁, …, v_k} = W we say the list <em>spans</em> (generates) W. Deciding whether a given b lies in the span means solving the system [v₁ | ⋯ | v_k]c = b.</li>
<li><strong>Membership test in practice</strong> — is (3, 2, 5) in span{(1,0,1), (0,1,1)}? Solve c₁ = 3, c₂ = 2, c₁ + c₂ = 5: the first two fix the coefficients and the third gives 3 + 2 = 5 ✓, so yes. For (7, 1, 4) the third equation would demand 7 + 1 = 4, which is false, so no.</li>
</ul>
<p class="meo">💡 "Is b in the span?" is never a new kind of question — it is the Chapter 5 question "is the system [v₁ | ⋯ | v_k]c = b consistent?" wearing different clothes. Build the augmented matrix and eliminate.</p>
<p class="pitfall">⚠️ Assuming k vectors always span a k-dimensional space. Adding a vector that is already a combination of the others enlarges the list but <strong>not</strong> the span: span{(1,2), (2,4)} is still just a line, because (2,4) = 2(1,2) adds no new direction.</p>`,
        `<p class="y-chinh">🎯 <strong>Tổ hợp tuyến tính</strong> của v₁, …, v_k là mọi biểu thức c₁v₁ + c₂v₂ + ⋯ + c_kv_k, và tập hợp tất cả chúng gọi là <strong>tập sinh</strong> (span).</p>
<ul>
<li><strong>Định nghĩa</strong> — c₁v₁ + c₂v₂ + ⋯ + c_kv_k với các hệ số cᵢ chạy khắp số thực. Chỉ được nhân vô hướng và cộng: không có tích của hai vector, không có luỹ thừa.</li>
<li><strong>Một tổ hợp cụ thể</strong> — với v₁ = (1, 0, 1) và v₂ = (0, 1, 1), chọn c₁ = 3, c₂ = 2 được 3(1, 0, 1) + 2(0, 1, 1) = (3, 2, 5). Riêng vector đó là một phần tử của span.</li>
<li><strong>Span như một tập hợp</strong> — span{v₁, …, v_k} = {c₁v₁ + ⋯ + c_kv_k : cᵢ thực}. Nó không phải một vector mà là cả một tập vô hạn vươn tới được từ danh sách đã cho.</li>
<li><strong>Span luôn là không gian con</strong> — nó chứa 0 (lấy mọi cᵢ = 0), tổng hai tổ hợp vẫn là tổ hợp, và số nhân một tổ hợp cũng là tổ hợp. Vậy cả ba điều kiện ở slide 3 tự động thoả.</li>
<li><strong>Kích thước lớn dần thế nào</strong> — span của một vector khác 0 là một <strong>đường thẳng</strong> qua gốc; span của hai vector không cùng phương là một <strong>mặt phẳng</strong>; span của ba vector độc lập trong R³ là toàn bộ R³.</li>
<li><strong>Từ vựng "tập sinh"</strong> — nếu span{v₁, …, v_k} = W ta nói danh sách đó <em>sinh ra</em> W. Hỏi một vector b có thuộc span hay không chính là giải hệ [v₁ | ⋯ | v_k]c = b.</li>
<li><strong>Kiểm phần tử trong thực tế</strong> — (3, 2, 5) có thuộc span{(1,0,1), (0,1,1)} không? Giải c₁ = 3, c₂ = 2, c₁ + c₂ = 5: hai phương trình đầu chốt hệ số, phương trình thứ ba cho 3 + 2 = 5 ✓, vậy là có. Với (7, 1, 4) thì phương trình thứ ba đòi 7 + 1 = 4, sai, vậy là không.</li>
</ul>
<p class="meo">💡 "b có thuộc span không?" chưa bao giờ là câu hỏi loại mới — nó chính là câu hỏi Chương 5 "hệ [v₁ | ⋯ | v_k]c = b có nghiệm không?" khoác áo khác. Cứ lập ma trận bổ sung rồi khử.</p>
<p class="pitfall">⚠️ Tưởng k vector thì luôn sinh ra không gian k chiều. Thêm một vector vốn đã là tổ hợp của các vector kia thì danh sách dài ra nhưng span <strong>không</strong> lớn thêm: span{(1,2), (2,4)} vẫn chỉ là một đường thẳng, vì (2,4) = 2(1,2) không thêm hướng mới nào.</p>`],

      [6, 'Worked example — the span of two vectors in R3 is a plane',
        `<p class="y-chinh">🎯 Show that span{(1, 0, 1), (0, 1, 1)} is the plane z = x + y, by eliminating the parameters.</p>
<ul>
<li><strong>Step 1 — write the general element</strong> — c₁(1, 0, 1) + c₂(0, 1, 1) = (c₁·1 + c₂·0, c₁·0 + c₂·1, c₁·1 + c₂·1) = <strong>(c₁, c₂, c₁ + c₂)</strong>.</li>
<li><strong>Step 2 — name the coordinates</strong> — set x = c₁, y = c₂, z = c₁ + c₂. The first two equations say the parameters <em>are</em> the first two coordinates.</li>
<li><strong>Step 3 — eliminate the parameters</strong> — substitute c₁ = x and c₂ = y into the third equation: <strong>z = x + y</strong>, equivalently x + y − z = 0.</li>
<li><strong>Step 4 — identify the object</strong> — x + y − z = 0 is a homogeneous linear equation in three unknowns, so it is a <strong>plane through the origin</strong> with normal vector (1, 1, −1). Two non-parallel vectors span a plane, not all of R³.</li>
<li><strong>Check the generators lie on it</strong> — (1, 0, 1): 1 + 0 − 1 = 0 ✓. (0, 1, 1): 0 + 1 − 1 = 0 ✓. Both original vectors satisfy the equation, as they must.</li>
<li><strong>Check a combination lies on it</strong> — 3v₁ + 2v₂ = (3, 2, 5): 3 + 2 − 5 = 0 ✓. And a non-member: (7, 1, 4) gives 7 + 1 − 4 = 4 ≠ 0, so (7, 1, 4) is <strong>not</strong> in the span.</li>
<li><strong>Why exactly two dimensions</strong> — neither vector is a multiple of the other, so both directions are genuinely needed; but two directions cannot reach out of their common plane, so the span is 2-dimensional. This anticipates dim(span) = number of pivots on slide 11.</li>
</ul>
<p class="meo">💡 Converting a span into an equation is always the same drill: write the general combination, read off the parameters from the easy coordinates, then substitute them into the remaining ones. Each leftover coordinate gives one equation.</p>
<p class="pitfall">⚠️ Concluding "two vectors in R³ ⇒ a plane" without checking they are non-parallel. span{(1, 2, 3), (2, 4, 6)} is only a <strong>line</strong>, because the second vector is twice the first. Always confirm independence before naming the geometry.</p>`,
        `<p class="y-chinh">🎯 Chứng minh span{(1, 0, 1), (0, 1, 1)} chính là mặt phẳng z = x + y, bằng cách khử tham số.</p>
<ul>
<li><strong>Bước 1 — viết phần tử tổng quát</strong> — c₁(1, 0, 1) + c₂(0, 1, 1) = (c₁·1 + c₂·0, c₁·0 + c₂·1, c₁·1 + c₂·1) = <strong>(c₁, c₂, c₁ + c₂)</strong>.</li>
<li><strong>Bước 2 — đặt tên toạ độ</strong> — đặt x = c₁, y = c₂, z = c₁ + c₂. Hai phương trình đầu nói rằng các tham số <em>chính là</em> hai toạ độ đầu.</li>
<li><strong>Bước 3 — khử tham số</strong> — thay c₁ = x và c₂ = y vào phương trình thứ ba: <strong>z = x + y</strong>, tương đương x + y − z = 0.</li>
<li><strong>Bước 4 — nhận diện đối tượng</strong> — x + y − z = 0 là phương trình tuyến tính thuần nhất ba ẩn, nên đó là một <strong>mặt phẳng qua gốc toạ độ</strong> với vector pháp tuyến (1, 1, −1). Hai vector không cùng phương sinh ra một mặt phẳng, chứ không phải toàn bộ R³.</li>
<li><strong>Kiểm hai vector sinh có nằm trên đó không</strong> — (1, 0, 1): 1 + 0 − 1 = 0 ✓. (0, 1, 1): 0 + 1 − 1 = 0 ✓. Cả hai vector gốc đều thoả phương trình, đúng như bắt buộc phải vậy.</li>
<li><strong>Kiểm một tổ hợp</strong> — 3v₁ + 2v₂ = (3, 2, 5): 3 + 2 − 5 = 0 ✓. Và một vector không thuộc: (7, 1, 4) cho 7 + 1 − 4 = 4 ≠ 0, vậy (7, 1, 4) <strong>không</strong> thuộc span.</li>
<li><strong>Vì sao đúng hai chiều</strong> — không vector nào là bội của vector kia, nên cả hai hướng đều thật sự cần thiết; nhưng hai hướng thì không vươn ra khỏi mặt phẳng chung của chúng được, nên span là 2 chiều. Điều này báo trước công thức dim(span) = số pivot ở slide 11.</li>
</ul>
<p class="meo">💡 Biến một span thành phương trình luôn theo một bài tập duy nhất: viết tổ hợp tổng quát, đọc tham số ra từ những toạ độ dễ, rồi thay chúng vào các toạ độ còn lại. Mỗi toạ độ còn dư cho đúng một phương trình.</p>
<p class="pitfall">⚠️ Kết luận "hai vector trong R³ ⇒ một mặt phẳng" mà không kiểm chúng có cùng phương không. span{(1, 2, 3), (2, 4, 6)} chỉ là một <strong>đường thẳng</strong>, vì vector thứ hai gấp đôi vector thứ nhất. Hãy luôn xác nhận tính độc lập trước khi gọi tên hình học.</p>`],

      [7, 'Linear independence',
        `<p class="y-chinh">🎯 The set {v₁, …, v_k} is <strong>linearly independent</strong> when c₁v₁ + ⋯ + c_kv_k = 0 forces c₁ = c₂ = ⋯ = c_k = 0, and nothing else.</p>
<ul>
<li><strong>The defining equation</strong> — always start from c₁v₁ + c₂v₂ + ⋯ + c_kv_k = <strong>0</strong> (the zero vector). This is a homogeneous system in the unknowns c₁, …, c_k.</li>
<li><strong>The trivial solution is free</strong> — c₁ = ⋯ = c_k = 0 always works, for any list of vectors. The question is never "does a solution exist" but "is the trivial one the <em>only</em> one".</li>
<li><strong>Independent</strong> — only the trivial solution exists. No vector in the list can be written using the others, so every one of them contributes a genuinely new direction.</li>
<li><strong>Dependent</strong> — some solution has at least one cᵢ ≠ 0. Then that vᵢ can be isolated: vᵢ = −(1/cᵢ)(sum of the other terms), so vᵢ is redundant and can be deleted without shrinking the span.</li>
<li><strong>Smallest example</strong> — v₁ = (1, 2), v₂ = (2, 4): the combination 2v₁ − v₂ = (2, 4) − (2, 4) = 0 uses coefficients (2, −1), which are not both zero, so the pair is <strong>dependent</strong>.</li>
<li><strong>Automatic dependence, case 1</strong> — any list containing the zero vector is dependent: 1·0 + 0·v₂ + ⋯ + 0·v_k = 0 already has a nonzero coefficient.</li>
<li><strong>Automatic dependence, case 2</strong> — more than n vectors in Rⁿ are always dependent, because the homogeneous system then has more unknowns than equations and must have a free variable. Four vectors in R³ can never be independent.</li>
<li><strong>Two vectors only</strong> — a pair is dependent exactly when one is a scalar multiple of the other. For three or more vectors this shortcut fails and you must solve the system.</li>
</ul>
<p class="meo">💡 Read "independent" as "no waste": the list carries no vector that the others could already build. That is why a basis, which must be minimal, is required to be independent.</p>
<p class="pitfall">⚠️ Testing pairwise instead of all at once. {(1,0), (0,1), (1,1)} has no two vectors parallel, yet it is dependent because (1,0) + (0,1) − (1,1) = 0. Dependence is a property of the <strong>whole set</strong>, never of pairs.</p>`,
        `<p class="y-chinh">🎯 Tập {v₁, …, v_k} <strong>độc lập tuyến tính</strong> khi c₁v₁ + ⋯ + c_kv_k = 0 buộc c₁ = c₂ = ⋯ = c_k = 0, và không còn khả năng nào khác.</p>
<ul>
<li><strong>Phương trình định nghĩa</strong> — luôn xuất phát từ c₁v₁ + c₂v₂ + ⋯ + c_kv_k = <strong>0</strong> (vector không). Đây là một hệ thuần nhất với các ẩn c₁, …, c_k.</li>
<li><strong>Nghiệm tầm thường thì cho không</strong> — c₁ = ⋯ = c_k = 0 luôn đúng, với bất kỳ danh sách vector nào. Câu hỏi chưa bao giờ là "có nghiệm không" mà là "nghiệm tầm thường có phải nghiệm <em>duy nhất</em> không".</li>
<li><strong>Độc lập</strong> — chỉ tồn tại nghiệm tầm thường. Không vector nào trong danh sách viết được qua các vector còn lại, nên mỗi cái đều đóng góp một hướng thật sự mới.</li>
<li><strong>Phụ thuộc</strong> — có một nghiệm với ít nhất một cᵢ ≠ 0. Khi đó tách được vᵢ ra: vᵢ = −(1/cᵢ)(tổng các số hạng còn lại), nên vᵢ là thừa và xoá đi cũng không làm span nhỏ lại.</li>
<li><strong>Ví dụ nhỏ nhất</strong> — v₁ = (1, 2), v₂ = (2, 4): tổ hợp 2v₁ − v₂ = (2, 4) − (2, 4) = 0 dùng bộ hệ số (2, −1), không phải cả hai đều bằng 0, nên cặp này <strong>phụ thuộc</strong>.</li>
<li><strong>Phụ thuộc tự động, trường hợp 1</strong> — mọi danh sách có chứa vector 0 đều phụ thuộc: 1·0 + 0·v₂ + ⋯ + 0·v_k = 0 đã có sẵn một hệ số khác 0.</li>
<li><strong>Phụ thuộc tự động, trường hợp 2</strong> — nhiều hơn n vector trong Rⁿ thì luôn phụ thuộc, vì hệ thuần nhất khi đó có số ẩn nhiều hơn số phương trình nên bắt buộc có biến tự do. Bốn vector trong R³ không bao giờ độc lập được.</li>
<li><strong>Riêng trường hợp hai vector</strong> — một cặp phụ thuộc đúng khi vector này là bội vô hướng của vector kia. Từ ba vector trở lên thì mẹo này hỏng và bắt buộc phải giải hệ.</li>
</ul>
<p class="meo">💡 Hãy đọc "độc lập" thành "không thừa": danh sách không mang theo vector nào mà những vector kia đã dựng được rồi. Đó chính là lý do cơ sở, vốn phải tối thiểu, bắt buộc phải độc lập.</p>
<p class="pitfall">⚠️ Kiểm từng cặp thay vì kiểm cả nhóm cùng lúc. {(1,0), (0,1), (1,1)} không có hai vector nào cùng phương, thế mà vẫn phụ thuộc vì (1,0) + (0,1) − (1,1) = 0. Phụ thuộc là tính chất của <strong>cả tập</strong>, không bao giờ là của từng cặp.</p>`],

      [8, 'Testing independence with a matrix and Gaussian elimination',
        `<p class="y-chinh">🎯 Put the vectors in the columns of a matrix A, reduce, and count pivots: k pivots for k vectors means independent.</p>
<ul>
<li><strong>Step 1 — build the matrix</strong> — A = [v₁ | v₂ | ⋯ | v_k], one vector per column. Then c₁v₁ + ⋯ + c_kv_k = 0 is exactly the homogeneous system <strong>Ac = 0</strong>.</li>
<li><strong>Step 2 — reduce to row echelon form</strong> — apply ordinary Gaussian elimination. No augmented column is needed: the right-hand side is 0 and stays 0 throughout.</li>
<li><strong>Step 3 — count pivots</strong> — <strong>k pivots</strong> (every column is a pivot column, no free variables) means only the trivial solution, hence <strong>independent</strong>.</li>
<li><strong>Step 4 — or spot a free column</strong> — a column without a pivot gives a free variable, hence a nontrivial solution, hence <strong>dependent</strong>. The number of free columns counts how many vectors are redundant.</li>
<li><strong>Independent example</strong> — v₁ = (1, 2, 3), v₂ = (2, 5, 7), v₃ = (1, 3, 5), so A = [1 2 1; 2 5 3; 3 7 5]. R2 → R2 − 2R1 gives (0, 1, 1); R3 → R3 − 3R1 gives (0, 1, 2); R3 → R3 − R2 gives (0, 0, 1). REF = [1 2 1; 0 1 1; 0 0 1], <strong>3 pivots for 3 columns ⇒ independent</strong>.</li>
<li><strong>Dependent example</strong> — v₁ = (1, 1, 0), v₂ = (0, 1, 1), v₃ = (1, 2, 1), so A = [1 0 1; 1 1 2; 0 1 1]. R2 → R2 − R1 gives (0, 1, 1); R3 → R3 − R2 gives (0, 0, 0). REF = [1 0 1; 0 1 1; 0 0 0], only <strong>2 pivots for 3 columns ⇒ dependent</strong>.</li>
<li><strong>Read off the relation</strong> — in that dependent case column 3 is free: set c₃ = t, then c₂ + t = 0 and c₁ + t = 0, so c = t(−1, −1, 1). Taking t = 1: −v₁ − v₂ + v₃ = 0, i.e. <strong>v₃ = v₁ + v₂</strong>. Check: (1,1,0) + (0,1,1) = (1, 2, 1) ✓.</li>
<li><strong>Square shortcut</strong> — for exactly n vectors in Rⁿ the matrix is square, so independence is equivalent to det(A) ≠ 0. For (1, 2) and (2, 4) the determinant is 1(4) − 2(2) = 0, confirming dependence without elimination.</li>
</ul>
<p class="meo">💡 Independence, rank and pivot count are three names for one measurement. Once the matrix is in REF you can answer "independent?", "what is the rank?" and "what is the dimension of the span?" from the same picture.</p>
<p class="pitfall">⚠️ Two errors here. First, mixing up rows and columns: if you place vectors in <em>rows</em> the pivot count still gives the dimension, but the pivot <em>columns</em> no longer point at the original vectors. Second, answering "dependent" whenever a zero row appears without checking — a zero row means fewer pivots than <strong>rows</strong>, while dependence is about fewer pivots than <strong>columns</strong>.</p>`,
        `<p class="y-chinh">🎯 Xếp các vector vào cột một ma trận A, khử Gauss, rồi đếm pivot: k pivot cho k vector nghĩa là độc lập.</p>
<ul>
<li><strong>Bước 1 — lập ma trận</strong> — A = [v₁ | v₂ | ⋯ | v_k], mỗi vector một cột. Khi đó c₁v₁ + ⋯ + c_kv_k = 0 chính là hệ thuần nhất <strong>Ac = 0</strong>.</li>
<li><strong>Bước 2 — khử về dạng bậc thang</strong> — dùng đúng phép khử Gauss thông thường. Không cần cột bổ sung: vế phải bằng 0 và giữ nguyên bằng 0 suốt quá trình.</li>
<li><strong>Bước 3 — đếm pivot</strong> — <strong>k pivot</strong> (mọi cột đều là cột pivot, không có biến tự do) nghĩa là chỉ có nghiệm tầm thường, tức <strong>độc lập</strong>.</li>
<li><strong>Bước 4 — hoặc bắt cột tự do</strong> — một cột không có pivot cho một biến tự do, tức có nghiệm khác 0, tức <strong>phụ thuộc</strong>. Số cột tự do đếm luôn xem bao nhiêu vector là thừa.</li>
<li><strong>Ví dụ độc lập</strong> — v₁ = (1, 2, 3), v₂ = (2, 5, 7), v₃ = (1, 3, 5), nên A = [1 2 1; 2 5 3; 3 7 5]. R2 → R2 − 2R1 cho (0, 1, 1); R3 → R3 − 3R1 cho (0, 1, 2); R3 → R3 − R2 cho (0, 0, 1). REF = [1 2 1; 0 1 1; 0 0 1], <strong>3 pivot cho 3 cột ⇒ độc lập</strong>.</li>
<li><strong>Ví dụ phụ thuộc</strong> — v₁ = (1, 1, 0), v₂ = (0, 1, 1), v₃ = (1, 2, 1), nên A = [1 0 1; 1 1 2; 0 1 1]. R2 → R2 − R1 cho (0, 1, 1); R3 → R3 − R2 cho (0, 0, 0). REF = [1 0 1; 0 1 1; 0 0 0], chỉ <strong>2 pivot cho 3 cột ⇒ phụ thuộc</strong>.</li>
<li><strong>Đọc ra luôn hệ thức phụ thuộc</strong> — ở ví dụ phụ thuộc đó cột 3 là cột tự do: đặt c₃ = t thì c₂ + t = 0 và c₁ + t = 0, nên c = t(−1, −1, 1). Lấy t = 1: −v₁ − v₂ + v₃ = 0, tức <strong>v₃ = v₁ + v₂</strong>. Kiểm: (1,1,0) + (0,1,1) = (1, 2, 1) ✓.</li>
<li><strong>Mẹo cho ma trận vuông</strong> — khi có đúng n vector trong Rⁿ thì ma trận vuông, nên độc lập tương đương với det(A) ≠ 0. Với (1, 2) và (2, 4) thì định thức là 1(4) − 2(2) = 0, khẳng định phụ thuộc mà chẳng cần khử.</li>
</ul>
<p class="meo">💡 Độc lập, hạng và số pivot là ba cái tên của cùng một phép đo. Khi ma trận đã về REF thì các câu "có độc lập không?", "hạng bằng mấy?" và "span có số chiều bao nhiêu?" đều trả lời được từ một bức tranh.</p>
<p class="pitfall">⚠️ Hai lỗi ở đây. Thứ nhất, lẫn hàng với cột: nếu xếp vector thành <em>hàng</em> thì số pivot vẫn cho số chiều, nhưng các <em>cột</em> pivot không còn chỉ vào những vector gốc nữa. Thứ hai, thấy hàng 0 là phán "phụ thuộc" mà không kiểm — hàng 0 nghĩa là số pivot ít hơn số <strong>hàng</strong>, còn phụ thuộc là số pivot ít hơn số <strong>cột</strong>.</p>`],

      [9, 'Basis of a vector space',
        `<p class="y-chinh">🎯 A <strong>basis</strong> of V is a list that does two jobs at once: it <em>spans</em> V and it is <em>linearly independent</em>.</p>
<ul>
<li><strong>Condition 1 — spanning</strong> — span{v₁, …, v_k} = V, so every vector of V can be reached as some combination. Nothing in V is left out.</li>
<li><strong>Condition 2 — independent</strong> — no vector in the list is redundant. Nothing in the list is wasted.</li>
<li><strong>Read the two together</strong> — a basis is a <em>minimal</em> spanning set and, equivalently, a <em>maximal</em> independent set. Remove one vector and it stops spanning; add one and it stops being independent.</li>
<li><strong>The standard basis of R³</strong> — e₁ = (1, 0, 0), e₂ = (0, 1, 0), e₃ = (0, 0, 1). Any (a, b, c) equals ae₁ + be₂ + ce₃, and the combination is zero only when a = b = c = 0.</li>
<li><strong>Bases are not unique</strong> — {(1, 1), (1, −1)} is also a basis of R². It is independent because neither is a multiple of the other, and it spans: solving a(1,1) + b(1,−1) = (5, 1) gives a + b = 5 and a − b = 1, so a = 3, b = 2. Check: 3(1,1) + 2(1,−1) = (5, 1) ✓.</li>
<li><strong>Unique coordinates</strong> — the real payoff: relative to a fixed basis, every vector of V has <strong>exactly one</strong> coordinate list. If two combinations gave the same vector, subtracting them would produce a nontrivial zero combination, contradicting independence.</li>
<li><strong>Coordinates depend on the basis</strong> — the vector (5, 1) has coordinates (5, 1) in the standard basis but (3, 2) in the basis above. The vector never changed; only the ruler did.</li>
<li><strong>The empty basis</strong> — the subspace {0} has the empty list as its basis, which is why its dimension is 0. The zero vector itself can never belong to a basis.</li>
</ul>
<p class="meo">💡 Check the two conditions in the cheap order: independence is a single elimination, while spanning is often automatic once you already know the dimension (see slide 10) — k independent vectors in a k-dimensional space are a basis with no further work.</p>
<p class="pitfall">⚠️ Verifying only one condition. {(1,0,0), (0,1,0)} is independent but does not span R³; {(1,0,0), (0,1,0), (0,0,1), (1,1,1)} spans R³ but is dependent. Neither is a basis — a basis needs both properties at the same time.</p>`,
        `<p class="y-chinh">🎯 <strong>Cơ sở</strong> của V là một danh sách làm cùng lúc hai việc: nó <em>sinh ra</em> V và nó <em>độc lập tuyến tính</em>.</p>
<ul>
<li><strong>Điều kiện 1 — sinh</strong> — span{v₁, …, v_k} = V, nên mọi vector của V đều vươn tới được dưới dạng một tổ hợp nào đó. Không sót phần nào của V.</li>
<li><strong>Điều kiện 2 — độc lập</strong> — không vector nào trong danh sách là thừa. Không phí phần nào của danh sách.</li>
<li><strong>Đọc hai điều kiện cùng nhau</strong> — cơ sở là tập sinh <em>tối thiểu</em>, và tương đương, là tập độc lập <em>tối đại</em>. Bỏ đi một vector thì nó thôi sinh; thêm vào một vector thì nó thôi độc lập.</li>
<li><strong>Cơ sở chuẩn của R³</strong> — e₁ = (1, 0, 0), e₂ = (0, 1, 0), e₃ = (0, 0, 1). Mọi (a, b, c) đều bằng ae₁ + be₂ + ce₃, và tổ hợp đó bằng 0 chỉ khi a = b = c = 0.</li>
<li><strong>Cơ sở không duy nhất</strong> — {(1, 1), (1, −1)} cũng là một cơ sở của R². Nó độc lập vì không vector nào là bội của vector kia, và nó sinh: giải a(1,1) + b(1,−1) = (5, 1) được a + b = 5 và a − b = 1, nên a = 3, b = 2. Kiểm: 3(1,1) + 2(1,−1) = (5, 1) ✓.</li>
<li><strong>Toạ độ là duy nhất</strong> — đây mới là phần thưởng thật: ứng với một cơ sở đã chốt, mỗi vector của V có <strong>đúng một</strong> bộ toạ độ. Nếu hai tổ hợp cho cùng một vector thì hiệu của chúng sẽ là một tổ hợp bằng 0 không tầm thường, mâu thuẫn với tính độc lập.</li>
<li><strong>Toạ độ phụ thuộc vào cơ sở</strong> — vector (5, 1) có toạ độ (5, 1) trong cơ sở chuẩn nhưng là (3, 2) trong cơ sở phía trên. Vector không hề đổi; chỉ cái thước đo là đổi.</li>
<li><strong>Cơ sở rỗng</strong> — không gian con {0} có cơ sở là danh sách rỗng, và vì thế số chiều của nó bằng 0. Bản thân vector 0 không bao giờ được nằm trong một cơ sở.</li>
</ul>
<p class="meo">💡 Hãy kiểm hai điều kiện theo thứ tự rẻ tiền trước: độc lập chỉ là một lượt khử, còn tính sinh thường tự động khi đã biết số chiều (xem slide 10) — k vector độc lập trong không gian k chiều là cơ sở mà không cần làm gì thêm.</p>
<p class="pitfall">⚠️ Chỉ kiểm một trong hai điều kiện. {(1,0,0), (0,1,0)} độc lập nhưng không sinh ra R³; {(1,0,0), (0,1,0), (0,0,1), (1,1,1)} sinh ra R³ nhưng phụ thuộc. Không cái nào là cơ sở — cơ sở cần cả hai tính chất cùng lúc.</p>`],

      [10, 'Dimension',
        `<p class="y-chinh">🎯 Theorem: every basis of the same space V has the <strong>same number of vectors</strong>, and that number is the <strong>dimension</strong> dim(V).</p>
<ul>
<li><strong>The invariance theorem</strong> — if one basis of V has k vectors then every basis of V has exactly k vectors. The count cannot depend on which basis you happened to pick.</li>
<li><strong>The definition</strong> — dim(V) is that common count. It is the single number that measures "how many independent directions does V have".</li>
<li><strong>The reference value</strong> — dim(Rⁿ) = n, because the standard basis e₁, …, eₙ has n vectors. In particular dim(R³) = 3 and dim(R²) = 2.</li>
<li><strong>Dimensions in R³</strong> — {0} has dimension 0 (empty basis), a line through the origin has dimension 1, a plane through the origin has dimension 2, and R³ itself has dimension 3. There is nothing in between.</li>
<li><strong>Worked case — the plane x + 2y − z = 0</strong> — solve for x: x = z − 2y. Let y = s and z = t be free, then the general point is (t − 2s, s, t) = s(−2, 1, 0) + t(1, 0, 1). Two free parameters, so <strong>dim = 2</strong>.</li>
<li><strong>Check that basis</strong> — (−2, 1, 0): (−2) + 2(1) − 0 = 0 ✓. (1, 0, 1): 1 + 2(0) − 1 = 0 ✓. Both lie in the plane, and neither is a multiple of the other, so {(−2,1,0), (1,0,1)} is a basis.</li>
<li><strong>Dimension of a subspace</strong> — if W is a subspace of V then dim(W) ≤ dim(V), with equality only when W = V. A 3-dimensional subspace of R³ must be all of R³.</li>
<li><strong>The counting shortcut</strong> — in a space known to be k-dimensional, any k <strong>independent</strong> vectors automatically form a basis, and any k vectors that <strong>span</strong> it automatically form a basis. Knowing the dimension halves the work.</li>
</ul>
<p class="meo">💡 Dimension = number of free parameters needed to describe the space = number of pivots when you eliminate. Those three sentences are the same statement and each is the easy one in some problem.</p>
<p class="pitfall">⚠️ Confusing the dimension of a subspace with the dimension of the ambient space it lives in. The plane x + 2y − z = 0 consists of vectors with three coordinates, but its dimension is <strong>2</strong>, not 3. The coordinate count is n; the dimension is the number of independent directions inside.</p>`,
        `<p class="y-chinh">🎯 Định lý: mọi cơ sở của cùng một không gian V đều có <strong>cùng số vector</strong>, và con số đó gọi là <strong>số chiều</strong> dim(V).</p>
<ul>
<li><strong>Định lý bất biến</strong> — nếu một cơ sở của V có k vector thì mọi cơ sở của V đều có đúng k vector. Con số này không thể phụ thuộc vào việc bạn tình cờ chọn cơ sở nào.</li>
<li><strong>Định nghĩa</strong> — dim(V) chính là con số chung đó. Nó là một số duy nhất đo "V có bao nhiêu hướng độc lập".</li>
<li><strong>Giá trị mốc</strong> — dim(Rⁿ) = n, vì cơ sở chuẩn e₁, …, eₙ có n vector. Cụ thể dim(R³) = 3 và dim(R²) = 2.</li>
<li><strong>Các số chiều trong R³</strong> — {0} có số chiều 0 (cơ sở rỗng), một đường thẳng qua gốc có số chiều 1, một mặt phẳng qua gốc có số chiều 2, và chính R³ có số chiều 3. Không có gì nằm chen giữa.</li>
<li><strong>Trường hợp giải đủ — mặt phẳng x + 2y − z = 0</strong> — giải theo x: x = z − 2y. Cho y = s và z = t làm biến tự do, điểm tổng quát là (t − 2s, s, t) = s(−2, 1, 0) + t(1, 0, 1). Hai tham số tự do, vậy <strong>dim = 2</strong>.</li>
<li><strong>Kiểm lại cơ sở đó</strong> — (−2, 1, 0): (−2) + 2(1) − 0 = 0 ✓. (1, 0, 1): 1 + 2(0) − 1 = 0 ✓. Cả hai đều nằm trên mặt phẳng, và không cái nào là bội của cái kia, nên {(−2,1,0), (1,0,1)} là một cơ sở.</li>
<li><strong>Số chiều của không gian con</strong> — nếu W là không gian con của V thì dim(W) ≤ dim(V), và dấu bằng chỉ xảy ra khi W = V. Một không gian con 3 chiều của R³ bắt buộc phải là toàn bộ R³.</li>
<li><strong>Mẹo đếm</strong> — trong một không gian đã biết là k chiều, k vector <strong>độc lập</strong> bất kỳ tự động lập thành cơ sở, và k vector <strong>sinh</strong> ra nó cũng tự động lập thành cơ sở. Biết số chiều là giảm được một nửa công việc.</li>
</ul>
<p class="meo">💡 Số chiều = số tham số tự do cần để mô tả không gian = số pivot khi khử. Ba câu đó là cùng một mệnh đề, và trong mỗi bài toán sẽ có một câu là câu dễ.</p>
<p class="pitfall">⚠️ Lẫn số chiều của không gian con với số chiều của không gian bao quanh nó. Mặt phẳng x + 2y − z = 0 gồm những vector có ba toạ độ, nhưng số chiều của nó là <strong>2</strong>, không phải 3. Số toạ độ là n; số chiều là số hướng độc lập bên trong.</p>`],

      [11, 'Finding a basis and the dimension of a subspace',
        `<p class="y-chinh">🎯 Given W = span{v₁, …, v_k}, put the vectors into a matrix, eliminate, and the pivots hand you both a basis and the dimension.</p>
<ul>
<li><strong>Step 1 — build the matrix</strong> — place the vectors as <em>rows</em> (row method) or as <em>columns</em> (column method). Both work; they just return different bases.</li>
<li><strong>Step 2 — reduce to REF</strong> — ordinary Gaussian elimination, exactly as in Chapter 5.</li>
<li><strong>Step 3 (row method) — take the nonzero rows</strong> — after elimination the nonzero rows are independent and span the same W, so they form a basis. The basis vectors are usually <em>not</em> the original vᵢ.</li>
<li><strong>Step 3 (column method) — take the pivot columns</strong> — identify which columns hold pivots, then keep the corresponding <strong>original</strong> vectors. Use this when the answer must consist of vectors from the given list.</li>
<li><strong>Step 4 — dimension</strong> — dim(W) = number of basis vectors = <strong>number of pivots</strong>, by either method. The two methods always agree on this count.</li>
<li><strong>Worked example — W = span{(1,2,1), (2,4,3), (3,6,4)}, row method</strong> — rows [1 2 1; 2 4 3; 3 6 4]. R2 → R2 − 2R1 gives (0, 0, 1); R3 → R3 − 3R1 gives (0, 0, 1); R3 → R3 − R2 gives (0, 0, 0). REF = [1 2 1; 0 0 1; 0 0 0], so a basis is <strong>{(1,2,1), (0,0,1)}</strong> and <strong>dim(W) = 2</strong>.</li>
<li><strong>Same example, column method</strong> — columns [1 2 3; 2 4 6; 1 3 4]. R2 → R2 − 2R1 gives (0, 0, 0); R3 → R3 − R1 gives (0, 1, 1); swapping rows 2 and 3 gives REF = [1 2 3; 0 1 1; 0 0 0]. Pivots sit in columns 1 and 2, so a basis is <strong>{(1,2,1), (2,4,3)}</strong>, again of size 2.</li>
<li><strong>Cross-check the two answers</strong> — the third vector must be redundant, and indeed (1,2,1) + (2,4,3) = <strong>(3, 6, 4)</strong> = v₃ ✓. Different bases, same dimension 2 — exactly what slide 10 promised.</li>
</ul>
<p class="meo">💡 Pick the method by what the question demands: "find <em>a</em> basis" ⇒ row method (fastest, gives tidy vectors); "choose a basis <em>from the given vectors</em>" ⇒ column method (pivot columns point back at the originals).</p>
<p class="pitfall">⚠️ With the column method, taking the pivot columns of the <strong>reduced</strong> matrix instead of the original one. Elimination changes the columns themselves; only their <em>positions</em> are meaningful. Here the answer is (1,2,1) and (2,4,3) from A, not (1,0,0) and (2,1,0) from the REF.</p>`,
        `<p class="y-chinh">🎯 Cho W = span{v₁, …, v_k}, hãy xếp các vector vào một ma trận, khử Gauss, rồi các pivot trao cho bạn cả cơ sở lẫn số chiều.</p>
<ul>
<li><strong>Bước 1 — lập ma trận</strong> — đặt các vector thành <em>hàng</em> (cách hàng) hoặc thành <em>cột</em> (cách cột). Cả hai đều dùng được; chúng chỉ trả về những cơ sở khác nhau.</li>
<li><strong>Bước 2 — khử về REF</strong> — vẫn là khử Gauss thông thường, y hệt Chương 5.</li>
<li><strong>Bước 3 (cách hàng) — lấy các hàng khác 0</strong> — sau khi khử, các hàng khác 0 là độc lập và sinh ra đúng W đó, nên chúng lập thành một cơ sở. Các vector cơ sở thường <em>không</em> phải các vᵢ ban đầu.</li>
<li><strong>Bước 3 (cách cột) — lấy các cột pivot</strong> — xác định cột nào chứa pivot, rồi giữ lại những vector <strong>gốc</strong> tương ứng. Dùng cách này khi đề bắt đáp án phải gồm các vector trong danh sách đã cho.</li>
<li><strong>Bước 4 — số chiều</strong> — dim(W) = số vector cơ sở = <strong>số pivot</strong>, theo cách nào cũng vậy. Hai cách luôn cho cùng một con số này.</li>
<li><strong>Ví dụ giải đủ — W = span{(1,2,1), (2,4,3), (3,6,4)}, cách hàng</strong> — các hàng [1 2 1; 2 4 3; 3 6 4]. R2 → R2 − 2R1 cho (0, 0, 1); R3 → R3 − 3R1 cho (0, 0, 1); R3 → R3 − R2 cho (0, 0, 0). REF = [1 2 1; 0 0 1; 0 0 0], vậy một cơ sở là <strong>{(1,2,1), (0,0,1)}</strong> và <strong>dim(W) = 2</strong>.</li>
<li><strong>Cũng ví dụ đó, cách cột</strong> — các cột [1 2 3; 2 4 6; 1 3 4]. R2 → R2 − 2R1 cho (0, 0, 0); R3 → R3 − R1 cho (0, 1, 1); đổi chỗ hàng 2 với hàng 3 được REF = [1 2 3; 0 1 1; 0 0 0]. Pivot nằm ở cột 1 và cột 2, nên một cơ sở là <strong>{(1,2,1), (2,4,3)}</strong>, vẫn gồm 2 vector.</li>
<li><strong>Đối chiếu hai đáp án</strong> — vector thứ ba bắt buộc phải là thừa, và quả thật (1,2,1) + (2,4,3) = <strong>(3, 6, 4)</strong> = v₃ ✓. Hai cơ sở khác nhau, cùng số chiều 2 — đúng như slide 10 đã hứa.</li>
</ul>
<p class="meo">💡 Chọn cách theo yêu cầu của đề: "tìm <em>một</em> cơ sở" ⇒ cách hàng (nhanh nhất, cho vector gọn đẹp); "chọn cơ sở <em>từ các vector đã cho</em>" ⇒ cách cột (cột pivot chỉ ngược về các vector gốc).</p>
<p class="pitfall">⚠️ Ở cách cột, lấy các cột pivot của ma trận <strong>đã khử</strong> thay vì của ma trận gốc. Phép khử làm đổi chính các cột; chỉ <em>vị trí</em> của chúng mới có ý nghĩa. Ở đây đáp án là (1,2,1) và (2,4,3) lấy từ A, không phải (1,0,0) và (2,1,0) lấy từ REF.</p>`],

      [12, 'Dot product, length and distance in Rn',
        `<p class="y-chinh">🎯 The dot product u·v = u₁v₁ + u₂v₂ + ⋯ + uₙvₙ carries all the geometry of Rⁿ: length, distance and angle.</p>
<ul>
<li><strong>The dot product</strong> — multiply matching coordinates and add. The output is a single <strong>number</strong>, not a vector, which is why it is also called the scalar product.</li>
<li><strong>Length (norm)</strong> — ‖u‖ = √(u·u) = √(u₁² + ⋯ + uₙ²). It is the Pythagorean theorem extended to n coordinates, and ‖u‖ = 0 happens only for u = 0.</li>
<li><strong>Distance</strong> — d(u, v) = ‖u − v‖. Subtract componentwise first, then take the norm of the result.</li>
<li><strong>Worked numbers in R³</strong> — with u = (1, 2, 2) and v = (2, −1, 2): u·v = 1(2) + 2(−1) + 2(2) = 2 − 2 + 4 = <strong>4</strong>; ‖u‖ = √(1 + 4 + 4) = <strong>3</strong>; ‖v‖ = √(4 + 1 + 4) = <strong>3</strong>.</li>
<li><strong>Distance for the same pair</strong> — u − v = (1−2, 2−(−1), 2−2) = (−1, 3, 0), so d(u, v) = √(1 + 9 + 0) = √10 ≈ <strong>3,162</strong>.</li>
<li><strong>Angle</strong> — cos θ = (u·v)/(‖u‖·‖v‖) = 4/(3·3) = 4/9 ≈ 0,4444, giving θ ≈ <strong>63,6°</strong>. The formula works in any dimension, even where "angle" cannot be drawn.</li>
<li><strong>Orthogonality</strong> — u and v are <strong>orthogonal</strong> exactly when u·v = 0, which is cos θ = 0, i.e. θ = 90°. Example: (1, 2, 2)·(2, 1, −2) = 2 + 2 − 4 = <strong>0</strong>, so those two are perpendicular.</li>
<li><strong>Algebraic rules</strong> — u·v = v·u, u·(v + w) = u·v + u·w, (cu)·v = c(u·v), and u·u = ‖u‖² ≥ 0. A clean example in R⁴: ‖(1, 2, 2, 4)‖ = √(1 + 4 + 4 + 16) = √25 = <strong>5</strong>.</li>
</ul>
<p class="meo">💡 Pythagoras survives in Rⁿ: if u·v = 0 then ‖u + v‖² = ‖u‖² + ‖v‖². Check it on the orthogonal pair above: u + v = (3, 3, 0), ‖u + v‖² = 9 + 9 + 0 = 18, and ‖u‖² + ‖v‖² = 9 + 9 = 18 ✓.</p>
<p class="pitfall">⚠️ Forgetting the square root and reporting u·u as the length. For u = (1, 2, 2), u·u = 9 but ‖u‖ = 3. The other frequent slip is treating u·v as a vector — it is a scalar, so writing "u·v + w" with w a vector is meaningless.</p>`,
        `<p class="y-chinh">🎯 Tích vô hướng u·v = u₁v₁ + u₂v₂ + ⋯ + uₙvₙ mang theo toàn bộ hình học của Rⁿ: độ dài, khoảng cách và góc.</p>
<ul>
<li><strong>Tích vô hướng</strong> — nhân các toạ độ cùng vị trí rồi cộng lại. Kết quả là một <strong>con số</strong>, không phải vector, và vì thế nó còn được gọi là tích số.</li>
<li><strong>Độ dài (norm)</strong> — ‖u‖ = √(u·u) = √(u₁² + ⋯ + uₙ²). Đó là định lý Pythagoras mở rộng ra n toạ độ, và ‖u‖ = 0 chỉ xảy ra khi u = 0.</li>
<li><strong>Khoảng cách</strong> — d(u, v) = ‖u − v‖. Trừ theo từng thành phần trước, rồi mới lấy độ dài của kết quả.</li>
<li><strong>Số liệu cụ thể trong R³</strong> — với u = (1, 2, 2) và v = (2, −1, 2): u·v = 1(2) + 2(−1) + 2(2) = 2 − 2 + 4 = <strong>4</strong>; ‖u‖ = √(1 + 4 + 4) = <strong>3</strong>; ‖v‖ = √(4 + 1 + 4) = <strong>3</strong>.</li>
<li><strong>Khoảng cách của đúng cặp đó</strong> — u − v = (1−2, 2−(−1), 2−2) = (−1, 3, 0), nên d(u, v) = √(1 + 9 + 0) = √10 ≈ <strong>3,162</strong>.</li>
<li><strong>Góc</strong> — cos θ = (u·v)/(‖u‖·‖v‖) = 4/(3·3) = 4/9 ≈ 0,4444, cho θ ≈ <strong>63,6°</strong>. Công thức đúng ở mọi số chiều, kể cả nơi không vẽ nổi cái "góc".</li>
<li><strong>Tính trực giao</strong> — u và v <strong>trực giao</strong> đúng khi u·v = 0, tức cos θ = 0, tức θ = 90°. Ví dụ: (1, 2, 2)·(2, 1, −2) = 2 + 2 − 4 = <strong>0</strong>, vậy hai vector đó vuông góc.</li>
<li><strong>Các quy tắc đại số</strong> — u·v = v·u, u·(v + w) = u·v + u·w, (cu)·v = c(u·v), và u·u = ‖u‖² ≥ 0. Một ví dụ đẹp trong R⁴: ‖(1, 2, 2, 4)‖ = √(1 + 4 + 4 + 16) = √25 = <strong>5</strong>.</li>
</ul>
<p class="meo">💡 Pythagoras sống sót trong Rⁿ: nếu u·v = 0 thì ‖u + v‖² = ‖u‖² + ‖v‖². Kiểm ngay trên cặp trực giao ở trên: u + v = (3, 3, 0), ‖u + v‖² = 9 + 9 + 0 = 18, còn ‖u‖² + ‖v‖² = 9 + 9 = 18 ✓.</p>
<p class="pitfall">⚠️ Quên căn bậc hai rồi báo u·u là độ dài. Với u = (1, 2, 2) thì u·u = 9 nhưng ‖u‖ = 3. Lỗi hay gặp còn lại là coi u·v như một vector — nó là một số, nên viết "u·v + w" với w là vector thì vô nghĩa.</p>`],

      [13, 'Orthogonal and orthonormal sets',
        `<p class="y-chinh">🎯 A set is <strong>orthogonal</strong> when every pair of distinct vectors has dot product 0, and <strong>orthonormal</strong> when it is orthogonal and every vector has length 1.</p>
<ul>
<li><strong>Orthogonal set</strong> — vᵢ·vⱼ = 0 for all i ≠ j. The condition says nothing about vᵢ·vᵢ, so the vectors may have any lengths they like.</li>
<li><strong>Orthonormal set</strong> — orthogonal <em>plus</em> ‖vᵢ‖ = 1 for every i. Compactly: vᵢ·vⱼ = 0 when i ≠ j, and vᵢ·vᵢ = 1.</li>
<li><strong>Normalising</strong> — any orthogonal set of nonzero vectors becomes orthonormal by replacing each vᵢ with vᵢ/‖vᵢ‖. Scaling never disturbs the right angles.</li>
<li><strong>Worked orthogonal set in R³</strong> — v₁ = (1, 1, 0), v₂ = (1, −1, 0), v₃ = (0, 0, 1). Check all three pairs: v₁·v₂ = 1 − 1 + 0 = 0 ✓, v₁·v₃ = 0 + 0 + 0 = 0 ✓, v₂·v₃ = 0 + 0 + 0 = 0 ✓.</li>
<li><strong>Its orthonormal version</strong> — ‖v₁‖ = ‖v₂‖ = √2 and ‖v₃‖ = 1, so the orthonormal set is (1/√2)(1, 1, 0), (1/√2)(1, −1, 0), (0, 0, 1).</li>
<li><strong>Orthogonal implies independent</strong> — an orthogonal set of <strong>nonzero</strong> vectors is automatically linearly independent: dot c₁v₁ + ⋯ + c_kv_k = 0 with vᵢ and every cross term vanishes, leaving cᵢ‖vᵢ‖² = 0, hence cᵢ = 0. So no elimination is needed.</li>
<li><strong>Expansion theorem</strong> — for an orthogonal basis the coordinates come from a formula instead of a system: x = Σ ((x·vᵢ)/(vᵢ·vᵢ)) vᵢ. With an orthonormal basis the denominators are all 1 and the coefficients are simply x·vᵢ.</li>
<li><strong>Worked expansion</strong> — write x = (3, 1, 5) in the basis above. x·v₁ = 3 + 1 = 4 and v₁·v₁ = 2, so c₁ = 4/2 = <strong>2</strong>; x·v₂ = 3 − 1 = 2 and v₂·v₂ = 2, so c₂ = 2/2 = <strong>1</strong>; x·v₃ = 5 and v₃·v₃ = 1, so c₃ = <strong>5</strong>. Check: 2(1,1,0) + 1(1,−1,0) + 5(0,0,1) = (2+1, 2−1, 5) = (3, 1, 5) ✓.</li>
</ul>
<p class="meo">💡 The expansion formula is the reason engineers pay to build orthogonal bases (Gram-Schmidt, Fourier, wavelets): finding coordinates costs k dot products instead of solving a k×k system, and one wrong coordinate never contaminates the others.</p>
<p class="pitfall">⚠️ Two traps. First, dropping the denominator: using cᵢ = x·vᵢ is valid only for an <strong>orthonormal</strong> basis — here it would give 4, 2, 5 and reconstruct (6, 2, 5), which is wrong. Second, "orthogonal ⇒ independent" needs every vector to be <strong>nonzero</strong>: the zero vector is orthogonal to everything, yet any set containing it is dependent.</p>`,
        `<p class="y-chinh">🎯 Một tập là <strong>trực giao</strong> khi mọi cặp vector khác nhau có tích vô hướng bằng 0, và <strong>trực chuẩn</strong> khi nó trực giao và mọi vector đều có độ dài bằng 1.</p>
<ul>
<li><strong>Tập trực giao</strong> — vᵢ·vⱼ = 0 với mọi i ≠ j. Điều kiện này không nói gì về vᵢ·vᵢ, nên các vector có độ dài bao nhiêu cũng được.</li>
<li><strong>Tập trực chuẩn</strong> — trực giao <em>cộng thêm</em> ‖vᵢ‖ = 1 với mọi i. Viết gọn: vᵢ·vⱼ = 0 khi i ≠ j, và vᵢ·vᵢ = 1.</li>
<li><strong>Chuẩn hoá</strong> — mọi tập trực giao gồm các vector khác 0 đều thành trực chuẩn khi thay mỗi vᵢ bằng vᵢ/‖vᵢ‖. Việc co giãn không bao giờ làm hỏng các góc vuông.</li>
<li><strong>Tập trực giao giải đủ trong R³</strong> — v₁ = (1, 1, 0), v₂ = (1, −1, 0), v₃ = (0, 0, 1). Kiểm cả ba cặp: v₁·v₂ = 1 − 1 + 0 = 0 ✓, v₁·v₃ = 0 + 0 + 0 = 0 ✓, v₂·v₃ = 0 + 0 + 0 = 0 ✓.</li>
<li><strong>Bản trực chuẩn của nó</strong> — ‖v₁‖ = ‖v₂‖ = √2 và ‖v₃‖ = 1, nên tập trực chuẩn là (1/√2)(1, 1, 0), (1/√2)(1, −1, 0), (0, 0, 1).</li>
<li><strong>Trực giao kéo theo độc lập</strong> — một tập trực giao gồm các vector <strong>khác 0</strong> thì tự động độc lập tuyến tính: nhân vô hướng c₁v₁ + ⋯ + c_kv_k = 0 với vᵢ, mọi số hạng chéo biến mất, chỉ còn cᵢ‖vᵢ‖² = 0, suy ra cᵢ = 0. Vậy khỏi cần khử gì cả.</li>
<li><strong>Định lý khai triển</strong> — với cơ sở trực giao thì toạ độ có công thức chứ không phải giải hệ: x = Σ ((x·vᵢ)/(vᵢ·vᵢ)) vᵢ. Với cơ sở trực chuẩn thì các mẫu số đều bằng 1 và hệ số đơn giản là x·vᵢ.</li>
<li><strong>Khai triển giải đủ</strong> — viết x = (3, 1, 5) theo cơ sở phía trên. x·v₁ = 3 + 1 = 4 và v₁·v₁ = 2, nên c₁ = 4/2 = <strong>2</strong>; x·v₂ = 3 − 1 = 2 và v₂·v₂ = 2, nên c₂ = 2/2 = <strong>1</strong>; x·v₃ = 5 và v₃·v₃ = 1, nên c₃ = <strong>5</strong>. Kiểm: 2(1,1,0) + 1(1,−1,0) + 5(0,0,1) = (2+1, 2−1, 5) = (3, 1, 5) ✓.</li>
</ul>
<p class="meo">💡 Công thức khai triển chính là lý do dân kỹ thuật chịu tốn công dựng cơ sở trực giao (Gram-Schmidt, Fourier, wavelet): tìm toạ độ chỉ tốn k tích vô hướng thay vì giải hệ k×k, và một toạ độ sai không bao giờ lây sang các toạ độ khác.</p>
<p class="pitfall">⚠️ Hai cái bẫy. Thứ nhất, bỏ mất mẫu số: dùng cᵢ = x·vᵢ chỉ đúng cho cơ sở <strong>trực chuẩn</strong> — ở đây nó cho 4, 2, 5 và dựng lại ra (6, 2, 5), sai. Thứ hai, "trực giao ⇒ độc lập" đòi mọi vector phải <strong>khác 0</strong>: vector 0 trực giao với tất cả, thế mà tập nào chứa nó cũng phụ thuộc.</p>`],

      [14, 'Rank of a matrix',
        `<p class="y-chinh">🎯 The <strong>rank</strong> of A is the number of nonzero rows after reduction to row echelon form — equivalently, the number of pivots.</p>
<ul>
<li><strong>The definition</strong> — reduce A to REF and count. Every nonzero row carries exactly one pivot, so "nonzero rows" and "pivots" are the same count.</li>
<li><strong>Row space</strong> — the subspace spanned by the rows of A. Its dimension equals rank(A), and the nonzero rows of the REF form a basis for it.</li>
<li><strong>Column space</strong> — the subspace spanned by the columns of A. Its dimension <em>also</em> equals rank(A), and the original columns in pivot positions form a basis for it.</li>
<li><strong>The surprising theorem</strong> — row space and column space have the <strong>same dimension</strong>, even though for a non-square A they live in different spaces entirely: the row space sits in Rⁿ and the column space in R^m.</li>
<li><strong>Consequence: rank(A) = rank(Aᵀ)</strong> — transposing swaps the two spaces but not their common dimension, so you may compute rank from whichever side is easier.</li>
<li><strong>Size bound</strong> — rank(A) ≤ min(m, n) for an m×n matrix, because there cannot be more pivots than rows nor more than columns. A 3×5 matrix has rank at most 3.</li>
<li><strong>"Full rank"</strong> — rank = min(m, n). For a square n×n matrix, full rank n is equivalent to det(A) ≠ 0, to A being invertible, and to the columns being independent.</li>
<li><strong>What rank tells you about Ax = b</strong> — the system is consistent exactly when rank(A) = rank([A|b]); a larger rank for the augmented matrix means a row [0 … 0 | c] with c ≠ 0, i.e. no solution.</li>
</ul>
<p class="meo">💡 Rank is the single number this whole chapter keeps computing: it is the dimension of the span of the rows, the dimension of the span of the columns, the number of independent vectors in the list, and the pivot count. One elimination answers all four questions.</p>
<p class="pitfall">⚠️ Counting nonzero rows of the <strong>original</strong> matrix instead of the reduced one. A = [1 2 1; 2 4 3; 3 6 4] has three visibly nonzero rows but rank 2, because elimination kills one of them. Rank is always measured <em>after</em> reduction, never before.</p>`,
        `<p class="y-chinh">🎯 <strong>Hạng</strong> của A là số hàng khác 0 sau khi đưa về dạng bậc thang — nói cách khác, là số pivot.</p>
<ul>
<li><strong>Định nghĩa</strong> — khử A về REF rồi đếm. Mỗi hàng khác 0 mang đúng một pivot, nên "số hàng khác 0" và "số pivot" là cùng một con số.</li>
<li><strong>Row space</strong> — không gian con sinh bởi các hàng của A. Số chiều của nó bằng rank(A), và các hàng khác 0 của REF lập thành một cơ sở cho nó.</li>
<li><strong>Column space</strong> — không gian con sinh bởi các cột của A. Số chiều của nó <em>cũng</em> bằng rank(A), và các cột gốc ở vị trí pivot lập thành một cơ sở cho nó.</li>
<li><strong>Định lý bất ngờ</strong> — row space và column space có <strong>cùng số chiều</strong>, dù với A không vuông thì chúng nằm ở hai không gian hoàn toàn khác nhau: row space nằm trong Rⁿ còn column space nằm trong R^m.</li>
<li><strong>Hệ quả: rank(A) = rank(Aᵀ)</strong> — chuyển vị hoán đổi hai không gian đó nhưng không đổi số chiều chung, nên bạn được phép tính hạng từ phía nào dễ hơn.</li>
<li><strong>Chặn theo kích thước</strong> — rank(A) ≤ min(m, n) với ma trận m×n, vì không thể có nhiều pivot hơn số hàng, cũng không nhiều hơn số cột. Ma trận 3×5 có hạng nhiều nhất là 3.</li>
<li><strong>"Hạng đầy đủ"</strong> — rank = min(m, n). Với ma trận vuông n×n thì hạng đầy đủ bằng n tương đương với det(A) ≠ 0, với A khả nghịch, và với việc các cột độc lập.</li>
<li><strong>Hạng nói gì về Ax = b</strong> — hệ có nghiệm đúng khi rank(A) = rank([A|b]); hạng của ma trận bổ sung lớn hơn nghĩa là có hàng [0 … 0 | c] với c ≠ 0, tức vô nghiệm.</li>
</ul>
<p class="meo">💡 Hạng là con số duy nhất mà cả chương này cứ tính đi tính lại: nó là số chiều của span các hàng, số chiều của span các cột, số vector độc lập trong danh sách, và số pivot. Một lượt khử trả lời cả bốn câu hỏi.</p>
<p class="pitfall">⚠️ Đếm số hàng khác 0 của ma trận <strong>gốc</strong> thay vì của ma trận đã khử. A = [1 2 1; 2 4 3; 3 6 4] nhìn thấy ba hàng khác 0 nhưng hạng chỉ bằng 2, vì phép khử giết mất một hàng. Hạng luôn đo <em>sau</em> khi rút gọn, không bao giờ đo trước.</p>`],

      [15, 'Worked example — rank and bases for the row and column spaces',
        `<p class="y-chinh">🎯 For A = [1 2 1; 2 4 3; 3 6 4], find rank(A) and a basis for both the row space and the column space.</p>
<ul>
<li><strong>Step 1 — clear column 1</strong> — R2 → R2 − 2R1: (2−2, 4−4, 3−2) = <strong>(0, 0, 1)</strong>. R3 → R3 − 3R1: (3−3, 6−6, 4−3) = <strong>(0, 0, 1)</strong>. The matrix is now [1 2 1; 0 0 1; 0 0 1].</li>
<li><strong>Step 2 — clear below the second pivot</strong> — R3 → R3 − R2: (0, 0, 1) − (0, 0, 1) = <strong>(0, 0, 0)</strong>. REF = [1 2 1; 0 0 1; 0 0 0].</li>
<li><strong>Step 3 — count</strong> — two nonzero rows remain, so <strong>rank(A) = 2</strong>. Note column 2 has no pivot, which is exactly why one row collapsed.</li>
<li><strong>Step 4 — basis for the row space</strong> — take the nonzero rows of the REF: <strong>{(1, 2, 1), (0, 0, 1)}</strong>. Its dimension is 2, matching the rank.</li>
<li><strong>Step 5 — basis for the column space</strong> — the pivots sit in <strong>columns 1 and 3</strong>, so take those columns of the <em>original</em> A: <strong>{(1, 2, 3), (1, 3, 4)}</strong>. Also dimension 2.</li>
<li><strong>Why column 2 is excluded</strong> — column 2 of A is (2, 4, 6) = 2·(1, 2, 3), a multiple of column 1, so it adds no new direction. The pivot pattern detected that automatically.</li>
<li><strong>Cross-check with the row picture</strong> — row 3 of A is (3, 6, 4) = (1, 2, 1) + (2, 4, 3) = row 1 + row 2, so only two rows were independent. Same rank, seen from the other side.</li>
<li><strong>Read the geometry</strong> — the row space is a plane in R³ and the column space is a different plane in R³; the theorem of slide 14 only claims equal dimension, never that the two spaces coincide.</li>
</ul>
<p class="meo">💡 One elimination produces three answers at once: the rank (count the nonzero rows), the row-space basis (the nonzero rows themselves), and the column-space basis (pivot <em>positions</em>, then reach back into the original matrix).</p>
<p class="pitfall">⚠️ Taking the pivot columns out of the REF, which would give (1, 0, 0) and (1, 1, 0) — wrong, since row operations change the column space. The correct answer uses the pivot positions as an index into the original A: columns 1 and 3, i.e. (1, 2, 3) and (1, 3, 4).</p>`,
        `<p class="y-chinh">🎯 Với A = [1 2 1; 2 4 3; 3 6 4], hãy tìm rank(A) và một cơ sở cho cả row space lẫn column space.</p>
<ul>
<li><strong>Bước 1 — dọn cột 1</strong> — R2 → R2 − 2R1: (2−2, 4−4, 3−2) = <strong>(0, 0, 1)</strong>. R3 → R3 − 3R1: (3−3, 6−6, 4−3) = <strong>(0, 0, 1)</strong>. Ma trận giờ là [1 2 1; 0 0 1; 0 0 1].</li>
<li><strong>Bước 2 — dọn phía dưới pivot thứ hai</strong> — R3 → R3 − R2: (0, 0, 1) − (0, 0, 1) = <strong>(0, 0, 0)</strong>. REF = [1 2 1; 0 0 1; 0 0 0].</li>
<li><strong>Bước 3 — đếm</strong> — còn lại hai hàng khác 0, vậy <strong>rank(A) = 2</strong>. Chú ý cột 2 không có pivot, và đó đúng là lý do một hàng bị sập.</li>
<li><strong>Bước 4 — cơ sở của row space</strong> — lấy các hàng khác 0 của REF: <strong>{(1, 2, 1), (0, 0, 1)}</strong>. Số chiều bằng 2, khớp với hạng.</li>
<li><strong>Bước 5 — cơ sở của column space</strong> — các pivot nằm ở <strong>cột 1 và cột 3</strong>, nên lấy đúng hai cột đó của ma trận A <em>gốc</em>: <strong>{(1, 2, 3), (1, 3, 4)}</strong>. Cũng số chiều 2.</li>
<li><strong>Vì sao cột 2 bị loại</strong> — cột 2 của A là (2, 4, 6) = 2·(1, 2, 3), một bội của cột 1, nên nó không thêm hướng mới nào. Mẫu hình pivot đã tự phát hiện điều đó.</li>
<li><strong>Đối chiếu bằng góc nhìn hàng</strong> — hàng 3 của A là (3, 6, 4) = (1, 2, 1) + (2, 4, 3) = hàng 1 + hàng 2, nên chỉ có hai hàng độc lập. Vẫn hạng đó, nhìn từ phía bên kia.</li>
<li><strong>Đọc phần hình học</strong> — row space là một mặt phẳng trong R³ và column space là một mặt phẳng KHÁC trong R³; định lý ở slide 14 chỉ khẳng định chúng bằng số chiều, chứ không hề nói hai không gian đó trùng nhau.</li>
</ul>
<p class="meo">💡 Một lượt khử cho ra ba đáp án cùng lúc: hạng (đếm hàng khác 0), cơ sở row space (chính các hàng khác 0 đó), và cơ sở column space (lấy <em>vị trí</em> pivot rồi thò tay về ma trận gốc).</p>
<p class="pitfall">⚠️ Lấy các cột pivot ra từ REF, sẽ cho (1, 0, 0) và (1, 1, 0) — sai, vì phép biến đổi hàng làm đổi column space. Đáp án đúng dùng vị trí pivot như một chỉ số trỏ vào A gốc: cột 1 và cột 3, tức (1, 2, 3) và (1, 3, 4).</p>`],

      [16, 'Nullity and the rank-nullity theorem',
        `<p class="y-chinh">🎯 <strong>Nullity</strong> is the dimension of the solution space of Ax = 0, and rank(A) + nullity(A) = <strong>n</strong>, the number of columns.</p>
<ul>
<li><strong>Null space</strong> — the set of all x with Ax = 0. It is a subspace of Rⁿ (homogeneous system, slide 4), so it always contains 0 and is never empty.</li>
<li><strong>Nullity</strong> — nullity(A) = dim(null space) = the number of <strong>free variables</strong> after elimination, one per pivot-free column.</li>
<li><strong>The theorem</strong> — rank(A) + nullity(A) = n, where n is the number of <strong>columns</strong> of A (the number of unknowns). Pivot columns and free columns partition the columns, which is the entire proof.</li>
<li><strong>Worked example</strong> — A = [1 2 1; 2 4 3; 3 6 4] from slide 15 reduces to [1 2 1; 0 0 1; 0 0 0]. Here n = 3 and rank = 2, so <strong>nullity = 3 − 2 = 1</strong>.</li>
<li><strong>Solving for the null space</strong> — row 2 gives x₃ = 0; row 1 gives x₁ + 2x₂ + x₃ = 0, hence x₁ = −2x₂. Column 2 is free: put x₂ = t and the solution is (−2t, t, 0) = t(−2, 1, 0).</li>
<li><strong>The null-space basis</strong> — {(−2, 1, 0)}, one vector, confirming nullity 1. Verify against all three original rows: 1(−2) + 2(1) + 1(0) = 0 ✓, 2(−2) + 4(1) + 3(0) = 0 ✓, 3(−2) + 6(1) + 4(0) = 0 ✓.</li>
<li><strong>The two extremes</strong> — nullity 0 means every column is a pivot column, so Ax = 0 has only the trivial solution and the columns are independent. Nullity greater than 0 means nontrivial solutions and dependent columns.</li>
<li><strong>Non-square example</strong> — a 2×4 matrix of rank 2 has nullity 4 − 2 = 2. Note n = 4 comes from the columns; the fact that there are only 2 rows never enters the formula.</li>
</ul>
<p class="meo">💡 Read the theorem as a budget: the n columns are shared out between pivot columns (rank, the directions the matrix keeps) and free columns (nullity, the directions the matrix crushes to zero). Nothing is lost and nothing is double-counted.</p>
<p class="pitfall">⚠️ The headline mistake of this chapter: writing rank + nullity = <strong>number of rows</strong>. It is the <strong>number of columns</strong>. For a 2×4 matrix of rank 2 the correct nullity is 4 − 2 = 2, not 2 − 2 = 0 — and the wrong version would claim that a wide system has no free variables, which is exactly backwards.</p>`,
        `<p class="y-chinh">🎯 <strong>Nullity</strong> là số chiều của không gian nghiệm của Ax = 0, và rank(A) + nullity(A) = <strong>n</strong>, tức SỐ CỘT.</p>
<ul>
<li><strong>Null space</strong> — tập mọi x thoả Ax = 0. Đó là một không gian con của Rⁿ (hệ thuần nhất, slide 4), nên nó luôn chứa 0 và không bao giờ rỗng.</li>
<li><strong>Nullity</strong> — nullity(A) = dim(null space) = số <strong>biến tự do</strong> sau khi khử, mỗi cột không có pivot cho một biến tự do.</li>
<li><strong>Định lý</strong> — rank(A) + nullity(A) = n, với n là số <strong>cột</strong> của A (số ẩn). Các cột pivot và các cột tự do chia đôi tập cột, và đó là toàn bộ phần chứng minh.</li>
<li><strong>Ví dụ giải đủ</strong> — A = [1 2 1; 2 4 3; 3 6 4] ở slide 15 khử về [1 2 1; 0 0 1; 0 0 0]. Ở đây n = 3 và rank = 2, vậy <strong>nullity = 3 − 2 = 1</strong>.</li>
<li><strong>Giải ra null space</strong> — hàng 2 cho x₃ = 0; hàng 1 cho x₁ + 2x₂ + x₃ = 0, suy ra x₁ = −2x₂. Cột 2 là cột tự do: đặt x₂ = t thì nghiệm là (−2t, t, 0) = t(−2, 1, 0).</li>
<li><strong>Cơ sở của null space</strong> — {(−2, 1, 0)}, đúng một vector, khẳng định nullity bằng 1. Kiểm lại trên cả ba hàng gốc: 1(−2) + 2(1) + 1(0) = 0 ✓, 2(−2) + 4(1) + 3(0) = 0 ✓, 3(−2) + 6(1) + 4(0) = 0 ✓.</li>
<li><strong>Hai cực</strong> — nullity bằng 0 nghĩa là mọi cột đều là cột pivot, nên Ax = 0 chỉ có nghiệm tầm thường và các cột độc lập. Nullity lớn hơn 0 nghĩa là có nghiệm không tầm thường và các cột phụ thuộc.</li>
<li><strong>Ví dụ không vuông</strong> — ma trận 2×4 có hạng 2 thì nullity bằng 4 − 2 = 2. Chú ý n = 4 lấy từ số cột; chuyện nó chỉ có 2 hàng không hề tham gia vào công thức.</li>
</ul>
<p class="meo">💡 Hãy đọc định lý như một bản ngân sách: n cột được chia cho các cột pivot (rank, những hướng ma trận giữ lại) và các cột tự do (nullity, những hướng ma trận nghiền về 0). Không mất phần nào và không đếm trùng phần nào.</p>
<p class="pitfall">⚠️ Lỗi đầu bảng của cả chương này: viết rank + nullity = <strong>số hàng</strong>. Nó là <strong>SỐ CỘT</strong>. Với ma trận 2×4 hạng 2 thì nullity đúng là 4 − 2 = 2, chứ không phải 2 − 2 = 0 — và phiên bản sai kia còn khẳng định một hệ nhiều ẩn thì không có biến tự do, tức ngược hoàn toàn với sự thật.</p>`],

      [17, 'Summary — six things to carry out of Chapter 9',
        `<p class="y-chinh">🎯 Six statements. If you can say all six without notes, Chapter 9 is done.</p>
<ol>
<li><strong>A subspace needs three things</strong> — contains 0, closed under addition, closed under scalar multiplication. Every homogeneous equation such as x + 2y − z = 0 gives one; anything missing the origin, such as x + y = 1, never does.</li>
<li><strong>Span is a subspace, and it is a Chapter 5 question</strong> — span{v₁, …, v_k} is the set of all c₁v₁ + ⋯ + c_kv_k, and "is b in the span?" means "is [v₁ | ⋯ | v_k]c = b consistent?". span{(1,0,1), (0,1,1)} is the plane z = x + y.</li>
<li><strong>Independence = only the trivial solution</strong> — put the vectors in columns and reduce: k pivots for k columns means independent, a pivot-free column means dependent. (1,1,0), (0,1,1), (1,2,1) give 2 pivots for 3 columns, and indeed v₃ = v₁ + v₂.</li>
<li><strong>Basis = spanning + independent; dimension is its length</strong> — every basis of the same space has the same size, so dim is well defined: dim(Rⁿ) = n, a plane through the origin has dim 2, {0} has dim 0. Extract a basis by eliminating and keeping the nonzero rows, or the original columns in pivot positions.</li>
<li><strong>Orthogonality makes coordinates free</strong> — vᵢ·vⱼ = 0 for i ≠ j implies independence, and for an orthogonal basis the coordinates are (x·vᵢ)/(vᵢ·vᵢ): x = (3,1,5) in {(1,1,0), (1,−1,0), (0,0,1)} gives 2, 1, 5.</li>
<li><strong>Rank counts pivots; rank + nullity = number of columns</strong> — for A = [1 2 1; 2 4 3; 3 6 4], REF = [1 2 1; 0 0 1; 0 0 0], so rank = 2, nullity = 3 − 2 = 1, with null space spanned by (−2, 1, 0). rank(A) = n means only the trivial solution; rank(A) below n means infinitely many.</li>
</ol>
<p class="meo">💡 One workflow for almost every exam question here: build the matrix → eliminate to REF → count the pivots. That single number is the rank, the dimension of the span, the number of independent vectors, and (subtracted from n) the nullity.</p>
<p class="pitfall">⚠️ The three marks lost most often: calling a set that misses the zero vector a subspace; taking pivot columns from the reduced matrix instead of the original; and writing rank + nullity = number of rows instead of <strong>number of columns</strong>.</p>`,
        `<p class="y-chinh">🎯 Sáu câu. Nói được cả sáu câu mà không cần nhìn tài liệu là xong Chương 9.</p>
<ol>
<li><strong>Không gian con cần ba thứ</strong> — chứa 0, đóng với phép cộng, đóng với nhân vô hướng. Mọi phương trình thuần nhất như x + 2y − z = 0 đều cho một không gian con; còn thứ gì không đi qua gốc, như x + y = 1, thì không bao giờ.</li>
<li><strong>Span là không gian con, và nó là câu hỏi của Chương 5</strong> — span{v₁, …, v_k} là tập mọi c₁v₁ + ⋯ + c_kv_k, và "b có thuộc span không?" nghĩa là "hệ [v₁ | ⋯ | v_k]c = b có nghiệm không?". span{(1,0,1), (0,1,1)} chính là mặt phẳng z = x + y.</li>
<li><strong>Độc lập = chỉ có nghiệm tầm thường</strong> — xếp vector vào cột rồi khử: k pivot cho k cột là độc lập, có cột không pivot là phụ thuộc. Bộ (1,1,0), (0,1,1), (1,2,1) cho 2 pivot trên 3 cột, và quả thật v₃ = v₁ + v₂.</li>
<li><strong>Cơ sở = sinh + độc lập; số chiều là độ dài của nó</strong> — mọi cơ sở của cùng một không gian đều có cùng số vector, nên dim được định nghĩa tốt: dim(Rⁿ) = n, mặt phẳng qua gốc có dim 2, {0} có dim 0. Rút cơ sở bằng cách khử rồi giữ các hàng khác 0, hoặc giữ các cột GỐC ở vị trí pivot.</li>
<li><strong>Trực giao khiến toạ độ thành cho không</strong> — vᵢ·vⱼ = 0 với i ≠ j kéo theo độc lập, và với cơ sở trực giao thì toạ độ là (x·vᵢ)/(vᵢ·vᵢ): x = (3,1,5) trong {(1,1,0), (1,−1,0), (0,0,1)} cho 2, 1, 5.</li>
<li><strong>Hạng đếm pivot; rank + nullity = SỐ CỘT</strong> — với A = [1 2 1; 2 4 3; 3 6 4] thì REF = [1 2 1; 0 0 1; 0 0 0], nên rank = 2, nullity = 3 − 2 = 1, null space sinh bởi (−2, 1, 0). rank(A) = n nghĩa là chỉ có nghiệm tầm thường; rank(A) nhỏ hơn n nghĩa là vô số nghiệm.</li>
</ol>
<p class="meo">💡 Một quy trình cho gần như mọi câu thi ở đây: lập ma trận → khử về REF → đếm pivot. Đúng một con số đó là hạng, là số chiều của span, là số vector độc lập, và (lấy n trừ đi) là nullity.</p>
<p class="pitfall">⚠️ Ba điểm mất nhiều nhất khi thi: gọi một tập không chứa vector 0 là không gian con; lấy cột pivot từ ma trận đã khử thay vì từ ma trận gốc; và viết rank + nullity = số hàng thay vì <strong>SỐ CỘT</strong>.</p>`],
    ]),
  ].join('\n'),
};
