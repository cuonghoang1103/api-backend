/**
 * SPS301 — Software & Programming Standards for Automotive System.
 * Tiêu chuẩn phần mềm & lập trình cho hệ thống ô tô (ngành Kỹ thuật phần mềm ô tô).
 * KHUNG chất lượng, song ngữ VI+EN. Nguồn chuẩn quốc tế: MISRA C:2012, AUTOSAR
 * (Classic & Adaptive), ISO 26262 (functional safety), Automotive SPICE (ASPICE),
 * ISO 21434 (cybersecurity). 8 chương, mỗi chương 1 DOCUMENT + 1 QUIZ 3 câu.
 * ⚠️ KHÔNG backtick lồng / ${} trong HTML; "&"→&amp;, "<"→&lt;, ">"→&gt; trong content.
 * Giữ NGUYÊN slug/semester/courseCode/thumbnailUrl. syncOrder + pruneSections BẬT.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('sps301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: MISRA C:2012, AUTOSAR standard, ISO 26262, Automotive SPICE, ISO 21434; lộ trình tự học 4 bước.',
  [[
    `<span class="eyebrow">SPS301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>automotive software standards</strong> — coding rules, architecture, functional safety, process and cybersecurity — in one place. The official FPTU slides &amp; syllabus live on <strong>FLM</strong>; below are the international standards this course is built on.</p>
<h3>📘 Standards &amp; syllabus</h3>
<ul>
<li>The official FPTU giáo trình &amp; slides for SPS301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</li>
<li><strong>MISRA C:2012</strong> — Guidelines for the Use of the C Language in Critical Systems (misra.org.uk).</li>
<li><strong>AUTOSAR</strong> — Classic &amp; Adaptive Platform standards (autosar.org).</li>
<li><strong>ISO 26262</strong> — Road vehicles — Functional safety (all parts).</li>
<li><strong>Automotive SPICE (ASPICE)</strong> — Process Assessment / Reference Model (VDA QMC).</li>
<li><strong>ISO/SAE 21434</strong> — Road vehicles — Cybersecurity engineering.</li>
</ul>
<h3>🌐 Free documentation</h3>
<ul>
<li><a href="https://www.autosar.org/standards" target="_blank" rel="noopener">AUTOSAR standards library</a> — free specification downloads.</li>
<li><a href="https://www.misra.org.uk/" target="_blank" rel="noopener">MISRA</a> — guidelines &amp; example suite.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — why automotive software is different (safety, real-time, long life) and what each standard covers.</li>
<li><strong>Code well</strong> — apply MISRA C rules; recognise undefined behaviour and unsafe constructs.</li>
<li><strong>Engineer safely</strong> — ISO 26262 (ASIL, safety lifecycle) and ASPICE (V-model, capability levels).</li>
<li><strong>Secure &amp; verify</strong> — ISO 21434 (TARA), then MC/DC coverage, static analysis and MIL/SIL/HIL testing.</li>
</ol></div>`,
    `<span class="eyebrow">SPS301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>tiêu chuẩn phần mềm ô tô</strong> — quy tắc lập trình, kiến trúc, an toàn chức năng, quy trình và an ninh mạng — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là các chuẩn quốc tế mà môn này dựa vào.</p>
<h3>📘 Chuẩn &amp; giáo trình</h3>
<ul>
<li>Giáo trình FPTU &amp; slide chính thức của SPS301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</li>
<li><strong>MISRA C:2012</strong> — Hướng dẫn dùng ngôn ngữ C trong hệ thống tới hạn (misra.org.uk).</li>
<li><strong>AUTOSAR</strong> — chuẩn nền tảng Classic &amp; Adaptive (autosar.org).</li>
<li><strong>ISO 26262</strong> — Xe đường bộ — An toàn chức năng (mọi phần).</li>
<li><strong>Automotive SPICE (ASPICE)</strong> — mô hình đánh giá / tham chiếu quy trình (VDA QMC).</li>
<li><strong>ISO/SAE 21434</strong> — Xe đường bộ — Kỹ nghệ an ninh mạng.</li>
</ul>
<h3>🌐 Tài liệu miễn phí</h3>
<ul>
<li><a href="https://www.autosar.org/standards" target="_blank" rel="noopener">Thư viện chuẩn AUTOSAR</a> — tải đặc tả miễn phí.</li>
<li><a href="https://www.misra.org.uk/" target="_blank" rel="noopener">MISRA</a> — hướng dẫn &amp; bộ ví dụ.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — vì sao phần mềm ô tô khác biệt (an toàn, thời gian thực, vòng đời dài) và mỗi chuẩn bao phủ điều gì.</li>
<li><strong>Viết mã tốt</strong> — áp dụng quy tắc MISRA C; nhận diện hành vi không xác định và cấu trúc không an toàn.</li>
<li><strong>Kỹ nghệ an toàn</strong> — ISO 26262 (ASIL, vòng đời an toàn) và ASPICE (V-model, mức năng lực).</li>
<li><strong>Bảo mật &amp; kiểm chứng</strong> — ISO 21434 (TARA), rồi độ phủ MC/DC, phân tích tĩnh và kiểm thử MIL/SIL/HIL.</li>
</ol></div>`,
  ]]);

const intro = doc('sps301-0-1-overview', 'Course overview: Automotive software standards|||Tổng quan: Tiêu chuẩn phần mềm ô tô',
  'Vì sao ô tô cần chuẩn riêng; năm trụ cột MISRA C, AUTOSAR, ISO 26262, ASPICE, ISO 21434; lộ trình 8 chương.',
  [[
    `<span class="eyebrow">SPS301 · Lesson 0.1 · Overview</span>
<h2>Software &amp; Programming Standards for Automotive Systems</h2>
<p class="lead">A modern car runs <strong>over 100 million lines of code</strong> across 100+ electronic control units (ECUs). When that software controls braking, steering and airbags, a bug is not a crashed app — it is a road accident. This course teaches the <strong>standards and engineering discipline</strong> that keep automotive software safe, secure and reliable.</p>
<h3>Why automotive needs its own rules</h3>
<ul>
<li><strong>Safety-critical</strong> — failures can injure or kill; certification is mandatory.</li>
<li><strong>Real-time &amp; embedded</strong> — tiny microcontrollers, hard deadlines, no room for undefined behaviour.</li>
<li><strong>Long lifetime</strong> — a platform lives 15+ years and must be maintainable and traceable.</li>
<li><strong>Regulated</strong> — UN R155/R156 now require cybersecurity and update management by law.</li>
</ul>
<h3>The five pillars of this course</h3>
<ul>
<li><strong>MISRA C</strong> — a safe subset of the C language (how to write the code).</li>
<li><strong>AUTOSAR</strong> — a standard software architecture (how to structure it).</li>
<li><strong>ISO 26262</strong> — functional safety (how to prove it will not cause harm).</li>
<li><strong>Automotive SPICE</strong> — process quality (how to run the project well).</li>
<li><strong>ISO 21434</strong> — cybersecurity (how to keep attackers out).</li>
</ul>
<div class="callout"><span class="badge">Roadmap</span> Automotive SW &amp; standards → MISRA C → AUTOSAR → ISO 26262 → Automotive SPICE → ISO 21434 → verification &amp; testing → development process &amp; tools. Bilingual, with C examples and a quiz per chapter.</div>`,
    `<span class="eyebrow">SPS301 · Bài 0.1 · Tổng quan</span>
<h2>Tiêu chuẩn phần mềm &amp; lập trình cho hệ thống ô tô</h2>
<p class="lead">Một chiếc xe hiện đại chạy <strong>hơn 100 triệu dòng mã</strong> trên hơn 100 bộ điều khiển điện tử (ECU). Khi phần mềm đó điều khiển phanh, lái và túi khí, một lỗi không còn là ứng dụng bị treo — mà là một tai nạn giao thông. Môn này dạy <strong>các tiêu chuẩn và kỷ luật kỹ nghệ</strong> giữ cho phần mềm ô tô an toàn, bảo mật và tin cậy.</p>
<h3>Vì sao ô tô cần luật riêng</h3>
<ul>
<li><strong>Tới hạn an toàn</strong> — lỗi có thể gây thương tích hoặc chết người; chứng nhận là bắt buộc.</li>
<li><strong>Thời gian thực &amp; nhúng</strong> — vi điều khiển nhỏ, hạn chót cứng, không có chỗ cho hành vi không xác định.</li>
<li><strong>Vòng đời dài</strong> — một nền tảng sống hơn 15 năm, phải dễ bảo trì và truy vết.</li>
<li><strong>Bị quản lý</strong> — UN R155/R156 nay bắt buộc an ninh mạng và quản lý cập nhật theo luật.</li>
</ul>
<h3>Năm trụ cột của môn học</h3>
<ul>
<li><strong>MISRA C</strong> — một tập con an toàn của ngôn ngữ C (viết mã thế nào).</li>
<li><strong>AUTOSAR</strong> — kiến trúc phần mềm chuẩn (cấu trúc ra sao).</li>
<li><strong>ISO 26262</strong> — an toàn chức năng (chứng minh không gây hại).</li>
<li><strong>Automotive SPICE</strong> — chất lượng quy trình (chạy dự án cho tốt).</li>
<li><strong>ISO 21434</strong> — an ninh mạng (ngăn kẻ tấn công).</li>
</ul>
<div class="callout"><span class="badge">Lộ trình</span> Phần mềm ô tô &amp; chuẩn → MISRA C → AUTOSAR → ISO 26262 → Automotive SPICE → ISO 21434 → kiểm thử &amp; xác minh → quy trình &amp; công cụ. Song ngữ, có ví dụ C và quiz mỗi chương.</div>`,
  ]]);

const c1 = doc('sps301-1-1-automotive-sw', '1.1 — Automotive software & the need for standards|||1.1 — Phần mềm ô tô & vì sao cần chuẩn',
  'Đặc thù phần mềm ô tô (an toàn, thời gian thực, nhúng, vòng đời dài); E/E architecture, ECU; vì sao cần chuẩn.',
  [[
    `<span class="eyebrow">SPS301 · Chapter 1 · Lesson 1.1</span>
<h2>Automotive software &amp; the need for standards</h2>
<h3>What makes automotive software special</h3>
<p>Automotive software is <strong>embedded</strong> (runs on small microcontrollers with kilobytes of RAM), <strong>real-time</strong> (a task must finish before its deadline, every time), and <strong>safety-critical</strong> (a defect can cause physical harm). It also lives for well over a decade and must survive heat, vibration and electrical noise.</p>
<h3>The E/E architecture</h3>
<ul>
<li><strong>ECU (Electronic Control Unit)</strong> — a computer that controls one function (engine, ABS, airbag). A modern car has 70–150 of them.</li>
<li><strong>Networks</strong> — ECUs talk over <strong>CAN</strong>, <strong>LIN</strong>, <strong>FlexRay</strong> and <strong>Automotive Ethernet</strong>.</li>
<li><strong>Domains / zones</strong> — the industry is moving from many small ECUs to a few powerful <strong>domain</strong> and <strong>zonal</strong> controllers.</li>
</ul>
<h3>Why standards, not just "good code"</h3>
<p>With hundreds of suppliers and 15-year platforms, ad-hoc quality does not scale. Standards give a <strong>common language</strong>: MISRA for code, AUTOSAR for architecture, ISO 26262 for safety, ASPICE for process, ISO 21434 for security. They also make software <strong>certifiable</strong> — a legal requirement for road vehicles.</p>
<pre><code class="language-text">Reliability terms:
  Fault    -> a defect in the software/hardware (e.g. a bug)
  Error    -> the wrong internal state a fault produces
  Failure  -> the system delivers a wrong service to the outside
Goal of the standards: stop faults becoming failures that harm people.</code></pre>
<div class="callout"><span class="badge">Key idea</span> In consumer apps we optimise for speed of delivery; in automotive we optimise for <strong>never causing harm</strong> — and prove it with evidence.</div>`,
    `<span class="eyebrow">SPS301 · Chương 1 · Bài 1.1</span>
<h2>Phần mềm ô tô &amp; vì sao cần chuẩn</h2>
<h3>Điều gì làm phần mềm ô tô đặc biệt</h3>
<p>Phần mềm ô tô là <strong>nhúng</strong> (chạy trên vi điều khiển nhỏ chỉ vài kilobyte RAM), <strong>thời gian thực</strong> (mỗi tác vụ phải xong trước hạn chót, mọi lần), và <strong>tới hạn an toàn</strong> (một khiếm khuyết có thể gây thương tích). Nó còn sống hơn một thập kỷ và phải chịu được nhiệt, rung và nhiễu điện.</p>
<h3>Kiến trúc điện/điện tử (E/E)</h3>
<ul>
<li><strong>ECU (bộ điều khiển điện tử)</strong> — máy tính điều khiển một chức năng (động cơ, ABS, túi khí). Xe hiện đại có 70–150 cái.</li>
<li><strong>Mạng</strong> — các ECU trao đổi qua <strong>CAN</strong>, <strong>LIN</strong>, <strong>FlexRay</strong> và <strong>Automotive Ethernet</strong>.</li>
<li><strong>Miền / vùng</strong> — ngành đang chuyển từ nhiều ECU nhỏ sang vài bộ điều khiển <strong>miền (domain)</strong> và <strong>vùng (zonal)</strong> mạnh.</li>
</ul>
<h3>Vì sao cần chuẩn, không chỉ là "mã tốt"</h3>
<p>Với hàng trăm nhà cung cấp và nền tảng sống 15 năm, chất lượng tùy hứng không mở rộng nổi. Chuẩn cho một <strong>ngôn ngữ chung</strong>: MISRA cho mã, AUTOSAR cho kiến trúc, ISO 26262 cho an toàn, ASPICE cho quy trình, ISO 21434 cho bảo mật. Chúng cũng làm phần mềm <strong>có thể chứng nhận</strong> — điều bắt buộc theo luật với xe đường bộ.</p>
<pre><code class="language-text">Thuật ngữ độ tin cậy:
  Fault (lỗi tiềm ẩn)   -> khiếm khuyết trong phần mềm/phần cứng
  Error (sai trạng thái) -> trạng thái nội bộ sai do fault sinh ra
  Failure (hỏng dịch vụ) -> hệ thống cấp dịch vụ sai ra bên ngoài
Mục tiêu của chuẩn: chặn fault trở thành failure gây hại cho con người.</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Ở ứng dụng tiêu dùng ta tối ưu tốc độ ra mắt; ở ô tô ta tối ưu để <strong>không bao giờ gây hại</strong> — và chứng minh bằng bằng chứng.</div>`,
  ]]);

const c1q = quiz('sps301-quiz-1', 'Quiz 1 — Automotive SW & standards|||Quiz 1 — Phần mềm ô tô & chuẩn', [
  { id: 'q1', question: 'Which trio best describes automotive software?|||Bộ ba nào mô tả đúng nhất phần mềm ô tô?', options: ['Cloud, web, mobile|||Đám mây, web, di động', 'Embedded, real-time, safety-critical|||Nhúng, thời gian thực, tới hạn an toàn', 'Batch, offline, best-effort|||Theo lô, ngoại tuyến, cố hết sức', 'Single-user, short-lived|||Một người dùng, ngắn hạn'], correctIndex: 1, explanation: 'Phần mềm ô tô là nhúng, thời gian thực và tới hạn an toàn — nền của mọi chuẩn.' },
  { id: 'q2', question: 'What is an ECU?|||ECU là gì?', options: ['A network cable|||Một dây mạng', 'An Electronic Control Unit that controls a car function|||Bộ điều khiển điện tử điều khiển một chức năng của xe', 'A test tool|||Một công cụ kiểm thử', 'A coding standard|||Một chuẩn lập trình'], correctIndex: 1, explanation: 'ECU là máy tính nhúng điều khiển một chức năng (động cơ, ABS, túi khí...).' },
  { id: 'q3', question: 'In reliability terms, a fault that propagates outward becomes a?|||Theo thuật ngữ độ tin cậy, một fault lan ra ngoài trở thành?', options: ['Feature|||Tính năng', 'Failure|||Failure (hỏng dịch vụ)', 'Requirement|||Yêu cầu', 'Release|||Bản phát hành'], correctIndex: 1, explanation: 'Chuỗi fault → error → failure; chuẩn nhằm chặn fault thành failure gây hại.' },
]);

const c2 = doc('sps301-2-1-misra-c', '2.1 — MISRA C: a safe subset of C|||2.1 — MISRA C: tập con C an toàn',
  'MISRA C:2012 (rule/directive, mandatory/required/advisory); undefined behaviour; ví dụ vi phạm vs tuân thủ (pre-code C).',
  [[
    `<span class="eyebrow">SPS301 · Chapter 2 · Lesson 2.1</span>
<h2>MISRA C — a safe subset of the C language</h2>
<h3>Why constrain C?</h3>
<p>C is fast and close to the hardware, but it has many pieces of <strong>undefined</strong>, <strong>unspecified</strong> and <strong>implementation-defined</strong> behaviour — code that compiles yet behaves differently on another compiler. <strong>MISRA C:2012</strong> forbids the dangerous parts and gives a <em>safe subset</em> that behaves predictably.</p>
<h3>How the guidelines are organised</h3>
<ul>
<li><strong>Directives</strong> — need engineering judgement / extra information (e.g. requirements traceability).</li>
<li><strong>Rules</strong> — can be checked from the source alone by a static analyser.</li>
<li>Each is <strong>Mandatory</strong> (never break), <strong>Required</strong> (break only with a documented deviation), or <strong>Advisory</strong> (recommended).</li>
</ul>
<h3>Violation vs compliant</h3>
<pre><code class="language-c">/* Rule 14.4: the condition of if must be boolean, not a plain integer.
   Rule 10.x: no implicit mixing of signed/unsigned. */

