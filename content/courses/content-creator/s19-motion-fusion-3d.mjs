/**
 * Content Creator — Chương 19: Motion graphics, Fusion & 3D. Song ngữ EN/VI (.ml-en / .ml-vi).
 * ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong mã mẫu viết \${ ; gạch chéo ngược viết \\
 */
import { gallery, slide } from './_slides.mjs';

const SLIDES = [
  [1, 'Bìa'],
  [2, 'Bản đồ chương'],
  [3, 'Hệ thống nhận diện chuyển động — các thành phần'],
  [4, 'End screen: vùng phần tử & thời lượng (YouTube)'],
  [5, 'Công cụ dựng motion graphics — chọn cái nào'],
  [6, 'Xuất đồ hoạ có nền trong suốt — đo thật trên máy này'],
  [7, 'Tư duy NODE của Fusion — khác layer của CapCut/After Effects'],
  [8, 'Công cụ trang Fusion — free hay chỉ Studio'],
  [9, 'Làm mẫu từng bước: lower third trong Fusion'],
  [10, 'Không gian 3D của Fusion: 4 node hội tụ về MỘT cảnh'],
  [11, 'Fusion 3D: đủ dùng cho creator, KHÔNG thay phần mềm 3D thật'],
  [12, 'Blender cho creator — quy trình logo/chữ 3D → ghép Resolve'],
  [13, 'Render chữ 3D THẬT trên máy này (Mac M1 Max)'],
  [14, 'Render trên máy Linux (RTX 3060) — cú pháp CHƯA chạy ở đây'],
  [15, 'Bảng tra nhanh cả chương'],
  [16, 'Thực hành'],
];

