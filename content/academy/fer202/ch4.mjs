/**
 * FER202 · Chapter 4 additions — Bootstrap (Slot 4–5, 55 slides) and
 * React-Bootstrap (Slot 7, 24 slides), plus Exercises 5, 6, 7, 8 (Bootstrap)
 * and 10 (React-Bootstrap). Grounded slide-by-slide in Slot4,5_Bootstrap.pptx
 * and Slot7_React-BootStrap.pptx. Spliced into Chapter 4 before its quiz.
 */
import { walk, walkHead, bi, books } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Ffront-end-web-development-with-react%2Flearn&reflabel=FER202';
const CODELAB = `/code-lab/react${REF}`;
const EXPHUB = `/exp-hub${REF}`;

/* ═══════════ 4.3 — Slide walkthrough: Bootstrap (Slot 4–5) ═══════════ */
const BOOTSTRAP = {
  title: '4.2 — Slide by slide: Bootstrap layout & components (Slot 4–5)|||4.2 — Học theo từng slide: Layout & component Bootstrap (Slot 4–5)',
  slug: 'fer202-4-3-slot4-bootstrap-slides',
  type: 'DOCUMENT',
  description: 'Toàn bộ 55 slide Slot 4–5: UI framework, giới thiệu Bootstrap, cài bằng CDN/npm, hệ lưới (grid) trên Flexbox, container, cột auto & responsive, căn & sắp lại thứ tự, và các component JS (collapse/accordion, tooltip/popover/modal, navbar/nav/tab, carousel, card, form) — mỗi slide giải thích song ngữ.',
  content: [
    bi(
      `<span class="eyebrow">Chapter 4 · Lesson 4.3 · Slot 4–5 deck (55 slides)</span>
<h2>Bootstrap, slide by slide</h2>
<p class="lead">Bootstrap lets you build a responsive, good-looking UI fast, without writing CSS from scratch. This is the full Slot 4–5 deck: the grid system (the part you use every day) and the ready-made JavaScript components. Exercises 5–8 are the next lessons.</p>`,
      `<span class="eyebrow">Chương 4 · Bài 4.3 · Bộ slide Slot 4–5 (55 slide)</span>
<h2>Bootstrap, theo từng slide</h2>
<p class="lead">Bootstrap giúp bạn dựng UI đẹp, responsive rất nhanh mà không phải viết CSS từ đầu. Đây là trọn bộ Slot 4–5: hệ lưới (phần dùng mỗi ngày) và các component JavaScript dựng sẵn. Exercise 5–8 nằm ở các bài kế.</p>`,
    ),
    walkHead('slot4_5', 1, 55),
    walk('slot4_5', [
      [1, 'Introduction to Bootstrap layout & JavaScript components', `<p>Title slide: the deck has two halves — the grid layout system, then the JS components.</p>`, `<p>Slide bìa: bộ slide có hai nửa — hệ lưới layout, rồi các component JS.</p>`],
      [2, 'Objectives', `<p>What Slot 4–5 covers: front-end UI frameworks, Bootstrap intro &amp; setup, the grid system, and the JavaScript components (collapse, modal, navbar, carousel, cards, forms).</p>`, `<p>Slot 4–5 học gì: UI framework front-end, giới thiệu &amp; cài Bootstrap, hệ lưới, và các component JavaScript (collapse, modal, navbar, carousel, card, form).</p>`],
      [3, 'Front-end web UI frameworks', `<p>Section divider — first, what a UI framework is and why to use one.</p>`, `<p>Slide phân mục — trước hết, UI framework là gì và vì sao nên dùng.</p>`],
      [4, 'What are front-end UI frameworks?', `<p>A <strong>collection of ready-to-use HTML, CSS and JavaScript templates</strong> for common UI components: typography, forms, buttons, tables, navigation, dropdowns, alerts, modals, tabs, accordion, carousel… You get consistent, tested building blocks instead of reinventing each one.</p>`, `<p>Một <strong>bộ template HTML, CSS và JavaScript dựng sẵn</strong> cho các UI component thông dụng: typography, form, nút, bảng, điều hướng, dropdown, alert, modal, tab, accordion, carousel… Bạn có các khối dựng nhất quán, đã kiểm thử, khỏi làm lại từng cái.</p>`],
      [5, 'Popular front-end UI frameworks', `<p>The field: <strong>Bootstrap</strong>, Semantic-UI, Foundation, Materialize, Material UI, Pure, Skeleton, UIKit, Milligram, Susy. Bootstrap is the most widely used; Material UI (MUI) is the most popular React-specific one.</p>`, `<p>Các lựa chọn: <strong>Bootstrap</strong>, Semantic-UI, Foundation, Materialize, Material UI, Pure, Skeleton, UIKit, Milligram, Susy. Bootstrap phổ biến nhất; Material UI (MUI) là bộ dành riêng cho React phổ biến nhất.</p>`],
      [6, 'Why front-end UI frameworks?', `<p>The benefits: <strong>responsive</strong> design, <strong>mobile-first</strong>, cross-browser compatibility (they smooth over browser quirks), increased productivity, easy to start, strong community, and lots of resources and templates.</p>`, `<p>Lợi ích: thiết kế <strong>responsive</strong>, <strong>mobile-first</strong>, tương thích đa trình duyệt (xử lý các điểm khác biệt của browser), tăng năng suất, dễ bắt đầu, cộng đồng mạnh, và nhiều tài nguyên/template.</p>`],
      [7, 'Introduction to Bootstrap', `<p>Section divider — now Bootstrap specifically.</p>`, `<p>Slide phân mục — giờ đi vào Bootstrap.</p>`],
      [8, 'Bootstrap overview', `<p><strong>The most popular HTML, CSS and JS framework for responsive, mobile-first projects.</strong> It ships design templates for typography, forms, buttons, tables, navigation, modals, image carousels and more, plus optional JavaScript plugins.</p>`, `<p><strong>Framework HTML, CSS, JS phổ biến nhất cho dự án responsive, mobile-first.</strong> Nó có template thiết kế cho typography, form, nút, bảng, điều hướng, modal, carousel ảnh… cùng các plugin JavaScript tuỳ chọn.</p>`],
      [9, 'Bootstrap history', `<p>First released <strong>2011</strong> by <strong>Mark Otto and Jacob Thornton</strong> (at Twitter). Current production version <strong>5.3</strong>. It was the first comprehensive framework and gained popularity fast. Note: Bootstrap 5 <strong>dropped jQuery</strong> — it is now vanilla JS.</p>`, `<p>Ra mắt lần đầu <strong>2011</strong> bởi <strong>Mark Otto và Jacob Thornton</strong> (ở Twitter). Bản production hiện tại <strong>5.3</strong>. Nó là framework toàn diện đầu tiên và nổi nhanh. Lưu ý: Bootstrap 5 <strong>bỏ jQuery</strong> — nay là JS thuần.</p>`],
      [10, 'Bootstrap files', `<p>Bootstrap is two things: <code>bootstrap.min.css</code> (all the classes) and <code>bootstrap.bundle.min.js</code> (the interactive components, bundling Popper for positioning). You include one CSS file and one JS bundle.</p>`, `<p>Bootstrap gồm hai thứ: <code>bootstrap.min.css</code> (mọi class) và <code>bootstrap.bundle.min.js</code> (các component tương tác, gói kèm Popper để định vị). Bạn nhúng một file CSS và một bundle JS.</p>`],
      [11, 'Viewport', `<p>The one meta tag every responsive site needs: <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code>. It tells the browser to use the device's real width so the grid can respond to screen size. Without it, mobile browsers pretend to be ~980px wide and your responsive design does nothing.</p>`, `<p>Thẻ meta duy nhất mọi trang responsive cần: <code>&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code>. Nó bảo trình duyệt dùng chiều rộng thật của thiết bị để lưới đáp ứng theo kích thước màn hình. Thiếu nó, trình duyệt di động giả vờ rộng ~980px và thiết kế responsive vô hiệu.</p>`],
      [12, 'Using Bootstrap by CDN', `<p>Fastest start: put the <code>&lt;link&gt;</code> to <code>bootstrap.min.css</code> in <code>&lt;head&gt;</code> and the <code>&lt;script&gt;</code> for <code>bootstrap.bundle.min.js</code> before <code>&lt;/body&gt;</code> (from cdn.jsdelivr.net). The bundle already includes Popper for dropdowns, popovers and tooltips.</p>`, `<p>Cách nhanh nhất: đặt <code>&lt;link&gt;</code> tới <code>bootstrap.min.css</code> trong <code>&lt;head&gt;</code> và <code>&lt;script&gt;</code> cho <code>bootstrap.bundle.min.js</code> trước <code>&lt;/body&gt;</code> (từ cdn.jsdelivr.net). Bundle đã kèm sẵn Popper cho dropdown, popover và tooltip.</p>`],
      [13, 'Using Bootstrap by terminal (npm)', `<p>For a real project: <code>npm init -y</code>, <code>npm install bootstrap</code>, then import Bootstrap's CSS/JS. The slide runs a local preview with <code>npx lite-server</code>. In a React app you instead <code>import 'bootstrap/dist/css/bootstrap.min.css'</code> in <code>index.js</code>.</p>`, `<p>Cho dự án thật: <code>npm init -y</code>, <code>npm install bootstrap</code>, rồi import CSS/JS của Bootstrap. Slide xem trước cục bộ bằng <code>npx lite-server</code>. Trong app React thì <code>import 'bootstrap/dist/css/bootstrap.min.css'</code> trong <code>index.js</code>.</p>`],
      [14, 'Exercise 5: Getting started with Bootstrap', `<p>Hand-off to <strong>Exercise 5</strong> — install Bootstrap and make a page "Bootstrap ready". Full steps in the next lesson.</p>`, `<p>Chuyển sang <strong>Exercise 5</strong> — cài Bootstrap và làm một trang "sẵn sàng Bootstrap". Các bước đầy đủ ở bài kế.</p>`],
      [15, 'Bootstrap grid', `<p>Section divider — the grid, the heart of Bootstrap layout.</p>`, `<p>Slide phân mục — hệ lưới, trái tim của layout Bootstrap.</p>`],
      [16, 'CSS Flexbox layout', `<p>Bootstrap 5's grid is built on <strong>CSS Flexbox</strong>. Flexbox lays items along a main axis with easy alignment and distribution — the foundation the grid classes wrap in a friendly API.</p>`, `<p>Lưới Bootstrap 5 dựng trên <strong>CSS Flexbox</strong>. Flexbox xếp phần tử theo một trục chính với căn chỉnh và phân bố dễ dàng — nền tảng mà các class lưới bọc lại thành API thân thiện.</p>`],
      [17, 'Why Flexbox for Bootstrap?', `<p>Flexbox gives the grid its powers: equal-height columns, vertical/horizontal alignment, automatic sizing and easy reordering — all without floats or clearfix hacks the old grid needed.</p>`, `<p>Flexbox cho lưới các sức mạnh: cột cao bằng nhau, căn dọc/ngang, tự chia kích thước và sắp xếp lại dễ dàng — không cần float hay clearfix như lưới cũ.</p>`],
      [18, 'Bootstrap container', `<p>Everything starts in a <strong>container</strong>: <code>.container</code> (fixed max-width per breakpoint) or <code>.container-fluid</code> (full width). The container provides the correct padding and centres your content.</p>`, `<p>Mọi thứ bắt đầu trong một <strong>container</strong>: <code>.container</code> (max-width cố định theo breakpoint) hoặc <code>.container-fluid</code> (rộng toàn phần). Container tạo padding đúng và căn giữa nội dung.</p>`],
      [19, 'Bootstrap grid — rows & columns', `<p>The structure: <code>.container</code> → <code>.row</code> → <code>.col</code>. A row is <strong>12 columns</strong> wide; children use <code>.col-*</code> to claim a share (<code>.col-6</code> = half). Columns must be direct children of a row.</p>`, `<p>Cấu trúc: <code>.container</code> → <code>.row</code> → <code>.col</code>. Một hàng rộng <strong>12 cột</strong>; con dùng <code>.col-*</code> để chiếm phần (<code>.col-6</code> = một nửa). Cột phải là con trực tiếp của row.</p>`],
      [20, 'Bootstrap grid — the 12-column system', `<p>Widths add up to 12: <code>.col-4 + .col-8</code> fills a row; three <code>.col-4</code> make three equal thirds. Go over 12 and the extra columns wrap to a new line.</p>`, `<p>Bề rộng cộng lại bằng 12: <code>.col-4 + .col-8</code> lấp một hàng; ba <code>.col-4</code> thành ba phần ba bằng nhau. Vượt 12 thì cột dư xuống hàng mới.</p>`],
      [21, 'Auto-layout columns', `<p>Plain <code>.col</code> (no number) splits the row into equal widths automatically. <code>.col-auto</code> sizes to its content. Mix them: one <code>.col-auto</code> and the rest <code>.col</code> share the remaining space.</p>`, `<p><code>.col</code> trơn (không số) tự chia hàng thành các phần bằng nhau. <code>.col-auto</code> vừa với nội dung. Trộn lại: một <code>.col-auto</code> và phần còn lại <code>.col</code> chia không gian dư.</p>`],
      [22, 'Responsive classes', `<p>Breakpoint infixes make columns respond: <code>.col-12 .col-md-6 .col-lg-4</code> = full width on phones, half on tablets (≥768px), a third on desktops (≥992px). Breakpoints: sm 576, md 768, lg 992, xl 1200, xxl 1400.</p>`, `<p>Chèn breakpoint làm cột đáp ứng: <code>.col-12 .col-md-6 .col-lg-4</code> = full trên điện thoại, nửa trên tablet (≥768px), một phần ba trên desktop (≥992px). Breakpoint: sm 576, md 768, lg 992, xl 1200, xxl 1400.</p>`],
      [23, 'Responsive classes — mobile-first', `<p>Bootstrap is <strong>mobile-first</strong>: an unqualified <code>.col-*</code> applies from that width <em>up</em>. Style the small screen first (<code>.col-12</code>), then override upward (<code>.col-md-6</code>). You never write "for large screens then shrink".</p>`, `<p>Bootstrap là <strong>mobile-first</strong>: <code>.col-*</code> không breakpoint áp dụng từ độ rộng đó <em>trở lên</em>. Style màn hình nhỏ trước (<code>.col-12</code>), rồi ghi đè lên trên (<code>.col-md-6</code>). Không bao giờ viết "cho màn lớn rồi thu nhỏ".</p>`],
      [24, 'Nesting columns', `<p>Put a new <code>.row</code> inside a <code>.col</code> to nest a sub-grid; the nested row is again 12 columns wide <em>within its parent column</em>. This builds complex layouts from the same simple rule.</p>`, `<p>Đặt một <code>.row</code> mới trong một <code>.col</code> để lồng lưới con; hàng lồng lại rộng 12 cột <em>trong cột cha của nó</em>. Cách này dựng layout phức tạp từ cùng một quy tắc đơn giản.</p>`],
      [25, 'Bootstrap column', `<p>Column utilities: <code>.offset-*</code> pushes a column right by N columns; gutters (<code>.g-*</code>) control the gap between columns. Combine with responsive infixes for per-breakpoint spacing.</p>`, `<p>Tiện ích cột: <code>.offset-*</code> đẩy cột sang phải N cột; gutter (<code>.g-*</code>) chỉnh khoảng cách giữa các cột. Kết hợp với breakpoint để giãn cách theo từng mức.</p>`],
      [26, 'Flexbox alignment', `<p>Because the grid is Flexbox, you align with utilities: <code>.justify-content-*</code> (start/center/end/between/around) along the main axis, <code>.align-items-*</code> along the cross axis. Centre a row's columns with <code>.justify-content-center</code>.</p>`, `<p>Vì lưới là Flexbox, bạn căn bằng tiện ích: <code>.justify-content-*</code> (start/center/end/between/around) theo trục chính, <code>.align-items-*</code> theo trục phụ. Căn giữa các cột trong hàng bằng <code>.justify-content-center</code>.</p>`],
      [27, 'Flexbox alignment — cont’d', `<p>Per-column alignment with <code>.align-self-*</code>, and full free-form Flexbox on any element with <code>.d-flex</code> + the same utilities — not just inside <code>.row</code>. This is how you align buttons, icons and text quickly.</p>`, `<p>Căn từng cột bằng <code>.align-self-*</code>, và Flexbox tự do trên bất kỳ phần tử nào với <code>.d-flex</code> + các tiện ích đó — không chỉ trong <code>.row</code>. Đây là cách căn nút, icon và text nhanh.</p>`],
      [28, 'Reordering', `<p><code>.order-*</code> (0–5, plus <code>.order-first</code>/<code>.order-last</code>) changes the visual order of columns without touching the HTML order. Great for putting a sidebar after the main content in the source but before it on desktop.</p>`, `<p><code>.order-*</code> (0–5, cùng <code>.order-first</code>/<code>.order-last</code>) đổi thứ tự hiển thị của cột mà không đụng thứ tự HTML. Rất hợp để đặt sidebar sau nội dung chính trong mã nhưng trước nó trên desktop.</p>`],
      [29, 'Reordering — responsive', `<p>Order is responsive too: <code>.order-md-1</code> reorders only from md up. Combine to show content in reading order on mobile and a designed order on desktop.</p>`, `<p>Thứ tự cũng responsive: <code>.order-md-1</code> chỉ sắp lại từ md trở lên. Kết hợp để hiện nội dung theo thứ tự đọc trên điện thoại và thứ tự thiết kế trên desktop.</p>`],
      [30, 'Reordering — cont’d', `<p>A caveat the slide implies: reordering changes <em>visual</em> order, not DOM order, so keyboard/tab navigation still follows the source. Do not use order to fix a logical structure — keep the HTML meaningful.</p>`, `<p>Một lưu ý slide ngụ ý: sắp lại đổi thứ tự <em>hiển thị</em>, không đổi thứ tự DOM, nên điều hướng bàn phím/tab vẫn theo mã nguồn. Đừng dùng order để "sửa" cấu trúc logic — giữ HTML có nghĩa.</p>`],
      [31, 'Exercise 6: Build a layout with the grid', `<p>Hand-off to <strong>Exercise 6</strong> — build a responsive page layout using the grid. Full brief in the lesson "Exercise 6 — Bootstrap grid layout".</p>`, `<p>Chuyển sang <strong>Exercise 6</strong> — dựng layout trang responsive bằng lưới. Đề đầy đủ ở bài "Exercise 6 — Layout lưới Bootstrap".</p>`],
      [32, '(section transition)', `<p>Blank transition slide in the deck — no content.</p>`, `<p>Slide chuyển mục trong bộ slide — không có nội dung chữ.</p>`],
      [33, 'Bootstrap JavaScript components', `<p>Section divider — the interactive components powered by the JS bundle.</p>`, `<p>Slide phân mục — các component tương tác chạy nhờ bundle JS.</p>`],
      [34, 'Bootstrap and JavaScript', `<p>Interactive components need <code>bootstrap.bundle.min.js</code>. In plain HTML you trigger them with <code>data-bs-*</code> attributes (no JS to write). In React you usually prefer React-Bootstrap (Slot 7) so components live in the React tree.</p>`, `<p>Component tương tác cần <code>bootstrap.bundle.min.js</code>. Trong HTML thuần bạn kích hoạt bằng thuộc tính <code>data-bs-*</code> (khỏi viết JS). Trong React thường dùng React-Bootstrap (Slot 7) để component nằm trong cây React.</p>`],
      [35, 'Bootstrap JS components', `<p>The catalogue this section demos: collapse/accordion, tooltips, popovers, modals, navbar, navs &amp; tabs, carousel, cards, forms.</p>`, `<p>Danh mục phần này demo: collapse/accordion, tooltip, popover, modal, navbar, nav &amp; tab, carousel, card, form.</p>`],
      [36, 'Collapse and Accordion', `<p><strong>Collapse</strong> shows/hides a panel; an <strong>Accordion</strong> is a group of collapses where opening one closes the others. Triggered by <code>data-bs-toggle="collapse"</code> / the <code>.accordion</code> structure.</p>`, `<p><strong>Collapse</strong> hiện/ẩn một panel; <strong>Accordion</strong> là nhóm collapse mà mở cái này thì đóng cái khác. Kích hoạt bằng <code>data-bs-toggle="collapse"</code> / cấu trúc <code>.accordion</code>.</p>`],
      [37, 'Tooltips, Popovers and Modals', `<p>Three overlay components introduced together: a <strong>tooltip</strong> (tiny hint on hover), a <strong>popover</strong> (richer box on click) and a <strong>modal</strong> (a blocking dialog). Tooltips/popovers use Popper for positioning.</p>`, `<p>Ba component lớp phủ giới thiệu cùng nhau: <strong>tooltip</strong> (gợi ý nhỏ khi hover), <strong>popover</strong> (hộp phong phú hơn khi bấm) và <strong>modal</strong> (hộp thoại chặn). Tooltip/popover dùng Popper để định vị.</p>`],
      [38, 'Tooltips', `<p>A small label on hover/focus: <code>data-bs-toggle="tooltip" title="..."</code>. Note tooltips are <strong>opt-in for performance</strong> — in plain Bootstrap you must initialise them in JS once.</p>`, `<p>Nhãn nhỏ khi hover/focus: <code>data-bs-toggle="tooltip" title="..."</code>. Lưu ý tooltip <strong>phải bật thủ công vì hiệu năng</strong> — trong Bootstrap thuần bạn phải khởi tạo bằng JS một lần.</p>`],
      [39, 'Popovers', `<p>Like a tooltip but bigger and click-triggered, with a title and body: <code>data-bs-toggle="popover"</code>. Also opt-in. Use for short help text that needs more than one line.</p>`, `<p>Giống tooltip nhưng to hơn và mở khi bấm, có tiêu đề và thân: <code>data-bs-toggle="popover"</code>. Cũng phải bật. Dùng cho đoạn trợ giúp ngắn cần hơn một dòng.</p>`],
      [40, 'Modals', `<p>A dialog over a dimmed backdrop: markup <code>.modal &gt; .modal-dialog &gt; .modal-content</code>, opened by a button with <code>data-bs-toggle="modal" data-bs-target="#id"</code>. Used for confirmations, forms and detail views.</p>`, `<p>Hộp thoại trên nền mờ: markup <code>.modal &gt; .modal-dialog &gt; .modal-content</code>, mở bằng nút có <code>data-bs-toggle="modal" data-bs-target="#id"</code>. Dùng cho xác nhận, form và xem chi tiết.</p>`],
      [41, 'Navbar, Navs & Tabs', `<p>Navigation components: the site <strong>navbar</strong>, and <strong>navs/tabs</strong> for switching panels. Introduced together because they share the <code>.nav</code> markup.</p>`, `<p>Các component điều hướng: <strong>navbar</strong> của trang, và <strong>nav/tab</strong> để chuyển panel. Giới thiệu cùng nhau vì dùng chung markup <code>.nav</code>.</p>`],
      [42, 'Navbar', `<p>The responsive top bar: <code>.navbar .navbar-expand-lg</code> with a <code>.navbar-toggler</code> that collapses links into a hamburger on small screens. Holds brand, links, and often a search/buttons.</p>`, `<p>Thanh trên cùng responsive: <code>.navbar .navbar-expand-lg</code> với <code>.navbar-toggler</code> gộp link thành hamburger trên màn nhỏ. Chứa brand, link, và thường có ô tìm/nút.</p>`],
      [43, 'Navs & Tabs', `<p><code>.nav</code> is a list of links; add <code>.nav-tabs</code>/<code>.nav-pills</code> for styling and <code>data-bs-toggle="tab"</code> to switch <code>.tab-pane</code> panels without a page reload.</p>`, `<p><code>.nav</code> là danh sách link; thêm <code>.nav-tabs</code>/<code>.nav-pills</code> để tạo kiểu và <code>data-bs-toggle="tab"</code> để chuyển các panel <code>.tab-pane</code> mà không reload trang.</p>`],
      [44, 'Carousel', `<p>A slideshow: <code>.carousel</code> with <code>.carousel-item</code>s, controls and indicators. Cycles images/content automatically or on click.</p>`, `<p>Trình chiếu: <code>.carousel</code> với các <code>.carousel-item</code>, nút điều khiển và chỉ báo. Tự chạy hoặc theo click qua ảnh/nội dung.</p>`],
      [45, 'Carousel — cont’d', `<p>Options: captions (<code>.carousel-caption</code>), fade transition (<code>.carousel-fade</code>), and interval/ride controls via <code>data-bs-*</code>. Keep carousels accessible and not the only way to reach content.</p>`, `<p>Tuỳ chọn: chú thích (<code>.carousel-caption</code>), hiệu ứng mờ (<code>.carousel-fade</code>), và điều khiển interval/ride qua <code>data-bs-*</code>. Giữ carousel dễ tiếp cận và không là cách duy nhất để tới nội dung.</p>`],
      [46, 'Cards', `<p>The all-purpose content box: <code>.card &gt; .card-body</code> with <code>.card-title</code>, <code>.card-text</code>, <code>.card-img-top</code> and footers. Replaces the old panels/wells/thumbnails with one flexible component.</p>`, `<p>Hộp nội dung đa dụng: <code>.card &gt; .card-body</code> với <code>.card-title</code>, <code>.card-text</code>, <code>.card-img-top</code> và footer. Thay cho panel/well/thumbnail cũ bằng một component linh hoạt.</p>`],
      [47, 'Cards — cont’d', `<p>Lay cards out in a responsive grid with <code>.row-cols-*</code> or the grid columns; equal heights come free from Flexbox. This is exactly Exercise 7.</p>`, `<p>Xếp card thành lưới responsive bằng <code>.row-cols-*</code> hoặc cột lưới; cao bằng nhau nhờ Flexbox. Đây đúng là Exercise 7.</p>`],
      [48, 'Exercise 7: Cards column', `<p>Hand-off to <strong>Exercise 7</strong> — lay out a column/grid of cards. Full brief in the lesson "Exercise 7 — Cards".</p>`, `<p>Chuyển sang <strong>Exercise 7</strong> — dàn một cột/lưới card. Đề đầy đủ ở bài "Exercise 7 — Cards".</p>`],
      [49, 'Bootstrap forms', `<p>Form styling: <code>.form-control</code> for inputs, <code>.form-label</code>, <code>.form-select</code>, <code>.form-check</code> for checkboxes/radios, and the grid for form layout. Consistent, accessible, responsive forms with classes only.</p>`, `<p>Tạo kiểu form: <code>.form-control</code> cho input, <code>.form-label</code>, <code>.form-select</code>, <code>.form-check</code> cho checkbox/radio, và lưới để dàn form. Form nhất quán, dễ tiếp cận, responsive chỉ bằng class.</p>`],
      [50, 'Bootstrap form controls', `<p>The catalogue: text inputs, selects, checkboxes, radios, switches, ranges, file inputs, input groups and validation styles (<code>.is-valid</code>/<code>.is-invalid</code>). Exercise 8 builds a form — in React you will wire these to state (Chapter 6).</p>`, `<p>Danh mục: input text, select, checkbox, radio, switch, range, input file, input group và kiểu validation (<code>.is-valid</code>/<code>.is-invalid</code>). Exercise 8 dựng một form — trong React bạn sẽ nối chúng với state (Chương 6).</p>`],
      [51, 'Exercise 8: Form controls', `<p>Hand-off to <strong>Exercise 8</strong> — build a form with Bootstrap/React controls. Full brief in the lesson "Exercise 8 — Form controls".</p>`, `<p>Chuyển sang <strong>Exercise 8</strong> — dựng form với control Bootstrap/React. Đề đầy đủ ở bài "Exercise 8 — Form controls".</p>`],
      [52, '(section transition)', `<p>Blank transition slide in the deck — no content.</p>`, `<p>Slide chuyển mục trong bộ slide — không có nội dung chữ.</p>`],
      [53, '(section transition)', `<p>Blank transition slide in the deck — no content.</p>`, `<p>Slide chuyển mục trong bộ slide — không có nội dung chữ.</p>`],
      [54, 'Lab 2: Build the website interface', `<p>Points to the bigger lab — assemble a full page from the grid + components you learned. Practise it with Exercises 6–8 and the practice project.</p>`, `<p>Trỏ tới bài lab lớn hơn — lắp một trang hoàn chỉnh từ lưới + component đã học. Luyện qua Exercise 6–8 và dự án luyện tập.</p>`],
      [55, 'Summary', `<p>Recap: UI frameworks → Bootstrap setup (CDN/npm + viewport) → the 12-column Flexbox grid (containers, responsive columns, alignment, ordering, nesting) → JS components (collapse/accordion, tooltip/popover/modal, navbar/nav/tab, carousel, cards, forms).</p>`, `<p>Tóm tắt: UI framework → cài Bootstrap (CDN/npm + viewport) → lưới Flexbox 12 cột (container, cột responsive, căn, sắp thứ tự, lồng) → component JS (collapse/accordion, tooltip/popover/modal, navbar/nav/tab, carousel, card, form).</p>`],
    ]),
    books([
      ['bootstrap', 'Layout ▸ Grid, and the Components section (getbootstrap.com/docs/5.3)', 'Layout ▸ Grid, và mục Components (getbootstrap.com/docs/5.3)'],
    ]),
  ].join('\n'),
};