/* NON-COMPLIANT */
int x = get_speed();
if (x = 0) {            /* assignment, not comparison -> bug */
    stop();
}

/* COMPLIANT */
int32_t x = get_speed();
if (x == 0) {           /* explicit comparison */
    stop();
}

/* Rule 15.6: every if/else/for/while body must use braces */
/* NON-COMPLIANT */  if (fault) shutdown();
/* COMPLIANT     */  if (fault) { shutdown(); }</code></pre>
<p>Other classic MISRA rules: no <code>goto</code> that jumps backwards (Rule 15.1 area), one <code>return</code> philosophy, no dynamic memory (<code>malloc</code>/<code>free</code>) in Directive 4.12, and always use fixed-width types such as <code>int32_t</code> instead of plain <code>int</code>.</p>
<div class="callout"><span class="badge">Enforced by tools</span> MISRA compliance is checked automatically by static analysers (Polyspace, Coverity, PC-lint, Cppcheck). Deviations from a Required rule must be <strong>documented and approved</strong>, never silent.</div>`,
    `<span class="eyebrow">SPS301 · Chương 2 · Bài 2.1</span>
<h2>MISRA C — tập con an toàn của ngôn ngữ C</h2>
<h3>Vì sao phải bó C lại?</h3>
<p>C nhanh và sát phần cứng, nhưng có nhiều chỗ hành vi <strong>không xác định (undefined)</strong>, <strong>không đặc tả (unspecified)</strong> và <strong>tùy trình biên dịch</strong> — mã biên dịch được nhưng chạy khác nhau trên trình biên dịch khác. <strong>MISRA C:2012</strong> cấm những phần nguy hiểm và cho một <em>tập con an toàn</em> chạy đoán trước được.</p>
<h3>Cách tổ chức hướng dẫn</h3>
<ul>
<li><strong>Directive</strong> — cần phán đoán kỹ nghệ / thông tin thêm (vd truy vết yêu cầu).</li>
<li><strong>Rule</strong> — kiểm được chỉ từ mã nguồn bằng công cụ phân tích tĩnh.</li>
<li>Mỗi mục là <strong>Mandatory</strong> (không bao giờ vi phạm), <strong>Required</strong> (chỉ vi phạm khi có deviation ghi rõ), hoặc <strong>Advisory</strong> (khuyến nghị).</li>
</ul>
<h3>Vi phạm vs tuân thủ</h3>
<pre><code class="language-c">/* Rule 14.4: điều kiện của if phải là boolean, không phải số nguyên trần.
   Rule 10.x: không trộn ngầm signed/unsigned. */

