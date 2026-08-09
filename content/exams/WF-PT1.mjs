/**
 * Web Foundations — Progress Test 1 (chương 0–5).
 *
 * Đề tự soạn, bám sát giáo trình `content/courses/web-foundations/s00…s05`.
 * 24 câu trắc nghiệm thuần (MCQ) — không có câu lập trình (đây là khoá nền
 * tảng cho người mới, không phải Node.js).
 *
 * ⚠️ MỌI đoạn mã hỏi "in ra gì" đã được CHẠY THẬT bằng `node` (v22) để lấy
 * kết quả — không suy đoán.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/WF-PT1.mjs --apply
 */
import { B, EX, code, mcq, wfInstructions } from './_lib/wf-exam-kit.mjs';

export default {
  course: { slug: 'web-foundations' },
  exams: [{
    kind: 'FE',
    code: 'PT1',
    source: 'SAMPLE',
    sortOrder: 1,
    title: B(
      'Progress Test 1 — Foundations: how the web works, tools, HTML, CSS, JavaScript',
      'Kiểm tra tiến độ 1 — Nền tảng: web hoạt động thế nào, công cụ, HTML, CSS, JavaScript',
    ),
    description: B(
      'Covers chapters 0–5 of Web Foundations: how a request travels the web, your daily toolbox (terminal, Git, GitHub, npm), HTML structure, CSS layout, and JavaScript from variables to async and modules. 24 multiple-choice questions.',
      'Bao phủ chương 0–5 của Web Foundations: một request đi đường nào trên web, bộ công cụ hằng ngày (terminal, Git, GitHub, npm), cấu trúc HTML, bố cục CSS, và JavaScript từ biến tới bất đồng bộ và module. 24 câu trắc nghiệm.',
    ),
    durationMinutes: 60,
    totalPoints: 10,
    passMark: 4,
    shuffleQuestions: false,
    shuffleOptions: false,
    isPublished: true,
    instructions: wfInstructions('Progress Test 1', 'chapters 0–5 (how the web works, the toolbox, HTML, CSS, JavaScript, async JavaScript)'),
    questions: [
      // ── Chương 0 — Web hoạt động thế nào ────────────────────────────
      mcq({
        prompt: B(
          'Which statement about the client (browser) and the server is correct?',
          'Phát biểu nào về client (trình duyệt) và server là ĐÚNG?',
        ),
        options: [
          B('The client runs on the server machine; the server only displays pages', 'Client chạy trên máy của server; server chỉ hiển thị trang'),
          B('The browser (client) runs HTML/CSS/JS and sees only what the server sends it; the server holds the database and secrets', 'Trình duyệt (client) chạy HTML/CSS/JS và chỉ thấy thứ server gửi; server giữ cơ sở dữ liệu và bí mật'),
          B('Both sides always run byte-for-byte identical code', 'Cả hai phía luôn chạy đúng y hệt cùng một đoạn mã'),
          B('The server only stores images; all logic always runs in the browser', 'Server chỉ lưu ảnh; mọi logic luôn chạy trong trình duyệt'),
        ],
        correct: 1,
        explanation: EX(
          'From Lesson 0.2: the browser is the client — it runs HTML/CSS/JS and sees only what the server sends, so anything in it is public. The server runs your backend code, holding the database, passwords and API keys the browser never sees.',
          'Từ Bài 0.2: trình duyệt là client — nó chạy HTML/CSS/JS và chỉ thấy thứ server gửi, nên mọi thứ trong đó là công khai. Server chạy mã backend, giữ cơ sở dữ liệu, mật khẩu và API key mà trình duyệt không bao giờ thấy.',
        ),
      }),

      mcq({
        prompt: B(
          'You type <code>cuongthai.com</code> and press Enter. What does DNS do first?',
          'Bạn gõ <code>cuongthai.com</code> và bấm Enter. DNS làm gì đầu tiên?',
        ),
        options: [
          B('It compresses the HTML response before sending it back', 'Nó nén phản hồi HTML trước khi gửi về'),
          B('It encrypts the connection so nobody can read the traffic', 'Nó mã hoá kết nối để không ai đọc được lưu lượng'),
          B('It looks up the domain name and returns the server’s IP address', 'Nó tra tên miền và trả về địa chỉ IP của server'),
          B('It saves a local copy of the page for next time', 'Nó lưu một bản sao trang cục bộ cho lần sau'),
        ],
        correct: 2,
        explanation: EX(
          'DNS is the internet’s phone book (Lesson 0.2): computers only know numbers (IP addresses), so DNS turns a name like <code>cuongthai.com</code> into something like <code>160.187.1.208</code> before the browser can even open a connection.',
          'DNS là danh bạ của internet (Bài 0.2): máy tính chỉ biết số (địa chỉ IP), nên DNS đổi một cái tên như <code>cuongthai.com</code> thành thứ như <code>160.187.1.208</code> trước khi trình duyệt mở được kết nối.',
        ),
      }),

      // ── Chương 1 — Bộ công cụ ────────────────────────────────────────
      mcq({
        prompt: B(
          'In the terminal, which command prints the folder you are currently standing in?',
          'Trong terminal, lệnh nào in ra thư mục bạn đang đứng?',
        ),
        options: [
          B('<code>pwd</code>', '<code>pwd</code>'),
          B('<code>ls</code>', '<code>ls</code>'),
          B('<code>cd</code>', '<code>cd</code>'),
          B('<code>mkdir</code>', '<code>mkdir</code>'),
        ],
        correct: 0,
        explanation: EX(
          'From Lesson 1.1: <code>pwd</code> (print working directory) answers "where am I?". <code>ls</code> lists what is here, <code>cd</code> moves you into a folder, <code>mkdir</code> creates one — different jobs entirely.',
          'Từ Bài 1.1: <code>pwd</code> (print working directory) trả lời "tôi đang ở đâu?". <code>ls</code> liệt kê những gì ở đây, <code>cd</code> đưa bạn vào một thư mục, <code>mkdir</code> tạo một thư mục — ba việc hoàn toàn khác.',
        ),
      }),

      mcq({
        prompt: B(
          'Which of these is a RELATIVE path, not an absolute one?',
          'Cái nào là đường dẫn TƯƠNG ĐỐI, không phải tuyệt đối?',
        ),
        options: [
          B('<code>/Users/lan/site/index.html</code>', '<code>/Users/lan/site/index.html</code>'),
          B('<code>../images/logo.png</code>', '<code>../images/logo.png</code>'),
          B('<code>/var/www/site/index.html</code>', '<code>/var/www/site/index.html</code>'),
          B('<code>/home/lan/site/index.html</code>', '<code>/home/lan/site/index.html</code>'),
        ],
        correct: 1,
        explanation: EX(
          'From Lesson 1.1: a path starting from the root of the disk (starts with <code>/</code> and a fixed root) is absolute — always the same regardless of where you stand. <code>../images/logo.png</code> is measured from your CURRENT folder (one level up, then into images), so it changes meaning depending on where you run it.',
          'Từ Bài 1.1: một đường dẫn tính từ gốc ổ đĩa (bắt đầu bằng <code>/</code> và một gốc cố định) là tuyệt đối — luôn giống nhau bất kể bạn đứng ở đâu. <code>../images/logo.png</code> tính từ thư mục HIỆN TẠI của bạn (lùi một cấp, rồi vào images), nên ý nghĩa của nó đổi tuỳ nơi bạn chạy.',
        ),
      }),

      mcq({
        prompt: B(
          'In Git, what is the correct order and purpose of these two commands?' + code(
            'git add index.html\ngit commit -m "Add home page"',
          ),
          'Trong Git, hai lệnh sau đúng thứ tự và mục đích là gì?' + code(
            'git add index.html\ngit commit -m "Add home page"',
          ),
        ),
        options: [
          B('<code>add</code> stages the change (shortlists it); <code>commit</code> takes the permanent snapshot with a message', '<code>add</code> đưa thay đổi vào vùng stage (danh sách rút gọn); <code>commit</code> chụp ảnh vĩnh viễn kèm thông điệp'),
          B('<code>add</code> uploads to GitHub; <code>commit</code> deletes the file locally', '<code>add</code> tải lên GitHub; <code>commit</code> xoá file ở local'),
          B('Both commands do exactly the same thing, run twice for safety', 'Cả hai lệnh làm y hệt nhau, chạy hai lần cho chắc'),
          B('<code>commit</code> must always run before <code>add</code>, never after', '<code>commit</code> luôn phải chạy trước <code>add</code>, không bao giờ sau'),
        ],
        correct: 0,
        explanation: EX(
          'From Lesson 1.3: a file moves through three areas — working directory, staging area, repository. <code>git add</code> puts a change on the shortlist for the next snapshot; <code>git commit -m "..."</code> takes that permanent, labelled snapshot. Neither talks to GitHub — that is <code>git push</code> (Lesson 1.4).',
          'Từ Bài 1.3: một file đi qua ba vùng — working directory, staging area, repository. <code>git add</code> đưa thay đổi vào danh sách rút gọn cho ảnh chụp kế tiếp; <code>git commit -m "..."</code> chụp ảnh vĩnh viễn, có nhãn đó. Không lệnh nào nói chuyện với GitHub — đó là việc của <code>git push</code> (Bài 1.4).',
        ),
      }),

      mcq({
        prompt: B(
          'Choose TWO true statements about npm and <code>package.json</code>.',
          'Chọn HAI phát biểu ĐÚNG về npm và <code>package.json</code>.',
        ),
        options: [
          B('<code>node_modules/</code> should never be committed to Git — it is huge and regenerable', '<code>node_modules/</code> không bao giờ nên commit vào Git — nó to và tái tạo được'),
          B('<code>package-lock.json</code> should be committed so teammates get an identical install', '<code>package-lock.json</code> nên được commit để đồng đội cài đặt y hệt'),
          B('devDependencies are shipped to production; dependencies are not', 'devDependencies được gửi lên production; dependencies thì không'),
          B('Running <code>npm install</code> deletes <code>package.json</code>', 'Chạy <code>npm install</code> sẽ xoá <code>package.json</code>'),
        ],
        correct: [0, 1],
        explanation: EX(
          'From Lesson 1.5: <code>node_modules/</code> is regenerable from <code>package.json</code>/<code>package-lock.json</code>, so it belongs in <code>.gitignore</code> — never commit it. <code>package-lock.json</code> records exact installed versions, so DO commit it. It is the opposite way round: dependencies run in production, devDependencies (linters, test tools) do not.',
          'Từ Bài 1.5: <code>node_modules/</code> tái tạo được từ <code>package.json</code>/<code>package-lock.json</code>, nên nó thuộc <code>.gitignore</code> — đừng bao giờ commit. <code>package-lock.json</code> ghi lại đúng phiên bản đã cài, nên HÃY commit nó. Chiều ngược lại mới đúng: dependencies chạy ở production, devDependencies (linter, công cụ test) thì không.',
        ),
      }),

      // ── Chương 2 — HTML ───────────────────────────────────────────────
      mcq({
        prompt: B(
          'What is the correct anatomy of this piece of HTML?' + code('<a href="about.html">About us</a>'),
          'Giải phẫu đúng của mẩu HTML sau là gì?' + code('<a href="about.html">About us</a>'),
        ),
        options: [
          B('<code>a</code> is the tag name, <code>href="about.html"</code> is an attribute, and "About us" is the content', '<code>a</code> là tên thẻ, <code>href="about.html"</code> là một thuộc tính, và "About us" là nội dung'),
          B('<code>href</code> is the tag name and <code>a</code> is an attribute', '<code>href</code> là tên thẻ và <code>a</code> là một thuộc tính'),
          B('"About us" is an attribute of the <code>href</code> element', '"About us" là một thuộc tính của phần tử <code>href</code>'),
          B('There is no closing tag, so this is invalid HTML', 'Không có thẻ đóng nên đây là HTML không hợp lệ'),
        ],
        correct: 0,
        explanation: EX(
          'From Lesson 2.1: an element is opening tag + content + closing tag; an attribute is <code>name="value"</code> living inside the opening tag. Here <code>a</code> is the tag, <code>href</code> is an attribute configuring it, and "About us" is the content between <code>&lt;a&gt;</code> and <code>&lt;/a&gt;</code>.',
          'Từ Bài 2.1: một phần tử là thẻ mở + nội dung + thẻ đóng; một thuộc tính là <code>tên="giá trị"</code> nằm trong thẻ mở. Ở đây <code>a</code> là thẻ, <code>href</code> là thuộc tính cấu hình nó, và "About us" là nội dung giữa <code>&lt;a&gt;</code> và <code>&lt;/a&gt;</code>.',
        ),
      }),

      mcq({
        prompt: B(
          'Why prefer <code>&lt;nav&gt;</code> over a plain <code>&lt;div class="nav"&gt;</code> for a navigation menu?',
          'Vì sao ưu tiên <code>&lt;nav&gt;</code> hơn một <code>&lt;div class="nav"&gt;</code> trơn cho thực đơn điều hướng?',
        ),
        options: [
          B('A <code>&lt;div&gt;</code> always renders more slowly than a <code>&lt;nav&gt;</code> in every browser', 'Một <code>&lt;div&gt;</code> luôn hiển thị chậm hơn một <code>&lt;nav&gt;</code> trên mọi trình duyệt'),
          B('A <code>&lt;nav&gt;</code> names the region for screen readers and search engines; a <code>&lt;div&gt;</code> means nothing', 'Một <code>&lt;nav&gt;</code> đặt tên cho vùng đó với trình đọc màn hình và công cụ tìm kiếm; một <code>&lt;div&gt;</code> chẳng mang nghĩa gì'),
          B('Only a <code>&lt;nav&gt;</code> element is allowed to contain clickable links inside it', 'Chỉ phần tử <code>&lt;nav&gt;</code> mới được phép chứa liên kết bấm được bên trong'),
          B('There is no real difference between a <code>&lt;nav&gt;</code> and a <code>&lt;div&gt;</code> at all', 'Không có khác biệt thật nào giữa một <code>&lt;nav&gt;</code> và một <code>&lt;div&gt;</code> cả'),
        ],
        correct: 1,
        explanation: EX(
          'From Lesson 2.3: a <code>&lt;div&gt;</code> is a generic, meaningless box. Semantic elements like <code>&lt;nav&gt;</code>, <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code> name what a region IS, which screen readers announce, search engines index, and future teammates read at a glance — visually the page can look identical either way.',
          'Từ Bài 2.3: một <code>&lt;div&gt;</code> là một cái hộp chung chung, vô nghĩa. Các phần tử ngữ nghĩa như <code>&lt;nav&gt;</code>, <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code> đặt tên vùng đó LÀ gì, thứ trình đọc màn hình đọc to, công cụ tìm kiếm lập chỉ mục, và đồng đội tương lai đọc lướt hiểu ngay — về mặt hình ảnh trang có thể trông y hệt dù cách nào.',
        ),
      }),

      mcq({
        prompt: B(
          'How many <code>&lt;h1&gt;</code> elements should a normal page have, and why?',
          'Một trang bình thường nên có bao nhiêu phần tử <code>&lt;h1&gt;</code>, và vì sao?',
        ),
        options: [
          B('As many as needed to make important text look bold', 'Bao nhiêu cũng được, miễn làm chữ quan trọng in đậm'),
          B('Exactly one — it is the page’s title, and lower levels nest under it like an outline', 'Đúng một — đó là tiêu đề của trang, các cấp thấp hơn lồng dưới nó như một dàn ý'),
          B('Six, one for each heading level', 'Sáu, mỗi cấp tiêu đề một cái'),
          B('None — headings are only for CSS to style', 'Không cái nào — tiêu đề chỉ để CSS tạo kiểu'),
        ],
        correct: 1,
        explanation: EX(
          'From Lesson 2.2: use exactly one <code>&lt;h1&gt;</code> per page (the page title), then nest <code>&lt;h2&gt;</code>, <code>&lt;h3&gt;</code>… like an outline. Skipping levels for size ("h4 looks smaller") breaks that outline for screen readers and SEO — change size with CSS, not by picking the wrong heading rank.',
          'Từ Bài 2.2: dùng đúng một <code>&lt;h1&gt;</code> mỗi trang (tiêu đề trang), rồi lồng <code>&lt;h2&gt;</code>, <code>&lt;h3&gt;</code>… như một dàn ý. Nhảy cấp vì cỡ chữ ("h4 nhìn nhỏ hơn") làm hỏng dàn ý đó cho trình đọc màn hình và SEO — hãy đổi cỡ bằng CSS, đừng chọn sai thứ bậc tiêu đề.',
        ),
      }),

      mcq({
        prompt: B(
          'Why does <code>&lt;img src="pho.jpg" alt="A steaming bowl of phở"&gt;</code> matter?',
          'Vì sao <code>&lt;img src="pho.jpg" alt="A steaming bowl of phở"&gt;</code> lại quan trọng?',
        ),
        options: [
          B('<code>alt</code> makes the image file smaller so it loads faster', '<code>alt</code> làm file ảnh nhỏ hơn để tải nhanh hơn'),
          B('A screen reader announces the alt text, and it shows if the image fails to load', 'Trình đọc màn hình đọc to nội dung alt, và nó hiện ra nếu ảnh tải hỏng'),
          B('<code>alt</code> is required only for images inside a <code>&lt;table&gt;</code>', '<code>alt</code> chỉ bắt buộc với ảnh nằm trong một <code>&lt;table&gt;</code>'),
          B('Without <code>alt</code>, the browser refuses to display the image at all', 'Thiếu <code>alt</code>, trình duyệt sẽ từ chối hiển thị ảnh hoàn toàn'),
        ],
        correct: 1,
        explanation: EX(
          'From Lesson 2.2: a blind visitor "sees" your image only through its alt text, which a screen reader reads aloud; it also appears if the image fails to load. This is an accessibility duty, not a nicety — use <code>alt=""</code> (empty) only for purely decorative images.',
          'Từ Bài 2.2: một khách khiếm thị "thấy" ảnh của bạn chỉ qua chữ alt, thứ trình đọc màn hình đọc to; nó cũng hiện ra nếu ảnh tải hỏng. Đây là trách nhiệm về khả năng tiếp cận, không phải điểm cộng — chỉ dùng <code>alt=""</code> (rỗng) cho ảnh thuần trang trí.',
        ),
      }),

      mcq({
        prompt: B(
          'Choose TWO true statements about forms.',
          'Chọn HAI phát biểu ĐÚNG về biểu mẫu (form).',
        ),
        options: [
          B('A <code>&lt;label for="email"&gt;</code> must match the <code>id</code> of its <code>&lt;input&gt;</code> to be correctly linked', 'Một <code>&lt;label for="email"&gt;</code> phải khớp với <code>id</code> của <code>&lt;input&gt;</code> của nó mới liên kết đúng'),
          B('Browser validation like <code>required</code> is convenience only — the backend must always re-validate', 'Kiểm tra ở trình duyệt như <code>required</code> chỉ là tiện lợi — backend luôn phải kiểm lại'),
          B('An <code>&lt;input&gt;</code> with no <code>name</code> attribute is still sent to the server under its <code>id</code>', 'Một <code>&lt;input&gt;</code> không có thuộc tính <code>name</code> vẫn được gửi lên server dưới tên <code>id</code> của nó'),
          B('<code>type="email"</code> makes the backend trust the value without checking it', '<code>type="email"</code> khiến backend tin giá trị đó mà không cần kiểm tra'),
        ],
        correct: [0, 1],
        explanation: EX(
          'From Lesson 2.4: the label’s <code>for</code> must match the input’s <code>id</code> so clicking the label focuses the field and screen readers announce it. Browser checks (<code>required</code>, <code>type="email"</code>…) only smooth the experience — a determined user can bypass them, so the server must always re-validate. A field with no <code>name</code> is simply not sent at all.',
          'Từ Bài 2.4: <code>for</code> của label phải khớp <code>id</code> của input để bấm label focus vào ô và trình đọc màn hình đọc tên nó. Kiểm ở trình duyệt (<code>required</code>, <code>type="email"</code>…) chỉ làm mượt trải nghiệm — người dùng cố tình có thể bỏ qua, nên server luôn phải kiểm lại. Một ô không có <code>name</code> thì đơn giản là không được gửi đi.',
        ),
      }),

      // ── Chương 3 — CSS & responsive ─────────────────────────────────
      mcq({
        prompt: B(
          'Which CSS selector matches every element with <code>class="card"</code>?',
          'Bộ chọn CSS nào khớp mọi phần tử có <code>class="card"</code>?',
        ),
        options: [
          B('<code>#card</code>', '<code>#card</code>'),
          B('<code>.card</code>', '<code>.card</code>'),
          B('<code>card</code>', '<code>card</code>'),
          B('<code>*card</code>', '<code>*card</code>'),
        ],
        correct: 1,
        explanation: EX(
          'From Lesson 3.1: a dot prefix (<code>.card</code>) selects by class and matches any number of elements — the reusable, everyday tool. A <code>#</code> prefix selects by id (a single element); a bare word selects by tag name.',
          'Từ Bài 3.1: dấu chấm phía trước (<code>.card</code>) chọn theo class và khớp bao nhiêu phần tử cũng được — công cụ tái dùng, hằng ngày. Dấu <code>#</code> chọn theo id (một phần tử duy nhất); một từ trơn chọn theo tên thẻ.',
        ),
      }),

      mcq({
        prompt: B(
          'What does <code>box-sizing: border-box</code> change about <code>width: 300px</code>?',
          '<code>box-sizing: border-box</code> đổi điều gì ở <code>width: 300px</code>?',
        ),
        options: [
          B('The 300px now includes padding and border, so the visible box is predictably 300px total', '300px giờ đã bao gồm padding và border, nên hộp hiển thị đúng 300px tổng cộng, dễ đoán'),
          B('It removes the border entirely so only content and padding remain', 'Nó xoá hẳn border, chỉ còn content và padding'),
          B('It doubles the width to 600px on every browser', 'Nó nhân đôi chiều rộng thành 600px trên mọi trình duyệt'),
          B('It has no effect unless margin is also set to 0', 'Nó không có tác dụng gì trừ khi margin cũng được đặt về 0'),
        ],
        correct: 0,
        explanation: EX(
          'From Lesson 3.2: by default <code>width</code> sizes only the content, and padding/border get ADDED on top, so the box ends up wider than 300px. <code>border-box</code> makes 300px the FINAL size including padding and border — predictable, which is why it belongs at the top of every stylesheet.',
          'Từ Bài 3.2: mặc định <code>width</code> chỉ tính content, còn padding/border bị CỘNG THÊM vào, nên hộp rộng hơn 300px. <code>border-box</code> khiến 300px là kích thước CUỐI CÙNG đã gồm padding và border — dễ đoán, đó là lý do nó nên nằm ở đầu mọi bảng kiểu.',
        ),
      }),

      mcq({
        prompt: B(
          'In this Flexbox row, which property centres the items along the MAIN axis?' + code(
            '.navbar {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
          ),
          'Trong hàng Flexbox này, thuộc tính nào căn giữa các mục theo TRỤC CHÍNH?' + code(
            '.navbar {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
          ),
        ),
        options: [
          B('<code>display: flex</code>', '<code>display: flex</code>'),
          B('<code>align-items</code>', '<code>align-items</code>'),
          B('<code>justify-content</code>', '<code>justify-content</code>'),
          B('Neither — Flexbox cannot centre items', 'Không cái nào — Flexbox không căn giữa được'),
        ],
        correct: 2,
        explanation: EX(
          'From Lesson 3.3: <code>justify-content</code> positions items along the MAIN axis (row direction by default); <code>align-items</code> positions them along the CROSS axis (perpendicular). Setting both to <code>center</code> is the famous "perfect centre" trick.',
          'Từ Bài 3.3: <code>justify-content</code> đặt vị trí các mục dọc theo TRỤC CHÍNH (mặc định là hàng); <code>align-items</code> đặt theo TRỤC PHỤ (vuông góc). Đặt cả hai thành <code>center</code> là chiêu "căn giữa hoàn hảo" trứ danh.',
        ),
      }),

      mcq({
        prompt: B(
          'What does <code>grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));</code> do?',
          '<code>grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));</code> làm gì?',
        ),
        options: [
          B('Creates exactly one 220px-wide column and simply ignores any extra horizontal space', 'Tạo đúng một cột rộng 220px và đơn giản bỏ qua mọi khoảng trống ngang dư ra'),
          B('Fits as many 220px-or-wider columns as the width allows, sharing extra space evenly — no media query needed', 'Nhồi vào nhiều cột từ 220px trở lên nhất mà chiều rộng cho phép, chia đều phần dư — không cần media query'),
          B('Forces every single column on the page to exactly one pixel wide', 'Buộc mọi cột trên trang rộng đúng một pixel'),
          B('Turns off CSS Grid entirely and falls back silently to Flexbox', 'Tắt hẳn CSS Grid và âm thầm chuyển sang dùng Flexbox'),
        ],
        correct: 1,
        explanation: EX(
          'From Lesson 3.4: <code>auto-fit</code> packs in as many columns as fit; <code>minmax(220px, 1fr)</code> means each column is at least 220px but grows to share extra space. The result reflows automatically — 4 columns on desktop, 2 on tablet, 1 on phone — with zero media queries.',
          'Từ Bài 3.4: <code>auto-fit</code> nhồi vào nhiều cột nhất vừa đủ; <code>minmax(220px, 1fr)</code> nghĩa là mỗi cột tối thiểu 220px nhưng nở ra chia phần dư. Kết quả tự sắp lại — 4 cột desktop, 2 tablet, 1 điện thoại — không cần media query nào.',
        ),
      }),

      mcq({
        prompt: B(
          'Without this meta tag, phones pretend to be a wide desktop and shrink the whole page to unreadable text:' + code(
            '<meta name="viewport" content="width=device-width, initial-scale=1">',
          ) + 'What does this tag do, and what strategy pairs with it?',
          'Thiếu thẻ meta này, điện thoại giả vờ là desktop rộng và thu nhỏ cả trang tới mức không đọc nổi:' + code(
            '<meta name="viewport" content="width=device-width, initial-scale=1">',
          ) + 'Thẻ này làm gì, và chiến lược nào đi kèm nó?',
        ),
        options: [
          B('Matches the page width to the real device width; pairs with mobile-first CSS that adds complexity via min-width queries', 'Khớp chiều rộng trang với chiều rộng thật của thiết bị; đi cùng CSS mobile-first thêm độ phức tạp qua query min-width'),
          B('Loads a completely separate mobile-only HTML file for phone visitors', 'Tải một file HTML riêng biệt chỉ dành cho khách dùng điện thoại'),
          B('Disables all CSS on phones so the page loads noticeably faster', 'Tắt hết CSS trên điện thoại để trang tải nhanh hơn rõ rệt'),
          B('Only affects print stylesheets, and never applies to screens at all', 'Chỉ ảnh hưởng bảng kiểu in, không bao giờ áp dụng cho màn hình cả'),
        ],
        correct: 0,
        explanation: EX(
          'From Lesson 3.5: the viewport tag makes the page match the device’s real width instead of pretending to be a wide desktop. The recommended pairing is mobile-first: write the simplest layout as base CSS, then use <code>@media (min-width: ...)</code> queries to ADD complexity as the screen grows.',
          'Từ Bài 3.5: thẻ viewport khiến trang khớp chiều rộng thật của thiết bị thay vì giả vờ là desktop rộng. Chiến lược khuyến nghị đi kèm là mobile-first: viết bố cục đơn giản nhất làm CSS nền, rồi dùng query <code>@media (min-width: ...)</code> để THÊM độ phức tạp khi màn hình lớn dần.',
        ),
      }),

      // ── Chương 4 — JavaScript nền tảng ──────────────────────────────
      mcq({
        prompt: B(
          'Which keyword should be your DEFAULT choice for a variable, switching only when the value must be reassigned?',
          'Từ khoá nào nên là lựa chọn MẶC ĐỊNH cho một biến, chỉ đổi khi giá trị bắt buộc phải gán lại?',
        ),
        options: [
          B('<code>var</code>', '<code>var</code>'),
          B('<code>let</code>', '<code>let</code>'),
          B('<code>const</code>', '<code>const</code>'),
          B('<code>function</code>', '<code>function</code>'),
        ],
        correct: 2,
        explanation: EX(
          'From Lesson 4.1: <code>const</code> is the default — the name cannot be reassigned, which prevents a whole class of accidental bugs. Use <code>let</code> only for values you intend to change (a counter, a running total). <code>var</code> is the old way with confusing scope rules — avoid it in new code.',
          'Từ Bài 4.1: <code>const</code> là mặc định — tên không gán lại được, tránh cả một lớp lỗi do vô tình. Chỉ dùng <code>let</code> cho giá trị bạn định đổi (bộ đếm, tổng đang chạy). <code>var</code> là cách cũ với luật phạm vi khó hiểu — tránh trong code mới.',
        ),
      }),

      mcq({
        prompt: B(
          'What does <code>typeof [1, 2, 3]</code> return?',
          '<code>typeof [1, 2, 3]</code> trả về gì?',
        ),
        options: [
          B('<code>"array"</code>', '<code>"array"</code>'),
          B('<code>"list"</code>', '<code>"list"</code>'),
          B('<code>"object"</code>', '<code>"object"</code>'),
          B('<code>"number"</code>', '<code>"number"</code>'),
        ],
        correct: 2,
        explanation: EX(
          'Verified by running it. JavaScript has no separate array type at the <code>typeof</code> level — arrays are a special kind of object, so <code>typeof</code> reports <code>"object"</code>. To actually test for an array, use <code>Array.isArray(value)</code> instead.',
          'Đã chạy thật. JavaScript không có kiểu mảng riêng ở tầng <code>typeof</code> — mảng là một dạng đặc biệt của object, nên <code>typeof</code> báo <code>"object"</code>. Muốn kiểm thật một giá trị có phải mảng, dùng <code>Array.isArray(value)</code>.',
        ),
      }),

      mcq({
        prompt: B(
          'What does this print?' + code('console.log("2" + 2);'),
          'Đoạn mã sau in ra gì?' + code('console.log("2" + 2);'),
        ),
        options: [
          B('<code>4</code>', '<code>4</code>'),
          B('<code>"22"</code>', '<code>"22"</code>'),
          B('<code>NaN</code>', '<code>NaN</code>'),
          B('It throws a TypeError', 'Ném ra một TypeError'),
        ],
        correct: 1,
        explanation: EX(
          'Verified by running it: prints <code>22</code> (a string). The <code>+</code> operator is overloaded — with a string on either side it joins as text instead of adding, so <code>"2" + 2</code> becomes the string <code>"22"</code>, not the number 4. This is exactly the trap from Lesson 4.1.',
          'Đã chạy thật: in ra <code>22</code> (một chuỗi). Toán tử <code>+</code> mang hai vai — có một chuỗi ở bất kỳ bên nào thì nối thành chữ thay vì cộng, nên <code>"2" + 2</code> thành chuỗi <code>"22"</code>, không phải số 4. Đúng là cái bẫy trong Bài 4.1.',
        ),
      }),

      mcq({
        prompt: B(
          'What does this print?' + code('console.log([1, 2, 3, 4].filter(n => n > 2));'),
          'Đoạn mã sau in ra gì?' + code('console.log([1, 2, 3, 4].filter(n => n > 2));'),
        ),
        options: [
          B('<code>[1, 2]</code>', '<code>[1, 2]</code>'),
          B('<code>[true, true, true, true]</code>', '<code>[true, true, true, true]</code>'),
          B('<code>[3, 4]</code>', '<code>[3, 4]</code>'),
          B('<code>10</code>', '<code>10</code>'),
        ],
        correct: 2,
        explanation: EX(
          'Verified by running it. <code>filter</code> builds a NEW array keeping only the items where the test is true — here, values greater than 2, so <code>[3, 4]</code>. <code>map</code> would transform every item (same length); <code>reduce</code> would boil the array down to one value, like a sum.',
          'Đã chạy thật. <code>filter</code> tạo mảng MỚI chỉ giữ những phần tử mà phép thử đúng — ở đây là giá trị lớn hơn 2, nên ra <code>[3, 4]</code>. <code>map</code> sẽ biến đổi mọi phần tử (cùng độ dài); <code>reduce</code> sẽ gộp mảng thành một giá trị, như một tổng.',
        ),
      }),

      mcq({
        prompt: B(
          'How do you select the element with <code>id="save"</code> and run a function when it is clicked?',
          'Làm sao chọn phần tử có <code>id="save"</code> và chạy một hàm khi nó được bấm?',
        ),
        options: [
          B(
            'document.querySelector("save"); btn.click(handler);',
            'document.querySelector("save"); btn.click(handler);',
          ),
          B(
            'document.querySelector(".save"); btn.onClick = handler();',
            'document.querySelector(".save"); btn.onClick = handler();',
          ),
          B(
            'document.querySelector("#save"); btn.addEventListener("click", handler);',
            'document.querySelector("#save"); btn.addEventListener("click", handler);',
          ),
          B(
            'document.getElement("save"); btn.on("click", handler);',
            'document.getElement("save"); btn.on("click", handler);',
          ),
        ],
        correct: 2,
        explanation: EX(
          'From Lesson 4.5: <code>querySelector</code> takes any CSS selector — an id needs the <code>#</code> prefix, exactly as in CSS (Chapter 3). Attaching a handler is <code>addEventListener("click", handler)</code>, passing the function itself, not calling it (<code>handler()</code> would run it immediately instead of waiting for the click).',
          'Từ Bài 4.5: <code>querySelector</code> nhận bất kỳ bộ chọn CSS nào — một id cần tiền tố <code>#</code>, đúng như trong CSS (Chương 3). Gắn bộ xử lý là <code>addEventListener("click", handler)</code>, truyền chính hàm đó, không gọi nó (<code>handler()</code> sẽ chạy ngay lập tức thay vì chờ cú bấm).',
        ),
      }),

      // ── Chương 5 — JavaScript bất đồng bộ & module ──────────────────
      mcq({
        prompt: B(
          'What does this print?' + code(
            'console.log("1");\nsetTimeout(() => console.log("2"), 0);\nconsole.log("3");',
          ),
          'Đoạn mã sau in ra gì?' + code(
            'console.log("1");\nsetTimeout(() => console.log("2"), 0);\nconsole.log("3");',
          ),
        ),
        options: [
          B('1, 2, 3', '1, 2, 3'),
          B('1, 3, 2', '1, 3, 2'),
          B('2, 1, 3', '2, 1, 3'),
          B('1, 3 (2 never runs)', '1, 3 (2 không bao giờ chạy)'),
        ],
        correct: 1,
        explanation: EX(
          'Verified by running it. Even a <code>0 ms</code> timer does not run inline — its callback is placed in a queue and only runs AFTER all current synchronous code finishes. So the synchronous lines "1" and "3" print first, and "2" prints last.',
          'Đã chạy thật. Ngay cả bộ hẹn <code>0 ms</code> cũng không chạy tại chỗ — callback của nó được đưa vào hàng đợi và chỉ chạy SAU KHI toàn bộ code đồng bộ hiện tại xong. Nên hai dòng đồng bộ "1" và "3" in trước, và "2" in cuối cùng.',
        ),
      }),

      mcq({
        prompt: B(
          'Choose TWO true statements about Promises and async/await.',
          'Chọn HAI phát biểu ĐÚNG về Promise và async/await.',
        ),
        options: [
          B('A Promise has three states: pending, fulfilled, rejected — and settles only once', 'Một Promise có ba trạng thái: pending, fulfilled, rejected — và chỉ chốt một lần'),
          B('<code>await</code> can be used anywhere, even outside an <code>async</code> function', '<code>await</code> dùng được ở bất cứ đâu, kể cả ngoài một hàm <code>async</code>'),
          B('Errors from an awaited call can be caught with an ordinary <code>try/catch</code>', 'Lỗi từ một lời gọi có await bắt được bằng <code>try/catch</code> thông thường'),
          B('<code>Promise.all</code> runs its promises one after another, never in parallel', '<code>Promise.all</code> chạy các promise lần lượt, không bao giờ song song'),
        ],
        correct: [0, 2],
        explanation: EX(
          'From Lessons 5.2–5.3: a Promise moves from pending to fulfilled or rejected exactly once. <code>await</code> only works inside an <code>async</code> function (top-level await is a special ESM case, not the general rule). Wrapping awaited calls in ordinary <code>try/catch</code> is how you handle their errors. <code>Promise.all</code> does the opposite of sequential — it runs everything in parallel and waits for all.',
          'Từ Bài 5.2–5.3: một Promise đi từ pending sang fulfilled hoặc rejected đúng một lần. <code>await</code> chỉ dùng được trong một hàm <code>async</code> (top-level await là trường hợp đặc biệt của ESM, không phải luật chung). Bọc lời gọi có await trong <code>try/catch</code> thông thường là cách xử lý lỗi của nó. <code>Promise.all</code> làm ngược lại tuần tự — nó chạy mọi thứ song song và chờ tất cả.',
        ),
      }),

      mcq({
        prompt: B(
          'Your backend returns HTTP 404 for a missing user. What happens to the Promise from <code>fetch()</code>?',
          'Backend trả về HTTP 404 cho một user không tồn tại. Chuyện gì xảy ra với Promise của <code>fetch()</code>?',
        ),
        options: [
          B('Still fulfils the Promise — you must check <code>response.ok</code> yourself', 'Vẫn fulfilled Promise đó — bạn phải tự kiểm <code>response.ok</code>'),
          B('Always rejects the Promise on any status code other than 200', 'Luôn reject Promise đó với mọi mã trạng thái khác 200'),
          B('Rejects only on 404, but still fulfils normally on 500', 'Chỉ reject với 404, nhưng vẫn fulfilled bình thường với 500'),
          B('Throws a SyntaxError immediately before the request is sent', 'Ném ngay một SyntaxError trước khi request được gửi đi'),
        ],
        correct: 0,
        explanation: EX(
          'From Lesson 5.4: <code>fetch</code> only rejects on a network failure — a <code>404</code> or <code>500</code> response still FULFILS the Promise. You must check <code>response.ok</code> yourself and throw if it is false, or your code will silently treat an error page as success.',
          'Từ Bài 5.4: <code>fetch</code> chỉ reject khi lỗi mạng — một phản hồi <code>404</code> hay <code>500</code> vẫn FULFILLED Promise đó. Bạn phải tự kiểm <code>response.ok</code> và ném lỗi nếu nó false, nếu không code của bạn sẽ âm thầm coi trang lỗi là thành công.',
        ),
      }),
    ],
  }],
};
