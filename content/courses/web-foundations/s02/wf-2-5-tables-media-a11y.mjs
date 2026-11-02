/**
 * Bài 2.5 — Bảng, media, khả năng tiếp cận (nâng cấp 02/11/2026). Mã + output: ../_ma.mjs (Chromium thật: _demo/2-5; _demo/_t2/chay.mjs lấy
 * cây trợ năng của bảng + đi bằng phím Tab thật). media/clip.webm tạo bằng ffmpeg (testsrc2, 3 s). Deck: scripts/slides-src/wf-2-5.mjs
 * (10 slide, WF/v1/wf-2-5). Code Lab: module 2.5 (7 đề sẵn có).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-2-5', 'Tables, media and accessibility', 'Bảng, media và khả năng tiếp cận', [
  [1, 'Tables, media and accessibility',
    '<p>The last HTML lesson covers the two remaining kinds of content, tables and media, and then pulls together a theme that has been running through the chapter: making sure everyone can use what you build. You will finish the lesson with a short checklist you can run on any page.</p>',
    '<p>Bài HTML cuối dạy hai loại nội dung còn lại, bảng và media, rồi gom lại một chủ đề xuyên suốt chương: bảo đảm mọi người đều dùng được thứ bạn làm. Bạn sẽ kết thúc bài với một danh sách kiểm ngắn dùng được cho mọi trang.</p>'],
  [2, 'After this lesson you can…',
    '<p>Accessibility is sometimes treated as a special feature for a few people. In practice about one person in six has some disability, and everyone is temporarily limited sometimes: a broken mouse, bright sunlight, a noisy bus. Most of the fixes here cost one attribute.</p>',
    '<p>Khả năng tiếp cận đôi khi bị coi là tính năng đặc biệt cho vài người. Trên thực tế khoảng một phần sáu dân số sống với một dạng khuyết tật, và ai cũng có lúc bị hạn chế tạm thời: chuột hỏng, nắng gắt, xe buýt ồn. Đa số cách sửa ở đây chỉ tốn một thuộc tính.</p>'],
  [3, 'A real table',
    '<p>A table is for data with rows and columns, where each cell is related to its row header and column header. The screenshot shows a caption, a header row, row headers, and a footer cell spanning two columns. All of that structure is real HTML, not visual tricks.</p>',
    '<p>Bảng dùng cho dữ liệu có hàng và cột, trong đó mỗi ô liên quan tới tiêu đề hàng và tiêu đề cột của nó. Ảnh chụp cho thấy chú thích, hàng tiêu đề, tiêu đề hàng, và một ô chân bảng trải qua hai cột. Toàn bộ cấu trúc đó là HTML thật, không phải mẹo thị giác.</p>'],
  [4, 'What a screen reader gets',
    '<p>This is the accessibility tree of that table. Each header has a role: columnheader for the top row and rowheader for the first column. So when a user reaches the cell 9 they hear "An, HTML, 9". Without <code>th</code> and <code>scope</code> they would only hear "9".</p>',
    '<p>Đây là cây trợ năng của bảng đó. Mỗi tiêu đề có một vai trò: columnheader cho hàng trên và rowheader cho cột đầu. Nên khi tới ô 9, người dùng nghe "An, HTML, 9". Thiếu <code>th</code> và <code>scope</code>, họ chỉ nghe "9".</p>'],
  [5, 'Video and audio',
    '<p>The <code>video</code> element with <code>controls</code> gives you a full player with no JavaScript. List sources by format, add a caption track, and put a fallback link inside. The output reads the real file: three seconds, 320 by 180, not playing by itself, two caption cues.</p>',
    '<p>Phần tử <code>video</code> có <code>controls</code> cho bạn một trình phát đầy đủ mà không cần JavaScript. Liệt kê nguồn theo định dạng, thêm một track phụ đề, và đặt liên kết dự phòng bên trong. Output đọc từ tệp thật: ba giây, 320 nhân 180, không tự chạy, hai đoạn phụ đề.</p>'],
  [6, 'The four kinds of barrier',
    '<p>Think about who is using the page. People who cannot see it need text alternatives and structure. People who cannot hear need captions. People who cannot use a mouse need the keyboard. People who struggle to read need plain language and good contrast.</p>',
    '<p>Hãy nghĩ xem ai đang dùng trang. Người không nhìn thấy cần chữ thay thế và cấu trúc. Người không nghe được cần phụ đề. Người không dùng được chuột cần bàn phím. Người khó đọc cần ngôn ngữ đơn giản và độ tương phản tốt.</p>'],
  [7, 'Contrast is a number',
    '<p>Whether text is readable can be calculated. The WCAG formula compares the brightness of the two colours; normal text needs at least 4.5 to 1. Here the real ratios: grey 767676 just passes at 4.54, light grey fails, and popular white-on-orange fails at 2.68.</p>',
    '<p>Chữ có đọc được không là điều tính được. Công thức WCAG so độ sáng của hai màu; chữ thường cần ít nhất 4,5 trên 1. Đây là các tỉ số thật: xám 767676 vừa đạt ở 4,54, xám nhạt trượt, còn chữ trắng trên nền cam rất phổ biến lại trượt ở 2,68.</p>'],
  [8, 'Keyboard order',
    '<p>We pressed Tab six times. Positive <code>tabindex</code> values jump ahead of everything, so the visual order is broken: Cancel first, Save second. The fake div button is skipped completely, while a div with <code>tabindex="0"</code> joins the normal order. Leave the order to the document.</p>',
    '<p>Ta nhấn Tab sáu lần. Giá trị <code>tabindex</code> dương nhảy lên trước mọi thứ, nên thứ tự hiển thị bị phá: Huỷ trước, Lưu sau. Nút div giả bị bỏ qua hoàn toàn, còn div có <code>tabindex="0"</code> nhập vào thứ tự bình thường. Hãy để thứ tự cho tài liệu quyết định.</p>'],
  [9, 'A five-minute checklist',
    '<p>You do not need to be an expert to catch most problems. Five checks: use the page with only the keyboard, read the heading outline, look at every image’s alt text, run Lighthouse, and zoom to 200 percent. Do this before you call any page finished.</p>',
    '<p>Bạn không cần là chuyên gia để bắt phần lớn vấn đề. Năm phép kiểm: dùng trang chỉ bằng bàn phím, đọc dàn ý tiêu đề, xem chữ alt của mọi ảnh, chạy Lighthouse, và phóng to 200 phần trăm. Hãy làm việc này trước khi coi bất kỳ trang nào là xong.</p>'],
  [10, 'Summary & practice',
    '<p>The practice builds a small page with a table and a video, then runs the five-minute checklist on it. "Done when" includes a Lighthouse accessibility score, a contrast measurement and a keyboard run — real numbers, not opinions.</p>',
    '<p>Bài luyện dựng một trang nhỏ có bảng và video, rồi chạy danh sách kiểm năm phút. "Xong khi" gồm điểm Lighthouse, một phép đo tương phản và một lượt dùng bàn phím — những con số thật, không phải ý kiến.</p>'],
]);

export default {
  title: '2.5 — Tables, media, and accessibility|||2.5 — Bảng, media và khả năng tiếp cận',
  slug: 'wf-2-5-tables-media-a11y',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/e2nkq3h1P68', durationSeconds: 0 },
  description: 'Bảng có cấu trúc (caption, thead, scope, colspan) và cây trợ năng của nó; video/audio với controls, nguồn, phụ đề; bốn loại rào cản; độ tương phản tính được (đo tỉ số thật); thứ tự Tab và bẫy tabindex dương (phím Tab thật); danh sách kiểm năm phút.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>Tables, media — and making sure everyone can use your page</h2>
<p class="lead">After this lesson you can mark up a data table so that a screen reader can read it, embed video and audio with captions, measure colour contrast instead of guessing, keep a sensible keyboard order, and run a five-minute accessibility check on any page. You need this because accessibility (often shortened to <strong>a11y</strong>: "a", eleven letters, "y") is not a separate feature. It is a property of well-made HTML, it improves the page for everybody, and in many countries it is a legal requirement for public services.</p>

<h3>Step 1 — tables are for data</h3>
<p>A table is for data that really has rows and columns: each cell means something because of its row and its column. Here is a complete one:</p>
${ma('html', CODE['2-5/bang.html'], [13, 25])}
${ra(OUT['2-5/bang'])}
<div class="kv-grid">
  <div class="kv"><span class="k">caption</span><span class="v">The title of the table. Read first by a screen reader.</span></div>
  <div class="kv"><span class="k">thead, tbody, tfoot</span><span class="v">The header, body and footer groups. They help CSS, printing and assistive technology.</span></div>
  <div class="kv"><span class="k">tr</span><span class="v">A table row.</span></div>
  <div class="kv"><span class="k">th</span><span class="v">A header cell. <code>scope="col"</code> or <code>scope="row"</code> says what it heads.</span></div>
  <div class="kv"><span class="k">td</span><span class="v">A data cell.</span></div>
  <div class="kv"><span class="k">colspan, rowspan</span><span class="v">A cell that stretches over several columns or rows.</span></div>
</div>
<p>The screenshot is on slide 3. Now the part you cannot see. This is the accessibility tree Chromium built:</p>
${ra(OUT['_t2/out/aria-bang'])}
<p>Every header has become a <code>columnheader</code> or <code>rowheader</code>. So a screen-reader user who lands on the cell "9" hears "An, HTML, 9", and can move up, down, left and right. Replace <code>th</code> with bold <code>td</code> and they hear only "9".</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — using a table for page layout.</strong> Twenty years ago, whole websites were laid out with invisible tables. It still works in the browser, and screen readers still announce "table with 3 columns" for your navigation, and it does not adapt to phones. Layout belongs to CSS Flexbox and Grid (Lessons 3.3 and 3.4). Use a table only when a spreadsheet would make sense. The exception is HTML email, which is another world.</p></div>

<h3>Step 2 — wide tables on small screens</h3>
<p>A table cannot shrink below its content, so on a phone it overflows and the whole page scrolls sideways. The simple solution is a wrapper that scrolls by itself: <code>&lt;div style="overflow-x: auto"&gt;&lt;table&gt;…&lt;/table&gt;&lt;/div&gt;</code>. Lesson 3.5 comes back to this. Do not set the table to <code>display: block</code>: it breaks the table semantics.</p>

<h3>Step 3 — video and audio</h3>
${ma('html', CODE['2-5/video.html'], [5, 12])}
${ra(OUT['2-5/video'])}
<p>That output was read from a real 3-second file in Chromium. <code>controls</code> gives you a full player (play, seek, volume, full screen, captions) with no JavaScript. The attributes you will use most:</p>
<table>
<thead><tr><th>Attribute</th><th>Does</th></tr></thead>
<tbody>
<tr><td><code>controls</code></td><td>Shows the player. Without it, the video has no buttons at all</td></tr>
<tr><td><code>width</code>, <code>height</code></td><td>Reserve the space, as with images</td></tr>
<tr><td><code>poster</code></td><td>The image displayed before playing</td></tr>
<tr><td><code>preload</code></td><td><code>none</code> / <code>metadata</code> / <code>auto</code>: how much to download early</td></tr>
<tr><td><code>muted</code>, <code>loop</code>, <code>playsinline</code></td><td>Silent, repeating, not forced full screen on phones</td></tr>
<tr><td><code>autoplay</code></td><td>Starts by itself; browsers allow this only if it is <code>muted</code></td></tr>
</tbody>
</table>
<p>The <code>track</code> element adds captions from a small text file in <strong>WebVTT</strong> format. It is just times and text:</p>
${ma('text', CODE['2-5/media/clip.vtt'])}
<p>The text between the opening and closing <code>video</code> tags is a fallback for browsers that cannot play it. <code>audio</code> works the same way. For a video that has to reach many people, YouTube or a similar service handles the compression; the embed is an <code>iframe</code>, which must have a <code>title</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — a video background that autoplays with sound.</strong> Browsers block autoplay with sound, so it does not start at all; and if you force it, you drive people away and drown out screen readers. Autoplay only when <code>muted</code>, offer a pause button, and respect <code>prefers-reduced-motion</code> (Lesson 12.2). A 30 MB background video also costs your phone visitors real money.</p></div>

<h3>Step 4 — who has trouble using a page?</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Seeing</span><span class="lz-t">blind, low vision, colour blindness</span><span class="lz-d">Need screen readers, zoom, contrast. Your tools: <code>alt</code>, headings, labels, contrast, never colour alone.</span></div>
<div class="lz-layer"><span class="lz-k">Hearing</span><span class="lz-t">deaf, hard of hearing, noisy room</span><span class="lz-d">Need captions and transcripts. Your tools: <code>track</code>, a text version.</span></div>
<div class="lz-layer"><span class="lz-k">Moving</span><span class="lz-t">cannot use a mouse, tremor, broken arm</span><span class="lz-d">Need a keyboard, voice control, big targets. Your tools: real controls, visible focus.</span></div>
<div class="lz-layer"><span class="lz-k">Understanding</span><span class="lz-t">dyslexia, attention, second language</span><span class="lz-d">Need clear text and predictable pages. Your tools: plain language, <code>lang</code>, consistent navigation.</span></div>
</div>
<p>These needs are not rare, and many are temporary: you holding a baby use one hand; sunlight on your phone is low contrast; a loud café is a hearing limit. Captions were made for deaf people and are now turned on by a large share of everyone who watches video.</p>

<h3>Step 5 — contrast is a number</h3>
<p>You do not need taste to judge whether text is readable. The WCAG guidelines define a formula from the brightness of the two colours. This page calculates it for the real colours on the page:</p>
${ma('html', CODE['2-5/tuong-phan.html'], [6, 10])}
${ra(OUT['2-5/tuong-phan'])}
<p>The AA level asks for 4.5:1 for normal text and 3:1 for large text. <code>#767676</code> is the lightest grey that passes on white. White on a bright orange looks energetic and fails. Chrome DevTools shows the ratio when you click the colour swatch of a text colour in the Styles tab.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — using colour alone to carry meaning.</strong> "Fields in red are required", or a chart whose lines differ only by colour, say nothing to the 1 in 12 men with red-green colour blindness, or to anyone printing in black and white. Add a second signal: an asterisk and the word "required", an icon, a label directly on the line.</p></div>

<h3>Step 6 — keyboard order and focus</h3>
<p>The Tab key visits focusable elements in <strong>document order</strong>. <code>tabindex</code> changes that:</p>
${ma('html', CODE['2-5/tab-thu-tu.html'], [5, 10])}
${ra(OUT['_t2/out/tab-thu-tu'])}
<p>We pressed the real Tab key. Positive values jump ahead of everything: <code>cancel</code> (1) and <code>save</code> (2) come first, although they are later or in the middle of the page. The plain <code>div</code> with an <code>onclick</code> never receives focus. <code>tabindex="0"</code> puts an element into the normal order.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">tabindex="0"</span><span class="v">Add to the normal Tab order. Only for custom widgets.</span></div>
  <div class="kv"><span class="k">tabindex="-1"</span><span class="v">Not reachable by Tab, but focusable by script. Useful for moving focus into a dialog.</span></div>
  <div class="kv"><span class="k">tabindex="1"+</span><span class="v">Never. It breaks the order of the entire page.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>outline: none</code>.</strong> The focus ring looks ugly to some designers, so one CSS line removes it everywhere. Keyboard users then cannot see where they are: it is like hiding the mouse pointer. Keep it, or replace it with your own <code>:focus-visible</code> style (Lesson 3.1).</p></div>

<h3>Step 7 — the five-minute check</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Keyboard only</span><span class="lz-d">Tab through it. Can you reach and use everything? Is focus visible? Is the order sensible?</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Outline</span><span class="lz-d">One <code>h1</code>, no skipped levels. Do the headings alone tell you what the page contains?</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Images and labels</span><span class="lz-d">Every image has <code>alt</code>; every input has a label; every icon button has a name.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Automatic audit</span><span class="lz-d">DevTools → Lighthouse → Accessibility. It finds perhaps a third of the issues, the easy ones.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Zoom to 200%</span><span class="lz-d">Does the content still fit? Is nothing cut off?</span></div>
</div>
<p>Also set <code>lang</code> on <code>html</code>. If you can, spend ten minutes with a real screen reader: VoiceOver is built into macOS (Cmd+F5), and NVDA is free on Windows. It is the fastest way to understand what this lesson is about.</p>

<div class="callout ok">
<p><strong>🧪 Practice (30 minutes) — a report page that everyone can use</strong></p>
<ol>
<li>Build a page "My semester report" with a full skeleton, <code>lang</code>, landmarks and one <code>h1</code>.</li>
<li>Add a <code>table</code> of your subjects with <code>caption</code>, <code>thead</code>, <code>tbody</code>, <code>tfoot</code>, <code>th scope</code>, and one <code>colspan</code> for the average.</li>
<li>Add a video (a phone clip is fine; keep it under 10 MB) with <code>controls</code>, <code>width</code>, <code>height</code>, a fallback link, and a two-line <code>.vtt</code> caption file.</li>
<li>Style the headings with a colour you think looks nice, and check its contrast in DevTools.</li>
</ol>
<p>Hint: files opened from the disk may not load captions. Serve the folder with VS Code Live Server, or run <code>npx serve</code>.</p>
<p><strong>Done when:</strong> Tab reaches the video controls in a sensible order; Lighthouse gives Accessibility 100, or you can explain each remaining item; every text colour measures at least 4.5:1; and captions show during playback. Code Lab module 2.5 then grades tables, media and contrast fixes.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">table / row / cell</span><span class="v">bảng / hàng / ô.</span></div>
  <div class="kv"><span class="k">header cell</span><span class="v">ô tiêu đề — <code>th</code>, có <code>scope</code>.</span></div>
  <div class="kv"><span class="k">caption</span><span class="v">chú thích của bảng; cũng là phụ đề trên video.</span></div>
  <div class="kv"><span class="k">colspan / rowspan</span><span class="v">ô trải qua nhiều cột / hàng.</span></div>
  <div class="kv"><span class="k">WebVTT</span><span class="v">định dạng tệp phụ đề cho web.</span></div>
  <div class="kv"><span class="k">autoplay</span><span class="v">tự phát — chỉ được phép khi tắt tiếng.</span></div>
  <div class="kv"><span class="k">a11y</span><span class="v">accessibility — khả năng tiếp cận.</span></div>
  <div class="kv"><span class="k">WCAG</span><span class="v">bộ hướng dẫn tiếp cận nội dung web.</span></div>
  <div class="kv"><span class="k">contrast ratio</span><span class="v">tỉ số tương phản — AA cần 4,5:1.</span></div>
  <div class="kv"><span class="k">tabindex</span><span class="v">thứ tự nhận tiêu điểm bằng Tab.</span></div>
  <div class="kv"><span class="k">focus ring</span><span class="v">viền tiêu điểm — cho biết đang ở đâu.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Tables are for data, never for layout. <code>caption</code>, <code>th scope</code> and the groups make them readable aloud.</li>
  <li><code>video</code> with <code>controls</code> is a full player; add <code>track</code> captions and reserve the size.</li>
  <li>Autoplay works only when muted; do not use it for attention.</li>
  <li>Barriers: seeing, hearing, moving, understanding. Many are temporary.</li>
  <li>Contrast is measurable: 4.5:1 for normal text. Never use colour alone.</li>
  <li>Tab follows the document; positive <code>tabindex</code> breaks it; never remove the focus ring.</li>
  <li>Five minutes before "done": keyboard, outline, alt and labels, Lighthouse, 200% zoom.</li>
</ul>
${nguon('📗', 'MDN — HTML table basics', 'Rows, headers, scope, and accessible tables', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_table_basics')}
${nguon('📘', 'WebAIM — Contrast Checker', 'Type two colours and get the ratio', 'https://webaim.org/resources/contrastchecker/')}
${nguon('📙', 'WCAG 2 at a Glance', 'The official short version of the guidelines', 'https://www.w3.org/WAI/standards-guidelines/wcag/glance/')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-a11y-xuat-ban', title: 'WED201c (Academy) — accessibility and publishing', sub: 'The same checks as part of publishing a site', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Bảng, media — và bảo đảm ai cũng dùng được trang của bạn</h2>
<p class="lead">Học xong bài này bạn đánh dấu được một bảng dữ liệu để trình đọc màn hình đọc được, nhúng video và âm thanh kèm phụ đề, đo độ tương phản màu thay vì đoán, giữ thứ tự bàn phím hợp lý, và chạy một phép kiểm trợ năng năm phút trên mọi trang. Bạn cần điều này vì khả năng tiếp cận (thường viết tắt <strong>a11y</strong>: "a", mười một chữ, "y") không phải tính năng riêng. Nó là tính chất của HTML làm tốt, nó cải thiện trang cho tất cả mọi người, và ở nhiều nước nó là yêu cầu pháp lý với dịch vụ công.</p>

<h3>Bước 1 — bảng dành cho dữ liệu</h3>
<p>Bảng dành cho dữ liệu thật sự có hàng và cột: mỗi ô có nghĩa nhờ hàng và cột của nó. Đây là một bảng hoàn chỉnh:</p>
${ma('html', CODE['2-5/bang.html'], [13, 25])}
${ra(OUT['2-5/bang'])}
<div class="kv-grid">
  <div class="kv"><span class="k">caption</span><span class="v">Tên của bảng. Trình đọc màn hình đọc đầu tiên.</span></div>
  <div class="kv"><span class="k">thead, tbody, tfoot</span><span class="v">Nhóm đầu, thân và chân bảng. Có ích cho CSS, in ấn và công nghệ hỗ trợ.</span></div>
  <div class="kv"><span class="k">tr</span><span class="v">Một hàng.</span></div>
  <div class="kv"><span class="k">th</span><span class="v">Ô tiêu đề. <code>scope="col"</code> hoặc <code>scope="row"</code> nói nó làm tiêu đề cho gì.</span></div>
  <div class="kv"><span class="k">td</span><span class="v">Ô dữ liệu.</span></div>
  <div class="kv"><span class="k">colspan, rowspan</span><span class="v">Ô trải qua nhiều cột hoặc hàng.</span></div>
</div>
<p>Ảnh chụp ở slide 3. Giờ tới phần bạn không nhìn thấy. Đây là cây trợ năng Chromium đã dựng:</p>
${ra(OUT['_t2/out/aria-bang'])}
<p>Mỗi tiêu đề đã thành <code>columnheader</code> hoặc <code>rowheader</code>. Nên người dùng trình đọc màn hình tới ô "9" sẽ nghe "An, HTML, 9", và di chuyển được lên, xuống, trái, phải. Thay <code>th</code> bằng <code>td</code> in đậm thì họ chỉ nghe "9".</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — dùng bảng để dàn trang.</strong> Hai mươi năm trước, cả website được dàn bằng bảng vô hình. Trong trình duyệt nó vẫn chạy, nhưng trình đọc màn hình vẫn thông báo "bảng 3 cột" cho thanh điều hướng của bạn, và nó không thích ứng với điện thoại. Bố cục thuộc về CSS Flexbox và Grid (Bài 3.3 và 3.4). Chỉ dùng bảng khi một bảng tính có nghĩa. Ngoại lệ là email HTML, vốn là một thế giới khác.</p></div>

<h3>Bước 2 — bảng rộng trên màn hình nhỏ</h3>
<p>Bảng không co nhỏ hơn nội dung của nó, nên trên điện thoại nó tràn ra và cả trang cuộn ngang. Giải pháp đơn giản là một lớp bọc tự cuộn: <code>&lt;div style="overflow-x: auto"&gt;&lt;table&gt;…&lt;/table&gt;&lt;/div&gt;</code>. Bài 3.5 sẽ quay lại. Đừng đặt bảng thành <code>display: block</code>: nó phá ngữ nghĩa của bảng.</p>

<h3>Bước 3 — video và âm thanh</h3>
${ma('html', CODE['2-5/video.html'], [5, 12])}
${ra(OUT['2-5/video'])}
<p>Output đó đọc từ một tệp thật dài 3 giây trong Chromium. <code>controls</code> cho bạn trình phát đầy đủ (phát, tua, âm lượng, toàn màn hình, phụ đề) mà không cần JavaScript. Những thuộc tính hay dùng nhất:</p>
<table>
<thead><tr><th>Thuộc tính</th><th>Tác dụng</th></tr></thead>
<tbody>
<tr><td><code>controls</code></td><td>Hiện trình phát. Thiếu nó video không có nút nào</td></tr>
<tr><td><code>width</code>, <code>height</code></td><td>Giữ chỗ, như với ảnh</td></tr>
<tr><td><code>poster</code></td><td>Ảnh hiện trước khi phát</td></tr>
<tr><td><code>preload</code></td><td><code>none</code> / <code>metadata</code> / <code>auto</code>: tải trước bao nhiêu</td></tr>
<tr><td><code>muted</code>, <code>loop</code>, <code>playsinline</code></td><td>Tắt tiếng, lặp, không ép toàn màn hình trên điện thoại</td></tr>
<tr><td><code>autoplay</code></td><td>Tự chạy; trình duyệt chỉ cho phép khi có <code>muted</code></td></tr>
</tbody>
</table>
<p>Phần tử <code>track</code> thêm phụ đề từ một tệp chữ nhỏ định dạng <strong>WebVTT</strong>. Nó chỉ là thời gian và chữ:</p>
${ma('text', CODE['2-5/media/clip.vtt'])}
<p>Chữ giữa thẻ mở và thẻ đóng <code>video</code> là dự phòng cho trình duyệt không phát được. <code>audio</code> dùng y như vậy. Với video cần tới nhiều người, YouTube hay dịch vụ tương tự lo phần nén; nhúng bằng <code>iframe</code>, nhớ phải có <code>title</code>.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — video nền tự chạy kèm tiếng.</strong> Trình duyệt chặn tự chạy có tiếng, nên nó chẳng chạy; còn nếu ép, bạn sẽ đuổi người xem đi và lấn át trình đọc màn hình. Chỉ tự chạy khi <code>muted</code>, có nút tạm dừng, và tôn trọng <code>prefers-reduced-motion</code> (Bài 12.2). Một video nền 30 MB còn làm người xem điện thoại tốn tiền thật.</p></div>

<h3>Bước 4 — ai gặp khó khăn khi dùng một trang?</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Nhìn</span><span class="lz-t">khiếm thị, nhìn kém, mù màu</span><span class="lz-d">Cần trình đọc màn hình, phóng to, tương phản. Công cụ của bạn: <code>alt</code>, tiêu đề, nhãn, tương phản, không dựa riêng vào màu.</span></div>
<div class="lz-layer"><span class="lz-k">Nghe</span><span class="lz-t">khiếm thính, nghe kém, phòng ồn</span><span class="lz-d">Cần phụ đề và bản chép lời. Công cụ của bạn: <code>track</code>, một bản chữ.</span></div>
<div class="lz-layer"><span class="lz-k">Vận động</span><span class="lz-t">không dùng được chuột, run tay, gãy tay</span><span class="lz-d">Cần bàn phím, điều khiển giọng nói, vùng bấm lớn. Công cụ của bạn: điều khiển thật, tiêu điểm nhìn thấy.</span></div>
<div class="lz-layer"><span class="lz-k">Hiểu</span><span class="lz-t">chứng khó đọc, khó tập trung, ngoại ngữ</span><span class="lz-d">Cần chữ rõ ràng và trang dễ đoán. Công cụ của bạn: ngôn ngữ đơn giản, <code>lang</code>, điều hướng nhất quán.</span></div>
</div>
<p>Những nhu cầu này không hiếm, và nhiều cái chỉ tạm thời: bế con thì chỉ còn một tay; nắng chiếu vào điện thoại là tương phản thấp; quán cà phê ồn là hạn chế về nghe. Phụ đề được làm cho người khiếm thính và giờ được bật bởi một phần lớn mọi người xem video.</p>

<h3>Bước 5 — tương phản là một con số</h3>
<p>Bạn không cần gu thẩm mỹ để đánh giá chữ có đọc được không. Hướng dẫn WCAG định nghĩa một công thức từ độ sáng của hai màu. Trang này tính nó cho chính các màu trên trang:</p>
${ma('html', CODE['2-5/tuong-phan.html'], [6, 10])}
${ra(OUT['2-5/tuong-phan'])}
<p>Mức AA yêu cầu 4,5:1 cho chữ thường và 3:1 cho chữ lớn. <code>#767676</code> là màu xám nhạt nhất đạt trên nền trắng. Chữ trắng trên cam tươi trông năng động mà trượt. DevTools của Chrome hiện tỉ số khi bạn bấm vào ô màu của màu chữ trong thẻ Styles.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — dùng riêng màu để mang ý nghĩa.</strong> "Ô màu đỏ là bắt buộc", hay một biểu đồ có các đường chỉ khác nhau về màu, chẳng nói gì với 1 trên 12 nam giới mù màu đỏ-lục, hay với ai in đen trắng. Hãy thêm tín hiệu thứ hai: dấu sao và chữ "bắt buộc", một biểu tượng, một nhãn ngay trên đường.</p></div>

<h3>Bước 6 — thứ tự bàn phím và tiêu điểm</h3>
<p>Phím Tab đi qua các phần tử nhận tiêu điểm theo <strong>thứ tự tài liệu</strong>. <code>tabindex</code> thay đổi điều đó:</p>
${ma('html', CODE['2-5/tab-thu-tu.html'], [5, 10])}
${ra(OUT['_t2/out/tab-thu-tu'])}
<p>Ta nhấn phím Tab thật. Giá trị dương nhảy lên trước mọi thứ: <code>cancel</code> (1) và <code>save</code> (2) đến trước, dù chúng nằm sau hoặc giữa trang. <code>div</code> trần có <code>onclick</code> không bao giờ nhận tiêu điểm. <code>tabindex="0"</code> đưa phần tử vào thứ tự bình thường.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">tabindex="0"</span><span class="v">Thêm vào thứ tự Tab bình thường. Chỉ cho điều khiển tự tạo.</span></div>
  <div class="kv"><span class="k">tabindex="-1"</span><span class="v">Tab không tới được, nhưng script đặt tiêu điểm được. Có ích khi chuyển tiêu điểm vào hộp thoại.</span></div>
  <div class="kv"><span class="k">tabindex="1"+</span><span class="v">Không bao giờ. Nó phá thứ tự của cả trang.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>outline: none</code>.</strong> Vài nhà thiết kế thấy viền tiêu điểm xấu, nên một dòng CSS gỡ nó khắp nơi. Người dùng bàn phím liền không biết mình đang ở đâu: giống như giấu con trỏ chuột. Hãy giữ nó, hoặc thay bằng kiểu <code>:focus-visible</code> của riêng bạn (Bài 3.1).</p></div>

<h3>Bước 7 — phép kiểm năm phút</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Chỉ bàn phím</span><span class="lz-d">Tab qua trang. Có tới và dùng được mọi thứ không? Tiêu điểm có thấy không? Thứ tự có hợp lý không?</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Dàn ý</span><span class="lz-d">Một <code>h1</code>, không nhảy cấp. Chỉ đọc tiêu đề có biết trang chứa gì không?</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Ảnh và nhãn</span><span class="lz-d">Ảnh nào cũng có <code>alt</code>; ô nào cũng có nhãn; nút biểu tượng nào cũng có tên.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Kiểm tự động</span><span class="lz-d">DevTools → Lighthouse → Accessibility. Nó tìm được chừng một phần ba vấn đề, những cái dễ.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Phóng to 200%</span><span class="lz-d">Nội dung còn vừa không? Có gì bị cắt không?</span></div>
</div>
<p>Cũng nhớ đặt <code>lang</code> trên <code>html</code>. Nếu có thể, hãy dành mười phút với một trình đọc màn hình thật: VoiceOver có sẵn trên macOS (Cmd+F5), NVDA miễn phí trên Windows. Đó là cách nhanh nhất để hiểu bài này nói về điều gì.</p>

<div class="callout ok">
<p><strong>🧪 Luyện tập (30 phút) — một trang báo cáo ai cũng dùng được</strong></p>
<ol>
<li>Dựng trang "Báo cáo học kỳ của tôi" với đủ bộ khung, <code>lang</code>, các mốc và một <code>h1</code>.</li>
<li>Thêm <code>table</code> các môn học với <code>caption</code>, <code>thead</code>, <code>tbody</code>, <code>tfoot</code>, <code>th scope</code>, và một <code>colspan</code> cho điểm trung bình.</li>
<li>Thêm một video (clip điện thoại cũng được; dưới 10 MB) với <code>controls</code>, <code>width</code>, <code>height</code>, liên kết dự phòng, và một tệp phụ đề <code>.vtt</code> hai dòng.</li>
<li>Tô màu cho tiêu đề theo màu bạn thấy đẹp, và kiểm độ tương phản trong DevTools.</li>
</ol>
<p>Gợi ý: tệp mở từ đĩa có thể không tải được phụ đề. Hãy phục vụ thư mục bằng VS Code Live Server, hoặc chạy <code>npx serve</code>.</p>
<p><strong>Xong khi:</strong> Tab tới được các nút của video theo thứ tự hợp lý; Lighthouse cho Accessibility 100, hoặc bạn giải thích được từng mục còn lại; mọi màu chữ đo được ít nhất 4,5:1; và phụ đề hiện khi phát. Sau đó module Code Lab 2.5 chấm bảng, media và sửa tương phản.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">table / row / cell</span><span class="v">bảng / hàng / ô.</span></div>
  <div class="kv"><span class="k">header cell</span><span class="v">ô tiêu đề — <code>th</code>, có <code>scope</code>.</span></div>
  <div class="kv"><span class="k">caption</span><span class="v">chú thích của bảng; cũng là phụ đề trên video.</span></div>
  <div class="kv"><span class="k">colspan / rowspan</span><span class="v">ô trải qua nhiều cột / hàng.</span></div>
  <div class="kv"><span class="k">WebVTT</span><span class="v">định dạng tệp phụ đề cho web.</span></div>
  <div class="kv"><span class="k">autoplay</span><span class="v">tự phát — chỉ được phép khi tắt tiếng.</span></div>
  <div class="kv"><span class="k">a11y</span><span class="v">accessibility — khả năng tiếp cận.</span></div>
  <div class="kv"><span class="k">WCAG</span><span class="v">bộ hướng dẫn tiếp cận nội dung web.</span></div>
  <div class="kv"><span class="k">contrast ratio</span><span class="v">tỉ số tương phản — AA cần 4,5:1.</span></div>
  <div class="kv"><span class="k">tabindex</span><span class="v">thứ tự nhận tiêu điểm bằng Tab.</span></div>
  <div class="kv"><span class="k">focus ring</span><span class="v">viền tiêu điểm — cho biết đang ở đâu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Bảng dành cho dữ liệu, không bao giờ để dàn trang. <code>caption</code>, <code>th scope</code> và các nhóm giúp nó đọc to được.</li>
  <li><code>video</code> có <code>controls</code> là trình phát đầy đủ; thêm phụ đề <code>track</code> và giữ chỗ kích thước.</li>
  <li>Tự chạy chỉ được khi tắt tiếng; đừng dùng để gây chú ý.</li>
  <li>Rào cản: nhìn, nghe, vận động, hiểu. Nhiều cái chỉ tạm thời.</li>
  <li>Tương phản đo được: 4,5:1 cho chữ thường. Đừng dựa riêng vào màu.</li>
  <li>Tab đi theo tài liệu; <code>tabindex</code> dương phá nó; không bao giờ gỡ viền tiêu điểm.</li>
  <li>Năm phút trước khi "xong": bàn phím, dàn ý, alt và nhãn, Lighthouse, phóng to 200%.</li>
</ul>
${nguon('📗', 'MDN — HTML table basics', 'Hàng, tiêu đề, scope, và bảng dễ tiếp cận', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/HTML_table_basics')}
${nguon('📘', 'WebAIM — Contrast Checker', 'Gõ hai màu và nhận tỉ số', 'https://webaim.org/resources/contrastchecker/')}
${nguon('📙', 'WCAG 2 at a Glance', 'Bản tóm tắt chính thức của hướng dẫn', 'https://www.w3.org/WAI/standards-guidelines/wcag/glance/')}
${lienKet({ khoa: 'web-design', bai: 'wed201c-a11y-xuat-ban', title: 'WED201c (Academy) — tiếp cận và xuất bản', sub: 'Cùng các phép kiểm, như một phần của việc xuất bản trang', cta: 'Mở bài' })}
</div>
`,
};