/* KHONG TUAN THU */
int x = get_speed();
if (x = 0) {            /* gan, khong phai so sanh -> loi */
    stop();
}

/* TUAN THU */
int32_t x = get_speed();
if (x == 0) {           /* so sanh tuong minh */
    stop();
}

/* Rule 15.6: moi than if/else/for/while phai co ngoac */
/* KHONG TUAN THU */  if (fault) shutdown();
/* TUAN THU      */  if (fault) { shutdown(); }</code></pre>
<p>Vài quy tắc MISRA kinh điển khác: không <code>goto</code> nhảy lùi (vùng Rule 15.1), triết lý một <code>return</code>, không cấp phát động (<code>malloc</code>/<code>free</code>) theo Directive 4.12, và luôn dùng kiểu độ rộng cố định như <code>int32_t</code> thay cho <code>int</code> trần.</p>
<div class="callout"><span class="badge">Công cụ kiểm</span> Tuân thủ MISRA được kiểm tự động bằng phân tích tĩnh (Polyspace, Coverity, PC-lint, Cppcheck). Deviation khỏi một Required rule phải được <strong>ghi lại và duyệt</strong>, không bao giờ âm thầm.</div>`,
  ]]);

const c2q = quiz('sps301-quiz-2', 'Quiz 2 — MISRA C|||Quiz 2 — MISRA C', [
  { id: 'q1', question: 'What does MISRA C provide?|||MISRA C cung cấp điều gì?', options: ['A new programming language|||Một ngôn ngữ lập trình mới', 'A safe subset of C that avoids dangerous behaviour|||Một tập con an toàn của C, tránh hành vi nguy hiểm', 'A compiler|||Một trình biên dịch', 'An operating system|||Một hệ điều hành'], correctIndex: 1, explanation: 'MISRA C là tập con an toàn của C, cấm các cấu trúc không xác định/nguy hiểm.' },
  { id: 'q2', question: 'A MISRA "Required" rule may be broken only when?|||Một rule MISRA "Required" chỉ được vi phạm khi nào?', options: ['Never, under any condition|||Không bao giờ, trong mọi điều kiện', 'With a documented, approved deviation|||Khi có deviation được ghi lại và duyệt', 'When the deadline is tight|||Khi hạn chót gấp', 'When the compiler allows it|||Khi trình biên dịch cho phép'], correctIndex: 1, explanation: 'Required = chỉ được lệch khi có deviation ghi rõ và được duyệt; Mandatory thì không bao giờ.' },
  { id: 'q3', question: 'Why is "if (x = 0)" flagged?|||Vì sao "if (x = 0)" bị đánh dấu?', options: ['It is too slow|||Nó quá chậm', 'It is an assignment mistaken for a comparison|||Đó là phép gán bị nhầm thành so sánh', 'It uses too much memory|||Nó tốn quá nhiều bộ nhớ', 'It is a comment|||Đó là một chú thích'], correctIndex: 1, explanation: '"=" gán rồi kiểm giá trị; ý định là "==" so sánh — lỗi kinh điển MISRA chặn.' },
]);

const c3 = doc('sps301-3-1-autosar', '3.1 — AUTOSAR architecture|||3.1 — Kiến trúc AUTOSAR',
  'AUTOSAR Classic vs Adaptive; layered architecture (App/RTE/BSW/MCAL); SWC & RTE; vì sao chuẩn hoá kiến trúc.',
  [[
    `<span class="eyebrow">SPS301 · Chapter 3 · Lesson 3.1</span>
