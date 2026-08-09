/**
 * Web Foundations — Progress Test 2 (chương 6–10).
 *
 * Đề tự soạn, bám sát giáo trình `content/courses/web-foundations/s06…s10`.
 * 24 câu trắc nghiệm thuần (chấm tự động) — không có câu lập trình, không
 * dùng sim() (khoá Web Foundations không có mô phỏng riêng).
 *
 * ⚠️ Mọi câu "SQL này trả về gì" đều được thực thi bằng tay từng bước (lọc
 * WHERE, JOIN, ORDER BY, LIMIT) trên đúng dữ liệu nêu trong đề — không suy đoán.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/WF-PT2.mjs --apply
 */
import { B, EX, code, mcq, wfInstructions } from './_lib/wf-exam-kit.mjs';

export default {
  course: { slug: 'web-foundations' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — HTTP & APIs, auth & security, data & SQL, TypeScript, thinking & Git',
        'Kiểm tra tiến độ 2 — HTTP & API, xác thực & bảo mật, dữ liệu & SQL, TypeScript, tư duy & Git',
      ),
      description: B(
        'Second third of the Web Foundations course: the HTTP request/response cycle and REST APIs, authentication and security, relational data and SQL, TypeScript basics, and how to think, debug and use Git like a working developer. 24 multiple-choice questions.',
        'Một phần ba giữa của khoá Nền tảng Lập trình Web: chu trình request/response HTTP và REST API, xác thực và bảo mật, dữ liệu quan hệ và SQL, TypeScript cơ bản, và cách tư duy, gỡ lỗi và dùng Git như một lập trình viên đang làm việc thật. 24 câu trắc nghiệm.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: wfInstructions('Progress Test 2', 'chapters 6–10 (HTTP and APIs, authentication and security, data and SQL, TypeScript, thinking/debugging/Git)'),
      questions: [
        // ── Chương 6 — HTTP & API ────────────────────────────────────────
        mcq({
          prompt: B(
            'In the URL ' + code('https://api.example.com/v1/orders/17?status=paid') + ', what do <code>/v1/orders/17</code> and <code>status=paid</code> represent?',
            'Trong URL ' + code('https://api.example.com/v1/orders/17?status=paid') + ', <code>/v1/orders/17</code> và <code>status=paid</code> đại diện cho gì?',
          ),
          options: [
            B(
              '<code>/v1/orders/17</code> is the path identifying one specific resource; <code>status=paid</code> is a query string that refines the request',
              '<code>/v1/orders/17</code> là path chỉ định một tài nguyên cụ thể; <code>status=paid</code> là query string tinh chỉnh yêu cầu',
            ),
            B(
              '<code>/v1/orders/17</code> is the query string and <code>status=paid</code> is the path — they are swapped',
              '<code>/v1/orders/17</code> là query string còn <code>status=paid</code> là path — bị đảo ngược',
            ),
            B('Both pieces are HTTP headers sent alongside the request', 'Cả hai đều là header HTTP gửi kèm yêu cầu'),
            B('<code>/v1/orders/17</code> is the host name and <code>status=paid</code> is the scheme', '<code>/v1/orders/17</code> là tên host còn <code>status=paid</code> là scheme'),
          ],
          correct: 0,
          explanation: EX(
            'The path names WHICH resource — order 17. Everything after <code>?</code> is the query string: extra key=value options that refine the same request, here filtering by status. Removing the query string still points at order 17; removing <code>/17</code> points at a different resource entirely.',
            'Path đặt tên TÀI NGUYÊN NÀO — đơn hàng 17. Mọi thứ sau <code>?</code> là query string: các cặp key=value phụ để tinh chỉnh cùng một yêu cầu, ở đây là lọc theo trạng thái. Bỏ query string thì vẫn trỏ vào đơn 17; bỏ <code>/17</code> thì trỏ vào một tài nguyên hoàn toàn khác.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO true statements about HTTP methods.',
            'Chọn HAI phát biểu ĐÚNG về các method HTTP.',
          ),
          options: [
            B('GET is <b>safe</b>: it should never change data on the server', 'GET là <b>an toàn</b> (safe): nó không bao giờ nên thay đổi dữ liệu trên server'),
            B('DELETE is <b>idempotent</b>: sending the same DELETE request twice leaves the resource gone either way, same end state', 'DELETE là <b>bất biến</b> (idempotent): gửi cùng một DELETE hai lần vẫn kết thúc ở cùng trạng thái — tài nguyên đã bị xoá'),
            B('POST is idempotent: submitting the same "create order" form twice always creates exactly one order', 'POST là idempotent: gửi cùng form "tạo đơn hàng" hai lần luôn chỉ tạo đúng một đơn'),
            B('PATCH must always replace the entire resource, exactly the same as PUT', 'PATCH luôn phải thay thế toàn bộ tài nguyên, y hệt PUT'),
          ],
          correct: [0, 1],
          explanation: EX(
            'GET is safe because reading never mutates state. DELETE is idempotent: deleting an already-deleted resource still ends with it gone. POST is the opposite of idempotent — each call can create a new record, which is exactly why double-clicking "checkout" is dangerous. PATCH updates PART of a resource; PUT replaces it entirely — they are deliberately different.',
            'GET an toàn vì đọc không bao giờ làm thay đổi trạng thái. DELETE idempotent: xoá một tài nguyên đã bị xoá rồi vẫn kết thúc ở trạng thái "đã mất". POST thì ngược lại — mỗi lần gọi có thể tạo thêm một bản ghi mới, đó chính là lý do bấm đúp nút "thanh toán" nguy hiểm. PATCH cập nhật MỘT PHẦN tài nguyên; PUT thay thế toàn bộ — chúng cố tình khác nhau.',
          ),
        }),

        mcq({
          prompt: B(
            'A client sends a request to a protected endpoint with no <code>Authorization</code> header at all. Which status code is most appropriate, and why?',
            'Một client gửi yêu cầu tới một endpoint được bảo vệ mà không có header <code>Authorization</code> nào cả. Mã trạng thái nào phù hợp nhất, và vì sao?',
          ),
          options: [
            B('401 Unauthorized — the server does not know who is making the request at all', '401 Unauthorized — server hoàn toàn không biết ai đang gửi yêu cầu'),
            B('403 Forbidden — the server knows exactly who they are and denies the action', '403 Forbidden — server biết chính xác họ là ai và từ chối hành động'),
            B('404 Not Found — hide the fact that the endpoint exists', '404 Not Found — giấu đi việc endpoint này tồn tại'),
            B('500 Internal Server Error — the server cannot process a request with no credentials', '500 Internal Server Error — server không xử lý được yêu cầu thiếu thông tin đăng nhập'),
          ],
          correct: 0,
          explanation: EX(
            '401 means "who are you?" — no or invalid credentials. 403 is reserved for the opposite case: the server already knows who you are (you are logged in) but you lack permission for this specific action. Since there is no credential here at all, 401 is correct, not 403.',
            '401 nghĩa là "bạn là ai?" — không có hoặc thông tin đăng nhập không hợp lệ. 403 dành cho trường hợp ngược lại: server đã biết bạn là ai (đã đăng nhập) nhưng bạn thiếu quyền cho hành động cụ thể này. Vì ở đây hoàn toàn không có thông tin đăng nhập, 401 mới đúng, không phải 403.',
          ),
        }),

        mcq({
          prompt: B(
            'Which of these is <b>valid</b> JSON?',
            'Cái nào là JSON <b>hợp lệ</b>?',
          ),
          options: [
            B(code('{"id": 7, "active": true, "tags": ["a", "b"]}'), code('{"id": 7, "active": true, "tags": ["a", "b"]}')),
            B(code('{id: 7, active: true}'), code('{id: 7, active: true}')),
            B(code('{"id": 7, "active": true,}'), code('{"id": 7, "active": true,}')),
            B(code("{'id': 7}"), code("{'id': 7}")),
          ],
          correct: 0,
          explanation: EX(
            'JSON requires double-quoted keys and string values, no trailing comma, and no single quotes. Option B has an unquoted key, C has a trailing comma after the last value, and D uses single quotes — all three make <code>JSON.parse</code> throw, which a server typically answers with 400 Bad Request.',
            'JSON bắt buộc khoá và chuỗi phải trong nháy kép, không dấu phẩy thừa, và không dùng nháy đơn. Đáp án B có khoá không nháy, C có dấu phẩy thừa sau giá trị cuối, còn D dùng nháy đơn — cả ba đều khiến <code>JSON.parse</code> ném lỗi, và server thường trả về 400 Bad Request cho việc đó.',
          ),
        }),

        mcq({
          prompt: B(
            'Which pair of route designs correctly follows REST convention for a blog API?',
            'Cặp thiết kế route nào theo đúng quy ước REST cho một API blog?',
          ),
          options: [
            B('<code>GET /posts/42</code> to fetch one post (path param); <code>GET /posts?tag=js&amp;page=2</code> to filter and paginate the list (query string)', '<code>GET /posts/42</code> để lấy một bài viết (path param); <code>GET /posts?tag=js&amp;page=2</code> để lọc và phân trang danh sách (query string)'),
            B('<code>GET /posts?id=42</code> to fetch one post; <code>GET /posts/tag/js/page/2</code> to filter the list', '<code>GET /posts?id=42</code> để lấy một bài viết; <code>GET /posts/tag/js/page/2</code> để lọc danh sách'),
            B('<code>POST /getPost/42</code> to fetch one post; <code>GET /posts/filter</code> to filter the list', '<code>POST /getPost/42</code> để lấy một bài viết; <code>GET /posts/filter</code> để lọc danh sách'),
            B('<code>GET /posts/42/tag/js/page/2</code> for every case, because query strings should never be used', '<code>GET /posts/42/tag/js/page/2</code> cho mọi trường hợp, vì không bao giờ nên dùng query string'),
          ],
          correct: 0,
          explanation: EX(
            'A path parameter identifies WHICH resource (post 42); a query string refines a collection request (filter by tag, go to page 2). Option C also breaks REST by putting a verb in the URL (<code>/getPost</code>) — the method (GET) already carries the verb.',
            'Tham số đường dẫn chỉ định TÀI NGUYÊN NÀO (bài 42); query string tinh chỉnh một yêu cầu trên tập hợp (lọc theo tag, sang trang 2). Đáp án C cũng phá vỡ REST vì nhét động từ vào URL (<code>/getPost</code>) — method (GET) đã mang động từ rồi.',
          ),
        }),

        // ── Chương 7 — Xác thực & bảo mật ────────────────────────────────
        mcq({
          prompt: B(
            'A user logs in successfully, then tries to delete another user\'s post and gets <code>403 Forbidden</code>. What happened?',
            'Một người dùng đăng nhập thành công, rồi thử xoá bài viết của người khác và nhận <code>403 Forbidden</code>. Chuyện gì đã xảy ra?',
          ),
          options: [
            B('Authentication succeeded (the server knows who they are); authorization failed (they lack permission for this action)', 'Xác thực (authentication) thành công (server biết họ là ai); phân quyền (authorization) thất bại (họ thiếu quyền cho hành động này)'),
            B('Authentication failed; authorization happened to succeed anyway', 'Xác thực thất bại; phân quyền lại vẫn thành công'),
            B('Both authentication and authorization failed at the same time', 'Cả xác thực lẫn phân quyền đều thất bại cùng lúc'),
            B('Authentication and authorization are the same check, so this situation is impossible', 'Xác thực và phân quyền là cùng một phép kiểm, nên tình huống này không thể xảy ra'),
          ],
          correct: 0,
          explanation: EX(
            'Authentication answers "who are you?" — login succeeded, so that check passed. Authorization answers "are you allowed to do THIS?" — deleting someone else\'s post is not allowed, so that check failed with 403. They are two separate checks, and this is the textbook case where one passes and the other does not.',
            'Xác thực trả lời "bạn là ai?" — đăng nhập thành công nên phép kiểm này đã qua. Phân quyền trả lời "bạn có được phép làm việc NÀY không?" — xoá bài của người khác là không được phép, nên phép kiểm này thất bại với 403. Đây là hai phép kiểm tách biệt, và đây đúng là tình huống mẫu mực khi một cái qua còn cái kia không.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO true statements about cookie flags used on a session cookie.',
            'Chọn HAI phát biểu ĐÚNG về các cờ (flag) cookie dùng cho cookie phiên đăng nhập.',
          ),
          options: [
            B('<code>HttpOnly</code> stops JavaScript in the browser from reading the cookie, blocking a common XSS cookie-theft attack', '<code>HttpOnly</code> ngăn JavaScript trong trình duyệt đọc cookie, chặn kiểu tấn công đánh cắp cookie qua XSS thường gặp'),
            B('<code>Secure</code> makes the browser only send the cookie over an HTTPS connection, never plain HTTP', '<code>Secure</code> khiến trình duyệt chỉ gửi cookie qua kết nối HTTPS, không bao giờ qua HTTP thường'),
            B('<code>HttpOnly</code> restricts the cookie to the exact same URL path, never any subpath', '<code>HttpOnly</code> giới hạn cookie chỉ ở đúng path URL đó, không bao giờ ở path con'),
            B('<code>Secure</code> encrypts the cookie\'s stored value so even the server that issued it cannot read it back', '<code>Secure</code> mã hoá giá trị lưu trong cookie nên ngay cả server đã phát hành nó cũng không đọc lại được'),
          ],
          correct: [0, 1],
          explanation: EX(
            '<code>HttpOnly</code> hides the cookie from <code>document.cookie</code>, so injected JavaScript cannot steal it. <code>Secure</code> means the browser refuses to send it over plain HTTP. Path scoping is a separate <code>Path=</code> attribute, and neither flag encrypts the value — the server always reads it as plain text.',
            '<code>HttpOnly</code> giấu cookie khỏi <code>document.cookie</code>, nên JavaScript bị chèn vào không đánh cắp được nó. <code>Secure</code> nghĩa là trình duyệt từ chối gửi nó qua HTTP thường. Giới hạn theo path là một thuộc tính <code>Path=</code> riêng, và không cờ nào mã hoá giá trị — server luôn đọc nó dưới dạng văn bản thuần.',
          ),
        }),

        mcq({
          prompt: B(
            'A JWT looks like <code>xxxxx.yyyyy.zzzzz</code>. Which statement about it is correct?',
            'Một JWT trông như <code>xxxxx.yyyyy.zzzzz</code>. Phát biểu nào về nó là ĐÚNG?',
          ),
          options: [
            B('The three parts are header, payload and signature; the payload is only base64url-<i>encoded</i>, not encrypted, so anyone can read it', 'Ba phần là header, payload và signature; payload chỉ được <i>mã hoá base64url</i> (encode), không phải encrypt, nên ai cũng đọc được'),
            B('The three parts are username, password and expiry date, all encrypted with AES', 'Ba phần là username, password và ngày hết hạn, tất cả đều được mã hoá bằng AES'),
            B('JWT payloads are encrypted, so it is safe to put a password hash inside one', 'Payload của JWT được mã hoá, nên nhét một password hash vào bên trong là an toàn'),
            B('Only the signature part can be read; the header and payload are encrypted and hidden', 'Chỉ phần signature đọc được; header và payload bị mã hoá và ẩn đi'),
          ],
          correct: 0,
          explanation: EX(
            'Encoding is not encryption: anyone can base64url-decode a JWT\'s header and payload in their browser console and read the claims in plain text. Only the signature proves the token was not tampered with — never put secrets (passwords, hashes, card numbers) inside the payload.',
            'Encode không phải encrypt: ai cũng có thể giải mã base64url phần header và payload của một JWT ngay trong console trình duyệt và đọc thẳng các claim. Chỉ có signature chứng minh token chưa bị sửa — đừng bao giờ nhét bí mật (mật khẩu, hash, số thẻ) vào payload.',
          ),
        }),

        mcq({
          prompt: B(
            'Why does a login system store <code>bcrypt(password)</code> in the database instead of the plaintext password?',
            'Vì sao một hệ thống đăng nhập lưu <code>bcrypt(password)</code> trong database thay vì mật khẩu dạng chữ thô (plaintext)?',
          ),
          options: [
            B('If the database leaks, attackers only get hashes, and bcrypt is deliberately slow so guessing them at scale is impractical — plaintext would be usable immediately, and often reused on other sites', 'Nếu database rò rỉ, kẻ tấn công chỉ lấy được hash, và bcrypt cố tình chậm nên đoán hàng loạt là bất khả thi — còn plaintext thì dùng được ngay, và thường bị tái sử dụng ở trang khác'),
            B('bcrypt makes the password reversible with a secret master key, so support staff can decrypt and recover it whenever a user forgets it', 'bcrypt làm mật khẩu có thể đảo ngược lại bằng một khoá bí mật chủ, để nhân viên hỗ trợ giải mã và khôi phục nó bất cứ khi nào người dùng quên'),
            B('Hashing mainly exists to make the database file take up noticeably less disk space than storing plain text would', 'Hash chủ yếu tồn tại để file database chiếm ít dung lượng đĩa hơn đáng kể so với lưu chữ thô'),
            B('Storing plaintext passwords is completely fine as long as the login form itself is served over HTTPS', 'Lưu mật khẩu dạng plaintext hoàn toàn ổn miễn là form đăng nhập được phục vụ qua HTTPS'),
          ],
          correct: 0,
          explanation: EX(
            'Hashing is one-way — there is no "decrypt" for a password hash, which is exactly the point: nobody, not even the company, should ever be able to read a user\'s real password. HTTPS protects the password in transit, but a data breach exposes whatever is stored at rest, which is why the stored form must already be unusable to an attacker.',
            'Hash là một chiều — không hề có "giải mã" cho một password hash, và đó chính là mục đích: không ai, kể cả công ty, được đọc mật khẩu thật của người dùng. HTTPS bảo vệ mật khẩu trên đường truyền, nhưng một vụ rò rỉ dữ liệu làm lộ đúng thứ được lưu ở trạng thái nghỉ, nên thứ được lưu phải vô dụng sẵn với kẻ tấn công.',
          ),
        }),

        mcq({
          prompt: B(
            'Your frontend at <code>https://app.example.com</code> calls an API at <code>https://api.example.com</code> and the browser console shows a CORS error — but the exact same request works fine in Postman. What does that tell you?',
            'Frontend của bạn ở <code>https://app.example.com</code> gọi một API ở <code>https://api.example.com</code> và console trình duyệt báo lỗi CORS — nhưng đúng yêu cầu đó lại chạy tốt trong Postman. Điều đó nói lên điều gì?',
          ),
          options: [
            B('The BROWSER is blocking the response: the API never sent an <code>Access-Control-Allow-Origin</code> header for this origin, and Postman does not enforce that rule at all', 'TRÌNH DUYỆT đang chặn phản hồi: API chưa gửi header <code>Access-Control-Allow-Origin</code> cho origin này, còn Postman thì hoàn toàn không ép luật đó'),
            B('The API server is completely down right now and is returning absolutely no response of any kind to any client whatsoever', 'Server API đang sập hoàn toàn ngay lúc này và hoàn toàn không trả về phản hồi nào cho bất kỳ client nào cả'),
            B('The request never even left the browser at all in this case, because the URL itself was simply typed incorrectly somewhere', 'Trong trường hợp này yêu cầu chưa từng rời khỏi trình duyệt, vì đơn giản là bản thân URL đã bị gõ sai ở đâu đó'),
            B('A CORS error showing up like this always specifically means the currently logged-in user is not properly authenticated on that server', 'Một lỗi CORS xuất hiện như thế này luôn có nghĩa cụ thể là người dùng hiện đang đăng nhập chưa được xác thực đúng cách trên server đó'),
          ],
          correct: 0,
          explanation: EX(
            'Same-origin policy is a BROWSER rule, not a network rule — the server usually did respond, but the browser refused to hand the response to your JavaScript because the server did not opt the caller\'s origin in via CORS headers. Tools like Postman make requests directly with no browser enforcing that policy, so they never see the error.',
            'Same-origin policy là luật của TRÌNH DUYỆT, không phải luật mạng — server thường vẫn đã phản hồi, nhưng trình duyệt từ chối đưa phản hồi đó cho JavaScript của bạn vì server chưa cho phép origin gọi tới qua header CORS. Các công cụ như Postman gửi yêu cầu trực tiếp, không có trình duyệt nào ép luật đó, nên chúng không bao giờ thấy lỗi này.',
          ),
        }),

        // ── Chương 8 — Dữ liệu & SQL ─────────────────────────────────────
        mcq({
          prompt: B(
            'In a relational database table <code>products(id, name, price)</code>, what does one ROW represent?',
            'Trong một bảng database quan hệ <code>products(id, name, price)</code>, một DÒNG (row) đại diện cho gì?',
          ),
          options: [
            B('One single product record — its id, name and price all together', 'Một bản ghi sản phẩm duy nhất — id, tên và giá của nó gộp lại'),
            B('One column definition that is shared by every product in the table', 'Một định nghĩa cột được dùng chung cho mọi sản phẩm trong bảng'),
            B('The name of the table itself, written once at the top', 'Tên của chính bảng đó, viết một lần ở trên cùng'),
            B('A saved query that filters the products table', 'Một truy vấn đã lưu để lọc bảng products'),
          ],
          correct: 0,
          explanation: EX(
            'A table is a grid: columns define WHAT kind of value each field holds (id, name, price), and each row is ONE record — one actual product with a value in every one of those columns.',
            'Một bảng là một lưới: cột định nghĩa MỖI trường chứa loại giá trị gì (id, name, price), còn mỗi dòng là MỘT bản ghi — một sản phẩm thật có giá trị ở từng cột đó.',
          ),
        }),

        mcq({
          prompt: B(
            'Table <code>employees(id, name, dept, salary)</code> has rows ' +
              code('(1,\'An\',\'Eng\',1200)\n(2,\'Binh\',\'Eng\',1500)\n(3,\'Chi\',\'Sales\',900)\n(4,\'Dung\',\'Sales\',2000)') +
              'What does ' + code("SELECT name FROM employees WHERE dept = 'Eng' ORDER BY salary DESC LIMIT 1;") + ' return?',
            'Bảng <code>employees(id, name, dept, salary)</code> có các dòng ' +
              code('(1,\'An\',\'Eng\',1200)\n(2,\'Binh\',\'Eng\',1500)\n(3,\'Chi\',\'Sales\',900)\n(4,\'Dung\',\'Sales\',2000)') +
              'Câu lệnh ' + code("SELECT name FROM employees WHERE dept = 'Eng' ORDER BY salary DESC LIMIT 1;") + ' trả về gì?',
          ),
          options: [
            B(code('Binh'), code('Binh')),
            B(code('An'), code('An')),
            B(code('Dung'), code('Dung')),
            B(code('An\nBinh'), code('An\nBinh')),
          ],
          correct: 0,
          explanation: EX(
            'Step by step: <code>WHERE dept = &#39;Eng&#39;</code> keeps only An (1200) and Binh (1500) — Sales rows are dropped. <code>ORDER BY salary DESC</code> sorts them Binh, An. <code>LIMIT 1</code> keeps just the first row, so the result is a single row: <code>Binh</code>.',
            'Từng bước: <code>WHERE dept = &#39;Eng&#39;</code> chỉ giữ lại An (1200) và Binh (1500) — các dòng Sales bị loại. <code>ORDER BY salary DESC</code> sắp xếp thành Binh, An. <code>LIMIT 1</code> chỉ giữ dòng đầu tiên, nên kết quả là một dòng duy nhất: <code>Binh</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Using the same <code>employees</code> table as above, what happens when you run ' + code('UPDATE employees SET salary = 0;') + ' with no <code>WHERE</code> clause?',
            'Vẫn dùng bảng <code>employees</code> ở trên, điều gì xảy ra khi chạy ' + code('UPDATE employees SET salary = 0;') + ' không có mệnh đề <code>WHERE</code>?',
          ),
          options: [
            B('All 4 rows get <code>salary = 0</code> — every employee, not just one', 'Cả 4 dòng đều bị đặt <code>salary = 0</code> — mọi nhân viên, không chỉ một người'),
            B('Nothing happens, because SQL refuses to run UPDATE without a WHERE clause', 'Không có gì xảy ra, vì SQL từ chối chạy UPDATE thiếu WHERE'),
            B('Only the first row inserted (An) gets salary = 0', 'Chỉ dòng được chèn đầu tiên (An) bị đặt salary = 0'),
            B('The database throws a syntax error and rejects the statement', 'Database ném lỗi cú pháp và từ chối câu lệnh'),
          ],
          correct: 0,
          explanation: EX(
            'Without <code>WHERE</code>, <code>UPDATE</code> and <code>DELETE</code> apply to EVERY row in the table — this is valid, runnable SQL with no error, which is exactly what makes it so dangerous. This is why production incidents so often start with someone forgetting one line: always write and check the <code>WHERE</code> clause before running a destructive statement, ideally by running the matching <code>SELECT</code> first.',
            'Không có <code>WHERE</code>, <code>UPDATE</code> và <code>DELETE</code> áp dụng cho MỌI dòng trong bảng — đây là SQL hợp lệ, chạy được, không báo lỗi gì, và chính vì thế nó nguy hiểm. Đây là lý do các sự cố production hay bắt đầu từ việc ai đó quên một dòng: luôn viết và kiểm mệnh đề <code>WHERE</code> trước khi chạy câu lệnh phá huỷ, tốt nhất là chạy thử <code>SELECT</code> tương ứng trước.',
          ),
        }),

        mcq({
          prompt: B(
            'In tables <code>customers(id PRIMARY KEY, name)</code> and <code>orders(id PRIMARY KEY, customer_id, total)</code>, what is <code>customer_id</code> in <code>orders</code>?',
            'Trong các bảng <code>customers(id PRIMARY KEY, name)</code> và <code>orders(id PRIMARY KEY, customer_id, total)</code>, <code>customer_id</code> trong <code>orders</code> là gì?',
          ),
          options: [
            B('A foreign key — it references <code>customers.id</code> to link each order to the customer who placed it', 'Một khoá ngoại (foreign key) — nó tham chiếu tới <code>customers.id</code> để nối mỗi đơn hàng với khách đã đặt nó'),
            B('The primary key of the orders table', 'Khoá chính (primary key) của bảng orders'),
            B('Just a column with no special meaning to the database engine', 'Chỉ là một cột bình thường, không có ý nghĩa đặc biệt gì với database'),
            B('A duplicate copy of the primary key of customers, kept only for speed', 'Một bản sao của khoá chính bảng customers, giữ lại chỉ để tăng tốc'),
          ],
          correct: 0,
          explanation: EX(
            'A primary key uniquely identifies a row in its OWN table (<code>orders.id</code> identifies one order). A foreign key is a column in one table that points at the primary key of ANOTHER table — <code>orders.customer_id</code> pointing at <code>customers.id</code> is exactly that link, and it is what makes a JOIN possible.',
            'Khoá chính định danh duy nhất một dòng trong bảng CỦA CHÍNH NÓ (<code>orders.id</code> định danh một đơn hàng). Khoá ngoại là một cột trong một bảng trỏ tới khoá chính của bảng KHÁC — <code>orders.customer_id</code> trỏ tới <code>customers.id</code> chính là liên kết đó, và nó là thứ khiến JOIN thực hiện được.',
          ),
        }),

        mcq({
          prompt: B(
            'Table <code>customers(id, name)</code> has rows ' + code("(1,'Lan')\n(2,'Minh')") +
              'and <code>orders(id, item, customer_id)</code> has rows ' + code("(1,'Book',1)\n(2,'Pen',NULL)") +
              'What does ' + code('SELECT orders.item, customers.name FROM orders INNER JOIN customers ON orders.customer_id = customers.id;') + ' return?',
            'Bảng <code>customers(id, name)</code> có các dòng ' + code("(1,'Lan')\n(2,'Minh')") +
              'và <code>orders(id, item, customer_id)</code> có các dòng ' + code("(1,'Book',1)\n(2,'Pen',NULL)") +
              'Câu lệnh ' + code('SELECT orders.item, customers.name FROM orders INNER JOIN customers ON orders.customer_id = customers.id;') + ' trả về gì?',
          ),
          options: [
            B(code('item | name\nBook | Lan'), code('item | name\nBook | Lan')),
            B(code('item | name\nBook | Lan\nPen  | NULL'), code('item | name\nBook | Lan\nPen  | NULL')),
            B(code('item | name\nBook | Lan\nPen  | Minh'), code('item | name\nBook | Lan\nPen  | Minh')),
            B(code('(no rows at all)'), code('(không dòng nào)')),
          ],
          correct: 0,
          explanation: EX(
            'INNER JOIN keeps only rows where the ON condition finds a match on BOTH sides. "Book" matches <code>customer_id = 1</code> → Lan. "Pen" has <code>customer_id = NULL</code>, which matches no customer, so INNER JOIN drops that row entirely — the result is a single row. A LEFT JOIN instead would have kept "Pen" with <code>name = NULL</code>, since LEFT JOIN keeps every row from the left table (orders) regardless of a match.',
            'INNER JOIN chỉ giữ những dòng mà điều kiện ON tìm được khớp ở CẢ HAI bên. "Book" khớp <code>customer_id = 1</code> → Lan. "Pen" có <code>customer_id = NULL</code>, không khớp khách nào, nên INNER JOIN loại hẳn dòng đó — kết quả chỉ còn một dòng. Nếu dùng LEFT JOIN thì "Pen" vẫn được giữ với <code>name = NULL</code>, vì LEFT JOIN giữ mọi dòng từ bảng bên trái (orders) bất kể có khớp hay không.',
          ),
        }),

        // ── Chương 9 — TypeScript ─────────────────────────────────────────
        mcq({
          prompt: B(
            'What is the main benefit TypeScript adds over plain JavaScript, and what happens to TypeScript code before it runs in Node.js or a browser?',
            'Lợi ích chính mà TypeScript thêm vào so với JavaScript thuần là gì, và điều gì xảy ra với mã TypeScript trước khi nó chạy trên Node.js hay trình duyệt?',
          ),
          options: [
            B('TypeScript adds static types that catch mistakes (like calling a method on the wrong type) while writing code, then the TypeScript compiler transpiles it into plain JavaScript before it runs', 'TypeScript thêm kiểu tĩnh (static type) để bắt lỗi (như gọi sai phương thức trên một kiểu) ngay lúc viết mã, sau đó trình biên dịch TypeScript chuyển nó thành JavaScript thuần trước khi chạy'),
            B('TypeScript replaces JavaScript entirely; Node.js and browsers run .ts files natively with no compilation step', 'TypeScript thay thế hoàn toàn JavaScript; Node.js và trình duyệt chạy thẳng file .ts, không cần bước biên dịch nào'),
            B('TypeScript only adds comments describing the intended types; it has no effect on catching real bugs', 'TypeScript chỉ thêm chú thích mô tả kiểu dự định; nó không có tác dụng bắt lỗi thật nào'),
            B('TypeScript makes JavaScript run faster at runtime by removing the need for a JavaScript engine', 'TypeScript làm JavaScript chạy nhanh hơn lúc runtime bằng cách bỏ đi nhu cầu cần một engine JavaScript'),
          ],
          correct: 0,
          explanation: EX(
            'Types are checked at compile time — before the program ever runs — catching a whole class of "undefined is not a function" style bugs early. Neither Node.js nor any browser executes <code>.ts</code> files directly: <code>tsc</code> (or a bundler using it) always transpiles TypeScript down to ordinary JavaScript first.',
            'Kiểu được kiểm ở thời điểm biên dịch — trước khi chương trình từng chạy — bắt được cả một lớp lỗi kiểu "undefined is not a function" từ sớm. Không Node.js hay trình duyệt nào chạy thẳng file <code>.ts</code>: <code>tsc</code> (hoặc một bundler dùng nó) luôn chuyển TypeScript thành JavaScript thường trước.',
          ),
        }),

        mcq({
          prompt: B(
            'Which annotation correctly declares a variable that holds an array of strings?',
            'Annotation nào gắn kiểu đúng cho một biến chứa mảng chuỗi?',
          ),
          options: [
            B(code("let tags: string[] = ['a', 'b'];"), code("let tags: string[] = ['a', 'b'];")),
            B(code("let tags: string = ['a', 'b'];"), code("let tags: string = ['a', 'b'];")),
            B(code("let tags: array<string> = ['a', 'b'];"), code("let tags: array<string> = ['a', 'b'];")),
            B(code("let tags: number[] = ['a', 'b'];"), code("let tags: number[] = ['a', 'b'];")),
          ],
          correct: 0,
          explanation: EX(
            'An array-of-T type is written <code>T[]</code> (or the equivalent <code>Array&lt;T&gt;</code>) — <code>string[]</code> means "array of strings". Option B types it as a single string, C invents a syntax TypeScript does not have, and D annotates it as numbers while assigning strings — the compiler would reject both.',
            'Kiểu mảng-của-T viết là <code>T[]</code> (hoặc tương đương <code>Array&lt;T&gt;</code>) — <code>string[]</code> nghĩa là "mảng chuỗi". Đáp án B gắn kiểu là một chuỗi đơn, C bịa ra cú pháp TypeScript không có, còn D gắn kiểu số nhưng lại gán chuỗi — trình biên dịch sẽ từ chối cả hai.',
          ),
        }),

        mcq({
          prompt: B(
            'Given ' + code('let id: string | number;') + ', which of these assignments is VALID?',
            'Cho ' + code('let id: string | number;') + ', phép gán nào sau đây HỢP LỆ?',
          ),
          options: [
            B(code('id = 42;'), code('id = 42;')),
            B(code('id = true;'), code('id = true;')),
            B(code('id = [1, 2];'), code('id = [1, 2];')),
            B(code('id = { value: 42 };'), code('id = { value: 42 };')),
          ],
          correct: 0,
          explanation: EX(
            'A union type <code>string | number</code> means the value must be EITHER a string OR a number — nothing else. <code>42</code> is a number, so it fits. A boolean, an array and an object are none of the two allowed types, so TypeScript would flag all three as errors.',
            'Union type <code>string | number</code> nghĩa là giá trị phải là MỘT TRONG HAI: chuỗi HOẶC số — không gì khác. <code>42</code> là số nên hợp lệ. Boolean, mảng và object đều không nằm trong hai kiểu được phép, nên TypeScript sẽ báo lỗi cho cả ba.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO true statements about the <code>any</code> type in TypeScript.',
            'Chọn HAI phát biểu ĐÚNG về kiểu <code>any</code> trong TypeScript.',
          ),
          options: [
            B('Using <code>any</code> turns off type checking for that value, so TypeScript will not catch mistakes made on it', 'Dùng <code>any</code> tắt hẳn việc kiểm kiểu cho giá trị đó, nên TypeScript sẽ không bắt được lỗi xảy ra trên nó'),
            B('Overusing <code>any</code> defeats the whole purpose of choosing TypeScript over plain JavaScript', 'Lạm dụng <code>any</code> làm mất hết ý nghĩa của việc chọn TypeScript thay vì JavaScript thuần'),
            B('<code>any</code> is the required way to type any parameter that can hold more than one possible type — use it instead of a union type', '<code>any</code> là cách bắt buộc để gắn kiểu cho một tham số có thể nhận nhiều kiểu — dùng nó thay cho union type'),
            B('The compiler automatically narrows every <code>any</code> back to its most specific type once the code compiles', 'Trình biên dịch tự động thu hẹp mọi <code>any</code> về đúng kiểu cụ thể nhất của nó khi mã biên dịch xong'),
          ],
          correct: [0, 1],
          explanation: EX(
            '<code>any</code> is an escape hatch — TypeScript stops checking that value entirely, silently reintroducing the class of bugs types exist to catch. When a value can legitimately be more than one type, a union type (<code>string | number</code>) is the correct tool, not <code>any</code> — it keeps checking, it just allows either type.',
            '<code>any</code> là lối thoát — TypeScript ngừng hẳn kiểm tra giá trị đó, âm thầm để lọt lại đúng loại lỗi mà kiểu tồn tại để bắt. Khi một giá trị hợp lệ có thể là nhiều hơn một kiểu, union type (<code>string | number</code>) mới là công cụ đúng, không phải <code>any</code> — nó vẫn kiểm tra, chỉ là cho phép một trong hai kiểu.',
          ),
        }),

        mcq({
          prompt: B(
            'What does the type parameter <code>T</code> represent in this function?' + code(
              'function first<T>(items: T[]): T {\n  return items[0];\n}',
            ),
            '<code>T</code> đại diện cho gì trong hàm này?' + code(
              'function first<T>(items: T[]): T {\n  return items[0];\n}',
            ),
          ),
          options: [
            B('A placeholder for whatever type the caller\'s array actually holds — TypeScript fills it in per call, e.g. <code>T</code> becomes <code>number</code> for <code>first([1, 2, 3])</code>', 'Một chỗ giữ chỗ cho bất kỳ kiểu nào mảng của người gọi thực sự chứa — TypeScript tự điền cho từng lần gọi, ví dụ <code>T</code> thành <code>number</code> với <code>first([1, 2, 3])</code>'),
            B('A fixed type alias that always secretly means <code>string</code>, no matter what array is actually passed in', 'Một alias kiểu cố định luôn ngầm có nghĩa là <code>string</code>, bất kể mảng nào thực sự được truyền vào'),
            B('A normal runtime variable whose value the caller must explicitly pass in as an extra function argument', 'Một biến runtime bình thường mà người gọi phải truyền thêm vào một cách tường minh như một đối số hàm'),
            B('A comment-only marker with no runtime or compile-time effect, purely there for human readers', 'Một dấu chú thích thuần tuý, không có tác dụng gì lúc chạy hay lúc biên dịch, chỉ để người đọc hiểu'),
          ],
          correct: 0,
          explanation: EX(
            'This is a generic function: <code>T</code> is a type variable, decided fresh for each call based on the argument. Call it with <code>number[]</code> and <code>T</code> is <code>number</code>, so the return type is <code>number</code>; call it with <code>string[]</code> and both become <code>string</code> — one function body, safely typed for every array it is given.',
            'Đây là một hàm generic: <code>T</code> là một biến kiểu, được quyết định lại cho từng lần gọi dựa trên đối số. Gọi với <code>number[]</code> thì <code>T</code> là <code>number</code>, nên kiểu trả về là <code>number</code>; gọi với <code>string[]</code> thì cả hai thành <code>string</code> — một thân hàm duy nhất, được gắn kiểu an toàn cho mọi mảng truyền vào.',
          ),
        }),

        // ── Chương 10 — Tư duy, gỡ lỗi & Git ─────────────────────────────
        mcq({
          prompt: B(
            'You need to build a feature that lets users upload a profile picture, resize it, and save it to storage. What is the recommended FIRST step before writing code?',
            'Bạn cần dựng một tính năng cho phép người dùng tải lên ảnh đại diện, thu nhỏ nó, rồi lưu vào kho lưu trữ. Bước ĐẦU TIÊN nên làm trước khi viết code là gì?',
          ),
          options: [
            B('Break the problem into smaller pieces (accept the file, validate it, resize it, upload it, save the reference) and think through each one before coding', 'Chia nhỏ vấn đề thành các phần (nhận file, kiểm tra hợp lệ, thu nhỏ, tải lên, lưu tham chiếu) và nghĩ kỹ từng phần trước khi viết code'),
            B('Start writing the image-resizing logic first, since it looks like the hardest part', 'Viết logic thu nhỏ ảnh trước tiên, vì nó có vẻ là phần khó nhất'),
            B('Copy a random Stack Overflow answer mentioning "upload image" and keep adjusting it until it compiles', 'Chép một câu trả lời Stack Overflow bất kỳ nhắc đến "upload image" rồi chỉnh cho tới khi biên dịch được'),
            B('Write the entire feature inside one large function, to keep everything in a single place', 'Viết cả tính năng trong một hàm lớn duy nhất, để mọi thứ nằm ở một chỗ'),
          ],
          correct: 0,
          explanation: EX(
            'Decomposition — splitting an unfamiliar problem into smaller, well-understood pieces — is the core skill this chapter teaches. Solving each small piece (accept → validate → resize → upload → save) in order gives you working checkpoints and makes the overall problem far less overwhelming than staring at "build the whole feature" at once.',
            'Chia nhỏ vấn đề (decomposition) — tách một vấn đề chưa quen thành các phần nhỏ, dễ hiểu — là kỹ năng cốt lõi chương này dạy. Giải từng phần nhỏ theo thứ tự (nhận → kiểm tra → thu nhỏ → tải lên → lưu) cho bạn các mốc chạy được, và khiến vấn đề tổng thể bớt choáng ngợp hơn nhiều so với việc nhìn chằm chằm vào "dựng cả tính năng" cùng lúc.',
          ),
        }),

        mcq({
          prompt: B(
            'You see this error: ' + code("TypeError: Cannot read properties of undefined (reading 'name') at app.js:14") + 'What should you check FIRST?',
            'Bạn thấy lỗi sau: ' + code("TypeError: Cannot read properties of undefined (reading 'name') at app.js:14") + 'Bạn nên kiểm tra gì TRƯỚC TIÊN?',
          ),
          options: [
            B('Go to line 14, find the variable whose <code>.name</code> is being read — it is <code>undefined</code> there — and trace back where that variable should have been set', 'Vào dòng 14, tìm biến đang bị đọc <code>.name</code> — nó đang là <code>undefined</code> ở đó — rồi lần ngược lại xem đáng lẽ biến đó được gán ở đâu'),
            B('Ignore it entirely — TypeErrors phrased this way are always caused by a missing npm package', 'Bỏ qua nó hoàn toàn — kiểu TypeError viết thế này luôn do thiếu một gói npm nào đó'),
            B('Restart the whole computer; stack traces like this are usually just a stale cache problem', 'Khởi động lại toàn bộ máy tính; stack trace kiểu này thường chỉ là vấn đề cache cũ'),
            B('Simply delete line 14 outright, since removing the offending line removes the error message', 'Xoá thẳng dòng 14, vì xoá dòng gây lỗi thì thông báo lỗi cũng biến mất theo'),
          ],
          correct: 0,
          explanation: EX(
            'The error message and the line number ARE the clue: something at line 14 is <code>undefined</code> when the code expected an object with a <code>name</code> property. The fix always starts by reading the message literally and going to that exact spot, then walking backward to find why the value never got set.',
            'Thông báo lỗi và số dòng CHÍNH LÀ manh mối: có gì đó ở dòng 14 đang <code>undefined</code> trong khi mã lại mong nó là một object có thuộc tính <code>name</code>. Cách sửa luôn bắt đầu bằng đọc đúng nghĩa đen thông báo lỗi, tới đúng chỗ đó, rồi lần ngược lại xem vì sao giá trị chưa từng được gán.',
          ),
        }),

        mcq({
          prompt: B(
            'What is the standard Git workflow for adding a new feature to a shared project?',
            'Quy trình Git chuẩn để thêm một tính năng mới vào một dự án dùng chung là gì?',
          ),
          options: [
            B('Create a feature branch off <code>main</code>, commit your changes there, push the branch, open a Pull Request for review, then merge into <code>main</code>', 'Tạo một nhánh tính năng tách từ <code>main</code>, commit các thay đổi trên đó, push nhánh, mở một Pull Request để review, rồi merge vào <code>main</code>'),
            B('Commit directly on <code>main</code> and push right away; branches are only for experiments nobody intends to merge', 'Commit thẳng trên <code>main</code> rồi push ngay; nhánh chỉ dành cho thử nghiệm không ai định merge'),
            B('Email your changed files to a teammate instead of using any Git commands', 'Gửi email các file đã sửa cho đồng đội thay vì dùng lệnh Git nào cả'),
            B('Delete <code>main</code> and start a brand-new repository for every single feature', 'Xoá <code>main</code> và tạo một repository hoàn toàn mới cho mỗi tính năng'),
          ],
          correct: 0,
          explanation: EX(
            'Branch → commit → push → Pull Request → merge keeps <code>main</code> always deployable: your in-progress work lives on its own branch, and a Pull Request gives teammates a chance to review the diff before it lands on the branch everyone else builds on.',
            'Nhánh → commit → push → Pull Request → merge giữ cho <code>main</code> luôn ở trạng thái deploy được: công việc đang làm dở nằm trên nhánh riêng, và Pull Request cho đồng đội cơ hội review phần thay đổi trước khi nó vào nhánh mà mọi người khác đang dựa vào.',
          ),
        }),

        mcq({
          prompt: B(
            'A merge shows conflict markers in a file:' + code(
              "<<<<<<< HEAD\nconst tax = 0.08;\n=======\nconst tax = 0.1;\n>>>>>>> feature/tax-update",
            ) + 'What is the correct way to resolve it?',
            'Một lần merge để lại dấu xung đột trong file:' + code(
              "<<<<<<< HEAD\nconst tax = 0.08;\n=======\nconst tax = 0.1;\n>>>>>>> feature/tax-update",
            ) + 'Cách xử lý ĐÚNG là gì?',
          ),
          options: [
            B('Open the file, decide which value (or a combination of both) is correct, edit it into that final code, delete all the marker lines, then stage and commit', 'Mở file, quyết định giá trị nào (hoặc kết hợp cả hai) là đúng, sửa nó thành mã cuối cùng, xoá hết các dòng dấu xung đột, rồi stage và commit'),
            B('Delete the entire file so the conflict disappears from the merge', 'Xoá luôn toàn bộ file để xung đột biến mất khỏi lần merge'),
            B('Leave both marker blocks exactly as shown in the file and commit — Git resolves the rest automatically on push', 'Giữ nguyên cả hai khối dấu xung đột trong file và commit — Git sẽ tự xử lý phần còn lại khi push'),
            B('Run a force-push so whichever version is on the remote simply overwrites the other', 'Chạy force-push để bất kỳ phiên bản nào đang ở remote đơn giản là ghi đè lên phiên bản kia'),
          ],
          correct: 0,
          explanation: EX(
            'A conflict means Git could not decide for you — a human has to. The markers just show both versions side by side; you edit the file down to the one correct final version, remove <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>/<code>=======</code>/<code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> entirely, then <code>git add</code> and commit like any normal change. Leaving the markers in ships broken code — the file would no longer even be valid syntax.',
            'Xung đột nghĩa là Git không tự quyết được — cần con người quyết. Các dấu chỉ đơn giản là hiển thị song song cả hai phiên bản; bạn sửa file thành đúng một phiên bản cuối cùng, xoá sạch <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>/<code>=======</code>/<code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>, rồi <code>git add</code> và commit như một thay đổi bình thường. Để nguyên các dấu đó là đưa mã hỏng lên — file thậm chí không còn đúng cú pháp nữa.',
          ),
        }),
      ],
    },
  ],
};