/* ═══════════ Exercises 5, 6, 7, 8 ═══════════ */
const EX5 = {
  title: 'Exercise 5 — Getting started with Bootstrap|||Exercise 5 — Bắt đầu với Bootstrap',
  slug: 'fer202-4-ex5-bootstrap-setup',
  type: 'EXERCISE',
  description: 'Cài Bootstrap 5 bằng npm, thêm viewport + link CSS/JS, và làm một trang “Bootstrap ready”.',
  content: bi(
    `<span class="eyebrow">Chapter 4 · Exercise 5 · Slot 4–5 slide 14</span>
<h2>Get a page Bootstrap-ready</h2>
<p class="lead"><b>Goal:</b> add Bootstrap to a project and confirm its classes work.</p>
<h3>Steps</h3>
<ol>
  <li>Install: <code>npm install bootstrap</code> (Bootstrap 5 no longer needs jQuery; the bundle includes Popper).</li>
  <li>In a plain project, add to <code>&lt;head&gt;</code>: the charset and <strong>viewport</strong> meta, then the Bootstrap CSS link. Add the JS bundle before <code>&lt;/body&gt;</code>.</li>
  <li>In a <strong>React</strong> app, instead add one line to <code>src/index.js</code>:
<pre><span class="hljs-keyword">import</span> <span class="hljs-string">&#x27;bootstrap/dist/css/bootstrap.min.css&#x27;</span>;
<span class="hljs-keyword">import</span> <span class="hljs-string">&#x27;bootstrap/dist/js/bootstrap.bundle.min.js&#x27;</span>;</pre></li>
  <li>Verify: add <code>&lt;button className="btn btn-primary"&gt;Test&lt;/button&gt;</code> — a blue Bootstrap button means it works.</li>
</ol>
<div class="pitfall"><b>Trap:</b> in JSX use <code>className</code>, not <code>class</code>. And put the viewport meta in — without it the grid will not respond on mobile even though the classes are present.</div>
<div class="di-toi"><a class="link-card exphub" href="${EXPHUB}" target="_blank" rel="noopener"><span class="lc-ico">🛠️</span><span class="lc-body"><span class="lc-title">Project setup guide</span><span class="lc-sub">Add Bootstrap to Vite/CRA — Exp Hub.</span></span><span class="lc-cta">EXP HUB →</span></a></div>`,
    `<span class="eyebrow">Chương 4 · Exercise 5 · Slot 4–5 slide 14</span>
<h2>Làm một trang sẵn sàng Bootstrap</h2>
<p class="lead"><b>Mục tiêu:</b> thêm Bootstrap vào dự án và xác nhận class chạy.</p>
<h3>Các bước</h3>
<ol>
  <li>Cài: <code>npm install bootstrap</code> (Bootstrap 5 không cần jQuery nữa; bundle đã kèm Popper).</li>
  <li>Dự án thuần: thêm vào <code>&lt;head&gt;</code> meta charset và <strong>viewport</strong>, rồi link CSS Bootstrap. Thêm bundle JS trước <code>&lt;/body&gt;</code>.</li>
  <li>App <strong>React</strong>: chỉ thêm một dòng vào <code>src/index.js</code>:
<pre><span class="hljs-keyword">import</span> <span class="hljs-string">&#x27;bootstrap/dist/css/bootstrap.min.css&#x27;</span>;
<span class="hljs-keyword">import</span> <span class="hljs-string">&#x27;bootstrap/dist/js/bootstrap.bundle.min.js&#x27;</span>;</pre></li>
  <li>Kiểm: thêm <code>&lt;button className="btn btn-primary"&gt;Test&lt;/button&gt;</code> — nút xanh Bootstrap nghĩa là đã chạy.</li>
</ol>
<div class="pitfall"><b>Bẫy:</b> trong JSX dùng <code>className</code>, không phải <code>class</code>. Và nhớ thêm meta viewport — thiếu nó lưới không responsive trên di động dù có class.</div>
<div class="di-toi"><a class="link-card exphub" href="${EXPHUB}" target="_blank" rel="noopener"><span class="lc-ico">🛠️</span><span class="lc-body"><span class="lc-title">Hướng dẫn cài dự án</span><span class="lc-sub">Thêm Bootstrap vào Vite/CRA — Exp Hub.</span></span><span class="lc-cta">EXP HUB →</span></a></div>`,
  ),
};

