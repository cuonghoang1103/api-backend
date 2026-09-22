/**
 * Content Creator — Chương 13: Dựng chuyên nghiệp với DaVinci Resolve. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, '7 trang của DaVinci Resolve — đi từ trái sang phải'],
  [4, 'Bắt đầu đúng: đặt Frame Rate TRƯỚC khi thêm media'],
  [5, 'DaVinci Resolve miễn phí và Studio khác nhau ở đâu'],
  [6, 'Trang Edit — 5 vùng làm việc chính'],
  [7, 'Phím tắt cốt lõi trang Edit (bàn phím Mac)'],
  [8, 'Tỉa cạnh: Ripple vs Roll'],
  [9, 'Tỉa nội dung: Slip vs Slide'],
  [10, 'Tỉa lệch hình/tiếng: J-cut và L-cut'],
  [11, 'Công cụ dựng khác trong trang Edit'],
  [12, 'Đồng bộ đa máy: Auto Sync Audio theo sóng âm'],
  [13, 'Multicam Clip và bộ công cụ dựng nhanh của trang Cut'],
  [14, 'Resolve trên ba máy của bạn'],
  [15, 'Quy trình 10 bước — từ thẻ nhớ tới video YouTube'],
  [16, 'Thực hành — dựng thô 3–5 phút đầu tiên'],
];

export default {
  title: 'Chapter 13 — Professional editing in DaVinci Resolve|||Chương 13 — Dựng chuyên nghiệp với DaVinci Resolve',
  description: 'Từ "quay xong không biết edit" tới tự dựng một video YouTube dài bằng DaVinci Resolve trên Mac M1 Max, và biết dùng Resolve trên iPad Pro M5 và máy Linux ở nhà.',
  lessons: [
    /* ─────────────────────── 13.0 slide bài giảng ─────────────────────── */
    {
      title: '13.0 — Chapter 13 in 16 slides|||13.0 — Chương 13 trong 16 slide',
      slug: 'cr-13-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bảy trang của Resolve, bốn kiểu tỉa cạnh, đồng bộ đa máy, Resolve trên iPad/Linux và quy trình 10 bước dựng một video YouTube — gói cả chương vào 16 slide.',
      content: `
<div class="ml-en"><h2>📑 Chapter 13 in 16 slides</h2>
<p>This is the chapter for the sentence you actually said: <em>"the most important thing is I don't know how to edit once I'm done filming."</em> Slides 8–10 (the four trim types plus J/L-cuts) and slide 15 (the 10-step workflow) are the two clusters that turn footage into a finished timeline — everything else is the map around them.</p>
<p>Skim now to see the shape of the chapter, then come back to each slide as the lesson below it explains what it means with your own hands on the keyboard.</p></div>
<div class="ml-vi"><h2>📑 Chương 13 trong 16 slide</h2>
<p>Đây là chương cho đúng câu bạn từng nói: <em>"quan trọng nhất là quay xong tôi không biết edit."</em> Slide 8–10 (bốn kiểu tỉa cạnh cộng J-cut/L-cut) và slide 15 (quy trình 10 bước) là hai cụm biến cảnh quay thành một timeline hoàn chỉnh — phần còn lại là tấm bản đồ xung quanh chúng.</p>
<p>Lướt qua bây giờ để thấy hình dạng cả chương, rồi quay lại từng slide khi bài học bên dưới nó giải thích ý nghĩa bằng chính tay bạn đặt lên bàn phím.</p></div>
${gallery('cr-13', SLIDES)}
`,
    },

    /* ─────────────────────── 13.1 Làm quen với Resolve ─────────────────────── */
    {
      title: '13.1 — Meet Resolve: 7 pages, project settings, Free vs Studio|||13.1 — Làm quen với Resolve: 7 trang, project settings, Miễn phí vs Studio',
      slug: 'cr-13-1-lam-quen-resolve',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Bảy trang của DaVinci Resolve, Project Manager, luật quan trọng nhất khi tạo dự án (đặt frame rate trước khi thêm media), và bản miễn phí đã đủ dùng hay chưa.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1</span>
<h2>DaVinci Resolve is not one program — it is seven, and you only need to learn one today</h2>
<p class="lead">CapCut (Chapter 12) gets you a finished vertical video in twenty minutes. DaVinci Resolve is the tool for the video that needs to look and sound like it was actually cut on purpose — your long YouTube tutorials, your vlogs, anything you will be proud to put your name on. It looks intimidating because it is actually <em>seven programs stitched into one window</em>. This lesson gives you the map, and one rule that will save you a redone project: set your frame rate before you touch a single clip.</p>

<h3>Seven pages, roughly in the order you use them</h3>
${slide('cr-13', 3, '7 trang của DaVinci Resolve — đi từ trái sang phải')}
<p>Along the bottom of the Resolve window is a row of seven icons. Each one is a full <strong>page</strong> — its own complete workspace, built for one job in the pipeline. You do not use all seven on every video; for most of your YouTube tutorials and vlogs you will live almost entirely in one page (Edit) and pass briefly through two more (Color, Fairlight).</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Media</span><span class="v">Where footage arrives. Browse folders, organize clips into bins, add metadata. Chapter 11's file structure lives here.</span></div>
  <div class="kv"><span class="k">Cut</span><span class="v">A stripped-down, fast editor — built for turning raw footage into a rough assembly quickly. Lesson 13.3 covers its speed tools.</span></div>
  <div class="kv"><span class="k">Edit</span><span class="v">The main workshop. Every trim tool, every keyboard shortcut, Text+, transitions — this is where you will spend most of your time. Lesson 13.2 is entirely about this page.</span></div>
  <div class="kv"><span class="k">Fusion</span><span class="v">Node-based visual effects and compositing. Powerful, but not something a tutorial or vlog usually needs — you can skip it for now.</span></div>
  <div class="kv"><span class="k">Color</span><span class="v">Grading with scopes and node trees. Chapter 15 is the whole chapter on this page.</span></div>
  <div class="kv"><span class="k">Fairlight</span><span class="v">A full audio mixer: EQ, compression, noise reduction, levels. Chapter 16 goes deep here.</span></div>
  <div class="kv"><span class="k">Deliver</span><span class="v">Where a timeline becomes an actual video file. Presets, codecs, and the render queue.</span></div>
</div>
<div class="callout ok"><p><strong>Why this matters:</strong> when a tutorial says "go to the Color page," it means click the correspondingly-named icon at the bottom of the screen — a completely different toolset appears, not a new menu inside the same screen. Getting lost in Resolve is almost always "I'm on the wrong page," not "this tool is broken."</p></div>

<h3>Project Manager: every project you make lives in one place</h3>
<p>Launch Resolve and the first thing you see is the <strong>Project Manager</strong> — a grid of project thumbnails, like a home screen. Double-click a tile to open it, or click <strong>New Project</strong> to start one. Projects are saved automatically to Resolve's internal database as you work (no "Save" button to remember, though <code>Cmd+S</code> still exists for peace of mind). You can also right-click a project to <strong>Export</strong> it as a <code>.drp</code> file (references your media, does not embed it) or a <code>.dra</code> archive (bundles the project <em>and</em> every media file into one folder) — the archive is what you would hand to another editor or carry to another machine, since a bare <code>.drp</code> is useless without the original footage sitting at the exact same file paths.</p>

<h3>The one rule that saves you a rebuilt project: frame rate first</h3>
${slide('cr-13', 4, 'Bắt đầu đúng: đặt Frame Rate TRƯỚC khi thêm media')}
<p>Every new project has a <strong>Timeline Frame Rate</strong> setting — how many frames per second your timeline plays at. This is not a footnote; it decides how Resolve interprets every clip's timing from the moment you drop it in. Open it via <strong>File → Project Settings</strong> (or the gear icon, bottom-right of the window) → <strong>Master Settings</strong> tab → <strong>Timeline frame rate</strong>. Set it to <strong>25</strong> — it matches both the Pocket 3 and the iPhone shooting at 25fps, which Chapter 5 already convinced you is the right default for Vietnam's 50Hz mains power.</p>
<p>Here is the part that actually matters: <strong>do this before you drag a single clip into the Media Pool.</strong> Once media has been added to a project, Resolve's documentation is explicit that the normal path to changing the timeline frame rate closes — the field becomes effectively locked for that project, and the clean fix is to start a new project and set it correctly from the first click. Compare that to something like Proxy or Optimized Media settings, which you can freely turn on, off, or regenerate at any point — frame rate is a "decide once, at the start" setting; media handling is a "change it whenever" setting.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — importing footage first because you were excited to see it in the timeline.</strong> You drag your Pocket 3 clips in, then go to Project Settings to "just double-check" the frame rate — and find it locked at a value you didn't choose, or import warnings about mismatched rates. The five extra seconds it takes to set Master Settings before import is cheaper than restarting the project.</p></div>

<h3>Free or Studio — which one do you actually need?</h3>
${slide('cr-13', 5, 'DaVinci Resolve miễn phí và Studio khác nhau ở đâu')}
<p>DaVinci Resolve is free — genuinely, not a trial. Blackmagic Design's own product page draws the line mainly around resolution, frame rate, bit depth, and a stack of AI-driven tools:</p>
<table>
<tr><th>What changes</th><th>Free</th><th>Studio (295 USD, one-time)</th></tr>
<tr><td>Maximum export resolution</td><td>Ultra HD 3840×2160</td><td>Beyond 4K — DCI 4K, 6K, 8K</td></tr>
<tr><td>Maximum export frame rate</td><td>60fps</td><td>120fps</td></tr>
<tr><td>10-bit encoding (professional formats)</td><td>Limited</td><td>Yes</td></tr>
<tr><td>DaVinci Neural Engine (AI tools), Magic Mask, Speed Warp, Super Scale, Voice Isolation, AI noise reduction, text-based editing</td><td>Not included</td><td>Included</td></tr>
<tr><td>Multi-user collaboration, HDR grading</td><td>Included</td><td>Included</td></tr>
</table>
<p>For everything this course asks you to do — 1080p or 4K at up to 60fps, 8-bit color, cutting your own footage — the free version has no ceiling you will hit. There is <strong>no watermark</strong> on ordinary exports. The one place a watermark appears is if you preview or render a Studio-only effect (Magic Mask, film grain, optical blur, any Neural Engine tool) while running the free version — that watermark is a signal, not a bug: it is Resolve telling you that you just reached for a paid feature.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Stay on Free for now</span><span class="v">Everything in this course — editing, color basics (Chapter 15), audio mixing (Chapter 16) — runs on the free version.</span></div>
  <div class="kv"><span class="k">Consider Studio later</span><span class="v">If you start shooting 10-bit Log footage you want to grade seriously, want AI-assisted rotoscoping (Magic Mask) for talking-head backgrounds, or need Voice Isolation to rescue a noisy street vlog.</span></div>
</div>

<h3>Free training, straight from the people who built it</h3>
<p>Blackmagic Design publishes several full training books as free PDF downloads on their own site — hundreds of pages each, written by certified trainers: <em>The Beginner's Guide to DaVinci Resolve</em>, <em>The Editor's Guide to DaVinci Resolve</em>, and dedicated guides for Fairlight audio, color grading, and visual effects. None of this course replaces them — this chapter gets you moving fast on the exact workflow you need for your own footage; the guides are where you go when you want to go deeper on one page.</p>

<p class="note-ct"><strong>Next:</strong> Lesson 13.2 lives entirely on the Edit page — every trim tool, every shortcut, and the four ways to cut a clip's edge that most new editors never learn on purpose.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Open DaVinci Resolve, create a <strong>New Project</strong> named "CH13-Test".</li>
<li>Immediately open <strong>Project Settings → Master Settings</strong> and set <strong>Timeline Frame Rate</strong> to <strong>25</strong>. Do this before step 3.</li>
<li>Switch to the <strong>Media</strong> page and import two or three short clips from your Pocket 3 or iPhone footage.</li>
<li>Click through all seven pages at the bottom of the window, just to see what each one looks like — you are not editing anything yet.</li>
</ol><p><strong>Done when:</strong> your project's Timeline Frame Rate reads 25fps in Project Settings, and you can name, in order, what each of the seven pages is for without looking at the slide.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Page</span><span class="v">One of Resolve's seven full workspaces (Media, Cut, Edit, Fusion, Color, Fairlight, Deliver), selected from the icon row at the bottom of the window.</span></div>
  <div class="kv"><span class="k">Project Manager</span><span class="v">The grid screen where you open, create, and manage projects, shown when Resolve launches.</span></div>
  <div class="kv"><span class="k">.drp / .dra</span><span class="v">Project file (references media by path) vs. project archive (bundles the project and all its media into one folder).</span></div>
  <div class="kv"><span class="k">Timeline Frame Rate</span><span class="v">The frames-per-second your project's timeline runs at — must be set before importing media.</span></div>
  <div class="kv"><span class="k">Watermark (Studio trial)</span><span class="v">A visible mark burned into a Free-version render/preview when it uses a Studio-only effect.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Resolve is seven pages, not one program: Media → Cut → Edit → Fusion → Color → Fairlight → Deliver. Most of your work happens on Edit.</li>
<li>Set Timeline Frame Rate (25fps for this course) in Project Settings <strong>before</strong> adding any media — the field effectively locks once footage is in the project.</li>
<li>The free version has no ceiling for 1080p/4K at up to 60fps, 8-bit — everything in this course runs on it. Studio (295 USD) adds AI tools, professional 10-bit encoding, higher frame rates, and resolutions beyond 4K.</li>
<li>Free, official training books (Beginner's Guide, Editor's Guide, and more) are one download away when you want to go deeper.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve" target="_blank" rel="noopener">Blackmagic Design — DaVinci Resolve product page (Free vs Studio comparison)</a></div>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">Blackmagic Design — free training books (PDF)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1</span>
<h2>DaVinci Resolve không phải MỘT phần mềm — mà là bảy, và hôm nay bạn chỉ cần học một</h2>
<p class="lead">CapCut (Chương 12) cho bạn một video dọc hoàn chỉnh trong hai mươi phút. DaVinci Resolve là công cụ cho video cần trông và nghe như thật sự được dựng có chủ đích — những video YouTube dài, vlog, bất cứ thứ gì bạn muốn tự hào gắn tên mình vào. Nó trông đáng sợ vì thực ra đó là <em>bảy phần mềm khâu chung vào một cửa sổ</em>. Bài này cho bạn tấm bản đồ, và một luật sẽ cứu bạn khỏi việc phải dựng lại cả dự án: đặt frame rate trước khi chạm vào bất cứ clip nào.</p>

<h3>Bảy trang, gần đúng theo thứ tự bạn dùng</h3>
${slide('cr-13', 3, '7 trang của DaVinci Resolve — đi từ trái sang phải')}
<p>Dọc theo góc dưới cửa sổ Resolve là một hàng bảy biểu tượng. Mỗi biểu tượng là một <strong>trang</strong> (page) — một không gian làm việc trọn vẹn riêng, dựng cho đúng một việc trong quy trình. Bạn không dùng cả bảy trang cho mọi video; với phần lớn video hướng dẫn và vlog, bạn sẽ sống gần như trọn vẹn ở một trang (Edit) và ghé qua ngắn ngày ở hai trang khác (Color, Fairlight).</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Media</span><span class="v">Nơi cảnh quay tới đầu tiên. Duyệt thư mục, tổ chức clip vào bin, thêm metadata. Cấu trúc thư mục của Chương 11 sống ở đây.</span></div>
  <div class="kv"><span class="k">Cut</span><span class="v">Bản dựng gọn, nhanh — sinh ra để biến cảnh quay thô thành bản dựng nháp thật nhanh. Bài 13.3 nói về các công cụ tốc độ của trang này.</span></div>
  <div class="kv"><span class="k">Edit</span><span class="v">Xưởng chính. Mọi công cụ tỉa, mọi phím tắt, Text+, chuyển cảnh — đây là nơi bạn dành phần lớn thời gian. Bài 13.2 nói trọn vẹn về trang này.</span></div>
  <div class="kv"><span class="k">Fusion</span><span class="v">Kỹ xảo hình ảnh và hợp thành theo kiểu node. Mạnh, nhưng video hướng dẫn hay vlog thường không cần — bỏ qua trước cũng được.</span></div>
  <div class="kv"><span class="k">Color</span><span class="v">Chỉnh màu bằng scopes và cây node. Chương 15 dành trọn cho trang này.</span></div>
  <div class="kv"><span class="k">Fairlight</span><span class="v">Một bàn mix âm thanh đầy đủ: EQ, nén tiếng, khử ồn, chỉnh mức. Chương 16 đi sâu ở đây.</span></div>
  <div class="kv"><span class="k">Deliver</span><span class="v">Nơi một timeline trở thành một file video thật. Preset, codec, và hàng đợi xuất (render queue).</span></div>
</div>
<div class="callout ok"><p><strong>Vì sao điều này quan trọng:</strong> khi một hướng dẫn nói "sang trang Color", nghĩa là bấm vào đúng biểu tượng cùng tên ở góc dưới màn hình — một bộ công cụ hoàn toàn khác hiện ra, không phải một menu mới trong cùng màn hình. Bị lạc trong Resolve gần như luôn là "mình đang ở sai trang", không phải "công cụ này bị hỏng".</p></div>

<h3>Project Manager: mọi dự án bạn tạo sống ở một chỗ</h3>
<p>Mở Resolve lên, thứ đầu tiên bạn thấy là <strong>Project Manager</strong> — một lưới các ô thumbnail dự án, giống màn hình chính. Bấm đúp vào một ô để mở, hoặc bấm <strong>New Project</strong> để tạo mới. Dự án tự động được lưu vào cơ sở dữ liệu nội bộ của Resolve trong lúc bạn làm việc (không có nút "Save" nào phải nhớ, dù <code>⌘S</code> vẫn tồn tại cho yên tâm). Bạn cũng có thể chuột phải vào một dự án để <strong>Export</strong> ra file <code>.drp</code> (chỉ tham chiếu tới media, không nhúng vào) hoặc gói thành <code>.dra</code> (đóng gói CẢ dự án lẫn mọi file media vào một thư mục) — bản archive mới là thứ bạn đưa cho người dựng khác hoặc mang sang máy khác, vì một file <code>.drp</code> trần vô dụng nếu cảnh quay gốc không nằm đúng đường dẫn cũ.</p>

<h3>Luật quan trọng nhất, cứu bạn khỏi phải dựng lại dự án: đặt frame rate trước</h3>
${slide('cr-13', 4, 'Bắt đầu đúng: đặt Frame Rate TRƯỚC khi thêm media')}
<p>Mỗi dự án mới có một thiết lập <strong>Timeline Frame Rate</strong> — timeline của bạn chạy bao nhiêu khung hình mỗi giây. Đây không phải chi tiết phụ; nó quyết định cách Resolve hiểu thời gian của MỌI clip ngay từ lúc bạn thả nó vào. Mở qua <strong>File → Project Settings</strong> (hoặc icon bánh răng, góc dưới-phải cửa sổ) → tab <strong>Master Settings</strong> → <strong>Timeline frame rate</strong>. Đặt <strong>25</strong> — khớp cả Pocket 3 lẫn iPhone quay ở 25fps, điều mà Chương 5 đã thuyết phục bạn là mặc định đúng cho điện lưới 50Hz của Việt Nam.</p>
<p>Đây mới là phần thật sự quan trọng: <strong>làm việc này TRƯỚC KHI kéo bất kỳ clip nào vào Media Pool.</strong> Tài liệu của Resolve nói rõ: một khi media đã được thêm vào dự án, đường sửa Timeline Frame Rate bình thường coi như đóng lại — ô đó gần như bị khoá cho dự án đó, và cách sửa sạch nhất là tạo dự án mới và đặt đúng ngay từ cú bấm đầu tiên. So sánh với một thứ như Proxy hay Optimized Media — thứ bạn bật/tắt/dựng lại thoải mái bất cứ lúc nào — frame rate là thiết lập "quyết định một lần, ngay từ đầu"; cách xử lý media là thiết lập "đổi lúc nào cũng được".</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — nhập cảnh quay trước vì háo hức muốn thấy nó trong timeline.</strong> Bạn kéo clip Pocket 3 vào, rồi mới vào Project Settings để "kiểm lại cho chắc" — và thấy nó đã khoá ở một giá trị bạn không chọn, hoặc cảnh báo lệch tốc độ khung hình lúc nhập. Năm giây thêm để đặt Master Settings trước khi nhập rẻ hơn nhiều so với dựng lại cả dự án.</p></div>

<h3>Miễn phí hay Studio — bạn thật sự cần cái nào?</h3>
${slide('cr-13', 5, 'DaVinci Resolve miễn phí và Studio khác nhau ở đâu')}
<p>DaVinci Resolve miễn phí — thật sự miễn phí, không phải bản dùng thử. Trang sản phẩm chính thức của Blackmagic Design vạch ranh giới chủ yếu quanh độ phân giải, tốc độ khung hình, độ sâu màu, và một loạt công cụ chạy bằng AI:</p>
<table>
<tr><th>Khác nhau ở</th><th>Miễn phí</th><th>Studio (295 USD, mua đứt)</th></tr>
<tr><td>Độ phân giải xuất tối đa</td><td>UHD 3840×2160</td><td>Vượt 4K — DCI 4K, 6K, 8K</td></tr>
<tr><td>FPS xuất tối đa</td><td>60fps</td><td>120fps</td></tr>
<tr><td>Mã hoá 10-bit (định dạng chuyên nghiệp)</td><td>Hạn chế</td><td>Có</td></tr>
<tr><td>DaVinci Neural Engine (công cụ AI), Magic Mask, Speed Warp, Super Scale, Voice Isolation, khử nhiễu AI, dựng bằng văn bản</td><td>Không có</td><td>Có</td></tr>
<tr><td>Cộng tác nhiều người, HDR grading</td><td>Có</td><td>Có</td></tr>
</table>
<p>Với mọi thứ khoá này yêu cầu bạn làm — 1080p hay 4K tới 60fps, màu 8-bit, tự dựng cảnh quay của mình — bản miễn phí không có trần nào bạn sẽ chạm tới. <strong>Không có watermark</strong> trên các bản xuất bình thường. Chỗ duy nhất watermark xuất hiện là khi bạn xem trước hoặc xuất một hiệu ứng CHỈ CÓ ở Studio (Magic Mask, film grain, optical blur, bất kỳ công cụ Neural Engine nào) trong lúc chạy bản miễn phí — watermark đó là một tín hiệu, không phải lỗi: nó báo cho bạn biết bạn vừa chạm vào một tính năng trả phí.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cứ dùng Miễn phí bây giờ</span><span class="v">Mọi thứ khoá này dạy — dựng phim, màu cơ bản (Chương 15), mix âm (Chương 16) — chạy được trên bản miễn phí.</span></div>
  <div class="kv"><span class="k">Cân nhắc Studio sau này</span><span class="v">Nếu bạn bắt đầu quay Log 10-bit muốn chỉnh màu nghiêm túc, muốn tách nền bằng AI (Magic Mask) cho video talking-head, hoặc cần Voice Isolation để cứu một vlog quay ngoài đường ồn ào.</span></div>
</div>

<h3>Đào tạo miễn phí, viết bởi chính người dựng ra Resolve</h3>
<p>Blackmagic Design xuất bản nhiều cuốn sách đào tạo trọn vẹn dạng PDF tải miễn phí ngay trên trang của họ — mỗi cuốn hàng trăm trang, viết bởi các trainer được chứng nhận: <em>The Beginner's Guide to DaVinci Resolve</em>, <em>The Editor's Guide to DaVinci Resolve</em>, và các hướng dẫn riêng cho âm thanh Fairlight, chỉnh màu, kỹ xảo hình ảnh. Không phần nào của khoá này thay thế chúng — chương này giúp bạn chạy nhanh đúng quy trình bạn cần cho chính cảnh quay của mình; các cuốn sách kia là nơi bạn tới khi muốn đào sâu thêm một trang cụ thể.</p>

<p class="note-ct"><strong>Nối tiếp:</strong> Bài 13.2 sống trọn vẹn trên trang Edit — mọi công cụ tỉa, mọi phím tắt, và bốn cách tỉa mép clip mà phần lớn người mới không bao giờ học có chủ đích.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Mở DaVinci Resolve, tạo <strong>New Project</strong> tên "CH13-Test".</li>
<li>Vào ngay <strong>Project Settings → Master Settings</strong>, đặt <strong>Timeline Frame Rate</strong> = <strong>25</strong>. Làm việc này TRƯỚC bước 3.</li>
<li>Sang trang <strong>Media</strong>, nhập hai ba clip ngắn từ cảnh quay Pocket 3 hoặc iPhone của bạn.</li>
<li>Bấm lần lượt qua cả bảy trang ở góc dưới cửa sổ, chỉ để xem mỗi trang trông thế nào — chưa dựng gì cả.</li>
</ol><p><strong>Đạt khi:</strong> Timeline Frame Rate của dự án hiện 25fps trong Project Settings, và bạn nói được đúng thứ tự việc của cả bảy trang mà không cần nhìn lại slide.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Page (trang)</span><span class="v">Một trong bảy không gian làm việc trọn vẹn của Resolve (Media, Cut, Edit, Fusion, Color, Fairlight, Deliver), chọn từ hàng icon góc dưới cửa sổ.</span></div>
  <div class="kv"><span class="k">Project Manager</span><span class="v">Màn hình dạng lưới để mở, tạo, quản lý dự án — hiện ra khi Resolve khởi động.</span></div>
  <div class="kv"><span class="k">.drp / .dra</span><span class="v">File dự án (chỉ tham chiếu media theo đường dẫn) và file archive dự án (đóng gói cả dự án lẫn toàn bộ media vào một thư mục).</span></div>
  <div class="kv"><span class="k">Timeline Frame Rate</span><span class="v">Tốc độ khung hình mỗi giây timeline của dự án chạy — phải đặt trước khi nhập media.</span></div>
  <div class="kv"><span class="k">Watermark (thử Studio)</span><span class="v">Dấu hiện rõ trên bản xuất/xem trước của bản Miễn phí khi dùng một hiệu ứng chỉ Studio mới có.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Resolve là bảy trang, không phải một phần mềm: Media → Cut → Edit → Fusion → Color → Fairlight → Deliver. Phần lớn việc của bạn diễn ra ở Edit.</li>
<li>Đặt Timeline Frame Rate (25fps cho khoá này) trong Project Settings <strong>TRƯỚC</strong> khi thêm bất kỳ media nào — ô đó gần như khoá lại một khi cảnh quay đã có trong dự án.</li>
<li>Bản miễn phí không có trần nào cho 1080p/4K tới 60fps, màu 8-bit — mọi thứ khoá này dạy chạy được trên đó. Studio (295 USD) thêm công cụ AI, mã hoá 10-bit chuyên nghiệp, fps cao hơn, và độ phân giải vượt 4K.</li>
<li>Sách đào tạo chính thức, miễn phí (Beginner's Guide, Editor's Guide, và nhiều cuốn khác) chỉ cách một lượt tải khi bạn muốn đào sâu hơn.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve" target="_blank" rel="noopener">Blackmagic Design — trang sản phẩm DaVinci Resolve (bảng so sánh Miễn phí vs Studio)</a></div>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">Blackmagic Design — sách đào tạo miễn phí (PDF)</a></div>
</div>
`,
    },

    {
      title: '13.2 — The Edit page toolkit: shortcuts and four ways to trim|||13.2 — Bộ công cụ trang Edit: phím tắt và bốn cách tỉa clip',
      slug: 'cr-13-2-cong-cu-trang-edit',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Năm vùng của trang Edit, phím tắt cốt lõi, 3-point editing, bốn kiểu tỉa cạnh (ripple/roll/slip/slide), J-cut/L-cut, và các công cụ Text+, keyframe, retime, transitions, compound clip.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2</span>
<h2>Editing is not "dragging clips around" — it is five keyboard tools used on purpose</h2>
<p class="lead">Everything you will do on the Edit page comes down to a small set of moves: mark what you want, put it somewhere, then trim its edges until the rhythm feels right. This lesson gives you the actual keys professionals use — muscle memory here is what separates "fighting the software" from "the software disappearing while you think about the cut."</p>

<h3>Five zones, one page</h3>
${slide('cr-13', 6, 'Trang Edit — 5 vùng làm việc chính')}
<p>Media Pool and Effects Library sit on the left — your clips and every draggable tool (transitions, titles, generators). The two viewers in the middle show your <strong>source</strong> clip (left) and your <strong>timeline</strong> (right) — you mark in/out points on the source viewer, then send that selection into the timeline. Inspector on the right shows the properties of whatever is currently selected: crop, position, retime speed, audio levels. Underneath the viewers is the trim toolbar — clickable icons for the same tools the keyboard shortcuts below trigger. The timeline fills the bottom third, tracks stacked with video (V1, V2…) above audio (A1, A2…).</p>

<h3>The core keyboard shortcuts (Mac defaults)</h3>
${slide('cr-13', 7, 'Phím tắt cốt lõi trang Edit (bàn phím Mac)')}
<p>These are the <strong>default</strong> Mac shortcuts, cross-checked against several current cheat sheets and guides for DaVinci Resolve — the core editing keys (A/T/B, JKL, I/O, Ripple Delete) have stayed stable across many versions of Resolve. If your machine was ever switched to a Premiere- or FCP-style keyboard layout, or a key does not do what this lesson describes, open <strong>DaVinci Resolve → Keyboard Customization</strong> (<code>⌘⌥K</code>) to see exactly which set is active and search for the command by name.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">A — Selection Mode</span><span class="v">The default arrow tool: click, drag, move clips. Press A any time you feel "stuck" in another mode.</span></div>
  <div class="kv"><span class="k">T — Trim Edit Mode</span><span class="v">Turns your cursor into a trim tool at clip edges — this is the mode behind ripple, roll, slip and slide below.</span></div>
  <div class="kv"><span class="k">B — Blade Edit Mode</span><span class="v">Click anywhere on a clip to slice it into two clips at that point.</span></div>
  <div class="kv"><span class="k">I / O — Mark In / Mark Out</span><span class="v">On the source viewer, marks exactly which part of a clip you want to use — the foundation of 3-point editing below.</span></div>
  <div class="kv"><span class="k">J / K / L — Shuttle</span><span class="v">Play backward / pause / play forward. Tap L repeatedly to speed up playback — the fastest way to scrub through footage looking for a moment.</span></div>
</div>

<h3>3-point editing: telling Resolve exactly what goes where</h3>
<p>This is the actual professional workflow behind "adding a clip to the timeline," and it is simpler than it sounds. You give Resolve three points — two on the source, one on the timeline — and it computes the fourth for you:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Mark In (I)</span><span class="lz-d">On the source viewer, park the playhead where the useful part of the clip starts, press I.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Mark Out (O)</span><span class="lz-d">Move to where it ends, press O. You now have an exact selection, independent of the clip's full length.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Position the playhead</span><span class="lz-d">On the timeline, park the playhead where this clip should land.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">F9 (Insert) or F10 (Overwrite)</span><span class="lz-d">Insert ripples everything after the playhead later to make room; Overwrite drops the clip on top, replacing whatever was there.</span></div>
</div>
<p>F11 (<strong>Replace</strong>) swaps out a clip already on the timeline for your new source selection, matching duration automatically. F12 (<strong>Place on Top</strong>) drops the source onto whichever track sits above your current one — handy for stacking a quick B-roll cutaway without disturbing the track below. Which track actually receives the clip is controlled by <strong>track targeting</strong>: click a track's header (V1, V2, A1…) to make it the active destination — a highlighted header is where F9/F10/F11/F12 will land your clip.</p>

<h3>Ripple vs Roll — the same drag, two very different results</h3>
${slide('cr-13', 8, 'Tỉa cạnh: Ripple vs Roll')}
<p>Press <strong>T</strong> to enter Trim Edit Mode, then drag a clip's left or right edge. What happens next depends on where exactly you grab and how many clips you touch:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Ripple trim</span><span class="v">Drag one clip's edge — its neighbor's timing does not move with it, so shortening a clip leaves a gap that everything downstream <em>ripples</em> to close. Total sequence duration changes.</span></div>
  <div class="kv"><span class="k">Roll trim</span><span class="v">Drag the <em>joint</em> between two clips — one clip gets shorter exactly as much as its neighbor gets longer. The edit point moves, but the overall sequence length never changes.</span></div>
</div>
<p>Look at the two diagrams above: in the ripple example, clip B shrinks and clip C visibly shifts left, leaving empty space at the very end — the sequence got shorter. In the roll example, clip C simply starts earlier to fill exactly what clip B gave up — the end of the timeline lands on the same frame it started on. Use ripple when you are removing dead air and do not mind the whole video getting shorter (you usually do want this). Use roll when you are fine-tuning exactly where a cut happens without touching anything else's timing — for example, nudging a cut two frames earlier so it lands on a blink instead of an open eye.</p>

<h3>Slip vs Slide — the pair almost nobody learns on purpose</h3>
${slide('cr-13', 9, 'Tỉa nội dung: Slip vs Slide')}
<p>These two are less common but solve a real problem: adjusting a clip <em>without disturbing the cut points around it</em> — useful once you have already locked a section's timing to music or a voiceover.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Slip</span><span class="v">Hold the trim tool in the <em>middle</em> of a clip and drag — the clip's position and duration on the timeline stay exactly where they were; only <em>which portion of the source footage</em> plays changes. Perfect when a clip is the right length and in the right place, but you want a slightly different moment of action inside it (a better facial expression, a cleaner hand movement).</span></div>
  <div class="kv"><span class="k">Slide</span><span class="v">Drag the whole clip left or right — its own content and duration never change, but its neighbors absorb the difference (one grows, one shrinks) so the total sequence length stays fixed. Useful for nudging one B-roll shot earlier or later relative to the narration around it without re-timing anything else.</span></div>
</div>
<p>The diagrams show why these are easy to miss: on a plain timeline, a slip looks <em>identical</em> before and after — the block does not move. The only way to see it happened is the label showing a different source timecode, or noticing the picture inside the viewer changed. That is exactly the point: slip changes what is inside the box, not the box itself.</p>

<h3>J-cut and L-cut — trimming picture and sound separately</h3>
${slide('cr-13', 10, 'Tỉa lệch hình/tiếng: J-cut và L-cut')}
<p>So far every trim has moved video and audio together. Unlink them — right-click the clip and toggle <strong>Linked Selection</strong> off, or hold the trim tool on just the audio portion of a linked clip — and you can trim the audio edit point independently of the video edit point. Offsetting them on purpose is one of the simplest tricks that makes an edit feel human instead of mechanical:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">J-cut</span><span class="v">You hear the next shot before you see it — the audio cut happens earlier than the video cut. Named for the shape it draws on the timeline (the audio block juts out to the left, like the hook of a J). Great for reaction shots: a person starts laughing on the audio a beat before you cut to their face.</span></div>
  <div class="kv"><span class="k">L-cut</span><span class="v">You see the next shot while still hearing the previous one — the audio cut happens later than the video cut, drawing an L shape. The classic interview technique: cut to a reaction shot or B-roll while the interviewee keeps talking underneath.</span></div>
</div>
<p>You do not need exotic tools for this — it is the same Trim Edit Mode (T) you already know, just dragging the audio edge of a clip instead of the whole clip. Chapter 14 goes deeper into <em>when</em> to reach for each one; this lesson is about knowing the mechanic exists.</p>

<h3>The rest of the Edit-page toolkit</h3>
${slide('cr-13', 11, 'Công cụ dựng khác trong trang Edit')}
<div class="kv-grid">
  <div class="kv"><span class="k">Text+</span><span class="v">The main titling tool. Drag it from the Effects Library onto a track above your footage, then type directly in the Inspector — font, size, color, position all live there.</span></div>
  <div class="kv"><span class="k">Keyframe</span><span class="v">Click the stopwatch icon next to any Inspector property (position, zoom, opacity) to start recording that value changing over time — the foundation of any animated title or moving zoom.</span></div>
  <div class="kv"><span class="k">Retime Controls</span><span class="v">Right-click a clip → Retime Controls to slow down or speed up footage, with an option to preserve the pitch of recorded speech instead of it turning into a chipmunk.</span></div>
  <div class="kv"><span class="k">Transitions</span><span class="v">Drag one from the Effects Library onto a cut point. Use them sparingly — most professional cuts are hard cuts; a cross-dissolve should mean something (time passing), not decorate every edit.</span></div>
  <div class="kv"><span class="k">Adjustment Clip</span><span class="v">A transparent clip you place on a track above your footage — any color or effect you apply to it affects every clip underneath, all at once. Useful for a consistent look across a whole sequence without grading each clip separately.</span></div>
  <div class="kv"><span class="k">Compound Clip</span><span class="v">Select several clips, right-click → New Compound Clip, and they collapse into a single clip you can move as one unit — tidies up a busy timeline and can be reused in other projects.</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Trap — pressing regular Delete instead of Ripple Delete.</strong> Delete removes a clip and leaves a black gap exactly its size — everything after it stays put, and your video now has a silent hole in it. <strong>Shift+Delete</strong> (Ripple Delete) removes the clip <em>and</em> closes the gap, pulling everything after it earlier. If your export suddenly has a dead frozen or black section, check for a plain Delete where you meant a Ripple Delete.</p></div>

<p class="note-ct"><strong>Next:</strong> Lesson 13.3 adds a second and third camera to the mix — syncing Pocket 3 and iPhone footage by their audio waveforms, and the Cut page's speed tools for picking the right angle fast.</p>

<h3>🎬 Practice (25–30 minutes)</h3>
<div class="callout ok"><ol>
<li>In your CH13-Test project, drop 4–6 clips from your own footage onto a V1 track.</li>
<li>Use 3-point editing at least once: mark an In/Out on a source clip in the viewer, position the timeline playhead, and press F9 or F10 to place it.</li>
<li>Press T and perform one ripple trim and one roll trim — watch the difference in whether the tail of the timeline moves.</li>
<li>If you have a clip with usable dialogue, unlink audio/video and create one J-cut or one L-cut on purpose.</li>
<li>Add one Text+ title over any clip.</li>
</ol><p><strong>Done when:</strong> your timeline has at least 4 clips, one ripple trim, one roll trim, one J-cut or L-cut, and one Text+ title — and you can point to each one and name what it is.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">3-point editing</span><span class="v">Marking In/Out on a source clip and a position on the timeline; Resolve computes the fourth point automatically.</span></div>
  <div class="kv"><span class="k">Track targeting</span><span class="v">Clicking a track header to make it the active destination for Insert/Overwrite/Replace/Place on Top.</span></div>
  <div class="kv"><span class="k">Ripple trim</span><span class="v">Trimming one clip's edge; everything downstream shifts to close the resulting gap. Total duration changes.</span></div>
  <div class="kv"><span class="k">Roll trim</span><span class="v">Trimming the joint between two clips; one shrinks exactly as the other grows. Total duration stays fixed.</span></div>
  <div class="kv"><span class="k">Slip</span><span class="v">Changing which part of the source plays inside a clip, without moving or resizing the clip on the timeline.</span></div>
  <div class="kv"><span class="k">Slide</span><span class="v">Moving a clip earlier/later; its own content and length stay fixed, neighbors absorb the shift.</span></div>
  <div class="kv"><span class="k">J-cut / L-cut</span><span class="v">Audio and video cut points offset on purpose — audio leads (J) or trails (L) the picture cut.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Five core modes: A (Selection), T (Trim), B (Blade), plus I/O to mark a source selection and J/K/L to shuttle through footage.</li>
<li>3-point editing (mark In/Out on source, position the timeline playhead, press F9/F10) is how professionals place clips — not dragging by hand.</li>
<li>Ripple changes total duration; Roll does not. Slip changes content without moving the clip; Slide moves the clip without changing its content.</li>
<li>J-cuts and L-cuts offset the audio and video cut points — the single trick that makes a cut feel natural instead of mechanical.</li>
<li>Shift+Delete (Ripple Delete), not plain Delete, is how you remove a clip without leaving a silent gap.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">Blackmagic Design — The Editor's Guide to DaVinci Resolve (free PDF, full trim-tool reference)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2</span>
<h2>Dựng phim không phải "kéo clip qua kéo clip lại" — mà là năm công cụ bàn phím dùng có chủ đích</h2>
<p class="lead">Mọi thứ bạn làm trên trang Edit đều quy về một bộ động tác nhỏ: đánh dấu thứ bạn muốn, đặt nó vào đâu đó, rồi tỉa mép cho tới khi nhịp điệu đúng ý. Bài này cho bạn đúng những phím dân chuyên nghiệp dùng — phản xạ tay ở đây là thứ phân biệt "vật lộn với phần mềm" khỏi "phần mềm biến mất trong lúc bạn chỉ còn nghĩ về cú cắt".</p>

<h3>Năm vùng, một trang</h3>
${slide('cr-13', 6, 'Trang Edit — 5 vùng làm việc chính')}
<p>Media Pool và Effects Library nằm bên trái — clip của bạn và mọi công cụ kéo-thả được (chuyển cảnh, tiêu đề, generator). Hai viewer ở giữa hiện clip <strong>nguồn</strong> (trái) và <strong>timeline</strong> (phải) — bạn đánh dấu điểm in/out trên viewer nguồn, rồi gửi phần đã chọn đó vào timeline. Inspector bên phải hiện thông số của thứ đang được chọn: crop, vị trí, tốc độ retime, mức âm. Bên dưới hai viewer là thanh công cụ tỉa — các icon bấm được cho đúng những công cụ mà phím tắt dưới đây kích hoạt. Timeline chiếm một phần ba phía dưới, các track xếp chồng, video (V1, V2…) ở trên, âm thanh (A1, A2…) ở dưới.</p>

<h3>Phím tắt cốt lõi (mặc định trên Mac)</h3>
${slide('cr-13', 7, 'Phím tắt cốt lõi trang Edit (bàn phím Mac)')}
<p>Đây là bộ phím <strong>mặc định</strong> trên Mac, đối chiếu qua nhiều cheat sheet và hướng dẫn hiện hành cho DaVinci Resolve — các phím dựng cốt lõi (A/T/B, JKL, I/O, Ripple Delete) đã ổn định qua rất nhiều phiên bản Resolve. Nếu máy bạn từng đổi sang bộ phím kiểu Premiere hay FCP, hoặc một phím không làm đúng như bài mô tả, mở <strong>DaVinci Resolve → Keyboard Customization</strong> (<code>⌘⌥K</code>) để xem đúng bộ đang bật và tìm lệnh theo tên.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">A — Selection Mode</span><span class="v">Công cụ mũi tên mặc định: bấm, kéo, di chuyển clip. Bấm A bất cứ lúc nào thấy "kẹt" trong chế độ khác.</span></div>
  <div class="kv"><span class="k">T — Trim Edit Mode</span><span class="v">Biến con trỏ thành công cụ tỉa ở mép clip — đây là chế độ đứng sau ripple, roll, slip và slide bên dưới.</span></div>
  <div class="kv"><span class="k">B — Blade Edit Mode</span><span class="v">Bấm vào bất kỳ đâu trên clip để cắt nó thành hai clip tại đúng điểm đó.</span></div>
  <div class="kv"><span class="k">I / O — Đánh dấu In / Out</span><span class="v">Trên viewer nguồn, đánh dấu chính xác phần clip bạn muốn dùng — nền tảng của 3-point editing bên dưới.</span></div>
  <div class="kv"><span class="k">J / K / L — Tua</span><span class="v">Tua lùi / dừng / tua tới. Bấm L nhiều lần để tăng tốc phát — cách nhanh nhất để lướt qua cảnh quay tìm đúng khoảnh khắc.</span></div>
</div>

<h3>3-point editing: nói cho Resolve biết chính xác cái gì vào đâu</h3>
<p>Đây là quy trình thật sự dân chuyên nghiệp dùng để "đưa một clip vào timeline", và nó đơn giản hơn tên gọi. Bạn cho Resolve ba điểm — hai ở nguồn, một trên timeline — và nó tự tính điểm thứ tư:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Mark In (I)</span><span class="lz-d">Trên viewer nguồn, đặt playhead ở chỗ phần hữu ích của clip bắt đầu, bấm I.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Mark Out (O)</span><span class="lz-d">Di tới chỗ nó kết thúc, bấm O. Giờ bạn có một vùng chọn chính xác, độc lập với độ dài trọn vẹn của clip.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Đặt playhead</span><span class="lz-d">Trên timeline, đặt playhead ở chỗ clip này cần nằm.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">F9 (Insert) hoặc F10 (Overwrite)</span><span class="lz-d">Insert đẩy mọi thứ sau playhead dịch muộn hơn để nhường chỗ; Overwrite đặt đè clip lên trên, thay thế bất cứ gì đang ở đó.</span></div>
</div>
<p>F11 (<strong>Replace</strong>) thay một clip đã có trên timeline bằng vùng chọn nguồn mới, tự khớp thời lượng. F12 (<strong>Place on Top</strong>) thả clip nguồn lên track nằm TRÊN track hiện tại — tiện để chèn nhanh một cảnh B-roll cutaway mà không động tới track bên dưới. Track nào thật sự nhận clip do <strong>track targeting</strong> quyết định: bấm vào phần đầu một track (V1, V2, A1…) để biến nó thành đích đang hoạt động — track có đầu được tô sáng là nơi F9/F10/F11/F12 sẽ đặt clip vào.</p>

<h3>Ripple vs Roll — cùng một cú kéo, hai kết quả rất khác nhau</h3>
${slide('cr-13', 8, 'Tỉa cạnh: Ripple vs Roll')}
<p>Bấm <strong>T</strong> để vào Trim Edit Mode, rồi kéo mép trái hoặc phải của một clip. Điều gì xảy ra tiếp theo phụ thuộc vào bạn nắm chính xác chỗ nào và động tới bao nhiêu clip:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Ripple trim</span><span class="v">Kéo mép của MỘT clip — thời gian của clip bên cạnh không đi theo, nên làm ngắn một clip để lại một khoảng trống mà mọi thứ phía sau <em>dịch (ripple)</em> theo để khép lại. Tổng thời lượng chuỗi cảnh thay đổi.</span></div>
  <div class="kv"><span class="k">Roll trim</span><span class="v">Kéo <em>điểm nối</em> giữa hai clip — một clip ngắn lại đúng bằng lượng clip bên cạnh dài thêm. Điểm cắt di chuyển, nhưng tổng độ dài chuỗi cảnh không bao giờ đổi.</span></div>
</div>
<p>Nhìn hai sơ đồ ở trên: trong ví dụ ripple, clip B co lại và clip C rõ ràng dịch sang trái, để lại khoảng trống ngay tại điểm cuối cùng — chuỗi cảnh ngắn đi. Trong ví dụ roll, clip C chỉ đơn giản bắt đầu sớm hơn để lấp đúng phần B vừa nhường — điểm cuối timeline rơi đúng vào khung hình nó từng ở đó. Dùng ripple khi bạn đang bỏ khoảng chết và không ngại cả video ngắn đi (thường bạn MUỐN vậy). Dùng roll khi bạn đang tinh chỉnh chính xác chỗ một cú cắt xảy ra mà không động tới thời gian của bất cứ gì khác — ví dụ nhích một cú cắt sớm hơn hai khung để nó rơi đúng lúc chớp mắt thay vì mắt đang mở.</p>

<h3>Slip vs Slide — cặp đôi gần như không ai học có chủ đích</h3>
${slide('cr-13', 9, 'Tỉa nội dung: Slip vs Slide')}
<p>Hai cái này ít gặp hơn nhưng giải quyết một vấn đề thật: chỉnh một clip <em>mà không động tới các điểm cắt xung quanh nó</em> — hữu ích khi bạn đã khoá thời gian của một đoạn theo nhạc hoặc lời voiceover.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Slip</span><span class="v">Giữ công cụ tỉa ở <em>giữa</em> một clip rồi kéo — vị trí và độ dài của clip trên timeline giữ nguyên y hệt; chỉ <em>phần nào của cảnh quay nguồn</em> đang phát là đổi. Hoàn hảo khi một clip đã đúng độ dài, đúng vị trí, nhưng bạn muốn một khoảnh khắc hành động hơi khác bên trong nó (một biểu cảm mặt đẹp hơn, một cử động tay sạch hơn).</span></div>
  <div class="kv"><span class="k">Slide</span><span class="v">Kéo cả clip sang trái hoặc phải — nội dung và độ dài của chính nó không đổi, nhưng các clip bên cạnh hấp thụ phần chênh lệch (một dài ra, một ngắn lại) nên tổng độ dài chuỗi cảnh không đổi. Hữu ích để nhích một cảnh B-roll sớm hơn hoặc muộn hơn so với lời dẫn xung quanh mà không phải canh lại thời gian của bất cứ gì khác.</span></div>
</div>
<p>Hai sơ đồ cho thấy vì sao hai kiểu này dễ bị bỏ sót: trên một timeline trần, slip trông <em>giống hệt nhau</em> trước và sau — khối đó không di chuyển. Cách duy nhất để thấy nó vừa xảy ra là nhãn hiện mã thời gian nguồn khác đi, hoặc để ý hình trong viewer đã đổi. Đó chính xác là điểm mấu chốt: slip đổi thứ BÊN TRONG cái hộp, không đổi cái hộp.</p>

<h3>J-cut và L-cut — tỉa hình và tiếng tách rời nhau</h3>
${slide('cr-13', 10, 'Tỉa lệch hình/tiếng: J-cut và L-cut')}
<p>Từ đầu tới giờ mọi cú tỉa đều di chuyển hình và tiếng cùng lúc. Bỏ liên kết chúng — chuột phải vào clip rồi tắt <strong>Linked Selection</strong>, hoặc giữ công cụ tỉa đúng trên phần âm thanh của một clip đã liên kết — bạn sẽ tỉa được điểm cắt âm thanh độc lập với điểm cắt hình. Cố ý lệch hai điểm đó là một trong những mẹo đơn giản nhất làm một cú dựng cảm giác như con người, không như máy móc:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">J-cut</span><span class="v">Bạn NGHE cảnh sau trước khi THẤY nó — điểm cắt âm thanh xảy ra sớm hơn điểm cắt hình. Đặt tên theo hình dạng nó vẽ trên timeline (khối âm thanh nhô sang trái, như cái móc chữ J). Rất hợp cho cảnh phản ứng: một người bắt đầu cười trong âm thanh trước một nhịp rồi mới cắt sang mặt họ.</span></div>
  <div class="kv"><span class="k">L-cut</span><span class="v">Bạn THẤY cảnh sau mà vẫn còn NGHE cảnh trước — điểm cắt âm thanh xảy ra muộn hơn điểm cắt hình, vẽ thành hình chữ L. Kỹ thuật phỏng vấn kinh điển: cắt sang cảnh phản ứng hoặc B-roll trong khi người được phỏng vấn vẫn đang nói ở dưới.</span></div>
</div>
<p>Bạn không cần công cụ gì lạ cho việc này — vẫn là Trim Edit Mode (T) bạn đã biết, chỉ là kéo mép âm thanh của clip thay vì kéo cả clip. Chương 14 sẽ đi sâu vào <em>khi nào</em> nên dùng cái nào; bài này chỉ cần bạn biết cơ chế này tồn tại.</p>

<h3>Phần còn lại của bộ công cụ trang Edit</h3>
${slide('cr-13', 11, 'Công cụ dựng khác trong trang Edit')}
<div class="kv-grid">
  <div class="kv"><span class="k">Text+</span><span class="v">Công cụ chữ chính. Kéo nó từ Effects Library lên một track phía trên cảnh quay, rồi gõ trực tiếp trong Inspector — font, cỡ, màu, vị trí đều sống ở đó.</span></div>
  <div class="kv"><span class="k">Keyframe</span><span class="v">Bấm icon đồng hồ bấm giờ cạnh bất kỳ thông số nào trong Inspector (vị trí, zoom, độ mờ) để bắt đầu ghi lại giá trị đó đổi theo thời gian — nền tảng của mọi tiêu đề hoạt hình hay hiệu ứng zoom di chuyển.</span></div>
  <div class="kv"><span class="k">Retime Controls</span><span class="v">Chuột phải một clip → Retime Controls để làm chậm hoặc tăng tốc cảnh quay, có tuỳ chọn giữ nguyên cao độ giọng nói thay vì biến nó thành tiếng "sóc chuột".</span></div>
  <div class="kv"><span class="k">Transitions</span><span class="v">Kéo một cái từ Effects Library đè lên điểm cắt. Dùng tiết chế — phần lớn cú cắt chuyên nghiệp là hard cut; một cross-dissolve nên MANG NGHĨA (thời gian trôi qua), không phải trang trí cho mọi điểm cắt.</span></div>
  <div class="kv"><span class="k">Adjustment Clip</span><span class="v">Một clip trong suốt bạn đặt lên track phía trên cảnh quay — bất kỳ màu hay hiệu ứng nào áp lên nó ảnh hưởng tới MỌI clip bên dưới, cùng lúc. Hữu ích để có một "look" nhất quán cho cả chuỗi cảnh mà không phải chỉnh màu từng clip riêng lẻ.</span></div>
  <div class="kv"><span class="k">Compound Clip</span><span class="v">Chọn nhiều clip, chuột phải → New Compound Clip, chúng gộp lại thành một clip duy nhất bạn di chuyển như một khối — dọn gọn một timeline rối, và dùng lại được ở dự án khác.</span></div>
</div>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — bấm Delete thường thay vì Ripple Delete.</strong> Delete xoá một clip và để lại khoảng trống đen đúng bằng kích thước nó — mọi thứ sau vẫn đứng yên, và video của bạn giờ có một lỗ câm ở giữa. <strong>Shift+Delete</strong> (Ripple Delete) xoá clip <em>và</em> khép khoảng trống lại, kéo mọi thứ sau sớm hơn. Nếu bản xuất bỗng có một đoạn đứng hình hoặc đen bất thường, kiểm xem có chỗ nào bạn bấm Delete thường trong khi định Ripple Delete.</p></div>

<p class="note-ct"><strong>Nối tiếp:</strong> Bài 13.3 thêm máy thứ hai, thứ ba vào cuộc — đồng bộ cảnh quay Pocket 3 và iPhone theo dạng sóng âm, và các công cụ tốc độ của trang Cut để chọn đúng góc máy thật nhanh.</p>

<h3>🎬 Thực hành (25–30 phút)</h3>
<div class="callout ok"><ol>
<li>Trong project CH13-Test, thả 4–6 clip từ chính cảnh quay của bạn lên track V1.</li>
<li>Dùng 3-point editing ít nhất một lần: đánh dấu In/Out trên một clip nguồn ở viewer, đặt playhead trên timeline, rồi bấm F9 hoặc F10 để đặt nó vào.</li>
<li>Bấm T rồi thực hiện một lần ripple trim và một lần roll trim — quan sát khác biệt ở việc đuôi timeline có di chuyển hay không.</li>
<li>Nếu có một clip có lời thoại dùng được, bỏ liên kết hình/tiếng rồi cố ý tạo một J-cut hoặc một L-cut.</li>
<li>Thêm một tiêu đề Text+ đè lên bất kỳ clip nào.</li>
</ol><p><strong>Đạt khi:</strong> timeline có ít nhất 4 clip, một lần ripple trim, một lần roll trim, một J-cut hoặc L-cut, và một tiêu đề Text+ — và bạn chỉ được từng cái, gọi đúng tên nó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">3-point editing</span><span class="v">Đánh dấu In/Out trên clip nguồn và một vị trí trên timeline; Resolve tự tính điểm thứ tư.</span></div>
  <div class="kv"><span class="k">Track targeting</span><span class="v">Bấm vào đầu một track để biến nó thành đích đang hoạt động cho Insert/Overwrite/Replace/Place on Top.</span></div>
  <div class="kv"><span class="k">Ripple trim</span><span class="v">Tỉa mép một clip; mọi thứ phía sau dịch theo để khép khoảng trống. Tổng thời lượng thay đổi.</span></div>
  <div class="kv"><span class="k">Roll trim</span><span class="v">Tỉa điểm nối giữa hai clip; một ngắn lại đúng bằng lượng kia dài ra. Tổng thời lượng giữ nguyên.</span></div>
  <div class="kv"><span class="k">Slip</span><span class="v">Đổi phần nào của nguồn đang phát bên trong một clip, không di chuyển hay đổi kích thước clip trên timeline.</span></div>
  <div class="kv"><span class="k">Slide</span><span class="v">Di chuyển một clip sớm hơn/muộn hơn; nội dung và độ dài của chính nó giữ nguyên, các clip bên cạnh hấp thụ phần dịch chuyển.</span></div>
  <div class="kv"><span class="k">J-cut / L-cut</span><span class="v">Điểm cắt âm thanh và hình lệch nhau có chủ đích — tiếng đi trước (J) hoặc ở lại sau (L) so với điểm cắt hình.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Năm chế độ cốt lõi: A (Selection), T (Trim), B (Blade), cộng I/O để đánh dấu vùng chọn nguồn và J/K/L để tua qua cảnh quay.</li>
<li>3-point editing (đánh dấu In/Out trên nguồn, đặt playhead trên timeline, bấm F9/F10) là cách dân chuyên nghiệp đặt clip vào — không phải kéo bằng tay.</li>
<li>Ripple đổi tổng thời lượng; Roll thì không. Slip đổi nội dung mà không di chuyển clip; Slide di chuyển clip mà không đổi nội dung.</li>
<li>J-cut và L-cut lệch điểm cắt âm thanh và hình — đúng một mẹo làm một cú dựng cảm giác tự nhiên thay vì máy móc.</li>
<li>Shift+Delete (Ripple Delete), không phải Delete thường, là cách xoá một clip mà không để lại khoảng trống câm.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">Blackmagic Design — The Editor's Guide to DaVinci Resolve (PDF miễn phí, tra cứu đầy đủ công cụ tỉa)</a></div>
</div>
`,
    },

    {
      title: '13.3 — Multi-camera: Auto Sync Audio, multicam clips, and Cut page speed|||13.3 — Đa máy: Auto Sync Audio, multicam clip, và tốc độ trang Cut',
      slug: 'cr-13-3-da-may-dong-bo',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Đồng bộ Pocket 3 và iPhone bằng Auto Sync Audio theo sóng âm, gộp thành Multicam Clip để đổi góc bằng phím số, và ba công cụ tốc độ của trang Cut: Source Tape, Sync Bin, Smart Insert.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.3</span>
<h2>Two cameras rolling at once means two files that do not start at the same moment — fix that once, automatically</h2>
<p class="lead">Point the Pocket 3 at yourself and the iPhone at a wider angle, and you get two independent files that were started by two separate button presses a second or two apart. Lining them up by eye, frame by frame, is exactly the kind of tedious work software should do for you. This lesson is that: sync once, then treat two cameras as one multi-angle clip you switch between with a single key.</p>

<h3>Why syncing by hand is a losing game</h3>
<p>Neither the Pocket 3 nor the iPhone writes a shared, professional timecode the way expensive cinema cameras jam together before a shoot — so you cannot rely on matching timecodes between the two files. What both cameras <em>do</em> reliably capture is sound, and sound gives Resolve something precise to line up: a spike in the waveform (like a hand clap) happens at the exact same instant in both recordings, even if the files themselves started at different times.</p>

<h3>Auto Sync Audio: let Resolve read the waveform</h3>
${slide('cr-13', 12, 'Đồng bộ đa máy: Auto Sync Audio theo sóng âm')}
<p>The workflow, step by step:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Clap once</span><span class="lz-d">At the start of every take, clap your hands once, clearly, in view of and in range of both cameras' microphones — your shared audio landmark.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Ingest into one bin</span><span class="lz-d">Copy both cards over (Chapter 11's structure) and import both clips into the same Media Pool bin.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Select both clips</span><span class="lz-d">Click the Pocket 3 clip, Cmd-click the matching iPhone clip.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Right-click → Auto Sync Audio</span><span class="lz-d">Choose <strong>Based on Waveform</strong> — Resolve compares the two audio tracks and finds the clap automatically.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Synced</span><span class="lz-d">Resolve writes new, aligned audio for each clip so both play back frame-accurate to each other from that point on.</span></div>
</div>
<p>The other option in that same menu, <strong>Based on Timecode</strong>, only works if both cameras were "jammed" to share the exact same running timecode before recording — a feature aimed at professional cinema camera rigs. Neither the Pocket 3 nor the iPhone supports that, so for your setup, the clap-and-waveform method above is the reliable path, every time.</p>
<div class="callout warn"><p><strong>What waveform sync actually needs:</strong> usable audio on both clips around the clap. If the Pocket 3's built-in mic caught wind noise loud enough to bury the clap, or you clapped out of both cameras' earshot, Resolve has nothing to match. When in doubt, clap closer to both cameras and louder than you think necessary — you can always trim the extra silence afterward.</p></div>