<h2>AUTOSAR — a standard software architecture</h2>
<p><strong>AUTOSAR</strong> (AUTomotive Open System ARchitecture) is an industry standard that separates <em>application</em> from <em>infrastructure</em> so software can be reused across ECUs and suppliers.</p>
<h3>Classic vs Adaptive</h3>
<ul>
<li><strong>Classic Platform</strong> — for deeply embedded, hard real-time ECUs on microcontrollers (C, static, OSEK/AUTOSAR OS). Runs airbags, braking, powertrain.</li>
<li><strong>Adaptive Platform</strong> — for high-performance computers (POSIX, C++, dynamic, service-oriented). Runs ADAS, infotainment, autonomous driving.</li>
</ul>
<h3>The Classic layered architecture</h3>
<pre><code class="language-text">+-----------------------------------------------+
|      Application Layer  (Software Components)  |
+-----------------------------------------------+
|      RTE  (Runtime Environment)                |  &lt;- the "virtual bus"
+-----------------------------------------------+
|      BSW (Basic Software)                      |
|   Services | ECU Abstraction | MCAL            |
+-----------------------------------------------+
|      Microcontroller (hardware)                |
+-----------------------------------------------+</code></pre>
<ul>
<li><strong>SWC (Software Component)</strong> — a reusable application block; it never touches hardware directly.</li>
<li><strong>RTE (Runtime Environment)</strong> — the "virtual bus" that connects SWCs and hides whether a partner is on the same ECU or across the network.</li>
<li><strong>BSW (Basic Software)</strong> — services, ECU abstraction and the <strong>MCAL</strong> (Microcontroller Abstraction Layer) that talks to the chip.</li>
</ul>
<div class="callout"><span class="badge">Why it matters</span> Because the SWC talks only to the RTE, the <em>same</em> application component can move to a different ECU or a different chip with <strong>no code change</strong> — only reconfiguration.</div>`,
    `<span class="eyebrow">SPS301 · Chương 3 · Bài 3.1</span>
<h2>AUTOSAR — kiến trúc phần mềm chuẩn</h2>
<p><strong>AUTOSAR</strong> (AUTomotive Open System ARchitecture) là chuẩn ngành tách <em>ứng dụng</em> khỏi <em>hạ tầng</em> để phần mềm dùng lại được giữa các ECU và nhà cung cấp.</p>
<h3>Classic vs Adaptive</h3>
<ul>
<li><strong>Classic Platform</strong> — cho ECU nhúng sâu, thời gian thực cứng trên vi điều khiển (C, tĩnh, OSEK/AUTOSAR OS). Chạy túi khí, phanh, hệ truyền động.</li>
<li><strong>Adaptive Platform</strong> — cho máy tính hiệu năng cao (POSIX, C++, động, hướng dịch vụ). Chạy ADAS, giải trí, lái tự động.</li>
</ul>
<h3>Kiến trúc phân tầng của Classic</h3>
<pre><code class="language-text">+-----------------------------------------------+
|      Tang ung dung  (Software Components)      |
+-----------------------------------------------+
|      RTE  (Runtime Environment)                |  &lt;- "bus ao"
+-----------------------------------------------+
|      BSW (Basic Software)                      |
|   Services | ECU Abstraction | MCAL            |
+-----------------------------------------------+
|      Vi dieu khien (phan cung)                 |
+-----------------------------------------------+</code></pre>
<ul>
<li><strong>SWC (Software Component)</strong> — khối ứng dụng dùng lại được; không bao giờ chạm phần cứng trực tiếp.</li>
<li><strong>RTE (Runtime Environment)</strong> — "bus ảo" nối các SWC và giấu việc đối tác nằm cùng ECU hay ở đầu kia mạng.</li>
<li><strong>BSW (Basic Software)</strong> — dịch vụ, trừu tượng ECU và <strong>MCAL</strong> (tầng trừu tượng vi điều khiển) nói chuyện với con chip.</li>
</ul>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Vì SWC chỉ nói với RTE, <em>cùng</em> một component ứng dụng có thể chuyển sang ECU khác hay chip khác mà <strong>không đổi mã</strong> — chỉ cấu hình lại.</div>`,
  ]]);

const c3q = quiz('sps301-quiz-3', 'Quiz 3 — AUTOSAR|||Quiz 3 — AUTOSAR', [
  { id: 'q1', question: 'In AUTOSAR Classic, what connects Software Components?|||Trong AUTOSAR Classic, cái gì nối các Software Component?', options: ['The MCAL|||MCAL', 'The RTE (Runtime Environment), the virtual bus|||RTE (Runtime Environment), bus ảo', 'The compiler|||Trình biên dịch', 'The CAN cable|||Dây CAN'], correctIndex: 1, explanation: 'RTE là "bus ảo" nối SWC và giấu vị trí vật lý của đối tác.' },
  { id: 'q2', question: 'Which platform is for high-performance, service-oriented ECUs (ADAS)?|||Nền tảng nào cho ECU hiệu năng cao, hướng dịch vụ (ADAS)?', options: ['Classic Platform|||Classic Platform', 'Adaptive Platform|||Adaptive Platform', 'MCAL Platform|||MCAL Platform', 'OSEK Platform|||OSEK Platform'], correctIndex: 1, explanation: 'Adaptive Platform (POSIX, C++, động) cho ADAS/lái tự động; Classic cho nhúng sâu.' },
  { id: 'q3', question: 'What is the MCAL?|||MCAL là gì?', options: ['The application layer|||Tầng ứng dụng', 'The Microcontroller Abstraction Layer that talks to the chip|||Tầng trừu tượng vi điều khiển, nói chuyện với con chip', 'A test framework|||Một khung kiểm thử', 'A coding rule|||Một quy tắc lập trình'], correctIndex: 1, explanation: 'MCAL là tầng thấp nhất của BSW, trừu tượng hoá phần cứng vi điều khiển.' },
]);

const c4 = doc('sps301-4-1-iso26262', '4.1 — ISO 26262 functional safety|||4.1 — An toàn chức năng ISO 26262',
  'Functional safety; ASIL (A-D) từ Severity/Exposure/Controllability; safety lifecycle (V); HARA/hazard analysis.',
  [[
    `<span class="eyebrow">SPS301 · Chapter 4 · Lesson 4.1</span>
<h2>ISO 26262 — functional safety</h2>
<p><strong>Functional safety</strong> is the absence of unreasonable risk caused by malfunctioning electrical/electronic systems. <strong>ISO 26262</strong> (an adaptation of IEC 61508 for road vehicles) defines how to engineer that safety across the whole lifecycle.</p>
<h3>ASIL — Automotive Safety Integrity Level</h3>
<p>Every hazard is rated by combining three factors, producing a level from <strong>QM</strong> (quality management, no special measures) up to <strong>ASIL D</strong> (most stringent):</p>
<pre><code class="language-text">ASIL = f(Severity, Exposure, Controllability)

  Severity (S)        how badly people are hurt        S0..S3
  Exposure (E)        how often the situation occurs   E0..E4
  Controllability (C) can the driver avoid harm        C0..C3

  Result:  QM  &lt;  ASIL A  &lt;  ASIL B  &lt;  ASIL C  &lt;  ASIL D
  Example: airbag / braking -> often ASIL D
           rear wiper       -> often QM or ASIL A</code></pre>
<h3>The safety lifecycle (a V-model)</h3>
<ul>
<li><strong>Concept</strong> — item definition, <strong>HARA</strong> (Hazard Analysis and Risk Assessment) determines the ASIL, and the <strong>safety goals</strong>.</li>
<li><strong>Development</strong> — functional → technical safety requirements → hardware &amp; software design, all traced to the goals.</li>
<li><strong>Verification &amp; validation</strong> — the right-hand side of the V confirms each level.</li>
<li><strong>Production &amp; operation</strong> — safety must be maintained in the field.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> The higher the ASIL, the stronger the required rigour: more reviews, higher test coverage (e.g. MC/DC for ASIL D), and stricter architectural measures.</div>`,
    `<span class="eyebrow">SPS301 · Chương 4 · Bài 4.1</span>
<h2>ISO 26262 — an toàn chức năng</h2>
<p><strong>An toàn chức năng</strong> là không còn rủi ro vô lý gây bởi hệ thống điện/điện tử trục trặc. <strong>ISO 26262</strong> (bản chuyển thể của IEC 61508 cho xe đường bộ) định nghĩa cách kỹ nghệ hoá an toàn đó suốt vòng đời.</p>
<h3>ASIL — Mức toàn vẹn an toàn ô tô</h3>
<p>Mỗi mối nguy được xếp hạng bằng cách kết hợp ba yếu tố, cho ra mức từ <strong>QM</strong> (quản lý chất lượng, không biện pháp đặc biệt) tới <strong>ASIL D</strong> (nghiêm ngặt nhất):</p>
<pre><code class="language-text">ASIL = f(Severity, Exposure, Controllability)

  Severity (S)        muc do thuong tich          S0..S3
  Exposure (E)        tinh huong xay ra thuong khong  E0..E4
  Controllability (C) tai xe co tranh duoc khong    C0..C3

  Ket qua:  QM  &lt;  ASIL A  &lt;  ASIL B  &lt;  ASIL C  &lt;  ASIL D
  Vi du: tui khi / phanh -> thuong ASIL D
         gat mua sau      -> thuong QM hoac ASIL A</code></pre>