const EX6 = {
  title: 'Exercise 6 — Build a layout with the Bootstrap grid|||Exercise 6 — Dựng layout bằng lưới Bootstrap',
  slug: 'fer202-4-ex6-grid-layout',
  type: 'EXERCISE',
  description: 'Dựng một layout trang responsive (header/nav, nội dung nhiều cột, sidebar, footer) chỉ bằng container/row/col và breakpoint.',
  content: bi(
    `<span class="eyebrow">Chapter 4 · Exercise 6 · Slot 4–5 slide 31</span>
<h2>Build a responsive layout with the grid</h2>
<p class="lead"><b>Goal:</b> reproduce a page layout using only <code>.container</code>, <code>.row</code>, <code>.col-*</code> and responsive infixes.</p>
<h3>A worked skeleton</h3>
<pre>&lt;div className=<span class="hljs-string">&quot;container&quot;</span>&gt;
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;row&quot;</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">header</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;col-12&quot;</span>&gt;</span>Header<span class="hljs-tag">&lt;/<span class="hljs-name">header</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;row&quot;</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">main</span>  <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;col-12 col-md-8&quot;</span>&gt;</span>Main content<span class="hljs-tag">&lt;/<span class="hljs-name">main</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">aside</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;col-12 col-md-4&quot;</span>&gt;</span>Sidebar<span class="hljs-tag">&lt;/<span class="hljs-name">aside</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;row row-cols-1 row-cols-md-3 g-3&quot;</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;col&quot;</span>&gt;</span>Card 1<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;col&quot;</span>&gt;</span>Card 2<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;col&quot;</span>&gt;</span>Card 3<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;row&quot;</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">footer</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;col-12&quot;</span>&gt;</span>Footer<span class="hljs-tag">&lt;/<span class="hljs-name">footer</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
&lt;/div&gt;</pre>
<div class="out"><b>Result:</b> on a phone everything stacks to one column; from md up the main/sidebar split 8/4 and the cards become three across.</div>
<div class="callout"><span class="badge">★ Tip</span> Start mobile-first: write <code>.col-12</code> first, then add the <code>.col-md-*</code> overrides. Test by narrowing the browser — the layout should reflow at each breakpoint.</div>`,
    `<span class="eyebrow">Chương 4 · Exercise 6 · Slot 4–5 slide 31</span>
<h2>Dựng layout responsive bằng lưới</h2>
<p class="lead"><b>Mục tiêu:</b> tái tạo một layout trang chỉ với <code>.container</code>, <code>.row</code>, <code>.col-*</code> và breakpoint.</p>
<h3>Bộ khung mẫu</h3>
<pre>&lt;div className=<span class="hljs-string">&quot;container&quot;</span>&gt;
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;row&quot;</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">header</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;col-12&quot;</span>&gt;</span>Header<span class="hljs-tag">&lt;/<span class="hljs-name">header</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;row&quot;</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">main</span>  <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;col-12 col-md-8&quot;</span>&gt;</span>Nội dung chính<span class="hljs-tag">&lt;/<span class="hljs-name">main</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">aside</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;col-12 col-md-4&quot;</span>&gt;</span>Sidebar<span class="hljs-tag">&lt;/<span class="hljs-name">aside</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;row row-cols-1 row-cols-md-3 g-3&quot;</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;col&quot;</span>&gt;</span>Card 1<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;col&quot;</span>&gt;</span>Card 2<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;col&quot;</span>&gt;</span>Card 3<span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
  <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;row&quot;</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">footer</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;col-12&quot;</span>&gt;</span>Footer<span class="hljs-tag">&lt;/<span class="hljs-name">footer</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
&lt;/div&gt;</pre>
<div class="out"><b>Kết quả:</b> trên điện thoại mọi thứ xếp một cột; từ md trở lên main/sidebar chia 8/4 và các card thành ba cột.</div>
<div class="callout"><span class="badge">★ Mẹo</span> Bắt đầu mobile-first: viết <code>.col-12</code> trước, rồi thêm ghi đè <code>.col-md-*</code>. Kiểm bằng cách thu hẹp trình duyệt — layout phải reflow ở mỗi breakpoint.</div>`,
  ),
};

