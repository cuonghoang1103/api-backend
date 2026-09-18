/**
 * MAE101 · Chương 8 — Vectors & Linear Transformations (Vector & Biến đổi tuyến tính), học theo từng slide.
 * Deck 'mae8' (MAE8), 17 slide, render sẵn lên CDN images/academy/MAE101/v1/mae8/NNN.webp.
 * Nội dung bám đúng scripts/slides-src/mae101-ch8.mjs + Nicholson "Linear Algebra with Applications" ch.4.
 *
 * Mọi phép tính trong phần giảng đều đã KIỂM TAY (và kiểm lại bằng node):
 *   u=(1,2,−2), v=(3,0,1): u·v = 3+0−2 = 1; ‖u‖ = 3; ‖v‖ = √10;
 *     cosθ = 1/(3√10) ≈ 0,1054 ⇒ θ ≈ 83,95° (không vuông góc).
 *   proj: u=(3,4,0) lên v=(1,0,0): u·v = 3, ‖v‖² = 1 ⇒ proj = 3v = (3,0,0); phần vuông góc (0,4,0) dài 4.
 *   Điểm–đường: P0=(0,0,0), d=(1,0,0), Q=(0,3,4): P0Q×d = (0,4,−3), ‖·‖ = 5, ‖d‖ = 1 ⇒ D = 5 (đúng bằng √(3²+4²)).
 *   Tích có hướng: (2,1,−1)×(−3,4,1) = (5,1,11); ‖·‖ = √147 = 7√3 ≈ 12,124;
 *     kiểm vuông góc: (2,1,−1)·(5,1,11) = 0 và (−3,4,1)·(5,1,11) = 0;
 *     u·v = −3, ‖u‖‖v‖ = √156 ≈ 12,49 ⇒ θ ≈ 103,9°, sinθ ≈ 0,9707 ⇒ ‖u‖‖v‖sinθ ≈ 12,124 ✓;
 *     Lagrange: 147 + 9 = 156 = 6·26 ✓. Diện tích tam giác = 7√3/2 ≈ 6,062.
 *   (1,0,0)×(0,1,0) = (0,0,1) ⇒ S hình bình hành = 1, S tam giác = 0,5.
 *   Không kết hợp: u×(u×v) = (1,0,0)×(0,0,1) = (0,−1,0) ≠ (u×u)×v = 0.
 *   Mặt phẳng qua A(1,0,0), B(0,1,0), C(0,0,1): AB×AC = (−1,1,0)×(−1,0,1) = (1,1,1) ⇒ x+y+z = 1.
 *   Điểm–mặt: x+2y+2z = 9, Q=(1,1,1) ⇒ D = |1+2+2−9|/√9 = 4/3 ≈ 1,333.
 *   Tích hỗn tạp: (1,2,3)·[(0,1,4)×(5,6,0)] = 1(−24) − 2(−20) + 3(−5) = 1 ⇒ thể tích = 1.
 *     Đồng phẳng: (1,0,0)·[(0,1,0)×(1,1,0)] = 0.
 *   Quay quanh z góc 90°: (1,0,0) ↦ (0,1,0); đối xứng qua mp xy: (2,3,5) ↦ (2,3,−5); chiếu xuống xy: (2,3,5) ↦ (2,3,0).
 *   det: quay = 1, đối xứng = −1, chiếu = 0, co giãn hệ số k = k³.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'mae8';

export default {
  title: '8.0 — Slide bài giảng: Vector & Biến đổi tuyến tính (17 slide)|||8.0 — Slide bài giảng: Vector & Biến đổi tuyến tính (17 slide)',
  slug: 'mae101-8-0-slides-vector',
  type: 'DOCUMENT',
  description: 'Toàn bộ 17 slide Chương 8 MAE101 — vector trong R² và R³, phép toán và độ dài, tích vô hướng cùng góc giữa hai vector, phép chiếu, đường thẳng trong không gian và khoảng cách điểm tới đường, tích có hướng và diện tích, phương trình mặt phẳng và khoảng cách điểm tới mặt, tích hỗn tạp và thể tích hình hộp, biến đổi tuyến tính trong R³ và ứng dụng đồ hoạ máy tính — mỗi slide kèm giảng song ngữ, toạ độ cụ thể và bẫy hay gặp khi thi.',
  content: [
    walkHead(D, 1, 17),
    walk(D, [
      [1, 'Chapter 8 — Vectors and Linear Transformations (cover)',
        `<p class="y-chinh">🎯 Chapter 8 of MAE101: <strong>vectors in R² and R³</strong> — the algebra of arrows, and the matrices that move them.</p>
<ul>
<li><strong>The whole chapter in one move</strong> — a geometric object (a direction, a line, a plane, a solid) is turned into a triple of numbers such as (1, 2, −2), and every geometric question about it becomes arithmetic on those numbers.</li>
<li><strong>Two products, two answers</strong> — the dot product turns two vectors into a <em>number</em> and answers questions about angle; the cross product turns two vectors into a <em>new vector</em> and answers questions about perpendicularity, area and orientation. Knowing which one a question needs is half of this chapter.</li>
<li><strong>What this deck covers</strong> — 17 slides: coordinates and unit vectors, vector arithmetic and length, dot product, angle and orthogonality, projection, lines in space, point-to-line distance, cross product and its properties, a worked area example, planes, point-to-plane distance, the scalar triple product and volume, linear transformations of R³, and computer graphics.</li>
</ul>
<p class="meo">💡 Keep one picture in your head the whole way through: a vector is an arrow from the origin O to the point (x, y, z). Every formula in this chapter is that picture written in numbers.</p>`,
        `<p class="y-chinh">🎯 Chương 8 của MAE101: <strong>vector trong R² và R³</strong> — đại số của những mũi tên, và các ma trận làm chúng dịch chuyển.</p>
<ul>
<li><strong>Cả chương gói trong một nước đi</strong> — một đối tượng hình học (một hướng, một đường thẳng, một mặt phẳng, một khối) được biến thành bộ ba số như (1, 2, −2), và mọi câu hỏi hình học về nó trở thành phép tính trên những con số đó.</li>
<li><strong>Hai phép nhân, hai loại kết quả</strong> — tích vô hướng biến hai vector thành một <em>số</em> và trả lời các câu hỏi về góc; tích có hướng biến hai vector thành một <em>vector mới</em> và trả lời các câu hỏi về vuông góc, diện tích và định hướng. Biết câu hỏi cần phép nào đã là nửa chương này.</li>
<li><strong>Bộ slide này gồm</strong> — 17 slide: toạ độ và vector đơn vị, phép toán vector và độ dài, tích vô hướng, góc và vuông góc, phép chiếu, đường thẳng trong không gian, khoảng cách điểm tới đường, tích có hướng cùng các tính chất, một ví dụ diện tích giải đủ bước, mặt phẳng, khoảng cách điểm tới mặt, tích hỗn tạp và thể tích, biến đổi tuyến tính của R³, và đồ hoạ máy tính.</li>
</ul>
<p class="meo">💡 Hãy giữ một bức tranh trong đầu suốt cả chương: vector là mũi tên đi từ gốc O tới điểm (x, y, z). Mọi công thức trong chương này chỉ là bức tranh ấy viết bằng số.</p>`],

      [2, 'Contents — six blocks of Chapter 8',
        `<p class="y-chinh">🎯 Chapter 8 runs through six blocks, each one feeding the next.</p>
<ol>
<li><strong>Vectors in R² and R³</strong> — slides 3–4: coordinates, the unit vectors i, j, k, addition and scalar multiplication, length, and normalising a vector.</li>
<li><strong>Dot product, angle and orthogonality</strong> — slides 5–6: the two equal formulas for u · v, and the test u · v = 0 for perpendicularity.</li>
<li><strong>Projection, lines and distance</strong> — slides 7–9: projecting one vector onto another, the three ways to write a line in space, and the distance from a point to a line.</li>
<li><strong>Cross product</strong> — slides 10–12: the determinant recipe, anticommutativity and parallelism, and a fully worked area example.</li>
<li><strong>Planes and the triple product</strong> — slides 13–15: the equation ax + by + cz = d from a normal vector, the distance from a point to a plane, and the scalar triple product as a volume.</li>
<li><strong>Linear transformations</strong> — slides 16–17: rotation, reflection and projection matrices in R³, det(A) as the volume factor, and homogeneous coordinates in 3D graphics. Slide 17 also closes the chapter.</li>
</ol>`,
        `<p class="y-chinh">🎯 Chương 8 chạy qua sáu khối, khối trước nuôi khối sau.</p>
<ol>
<li><strong>Vector trong R² và R³</strong> — slide 3–4: toạ độ, ba vector đơn vị i, j, k, phép cộng và nhân vô hướng, độ dài, và cách chuẩn hoá một vector.</li>
<li><strong>Tích vô hướng, góc và vuông góc</strong> — slide 5–6: hai công thức bằng nhau cho u · v, và phép thử u · v = 0 để biết hai vector có vuông góc không.</li>
<li><strong>Phép chiếu, đường thẳng và khoảng cách</strong> — slide 7–9: chiếu một vector lên vector khác, ba cách viết đường thẳng trong không gian, và khoảng cách từ một điểm tới một đường thẳng.</li>
<li><strong>Tích có hướng</strong> — slide 10–12: công thức định thức, tính chống giao hoán và điều kiện song song, cùng một ví dụ diện tích giải đủ bước.</li>
<li><strong>Mặt phẳng và tích hỗn tạp</strong> — slide 13–15: phương trình ax + by + cz = d dựng từ vector pháp tuyến, khoảng cách từ điểm tới mặt phẳng, và tích hỗn tạp chính là thể tích.</li>
<li><strong>Biến đổi tuyến tính</strong> — slide 16–17: ma trận quay, đối xứng và chiếu trong R³, det(A) là hệ số thể tích, và toạ độ thuần nhất trong đồ hoạ 3D. Slide 17 cũng là phần khép lại chương.</li>
</ol>`],

      [3, 'Vectors in R² and R³ — coordinates and unit vectors',
        `<p class="y-chinh">🎯 A vector is a quantity with <strong>direction and magnitude</strong>, written in coordinates as v = (x, y, z) = xi + yj + zk.</p>
<ul>
<li><strong>Two notations, one object</strong> — the coordinate form (x, y, z) and the combination xi + yj + zk say exactly the same thing. (1, 2, −2) is i + 2j − 2k; use whichever the question uses.</li>
<li><strong>The three unit vectors</strong> — i = (1, 0, 0), j = (0, 1, 0), k = (0, 0, 1) point along the three coordinate axes and each has length 1. They form the standard basis of R³.</li>
<li><strong>The geometric picture</strong> — a vector is the arrow from the origin O to the point (x, y, z). This is why a point and a vector look identical on paper: the vector is called the <em>position vector</em> of that point.</li>
<li><strong>Vector between two points</strong> — the arrow from A to B is the difference AB = B − A, subtracted coordinate by coordinate. With A = (1, 2, 3) and B = (4, 6, 3), AB = (4−1, 6−2, 3−3) = (3, 4, 0).</li>
<li><strong>Direction matters</strong> — BA = A − B = (−3, −4, 0) is the same arrow reversed. AB and BA have the same length but opposite direction, so they are different vectors.</li>
<li><strong>Free vectors</strong> — two arrows with the same length and the same direction are the <em>same</em> vector even if they start at different points. Only the difference of the endpoints counts, never where the arrow was drawn.</li>
<li><strong>R² is the flat case</strong> — everything in this chapter is written for R³; drop the third coordinate and every formula still works in the plane, with z = 0.</li>
</ul>
<p class="meo">💡 Remember AB = B − A as "head minus tail". Getting it backwards is the single most common sign error in the whole chapter, and it flips every later answer.</p>
<p class="pitfall">⚠️ Confusing the point (3, 4, 0) with the vector (3, 4, 0). Numerically they match, but a point has a location and a vector only has a direction and a length — which is exactly why AB can be computed from two points but A + B means nothing geometrically.</p>`,
        `<p class="y-chinh">🎯 Vector là đại lượng có <strong>hướng và độ lớn</strong>, viết bằng toạ độ là v = (x, y, z) = xi + yj + zk.</p>
<ul>
<li><strong>Hai cách viết, một đối tượng</strong> — dạng toạ độ (x, y, z) và tổ hợp xi + yj + zk nói y hệt nhau. (1, 2, −2) chính là i + 2j − 2k; đề dùng cách nào thì làm theo cách đó.</li>
<li><strong>Ba vector đơn vị</strong> — i = (1, 0, 0), j = (0, 1, 0), k = (0, 0, 1) chỉ theo ba trục toạ độ và mỗi cái dài đúng 1. Chúng lập thành cơ sở chuẩn của R³.</li>
<li><strong>Bức tranh hình học</strong> — vector là mũi tên đi từ gốc O tới điểm (x, y, z). Đó là lý do một điểm và một vector nhìn trên giấy giống hệt nhau: vector ấy được gọi là <em>vector vị trí</em> của điểm đó.</li>
<li><strong>Vector nối hai điểm</strong> — mũi tên từ A tới B là hiệu AB = B − A, trừ theo từng toạ độ. Với A = (1, 2, 3) và B = (4, 6, 3) thì AB = (4−1, 6−2, 3−3) = (3, 4, 0).</li>
<li><strong>Hướng có ý nghĩa</strong> — BA = A − B = (−3, −4, 0) là chính mũi tên đó quay ngược. AB và BA cùng độ dài nhưng ngược hướng, nên là hai vector khác nhau.</li>
<li><strong>Vector tự do</strong> — hai mũi tên cùng độ dài và cùng hướng là <em>cùng một</em> vector dù chúng xuất phát từ hai điểm khác nhau. Chỉ hiệu của hai đầu mút mới tính, còn vẽ ở đâu thì không.</li>
<li><strong>R² là trường hợp phẳng</strong> — mọi thứ trong chương này viết cho R³; bỏ toạ độ thứ ba đi thì mọi công thức vẫn đúng trong mặt phẳng, với z = 0.</li>
</ul>
<p class="meo">💡 Nhớ AB = B − A theo kiểu "đầu trừ đuôi". Làm ngược lại là lỗi dấu phổ biến nhất của cả chương, và nó lật ngược mọi đáp án phía sau.</p>
<p class="pitfall">⚠️ Lẫn điểm (3, 4, 0) với vector (3, 4, 0). Về số thì trùng nhau, nhưng điểm có vị trí còn vector chỉ có hướng và độ dài — chính vì thế mới tính được AB từ hai điểm, còn A + B thì chẳng có nghĩa hình học nào.</p>`],

      [4, 'Vector operations and length',
        `<p class="y-chinh">🎯 Add, subtract and scale vectors <strong>coordinate by coordinate</strong>; the length comes from Pythagoras in three dimensions.</p>
<ul>
<li><strong>Addition and subtraction</strong> — u ± v = (u₁±v₁, u₂±v₂, u₃±v₃). With u = (1, 2, −2) and v = (3, 0, 1): u + v = (4, 2, −1) and u − v = (−2, 2, −3).</li>
<li><strong>Scalar multiplication</strong> — cv = (cv₁, cv₂, cv₃) stretches the arrow by |c| and keeps its direction when c is positive, reverses it when c is negative. 3u = (3, 6, −6) and −u = (−1, −2, 2).</li>
<li><strong>Geometry of the sum</strong> — u + v is the diagonal of the parallelogram built on u and v (the "tip-to-tail" rule); u − v is the arrow running from the tip of v to the tip of u.</li>
<li><strong>Length (norm)</strong> — ‖v‖ = √(x² + y² + z²), the space version of Pythagoras. For u = (1, 2, −2): ‖u‖ = √(1 + 4 + 4) = √9 = <strong>3</strong>. For v = (3, 0, 1): ‖v‖ = √(9 + 0 + 1) = √10 ≈ 3,162.</li>
<li><strong>Scaling scales the length</strong> — ‖cv‖ = |c|·‖v‖, with the absolute value because a length is never negative. So ‖3u‖ = 3·3 = 9 and ‖−u‖ = 3, not −3.</li>
<li><strong>Normalising</strong> — the unit vector in the direction of v is v̂ = v/‖v‖. For u = (1, 2, −2): û = (1/3, 2/3, −2/3), and a check confirms ‖û‖ = √(1/9 + 4/9 + 4/9) = 1.</li>
<li><strong>Distance between two points</strong> — it is simply ‖AB‖. With A = (1, 2, 3) and B = (4, 6, 3): AB = (3, 4, 0) and ‖AB‖ = √(9 + 16) = 5.</li>
<li><strong>The zero vector</strong> — 0 = (0, 0, 0) has length 0 and <em>no direction</em>, which is why it can never be normalised.</li>
</ul>
<p class="meo">💡 Normalise whenever a question asks about direction only ("find a unit vector", "which way does it point"). Splitting a vector into ‖v‖ · v̂ separates "how long" from "which way" and most problems only need one of the two.</p>
<p class="pitfall">⚠️ Writing ‖u + v‖ = ‖u‖ + ‖v‖. That is false unless u and v point the same way: here ‖u + v‖ = ‖(4, 2, −1)‖ = √21 ≈ 4,58, while ‖u‖ + ‖v‖ = 3 + √10 ≈ 6,16. The true statement is the triangle inequality ‖u + v‖ ≤ ‖u‖ + ‖v‖.</p>`,
        `<p class="y-chinh">🎯 Cộng, trừ và nhân vô hướng <strong>theo từng toạ độ</strong>; độ dài lấy từ định lý Pythagore mở rộng ra ba chiều.</p>
<ul>
<li><strong>Cộng và trừ</strong> — u ± v = (u₁±v₁, u₂±v₂, u₃±v₃). Với u = (1, 2, −2) và v = (3, 0, 1): u + v = (4, 2, −1) và u − v = (−2, 2, −3).</li>
<li><strong>Nhân với một số</strong> — cv = (cv₁, cv₂, cv₃) kéo dài mũi tên gấp |c| lần, giữ nguyên hướng khi c dương và đảo hướng khi c âm. 3u = (3, 6, −6) còn −u = (−1, −2, 2).</li>
<li><strong>Hình học của phép cộng</strong> — u + v là đường chéo của hình bình hành dựng trên u và v (quy tắc "nối đuôi vào đầu"); u − v là mũi tên chạy từ đầu v tới đầu u.</li>
<li><strong>Độ dài (norm)</strong> — ‖v‖ = √(x² + y² + z²), chính là Pythagore trong không gian. Với u = (1, 2, −2): ‖u‖ = √(1 + 4 + 4) = √9 = <strong>3</strong>. Với v = (3, 0, 1): ‖v‖ = √(9 + 0 + 1) = √10 ≈ 3,162.</li>
<li><strong>Nhân số thì độ dài nhân theo</strong> — ‖cv‖ = |c|·‖v‖, phải lấy trị tuyệt đối vì độ dài không bao giờ âm. Nên ‖3u‖ = 3·3 = 9 và ‖−u‖ = 3 chứ không phải −3.</li>
<li><strong>Chuẩn hoá</strong> — vector đơn vị cùng hướng với v là v̂ = v/‖v‖. Với u = (1, 2, −2): û = (1/3, 2/3, −2/3), kiểm lại thấy ‖û‖ = √(1/9 + 4/9 + 4/9) = 1.</li>
<li><strong>Khoảng cách giữa hai điểm</strong> — chỉ là ‖AB‖. Với A = (1, 2, 3) và B = (4, 6, 3): AB = (3, 4, 0) và ‖AB‖ = √(9 + 16) = 5.</li>
<li><strong>Vector không</strong> — 0 = (0, 0, 0) có độ dài 0 và <em>không có hướng</em>, chính vì thế mà không bao giờ chuẩn hoá được nó.</li>
</ul>
<p class="meo">💡 Hãy chuẩn hoá mỗi khi câu hỏi chỉ hỏi về hướng ("tìm một vector đơn vị", "nó chỉ về phía nào"). Tách vector thành ‖v‖ · v̂ là tách "dài bao nhiêu" khỏi "hướng nào", mà đa số bài chỉ cần một trong hai.</p>
<p class="pitfall">⚠️ Viết ‖u + v‖ = ‖u‖ + ‖v‖. Điều đó sai trừ khi u và v cùng hướng: ở đây ‖u + v‖ = ‖(4, 2, −1)‖ = √21 ≈ 4,58 trong khi ‖u‖ + ‖v‖ = 3 + √10 ≈ 6,16. Mệnh đề đúng là bất đẳng thức tam giác ‖u + v‖ ≤ ‖u‖ + ‖v‖.</p>`],

      [5, 'Dot product — two vectors give a number',
        `<p class="y-chinh">🎯 The dot product multiplies two vectors and gives back a <strong>real number</strong>: u · v = u₁v₁ + u₂v₂ + u₃v₃.</p>
<ul>
<li><strong>The computation</strong> — multiply matching coordinates, then add. With u = (1, 2, −2) and v = (3, 0, 1): u · v = 1(3) + 2(0) + (−2)(1) = 3 + 0 − 2 = <strong>1</strong>.</li>
<li><strong>The geometric formula</strong> — u · v = ‖u‖ ‖v‖ cos θ, where θ is the angle between the two arrows, measured from 0° to 180°.</li>
<li><strong>Why both formulas matter</strong> — the coordinate version is what you can compute; the geometric version is what it means. Setting them equal is how the angle θ is extracted on the next slide.</li>
<li><strong>The sign tells you the angle</strong> — u · v positive means θ is acute, zero means exactly 90°, negative means obtuse. Here u · v = 1, a small positive number, so the two arrows lean slightly the same way.</li>
<li><strong>A vector dotted with itself</strong> — u · u = ‖u‖². For u = (1, 2, −2): u · u = 1 + 4 + 4 = 9 = 3². This identity is used constantly to avoid square roots.</li>
<li><strong>Algebraic rules</strong> — the dot product is commutative (u · v = v · u), distributive over addition (u · (v + w) = u · v + u · w), and pulls out scalars ((cu) · v = c(u · v)).</li>
<li><strong>The basis vectors</strong> — i · i = j · j = k · k = 1 and i · j = j · k = k · i = 0. Those six values are the whole reason the coordinate formula looks so simple.</li>
</ul>
<p class="meo">💡 Read u · v as "how much of u points along v, times the length of v". That single sentence explains the sign rule, the orthogonality test, and the projection formula on slide 7 all at once.</p>
<p class="pitfall">⚠️ Writing u · v as a vector. The dot product is a <strong>number</strong>, so "u · v = (3, 0, −2)" is wrong — that triple is the coordinatewise product, which is not an operation in this chapter. Expressions like (u · v) · w are also meaningless, because a number cannot be dotted with a vector.</p>`,
        `<p class="y-chinh">🎯 Tích vô hướng nhân hai vector và trả về một <strong>số thực</strong>: u · v = u₁v₁ + u₂v₂ + u₃v₃.</p>
<ul>
<li><strong>Cách tính</strong> — nhân các toạ độ tương ứng rồi cộng lại. Với u = (1, 2, −2) và v = (3, 0, 1): u · v = 1(3) + 2(0) + (−2)(1) = 3 + 0 − 2 = <strong>1</strong>.</li>
<li><strong>Công thức hình học</strong> — u · v = ‖u‖ ‖v‖ cos θ, trong đó θ là góc giữa hai mũi tên, đo từ 0° tới 180°.</li>
<li><strong>Vì sao cần cả hai công thức</strong> — bản toạ độ là thứ tính được; bản hình học là thứ mang ý nghĩa. Cho hai bản bằng nhau chính là cách rút ra góc θ ở slide sau.</li>
<li><strong>Dấu cho biết góc</strong> — u · v dương nghĩa là θ nhọn, bằng 0 nghĩa là đúng 90°, âm nghĩa là θ tù. Ở đây u · v = 1, một số dương nhỏ, nên hai mũi tên hơi nghiêng về cùng phía.</li>
<li><strong>Vector nhân vô hướng với chính nó</strong> — u · u = ‖u‖². Với u = (1, 2, −2): u · u = 1 + 4 + 4 = 9 = 3². Đẳng thức này được dùng liên tục để tránh phải khai căn.</li>
<li><strong>Quy tắc đại số</strong> — tích vô hướng giao hoán (u · v = v · u), phân phối với phép cộng (u · (v + w) = u · v + u · w), và rút được hằng số ra ngoài ((cu) · v = c(u · v)).</li>
<li><strong>Các vector cơ sở</strong> — i · i = j · j = k · k = 1 và i · j = j · k = k · i = 0. Sáu giá trị đó chính là lý do khiến công thức toạ độ gọn đến vậy.</li>
</ul>
<p class="meo">💡 Hãy đọc u · v là "phần của u chiếu dọc theo v, nhân với độ dài của v". Một câu đó giải thích luôn quy tắc dấu, phép thử vuông góc, và cả công thức chiếu ở slide 7.</p>
<p class="pitfall">⚠️ Viết u · v thành một vector. Tích vô hướng là một <strong>số</strong>, nên "u · v = (3, 0, −2)" là sai — bộ ba đó là tích theo từng toạ độ, không phải phép toán nào trong chương này. Biểu thức kiểu (u · v) · w cũng vô nghĩa, vì một số không thể nhân vô hướng với một vector.</p>`],

      [6, 'Angle between two vectors and orthogonality',
        `<p class="y-chinh">🎯 Rearranging u · v = ‖u‖ ‖v‖ cos θ gives the angle directly: cos θ = (u · v) / (‖u‖ ‖v‖).</p>
<ul>
<li><strong>The recipe</strong> — compute u · v, compute both lengths, divide, then take the inverse cosine. Three small calculations, in that order.</li>
<li><strong>The slide example, step 1</strong> — u = (1, 2, −2), v = (3, 0, 1). Dot product: u · v = 3 + 0 − 2 = <strong>1</strong>, which is not 0, so the two vectors are <em>not</em> perpendicular.</li>
<li><strong>Step 2 — lengths</strong> — ‖u‖ = √(1 + 4 + 4) = 3 and ‖v‖ = √(9 + 0 + 1) = √10 ≈ 3,1623.</li>
<li><strong>Step 3 — the cosine</strong> — cos θ = 1 / (3√10) = 1 / 9,4868 ≈ <strong>0,1054</strong>.</li>
<li><strong>Step 4 — the angle</strong> — θ = arccos(0,1054) ≈ <strong>83,95°</strong>. Close to a right angle but not quite, exactly as the small positive dot product predicted.</li>
<li><strong>The orthogonality test</strong> — u ⊥ v if and only if u · v = 0. This is the most used single fact of the chapter: no lengths, no arccos, just check whether one sum is zero.</li>
<li><strong>Sanity range</strong> — cos θ always lands between −1 and 1 (this is the Cauchy-Schwarz inequality |u · v| ≤ ‖u‖ ‖v‖). A value outside that range means an arithmetic slip, not a strange angle.</li>
<li><strong>The zero vector again</strong> — 0 · v = 0 for every v, so the zero vector is formally orthogonal to everything, yet the angle between 0 and v is undefined.</li>
</ul>
<p class="meo">💡 Before reaching for a calculator, look at the sign of u · v alone. Positive means the answer must be under 90°, negative means over 90°, and zero means exactly 90° — a free check on your final number.</p>
<p class="pitfall">⚠️ Dividing by the wrong denominator: it is ‖u‖ ‖v‖, the <em>product</em> of the two lengths, not ‖u‖ + ‖v‖ and not ‖u · v‖. And do not normalise twice — once you have divided by both lengths, the result is already the cosine.</p>`,
        `<p class="y-chinh">🎯 Biến đổi lại u · v = ‖u‖ ‖v‖ cos θ là ra ngay góc: cos θ = (u · v) / (‖u‖ ‖v‖).</p>
<ul>
<li><strong>Quy trình</strong> — tính u · v, tính hai độ dài, chia, rồi lấy arccos. Ba phép nhỏ, theo đúng thứ tự đó.</li>
<li><strong>Ví dụ trên slide, bước 1</strong> — u = (1, 2, −2), v = (3, 0, 1). Tích vô hướng: u · v = 3 + 0 − 2 = <strong>1</strong>, khác 0, nên hai vector <em>không</em> vuông góc.</li>
<li><strong>Bước 2 — độ dài</strong> — ‖u‖ = √(1 + 4 + 4) = 3 và ‖v‖ = √(9 + 0 + 1) = √10 ≈ 3,1623.</li>
<li><strong>Bước 3 — cosin</strong> — cos θ = 1 / (3√10) = 1 / 9,4868 ≈ <strong>0,1054</strong>.</li>
<li><strong>Bước 4 — góc</strong> — θ = arccos(0,1054) ≈ <strong>83,95°</strong>. Gần vuông nhưng chưa vuông, đúng như con số tích vô hướng dương nhỏ đã báo trước.</li>
<li><strong>Phép thử vuông góc</strong> — u ⊥ v khi và chỉ khi u · v = 0. Đây là sự thật được dùng nhiều nhất cả chương: không cần độ dài, không cần arccos, chỉ xem một tổng có bằng 0 không.</li>
<li><strong>Khoảng giá trị để tự soát</strong> — cos θ luôn nằm giữa −1 và 1 (đó là bất đẳng thức Cauchy-Schwarz |u · v| ≤ ‖u‖ ‖v‖). Ra ngoài khoảng đó nghĩa là tính sai chứ không phải gặp góc lạ.</li>
<li><strong>Lại chuyện vector không</strong> — 0 · v = 0 với mọi v, nên về hình thức vector không vuông góc với tất cả, nhưng góc giữa 0 và v thì không xác định.</li>
</ul>
<p class="meo">💡 Trước khi bấm máy tính, hãy nhìn riêng dấu của u · v. Dương thì đáp án bắt buộc dưới 90°, âm thì trên 90°, bằng 0 thì đúng 90° — một phép kiểm miễn phí cho con số cuối.</p>
<p class="pitfall">⚠️ Chia nhầm mẫu: mẫu là ‖u‖ ‖v‖, tức <em>tích</em> hai độ dài, không phải ‖u‖ + ‖v‖ và cũng không phải ‖u · v‖. Và đừng chuẩn hoá hai lần — đã chia cho cả hai độ dài thì kết quả chính là cosin rồi.</p>`],

      [7, 'Projection of one vector onto another',
        `<p class="y-chinh">🎯 The projection of u onto v is the shadow u casts on the line through v: proj_v(u) = ((u · v) / ‖v‖²) · v.</p>
<ul>
<li><strong>What the formula is doing</strong> — (u · v)/‖v‖² is a plain number, the scaling factor; multiplying it by v produces a vector <em>parallel to v</em>. The output is always a multiple of v, never of u.</li>
<li><strong>Worked example, step 1</strong> — take u = (3, 4, 0) and v = (1, 0, 0), the direction of the x-axis.</li>
<li><strong>Step 2 — the two ingredients</strong> — u · v = 3(1) + 4(0) + 0(0) = <strong>3</strong>, and ‖v‖² = 1² + 0² + 0² = <strong>1</strong>.</li>
<li><strong>Step 3 — the projection</strong> — proj_v(u) = (3/1)·v = 3(1, 0, 0) = <strong>(3, 0, 0)</strong>. Geometrically obvious: dropping (3, 4, 0) onto the x-axis leaves its x-coordinate 3.</li>
<li><strong>The leftover piece</strong> — u − proj_v(u) = (3, 4, 0) − (3, 0, 0) = (0, 4, 0), which is perpendicular to v (its dot with v is 0) and has length 4. This orthogonal component is the <em>distance from the tip of u to the line of v</em>.</li>
<li><strong>The decomposition</strong> — every vector splits uniquely as u = (component along v) + (component perpendicular to v). Checking: (3, 0, 0) + (0, 4, 0) = (3, 4, 0) ✓.</li>
<li><strong>Scalar projection</strong> — the signed length of the shadow is (u · v)/‖v‖ = 3/1 = 3. Note the denominator is ‖v‖ here, not ‖v‖²: one power of v is used for the length, two for the vector.</li>
<li><strong>When v is already a unit vector</strong> — ‖v‖² = 1 and the formula collapses to proj_v(u) = (u · v)v, which is why normalising v first often saves work.</li>
</ul>
<p class="meo">💡 Sketch it once: u is the hypotenuse, proj_v(u) is the leg along v, and u − proj_v(u) is the vertical leg. Those three arrows form a right triangle, so ‖u‖² = ‖proj‖² + ‖leftover‖² — here 25 = 9 + 16 ✓.</p>
<p class="pitfall">⚠️ Two mistakes with the same cause — forgetting which vector is the <em>direction</em>. proj_v(u) ≠ proj_u(v): projecting (3, 4, 0) onto (1, 0, 0) gives (3, 0, 0), but projecting (1, 0, 0) onto (3, 4, 0) gives (3/25)(3, 4, 0) = (0,36 · 1; 0,48; 0), a completely different vector. Also, squaring the wrong length: the denominator is ‖v‖², never ‖u‖².</p>`,
        `<p class="y-chinh">🎯 Phép chiếu của u lên v là cái bóng mà u đổ xuống đường thẳng theo phương v: proj_v(u) = ((u · v) / ‖v‖²) · v.</p>
<ul>
<li><strong>Công thức đang làm gì</strong> — (u · v)/‖v‖² là một con số thuần, tức hệ số co giãn; nhân nó với v thì được một vector <em>song song với v</em>. Kết quả luôn là bội của v, không bao giờ là bội của u.</li>
<li><strong>Ví dụ giải từng bước, bước 1</strong> — lấy u = (3, 4, 0) và v = (1, 0, 0), tức hướng của trục x.</li>
<li><strong>Bước 2 — hai thành phần cần có</strong> — u · v = 3(1) + 4(0) + 0(0) = <strong>3</strong>, và ‖v‖² = 1² + 0² + 0² = <strong>1</strong>.</li>
<li><strong>Bước 3 — phép chiếu</strong> — proj_v(u) = (3/1)·v = 3(1, 0, 0) = <strong>(3, 0, 0)</strong>. Hình học thì quá rõ: hạ (3, 4, 0) xuống trục x thì còn lại đúng hoành độ 3.</li>
<li><strong>Phần còn dư</strong> — u − proj_v(u) = (3, 4, 0) − (3, 0, 0) = (0, 4, 0), vuông góc với v (tích vô hướng với v bằng 0) và dài 4. Thành phần vuông góc này chính là <em>khoảng cách từ đầu mút của u tới đường thẳng theo v</em>.</li>
<li><strong>Phép phân tích</strong> — mọi vector tách được duy nhất thành u = (thành phần dọc theo v) + (thành phần vuông góc với v). Kiểm lại: (3, 0, 0) + (0, 4, 0) = (3, 4, 0) ✓.</li>
<li><strong>Chiếu vô hướng</strong> — độ dài có dấu của cái bóng là (u · v)/‖v‖ = 3/1 = 3. Chú ý mẫu ở đây là ‖v‖ chứ không phải ‖v‖²: một luỹ thừa của v dùng cho độ dài, hai luỹ thừa dùng cho vector.</li>
<li><strong>Khi v vốn đã là vector đơn vị</strong> — ‖v‖² = 1 và công thức rút gọn thành proj_v(u) = (u · v)v, nên chuẩn hoá v trước thường tiết kiệm được khối công.</li>
</ul>
<p class="meo">💡 Hãy vẽ một lần: u là cạnh huyền, proj_v(u) là cạnh nằm dọc theo v, còn u − proj_v(u) là cạnh dựng đứng. Ba mũi tên đó lập thành tam giác vuông, nên ‖u‖² = ‖proj‖² + ‖phần dư‖² — ở đây 25 = 9 + 16 ✓.</p>
<p class="pitfall">⚠️ Hai lỗi cùng một gốc — quên mất vector nào mới là <em>phương chiếu</em>. proj_v(u) ≠ proj_u(v): chiếu (3, 4, 0) lên (1, 0, 0) ra (3, 0, 0), nhưng chiếu (1, 0, 0) lên (3, 4, 0) lại ra (3/25)(3, 4, 0) = (0,36; 0,48; 0), một vector hoàn toàn khác. Lỗi còn lại là bình phương nhầm độ dài: mẫu là ‖v‖², không bao giờ là ‖u‖².</p>`],

      [8, 'Lines in space — vector, parametric and symmetric form',
        `<p class="y-chinh">🎯 A line in space is fixed by one <strong>point on it</strong> and one <strong>direction vector</strong>: r = r₀ + t d, for every real t.</p>
<ul>
<li><strong>Vector form</strong> — r = r₀ + t d, where r₀ is the position vector of a known point P₀ and d = (a, b, c) is the direction. Every value of t gives one point of the line; t sweeps the whole line as it runs over R.</li>
<li><strong>Parametric form</strong> — writing the three coordinates separately gives x = x₀ + at, y = y₀ + bt, z = z₀ + ct. This is the form you actually compute with.</li>
<li><strong>Symmetric (canonical) form</strong> — solving each equation for t and setting the results equal gives (x − x₀)/a = (y − y₀)/b = (z − z₀)/c. It is only valid when a, b and c are all nonzero, because you cannot divide by 0.</li>
<li><strong>Worked example</strong> — the line through P₀ = (1, 2, 3) with direction d = (2, −1, 4) has parametric form x = 1 + 2t, y = 2 − t, z = 3 + 4t, and symmetric form (x − 1)/2 = (y − 2)/(−1) = (z − 3)/4.</li>
<li><strong>Line through two points</strong> — take d = AB = B − A. With A = (1, 2, 3) and B = (3, 1, 7): d = (2, −1, 4), which is the same line as above. Check: t = 1 gives (1+2, 2−1, 3+4) = (3, 1, 7) = B ✓.</li>
<li><strong>Is a point on the line?</strong> — solve for t in one coordinate, then verify the same t works in the other two. For (5, 0, 11): 5 = 1 + 2t gives t = 2; then y = 2 − 2 = 0 ✓ and z = 3 + 8 = 11 ✓, so the point is on the line.</li>
<li><strong>Parallel, intersecting, skew</strong> — two lines are parallel when their direction vectors are multiples of each other; if not parallel they either meet at one point or are <em>skew</em> (never meet, not parallel) — a situation that exists only in three dimensions.</li>
<li><strong>Direction is not unique</strong> — d, 2d and −d all describe the same line, and so does any other point on the line as r₀. Two correct answers can look completely different.</li>
</ul>
<p class="meo">💡 If one component of d is 0, say d = (2, 0, 4), do not force the symmetric form. Write the flat coordinate as its own equation instead: (x − x₀)/2 = (z − z₀)/4 together with y = y₀.</p>
<p class="pitfall">⚠️ Putting the direction where the point belongs. In r = r₀ + t d, r₀ is a <em>point</em> and d is a <em>direction</em>; swapping them gives a different line entirely. Also watch the sign in the symmetric form: with b = −1 the middle term is (y − 2)/(−1), which equals −(y − 2), not (y − 2).</p>`,
        `<p class="y-chinh">🎯 Một đường thẳng trong không gian được xác định bởi một <strong>điểm thuộc nó</strong> và một <strong>vector chỉ phương</strong>: r = r₀ + t d, với mọi số thực t.</p>
<ul>
<li><strong>Dạng vector</strong> — r = r₀ + t d, trong đó r₀ là vector vị trí của điểm đã biết P₀ còn d = (a, b, c) là hướng. Mỗi giá trị t cho một điểm của đường thẳng; t chạy khắp R thì quét trọn đường thẳng.</li>
<li><strong>Dạng tham số</strong> — viết tách ba toạ độ ra được x = x₀ + at, y = y₀ + bt, z = z₀ + ct. Đây mới là dạng thực sự dùng để tính.</li>
<li><strong>Dạng chính tắc (đối xứng)</strong> — rút t từ mỗi phương trình rồi cho bằng nhau được (x − x₀)/a = (y − y₀)/b = (z − z₀)/c. Dạng này chỉ hợp lệ khi a, b, c đều khác 0, vì không thể chia cho 0.</li>
<li><strong>Ví dụ có giải</strong> — đường thẳng qua P₀ = (1, 2, 3) với hướng d = (2, −1, 4) có dạng tham số x = 1 + 2t, y = 2 − t, z = 3 + 4t, và dạng chính tắc (x − 1)/2 = (y − 2)/(−1) = (z − 3)/4.</li>
<li><strong>Đường thẳng qua hai điểm</strong> — lấy d = AB = B − A. Với A = (1, 2, 3) và B = (3, 1, 7): d = (2, −1, 4), đúng là đường thẳng ở trên. Kiểm lại: t = 1 cho (1+2, 2−1, 3+4) = (3, 1, 7) = B ✓.</li>
<li><strong>Một điểm có nằm trên đường thẳng không?</strong> — giải t từ một toạ độ, rồi kiểm cùng giá trị t đó có đúng ở hai toạ độ còn lại không. Với (5, 0, 11): 5 = 1 + 2t cho t = 2; khi đó y = 2 − 2 = 0 ✓ và z = 3 + 8 = 11 ✓, vậy điểm nằm trên đường thẳng.</li>
<li><strong>Song song, cắt nhau, chéo nhau</strong> — hai đường thẳng song song khi hai vector chỉ phương là bội của nhau; nếu không song song thì hoặc chúng cắt nhau tại một điểm, hoặc <em>chéo nhau</em> (không bao giờ gặp mà cũng không song song) — tình huống chỉ tồn tại trong không gian ba chiều.</li>
<li><strong>Vector chỉ phương không duy nhất</strong> — d, 2d và −d đều mô tả cùng một đường thẳng, và lấy điểm nào trên đường thẳng làm r₀ cũng được. Hai đáp án cùng đúng có thể trông hoàn toàn khác nhau.</li>
</ul>
<p class="meo">💡 Nếu một thành phần của d bằng 0, chẳng hạn d = (2, 0, 4), thì đừng gượng ép viết dạng chính tắc. Hãy tách riêng toạ độ phẳng đó thành một phương trình: (x − x₀)/2 = (z − z₀)/4 kèm theo y = y₀.</p>
<p class="pitfall">⚠️ Đặt vector chỉ phương vào chỗ của điểm. Trong r = r₀ + t d thì r₀ là <em>điểm</em> còn d là <em>hướng</em>; đổi chỗ hai thứ đó là ra một đường thẳng khác hẳn. Cũng để ý dấu trong dạng chính tắc: với b = −1 thì số hạng giữa là (y − 2)/(−1), tức bằng −(y − 2) chứ không phải (y − 2).</p>`],

      [9, 'Distance from a point to a line',
        `<p class="y-chinh">🎯 The distance from a point Q to the line through P₀ with direction d is D = ‖P₀Q × d‖ / ‖d‖.</p>
<ul>
<li><strong>Where the formula comes from</strong> — the vectors P₀Q and d span a parallelogram whose area is ‖P₀Q × d‖. Area equals base times height, the base is ‖d‖, so the height — which is exactly the perpendicular distance — is area divided by base.</li>
<li><strong>Step 1 — build the vector from the line to the point</strong> — P₀Q = Q − P₀. This is the only place the position of the line enters; the rest is pure cross product.</li>
<li><strong>Worked example, setup</strong> — take the x-axis: P₀ = (0, 0, 0), d = (1, 0, 0), and the point Q = (0, 3, 4). Then P₀Q = (0, 3, 4).</li>
<li><strong>Step 2 — the cross product</strong> — P₀Q × d = (3·0 − 4·0, 4·1 − 0·0, 0·0 − 3·1) = <strong>(0, 4, −3)</strong>.</li>
<li><strong>Step 3 — the two norms</strong> — ‖(0, 4, −3)‖ = √(0 + 16 + 9) = √25 = 5, and ‖d‖ = 1.</li>
<li><strong>Step 4 — the answer</strong> — D = 5 / 1 = <strong>5</strong>. Independent check: the distance from (0, 3, 4) to the x-axis is √(3² + 4²) = 5 ✓.</li>
<li><strong>A second example with a fraction</strong> — line through P₀ = (1, 0, 0) with d = (1, 1, 0), and Q = the origin. Then P₀Q = (−1, 0, 0), P₀Q × d = (0, 0, −1), so D = 1/√2 ≈ 0,707.</li>
<li><strong>The projection route</strong> — the same answer follows from slide 7: subtract proj_d(P₀Q) from P₀Q and take the length of what is left. Use whichever you remember; the cross-product version is shorter.</li>
</ul>
<p class="meo">💡 Scale-invariance is a free check: replacing d by 2d doubles both the numerator and the denominator, so D must not change. If your answer moves when you rescale d, you divided by the wrong thing.</p>
<p class="pitfall">⚠️ Dividing by ‖P₀Q‖ instead of ‖d‖. The denominator is always the length of the <em>direction</em> vector, because that is the base of the parallelogram. A second trap: forgetting the division entirely when d happens to be a unit vector — it is harmless there, but the habit breaks the moment d is (2, −1, 4).</p>`,
        `<p class="y-chinh">🎯 Khoảng cách từ điểm Q tới đường thẳng qua P₀ với hướng d là D = ‖P₀Q × d‖ / ‖d‖.</p>
<ul>
<li><strong>Công thức từ đâu ra</strong> — hai vector P₀Q và d căng nên một hình bình hành có diện tích ‖P₀Q × d‖. Diện tích bằng đáy nhân chiều cao, đáy là ‖d‖, nên chiều cao — đúng bằng khoảng cách vuông góc — là diện tích chia cho đáy.</li>
<li><strong>Bước 1 — dựng vector từ đường thẳng tới điểm</strong> — P₀Q = Q − P₀. Đây là chỗ duy nhất vị trí của đường thẳng tham gia; phần còn lại thuần là tích có hướng.</li>
<li><strong>Ví dụ có giải, đề bài</strong> — lấy trục x: P₀ = (0, 0, 0), d = (1, 0, 0), và điểm Q = (0, 3, 4). Khi đó P₀Q = (0, 3, 4).</li>
<li><strong>Bước 2 — tích có hướng</strong> — P₀Q × d = (3·0 − 4·0, 4·1 − 0·0, 0·0 − 3·1) = <strong>(0, 4, −3)</strong>.</li>
<li><strong>Bước 3 — hai độ dài</strong> — ‖(0, 4, −3)‖ = √(0 + 16 + 9) = √25 = 5, và ‖d‖ = 1.</li>
<li><strong>Bước 4 — đáp án</strong> — D = 5 / 1 = <strong>5</strong>. Kiểm độc lập: khoảng cách từ (0, 3, 4) tới trục x là √(3² + 4²) = 5 ✓.</li>
<li><strong>Ví dụ thứ hai ra phân số</strong> — đường thẳng qua P₀ = (1, 0, 0) với d = (1, 1, 0), và Q là gốc toạ độ. Khi đó P₀Q = (−1, 0, 0), P₀Q × d = (0, 0, −1), nên D = 1/√2 ≈ 0,707.</li>
<li><strong>Đường đi qua phép chiếu</strong> — vẫn ra đáp án đó nếu dùng slide 7: lấy P₀Q trừ đi proj_d(P₀Q) rồi tính độ dài phần còn lại. Nhớ cách nào dùng cách đó; bản tích có hướng ngắn hơn.</li>
</ul>
<p class="meo">💡 Tính bất biến theo tỉ lệ là một phép kiểm miễn phí: thay d bằng 2d thì cả tử lẫn mẫu đều gấp đôi, nên D bắt buộc không đổi. Đáp án mà đổi khi đổi tỉ lệ d là bạn đã chia nhầm chỗ.</p>
<p class="pitfall">⚠️ Chia cho ‖P₀Q‖ thay vì ‖d‖. Mẫu số luôn là độ dài vector <em>chỉ phương</em>, vì đó mới là đáy của hình bình hành. Bẫy thứ hai: quên hẳn phép chia khi d tình cờ là vector đơn vị — ở đó thì vô hại, nhưng thói quen ấy vỡ ngay khi d là (2, −1, 4).</p>`],

      [10, 'Cross product — two vectors give a vector',
        `<p class="y-chinh">🎯 In R³ the cross product u × v produces a <strong>new vector</strong>, computed as a 3×3 determinant with i, j, k in the top row.</p>
<ul>
<li><strong>The determinant layout</strong> — write i, j, k across the first row, the coordinates of u across the second, and those of v across the third, then expand along the first row.</li>
<li><strong>The coordinate formula</strong> — u × v = (u₂v₃ − u₃v₂, u₃v₁ − u₁v₃, u₁v₂ − u₂v₁). Each entry uses the two coordinates that are <em>not</em> its own, and the middle one carries a built-in sign flip.</li>
<li><strong>Worked example</strong> — u = (2, 1, −1), v = (−3, 4, 1). First entry: 1(1) − (−1)(4) = 1 + 4 = 5. Second: (−1)(−3) − 2(1) = 3 − 2 = 1. Third: 2(4) − 1(−3) = 8 + 3 = 11. So u × v = <strong>(5, 1, 11)</strong>.</li>
<li><strong>The defining property</strong> — u × v is perpendicular to <em>both</em> u and v. Check on the example: u · (5, 1, 11) = 10 + 1 − 11 = 0 ✓ and v · (5, 1, 11) = −15 + 4 + 11 = 0 ✓.</li>
<li><strong>Which of the two perpendicular directions</strong> — the right-hand rule: point the fingers of your right hand along u, curl them towards v, and your thumb points along u × v. The basis vectors follow the cycle i × j = k, j × k = i, k × i = j.</li>
<li><strong>This is the normal vector</strong> — because u × v is perpendicular to the plane containing u and v, it is exactly the normal vector n used to write a plane equation on slide 13.</li>
<li><strong>R³ only</strong> — the cross product has no meaning in R² or R⁴. To cross two plane vectors, pad them to (x, y, 0) first; the result then points purely along z.</li>
</ul>
<p class="meo">💡 Verify every cross product by dotting it with both inputs. Two zeros take ten seconds and catch essentially every sign error — no other check in this chapter is that cheap or that reliable.</p>
<p class="pitfall">⚠️ Losing the minus on the middle component. Expanding the determinant gives −(u₁v₃ − u₃v₁), which is why the second entry reads u₃v₁ − u₁v₃ with the factors <em>swapped</em>. Writing u₁v₃ − u₃v₁ there is the single most common cross-product error, and it produces a vector that fails the dot-product check.</p>`,
        `<p class="y-chinh">🎯 Trong R³, tích có hướng u × v sinh ra một <strong>vector mới</strong>, tính bằng định thức 3×3 với i, j, k ở hàng đầu.</p>
<ul>
<li><strong>Cách xếp định thức</strong> — viết i, j, k dọc hàng thứ nhất, toạ độ của u dọc hàng thứ hai, toạ độ của v dọc hàng thứ ba, rồi khai triển theo hàng đầu.</li>
<li><strong>Công thức toạ độ</strong> — u × v = (u₂v₃ − u₃v₂, u₃v₁ − u₁v₃, u₁v₂ − u₂v₁). Mỗi thành phần dùng đúng hai toạ độ <em>không phải</em> của mình, và thành phần giữa mang sẵn một lần đảo dấu.</li>
<li><strong>Ví dụ có giải</strong> — u = (2, 1, −1), v = (−3, 4, 1). Thành phần 1: 1(1) − (−1)(4) = 1 + 4 = 5. Thành phần 2: (−1)(−3) − 2(1) = 3 − 2 = 1. Thành phần 3: 2(4) − 1(−3) = 8 + 3 = 11. Vậy u × v = <strong>(5, 1, 11)</strong>.</li>
<li><strong>Tính chất định nghĩa</strong> — u × v vuông góc với <em>cả</em> u lẫn v. Kiểm trên ví dụ: u · (5, 1, 11) = 10 + 1 − 11 = 0 ✓ và v · (5, 1, 11) = −15 + 4 + 11 = 0 ✓.</li>
<li><strong>Trong hai hướng vuông góc thì chọn hướng nào</strong> — quy tắc bàn tay phải: xoè các ngón tay phải theo u, cuộn về phía v, ngón cái chỉ theo u × v. Các vector cơ sở đi theo vòng i × j = k, j × k = i, k × i = j.</li>
<li><strong>Đây chính là vector pháp tuyến</strong> — vì u × v vuông góc với mặt phẳng chứa u và v, nó đúng là vector pháp tuyến n dùng để viết phương trình mặt phẳng ở slide 13.</li>
<li><strong>Chỉ có trong R³</strong> — tích có hướng không có nghĩa trong R² hay R⁴. Muốn nhân có hướng hai vector phẳng thì phải độn thành (x, y, 0) trước; kết quả khi đó nằm hẳn dọc trục z.</li>
</ul>
<p class="meo">💡 Hãy kiểm mọi tích có hướng bằng cách nhân vô hướng nó với cả hai vector đầu vào. Hai số 0 tốn mười giây và bắt được gần như mọi lỗi dấu — trong chương này không phép kiểm nào vừa rẻ vừa chắc như vậy.</p>
<p class="pitfall">⚠️ Đánh rơi dấu trừ ở thành phần giữa. Khai triển định thức cho −(u₁v₃ − u₃v₁), nên thành phần thứ hai đọc ra là u₃v₁ − u₁v₃ với hai thừa số <em>đổi chỗ</em>. Viết u₁v₃ − u₃v₁ ở đó là lỗi tích có hướng phổ biến nhất, và nó cho ra một vector trượt ngay phép kiểm bằng tích vô hướng.</p>`],

      [11, 'Properties of the cross product',
        `<p class="y-chinh">🎯 The magnitude ‖u × v‖ = ‖u‖ ‖v‖ sin θ is the <strong>area of the parallelogram</strong> spanned by u and v.</p>
<ul>
<li><strong>Dot versus cross, side by side</strong> — u · v = ‖u‖ ‖v‖ cos θ measures how much the vectors <em>agree</em>; ‖u × v‖ = ‖u‖ ‖v‖ sin θ measures how much they <em>differ</em>. The cosine peaks when they are parallel, the sine peaks when they are perpendicular.</li>
<li><strong>Anticommutative</strong> — u × v = −(v × u). Order is not free here: swapping the inputs reverses the output vector, so (5, 1, 11) becomes (−5, −1, −11).</li>
<li><strong>Parallel test</strong> — u ∥ v if and only if u × v = 0, the zero vector. In particular u × u = 0 for every u, since sin 0° = 0.</li>
<li><strong>Distributive and scalar rules</strong> — u × (v + w) = u × v + u × w, and (cu) × v = c(u × v) = u × (cv). Those hold exactly as you would hope.</li>
<li><strong>Not associative</strong> — (u × v) × w is generally different from u × (v × w). With u = (1, 0, 0) and v = (0, 1, 0): u × (u × v) = (1, 0, 0) × (0, 0, 1) = (0, −1, 0), while (u × u) × v = 0 × v = 0. Brackets are compulsory.</li>
<li><strong>Lagrange identity</strong> — ‖u × v‖² + (u · v)² = ‖u‖² ‖v‖². Check on u = (2, 1, −1), v = (−3, 4, 1): 147 + (−3)² = 147 + 9 = 156, and ‖u‖² ‖v‖² = 6 · 26 = 156 ✓.</li>
<li><strong>Two orthogonality checks in one</strong> — u · (u × v) = 0 and v · (u × v) = 0 always hold, whatever u and v are. This is the practical verification from the previous slide, stated as a theorem.</li>
<li><strong>Angle from the cross product</strong> — sin θ = ‖u × v‖ / (‖u‖ ‖v‖) gives the angle too, but only between 0° and 90°: the sine cannot distinguish 100° from 80°. Use the dot product when the angle may be obtuse.</li>
</ul>
<p class="meo">💡 Choose the tool by the answer you need: <strong>dot for a number</strong> (angle, work, orthogonality), <strong>cross for a vector</strong> (normal, area, torque). Reading the units of the requested answer picks the product for you.</p>
<p class="pitfall">⚠️ Treating u × v like ordinary multiplication. It is neither commutative nor associative, and u × v = 0 does <em>not</em> imply that u or v is zero — it only means the two are parallel. Mixing the notations is just as damaging: u · v is a number, so "u · v × w" only parses as u · (v × w), the triple product of slide 15.</p>`,
        `<p class="y-chinh">🎯 Độ lớn ‖u × v‖ = ‖u‖ ‖v‖ sin θ chính là <strong>diện tích hình bình hành</strong> căng bởi u và v.</p>
<ul>
<li><strong>Đặt tích vô hướng cạnh tích có hướng</strong> — u · v = ‖u‖ ‖v‖ cos θ đo mức hai vector <em>đồng thuận</em>; ‖u × v‖ = ‖u‖ ‖v‖ sin θ đo mức chúng <em>khác nhau</em>. Cosin đạt đỉnh khi chúng song song, sin đạt đỉnh khi chúng vuông góc.</li>
<li><strong>Chống giao hoán</strong> — u × v = −(v × u). Thứ tự ở đây không cho không: đổi chỗ hai đầu vào thì vector kết quả quay ngược, (5, 1, 11) thành (−5, −1, −11).</li>
<li><strong>Phép thử song song</strong> — u ∥ v khi và chỉ khi u × v = 0, tức vector không. Đặc biệt u × u = 0 với mọi u, vì sin 0° = 0.</li>
<li><strong>Phân phối và rút hằng số</strong> — u × (v + w) = u × v + u × w, và (cu) × v = c(u × v) = u × (cv). Những tính chất này đúng y như mong đợi.</li>
<li><strong>Không kết hợp</strong> — (u × v) × w nói chung khác u × (v × w). Với u = (1, 0, 0) và v = (0, 1, 0): u × (u × v) = (1, 0, 0) × (0, 0, 1) = (0, −1, 0), trong khi (u × u) × v = 0 × v = 0. Dấu ngoặc là bắt buộc.</li>
<li><strong>Đẳng thức Lagrange</strong> — ‖u × v‖² + (u · v)² = ‖u‖² ‖v‖². Kiểm với u = (2, 1, −1), v = (−3, 4, 1): 147 + (−3)² = 147 + 9 = 156, còn ‖u‖² ‖v‖² = 6 · 26 = 156 ✓.</li>
<li><strong>Hai phép kiểm vuông góc gộp một</strong> — u · (u × v) = 0 và v · (u × v) = 0 luôn đúng, bất kể u và v là gì. Đây chính là phép kiểm thực hành ở slide trước, phát biểu thành định lý.</li>
<li><strong>Tìm góc từ tích có hướng</strong> — sin θ = ‖u × v‖ / (‖u‖ ‖v‖) cũng cho ra góc, nhưng chỉ trong khoảng 0° tới 90°: sin không phân biệt được 100° với 80°. Khi góc có thể tù thì phải dùng tích vô hướng.</li>
</ul>
<p class="meo">💡 Chọn công cụ theo loại đáp án cần: <strong>tích vô hướng cho ra số</strong> (góc, công, vuông góc), <strong>tích có hướng cho ra vector</strong> (pháp tuyến, diện tích, mômen). Chỉ cần đọc đơn vị của thứ đề hỏi là biết dùng phép nào.</p>
<p class="pitfall">⚠️ Coi u × v như phép nhân thường. Nó không giao hoán, cũng không kết hợp, và u × v = 0 <em>không</em> kéo theo u hay v bằng không — nó chỉ nghĩa là hai vector song song. Trộn ký hiệu cũng tai hại không kém: u · v là một số, nên "u · v × w" chỉ đọc được thành u · (v × w), tức tích hỗn tạp ở slide 15.</p>`],

      [12, 'Worked example — cross product, parallelogram and triangle area',
        `<p class="y-chinh">🎯 Two complete examples: the textbook case u = (1, 0, 0), v = (0, 1, 0), then a messier one that shows the full method.</p>
<ul>
<li><strong>Example 1, step 1 — the cross product</strong> — u = (1, 0, 0), v = (0, 1, 0). First entry: 0·0 − 0·1 = 0. Second: 0·0 − 1·0 = 0. Third: 1·1 − 0·0 = 1. So u × v = <strong>(0, 0, 1)</strong> = k, which is the right-hand rule in its purest form.</li>
<li><strong>Example 1, step 2 — parallelogram area</strong> — ‖u × v‖ = √(0 + 0 + 1) = <strong>1</strong>. And it should be: u and v span the unit square in the xy-plane.</li>
<li><strong>Example 1, step 3 — triangle area</strong> — a triangle is half a parallelogram, so S = ½‖u × v‖ = <strong>0,5</strong>.</li>
<li><strong>Example 2, setup</strong> — u = (2, 1, −1) and v = (−3, 4, 1), the pair from slide 10, where u × v = (5, 1, 11).</li>
<li><strong>Example 2 — parallelogram area</strong> — ‖(5, 1, 11)‖ = √(25 + 1 + 121) = √147 = 7√3 ≈ <strong>12,124</strong>.</li>
<li><strong>Example 2 — triangle area</strong> — S = ½ · 7√3 = 7√3/2 ≈ <strong>6,062</strong>.</li>
<li><strong>Cross-check with the sine formula</strong> — ‖u‖ = √6, ‖v‖ = √26, so ‖u‖‖v‖ = √156 ≈ 12,49; and u · v = −6 + 4 − 1 = −3 gives cos θ = −3/√156 ≈ −0,240, hence θ ≈ 103,9° and sin θ ≈ 0,9707. Then ‖u‖‖v‖ sin θ ≈ 12,49 · 0,9707 ≈ 12,124 ✓ — the same area by a completely different route.</li>
<li><strong>Area from three points</strong> — for a triangle ABC, form AB and AC first, then S = ½‖AB × AC‖. Never cross the position vectors of A, B and C themselves.</li>
</ul>
<p class="meo">💡 The factor ½ is worth a mnemonic: the cross product measures the <em>parallelogram</em>, and a triangle is exactly half of one. Whenever the word "triangle" appears in the question, the ½ must appear in the answer.</p>
<p class="pitfall">⚠️ Two marks lost routinely here. First, forgetting the ½ and handing in the parallelogram area for a triangle. Second, giving the area as a <em>vector</em>: ‖u × v‖ is a number, so the answer to example 2 is 7√3, not (5, 1, 11).</p>`,
        `<p class="y-chinh">🎯 Hai ví dụ đầy đủ: trường hợp sách giáo khoa u = (1, 0, 0), v = (0, 1, 0), rồi một ví dụ xấu số hơn để thấy trọn phương pháp.</p>
<ul>
<li><strong>Ví dụ 1, bước 1 — tích có hướng</strong> — u = (1, 0, 0), v = (0, 1, 0). Thành phần 1: 0·0 − 0·1 = 0. Thành phần 2: 0·0 − 1·0 = 0. Thành phần 3: 1·1 − 0·0 = 1. Vậy u × v = <strong>(0, 0, 1)</strong> = k, đúng quy tắc bàn tay phải ở dạng thuần khiết nhất.</li>
<li><strong>Ví dụ 1, bước 2 — diện tích hình bình hành</strong> — ‖u × v‖ = √(0 + 0 + 1) = <strong>1</strong>. Đúng phải vậy: u và v căng nên hình vuông đơn vị trong mặt phẳng xy.</li>
<li><strong>Ví dụ 1, bước 3 — diện tích tam giác</strong> — tam giác là nửa hình bình hành, nên S = ½‖u × v‖ = <strong>0,5</strong>.</li>
<li><strong>Ví dụ 2, đề bài</strong> — u = (2, 1, −1) và v = (−3, 4, 1), đúng cặp ở slide 10, nơi u × v = (5, 1, 11).</li>
<li><strong>Ví dụ 2 — diện tích hình bình hành</strong> — ‖(5, 1, 11)‖ = √(25 + 1 + 121) = √147 = 7√3 ≈ <strong>12,124</strong>.</li>
<li><strong>Ví dụ 2 — diện tích tam giác</strong> — S = ½ · 7√3 = 7√3/2 ≈ <strong>6,062</strong>.</li>
<li><strong>Kiểm chéo bằng công thức sin</strong> — ‖u‖ = √6, ‖v‖ = √26, nên ‖u‖‖v‖ = √156 ≈ 12,49; và u · v = −6 + 4 − 1 = −3 cho cos θ = −3/√156 ≈ −0,240, suy ra θ ≈ 103,9° và sin θ ≈ 0,9707. Khi đó ‖u‖‖v‖ sin θ ≈ 12,49 · 0,9707 ≈ 12,124 ✓ — cùng một diện tích bằng một con đường hoàn toàn khác.</li>
<li><strong>Diện tích từ ba điểm</strong> — với tam giác ABC, hãy lập AB và AC trước, rồi S = ½‖AB × AC‖. Đừng bao giờ nhân có hướng chính các vector vị trí của A, B, C.</li>
</ul>
<p class="meo">💡 Hệ số ½ đáng có một câu thần chú: tích có hướng đo <em>hình bình hành</em>, mà tam giác thì đúng bằng một nửa. Hễ đề có chữ "tam giác" thì đáp án bắt buộc phải có ½.</p>
<p class="pitfall">⚠️ Hai điểm hay mất ở đây. Một là quên ½ rồi nộp diện tích hình bình hành cho câu hỏi về tam giác. Hai là trả lời diện tích bằng một <em>vector</em>: ‖u × v‖ là một số, nên đáp án ví dụ 2 là 7√3 chứ không phải (5, 1, 11).</p>`],

      [13, 'Planes — normal vector and the equation ax + by + cz = d',
        `<p class="y-chinh">🎯 A plane is fixed by one <strong>point on it</strong> and one <strong>normal vector</strong> n = (a, b, c): n · (r − r₀) = 0, which expands to ax + by + cz = d.</p>
<ul>
<li><strong>The idea</strong> — a point r lies in the plane exactly when the vector r − r₀ runs inside the plane, and a vector lies inside the plane exactly when it is perpendicular to n. So membership is a single dot-product test.</li>
<li><strong>From vector form to scalar form</strong> — expanding n · (r − r₀) = 0 gives a(x − x₀) + b(y − y₀) + c(z − z₀) = 0, that is ax + by + cz = d with <strong>d = ax₀ + by₀ + cz₀</strong>.</li>
<li><strong>Reading a plane equation</strong> — the coefficients <em>are</em> the normal. From 2x − y + 3z = 7 you can read off n = (2, −1, 3) without any work at all.</li>
<li><strong>Worked example, step 1</strong> — find the plane through A = (1, 0, 0), B = (0, 1, 0), C = (0, 0, 1). First build two vectors inside it: AB = B − A = (−1, 1, 0) and AC = C − A = (−1, 0, 1).</li>
<li><strong>Step 2 — the normal</strong> — n = AB × AC = (1·1 − 0·0, 0·(−1) − (−1)·1, (−1)·0 − 1·(−1)) = <strong>(1, 1, 1)</strong>.</li>
<li><strong>Step 3 — the constant</strong> — use A: d = 1(1) + 1(0) + 1(0) = 1, so the plane is <strong>x + y + z = 1</strong>. Check B: 0 + 1 + 0 = 1 ✓, and C: 0 + 0 + 1 = 1 ✓.</li>
<li><strong>Parallel and perpendicular planes</strong> — two planes are parallel when their normals are multiples of each other; the angle between two planes is the angle between their normals, computed with the dot product of slide 6.</li>
<li><strong>The normal is not unique</strong> — n, 2n and −n all describe the same plane; the equations x + y + z = 1 and 2x + 2y + 2z = 2 are the same surface.</li>
</ul>
<p class="meo">💡 Every "find the plane" problem is the same three steps: get two vectors lying in the plane, cross them for n, then plug in one known point for d. Then verify with a second point — it costs one line and catches a wrong normal immediately.</p>
<p class="pitfall">⚠️ Crossing the wrong vectors. AB × AC works because both lie <em>in</em> the plane; crossing the position vectors of A and B gives a normal to a plane through the origin instead. The other classic is forgetting d and writing x + y + z = 0, which is the parallel plane through the origin — geometrically a completely different surface.</p>`,
        `<p class="y-chinh">🎯 Mặt phẳng được xác định bởi một <strong>điểm thuộc nó</strong> và một <strong>vector pháp tuyến</strong> n = (a, b, c): n · (r − r₀) = 0, khai triển ra thành ax + by + cz = d.</p>
<ul>
<li><strong>Ý tưởng</strong> — điểm r nằm trên mặt phẳng đúng khi vector r − r₀ nằm trong mặt phẳng, mà một vector nằm trong mặt phẳng đúng khi nó vuông góc với n. Vậy việc thuộc hay không chỉ là một phép thử tích vô hướng.</li>
<li><strong>Từ dạng vector sang dạng vô hướng</strong> — khai triển n · (r − r₀) = 0 được a(x − x₀) + b(y − y₀) + c(z − z₀) = 0, tức ax + by + cz = d với <strong>d = ax₀ + by₀ + cz₀</strong>.</li>
<li><strong>Đọc một phương trình mặt phẳng</strong> — các hệ số <em>chính là</em> pháp tuyến. Từ 2x − y + 3z = 7 là đọc ngay ra n = (2, −1, 3), không phải tính gì cả.</li>
<li><strong>Ví dụ có giải, bước 1</strong> — tìm mặt phẳng qua A = (1, 0, 0), B = (0, 1, 0), C = (0, 0, 1). Trước hết dựng hai vector nằm trong nó: AB = B − A = (−1, 1, 0) và AC = C − A = (−1, 0, 1).</li>
<li><strong>Bước 2 — pháp tuyến</strong> — n = AB × AC = (1·1 − 0·0, 0·(−1) − (−1)·1, (−1)·0 − 1·(−1)) = <strong>(1, 1, 1)</strong>.</li>
<li><strong>Bước 3 — hằng số</strong> — dùng A: d = 1(1) + 1(0) + 1(0) = 1, vậy mặt phẳng là <strong>x + y + z = 1</strong>. Kiểm B: 0 + 1 + 0 = 1 ✓, và C: 0 + 0 + 1 = 1 ✓.</li>
<li><strong>Mặt phẳng song song và vuông góc</strong> — hai mặt phẳng song song khi hai pháp tuyến là bội của nhau; góc giữa hai mặt phẳng là góc giữa hai pháp tuyến, tính bằng tích vô hướng ở slide 6.</li>
<li><strong>Pháp tuyến không duy nhất</strong> — n, 2n và −n đều mô tả cùng một mặt phẳng; hai phương trình x + y + z = 1 và 2x + 2y + 2z = 2 là cùng một mặt.</li>
</ul>
<p class="meo">💡 Mọi bài "tìm mặt phẳng" đều gồm đúng ba bước: lấy hai vector nằm trong mặt phẳng, nhân có hướng ra n, rồi thay một điểm đã biết để ra d. Sau đó kiểm bằng điểm thứ hai — tốn một dòng mà bắt ngay được pháp tuyến sai.</p>
<p class="pitfall">⚠️ Nhân có hướng nhầm vector. AB × AC dùng được vì cả hai <em>nằm trong</em> mặt phẳng; nhân có hướng các vector vị trí của A và B lại cho pháp tuyến của một mặt phẳng đi qua gốc toạ độ. Lỗi kinh điển còn lại là quên d rồi viết x + y + z = 0, đó là mặt phẳng song song đi qua gốc — về hình học là một mặt hoàn toàn khác.</p>`],

      [14, 'Distance from a point to a plane',
        `<p class="y-chinh">🎯 For the plane ax + by + cz = d and the point Q = (x₁, y₁, z₁): D = |ax₁ + by₁ + cz₁ − d| / √(a² + b² + c²).</p>
<ul>
<li><strong>Where it comes from</strong> — take any point P₀ of the plane and project P₀Q onto the normal n. The length of that projection, |n · P₀Q| / ‖n‖, is the perpendicular distance, and expanding it gives exactly the formula above.</li>
<li><strong>Reading the pieces</strong> — the numerator is "plug Q into the left-hand side, then subtract d"; the denominator is ‖n‖ = √(a² + b² + c²). Nothing else is needed.</li>
<li><strong>Worked example, step 1</strong> — plane x + 2y + 2z = 9, point Q = (1, 1, 1). Here a = 1, b = 2, c = 2, d = 9.</li>
<li><strong>Step 2 — the numerator</strong> — 1(1) + 2(1) + 2(1) − 9 = 1 + 2 + 2 − 9 = −4, and the absolute value gives <strong>4</strong>.</li>
<li><strong>Step 3 — the denominator</strong> — ‖n‖ = √(1 + 4 + 4) = √9 = <strong>3</strong>.</li>
<li><strong>Step 4 — the answer</strong> — D = 4/3 ≈ <strong>1,333</strong>.</li>
<li><strong>What the sign before the absolute value meant</strong> — a negative value says Q sits on the opposite side of the plane from the direction n points. Drop it for a distance, keep it when a question asks which side a point is on.</li>
<li><strong>Distance between two parallel planes</strong> — same formula: pick any point of the first plane and measure it against the second. For x + y + z = 1 and x + y + z = 4, take (1, 0, 0): D = |1 − 4|/√3 = 3/√3 = √3 ≈ 1,732.</li>
</ul>
<p class="meo">💡 Check with a point you know is on the plane. For x + 2y + 2z = 9 take (9, 0, 0): the numerator is |9 − 9| = 0, so D = 0 ✓. If a point of the plane does not give you zero, the formula was copied wrong.</p>
<p class="pitfall">⚠️ Getting the constant onto the wrong side. The formula needs the plane written as ax + by + cz <strong>= d</strong> and then subtracts d; if the equation is handed to you as ax + by + cz + e = 0 then d = −e, and the numerator is |ax₁ + by₁ + cz₁ + e|. Two other traps: dropping the absolute value and reporting a negative distance, and forgetting to divide by ‖n‖ when the normal is not a unit vector.</p>`,
        `<p class="y-chinh">🎯 Với mặt phẳng ax + by + cz = d và điểm Q = (x₁, y₁, z₁): D = |ax₁ + by₁ + cz₁ − d| / √(a² + b² + c²).</p>
<ul>
<li><strong>Công thức từ đâu ra</strong> — lấy một điểm P₀ bất kỳ của mặt phẳng rồi chiếu P₀Q lên pháp tuyến n. Độ dài hình chiếu đó, |n · P₀Q| / ‖n‖, chính là khoảng cách vuông góc, và khai triển ra đúng bằng công thức trên.</li>
<li><strong>Đọc từng phần</strong> — tử số là "thay Q vào vế trái rồi trừ đi d"; mẫu số là ‖n‖ = √(a² + b² + c²). Không cần gì thêm.</li>
<li><strong>Ví dụ có giải, bước 1</strong> — mặt phẳng x + 2y + 2z = 9, điểm Q = (1, 1, 1). Ở đây a = 1, b = 2, c = 2, d = 9.</li>
<li><strong>Bước 2 — tử số</strong> — 1(1) + 2(1) + 2(1) − 9 = 1 + 2 + 2 − 9 = −4, lấy trị tuyệt đối được <strong>4</strong>.</li>
<li><strong>Bước 3 — mẫu số</strong> — ‖n‖ = √(1 + 4 + 4) = √9 = <strong>3</strong>.</li>
<li><strong>Bước 4 — đáp án</strong> — D = 4/3 ≈ <strong>1,333</strong>.</li>
<li><strong>Dấu trước khi lấy trị tuyệt đối có ý nghĩa gì</strong> — giá trị âm cho biết Q nằm ở phía ngược lại với hướng mà n chỉ tới. Hỏi khoảng cách thì bỏ dấu đi, hỏi điểm nằm phía nào thì giữ lại.</li>
<li><strong>Khoảng cách giữa hai mặt phẳng song song</strong> — vẫn công thức đó: lấy một điểm bất kỳ của mặt thứ nhất rồi đo tới mặt thứ hai. Với x + y + z = 1 và x + y + z = 4, lấy (1, 0, 0): D = |1 − 4|/√3 = 3/√3 = √3 ≈ 1,732.</li>
</ul>
<p class="meo">💡 Hãy kiểm bằng một điểm chắc chắn thuộc mặt phẳng. Với x + 2y + 2z = 9 lấy (9, 0, 0): tử số là |9 − 9| = 0, nên D = 0 ✓. Điểm thuộc mặt phẳng mà không cho ra số 0 nghĩa là bạn chép sai công thức.</p>
<p class="pitfall">⚠️ Chuyển hằng số sai vế. Công thức đòi mặt phẳng phải viết dạng ax + by + cz <strong>= d</strong> rồi mới trừ d; nếu đề cho dạng ax + by + cz + e = 0 thì d = −e, và tử số là |ax₁ + by₁ + cz₁ + e|. Hai bẫy nữa: bỏ quên trị tuyệt đối rồi trả lời khoảng cách âm, và quên chia cho ‖n‖ khi pháp tuyến không phải vector đơn vị.</p>`],

      [15, 'Scalar triple product and volume',
        `<p class="y-chinh">🎯 The scalar triple product u · (v × w) is a <strong>number</strong>, and its absolute value is the <strong>volume</strong> of the parallelepiped built on u, v and w.</p>
<ul>
<li><strong>The determinant form</strong> — u · (v × w) is the 3×3 determinant whose rows are the coordinates of u, v and w in that order. One determinant replaces a cross product followed by a dot product.</li>
<li><strong>Why it is a volume</strong> — ‖v × w‖ is the area of the base parallelogram, and the dot with u picks out the component of u perpendicular to that base, which is the height. Area times height is volume.</li>
<li><strong>Worked example, step 1</strong> — u = (1, 2, 3), v = (0, 1, 4), w = (5, 6, 0). Expand along the first row: 1·(1·0 − 4·6) − 2·(0·0 − 4·5) + 3·(0·6 − 1·5).</li>
<li><strong>Step 2 — the three terms</strong> — 1·(0 − 24) = −24; −2·(0 − 20) = +40; 3·(0 − 5) = −15.</li>
<li><strong>Step 3 — the answer</strong> — −24 + 40 − 15 = <strong>1</strong>, so the volume of the parallelepiped is |1| = <strong>1</strong>.</li>
<li><strong>The coplanarity test</strong> — u, v, w lie in one plane if and only if u · (v × w) = 0, because a flat box has zero volume. Example: (1, 0, 0) · [(0, 1, 0) × (1, 1, 0)] = (1, 0, 0) · (0, 0, −1) = 0, and indeed all three vectors lie in the xy-plane.</li>
<li><strong>Cyclic symmetry</strong> — u · (v × w) = v · (w × u) = w · (u × v): rotating the three vectors leaves the value alone. Swapping any two of them flips the sign, exactly as swapping two rows flips a determinant.</li>
<li><strong>What the sign means</strong> — positive means u, v, w form a right-handed triple, negative means left-handed. Volume never cares, but orientation does, which is the link to det(A) on the next slide.</li>
<li><strong>Volume of a tetrahedron</strong> — one sixth of the box: V = (1/6)|u · (v × w)|, just as a triangle was half a parallelogram.</li>
</ul>
<p class="meo">💡 Compute it as one determinant, not as a cross product followed by a dot product. It is fewer operations, fewer chances to drop a sign, and the row-swap rule then gives you the cyclic property for free.</p>
<p class="pitfall">⚠️ Reporting a negative volume. The triple product may come out as −1, but the volume is |−1| = 1. The other trap is bracket order: u · (v × w) is the only reading that parses, since (u · v) × w would ask you to cross a number with a vector — and the 1/6 for a tetrahedron is dropped at least as often as the ½ for a triangle.</p>`,
        `<p class="y-chinh">🎯 Tích hỗn tạp u · (v × w) là một <strong>số</strong>, và trị tuyệt đối của nó là <strong>thể tích</strong> hình hộp dựng trên u, v và w.</p>
<ul>
<li><strong>Dạng định thức</strong> — u · (v × w) chính là định thức 3×3 có các hàng lần lượt là toạ độ của u, v và w theo đúng thứ tự đó. Một định thức thay cho cả một tích có hướng rồi một tích vô hướng.</li>
<li><strong>Vì sao nó là thể tích</strong> — ‖v × w‖ là diện tích mặt đáy hình bình hành, còn nhân vô hướng với u thì rút ra thành phần của u vuông góc với đáy, tức chiều cao. Diện tích nhân chiều cao là thể tích.</li>
<li><strong>Ví dụ có giải, bước 1</strong> — u = (1, 2, 3), v = (0, 1, 4), w = (5, 6, 0). Khai triển theo hàng đầu: 1·(1·0 − 4·6) − 2·(0·0 − 4·5) + 3·(0·6 − 1·5).</li>
<li><strong>Bước 2 — ba số hạng</strong> — 1·(0 − 24) = −24; −2·(0 − 20) = +40; 3·(0 − 5) = −15.</li>
<li><strong>Bước 3 — đáp án</strong> — −24 + 40 − 15 = <strong>1</strong>, nên thể tích hình hộp là |1| = <strong>1</strong>.</li>
<li><strong>Phép thử đồng phẳng</strong> — u, v, w cùng nằm trên một mặt phẳng khi và chỉ khi u · (v × w) = 0, vì cái hộp bẹt thì thể tích bằng 0. Ví dụ: (1, 0, 0) · [(0, 1, 0) × (1, 1, 0)] = (1, 0, 0) · (0, 0, −1) = 0, và quả thật cả ba vector đều nằm trong mặt phẳng xy.</li>
<li><strong>Đối xứng vòng</strong> — u · (v × w) = v · (w × u) = w · (u × v): xoay vòng ba vector thì giá trị không đổi. Đổi chỗ hai vector bất kỳ thì đổi dấu, y như đổi chỗ hai hàng của định thức.</li>
<li><strong>Dấu có ý nghĩa gì</strong> — dương nghĩa là u, v, w lập thành bộ ba thuận tay phải, âm nghĩa là thuận tay trái. Thể tích thì không quan tâm, nhưng định hướng thì có, và đó là cầu nối sang det(A) ở slide sau.</li>
<li><strong>Thể tích tứ diện</strong> — bằng một phần sáu hình hộp: V = (1/6)|u · (v × w)|, đúng như tam giác là một nửa hình bình hành.</li>
</ul>
<p class="meo">💡 Hãy tính bằng một định thức chứ đừng tính tích có hướng rồi mới tích vô hướng. Ít phép hơn, ít cơ hội rơi dấu hơn, và quy tắc đổi chỗ hàng khi đó tặng luôn cho bạn tính chất đối xứng vòng.</p>
<p class="pitfall">⚠️ Trả lời thể tích âm. Tích hỗn tạp có thể ra −1, nhưng thể tích là |−1| = 1. Bẫy còn lại là thứ tự ngoặc: u · (v × w) là cách đọc duy nhất có nghĩa, vì (u · v) × w sẽ bắt bạn nhân có hướng một số với một vector — và hệ số 1/6 của tứ diện bị quên ít nhất cũng thường như hệ số ½ của tam giác.</p>`],

      [16, 'Linear transformations in R³',
        `<p class="y-chinh">🎯 A linear transformation T : R³ → R³ is nothing but multiplication by a matrix: T(v) = Av.</p>
<ul>
<li><strong>What "linear" means</strong> — T(u + v) = T(u) + T(v) and T(cv) = cT(v). Every map obeying those two rules can be written as a matrix, and every matrix defines such a map.</li>
<li><strong>How to build the matrix</strong> — apply T to i, j and k; the three results are the three <em>columns</em> of A. That recipe turns a geometric description into numbers in one step.</li>
<li><strong>Rotation about the z-axis by θ</strong> — A = [cos θ, −sin θ, 0; sin θ, cos θ, 0; 0, 0, 1]. With θ = 90°: cos = 0 and sin = 1, so (1, 0, 0) is sent to (0, 1, 0) — the x-axis swings onto the y-axis, as it should.</li>
<li><strong>Reflection in the xy-plane</strong> — A = diag(1, 1, −1), which sends (x, y, z) to (x, y, −z). Example: (2, 3, 5) becomes (2, 3, −5).</li>
<li><strong>Projection onto the xy-plane</strong> — A = diag(1, 1, 0), sending (x, y, z) to (x, y, 0). Example: (2, 3, 5) becomes (2, 3, 0), and the z-information is gone for good.</li>
<li><strong>det(A) is the volume factor</strong> — a solid of volume V is mapped to one of volume |det(A)|·V. Rotation has det = 1 (rigid, volume preserved), reflection has det = −1 (volume preserved, orientation flipped), projection has det = 0 (the solid is crushed flat), and scaling by k has det = k³.</li>
<li><strong>The sign of the determinant is orientation</strong> — negative means a right-handed triple comes out left-handed, which is exactly the mirror effect. This is the same sign that appeared in the triple product on slide 15.</li>
<li><strong>Composition is matrix multiplication</strong> — doing S after T is the matrix BA, applied in right-to-left order. Because matrix product is not commutative, rotate-then-reflect is generally a different map from reflect-then-rotate.</li>
</ul>
<p class="meo">💡 Read det(A) before doing anything else. det = 0 means the transformation is not invertible and information was destroyed; det ≠ 0 means the map can be undone with A⁻¹, and |det| tells you by how much volume was stretched.</p>
<p class="pitfall">⚠️ Building A from rows instead of columns — T(i), T(j), T(k) are the <em>columns</em>, and using rows silently transposes the matrix, which turns a rotation by θ into a rotation by −θ. The other trap is composing in the wrong order: in BAv the matrix A acts first, so "first rotate, then reflect" is written R·(rotation) with the reflection on the left.</p>`,
        `<p class="y-chinh">🎯 Biến đổi tuyến tính T : R³ → R³ chẳng qua là phép nhân với một ma trận: T(v) = Av.</p>
<ul>
<li><strong>"Tuyến tính" nghĩa là gì</strong> — T(u + v) = T(u) + T(v) và T(cv) = cT(v). Mọi ánh xạ tuân theo hai quy tắc đó đều viết được thành ma trận, và mọi ma trận đều định nghĩa một ánh xạ như vậy.</li>
<li><strong>Dựng ma trận thế nào</strong> — áp T lên i, j và k; ba kết quả chính là ba <em>cột</em> của A. Công thức đó biến một mô tả hình học thành các con số chỉ trong một bước.</li>
<li><strong>Quay quanh trục z góc θ</strong> — A = [cos θ, −sin θ, 0; sin θ, cos θ, 0; 0, 0, 1]. Với θ = 90°: cos = 0 và sin = 1, nên (1, 0, 0) được đưa tới (0, 1, 0) — trục x quét sang trục y, đúng như phải thế.</li>
<li><strong>Đối xứng qua mặt phẳng xy</strong> — A = diag(1, 1, −1), đưa (x, y, z) thành (x, y, −z). Ví dụ: (2, 3, 5) thành (2, 3, −5).</li>
<li><strong>Chiếu xuống mặt phẳng xy</strong> — A = diag(1, 1, 0), đưa (x, y, z) thành (x, y, 0). Ví dụ: (2, 3, 5) thành (2, 3, 0), và thông tin về z mất hẳn.</li>
<li><strong>det(A) là hệ số thể tích</strong> — một khối có thể tích V được đưa thành khối có thể tích |det(A)|·V. Phép quay có det = 1 (cứng, giữ nguyên thể tích), phép đối xứng có det = −1 (giữ thể tích nhưng lật định hướng), phép chiếu có det = 0 (khối bị bẹp dí), còn co giãn hệ số k có det = k³.</li>
<li><strong>Dấu của định thức là định hướng</strong> — âm nghĩa là bộ ba thuận tay phải biến thành thuận tay trái, đúng hiệu ứng soi gương. Đây chính là cái dấu đã xuất hiện ở tích hỗn tạp slide 15.</li>
<li><strong>Ghép biến đổi là nhân ma trận</strong> — làm S sau T tương ứng với ma trận BA, tác dụng theo thứ tự từ phải sang trái. Vì tích ma trận không giao hoán nên quay rồi đối xứng nói chung khác với đối xứng rồi quay.</li>
</ul>
<p class="meo">💡 Hãy đọc det(A) trước khi làm bất cứ điều gì khác. det = 0 nghĩa là biến đổi không nghịch đảo được và thông tin đã bị huỷ; det ≠ 0 nghĩa là có thể hoàn tác bằng A⁻¹, và |det| cho biết thể tích đã bị kéo giãn bao nhiêu lần.</p>
<p class="pitfall">⚠️ Dựng A theo hàng thay vì theo cột — T(i), T(j), T(k) là các <em>cột</em>, dùng nhầm thành hàng sẽ âm thầm chuyển vị ma trận, biến phép quay góc θ thành phép quay góc −θ. Bẫy còn lại là ghép sai thứ tự: trong BAv thì A tác dụng trước, nên "quay trước rồi đối xứng" phải viết với ma trận đối xứng đứng bên trái.</p>`],

      [17, 'Computer graphics application and chapter summary',
        `<p class="y-chinh">🎯 3D graphics uses <strong>homogeneous coordinates</strong> (x, y, z, 1) so that rotation, translation and scaling all become one 4×4 matrix multiplication.</p>
<ul>
<li><strong>The problem homogeneous coordinates solve</strong> — rotation and scaling are linear and fit into a 3×3 matrix, but translation (adding a constant) is not linear, so it cannot. Adding a fourth coordinate fixed at 1 turns translation into a matrix too.</li>
<li><strong>The translation matrix</strong> — the 4×4 matrix with 1s on the diagonal and (a, b, c) in the last column sends (x, y, z, 1) to (x + a, y + b, z + c, 1). Translation is now just another multiplication.</li>
<li><strong>Composing a scene</strong> — an object is scaled, rotated and moved by multiplying its 4×4 matrices together once; every vertex of the model is then transformed by that single product. This is why a graphics card does nothing but matrix multiplications all day.</li>
<li><strong>Order still matters</strong> — rotate-then-translate places an object somewhere quite different from translate-then-rotate, because matrix multiplication is not commutative. Read the chain right to left.</li>
<li><strong>Where the rest of the chapter shows up</strong> — the cross product gives each surface its normal vector, the dot product of that normal with the direction of the light gives the brightness of the face, and the sign of the dot product decides whether a face is turned away from the camera and can be skipped.</li>
<li><strong>Summary 1 — vectors</strong> — coordinates, length ‖v‖ = √(x² + y² + z²), and the dot product, which yields the angle through cos θ = (u · v)/(‖u‖‖v‖) and the orthogonality test u · v = 0.</li>
<li><strong>Summary 2 — cross product</strong> — it returns a vector perpendicular to both inputs, its length is a parallelogram area (half of it is a triangle), and it supplies the normal vector needed for plane equations and for both distance formulas.</li>
<li><strong>Summary 3 — triple product and transformations</strong> — |u · (v × w)| is a volume and zero means coplanar; T(v) = Av describes rotation, reflection and projection, with det(A) as the volume factor and its sign as the orientation.</li>
</ul>
<p class="meo">💡 One decision tree for the whole chapter: need a <strong>number</strong> (angle, length, distance, work) reach for the dot product; need a <strong>vector</strong> (normal, area, orientation) reach for the cross product; need a <strong>volume</strong> or a coplanarity test reach for the triple product.</p>
<p class="pitfall">⚠️ The three marks lost most often in Chapter 8: swapping the order in a cross product (u × v = −(v × u), while u · v = v · u is safe), forgetting the ½ for a triangle or the 1/6 for a tetrahedron, and dividing by the wrong norm in a distance formula — it is ‖d‖ for a line and ‖n‖ for a plane, never the length of the vector running to the point.</p>`,
        `<p class="y-chinh">🎯 Đồ hoạ 3D dùng <strong>toạ độ thuần nhất</strong> (x, y, z, 1) để phép quay, tịnh tiến và co giãn đều trở thành một phép nhân ma trận 4×4.</p>
<ul>
<li><strong>Toạ độ thuần nhất giải quyết vấn đề gì</strong> — quay và co giãn là tuyến tính nên nhét vừa ma trận 3×3, nhưng tịnh tiến (cộng thêm hằng số) thì không tuyến tính nên không nhét được. Thêm một toạ độ thứ tư cố định bằng 1 là tịnh tiến cũng thành ma trận.</li>
<li><strong>Ma trận tịnh tiến</strong> — ma trận 4×4 có các số 1 trên đường chéo và (a, b, c) ở cột cuối sẽ đưa (x, y, z, 1) thành (x + a, y + b, z + c, 1). Tịnh tiến giờ chỉ là một phép nhân như mọi phép khác.</li>
<li><strong>Ghép một cảnh</strong> — một vật được co giãn, quay và dời chỗ bằng cách nhân các ma trận 4×4 của nó lại một lần; sau đó mọi đỉnh của mô hình đều biến đổi qua đúng cái tích ấy. Đó là lý do card đồ hoạ suốt ngày chỉ làm mỗi việc nhân ma trận.</li>
<li><strong>Thứ tự vẫn quan trọng</strong> — quay rồi tịnh tiến đặt vật vào chỗ khác hẳn so với tịnh tiến rồi quay, vì tích ma trận không giao hoán. Hãy đọc chuỗi từ phải sang trái.</li>
<li><strong>Phần còn lại của chương xuất hiện ở đâu</strong> — tích có hướng cho mỗi mặt một vector pháp tuyến, tích vô hướng của pháp tuyến đó với hướng nguồn sáng cho độ sáng của mặt, và dấu của tích vô hướng quyết định mặt có quay lưng vào camera để bỏ qua hay không.</li>
<li><strong>Tổng kết 1 — vector</strong> — toạ độ, độ dài ‖v‖ = √(x² + y² + z²), và tích vô hướng, thứ cho ra góc qua cos θ = (u · v)/(‖u‖‖v‖) cùng phép thử vuông góc u · v = 0.</li>
<li><strong>Tổng kết 2 — tích có hướng</strong> — nó trả về vector vuông góc với cả hai vector đầu vào, độ dài của nó là diện tích hình bình hành (một nửa là tam giác), và nó cấp vector pháp tuyến cần cho phương trình mặt phẳng lẫn cho cả hai công thức khoảng cách.</li>
<li><strong>Tổng kết 3 — tích hỗn tạp và biến đổi</strong> — |u · (v × w)| là thể tích và bằng 0 nghĩa là đồng phẳng; T(v) = Av mô tả phép quay, đối xứng và chiếu, với det(A) là hệ số thể tích còn dấu của nó là định hướng.</li>
</ul>
<p class="meo">💡 Một cây quyết định cho cả chương: cần một <strong>con số</strong> (góc, độ dài, khoảng cách, công) thì dùng tích vô hướng; cần một <strong>vector</strong> (pháp tuyến, diện tích, định hướng) thì dùng tích có hướng; cần một <strong>thể tích</strong> hay phép thử đồng phẳng thì dùng tích hỗn tạp.</p>
<p class="pitfall">⚠️ Ba điểm mất nhiều nhất ở Chương 8: đảo thứ tự trong tích có hướng (u × v = −(v × u), trong khi u · v = v · u thì vô hại), quên ½ của tam giác hay 1/6 của tứ diện, và chia nhầm norm trong công thức khoảng cách — là ‖d‖ với đường thẳng và ‖n‖ với mặt phẳng, không bao giờ là độ dài của vector chạy tới điểm.</p>`],
    ]),
  ].join('\n'),
};
