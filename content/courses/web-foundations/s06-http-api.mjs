/**
 * Web Foundations — Chương 6: Luồng HTTP & API (chu trình request/response, method,
 * status code, headers, JSON, REST, query/params). Chương nền cho NODE.JS.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${. Quiz có field content.
 */

import { gallery, galleryGiang } from './_slides.mjs';
import L65 from './s06/wf-6-5-rest-params-query.mjs';
import L64 from './s06/wf-6-4-headers-json.mjs';
import L63 from './s06/wf-6-3-status-codes.mjs';
import L62 from './s06/wf-6-2-http-methods.mjs';
import L61 from './s06/wf-6-1-request-response.mjs';
import { onTapBai } from './_on-tap/index.mjs';

export default {
  title: 'Chapter 6 — HTTP & APIs|||Chương 6 — HTTP & API',
  description: 'Mọi ứng dụng web là các máy tính trò chuyện qua HTTP: trình duyệt gửi một yêu cầu, server trả một phản hồi. Học chu trình request/response, các method (GET/POST/PUT/DELETE), mã trạng thái, headers, định dạng JSON, và cách một REST API tổ chức URL — đúng ngôn ngữ mà backend Node.js của bạn sẽ nói.',
  lessons: [
    /* ─────────────────── 6.0 slide bài giảng ─────────────────── */
    {
      title: '6.0 — Lecture slides: HTTP & APIs in 12 slides|||6.0 — Slide bài giảng: HTTP & API trong 12 slide',
      slug: 'wf-6-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Request/response, method, mã trạng thái, headers, JSON và REST — kèm cách đọc tab Network.',
      content: `
<div class="ml-en"><h2>📑 Lecture slides: HTTP & APIs in 12 slides</h2>
<p>Slide 6 (401 vs 403 vs 404) and slide 10 (reading the Network tab) are the two that pay off immediately when something does not load.</p>
<p>Two ways to use it: skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 Slide bài giảng: HTTP & API trong 12 slide</h2>
<p>Slide 6 (401 vs 403 vs 404) và slide 10 (đọc tab Network) là hai cái có ích ngay lần đầu bạn gặp "sao dữ liệu không hiện".</p>
<p>Hai cách dùng: lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${galleryGiang('wf-http', [
  [1, "Bìa"],
  [2, "Nội dung chương"],
  [3, "Một lượt trao đổi HTTP"],
  [4, "HTTP method — các động từ ⭐"],
  [5, "Mã trạng thái — nhớ theo nhóm ⭐⭐"],
  [6, "401 · 403 · 404 — ba cái hay nhầm"],
  [7, "Headers — ba cái gặp mỗi ngày"],
  [8, "JSON — định dạng trao đổi của cả web"],
  [9, "REST — route param và query string ⭐"],
  [10, "Đọc tab Network — kỹ năng đáng giá nhất"],
  [11, "Bảng đối chiếu: chương 6 dùng ở đâu trong FER202"],
  [12, "Tự luyện"],
])}
`,
    },

    /* ─────────────────────────── 6.1 ─────────────────────────── */
    L61,

    /* ─────────────────────────── 6.2 ─────────────────────────── */
    L62,

    /* ─────────────────────────── 6.3 ─────────────────────────── */
    L63,

    /* ─────────────────────────── 6.4 ─────────────────────────── */
    L64,

    /* ─────────────────────────── 6.5 ─────────────────────────── */
    L65,

    /* ─────────────────────────── 6.6 quiz ─────────────────────────── */
    {
      title: '6.6 — Chapter 6 quiz|||6.6 — Kiểm tra chương 6',
      slug: 'wf-6-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về chu trình request/response, method, mã trạng thái, headers/JSON, REST và tham số route/query.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 6: the request/response cycle, HTTP methods, status codes, headers and JSON, and REST with route params vs query strings.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> The best way to internalise HTTP is to build a real API. On Code Lab, implement routes, methods, status codes and JSON responses on the Node.js (Express) track.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">A request is text</span><span class="lz-t">Method, path, headers, body</span><span class="lz-d">Debug it with <code>curl -i</code> or the Network tab, not the address bar — which sends its own headers and caches the result.</span></div>
<div class="lz-node"><span class="lz-k">The method is a promise</span><span class="lz-t">GET must not change anything</span><span class="lz-d">Crawlers, prefetchers and link previews all act on it. A <code>GET /delete</code> endpoint will fire itself.</span></div>
<div class="lz-node"><span class="lz-k">The status is the outcome</span><span class="lz-t">Not the body</span><span class="lz-d">200 with an error inside disables monitoring, caching and retries. 4xx is the caller's fault, 5xx is yours.</span></div>
<div class="lz-node"><span class="lz-k">Path vs query</span><span class="lz-t">Identity vs view</span><span class="lz-d">Both arrive as strings and both are attacker-controlled. An id in the URL never implies permission — scope the query to the caller.</span></div>
</div>
<p class="note-ct"><strong>Practise on a real endpoint.</strong> Point <code>curl -i</code> at any public API and read the whole response: the status line, every header, then the body. Ten minutes of this makes the rest of the course easier to debug.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-6-0-slides&khoa=web-foundations">Practice on Code Lab → Chapter 6 practice set (34 auto-graded exercises)</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 6: chu trình request/response, method HTTP, mã trạng thái, headers và JSON, và REST với tham số route vs query string.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Cách tốt nhất để thấm HTTP là tự dựng một API thật. Bộ đề Chương 6 trên Code Lab cho bạn tự viết lại từng mảnh: đọc thông điệp thô, chọn mã trạng thái, thương lượng định dạng, ETag/304, bộ định tuyến 404/405 — rồi track Node.js (Express) dựng thành API thật.</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Một request là chữ</span><span class="lz-t">Phương thức, đường dẫn, header, thân</span><span class="lz-d">Hãy gỡ lỗi bằng <code>curl -i</code> hoặc tab Network, đừng dùng thanh địa chỉ — nó gửi header của riêng nó và nhớ đệm kết quả.</span></div>
<div class="lz-node"><span class="lz-k">Phương thức là một lời hứa</span><span class="lz-t">GET không được đổi gì</span><span class="lz-d">Bot thu thập, bộ nạp trước và phần xem trước liên kết đều hành động dựa trên đó. Một endpoint <code>GET /delete</code> sẽ tự nổ.</span></div>
<div class="lz-node"><span class="lz-k">Mã trạng thái là kết cục</span><span class="lz-t">Không phải phần thân</span><span class="lz-d">200 kèm lỗi bên trong sẽ vô hiệu hoá giám sát, nhớ đệm và thử lại. 4xx là lỗi của người gọi, 5xx là lỗi của bạn.</span></div>
<div class="lz-node"><span class="lz-k">Đường dẫn với truy vấn</span><span class="lz-t">Danh tính với cách nhìn</span><span class="lz-d">Cả hai đều tới dạng chuỗi và đều do kẻ tấn công điều khiển. Một id trong URL không bao giờ hàm ý quyền — hãy giới hạn truy vấn theo người gọi.</span></div>
</div>
<p class="note-ct"><strong>Hãy luyện trên một endpoint thật.</strong> Chĩa <code>curl -i</code> vào một API công khai bất kỳ rồi đọc cả phản hồi: dòng trạng thái, từng header, rồi mới tới thân. Mười phút như thế làm phần còn lại của khoá học dễ gỡ lỗi hơn hẳn.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-6-0-slides&khoa=web-foundations">Luyện tập ở Code Lab → bộ đề Chương 6 (34 bài, máy chấm tự động)</a></div></div>
${onTapBai('wf-6-6-quiz')}
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Which HTTP method should you use to READ data without changing anything?|||Method HTTP nào nên dùng để ĐỌC dữ liệu mà không thay đổi gì?',
            options: [
              'GET|||GET',
              'POST|||POST',
              'DELETE|||DELETE',
              'PUT|||PUT',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'You submit a form to create a new account. Which method fits?|||Bạn gửi một form để tạo một tài khoản mới. Method nào hợp?',
            options: [
              'POST|||POST',
              'GET|||GET',
              'DELETE|||DELETE',
              'HEAD|||HEAD',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does a 404 status code mean?|||Mã trạng thái 404 nghĩa là gì?',
            options: [
              'Not Found — no such resource|||Not Found — không có tài nguyên như vậy',
              'Success|||Thành công',
              'The server crashed|||Server sập',
              'You must log in|||Bạn phải đăng nhập',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which status code family means the SERVER failed?|||Nhóm mã trạng thái nào nghĩa là SERVER thất bại?',
            options: [
              '5xx|||5xx',
              '2xx|||2xx',
              '3xx|||3xx',
              '4xx|||4xx',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What is the difference between 401 and 403?|||Khác biệt giữa 401 và 403 là gì?',
            options: [
              '401 = not authenticated (log in); 403 = authenticated but not allowed|||401 = chưa xác thực (đăng nhập); 403 = đã xác thực nhưng không được phép',
              'They are identical|||Chúng y hệt nhau',
              '401 is a server error, 403 is success|||401 là lỗi server, 403 là thành công',
              '403 means log in, 401 means forbidden|||403 nghĩa là đăng nhập, 401 nghĩa là bị cấm',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which header tells the server the request body is JSON?|||Header nào cho server biết body của yêu cầu là JSON?',
            options: [
              'Content-Type: application/json|||Content-Type: application/json',
              'Accept-Language: en|||Accept-Language: en',
              'Authorization: Bearer|||Authorization: Bearer',
              'Cache-Control: no-cache|||Cache-Control: no-cache',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which is VALID JSON?|||Cái nào là JSON HỢP LỆ?',
            options: [
              '{ "name": "Lan", "age": 25 }|||{ "name": "Lan", "age": 25 }',
              "{ 'name': 'Lan' }|||{ 'name': 'Lan' }",
              '{ name: "Lan", }|||{ name: "Lan", }',
              '{ "name": "Lan", // a user }|||{ "name": "Lan", // a user }',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which turns a JavaScript object into a JSON text string to send?|||Cái nào biến một đối tượng JavaScript thành chuỗi JSON để gửi?',
            options: [
              'JSON.stringify(obj)|||JSON.stringify(obj)',
              'JSON.parse(obj)|||JSON.parse(obj)',
              'obj.toJSON now|||obj.toJSON now',
              'String(obj) always works|||String(obj) luôn dùng được',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In REST, a URL like /getPosts or /deletePost?id=5 is…|||Trong REST, một URL như /getPosts hay /deletePost?id=5 là…',
            options: [
              'Not RESTful — the method should carry the verb, URLs name resources|||Không RESTful — method nên mang động từ, URL đặt tên tài nguyên',
              'The correct RESTful style|||Đúng phong cách RESTful',
              'Required for GET requests|||Bắt buộc cho yêu cầu GET',
              'The only way to delete data|||Cách duy nhất để xoá dữ liệu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In /posts?page=2&sort=newest, what are page and sort?|||Trong /posts?page=2&sort=newest, page và sort là gì?',
            options: [
              'Query-string parameters that refine the request (filter/sort/paginate)|||Tham số query-string tinh chỉnh yêu cầu (lọc/sắp xếp/phân trang)',
              'Path parameters identifying one post|||Tham số đường dẫn chỉ định một bài viết',
              'HTTP headers|||Header HTTP',
              'Status codes|||Mã trạng thái',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