const EX7 = {
  title: 'Exercise 7 — Cards column|||Exercise 7 — Cột thẻ (Cards)',
  slug: 'fer202-4-ex7-cards',
  type: 'EXERCISE',
  description: 'Dựng một lưới card (ảnh + tiêu đề + mô tả + nút) responsive, hiểu cấu trúc card-img-top/card-body/card-title/card-text.',
  content: bi(
    `<span class="eyebrow">Chapter 4 · Exercise 7 · Slot 4–5 slide 48</span>
<h2>A responsive column of cards</h2>
<p class="lead"><b>Goal:</b> display a list of items as Bootstrap cards laid out in a responsive grid — the anatomy of a card and how to make equal-height columns of them.</p>
<pre>&lt;div className=<span class="hljs-string">&quot;row row-cols-1 row-cols-md-3 g-4&quot;</span>&gt;
  {items.<span class="hljs-title function_">map</span>(<span class="hljs-function"><span class="hljs-params">it</span> =&gt;</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;col&quot;</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{it.id}</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;card h-100&quot;</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">img</span> <span class="hljs-attr">src</span>=<span class="hljs-string">{it.img}</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;card-img-top&quot;</span> <span class="hljs-attr">alt</span>=<span class="hljs-string">{it.title}</span> /&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;card-body&quot;</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">h5</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;card-title&quot;</span>&gt;</span>{it.title}<span class="hljs-tag">&lt;/<span class="hljs-name">h5</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">p</span>  <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;card-text&quot;</span>&gt;</span>{it.text}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">a</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;btn btn-primary&quot;</span> <span class="hljs-attr">href</span>=<span class="hljs-string">{it.href}</span>&gt;</span>More<span class="hljs-tag">&lt;/<span class="hljs-name">a</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  ))}
&lt;/div&gt;</pre>
<div class="out"><b>Result:</b> cards flow one per row on phones, three per row from md up.</div>
<div class="pitfall"><b>Trap:</b> add <code>h-100</code> to the <code>.card</code> so cards in the same row share height even when text lengths differ. And every mapped <code>.col</code> needs a <code>key</code>.</div>`,
    `<span class="eyebrow">Chương 4 · Exercise 7 · Slot 4–5 slide 48</span>
<h2>Một cột thẻ responsive</h2>
<p class="lead"><b>Mục tiêu:</b> hiển thị danh sách item dưới dạng card Bootstrap dàn lưới responsive — cấu trúc một card và cách làm các cột cao bằng nhau.</p>
<pre>&lt;div className=<span class="hljs-string">&quot;row row-cols-1 row-cols-md-3 g-4&quot;</span>&gt;
  {items.<span class="hljs-title function_">map</span>(<span class="hljs-function"><span class="hljs-params">it</span> =&gt;</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;col&quot;</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{it.id}</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;card h-100&quot;</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">img</span> <span class="hljs-attr">src</span>=<span class="hljs-string">{it.img}</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;card-img-top&quot;</span> <span class="hljs-attr">alt</span>=<span class="hljs-string">{it.title}</span> /&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;card-body&quot;</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">h5</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;card-title&quot;</span>&gt;</span>{it.title}<span class="hljs-tag">&lt;/<span class="hljs-name">h5</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">p</span>  <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;card-text&quot;</span>&gt;</span>{it.text}<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
          <span class="hljs-tag">&lt;<span class="hljs-name">a</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;btn btn-primary&quot;</span> <span class="hljs-attr">href</span>=<span class="hljs-string">{it.href}</span>&gt;</span>Xem<span class="hljs-tag">&lt;/<span class="hljs-name">a</span>&gt;</span>
        <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
  ))}
&lt;/div&gt;</pre>
<div class="out"><b>Kết quả:</b> card một cột trên điện thoại, ba cột từ md trở lên.</div>
<div class="pitfall"><b>Bẫy:</b> thêm <code>h-100</code> vào <code>.card</code> để các card cùng hàng cao bằng nhau dù độ dài text khác nhau. Và mỗi <code>.col</code> map ra cần một <code>key</code>.</div>`,
  ),
};