<h3>Turning two synced clips into one Multicam Clip</h3>
<p>With both clips still selected, right-click again → <strong>Create New Multicam Clip Using Selected Clips</strong>. A dialog lets you pick the sync method again (timecode, audio waveform, or in/out points) and how to name each angle — <strong>Clip Name</strong> is the simplest choice if your files are already named something recognizable ("Pocket3_take1", "iPhone_take1"). The result is a single clip in your Media Pool that contains both angles, permanently synced.</p>
<p>Drop that multicam clip onto your timeline like any other clip, and open the multicam viewer (right-click the clip on the timeline → toggle multicam view) to see both angles side by side while it plays. Tap <strong>1</strong> or <strong>2</strong> on your keyboard during playback to cut live to that angle — Resolve records the cut as you go, the same way a live TV switcher works. You end up with a rough cut that already alternates between your two cameras, ready for the fine trims from Lesson 13.2.</p>

<h3>The Cut page's three speed tools</h3>
${slide('cr-13', 13, 'Multicam Clip và bộ công cụ dựng nhanh của trang Cut')}
<p>The Cut page (the second icon at the bottom of the window) trades some of Edit's depth for raw speed — useful when you just want a rough assembly down fast, before switching to Edit for the fine work from Lesson 13.2.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Source Tape</span><span class="v">Click the Source Tape icon above the viewer and every clip in the current bin plays back-to-back as if it were one long tape — scrub through all of it with J/K/L instead of opening clips one at a time. The fastest way to "read" a folder of footage you have not looked at yet.</span></div>
  <div class="kv"><span class="k">Sync Bin</span><span class="v">Shows every clip that lines up with wherever your timeline playhead currently sits — built for multicam and multi-take shoots, so you can find the best matching cutaway for a given moment in seconds instead of scrubbing through a whole bin by hand.</span></div>
  <div class="kv"><span class="k">Smart Insert</span><span class="v">Places your selected clip at the nearest edit point to the playhead and pushes everything after it later — you do not need to switch tools or set an exact In point on the timeline first; Resolve finds the sensible spot for you.</span></div>
