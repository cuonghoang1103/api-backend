/**
 * MCO201c — Transmedia Storytelling. Giáo trình tham khảo: Jenkins
 * "Convergence Culture"; Phillips "Transmedia Storytelling"; Campbell
 * "The Hero with a Thousand Faces". 8 chương song ngữ + quiz.
 * Giữ NGUYÊN slug/semester/thumb(v3). ⚠️ KHÔNG backtick/${; "\n"→\\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('mco201c-0-0-materials', 'Course materials & references|||Tài liệu tham khảo môn học',
  'Sách nền: Convergence Culture (Jenkins), Transmedia Storytelling (Phillips), The Hero with a Thousand Faces (Campbell); nguồn mở & công cụ tự học.',
  [[
    `<span class="eyebrow">MCO201c · Course materials</span>
<h2>Reference library</h2>
<p class="lead">This course is built around three foundational texts. Slides &amp; the official syllabus are on <strong>FLM</strong> — below are the core readings and free public resources to go deeper.</p>
<h3>📘 Core textbooks</h3>
<ul>
<li><strong>Henry Jenkins — <em>Convergence Culture: Where Old and New Media Collide</em></strong> — the book that named "convergence culture": audiences now hunt across media to piece stories together.</li>
<li><strong>Carlos Alberto Scolari / Jeff Gomez / Frank Rose-style primers — <em>Transmedia Storytelling</em> (Phillips)</strong> — practical playbook for designing a story across platforms.</li>
<li><strong>Joseph Campbell — <em>The Hero with a Thousand Faces</em></strong> — the monomyth / hero's journey that underlies most transmedia franchise story engines.</li>
</ul>
<h3>🌐 Free resources</h3>
<ul>
<li><a href="http://henryjenkins.org/" target="_blank" rel="noopener">Henry Jenkins' blog (henryjenkins.org)</a> — the originator of "transmedia storytelling" writing on convergence &amp; fan culture.</li>
<li><a href="https://en.wikipedia.org/wiki/Transmedia_storytelling" target="_blank" rel="noopener">Wikipedia — Transmedia storytelling</a> — overview, history, examples.</li>
<li><a href="https://en.wikipedia.org/wiki/Hero%27s_journey" target="_blank" rel="noopener">Wikipedia — Hero's journey</a> — stage-by-stage summary of Campbell's monomyth.</li>
</ul>
<h3>🎬 Case studies to study</h3>
<ul>
<li>The Matrix franchise (film + games + comics + anime shorts) — the textbook early transmedia case Jenkins analyzes.</li>
<li>Marvel Cinematic Universe — films, TV/streaming series, comics, games sharing one continuity.</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — what transmedia is, convergence culture, narrative basics.</li>
<li><strong>Craft</strong> — world-building, continuity, character &amp; the hero's journey.</li>
<li><strong>Practice</strong> — platform-specific storytelling, audience participation &amp; UGC.</li>
<li><strong>Industry</strong> — transmedia marketing/branded content, production &amp; measurement.</li>
</ol></div>`,
    `<span class="eyebrow">MCO201c · Tài liệu môn học</span>
<h2>Thư viện tham khảo</h2>
<p class="lead">Môn này dựng trên ba đầu sách nền. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong> — dưới đây là sách gốc và nguồn mở để tự học sâu hơn.</p>
<h3>📘 Sách nền</h3>
<ul>
<li><strong>Henry Jenkins — <em>Convergence Culture: Where Old and New Media Collide</em></strong> — cuốn sách đặt tên "văn hoá hội tụ": khán giả nay săn lùng qua nhiều nền tảng để ráp lại câu chuyện.</li>
<li><strong>Transmedia Storytelling (Phillips)</strong> — cẩm nang thực hành thiết kế một câu chuyện chạy trên nhiều nền tảng.</li>
<li><strong>Joseph Campbell — <em>The Hero with a Thousand Faces</em></strong> — huyền thoại đơn nhất / hành trình anh hùng, nền của phần lớn "động cơ kể chuyện" các franchise transmedia.</li>
</ul>
<h3>🌐 Nguồn miễn phí</h3>
<ul>
<li><a href="http://henryjenkins.org/" target="_blank" rel="noopener">Blog Henry Jenkins (henryjenkins.org)</a> — người khởi xướng thuật ngữ "transmedia storytelling" viết về hội tụ &amp; văn hoá fan.</li>
<li><a href="https://en.wikipedia.org/wiki/Transmedia_storytelling" target="_blank" rel="noopener">Wikipedia — Transmedia storytelling</a> — tổng quan, lịch sử, ví dụ.</li>
<li><a href="https://en.wikipedia.org/wiki/Hero%27s_journey" target="_blank" rel="noopener">Wikipedia — Hero's journey</a> — tóm tắt từng bước huyền thoại đơn nhất của Campbell.</li>
</ul>
<h3>🎬 Case study nên xem</h3>
<ul>
<li>Vũ trụ The Matrix (phim + game + truyện tranh + anime ngắn) — case transmedia kinh điển mà Jenkins phân tích.</li>
<li>Vũ trụ điện ảnh Marvel (MCU) — phim, series TV/streaming, truyện tranh, game cùng chia sẻ một dòng thời gian.</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — transmedia là gì, văn hoá hội tụ, cơ bản về kể chuyện.</li>
<li><strong>Kỹ năng nghề</strong> — dựng thế giới truyện, tính liên tục, nhân vật &amp; hành trình anh hùng.</li>
<li><strong>Thực hành</strong> — kể chuyện theo từng nền tảng, sự tham gia của khán giả &amp; UGC.</li>
<li><strong>Ngành nghề</strong> — marketing transmedia/branded content, sản xuất &amp; đo lường.</li>
</ol></div>`,
  ]]);

const intro = doc('mco201c-0-1-overview', 'Course overview: Transmedia Storytelling|||Tổng quan: Kể chuyện đa phương tiện',
  'Transmedia storytelling là gì, khác gì cross-media/adaptation; bối cảnh văn hoá hội tụ (Jenkins); lộ trình 8 chương.',
  [[
    `<span class="eyebrow">MCO201c · Lesson 0.1 · Overview</span>
<h2>Transmedia Storytelling</h2>
<p class="lead">This course teaches you to design <strong>one story world unfolding across multiple media platforms</strong> — film, games, social media, web — where each platform contributes something unique, and the audience actively participates in piecing the whole picture together.</p>
<h3>Why this matters</h3>
<p>Modern brands, franchises and campaigns rarely live on one channel. A marketer or storyteller who can plan a <strong>transmedia experience</strong> — not just repeat one ad on five channels — is far more valuable in today's convergent media landscape.</p>
<h3>Roadmap</h3>
<p>What transmedia is &amp; convergence culture → narrative fundamentals → world-building &amp; continuity → character &amp; the hero's journey → platform-specific storytelling → audience participation &amp; UGC → transmedia marketing/branded content → production &amp; measurement.</p>
<div class="callout"><span class="badge">Key idea</span> Transmedia ≠ the same story copy-pasted everywhere. Each platform tells a <strong>different, complementary piece</strong> of one larger story world.</div>`,
    `<span class="eyebrow">MCO201c · Bài 0.1 · Tổng quan</span>
<h2>Kể chuyện đa phương tiện</h2>
<p class="lead">Môn này dạy bạn thiết kế <strong>một thế giới truyện trải rộng trên nhiều nền tảng truyền thông</strong> — phim, game, mạng xã hội, web — mỗi nền tảng góp một phần riêng, và khán giả chủ động tham gia ráp lại toàn cảnh.</p>
<h3>Vì sao quan trọng</h3>
<p>Thương hiệu, franchise và chiến dịch hiện đại hiếm khi chỉ sống trên một kênh. Người làm truyền thông/marketing biết lên kế hoạch một <strong>trải nghiệm transmedia</strong> — không chỉ lặp một mẫu quảng cáo trên năm kênh — có giá trị lớn hơn nhiều trong bối cảnh truyền thông hội tụ ngày nay.</p>
<h3>Lộ trình</h3>
<p>Transmedia là gì &amp; văn hoá hội tụ → nền tảng kể chuyện → dựng thế giới truyện &amp; tính liên tục → nhân vật &amp; hành trình anh hùng → kể chuyện theo từng nền tảng → sự tham gia khán giả &amp; UGC → marketing transmedia/branded content → sản xuất &amp; đo lường.</p>
<div class="callout"><span class="badge">Ý chính</span> Transmedia KHÔNG phải chép một câu chuyện dán khắp mọi nơi. Mỗi nền tảng kể một <strong>phần khác nhau, bổ sung cho nhau</strong> của một thế giới truyện lớn hơn.</div>`,
  ]]);

const c1 = doc('mco201c-1-1-convergence', '1.1 — What is transmedia storytelling & convergence culture|||1.1 — Transmedia là gì & văn hoá hội tụ',
  'Định nghĩa transmedia (Jenkins); phân biệt transmedia/cross-media/adaptation; văn hoá hội tụ, trí tuệ tập thể (collective intelligence).',
  [[
    `<span class="eyebrow">MCO201c · Chapter 1 · Lesson 1.1</span>
<h2>What is transmedia storytelling &amp; convergence culture</h2>
<h3>Jenkins' definition</h3>
<p>Henry Jenkins defines <strong>transmedia storytelling</strong> as a process where integral elements of a fiction get dispersed systematically across multiple delivery channels for the purpose of creating a unified and coordinated entertainment experience. Each medium does what it does best.</p>
<h3>Not the same as...</h3>
<ul>
<li><strong>Cross-media</strong> — the SAME story repackaged on different channels (a movie's trailer on TV and YouTube is cross-media, not transmedia).</li>
<li><strong>Adaptation</strong> — retelling one story in a new medium (a book turned into a film) — still one story, just moved, not extended.</li>
<li><strong>Transmedia</strong> — DIFFERENT, non-redundant story pieces on different platforms that add up to one bigger world.</li>
</ul>
<h3>Convergence culture</h3>
<p>Jenkins' <em>Convergence Culture</em> describes a media environment where old and new media collide, corporate and grassroots media intersect, and the power of the media producer and the media consumer interact unpredictably. Two forces drive it:</p>
<ul>
<li><strong>Media convergence</strong> — the flow of content across multiple platforms (a story is no longer bound to one medium).</li>
<li><strong>Participatory culture</strong> — audiences don't just consume; they discuss, remix, and hunt for clues across platforms.</li>
<li><strong>Collective intelligence</strong> — no single fan knows everything, but a fan community pooling knowledge (wikis, forums) can piece together the whole transmedia puzzle.</li>
</ul>
<pre><code>Cross-media:  Story A -> TV, print, web  (same content, different pipes)
Adaptation:   Story A (book) -> Story A (film)  (same story, new medium)
Transmedia:   Story A (film) + Story B (game) + Story C (web) = one world W
              (each piece is different but they connect into W)
</code></pre>
<div class="callout"><span class="badge">Litmus test</span> Ask: "If I only consumed ONE platform, would I miss real story content?" If yes — it's transmedia. If every platform tells the exact same thing, it's just cross-media distribution.</div>`,
    `<span class="eyebrow">MCO201c · Chương 1 · Bài 1.1</span>
<h2>Transmedia là gì &amp; văn hoá hội tụ</h2>
<h3>Định nghĩa của Jenkins</h3>
<p>Henry Jenkins định nghĩa <strong>transmedia storytelling</strong> là quá trình các thành phần cốt lõi của một câu chuyện được phân tán có hệ thống trên nhiều kênh phát hành khác nhau nhằm tạo ra một trải nghiệm giải trí thống nhất và đồng bộ. Mỗi phương tiện làm đúng việc nó làm tốt nhất.</p>
<h3>Không giống với...</h3>
<ul>
<li><strong>Cross-media</strong> — CÙNG một câu chuyện đóng gói lại trên nhiều kênh (trailer phim chiếu trên TV và YouTube là cross-media, không phải transmedia).</li>
<li><strong>Adaptation (chuyển thể)</strong> — kể lại một câu chuyện trên phương tiện mới (sách chuyển thành phim) — vẫn một câu chuyện, chỉ đổi chỗ, không mở rộng.</li>
<li><strong>Transmedia</strong> — các phần câu chuyện KHÁC NHAU, không trùng lặp trên các nền tảng khác nhau, cộng lại thành một thế giới lớn hơn.</li>
</ul>
<h3>Văn hoá hội tụ</h3>
<p>Cuốn <em>Convergence Culture</em> của Jenkins mô tả một môi trường truyền thông nơi cái cũ và cái mới va vào nhau, truyền thông doanh nghiệp và truyền thông tự phát giao cắt, và quyền lực của người sản xuất lẫn người tiêu thụ nội dung tương tác theo cách khó đoán. Hai lực đẩy chính:</p>
<ul>
<li><strong>Hội tụ truyền thông (media convergence)</strong> — nội dung chảy qua nhiều nền tảng (một câu chuyện không còn bị bó vào một phương tiện).</li>
<li><strong>Văn hoá tham gia (participatory culture)</strong> — khán giả không chỉ tiêu thụ; họ bàn luận, chế lại, và săn manh mối trên khắp các nền tảng.</li>
<li><strong>Trí tuệ tập thể (collective intelligence)</strong> — không fan nào biết hết, nhưng một cộng đồng fan góp kiến thức (wiki, diễn đàn) có thể ráp ra toàn bộ mảnh ghép transmedia.</li>
</ul>
<pre><code>Cross-media:  Câu chuyện A -> TV, báo, web (cùng nội dung, khác ống dẫn)
Adaptation:   Câu chuyện A (sách) -> Câu chuyện A (phim) (vẫn 1 chuyện, đổi phương tiện)
Transmedia:   Chuyện A (phim) + Chuyện B (game) + Chuyện C (web) = một thế giới W
              (mỗi phần khác nhau nhưng nối lại thành W)
</code></pre>
<div class="callout"><span class="badge">Phép thử nhanh</span> Hỏi: "Nếu tôi chỉ xem MỘT nền tảng, tôi có bỏ lỡ nội dung câu chuyện thật không?" Có — đó là transmedia. Nếu nền tảng nào cũng kể đúng y một thứ, đó chỉ là phân phối cross-media.</div>`,
  ]]);

const c1q = quiz('mco201c-quiz-1', 'Quiz 1 — Transmedia & convergence|||Quiz 1 — Transmedia & hội tụ', [
  { id: 'q1', question: 'Theo Jenkins, "transmedia storytelling" là gì?', options: ['Chép một câu chuyện lên nhiều kênh giống nhau', 'Các thành phần cốt lõi của câu chuyện phân tán có hệ thống trên nhiều kênh, tạo một trải nghiệm thống nhất', 'Chuyển thể một cuốn sách thành phim', 'Quảng cáo cùng một mẫu trên TV và web'], correctIndex: 1, explanation: 'Định nghĩa của Jenkins: các phần khác nhau, không trùng lặp, cùng tạo một thế giới thống nhất.' },
  { id: 'q2', question: 'Điểm khác biệt chính giữa transmedia và cross-media là gì?', options: ['Transmedia chỉ dùng phim, cross-media chỉ dùng web', 'Transmedia kể phần nội dung KHÁC NHAU trên mỗi nền tảng; cross-media lặp lại cùng nội dung', 'Không có khác biệt gì', 'Cross-media đắt hơn transmedia'], correctIndex: 1, explanation: 'Cross-media = cùng nội dung trên nhiều kênh; transmedia = nội dung bổ sung nhau, khác nhau trên mỗi kênh.' },
  { id: 'q3', question: '"Trí tuệ tập thể" (collective intelligence) trong văn hoá hội tụ nghĩa là gì?', options: ['Một chuyên gia biết hết mọi thứ về franchise', 'Cộng đồng fan góp nhặt kiến thức rải rác để ráp ra toàn cảnh câu chuyện', 'AI viết truyện thay con người', 'Nhà sản xuất kiểm soát toàn bộ thông tin'], correctIndex: 1, explanation: 'Không cá nhân nào biết hết; cộng đồng (wiki, diễn đàn) gộp kiến thức lại mới ra toàn cảnh.' },
]);

const c2 = doc('mco201c-2-1-narrative', '2.1 — Narrative fundamentals & story structure|||2.1 — Nền tảng kể chuyện & cấu trúc câu chuyện',
  'Story vs. narrative/discourse; cấu trúc ba hồi; xung đột, điểm nút cốt truyện; cấu trúc kể chuyện phi tuyến trong transmedia.',
  [[
    `<span class="eyebrow">MCO201c · Chapter 2 · Lesson 2.1</span>
<h2>Narrative fundamentals &amp; story structure</h2>
<h3>Story vs. narrative</h3>
<ul>
<li><strong>Story</strong> — the raw sequence of events (what happens, in chronological order), including everything, even what's never shown.</li>
<li><strong>Narrative (discourse)</strong> — HOW the story is told: the order, the medium, the point of view, what's revealed and when. Transmedia manipulates narrative heavily while keeping one underlying story.</li>
</ul>
<h3>Three-act structure</h3>
<pre><code>Act 1 — Setup:      introduce world, protagonist, inciting incident
Act 2 — Confrontation: rising conflict, obstacles, midpoint twist
Act 3 — Resolution: climax, resolution of the central conflict
</code></pre>
<h3>Conflict &amp; plot points</h3>
<p>Every story needs <strong>conflict</strong> (character vs. self / others / nature / society) to create tension. <strong>Plot points</strong> are the turns that push the story from one act to the next — a transmedia project can place different plot points on different platforms.</p>
<h3>Non-linear, distributed narrative</h3>
<p>Transmedia rarely tells the story in one straight timeline. A comic might cover a backstory (before the film), a game might run in parallel (a side character's mission), a social feed might unfold "in real time" from a character's point of view. The audience assembles the timeline themselves.</p>
<div class="callout"><span class="badge">Design tip</span> Map your ONE underlying story/timeline first, then decide which slice of it goes to which platform — never invent contradictory events per platform.</div>`,
    `<span class="eyebrow">MCO201c · Chương 2 · Bài 2.1</span>
<h2>Nền tảng kể chuyện &amp; cấu trúc câu chuyện</h2>
<h3>Story (chuyện) vs. narrative (cách kể)</h3>
<ul>
<li><strong>Story (chuyện)</strong> — chuỗi sự kiện thô (chuyện gì xảy ra, theo thứ tự thời gian), bao gồm cả những gì không bao giờ được thể hiện.</li>
<li><strong>Narrative (cách kể/discourse)</strong> — kể chuyện NHƯ THẾ NÀO: thứ tự, phương tiện, góc nhìn, cái gì được hé lộ và khi nào. Transmedia biến hoá mạnh phần cách kể trong khi giữ một chuyện nền duy nhất.</li>
</ul>
<h3>Cấu trúc ba hồi</h3>
<pre><code>Hồi 1 — Mở đầu:   giới thiệu thế giới, nhân vật chính, sự cố khởi phát
Hồi 2 — Đối đầu:  xung đột leo thang, trở ngại, bước ngoặt giữa truyện
Hồi 3 — Kết thúc: cao trào, giải quyết xung đột trung tâm
</code></pre>
<h3>Xung đột &amp; điểm nút cốt truyện</h3>
<p>Mọi câu chuyện cần <strong>xung đột</strong> (nhân vật chống lại bản thân / người khác / tự nhiên / xã hội) để tạo căng thẳng. <strong>Điểm nút cốt truyện (plot point)</strong> là các khúc rẽ đẩy chuyện từ hồi này sang hồi khác — một dự án transmedia có thể đặt các điểm nút khác nhau lên các nền tảng khác nhau.</p>
<h3>Kể chuyện phi tuyến, phân tán</h3>
<p>Transmedia hiếm khi kể theo một mốc thời gian thẳng. Một truyện tranh có thể kể tiền truyện (trước phim), một game có thể chạy song song (nhiệm vụ của nhân vật phụ), một trang mạng xã hội có thể diễn ra "theo thời gian thật" từ góc nhìn một nhân vật. Khán giả tự ráp lại dòng thời gian.</p>
<div class="callout"><span class="badge">Gợi ý thiết kế</span> Hãy vẽ MỘT chuyện/dòng thời gian nền trước, rồi chọn lát cắt nào đi lên nền tảng nào — đừng bao giờ tạo sự kiện mâu thuẫn giữa các nền tảng.</div>`,
  ]]);

const c2q = quiz('mco201c-quiz-2', 'Quiz 2 — Narrative & structure|||Quiz 2 — Kể chuyện & cấu trúc', [
  { id: 'q1', question: 'Sự khác biệt giữa "story" và "narrative" là gì?', options: ['Không có khác biệt', 'Story là chuỗi sự kiện thô; narrative là cách kể (thứ tự, phương tiện, góc nhìn)', 'Story chỉ dùng cho phim, narrative chỉ dùng cho game', 'Narrative luôn dài hơn story'], correctIndex: 1, explanation: 'Story = sự kiện xảy ra; narrative = cách những sự kiện đó được kể ra.' },
  { id: 'q2', question: 'Cấu trúc ba hồi gồm những phần nào?', options: ['Mở đầu, đối đầu, kết thúc', 'Giới thiệu, quảng cáo, bán hàng', 'Chương 1, chương 2, chương 3 bất kỳ', 'Nhân vật, bối cảnh, chủ đề'], correctIndex: 0, explanation: 'Ba hồi kinh điển: Setup (mở đầu) — Confrontation (đối đầu) — Resolution (kết thúc).' },
  { id: 'q3', question: 'Vì sao transmedia thường kể chuyện phi tuyến, phân tán trên nhiều nền tảng?', options: ['Vì không có cách nào kể tuyến tính được', 'Vì mỗi nền tảng có thể kể một lát cắt khác của cùng dòng thời gian, khán giả tự ráp lại', 'Để tiết kiệm chi phí sản xuất', 'Vì luật bản quyền yêu cầu vậy'], correctIndex: 1, explanation: 'Mỗi nền tảng đóng góp một phần khác của một chuyện nền; khán giả ráp toàn cảnh.' },
]);

const c3 = doc('mco201c-3-1-worldbuilding', '3.1 — World-building & continuity|||3.1 — Thế giới truyện (world-building) & tính liên tục',
  'Xây dựng "story bible" (luật thế giới, địa lý, lịch sử); canon vs. non-canon; quản lý tính liên tục qua nhiều tác giả/nền tảng.',
  [[
    `<span class="eyebrow">MCO201c · Chapter 3 · Lesson 3.1</span>
<h2>World-building &amp; continuity</h2>
<h3>The story bible</h3>
<p>Before writing any platform-specific content, transmedia teams write a <strong>"story bible"</strong> — the single source of truth covering the world's rules, geography, history, factions, timeline and characters. Every writer across every platform must consult it before creating new content.</p>
<h3>Canon vs. non-canon</h3>
<ul>
<li><strong>Canon</strong> — events/facts officially considered TRUE within the story world (they count towards continuity).</li>
<li><strong>Non-canon</strong> — spin-offs, "what if" content, fan works that are explicitly NOT part of the official continuity.</li>
</ul>
<h3>Continuity across many authors/platforms</h3>
<p>The hardest operational problem in transmedia: dozens of writers, on different platforms, at different companies, all writing in the SAME world at the SAME time — without contradicting each other. Solutions:</p>
<ul>
<li>A <strong>continuity editor / story architect</strong> role who approves everything against the bible.</li>
<li>A shared <strong>timeline document</strong> everyone checks before introducing new events.</li>
<li>Clear rules for what each platform is (and is NOT) allowed to change (e.g. "no platform may kill the protagonist except the film").</li>
</ul>
<pre><code>Story bible
 ├─ World rules (physics/magic/tech limits)
 ├─ Geography & factions
 ├─ Master timeline (canon events)
 └─ Character bios (traits, voice, arcs)
      -> every platform writer must check against this before adding content
</code></pre>
<div class="callout"><span class="badge">Real-world failure mode</span> Skip a story bible and two platforms will eventually contradict each other (a character dies in the comic but appears alive in the game with no explanation) — breaking the audience's trust in the whole world.</div>`,
    `<span class="eyebrow">MCO201c · Chương 3 · Bài 3.1</span>
<h2>Thế giới truyện (world-building) &amp; tính liên tục</h2>
<h3>"Story bible" — kinh thánh câu chuyện</h3>
<p>Trước khi viết nội dung riêng cho từng nền tảng, đội transmedia soạn một <strong>"story bible"</strong> — nguồn sự thật duy nhất bao trùm luật thế giới, địa lý, lịch sử, phe phái, dòng thời gian và nhân vật. Mọi người viết trên mọi nền tảng phải tra cứu nó trước khi tạo nội dung mới.</p>
<h3>Canon vs. non-canon</h3>
<ul>
<li><strong>Canon (chính thống)</strong> — sự kiện/dữ liệu được công nhận chính thức là ĐÚNG trong thế giới truyện (được tính vào tính liên tục).</li>
<li><strong>Non-canon (ngoại truyện)</strong> — spin-off, nội dung "nếu như", tác phẩm fan làm — được nói rõ KHÔNG thuộc dòng chính thống.</li>
</ul>
<h3>Giữ tính liên tục qua nhiều tác giả/nền tảng</h3>
<p>Vấn đề vận hành khó nhất của transmedia: hàng chục người viết, trên nhiều nền tảng, ở nhiều công ty khác nhau, cùng viết vào MỘT thế giới ở CÙNG thời điểm — mà không mâu thuẫn nhau. Giải pháp:</p>
<ul>
<li>Vai trò <strong>continuity editor / story architect</strong> — người duyệt mọi nội dung so với story bible.</li>
<li><strong>Tài liệu dòng thời gian chung</strong> mọi người tra trước khi thêm sự kiện mới.</li>
<li>Quy định rõ nền tảng nào ĐƯỢC/KHÔNG ĐƯỢC thay đổi gì (vd "chỉ phim mới được cho nhân vật chính chết").</li>
</ul>
<pre><code>Story bible
 ├─ Luật thế giới (vật lý/ma pháp/công nghệ giới hạn)
 ├─ Địa lý & phe phái
 ├─ Dòng thời gian chính (sự kiện canon)
 └─ Hồ sơ nhân vật (tính cách, giọng văn, cung phát triển)
      -> mọi người viết trên mọi nền tảng phải tra cái này trước khi viết thêm
</code></pre>
<div class="callout"><span class="badge">Lỗi thường gặp thực tế</span> Bỏ qua story bible, sớm muộn hai nền tảng sẽ mâu thuẫn nhau (nhân vật chết trong truyện tranh nhưng vẫn sống trong game mà không giải thích) — làm khán giả mất niềm tin vào cả thế giới truyện.</div>`,
  ]]);

const c3q = quiz('mco201c-quiz-3', 'Quiz 3 — World-building & continuity|||Quiz 3 — Thế giới truyện & tính liên tục', [
  { id: 'q1', question: '"Story bible" trong sản xuất transmedia dùng để làm gì?', options: ['Kịch bản chi tiết cho một tập phim', 'Nguồn sự thật duy nhất về luật thế giới, dòng thời gian, nhân vật mà mọi nền tảng phải tuân theo', 'Hợp đồng bản quyền với nhà đầu tư', 'Danh sách diễn viên casting'], correctIndex: 1, explanation: 'Story bible là tài liệu gốc mọi tác giả/nền tảng phải tra cứu để không mâu thuẫn nhau.' },
  { id: 'q2', question: 'Sự kiện "canon" trong một thế giới truyện là gì?', options: ['Sự kiện fan tự tưởng tượng', 'Sự kiện được công nhận chính thức là đúng, tính vào tính liên tục chung', 'Sự kiện chỉ xảy ra trong quảng cáo', 'Sự kiện bị xoá khỏi câu chuyện'], correctIndex: 1, explanation: 'Canon = chính thống, được công nhận là thật trong thế giới truyện; ngược với non-canon.' },
  { id: 'q3', question: 'Vì sao transmedia cần vai trò "continuity editor / story architect"?', options: ['Để viết toàn bộ nội dung một mình', 'Để duyệt nội dung mới của mọi nền tảng, tránh mâu thuẫn với story bible', 'Để làm marketing cho dự án', 'Để quản lý ngân sách sản xuất'], correctIndex: 1, explanation: 'Nhiều tác giả cùng viết vào một thế giới → cần người duyệt so với bible để giữ tính liên tục.' },
]);

const c4 = doc('mco201c-4-1-hero-journey', '4.1 — Characters & the hero\'s journey|||4.1 — Nhân vật & mô hình hành trình anh hùng',
  'Xây dựng nhân vật (mục tiêu, nhu cầu, mâu thuẫn nội tâm); Campbell — huyền thoại đơn nhất/hành trình anh hùng, 3 giai đoạn chính.',
  [[
    `<span class="eyebrow">MCO201c · Chapter 4 · Lesson 4.1</span>
<h2>Characters &amp; the hero's journey</h2>
<h3>Building a character</h3>
<p>A compelling character needs: an external <strong>goal</strong> (what they want), an internal <strong>need</strong> (what they truly lack, often unknown to them), a <strong>flaw</strong>, and a distinct <strong>voice</strong>. In transmedia, a character's core traits must stay consistent across every platform, even as their role/context changes.</p>
<h3>Campbell's monomyth (hero's journey)</h3>
<p>Joseph Campbell studied myths across cultures and found a recurring pattern he called the <strong>monomyth</strong>, popularly "the hero's journey" — used across countless films, games and franchises. Three broad stages:</p>
<pre><code>1. Departure   — ordinary world -> call to adventure -> crossing the threshold
2. Initiation  — trials, allies & enemies, the ordeal (biggest crisis), the reward
3. Return      — the road back -> resurrection -> return with the elixir (transformed)
</code></pre>
<ul>
<li><strong>Departure</strong> — the hero leaves the known world, often reluctantly, guided by a mentor.</li>
<li><strong>Initiation</strong> — a series of tests builds the hero, culminating in the ordeal — the hero's biggest confrontation, often a symbolic "death and rebirth".</li>
<li><strong>Return</strong> — the hero returns transformed, bringing something of value ("the elixir") back to their world.</li>
</ul>
<h3>Why it fits transmedia so well</h3>
<p>The hero's journey has natural "gaps" (mentor's backstory, an ally's side-quest, the ordinary world before the call) that make excellent material for SEPARATE platforms — a prequel comic can cover the mentor, a game can let players live the trials, while the film covers the main arc.</p>
<div class="callout"><span class="badge">Caution</span> The hero's journey is a useful template, not a rigid formula — force-fitting every beat can make a story feel generic. Use it to spot structural gaps to fill across platforms, not as a checklist to tick.</div>`,
    `<span class="eyebrow">MCO201c · Chương 4 · Bài 4.1</span>
<h2>Nhân vật &amp; mô hình hành trình anh hùng</h2>
<h3>Xây dựng nhân vật</h3>
<p>Một nhân vật cuốn hút cần: <strong>mục tiêu</strong> bên ngoài (họ muốn gì), <strong>nhu cầu</strong> bên trong (họ thật sự thiếu gì, thường chính họ không biết), một <strong>điểm yếu (flaw)</strong>, và một <strong>giọng riêng</strong>. Trong transmedia, các đặc điểm cốt lõi của nhân vật phải giữ nhất quán trên mọi nền tảng, dù vai trò/bối cảnh thay đổi.</p>
<h3>Huyền thoại đơn nhất của Campbell (hành trình anh hùng)</h3>
<p>Joseph Campbell nghiên cứu huyền thoại khắp các nền văn hoá và tìm ra một khuôn mẫu lặp lại gọi là <strong>monomyth</strong>, thường gọi là "hành trình anh hùng" — được dùng trong vô số phim, game và franchise. Ba giai đoạn lớn:</p>
<pre><code>1. Ra đi     — thế giới thường ngày -> lời gọi mạo hiểm -> vượt qua ngưỡng cửa
2. Khai mở   — thử thách, đồng hành & kẻ thù, thử thách lớn nhất (khổ nạn), phần thưởng
3. Trở về    — đường trở lại -> tái sinh -> trở về với "linh dược" (đã đổi khác)
</code></pre>
<ul>
<li><strong>Ra đi</strong> — anh hùng rời thế giới quen thuộc, thường miễn cưỡng, được người thầy (mentor) dẫn dắt.</li>
<li><strong>Khai mở</strong> — một chuỗi thử thách rèn luyện anh hùng, đỉnh điểm là khổ nạn — đối đầu lớn nhất, thường mang tính "chết và tái sinh" biểu tượng.</li>
<li><strong>Trở về</strong> — anh hùng trở về đã biến đổi, mang theo thứ giá trị ("linh dược") về cho thế giới của mình.</li>
</ul>
<h3>Vì sao hợp với transmedia</h3>
<p>Hành trình anh hùng có những "khoảng trống" tự nhiên (tiền truyện của người thầy, nhiệm vụ phụ của đồng hành, thế giới thường ngày trước lời gọi) — là chất liệu tuyệt vời cho các nền tảng RIÊNG — truyện tranh tiền truyện có thể kể về người thầy, game có thể để người chơi sống qua các thử thách, còn phim kể mạch chính.</p>
<div class="callout"><span class="badge">Lưu ý</span> Hành trình anh hùng là khuôn mẫu tham khảo, không phải công thức cứng — ép mọi nhịp vào đúng khuôn có thể làm câu chuyện nhàm. Dùng nó để tìm khoảng trống cấu trúc cần lấp trên các nền tảng, không phải để tích từng ô.</div>`,
  ]]);

const c4q = quiz('mco201c-quiz-4', 'Quiz 4 — Character & hero\'s journey|||Quiz 4 — Nhân vật & hành trình anh hùng', [
  { id: 'q1', question: 'Ba giai đoạn lớn của hành trình anh hùng (Campbell) là gì?', options: ['Mở đầu, giữa truyện, kết thúc', 'Ra đi, khai mở, trở về', 'Giới thiệu, cao trào, hạ màn', 'Casting, quay phim, hậu kỳ'], correctIndex: 1, explanation: 'Monomyth của Campbell: Departure (ra đi) — Initiation (khai mở) — Return (trở về).' },
  { id: 'q2', question: 'Vì sao hành trình anh hùng phù hợp để chia thành nhiều nền tảng transmedia?', options: ['Vì nó bắt buộc phải quay thành phim', 'Vì nó có các khoảng trống tự nhiên (tiền truyện, nhiệm vụ phụ) làm chất liệu riêng cho từng nền tảng', 'Vì nó ngắn nên dễ kể trong một bài đăng', 'Vì Campbell yêu cầu phải làm vậy'], correctIndex: 1, explanation: 'Các khoảng trống trong hành trình (mentor, đồng hành, thế giới trước lời gọi) hợp làm nội dung riêng cho từng platform.' },
  { id: 'q3', question: 'Điều gì cần giữ NHẤT QUÁN cho một nhân vật xuyên suốt các nền tảng transmedia?', options: ['Trang phục phải giống 100% mọi lúc', 'Đặc điểm cốt lõi: mục tiêu, nhu cầu nội tâm, điểm yếu, giọng riêng', 'Diễn viên lồng tiếng phải là một người duy nhất', 'Tên nhân vật phải viết hoa toàn bộ'], correctIndex: 1, explanation: 'Vai trò/bối cảnh có thể đổi theo nền tảng, nhưng bản chất nhân vật (mục tiêu/nhu cầu/điểm yếu/giọng) phải nhất quán.' },
]);

const c5 = doc('mco201c-5-1-platforms', '5.1 — Storytelling across platforms|||5.1 — Kể chuyện trên nhiều nền tảng',
  'Đặc thù kể chuyện: film (hình ảnh/thời gian tuyến tính), game (tương tác/chọn lựa), social (thời gian thật/giọng cá nhân), web (siêu liên kết/khám phá).',
  [[
    `<span class="eyebrow">MCO201c · Chapter 5 · Lesson 5.1</span>
<h2>Storytelling across platforms</h2>
<p>Every medium has an "affordance" — what it naturally does better than others. Good transmedia design assigns each platform the part of the story it's BEST suited to tell.</p>
<h3>Film / TV</h3>
<p>Best at: emotionally-driven visual spectacle, a controlled, linear pace, the "main event" of a franchise (usually canon-critical, high budget).</p>
<h3>Games</h3>
<p>Best at: agency — the player makes choices and directly experiences consequences. Great for side-quests, exploring a corner of the world, or letting players "become" a secondary character.</p>
<h3>Social media</h3>
<p>Best at: real-time, in-character voice; intimacy and immediacy (a character "live-tweeting" events as they happen); rewarding fans who follow closely with extra clues.</p>
<h3>Web / ARG (alternate reality game) elements</h3>
<p>Best at: hyperlinked discovery, puzzles, hidden sites/documents "in-world" (fake company websites, leaked documents) that reward investigation — perfect for collective-intelligence fan communities to piece together.</p>
<pre><code>Story world W
 ├─ Film   -> main emotional arc, spectacle, canon backbone
 ├─ Game   -> player agency, side-quests, "live" a corner of W
 ├─ Social -> real-time voice, intimacy, drip-fed clues
 └─ Web/ARG-> puzzles, in-world documents, collective-intelligence hunts
</code></pre>
<div class="callout"><span class="badge">Design rule</span> Never ask "what content can we put on platform X" — ask "what does platform X do better than any other platform, and which story piece needs exactly that."</div>`,
    `<span class="eyebrow">MCO201c · Chương 5 · Bài 5.1</span>
<h2>Kể chuyện trên nhiều nền tảng</h2>
<p>Mỗi phương tiện có một "thế mạnh tự nhiên" — thứ nó làm tốt hơn phương tiện khác. Thiết kế transmedia tốt là giao cho mỗi nền tảng đúng phần câu chuyện nó PHÙ HỢP NHẤT để kể.</p>
<h3>Phim / truyền hình</h3>
<p>Mạnh nhất ở: hình ảnh mãn nhãn gợi cảm xúc, nhịp kể tuyến tính có kiểm soát, "sự kiện chính" của franchise (thường là canon quan trọng, kinh phí cao).</p>
<h3>Game</h3>
<p>Mạnh nhất ở: tính chủ động (agency) — người chơi ra quyết định và trực tiếp chịu hậu quả. Rất hợp cho nhiệm vụ phụ, khám phá một góc thế giới, hoặc để người chơi "trở thành" một nhân vật phụ.</p>
<h3>Mạng xã hội</h3>
<p>Mạnh nhất ở: giọng nói theo thời gian thật, đúng vai nhân vật; sự gần gũi và tức thời (nhân vật "live-tweet" khi sự kiện đang xảy ra); tưởng thưởng fan theo dõi sát bằng manh mối phụ.</p>
<h3>Web / yếu tố ARG (game thực tế thay thế)</h3>
<p>Mạnh nhất ở: khám phá qua siêu liên kết, câu đố, trang/tài liệu ẩn "trong thế giới" (trang web công ty giả, tài liệu bị rò rỉ) khuyến khích điều tra — hoàn hảo để cộng đồng fan (trí tuệ tập thể) cùng ráp lại.</p>
<pre><code>Thế giới truyện W
 ├─ Phim    -> mạch cảm xúc chính, hình ảnh hoành tráng, xương sống canon
 ├─ Game    -> tính chủ động, nhiệm vụ phụ, "sống" một góc W
 ├─ MXH     -> giọng thời gian thật, gần gũi, rải manh mối dần
 └─ Web/ARG -> câu đố, tài liệu trong thế giới, cuộc săn của trí tuệ tập thể
</code></pre>
<div class="callout"><span class="badge">Nguyên tắc thiết kế</span> Đừng hỏi "nền tảng X có thể đăng gì" — hãy hỏi "nền tảng X làm tốt cái gì hơn mọi nền tảng khác, và phần chuyện nào cần đúng cái đó."</div>`,
  ]]);

const c5q = quiz('mco201c-quiz-5', 'Quiz 5 — Platform-specific storytelling|||Quiz 5 — Kể chuyện theo nền tảng', [
  { id: 'q1', question: 'Vì sao game thường được giao phần "nhiệm vụ phụ" trong transmedia?', options: ['Vì game rẻ hơn phim', 'Vì game mạnh về tính chủ động — người chơi ra quyết định và chịu hậu quả', 'Vì game không cần kịch bản', 'Vì game không thể kể chuyện chính'], correctIndex: 1, explanation: 'Thế mạnh tự nhiên của game là "agency" — sự chủ động của người chơi.' },
  { id: 'q2', question: 'Mạng xã hội trong một dự án transmedia thường được dùng để làm gì?', options: ['Thay thế hoàn toàn bộ phim chính', 'Kể chuyện theo thời gian thật, đúng giọng nhân vật, rải manh mối cho fan theo sát', 'Chỉ để đăng lịch chiếu phim', 'Không có vai trò kể chuyện nào'], correctIndex: 1, explanation: 'Social mạnh về sự tức thời và giọng cá nhân — hợp để "sống" cùng nhân vật theo thời gian thật.' },
  { id: 'q3', question: 'Nguyên tắc thiết kế nền tảng nào được nhắc trong bài?', options: ['Đăng cùng nội dung y hệt lên mọi nền tảng cho chắc', 'Hỏi nền tảng nào làm tốt việc gì nhất, rồi giao đúng phần chuyện cần điều đó', 'Chỉ dùng nền tảng rẻ nhất', 'Bỏ qua đặc thù của từng phương tiện'], correctIndex: 1, explanation: 'Giao mỗi nền tảng phần chuyện phù hợp với thế mạnh tự nhiên của nó, không rải đều nội dung giống nhau.' },
]);

const c6 = doc('mco201c-6-1-audience', '6.1 — Audience participation & user-generated content|||6.1 — Sự tham gia của khán giả & nội dung do người dùng tạo (UGC)',
  'Văn hoá tham gia (participatory culture); fandom, cộng đồng fan; UGC — lợi ích & rủi ro; ranh giới canon với nội dung fan tạo.',
  [[
    `<span class="eyebrow">MCO201c · Chapter 6 · Lesson 6.1</span>
<h2>Audience participation &amp; user-generated content</h2>
<h3>Participatory culture</h3>
<p>Jenkins argues that today's audiences are not passive recipients — they are <strong>active participants</strong> who discuss, theorize, remix, and produce their own content around a story world. Successful transmedia projects design deliberate spaces for this participation (forums, ARG puzzles, hashtag campaigns) rather than fighting it.</p>
<h3>Fandom &amp; fan communities</h3>
<p>A dedicated <strong>fandom</strong> extends a story's life well past its official release — through wikis, fan fiction, cosplay, fan theories and fan art. This is free marketing and deepened engagement, but it also means the brand no longer fully controls the narrative conversation.</p>
<h3>User-generated content (UGC)</h3>
<ul>
<li><strong>Benefits</strong> — authenticity, viral reach, audience investment, low production cost for the brand.</li>
<li><strong>Risks</strong> — off-message or offensive content, IP/legal exposure, "canon confusion" if fans mistake fan work for official.</li>
</ul>
<h3>Managing the canon boundary</h3>
<p>Best practice: clearly label official content vs. fan content (badges, separate hubs), and — when a project wants fan input to matter — create an explicit "semi-canon" or "featured fan content" tier instead of leaving the line ambiguous.</p>
<div class="callout"><span class="badge">Example</span> An ARG that plants an "in-world" leaked document and lets fans decode it on a wiki turns the AUDIENCE into co-authors of the discovery process — without handing them the pen on canon itself.</div>`,
    `<span class="eyebrow">MCO201c · Chương 6 · Bài 6.1</span>
<h2>Sự tham gia của khán giả &amp; nội dung do người dùng tạo (UGC)</h2>
<h3>Văn hoá tham gia (participatory culture)</h3>
<p>Jenkins cho rằng khán giả ngày nay không phải người nhận thụ động — họ là <strong>người tham gia chủ động</strong>, bàn luận, suy đoán, chế lại, và tự tạo nội dung xoay quanh một thế giới truyện. Dự án transmedia thành công chủ động thiết kế không gian cho sự tham gia này (diễn đàn, câu đố ARG, chiến dịch hashtag) thay vì chống lại nó.</p>
<h3>Fandom &amp; cộng đồng fan</h3>
<p>Một <strong>fandom</strong> tận tâm kéo dài sự sống của câu chuyện lâu hơn nhiều so với thời điểm phát hành chính thức — qua wiki, fan fiction, cosplay, giả thuyết fan và fan art. Đây là marketing miễn phí và gắn kết sâu hơn, nhưng cũng nghĩa là thương hiệu không còn kiểm soát hoàn toàn cuộc thảo luận về câu chuyện.</p>
<h3>Nội dung do người dùng tạo (UGC)</h3>
<ul>
<li><strong>Lợi ích</strong> — tính xác thực, lan truyền tự nhiên, sự gắn bó của khán giả, chi phí sản xuất thấp cho thương hiệu.</li>
<li><strong>Rủi ro</strong> — nội dung lệch thông điệp hoặc phản cảm, rủi ro pháp lý/bản quyền, "nhầm canon" nếu fan lẫn nội dung fan làm với nội dung chính thức.</li>
</ul>
<h3>Giữ ranh giới canon</h3>
<p>Thực hành tốt: đánh dấu rõ nội dung chính thức khác nội dung fan (nhãn/huy hiệu, khu vực riêng), và — khi dự án muốn ý kiến fan có ảnh hưởng thật — tạo hẳn một tầng "bán-canon" hoặc "nội dung fan được chọn nổi bật" thay vì để ranh giới mập mờ.</p>
<div class="callout"><span class="badge">Ví dụ</span> Một ARG cài một "tài liệu rò rỉ trong thế giới" và để fan giải mã trên wiki biến KHÁN GIẢ thành đồng tác giả của quá trình khám phá — mà không trao bút viết canon thật cho họ.</div>`,
  ]]);

const c6q = quiz('mco201c-quiz-6', 'Quiz 6 — Audience & UGC|||Quiz 6 — Khán giả & UGC', [
  { id: 'q1', question: 'Theo Jenkins, khán giả trong văn hoá tham gia được xem là gì?', options: ['Người tiêu thụ hoàn toàn thụ động', 'Người tham gia chủ động: bàn luận, suy đoán, tự tạo nội dung', 'Chỉ là khách hàng mua vé', 'Không có ảnh hưởng gì đến câu chuyện'], correctIndex: 1, explanation: 'Participatory culture: khán giả chủ động thảo luận, remix, sản xuất nội dung quanh thế giới truyện.' },
  { id: 'q2', question: 'Rủi ro chính của việc dùng nội dung do người dùng tạo (UGC) là gì?', options: ['UGC luôn miễn phí và an toàn tuyệt đối', 'Nội dung lệch thông điệp, rủi ro bản quyền, và fan có thể nhầm nó là canon chính thức', 'UGC không bao giờ được fan quan tâm', 'UGC chỉ dùng được cho phim, không dùng được cho game'], correctIndex: 1, explanation: 'UGC có lợi (xác thực, lan truyền) nhưng đi kèm rủi ro pháp lý và nhầm lẫn canon.' },
  { id: 'q3', question: 'Cách thực hành tốt để quản lý ranh giới canon với nội dung fan là gì?', options: ['Xoá hết mọi nội dung fan tạo', 'Đánh dấu rõ nội dung chính thức khác nội dung fan, có thể tạo tầng "bán-canon" riêng', 'Im lặng không phản hồi gì với fan', 'Cho phép fan tự do sửa story bible chính thức'], correctIndex: 1, explanation: 'Nhãn/khu vực riêng cho nội dung chính thức vs. fan giúp tránh nhầm lẫn về canon.' },
]);

const c7 = doc('mco201c-7-1-marketing', '7.1 — Transmedia in marketing & branded content|||7.1 — Transmedia trong marketing & xây dựng thương hiệu (branded content)',
  'Branded content vs. quảng cáo truyền thống; transmedia campaign (nhiều điểm chạm, mỗi kênh một vai); case study kinh điển (The Matrix, ARG marketing).',
  [[
    `<span class="eyebrow">MCO201c · Chapter 7 · Lesson 7.1</span>
<h2>Transmedia in marketing &amp; branded content</h2>
<h3>Branded content vs. traditional advertising</h3>
<p>Traditional advertising interrupts content to sell a message. <strong>Branded content</strong> IS the content — entertainment, story or utility valuable enough that audiences seek it out, with the brand woven in rather than bolted on.</p>
<h3>The transmedia marketing campaign</h3>
<p>Instead of one ad repeated everywhere, a transmedia campaign gives each channel a distinct role in a single unfolding story: a teaser site plants a mystery, social accounts "in character" drip clues, a short film reveals the twist, an event lets fans experience the payoff live. Consumers become active investigators of the brand's story, not passive viewers of its ad.</p>
<h3>Classic case: The Matrix</h3>
<p>Jenkins repeatedly analyzes <em>The Matrix</em> as an early landmark: the films carried the emotional core, the <em>Enter the Matrix</em> game let players experience parallel events, the <em>Animatrix</em> shorts filled backstory gaps, and an official website/comics extended the mythology — each piece essential, none redundant.</p>
<h3>ARG marketing (alternate reality game)</h3>
<p>Some of the most famous transmedia marketing campaigns used ARG techniques — fake "leaked" websites, phone numbers that answer in-character, puzzles that unlock a trailer — turning promotion itself into a piece of the story world.</p>
<div class="callout"><span class="badge">Marketing takeaway</span> A transmedia campaign succeeds when audiences feel they discovered the story, not that they were sold to. That's the difference from a traditional multi-channel ad blast.</div>`,
    `<span class="eyebrow">MCO201c · Chương 7 · Bài 7.1</span>
<h2>Transmedia trong marketing &amp; xây dựng thương hiệu</h2>
<h3>Branded content vs. quảng cáo truyền thống</h3>
<p>Quảng cáo truyền thống ngắt ngang nội dung để bán một thông điệp. <strong>Branded content</strong> LÀ nội dung — giải trí, câu chuyện hoặc giá trị hữu ích đủ hấp dẫn để khán giả tự tìm đến, với thương hiệu được dệt vào bên trong thay vì gắn thêm bên ngoài.</p>
<h3>Chiến dịch marketing transmedia</h3>
<p>Thay vì một mẫu quảng cáo lặp lại khắp nơi, một chiến dịch transmedia giao cho mỗi kênh một vai riêng trong cùng một câu chuyện hé lộ dần: một trang teaser cài bí ẩn, tài khoản mạng xã hội "nhập vai" rải manh mối, một phim ngắn hé lộ bước ngoặt, một sự kiện cho fan trải nghiệm cao trào trực tiếp. Người tiêu dùng trở thành người điều tra chủ động câu chuyện của thương hiệu, không phải người xem quảng cáo thụ động.</p>
<h3>Case kinh điển: The Matrix</h3>
<p>Jenkins nhiều lần phân tích <em>The Matrix</em> như một mốc sớm: các phim mang mạch cảm xúc chính, game <em>Enter the Matrix</em> cho người chơi sống qua các sự kiện song song, phim ngắn <em>Animatrix</em> lấp khoảng trống tiền truyện, và trang web/truyện tranh chính thức mở rộng thần thoại — mỗi phần đều thiết yếu, không phần nào trùng lặp.</p>
<h3>Marketing kiểu ARG (game thực tế thay thế)</h3>
<p>Một số chiến dịch marketing transmedia nổi tiếng nhất dùng kỹ thuật ARG — trang web "rò rỉ" giả, số điện thoại trả lời đúng vai nhân vật, câu đố mở khoá trailer — biến chính việc quảng bá thành một phần của thế giới truyện.</p>
<div class="callout"><span class="badge">Bài học marketing</span> Một chiến dịch transmedia thành công khi khán giả cảm thấy họ TỰ KHÁM PHÁ ra câu chuyện, không phải bị bán hàng. Đó là khác biệt so với một chiến dịch quảng cáo đa kênh truyền thống.</div>`,
  ]]);

const c7q = quiz('mco201c-quiz-7', 'Quiz 7 — Transmedia marketing|||Quiz 7 — Marketing transmedia', [
  { id: 'q1', question: '"Branded content" khác quảng cáo truyền thống ở điểm nào?', options: ['Branded content ngắt ngang nội dung để bán hàng', 'Branded content CHÍNH LÀ nội dung có giá trị, thương hiệu được dệt vào tự nhiên', 'Branded content luôn rẻ hơn quảng cáo TV', 'Không có gì khác biệt'], correctIndex: 1, explanation: 'Quảng cáo truyền thống chèn ngang; branded content là nội dung tự thân đáng xem, thương hiệu lồng vào.' },
  { id: 'q2', question: 'Trong một chiến dịch marketing transmedia, mỗi kênh nên đóng vai trò như thế nào?', options: ['Lặp lại đúng một mẫu quảng cáo giống nhau', 'Đóng một vai riêng trong một câu chuyện hé lộ dần, khác nhau giữa các kênh', 'Chỉ kênh có ngân sách cao nhất mới cần nội dung', 'Không cần liên kết gì giữa các kênh'], correctIndex: 1, explanation: 'Mỗi kênh giữ một vai khác nhau, bổ sung cho nhau trong một câu chuyện chung — đúng tinh thần transmedia.' },
  { id: 'q3', question: 'Vì sao case The Matrix được xem là mốc kinh điển của transmedia marketing/storytelling?', options: ['Vì chỉ có một bộ phim duy nhất', 'Vì phim, game, phim ngắn Animatrix và web/truyện tranh mỗi phần đều thiết yếu, không trùng lặp nhau', 'Vì nó không có chiến dịch quảng bá nào', 'Vì nó chỉ phát hành trên một quốc gia'], correctIndex: 1, explanation: 'Mỗi nền tảng của Matrix góp một phần khác, không dư thừa — đúng định nghĩa transmedia của Jenkins.' },
]);

const c8 = doc('mco201c-8-1-production', '8.1 — Measurement, production & trends|||8.1 — Đo lường, sản xuất dự án transmedia & xu hướng',
  'Chỉ số đo lường transmedia (reach, engagement, cross-platform tracking); quy trình sản xuất (story architect, đội đa nền tảng); xu hướng AI, streaming, tương tác thời gian thật.',
  [[
    `<span class="eyebrow">MCO201c · Chapter 8 · Lesson 8.1</span>
<h2>Measurement, production &amp; trends</h2>
<h3>Measuring a transmedia project</h3>
<p>Because content is spread across platforms, simple "views" undercount real impact. Useful metrics:</p>
<ul>
<li><strong>Cross-platform reach</strong> — unique audience touched by AT LEAST one piece of the campaign.</li>
<li><strong>Engagement depth</strong> — how many platforms/pieces a given fan consumed (a proxy for how deeply they entered the world).</li>
<li><strong>UGC/earned media volume</strong> — fan-created content, hashtag usage, wiki edits — a sign the world "took on a life of its own".</li>
<li><strong>Conversion/business outcome</strong> — ultimately tied back to the campaign's actual goal (ticket sales, sign-ups, brand lift).</li>
</ul>
<h3>Production process</h3>
<p>A transmedia production typically has: a <strong>story architect</strong> (owns the bible/continuity), platform-specific creative teams (film, game, social, web), and a central production/continuity review loop that checks new content against the bible before release — the same continuity discipline covered in Chapter 3, now applied at production scale.</p>
<h3>Trends to watch</h3>
<ul>
<li><strong>Streaming-first franchises</strong> — episodic platforms make it easier to interleave companion content (podcasts, tie-in shorts) release-by-release.</li>
<li><strong>AI-assisted content</strong> — generative tools speeding up companion content production, raising new continuity/quality-control questions.</li>
<li><strong>Real-time, live interactive storytelling</strong> — livestreams, in-game live events, social "in real time" story beats blurring the line between story and live audience participation.</li>
</ul>
<div class="callout"><span class="badge">Closing idea</span> Transmedia is a discipline, not a checklist — measure what actually matters to your goal, keep continuity tight as you scale, and stay honest about which platform earns its place in the story.</div>`,
    `<span class="eyebrow">MCO201c · Chương 8 · Bài 8.1</span>
<h2>Đo lường, sản xuất dự án transmedia &amp; xu hướng</h2>
<h3>Đo lường một dự án transmedia</h3>
<p>Vì nội dung trải trên nhiều nền tảng, chỉ số "lượt xem" đơn giản đánh giá thấp tác động thật. Các chỉ số hữu ích:</p>
<ul>
<li><strong>Cross-platform reach</strong> — số khán giả riêng biệt chạm ÍT NHẤT một phần của chiến dịch.</li>
<li><strong>Độ sâu tương tác (engagement depth)</strong> — một fan tiêu thụ bao nhiêu nền tảng/phần — thước đo họ "đi sâu" vào thế giới đến đâu.</li>
<li><strong>Khối lượng UGC/earned media</strong> — nội dung fan tự tạo, dùng hashtag, sửa wiki — dấu hiệu thế giới "tự có đời sống riêng".</li>
<li><strong>Chuyển đổi/kết quả kinh doanh</strong> — cuối cùng phải gắn về mục tiêu thật của chiến dịch (bán vé, đăng ký, nâng nhận diện thương hiệu).</li>
</ul>
<h3>Quy trình sản xuất</h3>
<p>Một dự án transmedia thường có: một <strong>story architect</strong> (giữ story bible/tính liên tục), các đội sáng tạo riêng theo nền tảng (phim, game, social, web), và một vòng duyệt sản xuất/liên tục trung tâm kiểm nội dung mới so với bible trước khi phát hành — chính kỷ luật liên tục đã nói ở Chương 3, giờ áp dụng ở quy mô sản xuất.</p>
<h3>Xu hướng cần theo dõi</h3>
<ul>
<li><strong>Franchise ưu tiên streaming</strong> — nền tảng theo tập giúp dễ chèn nội dung đồng hành (podcast, phim ngắn tie-in) theo từng lượt phát hành.</li>
<li><strong>Nội dung có AI hỗ trợ</strong> — công cụ sinh tự động tăng tốc sản xuất nội dung đồng hành, kéo theo câu hỏi mới về tính liên tục/kiểm soát chất lượng.</li>
<li><strong>Kể chuyện tương tác thời gian thật</strong> — livestream, sự kiện trực tiếp trong game, các nhịp chuyện "thời gian thật" trên mạng xã hội làm mờ ranh giới giữa câu chuyện và sự tham gia trực tiếp của khán giả.</li>
</ul>
<div class="callout"><span class="badge">Ý kết</span> Transmedia là một kỷ luật nghề, không phải danh sách để tích — đo đúng thứ thật sự phục vụ mục tiêu, giữ tính liên tục chặt khi mở rộng quy mô, và trung thực về việc nền tảng nào thật sự đáng có mặt trong câu chuyện.</div>`,
  ]]);

const c8q = quiz('mco201c-quiz-8', 'Quiz 8 — Measurement, production & trends|||Quiz 8 — Đo lường, sản xuất & xu hướng', [
  { id: 'q1', question: 'Vì sao chỉ đo "lượt xem" đơn giản là không đủ cho một dự án transmedia?', options: ['Vì lượt xem luôn sai kỹ thuật', 'Vì nội dung trải trên nhiều nền tảng, cần đo cả reach đa nền tảng, độ sâu tương tác, và UGC mới thấy tác động thật', 'Vì transmedia không cần đo lường gì', 'Vì lượt xem chỉ áp dụng cho phim'], correctIndex: 1, explanation: 'Cần các chỉ số như cross-platform reach, engagement depth, UGC mới phản ánh đúng tác động của một chiến dịch trải nhiều nền tảng.' },
  { id: 'q2', question: 'Vai trò "story architect" trong sản xuất transmedia làm gì?', options: ['Viết toàn bộ lời thoại cho phim', 'Giữ story bible/tính liên tục, duyệt nội dung mới từ mọi nền tảng trước khi phát hành', 'Chỉ phụ trách ngân sách marketing', 'Chọn diễn viên chính'], correctIndex: 1, explanation: 'Story architect đóng vai trò trung tâm giữ tính liên tục — nối tiếp vai continuity editor đã học ở Chương 3.' },
  { id: 'q3', question: 'Xu hướng nào được nêu là đang làm mờ ranh giới giữa câu chuyện và sự tham gia trực tiếp của khán giả?', options: ['In sách giấy truyền thống', 'Kể chuyện tương tác thời gian thật (livestream, sự kiện trực tiếp trong game)', 'Quảng cáo báo in', 'Phát hành đĩa DVD'], correctIndex: 1, explanation: 'Livestream và sự kiện trực tiếp trong game tạo ra các nhịp chuyện thời gian thật, hoà với sự tham gia sống của khán giả.' },
]);

export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'MCO201c',
    slug: 'mco201c-transmedia-storytelling',
    title: 'Transmedia Storytelling',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/MCO201c.webp',
    shortDescription: 'Design one story world across film, games, social & web. Convergence culture (Jenkins), narrative fundamentals, world-building & continuity, the hero\'s journey, audience/UGC, branded content, measurement. Bilingual, with quizzes.|||Thiết kế một thế giới truyện trải trên phim, game, mạng xã hội & web. Văn hoá hội tụ (Jenkins), nền tảng kể chuyện, dựng thế giới & tính liên tục, hành trình anh hùng, khán giả/UGC, branded content, đo lường. Song ngữ, có quiz.',
    description: 'Môn <strong>MCO201c — Transmedia Storytelling</strong> (kỳ 4, khối Quản trị Kinh doanh) dạy cách thiết kế <strong>một câu chuyện trải trên nhiều nền tảng</strong> — phim, game, mạng xã hội, web. Từ <strong>văn hoá hội tụ</strong> (Jenkins) → <strong>nền tảng kể chuyện</strong> → <strong>thế giới truyện &amp; tính liên tục</strong> → <strong>nhân vật &amp; hành trình anh hùng</strong> (Campbell) → <strong>kể chuyện theo nền tảng</strong> → <strong>khán giả &amp; UGC</strong> → <strong>marketing transmedia/branded content</strong> → <strong>đo lường &amp; sản xuất</strong>. Song ngữ, có ví dụ case study và quiz mỗi chương.',
    whatYouLearn: 'Định nghĩa transmedia (Jenkins) & phân biệt với cross-media/adaptation; văn hoá hội tụ, participatory culture, collective intelligence; story vs. narrative, cấu trúc ba hồi; story bible, canon/non-canon, quản lý tính liên tục; xây dựng nhân vật & hành trình anh hùng (Campbell); kể chuyện theo thế mạnh từng nền tảng (film/game/social/web); UGC & fandom; branded content, chiến dịch marketing transmedia, ARG; đo lường cross-platform, quy trình sản xuất, xu hướng.',
    requirements: 'Không yêu cầu tiên quyết đặc biệt; có ích nếu đã học các môn marketing/truyền thông nền tảng của khối Quản trị Kinh doanh.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Sách nền Jenkins/Phillips/Campbell, nguồn mở, case study, lộ trình tự học.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Transmedia là gì, vì sao quan trọng, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Transmedia & văn hoá hội tụ|||Chapter 1 — Transmedia & convergence culture', description: 'Định nghĩa Jenkins, phân biệt cross-media/adaptation, hội tụ & trí tuệ tập thể.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Nền tảng kể chuyện & cấu trúc|||Chapter 2 — Narrative fundamentals & structure', description: 'Story vs narrative, ba hồi, xung đột, kể chuyện phi tuyến.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Thế giới truyện & tính liên tục|||Chapter 3 — World-building & continuity', description: 'Story bible, canon/non-canon, quản lý liên tục nhiều tác giả.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Nhân vật & hành trình anh hùng|||Chapter 4 — Character & hero\'s journey', description: 'Xây nhân vật, monomyth Campbell, ba giai đoạn.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Kể chuyện theo nền tảng|||Chapter 5 — Platform-specific storytelling', description: 'Film/game/social/web, thế mạnh từng nền tảng.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Khán giả & UGC|||Chapter 6 — Audience & UGC', description: 'Participatory culture, fandom, quản lý ranh giới canon.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Transmedia marketing & branded content|||Chapter 7 — Transmedia marketing & branded content', description: 'Branded content, chiến dịch transmedia, case The Matrix, ARG.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Đo lường, sản xuất & xu hướng|||Chapter 8 — Measurement, production & trends', description: 'Chỉ số đo lường, quy trình sản xuất, xu hướng ngành.', lessons: [c8, c8q] },
  ],
};