const EX8 = {
  title: 'Exercise 8 — Form controls|||Exercise 8 — Form controls',
  slug: 'fer202-4-ex8-form-controls',
  type: 'EXERCISE',
  description: 'Dựng một form với các control Bootstrap; giới thiệu ý niệm controlled input trong React (nối value ↔ state) — nối tiếp sang Chương 6.',
  content: bi(
    `<span class="eyebrow">Chapter 4 · Exercise 8 · Slot 4–5 slide 51</span>
<h2>Build a form with controls</h2>
<p class="lead"><b>Goal:</b> style a form with Bootstrap classes and, in React, make it a <strong>controlled</strong> form (input value driven by state).</p>
<pre><span class="hljs-keyword">function</span> <span class="hljs-title function_">ContactForm</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [email, setEmail] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>);
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">form</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;mb-3&quot;</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">label</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;form-label&quot;</span>&gt;</span>Email<span class="hljs-tag">&lt;/<span class="hljs-name">label</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">input</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;email&quot;</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;form-control&quot;</span>
               <span class="hljs-attr">value</span>=<span class="hljs-string">{email}</span> <span class="hljs-attr">onChange</span>=<span class="hljs-string">{e</span> =&gt;</span> setEmail(e.target.value)} /&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;form-check mb-3&quot;</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">input</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;form-check-input&quot;</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;checkbox&quot;</span> <span class="hljs-attr">id</span>=<span class="hljs-string">&quot;ok&quot;</span> /&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">label</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;form-check-label&quot;</span> <span class="hljs-attr">htmlFor</span>=<span class="hljs-string">&quot;ok&quot;</span>&gt;</span>Subscribe<span class="hljs-tag">&lt;/<span class="hljs-name">label</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;btn btn-primary&quot;</span>&gt;</span>Send<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span></span>
  );
}</pre>
<div class="out"><b>Result:</b> a styled form whose email lives in state — you can validate, disable the button, or submit it via fetch (Chapter 11).</div>
<div class="callout"><span class="badge">★ Controlled vs uncontrolled</span> A <strong>controlled</strong> input has its <code>value</code> from state and an <code>onChange</code> that updates state — React is the single source of truth. This is the standard React form pattern; Chapter 6 goes deeper, and Slot 7 slide 13 revisits it.</div>`,
    `<span class="eyebrow">Chương 4 · Exercise 8 · Slot 4–5 slide 51</span>
<h2>Dựng form với các control</h2>
<p class="lead"><b>Mục tiêu:</b> tạo kiểu form bằng class Bootstrap và, trong React, biến nó thành form <strong>controlled</strong> (giá trị input do state điều khiển).</p>
<pre><span class="hljs-keyword">function</span> <span class="hljs-title function_">ContactForm</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [email, setEmail] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-string">&#x27;&#x27;</span>);
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">form</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;mb-3&quot;</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">label</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;form-label&quot;</span>&gt;</span>Email<span class="hljs-tag">&lt;/<span class="hljs-name">label</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">input</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;email&quot;</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;form-control&quot;</span>
               <span class="hljs-attr">value</span>=<span class="hljs-string">{email}</span> <span class="hljs-attr">onChange</span>=<span class="hljs-string">{e</span> =&gt;</span> setEmail(e.target.value)} /&gt;
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">div</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;form-check mb-3&quot;</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">input</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;form-check-input&quot;</span> <span class="hljs-attr">type</span>=<span class="hljs-string">&quot;checkbox&quot;</span> <span class="hljs-attr">id</span>=<span class="hljs-string">&quot;ok&quot;</span> /&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">label</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;form-check-label&quot;</span> <span class="hljs-attr">htmlFor</span>=<span class="hljs-string">&quot;ok&quot;</span>&gt;</span>Đăng ký<span class="hljs-tag">&lt;/<span class="hljs-name">label</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;btn btn-primary&quot;</span>&gt;</span>Gửi<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">form</span>&gt;</span></span>
  );
}</pre>
<div class="out"><b>Kết quả:</b> một form có kiểu, email nằm trong state — bạn có thể validate, khoá nút, hoặc gửi qua fetch (Chương 11).</div>
<div class="callout"><span class="badge">★ Controlled vs uncontrolled</span> Input <strong>controlled</strong> lấy <code>value</code> từ state và có <code>onChange</code> cập nhật state — React là nguồn sự thật duy nhất. Đây là mẫu form chuẩn của React; Chương 6 đi sâu, và Slot 7 slide 13 nhắc lại.</div>`,
  ),
};