</div>
<p>None of these tools are exclusive to the Cut page in spirit — they exist because Cut is built around never breaking your flow to hunt for a menu. You will likely do your real editing on the Edit page (Lesson 13.2's tools give you far more control), but knowing Cut's shortcuts is worth it the day you need a rough cut in ten minutes, not an hour.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — syncing clips that are not in the same bin, or naming them so alike Resolve cannot tell them apart.</strong> Auto Sync Audio and multicam creation both work on your current selection, wherever it lives — but organizing your Pocket 3 and iPhone takes into one bin per scene (Chapter 11's folder discipline, mirrored inside Resolve's Media Pool) makes it far harder to accidentally sync the wrong pair of clips from a busy shoot day.</p></div>

<p class="note-ct"><strong>Next:</strong> Lesson 13.4 takes Resolve off your Mac — what actually works when you open the same kind of project on your iPad Pro, and the codec trap waiting on the Linux machine at home.</p>

<h3>🎬 Practice (20–25 minutes)</h3>
<div class="callout ok"><ol>
<li>Set up the Pocket 3 and iPhone side by side, both recording, both aimed roughly at you.</li>
<li>Clap once, clearly, then talk for 15–20 seconds, then stop both cameras.</li>
<li>Import both clips into the same Media Pool bin in your CH13-Test project.</li>
<li>Select both, right-click → <strong>Auto Sync Audio → Based on Waveform</strong>.</li>
<li>Select both again, right-click → <strong>Create New Multicam Clip Using Selected Clips</strong>, using Clip Name for angle naming.</li>
<li>Drop the multicam clip on the timeline, open the multicam viewer, and play it back — press 1 and 2 while it plays to cut between angles.</li>
</ol><p><strong>Done when:</strong> you have one Multicam Clip in your Media Pool built from your own two-camera take, and a short section of timeline where you cut live between angles using the number keys.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Auto Sync Audio</span><span class="v">Right-click command that aligns two or more clips by timecode or by matching their audio waveforms.</span></div>
  <div class="kv"><span class="k">Multicam Clip</span><span class="v">A single Resolve clip bundling several synced camera angles, switchable during playback.</span></div>
  <div class="kv"><span class="k">Source Tape</span><span class="v">Cut-page mode that plays every clip in a bin back-to-back as one continuous tape.</span></div>
  <div class="kv"><span class="k">Sync Bin</span><span class="v">Shows clips that align with the current timeline playhead position — fast cutaway selection.</span></div>
  <div class="kv"><span class="k">Smart Insert</span><span class="v">Places a clip at the nearest edit point to the playhead automatically.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Neither the Pocket 3 nor the iPhone shares professional timecode — sync multi-camera footage with <strong>Auto Sync Audio → Based on Waveform</strong>, using a hand clap as your shared audio landmark.</li>
<li><strong>Create New Multicam Clip Using Selected Clips</strong> turns synced footage into one clip you switch angles on with the 1/2 number keys during playback.</li>
<li>The Cut page's Source Tape, Sync Bin, and Smart Insert trade editing depth for raw speed — good for a fast rough assembly before moving to the Edit page.</li>
<li>Keep same-scene takes from both cameras in one Media Pool bin so you never accidentally sync the wrong pair.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">Blackmagic Design — free training guides (Cut page and multicam workflow reference)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.3</span>
<h2>Hai máy cùng quay nghĩa là hai file KHÔNG bắt đầu cùng một khoảnh khắc — sửa việc đó một lần, tự động</h2>
<p class="lead">Chĩa Pocket 3 vào chính mình và iPhone vào một góc rộng hơn, bạn có hai file độc lập được bắt đầu bởi hai lần bấm nút cách nhau một hai giây. Canh chúng khớp nhau bằng mắt, từng khung một, đúng là loại việc nhàm chán phần mềm nên làm thay bạn. Bài này chính là việc đó: đồng bộ một lần, rồi coi hai máy như một clip nhiều góc mà bạn chuyển qua lại chỉ bằng một phím.</p>

<h3>Vì sao đồng bộ bằng tay là một cuộc chơi thua trước</h3>
<p>Cả Pocket 3 lẫn iPhone đều không ghi một mã thời gian (timecode) chuyên nghiệp dùng chung kiểu các máy quay điện ảnh đắt tiền "jam" (đồng bộ) với nhau trước buổi quay — nên bạn không thể dựa vào việc khớp timecode giữa hai file. Thứ cả hai máy CHẮC CHẮN ghi lại đáng tin cậy là âm thanh, và âm thanh cho Resolve một thứ chính xác để canh: một đỉnh nhọn trên dạng sóng (như tiếng vỗ tay) xảy ra đúng cùng một khoảnh khắc trong cả hai bản ghi, dù chính hai file bắt đầu ở thời điểm khác nhau.</p>

<h3>Auto Sync Audio: để Resolve đọc dạng sóng</h3>
${slide('cr-13', 12, 'Đồng bộ đa máy: Auto Sync Audio theo sóng âm')}
<p>Quy trình, từng bước:</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Vỗ tay một cái</span><span class="lz-d">Đầu mỗi lần quay, vỗ tay một cái thật rõ, trong tầm nhìn và tầm micro của CẢ HAI máy — mốc âm thanh chung của bạn.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đổ vào một bin</span><span class="lz-d">Chép cả hai thẻ về (theo cấu trúc Chương 11) và nhập cả hai clip vào CÙNG một bin trong Media Pool.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chọn cả hai clip</span><span class="lz-d">Bấm clip Pocket 3, giữ ⌘ bấm thêm clip iPhone tương ứng.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Chuột phải → Auto Sync Audio</span><span class="lz-d">Chọn <strong>Based on Waveform</strong> — Resolve so hai track âm thanh và tự tìm ra tiếng vỗ tay.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Đã đồng bộ</span><span class="lz-d">Resolve ghi ra âm thanh mới, đã canh khớp cho từng clip để cả hai phát chính xác từng khung hình với nhau từ điểm đó trở đi.</span></div>
</div>
<p>Lựa chọn còn lại trong cùng menu đó, <strong>Based on Timecode</strong>, chỉ chạy được nếu cả hai máy đã được "jam" để cùng chạy chung một mã thời gian trước khi quay — tính năng nhắm tới dàn máy quay điện ảnh chuyên nghiệp. Cả Pocket 3 lẫn iPhone đều không hỗ trợ việc đó, nên với bộ máy của bạn, cách vỗ tay + đồng bộ theo sóng âm ở trên là con đường đáng tin cậy, mọi lần.</p>
<div class="callout warn"><p><strong>Đồng bộ theo sóng âm thật sự cần gì:</strong> âm thanh dùng được trên cả hai clip quanh tiếng vỗ tay. Nếu micro tích hợp của Pocket 3 bắt tiếng gió to tới mức chôn vùi tiếng vỗ tay, hoặc bạn vỗ tay ngoài tầm nghe của một trong hai máy, Resolve không có gì để so khớp. Khi nghi ngờ, vỗ tay gần cả hai máy hơn và to hơn mức bạn nghĩ là cần — phần im lặng thừa sau đó lúc nào cũng cắt bỏ được.</p></div>

<h3>Biến hai clip đã đồng bộ thành một Multicam Clip</h3>
<p>Với cả hai clip vẫn đang được chọn, chuột phải lần nữa → <strong>Create New Multicam Clip Using Selected Clips</strong>. Một hộp thoại cho bạn chọn lại cách đồng bộ (timecode, sóng âm, hoặc điểm in/out) và cách đặt tên từng góc — <strong>Clip Name</strong> là lựa chọn đơn giản nhất nếu file của bạn đã có tên dễ nhận ("Pocket3_take1", "iPhone_take1"). Kết quả là MỘT clip duy nhất trong Media Pool chứa cả hai góc, đã đồng bộ vĩnh viễn.</p>
<p>Thả clip multicam đó lên timeline như bất kỳ clip nào khác, rồi mở viewer multicam (chuột phải vào clip trên timeline → bật chế độ xem multicam) để thấy cả hai góc cạnh nhau trong lúc phát. Bấm <strong>1</strong> hoặc <strong>2</strong> trên bàn phím khi đang phát để cắt trực tiếp sang góc đó — Resolve ghi lại cú cắt ngay lúc bạn làm, giống hệt cách một bàn chuyển cảnh trực tiếp trên truyền hình hoạt động. Bạn kết thúc với một bản dựng thô đã luân phiên giữa hai máy sẵn, chỉ còn chờ những cú tỉa tinh từ Bài 13.2.</p>

<h3>Ba công cụ tốc độ của trang Cut</h3>
${slide('cr-13', 13, 'Multicam Clip và bộ công cụ dựng nhanh của trang Cut')}
<p>Trang Cut (icon thứ hai từ trái ở góc dưới cửa sổ) đánh đổi bớt chiều sâu của Edit để lấy tốc độ thuần tuý — hữu ích khi bạn chỉ muốn có ngay một bản dựng thô thật nhanh, trước khi chuyển sang Edit làm tinh theo Bài 13.2.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Source Tape</span><span class="v">Bấm icon Source Tape phía trên viewer, mọi clip trong bin hiện tại phát nối liền nhau như một cuộn băng dài — tua qua hết bằng J/K/L thay vì mở từng clip một. Cách nhanh nhất để "đọc" một thư mục cảnh quay bạn chưa xem qua.</span></div>
  <div class="kv"><span class="k">Sync Bin</span><span class="v">Hiện mọi clip khớp với đúng vị trí playhead trên timeline hiện tại — sinh ra cho quay đa máy và nhiều take, nên bạn tìm được cảnh cutaway khớp nhất cho một khoảnh khắc trong vài giây thay vì tua cả một bin bằng tay.</span></div>
  <div class="kv"><span class="k">Smart Insert</span><span class="v">Đặt clip đang chọn vào điểm ghép gần playhead nhất và đẩy mọi thứ sau nó muộn hơn — bạn không cần đổi công cụ hay đặt điểm In chính xác trên timeline trước; Resolve tự tìm chỗ hợp lý cho bạn.</span></div>
</div>
<p>Không công cụ nào trong số này chỉ có ở trang Cut theo đúng tinh thần — chúng tồn tại vì Cut được dựng để không bao giờ làm gãy mạch làm việc của bạn chỉ để đi tìm một menu. Bạn có lẽ vẫn sẽ dựng thật ở trang Edit (công cụ của Bài 13.2 cho bạn nhiều quyền kiểm soát hơn hẳn), nhưng biết các phím tắt của Cut đáng giá vào ngày bạn cần một bản dựng thô trong mười phút, không phải một tiếng.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — đồng bộ những clip không nằm trong cùng một bin, hoặc đặt tên giống nhau tới mức Resolve không phân biệt được.</strong> Auto Sync Audio và tạo multicam đều chạy trên vùng chọn hiện tại, ở bất cứ đâu chúng đang nằm — nhưng gom take Pocket 3 và iPhone vào một bin cho mỗi cảnh (theo kỷ luật thư mục của Chương 11, phản chiếu vào trong Media Pool của Resolve) giúp bạn khó vô tình đồng bộ nhầm cặp clip hơn nhiều trong một ngày quay bận rộn.</p></div>

<p class="note-ct"><strong>Nối tiếp:</strong> Bài 13.4 đưa Resolve ra khỏi Mac của bạn — thứ gì thật sự chạy được khi bạn mở đúng kiểu dự án đó trên iPad Pro, và cái bẫy codec đang chờ trên máy Linux ở nhà.</p>

<h3>🎬 Thực hành (20–25 phút)</h3>
<div class="callout ok"><ol>
<li>Đặt Pocket 3 và iPhone cạnh nhau, cả hai đang quay, cả hai chĩa vào bạn.</li>
<li>Vỗ tay một cái thật rõ, rồi nói chuyện 15–20 giây, rồi dừng cả hai máy.</li>
<li>Nhập cả hai clip vào cùng một bin Media Pool trong project CH13-Test.</li>
<li>Chọn cả hai, chuột phải → <strong>Auto Sync Audio → Based on Waveform</strong>.</li>
<li>Chọn lại cả hai, chuột phải → <strong>Create New Multicam Clip Using Selected Clips</strong>, dùng Clip Name để đặt tên góc.</li>
<li>Thả clip multicam lên timeline, mở viewer multicam, và phát thử — bấm 1 và 2 trong lúc phát để cắt qua lại giữa hai góc.</li>
</ol><p><strong>Đạt khi:</strong> bạn có một Multicam Clip trong Media Pool dựng từ chính take hai máy của bạn, và một đoạn timeline ngắn nơi bạn đã cắt trực tiếp giữa hai góc bằng phím số.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Auto Sync Audio</span><span class="v">Lệnh chuột phải canh khớp hai hoặc nhiều clip theo timecode hoặc theo so khớp dạng sóng âm.</span></div>
  <div class="kv"><span class="k">Multicam Clip</span><span class="v">Một clip Resolve duy nhất gói nhiều góc máy đã đồng bộ, chuyển được qua lại lúc phát.</span></div>
  <div class="kv"><span class="k">Source Tape</span><span class="v">Chế độ của trang Cut phát mọi clip trong một bin nối liền nhau như một cuộn băng.</span></div>
  <div class="kv"><span class="k">Sync Bin</span><span class="v">Hiện các clip khớp với đúng vị trí playhead hiện tại trên timeline — chọn cutaway nhanh.</span></div>
  <div class="kv"><span class="k">Smart Insert</span><span class="v">Tự đặt một clip vào điểm ghép gần playhead nhất.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cả Pocket 3 lẫn iPhone đều không chia sẻ timecode chuyên nghiệp — đồng bộ cảnh quay đa máy bằng <strong>Auto Sync Audio → Based on Waveform</strong>, dùng tiếng vỗ tay làm mốc âm thanh chung.</li>
<li><strong>Create New Multicam Clip Using Selected Clips</strong> biến cảnh quay đã đồng bộ thành một clip bạn đổi góc bằng phím số 1/2 trong lúc phát.</li>
<li>Source Tape, Sync Bin, Smart Insert của trang Cut đánh đổi chiều sâu để lấy tốc độ thuần — tốt cho một bản dựng thô nhanh trước khi sang trang Edit.</li>
<li>Gom các take cùng cảnh từ cả hai máy vào một bin Media Pool để không bao giờ vô tình đồng bộ nhầm cặp.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/training" target="_blank" rel="noopener">Blackmagic Design — sách đào tạo miễn phí (tra cứu trang Cut và quy trình multicam)</a></div>
</div>
`,
    },

    {
      title: '13.4 — Resolve on iPad and Linux, and your 10-step workflow|||13.4 — Resolve trên iPad và Linux, và quy trình 10 bước của bạn',
      slug: 'cr-13-4-resolve-ipad-linux',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'DaVinci Resolve for iPad — trang nào có thật, trang nào chưa; chuyển dự án qua Blackmagic Cloud; giới hạn codec của bản miễn phí trên Linux; và quy trình 10 bước gói cả chương thành một video YouTube.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.4</span>
<h2>The same project, three machines — and each one keeps a different promise</h2>
<p class="lead">Your Mac M1 Max is the full studio. Your iPad Pro M5 and your Linux box at home can both run DaVinci Resolve too — but "runs DaVinci Resolve" means something different on each one, and the gap between what you expect and what actually works is exactly where a deploy-day-style surprise waits. This closing lesson maps the honest limits of each machine, then hands you the ten-step checklist that ties the whole chapter into one finished video.</p>

<h3>Mac M1 Max — the one with no asterisks</h3>
${slide('cr-13', 14, 'Resolve trên ba máy của bạn')}
<p>As of Resolve 21.1, Blackmagic Design's own requirements name <strong>Apple Silicon</strong> as the Mac baseline — Intel Macs are no longer in the supported line for this version. Your M1 Max clears that bar with room to spare; its media engine (dedicated hardware for encoding/decoding H.264, HEVC and ProRes) is exactly why 4K timelines from the Pocket 3 and iPhone play smoothly here without extra setup. Treat every fact in this lesson about macOS version numbers as worth a quick double-check inside Resolve's own System Requirements page when you install — Blackmagic tends to move that particular number with each update.</p>

<h3>DaVinci Resolve for iPad — real, but not the full seven pages</h3>
${slide('cr-13', 14, 'Resolve trên ba máy của bạn')}
<p>The app is literally called <strong>"DaVinci Resolve for iPad"</strong> on the App Store, published by Blackmagic Design, and — checked directly on the App Store listing — it requires <strong>iPadOS 18.0 or later and an A12 Bionic chip or newer</strong>, at roughly 3.8GB to download. Your iPad Pro M5 is nowhere near that floor, so device support is not the thing to worry about. The thing to actually plan around is which <em>pages</em> exist:</p>
<table>
<tr><th>Page</th><th>Available on iPad?</th></tr>
<tr><td>Cut</td><td>Yes — available since the app's 2022 launch</td></tr>
<tr><td>Color</td><td>Yes — available since the app's 2022 launch</td></tr>
<tr><td>Deliver</td><td>Yes — added in version 20.1 (August 2025)</td></tr>
<tr><td>Photo</td><td>Yes — added in version 21.0 (June 2026), still image editing and organizing</td></tr>
<tr><td>Edit, Fusion, Fairlight</td><td>Not officially available — Blackmagic's own product team has described ways some users find to reveal them as unintended, not a supported workflow</td></tr>
</table>
<p>In practice: on the iPad, do your rough cutting and quick color pass using the Cut and Color pages, and export from Deliver — that already covers a large share of what a vlog or a quick tutorial needs while you are away from the Mac. Save Text+ titling, retiming, and the full Fairlight mix for when you are back at your Mac's Edit and Fairlight pages. A Studio upgrade is available as a one-time in-app purchase — the App Store listing showed <strong>94.99 USD</strong> at the time this chapter was checked.</p>

<h3>Moving a project between Mac and iPad</h3>
<p>Two different things move between machines, and they are not the same trip. <strong>Blackmagic Cloud</strong> can sync your <em>project data</em> — cuts, timelines, color grades, the "skeleton" of the edit — between devices signed into the same Cloud account, which is genuinely convenient for continuing an edit you started on the Mac while out with just the iPad. What it does <strong>not</strong> do is carry your actual footage; the Pocket 3 and iPhone media files still have to physically exist on whatever device you are editing on, typically by plugging an external SSD with your footage into the iPad through a USB-C hub. Alternatively, exporting a project as a <code>.dra</code> archive (Lesson 13.1) bundles project and media into one transferable package — heavier to move, but self-contained.</p>

<h3>The Linux machine at home — powerful, with one hard rule</h3>
<p>DaVinci Resolve on Linux officially supports only <strong>Rocky Linux 8.6</strong>, and needs a discrete NVIDIA GPU — current install guidance calls for at least 4GB of VRAM, CUDA 12.8 or OpenCL 1.2, and 32GB of system RAM as a realistic baseline (treat the exact numbers as worth reconfirming against Resolve's own installer requirements, since this is exactly the kind of number Blackmagic revises between releases). Your home GPU box fits that shape.</p>
<div class="callout danger"><p><strong>The rule that actually bites: codec support on Linux is not the same as on macOS.</strong> The free version of Resolve on Linux cannot decode H.264 or HEVC — the exact codecs your Pocket 3 and iPhone record in. That is a Studio-only capability on this one platform. On top of that, AAC audio (the audio codec inside most phone-shot MP4 files) does not play in <em>either</em> version of Resolve on Linux. Opening your raw footage straight on the Linux machine, expecting it to behave like it does on the Mac, is how you lose an evening to a project that silently shows black clips or no sound.</p></div>
<p>The fix is exactly the proxy/transcode workflow Chapter 11 already taught you: before editing on the Linux box, run your Pocket 3 and iPhone footage through <code>ffmpeg</code> and convert it to an edit-friendly codec Linux Resolve handles natively — ProRes or DNxHR video with PCM audio — the same command pattern you already used to build proxies. The Linux machine's real strength in this course stays what Chapter 11 already told you: backups, overnight transcodes, and Whisper-based subtitles (Chapter 16) — treat editing there as possible, not primary.</p>

<h3>Your 10-step workflow — from memory card to a finished YouTube video</h3>
${slide('cr-13', 15, 'Quy trình 10 bước — từ thẻ nhớ tới video YouTube')}
<p>This is the whole chapter, in order, the way you will actually run it on a real project:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">1–2 · Start clean</span><span class="v">New Project, set Timeline Frame Rate to 25fps <em>before</em> importing (Lesson 13.1); then import and bin your footage by scene (Chapter 11).</span></div>
  <div class="kv"><span class="k">3 · Sync if needed</span><span class="v">Auto Sync Audio and a Multicam Clip if you shot with both the Pocket 3 and iPhone at once (Lesson 13.3).</span></div>
  <div class="kv"><span class="k">4–6 · Build the cut</span><span class="v">Assemble on the timeline from your shot list, trim with ripple/roll and J/L-cuts (Lesson 13.2), add Text+ titles and restrained transitions.</span></div>
  <div class="kv"><span class="k">7–8 · Finish the craft</span><span class="v">A basic pass on the Color page (Chapter 15) and the Fairlight page (Chapter 16) — this chapter only needs you to know which page each lives on.</span></div>
  <div class="kv"><span class="k">9–10 · Deliver</span><span class="v">Pick a Deliver preset matching your original frame rate, Add to Render Queue, Start Render — then open the exported file and confirm it plays, the same "verify by running it" habit Chapter 6 already built in you.</span></div>
</div>

<p class="note-ct"><strong>Next in the course:</strong> Chapter 14 goes deep on the craft decisions inside step 5 — which cut to use and why, the rhythm of a good edit, and Walter Murch's Rule of Six.</p>

<h3>🎬 Practice (30–45 minutes) — the chapter's real test</h3>
<div class="callout ok"><ol>
<li>Using your real footage (not the CH13-Test scratch project), create a new project and run through all 10 steps above, start to finish.</li>
<li>The result should be a genuine 3–5 minute rough cut with at least one multicam or two-camera moment, several ripple/roll trims, one J-cut or L-cut, one Text+ title, and a render that plays back cleanly.</li>
<li>If you have access to your iPad, open the same project via Blackmagic Cloud and confirm you can at least review it on the Cut page.</li>
</ol><p><strong>Done when:</strong> a file exists on disk, exported from the Deliver page, that opens and plays — not a project file, an actual video. That file is the real proof this chapter worked.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Apple Silicon</span><span class="v">Apple's own-designed Mac chips (M1, M1 Max, and newer) — the current baseline for running DaVinci Resolve 21.1 on macOS.</span></div>
  <div class="kv"><span class="k">Blackmagic Cloud</span><span class="v">Blackmagic's sync service for project data (cuts, grades) between devices — does not transfer media files.</span></div>
  <div class="kv"><span class="k">Rocky Linux 8.6</span><span class="v">The only Linux distribution Blackmagic Design officially supports for DaVinci Resolve.</span></div>
  <div class="kv"><span class="k">Transcode</span><span class="v">Converting footage from one codec to another (e.g. HEVC → ProRes) so a system that cannot decode the original can work with it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Mac M1 Max meets Resolve 21.1's Apple Silicon requirement with no workarounds needed — it is your full, seven-page studio.</li>
<li>DaVinci Resolve for iPad officially offers Cut, Color, Deliver, and Photo — not yet Edit, Fusion, or Fairlight. Plan iPad sessions around what those four pages can do.</li>
<li>Blackmagic Cloud moves project data between Mac and iPad, not your media files — carry footage yourself via external SSD, or export a self-contained <code>.dra</code> archive.</li>
<li>The free version of Resolve on Linux cannot decode H.264/HEVC, and AAC audio fails on both versions there — transcode Pocket 3/iPhone footage with ffmpeg before editing on the Linux machine.</li>
<li>The 10-step workflow (frame rate → import → sync → cut → trim → titles → color → audio → deliver → verify the render) is this whole chapter, run once on a real project.</li>
</ul>
<div class="link-card"><a href="https://apps.apple.com/us/app/davinci-resolve-for-ipad/id1581363826" target="_blank" rel="noopener">App Store — DaVinci Resolve for iPad (requirements, in-app Studio price)</a></div>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve" target="_blank" rel="noopener">Blackmagic Design — DaVinci Resolve product page (Mac/Windows/Linux downloads)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.4</span>
<h2>Cùng một dự án, ba máy — và mỗi máy giữ một lời hứa khác nhau</h2>
<p class="lead">Mac M1 Max của bạn là studio đầy đủ. iPad Pro M5 và máy Linux ở nhà đều chạy được DaVinci Resolve — nhưng "chạy được DaVinci Resolve" mang nghĩa khác nhau trên từng máy, và khoảng cách giữa điều bạn tưởng và điều thật sự chạy được chính là chỗ một bất ngờ kiểu "ngày deploy" đang chờ. Bài khép chương này vẽ đúng giới hạn thật của từng máy, rồi trao bạn checklist 10 bước gói cả chương thành một video hoàn chỉnh.</p>

<h3>Mac M1 Max — máy không có dấu sao chú thích nào</h3>
${slide('cr-13', 14, 'Resolve trên ba máy của bạn')}
<p>Tính tới Resolve 21.1, yêu cầu hệ thống chính thức của Blackmagic Design gọi tên <strong>Apple Silicon</strong> là chuẩn tối thiểu cho Mac — Mac dùng chip Intel không còn nằm trong danh sách hỗ trợ ở phiên bản này. M1 Max của bạn vượt qua mức đó dư sức; media engine của nó (khối phần cứng chuyên mã hoá/giải mã H.264, HEVC và ProRes) chính là lý do timeline 4K từ Pocket 3 và iPhone chạy mượt ở đây mà không cần cài thêm gì. Coi mọi con số phiên bản macOS trong bài này là thứ đáng kiểm nhanh lại ngay trong trang System Requirements của chính Resolve lúc bạn cài đặt — đây đúng kiểu con số Blackmagic hay chỉnh theo từng bản cập nhật.</p>

<h3>DaVinci Resolve for iPad — có thật, nhưng chưa đủ bảy trang</h3>
${slide('cr-13', 14, 'Resolve trên ba máy của bạn')}
<p>App có tên chính xác là <strong>"DaVinci Resolve for iPad"</strong> trên App Store, do Blackmagic Design phát hành, và — kiểm trực tiếp trên trang App Store — cần <strong>iPadOS 18.0 trở lên và chip A12 Bionic trở lên</strong>, dung lượng tải khoảng 3.8GB. iPad Pro M5 của bạn vượt xa mức sàn đó, nên phần cứng không phải thứ cần lo. Thứ thật sự cần lên kế hoạch xung quanh là <em>trang nào</em> có thật:</p>
<table>
<tr><th>Trang</th><th>Có trên iPad?</th></tr>
<tr><td>Cut</td><td>Có — có từ lúc app ra mắt năm 2022</td></tr>
<tr><td>Color</td><td>Có — có từ lúc app ra mắt năm 2022</td></tr>
<tr><td>Deliver</td><td>Có — thêm ở bản 20.1 (8/2025)</td></tr>
<tr><td>Photo</td><td>Có — thêm ở bản 21.0 (6/2026), dựng/tổ chức ảnh tĩnh</td></tr>
<tr><td>Edit, Fusion, Fairlight</td><td>CHƯA chính thức — chính đội sản phẩm của Blackmagic từng mô tả cách một số người dùng tìm ra để lộ các trang này là ngoài ý định, không phải quy trình được hỗ trợ</td></tr>
</table>
<p>Trong thực tế: trên iPad, dựng thô và chỉnh màu nhanh bằng trang Cut và Color, rồi xuất từ Deliver — vậy đã phủ được một phần lớn nhu cầu của một vlog hay video hướng dẫn nhanh trong lúc bạn không ở cạnh Mac. Để dành Text+, retime, và mix Fairlight đầy đủ cho lúc quay lại trang Edit và Fairlight trên Mac. Nâng cấp Studio có dạng mua trong app một lần — trang App Store hiện <strong>94,99 USD</strong> tại thời điểm chương này được kiểm.</p>

<h3>Chuyển dự án giữa Mac và iPad</h3>
<p>Hai thứ khác nhau di chuyển giữa các máy, và chúng không đi cùng một chuyến. <strong>Blackmagic Cloud</strong> đồng bộ được <em>dữ liệu dự án</em> — các cú cắt, timeline, grade màu, "bộ khung" của bản dựng — giữa các thiết bị đăng nhập cùng một tài khoản Cloud, thật sự tiện để tiếp tục một bản dựng bắt đầu trên Mac trong lúc ra ngoài chỉ mang iPad. Thứ nó <strong>KHÔNG</strong> làm là mang theo cảnh quay thật; file media của Pocket 3 và iPhone vẫn phải tồn tại vật lý trên bất cứ thiết bị nào bạn đang dựng, thường bằng cách cắm một SSD ngoài chứa cảnh quay vào iPad qua hub USB-C. Cách khác: xuất dự án thành archive <code>.dra</code> (Bài 13.1) đóng gói cả dự án lẫn media vào một gói di chuyển được — nặng hơn để mang đi, nhưng tự chứa đủ mọi thứ.</p>

<h3>Máy Linux ở nhà — mạnh, nhưng có một luật cứng</h3>
<p>DaVinci Resolve trên Linux chính thức chỉ hỗ trợ <strong>Rocky Linux 8.6</strong>, và cần GPU NVIDIA rời — hướng dẫn cài đặt hiện hành đòi hỏi tối thiểu 4GB VRAM, CUDA 12.8 hoặc OpenCL 1.2, và 32GB RAM hệ thống làm mức nền thực tế (coi các con số chính xác là thứ đáng kiểm lại trong đúng yêu cầu của trình cài đặt Resolve, vì đây đúng kiểu con số Blackmagic hay chỉnh giữa các bản). Máy GPU ở nhà bạn khớp đúng hình dạng đó.</p>
<div class="callout danger"><p><strong>Luật thật sự cắn bạn: hỗ trợ codec trên Linux KHÔNG giống trên macOS.</strong> Bản miễn phí của Resolve trên Linux không giải mã được H.264 hay HEVC — đúng những codec Pocket 3 và iPhone của bạn ghi ra. Đây là khả năng CHỈ Studio mới có, riêng trên nền tảng này. Thêm nữa, âm thanh AAC (codec âm thanh bên trong phần lớn file MP4 quay bằng điện thoại) không phát được trên CẢ HAI bản Resolve trên Linux. Mở thẳng cảnh quay gốc trên máy Linux, kỳ vọng nó chạy như trên Mac, là cách bạn mất nguyên một buổi tối vì một dự án lặng lẽ hiện clip đen hoặc không có tiếng.</p></div>
<p>Cách sửa chính là đúng quy trình proxy/chuyển mã Chương 11 đã dạy: trước khi dựng trên máy Linux, chạy cảnh quay Pocket 3 và iPhone qua <code>ffmpeg</code> và chuyển sang một codec dễ dựng mà Resolve trên Linux xử lý được ngay — video ProRes hoặc DNxHR với âm thanh PCM — đúng kiểu lệnh bạn đã dùng để dựng proxy. Thế mạnh thật sự của máy Linux trong khoá này vẫn giữ nguyên như Chương 11 đã nói: sao lưu, chuyển mã qua đêm, và phụ đề bằng Whisper (Chương 16) — coi việc dựng ở đó là làm ĐƯỢC, không phải làm CHÍNH.</p>

<h3>Quy trình 10 bước của bạn — từ thẻ nhớ tới một video YouTube hoàn chỉnh</h3>
${slide('cr-13', 15, 'Quy trình 10 bước — từ thẻ nhớ tới video YouTube')}
<p>Đây là cả chương, theo đúng thứ tự, đúng cách bạn sẽ thật sự chạy nó trên một dự án thật:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">1–2 · Bắt đầu sạch</span><span class="v">New Project, đặt Timeline Frame Rate = 25fps <em>trước</em> khi nhập (Bài 13.1); rồi nhập và chia bin cảnh quay theo từng cảnh (Chương 11).</span></div>
  <div class="kv"><span class="k">3 · Đồng bộ nếu cần</span><span class="v">Auto Sync Audio và Multicam Clip nếu bạn quay cùng lúc cả Pocket 3 lẫn iPhone (Bài 13.3).</span></div>
  <div class="kv"><span class="k">4–6 · Dựng bản cắt</span><span class="v">Ghép trên timeline theo shot list, tỉa bằng ripple/roll và J/L-cut (Bài 13.2), thêm tiêu đề Text+ và chuyển cảnh tiết chế.</span></div>
  <div class="kv"><span class="k">7–8 · Hoàn thiện tay nghề</span><span class="v">Một lượt cơ bản ở trang Color (Chương 15) và trang Fairlight (Chương 16) — chương này chỉ cần bạn biết mỗi việc nằm ở trang nào.</span></div>
  <div class="kv"><span class="k">9–10 · Xuất</span><span class="v">Chọn preset Deliver khớp fps gốc, Add to Render Queue, Start Render — rồi mở file vừa xuất ra và xác nhận nó phát được, đúng thói quen "kiểm bằng cách chạy thật" mà Chương 6 đã rèn cho bạn.</span></div>
</div>

<p class="note-ct"><strong>Tiếp theo trong khoá:</strong> Chương 14 đi sâu vào các quyết định tay nghề bên trong bước 5 — dùng kiểu cắt nào và vì sao, nhịp điệu của một bản dựng tốt, và Rule of Six của Walter Murch.</p>

<h3>🎬 Thực hành (30–45 phút) — bài kiểm thật của cả chương</h3>
<div class="callout ok"><ol>
<li>Dùng chính cảnh quay thật của bạn (không phải project nháp CH13-Test), tạo một dự án mới và chạy trọn 10 bước ở trên, từ đầu tới cuối.</li>
<li>Kết quả phải là một bản dựng thô thật dài 3–5 phút, có ít nhất một khoảnh khắc multicam hoặc hai máy, vài lần tỉa ripple/roll, một J-cut hoặc L-cut, một tiêu đề Text+, và một bản xuất phát được sạch sẽ.</li>
<li>Nếu có iPad trong tay, mở cùng dự án đó qua Blackmagic Cloud và xác nhận bạn ít nhất xem lại được nó trên trang Cut.</li>
</ol><p><strong>Đạt khi:</strong> có một file tồn tại trên đĩa, xuất từ trang Deliver, mở lên và phát được — không phải file dự án, mà là một video thật. File đó là bằng chứng thật cho việc chương này đã có tác dụng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Apple Silicon</span><span class="v">Dòng chip Mac do chính Apple thiết kế (M1, M1 Max, và mới hơn) — chuẩn tối thiểu hiện hành để chạy DaVinci Resolve 21.1 trên macOS.</span></div>
  <div class="kv"><span class="k">Blackmagic Cloud</span><span class="v">Dịch vụ đồng bộ của Blackmagic cho dữ liệu dự án (cú cắt, grade) giữa các thiết bị — không chuyển file media.</span></div>
  <div class="kv"><span class="k">Rocky Linux 8.6</span><span class="v">Bản phân phối Linux DUY NHẤT Blackmagic Design hỗ trợ chính thức cho DaVinci Resolve.</span></div>
  <div class="kv"><span class="k">Transcode (chuyển mã)</span><span class="v">Chuyển cảnh quay từ codec này sang codec khác (vd HEVC → ProRes) để một hệ thống không giải mã được bản gốc vẫn làm việc được với nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mac M1 Max đạt đúng yêu cầu Apple Silicon của Resolve 21.1 mà không cần đường vòng nào — đó là studio đầy đủ bảy trang của bạn.</li>
<li>DaVinci Resolve for iPad chính thức có Cut, Color, Deliver, và Photo — CHƯA có Edit, Fusion, hay Fairlight. Lên kế hoạch cho phiên làm việc trên iPad xoay quanh đúng bốn trang đó làm được gì.</li>
<li>Blackmagic Cloud chuyển dữ liệu dự án giữa Mac và iPad, không chuyển file media của bạn — tự mang cảnh quay bằng SSD ngoài, hoặc xuất archive <code>.dra</code> tự chứa đủ mọi thứ.</li>
<li>Bản miễn phí của Resolve trên Linux không giải mã được H.264/HEVC, và âm thanh AAC hỏng trên cả hai bản ở đó — chuyển mã cảnh quay Pocket 3/iPhone bằng ffmpeg trước khi dựng trên máy Linux.</li>
<li>Quy trình 10 bước (frame rate → nhập → đồng bộ → dựng → tỉa → tiêu đề → màu → âm → xuất → kiểm lại bản xuất) chính là cả chương này, chạy một lượt trên một dự án thật.</li>
</ul>
<div class="link-card"><a href="https://apps.apple.com/us/app/davinci-resolve-for-ipad/id1581363826" target="_blank" rel="noopener">App Store — DaVinci Resolve for iPad (yêu cầu thiết bị, giá Studio mua trong app)</a></div>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve" target="_blank" rel="noopener">Blackmagic Design — trang sản phẩm DaVinci Resolve (tải cho Mac/Windows/Linux)</a></div>
</div>
`,
    },

    /* ─────────────────────── 13.5 Kiểm tra chương ─────────────────────── */
    {
      title: '13.5 — Chapter 13 check|||13.5 — Kiểm tra chương 13',
      slug: 'cr-13-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: '10 câu tình huống: project settings, bản miễn phí vs Studio, bốn kiểu tỉa cạnh, đồng bộ đa máy, và giới hạn Resolve trên iPad/Linux.',
      content: `
<div class="ml-en">
<h2>📌 Chapter 13 summary</h2>
<p>You went from "I don't know how to edit" to a working, repeatable process in DaVinci Resolve: seven pages with one main workshop (Edit), a frame-rate rule that must happen first, four distinct ways to trim a clip's edge, offsetting audio and video on purpose with J/L-cuts, syncing two cameras by their sound instead of by eye, and the honest limits of running the same project on your iPad and your Linux machine.</p>
<h3>Self-check before you move on</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pages</span><span class="v">Can you name all seven Resolve pages, in order, and what each one is for?</span></div>
  <div class="kv"><span class="k">Frame rate</span><span class="v">Do you set Timeline Frame Rate before importing media, every single time?</span></div>
  <div class="kv"><span class="k">Free vs Studio</span><span class="v">Can you explain why a watermark showing up is a signal, not a bug?</span></div>
  <div class="kv"><span class="k">Trim tools</span><span class="v">Can you demonstrate ripple, roll, slip, and slide on a real timeline, and say out loud which one changes total duration?</span></div>
  <div class="kv"><span class="k">J/L-cuts</span><span class="v">Have you unlinked audio and video on purpose to build one, at least once?</span></div>
  <div class="kv"><span class="k">Multicam</span><span class="v">Do you know why a hand clap matters, and what "Based on Waveform" actually compares?</span></div>
  <div class="kv"><span class="k">Platforms</span><span class="v">Can you say which pages exist on iPad, and what breaks if you open raw footage on the Linux free version?</span></div>
  <div class="kv"><span class="k">10-step workflow</span><span class="v">Have you exported one real file from Deliver and confirmed it plays?</span></div>
</div>
<p>Ten scenario questions follow — each one is something that actually goes wrong at a real edit desk, not a term to memorize.</p>
</div>
<div class="ml-vi">
<h2>📌 Tóm tắt chương 13</h2>
<p>Bạn đã đi từ "không biết edit" tới một quy trình thật, lặp lại được trong DaVinci Resolve: bảy trang với một xưởng chính (Edit), một luật về frame rate phải làm trước tiên, bốn cách khác nhau để tỉa mép clip, cố ý lệch hình/tiếng bằng J/L-cut, đồng bộ hai máy theo âm thanh thay vì theo mắt, và giới hạn thật khi chạy cùng một dự án trên iPad và máy Linux của bạn.</p>
<h3>Tự kiểm trước khi qua chương sau</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Các trang</span><span class="v">Bạn gọi tên được cả bảy trang của Resolve, đúng thứ tự, và việc của từng trang chưa?</span></div>
  <div class="kv"><span class="k">Frame rate</span><span class="v">Bạn có đặt Timeline Frame Rate trước khi nhập media, mọi lần không trừ ngoại lệ?</span></div>
  <div class="kv"><span class="k">Miễn phí vs Studio</span><span class="v">Bạn giải thích được vì sao watermark xuất hiện là một tín hiệu, không phải lỗi?</span></div>
  <div class="kv"><span class="k">Công cụ tỉa</span><span class="v">Bạn làm được ripple, roll, slip, slide trên một timeline thật, và nói ra được cái nào đổi tổng thời lượng?</span></div>
  <div class="kv"><span class="k">J/L-cut</span><span class="v">Bạn đã từng cố ý bỏ liên kết hình/tiếng để dựng một cái, ít nhất một lần?</span></div>
  <div class="kv"><span class="k">Multicam</span><span class="v">Bạn biết vì sao tiếng vỗ tay quan trọng, và "Based on Waveform" thật sự so khớp cái gì?</span></div>
  <div class="kv"><span class="k">Nền tảng</span><span class="v">Bạn nói được trang nào có trên iPad, và điều gì hỏng nếu mở cảnh quay gốc bằng bản miễn phí trên Linux?</span></div>
  <div class="kv"><span class="k">Quy trình 10 bước</span><span class="v">Bạn đã xuất được một file thật từ Deliver và xác nhận nó phát được chưa?</span></div>
</div>
<p>Mười câu tình huống bên dưới — mỗi câu là một thứ thật sự hay hỏng ở bàn dựng thật, không phải một định nghĩa cần học thuộc.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You already dragged three Pocket 3 clips into the Media Pool, then remembered you meant to shoot at 25fps but the project is still at 24fps. You open Project Settings to fix it. What actually happens?|||Bạn đã kéo ba clip Pocket 3 vào Media Pool, rồi mới nhớ ra định quay ở 25fps nhưng dự án vẫn đang 24fps. Bạn mở Project Settings để sửa. Điều gì thật sự xảy ra?',
            options: [
              'The Timeline Frame Rate field is effectively locked now that media has been added — the clean fix is a new project set up correctly from the start|||Ô Timeline Frame Rate gần như đã khoá vì media đã được thêm — cách sửa sạch nhất là tạo dự án mới và đặt đúng ngay từ đầu',
              'Resolve automatically re-encodes all three clips to 25fps in the background|||Resolve tự động mã hoá lại cả ba clip sang 25fps ở nền',
              'Nothing changes — frame rate can be edited freely at any point in a project|||Không có gì đổi — frame rate sửa được thoải mái bất cứ lúc nào trong dự án',
              'The project file becomes corrupted and must be deleted|||File dự án bị hỏng và phải xoá đi',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'This is exactly why Lesson 13.1 says "frame rate before media": once footage is in the project, the normal path to changing Timeline Frame Rate closes, and Resolve\'s own documentation points to starting a new project as the clean fix. Option C is the trap — it describes Proxy/Optimized Media settings, which really can change anytime, not the timeline frame rate.|||Đây chính xác là lý do Bài 13.1 nói "frame rate trước media": một khi cảnh quay đã vào dự án, đường sửa Timeline Frame Rate bình thường đóng lại, và tài liệu của Resolve chỉ ra tạo dự án mới là cách sửa sạch. Phương án C là cái bẫy — nó mô tả đúng Proxy/Optimized Media, thứ THẬT SỰ đổi được bất cứ lúc nào, không phải timeline frame rate.',
          },
          {
            question: 'You export a straightforward 1080p, 30fps, 8-bit cut using the free version of DaVinci Resolve — no Studio-only effects anywhere in the timeline. What does the exported file look like?|||Bạn xuất một bản dựng 1080p, 30fps, 8-bit bình thường bằng bản miễn phí DaVinci Resolve — không dùng hiệu ứng nào chỉ Studio mới có. File xuất ra trông thế nào?',
            options: [
              'It fails to export — 1080p exports require Studio|||Không xuất được — xuất 1080p cần Studio',
              'A clean file with no watermark — this is well within the free version\'s limits (up to UHD, up to 60fps, 8-bit)|||Một file sạch, không watermark — hoàn toàn trong giới hạn của bản miễn phí (tới UHD, tới 60fps, 8-bit)',
              'A file with a small watermark in the corner, removable only by upgrading|||Một file có watermark nhỏ ở góc, chỉ gỡ được bằng cách nâng cấp',
              'Only the first 60 seconds export, the rest is cut off|||Chỉ 60 giây đầu xuất ra, phần còn lại bị cắt',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'Free-version limits sit around resolution (up to UHD 3840×2160), frame rate (up to 60fps) and bit depth (8-bit) — a 1080p/30fps/8-bit export is nowhere near any of those ceilings, and ordinary exports carry no watermark at all. The watermark only shows up around Studio-only effects, which is question 3.|||Giới hạn của bản miễn phí nằm quanh độ phân giải (tới UHD 3840×2160), fps (tới 60fps) và độ sâu màu (8-bit) — một bản xuất 1080p/30fps/8-bit còn cách rất xa mọi trần đó, và bản xuất bình thường không hề có watermark. Watermark chỉ xuất hiện quanh hiệu ứng chỉ Studio mới có, đúng chủ đề câu 3.',
          },
          {
            question: 'While previewing a clip with Magic Mask applied, using the free version, you notice a watermark burned into the frame. What is actually going on?|||Trong lúc xem trước một clip có dùng Magic Mask, bằng bản miễn phí, bạn thấy một watermark hiện trên khung hình. Điều gì đang thật sự xảy ra?',
            options: [
              'The footage file itself is corrupted|||Chính file cảnh quay bị hỏng',
              'You forgot to sign in to your Blackmagic account|||Bạn quên đăng nhập tài khoản Blackmagic',
              'Magic Mask is a Studio-only tool; the free version lets you preview/render it but marks the result|||Magic Mask là công cụ chỉ Studio mới có; bản miễn phí cho xem trước/xuất nhưng đánh dấu lên kết quả',
              'The project\'s render cache needs to be cleared|||Cần xoá render cache của dự án',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'The watermark is not a bug — it is the free version\'s way of letting you try a Studio-only feature (Magic Mask, film grain, optical blur, Neural Engine AI tools) while making clear that a paid upgrade is what removes it. Seeing that mark is useful information about which tool you just touched.|||Watermark không phải lỗi — đó là cách bản miễn phí cho bạn thử một tính năng chỉ Studio mới có (Magic Mask, film grain, optical blur, công cụ AI Neural Engine) trong khi nói rõ chỉ nâng cấp trả phí mới gỡ được nó. Thấy dấu đó là thông tin hữu ích cho biết bạn vừa chạm vào công cụ nào.',
          },
          {
            question: 'You drag clip B\'s right edge to shorten it. Every clip after B visibly shifts left, and the whole sequence ends up shorter than before. Which trim did you just perform?|||Bạn kéo mép phải của clip B để làm nó ngắn lại. Mọi clip sau B rõ ràng dịch sang trái, và cả chuỗi cảnh ngắn đi so với trước. Bạn vừa thực hiện kiểu tỉa nào?',
            options: [
              'Slide|||Slide',
              'Roll trim|||Roll trim',
              'Slip|||Slip',
              'Ripple trim|||Ripple trim',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'Ripple trim moves only the edge you grabbed — the clip\'s neighbor does not automatically absorb the change, so everything downstream ripples to close the gap, and total duration changes. Roll trim (option B) would keep total duration fixed by growing the neighbor exactly as much as B shrank — that is not what happened here.|||Ripple trim chỉ di chuyển đúng mép bạn kéo — clip bên cạnh không tự hấp thụ thay đổi, nên mọi thứ phía sau dịch theo để khép khoảng trống, và tổng thời lượng thay đổi. Roll trim (phương án B) sẽ giữ tổng thời lượng cố định bằng cách clip bên cạnh dài thêm đúng bằng lượng B ngắn lại — đó không phải điều vừa xảy ra ở đây.',
          },
          {
            question: 'You want to nudge the cut point between two clips two frames earlier, so it lands on a blink instead of an open eye — but you do NOT want the total video length to change at all. Which tool?|||Bạn muốn nhích điểm cắt giữa hai clip sớm hai khung hình, để nó rơi đúng lúc chớp mắt thay vì mắt đang mở — nhưng KHÔNG muốn tổng độ dài video đổi chút nào. Dùng công cụ nào?',
            options: [
              'Roll trim — drag the joint between the two clips|||Roll trim — kéo điểm nối giữa hai clip',
              'Ripple trim on the first clip only|||Ripple trim chỉ trên clip đầu',
              'Blade the clip and delete the extra frames|||Blade cắt clip rồi xoá bớt khung thừa',
              'Slide the second clip two frames left|||Slide clip thứ hai sang trái hai khung',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'Roll trim grabs the joint itself: one clip shrinks by exactly the amount the other grows, so the edit point moves but the overall sequence length never changes — precisely the "fine-tune without disturbing anything else" tool this scenario needs. Ripple (option B) would shift everything after it and shorten the total.|||Roll trim nắm đúng điểm nối: một clip ngắn lại đúng bằng lượng clip kia dài ra, nên điểm cắt di chuyển nhưng tổng độ dài chuỗi cảnh không bao giờ đổi — đúng công cụ "tinh chỉnh mà không động gì khác" tình huống này cần. Ripple (phương án B) sẽ dịch mọi thứ sau nó và làm tổng thời lượng ngắn đi.',
          },
          {
            question: 'A B-roll clip is already the right length and in the right spot on your timeline (timed to the music). You just want a slightly different moment of action from inside that same source clip, without touching any neighboring clips. Which tool?|||Một clip B-roll đã đúng độ dài, đúng vị trí trên timeline (khớp nhạc). Bạn chỉ muốn một khoảnh khắc hành động hơi khác từ BÊN TRONG đúng clip nguồn đó, không động gì tới các clip bên cạnh. Dùng công cụ nào?',
            options: [
              'Ripple trim|||Ripple trim',
              'Slip|||Slip',
              'Roll trim|||Roll trim',
              'Create a Compound Clip|||Tạo Compound Clip',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'Slip is exactly this: the clip\'s position and duration on the timeline stay untouched, only which portion of the source footage plays changes. Everything else in this list either moves the clip, moves a neighbor, or does something unrelated (a Compound Clip just groups clips together).|||Slip đúng chính xác việc này: vị trí và độ dài của clip trên timeline giữ nguyên, chỉ phần nào của cảnh quay nguồn đang phát là đổi. Mọi phương án còn lại hoặc di chuyển clip, di chuyển clip bên cạnh, hoặc làm một việc không liên quan (Compound Clip chỉ gộp các clip lại với nhau).',
          },
          {
            question: 'You press Delete (not Shift+Delete) to remove one bad clip from the middle of your timeline. On playback, there is now a black, silent hole exactly where that clip used to be. What happened?|||Bạn bấm Delete (không phải Shift+Delete) để xoá một clip lỗi ở giữa timeline. Lúc phát lại, giờ có một lỗ đen, câm lặng đúng chỗ clip đó từng ở. Chuyện gì đã xảy ra?',
            options: [
              'The clip\'s media file was corrupted on the memory card|||File media của clip đó bị hỏng trên thẻ nhớ',
              'The project was not rendering with the right codec|||Dự án không render đúng codec',
              'Plain Delete removes the clip but leaves a gap the same size, since nothing else shifts to close it — Shift+Delete (Ripple Delete) closes the gap too|||Delete thường xoá clip nhưng để lại khoảng trống đúng kích thước đó, vì không gì khác dịch để khép lại — Shift+Delete (Ripple Delete) mới khép luôn khoảng trống',
              'You deleted a clip on the wrong track by mistake|||Bạn lỡ xoá nhầm clip ở track khác',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'This is exactly Lesson 13.2\'s pitfall: Delete removes a clip but leaves a gap of the same size because nothing downstream is told to move. Shift+Delete (Ripple Delete) removes the clip AND closes the gap by shifting everything after it earlier — the fix for a silent hole appearing after a delete.|||Đây đúng cái bẫy của Bài 13.2: Delete xoá clip nhưng để lại khoảng trống đúng kích thước vì không có gì phía sau được báo phải dịch chuyển. Shift+Delete (Ripple Delete) xoá clip VÀ khép khoảng trống bằng cách dịch mọi thứ sau đó sớm hơn — đúng cách sửa cho một lỗ câm xuất hiện sau khi xoá.',
          },
          {
            question: 'You filmed with the Pocket 3 and iPhone at the same time. Neither camera was jam-synced to share timecode, but you clapped once at the start of the take. What is the reliable way to sync them in Resolve?|||Bạn quay cùng lúc bằng Pocket 3 và iPhone. Không máy nào được jam-sync để chia sẻ timecode chung, nhưng bạn có vỗ tay một cái đầu mỗi lần quay. Cách đồng bộ đáng tin cậy trong Resolve là gì?',
            options: [
              'Auto Sync Audio → Based on Timecode|||Auto Sync Audio → Based on Timecode',
              'Manually drag one clip until it looks aligned by eye|||Kéo tay một clip cho tới khi nhìn bằng mắt thấy khớp',
              'It cannot be done — the two cameras are incompatible|||Không làm được — hai máy không tương thích với nhau',
              'Auto Sync Audio → Based on Waveform, using the clap as the shared landmark|||Auto Sync Audio → Based on Waveform, dùng tiếng vỗ tay làm mốc chung',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'Neither the Pocket 3 nor the iPhone supports professional jam-synced timecode, so Based on Timecode (option A) has nothing to match. Based on Waveform compares the actual sound in both clips and finds the clap automatically — exactly the workflow Lesson 13.3 walks through.|||Cả Pocket 3 lẫn iPhone đều không hỗ trợ timecode jam-sync chuyên nghiệp, nên Based on Timecode (phương án A) không có gì để so khớp. Based on Waveform so khớp chính âm thanh thật trong cả hai clip và tự tìm ra tiếng vỗ tay — đúng quy trình Bài 13.3 đã hướng dẫn.',
          },
          {
            question: 'On the Linux machine at home, you open an iPhone-shot MP4 (H.264 video, AAC audio) directly in the free version of DaVinci Resolve. Picture and sound both fail to work. What is the most likely reason?|||Trên máy Linux ở nhà, bạn mở thẳng một file MP4 quay từ iPhone (video H.264, âm thanh AAC) bằng bản MIỄN PHÍ của DaVinci Resolve. Cả hình lẫn tiếng đều không chạy. Lý do khả năng cao nhất là gì?',
            options: [
              'The free version of Resolve on Linux cannot decode H.264, and AAC audio does not work in either version there|||Bản miễn phí của Resolve trên Linux không giải mã được H.264, và âm thanh AAC không chạy trên cả hai bản ở đó',
              'The file is too large for Linux to handle|||File quá lớn nên Linux không xử lý được',
              'The project\'s Timeline Frame Rate is set incorrectly|||Timeline Frame Rate của dự án đặt sai',
              'Rocky Linux 8.6 does not support any video files at all|||Rocky Linux 8.6 không hỗ trợ file video nào cả',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'This is the Linux-specific codec trap from Lesson 13.4: H.264/HEVC decoding on Linux is a Studio-only capability, and AAC audio does not play in either version there. The fix is transcoding the footage first with ffmpeg (Chapter 11\'s proxy workflow), not troubleshooting frame rate or file size.|||Đây là cái bẫy codec riêng của Linux từ Bài 13.4: giải mã H.264/HEVC trên Linux là khả năng CHỈ Studio mới có, và âm thanh AAC không phát được trên cả hai bản ở đó. Cách sửa là chuyển mã cảnh quay trước bằng ffmpeg (quy trình proxy của Chương 11), không phải soi lại frame rate hay dung lượng file.',
          },
          {
            question: 'Sitting at a coffee shop with only your iPad Pro, you open your project in DaVinci Resolve for iPad and want to add a Text+ title — but you cannot find the Edit page anywhere. Why?|||Ngồi quán cà phê chỉ mang theo iPad Pro, bạn mở dự án trong DaVinci Resolve for iPad và muốn thêm tiêu đề Text+ — nhưng không tìm thấy trang Edit ở đâu cả. Vì sao?',
            options: [
              'Your iPad does not meet the minimum iPadOS/chip requirement|||iPad của bạn chưa đạt yêu cầu iPadOS/chip tối thiểu',
              'The Edit page is not officially available on DaVinci Resolve for iPad — only Cut, Color, Deliver, and Photo are|||Trang Edit hiện CHƯA có chính thức trên DaVinci Resolve for iPad — chỉ có Cut, Color, Deliver, và Photo',
              'You need to buy the Studio in-app purchase first|||Bạn cần mua Studio trong app trước',
              'You need an internet connection to unlock the Edit page|||Bạn cần kết nối mạng để mở khoá trang Edit',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'DaVinci Resolve for iPad officially ships with Cut and Color since 2022, Deliver added in version 20.1, and Photo in 21.0 — Edit, Fusion, and Fairlight are simply not part of the supported iPad app, Studio purchase or not. Text+ titling on the go has to wait for the Mac\'s Edit page (or be done sparingly on Cut, which has its own simpler titling).|||DaVinci Resolve for iPad chính thức có Cut và Color từ 2022, thêm Deliver ở bản 20.1, và Photo ở bản 21.0 — Edit, Fusion, và Fairlight đơn giản là chưa nằm trong app iPad được hỗ trợ, có mua Studio hay không cũng vậy. Thêm tiêu đề Text+ khi di chuyển phải chờ tới trang Edit trên Mac (hoặc làm hạn chế trên Cut, vốn có công cụ đặt tiêu đề đơn giản riêng).',
          },
        ],
      },
    },
  ],
};
