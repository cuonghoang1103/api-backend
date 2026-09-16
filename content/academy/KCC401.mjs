/**
 * KCC401 — Korean Corporate Culture / Văn hoá doanh nghiệp Hàn Quốc. Ngành
 * Ngôn ngữ Hàn, kỳ 5. Trích dẫn giáo trình (KHÔNG upload PDF): "한국
 * 기업문화의 이해"; "Korean Business Etiquette" (Boye De Mente); tài liệu
 * KOTRA. Giảng tiếng Việt + thuật ngữ Anh, kèm thuật ngữ &amp; cụm giao tiếp
 * tiếng Hàn (한글 + romaja + nghĩa Việt) trong bảng <pre><code>.
 * Giữ NGUYÊN slug/semester/thumb. ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const c1 = doc('kcc401-1-1-overview-confucian', '1.1 — Overview & Confucian values at work|||1.1 — Tổng quan & giá trị Nho giáo nơi công sở',
  'Ba trụ cột Nho giáo trong công sở Hàn: tôn ti (서열), hoà hợp (화합), trung thành (충성); vì sao nhân viên nước ngoài bỏ qua quy tắc ngầm dễ bị coi là thiếu tôn trọng.',
  [[
    `<span class="eyebrow">KCC401 · Chapter 1</span>
<h2>Korean corporate culture &amp; Confucian values at work</h2>
<p class="lead">Korean companies blend modern global business practice with deep-rooted <strong>Confucian</strong> values: respect for age and rank, group harmony over individual ambition, and loyalty to the organization as an extended family.</p>
<h3>Three Confucian pillars in the office</h3>
<ul>
<li><strong>Hierarchy (서열, seoyeol)</strong> — age and job title decide who speaks first, who pours the drink, who sits where.</li>
<li><strong>Harmony (화합, hwahap)</strong> — group cohesion is valued over standing out; openly disagreeing with a superior is rare.</li>
<li><strong>Loyalty &amp; duty (충성, chungseong)</strong> — employees are expected to identify with the company's success, sometimes above personal time.</li>
</ul>
<h3>Why it matters for foreign employees</h3>
<p>A foreigner who ignores these unwritten rules is not read as "efficient" — they are read as <em>rude</em>. Learning them is the entry ticket to being taken seriously in a Korean workplace.</p>
<h3>Korean terms</h3>
<pre><code>회사   (hoesa)   - công ty
상사   (sangsa)  - cấp trên
유교   (yugyo)   - Nho giáo
예의   (yeui)    - lễ nghĩa, phép cư xử đúng mực
정     (jeong)   - tình cảm gắn bó, "cái tình" giữa người với người</code></pre>
<div class="callout"><span class="badge">Scenario</span> Your new Korean manager is 8 years older than you. At the first team dinner he offers to pour your drink. Etiquette: let him pour once, then immediately offer to pour his in return — refusing the gesture, or not reciprocating, both read as disrespect.</div>`,
    `<span class="eyebrow">KCC401 · Chương 1</span>
<h2>Tổng quan văn hoá doanh nghiệp Hàn &amp; giá trị Nho giáo</h2>
<p class="lead">Doanh nghiệp Hàn Quốc pha trộn cách làm việc hiện đại toàn cầu với giá trị <strong>Nho giáo</strong> ăn sâu: tôn trọng tuổi tác &amp; cấp bậc, đề cao hoà hợp tập thể hơn nổi bật cá nhân, và trung thành với công ty như một "đại gia đình".</p>
<h3>Ba trụ cột Nho giáo nơi công sở</h3>
<ul>
<li><strong>Tôn ti (서열, seoyeol)</strong> — tuổi tác &amp; chức danh quyết định ai nói trước, ai rót rượu, ai ngồi đâu.</li>
<li><strong>Hoà hợp (화합, hwahap)</strong> — sự gắn kết nhóm được coi trọng hơn việc nổi bật cá nhân; công khai phản đối cấp trên là điều hiếm gặp.</li>
<li><strong>Trung thành &amp; bổn phận (충성, chungseong)</strong> — nhân viên được kỳ vọng gắn bản thân với thành công của công ty, đôi khi hơn cả thời gian cá nhân.</li>
</ul>
<h3>Vì sao điều này quan trọng với nhân viên nước ngoài</h3>
<p>Một người nước ngoài bỏ qua các quy tắc ngầm này không bị coi là "làm việc hiệu quả theo cách khác" — mà bị coi là <em>thiếu tôn trọng</em>. Hiểu được chúng chính là tấm vé để được xem trọng trong công sở Hàn Quốc.</p>
<h3>Thuật ngữ tiếng Hàn</h3>
<pre><code>회사   (hoesa)   - công ty
상사   (sangsa)  - cấp trên
유교   (yugyo)   - Nho giáo
예의   (yeui)    - lễ nghĩa, phép cư xử đúng mực
정     (jeong)   - tình cảm gắn bó, "cái tình" giữa người với người</code></pre>
<div class="callout"><span class="badge">Tình huống</span> Sếp người Hàn mới của bạn hơn bạn 8 tuổi. Trong bữa liên hoan đầu tiên, anh ấy chủ động rót rượu cho bạn. Cách ứng xử: để anh ấy rót một lần rồi lập tức rót lại mời anh — từ chối cử chỉ đó, hoặc không đáp lễ, đều bị hiểu là thiếu tôn trọng.</div>`,
  ]]);

const c1q = quiz('kcc401-quiz-1', 'Quiz 1 — Overview & Confucian values|||Quiz 1 — Tổng quan & Nho giáo', [
  { id: 'q1', question: 'Giá trị Nho giáo nào đặt sự gắn kết nhóm lên trên việc nổi bật cá nhân?', options: ['서열 (seoyeol) — tôn ti', '화합 (hwahap) — hoà hợp', '정 (jeong) — tình cảm', '명함 (myeongham) — danh thiếp'], correctIndex: 1, explanation: '화합 (hwahap) — hoà hợp — coi trọng gắn kết tập thể hơn nổi bật cá nhân.' },
  { id: 'q2', question: 'Trong văn hoá công sở Hàn, "정 (jeong)" gần nghĩa với điều gì?', options: ['Chức danh chính thức', 'Tình cảm gắn bó giữa người với người', 'Quy định giờ làm việc', 'Tên gọi tập đoàn'], correctIndex: 1, explanation: '정 (jeong) là sợi dây tình cảm gắn kết đồng nghiệp, vượt ngoài quan hệ công việc thuần tuý.' },
  { id: 'q3', question: 'Một nhân viên nước ngoài bỏ qua quy tắc ứng xử ngầm ở công sở Hàn thường bị đánh giá thế nào?', options: ['Được khen là làm việc hiệu quả kiểu mới', 'Bị coi là thiếu tôn trọng, không phải là "khác biệt hiệu quả"', 'Không ảnh hưởng gì vì luật lao động bảo vệ', 'Được cấp trên châm chước ngay lập tức'], correctIndex: 1, explanation: 'Quy tắc ngầm gắn với tôn ti &amp; lễ nghĩa; bỏ qua chúng đọc thành thiếu tôn trọng, không phải "cách làm khác".' },
]);

const c2 = doc('kcc401-2-1-hierarchy-honorifics', '2.1 — Rank, hierarchy & honorific speech|||2.1 — Cấp bậc, tôn ti & kính ngữ',
  'Thang chức danh 사원→대리→과장→차장→부장; kính ngữ 존댓말 bắt buộc với cấp trên; văn hoá tiền bối-hậu bối (선배/후배); gọi đồng nghiệp bằng CHỨC DANH, không gọi tên suông.',
  [[
    `<span class="eyebrow">KCC401 · Chapter 2</span>
<h2>Rank, hierarchy &amp; honorific speech</h2>
<h3>The corporate title ladder</h3>
<p>A typical Korean company ladder runs: <strong>사원 (sawon)</strong> staff → <strong>대리 (daeri)</strong> assistant manager → <strong>과장 (gwajang)</strong> manager → <strong>차장 (chajang)</strong> deputy general manager → <strong>부장 (bujang)</strong> general manager → director / executive levels above. Your title decides your seating, your speaking order in meetings, and how everyone else must speak to you.</p>
<h3>존댓말 vs 반말 — honorific vs casual speech</h3>
<p><strong>존댓말 (jondaenmal)</strong>, honorific speech, is mandatory toward anyone senior in age or rank — it is not optional politeness, it is the grammar of the relationship. <strong>반말 (banmal)</strong>, casual speech, is reserved for close peers of the same rank/age and is never used upward at work.</p>
<h3>선배 / 후배 — senior / junior beyond titles</h3>
<p>The <strong>선배-후배 (seonbae-hubae)</strong> bond — "senior who entered first / junior who entered later" — applies to school cohorts, military service, and company tenure alike, and often outlasts the formal org chart.</p>
<h3>Korean terms</h3>
<pre><code>사원     (sawon)        - nhân viên (cấp thấp nhất)
대리     (daeri)        - trợ lý/phó phòng cấp thấp
과장     (gwajang)      - trưởng nhóm/trưởng phòng
차장     (chajang)      - phó giám đốc bộ phận
부장     (bujang)       - giám đốc bộ phận
존댓말   (jondaenmal)   - kính ngữ (bắt buộc với cấp trên)
반말     (banmal)       - lời suồng sã (chỉ dùng với bạn cùng cấp)
선배/후배 (seonbae/hubae) - tiền bối/hậu bối</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> Address a colleague by <strong>title, not first name</strong> — "과장님 (Gwajang-nim)", never "Minsu-ya". Skipping the title in front of others is one of the fastest ways to look disrespectful.</div>`,
    `<span class="eyebrow">KCC401 · Chương 2</span>
<h2>Cấp bậc, tôn ti &amp; kính ngữ nơi làm việc</h2>
<h3>Thang chức danh trong công ty</h3>
<p>Thang chức danh điển hình của công ty Hàn: <strong>사원 (sawon)</strong> nhân viên → <strong>대리 (daeri)</strong> trợ lý/phó phòng cấp thấp → <strong>과장 (gwajang)</strong> trưởng nhóm/trưởng phòng → <strong>차장 (chajang)</strong> phó giám đốc bộ phận → <strong>부장 (bujang)</strong> giám đốc bộ phận → các cấp giám đốc/thành viên HĐQT cao hơn. Chức danh quyết định chỗ ngồi, thứ tự phát biểu trong họp, và cách người khác phải xưng hô với bạn.</p>
<h3>존댓말 và 반말 — kính ngữ và lời suồng sã</h3>
<p><strong>존댓말 (jondaenmal)</strong>, kính ngữ, là bắt buộc với bất kỳ ai lớn tuổi hoặc cao cấp hơn — đây không phải phép lịch sự tuỳ chọn, mà là ngữ pháp của mối quan hệ. <strong>반말 (banmal)</strong>, lời suồng sã, chỉ dành cho bạn bè thân cùng cấp bậc/tuổi tác và không bao giờ dùng để nói với cấp trên tại công sở.</p>
<h3>선배 / 후배 — tiền bối/hậu bối vượt ngoài chức danh</h3>
<p>Mối quan hệ <strong>선배-후배 (seonbae-hubae)</strong> — "người vào trước/người vào sau" — áp dụng cho bạn học cùng khoá, đồng đội quân ngũ, lẫn thâm niên công ty, và thường tồn tại lâu hơn cả sơ đồ tổ chức chính thức.</p>
<h3>Thuật ngữ tiếng Hàn</h3>
<pre><code>사원     (sawon)        - nhân viên (cấp thấp nhất)
대리     (daeri)        - trợ lý/phó phòng cấp thấp
과장     (gwajang)      - trưởng nhóm/trưởng phòng
차장     (chajang)      - phó giám đốc bộ phận
부장     (bujang)       - giám đốc bộ phận
존댓말   (jondaenmal)   - kính ngữ (bắt buộc với cấp trên)
반말     (banmal)       - lời suồng sã (chỉ dùng với bạn cùng cấp)
선배/후배 (seonbae/hubae) - tiền bối/hậu bối</code></pre>
<div class="callout"><span class="badge">Quy tắc vàng</span> Gọi đồng nghiệp bằng <strong>chức danh, không phải tên</strong> — "과장님 (Gwajang-nim)", chứ không phải "Minsu-ya". Bỏ qua chức danh trước mặt người khác là một trong những cách nhanh nhất bị coi là thiếu tôn trọng.</div>`,
  ]]);

const c2q = quiz('kcc401-quiz-2', 'Quiz 2 — Hierarchy & honorifics|||Quiz 2 — Cấp bậc & kính ngữ', [
  { id: 'q1', question: 'Trong thang chức danh, vị trí nào cao hơn 과장 (gwajang) nhưng thấp hơn 부장 (bujang)?', options: ['사원 (sawon)', '대리 (daeri)', '차장 (chajang)', '이사 (isa)'], correctIndex: 2, explanation: 'Thứ tự: 사원 → 대리 → 과장 → 차장 → 부장.' },
  { id: 'q2', question: '존댓말 (jondaenmal) được dùng khi nào ở công sở?', options: ['Chỉ khi nói chuyện phiếm ngoài giờ', 'Bắt buộc khi nói với người lớn tuổi hoặc cao cấp hơn', 'Chỉ dùng trong văn bản, không dùng khi nói', 'Chỉ dùng với khách nước ngoài'], correctIndex: 1, explanation: 'Kính ngữ là bắt buộc, không phải lựa chọn, khi nói với người trên về tuổi/cấp bậc.' },
  { id: 'q3', question: 'Cách xưng hô đúng chuẩn với đồng nghiệp cấp trên tên Minsu, chức 과장?', options: ['Gọi thẳng "Minsu"', 'Gọi "과장님 (Gwajang-nim)" — theo chức danh', 'Gọi "anh Minsu ơi" kiểu Việt', 'Không cần xưng hô, chỉ cần cúi chào'], correctIndex: 1, explanation: 'Xưng hô theo chức danh + hậu tố kính trọng "-님", không gọi thẳng tên.' },
]);

const c3 = doc('kcc401-3-1-greeting-business-card', '3.1 — Greetings, bowing & business card etiquette|||3.1 — Nghi thức chào hỏi, cúi chào & trao danh thiếp',
  'Cúi chào (절) theo cấp bậc, bắt tay (악수) kèm cúi nhẹ, trao/nhận danh thiếp (명함) bằng hai tay và đọc trước khi cất — không nhét túi sau quần.',
  [[
    `<span class="eyebrow">KCC401 · Chapter 3</span>
<h2>Greetings, bowing &amp; business card etiquette</h2>
<h3>Bowing (절, jeol)</h3>
<p>A light nod (~15°) greets peers; a deeper bow (~30–45°) greets superiors or first-time business contacts. The junior/lower-ranked person initiates and bows lower.</p>
<h3>Handshakes (악수, aksu)</h3>
<p>A Western handshake is now common in business settings, but Korean-style adds a small bow while shaking, a lighter grip than the Western firm handshake, and — critically — the <strong>senior person offers their hand first</strong>.</p>
<h3>Exchanging business cards (명함, myeongham)</h3>
<p>Present and receive cards with <strong>both hands (두 손, du son)</strong>, text facing the recipient. Take a moment to actually read the card — name and title — before placing it on the table or in a card holder. Never write on it, fold it, or stuff it straight into a back pocket in front of the giver; that reads as discarding their identity.</p>
<h3>Korean terms</h3>
<pre><code>명함   (myeongham) - danh thiếp
인사   (insa)      - chào hỏi
절     (jeol)      - cúi chào
악수   (aksu)      - bắt tay
두 손  (du son)    - hai tay (trao/nhận vật quan trọng)</code></pre>
<div class="callout"><span class="badge">Scenario</span> You meet a Korean partner for the first time. You receive their card with one hand while checking your phone with the other. Even a polished verbal greeting won't undo that first impression — the hands matter as much as the words.</div>`,
    `<span class="eyebrow">KCC401 · Chương 3</span>
<h2>Nghi thức chào hỏi, cúi chào &amp; trao danh thiếp</h2>
<h3>Cúi chào (절, jeol)</h3>
<p>Gật đầu nhẹ (~15°) dùng khi chào người ngang hàng; cúi sâu hơn (~30–45°) dùng khi chào cấp trên hoặc đối tác gặp lần đầu. Người cấp thấp hơn/nhỏ tuổi hơn chủ động cúi trước và cúi thấp hơn.</p>
<h3>Bắt tay (악수, aksu)</h3>
<p>Bắt tay kiểu phương Tây nay khá phổ biến trong môi trường kinh doanh, nhưng phong cách Hàn thêm một cái cúi nhẹ trong lúc bắt tay, lực nắm tay nhẹ hơn kiểu chắc nịch phương Tây, và — quan trọng nhất — <strong>người cấp cao hơn chủ động đưa tay trước</strong>.</p>
<h3>Trao đổi danh thiếp (명함, myeongham)</h3>
<p>Đưa và nhận danh thiếp bằng <strong>cả hai tay (두 손, du son)</strong>, mặt chữ hướng về phía người nhận. Dành một chút thời gian đọc thật sự tên &amp; chức danh trên thiếp trước khi đặt lên bàn hoặc cho vào cặp đựng. Tuyệt đối không viết lên thiếp, gấp thiếp, hay nhét ngay vào túi quần sau trước mặt người trao — hành động đó bị hiểu như đang vứt bỏ danh tính của họ.</p>
<h3>Thuật ngữ tiếng Hàn</h3>
<pre><code>명함   (myeongham) - danh thiếp
인사   (insa)      - chào hỏi
절     (jeol)      - cúi chào
악수   (aksu)      - bắt tay
두 손  (du son)    - hai tay (trao/nhận vật quan trọng)</code></pre>
<div class="callout"><span class="badge">Tình huống</span> Bạn gặp đối tác Hàn lần đầu. Bạn nhận danh thiếp bằng một tay trong khi tay kia đang xem điện thoại. Dù lời chào có trau chuốt đến đâu, ấn tượng đầu tiên đó cũng khó gỡ lại — đôi tay quan trọng không kém lời nói.</div>`,
  ]]);

const c3q = quiz('kcc401-quiz-3', 'Quiz 3 — Greetings & business cards|||Quiz 3 — Chào hỏi & danh thiếp', [
  { id: 'q1', question: 'Khi trao và nhận danh thiếp (명함) trong công sở Hàn, nên làm thế nào?', options: ['Dùng một tay cho nhanh gọn', 'Dùng cả hai tay và đọc thiếp trước khi cất', 'Nhét ngay vào túi quần sau để rảnh tay', 'Viết ghi chú lên thiếp ngay trước mặt đối phương'], correctIndex: 1, explanation: 'Danh thiếp trao/nhận bằng hai tay, đọc trước khi cất — thể hiện tôn trọng danh tính người trao.' },
  { id: 'q2', question: 'Trong nghi thức bắt tay kiểu Hàn ở công sở, ai thường chủ động đưa tay ra trước?', options: ['Người nhỏ tuổi/cấp thấp hơn', 'Người lớn tuổi/cấp cao hơn', 'Ai đưa tay trước cũng được, không quan trọng', 'Chỉ nam giới mới cần bắt tay'], correctIndex: 1, explanation: 'Người cấp cao hơn hoặc lớn tuổi hơn thường là người chủ động đưa tay trước.' },
  { id: 'q3', question: 'Góc cúi chào (절) sâu hơn (khoảng 30–45°) thường dùng trong tình huống nào?', options: ['Chào người ngang hàng, thân quen', 'Chào cấp trên hoặc đối tác gặp lần đầu', 'Chào khi rời khỏi thang máy', 'Không có sự khác biệt về góc cúi'], correctIndex: 1, explanation: 'Cúi sâu hơn thể hiện mức độ tôn trọng cao hơn, dành cho cấp trên/lần gặp đầu.' },
]);

const c4 = doc('kcc401-4-1-hoesik-overtime-meetings', '4.1 — Group culture, company dinners & meetings|||4.1 — Văn hoá tập thể, tăng ca & hội họp',
  '회식 (tiệc liên hoan) là phần mở rộng của công việc; 야근 (tăng ca) gắn với hình ảnh chăm chỉ dù đang giảm dần theo luật 52 giờ/tuần; họp chính thức thường chỉ "đóng dấu" quyết định đã bàn trước; 눈치 — đọc không khí.',
  [[
    `<span class="eyebrow">KCC401 · Chapter 4</span>
<h2>Group culture, company dinners &amp; meetings</h2>
<h3>회식 (hoesik) — the company dinner is still work</h3>
<p>A <strong>hoesik</strong> — team dinner, often with soju and grilled meat — is technically social but functionally an extension of work: bonding, informal feedback, and relationship-building happen there. Skipping it repeatedly, without a good reason, can be read as not being a team player.</p>
<h3>야근 (yageun) — overtime and the "who leaves first" problem</h3>
<p>Staying late used to be a visible signal of diligence, sometimes regardless of actual workload — junior staff would wait for the boss to leave before going home themselves. The <strong>52-hour workweek law</strong> (주 52시간제, discussed further in Chapter 7) has been pushing back against this, but the instinct to not leave "too early" still lingers in many offices.</p>
<h3>회의 (hoeui) — meetings as ratification, not debate</h3>
<p>Many real decisions are worked out informally beforehand, one-on-one or over hoesik; the formal meeting room is often where a decision gets <em>announced and confirmed</em>, not where it gets argued out in the open.</p>
<h3>눈치 (nunchi) — reading the room</h3>
<p><strong>Nunchi</strong> is the skill of sensing unspoken mood and intent — knowing when to speak, stay quiet, or offer to help without being asked. It is treated as a core soft skill, not a personality quirk.</p>
<h3>Korean terms</h3>
<pre><code>회식        (hoesik)          - tiệc liên hoan công ty
야근        (yageun)          - làm thêm giờ/tăng ca
회의        (hoeui)           - cuộc họp
단체 생활   (danche saenghwal) - đời sống tập thể
눈치        (nunchi)          - khả năng đọc không khí, ý tứ người khác</code></pre>
<div class="callout"><span class="badge">Scenario</span> It's 6:05pm, your work is done, but your team lead is still at his desk. Leaving right at 6pm sharp every day without any team awareness can quietly cost you goodwill — even where it's not technically required, timing your exit with a glance at the room (눈치) still matters in many teams.</div>`,
    `<span class="eyebrow">KCC401 · Chương 4</span>
<h2>Văn hoá tập thể, tăng ca &amp; hội họp</h2>
<h3>회식 (hoesik) — tiệc liên hoan vẫn là công việc</h3>
<p><strong>Hoesik</strong> — bữa tiệc cùng đội nhóm, thường có soju và thịt nướng — về hình thức là hoạt động xã hội nhưng về bản chất là phần mở rộng của công việc: gắn kết, góp ý không chính thức, xây dựng quan hệ đều diễn ra ở đó. Từ chối tham gia nhiều lần mà không có lý do chính đáng có thể bị hiểu là không hoà đồng với tập thể.</p>
<h3>야근 (yageun) — tăng ca và bài toán "ai về trước"</h3>
<p>Ở lại muộn từng là tín hiệu rõ ràng của sự chăm chỉ, đôi khi bất kể khối lượng công việc thực tế — nhân viên cấp dưới sẽ chờ sếp về trước rồi mới về sau. <strong>Luật 52 giờ/tuần</strong> (주 52시간제, sẽ nói rõ hơn ở Chương 7) đang đẩy lùi thói quen này, nhưng bản năng "không về quá sớm" vẫn còn tồn tại ở nhiều công sở.</p>
<h3>회의 (hoeui) — họp là để chốt, không phải để tranh luận</h3>
<p>Nhiều quyết định thật sự được bàn bạc không chính thức từ trước, qua trao đổi riêng hoặc trong bữa hoesik; phòng họp chính thức thường là nơi quyết định được <em>công bố và xác nhận</em>, chứ không phải nơi tranh luận công khai.</p>
<h3>눈치 (nunchi) — đọc không khí</h3>
<p><strong>Nunchi</strong> là kỹ năng cảm nhận không khí và ý định chưa nói ra — biết khi nào nên nói, khi nào nên im lặng, hay khi nào nên chủ động giúp mà không cần ai nhờ. Đây được xem là một kỹ năng mềm cốt lõi, không phải nét tính cách cá nhân.</p>
<h3>Thuật ngữ tiếng Hàn</h3>
<pre><code>회식        (hoesik)          - tiệc liên hoan công ty
야근        (yageun)          - làm thêm giờ/tăng ca
회의        (hoeui)           - cuộc họp
단체 생활   (danche saenghwal) - đời sống tập thể
눈치        (nunchi)          - khả năng đọc không khí, ý tứ người khác</code></pre>
<div class="callout"><span class="badge">Tình huống</span> 6 giờ 5 phút chiều, việc của bạn đã xong, nhưng trưởng nhóm vẫn ngồi ở bàn. Ngày nào cũng ra về đúng 6 giờ mà không để ý gì đến không khí chung có thể âm thầm khiến bạn mất thiện cảm — dù không bắt buộc theo quy định, việc chọn thời điểm ra về có quan sát xung quanh (눈치) vẫn được nhiều đội nhóm coi trọng.</div>`,
  ]]);

const c4q = quiz('kcc401-quiz-4', 'Quiz 4 — Group culture, overtime & meetings|||Quiz 4 — Tập thể, tăng ca & hội họp', [
  { id: 'q1', question: '회식 (hoesik) trong văn hoá công sở Hàn được hiểu như thế nào?', options: ['Hoàn toàn là việc riêng tư, không liên quan công việc', 'Về hình thức là xã hội nhưng thực chất là phần mở rộng của công việc', 'Chỉ dành cho ban lãnh đạo cấp cao', 'Một sự kiện bắt buộc theo luật lao động'], correctIndex: 1, explanation: 'Hoesik là nơi gắn kết, góp ý không chính thức và xây dựng quan hệ — vẫn tính là một phần văn hoá làm việc.' },
  { id: 'q2', question: 'Trong nhiều công ty Hàn truyền thống, cuộc họp chính thức (회의) thường đóng vai trò gì?', options: ['Nơi duy nhất để tranh luận và ra quyết định', 'Nơi công bố/xác nhận quyết định đã được bàn bạc không chính thức từ trước', 'Chỉ là hình thức xã giao không có nội dung', 'Diễn ra hoàn toàn ngẫu nhiên không có mục đích'], correctIndex: 1, explanation: 'Nhiều quyết định thực đã được thống nhất trước; họp chính thức thường mang tính "chốt" hơn là tranh luận mở.' },
  { id: 'q3', question: '눈치 (nunchi) là khả năng gì?', options: ['Kỹ năng đàm phán hợp đồng', 'Khả năng đọc không khí, ý tứ chưa nói ra của người khác', 'Kỹ năng viết báo cáo tài chính', 'Khả năng ghi nhớ chức danh nhân viên'], correctIndex: 1, explanation: 'Nunchi là sự nhạy cảm với không khí/ý định ngầm — một kỹ năng mềm được coi trọng ở công sở Hàn.' },
]);

const c5 = doc('kcc401-5-1-networking-face-saving', '5.1 — Networking, indirect communication & saving face|||5.1 — Quan hệ (인맥), giao tiếp gián tiếp & giữ thể diện',
  '인맥 (mạng lưới quan hệ) qua trường học/quân ngũ/quê quán; giao tiếp gián tiếp — "để tôi xem xét" thường nghĩa là từ chối; 체면 (thể diện) — không phê bình công khai.',
  [[
    `<span class="eyebrow">KCC401 · Chapter 5</span>
<h2>Networking, indirect communication &amp; saving face</h2>
<h3>인맥 (inmaek) — the personal network that opens doors</h3>
<p>Business relationships in Korea often run through <strong>inmaek</strong> — networks built from the same school, university cohort, military service unit, or hometown. A warm introduction through inmaek can matter as much as a cold pitch's content, especially with SMEs and traditional chaebol-linked firms.</p>
<h3>Indirect communication</h3>
<p>Direct refusal is considered impolite. "We'll consider it" (검토해 보겠습니다) or a long silence after a proposal often functions as a soft "no." Learning to hear what is <em>not</em> said is as important as the spoken content.</p>
<h3>체면 (chemyeon) — saving face for everyone</h3>
<p><strong>Chemyeon</strong>, face/social standing, must be protected for both parties. Publicly correcting a colleague's mistake, especially a superior's, in front of others is a serious breach — feedback like that is given privately, one-on-one.</p>
<h3>의리 (uiri) — loyalty that outlasts the deal</h3>
<p><strong>Uiri</strong>, loyalty/solidarity, means relationships built through inmaek are expected to endure setbacks — a good long-term partner is valued over a slightly cheaper new one.</p>
<h3>Korean terms</h3>
<pre><code>인맥          (inmaek)          - mạng lưới quan hệ
체면          (chemyeon)        - thể diện
눈치          (nunchi)          - sự nhạy ý, đọc không khí
돌려 말하다   (dollyeo malhada) - nói vòng, nói gián tiếp
의리          (uiri)            - nghĩa khí, trung thành trong quan hệ</code></pre>
<div class="callout"><span class="badge">Scenario</span> You pitch a proposal; the Korean partner smiles and says "검토해 보겠습니다 — we'll look into it," then goes quiet for two weeks. Reading this as "still under review, keep waiting" instead of "a soft decline" is a common mistake for foreign partners new to indirect communication.</div>`,
    `<span class="eyebrow">KCC401 · Chương 5</span>
<h2>Quan hệ (인맥), giao tiếp gián tiếp &amp; giữ thể diện</h2>
<h3>인맥 (inmaek) — mạng lưới quan hệ mở ra cơ hội</h3>
<p>Quan hệ kinh doanh ở Hàn Quốc thường đi qua <strong>인맥 (inmaek)</strong> — mạng lưới hình thành từ cùng trường học, cùng khoá đại học, cùng đơn vị quân ngũ, hay cùng quê. Một lời giới thiệu ấm áp qua inmaek đôi khi quan trọng không kém nội dung của một lời chào hàng lạ, đặc biệt với các doanh nghiệp vừa &amp; nhỏ hoặc công ty liên kết chaebol truyền thống.</p>
<h3>Giao tiếp gián tiếp</h3>
<p>Từ chối thẳng thừng bị coi là bất lịch sự. Câu "để chúng tôi xem xét" (검토해 보겠습니다) hoặc một khoảng im lặng kéo dài sau khi đề xuất được đưa ra thường mang chức năng của một lời "không" nhẹ nhàng. Học cách nghe được điều <em>không được nói ra</em> quan trọng không kém nội dung được nói.</p>
<h3>체면 (chemyeon) — giữ thể diện cho cả hai bên</h3>
<p><strong>Chemyeon</strong>, thể diện/vị thế xã hội, cần được bảo vệ cho cả hai phía. Công khai chỉ ra lỗi sai của đồng nghiệp, đặc biệt là của cấp trên, trước mặt người khác là một sự vi phạm nghiêm trọng — góp ý kiểu đó nên được đưa ra riêng tư, một-một.</p>
<h3>의리 (uiri) — trung thành vượt qua thương vụ</h3>
<p><strong>Uiri</strong>, nghĩa khí/trung thành, nghĩa là các mối quan hệ xây qua inmaek được kỳ vọng tồn tại qua cả những trở ngại — một đối tác lâu năm tốt được coi trọng hơn một đối tác mới rẻ hơn đôi chút.</p>
<h3>Thuật ngữ tiếng Hàn</h3>
<pre><code>인맥          (inmaek)          - mạng lưới quan hệ
체면          (chemyeon)        - thể diện
눈치          (nunchi)          - sự nhạy ý, đọc không khí
돌려 말하다   (dollyeo malhada) - nói vòng, nói gián tiếp
의리          (uiri)            - nghĩa khí, trung thành trong quan hệ</code></pre>
<div class="callout"><span class="badge">Tình huống</span> Bạn trình bày một đề xuất; đối tác Hàn mỉm cười nói "검토해 보겠습니다 — chúng tôi sẽ xem xét", rồi im lặng suốt hai tuần. Hiểu điều này là "vẫn đang xem xét, cứ chờ tiếp" thay vì "một lời từ chối nhẹ nhàng" là lỗi thường gặp ở đối tác nước ngoài chưa quen giao tiếp gián tiếp.</div>`,
  ]]);

const c5q = quiz('kcc401-quiz-5', 'Quiz 5 — Networking & saving face|||Quiz 5 — Quan hệ & giữ thể diện', [
  { id: 'q1', question: 'Câu trả lời "검토해 보겠습니다 — chúng tôi sẽ xem xét" kèm im lặng kéo dài, trong giao tiếp gián tiếp Hàn Quốc, thường ẩn ý gì?', options: ['Chắc chắn sẽ đồng ý sớm', 'Một lời từ chối nhẹ nhàng', 'Yêu cầu gửi thêm hồ sơ pháp lý', 'Không có ý nghĩa gì đặc biệt'], correctIndex: 1, explanation: 'Từ chối trực tiếp bị coi là bất lịch sự nên thường được thay bằng câu trả lời mập mờ hoặc im lặng kéo dài.' },
  { id: 'q2', question: 'Theo nguyên tắc giữ 체면 (chemyeon), nên góp ý lỗi sai của cấp trên như thế nào?', options: ['Nói thẳng ngay trong cuộc họp trước mọi người', 'Góp ý riêng tư, một-một', 'Gửi email cho toàn phòng ban', 'Im lặng và không bao giờ góp ý'], correctIndex: 1, explanation: 'Công khai chỉ trích làm mất thể diện; góp ý nên được trao đổi riêng tư.' },
  { id: 'q3', question: '인맥 (inmaek) trong kinh doanh Hàn Quốc chủ yếu hình thành từ đâu?', options: ['Chỉ từ hợp đồng pháp lý', 'Cùng trường học, quân ngũ, quê quán…', 'Chỉ từ mạng xã hội trực tuyến', 'Chỉ giữa các thành viên trong một gia đình'], correctIndex: 1, explanation: 'Inmaek là mạng lưới quan hệ cá nhân qua trường học, quân ngũ, quê quán, v.v.' },
]);

const c6 = doc('kcc401-6-1-chaebol-structure', '6.1 — Chaebol & Korean corporate organization|||6.1 — Chaebol & đặc trưng tổ chức doanh nghiệp Hàn',
  '재벌 (chaebol) — tập đoàn gia đình trị với nhiều 계열사; sở hữu chéo, quyết định tập trung ở 총수; đối lập với 중소기업 linh hoạt hơn nhưng lương/uy tín thấp hơn.',
  [[
    `<span class="eyebrow">KCC401 · Chapter 6</span>
<h2>Chaebol &amp; Korean corporate organization</h2>
<h3>What is a chaebol (재벌)?</h3>
<p>A <strong>chaebol</strong> is a large, family-controlled business conglomerate spanning many industries — the names Samsung, Hyundai, LG and SK are the best-known. Founded mostly during Korea's rapid post-war industrialization, they remain the backbone of the export economy.</p>
<h3>Structure: 총수 and 계열사</h3>
<p>A chaebol is organized around a founding family, led by a <strong>총수 (chongsu)</strong> — the group's overall head — who retains outsized control over a web of <strong>계열사 (gyeyeolsa)</strong>, affiliate companies, often through cross-shareholding rather than a majority stake in every unit. Strategic decisions tend to flow top-down from this center.</p>
<h3>Strengths and criticisms</h3>
<p>Chaebol scale enables heavy, long-horizon R&amp;D investment and global competitiveness. Persistent criticisms include centralized, slow-to-challenge decision-making, and nepotism controversies around family succession.</p>
<h3>Chaebol vs. SME (중소기업)</h3>
<p>Compared to a <strong>대기업 (daegieop)</strong> — large firm/chaebol affiliate — a <strong>중소기업 (jungsogieop)</strong>, small-or-medium enterprise, usually offers more flexible, less hierarchical culture, but with lower pay and social prestige — a real trade-off Korean jobseekers weigh explicitly.</p>
<h3>Korean terms</h3>
<pre><code>재벌       (jaebeol)     - tập đoàn gia đình trị
대기업     (daegieop)    - doanh nghiệp lớn
중소기업   (jungsogieop) - doanh nghiệp vừa & nhỏ
총수       (chongsu)     - người đứng đầu tập đoàn
계열사     (gyeyeolsa)   - công ty thành viên trong tập đoàn</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Understanding chaebol structure explains a lot of daily behavior in Korean partner companies: why decisions seem to be made "somewhere higher up," and why the affiliate you deal with may answer to a parent group's priorities you never see directly.</div>`,
    `<span class="eyebrow">KCC401 · Chương 6</span>
<h2>Chaebol &amp; đặc trưng tổ chức doanh nghiệp Hàn</h2>
<h3>Chaebol (재벌) là gì?</h3>
<p><strong>Chaebol</strong> là tập đoàn kinh doanh lớn do một gia đình kiểm soát, trải rộng nhiều ngành — nổi tiếng nhất là Samsung, Hyundai, LG và SK. Được thành lập chủ yếu trong giai đoạn công nghiệp hoá thần tốc sau chiến tranh của Hàn Quốc, chúng vẫn là xương sống của nền kinh tế xuất khẩu.</p>
<h3>Cấu trúc: 총수 và 계열사</h3>
<p>Một chaebol được tổ chức xoay quanh gia đình sáng lập, đứng đầu là <strong>총수 (chongsu)</strong> — người đứng đầu tối cao của cả tập đoàn — nắm quyền kiểm soát vượt trội trên một mạng lưới các <strong>계열사 (gyeyeolsa)</strong>, công ty thành viên, thường thông qua sở hữu chéo hơn là nắm cổ phần đa số ở từng đơn vị. Các quyết định chiến lược thường đi theo hướng từ trên xuống, xuất phát từ trung tâm này.</p>
<h3>Điểm mạnh và chỉ trích</h3>
<p>Quy mô của chaebol cho phép đầu tư R&amp;D dài hạn, đậm và tăng năng lực cạnh tranh toàn cầu. Những chỉ trích dai dẳng gồm việc ra quyết định tập trung, chậm bị thách thức, và tranh cãi về gia đình trị trong việc kế nhiệm.</p>
<h3>Chaebol so với doanh nghiệp vừa &amp; nhỏ (중소기업)</h3>
<p>So với <strong>대기업 (daegieop)</strong> — doanh nghiệp lớn/công ty thành viên chaebol — một <strong>중소기업 (jungsogieop)</strong>, doanh nghiệp vừa &amp; nhỏ, thường có văn hoá linh hoạt hơn, ít tôn ti hơn, nhưng đi kèm lương thấp hơn và uy tín xã hội thấp hơn — một sự đánh đổi thực sự mà người tìm việc Hàn Quốc cân nhắc rõ ràng.</p>
<h3>Thuật ngữ tiếng Hàn</h3>
<pre><code>재벌       (jaebeol)     - tập đoàn gia đình trị
대기업     (daegieop)    - doanh nghiệp lớn
중소기업   (jungsogieop) - doanh nghiệp vừa & nhỏ
총수       (chongsu)     - người đứng đầu tập đoàn
계열사     (gyeyeolsa)   - công ty thành viên trong tập đoàn</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Hiểu cấu trúc chaebol giải thích được nhiều hành vi hằng ngày ở các công ty đối tác Hàn Quốc: vì sao quyết định có vẻ được đưa ra "ở đâu đó cấp cao hơn", và vì sao công ty thành viên bạn làm việc cùng có thể phải trả lời cho ưu tiên của tập đoàn mẹ mà bạn không thấy trực tiếp.</div>`,
  ]]);

const c6q = quiz('kcc401-quiz-6', 'Quiz 6 — Chaebol structure|||Quiz 6 — Cấu trúc chaebol', [
  { id: 'q1', question: '재벌 (chaebol) được hiểu chính xác nhất là gì?', options: ['Một cơ quan nhà nước quản lý doanh nghiệp', 'Tập đoàn kinh doanh lớn do một gia đình kiểm soát, trải nhiều ngành', 'Một loại hình công ty khởi nghiệp nhỏ', 'Một tổ chức công đoàn lao động'], correctIndex: 1, explanation: 'Chaebol là tập đoàn gia đình trị đa ngành, ví dụ Samsung, Hyundai, LG, SK.' },
  { id: 'q2', question: '총수 (chongsu) trong một chaebol giữ vai trò gì?', options: ['Nhân viên mới vào công ty', 'Người đứng đầu tối cao của cả tập đoàn', 'Đại diện công đoàn', 'Kiểm toán viên độc lập'], correctIndex: 1, explanation: 'Chongsu là người đứng đầu, thường thuộc gia đình sáng lập, nắm quyền kiểm soát cả nhóm công ty.' },
  { id: 'q3', question: 'So với 대기업/chaebol, 중소기업 (doanh nghiệp vừa & nhỏ) thường có đặc điểm gì?', options: ['Lương cao hơn, uy tín xã hội cao hơn', 'Văn hoá linh hoạt hơn nhưng lương/uy tín thường thấp hơn', 'Không có sự khác biệt nào đáng kể', 'Luôn thuộc sở hữu nhà nước'], correctIndex: 1, explanation: 'SME thường linh hoạt, ít tôn ti hơn, đổi lại lương và uy tín xã hội thấp hơn chaebol.' },
]);

const c7 = doc('kcc401-7-1-worabael-changing-culture', '7.1 — New trends: work-life balance & a changing office culture|||7.1 — Xu hướng mới: work-life balance & văn hoá công sở thay đổi',
  '워라밸 (work-life balance) sau luật 52 giờ/tuần; thế hệ MZ đẩy lùi văn hoá 꼰대 gia trưởng; 재택근무 sau đại dịch; căng thẳng giữa tôn ti cũ & kỳ vọng mới.',
  [[
    `<span class="eyebrow">KCC401 · Chapter 7</span>
<h2>New trends: work-life balance &amp; a changing office culture</h2>
<h3>워라밸 (worabael) enters the vocabulary</h3>
<p><strong>워라밸 (worabael)</strong>, a loanword from "work-life balance," has become a defining term for what younger Korean employees now demand from an employer — a sharp shift from the "company-first" ethos of Chapter 1.</p>
<h3>The 52-hour workweek law</h3>
<p>Since <strong>주 52시간제</strong> (the 52-hour workweek system) took effect, capping standard plus overtime hours, companies have had to formally rein in the culture of open-ended late nights (야근) described in Chapter 4 — though enforcement and habits vary by industry and firm.</p>
<h3>꼰대 (kkondae) — naming the old guard</h3>
<p><strong>Kkondae</strong> is a critical slang term — a boss or senior who insists juniors follow old hierarchical norms unquestioningly ("back in my day…"). Its wide use signals how openly the younger workforce now pushes back on Chapter 1–2's rules.</p>
<h3>MZ세대 and 재택근무</h3>
<p>The <strong>MZ세대 (MZ generation)</strong> — Millennials and Gen Z — is described as prioritizing personal time, transparent evaluation, and pushing back on forced hoesik attendance. <strong>재택근무 (remote work)</strong>, rare before the pandemic, is now a normal request in many industries, though far from universal in traditional chaebol offices.</p>
<h3>Korean terms</h3>
<pre><code>워라밸        (worabael)         - work-life balance
주 52시간제   (ju 52 sigan je)   - chế độ 52 giờ làm việc/tuần
꼰대          (kkondae)          - người bảo thủ, gia trưởng nơi công sở
MZ세대        (MZ sedae)         - thế hệ MZ (Millennials + Gen Z)
재택근무      (jaetaek geunmu)   - làm việc từ xa/tại nhà</code></pre>
<div class="callout"><span class="badge">Tension, not resolution</span> This chapter's trends sit in tension with Chapters 1–5, not on top of them — a junior employee today may still be expected to use 존댓말 and attend some hoesik, while also expecting the 52-hour cap to be respected. Both are true at once in most real Korean offices right now.</div>`,
    `<span class="eyebrow">KCC401 · Chương 7</span>
<h2>Xu hướng mới: work-life balance &amp; văn hoá công sở thay đổi</h2>
<h3>워라밸 (worabael) đi vào ngôn ngữ hằng ngày</h3>
<p><strong>워라밸 (worabael)</strong>, từ mượn từ "work-life balance", đã trở thành từ khoá định nghĩa điều mà nhân viên trẻ Hàn Quốc hiện đòi hỏi ở nhà tuyển dụng — một chuyển dịch rõ rệt so với tinh thần "công ty là trên hết" ở Chương 1.</p>
<h3>Luật 52 giờ làm việc/tuần</h3>
<p>Từ khi <strong>주 52시간제</strong> (chế độ 52 giờ/tuần) có hiệu lực, giới hạn tổng giờ làm chính thức cộng tăng ca, các công ty buộc phải chính thức kìm hãm văn hoá ở lại muộn không giới hạn (야근) đã nói ở Chương 4 — dù việc thực thi và thói quen thực tế vẫn khác nhau tuỳ ngành và tuỳ công ty.</p>
<h3>꼰대 (kkondae) — gọi tên "phe bảo thủ"</h3>
<p><strong>Kkondae</strong> là một từ lóng mang tính phê phán — chỉ một sếp hoặc người lớn tuổi khăng khăng bắt cấp dưới tuân theo chuẩn tôn ti cũ một cách vô điều kiện ("hồi xưa tôi…"). Việc từ này được dùng rộng rãi cho thấy lực lượng lao động trẻ hiện phản ứng khá công khai với các quy tắc ở Chương 1–2.</p>
<h3>MZ세대 và 재택근무</h3>
<p><strong>MZ세대 (thế hệ MZ)</strong> — Millennials và Gen Z — được mô tả là ưu tiên thời gian cá nhân, đánh giá minh bạch, và phản đối việc bị ép tham gia hoesik. <strong>재택근무 (làm việc từ xa)</strong>, hiếm gặp trước đại dịch, nay là một yêu cầu bình thường ở nhiều ngành, dù còn xa mới phổ biến ở các văn phòng chaebol truyền thống.</p>
<h3>Thuật ngữ tiếng Hàn</h3>
<pre><code>워라밸        (worabael)         - work-life balance
주 52시간제   (ju 52 sigan je)   - chế độ 52 giờ làm việc/tuần
꼰대          (kkondae)          - người bảo thủ, gia trưởng nơi công sở
MZ세대        (MZ sedae)         - thế hệ MZ (Millennials + Gen Z)
재택근무      (jaetaek geunmu)   - làm việc từ xa/tại nhà</code></pre>
<div class="callout"><span class="badge">Căng thẳng, chưa phải giải quyết xong</span> Các xu hướng của chương này tồn tại song song trong căng thẳng với Chương 1–5, không thay thế hoàn toàn — một nhân viên trẻ hôm nay vẫn có thể phải dùng 존댓말 và tham gia một số buổi hoesik, đồng thời kỳ vọng giới hạn 52 giờ được tôn trọng. Cả hai điều này đang cùng đúng ở phần lớn công sở Hàn Quốc hiện nay.</div>`,
  ]]);

const c7q = quiz('kcc401-quiz-7', 'Quiz 7 — Work-life balance & changing culture|||Quiz 7 — Work-life balance & văn hoá thay đổi', [
  { id: 'q1', question: '주 52시간제 (chế độ 52 giờ/tuần) tác động trực tiếp đến thói quen nào đã học ở Chương 4?', options: ['Trao danh thiếp bằng hai tay', 'Văn hoá ở lại muộn không giới hạn (야근)', 'Cách xưng hô kính ngữ', 'Cấu trúc sở hữu chéo của chaebol'], correctIndex: 1, explanation: 'Luật 52 giờ/tuần giới hạn tổng giờ làm + tăng ca, trực tiếp kìm hãm văn hoá 야근 kéo dài.' },
  { id: 'q2', question: 'Từ lóng "꼰대 (kkondae)" dùng để chỉ ai?', options: ['Nhân viên mới chưa quen việc', 'Sếp/người lớn tuổi khăng khăng giữ chuẩn tôn ti cũ vô điều kiện', 'Người phiên dịch trong công ty', 'Người phụ trách nhân sự'], correctIndex: 1, explanation: 'Kkondae là từ phê phán người bảo thủ, gia trưởng, ép cấp dưới theo lối cũ.' },
  { id: 'q3', question: 'Theo chương này, mối quan hệ giữa xu hướng worabael và các quy tắc tôn ti ở Chương 1–5 là gì?', options: ['Worabael đã hoàn toàn thay thế các quy tắc cũ', 'Cả hai tồn tại song song trong căng thẳng, chưa giải quyết dứt điểm', 'Không có liên hệ gì giữa hai bên', 'Quy tắc tôn ti cũ đã biến mất từ lâu'], correctIndex: 1, explanation: 'Thực tế công sở Hàn hiện nay: kỳ vọng cũ (kính ngữ, hoesik) và kỳ vọng mới (52 giờ, worabael) cùng tồn tại.' },
]);

const c8 = doc('kcc401-8-1-korean-companies-vietnam', '8.1 — Working at Korean companies in Vietnam & real scenarios|||8.1 — Làm việc trong công ty Hàn tại Việt Nam & tình huống thực tế',
  '주재원 (nhân viên biệt phái) và va chạm văn hoá với nhân sự Việt Nam; nhận biết 갑질 (lạm quyền); mẹo thực tế: kính ngữ cơ bản, đọc nunchi, tham gia hoesik vừa phải.',
  [[
    `<span class="eyebrow">KCC401 · Chapter 8</span>
<h2>Working at Korean companies in Vietnam &amp; real scenarios</h2>
<h3>Korean investment &amp; the 주재원 (jujaewon)</h3>
<p>Major Korean groups — Samsung, LG, Hyosung among others — run large operations in Vietnam, staffed by local employees under Korean management. A <strong>주재원 (jujaewon)</strong>, an expatriate manager posted from headquarters, often carries the hierarchy and honorific expectations of Chapters 1–2 directly into a Vietnamese office that culturally runs flatter and more directly than a Seoul HQ.</p>
<h3>Where friction shows up</h3>
<ul>
<li><strong>Language &amp; 통역 (tongyeok)</strong> — interpretation quality directly shapes how "respectful" or "direct" a message lands; a literal translation can accidentally sound blunt or, conversely, evasive.</li>
<li><strong>Directness gap</strong> — Vietnamese staff giving a quick, direct "no, that won't work" can read to a Korean manager as unusually blunt; a Korean manager's indirect "we'll consider it" (Chapter 5) can read to Vietnamese staff as an actual maybe.</li>
<li><strong>현지화 (hyeonjihwa)</strong> — localization — how much a branch adapts its management style versus imports HQ norms wholesale is an ongoing negotiation, not a settled fact.</li>
</ul>
<h3>갑질 (gapjil) — recognizing power abuse</h3>
<p><strong>갑질</strong> names abusive behavior by the more powerful party in a relationship — a superior humiliating a subordinate, or a client mistreating a vendor. Awareness of the term matters for both sides: it names what should never be normalized as "just hierarchy."</p>
<h3>Practical tips for a Vietnamese employee</h3>
<p>Learn a handful of basic honorific greetings and titles (Chapter 2); use two hands for business cards even in a Vietnam office (Chapter 3); attend hoesik/워크숍 (workshop) at a moderate, sustainable level rather than never or always; and practice reading nunchi rather than only listening to literal words.</p>
<h3>Korean terms</h3>
<pre><code>주재원     (jujaewon)     - nhân viên biệt phái (expat) từ trụ sở chính
현지화     (hyeonjihwa)   - bản địa hoá cách quản lý
통역       (tongyeok)     - phiên dịch
갑질       (gapjil)       - hành vi lạm quyền của bên mạnh hơn
워크숍     (wokeusyop)    - buổi hội thảo/workshop nội bộ</code></pre>
<div class="callout"><span class="badge">Scenario</span> A jujaewon manager asks the team to stay for an unplanned meeting at 5:45pm. A Vietnamese staff member says directly "I have to pick up my kid, I can't stay" — intended as simple fact, it can land as unusually blunt to the manager. A softer, still-honest phrasing ("I have a family commitment right after work — could I catch up on the notes tomorrow morning?") respects both the honorific culture of Chapter 2 and the staff member's real limits.</div>`,
    `<span class="eyebrow">KCC401 · Chương 8</span>
<h2>Làm việc trong công ty Hàn tại Việt Nam &amp; tình huống thực tế</h2>
<h3>Đầu tư Hàn Quốc &amp; 주재원 (jujaewon)</h3>
<p>Các tập đoàn lớn của Hàn Quốc — Samsung, LG, Hyosung và nhiều tên tuổi khác — vận hành các cơ sở lớn tại Việt Nam, sử dụng lao động địa phương dưới sự quản lý của người Hàn. Một <strong>주재원 (jujaewon)</strong>, nhân viên biệt phái từ trụ sở chính, thường mang theo tôn ti &amp; kỳ vọng kính ngữ ở Chương 1–2 vào thẳng một văn phòng Việt Nam vốn quen với văn hoá phẳng hơn và trực tiếp hơn so với trụ sở Seoul.</p>
<h3>Những điểm dễ va chạm</h3>
<ul>
<li><strong>Ngôn ngữ &amp; 통역 (tongyeok)</strong> — chất lượng phiên dịch ảnh hưởng trực tiếp đến việc một thông điệp nghe "tôn trọng" hay "trực tiếp" đến mức nào; dịch quá sát nghĩa có thể vô tình nghe thẳng thừng, hoặc ngược lại nghe né tránh.</li>
<li><strong>Khoảng cách về sự trực tiếp</strong> — nhân viên Việt Nam trả lời nhanh, thẳng "không, cách đó không được" có thể khiến quản lý Hàn thấy bất ngờ vì quá thẳng; ngược lại câu trả lời gián tiếp "chúng tôi sẽ xem xét" (Chương 5) của quản lý Hàn có thể khiến nhân viên Việt hiểu nhầm thành một khả năng thật sự.</li>
<li><strong>현지화 (hyeonjihwa)</strong> — bản địa hoá — mức độ chi nhánh điều chỉnh phong cách quản lý so với áp nguyên chuẩn trụ sở chính là một sự thương lượng đang diễn ra, không phải một điều đã ổn định.</li>
</ul>
<h3>갑질 (gapjil) — nhận diện hành vi lạm quyền</h3>
<p><strong>갑질</strong> gọi tên hành vi lạm quyền của bên có vị thế mạnh hơn trong một mối quan hệ — cấp trên làm nhục cấp dưới, hoặc khách hàng đối xử tệ với nhà cung cấp. Nhận biết được thuật ngữ này quan trọng cho cả hai phía: nó gọi tên điều không bao giờ nên được bình thường hoá thành "chỉ là tôn ti".</p>
<h3>Mẹo thực tế cho nhân viên Việt Nam</h3>
<p>Học một số lời chào &amp; xưng hô kính ngữ cơ bản (Chương 2); dùng hai tay khi trao danh thiếp dù đang ở văn phòng Việt Nam (Chương 3); tham gia hoesik/워크숍 (workshop) ở mức vừa phải, bền vững thay vì không bao giờ hoặc lúc nào cũng có mặt; và luyện đọc nunchi thay vì chỉ nghe đúng nghĩa đen lời nói.</p>
<h3>Thuật ngữ tiếng Hàn</h3>
<pre><code>주재원     (jujaewon)     - nhân viên biệt phái (expat) từ trụ sở chính
현지화     (hyeonjihwa)   - bản địa hoá cách quản lý
통역       (tongyeok)     - phiên dịch
갑질       (gapjil)       - hành vi lạm quyền của bên mạnh hơn
워크숍     (wokeusyop)    - buổi hội thảo/workshop nội bộ</code></pre>
<div class="callout"><span class="badge">Tình huống</span> Một quản lý jujaewon yêu cầu cả đội ở lại họp đột xuất lúc 5 giờ 45. Một nhân viên Việt Nam nói thẳng "em phải đón con, không ở lại được" — vốn chỉ là nói sự thật đơn giản, nhưng có thể khiến quản lý thấy bất ngờ vì quá thẳng. Một cách diễn đạt mềm hơn mà vẫn trung thực ("em có việc gia đình ngay sau giờ làm — em xin phép cập nhật lại nội dung vào sáng mai được không ạ?") vừa tôn trọng văn hoá kính ngữ ở Chương 2, vừa giữ đúng giới hạn thật của nhân viên.</div>`,
  ]]);

const c8q = quiz('kcc401-quiz-8', 'Quiz 8 — Korean companies in Vietnam|||Quiz 8 — Công ty Hàn tại Việt Nam', [
  { id: 'q1', question: '주재원 (jujaewon) là ai?', options: ['Nhân viên người Việt mới tuyển', 'Nhân viên biệt phái (expat) được cử từ trụ sở chính Hàn Quốc', 'Phiên dịch viên tự do bên ngoài', 'Khách hàng của công ty'], correctIndex: 1, explanation: 'Jujaewon là quản lý/nhân viên được công ty mẹ ở Hàn Quốc cử sang chi nhánh nước ngoài.' },
  { id: 'q2', question: 'Vì sao câu trả lời trực tiếp "không được" của nhân viên Việt Nam đôi khi gây bất ngờ cho quản lý Hàn?', options: ['Vì tiếng Việt không có từ "không"', 'Vì văn hoá Hàn thường ưu tiên giao tiếp gián tiếp, nên câu trả lời thẳng bị thấy là bất thường thẳng thắn', 'Vì quản lý Hàn không hiểu tiếng Việt', 'Vì đây là điều luật lao động cấm'], correctIndex: 1, explanation: 'Như học ở Chương 5, giao tiếp gián tiếp là chuẩn mực phổ biến trong văn hoá Hàn.' },
  { id: 'q3', question: '갑질 (gapjil) mô tả hành vi nào?', options: ['Sự nhiệt tình giúp đỡ đồng nghiệp', 'Hành vi lạm quyền của bên có vị thế mạnh hơn với bên yếu hơn', 'Kỹ năng đàm phán hợp đồng', 'Nghi thức trao danh thiếp'], correctIndex: 1, explanation: 'Gapjil chỉ hành vi lạm quyền, ví dụ cấp trên làm nhục cấp dưới hoặc khách hàng chèn ép nhà cung cấp.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'KCC401',
    slug: 'kcc401-van-hoa-doanh-nghiep-han-quoc',
    title: 'Văn hoá doanh nghiệp Hàn Quốc',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KCC401.webp',
    shortDescription: 'Korean corporate culture: Confucian values, hierarchy & honorifics, business-card etiquette, group culture, networking & face-saving, chaebol, work-life balance, Korean firms in Vietnam. Bilingual, with Korean terms.|||Văn hoá doanh nghiệp Hàn: Nho giáo, cấp bậc & kính ngữ, nghi thức danh thiếp, văn hoá tập thể, quan hệ & giữ thể diện, chaebol, work-life balance, công ty Hàn tại Việt Nam. Song ngữ, có thuật ngữ Hàn.',
    description: 'Môn <strong>KCC401 — Korean Corporate Culture / Văn hoá doanh nghiệp Hàn Quốc</strong> (kỳ 5, ngành Ngôn ngữ Hàn) đi qua <strong>8 chương</strong>: tổng quan &amp; giá trị Nho giáo → cấp bậc &amp; kính ngữ (직급, 존댓말) → nghi thức gặp gỡ &amp; danh thiếp (명함 예절) → văn hoá tập thể, tăng ca &amp; hội họp (회식, 야근) → quan hệ (인맥) &amp; giữ thể diện (체면) → chaebol (재벌) → xu hướng work-life balance (워라밸) → làm việc tại công ty Hàn ở Việt Nam. Bám các nguồn tham khảo "한국 기업문화의 이해", "Korean Business Etiquette" (Boye De Mente) và tài liệu KOTRA — giảng song ngữ Việt-Anh, kèm thuật ngữ &amp; tình huống giao tiếp tiếng Hàn, quiz mỗi chương.',
    whatYouLearn: 'Giá trị Nho giáo nơi công sở (tôn ti, hoà hợp, trung thành); thang chức danh 사원→부장 & kính ngữ 존댓말/반말; nghi thức cúi chào, bắt tay, trao danh thiếp 명함 bằng hai tay; văn hoá 회식/야근 & vai trò thật của cuộc họp; mạng lưới quan hệ 인맥, giao tiếp gián tiếp & giữ thể diện 체면; cấu trúc chaebol 재벌 (총수, 계열사) so với doanh nghiệp vừa & nhỏ; xu hướng 워라밸, luật 52 giờ/tuần, thế hệ MZ; va chạm văn hoá thực tế khi làm việc tại công ty Hàn ở Việt Nam & cách nhận diện 갑질.',
    requirements: 'Không yêu cầu tiếng Hàn trước đó; nên có vốn tiếng Anh cơ bản để đọc song song. Tham khảo giáo trình chính thức trên FLM (flm.fpt.edu.vn) để biết chuẩn đầu ra đầy đủ.',
  },
  sections: [
    { title: 'Chương 1 — Tổng quan & Nho giáo|||Chapter 1 — Overview & Confucian values', description: 'Ba trụ cột Nho giáo: tôn ti, hoà hợp, trung thành.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Cấp bậc & kính ngữ|||Chapter 2 — Hierarchy & honorifics', description: '직급, 존댓말/반말, tiền bối-hậu bối.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chào hỏi & danh thiếp|||Chapter 3 — Greetings & business cards', description: '절, 악수, 명함 예절.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tập thể, tăng ca & hội họp|||Chapter 4 — Group culture, overtime & meetings', description: '회식, 야근, 회의, 눈치.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Quan hệ & giữ thể diện|||Chapter 5 — Networking & saving face', description: '인맥, giao tiếp gián tiếp, 체면.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Chaebol|||Chapter 6 — Chaebol', description: '재벌, 총수, 계열사 so với 중소기업.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Work-life balance|||Chapter 7 — Work-life balance', description: '워라밸, luật 52 giờ, 꼰대, MZ세대.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Công ty Hàn tại Việt Nam|||Chapter 8 — Korean companies in Vietnam', description: '주재원, va chạm văn hoá, 갑질, mẹo thực tế.', lessons: [c8, c8q] },
  ],
};