export default {
  title: 'Chapter 19 — Motion graphics, Fusion & 3D|||Chương 19 — Motion graphics, Fusion & 3D',
  description: 'Từ chữ/callout tĩnh (Ch16) và keyframe cơ bản (Ch17) lên một hệ nhận diện chuyển động thật sự, tư duy node của Fusion, không gian 3D bên trong Resolve, và Blender khi Fusion không đủ — kèm số đo THẬT trên máy này.',
  lessons: [

    /* ─────────────────── 19.0 slide bài giảng ─────────────────── */
    {
      title: '19.0 — Chapter 19 in 16 slides|||19.0 — Chương 19 trong 16 slide',
      slug: 'cr-19-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Toàn bộ chương gói trong 16 slide có hình: 6 thành phần của một hệ nhận diện chuyển động, end screen YouTube, tư duy node của Fusion, không gian 3D, và số đo Blender thật trên máy này.',
      content: `
<div class="ml-en"><h2>📑 Chapter 19 in 16 slides</h2>
<p>Chapters 16 and 17 already gave you a lower third that slides in with easing and a callout that appears on cue. This deck is where those pieces become a SYSTEM: slide 3 (the six components every consistent channel repeats), slide 7 (the one idea that makes Fusion's node graph click — it is not a layer stack), and slide 13 (real numbers from a Blender render that actually ran on this machine, not a description of what should happen) are the three worth returning to most.</p>
<p>Every free-vs-Studio claim on these slides was checked against blackmagicdesign.com in 09/2026 — including one dead end worth knowing about: the Fusion "Compare" page turned out to compare two PAID tiers against each other, not free vs. Studio, and almost made it into this deck before a second look caught it. The Blender numbers on slide 13 and the alpha-channel numbers on slide 6 were measured directly on this machine with ffmpeg/ffprobe and Blender's own command line, not estimated.</p></div>
<div class="ml-vi"><h2>📑 Chương 19 trong 16 slide</h2>
<p>Chương 16 và 17 đã cho bạn một lower third trượt vào có easing và một callout xuất hiện đúng lúc. Bộ slide này là chỗ những mảnh đó trở thành một HỆ THỐNG: slide 3 (sáu thành phần mọi kênh nhất quán đều lặp lại), slide 7 (đúng một ý tưởng làm cây node của Fusion "vỡ oà" — nó KHÔNG phải một chồng layer), và slide 13 (số đo thật từ một lượt render Blender chạy thật trên máy này, không phải mô tả lý thuyết) là ba slide đáng quay lại nhất.</p>
<p>Mọi khẳng định free-vs-Studio trên các slide này đã kiểm trên blackmagicdesign.com vào 09/2026 — kể cả một ngõ cụt đáng biết: trang "Compare" của Fusion hoá ra so sánh HAI BẢN ĐỀU TRẢ PHÍ với nhau, không phải free-vs-Studio, và suýt lọt vào bộ slide này trước khi bị phát hiện ở lượt đọc thứ hai. Số đo Blender ở slide 13 và số đo kênh alpha ở slide 6 được đo trực tiếp trên máy này bằng ffmpeg/ffprobe và dòng lệnh Blender thật, không phải ước lượng.</p></div>
${gallery('cr-19', SLIDES)}
`,
    },

    /* ─────────────────── 19.1 Motion graphics cho creator ─────────────────── */
    {
      title: '19.1 — Motion graphics for creators|||19.1 — Motion graphics cho creator',
      slug: 'cr-19-1-motion-graphics',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Hệ thống nhận diện chuyển động: 6 thành phần lặp lại trên mọi video, vùng an toàn & thời lượng end screen của YouTube, bảng công cụ (Resolve/CapCut/After Effects/Apple Motion), và xuất đồ hoạ có alpha đo thật bằng ffmpeg.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 19 · Lesson 19.1</span>
<h2>One lower third is a nice detail. Six repeated pieces are a channel people recognize in one second.</h2>
<p class="lead">Lesson 16.2 already made you pick one font and reuse it so a viewer could tell it was your channel "from the graphics alone, before they even process what the video is about." That was about text. This lesson takes the same idea and applies it to everything that moves on screen — and adds the one piece Lesson 16.2 never covered: the screen YouTube itself reserves for you at the very end of a video.</p>

<h3>Six components, one system</h3>
${slide('cr-19', 3, 'Hệ thống nhận diện chuyển động — các thành phần')}
<p>A <strong>motion identity</strong> is not one graphic — it is six recurring jobs, each solved once and reused: an <strong>intro/logo</strong> (3–5 seconds, opening every video — no longer, or it becomes the part viewers skip), a <strong>lower third</strong> (Lesson 16.2's name/title card), a <strong>chapter title</strong> (breaking a long video into named sections), a <strong>code callout</strong> (the arrow/box/zoom from Lesson 17.2, now treated as part of the same visual language), a <strong>progress bar or chapter indicator</strong>, and an <strong>end screen</strong> (this lesson's new piece, below). Treat all six as one job, not six separate ones: same font (Lesson 16.2's Be Vietnam Pro / Inter / Roboto — pick one), same small color palette, same easing curve (Lesson 17.2's ease in/out), same rough duration for anything that slides or fades. A channel that reuses these five decisions across every video is recognizable in about a second, scrolling a feed — exactly the shortcut Lesson 16.2 described, now scaled up.</p>

<h3>The end screen: YouTube's own reserved real estate</h3>
${slide('cr-19', 4, 'End screen: vùng phần tử & thời lượng (YouTube)')}
<p>An <strong>end screen</strong> occupies the <strong>last 5–20 seconds</strong> of a video and can hold up to <strong>four elements</strong> on a standard 16:9 video — a video or playlist recommendation, a subscribe button, and a channel or external link, arranged in the corners and lower-right the platform itself lays out for you. The video has to be <strong>at least 25 seconds long</strong> to get one at all (support.google.com/youtube/answer/6388789, checked 09/2026). The practical consequence for your motion graphics: whatever chapter-title or lower-third design you build in this lesson, keep it OUT of the bottom-right and corner zones during your last 20 seconds, or design your ending shot to leave that area clean on purpose. Fighting YouTube's own end-screen layout for screen space is a fight the platform always wins — it draws its own elements on top of yours.</p>

<h3>Which tool actually builds this</h3>
${slide('cr-19', 5, 'Công cụ dựng motion graphics — chọn cái nào')}
<table>
<tr><th>Tool</th><th>Platform</th><th>Price</th><th>Best for</th></tr>
<tr><td>Resolve Titles + Fusion Titles</td><td>Mac/Win/Linux — not on iPad (Lesson 13.4)</td><td>Free, already in Resolve</td><td>Everything in this chapter</td></tr>
<tr><td>CapCut Templates</td><td>Desktop and mobile</td><td>Free (mostly)</td><td>Short-form, fast turnaround — Lesson 12.3</td></tr>
<tr><td>Adobe After Effects</td><td>Windows, macOS</td><td>Subscription — price shifts with region/promo, verify at adobe.com before buying</td><td>Deep, industry-standard motion graphics</td></tr>
<tr><td>Apple Motion</td><td>macOS 15.6 or later</td><td>US$49.99, one-time (apps.apple.com, checked 09/2026)</td><td>Building templates for Final Cut Pro</td></tr>
</table>
<p>This course stays inside Resolve's Fusion page for one concrete reason: it is <strong>free</strong>, already installed, and — unlike After Effects or Apple Motion — the only one of the four that actually runs on <em>both</em> of your non-phone machines (Mac and, per Lesson 19.4, your home Linux box). After Effects pricing is genuinely unstable to quote as a fixed number: adobe.com showed a running promotional rate the day this was checked, alongside a commonly-reported standard single-app rate closer to US$23–35/month depending on whether you commit to a year — check the live price before you commit to a subscription, do not trust a number printed here.</p>

<h3>Exporting a graphic you can reuse — proven with real files, not a screenshot</h3>
${slide('cr-19', 6, 'Xuất đồ hoạ có nền trong suốt — đo thật trên máy này')}
<p>A motion graphic is only reusable if its background stays transparent when it leaves Resolve. The mechanism is an <strong>alpha channel</strong> — a fourth value per pixel (beyond red/green/blue) recording how see-through that pixel is. On Resolve's Deliver page, per Blackmagic's own user forum cross-checked against several independent tutorials: set Format to QuickTime, Codec to Apple ProRes 4444, and check <strong>Export Alpha</strong> — that checkbox only appears when the render is set to <strong>Individual Clips</strong> mode, not Single Clip, and you then choose between straight or premultiplied alpha.</p>
<p>This is not theoretical on this machine. A Blender text render (Lesson 19.4) was exported two ways with ffmpeg and measured with <code>ffprobe</code>: the same 2-second graphic as <strong>ProRes 422 HQ without alpha</strong> came out to <strong>11.76 MB</strong> (&#96;codec_tag apch&#96;, &#96;pix_fmt yuv422p10le&#96;); as <strong>ProRes 4444 with alpha</strong> it came out to <strong>19.31 MB</strong> (&#96;codec_tag ap4h&#96;, &#96;pix_fmt yuva444p12le&#96;) — about <strong>64% larger</strong> for the same two seconds, a real, measured cost of carrying transparency. Pulling a single frame back OUT of that alpha .mov file and sampling it confirmed the background pixel is still &#96;(0,0,0,0)&#96; and a letter pixel is still fully opaque — the alpha survived the round trip, not just claimed by a format tag.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — mistaking a composited preview for a reusable export.</strong> Overlaying your PNG onto a background clip with ffmpeg's &#96;overlay&#96; filter (or dragging a graphic onto a video track and watching it look right) produces an OPAQUE result — the alpha channel is gone, baked into whatever was behind it at that moment. That file is fine to preview or upload once, but it is not the reusable asset. The reusable one is the graphic exported ALONE, with Export Alpha checked, its background still &#96;(0,0,0,0)&#96; — confirmed by measurement on this machine, not by how it looks when placed once over one background.</p></div>
<p class="note-ct"><strong>Next:</strong> Lesson 19.2 opens the actual tool behind Resolve's Fusion Titles — node-based compositing, which works nothing like the layer stack CapCut or After Effects trained you on.</p>

<h3>🎬 Practice (20–25 minutes)</h3>
<div class="callout ok"><ol>
<li>Pick the font and color pair you already committed to in Chapter 16, and list all six motion-identity components above — mark which ones you already have and which are missing.</li>
<li>Open a video you have already edited and check its last 20 seconds against the end-screen zones on slide 4 — is anything you put there about to get covered by YouTube's own elements?</li>
<li>Export any graphic (a logo, a lower third) from Resolve's Deliver page as ProRes 4444 with Export Alpha checked, in Individual Clips mode.</li>
<li>Drag that export onto a totally different video's timeline on a track above the footage and confirm the background is genuinely see-through, not a solid color.</li>
</ol><p><strong>Done when:</strong> you can name your channel's font, palette, and easing curve in one sentence, and you have one graphic file on disk that is provably transparent — not just one that looked fine the one time you previewed it.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Motion identity</span><span class="v">The repeated font, palette, and timing decisions across all six moving-graphic components of a channel.</span></div>
  <div class="kv"><span class="k">End screen</span><span class="v">YouTube's reserved last 5–20 seconds of a video, up to 4 elements, video must be ≥25 seconds long.</span></div>
  <div class="kv"><span class="k">Alpha channel</span><span class="v">A fourth per-pixel value recording transparency, alongside red/green/blue.</span></div>
  <div class="kv"><span class="k">Export Alpha</span><span class="v">Resolve's Deliver-page checkbox that keeps transparency in the render — only visible in Individual Clips mode.</span></div>
  <div class="kv"><span class="k">ProRes 4444</span><span class="v">The ProRes variant that carries an alpha channel — confirmed by its &#96;ap4h&#96; codec tag, measured ~64% larger than the same clip without alpha.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A motion identity is six repeated components — intro/logo, lower third, chapter title, callout, progress bar, end screen — solved once with one font/palette/easing, not six separate designs.</li>
<li>YouTube's end screen reserves the last 5–20 seconds and up to 4 elements on a 16:9 video (video must be ≥25s) — design your ending shot to leave that space clean.</li>
<li>Resolve's Fusion Titles are free and the only tool here that runs on both your Mac and your Linux box; After Effects and Apple Motion are legitimate but cost real money and only run on Mac/Windows.</li>
<li>A transparent export is proven by measurement (Export Alpha, ProRes 4444, ~64% larger, alpha survives a round trip) — not by how a one-time composited preview happens to look.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/6388789" target="_blank" rel="noopener">YouTube Help — add end screens to videos (duration, element limits)</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 19 · Bài 19.1</span>
<h2>Một lower third đẹp là một chi tiết hay. Sáu thứ lặp lại đều là một kênh người xem nhận ra trong một giây.</h2>
<p class="lead">Bài 16.2 đã bắt bạn chọn MỘT font rồi dùng lại khắp nơi để người xem nhận ra đây là kênh của bạn "chỉ từ phần đồ hoạ, trước cả khi họ kịp hiểu video nói về gì." Đó là chuyện chữ. Bài này lấy đúng ý đó áp cho MỌI THỨ đang chuyển động trên hình — và thêm đúng một mảnh Bài 16.2 chưa nói tới: màn hình chính YouTube dành riêng cho bạn ở cuối video.</p>

<h3>Sáu thành phần, một hệ thống</h3>
${slide('cr-19', 3, 'Hệ thống nhận diện chuyển động — các thành phần')}
<p>Một <strong>hệ nhận diện chuyển động</strong> không phải MỘT đồ hoạ — nó là sáu việc lặp lại, mỗi việc giải quyết một lần rồi dùng lại: <strong>intro/logo</strong> (3–5 giây, mở đầu mọi video — không dài hơn, dài hơn là phần người xem tua qua), <strong>lower third</strong> (thẻ tên/chức danh của Bài 16.2), <strong>tiêu đề chương</strong> (chia video dài thành các đoạn có tên), <strong>callout code</strong> (mũi tên/khung/zoom của Bài 17.2, giờ coi là một phần của cùng ngôn ngữ hình ảnh), <strong>thanh tiến độ hoặc chỉ báo chương</strong>, và <strong>end screen</strong> (mảnh mới của bài này, ngay dưới). Coi cả sáu là MỘT việc, không phải sáu việc riêng: cùng một font (Be Vietnam Pro/Inter/Roboto của Bài 16.2 — chọn một), cùng một bảng màu nhỏ, cùng một đường easing (ease in/out của Bài 17.2), cùng một khoảng thời lượng cho bất cứ thứ gì trượt hoặc mờ dần. Một kênh dùng lại đúng năm quyết định này ở mọi video được nhận ra trong khoảng một giây khi ai đó lướt feed — đúng đường tắt Bài 16.2 đã mô tả, giờ mở rộng ra toàn bộ.</p>

<h3>End screen: khoảng đất riêng YouTube dành cho bạn</h3>
${slide('cr-19', 4, 'End screen: vùng phần tử & thời lượng (YouTube)')}
<p>Một <strong>end screen</strong> (màn hình kết thúc) chiếm <strong>5–20 giây cuối</strong> của video và chứa tối đa <strong>bốn phần tử</strong> trên video tỉ lệ chuẩn 16:9 — một video/playlist gợi ý, một nút đăng ký, và một kênh hoặc link ngoài, xếp ở các góc và phía dưới-phải mà chính nền tảng tự bố trí cho bạn. Video phải dài <strong>ít nhất 25 giây</strong> mới bật được end screen (support.google.com/youtube/answer/6388789, kiểm 09/2026). Hệ quả thực tế cho đồ hoạ chuyển động của bạn: bất kể tiêu đề chương hay lower third bạn dựng ở bài này trông ra sao, giữ nó TRÁNH XA vùng góc dưới-phải và các góc trong 20 giây cuối, hoặc cố tình dựng khung hình kết ở đó sạch sẽ. Tranh chỗ với bố cục end screen của chính YouTube là một trận bạn luôn thua — nó vẽ đè phần tử của nó lên trên phần tử của bạn.</p>

<h3>Công cụ nào thật sự dựng được việc này</h3>
${slide('cr-19', 5, 'Công cụ dựng motion graphics — chọn cái nào')}
<table>
<tr><th>Công cụ</th><th>Nền tảng</th><th>Giá</th><th>Hợp cho</th></tr>
<tr><td>Resolve Titles + Fusion Titles</td><td>Mac/Win/Linux — KHÔNG có trên iPad (Bài 13.4)</td><td>Miễn phí, có sẵn trong Resolve</td><td>Mọi thứ trong chương này</td></tr>
<tr><td>CapCut Templates</td><td>Máy tính & di động</td><td>Miễn phí (phần lớn)</td><td>Video ngắn, dựng nhanh — Bài 12.3</td></tr>
<tr><td>Adobe After Effects</td><td>Windows, macOS</td><td>Thuê bao — giá đổi theo khu vực/khuyến mãi, kiểm lại trên adobe.com trước khi mua</td><td>Motion graphics sâu, chuẩn ngành</td></tr>
<tr><td>Apple Motion</td><td>macOS 15.6 trở lên</td><td>49,99 USD, mua đứt 1 lần (apps.apple.com, kiểm 09/2026)</td><td>Dựng template cho Final Cut Pro</td></tr>
</table>
<p>Khoá này ở lại trong trang Fusion của Resolve vì một lý do cụ thể: nó <strong>miễn phí</strong>, đã cài sẵn, và — khác After Effects hay Apple Motion — là công cụ DUY NHẤT trong bốn cái chạy được trên CẢ HAI máy không-phải-điện-thoại của bạn (Mac, và theo Bài 19.4, cả máy Linux ở nhà). Giá After Effects thật sự không ổn định để in thành một con số cố định: adobe.com hiện giá khuyến mãi đang chạy đúng lúc kiểm, cạnh đó nhiều nguồn tổng hợp độc lập báo mức tiêu chuẩn cho gói đơn lẻ khoảng 23–35 USD/tháng tuỳ có cam kết năm hay không — kiểm giá thật trước khi đăng ký, đừng tin một con số in sẵn ở đây.</p>

<h3>Xuất một đồ hoạ dùng lại được — chứng minh bằng file thật, không phải ảnh chụp màn hình</h3>
${slide('cr-19', 6, 'Xuất đồ hoạ có nền trong suốt — đo thật trên máy này')}
<p>Một đồ hoạ chuyển động chỉ dùng lại được nếu nền của nó vẫn trong suốt sau khi rời khỏi Resolve. Cơ chế đó là <strong>kênh alpha</strong> — một giá trị thứ tư trên mỗi điểm ảnh (ngoài đỏ/xanh lá/xanh dương) ghi lại điểm đó trong suốt tới đâu. Trên trang Deliver của Resolve, theo đúng diễn đàn người dùng chính chủ của Blackmagic kiểm chéo với nhiều hướng dẫn độc lập: đặt Format là QuickTime, Codec là Apple ProRes 4444, và bật <strong>Export Alpha</strong> — ô này chỉ hiện ra khi chế độ render là <strong>Individual Clips</strong>, không phải Single Clip, rồi bạn chọn giữa alpha "straight" hoặc "premultiplied".</p>
<p>Đây không phải lý thuyết trên máy này. Một lượt render chữ Blender (Bài 19.4) được xuất hai cách bằng ffmpeg và đo bằng <code>ffprobe</code>: cùng một đồ hoạ 2 giây, bản <strong>ProRes 422 HQ không alpha</strong> ra <strong>11,76 MB</strong> (&#96;codec_tag apch&#96;, &#96;pix_fmt yuv422p10le&#96;); bản <strong>ProRes 4444 CÓ alpha</strong> ra <strong>19,31 MB</strong> (&#96;codec_tag ap4h&#96;, &#96;pix_fmt yuva444p12le&#96;) — nặng hơn khoảng <strong>64%</strong> cho đúng hai giây đó, một cái giá thật, đo được, của việc mang theo độ trong suốt. Kéo ngược MỘT khung ra khỏi chính file .mov có alpha đó và đo lại điểm ảnh xác nhận nền vẫn là &#96;(0,0,0,0)&#96; và một điểm ảnh trong chữ vẫn đặc hoàn toàn — alpha sống sót qua cả vòng, không chỉ là một nhãn định dạng tự nhận.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — nhầm một bản xem trước đã ghép với một bản xuất dùng lại được.</strong> Ghép PNG của bạn lên một clip nền bằng filter &#96;overlay&#96; của ffmpeg (hoặc kéo một đồ hoạ lên track video và thấy nó trông đúng) cho ra một kết quả ĐẶC — kênh alpha biến mất, bị "nướng" vào bất cứ thứ gì nằm phía sau lúc đó. File đó xem trước hoặc đăng một lần thì ổn, nhưng nó KHÔNG phải tài sản dùng lại được. Bản dùng lại được là đồ hoạ xuất RIÊNG, có bật Export Alpha, nền vẫn là &#96;(0,0,0,0)&#96; — xác nhận bằng đo đạc trên máy này, không phải bằng việc nó trông ra sao khi đặt một lần lên một nền.</p></div>
<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 19.2 mở đúng công cụ đứng sau Fusion Titles của Resolve — hợp thành theo node, hoạt động khác hẳn chồng layer mà CapCut hay After Effects đã tập cho bạn quen.</p>

<h3>🎬 Thực hành (20–25 phút)</h3>
<div class="callout ok"><ol>
<li>Lấy đúng font và cặp màu bạn đã chốt ở Chương 16, liệt kê đủ sáu thành phần nhận diện chuyển động ở trên — đánh dấu cái nào đã có, cái nào còn thiếu.</li>
<li>Mở một video bạn đã dựng, kiểm 20 giây cuối của nó với các vùng end screen ở slide 4 — có thứ gì bạn đặt ở đó sắp bị phần tử của YouTube che mất không?</li>
<li>Xuất một đồ hoạ bất kỳ (logo, lower third) từ trang Deliver của Resolve dạng ProRes 4444, bật Export Alpha, ở chế độ Individual Clips.</li>
<li>Kéo bản xuất đó lên timeline của một video HOÀN TOÀN KHÁC, ở một track trên cảnh quay, xác nhận nền thật sự trong suốt, không phải một màu đặc.</li>
</ol><p><strong>Đạt khi:</strong> bạn nói được font, bảng màu, và đường easing của kênh mình trong một câu, và có MỘT file đồ hoạ trên đĩa chứng minh được là trong suốt — không chỉ trông ổn đúng một lần bạn xem trước.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hệ nhận diện chuyển động</span><span class="v">Font, bảng màu, và nhịp chuyển động lặp lại xuyên suốt cả sáu thành phần đồ hoạ chuyển động của một kênh.</span></div>
  <div class="kv"><span class="k">End screen</span><span class="v">5–20 giây cuối video YouTube dành riêng, tối đa 4 phần tử, video phải dài ≥25 giây.</span></div>
  <div class="kv"><span class="k">Kênh alpha</span><span class="v">Giá trị thứ tư trên mỗi điểm ảnh ghi lại độ trong suốt, cạnh đỏ/xanh lá/xanh dương.</span></div>
  <div class="kv"><span class="k">Export Alpha</span><span class="v">Ô chọn trên trang Deliver của Resolve giữ lại độ trong suốt khi render — chỉ hiện ở chế độ Individual Clips.</span></div>
  <div class="kv"><span class="k">ProRes 4444</span><span class="v">Biến thể ProRes mang kênh alpha — xác nhận bằng codec tag &#96;ap4h&#96;, đo được nặng hơn ~64% so với cùng clip không alpha.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hệ nhận diện chuyển động là sáu thành phần lặp lại — intro/logo, lower third, tiêu đề chương, callout, thanh tiến độ, end screen — giải quyết một lần bằng một font/bảng màu/easing, không phải sáu thiết kế riêng.</li>
<li>End screen của YouTube dành riêng 5–20 giây cuối và tối đa 4 phần tử trên video 16:9 (video phải ≥25s) — dựng khung hình kết để chừa vùng đó sạch.</li>
<li>Fusion Titles của Resolve miễn phí và là công cụ duy nhất ở đây chạy được cả trên Mac lẫn máy Linux; After Effects và Apple Motion hợp lệ nhưng tốn tiền thật và chỉ chạy Mac/Windows.</li>
<li>Một bản xuất trong suốt được chứng minh bằng đo đạc (Export Alpha, ProRes 4444, nặng hơn ~64%, alpha sống sót qua một vòng) — không phải bằng việc một bản xem trước ghép một lần trông ra sao.</li>
</ul>
<div class="link-card"><a href="https://support.google.com/youtube/answer/6388789" target="_blank" rel="noopener">YouTube Help — thêm end screen vào video (thời lượng, giới hạn phần tử)</a></div>
</div>
`,
    },

    /* ─────────────────── 19.2 Fusion trong DaVinci Resolve ─────────────────── */
    {
      title: '19.2 — Fusion inside DaVinci Resolve|||19.2 — Fusion trong DaVinci Resolve',
      slug: 'cr-19-2-fusion-resolve',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Tư duy node (MediaIn → Background → Text+ → Transform → Merge → MediaOut) thay vì layer, bảng công cụ Fusion free vs chỉ Studio, và làm mẫu từng bước một lower third có keyframe, lưu thành Macro dùng lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 19 · Lesson 19.2</span>
<h2>A node is not a fancier layer — it is a different question entirely</h2>
<p class="lead">Chapter 13 told you to skip Fusion "for now." Chapter 18 borrowed its masking and tracking ideas from the Color page instead, and kept promising "Chapter 19 opens Fusion up properly." This is that chapter. The one idea that makes everything else click: a layer stack asks "what's on top of what," a node graph asks "what feeds into what" — and once that clicks, Text+, Merge, and Transform stop being mysterious buttons and become three answers to one question each.</p>

<h3>MediaIn to MediaOut — the chain, not the stack</h3>
${slide('cr-19', 7, 'Tư duy NODE của Fusion — khác layer của CapCut/After Effects')}
<p>Every Fusion composite starts at a <strong>MediaIn</strong> node (your footage, piped in from the Edit timeline) and ends at a <strong>MediaOut</strong> node (what gets handed back to that timeline). Everything between is a chain of small, single-purpose tools connected by visible lines: <strong>Background</strong> generates a flat color or gradient (often set fully transparent — the base a title sits on), <strong>Text+</strong> is Fusion's text generator — far more capable than a caption, with its own 3D extrude controls covered in Lesson 19.3, <strong>Transform</strong> moves/scales/rotates whatever feeds into it, and <strong>Merge</strong> is where two separate chains actually combine — one plugged into its Background input, another into its Foreground input.</p>
<p>Compare that to <strong>layers</strong> in CapCut or After Effects: stacking is TOP-TO-BOTTOM and fixed — whatever sits above covers whatever sits below, and an effect lives attached to one specific layer. In a node graph, the exact same Text+ node can feed into two different Merge nodes for two different outputs, and the visual result depends entirely on how the wires are drawn, not on some invisible vertical order. This is genuinely a different way of thinking, not a re-skin of the same idea — expect the first composite to feel slower than a CapCut edit, and expect it to get faster once "what feeds into what" replaces "what's on top."</p>

<h3>What is free, what needs Studio</h3>
${slide('cr-19', 8, 'Công cụ trang Fusion — free hay chỉ Studio')}
<p>The entire Fusion PAGE — the node graph itself — ships in the free edition of Resolve, at up to 16K×16K resolution, with Metal/CUDA/OpenCL GPU acceleration. Text+, Background, Merge, Transform, the mask tools from Lesson 18.1, the Tracker and Planar Tracker from Lesson 18.2 and 18.4's screen-swap technique, Delta Keyer and Ultra Keyer from Lesson 18.3, and even the basic 3D nodes covered in Lesson 19.3 are all free. What stays Studio-only inside Fusion: <strong>Camera Tracker</strong> (solving the camera's own 3D motion through a scene — already flagged in Lesson 18.2), <strong>Primatte 5</strong> keying, network rendering across multiple machines, and resolution above 16K. Saving a node cluster as a reusable <strong>Macro</strong> or Title template is free too — the payoff for everything you build this lesson.</p>
<div class="callout warn"><p>⚠️ One dead end worth naming: blackmagicdesign.com/products/fusion/compare looks like exactly the page that should answer "what's free," and it is not — it compares Fusion bundled inside <strong>Resolve Studio</strong> against the standalone <strong>Fusion Studio</strong> app, both of which cost money. The actual free-vs-Studio split above came from Fusion's own product page cross-checked against independent searches, not that comparison table.</p></div>

<h3>Worked example: a lower third with real keyframes, saved once</h3>
${slide('cr-19', 9, 'Làm mẫu từng bước: lower third trong Fusion')}
<ol>
<li>Add a <strong>Background</strong> node (fully transparent) and a <strong>Text+</strong> node — type the name/title using the font already locked in at Lesson 16.2. Text+ connects into Background's Foreground input.</li>
<li>Add a <strong>Merge</strong> node — plug your footage (MediaIn) into its Background input, and the Text+/Background cluster into its Foreground input. This is the exact point where the two chains combine into one image.</li>
<li>On a <strong>Transform</strong> node inserted before the Merge, keyframe Position from off-screen to its resting spot, and keyframe Opacity from 0 to 1 — the same keyframe concept from Lesson 17.2, just a different place to click.</li>
<li>Open the <strong>Spline Editor</strong>, right-click the final keyframe, and pick an easing curve (Ease Out) — Fusion's name for the exact "slow in, slow out" curve Lesson 17.2 already taught you to read.</li>
<li>Select the whole node cluster, right-click, <strong>Save As Macro</strong>. Next time, drag the macro in and just change the text — no rebuilding.</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>Trap — trying to do this on the iPad.</strong> DaVinci Resolve for iPad officially ships Cut, Color, Deliver, and Photo (Lesson 13.4) — <strong>not Fusion</strong>. Every step above needs the Mac. Plan lower-third and title work for when you are back at your desk, not mid-shoot on the iPad.</p></div>
<p class="note-ct"><strong>Next:</strong> Lesson 19.3 takes Text+'s extrude controls and Merge's compositing logic into an actual 3D space — Text3D, Camera3D, and the node that flattens a 3D scene back into the 2D image the Merge node above already knows how to combine.</p>

<h3>🎬 Practice (25–30 minutes)</h3>
<div class="callout ok"><ol>
<li>Build the five-step lower third above from scratch, on your own footage, using the font from Chapter 16.</li>
<li>Open the Spline Editor and confirm the curve shape matches "eased," not "linear," from Lesson 17.2's graph.</li>
<li>Save it as a Macro, then drag that exact macro onto a different clip and change only the text — time how much faster the second one is.</li>
<li>Trace the wires in your finished node tree out loud: which node feeds which, and where do the two separate chains (footage, text) actually meet?</li>
</ol><p><strong>Done when:</strong> you can point at any node in your tree and say what feeds into it and what it feeds into next — not just what it looks like.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Node graph</span><span class="v">A chain of connected, single-purpose tools — asks "what feeds into what," not "what's on top."</span></div>
  <div class="kv"><span class="k">MediaIn / MediaOut</span><span class="v">The start and end points of a Fusion composite, connecting it back to the Edit timeline.</span></div>
  <div class="kv"><span class="k">Merge</span><span class="v">The node where two separate chains (e.g. footage and a title) actually combine into one image.</span></div>
  <div class="kv"><span class="k">Spline Editor</span><span class="v">Fusion's curve editor for keyframes — same easing concept as Lesson 17.2, different name and location.</span></div>
  <div class="kv"><span class="k">Macro</span><span class="v">A saved cluster of nodes, reusable across a whole series without rebuilding.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A node graph is a different question than a layer stack: "what feeds into what," not "what sits on top" — the same Text+ can feed multiple Merges.</li>
<li>MediaIn → Background/Text+/Transform → Merge → MediaOut is the basic chain; Merge is where two separate chains actually combine.</li>
<li>Text+, Merge, Transform, mask tools, Tracker/Planar Tracker, Delta/Ultra Keyer, and basic 3D nodes are all free; Camera Tracker, Primatte 5, network rendering, and >16K resolution need Fusion Studio.</li>
<li>Build a lower third once — Background, Text+, Merge, keyframed Transform, eased in the Spline Editor — then Save As Macro so every future video reuses it instead of rebuilding it.</li>
<li>Fusion does not exist on DaVinci Resolve for iPad — this entire lesson is Mac-only work.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/fusion" target="_blank" rel="noopener">Blackmagic Design — DaVinci Resolve Fusion page</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 19 · Bài 19.2</span>
<h2>Node không phải một layer "xịn hơn" — nó là một câu hỏi hoàn toàn khác</h2>
<p class="lead">Chương 13 đã bảo bạn bỏ qua Fusion "trước đã". Chương 18 mượn ý tưởng mask và tracking của nó từ trang Color thay thế, và cứ hứa mãi "Chương 19 sẽ mở Fusion ra đàng hoàng." Đây chính là chương đó. Đúng một ý tưởng làm mọi thứ khác "vỡ oà": một chồng layer hỏi "cái gì nằm TRÊN cái gì," một cây node hỏi "cái gì CHẢY VÀO cái gì" — một khi hiểu điều đó, Text+, Merge, và Transform thôi là những nút bí ẩn và trở thành ba câu trả lời cho một câu hỏi mỗi cái.</p>

<h3>Từ MediaIn tới MediaOut — một chuỗi, không phải một chồng</h3>
${slide('cr-19', 7, 'Tư duy NODE của Fusion — khác layer của CapCut/After Effects')}
<p>Mọi composite trong Fusion bắt đầu ở node <strong>MediaIn</strong> (cảnh quay của bạn, dẫn vào từ timeline Edit) và kết thúc ở node <strong>MediaOut</strong> (thứ được trả lại cho timeline đó). Mọi thứ ở giữa là một chuỗi công cụ nhỏ, mỗi cái đúng một việc, nối nhau bằng dây nhìn thấy được: <strong>Background</strong> sinh ra một màu phẳng hoặc gradient (thường đặt trong suốt hoàn toàn — nền để một tiêu đề đứng lên trên), <strong>Text+</strong> là bộ sinh chữ của Fusion — mạnh hơn một dòng phụ đề nhiều, có cả bộ điều khiển đùn nổi 3D riêng nói ở Bài 19.3, <strong>Transform</strong> di chuyển/co giãn/xoay bất cứ thứ gì chảy vào nó, và <strong>Merge</strong> là chỗ HAI chuỗi riêng biệt thật sự CHỒNG LẠI với nhau — một cắm vào đầu Background của nó, một cắm vào đầu Foreground.</p>
<p>So với <strong>layer</strong> trong CapCut hay After Effects: xếp chồng theo TRÊN-DƯỚI cố định — cái nằm trên che cái nằm dưới, và một hiệu ứng gắn chết vào một layer cụ thể. Trong một cây node, ĐÚNG một node Text+ nối được vào HAI node Merge khác nhau cho hai kết quả khác nhau, và kết quả nhìn thấy phụ thuộc hoàn toàn vào cách dây được vẽ, không phải một thứ tự trên-dưới vô hình nào đó. Đây thật sự là một cách nghĩ khác, không phải cùng một ý tưởng đổi lớp vỏ — cứ chờ composite đầu tiên cảm giác chậm hơn một lượt dựng CapCut, và chờ nó nhanh lên khi "cái gì chảy vào cái gì" thay thế "cái gì nằm trên."</p>

<h3>Cái gì miễn phí, cái gì cần Studio</h3>
${slide('cr-19', 8, 'Công cụ trang Fusion — free hay chỉ Studio')}
<p>TOÀN BỘ TRANG Fusion — chính cây node đó — có trong bản Resolve miễn phí, tới độ phân giải 16K×16K, tăng tốc GPU bằng Metal/CUDA/OpenCL. Text+, Background, Merge, Transform, các công cụ mask ở Bài 18.1, Tracker và Planar Tracker ở Bài 18.2 và kỹ thuật thay màn hình ở 18.4, Delta Keyer và Ultra Keyer ở Bài 18.3, và cả những node 3D cơ bản nói ở Bài 19.3 — TẤT CẢ đều miễn phí. Thứ vẫn chỉ Studio bên trong Fusion: <strong>Camera Tracker</strong> (dựng lại chính chuyển động 3D của máy quay qua một cảnh — đã nói ở Bài 18.2), key <strong>Primatte 5</strong>, render mạng qua nhiều máy, và độ phân giải trên 16K. Lưu một cụm node thành <strong>Macro</strong> hay template Title dùng lại cũng miễn phí — phần thưởng cho mọi thứ bạn dựng ở bài này.</p>
<div class="callout warn"><p>⚠️ Một ngõ cụt đáng nêu tên: blackmagicdesign.com/products/fusion/compare trông đúng như trang trả lời "cái gì miễn phí," và KHÔNG PHẢI — nó so sánh Fusion đóng gói bên trong <strong>Resolve Studio</strong> với app <strong>Fusion Studio</strong> độc lập, CẢ HAI đều tốn tiền. Đường phân định free-vs-Studio thật sự ở trên đến từ trang sản phẩm Fusion kiểm chéo với các tìm kiếm độc lập, không phải bảng so sánh đó.</p></div>

<h3>Làm mẫu: một lower third có keyframe thật, lưu một lần</h3>
${slide('cr-19', 9, 'Làm mẫu từng bước: lower third trong Fusion')}
<ol>
<li>Thêm node <strong>Background</strong> (trong suốt hoàn toàn) và node <strong>Text+</strong> — gõ tên/chức danh bằng đúng font đã chốt ở Bài 16.2. Text+ nối vào đầu Foreground của Background.</li>
<li>Thêm node <strong>Merge</strong> — cắm cảnh quay (MediaIn) vào đầu Background của nó, cắm cụm Text+/Background vào đầu Foreground. Đây chính xác là chỗ hai chuỗi chồng lại thành MỘT ảnh.</li>
<li>Trên node <strong>Transform</strong> chèn trước Merge, keyframe Position từ ngoài khung tới vị trí dừng, và keyframe Opacity từ 0 tới 1 — đúng khái niệm keyframe của Bài 17.2, chỉ khác nơi bấm.</li>
<li>Mở <strong>Spline Editor</strong>, chuột phải điểm keyframe cuối, chọn một đường easing (Ease Out) — tên gọi của Fusion cho đúng đường cong "slow in, slow out" Bài 17.2 đã dạy bạn đọc.</li>
<li>Chọn cả cụm node, chuột phải, <strong>Save As Macro</strong>. Lần sau chỉ kéo macro vào và đổi chữ — không dựng lại từ đầu.</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — cố làm việc này trên iPad.</strong> DaVinci Resolve for iPad chính thức có Cut, Color, Deliver, và Photo (Bài 13.4) — <strong>KHÔNG có Fusion</strong>. Mọi bước ở trên cần Mac. Lên kế hoạch làm lower third/title lúc về bàn làm việc, không phải giữa buổi quay trên iPad.</p></div>
<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 19.3 đưa bộ điều khiển đùn nổi của Text+ và logic hợp thành của Merge vào một không gian 3D thật sự — Text3D, Camera3D, và node "làm phẳng" một cảnh 3D trở lại thành ảnh 2D mà chính node Merge ở trên đã biết cách chồng.</p>

<h3>🎬 Thực hành (25–30 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng đúng lower third 5 bước ở trên từ đầu, trên cảnh quay của chính bạn, dùng font của Chương 16.</li>
<li>Mở Spline Editor và xác nhận hình dạng đường cong khớp "easing," không phải "tuyến tính," theo đồ thị của Bài 17.2.</li>
<li>Lưu thành Macro, rồi kéo đúng macro đó lên một clip khác và chỉ đổi chữ — tính xem lần thứ hai nhanh hơn bao nhiêu.</li>
<li>Đọc thành lời từng dây trong cây node vừa dựng: node nào chảy vào node nào, và hai chuỗi riêng biệt (cảnh quay, chữ) thật sự gặp nhau ở đâu?</li>
</ol><p><strong>Đạt khi:</strong> bạn chỉ được vào bất kỳ node nào trong cây và nói được cái gì chảy vào nó, nó chảy tiếp vào đâu — không chỉ nó trông ra sao.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cây node</span><span class="v">Một chuỗi công cụ nối nhau, mỗi cái đúng một việc — hỏi "cái gì chảy vào cái gì," không phải "cái gì nằm trên."</span></div>
  <div class="kv"><span class="k">MediaIn / MediaOut</span><span class="v">Điểm đầu và điểm cuối của một composite Fusion, nối nó trở lại timeline Edit.</span></div>
  <div class="kv"><span class="k">Merge</span><span class="v">Node nơi hai chuỗi riêng biệt (vd cảnh quay và một tiêu đề) thật sự chồng lại thành một ảnh.</span></div>
  <div class="kv"><span class="k">Spline Editor</span><span class="v">Bộ chỉnh đường cong keyframe của Fusion — cùng khái niệm easing của Bài 17.2, khác tên và vị trí.</span></div>
  <div class="kv"><span class="k">Macro</span><span class="v">Một cụm node đã lưu, dùng lại cho cả series mà không phải dựng lại.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cây node là một câu hỏi khác chồng layer: "cái gì chảy vào cái gì," không phải "cái gì nằm trên" — cùng một Text+ nối được vào nhiều Merge.</li>
<li>MediaIn → Background/Text+/Transform → Merge → MediaOut là chuỗi cơ bản; Merge là chỗ hai chuỗi riêng biệt thật sự chồng lại.</li>
<li>Text+, Merge, Transform, công cụ mask, Tracker/Planar Tracker, Delta/Ultra Keyer, và node 3D cơ bản đều miễn phí; Camera Tracker, Primatte 5, render mạng, và độ phân giải >16K cần Fusion Studio.</li>
<li>Dựng một lower third một lần — Background, Text+, Merge, Transform có keyframe, easing trong Spline Editor — rồi Save As Macro để mọi video sau dùng lại thay vì dựng lại.</li>
<li>Fusion không tồn tại trên DaVinci Resolve for iPad — cả bài này là việc chỉ làm được trên Mac.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/fusion" target="_blank" rel="noopener">Blackmagic Design — trang Fusion của DaVinci Resolve</a></div>
</div>
`,
    },

    /* ─────────────────── 19.3 3D trong Fusion ─────────────────── */
    {
      title: '19.3 — 3D inside Fusion|||19.3 — Không gian 3D trong Fusion',
      slug: 'cr-19-3-3d-trong-fusion',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Text3D, Shape3D, Camera3D, đèn, Merge3D và Renderer3D — 4 node hội tụ thành một cảnh 3D đơn giản, đủ cho chữ/logo 3D có ánh sáng và camera chuyển động, và biết chính xác khi nào KHÔNG đủ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 19 · Lesson 19.3</span>
<h2>Four nodes converge into one scene — that is the whole idea of Fusion's 3D space</h2>
<p class="lead">Lesson 19.2's Merge node combines two flat, 2D chains. Fusion's 3D space runs the exact same logic one dimension up: several 3D things converge into one 3D scene, which then gets flattened back to 2D for the Merge node you already know how to use. This lesson is short on purpose — Fusion 3D solves one specific job well (simple 3D text and logos) and Lesson 19.4 exists precisely because it does not try to solve every job.</p>

<h3>Five node types, one convergence point</h3>
${slide('cr-19', 10, 'Không gian 3D của Fusion: 4 node hội tụ về MỘT cảnh')}
<p><strong>Text3D</strong> generates actual 3D text geometry — not Text+'s flat text pushed toward the camera, but real depth, with its own extrude and bevel controls. <strong>Shape3D</strong> generates basic 3D geometry: cubes, spheres, cylinders, image planes — useful as a simple animated backdrop behind a title. <strong>Camera3D</strong> defines a viewpoint that can move through the scene, the same "camera" concept from every shooting chapter, just virtual. A light (Spot, Point, or Directional) shapes how everything else looks. All of these feed into <strong>Merge3D</strong>, which — exactly like the 2D Merge node — is where separate pieces actually combine, here accepting unlimited objects, lights, and cameras into one scene. <strong>Renderer3D</strong> is the last step: it flattens that 3D scene back into a normal 2D image, which then plugs into an ordinary 2D Merge node to sit on top of your footage.</p>
<p>All five node types — Text3D, Shape3D, Camera3D, Merge3D, Renderer3D — are free in every edition of Resolve, same as the rest of the Fusion page (Lesson 19.2). A minimal 3D logo: Text3D with extrude, one light, one Camera3D given a slow keyframed rotation around the text, both feeding Merge3D, then Renderer3D, then an ordinary Merge over your footage — the same five-node shape covered in Lesson 19.2's worked example, just with 3D nodes standing in for Background and Text+.</p>

<h3>Where this genuinely stops being enough</h3>
${slide('cr-19', 11, 'Fusion 3D: đủ dùng cho creator, KHÔNG thay phần mềm 3D thật')}
<p>Fusion's 3D space is real 3D — not a trick — but it was built for compositing simple elements into footage, not for building a 3D world from scratch. It does not model detailed objects (characters, complex products), does not do deep physically-based lighting (full path tracing, global illumination), has no rigging or character animation, and has none of the add-on/model ecosystem a dedicated 3D tool has. What it IS genuinely good for: a text or logo with light and a moving camera, running for 3–5 seconds, without leaving the software you are already editing in — no export, no import, no second app to learn just for an intro. On a Mac M1 Max, this stays smooth thanks to the same GPU acceleration (Lesson 19.2) the rest of Fusion uses.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — pushing Fusion 3D past what it is for.</strong> The moment a project needs a rigged character, a physically accurate material, or genuine global illumination, more time fighting Fusion's 3D tools toward that goal is time not spent recognizing the actual answer: a dedicated 3D tool. Lesson 19.4 is that tool — free, and built for exactly the jobs this lesson's Fusion 3D space was never meant to do.</p></div>
<p class="note-ct"><strong>Next:</strong> Lesson 19.4 opens Blender — free, open source, and the tool to reach for the moment "simple 3D text with a light and a moving camera" stops being enough.</p>

<h3>🎬 Practice (15–20 minutes)</h3>
<div class="callout ok"><ol>
<li>Build the five-node chain from slide 10 yourself: Text3D + one light + Camera3D → Merge3D → Renderer3D → ordinary Merge over any clip.</li>
<li>Keyframe the Camera3D's rotation slowly around the text and confirm the light stays fixed relative to the text, not the camera — that is what makes it read as one solid 3D object.</li>
<li>Time how long the render takes on your Mac — this is the number to compare against Lesson 19.4's real Blender measurement.</li>
<li>Write one sentence: for YOUR channel's intro, is Fusion 3D actually enough, or do you already know you need Blender?</li>
</ol><p><strong>Done when:</strong> you can name, without looking, which of the five node types (Text3D/Shape3D/Camera3D/Merge3D/Renderer3D) does which job.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Text3D</span><span class="v">Generates real 3D text geometry with its own extrude/bevel, unlike flat Text+.</span></div>
  <div class="kv"><span class="k">Shape3D</span><span class="v">Generates basic 3D geometry — cubes, spheres, cylinders, image planes.</span></div>
  <div class="kv"><span class="k">Camera3D</span><span class="v">A virtual camera defining the viewpoint into the 3D scene, keyframeable like any other node.</span></div>
  <div class="kv"><span class="k">Merge3D</span><span class="v">Combines unlimited 3D objects, lights, and cameras into one scene — the 3D counterpart of Merge.</span></div>
  <div class="kv"><span class="k">Renderer3D</span><span class="v">Flattens the 3D scene back into a 2D image for an ordinary Merge node.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Text3D, Shape3D, Camera3D, and a light all feed into Merge3D — exactly the same convergence idea as the 2D Merge from Lesson 19.2, one dimension up.</li>
<li>Renderer3D flattens the 3D scene back to 2D, which plugs into an ordinary Merge over your footage — all five node types are free.</li>
<li>Fusion 3D is genuinely good for simple 3D text/logos with light and camera motion — it does not replace detailed modeling, physical rendering, rigging, or a real 3D asset ecosystem.</li>
<li>Runs smoothly on a Mac M1 Max thanks to the same GPU acceleration as the rest of Fusion; the moment the job outgrows this, Lesson 19.4's Blender is the honest next step.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/fusion" target="_blank" rel="noopener">Blackmagic Design — DaVinci Resolve Fusion page</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 19 · Bài 19.3</span>
<h2>Bốn node hội tụ về MỘT cảnh — đó là toàn bộ ý tưởng của không gian 3D trong Fusion</h2>
<p class="lead">Node Merge của Bài 19.2 chồng hai chuỗi 2D phẳng lại với nhau. Không gian 3D của Fusion chạy đúng logic đó, chỉ thêm một chiều: vài thứ 3D hội tụ về MỘT cảnh 3D, rồi cảnh đó được làm phẳng trở lại 2D cho đúng node Merge bạn đã biết dùng. Bài này ngắn có chủ đích — Fusion 3D giải quyết TỐT đúng một việc cụ thể (chữ/logo 3D đơn giản), và Bài 19.4 tồn tại chính vì nó không cố giải quyết mọi việc.</p>

<h3>Năm loại node, một điểm hội tụ</h3>
${slide('cr-19', 10, 'Không gian 3D của Fusion: 4 node hội tụ về MỘT cảnh')}
<p><strong>Text3D</strong> sinh ra hình học chữ 3D thật — không phải chữ phẳng của Text+ đẩy về phía camera, mà có độ sâu thật, với bộ điều khiển đùn nổi (extrude) và bo cạnh (bevel) riêng. <strong>Shape3D</strong> sinh hình học 3D cơ bản: khối lập phương, cầu, trụ, mặt phẳng ảnh — hữu ích làm nền động đơn giản phía sau một tiêu đề. <strong>Camera3D</strong> định nghĩa một góc nhìn có thể di chuyển xuyên qua cảnh, đúng khái niệm "camera" của mọi chương quay phim, chỉ là ảo. Một đèn (Spot, Point, hoặc Directional) định hình mọi thứ còn lại trông ra sao. Tất cả những thứ này chảy vào <strong>Merge3D</strong>, và — đúng như node Merge 2D — đây là chỗ các mảnh riêng biệt thật sự chồng lại, ở đây nhận không giới hạn vật thể, đèn, và camera vào một cảnh. <strong>Renderer3D</strong> là bước cuối: nó làm phẳng cảnh 3D đó trở lại thành một ảnh 2D bình thường, rồi ảnh đó cắm vào một node Merge 2D thông thường để nằm lên trên cảnh quay của bạn.</p>
<p>Cả năm loại node — Text3D, Shape3D, Camera3D, Merge3D, Renderer3D — đều MIỄN PHÍ ở mọi bản Resolve, giống phần còn lại của trang Fusion (Bài 19.2). Một logo 3D tối giản: Text3D có extrude, một đèn, một Camera3D được keyframe xoay chậm quanh chữ, cả hai chảy vào Merge3D, rồi Renderer3D, rồi một node Merge thông thường lên trên cảnh quay — đúng hình dạng năm-node của ví dụ làm mẫu ở Bài 19.2, chỉ khác là node 3D thay chỗ cho Background và Text+.</p>

<h3>Chỗ nó thật sự không đủ nữa</h3>
${slide('cr-19', 11, 'Fusion 3D: đủ dùng cho creator, KHÔNG thay phần mềm 3D thật')}
<p>Không gian 3D của Fusion là 3D thật — không phải một mẹo vặt — nhưng nó được dựng để ghép các phần tử đơn giản vào cảnh quay, không phải để dựng cả một thế giới 3D từ đầu. Nó không mô hình hoá vật thể chi tiết (nhân vật, sản phẩm phức tạp), không có ánh sáng vật lý sâu (path tracing đầy đủ, global illumination), không có rigging hay hoạt hình nhân vật, và không có hệ sinh thái add-on/model như một phần mềm 3D chuyên dụng. Thứ nó THẬT SỰ tốt: một chữ hoặc logo có ánh sáng và camera di chuyển, chạy 3–5 giây, mà không phải rời khỏi phần mềm bạn đang dựng — khỏi export, khỏi import, khỏi học thêm một app thứ hai chỉ để làm một intro. Trên Mac M1 Max, việc này vẫn mượt nhờ đúng cơ chế tăng tốc GPU (Bài 19.2) mà phần còn lại của Fusion dùng.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — ép Fusion 3D làm việc nó không sinh ra để làm.</strong> Ngay khoảnh khắc một dự án cần một nhân vật có rig, một vật liệu chính xác về vật lý, hay global illumination thật sự, càng nhiều thời gian vật lộn với công cụ 3D của Fusion để tới đích đó càng là thời gian không dùng để nhận ra câu trả lời thật: một công cụ 3D chuyên dụng. Bài 19.4 chính là công cụ đó — miễn phí, và dựng ra đúng cho những việc không gian 3D của Fusion ở bài này chưa bao giờ được sinh ra để làm.</p></div>
<p class="note-ct"><strong>Nối với bài sau:</strong> Bài 19.4 mở Blender — miễn phí, mã nguồn mở, và là công cụ để tìm tới ngay khoảnh khắc "chữ 3D đơn giản có đèn và camera di chuyển" không còn đủ nữa.</p>

<h3>🎬 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Tự dựng chuỗi năm node ở slide 10: Text3D + một đèn + Camera3D → Merge3D → Renderer3D → Merge thông thường lên trên một clip bất kỳ.</li>
<li>Keyframe Camera3D xoay chậm quanh chữ, xác nhận đèn đứng yên SO VỚI CHỮ, không phải so với camera — đó chính là điều làm nó đọc ra như một vật thể 3D đặc, không phải một ảnh phẳng dán.</li>
<li>Đo thời gian render trên Mac của bạn — đây là con số để so với số đo Blender thật ở Bài 19.4.</li>
<li>Viết một câu: với intro của kênh BẠN, Fusion 3D có thật sự đủ, hay bạn đã biết mình cần Blender?</li>
</ol><p><strong>Đạt khi:</strong> bạn nói được, không cần nhìn lại, trong năm loại node (Text3D/Shape3D/Camera3D/Merge3D/Renderer3D) cái nào làm việc gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Text3D</span><span class="v">Sinh hình học chữ 3D thật, có extrude/bevel riêng, khác Text+ phẳng.</span></div>
  <div class="kv"><span class="k">Shape3D</span><span class="v">Sinh hình học 3D cơ bản — khối lập phương, cầu, trụ, mặt phẳng ảnh.</span></div>
  <div class="kv"><span class="k">Camera3D</span><span class="v">Camera ảo định nghĩa góc nhìn vào cảnh 3D, keyframe được như mọi node khác.</span></div>
  <div class="kv"><span class="k">Merge3D</span><span class="v">Gộp không giới hạn vật thể, đèn, camera 3D vào một cảnh — bản 3D của Merge.</span></div>
  <div class="kv"><span class="k">Renderer3D</span><span class="v">Làm phẳng cảnh 3D trở lại thành ảnh 2D cho một node Merge thông thường.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Text3D, Shape3D, Camera3D, và một đèn đều chảy vào Merge3D — đúng ý tưởng hội tụ của Merge 2D ở Bài 19.2, thêm một chiều.</li>
<li>Renderer3D làm phẳng cảnh 3D trở lại 2D, cắm vào một Merge thông thường lên trên cảnh quay — cả năm loại node đều miễn phí.</li>
<li>Fusion 3D thật sự tốt cho chữ/logo 3D đơn giản có ánh sáng và camera chuyển động — nó không thay được mô hình hoá chi tiết, render vật lý, rigging, hay một hệ sinh thái tài sản 3D thật.</li>
<li>Chạy mượt trên Mac M1 Max nhờ đúng cơ chế tăng tốc GPU của phần còn lại Fusion dùng; ngay khi việc vượt quá mức này, Blender ở Bài 19.4 là bước tiếp theo trung thực.</li>
</ul>
<div class="link-card"><a href="https://www.blackmagicdesign.com/products/davinciresolve/fusion" target="_blank" rel="noopener">Blackmagic Design — trang Fusion của DaVinci Resolve</a></div>
</div>
`,
    },

    /* ─────────────────── 19.4 Blender cho creator ─────────────────── */
    {
      title: '19.4 — Blender for creators|||19.4 — Blender cho creator',
      slug: 'cr-19-4-blender-cho-creator',
      type: 'VIDEO',
      isFreePreview: true,
      description: 'Blender miễn phí mã nguồn mở: quy trình logo 3D → PNG/EXR alpha → ghép Resolve, camera tracking ở mức quy trình, số đo THẬT trên Mac M1 Max (Cycles GPU Metal), và cú pháp dòng lệnh render trên máy Linux RTX 3060.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 19 · Lesson 19.4</span>
<h2>The same text-extrude-bevel-light-camera recipe from Lesson 19.3 — a real render, real numbers, this machine</h2>
<p class="lead">Lesson 19.3 ended honestly: Fusion's 3D space does not replace a real 3D tool. <strong>Blender</strong> is that tool — free, open source, and the same core recipe you already know (text, extrude, bevel, one light, one camera) but with the full depth of a dedicated 3D application behind it. This lesson does something the rest of this chapter mostly described: it actually ran the render, on this machine, and every number below came from that run.</p>

<h3>What runs where — checked against blender.org</h3>
<p>On <strong>macOS</strong>, Blender accelerates with <strong>Metal</strong> on Apple Silicon. On <strong>Linux</strong> with an NVIDIA GPU, it accelerates with <strong>CUDA</strong> (compute capability 5.0 or higher) or <strong>OptiX</strong> (same 5.0+ requirement, plus a driver version of at least 575, using the RTX hardware ray-tracing your home machine's card has). Your Mac M1 Max and your home Linux box with an RTX 3060 both qualify (blender.org/download/requirements, checked 09/2026 — the page itself sits behind a Cloudflare "Verify you are human" challenge that was not clicked through; these figures come from search results that quote the page directly, not a guess).</p>

<h3>The workflow: logo in Blender, alpha out, composited in Resolve</h3>
${slide('cr-19', 12, 'Blender cho creator — quy trình logo/chữ 3D → ghép Resolve')}
<p>Build the text/logo (Text object → Extrude + Bevel, a material, a light, a camera) — this is genuinely the same idea as Lesson 19.3's Fusion recipe, just with Blender's much deeper material and lighting system behind it. If the 3D element needs to sit convincingly inside real footage (not just as a floating title), Blender's <strong>Movie Clip Editor</strong> can track your footage's own camera motion and hand that motion to a virtual Blender camera — at a process level for this course, the same idea as Lesson 18.2's Camera Tracker, just running in a different application. Then render, with <strong>Film Transparent</strong> switched on, to PNG or EXR — a single frame or a full sequence — and bring that into Resolve exactly like Lesson 19.1's alpha-export workflow: as a layer on its own track, composited over real footage.</p>

<h3>A real render on this machine — not a description</h3>
${slide('cr-19', 13, 'Render chữ 3D THẬT trên máy này (Mac M1 Max)')}
<p>A small Python script built the scene from scratch — no pre-made file — using Blender's own API: a Text object reading "cuongthai" with &#96;extrude=0.06&#96; and &#96;bevel_depth=0.015&#96;, a gold Principled BSDF material, exactly ONE Area light, exactly ONE camera, and &#96;film_transparent = True&#96;. Run as:</p>
<pre><code class="language-bash">blender -b -P tao-chu-3d.py -- out.png</code></pre>
<p>Blender auto-detected and used <strong>GPU (Metal)</strong> for Cycles, at 128 samples, 1280×720. Timed with &#96;/usr/bin/time -p&#96;: <strong>real 4.67 seconds</strong> — that number includes Blender's own startup, not just the render itself. The output file: <strong>356,728 bytes</strong> (~349 KB), confirmed as a genuine RGBA PNG by reading its own header bytes (PNG color type 6). Sampling actual pixels with Pillow proved the transparency is real, not assumed: the background corner is &#96;(0, 0, 0, 0)&#96;, a pixel deep inside a letter is &#96;(171, 128, 46, 255)&#96; — fully opaque — and a pixel right on a letter's edge came back &#96;(184, 145, 81, 207)&#96; — a genuine partial-alpha antialiasing gradient, not a hard on/off mask.</p>
<div class="callout ok"><p>This is exactly the file measured in Lesson 19.1's alpha-export comparison — the same PNG, held for 2 seconds and exported both with and without an alpha channel to produce the 19.31 MB vs 11.76 MB ProRes numbers there.</p></div>

<h3>The same job on the Linux machine — syntax only, not run here</h3>
${slide('cr-19', 14, 'Render trên máy Linux (RTX 3060) — cú pháp CHƯA chạy ở đây')}
<p>Per the Blender Manual's Command Line Arguments and Command Line Rendering pages (checked twice independently, both agreeing): background mode is &#96;-b&#96; (or &#96;--background&#96;), running a Python script is &#96;-P&#96; (or &#96;--python&#96;) followed by the file, output path is &#96;-o&#96;, format is &#96;-F&#96;, and a single frame is &#96;-f &lt;n&gt;&#96; while a full animation is &#96;-a&#96;. Choosing the render device is &#96;--cycles-device&#96; with one of &#96;CPU&#96;/&#96;CUDA&#96;/&#96;OPTIX&#96;/&#96;HIP&#96;/&#96;ONEAPI&#96;/&#96;METAL&#96; — and per the manual, Cycles-specific options like this one must come <strong>after a &#96;--&#96; separator at the very end of the command line</strong>, not mixed in with Blender's own arguments. On the RTX 3060, OptiX is the right first choice:</p>
<pre><code class="language-bash">nvidia-smi --query-gpu=memory.used,memory.total --format=csv
blender -b logo-3d.blend -o //render/khung_##### -F PNG -f 1 -- --cycles-device OPTIX</code></pre>
<p>This command has <strong>not been run on the Linux machine</strong> — no SSH into it from this lesson, matching this course's standing rule from Lesson 11.2 about not reaching into that machine from inside a lesson without a specific, direct reason. What IS a real, measured number: on <strong>22/09/2026</strong>, a resident background service on that machine was found occupying roughly <strong>11 of its 12 GB of VRAM</strong> at peak. Check &#96;nvidia-smi&#96; BEFORE rendering — if the service is running, either stop it temporarily or fall back to &#96;--cycles-device CPU&#96;, slower but not fighting the other service for the same memory.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — assuming the GPU is free because the render command looks correct.</strong> A syntactically perfect &#96;--cycles-device OPTIX&#96; command still fails or crawls if another process already holds most of the VRAM — the command has no way to know that on its own. &#96;nvidia-smi&#96; first, every time, is the actual habit; a command that "should work" is not the same claim as a command that was checked against what else is running.</p></div>
<p class="note-ct"><strong>Chapter complete.</strong> From a lower third that eases into frame (19.1–19.2) to a 3D logo rendered by a real GPU on this machine (19.3–19.4) — Chapter 20 moves from graphics into a different problem entirely: cutting for vertical short-form video.</p>

<h3>🎬 Practice (20–30 minutes, Blender required)</h3>
<div class="callout ok"><ol>
<li>If Blender is installed: build a 3D text object with Extrude + Bevel, one light, one camera, switch Film Transparent on, and render a single PNG frame.</li>
<li>Check the output file's alpha the same way this lesson did — sample a background pixel and a letter pixel and confirm one is fully transparent and the other opaque.</li>
<li>Compare your render time to this lesson's 4.67 seconds — note whether your machine used CPU or GPU and why that might differ.</li>
<li>If you do not have Blender: read through the Linux command block above and identify, in your own words, why &#96;--cycles-device&#96; has to come after the &#96;--&#96; separator rather than earlier in the command.</li>
</ol><p><strong>Done when:</strong> you have either a real rendered PNG with verified alpha, or a command you could type correctly from memory, including the &#96;--&#96; separator, without looking it up.</p></div>

<h3>🗂 Terms in this lesson</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Film Transparent</span><span class="v">Blender's render setting that drops the background entirely, producing an alpha channel instead.</span></div>
  <div class="kv"><span class="k">Movie Clip Editor</span><span class="v">Blender's tool for tracking real footage's camera motion and applying it to a virtual camera.</span></div>
  <div class="kv"><span class="k">--cycles-device</span><span class="v">Blender's command-line flag choosing CPU/CUDA/OPTIX/HIP/ONEAPI/METAL — must follow a &#96;--&#96; separator.</span></div>
  <div class="kv"><span class="k">OptiX</span><span class="v">NVIDIA's ray-tracing acceleration path for Cycles, needs compute capability 5.0+ and driver ≥575.</span></div>
  <div class="kv"><span class="k">nvidia-smi</span><span class="v">Command that reports current GPU/VRAM usage — check it before rendering on a shared machine.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Blender is free and open source; Metal accelerates it on Apple Silicon, CUDA/OptiX on Linux with a qualifying NVIDIA GPU (compute capability 5.0+, OptiX also needs driver ≥575).</li>
<li>The workflow is: build the 3D text/logo → (optionally) track real footage's camera in the Movie Clip Editor → render PNG/EXR with Film Transparent on → composite in Resolve like any alpha export from Lesson 19.1.</li>
<li>A real render on this Mac M1 Max: Cycles, GPU (Metal), 128 samples, 1280×720, real 4.67 seconds, 356,728-byte PNG with verified real alpha — not estimated.</li>
<li>The Linux/RTX 3060 command uses real Blender Manual syntax but has not been run there; &#96;--cycles-device&#96; must follow a &#96;--&#96; separator, and &#96;nvidia-smi&#96; must be checked first — a background service was measured eating ~11/12 GB VRAM at peak on 22/09/2026.</li>
</ul>
<div class="link-card"><a href="https://docs.blender.org/manual/en/latest/advanced/command_line/arguments.html" target="_blank" rel="noopener">Blender Manual — Command Line Arguments</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 19 · Bài 19.4</span>
<h2>Đúng công thức chữ-extrude-bevel-đèn-camera của Bài 19.3 — một lượt render thật, số đo thật, trên đúng máy này</h2>
<p class="lead">Bài 19.3 kết thúc trung thực: không gian 3D của Fusion không thay được một công cụ 3D thật. <strong>Blender</strong> chính là công cụ đó — miễn phí, mã nguồn mở, và cùng công thức lõi bạn đã biết (chữ, extrude, bevel, một đèn, một camera) nhưng có cả chiều sâu của một phần mềm 3D chuyên dụng đứng sau. Bài này làm một việc phần còn lại của chương phần lớn chỉ MÔ TẢ: nó thật sự chạy lượt render, trên đúng máy này, và mọi con số dưới đây đến từ lượt chạy đó.</p>

<h3>Chạy được ở đâu — kiểm trên blender.org</h3>
<p>Trên <strong>macOS</strong>, Blender tăng tốc bằng <strong>Metal</strong> trên Apple Silicon. Trên <strong>Linux</strong> có GPU NVIDIA, nó tăng tốc bằng <strong>CUDA</strong> (compute capability 5.0 trở lên) hoặc <strong>OptiX</strong> (cùng yêu cầu 5.0+, cộng thêm driver ít nhất bản 575, dùng ray-tracing phần cứng RTX mà card máy nhà bạn có). Mac M1 Max và máy Linux ở nhà bạn với RTX 3060 đều đạt (blender.org/download/requirements, kiểm 09/2026 — chính trang đó nằm sau một lớp "Verify you are human" của Cloudflare, KHÔNG bấm qua; các con số này lấy từ kết quả tìm kiếm trích dẫn thẳng trang gốc, không phải đoán).</p>

<h3>Quy trình: logo trong Blender, xuất alpha, ghép trong Resolve</h3>
${slide('cr-19', 12, 'Blender cho creator — quy trình logo/chữ 3D → ghép Resolve')}
<p>Dựng chữ/logo (đối tượng Text → Extrude + Bevel, một vật liệu, một đèn, một camera) — đây thật sự là đúng ý tưởng của công thức Fusion ở Bài 19.3, chỉ khác là có cả hệ thống vật liệu và ánh sáng sâu hơn nhiều của Blender đứng sau. Nếu vật thể 3D cần nằm thuyết phục BÊN TRONG cảnh quay thật (không chỉ như một tiêu đề lơ lửng), <strong>Movie Clip Editor</strong> của Blender track được chính chuyển động camera của cảnh quay, rồi trao chuyển động đó cho một camera ảo trong Blender — ở mức quy trình cho khoá này, đúng ý tưởng của Camera Tracker ở Bài 18.2, chỉ chạy trong một phần mềm khác. Rồi render, bật <strong>Film Transparent</strong>, ra PNG hoặc EXR — một khung hoặc cả chuỗi — và đưa nó vào Resolve đúng như quy trình xuất alpha của Bài 19.1: một lớp riêng trên một track, ghép lên trên cảnh quay thật.</p>

<h3>Một lượt render THẬT trên máy này — không phải mô tả</h3>
${slide('cr-19', 13, 'Render chữ 3D THẬT trên máy này (Mac M1 Max)')}
<p>Một script Python nhỏ tự dựng cảnh từ đầu — không mở file có sẵn — bằng chính API của Blender: một đối tượng Text ghi "cuongthai" với &#96;extrude=0.06&#96; và &#96;bevel_depth=0.015&#96;, một vật liệu Principled BSDF màu vàng, ĐÚNG MỘT đèn Area, ĐÚNG MỘT camera, và &#96;film_transparent = True&#96;. Chạy bằng:</p>
<pre><code class="language-bash">blender -b -P tao-chu-3d.py -- out.png</code></pre>
<p>Blender tự phát hiện và dùng <strong>GPU (Metal)</strong> cho Cycles, ở 128 samples, 1280×720. Đo bằng &#96;/usr/bin/time -p&#96;: <strong>real 4,67 giây</strong> — con số này gồm cả thời gian Blender tự khởi động, không chỉ riêng render. File output: <strong>356.728 byte</strong> (~349 KB), xác nhận là PNG RGBA thật bằng cách đọc chính byte tiêu đề của file (PNG color type 6). Lấy mẫu điểm ảnh thật bằng Pillow chứng minh độ trong suốt là thật, không phải giả định: góc nền là &#96;(0, 0, 0, 0)&#96;, một điểm nằm sâu trong một chữ cái là &#96;(171, 128, 46, 255)&#96; — đặc hoàn toàn — và một điểm nằm ngay trên mép một chữ cái ra &#96;(184, 145, 81, 207)&#96; — một dải chuyển alpha một phần THẬT, không phải một mask bật/tắt cứng.</p>
<div class="callout ok"><p>Đây chính xác là file đã đo trong phần so sánh xuất alpha ở Bài 19.1 — cùng một PNG, giữ 2 giây và xuất cả hai kiểu có/không kênh alpha để ra hai con số ProRes 19,31 MB và 11,76 MB ở đó.</p></div>

<h3>Đúng việc đó trên máy Linux — chỉ có cú pháp, CHƯA chạy ở đây</h3>
${slide('cr-19', 14, 'Render trên máy Linux (RTX 3060) — cú pháp CHƯA chạy ở đây')}
<p>Theo trang Command Line Arguments và Command Line Rendering của Blender Manual (kiểm hai lần độc lập, cả hai khớp nhau): chế độ nền là &#96;-b&#96; (hoặc &#96;--background&#96;), chạy một script Python là &#96;-P&#96; (hoặc &#96;--python&#96;) theo sau bằng file, đường dẫn output là &#96;-o&#96;, định dạng là &#96;-F&#96;, và render một khung là &#96;-f &lt;n&gt;&#96; còn cả chuỗi hoạt hình là &#96;-a&#96;. Chọn thiết bị render là &#96;--cycles-device&#96; với một trong &#96;CPU&#96;/&#96;CUDA&#96;/&#96;OPTIX&#96;/&#96;HIP&#96;/&#96;ONEAPI&#96;/&#96;METAL&#96; — và theo đúng Manual, các tuỳ chọn riêng của Cycles như cái này phải đứng <strong>SAU dấu &#96;--&#96; ở cuối cùng dòng lệnh</strong>, không trộn lẫn với tham số riêng của Blender. Trên RTX 3060, OptiX là lựa chọn đầu tiên hợp lý:</p>
<pre><code class="language-bash">nvidia-smi --query-gpu=memory.used,memory.total --format=csv
blender -b logo-3d.blend -o //render/khung_##### -F PNG -f 1 -- --cycles-device OPTIX</code></pre>
<p>Lệnh này <strong>CHƯA chạy trên máy Linux</strong> — không SSH vào máy đó từ trong bài học, đúng luật đã có sẵn của khoá từ Bài 11.2 về việc không tự ý chạm vào máy đó từ trong một bài học khi không có lý do cụ thể, trực tiếp. Thứ LÀ một con số thật, đo được: vào <strong>22/09/2026</strong>, một dịch vụ thường trú trên máy đó được phát hiện chiếm khoảng <strong>11 trên 12 GB VRAM</strong> lúc cao điểm. Kiểm &#96;nvidia-smi&#96; TRƯỚC khi render — nếu dịch vụ đang chạy, hoặc tạm tắt nó, hoặc rơi về &#96;--cycles-device CPU&#96;, chậm hơn nhưng không tranh bộ nhớ với dịch vụ kia.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — tưởng GPU đang rảnh vì lệnh render trông đúng.</strong> Một lệnh &#96;--cycles-device OPTIX&#96; đúng cú pháp tuyệt đối vẫn thất bại hoặc bò chậm nếu một tiến trình khác đã chiếm gần hết VRAM — bản thân lệnh không có cách nào tự biết điều đó. &#96;nvidia-smi&#96; trước, mọi lần, mới là thói quen thật; một lệnh "lẽ ra phải chạy được" không phải cùng một khẳng định với một lệnh đã kiểm xem còn gì khác đang chạy.</p></div>
<p class="note-ct"><strong>Hết chương.</strong> Từ một lower third trượt vào khung có easing (19.1–19.2) tới một logo 3D được render bởi một GPU thật trên đúng máy này (19.3–19.4) — Chương 20 rời khỏi đồ hoạ, sang hẳn một vấn đề khác: dựng cho video ngắn dọc.</p>

<h3>🎬 Thực hành (20–30 phút, cần cài Blender)</h3>
<div class="callout ok"><ol>
<li>Nếu có Blender: dựng một đối tượng chữ 3D bằng Extrude + Bevel, một đèn, một camera, bật Film Transparent, render một khung PNG.</li>
<li>Kiểm alpha của file output đúng cách bài này đã làm — lấy mẫu một điểm nền và một điểm trên chữ, xác nhận một cái trong suốt hoàn toàn, cái kia đặc.</li>
<li>So thời gian render của bạn với 4,67 giây ở bài này — ghi lại máy bạn dùng CPU hay GPU và vì sao có thể khác.</li>
<li>Nếu chưa có Blender: đọc kỹ khối lệnh Linux ở trên, tự diễn đạt bằng lời của mình vì sao &#96;--cycles-device&#96; phải đứng sau dấu &#96;--&#96; thay vì đứng sớm hơn trong lệnh.</li>
</ol><p><strong>Đạt khi:</strong> bạn có MỘT trong hai: một file PNG render thật đã xác nhận alpha, hoặc gõ đúng được một lệnh từ trí nhớ, kể cả dấu &#96;--&#96;, mà không cần tra lại.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Film Transparent</span><span class="v">Thiết lập render của Blender bỏ hẳn nền, sinh ra kênh alpha thay vì màu nền.</span></div>
  <div class="kv"><span class="k">Movie Clip Editor</span><span class="v">Công cụ của Blender track chuyển động camera của cảnh quay thật rồi áp lên một camera ảo.</span></div>
  <div class="kv"><span class="k">--cycles-device</span><span class="v">Cờ dòng lệnh của Blender chọn CPU/CUDA/OPTIX/HIP/ONEAPI/METAL — phải đứng sau dấu &#96;--&#96;.</span></div>
  <div class="kv"><span class="k">OptiX</span><span class="v">Đường tăng tốc ray-tracing của NVIDIA cho Cycles, cần compute capability 5.0+ và driver ≥575.</span></div>
  <div class="kv"><span class="k">nvidia-smi</span><span class="v">Lệnh báo cáo GPU/VRAM đang dùng bao nhiêu — kiểm trước khi render trên một máy dùng chung.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Blender miễn phí, mã nguồn mở; Metal tăng tốc nó trên Apple Silicon, CUDA/OptiX trên Linux có GPU NVIDIA đạt chuẩn (compute capability 5.0+, OptiX cần thêm driver ≥575).</li>
<li>Quy trình: dựng chữ/logo 3D → (tuỳ chọn) track camera cảnh quay thật trong Movie Clip Editor → render PNG/EXR bật Film Transparent → ghép trong Resolve như mọi bản xuất alpha ở Bài 19.1.</li>
<li>Một lượt render thật trên Mac M1 Max này: Cycles, GPU (Metal), 128 samples, 1280×720, real 4,67 giây, PNG 356.728 byte với alpha xác nhận thật — không ước lượng.</li>
<li>Lệnh Linux/RTX 3060 dùng đúng cú pháp thật của Blender Manual nhưng chưa chạy ở đó; &#96;--cycles-device&#96; phải đứng sau dấu &#96;--&#96;, và &#96;nvidia-smi&#96; phải kiểm trước — một dịch vụ thường trú đo được chiếm ~11/12 GB VRAM lúc cao điểm ngày 22/09/2026.</li>
</ul>
<div class="link-card"><a href="https://docs.blender.org/manual/en/latest/advanced/command_line/arguments.html" target="_blank" rel="noopener">Blender Manual — Command Line Arguments</a></div>
</div>
`,
    },

    /* ─────────────────── 19.5 Quiz ─────────────────── */
    {
      title: '19.5 — Chapter 19 check|||19.5 — Kiểm tra chương 19',
      slug: 'cr-19-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: '10 câu tình huống: hệ nhận diện chuyển động, end screen, tư duy node Fusion, free vs Studio, không gian 3D, và Blender — kèm checklist tự kiểm cả chương.',
      content: `
<div class="ml-en">
<h2>📌 Chapter 19 recap</h2>
<p>Chapter 19 turned isolated graphics into a system: six repeated motion-identity components (19.1), Fusion's node graph — a genuinely different question than a layer stack (19.2), a 3D space inside that same page for simple text/logo work (19.3), and Blender as the honest next step once Fusion 3D is not enough, proven with a real render on this machine (19.4).</p>
<h3>Self-check</h3>
<ul>
<li>Can you name your channel's font, palette, and easing curve in one sentence?</li>
<li>Do you know why &#96;blackmagicdesign.com/products/fusion/compare&#96; is the WRONG page to answer "what's free in Fusion"?</li>
<li>Can you trace MediaIn → Merge → MediaOut in your own lower third and say what feeds into what?</li>
<li>Do you know which five Fusion 3D node types exist and what each one does?</li>
<li>Do you know why &#96;--cycles-device&#96; has to come after &#96;--&#96; in a Blender command line?</li>
</ul>
</div>
<div class="ml-vi">
<h2>📌 Tóm tắt Chương 19</h2>
<p>Chương 19 biến những đồ hoạ rời rạc thành một hệ thống: sáu thành phần lặp lại của hệ nhận diện chuyển động (19.1), cây node của Fusion — một câu hỏi thật sự khác chồng layer (19.2), một không gian 3D ngay trong trang đó cho chữ/logo đơn giản (19.3), và Blender là bước tiếp theo trung thực khi Fusion 3D không đủ, chứng minh bằng một lượt render thật trên máy này (19.4).</p>
<h3>Tự kiểm</h3>
<ul>
<li>Bạn nói được font, bảng màu, và đường easing của kênh mình trong một câu không?</li>
<li>Bạn biết vì sao &#96;blackmagicdesign.com/products/fusion/compare&#96; là trang SAI để trả lời "cái gì miễn phí trong Fusion" không?</li>
<li>Bạn lần được MediaIn → Merge → MediaOut trong chính lower third của mình và nói được cái gì chảy vào cái gì không?</li>
<li>Bạn biết năm loại node 3D của Fusion là gì và mỗi cái làm việc gì không?</li>
<li>Bạn biết vì sao &#96;--cycles-device&#96; phải đứng sau dấu &#96;--&#96; trong một dòng lệnh Blender không?</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Bạn dựng xong 6 thành phần chuyển động cho kênh (intro, lower third, tiêu đề chương, callout, thanh tiến độ, end screen) nhưng mỗi cái một font khác, một tông màu khác. Vì sao đây vẫn là một vấn đề dù từng thành phần riêng lẻ đều đẹp?|||You finish all 6 motion components (intro, lower third, chapter title, callout, progress bar, end screen) but each uses a different font and color tone. Why is this still a problem even though each one looks good on its own?',
            options: [
              'Vì hệ nhận diện chuyển động là NHẬN RA kênh trong một giây từ đồ hoạ — dùng font/màu khác nhau phá đúng đường tắt đó, dù từng cái riêng lẻ vẫn đẹp|||Because a motion identity is about recognizing the channel in one second from the graphics — using different fonts/colors breaks exactly that shortcut, even if each piece looks fine alone',
              'Không sao cả — YouTube sẽ tự đồng bộ style|||No problem — YouTube automatically syncs the style',
              'Vì phần mềm dựng sẽ báo lỗi khi font không khớp|||Because the editing software will throw an error when fonts do not match',
              'Vì chỉ có đúng một font được phép dùng trên toàn bộ YouTube|||Because only one font is allowed to be used on all of YouTube',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Lesson 19.1 builds directly on Lesson 16.2: a viewer recognizes a channel "from the graphics alone, in about a second" only when the same font/palette/easing repeats across every component. Each piece looking good individually does not create that recognition shortcut — consistency does.|||VI: Bài 19.1 dựng thẳng trên Bài 16.2: người xem nhận ra một kênh "chỉ từ đồ hoạ, trong khoảng một giây" CHỈ KHI cùng font/bảng màu/easing lặp lại xuyên suốt mọi thành phần. Từng thành phần đẹp riêng lẻ không tạo ra đường tắt nhận diện đó — sự NHẤT QUÁN mới tạo ra.',
          },
          {
            question: 'Video của bạn dài 22 giây. Bạn muốn thêm end screen giới thiệu video khác ở 5 giây cuối. Điều gì xảy ra?|||Your video is 22 seconds long. You want to add an end screen promoting another video in the last 5 seconds. What happens?',
            options: [
              'Bình thường, end screen luôn thêm được ở 5 giây cuối bất kể video dài bao lâu|||Works fine — an end screen can always be added in the last 5 seconds regardless of video length',
              'Không thêm được — video phải dài ÍT NHẤT 25 giây mới bật được end screen|||Cannot be added — the video must be AT LEAST 25 seconds long to enable an end screen',
              'Thêm được nhưng chỉ hiện được 1 phần tử thay vì 4|||Can be added but only 1 element will show instead of 4',
              'Thêm được, chỉ cần đổi tỉ lệ khung sang 9:16|||Can be added, just need to switch the aspect ratio to 9:16',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: support.google.com/youtube/answer/6388789 (checked 09/2026) states a video must be at least 25 seconds long to have an end screen at all — a 22-second video falls short by 3 seconds, so the feature is unavailable, not limited.|||VI: support.google.com/youtube/answer/6388789 (kiểm 09/2026) nói rõ video phải dài ÍT NHẤT 25 giây mới bật được end screen. Video 22 giây thiếu đúng 3 giây, nên tính năng này KHÔNG DÙNG ĐƯỢC, chứ không phải bị giới hạn bớt.',
          },
          {
            question: 'Trong Fusion, bạn thấy MỘT node Text+ có dây nối ra HAI node Merge khác nhau. Điều gì đang xảy ra?|||In Fusion you see ONE Text+ node with wires connecting to TWO different Merge nodes. What is happening?',
            options: [
              'Đây là lỗi — một node chỉ được nối ra đúng một chỗ, giống layer trong CapCut|||This is a bug — a node can only connect to one place, like a layer in CapCut',
              'Fusion sẽ tự động xoá một trong hai dây nối khi render|||Fusion will automatically delete one of the two wires when rendering',
              'Bình thường — trong tư duy node, đúng một Text+ nối được vào nhiều Merge cho nhiều kết quả khác nhau, khác hẳn layer TRÊN-DƯỚI cố định|||Normal — in node thinking, the same Text+ can feed into multiple Merges for different results, unlike a fixed top-to-bottom layer stack',
              'Chỉ có ở bản Fusion Studio, bản miễn phí không cho phép một node nối ra nhiều nơi|||Only available in Fusion Studio — the free version does not allow one node to connect to multiple places',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Lesson 19.2\'s core idea: a node graph asks "what feeds into what," not "what sits on top." The exact same Text+ node can legitimately feed multiple Merge nodes — this is the defining difference from a fixed layer stack, not an error or a Studio-only feature.|||VI: Ý chính của Bài 19.2: cây node hỏi "cái gì chảy vào cái gì," không phải "cái gì nằm trên." Đúng một node Text+ hoàn toàn hợp lệ khi nối vào nhiều Merge — đây chính là khác biệt định nghĩa so với một chồng layer cố định, không phải lỗi hay tính năng riêng của Studio.',
          },
          {
            question: 'Bạn đọc blackmagicdesign.com/products/fusion/compare để tìm xem Camera Tracker có miễn phí không, và thấy bảng ghi "Fusion 21 in DaVinci Resolve Studio 21: YES" cho hầu hết mọi dòng. Kết luận nào ĐÚNG?|||You read blackmagicdesign.com/products/fusion/compare to check if Camera Tracker is free, and see the table marking "Fusion 21 in DaVinci Resolve Studio 21: YES" for almost every row. Which conclusion is CORRECT?',
            options: [
              'Kết luận được ngay: hầu hết công cụ Fusion đều miễn phí, vì cột đó ghi YES|||Can conclude right away: most Fusion tools are free, since that column says YES',
              'Trang này đáng tin tuyệt đối vì là trang chính thức của Blackmagic|||This page is absolutely trustworthy because it is Blackmagic\'s own official page',
              'Cần bỏ qua trang này hoàn toàn, không có thông tin gì hữu ích|||This page should be ignored entirely — it has no useful information',
              'Trang này so sánh SAI đối tượng cho câu hỏi "free vs Studio" — nó so Fusion-trong-Resolve-STUDIO với Fusion Studio rời, CẢ HAI đều trả phí, nên không dùng được để kết luận cái gì miễn phí|||This page compares the WRONG thing for a "free vs Studio" question — it compares Fusion-inside-Resolve-STUDIO against standalone Fusion Studio, BOTH paid, so it cannot be used to conclude what is free',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: The lesson content explicitly names this trap: the compare page\'s two columns are "Fusion in DaVinci Resolve STUDIO" vs "Fusion Studio" — both paid tiers of Fusion, not free vs. Studio. A YES in both columns just means both paid products include that feature; it says nothing about the free edition. The correct free-vs-Studio facts came from Fusion\'s product page cross-checked elsewhere.|||VI: Nội dung bài học nêu tên rõ cái bẫy này: hai cột của trang compare là "Fusion trong Resolve STUDIO" và "Fusion Studio" — cả hai đều là bản TRẢ PHÍ của Fusion, không phải free-vs-Studio. Một YES ở cả hai cột chỉ có nghĩa cả hai sản phẩm trả phí đều có tính năng đó; nó không nói gì về bản miễn phí. Sự thật free-vs-Studio đúng đến từ trang sản phẩm Fusion kiểm chéo ở nơi khác.',
          },
          {
            question: 'Bạn muốn đặt một chữ 3D "dính" vào một cảnh quay có máy quay lia nhẹ khi đi quanh phòng. Công cụ nào trong Fusion làm được việc này, và nó thuộc bản nào?|||You want to place 3D text that stays "locked" into footage where the camera pans slightly while walking around a room. Which Fusion tool does this, and which edition is it in?',
            options: [
              'Camera Tracker — CHỈ có ở Fusion Studio|||Camera Tracker — Fusion Studio ONLY',
              'Planar Tracker — miễn phí ở mọi bản|||Planar Tracker — free in every edition',
              'Point Tracker — miễn phí ở mọi bản|||Point Tracker — free in every edition',
              'Delta Keyer — miễn phí ở mọi bản|||Delta Keyer — free in every edition',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Placing a 3D object that appears locked into real 3D space as the camera itself moves needs the camera\'s own 3D motion solved — that is exactly Camera Tracker\'s job (Lesson 18.2, reconfirmed in Lesson 19.2), and it is Fusion Studio only. Planar Tracker only follows a flat surface, not the camera\'s own movement through space.|||VI: Đặt một vật 3D trông như "dính" vào không gian 3D thật khi CHÍNH máy quay di chuyển cần dựng lại chuyển động 3D của máy quay — đúng việc Camera Tracker làm (Bài 18.2, xác nhận lại ở Bài 19.2), và nó chỉ có ở Fusion Studio. Planar Tracker chỉ bám theo một mặt phẳng, không bám chuyển động của chính máy quay trong không gian.',
          },
          {
            question: 'Bạn đang ở trên iPad Pro M5, muốn nhanh dựng một lower third bằng Fusion trước khi về nhà. Điều gì xảy ra?|||You are on your iPad Pro M5 and want to quickly build a lower third using Fusion before heading home. What happens?',
            options: [
              'Bình thường — Fusion có trên mọi bản DaVinci Resolve for iPad|||Works fine — Fusion is on every edition of DaVinci Resolve for iPad',
              'Không làm được — DaVinci Resolve for iPad chính thức chỉ có Cut, Color, Deliver, Photo; KHÔNG có Fusion|||Cannot be done — DaVinci Resolve for iPad officially only has Cut, Color, Deliver, Photo; NOT Fusion',
              'Làm được nhưng phải mua gói Studio trong app trước|||Can be done, but only after buying the in-app Studio upgrade first',
              'Làm được, chỉ là giao diện Fusion trên iPad khác trên Mac|||Can be done, the Fusion interface just looks different on iPad than on Mac',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Already established in Lesson 13.4 and repeated as this lesson\'s pitfall: DaVinci Resolve for iPad officially ships Cut, Color, Deliver, and Photo — Fusion is not among them, on any tier. The Fusion work in this chapter is Mac-only.|||VI: Đã xác lập ở Bài 13.4 và nhắc lại làm bẫy của bài này: DaVinci Resolve for iPad chính thức chỉ có Cut, Color, Deliver, và Photo — Fusion không nằm trong đó, ở bất kỳ bản nào. Việc dùng Fusion trong chương này chỉ làm được trên Mac.',
          },
          {
            question: 'Trong không gian 3D của Fusion, node nào là nơi Text3D, Camera3D và một đèn THẬT SỰ hội tụ thành một cảnh duy nhất?|||In Fusion\'s 3D space, which node is where Text3D, Camera3D, and a light ACTUALLY converge into a single scene?',
            options: [
              'Renderer3D|||Renderer3D',
              'Shape3D|||Shape3D',
              'Merge3D|||Merge3D',
              'MediaOut|||MediaOut',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Merge3D is the 3D counterpart of the 2D Merge node — it accepts unlimited 3D objects, lights, and cameras and combines them into one scene. Renderer3D comes AFTER Merge3D and does a different job: flattening that already-combined 3D scene back into a 2D image.|||VI: Merge3D là phiên bản 3D của node Merge 2D — nó nhận không giới hạn vật thể, đèn, camera 3D và gộp chúng thành MỘT cảnh. Renderer3D đứng SAU Merge3D và làm một việc khác: làm phẳng cảnh 3D đã gộp đó trở lại thành một ảnh 2D.',
          },
          {
            question: 'Bạn cần dựng một nhân vật 3D có rig để hoạt hình, với vật liệu da/vải chính xác về vật lý. Đây có phải việc hợp để làm trong không gian 3D của Fusion không?|||You need to build a rigged 3D character for animation, with physically accurate skin/fabric materials. Is this a good fit for Fusion\'s 3D space?',
            options: [
              'Có — Fusion 3D làm được mọi việc một phần mềm 3D chuyên dụng làm được|||Yes — Fusion 3D can do everything a dedicated 3D tool can',
              'Có, nhưng chỉ trên bản Fusion Studio trả phí|||Yes, but only on the paid Fusion Studio edition',
              'Không thể trả lời vì Fusion không có node vật liệu|||Cannot answer — Fusion has no material nodes at all',
              'Không — Fusion 3D được dựng cho chữ/logo 3D đơn giản có ánh sáng/camera; rigging, hoạt hình nhân vật và vật liệu vật lý sâu là đúng việc Blender làm, không phải Fusion|||No — Fusion 3D is built for simple 3D text/logos with light/camera; rigging, character animation, and deep physical materials are exactly Blender\'s job, not Fusion\'s',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Lesson 19.3 is explicit about the boundary: Fusion 3D does not model detailed objects, does not do deep physically-based lighting, and has no rigging or character animation — pushing it toward that job is the lesson\'s named pitfall. Blender (Lesson 19.4) is the honest tool for this, and it is free regardless of which Resolve edition you run.|||VI: Bài 19.3 nói rõ ranh giới: Fusion 3D không mô hình hoá vật thể chi tiết, không có ánh sáng vật lý sâu, và không có rigging hay hoạt hình nhân vật — ép nó làm việc đó chính là cái bẫy được nêu tên trong bài. Blender (Bài 19.4) mới là công cụ trung thực cho việc này, và nó miễn phí bất kể bạn chạy bản Resolve nào.',
          },
          {
            question: 'Bạn ghép một PNG có alpha lên một clip nền bằng filter overlay của ffmpeg, xuất ra một file .mp4 duy nhất, rồi coi file .mp4 đó là "đồ hoạ dùng lại được." Vấn đề ở đây là gì?|||You overlay an alpha PNG onto a background clip with ffmpeg\'s overlay filter, export a single .mp4, and treat that .mp4 as the "reusable graphic." What is the problem?',
            options: [
              'File .mp4 đó đã ĐẶC (mất kênh alpha) vì đã ghép vào đúng nền cụ thể đó — muốn dùng lại phải xuất đồ hoạ RIÊNG với Export Alpha, không phải bản đã ghép|||That .mp4 is now OPAQUE (alpha is gone) because it was baked onto that specific background — the reusable version must be the graphic exported ALONE with Export Alpha, not the composited result',
              'Không có vấn đề gì — file đó dùng lại hoàn hảo trên video khác|||No problem — that file reuses perfectly on other videos',
              'Vấn đề duy nhất là định dạng .mp4 không hỗ trợ độ phân giải cao|||The only problem is .mp4 does not support high resolution',
              'Vấn đề là overlay filter của ffmpeg bị lỗi, không ghép đúng vị trí|||The problem is ffmpeg\'s overlay filter is buggy and does not composite in the right position',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: This is Lesson 19.1\'s named pitfall, proven with real files on this machine: compositing onto a background bakes the result opaque — the alpha is gone the moment it merges with whatever was behind it. The reusable asset is the graphic exported alone (ProRes 4444, Export Alpha checked), verified transparent by sampling pixels, not the one-time composited preview.|||VI: Đây chính là bẫy được nêu tên ở Bài 19.1, chứng minh bằng file thật trên máy này: ghép lên một nền "nướng" kết quả thành đặc — alpha biến mất ngay khi nó hợp nhất với bất cứ thứ gì phía sau. Tài sản dùng lại được là đồ hoạ xuất RIÊNG (ProRes 4444, bật Export Alpha), xác nhận trong suốt bằng cách đo điểm ảnh, không phải bản xem trước đã ghép một lần.',
          },
          {
            question: 'Bạn gõ lệnh &#96;blender -b canh.blend --cycles-device OPTIX -o //render/ -f 1&#96; trên máy Linux (đặt --cycles-device NGAY SAU -b, trước các cờ khác). Theo Blender Manual, điều gì nhiều khả năng xảy ra?|||You type &#96;blender -b canh.blend --cycles-device OPTIX -o //render/ -f 1&#96; on the Linux machine (placing --cycles-device RIGHT AFTER -b, before the other flags). Per the Blender Manual, what most likely happens?',
            options: [
              'Chạy hoàn toàn bình thường — thứ tự tham số trong dòng lệnh Blender không quan trọng|||Runs completely fine — argument order in a Blender command line does not matter',
              'Lệnh có thể không chọn đúng thiết bị OptiX như mong đợi — tham số riêng của Cycles như --cycles-device phải đứng SAU dấu -- ở cuối dòng, không đặt xen giữa các cờ khác của Blender|||The command may not correctly select the OptiX device as intended — Cycles-specific options like --cycles-device must come AFTER a -- separator at the end, not mixed in with Blender\'s own flags',
              'Blender sẽ tự động sửa lại đúng thứ tự tham số|||Blender will automatically fix the argument order',
              'Lệnh chỉ lỗi khi chạy trên macOS, trên Linux thì luôn đúng|||The command only fails on macOS — on Linux it always works correctly',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Confirmed twice independently against docs.blender.org: Cycles-specific command-line options, including --cycles-device, must be passed after a -- separator at the end of the command line. Blender\'s own manual explicitly warns that arguments execute in the order given and a misplaced one does not error — it quietly does the wrong thing, exactly why this lesson\'s Linux command puts --cycles-device OPTIX after -- at the very end.|||VI: Đã xác nhận hai lần độc lập trên docs.blender.org: các tuỳ chọn dòng lệnh riêng của Cycles, kể cả --cycles-device, phải truyền SAU dấu -- ở cuối dòng lệnh. Chính Blender Manual cảnh báo rõ tham số chạy theo đúng thứ tự đưa vào và một tham số đặt sai chỗ không báo lỗi — nó âm thầm làm SAI việc, đúng lý do lệnh Linux trong bài này đặt --cycles-device OPTIX sau dấu -- ở cuối cùng.',
          },
        ],
      },
    },
  ],
};
