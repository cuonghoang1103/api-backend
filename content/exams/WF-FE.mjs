/**
 * Web Foundations — Final Exam (all 11 chapters).
 *
 * 34 câu trắc nghiệm, lấy mẫu trên toàn bộ Mục 0 + Chương 1-10 của khoá
 * `content/courses/web-foundations/`. Khó hơn các Progress Test một chút —
 * ưu tiên câu nối ý tưởng giữa các chương (đường dẫn tương đối ở terminal +
 * import + href; box model; strict equality; thứ tự event loop; 401 vs 403;
 * INNER vs LEFT JOIN; HTML ngữ nghĩa cho khả năng tiếp cận; ES module ↔ npm).
 *
 * ⚠️ Mọi đoạn "in ra gì" đã được CHẠY THẬT bằng node (v22) để lấy đáp án —
 * không suy đoán. Mọi câu "SQL trả về gì" đã được tính tay từng bước, đối
 * chiếu với ví dụ trong bài học.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/WF-FE.mjs --apply
 */
import { B, EX, code, mcq, wfInstructions } from './_lib/wf-exam-kit.mjs';

export default {
  course: { slug: 'web-foundations' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Final Exam — Web Foundations (all 11 chapters)',
        'Bài thi cuối khoá — Nền tảng Lập trình Web (trọn 11 chương)',
      ),
      description: B(
        'A comprehensive sample across every chapter: how the web works, tools, HTML, CSS, JavaScript, async JavaScript, HTTP and APIs, auth and security, data and SQL, TypeScript, and thinking/debugging/Git. 34 multiple-choice questions, several connecting ideas across chapters.',
        'Một đề bao quát trên mọi chương: web hoạt động thế nào, công cụ, HTML, CSS, JavaScript, JavaScript bất đồng bộ, HTTP và API, xác thực và bảo mật, dữ liệu và SQL, TypeScript, và tư duy/gỡ lỗi/Git. 34 câu trắc nghiệm, nhiều câu nối ý tưởng giữa các chương.',
      ),
      durationMinutes: 90,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: wfInstructions(
        'Final Exam',
        'all 11 chapters of the course — how the web works, tools, HTML, CSS, JavaScript, async JavaScript, HTTP and APIs, auth and security, data and SQL, TypeScript, and thinking/debugging/Git',
      ),
      questions: [
        // ── Mục 0 — Web hoạt động thế nào ────────────────────────────────
        mcq({
          prompt: B(
            'You type cuongthai.com and press Enter. What does DNS do, before any HTTP request is sent?',
            'Bạn gõ cuongthai.com và bấm Enter. DNS làm gì, trước khi bất kỳ yêu cầu HTTP nào được gửi?',
          ),
          options: [
            B('Translates the domain name into an IP address the browser can connect to', 'Dịch tên miền thành một địa chỉ IP mà trình duyệt kết nối được'),
            B('Downloads the HTML of the home page directly', 'Tải thẳng HTML của trang chủ'),
            B('Encrypts the connection with TLS', 'Mã hoá kết nối bằng TLS'),
            B('Runs the JavaScript on the page', 'Chạy JavaScript trên trang'),
          ],
          correct: 0,
          explanation: EX(
            'DNS is the internet\'s phone book: computers only know IP addresses, so DNS turns "cuongthai.com" into something like "160.187.1.208" before the browser can even open a connection. Everything else (the request, the response, encryption) happens after this lookup.',
            'DNS là danh bạ của internet: máy tính chỉ biết địa chỉ IP, nên DNS đổi "cuongthai.com" thành thứ như "160.187.1.208" trước khi trình duyệt mở được kết nối. Mọi thứ khác (request, response, mã hoá) xảy ra sau bước tra cứu này.',
          ),
        }),

        mcq({
          prompt: B(
            'Which of these should NEVER be placed in code that ships to the browser (client-side JavaScript)?',
            'Thứ nào KHÔNG BAO GIỜ nên đặt trong mã gửi tới trình duyệt (JavaScript phía client)?',
          ),
          options: [
            B('A secret API key or database password', 'Một API key bí mật hoặc mật khẩu cơ sở dữ liệu'),
            B('The text shown inside a &lt;h1&gt; heading', 'Chữ hiển thị bên trong một tiêu đề &lt;h1&gt;'),
            B('A CSS class name used for styling', 'Một tên class CSS dùng để tạo kiểu'),
            B('The title of a public blog post', 'Tiêu đề của một bài blog công khai'),
          ],
          correct: 0,
          explanation: EX(
            'Anything sent to the browser is visible to the visitor — right-click "View Source" or open DevTools and it is all readable. Secrets (API keys, passwords, signing keys) must stay on the server, which is exactly why the client/server split from Lesson 0.2 matters: the server holds what the browser must never see.',
            'Bất cứ gì gửi tới trình duyệt đều người xem thấy được — chuột phải "View Source" hoặc mở DevTools là đọc được hết. Bí mật (API key, mật khẩu, khoá ký) phải ở lại server, đúng là lý do ranh giới client/server ở Bài 0.2 quan trọng: server giữ thứ trình duyệt không bao giờ được thấy.',
          ),
        }),

        mcq({
          prompt: B(
            'A server replies with the first line ' + code('HTTP/1.1 200 OK') + ' followed by an HTML document. Which is the status code, and which is the body?',
            'Server trả lời với dòng đầu ' + code('HTTP/1.1 200 OK') + ' theo sau bởi một tài liệu HTML. Đâu là mã trạng thái, đâu là body?',
          ),
          options: [
            B('200 is the status code; the HTML document is the body', '200 là mã trạng thái; tài liệu HTML là body'),
            B('HTTP/1.1 is the status code; 200 is the body', 'HTTP/1.1 là mã trạng thái; 200 là body'),
            B('200 is the body; the HTML is a header', '200 là body; HTML là một header'),
            B('OK is the status code; HTML is a header', 'OK là mã trạng thái; HTML là một header'),
          ],
          correct: 0,
          explanation: EX(
            'A response has a first line (protocol version + status code + status text), optional headers, then the body. 200 is the numeric status code, "OK" is its text label, and the HTML document is the actual content — the body. Chapter 6 goes much deeper into this shape.',
            'Một phản hồi có một dòng đầu (phiên bản giao thức + mã trạng thái + chữ mô tả), header tuỳ chọn, rồi body. 200 là mã trạng thái dạng số, "OK" là nhãn chữ của nó, và tài liệu HTML là nội dung thật — body. Chương 6 đào sâu hơn nhiều vào hình dạng này.',
          ),
        }),

        // ── Chương 1 — Bộ công cụ ────────────────────────────────────────
        mcq({
          prompt: B(
            'Your project has ' + code('src/pages/home.js') + ' and ' + code('src/utils/format.js') + ' — pages/ and utils/ are SIBLING folders inside src/. Sitting inside src/pages/ in a terminal, and writing an import inside home.js, which relative path reaches format.js in BOTH cases?',
            'Dự án có ' + code('src/pages/home.js') + ' và ' + code('src/utils/format.js') + ' — pages/ và utils/ là hai thư mục ANH EM bên trong src/. Đứng trong src/pages/ ở terminal, và viết import trong home.js, đường dẫn tương đối nào tới được format.js trong CẢ HAI trường hợp?',
          ),
          options: [
            B('../utils/format.js', '../utils/format.js'),
            B('./utils/format.js', './utils/format.js'),
            B('/utils/format.js', '/utils/format.js'),
            B('utils/format.js', 'utils/format.js'),
          ],
          correct: 0,
          explanation: EX(
            'The same rule from Lesson 1.1 applies whether you type it in a terminal (cd ..) or write it in a JavaScript import: ".." means "go up one folder first." From pages/ you must step OUT to src/ before stepping INTO utils/, so it is "../utils/format.js" — the exact same string works as a terminal path and as an import path, since pages/ and utils/ are siblings, not one inside the other.',
            'Đúng luật ở Bài 1.1 dù bạn gõ ở terminal (cd ..) hay viết trong một import JavaScript: ".." nghĩa là "lùi lên một thư mục trước." Từ pages/ bạn phải BƯỚC RA src/ trước khi bước VÀO utils/, nên là "../utils/format.js" — đúng một chuỗi đó dùng được cả làm đường dẫn terminal lẫn đường dẫn import, vì pages/ và utils/ là anh em, không cái nào nằm trong cái kia.',
          ),
        }),

        mcq({
          prompt: B(
            'You just edited a file. Put these three commands in the correct everyday Git order.',
            'Bạn vừa sửa một file. Sắp ba lệnh sau theo đúng thứ tự Git hằng ngày.',
          ),
          options: [
            B('git add . → git commit -m "..." → git push', 'git add . → git commit -m "..." → git push'),
            B('git push → git add . → git commit -m "..."', 'git push → git add . → git commit -m "..."'),
            B('git commit -m "..." → git add . → git push', 'git commit -m "..." → git add . → git push'),
            B('git add . → git push → git commit -m "..."', 'git add . → git push → git commit -m "..."'),
          ],
          correct: 0,
          explanation: EX(
            'You stage the changes you want in the next snapshot first (add), take the snapshot with a message (commit), then upload that commit to the remote (push). Committing before staging, or pushing before committing, either errors or sends nothing new.',
            'Bạn đưa các thay đổi muốn vào ảnh chụp kế tiếp vào vùng stage trước (add), chụp ảnh kèm thông điệp (commit), rồi tải commit đó lên remote (push). Commit trước khi add, hay push trước khi commit, đều hoặc báo lỗi hoặc chẳng gửi được gì mới.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO files/folders that SHOULD be committed to Git in a typical npm project.',
            'Chọn HAI file/thư mục NÊN được commit vào Git trong một dự án npm điển hình.',
          ),
          options: [
            B('package.json', 'package.json'),
            B('package-lock.json', 'package-lock.json'),
            B('node_modules/', 'node_modules/'),
            B('.env', '.env'),
          ],
          correct: [0, 1],
          explanation: EX(
            'package.json (the project\'s ID card) and package-lock.json (the exact versions installed, so teammates get an identical setup) both belong in Git. node_modules/ is huge and regenerable — never commit it. .env holds secrets — never commit it either. Both wrong answers here are things Lesson 1.5 explicitly says to keep out of Git.',
            'package.json (chứng minh thư dự án) và package-lock.json (phiên bản chính xác đã cài, để đồng đội có cài đặt y hệt) đều thuộc về Git. node_modules/ to và tái tạo được — đừng bao giờ commit. .env chứa bí mật — cũng đừng commit. Cả hai đáp án sai ở đây đều là thứ Bài 1.5 nói rõ phải giữ ngoài Git.',
          ),
        }),

        // ── Chương 2 — HTML ───────────────────────────────────────────────
        mcq({
          prompt: B(
            'Which element is the correct semantic choice for a block of navigation links (a main menu)?',
            'Phần tử nào là lựa chọn ngữ nghĩa đúng cho một khối liên kết điều hướng (thực đơn chính)?',
          ),
          options: [
            B('&lt;nav&gt;', '&lt;nav&gt;'),
            B('&lt;div class="nav"&gt;', '&lt;div class="nav"&gt;'),
            B('&lt;section&gt;', '&lt;section&gt;'),
            B('&lt;aside&gt;', '&lt;aside&gt;'),
          ],
          correct: 0,
          explanation: EX(
            'A &lt;div class="nav"&gt; looks identical on screen but means nothing to a screen reader or search engine — &lt;nav&gt; is the landmark element that actually says "this is navigation." Screen readers let users jump straight to it by name.',
            'Một &lt;div class="nav"&gt; nhìn y hệt trên màn hình nhưng chẳng có ý nghĩa gì với trình đọc màn hình hay công cụ tìm kiếm — &lt;nav&gt; mới là phần tử "địa danh" thật sự nói "đây là điều hướng." Trình đọc màn hình cho người dùng nhảy thẳng tới nó theo tên.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO correct statements about accessible HTML.',
            'Chọn HAI phát biểu ĐÚNG về HTML tiếp cận được.',
          ),
          options: [
            B('A &lt;label for="pw"&gt; must match an &lt;input id="pw"&gt; so clicking the label focuses the field and screen readers announce it', 'Một &lt;label for="pw"&gt; phải khớp &lt;input id="pw"&gt; để bấm label đưa con trỏ vào ô và trình đọc màn hình đọc tên nó'),
            B('A purely decorative image should still have a long, detailed alt description', 'Một ảnh chỉ để trang trí vẫn nên có mô tả alt dài, chi tiết'),
            B('Screen readers read the alt attribute aloud, and it shows if the image fails to load', 'Trình đọc màn hình đọc to thuộc tính alt, và nó hiện ra nếu ảnh tải hỏng'),
            B('Skipping from &lt;h1&gt; straight to &lt;h4&gt; is fine as long as the text looks the right size', 'Nhảy từ &lt;h1&gt; thẳng sang &lt;h4&gt; là ổn miễn chữ trông đúng cỡ'),
          ],
          correct: [0, 2],
          explanation: EX(
            'label/for-id pairing and alt text being read aloud (or shown as a fallback) are both correct, straight from Lessons 2.4-2.5. A decorative image should get an EMPTY alt="" so it is skipped, not a long description — and heading levels must follow rank, not visual size, or the outline breaks for screen readers and SEO.',
            'Cặp label/for-id và alt được đọc to (hoặc hiện dự phòng) đều đúng, thẳng từ Bài 2.4-2.5. Một ảnh trang trí nên có alt="" RỖNG để bị bỏ qua, không phải mô tả dài — và cấp tiêu đề phải theo thứ bậc, không theo cỡ nhìn, kẻo hỏng dàn ý cho trình đọc màn hình và SEO.',
          ),
        }),

        mcq({
          prompt: B(
            'You need to display a price list with rows and columns of real tabular data. Which is correct HTML practice?',
            'Bạn cần hiển thị một bảng giá gồm hàng và cột dữ liệu bảng thật. Cách làm HTML đúng là gì?',
          ),
          options: [
            B('Use a &lt;table&gt; with &lt;th&gt; header cells and &lt;td&gt; data cells', 'Dùng &lt;table&gt; với ô tiêu đề &lt;th&gt; và ô dữ liệu &lt;td&gt;'),
            B('Use nested &lt;div&gt;s positioned with a grid of &lt;table&gt; only for the outer page layout', 'Dùng &lt;div&gt; lồng nhau định vị bằng một &lt;table&gt; chỉ cho bố cục trang bên ngoài'),
            B('Use &lt;ul&gt; and &lt;li&gt; for every row', 'Dùng &lt;ul&gt; và &lt;li&gt; cho mỗi hàng'),
            B('Use a &lt;form&gt; with one &lt;input&gt; per cell', 'Dùng một &lt;form&gt; với một &lt;input&gt; mỗi ô'),
          ],
          correct: 0,
          explanation: EX(
            'Tables are for genuine tabular data — a real grid of rows and columns like a price list. Using &lt;table&gt; for whole-page layout is a 1990s hack Lesson 2.5 warns against; page layout is CSS\'s job (Flexbox/Grid, Chapter 3).',
            'Bảng dành cho dữ liệu dạng bảng thật — một lưới hàng cột thật như bảng giá. Dùng &lt;table&gt; để dàn cả trang là chiêu thập niên 1990 mà Bài 2.5 cảnh báo; dàn trang là việc của CSS (Flexbox/Grid, Chương 3).',
          ),
        }),

        // ── Chương 3 — CSS & responsive ─────────────────────────────────
        mcq({
          prompt: B(
            'With ' + code('*, *::before, *::after { box-sizing: border-box; }') + ' applied, what is the actual CONTENT width here?' + code(
              '.box {\n  width: 200px;\n  padding: 20px;\n  border: 5px solid #333;\n}',
            ),
            'Với ' + code('*, *::before, *::after { box-sizing: border-box; }') + ' đã áp dụng, chiều rộng phần CONTENT thật sự là bao nhiêu?' + code(
              '.box {\n  width: 200px;\n  padding: 20px;\n  border: 5px solid #333;\n}',
            ),
          ),
          options: [
            B('150px', '150px'),
            B('200px', '200px'),
            B('250px', '250px'),
            B('160px', '160px'),
          ],
          correct: 0,
          explanation: EX(
            'With border-box, width:200px is the TOTAL box (content + padding + border), not just the content. Padding takes 20px×2=40px and border takes 5px×2=10px off both sides, leaving 200 − 40 − 10 = 150px for the content itself.',
            'Với border-box, width:200px là TOÀN BỘ hộp (content + padding + border), không chỉ content. Padding chiếm 20px×2=40px và border chiếm 5px×2=10px ở hai cạnh, còn lại 200 − 40 − 10 = 150px cho phần content.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO true statements about Flexbox and CSS Grid.',
            'Chọn HAI phát biểu ĐÚNG về Flexbox và CSS Grid.',
          ),
          options: [
            B('In Flexbox, justify-content positions items along the main axis, while align-items positions them on the cross axis', 'Trong Flexbox, justify-content đặt vị trí theo trục chính, còn align-items đặt vị trí theo trục phụ'),
            B('CSS Grid is the better fit for a true two-dimensional layout of rows AND columns at once, like a dashboard', 'CSS Grid hợp hơn cho một bố cục hai chiều thật sự gồm CẢ hàng VÀ cột cùng lúc, như một dashboard'),
            B('A real project must pick either Flexbox or Grid and use only that one everywhere', 'Một dự án thật phải chọn hoặc Flexbox hoặc Grid và chỉ dùng đúng một cái ở khắp nơi'),
            B('grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) requires a media query to reflow on smaller screens', 'grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) cần một media query để tự sắp lại trên màn hình nhỏ hơn'),
          ],
          correct: [0, 1],
          explanation: EX(
            'justify-content = main axis, align-items = cross axis (Lesson 3.3), and Grid handles two dimensions at once while Flexbox handles one line (Lesson 3.4) — both true. Real pages mix both together (Grid for the page skeleton, Flexbox inside cards). And auto-fit/minmax reflows WITHOUT any media query — that is exactly why Lesson 3.4 calls it worth memorising.',
            'justify-content = trục chính, align-items = trục phụ (Bài 3.3), và Grid xử lý hai chiều cùng lúc còn Flexbox xử lý một đường (Bài 3.4) — cả hai đều đúng. Trang thật trộn cả hai (Grid cho khung trang, Flexbox bên trong thẻ). Và auto-fit/minmax tự sắp lại KHÔNG CẦN media query nào — đúng là lý do Bài 3.4 gọi nó đáng học thuộc.',
          ),
        }),

        mcq({
          prompt: B(
            'Given this mobile-first CSS, how many columns apply at a 900px-wide screen?' + code(
              '.cards { display: grid; grid-template-columns: 1fr; }\n' +
              '@media (min-width: 768px) { .cards { grid-template-columns: repeat(2, 1fr); } }\n' +
              '@media (min-width: 1024px) { .cards { grid-template-columns: repeat(3, 1fr); } }',
            ),
            'Với CSS mobile-first sau, bao nhiêu cột áp dụng ở màn hình rộng 900px?' + code(
              '.cards { display: grid; grid-template-columns: 1fr; }\n' +
              '@media (min-width: 768px) { .cards { grid-template-columns: repeat(2, 1fr); } }\n' +
              '@media (min-width: 1024px) { .cards { grid-template-columns: repeat(3, 1fr); } }',
            ),
          ),
          options: [
            B('2 columns', '2 cột'),
            B('1 column', '1 cột'),
            B('3 columns', '3 cột'),
            B('0 columns — the CSS is invalid at 900px', '0 cột — CSS không hợp lệ ở 900px'),
          ],
          correct: 0,
          explanation: EX(
            'At 900px, "min-width: 768px" matches (900 ≥ 768) but "min-width: 1024px" does not (900 < 1024). The base rule (1 column) is overridden by the 768px rule since it comes later and its condition holds, giving 2 columns. This is exactly how mobile-first breakpoints stack from Lesson 3.5.',
            'Ở 900px, "min-width: 768px" khớp (900 ≥ 768) nhưng "min-width: 1024px" thì không (900 < 1024). Quy tắc nền (1 cột) bị ghi đè bởi quy tắc 768px vì nó viết sau và điều kiện đúng, cho ra 2 cột. Đúng cách các breakpoint mobile-first chồng lên nhau ở Bài 3.5.',
          ),
        }),

        // ── Chương 4 — JavaScript nền tảng ──────────────────────────────
        mcq({
          prompt: B(
            'What does this print?' + code('console.log(1 + "2" + 3);'),
            'Đoạn này in ra gì?' + code('console.log(1 + "2" + 3);'),
          ),
          options: [
            B('"123"', '"123"'),
            B('6', '6'),
            B('"33"', '"33"'),
            B('NaN', 'NaN'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. JavaScript evaluates left to right: 1 + "2" joins as text because one side is a string, giving "12"; then "12" + 3 joins again, giving "123". Once a string enters the chain, + keeps joining text from that point on.',
            'Đã chạy thật. JavaScript tính từ trái sang phải: 1 + "2" nối thành chữ vì một bên là chuỗi, ra "12"; rồi "12" + 3 lại nối tiếp, ra "123". Một khi có chuỗi lọt vào chuỗi phép tính, + cứ nối chữ tiếp từ đó.',
          ),
        }),

        mcq({
          prompt: B(
            'What does this print?' + code('console.log([1, 2, 3, 4, 5].filter(n => n % 2 === 0).map(n => n * 10));'),
            'Đoạn này in ra gì?' + code('console.log([1, 2, 3, 4, 5].filter(n => n % 2 === 0).map(n => n * 10));'),
          ),
          options: [
            B('[20, 40]', '[20, 40]'),
            B('[10, 20, 30, 40, 50]', '[10, 20, 30, 40, 50]'),
            B('[2, 4]', '[2, 4]'),
            B('[1, 3, 5]', '[1, 3, 5]'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. filter keeps only the even numbers first — [2, 4] — and THEN map multiplies each survivor by 10, giving [20, 40]. Chaining array methods runs left to right, each one working on the previous result.',
            'Đã chạy thật. filter giữ lại số chẵn trước — [2, 4] — rồi map nhân mỗi cái sống sót với 10, ra [20, 40]. Nối chuỗi phương thức mảng chạy từ trái sang phải, mỗi cái làm việc trên kết quả của cái trước.',
          ),
        }),

        mcq({
          prompt: B(
            'querySelector accepts any CSS selector. Which call selects the first element with class "card" that is INSIDE a &lt;nav&gt;?',
            'querySelector nhận bất kỳ bộ chọn CSS nào. Lời gọi nào chọn phần tử đầu tiên có class "card" nằm BÊN TRONG một &lt;nav&gt;?',
          ),
          options: [
            B('document.querySelector("nav .card")', 'document.querySelector("nav .card")'),
            B('document.querySelector("nav, .card")', 'document.querySelector("nav, .card")'),
            B('document.querySelector(".card nav")', 'document.querySelector(".card nav")'),
            B('document.querySelector("#nav .card")', 'document.querySelector("#nav .card")'),
          ],
          correct: 0,
          explanation: EX(
            'A space between two selectors means "descendant of" — exactly the CSS combinator from Chapter 3, reused by the DOM in Lesson 4.5. "nav .card" reads as ".card inside a nav"; ".card nav" would mean the opposite (a nav inside .card), and "#nav .card" looks for an id, not the tag.',
            'Một dấu cách giữa hai bộ chọn nghĩa là "con cháu của" — đúng combinator CSS từ Chương 3, được DOM tái dùng ở Bài 4.5. "nav .card" đọc là ".card nằm trong một nav"; ".card nav" sẽ có nghĩa ngược lại (một nav trong .card), và "#nav .card" tìm một id, không phải thẻ.',
          ),
        }),

        // ── Chương 5 — JavaScript bất đồng bộ & modules ──────────────────
        mcq({
          prompt: B(
            'What does this print?' + code(
              'console.log("A");\n' +
              'setTimeout(() => console.log("B"), 0);\n' +
              'Promise.resolve().then(() => console.log("C"));\n' +
              'console.log("D");',
            ),
            'Đoạn này in ra gì?' + code(
              'console.log("A");\n' +
              'setTimeout(() => console.log("B"), 0);\n' +
              'Promise.resolve().then(() => console.log("C"));\n' +
              'console.log("D");',
            ),
          ),
          options: [
            B('A, D, C, B', 'A, D, C, B'),
            B('A, B, C, D', 'A, B, C, D'),
            B('A, D, B, C', 'A, D, B, C'),
            B('A, C, D, B', 'A, C, D, B'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. Synchronous code runs first: "A" then "D". Then queued callbacks run — Promise microtasks always run BEFORE setTimeout\'s macrotask, even at 0 ms, so "C" prints before "B". This is the event loop model from Lesson 5.1 combined with the microtask-vs-macrotask ordering.',
            'Đã chạy thật. Code đồng bộ chạy trước: "A" rồi "D". Rồi các callback trong hàng đợi chạy — microtask Promise LUÔN chạy TRƯỚC macrotask của setTimeout, kể cả ở 0 ms, nên "C" in trước "B". Đúng mô hình event loop ở Bài 5.1 kết hợp thứ tự microtask-vs-macrotask.',
          ),
        }),

        mcq({
          prompt: B(
            'Your frontend calls a REST endpoint that responds with HTTP 404. What does ' + code('await fetch(url)') + ' do, and how should you detect the failure?',
            'Frontend của bạn gọi một endpoint REST trả về HTTP 404. ' + code('await fetch(url)') + ' làm gì, và bạn phát hiện lỗi cách nào?',
          ),
          options: [
            B('The Promise still fulfils — you must check response.ok or response.status yourself', 'Promise vẫn fulfilled — bạn phải tự kiểm response.ok hoặc response.status'),
            B('The Promise rejects, so a plain .catch() reports the 404', 'Promise reject, nên một .catch() thường sẽ báo lỗi 404'),
            B('It throws a SyntaxError immediately', 'Nó ném ngay một SyntaxError'),
            B('fetch retries automatically until it gets a 200', 'fetch tự động thử lại tới khi nhận được 200'),
          ],
          correct: 0,
          explanation: EX(
            'fetch only rejects on a genuine network failure — a 404 or 500 still counts as "the server answered," so the Promise fulfils normally. You must check response.ok (or response.status) yourself and throw/handle it, exactly as Lesson 5.4 warns, then map that status to the right handling using the codes from Chapter 6.',
            'fetch chỉ reject khi thật sự lỗi mạng — một 404 hay 500 vẫn tính là "server đã trả lời," nên Promise fulfilled bình thường. Bạn phải tự kiểm response.ok (hoặc response.status) rồi tự throw/xử lý, đúng như Bài 5.4 cảnh báo, rồi ánh xạ mã đó vào cách xử lý đúng bằng các mã ở Chương 6.',
          ),
        }),

        mcq({
          prompt: B(
            'A file utils.js has:' + code(
              'export function double(n) { return n * 2; }\n' +
              'export default function triple(n) { return n * 3; }',
            ) + 'Which import correctly brings in BOTH functions in another file?',
            'File utils.js có:' + code(
              'export function double(n) { return n * 2; }\n' +
              'export default function triple(n) { return n * 3; }',
            ) + 'Import nào lấy đúng CẢ HAI hàm ở một file khác?',
          ),
          options: [
            B('import triple, { double } from "./utils.js";', 'import triple, { double } from "./utils.js";'),
            B('import { triple, double } from "./utils.js";', 'import { triple, double } from "./utils.js";'),
            B('import { default, double } from "./utils.js";', 'import { default, double } from "./utils.js";'),
            B('import triple from "./utils.js", { double };', 'import triple from "./utils.js", { double };'),
          ],
          correct: 0,
          explanation: EX(
            'A default export is imported WITHOUT braces, any name you like (triple here); a named export needs braces with its exact name ({ double }). Both can appear in one import statement, default first, exactly as Lesson 5.5 shows — "triple" is never inside braces since it is the default.',
            'Một default export được import KHÔNG NGOẶC, tên tuỳ ý (triple ở đây); một named export cần ngoặc với đúng tên ({ double }). Cả hai xuất hiện được trong một câu import, default trước, đúng như Bài 5.5 minh hoạ — "triple" không bao giờ nằm trong ngoặc vì nó là default.',
          ),
        }),

        // ── Chương 6 — HTTP & API ─────────────────────────────────────────
        mcq({
          prompt: B(
            'A user hits a protected route with no login cookie at all, and gets one status code. A different logged-in user with the wrong role hits the same route, and gets another. Which pair is correct?',
            'Một người dùng gọi một route được bảo vệ mà không hề có cookie đăng nhập, và nhận một mã trạng thái. Một người dùng khác đã đăng nhập nhưng sai vai trò gọi cùng route đó, và nhận một mã khác. Cặp nào đúng?',
          ),
          options: [
            B('No login → 401 Unauthorized; wrong role while logged in → 403 Forbidden', 'Không đăng nhập → 401 Unauthorized; sai vai trò dù đã đăng nhập → 403 Forbidden'),
            B('No login → 403 Forbidden; wrong role while logged in → 401 Unauthorized', 'Không đăng nhập → 403 Forbidden; sai vai trò dù đã đăng nhập → 401 Unauthorized'),
            B('Both cases return 404 Not Found', 'Cả hai trường hợp đều trả 404 Not Found'),
            B('Both cases return 400 Bad Request', 'Cả hai trường hợp đều trả 400 Bad Request'),
          ],
          correct: 0,
          explanation: EX(
            '401 means "who are you?" — no valid identity was presented at all. 403 means "I know exactly who you are, and you are not allowed" — the server already authenticated the user but denies the action. Swapping them is a real, common bug: logging in again fixes a 401 but does nothing for a 403.',
            '401 nghĩa là "bạn là ai?" — không hề có danh tính hợp lệ nào được đưa ra. 403 nghĩa là "tôi biết chính xác bạn là ai, và không được phép" — server đã xác thực người dùng rồi nhưng từ chối hành động. Đổi lẫn hai mã này là lỗi thật, phổ biến: đăng nhập lại sửa được 401 nhưng vô ích với 403.',
          ),
        }),

        mcq({
          prompt: B(
            'A flaky network causes the client to send the exact same ' + code('PUT /users/42') + ' request twice by accident. What happens, and why?',
            'Một mạng chập chờn khiến client vô tình gửi đúng yêu cầu ' + code('PUT /users/42') + ' hai lần. Chuyện gì xảy ra, vì sao?',
          ),
          options: [
            B('The end result is the same as sending it once — PUT is idempotent', 'Kết quả cuối giống như gửi một lần — PUT là idempotent'),
            B('User 42 ends up duplicated in the database', 'User 42 bị nhân đôi trong cơ sở dữ liệu'),
            B('The second request is automatically rejected with 409 Conflict', 'Yêu cầu thứ hai tự động bị từ chối với 409 Conflict'),
            B('PUT cannot be retried under any circumstances', 'PUT không thể thử lại trong bất kỳ trường hợp nào'),
          ],
          correct: 0,
          explanation: EX(
            'PUT replaces a resource entirely, and doing that twice with the same data leaves the resource in the same final state as doing it once — that is exactly what "idempotent" means (Lesson 6.2). This is why PUT/DELETE are generally safe to retry after a network hiccup, while POST is not: retrying a POST can create two orders instead of one.',
            'PUT thay thế hoàn toàn một tài nguyên, và làm điều đó hai lần với cùng dữ liệu để tài nguyên ở đúng trạng thái cuối như làm một lần — đó chính là ý nghĩa "idempotent" (Bài 6.2). Đây là lý do PUT/DELETE nói chung an toàn để thử lại sau một trục trặc mạng, còn POST thì không: thử lại một POST có thể tạo hai đơn hàng thay vì một.',
          ),
        }),

        mcq({
          prompt: B(
            'In ' + code('PATCH /posts/17?notify=true') + ', what role does 17 play versus notify=true?',
            'Trong ' + code('PATCH /posts/17?notify=true') + ', 17 đóng vai trò gì so với notify=true?',
          ),
          options: [
            B('17 identifies WHICH post (path param); notify=true just refines the request (query string)', '17 chỉ định post NÀO (tham số đường dẫn); notify=true chỉ tinh chỉnh yêu cầu (query string)'),
            B('Both 17 and notify=true are query string parameters here', 'Cả 17 và notify=true đều là tham số query string ở đây'),
            B('Both 17 and notify=true are path parameters here', 'Cả 17 và notify=true đều là tham số đường dẫn ở đây'),
            B('17 is a header value; notify=true is the request body', '17 là giá trị header; notify=true là body của yêu cầu'),
          ],
          correct: 0,
          explanation: EX(
            'Rule of thumb from Lesson 6.5: if removing it points at a different THING, it is a path parameter (17 identifies exactly which post — remove it and there is no post to edit); if it just filters/modifies behaviour on the same resource, it is a query parameter (notify=true does not change WHICH post, just whether a notification fires).',
            'Quy tắc bỏ túi ở Bài 6.5: nếu bỏ nó đi thì trỏ tới một THỨ khác, đó là tham số đường dẫn (17 chỉ định đúng post nào — bỏ nó thì không có post nào để sửa); nếu nó chỉ lọc/chỉnh hành vi trên cùng tài nguyên, đó là tham số query (notify=true không đổi post NÀO, chỉ đổi có bắn thông báo hay không).',
          ),
        }),

        // ── Chương 7 — Xác thực & bảo mật ────────────────────────────────
        mcq({
          prompt: B(
            'Which is automatically re-attached by the browser on every matching request with zero client code, and which requires the client\'s JavaScript to attach it explicitly?',
            'Cái nào được trình duyệt tự động đính kèm lại ở mọi yêu cầu khớp mà không cần code client nào, và cái nào cần JavaScript của client chủ động đính vào?',
          ),
          options: [
            B('A cookie auto-attaches to matching requests; a JWT needs a manual Authorization header', 'Cookie tự đính kèm vào yêu cầu khớp; một JWT cần header Authorization gắn tay'),
            B('A JWT auto-attaches to matching requests; a cookie needs manual attaching every time', 'JWT tự đính kèm vào yêu cầu khớp; cookie cần gắn tay mỗi lần'),
            B('Both a cookie and a JWT auto-attach without any client-side code at all', 'Cả cookie và JWT đều tự đính kèm mà không cần code phía client nào'),
            B('Neither a cookie nor a JWT is ever attached automatically to a request', 'Không cookie lẫn JWT nào từng được đính kèm tự động vào một yêu cầu'),
          ],
          correct: 0,
          explanation: EX(
            'This is the core difference between Lessons 7.2 and 7.3: once Set-Cookie has run, the browser resends the cookie on every request to the matching domain by itself. A JWT is not sent automatically at all — your fetch call must explicitly add the Authorization: Bearer &lt;token&gt; header every single time.',
            'Đây là khác biệt cốt lõi giữa Bài 7.2 và 7.3: một khi Set-Cookie đã chạy, trình duyệt tự gửi lại cookie ở mọi yêu cầu tới đúng domain. Một JWT hoàn toàn KHÔNG được gửi tự động — lời gọi fetch của bạn phải chủ động thêm header Authorization: Bearer &lt;token&gt; mỗi lần.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO true statements about a JWT.',
            'Chọn HAI phát biểu ĐÚNG về một JWT.',
          ),
          options: [
            B('Its payload is only base64-encoded, not encrypted — anyone can decode and read it', 'Payload của nó chỉ mã hoá base64, không mã hoá thật — ai cũng giải mã và đọc được'),
            B('Its signature proves the payload was not tampered with, since only the server knows the secret key used to produce it', 'Chữ ký của nó chứng minh payload không bị sửa, vì chỉ server biết khoá bí mật dùng để tạo ra nó'),
            B('The payload is fully encrypted and unreadable without the secret key', 'Payload được mã hoá hoàn toàn và không đọc được nếu không có khoá bí mật'),
            B('A JWT is automatically resent by the browser on every request, exactly like a cookie', 'Một JWT được trình duyệt tự động gửi lại ở mọi yêu cầu, y hệt một cookie'),
          ],
          correct: [0, 1],
          explanation: EX(
            'Lesson 7.3 is explicit: the payload is base64 (reversible formatting, not encryption) so it must never hold secrets, while the signature — producible only with the server\'s secret key — is what actually stops forgery. The other two options describe the opposite of how JWTs work: the payload is NOT encrypted, and a JWT is NOT auto-attached like a cookie.',
            'Bài 7.3 nói rõ: payload là base64 (chỉ đổi định dạng, đảo ngược được, không phải mã hoá) nên không bao giờ được chứa bí mật, còn chữ ký — chỉ tạo được bằng khoá bí mật của server — mới là thứ thật sự ngăn giả mạo. Hai đáp án còn lại mô tả ngược với cách JWT hoạt động: payload KHÔNG được mã hoá, và một JWT KHÔNG tự đính kèm như cookie.',
          ),
        }),

        mcq({
          prompt: B(
            'Two users both choose the password "123456". The backend salts and hashes passwords correctly with bcrypt. What do their stored password hashes look like?',
            'Hai người dùng cùng chọn mật khẩu "123456". Backend salt và hash mật khẩu đúng cách bằng bcrypt. Hash mật khẩu được lưu của họ trông ra sao?',
          ),
          options: [
            B('Completely different from each other, even though the passwords are identical', 'Hoàn toàn khác nhau, dù mật khẩu giống hệt nhau'),
            B('Exactly identical, since the password is the same', 'Hoàn toàn giống nhau, vì mật khẩu giống nhau'),
            B('The plaintext "123456" stored twice', 'Chuỗi thô "123456" được lưu hai lần'),
            B('Encrypted, and reversible back to "123456" with the server\'s key', 'Được mã hoá, và đảo ngược được về "123456" bằng khoá của server'),
          ],
          correct: 0,
          explanation: EX(
            'Salting mixes in random, unique data before hashing, so hash("123456" + salt_A) is completely different from hash("123456" + salt_B) even though the password is identical (Lesson 7.4). This is exactly what defeats precomputed rainbow tables — an attacker cannot use one lookup table to crack every "123456" user at once.',
            'Salting trộn dữ liệu ngẫu nhiên, riêng biệt trước khi hash, nên hash("123456" + salt_A) hoàn toàn khác hash("123456" + salt_B) dù mật khẩu giống hệt (Bài 7.4). Đây chính là thứ đánh bại bảng rainbow table tính sẵn — kẻ tấn công không thể dùng một bảng tra để bẻ mọi user "123456" cùng lúc.',
          ),
        }),

        // ── Chương 8 — Dữ liệu & SQL ──────────────────────────────────────
        mcq({
          prompt: B(
            'Table products(id, name, price, in_stock): (1,"Widget",25,true), (2,"Gadget",60,true), (3,"Gizmo",15,false), (4,"Doohickey",90,true), (5,"Thingamajig",40,true). What does this return?' + code(
              'SELECT name, price FROM products\nWHERE in_stock = true\nORDER BY price DESC\nLIMIT 2;',
            ),
            'Bảng products(id, name, price, in_stock): (1,"Widget",25,true), (2,"Gadget",60,true), (3,"Gizmo",15,false), (4,"Doohickey",90,true), (5,"Thingamajig",40,true). Truy vấn sau trả về gì?' + code(
              'SELECT name, price FROM products\nWHERE in_stock = true\nORDER BY price DESC\nLIMIT 2;',
            ),
          ),
          options: [
            B('Doohickey (90), Gadget (60)', 'Doohickey (90), Gadget (60)'),
            B('Gizmo (15), Widget (25)', 'Gizmo (15), Widget (25)'),
            B('Doohickey (90), Thingamajig (40)', 'Doohickey (90), Thingamajig (40)'),
            B('All five rows, unsorted', 'Cả năm dòng, không sắp xếp'),
          ],
          correct: 0,
          explanation: EX(
            'WHERE in_stock = true drops Gizmo first. Sorting the remaining four by price DESC gives Doohickey(90), Gadget(60), Thingamajig(40), Widget(25) — LIMIT 2 keeps only the top two: Doohickey and Gadget.',
            'WHERE in_stock = true loại Gizmo trước. Sắp bốn dòng còn lại theo price DESC ra Doohickey(90), Gadget(60), Thingamajig(40), Widget(25) — LIMIT 2 chỉ giữ hai dòng đầu: Doohickey và Gadget.',
          ),
        }),

        mcq({
          prompt: B(
            'Table tasks(id, title, done): (1,"Buy milk",false), (2,"Walk dog",true), (3,"Write report",false). Run these three statements IN ORDER — what remains in the table?' + code(
              "INSERT INTO tasks (title, done) VALUES ('Clean house', false);\n" +
              "UPDATE tasks SET done = true WHERE title = 'Buy milk';\n" +
              'DELETE FROM tasks WHERE done = false;',
            ),
            'Bảng tasks(id, title, done): (1,"Buy milk",false), (2,"Walk dog",true), (3,"Write report",false). Chạy ba câu lệnh sau THEO THỨ TỰ — bảng còn lại gì?' + code(
              "INSERT INTO tasks (title, done) VALUES ('Clean house', false);\n" +
              "UPDATE tasks SET done = true WHERE title = 'Buy milk';\n" +
              'DELETE FROM tasks WHERE done = false;',
            ),
          ),
          options: [
            B('Only "Buy milk" and "Walk dog" — both done = true', 'Chỉ "Buy milk" và "Walk dog" — cả hai done = true'),
            B('All four tasks remain', 'Cả bốn task còn nguyên'),
            B('Only "Clean house" remains', 'Chỉ "Clean house" còn lại'),
            B('The table ends up empty', 'Bảng rỗng hoàn toàn'),
          ],
          correct: 0,
          explanation: EX(
            'Step by step: INSERT adds "Clean house" (done=false) → 4 rows. UPDATE flips "Buy milk" to done=true. Now done=false rows are "Write report" and "Clean house" — DELETE removes exactly those two, leaving "Buy milk" (true) and "Walk dog" (true). Order of execution changes the final result, just like Lesson 8.3 warns.',
            'Từng bước: INSERT thêm "Clean house" (done=false) → 4 dòng. UPDATE đổi "Buy milk" thành done=true. Giờ các dòng done=false là "Write report" và "Clean house" — DELETE xoá đúng hai dòng đó, còn lại "Buy milk" (true) và "Walk dog" (true). Thứ tự chạy đổi kết quả cuối, đúng như Bài 8.3 cảnh báo.',
          ),
        }),

        mcq({
          prompt: B(
            'authors(id, name): (1,"Chi"), (2,"Duy"). books(id, title, author_id): (1,"Book A",1), (2,"Book B",2), (3,"Book C",NULL). Which JOIN keeps "Book C" in the result, paired with a NULL author name?' + code(
              'SELECT books.title, authors.name\nFROM books\n___ JOIN authors ON books.author_id = authors.id;',
            ),
            'authors(id, name): (1,"Chi"), (2,"Duy"). books(id, title, author_id): (1,"Book A",1), (2,"Book B",2), (3,"Book C",NULL). JOIN nào giữ "Book C" trong kết quả, ghép với tên tác giả NULL?' + code(
              'SELECT books.title, authors.name\nFROM books\n___ JOIN authors ON books.author_id = authors.id;',
            ),
          ),
          options: [
            B('LEFT JOIN — it keeps every row from books regardless of a match', 'LEFT JOIN — nó giữ mọi dòng từ books bất kể có khớp hay không'),
            B('INNER JOIN — it keeps every row from books regardless of a match', 'INNER JOIN — nó giữ mọi dòng từ books bất kể có khớp hay không'),
            B('Neither JOIN type can ever return a NULL value', 'Không loại JOIN nào có thể trả về giá trị NULL'),
            B('INNER JOIN drops unmatched rows, so it is the one that keeps "Book C"', 'INNER JOIN loại dòng không khớp, nên nó là cái giữ "Book C"'),
          ],
          correct: 0,
          explanation: EX(
            'INNER JOIN only keeps rows that match on BOTH sides, so "Book C" (author_id NULL, no matching author) is dropped entirely. LEFT JOIN keeps every row from the left table (books, written first) regardless, filling in NULL for authors.name when there is no match — exactly the INNER-vs-LEFT distinction from Lesson 8.4.',
            'INNER JOIN chỉ giữ dòng khớp ở CẢ HAI bên, nên "Book C" (author_id là NULL, không khớp tác giả nào) bị loại hoàn toàn. LEFT JOIN giữ mọi dòng từ bảng bên trái (books, viết trước) bất kể thế nào, điền NULL cho authors.name khi không khớp — đúng khác biệt INNER-vs-LEFT ở Bài 8.4.',
          ),
        }),

        // ── Chương 9 — TypeScript cơ bản ─────────────────────────────────
        mcq({
          prompt: B(
            'Given ' + code('interface Post {\n  id: number;\n  title: string;\n  publishedAt?: string;\n}') + ' which object literal is VALID for a variable typed Post?',
            'Cho ' + code('interface Post {\n  id: number;\n  title: string;\n  publishedAt?: string;\n}') + ' object literal nào HỢP LỆ cho một biến kiểu Post?',
          ),
          options: [
            B('{ id: 1, title: "Hello" }', '{ id: 1, title: "Hello" }'),
            B('{ id: "1", title: "Hello" }', '{ id: "1", title: "Hello" }'),
            B('{ id: 1 }', '{ id: 1 }'),
            B('{ title: "Hello", publishedAt: "2026-01-01" }', '{ title: "Hello", publishedAt: "2026-01-01" }'),
          ],
          correct: 0,
          explanation: EX(
            'id and title are required and must be the right type (number and string); publishedAt has a ? so it may be left out entirely. { id: 1, title: "Hello" } satisfies all of this. The others either use the wrong type for id (a string), or leave out a required property (title or id).',
            'id và title bắt buộc và phải đúng kiểu (number và string); publishedAt có ? nên có thể bỏ hẳn. { id: 1, title: "Hello" } thoả tất cả điều này. Các đáp án khác hoặc dùng sai kiểu cho id (một string), hoặc thiếu một thuộc tính bắt buộc (title hoặc id).',
          ),
        }),

        mcq({
          prompt: B(
            'Given ' + code('function firstOf<T>(items: T[]): T {\n  return items[0];\n}') + ' what is the type of ' + code('firstOf(["a", "b", "c"])') + '?',
            'Cho ' + code('function firstOf<T>(items: T[]): T {\n  return items[0];\n}') + ' kiểu của ' + code('firstOf(["a", "b", "c"])') + ' là gì?',
          ),
          options: [
            B('string', 'string'),
            B('any', 'any'),
            B('T', 'T'),
            B('string[]', 'string[]'),
          ],
          correct: 0,
          explanation: EX(
            'TypeScript infers T from the argument: passing a string[] means T becomes string for this call, so the return type (also T) resolves to string — not any, and not the placeholder name "T" itself. This is the point of generics from Lesson 9.4: type safety without giving up reuse.',
            'TypeScript suy luận T từ đối số: truyền một string[] nghĩa là T trở thành string cho lần gọi này, nên kiểu trả về (cũng là T) ra string — không phải any, và không phải chính cái tên chỗ trống "T". Đó chính là mục đích của generic ở Bài 9.4: an toàn kiểu mà không mất khả năng tái dùng.',
          ),
        }),

        mcq({
          prompt: B(
            'A database ID might come back as a number from one endpoint and a string from another. Which annotation honestly describes this WITHOUT disabling type checking?',
            'Một ID cơ sở dữ liệu có thể trả về là number từ endpoint này và string từ endpoint khác. Annotation nào mô tả đúng điều này MÀ KHÔNG tắt kiểm kiểu?',
          ),
          options: [
            B('let id: string | number;', 'let id: string | number;'),
            B('let id: any;', 'let id: any;'),
            B('let id: string;', 'let id: string;'),
            B('let id: number;', 'let id: number;'),
          ],
          correct: 0,
          explanation: EX(
            'A union type (string | number) says honestly "this could be either," and TypeScript still checks that you only assign one of those two types — unlike any, which turns checking off entirely for that value and everything derived from it (Lesson 9.2).',
            'Một union type (string | number) nói thật "cái này có thể là một trong hai," và TypeScript vẫn kiểm bạn chỉ gán một trong hai kiểu đó — khác với any, tắt hẳn việc kiểm cho giá trị đó và mọi thứ suy ra từ nó (Bài 9.2).',
          ),
        }),

        // ── Chương 10 — Tư duy, gỡ lỗi & Git workflow ────────────────────
        mcq({
          prompt: B(
            'Your console shows ' + code("TypeError: Cannot read properties of undefined (reading 'email')\n    at getEmail (app.js:9:18)") + ' What should you look at FIRST?',
            'Console hiện ' + code("TypeError: Cannot read properties of undefined (reading 'email')\n    at getEmail (app.js:9:18)") + ' Bạn nên nhìn vào đâu TRƯỚC TIÊN?',
          ),
          options: [
            B('Line 9 of app.js, and what value getEmail received there', 'Dòng 9 của app.js, và giá trị mà getEmail nhận ở đó'),
            B('The package.json file', 'File package.json'),
            B('A completely unrelated CSS file', 'Một file CSS hoàn toàn không liên quan'),
            B('Nothing — restart the whole project from scratch', 'Không gì cả — làm lại cả dự án từ đầu'),
          ],
          correct: 0,
          explanation: EX(
            'The error names the exact location (app.js:9) and the exact mistake (reading .email off something undefined). Lesson 10.2\'s first step is to read the message and go straight to that line, then console.log the value right before it breaks to see why it is undefined — not guess randomly elsewhere.',
            'Lỗi nêu đúng vị trí (app.js:9) và đúng sai lầm (đọc .email trên một thứ undefined). Bước đầu của Bài 10.2 là đọc thông điệp rồi đi thẳng tới dòng đó, rồi console.log giá trị ngay trước chỗ vỡ để xem vì sao nó undefined — không đoán mò ở chỗ khác.',
          ),
        }),

        mcq({
          prompt: B(
            'Put these steps of a real feature workflow in the correct order.',
            'Sắp các bước của một quy trình tính năng thật theo đúng thứ tự.',
          ),
          options: [
            B('Create a branch → commit changes → push the branch → open a Pull Request → merge', 'Tạo nhánh → commit thay đổi → push nhánh → mở Pull Request → merge'),
            B('Merge → open a Pull Request → create a branch → commit changes → push', 'Merge → mở Pull Request → tạo nhánh → commit thay đổi → push'),
            B('Push → create a branch → merge → commit changes → open a Pull Request', 'Push → tạo nhánh → merge → commit thay đổi → mở Pull Request'),
            B('Commit changes → merge → create a branch → push → open a Pull Request', 'Commit thay đổi → merge → tạo nhánh → push → mở Pull Request'),
          ],
          correct: 0,
          explanation: EX(
            'Lesson 10.3\'s workflow: branch off main first (an isolated copy), make and commit changes there, push the branch to GitHub, open a Pull Request so a teammate can review, and only then merge into main. Merging before review, or before the branch even exists, defeats the entire point of the workflow.',
            'Quy trình ở Bài 10.3: tách nhánh từ main trước (một bản sao tách biệt), sửa và commit ở đó, push nhánh lên GitHub, mở Pull Request để đồng đội review, và chỉ khi đó mới merge vào main. Merge trước khi review, hoặc trước khi nhánh tồn tại, phá hỏng toàn bộ mục đích của quy trình.',
          ),
        }),

        mcq({
          prompt: B(
            'A file shows this after a failed merge:' + code(
              '<<<<<<< HEAD\n' +
              'const greeting = "Welcome back!";\n' +
              '=======\n' +
              'const greeting = "Hello again!";\n' +
              '>>>>>>> feature/login-form',
            ) + 'What do these markers mean, and what should you do?',
            'Một file hiện thế này sau một merge thất bại:' + code(
              '<<<<<<< HEAD\n' +
              'const greeting = "Welcome back!";\n' +
              '=======\n' +
              'const greeting = "Hello again!";\n' +
              '>>>>>>> feature/login-form',
            ) + 'Các dấu này nghĩa là gì, và bạn nên làm gì?',
          ),
          options: [
            B('Two branches changed the same line; read both, decide, remove the markers, then add and commit', 'Hai nhánh đổi cùng một dòng; đọc cả hai, quyết định, xoá dấu, rồi add và commit'),
            B('The file is corrupted; delete it entirely to make the conflict disappear', 'File bị hỏng; xoá hẳn nó để xung đột biến mất'),
            B('Git already resolved this automatically — no action is needed', 'Git đã tự giải quyết rồi — không cần làm gì'),
            B('Run a force push immediately to overwrite the conflict', 'Chạy force push ngay để ghi đè xung đột'),
          ],
          correct: 0,
          explanation: EX(
            'A conflict just means Git found two versions of the same line and cannot guess which you want (Lesson 10.3). You read both sides, decide what the code should actually say, delete the &lt;&lt;&lt;&lt;&lt;&lt;&lt;/=======/&gt;&gt;&gt;&gt;&gt;&gt;&gt; markers, then git add and git commit to finish the merge. Deleting the file or force-pushing throws away real work.',
            'Một xung đột chỉ nghĩa là Git tìm thấy hai bản của cùng một dòng và không đoán được bạn muốn bản nào (Bài 10.3). Bạn đọc cả hai bên, quyết định code nên nói gì thật sự, xoá các dấu &lt;&lt;&lt;&lt;&lt;&lt;&lt;/=======/&gt;&gt;&gt;&gt;&gt;&gt;&gt;, rồi git add và git commit để hoàn tất merge. Xoá file hay force-push sẽ vứt bỏ công sức thật.',
          ),
        }),

        // ── Câu nối ý tưởng cuối — ES modules ↔ npm ──────────────────────
        mcq({
          prompt: B(
            'You run ' + code('npm install dayjs') + ' and then write ' + code('import dayjs from "dayjs";') + ' in your code. Is this the same import system as ' + code('import { add } from "./math.js";') + '?',
            'Bạn chạy ' + code('npm install dayjs') + ' rồi viết ' + code('import dayjs from "dayjs";') + ' trong code. Đây có phải cùng hệ import với ' + code('import { add } from "./math.js";') + ' không?',
          ),
          options: [
            B('Yes — same ES module system; only the source changes, from a relative path to a package name npm installed', 'Có — cùng hệ ES module; chỉ nguồn đổi, từ đường dẫn tương đối sang tên gói npm đã cài'),
            B('No — installed packages always use a completely different import syntax', 'Không — gói đã cài luôn dùng cú pháp import hoàn toàn khác'),
            B('No — npm packages can only be loaded with require(), never import', 'Không — gói npm chỉ tải được bằng require(), không bao giờ import'),
            B('Yes, but only if the package has no default export', 'Có, nhưng chỉ khi gói đó không có default export'),
          ],
          correct: 0,
          explanation: EX(
            'Lesson 5.5 makes this connection explicit: import/export is one system whether you point it at your own file with a relative path ("./math.js") or at an installed library by its package name ("dayjs") — npm (Chapter 1) puts the code on disk, and ES modules (Chapter 5) load it either way with the same syntax.',
            'Bài 5.5 nối ý này rõ ràng: import/export là một hệ dù bạn trỏ nó vào file của chính bạn bằng đường dẫn tương đối ("./math.js") hay vào một thư viện đã cài theo tên gói ("dayjs") — npm (Chương 1) đặt mã lên đĩa, và ES module (Chương 5) tải nó theo cả hai cách bằng cùng cú pháp.',
          ),
        }),
      ],
    },
  ],
};
