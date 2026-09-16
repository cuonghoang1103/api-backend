/**
 * KLP401 — Korean Language Practice. Giáo trình tham khảo (syl, trích dẫn KHÔNG
 * upload PDF): 서울대 한국어 3-4, 이화 한국어 (Ewha Korean) 3, định dạng đề TOPIK II.
 * Thực hành tổng hợp trung cấp TOPIK 3-4 — 8 chủ đề: kể chuyện & trải nghiệm, so
 * sánh & ý kiến, sức khoẻ & lời khuyên, công việc & kế hoạch, xã hội & môi
 * trường, văn hoá & lễ hội, kính ngữ & văn phong trang trọng, ôn tập TOPIK II.
 * Song ngữ + chữ Hàn (Hangeul + romaja). Giữ NGUYÊN slug/semester/thumb(v3).
 * ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('klp401-0-1-overview', 'Course overview: Korean Language Practice|||Tổng quan: Thực hành tiếng Hàn tổng hợp',
  'Thực hành tổng hợp trung cấp TOPIK 3-4, tích hợp nghe-nói-đọc-viết qua 8 chủ đề: kể chuyện, so sánh & ý kiến, sức khoẻ, công việc, xã hội & môi trường, văn hoá, kính ngữ, ôn tập TOPIK II.',
  [[
    `<span class="eyebrow">KLP401 · Lesson 0.1 · Overview</span>
<h2>Korean Language Practice</h2>
<p class="lead">This is an <strong>integrated intermediate practice course</strong> (TOPIK 3-4 level) that trains listening, speaking, reading and writing together through eight practical themes, following the structure of <strong>Seoul National University Korean 3-4 (서울대 한국어)</strong> and <strong>Ewha Korean 3 (이화 한국어)</strong>.</p>
<h3>Format of each lesson</h3>
<p>Every lesson pairs a grammar point with Hangeul examples, romanization and translation, plus vocabulary and short dialogues you can reuse in real conversation.</p>
<h3>Roadmap</h3>
<p>Storytelling &amp; experience → comparison &amp; opinion → health &amp; advice → work &amp; plans → society &amp; environment → culture &amp; festivals → honorifics &amp; formal register → review: dialogue &amp; TOPIK II paragraph writing.</p>`,
    `<span class="eyebrow">KLP401 · Bài 0.1 · Tổng quan</span>
<h2>Thực hành tiếng Hàn tổng hợp</h2>
<p class="lead">Đây là môn <strong>thực hành tổng hợp trình độ trung cấp</strong> (TOPIK 3-4), luyện đồng thời nghe, nói, đọc, viết qua tám chủ đề thực tế, theo cấu trúc giáo trình <strong>서울대 한국어 (Seoul National University Korean) 3-4</strong> và <strong>이화 한국어 (Ewha Korean) 3</strong>.</p>
<h3>Cấu trúc mỗi bài</h3>
<p>Mỗi bài ghép một điểm ngữ pháp với ví dụ chữ Hàn, phiên âm và bản dịch, cùng từ vựng và hội thoại ngắn có thể dùng lại trong giao tiếp thật.</p>
<h3>Lộ trình</h3>
<p>Kể chuyện &amp; trải nghiệm → so sánh &amp; ý kiến → sức khoẻ &amp; lời khuyên → công việc &amp; kế hoạch → xã hội &amp; môi trường → văn hoá &amp; lễ hội → kính ngữ &amp; văn phong trang trọng → ôn tập: hội thoại &amp; viết đoạn TOPIK II.</p>`,
  ]]);

const c1 = doc('klp401-1-1-storytelling', '1.1 — Storytelling & past experience|||1.1 — Kể chuyện & trải nghiệm',
  'Quá khứ -았/었-, vế nền -는데, kể kinh nghiệm -(으)ㄴ/는 적이 있다; từ nối kể chuyện (그런데, 그래서, 결국).',
  [[
    `<span class="eyebrow">KLP401 · Chapter 1 · Lesson 1.1</span>
<h2>Storytelling &amp; past experience</h2>
<h3>Past tense -았/었-</h3>
<table><thead><tr><th>Dictionary form</th><th>Past polite</th></tr></thead><tbody>
<tr><td>가다 (to go)</td><td>갔어요 (gass-eo-yo)</td></tr>
<tr><td>먹다 (to eat)</td><td>먹었어요 (meog-eoss-eo-yo)</td></tr>
<tr><td>하다 (to do)</td><td>했어요 (haess-eo-yo)</td></tr>
</tbody></table>
<p>Vowel harmony decides 았 vs 었: stems ending in ㅏ/ㅗ take 았, everything else takes 었; 하다 irregularly becomes 했다.</p>
<h3>-는데: setting the scene</h3>
<p><strong>-는데</strong> attaches background or a mild contrast before the main point of a story.</p>
<pre><code>어제 영화를 봤는데 정말 재미있었어요.
eo-je yeong-hwa-reul bwass-neun-de jeongmal jaemi-iss-eoss-eo-yo.
= I watched a movie yesterday, and it was really fun.
</code></pre>
<h3>-(으)ㄴ/는 적이 있다/없다: talking about experience</h3>
<pre><code>한국에 가 본 적이 있어요.
han-gug-e ga bon jeog-i iss-eo-yo.
= I have been to Korea before.
</code></pre>
<div class="callout"><span class="badge">Storyteller toolkit</span> 그런데 (by the way/however), 그래서 (so), 결국 (in the end) are the connectors that turn a list of facts into a narrative.</div>`,
    `<span class="eyebrow">KLP401 · Chương 1 · Bài 1.1</span>
<h2>Kể chuyện &amp; trải nghiệm</h2>
<h3>Thì quá khứ -았/었-</h3>
<table><thead><tr><th>Nguyên dạng</th><th>Quá khứ lịch sự</th></tr></thead><tbody>
<tr><td>가다 (đi)</td><td>갔어요 (gass-eo-yo)</td></tr>
<tr><td>먹다 (ăn)</td><td>먹었어요 (meog-eoss-eo-yo)</td></tr>
<tr><td>하다 (làm)</td><td>했어요 (haess-eo-yo)</td></tr>
</tbody></table>
<p>Hoà âm nguyên âm quyết định 았 hay 었: gốc từ kết thúc bằng ㅏ/ㅗ thì chia 았, còn lại chia 었; 하다 chia bất quy tắc thành 했다.</p>
<h3>-는데: nêu bối cảnh</h3>
<p><strong>-는데</strong> gắn nền hoặc tương phản nhẹ trước ý chính của câu chuyện.</p>
<pre><code>어제 영화를 봤는데 정말 재미있었어요.
eo-je yeong-hwa-reul bwass-neun-de jeongmal jaemi-iss-eoss-eo-yo.
= Hôm qua tôi xem phim, mà (phim) thật sự rất hay.
</code></pre>
<h3>-(으)ㄴ/는 적이 있다/없다: nói về kinh nghiệm</h3>
<pre><code>한국에 가 본 적이 있어요.
han-gug-e ga bon jeog-i iss-eo-yo.
= Tôi đã từng đến Hàn Quốc.
</code></pre>
<div class="callout"><span class="badge">Bộ công cụ kể chuyện</span> 그런데 (nhân tiện/tuy nhiên), 그래서 (vì vậy), 결국 (cuối cùng) là các từ nối biến một chuỗi sự việc rời rạc thành một câu chuyện.</div>`,
  ]]);

const c1q = quiz('klp401-quiz-1', 'Quiz 1 — Storytelling|||Quiz 1 — Kể chuyện', [
  { id: 'q1', question: '"했어요" là dạng quá khứ của động từ nào?', options: ['가다', '하다', '먹다', '오다'], correctIndex: 1, explanation: '하다 chia quá khứ bất quy tắc thành 했다/했어요.' },
  { id: 'q2', question: '"-는데" trong câu kể chuyện dùng để?', options: ['Kết thúc câu dứt khoát', 'Nêu nền/bối cảnh trước ý chính', 'Phủ định hành động', 'Hỏi ý kiến người nghe'], correctIndex: 1, explanation: '-는데 gắn bối cảnh hoặc tương phản nhẹ trước phần chính của câu.' },
  { id: 'q3', question: '"한국에 가 본 적이 있어요" nghĩa là?', options: ['Tôi sẽ đi Hàn Quốc', 'Tôi đã từng đến Hàn Quốc', 'Tôi đang ở Hàn Quốc', 'Tôi không muốn đi Hàn Quốc'], correctIndex: 1, explanation: '-(으)ㄴ/는 적이 있다 diễn tả kinh nghiệm đã từng làm gì.' },
]);

const c2 = doc('klp401-2-1-comparison-opinion', '2.1 — Comparison, choice & opinion|||2.1 — So sánh, lựa chọn & ý kiến',
  'So sánh -보다 (더), gợi ý -는 게 좋다, phỏng đoán -(으)ㄴ/는 것 같다, đề nghị -(으)ㄹ까요?.',
  [[
    `<span class="eyebrow">KLP401 · Chapter 2 · Lesson 2.1</span>
<h2>Comparison, choice &amp; opinion</h2>
<h3>Comparison with -보다</h3>
<pre><code>기차가 버스보다 더 빨라요.
gi-cha-ga beo-seu-bo-da deo ppal-la-yo.
= The train is faster than the bus.
</code></pre>
<h3>Suggesting: -는 게 좋다</h3>
<pre><code>지금 출발하는 게 좋겠어요.
ji-geum chul-bal-ha-neun ge jok-ess-eo-yo.
= It would be better to leave now.
</code></pre>
<h3>Guessing/opinion: -(으)ㄴ/는 것 같다</h3>
<pre><code>비가 올 것 같아요.
bi-ga ol geos gat-a-yo.
= It looks like it is going to rain.
</code></pre>
<h3>Proposing together: -(으)ㄹ까요?</h3>
<pre><code>우리 같이 갈까요?
u-ri gat-i gal-kka-yo?
= Shall we go together?
</code></pre>
<div class="callout"><span class="badge">Softening opinions</span> -것 같다 lets speakers state an opinion indirectly ("it seems") rather than bluntly — a habit worth keeping at intermediate level.</div>`,
    `<span class="eyebrow">KLP401 · Chương 2 · Bài 2.1</span>
<h2>So sánh, lựa chọn &amp; ý kiến</h2>
<h3>So sánh với -보다</h3>
<pre><code>기차가 버스보다 더 빨라요.
gi-cha-ga beo-seu-bo-da deo ppal-la-yo.
= Tàu nhanh hơn xe buýt.
</code></pre>
<h3>Gợi ý: -는 게 좋다</h3>
<pre><code>지금 출발하는 게 좋겠어요.
ji-geum chul-bal-ha-neun ge jok-ess-eo-yo.
= Xuất phát ngay bây giờ thì tốt hơn.
</code></pre>
<h3>Phỏng đoán/ý kiến: -(으)ㄴ/는 것 같다</h3>
<pre><code>비가 올 것 같아요.
bi-ga ol geos gat-a-yo.
= Có vẻ trời sắp mưa.
</code></pre>
<h3>Đề nghị cùng làm: -(으)ㄹ까요?</h3>
<pre><code>우리 같이 갈까요?
u-ri gat-i gal-kka-yo?
= Chúng ta cùng đi nhé?
</code></pre>
<div class="callout"><span class="badge">Nói giảm khi nêu ý kiến</span> -것 같다 giúp người nói nêu ý kiến gián tiếp ("có vẻ như") thay vì nói thẳng — một thói quen nên giữ ở trình độ trung cấp.</div>`,
  ]]);

const c2q = quiz('klp401-quiz-2', 'Quiz 2 — Comparison & opinion|||Quiz 2 — So sánh & ý kiến', [
  { id: 'q1', question: '"기차가 버스보다 더 빨라요" nghĩa là?', options: ['Tàu chậm hơn xe buýt', 'Tàu nhanh hơn xe buýt', 'Tàu và xe buýt bằng nhau', 'Xe buýt nhanh hơn tàu'], correctIndex: 1, explanation: 'A는 B보다 더 ~ = A hơn B về đặc điểm đó.' },
  { id: 'q2', question: 'Cấu trúc nào dùng để phỏng đoán/nêu ý kiến gián tiếp ("có vẻ như")?', options: ['-보다', '-(으)ㄹ까요?', '-(으)ㄴ/는 것 같다', '-는데'], correctIndex: 2, explanation: '-것 같다 = phỏng đoán, nêu ý kiến một cách nhẹ nhàng.' },
  { id: 'q3', question: '"우리 같이 갈까요?" dùng để?', options: ['Ra lệnh', 'Đề nghị cùng làm gì đó', 'Từ chối lời mời', 'Xin lỗi'], correctIndex: 1, explanation: '-(으)ㄹ까요? là mẫu đề nghị/rủ rê hoặc hỏi ý kiến.' },
]);

const c3 = doc('klp401-3-1-health-advice', '3.1 — Health, emotions & advice|||3.1 — Sức khoẻ, cảm xúc & lời khuyên',
  'Triệu chứng (열이 나다, 기침이 나다), bắt buộc -아/어야 하다, cấm đoán -지 마세요, cảm xúc (걱정되다, 답답하다).',
  [[
    `<span class="eyebrow">KLP401 · Chapter 3 · Lesson 3.1</span>
<h2>Health, emotions &amp; advice</h2>
<h3>Symptoms (증상)</h3>
<pre><code>열이 나요.    yeol-i na-yo.    = I have a fever.
기침이 나요.  gi-chim-i na-yo. = I have a cough.
어지러워요.  eo-ji-reo-wo-yo. = I feel dizzy.
</code></pre>
<h3>Obligation: -아/어야 하다/되다</h3>
<pre><code>약을 먹어야 해요.
yag-eul meog-eo-ya hae-yo.
= You have to take medicine.
</code></pre>
<h3>Prohibition: -지 마세요</h3>
<pre><code>무리하지 마세요.
mu-ri-ha-ji ma-se-yo.
= Please do not overexert yourself.
</code></pre>
<h3>Emotion vocabulary</h3>
<ul>
<li>걱정되다 (geok-jeong-doe-da) = to feel worried</li>
<li>답답하다 (dab-dab-ha-da) = to feel stuffy/frustrated</li>
<li>부담스럽다 (bu-dam-seu-reop-da) = to feel burdened/pressured</li>
</ul>
<div class="callout"><span class="badge">Giving advice politely</span> Pair -아/어야 해요 (should) with -지 마세요 (should not) for balanced, natural-sounding advice at a clinic, at work, or with friends.</div>`,
    `<span class="eyebrow">KLP401 · Chương 3 · Bài 3.1</span>
<h2>Sức khoẻ, cảm xúc &amp; lời khuyên</h2>
<h3>Triệu chứng (증상)</h3>
<pre><code>열이 나요.    yeol-i na-yo.    = Tôi bị sốt.
기침이 나요.  gi-chim-i na-yo. = Tôi bị ho.
어지러워요.  eo-ji-reo-wo-yo. = Tôi thấy chóng mặt.
</code></pre>
<h3>Bắt buộc: -아/어야 하다/되다</h3>
<pre><code>약을 먹어야 해요.
yag-eul meog-eo-ya hae-yo.
= Phải uống thuốc.
</code></pre>
<h3>Cấm đoán: -지 마세요</h3>
<pre><code>무리하지 마세요.
mu-ri-ha-ji ma-se-yo.
= Đừng gắng sức quá.
</code></pre>
<h3>Từ vựng cảm xúc</h3>
<ul>
<li>걱정되다 (geok-jeong-doe-da) = lo lắng</li>
<li>답답하다 (dab-dab-ha-da) = bực bội/ngột ngạt</li>
<li>부담스럽다 (bu-dam-seu-reop-da) = áp lực/nặng nề</li>
</ul>
<div class="callout"><span class="badge">Khuyên nhau đúng cách</span> Kết hợp -아/어야 해요 (nên/phải) với -지 마세요 (đừng) để đưa lời khuyên cân bằng, tự nhiên ở phòng khám, nơi làm việc hay với bạn bè.</div>`,
  ]]);

const c3q = quiz('klp401-quiz-3', 'Quiz 3 — Health & advice|||Quiz 3 — Sức khoẻ & lời khuyên', [
  { id: 'q1', question: '"약을 먹어야 해요" nghĩa là?', options: ['Không được uống thuốc', 'Phải uống thuốc', 'Đã uống thuốc rồi', 'Muốn uống thuốc'], correctIndex: 1, explanation: '-아/어야 하다/되다 = bắt buộc/nên làm gì.' },
  { id: 'q2', question: '"-지 마세요" dùng để?', options: ['Yêu cầu làm gì đó', 'Cấm/khuyên đừng làm gì đó', 'Hỏi lý do', 'So sánh hai vật'], correctIndex: 1, explanation: '-지 마세요 = đừng làm (mệnh lệnh phủ định lịch sự).' },
  { id: 'q3', question: '"답답하다" nghĩa gần nhất là?', options: ['Vui vẻ', 'Bực bội/ngột ngạt', 'Đói bụng', 'Buồn ngủ'], correctIndex: 1, explanation: '답답하다 diễn tả cảm giác bực bội, ngột ngạt, không thoải mái.' },
]);

const c4 = doc('klp401-4-1-work-study-plans', '4.1 — Work, study & plans|||4.1 — Công việc, học tập & kế hoạch',
  'Dự định -(으)려고 하다, mục đích -기 위해서, quyết định -기로 하다; từ vựng xin việc (이력서, 면접, 마감일).',
  [[
    `<span class="eyebrow">KLP401 · Chapter 4 · Lesson 4.1</span>
<h2>Work, study &amp; plans</h2>
<h3>Intending to do something: -(으)려고 하다</h3>
<pre><code>내년에 유학을 가려고 해요.
nae-nyeon-e yu-hag-eul ga-ryeo-go hae-yo.
= I am planning to study abroad next year.
</code></pre>
<h3>Purpose: -기 위해서</h3>
<pre><code>취업하기 위해서 자격증을 땄어요.
chwi-eob-ha-gi wi-hae-seo ja-gyeog-jeung-eul ttass-eo-yo.
= I got a certificate in order to get a job.
</code></pre>
<h3>Deciding: -기로 하다</h3>
<pre><code>회의는 다음 주에 하기로 했어요.
hoe-ui-neun da-eum ju-e ha-gi-ro haess-eo-yo.
= We decided to hold the meeting next week.
</code></pre>
<h3>Work &amp; study vocabulary</h3>
<ul>
<li>이력서 (i-ryeog-seo) = resume/CV</li>
<li>면접 (myeon-jeob) = job interview</li>
<li>마감일 (ma-gam-il) = deadline</li>
<li>승진 (seung-jin) = promotion</li>
</ul>
<div class="callout"><span class="badge">Plan vs decision</span> -(으)려고 하다 states an intention that could still change; -기로 하다 marks a decision already settled — a subtle but common TOPIK distinction.</div>`,
    `<span class="eyebrow">KLP401 · Chương 4 · Bài 4.1</span>
<h2>Công việc, học tập &amp; kế hoạch</h2>
<h3>Dự định: -(으)려고 하다</h3>
<pre><code>내년에 유학을 가려고 해요.
nae-nyeon-e yu-hag-eul ga-ryeo-go hae-yo.
= Sang năm tôi định đi du học.
</code></pre>
<h3>Mục đích: -기 위해서</h3>
<pre><code>취업하기 위해서 자격증을 땄어요.
chwi-eob-ha-gi wi-hae-seo ja-gyeog-jeung-eul ttass-eo-yo.
= Để xin việc, tôi đã lấy chứng chỉ.
</code></pre>
<h3>Quyết định: -기로 하다</h3>
<pre><code>회의는 다음 주에 하기로 했어요.
hoe-ui-neun da-eum ju-e ha-gi-ro haess-eo-yo.
= Đã quyết định họp vào tuần sau.
</code></pre>
<h3>Từ vựng việc làm &amp; học tập</h3>
<ul>
<li>이력서 (i-ryeog-seo) = sơ yếu lý lịch/CV</li>
<li>면접 (myeon-jeob) = phỏng vấn xin việc</li>
<li>마감일 (ma-gam-il) = hạn chót</li>
<li>승진 (seung-jin) = thăng chức</li>
</ul>
<div class="callout"><span class="badge">Dự định vs quyết định</span> -(으)려고 하다 nêu một dự định vẫn có thể đổi; -기로 하다 đánh dấu một quyết định đã chốt — điểm phân biệt tinh tế nhưng hay gặp trong TOPIK.</div>`,
  ]]);

const c4q = quiz('klp401-quiz-4', 'Quiz 4 — Work & plans|||Quiz 4 — Công việc & kế hoạch', [
  { id: 'q1', question: '"내년에 유학을 가려고 해요" nghĩa là?', options: ['Đã đi du học năm ngoái', 'Định đi du học năm sau', 'Không muốn đi du học', 'Đang đi du học'], correctIndex: 1, explanation: '-(으)려고 하다 = dự định làm gì đó.' },
  { id: 'q2', question: 'Cấu trúc nào diễn đạt MỤC ĐÍCH ("để mà")?', options: ['-기로 하다', '-기 위해서', '-는 게 좋다', '-는데'], correctIndex: 1, explanation: '-기 위해서 = để làm được việc gì đó, nêu mục đích.' },
  { id: 'q3', question: 'Khác biệt chính giữa -(으)려고 하다 và -기로 하다 là gì?', options: ['Không khác gì cả', '-(으)려고 하다 là dự định có thể đổi, -기로 하다 là quyết định đã chốt', '-기로 하다 chỉ dùng ở thì tương lai xa', '-(으)려고 하다 chỉ dùng khi phủ định'], correctIndex: 1, explanation: '-(으)려고 하다 = ý định chưa chắc chắn; -기로 하다 = đã quyết định.' },
]);

const c5 = doc('klp401-5-1-society-environment', '5.1 — Society, news & environment|||5.1 — Xã hội, tin tức & môi trường',
  'Tường thuật gián tiếp -다고 하다, thay đổi hoàn cảnh -게 되다, thay thế -는 대신에; từ vựng môi trường (환경 오염, 미세먼지, 재활용).',
  [[
    `<span class="eyebrow">KLP401 · Chapter 5 · Lesson 5.1</span>
<h2>Society, news &amp; environment</h2>
<h3>Reported speech: -다고 하다</h3>
<pre><code>뉴스에서 기온이 올라간다고 해요.
nyu-seu-e-seo gi-on-i ol-la-gan-da-go hae-yo.
= The news says that the temperature is rising.
</code></pre>
<h3>A change of circumstance: -게 되다</h3>
<pre><code>요즘 재활용을 하게 되었어요.
yo-jeum jae-hwal-yong-eul ha-ge doe-eoss-eo-yo.
= These days I have come to recycle (circumstances led to it).
</code></pre>
<h3>Instead of: -는 대신에</h3>
<pre><code>차를 타는 대신에 걸어가요.
cha-reul ta-neun dae-sin-e geol-eo-ga-yo.
= Instead of taking the car, I walk.
</code></pre>
<h3>Environment vocabulary</h3>
<ul>
<li>환경 오염 (hwan-gyeong o-yeom) = environmental pollution</li>
<li>미세먼지 (mi-se-meon-ji) = fine dust</li>
<li>온실가스 (on-sil-ga-seu) = greenhouse gas</li>
<li>재활용 (jae-hwal-yong) = recycling</li>
</ul>
<div class="callout"><span class="badge">Quoting the news</span> -다고 하다 is the everyday way to relay what someone else said or what you read/heard — essential for discussing news and social topics.</div>`,
    `<span class="eyebrow">KLP401 · Chương 5 · Bài 5.1</span>
<h2>Xã hội, tin tức &amp; môi trường</h2>
<h3>Tường thuật gián tiếp: -다고 하다</h3>
<pre><code>뉴스에서 기온이 올라간다고 해요.
nyu-seu-e-seo gi-on-i ol-la-gan-da-go hae-yo.
= Tin tức nói rằng nhiệt độ đang tăng.
</code></pre>
<h3>Thay đổi do hoàn cảnh: -게 되다</h3>
<pre><code>요즘 재활용을 하게 되었어요.
yo-jeum jae-hwal-yong-eul ha-ge doe-eoss-eo-yo.
= Dạo này tôi bắt đầu tái chế (vì hoàn cảnh dẫn đến vậy).
</code></pre>
<h3>Thay vì: -는 대신에</h3>
<pre><code>차를 타는 대신에 걸어가요.
cha-reul ta-neun dae-sin-e geol-eo-ga-yo.
= Thay vì đi xe, tôi đi bộ.
</code></pre>
<h3>Từ vựng môi trường</h3>
<ul>
<li>환경 오염 (hwan-gyeong o-yeom) = ô nhiễm môi trường</li>
<li>미세먼지 (mi-se-meon-ji) = bụi mịn</li>
<li>온실가스 (on-sil-ga-seu) = khí nhà kính</li>
<li>재활용 (jae-hwal-yong) = tái chế</li>
</ul>
<div class="callout"><span class="badge">Trích lại tin tức</span> -다고 하다 là cách thường dùng nhất để thuật lại lời người khác hoặc điều đã đọc/nghe — thiết yếu khi bàn về tin tức và chủ đề xã hội.</div>`,
  ]]);

const c5q = quiz('klp401-quiz-5', 'Quiz 5 — Society & environment|||Quiz 5 — Xã hội & môi trường', [
  { id: 'q1', question: '"-다고 하다" dùng để?', options: ['Hỏi ý kiến người nghe', 'Tường thuật lại lời người khác/tin tức', 'Ra lệnh', 'So sánh hai vật'], correctIndex: 1, explanation: '-다고 하다 = trích dẫn/tường thuật gián tiếp.' },
  { id: 'q2', question: '"미세먼지" nghĩa là?', options: ['Khí nhà kính', 'Bụi mịn', 'Tái chế', 'Ô nhiễm nguồn nước'], correctIndex: 1, explanation: '미세먼지 = bụi mịn, vấn đề môi trường phổ biến ở Hàn Quốc.' },
  { id: 'q3', question: '"차를 타는 대신에 걸어가요" nghĩa là?', options: ['Vừa đi xe vừa đi bộ', 'Thay vì đi xe, tôi đi bộ', 'Không muốn đi xe lẫn đi bộ', 'Đi xe nhanh hơn đi bộ'], correctIndex: 1, explanation: '-는 대신에 = thay vì làm A thì làm B.' },
]);

const c6 = doc('klp401-6-1-culture-festivals', '6.1 — Culture, travel & Korean festivals|||6.1 — Văn hoá, du lịch & lễ hội Hàn Quốc',
  'Trải nghiệm thử -아/어 보다, hồi tưởng -던, lễ hội truyền thống (설날, 추석) & văn hoá du lịch.',
  [[
    `<span class="eyebrow">KLP401 · Chapter 6 · Lesson 6.1</span>
<h2>Culture, travel &amp; Korean festivals</h2>
<h3>Trying something: -아/어 보다</h3>
<pre><code>한복을 입어 봤어요.
han-bog-eul ib-eo bwass-eo-yo.
= I tried wearing a hanbok.
</code></pre>
<h3>Recalling the past: -던</h3>
<pre><code>어릴 때 가던 시장이에요.
eo-ril ttae ga-deon si-jang-i-e-yo.
= This is the market I used to go to as a child.
</code></pre>
<h3>Korean festivals</h3>
<ul>
<li>설날 (seol-lal) = Lunar New Year — people eat 떡국 (tteok-guk, rice cake soup) and perform 세배 (se-bae, a formal bow).</li>
<li>추석 (chu-seok) = Chuseok, the harvest festival — marked by 차례 (cha-rye, ancestral rites) and 송편 (song-pyeon, half-moon rice cakes).</li>
</ul>
<pre><code>추석에 고향에 내려가요.
chu-seog-e go-hyang-e nae-ryeo-ga-yo.
= I go down to my hometown for Chuseok.
</code></pre>
<div class="callout"><span class="badge">Travel small talk</span> -아/어 보다 is the go-to way to describe travel and cultural experiences ("I tried/have tried…") — perfect for trip stories and small talk.</div>`,
    `<span class="eyebrow">KLP401 · Chương 6 · Bài 6.1</span>
<h2>Văn hoá, du lịch &amp; lễ hội Hàn Quốc</h2>
<h3>Trải nghiệm thử: -아/어 보다</h3>
<pre><code>한복을 입어 봤어요.
han-bog-eul ib-eo bwass-eo-yo.
= Tôi đã thử mặc hanbok.
</code></pre>
<h3>Hồi tưởng quá khứ: -던</h3>
<pre><code>어릴 때 가던 시장이에요.
eo-ril ttae ga-deon si-jang-i-e-yo.
= Đây là khu chợ tôi hay đi hồi nhỏ.
</code></pre>
<h3>Lễ hội Hàn Quốc</h3>
<ul>
<li>설날 (seol-lal) = Tết Nguyên đán Hàn Quốc — ăn 떡국 (tteok-guk, canh bánh gạo) và làm 세배 (se-bae, lạy chúc Tết).</li>
<li>추석 (chu-seok) = Chuseok, lễ hội mùa gặt — có 차례 (cha-rye, cúng gia tiên) và 송편 (song-pyeon, bánh gạo hình trăng khuyết).</li>
</ul>
<pre><code>추석에 고향에 내려가요.
chu-seog-e go-hyang-e nae-ryeo-ga-yo.
= Vào Chuseok tôi về quê.
</code></pre>
<div class="callout"><span class="badge">Trò chuyện khi du lịch</span> -아/어 보다 là cách dùng phổ biến nhất để kể trải nghiệm du lịch, văn hoá ("tôi đã thử/từng…") — rất hợp khi kể chuyện chuyến đi hoặc trò chuyện xã giao.</div>`,
  ]]);

const c6q = quiz('klp401-quiz-6', 'Quiz 6 — Culture & festivals|||Quiz 6 — Văn hoá & lễ hội', [
  { id: 'q1', question: '"한복을 입어 봤어요" nghĩa là?', options: ['Tôi sẽ mặc hanbok', 'Tôi đã thử mặc hanbok', 'Tôi không thích hanbok', 'Tôi đang may hanbok'], correctIndex: 1, explanation: '-아/어 보다 = đã thử làm gì đó.' },
  { id: 'q2', question: '"추석" là lễ hội gì?', options: ['Tết Nguyên đán Hàn Quốc', 'Chuseok — lễ hội mùa gặt Hàn Quốc', 'Lễ Phật đản', 'Ngày Quốc khánh Hàn Quốc'], correctIndex: 1, explanation: '추석 = Chuseok, lễ hội mùa gặt với 차례 và bánh 송편.' },
  { id: 'q3', question: '"-던" dùng để?', options: ['Diễn tả tương lai', 'Hồi tưởng việc lặp lại/chưa hoàn tất trong quá khứ', 'Ra lệnh', 'Phủ định hành động'], correctIndex: 1, explanation: '-던 gắn với danh từ để hồi tưởng một việc từng lặp lại hoặc dang dở trong quá khứ.' },
]);

const c7 = doc('klp401-7-1-honorifics', '7.1 — Honorifics & formal register|||7.1 — Kính ngữ & văn phong trang trọng',
  'Kính ngữ chủ ngữ -시-, thể trang trọng -습니다/ㅂ니다, từ kính ngữ đặc biệt (드시다, 계시다, 연세, 성함).',
  [[
    `<span class="eyebrow">KLP401 · Chapter 7 · Lesson 7.1</span>
<h2>Honorifics &amp; formal register</h2>
<h3>Subject honorific -시-</h3>
<pre><code>선생님이 오세요.
seon-saeng-nim-i o-se-yo.
= The teacher is coming. (honorific)
</code></pre>
<h3>Special honorific words</h3>
<table><thead><tr><th>Plain</th><th>Honorific</th></tr></thead><tbody>
<tr><td>먹다/마시다 (eat/drink)</td><td>드시다 (deu-si-da)</td></tr>
<tr><td>있다 (to be/exist)</td><td>계시다 (gye-si-da)</td></tr>
<tr><td>자다 (to sleep)</td><td>주무시다 (ju-mu-si-da)</td></tr>
<tr><td>나이 (age)</td><td>연세 (yeon-se)</td></tr>
<tr><td>이름 (name)</td><td>성함 (seong-ham)</td></tr>
</tbody></table>
<h3>Formal ending -습니다/ㅂ니다</h3>
<pre><code>감사합니다.
gam-sa-ham-ni-da.
= Thank you. (formal, used in presentations, news, TOPIK II)
</code></pre>
<h3>Humble first person</h3>
<p>저 / 저희 (jeo / jeo-hui) — humble "I / we" — replace 나 / 우리 in formal or polite contexts.</p>
<div class="callout"><span class="badge">Who gets honored</span> Korean honors the SUBJECT of the sentence (usually someone older or higher-status), not the listener directly — so -시- attaches to the verb describing that person's action.</div>`,
    `<span class="eyebrow">KLP401 · Chương 7 · Bài 7.1</span>
<h2>Kính ngữ &amp; văn phong trang trọng</h2>
<h3>Kính ngữ chủ ngữ -시-</h3>
<pre><code>선생님이 오세요.
seon-saeng-nim-i o-se-yo.
= Thầy/cô đến. (kính ngữ)
</code></pre>
<h3>Từ kính ngữ đặc biệt</h3>
<table><thead><tr><th>Từ thường</th><th>Từ kính ngữ</th></tr></thead><tbody>
<tr><td>먹다/마시다 (ăn/uống)</td><td>드시다 (deu-si-da)</td></tr>
<tr><td>있다 (có/ở)</td><td>계시다 (gye-si-da)</td></tr>
<tr><td>자다 (ngủ)</td><td>주무시다 (ju-mu-si-da)</td></tr>
<tr><td>나이 (tuổi)</td><td>연세 (yeon-se)</td></tr>
<tr><td>이름 (tên)</td><td>성함 (seong-ham)</td></tr>
</tbody></table>
<h3>Thể trang trọng -습니다/ㅂ니다</h3>
<pre><code>감사합니다.
gam-sa-ham-ni-da.
= Xin cảm ơn. (trang trọng, dùng trong thuyết trình, bản tin, thi TOPIK)
</code></pre>
<h3>Ngôi thứ nhất khiêm nhường</h3>
<p>저 / 저희 (jeo / jeo-hui) — "tôi/chúng tôi" khiêm nhường — thay cho 나 / 우리 trong ngữ cảnh trang trọng, lịch sự.</p>
<div class="callout"><span class="badge">Kính ai, kính thế nào</span> Tiếng Hàn tôn trọng CHỦ NGỮ của câu (thường là người lớn tuổi/địa vị cao hơn), không phải trực tiếp người nghe — nên -시- gắn vào động từ mô tả hành động của người đó.</div>`,
  ]]);

const c7q = quiz('klp401-quiz-7', 'Quiz 7 — Honorifics|||Quiz 7 — Kính ngữ', [
  { id: 'q1', question: 'Từ kính ngữ của "먹다/마시다" là?', options: ['계시다', '드시다', '주무시다', '성함'], correctIndex: 1, explanation: '드시다 là kính ngữ của 먹다 (ăn) và 마시다 (uống).' },
  { id: 'q2', question: '"-습니다/ㅂ니다" là thể như thế nào?', options: ['Thân mật suồng sã', 'Trang trọng lịch sự (dùng trong bài phát biểu, thi TOPIK)', 'Ra lệnh', 'Nghi vấn thân mật'], correctIndex: 1, explanation: '-습니다/ㅂ니다 là thể trang trọng, khác với -아요/어요 thân mật hơn.' },
  { id: 'q3', question: 'Kính ngữ -시- trong tiếng Hàn tôn trọng ai?', options: ['Người nghe luôn luôn', 'Chủ ngữ của câu (thường lớn tuổi/địa vị cao hơn)', 'Người nói', 'Không tôn trọng ai cả'], correctIndex: 1, explanation: '-시- gắn với động từ để tôn trọng người làm chủ ngữ của câu.' },
]);

const c8 = doc('klp401-8-1-review-topik', '8.1 — Review: dialogue & TOPIK II paragraph writing|||8.1 — Ôn tập: hội thoại & viết đoạn văn TOPIK II',
  'Ôn ngữ pháp chương 1-7 qua hội thoại tổng hợp; cấu trúc viết đoạn TOPIK II (원고지, mở-thân-kết, câu 51-54).',
  [[
    `<span class="eyebrow">KLP401 · Chapter 8 · Lesson 8.1</span>
<h2>Review: dialogue &amp; TOPIK II paragraph writing</h2>
<h3>Grammar review</h3>
<table><thead><tr><th>Chapter</th><th>Key grammar</th></tr></thead><tbody>
<tr><td>1</td><td>-았/었-, -는데, -(으)ㄴ/는 적이 있다</td></tr>
<tr><td>2</td><td>-보다, -는 게 좋다, -것 같다, -(으)ㄹ까요?</td></tr>
<tr><td>3</td><td>-아/어야 하다, -지 마세요</td></tr>
<tr><td>4</td><td>-(으)려고 하다, -기 위해서, -기로 하다</td></tr>
<tr><td>5</td><td>-다고 하다, -게 되다, -는 대신에</td></tr>
<tr><td>6</td><td>-아/어 보다, -던</td></tr>
<tr><td>7</td><td>-시-, -습니다/ㅂ니다, honorific vocabulary</td></tr>
</tbody></table>
<h3>Combined dialogue</h3>
<pre><code>A: 어제 뭐 했어요?
   eo-je mwo haess-eo-yo?
   = What did you do yesterday?
B: 친구를 만났는데 같이 영화를 봤어요. 정말 재미있었어요.
   chin-gu-reul man-nass-neun-de gat-i yeong-hwa-reul bwass-eo-yo. jeongmal jaemi-iss-eoss-eo-yo.
   = I met a friend, and we watched a movie together. It was really fun.
A: 저도 그 영화 보고 싶어요. 주말에 볼까요?
   jeo-do geu yeong-hwa bo-go sip-eo-yo. ju-mal-e bol-kka-yo?
   = I want to watch that movie too. Shall we watch it this weekend?
</code></pre>
<h3>TOPIK II paragraph writing (쓰기)</h3>
<p>Questions 51-54 ask you to fill blanks or write a short/long paragraph. Structure it in three parts: <strong>opening</strong> (topic sentence), <strong>body</strong> (2-3 supporting sentences with reasons or examples, using connectors such as -아서/어서, -는데, -기 때문에), and <strong>closing</strong> (a summarizing sentence). Write on 원고지 (squared writing paper) in formal -습니다/ㅂ니다 style, and check spacing (띄어쓰기) and spelling (맞춤법) carefully — TOPIK II grades both content and accuracy.</p>
<div class="callout"><span class="badge">Exam tip</span> Reuse the grammar from Chapters 1-7 inside your TOPIK II paragraph — an answer that naturally mixes -는데, -기 때문에 and -(으)ㄹ 것 같다 scores higher than one using only simple sentences.</div>`,
    `<span class="eyebrow">KLP401 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập: hội thoại &amp; viết đoạn văn TOPIK II</h2>
<h3>Ôn tập ngữ pháp</h3>
<table><thead><tr><th>Chương</th><th>Ngữ pháp trọng tâm</th></tr></thead><tbody>
<tr><td>1</td><td>-았/었-, -는데, -(으)ㄴ/는 적이 있다</td></tr>
<tr><td>2</td><td>-보다, -는 게 좋다, -것 같다, -(으)ㄹ까요?</td></tr>
<tr><td>3</td><td>-아/어야 하다, -지 마세요</td></tr>
<tr><td>4</td><td>-(으)려고 하다, -기 위해서, -기로 하다</td></tr>
<tr><td>5</td><td>-다고 하다, -게 되다, -는 대신에</td></tr>
<tr><td>6</td><td>-아/어 보다, -던</td></tr>
<tr><td>7</td><td>-시-, -습니다/ㅂ니다, từ vựng kính ngữ</td></tr>
</tbody></table>
<h3>Hội thoại tổng hợp</h3>
<pre><code>A: 어제 뭐 했어요?
   eo-je mwo haess-eo-yo?
   = Hôm qua bạn làm gì?
B: 친구를 만났는데 같이 영화를 봤어요. 정말 재미있었어요.
   chin-gu-reul man-nass-neun-de gat-i yeong-hwa-reul bwass-eo-yo. jeongmal jaemi-iss-eoss-eo-yo.
   = Tôi gặp bạn, và bọn tôi xem phim cùng nhau. Phim thật sự rất hay.
A: 저도 그 영화 보고 싶어요. 주말에 볼까요?
   jeo-do geu yeong-hwa bo-go sip-eo-yo. ju-mal-e bol-kka-yo?
   = Tôi cũng muốn xem phim đó. Cuối tuần mình xem nhé?
</code></pre>
<h3>Viết đoạn văn TOPIK II (쓰기)</h3>
<p>Câu 51-54 yêu cầu điền chỗ trống hoặc viết một đoạn văn ngắn/dài. Hãy chia đoạn thành ba phần: <strong>mở đoạn</strong> (câu chủ đề), <strong>thân đoạn</strong> (2-3 câu triển khai lý do/ví dụ, dùng từ nối như -아서/어서, -는데, -기 때문에), và <strong>kết đoạn</strong> (câu tổng kết). Viết trên 원고지 (giấy viết ô vuông) theo văn phong trang trọng -습니다/ㅂ니다, và kiểm tra kỹ cách viết cách (띄어쓰기) cùng chính tả (맞춤법) — TOPIK II chấm cả nội dung lẫn độ chính xác.</p>
<div class="callout"><span class="badge">Mẹo khi thi</span> Tận dụng lại ngữ pháp từ Chương 1-7 trong đoạn văn TOPIK II — một bài viết pha trộn tự nhiên -는데, -기 때문에 và -(으)ㄹ 것 같다 sẽ được điểm cao hơn một bài chỉ dùng câu đơn.</div>`,
  ]]);

const c8q = quiz('klp401-quiz-8', 'Quiz 8 — Review & TOPIK II|||Quiz 8 — Ôn tập & TOPIK II', [
  { id: 'q1', question: 'TOPIK II câu 51-54 kiểm tra kỹ năng nào?', options: ['Nghe', 'Nói', 'Viết (쓰기)', 'Đọc'], correctIndex: 2, explanation: 'Câu 51-54 thuộc phần 쓰기 (viết) của TOPIK II.' },
  { id: 'q2', question: 'Đoạn văn TOPIK II nên có cấu trúc?', options: ['Chỉ một câu duy nhất', 'Mở đoạn - Thân đoạn - Kết đoạn', 'Toàn câu hỏi', 'Không cần cấu trúc rõ ràng'], correctIndex: 1, explanation: 'Cấu trúc ba phần giúp bài viết mạch lạc, dễ chấm điểm cao.' },
  { id: 'q3', question: '"원고지" là gì?', options: ['Từ điển tiếng Hàn', 'Giấy viết ô vuông dùng khi viết luận/thi', 'Đề thi nghe', 'Sách ngữ pháp'], correctIndex: 1, explanation: '원고지 là giấy kẻ ô vuông chuẩn dùng để viết bài luận/thi TOPIK II.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'KLP401',
    slug: 'klp401-korean-language-practice',
    title: 'Korean Language Practice',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KLP401.webp',
    shortDescription: 'Intermediate integrated Korean practice (TOPIK 3-4): storytelling, comparison & opinion, health & advice, work & plans, society & environment, culture & festivals, honorifics, TOPIK II writing. Hangeul, romanization & quizzes.|||Thực hành tiếng Hàn tổng hợp trung cấp (TOPIK 3-4): kể chuyện, so sánh & ý kiến, sức khoẻ, công việc & kế hoạch, xã hội & môi trường, văn hoá & lễ hội, kính ngữ, viết đoạn TOPIK II. Có Hangeul, phiên âm & quiz.',
    description: 'Môn <strong>KLP401 — Korean Language Practice</strong> (kỳ 5, ngành Ngôn ngữ Hàn) là thực hành tổng hợp trình độ trung cấp <strong>TOPIK 3-4</strong>, tích hợp nghe-nói-đọc-viết qua tám chủ đề: <strong>kể chuyện &amp; trải nghiệm</strong> (-았/었-, -는데) → <strong>so sánh, lựa chọn &amp; ý kiến</strong> (-보다, -는 게 좋다) → <strong>sức khoẻ, cảm xúc &amp; lời khuyên</strong> (-어야 하다, -지 마세요) → <strong>công việc, học tập &amp; kế hoạch</strong> (-려고 하다, -기 위해서) → <strong>xã hội, tin tức &amp; môi trường</strong> → <strong>văn hoá, du lịch &amp; lễ hội Hàn Quốc</strong> → <strong>kính ngữ &amp; văn phong trang trọng</strong> (높임말, -습니다) → <strong>ôn tập</strong>: hội thoại &amp; viết đoạn TOPIK II. Tham khảo cấu trúc giáo trình 서울대 한국어 3-4, 이화 한국어 (Ewha Korean) 3 và định dạng đề TOPIK II; song ngữ, có chữ Hàn (Hangeul + phiên âm) và quiz mỗi chương.',
    whatYouLearn: 'Quá khứ -았/었-, vế nền -는데, kinh nghiệm -(으)ㄴ/는 적이 있다; so sánh -보다, gợi ý -는 게 좋다, phỏng đoán -것 같다, đề nghị -(으)ㄹ까요?; bắt buộc -아/어야 하다, cấm đoán -지 마세요, từ vựng sức khoẻ & cảm xúc; dự định -(으)려고 하다, mục đích -기 위해서, quyết định -기로 하다; tường thuật -다고 하다, -게 되다, -는 대신에, từ vựng môi trường; trải nghiệm -아/어 보다, -던, lễ hội 설날/추석; kính ngữ -시-, -습니다/ㅂ니다, từ kính ngữ đặc biệt; cấu trúc viết đoạn TOPIK II.',
    requirements: 'Đã học tiếng Hàn sơ-trung cấp (Hangeul, ngữ pháp cơ bản, khoảng TOPIK 2). Nên ôn từ vựng chủ đề đời sống trước khi vào môn.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Trung cấp TOPIK 3-4, tích hợp bốn kỹ năng qua 8 chủ đề.', lessons: [intro] },
    { title: 'Chương 1 — Kể chuyện & trải nghiệm|||Chapter 1 — Storytelling & experience', description: 'Quá khứ, vế nền -는데, kinh nghiệm.', lessons: [c1, c1q] },
    { title: 'Chương 2 — So sánh, lựa chọn & ý kiến|||Chapter 2 — Comparison, choice & opinion', description: 'So sánh -보다, gợi ý, phỏng đoán, đề nghị.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Sức khoẻ, cảm xúc & lời khuyên|||Chapter 3 — Health, emotions & advice', description: 'Triệu chứng, bắt buộc, cấm đoán, cảm xúc.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Công việc, học tập & kế hoạch|||Chapter 4 — Work, study & plans', description: 'Dự định, mục đích, quyết định.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Xã hội, tin tức & môi trường|||Chapter 5 — Society, news & environment', description: 'Tường thuật gián tiếp, thay đổi hoàn cảnh, môi trường.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Văn hoá, du lịch & lễ hội Hàn Quốc|||Chapter 6 — Culture, travel & Korean festivals', description: 'Trải nghiệm thử, hồi tưởng, 설날/추석.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Kính ngữ & văn phong trang trọng|||Chapter 7 — Honorifics & formal register', description: 'Kính ngữ chủ ngữ, thể trang trọng, từ đặc biệt.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập: hội thoại & viết TOPIK II|||Chapter 8 — Review: dialogue & TOPIK II writing', description: 'Ôn ngữ pháp, hội thoại tổng hợp, cấu trúc viết TOPIK II.', lessons: [c8, c8q] },
  ],
};
