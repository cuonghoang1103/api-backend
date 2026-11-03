/**
 * Web Foundations — Chương 2: HTML (cấu trúc của mọi trang web).
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${. Quiz có field content.
 */

import { gallery, galleryGiang } from './_slides.mjs';
import L25 from './s02/wf-2-5-tables-media-a11y.mjs';
import L24 from './s02/wf-2-4-forms.mjs';
import L23 from './s02/wf-2-3-semantic-html.mjs';
import L22 from './s02/wf-2-2-text-links-images.mjs';
import L21 from './s02/wf-2-1-html-basics.mjs';
import { onTapBai } from './_on-tap/index.mjs';

export default {
  title: 'Chapter 2 — HTML: the structure of every web page|||Chương 2 — HTML: cấu trúc của mọi trang web',
  description: 'HTML là bộ khung của mọi trang web: các thẻ đặt tên cho từng mẩu nội dung — tiêu đề, đoạn văn, ảnh, liên kết, biểu mẫu. Học viết HTML có cấu trúc, đúng ngữ nghĩa và tiếp cận được, làm nền cho CSS (Chương 3) tô điểm và JavaScript (Chương 4) làm sống động.',
  lessons: [
    /* ─────────────────── 2.0 slide bài giảng ─────────────────── */
    {
      title: '2.0 — Lecture slides: HTML in 12 slides|||2.0 — Slide bài giảng: HTML trong 12 slide',
      slug: 'wf-2-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Phần tử, thẻ ngữ nghĩa, biểu mẫu — kèm bảng đối chiếu HTML với JSX của React.',
      content: `
<div class="ml-en"><h2>📑 Lecture slides: HTML in 12 slides</h2>
<p>Slide 9 compares HTML with JSX side by side. If you are heading to React, that one slide saves a lot of confusion.</p>
<p>Two ways to use it: skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 Slide bài giảng: HTML trong 12 slide</h2>
<p>Slide 9 đặt HTML cạnh JSX. Nếu bạn sắp học React thì riêng slide đó tiết kiệm rất nhiều lúng túng.</p>
<p>Hai cách dùng: lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${galleryGiang('wf-html', [
  [1, "Bìa"],
  [2, "Nội dung chương"],
  [3, "Một phần tử HTML gồm gì"],
  [4, "Bộ khung một trang"],
  [5, "Chữ, liên kết, ảnh"],
  [6, "Thẻ ngữ nghĩa — đặt tên đúng cho từng vùng"],
  [7, "Biểu mẫu ⭐⭐"],
  [8, "Các loại input hay dùng"],
  [9, "HTML khác JSX ở bốn chỗ ⭐"],
  [10, "Bảng và media"],
  [11, "Khả năng tiếp cận — bốn việc rẻ mà hiệu quả"],
  [12, "Tự luyện"],
])}
`,
    },

    /* ─────────────────────────── 2.1 ─────────────────────────── */
    L21,

    /* ─────────────────────────── 2.2 ─────────────────────────── */
    L22,

    /* ─────────────────────────── 2.3 ─────────────────────────── */
    L23,

    /* ─────────────────────────── 2.4 ─────────────────────────── */
    L24,

    /* ─────────────────────────── 2.5 ─────────────────────────── */
    L25,

    /* ─────────────────────────── 2.6 quiz ─────────────────────────── */
    {
      title: '2.6 — Chapter 2 quiz|||2.6 — Kiểm tra chương 2',
      slug: 'wf-2-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về phần tử và thuộc tính, tiêu đề và liên kết, HTML ngữ nghĩa, biểu mẫu, bảng và khả năng tiếp cận.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 2: element anatomy and attributes, headings and links, semantic structure, forms and inputs, tables, and accessibility.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> Reading HTML is not the same as writing it. Head to Code Lab and build real markup — run your code to see the result, then mark the exercise solved yourself (automatic grading is still being built).</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">The DOM, not the file</span><span class="lz-t">The browser repairs and moves things</span><span class="lz-d">HTML never errors. When something looks wrong, read the Elements panel — that is the tree CSS and JavaScript actually see.</span></div>
<div class="lz-node"><span class="lz-k">Semantics</span><span class="lz-t">Tags carry meaning, classes do not</span><span class="lz-d"><code>&lt;button&gt;</code> is focusable and keyboard-operable for free; <code>&lt;div class="button"&gt;</code> is none of those things.</span></div>
<div class="lz-node"><span class="lz-k">alt</span><span class="lz-t">Empty and missing are opposites</span><span class="lz-d"><code>alt=""</code> says "decorative, skip it". No <code>alt</code> at all leaves a screen reader announcing the file name.</span></div>
<div class="lz-node"><span class="lz-k">Forms</span><span class="lz-t">name to submit, label to be usable</span><span class="lz-d">A field without <code>name</code> is not sent. A placeholder is not a label, and browser validation is not a security check.</span></div>
</div>
<p class="note-ct"><strong>A five-minute check that beats any quiz:</strong> open a page you wrote, put the mouse away, and Tab through it. If you cannot reach every control and see where you are, the HTML has something to fix.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-2-0-slides&amp;khoa=web-foundations">Practice on Code Lab → the Chapter 2 set, easy to hard</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 2: giải phẫu phần tử và thuộc tính, tiêu đề và liên kết, cấu trúc ngữ nghĩa, biểu mẫu và input, bảng, và khả năng tiếp cận.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Đọc HTML không giống viết HTML. Hãy sang Code Lab để tự tay dựng mã thật — chạy thử để xem kết quả, rồi tự đánh dấu đã giải (máy chấm tự động đang được làm).</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">DOM, không phải cái file</span><span class="lz-t">Trình duyệt tự vá và tự dời</span><span class="lz-d">HTML không bao giờ báo lỗi. Khi thấy có gì sai, hãy đọc bảng Elements — đó mới là cái cây mà CSS và JavaScript thật sự nhìn thấy.</span></div>
<div class="lz-node"><span class="lz-k">Ngữ nghĩa</span><span class="lz-t">Thẻ mang ý nghĩa, class thì không</span><span class="lz-d"><code>&lt;button&gt;</code> nhận tiêu điểm và dùng được bằng bàn phím, miễn phí; <code>&lt;div class="button"&gt;</code> chẳng có thứ nào trong đó.</span></div>
<div class="lz-node"><span class="lz-k">alt</span><span class="lz-t">Rỗng và thiếu là hai thứ trái ngược</span><span class="lz-d"><code>alt=""</code> nói "trang trí thôi, bỏ qua". Không có <code>alt</code> nào thì trình đọc màn hình đọc lên tên file.</span></div>
<div class="lz-node"><span class="lz-k">Form</span><span class="lz-t">name để gửi được, label để dùng được</span><span class="lz-d">Một trường thiếu <code>name</code> thì không được gửi. Placeholder không phải nhãn, và phần kiểm của trình duyệt không phải phép kiểm an toàn.</span></div>
</div>
<p class="note-ct"><strong>Một phép kiểm năm phút hơn mọi bài kiểm tra:</strong> mở một trang bạn tự viết, cất con chuột đi, rồi đi khắp trang bằng phím Tab. Nếu bạn không tới được mọi điều khiển và không thấy mình đang ở đâu thì HTML còn thứ cần sửa.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-2-0-slides&amp;khoa=web-foundations">Luyện tập ở Code Lab → bộ đề Chương 2, từ dễ đến khó</a></div></div>
${onTapBai('wf-2-6-quiz')}
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is an HTML attribute?|||Một thuộc tính (attribute) HTML là gì?',
            options: [
              'Extra configuration written as name="value" in the opening tag|||Cấu hình thêm viết dạng tên="giá trị" trong thẻ mở',
              'The closing tag of an element|||Thẻ đóng của một phần tử',
              'Any text between two tags|||Bất kỳ chữ nào giữa hai thẻ',
              'A CSS style rule|||Một quy tắc kiểu CSS',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which part of the document holds the visible content?|||Phần nào của tài liệu chứa nội dung hiển thị?',
            options: [
              '<body>|||<body>',
              '<head>|||<head>',
              '<title>|||<title>',
              '<meta>|||<meta>',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'How many <h1> elements should a page normally have?|||Một trang thường nên có bao nhiêu phần tử <h1>?',
            options: [
              'Exactly one — the page title|||Đúng một — tiêu đề của trang',
              'As many as you like|||Bao nhiêu tuỳ thích',
              'None|||Không cái nào',
              'At least six|||Ít nhất sáu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which attribute makes a link point somewhere?|||Thuộc tính nào khiến một liên kết trỏ tới đâu đó?',
            options: [
              'href on an <a> element|||href trên một phần tử <a>',
              'src on an <a> element|||src trên một phần tử <a>',
              'alt on an <a> element|||alt trên một phần tử <a>',
              'link on an <a> element|||link trên một phần tử <a>',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why write alt text on images?|||Vì sao phải viết alt cho ảnh?',
            options: [
              'Screen readers read it aloud and it shows if the image fails to load|||Trình đọc màn hình đọc to nó, và nó hiện ra nếu ảnh tải hỏng',
              'It makes the image load faster|||Nó làm ảnh tải nhanh hơn',
              'It is required for the image to appear at all|||Ảnh bắt buộc phải có mới hiện ra',
              'It changes the image colour|||Nó đổi màu của ảnh',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which is a SEMANTIC element (has meaning), not a generic box?|||Cái nào là phần tử NGỮ NGHĨA (có ý nghĩa), không phải hộp chung chung?',
            options: [
              '<nav>|||<nav>',
              '<div>|||<div>',
              '<span>|||<span>',
              '<b>|||<b>',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In a form, what does the input\'s "name" attribute do?|||Trong một form, thuộc tính "name" của input làm gì?',
            options: [
              'Sets the key each value arrives under on the server|||Đặt khoá mà mỗi giá trị xuất hiện dưới đó ở phía server',
              'Sets the text shown on screen|||Đặt chữ hiện trên màn hình',
              'Styles the input|||Tạo kiểu cho ô input',
              'It is optional and has no effect|||Nó là tuỳ chọn và không có tác dụng gì',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'How do you correctly associate a <label> with its input?|||Làm sao để gắn đúng một <label> với ô input của nó?',
            options: [
              'The label\'s for matches the input\'s id|||Thuộc tính for của label khớp với id của input',
              'They must be different values|||Chúng phải là hai giá trị khác nhau',
              'Put the label after the </form>|||Đặt label sau </form>',
              'Give both the same name|||Cho cả hai cùng name',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Can browser form validation replace server-side validation?|||Kiểm tra biểu mẫu ở trình duyệt có thể thay cho kiểm tra phía server không?',
            options: [
              'No — the server must always re-validate; client checks can be bypassed|||Không — server luôn phải kiểm lại; kiểm ở client có thể bị bỏ qua',
              'Yes — if required is set the server can trust it|||Có — nếu đặt required thì server tin được',
              'Yes — browser checks are unbreakable|||Có — kiểm ở trình duyệt không thể phá',
              'Only for email fields|||Chỉ với ô email',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What are HTML tables for?|||Bảng HTML dùng để làm gì?',
            options: [
              'Presenting genuine tabular data, not page layout|||Trình bày dữ liệu dạng bảng thật, không phải để dàn trang',
              'Positioning the whole page layout|||Định vị bố cục cả trang',
              'Making text bold|||Làm chữ đậm',
              'Embedding videos|||Nhúng video',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