<h3>Vòng đời an toàn (một V-model)</h3>
<ul>
<li><strong>Concept</strong> — định nghĩa item, <strong>HARA</strong> (phân tích mối nguy &amp; đánh giá rủi ro) xác định ASIL, và các <strong>safety goal</strong>.</li>
<li><strong>Phát triển</strong> — yêu cầu an toàn chức năng → kỹ thuật → thiết kế phần cứng &amp; phần mềm, tất cả truy vết về safety goal.</li>
<li><strong>Xác minh &amp; xác nhận</strong> — nhánh phải của chữ V khẳng định từng mức.</li>
<li><strong>Sản xuất &amp; vận hành</strong> — an toàn phải được duy trì ngoài thực địa.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> ASIL càng cao, mức độ nghiêm ngặt càng lớn: nhiều review hơn, độ phủ kiểm thử cao hơn (vd MC/DC cho ASIL D), và biện pháp kiến trúc chặt hơn.</div>`,
  ]]);

const c4q = quiz('sps301-quiz-4', 'Quiz 4 — ISO 26262|||Quiz 4 — ISO 26262', [
  { id: 'q1', question: 'ASIL is derived from which three factors?|||ASIL suy ra từ ba yếu tố nào?', options: ['Speed, size, weight|||Tốc độ, kích thước, khối lượng', 'Severity, Exposure, Controllability|||Mức độ nghiêm trọng, tần suất, khả năng kiểm soát', 'Cost, time, scope|||Chi phí, thời gian, phạm vi', 'CPU, RAM, storage|||CPU, RAM, lưu trữ'], correctIndex: 1, explanation: 'ASIL = f(Severity, Exposure, Controllability), cho mức QM..ASIL D.' },
  { id: 'q2', question: 'Which is the most stringent level?|||Mức nào là nghiêm ngặt nhất?', options: ['QM', 'ASIL A', 'ASIL D', 'ASIL B'], correctIndex: 2, explanation: 'Thứ tự QM < A < B < C < D; ASIL D nghiêm ngặt nhất (vd phanh, túi khí).' },
  { id: 'q3', question: 'What does HARA do in the concept phase?|||HARA làm gì trong pha concept?', options: ['Writes C code|||Viết mã C', 'Identifies hazards and assigns the ASIL / safety goals|||Nhận diện mối nguy và gán ASIL / safety goal', 'Builds the ECU hardware|||Chế tạo phần cứng ECU', 'Runs HIL tests|||Chạy kiểm thử HIL'], correctIndex: 1, explanation: 'HARA (Hazard Analysis and Risk Assessment) xác định mối nguy, ASIL và safety goal.' },
]);

const c5 = doc('sps301-5-1-aspice', '5.1 — Automotive SPICE (ASPICE) process|||5.1 — Quy trình Automotive SPICE (ASPICE)',
  'ASPICE là gì; V-model & process areas (SWE.1-6); capability levels 0-5; đánh giá quy trình nhà cung cấp.',
  [[
    `<span class="eyebrow">SPS301 · Chapter 5 · Lesson 5.1</span>
<h2>Automotive SPICE (ASPICE) — process quality</h2>
<p><strong>Automotive SPICE</strong> (based on ISO/IEC 33000) assesses how <em>capable</em> a development process is. OEMs use an ASPICE assessment to decide whether a supplier can be trusted with software.</p>
<h3>The V-model of software engineering (SWE)</h3>
<pre><code class="language-text">SWE.1 Requirements  \\                 / SWE.6 Qualification test
SWE.2 Architecture   \\               /  SWE.5 Integration test
SWE.3 Detailed design \\             /   (verify each left-hand level)
SWE.4 Unit construction \\_________/
        (left = define & build, right = test & verify, bottom = code)</code></pre>
<p>Each left-hand activity is <strong>traceable</strong> to a matching right-hand test — that two-way link (requirement ↔ test) is the heart of ASPICE.</p>
<h3>Capability levels (per process)</h3>
<ul>
<li><strong>Level 0</strong> — Incomplete.</li>
<li><strong>Level 1</strong> — Performed (it produces the output).</li>
<li><strong>Level 2</strong> — Managed (planned, monitored, work products controlled).</li>
<li><strong>Level 3</strong> — Established (a standard organisational process is tailored and used).</li>
<li><strong>Levels 4–5</strong> — Predictable &amp; Innovating (quantitatively managed, continuously improved).</li>
</ul>
<div class="callout"><span class="badge">ISO 26262 vs ASPICE</span> They are complementary: <strong>ISO 26262</strong> asks "is the product safe?"; <strong>ASPICE</strong> asks "is the process capable?". Most OEM programmes require both.</div>`,
    `<span class="eyebrow">SPS301 · Chương 5 · Bài 5.1</span>
<h2>Automotive SPICE (ASPICE) — chất lượng quy trình</h2>
<p><strong>Automotive SPICE</strong> (dựa trên ISO/IEC 33000) đánh giá một quy trình phát triển <em>có năng lực</em> đến đâu. Hãng xe (OEM) dùng đánh giá ASPICE để quyết định có tin giao phần mềm cho nhà cung cấp hay không.</p>
<h3>V-model của kỹ nghệ phần mềm (SWE)</h3>
<pre><code class="language-text">SWE.1 Yeu cau      \\                 / SWE.6 Kiem thu chap nhan
SWE.2 Kien truc     \\               /  SWE.5 Kiem thu tich hop
SWE.3 Thiet ke chi tiet\\           /   (xac minh tung muc ben trai)
SWE.4 Xay dung unit      \\_______/
        (trai = dinh nghia & dung, phai = kiem thu, day = viet ma)</code></pre>
<p>Mỗi hoạt động bên trái <strong>truy vết được</strong> tới một kiểm thử tương ứng bên phải — liên kết hai chiều đó (yêu cầu ↔ kiểm thử) là trái tim của ASPICE.</p>
<h3>Mức năng lực (theo từng quy trình)</h3>
<ul>
<li><strong>Level 0</strong> — Chưa hoàn chỉnh.</li>
<li><strong>Level 1</strong> — Có thực hiện (tạo ra đầu ra).</li>
<li><strong>Level 2</strong> — Được quản lý (lập kế hoạch, giám sát, kiểm soát sản phẩm công việc).</li>
<li><strong>Level 3</strong> — Được thiết lập (có quy trình chuẩn của tổ chức, được điều chỉnh và dùng).</li>
<li><strong>Level 4–5</strong> — Đoán trước được &amp; Đổi mới (quản lý định lượng, cải tiến liên tục).</li>
</ul>
<div class="callout"><span class="badge">ISO 26262 vs ASPICE</span> Hai thứ bổ trợ nhau: <strong>ISO 26262</strong> hỏi "sản phẩm có an toàn không?"; <strong>ASPICE</strong> hỏi "quy trình có năng lực không?". Phần lớn chương trình OEM đòi cả hai.</div>`,
  ]]);

const c5q = quiz('sps301-quiz-5', 'Quiz 5 — ASPICE|||Quiz 5 — ASPICE', [
  { id: 'q1', question: 'What does Automotive SPICE assess?|||Automotive SPICE đánh giá điều gì?', options: ['The safety of the product|||Sự an toàn của sản phẩm', 'The capability of the development process|||Năng lực của quy trình phát triển', 'The speed of the CPU|||Tốc độ của CPU', 'The price of the ECU|||Giá của ECU'], correctIndex: 1, explanation: 'ASPICE đánh giá năng lực quy trình; ISO 26262 lo an toàn sản phẩm.' },
  { id: 'q2', question: 'The heart of the ASPICE V-model is?|||Trái tim của V-model ASPICE là?', options: ['Using the newest compiler|||Dùng trình biên dịch mới nhất', 'Bidirectional traceability requirement to test|||Truy vết hai chiều từ yêu cầu tới kiểm thử', 'Writing code as fast as possible|||Viết mã nhanh nhất có thể', 'Avoiding all documentation|||Tránh mọi tài liệu'], correctIndex: 1, explanation: 'Mỗi mức bên trái (yêu cầu/thiết kế) truy vết tới kiểm thử bên phải tương ứng.' },
  { id: 'q3', question: 'At ASPICE Capability Level 2 a process is?|||Ở ASPICE Level 2, một quy trình là?', options: ['Incomplete|||Chưa hoàn chỉnh', 'Managed — planned and monitored|||Được quản lý — có kế hoạch và giám sát', 'Innovating|||Đổi mới', 'Non-existent|||Không tồn tại'], correctIndex: 1, explanation: 'Level 1 Performed, Level 2 Managed (kế hoạch/giám sát/kiểm soát work product), Level 3 Established.' },
]);

const c6 = doc('sps301-6-1-iso21434', '6.1 — ISO/SAE 21434 cybersecurity|||6.1 — An ninh mạng ISO/SAE 21434',
  'Cybersecurity engineering; attack surface ô tô; TARA (threat analysis & risk assessment); secure development; UN R155.',
  [[
    `<span class="eyebrow">SPS301 · Chapter 6 · Lesson 6.1</span>
