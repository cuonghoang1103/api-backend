/**
 * KOR311 — Intermediate Korean Language. Giáo trình FLM (syl): trung cấp 1 (~bậc
 * 3 Khung 6 bậc VN), 4 kỹ năng; chủ đề sức khoẻ/mua sắm/nấu ăn/ngân hàng/tính
 * cách/quan hệ; giáo trình Tiếng Hàn tổng hợp 3. Song ngữ VI + chữ Hàn (Hangul +
 * romaja). Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('kor311-0-1-overview', 'Course overview: Intermediate Korean|||Tổng quan: Tiếng Hàn trung cấp',
  'Trung cấp 1 (~bậc 3), 4 kỹ năng; chủ đề đời sống (sức khoẻ, mua sắm, nấu ăn, ngân hàng, tính cách, quan hệ). Lộ trình: ngữ pháp trung cấp → từ vựng chủ đề → giao tiếp tình huống.',
  [[
    `<span class="eyebrow">KOR311 · Lesson 0.1 · Overview</span>
<h2>Intermediate Korean</h2>
<p class="lead">This course develops the four skills — listening, speaking, reading, writing — at <strong>intermediate level 1</strong> (about level 3 on Vietnam's 6-level framework). Lessons revolve around everyday themes: health, shopping, cooking, banking, personality and personal relationships, based on the "Integrated Korean 3" textbook.</p>
<h3>What you'll be able to do</h3>
<p>By the end you can handle real situations — ask after someone's health, request help, express dissatisfaction, apologize — with natural pronunciation and intonation, read texts closely or by skimming, and write on varied topics.</p>
<h3>Roadmap</h3>
<p>Intermediate grammar (particles &amp; connectors) → topic vocabulary &amp; expressions (health, shopping, banking…) → the four skills in real situations. Bilingual (Vietnamese), with Korean (Hangul + romanization) and practice.</p>`,
    `<span class="eyebrow">KOR311 · Bài 0.1 · Tổng quan</span>
<h2>Tiếng Hàn trung cấp</h2>
<p class="lead">Môn này phát triển bốn kỹ năng — nghe, nói, đọc, viết — ở <strong>trình độ trung cấp 1</strong> (khoảng bậc 3 theo Khung năng lực ngoại ngữ 6 bậc của Việt Nam). Các bài xoay quanh chủ đề đời sống: sức khoẻ, mua sắm, nấu ăn, ngân hàng, tính cách và các quan hệ cá nhân, dựa trên giáo trình "Tiếng Hàn tổng hợp 3".</p>
<h3>Bạn sẽ làm được gì</h3>
<p>Kết thúc, bạn xử lý được tình huống thật — thăm hỏi sức khoẻ, nhờ giúp đỡ, bày tỏ sự bất mãn, xin lỗi — với phát âm và ngữ điệu tự nhiên, đọc lướt hoặc đọc kỹ văn bản, và viết về các chủ đề khác nhau.</p>
<h3>Lộ trình</h3>
<p>Ngữ pháp trung cấp (trợ từ &amp; từ nối) → từ vựng &amp; cách nói theo chủ đề (sức khoẻ, mua sắm, ngân hàng…) → bốn kỹ năng trong tình huống thật. Song ngữ (tiếng Việt), có chữ Hàn (Hangul + phiên âm) và luyện tập.</p>`,
  ]]);

const c1 = doc('kor311-1-1-grammar', '1.1 — Intermediate grammar|||1.1 — Ngữ pháp trung cấp',
  'Trợ từ (은/는, 이/가, 을/를, 에/에서), thể lịch sự (아요/어요, 습니다), từ nối lý do (아서/어서, 니까) & điều kiện (으면).',
  [[
    `<span class="eyebrow">KOR311 · Chapter 1 · Lesson 1.1</span>
<h2>Intermediate grammar</h2>
<h3>Core particles</h3>
<table><thead><tr><th>Particle</th><th>Role</th></tr></thead><tbody>
<tr><td>은/는 (eun/neun)</td><td>topic marker ("as for…")</td></tr>
<tr><td>이/가 (i/ga)</td><td>subject marker</td></tr>
<tr><td>을/를 (eul/reul)</td><td>object marker</td></tr>
<tr><td>에 / 에서 (e / eseo)</td><td>at/to (location, time) / from, at (action location)</td></tr>
</tbody></table>
<p>Korean is <strong>Subject–Object–Verb</strong>, and particles mark each word's role — like Japanese. The choice of 은/는 vs 이/가 (topic vs subject) is a classic intermediate challenge.</p>
<h3>Politeness &amp; connectors</h3>
<ul>
<li><strong>아요/어요</strong> — polite everyday ending; <strong>습니다/ㅂ니다</strong> — formal polite.</li>
<li><strong>아서/어서</strong> and <strong>(으)니까</strong> — "because": 비가 와서 안 가요 (bi-ga wa-seo an ga-yo = because it's raining, I won't go).</li>
<li><strong>(으)면</strong> — "if/when": 시간이 있으면 만나요 (si-gan-i iss-eu-myeon man-na-yo = if I have time, let's meet).</li>
</ul>
<pre><code>저는 학생이에요.
jeo-neun haksaeng-i-e-yo.
= I am a student.
</code></pre>`,
    `<span class="eyebrow">KOR311 · Chương 1 · Bài 1.1</span>
<h2>Ngữ pháp trung cấp</h2>
<h3>Trợ từ cốt lõi</h3>
<table><thead><tr><th>Trợ từ</th><th>Vai trò</th></tr></thead><tbody>
<tr><td>은/는 (eun/neun)</td><td>đánh dấu chủ đề ("còn về…")</td></tr>
<tr><td>이/가 (i/ga)</td><td>đánh dấu chủ ngữ</td></tr>
<tr><td>을/를 (eul/reul)</td><td>đánh dấu tân ngữ</td></tr>
<tr><td>에 / 에서 (e / eseo)</td><td>ở/đến (nơi chốn, thời gian) / từ, tại (nơi diễn ra hành động)</td></tr>
</tbody></table>
<p>Tiếng Hàn là <strong>Chủ–Tân–Động</strong>, và trợ từ đánh dấu vai trò từng từ — giống tiếng Nhật. Chọn 은/는 vs 이/가 (chủ đề vs chủ ngữ) là thử thách trung cấp kinh điển.</p>
<h3>Thể lịch sự &amp; từ nối</h3>
<ul>
<li><strong>아요/어요</strong> — đuôi lịch sự hằng ngày; <strong>습니다/ㅂ니다</strong> — lịch sự trang trọng.</li>
<li><strong>아서/어서</strong> và <strong>(으)니까</strong> — "vì": 비가 와서 안 가요 (vì trời mưa nên không đi).</li>
<li><strong>(으)면</strong> — "nếu/khi": 시간이 있으면 만나요 (nếu có thời gian thì gặp nhau).</li>
</ul>
<pre><code>저는 학생이에요.
jeo-neun haksaeng-i-e-yo.
= Tôi là sinh viên.
</code></pre>`,
  ]]);

const c1q = quiz('kor311-quiz-1', 'Quiz 1 — Grammar|||Quiz 1 — Ngữ pháp', [
  { id: 'q1', question: 'Trợ từ 을/를 (eul/reul) đánh dấu?', options: ['Chủ đề', 'Tân ngữ (object)', 'Nơi chốn', 'Thời gian'], correctIndex: 1, explanation: '을/를 là trợ từ tân ngữ; 이/가 là chủ ngữ.' },
  { id: 'q2', question: '「비가 와서 안 가요」— 「아서/어서」ở đây diễn đạt?', options: ['Điều kiện', 'Lý do ("vì")', 'Thời gian', 'Nhượng bộ'], correctIndex: 1, explanation: '아서/어서 = "vì/nên"; nối nguyên nhân-kết quả.' },
  { id: 'q3', question: 'Trật tự câu tiếng Hàn là?', options: ['Chủ-Động-Tân', 'Chủ-Tân-Động (động từ cuối)', 'Động-Chủ-Tân', 'Tự do'], correctIndex: 1, explanation: 'Tiếng Hàn SOV, động từ đứng cuối, trợ từ đánh dấu vai trò.' },
]);

const c2 = doc('kor311-2-1-topics', '2.1 — Topic vocabulary & expressions|||2.1 — Từ vựng & cách nói theo chủ đề',
  'Từ vựng và mẫu câu theo chủ đề đời sống: sức khoẻ (병원), mua sắm (쇼핑), ngân hàng (은행), tính cách & quan hệ.',
  [[
    `<span class="eyebrow">KOR311 · Chapter 2 · Lesson 2.1</span>
<h2>Topic vocabulary &amp; expressions</h2>
<h3>Health (건강)</h3>
<pre><code>어디가 아파요?
eo-di-ga a-pa-yo?
= Where does it hurt?
머리가 아파요.  meo-ri-ga a-pa-yo. = I have a headache.
</code></pre>
<h3>Shopping (쇼핑) &amp; banking (은행)</h3>
<ul>
<li>얼마예요? (eol-ma-ye-yo?) = How much is it?</li>
<li>깎아 주세요 (kkakka juseyo) = Please give a discount.</li>
<li>계좌를 만들고 싶어요 (gyejwa-reul mandeulgo sipeoyo) = I'd like to open an account.</li>
</ul>
<h3>Personality &amp; relationships (성격 &amp; 관계)</h3>
<ul>
<li>친절해요 (chinjeol-hae-yo) = kind; 재미있어요 (jaemi-isseo-yo) = fun/interesting.</li>
<li>친구를 사귀다 (chingu-reul sagwida) = to make friends.</li>
</ul>
<div class="callout"><span class="badge">Learn in chunks</span> Intermediate vocabulary sticks best as whole useful phrases tied to a situation (a doctor's visit, a shop, the bank) rather than isolated words — you recall the phrase when the situation arises.</div>`,
    `<span class="eyebrow">KOR311 · Chương 2 · Bài 2.1</span>
<h2>Từ vựng &amp; cách nói theo chủ đề</h2>
<h3>Sức khoẻ (건강)</h3>
<pre><code>어디가 아파요?
eo-di-ga a-pa-yo?
= Bạn đau ở đâu?
머리가 아파요.  meo-ri-ga a-pa-yo. = Tôi bị đau đầu.
</code></pre>
<h3>Mua sắm (쇼핑) &amp; ngân hàng (은행)</h3>
<ul>
<li>얼마예요? (eol-ma-ye-yo?) = Bao nhiêu tiền?</li>
<li>깎아 주세요 (kkakka juseyo) = Giảm giá giúp tôi với.</li>
<li>계좌를 만들고 싶어요 (gyejwa-reul mandeulgo sipeoyo) = Tôi muốn mở tài khoản.</li>
</ul>
<h3>Tính cách &amp; quan hệ (성격 &amp; 관계)</h3>
<ul>
<li>친절해요 (chinjeol-hae-yo) = tử tế; 재미있어요 (jaemi-isseo-yo) = vui/thú vị.</li>
<li>친구를 사귀다 (chingu-reul sagwida) = kết bạn.</li>
</ul>
<div class="callout"><span class="badge">Học theo cụm</span> Từ vựng trung cấp nhớ lâu nhất khi là cả cụm hữu ích gắn với tình huống (đi khám, cửa hàng, ngân hàng) thay vì từ rời — bạn nhớ ra cả cụm khi gặp tình huống.</div>`,
  ]]);

const c2q = quiz('kor311-quiz-2', 'Quiz 2 — Topics|||Quiz 2 — Chủ đề', [
  { id: 'q1', question: '「얼마예요?」(eolmayeyo) nghĩa là?', options: ['Bạn khoẻ không?', 'Bao nhiêu tiền?', 'Ở đâu?', 'Đau ở đâu?'], correctIndex: 1, explanation: '얼마예요? = giá bao nhiêu (mua sắm).' },
  { id: 'q2', question: '「머리가 아파요」nghĩa là?', options: ['Tôi vui', 'Tôi bị đau đầu', 'Tôi muốn mở tài khoản', 'Giảm giá đi'], correctIndex: 1, explanation: '머리(đầu) + 아파요(đau) = đau đầu (chủ đề sức khoẻ).' },
  { id: 'q3', question: '「계좌를 만들고 싶어요」liên quan chủ đề?', options: ['Sức khoẻ', 'Ngân hàng (mở tài khoản)', 'Nấu ăn', 'Tính cách'], correctIndex: 1, explanation: '계좌 = tài khoản → chủ đề ngân hàng.' },
]);

const c3 = doc('kor311-3-1-situations', '3.1 — Real situations & four skills|||3.1 — Tình huống thật & bốn kỹ năng',
  'Áp dụng vào tình huống: nhờ giúp đỡ, bày tỏ bất mãn, xin lỗi lịch sự; chiến lược nghe-nói-đọc-viết ở trung cấp.',
  [[
    `<span class="eyebrow">KOR311 · Chapter 3 · Lesson 3.1</span>
<h2>Real situations &amp; the four skills</h2>
<h3>Useful situation phrases</h3>
<pre><code>도와주시겠어요?
dowa-jusigess-eo-yo?
= Could you help me? (polite request)

죄송하지만, 좀 문제가 있어요.
joesong-hajiman, jom munje-ga iss-eo-yo.
= I'm sorry, but there's a bit of a problem. (raising an issue politely)

정말 죄송합니다.
jeongmal joesong-hamnida.
= I'm truly sorry. (formal apology)
</code></pre>
<h3>Skill strategies at intermediate level</h3>
<ul>
<li><strong>Listening</strong> — follow a conversation's flow; catch the request or complaint even amid new words.</li>
<li><strong>Speaking</strong> — soften requests/complaints (죄송하지만…, 혹시…) — Korean values indirect politeness.</li>
<li><strong>Reading</strong> — skim for topic, then read closely; use context for new vocabulary.</li>
<li><strong>Writing</strong> — write a short structured text on a topic (a complaint email, a self-introduction) using the grammar from Chapter 1.</li>
</ul>
<div class="callout"><span class="badge">Politeness matters</span> Korean, like Japanese, encodes respect in its verb endings and phrasing. Requesting, complaining and apologizing <em>politely</em> (with 요/습니다 and softeners) is central to sounding natural at this level.</div>`,
    `<span class="eyebrow">KOR311 · Chương 3 · Bài 3.1</span>
<h2>Tình huống thật &amp; bốn kỹ năng</h2>
<h3>Câu dùng trong tình huống</h3>
<pre><code>도와주시겠어요?
dowa-jusigess-eo-yo?
= Bạn giúp tôi được không? (nhờ vả lịch sự)

죄송하지만, 좀 문제가 있어요.
joesong-hajiman, jom munje-ga iss-eo-yo.
= Xin lỗi, nhưng có một chút vấn đề. (nêu vấn đề lịch sự)

정말 죄송합니다.
jeongmal joesong-hamnida.
= Tôi thực sự xin lỗi. (xin lỗi trang trọng)
</code></pre>
<h3>Chiến lược kỹ năng ở trung cấp</h3>
<ul>
<li><strong>Nghe</strong> — theo dòng hội thoại; bắt được lời nhờ vả hay phàn nàn dù có từ mới.</li>
<li><strong>Nói</strong> — làm mềm lời nhờ/phàn nàn (죄송하지만…, 혹시…) — tiếng Hàn coi trọng lịch sự gián tiếp.</li>
<li><strong>Đọc</strong> — lướt lấy chủ đề, rồi đọc kỹ; dùng ngữ cảnh cho từ mới.</li>
<li><strong>Viết</strong> — viết một đoạn có cấu trúc theo chủ đề (email phàn nàn, tự giới thiệu) dùng ngữ pháp Chương 1.</li>
</ul>
<div class="callout"><span class="badge">Lịch sự rất quan trọng</span> Tiếng Hàn, như tiếng Nhật, mã hoá sự tôn trọng trong đuôi động từ và cách nói. Nhờ vả, phàn nàn và xin lỗi <em>lịch sự</em> (với 요/습니다 và từ làm mềm) là cốt lõi để nghe tự nhiên ở trình độ này.</div>`,
  ]]);

const c3q = quiz('kor311-quiz-3', 'Quiz 3 — Situations|||Quiz 3 — Tình huống', [
  { id: 'q1', question: '「도와주시겠어요?」dùng để?', options: ['Xin lỗi', 'Nhờ giúp đỡ một cách lịch sự', 'Hỏi giá', 'Chào tạm biệt'], correctIndex: 1, explanation: 'Mẫu nhờ vả lịch sự ("bạn giúp được không?").' },
  { id: 'q2', question: 'Nêu vấn đề/phàn nàn lịch sự thường bắt đầu bằng?', options: ['정말 (thực sự)', '죄송하지만 (xin lỗi nhưng…)', '얼마 (bao nhiêu)', '친구 (bạn)'], correctIndex: 1, explanation: '죄송하지만… làm mềm trước khi nêu vấn đề.' },
  { id: 'q3', question: 'Đặc điểm quan trọng của giao tiếp tiếng Hàn (như tiếng Nhật)?', options: ['Không có kính ngữ', 'Mã hoá tôn trọng trong đuôi động từ & cách nói (요/습니다, từ làm mềm)', 'Chỉ dùng một mức', 'Nói càng thẳng càng tốt'], correctIndex: 1, explanation: 'Lịch sự gián tiếp + đuôi kính là cốt lõi.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'KOR311',
    slug: 'kor311-intermediate-korean-language',
    title: 'Intermediate Korean Language',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KOR311.webp',
    shortDescription: 'Intermediate Korean (level 3) — particles & connectors, everyday topics (health, shopping, banking, relationships), and polite requests/complaints/apologies across the four skills. Bilingual, with Hangul + romanization & quizzes.|||Tiếng Hàn trung cấp (bậc 3) — trợ từ & từ nối, chủ đề đời sống (sức khoẻ, mua sắm, ngân hàng, quan hệ), và nhờ vả/phàn nàn/xin lỗi lịch sự qua bốn kỹ năng. Song ngữ, có Hangul + phiên âm & quiz.',
    description: 'Môn <strong>KOR311 — Intermediate Korean Language</strong> (kỳ 7) phát triển bốn kỹ năng ở <strong>trung cấp 1 (~bậc 3</strong> Khung năng lực ngoại ngữ 6 bậc VN), dựa trên "Tiếng Hàn tổng hợp 3". Gồm <strong>ngữ pháp trung cấp</strong> (trợ từ 은/는·이/가·을/를·에/에서, thể 아요/어요·습니다, lý do 아서/어서·니까, điều kiện 으면) → <strong>từ vựng &amp; cách nói theo chủ đề</strong> (sức khoẻ, mua sắm, ngân hàng, tính cách &amp; quan hệ) → <strong>tình huống thật &amp; bốn kỹ năng</strong> (nhờ vả, phàn nàn, xin lỗi lịch sự). Bám giáo trình FLM, song ngữ, có chữ Hàn (Hangul + phiên âm) và quiz.',
    whatYouLearn: 'Trợ từ 은/는·이/가·을/를·에/에서 & trật tự SOV; thể lịch sự 아요/어요 vs 습니다; từ nối lý do 아서/어서·(으)니까 & điều kiện (으)면; từ vựng chủ đề (sức khoẻ, mua sắm, ngân hàng, tính cách, quan hệ); mẫu câu nhờ vả (도와주시겠어요?), nêu vấn đề (죄송하지만…), xin lỗi (죄송합니다); chiến lược nghe-nói-đọc-viết & lịch sự gián tiếp.',
    requirements: 'Đã học tiếng Hàn sơ cấp (biết Hangul, ngữ pháp cơ bản). Hướng bậc 3/trung cấp.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Trung cấp bậc 3, chủ đề đời sống.', lessons: [intro] },
    { title: 'Chương 1 — Ngữ pháp trung cấp|||Chapter 1 — Intermediate grammar', description: 'Trợ từ, thể lịch sự, từ nối.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Từ vựng chủ đề|||Chapter 2 — Topic vocabulary', description: 'Sức khoẻ, mua sắm, ngân hàng, quan hệ.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tình huống & bốn kỹ năng|||Chapter 3 — Situations & four skills', description: 'Nhờ vả, phàn nàn, xin lỗi lịch sự.', lessons: [c3, c3q] },
  ],
};
