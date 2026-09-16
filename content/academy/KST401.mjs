/**
 * KST401 — Korean Reading & Translation / Đọc dịch tiếng Hàn. Ngành Ngôn ngữ
 * Hàn, FPTU, Kỳ 7. Trình độ nâng cao (TOPIK 5-6). Giáo trình (trích dẫn,
 * KHÔNG upload PDF): "한국어 번역의 이론과 실제 (Korean Translation Theory and
 * Practice)"; "한-베 번역 연습"; TOPIK II 읽기. 8 chương: kỹ năng đọc & tiêu chí
 * dịch → khác biệt cấu trúc Hàn-Việt → từ Hán-Hàn/Hán-Việt → văn bản đời sống
 * → báo chí → kinh tế-thương mại-hành chính → văn học & thành ngữ tục ngữ →
 * ôn tập dịch đoạn dài & lỗi thường gặp. Song ngữ + đoạn đọc Hangeul + romaja
 * + dịch Việt song song. Giữ NGUYÊN slug/semester/courseCode/thumb.
 * ⚠️ KHÔNG backtick/${ lồng nhau.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('kst401-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Giáo trình tham khảo (trích dẫn, không phải file tải): 한국어 번역의 이론과 실제, 한-베 번역 연습, TOPIK II 읽기; nguồn chính thức TOPIK, NIKL, Naver/Daum dictionary.',
  [[
    `<span class="eyebrow">KST401 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">This course is built around widely-used Korean-Vietnamese translation references. We cite them for further reading — <strong>no PDF is distributed here</strong>; use your library or the free official sources below.</p>
<h3>📘 Reference textbooks (citation only)</h3>
<ul>
<li><em>한국어 번역의 이론과 실제 (Korean Translation Theory and Practice)</em> — translation theory, equivalence, and register applied to Korean.</li>
<li><em>한-베 번역 연습 (Korean-Vietnamese Translation Practice)</em> — worked Korean→Vietnamese translation exercises across text types.</li>
<li><em>TOPIK II 읽기 (TOPIK II Reading)</em> — official-style reading passages at levels 5-6, used here as source texts.</li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.topik.go.kr/" target="_blank" rel="noopener">TOPIK (topik.go.kr)</a> — official exam site, past-paper reading sections</li>
<li><a href="https://www.korean.go.kr/" target="_blank" rel="noopener">국립국어원 NIKL — National Institute of Korean Language</a> — 표준국어대사전 standard dictionary</li>
<li><a href="https://dict.naver.com/" target="_blank" rel="noopener">Naver Dictionary (한-영/한-베 지원)</a> — bilingual lookup, example sentences</li>
<li><a href="https://ko.dict.naver.com/" target="_blank" rel="noopener">Naver 국어사전</a> — Korean-Korean definitions for close reading</li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@TOPIKGUIDE" target="_blank" rel="noopener">TOPIK GUIDE</a> — reading-section strategy &amp; sample analysis</li>
<li><a href="https://www.youtube.com/@KBSWORLDTV" target="_blank" rel="noopener">KBS World TV</a> — real Korean news &amp; broadcast register</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — reading strategy (skim/scan/close read) and the tín-đạt-nhã translation criteria.</li>
<li><strong>Structure</strong> — SOV → SVO reordering, and Sino-Korean vocabulary mapped to Sino-Vietnamese.</li>
<li><strong>Text types</strong> — everyday/info texts → news → economic/business/administrative documents.</li>
<li><strong>Depth</strong> — literary translation, idioms/proverbs (속담), long-passage practice, common learner errors.</li>
</ol></div>`,
    `<span class="eyebrow">KST401 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Môn học bám theo các tài liệu dịch thuật Hàn-Việt phổ biến, được <strong>trích dẫn để tham khảo thêm</strong> — <strong>không có file PDF nào được phát tại đây</strong>; dùng thư viện trường hoặc các nguồn chính thức miễn phí bên dưới.</p>
<h3>📘 Giáo trình tham khảo (chỉ trích dẫn)</h3>
<ul>
<li><em>한국어 번역의 이론과 실제 (Lý thuyết &amp; thực hành dịch tiếng Hàn)</em> — lý thuyết dịch, khái niệm tương đương (equivalence) và văn phong áp dụng cho tiếng Hàn.</li>
<li><em>한-베 번역 연습 (Luyện dịch Hàn-Việt)</em> — bài tập dịch Hàn→Việt có lời giải theo nhiều loại văn bản.</li>
<li><em>TOPIK II 읽기 (Đọc hiểu TOPIK II)</em> — đoạn đọc chuẩn thi bậc 5-6, dùng làm ngữ liệu gốc trong môn.</li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.topik.go.kr/" target="_blank" rel="noopener">TOPIK (topik.go.kr)</a> — trang thi chính thức, đề đọc hiểu các năm trước</li>
<li><a href="https://www.korean.go.kr/" target="_blank" rel="noopener">국립국어원 NIKL — Viện Ngôn ngữ Quốc gia Hàn Quốc</a> — 표준국어대사전 từ điển chuẩn</li>
<li><a href="https://dict.naver.com/" target="_blank" rel="noopener">Từ điển Naver (hỗ trợ Hàn-Anh/Hàn-Việt)</a> — tra song ngữ, câu ví dụ</li>
<li><a href="https://ko.dict.naver.com/" target="_blank" rel="noopener">Naver 국어사전</a> — định nghĩa Hàn-Hàn để đọc kỹ</li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@TOPIKGUIDE" target="_blank" rel="noopener">TOPIK GUIDE</a> — chiến lược phần đọc &amp; phân tích đề mẫu</li>
<li><a href="https://www.youtube.com/@KBSWORLDTV" target="_blank" rel="noopener">KBS World TV</a> — tiếng Hàn thời sự &amp; văn phong phát thanh thật</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — chiến lược đọc (lướt/quét/đọc kỹ) và tiêu chí dịch tín-đạt-nhã.</li>
<li><strong>Cấu trúc</strong> — điều chỉnh trật tự SOV → SVO, và từ Hán-Hàn ánh xạ sang Hán-Việt.</li>
<li><strong>Loại văn bản</strong> — văn bản đời sống/thông tin → báo chí → văn bản kinh tế-thương mại-hành chính.</li>
<li><strong>Đào sâu</strong> — dịch văn học, thành ngữ tục ngữ (속담), thực hành đoạn dài, lỗi thường gặp.</li>
</ol></div>`,
  ]]);

const intro = doc('kst401-0-1-overview', 'Course overview: Korean Reading & Translation|||Tổng quan: Đọc dịch tiếng Hàn',
  'Trình độ TOPIK 5-6; 8 chương từ kỹ năng đọc & tiêu chí dịch, khác biệt cấu trúc Hàn-Việt, từ Hán-Hàn, đến văn bản đời sống, báo chí, kinh tế-thương mại-hành chính, văn học & thành ngữ, ôn tập.',
  [[
    `<span class="eyebrow">KST401 · Lesson 0.1 · Overview</span>
<h2>Korean Reading &amp; Translation</h2>
<p class="lead">This course trains <strong>advanced reading comprehension (TOPIK level 5-6)</strong> together with <strong>Korean → Vietnamese translation</strong> skill — reading a Korean text closely and rendering it into natural, faithful Vietnamese. Explanations are in Vietnamese with English terminology; every reading passage appears as <strong>Hangeul (한글) + romaja + a parallel Vietnamese translation</strong>.</p>
<h3>Eight chapters</h3>
<ol>
<li>Reading-comprehension skills &amp; Korean-Vietnamese translation criteria</li>
<li>Structural differences Korean-Vietnamese &amp; reordering when translating</li>
<li>Sino-Korean vocabulary (한자어) &amp; Sino-Vietnamese correspondences</li>
<li>Reading &amp; translating everyday/informational texts (notices, ads)</li>
<li>Reading &amp; translating news &amp; journalistic texts</li>
<li>Reading &amp; translating economic, business &amp; administrative texts</li>
<li>Reading &amp; translating literature; handling idioms &amp; proverbs (속담)</li>
<li>Review: long-passage translation practice &amp; common learner errors</li>
</ol>
<h3>How texts are shown</h3>
<p>Every Korean example appears as <strong>한글 + romaja + Vietnamese translation</strong>, e.g. <strong>안전제일 (anjeon jeil) = an toàn trên hết</strong>. Reading passages are set in <code>&lt;pre&gt;&lt;code&gt;</code> blocks so the three lines line up for comparison.</p>`,
    `<span class="eyebrow">KST401 · Bài 0.1 · Tổng quan</span>
<h2>Đọc dịch tiếng Hàn</h2>
<p class="lead">Môn này rèn <strong>đọc hiểu nâng cao (TOPIK bậc 5-6)</strong> cùng với kỹ năng <strong>dịch Hàn → Việt</strong> — đọc kỹ một văn bản tiếng Hàn rồi chuyển thành tiếng Việt tự nhiên, sát nghĩa. Giảng bằng tiếng Việt kèm thuật ngữ tiếng Anh; mỗi đoạn đọc đều có <strong>Hangeul (한글) + romaja + bản dịch tiếng Việt song song</strong>.</p>
<h3>Tám chương</h3>
<ol>
<li>Kỹ năng đọc hiểu &amp; tiêu chí dịch Hàn-Việt</li>
<li>Khác biệt cấu trúc Hàn-Việt &amp; điều chỉnh trật tự khi dịch</li>
<li>Từ Hán-Hàn (한자어) &amp; từ tương ứng Hán-Việt</li>
<li>Đọc-dịch văn bản đời sống &amp; thông tin (thông báo, quảng cáo)</li>
<li>Đọc-dịch văn bản báo chí &amp; tin tức</li>
<li>Đọc-dịch văn bản kinh tế - thương mại - hành chính</li>
<li>Đọc-dịch văn học &amp; xử lý thành ngữ, tục ngữ (속담)</li>
<li>Ôn tập: thực hành dịch đoạn dài &amp; các lỗi dịch thường gặp</li>
</ol>
<h3>Cách trình bày văn bản</h3>
<p>Mỗi ví dụ tiếng Hàn đều có <strong>한글 + romaja + bản dịch tiếng Việt</strong>, ví dụ <strong>안전제일 (anjeon jeil) = an toàn trên hết</strong>. Đoạn đọc được đặt trong khối <code>&lt;pre&gt;&lt;code&gt;</code> để ba dòng thẳng hàng, tiện đối chiếu.</p>`,
  ]]);

const c1 = doc('kst401-1-1-skills-criteria', '1.1 — Reading skills & translation criteria|||1.1 — Kỹ năng đọc hiểu & tiêu chí dịch',
  'Kỹ thuật đọc: 훑어읽기 (skim), 찾아읽기 (scan), 꼼꼼히 읽기 (close read), suy luận từ ngữ cảnh; tiêu chí dịch tín-đạt-nhã & tương đương động/hình thức (Nida).',
  [[
    `<span class="eyebrow">KST401 · Chapter 1 · Lesson 1.1</span>
<h2>Reading skills &amp; translation criteria</h2>
<h3>Three reading modes</h3>
<ul>
<li><strong>훑어읽기 (hulteo-ilgi — skimming)</strong> — read fast for the general topic and structure; useful for choosing which passages need close reading.</li>
<li><strong>찾아읽기 (chaja-ilgi — scanning)</strong> — search for a specific detail (a date, a number, a name) without reading everything.</li>
<li><strong>꼼꼼히 읽기 (kkomkkomhi ilgi — close reading)</strong> — read every sentence carefully; required before translating, since a mistranslation often starts with a misread detail.</li>
</ul>
<p>When a word is unknown, infer its meaning from <strong>context (문맥, munmaek)</strong> — surrounding words, Sino-Korean roots, or sentence structure — before reaching for a dictionary.</p>
<h3>Translation criteria: tín - đạt - nhã</h3>
<p>Korean-Vietnamese translation is commonly judged by three classic criteria (also used across East Asian translation studies):</p>
<ul>
<li><strong>Tín / 충실성 (chungsilseong — faithfulness)</strong> — the translation must carry the source's exact meaning, omitting and adding nothing.</li>
<li><strong>Đạt / 자연스러움 (jayeonseureoum — fluency)</strong> — the Vietnamese must read naturally, not like a word-by-word calque of Korean grammar.</li>
<li><strong>Nhã / 품위 (pumwi — elegance)</strong> — the register and tone (formal/informal, literary/plain) must match the source.</li>
</ul>
<p>This overlaps with <strong>Nida's equivalence</strong>: <em>formal equivalence</em> (stays close to source form) vs <em>dynamic equivalence</em> (prioritizes the reader's natural understanding) — for most non-literary texts in this course, dynamic equivalence with high faithfulness is the target.</p>
<pre><code>내일은 전국적으로 비가 오겠습니다.
naeil-eun jeonguk-jeog-eu-lo bi-ga o-gess-seumnida.

Dịch từng chữ (word-by-word, KHÔNG đạt):
  "Ngày mai là trên phạm vi toàn quốc mưa sẽ đến."
Dịch tự nhiên (tín + đạt + nhã):
  "Ngày mai, trời sẽ có mưa trên cả nước."
</code></pre>
<div class="callout"><span class="badge">Rule of thumb</span> If a Vietnamese sentence needs re-reading to be understood, it failed <em>đạt</em> even if every word is "correct" — natural word order and word choice come first, literal accuracy second.</div>`,
    `<span class="eyebrow">KST401 · Chương 1 · Bài 1.1</span>
<h2>Kỹ năng đọc hiểu &amp; tiêu chí dịch</h2>
<h3>Ba cách đọc</h3>
<ul>
<li><strong>훑어읽기 (hulteo-ilgi — đọc lướt)</strong> — đọc nhanh để nắm chủ đề &amp; bố cục chung; dùng để chọn đoạn nào cần đọc kỹ.</li>
<li><strong>찾아읽기 (chaja-ilgi — đọc quét)</strong> — tìm một chi tiết cụ thể (ngày tháng, số liệu, tên riêng) mà không cần đọc hết.</li>
<li><strong>꼼꼼히 읽기 (kkomkkomhi ilgi — đọc kỹ)</strong> — đọc từng câu cẩn thận; bắt buộc trước khi dịch, vì dịch sai thường bắt đầu từ đọc sót một chi tiết.</li>
</ul>
<p>Khi gặp từ lạ, hãy suy ra nghĩa từ <strong>ngữ cảnh (문맥, munmaek)</strong> — từ xung quanh, gốc Hán-Hàn, hoặc cấu trúc câu — trước khi tra từ điển.</p>
<h3>Tiêu chí dịch: tín - đạt - nhã</h3>
<p>Bản dịch Hàn-Việt thường được đánh giá theo ba tiêu chí kinh điển (cũng dùng chung trong dịch thuật Đông Á):</p>
<ul>
<li><strong>Tín / 충실성 (chungsilseong — trung thực)</strong> — bản dịch phải giữ đúng nghĩa gốc, không thêm không bớt.</li>
<li><strong>Đạt / 자연스러움 (jayeonseureoum — trôi chảy)</strong> — tiếng Việt phải đọc tự nhiên, không phải bản sao từng chữ theo ngữ pháp tiếng Hàn.</li>
<li><strong>Nhã / 품위 (pumwi — trang nhã)</strong> — văn phong &amp; giọng điệu (trang trọng/thân mật, văn chương/thường) phải khớp với bản gốc.</li>
</ul>
<p>Điều này trùng với khái niệm <strong>tương đương của Nida</strong>: <em>tương đương hình thức</em> (bám sát hình thức gốc) so với <em>tương đương động</em> (ưu tiên người đọc hiểu tự nhiên) — với phần lớn văn bản phi văn học trong môn này, mục tiêu là tương đương động nhưng vẫn giữ độ trung thực cao.</p>
<pre><code>내일은 전국적으로 비가 오겠습니다.
naeil-eun jeonguk-jeog-eu-lo bi-ga o-gess-seumnida.

Dịch từng chữ (word-by-word, KHÔNG đạt):
  "Ngày mai là trên phạm vi toàn quốc mưa sẽ đến."
Dịch tự nhiên (tín + đạt + nhã):
  "Ngày mai, trời sẽ có mưa trên cả nước."
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc</span> Nếu một câu tiếng Việt phải đọc lại mới hiểu, nó đã trượt tiêu chí <em>đạt</em> dù từng từ có "đúng" đến đâu — trật tự &amp; cách dùng từ tự nhiên đi trước, độ sát nghĩa câu chữ đi sau.</div>`,
  ]]);

const c1q = quiz('kst401-quiz-1', 'Quiz 1 — Kỹ năng đọc & tiêu chí dịch|||Quiz 1 — Kỹ năng đọc & tiêu chí dịch', [
  { id: 'q1', question: 'Cách đọc dùng để tìm một chi tiết cụ thể (ngày, số liệu) mà không cần đọc hết văn bản gọi là?', options: ['훑어읽기 (đọc lướt)', '찾아읽기 (đọc quét)', '꼼꼼히 읽기 (đọc kỹ)', '문맥 추론 (suy luận ngữ cảnh)'], correctIndex: 1, explanation: '찾아읽기 (chaja-ilgi) là đọc quét/tìm kiếm thông tin cụ thể, khác với đọc lướt lấy ý chung.' },
  { id: 'q2', question: 'Trong ba tiêu chí tín-đạt-nhã, tiêu chí nào yêu cầu câu tiếng Việt đọc lên tự nhiên, không như bản sao ngữ pháp tiếng Hàn?', options: ['Tín', 'Đạt', 'Nhã', 'Tương đương hình thức'], correctIndex: 1, explanation: 'Đạt (자연스러움) là tiêu chí về sự trôi chảy, tự nhiên của bản dịch.' },
  { id: 'q3', question: 'Bản dịch "Ngày mai là trên phạm vi toàn quốc mưa sẽ đến" (dịch từng chữ) mắc lỗi gì so với bản dịch tự nhiên "Ngày mai, trời sẽ có mưa trên cả nước"?', options: ['Sai nghĩa gốc (mất tín)', 'Trật tự &amp; cách diễn đạt không tự nhiên (mất đạt)', 'Sai văn phong trang trọng (mất nhã)', 'Không liên quan gì đến bản gốc'], correctIndex: 1, explanation: 'Nghĩa vẫn đúng (còn tín) nhưng trật tự từ rập khuôn theo tiếng Hàn khiến câu tiếng Việt không tự nhiên — mất tiêu chí đạt.' },
]);

const c2 = doc('kst401-2-1-structure', '2.1 — Structural differences & reordering|||2.1 — Khác biệt cấu trúc & điều chỉnh trật tự',
  'SOV (Hàn) vs SVO (Việt); định ngữ đứng trước danh từ ở Hàn, sau danh từ ở Việt; câu bị động 되다/받다 chuyển sang chủ động; kính ngữ không dịch máy móc.',
  [[
    `<span class="eyebrow">KST401 · Chapter 2 · Lesson 2.1</span>
<h2>Structural differences &amp; reordering</h2>
<h3>Word order: SOV vs SVO</h3>
<p>Korean is <strong>Subject–Object–Verb (SOV)</strong>, with the verb always last; Vietnamese is <strong>Subject–Verb–Object (SVO)</strong>. A translator must move the verb from the end of the Korean sentence to its natural mid-sentence position in Vietnamese — never keep the Korean order.</p>
<pre><code>저는 사과를 먹어요.
jeo-neun sagwa-reul meog-eo-yo.
(Tôi) (táo-ACC) (ăn)  ← trật tự Hàn: S-O-V
= Tôi ăn táo.          ← trật tự Việt: S-V-O
</code></pre>
<h3>Modifier clauses come BEFORE the noun in Korean</h3>
<p>A relative/modifying clause always precedes its noun in Korean (an "adnominal" -(으)ㄴ/는/(으)ㄹ ending), but in Vietnamese it must move AFTER the noun (with "mà"/"đã"):</p>
<pre><code>제가 어제 산 책이 재미있어요.
je-ga eoje san chaeg-i jaemi-iss-eo-yo.
[tôi hôm-qua mua] [sách] thú-vị       ← định ngữ trước danh từ (Hàn)
= Quyển sách [mà tôi mua hôm qua] thú vị.   ← định ngữ sau danh từ (Việt)
</code></pre>
<h3>Passive voice &amp; honorifics need judgment, not word-swap</h3>
<p>Korean marks passive with <strong>-되다/-받다/-아지다</strong>; Vietnamese often prefers active voice for naturalness (<em>"~이 발표되었다" → "công bố ..." not always "được công bố"</em>, depending on flow). Korean <strong>honorific speech levels</strong> (-습니다 formal, -아요/어요 polite, plain form) have no exact Vietnamese grammatical equivalent — translate the level as <em>word choice and register</em> (e.g. "quý khách/ông/bà" for formal address), not as an extra grammatical marker.</p>
<div class="callout"><span class="badge">Checklist when reordering</span> 1) Find the verb, move it to natural SVO position. 2) Find any adnominal clause, move it after its noun with "mà"/"đã". 3) Decide active vs passive by what reads naturally in Vietnamese, not by copying the Korean voice. 4) Render honorific register as tone/word choice, not grammar.</div>`,
    `<span class="eyebrow">KST401 · Chương 2 · Bài 2.1</span>
<h2>Khác biệt cấu trúc &amp; điều chỉnh trật tự</h2>
<h3>Trật tự câu: SOV vs SVO</h3>
<p>Tiếng Hàn là <strong>Chủ-Tân-Động (SOV)</strong>, động từ luôn đứng cuối; tiếng Việt là <strong>Chủ-Động-Tân (SVO)</strong>. Người dịch phải chuyển động từ từ cuối câu tiếng Hàn về đúng vị trí giữa câu trong tiếng Việt — tuyệt đối không giữ nguyên trật tự Hàn.</p>
<pre><code>저는 사과를 먹어요.
jeo-neun sagwa-reul meog-eo-yo.
(Tôi) (táo-tân ngữ) (ăn)  ← trật tự Hàn: Chủ-Tân-Động
= Tôi ăn táo.              ← trật tự Việt: Chủ-Động-Tân
</code></pre>
<h3>Mệnh đề định ngữ đứng TRƯỚC danh từ trong tiếng Hàn</h3>
<p>Mệnh đề bổ nghĩa (định ngữ) luôn đứng trước danh từ trong tiếng Hàn (đuôi định ngữ -(으)ㄴ/는/(으)ㄹ), nhưng trong tiếng Việt phải chuyển ra SAU danh từ (dùng "mà"/"đã"):</p>
<pre><code>제가 어제 산 책이 재미있어요.
je-ga eoje san chaeg-i jaemi-iss-eo-yo.
[tôi hôm-qua mua] [sách] thú-vị       ← định ngữ trước danh từ (Hàn)
= Quyển sách [mà tôi mua hôm qua] thú vị.   ← định ngữ sau danh từ (Việt)
</code></pre>
<h3>Câu bị động &amp; kính ngữ cần phán đoán, không thay từng chữ</h3>
<p>Tiếng Hàn đánh dấu bị động bằng <strong>-되다/-받다/-아지다</strong>; tiếng Việt thường thiên về câu chủ động cho tự nhiên (<em>"~이 발표되었다" → "công bố ..." không phải lúc nào cũng cần "được công bố"</em>, tuỳ mạch văn). <strong>Các bậc kính ngữ</strong> của tiếng Hàn (-습니다 trang trọng, -아요/어요 lịch sự, thể thường) không có tương đương ngữ pháp chính xác trong tiếng Việt — hãy dịch bậc đó thành <em>cách chọn từ &amp; văn phong</em> (vd "quý khách/ông/bà" cho lời trang trọng), chứ không thêm một dấu hiệu ngữ pháp riêng.</p>
<div class="callout"><span class="badge">Checklist khi điều chỉnh trật tự</span> 1) Tìm động từ, đưa về đúng vị trí SVO. 2) Tìm mệnh đề định ngữ, đưa ra sau danh từ với "mà"/"đã". 3) Chọn chủ động hay bị động theo cái gì đọc tự nhiên trong tiếng Việt, không sao chép thể của tiếng Hàn. 4) Chuyển bậc kính ngữ thành giọng điệu/cách chọn từ, không phải ngữ pháp.</div>`,
  ]]);

const c2q = quiz('kst401-quiz-2', 'Quiz 2 — Cấu trúc & trật tự|||Quiz 2 — Cấu trúc & trật tự', [
  { id: 'q1', question: 'Trật tự câu cơ bản của tiếng Hàn là gì, khác tiếng Việt (SVO) ra sao?', options: ['SVO, giống tiếng Việt', 'SOV — động từ luôn đứng cuối câu', 'VSO — động từ đứng đầu câu', 'Không có trật tự cố định'], correctIndex: 1, explanation: 'Tiếng Hàn là Chủ-Tân-Động (SOV), động từ luôn ở cuối; khi dịch phải đưa động từ về giữa câu theo trật tự SVO của tiếng Việt.' },
  { id: 'q2', question: 'Câu 「제가 어제 산 책이 재미있어요」, mệnh đề định ngữ "tôi mua hôm qua" cần đặt ở đâu khi dịch sang tiếng Việt?', options: ['Trước danh từ "sách", y như tiếng Hàn', 'Sau danh từ "sách", dùng "mà"/"đã"', 'Bỏ hẳn mệnh đề định ngữ', 'Tách thành câu riêng bắt buộc'], correctIndex: 1, explanation: 'Tiếng Việt đặt định ngữ sau danh từ ("Quyển sách mà tôi mua hôm qua"), ngược với tiếng Hàn (định ngữ luôn đứng trước danh từ).' },
  { id: 'q3', question: 'Khi gặp câu bị động tiếng Hàn (-되다/-받다), người dịch nên làm gì?', options: ['Luôn dịch thành "được ... " để giữ đúng thể bị động', 'Chọn chủ động hay bị động tuỳ theo câu nào đọc tự nhiên hơn trong tiếng Việt', 'Bỏ qua không dịch phần đó', 'Giữ nguyên tiếng Hàn trong ngoặc'], correctIndex: 1, explanation: 'Tiếng Việt không bắt buộc giữ thể bị động của tiếng Hàn — ưu tiên câu đọc tự nhiên, có thể chuyển sang chủ động.' },
]);

const c3 = doc('kst401-3-1-sino-korean', '3.1 — Sino-Korean & Sino-Vietnamese correspondences|||3.1 — Từ Hán-Hàn & từ tương ứng Hán-Việt',
  '한자어 (từ Hán-Hàn) thường trùng gốc chữ Hán với từ Hán-Việt (안전=an toàn, 학생=học sinh); nhưng nhiều từ lệch nghĩa/cách dùng (회사≠hội xã, 도서관≠đồ thư quán) — bẫy "bạn giả".',
  [[
    `<span class="eyebrow">KST401 · Chapter 3 · Lesson 3.1</span>
<h2>Sino-Korean &amp; Sino-Vietnamese correspondences</h2>
<h3>Same Chinese-character root, often the same meaning</h3>
<p>Roughly half of the Korean lexicon is <strong>한자어 (hanjaeo — Sino-Korean words)</strong>, built from Chinese characters — the same characters that gave Vietnamese its <strong>Hán-Việt</strong> vocabulary. When both languages borrowed the same character compound, the words often line up directly:</p>
<pre><code>안전(安全) anjeon      = an toàn      (safe)
학생(學生) haksaeng     = học sinh    (student)
가족(家族) gajok        = gia tộc/gia đình  (family)
경제(經濟) gyeongje     = kinh tế     (economy)
정보(情報) jeongbo      = tình báo/thông tin (information)
</code></pre>
<p>Recognizing the Chinese-character root lets you guess an unknown Sino-Korean word's meaning instantly if you know the Sino-Vietnamese cognate — a major reading shortcut at TOPIK 5-6 level.</p>
<h3>False friends: same root, different modern usage</h3>
<p>Not every 한자어 maps cleanly. Korean and Vietnamese sometimes kept different characters in daily use, or one language shifted meaning:</p>
<pre><code>회사(會社) hoesa   Hán-Việt gốc: "hội xã" → nghĩa hiện dùng: công ty
                   (Vietnamese does NOT use "hội xã" for "company")
도서관(圖書館) doseogwan   Hán-Việt gốc: "đồ thư quán" → nghĩa hiện dùng: thư viện
학교(學校) hakgyo   Hán-Việt gốc: "học hiệu" → nghĩa hiện dùng: trường học
</code></pre>
<p>These are translation <strong>"false friends"</strong> — do not translate a Sino-Korean word by transliterating its Hán-Việt reading; always confirm the word Vietnamese speakers actually use today.</p>
<div class="callout"><span class="badge">Method</span> Step 1: split the 한자어 into its Chinese characters. Step 2: guess the literal Hán-Việt reading. Step 3: check whether that literal reading is still natural modern Vietnamese — if not, replace it with the word Vietnamese actually uses (a native compound, or a different Hán-Việt term).</div>`,
    `<span class="eyebrow">KST401 · Chương 3 · Bài 3.1</span>
<h2>Từ Hán-Hàn &amp; từ tương ứng Hán-Việt</h2>
<h3>Cùng gốc chữ Hán, thường cùng nghĩa</h3>
<p>Khoảng một nửa từ vựng tiếng Hàn là <strong>한자어 (hanjaeo — từ Hán-Hàn)</strong>, xây từ chữ Hán — cùng bộ chữ Hán đã tạo ra vốn từ <strong>Hán-Việt</strong> của tiếng Việt. Khi cả hai ngôn ngữ mượn cùng một tổ hợp chữ Hán, từ thường ánh xạ trực tiếp:</p>
<pre><code>안전(安全) anjeon      = an toàn
학생(學生) haksaeng     = học sinh
가족(家族) gajok        = gia tộc/gia đình
경제(經濟) gyeongje     = kinh tế
정보(情報) jeongbo      = tình báo/thông tin
</code></pre>
<p>Nhận ra gốc chữ Hán giúp bạn đoán ngay nghĩa một từ Hán-Hàn lạ nếu biết từ Hán-Việt tương ứng — một lối tắt đọc hiểu quan trọng ở trình độ TOPIK 5-6.</p>
<h3>"Bạn giả": cùng gốc nhưng dùng khác trong tiếng Việt hiện đại</h3>
<p>Không phải 한자어 nào cũng khớp gọn gàng. Tiếng Hàn và tiếng Việt đôi khi giữ lại cách dùng khác nhau trong đời sống, hoặc một bên đã đổi nghĩa:</p>
<pre><code>회사(會社) hoesa   Hán-Việt gốc: "hội xã" → nghĩa dùng thật: công ty
                   (tiếng Việt KHÔNG dùng "hội xã" để chỉ "công ty")
도서관(圖書館) doseogwan   Hán-Việt gốc: "đồ thư quán" → nghĩa dùng thật: thư viện
학교(學校) hakgyo   Hán-Việt gốc: "học hiệu" → nghĩa dùng thật: trường học
</code></pre>
<p>Đây là những <strong>"bạn giả" (false friends)</strong> trong dịch thuật — đừng dịch một từ Hán-Hàn bằng cách phiên âm Hán-Việt của nó theo kiểu máy móc; luôn kiểm tra xem người Việt hôm nay thật sự dùng từ nào.</p>
<div class="callout"><span class="badge">Cách làm</span> Bước 1: tách 한자어 thành các chữ Hán cấu thành. Bước 2: đoán cách đọc Hán-Việt theo nghĩa đen. Bước 3: kiểm tra xem cách đọc đó có còn là tiếng Việt hiện đại tự nhiên không — nếu không, thay bằng từ người Việt thật sự dùng (từ thuần Việt, hoặc một từ Hán-Việt khác).</div>`,
  ]]);

const c3q = quiz('kst401-quiz-3', 'Quiz 3 — Từ Hán-Hàn & Hán-Việt|||Quiz 3 — Từ Hán-Hàn & Hán-Việt', [
  { id: 'q1', question: 'Từ Hán-Hàn 안전(安全) tương ứng trực tiếp với từ Hán-Việt nào?', options: ['Bình an', 'An toàn', 'Yên ổn', 'An ninh'], correctIndex: 1, explanation: '安全 đọc Hán-Việt trực tiếp là "an toàn", khớp cả nghĩa lẫn cách dùng hiện đại.' },
  { id: 'q2', question: 'Vì sao 회사(會社) KHÔNG nên dịch thành "hội xã" dù đó là cách đọc Hán-Việt đúng của các chữ Hán?', options: ['Vì 회사 không phải từ Hán-Hàn', 'Vì "hội xã" không phải từ người Việt hiện đại dùng để chỉ "công ty" — đây là bẫy "bạn giả"', 'Vì tiếng Hàn không có khái niệm công ty', 'Vì phải luôn dịch nghĩa đen mọi từ Hán-Hàn'], correctIndex: 1, explanation: '회사 nghĩa hiện dùng là "công ty"; "hội xã" là cách đọc Hán-Việt gốc nhưng đã không còn được dùng — một ví dụ điển hình về từ Hán-Hàn "bạn giả".' },
  { id: 'q3', question: 'Phương pháp đúng khi gặp một từ Hán-Hàn lạ cần dịch là?', options: ['Tra và dùng ngay cách đọc Hán-Việt theo nghĩa đen, không kiểm tra lại', 'Tách chữ Hán → đoán Hán-Việt → kiểm tra xem đó có phải từ người Việt thật sự dùng không', 'Bỏ qua, không dịch được từ Hán-Hàn', 'Luôn thay bằng từ thuần Việt bất kể ngữ cảnh'], correctIndex: 1, explanation: 'Quy trình ba bước: tách chữ Hán, đoán Hán-Việt, rồi xác nhận cách dùng thật của tiếng Việt hiện đại trước khi chốt bản dịch.' },
]);

const c4 = doc('kst401-4-1-life-info', '4.1 — Everyday & informational texts|||4.1 — Văn bản đời sống & thông tin',
  'Đọc-dịch thông báo (공지사항) & quảng cáo (광고): thể trang trọng -십시오/-바랍니다, cấu trúc thông báo chung cư, mẫu quảng cáo khuyến mãi.',
  [[
    `<span class="eyebrow">KST401 · Chapter 4 · Lesson 4.1</span>
<h2>Everyday &amp; informational texts</h2>
<h3>Notices (공지사항) — the formal imperative register</h3>
<p>Notices use the most formal register: <strong>-십시오 (sipsio — please do)</strong> for polite commands and <strong>-바랍니다 (baramnida — we ask that you...)</strong> for polite requests. Translate this register as formal, impersonal Vietnamese ("xin quý cư dân...", "kính đề nghị...", "vui lòng..."), not casual speech.</p>
<pre><code>[공지사항] 엘리베이터 점검 안내

내일(10월 5일) 오전 9시부터 오후 1시까지
엘리베이터 정기 점검이 있습니다.
점검 시간 동안에는 계단을 이용해 주시기 바랍니다.
불편을 드려 죄송합니다.

naeil(10-wol 5-il) ojeon 9-si-buteo ohu 1-si-kkaji
elibeiteo jeonggi jeomgeom-i itseumnida.
jeomgeom sigan dong-an-eneun gyedan-eul iyonghae jusigi baramnida.
bulpyeon-eul deuryeo joesong-hamnida.

Dịch:
[THÔNG BÁO] Bảo trì thang máy

Từ 9 giờ sáng đến 1 giờ chiều ngày mai (5/10),
thang máy sẽ được bảo trì định kỳ.
Trong thời gian bảo trì, kính mong quý cư dân đi thang bộ.
Chúng tôi xin lỗi vì sự bất tiện này.
</code></pre>
<h3>Ads (광고) — short, persuasive, benefit-first</h3>
<p>Ads compress information and favor short noun-phrase headlines. Translate the headline's punch, not just its words — Vietnamese ad copy is also usually short and benefit-first.</p>
<pre><code>가을맞이 특별 할인! 전 품목 30% 세일
ga-eul-maji teukbyeol halin! jeon pummok 30% seil
= Ưu đãi đón thu! Giảm 30% toàn bộ sản phẩm
</code></pre>
<div class="callout"><span class="badge">Register check</span> An informational/notice text calls for the most formal Vietnamese register available; an ad calls for punchy, short, benefit-first phrasing — matching register is part of <em>nhã</em> (elegance), not decoration.</div>`,
    `<span class="eyebrow">KST401 · Chương 4 · Bài 4.1</span>
<h2>Văn bản đời sống &amp; thông tin</h2>
<h3>Thông báo (공지사항) — văn phong mệnh lệnh trang trọng</h3>
<p>Thông báo dùng văn phong trang trọng nhất: <strong>-십시오 (sipsio — xin hãy)</strong> cho mệnh lệnh lịch sự và <strong>-바랍니다 (baramnida — mong quý vị...)</strong> cho lời đề nghị lịch sự. Dịch văn phong này thành tiếng Việt trang trọng, khách quan ("xin quý cư dân...", "kính đề nghị...", "vui lòng..."), không dùng lời nói thường ngày.</p>
<pre><code>[공지사항] 엘리베이터 점검 안내

내일(10월 5일) 오전 9시부터 오후 1시까지
엘리베이터 정기 점검이 있습니다.
점검 시간 동안에는 계단을 이용해 주시기 바랍니다.
불편을 드려 죄송합니다.

naeil(10-wol 5-il) ojeon 9-si-buteo ohu 1-si-kkaji
elibeiteo jeonggi jeomgeom-i itseumnida.
jeomgeom sigan dong-an-eneun gyedan-eul iyonghae jusigi baramnida.
bulpyeon-eul deuryeo joesong-hamnida.

Dịch:
[THÔNG BÁO] Bảo trì thang máy

Từ 9 giờ sáng đến 1 giờ chiều ngày mai (5/10),
thang máy sẽ được bảo trì định kỳ.
Trong thời gian bảo trì, kính mong quý cư dân đi thang bộ.
Chúng tôi xin lỗi vì sự bất tiện này.
</code></pre>
<h3>Quảng cáo (광고) — ngắn, thuyết phục, lợi ích đi trước</h3>
<p>Quảng cáo nén thông tin và ưa dùng tiêu đề cụm danh từ ngắn. Hãy dịch cái "chất" gây ấn tượng của tiêu đề, không chỉ dịch từng từ — quảng cáo tiếng Việt cũng thường ngắn và đưa lợi ích lên trước.</p>
<pre><code>가을맞이 특별 할인! 전 품목 30% 세일
ga-eul-maji teukbyeol halin! jeon pummok 30% seil
= Ưu đãi đón thu! Giảm 30% toàn bộ sản phẩm
</code></pre>
<div class="callout"><span class="badge">Kiểm tra văn phong</span> Văn bản thông tin/thông báo đòi hỏi văn phong tiếng Việt trang trọng nhất có thể; quảng cáo đòi hỏi câu chữ ngắn gọn, gây ấn tượng, đưa lợi ích lên trước — khớp văn phong là một phần của <em>nhã</em>, không phải trang trí thêm.</div>`,
  ]]);

const c4q = quiz('kst401-quiz-4', 'Quiz 4 — Văn bản đời sống & thông tin|||Quiz 4 — Văn bản đời sống & thông tin', [
  { id: 'q1', question: 'Đuôi câu -바랍니다 trong văn bản thông báo nên dịch theo văn phong nào sang tiếng Việt?', options: ['Thân mật, suồng sã', 'Trang trọng, lịch sự ("kính mong quý vị...", "vui lòng...")', 'Ra lệnh cộc lốc', 'Bỏ qua không cần dịch'], correctIndex: 1, explanation: '-바랍니다 là thể đề nghị lịch sự, trang trọng — cần dịch bằng văn phong trang trọng tương ứng trong tiếng Việt.' },
  { id: 'q2', question: 'Khi dịch tiêu đề quảng cáo ngắn như 「가을맞이 특별 할인!」, điều quan trọng nhất là gì?', options: ['Dịch sát nghĩa đen từng từ dù câu dài dòng', 'Giữ được sự ngắn gọn, gây ấn tượng và đưa lợi ích lên trước, như quảng cáo tiếng Việt', 'Thêm càng nhiều tính từ càng tốt', 'Giữ nguyên tiếng Hàn không dịch tiêu đề'], correctIndex: 1, explanation: 'Quảng cáo cần giữ được "chất" ngắn gọn, thuyết phục — không chỉ dịch nghĩa đen từng từ.' },
  { id: 'q3', question: 'Vì sao việc chọn đúng văn phong (trang trọng cho thông báo, ngắn gọn cho quảng cáo) lại thuộc về tiêu chí nào trong dịch thuật?', options: ['Tín (faithfulness)', 'Đạt (fluency)', 'Nhã (elegance/register)', 'Không thuộc tiêu chí nào'], correctIndex: 2, explanation: 'Khớp đúng văn phong/giọng điệu với bản gốc chính là tiêu chí "nhã" trong tín-đạt-nhã.' },
]);

const c5 = doc('kst401-5-1-news', '5.1 — News & journalistic texts|||5.1 — Văn bản báo chí & tin tức',
  'Đặc điểm văn phong báo chí: tiêu đề rút gọn (bỏ trợ từ), câu trích dẫn "~라고 밝혔다/전했다", số liệu thống kê; ví dụ bản tin kinh tế ngắn.',
  [[
    `<span class="eyebrow">KST401 · Chapter 5 · Lesson 5.1</span>
<h2>News &amp; journalistic texts</h2>
<h3>Headlines drop particles</h3>
<p>Korean news headlines compress grammar — subject/object particles (은/는, 이/가, 을/를) are routinely dropped, and verbs are often nominalized. Reading headlines requires mentally reinserting the missing particles before translating in full sentences.</p>
<pre><code>Headline (particles dropped):   정부, 내년 예산 발표
Full sentence (particles restored): 정부가 내년 예산을 발표했다.
= Chính phủ công bố ngân sách năm sau.
</code></pre>
<h3>Reporting verbs &amp; attribution</h3>
<p>News style attributes claims with fixed verb patterns: <strong>~라고 밝혔다 (rago balkyeotda — stated that...)</strong>, <strong>~라고 전했다 (rago jeonhaetda — reported that...)</strong>, <strong>~로 알려졌다 (ro allyeojyeotda — is known to be...)</strong>. Vietnamese journalism has its own equivalents ("cho biết", "theo...", "được cho là") — match register and match which party the statement is attributed to.</p>
<pre><code>한국은행은 올해 경제성장률이 2%대에 머물 것이라고 밝혔다.
Hanguk eunhaeng-eun olhae gyeongje-seongjangnyul-i 2%-dae-e meomul geos-ira-go balkyeotda.
= Ngân hàng Hàn Quốc cho biết tăng trưởng kinh tế năm nay sẽ ở mức khoảng 2%.
</code></pre>
<h3>Numbers &amp; statistics</h3>
<p>Korean uses both native (하나/둘/셋) and Sino-Korean (일/이/삼) number systems; news and statistics almost always use the <strong>Sino-Korean system</strong> with 만 (10,000) as the counting unit, not 1,000 — a common source of a factor-of-10 translation error if converted carelessly (10,000 = 만; 100,000,000 = 억).</p>
<div class="callout"><span class="badge">Danger zone</span> 만 (man) = 10,000, not 1,000 — always double-check large Korean numbers against this base-10,000 system before writing the Vietnamese figure, especially in economic news.</div>`,
    `<span class="eyebrow">KST401 · Chương 5 · Bài 5.1</span>
<h2>Văn bản báo chí &amp; tin tức</h2>
<h3>Tiêu đề rút gọn trợ từ</h3>
<p>Tiêu đề báo tiếng Hàn nén ngữ pháp — trợ từ chủ ngữ/tân ngữ (은/는, 이/가, 을/를) thường bị lược bỏ, động từ hay được danh từ hoá. Đọc tiêu đề đòi hỏi tự khôi phục trợ từ còn thiếu trong đầu trước khi dịch thành câu đầy đủ.</p>
<pre><code>Tiêu đề (lược trợ từ):   정부, 내년 예산 발표
Câu đầy đủ (khôi phục trợ từ): 정부가 내년 예산을 발표했다.
= Chính phủ công bố ngân sách năm sau.
</code></pre>
<h3>Động từ tường thuật &amp; nguồn trích dẫn</h3>
<p>Văn phong báo chí gán nguồn phát ngôn bằng mẫu cố định: <strong>~라고 밝혔다 (rago balkyeotda — tuyên bố rằng...)</strong>, <strong>~라고 전했다 (rago jeonhaetda — đưa tin rằng...)</strong>, <strong>~로 알려졌다 (ro allyeojyeotda — được biết là...)</strong>. Báo chí tiếng Việt có mẫu tương đương ("cho biết", "theo...", "được cho là") — cần khớp văn phong và khớp đúng ai là người phát ngôn.</p>
<pre><code>한국은행은 올해 경제성장률이 2%대에 머물 것이라고 밝혔다.
Hanguk eunhaeng-eun olhae gyeongje-seongjangnyul-i 2%-dae-e meomul geos-ira-go balkyeotda.
= Ngân hàng Hàn Quốc cho biết tăng trưởng kinh tế năm nay sẽ ở mức khoảng 2%.
</code></pre>
<h3>Số liệu &amp; thống kê</h3>
<p>Tiếng Hàn dùng cả hệ số đếm thuần Hàn (하나/둘/셋) lẫn hệ Hán-Hàn (일/이/삼); tin tức &amp; số liệu hầu như luôn dùng <strong>hệ Hán-Hàn</strong> với đơn vị đếm 만 (10.000), không phải 1.000 — nguồn lỗi dịch lệch 10 lần thường gặp nếu quy đổi bất cẩn (10.000 = 만; 100.000.000 = 억).</p>
<div class="callout"><span class="badge">Vùng nguy hiểm</span> 만 (man) = 10.000, không phải 1.000 — luôn kiểm tra lại số liệu lớn của tiếng Hàn theo hệ đếm cơ số 10.000 này trước khi viết ra con số tiếng Việt, đặc biệt trong tin kinh tế.</div>`,
  ]]);

const c5q = quiz('kst401-quiz-5', 'Quiz 5 — Văn bản báo chí|||Quiz 5 — Văn bản báo chí', [
  { id: 'q1', question: 'Vì sao tiêu đề báo tiếng Hàn thường khó đọc hơn câu văn thường?', options: ['Vì luôn viết bằng chữ Hán', 'Vì trợ từ chủ ngữ/tân ngữ thường bị lược bỏ, phải tự khôi phục khi đọc', 'Vì không có động từ', 'Vì luôn ở thể bị động'], correctIndex: 1, explanation: 'Tiêu đề nén ngữ pháp bằng cách bỏ trợ từ (은/는, 이/가, 을/를) — người đọc phải tự khôi phục trước khi hiểu/dịch trọn câu.' },
  { id: 'q2', question: 'Mẫu 「~라고 밝혔다」trong văn bản báo chí dùng để làm gì?', options: ['Diễn tả cảm xúc của người viết', 'Gán một phát ngôn/tuyên bố cho một nguồn cụ thể ("... cho biết rằng...")', 'Đánh dấu câu hỏi', 'Đánh dấu số liệu thống kê'], correctIndex: 1, explanation: '~라고 밝혔다 (rago balkyeotda) là mẫu tường thuật gán lời tuyên bố cho một nguồn — dịch bằng "... cho biết" hay tương đương.' },
  { id: 'q3', question: 'Đơn vị đếm 만 (man) trong số liệu tiếng Hàn tương ứng với bao nhiêu?', options: ['1.000', '10.000', '100.000', '1.000.000'], correctIndex: 1, explanation: '만 = 10.000 (không phải 1.000) — nhầm đơn vị này là lỗi dịch số liệu kinh điển, đặc biệt trong tin kinh tế.' },
]);

const c6 = doc('kst401-6-1-economic-admin', '6.1 — Economic, business & administrative texts|||6.1 — Văn bản kinh tế - thương mại - hành chính',
  'Hợp đồng (계약서), công văn (공문) — công thức mở đầu 귀하/관련하여, điều khoản cố định; báo cáo kinh tế; thuật ngữ thương mại (수출입, 매출, 계약).',
  [[
    `<span class="eyebrow">KST401 · Chapter 6 · Lesson 6.1</span>
<h2>Economic, business &amp; administrative texts</h2>
<h3>Fixed opening formulas</h3>
<p>Business/administrative documents open with set phrases that must be rendered with equally set Vietnamese formulas, not translated word-by-word:</p>
<pre><code>귀하 (gwiha)                 = kính gửi quý ông/bà / kính gửi Quý khách
~에 관련하여 (e gwallyeonhayeo) = liên quan đến việc .../về việc ...
아래와 같이 안내드립니다      = xin thông báo như sau
(arae-wa gat-i annae-deurimnida)
</code></pre>
<h3>Contract clause language (계약서)</h3>
<p>Contracts use precise, unambiguous verbs: <strong>~하여야 한다 (hayeoya handa — must)</strong>, <strong>~할 수 없다 (hal su eopda — may not)</strong>, <strong>~에 한하여 (e hanhayeo — only in the case of)</strong>. A translated contract must preserve obligation strength exactly — do not soften "must" into "should", and do not drop a scope-limiting phrase like ~에 한하여.</p>
<pre><code>갑은 계약 체결일로부터 30일 이내에 대금을 지급하여야 한다.
gab-eun gyeyak chegyeol-il-lo-buteo 30-il inae-e daegeum-eul jigeup-hayeoya handa.
= Bên A phải thanh toán trong vòng 30 ngày kể từ ngày ký hợp đồng.
</code></pre>
<h3>Business &amp; economic vocabulary</h3>
<pre><code>수출입 (suchul-ip)   = xuất nhập khẩu
매출 (maechul)       = doanh thu
계약 (gyeyak)        = hợp đồng
공문 (gongmun)       = công văn
지급 (jigeup)        = thanh toán / chi trả
</code></pre>
<div class="callout"><span class="badge">No shortcuts</span> Legal/administrative register is exactly where mistranslating a modal verb (must vs may vs should) or a scope phrase can change the real-world meaning of a document — treat these texts with the highest fidelity, even at the cost of natural flow.</div>`,
    `<span class="eyebrow">KST401 · Chương 6 · Bài 6.1</span>
<h2>Văn bản kinh tế - thương mại - hành chính</h2>
<h3>Công thức mở đầu cố định</h3>
<p>Văn bản thương mại/hành chính mở đầu bằng những cụm cố định, cần dịch bằng công thức tiếng Việt tương ứng, không dịch từng chữ:</p>
<pre><code>귀하 (gwiha)                 = kính gửi quý ông/bà / kính gửi Quý khách
~에 관련하여 (e gwallyeonhayeo) = liên quan đến việc .../về việc ...
아래와 같이 안내드립니다      = xin thông báo như sau
(arae-wa gat-i annae-deurimnida)
</code></pre>
<h3>Ngôn ngữ điều khoản hợp đồng (계약서)</h3>
<p>Hợp đồng dùng động từ chính xác, không mập mờ: <strong>~하여야 한다 (hayeoya handa — phải)</strong>, <strong>~할 수 없다 (hal su eopda — không được)</strong>, <strong>~에 한하여 (e hanhayeo — chỉ trong trường hợp)</strong>. Bản dịch hợp đồng phải giữ đúng mức độ ràng buộc — không làm mềm "phải" thành "nên", và không được bỏ sót cụm giới hạn phạm vi như ~에 한하여.</p>
<pre><code>갑은 계약 체결일로부터 30일 이내에 대금을 지급하여야 한다.
gab-eun gyeyak chegyeol-il-lo-buteo 30-il inae-e daegeum-eul jigeup-hayeoya handa.
= Bên A phải thanh toán trong vòng 30 ngày kể từ ngày ký hợp đồng.
</code></pre>
<h3>Từ vựng kinh tế &amp; thương mại</h3>
<pre><code>수출입 (suchul-ip)   = xuất nhập khẩu
매출 (maechul)       = doanh thu
계약 (gyeyak)        = hợp đồng
공문 (gongmun)       = công văn
지급 (jigeup)        = thanh toán / chi trả
</code></pre>
<div class="callout"><span class="badge">Không được tuỳ tiện</span> Văn phong pháp lý/hành chính chính là nơi dịch sai một động từ tình thái (phải vs được phép vs nên) hay một cụm giới hạn phạm vi có thể làm thay đổi ý nghĩa thực tế của cả văn bản — dịch những văn bản này với độ trung thực cao nhất, dù có phải hy sinh chút tự nhiên.</div>`,
  ]]);

const c6q = quiz('kst401-quiz-6', 'Quiz 6 — Kinh tế - thương mại - hành chính|||Quiz 6 — Kinh tế - thương mại - hành chính', [
  { id: 'q1', question: 'Cụm 「귀하」trong văn bản hành chính nên dịch bằng công thức nào của tiếng Việt?', options: ['Dịch nghĩa đen "quý hạ"', 'Kính gửi quý ông/bà (công thức mở đầu văn bản trang trọng)', 'Bạn thân mến', 'Không cần dịch, giữ nguyên tiếng Hàn'], correctIndex: 1, explanation: '귀하 (gwiha) là công thức xưng hô trang trọng mở đầu văn bản, tương ứng với "kính gửi quý ông/bà" trong tiếng Việt.' },
  { id: 'q2', question: 'Trong câu hợp đồng, đuôi 「~하여야 한다」nên dịch với mức độ ràng buộc nào?', options: ['"nên" (khuyến nghị, không bắt buộc)', '"phải" (bắt buộc — giữ đúng mức độ ràng buộc gốc)', '"có thể" (tuỳ chọn)', '"không được" (cấm)'], correctIndex: 1, explanation: '~하여야 한다 (hayeoya handa) là nghĩa vụ bắt buộc — dịch thành "nên" sẽ làm sai lệch tính ràng buộc pháp lý của điều khoản.' },
  { id: 'q3', question: 'Vì sao dịch văn bản pháp lý/hành chính đòi hỏi độ trung thực (tín) cao nhất, kể cả khi câu văn kém tự nhiên hơn?', options: ['Vì văn bản pháp lý luôn ngắn hơn', 'Vì dịch sai một động từ tình thái (phải/nên/được phép) có thể làm thay đổi nghĩa vụ pháp lý thật của văn bản', 'Vì người đọc văn bản pháp lý không quan tâm đến nghĩa', 'Vì văn bản pháp lý không có động từ tình thái'], correctIndex: 1, explanation: 'Một điều khoản hợp đồng dịch sai mức ràng buộc (phải vs nên vs được phép) có thể thay đổi hẳn hậu quả pháp lý — nên tín phải ưu tiên hơn cả sự trôi chảy ở đây.' },
]);

const c7 = doc('kst401-7-1-literature-idioms', '7.1 — Literary translation & idioms/proverbs (속담)|||7.1 — Dịch văn học & thành ngữ, tục ngữ (속담)',
  'Dịch văn học: giữ nhịp điệu, hình ảnh; chiến lược dịch thành ngữ/tục ngữ — nghĩa đen vs tìm câu tương đương trong tiếng Việt (하늘의 별 따기, 믿는 도끼에 발등 찍힌다).',
  [[
    `<span class="eyebrow">KST401 · Chapter 7 · Lesson 7.1</span>
<h2>Literary translation &amp; idioms/proverbs (속담)</h2>
<h3>Literary text: keep the rhythm and image, not just the words</h3>
<p>Literary Korean often relies on rhythm, repetition and imagery that a literal translation destroys. When translating a poetic or narrative line, first identify <em>which image or feeling</em> the sentence exists to deliver, then rebuild that image in natural Vietnamese — even if the sentence must be restructured more than a technical text would allow.</p>
<pre><code>바람이 불면 나뭇잎이 흔들리듯, 마음도 그렇게 흔들렸다.
baram-i bulmyeon namunnip-i heundeullideut, ma-eum-do geuleoke heundeullyeotda.
= Như lá cây rung rinh khi gió thổi, lòng tôi cũng chao đảo như thế.
</code></pre>
<h3>Idioms &amp; proverbs (속담): two strategies</h3>
<p>For a Korean idiom/proverb, choose one of two strategies:</p>
<ul>
<li><strong>Find a Vietnamese proverb with the same meaning</strong> (best when one exists — preserves both meaning and the "proverb feel").</li>
<li><strong>Translate the meaning plainly</strong> (when no good Vietnamese equivalent exists — never translate a proverb word-by-word, since the literal images rarely make sense in Vietnamese).</li>
</ul>
<pre><code>하늘의 별 따기
haneul-ui byeol ttagi   (literally: "plucking a star from the sky")
= khó như hái sao trên trời   (tương đương gần, giữ hình ảnh)

믿는 도끼에 발등 찍힌다
mitneun dokki-e baldeung jjikhinda
(literally: "the axe you trusted chops your own foot")
= bị chính người mình tin phản bội  (dịch nghĩa)
  ~ gần với "nuôi ong tay áo" (tương đương văn hoá, dùng thận trọng)

가는 말이 고와야 오는 말이 곱다
ganeun mal-i gowaya oneun mal-i gopda
(literally: "the words that go must be pretty for the words that come to be pretty")
= lời nói chẳng mất tiền mua, lựa lời mà nói cho vừa lòng nhau  (tương đương văn hoá)
</code></pre>
<div class="callout"><span class="badge">Caution</span> A cultural-equivalent proverb (like "nuôi ong tay áo") carries its OWN cultural images — use it only when the meaning truly matches; otherwise a plain-meaning translation is safer and more faithful (<em>tín</em>) than a mismatched proverb.</div>`,
    `<span class="eyebrow">KST401 · Chương 7 · Bài 7.1</span>
<h2>Dịch văn học &amp; thành ngữ, tục ngữ (속담)</h2>
<h3>Văn bản văn học: giữ nhịp điệu &amp; hình ảnh, không chỉ giữ từ</h3>
<p>Tiếng Hàn văn học thường dựa vào nhịp điệu, phép lặp và hình ảnh mà một bản dịch nghĩa đen sẽ phá vỡ. Khi dịch một câu văn/thơ, trước tiên hãy xác định <em>hình ảnh hoặc cảm xúc</em> mà câu đó muốn truyền tải, rồi dựng lại hình ảnh đó bằng tiếng Việt tự nhiên — kể cả khi phải tái cấu trúc câu nhiều hơn mức cho phép ở văn bản kỹ thuật.</p>
<pre><code>바람이 불면 나뭇잎이 흔들리듯, 마음도 그렇게 흔들렸다.
baram-i bulmyeon namunnip-i heundeullideut, ma-eum-do geuleoke heundeullyeotda.
= Như lá cây rung rinh khi gió thổi, lòng tôi cũng chao đảo như thế.
</code></pre>
<h3>Thành ngữ &amp; tục ngữ (속담): hai chiến lược</h3>
<p>Với một thành ngữ/tục ngữ tiếng Hàn, chọn một trong hai chiến lược:</p>
<ul>
<li><strong>Tìm một câu tục ngữ tiếng Việt cùng nghĩa</strong> (tốt nhất khi có sẵn — giữ được cả nghĩa lẫn "chất tục ngữ").</li>
<li><strong>Dịch thẳng nghĩa</strong> (khi không có câu tương đương tốt trong tiếng Việt — tuyệt đối không dịch tục ngữ theo từng chữ, vì hình ảnh nghĩa đen hiếm khi có nghĩa trong tiếng Việt).</li>
</ul>
<pre><code>하늘의 별 따기
haneul-ui byeol ttagi   (nghĩa đen: "hái một ngôi sao trên trời")
= khó như hái sao trên trời   (tương đương gần, giữ hình ảnh)

믿는 도끼에 발등 찍힌다
mitneun dokki-e baldeung jjikhinda
(nghĩa đen: "cái rìu mình tin tưởng lại chặt vào chân mình")
= bị chính người mình tin phản bội  (dịch nghĩa)
  ~ gần với "nuôi ong tay áo" (tương đương văn hoá, dùng thận trọng)

가는 말이 고와야 오는 말이 곱다
ganeun mal-i gowaya oneun mal-i gopda
(nghĩa đen: "lời đi phải đẹp thì lời đến mới đẹp")
= lời nói chẳng mất tiền mua, lựa lời mà nói cho vừa lòng nhau  (tương đương văn hoá)
</code></pre>
<div class="callout"><span class="badge">Thận trọng</span> Một câu tục ngữ tương đương văn hoá (như "nuôi ong tay áo") mang theo hình ảnh văn hoá RIÊNG của nó — chỉ dùng khi nghĩa thật sự khớp; nếu không, dịch thẳng nghĩa an toàn hơn và trung thực (<em>tín</em>) hơn một câu tục ngữ khập khiễng.</div>`,
  ]]);

const c7q = quiz('kst401-quiz-7', 'Quiz 7 — Văn học & thành ngữ tục ngữ|||Quiz 7 — Văn học & thành ngữ tục ngữ', [
  { id: 'q1', question: 'Khi dịch một câu văn học có nhịp điệu và hình ảnh, ưu tiên hàng đầu của người dịch là gì?', options: ['Giữ đúng số từ và trật tự từ như bản gốc', 'Dựng lại hình ảnh/cảm xúc của câu bằng tiếng Việt tự nhiên, dù phải tái cấu trúc câu', 'Dịch từng chữ để đảm bảo không thiếu chữ nào', 'Bỏ hết phần miêu tả, chỉ giữ ý chính'], correctIndex: 1, explanation: 'Văn học ưu tiên tái tạo hình ảnh/cảm xúc, không phải sao chép cấu trúc câu từng chữ.' },
  { id: 'q2', question: 'Tục ngữ 「하늘의 별 따기」(nghĩa đen "hái sao trên trời") nên dịch theo cách nào?', options: ['Dịch nghĩa đen từng chữ, không cần tìm câu tương đương', 'Dùng hình ảnh tương đương gần trong tiếng Việt: "khó như hái sao trên trời"', 'Bỏ qua không dịch vì không có tương đương', 'Thay bằng một câu tục ngữ tiếng Việt hoàn toàn không liên quan miễn là có vần'], correctIndex: 1, explanation: 'Hình ảnh "hái sao trên trời" giữ được nguyên nghĩa và cách diễn đạt gần với tiếng Hàn, nên dịch tương đương gần là phù hợp nhất.' },
  { id: 'q3', question: 'Vì sao cần thận trọng khi dùng một câu tục ngữ tiếng Việt có sẵn (như "nuôi ong tay áo") để thay cho một câu tục ngữ tiếng Hàn?', options: ['Vì tục ngữ Việt Nam luôn dài hơn', 'Vì câu tục ngữ Việt mang theo hình ảnh văn hoá riêng, chỉ nên dùng khi nghĩa thật sự khớp', 'Vì tục ngữ không bao giờ được phép dịch', 'Vì tục ngữ Hàn Quốc không có nghĩa bóng'], correctIndex: 1, explanation: 'Một câu tục ngữ tương đương mang sắc thái văn hoá riêng — dùng sai ngữ cảnh có thể làm lệch nghĩa; nếu không chắc, dịch thẳng nghĩa an toàn hơn.' },
]);

const c8 = doc('kst401-8-1-review', '8.1 — Review: long-passage practice & common errors|||8.1 — Ôn tập: thực hành đoạn dài & lỗi thường gặp',
  'Thực hành dịch một đoạn dài kết hợp mọi kỹ năng (tín-đạt-nhã, đổi trật tự, Hán-Hàn, văn phong); tổng hợp 5 lỗi dịch thường gặp của người Việt học tiếng Hàn.',
  [[
    `<span class="eyebrow">KST401 · Chapter 8 · Lesson 8.1</span>
<h2>Review: long-passage practice &amp; common errors</h2>
<h3>Practice passage (TOPIK-style, level 5-6)</h3>
<pre><code>최근 한 조사에 따르면 20대 소비자들이 온라인 쇼핑을 이용하는
비율이 눈에 띄게 늘어난 것으로 나타났다. 전문가들은 이러한
현상이 코로나19 이후 소비 습관의 변화 때문이라고 분석했다.

choegeun han josa-e ttareumyeon 20-dae sobijadeul-i online
syoping-eul iyonghaneun biyul-i nun-e ttige neureonan geos-euro
natanatda. jeonmunga-deul-eun ireohan hyeonsang-i corona19
ihu sobi seupgwan-ui byeonhwa ttaemun-ira-go bunseokhaetda.

Dịch:
Theo một khảo sát gần đây, tỷ lệ người tiêu dùng trong độ tuổi
20 sử dụng mua sắm trực tuyến đã tăng lên rõ rệt. Các chuyên gia
phân tích rằng hiện tượng này là do sự thay đổi trong thói quen
tiêu dùng sau đại dịch COVID-19.
</code></pre>
<p>Notice how the translation applies several chapters at once: verb moved to natural SVO position (Ch.2), Sino-Korean 소비 습관/전문가 rendered as their natural Sino-Vietnamese cognates "thói quen tiêu dùng/chuyên gia" (Ch.3), and the reporting verb 분석했다 → "phân tích rằng" (Ch.5).</p>
<h3>Five common errors Vietnamese learners make</h3>
<ul>
<li><strong>1. Word-for-word calque</strong> — keeping Korean SOV order or copying an adnominal clause's position instead of reordering (Ch.2).</li>
<li><strong>2. Sino-Korean false friends</strong> — transliterating the literal Hán-Việt reading instead of the word Vietnamese actually uses, e.g. 회사 → "hội xã" instead of "công ty" (Ch.3).</li>
<li><strong>3. Flattening honorific register</strong> — translating both -습니다 and -아요 the same way, losing the formality gap the source intended (Ch.2, Ch.4).</li>
<li><strong>4. Misreading large numbers</strong> — confusing 만 (10,000) with 1,000, especially in economic/news texts (Ch.5).</li>
<li><strong>5. Literal idiom translation</strong> — translating a proverb's literal images instead of its meaning or a real Vietnamese equivalent (Ch.7).</li>
</ul>
<div class="callout"><span class="badge">Self-check before submitting a translation</span> Read your Vietnamese OUT LOUD without looking at the Korean — if any sentence sounds odd, unnatural, or requires a second read, go back and fix it. A translation is only finished when it reads as if it were originally written in Vietnamese.</div>`,
    `<span class="eyebrow">KST401 · Chương 8 · Bài 8.1</span>
<h2>Ôn tập: thực hành đoạn dài &amp; lỗi thường gặp</h2>
<h3>Đoạn thực hành (kiểu TOPIK, bậc 5-6)</h3>
<pre><code>최근 한 조사에 따르면 20대 소비자들이 온라인 쇼핑을 이용하는
비율이 눈에 띄게 늘어난 것으로 나타났다. 전문가들은 이러한
현상이 코로나19 이후 소비 습관의 변화 때문이라고 분석했다.

choegeun han josa-e ttareumyeon 20-dae sobijadeul-i online
syoping-eul iyonghaneun biyul-i nun-e ttige neureonan geos-euro
natanatda. jeonmunga-deul-eun ireohan hyeonsang-i corona19
ihu sobi seupgwan-ui byeonhwa ttaemun-ira-go bunseokhaetda.

Dịch:
Theo một khảo sát gần đây, tỷ lệ người tiêu dùng trong độ tuổi
20 sử dụng mua sắm trực tuyến đã tăng lên rõ rệt. Các chuyên gia
phân tích rằng hiện tượng này là do sự thay đổi trong thói quen
tiêu dùng sau đại dịch COVID-19.
</code></pre>
<p>Chú ý bản dịch này áp dụng nhiều chương cùng lúc: động từ được đưa về đúng vị trí SVO tự nhiên (Chương 2), từ Hán-Hàn 소비 습관/전문가 được dịch bằng từ Hán-Việt tương ứng tự nhiên "thói quen tiêu dùng/chuyên gia" (Chương 3), và động từ tường thuật 분석했다 → "phân tích rằng" (Chương 5).</p>
<h3>Năm lỗi thường gặp của người Việt học dịch tiếng Hàn</h3>
<ul>
<li><strong>1. Dịch rập khuôn từng chữ (calque)</strong> — giữ nguyên trật tự SOV của tiếng Hàn hoặc giữ nguyên vị trí mệnh đề định ngữ thay vì đảo trật tự (Chương 2).</li>
<li><strong>2. "Bạn giả" Hán-Hàn</strong> — phiên âm Hán-Việt theo nghĩa đen thay vì dùng từ người Việt thật sự dùng, vd 회사 → "hội xã" thay vì "công ty" (Chương 3).</li>
<li><strong>3. San bằng bậc kính ngữ</strong> — dịch cả -습니다 lẫn -아요 theo cùng một cách, làm mất khoảng cách trang trọng mà bản gốc muốn thể hiện (Chương 2, 4).</li>
<li><strong>4. Đọc sai số lớn</strong> — nhầm 만 (10.000) với 1.000, đặc biệt trong văn bản kinh tế/tin tức (Chương 5).</li>
<li><strong>5. Dịch tục ngữ theo nghĩa đen</strong> — dịch hình ảnh nghĩa đen của tục ngữ thay vì dịch ý nghĩa hoặc tìm câu tương đương thật trong tiếng Việt (Chương 7).</li>
</ul>
<div class="callout"><span class="badge">Tự kiểm trước khi nộp bản dịch</span> Đọc to bản tiếng Việt của bạn mà KHÔNG nhìn lại bản tiếng Hàn — nếu câu nào nghe lạ tai, không tự nhiên, hoặc phải đọc lại mới hiểu, hãy quay lại sửa. Một bản dịch chỉ thật sự hoàn thành khi đọc lên như thể nó được viết bằng tiếng Việt ngay từ đầu.</div>`,
  ]]);

const c8q = quiz('kst401-quiz-8', 'Quiz 8 — Ôn tập tổng hợp|||Quiz 8 — Ôn tập tổng hợp', [
  { id: 'q1', question: 'Trong đoạn thực hành, cụm 소비 습관 được dịch tự nhiên thành "thói quen tiêu dùng" nhờ áp dụng kỹ năng ở chương nào?', options: ['Chương 1 — tiêu chí dịch', 'Chương 3 — từ Hán-Hàn & Hán-Việt', 'Chương 5 — văn phong báo chí', 'Chương 7 — thành ngữ tục ngữ'], correctIndex: 1, explanation: '소비(消費)/습관(習慣) là từ Hán-Hàn, dịch bằng từ Hán-Việt tự nhiên tương ứng — đúng nội dung Chương 3.' },
  { id: 'q2', question: 'Lỗi nào sau đây KHÔNG nằm trong 5 lỗi thường gặp được tổng kết ở chương ôn tập?', options: ['Dịch rập khuôn từng chữ, giữ nguyên trật tự SOV', 'Nhầm đơn vị 만 (10.000) với 1.000', 'Dùng quá nhiều từ điển khi dịch', 'Dịch tục ngữ theo nghĩa đen thay vì theo ý nghĩa'], correctIndex: 2, explanation: '"Dùng quá nhiều từ điển" không phải một trong 5 lỗi được liệt kê — dùng từ điển hợp lý là cần thiết, không phải lỗi.' },
  { id: 'q3', question: 'Cách tự kiểm bản dịch được khuyên trong chương ôn tập là gì?', options: ['So khớp số từ tiếng Việt với số từ tiếng Hàn', 'Đọc to bản tiếng Việt mà không nhìn bản gốc, sửa câu nào nghe không tự nhiên', 'Dịch lại từ tiếng Việt sang tiếng Hàn để đối chiếu', 'Chỉ kiểm chính tả, không cần đọc lại nghĩa'], correctIndex: 1, explanation: 'Đọc to bản dịch độc lập với bản gốc là cách kiểm tra tiêu chí "đạt" (tự nhiên) hiệu quả nhất.' },
]);

export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    courseCode: 'KST401',
    slug: 'kst401-oc-dich-tieng-han',
    title: 'Đọc dịch tiếng Hàn',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KST401.webp',
    shortDescription: 'Advanced Korean reading & translation (TOPIK 5-6) — reading skills, tín-đạt-nhã translation criteria, SOV-to-SVO reordering, Sino-Korean vocabulary, everyday/news/business texts, literature & proverbs (속담), long-passage review.|||Đọc-dịch tiếng Hàn nâng cao (TOPIK 5-6) — kỹ năng đọc, tiêu chí tín-đạt-nhã, đổi trật tự SOV-SVO, từ Hán-Hàn, văn bản đời sống/báo chí/kinh tế-hành chính, văn học & tục ngữ (속담), ôn tập đoạn dài.',
    description: 'Môn <strong>KST401 — Korean Reading &amp; Translation / Đọc dịch tiếng Hàn</strong> (kỳ 7, ngành Ngôn ngữ Hàn) rèn đọc hiểu &amp; dịch thuật ở <strong>trình độ nâng cao (TOPIK 5-6)</strong>. Từ <strong>kỹ năng đọc &amp; tiêu chí dịch tín-đạt-nhã</strong> → <strong>khác biệt cấu trúc Hàn-Việt</strong> (SOV/SVO, định ngữ, bị động, kính ngữ) → <strong>từ Hán-Hàn &amp; tương ứng Hán-Việt</strong> → dịch <strong>văn bản đời sống, báo chí, kinh tế-thương mại-hành chính</strong> → <strong>văn học &amp; thành ngữ tục ngữ (속담)</strong> → <strong>ôn tập dịch đoạn dài &amp; lỗi thường gặp</strong>. Mỗi đoạn đọc có Hangeul (한글) + romaja + bản dịch tiếng Việt song song, kèm quiz mỗi chương.',
    whatYouLearn: 'Kỹ thuật đọc 훑어읽기/찾아읽기/꼼꼼히 읽기 & suy luận ngữ cảnh; tiêu chí dịch tín-đạt-nhã & tương đương động/hình thức; đổi trật tự SOV → SVO, chuyển định ngữ ra sau danh từ, xử lý bị động & kính ngữ; nhận diện từ Hán-Hàn & tránh bẫy "bạn giả" Hán-Việt; dịch thông báo/quảng cáo, tin tức (mẫu tường thuật ~라고 밝혔다, hệ số 만=10.000), hợp đồng/công văn (động từ tình thái ràng buộc); dịch văn học giữ hình ảnh, xử lý thành ngữ tục ngữ (속담); tự kiểm bản dịch & nhận diện 5 lỗi thường gặp.',
    requirements: 'Đã hoàn thành các môn tiếng Hàn trình độ trung-cao cấp (tương đương TOPIK 4 trở lên), đọc thông thạo Hangeul.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình trích dẫn, tài liệu chính thức, YouTube, lộ trình tự học.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'TOPIK 5-6, 8 chương, cách trình bày Hangeul + romaja + dịch.', lessons: [intro] },
    { title: 'Chương 1 — Kỹ năng đọc & tiêu chí dịch|||Chapter 1 — Reading skills & criteria', description: 'Đọc lướt/quét/kỹ, tín-đạt-nhã.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Khác biệt cấu trúc & trật tự|||Chapter 2 — Structure & reordering', description: 'SOV/SVO, định ngữ, bị động, kính ngữ.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Từ Hán-Hàn & Hán-Việt|||Chapter 3 — Sino-Korean & Sino-Vietnamese', description: 'Từ tương ứng & bẫy "bạn giả".', lessons: [c3, c3q] },
    { title: 'Chương 4 — Văn bản đời sống & thông tin|||Chapter 4 — Everyday & informational texts', description: 'Thông báo, quảng cáo.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Văn bản báo chí & tin tức|||Chapter 5 — News & journalistic texts', description: 'Tiêu đề, tường thuật, số liệu.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Kinh tế - thương mại - hành chính|||Chapter 6 — Economic, business & admin texts', description: 'Hợp đồng, công văn, thuật ngữ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Văn học & thành ngữ tục ngữ|||Chapter 7 — Literature & idioms/proverbs', description: 'Nhịp điệu, hình ảnh, 속담.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ôn tập: đoạn dài & lỗi thường gặp|||Chapter 8 — Review: long passages & errors', description: 'Thực hành tổng hợp, 5 lỗi thường gặp.', lessons: [c8, c8q] },
  ],
};
