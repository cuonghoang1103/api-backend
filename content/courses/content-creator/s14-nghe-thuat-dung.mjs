/**
 * Content Creator — Chương 14: Nghệ thuật cắt dựng. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Bốn lượt dựng: assembly → rough → fine → lock'],
  [4, 'Trước khi khoá — chốt đúng cách'],
  [5, 'Tám kiểu cắt — bản đồ thuật ngữ'],
  [6, 'Hard cut và jump cut'],
  [7, 'J-cut và L-cut'],
  [8, 'Cutaway che khoảng nhảy'],
  [9, 'Match cut'],
  [10, 'Hiệu ứng Kuleshov'],
  [11, 'Rule of Six của Walter Murch'],
  [12, 'Không phải khoảng dừng nào cũng nên cắt'],
  [13, 'Đọc đồ thị giữ chân'],
  [14, 'Nhạc, SFX và ducking'],
  [15, 'Bảng tra nhanh kiểu cắt'],
  [16, 'Thực hành chương 14'],
];

export default {
  title: 'Chapter 14 — The Craft of Editing|||Chương 14 — Nghệ thuật cắt dựng',
  description: 'Chương 12–13 dạy công cụ (CapCut, DaVinci Resolve). Chương này dạy tư duy dựng: quy trình theo lượt, các kiểu cắt, hiệu ứng Kuleshov, Rule of Six của Walter Murch, nhịp giữ chân, nhạc và thiết kế âm thanh — áp được cho cả hai phần mềm.',
  lessons: [

    /* ─────────────────── 14.0 slide bài giảng ─────────────────── */
    {
      title: '14.0 — Chapter 14 in 16 slides|||14.0 — Chương 14 trong 16 slide',
      slug: 'cr-14-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ tư duy dựng phim của chương gói trong 16 slide có hình: bốn lượt dựng, tám kiểu cắt, hiệu ứng Kuleshov, Rule of Six, nhịp giữ chân, nhạc và thiết kế âm thanh.',
      content: `
<div class="ml-en"><h2>📑 Chapter 14 in 16 slides</h2>
<p>Chapters 12 and 13 taught you which button to press in CapCut and DaVinci Resolve. This chapter teaches the thinking behind the button — the same four cutting passes, the same eight named cuts, and the same two long-standing ideas about why cuts work (the Kuleshov effect and Walter Murch's Rule of Six) apply whether your timeline lives in CapCut or in Resolve.</p>
<p>Two slides worth bookmarking: <strong>slide 10</strong> (why the exact same reaction shot can mean three different things depending on what comes after it) and <strong>slide 11</strong> (the six-criteria priority list a professional editor keeps in their head every time two possible cuts compete). Skim the deck now, then come back to each slide as its lesson references it.</p></div>
<div class="ml-vi"><h2>📑 Chương 14 trong 16 slide</h2>
<p>Chương 12 và 13 dạy bạn bấm nút nào trong CapCut và DaVinci Resolve. Chương này dạy TƯ DUY đằng sau cú bấm đó — cùng bốn lượt dựng, cùng tám kiểu cắt có tên, và cùng hai ý tưởng đã tồn tại lâu năm về vì sao cắt phim có tác dụng (hiệu ứng Kuleshov và Rule of Six của Walter Murch) — áp dụng được dù timeline của bạn nằm trong CapCut hay Resolve.</p>
<p>Hai slide đáng ghim lại: <strong>slide 10</strong> (vì sao ĐÚNG MỘT cảnh phản ứng có thể mang ba nghĩa khác nhau tuỳ cảnh đứng sau nó) và <strong>slide 11</strong> (danh sách ưu tiên sáu tiêu chí mà một người dựng chuyên nghiệp luôn nhớ trong đầu mỗi khi hai cách cắt cùng khả thi). Lướt cả bộ ngay bây giờ, rồi quay lại từng slide khi bài học nhắc tới nó.</p></div>
${gallery('cr-14', SLIDES)}
`,
    },

    /* ─────────────────── 14.1 Quy trình dựng theo lượt ─────────────────── */
    {
      title: '14.1 — Editing in passes: assembly, rough cut, fine cut, picture lock|||14.1 — Dựng theo lượt: assembly, rough cut, fine cut, picture lock',
      slug: 'cr-14-1-quy-trinh-dung',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Vì sao dựng một lèo từ đầu đến cuối luôn ra một bản rối, bốn lượt dựng chuyên nghiệp làm gì ở mỗi lượt, và khi nào một bản dựng thật sự "xong" để chuyển sang màu và âm thanh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>Editing start-to-finish in one pass always produces a mess — splitting it into four passes produces something watchable</h2>
<p class="lead">Chapter 4 fixed the habit of "hit record and shoot 20–30 minutes straight." This lesson fixes its twin at the editing stage: open the app, drag in all the footage, cut it start to finish in one go, export. The result is almost always the same — a long, messy cut, because you are trying to make four different kinds of decisions AT THE SAME TIME.</p>

<h3>Why "one pass" always loses to "passes"</h3>
<p>Editing is really four very different kinds of decisions: <em>what happens and in what order</em> (story), <em>what is dead weight to cut</em> (pace), <em>exactly where each cut lands</em> (technique), and <em>does it look/sound consistent</em> (color, sound). Trying to make all four at once means each decision keeps getting interrupted by the others — you just decided the order of two scenes, then stop to tweak volume, and lose track of where you were in the story. Professional editors are not better at any single cut than you are — they just split those four kinds of decisions into four separate PASSES, each pass handling one kind only.</p>

<h3>Selects and string-out — preparing before you assemble</h3>
<p>Before opening the timeline, watch all the footage once and pick out <strong>selects</strong> — the best take for each shot in your shot list (Chapter 4). In DaVinci Resolve, mark them with the <strong>M</strong> key (marker — covered in Chapter 13) right on the clip in the Media Pool. CapCut has no dedicated "mark this take as good" button, so the practical move is to delete the NG (no-good) takes from the folder before dragging anything into the Media panel — the leaner that panel is, the less footage that will never get used is competing for your attention. Joining the selects in order, with no trimming yet, is called a <strong>string-out</strong>.</p>
${slide('cr-14', 3, 'Bốn lượt dựng: assembly → rough → fine → lock')}

<h3>Four passes, four different goals</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1. Assembly cut</span><span class="v">Lay the string-out down in script/shot-list order. No trimming of dead air, no pacing decisions yet — the only goal is a version that PLAYS start to finish, usually 1.5–2× the length of the final cut.</span></div>
  <div class="kv"><span class="k">2. Rough cut</span><span class="v">Cut out dead weight, try B-roll placement, start shaping a story. Still rough — no J-cuts/L-cuts yet, no frame-accurate trimming.</span></div>
  <div class="kv"><span class="k">3. Fine cut</span><span class="v">Tighten every single edit: smooth jump cuts (Lesson 14.2), well-placed J-cuts/L-cuts, music sync, restrained effects. This is the pass that eats the most time.</span></div>
  <div class="kv"><span class="k">4. Picture lock</span><span class="v">No more changes to length or order. Only now do you start color grading (Ch.15) and finishing sound/captions (Ch.16) — not as a rule for its own sake, but because re-cutting after those two are done means redoing them from scratch.</span></div>
</div>

<div class="callout warn"><p><strong>Why this order is not arbitrary:</strong> Auto captions (Ch.12) are timed against each clip's exact timecode. Color nodes (Ch.15) are applied per clip on the timeline. Re-cutting a section after either of those exists means re-timing every caption after the cut and rebuilding the node chain that just went out of sync — the same effort you already spent, plus more.</p></div>
${slide('cr-14', 4, 'Trước khi khoá — chốt đúng cách')}

<h3>Watch with "fresh eyes" before locking</h3>
<p>After a few hours staring at the same cut, your brain stops seeing it the way a first-time viewer would — editors call this "editor's blindness": you automatically fill in gaps because you already KNOW what it says. Two cheap fixes: (1) export a draft and watch it on your actual <strong>phone</strong> — small screen, real network speed, the exact place your audience will watch it; (2) let the cut sit overnight and re-watch before locking. If the deadline does not allow overnight, at minimum step away, do something else for 20–30 minutes, then come back.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — locking too early, or never locking at all.</strong> Locking right after the first fine cut, with no rest for your eyes, usually reveals mistakes only after color is already done (too late to fix cheaply). The opposite extreme: endless re-editing because it is "not quite right yet," never reaching color/sound — an unpublished video produces no data, and no data means you do not know what to fix (Section 0 already made this point). Set a concrete "Done when" bar (see Practice below) and lock once you hit it, instead of waiting for "perfect."</p></div>
<p class="note-ct"><strong>Continuing into Lesson 14.2:</strong> what does "tighten every single edit" actually mean during the fine cut pass? It means picking the RIGHT cut type for each join — the next lesson covers eight named cuts, the Kuleshov effect, and Walter Murch's Rule of Six to help you decide.</p>

<h3>🎬 Practice (30–40 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick a talking-head or vlog clip 3+ minutes long from a previous chapter's shoot.</li>
<li>Watch it all, mark selects (Resolve: M key; CapCut: delete NG takes from the folder before importing).</li>
<li>Assemble the assembly cut, save it as its own file/project named per Chapter 11 (e.g. &#96;2026-09-22_robot-review_v1-assembly&#96;).</li>
<li>Make the rough cut, save as v2. Rest for 20 minutes.</li>
<li>Make the fine cut, save as v3. Export a draft, watch it on your phone.</li>
<li>If it holds up, rename the final version to &#96;_v4-lock&#96; — a signal to yourself: no more re-cutting from here.</li>
</ol><p><strong>Done when:</strong> you have all 4 versions saved under the correct names, and can point to at least one spot where the "fresh eyes" pass (phone/overnight) made you change something from the previous version.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Assembly cut</span><span class="v">The first pass, laid down in script order, with no trimming yet.</span></div>
  <div class="kv"><span class="k">Rough cut</span><span class="v">Dead weight cut out, B-roll positions tried, pacing still rough.</span></div>
  <div class="kv"><span class="k">Fine cut</span><span class="v">Frame-accurate pass — jump cuts, J-cuts/L-cuts, music sync.</span></div>
  <div class="kv"><span class="k">Picture lock</span><span class="v">Length and order are final — no more re-cutting past this point.</span></div>
  <div class="kv"><span class="k">Selects</span><span class="v">The best takes chosen out of all the footage.</span></div>
  <div class="kv"><span class="k">String-out</span><span class="v">Selects joined in order with no trimming yet.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Editing is four different KINDS of decisions (story, pace, technique, consistency) — split into four passes instead of making them all at once.</li>
<li>Assembly → Rough → Fine → Picture lock — each pass has one goal; do not skip ahead.</li>
<li>Lock the picture BEFORE finishing color/sound/captions — reversing that order costs roughly double the work.</li>
<li>Watch on your phone and sleep on it before locking — "editor's blindness" is real.</li>
</ul>
<div class="link-card"><a href="https://workflow.frame.io/guide/editing-stages" target="_blank" rel="noopener">Frame.io Workflow — The stages of editing: assembly, rough, fine, picture lock</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>Dựng một lèo từ đầu đến cuối luôn ra một bản rối — chia thành bốn lượt mới ra một bản xem được</h2>
<p class="lead">Ở Chương 4 bạn đã sửa thói quen "bật máy quay một lèo 20–30 phút". Bài này sửa thói quen song song ở khâu dựng: mở phần mềm, kéo hết footage lên timeline, cắt từ đầu tới cuối một lần, xuất luôn. Kết quả gần như luôn giống nhau — một bản dựng vừa dài vừa rối, vì bạn đang cố làm bốn loại quyết định rất khác nhau CÙNG MỘT LÚC.</p>

<h3>Vì sao "một lèo" luôn thua "chia lượt"</h3>
<p>Khi dựng, bạn thật ra đang đưa ra bốn loại quyết định rất khác nhau: <em>chuyện gì xảy ra và theo thứ tự nào</em> (câu chuyện), <em>đoạn nào thừa nên bỏ</em> (nhịp), <em>từng khung hình cắt ở đâu cho mượt</em> (kỹ thuật), và <em>trông/nghe có nhất quán không</em> (màu, âm). Cố làm cả bốn cùng lúc thì mỗi quyết định đều bị các quyết định còn lại kéo sự chú ý đi — bạn vừa mới quyết được thứ tự hai cảnh thì lại dừng lại chỉnh âm lượng, quên mất mình đang ở đâu trong câu chuyện. Dân dựng chuyên nghiệp KHÔNG giỏi hơn bạn ở từng nhát cắt riêng lẻ — họ chỉ tách bốn loại quyết định đó thành bốn LƯỢT riêng, mỗi lượt chỉ lo một loại.</p>

<h3>Selects và string-out — chuẩn bị trước khi ráp</h3>
<p>Trước khi mở timeline, xem lại toàn bộ footage một lượt và chọn ra <strong>selects</strong> — take tốt nhất cho từng shot trong shot list (Chương 4). Trong DaVinci Resolve, đánh dấu chúng bằng phím <strong>M</strong> (marker — đã học ở Chương 13) ngay trên clip trong Media Pool. CapCut chưa có nút "đánh dấu take tốt" riêng, nên cách thực tế nhất là xoá hẳn các NG-take (take hỏng) khỏi thư mục trước khi kéo vào Media panel — panel càng gọn, footage sẽ không bao giờ dùng càng ít cơ hội giành sự chú ý của bạn. Nối các selects lại theo đúng thứ tự, chưa cắt tỉa gì, gọi là <strong>string-out</strong>.</p>
${slide('cr-14', 3, 'Bốn lượt dựng: assembly → rough → fine → lock')}

<h3>Bốn lượt, bốn mục tiêu khác nhau</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">1. Assembly cut</span><span class="v">Ráp string-out theo đúng thứ tự kịch bản/shot list. Chưa cắt bớt lời thừa, chưa lo nhịp — mục tiêu duy nhất là có một bản CHẠY ĐƯỢC từ đầu tới cuối, thường dài gấp rưỡi đến gấp đôi bản cuối.</span></div>
  <div class="kv"><span class="k">2. Rough cut</span><span class="v">Cắt bớt câu thừa, đoạn lặp ý; thử vị trí B-roll; bắt đầu có hình dạng của một câu chuyện. Vẫn còn thô — chưa J-cut/L-cut, chưa tinh chỉnh từng khung hình.</span></div>
  <div class="kv"><span class="k">3. Fine cut</span><span class="v">Tinh từng khung hình: jump cut mượt (Bài 14.2), J-cut/L-cut đúng chỗ, khớp nhạc, hiệu ứng tiết chế. Đây là lượt tốn thời gian nhất.</span></div>
  <div class="kv"><span class="k">4. Picture lock</span><span class="v">Không đổi thời lượng hay thứ tự nữa. Từ đây bạn mới bắt đầu chỉnh màu (Ch.15) và làm âm thanh/phụ đề chính thức (Ch.16) — không phải vì luật lệ, mà vì đổi cắt SAU khi đã làm hai việc đó nghĩa là làm lại từ đầu.</span></div>
</div>

<div class="callout warn"><p><strong>Vì sao thứ tự này không tuỳ ý:</strong> phụ đề tự động (Ch.12) canh theo timecode của TỪNG clip. Node màu (Ch.15) áp theo TỪNG clip trên timeline. Cắt lại một đoạn sau khi đã có hai thứ đó nghĩa là canh lại toàn bộ phụ đề phía sau chỗ cắt và dựng lại chuỗi node màu bị lệch — mất đúng số công đã bỏ ra để làm chúng, cộng thêm.</p></div>
${slide('cr-14', 4, 'Trước khi khoá — chốt đúng cách')}

<h3>Xem bằng "mắt mới" trước khi khoá</h3>
<p>Sau vài giờ nhìn cùng một đoạn video, não bạn ngừng thấy nó như người xem lần đầu — dân dựng hay gọi hiện tượng này là "mắt quen" (editor's blindness): bạn tự động điền vào những chỗ còn thiếu vì bạn đã BIẾT nó nói gì. Hai cách chữa rẻ tiền nhất: (1) xuất một bản nháp và xem trên chính <strong>điện thoại</strong> — màn hình nhỏ, tốc độ mạng thật, đúng nơi khán giả của bạn sẽ xem; (2) để bản dựng qua một đêm rồi xem lại trước khi khoá. Nếu deadline không cho phép để qua đêm, ít nhất đứng dậy, làm việc khác 20–30 phút, rồi quay lại.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — khoá quá sớm HOẶC không bao giờ khoá.</strong> Khoá ngay sau lượt fine cut đầu tiên, chưa để mắt nghỉ, thường lộ lỗi ngay khi đã làm màu xong (quá muộn để sửa rẻ). Ngược cực đoan: cứ sửa mãi vì "chưa ưng", không bao giờ tới lượt màu/âm — video không đăng thì không có số liệu, không có số liệu thì không biết sửa gì (Mục 0 đã nói điều này). Đặt một tiêu chí "Đạt khi" cụ thể (xem phần Thực hành dưới) và khoá khi đạt, đừng đợi "hoàn hảo".</p></div>
<p class="note-ct"><strong>Nối với Bài 14.2:</strong> "tinh từng khung hình" ở lượt fine cut nghĩa là gì cụ thể? Đó là chọn ĐÚNG kiểu cắt cho từng chỗ nối — bài sau đi vào tám kiểu cắt, hiệu ứng Kuleshov, và Rule of Six của Walter Murch để giúp bạn quyết định.</p>

<h3>🎬 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
<li>Chọn một footage talking head hoặc vlog ≥ 3 phút đã quay ở chương trước.</li>
<li>Xem hết, đánh dấu selects (Resolve: phím M; CapCut: xoá NG-take khỏi thư mục trước khi import).</li>
<li>Ráp assembly cut, lưu thành file/project riêng đặt tên theo Chương 11 (vd &#96;2026-09-22_robot-review_v1-assembly&#96;).</li>
<li>Làm rough cut, lưu bản v2. Nghỉ 20 phút.</li>
<li>Làm fine cut, lưu bản v3. Xuất nháp, xem trên điện thoại.</li>
<li>Nếu ổn, đổi tên bản cuối thành &#96;_v4-lock&#96; — tín hiệu cho chính bạn: từ giờ không đổi cắt nữa.</li>
</ol><p><strong>Đạt khi:</strong> bạn có đủ 4 bản lưu riêng theo đúng tên, và chỉ ra được ít nhất một chỗ mà lượt "mắt mới" (xem trên điện thoại/qua đêm) khiến bạn sửa lại so với bản trước đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Assembly cut</span><span class="v">Bản ráp đầu tiên theo đúng thứ tự kịch bản, chưa cắt gọt.</span></div>
  <div class="kv"><span class="k">Rough cut</span><span class="v">Đã cắt bớt phần thừa, thử vị trí B-roll, nhịp còn thô.</span></div>
  <div class="kv"><span class="k">Fine cut</span><span class="v">Tinh chỉnh từng khung hình — jump cut, J-cut/L-cut, khớp nhạc.</span></div>
  <div class="kv"><span class="k">Picture lock</span><span class="v">Chốt thời lượng & thứ tự — không đổi cắt sau mốc này.</span></div>
  <div class="kv"><span class="k">Selects</span><span class="v">Những take tốt nhất được chọn ra từ toàn bộ footage.</span></div>
  <div class="kv"><span class="k">String-out</span><span class="v">Các selects nối thô theo thứ tự, chưa cắt tỉa.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dựng là bốn LOẠI quyết định khác nhau (chuyện, nhịp, kỹ thuật, đồng nhất) — tách thành bốn lượt thay vì làm cùng lúc.</li>
<li>Assembly → Rough → Fine → Picture lock — mỗi lượt một mục tiêu, không nhảy cóc.</li>
<li>Khoá hình TRƯỚC khi làm màu/âm/phụ đề chính thức — đổi ngược lại tốn gấp đôi công.</li>
<li>Xem trên điện thoại + để qua đêm trước khi khoá — "mắt quen" là có thật.</li>
</ul>
<div class="link-card"><a href="https://workflow.frame.io/guide/editing-stages" target="_blank" rel="noopener">Frame.io Workflow — Các giai đoạn dựng phim: assembly, rough, fine, picture lock</a></div>
</div>
`,
    },

    /* ─────────────────── 14.2 Các kiểu cắt & lý thuyết ─────────────────── */
    {
      title: '14.2 — Cut types, the Kuleshov effect, and the Rule of Six|||14.2 — Các kiểu cắt, hiệu ứng Kuleshov và Rule of Six',
      slug: 'cr-14-2-kieu-cat-chuyen-canh',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Tám kiểu cắt và câu hỏi riêng mỗi kiểu trả lời, vì sao khán giả tự gán cảm xúc cho một cảnh trung tính (hiệu ứng Kuleshov), và Rule of Six của Walter Murch — thứ tự ưu tiên khi hai cách cắt cùng khả thi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2</span>
<h2>Eight cut types are not eight random choices — each one answers a different question</h2>
<p class="lead">Lesson 14.1 split editing into four passes. During the fine cut, the question you ask hundreds of times is: "what kind of cut does THIS join need?" This lesson gives you eight named answers, the two ideas behind them (the Kuleshov effect, Walter Murch's Rule of Six), and how to apply both in CapCut and DaVinci Resolve.</p>
${slide('cr-14', 5, 'Tám kiểu cắt — bản đồ thuật ngữ')}

<h3>Hard cut, jump cut — the default, and when jump cuts start to grate</h3>
<p>A <strong>hard cut</strong> (a clean change of shot, no effect) is the cut behind more than 90% of any good video's runtime — Lesson 12.3 already advised no transition by default, and a hard cut IS that "no transition." A <strong>jump cut</strong> (two clips of the same shot size/angle, only differing in time — the subject "jumps" slightly) was already taught mechanically in Lesson 12.2 (Q/W in CapCut, ripple/roll trimming in Resolve — Ch.13); the question here is judgment. For social talking-head content, audiences are used to this rhythm. For a formal interview or anything that needs to feel unbroken, a string of bare jump cuts grates because it keeps reminding the viewer "this is an edited video" — the fix is to COVER the important ones with B-roll or a cutaway, leaving bare jump cuts only where speed itself is the goal.</p>

<h3>J-cut and L-cut — same trimming technique, different emotional intent</h3>
${slide('cr-14', 7, 'J-cut và L-cut')}
<p>Resolve names these two offset trims in Ch.13 (a roll trim between video and audio tracks); CapCut does it by unlinking a clip's audio and dragging just that edge (Ch.12.2). What neither chapter said is WHY you would pick one over the other:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">J-cut</span><span class="v">The NEXT scene's audio starts before its picture — the ear arrives first, creating anticipation, pulling attention FORWARD. Use it moving from a question to the person answering.</span></div>
  <div class="kv"><span class="k">L-cut</span><span class="v">The CURRENT scene's audio continues after the picture has changed — the emotional weight "stays" a beat while the picture has already cut to a reaction. Use it when the audience should SEE the consequence, not just hear it.</span></div>
</div>
<p>Rule of thumb: "what's interesting about the next shot?" → J-cut. "How did that line land?" → L-cut.</p>

<h3>Match cut, cutaway — joining by shape, hiding with a glance away</h3>
<p>A <strong>match cut</strong> joins two shots from different times/places via a shared shape or motion — the viewer's brain stitches them into one thread. A classic example: a thrown bone cutting to an orbiting spacecraft in <em>2001: A Space Odyssey</em> (Kubrick, 1968) — the same rotating shape, bridging millions of years. With your own footage: a loading spinner while building code, cutting to a bicycle wheel spinning at a vlog's start. A <strong>cutaway</strong> (Ch.4 told it apart from an insert) is for skipping a long stretch of continuous action — 40 minutes assembling the Mini-Me robot compressed to seconds: cutting straight through reads as a mistake, so cut away for 2–4 seconds (a clock, a hand reaching for a tool) to give the viewer's brain a breather, then return without anyone spotting the join.</p>

<h3>Cross-cut, smash cut, cut on action — three rare but powerful tools</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cross-cut</span><span class="v">Cutting between two actions happening at once, elsewhere (you coding — a classmate testing on another machine) — creates comparison or tension.</span></div>
  <div class="kv"><span class="k">Smash cut</span><span class="v">A sudden, strongly contrasting cut in picture and/or sound — for shock or a laugh; overuse kills the effect.</span></div>
  <div class="kv"><span class="k">Cut on action</span><span class="v">Cutting mid-movement (a finger hitting Enter) — the eye follows the motion and misses the join; the root of "matching action" from Ch.7.4.</span></div>
</div>
<p>A <strong>dissolve</strong> (Ch.12.3 said keep only one gentle transition) signals "time or place just made a big jump" — use it for day/chapter changes; use it between two genuinely continuous moments and the viewer wrongly assumes a gap happened.</p>

<h3>The Kuleshov effect — why the audience "acts" the emotion for the actor</h3>
${slide('cr-14', 10, 'Hiệu ứng Kuleshov')}
<p>In the 1920s, Lev Kuleshov paired the exact SAME expressionless close-up of actor Ivan Mosjoukine with three follow-ups: a bowl of soup, a girl in a coffin, a woman on a divan. Viewers of the three versions described his acting as hungry, grief-stricken, and full of desire — though the face never changed by a millimeter. Director Vsevolod Pudovkin recounted the experiment in 1929; the original footage does not survive, so we know it mainly through his written account. The lesson: viewers automatically BUILD MEANING from what sits next to what — place the right shot after a neutral reaction, and neither an actor nor you need to overact; the audience does the rest.</p>

<h3>Walter Murch's Rule of Six — when two cuts both work, which wins</h3>
${slide('cr-14', 11, 'Rule of Six của Walter Murch')}
<p>Walter Murch — an Oscar-winning editor (Apocalypse Now, The English Patient) — wrote in <em>In the Blink of an Eye: A Perspective on Film Editing</em> (Silman-James Press, 1995/2001) six criteria for a good cut:</p>
<table>
<tr><th>#</th><th>Criterion</th><th>Weight</th></tr>
<tr><td>1</td><td>Emotion</td><td>51%</td></tr>
<tr><td>2</td><td>Story</td><td>23%</td></tr>
<tr><td>3</td><td>Rhythm</td><td>10%</td></tr>
<tr><td>4</td><td>Eye-trace</td><td>7%</td></tr>
<tr><td>5</td><td>Two-dimensional plane of the screen</td><td>5%</td></tr>
<tr><td>6</td><td>Three-dimensional space of the action (180°…)</td><td>4%</td></tr>
</table>
<p>Murch states it plainly: the top two outweigh the bottom four COMBINED. Torn between a cut that respects the 180° axis but feels lifeless, and one that slightly breaks it but lands on the strongest emotional beat — pick the second. Not a license to ignore technique; a priority order for when they CONFLICT, which is almost always in real editing.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — over-editing because you now know many cut names.</strong> Knowing eight names does not mean using all eight in one 3-minute video. Most runtime should still be plain hard cuts; J-cuts, L-cuts, match cuts, cutaways are seasoning for a few moments — season every dish and every dish tastes the same.</p></div>
<p class="note-ct"><strong>Continuing into Lesson 14.3:</strong> picking the right cut TYPE is one thing; picking the right MOMENT to cut is a matter of rhythm. The next lesson covers that.</p>

<h3>🎬 Practice (30 minutes)</h3>
<div class="callout ok"><ol>
<li>Reopen the fine cut from Lesson 14.1 (or any existing edit).</li>
<li>For 5 random cuts, write down the type and WHY — no reason means revisit that cut.</li>
<li>Find one hard cut that should be a J-cut/L-cut to preserve emotion, and fix it.</li>
<li>If two clips share a similar shape/motion, try joining them as a match cut.</li>
</ol><p><strong>Done when:</strong> you can name any cut's type plus its reason, instead of "it felt right."</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hard cut</span><span class="v">A clean change of shot, no transition.</span></div>
  <div class="kv"><span class="k">Match cut</span><span class="v">Joins two shots via a shared shape or motion.</span></div>
  <div class="kv"><span class="k">Cross-cut</span><span class="v">Cutting between two simultaneous actions.</span></div>
  <div class="kv"><span class="k">Smash cut</span><span class="v">A sudden, strongly contrasting cut.</span></div>
  <div class="kv"><span class="k">Cut on action</span><span class="v">Cutting mid-movement.</span></div>
  <div class="kv"><span class="k">Kuleshov effect</span><span class="v">Audiences assign emotion based on what sits next to a shot.</span></div>
  <div class="kv"><span class="k">Rule of Six</span><span class="v">Murch's six-criteria priority order for choosing a cut.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Eight cut types answer eight different questions — choose by INTENT, not habit.</li>
<li>Kuleshov: emotion comes from what shots sit NEXT TO each other, not the shot alone.</li>
<li>Rule of Six: emotion (51%) and story (23%) beat rhythm/eye-trace/spatial continuity whenever they conflict.</li>
<li>Knowing many cut names does not mean using them all — hard cuts should still dominate runtime.</li>
</ul>
<div class="link-card"><a href="https://web.arch.virginia.edu/arch5420/docs/reading/pdfmurch/murch_excerpt.pdf" target="_blank" rel="noopener">Walter Murch — excerpt of "The Rule of Six" chapter from <em>In the Blink of an Eye</em> (academic scan)</a></div>
<div class="link-card"><a href="https://www.studiobinder.com/blog/walter-murch-rule-of-six/" target="_blank" rel="noopener">StudioBinder — full breakdown of the six criteria and their percentages</a></div>
<div class="link-card"><a href="https://en.wikipedia.org/wiki/Kuleshov_effect" target="_blank" rel="noopener">Kuleshov effect — the experiment's history and Pudovkin's account</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2</span>
<h2>Tám kiểu cắt không phải tám lựa chọn ngẫu nhiên — mỗi kiểu trả lời một câu hỏi khác nhau</h2>
<p class="lead">Bài 14.1 chia dựng thành bốn lượt. Ở lượt fine cut, câu hỏi lặp lại hàng trăm lần là: "chỗ nối này nên là kiểu cắt gì?". Bài này cho bạn tám câu trả lời có tên, hai ý tưởng đứng sau chúng (hiệu ứng Kuleshov, Rule of Six của Walter Murch), và cách áp cả hai vào CapCut lẫn DaVinci Resolve.</p>
${slide('cr-14', 5, 'Tám kiểu cắt — bản đồ thuật ngữ')}

<h3>Hard cut, jump cut — mặc định, và khi nào jump cut gây khó chịu</h3>
<p><strong>Hard cut</strong> (đổi cảnh dứt khoát, không hiệu ứng) là kiểu cắt đứng sau hơn 90% thời lượng của bất kỳ video hay nào — Bài 12.3 đã khuyên mặc định KHÔNG dùng hiệu ứng chuyển cảnh, hard cut chính là "không hiệu ứng" đó. <strong>Jump cut</strong> (hai clip cùng cỡ cảnh/góc máy, chỉ khác thời điểm — chủ thể "nhảy" nhẹ) đã được Bài 12.2 dạy CÁCH tạo bằng Q/W trong CapCut hoặc ripple/roll trong Resolve (Ch.13); câu hỏi ở đây là PHÁN ĐOÁN. Với talking head trên mạng xã hội, khán giả đã quen nhịp này. Với phỏng vấn trang trọng hay nội dung cần cảm giác liền mạch, một chuỗi jump cut trần trụi liên tiếp lại gây khó chịu vì liên tục nhắc "đây là video đã dựng" — cách chữa là CHE những chỗ quan trọng bằng B-roll hoặc cutaway, để jump cut trần trụi ở chỗ tốc độ chính là mục tiêu.</p>

<h3>J-cut và L-cut — cùng kỹ thuật, khác chủ đích cảm xúc</h3>
${slide('cr-14', 7, 'J-cut và L-cut')}
<p>Resolve gọi đúng tên hai kỹ thuật tỉa lệch hình/tiếng này ở Ch.13 (roll trim); CapCut làm bằng cách tách audio khỏi clip rồi kéo riêng mép (Ch.12.2). Điều chưa nói ở hai chương đó là VÌ SAO chọn cái này thay cái kia:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">J-cut</span><span class="v">Tiếng cảnh SAU bắt đầu trước khi hình đổi — tai "tới" trước mắt, tạo chờ đợi, kéo chú ý VỀ PHÍA TRƯỚC. Dùng khi chuyển từ câu hỏi sang người trả lời.</span></div>
  <div class="kv"><span class="k">L-cut</span><span class="v">Tiếng cảnh TRƯỚC còn tiếp tục sau khi hình đã đổi — cảm xúc câu vừa nói "ở lại" một nhịp trong khi hình đã sang phản ứng người nghe. Dùng khi muốn khán giả THẤY hệ quả cảm xúc, không chỉ nghe.</span></div>
</div>
<p>Quy tắc thực dụng: "cảnh tiếp theo có gì hay?" → J-cut. "Cảnh vừa rồi tác động thế nào?" → L-cut.</p>

<h3>Match cut, cutaway — nối bằng hình dạng, che bằng khoảng rời</h3>
<p><strong>Match cut</strong> ghép hai cảnh khác lúc/nơi bằng một điểm chung về hình dạng hoặc chuyển động — não người xem tự nối chúng thành một mạch liền. Ví dụ kinh điển: khúc xương bay lên cắt thẳng sang tàu vũ trụ trong <em>2001: A Space Odyssey</em> (Kubrick, 1968) — cùng hình dạng xoay tròn, nối liền hàng triệu năm. Với footage của bạn: vòng xoay loading khi build code cắt sang bánh xe đạp quay lúc mở đầu vlog. <strong>Cutaway</strong> (Ch.4 đã phân biệt nó với insert) dùng khi cần bỏ qua một khoảng thời gian dài trong hành động liên tục — 40 phút lắp robot Mini-Me rút còn vài giây: cắt thẳng sẽ lộ như lỗi, chêm 2–4 giây một cảnh rời (đồng hồ, tay với công cụ) cho não khán giả một "khoảng nghỉ" chấp nhận thời gian đã trôi, rồi quay lại mà không ai thấy chỗ nối.</p>

<h3>Cross-cut, smash cut, cắt theo hành động — ba công cụ ít dùng nhưng đúng lúc rất mạnh</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cross-cut</span><span class="v">Cắt xen kẽ hai dòng hành động cùng lúc, khác chỗ (bạn code — bạn học test ở máy khác) — tạo so sánh/căng thẳng.</span></div>
  <div class="kv"><span class="k">Smash cut</span><span class="v">Cắt đột ngột, tương phản mạnh hình/tiếng — gây sốc nhẹ hoặc gây cười; lạm dụng thì hết tác dụng.</span></div>
  <div class="kv"><span class="k">Cắt theo hành động</span><span class="v">Cắt giữa một chuyển động đang diễn ra (tay chạm Enter) — mắt cuốn theo chuyển động nên không nhận ra chỗ nối; gốc rễ của "khớp hành động" đã học ở Ch.7.4.</span></div>
</div>
<p><strong>Dissolve</strong> (Ch.12.3 đã khuyên chỉ giữ MỘT kiểu chuyển cảnh nhẹ) báo hiệu "thời gian/địa điểm vừa đổi lớn" — dùng cho chuyển ngày, chuyển chương; dùng giữa hai khoảnh khắc thật ra liền mạch sẽ khiến khán giả hiểu nhầm có khoảng trống ở đó.</p>

<h3>Hiệu ứng Kuleshov — vì sao khán giả tự "diễn" cảm xúc thay diễn viên</h3>
${slide('cr-14', 10, 'Hiệu ứng Kuleshov')}
<p>Thập niên 1920, Lev Kuleshov ghép ĐÚNG MỘT cảnh cận mặt diễn viên Ivan Mosjoukine (không biểu cảm) với ba cảnh sau khác nhau: bát súp, bé gái trong quan tài, người phụ nữ nằm trên trường kỷ. Khán giả xem ba bản khác nhau mô tả cảm xúc của Mosjoukine là đói, đau buồn, ham muốn — dù khuôn mặt không đổi một milimet. Đạo diễn Vsevolod Pudovkin kể lại thí nghiệm năm 1929; phim gốc không còn lưu, nên ta biết về nó chủ yếu qua ghi chép của ông. Bài học: khán giả tự XÂY NGHĨA từ cách hai cảnh đặt cạnh nhau — đặt đúng cảnh sau một phản ứng trung tính, bạn không cần diễn quá lên, khán giả tự làm phần còn lại.</p>

<h3>Rule of Six của Walter Murch — khi hai cách cắt đều khả thi, ưu tiên cái nào</h3>
${slide('cr-14', 11, 'Rule of Six của Walter Murch')}
<p>Walter Murch — người dựng phim từng đoạt Oscar (Apocalypse Now, The English Patient) — viết trong <em>In the Blink of an Eye: A Perspective on Film Editing</em> (Silman-James Press, 1995/2001) sáu tiêu chí cho một nhát cắt tốt:</p>
<table>
<tr><th>#</th><th>Tiêu chí</th><th>Trọng số</th></tr>
<tr><td>1</td><td>Cảm xúc (Emotion)</td><td>51%</td></tr>
<tr><td>2</td><td>Câu chuyện (Story)</td><td>23%</td></tr>
<tr><td>3</td><td>Nhịp điệu (Rhythm)</td><td>10%</td></tr>
<tr><td>4</td><td>Hướng nhìn (Eye-trace)</td><td>7%</td></tr>
<tr><td>5</td><td>Mặt phẳng 2D màn hình</td><td>5%</td></tr>
<tr><td>6</td><td>Không gian 3D hành động (trục 180°…)</td><td>4%</td></tr>
</table>
<p>Murch nói rõ: hai tiêu chí ĐẦU quan trọng hơn BỐN tiêu chí sau CỘNG LẠI. Phân vân giữa cắt giữ đúng trục 180° nhưng "vô hồn" và cắt hơi phá trục nhưng đúng khoảnh khắc cảm xúc mạnh nhất — chọn cách sau. Không phải giấy phép bỏ qua kỹ thuật; là thứ tự ưu tiên khi chúng XUNG ĐỘT, điều gần như luôn xảy ra khi dựng thật.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — dựng quá tay vì vừa nhớ nhiều tên kiểu cắt.</strong> Biết tám cái tên không có nghĩa phải dùng cả tám trong một video 3 phút. Phần lớn thời lượng vẫn nên là hard cut; J-cut, L-cut, match cut, cutaway là gia vị cho vài khoảnh khắc quan trọng — rắc gia vị lên mọi món thì món nào cũng giống nhau.</p></div>
<p class="note-ct"><strong>Nối với Bài 14.3:</strong> chọn đúng KIỂU cắt là một chuyện; chọn đúng THỜI ĐIỂM để cắt — nhanh hay chậm, giữ hay bỏ một khoảng dừng — là chuyện của nhịp điệu. Bài sau đi vào đó.</p>

<h3>🎬 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Mở lại bản fine cut từ Bài 14.1 (hoặc một bản dựng có sẵn).</li>
<li>Với 5 chỗ cắt bất kỳ, viết ra kiểu cắt đang dùng và VÌ SAO nó đúng — không viết được lý do là dấu hiệu cần xem lại.</li>
<li>Tìm một chỗ đang hard cut nhưng lẽ ra nên J-cut/L-cut để giữ cảm xúc, sửa lại.</li>
<li>Nếu có hai clip hình dạng/chuyển động gần giống nhau, thử ghép thành match cut.</li>
</ol><p><strong>Đạt khi:</strong> bạn chỉ vào bất kỳ chỗ cắt nào và nói được tên kiểu cắt + lý do, thay vì "cắt vì nó vừa".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hard cut</span><span class="v">Đổi cảnh dứt khoát, không hiệu ứng.</span></div>
  <div class="kv"><span class="k">Match cut</span><span class="v">Nối hai cảnh khác lúc/nơi bằng hình dạng/chuyển động chung.</span></div>
  <div class="kv"><span class="k">Cross-cut</span><span class="v">Cắt xen kẽ hai dòng hành động cùng lúc.</span></div>
  <div class="kv"><span class="k">Smash cut</span><span class="v">Cắt đột ngột, tương phản mạnh.</span></div>
  <div class="kv"><span class="k">Cut on action</span><span class="v">Cắt giữa một chuyển động đang diễn ra.</span></div>
  <div class="kv"><span class="k">Kuleshov effect</span><span class="v">Khán giả gán cảm xúc cho một cảnh dựa vào cảnh đặt cạnh nó.</span></div>
  <div class="kv"><span class="k">Rule of Six</span><span class="v">Sáu tiêu chí ưu tiên của Walter Murch khi chọn cách cắt.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tám kiểu cắt trả lời tám câu hỏi khác nhau — chọn theo Ý ĐỊNH, không theo thói quen.</li>
<li>Kuleshov: khán giả tự gán cảm xúc dựa vào cảnh ĐẶT CẠNH nhau, không chỉ cảnh đang xem.</li>
<li>Rule of Six: cảm xúc (51%) và câu chuyện (23%) luôn thắng nhịp/hướng nhìn/liên tục không gian khi xung đột.</li>
<li>Biết tên nhiều kiểu cắt không có nghĩa phải dùng hết — hard cut vẫn nên là phần lớn thời lượng.</li>
</ul>
<div class="link-card"><a href="https://web.arch.virginia.edu/arch5420/docs/reading/pdfmurch/murch_excerpt.pdf" target="_blank" rel="noopener">Walter Murch — trích chương "The Rule of Six" trong sách <em>In the Blink of an Eye</em> (bản scan học thuật)</a></div>
<div class="link-card"><a href="https://www.studiobinder.com/blog/walter-murch-rule-of-six/" target="_blank" rel="noopener">StudioBinder — giải thích đầy đủ sáu tiêu chí và tỉ lệ % của Rule of Six</a></div>
<div class="link-card"><a href="https://en.wikipedia.org/wiki/Kuleshov_effect" target="_blank" rel="noopener">Kuleshov effect — lịch sử thí nghiệm và ghi chép của Pudovkin</a></div>
</div>
`,
    },

    /* ─────────────────── 14.3 Nhịp dựng & giữ chân ─────────────────── */
    {
      title: '14.3 — Pacing and retention|||14.3 — Nhịp dựng và giữ chân',
      slug: 'cr-14-3-nhip-giu-chan',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Độ dài shot điều khiển năng lượng của video thế nào, ngắt mẫu (pattern interrupt) giữ mắt người xem không lướt đi, khi nào nên GIỮ một khoảng dừng thay vì cắt, và cách đọc đồ thị giữ chân để sửa nhịp dựng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3</span>
<h2>Picking the right cut TYPE is not enough — you also need the right RHYTHM, or the audience leaves anyway</h2>
<p class="lead">Lesson 14.2 gave you eight cut types to choose from. This lesson is the second, equally important question: cut fast or slow, keep or drop a pause, how often something on screen needs to change. Get the pacing wrong — even if every individual cut is "the right type" — and the audience can still leave.</p>

<h3>Shot length sets the feeling</h3>
<p>Short shots (under 2 seconds) create urgency, excitement, deliberate chaos — good for high-energy montages, a short-form video's opening, action beats. Long shots (5 seconds or more) give the viewer time to ABSORB an idea — good for explaining a hard concept, an emotional beat, or any moment where you are teaching something that needs to be READ (a line of code on screen, a diagram). A common beginner mistake: applying ONE cutting speed to every section, including the hard-to-follow explanation — the screen changes before the viewer has finished reading the code.</p>

<h3>Cutting to the beat</h3>
<p>For music-driven montages, cutting exactly ON the beat (usually every 1, 2, or 4 beats) makes a cut feel "right" instinctively, even though the viewer cannot say why. In CapCut, select the music clip and press <strong>⌘J</strong> to auto-mark its beats (already mentioned in Ch.12.3). DaVinci Resolve has no automatic beat-detection covered in this course yet — the manual method: listen to the track, press <strong>M</strong> (marker — Ch.13) exactly on each beat, then drag the video clips' edges to line up with each marker.</p>
${slide('cr-14', 12, 'Không phải khoảng dừng nào cũng nên cắt')}

<h3>Not every pause deserves to be cut</h3>
<p>Lesson 12.2 taught HOW to cut silence, filler words, and ruined takes with Q/W. But "cut out every single pause" is not always correct — a well-placed pause (before an important idea, after a line that needs a moment to land) is a rhythm tool, exactly like a rest in music. Cutting out every pause makes the voice sound unnaturally rushed, relentless enough that the viewer is tired before the video ends. The question to ask at EVERY pause: is it deliberate (emphasis, giving the audience a moment to think), or just hesitation while you were recording? The first, KEEP. The second, CUT.</p>

<h3>Pattern interrupt — change something every few seconds</h3>
<p>A <strong>pattern interrupt</strong> is any visual or audio change that breaks monotony: a piece of B-roll, a keyframed punch-in (Ch.12.2), on-screen text or a graphic appearing, a sound effect (SFX — Lesson 14.4), or simply a camera-angle change if you shot multicam (Ch.10, Ch.13). The viewer's brain adapts VERY quickly to a static image — stare at the same frame too long (even with great content) and attention starts to drift. A pattern interrupt is not decoration for its own sake (Ch.12.3 already warned against overusing effects) — it has one specific job: pull the eye back right before it drifts.</p>

<h3>The first thirty seconds need a denser rhythm than the rest</h3>
<p>Chapter 3.1 already taught writing a hook for the first 3 and 30 seconds. At the editing stage, a great hook is not enough if the cutting rhythm of those same 30 seconds is as slow as the rest of the video — this is the stretch where the viewer has NOT yet committed to staying, so the density of pattern interrupts (cuts, text, sound) should be HIGHER than what you use mid-video. Once the first 30 seconds are past, the viewer has invested some time already, and the rhythm can naturally relax.</p>
${slide('cr-14', 13, 'Đọc đồ thị giữ chân')}

<h3>Reading a retention graph to know what to fix</h3>
<p>YouTube Studio and TikTok Studio plot the percentage of viewers still watching at every second (Chapter 23 teaches reading this metric in depth, on your channel's REAL numbers). Here, just understand the SHAPE: a drop in the first few seconds is normal (some viewers always leave the instant they see this is not what they were looking for); but a SUDDEN, extra drop at one specific stretch — not the opening — is a clear signal that stretch is losing viewers: maybe the pacing is too slow (not enough pattern interrupts), maybe a meaningless pause runs too long, maybe an explanation drags on. Conversely, a stretch of the line that stays nearly FLAT (little viewer loss) is a sign that section is doing something right — study it to repeat the formula in your next video.</p>
<p class="note-ct"><strong>The numbers on slide 13 are ILLUSTRATIVE ONLY</strong> — meant to show how the curve's shape changes once pattern interrupts are added, not the real data of any specific video. Your channel's REAL curve lives in YouTube Studio (Analytics → Content → pick a video → Audience retention).</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — over-editing.</strong> Cutting every 1–2 seconds for the entire video, a punch-in on every sentence, an SFX on every cut: it sounds like "keeping attention," but it actually exhausts the viewer and destroys their ability to follow the IDEA (especially damaging for coding tutorials, where viewers need time to READ the screen). A pattern interrupt works because it CONTRASTS with everything around it — use it constantly and it becomes the new "everything around it," and stops interrupting anything.</p></div>
<p class="note-ct"><strong>Continuing into Lesson 14.4:</strong> pacing does not come from picture alone — background music and SFX are just as powerful pattern-interrupt tools, and well-placed silence is a rhythm tool too. The next lesson covers music and sound design.</p>

<h3>🎬 Practice (25 minutes)</h3>
<div class="callout ok"><ol>
<li>Open the edit from Lesson 14.2. Count the average number of seconds between two "something changed on screen" moments (a cut, text appearing, a punch-in…) in the first 30 seconds, then in the middle of the video.</li>
<li>If the first 30 seconds are paced the same as or slower than the middle, add at least one pattern interrupt there.</li>
<li>Find one pause in the edit and ask yourself: keep or cut? Write down the reason.</li>
<li>If a video was already published (Section 0 or an earlier chapter), open its REAL retention graph in YouTube Studio/TikTok Studio, find an unusual drop, and guess why.</li>
</ol><p><strong>Done when:</strong> you can point to at least one place in the edit where the cutting rhythm is DELIBERATELY different from the rest (faster in the first 30s, or slower where the viewer needs to think) — not an unconsciously uniform rhythm throughout.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pacing</span><span class="v">The speed and density of on-screen change over time.</span></div>
  <div class="kv"><span class="k">Pattern interrupt</span><span class="v">Any visual/audio change that breaks monotony and pulls attention back.</span></div>
  <div class="kv"><span class="k">Retention</span><span class="v">The percentage of viewers still watching at each point in a video.</span></div>
  <div class="kv"><span class="k">Cut on the beat</span><span class="v">Placing a cut exactly on a musical beat.</span></div>
  <div class="kv"><span class="k">Over-editing</span><span class="v">Overusing pattern interrupts/effects to the point of exhausting the viewer instead of holding attention.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Short shots = urgency; long shots = time to absorb — choose by CONTENT, not one fixed speed for the whole video.</li>
<li>Not every pause should be cut — keep deliberate ones, cut only the meaningless ones.</li>
<li>Pattern interrupts every few seconds hold attention, but only work because they CONTRAST — overuse kills the effect.</li>
<li>The first 30 seconds need a denser rhythm; read the real retention graph (Ch.23) to find which stretch is losing viewers.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9314486" target="_blank" rel="noopener">YouTube Help — Reading the audience retention report</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3</span>
<h2>Cắt ĐÚNG kiểu chưa đủ — còn phải cắt ĐÚNG NHỊP thì khán giả mới ở lại</h2>
<p class="lead">Bài 14.2 cho bạn tám kiểu cắt để chọn. Bài này là câu hỏi thứ hai, quan trọng không kém: cắt nhanh hay chậm, giữ hay bỏ một khoảng dừng, bao lâu thì cần đổi một thứ gì đó trên màn hình. Nhịp dựng sai — dù mọi nhát cắt riêng lẻ đều "đúng kiểu" — vẫn có thể làm khán giả bỏ đi.</p>

<h3>Độ dài shot điều khiển cảm giác</h3>
<p>Shot ngắn (dưới 2 giây) tạo cảm giác gấp gáp, hào hứng, hỗn loạn có chủ đích — hợp cho montage năng lượng cao, mở đầu video ngắn, cảnh hành động. Shot dài (5 giây trở lên) cho khán giả thời gian THẤM một ý — hợp cho giải thích khái niệm khó, một khoảnh khắc cảm xúc, hoặc bất cứ lúc nào bạn đang dạy điều gì đó cần người xem ĐỌC (một đoạn code trên màn hình, một sơ đồ). Lỗi thường gặp của người mới học dựng: áp một tốc độ cắt cho MỌI đoạn, kể cả đoạn giải thích khó — khán giả chưa kịp đọc xong dòng code thì màn hình đã đổi cảnh.</p>

<h3>Cắt theo nhịp nhạc</h3>
<p>Với montage có nhạc nền, cắt ĐÚNG vào phách nhạc (thường mỗi 1, 2, hoặc 4 phách) khiến bản dựng "ăn khớp" một cách bản năng, dù khán giả không nhận ra vì sao. Trong CapCut, chọn clip nhạc rồi bấm <strong>⌘J</strong> để tự động đánh dấu phách (Ch.12.3 đã nhắc). DaVinci Resolve chưa có nút dò phách tự động trong phần chương này đã học — cách làm tay: nghe nhạc, bấm phím <strong>M</strong> (marker — Ch.13) đúng lúc nghe phách, rồi kéo mép clip hình khớp với từng marker.</p>
${slide('cr-14', 12, 'Không phải khoảng dừng nào cũng nên cắt')}

<h3>Không phải khoảng dừng nào cũng nên cắt</h3>
<p>Bài 12.2 dạy CÁCH cắt khoảng lặng, từ đệm, câu nói hỏng bằng Q/W. Nhưng "cắt sạch mọi khoảng lặng" không phải luôn đúng — một khoảng dừng ĐÚNG LÚC (trước một ý quan trọng, sau một câu cần thời gian để thấm) là công cụ nhịp điệu, y hệt một nốt lặng trong âm nhạc. Cắt sạch toàn bộ khoảng lặng khiến giọng nói nghe gấp gáp không tự nhiên, dồn dập tới mức khán giả mệt trước khi hết video. Câu hỏi cần tự hỏi ở MỖI khoảng dừng: nó có chủ đích (nhấn mạnh, cho khán giả thời gian suy nghĩ) hay chỉ là do bạn ngập ngừng lúc quay? Cái đầu GIỮ, cái sau CẮT.</p>

<h3>Ngắt mẫu (pattern interrupt) — đổi một thứ gì đó mỗi vài giây</h3>
<p><strong>Ngắt mẫu</strong> là bất cứ thay đổi thị giác/thính giác nào phá vỡ sự đơn điệu: chèn B-roll, một cú punch-in bằng keyframe (Ch.12.2), một dòng chữ/đồ hoạ xuất hiện, một hiệu ứng âm thanh (SFX — Bài 14.4), hay đơn giản là đổi góc máy nếu bạn quay đa máy (Ch.10, Ch.13). Bộ não người xem thích ứng RẤT nhanh với hình ảnh tĩnh — nhìn cùng một khung hình quá lâu (dù nội dung vẫn hay), sự chú ý bắt đầu trôi. Ngắt mẫu không phải "làm màu cho vui" (Ch.12.3 đã cảnh báo lạm dụng hiệu ứng) — nó có mục tiêu cụ thể: kéo mắt trở lại đúng lúc sắp trôi.</p>

<h3>Ba mươi giây đầu — nhịp phải dày hơn phần còn lại</h3>
<p>Ch.3.1 đã dạy viết hook cho 3 giây và 30 giây đầu. Ở khâu dựng, "hook hay" chưa đủ nếu nhịp cắt của chính 30 giây đó chậm như phần còn lại của video — đây là đoạn khán giả CHƯA cam kết ở lại, nên mật độ ngắt mẫu (đổi cảnh, chữ, âm thanh) nên DÀY hơn mức bạn dùng ở giữa video. Sau khi qua được 30 giây đầu, khán giả đã phần nào "đầu tư" thời gian và nhịp có thể giãn ra tự nhiên hơn.</p>
${slide('cr-14', 13, 'Đọc đồ thị giữ chân')}

<h3>Đọc đồ thị giữ chân để biết sửa nhịp ở đâu</h3>
<p>YouTube Studio và TikTok Studio vẽ ra đường cong % người xem còn ở lại theo từng giây (Chương 23 dạy đọc sâu chỉ số này trên số liệu THẬT của kênh bạn). Ở đây, chỉ cần hiểu HÌNH DẠNG: một cú dốc ở vài giây đầu là bình thường (một phần khán giả luôn rời đi ngay khi thấy đây không phải nội dung họ tìm); nhưng một cú DỐC THÊM đột ngột ở một đoạn cụ thể — không phải đầu video — là dấu hiệu RÕ RÀNG rằng đoạn đó đang mất khán giả: có thể nhịp quá chậm (thiếu ngắt mẫu), có thể một khoảng dừng vô nghĩa quá dài, có thể một đoạn giải thích quá lê thê. Ngược lại, một đoạn đường gần NẰM NGANG (ít mất khán giả) là dấu hiệu đoạn đó đang làm đúng — học lại chính đoạn đó để lặp lại công thức trong video sau.</p>
<p class="note-ct"><strong>Số liệu trên slide 13 chỉ là MINH HOẠ</strong> để thấy hình dạng đường cong thay đổi ra sao khi thêm ngắt mẫu — không phải số liệu thật của một video cụ thể nào. Đường cong THẬT của kênh bạn nằm trong YouTube Studio (Analytics → Nội dung → chọn video → Mức độ giữ chân người xem).</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — dựng quá tay.</strong> Cắt mỗi 1–2 giây suốt cả video, punch-in trên từng câu, SFX ở mọi lần cắt: nghe có vẻ "giữ chân" nhưng thật ra làm khán giả kiệt sức và mất khả năng theo dõi Ý (đặc biệt tai hại với video dạy code, nơi người xem cần thời gian ĐỌC màn hình). Ngắt mẫu có tác dụng vì nó TƯƠNG PHẢN với phần còn lại — dùng liên tục thì bản thân nó trở thành "phần còn lại", hết tác dụng ngắt.</p></div>
<p class="note-ct"><strong>Nối với Bài 14.4:</strong> nhịp dựng không chỉ tới từ hình ảnh — nhạc nền và SFX là công cụ ngắt mẫu mạnh không kém, và im lặng đúng lúc cũng là một công cụ nhịp điệu. Bài sau đi vào âm nhạc và thiết kế âm thanh.</p>

<h3>🎬 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Mở bản dựng từ Bài 14.2. Đếm số giây trung bình giữa hai lần "có gì đó đổi trên màn hình" (cắt, chữ xuất hiện, punch-in…) ở 30 giây đầu, rồi ở đoạn giữa video.</li>
<li>Nếu 30 giây đầu có nhịp CHẬM hơn hoặc bằng đoạn giữa, thêm ít nhất một ngắt mẫu vào đó.</li>
<li>Tìm một khoảng dừng trong bản dựng và tự hỏi: giữ hay cắt? Ghi lý do.</li>
<li>Nếu video đã đăng trước đó (Mục 0 hoặc chương trước), mở đồ thị giữ chân THẬT trong YouTube Studio/TikTok Studio, tìm một cú dốc bất thường và đoán lý do.</li>
</ol><p><strong>Đạt khi:</strong> bạn chỉ ra được ít nhất một chỗ trong bản dựng mà nhịp cắt CHỦ ĐỘNG khác với phần còn lại (nhanh hơn ở 30s đầu, hoặc chậm hơn ở đoạn cần suy ngẫm) — không phải nhịp đều một cách vô thức.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Nhịp dựng (pacing)</span><span class="v">Tốc độ và mật độ thay đổi trên màn hình theo thời gian.</span></div>
  <div class="kv"><span class="k">Ngắt mẫu (pattern interrupt)</span><span class="v">Bất kỳ thay đổi thị giác/thính giác nào phá vỡ sự đơn điệu, kéo lại sự chú ý.</span></div>
  <div class="kv"><span class="k">Giữ chân (retention)</span><span class="v">Tỉ lệ % người xem còn ở lại theo từng thời điểm của video.</span></div>
  <div class="kv"><span class="k">Cắt theo phách (cut on the beat)</span><span class="v">Đặt điểm cắt trùng với phách nhạc.</span></div>
  <div class="kv"><span class="k">Dựng quá tay (over-editing)</span><span class="v">Lạm dụng ngắt mẫu/hiệu ứng tới mức gây mệt mỏi thay vì giữ chân.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Shot ngắn = gấp gáp; shot dài = thời gian để thấm — chọn theo NỘI DUNG, không phải một tốc độ cố định cho cả video.</li>
<li>Không phải khoảng dừng nào cũng nên cắt — giữ khoảng dừng có chủ đích, chỉ cắt khoảng vô nghĩa.</li>
<li>Ngắt mẫu mỗi vài giây giữ sự chú ý, nhưng chỉ có tác dụng khi nó TƯƠNG PHẢN — lạm dụng thì mất tác dụng.</li>
<li>30 giây đầu cần nhịp dày hơn; đọc đồ thị giữ chân thật (Ch.23) để biết đoạn nào đang mất khán giả.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/9314486" target="_blank" rel="noopener">YouTube Help — Đọc báo cáo mức độ giữ chân người xem (Audience retention)</a></div>
</div>
`,
    },

    /* ─────────────────── 14.4 Âm nhạc & thiết kế âm thanh ─────────────────── */
    {
      title: '14.4 — Music and sound design|||14.4 — Âm nhạc và thiết kế âm thanh',
      slug: 'cr-14-4-nhac-thiet-ke-am-thanh',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Chọn nhạc theo cảm xúc chứ không theo "nhạc hay", vì sao nhạc có lời tranh giọng với bạn, cắt nhạc theo cấu trúc bài, ducking, SFX dùng khi nào, và vì sao im lặng cũng là một công cụ dựng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4</span>
<h2>Sound is half of pacing — and the half most beginners forget because all the attention goes to picture</h2>
<p class="lead">Lesson 14.3 was about rhythm on screen. This lesson is the other half: music, sound effects, and silence, which shape pacing just as much as cuts do — usually more, since sound reaches the audience even when they glance away from the screen.</p>

<h3>Choose music by emotion and energy, not by "this is a good song"</h3>
<p>Lesson 14.2's Rule of Six put emotion at 51% of what makes a cut work — the same priority applies to picking music, not just picking cuts. A track you personally love but with the WRONG energy (an epic, driving track under a calm, step-by-step tutorial) confuses the audience about the video's tone before they consciously notice why. Ask what the SCENE needs to feel like, not what song you want stuck in your head.</p>

<h3>Music with lyrics competes with your voice</h3>
<p>The brain does not handle two streams of WORDS well at the same time — your narration and a song's lyrics fight for the same attention, and the viewer ends up half-following both. Default to <strong>instrumental</strong> (no lyrics) tracks under any stretch where you are talking continuously; lyrical music works fine where there is no voice-over — a pure montage, an intro, end-credits.</p>

<h3>Cutting music to the song's structure, not just its beat</h3>
<p>Lesson 14.3 covered cutting picture exactly on individual beats. Zoom out one level: a song has a STRUCTURE (build-up, drop, verse, chorus), and picture pacing should shift when the music does — faster cuts as the track builds and drops, calmer, longer shots during a quieter verse. Cutting on individual beats but ignoring the song's larger shape is why some music-synced edits still feel "off" despite every cut technically landing on a beat.</p>
${slide('cr-14', 14, 'Nhạc, hiệu ứng âm thanh và ducking cùng lúc')}

<h3>Ducking — the principle behind the technique</h3>
<p>Chapter 12.3 already taught the CapCut mechanics: drop the music clip's volume roughly <strong>−15 to −20 dB</strong> under your voice, with keyframes so the change ramps instead of jumping. In DaVinci Resolve, the same idea lives on Fairlight through a volume automation curve (Chapter 16 goes deeper into both tools' mixing). The principle behind the number: the human ear prioritizes speech, but music and voice sitting at similar volumes still make the voice feel "buried" even when the raw level looks fine on a meter — Chapter 16 teaches measuring this properly with LUFS; for now, trust your ears plus ducking.</p>

<h3>SFX — where they belong, and where they do not</h3>
<p>CapCut's <strong>Audio</strong> tab (the one you toured in Lesson 12.1) carries a sound-effects library alongside music. Use SFX at <strong>cut points or emphasis points</strong> only — a whoosh under a fast transition, a click when text or a graphic appears, <strong>ambience</strong> (background environmental sound — room tone, street noise, a keyboard clacking) filling the gap between two cuts so the mix does not suddenly go dead-silent. Slide 14's warning from earlier in this chapter applies here directly: SFX on every single cut stops registering as anything special — save it for the cuts that need extra punctuation.</p>

<h3>Silence is a tool, not an absence</h3>
<p>After an important line, a moment with no music and no SFX draws MORE attention than adding another effect would — because it contrasts with everything around it, the same pattern-interrupt logic from Lesson 14.3, just in its rarest and strongest form. Most editors reach for "add something" by instinct; reaching for "take everything away for one second" is a deliberate, less-used, more powerful move.</p>

<h3>Room tone fills the seams between cuts</h3>
<p>Chapter 9.3 already had you record 30 seconds of <strong>room tone</strong> on location. Here is where it gets used: joining two clips with different background noise levels (a fan that was on in one, off in the other; a different room entirely) creates an audible "seam" even when the picture cut is smooth. Laying a thin layer of room tone under the join — or over a quiet transition — keeps the ear from noticing the switch.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — lyrical music under narration with no ducking.</strong> The single most common beginner audio mistake: a track you like, left at a comfortable listening volume, playing under your entire voice-over. The words fight the words, and by the second sentence the viewer cannot follow either. Instrumental first, then duck what is left.</p></div>
<p class="note-ct"><strong>Continuing into Chapter 15:</strong> picture is locked (Ch.14.1), cuts are chosen with intent (Ch.14.2), rhythm is deliberate (Ch.14.3), and now music/SFX/silence are placed (Ch.14.4) — only now does color grading make sense, because color is applied per clip on a timeline that will not change again.</p>

<h3>🎬 Practice (25–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Add a background track to the edit from Lesson 14.3. Pick it for energy/emotion, not personal taste — write one sentence justifying the choice.</li>
<li>If the track has lyrics and there is narration, swap it for an instrumental version or a different track.</li>
<li>Duck the music under every stretch of speech (CapCut keyframes or Resolve automation), −15…−20 dB as a starting point.</li>
<li>Add SFX at exactly 2–3 cut points that deserve emphasis — no more.</li>
<li>Find one important line and remove all sound under it for half a second right after it lands. Listen to the difference.</li>
</ol><p><strong>Done when:</strong> the voice is always clearly audible over the music, SFX appear only at deliberate points, and you can identify the one moment of silence you added on purpose.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Instrumental</span><span class="v">Music with no lyrics — the default choice under continuous narration.</span></div>
  <div class="kv"><span class="k">Ducking</span><span class="v">Automatically or manually lowering music volume while voice is present.</span></div>
  <div class="kv"><span class="k">SFX</span><span class="v">Short sound effects (whoosh, click…) used to punctuate a cut or emphasis point.</span></div>
  <div class="kv"><span class="k">Ambience</span><span class="v">Background environmental sound that fills a mix so it never goes dead-silent.</span></div>
  <div class="kv"><span class="k">Room tone</span><span class="v">The recorded "silence" of a location, used to smooth audio seams between clips.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Pick music for emotion/energy, matching Rule of Six's own top priority — not personal taste.</li>
<li>Lyrics compete with narration — default to instrumental under continuous speech.</li>
<li>Cut to the song's structure, not just individual beats; duck music under voice by ear, refined later with LUFS (Ch.16).</li>
<li>SFX belong at deliberate cut/emphasis points; silence and room tone are tools too, not gaps to fill by accident.</li>
</ul>
<div class="link-card"><a href="https://www.youtube.com/audiolibrary" target="_blank" rel="noopener">YouTube Audio Library — nhạc và SFX miễn phí, lọc theo cảm xúc/thể loại</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4</span>
<h2>Âm thanh là một nửa của nhịp dựng — và là nửa người mới hay quên vì mọi sự chú ý dồn vào hình</h2>
<p class="lead">Bài 14.3 nói về nhịp trên hình. Bài này là nửa còn lại: nhạc, hiệu ứng âm thanh, và im lặng — định hình nhịp không kém gì các nhát cắt, thường còn MẠNH hơn, vì âm thanh vẫn tới được khán giả ngay cả khi họ lướt mắt sang chỗ khác.</p>

<h3>Chọn nhạc theo cảm xúc và năng lượng, không theo "bài này hay"</h3>
<p>Rule of Six ở Bài 14.2 đặt cảm xúc ở mức 51% — cùng thứ tự ưu tiên đó áp dụng cho việc chọn nhạc, không chỉ chọn cách cắt. Một bài bạn thích nhưng SAI năng lượng (nhạc hùng tráng cho một video hướng dẫn nhẹ nhàng, từng bước) làm khán giả bối rối về tông của video trước khi họ kịp nhận ra vì sao. Hỏi cảnh này CẦN cảm giác gì, đừng hỏi bạn muốn nghe bài nào.</p>

<h3>Nhạc có lời tranh với giọng của bạn</h3>
<p>Não người không xử lý tốt hai luồng LỜI cùng lúc — giọng bạn và lời bài hát tranh nhau cùng một sự chú ý, khán giả cuối cùng theo dõi nửa vời cả hai. Mặc định dùng nhạc <strong>không lời (instrumental)</strong> ở mọi đoạn bạn đang nói liên tục; nhạc có lời chỉ hợp ở đoạn không có giọng nói — một montage thuần, đoạn mở đầu, phần credit cuối.</p>

<h3>Cắt nhạc theo CẤU TRÚC bài, không chỉ theo phách</h3>
<p>Bài 14.3 đã nói cắt hình đúng vào từng phách nhạc. Nhìn rộng hơn một bậc: một bài nhạc có CẤU TRÚC (đoạn dồn nhịp, đoạn cao trào, verse, chorus), và nhịp hình nên đổi theo khi nhạc đổi — cắt nhanh hơn khi nhạc dồn/cao trào, shot chậm và dài hơn khi nhạc lắng. Cắt đúng từng phách nhưng bỏ qua hình dạng lớn của bài nhạc là lý do một số bản dựng theo nhạc vẫn nghe "lệch" dù mọi nhát cắt về kỹ thuật đều đúng phách.</p>
${slide('cr-14', 14, 'Nhạc, hiệu ứng âm thanh và ducking cùng lúc')}

<h3>Ducking — nguyên lý đứng sau kỹ thuật</h3>
<p>Ch.12.3 đã dạy thao tác trong CapCut: hạ âm lượng clip nhạc xuống khoảng <strong>−15 đến −20dB</strong> dưới giọng nói, dùng keyframe để thay đổi lên/xuống mượt chứ không giật. Trong DaVinci Resolve, cùng nguyên lý nằm ở Fairlight qua đường tự động hoá âm lượng (Chương 16 đi sâu vào cả hai công cụ trộn âm). Nguyên lý đứng sau con số đó: tai người ưu tiên nghe lời nói, nhưng nhạc và giọng ở mức âm lượng gần nhau vẫn khiến giọng nghe "bị chìm" dù đồng hồ đo mức âm nhìn có vẻ ổn — Chương 16 dạy đo chính xác bằng LUFS; còn ở đây, tin vào tai bạn cộng với ducking.</p>

<h3>SFX — nơi nó thuộc về, và nơi không</h3>
<p>Tab <strong>Audio</strong> của CapCut (bạn đã tour qua ở Bài 12.1) mang theo thư viện hiệu ứng âm thanh bên cạnh nhạc. Chỉ dùng SFX ở <strong>điểm cắt hoặc điểm cần nhấn</strong> — một tiếng whoosh dưới một chuyển cảnh nhanh, một tiếng click khi chữ/đồ hoạ xuất hiện, <strong>ambience</strong> (âm thanh môi trường nền — tiếng phòng, tiếng phố, tiếng gõ phím) lấp khoảng giữa hai lần cắt để bản mix không đột ngột im bặt. Lời cảnh báo ở slide 14 từ đầu chương áp dụng thẳng ở đây: SFX ở MỌI lần cắt thì không còn được ghi nhận là gì đặc biệt — dành nó cho những chỗ thật sự cần thêm dấu chấm câu.</p>

<h3>Im lặng là một công cụ, không phải một khoảng trống</h3>
<p>Sau một câu quan trọng, một khoảnh khắc không nhạc không SFX gây chú ý MẠNH hơn là thêm một hiệu ứng — vì nó tương phản với mọi thứ xung quanh, cùng logic ngắt mẫu đã nói ở Bài 14.3, chỉ là ở dạng hiếm nhất và mạnh nhất. Phần lớn người dựng theo bản năng chỉ nghĩ tới "thêm gì đó vào"; nghĩ tới "lấy hết mọi thứ ra trong một giây" là một lựa chọn có chủ đích, ít dùng hơn, nhưng mạnh hơn.</p>

<h3>Room tone lấp chỗ nối giữa các lần cắt</h3>
<p>Ch.9.3 đã cho bạn thu 30 giây <strong>room tone</strong> tại hiện trường. Đây là lúc dùng tới nó: nối hai clip có mức ồn nền khác nhau (quạt bật ở clip này, tắt ở clip kia; hai phòng hoàn toàn khác nhau) tạo ra một "đường nối" nghe rõ dù hình cắt mượt. Lót một lớp room tone mỏng dưới chỗ nối — hoặc dưới một đoạn chuyển tiếp yên tĩnh — giữ cho tai không nhận ra cú chuyển.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — nhạc có lời chạy dưới cả bài nói, không ducking.</strong> Lỗi âm thanh phổ biến nhất của người mới: một bài bạn thích, để ở mức âm lượng nghe thoải mái, chạy suốt dưới toàn bộ lời bạn nói. Lời tranh với lời, và tới câu thứ hai khán giả không theo kịp được cái nào. Chọn nhạc không lời trước, rồi mới ducking phần còn lại.</p></div>
<p class="note-ct"><strong>Nối với Chương 15:</strong> hình đã khoá (Ch.14.1), kiểu cắt đã chọn có chủ đích (Ch.14.2), nhịp đã có tính toán (Ch.14.3), và giờ nhạc/SFX/im lặng đã được đặt đúng chỗ (Ch.14.4) — chỉ tới lúc này chỉnh màu mới có nghĩa, vì màu áp theo TỪNG clip trên một timeline sẽ không đổi nữa.</p>

<h3>🎬 Thực hành (25–30 phút)</h3>
<div class="callout ok"><ol>
<li>Thêm nhạc nền vào bản dựng từ Bài 14.3. Chọn theo năng lượng/cảm xúc, không theo sở thích cá nhân — viết một câu giải thích lý do chọn.</li>
<li>Nếu bài có lời và video có giọng nói, đổi sang bản không lời hoặc bài khác.</li>
<li>Ducking nhạc dưới mọi đoạn có giọng nói (keyframe CapCut hoặc automation Resolve), bắt đầu ở khoảng −15…−20dB.</li>
<li>Thêm SFX ở đúng 2–3 điểm cắt xứng đáng được nhấn — không hơn.</li>
<li>Tìm một câu quan trọng, cắt hết âm thanh dưới nó nửa giây ngay sau khi câu đó vừa dứt. Nghe lại sự khác biệt.</li>
</ol><p><strong>Đạt khi:</strong> giọng nói luôn nghe rõ hơn nhạc nền, SFX chỉ xuất hiện ở những điểm có chủ đích, và bạn chỉ ra được đúng một khoảnh khắc im lặng bạn đã thêm có chủ ý.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Instrumental</span><span class="v">Nhạc không lời — lựa chọn mặc định dưới đoạn có giọng nói liên tục.</span></div>
  <div class="kv"><span class="k">Ducking</span><span class="v">Tự động hoặc tự tay hạ âm lượng nhạc khi có giọng nói.</span></div>
  <div class="kv"><span class="k">SFX</span><span class="v">Hiệu ứng âm thanh ngắn (whoosh, click…) dùng để nhấn một chỗ cắt/nhấn mạnh.</span></div>
  <div class="kv"><span class="k">Ambience</span><span class="v">Âm thanh môi trường nền, lấp bản mix để không bao giờ im bặt đột ngột.</span></div>
  <div class="kv"><span class="k">Room tone</span><span class="v">"Sự im lặng" đã thu tại hiện trường, dùng làm mượt chỗ nối âm thanh giữa các clip.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chọn nhạc theo cảm xúc/năng lượng, đúng thứ tự ưu tiên của Rule of Six — không theo sở thích cá nhân.</li>
<li>Lời bài hát tranh với lời nói — mặc định dùng nhạc không lời dưới đoạn có giọng nói liên tục.</li>
<li>Cắt theo cấu trúc bài nhạc, không chỉ từng phách; ducking bằng tai, tinh chỉnh sau bằng LUFS (Ch.16).</li>
<li>SFX thuộc về những điểm cắt/nhấn có chủ đích; im lặng và room tone cũng là công cụ, không phải khoảng trống bỏ quên.</li>
</ul>
<div class="link-card"><a href="https://www.youtube.com/audiolibrary" target="_blank" rel="noopener">YouTube Audio Library — nhạc và SFX miễn phí, lọc theo cảm xúc/thể loại</a></div>
</div>
`,
    },

    /* ─────────────────── 14.5 Kiểm tra chương ─────────────────── */
    {
      title: '14.5 — Chapter 14 check|||14.5 — Kiểm tra chương 14',
      slug: 'cr-14-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: '10 câu tình huống về bốn lượt dựng, tám kiểu cắt, hiệu ứng Kuleshov, Rule of Six, nhịp giữ chân, và âm nhạc/thiết kế âm thanh.',
      content: `
<div class="ml-en"><p class="lead">Ten situational questions covering everything in Chapter 14: the four editing passes, the eight named cuts, the Kuleshov effect, Walter Murch's Rule of Six, pacing and pattern interrupts, and music/sound design.</p>
<h3>The chapter in one checklist</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">14.1</span><span class="lz-t">Edit in passes</span><span class="lz-d">Assembly → rough → fine → picture lock. Lock BEFORE color/sound/captions. Watch with fresh eyes before locking.</span></div>
  <div class="lz-step"><span class="lz-k">14.2</span><span class="lz-t">Choose cuts on purpose</span><span class="lz-d">Eight named cuts answer eight different questions. Kuleshov: meaning comes from what sits NEXT TO a shot. Rule of Six: emotion (51%) and story (23%) outrank the rest.</span></div>
  <div class="lz-step"><span class="lz-k">14.3</span><span class="lz-t">Design the rhythm</span><span class="lz-d">Shot length by content, not habit. Keep deliberate pauses, cut meaningless ones. Pattern interrupts work because they contrast — overuse kills them.</span></div>
  <div class="lz-step"><span class="lz-k">14.4</span><span class="lz-t">Place sound with intent</span><span class="lz-d">Music by emotion, instrumental under narration, ducking by ear, SFX only at deliberate points, silence as a tool.</span></div>
</div>
<p class="note-ct">Every answer below traces back to a specific fact checked against Chapter 12/13's confirmed CapCut/Resolve features, or against a cited source (Murch's book, the Kuleshov effect's history) — not a guess.</p></div>
<div class="ml-vi"><p class="lead">Mười câu tình huống bao trọn Chương 14: bốn lượt dựng, tám kiểu cắt có tên, hiệu ứng Kuleshov, Rule of Six của Walter Murch, nhịp dựng và ngắt mẫu, và nhạc/thiết kế âm thanh.</p>
<h3>Cả chương trong một checklist</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">14.1</span><span class="lz-t">Dựng theo lượt</span><span class="lz-d">Assembly → rough → fine → picture lock. Khoá hình TRƯỚC màu/âm/phụ đề. Xem bằng mắt mới trước khi khoá.</span></div>
  <div class="lz-step"><span class="lz-k">14.2</span><span class="lz-t">Chọn cách cắt có chủ đích</span><span class="lz-d">Tám kiểu cắt có tên trả lời tám câu hỏi khác nhau. Kuleshov: nghĩa tới từ cảnh ĐẶT CẠNH. Rule of Six: cảm xúc (51%) và câu chuyện (23%) thắng phần còn lại.</span></div>
  <div class="lz-step"><span class="lz-k">14.3</span><span class="lz-t">Thiết kế nhịp điệu</span><span class="lz-d">Độ dài shot theo nội dung, không theo thói quen. Giữ khoảng dừng có chủ đích, cắt khoảng vô nghĩa. Ngắt mẫu có tác dụng vì tương phản — lạm dụng thì mất tác dụng.</span></div>
  <div class="lz-step"><span class="lz-k">14.4</span><span class="lz-t">Đặt âm thanh có chủ đích</span><span class="lz-d">Nhạc theo cảm xúc, không lời dưới đoạn có giọng, ducking bằng tai, SFX chỉ ở điểm có chủ đích, im lặng cũng là công cụ.</span></div>
</div>
<p class="note-ct">Mọi đáp án dưới đây đều bám theo một sự thật cụ thể — đã kiểm với các tính năng CapCut/Resolve đã xác nhận ở Chương 12/13, hoặc với nguồn đã trích dẫn (sách của Murch, lịch sử hiệu ứng Kuleshov) — không phải đoán.</p></div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You have just laid down every selected take in the exact order of your shot list — the video plays almost twice as long as the planned final length, and you have not trimmed a single line yet. Which of the four passes are you in?|||Bạn vừa ráp mọi selects theo đúng thứ tự shot list — video dài gần gấp đôi bản cuối dự kiến, chưa cắt bớt một câu nào. Bạn đang ở lượt nào trong bốn lượt dựng?',
            options: [
              'Assembly cut|||Assembly cut',
              'Rough cut|||Rough cut',
              'Fine cut|||Fine cut',
              'Picture lock|||Picture lock',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Laying down selects in script order with no trimming or pacing decisions yet is exactly the assembly cut (Lesson 14.1) — its only goal is a version that plays start to finish. Rough cut has already trimmed dead weight; fine cut is frame-accurate; picture lock means no more changes.|||VI: Ráp selects theo đúng thứ tự kịch bản, chưa cắt bớt hay lo nhịp, chính là assembly cut (Bài 14.1) — mục tiêu duy nhất của nó là một bản CHẠY ĐƯỢC từ đầu tới cuối. Rough cut đã cắt bớt phần thừa; fine cut đã tinh từng khung hình; picture lock nghĩa là không đổi gì nữa.',
          },
          {
            question: 'You finished the fine cut and already started color-grading clip by clip. Halfway through, you decide to trim 5 seconds out of a section at the 2-minute mark. Compared to cutting BEFORE color, what extra work does this create?|||Bạn vừa xong fine cut và đã bắt đầu chỉnh màu từng clip. Giữa chừng bạn muốn cắt bớt 5 giây ở phút thứ 2. So với cắt TRƯỚC khi làm màu, việc này tạo thêm công gì?',
            options: [
              'Nothing extra — Resolve/CapCut automatically re-applies color to the new cut|||Không thêm gì — Resolve/CapCut tự áp lại màu theo cắt mới',
              'Only re-exporting is needed; color and captions are unaffected|||Chỉ cần xuất lại video, màu và phụ đề không bị ảnh hưởng',
              'Only the audio mix is affected, not color or captions|||Chỉ ảnh hưởng âm thanh, không ảnh hưởng màu hay phụ đề',
              'You have to redo the color nodes that fall out of sync with the new clip, and re-time any captions after the cut point|||Phải làm lại các node màu bị lệch theo clip mới, và canh lại thời gian phụ đề phía sau chỗ cắt (nếu đã có)',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: This is exactly why Lesson 14.1 insists on picture lock before finishing color/captions: color nodes and auto-captions are both applied per clip / by timecode, so re-cutting after either exists means redoing that work, not just re-exporting.|||VI: Đây đúng là lý do Bài 14.1 nhấn mạnh khoá hình trước khi làm màu/phụ đề: node màu và phụ đề tự động đều áp theo từng clip/theo timecode, nên cắt lại sau khi đã có một trong hai nghĩa là phải làm lại phần đó, không chỉ xuất lại file.',
          },
          {
            question: 'You are editing a 10-minute formal interview for an article, using nothing but bare, back-to-back jump cuts with no B-roll or cutaways covering any of them. What is the biggest problem with this?|||Bạn dựng một buổi phỏng vấn trang trọng 10 phút cho một bài báo, toàn bộ là jump cut trần trụi liên tiếp, không có B-roll hay cutaway che chỗ nào. Vấn đề lớn nhất là gì?',
            options: [
              'Jump cuts are always a technical error and must be removed entirely|||Jump cut luôn là lỗi kỹ thuật, phải xoá hết',
              'A constant string of bare jump cuts keeps reminding the viewer "this is an edited video," breaking the natural, formal feeling an interview needs|||Chuỗi jump cut trần trụi liên tục nhắc khán giả "đây là video đã dựng", phá vỡ cảm giác tự nhiên, trang trọng mà một phỏng vấn cần',
              'There is no problem — jump cuts are always fine for any kind of video|||Không có vấn đề gì — jump cut luôn ổn với mọi loại video',
              'Jump cuts are only a problem if the video is longer than 5 minutes|||Jump cut chỉ có vấn đề nếu video dài hơn 5 phút',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Lesson 14.2 is explicit: jump cuts are normal for social talking-head content, but a formal, unbroken-feeling interview is exactly the case where bare, uncovered jump cuts grate — the fix is covering the important ones with B-roll or a cutaway, not removing jump cuts altogether.|||VI: Bài 14.2 nói rõ: jump cut bình thường với talking head mạng xã hội, nhưng một phỏng vấn trang trọng, cần cảm giác liền mạch chính là trường hợp jump cut trần trụi gây khó chịu nhất — cách chữa là che những chỗ quan trọng bằng B-roll/cutaway, không phải bỏ hẳn jump cut.',
          },
          {
            question: 'In your edit, you can hear your classmate start laughing half a second BEFORE the picture cuts to their face. What technique is this, and what effect does it create?|||Trong bản dựng, bạn nghe thấy tiếng cười của bạn học nửa giây TRƯỚC KHI hình cắt sang mặt họ. Đây là kỹ thuật gì, và tạo hiệu ứng gì?',
            options: [
              'L-cut — it keeps the emotion of the previous line lingering|||L-cut — giữ cảm xúc của câu vừa nói ở lại',
              'Match cut — it joins two moments through similar sound|||Match cut — nối hai khoảnh khắc bằng âm thanh giống nhau',
              'J-cut — it pulls the viewer toward the next scene by ear before the picture arrives, creating anticipation|||J-cut — kéo người xem tới cảnh sau bằng tai trước khi hình tới, tạo sự chờ đợi',
              'Cross-cut — it compares two actions happening at the same time|||Cross-cut — so sánh hai dòng hành động diễn ra cùng lúc',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Audio from the NEXT scene starting before its picture is, by definition, a J-cut (Lesson 14.2) — the ear reaches the new scene first, pulling attention forward. An L-cut would be the opposite: the OLD scene\'s audio continuing after the picture has changed.|||VI: Tiếng của cảnh SAU bắt đầu trước khi hình của nó tới, theo đúng định nghĩa, là J-cut (Bài 14.2) — tai tới cảnh mới trước, kéo sự chú ý về phía trước. L-cut sẽ ngược lại: tiếng của cảnh CŨ còn tiếp tục sau khi hình đã đổi.',
          },
          {
            question: 'You cut from a spinning loading icon on a terminal straight to a bicycle wheel spinning at the start of a vlog — different moments, different content, but the same rotating circle carries the eye across the cut. What cut type is this?|||Bạn cắt từ vòng xoay loading trên terminal thẳng sang bánh xe đạp đang quay ở đầu vlog — khác khoảnh khắc, khác nội dung, nhưng cùng một vòng tròn đang xoay dẫn mắt qua nhát cắt. Đây là kiểu cắt gì?',
            options: [
              'Match cut — joining two moments through a shared shape or motion|||Match cut — nối hai khoảnh khắc bằng hình dạng/chuyển động chung',
              'Cutaway — leaving the main action briefly|||Cutaway — rời khỏi hành động chính một chút',
              'Smash cut — a sudden, jarring contrast|||Smash cut — cắt đột ngột, tương phản mạnh',
              'Cut on action — cutting in the middle of a movement|||Cut on action — cắt giữa một chuyển động',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Two shots from different times/places joined by a shared visual shape or motion — here, two circles spinning — is the definition of a match cut (Lesson 14.2), the same logic as the terminal-to-bicycle-wheel example in the lesson.|||VI: Hai cảnh khác lúc/khác nơi nối bằng một hình dạng hoặc chuyển động chung — ở đây là hai vòng tròn đang xoay — đúng định nghĩa match cut (Bài 14.2), cùng logic với ví dụ terminal cắt sang bánh xe đạp trong bài học.',
          },
          {
            question: 'You use the exact same neutral reaction shot of yourself (your expression never changes) and pair it, in turn, with three different follow-up shots (a code error, a passing test suite, a frozen loading bar). Viewers of the three versions describe your emotion completely differently each time. Why?|||Bạn dùng ĐÚNG MỘT cảnh phản ứng trung tính của mình (biểu cảm không đổi), lần lượt ghép với ba cảnh sau khác nhau (lỗi code, test pass, thanh loading đứng yên). Khán giả xem ba bản mô tả cảm xúc của bạn hoàn toàn khác nhau mỗi lần. Vì sao?',
            options: [
              'Because the face shot was actually slightly different in each version, even though it looked the same|||Vì cảnh mặt thực ra hơi khác nhau giữa các bản, dù trông có vẻ giống',
              'Because each version used different background music, which changed the perceived emotion|||Vì mỗi bản dùng nhạc nền khác nhau nên cảm xúc cảm nhận bị ảnh hưởng',
              'Because the playback speed differed slightly between the three versions|||Vì tốc độ phát giữa ba bản hơi khác nhau',
              'Because viewers automatically assign emotion to a neutral shot based on whatever shot sits next to it — the Kuleshov effect|||Vì khán giả tự động gán cảm xúc cho một cảnh trung tính dựa vào cảnh ĐẶT CẠNH nó — hiệu ứng Kuleshov',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: This is a direct application of the Kuleshov effect (Lesson 14.2): Lev Kuleshov paired one identical shot of actor Ivan Mosjoukine with three different follow-ups and audiences read three different emotions, even though the face never changed — meaning comes from juxtaposition, not the shot alone.|||VI: Đây là ứng dụng trực tiếp của hiệu ứng Kuleshov (Bài 14.2): Lev Kuleshov ghép một cảnh y hệt của diễn viên Ivan Mosjoukine với ba cảnh sau khác nhau, khán giả đọc ra ba cảm xúc khác nhau dù khuôn mặt không hề đổi — nghĩa tới từ việc đặt cạnh nhau, không phải từ riêng một cảnh.',
          },
          {
            question: 'You are torn between two cuts at the same point: Cut A respects the 180° axis and eyeline perfectly but feels lifeless; Cut B slightly breaks the 180° axis but lands exactly on the scene\'s strongest emotional beat. According to Walter Murch\'s Rule of Six, which should you choose?|||Bạn phân vân giữa hai cách cắt cho cùng một chỗ: cách A giữ đúng trục 180° và hướng nhìn nhưng cảm giác vô hồn; cách B hơi phá trục 180° nhưng rơi đúng khoảnh khắc cảm xúc mạnh nhất của cảnh. Theo Rule of Six của Walter Murch, nên chọn cách nào?',
            options: [
              'Cut A, because the 180° axis is a technical rule that must never be broken|||Cách A, vì trục 180° là nguyên tắc kỹ thuật không được phá',
              'Cut B, because emotion and story rank far above 3D spatial continuity (180°/eyeline) whenever they conflict|||Cách B, vì cảm xúc và câu chuyện được ưu tiên cao hơn nhiều so với liên tục không gian 3D (trục 180°/hướng nhìn) khi chúng xung đột',
              'Neither — reshoot the scene instead|||Cả hai đều sai — phải quay lại cảnh này',
              'It depends entirely on the total length of the video|||Tuỳ vào độ dài tổng thể của video mà quyết định',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Murch\'s own ranking puts emotion at 51% and story at 23%, against eye-trace at 7% and 3D spatial continuity at only 4% — the top two criteria outweigh the bottom four combined (Lesson 14.2). This is not permission to ignore technique, but a priority order for when criteria conflict.|||VI: Chính bảng xếp hạng của Murch đặt cảm xúc ở 51% và câu chuyện ở 23%, so với hướng nhìn chỉ 7% và liên tục không gian 3D chỉ 4% — hai tiêu chí đầu quan trọng hơn bốn tiêu chí sau cộng lại (Bài 14.2). Đây không phải giấy phép bỏ qua kỹ thuật, mà là thứ tự ưu tiên khi các tiêu chí xung đột.',
          },
          {
            question: 'You want the switch from camera angle A to camera angle B to go completely unnoticed, cutting exactly while a finger is pressing the Enter key in both shots. Which approach hides the cut best?|||Bạn muốn việc đổi từ góc máy A sang góc máy B hoàn toàn không bị nhận ra, cắt đúng lúc một ngón tay đang bấm phím Enter ở cả hai cảnh. Cách nào giấu chỗ cắt tốt nhất?',
            options: [
              'Cut exactly in the middle of the finger\'s motion — cutting on action, since the eye follows the movement and misses the join|||Cắt đúng GIỮA lúc ngón tay đang di chuyển — cắt theo hành động, mắt người xem bị cuốn theo chuyển động nên không nhận ra chỗ nối',
              'Cut right before the finger starts moving|||Cắt ngay TRƯỚC khi ngón tay bắt đầu di chuyển',
              'Cut right after the finger has come to a complete stop|||Cắt ngay SAU khi ngón tay đã dừng hẳn',
              'Add a 1-second dissolve between the two angles|||Thêm một dissolve dài 1 giây giữa hai góc máy',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: This is the definition of cutting on action (Lesson 14.2): cutting mid-movement keeps the viewer\'s eye following the motion instead of noticing the join — the root of the "matching action" principle from Ch.7.4. Cutting before/after the motion (options B/C) exposes the join; a dissolve (D) signals a big time/place jump, which is not what this moment needs.|||VI: Đây đúng là định nghĩa cắt theo hành động (Bài 14.2): cắt giữa chuyển động khiến mắt người xem bị cuốn theo chuyển động thay vì nhận ra chỗ nối — gốc rễ của nguyên tắc "khớp hành động" ở Ch.7.4. Cắt trước/sau chuyển động (câu B/C) làm lộ chỗ nối; dissolve (câu D) báo hiệu một cú nhảy lớn về thời gian/địa điểm, không phải điều khoảnh khắc này cần.',
          },
          {
            question: 'Your coding tutorial cuts every 1–2 seconds from start to finish, with a punch-in on every sentence and an SFX on every single cut. The retention graph drops unusually fast even though the content itself is rated useful. What is the most likely cause?|||Video hướng dẫn code của bạn cắt mỗi 1–2 giây từ đầu tới cuối, kèm punch-in ở mọi câu và SFX ở mọi lần cắt. Đồ thị giữ chân tụt nhanh bất thường dù nội dung được đánh giá là hữu ích. Nhiều khả năng nhất là do đâu?',
            options: [
              'The video is too short to hold an audience at all|||Video quá ngắn nên không đủ giữ khán giả',
              'The background music is too quiet compared to the voice|||Nhạc nền quá nhỏ so với giọng nói',
              'The thumbnail is not compelling enough|||Thumbnail chưa đủ hấp dẫn',
              'Over-editing — constant pattern interrupts stop contrasting with anything, and viewers do not get enough time to read the code on screen|||Dựng quá tay — ngắt mẫu liên tục mất tác dụng tương phản, và khán giả không có đủ thời gian đọc code trên màn hình',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Lesson 14.3\'s pitfall names this exactly: pattern interrupts work because they contrast with a calmer baseline; using them on every single cut removes that contrast and exhausts the viewer, which is especially damaging for content that requires reading the screen.|||VI: Đúng cái bẫy Bài 14.3 đã nêu tên: ngắt mẫu có tác dụng vì nó tương phản với một nền tảng bình thường hơn; dùng ở MỌI lần cắt xoá mất sự tương phản đó và làm khán giả kiệt sức — đặc biệt tai hại với nội dung cần đọc màn hình.',
          },
          {
            question: 'You add a lyrical track you personally love, leave it at a comfortable listening volume, and let it play under your entire voice-over. Viewers say they cannot follow what you are saying. What is the correct fix, in order?|||Bạn thêm một bài nhạc có lời rất thích, để nguyên mức âm lượng nghe thoải mái, chạy suốt dưới toàn bộ phần bạn nói. Khán giả phản hồi khó theo dõi bạn đang nói gì. Sửa đúng thứ tự nào?',
            options: [
              'Raise the voice volume higher than the music, keep the lyrical track as is|||Tăng âm lượng giọng nói cao hơn nhạc, giữ nguyên bài có lời',
              'Remove background music entirely for the whole video|||Xoá hẳn nhạc nền cho toàn bộ video',
              'Switch to an instrumental track first, then duck it to roughly −15…−20 dB under the narration|||Đổi sang bản nhạc không lời (instrumental) trước, sau đó ducking nhạc xuống khoảng −15…−20dB dưới đoạn có giọng',
              'Keep the music as is and just add captions|||Giữ nguyên nhạc, chỉ cần thêm phụ đề',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Lesson 14.4\'s most common beginner trap is exactly this. The brain cannot follow two word-streams at once, so lyrics must go first (switch to instrumental); ducking (Ch.12.3\'s −15…−20 dB technique) then handles the remaining volume balance. Raising voice volume alone does not fix competing lyrics.|||VI: Đây đúng là bẫy phổ biến nhất của người mới ở Bài 14.4. Não không theo được hai luồng lời cùng lúc, nên lời bài hát phải xử lý trước (đổi sang instrumental); ducking (kỹ thuật −15…−20dB của Ch.12.3) mới xử lý phần cân bằng âm lượng còn lại. Chỉ tăng âm lượng giọng nói không sửa được việc lời tranh lời.',
          },
        ],
      },
    },

  ],
};
