/**
 * KIL301 — Introduction to Korean Linguistics / Dẫn luận ngôn ngữ học tiếng Hàn.
 * Ngành Ngôn ngữ Hàn, FPTU, Kỳ 4. 8 chương lý thuyết ngôn ngữ học + ví dụ tiếng
 * Hàn thật (Hangeul UTF-8 + romaja + nghĩa Việt). Giữ NGUYÊN slug/semester/thumb.
 * ⚠️ KHÔNG backtick/${ lồng nhau; "\n"→\\n trong pre/code.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('kil301-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách tham khảo (Lee & Ramsey), từ điển & tài liệu chính thức miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">KIL301 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to study Korean linguistics — typology, phonology, Hangeul, morphology, syntax, honorifics, vocabulary, semantics and dialects — in one place. The full official slides &amp; giáo trình live on <strong>FLM</strong>; below are free, legal references used to build this course.</p>
<h3>📘 Cited references (giáo trình, not uploaded here)</h3>
<ul>
<li><em>한국어학의 이해 (Understanding Korean Linguistics)</em> — standard Korean-language introductory linguistics textbook.</li>
<li><em>The Korean Language</em> — Iksop Lee &amp; S. Robert Ramsey (SUNY Press) — the standard English-language reference on Korean structure and history.</li>
<li><em>외국어로서의 한국어학 (Korean Linguistics as a Foreign Language)</em> — applied-linguistics angle for teaching/learning Korean.</li>
</ul>
<h3>📘 Official slides &amp; giáo trình</h3>
<p>The official FPTU giáo trình &amp; lecture slides for KIL301 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://www.korean.go.kr/" target="_blank" rel="noopener">국립국어원 — National Institute of Korean Language</a> — the authority on standard Korean (표준어), spelling and pronunciation rules.</li>
<li><a href="https://ko.dict.naver.com/" target="_blank" rel="noopener">Naver Korean Dictionary</a> — example sentences and Hanja breakdowns for Sino-Korean words.</li>
<li><a href="https://en.wikipedia.org/wiki/Korean_language" target="_blank" rel="noopener">Korean language — overview (Wikipedia)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@talktomeinkorean" target="_blank" rel="noopener">Talk To Me In Korean</a> — grammar explained with clear structural breakdowns.</li>
<li><a href="https://www.youtube.com/@KoreanUnnie" target="_blank" rel="noopener">Korean Unnie</a> — pronunciation &amp; everyday usage.</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://papago.naver.com/" target="_blank" rel="noopener">Papago</a> — Korean-aware machine translation, good for checking particle usage.</li>
<li><a href="https://ko.dict.naver.com/#/hanja" target="_blank" rel="noopener">Naver Hanja dictionary</a> — look up the Chinese character behind a Sino-Korean word.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — typology (agglutinative), Hangeul's design, the consonant/vowel inventory.</li>
<li><strong>Structure</strong> — particles &amp; endings (morphology), SOV word order (syntax).</li>
<li><strong>Social layer</strong> — the honorific system, the three vocabulary strata.</li>
<li><strong>Go deeper</strong> — semantics/pragmatics, regional dialects (방언), and how they diverge from 표준어.</li>
</ol></div>`,
    `<span class="eyebrow">KIL301 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Ngôn ngữ học tiếng Hàn — loại hình, ngữ âm, Hangeul, hình thái, cú pháp, kính ngữ, từ vựng và phương ngữ — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn tham khảo dùng để dựng môn này.</p>
<h3>📘 Giáo trình được trích dẫn (không tải file lên đây)</h3>
<ul>
<li><em>한국어학의 이해 (Hiểu về Ngôn ngữ học tiếng Hàn)</em> — giáo trình dẫn luận ngôn ngữ học tiếng Hàn tiêu chuẩn.</li>
<li><em>The Korean Language</em> — Iksop Lee &amp; S. Robert Ramsey (NXB SUNY) — tài liệu tham khảo tiếng Anh chuẩn mực về cấu trúc và lịch sử tiếng Hàn.</li>
<li><em>외국어로서의 한국어학 (Ngôn ngữ học tiếng Hàn như một ngoại ngữ)</em> — góc nhìn ứng dụng cho việc dạy/học tiếng Hàn.</li>
</ul>
<h3>📘 Slide &amp; giáo trình chính thức</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của KIL301 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://www.korean.go.kr/" target="_blank" rel="noopener">국립국어원 — Viện Ngôn ngữ Quốc gia Hàn Quốc</a> — cơ quan chuẩn hoá 표준어, quy tắc chính tả và phát âm.</li>
<li><a href="https://ko.dict.naver.com/" target="_blank" rel="noopener">Từ điển Naver tiếng Hàn</a> — câu ví dụ và phân tích Hán tự cho từ Hán-Hàn.</li>
<li><a href="https://en.wikipedia.org/wiki/Korean_language" target="_blank" rel="noopener">Tiếng Hàn — tổng quan (Wikipedia)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@talktomeinkorean" target="_blank" rel="noopener">Talk To Me In Korean</a> — giảng ngữ pháp có phân tích cấu trúc rõ ràng.</li>
<li><a href="https://www.youtube.com/@KoreanUnnie" target="_blank" rel="noopener">Korean Unnie</a> — phát âm &amp; cách dùng đời thường.</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://papago.naver.com/" target="_blank" rel="noopener">Papago</a> — dịch máy hiểu tiếng Hàn, hữu ích để kiểm tra cách dùng trợ từ.</li>
<li><a href="https://ko.dict.naver.com/#/hanja" target="_blank" rel="noopener">Từ điển Hán tự Naver</a> — tra chữ Hán đứng sau một từ Hán-Hàn.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — loại hình chắp dính, nguyên lý tạo chữ Hangeul, bảng phụ âm/nguyên âm.</li>
<li><strong>Cấu trúc</strong> — trợ từ &amp; vĩ tố (hình thái học), trật tự SOV (cú pháp).</li>
<li><strong>Lớp xã hội</strong> — hệ thống kính ngữ, ba lớp từ vựng.</li>
<li><strong>Đào sâu</strong> — ngữ nghĩa/ngữ dụng, phương ngữ (방언) và cách chúng khác 표준어.</li>
</ol></div>`,
  ]]);

const intro = doc('kil301-0-1-overview', 'Course overview: Introduction to Korean Linguistics|||Tổng quan: Dẫn luận ngôn ngữ học tiếng Hàn',
  'Ngôn ngữ học tiếng Hàn nghiên cứu gì; các cấp độ phân tích (ngữ âm, hình thái, cú pháp, ngữ nghĩa); lộ trình 8 chương từ loại hình đến phương ngữ.',
  [[
    `<span class="eyebrow">KIL301 · Lesson 0.1 · Overview</span>
<h2>Introduction to Korean Linguistics</h2>
<p class="lead">This course introduces the scientific study of Korean (한국어, Hangugeo) — how the language is structured at every level: sounds (phonology), word-formation (morphology), sentence structure (syntax), meaning (semantics/pragmatics), writing (Hangeul), and social variation (honorifics, dialects). You learn to <strong>analyze</strong> Korean the way a linguist does, not only to speak it.</p>
<h3>Why linguistics, not just language skill</h3>
<ul>
<li>Explains <strong>why</strong> Korean behaves the way it does — e.g. why the verb always comes last.</li>
<li>Gives a shared vocabulary to compare Korean with Vietnamese/English systematically.</li>
<li>Underpins later work: translation, teaching Korean as a foreign language, computational text processing.</li>
</ul>
<h3>Roadmap</h3>
<p>Typology (agglutinative, 교착어) → phonology (자음/모음, sound-change rules) → Hangeul &amp; its design → morphology (particles 조사, endings 어미) → syntax (SOV) → honorifics (경어법) → vocabulary strata (고유어/한자어/외래어) → semantics, pragmatics &amp; dialects (방언).</p>
<pre><code>Korean at a glance:
  Speakers   : about 80 million (South + North Korea, diaspora)
  Family     : debated - often treated as a language isolate (Koreanic family)
  Word order : SOV (Subject-Object-Verb)
  Type       : agglutinative (교착어) - meaning built by STACKING suffixes
  Script     : Hangeul (한글), a featural alphabet designed in 1443, promulgated 1446
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Korean is an <strong>agglutinative</strong> language: grammar is expressed by attaching a chain of particles and endings onto a stem, rather than by changing word order or relying on separate function words the way English often does.</div>`,
    `<span class="eyebrow">KIL301 · Bài 0.1 · Tổng quan</span>
<h2>Dẫn luận ngôn ngữ học tiếng Hàn</h2>
<p class="lead">Môn này giới thiệu việc nghiên cứu khoa học tiếng Hàn (한국어, Hangugeo) — cấu trúc của ngôn ngữ này ở mọi cấp độ: âm thanh (ngữ âm học), cấu tạo từ (hình thái học), cấu trúc câu (cú pháp), nghĩa (ngữ nghĩa/ngữ dụng), chữ viết (Hangeul), và biến thể xã hội (kính ngữ, phương ngữ). Bạn học cách <strong>phân tích</strong> tiếng Hàn như một nhà ngôn ngữ học, không chỉ để nói được.</p>
<h3>Vì sao học ngôn ngữ học, không chỉ kỹ năng ngôn ngữ</h3>
<ul>
<li>Giải thích <strong>vì sao</strong> tiếng Hàn vận hành như vậy — ví dụ vì sao động từ luôn đứng cuối câu.</li>
<li>Cho bạn bộ thuật ngữ chung để so sánh tiếng Hàn với tiếng Việt/Anh một cách hệ thống.</li>
<li>Là nền cho các việc sau này: biên phiên dịch, dạy tiếng Hàn như ngoại ngữ, xử lý văn bản bằng máy tính.</li>
</ul>
<h3>Lộ trình</h3>
<p>Loại hình (chắp dính, 교착어) → ngữ âm học (자음/모음, quy tắc biến âm) → chữ Hangeul &amp; nguyên lý tạo chữ → hình thái học (trợ từ 조사, vĩ tố 어미) → cú pháp (SOV) → kính ngữ (경어법) → các lớp từ vựng (고유어/한자어/외래어) → ngữ nghĩa, ngữ dụng &amp; phương ngữ (방언).</p>
<pre><code>Tiếng Hàn nhìn nhanh:
  Người nói  : khoảng 80 triệu (Hàn Quốc + Triều Tiên, kiều bào)
  Ngữ hệ     : còn tranh cãi - thường xếp là "ngữ hệ cô lập" (họ Koreanic)
  Trật tự    : SOV (Chủ ngữ-Tân ngữ-Động từ)
  Loại hình  : chắp dính (교착어) - nghĩa được ghép bằng CÁCH XẾP CHỒNG hậu tố
  Chữ viết   : Hangeul (한글), bảng chữ cái theo nét đặc trưng, tạo 1443, công bố 1446
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Tiếng Hàn là ngôn ngữ <strong>chắp dính</strong>: ngữ pháp được biểu đạt bằng cách gắn một chuỗi trợ từ và vĩ tố vào gốc từ, thay vì đổi trật tự từ hay dùng nhiều từ chức năng riêng như tiếng Anh hay làm.</div>`,
  ]]);

const c1 = doc('kil301-1-1-typology', '1.1 — Overview of Korean & typological features|||1.1 — Tổng quan tiếng Hàn & đặc điểm loại hình',
  'Vị trí phả hệ của tiếng Hàn; loại hình chắp dính (교착어) so với đơn lập (tiếng Việt) và biến hình (Latin); ví dụ ghép hình vị.',
  [[
    `<span class="eyebrow">KIL301 · Chapter 1 · Lesson 1.1</span>
<h2>Overview &amp; typological features</h2>
<h3>Where Korean sits</h3>
<p>The genetic affiliation of Korean is debated: it shares heavy Sino-Korean vocabulary with Chinese but is <strong>not genetically related</strong> to Chinese. It is usually treated as a <strong>language isolate</strong> or the sole well-attested member of the <strong>Koreanic</strong> family. It shares strong <em>typological</em> resemblances with Japanese, Mongolian and Turkish (agglutination, SOV order) — the old "Altaic" hypothesis grouping them genetically is now largely rejected, but the structural resemblance remains useful for learners.</p>
<h3>Agglutinative typology (교착어)</h3>
<p>In an <strong>agglutinative</strong> language, one morpheme carries one grammatical meaning, and morphemes are stacked onto a stem in a fixed order: <code>STEM + (honorific) + (tense) + (sentence-ending)</code>.</p>
<pre><code>가- (go, stem)
 + -시- (subject honorific)
 + -었- (past tense)
 + -어요 (polite ending)
 = 가셨어요 (gasyeosseoyo) "(he/she) went" - polite
</code></pre>
<h3>Three classic typological types</h3>
<pre><code>Isolating   (Vietnamese) : "da di"      - 2 separate words, no change in the words
Agglutinative (Korean)   : "gass-eoyo"  - 1 word, 3 clearly segmentable morphemes
Fusional    (Latin)      : "ivi"        - 1 morpheme fusing person+tense+mood
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Because Korean morphemes stack in a predictable order and stay clearly segmentable, learning to parse a Korean word often means peeling suffixes off one at a time, from the outside in.</div>`,
    `<span class="eyebrow">KIL301 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan tiếng Hàn &amp; đặc điểm loại hình</h2>
<h3>Vị trí phả hệ của tiếng Hàn</h3>
<p>Quan hệ phả hệ của tiếng Hàn còn gây tranh cãi: tiếng Hàn có lượng lớn từ vựng Hán-Hàn vay mượn từ tiếng Trung nhưng <strong>không có quan hệ nguồn gốc</strong> với tiếng Trung. Nó thường được xếp là <strong>ngữ hệ cô lập</strong> (language isolate) hoặc thành viên duy nhất được xác nhận rõ của họ <strong>Koreanic</strong>. Tiếng Hàn có nhiều điểm giống <em>về loại hình</em> với tiếng Nhật, Mông Cổ, Thổ Nhĩ Kỳ (chắp dính, trật tự SOV) — giả thuyết "Altaic" cũ xếp chung nguồn gốc nay phần lớn bị bác bỏ, nhưng sự tương đồng cấu trúc vẫn hữu ích cho người học.</p>
<h3>Loại hình chắp dính (교착어)</h3>
<p>Trong ngôn ngữ <strong>chắp dính</strong>, một hình vị mang một nghĩa ngữ pháp, và các hình vị được xếp chồng lên gốc từ theo thứ tự cố định: <code>GỐC + (kính ngữ) + (thì) + (vĩ tố kết thúc câu)</code>.</p>
<pre><code>가- (đi, gốc từ)
 + -시- (kính ngữ chủ ngữ)
 + -었- (thì quá khứ)
 + -어요 (vĩ tố lịch sự)
 = 가셨어요 (gasyeosseoyo) "(anh/chị ấy) đã đi" - lịch sự
</code></pre>
<h3>Ba loại hình cổ điển</h3>
<pre><code>Đơn lập     (Tiếng Việt) : "đã đi"       - 2 từ tách rời, bản thân từ không đổi
Chắp dính   (Tiếng Hàn)  : "gass-eoyo"   - 1 từ, 3 hình vị tách bạch rõ ràng
Biến hình   (Latin)      : "ivi"         - 1 hình vị gộp cả ngôi+thì+thức
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Vì hình vị tiếng Hàn xếp chồng theo thứ tự có thể đoán trước và luôn tách bạch rõ, học phân tích một từ tiếng Hàn thường là việc bóc từng hậu tố một, từ ngoài vào trong.</div>`,
  ]]);

const c1q = quiz('kil301-quiz-1', 'Quiz 1 — Typology|||Quiz 1 — Loại hình', [
  { id: 'q1', question: 'Tiếng Hàn thuộc loại hình ngôn ngữ nào?', options: ['Đơn lập (isolating)', 'Chắp dính (agglutinative)', 'Biến hình (fusional)', 'Đa tổng hợp (polysynthetic) như tiếng Eskimo'], correctIndex: 1, explanation: 'Tiếng Hàn là ngôn ngữ chắp dính (교착어): mỗi hình vị mang một nghĩa ngữ pháp, xếp chồng theo thứ tự cố định lên gốc từ.' },
  { id: 'q2', question: 'Trong từ 가셨어요 (gasyeosseoyo), hình vị -시- biểu thị điều gì?', options: ['Thì quá khứ', 'Kính ngữ chủ ngữ', 'Vĩ tố kết thúc câu lịch sự', 'Phủ định'], correctIndex: 1, explanation: '-시- là hình vị kính ngữ chủ ngữ (주체 높임), chèn giữa gốc từ và các hậu tố thì/kết thúc câu.' },
  { id: 'q3', question: 'Quan hệ phả hệ hiện được chấp nhận rộng rãi nhất của tiếng Hàn là gì?', options: ['Cùng ngữ hệ với tiếng Trung vì vay mượn nhiều từ Hán', 'Ngữ hệ cô lập / thành viên chính của họ Koreanic', 'Chắc chắn thuộc ngữ hệ Altaic cùng Thổ Nhĩ Kỳ, Mông Cổ', 'Cùng ngữ hệ với tiếng Nhật đã được chứng minh'], correctIndex: 1, explanation: 'Tiếng Hàn thường được xếp là ngữ hệ cô lập hoặc thành viên chính của họ Koreanic; giả thuyết Altaic (gộp chung nguồn gốc) nay phần lớn bị bác bỏ dù có tương đồng loại hình.' },
]);

const c2 = doc('kil301-2-1-phonology', '2.1 — Korean phonetics & phonology|||2.1 — Ngữ âm & âm vị học tiếng Hàn',
  '19 phụ âm (bộ ba lỏng/căng/bật hơi), nguyên âm cơ bản; quy tắc biến âm: nối âm (연음), mũi hoá (비음화), căng hoá, khẩu cái hoá.',
  [[
    `<span class="eyebrow">KIL301 · Chapter 2 · Lesson 2.1</span>
<h2>Korean phonetics &amp; phonology</h2>
<h3>Consonants 자음 (19 phonemes)</h3>
<p>Korean's signature feature is a <strong>three-way stop contrast</strong> not found in English: plain (lenis), tense (fortis), and aspirated, for each place of articulation.</p>
<pre><code>Place       Plain(lenis)  Tense(fortis)  Aspirated
Velar        g/k  (ㄱ)      kk   (ㄲ)       k'   (ㅋ)
Alveolar     d/t  (ㄷ)      tt   (ㄸ)       t'   (ㅌ)
Bilabial     b/p  (ㅂ)      pp   (ㅃ)       p'   (ㅍ)
Affricate    j    (ㅈ)      jj   (ㅉ)       ch'  (ㅊ)
</code></pre>
<p>Example minimal set: 불 (bul, "fire") / 뿔 (ppul, "horn") / 풀 (pul, "grass") — three different words distinguished ONLY by that plain/tense/aspirated contrast.</p>
<h3>Vowels 모음</h3>
<p>Ten basic monophthongs: ㅏ(a) ㅓ(eo) ㅗ(o) ㅜ(u) ㅡ(eu) ㅣ(i) ㅐ(ae) ㅔ(e) ㅚ(oe) ㅟ(wi), plus diphthongs formed with the semivowels y-/w- (ㅑ ya, ㅕ yeo, ㅘ wa, etc.).</p>
<h3>Sound-change rules 음운 규칙</h3>
<ul>
<li><strong>Liaison (연음)</strong> — a final consonant moves to the onset of the next syllable when that syllable starts with a vowel: 한국어 (spelled han-gug-eo) is pronounced [한구거] hangugeo.</li>
<li><strong>Nasalization (비음화)</strong> — ㄱ/ㄷ/ㅂ become ㅇ/ㄴ/ㅁ before ㄴ or ㅁ: 국민 (gukmin, "citizen") → pronounced [궁민] gungmin.</li>
<li><strong>Palatalization (구개음화)</strong> — ㄷ/ㅌ before the vowel 이 become ㅈ/ㅊ across a morpheme boundary: 굳이 (guд-i, "firmly") → pronounced [구지] guji.</li>
</ul>
<pre><code>Example (nasalization):
 국물 (spelled guk-mul, "soup broth")
 -> pronounced [궁물] gungmul
 rule: ㄱ + ㅁ  ->  ㅇ + ㅁ   (stop nasalizes before a nasal)
</code></pre>
<div class="callout"><span class="badge">Key idea</span> These changes are <strong>rule-governed and predictable</strong>: spelling (표기) usually keeps the underlying form, while pronunciation (발음) reflects the surface rule applied in connected speech.</div>`,
    `<span class="eyebrow">KIL301 · Chương 2 · Bài 2.1</span>
<h2>Ngữ âm &amp; âm vị học tiếng Hàn</h2>
<h3>Phụ âm 자음 (19 âm vị)</h3>
<p>Đặc trưng nổi bật của tiếng Hàn là <strong>đối lập ba chiều ở âm tắc</strong> không có trong tiếng Việt/Anh: lỏng (bình thường), căng (fortis), và bật hơi, cho mỗi vị trí cấu âm.</p>
<pre><code>Vị trí        Lỏng          Căng          Bật hơi
Ngạc mềm      g/k  (ㄱ)      kk   (ㄲ)      k'   (ㅋ)
Đầu lưỡi      d/t  (ㄷ)      tt   (ㄸ)      t'   (ㅌ)
Môi-môi       b/p  (ㅂ)      pp   (ㅃ)      p'   (ㅍ)
Xát-tắc       j    (ㅈ)      jj   (ㅉ)      ch'  (ㅊ)
</code></pre>
<p>Ví dụ cặp tối thiểu: 불 (bul, "lửa") / 뿔 (ppul, "sừng") / 풀 (pul, "cỏ") — ba từ khác nghĩa hoàn toàn CHỈ nhờ đối lập lỏng/căng/bật hơi đó.</p>
<h3>Nguyên âm 모음</h3>
<p>Mười nguyên âm đơn cơ bản: ㅏ(a) ㅓ(eo) ㅗ(o) ㅜ(u) ㅡ(eu) ㅣ(i) ㅐ(ae) ㅔ(e) ㅚ(oe) ㅟ(wi), cộng các nguyên âm đôi tạo bằng bán nguyên âm y-/w- (ㅑ ya, ㅕ yeo, ㅘ wa, v.v.).</p>
<h3>Quy tắc biến âm 음운 규칙</h3>
<ul>
<li><strong>Nối âm (연음)</strong> — phụ âm cuối chuyển sang làm âm đầu của âm tiết sau khi âm tiết đó bắt đầu bằng nguyên âm: 한국어 (viết han-gug-eo) được phát âm [한구거] hangugeo.</li>
<li><strong>Mũi hoá (비음화)</strong> — ㄱ/ㄷ/ㅂ biến thành ㅇ/ㄴ/ㅁ khi đứng trước ㄴ hoặc ㅁ: 국민 (gukmin, "công dân") → phát âm [궁민] gungmin.</li>
<li><strong>Khẩu cái hoá (구개음화)</strong> — ㄷ/ㅌ đứng trước nguyên âm 이 qua ranh giới hình vị biến thành ㅈ/ㅊ: 굳이 (guji, "một cách kiên quyết") → phát âm [구지] guji.</li>
</ul>
<pre><code>Ví dụ (mũi hoá):
 국물 (viết guk-mul, "nước dùng")
 -> phát âm [궁물] gungmul
 quy tắc: ㄱ + ㅁ  ->  ㅇ + ㅁ   (âm tắc mũi hoá trước âm mũi)
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Các biến âm này <strong>có quy luật, đoán trước được</strong>: chính tả (표기) thường giữ dạng gốc, còn phát âm (발음) phản ánh quy tắc áp dụng khi nói liền mạch.</div>`,
  ]]);

const c2q = quiz('kil301-quiz-2', 'Quiz 2 — Phonology|||Quiz 2 — Ngữ âm & âm vị học', [
  { id: 'q1', question: 'Đối lập âm tắc đặc trưng của tiếng Hàn (không có trong tiếng Việt/Anh) là gì?', options: ['Hữu thanh / vô thanh', 'Lỏng / căng / bật hơi (3 chiều)', 'Dài / ngắn', 'Mũi / không mũi'], correctIndex: 1, explanation: 'Tiếng Hàn có đối lập ba chiều: lỏng (ㄱ) / căng (ㄲ) / bật hơi (ㅋ) ở mỗi vị trí cấu âm, ví dụ 불/뿔/풀.' },
  { id: 'q2', question: '국민 (gukmin) được phát âm là [궁민] gungmin nhờ quy tắc nào?', options: ['Nối âm (연음)', 'Mũi hoá (비음화)', 'Khẩu cái hoá (구개음화)', 'Căng hoá (경음화)'], correctIndex: 1, explanation: 'ㄱ đứng trước ㅁ (âm mũi) biến thành ㅇ — đây là mũi hoá (비음화).' },
  { id: 'q3', question: 'Nối âm (연음) là hiện tượng gì?', options: ['Phụ âm cuối chuyển sang làm âm đầu âm tiết sau khi âm tiết đó bắt đầu bằng nguyên âm', 'Hai nguyên âm hoà làm một', 'Phụ âm cuối biến mất hoàn toàn', 'Trọng âm chuyển sang âm tiết cuối'], correctIndex: 0, explanation: 'Nối âm: 한국어 viết han-gug-eo nhưng đọc [한구거] vì phụ âm cuối "g" nối sang âm tiết có nguyên âm theo sau.' },
]);

const c3 = doc('kil301-3-1-hangeul', '3.1 — Hangeul: the writing system & its design principles|||3.1 — Chữ viết Hangeul & nguyên lý tạo chữ',
  '훈민정음 do vua Sejong sáng tạo (1443/1446); nguyên lý tạo chữ theo hình cấu âm (phụ âm) và triết lý tam tài (nguyên âm); khối âm tiết.',
  [[
    `<span class="eyebrow">KIL301 · Chapter 3 · Lesson 3.1</span>
<h2>Hangeul &amp; its design principles</h2>
<h3>훈민정음 Hunminjeongeum</h3>
<p>Hangeul (한글) was created by <strong>King Sejong the Great</strong> and scholars of the Hall of Worthies, devised around 1443 and promulgated in 1446 under the name <strong>Hunminjeongeum</strong> ("the correct sounds to teach the people") — an explicit literacy project for commoners who could not read the Chinese characters (한자) used by the elite.</p>
<h3>Featural consonant design</h3>
<p>Consonant shapes are <strong>iconic drawings of the speech organs</strong> at the moment of articulation:</p>
<ul>
<li>ㄱ — the tongue root blocking the throat (velar).</li>
<li>ㄴ — the tongue tip touching the ridge behind the teeth (alveolar).</li>
<li>ㅁ — the outline of the mouth (bilabial).</li>
<li>ㅅ — the shape of a tooth (sibilant).</li>
<li>ㅇ — the shape of the throat (glottal).</li>
</ul>
<p>From these five base shapes, extra strokes add more airflow/force: ㄱ→ㅋ (add aspiration), and doubling a letter adds tenseness: ㄱ→ㄲ.</p>
<h3>Vowel design: three philosophical symbols</h3>
<p>Vowels are built from three symbols representing Heaven (·), Earth (ㅡ, flat) and Human (ㅣ, upright), combined to derive ㅏ, ㅓ, ㅗ, ㅜ and the rest.</p>
<h3>Syllable blocks 음절</h3>
<p>Unlike the Latin alphabet, Hangeul letters (자모) are not written in a single line — they are grouped into square <strong>syllable blocks</strong>: initial + medial (+ final).</p>
<pre><code>한  =  ㅎ (initial, h) + ㅏ (medial, a) + ㄴ (final, n)  ->  block "han"
글  =  ㄱ (initial, g) + ㅡ (medial, eu) + ㄹ (final, l)  ->  block "geul"
</code></pre>
<div class="callout"><span class="badge">A documented design</span> UNESCO praises Hangeul as a rare script whose design rationale is fully documented: the 1446 <em>Hunminjeongeum Haerye</em> manual explains, letter by letter, exactly why each shape was chosen.</div>`,
    `<span class="eyebrow">KIL301 · Chương 3 · Bài 3.1</span>
<h2>Chữ viết Hangeul &amp; nguyên lý tạo chữ</h2>
<h3>훈민정음 Huấn dân chính âm</h3>
<p>Hangeul (한글) do <strong>vua Sejong Đại đế</strong> và các học giả Tập hiền điện sáng tạo, hình thành khoảng năm 1443 và công bố năm 1446 với tên gọi <strong>Hunminjeongeum</strong> ("âm thanh đúng để dạy cho dân") — một dự án xoá mù chữ rõ ràng dành cho thường dân, những người không đọc được chữ Hán (한자) mà tầng lớp trên dùng.</p>
<h3>Nguyên lý tạo phụ âm theo hình cấu âm</h3>
<p>Hình dạng phụ âm là <strong>hình vẽ mô phỏng bộ máy phát âm</strong> tại thời điểm phát âm:</p>
<ul>
<li>ㄱ — gốc lưỡi chặn cổ họng (âm ngạc mềm).</li>
<li>ㄴ — đầu lưỡi chạm lợi sau răng (âm đầu lưỡi).</li>
<li>ㅁ — đường viền của miệng (âm môi-môi).</li>
<li>ㅅ — hình dáng của một chiếc răng (âm xát).</li>
<li>ㅇ — hình dáng của cổ họng (âm thanh hầu).</li>
</ul>
<p>Từ năm hình cơ bản này, thêm nét biểu thị nhiều luồng hơi hơn: ㄱ→ㅋ (thêm bật hơi), và nhân đôi chữ cái thêm tính căng: ㄱ→ㄲ.</p>
<h3>Nguyên lý tạo nguyên âm: ba biểu tượng triết học</h3>
<p>Nguyên âm được dựng từ ba biểu tượng đại diện cho Trời (·), Đất (ㅡ, phẳng) và Người (ㅣ, thẳng đứng), kết hợp lại để tạo ra ㅏ, ㅓ, ㅗ, ㅜ và các nguyên âm còn lại.</p>
<h3>Khối âm tiết 음절</h3>
<p>Khác với chữ Latin, các chữ cái Hangeul (자모) không viết thành một hàng dài — chúng được gom vào <strong>khối âm tiết</strong> hình vuông: âm đầu + âm giữa (+ âm cuối).</p>
<pre><code>한  =  ㅎ (âm đầu, h) + ㅏ (âm giữa, a) + ㄴ (âm cuối, n)  ->  khối "han"
글  =  ㄱ (âm đầu, g) + ㅡ (âm giữa, eu) + ㄹ (âm cuối, l)  ->  khối "geul"
</code></pre>
<div class="callout"><span class="badge">Một thiết kế có tài liệu ghi lại</span> UNESCO đánh giá Hangeul là chữ viết hiếm hoi có lý do thiết kế được ghi chép đầy đủ: sách hướng dẫn <em>Huấn dân chính âm Giải lệ (Hunminjeongeum Haerye)</em> năm 1446 giải thích từng chữ cái, vì sao mỗi hình dạng được chọn.</div>`,
  ]]);

const c3q = quiz('kil301-quiz-3', 'Quiz 3 — Hangeul|||Quiz 3 — Chữ viết Hangeul', [
  { id: 'q1', question: 'Hangeul được vua nào sáng tạo và công bố năm nào?', options: ['Vua Sejong, công bố 1446', 'Vua Gojong, công bố 1897', 'Vua Taejo, công bố 1392', 'Vua Sejong, công bố 1910'], correctIndex: 0, explanation: 'Vua Sejong Đại đế cùng học giả Tập hiền điện tạo Hunminjeongeum khoảng 1443, công bố chính thức năm 1446.' },
  { id: 'q2', question: 'Hình dạng chữ ㄱ mô phỏng điều gì trong bộ máy cấu âm?', options: ['Đường viền miệng', 'Gốc lưỡi chặn cổ họng', 'Hình dáng cổ họng', 'Hình dáng một chiếc răng'], correctIndex: 1, explanation: 'ㄱ vẽ lại hình gốc lưỡi chặn lên cổ họng khi phát âm âm ngạc mềm.' },
  { id: 'q3', question: 'Khối âm tiết 한 gồm những thành phần nào?', options: ['Chỉ âm đầu và âm cuối', 'Âm đầu ㅎ + âm giữa ㅏ + âm cuối ㄴ', 'Ba phụ âm liên tiếp', 'Một nguyên âm đơn lẻ'], correctIndex: 1, explanation: 'Khối 한 = ㅎ (âm đầu) + ㅏ (âm giữa) + ㄴ (âm cuối), gom vào một khối vuông thay vì viết thành hàng.' },
]);

const c4 = doc('kil301-4-1-morphology', '4.1 — Morphology: word formation & particles/endings|||4.1 — Hình thái học: cấu tạo từ & trợ từ/vĩ tố',
  'Trợ từ 조사 (이/가, 은/는, 을/를); vĩ tố 어미 (kính ngữ, thì, kết thúc câu) xếp chồng theo thứ tự cố định; ghép từ & phái sinh.',
  [[
    `<span class="eyebrow">KIL301 · Chapter 4 · Lesson 4.1</span>
<h2>Morphology: word formation &amp; particles/endings</h2>
<h3>Particles 조사</h3>
<p>Particles attach to nouns to mark their grammatical role — Korean has no case-marking word order to fall back on, so particles do that job:</p>
<ul>
<li><strong>이/가</strong> — subject marker.</li>
<li><strong>은/는</strong> — topic marker (what the sentence is ABOUT, often contrastive).</li>
<li><strong>을/를</strong> — object marker.</li>
</ul>
<p>Compare 저는 학생이에요 (jeoneun haksaeng-ieyo, "As for me, I am a student" — topic) with 제가 학생이에요 (jega haksaeng-ieyo, "I (specifically, as opposed to someone else) am the student" — subject, often answering "who is the student?").</p>
<h3>Verb endings 어미</h3>
<p>Endings stack in a fixed slot order onto the verb stem: <strong>pre-final endings</strong> (honorific -시-, past -았/었-, future/presumptive -겠-) come before the <strong>final ending</strong>, which sets sentence type and speech level.</p>
<pre><code>드시- (eat, honorific stem, suppletive for 먹다)
 + -겠- (presumptive/future)
 + -습니까 (formal polite question)
 = 드시겠습니까? (deusigessseumnikka?) "Will you eat?" (formal, honorific)
</code></pre>
<h3>Word formation: compounding &amp; derivation</h3>
<ul>
<li><strong>Compounding</strong> — 손 (hand) + 발 (foot) → 손발 (sonbal, "hands and feet" = limbs, teamwork).</li>
<li><strong>Derivation</strong> — prefix 풋- ("unripe/young") + 사과 (apple) → 풋사과 (putsagwa, "unripe apple"); nominalizing suffixes like -기 turn a verb into a noun: 먹다 (to eat) → 먹기 (the act of eating).</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Because Korean is agglutinative, a single verb form can encode subject honorification, tense, and sentence type all at once — parsing it means slotting each piece into its fixed position.</div>`,
    `<span class="eyebrow">KIL301 · Chương 4 · Bài 4.1</span>
<h2>Hình thái học: cấu tạo từ &amp; trợ từ/vĩ tố</h2>
<h3>Trợ từ 조사</h3>
<p>Trợ từ gắn vào danh từ để đánh dấu vai trò ngữ pháp của nó — tiếng Hàn không dựa vào trật tự từ để biểu thị cách (case) như một số ngôn ngữ khác, nên trợ từ đảm nhận việc đó:</p>
<ul>
<li><strong>이/가</strong> — trợ từ chủ ngữ.</li>
<li><strong>은/는</strong> — trợ từ chủ đề (câu nói VỀ điều gì, thường mang sắc thái đối lập).</li>
<li><strong>을/를</strong> — trợ từ tân ngữ.</li>
</ul>
<p>So sánh 저는 학생이에요 (jeoneun haksaeng-ieyo, "Còn tôi thì là học sinh" — chủ đề) với 제가 학생이에요 (jega haksaeng-ieyo, "Chính tôi (chứ không phải ai khác) là học sinh" — chủ ngữ, thường trả lời câu hỏi "ai là học sinh?").</p>
<h3>Vĩ tố 어미</h3>
<p>Vĩ tố xếp chồng theo thứ tự cố định lên gốc động từ: <strong>vĩ tố tiền kết thúc</strong> (kính ngữ -시-, quá khứ -았/었-, tương lai/phỏng đoán -겠-) đứng trước <strong>vĩ tố kết thúc</strong>, thứ quyết định loại câu và bậc lịch sự.</p>
<pre><code>드시- (ăn, gốc kính ngữ, thay thế cho 먹다)
 + -겠- (phỏng đoán/tương lai)
 + -습니까 (câu hỏi lịch sự trang trọng)
 = 드시겠습니까? (deusigessseumnikka?) "Anh/Chị có dùng bữa không ạ?" (trang trọng, kính ngữ)
</code></pre>
<h3>Cấu tạo từ: ghép từ &amp; phái sinh</h3>
<ul>
<li><strong>Ghép từ</strong> — 손 (tay) + 발 (chân) → 손발 (sonbal, "tay chân" = chân tay, sự phối hợp).</li>
<li><strong>Phái sinh</strong> — tiền tố 풋- ("còn non/xanh") + 사과 (táo) → 풋사과 (putsagwa, "táo xanh chưa chín"); hậu tố danh hoá như -기 biến động từ thành danh từ: 먹다 (ăn) → 먹기 (việc ăn).</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Vì tiếng Hàn là ngôn ngữ chắp dính, một dạng động từ duy nhất có thể mã hoá cùng lúc kính ngữ chủ ngữ, thì, và loại câu — phân tích nó nghĩa là xếp từng mảnh vào đúng vị trí cố định của nó.</div>`,
  ]]);

const c4q = quiz('kil301-quiz-4', 'Quiz 4 — Morphology|||Quiz 4 — Hình thái học', [
  { id: 'q1', question: 'Khác biệt chính giữa 저는 (jeoneun) và 제가 (jega) là gì?', options: ['Không khác nhau, chỉ là hai cách viết', '저는 đánh dấu chủ đề, 제가 đánh dấu chủ ngữ (thường nhấn mạnh "chính là")', '저는 dùng cho quá khứ, 제가 dùng cho hiện tại', '저는 là kính ngữ, 제가 là suồng sã'], correctIndex: 1, explanation: '은/는 là trợ từ chủ đề, 이/가 là trợ từ chủ ngữ; 제가 thường nhấn mạnh "chính tôi" trả lời câu hỏi "ai".' },
  { id: 'q2', question: 'Trong 드시겠습니까?, thành phần -겠- biểu thị điều gì?', options: ['Kính ngữ chủ ngữ', 'Thì quá khứ', 'Phỏng đoán / tương lai', 'Phủ định'], correctIndex: 2, explanation: '-겠- là vĩ tố tiền kết thúc mang nghĩa phỏng đoán/tương lai, đứng trước vĩ tố kết thúc câu.' },
  { id: 'q3', question: 'Vĩ tố tiếng Hàn xếp theo thứ tự nào?', options: ['Ngẫu nhiên tuỳ người nói', 'Vĩ tố kết thúc trước, tiền kết thúc sau', 'Tiền kết thúc (kính ngữ, thì) trước, vĩ tố kết thúc (loại câu) sau cùng', 'Chỉ có một loại vĩ tố duy nhất'], correctIndex: 2, explanation: 'Thứ tự cố định: gốc từ + tiền kết thúc (kính ngữ, thì) + vĩ tố kết thúc quyết định loại câu/bậc lịch sự.' },
]);

const c5 = doc('kil301-5-1-syntax', '5.1 — Syntax: SOV word order & sentence structure|||5.1 — Cú pháp: trật tự SOV & cấu trúc câu',
  'Trật tự cơ bản Chủ-Tân-Động; cấu trúc đầu-cuối (bổ ngữ đứng trước danh từ); hiện tượng lược bỏ chủ ngữ/tân ngữ (pro-drop).',
  [[
    `<span class="eyebrow">KIL301 · Chapter 5 · Lesson 5.1</span>
<h2>Syntax: SOV word order &amp; sentence structure</h2>
<h3>Basic order: Subject-Object-Verb</h3>
<p>Korean's basic word order is <strong>SOV</strong>, unlike English's SVO:</p>
<pre><code>저는   밥을    먹어요.
(S)    (O)     (V)
jeoneun bab-eul meog-eoyo
"I"    "rice"  "eat" (polite)
= "I eat rice."  (literally: I  rice  eat)
</code></pre>
<p>Because particles already mark each noun's role (이/가, 을/를…), word order is relatively <strong>free (scrambling)</strong> as long as the verb stays last: 밥을 저는 먹어요 is also grammatical, just with 밥을 fronted for emphasis/topic shift.</p>
<h3>Head-final structure</h3>
<p>Korean is consistently <strong>head-final</strong>: modifiers precede the element they modify.</p>
<ul>
<li>Relative clauses precede the noun: 내가 어제 산 책 (naega eoje san chaek, literally "I-yesterday-bought book" = "the book that I bought yesterday").</li>
<li>Adjectives precede the noun they describe, as in English, but postpositions (particles) stand where English uses prepositions: 학교에 (hakgyo-e, "to school", literally "school-to").</li>
</ul>
<h3>Pro-drop (omitting recoverable arguments)</h3>
<p>Arguments recoverable from context are freely dropped, since verb endings do not mark person/number the way European verbs do: (저는) 학교에 가요 ("(I) go to school") — the subject 저는 is routinely omitted in casual conversation once it is clear from context.</p>
<pre><code>SVO (English)   :  [S I] [V eat]  [O rice]
SOV (Korean)    :  [S 저는] [O 밥을] [V 먹어요]
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Verb-final order plus case-marking particles is what lets Korean scramble its word order for emphasis while English, lacking that marking, must rely on strict SVO order instead.</div>`,
    `<span class="eyebrow">KIL301 · Chương 5 · Bài 5.1</span>
<h2>Cú pháp: trật tự SOV &amp; cấu trúc câu</h2>
<h3>Trật tự cơ bản: Chủ ngữ-Tân ngữ-Động từ</h3>
<p>Trật tự từ cơ bản của tiếng Hàn là <strong>SOV</strong>, khác với SVO của tiếng Anh:</p>
<pre><code>저는   밥을    먹어요.
(S)    (O)     (V)
jeoneun bab-eul meog-eoyo
"tôi"  "cơm"   "ăn" (lịch sự)
= "Tôi ăn cơm."  (nghĩa đen: tôi  cơm  ăn)
</code></pre>
<p>Vì trợ từ đã đánh dấu sẵn vai trò của mỗi danh từ (이/가, 을/를…), trật tự từ khá <strong>tự do (đảo trật tự - scrambling)</strong> miễn động từ vẫn ở cuối: 밥을 저는 먹어요 vẫn đúng ngữ pháp, chỉ là 밥을 được đưa lên đầu để nhấn mạnh/chuyển chủ đề.</p>
<h3>Cấu trúc đầu-cuối (head-final)</h3>
<p>Tiếng Hàn nhất quán theo kiểu <strong>đầu-cuối</strong>: thành phần bổ nghĩa luôn đứng trước thành phần nó bổ nghĩa.</p>
<ul>
<li>Mệnh đề quan hệ đứng trước danh từ: 내가 어제 산 책 (naega eoje san chaek, nghĩa đen "tôi-hôm qua-đã mua-sách" = "quyển sách mà tôi đã mua hôm qua").</li>
<li>Tính từ đứng trước danh từ nó mô tả, giống tiếng Anh, nhưng hậu trí từ (trợ từ) đứng ở vị trí mà tiếng Anh dùng giới từ: 학교에 (hakgyo-e, "đến trường", nghĩa đen "trường-đến").</li>
</ul>
<h3>Lược bỏ chủ ngữ/tân ngữ (pro-drop)</h3>
<p>Thành phần có thể suy ra từ ngữ cảnh được lược bỏ tự do, vì vĩ tố động từ không đánh dấu ngôi/số như động từ châu Âu: (저는) 학교에 가요 ("(Tôi) đi học") — chủ ngữ 저는 thường xuyên bị lược trong hội thoại thường ngày khi ngữ cảnh đã rõ.</p>
<pre><code>SVO (Tiếng Anh) :  [S I] [V eat]  [O rice]
SOV (Tiếng Hàn) :  [S 저는] [O 밥을] [V 먹어요]
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Trật tự động từ cuối cùng với trợ từ đánh dấu cách là điều cho phép tiếng Hàn đảo trật tự từ để nhấn mạnh, trong khi tiếng Anh, thiếu cơ chế đánh dấu đó, phải bám chặt trật tự SVO.</div>`,
  ]]);

const c5q = quiz('kil301-quiz-5', 'Quiz 5 — Syntax|||Quiz 5 — Cú pháp SOV', [
  { id: 'q1', question: 'Trật tự từ cơ bản của tiếng Hàn là gì?', options: ['SVO như tiếng Anh', 'SOV — động từ luôn ở cuối', 'VSO', 'Không có trật tự cố định'], correctIndex: 1, explanation: 'Tiếng Hàn theo trật tự SOV: Chủ ngữ - Tân ngữ - Động từ, động từ luôn đứng cuối câu.' },
  { id: 'q2', question: 'Vì sao câu tiếng Hàn có thể đảo trật tự từ (scrambling) mà vẫn đúng ngữ pháp?', options: ['Vì tiếng Hàn không có ngữ pháp cố định', 'Vì trợ từ đã đánh dấu vai trò ngữ pháp của từng danh từ, không cần dựa vào vị trí', 'Vì động từ có thể đứng ở bất kỳ đâu', 'Vì đây là ngôn ngữ đơn lập'], correctIndex: 1, explanation: 'Trợ từ (이/가, 을/를…) đánh dấu sẵn vai trò nên trật tự từ tự do hơn, miễn động từ vẫn ở cuối.' },
  { id: 'q3', question: 'Trong 내가 어제 산 책 ("quyển sách tôi đã mua hôm qua"), điều gì thể hiện tính "đầu-cuối" (head-final) của tiếng Hàn?', options: ['Danh từ 책 đứng trước mệnh đề quan hệ', 'Mệnh đề quan hệ "내가 어제 산" đứng TRƯỚC danh từ trung tâm 책', 'Trợ từ đứng trước danh từ', 'Động từ đứng đầu câu'], correctIndex: 1, explanation: 'Tiếng Hàn là ngôn ngữ đầu-cuối: mệnh đề quan hệ (thành phần bổ nghĩa) luôn đứng trước danh từ trung tâm mà nó bổ nghĩa.' },
]);

const c6 = doc('kil301-6-1-honorifics', '6.1 — The honorific system (경어법/높임법)|||6.1 — Hệ thống kính ngữ (경어법/높임법)',
  'Ba trục kính ngữ: kính ngữ chủ ngữ (-시-), 4 bậc lịch sự phổ biến (해라체/해체/해요체/하십시오체), yếu tố xã hội chi phối.',
  [[
    `<span class="eyebrow">KIL301 · Chapter 6 · Lesson 6.1</span>
<h2>The honorific system (경어법/높임법)</h2>
<h3>Three axes of honorification</h3>
<p><strong>Subject honorification (주체 높임)</strong> raises the person being talked ABOUT: attach -시- to the verb, and/or swap in an honorific noun or verb — 밥 (meal) becomes 진지; 먹다 (eat) becomes 드시다/잡수시다; 있다 (be/stay) becomes 계시다.</p>
<h3>Speech levels (상대 높임)</h3>
<p>Classical grammar lists seven speech levels; modern spoken Korean mostly reduces to four common ones, chosen based on the LISTENER:</p>
<pre><code>Level              가다 "to go"     Typical use
해라체 (plain)       가라 / 간다        writing, talking to children, close friends
해체 (casual/반말)   가                same age/close, informal
해요체 (polite)      가요              default polite level, most situations
하십시오체 (formal)  가십시오           formal speech, news, military, customer service
</code></pre>
<h3>Social factors that trigger honorifics</h3>
<p>Age, social rank/status, degree of intimacy, and public vs. private setting all determine the level chosen; Korean's kinship and workplace hierarchies are deeply encoded into the language this way.</p>
<pre><code>먹어      (meogeo)    - casual/반말: "eat" (to a close friend/younger person)
먹어요    (meogeoyo)  - polite: "eat" (default polite)
드세요    (deuseyo)   - polite + subject honorific: "please eat" (to an elder)
드십시오  (deusipsio) - formal + subject honorific: "please eat" (formal setting)
</code></pre>
<div class="callout"><span class="badge">Why it matters</span> Mismatching the honorific level is one of the costliest mistakes a learner can make socially — the exact same sentence can sound perfectly polite to one listener and rude to another.</div>`,
    `<span class="eyebrow">KIL301 · Chương 6 · Bài 6.1</span>
<h2>Hệ thống kính ngữ (경어법/높임법)</h2>
<h3>Ba trục kính ngữ</h3>
<p><strong>Kính ngữ chủ ngữ (주체 높임)</strong> nâng cao người ĐƯỢC nhắc đến: gắn -시- vào động từ, và/hoặc thay bằng danh từ/động từ kính ngữ — 밥 (cơm) thành 진지; 먹다 (ăn) thành 드시다/잡수시다; 있다 (ở/còn) thành 계시다.</p>
<h3>Bậc lịch sự (상대 높임)</h3>
<p>Ngữ pháp cổ điển liệt kê bảy bậc lịch sự; tiếng Hàn nói hiện đại phần lớn rút gọn còn bốn bậc phổ biến, chọn theo NGƯỜI NGHE:</p>
<pre><code>Bậc                가다 "đi"          Dùng khi
해라체 (bình thường) 가라 / 간다         viết, nói với trẻ con, bạn rất thân
해체 (반말, suồng sã) 가                cùng tuổi/thân thiết, không trang trọng
해요체 (lịch sự)      가요               bậc lịch sự mặc định, đa số tình huống
하십시오체 (trang trọng) 가십시오        nói trang trọng, tin tức, quân đội, dịch vụ khách hàng
</code></pre>
<h3>Yếu tố xã hội chi phối kính ngữ</h3>
<p>Tuổi tác, địa vị xã hội, mức độ thân thiết, và bối cảnh công khai hay riêng tư đều quyết định bậc được chọn; quan hệ họ hàng và cấp bậc nơi làm việc của người Hàn được mã hoá rất sâu vào ngôn ngữ theo cách này.</p>
<pre><code>먹어      (meogeo)    - 반말/suồng sã: "ăn đi" (với bạn thân/người nhỏ tuổi hơn)
먹어요    (meogeoyo)  - lịch sự: "ăn" (bậc lịch sự mặc định)
드세요    (deuseyo)   - lịch sự + kính ngữ chủ ngữ: "mời dùng bữa" (với người lớn tuổi)
드십시오  (deusipsio) - trang trọng + kính ngữ chủ ngữ: "mời dùng bữa" (bối cảnh trang trọng)
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng</span> Dùng sai bậc kính ngữ là một trong những lỗi tốn kém nhất về mặt xã hội mà người học có thể mắc — cùng một câu có thể nghe hoàn toàn lịch sự với người này nhưng hỗn xược với người khác.</div>`,
  ]]);

const c6q = quiz('kil301-quiz-6', 'Quiz 6 — Honorifics|||Quiz 6 — Hệ thống kính ngữ', [
  { id: 'q1', question: 'Hình vị -시- trong động từ tiếng Hàn thuộc trục kính ngữ nào?', options: ['Kính ngữ chủ ngữ (주체 높임)', 'Bậc lịch sự với người nghe (상대 높임)', 'Thì quá khứ', 'Phủ định'], correctIndex: 0, explanation: '-시- là kính ngữ chủ ngữ, nâng cao người ĐƯỢC nhắc đến trong câu, khác với việc chọn bậc lịch sự dành cho người nghe.' },
  { id: 'q2', question: 'Bậc lịch sự nào trong 4 bậc phổ biến được dùng làm mặc định trong đa số tình huống lịch sự hằng ngày?', options: ['해라체', '해체 (반말)', '해요체', '하십시오체'], correctIndex: 2, explanation: '해요체 (vd 가요, 먹어요) là bậc lịch sự mặc định, dùng phổ biến nhất trong giao tiếp lịch sự hằng ngày.' },
  { id: 'q3', question: 'Yếu tố nào KHÔNG phải là yếu tố xã hội quyết định bậc kính ngữ được chọn?', options: ['Tuổi tác của người nghe', 'Địa vị xã hội', 'Mức độ thân thiết', 'Màu sắc trang phục người nói đang mặc'], correctIndex: 3, explanation: 'Tuổi, địa vị, mức độ thân thiết và bối cảnh công khai/riêng tư quyết định bậc kính ngữ; trang phục không liên quan.' },
]);

const c7 = doc('kil301-7-1-vocabulary', '7.1 — Vocabulary: native, Sino-Korean & loanwords|||7.1 — Từ vựng: từ thuần Hàn, Hán-Hàn & ngoại lai',
  'Ba lớp từ vựng 고유어/한자어/외래어; cặp từ đồng nghĩa khác lớp/khác bậc lịch sự; hai hệ thống số đếm dùng cho mục đích khác nhau.',
  [[
    `<span class="eyebrow">KIL301 · Chapter 7 · Lesson 7.1</span>
<h2>Vocabulary: native, Sino-Korean &amp; loanwords</h2>
<h3>Three strata</h3>
<ul>
<li><strong>고유어 (native Korean)</strong> — everyday core vocabulary, kinship terms, the native number system, nature words: 하늘 (haneul, "sky"), 물 (mul, "water").</li>
<li><strong>한자어 (Sino-Korean)</strong> — roughly 60% of the lexicon, borrowed from Chinese characters (한자, Hanja) and often more formal/abstract: 학교 (學校 hakgyo, "school"), 감사 (感謝 gamsa, "thanks"); also the Sino-Korean number system used for dates, money, phone numbers.</li>
<li><strong>외래어 (loanwords)</strong> — mostly from English after 1945, phonologically nativized (Korean syllables cannot end in most consonant clusters): 컴퓨터 (keompyuteo, "computer"), 크리스마스 (keuriseumaseu, "Christmas").</li>
</ul>
<h3>Doublets &amp; register</h3>
<p>The same concept often has words from two different strata, differing in formality: 이빨 (ippal, native, informal/blunt "tooth", used for animals or rudely for people) vs. 치아 (chia, Sino-Korean, formal "tooth"); 나이 (nai, native, "age") vs. 연세 (yeonse, Sino-Korean honorific, "age" for elders).</p>
<h3>Two number systems, two jobs</h3>
<pre><code>Native (고유어)      Sino-Korean (한자어)     Used for
하나 (hana) 1        일 (il) 1                dates, money, phone numbers,
둘  (dul)  2        이 (i)  2                counting minutes, math
셋  (set)  3        삼 (sam) 3
넷  (net)  4        사 (sa)  4
다섯 (daseot) 5      오 (o)  5
                                            (native system counts objects/age
                                             up to about 99: 스무 살 "20 years old")
</code></pre>
<div class="callout"><span class="badge">Key idea</span> Choosing the RIGHT stratum is not optional style — it is grammatically required: 두 시 삼십 분 ("2:30") mixes native 두 (hours) with Sino-Korean 삼십 (minutes) by fixed convention, not free choice.</div>`,
    `<span class="eyebrow">KIL301 · Chương 7 · Bài 7.1</span>
<h2>Từ vựng: từ thuần Hàn, Hán-Hàn &amp; ngoại lai</h2>
<h3>Ba lớp từ vựng</h3>
<ul>
<li><strong>고유어 (từ thuần Hàn)</strong> — từ vựng cốt lõi hằng ngày, từ xưng hô họ hàng, hệ số đếm thuần Hàn, từ chỉ tự nhiên: 하늘 (haneul, "bầu trời"), 물 (mul, "nước").</li>
<li><strong>한자어 (từ Hán-Hàn)</strong> — chiếm khoảng 60% từ vựng, vay mượn từ chữ Hán (한자, Hanja), thường trang trọng/trừu tượng hơn: 학교 (學校 hakgyo, "trường học"), 감사 (感謝 gamsa, "cảm ơn"); cũng là hệ số đếm Hán-Hàn dùng cho ngày tháng, tiền bạc, số điện thoại.</li>
<li><strong>외래어 (từ ngoại lai)</strong> — phần lớn từ tiếng Anh sau 1945, được Hàn hoá về ngữ âm (âm tiết tiếng Hàn không kết thúc bằng hầu hết các tổ hợp phụ âm): 컴퓨터 (keompyuteo, "máy tính"), 크리스마스 (keuriseumaseu, "Giáng sinh").</li>
</ul>
<h3>Cặp từ đồng nghĩa khác lớp, khác bậc</h3>
<p>Cùng một khái niệm thường có từ ở hai lớp khác nhau, khác mức trang trọng: 이빨 (ippal, thuần Hàn, "răng" thông tục/thô, dùng cho động vật hoặc nói thô về người) so với 치아 (chia, Hán-Hàn, "răng" trang trọng); 나이 (nai, thuần Hàn, "tuổi") so với 연세 (yeonse, Hán-Hàn kính ngữ, "tuổi" dùng cho người lớn tuổi).</p>
<h3>Hai hệ số đếm, hai công dụng</h3>
<pre><code>Thuần Hàn (고유어)     Hán-Hàn (한자어)       Dùng cho
하나 (hana) 1         일 (il) 1              ngày tháng, tiền bạc, số điện thoại,
둘  (dul)  2         이 (i)  2               đếm phút, toán học
셋  (set)  3         삼 (sam) 3
넷  (net)  4         사 (sa)  4
다섯 (daseot) 5       오 (o)  5
                                            (hệ thuần Hàn đếm đồ vật/tuổi tới ~99:
                                             스무 살 "20 tuổi")
</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Chọn ĐÚNG lớp từ vựng không phải là sở thích văn phong — đó là bắt buộc về ngữ pháp: 두 시 삼십 분 ("2 giờ 30 phút") trộn 두 thuần Hàn (giờ) với 삼십 Hán-Hàn (phút) theo quy ước cố định, không phải tuỳ chọn.</div>`,
  ]]);

const c7q = quiz('kil301-quiz-7', 'Quiz 7 — Vocabulary strata|||Quiz 7 — Ba lớp từ vựng', [
  { id: 'q1', question: 'Từ 학교 (hakgyo, "trường học") thuộc lớp từ vựng nào?', options: ['고유어 (thuần Hàn)', '한자어 (Hán-Hàn)', '외래어 (ngoại lai)', 'Không thuộc lớp nào'], correctIndex: 1, explanation: '학교 (學校) là từ Hán-Hàn, vay mượn từ chữ Hán, chiếm khoảng 60% từ vựng tiếng Hàn.' },
  { id: 'q2', question: 'Vì sao tiếng Hàn có HAI hệ số đếm (thuần Hàn và Hán-Hàn)?', options: ['Chỉ để trang trí, dùng hệ nào cũng được', 'Mỗi hệ dùng cho mục đích khác nhau theo quy ước cố định (vd tuổi/đồ vật dùng thuần Hàn, ngày/tiền dùng Hán-Hàn)', 'Hệ thuần Hàn đã bị loại bỏ hoàn toàn', 'Chỉ người miền Bắc dùng hệ Hán-Hàn'], correctIndex: 1, explanation: 'Hai hệ song song tồn tại với công dụng phân định rõ: thuần Hàn cho đếm đồ vật/tuổi, Hán-Hàn cho ngày tháng/tiền bạc/số điện thoại.' },
  { id: 'q3', question: 'Từ 이빨 và 치아 khác nhau chủ yếu ở điểm nào?', options: ['Nghĩa hoàn toàn khác nhau', 'Cùng nghĩa "răng" nhưng khác lớp từ vựng và mức trang trọng (thuần Hàn thô/thân mật vs Hán-Hàn trang trọng)', '치아 là từ ngoại lai từ tiếng Anh', '이빨 chỉ dùng cho người, 치아 chỉ dùng cho động vật'], correctIndex: 1, explanation: '이빨 (thuần Hàn) thông tục/thô, 치아 (Hán-Hàn) trang trọng — cùng nghĩa "răng" nhưng khác bậc từ vựng.' },
]);

const c8 = doc('kil301-8-1-semantics-dialects-review', '8.1 — Semantics, pragmatics & dialects (방언) — Review|||8.1 — Ngữ nghĩa, ngữ dụng & phương ngữ (방언) — Ôn tập',
  'Quan hệ ngữ nghĩa (đồng nghĩa, đa nghĩa); ngữ dụng và tính gián tiếp trong văn hoá giao tiếp; phương ngữ vùng miền & 표준어; ôn tập 8 chương.',
  [[
    `<span class="eyebrow">KIL301 · Chapter 8 · Lesson 8.1</span>
<h2>Semantics, pragmatics &amp; dialects — Review</h2>
<h3>Semantics: meaning relations</h3>
<p>Standard sense relations apply to Korean too: synonymy (동의어), antonymy (반의어), and <strong>polysemy</strong> (다의어) — one word, related meanings: 손 (son) means "hand" literally, but also "help/labor" in 손이 필요하다 (soni piryohada, "[we] need help", literally "hand is needed").</p>
<h3>Pragmatics: meaning beyond the words</h3>
<p>Korean politeness culture favors <strong>indirectness</strong> for refusals and disagreement rather than a blunt "no": 좀 그런데요 (jom geureondeyo, literally "that's a bit...") functions as a polite refusal — the listener is expected to infer "no" from the hedge, an example of conversational implicature.</p>
<h3>Dialects 방언</h3>
<p>Standard Korean (표준어) is based on educated Seoul speech. Regional dialects diverge noticeably:</p>
<ul>
<li><strong>경상도 (Gyeongsang)</strong> — retains pitch-accent distinctions lost in standard Seoul speech.</li>
<li><strong>전라도 (Jeolla)</strong> — distinct vocabulary and sentence-final endings.</li>
<li><strong>제주도 (Jeju)</strong> — the most divergent; sometimes classified as a separate Koreanic language rather than a dialect of Korean.</li>
<li><strong>North Korean 문화어 (Munhwaeo)</strong> — diverges from South Korean 표준어 in vocabulary and some pronunciation, shaped by decades of separate language policy.</li>
</ul>
<pre><code>Standard  (표준어) : 뭐 하세요?   (mwo haseyo?)   "What are you doing?"
Gyeongsang dialect : 뭐하노?     (mwohano?)      same meaning, different ending
</code></pre>
<h3>Course review</h3>
<pre><code>1. Typology      - agglutinative (교착어), morphemes stack in fixed order
2. Phonology     - 19 consonants (plain/tense/aspirated), sound-change rules
3. Hangeul       - featural design (1443/1446), syllable blocks
4. Morphology    - particles 조사, endings 어미
5. Syntax        - SOV, head-final, pro-drop
6. Honorifics    - subject honorification + 4 common speech levels
7. Vocabulary    - 고유어 / 한자어 / 외래어, two number systems
8. Semantics/pragmatics/dialects - polysemy, indirectness, 방언 vs 표준어
</code></pre>
<div class="callout"><span class="badge">Takeaway</span> Linguistics gives you a SYSTEM for understanding why Korean works the way it does — use it to keep learning the language systematically, not one memorized phrase at a time.</div>`,
    `<span class="eyebrow">KIL301 · Chương 8 · Bài 8.1</span>
<h2>Ngữ nghĩa, ngữ dụng &amp; phương ngữ — Ôn tập</h2>
<h3>Ngữ nghĩa: các quan hệ về nghĩa</h3>
<p>Các quan hệ nghĩa cơ bản cũng áp dụng cho tiếng Hàn: đồng nghĩa (동의어), trái nghĩa (반의어), và <strong>đa nghĩa</strong> (다의어) — một từ, nhiều nghĩa liên quan: 손 (son) nghĩa đen là "bàn tay", nhưng cũng có nghĩa "sự giúp đỡ/nhân công" trong 손이 필요하다 (soni piryohada, "cần người giúp", nghĩa đen "cần tay").</p>
<h3>Ngữ dụng: nghĩa vượt ra ngoài câu chữ</h3>
<p>Văn hoá lịch sự Hàn Quốc ưa <strong>tính gián tiếp</strong> khi từ chối hay không đồng ý, thay vì nói thẳng "không": 좀 그런데요 (jom geureondeyo, nghĩa đen "cái đó hơi...") đóng vai trò một lời từ chối lịch sự — người nghe được kỳ vọng tự suy ra "không" từ cách nói lửng, một ví dụ của hàm ý hội thoại (implicature).</p>
<h3>Phương ngữ 방언</h3>
<p>Tiếng Hàn chuẩn (표준어) dựa trên cách nói của người có học ở Seoul. Các phương ngữ vùng miền khác biệt rõ rệt:</p>
<ul>
<li><strong>경상도 (Gyeongsang)</strong> — còn giữ đối lập trọng âm cao độ đã mất trong tiếng chuẩn Seoul.</li>
<li><strong>전라도 (Jeolla)</strong> — từ vựng và vĩ tố kết thúc câu riêng biệt.</li>
<li><strong>제주도 (Jeju)</strong> — khác biệt nhất; đôi khi được xếp là một ngôn ngữ Koreanic riêng thay vì một phương ngữ của tiếng Hàn.</li>
<li><strong>문화어 (Munhwaeo, tiếng Triều Tiên)</strong> — khác 표준어 Hàn Quốc về từ vựng và một phần phát âm, hình thành do hàng chục năm chính sách ngôn ngữ riêng biệt.</li>
</ul>
<pre><code>Chuẩn      (표준어) : 뭐 하세요?   (mwo haseyo?)   "Bạn đang làm gì đấy?"
Phương ngữ Gyeongsang: 뭐하노?     (mwohano?)      cùng nghĩa, vĩ tố khác
</code></pre>
<h3>Ôn tập môn học</h3>
<pre><code>1. Loại hình     - chắp dính (교착어), hình vị xếp chồng theo thứ tự cố định
2. Ngữ âm        - 19 phụ âm (lỏng/căng/bật hơi), quy tắc biến âm
3. Hangeul       - nguyên lý tạo chữ theo hình cấu âm (1443/1446), khối âm tiết
4. Hình thái     - trợ từ 조사, vĩ tố 어미
5. Cú pháp       - SOV, đầu-cuối, lược bỏ chủ ngữ/tân ngữ
6. Kính ngữ      - kính ngữ chủ ngữ + 4 bậc lịch sự phổ biến
7. Từ vựng       - 고유어 / 한자어 / 외래어, hai hệ số đếm
8. Ngữ nghĩa/ngữ dụng/phương ngữ - đa nghĩa, tính gián tiếp, 방언 với 표준어
</code></pre>
<div class="callout"><span class="badge">Đúc kết</span> Ngôn ngữ học cho bạn một HỆ THỐNG để hiểu vì sao tiếng Hàn vận hành như vậy — dùng nó để tiếp tục học ngôn ngữ này một cách hệ thống, không chỉ học thuộc từng câu rời rạc.</div>`,
  ]]);

const c8q = quiz('kil301-quiz-8', 'Quiz 8 — Semantics, pragmatics & dialects|||Quiz 8 — Ngữ nghĩa, ngữ dụng & phương ngữ', [
  { id: 'q1', question: 'Hiện tượng một từ mang nhiều nghĩa liên quan (như 손 vừa là "tay" vừa là "sự giúp đỡ") gọi là gì?', options: ['Đồng nghĩa (동의어)', 'Đa nghĩa (다의어)', 'Trái nghĩa (반의어)', 'Đồng âm khác nghĩa hoàn toàn'], correctIndex: 1, explanation: 'Đa nghĩa (polysemy, 다의어) là một từ có nhiều nghĩa liên quan với nhau, khác với đồng âm (các nghĩa không liên quan).' },
  { id: 'q2', question: 'Câu 좀 그런데요 ("cái đó hơi...") trong văn hoá giao tiếp Hàn Quốc thường có chức năng gì?', options: ['Một lời khen', 'Một lời từ chối gián tiếp, lịch sự', 'Một câu hỏi trực tiếp', 'Một mệnh lệnh'], correctIndex: 1, explanation: 'Đây là ví dụ về tính gián tiếp trong ngữ dụng: người nghe tự suy ra "không" từ cách nói lửng thay vì nghe từ chối thẳng.' },
  { id: 'q3', question: 'Phương ngữ nào đôi khi được xếp là một ngôn ngữ Koreanic RIÊNG thay vì chỉ là phương ngữ của tiếng Hàn?', options: ['경상도 (Gyeongsang)', '전라도 (Jeolla)', '제주도 (Jeju)', '문화어 (Munhwaeo, Triều Tiên)'], correctIndex: 2, explanation: 'Phương ngữ đảo Jeju khác biệt nhiều nhất so với tiếng Hàn chuẩn, đến mức đôi khi được các nhà ngôn ngữ học xếp là một ngôn ngữ Koreanic riêng.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'KIL301',
    slug: 'kil301-dan-luan-ngon-ngu-hoc-tieng-han',
    title: 'Dẫn luận ngôn ngữ học tiếng Hàn',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/KIL301.webp',
    shortDescription: 'Korean linguistics: typology, phonology, Hangeul design, morphology, SOV syntax, honorifics, vocabulary strata & dialects — theory with real Korean examples (Hangeul + romanization + Vietnamese gloss) and quizzes.|||Ngôn ngữ học tiếng Hàn: loại hình, ngữ âm, chữ Hangeul, hình thái, cú pháp SOV, kính ngữ, các lớp từ vựng & phương ngữ — lý thuyết kèm ví dụ tiếng Hàn thật (Hangeul + romaja + nghĩa Việt) và quiz.',
    description: 'Môn <strong>KIL301 — Dẫn luận ngôn ngữ học tiếng Hàn</strong> (kỳ 4, ngành Ngôn ngữ Hàn) giới thiệu việc phân tích tiếng Hàn một cách khoa học: <strong>loại hình chắp dính</strong> (교착어) → <strong>ngữ âm &amp; âm vị học</strong> (자음/모음, quy tắc biến âm) → <strong>chữ Hangeul</strong> &amp; nguyên lý tạo chữ (훈민정음) → <strong>hình thái học</strong> (trợ từ 조사, vĩ tố 어미) → <strong>cú pháp SOV</strong> → <strong>hệ thống kính ngữ</strong> (경어법/높임법) → <strong>ba lớp từ vựng</strong> (고유어/한자어/외래어) → <strong>ngữ nghĩa, ngữ dụng &amp; phương ngữ</strong> (방언). Trích dẫn giáo trình <em>한국어학의 이해</em>, <em>The Korean Language</em> (Lee &amp; Ramsey), <em>외국어로서의 한국어학</em>; mỗi chương có lý thuyết kèm ví dụ tiếng Hàn thật (Hangeul UTF-8 + romaja + nghĩa Việt) và quiz.',
    whatYouLearn: 'Đặc điểm loại hình chắp dính của tiếng Hàn so với tiếng Việt/Latin; hệ phụ âm 3 chiều (lỏng/căng/bật hơi) & quy tắc biến âm (nối âm, mũi hoá, khẩu cái hoá); nguyên lý tạo chữ Hangeul theo hình cấu âm; trợ từ 조사 & vĩ tố 어미 xếp chồng; trật tự SOV & cấu trúc đầu-cuối; hệ thống kính ngữ 4 bậc; ba lớp từ vựng thuần Hàn/Hán-Hàn/ngoại lai & hai hệ số đếm; quan hệ ngữ nghĩa, tính gián tiếp trong ngữ dụng, phương ngữ vùng miền so với 표준어.',
    requirements: 'Đã học hoặc đang học tiếng Hàn sơ cấp (đọc được Hangeul cơ bản). Không cần nền tảng ngôn ngữ học trước đó — các khái niệm được giới thiệu từ đầu.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình được trích dẫn, sách tham khảo, tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Ngôn ngữ học tiếng Hàn là gì, các cấp độ phân tích, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan & loại hình|||Chapter 1 — Overview & typology', description: 'Phả hệ tiếng Hàn, loại hình chắp dính (교착어).', lessons: [c1, c1q] },
    { title: 'Chương 2 — Ngữ âm & âm vị học|||Chapter 2 — Phonetics & phonology', description: '자음/모음, quy tắc biến âm.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Chữ viết Hangeul|||Chapter 3 — Hangeul writing system', description: '훈민정음, nguyên lý tạo chữ, khối âm tiết.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Hình thái học|||Chapter 4 — Morphology', description: 'Trợ từ 조사, vĩ tố 어미, cấu tạo từ.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Cú pháp SOV|||Chapter 5 — Syntax', description: 'Trật tự SOV, đầu-cuối, pro-drop.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Hệ thống kính ngữ|||Chapter 6 — Honorifics', description: '경어법/높임법, bậc lịch sự.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Từ vựng|||Chapter 7 — Vocabulary', description: '고유어/한자어/외래어, hệ số đếm.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Ngữ nghĩa, ngữ dụng & phương ngữ|||Chapter 8 — Semantics, pragmatics & dialects', description: '방언 vs 표준어, ôn tập.', lessons: [c8, c8q] },
  ],
};
