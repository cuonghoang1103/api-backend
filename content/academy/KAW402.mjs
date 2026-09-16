/**
 * KAW402 — Academic Korean Writing / Viết tiếng Hàn học thuật. Trích dẫn giáo
 * trình (KHÔNG upload PDF): "대학 글쓰기 (Academic Writing)"; "유학생을 위한
 * 한국어 글쓰기"; TOPIK II 쓰기. 8 chương: văn phong học thuật (문어체/구어체) →
 * câu & đoạn văn → cấu trúc luận (서론-본론-결론) → trích dẫn & khách quan
 * (인용, -다고 하다) → miêu tả/giải thích (설명문) → nghị luận (논설문) → tóm
 * tắt/báo cáo (요약, 보고서) → sửa lỗi & luyện TOPIK II 쓰기 (원고지, 51-54).
 * Trình độ TOPIK 4-5. Song ngữ VI + Hangeul (Hangul) + romaja. Giữ NGUYÊN
 * slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('kaw402-0-1-overview', 'Course overview: Academic Korean Writing|||Tổng quan: Viết tiếng Hàn học thuật',
  'Từ nói sang viết học thuật ở trình độ TOPIK 4-5: văn phong (문어체) → câu/đoạn văn → cấu trúc luận (서론-본론-결론) → trích dẫn khách quan → miêu tả/nghị luận/tóm tắt → luyện TOPIK II 쓰기.',
  [[
    `<span class="eyebrow">KAW402 · Lesson 0.1 · Overview</span>
<h2>Academic Korean Writing</h2>
<p class="lead">This course trains you to write <strong>formal, objective Korean text</strong> at TOPIK level 4–5 — the jump from "can speak/write casually" to "can write like a student essay or short paper." You'll master the written register (문어체), build clear sentences and paragraphs, learn the intro-body-conclusion essay shape, cite sources objectively, write descriptive and argumentative texts, and finish drilling TOPIK II Writing (쓰기, questions 51–54).</p>
<h3>Why this is hard even at TOPIK 4–5</h3>
<p>Fluent spoken Korean does not transfer directly to writing. Academic Korean drops polite -요 endings for the plain -다 form, avoids vague hedges like "~것 같아요", and prefers objective phrasing ("~것으로 보인다" instead of "제 생각에는"). This course makes that hidden register explicit, sentence by sentence.</p>
<h3>Roadmap</h3>
<p>Written vs spoken style (문어체/구어체) → sentence &amp; paragraph construction (문장/단락 구성) → essay structure (서론-본론-결론) → citation &amp; objectivity (인용, -다고 하다) → descriptive/explanatory writing (설명문) → argumentative writing (논설문) → summaries, reports &amp; outlines (요약, 보고서) → editing &amp; TOPIK II 쓰기 practice (원고지, câu 51–54).</p>`,
    `<span class="eyebrow">KAW402 · Bài 0.1 · Tổng quan</span>
<h2>Viết tiếng Hàn học thuật</h2>
<p class="lead">Môn này luyện bạn viết <strong>văn bản tiếng Hàn trang trọng, khách quan</strong> ở trình độ TOPIK 4-5 — bước nhảy từ "nói/viết được" sang "viết được như một bài luận/tiểu luận". Bạn sẽ nắm văn phong viết (문어체), dựng câu và đoạn văn rõ ràng, học khung bài luận mở-thân-kết, trích dẫn nguồn khách quan, viết văn miêu tả và nghị luận, rồi kết thúc bằng luyện đề TOPIK II Viết (쓰기, câu 51–54).</p>
<h3>Vì sao vẫn khó dù đã TOPIK 4-5</h3>
<p>Tiếng Hàn nói trôi chảy KHÔNG tự động chuyển thành văn viết học thuật. Tiếng Hàn học thuật bỏ đuôi lịch sự -요 để dùng thể nguyên -다, tránh cách nói mơ hồ kiểu "~것 같아요", và ưu tiên cách diễn đạt khách quan ("~것으로 보인다" thay vì "제 생각에는"). Môn này làm rõ thứ văn phong ẩn đó, từng câu một.</p>
<h3>Lộ trình</h3>
<p>Văn viết vs văn nói (문어체/구어체) → dựng câu &amp; đoạn văn (문장/단락 구성) → cấu trúc bài luận (서론-본론-결론) → trích dẫn &amp; khách quan (인용, -다고 하다) → viết miêu tả/giải thích (설명문) → viết nghị luận (논설문) → tóm tắt, báo cáo &amp; đề cương (요약, 보고서) → sửa lỗi &amp; luyện TOPIK II 쓰기 (원고지, câu 51–54).</p>`,
  ]]);

const c1 = doc('kaw402-1-1-munoche', '1.1 — Written vs spoken style (문어체 vs 구어체)|||1.1 — Văn phong học thuật: văn viết vs văn nói (문어체 vs 구어체)',
  'Đuôi câu -다 (plain) thay -요; bỏ 나/제 생각에는 dùng 필자는/본고에서는; bỏ hedge 것 같아요 dùng 것으로 보인다; bảng đối chiếu khẩu ngữ↔văn viết.',
  [[
    `<span class="eyebrow">KAW402 · Chapter 1 · Lesson 1.1</span>
<h2>Written vs spoken style (문어체 vs 구어체)</h2>
<p class="lead">Academic Korean uses a distinct register called <strong>문어체</strong> (written style) — different from the <strong>구어체</strong> (spoken style) you use in conversation, even at an advanced level.</p>
<h3>The core shift: plain ending -다</h3>
<p>Essays, reports and TOPIK II Writing use the <strong>plain declarative ending -다</strong> (다/-ㄴ다/-는다), not the polite -아요/어요 or even -습니다. -습니다 is formal <em>spoken</em> style (speeches, presentations); -다 is the neutral, objective <em>written</em> style expected in academic text.</p>
<table><thead><tr><th>Spoken (구어체)</th><th>Academic written (문어체)</th><th>Meaning</th></tr></thead><tbody>
<tr><td>나, 제 생각에는</td><td>필자는, 본고에서는</td><td>I / in my view → the writer, this paper</td></tr>
<tr><td>되게, 진짜, 완전</td><td>매우, 상당히, 대단히</td><td>very</td></tr>
<tr><td>근데</td><td>그러나, 하지만</td><td>but</td></tr>
<tr><td>그래서</td><td>따라서, 그러므로</td><td>so, therefore</td></tr>
<tr><td>~것 같아요</td><td>~것으로 보인다, ~라고 판단된다</td><td>it seems / it is judged that</td></tr>
<tr><td>-예요/-이에요, -해요</td><td>-이다, -하다 (plain -다 form)</td><td>polite spoken ending → plain written ending</td></tr>
</tbody></table>
<h3>Example transformation</h3>
<pre><code>Spoken:
 저는 이 문제가 되게 심각한 것 같아요.
 jeo-neun i munje-ga doege simgak-han geot gata-yo.
 = I think this problem is pretty serious.

Academic written:
 이 문제는 매우 심각한 것으로 보인다.
 i munje-neun maeu simgak-han geoseu-ro boin-da.
 = This problem appears to be very serious.
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> If a sentence would sound natural spoken out loud with rising intonation and -요, it is probably still 구어체 — rewrite it with -다 and an objective hedge before it goes in an essay.</div>`,
    `<span class="eyebrow">KAW402 · Chương 1 · Bài 1.1</span>
<h2>Văn viết vs văn nói (문어체 vs 구어체)</h2>
<p class="lead">Tiếng Hàn học thuật dùng một văn phong riêng gọi là <strong>문어체</strong> (văn viết) — khác với <strong>구어체</strong> (văn nói) bạn dùng khi trò chuyện, dù trình độ đã cao.</p>
<h3>Bước chuyển cốt lõi: đuôi nguyên -다</h3>
<p>Bài luận, báo cáo và TOPIK II Viết dùng <strong>đuôi trần thuật nguyên -다</strong> (다/-ㄴ다/-는다), KHÔNG dùng đuôi lịch sự -아요/어요 và cũng không hẳn -습니다. -습니다 là văn phong trang trọng khi <em>nói</em> (bài phát biểu, thuyết trình); -다 mới là văn phong trung tính, khách quan mà văn bản học thuật yêu cầu.</p>
<table><thead><tr><th>Văn nói (구어체)</th><th>Văn viết học thuật (문어체)</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>나, 제 생각에는</td><td>필자는, 본고에서는</td><td>tôi / theo tôi → người viết, bài viết này</td></tr>
<tr><td>되게, 진짜, 완전</td><td>매우, 상당히, 대단히</td><td>rất</td></tr>
<tr><td>근데</td><td>그러나, 하지만</td><td>nhưng</td></tr>
<tr><td>그래서</td><td>따라서, 그러므로</td><td>do đó, vì vậy</td></tr>
<tr><td>~것 같아요</td><td>~것으로 보인다, ~라고 판단된다</td><td>có vẻ như / được đánh giá là</td></tr>
<tr><td>-예요/-이에요, -해요</td><td>-이다, -하다 (thể nguyên -다)</td><td>đuôi lịch sự khi nói → đuôi nguyên khi viết</td></tr>
</tbody></table>
<h3>Ví dụ chuyển đổi</h3>
<pre><code>Văn nói:
 저는 이 문제가 되게 심각한 것 같아요.
 jeo-neun i munje-ga doege simgak-han geot gata-yo.
 = Tôi thấy vấn đề này khá nghiêm trọng.

Văn viết học thuật:
 이 문제는 매우 심각한 것으로 보인다.
 i munje-neun maeu simgak-han geoseu-ro boin-da.
 = Vấn đề này có vẻ rất nghiêm trọng.
</code></pre>
<div class="callout"><span class="badge">Mẹo nhận biết</span> Nếu một câu đọc lên nghe tự nhiên với ngữ điệu lên giọng và đuôi -요, nó vẫn là 구어체 — hãy viết lại bằng -다 và một cách diễn đạt khách quan trước khi đưa vào bài luận.</div>`,
  ]]);

const c1q = quiz('kaw402-quiz-1', 'Quiz 1 — Written vs spoken style|||Quiz 1 — Văn viết vs văn nói', [
  { id: 'q1', question: 'Văn phong học thuật tiếng Hàn (문어체) dùng đuôi câu chuẩn nào?', options: ['-아요/어요', '-다 (thể nguyên/plain)', '-죠', '-잖아요'], correctIndex: 1, explanation: 'Bài luận/báo cáo/TOPIK II Viết dùng thể nguyên -다, không dùng -요.' },
  { id: 'q2', question: 'Thay vì viết "제 생각에는" trong bài luận học thuật, nên dùng cách nào?', options: ['저는', '본고에서는 / 필자는', '니가', '우리끼리'], correctIndex: 1, explanation: '본고에서는/필자는 là cách xưng "người viết/bài viết này" trung tính, khách quan.' },
  { id: 'q3', question: 'Cách diễn đạt khách quan thay cho hedge khẩu ngữ "~것 같아요" là gì?', options: ['~것으로 보인다', '~잖아요', '~거든요', '~던데요'], correctIndex: 0, explanation: '~것으로 보인다 / ~라고 판단된다 là cách hedge khách quan, đúng văn phong 문어체.' },
]);

const c2 = doc('kaw402-2-1-munjang-dallak', '2.1 — Academic sentences & paragraphs (문장/단락 구성)|||2.1 — Câu & đoạn văn học thuật (문장/단락 구성)',
  'Câu ngắn gọn (간결체) tránh 만연체; từ nối 그러나/따라서/왜냐하면/예를 들어/즉/반면에; đoạn = câu chủ đề (소주제문) + câu triển khai; nguyên tắc thống nhất & liên kết.',
  [[
    `<span class="eyebrow">KAW402 · Chapter 2 · Lesson 2.1</span>
<h2>Academic sentences &amp; paragraphs (문장/단락 구성)</h2>
<h3>One sentence, one idea</h3>
<p>Academic Korean favors <strong>간결체</strong> (concise style): one clear idea per sentence, subject–object–predicate order, predicate last. Avoid <strong>만연체</strong> — long, over-linked sentences that pile up three or four clauses with -고/-며/-아서, which blur which idea is the point.</p>
<h3>Connectors (접속 표현)</h3>
<table><thead><tr><th>Connector</th><th>Relation</th><th>Meaning</th></tr></thead><tbody>
<tr><td>그러나 / 하지만</td><td>contrast</td><td>but, however</td></tr>
<tr><td>따라서 / 그러므로</td><td>result</td><td>therefore, thus</td></tr>
<tr><td>왜냐하면 ~ 때문이다</td><td>reason</td><td>because ~</td></tr>
<tr><td>예를 들어</td><td>example</td><td>for example</td></tr>
<tr><td>즉</td><td>restatement</td><td>that is, in other words</td></tr>
<tr><td>반면에</td><td>contrast (parallel)</td><td>on the other hand</td></tr>
<tr><td>뿐만 아니라</td><td>addition</td><td>not only ~ but also</td></tr>
</tbody></table>
<h3>Paragraph shape</h3>
<p>A paragraph opens with a <strong>topic sentence (소주제문)</strong> stating its one main idea, then 2–4 <strong>supporting sentences (뒷받침 문장)</strong> with reasons or examples. Two rules govern it: <strong>통일성</strong> (unity — stick to one idea per paragraph) and <strong>응집성</strong> (coherence — link sentences with connectors so the logic is visible).</p>
<pre><code>온라인 학습은 여러 장점을 가지고 있다.
on-lain hakseub-eun yeoreo jangjeom-eul gajigo itda.
= Online learning has several advantages. (topic sentence)

첫째, 시간과 장소의 제약이 없어 원하는 때에 공부할 수 있다.
= First, there are no time/place limits, so learners can study when they want.
둘째, 반복 학습이 가능하여 이해도를 높일 수 있다.
= Second, repeated study is possible, raising comprehension.
따라서 온라인 학습은 전통적 수업의 좋은 대안이 될 수 있다.
= Therefore, online learning can be a good alternative to traditional classes.
</code></pre>`,
    `<span class="eyebrow">KAW402 · Chương 2 · Bài 2.1</span>
<h2>Câu &amp; đoạn văn học thuật (문장/단락 구성)</h2>
<h3>Mỗi câu, một ý</h3>
<p>Tiếng Hàn học thuật ưa <strong>간결체</strong> (văn phong súc tích): mỗi câu chỉ mang một ý rõ ràng, theo trật tự chủ ngữ–tân ngữ–vị ngữ, vị ngữ đứng cuối. Tránh <strong>만연체</strong> — câu dài, nối lê thê với -고/-며/-아서 chồng ba bốn mệnh đề, khiến không rõ ý chính nằm ở đâu.</p>
<h3>Từ nối (접속 표현)</h3>
<table><thead><tr><th>Từ nối</th><th>Quan hệ</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>그러나 / 하지만</td><td>tương phản</td><td>nhưng, tuy nhiên</td></tr>
<tr><td>따라서 / 그러므로</td><td>kết quả</td><td>do đó, vì vậy</td></tr>
<tr><td>왜냐하면 ~ 때문이다</td><td>nguyên nhân</td><td>bởi vì ~</td></tr>
<tr><td>예를 들어</td><td>ví dụ</td><td>ví dụ như</td></tr>
<tr><td>즉</td><td>diễn giải lại</td><td>tức là, nói cách khác</td></tr>
<tr><td>반면에</td><td>tương phản song song</td><td>trong khi đó, mặt khác</td></tr>
<tr><td>뿐만 아니라</td><td>bổ sung</td><td>không những ~ mà còn</td></tr>
</tbody></table>
<h3>Cấu trúc đoạn văn</h3>
<p>Đoạn văn mở đầu bằng <strong>câu chủ đề (소주제문)</strong> nêu một ý chính duy nhất, tiếp theo là 2-4 <strong>câu triển khai (뒷받침 문장)</strong> đưa lý do hoặc ví dụ. Hai nguyên tắc chi phối: <strong>통일성</strong> (tính thống nhất — mỗi đoạn chỉ một ý) và <strong>응집성</strong> (tính liên kết — nối các câu bằng từ nối để mạch logic hiện rõ).</p>
<pre><code>온라인 학습은 여러 장점을 가지고 있다.
on-lain hakseub-eun yeoreo jangjeom-eul gajigo itda.
= Học trực tuyến có nhiều ưu điểm. (câu chủ đề)

첫째, 시간과 장소의 제약이 없어 원하는 때에 공부할 수 있다.
= Thứ nhất, không bị giới hạn thời gian/không gian nên học được lúc muốn.
둘째, 반복 학습이 가능하여 이해도를 높일 수 있다.
= Thứ hai, có thể học lại nhiều lần nên tăng khả năng hiểu.
따라서 온라인 학습은 전통적 수업의 좋은 대안이 될 수 있다.
= Do đó, học trực tuyến có thể là lựa chọn thay thế tốt cho lớp học truyền thống.
</code></pre>`,
  ]]);

const c2q = quiz('kaw402-quiz-2', 'Quiz 2 — Sentences & paragraphs|||Quiz 2 — Câu & đoạn văn', [
  { id: 'q1', question: 'Từ nối "그러므로" dùng để diễn đạt quan hệ gì?', options: ['Nguyên nhân → kết quả (do đó)', 'Tương phản (nhưng)', 'Đưa ví dụ', 'Bổ sung thêm ý'], correctIndex: 0, explanation: '그러므로/따라서 nối nguyên nhân với kết quả, nghĩa "do đó/vì vậy".' },
  { id: 'q2', question: 'Câu chủ đề (소주제문) của một đoạn văn học thuật nên đặt ở đâu và làm gì?', options: ['Cuối đoạn, tóm lược lại', 'Đầu đoạn, nêu ý chính của cả đoạn', 'Giữa đoạn, không liên quan các câu khác', 'Không cần có câu chủ đề'], correctIndex: 1, explanation: 'Câu chủ đề mở đầu đoạn, nêu ý chính; các câu sau triển khai/hỗ trợ nó.' },
  { id: 'q3', question: 'Nguyên tắc "통일성" (tính thống nhất) của đoạn văn nghĩa là gì?', options: ['Mỗi đoạn chỉ triển khai một ý chính duy nhất', 'Câu càng dài càng tốt', 'Không cần dùng từ nối', 'Mỗi câu nói về một chủ đề khác nhau'], correctIndex: 0, explanation: '통일성 = một đoạn, một ý; lạc sang ý khác thì phải tách đoạn mới.' },
]);

const c3 = doc('kaw402-3-1-seoron-bonron-gyeolron', '3.1 — Essay structure: intro-body-conclusion (서론-본론-결론)|||3.1 — Cấu trúc bài luận: mở-thân-kết (서론-본론-결론)',
  'Ba phần chuẩn: 서론 nêu vấn đề & mục đích, 본론 luận điểm + luận cứ + ví dụ (첫째/둘째/셋째), 결론 tóm tắt + đề xuất; mẫu câu khuôn cho mỗi phần.',
  [[
    `<span class="eyebrow">KAW402 · Chapter 3 · Lesson 3.1</span>
<h2>Essay structure: intro-body-conclusion (서론-본론-결론)</h2>
<p class="lead">Every academic Korean essay — from a class assignment to TOPIK II question 54 — follows the same three-part shape.</p>
<table><thead><tr><th>Part</th><th>Function</th><th>Template phrases</th></tr></thead><tbody>
<tr><td><strong>서론</strong> (intro)</td><td>Raise the topic, state purpose &amp; scope</td><td>"본고에서는 ~에 대해 살펴보고자 한다." / "최근 ~이/가 사회적 문제로 대두되고 있다."</td></tr>
<tr><td><strong>본론</strong> (body)</td><td>Claims + evidence + examples, organized</td><td>"첫째, ~. 둘째, ~. 셋째, ~." / "우선 ~. 또한 ~. 마지막으로 ~."</td></tr>
<tr><td><strong>결론</strong> (conclusion)</td><td>Summarize + closing judgment/proposal</td><td>"지금까지 살펴본 바와 같이 ~다." / "따라서 ~할 필요가 있다."</td></tr>
</tbody></table>
<h3>Mini outline example — topic: teen smartphone use (청소년의 스마트폰 사용)</h3>
<pre><code>서론: 최근 청소년의 스마트폰 사용 시간이 크게 늘어나고 있다.
      본고에서는 그 원인과 해결 방안에 대해 살펴보고자 한다.

본론: 첫째, 스마트폰 의존의 원인은 또래 관계와 오락 콘텐츠에 있다.
      둘째, 그 결과 학습 집중력 저하와 수면 부족 문제가 발생한다.
      셋째, 사용 시간 제한 앱과 가정 내 규칙이 대안이 될 수 있다.

결론: 지금까지 살펴본 바와 같이 청소년의 스마트폰 사용은
      가정과 학교가 함께 관리할 필요가 있다.
</code></pre>
<div class="callout"><span class="badge">Signal phrases</span> "본고에서는 ~고자 한다" always signals 서론; "지금까지 살펴본 바와 같이" always signals 결론 — recognizing these templates instantly tells you which part of an essay you're reading (or should be writing).</div>`,
    `<span class="eyebrow">KAW402 · Chương 3 · Bài 3.1</span>
<h2>Cấu trúc bài luận: mở-thân-kết (서론-본론-결론)</h2>
<p class="lead">Mọi bài luận tiếng Hàn học thuật — từ bài tập trên lớp đến câu 54 TOPIK II — đều theo cùng một khung ba phần.</p>
<table><thead><tr><th>Phần</th><th>Chức năng</th><th>Mẫu câu khuôn</th></tr></thead><tbody>
<tr><td><strong>서론</strong> (mở bài)</td><td>Nêu vấn đề, mục đích &amp; phạm vi</td><td>"본고에서는 ~에 대해 살펴보고자 한다." / "최근 ~이/가 사회적 문제로 대두되고 있다."</td></tr>
<tr><td><strong>본론</strong> (thân bài)</td><td>Luận điểm + luận cứ + ví dụ, có tổ chức</td><td>"첫째, ~. 둘째, ~. 셋째, ~." / "우선 ~. 또한 ~. 마지막으로 ~."</td></tr>
<tr><td><strong>결론</strong> (kết bài)</td><td>Tóm tắt + nhận định/đề xuất khép lại</td><td>"지금까지 살펴본 바와 같이 ~다." / "따라서 ~할 필요가 있다."</td></tr>
</tbody></table>
<h3>Ví dụ dàn ý — chủ đề: thanh thiếu niên dùng smartphone (청소년의 스마트폰 사용)</h3>
<pre><code>서론: 최근 청소년의 스마트폰 사용 시간이 크게 늘어나고 있다.
      본고에서는 그 원인과 해결 방안에 대해 살펴보고자 한다.
      (Gần đây thời gian dùng smartphone của thanh thiếu niên tăng mạnh.
       Bài viết này tìm hiểu nguyên nhân và hướng giải quyết.)

본론: 첫째, 스마트폰 의존의 원인은 또래 관계와 오락 콘텐츠에 있다.
      둘째, 그 결과 학습 집중력 저하와 수면 부족 문제가 발생한다.
      셋째, 사용 시간 제한 앱과 가정 내 규칙이 대안이 될 수 있다.

결론: 지금까지 살펴본 바와 같이 청소년의 스마트폰 사용은
      가정과 학교가 함께 관리할 필요가 있다.
      (Như đã xem xét, việc dùng smartphone của thanh thiếu niên
       cần được gia đình và nhà trường cùng quản lý.)
</code></pre>
<div class="callout"><span class="badge">Câu hiệu lệnh</span> "본고에서는 ~고자 한다" luôn báo hiệu 서론; "지금까지 살펴본 바와 같이" luôn báo hiệu 결론 — nhận ra ngay các mẫu này giúp bạn biết mình đang đọc (hay nên viết) phần nào của bài luận.</div>`,
  ]]);

const c3q = quiz('kaw402-quiz-3', 'Quiz 3 — Essay structure|||Quiz 3 — Cấu trúc bài luận', [
  { id: 'q1', question: 'Thứ tự chuẩn của một bài luận học thuật tiếng Hàn là gì?', options: ['본론-서론-결론', '서론-본론-결론', '결론-본론-서론', 'Tuỳ ý, không cố định'], correctIndex: 1, explanation: 'Khung chuẩn luôn là 서론 (mở) → 본론 (thân) → 결론 (kết).' },
  { id: 'q2', question: 'Câu mẫu "본고에서는 ~에 대해 살펴보고자 한다" thường xuất hiện ở phần nào?', options: ['서론 (mở bài)', '본론 (thân bài)', '결론 (kết bài)', 'Có thể ở bất kỳ đâu'], correctIndex: 0, explanation: 'Đây là câu khuôn nêu mục đích/phạm vi, đặc trưng của 서론.' },
  { id: 'q3', question: 'Câu mẫu "지금까지 살펴본 바와 같이" báo hiệu phần nào của bài luận?', options: ['Mở đầu vấn đề', 'Một luận điểm mới trong thân bài', 'Kết luận, tóm tắt lại điều đã trình bày', 'Trích dẫn nguồn tham khảo'], correctIndex: 2, explanation: '"지금까지 살펴본 바와 같이" (như đã xem xét) là câu mở đầu điển hình của 결론.' },
]);

const c4 = doc('kaw402-4-1-inyong-dago-hada', '4.1 — Citation & objective expression (인용, -다고 하다)|||4.1 — Cách trích dẫn & diễn đạt khách quan (인용, -다고 하다)',
  'Trích dẫn gián tiếp -다고 하다 theo loại câu (평서/의문/명령/청유); mẫu trích nguồn "OOO(2020)에 따르면"; hedge khách quan ~것으로 보인다/판단된다.',
  [[
    `<span class="eyebrow">KAW402 · Chapter 4 · Lesson 4.1</span>
<h2>Citation &amp; objective expression (인용, -다고 하다)</h2>
<h3>Indirect quotation: the -다고 하다 family</h3>
<p>Academic writing almost always <strong>paraphrases</strong> a source rather than quoting it word for word. The reporting ending changes with the sentence type of what's being reported:</p>
<table><thead><tr><th>Original sentence type</th><th>Reporting ending</th><th>Example</th></tr></thead><tbody>
<tr><td>Statement (평서문)</td><td>-ㄴ/는다고 하다</td><td>바쁘다고 하다 (say [someone] is busy)</td></tr>
<tr><td>Question (의문문)</td><td>-냐고 하다</td><td>바쁘냐고 하다 (ask if [someone] is busy)</td></tr>
<tr><td>Command (명령문)</td><td>-(으)라고 하다</td><td>가라고 하다 (tell [someone] to go)</td></tr>
<tr><td>Proposal (청유문)</td><td>-자고 하다</td><td>가자고 하다 (suggest going)</td></tr>
</tbody></table>
<h3>Citing sources</h3>
<pre><code>OOO(2020)에 따르면 ~다고 하였다.
= According to OOO (2020), it is said that ~.

OOO는 ~라고 주장하였다.
= OOO argued that ~.

연구에 의하면 ~는 것으로 나타났다.
= According to the study, it was found that ~.
</code></pre>
<h3>Direct vs indirect quote</h3>
<pre><code>Direct:   그는 "환경 보호가 중요하다"라고 말했다.
          geu-neun "hwangyeong boho-ga jungyo-hada"ra-go malhaetda.
          = He said, "Environmental protection is important."

Indirect: 그는 환경 보호가 중요하다고 말했다.
          geu-neun hwangyeong boho-ga jungyo-hadago malhaetda.
          = He said that environmental protection is important.
</code></pre>
<h3>Staying objective</h3>
<p>Instead of asserting a personal opinion flatly, academic Korean hedges: <strong>~것으로 보인다</strong> (it appears that), <strong>~라고 판단된다</strong> (it is judged that), <strong>~ㄹ 수 있다</strong> (it can be said that), <strong>~것으로 예상된다</strong> (it is expected that).</p>
<div class="callout"><span class="badge">Why indirect quotes matter</span> Reporting a source with -다고 하다 plus a citation ("OOO(2020)에 따르면") shows a claim is backed by evidence, not just personal opinion — the backbone of academic credibility.</div>`,
    `<span class="eyebrow">KAW402 · Chương 4 · Bài 4.1</span>
<h2>Cách trích dẫn &amp; diễn đạt khách quan (인용, -다고 하다)</h2>
<h3>Trích dẫn gián tiếp: họ ngữ pháp -다고 하다</h3>
<p>Văn học thuật hầu như luôn <strong>diễn giải lại</strong> nguồn thay vì trích nguyên văn. Đuôi tường thuật thay đổi theo loại câu gốc:</p>
<table><thead><tr><th>Loại câu gốc</th><th>Đuôi tường thuật</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td>Trần thuật (평서문)</td><td>-ㄴ/는다고 하다</td><td>바쁘다고 하다 (nói rằng [ai đó] bận)</td></tr>
<tr><td>Nghi vấn (의문문)</td><td>-냐고 하다</td><td>바쁘냐고 하다 (hỏi [ai đó] có bận không)</td></tr>
<tr><td>Mệnh lệnh (명령문)</td><td>-(으)라고 하다</td><td>가라고 하다 (bảo [ai đó] đi)</td></tr>
<tr><td>Đề nghị/rủ rê (청유문)</td><td>-자고 하다</td><td>가자고 하다 (rủ cùng đi)</td></tr>
</tbody></table>
<h3>Trích dẫn nguồn</h3>
<pre><code>OOO(2020)에 따르면 ~다고 하였다.
= Theo OOO (2020), có ý kiến cho rằng ~.

OOO는 ~라고 주장하였다.
= OOO đã lập luận rằng ~.

연구에 의하면 ~는 것으로 나타났다.
= Theo nghiên cứu, kết quả cho thấy ~.
</code></pre>
<h3>Trích dẫn trực tiếp vs gián tiếp</h3>
<pre><code>Trực tiếp: 그는 "환경 보호가 중요하다"라고 말했다.
           geu-neun "hwangyeong boho-ga jungyo-hada"ra-go malhaetda.
           = Anh ấy nói: "Bảo vệ môi trường rất quan trọng."

Gián tiếp: 그는 환경 보호가 중요하다고 말했다.
           geu-neun hwangyeong boho-ga jungyo-hadago malhaetda.
           = Anh ấy nói rằng bảo vệ môi trường rất quan trọng.
</code></pre>
<h3>Giữ tính khách quan</h3>
<p>Thay vì khẳng định ý kiến cá nhân thẳng thừng, tiếng Hàn học thuật dùng cách hedge: <strong>~것으로 보인다</strong> (có vẻ như), <strong>~라고 판단된다</strong> (được đánh giá là), <strong>~ㄹ 수 있다</strong> (có thể nói là), <strong>~것으로 예상된다</strong> (dự kiến là).</p>
<div class="callout"><span class="badge">Vì sao trích dẫn gián tiếp quan trọng</span> Tường thuật nguồn bằng -다고 하다 kèm trích dẫn ("OOO(2020)에 따르면") cho thấy luận điểm có căn cứ, không chỉ là ý kiến cá nhân — đó là xương sống của độ tin cậy học thuật.</div>`,
  ]]);

const c4q = quiz('kaw402-quiz-4', 'Quiz 4 — Citation & objectivity|||Quiz 4 — Trích dẫn & khách quan', [
  { id: 'q1', question: 'Câu hỏi gián tiếp (tường thuật lại một câu hỏi) dùng đuôi nào?', options: ['-ㄴ/는다고 하다', '-냐고 하다', '-(으)라고 하다', '-자고 하다'], correctIndex: 1, explanation: '-냐고 하다 dùng khi tường thuật lại một câu nghi vấn (câu hỏi).' },
  { id: 'q2', question: 'Câu rủ rê/đề nghị gián tiếp ("rủ đi cùng") dùng đuôi nào?', options: ['-냐고 하다', '-자고 하다', '-(으)라고 하다', '-ㄴ/는다고 하다'], correctIndex: 1, explanation: '-자고 하다 dùng cho câu 청유문 (đề nghị/rủ rê), khác với -(으)라고 하다 (mệnh lệnh).' },
  { id: 'q3', question: 'Trích dẫn gián tiếp kèm nguồn (vd "OOO(2020)에 따르면") giúp bài viết học thuật điều gì?', options: ['Thể hiện cảm xúc cá nhân mạnh hơn', 'Tăng tính khách quan, cho thấy luận điểm có căn cứ', 'Luôn làm câu ngắn hơn', 'Không cần nêu nguồn gốc thông tin'], correctIndex: 1, explanation: 'Trích dẫn có nguồn là cách chứng minh luận điểm dựa trên bằng chứng, không phải ý kiến suông.' },
]);

const c5 = doc('kaw402-5-1-seolmyeongmun', '5.1 — Descriptive & explanatory writing (설명문)|||5.1 — Viết miêu tả & giải thích (설명문)',
  'Năm phương thức triển khai 설명문: định nghĩa (~란 ~을 말한다), phân loại (~로 나눌 수 있다), so sánh/tương phản (~에 비해/~와 달리), nhân quả (~로 인해), trình tự (먼저~그다음~).',
  [[
    `<span class="eyebrow">KAW402 · Chapter 5 · Lesson 5.1</span>
<h2>Descriptive &amp; explanatory writing (설명문)</h2>
<p class="lead">설명문 (explanatory text) informs the reader objectively — no personal opinion, just clear exposition. It relies on five standard methods:</p>
<table><thead><tr><th>Method</th><th>Template</th></tr></thead><tbody>
<tr><td><strong>정의</strong> (definition)</td><td>"~(이)란 ~을/를 말한다 / 의미한다."</td></tr>
<tr><td><strong>분류</strong> (classification)</td><td>"~는 크게 A와 B로 나눌 수 있다."</td></tr>
<tr><td><strong>비교/대조</strong> (compare/contrast)</td><td>"~에 비해", "~와 달리", "~와 마찬가지로"</td></tr>
<tr><td><strong>인과</strong> (cause &amp; effect)</td><td>"~로 인해", "그 결과", "~ 때문에"</td></tr>
<tr><td><strong>과정</strong> (process)</td><td>"먼저 ~. 그다음으로 ~. 마지막으로 ~."</td></tr>
</tbody></table>
<h3>Worked example — combining definition + classification</h3>
<pre><code>지속가능발전이란 미래 세대의 필요를 훼손하지 않으면서
현재 세대의 필요를 충족하는 발전을 말한다.
= Sustainable development refers to development that meets the
  needs of the present without compromising future generations.

지속가능발전은 크게 환경적, 경제적, 사회적 지속가능성으로 나눌 수 있다.
= Sustainable development can broadly be classified into
  environmental, economic, and social sustainability.
</code></pre>
<div class="callout"><span class="badge">No opinion allowed</span> 설명문 stays neutral — save "아/어야 한다" (should) and personal stance for 논설문 (Chapter 6). Mixing the two is a common TOPIK writing mistake.</div>`,
    `<span class="eyebrow">KAW402 · Chương 5 · Bài 5.1</span>
<h2>Viết miêu tả &amp; giải thích (설명문)</h2>
<p class="lead">설명문 (văn giải thích) cung cấp thông tin khách quan cho người đọc — không chen ý kiến cá nhân, chỉ trình bày rõ ràng. Nó dựa vào năm phương thức triển khai chuẩn:</p>
<table><thead><tr><th>Phương thức</th><th>Mẫu câu khuôn</th></tr></thead><tbody>
<tr><td><strong>정의</strong> (định nghĩa)</td><td>"~(이)란 ~을/를 말한다 / 의미한다."</td></tr>
<tr><td><strong>분류</strong> (phân loại)</td><td>"~는 크게 A와 B로 나눌 수 있다."</td></tr>
<tr><td><strong>비교/대조</strong> (so sánh/tương phản)</td><td>"~에 비해", "~와 달리", "~와 마찬가지로"</td></tr>
<tr><td><strong>인과</strong> (nhân quả)</td><td>"~로 인해", "그 결과", "~ 때문에"</td></tr>
<tr><td><strong>과정</strong> (trình tự)</td><td>"먼저 ~. 그다음으로 ~. 마지막으로 ~."</td></tr>
</tbody></table>
<h3>Ví dụ áp dụng — kết hợp định nghĩa + phân loại</h3>
<pre><code>지속가능발전이란 미래 세대의 필요를 훼손하지 않으면서
현재 세대의 필요를 충족하는 발전을 말한다.
= Phát triển bền vững là sự phát triển đáp ứng nhu cầu hiện tại
  mà không làm tổn hại khả năng đáp ứng nhu cầu của thế hệ tương lai.

지속가능발전은 크게 환경적, 경제적, 사회적 지속가능성으로 나눌 수 있다.
= Phát triển bền vững có thể chia lớn thành bền vững về
  môi trường, kinh tế và xã hội.
</code></pre>
<div class="callout"><span class="badge">Không được chen ý kiến</span> 설명문 phải giữ trung tính — để dành "아/어야 한다" (nên/phải) và lập trường cá nhân cho 논설문 (Chương 6). Lẫn lộn hai loại là lỗi phổ biến khi làm bài viết TOPIK.</div>`,
  ]]);

const c5q = quiz('kaw402-quiz-5', 'Quiz 5 — Descriptive writing|||Quiz 5 — Viết giải thích', [
  { id: 'q1', question: 'Mẫu câu nào dùng để ĐỊNH NGHĨA một khái niệm trong 설명문?', options: ['~(이)란 ~을 말한다', '~에 비해', '그 결과', '먼저 ~ 그다음으로 ~'], correctIndex: 0, explanation: '~(이)란 ~을 말한다/의미한다 là mẫu định nghĩa chuẩn.' },
  { id: 'q2', question: 'Mẫu câu "~와 달리" diễn đạt quan hệ gì?', options: ['Tương đồng', 'Tương phản / khác biệt', 'Nguyên nhân', 'Trình tự thời gian'], correctIndex: 1, explanation: '~와 달리 (khác với ~) dùng để đối chiếu, nêu điểm khác biệt.' },
  { id: 'q3', question: 'Cụm "그 결과" dùng để nối hai vế theo quan hệ nào?', options: ['Nguyên nhân → kết quả', 'Định nghĩa khái niệm', 'Phân loại', 'Đưa ví dụ'], correctIndex: 0, explanation: '그 결과 (kết quả là) đứng sau nguyên nhân, mở ra hệ quả — thuộc phương thức nhân quả (인과).' },
]);

const c6 = doc('kaw402-6-1-nonseolmun', '6.1 — Argumentative writing (논설문, nêu quan điểm)|||6.1 — Viết nghị luận & lập luận (논설문, nêu quan điểm)',
  'Nêu quan điểm ~아/어야 한다/~ㄹ 필요가 있다; đưa căn cứ; thừa nhận phản biện rồi bác bỏ 물론~그러나~; cấu trúc quan điểm→căn cứ→phản biện→khẳng định lại.',
  [[
    `<span class="eyebrow">KAW402 · Chapter 6 · Lesson 6.1</span>
<h2>Argumentative writing (논설문, taking a stance)</h2>
<h3>Stating a claim (주장)</h3>
<table><thead><tr><th>Expression</th><th>Meaning</th></tr></thead><tbody>
<tr><td>~아/어야 한다</td><td>must / should</td></tr>
<tr><td>~ㄹ 필요가 있다</td><td>there is a need to</td></tr>
<tr><td>~는 것이 바람직하다</td><td>it is desirable that</td></tr>
</tbody></table>
<h3>Supporting with evidence (근거) &amp; example (예시)</h3>
<p>Introduce reasons with <strong>왜냐하면 ~ 때문이다</strong> ("because ~") and concrete cases with <strong>예를 들어</strong> ("for example") — a claim without 근거 reads as an unsupported opinion, which loses points in academic and TOPIK writing alike.</p>
<h3>Acknowledge, then rebut (반론 → 재반박)</h3>
<pre><code>물론 온라인 수업은 집중력이 떨어질 수도 있다.
mullon on-lain sueob-eun jibjungnyeog-i tteoreojil suto itda.
= Of course, online classes may reduce concentration.

그러나 다양한 학습 도구를 활용하면
이러한 단점을 보완할 수 있다.
= However, using various learning tools
  can compensate for this drawback.
</code></pre>
<h3>Full shape</h3>
<p><strong>주장</strong> (claim) → <strong>근거</strong> (evidence, x2-3) → <strong>반론 고려 + 재반박</strong> (concede + rebut) → <strong>결론에서 주장 재강조</strong> (restate the claim in the conclusion).</p>
<div class="callout"><span class="badge">Why concede first</span> "물론 ~ㄹ 수도 있다. 그러나 ~" shows you've considered the other side before rejecting it — this makes an argument more persuasive than one that ignores counterpoints entirely.</div>`,
    `<span class="eyebrow">KAW402 · Chương 6 · Bài 6.1</span>
<h2>Viết nghị luận (논설문, nêu quan điểm)</h2>
<h3>Nêu quan điểm (주장)</h3>
<table><thead><tr><th>Mẫu câu</th><th>Nghĩa</th></tr></thead><tbody>
<tr><td>~아/어야 한다</td><td>phải / nên</td></tr>
<tr><td>~ㄹ 필요가 있다</td><td>cần phải</td></tr>
<tr><td>~는 것이 바람직하다</td><td>nên là điều đáng mong muốn</td></tr>
</tbody></table>
<h3>Đưa căn cứ (근거) &amp; ví dụ (예시)</h3>
<p>Mở đầu lý do bằng <strong>왜냐하면 ~ 때문이다</strong> ("bởi vì ~") và dẫn trường hợp cụ thể bằng <strong>예를 들어</strong> ("ví dụ như") — một quan điểm không có 근거 chỉ là ý kiến suông, sẽ bị trừ điểm cả trong bài học thuật lẫn bài thi TOPIK.</p>
<h3>Thừa nhận phản biện rồi bác bỏ (반론 → 재반박)</h3>
<pre><code>물론 온라인 수업은 집중력이 떨어질 수도 있다.
mullon on-lain sueob-eun jibjungnyeog-i tteoreojil suto itda.
= Tất nhiên, học trực tuyến có thể làm giảm khả năng tập trung.

그러나 다양한 학습 도구를 활용하면
이러한 단점을 보완할 수 있다.
= Tuy nhiên, nếu tận dụng nhiều công cụ học tập đa dạng
  thì có thể khắc phục được nhược điểm này.
</code></pre>
<h3>Khung đầy đủ</h3>
<p><strong>주장</strong> (nêu quan điểm) → <strong>근거</strong> (căn cứ, 2-3 ý) → <strong>반론 고려 + 재반박</strong> (thừa nhận phản biện rồi bác bỏ lại) → <strong>결론에서 주장 재강조</strong> (khẳng định lại quan điểm ở kết bài).</p>
<div class="callout"><span class="badge">Vì sao phải thừa nhận trước</span> "물론 ~ㄹ 수도 있다. 그러나 ~" cho thấy bạn đã cân nhắc phía đối lập trước khi bác bỏ — điều này khiến lập luận thuyết phục hơn hẳn so với việc bỏ qua hoàn toàn ý kiến trái chiều.</div>`,
  ]]);

const c6q = quiz('kaw402-quiz-6', 'Quiz 6 — Argumentative writing|||Quiz 6 — Viết nghị luận', [
  { id: 'q1', question: 'Mẫu câu nào dùng để NÊU QUAN ĐIỂM/lập luận (주장) trong 논설문?', options: ['~아/어야 한다', '~로 인해', '~란 ~을 말한다', '즉'], correctIndex: 0, explanation: '~아/어야 한다 và ~ㄹ 필요가 있다 là mẫu nêu quan điểm/lập trường điển hình.' },
  { id: 'q2', question: 'Cấu trúc "물론 ~ㄹ 수도 있다. 그러나 ~" dùng để làm gì?', options: ['Định nghĩa một khái niệm', 'Thừa nhận ý kiến phản biện rồi bác bỏ lại', 'Tóm tắt toàn bộ bài viết', 'Trích dẫn nguồn tham khảo'], correctIndex: 1, explanation: 'Đây là cấu trúc 반론-재반박 chuẩn: nhượng bộ rồi phản bác.' },
  { id: 'q3', question: 'Trình tự chuẩn của một đoạn nghị luận (논설문) là gì?', options: ['Kết luận → căn cứ → quan điểm', 'Quan điểm → căn cứ → (phản biện + bác bỏ) → khẳng định lại', 'Ví dụ → định nghĩa → phân loại', 'Không cần theo trình tự nào'], correctIndex: 1, explanation: 'Khung chuẩn: 주장 → 근거 → 반론/재반박 → tái khẳng định ở kết luận.' },
]);

const c7 = doc('kaw402-7-1-yoyak-bogoseo', '7.1 — Summaries, reports & outlines (요약, 보고서)|||7.1 — Viết tóm tắt, báo cáo & đề cương (요약, 보고서)',
  'Nguyên tắc tóm tắt (요약): giữ ý chính, lược chi tiết, không thêm ý kiến; cấu trúc báo cáo (보고서): mục đích-phương pháp/kết quả-bàn luận; đề cương (개요) để lập dàn ý.',
  [[
    `<span class="eyebrow">KAW402 · Chapter 7 · Lesson 7.1</span>
<h2>Summaries, reports &amp; outlines (요약, 보고서)</h2>
<h3>Summarizing (요약)</h3>
<p>Three rules govern a good academic summary: (1) identify the <strong>main idea (중심 내용)</strong> and drop supporting details/examples; (2) keep it to roughly <strong>1/3</strong> of the original length; (3) rephrase in your own words but <strong>never add your own opinion</strong> — a summary reports, it doesn't argue.</p>
<pre><code>Original (excerpt): 온라인 학습은 시간과 장소의 제약이 없다는 장점이
있지만, 자기 관리 능력이 부족한 학습자에게는 오히려 집중력
저하라는 단점으로 작용할 수 있다. 따라서 학습자의 특성에 맞는
학습 방식을 선택하는 것이 중요하다.

Summary: 온라인 학습은 시간·장소의 제약이 없지만 자기 관리가
부족하면 집중력이 떨어질 수 있어, 학습자에 맞는 방식 선택이 중요하다.
</code></pre>
<h3>Report structure (보고서)</h3>
<p><strong>서론</strong> (purpose, why this study matters) → <strong>본론</strong> (research method, findings/current state) → <strong>결론</strong> (discussion, recommendations).</p>
<h3>Outline (개요)</h3>
<p>Before drafting a full essay, plan it as an <strong>개요</strong>: 서론 (one line) — 본론 with sub-headings <strong>I / II / III</strong> — 결론 (one line). This forces you to check the logic flows before you write full sentences.</p>
<div class="callout"><span class="badge">Summary ≠ opinion</span> The single most common summarizing error is slipping in "나는 ~라고 생각한다" — a summary must stay a faithful, shortened restatement of someone else's text.</div>`,
    `<span class="eyebrow">KAW402 · Chương 7 · Bài 7.1</span>
<h2>Viết tóm tắt, báo cáo &amp; đề cương (요약, 보고서)</h2>
<h3>Tóm tắt (요약)</h3>
<p>Ba nguyên tắc của một bài tóm tắt học thuật tốt: (1) xác định <strong>ý chính (중심 내용)</strong> và lược bỏ chi tiết/ví dụ phụ; (2) giữ độ dài khoảng <strong>1/3</strong> bản gốc; (3) diễn đạt lại bằng lời của mình nhưng <strong>không bao giờ thêm ý kiến riêng</strong> — tóm tắt là thuật lại, không phải lập luận.</p>
<pre><code>Bản gốc (trích): 온라인 학습은 시간과 장소의 제약이 없다는 장점이
있지만, 자기 관리 능력이 부족한 학습자에게는 오히려 집중력
저하라는 단점으로 작용할 수 있다. 따라서 학습자의 특성에 맞는
학습 방식을 선택하는 것이 중요하다.
(Học trực tuyến có ưu điểm không giới hạn thời gian/không gian,
nhưng với người thiếu khả năng tự quản lý, nó có thể trở thành
nhược điểm gây giảm tập trung. Do đó, chọn cách học phù hợp
với đặc điểm người học là quan trọng.)

Bản tóm tắt: 온라인 학습은 시간·장소의 제약이 없지만 자기 관리가
부족하면 집중력이 떨어질 수 있어, 학습자에 맞는 방식 선택이 중요하다.
</code></pre>
<h3>Cấu trúc báo cáo (보고서)</h3>
<p><strong>서론</strong> (mục đích, lý do nghiên cứu này quan trọng) → <strong>본론</strong> (phương pháp nghiên cứu, kết quả/hiện trạng) → <strong>결론</strong> (bàn luận, đề xuất).</p>
<h3>Đề cương (개요)</h3>
<p>Trước khi viết bài luận đầy đủ, hãy lập dàn ý dưới dạng <strong>개요</strong>: 서론 (một dòng) — 본론 với các tiêu đề nhỏ <strong>I / II / III</strong> — 결론 (một dòng). Việc này buộc bạn kiểm tra mạch logic trước khi viết thành câu hoàn chỉnh.</p>
<div class="callout"><span class="badge">Tóm tắt ≠ ý kiến</span> Lỗi tóm tắt phổ biến nhất là lẫn vào câu "나는 ~라고 생각한다" — bài tóm tắt phải trung thành, chỉ là bản rút gọn của văn bản gốc, không phải nơi thể hiện quan điểm cá nhân.</div>`,
  ]]);

const c7q = quiz('kaw402-quiz-7', 'Quiz 7 — Summaries & reports|||Quiz 7 — Tóm tắt & báo cáo', [
  { id: 'q1', question: 'Nguyên tắc quan trọng nhất khi viết tóm tắt (요약) là gì?', options: ['Thêm quan điểm cá nhân vào cho sinh động', 'Giữ nguyên toàn bộ chi tiết của bản gốc', 'Giữ ý chính, lược chi tiết phụ, không thêm ý kiến riêng', 'Viết dài hơn bản gốc để rõ nghĩa'], correctIndex: 2, explanation: 'Tóm tắt phải trung thành với ý chính bản gốc, rút gọn ~1/3, và khách quan.' },
  { id: 'q2', question: 'Cấu trúc chuẩn của một báo cáo (보고서) học thuật là gì?', options: ['결론 → 본론 → 서론', '서론 (mục đích) → 본론 (phương pháp/kết quả) → 결론 (bàn luận/đề xuất)', 'Chỉ cần phần kết luận là đủ', 'Sắp xếp ngẫu nhiên, không có quy tắc'], correctIndex: 1, explanation: 'Báo cáo theo khung: nêu mục đích → phương pháp & kết quả → bàn luận & đề xuất.' },
  { id: 'q3', question: 'Đề cương (개요) dùng để làm gì trước khi viết bài luận?', options: ['Thay thế hoàn toàn bài luận, không cần viết nữa', 'Lập dàn ý các luận điểm (I, II, III) để kiểm tra mạch logic trước', 'Chỉ lập sau khi đã viết xong bài', 'Không cần thiết với bài viết học thuật'], correctIndex: 1, explanation: '개요 là bước lập dàn ý trước khi viết, giúp kiểm tra bố cục và logic.' },
]);

const c8 = doc('kaw402-8-1-wongoji-topik', '8.1 — Editing & TOPIK II Writing practice (원고지, câu 51-54)|||8.1 — Sửa lỗi, biên tập & luyện viết TOPIK II 쓰기 (원고지, câu 51-54)',
  'Quy tắc viết trên giấy 원고지 (thụt đầu dòng, mỗi ô một kí tự); cấu trúc câu 51-52 (điền chỗ trống), 53 (phân tích biểu đồ), 54 (luận 600-700 kí tự); lỗi thường gặp cần sửa.',
  [[
    `<span class="eyebrow">KAW402 · Chapter 8 · Lesson 8.1</span>
<h2>Editing &amp; TOPIK II Writing practice (원고지, questions 51–54)</h2>
<h3>원고지 (manuscript paper) rules</h3>
<ul>
<li>One character per square, including most punctuation (though numerals/Latin letters may share a square in pairs).</li>
<li>Indent <strong>one square</strong> at the start of every new paragraph.</li>
<li>Never start a line with a closing quotation mark or a comma alone — carry it with the last character instead.</li>
</ul>
<h3>TOPIK II 쓰기 task map</h3>
<table><thead><tr><th>Question</th><th>Task</th><th>Key expressions</th></tr></thead><tbody>
<tr><td>51–52</td><td>Fill in blanks in a practical text (실용문)</td><td>Match register &amp; grammar to the surrounding sentence</td></tr>
<tr><td>53</td><td>Describe a graph/data, 200–300 characters (도표 분석)</td><td>"~로 나타났다", "~인 것으로 조사되었다", "~에 비해 ~% 증가/감소하였다"</td></tr>
<tr><td>54</td><td>600–700 character essay on a social topic</td><td>원인-현황-대안 or 찬반 structure; full 서론-본론-결론</td></tr>
</tbody></table>
<p>Question 54 is graded on three criteria: <strong>내용 및 과제 수행</strong> (content &amp; task completion), <strong>글의 전개 구조</strong> (organization), <strong>언어 사용</strong> (language accuracy &amp; register).</p>
<h3>Common errors to fix</h3>
<pre><code>은/는 vs 이/가 — topic vs subject marker, easy to mix up
안되다 (it's no good / won't work)  vs  안 되다 (does not become / is not allowed)
Mixing -요 into a -다 essay:
  WRONG: ...이 문제는 심각해요. 그래서 대책이 필요하다.
  RIGHT: ...이 문제는 심각하다. 따라서 대책이 필요하다.
</code></pre>
<div class="callout"><span class="badge">Editing pass</span> After drafting, re-read for exactly three things: (1) every sentence ends in -다, never -요; (2) 은/는 vs 이/가 is correct; (3) 띄어쓰기 (spacing) around dependent nouns like 것, 수, 만큼 is correct.</div>`,
    `<span class="eyebrow">KAW402 · Chương 8 · Bài 8.1</span>
<h2>Sửa lỗi &amp; luyện viết TOPIK II 쓰기 (원고지, câu 51-54)</h2>
<h3>Quy tắc viết trên 원고지 (giấy kẻ ô)</h3>
<ul>
<li>Mỗi ô viết một kí tự, kể cả hầu hết dấu câu (số/chữ Latin có thể ghép đôi trong một ô).</li>
<li>Thụt vào <strong>1 ô</strong> ở đầu mỗi đoạn văn mới.</li>
<li>Không bao giờ để dấu ngoặc kép đóng hay dấu phẩy đứng một mình ở đầu dòng — phải đi kèm kí tự cuối của dòng trước.</li>
</ul>
<h3>Bản đồ đề thi TOPIK II 쓰기</h3>
<table><thead><tr><th>Câu</th><th>Yêu cầu</th><th>Mẫu câu chủ chốt</th></tr></thead><tbody>
<tr><td>51–52</td><td>Điền vào chỗ trống trong văn bản thực dụng (실용문)</td><td>Khớp văn phong &amp; ngữ pháp với câu xung quanh</td></tr>
<tr><td>53</td><td>Miêu tả biểu đồ/số liệu, 200-300 kí tự (도표 분석)</td><td>"~로 나타났다", "~인 것으로 조사되었다", "~에 비해 ~% 증가/감소하였다"</td></tr>
<tr><td>54</td><td>Bài luận 600-700 kí tự về chủ đề xã hội</td><td>Cấu trúc nguyên nhân-hiện trạng-giải pháp hoặc tán thành-phản đối; đủ 서론-본론-결론</td></tr>
</tbody></table>
<p>Câu 54 chấm theo ba tiêu chí: <strong>내용 및 과제 수행</strong> (nội dung &amp; hoàn thành yêu cầu), <strong>글의 전개 구조</strong> (cấu trúc triển khai), <strong>언어 사용</strong> (dùng ngôn ngữ chính xác, đúng văn phong).</p>
<h3>Lỗi thường gặp cần sửa</h3>
<pre><code>은/는 vs 이/가 — trợ từ chủ đề vs chủ ngữ, rất dễ lẫn
안되다 (không ổn/tệ)  vs  안 되다 (không được phép/không thể)
Lẫn -요 vào bài đang dùng -다:
  SAI:  ...이 문제는 심각해요. 그래서 대책이 필요하다.
  ĐÚNG: ...이 문제는 심각하다. 따라서 대책이 필요하다.
</code></pre>
<div class="callout"><span class="badge">Bước rà soát cuối</span> Sau khi viết xong, đọc lại kiểm tra đúng ba điều: (1) mọi câu kết thúc bằng -다, không lẫn -요; (2) 은/는 vs 이/가 dùng đúng; (3) 띄어쓰기 (cách chữ) quanh danh từ phụ thuộc như 것, 수, 만큼 đúng chuẩn.</div>`,
  ]]);

const c8q = quiz('kaw402-quiz-8', 'Quiz 8 — Editing & TOPIK II 쓰기|||Quiz 8 — Sửa lỗi & TOPIK II 쓰기', [
  { id: 'q1', question: 'Trên giấy 원고지, khi bắt đầu MỘT ĐOẠN VĂN MỚI cần làm gì?', options: ['Viết liền, không thụt đầu dòng', 'Thụt vào 1 ô ở đầu dòng', 'Bỏ trống hẳn 1 dòng', 'Viết hoa toàn bộ dòng đầu'], correctIndex: 1, explanation: 'Quy tắc 원고지: đầu mỗi đoạn văn mới phải thụt vào đúng 1 ô.' },
  { id: 'q2', question: 'Câu 53 trong TOPIK II 쓰기 yêu cầu thí sinh làm gì?', options: ['Viết luận 600-700 kí tự về chủ đề xã hội', 'Điền từ vào chỗ trống trong văn bản thực dụng', 'Viết 200-300 kí tự miêu tả/phân tích biểu đồ, số liệu', 'Dịch một đoạn văn sang tiếng Hàn'], correctIndex: 2, explanation: 'Câu 53 là bài phân tích đồ thị/số liệu (도표 분석), 200-300 kí tự — khác câu 54 (luận 600-700 kí tự).' },
  { id: 'q3', question: 'Lỗi nào sau đây PHÁ VỠ văn phong học thuật khi làm bài viết TOPIK?', options: ['Dùng đuôi -다 nhất quán trong cả bài', 'Chèn đuôi -요 (văn nói) vào giữa bài đang dùng -다', 'Dùng đúng trợ từ 은/는 và 이/가', 'Có câu chủ đề rõ ràng ở đầu đoạn'], correctIndex: 1, explanation: 'Lẫn -요 vào bài -다 là lỗi trộn văn nói/văn viết (구어체/문어체) phổ biến và nghiêm trọng nhất.' },
]);

export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    courseCode: 'KAW402',
    slug: 'kaw402-viet-tieng-han-hoc-thuat',
    title: 'Viết tiếng Hàn học thuật',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KAW402.webp',
    shortDescription: 'Academic Korean writing at TOPIK 4-5 — written vs spoken style, sentences/paragraphs, essay structure, objective citation, descriptive & argumentative writing, summaries/reports, TOPIK II Writing (51-54) drills.|||Viết tiếng Hàn học thuật TOPIK 4-5 — văn viết vs văn nói, câu/đoạn văn, cấu trúc bài luận, trích dẫn khách quan, viết miêu tả & nghị luận, tóm tắt/báo cáo, luyện TOPIK II 쓰기 (51-54).',
    description: 'Môn <strong>KAW402 — Viết tiếng Hàn học thuật</strong> (kỳ 5, ngành Ngôn ngữ Hàn, trình độ TOPIK 4-5) đưa sinh viên từ tiếng Hàn nói sang <strong>văn viết học thuật khách quan</strong>. Từ <strong>văn phong học thuật</strong> (문어체 vs 구어체, đuôi -다) → <strong>câu &amp; đoạn văn</strong> (từ nối, câu chủ đề) → <strong>cấu trúc bài luận</strong> (서론-본론-결론) → <strong>trích dẫn &amp; khách quan</strong> (인용, -다고 하다) → <strong>viết miêu tả/giải thích</strong> (설명문) → <strong>viết nghị luận</strong> (논설문) → <strong>tóm tắt, báo cáo &amp; đề cương</strong> (요약, 보고서) → <strong>sửa lỗi &amp; luyện TOPIK II 쓰기</strong> (원고지, câu 51-54). Trích dẫn giáo trình "대학 글쓰기", "유학생을 위한 한국어 글쓰기" và đề thi TOPIK II, song ngữ, có Hangeul + romaja + quiz mỗi chương.',
    whatYouLearn: 'Chuyển văn nói sang văn viết (-요 → -다, 것 같아요 → 것으로 보인다, 나 → 필자는/본고에서는); dựng câu ngắn gọn & đoạn văn có câu chủ đề, từ nối (그러나/따라서/왜냐하면/즉); cấu trúc bài luận 서론-본론-결론 với câu khuôn; trích dẫn gián tiếp -다고 하다 (평서/의문/명령/청유) & hedge khách quan; 5 phương thức viết giải thích (정의/분류/so sánh/nhân quả/trình tự); viết nghị luận (주장-근거-phản biện-재반박); tóm tắt đúng nguyên tắc, cấu trúc báo cáo & đề cương; quy tắc 원고지 và luyện đề TOPIK II 쓰기 câu 51-54.',
    requirements: 'Trình độ tiếng Hàn TOPIK 4 trở lên (đọc hiểu ngữ pháp trung-cao cấp, vốn từ vựng học thuật cơ bản). Nên có giáo trình "대학 글쓰기" hoặc "유학생을 위한 한국어 글쓰기" để luyện thêm.',
  },
  sections: [
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Từ nói sang viết học thuật, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Văn viết vs văn nói|||Chapter 1 — Written vs spoken style', description: '문어체/구어체, đuôi -다, bảng đối chiếu.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Câu & đoạn văn học thuật|||Chapter 2 — Sentences & paragraphs', description: '문장/단락 구성, từ nối, câu chủ đề.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Cấu trúc bài luận|||Chapter 3 — Essay structure', description: '서론-본론-결론, câu khuôn từng phần.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Trích dẫn & khách quan|||Chapter 4 — Citation & objectivity', description: '인용, -다고 하다, hedge khách quan.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Viết miêu tả & giải thích|||Chapter 5 — Descriptive writing', description: '설명문: định nghĩa, phân loại, so sánh, nhân quả.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Viết nghị luận|||Chapter 6 — Argumentative writing', description: '논설문: nêu quan điểm, căn cứ, phản biện.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Tóm tắt, báo cáo & đề cương|||Chapter 7 — Summaries & reports', description: '요약, 보고서, 개요.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Sửa lỗi & luyện TOPIK II 쓰기|||Chapter 8 — Editing & TOPIK II practice', description: '원고지, câu 51-54, lỗi thường gặp.', lessons: [c8, c8q] },
  ],
};
