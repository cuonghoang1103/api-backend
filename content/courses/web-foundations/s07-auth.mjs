/**
 * Web Foundations — Chương 7: Xác thực & bảo mật (authentication vs authorization,
 * cookie/session, JWT, mật khẩu/hash/salt/bcrypt, HTTPS/CORS). Chương nền cho
 * middleware auth của NODE.JS/Express. Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng
 * nhau). ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong code escape
 * thành \${. Quiz có field content.
 */

import { gallery, galleryGiang } from './_slides.mjs';
import L75 from './s07/wf-7-5-https-cors.mjs';
import L74 from './s07/wf-7-4-passwords.mjs';
import L73 from './s07/wf-7-3-jwt.mjs';
import L72 from './s07/wf-7-2-cookies-sessions.mjs';
import L71 from './s07/wf-7-1-auth-basics.mjs';
import { onTapBai } from './_on-tap/index.mjs';

export default {
  title: 'Chapter 7 — Authentication & security|||Chương 7 — Xác thực & bảo mật',
  description: 'Chương 6 cho thấy HTTP không lưu trạng thái — server quên bạn ngay sau mỗi yêu cầu. Chương 7 giải bài toán đó: authentication vs authorization, cookie và session, JWT và Authorization: Bearer, cách mật khẩu phải được hash và salt (không bao giờ lưu thô), và HTTPS/CORS — hai lớp bảo vệ khác nhau mà mọi API thật đều cần.',
  lessons: [
    /* ─────────────────── 7.0 slide bài giảng ─────────────────── */
    {
      title: '7.0 — Lecture slides: auth & security in 12 slides|||7.0 — Slide bài giảng: xác thực & bảo mật trong 12 slide',
      slug: 'wf-7-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Cookie, session, JWT, mật khẩu, HTTPS và CORS — kèm ba lỗ hổng phải biết tên.',
      content: `
<div class="ml-en"><h2>📑 Lecture slides: auth & security in 12 slides</h2>
<p>Slide 10 is CORS. You will hit that error in your first week of connecting React to a backend, so read it before you need it.</p>
<p>Two ways to use it: skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 Slide bài giảng: xác thực & bảo mật trong 12 slide</h2>
<p>Slide 10 là CORS. Bạn chắc chắn gặp lỗi đó trong tuần đầu nối React với backend — đọc trước khi cần thì đỡ hoảng.</p>
<p>Hai cách dùng: lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${galleryGiang('wf-auth', [
  [1, "Bìa"],
  [2, "Nội dung chương"],
  [3, "Xác thực vs phân quyền"],
  [4, "HTTP không nhớ gì — nên cần cookie"],
  [5, "Token & JWT ⭐"],
  [6, "Session hay Token — chọn cái nào"],
  [7, "Mật khẩu — ba luật không được phá"],
  [8, "Thông báo lỗi đăng nhập — đừng nói quá nhiều"],
  [9, "HTTPS — vì sao bắt buộc"],
  [10, "CORS — lỗi bạn chắc chắn sẽ gặp ⭐"],
  [11, "Ba lỗ hổng phải biết tên"],
  [12, "Tự luyện"],
])}
`,
    },

    /* ─────────────────────────── 7.1 ─────────────────────────── */
    L71,

    /* ─────────────────────────── 7.2 ─────────────────────────── */
    L72,

    /* ─────────────────────────── 7.3 ─────────────────────────── */
    L73,

    /* ─────────────────────────── 7.4 ─────────────────────────── */
    L74,

    /* ─────────────────────────── 7.5 ─────────────────────────── */
    L75,

    /* ─────────────────────────── 7.6 quiz ─────────────────────────── */
    {
      title: '7.6 — Chapter 7 quiz|||7.6 — Kiểm tra chương 7',
      slug: 'wf-7-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về authentication vs authorization, cookie/session, JWT, bảo mật mật khẩu, và HTTPS/CORS.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 7: authentication vs authorization, cookies and sessions, JWT, password security, and HTTPS/CORS.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> The best way to internalise auth is to build real login and protected routes. The Chapter 7 set on Code Lab has you rebuild each piece — route rules, session store, SameSite and CSRF checks, JWT claims, refresh-token rotation, password rules, CORS preflight — then the Node.js (Express) track wires them into a real app.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Two questions</span><span class="lz-t">Who are you, and may you</span><span class="lz-d">Authentication happens once; authorisation happens on every request, for every resource. A hidden button is not access control.</span></div>
<div class="lz-node"><span class="lz-k">Cookie flags</span><span class="lz-t">HttpOnly, Secure, SameSite</span><span class="lz-d">And keep the cookie's lifetime in step with the session's — a mismatch logs users out invisibly, with 401s instead of a login prompt.</span></div>
<div class="lz-node"><span class="lz-k">A JWT is readable</span><span class="lz-t">Signed, not encrypted</span><span class="lz-d">Anyone holding it reads every claim, and it stays valid until it expires. Keep them short-lived and pair them with something revocable.</span></div>
<div class="lz-node"><span class="lz-k">Passwords</span><span class="lz-t">bcrypt, and one error message</span><span class="lz-d">Never store or encrypt them — hash them slowly. And do not tell an attacker which half of the login was wrong.</span></div>
</div>
<p class="note-ct"><strong>Security is the one area where "it works" proves nothing.</strong> A broken auth check works perfectly for the honest user testing it. For each endpoint you write, ask what happens when someone calls it with a different id, no token, or an expired one — then try it.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-7-0-slides&khoa=web-foundations">Practice on Code Lab → Chapter 7 practice set (31 auto-graded exercises)</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 7: xác thực vs phân quyền, cookie và session, JWT, bảo mật mật khẩu, và HTTPS/CORS.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Cách tốt nhất để thấm auth là tự dựng đăng nhập thật và các route được bảo vệ. Bộ đề Chương 7 trên Code Lab cho bạn tự dựng lại từng mảnh — luật theo route, kho phiên, SameSite và CSRF, claim JWT, xoay vòng refresh token, luật mật khẩu, preflight CORS — rồi track Node.js (Express) ghép chúng vào một app thật.</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Hai câu hỏi</span><span class="lz-t">Bạn là ai, và bạn có được phép</span><span class="lz-d">Xác thực xảy ra một lần; phân quyền xảy ra ở mọi request, cho mọi tài nguyên. Một cái nút bị giấu không phải là kiểm soát truy cập.</span></div>
<div class="lz-node"><span class="lz-k">Các cờ cookie</span><span class="lz-t">HttpOnly, Secure, SameSite</span><span class="lz-d">Và giữ tuổi thọ cookie khớp nhịp với phiên — lệch nhau là người dùng bị đăng xuất một cách vô hình, nhận 401 thay vì lời mời đăng nhập.</span></div>
<div class="lz-node"><span class="lz-k">Một JWT là đọc được</span><span class="lz-t">Đã ký, không phải mã hoá</span><span class="lz-d">Ai cầm nó cũng đọc được mọi tuyên bố, và nó hợp lệ cho tới khi hết hạn. Hãy giữ chúng sống ngắn và ghép với một thứ thu hồi được.</span></div>
<div class="lz-node"><span class="lz-k">Mật khẩu</span><span class="lz-t">bcrypt, và một thông điệp lỗi duy nhất</span><span class="lz-d">Đừng bao giờ lưu hay mã hoá chúng — hãy băm chậm. Và đừng nói cho kẻ tấn công biết nửa nào của lần đăng nhập là sai.</span></div>
</div>
<p class="note-ct"><strong>An toàn là lĩnh vực duy nhất mà "nó chạy được" chẳng chứng minh gì.</strong> Một phép kiểm quyền bị hỏng vẫn chạy hoàn hảo với người dùng ngay thẳng đang thử nó. Với mỗi endpoint bạn viết, hãy hỏi chuyện gì xảy ra khi có người gọi nó bằng một id khác, không có token, hoặc một token hết hạn — rồi thử thật.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-7-0-slides&khoa=web-foundations">Luyện tập ở Code Lab → bộ đề Chương 7 (31 bài, máy chấm tự động)</a></div></div>
${onTapBai('wf-7-6-quiz')}
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is the difference between authentication and authorization?|||Khác biệt giữa xác thực (authentication) và phân quyền (authorization) là gì?',
            options: [
              'Authentication proves who you are; authorization decides what you can do|||Xác thực chứng minh bạn là ai; phân quyền quyết định bạn được làm gì',
              'They are the same thing|||Chúng là một',
              'Authorization happens before login|||Phân quyền xảy ra trước khi đăng nhập',
              'Authentication only applies to admins|||Xác thực chỉ áp dụng cho admin',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does a login system need cookies or tokens at all?|||Vì sao một hệ thống đăng nhập cần cookie hoặc token?',
            options: [
              'Because HTTP is stateless — the server forgets you after every request, so identity must be re-sent|||Vì HTTP không lưu trạng thái — server quên bạn sau mỗi yêu cầu, nên danh tính phải được gửi lại',
              'Because passwords cannot be checked otherwise|||Vì không thể kiểm mật khẩu bằng cách khác',
              'Only to make the URL shorter|||Chỉ để URL ngắn hơn',
              'Cookies and tokens are required by JSON|||Cookie và token là bắt buộc theo JSON',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What happens automatically once a cookie is set by the server?|||Điều gì xảy ra tự động một khi cookie được server đặt?',
            options: [
              'The browser re-sends it on every later request to the matching domain|||Trình duyệt tự gửi lại nó ở mọi yêu cầu sau tới đúng domain',
              'It is deleted after one request|||Nó bị xoá sau một yêu cầu',
              'The user must copy-paste it manually|||Người dùng phải tự copy-paste nó',
              'It only works for GET requests|||Nó chỉ hoạt động với yêu cầu GET',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does the HttpOnly cookie flag do?|||Cờ HttpOnly của cookie làm gì?',
            options: [
              'Prevents JavaScript on the page from reading the cookie, protecting against theft via a malicious script|||Ngăn JavaScript trên trang đọc cookie, bảo vệ khỏi bị đánh cắp qua script độc hại',
              'Forces the cookie to only work over HTTP, never HTTPS|||Buộc cookie chỉ hoạt động qua HTTP, không bao giờ HTTPS',
              'Makes the cookie visible in the URL|||Khiến cookie hiển thị trong URL',
              'Deletes the cookie after one hour|||Xoá cookie sau một giờ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A JWT has three parts separated by dots. What are they?|||Một JWT có ba phần ngăn bởi dấu chấm. Đó là gì?',
            options: [
              'header.payload.signature|||header.payload.signature',
              'method.path.status|||method.path.status',
              'client.server.database|||client.server.database',
              'cookie.session.token|||cookie.session.token',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which statement about a JWT payload is TRUE?|||Phát biểu nào về payload của JWT là ĐÚNG?',
            options: [
              'It is only base64-encoded, not encrypted — anyone can decode and read it, so never put secrets in it|||Nó chỉ mã hoá base64, không mã hoá thật — ai cũng giải mã và đọc được, nên đừng bao giờ để bí mật trong đó',
              'It is fully encrypted and unreadable without the secret key|||Nó được mã hoá hoàn toàn và không đọc được nếu không có khoá bí mật',
              'It is stored only on the server, never sent to the client|||Nó chỉ lưu trên server, không bao giờ gửi cho client',
              'It cannot contain a user id|||Nó không thể chứa user id',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why hash a password instead of encrypting it?|||Vì sao hash một mật khẩu thay vì mã hoá nó?',
            options: [
              'Hashing is one-way — you never need to recover the original password, only compare hashes|||Hash là một chiều — bạn không bao giờ cần lấy lại mật khẩu gốc, chỉ so hash',
              'Hashing is reversible and faster to decrypt|||Hash đảo ngược được và giải mã nhanh hơn',
              'Encryption cannot be used on strings|||Mã hoá không dùng được trên chuỗi',
              'Hashing and encryption are the same thing|||Hash và mã hoá là một',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does salting a password before hashing accomplish?|||Salting một mật khẩu trước khi hash làm được gì?',
            options: [
              'Makes identical passwords produce different hashes, defeating precomputed rainbow tables|||Khiến mật khẩu giống nhau tạo ra hash khác nhau, đánh bại bảng rainbow table tính sẵn',
              'Makes the password shorter|||Làm mật khẩu ngắn hơn',
              'Encrypts the password so it can be recovered|||Mã hoá mật khẩu để có thể lấy lại',
              'Removes the need for a password entirely|||Loại bỏ hoàn toàn nhu cầu mật khẩu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why is bcrypt deliberately slow?|||Vì sao bcrypt cố tình chậm?',
            options: [
              'It makes brute-force guessing attacks impractically slow, while one real login check is barely noticeable|||Nó khiến tấn công brute-force đoán mật khẩu chậm đến mức bất khả thi, trong khi một lần kiểm đăng nhập thật gần như không cảm nhận được',
              'To save server memory|||Để tiết kiệm bộ nhớ server',
              'Slow hashing is a bug that developers tolerate|||Hash chậm là một lỗi mà lập trình viên chấp nhận',
              'It has nothing to do with security|||Nó không liên quan gì đến bảo mật',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does a "CORS error" in the browser console actually mean?|||Một "lỗi CORS" trong console trình duyệt thực sự nghĩa là gì?',
            options: [
              'The browser blocked your own JavaScript from reading a cross-origin response because the server did not allow it — not a server crash|||Trình duyệt chặn chính JavaScript của bạn đọc phản hồi khác origin vì server không cho phép — không phải server sập',
              'The server is offline|||Server đang offline',
              'The user\'s password is wrong|||Mật khẩu người dùng sai',
              'CORS errors also happen in curl and Postman|||Lỗi CORS cũng xảy ra trong curl và Postman',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