<h2>ISO/SAE 21434 — automotive cybersecurity</h2>
<p>A connected car is attackable: over-the-air updates, Bluetooth, cellular, the OBD-II port and even the CAN bus. <strong>ISO/SAE 21434</strong> defines <strong>cybersecurity engineering</strong> across the vehicle lifecycle, and <strong>UN Regulation R155</strong> makes a Cyber Security Management System (CSMS) mandatory for type approval.</p>
<h3>TARA — Threat Analysis and Risk Assessment</h3>
<pre><code class="language-text">1. Asset identification     what must be protected (e.g. brake command)
2. Threat scenarios         how it could be attacked (spoof a CAN frame)
3. Impact rating            safety / financial / operational / privacy
4. Attack feasibility       how easy the attack is
5. Risk = Impact x Feasibility  -> decide treatment</code></pre>
<p>Security uses the <strong>CIA</strong> goals — Confidentiality, Integrity, Availability — plus Authenticity. Note the difference from safety: <strong>safety</strong> protects people from the system; <strong>security</strong> protects the system from attackers. In cars they interact — a security breach can defeat a safety function.</p>
<h3>Secure development measures</h3>
<ul>
<li><strong>Secure boot</strong> and signed firmware so only authentic code runs.</li>
<li><strong>Message authentication</strong> (e.g. AUTOSAR SecOC) so a forged CAN frame is rejected.</li>
<li><strong>HSM</strong> (Hardware Security Module) to store keys and do crypto.</li>
<li><strong>Defence in depth</strong>, least privilege, and a plan for security updates in the field.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Security is a lifecycle activity, not a one-off audit: monitor for new threats and ship updates for the whole 15-year life of the vehicle.</div>`,
    `<span class="eyebrow">SPS301 · Chương 6 · Bài 6.1</span>
<h2>ISO/SAE 21434 — an ninh mạng ô tô</h2>
<p>Một chiếc xe kết nối có thể bị tấn công: cập nhật qua mạng (OTA), Bluetooth, di động, cổng OBD-II và cả bus CAN. <strong>ISO/SAE 21434</strong> định nghĩa <strong>kỹ nghệ an ninh mạng</strong> suốt vòng đời xe, và <strong>Quy định UN R155</strong> bắt buộc phải có Hệ thống quản lý an ninh mạng (CSMS) để được phê duyệt kiểu loại.</p>
<h3>TARA — Phân tích mối đe dọa &amp; đánh giá rủi ro</h3>
<pre><code class="language-text">1. Xac dinh tai san      can bao ve gi (vd lenh phanh)
2. Kich ban de doa        co the bi tan cong the nao (gia mao khung CAN)
3. Danh gia tac dong      an toan / tai chinh / van hanh / rieng tu
4. Tinh kha thi tan cong  tan cong de hay kho
5. Rui ro = Tac dong x Kha thi  -> quyet dinh xu ly</code></pre>
<p>An ninh dùng mục tiêu <strong>CIA</strong> — Bí mật, Toàn vẹn, Sẵn sàng — cộng Xác thực. Khác với an toàn: <strong>an toàn</strong> bảo vệ con người khỏi hệ thống; <strong>an ninh</strong> bảo vệ hệ thống khỏi kẻ tấn công. Trên xe chúng tương tác — một lỗ hổng an ninh có thể vô hiệu một chức năng an toàn.</p>
<h3>Biện pháp phát triển an toàn bảo mật</h3>
<ul>
<li><strong>Secure boot</strong> và firmware ký số để chỉ mã xác thực mới chạy.</li>
<li><strong>Xác thực thông điệp</strong> (vd AUTOSAR SecOC) để khung CAN giả bị từ chối.</li>
<li><strong>HSM</strong> (mô-đun an ninh phần cứng) lưu khóa và làm mật mã.</li>
<li><strong>Phòng thủ nhiều lớp</strong>, đặc quyền tối thiểu, và kế hoạch cập nhật bảo mật ngoài thực địa.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> An ninh là hoạt động cả vòng đời, không phải kiểm toán một lần: giám sát mối đe dọa mới và phát hành cập nhật suốt 15 năm tuổi thọ của xe.</div>`,
  ]]);

const c6q = quiz('sps301-quiz-6', 'Quiz 6 — ISO 21434|||Quiz 6 — ISO 21434', [
  { id: 'q1', question: 'What is TARA?|||TARA là gì?', options: ['A programming language|||Một ngôn ngữ lập trình', 'Threat Analysis and Risk Assessment|||Phân tích mối đe dọa và đánh giá rủi ro', 'A test coverage metric|||Một chỉ số độ phủ kiểm thử', 'An ECU model|||Một mẫu ECU'], correctIndex: 1, explanation: 'TARA xác định tài sản, mối đe dọa, tác động và tính khả thi để tính rủi ro an ninh.' },
  { id: 'q2', question: 'Safety vs security — which is correct?|||An toàn vs an ninh — điều nào đúng?', options: ['They are the same thing|||Chúng là một', 'Safety protects people from the system; security protects the system from attackers|||An toàn bảo vệ người khỏi hệ thống; an ninh bảo vệ hệ thống khỏi kẻ tấn công', 'Security protects people; safety protects data|||An ninh bảo vệ người; an toàn bảo vệ dữ liệu', 'Neither applies to cars|||Cả hai không áp dụng cho ô tô'], correctIndex: 1, explanation: 'An toàn (ISO 26262) và an ninh (ISO 21434) khác mục tiêu nhưng tương tác trên xe.' },
  { id: 'q3', question: 'Which measure rejects a forged CAN frame?|||Biện pháp nào từ chối một khung CAN giả mạo?', options: ['Faster CPU|||CPU nhanh hơn', 'Message authentication (e.g. SecOC)|||Xác thực thông điệp (vd SecOC)', 'More RAM|||Nhiều RAM hơn', 'A brighter dashboard|||Bảng điều khiển sáng hơn'], correctIndex: 1, explanation: 'Xác thực thông điệp (SecOC) đảm bảo tính toàn vẹn/xác thực, chặn khung giả.' },
]);

const c7 = doc('sps301-7-1-verification', '7.1 — Verification & testing|||7.1 — Kiểm thử & xác minh',
  'Unit/integration/qualification test; structural coverage (statement/branch/MC/DC); static analysis; MIL/SIL/PIL/HIL.',
  [[
    `<span class="eyebrow">SPS301 · Chapter 7 · Lesson 7.1</span>
<h2>Verification &amp; testing</h2>
<h3>Test levels (the right side of the V)</h3>
<ul>
<li><strong>Unit test</strong> — one function/module in isolation.</li>
<li><strong>Integration test</strong> — modules working together and their interfaces.</li>
<li><strong>Qualification / system test</strong> — the whole item against its requirements.</li>
</ul>
<h3>Structural coverage</h3>
<p>How much of the code did the tests actually exercise? Higher ASIL demands stronger coverage:</p>
<pre><code class="language-text">Statement coverage  every line executed at least once
Branch coverage     every if-branch taken true AND false
MC/DC               each condition independently affects the outcome
                    (Modified Condition / Decision Coverage)