/* ═══════════ 4.4 — Slide walkthrough: React-Bootstrap (Slot 7) ═══════════ */
const REACTBOOTSTRAP = {
  title: '4.3 — Slide by slide: React-Bootstrap (Slot 7)|||4.3 — Học theo từng slide: React-Bootstrap (Slot 7)',
  slug: 'fer202-4-4-slot7-react-bootstrap-slides',
  type: 'DOCUMENT',
  description: 'Toàn bộ 24 slide Slot 7: React-Bootstrap là gì và vì sao dùng, cài đặt, Grid, Button, Checkbox/Radio, controlled vs uncontrolled, Navigation/Navbar/Nav/Tab, Form, Modal, Alert, Card — component Bootstrap dạng React thật sự.',
  content: [
    bi(
      `<span class="eyebrow">Chapter 4 · Lesson 4.4 · Slot 7 deck (24 slides)</span>
<h2>React-Bootstrap, slide by slide</h2>
<p class="lead">Plain Bootstrap toggles components with <code>data-bs-*</code> attributes — awkward in React. <strong>React-Bootstrap</strong> re-implements every component as a real React component (<code>&lt;Button&gt;</code>, <code>&lt;Modal&gt;</code>, <code>&lt;Navbar&gt;</code>) with props and state — no jQuery, no DOM toggling.</p>`,
      `<span class="eyebrow">Chương 4 · Bài 4.4 · Bộ slide Slot 7 (24 slide)</span>
<h2>React-Bootstrap, theo từng slide</h2>
<p class="lead">Bootstrap thuần bật component bằng thuộc tính <code>data-bs-*</code> — vụng trong React. <strong>React-Bootstrap</strong> hiện thực lại mọi component thành component React thật (<code>&lt;Button&gt;</code>, <code>&lt;Modal&gt;</code>, <code>&lt;Navbar&gt;</code>) với props và state — không jQuery, không toggle DOM.</p>`,
    ),
    walkHead('slot7', 1, 24),
    walk('slot7', [
      [1, 'Introduction to React-Bootstrap', `<p>Title slide.</p>`, `<p>Slide bìa.</p>`],
      [2, 'Objectives', `<p>What Slot 7 covers: what React-Bootstrap is and why, installation, the grid, buttons, checkbox/radio, controlled vs uncontrolled, navigation, forms, modals, alerts and cards.</p>`, `<p>Slot 7 học gì: React-Bootstrap là gì và vì sao, cài đặt, grid, button, checkbox/radio, controlled vs uncontrolled, navigation, form, modal, alert và card.</p>`],
      [3, 'What is React-Bootstrap?', `<p>A library that rebuilds Bootstrap components as <strong>true React components</strong>. Each is imported and used as JSX — <code>import Button from 'react-bootstrap/Button'</code> then <code>&lt;Button variant="primary"&gt;</code> — with no Bootstrap JS and no jQuery.</p>`, `<p>Thư viện dựng lại các component Bootstrap thành <strong>component React thật</strong>. Mỗi cái được import và dùng như JSX — <code>import Button from 'react-bootstrap/Button'</code> rồi <code>&lt;Button variant="primary"&gt;</code> — không cần JS của Bootstrap, không jQuery.</p>`],
      [4, 'Why use React-Bootstrap?', `<p>It fits React's model: state and props control components, no manual DOM/data-attribute toggling, better composability and it plays well with React's re-render cycle. You still load Bootstrap's CSS for the styles.</p>`, `<p>Nó hợp mô hình React: state và props điều khiển component, không toggle DOM/thuộc tính thủ công, dễ kết hợp và ăn khớp với vòng re-render của React. Bạn vẫn nạp CSS của Bootstrap để lấy style.</p>`],
      [5, 'Features & aspects', `<p>Highlights: accessible components out of the box, no jQuery dependency, tree-shakeable imports, and the familiar Bootstrap look-and-feel driven by props like <code>variant</code>, <code>size</code>, <code>show</code>.</p>`, `<p>Điểm nổi bật: component dễ tiếp cận sẵn, không phụ thuộc jQuery, import tree-shake được, và giao diện Bootstrap quen thuộc điều khiển bằng props như <code>variant</code>, <code>size</code>, <code>show</code>.</p>`],
      [6, 'Installation & configuration', `<p><code>npm install react-bootstrap bootstrap</code>, then import Bootstrap's CSS once in <code>index.js</code>: <code>import 'bootstrap/dist/css/bootstrap.min.css'</code>. Import components individually from <code>react-bootstrap</code>.</p>`, `<p><code>npm install react-bootstrap bootstrap</code>, rồi import CSS Bootstrap một lần trong <code>index.js</code>: <code>import 'bootstrap/dist/css/bootstrap.min.css'</code>. Import từng component từ <code>react-bootstrap</code>.</p>`],
      [7, 'Grid system', `<p>The grid as components: <code>&lt;Container&gt;</code>, <code>&lt;Row&gt;</code>, <code>&lt;Col&gt;</code>. Column widths are <strong>props</strong>: <code>&lt;Col md={6} lg={4}&gt;</code> instead of class strings.</p>`, `<p>Lưới dạng component: <code>&lt;Container&gt;</code>, <code>&lt;Row&gt;</code>, <code>&lt;Col&gt;</code>. Bề rộng cột là <strong>props</strong>: <code>&lt;Col md={6} lg={4}&gt;</code> thay cho chuỗi class.</p>`],
      [8, 'Auto-layout columns', `<p>A bare <code>&lt;Col&gt;</code> shares the row equally, like plain <code>.col</code>. Pass a number for a fixed span, or a breakpoint object for responsive spans.</p>`, `<p><code>&lt;Col&gt;</code> trơn chia hàng đều nhau, như <code>.col</code>. Truyền một số để chiếm cố định, hoặc object breakpoint cho bề rộng responsive.</p>`],
      [9, 'Responsive grids', `<p>Breakpoints as props: <code>&lt;Col xs={12} md={6} lg={4}&gt;</code> = the same mobile-first behaviour as the CSS grid, expressed in JSX.</p>`, `<p>Breakpoint là props: <code>&lt;Col xs={12} md={6} lg={4}&gt;</code> = đúng hành vi mobile-first của lưới CSS, viết bằng JSX.</p>`],
      [10, 'Buttons', `<p><code>&lt;Button variant="primary" size="lg" onClick={...}&gt;</code>. <code>variant</code> picks the colour (primary, secondary, success, danger, outline-*), and it is a real React element so <code>onClick</code> is a normal handler.</p>`, `<p><code>&lt;Button variant="primary" size="lg" onClick={...}&gt;</code>. <code>variant</code> chọn màu (primary, secondary, success, danger, outline-*), và nó là phần tử React thật nên <code>onClick</code> là handler bình thường.</p>`],
      [11, 'Checkbox / Radio', `<p><code>&lt;Form.Check type="checkbox" label="..." /&gt;</code> and <code>type="radio"</code>. Grouped radios share a <code>name</code>. Rendered with Bootstrap's form-check styling.</p>`, `<p><code>&lt;Form.Check type="checkbox" label="..." /&gt;</code> và <code>type="radio"</code>. Nhóm radio dùng chung <code>name</code>. Render với style form-check của Bootstrap.</p>`],
      [12, 'Checkbox / Radio — cont’d', `<p>Make them controlled with <code>checked</code> + <code>onChange</code>, exactly like a text input — React state decides what is ticked.</p>`, `<p>Làm chúng controlled bằng <code>checked</code> + <code>onChange</code>, y như input text — state React quyết định cái nào được chọn.</p>`],
      [13, 'Uncontrolled vs controlled', `<p>The key React forms concept, restated: an <strong>uncontrolled</strong> input keeps its own value in the DOM (read via a ref); a <strong>controlled</strong> input takes <code>value</code> from state and reports changes via <code>onChange</code>. Prefer controlled — one source of truth, easy validation.</p>`, `<p>Khái niệm form React cốt lõi, nhắc lại: input <strong>uncontrolled</strong> giữ giá trị riêng trong DOM (đọc qua ref); input <strong>controlled</strong> lấy <code>value</code> từ state và báo thay đổi qua <code>onChange</code>. Nên dùng controlled — một nguồn sự thật, dễ validate.</p>`],
      [14, 'Navigation', `<p>Section: the navigation components — Navbar, Nav, Tabs — as React components with props for active state.</p>`, `<p>Phân mục: các component điều hướng — Navbar, Nav, Tab — dạng component React với props cho trạng thái active.</p>`],
      [15, 'Navbars', `<p><code>&lt;Navbar expand="lg"&gt;</code> with <code>&lt;Navbar.Brand&gt;</code>, <code>&lt;Navbar.Toggle&gt;</code> and <code>&lt;Navbar.Collapse&gt;</code>. The collapse behaviour is handled by React-Bootstrap — no data attributes.</p>`, `<p><code>&lt;Navbar expand="lg"&gt;</code> với <code>&lt;Navbar.Brand&gt;</code>, <code>&lt;Navbar.Toggle&gt;</code> và <code>&lt;Navbar.Collapse&gt;</code>. Hành vi collapse do React-Bootstrap lo — không cần data attribute.</p>`],
      [16, 'Navs', `<p><code>&lt;Nav&gt;</code> with <code>&lt;Nav.Link&gt;</code>s; often combined with React Router (Chapter 9) so links change routes. <code>activeKey</code> marks the current item.</p>`, `<p><code>&lt;Nav&gt;</code> với các <code>&lt;Nav.Link&gt;</code>; thường kết hợp React Router (Chương 9) để link đổi route. <code>activeKey</code> đánh dấu mục hiện tại.</p>`],
      [17, 'Tabs', `<p><code>&lt;Tabs activeKey=... onSelect=...&gt;&lt;Tab eventKey="a" title="A"&gt;…&lt;/Tab&gt;&lt;/Tabs&gt;</code> — switching panels is React state, not DOM toggling.</p>`, `<p><code>&lt;Tabs activeKey=... onSelect=...&gt;&lt;Tab eventKey="a" title="A"&gt;…&lt;/Tab&gt;&lt;/Tabs&gt;</code> — chuyển panel là state React, không toggle DOM.</p>`],
      [18, 'Features of forms', `<p><code>&lt;Form&gt;</code>, <code>&lt;Form.Group&gt;</code>, <code>&lt;Form.Label&gt;</code>, <code>&lt;Form.Control&gt;</code>, <code>&lt;Form.Check&gt;</code> — the whole form toolkit as components, wired to state with <code>value</code>/<code>onChange</code>, plus validation props.</p>`, `<p><code>&lt;Form&gt;</code>, <code>&lt;Form.Group&gt;</code>, <code>&lt;Form.Label&gt;</code>, <code>&lt;Form.Control&gt;</code>, <code>&lt;Form.Check&gt;</code> — trọn bộ form dạng component, nối state bằng <code>value</code>/<code>onChange</code>, cùng props validation.</p>`],
      [19, 'Modals', `<p><code>&lt;Modal show={open} onHide={...}&gt;</code> — visibility is a <strong>state boolean</strong>, not a data attribute. Open with <code>setOpen(true)</code>, close via <code>onHide</code>. This is the cleanest example of "component state = UI".</p>`, `<p><code>&lt;Modal show={open} onHide={...}&gt;</code> — hiển thị là <strong>boolean state</strong>, không phải data attribute. Mở bằng <code>setOpen(true)</code>, đóng qua <code>onHide</code>. Đây là ví dụ rõ nhất của "state component = UI".</p>`],
      [20, 'Modals — cont’d', `<p>Structure: <code>&lt;Modal.Header closeButton&gt;</code>, <code>&lt;Modal.Body&gt;</code>, <code>&lt;Modal.Footer&gt;</code>. Put a form inside and drive both the form and the modal from state.</p>`, `<p>Cấu trúc: <code>&lt;Modal.Header closeButton&gt;</code>, <code>&lt;Modal.Body&gt;</code>, <code>&lt;Modal.Footer&gt;</code>. Đặt một form bên trong và điều khiển cả form lẫn modal từ state.</p>`],
      [21, 'Alerts', `<p><code>&lt;Alert variant="success" dismissible onClose={...}&gt;</code> for status messages. Show/hide with state; <code>dismissible</code> adds a close button.</p>`, `<p><code>&lt;Alert variant="success" dismissible onClose={...}&gt;</code> cho thông báo trạng thái. Hiện/ẩn bằng state; <code>dismissible</code> thêm nút đóng.</p>`],
      [22, 'Cards', `<p><code>&lt;Card&gt;</code> with <code>&lt;Card.Img&gt;</code>, <code>&lt;Card.Body&gt;</code>, <code>&lt;Card.Title&gt;</code>, <code>&lt;Card.Text&gt;</code> — the Bootstrap card from Slot 4–5, now as composable React components you can map over.</p>`, `<p><code>&lt;Card&gt;</code> với <code>&lt;Card.Img&gt;</code>, <code>&lt;Card.Body&gt;</code>, <code>&lt;Card.Title&gt;</code>, <code>&lt;Card.Text&gt;</code> — card Bootstrap từ Slot 4–5, giờ là component React ghép được, map ra danh sách.</p>`],
      [23, 'Exercise 10: Demo about React-Bootstrap', `<p>Hand-off to <strong>Exercise 10</strong> — build a small UI with React-Bootstrap components. Full brief in the next lesson.</p>`, `<p>Chuyển sang <strong>Exercise 10</strong> — dựng một UI nhỏ bằng component React-Bootstrap. Đề đầy đủ ở bài kế.</p>`],
      [24, 'Summary', `<p>Recap: React-Bootstrap turns every Bootstrap component into a React component controlled by props/state — grid, buttons, forms (controlled), navbar/nav/tabs, modal, alert, card — no jQuery, no data attributes.</p>`, `<p>Tóm tắt: React-Bootstrap biến mọi component Bootstrap thành component React điều khiển bằng props/state — grid, button, form (controlled), navbar/nav/tab, modal, alert, card — không jQuery, không data attribute.</p>`],
    ]),
    books([
      ['reactbootstrap', 'Components ▸ Buttons, Navbar, Modal, Forms (react-bootstrap.github.io)', 'Components ▸ Buttons, Navbar, Modal, Forms (react-bootstrap.github.io)'],
    ]),
  ].join('\n'),
};

