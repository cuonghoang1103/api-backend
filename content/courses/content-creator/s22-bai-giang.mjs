/**
 * Content Creator — Chương 22: Video bài giảng & quay màn hình. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 *
 * Nguồn số liệu chính (xem đầy đủ trong báo cáo bàn giao):
 *  - Mayer's multimedia learning principles: educationaltechnology.net/mayers-principles-of-multimedia-learning
 *    (định nghĩa gốc: Cambridge Handbook of Multimedia Learning, chủ biên Richard E. Mayer, UC Santa Barbara)
 *  - Guo, Kim & Rubin (L@S 2014) "How video production affects student engagement":
 *    pure.kaist.ac.kr/en/publications/how-video-production-affects-student-engagement-an-empirical-stud
 *  - OBS Studio macOS Screen Capture / Video Capture Device: obsproject.com/kb/macos-screen-capture-source,
 *    obsproject.com/kb/video-capture-sources ; Base/Output Resolution + Downscale Filter: OBS Forums
 *  - Quay màn hình macOS (Shift-Cmd-5): support.apple.com/en-us/102618
 *  - Continuity Camera: support.apple.com/en-us/102546
 *  - Presenter Overlay: support.apple.com/en-us/105117
 *  - Con trỏ to (Accessibility → Display): support.apple.com/guide/mac-help/…mchlp2920/mac
 *  - Focus / Không làm phiền: support.apple.com/guide/mac-help/…mchl613dc43f/mac
 *  - KeyCastr: github.com/keycastr/keycastr (README)
 *  - Quay màn hình iPhone/iPad (Control Center): support.apple.com/en-us/102653
 *  - AirPlay phản chiếu iPad → Mac: support.apple.com/en-us/102661
 *  - Freeform (Apple): support.apple.com/guide/ipad/get-started-with-freeform-ipad9c59637d/ipados
 *  - YouTube video chapters — quy tắc chính thức: support.google.com/youtube/answer/9884579
 *  - Cơ chế 3 luồng video VI/EN/YT: đọc mã thật trong prisma/schema.prisma (LessonDetail), src/routes/course.routes.ts,
 *    frontend/src/app/courses/[slug]/learn/LearnPageClient.tsx, frontend/src/components/admin/LessonVideoTracks.tsx,
 *    scripts/course-video-seed.mjs, scripts/verify-youtube-videos.mjs, content/course-videos/content-creator.mjs
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter 22 — Teaching videos & screen recording|||Chương 22 — Video bài giảng & quay màn hình',
  description: 'Thiết kế một bài giảng theo nguyên lý đa phương tiện của Mayer, quay màn hình chuẩn bằng OBS và macOS, biến iPad thành bảng trắng thật, rồi đưa video tự quay lên đúng luồng VI/EN của cuongthai.com.',
  lessons: [
    /* ─────────────────── 22.0 slide bài giảng ─────────────────── */
    {
      title: '22.0 — Chapter 22 in 16 slides|||22.0 — Chương 22 trong 16 slide',
      slug: 'cr-22-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ chương 22 gói trong 16 slide: nguyên lý dạy bằng video, bố cục scene OBS, iPad làm bảng trắng, và đường đi của video tự quay lên 3 luồng VI/EN/YT.',
      content: `
<div class="ml-en"><h2>📑 Chapter 22 in 16 slides</h2>
<p>Every device you have used since Chapter 5 gets one more job here: the Mac becomes a lecture-capture studio, the iPhone becomes a webcam, and the iPad becomes a whiteboard. None of that is new hardware — it is the same five devices from Lesson 0.2, pointed at a new kind of video.</p>
<p>Two slides earn a second look after you read the four lessons below: <strong>slide 4</strong> (the research on video length — it justifies a habit Chapter 4 already told you to build) and <strong>slide 14</strong> (the exact path a finished file takes to reach the VN/EN switch on a real lesson page).</p></div>
<div class="ml-vi"><h2>📑 Chương 22 trong 16 slide</h2>
<p>Mỗi máy bạn đã dùng từ Chương 5 nhận thêm một việc mới ở đây: Mac trở thành phòng thu bài giảng, iPhone trở thành webcam, iPad trở thành bảng trắng. Không có máy mới nào cả — vẫn là năm thiết bị từ Bài 0.2, chỉ trỏ vào một kiểu video khác.</p>
<p>Hai slide đáng xem lại sau khi đọc xong bốn bài dưới: <strong>slide 4</strong> (nghiên cứu về độ dài video — nó chứng minh cho một thói quen Chương 4 đã bảo bạn phải tập) và <strong>slide 14</strong> (đường đi thật của một file đã dựng xong, tới tận nút chuyển VN/EN trên một trang học thật).</p></div>
${gallery('cr-22', [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Nguyên lý đa phương tiện của Mayer'],
  [4, 'Nghiên cứu độ dài video (Guo, Kim & Rubin 2014)'],
  [5, 'Cấu trúc một bài giảng — chia đoạn'],
  [6, 'Quay nhanh hay dựng cảnh — chọn công cụ nào'],
  [7, 'Bố cục scene OBS cho một bài giảng code'],
  [8, 'iPhone làm webcam qua Continuity Camera'],
  [9, 'Bảng cài đặt quay màn hình'],
  [10, 'Dọn bàn làm việc số trước khi bấm quay'],
  [11, 'Presenter Overlay — khi bạn dạy trực tiếp qua video call'],
  [12, 'iPad làm bảng trắng — luồng ghép vào cảnh quay'],
  [13, 'Ba app viết tay trên iPad'],
  [14, 'Từ file dựng xong tới 3 luồng VI/EN/YT'],
  [15, 'Bảng tra nhanh chương 22'],
  [16, 'Thực hành'],
])}
`,
    },

    /* ─────────────────── 22.1 thiết kế bài giảng ─────────────────── */
    {
      title: '22.1 — Designing a lecture: Mayer’s principles and video length|||22.1 — Thiết kế bài giảng: nguyên lý của Mayer và độ dài video',
      slug: 'cr-22-1-thiet-ke-bai-giang',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Cấu trúc một bài giảng theo 6 bước, 5 nguyên lý đa phương tiện của Mayer, và vì sao mức gắn bó của người xem rơi mạnh sau khoảng 6 phút.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 22 · Lesson 22.1</span>
<h2>Before you press record, design the lesson — camera settings do not matter if nobody watches past minute six</h2>
<p class="lead">Chapters 5 through 21 taught you to get a clean picture and clean sound. A teaching video can nail both and still fail, for a completely different reason: nobody stays to the end. This lesson gives you a shape to write a segment in, five research-backed rules for what belongs on screen, and one specific number that turns out to justify a habit you were already told to build back in Chapter 4.</p>

<h3>A shape for every lecture segment</h3>
<p>A tutorial is not a vlog with code on screen. It has a job: someone should be able to do something after watching that they could not do before. Six moves, in order, make that reliable — and because they map onto how people actually process instruction, skipping straight to "let me show you the code" is the single most common reason a technically correct lecture still confuses people.</p>
${slide('cr-22', 5, 'Cấu trúc một bài giảng — chia đoạn')}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Goal</span><span class="lz-d">One sentence: what the viewer can DO after this segment.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Why</span><span class="lz-d">A real problem this solves, before the definition — motivation before mechanism.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Concept</span><span class="lz-d">A short definition plus one small example, not the whole API surface.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Demonstration</span><span class="lz-d">Type real code, narrate what you are thinking, not just what you are typing.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Practice</span><span class="lz-d">A small task the viewer can attempt alone, sized to fit in a few minutes.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Recap</span><span class="lz-d">Three bullet points, then a sentence bridging to the next segment.</span></div>
</div>
<p>This is the same shape you already use without naming it: it is "why before how" from this course's own <em>Giọng văn</em> guideline, applied to a single ten-minute chunk instead of a whole chapter. Write the script for one segment on this shape before you touch OBS — Lesson 3.3's two-column script format works here too, with the six steps as your left-hand column headings.</p>

<h3>Five rules for what belongs on screen, from research on multimedia learning</h3>
<p>Richard E. Mayer, a professor at UC Santa Barbara, has spent decades running controlled experiments on exactly this question: given the same information, which arrangement of pictures, text and narration actually produces better test scores afterward? Five of his findings apply directly to a screen-recorded lecture.</p>
${slide('cr-22', 3, 'Nguyên lý đa phương tiện của Mayer')}
<div class="kv-grid">
<div class="kv"><span class="k">Signaling</span><span class="v">People learn better when cues point at what matters. <small>An arrow or a highlighted box around the exact line of code you are discussing, not just "look at line 14".</small></span></div>
<div class="kv"><span class="k">Segmenting</span><span class="v">People learn better from bite-sized, learner-paced chunks than one continuous stream. <small>The six-step shape above, repeated every 3–8 minutes.</small></span></div>
<div class="kv"><span class="k">Coherence</span><span class="v">People learn better when extraneous material is excluded, not added for polish. <small>No background music while you explain a bug, no cluttered desktop, no unrelated open tabs.</small></span></div>
<div class="kv"><span class="k">Redundancy</span><span class="v">People learn better from graphics + narration than from graphics + narration + on-screen text that says the exact same words. <small>Don't paste a full paragraph on a slide and then read it aloud verbatim.</small></span></div>
<div class="kv"><span class="k">Personalization</span><span class="v">People learn better from a conversational voice than a formal, lecture-hall one. <small>Say "you", say "I", tell them about the actual bug that tripped you up.</small></span></div>
</div>
<p class="note-ct">These definitions come from the <em>Cambridge Handbook of Multimedia Learning</em>, edited by Mayer — the full set runs to twelve principles; the five above are the ones that change what you actually do in front of a screen recorder.</p>

<h3>The six-minute number, and what it is really telling you</h3>
<p>In 2014, researchers Philip J. Guo, Juho Kim and Rob Rubin published the largest engagement study of its kind at the time, at the ACM Learning @ Scale conference: 6.9 million video-watching sessions across four courses on the edX platform. They measured two things — how long students actually watched, and whether they attempted the problem that followed the video.</p>
${slide('cr-22', 4, 'Nghiên cứu độ dài video (Guo, Kim & Rubin 2014)')}
<p>Three findings matter for you specifically. First, shorter videos are much more engaging, and engagement drops off sharply after roughly six minutes — regardless of how long the whole video runs. Second, informal talking-head videos are more engaging than polished, pre-recorded classroom lectures; the paper's own phrasing is blunt about it — "high-quality pre-recorded classroom lectures might not make for engaging online videos." Third, Khan-style tablet drawing — someone drawing an explanation by hand while narrating — is more engaging than static slides. Hold onto that third finding; it is exactly why Lesson 22.3 is worth building around your iPad.</p>
<div class="callout warn"><p><strong>Read the six minutes correctly:</strong> this is not "never make a video longer than six minutes." A 30-minute lecture built from five clearly-labeled six-minute segments, each with its own recap and bridge, keeps people moving from segment to segment. A 30-minute lecture recorded as one continuous take does not — there is no natural place for attention to reset.</p></div>

<h3>The segment length number and Chapter 4's card-filling habit are the same fix</h3>
<p>Back in Lesson 4.1 you learned the cost of hitting record and letting Pocket 3 run for twenty or thirty minutes "to not miss anything" — it fills the memory card and turns editing into scrubbing. The fix there was shooting in short, purposeful pieces. A lecture recording has the exact same failure mode with a second, worse cost on top: even if storage were infinite, a viewer's attention is not. Script your lecture as four or five labeled segments before you record, the same way you would write a shot list — then record each one as its own take, stop, breathe, start the next. Editing five clean six-minute pieces into one video is dramatically easier than hunting for good moments inside forty unbroken minutes.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — recording one continuous 25–40 minute lecture because stopping "breaks your flow":</strong> it feels efficient in the moment and produces exactly the footage this lesson just told you to avoid: no natural cut points, no segment recaps, and an editing session spent hunting for where one idea ends and the next begins. Script the six-step shape per segment BEFORE recording, and treat "segment done" as a real stopping point, the same discipline Chapter 4 already asked of your vlogging.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — writing the full explanation as a paragraph on the slide, then reading it aloud word for word:</strong> this is the redundancy principle failing in real time — the viewer is asked to read and listen to identical words at once, which is harder to process than either channel alone, not easier. Put a short label or a diagram on screen and say the explanation in your own words instead; save full sentences for the video's own captions (Chapter 16), which exist for a different purpose — accessibility and silent viewing — not for you to read aloud.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 22.2 turns this script into an actual screen recording — OBS, macOS's own tools, and the settings that keep VS Code readable. Lesson 22.3 is where the Khan-style drawing finding above becomes a real workflow with your iPad.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick one small, real programming concept you could teach in one segment (a closure, a git command, a CSS property — anything you actually understand well).</li>
<li>Write it out using the six-step shape: Goal, Why, Concept, Demonstration, Practice, Recap — one or two sentences per step.</li>
<li>Time yourself reading it aloud at a natural pace. Aim for 4–6 minutes; if you are well past 8, cut the Concept or Demonstration step, not the Practice step.</li>
</ol><p><strong>Done when:</strong> you have a written segment script under 8 minutes of read-aloud time, with all six steps present and the Goal written as one sentence a viewer could repeat back to you.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Segmenting principle</span><span class="v">Chia đoạn — Mayer's finding that learner-paced, bite-sized chunks beat one continuous stream.</span></div>
<div class="kv"><span class="k">Redundancy principle</span><span class="v">Dư thừa — narrated graphics beat narrated graphics plus identical on-screen text read aloud.</span></div>
<div class="kv"><span class="k">Engagement</span><span class="v">Mức gắn bó — in Guo, Kim & Rubin's study, how long a student actually kept watching a video.</span></div>
<div class="kv"><span class="k">Khan-style drawing</span><span class="v">Vẽ tay kiểu Khan Academy — narrating while hand-drawing an explanation, found more engaging than static slides.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Structure every segment as Goal → Why → Concept → Demonstration → Practice → Recap, written before you record.</li>
<li>Five Mayer principles that change a screen recording: signaling, segmenting, coherence, redundancy, personalization.</li>
<li>Guo, Kim & Rubin (2014, 6.9 million sessions): engagement drops sharply around six minutes regardless of total length; informal talking-head beats polished classroom lectures; hand-drawn explanations beat static slides.</li>
<li>The fix is the same one Chapter 4 already taught for vlogging: record in short, purposeful segments — now justified by viewer attention, not just memory-card space.</li>
</ul>
<div class="link-card"><a href="https://educationaltechnology.net/mayers-principles-of-multimedia-learning/" target="_blank" rel="noopener">Mayer's Principles of Multimedia Learning — a clear walkthrough of all twelve principles</a></div>
<div class="link-card"><a href="https://pure.kaist.ac.kr/en/publications/how-video-production-affects-student-engagement-an-empirical-stud/" target="_blank" rel="noopener">Guo, Kim & Rubin (2014) — "How video production affects student engagement" (L@S)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 22 · Bài 22.1</span>
<h2>Trước khi bấm quay, hãy thiết kế bài giảng — cài đặt máy quay không cứu được bạn nếu không ai xem quá phút thứ sáu</h2>
<p class="lead">Chương 5 tới 21 đã dạy bạn lấy hình sạch và tiếng sạch. Một video bài giảng có thể đạt cả hai mà vẫn thất bại, vì một lý do hoàn toàn khác: không ai xem tới cuối. Bài này cho bạn một khung để viết từng đoạn, năm nguyên tắc có nghiên cứu chống lưng về thứ gì nên xuất hiện trên màn hình, và một con số cụ thể — con số hoá ra chứng minh cho đúng thói quen Chương 4 đã bảo bạn phải tập.</p>

<h3>Một khung cho mỗi đoạn bài giảng</h3>
<p>Một bài hướng dẫn không phải vlog có code trên màn hình. Nó có một việc phải làm: người xem phải làm được một việc sau khi xem mà trước đó chưa làm được. Sáu bước, theo đúng thứ tự, làm điều đó chắc chắn xảy ra — và vì chúng khớp với cách con người thật sự tiếp nhận một chỉ dẫn, nhảy thẳng vào "để mình chỉ bạn đoạn code này" là lý do phổ biến nhất khiến một bài giảng đúng về mặt kỹ thuật vẫn làm người xem rối.</p>
${slide('cr-22', 5, 'Cấu trúc một bài giảng — chia đoạn')}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Mục tiêu</span><span class="lz-d">Một câu: người xem LÀM ĐƯỢC gì sau đoạn này.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Vì sao</span><span class="lz-d">Một vấn đề thật đoạn này giải quyết, trước cả định nghĩa — động lực trước cơ chế.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Khái niệm</span><span class="lz-d">Định nghĩa ngắn cộng một ví dụ nhỏ, không phải toàn bộ API.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Làm mẫu</span><span class="lz-d">Gõ code thật, nói ra bạn đang NGHĨ gì, không chỉ đang gõ gì.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Luyện</span><span class="lz-d">Một bài tập nhỏ người xem tự làm được, gói gọn trong vài phút.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Tóm tắt</span><span class="lz-d">Ba gạch đầu dòng, rồi một câu dẫn sang đoạn kế.</span></div>
</div>
<p>Đây chính là khung bạn đã dùng mà chưa gọi tên: "vì sao trước làm thế nào" của chính khoá này, áp vào một đoạn mười phút thay vì cả chương. Viết kịch bản cho một đoạn theo khung này trước khi chạm vào OBS — định dạng kịch bản 2 cột của Bài 3.3 dùng được luôn ở đây, với sáu bước làm tiêu đề cột trái.</p>

<h3>Năm luật về thứ gì nên xuất hiện trên màn hình, từ nghiên cứu về học qua đa phương tiện</h3>
<p>Richard E. Mayer, giáo sư tại UC Santa Barbara, dành hàng chục năm chạy các thí nghiệm có kiểm soát đúng câu hỏi này: cùng một lượng thông tin, cách sắp xếp hình, chữ và lời nào thật sự cho điểm kiểm tra tốt hơn sau đó? Năm phát hiện của ông áp dụng thẳng vào một video quay màn hình.</p>
${slide('cr-22', 3, 'Nguyên lý đa phương tiện của Mayer')}
<div class="kv-grid">
<div class="kv"><span class="k">Tín hiệu <small>(signaling)</small></span><span class="v">Người học tiếp thu tốt hơn khi có dấu hiệu chỉ ra điều quan trọng. <small>Mũi tên hoặc khung khoanh đúng dòng code đang giảng, không chỉ nói suông "nhìn dòng 14".</small></span></div>
<div class="kv"><span class="k">Chia đoạn <small>(segmenting)</small></span><span class="v">Người học tiếp thu tốt hơn với các đoạn nhỏ, theo nhịp của họ, thay vì một luồng liên tục. <small>Khung 6 bước ở trên, lặp lại mỗi 3–8 phút.</small></span></div>
<div class="kv"><span class="k">Mạch lạc <small>(coherence)</small></span><span class="v">Người học tiếp thu tốt hơn khi bỏ bớt thứ không liên quan, thay vì thêm vào cho "đẹp". <small>Không nhạc nền khi đang giải thích một lỗi, không desktop bừa, không tab lạ đang mở.</small></span></div>
<div class="kv"><span class="k">Dư thừa <small>(redundancy)</small></span><span class="v">Người học tiếp thu tốt hơn với hình + lời, so với hình + lời + chữ trên màn hình nói y hệt. <small>Đừng dán cả đoạn văn lên slide rồi đọc lại nguyên văn.</small></span></div>
<div class="kv"><span class="k">Cá nhân hoá <small>(personalization)</small></span><span class="v">Người học tiếp thu tốt hơn với giọng trò chuyện so với giọng giảng đường trang trọng. <small>Nói "bạn", nói "mình", kể đúng con bug thật đã làm bạn vấp.</small></span></div>
</div>
<p class="note-ct">Các định nghĩa trên lấy từ <em>Cambridge Handbook of Multimedia Learning</em>, do chính Mayer chủ biên — bộ đầy đủ có tới mười hai nguyên lý; năm cái ở trên là những cái đổi thật cách bạn làm việc trước máy quay màn hình.</p>

<h3>Con số sáu phút, và nó thật sự đang nói với bạn điều gì</h3>
<p>Năm 2014, ba nhà nghiên cứu Philip J. Guo, Juho Kim và Rob Rubin công bố nghiên cứu về mức gắn bó lớn nhất từng có tính tới thời điểm đó, tại hội nghị ACM Learning @ Scale: 6,9 triệu lượt xem video trên bốn khoá học của nền tảng edX. Họ đo hai thứ — học viên thật sự xem bao lâu, và họ có làm bài tập ngay sau video hay không.</p>
${slide('cr-22', 4, 'Nghiên cứu độ dài video (Guo, Kim & Rubin 2014)')}
<p>Ba phát hiện quan trọng cho bạn cụ thể. Một, video càng ngắn càng giữ chân tốt hơn nhiều, và mức gắn bó rơi mạnh sau khoảng sáu phút — bất kể cả video dài bao nhiêu. Hai, video talking-head kiểu thân mật giữ chân tốt hơn bài giảng quay sẵn trong phòng học "chỉn chu"; chính nghiên cứu viết thẳng: "bài giảng phòng học quay sẵn, chất lượng cao, có thể lại không hấp dẫn khi làm video trực tuyến". Ba, hình vẽ tay kiểu Khan Academy — ai đó vừa vẽ giải thích bằng tay vừa nói — giữ chân tốt hơn slide tĩnh. Giữ lấy phát hiện thứ ba; đó chính xác là lý do Bài 22.3 đáng để dựng quanh chiếc iPad của bạn.</p>
<div class="callout warn"><p><strong>Đọc đúng con số sáu phút:</strong> đây không phải "đừng bao giờ làm video dài quá sáu phút". Một bài giảng 30 phút dựng từ năm đoạn sáu phút được dán nhãn rõ ràng, mỗi đoạn có tóm tắt và câu dẫn riêng, giữ người xem đi tiếp từ đoạn này sang đoạn khác. Một bài giảng 30 phút quay liền một mạch thì không — không có chỗ tự nhiên nào để sự chú ý được "nghỉ" rồi quay lại.</p></div>

<h3>Con số độ dài đoạn và thói quen làm đầy thẻ nhớ ở Chương 4 là cùng một cách chữa</h3>
<p>Ở Bài 4.1 bạn đã học cái giá của việc bấm quay rồi để Pocket 3 chạy hai ba mươi phút "cho chắc không bỏ sót gì" — nó làm đầy thẻ nhớ và biến việc dựng thành tua tìm. Cách chữa ở đó là quay theo từng đoạn nhỏ, có chủ đích. Quay bài giảng gặp đúng lỗi đó, cộng thêm một cái giá thứ hai còn nặng hơn: dù thẻ nhớ có vô hạn, sự chú ý của người xem thì không. Viết kịch bản bài giảng thành bốn năm đoạn có dán nhãn TRƯỚC khi quay, giống hệt cách bạn viết shot list — rồi quay mỗi đoạn thành một take riêng, dừng, thở, quay đoạn kế. Dựng năm đoạn sáu phút sạch sẽ thành một video dễ hơn rất nhiều so với lục tìm khoảnh khắc hay bên trong bốn mươi phút liền mạch không cắt.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — quay liền một mạch 25–40 phút vì dừng lại sẽ "gãy mạch":</strong> nó cảm giác hiệu quả ngay lúc đó, nhưng lại tạo ra đúng loại cảnh bài này vừa bảo bạn tránh: không có điểm cắt tự nhiên, không có tóm tắt từng đoạn, và một buổi dựng dành để lục tìm chỗ ý này kết thúc, ý kia bắt đầu. Viết kịch bản theo khung 6 bước cho từng đoạn TRƯỚC khi quay, và coi "xong một đoạn" là một điểm dừng thật sự — đúng kỷ luật Chương 4 đã đòi hỏi ở việc quay vlog của bạn.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — viết cả lời giải thích thành một đoạn văn trên slide, rồi đọc lại nguyên văn từng chữ:</strong> đây chính là nguyên lý dư thừa đang thất bại ngay trước mắt — người xem bị bắt vừa đọc vừa nghe cùng một chuỗi chữ cùng lúc, khó xử lý hơn là chỉ một kênh, chứ không dễ hơn. Thay vào đó, đặt một nhãn ngắn hoặc một sơ đồ trên màn hình và nói lời giải thích bằng chính lời của bạn; để dành câu đầy đủ cho phụ đề của video (Chương 16) — thứ sinh ra cho một mục đích khác, khả năng tiếp cận và xem không tiếng, không phải để bạn đọc thành tiếng.</p></div>

<p class="note-ct"><strong>Nối với chương sau:</strong> Bài 22.2 biến kịch bản này thành một bản quay màn hình thật — OBS, công cụ có sẵn của macOS, và những cài đặt giữ cho VS Code vẫn đọc được. Bài 22.3 là nơi phát hiện về hình vẽ tay kiểu Khan ở trên trở thành một quy trình thật với chiếc iPad của bạn.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một khái niệm lập trình nhỏ, có thật mà bạn có thể dạy trong một đoạn (một closure, một lệnh git, một thuộc tính CSS — bất cứ thứ gì bạn thật sự hiểu rõ).</li>
<li>Viết nó ra theo khung 6 bước: Mục tiêu, Vì sao, Khái niệm, Làm mẫu, Luyện, Tóm tắt — một hai câu mỗi bước.</li>
<li>Bấm giờ đọc to với nhịp tự nhiên. Nhắm 4–6 phút; nếu vượt quá 8 phút nhiều, cắt bớt bước Khái niệm hoặc Làm mẫu, đừng cắt bước Luyện.</li>
</ol><p><strong>Đạt khi:</strong> bạn có một kịch bản đoạn viết ra, đọc to dưới 8 phút, đủ cả sáu bước, và Mục tiêu là một câu người xem có thể nhắc lại được với bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Segmenting principle</span><span class="v">Nguyên lý chia đoạn — phát hiện của Mayer rằng các đoạn nhỏ theo nhịp người học thắng một luồng liên tục.</span></div>
<div class="kv"><span class="k">Redundancy principle</span><span class="v">Nguyên lý dư thừa — hình + lời có tường thuật thắng hình + lời + chữ trên màn hình nói y hệt rồi đọc lại.</span></div>
<div class="kv"><span class="k">Engagement</span><span class="v">Mức gắn bó — trong nghiên cứu của Guo, Kim & Rubin, là thời gian một học viên thật sự tiếp tục xem một video.</span></div>
<div class="kv"><span class="k">Khan-style drawing</span><span class="v">Vẽ tay kiểu Khan Academy — vừa nói vừa vẽ tay lời giải thích, giữ chân tốt hơn slide tĩnh.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dựng mỗi đoạn theo Mục tiêu → Vì sao → Khái niệm → Làm mẫu → Luyện → Tóm tắt, viết ra trước khi quay.</li>
<li>Năm nguyên lý của Mayer đổi thật một video quay màn hình: tín hiệu, chia đoạn, mạch lạc, dư thừa, cá nhân hoá.</li>
<li>Guo, Kim & Rubin (2014, 6,9 triệu lượt xem): mức gắn bó rơi mạnh quanh mốc sáu phút bất kể tổng độ dài; talking-head thân mật thắng bài giảng phòng học chỉn chu; hình vẽ tay thắng slide tĩnh.</li>
<li>Cách chữa giống hệt cách Chương 4 đã dạy cho vlog: quay theo đoạn ngắn, có chủ đích — giờ được chứng minh bởi sự chú ý của người xem, không chỉ vì dung lượng thẻ nhớ.</li>
</ul>
<div class="link-card"><a href="https://educationaltechnology.net/mayers-principles-of-multimedia-learning/" target="_blank" rel="noopener">Mayer's Principles of Multimedia Learning — giải thích rõ đủ mười hai nguyên lý</a></div>
<div class="link-card"><a href="https://pure.kaist.ac.kr/en/publications/how-video-production-affects-student-engagement-an-empirical-stud/" target="_blank" rel="noopener">Guo, Kim & Rubin (2014) — "How video production affects student engagement" (L@S)</a></div>
</div>
`,
    },

    /* ─────────────────── 22.2 quay màn hình chuẩn ─────────────────── */
    {
      title: '22.2 — Screen recording done right: OBS, macOS and a clean desk|||22.2 — Quay màn hình chuẩn: OBS, macOS và một bàn làm việc gọn',
      slug: 'cr-22-2-quay-man-hinh',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Dựng scene OBS có màn hình + webcam qua Continuity Camera, cài đúng độ phân giải để còn zoom lúc dựng, và dọn sạch bàn làm việc số trước khi bấm quay.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 22 · Lesson 22.2</span>
<h2>The screen has no shutter speed to worry about — but it has its own six settings you still have to get right</h2>
<p class="lead">Chapter 5 spent an entire chapter on exposure, shutter angle and mains flicker because a camera sensor is at the mercy of real light. A screen recording skips almost all of that — it copies pixels straight out of the frame buffer. What replaces it is a different, smaller list: which tool, which resolution, which webcam, and whether your desktop is fit to be seen. This lesson gives you all four.</p>

<h3>Two tools, and when the simple one is enough</h3>
${slide('cr-22', 6, 'Quay nhanh hay dựng cảnh — chọn công cụ nào')}
<p>macOS's own Screenshot app, opened with <strong>Shift-Command-5</strong>, gives you Record Entire Screen or Record Selected Portion straight away, with an Options menu for choosing a microphone, showing mouse clicks, a start delay and a save location. It is genuinely enough for a quick 90-second clip with no webcam. What it cannot do is combine more than one source — no picture-in-picture webcam, no separate audio levels per source, and no way to switch from "screen" to "just your face" without stopping and starting a new recording.</p>
<p><strong>OBS Studio</strong> (free, open source, from obsproject.com) is built around two ideas the Screenshot app does not have: a <strong>Scene</strong> is a saved layout, and a <strong>Source</strong> is one input inside it — your screen, your webcam, your mic — stacked and positioned however you like. Reach for OBS the moment a recording needs more than one source at once, or you want to switch between "full screen" and "just my face" mid-lecture with a single hotkey.</p>

<h3>Building the scene: screen, webcam, and a mixer that actually shows you the levels</h3>
${slide('cr-22', 7, 'Bố cục scene OBS cho một bài giảng code')}
<p>Your main source is <strong>macOS Screen Capture</strong>, built on Apple's ScreenCaptureKit — add it from the Sources panel's + button, and it lets you capture a whole Display, a single Window, or every visible window of one Application. Audio capture from this source needs macOS 13 or later; on macOS 12.3–12.6 it captures video only. macOS will ask for Screen Recording permission the first time — grant it in System Settings › Privacy & Security › Screen Recording, and restart OBS if the picker still looks empty afterward.</p>
<p>Your second source is <strong>Video Capture Device</strong> — this is how a webcam, including your iPhone acting as one (next section), gets into the scene. On macOS, right-click the source › Properties › Configure Video opens the underlying AVFoundation panel for that camera. One macOS-level limit is worth knowing before you troubleshoot it as an OBS bug: <strong>the OS allows only one app to use a given camera at a time</strong> — if FaceTime, Photo Booth or a video-call app already has your webcam open, OBS will not see it until you close the other app.</p>
<p>Your third source, or really a panel that appears automatically, is the <strong>Audio Mixer</strong> — one fader per audio source, each with its own level meter. This is the thing the Screenshot app genuinely cannot give you: confirmation, while you are still recording, that your USB mic (Lesson 9.2) is actually the input being captured and that it is not clipping.</p>

<h3>Resolution: recording bigger than you deliver</h3>
${slide('cr-22', 9, 'Bảng cài đặt quay màn hình')}
<p>OBS separates two numbers under Settings › Video: <strong>Base (Canvas) Resolution</strong>, matched to your screen's real resolution, and <strong>Output (Scaled) Resolution</strong>, what actually gets written to the file. Set the base resolution to your Mac's native resolution (for example 2560×1440 on many MacBook Pro panels) and the output to 1920×1080, with <strong>Downscale Filter</strong> set to Lanczos — the sharpest of OBS's scaling algorithms, which keeps small monospace text legible after the resize. This is the exact same logic Lesson 5.1 taught you for camera footage: shoot at a resolution higher than what you deliver, so a later crop or zoom (Lesson 17.2's cursor-following keyframe technique) still has real pixels to work with instead of a blown-up, mushy enlargement.</p>
<p>Frame rate is simpler here than for a camera. Screen capture reads frames straight from the display buffer through ScreenCaptureKit — there is no light sensor involved, so the 50 Hz mains-flicker problem from Lesson 5.1 and the "camera filming a monitor's own refresh rate" problem from Lesson 10.2 both simply do not apply. 30fps is enough for content that is mostly static text and the occasional cursor move; save 50/60fps for footage that actually needs smooth motion, like a camera-recorded demo.</p>
<p>Audio stays what Lesson 9.2 already told you it should be for this exact situation — a fixed desk position calls for a <strong>USB mic</strong> at 48kHz. One new detail worth checking: confirm OBS's audio input is actually your USB mic and not the Mac's built-in microphone, which macOS often keeps as the system default. And make sure the mic is far enough from your keyboard that typing does not become a rhythm track under your narration.</p>

<h3>Legibility: bigger code, a visible cursor, and keys on screen</h3>
<p>Bump your editor's font size before you record, not after someone complains in the comments. In VS Code, <strong>Cmd-=</strong> zooms the whole interface (Cmd-0 resets it), or open Settings and search "editor.fontSize" to enlarge only the code text and keep the sidebar compact — either way, aim for roughly 150–200% of your everyday size. Make your cursor easier to track with System Settings › Accessibility › Display › <strong>Pointer size</strong>, and turn on captions of your own keystrokes with <strong>KeyCastr</strong>, a free, open-source tool (<code>brew install --cask keycastr</code>) that needs Input Monitoring permission the first time it runs.</p>

<h3>iPhone as a webcam, framed correctly</h3>
${slide('cr-22', 8, 'iPhone làm webcam qua Continuity Camera')}
<p>Continuity Camera turns your iPhone's rear camera into a Mac webcam over Wi-Fi or a cable. Apple's requirements: macOS Ventura 13 or later and iOS 16 or later at minimum (macOS 14 / iOS 17 unlocks every option), an iPhone XR or newer, both devices signed into the same Apple Account with two-factor authentication, Bluetooth and Wi-Fi on for both, and the phone within about 10 meters of the Mac. Mount it steady, rear cameras facing you and unobstructed — the phone can stay locked while mounted, since Continuity Camera uses the camera hardware directly, not the screen.</p>
<p>Once it is set up, select it the same way as any webcam: add a <strong>Video Capture Device</strong> source in OBS and pick your iPhone's name from the device list. If it does not appear, confirm macOS's camera permission prompt was accepted and restart OBS. Frame it like any close talking-head shot — the correct-framing example in the slide shows what you are aiming for: enough headroom, eyes roughly on the upper third line, not a tiny far-away face or a cropped forehead.</p>

<h3>A clean desk before you press record</h3>
${slide('cr-22', 10, 'Dọn bàn làm việc số trước khi bấm quay')}
<p>Coherence is not only about what you say — Lesson 22.1's coherence principle applies just as much to what is sitting on your screen. Turn on the <strong>Do Not Disturb</strong> Focus from Control Center (or System Settings › Focus) so a message notification does not slide across your code mid-sentence. Close tabs and apps that are not part of the lecture, and hide anything personal on the desktop before you share it with strangers.</p>

<h3>Presenter Overlay: a different tool, for a different situation</h3>
<p>Everything above builds a <em>recorded file</em> you will edit later. If instead you are teaching live over a video call — office hours over FaceTime, Zoom, or a similar app — <strong>Presenter Overlay</strong> does a related job without OBS at all: it keeps your face visible over the screen you are sharing, in a Small movable bubble or a Large mode that frames you alongside the shared content, and works alongside Center Stage. It requires macOS Sonoma 14 or later on a Mac with Apple silicon, and turns on from the screen-sharing icon in the menu bar once a call is already active.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — recording straight at your 1080p delivery resolution because "that is what I'm exporting anyway":</strong> the first time you need to zoom into a tiny error message during editing, there are no extra pixels to zoom into — the image just gets blurrier. Recording at your screen's real, higher resolution and downscaling to 1080p only at export (this lesson's Base vs. Output setting) costs nothing during recording and buys you real cropping room later.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — another app is already holding the camera:</strong> macOS lets only one application use a given camera at a time. If FaceTime, Photo Booth, or a video-call app opened your iPhone or your Mac's built-in camera earlier and is still running, OBS's Video Capture Device source will show a black frame or nothing at all — not an error message. Quit the other app first, then reopen OBS's source properties.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 22.3 adds one more source to this same OBS scene — your iPad, mirrored in — and Lesson 22.4 is where the finished recording actually gets edited and published.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Install OBS if you have not, and build a scene with a macOS Screen Capture source and a Video Capture Device source (built-in camera is fine for the test).</li>
<li>Set Base (Canvas) Resolution to your screen's native resolution, Output (Scaled) Resolution to 1920×1080, Downscale Filter to Lanczos.</li>
<li>Turn on Do Not Disturb, raise VS Code's font size, and record a 60-second test walking through one small function.</li>
</ol><p><strong>Done when:</strong> the Audio Mixer showed your USB mic's level moving while you talked, the exported clip's code is legible without squinting, and no notification appears in the recording.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Scene / Source</span><span class="v">Scene — a saved OBS layout. Source — one input inside it (screen, webcam, mic), positioned and layered freely.</span></div>
<div class="kv"><span class="k">Base (Canvas) / Output (Scaled) Resolution</span><span class="v">The resolution OBS records internally versus the resolution actually written to the exported file.</span></div>
<div class="kv"><span class="k">Continuity Camera</span><span class="v">Apple's feature that lets an iPhone's camera act as a Mac's webcam over Wi-Fi or cable.</span></div>
<div class="kv"><span class="k">ScreenCaptureKit</span><span class="v">Apple's modern screen-recording framework, underneath both OBS's macOS Screen Capture source and the Screenshot app.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Shift-Cmd-5 for a quick single-source clip; OBS's Scenes and Sources when you need a screen + webcam + mixer.</li>
<li>Record at your screen's real resolution, output at 1920×1080 with a Lanczos downscale — the same "shoot bigger, deliver smaller" logic as Chapter 5.</li>
<li>Screen capture reads pixels directly — no 50Hz flicker problem, unlike filming a monitor with a camera (Lesson 10.2).</li>
<li>Continuity Camera needs matching macOS/iOS versions, the same Apple Account, Wi-Fi + Bluetooth, and proximity — then it is just another Video Capture Device source in OBS.</li>
<li>Presenter Overlay is for live video calls, not for files you plan to edit later — different tool, different job.</li>
</ul>
<div class="link-card"><a href="https://obsproject.com/kb/macos-screen-capture-source" target="_blank" rel="noopener">OBS — macOS Screen Capture Source (official documentation)</a></div>
<div class="link-card"><a href="https://support.apple.com/en-us/102546" target="_blank" rel="noopener">Apple Support — Continuity Camera: use iPhone as a webcam for Mac</a></div>
<div class="link-card"><a href="https://github.com/keycastr/keycastr" target="_blank" rel="noopener">KeyCastr — open-source keystroke visualizer</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 22 · Bài 22.2</span>
<h2>Màn hình không có tốc độ màn trập để lo — nhưng nó có sáu cài đặt riêng bạn vẫn phải làm đúng</h2>
<p class="lead">Chương 5 dành nguyên một chương cho phơi sáng, góc màn trập và nhấp nháy điện lưới vì cảm biến máy quay chịu chi phối của ánh sáng thật. Quay màn hình bỏ qua gần hết chuyện đó — nó chép thẳng điểm ảnh ra khỏi bộ đệm khung hình. Thay vào đó là một danh sách khác, ngắn hơn: dùng công cụ nào, độ phân giải bao nhiêu, webcam ra sao, và bàn làm việc số của bạn có xứng để cho người khác thấy không. Bài này cho bạn đủ cả bốn.</p>

<h3>Hai công cụ, và khi nào cái đơn giản là đủ</h3>
${slide('cr-22', 6, 'Quay nhanh hay dựng cảnh — chọn công cụ nào')}
<p>App Screenshot có sẵn của macOS, mở bằng <strong>Shift-Command-5</strong>, cho ngay Record Entire Screen hoặc Record Selected Portion, kèm menu Options để chọn micro, hiện cú bấm chuột, đặt độ trễ trước khi quay và chọn nơi lưu. Nó thật sự đủ cho một clip 90 giây nhanh, không cần webcam. Cái nó KHÔNG làm được là ghép nhiều hơn một nguồn — không có webcam góc nhỏ, không có mức âm riêng cho từng nguồn, và không đổi được từ "màn hình" sang "chỉ mặt bạn" mà không dừng rồi quay một bản ghi mới.</p>
<p><strong>OBS Studio</strong> (miễn phí, mã nguồn mở, tải tại obsproject.com) dựng quanh hai ý mà app Screenshot không có: một <strong>Scene</strong> là một bố cục đã lưu, và một <strong>Source</strong> là một nguồn vào bên trong nó — màn hình, webcam, mic — xếp lớp và đặt vị trí tuỳ ý. Dùng OBS ngay khi một bản quay cần hơn một nguồn cùng lúc, hoặc bạn muốn đổi giữa "toàn màn hình" và "chỉ mặt tôi" giữa bài giảng chỉ bằng một phím tắt.</p>

<h3>Dựng scene: màn hình, webcam, và một mixer thật sự cho bạn thấy mức âm</h3>
${slide('cr-22', 7, 'Bố cục scene OBS cho một bài giảng code')}
<p>Nguồn chính của bạn là <strong>macOS Screen Capture</strong>, dựng trên nền ScreenCaptureKit của Apple — thêm nó từ nút + trong bảng Sources, nó cho bạn thu cả một Display, một cửa sổ (Window) đơn, hoặc mọi cửa sổ đang mở của một ứng dụng (Application). Thu âm từ nguồn này cần macOS 13 trở lên; trên macOS 12.3–12.6 nó chỉ thu hình, không thu tiếng. macOS sẽ hỏi quyền Screen Recording lần đầu — cấp trong System Settings › Privacy & Security › Screen Recording, và khởi động lại OBS nếu danh sách vẫn trống sau đó.</p>
<p>Nguồn thứ hai là <strong>Video Capture Device</strong> — đây là cách webcam, kể cả iPhone làm webcam (mục sau), vào được scene. Trên macOS, chuột phải nguồn › Properties › Configure Video mở đúng bảng AVFoundation của camera đó. Có một giới hạn cấp hệ điều hành đáng biết trước khi bạn tưởng nhầm là lỗi của OBS: <strong>macOS chỉ cho MỘT app dùng một camera tại một thời điểm</strong> — nếu FaceTime, Photo Booth hay một app gọi video khác đang mở sẵn webcam của bạn, OBS sẽ không thấy nó cho tới khi bạn đóng app kia.</p>
<p>Nguồn thứ ba, thật ra là một bảng tự hiện, là <strong>Audio Mixer</strong> — một thanh trượt cho mỗi nguồn âm, mỗi cái có đồng hồ mức riêng. Đây chính là thứ app Screenshot thật sự không cho bạn được: xác nhận, ngay khi đang quay, rằng mic USB (Bài 9.2) của bạn đúng là nguồn đang được thu và nó không bị vỡ tiếng (clip).</p>

<h3>Độ phân giải: quay to hơn cái bạn xuất</h3>
${slide('cr-22', 9, 'Bảng cài đặt quay màn hình')}
<p>OBS tách riêng hai con số trong Settings › Video: <strong>Base (Canvas) Resolution</strong>, khớp với độ phân giải thật của màn hình, và <strong>Output (Scaled) Resolution</strong>, độ phân giải thật sự được ghi vào file. Đặt canvas bằng độ phân giải gốc của Mac (ví dụ 2560×1440 trên nhiều màn MacBook Pro) và output là 1920×1080, với <strong>Downscale Filter</strong> đặt Lanczos — thuật toán thu nhỏ sắc nét nhất của OBS, giữ chữ đơn cách nhỏ vẫn đọc được sau khi thu nhỏ. Đây chính xác là logic Bài 5.1 đã dạy cho cảnh quay bằng camera: quay ở độ phân giải cao hơn cái bạn xuất, để sau này crop hay zoom (kỹ thuật keyframe theo con trỏ của Bài 17.2) vẫn còn điểm ảnh thật để làm việc, thay vì phóng to một ảnh đã mờ nhoè.</p>
<p>FPS ở đây đơn giản hơn hẳn so với máy quay. Quay màn hình đọc thẳng khung hình từ bộ đệm hiển thị qua ScreenCaptureKit — không có cảm biến ánh sáng nào tham gia, nên cả vấn đề nhấp nháy điện 50Hz của Bài 5.1 lẫn vấn đề "quay CAMERA vào tần số quét riêng của màn hình" ở Bài 10.2 đều đơn giản là không áp dụng ở đây. 30fps là đủ cho nội dung phần lớn là chữ tĩnh và thỉnh thoảng di chuyển con trỏ; để dành 50/60fps cho cảnh thật sự cần chuyển động mượt, như một đoạn demo quay bằng camera.</p>
<p>Âm thanh giữ đúng như Bài 9.2 đã nói cho đúng tình huống này — vị trí thu cố định trước bàn cần một <strong>mic USB</strong> ở 48kHz. Một chi tiết mới đáng kiểm: xác nhận nguồn âm trong OBS đúng là mic USB, không phải mic tích hợp của Mac mà macOS hay giữ làm mặc định hệ thống. Và đặt mic đủ xa bàn phím để tiếng gõ không trở thành một lớp nhịp điệu dưới lời giảng của bạn.</p>

<h3>Đọc được: chữ to hơn, con trỏ hiện rõ, và hiện cả phím đang bấm</h3>
<p>Tăng cỡ chữ trình soạn thảo TRƯỚC khi quay, đừng đợi có người phàn nàn trong bình luận. Trong VS Code, <strong>Cmd-=</strong> zoom cả giao diện (Cmd-0 để đặt lại), hoặc mở Settings và gõ "editor.fontSize" để chỉ phóng to riêng chữ code, giữ sidebar gọn — theo cách nào cũng nhắm khoảng 150–200% cỡ bạn dùng hàng ngày. Làm con trỏ dễ theo dõi hơn bằng System Settings › Accessibility › Display › <strong>Pointer size</strong>, và bật hiển thị phím bạn đang bấm bằng <strong>KeyCastr</strong>, công cụ miễn phí, mã nguồn mở (<code>brew install --cask keycastr</code>), lần đầu chạy cần cấp quyền Input Monitoring.</p>

<h3>iPhone làm webcam, khung hình đúng</h3>
${slide('cr-22', 8, 'iPhone làm webcam qua Continuity Camera')}
<p>Continuity Camera biến camera sau của iPhone thành webcam cho Mac qua Wi-Fi hoặc dây cáp. Yêu cầu theo Apple: tối thiểu macOS Ventura 13 và iOS 16 (macOS 14 / iOS 17 mở hết mọi tuỳ chọn), iPhone từ XR trở lên, cả hai máy cùng đăng nhập một Apple Account có xác thực hai yếu tố, Bluetooth và Wi-Fi bật ở cả hai, và điện thoại cách Mac khoảng 10 mét trở lại. Dựng máy ổn định, camera sau hướng về bạn và không bị che — điện thoại vẫn khoá màn hình được khi đã dựng, vì Continuity Camera dùng thẳng phần cứng camera, không cần màn hình sáng.</p>
<p>Khi đã dựng xong, chọn nó y như bất kỳ webcam nào: thêm nguồn <strong>Video Capture Device</strong> trong OBS và chọn tên iPhone trong danh sách thiết bị. Nếu không thấy, kiểm lại đã Cho phép ở hộp thoại quyền camera của macOS hay chưa, rồi khởi động lại OBS. Đóng khung nó như một cảnh talking-head cận cảnh bất kỳ — ví dụ khung đúng trong slide cho bạn thấy mục tiêu: đủ khoảng đầu, mắt nằm khoảng ở đường 1/3 trên, không phải một khuôn mặt bé xíu ở xa hay bị cắt mất trán.</p>

<h3>Dọn bàn làm việc số trước khi bấm quay</h3>
${slide('cr-22', 10, 'Dọn bàn làm việc số trước khi bấm quay')}
<p>Mạch lạc không chỉ nằm ở lời nói — nguyên lý mạch lạc của Bài 22.1 áp dụng y hệt cho những gì đang nằm trên màn hình bạn. Bật Focus <strong>Không làm phiền</strong> từ Control Center (hoặc System Settings › Focus) để một thông báo tin nhắn không trượt ngang qua đoạn code giữa câu bạn đang nói. Đóng các tab và app không thuộc về bài giảng, và ẩn bất cứ thứ gì cá nhân trên desktop trước khi chia sẻ nó với người lạ.</p>

<h3>Presenter Overlay: một công cụ khác, cho một tình huống khác</h3>
<p>Mọi thứ ở trên dựng nên một <em>file đã quay</em> bạn sẽ dựng sau. Nếu thay vào đó bạn đang dạy TRỰC TIẾP qua video call — giờ hỏi đáp qua FaceTime, Zoom, hay app tương tự — <strong>Presenter Overlay</strong> làm một việc gần giống mà không cần OBS chút nào: nó giữ mặt bạn hiện rõ trên màn hình bạn đang chia sẻ, ở dạng bong bóng nhỏ Small di chuyển được hoặc dạng Large đặt bạn cạnh nội dung chia sẻ, và dùng chung được với Center Stage. Nó yêu cầu macOS Sonoma 14 trở lên trên Mac dùng chip Apple silicon, và bật từ biểu tượng chia sẻ màn hình trên thanh menu ngay khi cuộc gọi đã đang diễn ra.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — quay thẳng ở đúng độ phân giải xuất 1080p vì "đằng nào cũng xuất ở đó":</strong> lần đầu tiên bạn cần zoom vào một dòng thông báo lỗi bé xíu lúc dựng, sẽ không còn điểm ảnh thừa nào để zoom vào — hình chỉ mờ thêm. Quay ở độ phân giải thật, cao hơn, của màn hình rồi mới thu nhỏ về 1080p lúc xuất (cài đặt Base vs Output của bài này) không tốn gì lúc quay và mua được chỗ crop thật sau này.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — một app khác đang giữ camera:</strong> macOS chỉ cho một ứng dụng dùng một camera tại một thời điểm. Nếu FaceTime, Photo Booth, hay một app gọi video đã mở iPhone hoặc camera tích hợp của Mac từ trước và vẫn đang chạy, nguồn Video Capture Device của OBS sẽ hiện khung đen hoặc không hiện gì cả — không có thông báo lỗi nào cả. Đóng app kia trước, rồi mở lại properties của nguồn trong OBS.</p></div>

<p class="note-ct"><strong>Nối với chương sau:</strong> Bài 22.3 thêm một nguồn nữa vào đúng scene OBS này — iPad của bạn, phản chiếu vào — và Bài 22.4 là nơi bản quay đã xong thật sự được dựng và đăng lên.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Cài OBS nếu chưa có, dựng một scene gồm nguồn macOS Screen Capture và nguồn Video Capture Device (webcam tích hợp cũng được cho bài thử này).</li>
<li>Đặt Base (Canvas) Resolution bằng độ phân giải gốc màn hình, Output (Scaled) Resolution 1920×1080, Downscale Filter Lanczos.</li>
<li>Bật Không làm phiền, tăng cỡ chữ VS Code, quay thử 60 giây đi qua một hàm nhỏ.</li>
</ol><p><strong>Đạt khi:</strong> Audio Mixer cho thấy mức mic USB của bạn nhảy khi bạn nói, đoạn clip xuất ra đọc được code mà không phải nheo mắt, và không có thông báo hệ thống nào lọt vào bản quay.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Scene / Source</span><span class="v">Scene — một bố cục OBS đã lưu. Source — một nguồn vào bên trong nó (màn hình, webcam, mic), đặt vị trí và xếp lớp tự do.</span></div>
<div class="kv"><span class="k">Base (Canvas) / Output (Scaled) Resolution</span><span class="v">Độ phân giải OBS quay bên trong so với độ phân giải thật sự được ghi vào file xuất.</span></div>
<div class="kv"><span class="k">Continuity Camera</span><span class="v">Tính năng của Apple cho camera iPhone làm webcam của Mac qua Wi-Fi hoặc dây cáp.</span></div>
<div class="kv"><span class="k">ScreenCaptureKit</span><span class="v">Nền tảng quay màn hình hiện đại của Apple, nằm dưới cả nguồn macOS Screen Capture của OBS lẫn app Screenshot.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Shift-Cmd-5 cho một clip nhanh, một nguồn; Scene và Source của OBS khi cần màn hình + webcam + mixer.</li>
<li>Quay ở độ phân giải thật của màn hình, xuất ở 1920×1080 với Downscale Filter Lanczos — cùng logic "quay to, xuất nhỏ" như Chương 5.</li>
<li>Quay màn hình đọc thẳng điểm ảnh — không bị nhấp nháy 50Hz, khác hẳn việc quay CAMERA vào một màn hình (Bài 10.2).</li>
<li>Continuity Camera cần đúng phiên bản macOS/iOS, cùng Apple Account, Wi-Fi + Bluetooth, và ở gần nhau — sau đó chỉ là một nguồn Video Capture Device bình thường trong OBS.</li>
<li>Presenter Overlay dành cho video call trực tiếp, không phải cho file bạn định dựng sau — hai công cụ, hai việc khác nhau.</li>
</ul>
<div class="link-card"><a href="https://obsproject.com/kb/macos-screen-capture-source" target="_blank" rel="noopener">OBS — macOS Screen Capture Source (tài liệu chính thức)</a></div>
<div class="link-card"><a href="https://support.apple.com/en-us/102546" target="_blank" rel="noopener">Apple Support — Continuity Camera: dùng iPhone làm webcam cho Mac</a></div>
<div class="link-card"><a href="https://github.com/keycastr/keycastr" target="_blank" rel="noopener">KeyCastr — công cụ hiện phím bấm, mã nguồn mở</a></div>
</div>
`,
    },

    /* ─────────────────── 22.3 iPad làm bảng trắng ─────────────────── */
    {
      title: '22.3 — iPad as a whiteboard: Pencil strokes to a recorded scene|||22.3 — iPad làm bảng trắng: từ nét Pencil tới một cảnh đã quay',
      slug: 'cr-22-3-ipad-bang-trang',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Biến iPad + Pencil thành bảng trắng thật: quay màn hình tại chỗ, hoặc phản chiếu sang Mac để ghép cùng camera mặt trong OBS.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 22 · Lesson 22.3</span>
<h2>Lesson 22.1 cited research that hand-drawn explanations out-engage static slides — your iPad is the whiteboard that proves it</h2>
<p class="lead">Guo, Kim and Rubin's finding was specific: Khan-style tablet drawing, someone narrating while hand-drawing an idea, engaged students more than static slides did. You already own the device for it — the iPad Pro M5 and Pencil that Lesson 0.2 assigned to storyboards and teleprompting. This lesson gives it a third job: a whiteboard you can either record on its own, or mirror live into the OBS scene you built in Lesson 22.2.</p>

<h3>Two ways to get the drawing into a video, not one</h3>
<p>There are genuinely two separate workflows here, and picking the wrong one wastes an evening.</p>
<div class="kv-grid">
<div class="kv"><span class="k">Record on the iPad itself</span><span class="v">Produces a standalone iPad screen recording you edit in later — simplest setup, no network dependency, but your face is not in the same file unless you add it in the edit.</span></div>
<div class="kv"><span class="k">Mirror to the Mac, capture in OBS</span><span class="v">The iPad becomes one more Source in the same scene as your webcam — you get drawing and face together, live, in one take, at the cost of a wireless link that can lag.</span></div>
</div>

<h3>Recording the iPad on its own</h3>
<p>iPadOS records its own screen the same way iPhone does: open Control Center, press and hold the grey Record button (or tap it and wait through the three-second countdown), and add Screen Recording to Control Center first if you don't see it there. Tap the <strong>Microphone</strong> button in that same menu before you start if you want your narration captured along with the drawing — otherwise it records silently. Stop from Control Center or by tapping the red status bar at the top; the clip lands in the Photos app, ready to hand to DaVinci Resolve or CapCut like any other footage.</p>

<h3>Mirroring the iPad into the same OBS scene as your face</h3>
${slide('cr-22', 12, 'iPad làm bảng trắng — luồng ghép vào cảnh quay')}
<p>AirPlay is what carries the iPad's screen to the Mac. On the Mac first: System Settings › General › AirDrop & Continuity, turn on <strong>AirPlay Receiver</strong>, and choose who is allowed to stream to it under "Allow AirPlay for" — everyone, or just your own Apple Account, depending on where you are working. On the iPad: open Control Center, tap Screen Mirroring, and pick your Mac from the list. Once it is mirroring, the iPad's screen shows up as a window on the Mac — capture that window with a second <strong>macOS Screen Capture</strong> source in OBS (Lesson 22.2), set to Window rather than Display, sitting in the same scene as your webcam source.</p>
<p>Both devices need to be on the same Wi-Fi network (or signed into the same Apple Account) for this to work at all, and a crowded network — a classroom, a shared apartment router at peak hours — is the most common reason mirroring lags or drops mid-lecture. If wireless is unreliable where you are, connecting the iPad by cable and treating it as an external display is the steadier fallback, at the cost of one more cable on your desk.</p>

<h3>Three apps to actually draw in</h3>
${slide('cr-22', 13, 'Ba app viết tay trên iPad')}
<p><strong>Freeform</strong> is Apple's own app, free and already installed on iPadOS — an infinite canvas where the Pencil draws or writes by default, with no fixed page to run out of. It is genuinely enough for most lecture diagrams: a quick sketch of how a request flows through your backend, or a data structure drawn as you explain it. <strong>GoodNotes</strong> and <strong>Notability</strong> are paid third-party apps (each with a free tier and paid plans that change over time — check current pricing in the App Store before buying) built around fixed pages, PDF annotation and nicer handwriting rendering; reach for one of them when you want the drawing saved as a page you will reuse, like an annotated PDF handed out after the lecture. Notability adds synced audio recording to its notes, which suits a "draw while narrating" lecture particularly well. <strong>Keynote</strong>, Apple's free presentation app, is worth keeping in the rotation too — for diagrams you have partly prepared in advance and then annotate live with the Pencil, rather than drawing from a blank canvas every time.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — starting to record before checking the Pencil's current page size and tool settings:</strong> discovering mid-explanation that the canvas is zoomed to a tiny corner, or that the last session left the pen on a thin red line instead of your usual marker, forces an awkward on-camera fumble. Open the app and glance at the canvas and tool state before you hit record, the same way you would check camera settings in Chapter 6 before a shoot.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — trusting AirPlay mirroring on a crowded Wi-Fi network for a long, uninterrupted take:</strong> a dropped or laggy mirror mid-sentence is much harder to salvage in the edit than a dropped webcam, because the drawing itself — not just your face — is the content. For anything longer than a couple of minutes, do a short test recording first on the actual network you will use, or fall back to a cable connection.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Lesson 22.4 is where this footage — screen, webcam, and now iPad drawing — actually gets cut together and published, using techniques you already learned in Chapters 14, 16 and 17.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Open Freeform (or GoodNotes/Notability if you already own one) and check the Pencil's current tool and line thickness.</li>
<li>Mirror the iPad to your Mac via AirPlay, and add it as a second macOS Screen Capture Window source in the OBS scene from Lesson 22.2.</li>
<li>Record one minute: draw a small diagram for the concept you scripted in Lesson 22.1's practice, narrating as you draw.</li>
</ol><p><strong>Done when:</strong> the mirrored drawing and your webcam both appear in the same OBS recording, and you can point to one moment where you noticed lag or a dropped frame — or confirm there was none.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">AirPlay</span><span class="v">Apple's wireless protocol for streaming a screen (or audio/video) from one device to another over Wi-Fi.</span></div>
<div class="kv"><span class="k">Screen mirroring</span><span class="v">Phản chiếu màn hình — showing one device's screen live on another, here iPad to Mac.</span></div>
<div class="kv"><span class="k">AirPlay Receiver</span><span class="v">The Mac-side setting (System Settings › General › AirDrop & Continuity) that must be on before it can accept a mirrored screen.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Two workflows: record the iPad's own screen standalone, or mirror it into the same OBS scene as your webcam for a live, combined take.</li>
<li>Control Center's Screen Recording (with the Microphone toggle on) captures the iPad alone; AirPlay Receiver on the Mac plus Screen Mirroring on the iPad feeds a live OBS source.</li>
<li>Freeform is free and built in; GoodNotes and Notability are paid alternatives for fixed pages, PDF annotation and nicer handwriting.</li>
<li>Check your Pencil's tool state before recording, and treat AirPlay reliability as untested until you have actually recorded a test take on your real network.</li>
</ul>
<div class="link-card"><a href="https://support.apple.com/en-us/102661" target="_blank" rel="noopener">Apple Support — Use AirPlay to stream video or mirror the screen of your iPhone or iPad</a></div>
<div class="link-card"><a href="https://support.apple.com/guide/ipad/get-started-with-freeform-ipad9c59637d/ipados" target="_blank" rel="noopener">Apple Support — Get started with Freeform on iPad</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 22 · Bài 22.3</span>
<h2>Bài 22.1 đã trích một nghiên cứu rằng hình vẽ tay giữ chân tốt hơn slide tĩnh — iPad của bạn là bảng trắng chứng minh điều đó</h2>
<p class="lead">Phát hiện của Guo, Kim và Rubin rất cụ thể: hình vẽ tay kiểu Khan Academy, ai đó vừa vẽ tay vừa tường thuật một ý, giữ chân học viên tốt hơn slide tĩnh. Bạn đã có sẵn máy cho việc đó — iPad Pro M5 và Pencil mà Bài 0.2 giao cho storyboard và teleprompter. Bài này giao cho nó việc thứ ba: một bảng trắng bạn có thể quay riêng, hoặc phản chiếu trực tiếp vào đúng scene OBS bạn đã dựng ở Bài 22.2.</p>

<h3>Hai cách đưa hình vẽ vào video, không phải một</h3>
<p>Thật sự có hai quy trình tách biệt ở đây, và chọn nhầm cái làm phí cả một buổi tối.</p>
<div class="kv-grid">
<div class="kv"><span class="k">Quay ngay trên iPad</span><span class="v">Cho ra một bản quay màn hình iPad độc lập, dựng sau — cài đặt đơn giản nhất, không phụ thuộc mạng, nhưng mặt bạn không nằm trong cùng file trừ khi bạn thêm ở khâu dựng.</span></div>
<div class="kv"><span class="k">Phản chiếu sang Mac, thu trong OBS</span><span class="v">iPad trở thành một Source nữa trong cùng scene với webcam của bạn — có cả hình vẽ lẫn mặt bạn, trực tiếp, trong một take, đổi lại một đường truyền không dây có thể bị trễ.</span></div>
</div>

<h3>Quay ngay trên iPad</h3>
<p>iPadOS tự quay màn hình của chính nó y như iPhone: mở Control Center, nhấn giữ nút Record màu xám (hoặc chạm rồi đợi hết đếm ngược 3 giây), và thêm Screen Recording vào Control Center trước nếu chưa thấy nó ở đó. Chạm nút <strong>Microphone</strong> ngay trong menu đó trước khi bắt đầu nếu bạn muốn lời tường thuật được thu cùng hình vẽ — không thì nó quay câm. Dừng từ Control Center hoặc chạm vào thanh trạng thái đỏ trên đầu màn hình; clip rơi vào app Photos, sẵn sàng đưa vào DaVinci Resolve hay CapCut như bất kỳ cảnh quay nào khác.</p>

<h3>Phản chiếu iPad vào đúng scene OBS với mặt bạn</h3>
${slide('cr-22', 12, 'iPad làm bảng trắng — luồng ghép vào cảnh quay')}
<p>AirPlay là thứ mang màn hình iPad sang Mac. Trên Mac trước: System Settings › General › AirDrop & Continuity, bật <strong>AirPlay Receiver</strong>, và chọn ai được phép phát tới nó ở mục "Allow AirPlay for" — mọi người, hay chỉ đúng Apple Account của bạn, tuỳ nơi bạn đang làm việc. Trên iPad: mở Control Center, chạm Screen Mirroring, chọn Mac trong danh sách. Khi đã phản chiếu, màn hình iPad hiện thành một cửa sổ trên Mac — thu đúng cửa sổ đó bằng một nguồn <strong>macOS Screen Capture</strong> thứ hai trong OBS (Bài 22.2), đặt kiểu Window thay vì Display, nằm cùng scene với nguồn webcam.</p>
<p>Cả hai máy cần cùng mạng Wi-Fi (hoặc cùng đăng nhập một Apple Account) thì việc này mới chạy được, và một mạng đông người dùng — phòng học, router chung nhà giờ cao điểm — là lý do phổ biến nhất khiến việc phản chiếu bị trễ hay rớt giữa bài giảng. Nếu Wi-Fi nơi bạn ở không đáng tin, nối iPad bằng dây và coi nó như một màn hình mở rộng là phương án lùi ổn định hơn, đổi lại thêm một sợi dây trên bàn.</p>

<h3>Ba app để thật sự vẽ trong đó</h3>
${slide('cr-22', 13, 'Ba app viết tay trên iPad')}
<p><strong>Freeform</strong> là app của chính Apple, miễn phí và đã cài sẵn trên iPadOS — một canvas vô hạn nơi Pencil mặc định vẽ hoặc viết chữ, không có trang cố định để hết chỗ. Nó thật sự đủ cho phần lớn sơ đồ bài giảng: một phác thảo nhanh cách một request đi qua backend của bạn, hay một cấu trúc dữ liệu vẽ ra ngay lúc bạn đang giải thích. <strong>GoodNotes</strong> và <strong>Notability</strong> là app trả phí của bên thứ ba (mỗi app có bản miễn phí và gói trả phí, giá đổi theo thời gian — kiểm giá hiện hành trong App Store trước khi mua) dựng quanh trang cố định, chú thích PDF và chữ viết tay hiển thị đẹp hơn; dùng một trong hai khi bạn muốn hình vẽ được lưu thành một trang dùng lại được, như một file PDF có chú thích phát cho học viên sau bài giảng. Notability còn ghi âm đồng bộ với ghi chú, hợp riêng cho kiểu bài giảng "vừa vẽ vừa tường thuật". <strong>Keynote</strong>, app trình chiếu miễn phí của Apple, cũng đáng giữ trong vòng quay — cho những sơ đồ bạn đã chuẩn bị sẵn một phần rồi chú thích trực tiếp bằng Pencil, thay vì vẽ từ canvas trắng mỗi lần.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — bắt đầu quay trước khi kiểm cỡ trang và cài đặt bút hiện tại của Pencil:</strong> phát hiện giữa lúc đang giảng rằng canvas đang zoom vào một góc bé xíu, hay phiên trước để lại bút ở nét đỏ mỏng thay vì cây bút đánh dấu quen dùng, buộc bạn phải lóng ngóng sửa ngay trước ống kính. Mở app và liếc qua trạng thái canvas và công cụ trước khi bấm quay, giống hệt cách bạn kiểm cài đặt máy quay ở Chương 6 trước một buổi quay.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tin tưởng phản chiếu AirPlay trên Wi-Fi đông người cho một đoạn dài không ngắt quãng:</strong> một cú rớt hay trễ hình giữa câu khó cứu ở khâu dựng hơn nhiều so với rớt webcam, vì chính hình vẽ — không chỉ mặt bạn — là nội dung. Với đoạn dài hơn vài phút, hãy quay thử một đoạn ngắn trên đúng mạng bạn sẽ dùng trước, hoặc lùi về nối dây.</p></div>

<p class="note-ct"><strong>Nối với chương sau:</strong> Bài 22.4 là nơi cảnh quay này — màn hình, webcam, và giờ có cả hình vẽ trên iPad — thật sự được cắt ghép và đăng lên, dùng đúng kỹ thuật bạn đã học ở Chương 14, 16 và 17.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở Freeform (hoặc GoodNotes/Notability nếu đã có) và kiểm công cụ, độ dày nét bút hiện tại của Pencil.</li>
<li>Phản chiếu iPad sang Mac qua AirPlay, thêm nó làm nguồn macOS Screen Capture Window thứ hai trong scene OBS từ Bài 22.2.</li>
<li>Quay một phút: vẽ một sơ đồ nhỏ cho khái niệm bạn đã viết kịch bản ở phần thực hành Bài 22.1, vừa vẽ vừa tường thuật.</li>
</ol><p><strong>Đạt khi:</strong> hình vẽ phản chiếu và webcam của bạn cùng xuất hiện trong một bản quay OBS, và bạn chỉ ra được một khoảnh khắc có trễ hay rớt hình — hoặc xác nhận không có.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">AirPlay</span><span class="v">Giao thức không dây của Apple để phát màn hình (hay âm thanh/video) từ máy này sang máy khác qua Wi-Fi.</span></div>
<div class="kv"><span class="k">Screen mirroring</span><span class="v">Phản chiếu màn hình — hiện trực tiếp màn hình của một máy lên máy khác, ở đây là iPad sang Mac.</span></div>
<div class="kv"><span class="k">AirPlay Receiver</span><span class="v">Cài đặt phía Mac (System Settings › General › AirDrop & Continuity) phải bật trước thì mới nhận được màn hình phản chiếu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hai quy trình: quay riêng màn hình của chính iPad, hoặc phản chiếu vào đúng scene OBS với webcam để có một take trực tiếp, ghép sẵn.</li>
<li>Screen Recording trong Control Center (bật nút Microphone) thu riêng iPad; AirPlay Receiver trên Mac cộng Screen Mirroring trên iPad nuôi một nguồn OBS trực tiếp.</li>
<li>Freeform miễn phí và cài sẵn; GoodNotes và Notability là lựa chọn trả phí cho trang cố định, chú thích PDF và chữ viết tay đẹp hơn.</li>
<li>Kiểm trạng thái công cụ Pencil trước khi quay, và coi độ ổn định AirPlay là chưa kiểm chứng cho tới khi bạn thật sự quay thử trên đúng mạng của mình.</li>
</ul>
<div class="link-card"><a href="https://support.apple.com/en-us/102661" target="_blank" rel="noopener">Apple Support — Dùng AirPlay để phát video hoặc phản chiếu màn hình iPhone/iPad</a></div>
<div class="link-card"><a href="https://support.apple.com/guide/ipad/get-started-with-freeform-ipad9c59637d/ipados" target="_blank" rel="noopener">Apple Support — Bắt đầu với Freeform trên iPad</a></div>
</div>
`,
    },

    /* ─────────────────── 22.4 dựng & đưa lên khoá học ─────────────────── */
    {
      title: '22.4 — Editing the lecture, then publishing it to three tracks|||22.4 — Dựng bài giảng, rồi đưa lên ba luồng video của cuongthai.com',
      slug: 'cr-22-4-dung-dua-len-khoa-hoc',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Dựng bài giảng gọn, chèn chapter YouTube đúng luật, và đường thật một video tự quay đi qua để lên luồng VI/EN của một bài học trên cuongthai.com.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 22 · Lesson 22.4</span>
<h2>The edit is mostly Chapters 14, 16 and 17 applied to a new kind of footage — the genuinely new part is what happens after export</h2>
<p class="lead">You already know how to cut, how to add a callout arrow, and how to zoom into a detail with a keyframe. This lesson does not re-teach any of that — it tells you exactly where each technique applies to a lecture, what YouTube actually requires for chapters to work, and then walks through the one thing nothing earlier in this course has covered: the real mechanism that gets a video you recorded onto the VN/EN switch a learner sees on cuongthai.com.</p>

<h3>Editing a lecture is the same craft, aimed at a different goal</h3>
<p>Lesson 22.1's segments give you natural cut points — assemble them in the order you scripted them, then apply Chapter 14's own editing process (assembly → rough cut → fine cut → picture lock) per segment rather than to one long timeline. Three techniques you already own do almost all the remaining work:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Cutting out mistakes</span><span class="v">A flubbed line becomes a jump cut or a hard cut at the restart point — Lesson 3.4's own habit ("pause two seconds, say the whole sentence again") is what makes this a clean edit instead of a mid-word splice.</span></div>
<div class="kv"><span class="k">Callouts on the code</span><span class="v">Arrows, boxes and highlights around the exact line you are discussing — this is Lesson 16.2's territory, and it is also Mayer's signaling principle from Lesson 22.1 made literal.</span></div>
<div class="kv"><span class="k">Zooming into a detail</span><span class="v">A keyframed scale-and-position move that pushes in on a small error message or a specific parameter — Lesson 17.2's cursor-following keyframe technique, applied to code instead of a UI.</span></div>
</div>
<p>The one genuinely new habit is dropping a marker at the start of every segment as you edit — DaVinci Resolve's marker tool (M, already covered in Lesson 13.2) works well here, because those marker timestamps are exactly what you will type into YouTube's chapter list in a moment.</p>
${slide('cr-22', 5, 'Cấu trúc một bài giảng — chia đoạn')}
<p>This is why Lesson 22.1's six-step shape was worth designing before you ever recorded: a script built from labeled segments turns into edit markers for free, and those markers turn into a chapter list for free. Skip the planning step and you end up reverse-engineering chapter boundaries from a timeline that never had any — a much slower way to arrive at the same list.</p>

<h3>YouTube chapters have a real, strict format — get it wrong and none of them show</h3>
<p>YouTube's own rule is specific and unforgiving: your first timestamp must be <strong>0:00</strong>, you need <strong>at least three</strong> timestamps listed in ascending order, and each chapter must be <strong>at least 10 seconds</strong> long. All of this goes in the video's Description, one line per chapter:</p>
<pre><code class="language-plaintext">0:00 Intro
2:15 Setting up OBS
7:40 Drawing on the iPad
15:20 Exporting and publishing</code></pre>
<div class="callout danger"><p><strong>It is all-or-nothing:</strong> two chapters, or a chapter only nine seconds after the previous one, does not just fail to show that one chapter — YouTube does not activate the chapter bar at all. A common failure looks like "I added chapters and nothing changed"; the actual bug is almost always one of these three rules.</p></div>

<h3>Short clips from the same footage — the repurposing pyramid, applied here</h3>
<p>Lesson 2.4 already gave you the shape for this: one long video becomes several short ones becomes a written post. A 20-minute lecture rarely needs a new shoot to feed your short-form channel — the moment your webcam reacts to a bug finally getting fixed, or the 90 seconds where you explain the one idea the whole lecture hinges on, is often a complete short on its own. Pull it, reframe it vertically per Chapter 20, and it costs you editing time, not a new recording session.</p>

<h3>What actually happens when a video reaches your lesson page</h3>
${slide('cr-22', 14, 'Từ file dựng xong tới 3 luồng VI/EN/YT')}
<p>Lesson 0.1 told you cuongthai.com carries up to three recordings of the same lesson — VN, EN, and a curated YouTube video — with a switcher above the video frame. Here is exactly how a finished file becomes one of those three, described accurately rather than guessed at, since this is the one part of this chapter that lives in your own site's code instead of in Apple's or OBS's documentation.</p>
<p>Each lesson stores three independent video slots in the database, plus one setting for which track opens first: a <strong>VI</strong> slot, an <strong>EN</strong> slot, and a <strong>YT</strong> slot, each with its own URL and a platform flag — <strong>EMBED</strong> for a YouTube link, or <strong>DIRECT</strong> for a file served straight from the site's own storage (Cloudflare R2) through a short-lived signed URL. There are two realistic ways an exported file gets into one of these slots:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">A</span><span class="lz-t">The admin lesson editor</span><span class="lz-d">Open the lesson in the site's admin panel and either paste a YouTube link into the VI or EN field (EMBED), or choose Direct and upload the exported file straight to R2 storage (DIRECT). This is the day-to-day path for one lesson at a time.</span></div>
<div class="lz-step"><span class="lz-k">B</span><span class="lz-t">The course video map + seed script</span><span class="lz-d">A single data file lists a &#123;yt, credit, vi?, en?&#125; entry per lesson slug for the whole course; running the seed script attaches all of them in one pass. This is mainly how the curated YT fallback got attached across every lesson before any self-recorded video existed — a separate script cross-checks each YouTube link is still alive and embeddable before that seed can run.</span></div>
</div>
<p>Whichever slot has a URL, the switcher shown to a learner offers all three tabs, greys out and labels "coming soon" the ones with nothing attached yet, and remembers a returning learner's last choice in their browser. The <strong>default track</strong> setting decides which tab opens first for someone new — pointing it at VI once your own recording exists is what actually moves a lesson from "borrowed YouTube video" to "your own voice teaching it."</p>
<div class="callout warn"><p><strong>What this does NOT do automatically:</strong> there is no pipeline that watches a folder and publishes a video for you. Exporting the file, from Lesson 22.4's own edit, is only the first half — nothing appears on the learn page until a URL is actually attached through one of the two paths above. Finishing the edit and finishing the publish are two separate steps, done by two different people or at two different times, and it is worth being explicit about which one you have actually completed.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Trap — adding two YouTube chapter timestamps, or spacing them less than 10 seconds apart, then wondering why the chapter bar never appears:</strong> YouTube's requirement is exact — 0:00 first, at least three ascending timestamps, each chapter at least 10 seconds — and it is enforced as a whole, not per chapter. If the bar is missing entirely, check these three rules before assuming a platform bug.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Trap — assuming a finished export is already "live" on the site:</strong> a rendered file sitting on your Mac or even uploaded to your own YouTube channel has not reached a single learner yet. It becomes visible only once its URL is attached to the lesson's VI, EN or YT slot — through the admin editor or the course video map — and the site's own team, not this course, owns that step in production.</p></div>

<p class="note-ct"><strong>Connects to next:</strong> Chapter 23 takes this exact VI/EN split further — recording a genuinely separate English version rather than just captioning the Vietnamese one — and Chapter 24 covers the export settings this lesson deliberately kept light.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Take the one-minute test recording from Lesson 22.3's practice and drop a marker at its start in your editor.</li>
<li>Write a three-line YouTube chapter list for it in the correct format, starting at 0:00, each chapter at least 10 seconds apart.</li>
<li>For a real lesson you care about, say out loud which of the two attach-paths (admin editor vs. course video map) you would use, and why — based on whether the footage already lives on YouTube or needs to stay private on R2.</li>
</ol><p><strong>Done when:</strong> your chapter list passes all three YouTube rules, and you can explain in one sentence why "exported" and "published" are not the same event on this site.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Chapter marker</span><span class="v">A named timestamp in your editor (and later, in a YouTube description) marking where one segment of a video begins.</span></div>
<div class="kv"><span class="k">EMBED / DIRECT</span><span class="v">This site's two ways to serve a lesson video: an embedded YouTube player, or a file streamed straight from its own storage.</span></div>
<div class="kv"><span class="k">Default video track</span><span class="v">The VI/EN/YT choice that opens first for a learner who has not picked one before.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Editing a lecture reuses Chapters 14, 16 and 17 — cutting, callouts, keyframed zoom — applied per scripted segment instead of one long timeline.</li>
<li>YouTube chapters need 0:00 first, at least three ascending timestamps, each at least 10 seconds — miss any rule and the whole chapter bar fails to appear.</li>
<li>A lesson stores three independent video slots (VI/EN/YT) plus a default-track setting; a URL reaches one of them through the admin editor (EMBED a YouTube link or DIRECT-upload to R2) or the course video map + seed script.</li>
<li>Exporting a file and publishing it are two separate steps — nothing reaches a learner until a URL is actually attached to the lesson.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9884579?hl=en" target="_blank" rel="noopener">YouTube Help — Add video chapters</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 22 · Bài 22.4</span>
<h2>Khâu dựng phần lớn là Chương 14, 16 và 17 áp vào một kiểu cảnh quay mới — phần thật sự mới nằm ở chuyện xảy ra SAU khi xuất</h2>
<p class="lead">Bạn đã biết cách cắt, cách thêm mũi tên callout, và cách zoom vào một chi tiết bằng keyframe. Bài này không dạy lại bất cứ điều nào trong số đó — nó chỉ đúng chỗ mỗi kỹ thuật áp dụng vào một bài giảng, YouTube thật sự đòi hỏi gì để chapter chạy được, rồi đi qua đúng một thứ chưa chương nào trước đó trong khoá này nói tới: cơ chế thật đưa một video bạn vừa quay lên nút chuyển VN/EN mà một học viên thấy trên cuongthai.com.</p>

<h3>Dựng bài giảng vẫn là nghề cũ, nhắm vào một mục tiêu khác</h3>
<p>Các đoạn từ Bài 22.1 cho bạn sẵn các điểm cắt tự nhiên — ghép chúng theo đúng thứ tự bạn đã viết kịch bản, rồi áp quy trình dựng của chính Chương 14 (assembly → rough cut → fine cut → picture lock) cho từng đoạn thay vì cho một timeline dài. Ba kỹ thuật bạn đã có làm gần hết phần việc còn lại:</p>
<div class="kv-grid">
<div class="kv"><span class="k">Cắt lỗi</span><span class="v">Một câu nói vấp trở thành một jump cut hay hard cut ngay điểm nói lại — chính thói quen của Bài 3.4 ("dừng 2 giây, nói lại cả câu") là thứ làm cú cắt này sạch, thay vì cắt giữa chừng một từ.</span></div>
<div class="kv"><span class="k">Callout trên code</span><span class="v">Mũi tên, khung khoanh và tô sáng đúng dòng đang giảng — đây là địa hạt của Bài 16.2, và cũng chính là nguyên lý tín hiệu của Mayer ở Bài 22.1, hiện ra thành hình thật.</span></div>
<div class="kv"><span class="k">Zoom vào chi tiết</span><span class="v">Một cú keyframe scale-và-vị-trí đẩy vào một dòng thông báo lỗi nhỏ hay một tham số cụ thể — kỹ thuật keyframe theo con trỏ của Bài 17.2, áp vào code thay vì một giao diện.</span></div>
</div>
<p>Thói quen thật sự mới duy nhất là thả một marker vào đầu mỗi đoạn khi dựng — công cụ marker của DaVinci Resolve (phím M, đã học ở Bài 13.2) hợp việc này, vì đúng những mốc thời gian đó là thứ bạn sẽ gõ vào danh sách chapter của YouTube ngay sau đây.</p>
${slide('cr-22', 5, 'Cấu trúc một bài giảng — chia đoạn')}
<p>Đây chính là lý do khung 6 bước của Bài 22.1 đáng để thiết kế trước cả khi bạn quay: một kịch bản dựng từ các đoạn đã dán nhãn tự động biến thành marker lúc dựng, và những marker đó tự động biến thành danh sách chapter. Bỏ qua bước lên kế hoạch, bạn sẽ phải dò ngược ranh giới chapter từ một timeline chưa từng có ranh giới nào — cách chậm hơn nhiều để tới cùng một danh sách.</p>

<h3>Chapter YouTube có định dạng thật, nghiêm ngặt — sai là không hiện cái nào cả</h3>
<p>Luật của chính YouTube rất cụ thể và không khoan nhượng: mốc đầu tiên phải là <strong>0:00</strong>, bạn cần <strong>tối thiểu ba</strong> mốc thời gian xếp theo thứ tự tăng dần, và mỗi chương phải dài <strong>tối thiểu 10 giây</strong>. Tất cả nằm trong phần Mô tả (Description) của video, mỗi chương một dòng:</p>
<pre><code class="language-plaintext">0:00 Mở đầu
2:15 Thiết lập OBS
7:40 Vẽ trên iPad
15:20 Xuất và đăng</code></pre>
<div class="callout danger"><p><strong>Là tất cả hoặc không gì cả:</strong> chỉ hai chương, hay một chương cách chương trước chưa tới 10 giây, không chỉ làm mất riêng chương đó — YouTube không kích hoạt cả thanh chapter luôn. Lỗi hay gặp trông như "mình đã thêm chapter mà chẳng thấy gì đổi"; nguyên nhân thật gần như luôn là một trong ba luật này.</p></div>

<h3>Cắt video ngắn từ đúng cảnh quay này — kim tự tháp tái sử dụng, áp dụng ở đây</h3>
<p>Bài 2.4 đã cho bạn sẵn khung cho việc này: một video dài thành nhiều video ngắn thành một bài viết. Một bài giảng 20 phút hiếm khi cần quay riêng để nuôi kênh video ngắn của bạn — khoảnh khắc webcam bắt được phản ứng của bạn khi con bug cuối cùng cũng hết, hay 90 giây bạn giải thích đúng ý cả bài giảng xoay quanh, thường tự nó đã là một video ngắn trọn vẹn. Cắt nó ra, đóng khung lại theo chiều dọc theo Chương 20, và cái giá là thời gian dựng, không phải một buổi quay mới.</p>

<h3>Chuyện thật sự xảy ra khi một video tới được trang bài học của bạn</h3>
${slide('cr-22', 14, 'Từ file dựng xong tới 3 luồng VI/EN/YT')}
<p>Bài 0.1 đã nói cuongthai.com mang được tối đa ba bản quay của cùng một bài học — VN, EN, và một video YouTube tuyển chọn — với một nút chuyển phía trên khung video. Đây là cách một file đã dựng xong thật sự trở thành một trong ba bản đó, mô tả đúng như mã làm chứ không đoán, vì đây là phần duy nhất của chương này nằm trong chính mã nguồn trang web của bạn thay vì trong tài liệu của Apple hay OBS.</p>
<p>Mỗi bài học lưu ba ô video độc lập trong cơ sở dữ liệu, cộng một cài đặt cho biết luồng nào mở trước: ô <strong>VI</strong>, ô <strong>EN</strong>, và ô <strong>YT</strong>, mỗi ô có URL riêng và một cờ nền tảng — <strong>EMBED</strong> cho link YouTube, hoặc <strong>DIRECT</strong> cho file phát thẳng từ kho lưu trữ của chính trang web (Cloudflare R2) qua một URL có chữ ký, sống trong thời gian ngắn. Có hai cách thật sự để một file đã xuất đi vào một trong ba ô đó:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">A</span><span class="lz-t">Trang quản trị bài học</span><span class="lz-d">Mở bài học trong trang quản trị, rồi hoặc dán link YouTube vào ô VI hay EN (EMBED), hoặc chọn Direct và tải thẳng file đã xuất lên kho R2 (DIRECT). Đây là đường dùng hàng ngày cho từng bài một.</span></div>
<div class="lz-step"><span class="lz-k">B</span><span class="lz-t">File map + script seed của khoá</span><span class="lz-d">Một file dữ liệu duy nhất liệt kê một mục &#123;yt, credit, vi?, en?&#125; cho mỗi slug bài học của cả khoá; chạy script seed gắn hết vào cùng một lượt. Đây chủ yếu là cách video YT tuyển chọn được gắn vào MỌI bài học trước khi có bất kỳ bản tự quay nào — một script riêng kiểm lại từng link YouTube còn sống và nhúng được trước khi lượt seed đó chạy.</span></div>
</div>
<p>Dù ô nào có URL, nút chuyển hiện cho học viên luôn đưa ra cả ba tab, làm mờ và ghi "sắp có" cho tab nào chưa gắn gì, và nhớ lựa chọn lần trước của một học viên quay lại ngay trong trình duyệt của họ. Cài đặt <strong>luồng mặc định</strong> quyết định tab nào mở trước cho một người mới — trỏ nó về VI một khi bản tự quay của bạn đã có chính là thứ thật sự đưa một bài học từ "video YouTube mượn tạm" thành "chính giọng bạn đang dạy".</p>
<div class="callout warn"><p><strong>Điều mã KHÔNG tự làm:</strong> không có quy trình nào tự canh một thư mục rồi tự đăng video giúp bạn. Xuất file, từ khâu dựng của chính Bài 22.4, chỉ mới là một nửa — không có gì xuất hiện trên trang học cho tới khi một URL thật sự được gắn qua một trong hai đường ở trên. Xong việc dựng và xong việc đăng là hai bước tách biệt, do hai người khác nhau làm hoặc làm ở hai thời điểm khác nhau, và đáng nói rõ bạn thật sự đã hoàn thành bước nào.</p></div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — chỉ thêm hai mốc chapter YouTube, hoặc đặt chúng cách nhau chưa tới 10 giây, rồi tự hỏi sao thanh chapter chẳng bao giờ hiện:</strong> yêu cầu của YouTube rất chính xác — 0:00 đầu tiên, tối thiểu ba mốc tăng dần, mỗi chương tối thiểu 10 giây — và được áp dụng như một khối, không phải từng chương riêng lẻ. Nếu thanh chapter biến mất hoàn toàn, kiểm lại đúng ba luật này trước khi nghĩ đó là lỗi nền tảng.</p></div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tưởng một bản xuất đã xong nghĩa là đã "lên trang" rồi:</strong> một file đã render nằm trên Mac, thậm chí đã tải lên kênh YouTube riêng của bạn, vẫn chưa tới tay một học viên nào. Nó chỉ hiện ra khi URL của nó được gắn vào ô VI, EN hay YT của bài học — qua trang quản trị hoặc file map của khoá — và đội ngũ của chính trang web, không phải khoá học này, nắm bước đó trên production.</p></div>

<p class="note-ct"><strong>Nối với chương sau:</strong> Chương 23 đẩy đúng việc chia VI/EN này đi xa hơn — quay hẳn một bản tiếng Anh riêng thay vì chỉ phụ đề bản tiếng Việt — và Chương 24 nói về cài đặt xuất mà bài này cố tình để nhẹ.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy đoạn quay thử một phút từ phần thực hành Bài 22.3, thả một marker vào đầu clip trong phần mềm dựng.</li>
<li>Viết một danh sách chapter YouTube ba dòng cho nó, đúng định dạng, bắt đầu từ 0:00, mỗi chương cách nhau ít nhất 10 giây.</li>
<li>Với một bài học thật bạn quan tâm, nói to bạn sẽ dùng đường gắn nào trong hai đường (trang quản trị hay file map của khoá), và vì sao — dựa trên việc cảnh quay đã có sẵn trên YouTube hay cần ở lại riêng tư trên R2.</li>
</ol><p><strong>Đạt khi:</strong> danh sách chapter của bạn qua được cả ba luật YouTube, và bạn giải thích được trong một câu vì sao "đã xuất" và "đã đăng" không phải cùng một việc trên trang này.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
<div class="kv"><span class="k">Chapter marker</span><span class="v">Một mốc thời gian có tên trong phần mềm dựng (và sau này, trong mô tả YouTube) đánh dấu chỗ một đoạn video bắt đầu.</span></div>
<div class="kv"><span class="k">EMBED / DIRECT</span><span class="v">Hai cách trang này phát video bài học: một trình phát YouTube nhúng vào, hoặc một file phát thẳng từ kho lưu trữ riêng của trang.</span></div>
<div class="kv"><span class="k">Luồng video mặc định</span><span class="v">Lựa chọn VI/EN/YT mở trước cho một học viên chưa từng chọn lần nào.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dựng bài giảng dùng lại Chương 14, 16 và 17 — cắt, callout, zoom bằng keyframe — áp cho từng đoạn đã viết kịch bản thay vì một timeline dài.</li>
<li>Chapter YouTube cần 0:00 đầu tiên, tối thiểu ba mốc tăng dần, mỗi mốc tối thiểu 10 giây — sai một luật là mất cả thanh chapter.</li>
<li>Một bài học lưu ba ô video độc lập (VI/EN/YT) cộng một cài đặt luồng mặc định; một URL tới được một trong ba ô đó qua trang quản trị (EMBED link YouTube hoặc tải DIRECT lên R2) hoặc qua file map + script seed của khoá.</li>
<li>Xuất file và đăng file là hai bước tách biệt — không có gì tới tay học viên cho tới khi một URL thật sự được gắn vào bài học.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9884579?hl=en" target="_blank" rel="noopener">YouTube Help — Thêm chapter cho video</a></div>
</div>
`,
    },

    /* ─────────────────── 22.5 quiz ─────────────────── */
    {
      title: '22.5 — Chapter 22 check|||22.5 — Kiểm tra chương 22',
      slug: 'cr-22-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Bài kiểm 10 câu tình huống thực tế về thiết kế bài giảng, quay màn hình bằng OBS, iPad làm bảng trắng, và đưa video lên 3 luồng VI/EN/YT của cuongthai.com.',
      content: `
<div class="ml-en">
<h2>📌 Chapter 22 summary</h2>
<p>A teaching video succeeds or fails on two separate things: whether the lesson is <em>designed</em> to be watched in short, learner-paced pieces, and whether the recording is technically clean enough that nothing distracts from it. This chapter covered both, then followed a finished file all the way to a real learner's screen.</p>
<ul>
<li><strong>22.1</strong> — Script every segment as Goal → Why → Concept → Demonstration → Practice → Recap. Apply Mayer's signaling, segmenting, coherence, redundancy and personalization principles. Guo, Kim & Rubin (2014): engagement drops sharply around six minutes regardless of total length; informal talking-head and hand-drawn explanations beat polished lectures and static slides.</li>
<li><strong>22.2</strong> — Shift-Cmd-5 for a quick single-source clip; OBS's Scenes and Sources (macOS Screen Capture + Video Capture Device + Audio Mixer) when you need screen, webcam and mic together. Record above your delivery resolution (Lanczos downscale to 1080p). Continuity Camera turns an iPhone into a webcam. Presenter Overlay is for live calls, not recorded files.</li>
<li><strong>22.3</strong> — Record the iPad's own screen standalone, or mirror it via AirPlay into the same OBS scene as your webcam. Freeform is free and built in; GoodNotes and Notability are paid alternatives.</li>
<li><strong>22.4</strong> — Editing reuses Chapters 14, 16 and 17. YouTube chapters need 0:00 first, three ascending timestamps, 10 seconds minimum each — all or nothing. A lesson's VI/EN/YT slots are filled through the admin editor or the course video map + seed script — exporting and publishing are two separate steps.</li>
</ul>
<h3>✅ Self-check before you move on</h3>
<ul>
<li>[ ] I can write a lecture segment script using the six-step shape in under ten minutes.</li>
<li>[ ] I can name which Mayer principle a specific screen-recording habit violates or applies.</li>
<li>[ ] I have built at least one OBS scene with a screen source, a webcam source and a working audio mixer.</li>
<li>[ ] I know the difference between recording the iPad standalone and mirroring it into OBS, and when to use each.</li>
<li>[ ] I can state, for a specific lesson, exactly which path would attach my own VI recording to it.</li>
</ul>
</div>
<div class="ml-vi">
<h2>📌 Tóm tắt chương 22</h2>
<p>Một video bài giảng thành hay bại ở hai thứ tách biệt: bài giảng có được <em>thiết kế</em> để xem theo từng đoạn nhỏ, theo nhịp người học hay không, và bản quay có sạch về mặt kỹ thuật đủ để không có gì làm người xem xao nhãng hay không. Chương này dạy cả hai, rồi đi theo một file đã dựng xong tới tận màn hình của một học viên thật.</p>
<ul>
<li><strong>22.1</strong> — Viết kịch bản mỗi đoạn theo Mục tiêu → Vì sao → Khái niệm → Làm mẫu → Luyện → Tóm tắt. Áp nguyên lý tín hiệu, chia đoạn, mạch lạc, dư thừa, cá nhân hoá của Mayer. Guo, Kim & Rubin (2014): mức gắn bó rơi mạnh quanh mốc sáu phút bất kể tổng độ dài; talking-head thân mật và hình vẽ tay thắng bài giảng chỉn chu và slide tĩnh.</li>
<li><strong>22.2</strong> — Shift-Cmd-5 cho clip nhanh một nguồn; Scene và Source của OBS (macOS Screen Capture + Video Capture Device + Audio Mixer) khi cần màn hình, webcam và mic cùng lúc. Quay cao hơn độ phân giải xuất (thu nhỏ về 1080p bằng Lanczos). Continuity Camera biến iPhone thành webcam. Presenter Overlay dành cho gọi video trực tiếp, không phải file đã quay.</li>
<li><strong>22.3</strong> — Quay riêng màn hình iPad, hoặc phản chiếu qua AirPlay vào đúng scene OBS với webcam. Freeform miễn phí, cài sẵn; GoodNotes và Notability là lựa chọn trả phí.</li>
<li><strong>22.4</strong> — Dựng dùng lại Chương 14, 16 và 17. Chapter YouTube cần 0:00 đầu tiên, ba mốc tăng dần, tối thiểu 10 giây mỗi chương — tất cả hoặc không gì cả. Ba ô VI/EN/YT của một bài học được gắn qua trang quản trị hoặc file map + script seed của khoá — xuất và đăng là hai bước tách biệt.</li>
</ul>
<h3>✅ Tự kiểm trước khi qua chương sau</h3>
<ul>
<li>[ ] Viết được kịch bản một đoạn bài giảng theo khung 6 bước trong dưới mười phút.</li>
<li>[ ] Gọi tên được một thói quen quay màn hình cụ thể đang vi phạm hay áp đúng nguyên lý nào của Mayer.</li>
<li>[ ] Đã dựng được ít nhất một scene OBS có nguồn màn hình, nguồn webcam và audio mixer chạy đúng.</li>
<li>[ ] Biết khác biệt giữa quay riêng iPad và phản chiếu vào OBS, và khi nào dùng cách nào.</li>
<li>[ ] Nói được, với một bài học cụ thể, chính xác đường nào sẽ gắn bản tự quay VI của mình vào đó.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You script a 25-minute lecture, record it as one uninterrupted take, and only later remember Guo, Kim & Rubin’s finding about video length. What is the single most useful fix, given the research?|||Bạn viết kịch bản một bài giảng 25 phút, quay liền một mạch không ngắt, rồi mới nhớ tới phát hiện của Guo, Kim & Rubin về độ dài video. Cách chữa hữu ích nhất, theo đúng nghiên cứu đó, là gì?',
            options: [
              'Cut it into clearly labeled segments of about six minutes each, so viewers get a natural place to keep going|||Cắt nó thành các đoạn dán nhãn rõ ràng, mỗi đoạn khoảng sáu phút, để người xem có chỗ tự nhiên để tiếp tục',
              'Re-record the whole thing at a faster talking speed so it finishes sooner|||Quay lại toàn bộ với tốc độ nói nhanh hơn để xong sớm hơn',
              'Nothing — engagement research does not apply to programming tutorials|||Không cần làm gì — nghiên cứu về mức gắn bó không áp dụng cho video lập trình',
              'Speed up the whole video 1.5x in the edit so total runtime drops under six minutes|||Tăng tốc cả video lên 1,5x lúc dựng để tổng thời lượng xuống dưới sáu phút',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'The 2014 study found engagement drops sharply around six minutes regardless of a video’s total length — the fix is clear segment boundaries with their own recap and bridge, not a shorter or faster video overall. Speeding up the audio would make the lecture harder to follow, and re-recording faster just moves the same problem earlier.|||Nghiên cứu năm 2014 thấy mức gắn bó rơi mạnh quanh mốc sáu phút bất kể tổng độ dài video — cách chữa là các ranh giới đoạn rõ ràng, có tóm tắt và câu dẫn riêng, không phải làm cả video ngắn hơn hay nhanh hơn. Tăng tốc âm thanh sẽ làm bài giảng khó theo hơn, còn quay nhanh hơn chỉ dời đúng vấn đề đó lên sớm hơn.',
          },
          {
            question: 'You paste a full paragraph of explanation onto a slide, and then read it aloud word for word while it is on screen. Which Mayer principle does this violate?|||Bạn dán cả một đoạn văn giải thích lên slide, rồi đọc to nguyên văn từng chữ trong lúc nó đang hiện trên màn hình. Việc này vi phạm nguyên lý nào của Mayer?',
            options: [
              'Signaling|||Tín hiệu',
              'Redundancy — identical text and narration overload the same channel instead of helping each other|||Dư thừa — chữ và lời giống hệt nhau làm quá tải cùng một kênh thay vì hỗ trợ nhau',
              'Personalization|||Cá nhân hoá',
              'Segmenting|||Chia đoạn',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'The redundancy principle says graphics plus narration beats graphics plus narration plus on-screen text saying the exact same words — reading a full paragraph aloud while it is displayed is the textbook case. Signaling is about highlighting what matters, segmenting is about chunk length, and personalization is about tone of voice — none of those describe this specific mistake.|||Nguyên lý dư thừa nói hình + lời thắng hình + lời + chữ trên màn hình nói y hệt — đọc to cả đoạn văn trong lúc nó đang hiện chính là ví dụ kinh điển. Tín hiệu là về việc làm nổi bật điều quan trọng, chia đoạn là về độ dài từng phần, cá nhân hoá là về giọng điệu — không cái nào mô tả đúng lỗi cụ thể này.',
          },
          {
            question: 'You want viewers to notice that one specific line of code matters more than the rest of the function on screen. Which principle are you applying, and how?|||Bạn muốn người xem chú ý rằng một dòng code cụ thể quan trọng hơn phần còn lại của hàm đang hiện trên màn hình. Bạn đang áp nguyên lý nào, và bằng cách nào?',
            options: [
              'Coherence — by deleting the rest of the function from the file entirely|||Mạch lạc — bằng cách xoá hẳn phần còn lại của hàm khỏi file',
              'Redundancy — by reading the line aloud twice in a row|||Dư thừa — bằng cách đọc to dòng đó hai lần liên tiếp',
              'Signaling — by drawing an arrow or highlight box around that exact line|||Tín hiệu — bằng cách vẽ mũi tên hoặc khung tô sáng quanh đúng dòng đó',
              'Personalization — by saying "you" instead of "one" when referring to the viewer|||Cá nhân hoá — bằng cách nói "bạn" thay vì "người ta" khi nhắc tới người xem',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'Signaling is exactly this: adding a visual cue — an arrow, a highlight, a callout box (Lesson 16.2’s territory) — that points at the structurally important part without changing the content itself. Deleting code changes the content rather than signaling within it, and the other two options describe different principles entirely.|||Tín hiệu chính xác là việc này: thêm một dấu hiệu hình ảnh — mũi tên, tô sáng, khung callout (địa hạt của Bài 16.2) — chỉ vào phần quan trọng về cấu trúc mà không đổi nội dung. Xoá code là đổi nội dung chứ không phải làm nổi tín hiệu bên trong nó, còn hai phương án kia mô tả những nguyên lý khác hẳn.',
          },
          {
            question: 'In OBS Settings › Video, what combination lets you crop or zoom into fine detail during editing without the image turning blurry, while still delivering a normal 1080p file?|||Trong OBS Settings › Video, kết hợp nào cho bạn crop hoặc zoom vào chi tiết nhỏ lúc dựng mà hình không bị mờ, trong khi vẫn xuất một file 1080p bình thường?',
            options: [
              'Base and Output Resolution both set to 1920×1080|||Cả Base lẫn Output Resolution đều đặt 1920×1080',
              'Base Resolution set to 1920×1080, Output Resolution set higher than that|||Base Resolution đặt 1920×1080, Output Resolution đặt cao hơn thế',
              'Turning off the Downscale Filter entirely|||Tắt hẳn Downscale Filter',
              'Base (Canvas) Resolution set to your screen’s real resolution, Output (Scaled) Resolution set to 1920×1080|||Base (Canvas) Resolution đặt bằng độ phân giải thật của màn hình, Output (Scaled) Resolution đặt 1920×1080',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'Recording at a higher Base (Canvas) Resolution than the delivered Output (Scaled) Resolution — the same "shoot bigger, deliver smaller" logic Chapter 5 taught for cameras — leaves real extra pixels for a later crop or keyframed zoom. Matching both at 1080p gives you no headroom, and OBS cannot scale output higher than its base canvas.|||Quay ở Base (Canvas) Resolution cao hơn Output (Scaled) Resolution khi xuất — đúng logic "quay to hơn, xuất nhỏ hơn" mà Chương 5 đã dạy cho máy quay — chừa lại điểm ảnh thật cho một cú crop hay zoom keyframe sau này. Đặt cả hai cùng 1080p thì không còn dư gì, và OBS không thể xuất output cao hơn chính canvas gốc của nó.',
          },
          {
            question: 'Someone argues that a screen recording of VS Code needs the same 1/50 shutter rule Chapter 5 taught for cameras in Vietnam, or it will show flicker bands under office lights. Are they right?|||Có người cho rằng một bản quay màn hình VS Code cũng cần đúng luật màn trập 1/50 mà Chương 5 dạy cho máy quay ở Việt Nam, không thì sẽ bị sọc nhấp nháy dưới đèn văn phòng. Điều đó có đúng không?',
            options: [
              'No — screen capture reads pixels directly from the display buffer, with no light sensor involved, so mains flicker does not apply at all|||Sai — quay màn hình đọc thẳng điểm ảnh từ bộ đệm hiển thị, không qua cảm biến ánh sáng nào, nên nhấp nháy điện lưới hoàn toàn không áp dụng',
              'Yes — every video, screen-recorded or not, needs a shutter speed matched to 50Hz mains power|||Đúng — mọi video, dù quay màn hình hay không, đều cần tốc độ màn trập khớp điện 50Hz',
              'Only true if you are also filming the screen with a second camera at the same time|||Chỉ đúng nếu bạn đồng thời quay màn hình đó bằng một camera thứ hai',
              'Yes, but only when recording at 60fps instead of 30fps|||Đúng, nhưng chỉ khi quay ở 60fps thay vì 30fps',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'The 50Hz shutter rule exists because a camera sensor collects real light over time, and indoor lights flicker at 100Hz. Screen capture through ScreenCaptureKit copies frame-buffer pixels directly — there is no sensor and no light involved, so that specific problem does not apply, though it can appear if you point an actual camera AT a monitor (Lesson 10.2’s separate issue, about the monitor’s own refresh rate).|||Luật màn trập 50Hz tồn tại vì cảm biến máy quay thu ánh sáng thật theo thời gian, và đèn trong nhà nhấp nháy ở 100Hz. Quay màn hình qua ScreenCaptureKit chép thẳng điểm ảnh từ bộ đệm khung hình — không có cảm biến, không có ánh sáng nào tham gia, nên đúng vấn đề đó không áp dụng, dù nó có thể xảy ra nếu bạn dùng một camera THẬT quay vào một màn hình (vấn đề khác của Bài 10.2, về tần số quét riêng của màn hình).',
          },
          {
            question: 'You are hosting live office hours over a video call and want your face to stay visible next to the screen you are sharing, without setting up OBS at all. What is the right tool, and why not OBS here?|||Bạn đang tổ chức giờ hỏi đáp trực tiếp qua video call và muốn mặt mình vẫn hiện rõ cạnh màn hình đang chia sẻ, mà không cần dựng OBS chút nào. Công cụ đúng là gì, và vì sao không dùng OBS ở đây?',
            options: [
              'OBS with a Video Capture Device source — it is always the right tool for any webcam-plus-screen situation|||OBS với nguồn Video Capture Device — đây luôn là công cụ đúng cho mọi tình huống webcam kèm màn hình',
              'Presenter Overlay, built into the video-call app’s screen-sharing menu — OBS produces a recorded file, it does not insert itself into a live call you did not build a scene for|||Presenter Overlay, có sẵn trong menu chia sẻ màn hình của app gọi video — OBS tạo ra một file đã quay, nó không tự chèn vào một cuộc gọi trực tiếp mà bạn chưa dựng scene cho nó',
              'KeyCastr, to show your keystrokes during the call|||KeyCastr, để hiện phím bấm trong lúc gọi',
              'Continuity Camera alone, with no other setting|||Chỉ Continuity Camera, không cần cài đặt gì thêm',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'Presenter Overlay is built specifically for this: it turns on from the screen-sharing menu inside an already-active video call (macOS Sonoma 14+, Apple silicon) and keeps your face composited over the shared screen. OBS is a separate recording/streaming application — it does not automatically appear inside someone else’s video-call app. KeyCastr shows keystrokes, not your face, and Continuity Camera alone just supplies a camera source, not the overlay compositing.|||Presenter Overlay sinh ra đúng cho việc này: nó bật từ menu chia sẻ màn hình ngay trong một cuộc gọi video đang diễn ra (macOS Sonoma 14 trở lên, Apple silicon) và giữ mặt bạn chồng lên màn hình đang chia sẻ. OBS là một ứng dụng quay/phát riêng — nó không tự động xuất hiện trong app gọi video của người khác. KeyCastr hiện phím bấm chứ không phải mặt bạn, và riêng Continuity Camera chỉ cấp một nguồn camera, không tự chồng hình lên màn hình chia sẻ.',
          },
          {
            question: 'You turn on Screen Mirroring on your iPad and pick your Mac, but nothing shows up on the Mac at all. What is the most likely missing step?|||Bạn bật Screen Mirroring trên iPad và chọn Mac, nhưng chẳng có gì hiện lên trên Mac cả. Bước còn thiếu nhiều khả năng nhất là gì?',
            options: [
              'The iPad needs to be running Freeform, not GoodNotes|||iPad cần đang chạy Freeform, không phải GoodNotes',
              'OBS needs to be closed on the Mac before mirroring will work|||OBS cần đóng lại trên Mac thì phản chiếu mới chạy được',
              'AirPlay Receiver has not been turned on in the Mac’s System Settings › General › AirDrop & Continuity|||AirPlay Receiver chưa được bật trong System Settings › General › AirDrop & Continuity của Mac',
              'The Pencil needs to be paired to the Mac directly|||Pencil cần ghép đôi thẳng với Mac',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'Screen Mirroring only works once the receiving Mac has AirPlay Receiver turned on and set to allow the connecting device — without that toggle, the Mac simply never appears as a mirroring target, or appears but refuses the connection. Which drawing app is open, whether OBS happens to be running, and Pencil pairing (which is with the iPad, not the Mac) do not affect this.|||Screen Mirroring chỉ chạy khi Mac nhận đã bật AirPlay Receiver và cho phép thiết bị đang kết nối — thiếu công tắc đó, Mac đơn giản là không bao giờ hiện ra như một đích phản chiếu, hoặc hiện ra nhưng từ chối kết nối. App vẽ nào đang mở, OBS có đang chạy hay không, và việc ghép đôi Pencil (vốn ghép với iPad, không phải Mac) đều không liên quan tới việc này.',
          },
          {
            question: 'Guo, Kim & Rubin also found that Khan-style tablet drawing engaged students more than static slides. Which lesson in this chapter turns that specific finding into a workflow?|||Guo, Kim & Rubin còn thấy hình vẽ tay kiểu Khan Academy giữ chân học viên tốt hơn slide tĩnh. Bài nào trong chương này biến đúng phát hiện đó thành một quy trình?',
            options: [
              'Lesson 22.2, because OBS technically supports drawing tablets|||Bài 22.2, vì OBS về mặt kỹ thuật hỗ trợ được bảng vẽ',
              'Lesson 22.4, because editing adds callout arrows to the footage|||Bài 22.4, vì khâu dựng thêm mũi tên callout vào cảnh quay',
              'None of the lessons connect back to this specific finding|||Không bài nào nối lại đúng phát hiện cụ thể này',
              'Lesson 22.3 — recording or mirroring the iPad while drawing with Pencil and narrating|||Bài 22.3 — quay hoặc phản chiếu iPad trong lúc vẽ bằng Pencil và tường thuật',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'Lesson 22.3 opens by naming this exact finding and then gives you the two real workflows for it — recording the iPad’s own screen while you draw with Pencil, or mirroring it live into the same OBS scene as your webcam. Callouts (22.4) highlight existing footage rather than creating hand-drawn explanations, and OBS (22.2) is the recording tool, not the reason drawing engages people.|||Bài 22.3 mở đầu bằng cách gọi tên đúng phát hiện này rồi cho bạn hai quy trình thật cho nó — quay riêng màn hình iPad trong lúc vẽ bằng Pencil, hoặc phản chiếu trực tiếp vào đúng scene OBS với webcam. Callout (22.4) làm nổi cảnh quay có sẵn chứ không tạo ra lời giải thích vẽ tay, còn OBS (22.2) là công cụ quay, không phải lý do vẽ tay giữ chân người xem.',
          },
          {
            question: 'You finish editing your first Vietnamese-language lecture and export the file. A friend checks the lesson page on cuongthai.com and still sees only the old YouTube video. What is the most likely explanation?|||Bạn dựng xong bài giảng tiếng Việt đầu tiên và xuất file. Một người bạn kiểm trang bài học trên cuongthai.com và vẫn chỉ thấy video YouTube cũ. Lý do nhiều khả năng nhất là gì?',
            options: [
              'The exported file has not been attached yet — nothing reaches a learner until its URL is set in the VI slot, either through the admin editor or the course video map + seed script|||File đã xuất chưa được gắn vào — không có gì tới tay học viên cho tới khi URL của nó được đặt vào ô VI, qua trang quản trị hoặc qua file map + script seed của khoá',
              'Exporting a video file automatically uploads and attaches it — this must be a caching bug|||Xuất file video sẽ tự động tải lên và gắn vào bài học — đây chắc là lỗi cache',
              'The video needs to be at least 4K resolution before the site will display it|||Video cần tối thiểu độ phân giải 4K thì trang mới hiển thị được',
              'The lesson needs a YouTube chapter list before any other track can show|||Bài học cần có danh sách chapter YouTube thì các luồng khác mới hiện được',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'There is no automatic pipeline that watches for a finished export and publishes it — a URL has to actually be attached to the lesson’s VI slot, either by pasting a YouTube link or uploading to R2 in the admin editor, or via the course video map and its seed script. Resolution and chapter markers are unrelated to whether a track is attached at all.|||Không có quy trình tự động nào canh một bản xuất xong rồi tự đăng lên — một URL thật sự phải được gắn vào ô VI của bài học, qua dán link YouTube hoặc tải lên R2 trong trang quản trị, hoặc qua file map của khoá cùng script seed của nó. Độ phân giải và chapter marker không liên quan gì tới việc một luồng đã được gắn hay chưa.',
          },
          {
            question: 'Your lecture description lists chapters at 0:00, 2:10 and 2:16, then 8:00. After publishing, no chapter bar appears at all on the video. What is the most likely cause?|||Mô tả bài giảng của bạn liệt kê chapter ở 0:00, 2:10 và 2:16, rồi 8:00. Sau khi đăng, không thấy thanh chapter nào hiện trên video cả. Nguyên nhân nhiều khả năng nhất là gì?',
            options: [
              'Four chapters is too many — YouTube caps chapter lists at three|||Bốn chương là quá nhiều — YouTube giới hạn danh sách chapter ở ba mốc',
              'Chapters must be written in the video title, not the description|||Chapter phải viết trong tiêu đề video, không phải phần mô tả',
              'The gap between 2:10 and 2:16 is only 6 seconds, under YouTube’s 10-second minimum per chapter — this breaks the whole list, not just that one chapter|||Khoảng cách giữa 2:10 và 2:16 chỉ 6 giây, dưới mức tối thiểu 10 giây của YouTube cho mỗi chương — điều này làm hỏng cả danh sách, không chỉ riêng chương đó',
              'The video needs at least one chapter after the 10-minute mark|||Video cần ít nhất một chapter sau mốc 10 phút',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'YouTube requires every chapter to be at least 10 seconds long, and 2:10 to 2:16 is only 6 seconds — that single violation is enough to stop the entire chapter bar from activating, not just hide the short one. Four chapters is fine (the minimum is three, there is no stated maximum in the rule), chapters do belong in the description, and there is no rule requiring a chapter past any specific minute mark.|||YouTube yêu cầu mỗi chương tối thiểu 10 giây, mà từ 2:10 tới 2:16 chỉ có 6 giây — một vi phạm duy nhất đó đủ để cả thanh chapter không kích hoạt, không chỉ ẩn riêng chương ngắn đó. Bốn chương vẫn ổn (tối thiểu là ba, luật không nói giới hạn tối đa), chapter đúng là thuộc phần mô tả, và không có luật nào bắt phải có chapter sau một mốc phút cụ thể.',
          },
        ],
      },
    },
  ],
};
