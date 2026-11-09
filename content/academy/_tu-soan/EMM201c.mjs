// Khoá TỰ SOẠN cho EMM201c — trường chưa công bố syllabus trên FLM (dò 09/11/2026). Soạn theo _HOP-DONG-TU-SOAN.md.
// Khung bám thứ tự giáo trình chuẩn: Hibbeler "Engineering Mechanics: Statics" & "Dynamics" (14e, Pearson),
// Beer–Johnston–DeWolf–Mazurek "Mechanics of Materials" (8e, McGraw-Hill) và Budynas–Nisbett
// "Shigley's Mechanical Engineering Design" (11e, McGraw-Hill). Đơn vị SI xuyên suốt.
// Mọi ví dụ số đã kiểm bằng python3 (numpy/sympy). Mọi link ngoài đã mở thử (HTTP 200 + tiêu đề đúng chủ đề).
// Hình vẽ lực mô tả bằng chữ/bảng (không ảnh tự vẽ).
// ⚠️ File này KHÔNG dùng chuỗi nội suy (dấu đô-la + ngoặc nhọn) và không backtick lồng; nội dung ghép bằng toán tử +.

const bi = (en, vi) => '<div class="ml-en">' + en + '</div>\n<div class="ml-vi">' + vi + '</div>';
const L = (slug, title, description, en, vi) => ({ title, slug, type: 'DOCUMENT', description, content: bi(en, vi) });
const Q = (id, question, options, correctIndex, explanation) => ({ id, question, options, correctIndex, points: 1, explanation });
// Xoay vòng thứ tự lựa chọn theo một hoán vị cố định để đáp án đúng không luôn ở cùng vị trí (correctIndex tính lại).
const XOAY = (q, k) => {
  const n = q.options.length, s = (k * 3 + 1) % n;
  return { ...q, options: q.options.map((_, i) => q.options[(i + s) % n]), correctIndex: (q.correctIndex - s + n) % n };
};
const QZ = (ch, title, description, questions) => ({
  title, slug: 'emm201c-ts-quiz-' + ch, type: 'QUIZ', description,
  quiz: { timeLimitSeconds: 900, questions: questions.map((q, i) => XOAY(q, ch + i)) },
});
const A = (href, text) => '<a href="' + href + '" target="_blank" rel="noopener">' + text + '</a>';
const UL = (items) => '<ul>' + items.map((x) => '<li>' + x + '</li>').join('') + '</ul>';

// Link dùng nhiều lần (đều đã kiểm 09/11/2026)
const OCW_MOM = 'https://ocw.mit.edu/courses/2-001-mechanics-materials-i-fall-2006/';
const OCW_DYN = 'https://ocw.mit.edu/courses/2-003sc-engineering-dynamics-fall-2011/';
const OCW_MD = 'https://ocw.mit.edu/courses/2-72-elements-of-mechanical-design-spring-2009/';
const ES = 'https://engineeringstatics.org/';
const OSP = 'https://openstax.org/books/university-physics-volume-1/pages/';
const DP = 'https://www.doitpoms.ac.uk/tlplib/';
const WK = 'https://en.wikipedia.org/wiki/';

// ───────────────────────────── Mục 0 ─────────────────────────────
const m01 = L('emm201c-ts-0-1',
  '0.1 — Welcome to EMM201c: what engineering mechanics and machine elements are for|||0.1 — Giới thiệu EMM201c: Cơ học kỹ thuật & Chi tiết máy học gì, để làm gì',
  'Môn học gì, dùng vào đâu (ô tô, robot, đồ án), 8 chuẩn đầu ra tự soạn, môn liên quan, cảnh báo: trường chưa công bố syllabus trên FLM.',
  `<span class="eyebrow">EMM201c · Section 0 · Lesson 0.1</span>
<h2>Welcome to Engineering Mechanics and Machine Elements</h2>
<p class="lead">Every car, robot arm, gearbox and suspension is a set of parts that carry <strong>forces</strong>, <strong>move</strong>, <strong>deform</strong> and sometimes <strong>break</strong>. This course gives you the tools to predict all four — and to size real machine parts (bolts, shafts, bearings, gears, belts, springs) so that they do not fail.</p>
<div class="callout"><p>⚠️ <strong>Important.</strong> FPT University has <strong>not published the EMM201c syllabus on FLM</strong> (we searched the code, its variants and the course name on 09/11/2026). This course framework is therefore <strong>self-authored</strong>, following the chapter order of the international standard textbooks (Hibbeler <em>Statics</em> &amp; <em>Dynamics</em>, Beer &amp; Johnston <em>Mechanics of Materials</em>, Shigley's <em>Mechanical Engineering Design</em>). <strong>Grading weights, assessment format and exam dates are decided by your lecturer</strong> — always follow the course outline your lecturer gives in class.</p></div>
<h3>What is this course about?</h3>
<p>The course has four layers, each built on the previous one:</p>
<ol>
<li><strong>Statics</strong> — bodies at rest. Two vector equations, ΣF = 0 and ΣM = 0, let you find the support reactions of a beam, the forces in a truss, the grip of a pair of pliers, or whether a box slides or tips.</li>
<li><strong>Strength of materials</strong> — what the forces do <em>inside</em> a part: stress (force per area, in MPa) and strain (relative deformation). You learn axial loading, torsion of shafts, bending of beams, combined stresses, failure theories and fatigue.</li>
<li><strong>Dynamics</strong> — bodies in motion: kinematics (position, velocity, acceleration, rotation, gear ratios) and kinetics (F = ma, work–energy, power, impulse–momentum).</li>
<li><strong>Machine elements</strong> — the standard parts of every machine: bolted and welded joints, keys, shafts, rolling bearings, spur gears, belts and chains, helical springs — each with a simple, standard design calculation and a <strong>factor of safety</strong>.</li>
</ol>
<h3>Why does an automotive / robotics student need it?</h3>
<ul>
<li><strong>Automotive:</strong> braking distance and tyre friction, wheel loads on axles, suspension springs, drive shafts transmitting engine torque, gearbox ratios, wheel bearings, bolts that hold the wheel on.</li>
<li><strong>Robotics:</strong> a robot arm is a chain of links — statics gives the motor torque needed to hold a payload; dynamics gives the torque to accelerate it; strength of materials sizes the links; machine elements choose the gearbox, belts, bearings and couplings.</li>
<li><strong>Projects and capstones:</strong> any physical prototype (a line-following car, a gripper, a 3D-printer frame) needs a free-body diagram and a quick safety-factor check before you order parts.</li>
</ul>
<h3>Learning outcomes (self-authored)</h3>
<p>After this course you should be able to:</p>
<ol>
<li>Work in SI units, resolve forces into components and add them as vectors in 2D and 3D.</li>
<li>Draw correct free-body diagrams and solve particle and rigid-body equilibrium problems (ΣF = 0, ΣM = 0), including moments, couples and distributed loads.</li>
<li>Analyse simple trusses (joints, sections), frames and machines; solve dry-friction, wedge, screw and belt-friction problems.</li>
<li>Compute centroids and area moments of inertia of composite sections.</li>
<li>Calculate stress, strain and deformation for axial loading, torsion and bending; draw shear-force and bending-moment diagrams; estimate beam deflection and column buckling load.</li>
<li>Combine stresses, find principal stresses, apply the von Mises / Tresca criteria and a basic fatigue (Goodman) check; choose a factor of safety and a material.</li>
<li>Solve basic kinematics and kinetics problems for particles and rotating bodies (F = ma, work–energy, power, efficiency, impulse–momentum).</li>
<li>Perform first-pass design calculations for bolted and welded joints, keys, shafts, rolling bearings, spur gears, belts/chains and helical springs.</li>
</ol>
<h3>Related courses</h3>
<p>Background needed: high-school algebra, trigonometry and physics (vectors, Newton's laws), plus first-year calculus (derivatives and integrals appear in kinematics and centroids). What comes next depends on your programme, but the content of this course is the base of later courses in <strong>mechanical design / CAD</strong>, <strong>vehicle dynamics</strong>, <strong>robot kinematics and dynamics</strong> and <strong>mechatronics projects</strong>. Check the curriculum map of your own programme on FLM for the exact course codes.</p>
<h3>How to study this course</h3>
<ul>
<li>Every lesson has objectives, a lecture with step-by-step worked examples (all numbers checked with Python), common mistakes, a 📌 summary, 🔗 further learning and 🧪 practice with answers. Each chapter ends with a quiz.</li>
<li><strong>Always draw the free-body diagram first</strong> — on paper, every time. Most wrong answers in mechanics come from a missing or wrongly-directed force, not from the algebra.</li>
<li>Carry units through every line (N, m, N·m, MPa = N/mm<sup>2</sup>). A unit check catches most slips.</li>
<li>Diagrams in this course are described in words and tables: sketch them yourself as you read — this is part of the learning.</li>
</ul>`,
  `<span class="eyebrow">EMM201c · Mục 0 · Bài 0.1</span>
<h2>Chào mừng đến với Cơ học kỹ thuật &amp; Chi tiết máy</h2>
<p class="lead">Mỗi chiếc ô tô, cánh tay robot, hộp số hay hệ treo đều là một tập hợp chi tiết <strong>chịu lực</strong>, <strong>chuyển động</strong>, <strong>biến dạng</strong> và đôi khi <strong>gãy hỏng</strong>. Môn này cho bạn công cụ để dự đoán cả bốn điều đó — và để tính chọn các chi tiết máy thật (bulông, trục, ổ lăn, bánh răng, đai, lò xo) sao cho chúng không hỏng.</p>
<div class="callout"><p>⚠️ <strong>Quan trọng.</strong> Trường ĐH FPT <strong>chưa công bố syllabus của EMM201c trên FLM</strong> (đã dò mã môn, các mã biến thể và tên môn ngày 09/11/2026). Vì vậy khung môn này là <strong>khung tự soạn</strong>, theo thứ tự chương của các giáo trình chuẩn quốc tế (Hibbeler <em>Statics</em> &amp; <em>Dynamics</em>, Beer &amp; Johnston <em>Mechanics of Materials</em>, Shigley <em>Mechanical Engineering Design</em>). <strong>Cách tính điểm, hình thức đánh giá và lịch thi do giảng viên quyết định</strong> — luôn theo đề cương giảng viên phát trên lớp.</p></div>
<h3>Môn này học gì?</h3>
<p>Môn gồm bốn tầng, tầng sau xây trên tầng trước:</p>
<ol>
<li><strong>Tĩnh học</strong> — vật đứng yên. Hai phương trình vector ΣF = 0 và ΣM = 0 cho phép tìm phản lực gối của dầm, nội lực trong giàn, lực kẹp của cái kìm, hay biết thùng hàng sẽ trượt hay lật.</li>
<li><strong>Sức bền vật liệu</strong> — lực gây ra gì <em>bên trong</em> chi tiết: ứng suất (lực trên diện tích, đơn vị MPa) và biến dạng (độ dãn tương đối). Bạn học kéo–nén, xoắn trục, uốn dầm, ứng suất tổ hợp, thuyết bền và mỏi.</li>
<li><strong>Động lực học</strong> — vật chuyển động: động học (vị trí, vận tốc, gia tốc, chuyển động quay, tỉ số truyền) và động lực học (F = ma, công–năng lượng, công suất, xung lượng–động lượng).</li>
<li><strong>Chi tiết máy</strong> — các chi tiết tiêu chuẩn của mọi cỗ máy: mối ghép bulông và mối hàn, then, trục, ổ lăn, bánh răng trụ răng thẳng, đai và xích, lò xo xoắn — mỗi loại có một phép tính thiết kế đơn giản, chuẩn mực và một <strong>hệ số an toàn</strong>.</li>
</ol>
<h3>Vì sao sinh viên ô tô / robot cần môn này?</h3>
<ul>
<li><strong>Ô tô:</strong> quãng đường phanh và ma sát lốp, tải lên cầu xe, lò xo giảm xóc, trục các-đăng truyền mômen động cơ, tỉ số hộp số, ổ bi bánh xe, bulông giữ bánh xe.</li>
<li><strong>Robot:</strong> cánh tay robot là một chuỗi khâu — tĩnh học cho mômen động cơ cần để giữ tải; động lực học cho mômen để tăng tốc tải; sức bền vật liệu tính kích thước khâu; chi tiết máy chọn hộp giảm tốc, đai, ổ lăn, khớp nối.</li>
<li><strong>Đồ án:</strong> mọi mẫu thử vật lý (xe dò line, tay gắp, khung máy in 3D) đều cần một sơ đồ vật tự do và một phép kiểm hệ số an toàn nhanh trước khi đặt mua linh kiện.</li>
</ul>
<h3>Chuẩn đầu ra (tự soạn)</h3>
<p>Học xong môn, bạn có thể:</p>
<ol>
<li>Làm việc với đơn vị SI, phân tích lực thành thành phần và cộng lực như vector trong 2D và 3D.</li>
<li>Vẽ đúng sơ đồ vật tự do và giải bài toán cân bằng chất điểm, vật rắn (ΣF = 0, ΣM = 0), kể cả mômen, ngẫu lực và tải phân bố.</li>
<li>Phân tích giàn đơn giản (tách nút, mặt cắt), khung và cơ cấu; giải bài toán ma sát khô, nêm, vít và ma sát đai.</li>
<li>Tính trọng tâm và mômen quán tính diện tích của mặt cắt ghép.</li>
<li>Tính ứng suất, biến dạng, chuyển vị khi kéo–nén, xoắn và uốn; vẽ biểu đồ lực cắt và mômen uốn; ước lượng độ võng dầm và lực tới hạn ổn định của cột.</li>
<li>Tổ hợp ứng suất, tìm ứng suất chính, áp dụng thuyết bền von Mises / Tresca và kiểm tra mỏi cơ bản (Goodman); chọn hệ số an toàn và vật liệu.</li>
<li>Giải bài toán động học, động lực học cơ bản cho chất điểm và vật quay (F = ma, công–năng lượng, công suất, hiệu suất, xung lượng–động lượng).</li>
<li>Thực hiện tính toán thiết kế sơ bộ cho mối ghép bulông, mối hàn, then, trục, ổ lăn, bánh răng trụ, đai/xích và lò xo xoắn.</li>
</ol>
<h3>Môn liên quan</h3>
<p>Nền cần có: đại số, lượng giác và vật lý phổ thông (vector, định luật Newton), cộng giải tích năm nhất (đạo hàm và tích phân xuất hiện trong động học và trọng tâm). Môn học tiếp tuỳ chương trình của bạn, nhưng nội dung môn này là nền của các môn sau về <strong>thiết kế cơ khí / CAD</strong>, <strong>động lực học ô tô</strong>, <strong>động học và động lực học robot</strong> và <strong>đồ án cơ điện tử</strong>. Xem bản đồ chương trình của ngành bạn trên FLM để biết mã môn chính xác.</p>
<h3>Cách học môn này</h3>
<ul>
<li>Mỗi bài có mục tiêu, bài giảng với ví dụ giải từng bước (mọi con số đã kiểm bằng Python), lỗi hay gặp, 📌 tóm tắt, 🔗 học thêm và 🧪 tự luyện có đáp án. Cuối mỗi chương có quiz.</li>
<li><strong>Luôn vẽ sơ đồ vật tự do trước</strong> — ra giấy, mọi lần. Đa số đáp án sai trong cơ học đến từ một lực bị thiếu hoặc sai chiều, không phải từ phép tính.</li>
<li>Mang đơn vị theo từng dòng tính (N, m, N·m, MPa = N/mm<sup>2</sup>). Kiểm tra đơn vị bắt được phần lớn lỗi.</li>
<li>Hình vẽ trong môn được mô tả bằng chữ và bảng: hãy tự phác hình khi đọc — đó là một phần của việc học.</li>
</ul>`);

const m02 = L('emm201c-ts-0-2',
  '0.2 — Textbooks and learning resources|||0.2 — Giáo trình và tài liệu học tập',
  'Bốn giáo trình chuẩn (Hibbeler Statics/Dynamics, Beer–Johnston Mechanics of Materials, Shigley) kèm ISBN, khoá mở MIT OCW, sách mở Engineering Statics, OpenStax, DoITPoMS.',
  `<span class="eyebrow">EMM201c · Section 0 · Lesson 0.2</span>
<h2>Textbooks and learning resources</h2>
<p class="lead">You do not need every book below. Pick <strong>one statics/dynamics text</strong>, <strong>one mechanics-of-materials text</strong> and <strong>Shigley</strong> for machine elements — and use the free resources for extra explanations and practice.</p>
<h3>Standard textbooks</h3>
<table>
<tr><th>Book</th><th>Publisher · year · edition</th><th>ISBN (US print)</th><th>Used for</th></tr>
<tr><td>R. C. Hibbeler — <em>Engineering Mechanics: Statics</em></td><td>Pearson · 2016 · 14th ed.</td><td>978-0-13-391892-0</td><td>Chapters 1–4</td></tr>
<tr><td>R. C. Hibbeler — <em>Engineering Mechanics: Dynamics</em></td><td>Pearson · 2016 · 14th ed.</td><td>978-0-13-391538-9</td><td>Chapters 8–9</td></tr>
<tr><td>F. P. Beer, E. R. Johnston, J. T. DeWolf, D. F. Mazurek — <em>Mechanics of Materials</em></td><td>McGraw-Hill · 2020 · 8th ed.</td><td>978-1-260-11327-3</td><td>Chapters 5–7</td></tr>
<tr><td>R. G. Budynas, J. K. Nisbett — <em>Shigley's Mechanical Engineering Design</em></td><td>McGraw-Hill · 2020 · 11th ed.</td><td>978-0-07-339821-1</td><td>Chapters 7, 10–11</td></tr>
</table>
<p>Notes: Pearson and McGraw-Hill also sell <strong>SI-unit international editions</strong> with different ISBNs (for example Shigley 11e in SI units) — the content and chapter order are the same. Older editions (Hibbeler 12e–13e, Beer 7e, Shigley 9e–10e) are perfectly usable for this course; only problem numbers change.</p>
<h3>Free, high-quality resources</h3>` + UL([
    A(ES, 'Engineering Statics: Open and Interactive') + ' (Baker &amp; Haynes) — a free, complete statics textbook with interactive diagrams; follows the same order as Hibbeler.',
    A(OCW_MOM, 'MIT OpenCourseWare 2.001 — Mechanics &amp; Materials I') + ' — lecture notes and problem sets on equilibrium, stress, strain, torsion and bending.',
    A(OCW_DYN, 'MIT OpenCourseWare 2.003SC — Engineering Dynamics') + ' — lecture videos and recitations on kinematics and kinetics.',
    A(OCW_MD, 'MIT OpenCourseWare 2.72 — Elements of Mechanical Design') + ' — machine-element design: bolts, bearings, shafts, gears.',
    A('https://openstax.org/books/university-physics-volume-1/pages/12-1-conditions-for-static-equilibrium', 'OpenStax University Physics Vol. 1') + ' — free physics textbook: vectors, Newton\'s laws, rotation, static equilibrium, elasticity.',
    A(DP + 'beam_bending/index.php', 'DoITPoMS (University of Cambridge) — Bending and Torsion of Beams') + ' — interactive teaching package on beams and shafts.',
  ]) + `
<h3>Tools you will use</h3>
<ul>
<li><strong>Calculator in degree mode</strong> (and know when to switch to radians — rotation and small angles).</li>
<li><strong>Python</strong> (numpy / sympy) or a spreadsheet to check longer calculations — every example in this course was checked this way.</li>
<li><strong>Squared paper and a ruler</strong> for free-body, shear and moment diagrams.</li>
</ul>
<div class="pitfall"><p><strong>Avoid</strong> pirated PDF "solution manuals": copying a solution teaches nothing, and many contain errors. Use the worked examples here and the free sources above.</p></div>`,
  `<span class="eyebrow">EMM201c · Mục 0 · Bài 0.2</span>
<h2>Giáo trình và tài liệu học tập</h2>
<p class="lead">Bạn không cần có đủ mọi cuốn dưới đây. Chọn <strong>một sách tĩnh học/động lực học</strong>, <strong>một sách sức bền vật liệu</strong> và <strong>Shigley</strong> cho chi tiết máy — rồi dùng tài liệu miễn phí để có thêm lời giải thích và bài luyện.</p>
<h3>Giáo trình chuẩn</h3>
<table>
<tr><th>Sách</th><th>NXB · năm · lần xuất bản</th><th>ISBN (bản in Mỹ)</th><th>Dùng cho</th></tr>
<tr><td>R. C. Hibbeler — <em>Engineering Mechanics: Statics</em></td><td>Pearson · 2016 · lần 14</td><td>978-0-13-391892-0</td><td>Chương 1–4</td></tr>
<tr><td>R. C. Hibbeler — <em>Engineering Mechanics: Dynamics</em></td><td>Pearson · 2016 · lần 14</td><td>978-0-13-391538-9</td><td>Chương 8–9</td></tr>
<tr><td>F. P. Beer, E. R. Johnston, J. T. DeWolf, D. F. Mazurek — <em>Mechanics of Materials</em></td><td>McGraw-Hill · 2020 · lần 8</td><td>978-1-260-11327-3</td><td>Chương 5–7</td></tr>
<tr><td>R. G. Budynas, J. K. Nisbett — <em>Shigley's Mechanical Engineering Design</em></td><td>McGraw-Hill · 2020 · lần 11</td><td>978-0-07-339821-1</td><td>Chương 7, 10–11</td></tr>
</table>
<p>Ghi chú: Pearson và McGraw-Hill còn bán <strong>bản quốc tế đơn vị SI</strong> với ISBN khác (ví dụ Shigley 11e bản SI) — nội dung và thứ tự chương như nhau. Các lần xuất bản cũ hơn (Hibbeler 12e–13e, Beer 7e, Shigley 9e–10e) vẫn dùng tốt cho môn này; chỉ số thứ tự bài tập thay đổi.</p>
<h3>Tài liệu miễn phí, chất lượng cao</h3>` + UL([
    A(ES, 'Engineering Statics: Open and Interactive') + ' (Baker &amp; Haynes) — sách tĩnh học miễn phí, đầy đủ, có hình tương tác; cùng thứ tự với Hibbeler.',
    A(OCW_MOM, 'MIT OpenCourseWare 2.001 — Mechanics &amp; Materials I') + ' — bài giảng và bài tập về cân bằng, ứng suất, biến dạng, xoắn, uốn.',
    A(OCW_DYN, 'MIT OpenCourseWare 2.003SC — Engineering Dynamics') + ' — video bài giảng và giờ chữa bài về động học, động lực học.',
    A(OCW_MD, 'MIT OpenCourseWare 2.72 — Elements of Mechanical Design') + ' — thiết kế chi tiết máy: bulông, ổ lăn, trục, bánh răng.',
    A('https://openstax.org/books/university-physics-volume-1/pages/12-1-conditions-for-static-equilibrium', 'OpenStax University Physics Vol. 1') + ' — sách vật lý miễn phí: vector, định luật Newton, chuyển động quay, cân bằng tĩnh, đàn hồi.',
    A(DP + 'beam_bending/index.php', 'DoITPoMS (ĐH Cambridge) — Bending and Torsion of Beams') + ' — gói học tương tác về dầm và trục.',
  ]) + `
<h3>Công cụ sẽ dùng</h3>
<ul>
<li><strong>Máy tính để chế độ độ</strong> (và biết lúc nào chuyển sang radian — chuyển động quay, góc nhỏ).</li>
<li><strong>Python</strong> (numpy / sympy) hoặc bảng tính để kiểm các phép tính dài — mọi ví dụ trong môn đã được kiểm như vậy.</li>
<li><strong>Giấy kẻ ô và thước</strong> để vẽ sơ đồ vật tự do, biểu đồ lực cắt và mômen.</li>
</ul>
<div class="pitfall"><p><strong>Tránh</strong> các file PDF "solution manual" lậu: chép lời giải không dạy bạn điều gì, và nhiều bản có lỗi. Hãy dùng ví dụ giải ở đây và các nguồn miễn phí ở trên.</p></div>`);

const muc0 = {
  title: 'Section 0 — Course framework (self-authored, no FLM syllabus)|||Mục 0 — Khung môn học (tự soạn, trường chưa công bố syllabus)',
  description: 'Giới thiệu môn, chuẩn đầu ra tự soạn, cảnh báo chưa có syllabus trên FLM, giáo trình chuẩn kèm ISBN và tài liệu mở.',
  lessons: [m01, m02],
};

// ───────────────────────────── Chương 1 ─────────────────────────────
const c11 = L('emm201c-ts-1-1',
  '1.1 — Mechanics, SI units and Newton\'s laws|||1.1 — Cơ học, đơn vị SI và các định luật Newton',
  'Cơ học là gì; đại lượng cơ bản và dẫn xuất; hệ SI, tiền tố, N, N·m, Pa/MPa; trọng lượng W = mg; ba định luật Newton; chữ số có nghĩa.',
  `<span class="eyebrow">EMM201c · Chapter 1 · Lesson 1.1</span>
<h2>Mechanics, SI units and Newton's laws</h2>
<h3>🎯 Objectives</h3>
<ul><li>Name the branches of mechanics used in this course.</li><li>Work fluently with SI base and derived units and prefixes (kN, MPa, N·m).</li><li>Compute weight from mass and state Newton's three laws.</li></ul>
<h3>Branches of mechanics</h3>
<p><strong>Mechanics</strong> studies how bodies respond to forces. <strong>Rigid-body mechanics</strong> assumes bodies do not deform: <em>statics</em> (equilibrium, acceleration = 0) and <em>dynamics</em> (accelerated motion). <strong>Deformable-body mechanics</strong> (strength of materials) studies what happens inside a part. Machine design uses all of them.</p>
<p>Idealisations we use all the time: a <strong>particle</strong> (mass, negligible size), a <strong>rigid body</strong> (distances between points never change) and a <strong>concentrated force</strong> (a load acting at one point — valid when the contact area is small compared with the body).</p>
<h3>SI units</h3>
<table>
<tr><th>Quantity</th><th>Unit</th><th>In base units</th></tr>
<tr><td>Length · mass · time</td><td>m · kg · s</td><td>base units</td></tr>
<tr><td>Force</td><td>newton, N</td><td>kg·m/s<sup>2</sup></td></tr>
<tr><td>Moment / torque</td><td>N·m</td><td>kg·m<sup>2</sup>/s<sup>2</sup></td></tr>
<tr><td>Stress / pressure</td><td>pascal, Pa</td><td>N/m<sup>2</sup>; 1 MPa = 10<sup>6</sup> Pa = 1 N/mm<sup>2</sup></td></tr>
<tr><td>Work / energy</td><td>joule, J</td><td>N·m</td></tr>
<tr><td>Power</td><td>watt, W</td><td>J/s</td></tr>
</table>
<p>Prefixes: k = 10<sup>3</sup>, M = 10<sup>6</sup>, G = 10<sup>9</sup>, m = 10<sup>−3</sup>, μ = 10<sup>−6</sup>. Engineering habit: forces in N or kN, lengths in mm (drawings) or m (statics), stresses in MPa, elastic moduli in GPa.</p>
<div class="meo"><p><strong>Tip:</strong> if forces are in N and lengths in mm, stress comes out directly in N/mm<sup>2</sup> = MPa. This is the fastest unit system for strength calculations.</p></div>
<h3>Newton's laws</h3>
<ol><li><strong>First law:</strong> a particle at rest, or moving with constant velocity, stays so unless an unbalanced force acts on it — this is the basis of statics: ΣF = 0.</li>
<li><strong>Second law:</strong> F = m·a — the basis of dynamics.</li>
<li><strong>Third law:</strong> the forces of interaction between two bodies are equal, opposite and collinear — this is why a force on a free-body diagram of one part appears reversed on the next part.</li></ol>
<p>Newton's law of gravitation gives the <strong>weight</strong> near the Earth's surface:</p>
<div class="formula"><span class="lbl">Weight</span>W = m·g,&nbsp;&nbsp; g = 9.81 m/s<sup>2</sup></div>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1.</b> A 50 kg motor: W = 50 × 9.81 = <b>490.5 N</b> (≈ 0.49 kN). A 1200 kg car: W = 1200 × 9.81 = 11 772 N ≈ <b>11.77 kN</b>.</p>
<p><b>Example 2.</b> Convert 2.5 kN·m to N·mm: 2.5 × 10<sup>3</sup> N × 10<sup>3</sup> mm = <b>2.5 × 10<sup>6</sup> N·mm</b>.</p>
<p><b>Example 3.</b> A 20 kN force on a 12 mm-diameter rod: A = π·12<sup>2</sup>/4 = 113.1 mm<sup>2</sup>, so 20 000/113.1 = <b>176.8 MPa</b> — no unit conversion needed when N and mm are used.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing mass in "kg" where a force is required — a mass of 50 kg is not a force of 50 N.</li><li>Mixing mm and m in the same equation (e.g. N·m torque with mm diameter).</li><li>Reporting too many digits: three significant figures is the engineering norm.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Statics: ΣF = 0; dynamics: F = ma; strength: stress = force / area.</li><li>1 N = 1 kg·m/s<sup>2</sup>; 1 MPa = 1 N/mm<sup>2</sup>.</li><li>W = mg with g = 9.81 m/s<sup>2</sup>.</li><li>Newton's third law: action and reaction act on different bodies.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(ES + 'Chapter_01-units.html', 'Engineering Statics — 1.x Units'),
    A(OSP + '1-2-units-and-standards', 'OpenStax University Physics 1.2 — Units and Standards'),
    A('https://www.nist.gov/pml/owm/metric-si/si-units', 'NIST — SI Units'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>Find the weight in kN of a 3.2-tonne truck axle load (1 t = 1000 kg).</li><li>Express 0.35 GPa in MPa and in N/mm<sup>2</sup>.</li><li>A torque of 98.8 N·m acts on a shaft. Express it in N·mm and kN·m.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 3200 × 9.81 = 31 392 N ≈ 31.4 kN. 2) 0.35 GPa = 350 MPa = 350 N/mm<sup>2</sup>. 3) 98 800 N·mm = 0.0988 kN·m.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 1 · Bài 1.1</span>
<h2>Cơ học, đơn vị SI và các định luật Newton</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Gọi tên các nhánh cơ học dùng trong môn.</li><li>Dùng thành thạo đơn vị SI cơ bản, dẫn xuất và tiền tố (kN, MPa, N·m).</li><li>Tính trọng lượng từ khối lượng và phát biểu ba định luật Newton.</li></ul>
<h3>Các nhánh của cơ học</h3>
<p><strong>Cơ học</strong> nghiên cứu phản ứng của vật dưới tác dụng của lực. <strong>Cơ học vật rắn</strong> coi vật không biến dạng: <em>tĩnh học</em> (cân bằng, gia tốc = 0) và <em>động lực học</em> (chuyển động có gia tốc). <strong>Cơ học vật biến dạng</strong> (sức bền vật liệu) nghiên cứu điều xảy ra bên trong chi tiết. Thiết kế máy dùng tất cả.</p>
<p>Các mô hình lý tưởng hoá dùng liên tục: <strong>chất điểm</strong> (có khối lượng, kích thước bỏ qua), <strong>vật rắn tuyệt đối</strong> (khoảng cách giữa các điểm không đổi) và <strong>lực tập trung</strong> (tải đặt tại một điểm — đúng khi diện tích tiếp xúc nhỏ so với vật).</p>
<h3>Đơn vị SI</h3>
<table>
<tr><th>Đại lượng</th><th>Đơn vị</th><th>Theo đơn vị cơ bản</th></tr>
<tr><td>Chiều dài · khối lượng · thời gian</td><td>m · kg · s</td><td>đơn vị cơ bản</td></tr>
<tr><td>Lực</td><td>niutơn, N</td><td>kg·m/s<sup>2</sup></td></tr>
<tr><td>Mômen / mômen xoắn</td><td>N·m</td><td>kg·m<sup>2</sup>/s<sup>2</sup></td></tr>
<tr><td>Ứng suất / áp suất</td><td>pascal, Pa</td><td>N/m<sup>2</sup>; 1 MPa = 10<sup>6</sup> Pa = 1 N/mm<sup>2</sup></td></tr>
<tr><td>Công / năng lượng</td><td>jun, J</td><td>N·m</td></tr>
<tr><td>Công suất</td><td>oát, W</td><td>J/s</td></tr>
</table>
<p>Tiền tố: k = 10<sup>3</sup>, M = 10<sup>6</sup>, G = 10<sup>9</sup>, m = 10<sup>−3</sup>, μ = 10<sup>−6</sup>. Thói quen kỹ thuật: lực dùng N hoặc kN, chiều dài dùng mm (bản vẽ) hoặc m (tĩnh học), ứng suất dùng MPa, môđun đàn hồi dùng GPa.</p>
<div class="meo"><p><strong>Mẹo:</strong> nếu lực tính bằng N và chiều dài bằng mm thì ứng suất ra thẳng N/mm<sup>2</sup> = MPa. Đây là hệ đơn vị nhanh nhất cho tính bền.</p></div>
<h3>Các định luật Newton</h3>
<ol><li><strong>Định luật 1:</strong> chất điểm đứng yên hoặc chuyển động thẳng đều sẽ giữ nguyên trạng thái nếu không có lực mất cân bằng tác dụng — đây là nền của tĩnh học: ΣF = 0.</li>
<li><strong>Định luật 2:</strong> F = m·a — nền của động lực học.</li>
<li><strong>Định luật 3:</strong> lực tương tác giữa hai vật bằng nhau, ngược chiều, cùng giá — vì vậy một lực trên sơ đồ vật tự do của chi tiết này xuất hiện đảo chiều trên chi tiết kế bên.</li></ol>
<p>Định luật vạn vật hấp dẫn cho <strong>trọng lượng</strong> gần mặt đất:</p>
<div class="formula"><span class="lbl">Trọng lượng</span>W = m·g,&nbsp;&nbsp; g = 9,81 m/s<sup>2</sup></div>
<h3>✍️ Ví dụ giải</h3>
<div class="callout"><p><b>Ví dụ 1.</b> Động cơ 50 kg: W = 50 × 9,81 = <b>490,5 N</b> (≈ 0,49 kN). Ô tô 1200 kg: W = 1200 × 9,81 = 11 772 N ≈ <b>11,77 kN</b>.</p>
<p><b>Ví dụ 2.</b> Đổi 2,5 kN·m sang N·mm: 2,5 × 10<sup>3</sup> N × 10<sup>3</sup> mm = <b>2,5 × 10<sup>6</sup> N·mm</b>.</p>
<p><b>Ví dụ 3.</b> Lực 20 kN tác dụng lên thanh đường kính 12 mm: A = π·12<sup>2</sup>/4 = 113,1 mm<sup>2</sup>, nên 20 000/113,1 = <b>176,8 MPa</b> — không cần đổi đơn vị khi dùng N và mm.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Ghi khối lượng "kg" ở chỗ cần lực — khối lượng 50 kg không phải lực 50 N.</li><li>Trộn mm và m trong cùng một phương trình (ví dụ mômen N·m với đường kính mm).</li><li>Ghi quá nhiều chữ số: ba chữ số có nghĩa là chuẩn kỹ thuật.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tĩnh học: ΣF = 0; động lực học: F = ma; sức bền: ứng suất = lực / diện tích.</li><li>1 N = 1 kg·m/s<sup>2</sup>; 1 MPa = 1 N/mm<sup>2</sup>.</li><li>W = mg với g = 9,81 m/s<sup>2</sup>.</li><li>Định luật 3 Newton: lực và phản lực tác dụng lên hai vật khác nhau.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(ES + 'Chapter_01-units.html', 'Engineering Statics — Đơn vị'),
    A(OSP + '1-2-units-and-standards', 'OpenStax Vật lý đại học 1.2 — Đơn vị và chuẩn đo'),
    A('https://www.nist.gov/pml/owm/metric-si/si-units', 'NIST — Hệ đơn vị SI'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Tính trọng lượng (kN) của tải trục 3,2 tấn (1 t = 1000 kg).</li><li>Biểu diễn 0,35 GPa theo MPa và N/mm<sup>2</sup>.</li><li>Mômen xoắn 98,8 N·m tác dụng lên trục. Đổi sang N·mm và kN·m.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 3200 × 9,81 = 31 392 N ≈ 31,4 kN. 2) 0,35 GPa = 350 MPa = 350 N/mm<sup>2</sup>. 3) 98 800 N·mm = 0,0988 kN·m.</p></div>`);

const c12 = L('emm201c-ts-1-2',
  '1.2 — Force vectors in 2D and 3D|||1.2 — Vector lực trong mặt phẳng và không gian',
  'Lực là vector; phân tích thành phần; cộng lực bằng thành phần; vector đơn vị và cosin chỉ phương; lực dọc một đường thẳng trong 3D.',
  `<span class="eyebrow">EMM201c · Chapter 1 · Lesson 1.2</span>
<h2>Force vectors in 2D and 3D</h2>
<h3>🎯 Objectives</h3>
<ul><li>Resolve a force into rectangular components.</li><li>Find the resultant of several forces by adding components.</li><li>Write a 3D force directed along a line using a unit vector.</li></ul>
<h3>Forces are vectors</h3>
<p>A force has <strong>magnitude</strong>, <strong>direction</strong> and a <strong>point of application</strong>. Forces add by the parallelogram law — but in practice we never draw parallelograms; we add <strong>components</strong>.</p>
<div class="formula"><span class="lbl">2D components</span>F<sub>x</sub> = F cos θ,&nbsp; F<sub>y</sub> = F sin θ&nbsp;&nbsp;(θ measured from the +x axis)<br>R<sub>x</sub> = ΣF<sub>x</sub>,&nbsp; R<sub>y</sub> = ΣF<sub>y</sub>,&nbsp; R = √(R<sub>x</sub><sup>2</sup> + R<sub>y</sub><sup>2</sup>),&nbsp; θ<sub>R</sub> = atan2(R<sub>y</sub>, R<sub>x</sub>)</div>
<h3>✍️ Example 1 — resultant of two forces</h3>
<div class="callout"><p>Two cables pull an eye-bolt: F<sub>1</sub> = 600 N at 30° from +x, F<sub>2</sub> = 400 N at 135° from +x.</p>
<p>R<sub>x</sub> = 600 cos 30° + 400 cos 135° = 519.6 − 282.8 = <b>236.8 N</b></p>
<p>R<sub>y</sub> = 600 sin 30° + 400 sin 135° = 300.0 + 282.8 = <b>582.8 N</b></p>
<p>R = √(236.8<sup>2</sup> + 582.8<sup>2</sup>) = <b>629 N</b>, at θ = atan(582.8/236.8) = <b>67.9°</b> from +x.</p></div>
<h3>3D forces and unit vectors</h3>
<p>In 3D write F = F<sub>x</sub><b>i</b> + F<sub>y</sub><b>j</b> + F<sub>z</sub><b>k</b>. The <strong>direction cosines</strong> cos α = F<sub>x</sub>/F, cos β = F<sub>y</sub>/F, cos γ = F<sub>z</sub>/F satisfy cos<sup>2</sup>α + cos<sup>2</sup>β + cos<sup>2</sup>γ = 1. When a force acts <strong>along a cable from A to B</strong>, use the position vector:</p>
<div class="formula"><span class="lbl">Force along a line</span><b>r</b><sub>AB</sub> = (x<sub>B</sub> − x<sub>A</sub>)<b>i</b> + (y<sub>B</sub> − y<sub>A</sub>)<b>j</b> + (z<sub>B</sub> − z<sub>A</sub>)<b>k</b>,&nbsp; <b>u</b> = <b>r</b><sub>AB</sub>/|<b>r</b><sub>AB</sub>|,&nbsp; <b>F</b> = F·<b>u</b></div>
<div class="callout"><p><b>Example 2.</b> A 500 N cable tension acts from A(0, 0, 0) to B(3, 4, 12) m. |r| = √(9 + 16 + 144) = 13 m, so <b>u</b> = (3/13, 4/13, 12/13).</p>
<p><b>F</b> = 500·<b>u</b> = <b>(115.4 i + 153.8 j + 461.5 k) N</b>. Direction angles: α = 76.7°, β = 72.1°, γ = 22.6°.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using sin where cos is needed: always check which axis the angle is measured from.</li><li>Losing signs: a component pointing in −x is negative. Using atan2 (or a sketch) avoids a wrong quadrant.</li><li>Using the cable length in metres as the force — the length only gives the <em>direction</em>.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Add forces by adding components, never magnitudes.</li><li>R = √(R<sub>x</sub><sup>2</sup> + R<sub>y</sub><sup>2</sup>), direction from atan2.</li><li>3D force along a line: F times the unit vector of the line.</li><li>Direction cosines squared sum to 1.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(ES + 'Chapter_02-vectors.html', 'Engineering Statics — Vectors'),
    A(ES + 'Chapter_02-unit-vectors.html', 'Engineering Statics — Unit vectors'),
    A(OSP + '2-2-coordinate-systems-and-components-of-a-vector', 'OpenStax 2.2 — Components of a vector'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>F = 250 N acts at 210° from +x. Find F<sub>x</sub> and F<sub>y</sub>.</li><li>Find the resultant of 3 kN along +x and 4 kN along +y.</li><li>A 1.3 kN force acts from (0, 0, 0) toward (5, 0, 12) m. Write it in vector form.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) F<sub>x</sub> = 250 cos 210° = −216.5 N; F<sub>y</sub> = 250 sin 210° = −125 N. 2) R = 5 kN at 53.1° from +x. 3) |r| = 13 m ⇒ F = (0.5 i + 0 j + 1.2 k) kN.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 1 · Bài 1.2</span>
<h2>Vector lực trong mặt phẳng và không gian</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân tích một lực thành các thành phần vuông góc.</li><li>Tìm hợp lực của nhiều lực bằng cách cộng thành phần.</li><li>Viết một lực 3D hướng dọc một đường thẳng bằng vector đơn vị.</li></ul>
<h3>Lực là vector</h3>
<p>Lực có <strong>độ lớn</strong>, <strong>phương chiều</strong> và <strong>điểm đặt</strong>. Lực cộng theo quy tắc hình bình hành — nhưng thực tế ta không bao giờ vẽ hình bình hành; ta cộng <strong>các thành phần</strong>.</p>
<div class="formula"><span class="lbl">Thành phần 2D</span>F<sub>x</sub> = F cos θ,&nbsp; F<sub>y</sub> = F sin θ&nbsp;&nbsp;(θ đo từ trục +x)<br>R<sub>x</sub> = ΣF<sub>x</sub>,&nbsp; R<sub>y</sub> = ΣF<sub>y</sub>,&nbsp; R = √(R<sub>x</sub><sup>2</sup> + R<sub>y</sub><sup>2</sup>),&nbsp; θ<sub>R</sub> = atan2(R<sub>y</sub>, R<sub>x</sub>)</div>
<h3>✍️ Ví dụ 1 — hợp lực của hai lực</h3>
<div class="callout"><p>Hai dây cáp kéo một bulông vòng: F<sub>1</sub> = 600 N hợp 30° với +x, F<sub>2</sub> = 400 N hợp 135° với +x.</p>
<p>R<sub>x</sub> = 600 cos 30° + 400 cos 135° = 519,6 − 282,8 = <b>236,8 N</b></p>
<p>R<sub>y</sub> = 600 sin 30° + 400 sin 135° = 300,0 + 282,8 = <b>582,8 N</b></p>
<p>R = √(236,8<sup>2</sup> + 582,8<sup>2</sup>) = <b>629 N</b>, hợp góc θ = atan(582,8/236,8) = <b>67,9°</b> với +x.</p></div>
<h3>Lực 3D và vector đơn vị</h3>
<p>Trong 3D viết F = F<sub>x</sub><b>i</b> + F<sub>y</sub><b>j</b> + F<sub>z</sub><b>k</b>. Các <strong>cosin chỉ phương</strong> cos α = F<sub>x</sub>/F, cos β = F<sub>y</sub>/F, cos γ = F<sub>z</sub>/F thoả cos<sup>2</sup>α + cos<sup>2</sup>β + cos<sup>2</sup>γ = 1. Khi lực tác dụng <strong>dọc dây cáp từ A đến B</strong>, dùng vector vị trí:</p>
<div class="formula"><span class="lbl">Lực dọc đường thẳng</span><b>r</b><sub>AB</sub> = (x<sub>B</sub> − x<sub>A</sub>)<b>i</b> + (y<sub>B</sub> − y<sub>A</sub>)<b>j</b> + (z<sub>B</sub> − z<sub>A</sub>)<b>k</b>,&nbsp; <b>u</b> = <b>r</b><sub>AB</sub>/|<b>r</b><sub>AB</sub>|,&nbsp; <b>F</b> = F·<b>u</b></div>
<div class="callout"><p><b>Ví dụ 2.</b> Lực căng cáp 500 N hướng từ A(0, 0, 0) đến B(3, 4, 12) m. |r| = √(9 + 16 + 144) = 13 m, nên <b>u</b> = (3/13, 4/13, 12/13).</p>
<p><b>F</b> = 500·<b>u</b> = <b>(115,4 i + 153,8 j + 461,5 k) N</b>. Các góc chỉ phương: α = 76,7°, β = 72,1°, γ = 22,6°.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng sin ở chỗ cần cos: luôn kiểm tra góc đo từ trục nào.</li><li>Mất dấu: thành phần hướng −x là số âm. Dùng atan2 (hoặc phác hình) để tránh sai góc phần tư.</li><li>Lấy chiều dài cáp (m) làm lực — chiều dài chỉ cho <em>phương</em>.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cộng lực bằng cách cộng thành phần, không cộng độ lớn.</li><li>R = √(R<sub>x</sub><sup>2</sup> + R<sub>y</sub><sup>2</sup>), góc tính bằng atan2.</li><li>Lực 3D dọc đường thẳng: F nhân vector đơn vị của đường đó.</li><li>Tổng bình phương các cosin chỉ phương bằng 1.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(ES + 'Chapter_02-vectors.html', 'Engineering Statics — Vector'),
    A(ES + 'Chapter_02-unit-vectors.html', 'Engineering Statics — Vector đơn vị'),
    A(OSP + '2-2-coordinate-systems-and-components-of-a-vector', 'OpenStax 2.2 — Thành phần của vector'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>F = 250 N hợp 210° với +x. Tìm F<sub>x</sub>, F<sub>y</sub>.</li><li>Tìm hợp lực của 3 kN theo +x và 4 kN theo +y.</li><li>Lực 1,3 kN hướng từ (0, 0, 0) tới (5, 0, 12) m. Viết dạng vector.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) F<sub>x</sub> = 250 cos 210° = −216,5 N; F<sub>y</sub> = 250 sin 210° = −125 N. 2) R = 5 kN, hợp 53,1° với +x. 3) |r| = 13 m ⇒ F = (0,5 i + 0 j + 1,2 k) kN.</p></div>`);

const c13 = L('emm201c-ts-1-3',
  '1.3 — Free-body diagrams and equilibrium of a particle|||1.3 — Sơ đồ vật tự do và cân bằng chất điểm',
  'Quy trình vẽ sơ đồ vật tự do; điều kiện ΣF = 0; bài toán hai dây treo; lò xo F = ks; ròng rọc lý tưởng; cân bằng chất điểm 3D.',
  `<span class="eyebrow">EMM201c · Chapter 1 · Lesson 1.3</span>
<h2>Free-body diagrams and equilibrium of a particle</h2>
<h3>🎯 Objectives</h3>
<ul><li>Draw a complete free-body diagram (FBD).</li><li>Apply ΣF<sub>x</sub> = 0, ΣF<sub>y</sub> = 0 (and ΣF<sub>z</sub> = 0) to find unknown forces.</li><li>Model cables, springs and frictionless pulleys.</li></ul>
<h3>The free-body diagram — the single most important skill</h3>
<ol><li><strong>Isolate</strong> the body: imagine cutting it free from everything it touches.</li>
<li><strong>Draw every external force</strong>: weight (at the centre of gravity), every cable, contact and support force where the body was cut.</li>
<li><strong>Label</strong> known forces with values and unknowns with symbols; show angles and dimensions.</li>
<li><strong>Choose axes</strong> — often aligned with the unknowns to decouple equations.</li></ol>
<p>Element models: a <strong>cable</strong> can only pull (tension along the cable). A <strong>linear spring</strong> exerts F = k·s, where s is the stretch from its unstretched length. A <strong>frictionless pulley</strong> keeps the same tension on both sides of the rope.</p>
<div class="formula"><span class="lbl">Particle equilibrium</span>ΣF = 0 &nbsp;⇔&nbsp; ΣF<sub>x</sub> = 0, ΣF<sub>y</sub> = 0 (2D) — two equations, at most two unknowns<br>3D: add ΣF<sub>z</sub> = 0 — three unknowns</div>
<h3>✍️ Worked example — a load hanging from two cables</h3>
<div class="callout"><p>A 100 kg engine block hangs from ring A. Cable AB goes up-left at 30° above the horizontal; cable AC goes up-right at 45° above the horizontal. Find the tensions.</p>
<p><b>FBD of ring A:</b> weight W = 100 × 9.81 = 981 N downward; T<sub>AB</sub> along AB (up-left); T<sub>AC</sub> along AC (up-right).</p>
<p>ΣF<sub>x</sub> = 0: −T<sub>AB</sub> cos 30° + T<sub>AC</sub> cos 45° = 0</p>
<p>ΣF<sub>y</sub> = 0: T<sub>AB</sub> sin 30° + T<sub>AC</sub> sin 45° − 981 = 0</p>
<p>Solving: <b>T<sub>AB</sub> = 718 N</b>, <b>T<sub>AC</sub> = 880 N</b>. Both positive ⇒ both cables are in tension, as assumed. Note that the steeper cable carries more load.</p></div>
<div class="callout"><p><b>Spring check.</b> If cable AB were replaced by a spring with k = 5 kN/m, it would stretch s = F/k = 718/5000 = 0.144 m = 144 mm.</p></div>
<h3>3D particle equilibrium</h3>
<p>Write each cable force as F·<b>u</b> (lesson 1.2), sum the <b>i</b>, <b>j</b>, <b>k</b> components separately and solve the three linear equations — in practice with a calculator's linear solver or Python <code>numpy.linalg.solve</code>.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the weight, or drawing it at the wrong body.</li><li>Drawing a cable force pushing — cables only pull.</li><li>Assuming two cables share the load equally when their angles differ.</li><li>A negative answer is not "wrong": it means the assumed direction is reversed (for a cable: it would have to push, so the model is invalid).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>No FBD, no solution: isolate, draw all forces, label, choose axes.</li><li>Particle in 2D: two equations; in 3D: three.</li><li>Spring: F = ks; ideal pulley: same tension both sides.</li><li>Check signs and units at the end.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(ES + 'CH03-2d-particles.html', 'Engineering Statics — 2D particle equilibrium'),
    A(ES + 'ch3-3d-particles.html', 'Engineering Statics — 3D particle equilibrium'),
    A(OSP + '5-7-drawing-free-body-diagrams', 'OpenStax 5.7 — Drawing free-body diagrams'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A 40 kg sign hangs from two cables, both at 60° above the horizontal (symmetric). Find the tension in each.</li><li>A 200 N weight hangs from a rope over a frictionless pulley; the other end is held by hand. What force does the hand apply?</li><li>A spring (k = 2 kN/m) holds a 15 kg mass vertically. Find its stretch.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2T sin 60° = 392.4 N ⇒ T = 226.6 N. 2) 200 N (ideal pulley). 3) s = 147.15/2000 = 0.0736 m ≈ 73.6 mm.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 1 · Bài 1.3</span>
<h2>Sơ đồ vật tự do và cân bằng chất điểm</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Vẽ sơ đồ vật tự do (FBD) đầy đủ.</li><li>Áp dụng ΣF<sub>x</sub> = 0, ΣF<sub>y</sub> = 0 (và ΣF<sub>z</sub> = 0) để tìm lực chưa biết.</li><li>Mô hình hoá dây cáp, lò xo, ròng rọc không ma sát.</li></ul>
<h3>Sơ đồ vật tự do — kỹ năng quan trọng nhất</h3>
<ol><li><strong>Tách vật</strong>: tưởng tượng cắt rời vật khỏi mọi thứ nó tiếp xúc.</li>
<li><strong>Vẽ mọi ngoại lực</strong>: trọng lượng (tại trọng tâm), mọi dây, lực tiếp xúc và phản lực gối tại chỗ vừa cắt.</li>
<li><strong>Ghi nhãn</strong> lực đã biết bằng giá trị, lực chưa biết bằng ký hiệu; ghi góc và kích thước.</li>
<li><strong>Chọn trục</strong> — thường chọn theo phương các ẩn để tách phương trình.</li></ol>
<p>Mô hình phần tử: <strong>dây cáp</strong> chỉ kéo (lực căng dọc dây). <strong>Lò xo tuyến tính</strong> tạo lực F = k·s, với s là độ dãn so với chiều dài tự do. <strong>Ròng rọc không ma sát</strong> giữ lực căng hai bên dây như nhau.</p>
<div class="formula"><span class="lbl">Cân bằng chất điểm</span>ΣF = 0 &nbsp;⇔&nbsp; ΣF<sub>x</sub> = 0, ΣF<sub>y</sub> = 0 (2D) — hai phương trình, tối đa hai ẩn<br>3D: thêm ΣF<sub>z</sub> = 0 — ba ẩn</div>
<h3>✍️ Ví dụ giải — vật treo bằng hai dây</h3>
<div class="callout"><p>Khối động cơ 100 kg treo tại vòng A. Dây AB đi lên bên trái, hợp 30° với phương ngang; dây AC đi lên bên phải, hợp 45° với phương ngang. Tìm lực căng.</p>
<p><b>FBD vòng A:</b> trọng lượng W = 100 × 9,81 = 981 N hướng xuống; T<sub>AB</sub> dọc AB (lên-trái); T<sub>AC</sub> dọc AC (lên-phải).</p>
<p>ΣF<sub>x</sub> = 0: −T<sub>AB</sub> cos 30° + T<sub>AC</sub> cos 45° = 0</p>
<p>ΣF<sub>y</sub> = 0: T<sub>AB</sub> sin 30° + T<sub>AC</sub> sin 45° − 981 = 0</p>
<p>Giải ra: <b>T<sub>AB</sub> = 718 N</b>, <b>T<sub>AC</sub> = 880 N</b>. Cả hai dương ⇒ cả hai dây chịu kéo, đúng như giả thiết. Để ý dây dốc hơn chịu tải lớn hơn.</p></div>
<div class="callout"><p><b>Kiểm với lò xo.</b> Nếu thay dây AB bằng lò xo k = 5 kN/m, nó dãn s = F/k = 718/5000 = 0,144 m = 144 mm.</p></div>
<h3>Cân bằng chất điểm trong không gian</h3>
<p>Viết mỗi lực dây dạng F·<b>u</b> (bài 1.2), cộng riêng thành phần <b>i</b>, <b>j</b>, <b>k</b> rồi giải hệ ba phương trình tuyến tính — thực tế dùng chức năng giải hệ của máy tính hoặc Python <code>numpy.linalg.solve</code>.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên trọng lượng, hoặc vẽ nó lên nhầm vật.</li><li>Vẽ lực dây dạng đẩy — dây chỉ kéo.</li><li>Cho rằng hai dây chia đều tải khi góc của chúng khác nhau.</li><li>Đáp số âm không phải "sai": nó cho biết chiều giả định bị ngược (với dây: dây phải đẩy, tức mô hình không hợp lệ).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Không có FBD thì không có lời giải: tách vật, vẽ đủ lực, ghi nhãn, chọn trục.</li><li>Chất điểm 2D: hai phương trình; 3D: ba phương trình.</li><li>Lò xo: F = ks; ròng rọc lý tưởng: lực căng hai bên bằng nhau.</li><li>Cuối bài kiểm tra dấu và đơn vị.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(ES + 'CH03-2d-particles.html', 'Engineering Statics — Cân bằng chất điểm 2D'),
    A(ES + 'ch3-3d-particles.html', 'Engineering Statics — Cân bằng chất điểm 3D'),
    A(OSP + '5-7-drawing-free-body-diagrams', 'OpenStax 5.7 — Vẽ sơ đồ vật tự do'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Biển quảng cáo 40 kg treo bằng hai dây, cả hai hợp 60° với phương ngang (đối xứng). Tìm lực căng mỗi dây.</li><li>Vật 200 N treo ở một đầu dây vắt qua ròng rọc không ma sát; đầu kia giữ bằng tay. Tay phải tác dụng lực bao nhiêu?</li><li>Lò xo (k = 2 kN/m) treo thẳng đứng một vật 15 kg. Tìm độ dãn.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2T sin 60° = 392,4 N ⇒ T = 226,6 N. 2) 200 N (ròng rọc lý tưởng). 3) s = 147,15/2000 = 0,0736 m ≈ 73,6 mm.</p></div>`);

const q1 = QZ(1, 'Quiz — Chapter 1: Units, force vectors and particle equilibrium|||Quiz — Chương 1: Đơn vị, vector lực và cân bằng chất điểm', 'Kiểm tra chương 1: đơn vị SI, trọng lượng, thành phần lực, hợp lực, vector đơn vị, sơ đồ vật tự do, cân bằng chất điểm.', [
  Q('q1', '1 MPa equals|||1 MPa bằng',
    ['1 N/m²|||1 N/m²', '1 N/mm²|||1 N/mm²', '1 kN/m²|||1 kN/m²', '1 N/cm²|||1 N/cm²'], 1,
    '10⁶ N/m² = 10⁶ N / 10⁶ mm² = 1 N/mm².|||10⁶ N/m² = 10⁶ N / 10⁶ mm² = 1 N/mm².'),
  Q('q2', 'The weight of an 80 kg robot is about|||Trọng lượng của robot 80 kg xấp xỉ',
    ['80 N|||80 N', '785 N|||785 N', '8.15 N|||8,15 N', '7.85 kN|||7,85 kN'], 1,
    'W = mg = 80 × 9.81 = 784.8 N.|||W = mg = 80 × 9,81 = 784,8 N.'),
  Q('q3', 'F = 100 N acts at 60° from +x. Its x-component is|||F = 100 N hợp 60° với +x. Thành phần x là',
    ['86.6 N|||86,6 N', '50 N|||50 N', '60 N|||60 N', '100 N|||100 N'], 1,
    'Fx = F cos 60° = 50 N.|||Fx = F cos 60° = 50 N.'),
  Q('q4', 'Forces 3 kN (+x) and 4 kN (+y) have a resultant of|||Hai lực 3 kN (+x) và 4 kN (+y) có hợp lực',
    ['7 kN|||7 kN', '5 kN|||5 kN', '1 kN|||1 kN', '12 kN|||12 kN'], 1,
    '√(3² + 4²) = 5 kN.|||√(3² + 4²) = 5 kN.'),
  Q('q5', 'The unit vector from (0,0,0) to (3,4,12) m is|||Vector đơn vị từ (0,0,0) đến (3,4,12) m là',
    ['(3, 4, 12)|||(3, 4, 12)', '(3/13, 4/13, 12/13)|||(3/13, 4/13, 12/13)', '(3/19, 4/19, 12/19)|||(3/19, 4/19, 12/19)', '(1, 1, 1)/√3|||(1, 1, 1)/√3'], 1,
    'Length √(9+16+144) = 13; divide each component by 13.|||Độ dài √(9+16+144) = 13; chia từng thành phần cho 13.'),
  Q('q6', 'For a particle in 2D equilibrium, how many independent equations are available?|||Chất điểm cân bằng trong mặt phẳng có bao nhiêu phương trình độc lập?',
    ['1|||1', '2|||2', '3|||3', '6|||6'], 1,
    'ΣFx = 0 and ΣFy = 0 (no moment equation for a particle).|||ΣFx = 0 và ΣFy = 0 (chất điểm không có phương trình mômen).'),
  Q('q7', 'A cable in a free-body diagram can|||Trên sơ đồ vật tự do, một dây cáp có thể',
    ['only push|||chỉ đẩy', 'only pull, along the cable|||chỉ kéo, dọc theo dây', 'push or pull in any direction|||đẩy hoặc kéo theo mọi phương', 'carry a moment|||chịu mômen'], 1,
    'Flexible cables carry tension only, directed along the cable.|||Dây mềm chỉ chịu kéo, hướng dọc dây.'),
  Q('q8', 'A spring with k = 4 kN/m carries 200 N. Its stretch is|||Lò xo k = 4 kN/m chịu 200 N. Độ dãn là',
    ['5 mm|||5 mm', '50 mm|||50 mm', '0.8 m|||0,8 m', '20 mm|||20 mm'], 1,
    's = F/k = 200/4000 = 0.05 m = 50 mm.|||s = F/k = 200/4000 = 0,05 m = 50 mm.'),
  Q('q9', 'A symmetric two-cable hanger at 30° above horizontal carries W. Each tension is|||Hai dây treo đối xứng hợp 30° với phương ngang mang tải W. Lực căng mỗi dây là',
    ['W/2|||W/2', 'W|||W', 'W/√3|||W/√3', '2W|||2W'], 1,
    '2T sin 30° = W ⇒ T = W. Shallow cables carry large tension.|||2T sin 30° = W ⇒ T = W. Dây càng thoải, lực căng càng lớn.'),
  Q('q10', 'A negative value for an unknown force after solving means|||Sau khi giải, lực chưa biết có giá trị âm nghĩa là',
    ['the calculation is wrong|||phép tính sai', 'the force acts opposite to the assumed direction|||lực có chiều ngược chiều giả định', 'the force is zero|||lực bằng không', 'the units are wrong|||sai đơn vị'], 1,
    'Signs only tell direction relative to your assumption.|||Dấu chỉ cho biết chiều so với giả định của bạn.'),
]);

const ch1 = {
  title: 'Chapter 1 — Statics fundamentals: units, force vectors, particle equilibrium|||Chương 1 — Nền tảng tĩnh học: đơn vị, vector lực, cân bằng chất điểm',
  description: 'Đơn vị SI và định luật Newton, vector lực 2D/3D, sơ đồ vật tự do và cân bằng chất điểm (Hibbeler Statics ch.1–3).',
  lessons: [c11, c12, c13, q1],
};

// ───────────────────────────── Chương 2 ─────────────────────────────
const c21 = L('emm201c-ts-2-1',
  '2.1 — Moment of a force: scalar and vector forms|||2.1 — Mômen của lực: dạng vô hướng và dạng vector',
  'Mômen M = F·d, quy tắc bàn tay phải, dấu; tích có hướng M = r × F; định lý Varignon; mômen quanh trục; ví dụ cờ lê và vector 3D.',
  `<span class="eyebrow">EMM201c · Chapter 2 · Lesson 2.1</span>
<h2>Moment of a force: scalar and vector forms</h2>
<h3>🎯 Objectives</h3>
<ul><li>Compute the moment of a force about a point with M = F·d.</li><li>Use the cross product M = r × F in 3D.</li><li>Use Varignon's theorem to simplify moment calculations.</li></ul>
<h3>The idea</h3>
<p>A force tends to <strong>rotate</strong> a body about any point not on its line of action. The measure of this turning effect is the <strong>moment</strong> (called <em>torque</em> when it twists a shaft). Its magnitude is force times the <strong>perpendicular distance</strong> (moment arm) from the point to the line of action.</p>
<div class="formula"><span class="lbl">Scalar moment (2D)</span>M<sub>O</sub> = F·d &nbsp;&nbsp; [N·m]; sign: counter-clockwise (CCW) positive, clockwise (CW) negative</div>
<div class="formula"><span class="lbl">Vector moment (3D)</span><b>M</b><sub>O</sub> = <b>r</b> × <b>F</b> = (r<sub>y</sub>F<sub>z</sub> − r<sub>z</sub>F<sub>y</sub>)<b>i</b> + (r<sub>z</sub>F<sub>x</sub> − r<sub>x</sub>F<sub>z</sub>)<b>j</b> + (r<sub>x</sub>F<sub>y</sub> − r<sub>y</sub>F<sub>x</sub>)<b>k</b></div>
<p>Here <b>r</b> is a position vector from O to <em>any</em> point on the line of action of <b>F</b>. The direction of <b>M</b> follows the right-hand rule: curl the fingers in the sense of rotation, the thumb gives the moment axis.</p>
<h3>Varignon's theorem</h3>
<p>The moment of a force about a point equals the <strong>sum of the moments of its components</strong> about the same point. In 2D this means M<sub>O</sub> = x·F<sub>y</sub> − y·F<sub>x</sub>, where (x, y) is any point on the line of action — usually much easier than finding d.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — wrench.</b> A 200 N force is applied at the end of a 0.30 m wrench, at 60° to the handle. Only the component perpendicular to the handle turns the bolt: M = 200 × 0.30 × sin 60° = <b>52.0 N·m</b>. Pulling at 90° would give 60 N·m — the maximum.</p>
<p><b>Example 2 — Varignon in 2D.</b> A force F = (F<sub>x</sub>, F<sub>y</sub>) = (300, 400) N acts at point (2, 1) m. About O: M<sub>O</sub> = 2·400 − 1·300 = <b>+500 N·m</b> (CCW).</p>
<p><b>Example 3 — 3D cross product.</b> r = (0.4, 0.2, 0) m, F = (100, −50, 200) N.</p>
<p>M<sub>x</sub> = 0.2·200 − 0·(−50) = 40; M<sub>y</sub> = 0·100 − 0.4·200 = −80; M<sub>z</sub> = 0.4·(−50) − 0.2·100 = −40.</p>
<p><b>M</b><sub>O</sub> = <b>(40 i − 80 j − 40 k) N·m</b>, |M| = <b>98.0 N·m</b>.</p></div>
<h3>Moment about an axis</h3>
<p>For a shaft that can only turn about an axis with unit vector <b>u</b>, only the component of the moment along that axis matters: M<sub>a</sub> = <b>u</b> · (<b>r</b> × <b>F</b>). In the example above, the moment about the z-axis (u = k) is −40 N·m.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the distance to the point of application instead of the <em>perpendicular</em> distance.</li><li>Reversing r × F into F × r (this flips the sign).</li><li>Mixing CW/CCW sign conventions within one equation.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>M = F·d with d the perpendicular moment arm; units N·m.</li><li>3D: M = r × F, r from the point to the line of action.</li><li>Varignon: sum the moments of the components.</li><li>Moment about an axis: dot product with the axis unit vector.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(ES + 'moment-of-force.html', 'Engineering Statics — Moment of a force'),
    A(ES + 'varignons-theorem.html', 'Engineering Statics — Varignon\'s theorem'),
    A(OSP + '10-6-torque', 'OpenStax 10.6 — Torque'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A 150 N force acts perpendicular to a 0.4 m lever. Find the moment.</li><li>F = (−200, 100) N acts at (3, 2) m. Find M<sub>O</sub> and its sense.</li><li>r = (1, 0, 0) m, F = (0, 0, 50) N. Find <b>M</b> = r × F.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 60 N·m. 2) M = 3·100 − 2·(−200) = 700 N·m, CCW. 3) M = (0·50 − 0·0) i + (0·0 − 1·50) j + (1·0 − 0·0) k = −50 j N·m.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 2 · Bài 2.1</span>
<h2>Mômen của lực: dạng vô hướng và dạng vector</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính mômen của lực đối với một điểm bằng M = F·d.</li><li>Dùng tích có hướng M = r × F trong không gian.</li><li>Dùng định lý Varignon để rút gọn việc tính mômen.</li></ul>
<h3>Ý tưởng</h3>
<p>Một lực có xu hướng làm vật <strong>quay</strong> quanh mọi điểm không nằm trên giá của nó. Số đo hiệu ứng quay đó là <strong>mômen</strong> (gọi là <em>mômen xoắn</em> khi nó vặn trục). Độ lớn bằng lực nhân <strong>khoảng cách vuông góc</strong> (cánh tay đòn) từ điểm đến giá của lực.</p>
<div class="formula"><span class="lbl">Mômen vô hướng (2D)</span>M<sub>O</sub> = F·d &nbsp;&nbsp; [N·m]; dấu: ngược chiều kim đồng hồ (CCW) dương, cùng chiều kim đồng hồ (CW) âm</div>
<div class="formula"><span class="lbl">Mômen vector (3D)</span><b>M</b><sub>O</sub> = <b>r</b> × <b>F</b> = (r<sub>y</sub>F<sub>z</sub> − r<sub>z</sub>F<sub>y</sub>)<b>i</b> + (r<sub>z</sub>F<sub>x</sub> − r<sub>x</sub>F<sub>z</sub>)<b>j</b> + (r<sub>x</sub>F<sub>y</sub> − r<sub>y</sub>F<sub>x</sub>)<b>k</b></div>
<p>Ở đây <b>r</b> là vector vị trí từ O tới <em>bất kỳ</em> điểm nào trên giá của <b>F</b>. Chiều của <b>M</b> theo quy tắc bàn tay phải: bốn ngón cong theo chiều quay, ngón cái chỉ trục mômen.</p>
<h3>Định lý Varignon</h3>
<p>Mômen của một lực đối với một điểm bằng <strong>tổng mômen các thành phần</strong> của nó đối với cùng điểm đó. Trong 2D: M<sub>O</sub> = x·F<sub>y</sub> − y·F<sub>x</sub>, với (x, y) là một điểm bất kỳ trên giá lực — thường dễ hơn nhiều so với đi tìm d.</p>
<h3>✍️ Ví dụ giải</h3>
<div class="callout"><p><b>Ví dụ 1 — cờ lê.</b> Lực 200 N đặt ở đầu cờ lê dài 0,30 m, hợp 60° với cán. Chỉ thành phần vuông góc với cán làm vặn bulông: M = 200 × 0,30 × sin 60° = <b>52,0 N·m</b>. Kéo vuông góc 90° sẽ được 60 N·m — lớn nhất.</p>
<p><b>Ví dụ 2 — Varignon 2D.</b> Lực F = (F<sub>x</sub>, F<sub>y</sub>) = (300, 400) N đặt tại điểm (2, 1) m. Đối với O: M<sub>O</sub> = 2·400 − 1·300 = <b>+500 N·m</b> (CCW).</p>
<p><b>Ví dụ 3 — tích có hướng 3D.</b> r = (0,4; 0,2; 0) m, F = (100; −50; 200) N.</p>
<p>M<sub>x</sub> = 0,2·200 − 0·(−50) = 40; M<sub>y</sub> = 0·100 − 0,4·200 = −80; M<sub>z</sub> = 0,4·(−50) − 0,2·100 = −40.</p>
<p><b>M</b><sub>O</sub> = <b>(40 i − 80 j − 40 k) N·m</b>, |M| = <b>98,0 N·m</b>.</p></div>
<h3>Mômen đối với một trục</h3>
<p>Với trục chỉ quay được quanh trục có vector đơn vị <b>u</b>, chỉ thành phần mômen dọc trục đó có tác dụng: M<sub>a</sub> = <b>u</b> · (<b>r</b> × <b>F</b>). Trong ví dụ trên, mômen đối với trục z (u = k) là −40 N·m.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng khoảng cách tới điểm đặt lực thay vì khoảng cách <em>vuông góc</em>.</li><li>Đảo r × F thành F × r (đổi dấu kết quả).</li><li>Trộn quy ước dấu CW/CCW trong cùng một phương trình.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>M = F·d với d là cánh tay đòn vuông góc; đơn vị N·m.</li><li>3D: M = r × F, r từ điểm đến giá lực.</li><li>Varignon: cộng mômen các thành phần.</li><li>Mômen đối với trục: nhân vô hướng với vector đơn vị của trục.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(ES + 'moment-of-force.html', 'Engineering Statics — Mômen của lực'),
    A(ES + 'varignons-theorem.html', 'Engineering Statics — Định lý Varignon'),
    A(OSP + '10-6-torque', 'OpenStax 10.6 — Mômen lực'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Lực 150 N vuông góc với đòn bẩy dài 0,4 m. Tính mômen.</li><li>F = (−200, 100) N đặt tại (3, 2) m. Tìm M<sub>O</sub> và chiều quay.</li><li>r = (1, 0, 0) m, F = (0, 0, 50) N. Tìm <b>M</b> = r × F.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 60 N·m. 2) M = 3·100 − 2·(−200) = 700 N·m, CCW. 3) M = (0·50 − 0·0) i + (0·0 − 1·50) j + (1·0 − 0·0) k = −50 j N·m.</p></div>`);

const c22 = L('emm201c-ts-2-2',
  '2.2 — Couples, equivalent systems and distributed loads|||2.2 — Ngẫu lực, hệ lực tương đương và tải phân bố',
  'Ngẫu lực M = F·d (vector tự do); dời lực song song = lực + ngẫu; thu gọn hệ lực về hợp lực; tải phân bố đều và tam giác: độ lớn = diện tích, điểm đặt = trọng tâm.',
  `<span class="eyebrow">EMM201c · Chapter 2 · Lesson 2.2</span>
<h2>Couples, equivalent systems and distributed loads</h2>
<h3>🎯 Objectives</h3>
<ul><li>Compute the moment of a couple and know it is the same about every point.</li><li>Replace a force by a force-couple system at another point.</li><li>Replace a distributed load by its resultant.</li></ul>
<h3>Couples</h3>
<p>A <strong>couple</strong> is two parallel forces of equal magnitude and opposite direction, separated by a distance d. Their resultant force is zero, so a couple produces <strong>pure rotation</strong>. Its moment is the same about <em>any</em> point — a couple moment is a <strong>free vector</strong>.</p>
<div class="formula"><span class="lbl">Couple moment</span>M = F·d</div>
<p>Typical couples: the two hands on a steering wheel, a tap wrench, the torque a motor delivers to a shaft.</p>
<h3>Moving a force: force-couple system</h3>
<p>A force F at point A is equivalent to the <strong>same force F at point O plus a couple M = r<sub>OA</sub> × F</strong>. This is how we "transport" a load to a support or to a shaft centreline in design. Repeating this for many forces and summing gives the <strong>resultant force</strong> F<sub>R</sub> = ΣF and <strong>resultant moment</strong> M<sub>RO</sub> = ΣM<sub>O</sub>. In 2D the system can be reduced further to a single force placed at distance d = M<sub>RO</sub>/F<sub>R</sub> from O.</p>
<h3>Distributed loads</h3>
<p>A load spread along a beam is described by an intensity w(x) in N/m (or kN/m). For equilibrium calculations it can be replaced by a single resultant:</p>
<div class="formula"><span class="lbl">Resultant of a distributed load</span>F<sub>R</sub> = ∫ w(x) dx = <b>area</b> under the load diagram<br>x̄ = ∫ x·w(x) dx / F<sub>R</sub> = <b>centroid</b> of that area</div>
<table>
<tr><th>Load shape (length L)</th><th>Resultant</th><th>Location</th></tr>
<tr><td>Uniform, intensity w</td><td>w·L</td><td>L/2 (middle)</td></tr>
<tr><td>Triangular, 0 rising to w<sub>0</sub></td><td>w<sub>0</sub>·L/2</td><td>2L/3 from the zero end (L/3 from the peak)</td></tr>
</table>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — couple.</b> Two 150 N forces, 0.4 m apart, act on a steering wheel: M = 150 × 0.4 = <b>60 N·m</b>.</p>
<p><b>Example 2 — moving a force.</b> A 2 kN vertical load hangs from a bracket 0.25 m from the face of a column. Equivalent system at the column face: <b>2 kN downward + couple 2 × 0.25 = 0.5 kN·m</b>. The column must resist both.</p>
<p><b>Example 3 — uniform load.</b> w = 2 kN/m over 6 m ⇒ F<sub>R</sub> = <b>12 kN at 3 m</b> from the end.</p>
<p><b>Example 4 — triangular load.</b> w rises from 0 to 3 kN/m over 6 m ⇒ F<sub>R</sub> = 3 × 6/2 = <b>9 kN</b>, located 2 × 6/3 = <b>4 m</b> from the zero end.</p></div>
<div class="note-ct"><p>The resultant is valid for <strong>external</strong> equilibrium (reactions). For internal forces (Chapter 6) you must cut the beam first and only then replace the part of the load on each side.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Putting the triangular resultant at L/2.</li><li>Forgetting the couple when moving a force to a new point.</li><li>Writing w (N/m) where a force (N) is needed.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Couple: zero net force, moment F·d about every point.</li><li>Force at A = same force at O + couple r × F.</li><li>Distributed load: magnitude = area, location = centroid.</li><li>Uniform: wL at L/2; triangle: w<sub>0</sub>L/2 at 2L/3 from zero end.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(ES + 'Chapter_04-couples.html', 'Engineering Statics — Couples'),
    A(ES + 'statically-equivalent-systems.html', 'Engineering Statics — Statically equivalent systems'),
    A(ES + 'distributed-loads.html', 'Engineering Statics — Distributed loads'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A 40 N·m couple is produced by two forces 0.25 m apart. Find F.</li><li>Replace a uniform load of 5 kN/m on a 4 m beam by one force.</li><li>A triangular load rises from 0 to 6 kN/m over 3 m. Find the resultant and its position.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) F = 40/0.25 = 160 N. 2) 20 kN at 2 m. 3) 9 kN at 2 m from the zero end.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 2 · Bài 2.2</span>
<h2>Ngẫu lực, hệ lực tương đương và tải phân bố</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính mômen ngẫu lực và biết nó như nhau đối với mọi điểm.</li><li>Thay một lực bằng hệ lực–ngẫu tại điểm khác.</li><li>Thay tải phân bố bằng hợp lực.</li></ul>
<h3>Ngẫu lực</h3>
<p><strong>Ngẫu lực</strong> là hai lực song song, cùng độ lớn, ngược chiều, cách nhau khoảng d. Hợp lực của chúng bằng không, nên ngẫu lực chỉ gây <strong>quay thuần tuý</strong>. Mômen của nó như nhau đối với <em>mọi</em> điểm — mômen ngẫu là <strong>vector tự do</strong>.</p>
<div class="formula"><span class="lbl">Mômen ngẫu lực</span>M = F·d</div>
<p>Ngẫu lực điển hình: hai tay trên vô-lăng, tay quay ta-rô, mômen động cơ truyền cho trục.</p>
<h3>Dời lực: hệ lực–ngẫu</h3>
<p>Lực F đặt tại A tương đương với <strong>cùng lực F đặt tại O cộng một ngẫu M = r<sub>OA</sub> × F</strong>. Đó là cách ta "dời" tải về gối đỡ hay về đường tâm trục khi thiết kế. Lặp lại với nhiều lực rồi cộng lại được <strong>lực tổng</strong> F<sub>R</sub> = ΣF và <strong>mômen tổng</strong> M<sub>RO</sub> = ΣM<sub>O</sub>. Trong 2D, hệ còn thu gọn được thành một lực duy nhất đặt cách O một khoảng d = M<sub>RO</sub>/F<sub>R</sub>.</p>
<h3>Tải phân bố</h3>
<p>Tải rải dọc dầm được mô tả bằng cường độ w(x) theo N/m (hoặc kN/m). Khi tính cân bằng, có thể thay nó bằng một hợp lực:</p>
<div class="formula"><span class="lbl">Hợp lực của tải phân bố</span>F<sub>R</sub> = ∫ w(x) dx = <b>diện tích</b> biểu đồ tải<br>x̄ = ∫ x·w(x) dx / F<sub>R</sub> = <b>trọng tâm</b> của diện tích đó</div>
<table>
<tr><th>Dạng tải (dài L)</th><th>Hợp lực</th><th>Vị trí</th></tr>
<tr><td>Đều, cường độ w</td><td>w·L</td><td>L/2 (giữa)</td></tr>
<tr><td>Tam giác, từ 0 tăng đến w<sub>0</sub></td><td>w<sub>0</sub>·L/2</td><td>2L/3 tính từ đầu bằng 0 (L/3 từ đỉnh)</td></tr>
</table>
<h3>✍️ Ví dụ giải</h3>
<div class="callout"><p><b>Ví dụ 1 — ngẫu lực.</b> Hai lực 150 N cách nhau 0,4 m tác dụng lên vô-lăng: M = 150 × 0,4 = <b>60 N·m</b>.</p>
<p><b>Ví dụ 2 — dời lực.</b> Tải đứng 2 kN treo trên công-xôn cách mặt cột 0,25 m. Hệ tương đương tại mặt cột: <b>2 kN hướng xuống + ngẫu 2 × 0,25 = 0,5 kN·m</b>. Cột phải chịu cả hai.</p>
<p><b>Ví dụ 3 — tải đều.</b> w = 2 kN/m trên 6 m ⇒ F<sub>R</sub> = <b>12 kN đặt tại 3 m</b> tính từ đầu dầm.</p>
<p><b>Ví dụ 4 — tải tam giác.</b> w tăng từ 0 đến 3 kN/m trên 6 m ⇒ F<sub>R</sub> = 3 × 6/2 = <b>9 kN</b>, đặt cách đầu bằng 0 một khoảng 2 × 6/3 = <b>4 m</b>.</p></div>
<div class="note-ct"><p>Hợp lực chỉ dùng cho cân bằng <strong>ngoài</strong> (phản lực). Với nội lực (Chương 6) phải cắt dầm trước, rồi mới thay phần tải ở mỗi bên.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đặt hợp lực tải tam giác tại L/2.</li><li>Quên ngẫu lực khi dời lực sang điểm mới.</li><li>Viết w (N/m) ở chỗ cần lực (N).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Ngẫu lực: lực tổng bằng 0, mômen F·d đối với mọi điểm.</li><li>Lực tại A = cùng lực tại O + ngẫu r × F.</li><li>Tải phân bố: độ lớn = diện tích, điểm đặt = trọng tâm.</li><li>Tải đều: wL tại L/2; tam giác: w<sub>0</sub>L/2 tại 2L/3 từ đầu bằng 0.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(ES + 'Chapter_04-couples.html', 'Engineering Statics — Ngẫu lực'),
    A(ES + 'statically-equivalent-systems.html', 'Engineering Statics — Hệ lực tương đương'),
    A(ES + 'distributed-loads.html', 'Engineering Statics — Tải phân bố'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Ngẫu 40 N·m tạo bởi hai lực cách nhau 0,25 m. Tìm F.</li><li>Thay tải đều 5 kN/m trên dầm dài 4 m bằng một lực.</li><li>Tải tam giác tăng từ 0 đến 6 kN/m trên 3 m. Tìm hợp lực và vị trí.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) F = 40/0,25 = 160 N. 2) 20 kN tại 2 m. 3) 9 kN tại 2 m tính từ đầu bằng 0.</p></div>`);

const c23 = L('emm201c-ts-2-3',
  '2.3 — Supports and equilibrium of a rigid body (2D and 3D)|||2.3 — Liên kết và cân bằng vật rắn (phẳng và không gian)',
  'Phản lực của các loại liên kết (con lăn, khớp bản lề, ngàm); ba phương trình cân bằng phẳng; dầm đơn giản chịu lực tập trung + tải đều; dầm công-xôn; tĩnh định/siêu tĩnh; cân bằng 3D sáu phương trình.',
  `<span class="eyebrow">EMM201c · Chapter 2 · Lesson 2.3</span>
<h2>Supports and equilibrium of a rigid body</h2>
<h3>🎯 Objectives</h3>
<ul><li>Know the reactions provided by common supports.</li><li>Solve 2D rigid-body equilibrium with ΣF<sub>x</sub> = ΣF<sub>y</sub> = ΣM = 0.</li><li>Recognise statically determinate vs indeterminate problems; know the six equations in 3D.</li></ul>
<h3>Support reactions (2D)</h3>
<table>
<tr><th>Support</th><th>Prevents</th><th>Reactions (unknowns)</th></tr>
<tr><td>Roller / smooth surface</td><td>motion normal to the surface</td><td>1 force, normal to the surface</td></tr>
<tr><td>Cable / two-force link</td><td>motion along the cable</td><td>1 force along the cable (tension)</td></tr>
<tr><td>Pin (hinge)</td><td>translation in x and y</td><td>2 forces A<sub>x</sub>, A<sub>y</sub></td></tr>
<tr><td>Fixed support (clamp, weld)</td><td>translation and rotation</td><td>A<sub>x</sub>, A<sub>y</sub> and a moment M<sub>A</sub></td></tr>
</table>
<p>Rule: <em>if a support prevents translation in a direction, it exerts a force in that direction; if it prevents rotation, it exerts a couple.</em></p>
<div class="formula"><span class="lbl">2D rigid-body equilibrium</span>ΣF<sub>x</sub> = 0, &nbsp;ΣF<sub>y</sub> = 0, &nbsp;ΣM<sub>A</sub> = 0 &nbsp;— three equations, up to three unknowns</div>
<div class="meo"><p><strong>Tip:</strong> take moments about the point where the most unknowns act (usually a pin): the moment equation then has only one unknown.</p></div>
<h3>✍️ Example 1 — simply supported beam</h3>
<div class="callout"><p>Beam AB, length 6 m: pin at A (x = 0), roller at B (x = 6 m). Loads: point load 10 kN downward at x = 2 m, and a uniform load 2 kN/m over the full length.</p>
<p><b>FBD:</b> A<sub>x</sub>, A<sub>y</sub> at A; B<sub>y</sub> at B; 10 kN at 2 m; the uniform load replaced by 12 kN at 3 m.</p>
<p>ΣF<sub>x</sub> = 0 ⇒ A<sub>x</sub> = 0.</p>
<p>ΣM<sub>A</sub> = 0: B<sub>y</sub>·6 − 10·2 − 12·3 = 0 ⇒ <b>B<sub>y</sub> = 56/6 = 9.33 kN</b>.</p>
<p>ΣF<sub>y</sub> = 0: A<sub>y</sub> + 9.33 − 10 − 12 = 0 ⇒ <b>A<sub>y</sub> = 12.67 kN</b>.</p>
<p>Check with ΣM<sub>B</sub> = 0: −A<sub>y</sub>·6 + 10·4 + 12·3 = −76 + 76 = 0 ✓. (We reuse this beam in Chapter 6.)</p></div>
<h3>✍️ Example 2 — cantilever</h3>
<div class="callout"><p>A 1.5 m robot arm link is clamped (fixed) at A and holds a 5 kg gripper plus payload at its tip (W = 49.05 N). Ignoring the link's own weight: A<sub>y</sub> = <b>49.05 N</b> up, and the fixed-end moment M<sub>A</sub> = 49.05 × 1.5 = <b>73.6 N·m</b> (CCW, holding the arm up). This is exactly the holding torque a joint motor (after its gearbox) must supply.</p></div>
<h3>Determinacy and 3D equilibrium</h3>
<p>If the number of unknown reactions equals the number of independent equilibrium equations (and the supports are properly arranged), the body is <strong>statically determinate</strong>. More unknowns ⇒ <strong>statically indeterminate</strong> — deformation must be considered (Chapter 5). In 3D there are <strong>six</strong> equations: ΣF<sub>x</sub> = ΣF<sub>y</sub> = ΣF<sub>z</sub> = 0 and ΣM<sub>x</sub> = ΣM<sub>y</sub> = ΣM<sub>z</sub> = 0; a 3D fixed support has six reactions, a ball-and-socket three, a journal bearing typically two forces.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Giving a roller a horizontal reaction, or forgetting the moment at a fixed support.</li><li>Taking moments with the distributed load at the wrong position.</li><li>Not checking the answer with an extra moment equation.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Roller 1, pin 2, fixed support 3 unknowns (2D).</li><li>2D: three equations; take moments where unknowns meet.</li><li>Check with a second moment equation.</li><li>3D: six equations; indeterminate problems need deformation.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(ES + 'Chapter_05-free-body-diagrams.html', 'Engineering Statics — Free-body diagrams of rigid bodies'),
    A(ES + 'Chapter_05-2d-rigid-body-equilibrium.html', 'Engineering Statics — 2D rigid-body equilibrium'),
    A(ES + 'Chapter_05-3d-rigid-body-equilibrium.html', 'Engineering Statics — 3D rigid-body equilibrium'),
    A(OSP + '12-2-examples-of-static-equilibrium', 'OpenStax 12.2 — Examples of static equilibrium'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A 4 m simply supported beam carries 8 kN at its midpoint. Find the reactions.</li><li>A 3 m cantilever carries a uniform load of 1 kN/m. Find the fixed-end reactions.</li><li>A 5 m beam: pin at A, roller at B, a single 15 kN load at 1 m from A. Find A<sub>y</sub> and B<sub>y</sub>.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 4 kN each. 2) A<sub>y</sub> = 3 kN, M<sub>A</sub> = 3 × 1.5 = 4.5 kN·m. 3) B<sub>y</sub> = 15 × 1/5 = 3 kN; A<sub>y</sub> = 12 kN.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 2 · Bài 2.3</span>
<h2>Liên kết và cân bằng vật rắn</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Biết phản lực do các liên kết thường gặp tạo ra.</li><li>Giải bài toán cân bằng vật rắn phẳng với ΣF<sub>x</sub> = ΣF<sub>y</sub> = ΣM = 0.</li><li>Phân biệt bài toán tĩnh định và siêu tĩnh; biết sáu phương trình trong không gian.</li></ul>
<h3>Phản lực liên kết (2D)</h3>
<table>
<tr><th>Liên kết</th><th>Ngăn cản</th><th>Phản lực (ẩn)</th></tr>
<tr><td>Con lăn / mặt nhẵn</td><td>chuyển động vuông góc mặt tựa</td><td>1 lực, vuông góc mặt tựa</td></tr>
<tr><td>Dây / thanh hai lực</td><td>chuyển động dọc dây</td><td>1 lực dọc dây (kéo)</td></tr>
<tr><td>Khớp bản lề (gối cố định)</td><td>tịnh tiến theo x và y</td><td>2 lực A<sub>x</sub>, A<sub>y</sub></td></tr>
<tr><td>Ngàm (kẹp chặt, hàn)</td><td>tịnh tiến và quay</td><td>A<sub>x</sub>, A<sub>y</sub> và mômen M<sub>A</sub></td></tr>
</table>
<p>Quy tắc: <em>liên kết ngăn tịnh tiến theo phương nào thì có lực theo phương đó; ngăn quay thì có ngẫu lực.</em></p>
<div class="formula"><span class="lbl">Cân bằng vật rắn phẳng</span>ΣF<sub>x</sub> = 0, &nbsp;ΣF<sub>y</sub> = 0, &nbsp;ΣM<sub>A</sub> = 0 &nbsp;— ba phương trình, tối đa ba ẩn</div>
<div class="meo"><p><strong>Mẹo:</strong> lấy mômen đối với điểm có nhiều ẩn nhất đi qua (thường là khớp bản lề): phương trình mômen khi đó chỉ còn một ẩn.</p></div>
<h3>✍️ Ví dụ 1 — dầm đơn giản</h3>
<div class="callout"><p>Dầm AB dài 6 m: khớp bản lề tại A (x = 0), con lăn tại B (x = 6 m). Tải: lực tập trung 10 kN hướng xuống tại x = 2 m, và tải đều 2 kN/m trên toàn chiều dài.</p>
<p><b>FBD:</b> A<sub>x</sub>, A<sub>y</sub> tại A; B<sub>y</sub> tại B; 10 kN tại 2 m; tải đều thay bằng 12 kN tại 3 m.</p>
<p>ΣF<sub>x</sub> = 0 ⇒ A<sub>x</sub> = 0.</p>
<p>ΣM<sub>A</sub> = 0: B<sub>y</sub>·6 − 10·2 − 12·3 = 0 ⇒ <b>B<sub>y</sub> = 56/6 = 9,33 kN</b>.</p>
<p>ΣF<sub>y</sub> = 0: A<sub>y</sub> + 9,33 − 10 − 12 = 0 ⇒ <b>A<sub>y</sub> = 12,67 kN</b>.</p>
<p>Kiểm bằng ΣM<sub>B</sub> = 0: −A<sub>y</sub>·6 + 10·4 + 12·3 = −76 + 76 = 0 ✓. (Dầm này dùng lại ở Chương 6.)</p></div>
<h3>✍️ Ví dụ 2 — dầm công-xôn</h3>
<div class="callout"><p>Khâu tay robot dài 1,5 m bị ngàm tại A và mang tay gắp cộng tải 5 kg ở đầu (W = 49,05 N). Bỏ qua trọng lượng khâu: A<sub>y</sub> = <b>49,05 N</b> hướng lên, mômen ngàm M<sub>A</sub> = 49,05 × 1,5 = <b>73,6 N·m</b> (CCW, giữ tay khỏi rơi). Đây chính là mômen giữ mà động cơ khớp (sau hộp số) phải cấp.</p></div>
<h3>Tĩnh định và cân bằng không gian</h3>
<p>Nếu số phản lực chưa biết bằng số phương trình cân bằng độc lập (và liên kết bố trí hợp lý), vật là <strong>tĩnh định</strong>. Nhiều ẩn hơn ⇒ <strong>siêu tĩnh</strong> — phải xét biến dạng (Chương 5). Trong không gian có <strong>sáu</strong> phương trình: ΣF<sub>x</sub> = ΣF<sub>y</sub> = ΣF<sub>z</sub> = 0 và ΣM<sub>x</sub> = ΣM<sub>y</sub> = ΣM<sub>z</sub> = 0; ngàm 3D có sáu phản lực, khớp cầu có ba, ổ đỡ trục thường có hai lực.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cho con lăn có phản lực ngang, hoặc quên mômen tại ngàm.</li><li>Lấy mômen với tải phân bố đặt sai vị trí.</li><li>Không kiểm lại bằng một phương trình mômen phụ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Con lăn 1, bản lề 2, ngàm 3 ẩn (phẳng).</li><li>Phẳng: ba phương trình; lấy mômen tại điểm các ẩn gặp nhau.</li><li>Kiểm lại bằng phương trình mômen thứ hai.</li><li>Không gian: sáu phương trình; bài siêu tĩnh cần xét biến dạng.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(ES + 'Chapter_05-free-body-diagrams.html', 'Engineering Statics — Sơ đồ vật tự do của vật rắn'),
    A(ES + 'Chapter_05-2d-rigid-body-equilibrium.html', 'Engineering Statics — Cân bằng vật rắn phẳng'),
    A(ES + 'Chapter_05-3d-rigid-body-equilibrium.html', 'Engineering Statics — Cân bằng vật rắn không gian'),
    A(OSP + '12-2-examples-of-static-equilibrium', 'OpenStax 12.2 — Ví dụ cân bằng tĩnh'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Dầm đơn giản dài 4 m chịu 8 kN ở giữa. Tìm phản lực.</li><li>Dầm công-xôn 3 m chịu tải đều 1 kN/m. Tìm phản lực ngàm.</li><li>Dầm 5 m: bản lề tại A, con lăn tại B, một lực 15 kN cách A 1 m. Tìm A<sub>y</sub>, B<sub>y</sub>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Mỗi gối 4 kN. 2) A<sub>y</sub> = 3 kN, M<sub>A</sub> = 3 × 1,5 = 4,5 kN·m. 3) B<sub>y</sub> = 15 × 1/5 = 3 kN; A<sub>y</sub> = 12 kN.</p></div>`);

const q2 = QZ(2, 'Quiz — Chapter 2: Moments and rigid-body equilibrium|||Quiz — Chương 2: Mômen và cân bằng vật rắn', 'Kiểm tra chương 2: mômen, tích có hướng, Varignon, ngẫu lực, tải phân bố, phản lực liên kết, cân bằng vật rắn.', [
  Q('q1', 'A 100 N force acts perpendicular to a 0.5 m lever. The moment about the pivot is|||Lực 100 N vuông góc đòn dài 0,5 m. Mômen đối với điểm tựa là',
    ['20 N·m|||20 N·m', '50 N·m|||50 N·m', '200 N·m|||200 N·m', '100 N·m|||100 N·m'], 1,
    'M = F·d = 100 × 0.5.|||M = F·d = 100 × 0,5.'),
  Q('q2', 'In M = F·d, d is|||Trong M = F·d, d là',
    ['distance to the point of application|||khoảng cách tới điểm đặt lực', 'perpendicular distance to the line of action|||khoảng cách vuông góc tới giá lực', 'length of the body|||chiều dài vật', 'any distance|||khoảng cách bất kỳ'], 1,
    'Only the perpendicular moment arm counts.|||Chỉ cánh tay đòn vuông góc mới đúng.'),
  Q('q3', 'r = (1, 0, 0) m and F = (0, 10, 0) N. r × F =|||r = (1, 0, 0) m và F = (0, 10, 0) N. r × F =',
    ['10 i N·m|||10 i N·m', '10 k N·m|||10 k N·m', '−10 k N·m|||−10 k N·m', '0|||0'], 1,
    'Mz = rx·Fy − ry·Fx = 1·10 = 10.|||Mz = rx·Fy − ry·Fx = 1·10 = 10.'),
  Q('q4', 'The moment of a couple about different points|||Mômen ngẫu lực đối với các điểm khác nhau thì',
    ['depends on the point|||phụ thuộc vào điểm', 'is the same about every point|||như nhau đối với mọi điểm', 'is zero|||bằng không', 'is maximum at the centre|||lớn nhất tại tâm'], 1,
    'A couple moment is a free vector.|||Mômen ngẫu là vector tự do.'),
  Q('q5', 'Moving a force F to a parallel line at distance d requires adding|||Dời lực F sang đường song song cách d phải thêm',
    ['nothing|||không gì cả', 'a couple F·d|||một ngẫu F·d', 'a force F/d|||một lực F/d', 'a force 2F|||một lực 2F'], 1,
    'Force-couple equivalence.|||Hệ lực–ngẫu tương đương.'),
  Q('q6', 'A uniform load of 3 kN/m over 4 m has a resultant of|||Tải đều 3 kN/m trên 4 m có hợp lực',
    ['3 kN at 2 m|||3 kN tại 2 m', '12 kN at 2 m|||12 kN tại 2 m', '12 kN at 4 m|||12 kN tại 4 m', '6 kN at 2 m|||6 kN tại 2 m'], 1,
    'Area = 12 kN; centroid at mid-length.|||Diện tích = 12 kN; trọng tâm ở giữa.'),
  Q('q7', 'A triangular load (0 to w₀ over L) has its resultant at|||Tải tam giác (0 tới w₀ trên L) có hợp lực đặt tại',
    ['L/2 from the zero end|||L/2 từ đầu bằng 0', '2L/3 from the zero end|||2L/3 từ đầu bằng 0', 'L/3 from the zero end|||L/3 từ đầu bằng 0', 'the peak|||đỉnh'], 1,
    'Centroid of a triangle: 1/3 from the tall side.|||Trọng tâm tam giác: cách cạnh cao 1/3.'),
  Q('q8', 'A fixed support in 2D provides|||Ngàm trong bài toán phẳng tạo ra',
    ['1 reaction|||1 phản lực', '2 forces|||2 lực', '2 forces and 1 moment|||2 lực và 1 mômen', 'only a moment|||chỉ một mômen'], 2,
    'It prevents both translations and rotation.|||Nó ngăn cả hai tịnh tiến và quay.'),
  Q('q9', 'A 6 m simple beam with 10 kN at 2 m from A (pin) and roller at B. B_y =|||Dầm đơn giản 6 m, 10 kN cách A (bản lề) 2 m, con lăn tại B. B_y =',
    ['3.33 kN|||3,33 kN', '6.67 kN|||6,67 kN', '5 kN|||5 kN', '10 kN|||10 kN'], 0,
    'ΣM_A: B_y·6 = 10·2 ⇒ B_y = 3.33 kN.|||ΣM_A: B_y·6 = 10·2 ⇒ B_y = 3,33 kN.'),
  Q('q10', 'How many independent equilibrium equations does a rigid body have in 3D?|||Vật rắn trong không gian có bao nhiêu phương trình cân bằng độc lập?',
    ['3|||3', '4|||4', '6|||6', '9|||9'], 2,
    'Three force and three moment equations.|||Ba phương trình lực và ba phương trình mômen.'),
]);

const ch2 = {
  title: 'Chapter 2 — Moments and rigid-body equilibrium|||Chương 2 — Mômen và cân bằng vật rắn',
  description: 'Mômen lực (vô hướng, vector, Varignon), ngẫu lực, hệ lực tương đương, tải phân bố, liên kết và cân bằng vật rắn 2D/3D (Hibbeler Statics ch.4–5).',
  lessons: [c21, c22, c23, q2],
};

// ───────────────────────────── Chương 3 ─────────────────────────────
const c31 = L('emm201c-ts-3-1',
  '3.1 — Plane trusses: the method of joints|||3.1 — Giàn phẳng: phương pháp tách nút',
  'Giả thiết giàn lý tưởng, thanh hai lực, kéo/nén; điều kiện tĩnh định m + r = 2j; phương pháp tách nút từng bước; thanh không lực.',
  `<span class="eyebrow">EMM201c · Chapter 3 · Lesson 3.1</span>
<h2>Plane trusses: the method of joints</h2>
<h3>🎯 Objectives</h3>
<ul><li>State the assumptions of an ideal truss and the meaning of a two-force member.</li><li>Find member forces with the method of joints.</li><li>Spot zero-force members by inspection.</li></ul>
<h3>What is a truss?</h3>
<p>A <strong>truss</strong> is a structure of slender straight members joined at their ends — roof trusses, bridges, crane booms, the triangulated frames of vehicle racks and robot gantries. Ideal-truss assumptions: (1) members are connected by <strong>frictionless pins</strong>; (2) loads act <strong>only at the joints</strong>; (3) member weight is neglected (or split to the joints). Then every member is a <strong>two-force member</strong>: it carries a single axial force — <strong>tension (T)</strong>, pulling on the joints, or <strong>compression (C)</strong>, pushing on them.</p>
<p>The basic stable unit is a <strong>triangle</strong>; a simple truss is built by adding two members and one joint at a time. With m members, r support reactions and j joints, a plane truss is statically determinate when <strong>m + r = 2j</strong> (and stable).</p>
<h3>Method of joints — procedure</h3>
<ol><li>Find the support reactions from the equilibrium of the whole truss.</li>
<li>Start at a joint with <strong>at most two unknown</strong> member forces.</li>
<li>Draw the joint's FBD; <strong>assume every unknown member is in tension</strong> (force pointing away from the joint).</li>
<li>Apply ΣF<sub>x</sub> = 0, ΣF<sub>y</sub> = 0. A positive answer = tension, negative = compression.</li>
<li>Move to the next joint with ≤ 2 unknowns, using the forces already found.</li></ol>
<h3>✍️ Worked example — a triangular truss</h3>
<div class="callout"><p>Joints: A(0, 0) pin, C(4, 0) m roller, B(2, 2) m apex. Members AB, BC, AC. A 10 kN load acts downward at B.</p>
<p><b>Reactions:</b> by symmetry A<sub>y</sub> = C<sub>y</sub> = <b>5 kN</b>, A<sub>x</sub> = 0. Check: m + r = 3 + 3 = 6 = 2j = 6 ✓.</p>
<p><b>Joint A:</b> AB is at 45°. ΣF<sub>y</sub>: 5 + F<sub>AB</sub> sin 45° = 0 ⇒ <b>F<sub>AB</sub> = −7.07 kN (C)</b>. ΣF<sub>x</sub>: F<sub>AC</sub> + F<sub>AB</sub> cos 45° = 0 ⇒ <b>F<sub>AC</sub> = +5 kN (T)</b>.</p>
<p><b>Joint C</b> by symmetry: F<sub>BC</sub> = <b>−7.07 kN (C)</b>. Joint B checks: the two compressive members push up on B with 2 × 7.07 sin 45° = 10 kN ✓.</p>
<p>Interpretation: the inclined rafters are in compression, the bottom tie in tension — exactly why a roof tie can be a thin rod or cable.</p></div>
<h3>Zero-force members</h3>
<ul><li>If only <strong>two non-collinear members</strong> meet at an unloaded, unsupported joint, both are zero-force members.</li>
<li>If <strong>three members</strong> meet at an unloaded joint and two are collinear, the third is a zero-force member.</li></ul>
<p>Zero-force members are not useless: they brace compression members against buckling and carry load when the loading changes.</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Starting at a joint with three unknowns.</li><li>Changing the sign convention halfway (always "tension positive").</li><li>Forgetting the reactions at support joints.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Ideal truss: pinned joints, loads at joints ⇒ two-force members.</li><li>Determinate & stable plane truss: m + r = 2j.</li><li>Joints: two equations each; assume tension; negative ⇒ compression.</li><li>Recognise zero-force members first to save work.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(ES + 'Chapter_06-trusses.html', 'Engineering Statics — Trusses'),
    A(ES + 'method-of-joints.html', 'Engineering Statics — Method of joints (interactive)'),
    A(WK + 'Truss', 'Wikipedia — Truss'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>In the example, change the load at B to 20 kN. What are the new member forces?</li><li>A truss has 9 members, 3 reactions and 6 joints. Is it determinate?</li><li>At an unloaded joint, members 1 and 2 are collinear and member 3 is at 60°. Force in member 3?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Everything doubles: AB = BC = 14.14 kN (C), AC = 10 kN (T). 2) 9 + 3 = 12 = 2 × 6 ✓ determinate (if stable). 3) Zero.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 3 · Bài 3.1</span>
<h2>Giàn phẳng: phương pháp tách nút</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nêu các giả thiết giàn lý tưởng và ý nghĩa thanh hai lực.</li><li>Tìm nội lực thanh bằng phương pháp tách nút.</li><li>Nhận ra thanh không lực bằng quan sát.</li></ul>
<h3>Giàn là gì?</h3>
<p><strong>Giàn</strong> là kết cấu gồm các thanh thẳng mảnh nối với nhau ở đầu — giàn mái, cầu, cần cẩu, khung giá nóc ô tô, khung cổng trục robot. Giả thiết giàn lý tưởng: (1) các thanh nối bằng <strong>chốt không ma sát</strong>; (2) tải <strong>chỉ đặt tại nút</strong>; (3) bỏ qua trọng lượng thanh (hoặc chia về nút). Khi đó mỗi thanh là <strong>thanh hai lực</strong>: chỉ chịu một lực dọc trục — <strong>kéo (T)</strong>, kéo các nút về phía thanh, hoặc <strong>nén (C)</strong>, đẩy các nút ra.</p>
<p>Đơn vị bất biến cơ bản là <strong>tam giác</strong>; giàn đơn giản được dựng bằng cách mỗi lần thêm hai thanh và một nút. Với m thanh, r phản lực và j nút, giàn phẳng tĩnh định khi <strong>m + r = 2j</strong> (và bất biến hình).</p>
<h3>Phương pháp tách nút — quy trình</h3>
<ol><li>Tìm phản lực gối từ cân bằng của cả giàn.</li>
<li>Bắt đầu tại nút có <strong>tối đa hai</strong> nội lực chưa biết.</li>
<li>Vẽ FBD của nút; <strong>giả thiết mọi thanh chưa biết đều chịu kéo</strong> (lực hướng ra khỏi nút).</li>
<li>Áp dụng ΣF<sub>x</sub> = 0, ΣF<sub>y</sub> = 0. Kết quả dương = kéo, âm = nén.</li>
<li>Chuyển sang nút tiếp theo có ≤ 2 ẩn, dùng các lực đã tìm.</li></ol>
<h3>✍️ Ví dụ giải — giàn tam giác</h3>
<div class="callout"><p>Nút: A(0, 0) bản lề, C(4, 0) m con lăn, B(2, 2) m đỉnh. Thanh AB, BC, AC. Lực 10 kN hướng xuống tại B.</p>
<p><b>Phản lực:</b> do đối xứng A<sub>y</sub> = C<sub>y</sub> = <b>5 kN</b>, A<sub>x</sub> = 0. Kiểm: m + r = 3 + 3 = 6 = 2j = 6 ✓.</p>
<p><b>Nút A:</b> AB nghiêng 45°. ΣF<sub>y</sub>: 5 + F<sub>AB</sub> sin 45° = 0 ⇒ <b>F<sub>AB</sub> = −7,07 kN (nén)</b>. ΣF<sub>x</sub>: F<sub>AC</sub> + F<sub>AB</sub> cos 45° = 0 ⇒ <b>F<sub>AC</sub> = +5 kN (kéo)</b>.</p>
<p><b>Nút C</b> do đối xứng: F<sub>BC</sub> = <b>−7,07 kN (nén)</b>. Kiểm nút B: hai thanh nén đẩy B lên một lực 2 × 7,07 sin 45° = 10 kN ✓.</p>
<p>Ý nghĩa: các thanh kèo xiên chịu nén, thanh căng dưới chịu kéo — vì vậy thanh căng mái có thể là thanh tròn mảnh hoặc cáp.</p></div>
<h3>Thanh không lực</h3>
<ul><li>Nếu chỉ <strong>hai thanh không thẳng hàng</strong> gặp nhau tại một nút không tải, không gối, thì cả hai là thanh không lực.</li>
<li>Nếu <strong>ba thanh</strong> gặp nhau tại nút không tải và hai thanh thẳng hàng, thì thanh thứ ba là thanh không lực.</li></ul>
<p>Thanh không lực không vô dụng: chúng giằng thanh nén chống mất ổn định và chịu lực khi tải thay đổi.</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Bắt đầu ở nút có ba ẩn.</li><li>Đổi quy ước dấu giữa chừng (luôn "kéo dương").</li><li>Quên phản lực tại các nút gối.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Giàn lý tưởng: nút khớp, tải tại nút ⇒ thanh hai lực.</li><li>Giàn phẳng tĩnh định và bất biến: m + r = 2j.</li><li>Tách nút: mỗi nút hai phương trình; giả thiết kéo; âm ⇒ nén.</li><li>Nhận ra thanh không lực trước để đỡ tính.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(ES + 'Chapter_06-trusses.html', 'Engineering Statics — Giàn'),
    A(ES + 'method-of-joints.html', 'Engineering Statics — Phương pháp tách nút (tương tác)'),
    A(WK + 'Truss', 'Wikipedia — Giàn (Truss)'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Trong ví dụ, đổi tải tại B thành 20 kN. Nội lực mới?</li><li>Giàn có 9 thanh, 3 phản lực, 6 nút. Có tĩnh định không?</li><li>Tại nút không tải, thanh 1 và 2 thẳng hàng, thanh 3 nghiêng 60°. Lực trong thanh 3?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Mọi lực tăng gấp đôi: AB = BC = 14,14 kN (nén), AC = 10 kN (kéo). 2) 9 + 3 = 12 = 2 × 6 ✓ tĩnh định (nếu bất biến hình). 3) Bằng không.</p></div>`);

const c32 = L('emm201c-ts-3-2',
  '3.2 — Plane trusses: the method of sections|||3.2 — Giàn phẳng: phương pháp mặt cắt',
  'Cắt giàn qua tối đa ba thanh, lấy mômen tại giao điểm hai thanh; ví dụ giàn Pratt 4 khoang: thanh biên trên, biên dưới, thanh xiên; thanh không lực.',
  `<span class="eyebrow">EMM201c · Chapter 3 · Lesson 3.2</span>
<h2>Plane trusses: the method of sections</h2>
<h3>🎯 Objectives</h3>
<ul><li>Cut a truss through at most three members and use the equilibrium of one part.</li><li>Choose moment points that eliminate two unknowns at once.</li><li>Find the force in one specific member quickly, without solving every joint.</li></ul>
<h3>Idea</h3>
<p>If you only need the force in a member in the middle of a long truss, the method of joints wastes time. Instead, pass an imaginary <strong>section</strong> through the truss, cutting the member of interest and <strong>no more than three members</strong> in total whose forces are unknown. Either part of the truss must be in equilibrium, so three equations (ΣF<sub>x</sub>, ΣF<sub>y</sub>, ΣM) give three unknowns. The trick: take moments about the <strong>point where two of the cut members intersect</strong> — the equation then contains a single unknown.</p>
<h3>✍️ Worked example — Pratt truss</h3>
<div class="callout"><p>A bridge truss spans 12 m in four 3 m panels and is 3 m high. Bottom joints: L0 (0, 0) pin, L1 (3, 0), L2 (6, 0), L3 (9, 0), L4 (12, 0) roller. Top joints: U1 (3, 3), U2 (6, 3), U3 (9, 3). Members: bottom chord L0–L4, top chord U1–U3, end diagonals L0U1 and U3L4, verticals U1L1, U2L2, U3L3, and diagonals U1L2 and U3L2 (sloping down toward the centre). Loads: 10 kN downward at L1, L2 and L3.</p>
<p><b>Reactions:</b> by symmetry L0<sub>y</sub> = L4<sub>y</sub> = <b>15 kN</b>.</p>
<p><b>Section</b> through U1U2, U1L2 and L1L2; keep the left part (L0, L1, U1). Assume all three cut members in tension.</p>
<p><b>Top chord U1U2:</b> moments about L2 (6, 0), where the other two cut members meet: −15·6 + 10·3 − 3·F<sub>U1U2</sub> = 0 ⇒ <b>F<sub>U1U2</sub> = −20 kN (C)</b>.</p>
<p><b>Bottom chord L1L2:</b> moments about U1 (3, 3): −15·3 + 3·F<sub>L1L2</sub> = 0 ⇒ <b>F<sub>L1L2</sub> = +15 kN (T)</b>.</p>
<p><b>Diagonal U1L2</b> (at 45°): ΣF<sub>y</sub>: 15 − 10 − F<sub>U1L2</sub> sin 45° = 0 ⇒ <b>F<sub>U1L2</sub> = +7.07 kN (T)</b>.</p>
<p>Check ΣF<sub>x</sub>: −20 + 15 + 7.07 cos 45° = −20 + 15 + 5 = 0 ✓. A full joint-by-joint solution (checked numerically) gives the same values, plus U1L1 = 10 kN (T) and U2L2 = 0 (a zero-force member under this loading).</p></div>
<h3>Reading the result like an engineer</h3>
<ul><li>A simply supported truss behaves like a beam: the <strong>top chord is in compression</strong> and the <strong>bottom chord in tension</strong>; chord forces are largest near mid-span (where the bending moment is largest).</li>
<li>The diagonals carry the <strong>shear</strong>; in a Pratt truss the diagonals are in tension, so they can be slender, while the shorter verticals take compression.</li>
<li>Compression members must also be checked for <strong>buckling</strong> (Chapter 6).</li></ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Cutting four unknown members — then the part cannot be solved directly.</li><li>Including loads from the part you threw away.</li><li>Using the length of a member as its moment arm instead of the perpendicular distance from the moment point.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Section through ≤ 3 unknown members; keep the simpler part.</li><li>Moments about the intersection of two cut members ⇒ one unknown.</li><li>Vertical force balance gives the diagonal (shear) force.</li><li>Top chord in compression, bottom chord in tension for gravity loads.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(ES + 'method-of-sections.html', 'Engineering Statics — Method of sections'),
    A(ES + 'Chapter_05-stability-and-determinacy.html', 'Engineering Statics — Stability and determinacy'),
    A(OCW_MOM, 'MIT OCW 2.001 — Mechanics &amp; Materials I (truss problem sets)'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>In the example, cut through U2U3, U3L2 and L2L3 and keep the right part. Find F<sub>U2U3</sub>.</li><li>Find the force in the end diagonal L0U1 from joint L0.</li><li>If all three loads become 20 kN, what is F<sub>L1L2</sub>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) By symmetry −20 kN (C). 2) ΣF<sub>y</sub> at L0: 15 + F sin 45° = 0 ⇒ F = −21.2 kN (C). 3) Linear ⇒ 30 kN (T).</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 3 · Bài 3.2</span>
<h2>Giàn phẳng: phương pháp mặt cắt</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Cắt giàn qua tối đa ba thanh và dùng cân bằng của một phần.</li><li>Chọn điểm lấy mômen để loại hai ẩn cùng lúc.</li><li>Tìm nhanh lực trong một thanh cụ thể mà không giải mọi nút.</li></ul>
<h3>Ý tưởng</h3>
<p>Nếu chỉ cần lực trong một thanh ở giữa một giàn dài, tách nút rất mất thời gian. Thay vào đó, vẽ một <strong>mặt cắt</strong> tưởng tượng qua giàn, cắt thanh cần tìm và <strong>không quá ba thanh</strong> chưa biết lực. Mỗi phần của giàn đều cân bằng, nên ba phương trình (ΣF<sub>x</sub>, ΣF<sub>y</sub>, ΣM) cho ba ẩn. Mẹo: lấy mômen đối với <strong>giao điểm của hai thanh bị cắt</strong> — phương trình chỉ còn một ẩn.</p>
<h3>✍️ Ví dụ giải — giàn Pratt</h3>
<div class="callout"><p>Giàn cầu nhịp 12 m, bốn khoang 3 m, cao 3 m. Nút dưới: L0 (0, 0) bản lề, L1 (3, 0), L2 (6, 0), L3 (9, 0), L4 (12, 0) con lăn. Nút trên: U1 (3, 3), U2 (6, 3), U3 (9, 3). Thanh: biên dưới L0–L4, biên trên U1–U3, thanh xiên đầu L0U1 và U3L4, thanh đứng U1L1, U2L2, U3L3, thanh xiên U1L2 và U3L2 (dốc xuống về giữa nhịp). Tải: 10 kN hướng xuống tại L1, L2, L3.</p>
<p><b>Phản lực:</b> do đối xứng L0<sub>y</sub> = L4<sub>y</sub> = <b>15 kN</b>.</p>
<p><b>Mặt cắt</b> qua U1U2, U1L2 và L1L2; giữ phần trái (L0, L1, U1). Giả thiết cả ba thanh bị cắt chịu kéo.</p>
<p><b>Biên trên U1U2:</b> lấy mômen tại L2 (6, 0), nơi hai thanh cắt kia gặp nhau: −15·6 + 10·3 − 3·F<sub>U1U2</sub> = 0 ⇒ <b>F<sub>U1U2</sub> = −20 kN (nén)</b>.</p>
<p><b>Biên dưới L1L2:</b> mômen tại U1 (3, 3): −15·3 + 3·F<sub>L1L2</sub> = 0 ⇒ <b>F<sub>L1L2</sub> = +15 kN (kéo)</b>.</p>
<p><b>Thanh xiên U1L2</b> (45°): ΣF<sub>y</sub>: 15 − 10 − F<sub>U1L2</sub> sin 45° = 0 ⇒ <b>F<sub>U1L2</sub> = +7,07 kN (kéo)</b>.</p>
<p>Kiểm ΣF<sub>x</sub>: −20 + 15 + 7,07 cos 45° = −20 + 15 + 5 = 0 ✓. Giải toàn bộ các nút (đã kiểm bằng máy) cho cùng giá trị, thêm U1L1 = 10 kN (kéo) và U2L2 = 0 (thanh không lực với tải này).</p></div>
<h3>Đọc kết quả như kỹ sư</h3>
<ul><li>Giàn tựa đơn giản làm việc như một dầm: <strong>biên trên chịu nén</strong>, <strong>biên dưới chịu kéo</strong>; lực biên lớn nhất gần giữa nhịp (nơi mômen uốn lớn nhất).</li>
<li>Thanh xiên chịu <strong>lực cắt</strong>; ở giàn Pratt thanh xiên chịu kéo nên có thể mảnh, còn thanh đứng ngắn chịu nén.</li>
<li>Thanh chịu nén còn phải kiểm <strong>ổn định (mất ổn định/oằn)</strong> (Chương 6).</li></ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cắt qua bốn thanh chưa biết — khi đó không giải trực tiếp được.</li><li>Đưa vào tải của phần đã bỏ đi.</li><li>Dùng chiều dài thanh làm cánh tay đòn thay vì khoảng cách vuông góc từ điểm lấy mômen.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Mặt cắt qua ≤ 3 thanh chưa biết; giữ phần đơn giản hơn.</li><li>Mômen tại giao điểm hai thanh bị cắt ⇒ một ẩn.</li><li>Cân bằng lực đứng cho lực thanh xiên (lực cắt).</li><li>Tải trọng lực: biên trên nén, biên dưới kéo.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(ES + 'method-of-sections.html', 'Engineering Statics — Phương pháp mặt cắt'),
    A(ES + 'Chapter_05-stability-and-determinacy.html', 'Engineering Statics — Bất biến hình và tĩnh định'),
    A(OCW_MOM, 'MIT OCW 2.001 — Mechanics &amp; Materials I (bài tập giàn)'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Trong ví dụ, cắt qua U2U3, U3L2, L2L3 và giữ phần phải. Tìm F<sub>U2U3</sub>.</li><li>Tìm lực thanh xiên đầu L0U1 từ nút L0.</li><li>Nếu cả ba tải thành 20 kN, F<sub>L1L2</sub> bằng bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Do đối xứng −20 kN (nén). 2) ΣF<sub>y</sub> tại L0: 15 + F sin 45° = 0 ⇒ F = −21,2 kN (nén). 3) Tuyến tính ⇒ 30 kN (kéo).</p></div>`);

const c33 = L('emm201c-ts-3-3',
  '3.3 — Frames and machines|||3.3 — Khung và cơ cấu máy',
  'Khác biệt giàn – khung – máy; thanh nhiều lực; tách từng chi tiết, định luật 3 Newton tại chốt; ví dụ kìm (lợi thế cơ học) và giá đỡ có thanh chống.',
  `<span class="eyebrow">EMM201c · Chapter 3 · Lesson 3.3</span>
<h2>Frames and machines</h2>
<h3>🎯 Objectives</h3>
<ul><li>Distinguish trusses, frames and machines.</li><li>Dismember a structure and apply Newton's third law at the pins.</li><li>Compute the mechanical advantage of a simple machine (pliers, lever, toggle).</li></ul>
<h3>Frames vs machines</h3>
<p><strong>Frames</strong> (stationary structures) and <strong>machines</strong> (which transmit and modify forces — pliers, brakes, linkages, robot grippers) contain at least one <strong>multi-force member</strong>: a member loaded at three or more points, or by forces not along its axis. Such members carry bending, not just axial force, so the method of joints does not apply.</p>
<h3>Procedure</h3>
<ol><li>Identify <strong>two-force members</strong> first — their force is along the line joining their two pins (one unknown instead of two).</li>
<li>If useful, find external reactions from the whole structure.</li>
<li><strong>Dismember</strong>: draw a separate FBD for each member. At each pin, the force on one member is equal and opposite to the force on the other (Newton's third law) — use the <em>same symbols</em> with opposite arrows.</li>
<li>Write equilibrium equations for each member, starting where unknowns are fewest.</li></ol>
<h3>✍️ Example 1 — pliers (a machine)</h3>
<div class="callout"><p>Each handle of a pair of pliers is a lever pivoting about the central pin O. The hand squeezes with P = 100 N at 120 mm from O; the jaws touch the object 30 mm from O.</p>
<p>FBD of one handle-jaw member: P at 120 mm, jaw reaction F at 30 mm, pin force at O. ΣM<sub>O</sub> = 0: 100 × 120 = F × 30 ⇒ <b>F = 400 N</b>.</p>
<p>Mechanical advantage = F/P = 120/30 = <b>4</b>. ΣF = 0 on the member: the pin carries 100 + 400 = <b>500 N</b> — the pin must be strong enough for this (shear check, Chapter 5).</p></div>
<h3>✍️ Example 2 — wall bracket with a strut (a frame)</h3>
<div class="callout"><p>A horizontal beam AB, 2 m long, is pinned to a wall at A and carries 3 kN at its free end B. A strut BC runs from B down to a wall pin C located 1.5 m below A. The strut is a <b>two-force member</b>: its line BC has horizontal run 2 m and drop 1.5 m, so length 2.5 m.</p>
<p>FBD of the beam AB: A<sub>x</sub>, A<sub>y</sub> at A; strut force F<sub>BC</sub> at B along BC; 3 kN down at B.</p>
<p>ΣM<sub>A</sub> = 0: (vertical component of F<sub>BC</sub>) × 2 = 3 × 2 ⇒ F<sub>BC</sub>·(1.5/2.5) = 3 ⇒ <b>F<sub>BC</sub> = 5 kN (compression)</b>.</p>
<p>Horizontal component of the strut force = 5 × 2/2.5 = 4 kN pushing the beam toward the wall ⇒ horizontal balance needs <b>A<sub>x</sub> = 4 kN</b> pulling the beam away from the wall (pin A is pulled out), and ΣF<sub>y</sub>: A<sub>y</sub> + 3 − 3 = 0 ⇒ <b>A<sub>y</sub> = 0</b>.</p>
<p>Engineering meaning: the upper wall anchor A is pulled out with 4 kN, the lower anchor C is pushed in with 4 kN horizontally and carries 3 kN vertically.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Treating a multi-force member as a two-force member.</li><li>Drawing pin forces in the same direction on both connected members (they must be opposite).</li><li>Counting internal pin forces when writing equilibrium of the whole structure (they cancel).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Frames and machines contain multi-force members.</li><li>Find two-force members first; dismember; Newton's third law at pins.</li><li>Mechanical advantage of a lever = ratio of moment arms.</li><li>Pins in machines carry large forces — check them.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(ES + 'frames-and-machines.html', 'Engineering Statics — Frames and machines'),
    A(ES + 'Chapter_06-interactions-between-members.html', 'Engineering Statics — Interactions between members'),
    A(OSP + '12-2-examples-of-static-equilibrium', 'OpenStax 12.2 — Examples of static equilibrium'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>Bolt cutters: hand force 200 N at 400 mm from the pivot, blade at 50 mm. Blade force?</li><li>In Example 2, the strut is moved so that C is 2 m below A. Find F<sub>BC</sub>.</li><li>Why is the strut in Example 2 a two-force member while beam AB is not?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 200 × 400/50 = 1600 N. 2) BC length = √(2<sup>2</sup> + 2<sup>2</sup>) = 2.83 m; F·(2/2.83) = 3 ⇒ F = 4.24 kN (C). 3) The strut is loaded only at its two pins; AB is loaded at A, at B by the strut and by the 3 kN load — and in general such members are loaded at three points, giving bending.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 3 · Bài 3.3</span>
<h2>Khung và cơ cấu máy</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân biệt giàn, khung và máy.</li><li>Tách rời kết cấu và áp dụng định luật 3 Newton tại chốt.</li><li>Tính lợi thế cơ học của máy đơn giản (kìm, đòn bẩy, cơ cấu khuỷu).</li></ul>
<h3>Khung và máy</h3>
<p><strong>Khung</strong> (kết cấu đứng yên) và <strong>máy</strong> (truyền và biến đổi lực — kìm, phanh, cơ cấu thanh, tay gắp robot) có ít nhất một <strong>thanh nhiều lực</strong>: thanh chịu lực tại ba điểm trở lên, hoặc chịu lực không dọc trục. Những thanh này chịu uốn chứ không chỉ chịu lực dọc trục, nên không dùng được phương pháp tách nút.</p>
<h3>Quy trình</h3>
<ol><li>Nhận ra <strong>thanh hai lực</strong> trước — lực của nó dọc đường nối hai chốt (một ẩn thay vì hai).</li>
<li>Nếu có ích, tìm phản lực ngoài từ cân bằng của cả kết cấu.</li>
<li><strong>Tách rời</strong>: vẽ FBD riêng cho từng thanh. Tại mỗi chốt, lực lên thanh này bằng và ngược chiều lực lên thanh kia (định luật 3 Newton) — dùng <em>cùng ký hiệu</em> với mũi tên ngược nhau.</li>
<li>Viết phương trình cân bằng cho từng thanh, bắt đầu ở thanh ít ẩn nhất.</li></ol>
<h3>✍️ Ví dụ 1 — cái kìm (máy)</h3>
<div class="callout"><p>Mỗi càng kìm là một đòn bẩy quay quanh chốt giữa O. Tay bóp với P = 100 N cách O 120 mm; mỏ kìm tiếp xúc vật cách O 30 mm.</p>
<p>FBD một càng–mỏ: P tại 120 mm, phản lực mỏ F tại 30 mm, lực chốt tại O. ΣM<sub>O</sub> = 0: 100 × 120 = F × 30 ⇒ <b>F = 400 N</b>.</p>
<p>Lợi thế cơ học = F/P = 120/30 = <b>4</b>. ΣF = 0 trên càng: chốt chịu 100 + 400 = <b>500 N</b> — chốt phải đủ bền (kiểm cắt, Chương 5).</p></div>
<h3>✍️ Ví dụ 2 — giá đỡ tường có thanh chống (khung)</h3>
<div class="callout"><p>Dầm ngang AB dài 2 m, nối khớp vào tường tại A, mang 3 kN ở đầu tự do B. Thanh chống BC đi từ B xuống chốt tường C nằm dưới A 1,5 m. Thanh chống là <b>thanh hai lực</b>: đường BC có hình chiếu ngang 2 m và chiều cao 1,5 m, dài 2,5 m.</p>
<p>FBD dầm AB: A<sub>x</sub>, A<sub>y</sub> tại A; lực thanh chống F<sub>BC</sub> tại B dọc BC; 3 kN hướng xuống tại B.</p>
<p>ΣM<sub>A</sub> = 0: (thành phần đứng của F<sub>BC</sub>) × 2 = 3 × 2 ⇒ F<sub>BC</sub>·(1,5/2,5) = 3 ⇒ <b>F<sub>BC</sub> = 5 kN (nén)</b>.</p>
<p>Thành phần ngang của lực chống = 5 × 2/2,5 = 4 kN đẩy dầm về phía tường ⇒ cân bằng ngang cần <b>A<sub>x</sub> = 4 kN</b> kéo dầm ra khỏi tường (chốt A bị nhổ ra); ΣF<sub>y</sub>: A<sub>y</sub> + 3 − 3 = 0 ⇒ <b>A<sub>y</sub> = 0</b>.</p>
<p>Ý nghĩa kỹ thuật: neo trên A bị kéo nhổ 4 kN, neo dưới C bị ép vào tường 4 kN theo phương ngang và chịu 3 kN theo phương đứng.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Coi thanh nhiều lực là thanh hai lực.</li><li>Vẽ lực chốt cùng chiều trên hai thanh nối nhau (phải ngược chiều).</li><li>Tính cả lực chốt nội bộ khi viết cân bằng cho toàn kết cấu (chúng triệt tiêu).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Khung và máy có thanh nhiều lực.</li><li>Tìm thanh hai lực trước; tách rời; định luật 3 Newton tại chốt.</li><li>Lợi thế cơ học của đòn bẩy = tỉ số cánh tay đòn.</li><li>Chốt trong máy chịu lực lớn — phải kiểm.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(ES + 'frames-and-machines.html', 'Engineering Statics — Khung và máy'),
    A(ES + 'Chapter_06-interactions-between-members.html', 'Engineering Statics — Tương tác giữa các thanh'),
    A(OSP + '12-2-examples-of-static-equilibrium', 'OpenStax 12.2 — Ví dụ cân bằng tĩnh'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Kìm cộng lực: tay bóp 200 N cách chốt 400 mm, lưỡi cắt cách chốt 50 mm. Lực lưỡi cắt?</li><li>Trong Ví dụ 2, dời C xuống dưới A 2 m. Tìm F<sub>BC</sub>.</li><li>Vì sao thanh chống ở Ví dụ 2 là thanh hai lực còn dầm AB thì không?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 200 × 400/50 = 1600 N. 2) BC dài √(2<sup>2</sup> + 2<sup>2</sup>) = 2,83 m; F·(2/2,83) = 3 ⇒ F = 4,24 kN (nén). 3) Thanh chống chỉ chịu lực tại hai chốt; AB chịu lực tại A, tại B từ thanh chống và tải 3 kN — và nói chung các thanh như vậy chịu lực tại ba điểm, gây uốn.</p></div>`);

const q3 = QZ(3, 'Quiz — Chapter 3: Trusses, frames and machines|||Quiz — Chương 3: Giàn, khung và máy', 'Kiểm tra chương 3: giả thiết giàn, thanh hai lực, tách nút, mặt cắt, thanh không lực, khung và máy, lợi thế cơ học.', [
  Q('q1', 'In an ideal truss every member is|||Trong giàn lý tưởng mọi thanh là',
    ['a beam in bending|||dầm chịu uốn', 'a two-force member (axial force only)|||thanh hai lực (chỉ lực dọc trục)', 'a cable|||dây cáp', 'a fixed support|||ngàm'], 1,
    'Pinned ends and loads at joints ⇒ axial force only.|||Đầu khớp và tải tại nút ⇒ chỉ có lực dọc trục.'),
  Q('q2', 'A plane truss with m members, r reactions and j joints is determinate when|||Giàn phẳng m thanh, r phản lực, j nút là tĩnh định khi',
    ['m = j|||m = j', 'm + r = 2j|||m + r = 2j', 'm + r = 3j|||m + r = 3j', 'm = 2r|||m = 2r'], 1,
    'Two equations per joint must match the number of unknowns.|||Mỗi nút hai phương trình phải bằng số ẩn.'),
  Q('q3', 'With the "assume tension" convention, a negative member force means|||Với quy ước "giả thiết kéo", lực thanh âm nghĩa là',
    ['tension|||kéo', 'compression|||nén', 'zero force|||không lực', 'an error|||có lỗi'], 1,
    'Negative ⇒ the member pushes on the joint.|||Âm ⇒ thanh đẩy vào nút.'),
  Q('q4', 'Three members meet at an unloaded joint; two are collinear. The third member carries|||Ba thanh gặp nhau tại nút không tải; hai thanh thẳng hàng. Thanh thứ ba chịu',
    ['the same force as the others|||lực như hai thanh kia', 'zero force|||lực bằng không', 'twice the force|||lực gấp đôi', 'it depends on the angle|||tuỳ góc'], 1,
    'Equilibrium perpendicular to the collinear pair forces it to zero.|||Cân bằng theo phương vuông góc với cặp thẳng hàng buộc nó bằng 0.'),
  Q('q5', 'In the method of sections, the cut should pass through at most|||Trong phương pháp mặt cắt, mặt cắt nên đi qua tối đa',
    ['one unknown member|||một thanh chưa biết', 'two unknown members|||hai thanh chưa biết', 'three unknown members|||ba thanh chưa biết', 'any number|||bao nhiêu cũng được'], 2,
    'Three equations for one part of the truss.|||Ba phương trình cho một phần giàn.'),
  Q('q6', 'To find a top-chord force directly, take moments about|||Để tìm trực tiếp lực biên trên, lấy mômen đối với',
    ['a support far away|||một gối ở xa', 'the intersection of the other two cut members|||giao điểm của hai thanh bị cắt còn lại', 'the centroid of the truss|||trọng tâm giàn', 'any point|||điểm bất kỳ'], 1,
    'Their moment is zero there, leaving one unknown.|||Mômen của chúng bằng 0 tại đó, còn một ẩn.'),
  Q('q7', 'Under gravity loads, the top chord of a simply supported truss is usually in|||Dưới tải trọng lực, biên trên của giàn tựa đơn giản thường chịu',
    ['tension|||kéo', 'compression|||nén', 'zero force|||không lực', 'torsion|||xoắn'], 1,
    'Like a beam: compression on top, tension at the bottom.|||Như dầm: nén ở trên, kéo ở dưới.'),
  Q('q8', 'A member loaded at three points is called|||Thanh chịu lực tại ba điểm gọi là',
    ['a two-force member|||thanh hai lực', 'a multi-force member|||thanh nhiều lực', 'a zero-force member|||thanh không lực', 'a cable|||dây cáp'], 1,
    'It carries bending as well as axial force.|||Nó chịu cả uốn lẫn lực dọc.'),
  Q('q9', 'Pliers: 50 N at 100 mm from the pin, jaw at 25 mm. Jaw force =|||Kìm: 50 N cách chốt 100 mm, mỏ cách chốt 25 mm. Lực mỏ =',
    ['12.5 N|||12,5 N', '200 N|||200 N', '125 N|||125 N', '50 N|||50 N'], 1,
    '50 × 100/25 = 200 N.|||50 × 100/25 = 200 N.'),
  Q('q10', 'At a pin connecting two members of a frame, the forces on the two members are|||Tại chốt nối hai thanh của khung, lực lên hai thanh',
    ['equal and in the same direction|||bằng nhau và cùng chiều', 'equal and opposite|||bằng nhau và ngược chiều', 'unrelated|||không liên quan', 'always zero|||luôn bằng 0'], 1,
    'Newton\'s third law.|||Định luật 3 Newton.'),
]);

const ch3 = {
  title: 'Chapter 3 — Structural analysis: trusses, frames and machines|||Chương 3 — Phân tích kết cấu: giàn, khung và máy',
  description: 'Giàn phẳng (tách nút, mặt cắt, thanh không lực), khung và máy, lợi thế cơ học (Hibbeler Statics ch.6).',
  lessons: [c31, c32, c33, q3],
};

// ───────────────────────────── Chương 4 ─────────────────────────────
const c41 = L('emm201c-ts-4-1',
  '4.1 — Dry friction: sliding, impending motion and tipping|||4.1 — Ma sát khô: trượt, sắp trượt và lật',
  'Định luật Coulomb F ≤ μs·N, μk; góc ma sát; ba trạng thái (đứng yên, sắp trượt, trượt); vật trên mặt nghiêng; trượt hay lật.',
  `<span class="eyebrow">EMM201c · Chapter 4 · Lesson 4.1</span>
<h2>Dry friction: sliding, impending motion and tipping</h2>
<h3>🎯 Objectives</h3>
<ul><li>Apply Coulomb's friction law correctly in the three possible states.</li><li>Solve block-on-incline problems.</li><li>Decide whether a body slides or tips first.</li></ul>
<h3>Coulomb's law of dry friction</h3>
<p>When two dry surfaces press together with normal force N, the contact can transmit a tangential friction force F that opposes (impending) relative motion. Experiments show:</p>
<div class="formula"><span class="lbl">Coulomb friction</span>No slip: F ≤ μ<sub>s</sub>·N &nbsp;(F found from equilibrium)<br>Impending slip: F = μ<sub>s</sub>·N<br>Sliding: F = μ<sub>k</sub>·N, with μ<sub>k</sub> &lt; μ<sub>s</sub> (typically 20–25 % lower)</div>
<p>The <strong>angle of friction</strong> φ<sub>s</sub> = arctan μ<sub>s</sub> is the steepest incline on which a block can rest: a block slides by itself when tan θ &gt; μ<sub>s</sub>. Typical μ<sub>s</sub>: steel on steel (dry) ≈ 0.6–0.8, steel on steel (lubricated) ≈ 0.1, rubber tyre on dry asphalt ≈ 0.7–0.9, on wet asphalt ≈ 0.4–0.6 — always use data for your actual surfaces.</p>
<div class="note-ct"><p>Friction does <strong>not</strong> automatically equal μN. In a "will it slip?" problem, solve equilibrium assuming no slip, then compare the required F with μ<sub>s</sub>N.</p></div>
<h3>✍️ Example 1 — block on an incline</h3>
<div class="callout"><p>A 50 kg box (W = 490.5 N) rests on a ramp at θ = 25°, μ<sub>s</sub> = 0.30, μ<sub>k</sub> = 0.25. Axes along and normal to the ramp.</p>
<p>N = W cos 25° = <b>444.5 N</b>; component down the ramp W sin 25° = <b>207.3 N</b>; maximum static friction μ<sub>s</sub>N = <b>133.4 N</b>.</p>
<p>Since 207.3 &gt; 133.4 (equivalently tan 25° = 0.466 &gt; 0.30) the box <b>slides down</b>.</p>
<p>Minimum force P (up the ramp) to hold it: friction acts up the ramp at its maximum: P = W(sin θ − μ<sub>s</sub> cos θ) = <b>73.9 N</b>.</p>
<p>Force to push it up at constant speed: friction now acts down the ramp with μ<sub>k</sub>: P = W(sin θ + μ<sub>k</sub> cos θ) = <b>318.4 N</b>.</p></div>
<h3>✍️ Example 2 — slip or tip?</h3>
<div class="callout"><p>A 100 kg crate (W = 981 N), 0.6 m wide and 1.2 m tall, stands on a floor with μ<sub>s</sub> = 0.4. A worker pushes horizontally at height h = 1.0 m.</p>
<p><b>Slip</b> requires P = μ<sub>s</sub>W = 0.4 × 981 = <b>392.4 N</b>.</p>
<p><b>Tip</b> about the front bottom edge: at the moment of tipping the normal force moves to that edge, and ΣM<sub>edge</sub> = 0 gives P·h = W·(b/2) ⇒ P = 981 × 0.3/1.0 = <b>294.3 N</b>.</p>
<p>294.3 &lt; 392.4 ⇒ the crate <b>tips first</b>. Pushing lower (h &lt; 0.75 m) makes it slide instead.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Writing F = μN when the body is not on the verge of slipping.</li><li>Taking N = W on an incline or when other forces have vertical components.</li><li>Drawing friction in the wrong direction — it always opposes the (impending) relative motion.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Static: F ≤ μ<sub>s</sub>N; impending: F = μ<sub>s</sub>N; sliding: F = μ<sub>k</sub>N.</li><li>Self-sliding on an incline when tan θ &gt; μ<sub>s</sub>.</li><li>Check both slipping and tipping; the smaller force governs.</li><li>Find N from equilibrium, never assume it.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(ES + 'Chapter_09-dry-friction.html', 'Engineering Statics — Dry friction'),
    A(ES + 'Chapter_09-slipping-vs--tipping.html', 'Engineering Statics — Slipping vs. tipping'),
    A(OSP + '6-2-friction', 'OpenStax 6.2 — Friction'),
    A('https://www.engineeringtoolbox.com/friction-coefficients-d_778.html', 'Engineering ToolBox — Friction coefficients'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>What is the steepest ramp angle on which a box with μ<sub>s</sub> = 0.5 stays at rest?</li><li>A 20 kg block on a horizontal floor (μ<sub>s</sub> = 0.35) is pushed with 50 N. Does it move? What is the friction force?</li><li>In Example 2, at what push height does the crate slide and tip simultaneously?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) arctan 0.5 = 26.6°. 2) μ<sub>s</sub>N = 0.35 × 196.2 = 68.7 N &gt; 50 N ⇒ no motion; friction = 50 N (not 68.7 N). 3) 392.4·h = 981 × 0.3 ⇒ h = 0.75 m.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 4 · Bài 4.1</span>
<h2>Ma sát khô: trượt, sắp trượt và lật</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng đúng định luật ma sát Coulomb trong ba trạng thái có thể.</li><li>Giải bài toán vật trên mặt phẳng nghiêng.</li><li>Xác định vật trượt hay lật trước.</li></ul>
<h3>Định luật ma sát khô Coulomb</h3>
<p>Khi hai mặt khô ép vào nhau bằng lực pháp tuyến N, tiếp xúc có thể truyền một lực ma sát tiếp tuyến F chống lại chuyển động tương đối (hoặc xu hướng chuyển động). Thực nghiệm cho thấy:</p>
<div class="formula"><span class="lbl">Ma sát Coulomb</span>Chưa trượt: F ≤ μ<sub>s</sub>·N &nbsp;(F tìm từ cân bằng)<br>Sắp trượt: F = μ<sub>s</sub>·N<br>Đang trượt: F = μ<sub>k</sub>·N, với μ<sub>k</sub> &lt; μ<sub>s</sub> (thường thấp hơn 20–25 %)</div>
<p><strong>Góc ma sát</strong> φ<sub>s</sub> = arctan μ<sub>s</sub> là góc nghiêng lớn nhất mà vật còn nằm yên: vật tự trượt khi tan θ &gt; μ<sub>s</sub>. μ<sub>s</sub> điển hình: thép–thép khô ≈ 0,6–0,8, thép–thép bôi trơn ≈ 0,1, lốp cao su trên nhựa đường khô ≈ 0,7–0,9, nhựa đường ướt ≈ 0,4–0,6 — luôn dùng số liệu cho đúng cặp bề mặt thực tế.</p>
<div class="note-ct"><p>Ma sát <strong>không</strong> tự động bằng μN. Với câu hỏi "có trượt không?", giải cân bằng với giả thiết không trượt, rồi so F cần thiết với μ<sub>s</sub>N.</p></div>
<h3>✍️ Ví dụ 1 — vật trên mặt nghiêng</h3>
<div class="callout"><p>Thùng 50 kg (W = 490,5 N) nằm trên dốc θ = 25°, μ<sub>s</sub> = 0,30, μ<sub>k</sub> = 0,25. Trục dọc và vuông góc mặt dốc.</p>
<p>N = W cos 25° = <b>444,5 N</b>; thành phần dọc dốc hướng xuống W sin 25° = <b>207,3 N</b>; ma sát tĩnh lớn nhất μ<sub>s</sub>N = <b>133,4 N</b>.</p>
<p>Vì 207,3 &gt; 133,4 (tương đương tan 25° = 0,466 &gt; 0,30) thùng <b>trượt xuống</b>.</p>
<p>Lực P nhỏ nhất (dọc dốc hướng lên) để giữ thùng: ma sát hướng lên và đạt cực đại: P = W(sin θ − μ<sub>s</sub> cos θ) = <b>73,9 N</b>.</p>
<p>Lực đẩy thùng lên đều: ma sát hướng xuống với μ<sub>k</sub>: P = W(sin θ + μ<sub>k</sub> cos θ) = <b>318,4 N</b>.</p></div>
<h3>✍️ Ví dụ 2 — trượt hay lật?</h3>
<div class="callout"><p>Thùng hàng 100 kg (W = 981 N), rộng 0,6 m, cao 1,2 m, đặt trên sàn μ<sub>s</sub> = 0,4. Công nhân đẩy ngang ở độ cao h = 1,0 m.</p>
<p><b>Trượt</b> cần P = μ<sub>s</sub>W = 0,4 × 981 = <b>392,4 N</b>.</p>
<p><b>Lật</b> quanh mép đáy phía trước: lúc sắp lật, phản lực pháp tuyến dồn về mép đó, ΣM<sub>mép</sub> = 0 cho P·h = W·(b/2) ⇒ P = 981 × 0,3/1,0 = <b>294,3 N</b>.</p>
<p>294,3 &lt; 392,4 ⇒ thùng <b>lật trước</b>. Đẩy thấp hơn (h &lt; 0,75 m) thì thùng trượt.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Viết F = μN khi vật chưa ở trạng thái sắp trượt.</li><li>Lấy N = W trên mặt nghiêng hoặc khi lực khác có thành phần đứng.</li><li>Vẽ ma sát sai chiều — ma sát luôn chống lại chuyển động tương đối (hoặc xu hướng).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Tĩnh: F ≤ μ<sub>s</sub>N; sắp trượt: F = μ<sub>s</sub>N; đang trượt: F = μ<sub>k</sub>N.</li><li>Vật tự trượt trên dốc khi tan θ &gt; μ<sub>s</sub>.</li><li>Kiểm cả trượt lẫn lật; lực nhỏ hơn quyết định.</li><li>Tìm N từ cân bằng, không bao giờ đoán.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(ES + 'Chapter_09-dry-friction.html', 'Engineering Statics — Ma sát khô'),
    A(ES + 'Chapter_09-slipping-vs--tipping.html', 'Engineering Statics — Trượt và lật'),
    A(OSP + '6-2-friction', 'OpenStax 6.2 — Ma sát'),
    A('https://www.engineeringtoolbox.com/friction-coefficients-d_778.html', 'Engineering ToolBox — Hệ số ma sát'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Góc dốc lớn nhất để thùng có μ<sub>s</sub> = 0,5 còn đứng yên?</li><li>Khối 20 kg trên sàn ngang (μ<sub>s</sub> = 0,35) bị đẩy 50 N. Có chuyển động không? Lực ma sát bằng bao nhiêu?</li><li>Trong Ví dụ 2, đẩy ở độ cao nào thì thùng vừa trượt vừa lật cùng lúc?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) arctan 0,5 = 26,6°. 2) μ<sub>s</sub>N = 0,35 × 196,2 = 68,7 N &gt; 50 N ⇒ đứng yên; ma sát = 50 N (không phải 68,7 N). 3) 392,4·h = 981 × 0,3 ⇒ h = 0,75 m.</p></div>`);

const c42 = L('emm201c-ts-4-2',
  '4.2 — Wedges, power screws and belt friction|||4.2 — Nêm, vít truyền lực và ma sát đai',
  'Nêm và điều kiện tự hãm; vít ren vuông: góc nâng α, mômen nâng/hạ, hiệu suất, tự hãm φ > α; ma sát đai/dây quấn T2/T1 = e^(μβ).',
  `<span class="eyebrow">EMM201c · Chapter 4 · Lesson 4.2</span>
<h2>Wedges, power screws and belt friction</h2>
<h3>🎯 Objectives</h3>
<ul><li>Explain how wedges and screws multiply force through friction-loaded inclines.</li><li>Compute the torque to raise and lower a load with a square-thread power screw, its efficiency and self-locking.</li><li>Use the capstan (belt-friction) equation.</li></ul>
<h3>Wedges</h3>
<p>A <strong>wedge</strong> is a small-angle incline used to lift or position heavy loads (machine levelling wedges, door stops, taper keys). A small horizontal force produces a large vertical one, but friction acts on <em>every</em> contact face, so each face needs its own N and F = μ<sub>s</sub>N at impending motion. A wedge is <strong>self-locking</strong> (stays in place when the push is removed) when its angle is small compared with the friction angle.</p>
<h3>Power screws</h3>
<p>A screw thread is an incline wrapped around a cylinder. For one turn, the load W rises by the <strong>lead</strong> L (= pitch × number of starts) while the thread travels π·d<sub>m</sub> around the mean diameter. Hence:</p>
<div class="formula"><span class="lbl">Square-thread power screw</span>Lead angle: tan α = L / (π·d<sub>m</sub>);&nbsp; friction angle: tan φ = μ<br>Torque to raise: T<sub>R</sub> = W·(d<sub>m</sub>/2)·tan(φ + α)<br>Torque to lower: T<sub>L</sub> = W·(d<sub>m</sub>/2)·tan(φ − α)<br>Self-locking if φ &gt; α (T<sub>L</sub> &gt; 0);&nbsp; efficiency e = tan α / tan(α + φ)</div>
<p>(Shigley gives the general form for Acme/trapezoidal threads, with an extra factor for the thread angle; collar friction is added separately.)</p>
<h3>✍️ Example 1 — screw jack</h3>
<div class="callout"><p>A car jack has a square thread with d<sub>m</sub> = 25 mm, lead L = 5 mm (single start), μ = 0.15, load W = 10 kN.</p>
<p>tan α = 5/(π × 25) ⇒ α = <b>3.64°</b>; φ = arctan 0.15 = <b>8.53°</b>.</p>
<p>T<sub>R</sub> = 10 000 × 0.0125 × tan(12.17°) = <b>26.97 N·m</b>.</p>
<p>T<sub>L</sub> = 10 000 × 0.0125 × tan(4.89°) = <b>10.69 N·m &gt; 0</b> ⇒ self-locking: the car does not lower itself.</p>
<p>Efficiency e = tan 3.64°/tan 12.17° = <b>0.295 (29.5 %)</b> — low, the price of self-locking. Ball screws (μ ≈ 0.005) reach 90 % but are <em>not</em> self-locking, so robot axes using them need a brake.</p></div>
<h3>Belt friction (capstan equation)</h3>
<p>A flat belt or rope wrapped over a fixed drum through a contact angle β (in <strong>radians</strong>) can hold a large tension T<sub>2</sub> with a small tension T<sub>1</sub>, when slip impends:</p>
<div class="formula"><span class="lbl">Capstan / Euler–Eytelwein</span>T<sub>2</sub> / T<sub>1</sub> = e<sup>μβ</sup> &nbsp;&nbsp;(T<sub>2</sub> = the larger, "tight-side" tension)</div>
<div class="callout"><p><b>Example 2.</b> A mooring rope makes 1.5 turns (β = 3π rad) around a bollard, μ = 0.3: T<sub>2</sub>/T<sub>1</sub> = e<sup>0.3·3π</sup> = <b>16.9</b>. To hold 1000 N a sailor needs only 1000/16.9 = <b>59 N</b>. The same law sets how much torque a belt drive can transmit before slipping (Chapter 11).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using degrees for β in e<sup>μβ</sup>.</li><li>Confusing pitch with lead on multi-start threads.</li><li>Forgetting friction on the second face of a wedge.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Screw: α from lead and mean diameter; φ from μ.</li><li>T<sub>R</sub> = W r tan(φ + α); self-locking if φ &gt; α.</li><li>Self-locking screws are inefficient (&lt; 50 %).</li><li>Belt/rope: T<sub>2</sub>/T<sub>1</sub> = e<sup>μβ</sup>, β in radians.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(ES + 'Chapter_09-block-and-wedge-friction.html', 'Engineering Statics — Wedges'),
    A(ES + 'Chapter_09-screw-friction.html', 'Engineering Statics — Screw threads'),
    A(ES + 'Chapter_09-flexible-belt-friction.html', 'Engineering Statics — Flexible belts'),
    A(WK + 'Capstan_equation', 'Wikipedia — Capstan equation'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A square-thread screw: d<sub>m</sub> = 20 mm, L = 4 mm, μ = 0.10, W = 5 kN. Find the raising torque and efficiency. Is it self-locking?</li><li>A rope makes 2 full turns on a drum (μ = 0.25). What pull holds 5 kN?</li><li>For a flat belt with 180° wrap and μ = 0.3, what is the maximum tension ratio?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) α = 3.64°, φ = 5.71°, T<sub>R</sub> = 5000 × 10 × tan 9.35° = 8235 N·mm = 8.24 N·m, e = 38.7 %; φ &gt; α ⇒ self-locking. 2) e<sup>0.25·4π</sup> = 23.1 ⇒ 216 N. 3) e<sup>0.3π</sup> = 2.57.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 4 · Bài 4.2</span>
<h2>Nêm, vít truyền lực và ma sát đai</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích cách nêm và vít khuếch đại lực qua mặt nghiêng có ma sát.</li><li>Tính mômen nâng và hạ tải của vít ren vuông, hiệu suất và điều kiện tự hãm.</li><li>Dùng phương trình ma sát dây quấn (Euler–Eytelwein).</li></ul>
<h3>Nêm</h3>
<p><strong>Nêm</strong> là mặt nghiêng góc nhỏ dùng để nâng hoặc căn chỉnh vật nặng (nêm cân máy, chặn cửa, then vát). Lực ngang nhỏ tạo lực đứng lớn, nhưng ma sát xuất hiện trên <em>mọi</em> mặt tiếp xúc, nên mỗi mặt cần N riêng và F = μ<sub>s</sub>N khi sắp trượt. Nêm <strong>tự hãm</strong> (đứng yên khi bỏ lực đẩy) khi góc nêm nhỏ so với góc ma sát.</p>
<h3>Vít truyền lực</h3>
<p>Ren vít là mặt nghiêng quấn quanh hình trụ. Mỗi vòng quay, tải W dâng lên một <strong>bước xoắn</strong> L (= bước ren × số đầu mối) trong khi ren đi một vòng π·d<sub>m</sub> quanh đường kính trung bình. Do đó:</p>
<div class="formula"><span class="lbl">Vít ren vuông</span>Góc nâng: tan α = L / (π·d<sub>m</sub>);&nbsp; góc ma sát: tan φ = μ<br>Mômen nâng: T<sub>R</sub> = W·(d<sub>m</sub>/2)·tan(φ + α)<br>Mômen hạ: T<sub>L</sub> = W·(d<sub>m</sub>/2)·tan(φ − α)<br>Tự hãm nếu φ &gt; α (T<sub>L</sub> &gt; 0);&nbsp; hiệu suất e = tan α / tan(α + φ)</div>
<p>(Shigley cho dạng tổng quát cho ren hình thang/Acme, có thêm hệ số theo góc profin ren; ma sát ở vòng đệm (collar) cộng riêng.)</p>
<h3>✍️ Ví dụ 1 — kích vít</h3>
<div class="callout"><p>Kích ô tô có ren vuông d<sub>m</sub> = 25 mm, bước xoắn L = 5 mm (một đầu mối), μ = 0,15, tải W = 10 kN.</p>
<p>tan α = 5/(π × 25) ⇒ α = <b>3,64°</b>; φ = arctan 0,15 = <b>8,53°</b>.</p>
<p>T<sub>R</sub> = 10 000 × 0,0125 × tan(12,17°) = <b>26,97 N·m</b>.</p>
<p>T<sub>L</sub> = 10 000 × 0,0125 × tan(4,89°) = <b>10,69 N·m &gt; 0</b> ⇒ tự hãm: xe không tự hạ xuống.</p>
<p>Hiệu suất e = tan 3,64°/tan 12,17° = <b>0,295 (29,5 %)</b> — thấp, cái giá của tự hãm. Vít me bi (μ ≈ 0,005) đạt 90 % nhưng <em>không</em> tự hãm, nên trục robot dùng vít me bi cần phanh.</p></div>
<h3>Ma sát đai (phương trình dây quấn)</h3>
<p>Đai phẳng hoặc dây quấn trên tang cố định qua góc ôm β (tính bằng <strong>radian</strong>) có thể giữ lực căng lớn T<sub>2</sub> bằng lực nhỏ T<sub>1</sub>, khi sắp trượt:</p>
<div class="formula"><span class="lbl">Euler–Eytelwein</span>T<sub>2</sub> / T<sub>1</sub> = e<sup>μβ</sup> &nbsp;&nbsp;(T<sub>2</sub> = lực căng lớn, nhánh căng)</div>
<div class="callout"><p><b>Ví dụ 2.</b> Dây neo tàu quấn 1,5 vòng (β = 3π rad) quanh cọc, μ = 0,3: T<sub>2</sub>/T<sub>1</sub> = e<sup>0,3·3π</sup> = <b>16,9</b>. Để giữ 1000 N, thuỷ thủ chỉ cần 1000/16,9 = <b>59 N</b>. Cũng định luật này quyết định bộ truyền đai truyền được bao nhiêu mômen trước khi trượt (Chương 11).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng độ cho β trong e<sup>μβ</sup>.</li><li>Nhầm bước ren với bước xoắn ở ren nhiều đầu mối.</li><li>Quên ma sát ở mặt thứ hai của nêm.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Vít: α từ bước xoắn và đường kính trung bình; φ từ μ.</li><li>T<sub>R</sub> = W r tan(φ + α); tự hãm nếu φ &gt; α.</li><li>Vít tự hãm có hiệu suất thấp (&lt; 50 %).</li><li>Đai/dây: T<sub>2</sub>/T<sub>1</sub> = e<sup>μβ</sup>, β theo radian.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(ES + 'Chapter_09-block-and-wedge-friction.html', 'Engineering Statics — Nêm'),
    A(ES + 'Chapter_09-screw-friction.html', 'Engineering Statics — Ren vít'),
    A(ES + 'Chapter_09-flexible-belt-friction.html', 'Engineering Statics — Đai mềm'),
    A(WK + 'Capstan_equation', 'Wikipedia — Phương trình dây quấn (Capstan)'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Vít ren vuông: d<sub>m</sub> = 20 mm, L = 4 mm, μ = 0,10, W = 5 kN. Tính mômen nâng và hiệu suất. Có tự hãm không?</li><li>Dây quấn 2 vòng trên tang (μ = 0,25). Cần kéo bao nhiêu để giữ 5 kN?</li><li>Đai phẳng ôm 180°, μ = 0,3: tỉ số lực căng lớn nhất là bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) α = 3,64°, φ = 5,71°, T<sub>R</sub> = 5000 × 10 × tan 9,35° = 8235 N·mm = 8,24 N·m, e = 38,7 %; φ &gt; α ⇒ tự hãm. 2) e<sup>0,25·4π</sup> = 23,1 ⇒ 216 N. 3) e<sup>0,3π</sup> = 2,57.</p></div>`);

const c43 = L('emm201c-ts-4-3',
  '4.3 — Centre of gravity and centroids of composite areas|||4.3 — Trọng tâm và trọng tâm hình phẳng ghép',
  'Trọng tâm, khối tâm, trọng tâm hình học; công thức tích phân và hình ghép; bảng hình cơ bản; ví dụ tiết diện chữ T và tấm có lỗ (diện tích âm).',
  `<span class="eyebrow">EMM201c · Chapter 4 · Lesson 4.3</span>
<h2>Centre of gravity and centroids of composite areas</h2>
<h3>🎯 Objectives</h3>
<ul><li>Distinguish centre of gravity, centre of mass and centroid.</li><li>Locate the centroid of a composite area with a table.</li><li>Handle holes as negative areas.</li></ul>
<h3>Three related points</h3>
<ul><li><strong>Centre of gravity (G):</strong> where the resultant weight acts. It decides stability (e.g. a vehicle's rollover limit, a robot's tipping limit).</li>
<li><strong>Centre of mass:</strong> the mass-weighted average position; equals G in a uniform gravity field. It is what F = ma "sees" in dynamics.</li>
<li><strong>Centroid (C):</strong> the geometric centre of a line, area or volume. For a homogeneous body it coincides with G. In strength of materials the centroid of a cross-section is where the <strong>neutral axis</strong> passes in bending.</li></ul>
<div class="formula"><span class="lbl">Centroid of an area</span>x̄ = ∫ x dA / ∫ dA, &nbsp; ȳ = ∫ y dA / ∫ dA<br>Composite area: x̄ = Σ(A<sub>i</sub> x̄<sub>i</sub>) / ΣA<sub>i</sub>, &nbsp; ȳ = Σ(A<sub>i</sub> ȳ<sub>i</sub>) / ΣA<sub>i</sub></div>
<table>
<tr><th>Shape</th><th>Area</th><th>Centroid</th></tr>
<tr><td>Rectangle b × h</td><td>b·h</td><td>at the middle (h/2 from the base)</td></tr>
<tr><td>Triangle, base b, height h</td><td>b·h/2</td><td>h/3 from the base</td></tr>
<tr><td>Circle, radius r</td><td>π r<sup>2</sup></td><td>at the centre</td></tr>
<tr><td>Semicircle, radius r</td><td>π r<sup>2</sup>/2</td><td>4r/(3π) from the diameter</td></tr>
</table>
<p>Symmetry shortcut: if an area has an axis of symmetry, the centroid lies on it.</p>
<h3>✍️ Example 1 — T-section</h3>
<div class="callout"><p>A T-beam: flange 120 mm wide × 20 mm thick on top of a web 20 mm wide × 100 mm tall (total height 120 mm). Measure y from the bottom of the web. By symmetry x̄ is on the vertical centreline.</p>
<table>
<tr><th>Part</th><th>A<sub>i</sub> (mm<sup>2</sup>)</th><th>ȳ<sub>i</sub> (mm)</th><th>A<sub>i</sub>ȳ<sub>i</sub> (mm<sup>3</sup>)</th></tr>
<tr><td>Flange 120 × 20</td><td>2400</td><td>110</td><td>264 000</td></tr>
<tr><td>Web 20 × 100</td><td>2000</td><td>50</td><td>100 000</td></tr>
<tr><td>Σ</td><td>4400</td><td></td><td>364 000</td></tr>
</table>
<p>ȳ = 364 000/4400 = <b>82.7 mm</b> from the bottom (37.3 mm below the top). The centroid is pulled toward the wide flange. We will use this section again for its moment of inertia and bending stresses.</p></div>
<h3>✍️ Example 2 — plate with a hole</h3>
<div class="callout"><p>A 200 × 100 mm plate has a 50 mm-diameter hole centred at x = 150 mm. Plate: A<sub>1</sub> = 20 000 mm<sup>2</sup>, x̄<sub>1</sub> = 100 mm. Hole: A<sub>2</sub> = −π·25<sup>2</sup> = −1963.5 mm<sup>2</sup>, x̄<sub>2</sub> = 150 mm.</p>
<p>x̄ = (20 000 × 100 − 1963.5 × 150)/(20 000 − 1963.5) = <b>94.6 mm</b> — the centroid moves away from the hole.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Measuring ȳ<sub>i</sub> of each part from different reference lines.</li><li>Adding a hole's area instead of subtracting it.</li><li>Putting a triangle's centroid at h/2.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Composite centroid = Σ A<sub>i</sub> x̄<sub>i</sub> / Σ A<sub>i</sub> — use a table.</li><li>Holes are negative areas.</li><li>Use symmetry first.</li><li>Section centroid = location of the neutral axis in bending.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(ES + 'Chapter_07-centroids.html', 'Engineering Statics — Centroids'),
    A(ES + 'composite-parts.html', 'Engineering Statics — Centroids using composite parts'),
    A(WK + 'Centroid', 'Wikipedia — Centroid (table of shapes)'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>Find the centroid height of a 60 × 60 mm square with a 60 mm-base, 30 mm-tall triangle placed on top.</li><li>Where is the centroid of a semicircle of radius 90 mm?</li><li>An L-section: vertical leg 10 × 100 mm (x from 0 to 10), horizontal leg 90 × 10 mm (x from 10 to 100, at the bottom). Find x̄.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) Square 3600 mm<sup>2</sup> at 30 mm; triangle 900 mm<sup>2</sup> at 60 + 10 = 70 mm ⇒ ȳ = (108 000 + 63 000)/4500 = 38 mm. 2) 4 × 90/(3π) = 38.2 mm from the diameter. 3) (1000 × 5 + 900 × 55)/1900 = 28.7 mm.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 4 · Bài 4.3</span>
<h2>Trọng tâm và trọng tâm hình phẳng ghép</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Phân biệt trọng tâm, khối tâm và tâm hình học.</li><li>Xác định trọng tâm hình phẳng ghép bằng bảng tính.</li><li>Xử lý lỗ khoét như diện tích âm.</li></ul>
<h3>Ba điểm liên quan</h3>
<ul><li><strong>Trọng tâm (G):</strong> nơi hợp lực trọng lượng đặt. Nó quyết định ổn định (ví dụ giới hạn lật của xe, giới hạn lật của robot).</li>
<li><strong>Khối tâm:</strong> vị trí trung bình có trọng số khối lượng; trùng G trong trường trọng lực đều. Đây là điểm F = ma "nhìn thấy" trong động lực học.</li>
<li><strong>Tâm hình học (C):</strong> tâm của đường, diện tích hoặc thể tích. Với vật đồng chất nó trùng G. Trong sức bền vật liệu, trọng tâm mặt cắt là nơi <strong>trục trung hoà</strong> đi qua khi uốn.</li></ul>
<div class="formula"><span class="lbl">Trọng tâm hình phẳng</span>x̄ = ∫ x dA / ∫ dA, &nbsp; ȳ = ∫ y dA / ∫ dA<br>Hình ghép: x̄ = Σ(A<sub>i</sub> x̄<sub>i</sub>) / ΣA<sub>i</sub>, &nbsp; ȳ = Σ(A<sub>i</sub> ȳ<sub>i</sub>) / ΣA<sub>i</sub></div>
<table>
<tr><th>Hình</th><th>Diện tích</th><th>Trọng tâm</th></tr>
<tr><td>Chữ nhật b × h</td><td>b·h</td><td>ở giữa (cách đáy h/2)</td></tr>
<tr><td>Tam giác đáy b, cao h</td><td>b·h/2</td><td>cách đáy h/3</td></tr>
<tr><td>Hình tròn bán kính r</td><td>π r<sup>2</sup></td><td>tại tâm</td></tr>
<tr><td>Nửa hình tròn bán kính r</td><td>π r<sup>2</sup>/2</td><td>cách đường kính 4r/(3π)</td></tr>
</table>
<p>Mẹo đối xứng: hình có trục đối xứng thì trọng tâm nằm trên trục đó.</p>
<h3>✍️ Ví dụ 1 — tiết diện chữ T</h3>
<div class="callout"><p>Dầm chữ T: cánh rộng 120 mm × dày 20 mm nằm trên bụng rộng 20 mm × cao 100 mm (tổng cao 120 mm). Đo y từ đáy bụng. Do đối xứng, x̄ nằm trên đường tâm đứng.</p>
<table>
<tr><th>Phần</th><th>A<sub>i</sub> (mm<sup>2</sup>)</th><th>ȳ<sub>i</sub> (mm)</th><th>A<sub>i</sub>ȳ<sub>i</sub> (mm<sup>3</sup>)</th></tr>
<tr><td>Cánh 120 × 20</td><td>2400</td><td>110</td><td>264 000</td></tr>
<tr><td>Bụng 20 × 100</td><td>2000</td><td>50</td><td>100 000</td></tr>
<tr><td>Σ</td><td>4400</td><td></td><td>364 000</td></tr>
</table>
<p>ȳ = 364 000/4400 = <b>82,7 mm</b> tính từ đáy (cách mép trên 37,3 mm). Trọng tâm bị kéo về phía cánh rộng. Tiết diện này sẽ dùng lại để tính mômen quán tính và ứng suất uốn.</p></div>
<h3>✍️ Ví dụ 2 — tấm có lỗ</h3>
<div class="callout"><p>Tấm 200 × 100 mm có lỗ đường kính 50 mm, tâm lỗ tại x = 150 mm. Tấm: A<sub>1</sub> = 20 000 mm<sup>2</sup>, x̄<sub>1</sub> = 100 mm. Lỗ: A<sub>2</sub> = −π·25<sup>2</sup> = −1963,5 mm<sup>2</sup>, x̄<sub>2</sub> = 150 mm.</p>
<p>x̄ = (20 000 × 100 − 1963,5 × 150)/(20 000 − 1963,5) = <b>94,6 mm</b> — trọng tâm dịch xa khỏi lỗ.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đo ȳ<sub>i</sub> của các phần từ các đường chuẩn khác nhau.</li><li>Cộng diện tích lỗ thay vì trừ.</li><li>Đặt trọng tâm tam giác tại h/2.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Trọng tâm hình ghép = Σ A<sub>i</sub> x̄<sub>i</sub> / Σ A<sub>i</sub> — dùng bảng.</li><li>Lỗ là diện tích âm.</li><li>Dùng đối xứng trước tiên.</li><li>Trọng tâm mặt cắt = vị trí trục trung hoà khi uốn.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(ES + 'Chapter_07-centroids.html', 'Engineering Statics — Trọng tâm'),
    A(ES + 'composite-parts.html', 'Engineering Statics — Trọng tâm hình ghép'),
    A(WK + 'Centroid', 'Wikipedia — Centroid (bảng các hình)'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm chiều cao trọng tâm của hình vuông 60 × 60 mm có đặt lên trên một tam giác đáy 60 mm, cao 30 mm.</li><li>Trọng tâm nửa hình tròn bán kính 90 mm ở đâu?</li><li>Tiết diện chữ L: cánh đứng 10 × 100 mm (x từ 0 đến 10), cánh ngang 90 × 10 mm (x từ 10 đến 100, ở đáy). Tìm x̄.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) Hình vuông 3600 mm<sup>2</sup> tại 30 mm; tam giác 900 mm<sup>2</sup> tại 60 + 10 = 70 mm ⇒ ȳ = (108 000 + 63 000)/4500 = 38 mm. 2) 4 × 90/(3π) = 38,2 mm tính từ đường kính. 3) (1000 × 5 + 900 × 55)/1900 = 28,7 mm.</p></div>`);

const c44 = L('emm201c-ts-4-4',
  '4.4 — Area moments of inertia and the parallel-axis theorem|||4.4 — Mômen quán tính diện tích và định lý trục song song',
  'Mômen quán tính diện tích I = ∫y²dA, bán kính quán tính, mômen quán tính cực J; công thức chữ nhật, tròn, ống; định lý trục song song; ví dụ tiết diện chữ T.',
  `<span class="eyebrow">EMM201c · Chapter 4 · Lesson 4.4</span>
<h2>Area moments of inertia and the parallel-axis theorem</h2>
<h3>🎯 Objectives</h3>
<ul><li>Explain what the second moment of area measures and why it controls bending and torsion.</li><li>Use the standard formulas for rectangles, circles and tubes.</li><li>Compute I of a composite section with the parallel-axis theorem.</li></ul>
<h3>Definition and meaning</h3>
<p>The <strong>second moment of area</strong> (area moment of inertia) of a cross-section about an axis measures how far its area is spread from that axis. It appears in the beam-bending formula σ = My/I and in deflection formulas: a larger I means a stiffer, stronger beam. Its torsional counterpart, the <strong>polar moment</strong> J, controls shaft twisting.</p>
<div class="formula"><span class="lbl">Definitions</span>I<sub>x</sub> = ∫ y<sup>2</sup> dA, &nbsp; I<sub>y</sub> = ∫ x<sup>2</sup> dA, &nbsp; J = ∫ r<sup>2</sup> dA = I<sub>x</sub> + I<sub>y</sub> &nbsp;[mm<sup>4</sup>]<br>Radius of gyration: k = √(I/A)</div>
<table>
<tr><th>Section (centroidal axis)</th><th>I</th><th>J</th></tr>
<tr><td>Rectangle b × h, axis parallel to b</td><td>b h<sup>3</sup>/12</td><td>—</td></tr>
<tr><td>Solid circle, diameter d</td><td>π d<sup>4</sup>/64</td><td>π d<sup>4</sup>/32</td></tr>
<tr><td>Tube, d<sub>o</sub> and d<sub>i</sub></td><td>π(d<sub>o</sub><sup>4</sup> − d<sub>i</sub><sup>4</sup>)/64</td><td>π(d<sub>o</sub><sup>4</sup> − d<sub>i</sub><sup>4</sup>)/32</td></tr>
</table>
<p>Because h is cubed, a plank on edge is far stiffer than the same plank laid flat: a 100 × 200 mm beam has I = 100·200<sup>3</sup>/12 = 66.7 × 10<sup>6</sup> mm<sup>4</sup> on edge, but only 200·100<sup>3</sup>/12 = 16.7 × 10<sup>6</sup> mm<sup>4</sup> flat — four times less.</p>
<h3>Parallel-axis theorem</h3>
<div class="formula"><span class="lbl">Parallel-axis theorem</span>I = Ī + A·d<sup>2</sup> &nbsp;&nbsp;(Ī about the part's own centroid, d = distance between the parallel axes)</div>
<h3>✍️ Worked example — T-section from lesson 4.3</h3>
<div class="callout"><p>Section centroid at ȳ = 82.73 mm from the bottom (lesson 4.3). Find I about the horizontal centroidal axis.</p>
<table>
<tr><th>Part</th><th>Ī = bh<sup>3</sup>/12 (mm<sup>4</sup>)</th><th>d (mm)</th><th>A·d<sup>2</sup> (mm<sup>4</sup>)</th></tr>
<tr><td>Flange 120 × 20</td><td>80 000</td><td>110 − 82.73 = 27.27</td><td>1 785 124</td></tr>
<tr><td>Web 20 × 100</td><td>1 666 667</td><td>50 − 82.73 = −32.73</td><td>2 142 149</td></tr>
</table>
<p>I = 80 000 + 1 785 124 + 1 666 667 + 2 142 149 = <b>5.67 × 10<sup>6</sup> mm<sup>4</sup></b>. Radius of gyration k = √(5.674 × 10<sup>6</sup>/4400) = <b>35.9 mm</b>.</p>
<p>Notice that the transfer terms A·d<sup>2</sup> contribute two-thirds of the total — material far from the neutral axis is what makes I-beams efficient.</p></div>
<div class="callout"><p><b>Shaft example.</b> Solid shaft d = 40 mm: J = π·40<sup>4</sup>/32 = <b>2.51 × 10<sup>5</sup> mm<sup>4</sup></b>. A tube 50/40 mm has J = 3.62 × 10<sup>5</sup> mm<sup>4</sup> — 44 % stiffer in torsion while using only 56 % of the material of the 40 mm solid shaft.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the parallel-axis theorem between two axes neither of which passes through the part's centroid.</li><li>Cubing the wrong dimension (h is the dimension perpendicular to the bending axis).</li><li>Confusing area moment of inertia (mm<sup>4</sup>) with mass moment of inertia (kg·m<sup>2</sup>, Chapter 9).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>I = ∫ y<sup>2</sup> dA, units mm<sup>4</sup>; J = I<sub>x</sub> + I<sub>y</sub>.</li><li>Rectangle bh<sup>3</sup>/12, circle πd<sup>4</sup>/64, J = πd<sup>4</sup>/32.</li><li>Composite: Σ(Ī + A d<sup>2</sup>) about the overall centroid.</li><li>Put material far from the axis for a high I per kg.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(ES + 'Chapter_10-integral-properties-of-shapes.html', 'Engineering Statics — Integral properties of shapes'),
    A(ES + 'parallel-axis-theorem-section.html', 'Engineering Statics — Parallel axis theorem'),
    A(ES + 'Chapter_10-moment-of-inertia-of-composite-shapes.html', 'Engineering Statics — Composite shapes'),
    A(WK + 'Second_moment_of_area', 'Wikipedia — Second moment of area'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>Find I of a 100 × 200 mm rectangle about its base (use the parallel-axis theorem).</li><li>Find I of a 30 mm-diameter round bar.</li><li>Why is I about the centroidal axis always the minimum among parallel axes?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 66.67 × 10<sup>6</sup> + 20 000 × 100<sup>2</sup> = 266.7 × 10<sup>6</sup> mm<sup>4</sup> (= bh<sup>3</sup>/3). 2) π·30<sup>4</sup>/64 = 39 761 mm<sup>4</sup>. 3) Because A·d<sup>2</sup> ≥ 0 and is zero only when d = 0.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 4 · Bài 4.4</span>
<h2>Mômen quán tính diện tích và định lý trục song song</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích mômen quán tính diện tích đo gì và vì sao nó chi phối uốn và xoắn.</li><li>Dùng công thức chuẩn cho chữ nhật, tròn, ống.</li><li>Tính I của mặt cắt ghép bằng định lý trục song song.</li></ul>
<h3>Định nghĩa và ý nghĩa</h3>
<p><strong>Mômen quán tính diện tích</strong> (mômen bậc hai của diện tích) của mặt cắt đối với một trục đo mức độ diện tích phân bố xa trục đó. Nó xuất hiện trong công thức uốn σ = My/I và công thức độ võng: I càng lớn, dầm càng cứng và bền. Đại lượng tương ứng khi xoắn là <strong>mômen quán tính cực</strong> J, chi phối độ xoắn của trục.</p>
<div class="formula"><span class="lbl">Định nghĩa</span>I<sub>x</sub> = ∫ y<sup>2</sup> dA, &nbsp; I<sub>y</sub> = ∫ x<sup>2</sup> dA, &nbsp; J = ∫ r<sup>2</sup> dA = I<sub>x</sub> + I<sub>y</sub> &nbsp;[mm<sup>4</sup>]<br>Bán kính quán tính: k = √(I/A)</div>
<table>
<tr><th>Mặt cắt (trục qua trọng tâm)</th><th>I</th><th>J</th></tr>
<tr><td>Chữ nhật b × h, trục song song b</td><td>b h<sup>3</sup>/12</td><td>—</td></tr>
<tr><td>Tròn đặc, đường kính d</td><td>π d<sup>4</sup>/64</td><td>π d<sup>4</sup>/32</td></tr>
<tr><td>Ống, d<sub>o</sub> và d<sub>i</sub></td><td>π(d<sub>o</sub><sup>4</sup> − d<sub>i</sub><sup>4</sup>)/64</td><td>π(d<sub>o</sub><sup>4</sup> − d<sub>i</sub><sup>4</sup>)/32</td></tr>
</table>
<p>Vì h mũ ba, tấm ván đặt đứng cứng hơn nhiều so với đặt nằm: dầm 100 × 200 mm đặt đứng có I = 100·200<sup>3</sup>/12 = 66,7 × 10<sup>6</sup> mm<sup>4</sup>, đặt nằm chỉ 200·100<sup>3</sup>/12 = 16,7 × 10<sup>6</sup> mm<sup>4</sup> — kém bốn lần.</p>
<h3>Định lý trục song song</h3>
<div class="formula"><span class="lbl">Định lý trục song song (Steiner)</span>I = Ī + A·d<sup>2</sup> &nbsp;&nbsp;(Ī đối với trọng tâm của chính phần đó, d = khoảng cách giữa hai trục song song)</div>
<h3>✍️ Ví dụ giải — tiết diện chữ T của bài 4.3</h3>
<div class="callout"><p>Trọng tâm mặt cắt tại ȳ = 82,73 mm tính từ đáy (bài 4.3). Tìm I đối với trục ngang qua trọng tâm.</p>
<table>
<tr><th>Phần</th><th>Ī = bh<sup>3</sup>/12 (mm<sup>4</sup>)</th><th>d (mm)</th><th>A·d<sup>2</sup> (mm<sup>4</sup>)</th></tr>
<tr><td>Cánh 120 × 20</td><td>80 000</td><td>110 − 82,73 = 27,27</td><td>1 785 124</td></tr>
<tr><td>Bụng 20 × 100</td><td>1 666 667</td><td>50 − 82,73 = −32,73</td><td>2 142 149</td></tr>
</table>
<p>I = 80 000 + 1 785 124 + 1 666 667 + 2 142 149 = <b>5,67 × 10<sup>6</sup> mm<sup>4</sup></b>. Bán kính quán tính k = √(5,674 × 10<sup>6</sup>/4400) = <b>35,9 mm</b>.</p>
<p>Để ý các số hạng chuyển trục A·d<sup>2</sup> chiếm hai phần ba tổng — vật liệu đặt xa trục trung hoà là điều làm dầm chữ I hiệu quả.</p></div>
<div class="callout"><p><b>Ví dụ trục.</b> Trục đặc d = 40 mm: J = π·40<sup>4</sup>/32 = <b>2,51 × 10<sup>5</sup> mm<sup>4</sup></b>. Ống 50/40 mm có J = 3,62 × 10<sup>5</sup> mm<sup>4</sup> — cứng xoắn hơn 44 % mà chỉ dùng 56 % lượng vật liệu của trục đặc 40 mm.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng định lý trục song song giữa hai trục mà không trục nào qua trọng tâm của phần đó.</li><li>Lấy mũ ba nhầm kích thước (h là kích thước vuông góc với trục uốn).</li><li>Nhầm mômen quán tính diện tích (mm<sup>4</sup>) với mômen quán tính khối lượng (kg·m<sup>2</sup>, Chương 9).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>I = ∫ y<sup>2</sup> dA, đơn vị mm<sup>4</sup>; J = I<sub>x</sub> + I<sub>y</sub>.</li><li>Chữ nhật bh<sup>3</sup>/12, tròn πd<sup>4</sup>/64, J = πd<sup>4</sup>/32.</li><li>Hình ghép: Σ(Ī + A d<sup>2</sup>) đối với trọng tâm chung.</li><li>Đặt vật liệu xa trục để có I lớn trên mỗi kg.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(ES + 'Chapter_10-integral-properties-of-shapes.html', 'Engineering Statics — Đặc trưng tích phân của hình'),
    A(ES + 'parallel-axis-theorem-section.html', 'Engineering Statics — Định lý trục song song'),
    A(ES + 'Chapter_10-moment-of-inertia-of-composite-shapes.html', 'Engineering Statics — Hình ghép'),
    A(WK + 'Second_moment_of_area', 'Wikipedia — Mômen quán tính diện tích'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm I của chữ nhật 100 × 200 mm đối với cạnh đáy (dùng định lý trục song song).</li><li>Tìm I của thanh tròn đường kính 30 mm.</li><li>Vì sao I đối với trục qua trọng tâm luôn nhỏ nhất trong các trục song song?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 66,67 × 10<sup>6</sup> + 20 000 × 100<sup>2</sup> = 266,7 × 10<sup>6</sup> mm<sup>4</sup> (= bh<sup>3</sup>/3). 2) π·30<sup>4</sup>/64 = 39 761 mm<sup>4</sup>. 3) Vì A·d<sup>2</sup> ≥ 0 và chỉ bằng 0 khi d = 0.</p></div>`);

const q4 = QZ(4, 'Quiz — Chapter 4: Friction, centroids and moments of inertia|||Quiz — Chương 4: Ma sát, trọng tâm và mômen quán tính', 'Kiểm tra chương 4: ma sát Coulomb, trượt/lật, vít truyền lực, ma sát đai, trọng tâm hình ghép, mômen quán tính, trục song song.', [
  Q('q1', 'A block on a horizontal floor (N = 200 N, μs = 0.4) is pushed with 50 N and does not move. The friction force is|||Khối trên sàn ngang (N = 200 N, μs = 0,4) bị đẩy 50 N và không chuyển động. Lực ma sát là',
    ['80 N|||80 N', '50 N|||50 N', '0|||0', '200 N|||200 N'], 1,
    'Below impending slip, friction equals what equilibrium requires.|||Chưa sắp trượt thì ma sát bằng đúng giá trị cân bằng cần.'),
  Q('q2', 'A block slides down an incline by itself when|||Vật tự trượt xuống dốc khi',
    ['tan θ > μs|||tan θ > μs', 'sin θ > μs|||sin θ > μs', 'cos θ > μs|||cos θ > μs', 'θ > 45°|||θ > 45°'], 0,
    'W sin θ > μs W cos θ.|||W sin θ > μs W cos θ.'),
  Q('q3', 'A crate tips before sliding when the tipping force is|||Thùng lật trước khi trượt khi lực gây lật',
    ['larger than the sliding force|||lớn hơn lực gây trượt', 'smaller than the sliding force|||nhỏ hơn lực gây trượt', 'equal to W|||bằng W', 'independent of the push height|||không phụ thuộc độ cao đẩy'], 1,
    'The smaller required force governs.|||Lực cần nhỏ hơn sẽ quyết định.'),
  Q('q4', 'A power screw is self-locking when|||Vít truyền lực tự hãm khi',
    ['α > φ|||α > φ', 'φ > α|||φ > α', 'efficiency > 50 %|||hiệu suất > 50 %', 'μ = 0|||μ = 0'], 1,
    'Then the lowering torque is positive.|||Khi đó mômen hạ dương.'),
  Q('q5', 'In T₂/T₁ = e^(μβ), β must be in|||Trong T₂/T₁ = e^(μβ), β phải tính bằng',
    ['degrees|||độ', 'radians|||radian', 'turns|||vòng', 'metres|||mét'], 1,
    'The exponent is dimensionless with β in radians.|||Số mũ không thứ nguyên khi β theo radian.'),
  Q('q6', 'The centroid of a triangle (height h) lies at|||Trọng tâm tam giác (cao h) nằm ở',
    ['h/2 from the base|||h/2 từ đáy', 'h/3 from the base|||h/3 từ đáy', '2h/3 from the base|||2h/3 từ đáy', 'the apex|||đỉnh'], 1,
    'One third of the height from the base.|||Một phần ba chiều cao tính từ đáy.'),
  Q('q7', 'In a composite-area centroid calculation, a hole is treated as|||Khi tính trọng tâm hình ghép, lỗ khoét được coi là',
    ['ignored|||bỏ qua', 'a negative area|||diện tích âm', 'a positive area|||diện tích dương', 'a point mass|||khối lượng điểm'], 1,
    'Subtract its A and A·x̄.|||Trừ A và A·x̄ của nó.'),
  Q('q8', 'I of a rectangle b × h about its centroidal axis parallel to b is|||I của chữ nhật b × h đối với trục qua trọng tâm song song b là',
    ['bh²/6|||bh²/6', 'bh³/12|||bh³/12', 'b³h/12|||b³h/12', 'bh³/3|||bh³/3'], 1,
    'bh³/3 is about the base.|||bh³/3 là đối với cạnh đáy.'),
  Q('q9', 'The parallel-axis theorem states|||Định lý trục song song phát biểu',
    ['I = Ī − A·d²|||I = Ī − A·d²', 'I = Ī + A·d²|||I = Ī + A·d²', 'I = Ī·d²|||I = Ī·d²', 'I = A·d|||I = A·d'], 1,
    'Ī must be about the centroidal axis.|||Ī phải đối với trục qua trọng tâm.'),
  Q('q10', 'The polar moment J of a solid shaft of diameter d is|||Mômen quán tính cực J của trục đặc đường kính d là',
    ['πd⁴/64|||πd⁴/64', 'πd⁴/32|||πd⁴/32', 'πd³/16|||πd³/16', 'πd²/4|||πd²/4'], 1,
    'J = 2I = πd⁴/32.|||J = 2I = πd⁴/32.'),
]);

const ch4 = {
  title: 'Chapter 4 — Friction, centroids and area moments of inertia|||Chương 4 — Ma sát, trọng tâm và mômen quán tính diện tích',
  description: 'Ma sát khô (trượt, lật), nêm, vít truyền lực, ma sát đai; trọng tâm hình ghép; mômen quán tính diện tích và định lý trục song song (Hibbeler Statics ch.8–10).',
  lessons: [c41, c42, c43, c44, q4],
};

// ───────────────────────────── Chương 5 ─────────────────────────────
const c51 = L('emm201c-ts-5-1',
  '5.1 — Stress: normal, shear and bearing; allowable stress and factor of safety|||5.1 — Ứng suất pháp, ứng suất cắt, ứng suất dập; ứng suất cho phép và hệ số an toàn',
  'Nội lực và mặt cắt; σ = P/A, τ = V/A (cắt đơn, cắt kép), ứng suất dập σb = P/(t·d); ứng suất cho phép, hệ số an toàn n; thiết kế đường kính thanh và chốt.',
  `<span class="eyebrow">EMM201c · Chapter 5 · Lesson 5.1</span>
<h2>Stress: normal, shear and bearing</h2>
<h3>🎯 Objectives</h3>
<ul><li>Compute average normal, shear and bearing stresses in rods, pins and plates.</li><li>Distinguish single and double shear.</li><li>Use a factor of safety to size a member.</li></ul>
<h3>From internal force to stress</h3>
<p>Statics tells us the force a member carries. To know if the member survives, cut it with a section and ask how that internal force is spread over the cut area. Force per unit area is <strong>stress</strong>, measured in pascals; in machine design we use <strong>MPa = N/mm<sup>2</sup></strong>.</p>
<div class="formula"><span class="lbl">Average stresses</span>Normal (axial) stress: σ = P / A &nbsp;(tension +, compression −)<br>Average shear stress: τ = V / A<br>Bearing stress (pin in a plate): σ<sub>b</sub> = P / (t·d) &nbsp;(projected area: plate thickness × pin diameter)</div>
<p>σ = P/A is exact away from load points and holes for a straight prismatic bar (Saint-Venant's principle); near holes, notches and shoulders the local stress is higher — the <strong>stress concentration</strong> (factor K<sub>t</sub>) matters in fatigue (Chapter 7).</p>
<h3>Single vs double shear</h3>
<p>A pin joining two plates (lap joint) is cut on <strong>one</strong> plane: V = P. A pin in a clevis (fork) is cut on <strong>two</strong> planes: each carries V = P/2, so the shear stress halves. Always count the shear planes on a sketch.</p>
<h3>Allowable stress and factor of safety</h3>
<div class="formula"><span class="lbl">Factor of safety</span>n = (failure strength) / (actual stress) = S<sub>y</sub> / σ &nbsp;for ductile parts against yield<br>Allowable stress: σ<sub>allow</sub> = S<sub>y</sub> / n</div>
<p>n covers uncertainty in loads, material properties, models and manufacturing. Typical values: 1.25–1.5 for well-known loads and certified materials (aircraft), 2–3 for ordinary machine parts, 3–4 or more for uncertain loads or brittle materials (more in lesson 7.4).</p>
<h3>✍️ Worked example — a link, its pin and its plate</h3>
<div class="callout"><p>A link carries a tensile force P = 20 kN.</p>
<p><b>(a) Rod stress</b>, d = 12 mm: A = π·12<sup>2</sup>/4 = 113.1 mm<sup>2</sup> ⇒ σ = 20 000/113.1 = <b>176.8 MPa</b>.</p>
<p><b>(b) Pin in double shear</b>, d = 10 mm: τ = (P/2)/(π·10<sup>2</sup>/4) = 10 000/78.54 = <b>127.3 MPa</b>.</p>
<p><b>(c) Bearing</b> of the 10 mm pin on an 8 mm-thick plate: σ<sub>b</sub> = 20 000/(8 × 10) = <b>250 MPa</b>.</p>
<p><b>(d) Design.</b> The rod is steel with S<sub>y</sub> = 250 MPa and we require n = 2: σ<sub>allow</sub> = 125 MPa, so A ≥ 20 000/125 = 160 mm<sup>2</sup> ⇒ d ≥ √(4 × 160/π) = <b>14.3 mm</b> ⇒ choose a standard <b>16 mm</b> rod. With d = 12 mm the factor of safety would only be 250/176.8 = 1.41.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the diameter instead of the area, or the radius in πd<sup>2</sup>/4.</li><li>Forgetting that double shear halves the stress.</li><li>Using the full circular area of the pin for bearing instead of t·d.</li><li>Rounding a calculated diameter <em>down</em> to a standard size.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>σ = P/A, τ = V/A, σ<sub>b</sub> = P/(t·d); in N and mm the result is in MPa.</li><li>Count shear planes: single V = P, double V = P/2.</li><li>n = strength/stress; σ<sub>allow</sub> = S<sub>y</sub>/n.</li><li>Design: required area from σ<sub>allow</sub>, then round up to a standard size.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(OSP + '12-3-stress-strain-and-elastic-modulus', 'OpenStax 12.3 — Stress, strain and elastic modulus'),
    A(OCW_MOM, 'MIT OCW 2.001 — Mechanics &amp; Materials I'),
    A(WK + 'Shear_stress', 'Wikipedia — Shear stress'),
    A(WK + 'Factor_of_safety', 'Wikipedia — Factor of safety'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>An 8 mm pin in single shear carries 5 kN. Find τ.</li><li>A 25 × 25 mm square steel bar is compressed by 100 kN. Find σ.</li><li>A part with S<sub>y</sub> = 355 MPa works at 120 MPa. What is the factor of safety?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) τ = 5000/(π·8<sup>2</sup>/4) = 99.5 MPa. 2) σ = −100 000/625 = −160 MPa (compression). 3) n = 355/120 = 2.96.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 5 · Bài 5.1</span>
<h2>Ứng suất pháp, ứng suất cắt và ứng suất dập</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính ứng suất pháp, ứng suất cắt và ứng suất dập trung bình trong thanh, chốt và tấm.</li><li>Phân biệt cắt đơn và cắt kép.</li><li>Dùng hệ số an toàn để chọn kích thước chi tiết.</li></ul>
<h3>Từ nội lực đến ứng suất</h3>
<p>Tĩnh học cho biết chi tiết chịu lực bao nhiêu. Để biết chi tiết có chịu được không, ta cắt nó bằng một mặt cắt và hỏi nội lực đó phân bố trên diện tích mặt cắt thế nào. Lực trên đơn vị diện tích là <strong>ứng suất</strong>, đơn vị pascal; trong thiết kế máy dùng <strong>MPa = N/mm<sup>2</sup></strong>.</p>
<div class="formula"><span class="lbl">Ứng suất trung bình</span>Ứng suất pháp (dọc trục): σ = P / A &nbsp;(kéo +, nén −)<br>Ứng suất cắt trung bình: τ = V / A<br>Ứng suất dập (chốt trong lỗ tấm): σ<sub>b</sub> = P / (t·d) &nbsp;(diện tích chiếu: chiều dày tấm × đường kính chốt)</div>
<p>σ = P/A là chính xác ở xa điểm đặt lực và lỗ trên thanh thẳng tiết diện đều (nguyên lý Saint-Venant); gần lỗ, rãnh và vai trục ứng suất cục bộ cao hơn — <strong>tập trung ứng suất</strong> (hệ số K<sub>t</sub>) rất quan trọng khi tính mỏi (Chương 7).</p>
<h3>Cắt đơn và cắt kép</h3>
<p>Chốt nối hai tấm chồng nhau bị cắt trên <strong>một</strong> mặt: V = P. Chốt trong càng chữ U (chạc) bị cắt trên <strong>hai</strong> mặt: mỗi mặt chịu V = P/2, ứng suất cắt giảm một nửa. Luôn đếm số mặt cắt trên hình phác.</p>
<h3>Ứng suất cho phép và hệ số an toàn</h3>
<div class="formula"><span class="lbl">Hệ số an toàn</span>n = (độ bền phá huỷ) / (ứng suất thực) = S<sub>y</sub> / σ &nbsp;với chi tiết dẻo chống chảy<br>Ứng suất cho phép: σ<sub>allow</sub> = S<sub>y</sub> / n</div>
<p>n bù cho độ bất định về tải, tính chất vật liệu, mô hình và chế tạo. Giá trị điển hình: 1,25–1,5 khi tải rõ ràng và vật liệu có chứng nhận (máy bay), 2–3 cho chi tiết máy thông thường, 3–4 trở lên khi tải bất định hoặc vật liệu giòn (xem thêm bài 7.4).</p>
<h3>✍️ Ví dụ giải — thanh nối, chốt và tấm</h3>
<div class="callout"><p>Một thanh nối chịu lực kéo P = 20 kN.</p>
<p><b>(a) Ứng suất trong thanh</b>, d = 12 mm: A = π·12<sup>2</sup>/4 = 113,1 mm<sup>2</sup> ⇒ σ = 20 000/113,1 = <b>176,8 MPa</b>.</p>
<p><b>(b) Chốt cắt kép</b>, d = 10 mm: τ = (P/2)/(π·10<sup>2</sup>/4) = 10 000/78,54 = <b>127,3 MPa</b>.</p>
<p><b>(c) Ứng suất dập</b> của chốt 10 mm lên tấm dày 8 mm: σ<sub>b</sub> = 20 000/(8 × 10) = <b>250 MPa</b>.</p>
<p><b>(d) Thiết kế.</b> Thanh bằng thép S<sub>y</sub> = 250 MPa, yêu cầu n = 2: σ<sub>allow</sub> = 125 MPa, nên A ≥ 20 000/125 = 160 mm<sup>2</sup> ⇒ d ≥ √(4 × 160/π) = <b>14,3 mm</b> ⇒ chọn thanh chuẩn <b>16 mm</b>. Với d = 12 mm hệ số an toàn chỉ còn 250/176,8 = 1,41.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng đường kính thay cho diện tích, hoặc dùng bán kính trong πd<sup>2</sup>/4.</li><li>Quên rằng cắt kép làm ứng suất giảm một nửa.</li><li>Dùng cả diện tích tròn của chốt khi tính dập thay vì t·d.</li><li>Làm tròn đường kính tính được <em>xuống</em> cỡ chuẩn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>σ = P/A, τ = V/A, σ<sub>b</sub> = P/(t·d); dùng N và mm thì ra MPa.</li><li>Đếm mặt cắt: cắt đơn V = P, cắt kép V = P/2.</li><li>n = độ bền/ứng suất; σ<sub>allow</sub> = S<sub>y</sub>/n.</li><li>Thiết kế: diện tích cần từ σ<sub>allow</sub>, rồi làm tròn lên cỡ chuẩn.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(OSP + '12-3-stress-strain-and-elastic-modulus', 'OpenStax 12.3 — Ứng suất, biến dạng và môđun đàn hồi'),
    A(OCW_MOM, 'MIT OCW 2.001 — Mechanics &amp; Materials I'),
    A(WK + 'Shear_stress', 'Wikipedia — Ứng suất cắt'),
    A(WK + 'Factor_of_safety', 'Wikipedia — Hệ số an toàn'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Chốt 8 mm cắt đơn chịu 5 kN. Tìm τ.</li><li>Thanh thép vuông 25 × 25 mm bị nén 100 kN. Tìm σ.</li><li>Chi tiết có S<sub>y</sub> = 355 MPa làm việc ở 120 MPa. Hệ số an toàn bằng bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) τ = 5000/(π·8<sup>2</sup>/4) = 99,5 MPa. 2) σ = −100 000/625 = −160 MPa (nén). 3) n = 355/120 = 2,96.</p></div>`);

const c52 = L('emm201c-ts-5-2',
  '5.2 — Strain, Hooke\'s law and the stress–strain diagram|||5.2 — Biến dạng, định luật Hooke và biểu đồ ứng suất – biến dạng',
  'Biến dạng dài ε và biến dạng góc γ; thí nghiệm kéo; giới hạn tỉ lệ, chảy S_y, bền S_ut; vật liệu dẻo và giòn; định luật Hooke σ = Eε, τ = Gγ; hệ số Poisson.',
  `<span class="eyebrow">EMM201c · Chapter 5 · Lesson 5.2</span>
<h2>Strain, Hooke's law and the stress–strain diagram</h2>
<h3>🎯 Objectives</h3>
<ul><li>Define normal and shear strain.</li><li>Read the key points of a tensile stress–strain diagram.</li><li>Use Hooke's law, Poisson's ratio and the relation between E, G and ν.</li></ul>
<h3>Strain</h3>
<p><strong>Normal strain</strong> is the change in length per unit length: ε = δ/L (dimensionless; often written in μm/m or %). <strong>Shear strain</strong> γ is the change, in radians, of an originally right angle.</p>
<h3>The tensile test</h3>
<p>A standard specimen is pulled in a testing machine while force and elongation are recorded; dividing by the original area and length gives the <strong>engineering stress–strain diagram</strong>. For a ductile steel, read from left to right:</p>
<table>
<tr><th>Region / point</th><th>What happens</th></tr>
<tr><td>Linear elastic region</td><td>σ proportional to ε; unloading returns to zero strain</td></tr>
<tr><td>Yield strength S<sub>y</sub></td><td>start of permanent (plastic) deformation; for metals without a sharp yield point use the 0.2 % offset method</td></tr>
<tr><td>Strain hardening</td><td>stress rises again as the metal is stretched plastically</td></tr>
<tr><td>Ultimate tensile strength S<sub>ut</sub></td><td>maximum engineering stress</td></tr>
<tr><td>Necking and fracture</td><td>local contraction, then rupture</td></tr>
</table>
<p><strong>Ductile</strong> materials (mild steel, aluminium, copper) show large strain before fracture (elongation &gt; 5 %) and give warning before failure. <strong>Brittle</strong> materials (cast iron, glass, ceramics, many hardened steels) break with little plastic strain and are stronger in compression than in tension.</p>
<h3>Hooke's law and Poisson's ratio</h3>
<div class="formula"><span class="lbl">Linear elasticity</span>σ = E·ε &nbsp;&nbsp; τ = G·γ<br>Lateral strain: ε<sub>lat</sub> = −ν·ε<sub>axial</sub><br>G = E / [2(1 + ν)]</div>
<table>
<tr><th>Material (typical)</th><th>E (GPa)</th><th>ν</th></tr>
<tr><td>Structural / machine steel</td><td>200–207</td><td>0.29–0.30</td></tr>
<tr><td>Aluminium alloys</td><td>69–72</td><td>0.33</td></tr>
<tr><td>Titanium alloys</td><td>~110</td><td>0.34</td></tr>
<tr><td>Grey cast iron</td><td>~100</td><td>0.26</td></tr>
</table>
<p>E is a property of the material family and barely changes with heat treatment: a hardened steel is <em>stronger</em> than a mild steel but <em>not stiffer</em>. If a part deflects too much, choose a larger section, not a "better" steel.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p>A steel tie rod, d = 20 mm, L = 1.5 m, E = 200 GPa, ν = 0.30, carries P = 50 kN.</p>
<p>A = π·20<sup>2</sup>/4 = 314.2 mm<sup>2</sup> ⇒ σ = 50 000/314.2 = <b>159.2 MPa</b> (below S<sub>y</sub> ⇒ elastic).</p>
<p>ε = σ/E = 159.2/200 000 = <b>7.96 × 10<sup>−4</sup></b> ⇒ δ = εL = 7.96 × 10<sup>−4</sup> × 1500 = <b>1.19 mm</b>.</p>
<p>Lateral strain = −0.30 × 7.96 × 10<sup>−4</sup> = −2.39 × 10<sup>−4</sup> ⇒ the diameter shrinks by 20 × 2.39 × 10<sup>−4</sup> = <b>0.0048 mm</b>.</p>
<p>Shear modulus: G = 200/(2 × 1.3) = <b>76.9 GPa</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Mixing GPa and MPa: E = 200 GPa = 200 000 MPa.</li><li>Applying Hooke's law beyond the yield strength.</li><li>Thinking that a higher-strength steel deflects less.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>ε = δ/L, γ in radians.</li><li>Key strengths: S<sub>y</sub> (yield), S<sub>ut</sub> (ultimate).</li><li>Elastic: σ = Eε, τ = Gγ, G = E/[2(1+ν)].</li><li>Ductile vs brittle decides the failure theory (Chapter 7).</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(DP + 'mechanical_testing_metals/index.php', 'DoITPoMS (Cambridge) — Mechanical testing of metals'),
    A(WK + 'Stress%E2%80%93strain_curve', 'Wikipedia — Stress–strain curve'),
    A(WK + 'Poisson%27s_ratio', 'Wikipedia — Poisson\'s ratio'),
    A('https://www.engineeringtoolbox.com/young-modulus-d_417.html', 'Engineering ToolBox — Young\'s modulus of common materials'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>An aluminium bar (E = 70 GPa) is stressed to 100 MPa. Find the strain and the elongation of a 2 m length.</li><li>Find G for aluminium with E = 70 GPa, ν = 0.33.</li><li>At what strain does a steel with S<sub>y</sub> = 250 MPa start to yield?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) ε = 100/70 000 = 1.43 × 10<sup>−3</sup>; δ = 2.86 mm. 2) G = 70/(2 × 1.33) = 26.3 GPa. 3) ε = 250/200 000 = 1.25 × 10<sup>−3</sup> (0.125 %).</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 5 · Bài 5.2</span>
<h2>Biến dạng, định luật Hooke và biểu đồ ứng suất – biến dạng</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Định nghĩa biến dạng dài và biến dạng góc.</li><li>Đọc các điểm chính trên biểu đồ kéo ứng suất – biến dạng.</li><li>Dùng định luật Hooke, hệ số Poisson và quan hệ giữa E, G, ν.</li></ul>
<h3>Biến dạng</h3>
<p><strong>Biến dạng dài</strong> là độ thay đổi chiều dài trên một đơn vị chiều dài: ε = δ/L (không thứ nguyên; thường ghi μm/m hoặc %). <strong>Biến dạng góc</strong> γ là độ thay đổi, tính bằng radian, của một góc ban đầu vuông.</p>
<h3>Thí nghiệm kéo</h3>
<p>Mẫu chuẩn được kéo trên máy thử trong khi ghi lại lực và độ dãn; chia cho diện tích và chiều dài ban đầu ta được <strong>biểu đồ ứng suất – biến dạng kỹ thuật</strong>. Với thép dẻo, đọc từ trái sang phải:</p>
<table>
<tr><th>Vùng / điểm</th><th>Hiện tượng</th></tr>
<tr><td>Vùng đàn hồi tuyến tính</td><td>σ tỉ lệ với ε; dỡ tải thì biến dạng về 0</td></tr>
<tr><td>Giới hạn chảy S<sub>y</sub></td><td>bắt đầu biến dạng dư (dẻo); kim loại không có điểm chảy rõ dùng phương pháp offset 0,2 %</td></tr>
<tr><td>Hoá bền</td><td>ứng suất lại tăng khi kim loại bị kéo dẻo</td></tr>
<tr><td>Giới hạn bền kéo S<sub>ut</sub></td><td>ứng suất kỹ thuật lớn nhất</td></tr>
<tr><td>Thắt cổ và đứt</td><td>co thắt cục bộ, rồi đứt</td></tr>
</table>
<p>Vật liệu <strong>dẻo</strong> (thép thường, nhôm, đồng) biến dạng lớn trước khi đứt (độ dãn dài &gt; 5 %) và báo trước khi hỏng. Vật liệu <strong>giòn</strong> (gang, thuỷ tinh, gốm, nhiều loại thép tôi cứng) gãy với biến dạng dẻo rất nhỏ và chịu nén tốt hơn chịu kéo.</p>
<h3>Định luật Hooke và hệ số Poisson</h3>
<div class="formula"><span class="lbl">Đàn hồi tuyến tính</span>σ = E·ε &nbsp;&nbsp; τ = G·γ<br>Biến dạng ngang: ε<sub>ngang</sub> = −ν·ε<sub>dọc</sub><br>G = E / [2(1 + ν)]</div>
<table>
<tr><th>Vật liệu (điển hình)</th><th>E (GPa)</th><th>ν</th></tr>
<tr><td>Thép kết cấu / thép chế tạo máy</td><td>200–207</td><td>0,29–0,30</td></tr>
<tr><td>Hợp kim nhôm</td><td>69–72</td><td>0,33</td></tr>
<tr><td>Hợp kim titan</td><td>~110</td><td>0,34</td></tr>
<tr><td>Gang xám</td><td>~100</td><td>0,26</td></tr>
</table>
<p>E là tính chất của họ vật liệu và hầu như không đổi khi nhiệt luyện: thép tôi <em>bền hơn</em> thép thường nhưng <em>không cứng (vững) hơn</em>. Nếu chi tiết võng quá, hãy tăng tiết diện, đừng đổi sang "thép tốt hơn".</p>
<h3>✍️ Ví dụ giải</h3>
<div class="callout"><p>Thanh giằng thép d = 20 mm, L = 1,5 m, E = 200 GPa, ν = 0,30, chịu P = 50 kN.</p>
<p>A = π·20<sup>2</sup>/4 = 314,2 mm<sup>2</sup> ⇒ σ = 50 000/314,2 = <b>159,2 MPa</b> (dưới S<sub>y</sub> ⇒ đàn hồi).</p>
<p>ε = σ/E = 159,2/200 000 = <b>7,96 × 10<sup>−4</sup></b> ⇒ δ = εL = 7,96 × 10<sup>−4</sup> × 1500 = <b>1,19 mm</b>.</p>
<p>Biến dạng ngang = −0,30 × 7,96 × 10<sup>−4</sup> = −2,39 × 10<sup>−4</sup> ⇒ đường kính giảm 20 × 2,39 × 10<sup>−4</sup> = <b>0,0048 mm</b>.</p>
<p>Môđun trượt: G = 200/(2 × 1,3) = <b>76,9 GPa</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Trộn GPa và MPa: E = 200 GPa = 200 000 MPa.</li><li>Áp dụng định luật Hooke vượt quá giới hạn chảy.</li><li>Nghĩ rằng thép bền hơn thì võng ít hơn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>ε = δ/L, γ tính bằng radian.</li><li>Độ bền chính: S<sub>y</sub> (chảy), S<sub>ut</sub> (bền kéo).</li><li>Đàn hồi: σ = Eε, τ = Gγ, G = E/[2(1+ν)].</li><li>Dẻo hay giòn quyết định thuyết bền dùng (Chương 7).</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(DP + 'mechanical_testing_metals/index.php', 'DoITPoMS (Cambridge) — Thử cơ tính kim loại'),
    A(WK + 'Stress%E2%80%93strain_curve', 'Wikipedia — Biểu đồ ứng suất – biến dạng'),
    A(WK + 'Poisson%27s_ratio', 'Wikipedia — Hệ số Poisson'),
    A('https://www.engineeringtoolbox.com/young-modulus-d_417.html', 'Engineering ToolBox — Môđun Young của vật liệu thường gặp'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Thanh nhôm (E = 70 GPa) chịu ứng suất 100 MPa. Tìm biến dạng và độ dãn của đoạn dài 2 m.</li><li>Tìm G của nhôm với E = 70 GPa, ν = 0,33.</li><li>Thép có S<sub>y</sub> = 250 MPa bắt đầu chảy ở biến dạng bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) ε = 100/70 000 = 1,43 × 10<sup>−3</sup>; δ = 2,86 mm. 2) G = 70/(2 × 1,33) = 26,3 GPa. 3) ε = 250/200 000 = 1,25 × 10<sup>−3</sup> (0,125 %).</p></div>`);

const c53 = L('emm201c-ts-5-3',
  '5.3 — Axial deformation, statically indeterminate bars and thermal stress|||5.3 — Biến dạng dọc trục, thanh siêu tĩnh và ứng suất nhiệt',
  'Độ dãn δ = PL/(AE), thanh bậc ghép nhiều đoạn; bài toán siêu tĩnh: cân bằng + tương thích biến dạng; ứng suất nhiệt σ = EαΔT; khe hở bù nhiệt.',
  `<span class="eyebrow">EMM201c · Chapter 5 · Lesson 5.3</span>
<h2>Axial deformation, indeterminate bars and thermal stress</h2>
<h3>🎯 Objectives</h3>
<ul><li>Compute the elongation of single and stepped bars.</li><li>Solve a statically indeterminate axial problem with a compatibility condition.</li><li>Compute thermal stress in a restrained bar.</li></ul>
<h3>Elongation of a bar</h3>
<p>Combining σ = P/A, ε = δ/L and σ = Eε:</p>
<div class="formula"><span class="lbl">Axial deformation</span>δ = P·L / (A·E) &nbsp;&nbsp; stepped bar: δ = Σ P<sub>i</sub>L<sub>i</sub> / (A<sub>i</sub>E<sub>i</sub>)<br>Axial stiffness: k = A·E / L &nbsp;[N/mm]</div>
<p>Use the <em>internal</em> force P<sub>i</sub> of each segment (found with a section), with sign: tension positive.</p>
<div class="callout"><p><b>Example 1 — stepped bar.</b> A 40 kN tensile force passes through a steel segment AB (d = 20 mm, L = 500 mm, E = 200 GPa) and an aluminium segment BC (d = 30 mm, L = 800 mm, E = 70 GPa).</p>
<p>δ<sub>AB</sub> = 40 000 × 500/(314.2 × 200 000) = <b>0.318 mm</b>; σ<sub>AB</sub> = 127.3 MPa.</p>
<p>δ<sub>BC</sub> = 40 000 × 800/(706.9 × 70 000) = <b>0.647 mm</b>; σ<sub>BC</sub> = 56.6 MPa.</p>
<p>Total δ = <b>0.965 mm</b>. The thicker aluminium part has lower stress but stretches more — stiffness and strength are different questions.</p></div>
<h3>Statically indeterminate bars</h3>
<p>When there are more unknown forces than equilibrium equations, add a <strong>compatibility</strong> equation describing the geometry of deformation, and the <strong>force–deformation</strong> relation δ = PL/AE.</p>
<div class="callout"><p><b>Example 2.</b> A uniform bar of length L = 1.0 m is fixed to rigid walls at both ends, A and B. An axial load P = 30 kN is applied at a collar a = 0.4 m from A (b = 0.6 m from B).</p>
<p>Equilibrium: R<sub>A</sub> + R<sub>B</sub> = 30 kN (one equation, two unknowns).</p>
<p>Compatibility: the total length cannot change ⇒ the elongation of segment AC equals the shortening of CB: R<sub>A</sub>·a/(AE) = R<sub>B</sub>·b/(AE).</p>
<p>Solving: R<sub>A</sub> = P·b/L = <b>18 kN</b> (AC in tension), R<sub>B</sub> = P·a/L = <b>12 kN</b> (CB in compression). The <em>nearer</em> wall takes the larger share — the stiffer path attracts more load.</p></div>
<h3>Thermal stress</h3>
<p>A free bar heated by ΔT grows by δ<sub>T</sub> = α·ΔT·L (α ≈ 12 × 10<sup>−6</sup>/°C for steel, 23 × 10<sup>−6</sup>/°C for aluminium). If rigid supports prevent this, the bar is compressed by exactly δ<sub>T</sub>:</p>
<div class="formula"><span class="lbl">Fully restrained bar</span>σ = −E·α·ΔT &nbsp;(independent of length and area!)</div>
<div class="callout"><p><b>Example 3.</b> A steel rail fixed between rigid anchors is heated by 40 °C: σ = 200 000 × 12 × 10<sup>−6</sup> × 40 = <b>96 MPa (compression)</b>. That is why rails, pipelines and exhaust systems need expansion gaps or flexible sections. A 10 m rail with a 0.5 mm gap: free growth 4.8 mm, 4.3 mm restrained ⇒ σ = 200 000 × 4.3/10 000 = 86 MPa.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the external load instead of each segment's internal force.</li><li>Solving an indeterminate problem with equilibrium alone.</li><li>Forgetting that thermal stress does not depend on area.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>δ = PL/(AE); sum over segments.</li><li>Indeterminate: equilibrium + compatibility + δ = PL/AE.</li><li>Restrained heating: σ = EαΔT.</li><li>Gaps or flexible joints relieve thermal stress.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(OCW_MOM, 'MIT OCW 2.001 — Mechanics &amp; Materials I (axial loading, indeterminate systems)'),
    A(DP + 'thermal-expansion/index.php', 'DoITPoMS — Thermal expansion and the bi-material strip'),
    A(WK + 'Thermal_expansion', 'Wikipedia — Thermal expansion'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A steel rod (E = 200 GPa), d = 16 mm, L = 2 m, carries 25 kN. Find δ.</li><li>An aluminium bar (E = 70 GPa, α = 23 × 10<sup>−6</sup>/°C) is fully restrained and heated by 25 °C. Find σ.</li><li>In Example 2, move the load to the middle of the bar. Find R<sub>A</sub> and R<sub>B</sub>.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) δ = 25 000 × 2000/(201.1 × 200 000) = 1.24 mm. 2) σ = 70 000 × 23 × 10<sup>−6</sup> × 25 = 40.3 MPa (compression). 3) 15 kN each.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 5 · Bài 5.3</span>
<h2>Biến dạng dọc trục, thanh siêu tĩnh và ứng suất nhiệt</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính độ dãn của thanh một đoạn và thanh bậc.</li><li>Giải bài toán kéo–nén siêu tĩnh bằng điều kiện tương thích biến dạng.</li><li>Tính ứng suất nhiệt trong thanh bị ngăn giãn nở.</li></ul>
<h3>Độ dãn của thanh</h3>
<p>Kết hợp σ = P/A, ε = δ/L và σ = Eε:</p>
<div class="formula"><span class="lbl">Biến dạng dọc trục</span>δ = P·L / (A·E) &nbsp;&nbsp; thanh bậc: δ = Σ P<sub>i</sub>L<sub>i</sub> / (A<sub>i</sub>E<sub>i</sub>)<br>Độ cứng dọc trục: k = A·E / L &nbsp;[N/mm]</div>
<p>Dùng <em>nội lực</em> P<sub>i</sub> của từng đoạn (tìm bằng mặt cắt), có dấu: kéo dương.</p>
<div class="callout"><p><b>Ví dụ 1 — thanh bậc.</b> Lực kéo 40 kN truyền qua đoạn thép AB (d = 20 mm, L = 500 mm, E = 200 GPa) và đoạn nhôm BC (d = 30 mm, L = 800 mm, E = 70 GPa).</p>
<p>δ<sub>AB</sub> = 40 000 × 500/(314,2 × 200 000) = <b>0,318 mm</b>; σ<sub>AB</sub> = 127,3 MPa.</p>
<p>δ<sub>BC</sub> = 40 000 × 800/(706,9 × 70 000) = <b>0,647 mm</b>; σ<sub>BC</sub> = 56,6 MPa.</p>
<p>Tổng δ = <b>0,965 mm</b>. Đoạn nhôm to hơn có ứng suất thấp hơn nhưng dãn nhiều hơn — độ cứng và độ bền là hai câu hỏi khác nhau.</p></div>
<h3>Thanh siêu tĩnh</h3>
<p>Khi số lực chưa biết nhiều hơn số phương trình cân bằng, thêm phương trình <strong>tương thích</strong> mô tả hình học biến dạng, cùng quan hệ <strong>lực – biến dạng</strong> δ = PL/AE.</p>
<div class="callout"><p><b>Ví dụ 2.</b> Thanh tiết diện đều dài L = 1,0 m bị ngàm vào hai tường cứng ở hai đầu A và B. Lực dọc P = 30 kN đặt tại một vành cách A a = 0,4 m (cách B b = 0,6 m).</p>
<p>Cân bằng: R<sub>A</sub> + R<sub>B</sub> = 30 kN (một phương trình, hai ẩn).</p>
<p>Tương thích: tổng chiều dài không đổi ⇒ độ dãn đoạn AC bằng độ co đoạn CB: R<sub>A</sub>·a/(AE) = R<sub>B</sub>·b/(AE).</p>
<p>Giải: R<sub>A</sub> = P·b/L = <b>18 kN</b> (AC chịu kéo), R<sub>B</sub> = P·a/L = <b>12 kN</b> (CB chịu nén). Tường <em>gần</em> hơn nhận phần lớn hơn — đường cứng hơn hút nhiều tải hơn.</p></div>
<h3>Ứng suất nhiệt</h3>
<p>Thanh tự do nung nóng thêm ΔT sẽ dài ra δ<sub>T</sub> = α·ΔT·L (α ≈ 12 × 10<sup>−6</sup>/°C với thép, 23 × 10<sup>−6</sup>/°C với nhôm). Nếu gối cứng ngăn điều đó, thanh bị nén đúng một lượng δ<sub>T</sub>:</p>
<div class="formula"><span class="lbl">Thanh bị ngăn hoàn toàn</span>σ = −E·α·ΔT &nbsp;(không phụ thuộc chiều dài và diện tích!)</div>
<div class="callout"><p><b>Ví dụ 3.</b> Ray thép ngàm giữa hai mố cứng bị nóng thêm 40 °C: σ = 200 000 × 12 × 10<sup>−6</sup> × 40 = <b>96 MPa (nén)</b>. Vì vậy ray, đường ống và hệ thống ống xả cần khe giãn nở hoặc đoạn mềm. Ray dài 10 m có khe 0,5 mm: dãn tự do 4,8 mm, bị cản 4,3 mm ⇒ σ = 200 000 × 4,3/10 000 = 86 MPa.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng tải ngoài thay vì nội lực của từng đoạn.</li><li>Giải bài toán siêu tĩnh chỉ bằng cân bằng.</li><li>Quên rằng ứng suất nhiệt không phụ thuộc diện tích.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>δ = PL/(AE); cộng theo từng đoạn.</li><li>Siêu tĩnh: cân bằng + tương thích + δ = PL/AE.</li><li>Nung nóng bị ngăn: σ = EαΔT.</li><li>Khe hở hoặc mối nối mềm giải phóng ứng suất nhiệt.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(OCW_MOM, 'MIT OCW 2.001 — Mechanics &amp; Materials I (kéo nén, hệ siêu tĩnh)'),
    A(DP + 'thermal-expansion/index.php', 'DoITPoMS — Giãn nở nhiệt và tấm lưỡng kim'),
    A(WK + 'Thermal_expansion', 'Wikipedia — Giãn nở nhiệt'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Thanh thép (E = 200 GPa), d = 16 mm, L = 2 m, chịu 25 kN. Tìm δ.</li><li>Thanh nhôm (E = 70 GPa, α = 23 × 10<sup>−6</sup>/°C) bị ngăn hoàn toàn và nóng thêm 25 °C. Tìm σ.</li><li>Trong Ví dụ 2, dời lực vào giữa thanh. Tìm R<sub>A</sub>, R<sub>B</sub>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) δ = 25 000 × 2000/(201,1 × 200 000) = 1,24 mm. 2) σ = 70 000 × 23 × 10<sup>−6</sup> × 25 = 40,3 MPa (nén). 3) Mỗi bên 15 kN.</p></div>`);

const q5 = QZ(5, 'Quiz — Chapter 5: Stress, strain and axial loading|||Quiz — Chương 5: Ứng suất, biến dạng và kéo – nén', 'Kiểm tra chương 5: ứng suất pháp, cắt, dập, hệ số an toàn, biểu đồ ứng suất – biến dạng, định luật Hooke, Poisson, δ = PL/AE, siêu tĩnh, ứng suất nhiệt.', [
  Q('q1', 'A 10 kN axial force on a 100 mm² area gives a stress of|||Lực dọc 10 kN trên diện tích 100 mm² gây ứng suất',
    ['10 MPa|||10 MPa', '100 MPa|||100 MPa', '1 MPa|||1 MPa', '1000 MPa|||1000 MPa'], 1,
    '10 000 N / 100 mm² = 100 N/mm².|||10 000 N / 100 mm² = 100 N/mm².'),
  Q('q2', 'A pin in double shear carrying P has, on each shear plane, a force of|||Chốt cắt kép chịu P, mỗi mặt cắt chịu lực',
    ['P|||P', 'P/2|||P/2', '2P|||2P', 'P/4|||P/4'], 1,
    'Two planes share the load.|||Hai mặt chia nhau tải.'),
  Q('q3', 'Bearing stress of a pin (diameter d) in a plate of thickness t is|||Ứng suất dập của chốt (đường kính d) trong tấm dày t là',
    ['P/(πd²/4)|||P/(πd²/4)', 'P/(t·d)|||P/(t·d)', 'P/(π·d·t)|||P/(π·d·t)', 'P·t/d|||P·t/d'], 1,
    'Projected contact area t·d.|||Diện tích chiếu t·d.'),
  Q('q4', 'Sy = 300 MPa, working stress 120 MPa. The factor of safety against yield is|||Sy = 300 MPa, ứng suất làm việc 120 MPa. Hệ số an toàn chống chảy là',
    ['0.4|||0,4', '2.5|||2,5', '3.6|||3,6', '180|||180'], 1,
    'n = 300/120.|||n = 300/120.'),
  Q('q5', 'Which property is almost unchanged by heat-treating a steel?|||Tính chất nào gần như không đổi khi nhiệt luyện thép?',
    ['Yield strength|||Giới hạn chảy', 'Elastic modulus E|||Môđun đàn hồi E', 'Ultimate strength|||Giới hạn bền', 'Hardness|||Độ cứng'], 1,
    'E ≈ 200 GPa for all steels.|||E ≈ 200 GPa cho mọi loại thép.'),
  Q('q6', 'Steel (E = 200 GPa) at σ = 100 MPa has a strain of|||Thép (E = 200 GPa) ở σ = 100 MPa có biến dạng',
    ['5 × 10⁻⁴|||5 × 10⁻⁴', '5 × 10⁻²|||5 × 10⁻²', '2 × 10⁻³|||2 × 10⁻³', '0.5|||0,5'], 0,
    'ε = 100/200 000.|||ε = 100/200 000.'),
  Q('q7', 'For ν = 0.3 and E = 200 GPa, G is about|||Với ν = 0,3 và E = 200 GPa, G xấp xỉ',
    ['60 GPa|||60 GPa', '77 GPa|||77 GPa', '100 GPa|||100 GPa', '154 GPa|||154 GPa'], 1,
    'G = E/[2(1+ν)] = 200/2.6.|||G = E/[2(1+ν)] = 200/2,6.'),
  Q('q8', 'Doubling the length of an axially loaded bar (same P, A, E) makes δ|||Tăng gấp đôi chiều dài thanh chịu kéo (cùng P, A, E) thì δ',
    ['halve|||giảm một nửa', 'double|||tăng gấp đôi', 'stay the same|||không đổi', 'quadruple|||tăng bốn lần'], 1,
    'δ = PL/AE is linear in L.|||δ = PL/AE tỉ lệ bậc nhất với L.'),
  Q('q9', 'A statically indeterminate axial problem needs, in addition to equilibrium,|||Bài toán kéo nén siêu tĩnh cần thêm, ngoài cân bằng,',
    ['a larger factor of safety|||hệ số an toàn lớn hơn', 'a compatibility (deformation) condition|||điều kiện tương thích biến dạng', 'friction|||ma sát', 'nothing|||không cần gì'], 1,
    'Geometry of deformation supplies the missing equation.|||Hình học biến dạng cho phương trình còn thiếu.'),
  Q('q10', 'A fully restrained steel bar (E = 200 GPa, α = 12×10⁻⁶/°C) heated 50 °C has a stress of|||Thanh thép bị ngăn hoàn toàn (E = 200 GPa, α = 12×10⁻⁶/°C) nóng thêm 50 °C có ứng suất',
    ['12 MPa|||12 MPa', '120 MPa compression|||120 MPa nén', '120 MPa tension|||120 MPa kéo', 'depends on area|||tuỳ diện tích'], 1,
    'σ = EαΔT = 200 000 × 12e-6 × 50, compressive.|||σ = EαΔT = 200 000 × 12e-6 × 50, nén.'),
]);

const ch5 = {
  title: 'Chapter 5 — Stress, strain and axial loading|||Chương 5 — Ứng suất, biến dạng và kéo – nén đúng tâm',
  description: 'Ứng suất pháp/cắt/dập, hệ số an toàn, thí nghiệm kéo, định luật Hooke, Poisson, độ dãn δ = PL/AE, thanh siêu tĩnh, ứng suất nhiệt (Beer & Johnston ch.1–2).',
  lessons: [c51, c52, c53, q5],
};

// ───────────────────────────── Chương 6 ─────────────────────────────
const c61 = L('emm201c-ts-6-1',
  '6.1 — Torsion of circular shafts and power transmission|||6.1 — Xoắn trục tròn và truyền công suất',
  'Giả thiết xoắn trục tròn; τ = Tρ/J, τmax = 16T/(πd³); góc xoắn φ = TL/(GJ); trục rỗng; P = T·ω; thiết kế trục theo bền và theo cứng.',
  `<span class="eyebrow">EMM201c · Chapter 6 · Lesson 6.1</span>
<h2>Torsion of circular shafts and power transmission</h2>
<h3>🎯 Objectives</h3>
<ul><li>Compute shear stress and angle of twist in solid and hollow circular shafts.</li><li>Convert between power, speed and torque.</li><li>Size a shaft for strength and for torsional stiffness.</li></ul>
<h3>Torsion formula</h3>
<p>When a circular shaft is twisted by a torque T, plane cross-sections stay plane and radii stay straight. The shear strain — and, in the elastic range, the shear stress — grows linearly from zero at the centre to a maximum at the surface.</p>
<div class="formula"><span class="lbl">Torsion of circular shafts</span>τ = T·ρ / J &nbsp;&nbsp; τ<sub>max</sub> = T·c / J<br>Solid shaft: J = πd<sup>4</sup>/32 ⇒ τ<sub>max</sub> = 16T / (πd<sup>3</sup>)<br>Hollow: J = π(d<sub>o</sub><sup>4</sup> − d<sub>i</sub><sup>4</sup>)/32, c = d<sub>o</sub>/2<br>Angle of twist: φ = T·L / (G·J) &nbsp;[rad]</div>
<p>These formulas hold only for <strong>circular</strong> (solid or tubular) sections. Non-circular sections warp and need other formulas.</p>
<h3>Power, speed and torque</h3>
<div class="formula"><span class="lbl">Power transmission</span>P = T·ω, &nbsp; ω = 2πn/60 &nbsp;(n in rpm, ω in rad/s, P in W, T in N·m)</div>
<p>At constant power, a shaft that turns faster carries less torque — that is why the high-speed input shaft of a gearbox is thin and the slow output shaft is thick.</p>
<h3>✍️ Worked examples</h3>
<div class="callout"><p><b>Example 1 — stress and twist.</b> A solid steel shaft, d = 40 mm, L = 1.2 m, G = 80 GPa, carries T = 1 kN·m.</p>
<p>τ<sub>max</sub> = 16 × 1 000 000/(π × 40<sup>3</sup>) = <b>79.6 MPa</b>.</p>
<p>J = π × 40<sup>4</sup>/32 = 2.513 × 10<sup>5</sup> mm<sup>4</sup>; φ = 1 000 000 × 1200/(80 000 × 2.513 × 10<sup>5</sup>) = <b>0.0597 rad = 3.42°</b>.</p></div>
<div class="callout"><p><b>Example 2 — motor shaft design.</b> A 15 kW motor runs at 1450 rpm. ω = 2π × 1450/60 = 151.8 rad/s ⇒ T = 15 000/151.8 = <b>98.8 N·m</b>.</p>
<p><b>By strength</b> with τ<sub>allow</sub> = 40 MPa: d = [16T/(π τ<sub>allow</sub>)]<sup>1/3</sup> = [16 × 98 800/(π × 40)]<sup>1/3</sup> = <b>23.3 mm</b> ⇒ choose 25 mm.</p>
<p><b>By stiffness</b>, with a common limit of 0.25° per metre and G = 80 GPa: d = [32T/(πGθ)]<sup>1/4</sup>, θ = 0.25° /m in rad/mm ⇒ d = <b>41.2 mm</b>. Stiffness governs here — a frequent outcome for long drive shafts and precision axes.</p></div>
<div class="callout"><p><b>Example 3 — hollow shaft.</b> A tube 50/40 mm under the same 1 kN·m: J = 3.623 × 10<sup>5</sup> mm<sup>4</sup>, τ<sub>max</sub> = 1 000 000 × 25/3.623 × 10<sup>5</sup> = <b>69.0 MPa</b> — lower than the 40 mm solid shaft (79.6 MPa) with 56 % of its material. Car drive shafts are tubes for this reason.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using rpm directly in P = Tω.</li><li>Using I (πd<sup>4</sup>/64) instead of J (πd<sup>4</sup>/32).</li><li>Forgetting to check twist when the shaft is long.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>τ<sub>max</sub> = Tc/J = 16T/(πd<sup>3</sup>) for a solid shaft.</li><li>φ = TL/(GJ), in radians.</li><li>P = Tω with ω = 2πn/60.</li><li>Check both strength and stiffness; tubes are efficient.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(DP + 'beam_bending/index.php', 'DoITPoMS — Bending and torsion of beams'),
    A(WK + 'Torsion_(mechanics)', 'Wikipedia — Torsion (mechanics)'),
    A(OSP + '10-8-work-and-power-for-rotational-motion', 'OpenStax 10.8 — Work and power for rotational motion'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>Find the torque transmitted by a 30 kW shaft at 3000 rpm.</li><li>A 25 mm solid shaft carries 98.8 N·m. Find τ<sub>max</sub>.</li><li>How does τ<sub>max</sub> change if the diameter of a solid shaft is doubled?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) T = 30 000/(2π × 3000/60) = 95.5 N·m. 2) 16 × 98 800/(π × 25<sup>3</sup>) = 32.2 MPa. 3) It drops by a factor 2<sup>3</sup> = 8.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 6 · Bài 6.1</span>
<h2>Xoắn trục tròn và truyền công suất</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính ứng suất cắt và góc xoắn trong trục tròn đặc và rỗng.</li><li>Chuyển đổi giữa công suất, tốc độ và mômen xoắn.</li><li>Chọn đường kính trục theo bền và theo cứng xoắn.</li></ul>
<h3>Công thức xoắn</h3>
<p>Khi trục tròn bị xoắn bởi mômen T, mặt cắt ngang vẫn phẳng và bán kính vẫn thẳng. Biến dạng góc — và trong miền đàn hồi, ứng suất cắt — tăng tuyến tính từ 0 ở tâm đến cực đại ở mặt ngoài.</p>
<div class="formula"><span class="lbl">Xoắn trục tròn</span>τ = T·ρ / J &nbsp;&nbsp; τ<sub>max</sub> = T·c / J<br>Trục đặc: J = πd<sup>4</sup>/32 ⇒ τ<sub>max</sub> = 16T / (πd<sup>3</sup>)<br>Trục rỗng: J = π(d<sub>o</sub><sup>4</sup> − d<sub>i</sub><sup>4</sup>)/32, c = d<sub>o</sub>/2<br>Góc xoắn: φ = T·L / (G·J) &nbsp;[rad]</div>
<p>Các công thức này chỉ đúng với mặt cắt <strong>tròn</strong> (đặc hoặc ống). Mặt cắt không tròn bị vênh và cần công thức khác.</p>
<h3>Công suất, tốc độ và mômen xoắn</h3>
<div class="formula"><span class="lbl">Truyền công suất</span>P = T·ω, &nbsp; ω = 2πn/60 &nbsp;(n theo vòng/phút, ω theo rad/s, P theo W, T theo N·m)</div>
<p>Ở cùng công suất, trục quay nhanh hơn chịu mômen nhỏ hơn — vì vậy trục vào tốc độ cao của hộp số thì mảnh, trục ra tốc độ thấp thì to.</p>
<h3>✍️ Ví dụ giải</h3>
<div class="callout"><p><b>Ví dụ 1 — ứng suất và góc xoắn.</b> Trục thép đặc d = 40 mm, L = 1,2 m, G = 80 GPa, chịu T = 1 kN·m.</p>
<p>τ<sub>max</sub> = 16 × 1 000 000/(π × 40<sup>3</sup>) = <b>79,6 MPa</b>.</p>
<p>J = π × 40<sup>4</sup>/32 = 2,513 × 10<sup>5</sup> mm<sup>4</sup>; φ = 1 000 000 × 1200/(80 000 × 2,513 × 10<sup>5</sup>) = <b>0,0597 rad = 3,42°</b>.</p></div>
<div class="callout"><p><b>Ví dụ 2 — thiết kế trục động cơ.</b> Động cơ 15 kW quay 1450 vòng/phút. ω = 2π × 1450/60 = 151,8 rad/s ⇒ T = 15 000/151,8 = <b>98,8 N·m</b>.</p>
<p><b>Theo bền</b> với τ<sub>allow</sub> = 40 MPa: d = [16T/(π τ<sub>allow</sub>)]<sup>1/3</sup> = [16 × 98 800/(π × 40)]<sup>1/3</sup> = <b>23,3 mm</b> ⇒ chọn 25 mm.</p>
<p><b>Theo cứng</b>, với giới hạn thường dùng 0,25° trên mỗi mét và G = 80 GPa: d = [32T/(πGθ)]<sup>1/4</sup>, θ = 0,25°/m đổi ra rad/mm ⇒ d = <b>41,2 mm</b>. Điều kiện cứng quyết định — kết quả hay gặp với trục truyền dài và trục chính xác.</p></div>
<div class="callout"><p><b>Ví dụ 3 — trục rỗng.</b> Ống 50/40 mm chịu cùng 1 kN·m: J = 3,623 × 10<sup>5</sup> mm<sup>4</sup>, τ<sub>max</sub> = 1 000 000 × 25/3,623 × 10<sup>5</sup> = <b>69,0 MPa</b> — thấp hơn trục đặc 40 mm (79,6 MPa) mà chỉ dùng 56 % vật liệu. Trục các-đăng ô tô là ống vì lý do này.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng thẳng vòng/phút trong P = Tω.</li><li>Dùng I (πd<sup>4</sup>/64) thay cho J (πd<sup>4</sup>/32).</li><li>Quên kiểm góc xoắn khi trục dài.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>τ<sub>max</sub> = Tc/J = 16T/(πd<sup>3</sup>) với trục đặc.</li><li>φ = TL/(GJ), theo radian.</li><li>P = Tω với ω = 2πn/60.</li><li>Kiểm cả bền lẫn cứng; trục ống hiệu quả.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(DP + 'beam_bending/index.php', 'DoITPoMS — Uốn và xoắn dầm'),
    A(WK + 'Torsion_(mechanics)', 'Wikipedia — Xoắn (cơ học)'),
    A(OSP + '10-8-work-and-power-for-rotational-motion', 'OpenStax 10.8 — Công và công suất trong chuyển động quay'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm mômen xoắn truyền bởi trục 30 kW quay 3000 vòng/phút.</li><li>Trục đặc 25 mm chịu 98,8 N·m. Tìm τ<sub>max</sub>.</li><li>τ<sub>max</sub> thay đổi thế nào nếu tăng gấp đôi đường kính trục đặc?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) T = 30 000/(2π × 3000/60) = 95,5 N·m. 2) 16 × 98 800/(π × 25<sup>3</sup>) = 32,2 MPa. 3) Giảm 2<sup>3</sup> = 8 lần.</p></div>`);

const c62 = L('emm201c-ts-6-2',
  '6.2 — Shear-force and bending-moment diagrams|||6.2 — Biểu đồ lực cắt và mômen uốn',
  'Nội lực trong dầm (N, V, M), quy ước dấu; phương pháp mặt cắt viết V(x), M(x); quan hệ dV/dx = −w, dM/dx = V; ví dụ dầm 6 m chịu tải tập trung + tải đều; công thức Mmax chuẩn.',
  `<span class="eyebrow">EMM201c · Chapter 6 · Lesson 6.2</span>
<h2>Shear-force and bending-moment diagrams</h2>
<h3>🎯 Objectives</h3>
<ul><li>Find internal shear force V and bending moment M at any section of a beam.</li><li>Use the load–shear–moment relations to sketch V and M diagrams quickly.</li><li>Locate the maximum bending moment.</li></ul>
<h3>Internal forces in a beam</h3>
<p>Cut a beam at distance x and keep the left part. To be in equilibrium, the cut face must carry a <strong>normal force</strong> N, a <strong>shear force</strong> V and a <strong>bending moment</strong> M. Common sign convention (Hibbeler, Beer): <strong>positive V</strong> on the left part's cut face acts downward; <strong>positive M</strong> bends the beam concave-up ("sagging", tension at the bottom).</p>
<h3>Load–shear–moment relations</h3>
<div class="formula"><span class="lbl">Relations (w = downward load intensity)</span>dV/dx = −w(x) &nbsp;&nbsp; dM/dx = V(x)<br>A downward point load P makes V jump down by P; a clockwise couple M<sub>0</sub> makes M jump up by M<sub>0</sub>.<br>M is maximum (or minimum) where V = 0 or changes sign.</div>
<p>Consequences: under no load, V is constant and M is linear; under a uniform load, V is linear and M is a parabola. The change in M between two points equals the <strong>area of the V diagram</strong> between them.</p>
<h3>✍️ Worked example — the beam of lesson 2.3</h3>
<div class="callout"><p>Simply supported beam, L = 6 m, point load 10 kN at x = 2 m, uniform load 2 kN/m over the full span. Reactions (lesson 2.3): A<sub>y</sub> = 12.67 kN, B<sub>y</sub> = 9.33 kN.</p>
<p><b>Segment 0 ≤ x &lt; 2 m:</b> V = 12.67 − 2x; M = 12.67x − x<sup>2</sup>.</p>
<p><b>Segment 2 &lt; x ≤ 6 m:</b> V = 12.67 − 2x − 10 = 2.67 − 2x; M = 12.67x − x<sup>2</sup> − 10(x − 2).</p>
<table>
<tr><th>x (m)</th><th>V (kN)</th><th>M (kN·m)</th></tr>
<tr><td>0</td><td>+12.67</td><td>0</td></tr>
<tr><td>2⁻ / 2⁺</td><td>+8.67 / −1.33</td><td>21.33</td></tr>
<tr><td>4</td><td>−5.33</td><td>14.67</td></tr>
<tr><td>6</td><td>−9.33</td><td>0</td></tr>
</table>
<p>V changes sign at the point load ⇒ <b>M<sub>max</sub> = 12.67 × 2 − 2<sup>2</sup> = 21.33 kN·m at x = 2 m</b>. Check: V at the right end = −9.33 kN = −B<sub>y</sub> ✓; M returns to 0 at the roller ✓.</p>
<p>Sketch: V is a straight line falling from +12.67 to +8.67, jumps down 10 kN to −1.33, then falls linearly to −9.33. M is a parabola rising from 0 to a peak of 21.33 at x = 2 m, then a flatter parabola back to 0.</p></div>
<h3>Standard cases worth memorising</h3>
<table>
<tr><th>Beam and load</th><th>M<sub>max</sub></th><th>Where</th></tr>
<tr><td>Simply supported, central point load P</td><td>PL/4</td><td>mid-span</td></tr>
<tr><td>Simply supported, uniform load w</td><td>wL<sup>2</sup>/8</td><td>mid-span</td></tr>
<tr><td>Cantilever, end load P</td><td>PL</td><td>fixed end</td></tr>
<tr><td>Cantilever, uniform load w</td><td>wL<sup>2</sup>/2</td><td>fixed end</td></tr>
</table>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Replacing the distributed load by its resultant <em>before</em> cutting the beam.</li><li>Forgetting the jump in V at point loads and reactions.</li><li>Looking for M<sub>max</sub> only where V = 0 inside a segment, and missing a sign change at a point load.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Cut, keep one side, write V(x) and M(x) per segment.</li><li>dV/dx = −w, dM/dx = V; ΔM = area of the V diagram.</li><li>M<sub>max</sub> where V = 0 or changes sign.</li><li>Memorise PL/4, wL<sup>2</sup>/8, PL, wL<sup>2</sup>/2.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(ES + 'Chapter_08-internal-forces.html', 'Engineering Statics — Internal forces'),
    A(ES + 'VM_diagrams.html', 'Engineering Statics — Shear and bending moment diagrams'),
    A(ES + 'VM_relations.html', 'Engineering Statics — Relations between loading, shear and moment'),
    A(WK + 'Shear_and_moment_diagram', 'Wikipedia — Shear and moment diagram'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A 4 m simply supported beam carries 8 kN at mid-span. Find M<sub>max</sub>.</li><li>The same beam carries 5 kN/m over its length instead. Find M<sub>max</sub>.</li><li>A 2 m cantilever carries 3 kN at its tip. Find V and M at the fixed end.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) PL/4 = 8 kN·m. 2) wL<sup>2</sup>/8 = 5 × 16/8 = 10 kN·m. 3) V = 3 kN, M = −6 kN·m (hogging).</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 6 · Bài 6.2</span>
<h2>Biểu đồ lực cắt và mômen uốn</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tìm lực cắt V và mômen uốn M tại mặt cắt bất kỳ của dầm.</li><li>Dùng quan hệ tải – lực cắt – mômen để vẽ nhanh biểu đồ V, M.</li><li>Xác định mômen uốn lớn nhất.</li></ul>
<h3>Nội lực trong dầm</h3>
<p>Cắt dầm tại khoảng cách x và giữ phần trái. Để cân bằng, mặt cắt phải có <strong>lực dọc</strong> N, <strong>lực cắt</strong> V và <strong>mômen uốn</strong> M. Quy ước dấu thường dùng (Hibbeler, Beer): <strong>V dương</strong> trên mặt cắt của phần trái hướng xuống; <strong>M dương</strong> làm dầm cong lõm lên ("võng", thớ dưới chịu kéo).</p>
<h3>Quan hệ tải – lực cắt – mômen</h3>
<div class="formula"><span class="lbl">Quan hệ vi phân (w = cường độ tải hướng xuống)</span>dV/dx = −w(x) &nbsp;&nbsp; dM/dx = V(x)<br>Lực tập trung P hướng xuống làm V nhảy xuống P; ngẫu M<sub>0</sub> cùng chiều kim đồng hồ làm M nhảy lên M<sub>0</sub>.<br>M đạt cực trị tại chỗ V = 0 hoặc đổi dấu.</div>
<p>Hệ quả: đoạn không tải, V hằng số và M bậc nhất; đoạn tải đều, V bậc nhất và M là parabol. Độ thay đổi M giữa hai điểm bằng <strong>diện tích biểu đồ V</strong> giữa chúng.</p>
<h3>✍️ Ví dụ giải — dầm của bài 2.3</h3>
<div class="callout"><p>Dầm tựa đơn giản L = 6 m, lực tập trung 10 kN tại x = 2 m, tải đều 2 kN/m toàn nhịp. Phản lực (bài 2.3): A<sub>y</sub> = 12,67 kN, B<sub>y</sub> = 9,33 kN.</p>
<p><b>Đoạn 0 ≤ x &lt; 2 m:</b> V = 12,67 − 2x; M = 12,67x − x<sup>2</sup>.</p>
<p><b>Đoạn 2 &lt; x ≤ 6 m:</b> V = 12,67 − 2x − 10 = 2,67 − 2x; M = 12,67x − x<sup>2</sup> − 10(x − 2).</p>
<table>
<tr><th>x (m)</th><th>V (kN)</th><th>M (kN·m)</th></tr>
<tr><td>0</td><td>+12,67</td><td>0</td></tr>
<tr><td>2⁻ / 2⁺</td><td>+8,67 / −1,33</td><td>21,33</td></tr>
<tr><td>4</td><td>−5,33</td><td>14,67</td></tr>
<tr><td>6</td><td>−9,33</td><td>0</td></tr>
</table>
<p>V đổi dấu tại lực tập trung ⇒ <b>M<sub>max</sub> = 12,67 × 2 − 2<sup>2</sup> = 21,33 kN·m tại x = 2 m</b>. Kiểm: V ở đầu phải = −9,33 kN = −B<sub>y</sub> ✓; M về 0 tại con lăn ✓.</p>
<p>Phác hình: V là đường thẳng giảm từ +12,67 xuống +8,67, nhảy xuống 10 kN thành −1,33, rồi giảm tuyến tính đến −9,33. M là parabol tăng từ 0 lên đỉnh 21,33 tại x = 2 m, rồi một parabol thoải hơn về 0.</p></div>
<h3>Các trường hợp chuẩn nên thuộc</h3>
<table>
<tr><th>Dầm và tải</th><th>M<sub>max</sub></th><th>Vị trí</th></tr>
<tr><td>Tựa đơn giản, lực P ở giữa</td><td>PL/4</td><td>giữa nhịp</td></tr>
<tr><td>Tựa đơn giản, tải đều w</td><td>wL<sup>2</sup>/8</td><td>giữa nhịp</td></tr>
<tr><td>Công-xôn, lực P ở đầu</td><td>PL</td><td>đầu ngàm</td></tr>
<tr><td>Công-xôn, tải đều w</td><td>wL<sup>2</sup>/2</td><td>đầu ngàm</td></tr>
</table>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Thay tải phân bố bằng hợp lực <em>trước khi</em> cắt dầm.</li><li>Quên bước nhảy của V tại lực tập trung và phản lực.</li><li>Chỉ tìm M<sub>max</sub> ở chỗ V = 0 trong một đoạn mà bỏ sót chỗ đổi dấu tại lực tập trung.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cắt, giữ một bên, viết V(x), M(x) cho từng đoạn.</li><li>dV/dx = −w, dM/dx = V; ΔM = diện tích biểu đồ V.</li><li>M<sub>max</sub> ở chỗ V = 0 hoặc đổi dấu.</li><li>Thuộc PL/4, wL<sup>2</sup>/8, PL, wL<sup>2</sup>/2.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(ES + 'Chapter_08-internal-forces.html', 'Engineering Statics — Nội lực'),
    A(ES + 'VM_diagrams.html', 'Engineering Statics — Biểu đồ lực cắt và mômen uốn'),
    A(ES + 'VM_relations.html', 'Engineering Statics — Quan hệ tải, lực cắt và mômen'),
    A(WK + 'Shear_and_moment_diagram', 'Wikipedia — Biểu đồ lực cắt và mômen'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Dầm tựa đơn giản 4 m chịu 8 kN ở giữa. Tìm M<sub>max</sub>.</li><li>Cùng dầm đó chịu tải đều 5 kN/m. Tìm M<sub>max</sub>.</li><li>Dầm công-xôn 2 m chịu 3 kN ở đầu tự do. Tìm V và M tại ngàm.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) PL/4 = 8 kN·m. 2) wL<sup>2</sup>/8 = 5 × 16/8 = 10 kN·m. 3) V = 3 kN, M = −6 kN·m (vồng, thớ trên chịu kéo).</p></div>`);

const c63 = L('emm201c-ts-6-3',
  '6.3 — Bending stress and transverse shear in beams|||6.3 — Ứng suất uốn và ứng suất cắt ngang trong dầm',
  'Công thức uốn σ = My/I, trục trung hoà, môđun chống uốn S = I/c; dầm chữ nhật, tròn, chữ T; ứng suất cắt ngang τ = VQ/(It), τmax = 1,5V/A; chọn tiết diện.',
  `<span class="eyebrow">EMM201c · Chapter 6 · Lesson 6.3</span>
<h2>Bending stress and transverse shear in beams</h2>
<h3>🎯 Objectives</h3>
<ul><li>Apply the flexure formula σ = My/I and the section modulus S = I/c.</li><li>Find maximum tension and compression in an unsymmetric (T) section.</li><li>Estimate transverse shear stress with τ = VQ/(It).</li></ul>
<h3>The flexure formula</h3>
<p>For an elastic beam in pure bending, plane sections remain plane: fibres on one side of the <strong>neutral axis</strong> (which passes through the section centroid) stretch, those on the other side shorten, and the strain varies linearly with the distance y from that axis. With Hooke's law, so does the stress:</p>
<div class="formula"><span class="lbl">Flexure formula</span>σ = −M·y / I &nbsp;&nbsp; |σ|<sub>max</sub> = M·c / I = M / S<br>Section modulus: S = I/c; rectangle S = bh<sup>2</sup>/6; solid circle S = πd<sup>3</sup>/32</div>
<p>(The minus sign: for positive, sagging M, fibres above the neutral axis, y &gt; 0, are in compression.)</p>
<h3>✍️ Example 1 — rectangular beam</h3>
<div class="callout"><p>The beam of lesson 6.2 (M<sub>max</sub> = 21.33 kN·m) is a 100 mm wide × 200 mm deep timber or steel section, placed on edge.</p>
<p>S = 100 × 200<sup>2</sup>/6 = 666 667 mm<sup>3</sup> ⇒ σ<sub>max</sub> = 21.33 × 10<sup>6</sup>/666 667 = <b>32.0 MPa</b> (compression at the top, tension at the bottom).</p></div>
<h3>✍️ Example 2 — T-section (unsymmetric)</h3>
<div class="callout"><p>The T-section of lessons 4.3–4.4 (I = 5.674 × 10<sup>6</sup> mm<sup>4</sup>, centroid 82.7 mm above the bottom, 37.3 mm below the top) carries a sagging moment M = 5 kN·m.</p>
<p>Top (flange): σ = 5 × 10<sup>6</sup> × 37.27/5.674 × 10<sup>6</sup> = <b>32.8 MPa compression</b>.</p>
<p>Bottom (web tip): σ = 5 × 10<sup>6</sup> × 82.73/5.674 × 10<sup>6</sup> = <b>72.9 MPa tension</b>.</p>
<p>The fibre farthest from the neutral axis governs. For a brittle material such as cast iron (weak in tension), the T should be turned so that the wide flange is on the tension side.</p></div>
<h3>Transverse shear stress</h3>
<p>When M varies along the beam there is also a shear force V, which produces shear stress on the cross-section, zero at the top and bottom and largest at the neutral axis:</p>
<div class="formula"><span class="lbl">Shear formula</span>τ = V·Q / (I·t) &nbsp;(Q = first moment, about the neutral axis, of the area beyond the point; t = width at the point)<br>Rectangle: τ<sub>max</sub> = 1.5·V/A &nbsp;&nbsp; solid circle: τ<sub>max</sub> = (4/3)·V/A</div>
<div class="callout"><p><b>Example 3.</b> For the 100 × 200 mm beam with V<sub>max</sub> = 12.67 kN: τ<sub>max</sub> = 1.5 × 12 670/(100 × 200) = <b>0.95 MPa</b> — tiny compared with the 32 MPa bending stress. Shear usually matters only in short, deep beams, thin webs, timber, and in the welds and bolts that connect built-up beams.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Measuring y from the bottom of the section instead of from the neutral axis.</li><li>Using bh<sup>2</sup>/6 for a T or I section (it is only for rectangles).</li><li>Mixing kN·m with mm: convert M to N·mm.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>σ = My/I; the neutral axis passes through the centroid.</li><li>σ<sub>max</sub> = M/S; rectangle S = bh<sup>2</sup>/6, circle S = πd<sup>3</sup>/32.</li><li>Unsymmetric sections: check both extreme fibres.</li><li>τ = VQ/(It); rectangle τ<sub>max</sub> = 1.5V/A.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(DP + 'beam_bending/index.php', 'DoITPoMS — Bending and torsion of beams'),
    A(WK + 'Euler%E2%80%93Bernoulli_beam_theory', 'Wikipedia — Euler–Bernoulli beam theory'),
    A(WK + 'Bending', 'Wikipedia — Bending'),
    A(OCW_MOM, 'MIT OCW 2.001 — Mechanics &amp; Materials I (bending lectures)'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A 50 × 100 mm rectangular bar (on edge) carries M = 2 kN·m. Find σ<sub>max</sub>.</li><li>A 40 mm solid shaft carries a bending moment of 300 N·m. Find σ<sub>max</sub>.</li><li>Laying the 100 × 200 mm beam flat, what becomes σ<sub>max</sub> under 21.33 kN·m?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) S = 83 333 mm<sup>3</sup> ⇒ 24.0 MPa. 2) σ = 32M/(πd<sup>3</sup>) = 47.7 MPa. 3) S = 200 × 100<sup>2</sup>/6 = 333 333 mm<sup>3</sup> ⇒ 64.0 MPa (twice as high).</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 6 · Bài 6.3</span>
<h2>Ứng suất uốn và ứng suất cắt ngang trong dầm</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng công thức uốn σ = My/I và môđun chống uốn S = I/c.</li><li>Tìm ứng suất kéo và nén lớn nhất trong mặt cắt không đối xứng (chữ T).</li><li>Ước lượng ứng suất cắt ngang bằng τ = VQ/(It).</li></ul>
<h3>Công thức uốn</h3>
<p>Với dầm đàn hồi uốn thuần tuý, mặt cắt phẳng vẫn phẳng: thớ một bên <strong>trục trung hoà</strong> (đi qua trọng tâm mặt cắt) bị dãn, thớ bên kia bị co, và biến dạng thay đổi tuyến tính theo khoảng cách y tới trục đó. Theo định luật Hooke, ứng suất cũng vậy:</p>
<div class="formula"><span class="lbl">Công thức uốn</span>σ = −M·y / I &nbsp;&nbsp; |σ|<sub>max</sub> = M·c / I = M / S<br>Môđun chống uốn: S = I/c; chữ nhật S = bh<sup>2</sup>/6; tròn đặc S = πd<sup>3</sup>/32</div>
<p>(Dấu trừ: với M dương (võng), thớ phía trên trục trung hoà, y &gt; 0, chịu nén.)</p>
<h3>✍️ Ví dụ 1 — dầm chữ nhật</h3>
<div class="callout"><p>Dầm của bài 6.2 (M<sub>max</sub> = 21,33 kN·m) có tiết diện rộng 100 mm × cao 200 mm, đặt đứng.</p>
<p>S = 100 × 200<sup>2</sup>/6 = 666 667 mm<sup>3</sup> ⇒ σ<sub>max</sub> = 21,33 × 10<sup>6</sup>/666 667 = <b>32,0 MPa</b> (nén ở thớ trên, kéo ở thớ dưới).</p></div>
<h3>✍️ Ví dụ 2 — tiết diện chữ T (không đối xứng)</h3>
<div class="callout"><p>Tiết diện chữ T của bài 4.3–4.4 (I = 5,674 × 10<sup>6</sup> mm<sup>4</sup>, trọng tâm cách đáy 82,7 mm, cách mép trên 37,3 mm) chịu mômen võng M = 5 kN·m.</p>
<p>Thớ trên (cánh): σ = 5 × 10<sup>6</sup> × 37,27/5,674 × 10<sup>6</sup> = <b>32,8 MPa nén</b>.</p>
<p>Thớ dưới (đầu bụng): σ = 5 × 10<sup>6</sup> × 82,73/5,674 × 10<sup>6</sup> = <b>72,9 MPa kéo</b>.</p>
<p>Thớ xa trục trung hoà nhất quyết định. Với vật liệu giòn như gang (chịu kéo kém), nên xoay chữ T để cánh rộng nằm ở phía chịu kéo.</p></div>
<h3>Ứng suất cắt ngang</h3>
<p>Khi M thay đổi dọc dầm thì còn có lực cắt V, gây ứng suất cắt trên mặt cắt, bằng 0 ở thớ trên và dưới, lớn nhất tại trục trung hoà:</p>
<div class="formula"><span class="lbl">Công thức Zhuravskii</span>τ = V·Q / (I·t) &nbsp;(Q = mômen tĩnh, đối với trục trung hoà, của phần diện tích phía ngoài điểm xét; t = bề rộng tại điểm đó)<br>Chữ nhật: τ<sub>max</sub> = 1,5·V/A &nbsp;&nbsp; tròn đặc: τ<sub>max</sub> = (4/3)·V/A</div>
<div class="callout"><p><b>Ví dụ 3.</b> Với dầm 100 × 200 mm, V<sub>max</sub> = 12,67 kN: τ<sub>max</sub> = 1,5 × 12 670/(100 × 200) = <b>0,95 MPa</b> — rất nhỏ so với ứng suất uốn 32 MPa. Cắt thường chỉ quan trọng với dầm ngắn và cao, bụng mỏng, gỗ, và với mối hàn, bulông liên kết dầm ghép.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Đo y từ đáy mặt cắt thay vì từ trục trung hoà.</li><li>Dùng bh<sup>2</sup>/6 cho tiết diện chữ T hay chữ I (chỉ đúng cho chữ nhật).</li><li>Trộn kN·m với mm: đổi M sang N·mm.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>σ = My/I; trục trung hoà qua trọng tâm.</li><li>σ<sub>max</sub> = M/S; chữ nhật S = bh<sup>2</sup>/6, tròn S = πd<sup>3</sup>/32.</li><li>Tiết diện không đối xứng: kiểm cả hai thớ biên.</li><li>τ = VQ/(It); chữ nhật τ<sub>max</sub> = 1,5V/A.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(DP + 'beam_bending/index.php', 'DoITPoMS — Uốn và xoắn dầm'),
    A(WK + 'Euler%E2%80%93Bernoulli_beam_theory', 'Wikipedia — Lý thuyết dầm Euler–Bernoulli'),
    A(WK + 'Bending', 'Wikipedia — Uốn'),
    A(OCW_MOM, 'MIT OCW 2.001 — Mechanics &amp; Materials I (bài giảng về uốn)'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Thanh chữ nhật 50 × 100 mm (đặt đứng) chịu M = 2 kN·m. Tìm σ<sub>max</sub>.</li><li>Trục đặc 40 mm chịu mômen uốn 300 N·m. Tìm σ<sub>max</sub>.</li><li>Đặt nằm dầm 100 × 200 mm, σ<sub>max</sub> dưới 21,33 kN·m thành bao nhiêu?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) S = 83 333 mm<sup>3</sup> ⇒ 24,0 MPa. 2) σ = 32M/(πd<sup>3</sup>) = 47,7 MPa. 3) S = 200 × 100<sup>2</sup>/6 = 333 333 mm<sup>3</sup> ⇒ 64,0 MPa (gấp đôi).</p></div>`);

const c64 = L('emm201c-ts-6-4',
  '6.4 — Beam deflection and column buckling|||6.4 — Độ võng dầm và ổn định cột (mất ổn định)',
  'Phương trình đường đàn hồi EI·v″ = M; công thức độ võng chuẩn; giới hạn L/360; tải tới hạn Euler Pcr = π²EI/(KL)², hệ số chiều dài K, độ mảnh.',
  `<span class="eyebrow">EMM201c · Chapter 6 · Lesson 6.4</span>
<h2>Beam deflection and column buckling</h2>
<h3>🎯 Objectives</h3>
<ul><li>Use standard deflection formulas and check a deflection limit.</li><li>Compute Euler's critical buckling load for different end conditions.</li><li>Recognise when stiffness, not strength, governs design.</li></ul>
<h3>The elastic curve</h3>
<p>The deflected shape v(x) of an elastic beam satisfies <strong>E·I·d<sup>2</sup>v/dx<sup>2</sup> = M(x)</strong>. Integrating twice with the support conditions gives the deflection; for everyday cases the results are tabulated (Beer &amp; Johnston appendix, Shigley Table A-9):</p>
<table>
<tr><th>Case</th><th>Maximum deflection</th></tr>
<tr><td>Cantilever, end load P</td><td>P L<sup>3</sup>/(3EI) at the free end</td></tr>
<tr><td>Cantilever, uniform load w</td><td>w L<sup>4</sup>/(8EI)</td></tr>
<tr><td>Simply supported, central load P</td><td>P L<sup>3</sup>/(48EI) at mid-span</td></tr>
<tr><td>Simply supported, uniform load w</td><td>5 w L<sup>4</sup>/(384EI) at mid-span</td></tr>
</table>
<p>The product <strong>EI</strong> is the <strong>flexural rigidity</strong>. Deflection grows with L<sup>3</sup> or L<sup>4</sup> — halving the span cuts deflection 8–16 times. Typical limits: L/360 for floors, much tighter for machine-tool beds, robot links and gear shafts (where deflection misaligns gears and bearings).</p>
<h3>✍️ Example 1 — deflection check</h3>
<div class="callout"><p>A simply supported steel beam (E = 200 GPa), L = 4 m, 100 × 200 mm section (I = 6.667 × 10<sup>7</sup> mm<sup>4</sup>), carries w = 5 kN/m.</p>
<p>δ = 5 × 5 × 4000<sup>4</sup>/(384 × 200 000 × 6.667 × 10<sup>7</sup>) = <b>1.25 mm</b> (w = 5 N/mm). Limit L/360 = 11.1 mm ✓.</p></div>
<div class="callout"><p><b>Example 2 — robot-arm link.</b> A steel bar 20 mm wide × 40 mm deep, 0.5 m long, clamped at one end, carries 500 N at the tip. I = 20 × 40<sup>3</sup>/12 = 1.067 × 10<sup>5</sup> mm<sup>4</sup> ⇒ δ = 500 × 500<sup>3</sup>/(3 × 200 000 × 1.067 × 10<sup>5</sup>) = <b>0.98 mm</b>. For a positioning robot that is a large tip error — stiffness drives link design.</p></div>
<h3>Buckling of columns</h3>
<p>A slender member in compression can fail by suddenly bowing sideways at a load far below the one that would crush it. For an ideal elastic column:</p>
<div class="formula"><span class="lbl">Euler critical load</span>P<sub>cr</sub> = π<sup>2</sup>·E·I / (K·L)<sup>2</sup> &nbsp;&nbsp; σ<sub>cr</sub> = π<sup>2</sup>E / (KL/r)<sup>2</sup>, r = √(I/A)<br>K = 1 pinned–pinned · 2 fixed–free · 0.7 fixed–pinned · 0.5 fixed–fixed</div>
<p>Use the <strong>smallest</strong> I of the section (it buckles about its weakest axis). Euler is valid for slender columns; for short or intermediate columns (KL/r below roughly 100–120 for steel) use the Johnson parabola or a design code. Apply a factor of safety (often 2–3) on P<sub>cr</sub>.</p>
<div class="callout"><p><b>Example 3.</b> A pinned–pinned steel rod, d = 30 mm, L = 1.5 m: I = π × 30<sup>4</sup>/64 = 39 761 mm<sup>4</sup> ⇒ P<sub>cr</sub> = π<sup>2</sup> × 200 000 × 39 761/1500<sup>2</sup> = <b>34.9 kN</b>. Slenderness KL/r = 1500/7.5 = 200 ⇒ Euler valid; σ<sub>cr</sub> = 49.3 MPa — far below the yield strength. The same rod fixed at one end and free at the other (K = 2) buckles at only <b>8.7 kN</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the strong-axis I for buckling.</li><li>Forgetting the effective-length factor K.</li><li>Applying Euler to short, stocky columns (they yield first).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>EI v″ = M; use tabulated formulas for standard cases.</li><li>Deflection ∝ L<sup>3</sup> or L<sup>4</sup>, ∝ 1/(EI).</li><li>P<sub>cr</sub> = π<sup>2</sup>EI/(KL)<sup>2</sup>, weakest axis, slender columns only.</li><li>Compression members: check buckling, not just σ = P/A.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(WK + 'Deflection_(engineering)', 'Wikipedia — Deflection (engineering) — formula tables'),
    A(WK + 'Euler%27s_critical_load', 'Wikipedia — Euler\'s critical load'),
    A(WK + 'Buckling', 'Wikipedia — Buckling'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A simply supported beam (L = 3 m, I = 6.667 × 10<sup>7</sup> mm<sup>4</sup>, E = 200 GPa) carries 10 kN at mid-span. Find δ.</li><li>If a cantilever's length doubles, by what factor does its tip deflection under end load grow?</li><li>Change the rod of Example 3 to fixed–fixed (K = 0.5). Find P<sub>cr</sub>.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 10 000 × 3000<sup>3</sup>/(48 × 200 000 × 6.667 × 10<sup>7</sup>) = 0.42 mm. 2) 2<sup>3</sup> = 8. 3) 4 × 34.9 = 139.5 kN (note: the stress would then be 139 500/707 = 197 MPa and KL/r = 100, close to the limit of Euler's formula — use a design-code formula and check yielding).</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 6 · Bài 6.4</span>
<h2>Độ võng dầm và ổn định cột</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng công thức độ võng chuẩn và kiểm giới hạn độ võng.</li><li>Tính lực tới hạn Euler cho các điều kiện liên kết khác nhau.</li><li>Nhận ra khi nào điều kiện cứng, chứ không phải điều kiện bền, quyết định thiết kế.</li></ul>
<h3>Đường đàn hồi</h3>
<p>Đường võng v(x) của dầm đàn hồi thoả <strong>E·I·d<sup>2</sup>v/dx<sup>2</sup> = M(x)</strong>. Tích phân hai lần với điều kiện biên cho độ võng; các trường hợp hay gặp đã được lập bảng (phụ lục Beer &amp; Johnston, bảng A-9 của Shigley):</p>
<table>
<tr><th>Trường hợp</th><th>Độ võng lớn nhất</th></tr>
<tr><td>Công-xôn, lực P ở đầu</td><td>P L<sup>3</sup>/(3EI) tại đầu tự do</td></tr>
<tr><td>Công-xôn, tải đều w</td><td>w L<sup>4</sup>/(8EI)</td></tr>
<tr><td>Tựa đơn giản, lực P ở giữa</td><td>P L<sup>3</sup>/(48EI) tại giữa nhịp</td></tr>
<tr><td>Tựa đơn giản, tải đều w</td><td>5 w L<sup>4</sup>/(384EI) tại giữa nhịp</td></tr>
</table>
<p>Tích <strong>EI</strong> là <strong>độ cứng chống uốn</strong>. Độ võng tăng theo L<sup>3</sup> hoặc L<sup>4</sup> — giảm nhịp một nửa thì độ võng giảm 8–16 lần. Giới hạn điển hình: L/360 với sàn, chặt hơn nhiều với băng máy công cụ, khâu robot và trục bánh răng (độ võng làm lệch ăn khớp và ổ).</p>
<h3>✍️ Ví dụ 1 — kiểm độ võng</h3>
<div class="callout"><p>Dầm thép tựa đơn giản (E = 200 GPa), L = 4 m, tiết diện 100 × 200 mm (I = 6,667 × 10<sup>7</sup> mm<sup>4</sup>), chịu w = 5 kN/m.</p>
<p>δ = 5 × 5 × 4000<sup>4</sup>/(384 × 200 000 × 6,667 × 10<sup>7</sup>) = <b>1,25 mm</b> (w = 5 N/mm). Giới hạn L/360 = 11,1 mm ✓.</p></div>
<div class="callout"><p><b>Ví dụ 2 — khâu tay robot.</b> Thanh thép rộng 20 mm × cao 40 mm, dài 0,5 m, ngàm một đầu, chịu 500 N ở đầu tự do. I = 20 × 40<sup>3</sup>/12 = 1,067 × 10<sup>5</sup> mm<sup>4</sup> ⇒ δ = 500 × 500<sup>3</sup>/(3 × 200 000 × 1,067 × 10<sup>5</sup>) = <b>0,98 mm</b>. Với robot định vị đó là sai số đầu tay lớn — độ cứng quyết định thiết kế khâu.</p></div>
<h3>Mất ổn định của cột</h3>
<p>Thanh mảnh chịu nén có thể hỏng do đột ngột cong ngang ở tải thấp hơn nhiều so với tải làm nó bị ép vỡ. Với cột đàn hồi lý tưởng:</p>
<div class="formula"><span class="lbl">Lực tới hạn Euler</span>P<sub>cr</sub> = π<sup>2</sup>·E·I / (K·L)<sup>2</sup> &nbsp;&nbsp; σ<sub>cr</sub> = π<sup>2</sup>E / (KL/r)<sup>2</sup>, r = √(I/A)<br>K = 1 khớp–khớp · 2 ngàm–tự do · 0,7 ngàm–khớp · 0,5 ngàm–ngàm</div>
<p>Dùng I <strong>nhỏ nhất</strong> của mặt cắt (cột oằn theo trục yếu nhất). Euler đúng cho cột mảnh; với cột ngắn hoặc trung bình (KL/r dưới khoảng 100–120 với thép) dùng công thức parabol Johnson hoặc tiêu chuẩn thiết kế. Áp hệ số an toàn (thường 2–3) lên P<sub>cr</sub>.</p>
<div class="callout"><p><b>Ví dụ 3.</b> Thanh thép khớp–khớp, d = 30 mm, L = 1,5 m: I = π × 30<sup>4</sup>/64 = 39 761 mm<sup>4</sup> ⇒ P<sub>cr</sub> = π<sup>2</sup> × 200 000 × 39 761/1500<sup>2</sup> = <b>34,9 kN</b>. Độ mảnh KL/r = 1500/7,5 = 200 ⇒ Euler áp dụng được; σ<sub>cr</sub> = 49,3 MPa — thấp hơn nhiều giới hạn chảy. Cùng thanh đó ngàm một đầu, tự do một đầu (K = 2) chỉ chịu được <b>8,7 kN</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng I theo trục khoẻ khi tính ổn định.</li><li>Quên hệ số chiều dài tính toán K.</li><li>Áp Euler cho cột ngắn, mập (chúng chảy trước).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>EI v″ = M; dùng công thức lập bảng cho trường hợp chuẩn.</li><li>Độ võng ∝ L<sup>3</sup> hoặc L<sup>4</sup>, ∝ 1/(EI).</li><li>P<sub>cr</sub> = π<sup>2</sup>EI/(KL)<sup>2</sup>, trục yếu nhất, chỉ cho cột mảnh.</li><li>Thanh chịu nén: kiểm ổn định, không chỉ σ = P/A.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(WK + 'Deflection_(engineering)', 'Wikipedia — Độ võng (bảng công thức)'),
    A(WK + 'Euler%27s_critical_load', 'Wikipedia — Lực tới hạn Euler'),
    A(WK + 'Buckling', 'Wikipedia — Mất ổn định (oằn)'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Dầm tựa đơn giản (L = 3 m, I = 6,667 × 10<sup>7</sup> mm<sup>4</sup>, E = 200 GPa) chịu 10 kN ở giữa nhịp. Tìm δ.</li><li>Nếu chiều dài công-xôn tăng gấp đôi, độ võng đầu dưới lực ở đầu tăng bao nhiêu lần?</li><li>Đổi thanh ở Ví dụ 3 thành ngàm–ngàm (K = 0,5). Tìm P<sub>cr</sub>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 10 000 × 3000<sup>3</sup>/(48 × 200 000 × 6,667 × 10<sup>7</sup>) = 0,42 mm. 2) 2<sup>3</sup> = 8. 3) 4 × 34,9 = 139,5 kN (lưu ý: ứng suất khi đó 139 500/707 = 197 MPa; KL/r = 100, gần giới hạn dùng Euler — nên dùng công thức của tiêu chuẩn và kiểm chảy).</p></div>`);

const q6 = QZ(6, 'Quiz — Chapter 6: Torsion, bending, deflection and buckling|||Quiz — Chương 6: Xoắn, uốn, độ võng và ổn định', 'Kiểm tra chương 6: xoắn trục, P = Tω, biểu đồ V–M, công thức uốn, môđun chống uốn, ứng suất cắt ngang, độ võng, lực tới hạn Euler.', [
  Q('q1', 'The maximum shear stress in a solid shaft under torque T is|||Ứng suất cắt lớn nhất trong trục đặc chịu mômen xoắn T là',
    ['32T/(πd³)|||32T/(πd³)', '16T/(πd³)|||16T/(πd³)', 'T/(πd²)|||T/(πd²)', '4T/(πd²)|||4T/(πd²)'], 1,
    'τ = Tc/J with J = πd⁴/32, c = d/2.|||τ = Tc/J với J = πd⁴/32, c = d/2.'),
  Q('q2', 'A motor gives 10 kW at 955 rpm (ω ≈ 100 rad/s). The torque is about|||Động cơ 10 kW quay 955 vòng/phút (ω ≈ 100 rad/s). Mômen xoắn xấp xỉ',
    ['10 N·m|||10 N·m', '100 N·m|||100 N·m', '1000 N·m|||1000 N·m', '10.5 N·m|||10,5 N·m'], 1,
    'T = P/ω = 10 000/100.|||T = P/ω = 10 000/100.'),
  Q('q3', 'The angle of twist of a shaft is|||Góc xoắn của trục là',
    ['TL/(EI)|||TL/(EI)', 'TL/(GJ)|||TL/(GJ)', 'T/(GJ)|||T/(GJ)', 'TG/(LJ)|||TG/(LJ)'], 1,
    'φ = TL/(GJ) in radians.|||φ = TL/(GJ) theo radian.'),
  Q('q4', 'Along a beam, dM/dx equals|||Dọc dầm, dM/dx bằng',
    ['the load w|||tải w', 'the shear force V|||lực cắt V', 'zero|||không', 'EI|||EI'], 1,
    'Slope of the moment diagram = shear.|||Độ dốc biểu đồ mômen = lực cắt.'),
  Q('q5', 'M_max of a simply supported beam under uniform load w over span L is|||M_max của dầm tựa đơn giản chịu tải đều w trên nhịp L là',
    ['wL²/2|||wL²/2', 'wL²/8|||wL²/8', 'wL/4|||wL/4', 'wL²/12|||wL²/12'], 1,
    'Standard result at mid-span.|||Kết quả chuẩn tại giữa nhịp.'),
  Q('q6', 'The section modulus of a rectangle b × h (bending about the axis parallel to b) is|||Môđun chống uốn của chữ nhật b × h (uốn quanh trục song song b) là',
    ['bh²/6|||bh²/6', 'bh³/12|||bh³/12', 'bh/2|||bh/2', 'b²h/6|||b²h/6'], 0,
    'S = I/c = (bh³/12)/(h/2).|||S = I/c = (bh³/12)/(h/2).'),
  Q('q7', 'In bending, the neutral axis passes through|||Khi uốn, trục trung hoà đi qua',
    ['the top fibre|||thớ trên', 'the centroid of the section|||trọng tâm mặt cắt', 'the shear centre always|||luôn qua tâm cắt', 'the bottom fibre|||thớ dưới'], 1,
    'For elastic bending with no axial force.|||Với uốn đàn hồi không có lực dọc.'),
  Q('q8', 'For a rectangular section, the maximum transverse shear stress is|||Với mặt cắt chữ nhật, ứng suất cắt ngang lớn nhất là',
    ['V/A|||V/A', '1.5 V/A|||1,5 V/A', '2 V/A|||2 V/A', '4V/(3A)|||4V/(3A)'], 1,
    'At the neutral axis.|||Tại trục trung hoà.'),
  Q('q9', 'Doubling the span of a simply supported beam under uniform load multiplies δ_max by|||Tăng gấp đôi nhịp dầm tựa đơn giản chịu tải đều thì δ_max nhân với',
    ['2|||2', '4|||4', '8|||8', '16|||16'], 3,
    'δ = 5wL⁴/(384EI).|||δ = 5wL⁴/(384EI).'),
  Q('q10', 'Compared with pinned–pinned, a fixed–free column of the same length has a buckling load|||So với khớp–khớp, cột ngàm–tự do cùng chiều dài có lực tới hạn',
    ['4 times larger|||lớn gấp 4', '4 times smaller|||nhỏ hơn 4 lần', '2 times smaller|||nhỏ hơn 2 lần', 'the same|||bằng nhau'], 1,
    'K = 2 ⇒ (KL)² is 4 times larger.|||K = 2 ⇒ (KL)² lớn gấp 4.'),
]);

const ch6 = {
  title: 'Chapter 6 — Torsion, bending, deflection and buckling|||Chương 6 — Xoắn, uốn, độ võng và ổn định',
  description: 'Xoắn trục tròn và truyền công suất, biểu đồ lực cắt – mômen, ứng suất uốn và cắt ngang, độ võng dầm, lực tới hạn Euler (Beer & Johnston ch.3–6, 9–10).',
  lessons: [c61, c62, c63, c64, q6],
};

// ───────────────────────────── Chương 7 ─────────────────────────────
const c71 = L('emm201c-ts-7-1',
  '7.1 — Combined loading, plane stress and Mohr\'s circle|||7.1 — Tải tổ hợp, trạng thái ứng suất phẳng và vòng tròn Mohr',
  'Chồng chất ứng suất từ kéo, uốn, xoắn; phần tử ứng suất phẳng; ứng suất chính σ1, σ2, góc chính; ứng suất cắt lớn nhất; vòng tròn Mohr; ví dụ số.',
  `<span class="eyebrow">EMM201c · Chapter 7 · Lesson 7.1</span>
<h2>Combined loading, plane stress and Mohr's circle</h2>
<h3>🎯 Objectives</h3>
<ul><li>Superpose stresses from axial load, bending and torsion at a critical point.</li><li>Find principal stresses and the maximum in-plane shear stress.</li><li>Construct and read Mohr's circle.</li></ul>
<h3>Combined loading</h3>
<p>Real parts carry several loads at once: a shaft is bent by gear forces <em>and</em> twisted by torque; a crank arm is bent and twisted; a bolted bracket is pulled and bent. In the elastic range we compute each stress separately and <strong>add them at the same point</strong> (superposition). Typical critical point on a shaft surface: σ<sub>x</sub> = 32M/(πd<sup>3</sup>) from bending (plus P/A if axial), τ<sub>xy</sub> = 16T/(πd<sup>3</sup>) from torsion.</p>
<h3>Stress transformation</h3>
<p>On a small square element the state of <strong>plane stress</strong> is (σ<sub>x</sub>, σ<sub>y</sub>, τ<sub>xy</sub>). On planes rotated by θ the stresses change; two planes, 90° apart, carry no shear — the <strong>principal planes</strong> — and the normal stresses on them are the extreme values:</p>
<div class="formula"><span class="lbl">Principal stresses</span>σ<sub>avg</sub> = (σ<sub>x</sub> + σ<sub>y</sub>)/2, &nbsp; R = √[((σ<sub>x</sub> − σ<sub>y</sub>)/2)<sup>2</sup> + τ<sub>xy</sub><sup>2</sup>]<br>σ<sub>1,2</sub> = σ<sub>avg</sub> ± R, &nbsp; tan 2θ<sub>p</sub> = 2τ<sub>xy</sub>/(σ<sub>x</sub> − σ<sub>y</sub>)<br>Maximum in-plane shear: τ<sub>max</sub> = R, on planes at 45° to the principal planes</div>
<h3>Mohr's circle</h3>
<p>Plot σ horizontally and τ vertically. Point X = (σ<sub>x</sub>, τ<sub>xy</sub>) and point Y = (σ<sub>y</sub>, −τ<sub>xy</sub>) (Hibbeler's convention: τ positive downward on the plot, or follow your textbook consistently). The circle with diameter XY has centre (σ<sub>avg</sub>, 0) and radius R. Its intersections with the σ-axis are σ<sub>1</sub> and σ<sub>2</sub>; its top and bottom points give ±τ<sub>max</sub>. A rotation of 2θ on the circle corresponds to θ on the element.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p>At a point: σ<sub>x</sub> = 80 MPa, σ<sub>y</sub> = −40 MPa, τ<sub>xy</sub> = 30 MPa.</p>
<p>σ<sub>avg</sub> = (80 − 40)/2 = <b>20 MPa</b>; R = √(60<sup>2</sup> + 30<sup>2</sup>) = <b>67.1 MPa</b>.</p>
<p>σ<sub>1</sub> = 20 + 67.1 = <b>87.1 MPa</b>, σ<sub>2</sub> = 20 − 67.1 = <b>−47.1 MPa</b>.</p>
<p>θ<sub>p</sub> = ½ arctan(60/120) = <b>13.3°</b> (counter-clockwise from x to the σ<sub>1</sub> direction).</p>
<p>τ<sub>max</sub> (in-plane) = <b>67.1 MPa</b>, with normal stress 20 MPa on those planes.</p>
<p>Mohr's circle: centre (20, 0), radius 67.1; X at (80, 30), Y at (−40, −30).</p></div>
<div class="note-ct"><p>Two classic special cases: <strong>pure tension</strong> σ gives τ<sub>max</sub> = σ/2 on 45° planes (why ductile bars show 45° shear lips); <strong>pure shear</strong> τ (torsion) gives σ<sub>1,2</sub> = ±τ on 45° planes (why chalk or cast iron twisted to failure breaks along a 45° helix).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Adding stresses from different points of the section.</li><li>Forgetting that a rotation θ on the element is 2θ on Mohr's circle.</li><li>Ignoring the third principal stress (σ<sub>3</sub> = 0 in plane stress) — for σ<sub>1</sub>, σ<sub>2</sub> of the same sign the absolute τ<sub>max</sub> = σ<sub>1</sub>/2.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Superpose stresses at the same point.</li><li>σ<sub>1,2</sub> = σ<sub>avg</sub> ± R; τ<sub>max</sub> = R.</li><li>Mohr's circle: centre σ<sub>avg</sub>, radius R; 2θ on the circle.</li><li>Tension ⇒ shear max at 45°; torsion ⇒ tension max at 45°.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(DP + 'metal-forming-1/index.php', 'DoITPoMS (Cambridge) — Stress analysis and Mohr\'s circle'),
    A(WK + 'Mohr%27s_circle', 'Wikipedia — Mohr\'s circle'),
    A(WK + 'Stress_(mechanics)', 'Wikipedia — Stress (mechanics)'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>σ<sub>x</sub> = 60 MPa, σ<sub>y</sub> = 20 MPa, τ<sub>xy</sub> = 15 MPa. Find σ<sub>1</sub>, σ<sub>2</sub> and τ<sub>max</sub> (in-plane).</li><li>A shaft surface point has σ = 0 and τ = 50 MPa (pure torsion). Principal stresses?</li><li>A bar in tension has σ = 120 MPa. Find the shear stress on a 45° plane.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) σ<sub>avg</sub> = 40, R = 25 ⇒ σ<sub>1</sub> = 65 MPa, σ<sub>2</sub> = 15 MPa, τ<sub>max</sub> = 25 MPa (θ<sub>p</sub> = 18.4°). 2) ±50 MPa at 45°. 3) 60 MPa.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 7 · Bài 7.1</span>
<h2>Tải tổ hợp, trạng thái ứng suất phẳng và vòng tròn Mohr</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Cộng ứng suất do lực dọc, uốn và xoắn tại một điểm nguy hiểm.</li><li>Tìm ứng suất chính và ứng suất cắt lớn nhất trong mặt phẳng.</li><li>Dựng và đọc vòng tròn Mohr.</li></ul>
<h3>Tải tổ hợp</h3>
<p>Chi tiết thực chịu nhiều tải cùng lúc: trục bị uốn bởi lực bánh răng <em>và</em> bị xoắn bởi mômen; tay quay bị uốn và xoắn; giá đỡ bắt bulông bị kéo và uốn. Trong miền đàn hồi ta tính riêng từng ứng suất rồi <strong>cộng tại cùng một điểm</strong> (nguyên lý cộng tác dụng). Điểm nguy hiểm điển hình trên mặt trục: σ<sub>x</sub> = 32M/(πd<sup>3</sup>) do uốn (cộng P/A nếu có lực dọc), τ<sub>xy</sub> = 16T/(πd<sup>3</sup>) do xoắn.</p>
<h3>Biến đổi ứng suất</h3>
<p>Trên một phân tố vuông nhỏ, trạng thái <strong>ứng suất phẳng</strong> là (σ<sub>x</sub>, σ<sub>y</sub>, τ<sub>xy</sub>). Trên các mặt xoay góc θ ứng suất thay đổi; có hai mặt vuông góc nhau không có ứng suất cắt — <strong>mặt chính</strong> — và ứng suất pháp trên đó là giá trị cực trị:</p>
<div class="formula"><span class="lbl">Ứng suất chính</span>σ<sub>tb</sub> = (σ<sub>x</sub> + σ<sub>y</sub>)/2, &nbsp; R = √[((σ<sub>x</sub> − σ<sub>y</sub>)/2)<sup>2</sup> + τ<sub>xy</sub><sup>2</sup>]<br>σ<sub>1,2</sub> = σ<sub>tb</sub> ± R, &nbsp; tan 2θ<sub>p</sub> = 2τ<sub>xy</sub>/(σ<sub>x</sub> − σ<sub>y</sub>)<br>Ứng suất cắt lớn nhất trong mặt phẳng: τ<sub>max</sub> = R, trên các mặt nghiêng 45° so với mặt chính</div>
<h3>Vòng tròn Mohr</h3>
<p>Vẽ σ theo trục ngang, τ theo trục đứng. Điểm X = (σ<sub>x</sub>, τ<sub>xy</sub>) và điểm Y = (σ<sub>y</sub>, −τ<sub>xy</sub>) (quy ước của Hibbeler: τ dương hướng xuống trên đồ thị, hoặc theo đúng quy ước sách bạn dùng một cách nhất quán). Đường tròn đường kính XY có tâm (σ<sub>tb</sub>, 0) và bán kính R. Giao với trục σ là σ<sub>1</sub> và σ<sub>2</sub>; điểm cao nhất và thấp nhất cho ±τ<sub>max</sub>. Quay 2θ trên vòng tròn ứng với quay θ trên phân tố.</p>
<h3>✍️ Ví dụ giải</h3>
<div class="callout"><p>Tại một điểm: σ<sub>x</sub> = 80 MPa, σ<sub>y</sub> = −40 MPa, τ<sub>xy</sub> = 30 MPa.</p>
<p>σ<sub>tb</sub> = (80 − 40)/2 = <b>20 MPa</b>; R = √(60<sup>2</sup> + 30<sup>2</sup>) = <b>67,1 MPa</b>.</p>
<p>σ<sub>1</sub> = 20 + 67,1 = <b>87,1 MPa</b>, σ<sub>2</sub> = 20 − 67,1 = <b>−47,1 MPa</b>.</p>
<p>θ<sub>p</sub> = ½ arctan(60/120) = <b>13,3°</b> (ngược chiều kim đồng hồ từ x tới phương σ<sub>1</sub>).</p>
<p>τ<sub>max</sub> (trong mặt phẳng) = <b>67,1 MPa</b>, ứng suất pháp trên các mặt đó là 20 MPa.</p>
<p>Vòng tròn Mohr: tâm (20, 0), bán kính 67,1; X tại (80, 30), Y tại (−40, −30).</p></div>
<div class="note-ct"><p>Hai trường hợp kinh điển: <strong>kéo thuần tuý</strong> σ cho τ<sub>max</sub> = σ/2 trên mặt 45° (vì vậy thanh dẻo đứt có mép cắt 45°); <strong>trượt thuần tuý</strong> τ (xoắn) cho σ<sub>1,2</sub> = ±τ trên mặt 45° (vì vậy phấn hay gang bị xoắn gãy theo đường xoắn ốc 45°).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cộng ứng suất của các điểm khác nhau trên mặt cắt.</li><li>Quên rằng xoay θ trên phân tố là 2θ trên vòng Mohr.</li><li>Bỏ qua ứng suất chính thứ ba (σ<sub>3</sub> = 0 ở ứng suất phẳng) — khi σ<sub>1</sub>, σ<sub>2</sub> cùng dấu thì τ<sub>max</sub> tuyệt đối = σ<sub>1</sub>/2.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Cộng ứng suất tại cùng một điểm.</li><li>σ<sub>1,2</sub> = σ<sub>tb</sub> ± R; τ<sub>max</sub> = R.</li><li>Vòng Mohr: tâm σ<sub>tb</sub>, bán kính R; 2θ trên vòng.</li><li>Kéo ⇒ cắt lớn nhất ở 45°; xoắn ⇒ kéo lớn nhất ở 45°.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(DP + 'metal-forming-1/index.php', 'DoITPoMS (Cambridge) — Phân tích ứng suất và vòng Mohr'),
    A(WK + 'Mohr%27s_circle', 'Wikipedia — Vòng tròn Mohr'),
    A(WK + 'Stress_(mechanics)', 'Wikipedia — Ứng suất (cơ học)'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>σ<sub>x</sub> = 60 MPa, σ<sub>y</sub> = 20 MPa, τ<sub>xy</sub> = 15 MPa. Tìm σ<sub>1</sub>, σ<sub>2</sub>, τ<sub>max</sub> (trong mặt phẳng).</li><li>Điểm trên mặt trục có σ = 0, τ = 50 MPa (xoắn thuần tuý). Ứng suất chính?</li><li>Thanh chịu kéo σ = 120 MPa. Tìm ứng suất cắt trên mặt nghiêng 45°.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) σ<sub>tb</sub> = 40, R = 25 ⇒ σ<sub>1</sub> = 65 MPa, σ<sub>2</sub> = 15 MPa, τ<sub>max</sub> = 25 MPa (θ<sub>p</sub> = 18,4°). 2) ±50 MPa trên mặt 45°. 3) 60 MPa.</p></div>`);

const c72 = L('emm201c-ts-7-2',
  '7.2 — Static failure theories: Tresca, von Mises and brittle materials|||7.2 — Thuyết bền tĩnh: Tresca, von Mises và vật liệu giòn',
  'Vì sao cần thuyết bền; vật liệu dẻo: ứng suất cắt lớn nhất (Tresca), năng lượng biến dạng hình dáng (von Mises) σ′; vật liệu giòn: ứng suất pháp lớn nhất, Coulomb–Mohr; ví dụ trục chịu uốn + xoắn.',
  `<span class="eyebrow">EMM201c · Chapter 7 · Lesson 7.2</span>
<h2>Static failure theories</h2>
<h3>🎯 Objectives</h3>
<ul><li>Explain why a tensile-test strength must be "translated" to multiaxial stress.</li><li>Apply the Tresca and von Mises criteria to ductile parts.</li><li>Apply maximum-normal-stress / Coulomb–Mohr ideas to brittle parts.</li></ul>
<h3>The problem</h3>
<p>Material data come from a uniaxial tensile test (S<sub>y</sub>, S<sub>ut</sub>), but a shaft point may carry σ and τ together. A <strong>failure theory</strong> converts a combined stress state into one number comparable with the test strength. Which theory to use depends on how the material fails: ductile metals fail by <strong>yielding (shear slip)</strong>, brittle ones by <strong>fracture (normal stress)</strong>.</p>
<h3>Ductile materials</h3>
<div class="formula"><span class="lbl">Maximum shear stress (Tresca)</span>τ<sub>max</sub> = (σ<sub>1</sub> − σ<sub>3</sub>)/2 ≤ S<sub>y</sub>/(2n) &nbsp;(conservative)</div>
<div class="formula"><span class="lbl">Distortion energy (von Mises)</span>σ′ = √(σ<sub>1</sub><sup>2</sup> − σ<sub>1</sub>σ<sub>2</sub> + σ<sub>2</sub><sup>2</sup>) = √(σ<sub>x</sub><sup>2</sup> − σ<sub>x</sub>σ<sub>y</sub> + σ<sub>y</sub><sup>2</sup> + 3τ<sub>xy</sub><sup>2</sup>) (plane stress)<br>Safety factor: n = S<sub>y</sub> / σ′ &nbsp;(best agreement with tests on ductile metals)</div>
<p>For a shaft surface point (σ from bending, τ from torsion): σ′ = √(σ<sup>2</sup> + 3τ<sup>2</sup>) and Tresca gives τ<sub>max</sub> = √((σ/2)<sup>2</sup> + τ<sup>2</sup>). In pure shear, von Mises predicts yield at τ = 0.577 S<sub>y</sub>, Tresca at 0.5 S<sub>y</sub>.</p>
<h3>✍️ Worked example — shaft in bending and torsion</h3>
<div class="callout"><p>At the critical point of a steel shaft, σ = 100 MPa (bending) and τ = 60 MPa (torsion). S<sub>y</sub> = 350 MPa.</p>
<p><b>von Mises:</b> σ′ = √(100<sup>2</sup> + 3 × 60<sup>2</sup>) = √20 800 = <b>144.2 MPa</b> ⇒ n = 350/144.2 = <b>2.43</b>.</p>
<p><b>Tresca:</b> τ<sub>max</sub> = √(50<sup>2</sup> + 60<sup>2</sup>) = <b>78.1 MPa</b> ⇒ n = 350/(2 × 78.1) = <b>2.24</b>.</p>
<p>Tresca is about 8 % more conservative here. Both are acceptable for a machine part with n ≈ 2.</p></div>
<h3>Brittle materials</h3>
<p>Cast iron, ceramics and many hardened steels have S<sub>uc</sub> (compression) much larger than S<sub>ut</sub>. Simple rules: <strong>maximum normal stress</strong> — fail when σ<sub>1</sub> ≥ S<sub>ut</sub> or σ<sub>3</sub> ≤ −S<sub>uc</sub>; the <strong>Coulomb–Mohr</strong> (or modified Mohr) criterion is better when σ<sub>1</sub> &gt; 0 &gt; σ<sub>3</sub>: σ<sub>1</sub>/S<sub>ut</sub> − σ<sub>3</sub>/S<sub>uc</sub> = 1/n.</p>
<div class="callout"><p><b>Example.</b> A grey cast-iron bracket (S<sub>ut</sub> = 200 MPa, S<sub>uc</sub> = 700 MPa) has σ<sub>1</sub> = 80 MPa, σ<sub>3</sub> = −60 MPa. Coulomb–Mohr: 80/200 + 60/700 = 0.4 + 0.086 = 0.486 ⇒ <b>n = 2.06</b>. Maximum normal stress alone would give 200/80 = 2.5 (less safe).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using σ alone and ignoring τ at a combined-load point.</li><li>Applying von Mises to a brittle cast iron.</li><li>Comparing σ′ with S<sub>ut</sub> instead of S<sub>y</sub> for yielding.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Ductile: von Mises σ′ = √(σ<sup>2</sup> + 3τ<sup>2</sup>); n = S<sub>y</sub>/σ′. Tresca is slightly conservative.</li><li>Brittle: maximum normal stress or Coulomb–Mohr with S<sub>ut</sub>, S<sub>uc</sub>.</li><li>Pure shear yield: 0.577 S<sub>y</sub> (vM) vs 0.5 S<sub>y</sub> (Tresca).</li><li>Static theories do not cover fluctuating loads — see fatigue next.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(WK + 'Von_Mises_yield_criterion', 'Wikipedia — von Mises yield criterion'),
    A(WK + 'Yield_(engineering)', 'Wikipedia — Yield (engineering)'),
    A(DP + 'brittle_fracture/index.php', 'DoITPoMS — Brittle fracture'),
    A(OCW_MD, 'MIT OCW 2.72 — Elements of Mechanical Design'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A ductile shaft (S<sub>y</sub> = 400 MPa) is in pure torsion with τ = 100 MPa. Find n by von Mises and by Tresca.</li><li>σ<sub>x</sub> = 150 MPa, σ<sub>y</sub> = 0, τ = 0, S<sub>y</sub> = 300 MPa. Find σ′ and n.</li><li>Why is cast iron poorly predicted by von Mises?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) σ′ = √3 × 100 = 173.2 MPa ⇒ n = 2.31; Tresca: n = 400/(2 × 100) = 2.0. 2) σ′ = 150 MPa, n = 2.0. 3) It fails by brittle fracture under normal stress and is much stronger in compression; von Mises models shear-driven yielding with equal tension/compression strength.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 7 · Bài 7.2</span>
<h2>Thuyết bền tĩnh</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích vì sao độ bền từ thí nghiệm kéo phải được "quy đổi" cho trạng thái ứng suất nhiều trục.</li><li>Áp dụng tiêu chuẩn Tresca và von Mises cho chi tiết dẻo.</li><li>Áp dụng ý tưởng ứng suất pháp lớn nhất / Coulomb–Mohr cho chi tiết giòn.</li></ul>
<h3>Vấn đề</h3>
<p>Số liệu vật liệu lấy từ thí nghiệm kéo một trục (S<sub>y</sub>, S<sub>ut</sub>), nhưng một điểm trên trục có thể chịu đồng thời σ và τ. <strong>Thuyết bền</strong> quy trạng thái ứng suất tổ hợp về một con số so sánh được với độ bền thí nghiệm. Dùng thuyết nào tuỳ cách vật liệu hỏng: kim loại dẻo hỏng do <strong>chảy (trượt)</strong>, vật liệu giòn do <strong>nứt gãy (ứng suất pháp)</strong>.</p>
<h3>Vật liệu dẻo</h3>
<div class="formula"><span class="lbl">Ứng suất cắt lớn nhất (Tresca)</span>τ<sub>max</sub> = (σ<sub>1</sub> − σ<sub>3</sub>)/2 ≤ S<sub>y</sub>/(2n) &nbsp;(thiên về an toàn)</div>
<div class="formula"><span class="lbl">Năng lượng biến đổi hình dáng (von Mises)</span>σ′ = √(σ<sub>1</sub><sup>2</sup> − σ<sub>1</sub>σ<sub>2</sub> + σ<sub>2</sub><sup>2</sup>) = √(σ<sub>x</sub><sup>2</sup> − σ<sub>x</sub>σ<sub>y</sub> + σ<sub>y</sub><sup>2</sup> + 3τ<sub>xy</sub><sup>2</sup>) (ứng suất phẳng)<br>Hệ số an toàn: n = S<sub>y</sub> / σ′ &nbsp;(khớp thí nghiệm kim loại dẻo tốt nhất)</div>
<p>Với điểm trên mặt trục (σ do uốn, τ do xoắn): σ′ = √(σ<sup>2</sup> + 3τ<sup>2</sup>) và Tresca cho τ<sub>max</sub> = √((σ/2)<sup>2</sup> + τ<sup>2</sup>). Khi trượt thuần tuý, von Mises dự đoán chảy tại τ = 0,577 S<sub>y</sub>, Tresca tại 0,5 S<sub>y</sub>.</p>
<h3>✍️ Ví dụ giải — trục chịu uốn và xoắn</h3>
<div class="callout"><p>Tại điểm nguy hiểm của trục thép, σ = 100 MPa (uốn) và τ = 60 MPa (xoắn). S<sub>y</sub> = 350 MPa.</p>
<p><b>von Mises:</b> σ′ = √(100<sup>2</sup> + 3 × 60<sup>2</sup>) = √20 800 = <b>144,2 MPa</b> ⇒ n = 350/144,2 = <b>2,43</b>.</p>
<p><b>Tresca:</b> τ<sub>max</sub> = √(50<sup>2</sup> + 60<sup>2</sup>) = <b>78,1 MPa</b> ⇒ n = 350/(2 × 78,1) = <b>2,24</b>.</p>
<p>Tresca thận trọng hơn khoảng 8 % ở đây. Cả hai đều chấp nhận được với chi tiết máy n ≈ 2.</p></div>
<h3>Vật liệu giòn</h3>
<p>Gang, gốm và nhiều loại thép tôi có S<sub>uc</sub> (nén) lớn hơn nhiều S<sub>ut</sub>. Quy tắc đơn giản: <strong>ứng suất pháp lớn nhất</strong> — hỏng khi σ<sub>1</sub> ≥ S<sub>ut</sub> hoặc σ<sub>3</sub> ≤ −S<sub>uc</sub>; tiêu chuẩn <strong>Coulomb–Mohr</strong> (hoặc Mohr cải tiến) tốt hơn khi σ<sub>1</sub> &gt; 0 &gt; σ<sub>3</sub>: σ<sub>1</sub>/S<sub>ut</sub> − σ<sub>3</sub>/S<sub>uc</sub> = 1/n.</p>
<div class="callout"><p><b>Ví dụ.</b> Giá đỡ gang xám (S<sub>ut</sub> = 200 MPa, S<sub>uc</sub> = 700 MPa) có σ<sub>1</sub> = 80 MPa, σ<sub>3</sub> = −60 MPa. Coulomb–Mohr: 80/200 + 60/700 = 0,4 + 0,086 = 0,486 ⇒ <b>n = 2,06</b>. Chỉ dùng ứng suất pháp lớn nhất sẽ cho 200/80 = 2,5 (kém an toàn hơn).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chỉ dùng σ mà bỏ qua τ tại điểm chịu tải tổ hợp.</li><li>Áp von Mises cho gang giòn.</li><li>So σ′ với S<sub>ut</sub> thay vì S<sub>y</sub> khi xét chảy.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Dẻo: von Mises σ′ = √(σ<sup>2</sup> + 3τ<sup>2</sup>); n = S<sub>y</sub>/σ′. Tresca hơi thận trọng.</li><li>Giòn: ứng suất pháp lớn nhất hoặc Coulomb–Mohr với S<sub>ut</sub>, S<sub>uc</sub>.</li><li>Chảy khi trượt thuần tuý: 0,577 S<sub>y</sub> (vM) và 0,5 S<sub>y</sub> (Tresca).</li><li>Thuyết bền tĩnh không áp cho tải thay đổi — xem mỏi ở bài sau.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(WK + 'Von_Mises_yield_criterion', 'Wikipedia — Tiêu chuẩn chảy von Mises'),
    A(WK + 'Yield_(engineering)', 'Wikipedia — Chảy (kỹ thuật)'),
    A(DP + 'brittle_fracture/index.php', 'DoITPoMS — Phá huỷ giòn'),
    A(OCW_MD, 'MIT OCW 2.72 — Elements of Mechanical Design'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Trục dẻo (S<sub>y</sub> = 400 MPa) xoắn thuần tuý với τ = 100 MPa. Tìm n theo von Mises và theo Tresca.</li><li>σ<sub>x</sub> = 150 MPa, σ<sub>y</sub> = 0, τ = 0, S<sub>y</sub> = 300 MPa. Tìm σ′ và n.</li><li>Vì sao von Mises dự đoán kém cho gang?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) σ′ = √3 × 100 = 173,2 MPa ⇒ n = 2,31; Tresca: n = 400/(2 × 100) = 2,0. 2) σ′ = 150 MPa, n = 2,0. 3) Gang hỏng do nứt giòn dưới ứng suất pháp và chịu nén tốt hơn nhiều; von Mises mô tả chảy do cắt với độ bền kéo và nén như nhau.</p></div>`);

const c73 = L('emm201c-ts-7-3',
  '7.3 — Fatigue: S–N curve, endurance limit, Marin factors and Goodman line|||7.3 — Mỏi: đường S–N, giới hạn mỏi, hệ số Marin và đường Goodman',
  'Hỏng mỏi là gì; ứng suất biên độ và trung bình; đường S–N, giới hạn mỏi Se′ ≈ 0,5Sut; hệ số Marin (bề mặt, kích thước…); tập trung ứng suất Kf; tiêu chuẩn Goodman sửa đổi; ví dụ số.',
  `<span class="eyebrow">EMM201c · Chapter 7 · Lesson 7.3</span>
<h2>Fatigue: S–N curve, endurance limit and the Goodman line</h2>
<h3>🎯 Objectives</h3>
<ul><li>Explain why parts break under repeated loads far below S<sub>y</sub>.</li><li>Estimate a corrected endurance limit S<sub>e</sub> with Marin factors.</li><li>Check a part under fluctuating stress with the modified Goodman criterion.</li></ul>
<h3>What is fatigue?</h3>
<p>A rotating shaft, a spring, a con-rod, a robot joint — each point goes through millions of stress cycles. A tiny crack starts at a stress raiser (a fillet, keyway, hole, scratch), grows a little every cycle, and the part finally breaks suddenly, often with no visible warning. Most mechanical failures in service are fatigue failures.</p>
<p>A fluctuating stress between σ<sub>min</sub> and σ<sub>max</sub> is described by:</p>
<div class="formula"><span class="lbl">Fluctuating stress</span>σ<sub>a</sub> = (σ<sub>max</sub> − σ<sub>min</sub>)/2 &nbsp;(alternating) &nbsp;&nbsp; σ<sub>m</sub> = (σ<sub>max</sub> + σ<sub>min</sub>)/2 &nbsp;(mean)</div>
<p>A rotating shaft in steady bending is <em>fully reversed</em>: σ<sub>m</sub> = 0, σ<sub>a</sub> = Mc/I.</p>
<h3>S–N curve and endurance limit</h3>
<p>Rotating-beam tests plot strength S against life N (log scale). Steels show a knee around 10<sup>6</sup>–10<sup>7</sup> cycles: below the <strong>endurance limit</strong> the life is practically infinite. Aluminium has no true endurance limit — it is designed for a finite life. Shigley's estimate for steels:</p>
<div class="formula"><span class="lbl">Endurance limit (test specimen)</span>S<sub>e</sub>′ = 0.5 S<sub>ut</sub> for S<sub>ut</sub> ≤ 1400 MPa; S<sub>e</sub>′ = 700 MPa above</div>
<p>A real part differs from the polished test bar, so we correct it with <strong>Marin factors</strong>:</p>
<div class="formula"><span class="lbl">Corrected endurance limit</span>S<sub>e</sub> = k<sub>a</sub>·k<sub>b</sub>·k<sub>c</sub>·k<sub>d</sub>·k<sub>e</sub>·S<sub>e</sub>′<br>Surface: k<sub>a</sub> = a·S<sub>ut</sub><sup>b</sup> (machined/cold-drawn: a = 4.51 MPa, b = −0.265; ground: 1.58, −0.085; hot-rolled: 57.7, −0.718)<br>Size (rotating, 2.79 ≤ d ≤ 51 mm): k<sub>b</sub> = 1.24 d<sup>−0.107</sup>; load k<sub>c</sub> = 1 bending, 0.85 axial; temperature k<sub>d</sub>; reliability k<sub>e</sub></div>
<p>Notches reduce fatigue strength: the fatigue stress-concentration factor K<sub>f</sub> = 1 + q(K<sub>t</sub> − 1), where q (notch sensitivity, 0–1) comes from charts. Multiply the nominal alternating stress by K<sub>f</sub>.</p>
<h3>Mean stress: modified Goodman</h3>
<div class="formula"><span class="lbl">Modified Goodman</span>σ<sub>a</sub>/S<sub>e</sub> + σ<sub>m</sub>/S<sub>ut</sub> = 1/n &nbsp;&nbsp; plus a first-cycle yield check: σ<sub>a</sub> + σ<sub>m</sub> ≤ S<sub>y</sub>/n</div>
<h3>✍️ Worked example</h3>
<div class="callout"><p>A machined steel part, d = 30 mm, S<sub>ut</sub> = 600 MPa, S<sub>y</sub> = 350 MPa, rotating bending with σ<sub>a</sub> = 80 MPa and a mean stress σ<sub>m</sub> = 120 MPa (already including K<sub>f</sub>).</p>
<p>S<sub>e</sub>′ = 0.5 × 600 = 300 MPa. k<sub>a</sub> = 4.51 × 600<sup>−0.265</sup> = <b>0.828</b>; k<sub>b</sub> = 1.24 × 30<sup>−0.107</sup> = <b>0.862</b>; other factors 1.</p>
<p>S<sub>e</sub> = 0.828 × 0.862 × 300 = <b>214 MPa</b> — only 36 % of S<sub>ut</sub>.</p>
<p>Goodman: 1/n = 80/214 + 120/600 = 0.374 + 0.200 = 0.574 ⇒ <b>n = 1.74</b>. Yield check: 350/(80 + 120) = 1.75 ✓.</p>
<p>If instead the nominal σ<sub>a</sub> = 80 MPa occurred at a shoulder with K<sub>f</sub> = 1.8, the effective σ<sub>a</sub> = 144 MPa and n would drop to <b>1.15</b> — fillet radii matter.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using S<sub>y</sub> with a static theory for a rotating shaft — fatigue usually governs.</li><li>Forgetting K<sub>f</sub> at shoulders, keyways and holes.</li><li>Using S<sub>e</sub>′ of the polished specimen without Marin factors.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>σ<sub>a</sub>, σ<sub>m</sub> describe a fluctuating stress.</li><li>Steel: S<sub>e</sub>′ ≈ 0.5 S<sub>ut</sub> (≤ 700 MPa); correct with k<sub>a</sub>…k<sub>e</sub>.</li><li>K<sub>f</sub> = 1 + q(K<sub>t</sub> − 1) at notches.</li><li>Goodman: σ<sub>a</sub>/S<sub>e</sub> + σ<sub>m</sub>/S<sub>ut</sub> = 1/n, and check yield.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(WK + 'Fatigue_(material)', 'Wikipedia — Fatigue (material)'),
    A(WK + 'Fatigue_limit', 'Wikipedia — Fatigue limit'),
    A(WK + 'Goodman_relation', 'Wikipedia — Goodman relation'),
    A(WK + 'Stress_concentration', 'Wikipedia — Stress concentration'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>Estimate S<sub>e</sub>′ for steels with S<sub>ut</sub> = 800 MPa and 1600 MPa.</li><li>A part has σ<sub>a</sub> = 100 MPa, σ<sub>m</sub> = 0 and S<sub>e</sub> = 200 MPa. Find n.</li><li>K<sub>t</sub> = 2.0 and q = 0.8. Find K<sub>f</sub>.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 400 MPa; 700 MPa (cap). 2) n = 200/100 = 2.0. 3) K<sub>f</sub> = 1 + 0.8 × 1 = 1.8.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 7 · Bài 7.3</span>
<h2>Mỏi: đường S–N, giới hạn mỏi và đường Goodman</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Giải thích vì sao chi tiết gãy dưới tải lặp thấp hơn nhiều S<sub>y</sub>.</li><li>Ước lượng giới hạn mỏi đã hiệu chỉnh S<sub>e</sub> bằng hệ số Marin.</li><li>Kiểm chi tiết chịu ứng suất thay đổi bằng tiêu chuẩn Goodman sửa đổi.</li></ul>
<h3>Mỏi là gì?</h3>
<p>Trục quay, lò xo, tay biên, khớp robot — mỗi điểm trải qua hàng triệu chu kỳ ứng suất. Một vết nứt nhỏ bắt đầu tại chỗ tập trung ứng suất (góc lượn, rãnh then, lỗ, vết xước), lớn dần sau mỗi chu kỳ, rồi chi tiết gãy đột ngột, thường không có dấu hiệu báo trước. Phần lớn hỏng hóc cơ khí khi vận hành là hỏng do mỏi.</p>
<p>Ứng suất thay đổi giữa σ<sub>min</sub> và σ<sub>max</sub> được mô tả bởi:</p>
<div class="formula"><span class="lbl">Ứng suất thay đổi</span>σ<sub>a</sub> = (σ<sub>max</sub> − σ<sub>min</sub>)/2 &nbsp;(biên độ) &nbsp;&nbsp; σ<sub>m</sub> = (σ<sub>max</sub> + σ<sub>min</sub>)/2 &nbsp;(trung bình)</div>
<p>Trục quay chịu uốn không đổi là chu kỳ <em>đối xứng</em>: σ<sub>m</sub> = 0, σ<sub>a</sub> = Mc/I.</p>
<h3>Đường S–N và giới hạn mỏi</h3>
<p>Thí nghiệm dầm quay vẽ độ bền S theo tuổi thọ N (thang log). Thép có điểm gãy khúc quanh 10<sup>6</sup>–10<sup>7</sup> chu kỳ: dưới <strong>giới hạn mỏi</strong> tuổi thọ coi như vô hạn. Nhôm không có giới hạn mỏi thực sự — thiết kế theo tuổi thọ hữu hạn. Ước lượng của Shigley cho thép:</p>
<div class="formula"><span class="lbl">Giới hạn mỏi (mẫu thử)</span>S<sub>e</sub>′ = 0,5 S<sub>ut</sub> khi S<sub>ut</sub> ≤ 1400 MPa; S<sub>e</sub>′ = 700 MPa khi lớn hơn</div>
<p>Chi tiết thật khác thanh mẫu đánh bóng, nên ta hiệu chỉnh bằng <strong>hệ số Marin</strong>:</p>
<div class="formula"><span class="lbl">Giới hạn mỏi hiệu chỉnh</span>S<sub>e</sub> = k<sub>a</sub>·k<sub>b</sub>·k<sub>c</sub>·k<sub>d</sub>·k<sub>e</sub>·S<sub>e</sub>′<br>Bề mặt: k<sub>a</sub> = a·S<sub>ut</sub><sup>b</sup> (gia công cắt/kéo nguội: a = 4,51 MPa, b = −0,265; mài: 1,58, −0,085; cán nóng: 57,7, −0,718)<br>Kích thước (trục quay, 2,79 ≤ d ≤ 51 mm): k<sub>b</sub> = 1,24 d<sup>−0,107</sup>; dạng tải k<sub>c</sub> = 1 uốn, 0,85 kéo nén; nhiệt độ k<sub>d</sub>; độ tin cậy k<sub>e</sub></div>
<p>Rãnh khía làm giảm độ bền mỏi: hệ số tập trung ứng suất mỏi K<sub>f</sub> = 1 + q(K<sub>t</sub> − 1), với q (độ nhạy rãnh khía, 0–1) tra biểu đồ. Nhân ứng suất biên độ danh nghĩa với K<sub>f</sub>.</p>
<h3>Ứng suất trung bình: Goodman sửa đổi</h3>
<div class="formula"><span class="lbl">Goodman sửa đổi</span>σ<sub>a</sub>/S<sub>e</sub> + σ<sub>m</sub>/S<sub>ut</sub> = 1/n &nbsp;&nbsp; kèm kiểm chảy ở chu kỳ đầu: σ<sub>a</sub> + σ<sub>m</sub> ≤ S<sub>y</sub>/n</div>
<h3>✍️ Ví dụ giải</h3>
<div class="callout"><p>Chi tiết thép gia công cắt, d = 30 mm, S<sub>ut</sub> = 600 MPa, S<sub>y</sub> = 350 MPa, chịu uốn quay với σ<sub>a</sub> = 80 MPa và ứng suất trung bình σ<sub>m</sub> = 120 MPa (đã gồm K<sub>f</sub>).</p>
<p>S<sub>e</sub>′ = 0,5 × 600 = 300 MPa. k<sub>a</sub> = 4,51 × 600<sup>−0,265</sup> = <b>0,828</b>; k<sub>b</sub> = 1,24 × 30<sup>−0,107</sup> = <b>0,862</b>; các hệ số khác bằng 1.</p>
<p>S<sub>e</sub> = 0,828 × 0,862 × 300 = <b>214 MPa</b> — chỉ bằng 36 % S<sub>ut</sub>.</p>
<p>Goodman: 1/n = 80/214 + 120/600 = 0,374 + 0,200 = 0,574 ⇒ <b>n = 1,74</b>. Kiểm chảy: 350/(80 + 120) = 1,75 ✓.</p>
<p>Nếu σ<sub>a</sub> danh nghĩa = 80 MPa xảy ra tại vai trục có K<sub>f</sub> = 1,8, σ<sub>a</sub> hiệu dụng = 144 MPa và n tụt còn <b>1,15</b> — bán kính góc lượn rất quan trọng.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng S<sub>y</sub> với thuyết bền tĩnh cho trục quay — thường mỏi mới là điều quyết định.</li><li>Quên K<sub>f</sub> tại vai trục, rãnh then, lỗ.</li><li>Dùng S<sub>e</sub>′ của mẫu đánh bóng mà không nhân hệ số Marin.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>σ<sub>a</sub>, σ<sub>m</sub> mô tả ứng suất thay đổi.</li><li>Thép: S<sub>e</sub>′ ≈ 0,5 S<sub>ut</sub> (≤ 700 MPa); hiệu chỉnh bằng k<sub>a</sub>…k<sub>e</sub>.</li><li>K<sub>f</sub> = 1 + q(K<sub>t</sub> − 1) tại rãnh khía.</li><li>Goodman: σ<sub>a</sub>/S<sub>e</sub> + σ<sub>m</sub>/S<sub>ut</sub> = 1/n, và kiểm chảy.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(WK + 'Fatigue_(material)', 'Wikipedia — Mỏi vật liệu'),
    A(WK + 'Fatigue_limit', 'Wikipedia — Giới hạn mỏi'),
    A(WK + 'Goodman_relation', 'Wikipedia — Quan hệ Goodman'),
    A(WK + 'Stress_concentration', 'Wikipedia — Tập trung ứng suất'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Ước lượng S<sub>e</sub>′ cho thép có S<sub>ut</sub> = 800 MPa và 1600 MPa.</li><li>Chi tiết có σ<sub>a</sub> = 100 MPa, σ<sub>m</sub> = 0 và S<sub>e</sub> = 200 MPa. Tìm n.</li><li>K<sub>t</sub> = 2,0 và q = 0,8. Tìm K<sub>f</sub>.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 400 MPa; 700 MPa (trần). 2) n = 200/100 = 2,0. 3) K<sub>f</sub> = 1 + 0,8 × 1 = 1,8.</p></div>`);

const c74 = L('emm201c-ts-7-4',
  '7.4 — Choosing a factor of safety and selecting materials|||7.4 — Chọn hệ số an toàn và chọn vật liệu',
  'Hệ số an toàn và hệ số thiết kế; các nguồn bất định; giá trị điển hình; chọn vật liệu theo chức năng – ràng buộc – mục tiêu; chỉ số vật liệu E/ρ, E^(1/2)/ρ; bảng so sánh thép, nhôm, titan, CFRP.',
  `<span class="eyebrow">EMM201c · Chapter 7 · Lesson 7.4</span>
<h2>Choosing a factor of safety and selecting materials</h2>
<h3>🎯 Objectives</h3>
<ul><li>Choose a reasonable factor of safety and justify it.</li><li>Use the function–constraint–objective method and material indices.</li><li>Compare common engineering materials for light, stiff parts.</li></ul>
<h3>Factor of safety in practice</h3>
<p>Shigley distinguishes the <strong>design factor</strong> n<sub>d</sub> (the target chosen before sizing) and the <strong>factor of safety</strong> n (what the finished design actually has, after rounding up to standard sizes). The design factor covers uncertainty in:</p>
<ul><li><strong>Loads</strong> — impacts, overloads, misuse (a car hitting a pothole; a robot crashing into a fixture).</li><li><strong>Material strength</strong> — scatter between batches; published values are often minimums.</li><li><strong>Analysis</strong> — simplified models, unknown stress concentrations.</li><li><strong>Consequences of failure</strong> — injury, cost, downtime; and whether failure gives warning (ductile) or not (brittle, fatigue).</li></ul>
<table>
<tr><th>Situation (rule of thumb)</th><th>n</th></tr>
<tr><td>Reliable materials, well-known loads, light weight critical (aircraft, with testing)</td><td>1.25–1.5</td></tr>
<tr><td>Average machine parts, known materials and loads</td><td>1.5–2.5</td></tr>
<tr><td>Less-tried materials, uncertain loads or environment</td><td>2.5–4</td></tr>
<tr><td>Brittle materials, impact, or life-safety items (lifting gear)</td><td>≥ 4, or as required by codes</td></tr>
</table>
<p>Where a design code or standard exists (pressure vessels, cranes, lifting equipment, vehicle components), its safety factors are <strong>mandatory</strong> and override rules of thumb.</p>
<h3>Material selection: function, constraints, objective</h3>
<p>Ashby's method: define the <strong>function</strong> (tie, beam, shaft, spring), the <strong>constraints</strong> (must not yield, must not deflect more than δ, must fit in a given space) and the <strong>objective</strong> (minimum mass or cost). Combining them gives a <strong>material index</strong> to maximise:</p>
<div class="formula"><span class="lbl">Material indices (minimum mass)</span>Stiff tie (given length, stiffness): E/ρ<br>Stiff beam (given length, stiffness, free section size): E<sup>1/2</sup>/ρ<br>Strong beam: σ<sub>f</sub><sup>2/3</sup>/ρ &nbsp;&nbsp; Strong tie: σ<sub>f</sub>/ρ</div>
<h3>✍️ Worked example — light, stiff robot arm link</h3>
<div class="callout"><p>Typical values (check a data source for real design): E in GPa, ρ in Mg/m<sup>3</sup>.</p>
<table>
<tr><th>Material</th><th>E</th><th>ρ</th><th>E/ρ (tie)</th><th>E<sup>1/2</sup>/ρ (beam)</th></tr>
<tr><td>Steel</td><td>200</td><td>7.85</td><td>25.5</td><td>1.80</td></tr>
<tr><td>Aluminium alloy</td><td>70</td><td>2.70</td><td>25.9</td><td>3.10</td></tr>
<tr><td>Titanium alloy</td><td>110</td><td>4.50</td><td>24.4</td><td>2.33</td></tr>
<tr><td>CFRP (quasi-isotropic, approx.)</td><td>100</td><td>1.60</td><td>62.5</td><td>6.25</td></tr>
</table>
<p>For a <b>tie</b>, steel, aluminium and titanium are almost equal (≈ 25) — no metal saves mass. For a <b>beam</b> sized for stiffness, aluminium is 1.7× better than steel and CFRP about 3.5× better: that is why robot arms and racing chassis use aluminium and carbon fibre. Cost, joining, fatigue, corrosion and manufacturing then decide between the finalists.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Picking a huge n "to be safe": it makes parts heavy, expensive and sometimes less reliable (more inertia, more load on bearings).</li><li>Choosing a stronger steel to fix a stiffness problem.</li><li>Comparing materials on strength only and ignoring density, cost and process.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>n covers uncertainty in loads, material, analysis and consequences.</li><li>Typical machine parts: n ≈ 1.5–2.5; codes override rules of thumb.</li><li>Function–constraint–objective ⇒ material index.</li><li>Stiff light beam: maximise E<sup>1/2</sup>/ρ — aluminium and composites win.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(WK + 'Material_selection', 'Wikipedia — Material selection (Ashby method and indices)'),
    A('https://www.engineeringtoolbox.com/factors-safety-fos-d_1624.html', 'Engineering ToolBox — Factors of safety'),
    A(DP + 'mechanical_properties/index.php', 'DoITPoMS — Introduction to mechanical properties of materials'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A part needs n<sub>d</sub> = 2 and has σ′ = 140 MPa. What minimum S<sub>y</sub> is required?</li><li>Using E/ρ, would replacing a steel tie by aluminium save mass at equal stiffness?</li><li>Name two reasons to use a higher factor of safety for a hoist hook than for a gearbox cover.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) S<sub>y</sub> ≥ 2 × 140 = 280 MPa. 2) Almost no (25.9 vs 25.5): mass would be about the same. 3) Failure endangers people (life-safety, often code-mandated) and loads are uncertain (shock, overload); a cover carries little load.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 7 · Bài 7.4</span>
<h2>Chọn hệ số an toàn và chọn vật liệu</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Chọn hệ số an toàn hợp lý và giải thích được lựa chọn.</li><li>Dùng phương pháp chức năng – ràng buộc – mục tiêu và chỉ số vật liệu.</li><li>So sánh vật liệu kỹ thuật thông dụng cho chi tiết nhẹ và cứng.</li></ul>
<h3>Hệ số an toàn trong thực tế</h3>
<p>Shigley phân biệt <strong>hệ số thiết kế</strong> n<sub>d</sub> (mục tiêu chọn trước khi tính kích thước) và <strong>hệ số an toàn</strong> n (giá trị thiết kế hoàn chỉnh thực có, sau khi làm tròn lên cỡ chuẩn). Hệ số thiết kế bù cho độ bất định về:</p>
<ul><li><strong>Tải</strong> — va đập, quá tải, dùng sai (xe sập ổ gà; robot đâm vào đồ gá).</li><li><strong>Độ bền vật liệu</strong> — sai khác giữa các lô; số liệu công bố thường là giá trị nhỏ nhất.</li><li><strong>Phân tích</strong> — mô hình đơn giản hoá, tập trung ứng suất chưa biết.</li><li><strong>Hậu quả hỏng hóc</strong> — thương tích, chi phí, dừng máy; và hỏng có báo trước (dẻo) hay không (giòn, mỏi).</li></ul>
<table>
<tr><th>Tình huống (kinh nghiệm)</th><th>n</th></tr>
<tr><td>Vật liệu tin cậy, tải rõ, khối lượng rất quan trọng (máy bay, có thử nghiệm)</td><td>1,25–1,5</td></tr>
<tr><td>Chi tiết máy trung bình, vật liệu và tải đã biết</td><td>1,5–2,5</td></tr>
<tr><td>Vật liệu ít kinh nghiệm, tải hoặc môi trường bất định</td><td>2,5–4</td></tr>
<tr><td>Vật liệu giòn, va đập, hoặc thiết bị liên quan an toàn tính mạng (thiết bị nâng)</td><td>≥ 4, hoặc theo tiêu chuẩn</td></tr>
</table>
<p>Khi có tiêu chuẩn thiết kế (bình áp lực, cầu trục, thiết bị nâng, chi tiết ô tô), hệ số an toàn của tiêu chuẩn là <strong>bắt buộc</strong> và thay thế các quy tắc kinh nghiệm.</p>
<h3>Chọn vật liệu: chức năng, ràng buộc, mục tiêu</h3>
<p>Phương pháp Ashby: xác định <strong>chức năng</strong> (thanh kéo, dầm, trục, lò xo), <strong>ràng buộc</strong> (không được chảy, không võng quá δ, phải vừa không gian cho trước) và <strong>mục tiêu</strong> (khối lượng hoặc giá nhỏ nhất). Kết hợp lại được một <strong>chỉ số vật liệu</strong> cần làm cực đại:</p>
<div class="formula"><span class="lbl">Chỉ số vật liệu (khối lượng nhỏ nhất)</span>Thanh kéo cứng (chiều dài, độ cứng cho trước): E/ρ<br>Dầm cứng (chiều dài, độ cứng cho trước, kích thước mặt cắt tự do): E<sup>1/2</sup>/ρ<br>Dầm bền: σ<sub>f</sub><sup>2/3</sup>/ρ &nbsp;&nbsp; Thanh kéo bền: σ<sub>f</sub>/ρ</div>
<h3>✍️ Ví dụ giải — khâu tay robot nhẹ và cứng</h3>
<div class="callout"><p>Giá trị điển hình (thiết kế thật phải tra nguồn số liệu): E theo GPa, ρ theo Mg/m<sup>3</sup>.</p>
<table>
<tr><th>Vật liệu</th><th>E</th><th>ρ</th><th>E/ρ (thanh kéo)</th><th>E<sup>1/2</sup>/ρ (dầm)</th></tr>
<tr><td>Thép</td><td>200</td><td>7,85</td><td>25,5</td><td>1,80</td></tr>
<tr><td>Hợp kim nhôm</td><td>70</td><td>2,70</td><td>25,9</td><td>3,10</td></tr>
<tr><td>Hợp kim titan</td><td>110</td><td>4,50</td><td>24,4</td><td>2,33</td></tr>
<tr><td>CFRP (gần đẳng hướng, xấp xỉ)</td><td>100</td><td>1,60</td><td>62,5</td><td>6,25</td></tr>
</table>
<p>Với <b>thanh kéo</b>, thép, nhôm và titan gần như ngang nhau (≈ 25) — không kim loại nào giúp giảm khối lượng. Với <b>dầm</b> tính theo độ cứng, nhôm tốt hơn thép 1,7 lần và CFRP khoảng 3,5 lần: vì vậy tay robot và khung xe đua dùng nhôm và sợi carbon. Sau đó giá thành, cách ghép nối, mỏi, ăn mòn và công nghệ chế tạo quyết định giữa các ứng viên.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Chọn n rất lớn "cho chắc": chi tiết nặng, đắt và đôi khi kém tin cậy hơn (quán tính lớn, ổ chịu tải nhiều hơn).</li><li>Chọn thép bền hơn để chữa vấn đề độ cứng.</li><li>So sánh vật liệu chỉ theo độ bền mà bỏ qua khối lượng riêng, giá và công nghệ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>n bù cho bất định về tải, vật liệu, phân tích và hậu quả.</li><li>Chi tiết máy thông thường: n ≈ 1,5–2,5; tiêu chuẩn thay thế quy tắc kinh nghiệm.</li><li>Chức năng – ràng buộc – mục tiêu ⇒ chỉ số vật liệu.</li><li>Dầm nhẹ và cứng: cực đại E<sup>1/2</sup>/ρ — nhôm và composite thắng.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(WK + 'Material_selection', 'Wikipedia — Chọn vật liệu (phương pháp Ashby và chỉ số)'),
    A('https://www.engineeringtoolbox.com/factors-safety-fos-d_1624.html', 'Engineering ToolBox — Hệ số an toàn'),
    A(DP + 'mechanical_properties/index.php', 'DoITPoMS — Nhập môn cơ tính vật liệu'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Chi tiết cần n<sub>d</sub> = 2 và có σ′ = 140 MPa. Cần S<sub>y</sub> tối thiểu bao nhiêu?</li><li>Theo E/ρ, thay thanh kéo thép bằng nhôm có giảm khối lượng ở cùng độ cứng không?</li><li>Nêu hai lý do dùng hệ số an toàn cao hơn cho móc cẩu so với nắp hộp số.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) S<sub>y</sub> ≥ 2 × 140 = 280 MPa. 2) Gần như không (25,9 so với 25,5): khối lượng xấp xỉ như nhau. 3) Hỏng hóc nguy hiểm tính mạng (thường bắt buộc theo tiêu chuẩn) và tải bất định (va đập, quá tải); nắp hộp số chịu tải rất nhỏ.</p></div>`);

const q7 = QZ(7, 'Quiz — Chapter 7: Combined stress, failure theories, fatigue and material selection|||Quiz — Chương 7: Ứng suất tổ hợp, thuyết bền, mỏi và chọn vật liệu', 'Kiểm tra chương 7: ứng suất chính, vòng Mohr, Tresca/von Mises, vật liệu giòn, mỏi, hệ số Marin, Goodman, hệ số an toàn, chỉ số vật liệu.', [
  Q('q1', 'σx = 80, σy = −40, τxy = 30 MPa. The radius of Mohr\'s circle is|||σx = 80, σy = −40, τxy = 30 MPa. Bán kính vòng Mohr là',
    ['30 MPa|||30 MPa', '67.1 MPa|||67,1 MPa', '60 MPa|||60 MPa', '120 MPa|||120 MPa'], 1,
    'R = √(60² + 30²).|||R = √(60² + 30²).'),
  Q('q2', 'A rotation θ of the stress element corresponds on Mohr\'s circle to|||Xoay phân tố ứng suất góc θ tương ứng trên vòng Mohr là',
    ['θ|||θ', '2θ|||2θ', 'θ/2|||θ/2', '90° − θ|||90° − θ'], 1,
    'Angles double on Mohr\'s circle.|||Góc nhân đôi trên vòng Mohr.'),
  Q('q3', 'In pure torsion with shear stress τ, the principal stresses are|||Xoắn thuần tuý với ứng suất cắt τ, ứng suất chính là',
    ['τ and 0|||τ và 0', '+τ and −τ|||+τ và −τ', '2τ and 0|||2τ và 0', '0 and 0|||0 và 0'], 1,
    'On planes at 45°.|||Trên mặt nghiêng 45°.'),
  Q('q4', 'For a shaft surface point with σ and τ, the von Mises stress is|||Với điểm trên mặt trục có σ và τ, ứng suất von Mises là',
    ['√(σ² + τ²)|||√(σ² + τ²)', '√(σ² + 3τ²)|||√(σ² + 3τ²)', 'σ + τ|||σ + τ', '√(σ² + 4τ²)|||√(σ² + 4τ²)'], 1,
    'Plane stress with σy = 0.|||Ứng suất phẳng với σy = 0.'),
  Q('q5', 'Compared with von Mises, the Tresca criterion is|||So với von Mises, tiêu chuẩn Tresca',
    ['less conservative|||kém an toàn hơn', 'slightly more conservative|||thận trọng hơn một chút', 'identical always|||luôn giống hệt', 'only for brittle materials|||chỉ cho vật liệu giòn'], 1,
    'Up to about 15 % more conservative (e.g. pure shear).|||Thận trọng hơn đến khoảng 15 % (ví dụ trượt thuần tuý).'),
  Q('q6', 'Which criterion suits grey cast iron?|||Tiêu chuẩn nào phù hợp với gang xám?',
    ['von Mises|||von Mises', 'Tresca|||Tresca', 'Coulomb–Mohr / maximum normal stress|||Coulomb–Mohr / ứng suất pháp lớn nhất', 'none|||không có'], 2,
    'Brittle, stronger in compression.|||Giòn, chịu nén tốt hơn.'),
  Q('q7', 'The endurance-limit estimate for a steel with Sut = 600 MPa (test specimen) is|||Ước lượng giới hạn mỏi của thép Sut = 600 MPa (mẫu thử) là',
    ['600 MPa|||600 MPa', '300 MPa|||300 MPa', '700 MPa|||700 MPa', '150 MPa|||150 MPa'], 1,
    'Se′ = 0.5 Sut for Sut ≤ 1400 MPa.|||Se′ = 0,5 Sut khi Sut ≤ 1400 MPa.'),
  Q('q8', 'With σa = 100, σm = 100, Se = 200, Sut = 500 MPa, the Goodman factor of safety is|||Với σa = 100, σm = 100, Se = 200, Sut = 500 MPa, hệ số an toàn Goodman là',
    ['2.0|||2,0', '1.43|||1,43', '0.7|||0,7', '2.5|||2,5'], 1,
    '1/n = 0.5 + 0.2 = 0.7 ⇒ n = 1.43.|||1/n = 0,5 + 0,2 = 0,7 ⇒ n = 1,43.'),
  Q('q9', 'Kt = 2.5 and notch sensitivity q = 0.6 give Kf =|||Kt = 2,5 và độ nhạy rãnh khía q = 0,6 cho Kf =',
    ['2.5|||2,5', '1.9|||1,9', '1.5|||1,5', '1.6|||1,6'], 1,
    'Kf = 1 + 0.6 × 1.5 = 1.9.|||Kf = 1 + 0,6 × 1,5 = 1,9.'),
  Q('q10', 'To minimise the mass of a beam of given stiffness, maximise|||Để giảm tối thiểu khối lượng dầm có độ cứng cho trước, cực đại',
    ['E/ρ|||E/ρ', 'E^(1/2)/ρ|||E^(1/2)/ρ', 'σf/ρ|||σf/ρ', 'ρ/E|||ρ/E'], 1,
    'Ashby\'s index for a stiff light beam.|||Chỉ số Ashby cho dầm nhẹ và cứng.'),
]);

const ch7 = {
  title: 'Chapter 7 — Combined stress, failure theories, fatigue and material selection|||Chương 7 — Ứng suất tổ hợp, thuyết bền, mỏi và chọn vật liệu',
  description: 'Ứng suất phẳng, vòng Mohr, thuyết bền Tresca/von Mises/Coulomb–Mohr, mỏi (S–N, Marin, Goodman), hệ số an toàn và chọn vật liệu theo Ashby (Beer & Johnston ch.7; Shigley ch.1, 5–6).',
  lessons: [c71, c72, c73, c74, q7],
};

// ───────────────────────────── Chương 8 ─────────────────────────────
const c81 = L('emm201c-ts-8-1',
  '8.1 — Rectilinear kinematics of a particle|||8.1 — Động học chất điểm chuyển động thẳng',
  'Vị trí, vận tốc, gia tốc: v = ds/dt, a = dv/dt, a·ds = v·dv; gia tốc không đổi; quãng đường tăng tốc và phanh ô tô; gia tốc thay đổi theo thời gian; quãng đường khác độ dời.',
  `<span class="eyebrow">EMM201c · Chapter 8 · Lesson 8.1</span>
<h2>Rectilinear kinematics of a particle</h2>
<h3>🎯 Objectives</h3>
<ul><li>Relate position, velocity and acceleration by differentiation and integration.</li><li>Use the constant-acceleration equations for acceleration and braking problems.</li><li>Distinguish displacement from total distance travelled.</li></ul>
<h3>Definitions</h3>
<p><strong>Kinematics</strong> describes motion without asking what causes it. For a particle moving along a straight line with position s(t):</p>
<div class="formula"><span class="lbl">Rectilinear kinematics</span>v = ds/dt &nbsp;&nbsp; a = dv/dt = d<sup>2</sup>s/dt<sup>2</sup> &nbsp;&nbsp; a·ds = v·dv</div>
<p>The third relation (eliminating time) is the one to use when a is given as a function of position, or when time is not asked.</p>
<div class="formula"><span class="lbl">Constant acceleration a<sub>c</sub> only</span>v = v<sub>0</sub> + a<sub>c</sub>t<br>s = s<sub>0</sub> + v<sub>0</sub>t + ½a<sub>c</sub>t<sup>2</sup><br>v<sup>2</sup> = v<sub>0</sub><sup>2</sup> + 2a<sub>c</sub>(s − s<sub>0</sub>)</div>
<h3>✍️ Example 1 — acceleration and braking of a car</h3>
<div class="callout"><p><b>(a)</b> A car goes from 0 to 100 km/h (27.78 m/s) in 8 s with constant acceleration: a = 27.78/8 = <b>3.47 m/s<sup>2</sup></b> (≈ 0.35 g); distance s = ½ × 3.47 × 8<sup>2</sup> = <b>111 m</b>.</p>
<p><b>(b)</b> From 100 km/h the driver brakes at 7 m/s<sup>2</sup> after a reaction time of 1.0 s. Reaction distance = 27.78 × 1.0 = 27.8 m; braking distance from v<sup>2</sup> = v<sub>0</sub><sup>2</sup> − 2as ⇒ s = 27.78<sup>2</sup>/(2 × 7) = 55.1 m. <b>Total stopping distance ≈ 82.9 m</b>.</p>
<p>Note: braking distance grows with v<sup>2</sup> — at 50 km/h it is only a quarter (13.8 m). This is the physics behind speed limits near schools.</p></div>
<h3>✍️ Example 2 — non-constant acceleration</h3>
<div class="callout"><p>A linear actuator's position is s(t) = t<sup>3</sup> − 6t<sup>2</sup> + 9t (s in mm, t in s), for 0 ≤ t ≤ 4 s.</p>
<p>v = 3t<sup>2</sup> − 12t + 9 = 3(t − 1)(t − 3) ⇒ v = 0 at <b>t = 1 s and t = 3 s</b> (direction reverses). a = 6t − 12 (−12 mm/s<sup>2</sup> at t = 0, +12 at t = 4).</p>
<p>Positions: s(0) = 0, s(1) = 4, s(3) = 0, s(4) = 4 mm. <b>Displacement</b> 0 → 4 s = 4 mm, but <b>total distance</b> = 4 + 4 + 4 = <b>12 mm</b> (checked by integrating |v|).</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the constant-acceleration formulas when a varies.</li><li>Forgetting to convert km/h to m/s (divide by 3.6).</li><li>Reporting displacement when distance travelled is asked (check where v = 0).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>v = ds/dt, a = dv/dt, a ds = v dv.</li><li>Constant a: three standard equations.</li><li>Stopping distance = reaction distance + v<sup>2</sup>/(2a).</li><li>Distance ≠ displacement when the motion reverses.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(OSP + '3-4-motion-with-constant-acceleration', 'OpenStax 3.4 — Motion with constant acceleration'),
    A(OSP + '3-6-finding-velocity-and-displacement-from-acceleration', 'OpenStax 3.6 — Finding velocity and displacement from acceleration'),
    A(OCW_DYN, 'MIT OCW 2.003SC — Engineering Dynamics'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A train accelerates uniformly from rest to 20 m/s in 40 s. Find a and the distance.</li><li>A tool is dropped from 20 m. How long does it fall and how fast does it hit the ground? (ignore air)</li><li>In Example 2, find the acceleration when the actuator is momentarily at rest the second time.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) a = 0.5 m/s<sup>2</sup>; s = 400 m. 2) t = √(2 × 20/9.81) = 2.02 s; v = √(2 × 9.81 × 20) = 19.8 m/s. 3) t = 3 s ⇒ a = 6 mm/s<sup>2</sup>.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 8 · Bài 8.1</span>
<h2>Động học chất điểm chuyển động thẳng</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Liên hệ vị trí, vận tốc, gia tốc bằng đạo hàm và tích phân.</li><li>Dùng phương trình gia tốc không đổi cho bài toán tăng tốc và phanh.</li><li>Phân biệt độ dời với tổng quãng đường đi được.</li></ul>
<h3>Định nghĩa</h3>
<p><strong>Động học</strong> mô tả chuyển động mà không hỏi nguyên nhân. Với chất điểm chuyển động thẳng có vị trí s(t):</p>
<div class="formula"><span class="lbl">Động học chuyển động thẳng</span>v = ds/dt &nbsp;&nbsp; a = dv/dt = d<sup>2</sup>s/dt<sup>2</sup> &nbsp;&nbsp; a·ds = v·dv</div>
<p>Hệ thức thứ ba (khử thời gian) dùng khi a cho theo vị trí, hoặc khi đề không hỏi thời gian.</p>
<div class="formula"><span class="lbl">Chỉ khi gia tốc không đổi a<sub>c</sub></span>v = v<sub>0</sub> + a<sub>c</sub>t<br>s = s<sub>0</sub> + v<sub>0</sub>t + ½a<sub>c</sub>t<sup>2</sup><br>v<sup>2</sup> = v<sub>0</sub><sup>2</sup> + 2a<sub>c</sub>(s − s<sub>0</sub>)</div>
<h3>✍️ Ví dụ 1 — tăng tốc và phanh ô tô</h3>
<div class="callout"><p><b>(a)</b> Xe tăng tốc từ 0 lên 100 km/h (27,78 m/s) trong 8 s với gia tốc không đổi: a = 27,78/8 = <b>3,47 m/s<sup>2</sup></b> (≈ 0,35 g); quãng đường s = ½ × 3,47 × 8<sup>2</sup> = <b>111 m</b>.</p>
<p><b>(b)</b> Từ 100 km/h người lái phanh với 7 m/s<sup>2</sup> sau thời gian phản xạ 1,0 s. Quãng đường phản xạ = 27,78 × 1,0 = 27,8 m; quãng đường phanh từ v<sup>2</sup> = v<sub>0</sub><sup>2</sup> − 2as ⇒ s = 27,78<sup>2</sup>/(2 × 7) = 55,1 m. <b>Tổng quãng đường dừng ≈ 82,9 m</b>.</p>
<p>Lưu ý: quãng đường phanh tăng theo v<sup>2</sup> — ở 50 km/h chỉ còn một phần tư (13,8 m). Đó là vật lý đằng sau biển giới hạn tốc độ gần trường học.</p></div>
<h3>✍️ Ví dụ 2 — gia tốc thay đổi</h3>
<div class="callout"><p>Vị trí của một xi-lanh điện là s(t) = t<sup>3</sup> − 6t<sup>2</sup> + 9t (s theo mm, t theo s), với 0 ≤ t ≤ 4 s.</p>
<p>v = 3t<sup>2</sup> − 12t + 9 = 3(t − 1)(t − 3) ⇒ v = 0 tại <b>t = 1 s và t = 3 s</b> (đổi chiều). a = 6t − 12 (−12 mm/s<sup>2</sup> tại t = 0, +12 tại t = 4).</p>
<p>Vị trí: s(0) = 0, s(1) = 4, s(3) = 0, s(4) = 4 mm. <b>Độ dời</b> 0 → 4 s = 4 mm, nhưng <b>tổng quãng đường</b> = 4 + 4 + 4 = <b>12 mm</b> (đã kiểm bằng tích phân |v|).</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng công thức gia tốc không đổi khi a thay đổi.</li><li>Quên đổi km/h sang m/s (chia 3,6).</li><li>Trả lời độ dời khi đề hỏi quãng đường (kiểm chỗ v = 0).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>v = ds/dt, a = dv/dt, a ds = v dv.</li><li>a không đổi: ba phương trình chuẩn.</li><li>Quãng đường dừng = quãng đường phản xạ + v<sup>2</sup>/(2a).</li><li>Quãng đường ≠ độ dời khi chuyển động đổi chiều.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(OSP + '3-4-motion-with-constant-acceleration', 'OpenStax 3.4 — Chuyển động với gia tốc không đổi'),
    A(OSP + '3-6-finding-velocity-and-displacement-from-acceleration', 'OpenStax 3.6 — Tìm vận tốc và độ dời từ gia tốc'),
    A(OCW_DYN, 'MIT OCW 2.003SC — Engineering Dynamics'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Tàu tăng tốc đều từ đứng yên lên 20 m/s trong 40 s. Tìm a và quãng đường.</li><li>Một dụng cụ rơi từ độ cao 20 m. Rơi trong bao lâu và chạm đất với vận tốc bao nhiêu? (bỏ qua không khí)</li><li>Trong Ví dụ 2, tìm gia tốc khi xi-lanh dừng tức thời lần thứ hai.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) a = 0,5 m/s<sup>2</sup>; s = 400 m. 2) t = √(2 × 20/9,81) = 2,02 s; v = √(2 × 9,81 × 20) = 19,8 m/s. 3) t = 3 s ⇒ a = 6 mm/s<sup>2</sup>.</p></div>`);

const c82 = L('emm201c-ts-8-2',
  '8.2 — Curvilinear motion: projectiles and normal–tangential components|||8.2 — Chuyển động cong: vật ném và thành phần pháp tuyến – tiếp tuyến',
  'Chuyển động cong trong toạ độ x–y; chuyển động ném: tầm xa, độ cao cực đại, thời gian bay; toạ độ tự nhiên n–t: a_t = dv/dt, a_n = v²/ρ; ô tô vào cua.',
  `<span class="eyebrow">EMM201c · Chapter 8 · Lesson 8.2</span>
<h2>Curvilinear motion: projectiles and n–t components</h2>
<h3>🎯 Objectives</h3>
<ul><li>Treat projectile motion as two independent rectilinear motions.</li><li>Use normal and tangential components of acceleration for motion along a curved path.</li><li>Apply a<sub>n</sub> = v<sup>2</sup>/ρ to vehicles on curves.</li></ul>
<h3>Rectangular components and projectiles</h3>
<p>In the x–y plane the position vector r = x i + y j gives v = ẋ i + ẏ j and a = ẍ i + ÿ j. For a <strong>projectile</strong> (air resistance neglected), a<sub>x</sub> = 0 and a<sub>y</sub> = −g: horizontal motion at constant speed, vertical motion with constant acceleration.</p>
<div class="formula"><span class="lbl">Projectile launched from the ground at v<sub>0</sub>, angle θ</span>x = v<sub>0</sub>cos θ · t &nbsp;&nbsp; y = v<sub>0</sub>sin θ · t − ½gt<sup>2</sup><br>Time of flight T = 2v<sub>0</sub>sin θ/g &nbsp; Range R = v<sub>0</sub><sup>2</sup> sin 2θ/g &nbsp; Max height H = (v<sub>0</sub>sin θ)<sup>2</sup>/(2g)</div>
<div class="callout"><p><b>Example 1.</b> A ball-throwing robot launches at v<sub>0</sub> = 20 m/s, θ = 30°. T = 2 × 20 × 0.5/9.81 = <b>2.04 s</b>; R = 400 × sin 60°/9.81 = <b>35.3 m</b>; H = 10<sup>2</sup>/(2 × 9.81) = <b>5.10 m</b>. The maximum range (θ = 45°) would be 400/9.81 = 40.8 m.</p></div>
<h3>Normal and tangential components</h3>
<p>For motion along a known curved path (a car on a bend, a cam follower, a point on a rotating link), use axes that move with the particle: <b>t</b> tangent to the path (direction of v) and <b>n</b> toward the centre of curvature.</p>
<div class="formula"><span class="lbl">n–t components</span>a<sub>t</sub> = dv/dt &nbsp;(changes the speed)<br>a<sub>n</sub> = v<sup>2</sup>/ρ &nbsp;(changes the direction; ρ = radius of curvature)<br>|a| = √(a<sub>t</sub><sup>2</sup> + a<sub>n</sub><sup>2</sup>)</div>
<p>Even at <em>constant speed</em> a body on a curve accelerates toward the centre. That acceleration must be supplied by a force — for a car, tyre friction (Chapter 9).</p>
<div class="callout"><p><b>Example 2.</b> A car drives at 72 km/h (20 m/s) on a curve of radius 50 m and brakes at 3 m/s<sup>2</sup>. a<sub>n</sub> = 20<sup>2</sup>/50 = <b>8.0 m/s<sup>2</sup></b>; a<sub>t</sub> = −3 m/s<sup>2</sup>; |a| = √(64 + 9) = <b>8.54 m/s<sup>2</sup></b> (0.87 g) — close to the grip limit of a dry road. Braking hard in a bend can make the tyres slide.</p></div>
<div class="callout"><p><b>Example 3 — design speed.</b> If the tyres can provide at most 0.8 g of lateral acceleration on a 100 m radius curve: v<sub>max</sub> = √(0.8 × 9.81 × 100) = <b>28.0 m/s ≈ 101 km/h</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Giving the projectile a horizontal acceleration.</li><li>Thinking constant speed means zero acceleration on a curve.</li><li>Using the diameter instead of the radius of curvature.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Projectile: x uniform, y uniformly accelerated (−g).</li><li>R = v<sub>0</sub><sup>2</sup>sin 2θ/g; maximum at 45° (on level ground).</li><li>a<sub>t</sub> = dv/dt, a<sub>n</sub> = v<sup>2</sup>/ρ.</li><li>Lateral acceleration limit sets curve speed.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(OSP + '4-3-projectile-motion', 'OpenStax 4.3 — Projectile motion'),
    A(OSP + '4-4-uniform-circular-motion', 'OpenStax 4.4 — Uniform and nonuniform circular motion'),
    A(WK + 'Projectile_motion', 'Wikipedia — Projectile motion'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>Find the range of a projectile launched at 20 m/s and 45°.</li><li>A motorcycle at 15 m/s on a 30 m radius bend. Find a<sub>n</sub>.</li><li>At what speed is a<sub>n</sub> = 4 m/s<sup>2</sup> on a 64 m radius curve?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 400/9.81 = 40.8 m. 2) 225/30 = 7.5 m/s<sup>2</sup>. 3) v = √(4 × 64) = 16 m/s (57.6 km/h).</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 8 · Bài 8.2</span>
<h2>Chuyển động cong: vật ném và thành phần n–t</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Xem chuyển động ném như hai chuyển động thẳng độc lập.</li><li>Dùng thành phần pháp tuyến và tiếp tuyến của gia tốc cho chuyển động trên quỹ đạo cong.</li><li>Áp dụng a<sub>n</sub> = v<sup>2</sup>/ρ cho xe vào cua.</li></ul>
<h3>Thành phần Descartes và vật ném</h3>
<p>Trong mặt phẳng x–y, vector vị trí r = x i + y j cho v = ẋ i + ẏ j và a = ẍ i + ÿ j. Với <strong>vật ném</strong> (bỏ qua sức cản không khí), a<sub>x</sub> = 0 và a<sub>y</sub> = −g: theo phương ngang chuyển động đều, theo phương đứng chuyển động gia tốc không đổi.</p>
<div class="formula"><span class="lbl">Vật ném từ mặt đất với v<sub>0</sub>, góc θ</span>x = v<sub>0</sub>cos θ · t &nbsp;&nbsp; y = v<sub>0</sub>sin θ · t − ½gt<sup>2</sup><br>Thời gian bay T = 2v<sub>0</sub>sin θ/g &nbsp; Tầm xa R = v<sub>0</sub><sup>2</sup> sin 2θ/g &nbsp; Độ cao cực đại H = (v<sub>0</sub>sin θ)<sup>2</sup>/(2g)</div>
<div class="callout"><p><b>Ví dụ 1.</b> Robot ném bóng phóng với v<sub>0</sub> = 20 m/s, θ = 30°. T = 2 × 20 × 0,5/9,81 = <b>2,04 s</b>; R = 400 × sin 60°/9,81 = <b>35,3 m</b>; H = 10<sup>2</sup>/(2 × 9,81) = <b>5,10 m</b>. Tầm xa lớn nhất (θ = 45°) là 400/9,81 = 40,8 m.</p></div>
<h3>Thành phần pháp tuyến và tiếp tuyến</h3>
<p>Với chuyển động trên quỹ đạo cong đã biết (xe trên khúc cua, cần đẩy cam, một điểm trên khâu quay), dùng trục đi theo chất điểm: <b>t</b> tiếp tuyến với quỹ đạo (phương của v) và <b>n</b> hướng về tâm cong.</p>
<div class="formula"><span class="lbl">Thành phần n–t</span>a<sub>t</sub> = dv/dt &nbsp;(làm đổi độ lớn vận tốc)<br>a<sub>n</sub> = v<sup>2</sup>/ρ &nbsp;(làm đổi phương; ρ = bán kính cong)<br>|a| = √(a<sub>t</sub><sup>2</sup> + a<sub>n</sub><sup>2</sup>)</div>
<p>Ngay cả khi tốc độ <em>không đổi</em>, vật trên đường cong vẫn có gia tốc hướng tâm. Gia tốc đó phải do một lực cung cấp — với ô tô là ma sát lốp (Chương 9).</p>
<div class="callout"><p><b>Ví dụ 2.</b> Ô tô chạy 72 km/h (20 m/s) trên khúc cua bán kính 50 m và phanh với 3 m/s<sup>2</sup>. a<sub>n</sub> = 20<sup>2</sup>/50 = <b>8,0 m/s<sup>2</sup></b>; a<sub>t</sub> = −3 m/s<sup>2</sup>; |a| = √(64 + 9) = <b>8,54 m/s<sup>2</sup></b> (0,87 g) — gần giới hạn bám của đường khô. Phanh gấp trong cua có thể làm lốp trượt.</p></div>
<div class="callout"><p><b>Ví dụ 3 — tốc độ thiết kế.</b> Nếu lốp chỉ tạo được tối đa 0,8 g gia tốc ngang trên khúc cua bán kính 100 m: v<sub>max</sub> = √(0,8 × 9,81 × 100) = <b>28,0 m/s ≈ 101 km/h</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cho vật ném có gia tốc ngang.</li><li>Nghĩ rằng tốc độ không đổi thì gia tốc bằng 0 trên đường cong.</li><li>Dùng đường kính thay cho bán kính cong.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Vật ném: x đều, y biến đổi đều (−g).</li><li>R = v<sub>0</sub><sup>2</sup>sin 2θ/g; lớn nhất ở 45° (trên mặt phẳng ngang).</li><li>a<sub>t</sub> = dv/dt, a<sub>n</sub> = v<sup>2</sup>/ρ.</li><li>Giới hạn gia tốc ngang quyết định tốc độ vào cua.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(OSP + '4-3-projectile-motion', 'OpenStax 4.3 — Chuyển động ném'),
    A(OSP + '4-4-uniform-circular-motion', 'OpenStax 4.4 — Chuyển động tròn đều và không đều'),
    A(WK + 'Projectile_motion', 'Wikipedia — Chuyển động ném'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm tầm xa của vật ném với 20 m/s ở góc 45°.</li><li>Mô tô chạy 15 m/s qua khúc cua bán kính 30 m. Tìm a<sub>n</sub>.</li><li>Ở tốc độ nào thì a<sub>n</sub> = 4 m/s<sup>2</sup> trên khúc cua bán kính 64 m?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 400/9,81 = 40,8 m. 2) 225/30 = 7,5 m/s<sup>2</sup>. 3) v = √(4 × 64) = 16 m/s (57,6 km/h).</p></div>`);

const c83 = L('emm201c-ts-8-3',
  '8.3 — Rigid-body rotation, rolling and velocity ratios of drives|||8.3 — Chuyển động quay vật rắn, lăn và tỉ số truyền',
  'Quay quanh trục cố định: θ, ω, α; v = ωr, a_t = αr, a_n = ω²r; gia tốc góc không đổi; lăn không trượt v = ωr; tỉ số truyền bánh răng, đai; hộp số hai cấp; khớp robot.',
  `<span class="eyebrow">EMM201c · Chapter 8 · Lesson 8.3</span>
<h2>Rigid-body rotation, rolling and velocity ratios</h2>
<h3>🎯 Objectives</h3>
<ul><li>Describe rotation about a fixed axis with θ, ω and α.</li><li>Relate angular and linear velocity/acceleration of points on a rotating body.</li><li>Compute speed ratios of gear trains and belt drives.</li></ul>
<h3>Rotation about a fixed axis</h3>
<p>Every point of a rigid body rotating about a fixed axis moves on a circle. The angular position θ (rad), angular velocity ω = dθ/dt (rad/s) and angular acceleration α = dω/dt (rad/s<sup>2</sup>) are the same for all points. Constant α gives the same equations as lesson 8.1 with (s, v, a) → (θ, ω, α).</p>
<div class="formula"><span class="lbl">Point at radius r</span>v = ω·r &nbsp;&nbsp; a<sub>t</sub> = α·r &nbsp;&nbsp; a<sub>n</sub> = ω<sup>2</sup>·r<br>Speed conversion: ω = 2πn/60 &nbsp;(n in rpm)</div>
<div class="callout"><p><b>Example 1 — motor and pulley.</b> A motor runs at 1450 rpm: ω = 2π × 1450/60 = <b>151.8 rad/s</b>. A 100 mm pulley on it gives a belt speed v = 151.8 × 0.05 = <b>7.59 m/s</b>; a point on its rim has a<sub>n</sub> = 151.8<sup>2</sup> × 0.05 = 1153 m/s<sup>2</sup> (≈ 118 g!) — the reason why unbalanced rotors vibrate so badly.</p>
<p>If the motor reaches 1450 rpm from rest in 2 s with constant α: α = 151.8/2 = <b>75.9 rad/s<sup>2</sup></b>; turns made = ½ ω t/(2π) = <b>24.2 revolutions</b>.</p></div>
<h3>Rolling without slipping</h3>
<p>A wheel of radius r rolling without slipping has its centre moving at v = ω·r, and the contact point is momentarily at rest (instantaneous centre of zero velocity). A car at 72 km/h (20 m/s) with 0.30 m wheels: ω = 20/0.3 = <b>66.7 rad/s ≈ 637 rpm</b>.</p>
<h3>Velocity ratios of drives</h3>
<p>Two gears in mesh have the same pitch-line speed: ω<sub>1</sub>r<sub>1</sub> = ω<sub>2</sub>r<sub>2</sub>. Since radius is proportional to the number of teeth z:</p>
<div class="formula"><span class="lbl">Gear and belt ratios</span>Single pair: i = n<sub>1</sub>/n<sub>2</sub> = z<sub>2</sub>/z<sub>1</sub> (external gears reverse direction)<br>Train: i<sub>total</sub> = i<sub>1</sub>·i<sub>2</sub>·… = (product of driven teeth)/(product of driving teeth)<br>Belt (no slip): n<sub>1</sub>/n<sub>2</sub> = d<sub>2</sub>/d<sub>1</sub></div>
<div class="callout"><p><b>Example 2 — two-stage gearbox.</b> z<sub>1</sub> = 20 drives z<sub>2</sub> = 60; z<sub>3</sub> = 18 (on the same shaft as z<sub>2</sub>) drives z<sub>4</sub> = 72. i = (60/20)(72/18) = 3 × 4 = <b>12</b>. With a 1450 rpm input the output turns at <b>120.8 rpm</b>, in the same direction as the input (two external meshes). Ignoring losses, output torque is 12 times input torque (Chapter 9).</p></div>
<div class="callout"><p><b>Example 3 — robot joint.</b> A 3000 rpm servo motor drives a 100:1 harmonic gear: joint speed = 30 rpm = 3.14 rad/s; a gripper 0.8 m from the joint moves at 3.14 × 0.8 = <b>2.51 m/s</b>.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using rpm in v = ωr.</li><li>Inverting a gear ratio: the larger gear turns <em>slower</em>.</li><li>Forgetting that idler gears change direction but not the ratio.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>v = ωr, a<sub>t</sub> = αr, a<sub>n</sub> = ω<sup>2</sup>r; ω = 2πn/60.</li><li>Rolling: v<sub>centre</sub> = ωr, contact point at rest.</li><li>Gear ratio = z<sub>driven</sub>/z<sub>driver</sub>; trains multiply.</li><li>Belt ratio = d<sub>driven</sub>/d<sub>driver</sub>.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(OSP + '10-1-rotational-variables', 'OpenStax 10.1 — Rotational variables'),
    A(OSP + '10-3-relating-angular-and-translational-quantities', 'OpenStax 10.3 — Relating angular and translational quantities'),
    A(OSP + '11-1-rolling-motion', 'OpenStax 11.1 — Rolling motion'),
    A(WK + 'Gear_train', 'Wikipedia — Gear train'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A 25-tooth pinion at 960 rpm drives a 75-tooth gear. Output speed?</li><li>A flywheel slows uniformly from 600 rpm to rest in 10 s. Find α and the number of turns.</li><li>A 0.65 m-diameter wheel turns at 500 rpm without slipping. Vehicle speed in km/h?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 960 × 25/75 = 320 rpm. 2) ω<sub>0</sub> = 62.8 rad/s ⇒ α = −6.28 rad/s<sup>2</sup>; θ = ½ × 62.8 × 10 = 314 rad = 50 turns. 3) v = (2π × 500/60) × 0.325 = 17.0 m/s = 61.3 km/h.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 8 · Bài 8.3</span>
<h2>Chuyển động quay vật rắn, lăn và tỉ số truyền</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Mô tả chuyển động quay quanh trục cố định bằng θ, ω, α.</li><li>Liên hệ vận tốc, gia tốc góc và dài của các điểm trên vật quay.</li><li>Tính tỉ số truyền của hộp bánh răng và bộ truyền đai.</li></ul>
<h3>Quay quanh trục cố định</h3>
<p>Mọi điểm của vật rắn quay quanh trục cố định đều chuyển động trên đường tròn. Góc quay θ (rad), vận tốc góc ω = dθ/dt (rad/s) và gia tốc góc α = dω/dt (rad/s<sup>2</sup>) như nhau cho mọi điểm. α không đổi cho cùng các phương trình như bài 8.1 với (s, v, a) → (θ, ω, α).</p>
<div class="formula"><span class="lbl">Điểm ở bán kính r</span>v = ω·r &nbsp;&nbsp; a<sub>t</sub> = α·r &nbsp;&nbsp; a<sub>n</sub> = ω<sup>2</sup>·r<br>Đổi tốc độ: ω = 2πn/60 &nbsp;(n theo vòng/phút)</div>
<div class="callout"><p><b>Ví dụ 1 — động cơ và puli.</b> Động cơ quay 1450 vòng/phút: ω = 2π × 1450/60 = <b>151,8 rad/s</b>. Puli 100 mm lắp trên trục cho vận tốc đai v = 151,8 × 0,05 = <b>7,59 m/s</b>; một điểm trên vành puli có a<sub>n</sub> = 151,8<sup>2</sup> × 0,05 = 1153 m/s<sup>2</sup> (≈ 118 g!) — lý do rôto mất cân bằng rung rất mạnh.</p>
<p>Nếu động cơ đạt 1450 vòng/phút từ đứng yên trong 2 s với α không đổi: α = 151,8/2 = <b>75,9 rad/s<sup>2</sup></b>; số vòng quay được = ½ ω t/(2π) = <b>24,2 vòng</b>.</p></div>
<h3>Lăn không trượt</h3>
<p>Bánh xe bán kính r lăn không trượt có tâm chuyển động với v = ω·r, và điểm tiếp xúc đứng yên tức thời (tâm vận tốc tức thời). Ô tô chạy 72 km/h (20 m/s) với bánh xe 0,30 m: ω = 20/0,3 = <b>66,7 rad/s ≈ 637 vòng/phút</b>.</p>
<h3>Tỉ số truyền</h3>
<p>Hai bánh răng ăn khớp có cùng vận tốc trên vòng lăn: ω<sub>1</sub>r<sub>1</sub> = ω<sub>2</sub>r<sub>2</sub>. Vì bán kính tỉ lệ với số răng z:</p>
<div class="formula"><span class="lbl">Tỉ số truyền bánh răng và đai</span>Một cặp: i = n<sub>1</sub>/n<sub>2</sub> = z<sub>2</sub>/z<sub>1</sub> (ăn khớp ngoài đổi chiều quay)<br>Hộp nhiều cấp: i<sub>tổng</sub> = i<sub>1</sub>·i<sub>2</sub>·… = (tích số răng bánh bị dẫn)/(tích số răng bánh dẫn)<br>Đai (không trượt): n<sub>1</sub>/n<sub>2</sub> = d<sub>2</sub>/d<sub>1</sub></div>
<div class="callout"><p><b>Ví dụ 2 — hộp số hai cấp.</b> z<sub>1</sub> = 20 dẫn z<sub>2</sub> = 60; z<sub>3</sub> = 18 (cùng trục với z<sub>2</sub>) dẫn z<sub>4</sub> = 72. i = (60/20)(72/18) = 3 × 4 = <b>12</b>. Với đầu vào 1450 vòng/phút, đầu ra quay <b>120,8 vòng/phút</b>, cùng chiều đầu vào (hai lần ăn khớp ngoài). Bỏ qua tổn thất, mômen ra gấp 12 lần mômen vào (Chương 9).</p></div>
<div class="callout"><p><b>Ví dụ 3 — khớp robot.</b> Động cơ servo 3000 vòng/phút dẫn bộ giảm tốc sóng (harmonic) 100:1: tốc độ khớp = 30 vòng/phút = 3,14 rad/s; tay gắp cách khớp 0,8 m chuyển động với 3,14 × 0,8 = <b>2,51 m/s</b>.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng vòng/phút trong v = ωr.</li><li>Đảo ngược tỉ số truyền: bánh lớn quay <em>chậm</em> hơn.</li><li>Quên rằng bánh răng trung gian đổi chiều quay nhưng không đổi tỉ số.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>v = ωr, a<sub>t</sub> = αr, a<sub>n</sub> = ω<sup>2</sup>r; ω = 2πn/60.</li><li>Lăn: v<sub>tâm</sub> = ωr, điểm tiếp xúc đứng yên.</li><li>Tỉ số bánh răng = z<sub>bị dẫn</sub>/z<sub>dẫn</sub>; nhiều cấp thì nhân.</li><li>Tỉ số đai = d<sub>bị dẫn</sub>/d<sub>dẫn</sub>.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(OSP + '10-1-rotational-variables', 'OpenStax 10.1 — Các đại lượng quay'),
    A(OSP + '10-3-relating-angular-and-translational-quantities', 'OpenStax 10.3 — Liên hệ đại lượng góc và dài'),
    A(OSP + '11-1-rolling-motion', 'OpenStax 11.1 — Chuyển động lăn'),
    A(WK + 'Gear_train', 'Wikipedia — Hệ bánh răng'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Bánh nhỏ 25 răng quay 960 vòng/phút dẫn bánh 75 răng. Tốc độ ra?</li><li>Bánh đà giảm tốc đều từ 600 vòng/phút về 0 trong 10 s. Tìm α và số vòng quay.</li><li>Bánh xe đường kính 0,65 m quay 500 vòng/phút không trượt. Vận tốc xe theo km/h?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 960 × 25/75 = 320 vòng/phút. 2) ω<sub>0</sub> = 62,8 rad/s ⇒ α = −6,28 rad/s<sup>2</sup>; θ = ½ × 62,8 × 10 = 314 rad = 50 vòng. 3) v = (2π × 500/60) × 0,325 = 17,0 m/s = 61,3 km/h.</p></div>`);

const q8 = QZ(8, 'Quiz — Chapter 8: Kinematics of particles and rotating bodies|||Quiz — Chương 8: Động học chất điểm và vật quay', 'Kiểm tra chương 8: v = ds/dt, gia tốc không đổi, quãng đường phanh, vật ném, gia tốc pháp tuyến, chuyển động quay, lăn, tỉ số truyền.', [
  Q('q1', '100 km/h equals about|||100 km/h xấp xỉ bằng',
    ['36 m/s|||36 m/s', '27.8 m/s|||27,8 m/s', '10 m/s|||10 m/s', '360 m/s|||360 m/s'], 1,
    'Divide by 3.6.|||Chia cho 3,6.'),
  Q('q2', 'If speed doubles, the braking distance at the same deceleration|||Nếu tốc độ tăng gấp đôi, quãng đường phanh với cùng gia tốc hãm',
    ['doubles|||gấp đôi', 'quadruples|||gấp bốn', 'stays the same|||không đổi', 'halves|||giảm một nửa'], 1,
    's = v²/(2a).|||s = v²/(2a).'),
  Q('q3', 'For s = t³ − 6t² + 9t, the velocity is zero at|||Với s = t³ − 6t² + 9t, vận tốc bằng 0 tại',
    ['t = 0 and 3|||t = 0 và 3', 't = 1 and 3|||t = 1 và 3', 't = 2|||t = 2', 'never|||không bao giờ'], 1,
    'v = 3(t − 1)(t − 3).|||v = 3(t − 1)(t − 3).'),
  Q('q4', 'A projectile (no air) has horizontal acceleration|||Vật ném (không khí bỏ qua) có gia tốc ngang',
    ['g|||g', '0|||0', '−g|||−g', 'g cos θ|||g cos θ'], 1,
    'Only gravity acts, vertically.|||Chỉ có trọng lực, theo phương đứng.'),
  Q('q5', 'On level ground the maximum range is reached at a launch angle of|||Trên mặt ngang, tầm xa lớn nhất đạt khi góc ném bằng',
    ['30°|||30°', '45°|||45°', '60°|||60°', '90°|||90°'], 1,
    'sin 2θ is maximum at θ = 45°.|||sin 2θ lớn nhất tại θ = 45°.'),
  Q('q6', 'A car at constant 20 m/s on a 100 m radius curve has an acceleration of|||Ô tô chạy đều 20 m/s trên khúc cua bán kính 100 m có gia tốc',
    ['0|||0', '4 m/s² toward the centre|||4 m/s² hướng tâm', '0.2 m/s²|||0,2 m/s²', '2000 m/s²|||2000 m/s²'], 1,
    'a_n = v²/ρ = 400/100.|||a_n = v²/ρ = 400/100.'),
  Q('q7', '1450 rpm in rad/s is about|||1450 vòng/phút theo rad/s xấp xỉ',
    ['24.2|||24,2', '151.8|||151,8', '9110|||9110', '1450|||1450'], 1,
    'ω = 2π × 1450/60.|||ω = 2π × 1450/60.'),
  Q('q8', 'The speed of a point at radius r on a body rotating at ω is|||Vận tốc của điểm ở bán kính r trên vật quay với ω là',
    ['ω/r|||ω/r', 'ω·r|||ω·r', 'ω²·r|||ω²·r', 'r/ω|||r/ω'], 1,
    'v = ωr; ω²r is the normal acceleration.|||v = ωr; ω²r là gia tốc pháp tuyến.'),
  Q('q9', 'A 20-tooth gear drives a 60-tooth gear, which drives (on the same shaft) an 18-tooth gear meshing with a 72-tooth gear. Total ratio:|||Bánh 20 răng dẫn bánh 60 răng; trên cùng trục, bánh 18 răng ăn khớp bánh 72 răng. Tỉ số tổng:',
    ['7|||7', '12|||12', '3|||3', '4|||4'], 1,
    '(60/20)(72/18) = 3 × 4.|||(60/20)(72/18) = 3 × 4.'),
  Q('q10', 'For a wheel rolling without slipping, the contact point has velocity|||Bánh xe lăn không trượt, điểm tiếp xúc có vận tốc',
    ['2v|||2v', 'v|||v', 'zero|||bằng 0', 'ωr/2|||ωr/2'], 2,
    'It is the instantaneous centre of zero velocity.|||Đó là tâm vận tốc tức thời.'),
]);

const ch8 = {
  title: 'Chapter 8 — Kinematics: particles, curvilinear motion and rotation|||Chương 8 — Động học: chất điểm, chuyển động cong và chuyển động quay',
  description: 'Chuyển động thẳng (gia tốc không đổi và thay đổi), vật ném, thành phần n–t, quay vật rắn, lăn không trượt, tỉ số truyền bánh răng/đai (Hibbeler Dynamics ch.12, 16).',
  lessons: [c81, c82, c83, q8],
};

// ───────────────────────────── Chương 9 ─────────────────────────────
const c91 = L('emm201c-ts-9-1',
  '9.1 — Newton\'s second law for particles and rotating bodies|||9.1 — Định luật 2 Newton cho chất điểm và vật quay',
  'ΣF = m·a với sơ đồ vật tự do và sơ đồ động; phanh ô tô và ma sát cần thiết; thang máy; xe vào cua; vật quay ΣM = I·α; mômen quán tính khối lượng; mômen khớp robot.',
  `<span class="eyebrow">EMM201c · Chapter 9 · Lesson 9.1</span>
<h2>Newton's second law for particles and rotating bodies</h2>
<h3>🎯 Objectives</h3>
<ul><li>Write ΣF = m·a with a free-body diagram and a kinetic diagram.</li><li>Solve braking, lifting and cornering problems.</li><li>Use ΣM = I·α for rotation about a fixed axis and size a motor torque.</li></ul>
<h3>Equation of motion</h3>
<p>Kinetics links motion to its causes. For a particle (or the mass centre of any body):</p>
<div class="formula"><span class="lbl">Newton's second law</span>ΣF = m·a &nbsp;&nbsp; in components: ΣF<sub>x</sub> = m a<sub>x</sub>, ΣF<sub>y</sub> = m a<sub>y</sub> &nbsp;or&nbsp; ΣF<sub>t</sub> = m a<sub>t</sub>, ΣF<sub>n</sub> = m v<sup>2</sup>/ρ</div>
<p>Method: draw the <strong>FBD</strong> (all forces) and next to it the <strong>kinetic diagram</strong> (the vector m·a). Equate components. Choose axes along and perpendicular to the acceleration.</p>
<h3>✍️ Examples — particles</h3>
<div class="callout"><p><b>Example 1 — braking.</b> A 1200 kg car brakes at 7 m/s<sup>2</sup> on a level road. Horizontal: F = m a = 1200 × 7 = <b>8400 N</b> of friction at the tyres. Vertical: N = mg = 11 772 N. Required friction coefficient μ ≥ 8400/11 772 = <b>0.71</b> — achievable on dry asphalt, not on a wet road.</p>
<p><b>Example 2 — lift.</b> An 800 kg lift cabin accelerates upward at 1.5 m/s<sup>2</sup>. T − mg = m a ⇒ T = 800(9.81 + 1.5) = <b>9048 N</b> — 15 % more than the static weight. Cables and motors are sized for the accelerating case.</p>
<p><b>Example 3 — cornering.</b> The same car at 20 m/s on a flat 50 m-radius curve needs a lateral friction force m v<sup>2</sup>/ρ = 1200 × 400/50 = <b>9600 N</b>, i.e. μ ≥ 0.82.</p></div>
<h3>Rotation about a fixed axis</h3>
<div class="formula"><span class="lbl">Rotational equation of motion</span>ΣM<sub>O</sub> = I<sub>O</sub>·α &nbsp;&nbsp; I = ∫ r<sup>2</sup> dm &nbsp;[kg·m<sup>2</sup>]<br>Point mass: I = m r<sup>2</sup>; solid disc/cylinder about its axis: I = ½ m r<sup>2</sup>; slender rod about its end: I = ⅓ m L<sup>2</sup>; parallel axis: I = I<sub>G</sub> + m d<sup>2</sup></div>
<div class="callout"><p><b>Example 4 — flywheel.</b> A solid steel disc, m = 50 kg, r = 0.3 m: I = ½ × 50 × 0.3<sup>2</sup> = <b>2.25 kg·m<sup>2</sup></b>. A motor torque of 20 N·m gives α = 20/2.25 = <b>8.89 rad/s<sup>2</sup></b>.</p>
<p><b>Example 5 — robot joint torque.</b> A horizontal arm carries a 5 kg payload 0.8 m from the joint (treat it as a point mass; arm mass neglected). I = 5 × 0.8<sup>2</sup> = 3.2 kg·m<sup>2</sup>. To start lifting with α = 5 rad/s<sup>2</sup>: T = I α + m g r = 16 + 39.2 = <b>55.2 N·m</b> at the joint. Static holding (lesson 2.3) is only part of the motor requirement.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Putting "m a" on the FBD as if it were a force.</li><li>Using the area moment of inertia (mm<sup>4</sup>) instead of the mass moment (kg·m<sup>2</sup>).</li><li>Forgetting gravity's moment when a link rotates in a vertical plane.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>ΣF = m a; FBD + kinetic diagram.</li><li>Friction limits braking and cornering: a ≤ μ g.</li><li>Rotation: ΣM = I α; I = ½ m r<sup>2</sup> (disc), m r<sup>2</sup> (point).</li><li>Motor torque = inertia term + gravity term + friction.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(OSP + '5-3-newtons-second-law', 'OpenStax 5.3 — Newton\'s second law'),
    A(OSP + '6-3-centripetal-force', 'OpenStax 6.3 — Centripetal force'),
    A(OSP + '10-7-newtons-second-law-for-rotation', 'OpenStax 10.7 — Newton\'s second law for rotation'),
    A(OSP + '10-5-calculating-moments-of-inertia', 'OpenStax 10.5 — Calculating moments of inertia'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A 1500 kg car accelerates at 2 m/s<sup>2</sup>. What net driving force is needed?</li><li>An 800 kg lift decelerates at 1.5 m/s<sup>2</sup> while moving up. Cable tension?</li><li>A 2 kg slender rod 1 m long pivots about one end. Find I and the torque for α = 3 rad/s<sup>2</sup> (horizontal plane).</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 3000 N. 2) T = 800(9.81 − 1.5) = 6648 N. 3) I = ⅓ × 2 × 1<sup>2</sup> = 0.667 kg·m<sup>2</sup>; T = 2.0 N·m.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 9 · Bài 9.1</span>
<h2>Định luật 2 Newton cho chất điểm và vật quay</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Viết ΣF = m·a với sơ đồ vật tự do và sơ đồ động.</li><li>Giải bài toán phanh, nâng hạ và vào cua.</li><li>Dùng ΣM = I·α cho vật quay quanh trục cố định và chọn mômen động cơ.</li></ul>
<h3>Phương trình chuyển động</h3>
<p>Động lực học liên hệ chuyển động với nguyên nhân của nó. Với chất điểm (hoặc khối tâm của vật bất kỳ):</p>
<div class="formula"><span class="lbl">Định luật 2 Newton</span>ΣF = m·a &nbsp;&nbsp; theo thành phần: ΣF<sub>x</sub> = m a<sub>x</sub>, ΣF<sub>y</sub> = m a<sub>y</sub> &nbsp;hoặc&nbsp; ΣF<sub>t</sub> = m a<sub>t</sub>, ΣF<sub>n</sub> = m v<sup>2</sup>/ρ</div>
<p>Cách làm: vẽ <strong>FBD</strong> (mọi lực) và bên cạnh là <strong>sơ đồ động</strong> (vector m·a). Cân bằng từng thành phần. Chọn trục dọc và vuông góc với gia tốc.</p>
<h3>✍️ Ví dụ — chất điểm</h3>
<div class="callout"><p><b>Ví dụ 1 — phanh.</b> Ô tô 1200 kg phanh với 7 m/s<sup>2</sup> trên đường bằng. Phương ngang: F = m a = 1200 × 7 = <b>8400 N</b> ma sát tại lốp. Phương đứng: N = mg = 11 772 N. Hệ số ma sát cần μ ≥ 8400/11 772 = <b>0,71</b> — đạt được trên nhựa đường khô, không đạt trên đường ướt.</p>
<p><b>Ví dụ 2 — thang máy.</b> Cabin 800 kg tăng tốc đi lên 1,5 m/s<sup>2</sup>. T − mg = m a ⇒ T = 800(9,81 + 1,5) = <b>9048 N</b> — lớn hơn trọng lượng tĩnh 15 %. Cáp và động cơ được chọn theo trường hợp tăng tốc.</p>
<p><b>Ví dụ 3 — vào cua.</b> Cùng xe đó chạy 20 m/s qua khúc cua bằng bán kính 50 m cần lực ma sát ngang m v<sup>2</sup>/ρ = 1200 × 400/50 = <b>9600 N</b>, tức μ ≥ 0,82.</p></div>
<h3>Chuyển động quay quanh trục cố định</h3>
<div class="formula"><span class="lbl">Phương trình chuyển động quay</span>ΣM<sub>O</sub> = I<sub>O</sub>·α &nbsp;&nbsp; I = ∫ r<sup>2</sup> dm &nbsp;[kg·m<sup>2</sup>]<br>Khối lượng điểm: I = m r<sup>2</sup>; đĩa/trụ đặc quanh trục: I = ½ m r<sup>2</sup>; thanh mảnh quanh một đầu: I = ⅓ m L<sup>2</sup>; trục song song: I = I<sub>G</sub> + m d<sup>2</sup></div>
<div class="callout"><p><b>Ví dụ 4 — bánh đà.</b> Đĩa thép đặc m = 50 kg, r = 0,3 m: I = ½ × 50 × 0,3<sup>2</sup> = <b>2,25 kg·m<sup>2</sup></b>. Mômen động cơ 20 N·m cho α = 20/2,25 = <b>8,89 rad/s<sup>2</sup></b>.</p>
<p><b>Ví dụ 5 — mômen khớp robot.</b> Tay nằm ngang mang tải 5 kg cách khớp 0,8 m (coi là khối lượng điểm; bỏ qua khối lượng tay). I = 5 × 0,8<sup>2</sup> = 3,2 kg·m<sup>2</sup>. Để bắt đầu nâng với α = 5 rad/s<sup>2</sup>: T = I α + m g r = 16 + 39,2 = <b>55,2 N·m</b> tại khớp. Mômen giữ tĩnh (bài 2.3) chỉ là một phần yêu cầu của động cơ.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Vẽ "m a" lên FBD như thể nó là một lực.</li><li>Dùng mômen quán tính diện tích (mm<sup>4</sup>) thay cho mômen quán tính khối lượng (kg·m<sup>2</sup>).</li><li>Quên mômen của trọng lực khi khâu quay trong mặt phẳng đứng.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>ΣF = m a; FBD + sơ đồ động.</li><li>Ma sát giới hạn phanh và vào cua: a ≤ μ g.</li><li>Quay: ΣM = I α; I = ½ m r<sup>2</sup> (đĩa), m r<sup>2</sup> (điểm).</li><li>Mômen động cơ = phần quán tính + phần trọng lực + ma sát.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(OSP + '5-3-newtons-second-law', 'OpenStax 5.3 — Định luật 2 Newton'),
    A(OSP + '6-3-centripetal-force', 'OpenStax 6.3 — Lực hướng tâm'),
    A(OSP + '10-7-newtons-second-law-for-rotation', 'OpenStax 10.7 — Định luật 2 Newton cho chuyển động quay'),
    A(OSP + '10-5-calculating-moments-of-inertia', 'OpenStax 10.5 — Tính mômen quán tính'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Ô tô 1500 kg tăng tốc 2 m/s<sup>2</sup>. Cần lực kéo tổng bao nhiêu?</li><li>Thang máy 800 kg đang đi lên và giảm tốc 1,5 m/s<sup>2</sup>. Lực căng cáp?</li><li>Thanh mảnh 2 kg dài 1 m quay quanh một đầu. Tìm I và mômen để α = 3 rad/s<sup>2</sup> (mặt phẳng ngang).</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 3000 N. 2) T = 800(9,81 − 1,5) = 6648 N. 3) I = ⅓ × 2 × 1<sup>2</sup> = 0,667 kg·m<sup>2</sup>; T = 2,0 N·m.</p></div>`);

const c92 = L('emm201c-ts-9-2',
  '9.2 — Work, energy, power and efficiency|||9.2 — Công, năng lượng, công suất và hiệu suất',
  'Công của lực; động năng tịnh tiến và quay; nguyên lý công – động năng; thế năng trọng trường và đàn hồi; bảo toàn cơ năng; công suất P = F·v = T·ω; hiệu suất nối tiếp; tời nâng.',
  `<span class="eyebrow">EMM201c · Chapter 9 · Lesson 9.2</span>
<h2>Work, energy, power and efficiency</h2>
<h3>🎯 Objectives</h3>
<ul><li>Apply the principle of work and energy, including rotation.</li><li>Use gravitational and elastic potential energy and conservation of energy.</li><li>Compute power and the input power of a drive with several efficiencies in series.</li></ul>
<h3>Work and kinetic energy</h3>
<div class="formula"><span class="lbl">Work and energy</span>Work of a force: U = ∫ F·ds (constant force along the path: U = F s cos θ); of a couple: U = M·Δθ<br>Kinetic energy: T = ½ m v<sup>2</sup> (translation) + ½ I ω<sup>2</sup> (rotation)<br>Principle of work and energy: T<sub>1</sub> + ΣU<sub>1→2</sub> = T<sub>2</sub></div>
<p>Energy methods are ideal when forces depend on position and the question asks for speeds or distances, not time.</p>
<div class="callout"><p><b>Example 1 — stopping distance by energy.</b> A 1200 kg car at 20 m/s (72 km/h): T<sub>1</sub> = ½ × 1200 × 20<sup>2</sup> = <b>240 kJ</b>. Brakes locked, μ<sub>k</sub> = 0.7: friction work −μ m g s = −240 kJ ⇒ s = 20<sup>2</sup>/(2 × 0.7 × 9.81) = <b>29.1 m</b>. All 240 kJ becomes heat in the tyres or brake discs — why brakes are sized thermally as well as mechanically.</p></div>
<h3>Potential energy and conservation</h3>
<div class="formula"><span class="lbl">Potential energy (conservative forces)</span>Gravity: V<sub>g</sub> = m g h &nbsp;&nbsp; Linear spring: V<sub>e</sub> = ½ k s<sup>2</sup><br>If only conservative forces do work: T<sub>1</sub> + V<sub>1</sub> = T<sub>2</sub> + V<sub>2</sub></div>
<div class="callout"><p><b>Example 2 — spring launcher.</b> A spring k = 50 kN/m compressed 0.1 m stores ½ × 50 000 × 0.1<sup>2</sup> = <b>250 J</b>. Released against a 2 kg slider on a smooth guide, it gives v = √(2 × 250/2) = <b>15.8 m/s</b>.</p>
<p><b>Example 3 — flywheel energy.</b> The 2.25 kg·m<sup>2</sup> flywheel of lesson 9.1 at 1450 rpm (151.8 rad/s) stores ½ × 2.25 × 151.8<sup>2</sup> = <b>25.9 kJ</b> — energy that a press or punch can release in one stroke.</p></div>
<h3>Power and efficiency</h3>
<div class="formula"><span class="lbl">Power and efficiency</span>P = dU/dt = F·v (translation) = T·ω (rotation) &nbsp;[W]<br>Efficiency: η = P<sub>out</sub>/P<sub>in</sub>; in series η<sub>total</sub> = η<sub>1</sub>·η<sub>2</sub>·η<sub>3</sub>…</div>
<div class="callout"><p><b>Example 4 — hoist.</b> A hoist lifts 500 kg at a steady 0.5 m/s. Output power P<sub>out</sub> = m g v = 500 × 9.81 × 0.5 = <b>2453 W</b>. With a gearbox (η = 0.95) and an electric motor (η = 0.85): P<sub>in</sub> = 2453/(0.95 × 0.85) = <b>3037 W</b> drawn from the grid. Choose the next standard motor (e.g. 4 kW) to allow for acceleration and starting.</p></div>
<div class="note-ct"><p>Typical efficiencies: one spur-gear stage ≈ 0.97–0.99, worm gear 0.5–0.9, V-belt ≈ 0.95, ball screw ≈ 0.9, Acme screw 0.3–0.5, ball bearing ≈ 0.99 per pair.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Forgetting the rotational kinetic energy of wheels, gears and rotors.</li><li>Adding efficiencies instead of multiplying them.</li><li>Using P = F v with v in km/h.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>T<sub>1</sub> + ΣU = T<sub>2</sub>; T = ½ m v<sup>2</sup> + ½ I ω<sup>2</sup>.</li><li>V<sub>g</sub> = mgh, V<sub>e</sub> = ½ k s<sup>2</sup>; conservation if no friction.</li><li>P = F v = T ω.</li><li>η<sub>total</sub> = product of stage efficiencies.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(OSP + '7-3-work-energy-theorem', 'OpenStax 7.3 — Work-energy theorem'),
    A(OSP + '8-3-conservation-of-energy', 'OpenStax 8.3 — Conservation of energy'),
    A(OSP + '7-4-power', 'OpenStax 7.4 — Power'),
    A(WK + 'Mechanical_efficiency', 'Wikipedia — Mechanical efficiency'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>How much work is needed to lift a 50 kg box 2 m vertically (steady)?</li><li>A conveyor moves 2 t of sand per minute up 6 m. Minimum output power?</li><li>A motor (η = 0.9) drives a gearbox (η = 0.96) delivering 4 kW. Find the electrical input.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) U = mgh = 50 × 9.81 × 2 = 981 J. 2) P = (2000/60) × 9.81 × 6 = 1962 W. 3) 4000/(0.9 × 0.96) = 4630 W.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 9 · Bài 9.2</span>
<h2>Công, năng lượng, công suất và hiệu suất</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng nguyên lý công – động năng, kể cả chuyển động quay.</li><li>Dùng thế năng trọng trường, thế năng đàn hồi và bảo toàn năng lượng.</li><li>Tính công suất và công suất đầu vào của bộ truyền có nhiều hiệu suất nối tiếp.</li></ul>
<h3>Công và động năng</h3>
<div class="formula"><span class="lbl">Công và năng lượng</span>Công của lực: U = ∫ F·ds (lực không đổi dọc đường đi: U = F s cos θ); của ngẫu lực: U = M·Δθ<br>Động năng: T = ½ m v<sup>2</sup> (tịnh tiến) + ½ I ω<sup>2</sup> (quay)<br>Nguyên lý công – động năng: T<sub>1</sub> + ΣU<sub>1→2</sub> = T<sub>2</sub></div>
<p>Phương pháp năng lượng rất hợp khi lực phụ thuộc vị trí và câu hỏi là vận tốc hay quãng đường, không hỏi thời gian.</p>
<div class="callout"><p><b>Ví dụ 1 — quãng đường dừng bằng năng lượng.</b> Ô tô 1200 kg chạy 20 m/s (72 km/h): T<sub>1</sub> = ½ × 1200 × 20<sup>2</sup> = <b>240 kJ</b>. Phanh khoá bánh, μ<sub>k</sub> = 0,7: công ma sát −μ m g s = −240 kJ ⇒ s = 20<sup>2</sup>/(2 × 0,7 × 9,81) = <b>29,1 m</b>. Toàn bộ 240 kJ biến thành nhiệt ở lốp hoặc đĩa phanh — vì vậy phanh được tính cả về nhiệt lẫn cơ.</p></div>
<h3>Thế năng và bảo toàn</h3>
<div class="formula"><span class="lbl">Thế năng (lực thế)</span>Trọng trường: V<sub>g</sub> = m g h &nbsp;&nbsp; Lò xo tuyến tính: V<sub>e</sub> = ½ k s<sup>2</sup><br>Nếu chỉ lực thế sinh công: T<sub>1</sub> + V<sub>1</sub> = T<sub>2</sub> + V<sub>2</sub></div>
<div class="callout"><p><b>Ví dụ 2 — bệ phóng lò xo.</b> Lò xo k = 50 kN/m bị nén 0,1 m tích ½ × 50 000 × 0,1<sup>2</sup> = <b>250 J</b>. Thả ra đẩy con trượt 2 kg trên ray nhẵn, cho v = √(2 × 250/2) = <b>15,8 m/s</b>.</p>
<p><b>Ví dụ 3 — năng lượng bánh đà.</b> Bánh đà 2,25 kg·m<sup>2</sup> ở bài 9.1 quay 1450 vòng/phút (151,8 rad/s) tích ½ × 2,25 × 151,8<sup>2</sup> = <b>25,9 kJ</b> — năng lượng mà máy dập, máy đột có thể giải phóng trong một hành trình.</p></div>
<h3>Công suất và hiệu suất</h3>
<div class="formula"><span class="lbl">Công suất và hiệu suất</span>P = dU/dt = F·v (tịnh tiến) = T·ω (quay) &nbsp;[W]<br>Hiệu suất: η = P<sub>ra</sub>/P<sub>vào</sub>; nối tiếp η<sub>tổng</sub> = η<sub>1</sub>·η<sub>2</sub>·η<sub>3</sub>…</div>
<div class="callout"><p><b>Ví dụ 4 — tời nâng.</b> Tời nâng 500 kg đều với 0,5 m/s. Công suất ra P<sub>ra</sub> = m g v = 500 × 9,81 × 0,5 = <b>2453 W</b>. Qua hộp số (η = 0,95) và động cơ điện (η = 0,85): P<sub>vào</sub> = 2453/(0,95 × 0,85) = <b>3037 W</b> lấy từ lưới. Chọn động cơ chuẩn kế tiếp (ví dụ 4 kW) để dư cho tăng tốc và khởi động.</p></div>
<div class="note-ct"><p>Hiệu suất điển hình: một cấp bánh răng trụ ≈ 0,97–0,99, trục vít – bánh vít 0,5–0,9, đai thang ≈ 0,95, vít me bi ≈ 0,9, vít ren hình thang 0,3–0,5, ổ bi ≈ 0,99 mỗi cặp.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Quên động năng quay của bánh xe, bánh răng và rôto.</li><li>Cộng hiệu suất thay vì nhân.</li><li>Dùng P = F v với v theo km/h.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>T<sub>1</sub> + ΣU = T<sub>2</sub>; T = ½ m v<sup>2</sup> + ½ I ω<sup>2</sup>.</li><li>V<sub>g</sub> = mgh, V<sub>e</sub> = ½ k s<sup>2</sup>; bảo toàn khi không ma sát.</li><li>P = F v = T ω.</li><li>η<sub>tổng</sub> = tích hiệu suất các cấp.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(OSP + '7-3-work-energy-theorem', 'OpenStax 7.3 — Định lý công – động năng'),
    A(OSP + '8-3-conservation-of-energy', 'OpenStax 8.3 — Bảo toàn năng lượng'),
    A(OSP + '7-4-power', 'OpenStax 7.4 — Công suất'),
    A(WK + 'Mechanical_efficiency', 'Wikipedia — Hiệu suất cơ khí'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Cần bao nhiêu công để nâng đều thùng 50 kg lên cao 2 m?</li><li>Băng tải đưa 2 tấn cát mỗi phút lên cao 6 m. Công suất ra tối thiểu?</li><li>Động cơ (η = 0,9) dẫn hộp số (η = 0,96) cho ra 4 kW. Tìm công suất điện vào.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) U = mgh = 50 × 9,81 × 2 = 981 J. 2) P = (2000/60) × 9,81 × 6 = 1962 W. 3) 4000/(0,9 × 0,96) = 4630 W.</p></div>`);

const c93 = L('emm201c-ts-9-3',
  '9.3 — Impulse, momentum and impact|||9.3 — Xung lượng, động lượng và va chạm',
  'Nguyên lý xung lượng – động lượng; lực va đập trung bình; bảo toàn động lượng; va chạm dẻo, đàn hồi, hệ số phục hồi e; tổn thất động năng; ứng dụng an toàn ô tô và robot.',
  `<span class="eyebrow">EMM201c · Chapter 9 · Lesson 9.3</span>
<h2>Impulse, momentum and impact</h2>
<h3>🎯 Objectives</h3>
<ul><li>Apply the principle of linear impulse and momentum.</li><li>Estimate the average force in short impacts.</li><li>Solve central impacts with the coefficient of restitution and compute the energy lost.</li></ul>
<h3>Impulse and momentum</h3>
<div class="formula"><span class="lbl">Linear impulse–momentum</span>m v<sub>1</sub> + Σ∫ F dt = m v<sub>2</sub> &nbsp;&nbsp; average force: F<sub>avg</sub> = m Δv / Δt<br>Linear momentum L = m v [kg·m/s = N·s]</div>
<p>Integrating Newton's law over time is useful when forces act for a short, known time, or when only the time-average force matters (crash, hammer blow, catching a load).</p>
<div class="callout"><p><b>Example 1 — bat and ball.</b> A 0.15 kg ball arrives at 30 m/s and leaves in the opposite direction at 40 m/s after 1.5 ms of contact. Δv = 70 m/s ⇒ F<sub>avg</sub> = 0.15 × 70/0.0015 = <b>7000 N</b> — about 4800 times the ball's weight.</p>
<p><b>Example 2 — why crumple zones work.</b> The momentum change of a car in a crash is fixed by its mass and speed; making the stopping time Δt longer (crumple zones, airbags) reduces the average force in proportion.</p></div>
<h3>Conservation of momentum and impact</h3>
<p>For a system of bodies with no external impulse (internal impact forces cancel by Newton's third law), the total momentum is conserved: m<sub>A</sub>v<sub>A1</sub> + m<sub>B</sub>v<sub>B1</sub> = m<sub>A</sub>v<sub>A2</sub> + m<sub>B</sub>v<sub>B2</sub>. For a central impact we need a second equation, the <strong>coefficient of restitution</strong>:</p>
<div class="formula"><span class="lbl">Coefficient of restitution</span>e = (v<sub>B2</sub> − v<sub>A2</sub>) / (v<sub>A1</sub> − v<sub>B1</sub>) &nbsp;&nbsp; 0 ≤ e ≤ 1<br>e = 1 perfectly elastic (no energy lost); e = 0 perfectly plastic (bodies move together)</div>
<div class="callout"><p><b>Example 3 — plastic collision.</b> A 1500 kg car at 15 m/s hits a stationary 1000 kg car and they move together (e = 0).</p>
<p>Momentum: 1500 × 15 = 2500 v′ ⇒ <b>v′ = 9 m/s</b>.</p>
<p>Kinetic energy before: ½ × 1500 × 15<sup>2</sup> = 168 750 J; after: ½ × 2500 × 9<sup>2</sup> = 101 250 J. <b>Lost: 67 500 J (40 %)</b> — absorbed by deformation of the bodies.</p>
<p>With e = 0.6 instead: v<sub>A2</sub> = (1500 × 15 − 1000 × 0.6 × 15)/2500 = <b>5.4 m/s</b>, v<sub>B2</sub> = 5.4 + 0.6 × 15 = <b>14.4 m/s</b>.</p></div>
<div class="note-ct"><p>For a ball dropped on a hard floor, the rebound height is e<sup>2</sup> times the drop height — a simple way to measure e. Robots that must touch their environment safely (collaborative robots) limit their speed and moving mass so that impact force and energy stay below injury thresholds.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Ignoring the sign (direction) of velocities in momentum equations.</li><li>Assuming kinetic energy is conserved in every collision.</li><li>Including an external force that is negligible during the very short impact (or neglecting one that is not).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>m v<sub>1</sub> + ∫F dt = m v<sub>2</sub>; F<sub>avg</sub> = m Δv/Δt.</li><li>Longer stopping time ⇒ smaller force.</li><li>No external impulse ⇒ total momentum conserved.</li><li>e links separation and approach speeds; e &lt; 1 ⇒ energy lost.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(OSP + '9-2-impulse-and-collisions', 'OpenStax 9.2 — Impulse and collisions'),
    A(OSP + '9-3-conservation-of-linear-momentum', 'OpenStax 9.3 — Conservation of linear momentum'),
    A(OSP + '9-4-types-of-collisions', 'OpenStax 9.4 — Types of collisions'),
    A(WK + 'Coefficient_of_restitution', 'Wikipedia — Coefficient of restitution'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A 1 kg hammer at 5 m/s stops on a nail in 2 ms. Average force?</li><li>A ball dropped from 2 m with e = 0.5. Rebound height?</li><li>Two 1000 kg carts, one at 4 m/s and one at rest, couple together. Final speed and energy lost?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 1 × 5/0.002 = 2500 N. 2) e<sup>2</sup> × 2 = 0.5 m. 3) v′ = 2 m/s; KE 8000 J → 4000 J ⇒ 4000 J lost (50 %).</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 9 · Bài 9.3</span>
<h2>Xung lượng, động lượng và va chạm</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Áp dụng nguyên lý xung lượng – động lượng.</li><li>Ước lượng lực trung bình trong va đập ngắn.</li><li>Giải bài toán va chạm xuyên tâm với hệ số phục hồi và tính năng lượng mất.</li></ul>
<h3>Xung lượng và động lượng</h3>
<div class="formula"><span class="lbl">Xung lượng – động lượng</span>m v<sub>1</sub> + Σ∫ F dt = m v<sub>2</sub> &nbsp;&nbsp; lực trung bình: F<sub>tb</sub> = m Δv / Δt<br>Động lượng L = m v [kg·m/s = N·s]</div>
<p>Tích phân định luật Newton theo thời gian rất có ích khi lực tác dụng trong thời gian ngắn đã biết, hoặc khi chỉ cần lực trung bình theo thời gian (va chạm, cú búa, đỡ tải rơi).</p>
<div class="callout"><p><b>Ví dụ 1 — gậy và bóng.</b> Bóng 0,15 kg tới với 30 m/s và bật ngược lại 40 m/s sau 1,5 ms tiếp xúc. Δv = 70 m/s ⇒ F<sub>tb</sub> = 0,15 × 70/0,0015 = <b>7000 N</b> — khoảng 4800 lần trọng lượng quả bóng.</p>
<p><b>Ví dụ 2 — vì sao vùng biến dạng có tác dụng.</b> Độ thay đổi động lượng của xe khi đâm cố định theo khối lượng và vận tốc; kéo dài thời gian dừng Δt (vùng biến dạng, túi khí) làm lực trung bình giảm theo tỉ lệ.</p></div>
<h3>Bảo toàn động lượng và va chạm</h3>
<p>Với hệ vật không có xung lượng ngoài (lực va chạm nội bộ triệt tiêu theo định luật 3 Newton), tổng động lượng được bảo toàn: m<sub>A</sub>v<sub>A1</sub> + m<sub>B</sub>v<sub>B1</sub> = m<sub>A</sub>v<sub>A2</sub> + m<sub>B</sub>v<sub>B2</sub>. Với va chạm xuyên tâm cần thêm phương trình thứ hai, <strong>hệ số phục hồi</strong>:</p>
<div class="formula"><span class="lbl">Hệ số phục hồi</span>e = (v<sub>B2</sub> − v<sub>A2</sub>) / (v<sub>A1</sub> − v<sub>B1</sub>) &nbsp;&nbsp; 0 ≤ e ≤ 1<br>e = 1 đàn hồi tuyệt đối (không mất năng lượng); e = 0 dẻo tuyệt đối (hai vật dính vào nhau)</div>
<div class="callout"><p><b>Ví dụ 3 — va chạm dẻo.</b> Ô tô 1500 kg chạy 15 m/s đâm vào xe 1000 kg đứng yên và hai xe dính vào nhau (e = 0).</p>
<p>Động lượng: 1500 × 15 = 2500 v′ ⇒ <b>v′ = 9 m/s</b>.</p>
<p>Động năng trước: ½ × 1500 × 15<sup>2</sup> = 168 750 J; sau: ½ × 2500 × 9<sup>2</sup> = 101 250 J. <b>Mất: 67 500 J (40 %)</b> — bị hấp thụ do biến dạng thân xe.</p>
<p>Nếu e = 0,6: v<sub>A2</sub> = (1500 × 15 − 1000 × 0,6 × 15)/2500 = <b>5,4 m/s</b>, v<sub>B2</sub> = 5,4 + 0,6 × 15 = <b>14,4 m/s</b>.</p></div>
<div class="note-ct"><p>Với quả bóng thả rơi xuống sàn cứng, độ cao nảy lên bằng e<sup>2</sup> lần độ cao thả — cách đơn giản để đo e. Robot phải tiếp xúc an toàn với môi trường (robot cộng tác) giới hạn tốc độ và khối lượng chuyển động để lực và năng lượng va chạm dưới ngưỡng gây thương tích.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Bỏ qua dấu (chiều) của vận tốc trong phương trình động lượng.</li><li>Cho rằng động năng luôn bảo toàn trong mọi va chạm.</li><li>Đưa vào một lực ngoài không đáng kể trong thời gian va chạm rất ngắn (hoặc bỏ qua một lực đáng kể).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>m v<sub>1</sub> + ∫F dt = m v<sub>2</sub>; F<sub>tb</sub> = m Δv/Δt.</li><li>Thời gian dừng dài hơn ⇒ lực nhỏ hơn.</li><li>Không có xung lượng ngoài ⇒ tổng động lượng bảo toàn.</li><li>e liên hệ vận tốc tách ra và tiến lại; e &lt; 1 ⇒ mất năng lượng.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(OSP + '9-2-impulse-and-collisions', 'OpenStax 9.2 — Xung lượng và va chạm'),
    A(OSP + '9-3-conservation-of-linear-momentum', 'OpenStax 9.3 — Bảo toàn động lượng'),
    A(OSP + '9-4-types-of-collisions', 'OpenStax 9.4 — Các loại va chạm'),
    A(WK + 'Coefficient_of_restitution', 'Wikipedia — Hệ số phục hồi'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Búa 1 kg chạy 5 m/s dừng trên đinh trong 2 ms. Lực trung bình?</li><li>Bóng thả từ 2 m với e = 0,5. Độ cao nảy lên?</li><li>Hai xe goòng 1000 kg, một xe chạy 4 m/s, một xe đứng yên, móc nối vào nhau. Vận tốc sau và năng lượng mất?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 1 × 5/0,002 = 2500 N. 2) e<sup>2</sup> × 2 = 0,5 m. 3) v′ = 2 m/s; động năng 8000 J → 4000 J ⇒ mất 4000 J (50 %).</p></div>`);

const q9 = QZ(9, 'Quiz — Chapter 9: Kinetics — force, energy and momentum|||Quiz — Chương 9: Động lực học — lực, năng lượng và động lượng', 'Kiểm tra chương 9: F = ma, ma sát khi phanh/vào cua, ΣM = Iα, mômen quán tính, công – động năng, công suất, hiệu suất, xung lượng, va chạm.', [
  Q('q1', 'A 1000 kg car brakes at 6 m/s². The friction force at the tyres is|||Ô tô 1000 kg phanh với 6 m/s². Lực ma sát tại lốp là',
    ['600 N|||600 N', '6000 N|||6000 N', '9810 N|||9810 N', '60 kN|||60 kN'], 1,
    'F = m a.|||F = m a.'),
  Q('q2', 'The maximum braking deceleration on a road with μ = 0.5 is about|||Gia tốc hãm lớn nhất trên đường có μ = 0,5 xấp xỉ',
    ['0.5 m/s²|||0,5 m/s²', '4.9 m/s²|||4,9 m/s²', '9.81 m/s²|||9,81 m/s²', '19.6 m/s²|||19,6 m/s²'], 1,
    'a = μ g.|||a = μ g.'),
  Q('q3', 'A lift of mass m accelerating upward at a has cable tension|||Thang máy khối lượng m tăng tốc đi lên với a có lực căng cáp',
    ['m(g − a)|||m(g − a)', 'm(g + a)|||m(g + a)', 'mg|||mg', 'ma|||ma'], 1,
    'T − mg = ma.|||T − mg = ma.'),
  Q('q4', 'The mass moment of inertia of a solid disc about its axis is|||Mômen quán tính khối lượng của đĩa đặc đối với trục của nó là',
    ['m r²|||m r²', '½ m r²|||½ m r²', '⅓ m r²|||⅓ m r²', '2/5 m r²|||2/5 m r²'], 1,
    '2/5 m r² is a solid sphere.|||2/5 m r² là của quả cầu đặc.'),
  Q('q5', 'A torque of 10 N·m on a body with I = 2 kg·m² gives|||Mômen 10 N·m tác dụng lên vật có I = 2 kg·m² gây',
    ['α = 20 rad/s²|||α = 20 rad/s²', 'α = 5 rad/s²|||α = 5 rad/s²', 'ω = 5 rad/s|||ω = 5 rad/s', 'α = 0.2 rad/s²|||α = 0,2 rad/s²'], 1,
    'α = M/I.|||α = M/I.'),
  Q('q6', 'The kinetic energy of a 1000 kg car at 10 m/s is|||Động năng của ô tô 1000 kg chạy 10 m/s là',
    ['10 kJ|||10 kJ', '50 kJ|||50 kJ', '100 kJ|||100 kJ', '5 kJ|||5 kJ'], 1,
    '½ × 1000 × 100.|||½ × 1000 × 100.'),
  Q('q7', 'Lifting 100 kg at 1 m/s requires an output power of about|||Nâng 100 kg với 1 m/s cần công suất ra xấp xỉ',
    ['100 W|||100 W', '981 W|||981 W', '9.81 kW|||9,81 kW', '98.1 W|||98,1 W'], 1,
    'P = m g v.|||P = m g v.'),
  Q('q8', 'Two stages with η = 0.9 and 0.8 in series give a total efficiency of|||Hai cấp η = 0,9 và 0,8 nối tiếp cho hiệu suất tổng',
    ['1.7|||1,7', '0.85|||0,85', '0.72|||0,72', '0.1|||0,1'], 2,
    'Multiply: 0.9 × 0.8.|||Nhân: 0,9 × 0,8.'),
  Q('q9', 'Doubling the stopping time of an impact (same Δv) makes the average force|||Tăng gấp đôi thời gian dừng khi va chạm (cùng Δv) thì lực trung bình',
    ['double|||gấp đôi', 'halve|||giảm một nửa', 'stay the same|||không đổi', 'quadruple|||gấp bốn'], 1,
    'F_avg = m Δv/Δt.|||F_avg = m Δv/Δt.'),
  Q('q10', 'In a perfectly plastic collision (e = 0)|||Trong va chạm dẻo tuyệt đối (e = 0)',
    ['kinetic energy is conserved|||động năng được bảo toàn', 'the bodies move together afterwards|||hai vật chuyển động cùng nhau sau va chạm', 'momentum is lost|||động lượng bị mất', 'the bodies bounce apart|||hai vật bật ra xa'], 1,
    'Momentum is still conserved; KE is lost.|||Động lượng vẫn bảo toàn; động năng bị mất.'),
]);

const ch9 = {
  title: 'Chapter 9 — Kinetics: Newton\'s law, work–energy, power and momentum|||Chương 9 — Động lực học: định luật Newton, công – năng lượng, công suất và động lượng',
  description: 'ΣF = ma và ΣM = Iα, công – động năng, thế năng, công suất và hiệu suất, xung lượng – động lượng, va chạm và hệ số phục hồi (Hibbeler Dynamics ch.13–15, 17–18).',
  lessons: [c91, c92, c93, q9],
};

// ───────────────────────────── Chương 10 ─────────────────────────────
const c101 = L('emm201c-ts-10-1',
  '10.1 — Threaded fasteners and bolted joints|||10.1 — Chi tiết ren và mối ghép bulông',
  'Ren hệ mét, diện tích chịu kéo At, cấp bền 8.8; lực xiết ban đầu Fi, mômen xiết T = K·Fi·d; mối ghép chịu kéo: hệ số độ cứng C, tải bulông, hệ số an toàn tải và tách; mối ghép chịu cắt: ma sát và cắt thân bulông.',
  `<span class="eyebrow">EMM201c · Chapter 10 · Lesson 10.1</span>
<h2>Threaded fasteners and bolted joints</h2>
<h3>🎯 Objectives</h3>
<ul><li>Read a metric thread designation and a property class.</li><li>Compute the preload, tightening torque and bolt load of a tension joint.</li><li>Check a joint against bolt overload and joint separation; recognise shear joints.</li></ul>
<h3>Metric threads and strength classes</h3>
<p><strong>M20 × 2.5</strong> means a metric ISO thread with major diameter 20 mm and pitch 2.5 mm (coarse). A bolt in tension fails across the thread, so we use the <strong>tensile-stress area</strong> A<sub>t</sub> (tabulated: M8 36.6 mm<sup>2</sup>, M10 58.0, M12 84.3, M16 157, M20 245, M24 353). The <strong>property class</strong> stamped on the head, e.g. <strong>8.8</strong>, encodes strength: first number × 100 ≈ S<sub>ut</sub> in MPa; first × second × 10 ≈ S<sub>y</sub>. For class 8.8 above M16, ISO 898-1 and Shigley give proof strength S<sub>p</sub> = 600 MPa, S<sub>y</sub> = 660 MPa, S<sub>ut</sub> = 830 MPa.</p>
<h3>Preload — why bolts are tightened</h3>
<p>Tightening stretches the bolt and squeezes the clamped parts (members) with a <strong>preload</strong> F<sub>i</sub>. A well-preloaded joint resists separation, fatigue and loosening. Shigley recommends F<sub>i</sub> = 0.75 F<sub>p</sub> for reusable joints and 0.90 F<sub>p</sub> for permanent ones, where F<sub>p</sub> = A<sub>t</sub>·S<sub>p</sub>.</p>
<div class="formula"><span class="lbl">Preload and torque</span>F<sub>p</sub> = A<sub>t</sub>·S<sub>p</sub>,&nbsp; F<sub>i</sub> = 0.75 F<sub>p</sub> (reusable)<br>Tightening torque: T = K·F<sub>i</sub>·d &nbsp;(K ≈ 0.2 for plain, unlubricated steel; lower when lubricated)</div>
<h3>Tension joint with external load P</h3>
<p>The bolt (stiffness k<sub>b</sub>) and the members (k<sub>m</sub>, usually 3–5 times stiffer) share an external tensile load P. The <strong>joint constant</strong> C = k<sub>b</sub>/(k<sub>b</sub> + k<sub>m</sub>) is the fraction taken by the bolt:</p>
<div class="formula"><span class="lbl">Bolt and member loads</span>F<sub>b</sub> = F<sub>i</sub> + C·P &nbsp;&nbsp; F<sub>m</sub> = F<sub>i</sub> − (1 − C)·P (must stay &gt; 0)<br>Load factor (yield): n<sub>L</sub> = (S<sub>p</sub>A<sub>t</sub> − F<sub>i</sub>)/(C·P) &nbsp;&nbsp; Separation factor: n<sub>0</sub> = F<sub>i</sub>/[P(1 − C)]</div>
<h3>✍️ Worked example — cylinder-head-type joint</h3>
<div class="callout"><p>One M20 × 2.5 class 8.8 bolt carries an external tension P = 30 kN; C = 0.2.</p>
<p>F<sub>p</sub> = 245 × 600 = <b>147 kN</b>; F<sub>i</sub> = 0.75 × 147 = <b>110.3 kN</b>; torque T = 0.2 × 110 250 × 0.020 = <b>441 N·m</b>.</p>
<p>F<sub>b</sub> = 110.3 + 0.2 × 30 = <b>116.3 kN</b> (bolt stress 116 250/245 = 474 MPa &lt; S<sub>p</sub>); F<sub>m</sub> = 110.3 − 0.8 × 30 = <b>86.3 kN</b> &gt; 0 ⇒ no separation.</p>
<p>n<sub>L</sub> = (147 − 110.3)/(0.2 × 30) = <b>6.1</b>; n<sub>0</sub> = 110.3/(0.8 × 30) = <b>4.6</b>.</p>
<p>Insight: thanks to preload, the bolt sees only 20 % of the external load — its stress barely fluctuates, which is why preloaded bolts resist fatigue.</p></div>
<h3>Shear joints</h3>
<p>When plates slide relative to each other, a joint carries shear in one of two ways: <strong>friction-grip</strong> (slip-critical): load ≤ μ·F<sub>i</sub> per friction interface (with μ = 0.3, the M20 above resists about 33 kN per interface); or <strong>bearing type</strong>: the bolt shank is sheared (τ = V/A of the shank, not of the thread unless threads lie in the shear plane) and the plates are checked for bearing σ<sub>b</sub> = V/(t·d).</p>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the nominal area πd<sup>2</sup>/4 instead of A<sub>t</sub> for tension.</li><li>Assuming the bolt carries the full external load in a preloaded joint.</li><li>Specifying a torque without a K value (lubrication changes preload by ±30 %).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Use A<sub>t</sub> and S<sub>p</sub> from the property class.</li><li>F<sub>i</sub> = 0.75 F<sub>p</sub>; T = K F<sub>i</sub> d with K ≈ 0.2.</li><li>F<sub>b</sub> = F<sub>i</sub> + CP, F<sub>m</sub> = F<sub>i</sub> − (1−C)P; check n<sub>L</sub> and n<sub>0</sub>.</li><li>Shear joints: friction grip or bolt shear + bearing.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(WK + 'Bolted_joint', 'Wikipedia — Bolted joint (preload and joint stiffness)'),
    A(WK + 'Screw_thread', 'Wikipedia — Screw thread'),
    A(OCW_MD, 'MIT OCW 2.72 — Elements of Mechanical Design (bolted joints)'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>Find the reusable preload and tightening torque (K = 0.2) of an M16 class 8.8 bolt with A<sub>t</sub> = 157 mm<sup>2</sup> and S<sub>p</sub> = 600 MPa.</li><li>An M12 bolt (shank 12 mm) carries 10 kN in single shear through its shank. Shear stress?</li><li>In the worked example, what external load P would cause separation?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) F<sub>p</sub> = 94.2 kN, F<sub>i</sub> = 70.7 kN, T = 0.2 × 70 650 × 0.016 = 226 N·m. 2) τ = 10 000/(π × 12<sup>2</sup>/4) = 88.4 MPa. 3) F<sub>m</sub> = 0 ⇒ P = F<sub>i</sub>/(1 − C) = 110.3/0.8 = 137.8 kN.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 10 · Bài 10.1</span>
<h2>Chi tiết ren và mối ghép bulông</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Đọc ký hiệu ren hệ mét và cấp bền.</li><li>Tính lực xiết ban đầu, mômen xiết và tải bulông trong mối ghép chịu kéo.</li><li>Kiểm mối ghép chống quá tải bulông và chống tách; nhận biết mối ghép chịu cắt.</li></ul>
<h3>Ren hệ mét và cấp bền</h3>
<p><strong>M20 × 2,5</strong> là ren hệ mét ISO đường kính ngoài 20 mm, bước ren 2,5 mm (ren bước lớn). Bulông chịu kéo đứt qua phần ren, nên ta dùng <strong>diện tích chịu kéo</strong> A<sub>t</sub> (tra bảng: M8 36,6 mm<sup>2</sup>, M10 58,0, M12 84,3, M16 157, M20 245, M24 353). <strong>Cấp bền</strong> dập trên đầu bulông, ví dụ <strong>8.8</strong>: số đầu × 100 ≈ S<sub>ut</sub> theo MPa; số đầu × số sau × 10 ≈ S<sub>y</sub>. Với cấp 8.8 cỡ lớn hơn M16, ISO 898-1 và Shigley cho ứng suất thử S<sub>p</sub> = 600 MPa, S<sub>y</sub> = 660 MPa, S<sub>ut</sub> = 830 MPa.</p>
<h3>Lực xiết ban đầu — vì sao phải xiết bulông</h3>
<p>Xiết làm bulông dãn ra và ép chặt các chi tiết bị kẹp bằng <strong>lực xiết ban đầu</strong> F<sub>i</sub>. Mối ghép xiết đủ chống tách, chống mỏi và chống tự nới. Shigley khuyên F<sub>i</sub> = 0,75 F<sub>p</sub> với mối ghép tháo lắp được và 0,90 F<sub>p</sub> với mối ghép cố định, trong đó F<sub>p</sub> = A<sub>t</sub>·S<sub>p</sub>.</p>
<div class="formula"><span class="lbl">Lực xiết và mômen xiết</span>F<sub>p</sub> = A<sub>t</sub>·S<sub>p</sub>,&nbsp; F<sub>i</sub> = 0,75 F<sub>p</sub> (tháo lắp được)<br>Mômen xiết: T = K·F<sub>i</sub>·d &nbsp;(K ≈ 0,2 với thép trơn không bôi trơn; nhỏ hơn khi bôi trơn)</div>
<h3>Mối ghép chịu kéo với tải ngoài P</h3>
<p>Bulông (độ cứng k<sub>b</sub>) và các chi tiết bị kẹp (k<sub>m</sub>, thường cứng gấp 3–5 lần) chia nhau tải kéo ngoài P. <strong>Hệ số mối ghép</strong> C = k<sub>b</sub>/(k<sub>b</sub> + k<sub>m</sub>) là phần bulông nhận:</p>
<div class="formula"><span class="lbl">Tải bulông và chi tiết kẹp</span>F<sub>b</sub> = F<sub>i</sub> + C·P &nbsp;&nbsp; F<sub>m</sub> = F<sub>i</sub> − (1 − C)·P (phải còn &gt; 0)<br>Hệ số tải (chảy): n<sub>L</sub> = (S<sub>p</sub>A<sub>t</sub> − F<sub>i</sub>)/(C·P) &nbsp;&nbsp; Hệ số chống tách: n<sub>0</sub> = F<sub>i</sub>/[P(1 − C)]</div>
<h3>✍️ Ví dụ giải — mối ghép kiểu nắp xi-lanh</h3>
<div class="callout"><p>Một bulông M20 × 2,5 cấp 8.8 chịu tải kéo ngoài P = 30 kN; C = 0,2.</p>
<p>F<sub>p</sub> = 245 × 600 = <b>147 kN</b>; F<sub>i</sub> = 0,75 × 147 = <b>110,3 kN</b>; mômen xiết T = 0,2 × 110 250 × 0,020 = <b>441 N·m</b>.</p>
<p>F<sub>b</sub> = 110,3 + 0,2 × 30 = <b>116,3 kN</b> (ứng suất bulông 116 250/245 = 474 MPa &lt; S<sub>p</sub>); F<sub>m</sub> = 110,3 − 0,8 × 30 = <b>86,3 kN</b> &gt; 0 ⇒ không tách.</p>
<p>n<sub>L</sub> = (147 − 110,3)/(0,2 × 30) = <b>6,1</b>; n<sub>0</sub> = 110,3/(0,8 × 30) = <b>4,6</b>.</p>
<p>Nhận xét: nhờ lực xiết, bulông chỉ chịu 20 % tải ngoài — ứng suất của nó gần như không dao động, vì vậy bulông được xiết đủ chống mỏi tốt.</p></div>
<h3>Mối ghép chịu cắt</h3>
<p>Khi các tấm có xu hướng trượt lên nhau, mối ghép chịu cắt theo một trong hai cách: <strong>ghép ma sát</strong> (chống trượt): tải ≤ μ·F<sub>i</sub> trên mỗi mặt ma sát (với μ = 0,3, bulông M20 ở trên chịu khoảng 33 kN mỗi mặt); hoặc <strong>ghép chịu dập</strong>: thân bulông bị cắt (τ = V/A của thân, không phải của ren trừ khi ren nằm trong mặt cắt) và tấm được kiểm dập σ<sub>b</sub> = V/(t·d).</p>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng diện tích danh nghĩa πd<sup>2</sup>/4 thay cho A<sub>t</sub> khi tính kéo.</li><li>Cho rằng bulông chịu toàn bộ tải ngoài trong mối ghép đã xiết.</li><li>Ghi mômen xiết mà không ghi hệ số K (bôi trơn làm lực xiết thay đổi ±30 %).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Dùng A<sub>t</sub> và S<sub>p</sub> theo cấp bền.</li><li>F<sub>i</sub> = 0,75 F<sub>p</sub>; T = K F<sub>i</sub> d với K ≈ 0,2.</li><li>F<sub>b</sub> = F<sub>i</sub> + CP, F<sub>m</sub> = F<sub>i</sub> − (1−C)P; kiểm n<sub>L</sub> và n<sub>0</sub>.</li><li>Mối ghép chịu cắt: ma sát, hoặc cắt thân bulông + dập.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(WK + 'Bolted_joint', 'Wikipedia — Mối ghép bulông (lực xiết, độ cứng mối ghép)'),
    A(WK + 'Screw_thread', 'Wikipedia — Ren vít'),
    A(OCW_MD, 'MIT OCW 2.72 — Elements of Mechanical Design (mối ghép bulông)'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Tìm lực xiết (tháo lắp được) và mômen xiết (K = 0,2) của bulông M16 cấp 8.8 với A<sub>t</sub> = 157 mm<sup>2</sup> và S<sub>p</sub> = 600 MPa.</li><li>Bulông M12 (thân 12 mm) chịu 10 kN cắt đơn qua thân. Ứng suất cắt?</li><li>Trong ví dụ giải, tải ngoài P nào làm mối ghép bị tách?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) F<sub>p</sub> = 94,2 kN, F<sub>i</sub> = 70,7 kN, T = 0,2 × 70 650 × 0,016 = 226 N·m. 2) τ = 10 000/(π × 12<sup>2</sup>/4) = 88,4 MPa. 3) F<sub>m</sub> = 0 ⇒ P = F<sub>i</sub>/(1 − C) = 110,3/0,8 = 137,8 kN.</p></div>`);

const c102 = L('emm201c-ts-10-2',
  '10.2 — Welded joints|||10.2 — Mối ghép hàn',
  'Các loại mối hàn (giáp mối, góc); kích thước cạnh h và chiều dày tính toán 0,707h; ứng suất cắt trên tiết diện họng τ = F/(0,707hL); ứng suất cho phép theo que hàn; thiết kế chiều dài mối hàn.',
  `<span class="eyebrow">EMM201c · Chapter 10 · Lesson 10.2</span>
<h2>Welded joints</h2>
<h3>🎯 Objectives</h3>
<ul><li>Recognise butt and fillet welds and their symbols in words.</li><li>Compute the throat shear stress of fillet welds.</li><li>Size the length of a fillet weld for a required load.</li></ul>
<h3>Types of welds</h3>
<ul><li><strong>Butt (groove) weld</strong>: joins two plates edge to edge; with full penetration it is as strong as the plate in tension or compression, so σ = F/(t·L).</li>
<li><strong>Fillet weld</strong>: a triangular bead in the corner between two plates (lap joints, T-joints, brackets). It is the most common weld in machine frames, vehicle chassis and robot bases. Its size is the <strong>leg</strong> h.</li></ul>
<p>A fillet weld fails across its <strong>throat</strong> — the smallest section, at 45° for an equal-leg weld, of thickness t = h·cos 45° = <strong>0.707 h</strong>. Standard practice (Shigley, AISC) treats the throat as carrying shear for both transverse and parallel loading, which is conservative and simple.</p>
<div class="formula"><span class="lbl">Fillet weld in direct shear</span>τ = F / (0.707·h·L<sub>total</sub>) &nbsp;&nbsp; L<sub>total</sub> = total effective length of all welds<br>Allowable (AISC-type code): τ<sub>all</sub> = 0.30·S<sub>ut</sub> of the electrode</div>
<p>Electrodes are designated by tensile strength: an <strong>E70xx</strong> electrode has S<sub>ut</sub> ≈ 482 MPa (70 kpsi), so τ<sub>all</sub> ≈ 145 MPa. The base metal next to the weld must also be checked.</p>
<h3>✍️ Worked example — lap joint</h3>
<div class="callout"><p>A steel strap is welded to a plate with <b>two longitudinal fillet welds</b>, each L = 100 mm long, leg h = 8 mm. Load F = 120 kN, electrode E70.</p>
<p>Throat area A = 2 × 0.707 × 8 × 100 = <b>1131 mm<sup>2</sup></b>.</p>
<p>τ = 120 000/1131 = <b>106 MPa</b> &lt; τ<sub>all</sub> = 0.30 × 482 = 145 MPa ✓ (ratio 1.36).</p>
<p>Minimum length per weld for τ = τ<sub>all</sub>: L = 120 000/(2 × 0.707 × 8 × 144.6) = <b>73 mm</b> — 100 mm gives margin for start/stop defects at the weld ends.</p></div>
<h3>Welds under bending or torsion</h3>
<p>For a bracket welded to a column and loaded eccentrically, the weld group carries a direct shear plus a moment. Shigley treats the weld as a line: compute the unit second moment (I<sub>u</sub> or J<sub>u</sub>) of the weld pattern, then τ = M·c/(0.707·h·I<sub>u</sub>) and combine vectorially with the direct shear. The principle is the same as for bolts in a bolt group.</p>
<h3>Design notes</h3>
<ul><li>Welding heats and cools the metal: residual stresses and distortion are normal; a weld toe is a strong stress raiser, so <strong>fatigue</strong> strength of welded joints is much lower than that of the plate (codes give separate fatigue classes).</li><li>Avoid welding hardened or high-carbon steels and many aluminium alloys without a proper procedure (the heat-affected zone loses strength).</li><li>Prefer welds loaded in shear over welds loaded in tension across their root.</li></ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the leg h instead of the throat 0.707h.</li><li>Counting only one of two weld lines.</li><li>Ignoring fatigue in vibrating welded structures.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Butt welds: σ = F/(tL); fillet welds fail at the throat 0.707h.</li><li>τ = F/(0.707 h L<sub>total</sub>) ≤ 0.30 S<sub>ut,electrode</sub>.</li><li>Eccentric loads: treat welds as lines, add direct and moment shear.</li><li>Welded joints are fatigue-sensitive.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(WK + 'Fillet_weld', 'Wikipedia — Fillet weld'),
    A(WK + 'Welding_joint', 'Wikipedia — Welding joint'),
    A(OCW_MD, 'MIT OCW 2.72 — Elements of Mechanical Design'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>Two fillet welds, h = 6 mm, 80 mm long each, carry 60 kN. Throat stress?</li><li>What leg size h is needed for a single 150 mm weld carrying 50 kN with τ<sub>all</sub> = 145 MPa?</li><li>Why is the throat, not the leg, used in the stress calculation?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) τ = 60 000/(2 × 0.707 × 6 × 80) = 88.4 MPa. 2) h = 50 000/(0.707 × 150 × 145) = 3.25 mm ⇒ use 4 mm (or the code minimum for the plate thickness). 3) The throat is the smallest cross-section through which the force must pass, so it has the highest stress.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 10 · Bài 10.2</span>
<h2>Mối ghép hàn</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận biết mối hàn giáp mối, mối hàn góc và mô tả chúng bằng lời.</li><li>Tính ứng suất cắt trên tiết diện họng của mối hàn góc.</li><li>Tính chiều dài mối hàn góc cho tải yêu cầu.</li></ul>
<h3>Các loại mối hàn</h3>
<ul><li><strong>Hàn giáp mối</strong>: nối hai tấm đối đầu; khi ngấu hoàn toàn nó bền như tấm khi kéo hay nén, nên σ = F/(t·L).</li>
<li><strong>Hàn góc</strong>: đường hàn tam giác ở góc giữa hai tấm (mối ghép chồng, chữ T, giá đỡ). Đây là mối hàn thông dụng nhất trong khung máy, khung gầm ô tô và đế robot. Kích thước của nó là <strong>cạnh</strong> h.</li></ul>
<p>Mối hàn góc hỏng qua <strong>tiết diện họng</strong> — tiết diện nhỏ nhất, nghiêng 45° với mối hàn cạnh đều, chiều dày t = h·cos 45° = <strong>0,707 h</strong>. Thực hành chuẩn (Shigley, AISC) coi họng chịu cắt cho cả tải ngang lẫn tải dọc, vừa đơn giản vừa thiên về an toàn.</p>
<div class="formula"><span class="lbl">Mối hàn góc chịu cắt trực tiếp</span>τ = F / (0,707·h·L<sub>tổng</sub>) &nbsp;&nbsp; L<sub>tổng</sub> = tổng chiều dài hiệu dụng của các đường hàn<br>Cho phép (theo kiểu tiêu chuẩn AISC): τ<sub>cp</sub> = 0,30·S<sub>ut</sub> của que hàn</div>
<p>Que hàn ký hiệu theo độ bền kéo: que <strong>E70xx</strong> có S<sub>ut</sub> ≈ 482 MPa (70 kpsi), nên τ<sub>cp</sub> ≈ 145 MPa. Kim loại cơ bản cạnh mối hàn cũng phải được kiểm.</p>
<h3>✍️ Ví dụ giải — mối ghép chồng</h3>
<div class="callout"><p>Một thanh dẹt thép được hàn vào tấm bằng <b>hai đường hàn góc dọc</b>, mỗi đường dài L = 100 mm, cạnh h = 8 mm. Tải F = 120 kN, que E70.</p>
<p>Diện tích họng A = 2 × 0,707 × 8 × 100 = <b>1131 mm<sup>2</sup></b>.</p>
<p>τ = 120 000/1131 = <b>106 MPa</b> &lt; τ<sub>cp</sub> = 0,30 × 482 = 145 MPa ✓ (tỉ số 1,36).</p>
<p>Chiều dài tối thiểu mỗi đường để τ = τ<sub>cp</sub>: L = 120 000/(2 × 0,707 × 8 × 144,6) = <b>73 mm</b> — 100 mm cho dư phòng khuyết tật ở đầu và cuối đường hàn.</p></div>
<h3>Mối hàn chịu uốn hoặc xoắn</h3>
<p>Với giá đỡ hàn vào cột và chịu tải lệch tâm, nhóm mối hàn chịu cắt trực tiếp cộng một mômen. Shigley coi mối hàn như một đường: tính mômen quán tính đơn vị (I<sub>u</sub> hoặc J<sub>u</sub>) của hình mối hàn, rồi τ = M·c/(0,707·h·I<sub>u</sub>) và cộng vector với ứng suất cắt trực tiếp. Nguyên tắc giống như nhóm bulông.</p>
<h3>Ghi chú thiết kế</h3>
<ul><li>Hàn làm nóng rồi nguội kim loại: ứng suất dư và biến dạng là bình thường; chân mối hàn là chỗ tập trung ứng suất mạnh, nên <strong>độ bền mỏi</strong> của mối hàn thấp hơn nhiều so với tấm (tiêu chuẩn có các cấp mỏi riêng).</li><li>Tránh hàn thép tôi, thép cacbon cao và nhiều hợp kim nhôm khi không có quy trình phù hợp (vùng ảnh hưởng nhiệt bị giảm bền).</li><li>Ưu tiên mối hàn chịu cắt hơn mối hàn chịu kéo ngang qua chân.</li></ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng cạnh h thay cho họng 0,707h.</li><li>Chỉ tính một trong hai đường hàn.</li><li>Bỏ qua mỏi ở kết cấu hàn chịu rung.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Hàn giáp mối: σ = F/(tL); hàn góc hỏng ở họng 0,707h.</li><li>τ = F/(0,707 h L<sub>tổng</sub>) ≤ 0,30 S<sub>ut,que hàn</sub>.</li><li>Tải lệch tâm: coi mối hàn là đường, cộng cắt trực tiếp và cắt do mômen.</li><li>Mối hàn nhạy với mỏi.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(WK + 'Fillet_weld', 'Wikipedia — Mối hàn góc'),
    A(WK + 'Welding_joint', 'Wikipedia — Các kiểu mối hàn'),
    A(OCW_MD, 'MIT OCW 2.72 — Elements of Mechanical Design'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Hai đường hàn góc h = 6 mm, mỗi đường dài 80 mm, chịu 60 kN. Ứng suất họng?</li><li>Cần cạnh h bao nhiêu cho một đường hàn dài 150 mm chịu 50 kN với τ<sub>cp</sub> = 145 MPa?</li><li>Vì sao dùng họng, không dùng cạnh, khi tính ứng suất?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) τ = 60 000/(2 × 0,707 × 6 × 80) = 88,4 MPa. 2) h = 50 000/(0,707 × 150 × 145) = 3,25 mm ⇒ dùng 4 mm (hoặc cỡ tối thiểu theo tiêu chuẩn cho chiều dày tấm). 3) Họng là tiết diện nhỏ nhất mà lực phải đi qua, nên ứng suất ở đó lớn nhất.</p></div>`);

const c103 = L('emm201c-ts-10-3',
  '10.3 — Keys, pins and couplings|||10.3 — Then, chốt và khớp nối',
  'Chức năng then; then bằng tiêu chuẩn theo đường kính trục; lực F = 2T/d; ứng suất cắt và dập trên then; chiều dài then cần thiết; chốt an toàn (cắt bảo vệ); khớp nối cứng và mềm.',
  `<span class="eyebrow">EMM201c · Chapter 10 · Lesson 10.3</span>
<h2>Keys, pins and couplings</h2>
<h3>🎯 Objectives</h3>
<ul><li>Size a parallel (square/rectangular) key for shear and bearing.</li><li>Use a shear pin as a torque fuse.</li><li>Choose between rigid and flexible couplings.</li></ul>
<h3>Keys</h3>
<p>A <strong>key</strong> transmits torque between a shaft and a hub (gear, pulley, sprocket) through a keyway cut in both. Parallel keys are standardised by shaft diameter (ISO/DIN 6885): e.g. for d = 38–44 mm a key b × h = 12 × 8 mm; the length l is chosen by calculation and is usually ≤ 1.5 d. The key is deliberately made of a softer steel than the shaft so that, under overload, the cheap key fails first.</p>
<p>The force on the key at the shaft surface is F = T/(d/2) = 2T/d. Two failure modes:</p>
<div class="formula"><span class="lbl">Parallel key</span>Shear across width b: τ = F/(b·l)<br>Bearing (crushing) on half the height: σ<sub>b</sub> = F/((h/2)·l)<br>Shear allowable from S<sub>sy</sub> ≈ 0.577 S<sub>y</sub> (von Mises); bearing compared with S<sub>y</sub></div>
<h3>✍️ Worked example</h3>
<div class="callout"><p>A 40 mm shaft transmits T = 500 N·m to a gear through a 12 × 8 mm key, l = 50 mm, key steel S<sub>y</sub> = 390 MPa (cold-drawn 1020).</p>
<p>F = 2 × 500/0.040 = <b>25 kN</b>.</p>
<p>Shear: τ = 25 000/(12 × 50) = <b>41.7 MPa</b>; n = 0.577 × 390/41.7 = <b>5.4</b>.</p>
<p>Bearing: σ<sub>b</sub> = 25 000/(4 × 50) = <b>125 MPa</b>; n = 390/125 = <b>3.1</b>.</p>
<p>Bearing governs (typical). For n = 2 in bearing, the minimum length is l = 25 000/(4 × 195) = 32 mm; the 50 mm key also matches the hub width.</p></div>
<p>The keyway is a stress raiser for the <strong>shaft</strong> (K<sub>t</sub> ≈ 2–3 in bending): it must be included in the shaft fatigue check (lesson 10.4). Alternatives with lower stress concentration: splines (many integral keys — gearboxes, drive shafts), polygon profiles, shrink fits and keyless locking bushings.</p>
<h3>Pins</h3>
<p>Cross pins, taper pins and roll pins locate parts and carry small torques. A <strong>shear pin</strong> is designed to break at a chosen overload torque, protecting the rest of the drive (e.g. outboard motor propellers, snow blowers): for a pin of diameter d<sub>p</sub> in double shear through a shaft of diameter D: T<sub>fail</sub> = 2 × (π d<sub>p</sub><sup>2</sup>/4) × S<sub>su</sub> × D/2.</p>
<h3>Couplings</h3>
<ul><li><strong>Rigid couplings</strong> (sleeve, flange): transmit torque with no flexibility; require precise alignment, otherwise they load the bearings.</li><li><strong>Flexible couplings</strong> (jaw/elastomer spider, disc, bellows, gear, Oldham): accommodate small angular, parallel and axial misalignment and damp shocks. Robots and CNC axes use backlash-free bellows or disc couplings between servo motor and ball screw.</li><li>Selection: rated torque ≥ service factor × nominal torque (service factor 1.0–3.0 depending on shocks), maximum speed, misalignment, torsional stiffness.</li></ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using F = T/d instead of 2T/d.</li><li>Checking only key shear and forgetting bearing.</li><li>Forgetting that the keyway weakens the shaft.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>F = 2T/d; τ = F/(b l), σ<sub>b</sub> = 2F/(h l).</li><li>Bearing usually governs; key softer than shaft.</li><li>Shear pins act as torque fuses.</li><li>Flexible couplings tolerate misalignment; choose with a service factor.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(WK + 'Key_(engineering)', 'Wikipedia — Key (engineering)'),
    A(WK + 'Shaft_(mechanical_engineering)', 'Wikipedia — Shaft (mechanical engineering)'),
    A(OCW_MD, 'MIT OCW 2.72 — Elements of Mechanical Design'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A 30 mm shaft transmits 150 N·m with a 10 × 8 mm key, 40 mm long. Find τ and σ<sub>b</sub>.</li><li>Which failure mode usually governs a square or rectangular key?</li><li>A 5 mm shear pin (S<sub>su</sub> = 300 MPa) in double shear through a 25 mm shaft. Breaking torque?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) F = 2 × 150/0.030 = 10 kN; τ = 10 000/(10 × 40) = 25 MPa; σ<sub>b</sub> = 10 000/(4 × 40) = 62.5 MPa. 2) Bearing (crushing). 3) T = 2 × 19.63 × 300 × 12.5 = 147 263 N·mm ≈ 147 N·m.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 10 · Bài 10.3</span>
<h2>Then, chốt và khớp nối</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính then bằng (vuông/chữ nhật) theo cắt và dập.</li><li>Dùng chốt cắt như cầu chì mômen.</li><li>Chọn giữa khớp nối cứng và khớp nối mềm.</li></ul>
<h3>Then</h3>
<p><strong>Then</strong> truyền mômen giữa trục và moay-ơ (bánh răng, puli, đĩa xích) qua rãnh then trên cả hai. Then bằng được tiêu chuẩn hoá theo đường kính trục (ISO/DIN 6885): ví dụ d = 38–44 mm dùng then b × h = 12 × 8 mm; chiều dài l chọn theo tính toán và thường ≤ 1,5 d. Then cố ý làm bằng thép mềm hơn trục để khi quá tải, chi tiết rẻ tiền là then hỏng trước.</p>
<p>Lực lên then tại mặt trục là F = T/(d/2) = 2T/d. Hai dạng hỏng:</p>
<div class="formula"><span class="lbl">Then bằng</span>Cắt theo bề rộng b: τ = F/(b·l)<br>Dập trên nửa chiều cao: σ<sub>b</sub> = F/((h/2)·l)<br>Cắt cho phép theo S<sub>sy</sub> ≈ 0,577 S<sub>y</sub> (von Mises); dập so với S<sub>y</sub></div>
<h3>✍️ Ví dụ giải</h3>
<div class="callout"><p>Trục 40 mm truyền T = 500 N·m cho bánh răng qua then 12 × 8 mm, l = 50 mm, thép làm then S<sub>y</sub> = 390 MPa (1020 kéo nguội).</p>
<p>F = 2 × 500/0,040 = <b>25 kN</b>.</p>
<p>Cắt: τ = 25 000/(12 × 50) = <b>41,7 MPa</b>; n = 0,577 × 390/41,7 = <b>5,4</b>.</p>
<p>Dập: σ<sub>b</sub> = 25 000/(4 × 50) = <b>125 MPa</b>; n = 390/125 = <b>3,1</b>.</p>
<p>Dập quyết định (điển hình). Với n = 2 về dập, chiều dài tối thiểu l = 25 000/(4 × 195) = 32 mm; then 50 mm còn khớp với bề rộng moay-ơ.</p></div>
<p>Rãnh then là chỗ tập trung ứng suất cho <strong>trục</strong> (K<sub>t</sub> ≈ 2–3 khi uốn): phải đưa vào khi kiểm mỏi trục (bài 10.4). Phương án ít tập trung ứng suất hơn: then hoa (nhiều then liền trục — hộp số, trục các-đăng), biên dạng đa giác, lắp có độ dôi và ống côn khoá không then.</p>
<h3>Chốt</h3>
<p>Chốt ngang, chốt côn và chốt đàn hồi dùng để định vị và truyền mômen nhỏ. <strong>Chốt cắt (chốt an toàn)</strong> được thiết kế để gãy ở một mômen quá tải chọn trước, bảo vệ phần còn lại của bộ truyền (ví dụ chân vịt máy thuyền, máy thổi tuyết): với chốt đường kính d<sub>p</sub> cắt kép xuyên qua trục đường kính D: T<sub>gãy</sub> = 2 × (π d<sub>p</sub><sup>2</sup>/4) × S<sub>su</sub> × D/2.</p>
<h3>Khớp nối</h3>
<ul><li><strong>Khớp nối cứng</strong> (ống, mặt bích): truyền mômen không có độ mềm; cần đồng tâm chính xác, nếu không sẽ gây tải lên ổ.</li><li><strong>Khớp nối mềm</strong> (vấu – đệm đàn hồi, đĩa, ống xếp, khớp răng, Oldham): bù sai lệch góc, song song và dọc trục nhỏ, giảm chấn va đập. Robot và trục CNC dùng khớp ống xếp hoặc khớp đĩa không độ rơ giữa động cơ servo và vít me bi.</li><li>Chọn: mômen danh định ≥ hệ số chế độ × mômen làm việc (hệ số 1,0–3,0 tuỳ va đập), tốc độ tối đa, độ lệch, độ cứng xoắn.</li></ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng F = T/d thay vì 2T/d.</li><li>Chỉ kiểm cắt then mà quên dập.</li><li>Quên rằng rãnh then làm yếu trục.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>F = 2T/d; τ = F/(b l), σ<sub>b</sub> = 2F/(h l).</li><li>Dập thường quyết định; then mềm hơn trục.</li><li>Chốt cắt là cầu chì mômen.</li><li>Khớp nối mềm bù sai lệch; chọn theo hệ số chế độ.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(WK + 'Key_(engineering)', 'Wikipedia — Then (kỹ thuật)'),
    A(WK + 'Shaft_(mechanical_engineering)', 'Wikipedia — Trục (cơ khí)'),
    A(OCW_MD, 'MIT OCW 2.72 — Elements of Mechanical Design'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Trục 30 mm truyền 150 N·m với then 10 × 8 mm dài 40 mm. Tìm τ và σ<sub>b</sub>.</li><li>Dạng hỏng nào thường quyết định với then vuông hoặc chữ nhật?</li><li>Chốt cắt 5 mm (S<sub>su</sub> = 300 MPa) cắt kép xuyên trục 25 mm. Mômen làm gãy chốt?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) F = 2 × 150/0,030 = 10 kN; τ = 10 000/(10 × 40) = 25 MPa; σ<sub>b</sub> = 10 000/(4 × 40) = 62,5 MPa. 2) Dập. 3) T = 2 × 19,63 × 300 × 12,5 = 147 263 N·mm ≈ 147 N·m.</p></div>`);

const c104 = L('emm201c-ts-10-4',
  '10.4 — Shaft design for static strength and fatigue|||10.4 — Thiết kế trục theo bền tĩnh và theo mỏi',
  'Bố trí trục và tải lên trục; mômen uốn tổng từ hai mặt phẳng; đường kính theo bền tĩnh (von Mises); theo mỏi DE-Goodman với Kf, Kfs; lặp hệ số kích thước; kiểm độ võng, góc nghiêng và tốc độ tới hạn.',
  `<span class="eyebrow">EMM201c · Chapter 10 · Lesson 10.4</span>
<h2>Shaft design for static strength and fatigue</h2>
<h3>🎯 Objectives</h3>
<ul><li>Find the bending moment and torque at the critical sections of a shaft.</li><li>Compute a minimum diameter for static yield (von Mises) and for fatigue (DE-Goodman).</li><li>List the stiffness checks: deflection, slope and critical speed.</li></ul>
<h3>Shaft layout and loads</h3>
<p>A typical shaft carries gears, pulleys or sprockets between two bearings. Gear and belt forces act in two planes: draw the bending-moment diagrams in the horizontal and vertical planes, and combine at each section: <strong>M = √(M<sub>H</sub><sup>2</sup> + M<sub>V</sub><sup>2</sup>)</strong>. The torque T is constant between the input and output elements. Critical sections are where M is large <em>and</em> there is a stress raiser (shoulder fillet, keyway, retaining-ring groove).</p>
<h3>Static (first-cycle yield) design</h3>
<p>At the surface: σ = 32M/(πd<sup>3</sup>), τ = 16T/(πd<sup>3</sup>). With von Mises, σ′ = √(σ<sup>2</sup> + 3τ<sup>2</sup>) = (16/πd<sup>3</sup>)√(4M<sup>2</sup> + 3T<sup>2</sup>). Setting σ′ = S<sub>y</sub>/n:</p>
<div class="formula"><span class="lbl">Static diameter</span>d = [ (16n / (π S<sub>y</sub>)) · √(4M<sup>2</sup> + 3T<sup>2</sup>) ]<sup>1/3</sup></div>
<h3>Fatigue design (DE-Goodman, Shigley)</h3>
<p>On a rotating shaft with steady loads, the bending stress is <strong>fully reversed</strong> (M<sub>a</sub> = M, M<sub>m</sub> = 0) and the torque is <strong>steady</strong> (T<sub>m</sub> = T, T<sub>a</sub> = 0). The distortion-energy Goodman criterion then gives:</p>
<div class="formula"><span class="lbl">DE-Goodman (M<sub>m</sub> = T<sub>a</sub> = 0)</span>d = { (16n/π) · [ 2K<sub>f</sub>M<sub>a</sub>/S<sub>e</sub> + √3·K<sub>fs</sub>T<sub>m</sub>/S<sub>ut</sub> ] }<sup>1/3</sup></div>
<p>S<sub>e</sub> depends on d through k<sub>b</sub>, so guess d, compute S<sub>e</sub>, solve for d, repeat (two or three iterations converge).</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p>At a shoulder of a gearbox shaft: M = 300 N·m (rotating bending), T = 500 N·m (steady). Machined AISI 1045 cold-drawn steel: S<sub>y</sub> = 530 MPa, S<sub>ut</sub> = 630 MPa. At the shoulder K<sub>f</sub> = 1.7, K<sub>fs</sub> = 1.5.</p>
<p><b>Static</b>, n = 2.5: d = [(16 × 2.5/(π × 530)) × √(4 × 300 000<sup>2</sup> + 3 × 500 000<sup>2</sup>)]<sup>1/3</sup> = <b>29.4 mm</b>.</p>
<p><b>Fatigue</b>, n = 2: k<sub>a</sub> = 4.51 × 630<sup>−0.265</sup> = 0.817; start with d = 35 mm ⇒ k<sub>b</sub> = 0.848, S<sub>e</sub> = 0.817 × 0.848 × 315 = 218 MPa ⇒ d = 40.9 mm; iterate ⇒ k<sub>b</sub> = 0.833, S<sub>e</sub> = 214.5 MPa ⇒ <b>d = 41.1 mm</b>.</p>
<p>Choose <b>d = 42 mm</b> at the shoulder. Check: S<sub>e</sub> = 214 MPa, σ<sub>a</sub> = 1.7 × 32 × 300 000/(π × 42<sup>3</sup>) = 70.1 MPa, τ<sub>m</sub> = 1.5 × 16 × 500 000/(π × 42<sup>3</sup>) = 51.6 MPa ⇒ 1/n = 70.1/214 + √3 × 51.6/630 ⇒ <b>n = 2.13</b> ✓. Fatigue, not static strength, governs — the normal case for rotating shafts.</p></div>
<h3>Stiffness checks</h3>
<ul><li><strong>Deflection</strong> at gears (excess deflection spoils the tooth contact) and <strong>slope</strong> at bearings (each bearing type tolerates a limited misalignment — see the manufacturer's data and Shigley's guideline table).</li><li><strong>Torsional twist</strong> for long shafts and precision axes (lesson 6.1).</li><li><strong>Critical speed</strong>: a shaft whirls violently near its first natural frequency; keep the operating speed well below it (rule of thumb: below about half the first critical speed, or as your code requires).</li></ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Adding M<sub>H</sub> and M<sub>V</sub> algebraically instead of vectorially.</li><li>Designing a rotating shaft with static strength only.</li><li>Checking only the section of maximum M and ignoring a keyway or groove at a smaller M.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>M = √(M<sub>H</sub><sup>2</sup> + M<sub>V</sub><sup>2</sup>); T between drive elements.</li><li>Static: d from √(4M<sup>2</sup> + 3T<sup>2</sup>) and S<sub>y</sub>.</li><li>Fatigue: DE-Goodman with K<sub>f</sub>, K<sub>fs</sub>, S<sub>e</sub>; iterate k<sub>b</sub>.</li><li>Then check deflection, slope and critical speed.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(WK + 'Shaft_(mechanical_engineering)', 'Wikipedia — Shaft (mechanical engineering)'),
    A(OCW_MD, 'MIT OCW 2.72 — Elements of Mechanical Design (shafts, fatigue)'),
    A(WK + 'Fatigue_(material)', 'Wikipedia — Fatigue (material)'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>For the example, what static factor of safety does a 30 mm shaft have?</li><li>Horizontal and vertical moments at a section are 120 and 160 N·m. Find M.</li><li>Why is the bending stress fully reversed on a rotating shaft even though the loads are steady?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) σ = 113.2 MPa, τ = 94.3 MPa, σ′ = 198.7 MPa ⇒ n = 530/198.7 = 2.67. 2) M = √(120<sup>2</sup> + 160<sup>2</sup>) = 200 N·m. 3) A surface point rotates through the tension side and the compression side of the bending stress field once per revolution.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 10 · Bài 10.4</span>
<h2>Thiết kế trục theo bền tĩnh và theo mỏi</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tìm mômen uốn và mômen xoắn tại các tiết diện nguy hiểm của trục.</li><li>Tính đường kính tối thiểu theo chảy tĩnh (von Mises) và theo mỏi (DE-Goodman).</li><li>Liệt kê các kiểm tra độ cứng: độ võng, góc nghiêng và tốc độ tới hạn.</li></ul>
<h3>Bố trí trục và tải</h3>
<p>Trục điển hình mang bánh răng, puli hoặc đĩa xích giữa hai ổ. Lực bánh răng và đai tác dụng trong hai mặt phẳng: vẽ biểu đồ mômen uốn trong mặt phẳng ngang và mặt phẳng đứng, rồi tổng hợp tại mỗi tiết diện: <strong>M = √(M<sub>H</sub><sup>2</sup> + M<sub>V</sub><sup>2</sup>)</strong>. Mômen xoắn T không đổi giữa chi tiết vào và chi tiết ra. Tiết diện nguy hiểm là nơi M lớn <em>và</em> có tập trung ứng suất (góc lượn vai trục, rãnh then, rãnh vòng chặn).</p>
<h3>Thiết kế theo bền tĩnh (chảy ở chu kỳ đầu)</h3>
<p>Tại mặt trục: σ = 32M/(πd<sup>3</sup>), τ = 16T/(πd<sup>3</sup>). Theo von Mises, σ′ = √(σ<sup>2</sup> + 3τ<sup>2</sup>) = (16/πd<sup>3</sup>)√(4M<sup>2</sup> + 3T<sup>2</sup>). Đặt σ′ = S<sub>y</sub>/n:</p>
<div class="formula"><span class="lbl">Đường kính theo bền tĩnh</span>d = [ (16n / (π S<sub>y</sub>)) · √(4M<sup>2</sup> + 3T<sup>2</sup>) ]<sup>1/3</sup></div>
<h3>Thiết kế theo mỏi (DE-Goodman, Shigley)</h3>
<p>Trên trục quay chịu tải không đổi, ứng suất uốn thay đổi theo <strong>chu kỳ đối xứng</strong> (M<sub>a</sub> = M, M<sub>m</sub> = 0) còn mômen xoắn <strong>không đổi</strong> (T<sub>m</sub> = T, T<sub>a</sub> = 0). Tiêu chuẩn Goodman kết hợp năng lượng biến dạng cho:</p>
<div class="formula"><span class="lbl">DE-Goodman (M<sub>m</sub> = T<sub>a</sub> = 0)</span>d = { (16n/π) · [ 2K<sub>f</sub>M<sub>a</sub>/S<sub>e</sub> + √3·K<sub>fs</sub>T<sub>m</sub>/S<sub>ut</sub> ] }<sup>1/3</sup></div>
<p>S<sub>e</sub> phụ thuộc d qua k<sub>b</sub>, nên đoán d, tính S<sub>e</sub>, giải d, lặp lại (hai ba vòng là hội tụ).</p>
<h3>✍️ Ví dụ giải</h3>
<div class="callout"><p>Tại vai trục của trục hộp số: M = 300 N·m (uốn quay), T = 500 N·m (không đổi). Thép AISI 1045 kéo nguội, gia công cắt: S<sub>y</sub> = 530 MPa, S<sub>ut</sub> = 630 MPa. Tại vai trục K<sub>f</sub> = 1,7, K<sub>fs</sub> = 1,5.</p>
<p><b>Bền tĩnh</b>, n = 2,5: d = [(16 × 2,5/(π × 530)) × √(4 × 300 000<sup>2</sup> + 3 × 500 000<sup>2</sup>)]<sup>1/3</sup> = <b>29,4 mm</b>.</p>
<p><b>Mỏi</b>, n = 2: k<sub>a</sub> = 4,51 × 630<sup>−0,265</sup> = 0,817; bắt đầu với d = 35 mm ⇒ k<sub>b</sub> = 0,848, S<sub>e</sub> = 0,817 × 0,848 × 315 = 218 MPa ⇒ d = 40,9 mm; lặp ⇒ k<sub>b</sub> = 0,833, S<sub>e</sub> = 214,5 MPa ⇒ <b>d = 41,1 mm</b>.</p>
<p>Chọn <b>d = 42 mm</b> tại vai trục. Kiểm: S<sub>e</sub> = 214 MPa, σ<sub>a</sub> = 1,7 × 32 × 300 000/(π × 42<sup>3</sup>) = 70,1 MPa, τ<sub>m</sub> = 1,5 × 16 × 500 000/(π × 42<sup>3</sup>) = 51,6 MPa ⇒ 1/n = 70,1/214 + √3 × 51,6/630 ⇒ <b>n = 2,13</b> ✓. Mỏi, không phải bền tĩnh, quyết định — trường hợp bình thường với trục quay.</p></div>
<h3>Kiểm tra độ cứng</h3>
<ul><li><strong>Độ võng</strong> tại bánh răng (võng nhiều làm hỏng tiếp xúc răng) và <strong>góc nghiêng</strong> tại ổ (mỗi loại ổ chỉ chịu được độ lệch giới hạn — xem số liệu nhà sản xuất và bảng hướng dẫn của Shigley).</li><li><strong>Góc xoắn</strong> với trục dài và trục chính xác (bài 6.1).</li><li><strong>Tốc độ tới hạn</strong>: trục rung lắc mạnh gần tần số riêng thứ nhất; giữ tốc độ làm việc thấp hơn nhiều (kinh nghiệm: dưới khoảng một nửa tốc độ tới hạn thứ nhất, hoặc theo tiêu chuẩn).</li></ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cộng đại số M<sub>H</sub> và M<sub>V</sub> thay vì cộng vector.</li><li>Thiết kế trục quay chỉ theo bền tĩnh.</li><li>Chỉ kiểm tiết diện có M lớn nhất, bỏ qua rãnh then hay rãnh vòng chặn ở chỗ M nhỏ hơn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>M = √(M<sub>H</sub><sup>2</sup> + M<sub>V</sub><sup>2</sup>); T giữa các chi tiết truyền động.</li><li>Bền tĩnh: d từ √(4M<sup>2</sup> + 3T<sup>2</sup>) và S<sub>y</sub>.</li><li>Mỏi: DE-Goodman với K<sub>f</sub>, K<sub>fs</sub>, S<sub>e</sub>; lặp k<sub>b</sub>.</li><li>Sau đó kiểm độ võng, góc nghiêng và tốc độ tới hạn.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(WK + 'Shaft_(mechanical_engineering)', 'Wikipedia — Trục (cơ khí)'),
    A(OCW_MD, 'MIT OCW 2.72 — Elements of Mechanical Design (trục, mỏi)'),
    A(WK + 'Fatigue_(material)', 'Wikipedia — Mỏi vật liệu'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Trong ví dụ, trục 30 mm có hệ số an toàn tĩnh bằng bao nhiêu?</li><li>Mômen ngang và đứng tại một tiết diện là 120 và 160 N·m. Tìm M.</li><li>Vì sao ứng suất uốn trên trục quay là chu kỳ đối xứng dù tải không đổi?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) σ = 113,2 MPa, τ = 94,3 MPa, σ′ = 198,7 MPa ⇒ n = 530/198,7 = 2,67. 2) M = √(120<sup>2</sup> + 160<sup>2</sup>) = 200 N·m. 3) Mỗi vòng quay, một điểm trên mặt trục đi qua cả phía chịu kéo lẫn phía chịu nén của trường ứng suất uốn.</p></div>`);

const q10 = QZ(10, 'Quiz — Chapter 10: Joints, keys and shafts|||Quiz — Chương 10: Mối ghép, then và trục', 'Kiểm tra chương 10: diện tích chịu kéo, cấp bền, lực xiết, mômen xiết, hệ số mối ghép, mối hàn góc, then, khớp nối, thiết kế trục tĩnh và mỏi.', [
  Q('q1', 'For a bolt in tension, the stress is computed with|||Bulông chịu kéo, ứng suất tính với',
    ['the nominal area πd²/4|||diện tích danh nghĩa πd²/4', 'the tensile-stress area At|||diện tích chịu kéo At', 'the head area|||diện tích đầu bulông', 'the shank length|||chiều dài thân'], 1,
    'At accounts for the thread.|||At đã tính đến phần ren.'),
  Q('q2', 'Property class 8.8 means an ultimate strength of about|||Cấp bền 8.8 nghĩa là giới hạn bền xấp xỉ',
    ['88 MPa|||88 MPa', '800 MPa|||800 MPa', '640 MPa|||640 MPa', '8800 MPa|||8800 MPa'], 1,
    'First number × 100 (≈ 800–830 MPa).|||Số đầu × 100 (≈ 800–830 MPa).'),
  Q('q3', 'The tightening torque of a bolt is approximately|||Mômen xiết bulông xấp xỉ',
    ['T = Fi/d|||T = Fi/d', 'T = K·Fi·d|||T = K·Fi·d', 'T = Fi·d²|||T = Fi·d²', 'T = At·Sp|||T = At·Sp'], 1,
    'K ≈ 0.2 for dry steel.|||K ≈ 0,2 với thép khô.'),
  Q('q4', 'In a preloaded tension joint with C = 0.2, the bolt load increases by|||Trong mối ghép chịu kéo đã xiết với C = 0,2, tải bulông tăng thêm',
    ['P|||P', '0.2 P|||0,2 P', '0.8 P|||0,8 P', '0|||0'], 1,
    'Fb = Fi + C·P.|||Fb = Fi + C·P.'),
  Q('q5', 'The throat of an equal-leg fillet weld of leg h is|||Họng của mối hàn góc cạnh đều h là',
    ['h|||h', '0.707 h|||0,707 h', '1.414 h|||1,414 h', 'h/2|||h/2'], 1,
    'h·cos 45°.|||h·cos 45°.'),
  Q('q6', 'Two 100 mm fillet welds with h = 10 mm carry 141.4 kN. The throat shear stress is|||Hai mối hàn góc dài 100 mm, h = 10 mm chịu 141,4 kN. Ứng suất cắt ở họng là',
    ['70.7 MPa|||70,7 MPa', '100 MPa|||100 MPa', '141 MPa|||141 MPa', '50 MPa|||50 MPa'], 1,
    '141 400/(2 × 0.707 × 10 × 100) = 100 MPa.|||141 400/(2 × 0,707 × 10 × 100) = 100 MPa.'),
  Q('q7', 'The force on a key from torque T on a shaft of diameter d is|||Lực lên then do mômen T trên trục đường kính d là',
    ['T/d|||T/d', '2T/d|||2T/d', 'T·d|||T·d', '4T/d|||4T/d'], 1,
    'F = T/(d/2).|||F = T/(d/2).'),
  Q('q8', 'A flexible coupling is chosen mainly to|||Khớp nối mềm được chọn chủ yếu để',
    ['increase speed|||tăng tốc độ', 'accommodate misalignment and damp shocks|||bù sai lệch và giảm chấn', 'replace bearings|||thay ổ lăn', 'increase torque|||tăng mômen'], 1,
    'Rigid couplings require precise alignment.|||Khớp nối cứng đòi hỏi đồng tâm chính xác.'),
  Q('q9', 'On a rotating shaft with steady loads, the bending stress is|||Trên trục quay chịu tải không đổi, ứng suất uốn là',
    ['steady|||không đổi', 'fully reversed|||chu kỳ đối xứng', 'zero|||bằng 0', 'pulsating 0 → max|||mạch động 0 → max'], 1,
    'Each surface point passes the tension and compression sides.|||Mỗi điểm mặt trục đi qua phía kéo và phía nén.'),
  Q('q10', 'Horizontal and vertical bending moments of 30 and 40 N·m combine to|||Mômen uốn ngang 30 và đứng 40 N·m tổng hợp thành',
    ['70 N·m|||70 N·m', '50 N·m|||50 N·m', '10 N·m|||10 N·m', '35 N·m|||35 N·m'], 1,
    '√(30² + 40²).|||√(30² + 40²).'),
]);

const ch10 = {
  title: 'Chapter 10 — Machine elements I: bolted and welded joints, keys and shafts|||Chương 10 — Chi tiết máy I: mối ghép bulông, mối hàn, then và trục',
  description: 'Ren và bulông (cấp bền, lực xiết, mômen xiết, mối ghép chịu kéo/cắt), mối hàn góc, then – chốt – khớp nối, thiết kế trục theo bền tĩnh và mỏi DE-Goodman (Shigley ch.7–9).',
  lessons: [c101, c102, c103, c104, q10],
};

// ───────────────────────────── Chương 11 ─────────────────────────────
const c111 = L('emm201c-ts-11-1',
  '11.1 — Rolling-contact bearings: types, rating life and selection|||11.1 — Ổ lăn: các loại, tuổi thọ danh định và cách chọn',
  'Ổ bi và ổ đũa (cầu, đỡ chặn, côn, kim); tải trọng động C; tuổi thọ L10 = (C/P)^a; tuổi thọ theo giờ; tải tương đương P = X·Fr + Y·Fa; chọn ổ cho tuổi thọ yêu cầu; bôi trơn và lắp ghép.',
  `<span class="eyebrow">EMM201c · Chapter 11 · Lesson 11.1</span>
<h2>Rolling-contact bearings: rating life and selection</h2>
<h3>🎯 Objectives</h3>
<ul><li>Recognise the main bearing types and the loads they carry.</li><li>Compute the L<sub>10</sub> rating life in revolutions and hours.</li><li>Select a bearing's required dynamic load rating C for a target life.</li></ul>
<h3>Bearing types</h3>
<table>
<tr><th>Type</th><th>Loads</th><th>Typical use</th></tr>
<tr><td>Deep-groove ball</td><td>radial + moderate axial, high speed</td><td>electric motors, gearboxes, wheels of light robots</td></tr>
<tr><td>Angular-contact ball (in pairs)</td><td>combined, high axial, precise</td><td>machine-tool spindles, ball-screw supports</td></tr>
<tr><td>Cylindrical roller</td><td>high radial, little/no axial</td><td>gearbox shafts, traction motors</td></tr>
<tr><td>Tapered roller (in pairs)</td><td>high radial + axial</td><td>vehicle wheel hubs, differentials</td></tr>
<tr><td>Needle roller</td><td>radial, very small radial space</td><td>gearbox idlers, universal joints</td></tr>
</table>
<p>Even a perfectly made bearing eventually fails by <strong>rolling-contact fatigue</strong> (spalling of the races). Life is therefore statistical: the <strong>L<sub>10</sub> life</strong> (basic rating life) is the number of revolutions that 90 % of a large group of identical bearings will reach or exceed.</p>
<h3>Rating life equation</h3>
<div class="formula"><span class="lbl">Basic rating life (ISO 281)</span>L<sub>10</sub> = (C/P)<sup>a</sup> &nbsp;[millions of revolutions]; a = 3 for ball, a = 10/3 for roller bearings<br>In hours: L<sub>10h</sub> = 10<sup>6</sup>·L<sub>10</sub>/(60·n) &nbsp;(n in rpm)<br>Required rating: C = P·(60·n·L<sub>h</sub>/10<sup>6</sup>)<sup>1/a</sup></div>
<p>C (the <strong>basic dynamic load rating</strong>) is listed in every manufacturer's catalogue: the load giving L<sub>10</sub> = 10<sup>6</sup> revolutions. P is the <strong>equivalent dynamic load</strong>: P = F<sub>r</sub> for pure radial load, otherwise P = X·F<sub>r</sub> + Y·F<sub>a</sub> with X, Y from the catalogue (they depend on F<sub>a</sub>/F<sub>r</sub>).</p>
<div class="note-ct"><p>Because of the cube law, <strong>halving the load multiplies a ball bearing's life by 8</strong>; doubling the load divides it by 8. Shock loads should be multiplied by an application factor (1.2–3) before computing life.</p></div>
<h3>✍️ Worked example</h3>
<div class="callout"><p>A deep-groove ball bearing with C = 32.5 kN (a value typical of a 40 mm-bore medium-series bearing — always check the actual catalogue) carries a pure radial load P = 4 kN at 1450 rpm.</p>
<p>L<sub>10</sub> = (32.5/4)<sup>3</sup> = <b>536 million revolutions</b> ⇒ L<sub>10h</sub> = 536.4 × 10<sup>6</sup>/(60 × 1450) = <b>6165 h</b>.</p>
<p>For a machine running 8 h/day that is about 2 years — short for an industrial gearbox (typical targets 20 000–40 000 h). Required rating for 20 000 h: C = 4 × (60 × 1450 × 20 000/10<sup>6</sup>)<sup>1/3</sup> = 4 × 12.03 = <b>48.1 kN</b> ⇒ choose a bearing with C ≥ 48.1 kN (a larger series or bore).</p></div>
<h3>Practical points</h3>
<ul><li>Check the <strong>static rating C<sub>0</sub></strong> for slowly rotating or shock-loaded bearings.</li><li>Lubrication and cleanliness change the real life a lot (ISO 281 modified life a<sub>ISO</sub> factor) — seals matter in dusty or wet environments such as vehicle wheels.</li><li>Fits: the rotating ring is usually an interference fit; the stationary ring a looser fit. One bearing on a shaft locates axially, the other floats to allow thermal expansion.</li></ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using exponent 3 for roller bearings.</li><li>Forgetting that L<sub>10</sub> is in <em>millions</em> of revolutions.</li><li>Ignoring the axial load when computing P.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>L<sub>10</sub> = (C/P)<sup>a</sup> × 10<sup>6</sup> rev; a = 3 ball, 10/3 roller.</li><li>L<sub>10h</sub> = 10<sup>6</sup> L<sub>10</sub>/(60 n).</li><li>P = X F<sub>r</sub> + Y F<sub>a</sub> from the catalogue.</li><li>Required C = P (60 n L<sub>h</sub>/10<sup>6</sup>)<sup>1/a</sup>.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(WK + 'Rolling-element_bearing', 'Wikipedia — Rolling-element bearing (types, life)'),
    A(WK + 'Bearing_(mechanical)', 'Wikipedia — Bearing (mechanical)'),
    A(OCW_MD, 'MIT OCW 2.72 — Elements of Mechanical Design (bearings)'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A roller bearing has C/P = 2.5. Find L<sub>10</sub> and the life in hours at 3000 rpm.</li><li>A ball bearing's load is halved. By what factor does L<sub>10</sub> change?</li><li>F<sub>r</sub> = 3 kN, F<sub>a</sub> = 1.5 kN, X = 0.56, Y = 1.6. Find P.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 2.5<sup>10/3</sup> = 21.2 million rev ⇒ 21.2 × 10<sup>6</sup>/(60 × 3000) = 118 h. 2) × 8. 3) P = 0.56 × 3 + 1.6 × 1.5 = 4.08 kN.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 11 · Bài 11.1</span>
<h2>Ổ lăn: tuổi thọ danh định và cách chọn</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Nhận biết các loại ổ lăn chính và tải chúng chịu được.</li><li>Tính tuổi thọ danh định L<sub>10</sub> theo vòng quay và theo giờ.</li><li>Chọn tải trọng động C cần thiết cho tuổi thọ mục tiêu.</li></ul>
<h3>Các loại ổ lăn</h3>
<table>
<tr><th>Loại</th><th>Tải</th><th>Ứng dụng điển hình</th></tr>
<tr><td>Ổ bi đỡ (rãnh sâu)</td><td>hướng tâm + dọc trục vừa, tốc độ cao</td><td>động cơ điện, hộp số, bánh xe robot nhẹ</td></tr>
<tr><td>Ổ bi đỡ chặn (lắp cặp)</td><td>tổ hợp, dọc trục lớn, chính xác</td><td>trục chính máy công cụ, gối đỡ vít me bi</td></tr>
<tr><td>Ổ đũa trụ</td><td>hướng tâm lớn, ít/không dọc trục</td><td>trục hộp số, động cơ kéo</td></tr>
<tr><td>Ổ đũa côn (lắp cặp)</td><td>hướng tâm + dọc trục lớn</td><td>moay-ơ bánh xe ô tô, vi sai</td></tr>
<tr><td>Ổ kim</td><td>hướng tâm, không gian hướng kính rất nhỏ</td><td>bánh răng trung gian hộp số, khớp các-đăng</td></tr>
</table>
<p>Ngay cả ổ chế tạo hoàn hảo cuối cùng cũng hỏng do <strong>mỏi tiếp xúc lăn</strong> (tróc rỗ đường lăn). Vì vậy tuổi thọ mang tính thống kê: <strong>tuổi thọ L<sub>10</sub></strong> (tuổi thọ danh định cơ bản) là số vòng quay mà 90 % của một nhóm lớn ổ giống hệt nhau đạt được hoặc vượt qua.</p>
<h3>Phương trình tuổi thọ</h3>
<div class="formula"><span class="lbl">Tuổi thọ danh định cơ bản (ISO 281)</span>L<sub>10</sub> = (C/P)<sup>a</sup> &nbsp;[triệu vòng]; a = 3 với ổ bi, a = 10/3 với ổ đũa<br>Theo giờ: L<sub>10h</sub> = 10<sup>6</sup>·L<sub>10</sub>/(60·n) &nbsp;(n theo vòng/phút)<br>Tải trọng động cần thiết: C = P·(60·n·L<sub>h</sub>/10<sup>6</sup>)<sup>1/a</sup></div>
<p>C (<strong>tải trọng động cơ bản</strong>) có trong catalogue của mọi nhà sản xuất: tải cho L<sub>10</sub> = 10<sup>6</sup> vòng. P là <strong>tải trọng động tương đương</strong>: P = F<sub>r</sub> khi chỉ có tải hướng tâm, ngược lại P = X·F<sub>r</sub> + Y·F<sub>a</sub> với X, Y tra catalogue (phụ thuộc F<sub>a</sub>/F<sub>r</sub>).</p>
<div class="note-ct"><p>Do luật mũ ba, <strong>giảm tải một nửa thì tuổi thọ ổ bi tăng 8 lần</strong>; tăng tải gấp đôi thì tuổi thọ giảm 8 lần. Tải va đập phải nhân hệ số ứng dụng (1,2–3) trước khi tính tuổi thọ.</p></div>
<h3>✍️ Ví dụ giải</h3>
<div class="callout"><p>Ổ bi đỡ có C = 32,5 kN (giá trị điển hình của ổ cỡ trung, đường kính trong 40 mm — luôn kiểm trong catalogue thật) chịu tải hướng tâm thuần P = 4 kN ở 1450 vòng/phút.</p>
<p>L<sub>10</sub> = (32,5/4)<sup>3</sup> = <b>536 triệu vòng</b> ⇒ L<sub>10h</sub> = 536,4 × 10<sup>6</sup>/(60 × 1450) = <b>6165 giờ</b>.</p>
<p>Với máy chạy 8 giờ/ngày, đó là khoảng 2 năm — ngắn với hộp số công nghiệp (mục tiêu điển hình 20 000–40 000 giờ). Tải trọng động cần cho 20 000 giờ: C = 4 × (60 × 1450 × 20 000/10<sup>6</sup>)<sup>1/3</sup> = 4 × 12,03 = <b>48,1 kN</b> ⇒ chọn ổ có C ≥ 48,1 kN (cỡ lớn hơn hoặc đường kính trong lớn hơn).</p></div>
<h3>Lưu ý thực tế</h3>
<ul><li>Kiểm <strong>tải trọng tĩnh C<sub>0</sub></strong> với ổ quay chậm hoặc chịu va đập.</li><li>Bôi trơn và độ sạch thay đổi tuổi thọ thực rất nhiều (hệ số tuổi thọ hiệu chỉnh a<sub>ISO</sub> trong ISO 281) — phớt chắn rất quan trọng ở môi trường bụi, ướt như bánh xe ô tô.</li><li>Lắp ghép: vòng quay thường lắp có độ dôi; vòng đứng yên lắp lỏng hơn. Một ổ trên trục định vị dọc trục, ổ kia tuỳ động để cho phép giãn nở nhiệt.</li></ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng số mũ 3 cho ổ đũa.</li><li>Quên rằng L<sub>10</sub> tính theo <em>triệu</em> vòng.</li><li>Bỏ qua tải dọc trục khi tính P.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>L<sub>10</sub> = (C/P)<sup>a</sup> × 10<sup>6</sup> vòng; a = 3 ổ bi, 10/3 ổ đũa.</li><li>L<sub>10h</sub> = 10<sup>6</sup> L<sub>10</sub>/(60 n).</li><li>P = X F<sub>r</sub> + Y F<sub>a</sub> tra catalogue.</li><li>C cần = P (60 n L<sub>h</sub>/10<sup>6</sup>)<sup>1/a</sup>.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(WK + 'Rolling-element_bearing', 'Wikipedia — Ổ lăn (các loại, tuổi thọ)'),
    A(WK + 'Bearing_(mechanical)', 'Wikipedia — Ổ đỡ (cơ khí)'),
    A(OCW_MD, 'MIT OCW 2.72 — Elements of Mechanical Design (ổ lăn)'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Ổ đũa có C/P = 2,5. Tìm L<sub>10</sub> và tuổi thọ theo giờ ở 3000 vòng/phút.</li><li>Tải trên ổ bi giảm một nửa. L<sub>10</sub> thay đổi bao nhiêu lần?</li><li>F<sub>r</sub> = 3 kN, F<sub>a</sub> = 1,5 kN, X = 0,56, Y = 1,6. Tìm P.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 2,5<sup>10/3</sup> = 21,2 triệu vòng ⇒ 21,2 × 10<sup>6</sup>/(60 × 3000) = 118 giờ. 2) × 8. 3) P = 0,56 × 3 + 1,6 × 1,5 = 4,08 kN.</p></div>`);

const c112 = L('emm201c-ts-11-2',
  '11.2 — Spur gears: geometry, forces and Lewis bending stress|||11.2 — Bánh răng trụ răng thẳng: hình học, lực và ứng suất uốn Lewis',
  'Biên dạng thân khai, môđun m, d = m·z, bước p = πm, khoảng cách trục; góc áp lực 20°; lực vòng Ft = 2T/d, lực hướng tâm Fr = Ft·tan20°; công thức Lewis σ = Ft/(b·m·Y) và hệ số tốc độ Kv; cắt chân răng.',
  `<span class="eyebrow">EMM201c · Chapter 11 · Lesson 11.2</span>
<h2>Spur gears: geometry, forces and Lewis bending stress</h2>
<h3>🎯 Objectives</h3>
<ul><li>Use the metric module system to compute gear dimensions and centre distance.</li><li>Find tangential and radial tooth forces from power and speed.</li><li>Estimate tooth bending stress with the Lewis equation and a velocity factor.</li></ul>
<h3>Geometry (metric)</h3>
<p>Spur gears have straight teeth parallel to the axis. Their tooth profile is an <strong>involute</strong>, which gives a constant speed ratio even if the centre distance changes slightly. The tooth size is set by the <strong>module</strong> m (mm): gears mesh only if they have the same module and pressure angle (standard φ = 20°).</p>
<div class="formula"><span class="lbl">Spur-gear geometry</span>Pitch diameter d = m·z &nbsp; Circular pitch p = π·m &nbsp; Addendum = m, dedendum = 1.25 m<br>Centre distance a = m(z<sub>1</sub> + z<sub>2</sub>)/2 &nbsp; Ratio i = z<sub>2</sub>/z<sub>1</sub></div>
<p>A pinion with too few teeth suffers <strong>undercutting</strong> (the cutter removes the base of the tooth): for 20° full-depth teeth, about 17 teeth is the minimum when cut by a rack-type tool (fewer if the mating gear is small, or with profile shift).</p>
<h3>Tooth forces</h3>
<p>The tooth force acts along the line of action, inclined by φ to the pitch-line tangent. Its components:</p>
<div class="formula"><span class="lbl">Tooth forces</span>Tangential (transmits power): F<sub>t</sub> = 2T/d = P/v, &nbsp; pitch-line speed v = π d n/60<br>Radial (separates the gears, loads the shafts): F<sub>r</sub> = F<sub>t</sub>·tan φ<br>Total: F = F<sub>t</sub>/cos φ</div>
<h3>Lewis bending equation</h3>
<p>Lewis modelled a tooth as a cantilever loaded at its tip; the form factor Y (from tables, depends on z) captures the tooth shape:</p>
<div class="formula"><span class="lbl">Lewis equation (SI)</span>σ = K<sub>v</sub>·F<sub>t</sub> / (b·m·Y)<br>Velocity factor (Shigley, hobbed or shaped teeth): K<sub>v</sub> = (3.56 + √v)/3.56, v in m/s<br>Y (20° full depth): z = 20 → 0.322; z = 30 → 0.359; z = 60 → 0.422</div>
<p>Lewis is a first sizing tool. Final design uses the AGMA (or ISO 6336) bending and <strong>contact (pitting)</strong> equations with many more factors; surface durability often governs hardened gears.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p>A 5 kW motor at 1450 rpm drives a pinion z<sub>1</sub> = 20 meshing with a gear z<sub>2</sub> = 60; m = 3 mm, face width b = 30 mm, φ = 20°.</p>
<p>d<sub>1</sub> = 60 mm, d<sub>2</sub> = 180 mm, a = 3 × 80/2 = <b>120 mm</b>, i = 3 ⇒ gear speed 483 rpm.</p>
<p>T<sub>1</sub> = 5000/(2π × 1450/60) = <b>32.9 N·m</b>; F<sub>t</sub> = 2 × 32.93/0.060 = <b>1098 N</b>; F<sub>r</sub> = 1098 × tan 20° = <b>400 N</b>.</p>
<p>v = π × 0.060 × 1450/60 = <b>4.56 m/s</b>; K<sub>v</sub> = (3.56 + √4.56)/3.56 = <b>1.60</b>.</p>
<p>σ = 1.60 × 1098/(30 × 3 × 0.322) = <b>60.6 MPa</b> (37.9 MPa without K<sub>v</sub>). For a through-hardened steel with allowable bending stress of a few hundred MPa this pinion is comfortably safe in bending; contact stress would be checked next.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Meshing gears of different module or pressure angle.</li><li>Using the outside diameter instead of the pitch diameter in F<sub>t</sub> = 2T/d.</li><li>Forgetting the radial force when designing the shafts and bearings.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>d = m z, a = m(z<sub>1</sub> + z<sub>2</sub>)/2, i = z<sub>2</sub>/z<sub>1</sub>.</li><li>F<sub>t</sub> = 2T/d = P/v; F<sub>r</sub> = F<sub>t</sub> tan 20°.</li><li>Lewis: σ = K<sub>v</sub> F<sub>t</sub>/(b m Y).</li><li>Final design: AGMA/ISO bending + contact checks.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A('https://khkgears.net/new/gear_knowledge/introduction_to_gears/', 'KHK Gears — Introduction to gears'),
    A('https://khkgears.net/new/gear_knowledge/gear_technical_reference/', 'KHK Gears — Gear technical reference'),
    A(WK + 'Involute_gear', 'Wikipedia — Involute gear'),
    A(WK + 'Gear', 'Wikipedia — Gear'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>Gears with m = 2 mm, z<sub>1</sub> = 25, z<sub>2</sub> = 75. Find d<sub>1</sub>, d<sub>2</sub>, a and p.</li><li>The 25-tooth pinion transmits 50 N·m. Find F<sub>t</sub> and F<sub>r</sub>.</li><li>A 30-tooth gear (Y = 0.359), m = 2 mm, b = 25 mm carries F<sub>t</sub> = 2000 N. Lewis stress without K<sub>v</sub>?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) d<sub>1</sub> = 50 mm, d<sub>2</sub> = 150 mm, a = 100 mm, p = 6.28 mm. 2) F<sub>t</sub> = 2 × 50/0.05 = 2000 N; F<sub>r</sub> = 728 N. 3) σ = 2000/(25 × 2 × 0.359) = 111 MPa.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 11 · Bài 11.2</span>
<h2>Bánh răng trụ răng thẳng: hình học, lực và ứng suất uốn Lewis</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Dùng hệ môđun để tính kích thước bánh răng và khoảng cách trục.</li><li>Tìm lực vòng và lực hướng tâm trên răng từ công suất và tốc độ.</li><li>Ước lượng ứng suất uốn chân răng bằng công thức Lewis và hệ số tốc độ.</li></ul>
<h3>Hình học (hệ mét)</h3>
<p>Bánh răng trụ răng thẳng có răng thẳng song song trục. Biên dạng răng là <strong>đường thân khai</strong>, cho tỉ số truyền không đổi ngay cả khi khoảng cách trục thay đổi nhẹ. Kích thước răng do <strong>môđun</strong> m (mm) quyết định: hai bánh chỉ ăn khớp được khi cùng môđun và cùng góc áp lực (chuẩn φ = 20°).</p>
<div class="formula"><span class="lbl">Hình học bánh răng trụ</span>Đường kính vòng chia d = m·z &nbsp; Bước răng p = π·m &nbsp; Chiều cao đầu răng = m, chân răng = 1,25 m<br>Khoảng cách trục a = m(z<sub>1</sub> + z<sub>2</sub>)/2 &nbsp; Tỉ số truyền i = z<sub>2</sub>/z<sub>1</sub></div>
<p>Bánh nhỏ có quá ít răng bị <strong>cắt chân răng</strong> (dao cắt lẹm vào chân răng): với răng 20° chiều cao chuẩn, khoảng 17 răng là tối thiểu khi gia công bằng dao kiểu thanh răng (ít hơn nếu bánh ăn khớp nhỏ, hoặc khi dịch chỉnh).</p>
<h3>Lực trên răng</h3>
<p>Lực ăn khớp tác dụng theo đường ăn khớp, nghiêng góc φ so với tiếp tuyến vòng chia. Các thành phần:</p>
<div class="formula"><span class="lbl">Lực trên răng</span>Lực vòng (truyền công suất): F<sub>t</sub> = 2T/d = P/v, &nbsp; vận tốc vòng chia v = π d n/60<br>Lực hướng tâm (đẩy hai bánh ra xa, gây tải lên trục): F<sub>r</sub> = F<sub>t</sub>·tan φ<br>Tổng: F = F<sub>t</sub>/cos φ</div>
<h3>Công thức uốn Lewis</h3>
<p>Lewis mô hình răng như dầm công-xôn chịu lực ở đỉnh; hệ số dạng răng Y (tra bảng, phụ thuộc z) thể hiện hình dạng răng:</p>
<div class="formula"><span class="lbl">Công thức Lewis (SI)</span>σ = K<sub>v</sub>·F<sub>t</sub> / (b·m·Y)<br>Hệ số tốc độ (Shigley, răng phay lăn hoặc xọc): K<sub>v</sub> = (3,56 + √v)/3,56, v theo m/s<br>Y (20° chiều cao chuẩn): z = 20 → 0,322; z = 30 → 0,359; z = 60 → 0,422</div>
<p>Lewis là công cụ chọn sơ bộ. Thiết kế cuối dùng công thức uốn và <strong>tiếp xúc (tróc rỗ)</strong> của AGMA (hoặc ISO 6336) với nhiều hệ số hơn; với bánh răng tôi cứng, độ bền bề mặt thường quyết định.</p>
<h3>✍️ Ví dụ giải</h3>
<div class="callout"><p>Động cơ 5 kW, 1450 vòng/phút dẫn bánh nhỏ z<sub>1</sub> = 20 ăn khớp bánh lớn z<sub>2</sub> = 60; m = 3 mm, bề rộng vành b = 30 mm, φ = 20°.</p>
<p>d<sub>1</sub> = 60 mm, d<sub>2</sub> = 180 mm, a = 3 × 80/2 = <b>120 mm</b>, i = 3 ⇒ bánh lớn quay 483 vòng/phút.</p>
<p>T<sub>1</sub> = 5000/(2π × 1450/60) = <b>32,9 N·m</b>; F<sub>t</sub> = 2 × 32,93/0,060 = <b>1098 N</b>; F<sub>r</sub> = 1098 × tan 20° = <b>400 N</b>.</p>
<p>v = π × 0,060 × 1450/60 = <b>4,56 m/s</b>; K<sub>v</sub> = (3,56 + √4,56)/3,56 = <b>1,60</b>.</p>
<p>σ = 1,60 × 1098/(30 × 3 × 0,322) = <b>60,6 MPa</b> (37,9 MPa khi chưa có K<sub>v</sub>). Với thép tôi thể tích có ứng suất uốn cho phép vài trăm MPa, bánh nhỏ này an toàn dư về uốn; bước tiếp theo là kiểm ứng suất tiếp xúc.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Cho ăn khớp hai bánh khác môđun hoặc khác góc áp lực.</li><li>Dùng đường kính đỉnh thay cho đường kính vòng chia trong F<sub>t</sub> = 2T/d.</li><li>Quên lực hướng tâm khi thiết kế trục và ổ.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>d = m z, a = m(z<sub>1</sub> + z<sub>2</sub>)/2, i = z<sub>2</sub>/z<sub>1</sub>.</li><li>F<sub>t</sub> = 2T/d = P/v; F<sub>r</sub> = F<sub>t</sub> tan 20°.</li><li>Lewis: σ = K<sub>v</sub> F<sub>t</sub>/(b m Y).</li><li>Thiết kế cuối: kiểm uốn + tiếp xúc theo AGMA/ISO.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A('https://khkgears.net/new/gear_knowledge/introduction_to_gears/', 'KHK Gears — Nhập môn bánh răng'),
    A('https://khkgears.net/new/gear_knowledge/gear_technical_reference/', 'KHK Gears — Tài liệu kỹ thuật bánh răng'),
    A(WK + 'Involute_gear', 'Wikipedia — Bánh răng thân khai'),
    A(WK + 'Gear', 'Wikipedia — Bánh răng'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Cặp bánh răng m = 2 mm, z<sub>1</sub> = 25, z<sub>2</sub> = 75. Tìm d<sub>1</sub>, d<sub>2</sub>, a và p.</li><li>Bánh nhỏ 25 răng truyền 50 N·m. Tìm F<sub>t</sub> và F<sub>r</sub>.</li><li>Bánh 30 răng (Y = 0,359), m = 2 mm, b = 25 mm chịu F<sub>t</sub> = 2000 N. Ứng suất Lewis khi chưa có K<sub>v</sub>?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) d<sub>1</sub> = 50 mm, d<sub>2</sub> = 150 mm, a = 100 mm, p = 6,28 mm. 2) F<sub>t</sub> = 2 × 50/0,05 = 2000 N; F<sub>r</sub> = 728 N. 3) σ = 2000/(25 × 2 × 0,359) = 111 MPa.</p></div>`);

const c113 = L('emm201c-ts-11-3',
  '11.3 — Belt and chain drives|||11.3 — Bộ truyền đai và bộ truyền xích',
  'Đai phẳng, đai thang, đai răng; tỉ số truyền, chiều dài đai, góc ôm; lực căng hai nhánh, F1/F2 = e^(μθ), hệ số ma sát tương đương đai thang; xích con lăn: bước, đường kính đĩa, vận tốc, hiệu ứng đa giác.',
  `<span class="eyebrow">EMM201c · Chapter 11 · Lesson 11.3</span>
<h2>Belt and chain drives</h2>
<h3>🎯 Objectives</h3>
<ul><li>Compute speed ratio, belt length and wrap angle of an open belt drive.</li><li>Find the belt tensions needed to transmit a given power.</li><li>Compute chain speed, sprocket diameter and the polygonal (chordal) speed variation.</li></ul>
<h3>Belt drives</h3>
<p>Belts transmit power between shafts that are far apart, cheaply and quietly, and they absorb shocks. <strong>Flat belts</strong> and <strong>V-belts</strong> work by friction and slip slightly (≈ 1–2 %); <strong>timing (toothed) belts</strong> do not slip and are used in 3D printers, robot axes and engine camshafts.</p>
<div class="formula"><span class="lbl">Open-belt geometry (pulleys d, D; centre distance C)</span>Speed ratio n<sub>1</sub>/n<sub>2</sub> ≈ D/d &nbsp;&nbsp; Belt speed v = π d n<sub>1</sub>/60<br>Wrap angle on the small pulley θ = π − 2 arcsin[(D − d)/(2C)]<br>Belt length L ≈ 2C + π(D + d)/2 + (D − d)<sup>2</sup>/(4C)</div>
<p>Power is transmitted by the <strong>difference</strong> between tight-side tension F<sub>1</sub> and slack-side tension F<sub>2</sub>. At the slip limit (ignoring centrifugal tension), the capstan law of lesson 4.2 applies; a V-belt wedging in a groove of angle 2β behaves as if friction were μ′ = μ/sin β:</p>
<div class="formula"><span class="lbl">Belt tensions</span>P = (F<sub>1</sub> − F<sub>2</sub>)·v &nbsp;&nbsp; F<sub>1</sub>/F<sub>2</sub> = e<sup>μ′θ</sup> &nbsp; (flat belt: μ′ = μ; V-belt: μ′ = μ/sin β)</div>
<h3>✍️ Example 1 — V-belt drive</h3>
<div class="callout"><p>A 3 kW, 1450 rpm motor drives a fan: d = 100 mm, D = 300 mm, C = 500 mm, V-belt groove angle 38° (β = 19°), μ = 0.3.</p>
<p>Ratio 3 ⇒ fan speed ≈ <b>483 rpm</b>. v = π × 0.1 × 1450/60 = <b>7.59 m/s</b>.</p>
<p>θ = π − 2 arcsin(200/1000) = <b>2.739 rad (156.9°)</b>; L = 1000 + 628.3 + 20 = <b>1648 mm</b> ⇒ choose the nearest standard length and adjust C.</p>
<p>μ′ = 0.3/sin 19° = 0.921 ⇒ F<sub>1</sub>/F<sub>2</sub> = e<sup>0.921 × 2.739</sup> = <b>12.5</b>.</p>
<p>F<sub>1</sub> − F<sub>2</sub> = 3000/7.59 = <b>395 N</b> ⇒ F<sub>2</sub> = 395/11.5 = <b>34 N</b>, F<sub>1</sub> = <b>430 N</b> at the slip limit. In practice the belt is pre-tensioned above this (service factor) so that it never slips; the shaft and bearings carry roughly F<sub>1</sub> + F<sub>2</sub>.</p>
<p>Compare a flat belt (μ′ = 0.3) on the same pulleys: ratio only e<sup>0.3 × 2.739</sup> = 2.27 — the V-groove multiplies grip several times.</p></div>
<h3>Chain drives</h3>
<p>Roller chains give a positive (non-slip) drive with high efficiency (≈ 98 %), for motorcycles, conveyors and mobile robots. Chains are specified by pitch p — e.g. ANSI/ISO No. 40 has p = 12.7 mm (½ in).</p>
<div class="formula"><span class="lbl">Chain kinematics</span>Sprocket pitch diameter D = p / sin(180°/N) &nbsp; Average chain speed v = N·p·n/60<br>Chordal speed variation ≈ 1 − cos(180°/N) &nbsp; Ratio n<sub>1</sub>/n<sub>2</sub> = N<sub>2</sub>/N<sub>1</sub></div>
<div class="callout"><p><b>Example 2.</b> A No. 40 chain on a 17-tooth sprocket at 500 rpm: D = 12.7/sin(10.59°) = <b>69.1 mm</b>; v = 17 × 0.0127 × 500/60 = <b>1.80 m/s</b>; chordal speed variation 1 − cos 10.59° = <b>1.7 %</b>. More teeth (≥ 17–21 on the small sprocket) means smoother, quieter running and longer chain life.</p></div>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the wrap angle of the large pulley (the small one slips first).</li><li>Using μ instead of μ/sin β for V-belts.</li><li>Choosing very small sprockets (strong polygon effect, noise, wear).</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>Belt: ratio ≈ D/d; θ and L from geometry.</li><li>P = (F<sub>1</sub> − F<sub>2</sub>) v; F<sub>1</sub>/F<sub>2</sub> = e<sup>μ′θ</sup>.</li><li>V-belts grip better (μ′ = μ/sin β); timing belts and chains do not slip.</li><li>Chain: D = p/sin(180°/N); speed fluctuation 1 − cos(180°/N).</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(WK + 'Belt_(mechanical)', 'Wikipedia — Belt (mechanical)'),
    A(WK + 'Roller_chain', 'Wikipedia — Roller chain'),
    A(ES + 'Chapter_09-flexible-belt-friction.html', 'Engineering Statics — Flexible belts (friction)'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A 125 mm motor pulley at 1450 rpm drives a 250 mm pulley. Driven speed (no slip)?</li><li>A flat belt (θ = 180°, μ = 0.3) transmits 2 kW at 10 m/s. Find F<sub>2</sub> and F<sub>1</sub> at the slip limit.</li><li>A No. 50 chain (p = 15.875 mm) on a 21-tooth sprocket at 300 rpm. Find v and D.</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) 725 rpm. 2) F<sub>1</sub>/F<sub>2</sub> = e<sup>0.3π</sup> = 2.57; F<sub>1</sub> − F<sub>2</sub> = 200 N ⇒ F<sub>2</sub> = 127.7 N, F<sub>1</sub> = 327.7 N. 3) v = 21 × 0.015875 × 300/60 = 1.67 m/s; D = 15.875/sin(8.57°) = 106.5 mm.</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 11 · Bài 11.3</span>
<h2>Bộ truyền đai và bộ truyền xích</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính tỉ số truyền, chiều dài đai và góc ôm của bộ truyền đai thường.</li><li>Tìm lực căng đai cần để truyền một công suất cho trước.</li><li>Tính vận tốc xích, đường kính đĩa xích và dao động vận tốc do hiệu ứng đa giác.</li></ul>
<h3>Bộ truyền đai</h3>
<p>Đai truyền công suất giữa hai trục ở xa nhau, rẻ và êm, đồng thời hấp thụ va đập. <strong>Đai phẳng</strong> và <strong>đai thang</strong> làm việc nhờ ma sát và trượt nhẹ (≈ 1–2 %); <strong>đai răng</strong> không trượt và được dùng ở máy in 3D, trục robot và trục cam động cơ.</p>
<div class="formula"><span class="lbl">Hình học bộ truyền đai thường (puli d, D; khoảng cách trục C)</span>Tỉ số truyền n<sub>1</sub>/n<sub>2</sub> ≈ D/d &nbsp;&nbsp; Vận tốc đai v = π d n<sub>1</sub>/60<br>Góc ôm trên puli nhỏ θ = π − 2 arcsin[(D − d)/(2C)]<br>Chiều dài đai L ≈ 2C + π(D + d)/2 + (D − d)<sup>2</sup>/(4C)</div>
<p>Công suất được truyền nhờ <strong>hiệu</strong> giữa lực căng nhánh căng F<sub>1</sub> và nhánh chùng F<sub>2</sub>. Ở giới hạn trượt (bỏ qua lực căng li tâm), áp dụng định luật dây quấn của bài 4.2; đai thang chêm vào rãnh góc 2β làm việc như thể hệ số ma sát là μ′ = μ/sin β:</p>
<div class="formula"><span class="lbl">Lực căng đai</span>P = (F<sub>1</sub> − F<sub>2</sub>)·v &nbsp;&nbsp; F<sub>1</sub>/F<sub>2</sub> = e<sup>μ′θ</sup> &nbsp; (đai phẳng: μ′ = μ; đai thang: μ′ = μ/sin β)</div>
<h3>✍️ Ví dụ 1 — bộ truyền đai thang</h3>
<div class="callout"><p>Động cơ 3 kW, 1450 vòng/phút dẫn quạt: d = 100 mm, D = 300 mm, C = 500 mm, góc rãnh đai thang 38° (β = 19°), μ = 0,3.</p>
<p>Tỉ số 3 ⇒ quạt quay ≈ <b>483 vòng/phút</b>. v = π × 0,1 × 1450/60 = <b>7,59 m/s</b>.</p>
<p>θ = π − 2 arcsin(200/1000) = <b>2,739 rad (156,9°)</b>; L = 1000 + 628,3 + 20 = <b>1648 mm</b> ⇒ chọn chiều dài chuẩn gần nhất rồi chỉnh C.</p>
<p>μ′ = 0,3/sin 19° = 0,921 ⇒ F<sub>1</sub>/F<sub>2</sub> = e<sup>0,921 × 2,739</sup> = <b>12,5</b>.</p>
<p>F<sub>1</sub> − F<sub>2</sub> = 3000/7,59 = <b>395 N</b> ⇒ F<sub>2</sub> = 395/11,5 = <b>34 N</b>, F<sub>1</sub> = <b>430 N</b> ở giới hạn trượt. Thực tế đai được căng trước lớn hơn mức này (hệ số chế độ) để không bao giờ trượt; trục và ổ chịu khoảng F<sub>1</sub> + F<sub>2</sub>.</p>
<p>So với đai phẳng (μ′ = 0,3) trên cùng puli: tỉ số chỉ e<sup>0,3 × 2,739</sup> = 2,27 — rãnh chữ V tăng độ bám lên nhiều lần.</p></div>
<h3>Bộ truyền xích</h3>
<p>Xích con lăn cho truyền động ăn khớp (không trượt) với hiệu suất cao (≈ 98 %), dùng cho xe máy, băng tải và robot di động. Xích được ký hiệu theo bước p — ví dụ xích ANSI/ISO số 40 có p = 12,7 mm (½ in).</p>
<div class="formula"><span class="lbl">Động học xích</span>Đường kính vòng chia đĩa xích D = p / sin(180°/N) &nbsp; Vận tốc xích trung bình v = N·p·n/60<br>Dao động vận tốc do đa giác ≈ 1 − cos(180°/N) &nbsp; Tỉ số n<sub>1</sub>/n<sub>2</sub> = N<sub>2</sub>/N<sub>1</sub></div>
<div class="callout"><p><b>Ví dụ 2.</b> Xích số 40 trên đĩa 17 răng quay 500 vòng/phút: D = 12,7/sin(10,59°) = <b>69,1 mm</b>; v = 17 × 0,0127 × 500/60 = <b>1,80 m/s</b>; dao động vận tốc 1 − cos 10,59° = <b>1,7 %</b>. Nhiều răng hơn (≥ 17–21 trên đĩa nhỏ) nghĩa là chạy êm hơn, ít ồn hơn và xích bền hơn.</p></div>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng góc ôm của puli lớn (puli nhỏ trượt trước).</li><li>Dùng μ thay cho μ/sin β với đai thang.</li><li>Chọn đĩa xích quá nhỏ (hiệu ứng đa giác mạnh, ồn, mòn).</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>Đai: tỉ số ≈ D/d; θ và L từ hình học.</li><li>P = (F<sub>1</sub> − F<sub>2</sub>) v; F<sub>1</sub>/F<sub>2</sub> = e<sup>μ′θ</sup>.</li><li>Đai thang bám tốt hơn (μ′ = μ/sin β); đai răng và xích không trượt.</li><li>Xích: D = p/sin(180°/N); dao động vận tốc 1 − cos(180°/N).</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(WK + 'Belt_(mechanical)', 'Wikipedia — Đai truyền (cơ khí)'),
    A(WK + 'Roller_chain', 'Wikipedia — Xích con lăn'),
    A(ES + 'Chapter_09-flexible-belt-friction.html', 'Engineering Statics — Ma sát đai mềm'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Puli động cơ 125 mm quay 1450 vòng/phút dẫn puli 250 mm. Tốc độ bị dẫn (không trượt)?</li><li>Đai phẳng (θ = 180°, μ = 0,3) truyền 2 kW ở 10 m/s. Tìm F<sub>2</sub> và F<sub>1</sub> ở giới hạn trượt.</li><li>Xích số 50 (p = 15,875 mm) trên đĩa 21 răng quay 300 vòng/phút. Tìm v và D.</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) 725 vòng/phút. 2) F<sub>1</sub>/F<sub>2</sub> = e<sup>0,3π</sup> = 2,57; F<sub>1</sub> − F<sub>2</sub> = 200 N ⇒ F<sub>2</sub> = 127,7 N, F<sub>1</sub> = 327,7 N. 3) v = 21 × 0,015875 × 300/60 = 1,67 m/s; D = 15,875/sin(8,57°) = 106,5 mm.</p></div>`);

const c114 = L('emm201c-ts-11-4',
  '11.4 — Helical compression springs|||11.4 — Lò xo nén xoắn ốc',
  'Thông số lò xo (d, D, C = D/d, số vòng làm việc Na); độ cứng k = d⁴G/(8D³Na); ứng suất cắt với hệ số Bergsträsser/Wahl; độ bền dây lò xo Sut = A/d^m; hệ số an toàn; ghép nối tiếp/song song; ổn định và cộng hưởng.',
  `<span class="eyebrow">EMM201c · Chapter 11 · Lesson 11.4</span>
<h2>Helical compression springs</h2>
<h3>🎯 Objectives</h3>
<ul><li>Compute the rate (stiffness) of a helical compression spring.</li><li>Compute its maximum shear stress with a curvature correction factor.</li><li>Check the spring with the wire's strength and combine springs in series and parallel.</li></ul>
<h3>Geometry and rate</h3>
<p>A helical compression spring is a wire of diameter d wound on a mean coil diameter D, with N<sub>a</sub> active coils. The <strong>spring index</strong> C = D/d is usually 4–12 (easy to make, not too stiff or tangle-prone). Although the spring is compressed, the <strong>wire is loaded in torsion</strong>.</p>
<div class="formula"><span class="lbl">Spring rate</span>k = F/y = d<sup>4</sup>·G / (8·D<sup>3</sup>·N<sub>a</sub>) &nbsp;(steel spring wire: G ≈ 79–81 GPa)</div>
<h3>Stress</h3>
<p>The wire carries a torque F·D/2 plus a direct shear; the inner side of the coil is also more strained because of curvature. Shigley combines these effects in one factor:</p>
<div class="formula"><span class="lbl">Maximum shear stress</span>τ = K<sub>B</sub>·8F·D / (π d<sup>3</sup>) &nbsp;&nbsp; Bergsträsser K<sub>B</sub> = (4C + 2)/(4C − 3) &nbsp;(Wahl factor K<sub>W</sub> = (4C − 1)/(4C − 4) + 0.615/C is almost the same)</div>
<h3>Wire strength</h3>
<p>Thin wire is stronger (cold drawing): S<sub>ut</sub> = A/d<sup>m</sup>. For <strong>music wire</strong> Shigley gives A = 2211 MPa·mm<sup>m</sup>, m = 0.145. Torsional yield for compression springs is about S<sub>sy</sub> ≈ 0.45 S<sub>ut</sub> (music wire, set not removed). Springs loaded by fluctuating forces (valve springs, suspension) must also be checked for fatigue.</p>
<h3>✍️ Worked example</h3>
<div class="callout"><p>Music wire, d = 3 mm, D = 24 mm, N<sub>a</sub> = 10, G = 81 GPa, maximum force F = 100 N.</p>
<p>C = 24/3 = 8. k = 3<sup>4</sup> × 81 000/(8 × 24<sup>3</sup> × 10) = <b>5.93 N/mm</b> ⇒ deflection at 100 N: y = 100/5.93 = <b>16.9 mm</b>.</p>
<p>K<sub>B</sub> = (32 + 2)/(32 − 3) = <b>1.172</b> (Wahl: 1.184). τ = 1.172 × 8 × 100 × 24/(π × 3<sup>3</sup>) = <b>265 MPa</b>.</p>
<p>S<sub>ut</sub> = 2211/3<sup>0.145</sup> = <b>1885 MPa</b>; S<sub>sy</sub> ≈ 0.45 × 1885 = 848 MPa ⇒ <b>n = 848/265 = 3.2</b>. A good design also checks the stress when the spring is compressed solid (closed coils), so that an accidental full compression does not yield it.</p></div>
<h3>Springs in combination</h3>
<div class="formula"><span class="lbl">Combination</span>Parallel (share deflection): k = k<sub>1</sub> + k<sub>2</sub> &nbsp;&nbsp; Series (share force): 1/k = 1/k<sub>1</sub> + 1/k<sub>2</sub></div>
<p>Two of the springs above in parallel give 11.86 N/mm; in series 2.97 N/mm. A car suspension corner is a spring in series with the tyre's own stiffness.</p>
<h3>Design notes</h3>
<ul><li><strong>Buckling</strong>: long, slender compression springs (free length &gt; about 4 D) buckle sideways unless guided by a rod or tube.</li><li><strong>Surge</strong>: if the load frequency is near the spring's natural frequency, coils resonate (engine valve springs) — keep the natural frequency well above the forcing frequency.</li><li>End types (plain, squared, squared-and-ground) change the number of inactive coils and the solid length.</li></ul>
<h3>⚠️ Common mistakes</h3>
<div class="pitfall"><ul><li>Using the outside diameter instead of the mean coil diameter D.</li><li>Counting inactive end coils in N<sub>a</sub>.</li><li>Forgetting that d appears to the 4th power in k and the 3rd in τ — small changes in d matter a lot.</li></ul></div>
<h3>📌 Summary</h3>
<ul><li>k = d<sup>4</sup>G/(8D<sup>3</sup>N<sub>a</sub>); C = D/d ≈ 4–12.</li><li>τ = K<sub>B</sub> 8FD/(πd<sup>3</sup>).</li><li>S<sub>ut</sub> = A/d<sup>m</sup>; S<sub>sy</sub> ≈ 0.45 S<sub>ut</sub> (music wire).</li><li>Parallel adds k; series adds 1/k. Check buckling and surge.</li></ul>
<h3>🔗 Further learning</h3>` + UL([
    A(WK + 'Coil_spring', 'Wikipedia — Coil spring'),
    A(WK + 'Spring_(device)', 'Wikipedia — Spring (device)'),
    A(WK + 'Hooke%27s_law', 'Wikipedia — Hooke\'s law'),
  ]) + `
<h3>🧪 Practice</h3>
<ol><li>A spring with d = 2 mm, D = 16 mm, N<sub>a</sub> = 8, G = 81 GPa. Find k.</li><li>For that spring at F = 50 N, find τ (K<sub>B</sub> with C = 8).</li><li>Two springs of 5.93 N/mm in series: combined rate?</li></ol>
<div class="dap-an"><p><strong>Answers.</strong> 1) k = 16 × 81 000/(8 × 4096 × 8) = 4.94 N/mm. 2) τ = 1.172 × 8 × 50 × 16/(π × 8) = 299 MPa. 3) 2.97 N/mm (half).</p></div>`,
  `<span class="eyebrow">EMM201c · Chương 11 · Bài 11.4</span>
<h2>Lò xo nén xoắn ốc</h2>
<h3>🎯 Mục tiêu</h3>
<ul><li>Tính độ cứng của lò xo nén xoắn ốc.</li><li>Tính ứng suất cắt lớn nhất có hệ số hiệu chỉnh độ cong.</li><li>Kiểm lò xo theo độ bền dây và ghép lò xo nối tiếp, song song.</li></ul>
<h3>Hình học và độ cứng</h3>
<p>Lò xo nén xoắn ốc là dây đường kính d cuộn trên đường kính trung bình D, có N<sub>a</sub> vòng làm việc. <strong>Chỉ số lò xo</strong> C = D/d thường 4–12 (dễ chế tạo, không quá cứng, không dễ rối). Dù lò xo bị nén, <strong>dây lò xo chịu xoắn</strong>.</p>
<div class="formula"><span class="lbl">Độ cứng lò xo</span>k = F/y = d<sup>4</sup>·G / (8·D<sup>3</sup>·N<sub>a</sub>) &nbsp;(dây thép lò xo: G ≈ 79–81 GPa)</div>
<h3>Ứng suất</h3>
<p>Dây chịu mômen xoắn F·D/2 cộng lực cắt trực tiếp; phía trong vòng dây còn chịu biến dạng lớn hơn do độ cong. Shigley gộp các hiệu ứng này vào một hệ số:</p>
<div class="formula"><span class="lbl">Ứng suất cắt lớn nhất</span>τ = K<sub>B</sub>·8F·D / (π d<sup>3</sup>) &nbsp;&nbsp; Bergsträsser K<sub>B</sub> = (4C + 2)/(4C − 3) &nbsp;(hệ số Wahl K<sub>W</sub> = (4C − 1)/(4C − 4) + 0,615/C gần như bằng)</div>
<h3>Độ bền dây</h3>
<p>Dây càng mảnh càng bền (do kéo nguội): S<sub>ut</sub> = A/d<sup>m</sup>. Với <strong>dây đàn (music wire)</strong> Shigley cho A = 2211 MPa·mm<sup>m</sup>, m = 0,145. Giới hạn chảy xoắn của lò xo nén khoảng S<sub>sy</sub> ≈ 0,45 S<sub>ut</sub> (dây đàn, chưa khử dư). Lò xo chịu lực thay đổi (lò xo xupáp, giảm xóc) còn phải kiểm mỏi.</p>
<h3>✍️ Ví dụ giải</h3>
<div class="callout"><p>Dây đàn d = 3 mm, D = 24 mm, N<sub>a</sub> = 10, G = 81 GPa, lực lớn nhất F = 100 N.</p>
<p>C = 24/3 = 8. k = 3<sup>4</sup> × 81 000/(8 × 24<sup>3</sup> × 10) = <b>5,93 N/mm</b> ⇒ độ nén ở 100 N: y = 100/5,93 = <b>16,9 mm</b>.</p>
<p>K<sub>B</sub> = (32 + 2)/(32 − 3) = <b>1,172</b> (Wahl: 1,184). τ = 1,172 × 8 × 100 × 24/(π × 3<sup>3</sup>) = <b>265 MPa</b>.</p>
<p>S<sub>ut</sub> = 2211/3<sup>0,145</sup> = <b>1885 MPa</b>; S<sub>sy</sub> ≈ 0,45 × 1885 = 848 MPa ⇒ <b>n = 848/265 = 3,2</b>. Thiết kế tốt còn kiểm ứng suất khi lò xo bị nén sát (các vòng chạm nhau), để lỡ bị nén hết cỡ cũng không chảy.</p></div>
<h3>Ghép lò xo</h3>
<div class="formula"><span class="lbl">Ghép</span>Song song (cùng độ biến dạng): k = k<sub>1</sub> + k<sub>2</sub> &nbsp;&nbsp; Nối tiếp (cùng lực): 1/k = 1/k<sub>1</sub> + 1/k<sub>2</sub></div>
<p>Hai lò xo như trên ghép song song cho 11,86 N/mm; nối tiếp 2,97 N/mm. Một góc hệ treo ô tô là lò xo nối tiếp với độ cứng của chính lốp xe.</p>
<h3>Ghi chú thiết kế</h3>
<ul><li><strong>Mất ổn định</strong>: lò xo nén dài và mảnh (chiều dài tự do &gt; khoảng 4 D) bị cong ngang nếu không có thanh hoặc ống dẫn hướng.</li><li><strong>Cộng hưởng (surge)</strong>: nếu tần số tải gần tần số riêng của lò xo, các vòng dao động mạnh (lò xo xupáp động cơ) — giữ tần số riêng cao hơn nhiều so với tần số kích thích.</li><li>Kiểu đầu lò xo (trơn, chụm, chụm và mài) làm thay đổi số vòng không làm việc và chiều dài khi nén sát.</li></ul>
<h3>⚠️ Lỗi hay gặp</h3>
<div class="pitfall"><ul><li>Dùng đường kính ngoài thay cho đường kính trung bình D.</li><li>Tính cả các vòng đầu không làm việc vào N<sub>a</sub>.</li><li>Quên rằng d có mũ 4 trong k và mũ 3 trong τ — thay đổi nhỏ của d ảnh hưởng rất lớn.</li></ul></div>
<h3>📌 Tóm tắt</h3>
<ul><li>k = d<sup>4</sup>G/(8D<sup>3</sup>N<sub>a</sub>); C = D/d ≈ 4–12.</li><li>τ = K<sub>B</sub> 8FD/(πd<sup>3</sup>).</li><li>S<sub>ut</sub> = A/d<sup>m</sup>; S<sub>sy</sub> ≈ 0,45 S<sub>ut</sub> (dây đàn).</li><li>Song song cộng k; nối tiếp cộng 1/k. Kiểm mất ổn định và cộng hưởng.</li></ul>
<h3>🔗 Học thêm</h3>` + UL([
    A(WK + 'Coil_spring', 'Wikipedia — Lò xo xoắn ốc'),
    A(WK + 'Spring_(device)', 'Wikipedia — Lò xo'),
    A(WK + 'Hooke%27s_law', 'Wikipedia — Định luật Hooke'),
  ]) + `
<h3>🧪 Tự luyện</h3>
<ol><li>Lò xo d = 2 mm, D = 16 mm, N<sub>a</sub> = 8, G = 81 GPa. Tìm k.</li><li>Với lò xo đó ở F = 50 N, tìm τ (K<sub>B</sub> với C = 8).</li><li>Hai lò xo 5,93 N/mm ghép nối tiếp: độ cứng tương đương?</li></ol>
<div class="dap-an"><p><strong>Đáp án.</strong> 1) k = 16 × 81 000/(8 × 4096 × 8) = 4,94 N/mm. 2) τ = 1,172 × 8 × 50 × 16/(π × 8) = 299 MPa. 3) 2,97 N/mm (một nửa).</p></div>`);

const q11 = QZ(11, 'Quiz — Chapter 11: Bearings, gears, belts, chains and springs|||Quiz — Chương 11: Ổ lăn, bánh răng, đai, xích và lò xo', 'Kiểm tra chương 11: tuổi thọ L10, tải tương đương, hình học bánh răng, lực ăn khớp, Lewis, đai thang, xích, lò xo xoắn.', [
  Q('q1', 'The L10 life of a bearing is the life reached by|||Tuổi thọ L10 của ổ là tuổi thọ mà',
    ['10 % of bearings|||10 % số ổ đạt được', '90 % of bearings|||90 % số ổ đạt hoặc vượt', 'all bearings|||mọi ổ đạt được', 'the average bearing|||ổ trung bình đạt'], 1,
    '10 % may fail earlier.|||10 % có thể hỏng sớm hơn.'),
  Q('q2', 'For a ball bearing, doubling the load changes L10 by a factor of|||Với ổ bi, tăng gấp đôi tải thì L10 thay đổi',
    ['1/2|||1/2', '1/8|||1/8', '1/4|||1/4', '2|||2'], 1,
    'Exponent a = 3.|||Số mũ a = 3.'),
  Q('q3', 'C = 30 kN, P = 3 kN, ball bearing. L10 =|||C = 30 kN, P = 3 kN, ổ bi. L10 =',
    ['10 million rev|||10 triệu vòng', '1000 million rev|||1000 triệu vòng', '100 million rev|||100 triệu vòng', '3 million rev|||3 triệu vòng'], 1,
    '(30/3)³ = 1000 × 10⁶ rev.|||(30/3)³ = 1000 × 10⁶ vòng.'),
  Q('q4', 'A gear with module 4 mm and 25 teeth has a pitch diameter of|||Bánh răng môđun 4 mm, 25 răng có đường kính vòng chia',
    ['29 mm|||29 mm', '100 mm|||100 mm', '6.25 mm|||6,25 mm', '314 mm|||314 mm'], 1,
    'd = m z.|||d = m z.'),
  Q('q5', 'Two gears mesh only if they have the same|||Hai bánh răng chỉ ăn khớp khi có cùng',
    ['number of teeth|||số răng', 'module and pressure angle|||môđun và góc áp lực', 'face width|||bề rộng vành', 'material|||vật liệu'], 1,
    'Tooth size and shape must match.|||Kích thước và dạng răng phải khớp.'),
  Q('q6', 'With 20° pressure angle, the radial gear force is|||Với góc áp lực 20°, lực hướng tâm của bánh răng là',
    ['Ft·sin 20°|||Ft·sin 20°', 'Ft·tan 20°|||Ft·tan 20°', 'Ft/cos 20°|||Ft/cos 20°', 'zero|||bằng 0'], 1,
    'Fr = Ft tan φ ≈ 0.364 Ft.|||Fr = Ft tan φ ≈ 0,364 Ft.'),
  Q('q7', 'A V-belt grips better than a flat belt because its effective friction is|||Đai thang bám tốt hơn đai phẳng vì hệ số ma sát tương đương là',
    ['μ·sin β|||μ·sin β', 'μ/sin β|||μ/sin β', 'μ²|||μ²', 'μ/2|||μ/2'], 1,
    'Wedging in the groove raises the normal force.|||Chêm trong rãnh làm tăng lực pháp tuyến.'),
  Q('q8', 'A belt drive transmits P at belt speed v. The tension difference F1 − F2 is|||Bộ truyền đai truyền công suất P ở vận tốc đai v. Hiệu lực căng F1 − F2 là',
    ['P·v|||P·v', 'P/v|||P/v', 'v/P|||v/P', 'P/(2v)|||P/(2v)'], 1,
    'P = (F1 − F2) v.|||P = (F1 − F2) v.'),
  Q('q9', 'Increasing the number of sprocket teeth N|||Tăng số răng đĩa xích N',
    ['increases the chordal speed variation|||tăng dao động vận tốc đa giác', 'reduces the chordal speed variation|||giảm dao động vận tốc đa giác', 'does not matter|||không ảnh hưởng', 'makes the chain slip|||làm xích trượt'], 1,
    'Variation ≈ 1 − cos(180°/N).|||Dao động ≈ 1 − cos(180°/N).'),
  Q('q10', 'Doubling the wire diameter of a helical spring (same D, Na, G) multiplies its rate by|||Tăng gấp đôi đường kính dây lò xo (cùng D, Na, G) thì độ cứng nhân với',
    ['2|||2', '4|||4', '8|||8', '16|||16'], 3,
    'k ∝ d⁴.|||k ∝ d⁴.'),
]);

const ch11 = {
  title: 'Chapter 11 — Machine elements II: bearings, gears, belts, chains and springs|||Chương 11 — Chi tiết máy II: ổ lăn, bánh răng, đai, xích và lò xo',
  description: 'Ổ lăn và tuổi thọ L10, bánh răng trụ răng thẳng (hình học, lực, Lewis), bộ truyền đai và xích, lò xo nén xoắn ốc (Shigley ch.10–11, 13–14, 17).',
  lessons: [c111, c112, c113, c114, q11],
};

// ───────────────────────────── Xuất ─────────────────────────────
export default [muc0, ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8, ch9, ch10, ch11];