ISO 26262: MC/DC is highly recommended for ASIL D.</code></pre>
<h3>Static analysis</h3>
<p><strong>Static analysis</strong> inspects code without running it — it enforces MISRA rules and finds bugs such as null dereferences, overflow and unreachable code (Polyspace, Coverity, Cppcheck).</p>
<h3>The X-in-the-Loop chain</h3>
<pre><code class="language-text">MIL  Model-in-the-Loop     test the model (Simulink) on the PC
SIL  Software-in-the-Loop  test the generated/written code on the PC
PIL  Processor-in-the-Loop code on the real target processor
HIL  Hardware-in-the-Loop  ECU wired to a simulated car in real time</code></pre>
<div class="callout"><span class="badge">Why HIL matters</span> HIL lets you test dangerous scenarios (brake failure, sensor dropout) safely and repeatably — without risking a real car or driver.</div>`,
    `<span class="eyebrow">SPS301 · Chương 7 · Bài 7.1</span>
<h2>Kiểm thử &amp; xác minh</h2>
<h3>Các mức kiểm thử (nhánh phải chữ V)</h3>
<ul>
<li><strong>Unit test</strong> — một hàm/mô-đun tách biệt.</li>
<li><strong>Integration test</strong> — các mô-đun phối hợp và giao diện giữa chúng.</li>
<li><strong>Qualification / system test</strong> — toàn item đối chiếu yêu cầu.</li>
</ul>
<h3>Độ phủ cấu trúc</h3>
<p>Kiểm thử thực sự chạy qua bao nhiêu phần mã? ASIL càng cao đòi độ phủ càng mạnh:</p>
<pre><code class="language-text">Statement coverage  moi dong duoc chay it nhat mot lan
Branch coverage     moi nhanh if lay ca true VA false
MC/DC               moi dieu kien doc lap tac dong toi ket qua
                    (Modified Condition / Decision Coverage)
ISO 26262: MC/DC duoc rat khuyen nghi cho ASIL D.</code></pre>
<h3>Phân tích tĩnh</h3>
<p><strong>Phân tích tĩnh</strong> soi mã mà không chạy — nó thực thi quy tắc MISRA và tìm lỗi như truy cập con trỏ null, tràn số và mã không thể tới (Polyspace, Coverity, Cppcheck).</p>
<h3>Chuỗi X-in-the-Loop</h3>
<pre><code class="language-text">MIL  Model-in-the-Loop     kiem mo hinh (Simulink) tren PC
SIL  Software-in-the-Loop  kiem ma da sinh/viet tren PC
PIL  Processor-in-the-Loop ma tren bo xu ly dich thuc
HIL  Hardware-in-the-Loop  ECU noi voi xe mo phong theo thoi gian thuc</code></pre>
<div class="callout"><span class="badge">Vì sao HIL quan trọng</span> HIL cho phép kiểm các kịch bản nguy hiểm (hỏng phanh, mất cảm biến) an toàn và lặp lại được — không phải mạo hiểm xe thật hay tài xế thật.</div>`,
  ]]);

const c7q = quiz('sps301-quiz-7', 'Quiz 7 — Verification & testing|||Quiz 7 — Kiểm thử & xác minh', [
  { id: 'q1', question: 'Which coverage does ISO 26262 highly recommend for ASIL D?|||ISO 26262 rất khuyến nghị độ phủ nào cho ASIL D?', options: ['Statement coverage only|||Chỉ statement coverage', 'MC/DC (Modified Condition/Decision Coverage)|||MC/DC (độ phủ điều kiện/quyết định sửa đổi)', 'No coverage needed|||Không cần độ phủ', 'Comment coverage|||Độ phủ chú thích'], correctIndex: 1, explanation: 'MC/DC đảm bảo mỗi điều kiện độc lập ảnh hưởng kết quả — khuyến nghị cao cho ASIL D.' },
  { id: 'q2', question: 'What does static analysis do?|||Phân tích tĩnh làm gì?', options: ['Runs the code on hardware|||Chạy mã trên phần cứng', 'Inspects code without running it (finds bugs, checks MISRA)|||Soi mã mà không chạy (tìm lỗi, kiểm MISRA)', 'Compiles the code faster|||Biên dịch mã nhanh hơn', 'Measures CPU temperature|||Đo nhiệt độ CPU'], correctIndex: 1, explanation: 'Phân tích tĩnh soi mã nguồn không cần chạy, thực thi MISRA và tìm lỗi tiềm ẩn.' },
  { id: 'q3', question: 'In HIL testing, what is connected?|||Trong kiểm thử HIL, cái gì được kết nối?', options: ['Only a Simulink model on a PC|||Chỉ một mô hình Simulink trên PC', 'A real ECU wired to a simulated vehicle in real time|||Một ECU thật nối với xe mô phỏng theo thời gian thực', 'Two developers|||Hai lập trình viên', 'A printer|||Một máy in'], correctIndex: 1, explanation: 'HIL = Hardware-in-the-Loop: ECU thật chạy với xe mô phỏng, kiểm kịch bản nguy hiểm an toàn.' },
]);

const c8 = doc('sps301-8-1-process-tools', '8.1 — Development process & tools|||8.1 — Quy trình phát triển & công cụ',
  'V-model tổng thể; requirement traceability; configuration & change management; toolchain ô tô (model-based, static, ALM).',
  [[
    `<span class="eyebrow">SPS301 · Chapter 8 · Lesson 8.1</span>
<h2>Development process &amp; tools</h2>
<h3>The V-model, end to end</h3>
<p>Automotive projects follow the <strong>V-model</strong>: the left side defines and builds (requirements → architecture → design → code); the bottom is implementation; the right side verifies each corresponding level (unit → integration → system → acceptance). Every left item has a matching right test.</p>
<h3>Requirement traceability</h3>
<pre><code class="language-text">Stakeholder need
   |-> System requirement
        |-> Software requirement  &lt;----+
             |-> Design                |  bidirectional links
                  |-> Code            |  (ISO 26262 & ASPICE both require)
                       |-> Test  -----+</code></pre>
<p>Two-way links prove that <em>every</em> requirement is implemented and tested, and that <em>no</em> code exists without a requirement behind it — the basis of a safety/assessment argument.</p>
<h3>Configuration &amp; change management</h3>
<ul>
<li><strong>Version control</strong> (Git) with baselines and tags for each release.</li>
<li><strong>Change management</strong> — every change is a reviewed, approved, traceable request; nothing changes silently.</li>
<li><strong>Build &amp; CI</strong> — reproducible builds and automated pipelines that run static analysis and tests.</li>
</ul>
<h3>The automotive toolchain</h3>
<ul>
<li><strong>Requirements / ALM</strong> — DOORS, Polarion, Codebeamer.</li>
<li><strong>Model-based design &amp; code generation</strong> — MATLAB/Simulink, TargetLink.</li>
<li><strong>Static analysis / MISRA</strong> — Polyspace, Coverity, PC-lint.</li>
<li><strong>Test &amp; HIL</strong> — VectorCAST, Tessy, dSPACE, ETAS.</li>
</ul>
<div class="callout"><span class="badge">Putting it together</span> MISRA (code) + AUTOSAR (architecture) + ISO 26262 (safety) + ASPICE (process) + ISO 21434 (security), tied by traceability and enforced by the toolchain — that is professional automotive software engineering.</div>`,
    `<span class="eyebrow">SPS301 · Chương 8 · Bài 8.1</span>
<h2>Quy trình phát triển &amp; công cụ</h2>
<h3>V-model, từ đầu tới cuối</h3>
<p>Dự án ô tô theo <strong>V-model</strong>: nhánh trái định nghĩa và xây (yêu cầu → kiến trúc → thiết kế → mã); đáy là hiện thực; nhánh phải xác minh từng mức tương ứng (unit → tích hợp → hệ thống → chấp nhận). Mỗi mục bên trái có một kiểm thử bên phải.</p>
<h3>Truy vết yêu cầu</h3>
<pre><code class="language-text">Nhu cau ben lien quan
   |-> Yeu cau he thong
        |-> Yeu cau phan mem  &lt;----+
             |-> Thiet ke          |  lien ket hai chieu
                  |-> Ma           |  (ISO 26262 & ASPICE deu doi)
                       |-> Test ---+</code></pre>