const EX10 = {
  title: 'Exercise 10 — Demo about React-Bootstrap|||Exercise 10 — Demo React-Bootstrap',
  slug: 'fer202-4-ex10-react-bootstrap',
  type: 'EXERCISE',
  description: 'Dựng một UI nhỏ bằng React-Bootstrap: Navbar + lưới Card + một Modal điều khiển bằng state.',
  content: bi(
    `<span class="eyebrow">Chapter 4 · Exercise 10 · Slot 7 slide 23</span>
<h2>A small app with React-Bootstrap</h2>
<p class="lead"><b>Goal:</b> use React-Bootstrap components together — a navbar, a responsive row of cards, and a modal opened from a button.</p>
<pre><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Navbar</span>, <span class="hljs-title class_">Container</span>, <span class="hljs-title class_">Row</span>, <span class="hljs-title class_">Col</span>, <span class="hljs-title class_">Card</span>, <span class="hljs-title class_">Button</span>, <span class="hljs-title class_">Modal</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-bootstrap&#x27;</span>;

<span class="hljs-keyword">function</span> <span class="hljs-title function_">App</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [show, setShow] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-literal">false</span>);
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Navbar</span> <span class="hljs-attr">bg</span>=<span class="hljs-string">&quot;dark&quot;</span> <span class="hljs-attr">variant</span>=<span class="hljs-string">&quot;dark&quot;</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">Container</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">Navbar.Brand</span>&gt;</span>My Shop<span class="hljs-tag">&lt;/<span class="hljs-name">Navbar.Brand</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">Container</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">Navbar</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Container</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;mt-3&quot;</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Row</span> <span class="hljs-attr">xs</span>=<span class="hljs-string">{1}</span> <span class="hljs-attr">md</span>=<span class="hljs-string">{3}</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;g-3&quot;</span>&gt;</span>
          {products.map(p =&gt; (
            <span class="hljs-tag">&lt;<span class="hljs-name">Col</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{p.id}</span>&gt;</span>
              <span class="hljs-tag">&lt;<span class="hljs-name">Card</span>&gt;</span>
                <span class="hljs-tag">&lt;<span class="hljs-name">Card.Body</span>&gt;</span>
                  <span class="hljs-tag">&lt;<span class="hljs-name">Card.Title</span>&gt;</span>{p.name}<span class="hljs-tag">&lt;/<span class="hljs-name">Card.Title</span>&gt;</span>
                  <span class="hljs-tag">&lt;<span class="hljs-name">Button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setShow(true)}&gt;Details<span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span>
                <span class="hljs-tag">&lt;/<span class="hljs-name">Card.Body</span>&gt;</span>
              <span class="hljs-tag">&lt;/<span class="hljs-name">Card</span>&gt;</span>
            <span class="hljs-tag">&lt;/<span class="hljs-name">Col</span>&gt;</span>
          ))}
        <span class="hljs-tag">&lt;/<span class="hljs-name">Row</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">Container</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Modal</span> <span class="hljs-attr">show</span>=<span class="hljs-string">{show}</span> <span class="hljs-attr">onHide</span>=<span class="hljs-string">{()</span> =&gt;</span> setShow(false)}&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Modal.Header</span> <span class="hljs-attr">closeButton</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">Modal.Title</span>&gt;</span>Product<span class="hljs-tag">&lt;/<span class="hljs-name">Modal.Title</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">Modal.Header</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Modal.Body</span>&gt;</span>Details here.<span class="hljs-tag">&lt;/<span class="hljs-name">Modal.Body</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">Modal</span>&gt;</span>
    <span class="hljs-tag">&lt;/&gt;</span></span>
  );
}</pre>
<div class="out"><b>Result:</b> the modal's visibility is pure React state (<code>show</code>) — the whole point of React-Bootstrap over plain Bootstrap.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Build it in the browser</span><span class="lc-sub">Navbar + cards + modal — Code Lab.</span></span><span class="lc-cta">PRACTICE →</span></a></div>`,
    `<span class="eyebrow">Chương 4 · Exercise 10 · Slot 7 slide 23</span>
<h2>Một app nhỏ với React-Bootstrap</h2>
<p class="lead"><b>Mục tiêu:</b> dùng các component React-Bootstrap cùng nhau — navbar, một hàng card responsive, và một modal mở từ nút.</p>
<pre><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Navbar</span>, <span class="hljs-title class_">Container</span>, <span class="hljs-title class_">Row</span>, <span class="hljs-title class_">Col</span>, <span class="hljs-title class_">Card</span>, <span class="hljs-title class_">Button</span>, <span class="hljs-title class_">Modal</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;react-bootstrap&#x27;</span>;

<span class="hljs-keyword">function</span> <span class="hljs-title function_">App</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">const</span> [show, setShow] = <span class="hljs-title class_">React</span>.<span class="hljs-title function_">useState</span>(<span class="hljs-literal">false</span>);
  <span class="hljs-keyword">return</span> (
    <span class="language-xml"><span class="hljs-tag">&lt;&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Navbar</span> <span class="hljs-attr">bg</span>=<span class="hljs-string">&quot;dark&quot;</span> <span class="hljs-attr">variant</span>=<span class="hljs-string">&quot;dark&quot;</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">Container</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">Navbar.Brand</span>&gt;</span>My Shop<span class="hljs-tag">&lt;/<span class="hljs-name">Navbar.Brand</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">Container</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">Navbar</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Container</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;mt-3&quot;</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Row</span> <span class="hljs-attr">xs</span>=<span class="hljs-string">{1}</span> <span class="hljs-attr">md</span>=<span class="hljs-string">{3}</span> <span class="hljs-attr">className</span>=<span class="hljs-string">&quot;g-3&quot;</span>&gt;</span>
          {products.map(p =&gt; (
            <span class="hljs-tag">&lt;<span class="hljs-name">Col</span> <span class="hljs-attr">key</span>=<span class="hljs-string">{p.id}</span>&gt;</span>
              <span class="hljs-tag">&lt;<span class="hljs-name">Card</span>&gt;</span>
                <span class="hljs-tag">&lt;<span class="hljs-name">Card.Body</span>&gt;</span>
                  <span class="hljs-tag">&lt;<span class="hljs-name">Card.Title</span>&gt;</span>{p.name}<span class="hljs-tag">&lt;/<span class="hljs-name">Card.Title</span>&gt;</span>
                  <span class="hljs-tag">&lt;<span class="hljs-name">Button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{()</span> =&gt;</span> setShow(true)}&gt;Chi tiết<span class="hljs-tag">&lt;/<span class="hljs-name">Button</span>&gt;</span>
                <span class="hljs-tag">&lt;/<span class="hljs-name">Card.Body</span>&gt;</span>
              <span class="hljs-tag">&lt;/<span class="hljs-name">Card</span>&gt;</span>
            <span class="hljs-tag">&lt;/<span class="hljs-name">Col</span>&gt;</span>
          ))}
        <span class="hljs-tag">&lt;/<span class="hljs-name">Row</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">Container</span>&gt;</span>
      <span class="hljs-tag">&lt;<span class="hljs-name">Modal</span> <span class="hljs-attr">show</span>=<span class="hljs-string">{show}</span> <span class="hljs-attr">onHide</span>=<span class="hljs-string">{()</span> =&gt;</span> setShow(false)}&gt;
        <span class="hljs-tag">&lt;<span class="hljs-name">Modal.Header</span> <span class="hljs-attr">closeButton</span>&gt;</span><span class="hljs-tag">&lt;<span class="hljs-name">Modal.Title</span>&gt;</span>Sản phẩm<span class="hljs-tag">&lt;/<span class="hljs-name">Modal.Title</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">Modal.Header</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">Modal.Body</span>&gt;</span>Chi tiết ở đây.<span class="hljs-tag">&lt;/<span class="hljs-name">Modal.Body</span>&gt;</span>
      <span class="hljs-tag">&lt;/<span class="hljs-name">Modal</span>&gt;</span>
    <span class="hljs-tag">&lt;/&gt;</span></span>
  );
}</pre>
<div class="out"><b>Kết quả:</b> việc hiện modal hoàn toàn là state React (<code>show</code>) — chính là điểm hơn của React-Bootstrap so với Bootstrap thuần.</div>
<div class="di-toi"><a class="link-card codelab" href="${CODELAB}" target="_blank" rel="noopener"><span class="lc-ico">⌨️</span><span class="lc-body"><span class="lc-title">Dựng ngay trên trình duyệt</span><span class="lc-sub">Navbar + card + modal — Code Lab.</span></span><span class="lc-cta">LUYỆN TẬP →</span></a></div>`,
  ),
};

export default [BOOTSTRAP, EX5, EX6, EX7, EX8, REACTBOOTSTRAP, EX10];
