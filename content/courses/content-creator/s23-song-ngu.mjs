/**
 * Content Creator — Chương 23: Video song ngữ Việt – Anh. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 *
 * Nguồn số liệu chính (đã GET thật, 22/09/2026, mọi URL 200):
 *  - YouTube Multi-language audio (Âm thanh đa ngôn ngữ): support.google.com/youtube/answer/13338784
 *    — "currently available to creators with access to Advanced features"; tự thu, tải qua
 *    Studio → Languages → Add Language → mục Dub.
 *  - YouTube Automatic dubbing (Lồng tiếng tự động): support.google.com/youtube/answer/15569972
 *    — bật sẵn cho kênh đủ điều kiện, danh sách ineligibility (>120', ít lời, ngôn ngữ không hỗ trợ…),
 *    KHÔNG sửa trực tiếp được, bật/tắt ở Settings → Content → Automatic dubbing.
 *  - YouTube Translate titles & descriptions: support.google.com/youtube/answer/6289575
 *    — Studio → Subtitles → ADD LANGUAGE → Title and description → Add → Publish.
 *  - YouTube altered/synthetic content disclosure (đã kiểm & dẫn ở Ch18.4, xác nhận lại còn sống
 *    22/09/2026): support.google.com/youtube/answer/14328491
 *  - blog.youtube, "Unlocking a global audience with auto dubbing" (news-and-events/youtube-auto-dubbing-
 *    expressive-speech) — >6 triệu người/ngày xem ≥10' nội dung lồng tự động, công bố 02/2026, số liệu 12/2025.
 *  - TikTok Newsroom, "How TikTok recommends videos #ForYou": newsroom.tiktok.com/en-us/how-tiktok-
 *    recommends-videos-for-you — trích đúng câu về "language preference, country setting, device type".
 *  - Meta Business Suite Insights (Audience/Đối tượng — top cities/countries): tổng hợp từ
 *    facebook.com/business/learn + business.facebook.com; KHÔNG dùng tên "Audience Insights" cũ
 *    (công cụ độc lập đó đã ngừng 2021) — chỉ nêu điều còn kiểm được (địa lý người theo dõi trang).
 *  - YouGlish: youglish.com — kiểm sống, mô tả đúng cơ chế (tìm cụm từ trong clip YouTube thật).
 *  - Shadowing: tandfonline.com/doi/full/10.1080/29984475.2025.2546827 — tổng quan hệ thống 2025
 *    (Taylor & Francis) về shadowing cho phát âm ngôn ngữ thứ hai (403 lúc curl trực tiếp — Cloudflare,
 *    coi là sống theo mục 3.4 hợp đồng; nội dung tổng hợp qua WebSearch).
 *  - CEFR B1: Council of Europe (coe.int, 403 curl trực tiếp — coi là sống) + British Council,
 *    mô tả "threshold/independent user" — dùng ở mức khái quát, không trích số liệu riêng.
 *  - Teleprompter /creator (phím Space/R/F/↑↓, Font slider, Mirror): đã kiểm & dẫn ở Ch3.4 — dùng lại,
 *    không dạy lại từ đầu.
 *  - Whisper task=translate, SRT .srt/With timing, ADD LANGUAGE: đã kiểm & dẫn ở Ch16.3/16.4 — dùng lại.
 *  - DataReportal Digital 2026: Vietnam (Facebook/TikTok/YouTube/Instagram reach): đã kiểm & dẫn ở Ch1 —
 *    KHÔNG re-cite số liệu ở đây, chỉ tham chiếu kết luận đã có.
 *  - Chưa kiểm được / còn nghi ngờ: số ngôn ngữ chính xác của Automatic dubbing (help page và blog.youtube
 *    cho hai con số khác nhau tại các thời điểm khác nhau) — bài viết CỐ Ý không chốt một con số, xem
 *    ghi chú trong Bài 23.3. Không có bằng chứng trực tiếp về một chính sách "đồng ý dùng giọng" tách
 *    riêng của YouTube ngoài chính sách disclosure chung — bài viết nói rõ đây là khuyến nghị đạo đức,
 *    không phải trích dẫn một điều khoản cụ thể.
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter 23 — Bilingual Vietnamese–English videos|||Chương 23 — Video song ngữ Việt – Anh',
  description: 'Dạy chiến lược một kênh song ngữ thay vì tách hai kênh, viết kịch bản tiếng Anh khi vốn từ còn hạn chế, bốn cơ chế đa ngôn ngữ thật của YouTube, và quy trình dựng một dự án ra hai phiên bản VI/EN.',
  lessons: [
    /* ─────────────────── 23.0 slide bài giảng ─────────────────── */
    {
      title: '23.0 — Chapter 23 in 13 slides|||23.0 — Chương 23 trong 13 slide',
      slug: 'cr-23-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ chương 23 gói trong 13 slide: một kênh hay hai kênh, viết kịch bản tiếng Anh khi chưa giỏi, bốn cơ chế đa ngôn ngữ của YouTube, và quy trình dựng hai phiên bản VI/EN.',
      content: `
<div class="ml-en"><h2>📑 Chapter 23 in 13 slides</h2>
<p>Chapter 1 already showed you the numbers: a huge Vietnamese audience, and a global but far more competitive English one. This chapter is the "how" that Chapter 1 promised — not by opening a second channel, but by using the language mechanisms YouTube already builds into one Studio, writing an English script you can actually deliver even with a limited vocabulary, and running a shoot-and-edit workflow that produces two language versions without doubling your work.</p>
<p>Skim these 13 slides before the four lessons below, then come back to slide 5 (the four YouTube mechanisms) and slide 12 (the quick-reference table) whenever you need the exact button names mid-upload.</p></div>
<div class="ml-vi"><h2>📑 Chương 23 trong 13 slide</h2>
<p>Chương 1 đã cho bạn thấy các con số: khán giả Việt rất lớn, khán giả tiếng Anh toàn cầu nhưng cạnh tranh hơn nhiều. Chương này là phần "làm thế nào" mà Chương 1 đã hẹn — không phải bằng cách mở kênh thứ hai, mà bằng cách dùng đúng các cơ chế ngôn ngữ YouTube đã dựng sẵn trong một Studio, viết một kịch bản tiếng Anh bạn thật sự nói được dù vốn từ còn hạn chế, và chạy một quy trình quay-dựng cho ra hai phiên bản ngôn ngữ mà không làm việc gấp đôi.</p>
<p>Lướt qua 13 slide này trước khi vào 4 bài dưới, rồi quay lại slide 5 (bốn cơ chế của YouTube) và slide 12 (bảng tra nhanh) mỗi khi cần đúng tên nút giữa lúc đăng video.</p></div>
${gallery('cr-23', [
  [1, 'Bìa chương'],
  [2, 'Bản đồ chương'],
  [3, 'Một kênh hay tách hai kênh riêng?'],
  [4, 'Nội dung nào hợp tiếng nào'],
  [5, '4 cơ chế đa ngôn ngữ của YouTube'],
  [6, 'Thuật ngữ creator EN ↔ VI (trích)'],
  [7, 'Viết kịch bản tiếng Anh khi chưa giỏi'],
  [8, 'Luyện phát âm: 2 công cụ + 1 thói quen'],
  [9, 'Track VI/EN trong một dự án'],
  [10, 'Quy trình hai phiên bản'],
  [11, 'Công cụ & nối chương'],
  [12, 'Bảng tra nhanh trước khi làm'],
  [13, 'Thực hành'],
])}
`,
    },

    /* ─────────────────── 23.1 Chiến lược song ngữ ─────────────────── */
    {
      title: '23.1 — Bilingual strategy: one channel or two|||23.1 — Chiến lược song ngữ: một kênh hay hai kênh',
      slug: 'cr-23-1-chien-luoc-song-ngu',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Vì sao một kênh gắn đúng ngôn ngữ thường tốt hơn tách hai kênh, nội dung nào nên tiếng nào, và ngôn ngữ ảnh hưởng thế nào tới đề xuất trên YouTube/TikTok.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 23 · Lesson 23.1</span>
<h2>One channel or two — and which video should speak which language?</h2>
<p class="lead">Chapter 1 promised to come back to this: your Vietnamese audience is large, and your English audience is global but far more competitive. The real question is not "which language" — it is how to structure your CHANNEL so it serves both without doubling your weekly workload.</p>

<h3>Why you do not need two channels to go bilingual</h3>
<p>The first instinct for many creators is to open a separate Vietnamese channel and a separate English channel — it sounds tidy, professional even. In practice it doubles the work behind a single video: double the ideation, double the shoot schedule, double the edit, double the upload. Chapter 2.3 already showed the cost of an inconsistent posting schedule on ONE channel; two channels doubles that risk. Worse, each new channel starts from zero subscribers with an algorithm that knows nothing about you — while your existing channel already has data and a returning audience.</p>
${slide('cr-23', 3, 'Một kênh hay tách hai kênh riêng?')}
<p>YouTube does not force that choice. The platform has several mechanisms that let ONE video serve multiple languages at once — translated subtitles, translated titles/descriptions, even a separate dubbed audio track. Lesson 23.3 builds out each mechanism in detail; for now, the point is: they all live inside ONE channel's Studio. None of them require a second channel.</p>

<div class="callout warn"><p><strong>When two channels genuinely make sense:</strong> the channel is already large, and the two audiences need meaningfully different style or posting rhythm (say, a Vietnamese lifestyle vlog channel and a separate English technical channel aimed at recruiters) — or a contract/brand deal forces a split. That is a decision for an ALREADY mature channel, not a starting point.</p></div>

<h3>Which content fits which language</h3>
${slide('cr-23', 4, 'Nội dung nào hợp tiếng nào')}
<p>Not every video deserves equal bilingual effort. The course's four main content types (Section 0.1) split naturally:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Deep programming lessons</span><span class="v">Code terminology (function, loop, API…) is already in English — make the Vietnamese version first for your core audience, add English subtitles once a video has proven its value.</span></div>
<div class="kv"><span class="k">Vietnamese life/study vlogs</span><span class="v">Local context, slang, campus stories are deeply Vietnamese — literal translation usually loses the flavor. Keep it Vietnamese; do not force an English version on every single video.</span></div>
<div class="kv"><span class="k">Short videos — one tip/idea</span><span class="v">Few words, a short script (Ch3.3 already budgeted ~150 words / 60 seconds) — the lowest-cost place to add English subtitles in the whole course, worth trying first.</span></div>
<div class="kv"><span class="k">Portfolio / international-recruiter videos</span><span class="v">Flip the priority: shoot English first, add Vietnamese subtitles after — matches the actual target audience, who reads English.</span></div>
</div>

<h3>Language is a recommendation signal, not a locked door</h3>
<p>TikTok's own official algorithm explainer page lists language as one of the factors personalizing the For You feed: <strong>"Device and account settings like your language preference, country setting, and device type"</strong> — grouped with device and country, and ranked below engagement signals such as watch time, completion, likes and follows. In other words: language helps the platform guess who is more likely to enjoy your video — it is not a hard wall keeping English speakers from ever seeing a well-subtitled Vietnamese video, or the reverse.</p>
<p>On Facebook, the audience section of Meta Business Suite shows which cities and countries your page followers are actually in — enough to tell whether you are genuinely reaching anyone outside Vietnam yet, before investing effort translating a large batch of videos.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — assuming English subtitles automatically "go international."</strong> Correct-language subtitles only remove the comprehension barrier — they do not create attention. A Vietnamese video with English subtitles still needs everything Chapters 1–2 already taught: a strong hook, good packaging, the right niche. Do not translate an entire back-catalog and wait; pick your 2–3 strongest videos to try first, exactly as Chapter 1 already suggested.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 23.2 tackles the hardest part of this strategy for a beginner: writing an English script you can actually say out loud when your vocabulary is still limited.</p>

<h3>🎬 Practice (15 minutes)</h3>
<div class="callout ok"><ol>
<li>List 3 of your recent videos (or 3 upcoming ideas) into one of the four boxes in the table above.</li>
<li>For the video that fits "both languages" best, write one sentence: should the English version be subtitles, or does it deserve a full dubbed audio track?</li>
<li>If you have an active Facebook page or channel, open its audience/analytics section and note: do you already have viewers outside Vietnam?</li>
</ol><p><strong>Done when:</strong> you have picked exactly one upcoming video for your first bilingual attempt, and can say why it fits — not just "to try it out."</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Localization</span><span class="v">Not just translating words — adjusting examples, tone, even thumbnails for the target culture/language.</span></div>
<div class="kv"><span class="k">Niche</span><span class="v">Your narrow content focus — covered in Ch1.3, and what actually defines "your international audience."</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>One channel, correctly language-tagged usually beats splitting into two for a beginner — YouTube already has mechanisms built for exactly this (Lesson 23.3).</li>
<li>The course's four content types split naturally: lessons and vlogs favor Vietnamese first; short videos are the cheapest to make bilingual; portfolio/recruiter videos favor English first.</li>
<li>Language is a recommendation signal, confirmed directly by TikTok — not a hard barrier, and not a magic trick that pulls in an international audience by itself.</li>
<li>Only split into two channels once a channel is already large and the reason is clear — never as a starting point.</li>
</ul>

<div class="link-card"><a href="https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you" target="_blank" rel="noopener">TikTok Newsroom — how the For You feed recommends videos (language & country as a signal)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 23 · Bài 23.1</span>
<h2>Một kênh hay hai kênh — và video nào nên nói tiếng gì?</h2>
<p class="lead">Chương 1 đã hẹn quay lại đây: khán giả Việt của bạn rất lớn còn khán giả tiếng Anh thì toàn cầu và cạnh tranh hơn. Câu hỏi thật không phải "chọn tiếng nào" — mà là dựng KÊNH thế nào để phục vụ cả hai mà không làm việc gấp đôi mỗi tuần.</p>

<h3>Vì sao không cần hai kênh để làm song ngữ</h3>
<p>Bản năng đầu tiên của nhiều người là mở một kênh tiếng Việt và một kênh tiếng Anh riêng — nghe có vẻ "chuyên nghiệp", tách bạch. Thực tế nó tốn gấp đôi công cho một video: gấp đôi số lần lên ý tưởng, gấp đôi lịch quay, gấp đôi buổi dựng, gấp đôi lần đăng. Chương 2.3 đã cho thấy cái giá của một lịch đăng thất thường trên MỘT kênh; hai kênh nhân đôi rủi ro đó. Tệ hơn, mỗi kênh mới khởi đầu từ 0 lượt đăng ký và một thuật toán chưa hề biết gì về bạn — trong khi kênh hiện tại của bạn đã có dữ liệu, đã có người xem quen.</p>
${slide('cr-23', 3, 'Một kênh hay tách hai kênh riêng?')}
<p>YouTube không bắt bạn phải chọn. Nền tảng có sẵn nhiều cơ chế để MỘT video phục vụ nhiều ngôn ngữ cùng lúc — phụ đề dịch, tiêu đề/mô tả dịch, thậm chí một track âm thanh lồng tiếng riêng. Bài 23.3 dựng chi tiết từng cơ chế; ở đây chỉ cần biết: chúng đều nằm trong Studio của MỘT kênh, không cơ chế nào đòi bạn phải có kênh thứ hai.</p>

<div class="callout warn"><p><strong>Khi nào hai kênh THẬT SỰ hợp lý:</strong> kênh đã đủ lớn, và hai khán giả cần phong cách/nhịp đăng khác hẳn nhau (ví dụ một kênh vlog đời sống tiếng Việt và một kênh chuyên sâu kỹ thuật tiếng Anh cho nhà tuyển dụng) — hoặc có hợp đồng/thương hiệu riêng buộc phải tách. Đó là quyết định của một kênh ĐÃ trưởng thành, không phải điểm xuất phát.</p></div>

<h3>Nội dung nào hợp tiếng nào</h3>
${slide('cr-23', 4, 'Nội dung nào hợp tiếng nào')}
<p>Không phải video nào cũng đáng công song ngữ như nhau. Bốn loại chính của khoá này (Mục 0.1) chia phần tự nhiên:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Bài giảng lập trình sâu</span><span class="v">Thuật ngữ code (function, loop, API…) vốn đã tiếng Anh — làm bản tiếng Việt trước cho khán giả gốc, thêm phụ đề Anh khi video đã chứng minh được giá trị.</span></div>
<div class="kv"><span class="k">Vlog đời sống, học tập ở VN</span><span class="v">Ngữ cảnh, tiếng lóng, chuyện trường lớp rất Việt Nam — dịch sát nghĩa thường mất chất. Giữ tiếng Việt, đừng ép mọi video phải có bản Anh.</span></div>
<div class="kv"><span class="k">Video ngắn — một mẹo/ý duy nhất</span><span class="v">Ít lời, kịch bản ngắn (Ch3.3 đã tính ~150 từ/60 giây) — chi phí thêm phụ đề Anh thấp nhất trong khoá, đáng thử đầu tiên.</span></div>
<div class="kv"><span class="k">Video hướng tới hồ sơ, nhà tuyển dụng quốc tế</span><span class="v">Ưu tiên NGƯỢC LẠI: quay tiếng Anh trước, phụ đề Việt sau — đúng khán giả mục tiêu đọc được tiếng Anh.</span></div>
</div>

<h3>Ngôn ngữ là một tín hiệu đề xuất, không phải một cánh cửa đóng kín</h3>
<p>Trang giải thích thuật toán chính thức của TikTok liệt kê ngôn ngữ là một trong các yếu tố cá nhân hoá nguồn cấp Dành cho bạn: <strong>"Device and account settings like your language preference, country setting, and device type"</strong> — cùng nhóm với thiết bị và quốc gia, xếp SAU các tín hiệu tương tác (thời gian xem, hoàn thành, thích, theo dõi). Nói cách khác: ngôn ngữ giúp nền tảng đoán ai NHIỀU KHẢ NĂNG thích video của bạn hơn — nó không phải một hàng rào chặn cứng khán giả tiếng Anh khỏi thấy video tiếng Việt phụ đề tốt, và ngược lại.</p>
<p>Trên Facebook, phần đối tượng của Meta Business Suite cho bạn xem người theo dõi trang đang ở những thành phố/quốc gia nào — đủ để biết bạn có đang thật sự chạm tới khán giả ngoài Việt Nam hay chưa, trước khi đầu tư công sức dịch nhiều video.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — tưởng thêm phụ đề tiếng Anh là tự động "ra quốc tế".</strong> Phụ đề đúng ngôn ngữ chỉ gỡ RÀO CẢN đọc hiểu — nó không tạo ra sự chú ý. Một video tiếng Việt phụ đề Anh vẫn cần đúng những thứ Chương 1–2 đã dạy: hook mạnh, đóng gói tốt, đúng ngách. Đừng dịch cả kênh rồi ngồi chờ; chọn 2-3 video mạnh nhất để thử trước (đúng như Chương 1 đã gợi ý).</p></div>

<p class="note-ct"><strong>Nối tiếp:</strong> Bài 23.2 bắt đầu phần khó nhất của chiến lược này với người mới: viết được một kịch bản tiếng Anh khi vốn từ còn hạn chế.</p>

<h3>🎬 Thực hành (15 phút)</h3>
<div class="callout ok"><ol>
<li>Liệt kê 3 video gần đây của bạn (hoặc 3 ý tưởng sắp quay) vào một trong bốn ô ở bảng trên.</li>
<li>Với video "hợp cả hai tiếng" nhất, viết một câu: bản Anh nên là phụ đề, hay nên có luôn track âm thanh lồng tiếng?</li>
<li>Nếu có trang Facebook/kênh đang hoạt động, mở phần đối tượng/thống kê và ghi lại: bạn có khán giả ở ngoài Việt Nam chưa?</li>
</ol><p><strong>Đạt khi:</strong> bạn chọn được đúng một video sắp tới để làm bản song ngữ đầu tiên, và nói được vì sao nó hợp — không phải vì "thử cho biết".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Localization (bản địa hoá)</span><span class="v">Không chỉ dịch chữ — chỉnh ví dụ, giọng điệu, thậm chí thumbnail cho hợp văn hoá/ngôn ngữ đích.</span></div>
<div class="kv"><span class="k">Niche (ngách)</span><span class="v">Chủ đề hẹp bạn tập trung — đã học Ch1.3, quyết định ai là "khán giả quốc tế" của riêng bạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một kênh, gắn ngôn ngữ đúng cách thường tốt hơn tách hai kênh cho người mới bắt đầu — YouTube có sẵn cơ chế cho việc này (Bài 23.3).</li>
<li>Bốn loại nội dung của khoá chia phe tự nhiên: bài giảng và vlog ưu tiên tiếng Việt trước; video ngắn dễ song ngữ nhất; video hồ sơ/tuyển dụng ưu tiên tiếng Anh trước.</li>
<li>Ngôn ngữ là một tín hiệu đề xuất (TikTok xác nhận trực tiếp) — không phải rào cản cứng, và cũng không phải phép màu tự kéo khán giả quốc tế.</li>
<li>Chỉ tách hai kênh khi kênh đã đủ lớn và có lý do rõ ràng, không phải điểm xuất phát.</li>
</ul>

<div class="link-card"><a href="https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you" target="_blank" rel="noopener">TikTok Newsroom — cách For You feed đề xuất video (ngôn ngữ & quốc gia là một tín hiệu)</a></div>
</div>
`,
    },

    /* ─────────────────── 23.2 Kịch bản tiếng Anh ─────────────────── */
    {
      title: '23.2 — Writing an English script before you are fluent|||23.2 — Viết kịch bản tiếng Anh trước khi giỏi',
      slug: 'cr-23-2-kich-ban-tieng-anh',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Viết kịch bản tiếng Anh khi vốn từ còn hạn chế: ý tiếng Việt trước, từ vựng B1, AI chỉnh giữ giọng mình, luyện phát âm bằng shadowing và YouGlish, và bảng hơn 30 thuật ngữ creator EN–VI.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 23 · Lesson 23.2</span>
<h2>You are not fluent in English yet. You can still write a script you can actually say.</h2>
<p class="lead">Do not wait to "get good at English" before you film — the realistic path runs the other way: write a simple script you can say fluently, and let your vocabulary grow one video at a time. This lesson gives you a 5-step process and a table of 30+ creator terms you will keep reusing.</p>

<h3>Write the idea in Vietnamese first — always</h3>
${slide('cr-23', 7, 'Viết kịch bản tiếng Anh khi chưa giỏi')}
<p>Do not try to think directly in English while your vocabulary is still thin — you will waste time and end up with a disjointed script. Write your main points in Vietnamese first (using the two-column frame and hook you already learned in Ch3.1/3.3), then translate sentence by sentence into English. Clear ideas first, wording second.</p>

<h3>Short sentences, B1 vocabulary, lean on the present simple</h3>
<p>B1 is the "threshold" level in the Common European Framework of Reference for Languages (CEFR, Council of Europe) — enough to understand the main points of familiar topics and write simple, connected text. That is exactly the level your script should target when you are starting out:</p>
<ul>
<li><strong>Short sentences, one idea per sentence.</strong> "This function returns null when the array is empty" beats a single sentence stitched from three clauses.</li>
<li><strong>Lean on the present simple.</strong> Explaining a concept, a how-to, a code review almost always works in this tense — avoid perfect continuous or subjunctive forms unless the story genuinely needs them.</li>
<li><strong>Active voice.</strong> "You call this method first" is easier to say than "This method is called first by you."</li>
<li><strong>Familiar words before fancy ones.</strong> "Fix" over "rectify"; "show" over "demonstrate" — viewers need to understand you, not hear you sound like a dictionary.</li>
</ul>

<h3>Use AI to polish, not to replace your voice</h3>
<p>The right way to use it: hand the AI your self-written English script, ask it to fix grammar/vocabulary mistakes, keep the same meaning and sentence length, and not swap simple words for harder ones. Read the result back — if a word shows up that you are not confident pronouncing or do not fully understand, swap it back for a word you already know. A script with a few small errors that you deliver naturally always beats a grammatically perfect one you read like a recital.</p>

<div class="callout warn"><p><strong>Self-check after the AI pass:</strong> read the whole thing aloud once before filming. Whichever word makes you stumble or re-read — that is the word to change, no matter how grammatically correct it is.</p></div>

<h3>Pronunciation practice: shadowing + YouGlish</h3>
${slide('cr-23', 8, 'Luyện phát âm: 2 công cụ + 1 thói quen')}
<p><strong>Shadowing</strong> means listening to a piece of English and repeating it back immediately, trying to match the intonation, stress, and rhythm — not repeating after the whole sentence has finished. The technique was originally developed to train interpreters to listen and speak at the same time; a 2025 systematic review synthesizing multiple studies confirms it improves pronunciation, intonation, and fluency — but it is not a good way to learn new vocabulary or grammar, only to practice producing sounds for words you already know the meaning of.</p>
<p><strong>YouGlish</strong> solves a different problem: you know what a word means but are not sure you are pronouncing it correctly. Type the word into youglish.com, pick an accent (US/UK/AUS…), and the tool finds hundreds of real YouTube clips of native speakers saying that exact word, cued to the right moment in the sentence — hearing the word in real context instead of a single, lifeless pronunciation file.</p>

<h3>Reading with a teleprompter — reusing a tool you already have</h3>
<p>Ch3.4 already set up a teleprompter using the iPad and the <strong>Teleprompter</strong> tab of <code>/creator</code>. For an English script, the principle is identical, with one addition: set the speed slower than what you are used to for Vietnamese — your brain is still translating/processing a language that is not yet automatic, and going fast will make you read like a recital instead of speaking.</p>
<div class="kv-grid">
<div class="kv"><span class="k">Space</span><span class="v">Start / pause scrolling</span></div>
<div class="kv"><span class="k">R</span><span class="v">Back to the start of the script</span></div>
<div class="kv"><span class="k">F</span><span class="v">Full screen</span></div>
<div class="kv"><span class="k">↑ / ↓</span><span class="v">Speed up/down by 0.25× each press (0.25×–4×)</span></div>
</div>

<h3>🗂 Creator vocabulary table, EN ↔ VI</h3>
<p>30+ terms you will run into throughout this course and in any English-language content-creation channel — learn this table now, and you will not have to look words up mid-shoot:</p>
<table>
<tr><th>Term EN</th><th>Short VI meaning</th></tr>
<tr><td>Hook</td><td>Mở đầu gây chú ý trong vài giây đầu (Ch3.1)</td></tr>
<tr><td>Retention</td><td>Tỷ lệ giữ chân người xem theo thời gian</td></tr>
<tr><td>Impression</td><td>Số lần thumbnail được hiển thị cho người xem</td></tr>
<tr><td>CTR (click-through rate)</td><td>Tỷ lệ bấm vào video trên số lần hiển thị</td></tr>
<tr><td>Watch time</td><td>Tổng thời gian xem tích luỹ</td></tr>
<tr><td>Thumbnail</td><td>Ảnh đại diện video</td></tr>
<tr><td>A-roll</td><td>Cảnh chính — người nói trực diện máy quay</td></tr>
<tr><td>B-roll</td><td>Cảnh phụ minh hoạ, chèn xen cảnh chính (Ch10.2)</td></tr>
<tr><td>Cutaway</td><td>Cảnh chêm để né lỗi hoặc đổi nhịp</td></tr>
<tr><td>Jump cut</td><td>Cắt nhảy — bỏ đoạn giữa cùng một cảnh (Ch14.2)</td></tr>
<tr><td>J-cut / L-cut</td><td>Âm thanh cảnh sau/trước chạy lấn qua cảnh kia (Ch14.2)</td></tr>
<tr><td>Talking head</td><td>Cảnh người nói trực diện máy quay</td></tr>
<tr><td>Take</td><td>Một lượt quay thử của cùng một cảnh</td></tr>
<tr><td>Framing</td><td>Cách đặt khung hình, bố cục (Ch7)</td></tr>
<tr><td>LUFS</td><td>Đơn vị đo độ lớn âm thanh cảm nhận (Ch16.1)</td></tr>
<tr><td>Voiceover</td><td>Giọng đọc chèn ngoài hình, không lộ mặt</td></tr>
<tr><td>Dub / Dubbing</td><td>Lồng tiếng — thay giọng gốc bằng ngôn ngữ khác</td></tr>
<tr><td>Caption</td><td>Phụ đề (thường gồm cả mô tả âm thanh không lời)</td></tr>
<tr><td>Subtitle</td><td>Phụ đề dịch lời thoại</td></tr>
<tr><td>Burn-in (hard subtitle)</td><td>Phụ đề cứng, in thẳng vào hình (Ch16.3)</td></tr>
<tr><td>Localization</td><td>Bản địa hoá — chỉnh nội dung hợp văn hoá/ngôn ngữ đích</td></tr>
<tr><td>Shadowing</td><td>Nghe rồi nói lại NGAY theo đúng ngữ điệu để luyện phát âm</td></tr>
<tr><td>Teleprompter</td><td>Máy nhắc lời, cuộn kịch bản gần ống kính (Ch3.4)</td></tr>
<tr><td>CTA (call to action)</td><td>Lời kêu gọi hành động ở cuối video</td></tr>
<tr><td>Niche</td><td>Ngách nội dung, chủ đề hẹp (Ch1.3)</td></tr>
<tr><td>Algorithm</td><td>Thuật toán đề xuất nội dung</td></tr>
<tr><td>Engagement</td><td>Mức tương tác (like, comment, share)</td></tr>
<tr><td>Analytics</td><td>Số liệu phân tích hiệu suất video</td></tr>
<tr><td>Monetization</td><td>Kiếm tiền từ nội dung</td></tr>
<tr><td>Repurposing</td><td>Tái sử dụng nội dung sang định dạng khác (Ch2.4)</td></tr>
<tr><td>Workflow</td><td>Quy trình làm việc</td></tr>
<tr><td>Vlog</td><td>Nhật ký video (Ch21)</td></tr>
<tr><td>Shorts</td><td>Video ngắn dọc dưới 1 phút — định dạng của YouTube</td></tr>
<tr><td>Evergreen content</td><td>Nội dung không lỗi thời theo thời gian</td></tr>
</table>

<div class="pitfall co-tieu-de"><p><strong>Trap — memorizing the whole table before filming anything.</strong> Do not cram the whole list up front. Look up each word right when you need it in a real script — you will retain it far better than learning it disconnected from context.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 23.3 uses this exact vocabulary table to explain YouTube's multi-language mechanisms — dub, subtitle, caption will no longer be unfamiliar words.</p>

<h3>🎬 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Write a 60-second Vietnamese script for a coding tip you know well.</li>
<li>Translate it yourself into English: short sentences, B1 vocabulary, present simple. Do not look up more than 5 words.</li>
<li>Give it to an AI to fix grammar, with an explicit instruction: keep the meaning, do not swap simple words for hard ones.</li>
<li>Read it aloud once, circle the words that make you stumble — look up their pronunciation on YouGlish, shadow each one 3 times.</li>
<li>Do a test take through the /creator teleprompter, at a speed slower than the Vietnamese pace you are used to.</li>
</ol><p><strong>Done when:</strong> you can read the whole 60-second script with no more than 2 stumbles, and can explain the meaning of at least 10 terms from the table above without looking back.</p></div>

<h3>📌 Summary</h3>
<ul>
<li>Write the idea in Vietnamese first, translate after — do not try to think directly in English while your vocabulary is still thin.</li>
<li>Target B1: short sentences, one idea each, lean on present simple, active voice, familiar words.</li>
<li>AI fixes grammar — it does not replace your voice; read it aloud yourself to catch hard-to-say words.</li>
<li>Shadowing trains intonation/rhythm; YouGlish checks correct pronunciation in real context — two different jobs.</li>
<li>The 30+ term table above is the base vocabulary you will keep reusing throughout the course.</li>
</ul>

<div class="link-card"><a href="https://youglish.com/" target="_blank" rel="noopener">YouGlish — hear real pronunciation in context, word by word or phrase by phrase</a></div>
<div class="link-card"><a href="https://www.tandfonline.com/doi/full/10.1080/29984475.2025.2546827" target="_blank" rel="noopener">Tandfonline (Taylor &amp; Francis) — 2025 systematic review on shadowing for second-language pronunciation</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 23 · Bài 23.2</span>
<h2>Bạn chưa giỏi tiếng Anh. Vẫn viết được một kịch bản nói được.</h2>
<p class="lead">Đừng chờ "giỏi tiếng Anh" rồi mới quay — con đường thực tế đi ngược lại: viết một kịch bản đơn giản mà bạn nói được trôi chảy, rồi vốn từ tăng dần qua từng video. Bài này cho bạn quy trình 5 bước và một bảng hơn 30 thuật ngữ creator bạn sẽ dùng lặp đi lặp lại.</p>

<h3>Viết ý bằng tiếng Việt trước — luôn luôn</h3>
${slide('cr-23', 7, 'Viết kịch bản tiếng Anh khi chưa giỏi')}
<p>Đừng cố nghĩ trực tiếp bằng tiếng Anh khi vốn từ còn mỏng — bạn sẽ vừa mất thời gian vừa ra một kịch bản rời rạc. Viết ý chính bằng tiếng Việt trước (đúng khung 2 cột và hook đã học ở Ch3.1/3.3), sau đó mới chuyển từng câu sang tiếng Anh. Ý rõ trước, câu chữ tính sau.</p>

<h3>Câu ngắn, từ vựng B1, ưu tiên thì hiện tại đơn</h3>
<p>B1 là mức "ngưỡng" trong khung tham chiếu ngôn ngữ chung châu Âu (CEFR, Council of Europe) — đủ để hiểu ý chính về chủ đề quen thuộc và viết được đoạn văn liên kết đơn giản. Đó chính xác là mức kịch bản của bạn nên nhắm tới lúc mới bắt đầu:</p>
<ul>
<li><strong>Câu ngắn, một ý mỗi câu.</strong> "This function returns null when the array is empty" tốt hơn một câu ghép ba mệnh đề.</li>
<li><strong>Ưu tiên thì hiện tại đơn.</strong> Giải thích khái niệm, hướng dẫn, review code hầu như luôn dùng được thì này — né các thì phức tạp (hoàn thành tiếp diễn, giả định) trừ khi câu chuyện thật sự cần.</li>
<li><strong>Câu chủ động.</strong> "You call this method first" dễ nói hơn "This method is called first by you".</li>
<li><strong>Từ quen trước, từ hoa mỹ sau.</strong> "Fix" tốt hơn "rectify"; "show" tốt hơn "demonstrate" — người xem cần hiểu, không cần bạn nghe như từ điển.</li>
</ul>

<h3>Dùng AI để chỉnh, không để thay giọng của bạn</h3>
<p>Cách dùng đúng: đưa AI đoạn kịch bản tiếng Anh tự viết, yêu cầu sửa lỗi ngữ pháp/từ vựng, giữ nguyên ý và độ dài câu, không thay từ đơn giản bằng từ khó hơn. Đọc lại kết quả — nếu có từ bạn không tự tin phát âm hoặc không hiểu nghĩa, đổi về từ bạn đã biết. Một kịch bản có vài lỗi nhỏ nhưng bạn nói tự nhiên luôn tốt hơn một kịch bản hoàn hảo ngữ pháp mà bạn đọc như trả bài.</p>

<div class="callout warn"><p><strong>Tự kiểm khi AI chỉnh xong:</strong> đọc to toàn bộ đoạn một lần trước khi quay. Từ nào khiến bạn khựng lại hoặc phải đọc lại — đó là từ cần đổi, bất kể nó "đúng ngữ pháp" tới đâu.</p></div>

<h3>Luyện phát âm: shadowing + YouGlish</h3>
${slide('cr-23', 8, 'Luyện phát âm: 2 công cụ + 1 thói quen')}
<p><strong>Shadowing</strong> là nghe một câu tiếng Anh rồi nói lại NGAY sau đó, cố bắt chước cả ngữ điệu, trọng âm và nhịp — không phải nhắc lại sau khi nghe xong cả câu. Kỹ thuật này ra đời để luyện phiên dịch viên nghe-nói cùng lúc; một tổng quan hệ thống 2025 tổng hợp nhiều nghiên cứu xác nhận nó cải thiện được phát âm, ngữ điệu và độ trôi chảy — nhưng KHÔNG phải cách tốt để học từ vựng hay ngữ pháp mới, chỉ luyện cách phát ra âm bạn đã biết nghĩa.</p>
<p><strong>YouGlish</strong> giải quyết một vấn đề khác: bạn biết nghĩa một từ nhưng không chắc đọc đúng chưa. Gõ từ đó vào youglish.com, chọn giọng (Mỹ/Anh/Úc…), công cụ tự tìm hàng trăm đoạn clip YouTube thật có người bản xứ nói đúng từ đó, phát đúng chỗ trong câu — nghe được từ trong ngữ cảnh thật thay vì một file phát âm đơn lẻ và vô hồn.</p>

<h3>Đọc bằng teleprompter — dùng lại công cụ đã có</h3>
<p>Ch3.4 đã dựng teleprompter bằng iPad và tab <strong>Nhắc lời</strong> của <code>/creator</code>. Với kịch bản tiếng Anh, nguyên tắc y hệt, chỉ thêm một điều: đặt tốc độ CHẬM hơn bản tiếng Việt bạn quen — não vẫn đang dịch/xử lý một ngôn ngữ chưa phản xạ tự nhiên, đi nhanh sẽ khiến bạn đọc như trả bài thay vì nói.</p>
<div class="kv-grid">
<div class="kv"><span class="k">Space</span><span class="v">Chạy / dừng cuộn chữ</span></div>
<div class="kv"><span class="k">R</span><span class="v">Về lại đầu kịch bản</span></div>
<div class="kv"><span class="k">F</span><span class="v">Toàn màn hình</span></div>
<div class="kv"><span class="k">↑ / ↓</span><span class="v">Tăng/giảm tốc độ 0,25× mỗi lần (0,25×–4×)</span></div>
</div>

<h3>🗂 Bảng thuật ngữ creator EN ↔ VI</h3>
<p>Hơn 30 từ bạn sẽ gặp lại xuyên suốt khoá này và trong mọi kênh nói tiếng Anh về làm nội dung — thuộc bảng này trước, đỡ phải tra lại giữa lúc quay:</p>
<table>
<tr><th>Thuật ngữ EN</th><th>Nghĩa tiếng Việt ngắn</th></tr>
<tr><td>Hook</td><td>Mở đầu gây chú ý trong vài giây đầu (Ch3.1)</td></tr>
<tr><td>Retention</td><td>Tỷ lệ giữ chân người xem theo thời gian</td></tr>
<tr><td>Impression</td><td>Số lần thumbnail được hiển thị cho người xem</td></tr>
<tr><td>CTR (click-through rate)</td><td>Tỷ lệ bấm vào video trên số lần hiển thị</td></tr>
<tr><td>Watch time</td><td>Tổng thời gian xem tích luỹ</td></tr>
<tr><td>Thumbnail</td><td>Ảnh đại diện video</td></tr>
<tr><td>A-roll</td><td>Cảnh chính — người nói trực diện máy quay</td></tr>
<tr><td>B-roll</td><td>Cảnh phụ minh hoạ, chèn xen cảnh chính (Ch10.2)</td></tr>
<tr><td>Cutaway</td><td>Cảnh chêm để né lỗi hoặc đổi nhịp</td></tr>
<tr><td>Jump cut</td><td>Cắt nhảy — bỏ đoạn giữa cùng một cảnh (Ch14.2)</td></tr>
<tr><td>J-cut / L-cut</td><td>Âm thanh cảnh sau/trước chạy lấn qua cảnh kia (Ch14.2)</td></tr>
<tr><td>Talking head</td><td>Cảnh người nói trực diện máy quay</td></tr>
<tr><td>Take</td><td>Một lượt quay thử của cùng một cảnh</td></tr>
<tr><td>Framing</td><td>Cách đặt khung hình, bố cục (Ch7)</td></tr>
<tr><td>LUFS</td><td>Đơn vị đo độ lớn âm thanh cảm nhận (Ch16.1)</td></tr>
<tr><td>Voiceover</td><td>Giọng đọc chèn ngoài hình, không lộ mặt</td></tr>
<tr><td>Dub / Dubbing</td><td>Lồng tiếng — thay giọng gốc bằng ngôn ngữ khác</td></tr>
<tr><td>Caption</td><td>Phụ đề (thường gồm cả mô tả âm thanh không lời)</td></tr>
<tr><td>Subtitle</td><td>Phụ đề dịch lời thoại</td></tr>
<tr><td>Burn-in (hard subtitle)</td><td>Phụ đề cứng, in thẳng vào hình (Ch16.3)</td></tr>
<tr><td>Localization</td><td>Bản địa hoá — chỉnh nội dung hợp văn hoá/ngôn ngữ đích</td></tr>
<tr><td>Shadowing</td><td>Nghe rồi nói lại NGAY theo đúng ngữ điệu để luyện phát âm</td></tr>
<tr><td>Teleprompter</td><td>Máy nhắc lời, cuộn kịch bản gần ống kính (Ch3.4)</td></tr>
<tr><td>CTA (call to action)</td><td>Lời kêu gọi hành động ở cuối video</td></tr>
<tr><td>Niche</td><td>Ngách nội dung, chủ đề hẹp (Ch1.3)</td></tr>
<tr><td>Algorithm</td><td>Thuật toán đề xuất nội dung</td></tr>
<tr><td>Engagement</td><td>Mức tương tác (like, comment, share)</td></tr>
<tr><td>Analytics</td><td>Số liệu phân tích hiệu suất video</td></tr>
<tr><td>Monetization</td><td>Kiếm tiền từ nội dung</td></tr>
<tr><td>Repurposing</td><td>Tái sử dụng nội dung sang định dạng khác (Ch2.4)</td></tr>
<tr><td>Workflow</td><td>Quy trình làm việc</td></tr>
<tr><td>Vlog</td><td>Nhật ký video (Ch21)</td></tr>
<tr><td>Shorts</td><td>Video ngắn dọc dưới 1 phút — định dạng của YouTube</td></tr>
<tr><td>Evergreen content</td><td>Nội dung không lỗi thời theo thời gian</td></tr>
</table>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — học thuộc bảng rồi mới quay.</strong> Đừng học vẹt cả bảng trước. Tra từng từ ĐÚNG LÚC bạn cần dùng nó trong một kịch bản thật — bạn sẽ nhớ lâu hơn nhiều so với việc học tách rời khỏi ngữ cảnh.</p></div>

<p class="note-ct"><strong>Nối tiếp:</strong> Bài 23.3 dùng đúng bảng thuật ngữ này để giải thích các cơ chế đa ngôn ngữ của YouTube — dub, subtitle, caption sẽ không còn là từ lạ.</p>

<h3>🎬 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Viết một kịch bản 60 giây bằng tiếng Việt cho một mẹo lập trình bạn biết rõ.</li>
<li>Tự dịch sang tiếng Anh: câu ngắn, từ B1, thì hiện tại đơn. Không tra từ điển quá 5 lần.</li>
<li>Đưa AI chỉnh ngữ pháp với yêu cầu rõ: giữ nguyên ý, không đổi từ đơn giản thành từ khó.</li>
<li>Đọc to một lần, khoanh những từ khiến bạn khựng — tra phát âm trên YouGlish, luyện shadowing 3 lần mỗi từ.</li>
<li>Quay thử qua teleprompter /creator, tốc độ chậm hơn bản tiếng Việt bạn quen.</li>
</ol><p><strong>Đạt khi:</strong> bạn đọc hết đoạn 60 giây không vấp quá 2 lần, và có thể giải thích nghĩa của ít nhất 10 từ trong bảng thuật ngữ mà không xem lại.</p></div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Viết ý bằng tiếng Việt trước, dịch sau — đừng cố nghĩ trực tiếp bằng tiếng Anh khi vốn từ còn mỏng.</li>
<li>Nhắm mức B1: câu ngắn, một ý mỗi câu, ưu tiên hiện tại đơn, câu chủ động, từ quen thuộc.</li>
<li>AI chỉnh ngữ pháp — không thay giọng của bạn; đọc to lại để tự bắt từ khó phát âm.</li>
<li>Shadowing luyện ngữ điệu/nhịp; YouGlish tra phát âm đúng trong ngữ cảnh thật — hai việc khác nhau.</li>
<li>Bảng hơn 30 thuật ngữ ở trên là từ vựng nền bạn dùng lại xuyên suốt khoá.</li>
</ul>

<div class="link-card"><a href="https://youglish.com/" target="_blank" rel="noopener">YouGlish — nghe phát âm thật trong ngữ cảnh, theo từng từ/cụm</a></div>
<div class="link-card"><a href="https://www.tandfonline.com/doi/full/10.1080/29984475.2025.2546827" target="_blank" rel="noopener">Tandfonline (Taylor &amp; Francis) — tổng quan hệ thống 2025 về shadowing cho phát âm ngôn ngữ thứ hai</a></div>
</div>
`,
    },

    /* ─────────────────── 23.3 Phụ đề, lồng tiếng & bản địa hoá ─────────────────── */
    {
      title: '23.3 — Subtitles, multi-language audio & dubbing|||23.3 — Phụ đề, âm thanh đa ngôn ngữ & lồng tiếng',
      slug: 'cr-23-3-phu-de-long-tieng',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Bốn cơ chế đa ngôn ngữ của YouTube — dịch tiêu đề/mô tả, phụ đề dịch, âm thanh đa ngôn ngữ, lồng tiếng tự động — cơ chế nào miễn phí, cơ chế nào cần điều kiện, và khi nào cần công khai lồng tiếng AI.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 23 · Lesson 23.3</span>
<h2>Subtitles, multi-language audio, dubbing — three mechanisms, three different jobs</h2>
<p class="lead">Lesson 16.3 promised to come back to this: the exact ADD LANGUAGE mechanism in YouTube Studio backs both translated titles/descriptions and translated subtitles. This lesson builds out all four of YouTube's multi-language mechanisms — which ones are free and usable right now, which need eligibility, and when AI dubbing needs disclosure under the policy you already learned in Ch18.4.</p>

<h3>Mechanisms 1 & 2: translated titles/descriptions and subtitles — same screen, every channel can use them</h3>
${slide('cr-23', 5, '4 cơ chế đa ngôn ngữ của YouTube')}
<p>Checked directly against YouTube's own help documentation (support.google.com/youtube/answer/6289575): go to <strong>YouTube Studio → Subtitles</strong>, select a video, click <strong>ADD LANGUAGE</strong> and choose the target language. The same screen handles two jobs:</p>
<ul>
<li><strong>Title & description:</strong> under "Title and description," click <strong>Add</strong>, type the translation, click <strong>PUBLISH</strong>. YouTube states the benefit directly: the video becomes easier to find when viewers search using the translated title/description, outside your home region.</li>
<li><strong>Subtitles:</strong> under "Subtitles," click <strong>ADD → Upload file</strong>, choose <strong>With timing</strong> for an .srt that already has timestamps (exactly the file type Whisper from Ch16.4 produces) or <strong>Without timing</strong> for a plain transcript, then <strong>Save</strong>.</li>
</ul>
<p>This is exactly the mechanism Lesson 16.3 pointed forward to: one trip into Studio, repeating ADD LANGUAGE per language, carries both a Vietnamese and an English subtitle track on the same video — no second channel, no second video needed.</p>

<h3>Mechanism 3: Multi-language audio — gated by eligibility</h3>
<p>Unlike subtitles, this mechanism replaces the actual voice a viewer hears, not just the text they read. Checked directly on support.google.com/youtube/answer/13338784: you record (or outsource) a dubbed audio file yourself, and upload it via <strong>Studio → Languages → Add Language → the Dub section</strong>. The file must be in a supported audio-only format and roughly the same length as the original video. Viewers hear whichever track matches their preferred language (inferred from watch history, changeable in player/account settings) — the on-screen lips still follow the original footage, since this is only a replacement audio track, not a re-shot video.</p>
<div class="callout warn"><p><strong>Eligibility — the help page states it plainly:</strong> "Multi-language audio is currently available to creators with access to Advanced features." This is not something every channel has yet; a new, small channel may not see this button in Studio at all. Do not plan around it until you have confirmed it actually appears in your own channel.</p></div>

<h3>Mechanism 4: Automatic dubbing — free, but not directly editable</h3>
<p>Checked directly on support.google.com/youtube/answer/15569972: this is a free feature, <strong>enabled by default for eligible creators</strong> — YouTube translates and generates the voice itself, with nothing for you to record. Some videos are not eligible: longer than 120 minutes, minimal speech, an unsupported language, an undetectable source language, excessively fast speech, or a video already carrying a copyright claim. Toggle it in the YouTube Studio app → <strong>Settings → Content → Automatic dubbing</strong>.</p>
<p>The most important limitation: <strong>you cannot directly edit an automatic dub.</strong> If a line is mistranslated or a proper name is mispronounced, your only options are unpublishing that dub, or replacing it with your own recorded track (Mechanism 3). Per blog.youtube (published 02/2026, data from 12/2025): more than 6 million people per day watched at least 10 minutes of auto-dubbed YouTube content — real, meaningful adoption scale, even though translation quality can still slip on proper names and programming-specific terms.</p>

<div class="callout danger"><p><strong>The number of supported languages keeps changing</strong> — YouTube's help page and its blog give two different figures at different points in time (as of 09/2026). Do not lock a plan to one specific number — open the actual Settings → Content → Automatic dubbing screen in your own Studio to see the current language list.</p></div>
${slide('cr-23', 11, 'Công cụ & nối chương')}
<p>All four mechanisms above are tools you already have access to — alongside Whisper from Ch16.4 for translating your own subtitles, and CapCut/Resolve from Ch11–14 for building the files before upload. The last card is exactly the boundary the next section covers.</p>

<h3>When AI dubbing needs disclosure</h3>
<p>Ch18.4 already built out YouTube's altered-or-synthetic-content disclosure policy: it is only required when content uses AI to alter or generate something realistic enough to deceive viewers about something real — YouTube's own official example of something that does NOT need disclosure is "green screen used to depict someone floating in space." An AI dub reading your own script correctly, in a different language, is clearly still you saying exactly what you actually said — that is localization, not faking a real event. The line sits on whether the content could make a viewer believe something happened that did not happen. If you are not sure which side a specific video falls on, check support.google.com directly before publishing, exactly as Ch18.4 already advised, rather than guessing.</p>
<p>A separate, more ethical-than-platform-policy point: if you hire someone else to dub your video, have a clear agreement about using their voice. If you use an AI voice-cloning tool (including cloning your own voice), always check that tool's terms and the platform's policy before publishing — the specific rules here are still moving fast, and this course does not have enough grounding to state a fixed rule.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — treating automatic dubbing as a free complete solution.</strong> It is free, but you cannot fix errors directly, and proper names/programming terms are exactly where it is most likely to slip. Always listen back to an automatic dub before considering a video "done" — do not just turn it on and forget it.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 23.4 folds all four mechanisms into one real production workflow — how to shoot, how to edit, so you are not starting over from scratch for every language.</p>

<h3>🎬 Practice (20 minutes)</h3>
<div class="callout ok"><ol>
<li>Open YouTube Studio for a video (even an unlisted one), go to Subtitles, try clicking ADD LANGUAGE — just to see the real screen, no need to Publish.</li>
<li>Check whether your channel already shows a Languages/Dub section in Studio — that is your signal for Advanced features access.</li>
<li>Go to Settings → Content, note whether Automatic dubbing is on or off, and its current language list.</li>
</ol><p><strong>Done when:</strong> you can clearly distinguish all four mechanisms — which one changes text, which one changes voice, which ones every channel already has, and which ones need eligibility.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Watch-history language</span><span class="v">The preferred language YouTube infers from watch history — decides the default audio track a viewer hears.</span></div>
<div class="kv"><span class="k">Advanced features</span><span class="v">YouTube Studio's advanced permission tier — Multi-language audio currently sits behind it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Translated titles/descriptions and subtitles share one screen (Studio → Subtitles → ADD LANGUAGE) — every channel can use it right now.</li>
<li>Multi-language audio (self-recorded, uploaded) replaces the actual voice a viewer hears — but currently requires Advanced features access.</li>
<li>Automatic dubbing is free and on by default for eligible channels — but is not directly editable, only removable or replaceable.</li>
<li>Disclosure is only required when content could deceive viewers about something real — dubbing your own real script usually is not that, but check when unsure.</li>
</ul>

<div class="link-card"><a href="https://support.google.com/youtube/answer/13338784" target="_blank" rel="noopener">YouTube Help — Add Multi-language audio tracks</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/15569972" target="_blank" rel="noopener">YouTube Help — Use automatic dubbing</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/6289575" target="_blank" rel="noopener">YouTube Help — Translate your own video titles &amp; descriptions</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/14328491" target="_blank" rel="noopener">YouTube Help — Disclosing use of altered or synthetic content</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 23 · Bài 23.3</span>
<h2>Phụ đề, âm thanh đa ngôn ngữ, lồng tiếng — ba cơ chế, ba việc khác nhau</h2>
<p class="lead">Bài 16.3 đã hẹn quay lại đây: đúng cơ chế ADD LANGUAGE trong YouTube Studio đứng sau cả dịch tiêu đề/mô tả lẫn phụ đề dịch. Bài này dựng trọn bốn cơ chế đa ngôn ngữ của YouTube — cái nào miễn phí và dùng được ngay, cái nào cần điều kiện, và khi nào lồng tiếng AI cần công khai theo chính sách đã học ở Ch18.4.</p>

<h3>Cơ chế 1 & 2: dịch tiêu đề/mô tả và phụ đề — cùng một màn hình, mọi kênh dùng được</h3>
${slide('cr-23', 5, '4 cơ chế đa ngôn ngữ của YouTube')}
<p>Đã kiểm trực tiếp theo hướng dẫn chính thức của YouTube (support.google.com/youtube/answer/6289575): vào <strong>YouTube Studio → Subtitles</strong>, chọn video, bấm <strong>ADD LANGUAGE</strong> và chọn ngôn ngữ đích. Cùng một màn hình đó cho hai việc:</p>
<ul>
<li><strong>Tiêu đề & mô tả:</strong> dưới mục "Title and description", bấm <strong>Add</strong>, gõ bản dịch, bấm <strong>PUBLISH</strong>. YouTube nói rõ lợi ích: video dễ được tìm thấy hơn khi người xem tìm bằng tiêu đề/mô tả đã dịch, ở ngoài khu vực gốc của bạn.</li>
<li><strong>Phụ đề:</strong> dưới mục "Subtitles", bấm <strong>ADD → Upload file</strong>, chọn <strong>With timing</strong> cho file .srt đã có mốc thời gian (đúng loại file Whisper của Ch16.4 sinh ra) hoặc <strong>Without timing</strong> cho bản chép lời thuần, rồi <strong>Save</strong>.</li>
</ul>
<p>Đây chính là cơ chế mà Bài 16.3 đã nhắc: một lượt vào Studio, lặp lại ADD LANGUAGE cho từng ngôn ngữ, mang được cả track phụ đề Việt lẫn Anh trên cùng một video — không cần kênh thứ hai, không cần video thứ hai.</p>

<h3>Cơ chế 3: Âm thanh đa ngôn ngữ (Multi-language audio) — cần điều kiện</h3>
<p>Khác hẳn phụ đề, cơ chế này thay hẳn GIỌNG người xem nghe được, không chỉ chữ họ đọc. Đã kiểm trực tiếp trên support.google.com/youtube/answer/13338784: bạn tự thu (hoặc thuê ngoài) một file âm thanh lồng tiếng, tải lên qua <strong>Studio → Languages → Add Language → mục Dub</strong>. File phải cùng định dạng audio-only được hỗ trợ và dài xấp xỉ bằng video gốc. Người xem nghe đúng track khớp ngôn ngữ ưu tiên của họ (tính theo lịch sử xem, đổi được trong cài đặt/trình phát) — hình miệng vẫn theo bản gốc, vì đây chỉ là một track âm thanh thay thế, không phải video quay lại.</p>
<div class="callout warn"><p><strong>Điều kiện — trang trợ giúp nói rõ:</strong> "Multi-language audio is currently available to creators with access to Advanced features." Đây không phải tính năng mọi kênh có ngay — kênh mới, nhỏ có thể chưa thấy nút này trong Studio. Đừng lên kế hoạch dựa trên nó cho tới khi bạn tự kiểm thấy nó xuất hiện trong kênh của mình.</p></div>

<h3>Cơ chế 4: Lồng tiếng tự động (Automatic dubbing) — miễn phí, nhưng không sửa được</h3>
<p>Đã kiểm trực tiếp trên support.google.com/youtube/answer/15569972: đây là tính năng miễn phí, <strong>bật sẵn mặc định cho kênh đủ điều kiện</strong> — YouTube tự dịch và tự tạo giọng đọc, bạn không cần tự thu gì. Một số video KHÔNG đủ điều kiện: dài hơn 120 phút, lời nói quá ít, ngôn ngữ không được hỗ trợ, không nhận diện được ngôn ngữ gốc, nói quá nhanh, hoặc video đang dính khiếu nại bản quyền. Bật/tắt tính năng ở app YouTube Studio → <strong>Settings → Content → Automatic dubbing</strong>.</p>
<p>Giới hạn quan trọng nhất: <strong>bạn KHÔNG sửa trực tiếp được một bản lồng tự động.</strong> Nếu một câu bị dịch sai hoặc một tên riêng bị đọc sai, lựa chọn của bạn chỉ có gỡ bản lồng đó, hoặc thay nó bằng track bạn tự thu (Cơ chế 3). Theo blog.youtube (công bố 02/2026, số liệu 12/2025): hơn 6 triệu người mỗi ngày đã xem ít nhất 10 phút nội dung lồng tiếng tự động trên YouTube — quy mô sử dụng thật, dù chất lượng dịch vẫn có thể sai với tên riêng, thuật ngữ chuyên ngành lập trình.</p>

<div class="callout danger"><p><strong>Số ngôn ngữ hỗ trợ đang thay đổi liên tục</strong> — trang trợ giúp và trang blog của YouTube đưa ra hai con số khác nhau tại các thời điểm khác nhau (tính đến 09/2026). Đừng chốt kế hoạch dựa vào một con số cụ thể — mở đúng màn hình Settings → Content → Automatic dubbing trong Studio của bạn để xem danh sách ngôn ngữ hiện hành.</p></div>
${slide('cr-23', 11, 'Công cụ & nối chương')}
<p>Cả bốn cơ chế trên đều là công cụ bạn đã có trong tay — cùng với Whisper của Ch16.4 để tự dịch phụ đề, và CapCut/Resolve của Ch11–14 để dựng ra file trước khi tải lên. Card cuối chính là ranh giới mà phần sau nói tới.</p>

<h3>Khi nào lồng tiếng AI cần công khai (disclosure)</h3>
<p>Ch18.4 đã dựng chính sách công khai nội dung bị thay đổi/tổng hợp của YouTube: chỉ bắt buộc khi nội dung dùng AI để làm thay đổi/tạo ra thứ đủ chân thực để đánh lừa người xem về một điều có thật — ví dụ chính thức KHÔNG cần công khai của YouTube là "phông xanh cho ai đó lơ lửng ngoài vũ trụ". Một track lồng tiếng AI đọc ĐÚNG kịch bản của chính bạn, bằng ngôn ngữ khác, rõ ràng vẫn là bạn nói về đúng những gì bạn thật sự nói — đó là bản địa hoá, không phải giả mạo một sự kiện có thật. Ranh giới nằm ở việc: nội dung có khiến người xem tin một điều không có thật đã xảy ra hay không. Không chắc video của bạn rơi vào phe nào — kiểm trực tiếp support.google.com trước khi đăng, đúng như Ch18.4 đã khuyên, thay vì đoán.</p>
<p>Một điều tách biệt, mang tính đạo đức hơn là chính sách nền tảng: nếu bạn thuê người khác lồng tiếng, hãy có thoả thuận rõ ràng về việc dùng giọng của họ. Nếu bạn dùng công cụ nhân bản giọng AI (kể cả nhân bản giọng của chính bạn), luôn kiểm điều khoản của công cụ đó và chính sách nền tảng trước khi đăng — quy tắc cụ thể còn đang thay đổi nhanh, khoá này không có đủ căn cứ để khẳng định một quy tắc cố định.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — coi lồng tiếng tự động là giải pháp trọn gói miễn phí.</strong> Nó miễn phí, nhưng bạn không sửa được lỗi trực tiếp, và tên riêng/thuật ngữ lập trình là chỗ dễ sai nhất. Luôn xem lại (nghe thử) bản lồng tự động trước khi coi video đã "xong" — đừng chỉ bật lên rồi quên.</p></div>

<p class="note-ct"><strong>Nối tiếp:</strong> Bài 23.4 gộp cả bốn cơ chế này vào một quy trình dựng thực tế — quay thế nào, dựng ra sao, để không phải làm lại từ đầu cho mỗi ngôn ngữ.</p>

<h3>🎬 Thực hành (20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở YouTube Studio của một video (kể cả chưa công khai), vào Subtitles, thử bấm ADD LANGUAGE — chỉ để thấy đúng màn hình thật, không cần Publish.</li>
<li>Kiểm xem kênh của bạn đã thấy mục Languages/Dub trong Studio chưa — đó là dấu hiệu bạn có quyền Advanced features.</li>
<li>Vào Settings → Content, xem Automatic dubbing đang bật hay tắt, và danh sách ngôn ngữ hiện hành.</li>
</ol><p><strong>Đạt khi:</strong> bạn phân biệt được rành mạch bốn cơ chế — cơ chế nào đổi CHỮ, cơ chế nào đổi GIỌNG, cơ chế nào mọi kênh có sẵn, cơ chế nào cần điều kiện.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Watch-history language</span><span class="v">Ngôn ngữ ưu tiên YouTube suy ra từ lịch sử xem — quyết định track âm thanh mặc định người xem nghe.</span></div>
<div class="kv"><span class="k">Advanced features</span><span class="v">Nhóm quyền nâng cao của YouTube Studio — Âm thanh đa ngôn ngữ hiện nằm trong nhóm này.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dịch tiêu đề/mô tả và phụ đề dùng chung một màn hình (Studio → Subtitles → ADD LANGUAGE) — mọi kênh dùng được ngay.</li>
<li>Âm thanh đa ngôn ngữ (tự thu, tải lên) đổi hẳn giọng người xem nghe — nhưng hiện cần quyền Advanced features.</li>
<li>Lồng tiếng tự động miễn phí, bật sẵn cho kênh đủ điều kiện — nhưng không sửa trực tiếp được, chỉ gỡ hoặc thay.</li>
<li>Disclosure chỉ bắt buộc khi nội dung có thể đánh lừa về một điều có thật — lồng tiếng đúng kịch bản của chính bạn thường không thuộc diện đó, nhưng kiểm khi không chắc.</li>
</ul>

<div class="link-card"><a href="https://support.google.com/youtube/answer/13338784" target="_blank" rel="noopener">YouTube Help — Add Multi-language audio tracks</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/15569972" target="_blank" rel="noopener">YouTube Help — Use automatic dubbing</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/6289575" target="_blank" rel="noopener">YouTube Help — Translate your own video titles &amp; descriptions</a></div>
<div class="link-card"><a href="https://support.google.com/youtube/answer/14328491" target="_blank" rel="noopener">YouTube Help — Công bố việc sử dụng nội dung bị thay đổi hoặc tổng hợp</a></div>
</div>
`,
    },

    /* ─────────────────── 23.4 Quy trình hai phiên bản ─────────────────── */
    {
      title: '23.4 — A two-version production workflow|||23.4 — Quy trình sản xuất hai phiên bản',
      slug: 'cr-23-4-quy-trinh-hai-phien-ban',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Quy trình quay-dựng một dự án ra hai phiên bản VI/EN: quay 2 lần hay lồng tiếng, track riêng theo ngôn ngữ trong cùng project, và đặt tên file rõ ràng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 23 · Lesson 23.4</span>
<h2>One project, two versions: a workflow that does not double your work</h2>
<p class="lead">The previous three lessons gave you strategy, script, and YouTube's mechanisms. This lesson assembles all of it into one real shoot-and-edit workflow, reusing what you already have in Resolve/CapCut and /creator — not building a new process from scratch.</p>

<h3>Shoot twice, or shoot once and dub afterward?</h3>
<p>This is the first decision, and there is no single right answer for every case:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Shoot twice (one pass per language)</span><span class="v">Natural eye contact, expression, and speaking rhythm in both versions — no lip mismatch. Trade-off: doubles shoot time, and you must recall the same content accurately on the second pass.</span></div>
<div class="kv"><span class="k">Shoot once, dub afterward</span><span class="v">Much faster — a single shoot. Trade-off: for close-up shots, lips will not match the dubbed audio; the dub voice needs to be different/clear enough not to feel jarring.</span></div>
</div>
<p>A practical rule: for <strong>close talking-head shots (MCU/CU)</strong> — prefer shooting twice if you have time, because lip mismatch is very noticeable at this shot size (Ch7.2 already taught shot sizes). For shots with heavy <strong>B-roll covering your face</strong> (screen-recorded lessons, tutorials) — shoot once and dub is almost always fine, since viewers rarely see your mouth talking.</p>

<h3>The six-step process</h3>
${slide('cr-23', 10, 'Quy trình hai phiên bản')}
<p>For a video already chosen per Lesson 23.1, this process repeats cleanly:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Shared script, translated before shooting</span><span class="lz-d">The two-column script from Ch3.3, written in Vietnamese first, translated to English following Lesson 23.2's exact process — never translate on the spot while filming.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Shoot — per the decision above</span><span class="lz-d">Mark clearly in your shot list (Ch4.3) whether a shot is filmed twice or once, so you do not forget the English pass mid-shoot.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Shared B-roll & graphics</span><span class="lz-d">Do not re-shoot illustrative footage, do not rebuild the lower third/callouts per version — one set of assets, two spoken tracks.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Edit: separate tracks per language, in the same project</span><span class="lz-d">Not two separate projects — one project, different audio track + subtitle track.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Export with clear filenames</span><span class="lz-d">Extend the naming convention from Ch11.1: add a <code>_VI</code> / <code>_EN</code> suffix right at export time, do not wait until upload to rename.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Publish through the right mechanism, on schedule</span><span class="lz-d">Two separate video uploads, or one video plus a translated track (Lesson 23.3) — choose based on the content type split from Lesson 23.1, and log it in /creator/calendar (Ch2.3).</span></div>
</div>

<h3>Project structure: language tracks in Resolve/CapCut</h3>
${slide('cr-23', 9, 'Track VI/EN trong một dự án')}
<p>Nothing new compared to what Ch11–14 already taught — just one added naming convention: one video track (shared B-roll), one audio track per language (<code>A-VI</code>, <code>A-EN</code>), and one subtitle track per language if you burn subtitles in per version (<code>CC-VI</code>, <code>CC-EN</code>). When you need the Vietnamese version, hide the <code>A-EN</code>/<code>CC-EN</code> tracks and export; flip it for the English version. Graphics, background music, and the B-roll video track stay unchanged between both exports.</p>
<p>If you use soft subtitles instead (recommended back in Ch16.3) rather than burn-in, you do not even need two separate subtitle tracks inside the edit project — just two exported .srt files, uploaded through the ADD LANGUAGE mechanism from Lesson 23.3. Less editing work, less risk of mixing up tracks.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — forgetting to switch tracks before exporting the second version.</strong> You export the _VI version, switch tracks for _EN, hit export — but forget to hide the old A-VI track, and end up with a file where both voices overlap. Always listen to the first 5 seconds of a just-exported file before uploading — do not trust a timeline that merely looks correct.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Chapter 24 teaches proper export settings and uploading — applied directly to the two _VI/_EN files you just built here.</p>

<h3>🎬 Practice (30–45 minutes)</h3>
<div class="callout ok"><ol>
<li>For the 60-second script written in Lesson 23.2, decide: shoot twice, or shoot once and dub. Write the reason in one sentence.</li>
<li>Build a new project (CapCut or Resolve) with tracks named per the convention: V1, A-VI, A-EN.</li>
<li>Export two test files, <code>video-name_VI.mp4</code> and <code>video-name_EN.mp4</code> — listen to the first 5 seconds of each before considering it done.</li>
</ol><p><strong>Done when:</strong> both exported files play the correct voice for their version, with no overlap, and filenames follow the _VI/_EN convention.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Track</span><span class="v">A separate video or audio layer in the edit timeline — toggled on/off independently of other tracks.</span></div>
<div class="kv"><span class="k">Shot list</span><span class="v">The list of shots to film, taught in Ch4.3 — where you mark which shots need one or two language passes.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Shoot twice for close talking-head shots; shoot once and dub is fine for shots with heavy face-covering B-roll.</li>
<li>The six-step process: shared script → shoot → shared B-roll → edit with separate tracks in the same project → export as _VI/_EN → publish on schedule.</li>
<li>One project, different tracks per language — not two separate projects.</li>
<li>Soft subtitles cut editing work compared with burn-in — just two .srt files, no separate subtitle tracks needed in the timeline.</li>
<li>Always listen to the first few seconds of a freshly exported file — never trust a timeline that merely looks right.</li>
</ul>

<div class="link-card"><a href="https://support.google.com/youtube/answer/13338784" target="_blank" rel="noopener">YouTube Help — Add Multi-language audio tracks (where the two _VI/_EN files you just built get uploaded)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 23 · Bài 23.4</span>
<h2>Một dự án, hai phiên bản: quy trình không làm việc gấp đôi</h2>
<p class="lead">Ba bài trước cho bạn chiến lược, kịch bản, và các cơ chế của YouTube. Bài này ráp mọi thứ lại thành một quy trình quay-dựng thật, dùng đúng những gì bạn đã có trong Resolve/CapCut và /creator — không phải xây quy trình mới từ đầu.</p>

<h3>Quay hai lần, hay quay một lần rồi lồng tiếng?</h3>
<p>Đây là quyết định đầu tiên, và không có câu trả lời đúng cho mọi trường hợp:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Quay 2 lần (mỗi ngôn ngữ một lượt)</span><span class="v">Mắt nhìn, biểu cảm, nhịp nói tự nhiên ở cả hai bản — không lệch môi. Đổi lại: gấp đôi thời gian quay, phải nhớ lại đúng nội dung ở lượt hai.</span></div>
<div class="kv"><span class="k">Quay 1 lần + lồng tiếng sau</span><span class="v">Nhanh hơn nhiều — chỉ một buổi quay. Đổi lại: nếu cảnh quay cận mặt, môi không khớp lời lồng; cần giọng lồng đủ khác biệt/rõ ràng để không gây khó chịu.</span></div>
</div>
<p>Quy tắc thực dụng: cảnh <strong>talking head cận (MCU/CU)</strong> — ưu tiên quay 2 lần nếu có thời gian, vì lệch môi rất dễ nhận ra ở cỡ cảnh này (Ch7.2 đã dạy cỡ cảnh). Cảnh có nhiều <strong>B-roll che mặt</strong> (bài giảng quay màn hình, video hướng dẫn) — quay 1 lần + lồng tiếng gần như luôn ổn, vì người xem hiếm khi thấy mặt bạn nói.</p>

<h3>Quy trình sáu bước</h3>
${slide('cr-23', 10, 'Quy trình hai phiên bản')}
<p>Với video đã chọn theo Bài 23.1, quy trình lặp lại được:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Kịch bản chung, dịch trước khi quay</span><span class="lz-d">Kịch bản 2 cột của Ch3.3, viết Việt trước, dịch Anh theo đúng quy trình Bài 23.2 — không dịch tại chỗ lúc quay.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Quay — theo quyết định ở trên</span><span class="lz-d">Ghi rõ trong shot list (Ch4.3) đây là cảnh quay 2 lần hay 1 lần, để không quên lượt tiếng Anh giữa buổi quay.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">B-roll & đồ hoạ dùng chung</span><span class="lz-d">Không quay lại cảnh minh hoạ, không dựng lại lower third/callout cho từng bản — một bộ tài sản, hai track lời.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Dựng: track riêng theo ngôn ngữ, trong cùng project</span><span class="lz-d">Không phải hai project riêng — một project, khác track âm thanh + track phụ đề.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Xuất tên file rõ ràng</span><span class="lz-d">Nối vào quy ước đặt tên đã học ở Ch11.1: thêm hậu tố <code>_VI</code> / <code>_EN</code> ngay từ lúc xuất, không đợi tới lúc đăng mới đổi tên.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Đăng đúng cơ chế, đúng lịch</span><span class="lz-d">Video 2 phiên bản riêng biệt (2 lần đăng) hay 1 video + track dịch (Bài 23.3) — chọn theo loại nội dung đã phân ở Bài 23.1, ghi vào /creator/calendar (Ch2.3).</span></div>
</div>

<h3>Cấu trúc project: track theo ngôn ngữ trong Resolve/CapCut</h3>
${slide('cr-23', 9, 'Track VI/EN trong một dự án')}
<p>Không có gì lạ so với những gì Ch11–14 đã dạy — chỉ thêm một quy ước đặt tên track: một track hình (B-roll dùng chung), một track âm thanh cho mỗi ngôn ngữ (<code>A-VI</code>, <code>A-EN</code>), và một track phụ đề cho mỗi ngôn ngữ nếu bạn xuất phụ đề cứng theo bản (<code>CC-VI</code>, <code>CC-EN</code>). Khi cần bản tiếng Việt, ẩn track <code>A-EN</code>/<code>CC-EN</code> và xuất; đảo lại cho bản tiếng Anh. Đồ hoạ, nhạc nền, B-roll ở track hình KHÔNG đổi giữa hai lượt xuất.</p>
<p>Nếu bạn chọn dùng phụ đề mềm (khuyến nghị ở Ch16.3) thay vì burn-in, bạn thậm chí không cần hai track phụ đề riêng trong project dựng — chỉ cần hai file .srt xuất riêng, tải lên qua cơ chế ADD LANGUAGE của Bài 23.3. Ít việc dựng hơn, ít rủi ro lộn track hơn.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — quên đổi track khi xuất bản thứ hai.</strong> Xuất xong bản _VI, đổi track cho bản _EN, rồi bấm xuất — nhưng quên ẩn track A-VI cũ, ra một file có cả hai giọng chồng lên nhau. Luôn nghe thử 5 giây đầu của file vừa xuất trước khi tải lên, đừng tin thanh timeline nhìn đúng là đủ.</p></div>

<p class="note-ct"><strong>Nối tiếp:</strong> Chương 24 dạy xuất file chuẩn và đăng tải — áp dụng trực tiếp lên hai file _VI/_EN vừa dựng xong ở đây.</p>

<h3>🎬 Thực hành (30–45 phút)</h3>
<div class="callout ok"><ol>
<li>Với kịch bản 60 giây đã viết ở Bài 23.2, quyết định: quay 2 lần hay quay 1 lần + lồng tiếng. Ghi lý do bằng một câu.</li>
<li>Dựng một project mới (CapCut hoặc Resolve) với track đặt tên đúng quy ước: V1, A-VI, A-EN.</li>
<li>Xuất thử hai file <code>ten-video_VI.mp4</code> và <code>ten-video_EN.mp4</code> — nghe thử 5 giây đầu mỗi file trước khi coi là xong.</li>
</ol><p><strong>Đạt khi:</strong> hai file xuất ra đúng giọng của từng bản, không lẫn, và tên file đã theo đúng quy ước _VI/_EN.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Track</span><span class="v">Một lớp hình hoặc âm thanh riêng trong timeline dựng — bật/tắt độc lập với các track khác.</span></div>
<div class="kv"><span class="k">Shot list</span><span class="v">Danh sách cảnh cần quay, đã học ở Ch4.3 — nơi ghi rõ cảnh nào quay mấy lượt ngôn ngữ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Quay 2 lần cho cảnh talking head cận; quay 1 lần + lồng tiếng ổn cho cảnh nhiều B-roll che mặt.</li>
<li>Quy trình 6 bước: kịch bản chung → quay → B-roll dùng chung → dựng track riêng cùng project → xuất tên _VI/_EN → đăng đúng lịch.</li>
<li>Một project, khác track theo ngôn ngữ — không phải hai project riêng biệt.</li>
<li>Phụ đề mềm giảm hẳn việc dựng so với burn-in — chỉ cần hai file .srt, không cần hai track phụ đề trong timeline.</li>
<li>Luôn nghe thử vài giây đầu file vừa xuất — đừng tin mỗi timeline nhìn đúng.</li>
</ul>

<div class="link-card"><a href="https://support.google.com/youtube/answer/13338784" target="_blank" rel="noopener">YouTube Help — Add Multi-language audio tracks (nơi hai file _VI/_EN vừa dựng sẽ được tải lên)</a></div>
</div>
`,
    },

    /* ─────────────────── 23.5 Quiz ─────────────────── */
    {
      title: '23.5 — Chapter 23 check|||23.5 — Kiểm tra chương 23',
      slug: 'cr-23-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tóm tắt chương 23 và bài kiểm 10 câu: chiến lược một/hai kênh, viết kịch bản tiếng Anh B1, bốn cơ chế đa ngôn ngữ của YouTube, và quy trình dựng hai phiên bản.',
      content: `
<div class="ml-en">
<h2>📌 Chapter 23 Summary</h2>
<p>Chapter 1 pointed here for strategy; this chapter delivered it. One channel, correctly language-tagged, beats splitting into two for a beginner — YouTube's four multi-language mechanisms (translated titles/descriptions, translated subtitles, multi-language audio, automatic dubbing) all live inside a single Studio, though two of them are gated behind Advanced features or eligibility. Writing an English script starts in Vietnamese, targets B1 vocabulary and short present-simple sentences, gets polished — not replaced — by AI, and gets rehearsed with shadowing and YouGlish before hitting the same /creator teleprompter from Chapter 3. Production does not double: one shared script, one decision (shoot twice or dub once), shared B-roll, separate tracks inside the same edit project, and clear _VI/_EN filenames carry a single shoot into two published versions.</p>
<h3>Self-check before the next chapter</h3>
<div class="callout ok"><ul>
<li>☐ I can explain why one correctly language-tagged channel usually beats splitting into two, for a beginner.</li>
<li>☐ I wrote an English B1 script I can read fluently myself, without an AI writing it from scratch.</li>
<li>☐ I can clearly tell apart YouTube's four multi-language mechanisms — which change text, which change voice.</li>
<li>☐ I know the exact ADD LANGUAGE steps in Studio, without reopening the lesson.</li>
<li>☐ I know when AI dubbing needs disclosure under YouTube's policy.</li>
<li>☐ I can build a project with separate language tracks and export correctly named _VI/_EN files.</li>
</ul></div>
</div>
<div class="ml-vi">
<h2>📌 Tóm tắt Chương 23</h2>
<p>Chương 1 đã hẹn quay lại chỗ chiến lược; chương này giao đúng lời hẹn đó. Một kênh, gắn ngôn ngữ đúng cách, thường tốt hơn tách hai kênh cho người mới — bốn cơ chế đa ngôn ngữ của YouTube (dịch tiêu đề/mô tả, phụ đề dịch, âm thanh đa ngôn ngữ, lồng tiếng tự động) đều nằm trong một Studio, dù hai trong số đó còn cần điều kiện/quyền Advanced features. Viết kịch bản tiếng Anh bắt đầu từ tiếng Việt, nhắm vốn từ B1 và câu ngắn thì hiện tại đơn, được AI CHỈNH (không phải THAY) rồi luyện bằng shadowing và YouGlish trước khi dùng lại đúng teleprompter /creator của Chương 3. Sản xuất không nhân đôi: một kịch bản chung, một quyết định (quay 2 lần hay lồng 1 lần), B-roll dùng chung, track riêng trong cùng một project dựng, và tên file _VI/_EN rõ ràng biến một buổi quay thành hai phiên bản đã đăng.</p>
<h3>Tự kiểm trước khi qua chương sau</h3>
<div class="callout ok"><ul>
<li>☐ Tôi giải thích được vì sao một kênh gắn ngôn ngữ đúng cách thường tốt hơn tách hai kênh, với người mới.</li>
<li>☐ Tôi viết được một kịch bản tiếng Anh B1 mà tôi tự đọc trôi chảy, không cần AI viết hộ từ đầu.</li>
<li>☐ Tôi phân biệt được rành mạch bốn cơ chế đa ngôn ngữ của YouTube — cơ chế nào đổi chữ, cơ chế nào đổi giọng.</li>
<li>☐ Tôi biết chính xác các bước ADD LANGUAGE trong Studio, không cần mở lại bài học.</li>
<li>☐ Tôi biết khi nào lồng tiếng AI cần công khai theo chính sách của YouTube.</li>
<li>☐ Tôi dựng được một project với track riêng theo ngôn ngữ và xuất đúng tên file _VI/_EN.</li>
</ul></div>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You have 4,000 subscribers on a Vietnamese programming channel and want to start reaching an English-speaking audience. Per Lesson 23.1, how should you begin?|||Bạn mới có 4.000 người đăng ký trên một kênh dạy lập trình bằng tiếng Việt, và muốn thêm khán giả tiếng Anh. Theo Bài 23.1, nên bắt đầu thế nào?',
            options: [
              'Open a separate English YouTube channel right away and post to both from day one|||Mở ngay một kênh YouTube tiếng Anh riêng, đăng song song từ đầu',
              'Keep one channel, add subtitles/translated titles to your strongest videos first, and only split into two channels later if there is a clear reason|||Giữ một kênh, dùng phụ đề/dịch tiêu đề cho video mạnh nhất trước, chỉ tách kênh khi có lý do rõ ràng sau này',
              'Stop posting in Vietnamese and switch entirely to English|||Dừng đăng tiếng Việt, chuyển hẳn sang tiếng Anh',
              'Wait until your English is truly fluent before doing anything|||Đợi tới khi tiếng Anh thật trôi chảy mới làm gì cả',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: A small, young channel starting a second channel loses all its algorithm data and doubles the weekly workload for one video — exactly the trap Lesson 23.1 warns against. Abandoning Vietnamese throws away your existing, proven audience; waiting for fluency wastes time you could spend starting with a simple B1 script (Lesson 23.2).|||VI: Một kênh nhỏ, mới mà mở thêm kênh thứ hai sẽ mất hết dữ liệu thuật toán và nhân đôi khối lượng việc mỗi tuần cho một video — đúng cái bẫy Bài 23.1 cảnh báo. Bỏ tiếng Việt là bỏ luôn khán giả đã có sẵn, đã được chứng minh; chờ giỏi tiếng Anh mới làm thì lãng phí thời gian lẽ ra dùng để bắt đầu bằng một kịch bản B1 đơn giản (Bài 23.2).',
          },
          {
            question: 'You have three video ideas: (1) a deep dive on C pointers, (2) a vlog of one exam day at school, (3) a 40-second tip about console.log debugging. Per Lesson 23.1, which is the cheapest to add English subtitles to first?|||Bạn có 3 loại video: (1) bài giảng con trỏ trong C, (2) vlog một ngày đi thi ở trường, (3) video 40 giây mẹo debug console.log. Theo Bài 23.1, video nào rẻ nhất để thêm phụ đề tiếng Anh trước?',
            options: [
              'Video (3), because its script is shortest, so translation cost is lowest|||Video (3), vì kịch bản ngắn nhất nên chi phí dịch thấp nhất',
              'Video (2), because vlogs always need an English version|||Video (2), vì vlog luôn cần bản tiếng Anh',
              'Video (1), because programming terms are already in English so nothing needs translating|||Video (1), vì thuật ngữ lập trình đã là tiếng Anh nên không cần dịch gì thêm',
              'All three are equally cheap — there is no real difference|||Cả ba như nhau, không có sự khác biệt',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: The lesson explicitly ranks short, single-idea videos as the cheapest place to add bilingual subtitles. Vlogs are recommended to STAY Vietnamese-first, not the opposite; English terminology inside a lesson does not mean the surrounding Vietnamese narration needs no translation at all.|||VI: Bài học xếp thẳng video ngắn, một ý là chỗ rẻ nhất để thêm phụ đề song ngữ. Vlog được khuyên GIỮ tiếng Việt trước, không phải ngược lại; thuật ngữ tiếng Anh trong bài giảng không có nghĩa là lời giảng tiếng Việt xung quanh không cần dịch.',
          },
          {
            question: 'In your video, one segment causes 80% of viewers to drop off partway through. Which term from Lesson 23.2\'s vocabulary table describes this drop?|||Trong video của bạn, một đoạn khiến 80% người xem thoát ra giữa chừng. Thuật ngữ nào trong bảng ở Bài 23.2 mô tả đúng việc mất người xem này?',
            options: [
              'CTR|||CTR',
              'Impression|||Impression',
              'Retention dropping at exactly that segment|||Retention tụt ở đúng đoạn đó',
              'Thumbnail|||Thumbnail',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Retention measures how well a video holds viewers over time — a drop means viewers left at that point. CTR measures clicks from a thumbnail; impression counts how often it was shown; thumbnail is only the representative image — none of these describe in-video viewer behavior.|||VI: Retention đo mức giữ chân người xem theo thời gian — tụt nghĩa là người xem rời đi tại đó. CTR đo lượt bấm từ thumbnail; impression đếm số lần hiển thị; thumbnail chỉ là ảnh đại diện — không cái nào mô tả hành vi trong lúc xem.',
          },
          {
            question: 'You are translating "Hàm này trả về rỗng khi mảng không có phần tử nào." Per Lesson 23.2\'s B1 guidance, which English version is best suited to read on camera yourself?|||Bạn đang dịch câu "Hàm này trả về rỗng khi mảng không có phần tử nào." Theo nguyên tắc B1 của Bài 23.2, bản tiếng Anh nào hợp nhất để tự đọc trên camera?',
            options: [
              'This function, which handles the case where the array contains no elements whatsoever, will return a null value.|||This function, which handles the case where the array contains no elements whatsoever, will return a null value.',
              'This function returns null when the array is empty.|||This function returns null when the array is empty.',
              'Null shall be returned by this function whenever emptiness of the array is detected.|||Null shall be returned by this function whenever emptiness of the array is detected.',
              'Empty array leads this function returning of null value occur.|||Empty array leads this function returning of null value occur.',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Option B is short, active voice, present simple — exactly the B1 target. Option A stitches in a long relative clause; option C is unnecessarily passive and formal; option D is simply ungrammatical and unnatural to say aloud.|||VI: Phương án B ngắn, chủ động, hiện tại đơn — đúng mức B1. Phương án A gắn một mệnh đề quan hệ dài; phương án C bị động và trang trọng quá mức không cần thiết; phương án D sai ngữ pháp và không tự nhiên khi nói.',
          },
          {
            question: 'You listen to an English sentence and try to repeat it back IMMEDIATELY, matching the intonation, before the sentence even finishes. What is this technique called, and what does it actually train?|||Bạn nghe một câu tiếng Anh và cố nói lại NGAY LẬP TỨC, bắt chước ngữ điệu, trước cả khi câu kết thúc. Đây là kỹ thuật gì, và nó luyện được thứ gì?',
            options: [
              'YouGlish — it trains looking up new vocabulary|||YouGlish — luyện tra từ vựng mới',
              'Teleprompter — it trains reading a script without stumbling|||Teleprompter — luyện đọc kịch bản không vấp',
              'Shadowing — it trains pronunciation, intonation and fluency, and is NOT a good way to learn new words or grammar|||Shadowing — luyện phát âm, ngữ điệu và độ trôi chảy, KHÔNG phải cách tốt để học từ/ngữ pháp mới',
              'Dubbing — it trains professional voice-acting|||Dubbing — luyện lồng tiếng chuyên nghiệp',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: This is exactly the definition of shadowing from Lesson 23.2 — immediate repetition matching intonation/rhythm, confirmed by 2025 research to help pronunciation and fluency but not vocabulary/grammar acquisition. YouGlish is for checking pronunciation of a specific word you already know the meaning of; a teleprompter is a reading tool; dubbing is a separate production task.|||VI: Đây đúng là định nghĩa shadowing ở Bài 23.2 — nói lại ngay, bắt chước ngữ điệu/nhịp, được nghiên cứu 2025 xác nhận giúp phát âm và độ trôi chảy nhưng không giúp học từ vựng/ngữ pháp. YouGlish dùng để tra phát âm một từ đã biết nghĩa; teleprompter là công cụ đọc; dubbing là một việc sản xuất khác.',
          },
          {
            question: 'You are filming with the /creator teleprompter and the text scrolls faster than you can comfortably speak, so you keep chasing it. Which key actually fixes this?|||Bạn đang quay bằng teleprompter /creator và chữ cuộn nhanh hơn tốc độ bạn nói thoải mái, khiến bạn phải đuổi theo. Phím nào thật sự sửa đúng vấn đề này?',
            options: [
              'R — because it jumps back to the start of the script|||R — vì nó đưa bạn về đầu kịch bản',
              'Space — because it stops scrolling entirely|||Space — vì nó dừng hẳn việc cuộn',
              'F — because it switches to full screen|||F — vì nó chuyển sang toàn màn hình',
              'The down arrow (↓) — because it slows the scroll speed by 0.25× per press|||↓ — vì nó giảm tốc độ cuộn 0,25× mỗi lần bấm',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The down arrow is the speed control, adjustable in 0.25× steps — the direct fix for a mismatch between scroll speed and your speaking pace, as taught in Ch3.4 and reused in Lesson 23.2. R only resets position, Space stops scrolling entirely rather than slowing it, and F only changes the display, not the pace.|||VI: Phím mũi tên xuống chỉnh tốc độ, theo bước 0,25× — đúng cách sửa trực tiếp khi tốc độ cuộn lệch với nhịp nói của bạn, đã học ở Ch3.4 và dùng lại ở Bài 23.2. R chỉ đưa về vị trí đầu, Space dừng hẳn chứ không phải giảm tốc, còn F chỉ đổi cách hiển thị, không đổi tốc độ.',
          },
          {
            question: 'You want your Vietnamese video to show up when someone searches using an English title. Per the steps verified in Lesson 23.3, where do you go in YouTube Studio?|||Bạn muốn video tiếng Việt của mình hiện ra khi ai đó tìm kiếm bằng tiêu đề tiếng Anh. Theo đúng các bước đã kiểm ở Bài 23.3, bạn vào đâu trong YouTube Studio?',
            options: [
              'Subtitles → select the video → ADD LANGUAGE → choose the language → under Title and description click Add → enter the translation → PUBLISH|||Subtitles → chọn video → ADD LANGUAGE → chọn ngôn ngữ → dưới mục Title and description bấm Add → nhập bản dịch → PUBLISH',
              'Settings → Content → toggle on Automatic dubbing|||Settings → Content → bật Automatic dubbing',
              'Languages → Add Language → the Dub section → upload an audio file|||Languages → Add Language → mục Dub → tải file âm thanh',
              'There is no way to do this on YouTube|||Không có cách nào làm việc này trên YouTube',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: This is the exact verified path for translated titles/descriptions (support.google.com/youtube/answer/6289575). Automatic dubbing (option B) only generates translated AUDIO, not text; the Dub section under Languages (option C) is for uploading your own translated audio track, not text metadata — both are different mechanisms from Lesson 23.3.|||VI: Đây đúng là đường đã kiểm cho tiêu đề/mô tả dịch (support.google.com/youtube/answer/6289575). Automatic dubbing (phương án B) chỉ tự tạo ÂM THANH dịch, không phải chữ; mục Dub dưới Languages (phương án C) dùng để tải track âm thanh tự dịch của bạn, không phải chữ tiêu đề — cả hai đều là cơ chế khác trong Bài 23.3.',
          },
          {
            question: 'You look for Languages → Add Language → Dub in Studio to upload your own English audio track, but you cannot find that section anywhere. Per Lesson 23.3, what is the most likely reason?|||Bạn tìm mục Languages → Add Language → Dub trong Studio để tự tải lên một track giọng tiếng Anh — nhưng không thấy mục này ở đâu cả. Theo Bài 23.3, khả năng cao nhất là vì sao?',
            options: [
              'YouTube has permanently removed this feature from every channel|||YouTube đã xoá vĩnh viễn tính năng này khỏi mọi kênh',
              'Multi-language audio currently requires access to Advanced features — your channel may not be eligible yet|||Âm thanh đa ngôn ngữ hiện chỉ dành cho kênh có quyền Advanced features — kênh của bạn có thể chưa đủ điều kiện',
              'You must turn on Automatic dubbing first for the Dub section to appear|||Bạn cần bật Automatic dubbing trước thì mục Dub mới hiện ra',
              'This feature only works on the mobile app, never on desktop|||Tính năng này chỉ hoạt động trên app di động, không có trên máy tính',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: YouTube\'s own help page states Multi-language audio "is currently available to creators with access to Advanced features" — an eligibility gate, confirmed directly in Lesson 23.3. The feature has not been removed, does not require Automatic dubbing first, and the help documentation does not describe it as desktop-only in that direction.|||VI: Trang trợ giúp của YouTube nói rõ Âm thanh đa ngôn ngữ "hiện chỉ dành cho kênh có quyền Advanced features" — một điều kiện, đã xác nhận trực tiếp ở Bài 23.3. Tính năng không bị xoá, không cần bật Automatic dubbing trước, và tài liệu trợ giúp không mô tả nó chỉ chạy trên máy tính theo chiều đó.',
          },
          {
            question: 'One of your videos has an automatic dub into English, but a programming term keeps getting mispronounced. Per Lesson 23.3, what is the correct fix?|||Một video của bạn có bản lồng tiếng tự động sang tiếng Anh, nhưng một thuật ngữ lập trình bị đọc sai liên tục. Theo Bài 23.3, cách sửa đúng là gì?',
            options: [
              'Edit the dub\'s text directly inside Studio|||Sửa trực tiếp đoạn văn bản của bản lồng ngay trong Studio',
              'There is no fix — you must delete the entire video|||Không có cách nào khắc phục, phải xoá cả video',
              'Wait for YouTube to automatically correct it in a future update|||Đợi YouTube tự động sửa trong lần cập nhật tiếp theo',
              'Unpublish that automatic dub, or replace it with your own recorded track via Multi-language audio|||Gỡ bản lồng tự động đó, hoặc thay bằng track bạn tự thu qua Âm thanh đa ngôn ngữ',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The lesson verified directly on support.google.com that automatic dubs cannot be edited — your only two options are unpublishing the dub or replacing it with your own recorded audio track through Mechanism 3. Deleting the whole video is a massive overreaction, and there is no documented auto-correction behavior to wait for.|||VI: Bài học đã kiểm trực tiếp trên support.google.com rằng bản lồng tự động không sửa được — chỉ có hai lựa chọn là gỡ bản lồng hoặc thay bằng track bạn tự thu qua Cơ chế 3. Xoá cả video là phản ứng quá mức, và không có hành vi tự sửa nào được ghi nhận để chờ đợi.',
          },
          {
            question: 'You built a project with A-VI and A-EN audio tracks. While exporting the _EN version, you forget to hide the A-VI track before exporting. Per Lesson 23.4, what almost certainly happens, and where should you have caught the mistake?|||Bạn dựng một project với track A-VI và A-EN. Lúc xuất bản _EN, bạn quên ẩn track A-VI trước khi bấm xuất. Theo Bài 23.4, hậu quả gần như chắc chắn là gì, và lẽ ra bạn phải bắt được lỗi này ở đâu?',
            options: [
              'YouTube will reject the upload outright|||YouTube sẽ từ chối tải video lên',
              'Nothing happens — YouTube automatically picks the correct track on playback|||Không có hậu quả gì, YouTube tự chọn đúng track khi phát',
              'The exported file will have both voices overlapping — you should have caught it by listening to the first few seconds of the file before uploading|||File xuất ra sẽ có cả hai giọng chồng lên nhau — lẽ ra phải bắt được bằng cách nghe thử vài giây đầu file vừa xuất trước khi tải lên',
              'The subtitles will automatically be deleted from the video|||Phụ đề sẽ tự động bị xoá khỏi video',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: This is exactly the pitfall Lesson 23.4 warns about — an unhidden extra audio track exports with both voices overlapping, and the fix is a habit, not a tool: always listen to the first seconds of a freshly exported file before uploading, never trust a timeline that merely looks correct. None of the other outcomes are how export or upload actually behaves.|||VI: Đây đúng là cái bẫy Bài 23.4 đã cảnh báo — một track âm thanh thừa chưa ẩn sẽ xuất ra file có cả hai giọng chồng nhau, và cách sửa là một thói quen, không phải một công cụ: luôn nghe thử vài giây đầu file vừa xuất trước khi tải lên, đừng tin mỗi timeline nhìn đúng. Không có kết quả nào khác đúng với cách xuất/tải video thật sự hoạt động.',
          },
        ],
      },
    },
  ],
};