<p>Liên kết hai chiều chứng minh <em>mọi</em> yêu cầu đều được hiện thực và kiểm thử, và <em>không</em> mã nào tồn tại mà thiếu yêu cầu đứng sau — nền của một luận cứ an toàn/đánh giá.</p>
<h3>Quản lý cấu hình &amp; thay đổi</h3>
<ul>
<li><strong>Quản lý phiên bản</strong> (Git) với baseline và tag cho từng bản phát hành.</li>
<li><strong>Quản lý thay đổi</strong> — mỗi thay đổi là một yêu cầu được review, duyệt, truy vết được; không có gì đổi âm thầm.</li>
<li><strong>Build &amp; CI</strong> — build tái lập được và pipeline tự động chạy phân tích tĩnh và kiểm thử.</li>
</ul>
<h3>Chuỗi công cụ ô tô</h3>
<ul>
<li><strong>Yêu cầu / ALM</strong> — DOORS, Polarion, Codebeamer.</li>
<li><strong>Thiết kế dựa mô hình &amp; sinh mã</strong> — MATLAB/Simulink, TargetLink.</li>
<li><strong>Phân tích tĩnh / MISRA</strong> — Polyspace, Coverity, PC-lint.</li>
<li><strong>Kiểm thử &amp; HIL</strong> — VectorCAST, Tessy, dSPACE, ETAS.</li>
</ul>
<div class="callout"><span class="badge">Ghép lại</span> MISRA (mã) + AUTOSAR (kiến trúc) + ISO 26262 (an toàn) + ASPICE (quy trình) + ISO 21434 (an ninh), buộc lại bằng truy vết và thực thi bằng chuỗi công cụ — đó là kỹ nghệ phần mềm ô tô chuyên nghiệp.</div>`,
  ]]);

const c8q = quiz('sps301-quiz-8', 'Quiz 8 — Process & tools|||Quiz 8 — Quy trình & công cụ', [
  { id: 'q1', question: 'What does requirement traceability guarantee?|||Truy vết yêu cầu bảo đảm điều gì?', options: ['Faster code|||Mã nhanh hơn', 'Every requirement is implemented and tested, and no code lacks a requirement|||Mọi yêu cầu đều được hiện thực và kiểm thử, không mã nào thiếu yêu cầu', 'Smaller binaries|||Tệp nhị phân nhỏ hơn', 'Cheaper hardware|||Phần cứng rẻ hơn'], correctIndex: 1, explanation: 'Liên kết hai chiều yêu cầu ↔ test là nền của luận cứ an toàn (ISO 26262 & ASPICE đòi).' },
  { id: 'q2', question: 'On the left side of the V-model you?|||Ở nhánh trái của V-model bạn?', options: ['Test the system|||Kiểm thử hệ thống', 'Define and design (requirements, architecture, design)|||Định nghĩa và thiết kế (yêu cầu, kiến trúc, thiết kế)', 'Ship to production|||Phát hành lên production', 'Retire the product|||Ngừng sản phẩm'], correctIndex: 1, explanation: 'Nhánh trái = định nghĩa/thiết kế; đáy = viết mã; nhánh phải = kiểm thử/xác minh.' },
  { id: 'q3', question: 'Which is a static analysis / MISRA tool?|||Công cụ nào là phân tích tĩnh / MISRA?', options: ['dSPACE HIL rig|||Bộ HIL dSPACE', 'Polyspace / Coverity|||Polyspace / Coverity', 'DOORS requirements tool|||Công cụ yêu cầu DOORS', 'Git only|||Chỉ Git'], correctIndex: 1, explanation: 'Polyspace, Coverity, PC-lint là công cụ phân tích tĩnh kiểm MISRA; DOORS là ALM, dSPACE là HIL.' },
]);

export default {
  semester: { code: 'FPTU_Hola8', name: 'Kỳ 8', ordinal: 10 },
  course: {
    courseCode: 'SPS301',
    slug: 'sps301-software-programming-standards-for-automotive-system',
    title: 'Software & Programming Standards for Automotive System',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SPS301.webp',
    shortDescription: 'Standards for automotive software — MISRA C rules, AUTOSAR (Classic & Adaptive, RTE, BSW), ISO 26262 functional safety & ASIL, Automotive SPICE, ISO 21434 cybersecurity, verification (MC/DC, MIL/SIL/HIL). Bilingual, with C examples & quizzes.|||Chuẩn phần mềm ô tô — quy tắc MISRA C, AUTOSAR (Classic & Adaptive, RTE, BSW), an toàn chức năng ISO 26262 & ASIL, Automotive SPICE, an ninh mạng ISO 21434, kiểm thử (MC/DC, MIL/SIL/HIL). Song ngữ, ví dụ C & quiz.',
    description: 'Môn <strong>SPS301 — Software &amp; Programming Standards for Automotive System</strong> (kỳ 8, ngành Kỹ thuật phần mềm ô tô) dạy các <strong>tiêu chuẩn và kỷ luật kỹ nghệ</strong> giữ cho phần mềm ô tô an toàn, bảo mật và tin cậy. Năm trụ cột: <strong>MISRA C</strong> (viết mã an toàn) → <strong>AUTOSAR</strong> (kiến trúc Classic &amp; Adaptive, RTE, BSW) → <strong>ISO 26262</strong> (an toàn chức năng, ASIL, HARA) → <strong>Automotive SPICE</strong> (V-model, mức năng lực) → <strong>ISO 21434</strong> (an ninh mạng, TARA) → <strong>kiểm thử &amp; xác minh</strong> (MC/DC, phân tích tĩnh, MIL/SIL/HIL) → <strong>quy trình &amp; công cụ</strong> (truy vết yêu cầu, quản lý cấu hình). Bám chuẩn quốc tế, song ngữ, có ví dụ C và quiz mỗi chương.',
    whatYouLearn: 'Đặc thù phần mềm ô tô (nhúng, thời gian thực, tới hạn an toàn); MISRA C:2012 (rule/directive, ví dụ vi phạm/tuân thủ); kiến trúc AUTOSAR (Classic/Adaptive, App/RTE/BSW/MCAL, SWC); ISO 26262 (ASIL A-D, safety lifecycle, HARA); Automotive SPICE (V-model SWE, capability level 0-5); ISO 21434 (TARA, secure boot, SecOC); kiểm thử (statement/branch/MC/DC, static analysis, MIL/SIL/PIL/HIL); quy trình V-model, truy vết yêu cầu, quản lý cấu hình và chuỗi công cụ ô tô.',
    requirements: 'Biết lập trình C cơ bản (con trỏ, kiểu dữ liệu) và nền tảng kỹ thuật phần mềm. Xem điều kiện tiên quyết trong khung chương trình ngành Kỹ thuật phần mềm ô tô trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'MISRA, AUTOSAR, ISO 26262, ASPICE, ISO 21434; lộ trình tự học.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Vì sao ô tô cần chuẩn riêng; năm trụ cột.', lessons: [intro] },
    { title: 'Chương 1 — Phần mềm ô tô & chuẩn|||Chapter 1 — Automotive SW & standards', description: 'Đặc thù automotive SW, E/E, ECU, vì sao cần chuẩn.', lessons: [c1, c1q] },
    { title: 'Chương 2 — MISRA C|||Chapter 2 — MISRA C', description: 'Tập con C an toàn, rule/directive, ví dụ C.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Kiến trúc AUTOSAR|||Chapter 3 — AUTOSAR', description: 'Classic/Adaptive, layered, RTE, BSW.', lessons: [c3, c3q] },
    { title: 'Chương 4 — An toàn chức năng ISO 26262|||Chapter 4 — ISO 26262', description: 'ASIL, safety lifecycle, HARA.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Quy trình ASPICE|||Chapter 5 — Automotive SPICE', description: 'V-model SWE, capability levels.', lessons: [c5, c5q] },
    { title: 'Chương 6 — An ninh mạng ISO 21434|||Chapter 6 — ISO 21434', description: 'Cybersecurity, TARA, secure development.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Kiểm thử & xác minh|||Chapter 7 — Verification & testing', description: 'MC/DC, static analysis, MIL/SIL/HIL.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Quy trình & công cụ|||Chapter 8 — Process & tools', description: 'V-model, truy vết yêu cầu, config mgmt, công cụ.', lessons: [c8, c8q] },
  ],
};
