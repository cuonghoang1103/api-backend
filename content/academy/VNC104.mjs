/**
 * VNC104 — Vietnamese Culture (Cơ sở văn hoá Việt Nam). Ngành Thiết kế mỹ
 * thuật số, kỳ 7, FPTU. Giáo trình: Trần Ngọc Thêm "Cơ sở văn hoá Việt Nam" &
 * "Tìm về bản sắc văn hoá Việt Nam"; Phan Ngọc "Bản sắc văn hoá Việt Nam";
 * Đào Duy Anh "Việt Nam văn hoá sử cương". 8 chương song ngữ + quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('vnc104-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách nền tảng (Trần Ngọc Thêm, Phan Ngọc, Đào Duy Anh), bảo tàng & tài liệu số, YouTube, lộ trình tự học.',
  [[
    `<span class="eyebrow">VNC104 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study <strong>Vietnamese Culture</strong> — from what culture is and how Vietnam is located in space, people and time, to arts and modern design applications — gathered in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for VNC104 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Foundational books</h3>
<ul>
<li>Trần Ngọc Thêm — <em>Cơ sở văn hoá Việt Nam</em> (the standard course text).</li>
<li>Trần Ngọc Thêm — <em>Tìm về bản sắc văn hoá Việt Nam</em>.</li>
<li>Phan Ngọc — <em>Bản sắc văn hoá Việt Nam</em>.</li>
<li>Đào Duy Anh — <em>Việt Nam văn hoá sử cương</em>.</li>
</ul>
<h3>🌐 Official / free references</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Culture_of_Vietnam" target="_blank" rel="noopener">Culture of Vietnam — Wikipedia overview</a></li>
<li><a href="https://vietnam.vnanet.vn/" target="_blank" rel="noopener">Vietnam Pictorial — culture &amp; heritage coverage</a></li>
</ul>
<h3>🏛️ Museums (visit &amp; digital)</h3>
<ul>
<li><a href="http://www.vme.org.vn/" target="_blank" rel="noopener">Vietnam Museum of Ethnology (Bảo tàng Dân tộc học)</a></li>
<li><a href="https://vnfam.vn/" target="_blank" rel="noopener">Vietnam Fine Arts Museum (Bảo tàng Mỹ thuật Việt Nam)</a></li>
</ul>
<h3>▶️ Media</h3>
<ul>
<li><a href="https://www.youtube.com/@VTV24" target="_blank" rel="noopener">VTV24</a> — culture, heritage &amp; festival features.</li>
<li><a href="https://whc.unesco.org/en/statesparties/vn" target="_blank" rel="noopener">UNESCO — Vietnam World Heritage &amp; intangible heritage</a></li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — what culture is; locating Vietnam in space, people &amp; time.</li>
<li><strong>Systems of thought</strong> — yin-yang, five elements, the lunar-solar calendar.</li>
<li><strong>Social &amp; personal life</strong> — village &amp; nation; beliefs, customs &amp; festivals.</li>
<li><strong>Design-ready</strong> — read national identity in motifs, colour &amp; form, then apply it in digital design.</li>
</ol></div>`,
    `<span class="eyebrow">VNC104 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Cơ sở văn hoá Việt Nam</strong> — từ khái niệm văn hoá và cách định vị Việt Nam theo không gian, chủ thể và thời gian, tới nghệ thuật và ứng dụng trong thiết kế đương đại — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của VNC104 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách nền tảng</h3>
<ul>
<li>Trần Ngọc Thêm — <em>Cơ sở văn hoá Việt Nam</em> (sách giáo trình chuẩn).</li>
<li>Trần Ngọc Thêm — <em>Tìm về bản sắc văn hoá Việt Nam</em>.</li>
<li>Phan Ngọc — <em>Bản sắc văn hoá Việt Nam</em>.</li>
<li>Đào Duy Anh — <em>Việt Nam văn hoá sử cương</em>.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://en.wikipedia.org/wiki/Culture_of_Vietnam" target="_blank" rel="noopener">Culture of Vietnam — tổng quan Wikipedia</a></li>
<li><a href="https://vietnam.vnanet.vn/" target="_blank" rel="noopener">Báo ảnh Việt Nam — chuyên đề văn hoá &amp; di sản</a></li>
</ul>
<h3>🏛️ Bảo tàng (tham quan &amp; số hoá)</h3>
<ul>
<li><a href="http://www.vme.org.vn/" target="_blank" rel="noopener">Bảo tàng Dân tộc học Việt Nam</a></li>
<li><a href="https://vnfam.vn/" target="_blank" rel="noopener">Bảo tàng Mỹ thuật Việt Nam</a></li>
</ul>
<h3>▶️ Truyền thông</h3>
<ul>
<li><a href="https://www.youtube.com/@VTV24" target="_blank" rel="noopener">VTV24</a> — phóng sự văn hoá, di sản &amp; lễ hội.</li>
<li><a href="https://whc.unesco.org/en/statesparties/vn" target="_blank" rel="noopener">UNESCO — Di sản thế giới &amp; di sản phi vật thể của Việt Nam</a></li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — văn hoá là gì; định vị Việt Nam theo không gian, chủ thể &amp; thời gian.</li>
<li><strong>Hệ tư tưởng</strong> — âm dương, ngũ hành, lịch âm dương.</li>
<li><strong>Đời sống xã hội &amp; cá nhân</strong> — làng &amp; nước; tín ngưỡng, phong tục &amp; lễ tết.</li>
<li><strong>Sẵn cho thiết kế</strong> — đọc bản sắc dân tộc qua hoa văn, màu &amp; hình khối, rồi vận dụng vào thiết kế số.</li>
</ol></div>`,
  ]]);

const intro = doc('vnc104-0-1-overview', 'Course overview: Vietnamese Culture|||Tổng quan: Cơ sở văn hoá Việt Nam',
  'Văn hoá là gì; vì sao sinh viên thiết kế cần hiểu văn hoá dân tộc; lộ trình 8 chương: định vị → nhận thức → tổ chức xã hội → cá nhân → môi trường tự nhiên → môi trường xã hội → nghệ thuật → bản sắc trong thiết kế số.',
  [[
    `<span class="eyebrow">VNC104 · Lesson 0.1 · Overview</span>
<h2>Vietnamese Culture</h2>
<p class="lead">This course explains <strong>what Vietnamese culture is and how it was formed</strong> — the layer of meaning, values, symbols and habits that a designer must understand to create work that feels authentically Vietnamese rather than borrowed.</p>
<h3>What is culture?</h3>
<p>Following Trần Ngọc Thêm, <strong>culture</strong> is a system of <strong>material and spiritual values</strong> created and accumulated by a human community through its <em>history</em>, in its <em>interaction</em> with the natural and social environment. Four defining traits: <strong>systematic</strong>, <strong>value-bearing</strong>, <strong>human-made</strong>, and <strong>historical</strong>.</p>
<h3>Why it matters for design</h3>
<p>Motifs, colour symbolism, calligraphy, temple architecture and folk art are not decoration — they carry meaning. Knowing the logic behind them lets you reuse national identity with respect and originality in modern digital design.</p>
<h3>Roadmap</h3>
<p>Locating Vietnamese culture → systems of thought (yin-yang, five elements) → organising collective life (village &amp; nation) → organising personal life (beliefs, customs, festivals) → coping with the natural environment (food, dress, housing, travel) → coping with the social environment (China, India, the West) → traditional arts → national identity in contemporary design. Bilingual, with a quiz per chapter.</p>`,
    `<span class="eyebrow">VNC104 · Bài 0.1 · Tổng quan</span>
<h2>Cơ sở văn hoá Việt Nam</h2>
<p class="lead">Môn này lý giải <strong>văn hoá Việt Nam là gì và được hình thành thế nào</strong> — lớp ý nghĩa, giá trị, biểu tượng và thói quen mà một nhà thiết kế phải hiểu để làm ra tác phẩm mang chất Việt thật sự, thay vì vay mượn.</p>
<h3>Văn hoá là gì?</h3>
<p>Theo Trần Ngọc Thêm, <strong>văn hoá</strong> là một hệ thống <strong>giá trị vật chất và tinh thần</strong> do con người sáng tạo và tích luỹ qua <em>lịch sử</em>, trong quá trình <em>tương tác</em> với môi trường tự nhiên và xã hội. Bốn đặc trưng: <strong>tính hệ thống</strong>, <strong>tính giá trị</strong>, <strong>tính nhân sinh</strong> và <strong>tính lịch sử</strong>.</p>
<h3>Vì sao quan trọng với thiết kế</h3>
<p>Hoa văn, biểu tượng màu sắc, thư pháp, kiến trúc đình chùa và mỹ thuật dân gian không phải trang trí — chúng mang ý nghĩa. Hiểu logic đằng sau giúp bạn tái sử dụng bản sắc dân tộc một cách tôn trọng và sáng tạo trong thiết kế số hiện đại.</p>
<h3>Lộ trình</h3>
<p>Định vị văn hoá Việt Nam → hệ tư tưởng (âm dương, ngũ hành) → tổ chức đời sống tập thể (làng &amp; nước) → tổ chức đời sống cá nhân (tín ngưỡng, phong tục, lễ tết) → ứng xử với môi trường tự nhiên (ăn, mặc, ở, đi lại) → ứng xử với môi trường xã hội (Trung Hoa, Ấn Độ, phương Tây) → nghệ thuật truyền thống → bản sắc trong thiết kế đương đại. Song ngữ, có quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('vnc104-1-1-dinh-vi', '1.1 — What culture is & locating Vietnamese culture|||1.1 — Khái niệm & định vị văn hoá Việt Nam',
  'Định nghĩa & 4 đặc trưng của văn hoá; phân biệt văn hoá với văn minh; định vị văn hoá Việt Nam theo 3 toạ độ: không gian (vùng lúa nước), chủ thể (cư dân Bách Việt), thời gian (tiền sử → Đông Sơn → Bắc thuộc → tự chủ).',
  [[
    `<span class="eyebrow">VNC104 · Chapter 1 · Lesson 1.1</span>
<h2>What culture is &amp; locating Vietnamese culture</h2>
<h3>Culture vs. civilisation</h3>
<p><strong>Culture</strong> emphasises spiritual values and is tied to a specific community and history; <strong>civilisation</strong> emphasises the material, technological level of a society. A community can be highly cultured without being the most technologically advanced.</p>
<h3>The three coordinates</h3>
<p>To locate a culture, Trần Ngọc Thêm uses three axes: <strong>space</strong> (where), <strong>subject</strong> (who), and <strong>time</strong> (when).</p>
<pre><code>Locating Vietnamese culture (3 coordinates)
  SPACE   : wet-rice agriculture, Southeast Asia,
            monsoon zone, rivers and deltas
  SUBJECT : Bach Viet / Viet-Muong communities,
            many ethnic groups, agrarian villages
  TIME    : prehistory - Dong Son - a thousand years
            of Chinese rule - self-rule - modern era
</code></pre>
<h3>An agrarian, wet-rice foundation</h3>
<p>Vietnam sits in the <strong>agricultural, communal</strong> cultural type (as opposed to nomadic, individualist types). Rice farming needs collective labour, shared water and fixed settlement — this shapes a culture that is <strong>communal, harmonious and flexible</strong>, valuing the group over the individual.</p>
<div class="callout"><span class="badge">Design lens</span> The village, the river and the rice field are not just history — they are the deep source of Vietnamese motifs, spatial sense and colour palette.</div>`,
    `<span class="eyebrow">VNC104 · Chương 1 · Bài 1.1</span>
<h2>Khái niệm &amp; định vị văn hoá Việt Nam</h2>
<h3>Văn hoá và văn minh</h3>
<p><strong>Văn hoá</strong> nhấn mạnh giá trị tinh thần, gắn với một cộng đồng và lịch sử cụ thể; <strong>văn minh</strong> nhấn mạnh trình độ vật chất, kỹ thuật của xã hội. Một cộng đồng có thể rất giàu văn hoá mà không phải nơi tiên tiến nhất về kỹ thuật.</p>
<h3>Ba toạ độ định vị</h3>
<p>Để định vị một nền văn hoá, Trần Ngọc Thêm dùng ba trục: <strong>không gian</strong> (ở đâu), <strong>chủ thể</strong> (ai), và <strong>thời gian</strong> (khi nào).</p>
<pre><code>Định vị văn hoá Việt Nam (3 toạ độ)
  KHÔNG GIAN : nông nghiệp lúa nước, Đông Nam Á,
               vùng gió mùa, sông ngòi và châu thổ
  CHỦ THỂ    : cộng đồng Bách Việt / Việt - Mường,
               nhiều dân tộc, làng xã nông nghiệp
  THỜI GIAN  : tiền sử - Đông Sơn - ngàn năm Bắc
               thuộc - tự chủ - thời hiện đại
</code></pre>
<h3>Nền tảng nông nghiệp lúa nước</h3>
<p>Việt Nam thuộc loại hình văn hoá <strong>nông nghiệp, trọng cộng đồng</strong> (khác loại du mục, trọng cá nhân). Trồng lúa cần lao động tập thể, chia sẻ nguồn nước và định cư cố định — điều này tạo nên nền văn hoá <strong>trọng tình, hài hoà và linh hoạt</strong>, đề cao tập thể hơn cá nhân.</p>
<div class="callout"><span class="badge">Góc thiết kế</span> Làng, sông và ruộng lúa không chỉ là lịch sử — chúng là nguồn sâu của hoa văn, cảm thức không gian và bảng màu Việt Nam.</div>`,
  ]]);

const c1q = quiz('vnc104-quiz-1', 'Quiz 1 — Locating culture|||Quiz 1 — Định vị văn hoá', [
  { id: 'q1', question: 'Ba toạ độ để định vị một nền văn hoá là?', options: ['Kinh tế - chính trị - xã hội', 'Không gian - chủ thể - thời gian', 'Đất - nước - lửa', 'Bắc - Trung - Nam'], correctIndex: 1, explanation: 'Trần Ngọc Thêm định vị văn hoá theo không gian (ở đâu), chủ thể (ai), thời gian (khi nào).' },
  { id: 'q2', question: 'Văn hoá Việt Nam thuộc loại hình nào?', options: ['Du mục, trọng cá nhân', 'Nông nghiệp lúa nước, trọng cộng đồng', 'Thương nghiệp, trọng cạnh tranh', 'Công nghiệp, trọng kỹ thuật'], correctIndex: 1, explanation: 'Trồng lúa nước cần lao động tập thể và định cư, tạo nền văn hoá nông nghiệp trọng cộng đồng, trọng tình.' },
  { id: 'q3', question: 'Điểm khác nhau cốt lõi giữa văn hoá và văn minh?', options: ['Văn hoá thiên về giá trị tinh thần & lịch sử; văn minh thiên về trình độ vật chất, kỹ thuật', 'Chúng hoàn toàn giống nhau', 'Văn minh có trước văn hoá', 'Văn hoá chỉ có ở phương Tây'], correctIndex: 0, explanation: 'Văn hoá gắn giá trị tinh thần và bề dày lịch sử của cộng đồng; văn minh nhấn mạnh trình độ vật chất, kỹ thuật.' },
]);

const c2 = doc('vnc104-2-1-nhan-thuc', '2.1 — Culture of cognition: yin-yang, five elements|||2.1 — Văn hoá nhận thức: âm dương, ngũ hành',
  'Tư duy lưỡng phân âm dương (hài hoà, chuyển hoá); triết lý ngũ hành (tương sinh/tương khắc); lịch âm dương & hệ can chi; cách người Việt nhận thức vũ trụ và con người.',
  [[
    `<span class="eyebrow">VNC104 · Chapter 2 · Lesson 2.1</span>
<h2>Culture of cognition: yin-yang &amp; five elements</h2>
<h3>Yin-yang thinking</h3>
<p>The oldest layer of Vietnamese thought is <strong>yin-yang (âm dương)</strong> — a philosophy of <em>pairs</em>: earth/sky, mother/father, cold/hot, soft/hard. Two ideas matter: <strong>everything contains its opposite</strong>, and <strong>opposites transform into each other</strong>. This drives a preference for <strong>balance and harmony</strong> rather than either extreme.</p>
<h3>The five elements (ngũ hành)</h3>
<pre><code>Five elements: Metal - Wood - Water - Fire - Earth
  Generating (sinh): Wood -> Fire -> Earth -> Metal -> Water -> Wood
  Overcoming (khac): Wood -> Earth -> Water -> Fire -> Metal -> Wood
Directions/colours: East=Wood/green, South=Fire/red,
  Centre=Earth/yellow, West=Metal/white, North=Water/black
</code></pre>
<h3>Calendar &amp; the sexagenary cycle</h3>
<p>The traditional <strong>lunar-solar calendar</strong> combines the moon (months, Tết, festivals) with the sun (24 solar terms for farming). Years are named by <strong>10 heavenly stems and 12 earthly branches (can chi)</strong>, cycling every 60 years — the source of the 12 zodiac animals.</p>
<div class="callout"><span class="badge">Design lens</span> The five-element colour-direction map is a ready-made, culturally grounded palette system: green-east, red-south, yellow-centre, white-west, black-north.</div>`,
    `<span class="eyebrow">VNC104 · Chương 2 · Bài 2.1</span>
<h2>Văn hoá nhận thức: âm dương &amp; ngũ hành</h2>
<h3>Tư duy âm dương</h3>
<p>Lớp tư tưởng cổ nhất của người Việt là <strong>âm dương</strong> — triết lý về <em>các cặp đôi</em>: đất/trời, mẹ/cha, lạnh/nóng, mềm/cứng. Hai ý cốt lõi: <strong>trong cái này có cái kia</strong>, và <strong>âm dương chuyển hoá lẫn nhau</strong>. Từ đó sinh ra xu hướng ưa <strong>cân bằng, hài hoà</strong> thay vì cực đoan một phía.</p>
<h3>Ngũ hành</h3>
<pre><code>Ngũ hành: Kim - Mộc - Thuỷ - Hoả - Thổ
  Tương sinh: Mộc -> Hoả -> Thổ -> Kim -> Thuỷ -> Mộc
  Tương khắc: Mộc -> Thổ -> Thuỷ -> Hoả -> Kim -> Mộc
Hướng/màu: Đông=Mộc/xanh, Nam=Hoả/đỏ,
  Trung tâm=Thổ/vàng, Tây=Kim/trắng, Bắc=Thuỷ/đen
</code></pre>
<h3>Lịch pháp &amp; hệ can chi</h3>
<p><strong>Lịch âm dương</strong> truyền thống kết hợp mặt trăng (tháng, Tết, lễ hội) với mặt trời (24 tiết khí phục vụ nhà nông). Năm được gọi tên theo <strong>10 thiên can và 12 địa chi</strong>, xoay vòng 60 năm một lần — nguồn gốc của 12 con giáp.</p>
<div class="callout"><span class="badge">Góc thiết kế</span> Bản đồ màu - phương của ngũ hành là một hệ bảng màu có sẵn, giàu căn cứ văn hoá: xanh-đông, đỏ-nam, vàng-trung tâm, trắng-tây, đen-bắc.</div>`,
  ]]);

const c2q = quiz('vnc104-quiz-2', 'Quiz 2 — Cognition|||Quiz 2 — Nhận thức', [
  { id: 'q1', question: 'Đặc điểm cốt lõi của tư duy âm dương là gì?', options: ['Chỉ có một cực duy nhất', 'Trong cái này có cái kia và âm dương chuyển hoá lẫn nhau', 'Âm luôn thắng dương', 'Không liên quan đến cân bằng'], correctIndex: 1, explanation: 'Âm dương là triết lý cặp đôi: trong âm có dương, trong dương có âm, và chúng chuyển hoá cho nhau, hướng tới hài hoà.' },
  { id: 'q2', question: 'Theo ngũ hành, quan hệ tương sinh đúng là?', options: ['Mộc sinh Thuỷ', 'Mộc sinh Hoả', 'Hoả sinh Mộc', 'Thổ sinh Mộc'], correctIndex: 1, explanation: 'Vòng tương sinh: Mộc → Hoả → Thổ → Kim → Thuỷ → Mộc.' },
  { id: 'q3', question: 'Lịch truyền thống của người Việt là loại lịch nào?', options: ['Thuần dương (chỉ mặt trời)', 'Thuần âm (chỉ mặt trăng)', 'Âm dương kết hợp (trăng cho tháng/lễ, mặt trời cho tiết khí)', 'Không có lịch riêng'], correctIndex: 2, explanation: 'Lịch âm dương kết hợp mặt trăng (tháng, Tết) với mặt trời (24 tiết khí phục vụ nông nghiệp); năm gọi theo can chi.' },
]);

const c3 = doc('vnc104-3-1-doi-song-tap-the', '3.1 — Organising collective life: village & nation|||3.1 — Tổ chức đời sống tập thể: làng & nước',
  'Làng xã Việt Nam (tính cộng đồng & tính tự trị, luỹ tre, hương ước, đình làng); quan hệ làng - nước; tính tự trị của làng và ảnh hưởng tới tính cách, thiết chế xã hội.',
  [[
    `<span class="eyebrow">VNC104 · Chapter 3 · Lesson 3.1</span>
<h2>Organising collective life: village &amp; nation</h2>
<h3>The village (làng) — the basic cell</h3>
<p>Vietnamese society is built from <strong>villages</strong>, not individuals. A village has two faces: <strong>community</strong> (mutual help, shared land, collective festivals at the đình) and <strong>autonomy</strong> (its own hương ước — village charter — behind the bamboo hedge). The saying <em>"the king's law yields to village custom"</em> captures this self-rule.</p>
<pre><code>Village organisation (overlapping ties)
  by BLOOD     : lineage, clan (họ)
  by PLACE     : hamlet, neighbourhood (xóm, giáp)
  by INTEREST  : guilds, mutual-aid associations (phường, hội)
  by AGE/RANK  : village council, elders (hội đồng, bô lão)
Symbols: bamboo hedge, communal house (đình), banyan-well-yard
</code></pre>
<h3>From village to nation</h3>
<p>The <strong>nation (nước)</strong> grew as a federation of villages, bound by the need to <strong>build dykes and fight floods</strong> and to <strong>resist invasion</strong>. This gives Vietnamese patriotism a communal, village-rooted character — loyalty to homeland (quê hương) scaling up to country.</p>
<div class="callout"><span class="badge">Design lens</span> The đình, the banyan tree, the village well and the bamboo hedge are enduring visual shorthands for "Vietnamese community".</div>`,
    `<span class="eyebrow">VNC104 · Chương 3 · Bài 3.1</span>
<h2>Tổ chức đời sống tập thể: làng &amp; nước</h2>
<h3>Làng — tế bào cơ bản</h3>
<p>Xã hội Việt Nam dựng từ <strong>làng</strong> chứ không từ cá nhân. Làng có hai mặt: <strong>tính cộng đồng</strong> (tương trợ, ruộng công, hội hè ở đình) và <strong>tính tự trị</strong> (có hương ước riêng sau luỹ tre). Câu <em>"phép vua thua lệ làng"</em> nói đúng tính tự trị này.</p>
<pre><code>Tổ chức làng (các mối ràng buộc đan xen)
  theo HUYẾT THỐNG : dòng họ (họ)
  theo ĐỊA VỰC     : xóm, giáp
  theo SỞ THÍCH    : phường, hội tương trợ
  theo TUỔI/VỊ THẾ : hội đồng, bô lão
Biểu tượng: luỹ tre, đình làng, cây đa - giếng nước - sân đình
</code></pre>
<h3>Từ làng tới nước</h3>
<p><strong>Nước</strong> lớn lên như một liên minh của các làng, gắn kết bởi nhu cầu <strong>đắp đê trị thuỷ</strong> và <strong>chống ngoại xâm</strong>. Điều này khiến lòng yêu nước của người Việt mang tính cộng đồng, bắt rễ từ làng — tình quê hương mở rộng thành tình đất nước.</p>
<div class="callout"><span class="badge">Góc thiết kế</span> Đình làng, cây đa, giếng nước và luỹ tre là những hình ảnh cô đọng bền vững cho khái niệm "cộng đồng Việt Nam".</div>`,
  ]]);

const c3q = quiz('vnc104-quiz-3', 'Quiz 3 — Village & nation|||Quiz 3 — Làng & nước', [
  { id: 'q1', question: 'Hai đặc trưng cơ bản của làng Việt truyền thống là?', options: ['Cạnh tranh và cá nhân', 'Tính cộng đồng và tính tự trị', 'Đô thị hoá và thương mại', 'Du mục và di cư'], correctIndex: 1, explanation: 'Làng vừa mang tính cộng đồng (tương trợ, hội hè) vừa mang tính tự trị (hương ước riêng sau luỹ tre).' },
  { id: 'q2', question: 'Câu "phép vua thua lệ làng" phản ánh điều gì?', options: ['Làng không có luật', 'Tính tự trị mạnh của làng xã', 'Vua không tồn tại', 'Làng lớn hơn nước'], correctIndex: 1, explanation: 'Câu này thể hiện tính tự trị: lệ làng (hương ước) nhiều khi chi phối đời sống mạnh hơn luật vua.' },
  { id: 'q3', question: 'Nhu cầu nào gắn kết các làng thành nước?', options: ['Đắp đê trị thuỷ và chống ngoại xâm', 'Buôn bán quốc tế', 'Khai thác khoáng sản', 'Du lịch'], correctIndex: 0, explanation: 'Trị thuỷ (đắp đê chống lũ) và chống giặc ngoại xâm là hai nhu cầu chung liên kết làng thành quốc gia.' },
]);

const c4 = doc('vnc104-4-1-doi-song-ca-nhan', '4.1 — Organising personal life: beliefs, customs, festivals|||4.1 — Tổ chức đời sống cá nhân: tín ngưỡng, phong tục, lễ tết',
  'Tín ngưỡng bản địa (thờ cúng tổ tiên, thờ Mẫu, thành hoàng, phồn thực); phong tục vòng đời (cưới, tang, sinh nhật ta); hệ lễ tết theo mùa vụ (Tết Nguyên đán, Trung thu, Vu Lan); giao tiếp trọng tình.',
  [[
    `<span class="eyebrow">VNC104 · Chapter 4 · Lesson 4.1</span>
<h2>Organising personal life: beliefs, customs &amp; festivals</h2>
<h3>Indigenous beliefs (tín ngưỡng)</h3>
<p>Before and beneath the imported religions lies a native layer: <strong>ancestor worship</strong> (the family altar), <strong>Mother-Goddess worship (thờ Mẫu)</strong>, the <strong>village tutelary god (thành hoàng)</strong>, and <strong>fertility cults</strong> tied to rice and rain. Belief here is practical and this-worldly — asking for health, harvest and harmony.</p>
<h3>Life-cycle customs (phong tục)</h3>
<p>Rites mark the arc of a life: <strong>birth, coming of age, marriage, death and anniversary (giỗ)</strong>. Weddings and funerals in particular are communal events governed by detailed etiquette.</p>
<pre><code>Seasonal festival cycle (lunar)
  1st month  : Tet Nguyen Dan (Lunar New Year) - the great feast
  3rd month  : Thanh Minh (tomb-tending)
  5th month  : Tet Doan Ngo (mid-year, pest-clearing)
  7th month  : Vu Lan (filial piety, wandering souls)
  8th month  : Trung Thu (mid-autumn, children)
  10th month : harvest / new-rice offerings
</code></pre>
<h3>A culture of feeling</h3>
<p>Communication is <strong>relationship-first (trọng tình)</strong>: indirect, harmony-preserving, sensitive to face and hierarchy — <em>"a bit of sentiment beats a lot of reason"</em>.</p>
<div class="callout"><span class="badge">Design lens</span> The festival calendar is a year-round content and campaign engine — each Tết has its own colours, foods and symbols.</div>`,
    `<span class="eyebrow">VNC104 · Chương 4 · Bài 4.1</span>
<h2>Tổ chức đời sống cá nhân: tín ngưỡng, phong tục &amp; lễ tết</h2>
<h3>Tín ngưỡng bản địa</h3>
<p>Trước và bên dưới các tôn giáo du nhập là một lớp bản địa: <strong>thờ cúng tổ tiên</strong> (bàn thờ gia đình), <strong>thờ Mẫu</strong>, <strong>thành hoàng làng</strong>, và <strong>tín ngưỡng phồn thực</strong> gắn với lúa và mưa. Ở đây niềm tin mang tính thực tế, hướng về đời sống — cầu sức khoẻ, mùa màng và hoà thuận.</p>
<h3>Phong tục vòng đời</h3>
<p>Nghi lễ đánh dấu chặng đường một đời người: <strong>sinh, trưởng thành, cưới hỏi, tang ma và giỗ</strong>. Đặc biệt cưới và tang là những sự kiện cộng đồng, chi phối bởi nghi thức chi tiết.</p>
<pre><code>Vòng lễ tết theo mùa (âm lịch)
  Tháng 1  : Tết Nguyên đán - đại lễ lớn nhất
  Tháng 3  : Thanh minh (tảo mộ)
  Tháng 5  : Tết Đoan ngọ (giữa năm, diệt sâu bọ)
  Tháng 7  : Vu Lan (báo hiếu, cúng cô hồn)
  Tháng 8  : Trung thu (rằm tháng tám, trẻ em)
  Tháng 10 : cơm mới / mừng mùa gặt
</code></pre>
<h3>Văn hoá trọng tình</h3>
<p>Giao tiếp <strong>trọng tình</strong>: ý nhị, giữ hoà khí, nhạy cảm với thể diện và tôn ti — <em>"một bồ cái lý không bằng một tí cái tình"</em>.</p>
<div class="callout"><span class="badge">Góc thiết kế</span> Lịch lễ tết là cỗ máy nội dung và chiến dịch quanh năm — mỗi Tết có màu sắc, món ăn và biểu tượng riêng.</div>`,
  ]]);

const c4q = quiz('vnc104-quiz-4', 'Quiz 4 — Beliefs & festivals|||Quiz 4 — Tín ngưỡng & lễ tết', [
  { id: 'q1', question: 'Tín ngưỡng nào là nền tảng, phổ biến nhất trong gia đình Việt?', options: ['Thờ cúng tổ tiên', 'Thờ thần Zeus', 'Thờ lửa', 'Không có tín ngưỡng'], correctIndex: 0, explanation: 'Thờ cúng tổ tiên qua bàn thờ gia đình là tín ngưỡng bản địa nền tảng, gắn với đạo hiếu của người Việt.' },
  { id: 'q2', question: 'Tết Trung thu (rằm tháng tám) gắn nhiều nhất với đối tượng nào?', options: ['Người cao tuổi', 'Trẻ em', 'Nhà buôn', 'Quân đội'], correctIndex: 1, explanation: 'Trung thu là tết của trẻ em: đèn lồng, múa lân, phá cỗ trông trăng.' },
  { id: 'q3', question: 'Đặc điểm "trọng tình" trong giao tiếp của người Việt nghĩa là?', options: ['Ưu tiên quan hệ, hoà khí, thể diện hơn lý lẽ cứng nhắc', 'Chỉ nói thẳng, không nể nang', 'Không quan tâm người khác', 'Luôn tranh cãi tới cùng'], correctIndex: 0, explanation: 'Trọng tình: ứng xử ý nhị, giữ hoà khí và thể diện; "một bồ cái lý không bằng một tí cái tình".' },
]);

const c5 = doc('vnc104-5-1-moi-truong-tu-nhien', '5.1 — Coping with nature: food, dress, housing, travel|||5.1 — Ứng xử với môi trường tự nhiên: ăn, mặc, ở, đi lại',
  'Văn hoá tận dụng & ứng phó với môi trường tự nhiên nóng ẩm: ẩm thực cơm-rau-cá & cân bằng âm dương; trang phục thoáng mát (áo dài, nón lá); nhà ở hoà thiên nhiên (nhà sàn, hướng nam); giao thông đường thuỷ.',
  [[
    `<span class="eyebrow">VNC104 · Chapter 5 · Lesson 5.1</span>
<h2>Coping with the natural environment</h2>
<p class="lead">Vietnamese material culture is a set of <strong>smart responses to a hot, humid, monsoon, water-rich land</strong> — using nature where possible, guarding against it where needed.</p>
<pre><code>Four domains of material life
  EAT   : rice + vegetables + fish/fish-sauce;
          balance yin-yang and hot-cold in a meal
  DRESS : light, breathable - ao dai, non la (conical hat),
          plain-brown work clothes; adapted to heat &amp; sun
  DWELL : stilt / tile-roof houses, south-facing,
          open to breeze, in harmony with nature
  TRAVEL: waterways first - boats, rivers, ferries;
          a country moving on water
</code></pre>
<h3>Food as a balancing system</h3>
<p>The plate is organised, not random: <strong>plant-heavy, communal, and balanced</strong> — sour/spicy vs. cool, hot dishes in winter, cooling ones in summer. Fish sauce (nước mắm) is the unifying seasoning.</p>
<h3>Dress &amp; dwelling for the climate</h3>
<p>The <strong>áo dài</strong> and <strong>nón lá</strong> are climate solutions turned into icons; houses face <strong>south</strong> to catch the cool wind and avoid harsh sun, raised or ventilated against damp and flood.</p>
<div class="callout"><span class="badge">Design lens</span> Every icon here — bowl of rice, conical hat, river boat, south-facing house — encodes a real adaptation to land and weather.</div>`,
    `<span class="eyebrow">VNC104 · Chương 5 · Bài 5.1</span>
<h2>Ứng xử với môi trường tự nhiên</h2>
<p class="lead">Văn hoá vật chất Việt Nam là tập hợp những <strong>cách ứng phó khôn ngoan với vùng đất nóng ẩm, gió mùa, nhiều nước</strong> — tận dụng thiên nhiên khi được, phòng chống khi cần.</p>
<pre><code>Bốn lĩnh vực đời sống vật chất
  ĂN    : cơm + rau + cá/mắm; cân bằng âm dương
          và hàn - nhiệt trong bữa ăn
  MẶC   : nhẹ, thoáng - áo dài, nón lá,
          nâu sồng lao động; hợp khí hậu nóng &amp; nắng
  Ở     : nhà sàn / mái ngói, hướng nam,
          đón gió mát, hoà với thiên nhiên
  ĐI LẠI: ưu tiên đường thuỷ - thuyền, sông, đò;
          một xứ sở đi lại trên mặt nước
</code></pre>
<h3>Ẩm thực như một hệ cân bằng</h3>
<p>Mâm cơm được tổ chức, không ngẫu nhiên: <strong>nhiều rau, ăn chung và cân bằng</strong> — chua/cay đối với mát, món nóng mùa đông, món mát mùa hè. Nước mắm là gia vị thống nhất.</p>
<h3>Mặc &amp; ở theo khí hậu</h3>
<p><strong>Áo dài</strong> và <strong>nón lá</strong> là giải pháp khí hậu đã thành biểu tượng; nhà quay hướng <strong>nam</strong> để đón gió mát, tránh nắng gắt, được nâng sàn hoặc thông thoáng để chống ẩm và lũ.</p>
<div class="callout"><span class="badge">Góc thiết kế</span> Mỗi biểu tượng ở đây — bát cơm, nón lá, con thuyền, ngôi nhà hướng nam — đều mã hoá một cách thích nghi thật với đất và thời tiết.</div>`,
  ]]);

const c5q = quiz('vnc104-quiz-5', 'Quiz 5 — Coping with nature|||Quiz 5 — Ứng xử tự nhiên', [
  { id: 'q1', question: 'Cơ cấu bữa ăn truyền thống của người Việt chủ yếu là?', options: ['Thịt - bơ - sữa', 'Cơm - rau - cá (mắm)', 'Bánh mì - phô mai', 'Chỉ có tinh bột'], correctIndex: 1, explanation: 'Bữa ăn Việt lấy cơm làm trung tâm, nhiều rau, cá và nước mắm; đề cao cân bằng âm dương, hàn nhiệt.' },
  { id: 'q2', question: 'Vì sao nhà truyền thống Việt thường quay hướng nam?', options: ['Để tránh gió mát', 'Để đón gió mát, tránh nắng gắt hướng tây và rét bắc', 'Vì luật bắt buộc', 'Ngẫu nhiên'], correctIndex: 1, explanation: 'Hướng nam đón gió nồm mát mùa hè, tránh nắng gắt phía tây và gió lạnh phương bắc — thích nghi khí hậu.' },
  { id: 'q3', question: 'Phương thức đi lại nổi bật của cư dân nông nghiệp lúa nước Việt là?', options: ['Ngựa và lạc đà', 'Đường thuỷ (thuyền, sông, đò)', 'Đường sắt', 'Máy bay'], correctIndex: 1, explanation: 'Vùng nhiều sông ngòi, kênh rạch nên giao thông đường thuỷ (thuyền, đò) là chính trong truyền thống.' },
]);

const c6 = doc('vnc104-6-1-moi-truong-xa-hoi', '6.1 — Coping with society: China, India & the West|||6.1 — Ứng xử với môi trường xã hội: Trung Hoa, Ấn Độ & phương Tây',
  'Giao lưu & tiếp biến văn hoá: lớp Trung Hoa (Nho - Phật - Đạo, chữ Hán, thiết chế); lớp Ấn Độ (Phật giáo, Chăm-pa, Óc Eo); lớp phương Tây (chữ Quốc ngữ, Công giáo, đô thị hiện đại). Bản lĩnh Việt hoá.',
  [[
    `<span class="eyebrow">VNC104 · Chapter 6 · Lesson 6.1</span>
<h2>Coping with the social environment</h2>
<p class="lead">Vietnamese culture is a story of <strong>acculturation (tiếp biến)</strong> — absorbing outside influences and <em>Vietnamising</em> them, keeping a stubborn native core.</p>
<pre><code>Layers of cultural exchange
  CHINA : Confucianism + Buddhism + Taoism (tam giao),
          Han script, state institutions, exam system
  INDIA : Buddhism (early, via sea), Champa & Oc Eo
          in the centre and south; Hindu-Buddhist art
  WEST  : Quoc-ngu (Latin script), Catholicism,
          modern press, cities, art & design schools
</code></pre>
<h3>The Chinese layer</h3>
<p>A thousand years of contact brought the <strong>three teachings</strong>, Chinese characters and the mandarin-exam state — but folk belief, language and village life stayed distinctly Vietnamese.</p>
<h3>The Indian &amp; Western layers</h3>
<p>From the south and sea came <strong>Buddhism and Cham/Óc Eo art</strong>; from the 17th-20th centuries the West brought the <strong>Latin-based Quốc ngữ script, Catholicism, modern cities and formal art training</strong> that underpins today's design world.</p>
<div class="callout"><span class="badge">Design lens</span> Vietnamese identity is not "pure" — it is a confident <em>remix</em>. That is exactly the designer's stance: absorb, adapt, make it your own.</div>`,
    `<span class="eyebrow">VNC104 · Chương 6 · Bài 6.1</span>
<h2>Ứng xử với môi trường xã hội</h2>
<p class="lead">Văn hoá Việt Nam là câu chuyện <strong>tiếp biến</strong> — thu nhận ảnh hưởng bên ngoài rồi <em>Việt hoá</em>, giữ một lõi bản địa bền bỉ.</p>
<pre><code>Các lớp giao lưu văn hoá
  TRUNG HOA : Nho + Phật + Đạo (tam giáo),
              chữ Hán, thiết chế nhà nước, khoa cử
  ẤN ĐỘ     : Phật giáo (sớm, theo đường biển),
              Chăm-pa &amp; Óc Eo ở miền Trung - Nam
  PHƯƠNG TÂY: chữ Quốc ngữ (chữ Latinh), Công giáo,
              báo chí, đô thị, trường mỹ thuật
</code></pre>
<h3>Lớp Trung Hoa</h3>
<p>Ngàn năm tiếp xúc mang tới <strong>tam giáo</strong>, chữ Hán và nhà nước khoa cử — nhưng tín ngưỡng dân gian, tiếng nói và đời sống làng vẫn đậm chất Việt.</p>
<h3>Lớp Ấn Độ &amp; phương Tây</h3>
<p>Từ phía nam và đường biển đến <strong>Phật giáo và nghệ thuật Chăm / Óc Eo</strong>; từ thế kỷ 17-20 phương Tây mang tới <strong>chữ Quốc ngữ Latinh, Công giáo, đô thị hiện đại và đào tạo mỹ thuật chính quy</strong> làm nền cho ngành thiết kế hôm nay.</p>
<div class="callout"><span class="badge">Góc thiết kế</span> Bản sắc Việt không "thuần khiết" — nó là một bản <em>remix</em> đầy bản lĩnh. Đó chính là tư thế của nhà thiết kế: thu nhận, thích nghi, biến thành của mình.</div>`,
  ]]);

const c6q = quiz('vnc104-quiz-6', 'Quiz 6 — Cultural exchange|||Quiz 6 — Giao lưu văn hoá', [
  { id: 'q1', question: '"Tam giáo" du nhập chủ yếu từ Trung Hoa gồm?', options: ['Nho - Phật - Đạo', 'Công giáo - Tin lành - Hồi giáo', 'Hindu - Phật - Jain', 'Thần đạo - Nho - Đạo'], correctIndex: 0, explanation: 'Tam giáo là Nho giáo, Phật giáo và Đạo giáo — ba dòng tư tưởng lớn ảnh hưởng sâu tới văn hoá Việt.' },
  { id: 'q2', question: 'Chữ Quốc ngữ (chữ Latinh) gắn với lớp giao lưu nào?', options: ['Trung Hoa', 'Ấn Độ', 'Phương Tây', 'Chăm-pa'], correctIndex: 2, explanation: 'Chữ Quốc ngữ hình thành từ tiếp xúc với phương Tây (các giáo sĩ), dùng ký tự Latinh ghi tiếng Việt.' },
  { id: 'q3', question: 'Đặc điểm nổi bật trong cách người Việt tiếp nhận văn hoá ngoại lai là?', options: ['Từ chối hoàn toàn', 'Tiếp biến - Việt hoá, giữ lõi bản địa', 'Sao chép nguyên vẹn', 'Xoá bỏ văn hoá gốc'], correctIndex: 1, explanation: 'Người Việt tiếp thu có chọn lọc rồi Việt hoá cái ngoại lai, vẫn giữ một lõi bản sắc riêng — gọi là tiếp biến.' },
]);

const c7 = doc('vnc104-7-1-nghe-thuat', '7.1 — Traditional arts: architecture, painting, music, theatre|||7.1 — Nghệ thuật truyền thống: kiến trúc, hội hoạ, âm nhạc, sân khấu',
  'Kiến trúc đình - chùa - nhà truyền thống (hài hoà thiên nhiên, mái cong); mỹ thuật dân gian (tranh Đông Hồ, Hàng Trống, điêu khắc đình làng); âm nhạc (quan họ, ca trù, nhã nhạc); sân khấu (chèo, tuồng, cải lương, rối nước).',
  [[
    `<span class="eyebrow">VNC104 · Chapter 7 · Lesson 7.1</span>
<h2>Traditional arts</h2>
<p class="lead">Traditional Vietnamese art is <strong>communal, symbolic and close to nature</strong> — made for village life and ritual, not for museums.</p>
<pre><code>Four art domains (with UNESCO-listed forms*)
  ARCHITECTURE : dinh (communal house), pagoda, temple;
                 curved roofs, wood, harmony with land
  PAINTING     : folk woodblock prints - Dong Ho, Hang Trong;
                 dinh-village wood carving
  MUSIC        : quan ho*, ca tru*, nha nhac* (court music),
                 don ca tai tu*
  THEATRE      : cheo, tuong (hat boi), cai luong,
                 water puppetry (roi nuoc)
</code></pre>
<h3>Architecture &amp; folk painting</h3>
<p>The <strong>đình</strong> and pagoda favour wood, tiled curved roofs and a low, horizontal harmony with the landscape. <strong>Đông Hồ and Hàng Trống prints</strong> use flat colour, bold outline and lucky symbols (pigs, roosters, children) — a folk graphic language.</p>
<h3>Music &amp; stage</h3>
<p><strong>Quan họ, ca trù, nhã nhạc</strong> and folk theatre — <strong>chèo, tuồng, cải lương, water puppetry</strong> — carry story and moral through highly stylised gesture, mask, colour and song.</p>
<div class="callout"><span class="badge">Design lens</span> Đông Hồ's flat colour and confident line, and tuồng's symbolic face-paint, are a rich, ready reference for illustration, branding and motion design.</div>`,
    `<span class="eyebrow">VNC104 · Chương 7 · Bài 7.1</span>
<h2>Nghệ thuật truyền thống</h2>
<p class="lead">Nghệ thuật truyền thống Việt <strong>mang tính cộng đồng, giàu biểu tượng và gần thiên nhiên</strong> — làm ra cho đời sống làng và nghi lễ, không phải cho bảo tàng.</p>
<pre><code>Bốn lĩnh vực nghệ thuật (kèm di sản UNESCO*)
  KIẾN TRÚC : đình, chùa, đền; mái cong, gỗ,
              hoà hợp với cảnh quan
  HỘI HOẠ   : tranh khắc gỗ dân gian - Đông Hồ, Hàng Trống;
              điêu khắc đình làng
  ÂM NHẠC   : quan họ*, ca trù*, nhã nhạc* (nhạc cung đình),
              đờn ca tài tử*
  SÂN KHẤU  : chèo, tuồng (hát bội), cải lương,
              múa rối nước
</code></pre>
<h3>Kiến trúc &amp; tranh dân gian</h3>
<p><strong>Đình</strong> và chùa chuộng gỗ, mái ngói cong, dáng thấp và hoà hợp chiều ngang với cảnh vật. <strong>Tranh Đông Hồ và Hàng Trống</strong> dùng màu bệt, nét viền dứt khoát và biểu tượng may mắn (lợn, gà, em bé) — một ngôn ngữ đồ hoạ dân gian.</p>
<h3>Âm nhạc &amp; sân khấu</h3>
<p><strong>Quan họ, ca trù, nhã nhạc</strong> và sân khấu dân gian — <strong>chèo, tuồng, cải lương, rối nước</strong> — chuyển tải câu chuyện và bài học qua cử chỉ, mặt nạ, màu sắc và lời ca cách điệu cao.</p>
<div class="callout"><span class="badge">Góc thiết kế</span> Màu bệt và nét chắc của Đông Hồ, cùng lối vẽ mặt biểu tượng của tuồng, là kho tham chiếu giàu có cho minh hoạ, thương hiệu và thiết kế chuyển động.</div>`,
  ]]);

const c7q = quiz('vnc104-quiz-7', 'Quiz 7 — Traditional arts|||Quiz 7 — Nghệ thuật truyền thống', [
  { id: 'q1', question: 'Tranh Đông Hồ, Hàng Trống thuộc loại hình nghệ thuật nào?', options: ['Điêu khắc đồng', 'Tranh khắc gỗ dân gian', 'Sơn dầu hàn lâm', 'Nhiếp ảnh'], correctIndex: 1, explanation: 'Đông Hồ và Hàng Trống là dòng tranh khắc gỗ dân gian, dùng màu bệt và biểu tượng may mắn.' },
  { id: 'q2', question: 'Loại hình sân khấu dân gian biểu diễn trên mặt nước là?', options: ['Chèo', 'Tuồng', 'Múa rối nước', 'Cải lương'], correctIndex: 2, explanation: 'Múa rối nước là nghệ thuật sân khấu độc đáo của vùng đồng bằng Bắc Bộ, con rối diễn trên mặt nước.' },
  { id: 'q3', question: 'Đặc điểm chung nổi bật của nghệ thuật truyền thống Việt là?', options: ['Tính cá nhân, xa rời đời sống', 'Tính cộng đồng, giàu biểu tượng, gần thiên nhiên', 'Chỉ phục vụ hoàng gia', 'Không có yếu tố tôn giáo'], correctIndex: 1, explanation: 'Nghệ thuật truyền thống gắn với làng xã, nghi lễ; mang tính cộng đồng, giàu biểu tượng và hoà hợp thiên nhiên.' },
]);

const c8 = doc('vnc104-8-1-ban-sac-thiet-ke', '8.1 — National identity in contemporary digital design|||8.1 — Bản sắc & ứng dụng trong thiết kế mỹ thuật số đương đại',
  'Tổng hợp bản sắc văn hoá Việt (trọng tình, hài hoà, linh hoạt, cộng đồng); nguyên tắc khai thác di sản trong thiết kế số (hoa văn, màu ngũ hành, thư pháp, motif); tránh sao chép hời hợt & lỗi rập khuôn; đạo đức văn hoá.',
  [[
    `<span class="eyebrow">VNC104 · Chapter 8 · Lesson 8.1</span>
<h2>National identity in contemporary digital design</h2>
<h3>What the "Vietnamese character" is</h3>
<p>Pulling the course together, the deep traits are: <strong>communal, feeling-first (trọng tình), harmonious, flexible and adaptive</strong>. These aren't clichés — they explain why a Vietnamese design so often prefers softness, roundness, balance and warmth over hard, isolated forms.</p>
<h3>A method for using heritage</h3>
<pre><code>From heritage to a modern brief
  1. SOURCE   : pick a real motif/idea (Dong Ho line,
                dinh roof curve, five-element colour, calligraphy)
  2. DECODE   : learn what it MEANS, not just how it looks
  3. ABSTRACT : distil form, colour, rhythm - not literal copy
  4. APPLY    : rebuild it in the digital medium (UI, motion,
                type, brand) for today's function
  5. RESPECT  : credit origin, avoid sacred/ethnic misuse
</code></pre>
<h3>Traps to avoid</h3>
<p><strong>Shallow copying</strong> (slapping a nón lá on a logo), <strong>stereotyping</strong>, and <strong>misusing sacred or ethnic-minority symbols</strong>. Good work reads the meaning first, then reinterprets — it does not merely decorate.</p>
<div class="callout"><span class="badge">Your brief</span> Take one Vietnamese cultural element studied in this course, decode its meaning, and reinterpret it into a modern digital artefact (icon set, motion piece, brand system) that a Vietnamese viewer recognises and respects.</div>`,
    `<span class="eyebrow">VNC104 · Chương 8 · Bài 8.1</span>
<h2>Bản sắc &amp; ứng dụng trong thiết kế mỹ thuật số đương đại</h2>
<h3>"Chất Việt" là gì</h3>
<p>Gói lại cả môn học, những đặc trưng sâu là: <strong>trọng cộng đồng, trọng tình, hài hoà, linh hoạt và thích nghi</strong>. Đây không phải khẩu hiệu — chúng lý giải vì sao thiết kế Việt thường ưa sự mềm mại, tròn trịa, cân bằng và ấm áp hơn là hình khối cứng, tách biệt.</p>
<h3>Phương pháp khai thác di sản</h3>
<pre><code>Từ di sản tới đề bài hiện đại
  1. NGUỒN     : chọn một motif/ý tưởng thật (nét Đông Hồ,
                 mái cong đình, màu ngũ hành, thư pháp)
  2. GIẢI MÃ   : hiểu nó NGHĨA gì, không chỉ trông thế nào
  3. TRỪU HOÁ  : chắt lọc hình, màu, nhịp - không sao chép y nguyên
  4. ỨNG DỤNG  : dựng lại trong môi trường số (UI, chuyển động,
                 chữ, thương hiệu) cho chức năng hôm nay
  5. TÔN TRỌNG : ghi nhận nguồn gốc, tránh dùng sai
                 biểu tượng thiêng/dân tộc thiểu số
</code></pre>
<h3>Những lỗi cần tránh</h3>
<p><strong>Sao chép hời hợt</strong> (gắn đại một chiếc nón lá lên logo), <strong>rập khuôn định kiến</strong>, và <strong>dùng sai biểu tượng thiêng hoặc của dân tộc thiểu số</strong>. Tác phẩm tốt đọc ý nghĩa trước rồi mới diễn giải lại — chứ không chỉ trang trí.</p>
<div class="callout"><span class="badge">Đề bài của bạn</span> Chọn một yếu tố văn hoá Việt đã học trong môn này, giải mã ý nghĩa của nó, và diễn giải lại thành một sản phẩm số hiện đại (bộ icon, tác phẩm chuyển động, hệ thương hiệu) mà người xem Việt nhận ra và tôn trọng.</div>`,
  ]]);

const c8q = quiz('vnc104-quiz-8', 'Quiz 8 — Identity & design|||Quiz 8 — Bản sắc & thiết kế', [
  { id: 'q1', question: 'Nhóm đặc trưng nào mô tả đúng "chất Việt" trong văn hoá?', options: ['Cá nhân, cạnh tranh, cứng nhắc', 'Trọng cộng đồng, trọng tình, hài hoà, linh hoạt', 'Du mục, hiếu chiến, khép kín', 'Duy lý, tách biệt, cố định'], correctIndex: 1, explanation: 'Văn hoá Việt nổi bật ở tính cộng đồng, trọng tình, hài hoà và linh hoạt thích nghi.' },
  { id: 'q2', question: 'Khi đưa di sản văn hoá vào thiết kế số, bước quan trọng bị bỏ quên nhất là?', options: ['Chọn màu đẹp', 'Giải mã ý nghĩa của motif trước khi dùng', 'Xuất file độ phân giải cao', 'Đặt tên file'], correctIndex: 1, explanation: 'Phải hiểu ý nghĩa (giải mã) rồi mới trừu hoá và ứng dụng; bỏ bước này dẫn tới sao chép hời hợt.' },
  { id: 'q3', question: 'Lỗi nào cần tránh khi khai thác bản sắc dân tộc trong thiết kế?', options: ['Ghi nhận nguồn gốc', 'Diễn giải lại có chiều sâu', 'Sao chép hời hợt và dùng sai biểu tượng thiêng/dân tộc thiểu số', 'Học ý nghĩa trước khi dùng'], correctIndex: 2, explanation: 'Cần tránh sao chép bề mặt, rập khuôn định kiến và lạm dụng sai các biểu tượng thiêng hoặc của dân tộc thiểu số.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'VNC104',
    slug: 'vnc104-vietnamese-culture',
    title: 'Vietnamese Culture',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/VNC104.webp',
    shortDescription: 'Vietnamese culture: origins & identity — space/people/time, yin-yang & five elements, village & nation, beliefs & festivals, food/dress/housing, exchange with China/India/West, traditional arts, and identity in digital design.|||Cơ sở văn hoá Việt Nam: định vị & bản sắc — không gian/chủ thể/thời gian, âm dương & ngũ hành, làng xã & quốc gia, tín ngưỡng & lễ tết, ăn/mặc/ở, giao lưu Trung/Ấn/Tây, nghệ thuật truyền thống, ứng dụng trong thiết kế số.',
    description: 'Môn <strong>VNC104 — Vietnamese Culture</strong> (Cơ sở văn hoá Việt Nam, kỳ 7) giúp sinh viên thiết kế mỹ thuật số hiểu <strong>văn hoá Việt Nam là gì và hình thành thế nào</strong>. Từ <strong>khái niệm &amp; định vị</strong> (không gian, chủ thể, thời gian) → <strong>văn hoá nhận thức</strong> (âm dương, ngũ hành, lịch pháp) → <strong>tổ chức đời sống tập thể</strong> (làng &amp; nước) &amp; <strong>cá nhân</strong> (tín ngưỡng, phong tục, lễ tết) → <strong>ứng xử với môi trường tự nhiên</strong> (ăn, mặc, ở, đi lại) &amp; <strong>xã hội</strong> (Trung Hoa, Ấn Độ, phương Tây) → <strong>nghệ thuật truyền thống</strong> → <strong>bản sắc trong thiết kế số đương đại</strong>. Bám giáo trình Trần Ngọc Thêm, Phan Ngọc, Đào Duy Anh; song ngữ, quiz mỗi chương.',
    whatYouLearn: 'Khái niệm & 4 đặc trưng văn hoá, văn hoá vs văn minh; định vị theo không gian/chủ thể/thời gian; âm dương & ngũ hành, lịch âm dương & can chi; làng xã (cộng đồng & tự trị), quan hệ làng - nước; tín ngưỡng, phong tục vòng đời, hệ lễ tết; ăn/mặc/ở/đi lại thích nghi khí hậu; tiếp biến văn hoá Trung Hoa/Ấn Độ/phương Tây; kiến trúc, hội hoạ, âm nhạc, sân khấu truyền thống; phương pháp đưa bản sắc vào thiết kế mỹ thuật số.',
    requirements: 'Không cần kiến thức chuyên sâu trước. Quan tâm tới lịch sử - văn hoá Việt Nam và mong muốn vận dụng vào thiết kế, mỹ thuật số.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách nền tảng, bảo tàng, tài liệu số, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Văn hoá là gì; vì sao thiết kế cần văn hoá; lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Khái niệm & định vị|||Chapter 1 — Concept & location', description: 'Văn hoá vs văn minh; ba toạ độ; nền nông nghiệp lúa nước.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Văn hoá nhận thức|||Chapter 2 — Cognition', description: 'Âm dương, ngũ hành, lịch âm dương & can chi.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Đời sống tập thể|||Chapter 3 — Collective life', description: 'Làng xã, tự trị, quan hệ làng - nước.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đời sống cá nhân|||Chapter 4 — Personal life', description: 'Tín ngưỡng, phong tục, lễ tết, trọng tình.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Môi trường tự nhiên|||Chapter 5 — Natural environment', description: 'Ăn, mặc, ở, đi lại thích nghi khí hậu.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Môi trường xã hội|||Chapter 6 — Social environment', description: 'Tiếp biến Trung Hoa, Ấn Độ, phương Tây.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Nghệ thuật truyền thống|||Chapter 7 — Traditional arts', description: 'Kiến trúc, hội hoạ, âm nhạc, sân khấu.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Bản sắc & thiết kế số|||Chapter 8 — Identity & design', description: 'Chất Việt; phương pháp đưa di sản vào thiết kế số.', lessons: [c8, c8q] },
  ],
};
