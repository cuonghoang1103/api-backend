/**
 * Content Creator — Chương 12: Dựng nhanh với CapCut. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter 12 — Fast Editing with CapCut|||Chương 12 — Dựng nhanh với CapCut',
  description: 'Quay xong không biết dựng là nỗi sợ lớn nhất của người mới. Chương này dạy CapCut từ số 0 — từng nút, từng phím tắt, từng thông số xuất — đến khi tự dựng được một video ngắn hoàn chỉnh.',
  lessons: [

    /* ─────────────────── 12.0 slide bài giảng ─────────────────── */
    {
      title: '12.0 — CapCut in 15 slides|||12.0 — CapCut trong 15 slide',
      slug: 'cr-12-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ chương CapCut gói trong 15 slide có hình: giao diện, main track magnet, jump cut, keyframe, phụ đề, ducking, xuất file.',
      content: `
<div class="ml-en"><h2>📑 CapCut in 15 slides</h2>
<p>Slide 5 (main track magnet vs. linkage) and slide 12 (verified keyboard shortcuts) are the two you will come back to the most. Skim the whole deck before the chapter so you know what is coming, then keep it open in a second tab while you edit.</p>
<p>Every fact on these slides — panel names, the watermark toggle, which AI tools need CapCut Pro — was checked against the actual CapCut 8.4.0 app installed for this course and against capcut.com/support.google.com, not guessed from memory.</p></div>
<div class="ml-vi"><h2>📑 CapCut trong 15 slide</h2>
<p>Slide 5 (main track magnet với linkage) và slide 12 (phím tắt đã kiểm) là hai slide bạn sẽ quay lại nhiều nhất. Lướt cả bộ trước khi học chương để biết sắp học gì, rồi mở sẵn ở tab thứ hai trong lúc dựng.</p>
<p>Mọi thông tin trên các slide này — tên panel, nút watermark, công cụ AI nào cần CapCut Pro — đều đối chiếu với đúng bản CapCut 8.4.0 cài cho khoá học này và với capcut.com/support.google.com, không đoán theo trí nhớ.</p></div>
${gallery('cr-12', [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Giao diện CapCut desktop — 5 vùng đánh số'],
  [4, 'Cài đặt project: 16:9 vs 9:16, fps khớp footage'],
  [5, 'Main track magnet — xoá xong tự khít'],
  [6, 'Jump cut bằng sóng âm: im lặng, "ờ", câu hỏng'],
  [7, 'Keyframe — zoom punch-in giữa 2 điểm'],
  [8, 'Phụ đề tự động trong vùng an toàn'],
  [9, 'Nhạc nền ducking dưới giọng nói'],
  [10, 'Hiệu ứng & chuyển cảnh: nên và không nên'],
  [11, 'Màu cơ bản trong Adjust'],
  [12, 'Phím tắt đã kiểm trên Mac'],
  [13, 'Thông số xuất cho từng nền tảng'],
  [14, 'Quy trình 10 bước dựng video ngắn'],
  [15, 'Thực hành chương 12'],
])}
`,
    },

    /* ─────────────────── 12.1 Giao diện & project ─────────────────── */
    {
      title: '12.1 — The CapCut interface and your first project|||12.1 — Giao diện CapCut và project đầu tiên',
      slug: 'cr-12-1-giao-dien-capcut',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Cài CapCut, tạo project đúng tỉ lệ/fps ngay từ đầu, tour 5 vùng giao diện, hiểu main track magnet, và đồng bộ dự án giữa iPhone/iPad với Mac.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>Install CapCut, then start the project right — before you touch a single clip</h2>
<p class="lead">Most "I don't know how to edit" panic disappears once the interface stops looking like a cockpit. CapCut earns its place as this course's default editor for one reason: it is free, it runs natively on your M1 Max, and every button you will press in this lesson has a plain-language name. Everything below was checked against CapCut for Mac <strong>version 8.4.0 (build 261)</strong> — the exact build installed for this course — and against capcut.com's own help pages.</p>

<h3>Install it — Mac and iPad both</h3>
<p>Download from <strong>capcut.com</strong> (there is also a Mac App Store listing). The desktop app installs on <strong>macOS 10.14 or later</strong>, but if you ever want to export at 2K/4K you will need <strong>macOS Monterey 12.0+</strong> and hardware-accelerated encoding — both of which your M1 Max already has. On the iPad, install "CapCut" from the App Store; since 2025 there is a dedicated iPad layout (sometimes called CapCut Pad) with a real multi-track timeline and layer control, instead of the single-track, swipe-heavy layout of the iPhone app. That matters for this course: storyboard on the iPad in Chapter 4, edit a quick pass on the iPad if you are away from the Mac, then finish on the Mac where your keyboard shortcuts live.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Mac minimum</span><span class="v">macOS 10.14+ to install; macOS Monterey 12.0+ for 2K/4K export</span></div>
  <div class="kv"><span class="k">Sign in</span><span class="v">Not required to edit, but required for CapCut Cloud Space (project sync) and for the monthly free quota on Auto captions</span></div>
  <div class="kv"><span class="k">iPad vs iPhone app</span><span class="v">iPad: multi-track timeline, more layer control. iPhone: simpler, streamlined, faster for a quick single edit</span></div>
</div>

<h3>Create the project with the RIGHT settings — you cannot fix this later for free</h3>
<p>Open CapCut → <strong>New project</strong>. Before you drag in a single clip, two settings decide how much rework you will do afterward: <strong>aspect ratio</strong> and <strong>frame rate</strong>.</p>
${slide('cr-12', 4, 'Cài đặt project: 16:9 vs 9:16, fps khớp footage')}
<p>Pick <strong>16:9 (1920×1080)</strong> for anything going to YouTube or a lecture; pick <strong>9:16 (1080×1920)</strong> for TikTok, Reels, or Shorts. If you are not sure yet, match the platform you will post to FIRST — reframing later (Chapter 12.2) works, but it always crops something.</p>
<p>Frame rate has to match your footage, not a habit. Vietnam runs on 50Hz mains power, which is why Chapter 5 had you shoot the Pocket 3 and iPhone at <strong>25fps</strong> (or 50fps for slow motion) instead of the American-default 24/30fps — indoor lights would otherwise flicker on camera. If you forget what a clip was shot at, ask ffprobe instead of guessing:</p>
<pre><code class="language-bash">ffprobe -v error -select_streams v:0 \\
  -show_entries stream=r_frame_rate,width,height,codec_name \\
  -of default=noprint_wrappers=1 pocket3-test-clip.mp4</code></pre>
<div class="out">codec_name=h264
width=1920
height=1080
r_frame_rate=25/1</div>
<p><code>25/1</code> means 25fps — set the CapCut project to 25fps to match. Mixing, say, 30fps footage into a 25fps project makes CapCut retime it, which shows up as micro-stutters you will not notice until you are watching on a big screen.</p>
<div class="pitfall"><strong>Trap:</strong> creating a 9:16 project and dragging in 16:9 footage afterward. CapCut center-crops to fill the frame — you lose both edges of the shot permanently unless you go back into every clip's Crop/Reframe settings by hand. Decide the ratio before you import, not after.</div>

<h3>Import and keep your footage organized</h3>
<p>Drag the whole memory card folder into the <strong>Media</strong> panel — CapCut does not need you to convert anything first. Keep the original filenames from Chapter 11's naming scheme; renaming inside CapCut only renames the reference in the project, not the file on disk, so it is not worth doing. If playback stutters because you are editing 4K/ProRes footage on battery power, turn on <strong>File proxy</strong> (right-click a clip, or Settings): it creates a lower-resolution stand-in for smooth scrubbing and editing, and — confirmed in the app itself — <strong>"the exported video resolution won't be affected"</strong>. This is the same proxy idea from Chapter 11, just one click instead of a manual ffmpeg pass.</p>

<h3>A tour of the five regions</h3>
${slide('cr-12', 3, 'Giao diện CapCut desktop — 5 vùng đánh số')}
<p>Every CapCut screen you will ever look at is one of these five regions:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">① Toolbar (9 tabs)</span><span class="v">Media · Audio · Text · Stickers · Effects · Transitions · Filters · Adjustment · Templates — confirmed exact tab names</span></div>
  <div class="kv"><span class="k">② Content panel</span><span class="v">Shows whatever tab is selected in ①: your imported files, or a library of music/effects/text styles to drag down</span></div>
  <div class="kv"><span class="k">③ Player</span><span class="v">Preview window. Click anywhere on the timeline and it jumps there</span></div>
  <div class="kv"><span class="k">④ Properties panel</span><span class="v">Whatever is selected on the timeline — a clip, a text layer, an effect — gets edited here: volume, speed, keyframes, color</span></div>
  <div class="kv"><span class="k">⑤ Timeline</span><span class="v">Your video tracks (V1, V2…) stacked above your audio tracks (A1, A2…), left to right in time</span></div>
</div>

<h3>Main track magnet — the setting that keeps your cuts from leaving gaps</h3>
${slide('cr-12', 5, 'Main track magnet — xoá xong tự khít')}
<p>The bottom-most video track is your <strong>main track</strong>. Turn on <strong>Main track magnet</strong> (a magnet icon near the timeline) and deleting part of a clip automatically closes the gap — every clip after it slides left to stay connected. This is the single most important toggle for talking-head editing, which Lesson 12.2 uses constantly.</p>
<p>Do not confuse it with <strong>Linkage</strong>, a separate setting: Linkage controls whether OTHER things near a main-track clip — text, stickers, sound effects, an overlay video — move or get deleted together with that clip. Magnet is about gaps on the main track; Linkage is about what else rides along with a clip.</p>

<h3>Sync your project between iPhone/iPad and Mac</h3>
<p>Sign in with the same account everywhere, then use <strong>CapCut Cloud Space</strong> ("My Space" in the desktop menu): upload a project from one device and it opens, fully editable, on another — phone, tablet, or computer. This is genuinely useful for this course's workflow: rough-trim a vlog on the iPad on the bus, finish the fine cut on the Mac at your desk. Free accounts get some cloud storage just for signing in and uploading a project; how much depends on your current plan, so check the number CapCut shows you rather than trusting an old screenshot.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Install CapCut on the Mac (and the iPad if you have not already).</li>
<li>Pick one clip from your Pocket 3 or iPhone footage and run the ffprobe command above on it — write down the real frame rate.</li>
<li>Create a new project with the aspect ratio and frame rate that actually match that clip, not a guess.</li>
<li>Import the footage, then point at each of the five regions out loud and name it.</li>
<li>Turn Main track magnet on, drop three clips on V1, delete the middle one, and confirm the gap closes by itself.</li>
</ol><p><strong>Done when:</strong> you can create a correctly-configured project from a real clip in under two minutes without looking anything up.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Main track</span><span class="v">The bottom video track (V1) that everything else lines up against</span></div>
  <div class="kv"><span class="k">Main track magnet</span><span class="v">Toggle that auto-closes gaps on the main track after a deletion</span></div>
  <div class="kv"><span class="k">Linkage</span><span class="v">Separate toggle: whether other elements move/delete together with a nearby main-track clip</span></div>
  <div class="kv"><span class="k">File proxy</span><span class="v">A lower-res stand-in CapCut generates for smooth editing; does not affect export resolution</span></div>
  <div class="kv"><span class="k">Draft</span><span class="v">CapCut's internal name for a project — the UI calls it "Project"</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Set aspect ratio and frame rate to match your footage BEFORE importing — fixing it after costs real rework.</li>
<li>Five regions, always: toolbar, content panel, player, properties, timeline.</li>
<li>Main track magnet closes gaps automatically; Linkage is a different setting for attached elements.</li>
<li>CapCut Cloud Space carries a project between your iPhone/iPad and Mac.</li>
</ul>

<div class="link-card"><a href="https://www.capcut.com/help/feature-difference-between-capcut-app-and-ipad" target="_blank" rel="noopener">CapCut Help — Feature differences between the mobile app and iPad</a></div>
<div class="link-card"><a href="https://www.capcut.com/help/export-videos-in-capcut" target="_blank" rel="noopener">CapCut Help — Exporting 2K/4K video (system requirements)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Cài CapCut, rồi bắt đầu project cho đúng — trước khi đụng vào clip nào</h2>
<p class="lead">Phần lớn nỗi sợ "không biết dựng" biến mất ngay khi giao diện thôi trông như buồng lái máy bay. CapCut được chọn làm phần mềm dựng mặc định của khoá này vì một lý do: miễn phí, chạy mượt trên Mac M1 Max của bạn, và mọi nút bạn sẽ bấm trong bài này đều có tên gọi rõ ràng. Mọi thứ dưới đây đã đối chiếu với CapCut for Mac <strong>bản 8.4.0 (build 261)</strong> — đúng bản cài cho khoá học này — và với trang trợ giúp chính thức của capcut.com.</p>

<h3>Cài đặt — cả Mac lẫn iPad</h3>
<p>Tải từ <strong>capcut.com</strong> (cũng có trên Mac App Store). Bản desktop cài được từ <strong>macOS 10.14</strong> trở lên, nhưng nếu muốn xuất 2K/4K thì cần <strong>macOS Monterey 12.0+</strong> và mã hoá tăng tốc phần cứng — Mac M1 Max của bạn đã có sẵn cả hai. Trên iPad, cài "CapCut" từ App Store; từ 2025 có giao diện riêng cho iPad (đôi khi gọi là CapCut Pad) với timeline nhiều track thật sự và điều khiển lớp (layer) tốt hơn, khác hẳn giao diện một track, vuốt-là-chính của app iPhone. Điều này có ích cho khoá học: vẽ storyboard trên iPad ở Chương 4, dựng nhanh trên iPad khi không có Mac bên cạnh, rồi hoàn thiện trên Mac — nơi có đủ phím tắt.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Yêu cầu Mac</span><span class="v">macOS 10.14+ để cài; macOS Monterey 12.0+ để xuất 2K/4K</span></div>
  <div class="kv"><span class="k">Đăng nhập</span><span class="v">Không bắt buộc để dựng, nhưng cần để dùng CapCut Cloud Space (đồng bộ dự án) và để có hạn mức miễn phí hàng tháng cho Auto captions</span></div>
  <div class="kv"><span class="k">iPad khác iPhone</span><span class="v">iPad: timeline nhiều track, điều khiển lớp tốt hơn. iPhone: đơn giản, gọn, nhanh cho một lượt dựng ngắn</span></div>
</div>

<h3>Tạo project với ĐÚNG thiết lập — sau này sửa không miễn phí</h3>
<p>Mở CapCut → <strong>New project</strong>. Trước khi kéo bất kỳ clip nào vào, hai thiết lập quyết định bạn sẽ phải làm lại bao nhiêu: <strong>tỉ lệ khung hình</strong> và <strong>fps</strong>.</p>
${slide('cr-12', 4, 'Cài đặt project: 16:9 vs 9:16, fps khớp footage')}
<p>Chọn <strong>16:9 (1920×1080)</strong> cho video lên YouTube hoặc bài giảng; chọn <strong>9:16 (1080×1920)</strong> cho TikTok, Reels, Shorts. Chưa chắc đăng đâu thì khớp theo nền tảng bạn định đăng TRƯỚC — đổi tỉ lệ sau (Bài 12.2) vẫn làm được, nhưng luôn crop mất một phần hình.</p>
<p>fps phải khớp với footage thật, không phải theo thói quen. Việt Nam dùng điện 50Hz, đó là lý do Chương 5 đã cho bạn quay Pocket 3 và iPhone ở <strong>25fps</strong> (hoặc 50fps để làm chậm) thay vì 24/30fps kiểu Mỹ — không thì đèn trong nhà sẽ nhấp nháy trên hình. Quên mất clip quay ở fps nào thì hỏi ffprobe, đừng đoán:</p>
<pre><code class="language-bash">ffprobe -v error -select_streams v:0 \\
  -show_entries stream=r_frame_rate,width,height,codec_name \\
  -of default=noprint_wrappers=1 pocket3-test-clip.mp4</code></pre>
<div class="out">codec_name=h264
width=1920
height=1080
r_frame_rate=25/1</div>
<p><code>25/1</code> nghĩa là 25fps — đặt project CapCut thành 25fps để khớp. Trộn clip 30fps vào project 25fps khiến CapCut tự tính lại tốc độ, ra hiện tượng giật nhẹ mà bạn sẽ không nhận ra cho tới khi xem trên màn hình lớn.</p>
<div class="pitfall"><strong>Bẫy:</strong> tạo project 9:16 rồi mới kéo clip 16:9 vào. CapCut tự crop giữa khung để lấp đầy — mất vĩnh viễn hai bên hình, trừ khi bạn vào lại từng clip chỉnh Crop/Reframe bằng tay. Chọn tỉ lệ TRƯỚC khi import, không phải sau.</div>

<h3>Import và giữ footage có tổ chức</h3>
<p>Kéo nguyên thư mục thẻ nhớ vào panel <strong>Media</strong> — CapCut không cần bạn convert gì trước. Giữ nguyên tên file gốc theo cách đặt tên ở Chương 11; đổi tên trong CapCut chỉ đổi tên tham chiếu trong project, không đổi file trên đĩa, nên không đáng làm. Nếu phát bị giật vì đang dựng footage 4K/ProRes chạy pin, bật <strong>File proxy</strong> (chuột phải vào clip, hoặc trong Settings): CapCut tạo bản thay thế độ phân giải thấp hơn để kéo/dựng mượt, và — đã xác nhận ngay trong app — <strong>"độ phân giải video xuất ra không bị ảnh hưởng"</strong>. Đây chính là ý tưởng proxy của Chương 11, chỉ khác là một cú bấm thay vì chạy ffmpeg tay.</p>

<h3>Tour 5 vùng giao diện</h3>
${slide('cr-12', 3, 'Giao diện CapCut desktop — 5 vùng đánh số')}
<p>Mọi màn hình CapCut bạn từng nhìn thấy đều là một trong năm vùng này:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">① Thanh công cụ (9 tab)</span><span class="v">Media · Audio · Text · Stickers · Effects · Transitions · Filters · Adjustment · Templates — tên tab đã xác nhận đúng chuẩn</span></div>
  <div class="kv"><span class="k">② Bảng nội dung</span><span class="v">Hiện nội dung của tab đang chọn ở ①: file đã import, hoặc thư viện nhạc/hiệu ứng/kiểu chữ để kéo xuống</span></div>
  <div class="kv"><span class="k">③ Player</span><span class="v">Khung xem trước. Bấm bất kỳ đâu trên timeline là nhảy tới đó</span></div>
  <div class="kv"><span class="k">④ Bảng thuộc tính</span><span class="v">Cái gì đang chọn trên timeline — clip, lớp chữ, hiệu ứng — thì chỉnh ở đây: âm lượng, tốc độ, keyframe, màu</span></div>
  <div class="kv"><span class="k">⑤ Timeline</span><span class="v">Track hình V1, V2… xếp trên track tiếng A1, A2… theo thời gian trái→phải</span></div>
</div>

<h3>Main track magnet — thiết lập giữ cho các lần cắt không để lại khoảng hở</h3>
${slide('cr-12', 5, 'Main track magnet — xoá xong tự khít')}
<p>Track hình dưới cùng là <strong>main track</strong>. Bật <strong>Main track magnet</strong> (icon nam châm gần timeline) thì xoá một phần clip sẽ tự động khít khoảng hở lại — mọi clip sau đó tự trượt sang trái để nối liền. Đây là công tắc quan trọng nhất khi dựng talking head, thứ Bài 12.2 dùng liên tục.</p>
<p>Đừng nhầm với <strong>Linkage</strong> — một thiết lập riêng: Linkage quyết định những thứ KHÁC nằm gần một clip trên main track — chữ, nhãn dán, hiệu ứng âm thanh, một video overlay — có di chuyển/bị xoá THEO clip đó hay không. Magnet lo về khoảng hở trên main track; Linkage lo về thứ gì đi kèm một clip.</p>

<h3>Đồng bộ dự án giữa iPhone/iPad và Mac</h3>
<p>Đăng nhập cùng một tài khoản ở mọi nơi, rồi dùng <strong>CapCut Cloud Space</strong> (menu desktop gọi là "My Space"): tải một dự án lên từ máy này, mở ra chỉnh sửa được đầy đủ trên máy khác — điện thoại, máy tính bảng, hay máy tính. Rất hữu ích cho quy trình của khoá này: cắt thô một video vlog trên iPad lúc đi xe buýt, hoàn thiện lượt tinh trên Mac ở bàn làm việc. Tài khoản miễn phí có sẵn một ít dung lượng đám mây chỉ cần đăng nhập và tải một dự án lên; bao nhiêu tuỳ gói đang dùng, nên xem con số CapCut hiện ra thay vì tin vào ảnh chụp màn hình cũ.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Cài CapCut trên Mac (và trên iPad nếu chưa có).</li>
<li>Chọn một clip từ footage Pocket 3 hoặc iPhone của bạn, chạy lệnh ffprobe ở trên — ghi lại fps thật.</li>
<li>Tạo project mới với tỉ lệ và fps khớp ĐÚNG với clip đó, không đoán.</li>
<li>Import footage, rồi chỉ tay và gọi tên từng vùng trong năm vùng giao diện.</li>
<li>Bật Main track magnet, thả 3 clip lên V1, xoá clip giữa, xác nhận khoảng hở tự khít.</li>
</ol><p><strong>Đạt khi:</strong> tạo được một project cấu hình đúng từ một clip thật trong dưới hai phút, không cần tra lại.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Main track</span><span class="v">Track hình dưới cùng (V1) — mọi thứ khác canh theo nó</span></div>
  <div class="kv"><span class="k">Main track magnet</span><span class="v">Công tắc tự khít khoảng hở trên main track sau khi xoá</span></div>
  <div class="kv"><span class="k">Linkage</span><span class="v">Công tắc riêng: các thành phần khác có di chuyển/xoá theo clip gần đó hay không</span></div>
  <div class="kv"><span class="k">File proxy</span><span class="v">Bản thay thế độ phân giải thấp CapCut tự tạo để dựng mượt; không ảnh hưởng độ phân giải xuất</span></div>
  <div class="kv"><span class="k">Draft</span><span class="v">Tên nội bộ của CapCut cho một dự án — giao diện gọi là "Project"</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đặt tỉ lệ và fps khớp footage TRƯỚC khi import — sửa sau tốn công thật sự.</li>
<li>Luôn năm vùng: thanh công cụ, bảng nội dung, player, bảng thuộc tính, timeline.</li>
<li>Main track magnet tự khít khoảng hở; Linkage là thiết lập khác cho thành phần đi kèm.</li>
<li>CapCut Cloud Space mang một dự án đi giữa iPhone/iPad và Mac.</li>
</ul>

<div class="link-card"><a href="https://www.capcut.com/help/feature-difference-between-capcut-app-and-ipad" target="_blank" rel="noopener">CapCut Help — Khác biệt tính năng giữa app điện thoại và iPad</a></div>
<div class="link-card"><a href="https://www.capcut.com/help/export-videos-in-capcut" target="_blank" rel="noopener">CapCut Help — Xuất video 2K/4K (yêu cầu hệ thống)</a></div>
</div>
`,
    },

    /* ─────────────────── 12.2 Cắt dựng cơ bản ─────────────────── */
    {
      title: '12.2 — Cutting: split, jump cuts, B-roll, keyframes|||12.2 — Cắt dựng: split, jump cut, B-roll, keyframe',
      slug: 'cr-12-2-cat-dung-co-ban',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Split/trim/ripple delete, jump cut cho talking head, J-cut/L-cut, chèn B-roll, tốc độ/đảo/đóng băng, crop & reframe, keyframe zoom, và quy trình lượt thô → lượt tinh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Cutting is 80% of editing — and 80% of cutting is one keyboard shortcut</h2>
<p class="lead">You already have a project set up correctly and Main track magnet on from Lesson 12.1. This lesson is where footage actually turns into a watchable video: cutting out the dead air, inserting B-roll over the boring parts, and adding just enough motion (speed, zoom) to keep a viewer's thumb off the scroll.</p>

<h3>Two passes, not one: rough cut, then fine cut</h3>
<p>Do not try to make every cut perfect on the first pass. Professional editors work in two passes, and it is faster than it sounds: <strong>rough cut</strong> — drag your A-roll (talking head) onto V1 in script order, delete only the obviously unusable takes, do not worry about pacing yet. <strong>Fine cut</strong> — now go clip by clip and actually tighten it: jump cuts, B-roll coverage, keyframes, pacing. Trying to do both at once is why editing a 2-minute video can eat an entire evening.</p>

<h3>Split, trim, and ripple delete</h3>
<p>Move the playhead to where you want to cut and press <strong>⌘B</strong> to split the clip in two. To trim without splitting, drag either edge of a clip. To delete a chunk and close the resulting gap in one motion, position the playhead and press <strong>Q</strong> (deletes everything to the left of the playhead within the clip) or <strong>W</strong> (deletes everything to the right) — with Main track magnet on, the gap closes automatically, which is the "ripple delete" behavior editors in Premiere or Resolve would recognize, just under a different name here.</p>

<h3>Jump cuts: cutting a talking head down to the good parts</h3>
${slide('cr-12', 6, 'Jump cut bằng sóng âm: im lặng, "ờ", câu hỏng')}
<p>This is the single most useful skill in this lesson, and it directly fixes the "I shoot 20 minutes and don't know where to start cutting" habit from Chapter 4. Zoom the timeline in (<strong>⌘=</strong>, or ⌘ + scroll) until you can actually see the waveform, then look — do not just listen — for three shapes:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Silence</span><span class="v">A flat, low stretch of waveform — a pause, a breath, dead air before you start talking</span></div>
  <div class="kv"><span class="k">Filler ("ờ", "um")</span><span class="v">A short, low-energy bump — you will start recognizing its shape after a few edits</span></div>
  <div class="kv"><span class="k">A ruined take</span><span class="v">A whole sentence you stumbled over — cut the entire phrase, not just the stumble</span></div>
</div>
<p>Cut each one out with Q/W and Main track magnet closes the gaps for you — the result is called a <strong>jump cut</strong> because the person's position "jumps" slightly between edits. That jump is completely normal and expected for talking-head content on social platforms; it is what B-roll (next section) exists to soften.</p>
<div class="callout warn"><p><strong>Faster with Pro:</strong> CapCut Pro has a one-click <strong>Remove filler words</strong> tool that automatically finds and deletes pauses, repetitions, AND filler words — confirmed directly in the app's own text. The free version does not include it, so doing it by hand with Q/W the way this lesson teaches is the free path, and it is also the one that teaches you to actually listen to your own footage.</p></div>

<h3>J-cut and L-cut, the simple way</h3>
<p>A hard cut changes picture and sound at the exact same frame — fine most of the time, but robotic for interviews or reaction shots. A <strong>J-cut</strong> lets the NEXT clip's audio start slightly before its picture; an <strong>L-cut</strong> lets the CURRENT clip's audio continue slightly after its picture changes. CapCut does not have a single named button for this — you get there by unlinking a clip's audio from its picture (the small link icon on a selected clip) and then dragging just the audio edge independently of the video edge. It takes ten seconds and instantly makes a cut feel intentional instead of chopped.</p>

<h3>B-roll: covering the boring parts</h3>
<p>Drag your B-roll clip onto the track directly above V1 (V2) and position it over a stretch of talking head you want to hide — CapCut calls this an <strong>overlay</strong>. The audio underneath keeps playing from V1 while the viewer sees the B-roll on top. Use it over: filler-word cuts that still look a little rough, any sentence where you gesture at something off-screen, or just every 4–8 seconds to keep a short-form video visually alive.</p>

<h3>Speed, reverse, freeze</h3>
<p>Select a clip → Properties panel ④ → <strong>Speed</strong> (or ⌘R) for a flat multiplier, or the <strong>Curve</strong> tool for a custom speed ramp with multiple points (useful synced to a music beat — CapCut can mark beats with ⌘J on a selected music clip). <strong>Reverse</strong> plays a clip backward. <strong>Freeze</strong> holds one frame for a chosen duration — handy for a comedic beat or to hold on a whiteboard drawing a second longer.</p>

<h3>Crop and reframe: turning 16:9 into 9:16</h3>
<p>If you shot landscape and need vertical (or the reverse), select the clip → <strong>Crop</strong> to reposition/resize by hand, or use <strong>Auto reframe</strong> — CapCut's own description is that it changes the aspect ratio automatically while trying to keep "the main object in the video... always included in the frame." It is genuinely good for a single subject standing still; for a webcam-and-slides recording (Chapter 19 material) it will guess wrong and you should crop by hand instead.</p>

<h3>Keyframe zoom: the punch-in that adds energy for free</h3>
${slide('cr-12', 7, 'Keyframe — zoom punch-in giữa 2 điểm')}
<p>A "punch-in" is a small, quick zoom on a key word or moment — editors use it constantly on talking-head cuts because it is nearly free energy. In the Properties panel, place the playhead, add a keyframe (the diamond icon) at 100% scale, move forward 0.3–0.8 seconds, add a second keyframe at 120–140% scale. CapCut eases between them automatically. Two keyframes is enough — do not animate every sentence or it stops reading as emphasis and starts reading as a tic.</p>

<h3>Masks</h3>
<p>A <strong>Mask</strong> (Properties panel, on a clip or text layer) hides part of a layer inside a shape — a circle to spotlight part of the frame, a rectangle to hide a logo, or combined with a second video track for simple split-screen. It is a menu you will not need often in this course, but it is the button to remember when "I need to hide/reveal just part of the frame" comes up.</p>

<h3>Verified keyboard shortcuts</h3>
${slide('cr-12', 12, 'Phím tắt đã kiểm trên Mac')}
<p>These are worth memorizing in this order: ⌘B (split), Q/W (delete left/right), ⌘= / ⌘− (zoom timeline). Everything else you will pick up by using it.</p>

<div class="pitfall"><strong>Trap:</strong> editing with the timeline zoomed all the way out. Every cut looks "close enough" at that zoom level, and every one of them is actually off by several frames. Zoom in until the waveform is readable before you trust a cut.</div>
<p class="note-ct"><strong>Continuing into Lesson 12.3:</strong> once the cut is locked, the next pass is captions, titles, restrained effects, and music — never the other way around, because re-cutting after adding captions means re-timing every caption too.</p>

<h3>🎬 Practice (30–45 minutes)</h3>
<div class="callout ok"><ol>
<li>Take a talking-head clip 2+ minutes long. Rough-cut it onto V1 in order.</li>
<li>Fine-cut: remove every silence, filler word, and ruined take with Q/W until it is under 60 seconds.</li>
<li>Cover at least two of the jump cuts with a B-roll overlay on V2.</li>
<li>Add one keyframe zoom punch-in on the strongest line in the video.</li>
<li>If any clip needs it, reframe one shot from 16:9 to 9:16 by hand and compare it to Auto reframe's result.</li>
</ol><p><strong>Done when:</strong> the cut video plays with no dead air, no visible mid-sentence jump left uncovered, and one deliberate punch-in.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Jump cut</span><span class="v">A cut inside continuous talking-head footage that makes the subject "jump" position slightly</span></div>
  <div class="kv"><span class="k">J-cut / L-cut</span><span class="v">Audio from one clip starts before (J) or continues after (L) its matching picture</span></div>
  <div class="kv"><span class="k">Overlay</span><span class="v">CapCut's term for a clip on a track above V1 that visually covers it (B-roll)</span></div>
  <div class="kv"><span class="k">Punch-in</span><span class="v">A quick keyframed zoom used to add emphasis on a word or beat</span></div>
  <div class="kv"><span class="k">Auto reframe</span><span class="v">AI tool that changes aspect ratio while trying to keep the main subject in frame</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Rough cut first, fine cut second — never both at once.</li>
<li>⌘B splits, Q/W delete-and-close-gap; zoom the timeline in before trusting a cut.</li>
<li>Cover jump cuts with B-roll overlays on V2; use keyframe zooms sparingly, 2 points at a time.</li>
<li>Auto reframe is good for one still subject, unreliable for slides/webcam layouts.</li>
</ul>

<div class="link-card"><a href="https://www.capcut.com/help/split-the-subtiltes" target="_blank" rel="noopener">CapCut Help — Splitting and editing on the timeline</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Cắt dựng chiếm 80% việc dựng phim — và 80% việc cắt dựng nằm trong một phím tắt</h2>
<p class="lead">Bạn đã có project cấu hình đúng và Main track magnet bật từ Bài 12.1. Bài này là lúc footage thật sự biến thành một video xem được: cắt bỏ khoảng chết, chèn B-roll che đoạn nhàm, và thêm vừa đủ chuyển động (tốc độ, zoom) để ngón tay người xem không lướt qua.</p>

<h3>Hai lượt, không phải một: lượt thô rồi lượt tinh</h3>
<p>Đừng cố làm hoàn hảo từng nhát cắt ngay lượt đầu. Dân dựng chuyên nghiệp làm hai lượt, và cách này nhanh hơn nghe có vẻ: <strong>lượt thô</strong> — kéo A-roll (talking head) lên V1 theo đúng thứ tự kịch bản, chỉ xoá những lần quay rõ ràng hỏng, chưa cần lo nhịp độ. <strong>Lượt tinh</strong> — giờ đi từng clip và thắt chặt thật sự: jump cut, phủ B-roll, keyframe, nhịp độ. Cố làm cả hai cùng lúc là lý do dựng một video 2 phút có thể ngốn nguyên buổi tối.</p>

<h3>Split, trim, và ripple delete</h3>
<p>Đặt playhead vào chỗ muốn cắt rồi bấm <strong>⌘B</strong> để tách clip làm đôi. Muốn trim không tách thì kéo mép clip. Muốn xoá một đoạn và khít khoảng hở trong một thao tác, đặt playhead rồi bấm <strong>Q</strong> (xoá mọi thứ bên trái playhead trong clip) hoặc <strong>W</strong> (xoá bên phải) — bật Main track magnet thì khoảng hở tự khít, đúng hành vi "ripple delete" mà dân dùng Premiere hay Resolve sẽ nhận ra, chỉ là CapCut gọi tên khác.</p>

<h3>Jump cut: cắt talking head chỉ còn phần hay</h3>
${slide('cr-12', 6, 'Jump cut bằng sóng âm: im lặng, "ờ", câu hỏng')}
<p>Đây là kỹ năng hữu ích nhất trong bài này, và nó chữa thẳng thói quen "quay 20 phút không biết cắt từ đâu" ở Chương 4. Phóng to timeline (<strong>⌘=</strong>, hoặc ⌘ + cuộn chuột) tới khi thấy rõ sóng âm, rồi NHÌN — không chỉ nghe — ba hình dạng này:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Im lặng</span><span class="v">Một đoạn sóng âm phẳng, thấp — khoảng dừng, hít thở, khoảng chết trước khi nói</span></div>
  <div class="kv"><span class="k">Từ đệm ("ờ", "à")</span><span class="v">Một gợn ngắn, năng lượng thấp — quen mắt dần sau vài lần dựng</span></div>
  <div class="kv"><span class="k">Một lần nói hỏng</span><span class="v">Cả một câu bị vấp — cắt nguyên câu, không chỉ chỗ vấp</span></div>
</div>
<p>Cắt từng chỗ bằng Q/W, Main track magnet tự khít khoảng hở — kết quả gọi là <strong>jump cut</strong> vì vị trí người trong hình "nhảy" nhẹ giữa các lần cắt. Cái nhảy đó hoàn toàn bình thường với nội dung talking head trên mạng xã hội; B-roll (mục sau) sinh ra để làm mềm nó.</p>
<div class="callout warn"><p><strong>Nhanh hơn với Pro:</strong> CapCut Pro có công cụ <strong>Remove filler words</strong> một-cú-bấm, tự tìm và xoá cả khoảng dừng, câu lặp, VÀ từ đệm — đã xác nhận trực tiếp trong chính chữ của app. Bản miễn phí không có nó, nên tự làm bằng tay với Q/W như bài này dạy là đường miễn phí, và cũng là đường dạy bạn thật sự nghe lại footage của mình.</p></div>

<h3>J-cut và L-cut, kiểu đơn giản</h3>
<p>Cắt cứng (hard cut) đổi cả hình lẫn tiếng đúng một khung hình — hầu hết lúc đều ổn, nhưng cứng nhắc với phỏng vấn hay cảnh phản ứng. <strong>J-cut</strong> cho tiếng của clip TIẾP THEO bắt đầu sớm hơn hình một chút; <strong>L-cut</strong> cho tiếng của clip HIỆN TẠI kéo dài qua sau khi hình đã đổi. CapCut không có riêng một nút mang tên cho việc này — làm bằng cách tách âm thanh khỏi hình của một clip (icon xích nhỏ trên clip đang chọn) rồi kéo riêng mép âm thanh, độc lập với mép hình. Mất mười giây và khiến một lần cắt nghe có chủ đích thay vì bị chặt cụt.</p>

<h3>B-roll: che đoạn nhàm</h3>
<p>Kéo clip B-roll lên track ngay phía trên V1 (V2) và đặt đè lên đoạn talking head muốn che — CapCut gọi đây là <strong>overlay</strong>. Tiếng bên dưới vẫn phát từ V1 trong khi người xem thấy B-roll ở trên. Dùng nó để che: các chỗ vừa cắt từ đệm còn hơi thô, câu nào bạn chỉ tay ra ngoài khung hình, hoặc đơn giản là mỗi 4–8 giây để video ngắn luôn có gì đó chuyển động trên hình.</p>

<h3>Tốc độ, đảo ngược, đóng băng</h3>
<p>Chọn clip → bảng thuộc tính ④ → <strong>Speed</strong> (hoặc ⌘R) cho tốc độ nhân đều, hoặc công cụ <strong>Curve</strong> cho đường tốc độ tuỳ chỉnh nhiều điểm (hữu ích khi khớp theo beat nhạc — CapCut đánh dấu beat bằng ⌘J trên clip nhạc đang chọn). <strong>Reverse</strong> phát clip ngược. <strong>Freeze</strong> giữ một khung hình trong khoảng thời gian tuỳ chọn — hữu ích cho một nhịp hài hước hoặc giữ lâu hơn một giây trên hình vẽ trên bảng trắng.</p>

<h3>Crop và reframe: biến 16:9 thành 9:16</h3>
<p>Quay ngang mà cần dọc (hoặc ngược lại), chọn clip → <strong>Crop</strong> để tự định vị/chỉnh cỡ bằng tay, hoặc dùng <strong>Auto reframe</strong> — mô tả chính thức của CapCut là nó tự đổi tỉ lệ khung hình trong khi cố giữ "vật thể chính trong video... luôn nằm trong khung hình." Hiệu quả thật sự khi chủ thể đứng yên một mình; với cảnh quay webcam + slide (nội dung Chương 19) nó sẽ đoán sai và bạn nên tự crop bằng tay.</p>

<h3>Keyframe zoom: cú punch-in thêm năng lượng miễn phí</h3>
${slide('cr-12', 7, 'Keyframe — zoom punch-in giữa 2 điểm')}
<p>"Punch-in" là một cú zoom nhỏ, nhanh vào một từ hoặc khoảnh khắc quan trọng — dân dựng dùng liên tục trên talking head vì gần như là năng lượng miễn phí. Trong bảng thuộc tính, đặt playhead, thêm keyframe (icon kim cương) ở 100%, tiến 0.3–0.8 giây, thêm keyframe thứ hai ở 120–140%. CapCut tự làm mượt (ease) giữa hai điểm. Hai keyframe là đủ — đừng animate mọi câu, không thì nó thôi đọc như sự nhấn mạnh mà thành một tật.</p>

<h3>Mask</h3>
<p>Một <strong>Mask</strong> (bảng thuộc tính, trên clip hoặc lớp chữ) che một phần lớp bên trong một hình dạng — hình tròn để làm nổi bật một phần khung hình, hình chữ nhật để che logo, hoặc kết hợp với track video thứ hai để làm split-screen đơn giản. Đây là menu bạn sẽ không cần thường xuyên trong khoá này, nhưng là nút cần nhớ khi có nhu cầu "chỉ che/hiện một phần khung hình".</p>

<h3>Phím tắt đã kiểm</h3>
${slide('cr-12', 12, 'Phím tắt đã kiểm trên Mac')}
<p>Đáng thuộc theo đúng thứ tự này: ⌘B (split), Q/W (xoá trái/phải), ⌘= / ⌘− (zoom timeline). Còn lại bạn sẽ quen tay dần khi dùng.</p>

<div class="pitfall"><strong>Bẫy:</strong> dựng khi timeline đang thu nhỏ hết cỡ. Ở mức zoom đó mọi nhát cắt đều trông "gần đúng", và thật ra cái nào cũng lệch vài khung hình. Phóng to tới khi đọc được sóng âm rồi mới tin vào một nhát cắt.</div>
<p class="note-ct"><strong>Nối với Bài 12.3:</strong> khi nhát cắt đã chốt, lượt tiếp theo là phụ đề, tiêu đề, hiệu ứng tiết chế, và nhạc — không bao giờ làm ngược lại, vì cắt lại sau khi đã có phụ đề nghĩa là phải canh lại thời gian từng dòng phụ đề.</p>

<h3>🎬 Thực hành (30–45 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy một clip talking head dài ≥ 2 phút. Lượt thô lên V1 theo đúng thứ tự.</li>
<li>Lượt tinh: xoá mọi khoảng im lặng, từ đệm, lần nói hỏng bằng Q/W tới khi còn dưới 60 giây.</li>
<li>Phủ B-roll (overlay trên V2) che ít nhất hai chỗ jump cut.</li>
<li>Thêm một keyframe zoom punch-in vào câu mạnh nhất trong video.</li>
<li>Nếu cần, tự reframe một cảnh từ 16:9 sang 9:16 bằng tay và so với kết quả của Auto reframe.</li>
</ol><p><strong>Đạt khi:</strong> video đã cắt không còn khoảng chết, không còn jump cut lộ rõ mà chưa được che, và có một cú punch-in có chủ đích.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Jump cut</span><span class="v">Một nhát cắt trong footage talking head liên tục khiến chủ thể "nhảy" vị trí nhẹ</span></div>
  <div class="kv"><span class="k">J-cut / L-cut</span><span class="v">Tiếng của một clip bắt đầu sớm hơn (J) hoặc kéo dài sau (L) so với hình khớp nó</span></div>
  <div class="kv"><span class="k">Overlay</span><span class="v">Tên CapCut gọi một clip trên track phía trên V1, che phủ hình bên dưới (B-roll)</span></div>
  <div class="kv"><span class="k">Punch-in</span><span class="v">Cú zoom bằng keyframe nhanh, dùng để nhấn một từ hoặc một nhịp</span></div>
  <div class="kv"><span class="k">Auto reframe</span><span class="v">Công cụ AI đổi tỉ lệ khung hình trong khi cố giữ chủ thể chính trong khung</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lượt thô trước, lượt tinh sau — không bao giờ làm cùng lúc.</li>
<li>⌘B để tách, Q/W xoá-và-khít; phóng to timeline trước khi tin vào một nhát cắt.</li>
<li>Che jump cut bằng B-roll overlay trên V2; dùng keyframe zoom tiết chế, mỗi lần 2 điểm.</li>
<li>Auto reframe tốt cho một chủ thể đứng yên, không đáng tin với cảnh slide/webcam.</li>
</ul>

<div class="link-card"><a href="https://www.capcut.com/help/split-the-subtiltes" target="_blank" rel="noopener">CapCut Help — Tách và chỉnh trên timeline</a></div>
</div>
`,
    },

    /* ─────────────────── 12.3 Chữ, phụ đề, hiệu ứng ─────────────────── */
    {
      title: '12.3 — Captions, titles, restrained effects, music|||12.3 — Chữ, phụ đề, hiệu ứng tiết chế, nhạc',
      slug: 'cr-12-3-chu-phu-de-hieu-ung',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Phụ đề tự động VI/EN, tiêu đề & sticker, hiệu ứng/chuyển cảnh tiết chế, nhạc nền và bản quyền, ducking, Enhance voice/Reduce noise, màu cơ bản.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>Captions people can read, effects people don't notice, music you're allowed to use</h2>
<p class="lead">The cut is locked from Lesson 12.2. Now you add the layer most viewers actually interact with: captions (most people watch with sound off first), a title that earns the first three seconds, restrained motion, and music that will not get your video muted or claimed after you upload it.</p>

<h3>Auto captions — fast, but read every line</h3>
${slide('cr-12', 8, 'Phụ đề tự động trong vùng an toàn')}
<p>Select your clip(s) → <strong>Captions → Auto captions</strong>. CapCut runs speech recognition and drops in timed captions automatically, with a <strong>Bilingual captions</strong> option that can translate alongside the original — Vietnamese is one of the available languages there. Two honest limits, both confirmed directly in the app: signed-in free accounts get a limited number of free auto-caption/auto-lyrics uses <strong>per month</strong> (the exact count is shown live in the app under "About free uses" — it resets monthly, and is not worth memorizing since it can change), and CapCut Pro removes that limit.</p>
<div class="callout warn"><p><strong>Always proofread.</strong> Speech recognition mishears proper nouns, programming terms, and punctuation constantly — "closure" becomes "closer", a variable name becomes gibberish. Read the whole caption track before you export; do not trust it blind.</p></div>
<p>Style captions for a phone screen: a readable size (test it by holding your phone at arm's length, not by staring at your Mac display up close), a stroke or background behind the text for contrast against any footage, and short lines — two lines maximum. Keep the caption text inside the <strong>safe zone</strong>: platform UI (like/comment buttons, captions, username) covers the bottom ~20% and a strip on the right of a 9:16 video, so anything placed there gets covered on a real phone even if it looks fine in CapCut's own preview.</p>

<h3>Titles, hooks, and stickers</h3>
<p>A text hook in the first second (before your voice even starts) is often what stops a scroll — add it from the <strong>Text</strong> tab, keep it to a handful of words, and place it well clear of the safe-zone edges above. <strong>Stickers</strong> (their own tab) are fine for a small accent — an arrow pointing at something, a reaction emoji — but they read as amateur fast if there are more than one or two on screen at once.</p>

<h3>Effects and transitions — restraint is the professional move</h3>
${slide('cr-12', 10, 'Hiệu ứng & chuyển cảnh: nên và không nên')}
<p>The single fastest way to make a video look like a first project is stacking a different flashy transition on every cut. The default should be a plain hard cut — no transition at all. Reserve one gentle transition (a fade or dip to black) for a real change of topic, and use one consistent filter or color look across the whole video rather than a different one per clip. Effects exist to emphasize a specific moment, not to decorate every second of the timeline.</p>

<h3>Music and sound effects — read this before you post to YouTube</h3>
${slide('cr-12', 9, 'Nhạc nền ducking dưới giọng nói')}
<p>CapCut's built-in <strong>Commercial Music</strong> library — over 500,000 tracks, per CapCut's own description — is explicitly <strong>"pre-cleared for commercial use on the CapCut and TikTok platforms"</strong>. Read that scope carefully: it names CapCut and TikTok specifically, not YouTube, Instagram, or Facebook. For any other regular (non-"Commercial Music") track in the library, CapCut says outright: <strong>"CapCut has not cleared this music to use for commercial purposes... consult your legal team."</strong> CapCut even has a built-in copyright checker, but it is framed specifically as a pre-TikTok-upload check, not a general one. Practical takeaway for this course, which posts to YouTube too: treat "Commercial Music" as safe for TikTok but not automatically safe for YouTube — for YouTube, prefer the YouTube Audio Library, or music you separately confirm is licensed, since a Content ID claim there usually means an ads/revenue split rather than a takedown, but it is still worth avoiding on purpose.</p>

<h3>Ducking: lowering music under your voice</h3>
<p>CapCut does not have a single "duck audio" button. You do it with volume keyframes: select the music clip on its own audio track, open Properties ④ → Audio → Volume, drop it roughly <strong>−15 to −20 dB</strong> right where your voice starts, and add a keyframe just before and after so the change ramps instead of jumping. Tedious the first time, fast by the third.</p>

<h3>Enhance voice and Reduce noise</h3>
<p>Both are one-click AI tools in the Audio panel. <strong>Reduce noise</strong> removes background sound (AC hum, traffic, wind); <strong>Enhance voice</strong> removes "echoes, popping sounds, and other noises" per CapCut's own description. Reduce noise is confirmed to be a CapCut Pro feature; treat Enhance voice the same way until you check your own account, since both live in the same paid AI toolkit. Neither replaces good sound recording from Chapter 9 — they clean up a recording, they do not save a bad one.</p>

<h3>Basic color in Adjust</h3>
${slide('cr-12', 11, 'Màu cơ bản trong Adjust')}
<p>Adjust gives you simple sliders — Brightness, Contrast, Saturation, Temperature/Tint, Highlight/Shadow — plus one-tap Filter presets. That is genuinely enough for a short video: fix exposure first, nudge contrast and saturation gently (oversaturated color is the clearest "just started editing" tell), and apply the SAME adjustment across every clip from the same shoot so the video looks like one continuous piece. Multi-layer grading with nodes, monitored on a waveform/vectorscope, is DaVinci Resolve territory — Chapter 15.</p>

<div class="pitfall"><strong>Trap:</strong> adding captions or titles before the cut is fully locked. Every time you re-cut afterward, every caption after that point drifts out of sync with the new timing, and you end up re-timing all of them by hand.</div>

<h3>🎬 Practice (30–40 minutes)</h3>
<div class="callout ok"><ol>
<li>Run Auto captions on your locked cut from Lesson 12.2; proofread and fix every mis-heard word.</li>
<li>Check every caption sits inside the safe zone on a 9:16 preview.</li>
<li>Add one text hook in the first second.</li>
<li>Add a background music track from Commercial Music and duck it under your voice with volume keyframes.</li>
<li>Apply one consistent color adjustment across all clips.</li>
</ol><p><strong>Done when:</strong> captions have zero spelling errors, the music never buries your voice, and there is no more than one transition style used in the whole video.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Safe zone</span><span class="v">Area of a 9:16 frame NOT covered by platform UI (buttons, captions, username)</span></div>
  <div class="kv"><span class="k">Commercial Music</span><span class="v">CapCut's licensed music library, pre-cleared for CapCut + TikTok specifically</span></div>
  <div class="kv"><span class="k">Ducking</span><span class="v">Lowering background music while someone is speaking, done here via volume keyframes</span></div>
  <div class="kv"><span class="k">Content ID</span><span class="v">YouTube's automated system that detects copyrighted audio in uploads</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Auto captions is fast but not free of mistakes or quota — proofread, and check the monthly limit in-app.</li>
<li>One hook, restrained effects, one consistent color look — not one of everything.</li>
<li>"Commercial Music" clears CapCut/TikTok specifically, not automatically YouTube — pick YouTube-safe music separately.</li>
<li>Ducking and Enhance voice/Reduce noise clean up sound; they do not replace good recording.</li>
</ul>

<div class="link-card"><a href="https://www.capcut.com/help/how-to-recognise-subtitles" target="_blank" rel="noopener">CapCut Help — How to recognize (auto-generate) subtitles</a></div>
<div class="link-card"><a href="https://www.capcut.com/help/bilingual-subtitles" target="_blank" rel="noopener">CapCut Help — How to recognize bilingual subtitles</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Phụ đề đọc được, hiệu ứng không ai để ý, nhạc được phép dùng</h2>
<p class="lead">Nhát cắt đã chốt từ Bài 12.2. Giờ thêm lớp mà đa số người xem thực sự tương tác: phụ đề (đa số xem tắt tiếng trước), tiêu đề giành ba giây đầu, chuyển động tiết chế, và nhạc không khiến video bị tắt tiếng hay bị đánh dấu bản quyền sau khi đăng.</p>

<h3>Phụ đề tự động — nhanh, nhưng phải đọc lại từng dòng</h3>
${slide('cr-12', 8, 'Phụ đề tự động trong vùng an toàn')}
<p>Chọn clip → <strong>Captions → Auto captions</strong>. CapCut nhận diện giọng nói và tự chèn phụ đề có canh thời gian, có tuỳ chọn <strong>Bilingual captions</strong> dịch song song với bản gốc — tiếng Việt là một trong các ngôn ngữ có sẵn ở đó. Hai giới hạn thật, đã xác nhận trực tiếp trong app: tài khoản miễn phí đã đăng nhập có một số lượt Auto captions/Auto lyrics miễn phí <strong>mỗi tháng</strong> (số lượt cụ thể hiện trực tiếp trong app ở mục "About free uses" — reset hàng tháng, không đáng nhớ vì có thể đổi), và CapCut Pro bỏ giới hạn đó.</p>
<div class="callout warn"><p><strong>Luôn đọc lại.</strong> Nhận diện giọng nói hay nghe sai tên riêng, thuật ngữ lập trình, dấu câu — "closure" thành "closer", tên biến thành chữ vô nghĩa. Đọc hết cả track phụ đề trước khi xuất, đừng tin mù.</p></div>
<p>Chỉnh kiểu chữ cho màn hình điện thoại: cỡ chữ đọc được (thử bằng cách cầm điện thoại xa tay ra, không phải nhìn sát màn hình Mac), có viền hoặc nền sau chữ để tương phản với mọi loại nền, và dòng ngắn — tối đa hai dòng. Giữ chữ phụ đề trong <strong>vùng an toàn</strong>: UI nền tảng (nút thích/bình luận, chú thích, tên người dùng) che khoảng 20% đáy và một dải bên phải của video 9:16, nên đặt chữ ở đó sẽ bị che trên điện thoại thật dù nhìn ổn trong khung xem trước của CapCut.</p>

<h3>Tiêu đề, hook, và sticker</h3>
<p>Một dòng chữ hook trong giây đầu tiên (trước cả khi bạn bắt đầu nói) thường là thứ giữ chân ngón tay đang lướt — thêm từ tab <strong>Text</strong>, giữ vài chữ thôi, và đặt cách xa mép vùng an toàn ở trên. <strong>Sticker</strong> (tab riêng) hợp để nhấn nhẹ — một mũi tên chỉ vào thứ gì đó, một emoji phản ứng — nhưng để hơn một hai cái cùng lúc trên hình là trông nghiệp dư ngay.</p>

<h3>Hiệu ứng & chuyển cảnh — tiết chế là cách làm chuyên nghiệp</h3>
${slide('cr-12', 10, 'Hiệu ứng & chuyển cảnh: nên và không nên')}
<p>Cách nhanh nhất khiến video trông như dự án đầu tay là chồng một kiểu chuyển cảnh loè loẹt khác nhau ở mỗi lần cắt. Mặc định nên là cắt cứng — không chuyển cảnh gì cả. Dành đúng một kiểu chuyển cảnh nhẹ (fade hoặc dip to black) cho lúc đổi chủ đề thật sự, và dùng một filter/tông màu nhất quán cho cả video thay vì mỗi clip một kiểu. Hiệu ứng sinh ra để nhấn một khoảnh khắc cụ thể, không phải để trang trí từng giây trên timeline.</p>

<h3>Nhạc và hiệu ứng âm thanh — đọc trước khi đăng YouTube</h3>
${slide('cr-12', 9, 'Nhạc nền ducking dưới giọng nói')}
<p>Thư viện <strong>Commercial Music</strong> có sẵn trong CapCut — hơn 500.000 bài, theo đúng mô tả của CapCut — được nói rõ là <strong>"pre-cleared for commercial use on the CapCut and TikTok platforms"</strong> (được phép dùng thương mại TRÊN chính nền tảng CapCut và TikTok). Đọc kỹ phạm vi đó: nó nêu tên CapCut và TikTok cụ thể, không phải YouTube, Instagram, hay Facebook. Với nhạc thường (không thuộc "Commercial Music") trong thư viện, CapCut nói thẳng: <strong>"CapCut has not cleared this music to use for commercial purposes... consult your legal team"</strong> (CapCut chưa cấp phép nhạc này cho mục đích thương mại — hỏi bộ phận pháp lý của bạn). CapCut còn có bộ kiểm bản quyền sẵn, nhưng được ghi rõ là để kiểm TRƯỚC KHI đăng TikTok, không phải kiểm chung mọi nền tảng. Bài học thực tế cho khoá này, vì có đăng cả YouTube: coi "Commercial Music" là an toàn cho TikTok nhưng KHÔNG mặc nhiên an toàn cho YouTube — với YouTube, ưu tiên YouTube Audio Library, hoặc nhạc bạn tự xác nhận đã có giấy phép, vì một Content ID claim ở đó thường chỉ là chia sẻ doanh thu quảng cáo chứ không gỡ video, nhưng vẫn đáng tránh chủ động.</p>

<h3>Ducking: hạ nhạc khi có giọng nói</h3>
<p>CapCut không có một nút "duck audio" duy nhất. Làm bằng keyframe âm lượng: chọn clip nhạc trên track âm thanh riêng, mở bảng thuộc tính ④ → Audio → Volume, kéo xuống khoảng <strong>−15…−20 dB</strong> đúng chỗ giọng bắt đầu, thêm keyframe ngay trước và sau để đổi mượt thay vì giật. Lần đầu hơi mất công, tới lần thứ ba là nhanh.</p>

<h3>Enhance voice và Reduce noise</h3>
<p>Cả hai là công cụ AI một-cú-bấm trong panel Audio. <strong>Reduce noise</strong> xoá tiếng ồn nền (máy lạnh, xe cộ, gió); <strong>Enhance voice</strong> xoá "tiếng vọng, tiếng bốp, và tạp âm khác" theo đúng mô tả của CapCut. Reduce noise đã xác nhận là tính năng CapCut Pro; nên coi Enhance voice tương tự cho tới khi tự kiểm trong tài khoản của bạn, vì cả hai nằm chung bộ công cụ AI trả phí. Không cái nào thay thế được thu âm tốt từ Chương 9 — chúng làm sạch một bản ghi, không cứu được một bản ghi tệ.</p>

<h3>Màu cơ bản trong Adjust</h3>
${slide('cr-12', 11, 'Màu cơ bản trong Adjust')}
<p>Adjust cho thanh trượt đơn giản — Brightness, Contrast, Saturation, Temperature/Tint, Highlight/Shadow — cộng preset Filter một-chạm. Vậy là đủ thật sự cho một video ngắn: sửa phơi sáng trước, nhích nhẹ contrast và saturation (màu quá rực là dấu hiệu rõ nhất của "mới học dựng"), và áp CÙNG một mức chỉnh cho mọi clip cùng một buổi quay để video trông như một khối liền mạch. Grading nhiều lớp bằng node, theo dõi bằng waveform/vectorscope, là chuyện của DaVinci Resolve — Chương 15.</p>

<div class="pitfall"><strong>Bẫy:</strong> thêm phụ đề hoặc tiêu đề trước khi nhát cắt đã chốt hẳn. Mỗi lần cắt lại sau đó, mọi phụ đề từ điểm đó trở đi bị lệch thời gian so với nhịp mới, và bạn phải canh lại tay từng dòng.</div>

<h3>🎬 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy Auto captions trên bản đã chốt cắt từ Bài 12.2; đọc lại và sửa mọi chỗ nghe sai.</li>
<li>Kiểm mọi dòng phụ đề nằm trong vùng an toàn trên khung xem trước 9:16.</li>
<li>Thêm một dòng chữ hook trong giây đầu tiên.</li>
<li>Thêm nhạc nền từ Commercial Music và ducking dưới giọng bằng keyframe âm lượng.</li>
<li>Áp một mức chỉnh màu nhất quán cho mọi clip.</li>
</ol><p><strong>Đạt khi:</strong> phụ đề không còn lỗi chính tả, nhạc không bao giờ át giọng nói, và cả video chỉ dùng tối đa một kiểu chuyển cảnh.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Vùng an toàn</span><span class="v">Phần khung 9:16 KHÔNG bị UI nền tảng che (nút bấm, chú thích, tên người dùng)</span></div>
  <div class="kv"><span class="k">Commercial Music</span><span class="v">Thư viện nhạc có giấy phép của CapCut, an toàn riêng cho CapCut + TikTok</span></div>
  <div class="kv"><span class="k">Ducking</span><span class="v">Hạ nhạc nền khi có người đang nói, ở đây làm bằng keyframe âm lượng</span></div>
  <div class="kv"><span class="k">Content ID</span><span class="v">Hệ thống tự động của YouTube phát hiện âm thanh có bản quyền trong video tải lên</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Auto captions nhanh nhưng không miễn lỗi hay miễn hạn mức — đọc lại, và kiểm giới hạn tháng ngay trong app.</li>
<li>Một hook, hiệu ứng tiết chế, một tông màu nhất quán — không phải mỗi thứ một kiểu.</li>
<li>"Commercial Music" an toàn riêng cho CapCut/TikTok, không mặc nhiên an toàn cho YouTube — chọn nhạc riêng cho YouTube.</li>
<li>Ducking và Enhance voice/Reduce noise làm sạch âm thanh; không thay được thu âm tốt.</li>
</ul>

<div class="link-card"><a href="https://www.capcut.com/help/how-to-recognise-subtitles" target="_blank" rel="noopener">CapCut Help — Cách nhận diện (tự tạo) phụ đề</a></div>
<div class="link-card"><a href="https://www.capcut.com/help/bilingual-subtitles" target="_blank" rel="noopener">CapCut Help — Cách nhận diện phụ đề song ngữ</a></div>
</div>
`,
    },

    /* ─────────────────── 12.4 Xuất & quy trình ─────────────────── */
    {
      title: '12.4 — Export settings and the full CapCut workflow|||12.4 — Thông số xuất và quy trình CapCut trọn vẹn',
      slug: 'cr-12-4-xuat-quy-trinh-capcut',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Xuất đúng thông số từng nền tảng, đặt tên file, tắt watermark/Outro, quy trình 10 bước dựng một video ngắn, và khi nào cần chuyển sang DaVinci Resolve.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>Export with the right numbers, and know when CapCut has done its job</h2>
<p class="lead">Everything up to this point lives inside CapCut's timeline. This lesson turns it into an actual file — the right resolution and bitrate for where it is going, no CapCut branding stuck on the end, a filename you can find again in six months — and then the full 10-step path from raw Pocket 3 footage to a posted 60-second video.</p>

<h3>Export settings per platform</h3>
${slide('cr-12', 13, 'Thông số xuất cho từng nền tảng')}
<p>Open <strong>Export</strong> (⌘E). The dialog gives you Resolution, Frame rate, and Bitrate (with a <strong>Custom</strong> option where you can type an exact Kbps value instead of trusting a generic "Recommended" setting), plus a codec choice: <strong>H.264</strong> for universal compatibility, or <strong>HEVC</strong> — currently labeled <strong>"(Alpha)"</strong> in this CapCut build, meaning it is still experimental, so H.264 is the safer default for now. On Mac, CapCut also offers the <strong>Apple ProRes</strong> family (422, 422 LT, 422 HQ, 4444, 4444 XQ, Proxy) for a high-quality intermediate file — useful if you plan to hand a project off to DaVinci Resolve for grading (Chapter 13/15) instead of finishing color in CapCut.</p>
<table>
<tr><th>Platform</th><th>Frame</th><th>fps</th><th>Recommended bitrate</th><th>Codec/format</th></tr>
<tr><td>TikTok · Reels · Shorts</td><td>1080×1920 (9:16)</td><td>30 (60 for fast motion)</td><td>8–15 Mbps</td><td>H.264 · MP4</td></tr>
<tr><td>YouTube 1080p</td><td>1920×1080 (16:9)</td><td>match footage</td><td>8 Mbps standard / 12 Mbps at 48–60fps</td><td>H.264 · MP4</td></tr>
<tr><td>YouTube 4K</td><td>3840×2160 (16:9)</td><td>match footage</td><td>35–45 Mbps standard / 53–68 Mbps at 48–60fps</td><td>H.264 · MP4</td></tr>
<tr><td>Handoff to DaVinci for color</td><td>keep timeline size</td><td>match footage</td><td>Custom → maximum</td><td>ProRes 422 (Mac)</td></tr>
</table>
<p>The YouTube numbers are quoted directly from YouTube's own recommended upload encoding settings page (linked below), not a guess — YouTube also recommends AAC-LC or Opus audio at 48kHz, 384 kbps for stereo. The 4K row only matters if your source footage is actually 4K; CapCut (per its own help article) will not let you export 4K if every clip in the project is 1080p or lower.</p>

<h3>Turn off the watermark and the Outro</h3>
<p>By default, a free export burns in the text <strong>"Made with CapCut Desktop"</strong> — confirmed literally in the app. In the export dialog, find the <strong>Watermark</strong> setting and choose <strong>Remove</strong> instead of Keep. Signed-in free accounts get a small number of watermark-free exports per month before it defaults back on; CapCut Pro removes the limit entirely. Separately, check that you have not left CapCut's own <strong>Outro</strong> clip (a short branded end card, available as a template) attached to the end of your project — it is a different feature from the watermark toggle and has to be removed on its own if you added it or a template included it.</p>
<div class="pitfall"><strong>Trap:</strong> exporting a video for a client, a course, or your own channel and only noticing the "Made with CapCut Desktop" watermark after it is already posted. Check the Watermark setting on every single export, not just the first one — it is easy to assume a setting "stuck" from last time when it did not.</div>

<h3>Naming the exported file</h3>
<p>Reuse the same convention from Chapter 11's raw-footage naming, applied to the finished export: date, short description, platform, version — e.g. <code>2026-09-22_pocket3-vlog-da-nang_tiktok_v1.mp4</code>. Six months from now, "Video xuất.mp4" tells you nothing; a name like that tells you everything without opening the file.</p>

<h3>The full 10-step path: raw footage to a posted 60-second video</h3>
${slide('cr-12', 14, 'Quy trình 10 bước dựng video ngắn')}
<p>This is Lessons 12.1 through 12.4, in the order you actually do them:</p>
<ol>
<li>Create the project with the aspect ratio and frame rate that match your footage.</li>
<li>Import the whole card; drag likely B-roll onto V2.</li>
<li>Rough cut: place A-roll on V1 in script order.</li>
<li>Fine cut: jump-cut out dead air with Q/W, Main track magnet on.</li>
<li>Cover the rough spots with B-roll; add 1–2 keyframe punch-ins.</li>
<li>Auto captions, then proofread and fix every mis-heard word.</li>
<li>Add background music, ducked under your voice.</li>
<li>Apply one consistent basic color adjustment across every clip.</li>
<li>Watch it once, full-screen, without scrubbing — this is what a real viewer sees.</li>
<li>Export with the correct platform settings, watermark off, filename that makes sense.</li>
</ol>

<h3>When CapCut is enough, and when to move to DaVinci Resolve</h3>
<p>CapCut is genuinely enough for most of what this course asks you to publish: talking-head videos, vlogs, short-form content, anything where "clean cut, readable captions, one consistent color look" is the bar. Reach for <strong>DaVinci Resolve</strong> (Chapter 13) instead when you need: color grading with scopes (waveform, vectorscope) instead of sliders you are eyeballing; multicam sync across the Pocket 3 and iPhone shooting the same scene; a node-based grade you can copy precisely across a whole project; or Log/Apple Log footage that needs a proper color transform rather than "push saturation up a bit." Nothing about switching is permanent — many editors cut in CapCut for speed and only open Resolve for the final color and audio pass.</p>

<h3>🎬 Practice (20–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Take the video you built across Lessons 12.1–12.3 and export it for TikTok/Reels/Shorts: 1080×1920, 30fps, H.264, Watermark set to Remove.</li>
<li>Confirm in Finder that the exported file plays, has no "Made with CapCut" text burned in, and is under 60 seconds.</li>
<li>Rename the file using the date/description/platform/version convention above.</li>
<li>Write one sentence: for THIS video, was CapCut enough, or would color grading in DaVinci have changed anything?</li>
</ol><p><strong>Done when:</strong> you have one correctly-named, correctly-exported, watermark-free .mp4 that matches the export table above.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bitrate</span><span class="v">How much data per second of video — higher keeps more detail, at a larger file size</span></div>
  <div class="kv"><span class="k">HEVC (Alpha)</span><span class="v">H.265 export option in this CapCut build, marked experimental</span></div>
  <div class="kv"><span class="k">ProRes</span><span class="v">Apple's high-quality intermediate codec family, for handoff to further grading</span></div>
  <div class="kv"><span class="k">Outro</span><span class="v">CapCut's own branded end-card clip — separate from the watermark toggle</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Match export settings to the destination platform — the table above is sourced from YouTube's own encoding guidance plus CapCut's confirmed resolution/codec options.</li>
<li>Watermark defaults ON for free accounts — check "Remove" on every export, and remove any Outro template separately.</li>
<li>Name exported files so they are identifiable months later, not just "export.mp4".</li>
<li>CapCut covers this whole chapter's workflow; DaVinci Resolve (Chapter 13) is for scope-based color, multicam, and Log footage.</li>
</ul>

<div class="link-card"><a href="https://support.google.com/youtube/answer/1722171" target="_blank" rel="noopener">YouTube Help — Recommended upload encoding settings</a></div>
<div class="link-card"><a href="https://www.capcut.com/help/export-videos-in-capcut" target="_blank" rel="noopener">CapCut Help — Exporting 2K/4K video</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Xuất đúng thông số, và biết khi nào CapCut đã làm xong việc của nó</h2>
<p class="lead">Mọi thứ tới giờ vẫn nằm trong timeline CapCut. Bài này biến nó thành một file thật — đúng độ phân giải/bitrate cho nơi nó sẽ tới, không dính logo CapCut ở cuối, tên file sáu tháng sau vẫn tìm lại được — rồi tới trọn quy trình 10 bước từ footage thô của Pocket 3 tới một video 60 giây đã đăng.</p>

<h3>Thông số xuất cho từng nền tảng</h3>
${slide('cr-12', 13, 'Thông số xuất cho từng nền tảng')}
<p>Mở <strong>Export</strong> (⌘E). Hộp thoại cho chọn Resolution, Frame rate, và Bitrate (có tuỳ chọn <strong>Custom</strong> để gõ đúng số Kbps thay vì tin vào một mức "Recommended" chung chung), cộng lựa chọn codec: <strong>H.264</strong> để tương thích rộng nhất, hoặc <strong>HEVC</strong> — hiện đang gắn nhãn <strong>"(Alpha)"</strong> trong bản CapCut này, nghĩa là còn thử nghiệm, nên H.264 vẫn là lựa chọn an toàn mặc định lúc này. Trên Mac, CapCut còn có nhóm <strong>Apple ProRes</strong> (422, 422 LT, 422 HQ, 4444, 4444 XQ, Proxy) cho file trung gian chất lượng cao — hữu ích nếu định chuyển project sang DaVinci Resolve để chỉnh màu (Chương 13/15) thay vì hoàn thiện màu ngay trong CapCut.</p>
<table>
<tr><th>Nền tảng</th><th>Khung hình</th><th>fps</th><th>Bitrate khuyến nghị</th><th>Codec/định dạng</th></tr>
<tr><td>TikTok · Reels · Shorts</td><td>1080×1920 (9:16)</td><td>30 (60 nếu chuyển động nhanh)</td><td>8–15 Mbps</td><td>H.264 · MP4</td></tr>
<tr><td>YouTube 1080p</td><td>1920×1080 (16:9)</td><td>khớp máy quay</td><td>8 Mbps chuẩn / 12 Mbps nếu 48–60fps</td><td>H.264 · MP4</td></tr>
<tr><td>YouTube 4K</td><td>3840×2160 (16:9)</td><td>khớp máy quay</td><td>35–45 Mbps chuẩn / 53–68 Mbps nếu 48–60fps</td><td>H.264 · MP4</td></tr>
<tr><td>Chuyển sang DaVinci chỉnh màu</td><td>giữ nguyên kích thước timeline</td><td>khớp máy quay</td><td>Custom → tối đa</td><td>ProRes 422 (Mac)</td></tr>
</table>
<p>Số liệu cột YouTube lấy trực tiếp từ trang khuyến nghị mã hoá chính thức của YouTube (link bên dưới), không phải đoán — YouTube cũng khuyến nghị âm thanh AAC-LC hoặc Opus ở 48kHz, 384 kbps cho stereo. Hàng 4K chỉ có ý nghĩa nếu footage gốc thật sự quay 4K; CapCut (theo đúng bài trợ giúp của họ) sẽ không cho xuất 4K nếu mọi clip trong project đều ≤ 1080p.</p>

<h3>Tắt watermark và Outro</h3>
<p>Mặc định, bản xuất miễn phí dán chữ <strong>"Made with CapCut Desktop"</strong> — đã xác nhận đúng nguyên văn trong app. Trong hộp thoại Export, tìm thiết lập <strong>Watermark</strong> và chọn <strong>Remove</strong> thay vì Keep. Tài khoản miễn phí đã đăng nhập có một số lượt xuất không-watermark mỗi tháng trước khi nó tự bật lại; CapCut Pro bỏ hẳn giới hạn đó. Riêng biệt, kiểm xem có để sót clip <strong>Outro</strong> của CapCut (một đoạn end card có thương hiệu, có sẵn dạng template) dính ở cuối project không — đây là tính năng khác với nút watermark, phải tự xoá riêng nếu bạn đã thêm hoặc một template có sẵn nó.</p>
<div class="pitfall"><strong>Bẫy:</strong> xuất video cho khách, cho khoá học, hay cho kênh riêng, rồi chỉ nhận ra chữ "Made with CapCut Desktop" SAU KHI đã đăng. Kiểm thiết lập Watermark ở MỌI lần xuất, không chỉ lần đầu — rất dễ tưởng một thiết lập "còn giữ" từ lần trước trong khi thật ra không.</div>

<h3>Đặt tên file xuất</h3>
<p>Dùng lại đúng quy ước đặt tên footage gốc từ Chương 11, áp cho bản xuất hoàn chỉnh: ngày, mô tả ngắn, nền tảng, phiên bản — ví dụ <code>2026-09-22_pocket3-vlog-da-nang_tiktok_v1.mp4</code>. Sáu tháng sau, "Video xuất.mp4" không nói lên điều gì; một cái tên như trên nói hết mà không cần mở file.</p>

<h3>Trọn quy trình 10 bước: từ footage thô tới video 60 giây đã đăng</h3>
${slide('cr-12', 14, 'Quy trình 10 bước dựng video ngắn')}
<p>Đây chính là Bài 12.1 tới 12.4, theo đúng thứ tự bạn thực sự làm:</p>
<ol>
<li>Tạo project với tỉ lệ và fps khớp footage.</li>
<li>Import cả thẻ; kéo B-roll khả dụng lên V2.</li>
<li>Lượt thô: đặt A-roll lên V1 theo đúng thứ tự kịch bản.</li>
<li>Lượt tinh: jump cut khoảng chết bằng Q/W, bật Main track magnet.</li>
<li>Che chỗ thô bằng B-roll; thêm 1–2 keyframe punch-in.</li>
<li>Auto captions, rồi đọc lại và sửa mọi chỗ nghe sai.</li>
<li>Thêm nhạc nền, ducking dưới giọng nói.</li>
<li>Áp một mức chỉnh màu cơ bản nhất quán cho mọi clip.</li>
<li>Xem lại một lượt, full-screen, không tua — đây là thứ người xem thật sự thấy.</li>
<li>Xuất đúng thông số nền tảng, tắt watermark, tên file rõ nghĩa.</li>
</ol>

<h3>Khi nào CapCut là đủ, khi nào chuyển sang DaVinci Resolve</h3>
<p>CapCut thật sự đủ cho phần lớn thứ khoá này yêu cầu bạn đăng: video talking head, vlog, nội dung ngắn, bất cứ đâu mà tiêu chuẩn là "cắt sạch, phụ đề đọc được, một tông màu nhất quán". Chuyển sang <strong>DaVinci Resolve</strong> (Chương 13) khi bạn cần: chỉnh màu theo scope (waveform, vectorscope) thay vì kéo thanh trượt bằng mắt ước lượng; đồng bộ đa máy giữa Pocket 3 và iPhone cùng quay một cảnh; một node-graph chỉnh màu copy chính xác cho cả project; hoặc footage Log/Apple Log cần chuyển đổi màu đúng cách thay vì "đẩy saturation lên một chút". Chuyển đổi không phải chuyện một chiều — nhiều người dựng dùng CapCut để cắt cho nhanh rồi chỉ mở Resolve cho lượt màu và âm thanh cuối.</p>

<h3>🎬 Thực hành (20–30 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy video bạn dựng xuyên suốt Bài 12.1–12.3 và xuất cho TikTok/Reels/Shorts: 1080×1920, 30fps, H.264, Watermark đặt Remove.</li>
<li>Xác nhận trong Finder file xuất phát được, không dính chữ "Made with CapCut", và dưới 60 giây.</li>
<li>Đổi tên file theo đúng quy ước ngày/mô tả/nền tảng/phiên bản ở trên.</li>
<li>Viết một câu: với video NÀY, CapCut đã đủ chưa, hay chỉnh màu trong DaVinci sẽ đổi được gì?</li>
</ol><p><strong>Đạt khi:</strong> có một file .mp4 đặt tên đúng, xuất đúng, không watermark, khớp đúng bảng thông số ở trên.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bitrate</span><span class="v">Lượng dữ liệu mỗi giây của video — cao hơn giữ nhiều chi tiết hơn, đổi lại file nặng hơn</span></div>
  <div class="kv"><span class="k">HEVC (Alpha)</span><span class="v">Tuỳ chọn xuất H.265 trong bản CapCut này, đang gắn nhãn thử nghiệm</span></div>
  <div class="kv"><span class="k">ProRes</span><span class="v">Nhóm codec trung gian chất lượng cao của Apple, để chuyển tiếp sang chỉnh màu sâu hơn</span></div>
  <div class="kv"><span class="k">Outro</span><span class="v">Clip end card có thương hiệu riêng của CapCut — khác với nút watermark</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Khớp thông số xuất với nền tảng đích — bảng trên lấy từ khuyến nghị mã hoá chính thức của YouTube cộng các tuỳ chọn độ phân giải/codec đã xác nhận của CapCut.</li>
<li>Watermark mặc định BẬT với tài khoản miễn phí — kiểm "Remove" ở mọi lần xuất, và tự xoá riêng mọi template Outro.</li>
<li>Đặt tên file xuất sao cho vài tháng sau vẫn nhận ra, không chỉ "export.mp4".</li>
<li>CapCut phủ hết quy trình chương này; DaVinci Resolve (Chương 13) dành cho chỉnh màu theo scope, đa máy, và footage Log.</li>
</ul>

<div class="link-card"><a href="https://support.google.com/youtube/answer/1722171" target="_blank" rel="noopener">YouTube Help — Thông số mã hoá khuyến nghị khi tải lên</a></div>
<div class="link-card"><a href="https://www.capcut.com/help/export-videos-in-capcut" target="_blank" rel="noopener">CapCut Help — Xuất video 2K/4K</a></div>
</div>
`,
    },

    /* ─────────────────── 12.5 Kiểm tra chương ─────────────────── */
    {
      title: '12.5 — Chapter 12 check|||12.5 — Kiểm tra chương 12',
      slug: 'cr-12-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: '10 câu tình huống về giao diện, main track magnet, jump cut, bản quyền nhạc, watermark, và khi nào chuyển sang DaVinci Resolve.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on everything from Chapter 12: the interface, project settings, main track magnet vs. linkage, jump cuts, keyframes, captions, music licensing, watermark, and when to graduate to DaVinci Resolve.</p>
<h3>The chapter in one checklist</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Before importing</span><span class="lz-t">Match project to footage</span><span class="lz-d">Aspect ratio and fps set BEFORE you drag in clips — fixing it after always costs a re-crop or a retime.</span></div>
  <div class="lz-step"><span class="lz-k">Cutting</span><span class="lz-t">Rough cut, then fine cut</span><span class="lz-d">⌘B splits, Q/W delete-and-close with Main track magnet on. Jump cuts are normal; B-roll softens them.</span></div>
  <div class="lz-step"><span class="lz-k">Polish</span><span class="lz-t">Captions, restraint, licensed music</span><span class="lz-d">Proofread Auto captions, one consistent look, and "Commercial Music" only guarantees CapCut+TikTok — not YouTube.</span></div>
  <div class="lz-step"><span class="lz-k">Export</span><span class="lz-t">Right numbers, no watermark</span><span class="lz-d">Match the platform's resolution/bitrate table, set Watermark to Remove every single time.</span></div>
</div>
<p class="note-ct">If a question below surprises you, that is exactly the lesson to reopen — every answer here traces back to a specific fact checked against the CapCut app itself or an official source, not a guess.</p></div>
<div class="ml-vi"><p class="lead">Mười câu về mọi thứ trong Chương 12: giao diện, cài đặt project, main track magnet với linkage, jump cut, keyframe, phụ đề, bản quyền nhạc, watermark, và khi nào lên đời DaVinci Resolve.</p>
<h3>Cả chương trong một checklist</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Trước khi import</span><span class="lz-t">Khớp project với footage</span><span class="lz-d">Tỉ lệ và fps đặt TRƯỚC khi kéo clip vào — sửa sau luôn tốn công crop lại hoặc canh lại thời gian.</span></div>
  <div class="lz-step"><span class="lz-k">Cắt dựng</span><span class="lz-t">Lượt thô rồi lượt tinh</span><span class="lz-d">⌘B tách, Q/W xoá-và-khít khi bật Main track magnet. Jump cut là bình thường; B-roll làm mềm nó.</span></div>
  <div class="lz-step"><span class="lz-k">Hoàn thiện</span><span class="lz-t">Phụ đề, tiết chế, nhạc có phép</span><span class="lz-d">Đọc lại Auto captions, một tông màu nhất quán, và "Commercial Music" chỉ đảm bảo CapCut+TikTok — không phải YouTube.</span></div>
  <div class="lz-step"><span class="lz-k">Xuất</span><span class="lz-t">Đúng thông số, không watermark</span><span class="lz-d">Khớp đúng bảng độ phân giải/bitrate của nền tảng, đặt Watermark thành Remove ở MỌI lần xuất.</span></div>
</div>
<p class="note-ct">Câu nào dưới đây khiến bạn bất ngờ thì đó đúng là bài cần mở lại — mọi đáp án ở đây đều bám theo một sự thật cụ thể đã kiểm trong chính app CapCut hoặc nguồn chính thức, không phải đoán.</p></div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You create a 9:16 project, then drag in 16:9 footage. What actually happens?|||Bạn tạo project 9:16, rồi kéo footage 16:9 vào. Điều gì thực sự xảy ra?',
            options: [
              'CapCut automatically center-crops the footage to fill the frame, permanently cutting both edges|||CapCut tự crop giữa khung để lấp đầy, cắt mất vĩnh viễn hai bên hình',
              'CapCut refuses to import the clip until you change the project ratio|||CapCut từ chối import clip cho tới khi bạn đổi tỉ lệ project',
              'CapCut adds black bars on the sides and keeps the full frame|||CapCut thêm thanh đen hai bên và giữ nguyên toàn bộ khung hình',
              'CapCut automatically switches the project ratio to match the clip|||CapCut tự đổi tỉ lệ project cho khớp với clip',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: CapCut center-crops to fill a mismatched frame — this is the exact pitfall Lesson 12.1 warns about. Black bars (option C) would preserve the image but that is not CapCut\'s default behavior; the project ratio does not auto-change (D); import is never blocked (B).|||VI: CapCut tự crop giữa khung khi tỉ lệ không khớp — đúng cái bẫy Bài 12.1 cảnh báo. Thanh đen (câu C) sẽ giữ nguyên hình nhưng không phải hành vi mặc định của CapCut; tỉ lệ project không tự đổi (D); import không bao giờ bị chặn (B).',
          },
          {
            question: 'You are cutting footage shot on the Pocket 3 indoors in Vietnam, and want to avoid flicker from mains-powered lights. What frame rate should the project use?|||Bạn dựng footage quay Pocket 3 trong nhà ở Việt Nam, muốn tránh đèn nhấp nháy. Project nên đặt fps bao nhiêu?',
            options: ['24fps', '30fps', '!25fps', '60fps'],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Vietnam runs 50Hz mains power, so 25fps (or 50fps for slow motion) avoids the flicker that 24/30fps (the American-default rates) can cause under indoor lighting — this was already the shooting frame rate set back in Chapter 5/6.|||VI: Việt Nam dùng điện 50Hz, nên 25fps (hoặc 50fps để làm chậm) tránh được nhấp nháy mà 24/30fps (tốc độ mặc định kiểu Mỹ) có thể gây ra dưới đèn trong nhà — đây chính là fps đã đặt lúc quay từ Chương 5/6.',
          },
          {
            question: 'You delete the middle clip out of three clips on V1 and want the remaining two to snap together with no gap. What do you turn on?|||Bạn xoá clip giữa trong 3 clip trên V1 và muốn hai clip còn lại tự khít không hở. Bạn bật gì?',
            options: [
              'Linkage|||Linkage',
              '!Main track magnet|||Main track magnet',
              'Auto snapping|||Auto snapping',
              'File proxy|||File proxy',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Main track magnet is the setting confirmed in the app itself to keep main-track clips connected — gaps close automatically after a deletion. Linkage is a different toggle (controls whether OTHER attached elements move/delete with a clip); Auto snapping is about dragging near edges, not gap-closing; File proxy is unrelated to editing behavior.|||VI: Main track magnet là thiết lập đã xác nhận trong chính app giữ các clip trên main track luôn khít nhau — khoảng hở tự đóng sau khi xoá. Linkage là công tắc khác (quyết định các thành phần KHÁC có di chuyển/xoá theo clip không); Auto snapping là về việc kéo gần mép, không phải khít khoảng hở; File proxy không liên quan hành vi dựng.',
          },
          {
            question: 'While jump-cutting a talking head, you zoom into the waveform and see a flat, low stretch right before you start speaking. What is it, and what should you do?|||Khi jump cut talking head, bạn phóng to sóng âm và thấy một đoạn phẳng, thấp ngay trước khi bạn bắt đầu nói. Đó là gì, và nên làm gì?',
            options: [
              'A filler word — leave it, filler words are inaudible|||Một từ đệm — để nguyên, từ đệm không nghe được',
              'A corrupted audio file — re-import the clip|||File âm thanh bị lỗi — import lại clip',
              '!Silence/a pause — cut it out with Q or W|||Khoảng im lặng/một quãng dừng — cắt bỏ bằng Q hoặc W',
              'Background music bleeding into the mic — reduce the music track volume|||Nhạc nền lọt vào mic — giảm âm lượng track nhạc',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: A flat, low waveform stretch is exactly what silence/a pause looks like — Lesson 12.2 teaches cutting it with Q (delete left of playhead) or W (delete right), with Main track magnet closing the gap.|||VI: Một đoạn sóng âm phẳng, thấp chính là hình dạng của khoảng im lặng/quãng dừng — Bài 12.2 dạy cắt nó bằng Q (xoá bên trái playhead) hoặc W (xoá bên phải), Main track magnet tự khít khoảng hở.',
          },
          {
            question: 'You want CapCut to automatically find and delete every pause, repetition, and filler word in one click, instead of doing it by hand with Q/W. What do you need?|||Bạn muốn CapCut tự tìm và xoá mọi khoảng dừng, câu lặp, từ đệm trong một cú bấm, thay vì tự làm tay bằng Q/W. Bạn cần gì?',
            options: [
              'Nothing extra — this is built into the free version under Auto captions|||Không cần gì thêm — cái này có sẵn trong bản miễn phí, nằm trong Auto captions',
              '!CapCut Pro\'s "Remove filler words" tool|||Công cụ "Remove filler words" của CapCut Pro',
              'A third-party plugin, since CapCut has no such feature|||Một plugin bên thứ ba, vì CapCut không có tính năng này',
              'Auto reframe, run on the audio track|||Auto reframe, chạy trên track âm thanh',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: "Remove filler words" is confirmed as a real CapCut feature — but gated behind CapCut Pro in the app\'s own text ("Join Pro to identify and delete pauses, repetitions, and filler words in one click"). The free path taught in this chapter is doing it by hand with Q/W while watching the waveform.|||VI: "Remove filler words" là tính năng CapCut có thật — nhưng khoá sau CapCut Pro, đúng theo chữ trong app ("Join Pro để nhận diện và xoá khoảng dừng, câu lặp, từ đệm trong một cú bấm"). Đường miễn phí mà chương này dạy là tự làm tay bằng Q/W trong khi nhìn sóng âm.',
          },
          {
            question: 'You run Auto reframe on a screen-recording-plus-webcam video (slides + your face) to convert it from 16:9 to 9:16, and the result crops out important slide content. Why?|||Bạn chạy Auto reframe trên video quay màn hình + webcam (slide + mặt bạn) để đổi từ 16:9 sang 9:16, và kết quả cắt mất nội dung slide quan trọng. Vì sao?',
            options: [
              'Auto reframe only works on 9:16-to-16:9 conversions, not the other direction|||Auto reframe chỉ chạy chiều 9:16 sang 16:9, không chạy chiều ngược lại',
              'Auto reframe requires CapCut Pro and silently fails without it|||Auto reframe cần CapCut Pro và tự âm thầm lỗi nếu không có',
              '!Auto reframe tries to keep one main subject in frame — it is not built for a layout with multiple important elements|||Auto reframe cố giữ MỘT chủ thể chính trong khung — không hợp với bố cục có nhiều thành phần quan trọng cùng lúc',
              'This means the source footage was not shot at the right frame rate|||Nghĩa là footage gốc không được quay đúng fps',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: CapCut\'s own description says Auto reframe keeps "the main object in the video" in frame — singular. It works well on one still subject and guesses wrong on a slides+webcam layout, exactly as Lesson 12.2 warns; manual crop is the fix.|||VI: Mô tả chính thức của CapCut nói Auto reframe giữ "vật thể chính" trong khung — số ít. Nó hiệu quả với một chủ thể đứng yên và đoán sai với bố cục slide+webcam, đúng như Bài 12.2 cảnh báo; tự crop bằng tay là cách chữa.',
          },
          {
            question: 'You add a keyframe zoom punch-in on every single sentence in a 90-second video. What is the likely result?|||Bạn thêm keyframe zoom punch-in cho MỌI câu trong một video 90 giây. Kết quả nhiều khả năng là gì?',
            options: [
              'CapCut caps punch-ins at 3 per video and will block the rest|||CapCut giới hạn tối đa 3 punch-in mỗi video và sẽ chặn phần còn lại',
              'Export will fail because of too many keyframes|||Xuất sẽ lỗi vì quá nhiều keyframe',
              'The video gets noticeably slower to scrub in the timeline, but looks the same on export|||Timeline sẽ kéo/tua chậm rõ rệt, nhưng khi xuất thì nhìn vẫn như cũ',
              '!The zoom stops reading as emphasis and starts feeling like a tic — the technique loses its effect from overuse|||Cú zoom thôi đọc như sự nhấn mạnh mà thành một tật lặp lại — kỹ thuật mất tác dụng vì lạm dụng',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Lesson 12.2 is explicit: two keyframes per punch-in is enough, used sparingly on the strongest moments — animating every sentence turns emphasis into a distracting tic, not a technical or export limit.|||VI: Bài 12.2 nói rõ: hai keyframe mỗi punch-in là đủ, dùng tiết chế ở những khoảnh khắc mạnh nhất — animate mọi câu biến sự nhấn mạnh thành một tật gây xao nhãng, không phải giới hạn kỹ thuật hay lỗi xuất file.',
          },
          {
            question: 'You use a track from CapCut\'s "Commercial Music" library and post the video to YouTube. Are you fully safe from a copyright claim there?|||Bạn dùng một bài trong thư viện "Commercial Music" của CapCut rồi đăng video lên YouTube. Có hoàn toàn an toàn khỏi bị đánh dấu bản quyền ở đó không?',
            options: [
              'Yes — Commercial Music is pre-cleared worldwide for any platform|||Có — Commercial Music đã được cấp phép toàn cầu cho mọi nền tảng',
              '!Not necessarily — CapCut\'s own wording clears Commercial Music specifically for the CapCut and TikTok platforms, not YouTube|||Không hẳn — chính CapCut ghi rõ Commercial Music được phép dùng riêng trên nền tảng CapCut và TikTok, không phải YouTube',
              'No — Commercial Music can never be used in any exported video|||Không — Commercial Music không bao giờ được dùng trong video xuất ra',
              'It depends only on the song\'s genre, not the platform|||Chỉ phụ thuộc thể loại bài hát, không phụ thuộc nền tảng',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: CapCut\'s own text says Commercial Music is "pre-cleared for commercial use on the CapCut and TikTok platforms" — that scope does not mention YouTube. For YouTube uploads, Lesson 12.3 recommends the YouTube Audio Library or separately-confirmed licensed music instead.|||VI: Chính CapCut ghi rằng Commercial Music "pre-cleared for commercial use on the CapCut and TikTok platforms" — phạm vi đó không nhắc tới YouTube. Với video đăng YouTube, Bài 12.3 khuyên dùng YouTube Audio Library hoặc nhạc tự xác nhận đã có giấy phép riêng.',
          },
          {
            question: 'You export a video and are surprised to see "Made with CapCut Desktop" burned in, even though you remember disabling it once before. What is the most likely explanation?|||Bạn xuất video và bất ngờ thấy chữ "Made with CapCut Desktop" dán trên hình, dù nhớ đã từng tắt nó một lần. Lý do khả dĩ nhất là gì?',
            options: [
              'The Watermark setting is per-export, not a saved global preference — it has to be checked every time|||Thiết lập Watermark tính theo từng lần xuất, không phải một tuỳ chọn lưu chung toàn cục — phải kiểm lại mỗi lần',
              'The Outro template was reattached automatically|||Template Outro đã tự gắn lại',
              'CapCut requires renewing the watermark-off setting every 24 hours|||CapCut yêu cầu bật lại thiết lập tắt watermark mỗi 24 giờ',
              '!Both A and a free account\'s limited monthly watermark-free exports can explain it — check the Watermark setting on this specific export|||Cả lý do "thiết lập tính theo từng lần xuất" LẪN hạn mức xuất-không-watermark hàng tháng của tài khoản miễn phí đều có thể giải thích — kiểm lại thiết lập Watermark ngay ở lần xuất này',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Lesson 12.4\'s pitfall covers exactly this: the Watermark toggle is not something that "stays off" — and free accounts also have a monthly cap on watermark-free exports before it defaults back on. Either cause means the fix is the same: check Watermark → Remove on every export.|||VI: Đúng cái bẫy Bài 12.4 đã nói: nút Watermark không phải thứ "tắt là giữ mãi" — và tài khoản miễn phí còn có hạn mức xuất-không-watermark mỗi tháng, hết là nó tự bật lại. Dù nguyên nhân nào, cách chữa như nhau: kiểm Watermark → Remove ở mọi lần xuất.',
          },
          {
            question: 'You need to color-grade multi-layer with waveform/vectorscope monitoring, and sync footage shot simultaneously on the Pocket 3 and the iPhone. Which tool fits, and why?|||Bạn cần chỉnh màu nhiều lớp có theo dõi bằng waveform/vectorscope, và đồng bộ footage quay cùng lúc bằng Pocket 3 và iPhone. Công cụ nào hợp, vì sao?',
            options: [
              'CapCut\'s Adjust panel — its sliders can do everything a scope-based grade can|||Bảng Adjust của CapCut — thanh trượt của nó làm được mọi thứ một lượt grading theo scope làm được',
              '!DaVinci Resolve (Chapter 13) — it has node-based grading with scopes and multicam sync, which CapCut\'s simple slider-based Adjust does not|||DaVinci Resolve (Chương 13) — có chỉnh màu theo node kèm scope và đồng bộ đa máy, thứ bảng Adjust dạng thanh trượt đơn giản của CapCut không có',
              'CapCut\'s Auto reframe tool, since it also handles multi-camera footage|||Công cụ Auto reframe của CapCut, vì nó cũng xử lý được footage đa máy',
              'Neither — this requires re-shooting with a single camera|||Không cái nào cả — phải quay lại bằng một máy duy nhất',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Lesson 12.4 draws this line directly: CapCut\'s Adjust is one-layer sliders, enough for a consistent basic look, but scope-monitored node grading and multicam sync are DaVinci Resolve\'s job, covered starting Chapter 13.|||VI: Bài 12.4 vạch rõ ranh giới này: Adjust của CapCut là thanh trượt một lớp, đủ cho một tông màu nhất quán cơ bản, nhưng grading theo node có scope và đồng bộ đa máy là việc của DaVinci Resolve, bắt đầu từ Chương 13.',
          },
        ],
      },
    },
  ],
};
