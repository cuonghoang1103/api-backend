/**
 * Authentication — Progress Test 1 (Mục 0 → Chương 4).
 *
 * Đề tự soạn, bám sát `content/courses/authentication/s00-intro.mjs` …
 * `s04-jwt.mjs`. 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi.
 *
 * ⚠️ MỌI con số, mọi chuỗi băm, mọi độ dài và mọi mã lỗi trong đề này đều được
 * ĐO THẬT trên **Node.js v22.21.0** (macOS, darwin arm64, 10/09/2026), chỉ bằng
 * `node:crypto` và `node:http` — không gói ngoài nào, không gọi ra Internet,
 * không đụng `.env`, không đụng cơ sở dữ liệu. Mọi "khoá" trong đề hoặc sinh
 * tại chỗ bằng `generateKeyPairSync` rồi vứt đi, hoặc là chuỗi GIẢ ghi rõ là
 * giả. Không có khối PEM nào được in ra — đề chỉ mô tả bằng lời.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ SÁU CHỖ MÁY KHÁC GIÁO TRÌNH (đo lại 10/09/2026, đề THEO MÁY)
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. Bài 2.2 gọi `crypto.scrypt(pw, salt, 64, { N: 2**15, r: 8, p: 1 })` mà
 *    KHÔNG đặt `maxmem`, rồi trình bày nó như một cấu hình chạy được. Trên
 *    Node 22 lệnh đó NÉM ngay:
 *        ERR_CRYPTO_INVALID_SCRYPT_PARAMS
 *        Invalid scrypt params: error:030000AC:digital envelope routines::
 *        memory limit exceeded
 *    Lý do: 128·N·r = 128 × 32768 × 8 = 33.554.432 byte = ĐÚNG 32 MiB, mà trần
 *    `maxmem` mặc định cũng đúng 32 MB. Thêm `maxmem: 64 * 1024 * 1024` thì
 *    chạy. Câu 11 hỏi đúng chỗ này và theo MÁY.
 *
 * 2. Bài 2.3 nói `Buffer.from('mật'.normalize('NFD'), 'utf8').length` là 8.
 *    Đo thật: **7**. (NFC là 5 byte / 3 code point, NFD là 7 byte / 5 code
 *    point — ba con số kia trong bài đều đúng, chỉ con số 8 là sai.) Câu 16
 *    in nguyên bốn số đo thật.
 *
 * 3. Bài 2.2 nói `'mật khẩu rất dài của tôi'` dài 33 byte UTF-8. Đo thật:
 *    **34** byte / 24 ký tự. Đề không hỏi con số ấy (câu 14 hỏi cơ chế), nhưng
 *    ghi lại ở đây để người sau khỏi đo lại.
 *
 * 4. Bài 1.2 gọi `Math.random().toString(36).slice(2)` là "chuỗi mười một ký
 *    tự", và chính ví dụ nó in ra — `k3f9a1x7bqz2` — dài **12**. Đo 200.000
 *    lượt trên Node 22: độ dài trải từ 7 tới 14, trong đó 11 ký tự chỉ chiếm
 *    70,6% (141.180 lượt), 10 ký tự 26,3%, 12 ký tự 2,4%. Câu 5 dùng đúng bảng
 *    đo này.
 *
 * 5. Bài 1.4 in `1b4f0e9851971998e732078544c96b36c3d01cedf7caa332359d6f1d835
 *    67014` là kết quả của `sha256('xin chao')`. Đo thật:
 *    `f9b197ffdaa45e4fb217f865fe3a2bd8efab8d0a3faf6eb8acb04564decd0b27`.
 *    Đề không hỏi giá trị băm của chuỗi đó.
 *
 * 6. Bài 2.1, khối `GROUP BY bam` được giới thiệu là một bảng băm SHA-256,
 *    nhưng hàng giữa — `e10adc3949ba59abbe56e057f20f883e…` — là **MD5 của
 *    '123456'**, không phải SHA-256 của gì cả; mà hàng đầu `8d969eef…` ĐÃ là
 *    SHA-256 của đúng chuỗi '123456'. Hàng ba `5e884898da28047151d0e56f8dc
 *    62927…` thì đúng: SHA-256 của 'password'. Nghĩa là bảng ấy có một hàng
 *    MD5 lọt vào giữa hai hàng SHA-256, và nó trùng mật khẩu với hàng đầu. Ý
 *    của bài (không muối thì mật khẩu giống nhau ra băm giống nhau) vẫn đúng;
 *    chỉ dữ liệu minh hoạ là sai. Câu 12 hỏi cơ chế, không hỏi dãy hex.
 *
 * Ngoài ra, bài 4.1 nói token mẫu dài 268 ký tự và in payload có khoá `role`.
 * Đo thật: token ấy dài **235** ký tự (36 + 154 + 43) và khoá là `vaiTro`.
 * Chỗ này đã ghi trong `AUTHENTICATION-FE.mjs`; đề PT1 đúc token của riêng nó.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh dưới đây):
 *     { '0': 7, '1': 8, '2': 8, '3': 7 }   → A 7 · B 8 · C 8 · D 7
 *
 *   node -e "import('./content/exams/AUTHENTICATION-PT1.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Hai câu lập trình đều CHẠY THẬT và khớp `expectedOutput` từng dòng; cả hai
 * đã chạy ba lượt rồi diff để chắc kết quả không phụ thuộc thời gian hay số
 * cổng. Câu 32 dựng máy chủ `node:http` thật và gọi chính nó bằng `fetch`, nên
 * nó **`closeAllConnections()` trước `close()`** — thiếu dòng đó thì tiến trình
 * treo vì `fetch` của Node giữ keep-alive.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/AUTHENTICATION-PT1.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/authentication-exam-kit.mjs';

export default {
  course: { slug: 'authentication' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Section 0 to Chapter 4 (credentials, passwords, sessions, JWT)',
        'Kiểm tra tiến độ 1 — Mục 0 đến Chương 4 (tín vật, mật khẩu, phiên, JWT)',
      ),
      description: B(
        'The first third of the Authentication course: the three gates hiding in the word "login", the primitives under every credential, password storage, server-side sessions and cookies, and JWT from the inside. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba đầu của khoá Authentication: ba cái cổng trốn trong chữ "đăng nhập", những nguyên hàm nằm dưới mọi tín vật, cách cất mật khẩu, phiên phía máy chủ và cookie, và mổ JWT từ bên trong. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '0–4'),
      questions: [
        // ── Mục 0 — Bài toán ────────────────────────────────────────────
        mcq({
          prompt: B(
            'A product already asks for a password. Which of these additions makes the login genuinely <b>two-factor</b>?',
            'Một sản phẩm đã bắt nhập mật khẩu. Thêm thứ nào sau đây thì cái đăng nhập mới THẬT SỰ là <b>hai yếu tố</b>?',
          ),
          options: [
            B(
              'A second password, asked on the next screen — two independent secrets are two factors',
              'Một mật khẩu thứ hai, hỏi ở màn hình kế tiếp — hai bí mật độc lập là hai yếu tố',
            ),
            B(
              'A security question, because only the account holder knows their mother\'s maiden name',
              'Một câu hỏi bảo mật, vì chỉ chủ tài khoản mới biết tên thời con gái của mẹ mình',
            ),
            B(
              'A six-digit code from an authenticator app on the user\'s phone',
              'Mã sáu chữ số từ ứng dụng xác thực trên điện thoại của người dùng',
            ),
            B(
              'A check that the request came from the same IP address as the last successful login',
              'Một phép kiểm rằng request đến từ đúng địa chỉ IP của lần đăng nhập thành công gần nhất',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A factor is a <b>category</b> of proof, not an instance: know, have, are. Two passwords are two things you know, and one keylogger or one phishing page takes both. A security question is a password with a much smaller keyspace — guessable, public on social media, identical across every site that asks, and unchangeable after a breach, which is why NIST SP 800-63B forbids it as an authenticator. An IP address is a signal worth scoring on, never proof: carrier NAT puts thousands of phones behind one address, and a laptop moving from wifi to 4G changes address mid-session. The authenticator code is the only one that requires the attacker to have a different thing.',
            'Một YẾU TỐ là một <b>loại</b> bằng chứng, không phải một thể hiện: biết, có, là. Hai mật khẩu đều là thứ bạn BIẾT, và một cái keylogger hay một trang lừa đảo lấy được cả hai. Câu hỏi bảo mật là một mật khẩu với không gian khoá nhỏ hơn nhiều — đoán được, nằm công khai trên mạng xã hội, giống hệt nhau ở mọi trang có hỏi, và không đổi được sau khi rò rỉ; đó là lý do NIST SP 800-63B cấm hẳn nó. Địa chỉ IP là một tín hiệu để chấm rủi ro, không bao giờ là bằng chứng: NAT của nhà mạng nhét hàng nghìn điện thoại sau một địa chỉ, còn máy tính chuyển từ wifi sang 4G là đổi địa chỉ giữa chừng. Chỉ mã của ứng dụng xác thực mới bắt kẻ tấn công phải CÓ một thứ khác.',
          ),
        }),

        mcq({
          prompt: B(
            'The twenty-line login in Lesson 0.3 mints its session id like this. What exactly does that hand an attacker?' + code(
              "const session = await prisma.session.create({\n" +
              '  data: { id: String(Date.now()), userId: u.id },\n' +
              '});',
            ),
            'Cái đăng nhập hai mươi dòng ở bài 0.3 đúc mã phiên như sau. Nó trao chính xác cái gì cho kẻ tấn công?' + code(
              "const session = await prisma.session.create({\n" +
              '  data: { id: String(Date.now()), userId: u.id },\n' +
              '});',
            ),
          ),
          options: [
            B(
              'Nothing yet — the value is unique per session, and uniqueness is what a session id needs',
              'Chưa gì cả — giá trị này là duy nhất cho mỗi phiên, mà duy nhất chính là thứ một mã phiên cần',
            ),
            B(
              'A search space of a few thousand candidates: the attacker who knows roughly when you logged in guesses to the millisecond',
              'Một không gian tìm kiếm chỉ vài nghìn ứng viên: kẻ biết bạn đăng nhập vào khoảng lúc nào thì dò tới từng mili-giây',
            ),
            B(
              'A collision risk: two users logging in during the same millisecond receive the same session',
              'Nguy cơ đụng độ: hai người đăng nhập trong cùng một mili-giây sẽ nhận cùng một phiên',
            ),
            B(
              'A timing side channel, because comparing two timestamps with <code>===</code> returns early',
              'Một kênh rò rỉ thời gian, vì so hai dấu thời gian bằng <code>===</code> sẽ thoát sớm',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A session id is a bearer credential: whoever holds it <em>is</em> you. <code>Date.now()</code> is public knowledge with about thirteen digits of which only the last few are unknown — post something, note the timestamp, and the login that followed it is inside a window a few thousand milliseconds wide. Collisions are a real but separate bug, and they are the smaller one. The rule from Lesson 1.2 is the fix: a CSPRNG and at least 128 bits, which is <code>randomBytes(16)</code> and costs nothing.',
            'Mã phiên là một tín vật mang theo: ai cầm nó thì người đó LÀ bạn. <code>Date.now()</code> là thứ ai cũng biết, mười ba chữ số mà chỉ vài chữ số cuối là ẩn — đăng một bài, ghi lại dấu thời gian, thì cú đăng nhập ngay sau đó nằm trong một cửa sổ rộng vài nghìn mili-giây. Đụng độ là một con lỗi thật nhưng khác chuyện, và nó là con nhỏ hơn. Luật ở bài 1.2 mới là cách sửa: dùng CSPRNG và tối thiểu 128 bit, tức <code>randomBytes(16)</code>, và nó chẳng tốn gì.',
          ),
        }),

        mcq({
          prompt: B(
            'The same twenty-line login sends its credential in a custom header, ' + c('x-session') + ', read back with ' + c("req.headers['x-session']") + '. Lesson 0.3 counts that as one of the six problems. Which problem is it?',
            'Cũng cái đăng nhập hai mươi dòng ấy gửi tín vật trong một header tự chế, ' + c('x-session') + ', đọc lại bằng ' + c("req.headers['x-session']") + '. Bài 0.3 đếm đó là một trong sáu vấn đề. Nó là vấn đề nào?',
          ),
          options: [
            B(
              'A custom header is not encrypted by TLS the way a cookie is, so the value travels in the clear',
              'Header tự chế không được TLS mã hoá như cookie, nên giá trị đi trần trên đường dây',
            ),
            B(
              'Browsers strip unknown <code>x-</code> headers, so the credential never reaches the server at all',
              'Trình duyệt cắt bỏ mọi header <code>x-</code> lạ, nên tín vật không bao giờ tới được máy chủ',
            ),
            B(
              'The browser will not attach it automatically, so a real front end must keep it in JavaScript — and one XSS reads it',
              'Trình duyệt không tự đính nó vào, nên một front end thật buộc phải giữ nó trong JavaScript — và một lỗ XSS là đọc được',
            ),
            B(
              'A header cannot carry the <code>HttpOnly</code> attribute, so CSRF becomes possible on every endpoint',
              'Header không mang được thuộc tính <code>HttpOnly</code>, nên CSRF thành khả dĩ ở mọi endpoint',
            ),
          ],
          correct: 2,
          explanation: EX(
            'TLS covers the whole request including every header, so encryption is not the issue, and nothing strips <code>x-session</code>. The issue is where the value has to live: cookies are attached by the browser, a custom header is attached by your code, and code that attaches a header must be able to read the value — from <code>localStorage</code>, or from a variable. That is Chapter 4.5\'s trade-off in miniature. The mirror image is worth stating too: because the browser does <em>not</em> attach it automatically, a bearer header is immune to CSRF, which is the genuine advantage on the other side of the trade.',
            'TLS bọc cả request kể cả mọi header, nên chuyện mã hoá không phải vấn đề, và cũng chẳng ai cắt bỏ <code>x-session</code>. Vấn đề nằm ở chỗ giá trị ấy PHẢI sống ở đâu: cookie do trình duyệt tự đính, còn header tự chế thì do mã của bạn đính, mà mã muốn đính được thì phải ĐỌC được giá trị — từ <code>localStorage</code>, hoặc từ một biến. Đó chính là sự đánh đổi ở bài 4.5, thu nhỏ lại. Mặt gương cũng đáng nói: chính vì trình duyệt KHÔNG tự đính, một header mang tín vật miễn nhiễm với CSRF — đó là cái lợi thật nằm ở phía bên kia của sự đánh đổi.',
          ),
        }),

        // ── Chương 1 — Tín vật và nguyên hàm ────────────────────────────
        mcq({
          prompt: B(
            'A password reset link is built as ' + c('https://vidu.com/reset?token=abc123') + '. The token is 256 random bits, single use, and expires in fifteen minutes. Which statement about the remaining risk is correct?',
            'Một đường dẫn đặt lại mật khẩu được dựng thành ' + c('https://vidu.com/reset?token=abc123') + '. Token dài 256 bit ngẫu nhiên, dùng một lần, hết hạn sau mười lăm phút. Phát biểu nào về phần rủi ro CÒN LẠI là đúng?',
          ),
          options: [
            B(
              'The risk is collisions: at 256 bits two users can be issued the same reset token within the same window',
              'Rủi ro là đụng độ: ở 256 bit, hai người dùng có thể nhận cùng một token đặt lại trong cùng một cửa sổ',
            ),
            B(
              '256 bits and a fifteen-minute expiry remove the risk: nothing can be guessed and nothing survives long enough to matter',
              '256 bit cộng mười lăm phút là đủ để hết rủi ro: không đoán được gì, và cũng chẳng thứ gì sống đủ lâu để thành chuyện',
            ),
            B(
              'The risk is that HTTPS does not encrypt the query string, so anyone on the network path reads the token',
              'Rủi ro là HTTPS không mã hoá query string, nên ai nằm trên đường mạng cũng đọc được token',
            ),
            B(
              'A value in the query string reaches browser history, the <code>Referer</code> sent to third-party scripts, access logs, proxy and CDN logs, and any chat app that fetched a link preview',
              'Giá trị nằm trong query string đi vào lịch sử trình duyệt, header <code>Referer</code> gửi tới mọi script bên thứ ba trên trang, log truy cập, log của proxy và CDN, và cả ứng dụng chat nào vừa tải trước để dựng khung xem thử',
            ),
          ],
          correct: 3,
          explanation: EX(
            'TLS does encrypt the whole URL on the wire, and at 128 bits the birthday bound already puts a collision around 2^64 tokens — roughly six hundred million years at a thousand a second. Neither is the problem. The problem is that a URL is <em>copied</em> by five systems you do not control, all of which log or replay it, and single use plus a short expiry is exactly the mitigation Chapter 6 builds: land on the page, consume the token into a POST immediately, and keep the window short so the link preview that already fetched it has spent it rather than leaked a live one.',
            'TLS có mã hoá toàn bộ URL trên đường dây, còn ở 128 bit thì cận sinh nhật đã đẩy khả năng đụng độ tới quanh 2^64 token — cỡ sáu trăm triệu năm nếu mỗi giây sinh một nghìn cái. Không cái nào trong hai cái đó là vấn đề. Vấn đề là một URL bị NĂM hệ thống bạn không kiểm soát SAO CHÉP lại, và hệ thống nào cũng ghi log hoặc gọi lại nó. Dùng-một-lần cộng hạn ngắn chính là biện pháp mà chương 6 dựng: vào tới trang là tiêu thụ token ngay bằng một POST, và giữ cửa sổ thật ngắn để cái khung xem thử vừa tải trước đó tiêu mất token chứ không rò ra một cái còn sống.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 1.2 calls ' + c("Math.random().toString(36).slice(2)") + ' an "eleven-character string". Measured on Node 22 over 200,000 draws:' + code(
              '{"7":1,"8":41,"9":1438,"10":52525,"11":141180,"12":4719,"13":95,"14":1}\n' +
              '   length: 7  8    9     10     11      12    13  14',
            ) + 'What does the measurement change, and what does it not?',
            'Bài 1.2 gọi ' + c("Math.random().toString(36).slice(2)") + ' là "chuỗi mười một ký tự". Đo thật trên Node 22 với 200.000 lượt:' + code(
              '{"7":1,"8":41,"9":1438,"10":52525,"11":141180,"12":4719,"13":95,"14":1}\n' +
              '   độ dài: 7  8    9     10     11      12    13  14',
            ) + 'Phép đo thay đổi điều gì, và KHÔNG thay đổi điều gì?',
          ),
          options: [
            B(
              'The length varies from 7 to 14 and only 70.6% of draws are eleven characters — but the length was never the security anyway, because the generator is not cryptographic',
              'Độ dài trải từ 7 tới 14 và chỉ 70,6% số lượt ra mười một ký tự — nhưng độ dài xưa nay chưa từng là phần an toàn, vì bộ sinh vốn không phải bộ sinh mật mã',
            ),
            B(
              'The varying length is the vulnerability: a shorter string carries fewer bits, so those sessions are the ones an attacker targets first',
              'Chính độ dài thay đổi mới là lỗ hổng: chuỗi ngắn hơn mang ít bit hơn, nên đúng những phiên đó là thứ kẻ tấn công nhắm trước',
            ),
            B(
              'Nothing changes: base-36 encodes about 5.17 bits per character, so an eleven-character string is 56.9 bits either way',
              'Không có gì đổi: cơ số 36 mã hoá khoảng 5,17 bit mỗi ký tự, nên chuỗi mười một ký tự vẫn là 56,9 bit',
            ),
            B(
              'The distribution proves the generator is biased, and that bias is what makes the internal state recoverable',
              'Phân bố này chứng minh bộ sinh bị lệch, và chính cái lệch đó làm khôi phục được trạng thái nội bộ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The lengths differ because <code>toString(36)</code> prints a double\'s fractional part and drops trailing zeros; the very short draws are values that happened to land on a short expansion. That is a documentation error in the lesson, and the lesson\'s own example — <code>k3f9a1x7bqz2</code> — is twelve characters, not eleven. It changes nothing about the security, and that is the point of the question: the effective security is <b>zero</b> regardless of length, because V8\'s xorshift128+ is a deterministic sequence whose whole internal state is recoverable from a handful of consecutive outputs, and ECMA-262 §21.4.2.29 says outright that it "must not be used for cryptographic purposes". Counting characters is how people talk themselves into believing an id is strong.',
            'Độ dài lệch nhau vì <code>toString(36)</code> in phần thập phân của một số double rồi bỏ các số 0 ở đuôi; những lượt ngắn nhất là các giá trị tình cờ rơi vào khai triển ngắn. Đó là một lỗi tài liệu trong bài học, và chính ví dụ bài in ra — <code>k3f9a1x7bqz2</code> — dài mười hai ký tự chứ không phải mười một. Nó KHÔNG đổi gì về mặt an toàn, và đó mới là ý của câu hỏi: an toàn thực tế bằng <b>không</b> bất kể dài ngắn, vì xorshift128+ của V8 là một dãy tất định mà toàn bộ trạng thái nội bộ khôi phục được từ vài giá trị xuất liên tiếp, và ECMA-262 §21.4.2.29 nói thẳng rằng nó "không được dùng cho mục đích mật mã". Đi đếm ký tự chính là cách người ta tự thuyết phục mình rằng một cái mã là mạnh.',
          ),
        }),

        mcq({
          prompt: B(
            'A Stripe key was committed to a private repository three months ago. The developer runs ' + c('git rm --cached .env') + ' and commits the removal. What is the state of the secret?',
            'Một khoá Stripe đã bị commit vào một kho riêng tư ba tháng trước. Lập trình viên chạy ' + c('git rm --cached .env') + ' rồi commit lệnh xoá đó. Bí mật ấy giờ ở trạng thái nào?',
          ),
          options: [
            B(
              'Removed: the file no longer exists in the working tree, and a private repository was never readable by anyone outside the team',
              'Đã gỡ: file không còn trong cây làm việc, mà kho riêng tư thì xưa nay người ngoài nhóm có đọc được đâu',
            ),
            B(
              'Removed once <code>.gitignore</code> is updated, because ignoring the path retroactively excludes it from history',
              'Sẽ gỡ xong khi cập nhật <code>.gitignore</code>, vì bỏ qua đường dẫn đó là loại nó khỏi lịch sử về sau lẫn về trước',
            ),
            B(
              'Still readable: <code>git show &lt;commit&gt;:.env</code> prints it, and rewriting history does not reach clones, forks, CI caches or dangling commits — rotation at the provider is the only fix',
              'Vẫn đọc được: <code>git show &lt;commit&gt;:.env</code> in ra nguyên xi, và viết lại lịch sử cũng không với tới các bản clone, fork, cache của CI hay commit mồ côi — xoay khoá ở phía nhà cung cấp mới là cách sửa duy nhất',
            ),
            B(
              'Still present but harmless, because a key that no longer appears in <code>HEAD</code> cannot be found by secret scanners',
              'Vẫn còn nhưng vô hại, vì một khoá không còn xuất hiện ở <code>HEAD</code> thì máy quét bí mật không tìm ra',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Git keeps every version it ever saw. <code>git log --all -S"sk_live_" -- .env</code> finds the commit and <code>git show</code> prints the value; secret scanners look at history precisely because that is where secrets hide. Even <code>git filter-repo</code> only rewrites <em>your</em> copy — every clone, fork, CI cache and GitHub\'s dangling-commit view may still hold it. Treat the secret as public from the moment of the push: revoke it at the provider, issue a new one, and then add <code>gitleaks protect --staged</code> as a pre-commit hook with <code>gitleaks detect</code> in CI as the backstop for whoever skipped the hook.',
            'Git giữ lại mọi phiên bản nó từng thấy. <code>git log --all -S"sk_live_" -- .env</code> tìm ra đúng commit và <code>git show</code> in ra nguyên giá trị; máy quét bí mật soi lịch sử chính vì bí mật nấp ở đó. Ngay cả <code>git filter-repo</code> cũng chỉ viết lại BẢN CỦA BẠN — mọi bản clone, fork, cache CI và cả khung xem commit mồ côi của GitHub đều có thể còn giữ. Hãy coi bí mật ấy là công khai kể từ lúc push: thu hồi ở phía nhà cung cấp, phát khoá mới, rồi cắm <code>gitleaks protect --staged</code> làm hook trước commit và <code>gitleaks detect</code> trong CI làm lưới đỡ cho ai lỡ bỏ qua hook.',
          ),
        }),

        mcq({
          prompt: B(
            'This helper compares two secrets of unknown, possibly different, lengths. Why is the HMAC there rather than a plain <code>sha256</code>?' + code(
              "const sessionKey = randomBytes(32);   // per-process, never persisted\n\n" +
              'function equalsCT(a, b) {\n' +
              "  const ha = createHmac('sha256', sessionKey).update(a).digest();\n" +
              "  const hb = createHmac('sha256', sessionKey).update(b).digest();\n" +
              '  return timingSafeEqual(ha, hb);      // always 32 bytes\n' +
              '}',
            ),
            'Hàm phụ này so hai bí mật có độ dài chưa biết, và có thể khác nhau. Vì sao ở đây là HMAC chứ không phải <code>sha256</code> trần?' + code(
              "const sessionKey = randomBytes(32);   // mỗi tiến trình một khoá, không lưu\n\n" +
              'function equalsCT(a, b) {\n' +
              "  const ha = createHmac('sha256', sessionKey).update(a).digest();\n" +
              "  const hb = createHmac('sha256', sessionKey).update(b).digest();\n" +
              '  return timingSafeEqual(ha, hb);      // luôn 32 byte\n' +
              '}',
            ),
          ),
          options: [
            B(
              'HMAC is slower than a bare hash, and the extra cost is what makes the comparison constant time',
              'HMAC chậm hơn băm trần, và chính phần tốn thêm đó làm phép so trở thành hằng thời gian',
            ),
            B(
              'With a plain hash the attacker can compute the digest of any candidate offline and mount the same attack against the digest; keying it with a value they do not know removes that',
              'Với băm trần, kẻ tấn công tính được digest của mọi ứng viên ở ngoại tuyến rồi đánh y hệt vào digest; khoá nó bằng một giá trị họ không biết là dập tắt đường đó',
            ),
            B(
              'A plain <code>sha256</code> digest is not a fixed 32 bytes, so <code>timingSafeEqual</code> would still throw on a length mismatch',
              'Digest của <code>sha256</code> trần không cố định 32 byte, nên <code>timingSafeEqual</code> vẫn ném lỗi khi hai bên lệch độ dài',
            ),
            B(
              'HMAC prevents length extension, which is the attack a comparison function has to defend against',
              'HMAC chặn được length extension, đúng cú tấn công mà một hàm so sánh phải chống',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Both constructions produce exactly 32 bytes, so the length problem is solved either way — that is what the double-hash pattern buys, and it is why the wrapper never has to branch on length. The key is there for a different reason: a plain <code>sha256</code> is a public function, so an attacker who suspects a candidate can hash it themselves and go back to attacking the digest byte by byte. A random per-process key they cannot see makes both sides unpredictable, so the comparison reveals nothing beyond equality. Length extension is real (Lesson 1.4) but it is an attack on a homemade MAC, not on a comparison. And note what <code>timingSafeEqual</code> itself does: fed buffers of different lengths it throws <code>ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH</code>, which is exactly why the pattern normalises the length first.',
            'Cả hai cách đều cho ra đúng 32 byte, nên chuyện độ dài giải quyết xong ở cả hai đường — đó chính là thứ mẫu băm-hai-lần mua được, và là lý do hàm bọc không bao giờ phải rẽ nhánh theo độ dài. Cái khoá ở đó vì một lý do khác: <code>sha256</code> trần là một hàm công khai, nên kẻ tấn công nghi một ứng viên nào đó thì tự băm lấy rồi quay lại đánh vào digest từng byte một. Một khoá ngẫu nhiên riêng cho mỗi tiến trình mà họ không nhìn thấy làm cả hai vế trở nên không đoán được, nên phép so không tiết lộ gì ngoài chuyện bằng hay không. Length extension là chuyện có thật (bài 1.4) nhưng nó đánh vào một cái MAC tự chế, không đánh vào phép so sánh. Và để ý chính <code>timingSafeEqual</code>: đưa hai buffer khác độ dài thì nó NÉM <code>ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH</code> — đó đúng là lý do mẫu này chuẩn hoá độ dài trước.',
          ),
        }),

        mcq({
          prompt: B(
            'Sessions are stored as ' + c('tokenHash = sha256(token)') + ' and looked up by that column. Passwords in the same database are stored with Argon2id. Why is a fast hash correct in one case and catastrophic in the other?',
            'Phiên được cất dưới dạng ' + c('tokenHash = sha256(token)') + ' rồi tra cứu theo đúng cột đó. Mật khẩu trong cùng cơ sở dữ liệu ấy thì cất bằng Argon2id. Vì sao một hàm băm NHANH lại đúng ở ca này và thảm hoạ ở ca kia?',
          ),
          options: [
            B(
              'Because the session token is compared by an index lookup while the password is compared in application code, and only the second one leaks timing',
              'Vì token phiên được so bằng tra cứu chỉ mục còn mật khẩu thì so trong mã ứng dụng, và chỉ cái thứ hai mới rò rỉ thời gian',
            ),
            B(
              'Because session tokens are short-lived, so even a cracked one expires before the attacker can use it',
              'Vì token phiên sống ngắn, nên có bẻ ra được thì nó cũng hết hạn trước khi kẻ tấn công kịp dùng',
            ),
            B(
              'Because a session token is 256 bits from a CSPRNG, so there is no search space to brute-force; a password is low-entropy and human-chosen, so the only defence is making each guess expensive',
              'Vì token phiên là 256 bit từ CSPRNG nên không có không gian nào để dò cạn; còn mật khẩu thì entropy thấp và do người chọn, nên phòng thủ duy nhất là làm mỗi lần đoán đắt lên',
            ),
            B(
              'Because Argon2id embeds its own salt while <code>sha256</code> does not, and a salt is what a session token would need',
              'Vì Argon2id tự nhúng muối còn <code>sha256</code> thì không, mà muối chính là thứ một token phiên cần',
            ),
          ],
          correct: 2,
          explanation: EX(
            'It is entirely about the input space. Cracking <code>sha256</code> of a 256-bit random token means searching 2^256 values, which no cost parameter improves on. Cracking <code>sha256</code> of a human password means running a wordlist at roughly twenty billion hashes a second on one GPU, which is where the whole of Chapter 2 comes from. A per-user salt on a session token would buy nothing, because there are no duplicates to hide and no rainbow table for random 32-byte values. The same reasoning is why the storage shape is worth it: a leaked backup then contains hashes rather than a list of live sessions, and there is no comparison left in your code for a later refactor to get wrong.',
            'Chuyện nằm trọn ở KHÔNG GIAN ĐẦU VÀO. Bẻ <code>sha256</code> của một token ngẫu nhiên 256 bit nghĩa là dò 2^256 giá trị, và không tham số chi phí nào cải thiện được điều đó. Bẻ <code>sha256</code> của một mật khẩu do người đặt nghĩa là quét một wordlist ở cỡ hai mươi tỉ phép băm mỗi giây trên MỘT cái GPU — cả chương 2 sinh ra từ đúng con số ấy. Bỏ muối cho token phiên chẳng mua được gì, vì làm gì có trùng lặp nào để giấu và cũng chẳng có bảng cầu vồng nào cho các giá trị 32 byte ngẫu nhiên. Cùng lối lập luận đó cho thấy vì sao hình dạng lưu trữ này đáng làm: một bản sao lưu rò ra thì chứa băm chứ không phải danh sách phiên còn sống, và trong mã của bạn không còn phép so sánh nào để một lần tái cấu trúc sau này làm hỏng.',
          ),
        }),

        mcq({
          prompt: B(
            'Four services — auth, api, worker and billing, the last one built by an outside contractor — all verify the same HS256 token with the same secret <code>S</code>. What is the concrete consequence, and what is the fix?',
            'Bốn dịch vụ — auth, api, worker và billing, cái cuối do một nhà thầu bên ngoài làm — đều kiểm cùng một token HS256 bằng cùng bí mật <code>S</code>. Hệ quả cụ thể là gì, và sửa thế nào?',
          ),
          options: [
            B(
              'With a MAC the same key both makes and checks, so any one of the four — including the contractor — can mint a token saying <code>role: ADMIN</code>; publish a public key and keep the private one at the issuer instead',
              'Với MAC thì cùng một khoá vừa TẠO vừa KIỂM, nên bất kỳ ai trong bốn cái — kể cả nhà thầu — đều đúc được token nói <code>role: ADMIN</code>; hãy công bố khoá công và giữ khoá riêng ở đúng nơi phát hành',
            ),
            B(
              'Nothing is wrong: verification needs the key, so sharing it with verifiers is exactly what the design requires',
              'Chẳng có gì sai: muốn kiểm thì phải có khoá, nên chia khoá cho các bên kiểm đúng là thứ thiết kế này đòi hỏi',
            ),
            B(
              'The risk is key exhaustion: four services signing with one secret produce enough material to recover it, which is why each needs its own',
              'Rủi ro là bào mòn khoá: bốn dịch vụ cùng ký bằng một bí mật sẽ tạo đủ dữ liệu để khôi phục nó, nên mỗi bên cần một khoá riêng',
            ),
            B(
              'The risk is replay across services, and the fix is to give every service a distinct <code>aud</code> value while keeping the shared secret',
              'Rủi ro là phát lại giữa các dịch vụ, và cách sửa là cho mỗi dịch vụ một giá trị <code>aud</code> riêng mà vẫn giữ chung bí mật',
            ),
          ],
          correct: 0,
          explanation: EX(
            'HMAC is symmetric: the ability to verify <em>is</em> the ability to issue. That turns one vulnerability in any of the four into system-wide token forgery, and it hands the billing contractor the power to grant themselves admin. Nothing about the secret wears out. A distinct <code>aud</code> per service is a genuinely good idea from Lesson 4.3 and it stops replay <em>between</em> services, but it does not stop a key holder minting a token with whatever <code>aud</code> they like. The structural fix is asymmetric: the issuer signs with a private key, everyone else verifies with the public key published at a JWKS URL, and verification then needs no secret at all. HS256 stays correct in exactly one case — a single process that both signs and verifies.',
            'HMAC là đối xứng: khả năng KIỂM chính LÀ khả năng PHÁT. Điều đó biến một lỗ hổng ở bất kỳ cái nào trong bốn thành giả mạo token toàn hệ thống, và trao cho nhà thầu billing quyền tự cấp mình vai admin. Còn khoá thì chẳng bao giờ "mòn" cả. Cho mỗi dịch vụ một <code>aud</code> riêng là ý hay thật, đúng bài 4.3, và nó chặn được phát lại GIỮA các dịch vụ — nhưng nó không chặn nổi một người đang cầm khoá đúc ra token với <code>aud</code> tuỳ thích. Cách sửa về mặt cấu trúc là bất đối xứng: nơi phát hành ký bằng khoá riêng, mọi bên còn lại kiểm bằng khoá công đăng ở một địa chỉ JWKS, và lúc đó việc kiểm không cần một bí mật nào. HS256 chỉ còn đúng ở đúng một ca: một tiến trình vừa ký vừa kiểm.',
          ),
        }),

        mcq({
          prompt: B(
            'A team adds a redaction list to its logger — <code>req.headers.cookie</code>, <code>req.headers.authorization</code>, <code>req.body.password</code> — and considers logging solved. Which reading is right?',
            'Một nhóm thêm danh sách che vào bộ ghi log — <code>req.headers.cookie</code>, <code>req.headers.authorization</code>, <code>req.body.password</code> — rồi coi như xong chuyện log. Cách hiểu nào đúng?',
          ),
          options: [
            B(
              'Solved: those three paths are where every credential in an HTTP request lives, and the logger applies them to every line it writes, so nothing further has to be done at any call site',
              'Xong thật: ba đường dẫn ấy là chỗ ở của mọi tín vật trong một request HTTP, và bộ ghi log áp chúng lên mọi dòng nó viết ra, nên chẳng còn gì phải làm ở từng chỗ gọi nữa',
            ),
            B(
              'It is harmful, because redaction rewrites the log line and breaks correlation between two requests: with the value censored there is no longer anything to join on when an incident needs the two halves of one session put back together',
              'Đó là việc có hại, vì che dữ liệu làm viết lại dòng log và phá mất khả năng nối hai request với nhau: giá trị đã bị che thì lúc điều tra sự cố không còn gì để ghép hai nửa của cùng một phiên lại',
            ),
            B(
              'It is unnecessary work: log files sit on a disk only the operations team can read, and that team already has database access, so nothing in a log line tells them anything they could not look up directly',
              'Đó là việc thừa: file log nằm trên đĩa mà chỉ đội vận hành mới đọc được, mà đội đó vốn đã có quyền vào cơ sở dữ liệu, nên chẳng dòng log nào nói với họ thứ gì họ không tự tra được',
            ),
            B(
              'It is the right mechanism in the wrong direction — a deny-list will miss <code>pwd</code>, <code>newPassword</code> or <code>mat_khau</code>, and an axios error still carries <code>err.config.headers</code>; an allow-list of fields you decided are safe fails closed instead',
              'Đúng cơ chế nhưng ngược chiều — danh sách CẤM sẽ sót <code>pwd</code>, <code>newPassword</code> hay <code>mat_khau</code>, và một lỗi của axios vẫn mang theo <code>err.config.headers</code>; danh sách CHO PHÉP những trường bạn đã quyết là an toàn thì hỏng theo hướng ĐÓNG',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Redacting at the logger rather than at each call site is exactly right — the mistake is the direction. A deny-list has to enumerate every name a credential might arrive under, in every language the team writes in, forever. The sneakiest source is not a field you forgot but a whole object you passed: serialising an axios error serialises <code>err.config.headers</code> with the <code>Authorization</code> of the failed request in it. And a log line is not a file on one disk — it is replicated into the log aggregator, the long-term archive, tomorrow\'s backup and the compliance store nobody can delete from, which is why "we removed the log line" removes nothing. Log an explicit allow-list and never hand the logger a whole request, response or error object.',
            'Che ở tầng bộ ghi log thay vì ở từng chỗ gọi là hoàn toàn đúng — sai là ở CHIỀU. Một danh sách cấm buộc phải kể tên mọi cái tên mà một tín vật có thể mang, trong mọi ngôn ngữ mà nhóm gõ, mãi mãi. Nguồn hiểm nhất không phải một trường bạn quên mà là cả một object bạn ném vào: tuần tự hoá một lỗi của axios là tuần tự hoá luôn <code>err.config.headers</code>, trong đó có header <code>Authorization</code> của chính request vừa hỏng. Và một dòng log không phải một file trên một cái đĩa — nó được nhân ra công cụ gom log, kho lưu trữ dài hạn, bản sao lưu ngày mai và kho tuân thủ mà không ai xoá nổi; nên "chúng tôi gỡ dòng log đó rồi" chẳng gỡ được gì. Hãy ghi log theo danh sách CHO PHÉP tường minh, và đừng bao giờ đưa cả object request, response hay error cho bộ ghi log.',
          ),
        }),

        // ── Chương 2 — Mật khẩu ─────────────────────────────────────────
        mcq({
          prompt: B(
            'Lesson 2.2 presents this call as a working scrypt configuration. Run on Node v22.21.0, what happens?' + code(
              "const bam = await scryptAsync(password, salt, 64, { N: 2 ** 15, r: 8, p: 1 });",
            ),
            'Bài 2.2 trình bày lời gọi này như một cấu hình scrypt chạy được. Chạy trên Node v22.21.0 thì điều gì xảy ra?' + code(
              "const bam = await scryptAsync(password, salt, 64, { N: 2 ** 15, r: 8, p: 1 });",
            ),
          ),
          options: [
            B(
              'It returns a 64-byte key, but a weak one: <code>p: 1</code> disables the parallelism scrypt needs to be memory-hard',
              'Nó trả về khoá 64 byte, nhưng là khoá yếu: <code>p: 1</code> tắt mất phần song song mà scrypt cần để trở nên khó về bộ nhớ',
            ),
            B(
              'It throws <code>ERR_CRYPTO_INVALID_SCRYPT_PARAMS</code> — 128·N·r is exactly 32 MiB, which is exactly the default <code>maxmem</code> ceiling',
              'Nó NÉM <code>ERR_CRYPTO_INVALID_SCRYPT_PARAMS</code> — 128·N·r đúng bằng 32 MiB, mà trần <code>maxmem</code> mặc định cũng đúng 32 MB',
            ),
            B(
              'It works, and silently falls back to <code>N: 16384</code> when the requested memory is not available',
              'Nó chạy được, và tự lùi âm thầm về <code>N: 16384</code> khi không xin đủ bộ nhớ',
            ),
            B(
              'It hangs: <code>scrypt</code> without a callback never resolves, which is why the lesson wraps it in <code>promisify</code>',
              'Nó treo: <code>scrypt</code> không có callback thì không bao giờ resolve, và đó là lý do bài học bọc nó bằng <code>promisify</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured, not read: <code>128 * 32768 * 8 = 33,554,432</code> bytes, and Node\'s default <code>maxmem</code> is 32 MB, so the request lands exactly on the ceiling and OpenSSL refuses with <code>error:030000AC:digital envelope routines::memory limit exceeded</code>. Adding <code>maxmem: 64 * 1024 * 1024</code> makes the same call succeed; <code>N: 16384</code> also succeeds under the default. Nothing falls back silently, and <code>p: 1</code> is a perfectly normal choice. This is a good habit to take from the whole chapter: parameters copied from a page are a hypothesis, and the way you find out is by running them on the machine that will run production.',
            'Đo thật chứ không đọc suông: <code>128 * 32768 * 8 = 33.554.432</code> byte, mà <code>maxmem</code> mặc định của Node là 32 MB, nên yêu cầu rơi ĐÚNG lên trần và OpenSSL từ chối với <code>error:030000AC:digital envelope routines::memory limit exceeded</code>. Thêm <code>maxmem: 64 * 1024 * 1024</code> thì đúng lời gọi ấy chạy; <code>N: 16384</code> cũng chạy với trần mặc định. Không có chuyện tự lùi âm thầm, còn <code>p: 1</code> là lựa chọn hết sức bình thường. Đây là thói quen đáng mang theo từ cả chương: tham số chép từ một trang nào đó chỉ là một GIẢ THUYẾT, và cách biết đúng sai là chạy nó trên đúng cái máy sẽ chạy production.',
          ),
        }),

        mcq({
          prompt: B(
            'A codebase generates one salt at startup and reuses it for every user, reasoning that the salt is not a secret anyway. What is the effect?',
            'Một kho mã sinh MỘT cái muối lúc khởi động rồi dùng lại cho mọi người dùng, với lý lẽ rằng muối vốn có phải bí mật đâu. Hệ quả là gì?',
          ),
          options: [
            B(
              'It is fine: the salt is public by design, so one value or many changes nothing about the strength of each hash',
              'Không sao: muối vốn công khai theo thiết kế, nên một giá trị hay nhiều giá trị cũng chẳng đổi gì độ mạnh của từng cái băm',
            ),
            B(
              'It halves the cost of an attack, because the attacker must still hash every candidate once per algorithm',
              'Nó làm chi phí tấn công giảm một nửa, vì kẻ tấn công vẫn phải băm mỗi ứng viên một lần cho mỗi thuật toán',
            ),
            B(
              'It breaks verification: a shared salt makes two users with the same password collide on the primary key',
              'Nó làm hỏng việc xác minh: muối dùng chung khiến hai người cùng mật khẩu đụng độ ở khoá chính',
            ),
            B(
              'It is equivalent to having no salt at all: one pass over a wordlist is hashed once and compared against the whole table, and identical passwords are visible again as identical hashes',
              'Nó tương đương với KHÔNG có muối: quét wordlist một lượt, mỗi ứng viên băm một lần rồi đối chiếu với cả bảng, và mật khẩu giống nhau lại hiện ra thành băm giống nhau',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The salt has exactly one job — uniqueness per record — and both benefits follow from it. Precomputed tables die because the attacker cannot build one without knowing your salt in advance; and duplicates are hidden because two users with the same password now hash differently. A single application-wide salt keeps neither: the attacker builds a table for <em>your</em> salt once and cracks the entire table in one pass, and <code>GROUP BY hash</code> shows them which four thousand rows share a password so one success is four thousand accounts. Nothing collides on the primary key, and this is not a fifty-percent improvement. Modern password hashes generate and embed a per-record salt for you, which is one more reason not to build this by hand.',
            'Muối có đúng MỘT việc — duy nhất theo từng bản ghi — và cả hai cái lợi đều chảy ra từ đó. Bảng tính sẵn chết vì kẻ tấn công không dựng nổi bảng khi chưa biết muối của bạn từ trước; còn trùng lặp bị giấu đi vì hai người cùng mật khẩu giờ ra hai cái băm khác nhau. Một cái muối dùng chung cho cả ứng dụng thì không giữ được cái nào: kẻ tấn công dựng bảng cho ĐÚNG cái muối của bạn một lần rồi bẻ trọn bảng trong một lượt, và <code>GROUP BY hash</code> chỉ cho họ thấy bốn nghìn hàng nào đang chung mật khẩu — bẻ trúng một cái là được bốn nghìn tài khoản. Chẳng có gì đụng độ ở khoá chính cả, và đây cũng không phải cải thiện năm mươi phần trăm. Các hàm băm mật khẩu hiện đại tự sinh và tự nhúng muối theo từng bản ghi, thêm một lý do đừng tự tay dựng lại.',
          ),
        }),

        mcq({
          prompt: B(
            'Argon2id is tuned to <code>memoryCost: 65536</code> (64 MiB) on a container with a 2 GB limit. The login endpoint has no rate limit. An attacker sends failed logins as fast as they can. What have you built?',
            'Argon2id được chỉnh <code>memoryCost: 65536</code> (64 MiB) trên một container giới hạn 2 GB. Endpoint đăng nhập chưa có giới hạn tần suất. Kẻ tấn công bắn các lượt đăng nhập SAI nhanh hết mức. Bạn vừa dựng ra cái gì?',
          ),
          options: [
            B(
              'Nothing new: Node runs hashing on the libuv thread pool, which is capped at four threads, so concurrency is already bounded',
              'Chẳng có gì mới: Node chạy việc băm trên thread pool của libuv, vốn chặn ở bốn luồng, nên số việc đồng thời đã bị chặn sẵn',
            ),
            B(
              'A correctly hardened endpoint: the attacker pays the same 64 MiB per guess, so the cost is symmetric',
              'Một endpoint đã được làm cứng đúng cách: kẻ tấn công cũng trả đúng 64 MiB cho mỗi lần đoán, nên chi phí là đối xứng',
            ),
            B(
              'A memory leak, because Argon2 keeps each hash\'s working buffer until the process restarts',
              'Một chỗ rò bộ nhớ, vì Argon2 giữ lại vùng đệm làm việc của từng phép băm cho tới khi tiến trình khởi động lại',
            ),
            B(
              'A denial-of-service amplifier: one cheap HTTP request costs you 64 MiB and a slice of CPU, and about thirty concurrent failures exhaust the container',
              'Một bộ khuếch đại tấn công từ chối dịch vụ: một request HTTP rẻ tiền bắt bạn trả 64 MiB cộng một lát CPU, và khoảng ba mươi lượt sai đồng thời là ngốn hết container',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The asymmetry you wanted — you hash once per login, the attacker hashes billions — reverses completely on an unauthenticated endpoint with no limit. The attacker spends one request; you spend memory and CPU, and <code>64 MiB × 30</code> is already past a 2 GB container, at which point the OOM killer stops the process and every real user is logged out too. Nothing leaks, and the pool size is not a safety net you can rely on: it bounds threads, not queued work, and the memory is allocated per in-flight hash. Three defences are all required: rate-limit per account <em>and</em> per IP (Chapter 11), cap concurrent hashing with a small semaphore, and size <code>memoryCost × maxConcurrent</code> to fit the container limit with room to spare.',
            'Cái bất đối xứng mà bạn muốn — bạn băm một lần mỗi lượt đăng nhập, kẻ tấn công băm hàng tỉ lần — bị lật ngược hoàn toàn ở một endpoint không cần xác thực và không có giới hạn. Kẻ tấn công tiêu một cái request; bạn tiêu bộ nhớ và CPU, mà <code>64 MiB × 30</code> đã vượt một container 2 GB, tới lúc đó OOM killer giết tiến trình và mọi người dùng thật cũng bị đá ra theo. Chẳng có chỗ nào rò rỉ, và kích thước thread pool không phải cái lưới bạn dựa được: nó chặn số luồng chứ không chặn số việc xếp hàng, còn bộ nhớ thì cấp theo từng phép băm đang bay. Cần đủ ba lớp: giới hạn tần suất theo tài khoản VÀ theo IP (chương 11), chặn số phép băm đồng thời bằng một cái semaphore nhỏ, và tính <code>memoryCost × maxConcurrent</code> sao cho lọt trần bộ nhớ của container còn dư chỗ.',
          ),
        }),

        mcq({
          prompt: B(
            'A team cannot compile a native module, so they swap <code>bcrypt</code> for the pure-JavaScript <code>bcryptjs</code>. It runs roughly an order of magnitude slower, so they lower the cost factor from 12 to 9 to stay inside their 250 ms budget. What did that trade?',
            'Một nhóm không biên dịch được mô-đun native nên đổi <code>bcrypt</code> sang <code>bcryptjs</code> thuần JavaScript. Nó chậm hơn cỡ một bậc độ lớn, nên họ hạ cost từ 12 xuống 9 để nằm trong ngân sách 250 ms. Họ vừa đánh đổi cái gì?',
          ),
          options: [
            B(
              'Nothing meaningful — both libraries produce the same <code>$2b$</code> format, so a hash from one verifies under the other',
              'Chẳng đổi gì đáng kể — cả hai thư viện đều cho ra định dạng <code>$2b$</code>, nên băm của bên này bên kia kiểm được',
            ),
            B(
              'Latency for memory: the pure-JS port uses less RAM per hash, which is the parameter that actually blunts a GPU',
              'Đổi độ trễ lấy bộ nhớ: bản thuần JS tốn ít RAM hơn cho mỗi phép băm, mà bộ nhớ mới là tham số thật sự làm cùn GPU',
            ),
            B(
              'They made hashing slower for the server and cheaper for the attacker: the attacker\'s cost is set by the cost factor, and the cost factor just dropped by three doublings',
              'Họ làm việc băm chậm đi cho máy chủ và RẺ đi cho kẻ tấn công: chi phí của kẻ tấn công do cost quyết định, mà cost vừa tụt ba lần gấp đôi',
            ),
            B(
              'They removed the 72-byte truncation, because the pure-JS implementation handles UTF-8 input of any length',
              'Họ bỏ được chỗ cắt cụt 72 byte, vì bản thuần JS xử lý được đầu vào UTF-8 dài bao nhiêu cũng xong',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The libraries are interchangeable at the format level, and the 72-byte limit is a property of bcrypt itself rather than of any implementation, so neither of those changes. What changed is the only number the attacker sees. Cost is a power of two: 12 to 9 divides the work per guess by eight, and the attacker runs on a GPU where the slow JavaScript never enters the picture. Slower for you, eight times cheaper for them — the exact inversion of what a password hash is for. If a native module is genuinely impossible, <code>crypto.scrypt</code> is built into Node, is memory-hard, and needs nothing compiled.',
            'Hai thư viện thay thế được cho nhau ở mức định dạng, còn giới hạn 72 byte là tính chất của chính bcrypt chứ không phải của một bản cài đặt nào, nên cả hai thứ đó đều không đổi. Thứ ĐÃ đổi là con số duy nhất mà kẻ tấn công nhìn thấy. Cost là luỹ thừa của hai: từ 12 xuống 9 là chia công sức mỗi lần đoán cho tám, mà kẻ tấn công thì chạy trên GPU, nơi cái JavaScript chậm chạp kia không hề bước vào. Chậm hơn cho bạn, rẻ đi tám lần cho họ — đúng nghĩa lật ngược mục đích của một hàm băm mật khẩu. Nếu quả thật không cách nào có mô-đun native, thì <code>crypto.scrypt</code> nằm sẵn trong Node, khó về bộ nhớ, và chẳng phải biên dịch gì.',
          ),
        }),

        mcq({
          prompt: B(
            'A stored password hash looks like this. The team also keeps <code>algorithm</code>, <code>memoryCost</code> and <code>timeCost</code> in three extra columns "so we know how it was hashed". What is wrong with the extra columns?' + code(
              '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$RdescudvJCsgt3ub+b+dWRWJTmaaJObG',
            ),
            'Một chuỗi băm mật khẩu đã lưu trông như dưới đây. Nhóm còn giữ thêm ba cột <code>algorithm</code>, <code>memoryCost</code> và <code>timeCost</code> "để biết nó đã băm bằng gì". Ba cột thêm ấy sai ở đâu?' + code(
              '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$RdescudvJCsgt3ub+b+dWRWJTmaaJObG',
            ),
          ),
          options: [
            B(
              'They can drift from the string, which already carries the algorithm, version, every parameter and the salt — and it is that self-description that lets one column hold last year\'s hashes and this year\'s at once',
              'Chúng có thể trôi lệch khỏi chính chuỗi kia, thứ vốn đã mang sẵn thuật toán, phiên bản, mọi tham số và cả muối — và chính khả năng tự mô tả đó mới cho phép MỘT cột chứa được cả băm năm ngoái lẫn băm năm nay',
            ),
            B(
              'They leak the parameters to an attacker who reads the database, which the encoded string deliberately hides',
              'Chúng để lộ tham số cho kẻ đọc được cơ sở dữ liệu, đúng thứ mà chuỗi mã hoá kia cố tình giấu đi',
            ),
            B(
              'They are the wrong type: <code>m=65536</code> is a count of blocks, not kibibytes, so an integer column stores the wrong unit',
              'Chúng sai kiểu dữ liệu: <code>m=65536</code> là số khối chứ không phải kibibyte, nên một cột số nguyên lưu sai đơn vị',
            ),
            B(
              'They are redundant only for Argon2; bcrypt and scrypt hashes do not encode their own parameters, so the columns are needed anyway',
              'Chúng chỉ thừa với Argon2 thôi; băm bcrypt và scrypt không tự mã hoá tham số nên vẫn cần ba cột đó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Every field is already inside the string: <code>argon2id</code>, <code>v=19</code>, <code>m</code>, <code>t</code>, <code>p</code>, the base64 salt and the digest. A bcrypt hash is the same idea — <code>$2b$12$</code> names the variant and the cost, with the next twenty-two characters the salt. Duplicating that into columns creates two sources of truth that can disagree after any partial migration, and the row then verifies against one set of parameters while your code believes another. The parameters are not secret and hiding them buys nothing: an attacker holding the database already knows how expensive each guess is going to be. The self-describing string is precisely what makes <code>needsRehash</code> possible — read the parameters out of the row, compare them with today\'s configuration, and re-store the hash on the next successful login, which is the only moment you hold the plaintext.',
            'Mọi trường đều đã nằm trong chính chuỗi ấy: <code>argon2id</code>, <code>v=19</code>, <code>m</code>, <code>t</code>, <code>p</code>, muối dạng base64 và phần băm. Băm bcrypt cũng cùng ý tưởng — <code>$2b$12$</code> nói rõ biến thể và cost, hai mươi hai ký tự tiếp theo là muối. Chép lại chỗ đó ra thành cột là tạo ra HAI nguồn sự thật có thể cãi nhau sau bất kỳ cuộc chuyển đổi dở dang nào, và rồi cái hàng đó xác minh theo một bộ tham số trong khi mã của bạn tin vào một bộ khác. Tham số không phải bí mật, giấu đi cũng chẳng mua được gì: kẻ đang cầm cơ sở dữ liệu thì biết thừa mỗi lần đoán sẽ đắt cỡ nào. Chính khả năng tự mô tả ấy làm cho <code>needsRehash</code> khả thi — đọc tham số ra từ chính hàng đó, so với cấu hình hôm nay, rồi ghi lại băm mới ở lần đăng nhập thành công kế tiếp, khoảnh khắc duy nhất bạn còn cầm bản rõ.',
          ),
        }),

        mcq({
          prompt: B(
            'The same Vietnamese password typed on a Mac and on a phone can be two different byte strings. Measured on Node v22.21.0:' + code(
              "'mật'.normalize('NFC').length                          // 3 code points\n" +
              "'mật'.normalize('NFD').length                          // 5 code points\n" +
              "Buffer.from('mật'.normalize('NFC'), 'utf8').length     // 5 bytes\n" +
              "Buffer.from('mật'.normalize('NFD'), 'utf8').length     // 7 bytes",
            ) + 'What is the correct handling?',
            'Cùng một mật khẩu tiếng Việt gõ trên máy Mac và trên điện thoại có thể là hai chuỗi byte khác nhau. Đo thật trên Node v22.21.0:' + code(
              "'mật'.normalize('NFC').length                          // 3 code point\n" +
              "'mật'.normalize('NFD').length                          // 5 code point\n" +
              "Buffer.from('mật'.normalize('NFC'), 'utf8').length     // 5 byte\n" +
              "Buffer.from('mật'.normalize('NFD'), 'utf8').length     // 7 byte",
            ) + 'Cách xử lý đúng là gì?',
          ),
          options: [
            B(
              'Strip the diacritics before hashing, so every device produces the same ASCII bytes',
              'Bỏ dấu trước khi băm, để mọi thiết bị đều cho ra cùng một chuỗi byte ASCII',
            ),
            B(
              'Lowercase and trim on both paths, which removes the keyboard differences along with the whitespace',
              'Chuyển thường và cắt khoảng trắng ở cả hai đường, vừa xoá khác biệt bàn phím vừa xoá khoảng trắng thừa',
            ),
            B(
              'Store the byte length beside the hash and compare both forms at login when the lengths disagree',
              'Lưu độ dài byte cạnh chuỗi băm rồi khi hai độ dài lệch nhau thì thử cả hai dạng lúc đăng nhập',
            ),
            B(
              'Apply <code>normalize(\'NFKC\')</code> in one helper used by both the hashing and the verifying path, and change nothing else about the characters',
              'Gọi <code>normalize(\'NFKC\')</code> trong MỘT hàm phụ dùng chung cho cả đường băm lẫn đường kiểm, và không đụng gì thêm vào các ký tự',
            ),
          ],
          correct: 3,
          explanation: EX(
            'macOS tends to hand you NFD and Windows and Android tend to hand you NFC, so without normalisation the same person with the same password logs in on one device and fails on the other. NIST SP 800-63B recommends NFKC explicitly, and the reason it goes in a single helper is that the two call sites must never drift apart — normalising on the way in but not on the way out is the same bug with extra steps. Everything else on the list destroys entropy or invents a second code path: stripping diacritics throws away information the user chose, lowercasing removes about a third of a typical password\'s entropy, and a space is a legal password character. Note that the lesson prints the NFD byte length as 8; measured on Node 22 it is 7.',
            'macOS hay đưa NFD còn Windows và Android hay đưa NFC, nên không chuẩn hoá thì cùng một người với cùng một mật khẩu sẽ đăng nhập được trên máy này và trượt trên máy kia. NIST SP 800-63B khuyến nghị thẳng NFKC, và lý do nó phải nằm trong MỘT hàm phụ là hai chỗ gọi không bao giờ được trôi lệch nhau — chuẩn hoá lúc vào mà quên lúc ra là đúng con lỗi ấy với vài bước phụ. Mọi thứ còn lại trong danh sách đều phá entropy hoặc đẻ thêm một nhánh mã: bỏ dấu là vứt đi thông tin người dùng đã chọn, chuyển thường là bốc mất chừng một phần ba entropy của một mật khẩu điển hình, còn dấu cách là một ký tự mật khẩu hợp lệ. Lưu ý bài học in độ dài byte của dạng NFD là 8; đo trên Node 22 thì nó là 7.',
          ),
        }),

        mcq({
          prompt: B(
            'Registration checks the chosen password against Have I Been Pwned without sending it anywhere. Measured:' + code(
              "sha1('password') = 5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8\n" +
              'GET https://api.pwnedpasswords.com/range/5BAA6\n' +
              '  -> 1E4C9B93F3F0682250B6CF8331B7EE68FD8:10382543',
            ) + 'Which reading of this design is correct?',
            'Bước đăng ký đối chiếu mật khẩu vừa chọn với Have I Been Pwned mà không gửi nó đi đâu. Đo thật:' + code(
              "sha1('password') = 5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8\n" +
              'GET https://api.pwnedpasswords.com/range/5BAA6\n' +
              '  -> 1E4C9B93F3F0682250B6CF8331B7EE68FD8:10382543',
            ) + 'Cách hiểu nào về thiết kế này là đúng?',
          ),
          options: [
            B(
              'The server receives only the five-character prefix and answers with about 850 suffixes, so it never learns which candidate was asked about; SHA-1 is safe here because it is an index into a published list, not a protection',
              'Máy chủ chỉ nhận năm ký tự đầu và trả về khoảng 850 hậu tố, nên nó không bao giờ biết được câu hỏi là về ứng viên nào; SHA-1 an toàn ở đây vì nó chỉ là chỉ mục vào một danh sách đã công bố, không phải một lớp bảo vệ',
            ),
            B(
              'The prefix is a salted digest, so the server cannot reverse it — which is why the scheme is safe even though the full hash would be reversible',
              'Năm ký tự đầu là một digest đã trộn muối nên máy chủ không đảo ngược được — nhờ vậy cả cơ chế mới an toàn dù cái băm đầy đủ thì đảo được',
            ),
            B(
              'Because SHA-1 is broken, the check must be repeated with SHA-256 before the password is accepted',
              'Vì SHA-1 đã bị phá nên phải kiểm lại lần nữa bằng SHA-256 trước khi chấp nhận mật khẩu',
            ),
            B(
              'The check belongs on every login, since a password that was safe at registration may appear in a breach later',
              'Phép kiểm này phải chạy ở MỌI lần đăng nhập, vì một mật khẩu lúc đăng ký còn an toàn có thể lọt vào một vụ rò rỉ sau đó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is k-anonymity: the client sends <code>5BAA6</code>, receives every suffix sharing that prefix, and does the final comparison locally, so the range endpoint sees a bucket rather than a question. <code>Add-Padding: true</code> hides the response size as well, which would otherwise be a weak signal. SHA-1\'s collision weakness is irrelevant because nothing here depends on collision resistance — the digest is a lookup key into a published dataset, and the password itself is still stored with Argon2id. Put the check on registration and on password change, where the user is already choosing and can act on the answer; on every login it would be an outbound call on your hottest path with nothing the user can do about it. And fail open with a two-second timeout: a third-party outage must not stop people signing up.',
            'Đây là k-ẩn danh: client gửi <code>5BAA6</code>, nhận về mọi hậu tố chung tiền tố đó, rồi tự so nốt ở máy mình, nên endpoint kia chỉ thấy một cái RỔ chứ không thấy một câu hỏi. <code>Add-Padding: true</code> giấu luôn kích thước phản hồi, thứ nếu không sẽ là một tín hiệu yếu. Chuyện SHA-1 yếu về đụng độ không liên quan gì ở đây, vì chẳng có gì trong cơ chế này dựa vào khả năng chống đụng độ — cái digest chỉ là khoá tra cứu vào một tập dữ liệu đã công bố, còn bản thân mật khẩu vẫn cất bằng Argon2id. Hãy đặt phép kiểm ở lúc đăng ký và lúc đổi mật khẩu, khi người dùng đang chọn và còn làm gì được với câu trả lời; đặt ở mọi lần đăng nhập thì thành một lời gọi ra ngoài nằm trên đường nóng nhất mà người dùng chẳng xử lý được gì. Và hãy hỏng theo hướng MỞ với timeout hai giây: một sự cố của bên thứ ba không được phép chặn người ta đăng ký.',
          ),
        }),

        // ── Chương 3 — Phiên và cookie ──────────────────────────────────
        mcq({
          prompt: B(
            'The session lookup writes <code>activeAt</code> only when the stored value is more than five minutes old. Why not simply write it on every request?' + code(
              'if (now.getTime() - session.activeAt.getTime() > 5 * 60 * 1000) {\n' +
              '  await prisma.session.update({ where: { id: session.id }, data: { activeAt: now } });\n' +
              '}',
            ),
            'Phép tra cứu phiên chỉ ghi <code>activeAt</code> khi giá trị đã lưu cũ hơn năm phút. Sao không ghi luôn ở mọi request?' + code(
              'if (now.getTime() - session.activeAt.getTime() > 5 * 60 * 1000) {\n' +
              '  await prisma.session.update({ where: { id: session.id }, data: { activeAt: now } });\n' +
              '}',
            ),
          ),
          options: [
            B(
              'Because writing on every request would slide the idle window forward and defeat idle expiry entirely',
              'Vì ghi ở mọi request sẽ đẩy cửa sổ nghỉ trôi tới và làm mất hẳn tác dụng của hạn nghỉ',
            ),
            B(
              'Because a write per request means a database write per page view including every image, API call and poll; the threshold removes about 99% of them and costs only five minutes of precision on the idle deadline',
              'Vì ghi mỗi request là một lệnh ghi cơ sở dữ liệu cho mỗi lượt xem trang, tính cả từng cái ảnh, từng lời gọi API và từng lần hỏi thăm; cái ngưỡng này bỏ đi chừng 99% số lệnh ghi đó và chỉ trả giá bằng năm phút sai số của hạn nghỉ',
            ),
            B(
              'Because concurrent requests would deadlock on the same row, which is why the write is conditional',
              'Vì các request đồng thời sẽ khoá chết nhau trên cùng một hàng, nên lệnh ghi phải có điều kiện',
            ),
            B(
              'Because <code>activeAt</code> is also the absolute ceiling, so moving it too often would extend the session past thirty days',
              'Vì <code>activeAt</code> cũng chính là trần tuyệt đối, nên xê dịch nó quá thường xuyên sẽ kéo phiên vượt quá ba mươi ngày',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Sliding the idle window is the intended behaviour, not the problem — that is what idle expiry means, and it is bounded by <code>absoluteExpiresAt</code>, which is a separate column that never moves no matter how active the session is. The cost being avoided is purely throughput: a session read is a cheap indexed lookup, but turning every read into a read plus a write turns the busiest table in the application into the busiest write path. Five minutes of slack on a two-hour idle deadline is a rounding error, and it is the trade the threshold buys. Rows do not deadlock on independent updates either.',
            'Đẩy cửa sổ nghỉ trôi tới chính là hành vi MONG MUỐN chứ không phải vấn đề — hạn nghỉ nghĩa là như vậy, và nó bị chặn bởi <code>absoluteExpiresAt</code>, một cột riêng không bao giờ xê dịch dù phiên hoạt động tới đâu. Cái chi phí đang tránh thuần tuý là thông lượng: đọc một phiên là một lượt tra chỉ mục rẻ tiền, nhưng biến mỗi lượt đọc thành đọc-cộng-ghi là biến cái bảng bận nhất ứng dụng thành đường ghi bận nhất. Năm phút xê xích trên một hạn nghỉ hai tiếng là sai số làm tròn, và đó là thứ cái ngưỡng này mua được. Các hàng độc lập cũng không khoá chết nhau khi cập nhật.',
          ),
        }),

        mcq({
          prompt: B(
            'An application behind Nginx sets its session cookie with <code>secure: true</code>. In production, HTTPS is terminated at Nginx and the app is reached over plain HTTP inside the network. Which configuration line decides whether Express believes the request was secure?',
            'Một ứng dụng nằm sau Nginx đặt cookie phiên với <code>secure: true</code>. Trên production, HTTPS kết thúc ở Nginx còn ứng dụng thì được gọi qua HTTP trần bên trong mạng. Dòng cấu hình nào quyết định việc Express có tin rằng request đó là an toàn hay không?',
          ),
          options: [
            B(
              '<code>app.set(\'trust proxy\', 1)</code> — without it Express ignores <code>X-Forwarded-Proto</code>, so a correct HTTPS deployment believes it is on HTTP',
              '<code>app.set(\'trust proxy\', 1)</code> — thiếu nó thì Express bỏ qua <code>X-Forwarded-Proto</code>, nên một triển khai HTTPS hoàn toàn đúng lại tự tin rằng mình đang chạy HTTP',
            ),
            B(
              '<code>secure: process.env.NODE_ENV === \'production\'</code> — the flag has to be conditional, because <code>Secure</code> cookies cannot be set over the internal HTTP hop',
              '<code>secure: process.env.NODE_ENV === \'production\'</code> — cờ này buộc phải có điều kiện, vì cookie <code>Secure</code> không đặt được qua chặng HTTP nội bộ',
            ),
            B(
              '<code>sameSite: \'none\'</code> — a proxy makes the request cross-site, so <code>Lax</code> would drop the cookie',
              '<code>sameSite: \'none\'</code> — có proxy thì request thành xuyên trang, nên <code>Lax</code> sẽ làm rớt cookie',
            ),
            B(
              'None of them: the browser decides from the address bar, so the application\'s view of the protocol never matters',
              'Chẳng dòng nào cả: trình duyệt quyết định theo thanh địa chỉ, nên chuyện ứng dụng nghĩ gì về giao thức không bao giờ quan trọng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The browser really does decide from its own address bar, so a <code>Secure</code> cookie set on an HTTPS page works regardless. But the application still has its own opinion of the protocol, and that opinion drives redirects to HTTPS, the <code>secure</code> guard in some session middlewares, and anything that logs or branches on <code>req.secure</code>. Express derives it from <code>X-Forwarded-Proto</code> only when <code>trust proxy</code> is configured. The conditional flag is the trap this replaces: writing <code>secure: NODE_ENV === \'production\'</code> is how <code>secure: false</code> eventually ships, and it is unnecessary because modern browsers treat <code>http://localhost</code> as a trustworthy origin and accept <code>Secure</code> cookies there. Add HSTS as well, so a plain-HTTP request to your domain never gets the chance to start.',
            'Trình duyệt đúng là quyết định theo thanh địa chỉ của chính nó, nên một cookie <code>Secure</code> đặt trên trang HTTPS thì vẫn chạy. Nhưng ứng dụng vẫn có ý kiến riêng về giao thức, và cái ý kiến ấy điều khiển việc chuyển hướng sang HTTPS, cái chốt <code>secure</code> trong vài middleware phiên, và mọi chỗ ghi log hay rẽ nhánh theo <code>req.secure</code>. Express chỉ suy ra nó từ <code>X-Forwarded-Proto</code> khi đã bật <code>trust proxy</code>. Cái cờ có điều kiện chính là cái bẫy mà dòng này thay thế: viết <code>secure: NODE_ENV === \'production\'</code> là con đường để rồi <code>secure: false</code> lên tới production, mà lại không cần thiết, vì trình duyệt hiện đại coi <code>http://localhost</code> là origin đáng tin và vẫn nhận cookie <code>Secure</code> ở đó. Thêm cả HSTS nữa, để một request HTTP trần tới tên miền của bạn không bao giờ có cơ hội bắt đầu.',
          ),
        }),

        mcq({
          prompt: B(
            'A product runs on <code>app.vidu.com</code>, with a WordPress blog on <code>blog.vidu.com</code> and a status page on <code>status.vidu.com</code> operated by a vendor. The session cookie is set with <code>Domain=vidu.com</code> "so it works everywhere". What has that decided?',
            'Một sản phẩm chạy ở <code>app.vidu.com</code>, blog WordPress ở <code>blog.vidu.com</code>, và trang trạng thái ở <code>status.vidu.com</code> do một nhà cung cấp bên ngoài vận hành. Cookie phiên đặt kèm <code>Domain=vidu.com</code> "cho nó chạy khắp nơi". Quyết định đó dẫn tới điều gì?',
          ),
          options: [
            B(
              'Nothing risky: <code>SameSite=Lax</code> still blocks anything coming from another host',
              'Chẳng có gì rủi ro: <code>SameSite=Lax</code> vẫn chặn mọi thứ đến từ một host khác',
            ),
            B(
              'Only a performance cost: the cookie is now sent to three hosts instead of one',
              'Chỉ tốn thêm chút hiệu năng: cookie giờ được gửi tới ba host thay vì một',
            ),
            B(
              'The cookie is now sent to every subdomain, so one XSS on the blog or one subdomain takeover on an abandoned CNAME reads the session for the whole product; leave <code>Domain</code> out and the cookie is host-only',
              'Cookie giờ được gửi tới MỌI tên miền con, nên một lỗ XSS ở blog hay một cú chiếm tên miền con trên một bản ghi CNAME bỏ hoang là đọc được phiên của cả sản phẩm chính; bỏ hẳn <code>Domain</code> đi thì cookie chỉ thuộc về đúng host đã đặt nó',
            ),
            B(
              'It is the only way to make a session work across hosts, and the safe version of it is <code>Path=/admin</code> to keep the cookie away from the blog',
              'Đó là cách duy nhất để một phiên chạy được xuyên host, và bản an toàn của nó là <code>Path=/admin</code> để giữ cookie tránh xa blog',
            ),
          ],
          correct: 2,
          explanation: EX(
            '<code>SameSite</code> works on the registrable domain, so <code>blog.vidu.com</code> and <code>app.vidu.com</code> are the <em>same site</em> and it does nothing between them — this is exactly the case it does not cover. <code>Path</code> is not a security boundary either: any page on the origin can read a path-scoped cookie by creating an iframe at that path, because the same-origin policy does not separate paths. Omitting <code>Domain</code> makes the cookie host-only, which is both the safest option and the one you get by typing nothing. If sharing really is required, put everything untrusted — the blog, the docs, user-generated content — on a completely different registrable domain rather than on a subdomain, and use the <code>__Host-</code> prefix so a subdomain cannot even write a cookie of that name.',
            '<code>SameSite</code> làm việc theo tên miền đăng ký được, nên <code>blog.vidu.com</code> và <code>app.vidu.com</code> là CÙNG MỘT SITE và nó chẳng làm gì giữa hai bên — đây đúng là ca mà nó không che. <code>Path</code> cũng không phải ranh giới bảo mật: bất kỳ trang nào cùng origin đều đọc được cookie giới hạn theo path bằng cách dựng một iframe ở đúng path đó, vì chính sách cùng nguồn không tách theo path. Bỏ hẳn <code>Domain</code> làm cookie chỉ thuộc về đúng host, vừa là lựa chọn an toàn nhất vừa là thứ bạn có được bằng cách không gõ gì. Nếu thật sự cần dùng chung, hãy đẩy mọi thứ không đáng tin — blog, tài liệu, nội dung người dùng đăng — sang một tên miền đăng ký được HOÀN TOÀN KHÁC chứ đừng để ở tên miền con, và dùng tiền tố <code>__Host-</code> để một tên miền con thậm chí không ghi nổi một cookie cùng tên.',
          ),
        }),

        mcq({
          prompt: B(
            'Sign-out calls <code>res.clearCookie(\'__Host-session\')</code> and returns 200. The user is still logged in on the next request. Which two things are wrong?',
            'Nút đăng xuất gọi <code>res.clearCookie(\'__Host-session\')</code> rồi trả 200. Request kế tiếp người dùng vẫn đang đăng nhập. Hai chỗ sai là gì?',
          ),
          options: [
            B(
              'The <code>__Host-</code> prefix makes a cookie permanent, so it can only be replaced by a cookie with a different name',
              'Tiền tố <code>__Host-</code> làm cookie thành vĩnh viễn, nên chỉ thay được bằng một cookie mang tên khác',
            ),
            B(
              'The response needs <code>Cache-Control: no-store</code>, and the cookie must be cleared with <code>maxAge: 0</code> rather than with <code>clearCookie</code>',
              'Phản hồi cần thêm <code>Cache-Control: no-store</code>, và cookie phải xoá bằng <code>maxAge: 0</code> chứ không phải bằng <code>clearCookie</code>',
            ),
            B(
              'Sign-out must be a GET so the browser applies the <code>Set-Cookie</code>, and the status code must be 204, because a body on a sign-out response makes some browsers keep the previous cookie jar untouched',
              'Đăng xuất phải là GET thì trình duyệt mới áp dụng <code>Set-Cookie</code>, và mã trạng thái phải là 204, vì một phản hồi đăng xuất có thân dữ liệu sẽ khiến vài trình duyệt giữ nguyên kho cookie cũ',
            ),
            B(
              'The browser identifies a cookie by name, domain and path, so clearing without the same <code>path</code>, <code>secure</code> and <code>sameSite</code> sets a new expired cookie beside the old one — and clearing a cookie is not signing out anyway, because the session row must be revoked',
              'Trình duyệt định danh một cookie bằng bộ ba tên, domain và path, nên xoá mà không kèm đúng <code>path</code>, <code>secure</code> và <code>sameSite</code> là đặt thêm một cookie MỚI đã hết hạn nằm cạnh cái cũ — và dù sao xoá cookie cũng không phải đăng xuất, vì hàng phiên trong cơ sở dữ liệu mới là thứ phải thu hồi',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A cookie is keyed by name, domain and path. Get any part wrong on the way out and the browser stores an expired cookie that does not match the live one, which sits there and keeps being sent — the response looks correct and nothing changed. Pass the same options you used when setting it. The second half is the one that matters more: even a perfectly cleared cookie is only a request that the browser stop presenting the credential. The credential itself is still valid, so anyone who already copied it — the whole reason someone presses sign-out on a shared machine — keeps working. Revoke the row, and let clearing the cookie be the cosmetic half.',
            'Một cookie được định danh bằng tên, domain và path. Sai bất kỳ phần nào lúc xoá là trình duyệt cất một cookie đã hết hạn KHÔNG khớp với cái đang sống, và cái đang sống vẫn nằm đó, vẫn được gửi đi — phản hồi trông đúng mà chẳng có gì đổi. Hãy truyền đúng bộ tuỳ chọn đã dùng lúc đặt. Nửa thứ hai mới là nửa quan trọng hơn: một cookie xoá hoàn hảo cũng chỉ là lời ĐỀ NGHỊ trình duyệt thôi trình tín vật ra. Bản thân tín vật vẫn còn hiệu lực, nên ai đã kịp sao chép nó — đúng lý do người ta bấm đăng xuất trên máy dùng chung — thì vẫn dùng tiếp bình thường. Hãy thu hồi cái hàng trong cơ sở dữ liệu, và để việc xoá cookie làm nốt phần hình thức.',
          ),
        }),

        mcq({
          prompt: B(
            'A CSRF middleware allows every mutating request whose <code>Sec-Fetch-Site</code> is <code>same-origin</code> or <code>none</code>, and blocks <code>same-site</code> and <code>cross-site</code>. Why can this header be trusted, and what does <code>none</code> mean?',
            'Một middleware chống CSRF cho qua mọi request có thay đổi trạng thái mà <code>Sec-Fetch-Site</code> là <code>same-origin</code> hoặc <code>none</code>, và chặn <code>same-site</code> cùng <code>cross-site</code>. Vì sao header này tin được, và <code>none</code> nghĩa là gì?',
          ),
          options: [
            B(
              'It is signed by the browser with a per-session key, and <code>none</code> means the browser could not determine the context',
              'Nó được trình duyệt ký bằng một khoá riêng cho từng phiên, và <code>none</code> nghĩa là trình duyệt không xác định được ngữ cảnh',
            ),
            B(
              '<code>Sec-</code> is a forbidden header name, so page JavaScript cannot set or modify it; <code>none</code> means the navigation was user-initiated — a typed URL or a bookmark — with no originating page at all',
              '<code>Sec-</code> là tên header bị cấm, nên JavaScript của trang không đặt cũng không sửa được nó; <code>none</code> nghĩa là điều hướng do chính người dùng khởi xướng — gõ URL hoặc bấm dấu trang — không có trang nào gây ra nó cả',
            ),
            B(
              'It is verified against the <code>Origin</code> header by the browser before sending, and <code>none</code> means the request carried no cookies',
              'Trình duyệt tự đối chiếu nó với header <code>Origin</code> trước khi gửi, và <code>none</code> nghĩa là request không mang theo cookie nào',
            ),
            B(
              'It cannot be trusted at all — <code>curl</code> can send any value — so the middleware is decoration and only a token defends anything',
              'Chẳng tin được gì cả — <code>curl</code> gửi giá trị nào cũng được — nên middleware này chỉ là trang trí, chỉ có token mới bảo vệ được cái gì',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The header is set by the browser and lives in the forbidden-header-name list, so no script on the page can forge it — that is what makes it stronger than <code>Referer</code>, which a referrer policy can suppress. <code>none</code> is the user typing an address or following a bookmark, which is exactly the case that must stay allowed. And it covers the case <code>SameSite=Lax</code> does not: a request from <code>blog.vidu.com</code> is <em>same-site</em>, so the cookie is sent, and only this check blocks it. The <code>curl</code> objection misses the shape of the attack: CSRF is about a credential the browser attaches automatically, and <code>curl</code> has no session cookie to attach. Decide deliberately what "no header at all" should mean for your API — native apps and server-to-server callers should be on a bearer token and exempt.',
            'Header này do TRÌNH DUYỆT đặt và nằm trong danh sách tên header bị cấm, nên không script nào trên trang giả mạo được — đó là chỗ nó mạnh hơn <code>Referer</code>, thứ mà một chính sách referrer có thể dập tắt. <code>none</code> là lúc người dùng tự gõ địa chỉ hoặc bấm dấu trang, đúng cái ca bắt buộc phải cho qua. Và nó che được ca mà <code>SameSite=Lax</code> không che: một request từ <code>blog.vidu.com</code> là CÙNG SITE nên cookie vẫn được gửi, và chỉ phép kiểm này mới chặn nổi. Lý lẽ "curl gửi gì chẳng được" thì trượt mất hình dạng của cú tấn công: CSRF nói về một tín vật mà TRÌNH DUYỆT tự đính vào, còn <code>curl</code> thì làm gì có cookie phiên nào để đính. Hãy quyết định có chủ đích rằng "không có header nào" nghĩa là gì với API của bạn — ứng dụng native và các bên gọi máy-tới-máy nên dùng bearer token và được miễn.',
          ),
        }),

        mcq({
          prompt: B(
            'A double-submit CSRF guard generates a random value, puts it in a readable cookie, and accepts the request when the <code>X-CSRF-Token</code> header equals the cookie. An attacker controls <code>cu.vidu.com</code>, an abandoned subdomain. What happens, and what fixes it?',
            'Một lớp chống CSRF kiểu gửi-đôi sinh một giá trị ngẫu nhiên, đặt vào một cookie đọc được, và cho qua khi header <code>X-CSRF-Token</code> bằng đúng cookie đó. Kẻ tấn công đang kiểm soát <code>cu.vidu.com</code>, một tên miền con bỏ hoang. Chuyện gì xảy ra, và sửa thế nào?',
          ),
          options: [
            B(
              'Nothing: the attacker cannot read the victim\'s cookie from another origin, so the two values can never match',
              'Chẳng sao cả: kẻ tấn công không đọc được cookie của nạn nhân từ một origin khác, nên hai giá trị không bao giờ khớp nhau',
            ),
            B(
              'The attacker sets both the cookie and the header to a value they chose, and the equality check passes; bind the token to the session id with an HMAC so a forged pair cannot produce the right signature',
              'Kẻ tấn công đặt cả cookie lẫn header thành một giá trị do chính họ chọn, và phép so bằng cho qua; hãy buộc token vào mã phiên bằng một HMAC để một cặp giả mạo không tài nào sinh ra đúng chữ ký',
            ),
            B(
              'The guard fails open on any request without the header, so the fix is to reject requests that carry no <code>X-CSRF-Token</code>',
              'Lớp chắn này hỏng theo hướng MỞ với mọi request thiếu header, nên cách sửa là từ chối các request không mang <code>X-CSRF-Token</code>',
            ),
            B(
              'The comparison uses <code>===</code>, so the attacker recovers the token one byte at a time from timing; the fix is <code>timingSafeEqual</code>',
              'Phép so dùng <code>===</code>, nên kẻ tấn công khôi phục token từng byte một qua thời gian; cách sửa là <code>timingSafeEqual</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The attacker does not need to read anything. A subdomain can write cookies for the parent domain, so they overwrite the CSRF cookie with a value they know and then send that same value in the header from their own page — the guard compares two attacker-chosen strings and finds them equal. Signing the token as <code>HMAC(csrfKey, sessionId + "." + random)</code> and verifying the signature against the <em>current</em> session breaks it, because the attacker cannot compute a signature for the victim\'s session id. Timing is not the weakness here (the value is echoed back by the client, not guessed) and rejecting a missing header was already happening. Note the cheaper order from the lesson: <code>SameSite=Lax</code> with the <code>__Host-</code> prefix first, then the <code>Sec-Fetch-Site</code> check, and a token only when you are embedded cross-site, on a different origin, or stuck with an untrusted subdomain.',
            'Kẻ tấn công đâu cần đọc gì. Một tên miền con GHI được cookie cho tên miền cha, nên họ ghi đè cookie CSRF bằng một giá trị họ biết rồi gửi đúng giá trị ấy trong header từ trang của mình — lớp chắn đem so hai chuỗi do chính kẻ tấn công chọn và thấy chúng bằng nhau. Ký token thành <code>HMAC(khoaCsrf, maPhien + "." + ngauNhien)</code> rồi kiểm chữ ký với ĐÚNG phiên hiện tại là phá được, vì kẻ tấn công không tính nổi chữ ký cho mã phiên của nạn nhân. Thời gian không phải chỗ yếu ở đây (giá trị do chính client dội lại chứ có phải đoán đâu), còn chuyện từ chối khi thiếu header thì vốn đã làm rồi. Để ý thứ tự rẻ tiền hơn mà bài học đưa ra: <code>SameSite=Lax</code> kèm tiền tố <code>__Host-</code> trước, rồi tới phép kiểm <code>Sec-Fetch-Site</code>, và chỉ dùng token khi bạn bị nhúng xuyên trang, ở một origin khác, hoặc kẹt với một tên miền con không đáng tin.',
          ),
        }),

        mcq({
          prompt: B(
            'A team moves sessions out of PostgreSQL and into an encrypted cookie, arguing that it removes a lookup and scales with no shared state. Six months later they are asked for a working "sign out of all devices". What is the honest position?',
            'Một nhóm chuyển phiên khỏi PostgreSQL và nhét vào một cookie đã mã hoá, với lý lẽ rằng nó bỏ được một lượt tra cứu và mở rộng được mà không cần trạng thái dùng chung. Sáu tháng sau họ bị yêu cầu làm "đăng xuất khỏi mọi thiết bị" chạy thật. Cách nhìn trung thực là gì?',
          ),
          options: [
            B(
              'Add a denylist and the property is restored, at the cost of one Redis key per revoked session',
              'Thêm một danh sách chặn là khôi phục lại được tính chất đó, đổi lấy một khoá Redis cho mỗi phiên bị thu hồi',
            ),
            B(
              'Re-encrypt the cookie on every response with a fresh timestamp, which makes an old copy stop decrypting',
              'Mã hoá lại cookie ở mỗi phản hồi kèm một dấu thời gian mới, thế là bản sao cũ không giải mã được nữa',
            ),
            B(
              'The request cannot be satisfied without giving up the property they bought: the answer is a store consulted on every request, which is the database they removed, now added back with none of its other benefits',
              'Yêu cầu đó không thể đáp ứng mà vẫn giữ được cái tính chất họ vừa mua: câu trả lời là một kho phải hỏi ở MỌI request, tức đúng cái cơ sở dữ liệu họ vừa bỏ đi, giờ thêm lại mà chẳng còn cái lợi nào khác của nó',
            ),
            B(
              'It was never a real trade-off: a 4096-byte cookie holds a revocation list, so the cookie can revoke itself',
              'Vốn có đánh đổi gì đâu: cookie 4096 byte thừa sức chứa một danh sách thu hồi, nên cookie tự thu hồi được chính nó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A cookie session decrypts and states who you are until <code>expiresAt</code> passes; nothing on the server can withdraw that, and re-encrypting on every response only affects the copy in the honest user\'s browser, not the copy the attacker took. Every workaround — a denylist, a version counter, a "sessions changed at" timestamp — is a store you consult on every request, which is precisely the lookup the design existed to remove, and now you have it without the device list, the audit trail or the ability to ask any question about who was logged in when. The 4096-byte budget is shared with every other cookie on the origin and the whole thing is uploaded on every request, so it is a ceiling, not spare room. The lesson is to decide up front: if instant revocation is a requirement, this option is already excluded.',
            'Một phiên nằm trong cookie sẽ giải mã ra và khai báo bạn là ai cho tới khi <code>expiresAt</code> trôi qua; không thứ gì phía máy chủ rút lại được điều đó, còn mã hoá lại ở mỗi phản hồi thì chỉ tác động tới bản nằm trong trình duyệt của người dùng thật thà, không đụng gì tới bản kẻ tấn công đã cầm. Mọi cách chữa cháy — danh sách chặn, số phiên bản, một dấu thời gian "phiên đã đổi lúc" — đều là một cái kho phải HỎI ở mọi request, tức đúng cái lượt tra cứu mà thiết kế này sinh ra để bỏ đi, và giờ bạn có nó mà không kèm danh sách thiết bị, không kèm dấu vết kiểm toán, cũng không trả lời nổi câu hỏi nào về việc ai đã đăng nhập lúc nào. Ngân sách 4096 byte thì dùng chung với mọi cookie khác của origin đó, và cả cục ấy được tải lên ở MỌI request, nên nó là cái TRẦN chứ không phải chỗ trống. Bài học là quyết cho xong từ đầu: nếu thu hồi tức thì là một yêu cầu, thì lựa chọn này đã bị loại từ trước.',
          ),
        }),

        // ── Chương 4 — JWT ──────────────────────────────────────────────
        mcq({
          prompt: B(
            'A verifier parses the JWT into an object, re-serialises the header and payload with <code>JSON.stringify</code>, and recomputes the HMAC over the result. Every token it issued itself verifies; tokens minted by a second service fail. Why?',
            'Một bộ kiểm phân tích JWT thành object, tuần tự hoá lại header và payload bằng <code>JSON.stringify</code>, rồi tính lại HMAC trên kết quả đó. Mọi token do chính nó phát đều kiểm qua; token do một dịch vụ thứ hai đúc ra thì trượt. Vì sao?',
          ),
          options: [
            B(
              'The two services disagree on the secret, which only shows up on tokens that crossed the boundary',
              'Hai dịch vụ bất đồng về bí mật, và điều đó chỉ lộ ra ở những token đi qua ranh giới',
            ),
            B(
              'The second service signs the payload before adding <code>iat</code>, so the claim set differs by one field',
              'Dịch vụ thứ hai ký payload TRƯỚC khi thêm <code>iat</code>, nên tập claim lệch nhau một trường',
            ),
            B(
              'The signature covers the exact received ASCII string <code>header.payload</code>; re-serialising reorders keys and changes spacing, so it works only by luck when both sides happen to serialise identically',
              'Chữ ký phủ lên ĐÚNG chuỗi ASCII đã nhận, <code>header.payload</code>; tuần tự hoá lại làm đảo thứ tự khoá và đổi khoảng trắng, nên nó chỉ chạy được nhờ may mắn khi hai bên tình cờ tuần tự hoá giống hệt nhau',
            ),
            B(
              'The second service uses standard base64 while the verifier decodes base64url, and Node refuses the padding characters',
              'Dịch vụ thứ hai dùng base64 chuẩn còn bộ kiểm giải mã bằng base64url, và Node từ chối các ký tự đệm',
            ),
          ],
          correct: 2,
          explanation: EX(
            'JWS signs bytes, not objects. The verifier must HMAC the two received segments exactly as they arrived, then decode — this is the same rule as webhook signatures in Lesson 1.3, and it is why the ordering is verify first, parse second. A round trip through <code>JSON.parse</code> and <code>JSON.stringify</code> is not identity: key order follows insertion, spacing is normalised, and numbers are reformatted. The self-issued tokens pass only because the same code produced them. Two details worth knowing while you are here: a shared secret would fail on <em>every</em> such token, not selectively; and Node\'s decoder is lenient in both directions — <code>Buffer.from(x, \'base64url\')</code> happily accepts padded standard base64, and <code>\'base64\'</code> accepts base64url, so a hand-rolled parser will not catch an encoder that emits the wrong alphabet. A strict RFC 7515 parser will, and the tokens will break in a URL.',
            'JWS ký lên BYTE, không ký lên object. Bộ kiểm phải HMAC đúng hai đoạn đã nhận, y nguyên như lúc chúng tới, rồi mới giải mã — cùng đúng cái luật của chữ ký webhook ở bài 1.3, và đó là lý do thứ tự phải là kiểm trước, phân tích sau. Một vòng qua <code>JSON.parse</code> rồi <code>JSON.stringify</code> không phải phép đồng nhất: thứ tự khoá đi theo thứ tự chèn, khoảng trắng bị chuẩn hoá, số bị định dạng lại. Những token tự phát chỉ qua được vì cùng một đoạn mã sinh ra chúng. Hai chi tiết đáng biết luôn: nếu lệch bí mật thì MỌI token loại đó đều trượt chứ không trượt có chọn lọc; và bộ giải mã của Node dễ dãi cả hai chiều — <code>Buffer.from(x, \'base64url\')</code> nhận luôn base64 chuẩn có đệm, còn <code>\'base64\'</code> thì nhận base64url, nên một bộ phân tích tự viết sẽ KHÔNG bắt được một bộ mã hoá dùng sai bảng chữ. Một bộ phân tích chặt theo RFC 7515 thì bắt được, và token ấy sẽ vỡ khi nằm trong URL.',
          ),
        }),

        mcq({
          prompt: B(
            'A JWT session cookie has grown as claims were added "to save a lookup": permissions, a display name, a feature-flag map. Users on one browser report that they simply cannot log in — no error, the login call returns 200. What is the most likely cause?',
            'Một cookie phiên dạng JWT phình ra vì các claim được thêm dần "cho đỡ phải tra cứu": danh sách quyền, tên hiển thị, một bản đồ cờ tính năng. Người dùng trên một trình duyệt báo là họ đơn giản không đăng nhập được — không lỗi gì cả, lời gọi đăng nhập trả về 200. Nguyên nhân khả dĩ nhất là gì?',
          ),
          options: [
            B(
              'The token passed the 4096-byte cookie limit, so the browser silently refuses to store it and the next request carries no session',
              'Token vượt trần 4096 byte của cookie, nên trình duyệt lặng lẽ từ chối lưu nó và request kế tiếp không mang phiên nào',
            ),
            B(
              'The token passed the signature size limit, so the HMAC is truncated and verification fails on the next request',
              'Token vượt giới hạn kích thước chữ ký, nên HMAC bị cắt cụt và phép kiểm ở request kế tiếp bị trượt',
            ),
            B(
              'The feature-flag map contains a value that breaks JSON parsing after base64url decoding',
              'Bản đồ cờ tính năng chứa một giá trị làm hỏng việc phân tích JSON sau khi giải mã base64url',
            ),
            B(
              'The browser is enforcing <code>SameSite=Lax</code>, which drops cookies above a size threshold on cross-site navigation',
              'Trình duyệt đang áp <code>SameSite=Lax</code>, thứ làm rớt các cookie vượt một ngưỡng kích thước khi điều hướng xuyên trang',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Around 4 KB the cookie stops being set at all, with no error anywhere — the login response is a perfectly good 200, and the failure appears one request later as "not logged in". If the token travels in a header instead you meet your proxy\'s header limit, often 8 KB, in exactly the same silent way. Signatures do not truncate, and nothing about <code>SameSite</code> depends on size. The structural fix is the rule from Lesson 4.1: put an <b>id</b> in the token and look the rest up. Note that the size is paid on every single request — a 900-character token across forty requests on one page is about 35 KB of upload per page view, against 1.7 KB for a 43-character session id, and on a mobile connection that is a number the user feels.',
            'Quanh mốc 4 KB thì cookie thôi hẳn không được đặt nữa, mà chẳng có lỗi ở đâu cả — phản hồi đăng nhập vẫn là một mã 200 đẹp đẽ, và chỗ hỏng hiện ra ở request sau đó dưới dạng "chưa đăng nhập". Nếu token đi trong header thì bạn đụng trần header của proxy, thường 8 KB, và cũng lặng lẽ đúng như vậy. Chữ ký thì không bị cắt cụt, còn <code>SameSite</code> chẳng liên quan gì tới kích thước. Cách sửa về mặt cấu trúc là luật ở bài 4.1: nhét MỘT CÁI ID vào token rồi tra phần còn lại. Để ý rằng cái kích thước ấy phải trả ở MỌI request — một token 900 ký tự nhân bốn mươi request của một trang là khoảng 35 KB tải lên cho mỗi lượt xem trang, so với 1,7 KB của một mã phiên 43 ký tự; trên mạng di động thì đó là con số người dùng cảm nhận được.',
          ),
        }),

        mcq({
          prompt: B(
            'A verifier picks its key from the token\'s <code>kid</code>. Two variants are proposed. Which is safe, and why?' + code(
              'A:  const pem = fs.readFileSync(`/etc/keys/${kid}.pem`);\n' +
              '    if (!pem) throw new Error("kid khong biet");\n\n' +
              'B:  const key = KEYS[kid ?? ""];        // a fixed object, exact-match only\n' +
              '    if (!key) throw new Error("kid khong biet");',
            ),
            'Một bộ kiểm chọn khoá theo <code>kid</code> nằm trong token. Có hai biến thể được đề xuất. Cái nào an toàn, và vì sao?' + code(
              'A:  const pem = fs.readFileSync(`/etc/keys/${kid}.pem`);\n' +
              '    if (!pem) throw new Error("kid khong biet");\n\n' +
              'B:  const key = KEYS[kid ?? ""];        // một object cố định, chỉ khớp chính xác\n' +
              '    if (!key) throw new Error("kid khong biet");',
            ),
          ),
          options: [
            B(
              'A, because reading from disk means a rotated key is picked up without a redeploy, and the existence check already rejects an unknown <code>kid</code>',
              'A, vì đọc từ đĩa nghĩa là khoá vừa xoay được nhận ngay mà không phải deploy lại, và phép kiểm tồn tại đã từ chối <code>kid</code> lạ rồi',
            ),
            B(
              'B, because <code>kid</code> is attacker-controlled input: in A it is concatenated into a path, and <code>kid: "../../../../dev/null"</code> yields an empty key, which an attacker can HMAC with',
              'B, vì <code>kid</code> là đầu vào do kẻ tấn công kiểm soát: ở A nó bị nối thẳng vào một đường dẫn, và <code>kid: "../../../../dev/null"</code> cho ra một khoá RỖNG, thứ mà kẻ tấn công tự HMAC được',
            ),
            B(
              'Both are safe once <code>algorithms: [\'RS256\']</code> is pinned, because a pinned algorithm makes the key source irrelevant',
              'Cả hai đều an toàn một khi đã ghim <code>algorithms: [\'RS256\']</code>, vì ghim thuật toán rồi thì nguồn khoá không còn quan trọng',
            ),
            B(
              'Neither: a verifier must never select a key from the token, so the only safe design is a single key with no <code>kid</code> at all',
              'Chẳng cái nào: bộ kiểm không bao giờ được chọn khoá theo token, nên thiết kế an toàn duy nhất là một khoá duy nhất và không có <code>kid</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            '<code>kid</code> names <em>which</em> key, and that is a legitimate and necessary design — it is what makes rotation with two live keys possible. What makes it dangerous is that the value arrives from the network, so it is another query parameter: never concatenate it into a filesystem path, a SQL query or a template string. The path-traversal version is not theoretical, because HMAC with an empty key is a signature the attacker can compute themselves. Pinning the algorithm closes a different attack and does not help here. One more rule from the same lesson: an unknown <code>kid</code> is a rejected token — falling back to a default key turns "which key signed this" into "any key I have will do", which is algorithm confusion wearing a different hat.',
            '<code>kid</code> nói rằng khoá NÀO, và đó là một thiết kế chính đáng và cần thiết — chính nó làm cho việc xoay khoá với hai khoá cùng sống trở nên khả thi. Thứ làm nó nguy hiểm là giá trị ấy đi vào TỪ MẠNG, nên nó chỉ là một tham số truy vấn nữa: đừng bao giờ nối nó vào đường dẫn file, câu SQL hay chuỗi mẫu. Bản đi ngược thư mục không phải chuyện lý thuyết, vì HMAC với khoá RỖNG là một chữ ký mà kẻ tấn công tự tính được. Ghim thuật toán chặn một cú tấn công khác và không giúp gì ở đây. Thêm một luật nữa từ cùng bài học: <code>kid</code> lạ là token BỊ TỪ CHỐI — lùi về một khoá mặc định là biến "khoá nào đã ký cái này" thành "khoá nào tôi có cũng được", tức là lẫn lộn thuật toán đội một cái mũ khác.',
          ),
        }),

        mcq({
          prompt: B(
            'A request-logging middleware runs before authentication and needs the user id for its log line, so it calls <code>jwt.decode(token)</code> and reads <code>sub</code>. The route handler afterwards calls <code>jwt.verify</code> properly. Is the middleware a problem?',
            'Một middleware ghi log request chạy TRƯỚC phần xác thực và cần mã người dùng cho dòng log, nên nó gọi <code>jwt.decode(token)</code> rồi đọc <code>sub</code>. Handler của route phía sau thì gọi <code>jwt.verify</code> đàng hoàng. Middleware đó có phải là vấn đề không?',
          ),
          options: [
            B(
              'No: <code>decode</code> cannot grant access, and the real check still runs afterwards, so the worst case is a log line with a wrong id',
              'Không: <code>decode</code> không cấp quyền cho ai, và phép kiểm thật vẫn chạy phía sau, nên tệ nhất chỉ là một dòng log ghi sai mã',
            ),
            B(
              'No, provided the middleware also checks <code>exp</code>, which is the part <code>decode</code> skips',
              'Không, miễn là middleware kiểm thêm <code>exp</code>, đúng phần mà <code>decode</code> bỏ qua',
            ),
            B(
              'Yes, but only because <code>decode</code> throws on a malformed token and would crash the process before the handler runs',
              'Có, nhưng chỉ vì <code>decode</code> ném lỗi với token dị dạng và sẽ làm sập tiến trình trước khi handler kịp chạy',
            ),
            B(
              'Yes: <code>decode</code> parses without checking anything, so the id in the log is whatever the sender wrote — audit lines can be forged, and any code that later reads that value is trusting attacker input',
              'Có: <code>decode</code> phân tích mà không kiểm gì cả, nên cái mã trong log là thứ do người gửi TỰ VIẾT — dòng kiểm toán giả mạo được, và bất kỳ đoạn mã nào sau này đọc giá trị ấy là đang tin đầu vào của kẻ tấn công',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The middleware does not grant access, and if the log line were the end of it the damage would be bounded — but a forged identity in an audit log is exactly the thing an audit log exists to prevent, and Chapter 11 depends on those lines being trustworthy. The larger risk is drift: a value on <code>req</code> that came from an unverified token gets used later for rate-limit keys, cache keys, tenant selection or metrics, and none of those call sites can tell it was never checked. <code>decode</code> exists for tooling; every use of it in a request path is a decision to trust unverified input, and the audit from Lesson 4.2 is to grep for it and read every result. If the log needs an id, log it <em>after</em> verification, or log nothing.',
            'Middleware này không cấp quyền cho ai, và nếu câu chuyện dừng ở một dòng log thì thiệt hại còn giới hạn — nhưng một danh tính giả mạo nằm trong nhật ký kiểm toán đúng là thứ mà nhật ký kiểm toán sinh ra để ngăn, và cả chương 11 dựa vào việc những dòng ấy đáng tin. Rủi ro lớn hơn là sự trôi dạt: một giá trị gắn lên <code>req</code> mà đi ra từ token CHƯA kiểm rồi sẽ được dùng làm khoá giới hạn tần suất, khoá cache, chỗ chọn tenant hay số liệu thống kê, và không chỗ gọi nào trong số đó nhận ra rằng nó chưa từng được kiểm. <code>decode</code> sinh ra cho công cụ; mọi lần dùng nó trên đường đi của một request là một quyết định tin vào đầu vào chưa kiểm, và phép soát ở bài 4.2 là grep nó ra rồi đọc từng kết quả. Nếu log cần một cái mã, hãy ghi nó SAU khi kiểm, hoặc không ghi gì.',
          ),
        }),

        mcq({
          prompt: B(
            'Verification intermittently rejects fresh tokens with <code>JWTExpired</code>. Someone proposes raising <code>clockTolerance</code> from 5 seconds to 5 minutes. Access tokens live fifteen minutes. What is the effect, and what is the right fix?',
            'Việc kiểm token thỉnh thoảng từ chối cả token vừa phát với lỗi <code>JWTExpired</code>. Có người đề xuất nâng <code>clockTolerance</code> từ 5 giây lên 5 phút. Access token sống mười lăm phút. Hệ quả là gì, và cách sửa đúng là gì?',
          ),
          options: [
            B(
              'It extends every expired token by five minutes — a third of the whole lifetime — for every user; the real fix is a working NTP client, because a large tolerance is a workaround for an infrastructure problem',
              'Nó kéo dài MỌI token đã hết hạn thêm năm phút — một phần ba cả vòng đời — cho mọi người dùng; cách sửa thật là một NTP chạy đúng, vì một dung sai lớn chỉ là cách đi vòng qua một vấn đề hạ tầng',
            ),
            B(
              'It has no security effect, because <code>clockTolerance</code> only applies to <code>nbf</code> and never to <code>exp</code>',
              'Nó không ảnh hưởng gì tới an toàn, vì <code>clockTolerance</code> chỉ áp cho <code>nbf</code> chứ không bao giờ áp cho <code>exp</code>',
            ),
            B(
              'It fixes the symptom safely, because a token that is only five minutes past <code>exp</code> was issued recently and is therefore still trustworthy',
              'Nó chữa triệu chứng một cách an toàn, vì một token mới quá <code>exp</code> năm phút thì vừa được phát gần đây, nên vẫn còn đáng tin',
            ),
            B(
              'It makes verification non-deterministic, because the tolerance is applied to <code>iat</code> and therefore depends on when each verifier started',
              'Nó làm việc kiểm mất tính tất định, vì dung sai được áp lên <code>iat</code> nên phụ thuộc vào lúc mỗi bộ kiểm khởi động',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Tolerance widens the window on both sides of every time-based claim, <code>exp</code> included, for everyone. Turning a fifteen-minute token into a twenty-minute one is not a small change: the fifteen minutes was a deliberate choice about how long a stolen token keeps working, and this quietly renegotiates it. Servers drift by milliseconds when NTP works and by minutes when it does not, so single-digit seconds absorbs normal skew and anything larger is a symptom to investigate — <code>timedatectl status</code> and a working time client fix the cause, and they fix other things too. The related habit from the same lesson is to reject rather than repair: a missing <code>aud</code>, an unparseable <code>exp</code>, an unknown <code>iss</code> are all one identical 401, never "well, the signature was valid".',
            'Dung sai nới cửa sổ ra CẢ HAI PHÍA của mọi claim theo thời gian, kể cả <code>exp</code>, cho tất cả mọi người. Biến một token mười lăm phút thành hai mươi phút không phải thay đổi nhỏ: con số mười lăm phút là một lựa chọn có chủ đích về việc một token bị cắp còn dùng được bao lâu, và cái này âm thầm đàm phán lại nó. Máy chủ lệch nhau vài mili-giây khi NTP chạy đúng và lệch vài phút khi nó hỏng, nên dung sai một chữ số giây là đủ nuốt độ lệch bình thường, còn lớn hơn thế là một triệu chứng phải đi điều tra — <code>timedatectl status</code> và một dịch vụ đồng bộ giờ chạy đúng mới sửa được nguyên nhân, mà chúng còn sửa cả những thứ khác. Thói quen anh em cũng nằm trong bài đó: hãy TỪ CHỐI chứ đừng vá víu — thiếu <code>aud</code>, <code>exp</code> không phân tích được, <code>iss</code> lạ, tất cả đều là một mã 401 y hệt nhau, không bao giờ là "thì chữ ký vẫn hợp lệ mà".',
          ),
        }),

        mcq({
          prompt: B(
            'A single-page app on <code>app.vidu.com</code> talks to an API on <code>api.khac.com</code> — a different site, so a session cookie is not available. The chosen design keeps the access token in a JavaScript variable and the refresh token in an <code>HttpOnly</code> cookie on the API origin. What does that actually buy?',
            'Một ứng dụng một trang ở <code>app.vidu.com</code> nói chuyện với API ở <code>api.khac.com</code> — khác site, nên không dùng được cookie phiên. Thiết kế được chọn là giữ access token trong một biến JavaScript còn refresh token trong cookie <code>HttpOnly</code> ở phía origin của API. Cách đó THẬT SỰ mua được gì?',
          ),
          options: [
            B(
              'Nothing: any token reachable by script is equivalent to <code>localStorage</code>, so this is the same design with extra steps',
              'Chẳng gì cả: token nào script với tới được thì cũng tương đương <code>localStorage</code>, nên đây vẫn là thiết kế cũ với vài bước thừa',
            ),
            B(
              'XSS can still use the short-lived token while the page is open, but it cannot read the long-lived one, so the attacker never carries a working credential off the victim\'s machine',
              'XSS vẫn dùng được cái token sống ngắn trong lúc trang đang mở, nhưng không đọc nổi cái sống dài, nên kẻ tấn công không bao giờ mang được một tín vật còn dùng được ra khỏi máy nạn nhân',
            ),
            B(
              'It removes CSRF, because the refresh cookie is on a different origin from the page that triggers the refresh',
              'Nó xoá bỏ CSRF, vì cookie refresh nằm ở một origin khác với trang gây ra lượt refresh',
            ),
            B(
              'It removes the need for a refresh endpoint, because a variable survives a page reload while a cookie does not',
              'Nó bỏ được nhu cầu có endpoint refresh, vì một biến sống qua lượt tải lại trang còn cookie thì không',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The distinction is exfiltration versus proxying. A token in <code>localStorage</code> leaves in one <code>fetch</code> and then works from the attacker\'s machine, at leisure, outside your rate limits and anomaly detection, until it expires. An in-memory token can be used by a script while the page is open and dies with the tab; the refresh token, which is the long-lived half, is never reachable by JavaScript at all. CSRF is not removed — the refresh call sends a cookie, so that endpoint needs the Chapter 3 defences. And it is the variable that does <em>not</em> survive a reload, which is exactly why the refresh endpoint exists: on page load the access token is <code>null</code>, one call restores it, and the user sees nothing. Keep that retry to exactly once and share a single in-flight promise across concurrent callers, or ten simultaneous 401s become ten refreshes.',
            'Khác biệt nằm ở chỗ MANG ĐI được hay chỉ NHỜ MÁY NẠN NHÂN LÀM HỘ. Một token trong <code>localStorage</code> ra đi trong một lời gọi <code>fetch</code> rồi hoạt động ngay trên máy kẻ tấn công, thong thả, nằm ngoài mọi giới hạn tần suất và mọi phép dò bất thường của bạn, cho tới khi nó hết hạn. Một token nằm trong bộ nhớ thì script dùng được trong lúc trang còn mở và chết theo cái tab; còn refresh token, tức nửa sống dài, thì JavaScript không bao giờ với tới. CSRF KHÔNG bị xoá bỏ — lời gọi refresh có gửi cookie, nên đúng endpoint đó cần các lớp phòng thủ ở chương 3. Và chính cái BIẾN mới là thứ không sống qua lượt tải lại, đó đúng là lý do endpoint refresh tồn tại: lúc trang nạp, access token bằng <code>null</code>, một lời gọi là có lại, người dùng không thấy gì. Hãy giữ cho lượt thử lại đó đúng MỘT lần và cho mọi bên gọi cùng chờ chung một promise đang bay, nếu không thì mười cái 401 đồng thời sẽ thành mười lượt refresh.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            "<p><b>Q31 — A session cookie, and the guard around it (sections 0, 1 and 3).</b> The starter block gives you a real <code>node:http</code> server, a deterministic token source, a fake clock in milliseconds, an in-memory <code>SESSIONS</code> map and one allowed origin. Write six functions.</p><ul><li><code>issueSession(userId)</code> — mint a token with <code>nextToken()</code> and store the row under <b>sha256 of the token</b>, never the token itself. The row carries <code>createdAt</code>, <code>activeAt</code>, <code>absoluteExpiresAt</code> (now + <code>ABSOLUTE_MS</code>) and <code>revokedAt: null</code>. Return the raw token; it is returned exactly once.</li><li><code>sessionCookie(token)</code> — the full <code>Set-Cookie</code> value: the name <code>__Host-session</code>, then <code>Path=/</code>, <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite=Lax</code> and <code>Max-Age</code> in <b>seconds</b>, in that order.</li><li><code>readCookie(header, name)</code> — pull one cookie out of a <code>Cookie</code> header that holds several, matching the name <b>exactly</b>. Return <code>null</code> when the header is missing or the name is not there.</li><li><code>resolveSession(token)</code> — look the row up by hash and return it only when it is not revoked, is before <code>absoluteExpiresAt</code>, and has been active within <code>IDLE_MS</code>. On success slide <code>activeAt</code> to <code>NOW</code>. Otherwise <code>null</code>.</li><li><code>revoke(token)</code> — stamp <code>revokedAt</code> on a live row, and do nothing to a row that is already revoked or does not exist.</li><li><code>crossSiteVerdict(req)</code> — return <code>\"allow\"</code> or <code>\"block\"</code>. <code>GET</code>, <code>HEAD</code> and <code>OPTIONS</code> are always allowed. Otherwise, if <code>sec-fetch-site</code> is present, allow only <code>same-origin</code> and <code>none</code>; if it is absent, fall back to the <code>Origin</code> header against <code>ALLOWED_ORIGINS</code>, and block when there is no <code>Origin</code> either.</li></ul><p>The handler below is given: it revokes the presented session on login and issues a brand-new one, because privilege is never raised in place. Keep the fixtures and the harness exactly as they are, and do not install anything.</p><p>The harness calls the server with <code>fetch</code>, so it must <b>close every keep-alive connection before closing the server</b> — that line is already written for you, and removing it hangs the process.</p>",
            "<p><b>Câu 31 — Một cookie phiên, và lớp chắn quanh nó (mục 0, chương 1 và 3).</b> Khối đề cho sẵn một máy chủ <code>node:http</code> thật, một nguồn token tất định, một đồng hồ giả tính bằng mili-giây, bảng <code>SESSIONS</code> trong bộ nhớ và một origin được phép. Hãy viết sáu hàm.</p><ul><li><code>issueSession(userId)</code> — đúc token bằng <code>nextToken()</code> rồi cất hàng dữ liệu dưới khoá là <b>sha256 CỦA token</b>, không bao giờ là chính token. Hàng đó mang <code>createdAt</code>, <code>activeAt</code>, <code>absoluteExpiresAt</code> (hiện tại + <code>ABSOLUTE_MS</code>) và <code>revokedAt: null</code>. Trả về token thô; nó chỉ được trả về đúng một lần.</li><li><code>sessionCookie(token)</code> — trọn giá trị <code>Set-Cookie</code>: tên <code>__Host-session</code>, rồi <code>Path=/</code>, <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite=Lax</code> và <code>Max-Age</code> tính bằng <b>giây</b>, theo đúng thứ tự đó.</li><li><code>readCookie(header, name)</code> — lấy ra một cookie từ một header <code>Cookie</code> đang chứa nhiều cái, khớp tên <b>chính xác</b>. Trả <code>null</code> khi thiếu header hoặc không có tên đó.</li><li><code>resolveSession(token)</code> — tra hàng theo băm và chỉ trả về khi nó chưa bị thu hồi, còn trước <code>absoluteExpiresAt</code>, và có hoạt động trong vòng <code>IDLE_MS</code>. Thành công thì đẩy <code>activeAt</code> tới <code>NOW</code>. Không thì trả <code>null</code>.</li><li><code>revoke(token)</code> — đóng dấu <code>revokedAt</code> lên một hàng còn sống, và không đụng gì tới hàng đã thu hồi hoặc không tồn tại.</li><li><code>crossSiteVerdict(req)</code> — trả về <code>\"allow\"</code> hoặc <code>\"block\"</code>. <code>GET</code>, <code>HEAD</code> và <code>OPTIONS</code> luôn được cho qua. Ngoài ra, nếu có <code>sec-fetch-site</code> thì chỉ cho qua <code>same-origin</code> và <code>none</code>; nếu không có thì lùi về header <code>Origin</code> đối chiếu với <code>ALLOWED_ORIGINS</code>, và chặn khi cũng chẳng có <code>Origin</code>.</li></ul><p>Phần handler bên dưới là đề cho sẵn: khi đăng nhập nó thu hồi phiên đang được trình ra rồi phát một phiên hoàn toàn mới, vì đặc quyền không bao giờ được nâng tại chỗ. Giữ nguyên phần dữ liệu cho sẵn và phần khung chạy, và không cài thêm thư viện nào.</p><p>Khung chạy gọi máy chủ bằng <code>fetch</code>, nên nó phải <b>đóng mọi kết nối keep-alive trước khi đóng máy chủ</b> — dòng đó đã viết sẵn cho bạn, gỡ nó ra là tiến trình treo.</p>",
          ),
          language: 'javascript',
          starterCode: "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n'use strict';\nconst http = require('node:http');\nconst crypto = require('node:crypto');\n\n// Nguồn token TẤT ĐỊNH — trên production đây phải là crypto.randomBytes(32).\nlet n = 0;\nconst nextToken = () => 'tk_' + String(++n).padStart(2, '0') + '_KHONG_PHAI_TOKEN_THAT';\n\n// Đồng hồ giả, tính bằng mili-giây.\nlet NOW = 1_800_000_000_000;\nconst IDLE_MS = 2 * 60 * 60 * 1000;\nconst ABSOLUTE_MS = 30 * 24 * 60 * 60 * 1000;\n\n// Bảng phiên trong bộ nhớ, khoá là sha256 CỦA token — không phải token.\nconst SESSIONS = new Map();\nconst sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');\n\nconst ALLOWED_ORIGINS = new Set(['https://vidu.com']);\n\n// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n\nfunction issueSession(userId) {\n  // TODO\n}\n\nfunction sessionCookie(token) {\n  // TODO\n}\n\nfunction readCookie(header, name) {\n  // TODO\n}\n\nfunction resolveSession(token) {\n  // TODO\n}\n\nfunction revoke(token) {\n  // TODO\n}\n\nfunction crossSiteVerdict(req) {\n  // TODO\n}\n\n// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\nconst json = (res, code, body, extra) => {\n  const h = { 'content-type': 'application/json' };\n  if (extra) h['set-cookie'] = extra;\n  res.writeHead(code, h);\n  res.end(JSON.stringify(body));\n};\n\nconst server = http.createServer((req, res) => {\n  const url = req.url.split('?')[0];\n  const presented = readCookie(req.headers.cookie, '__Host-session');\n\n  if (crossSiteVerdict(req) === 'block') return json(res, 403, { error: 'cross-site' });\n\n  if (url === '/login' && req.method === 'POST') {\n    revoke(presented);\n    const token = issueSession('u_1');\n    return json(res, 200, { ok: true }, sessionCookie(token));\n  }\n  if (url === '/me' && req.method === 'GET') {\n    const s = resolveSession(presented);\n    return s ? json(res, 200, { user: s.userId }) : json(res, 401, { error: 'no session' });\n  }\n  if (url === '/change-email' && req.method === 'POST') {\n    const s = resolveSession(presented);\n    return s ? json(res, 200, { changed: true }) : json(res, 401, { error: 'no session' });\n  }\n  return json(res, 404, { error: 'not found' });\n});\n\nconst P = (label, v) => console.log(label.padEnd(38) + v);\n\nasync function main() {\n  await new Promise((r) => server.listen(0, '127.0.0.1', r));\n  const base = 'http://127.0.0.1:' + server.address().port;\n  const call = async (path, opt) => {\n    const r = await fetch(base + path, opt);\n    const body = await r.json();\n    return { status: r.status, body, cookies: r.headers.getSetCookie() };\n  };\n\n  console.log('== login issues a cookie ==');\n  const a = await call('/login', { method: 'POST', headers: { 'sec-fetch-site': 'same-origin' } });\n  P('status', a.status);\n  P('set-cookie', a.cookies[0]);\n  const token1 = a.cookies[0].split(';')[0].split('=')[1];\n  P('nothing in the table is the token', ![...SESSIONS.keys()].includes(token1));\n\n  console.log('== the cookie works, and only the right name ==');\n  P('GET /me with the cookie', (await call('/me', { headers: { cookie: 'theme=dark; __Host-session=' + token1 } })).status);\n  P('GET /me with the wrong name', (await call('/me', { headers: { cookie: '__Host-sess=' + token1 } })).status);\n  P('GET /me with no cookie', (await call('/me')).status);\n\n  console.log('== login replaces the session, never raises it ==');\n  const b = await call('/login', { method: 'POST', headers: { 'sec-fetch-site': 'same-origin', cookie: '__Host-session=' + token1 } });\n  const token2 = b.cookies[0].split(';')[0].split('=')[1];\n  P('a different token', token1 !== token2);\n  P('the planted one now answers', (await call('/me', { headers: { cookie: '__Host-session=' + token1 } })).status);\n  P('the new one answers', (await call('/me', { headers: { cookie: '__Host-session=' + token2 } })).status);\n\n  console.log('== the cross-site guard ==');\n  const post = (h) => call('/change-email', { method: 'POST', headers: Object.assign({ cookie: '__Host-session=' + token2 }, h) });\n  P('sec-fetch-site: same-origin', (await post({ 'sec-fetch-site': 'same-origin' })).status);\n  P('sec-fetch-site: none', (await post({ 'sec-fetch-site': 'none' })).status);\n  P('sec-fetch-site: same-site', (await post({ 'sec-fetch-site': 'same-site' })).status);\n  P('sec-fetch-site: cross-site', (await post({ 'sec-fetch-site': 'cross-site' })).status);\n  P('no sec-fetch-site, origin ours', (await post({ origin: 'https://vidu.com' })).status);\n  P('no sec-fetch-site, origin evil', (await post({ origin: 'https://evil.example' })).status);\n  P('no sec-fetch-site, no origin', (await post({})).status);\n  P('GET is never blocked', (await call('/me', { headers: { 'sec-fetch-site': 'cross-site', cookie: '__Host-session=' + token2 } })).status);\n\n  console.log('== the two expiries ==');\n  NOW += 3 * 60 * 60 * 1000;\n  P('after 3h idle', (await call('/me', { headers: { cookie: '__Host-session=' + token2 } })).status);\n  const token3 = (await call('/login', { method: 'POST', headers: { 'sec-fetch-site': 'same-origin' } })).cookies[0].split(';')[0].split('=')[1];\n  for (let i = 0; i < 40; i++) { NOW += 60 * 60 * 1000; await call('/me', { headers: { cookie: '__Host-session=' + token3 } }); }\n  P('kept warm for 40 more hours', (await call('/me', { headers: { cookie: '__Host-session=' + token3 } })).status);\n  NOW += ABSOLUTE_MS;\n  P('past the absolute ceiling', (await call('/me', { headers: { cookie: '__Host-session=' + token3 } })).status);\n\n  // fetch của Node giữ keep-alive: KHÔNG đóng hết kết nối thì tiến trình treo.\n  server.closeAllConnections();\n  await new Promise((r) => server.close(r));\n  console.log('server closed');\n}\nmain();\n",
          expectedOutput: "== login issues a cookie ==\nstatus                                200\nset-cookie                            __Host-session=tk_01_KHONG_PHAI_TOKEN_THAT; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000\nnothing in the table is the token     true\n== the cookie works, and only the right name ==\nGET /me with the cookie               200\nGET /me with the wrong name           401\nGET /me with no cookie                401\n== login replaces the session, never raises it ==\na different token                     true\nthe planted one now answers           401\nthe new one answers                   200\n== the cross-site guard ==\nsec-fetch-site: same-origin           200\nsec-fetch-site: none                  200\nsec-fetch-site: same-site             403\nsec-fetch-site: cross-site            403\nno sec-fetch-site, origin ours        200\nno sec-fetch-site, origin evil        403\nno sec-fetch-site, no origin          403\nGET is never blocked                  200\n== the two expiries ==\nafter 3h idle                         401\nkept warm for 40 more hours           200\npast the absolute ceiling             401\nserver closed",
          sampleSolution: "function issueSession(userId) {\n  const token = nextToken();\n  SESSIONS.set(sha256(token), {\n    userId,\n    createdAt: NOW,\n    activeAt: NOW,\n    absoluteExpiresAt: NOW + ABSOLUTE_MS,\n    revokedAt: null,\n  });\n  return token;\n}\n\nfunction sessionCookie(token) {\n  return '__Host-session=' + token\n    + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=' + Math.floor(ABSOLUTE_MS / 1000);\n}\n\nfunction readCookie(header, name) {\n  if (typeof header !== 'string' || header === '') return null;\n  for (const part of header.split(';')) {\n    const i = part.indexOf('=');\n    if (i < 0) continue;\n    if (part.slice(0, i).trim() === name) return part.slice(i + 1).trim();\n  }\n  return null;\n}\n\nfunction resolveSession(token) {\n  if (!token) return null;\n  const row = SESSIONS.get(sha256(token));\n  if (!row) return null;\n  if (row.revokedAt !== null) return null;\n  if (NOW >= row.absoluteExpiresAt) return null;\n  if (NOW - row.activeAt >= IDLE_MS) return null;\n  row.activeAt = NOW;\n  return row;\n}\n\nfunction revoke(token) {\n  const row = token ? SESSIONS.get(sha256(token)) : null;\n  if (row && row.revokedAt === null) row.revokedAt = NOW;\n}\n\nfunction crossSiteVerdict(req) {\n  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return 'allow';\n  const site = req.headers['sec-fetch-site'];\n  if (typeof site === 'string' && site !== '') {\n    return (site === 'same-origin' || site === 'none') ? 'allow' : 'block';\n  }\n  const origin = req.headers.origin;\n  if (typeof origin !== 'string' || origin === '') return 'block';\n  return ALLOWED_ORIGINS.has(origin) ? 'allow' : 'block';\n}\n",
        }),

        codeQ({
          points: 5,
          prompt: B(
            "<p><b>Q32 — Minting a token, and auditing what went into it (chapters 1 and 4).</b> The starter block gives you a clearly fake secret, a <code>kid</code>, the issuer and audience, a clock in <b>seconds</b>, a deterministic <code>jti</code> source, and a <code>verify()</code> that is already written — it pins the algorithm, matches the <code>kid</code>, compares the signature with <code>timingSafeEqual</code> and checks the claims. Your job is the issuing half. Write four functions.</p><ul><li><code>b64url(obj)</code> — JSON, then base64url: the URL-safe alphabet, and <b>no padding</b>.</li><li><code>seconds(duration)</code> — turn <code>\"30s\"</code>, <code>\"15m\"</code>, <code>\"24h\"</code>, <code>\"7d\"</code> into a whole number of seconds. Anything else returns <code>null</code>; the point of a duration string is that <code>exp</code> is never computed by hand.</li><li><code>mint(claims, ttl)</code> — build the header <code>{ alg: \"HS256\", typ: \"JWT\", kid: KID }</code>, add <code>iss</code>, <code>aud</code>, <code>iat</code>, <code>exp</code> and a fresh <code>jti</code> to the caller’s claims, sign <code>header.payload</code> with HMAC-SHA256, and return <code>{ token }</code>. On a duration the parser refuses, return <code>{ error: \"bad duration\" }</code> and mint nothing.</li><li><code>auditPayload(payload)</code> — return the list of problems, in this order: one <code>private-claim:&lt;name&gt;</code> for each name in <code>PRIVATE_CLAIMS</code> that is present, then <code>no-exp</code> when <code>exp</code> is missing or <code>exp-in-milliseconds</code> when it is a number above <code>1e11</code>, then one <code>unnamespaced:&lt;name&gt;</code> for every claim that is neither registered nor a URI, then <code>too-big</code> when the serialised payload passes <code>COOKIE_BUDGET</code>. An empty list means the payload is clean.</li></ul><p>Keep the fixtures and the harness exactly as they are, and do not install anything. Note what the harness proves: two calls with the same input must not produce the same token, and the token must contain no <code>+</code>, no <code>/</code> and no <code>=</code>.</p>",
            "<p><b>Câu 32 — Đúc một token, và soát lại thứ vừa nhét vào nó (chương 1 và 4).</b> Khối đề cho sẵn một bí mật ghi rõ là GIẢ, một <code>kid</code>, tên nơi phát hành và tên bên nhận, một đồng hồ tính bằng <b>giây</b>, một nguồn <code>jti</code> tất định, và một hàm <code>verify()</code> đã viết sẵn — nó ghim thuật toán, khớp <code>kid</code>, so chữ ký bằng <code>timingSafeEqual</code> và kiểm các claim. Việc của bạn là nửa PHÁT HÀNH. Hãy viết bốn hàm.</p><ul><li><code>b64url(obj)</code> — JSON rồi base64url: bảng chữ an toàn cho URL, và <b>không có ký tự đệm</b>.</li><li><code>seconds(duration)</code> — đổi <code>\"30s\"</code>, <code>\"15m\"</code>, <code>\"24h\"</code>, <code>\"7d\"</code> thành số giây nguyên. Thứ khác trả <code>null</code>; ý nghĩa của một chuỗi thời lượng chính là để <code>exp</code> không bao giờ phải tính bằng tay.</li><li><code>mint(claims, ttl)</code> — dựng header <code>{ alg: \"HS256\", typ: \"JWT\", kid: KID }</code>, thêm <code>iss</code>, <code>aud</code>, <code>iat</code>, <code>exp</code> và một <code>jti</code> mới vào phần claim người gọi đưa, ký <code>header.payload</code> bằng HMAC-SHA256, rồi trả <code>{ token }</code>. Với một thời lượng mà bộ phân tích từ chối thì trả <code>{ error: \"bad duration\" }</code> và không đúc gì cả.</li><li><code>auditPayload(payload)</code> — trả về danh sách vấn đề, theo đúng thứ tự này: mỗi tên có mặt trong <code>PRIVATE_CLAIMS</code> cho ra một <code>private-claim:&lt;tên&gt;</code>, rồi <code>no-exp</code> khi thiếu <code>exp</code> hoặc <code>exp-in-milliseconds</code> khi nó là số lớn hơn <code>1e11</code>, rồi mỗi claim không phải claim đã đăng ký và cũng không phải URI cho ra một <code>unnamespaced:&lt;tên&gt;</code>, cuối cùng là <code>too-big</code> khi payload tuần tự hoá ra vượt <code>COOKIE_BUDGET</code>. Danh sách rỗng nghĩa là payload sạch.</li></ul><p>Giữ nguyên phần dữ liệu cho sẵn và phần khung chạy, và không cài thêm thư viện nào. Để ý thứ khung chạy chứng minh: hai lời gọi cùng đầu vào KHÔNG được ra cùng một token, và trong token không được có <code>+</code>, không có <code>/</code>, không có <code>=</code>.</p>",
          ),
          language: 'javascript',
          starterCode: "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n'use strict';\nconst crypto = require('node:crypto');\n\n// Bí mật GIẢ, chỉ tồn tại trong bài thi. Trên production nó phải là 32 byte\n// từ CSPRNG và nằm trong biến môi trường, không bao giờ trong mã nguồn.\nconst SECRET = 'BI-MAT-GIA-CUA-DE-THI-khong-dung-o-dau-khac';\nconst KID = '2026-08';\nconst ISS = 'https://vidu.com';\nconst AUD = 'vidu-api';\n\n// Đồng hồ giả: giây, không phải mili-giây.\nconst IAT = 1_800_000_000;\n\n// Nguồn jti tất định. Trên production: crypto.randomUUID().\nlet n = 0;\nconst nextJti = () => 'jti_' + String(++n).padStart(2, '0');\n\n// Những khoá KHÔNG được phép nằm trong payload của một token ai cũng đọc được.\nconst PRIVATE_CLAIMS = ['email', 'phone', 'address', 'nationalId', 'password'];\n// Claim đã đăng ký trong RFC 7519 — mọi tên KHÁC phải mang tiền tố URI.\nconst REGISTERED = ['iss', 'sub', 'aud', 'exp', 'nbf', 'iat', 'jti'];\nconst COOKIE_BUDGET = 4096;\n\n// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n\nfunction b64url(obj) {\n  // TODO\n}\n\nfunction seconds(duration) {\n  // TODO\n}\n\nfunction mint(claims, ttl) {\n  // TODO\n}\n\nfunction auditPayload(payload) {\n  // TODO\n}\n\n// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n// Bộ kiểm CHO SẴN: ghim thuật toán, so chữ ký hằng thời gian, kiểm exp.\nfunction verify(token, now) {\n  const parts = String(token).split('.');\n  if (parts.length !== 3) return 'malformed';\n  const [h, p, s] = parts;\n  let header;\n  try { header = JSON.parse(Buffer.from(h, 'base64url').toString('utf8')); } catch { return 'malformed'; }\n  if (header.alg !== 'HS256') return 'alg not allowed';\n  if (header.kid !== KID) return 'unknown kid';\n  const expected = crypto.createHmac('sha256', SECRET).update(h + '.' + p).digest();\n  const got = Buffer.from(s, 'base64url');\n  if (got.length !== expected.length || !crypto.timingSafeEqual(got, expected)) return 'bad signature';\n  const payload = JSON.parse(Buffer.from(p, 'base64url').toString('utf8'));\n  if (typeof payload.exp !== 'number') return 'no exp';\n  if (now >= payload.exp) return 'expired';\n  if (payload.iss !== ISS) return 'wrong issuer';\n  if (payload.aud !== AUD) return 'wrong audience';\n  return 'ACCEPT sub=' + payload.sub;\n}\n\nconst P = (label, v) => console.log(String(label).padEnd(34) + v);\n\nconsole.log('== durations ==');\nfor (const d of ['30s', '15m', '24h', '7d', '15', '15 phút', 'PT15M', '']) {\n  P(JSON.stringify(d), seconds(d));\n}\n\nconsole.log('== one minted token ==');\nconst first = mint({ sub: 'u_1', 'https://vidu.com/role': 'USER' }, '15m');\nconsole.log(first.token);\nconst seg = first.token.split('.');\nP('segments', seg.length);\nP('header', Buffer.from(seg[0], 'base64url').toString('utf8'));\nP('payload', Buffer.from(seg[1], 'base64url').toString('utf8'));\nP('padding or + or / present', /[+/=]/.test(first.token));\nP('verify at iat', verify(first.token, IAT));\nP('verify one second before exp', verify(first.token, IAT + 899));\nP('verify at exp', verify(first.token, IAT + 900));\n\nconsole.log('== a second token is not the first ==');\nconst second = mint({ sub: 'u_1', 'https://vidu.com/role': 'USER' }, '15m');\nP('same input, same token', second.token === first.token);\nP('jti differs', JSON.parse(Buffer.from(second.token.split('.')[1], 'base64url').toString()).jti);\n\nconsole.log('== ttl the library refuses ==');\nP('mint(..., \"15\")', JSON.stringify(mint({ sub: 'u_1' }, '15')));\n\nconsole.log('== audit ==');\nconst CASES = [\n  { sub: 'u_1', iss: ISS, aud: AUD, iat: IAT, exp: IAT + 900, jti: 'jti_x' },\n  { sub: 'u_1', exp: (IAT + 900) * 1000 },\n  { sub: 'u_1', iat: IAT },\n  { sub: 'u_1', exp: IAT + 900, email: 'an@vidu.com', phone: '09xx' },\n  { sub: 'u_1', exp: IAT + 900, role: 'ADMIN', tenant: 't_1' },\n  { sub: 'u_1', exp: IAT + 900, 'https://vidu.com/role': 'ADMIN' },\n  { sub: 'u_1', exp: IAT + 900, 'https://vidu.com/perms': 'x'.repeat(5000) },\n];\nfor (const c of CASES) {\n  const shown = JSON.stringify(c).length > 46 ? JSON.stringify(c).slice(0, 43) + '...' : JSON.stringify(c);\n  console.log(shown.padEnd(50) + (auditPayload(c).join(' ') || 'clean'));\n}\n",
          expectedOutput: "== durations ==\n\"30s\"                             30\n\"15m\"                             900\n\"24h\"                             86400\n\"7d\"                              604800\n\"15\"                              null\n\"15 phút\"                         null\n\"PT15M\"                           null\n\"\"                                null\n== one minted token ==\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjIwMjYtMDgifQ.eyJzdWIiOiJ1XzEiLCJodHRwczovL3ZpZHUuY29tL3JvbGUiOiJVU0VSIiwiaXNzIjoiaHR0cHM6Ly92aWR1LmNvbSIsImF1ZCI6InZpZHUtYXBpIiwiaWF0IjoxODAwMDAwMDAwLCJleHAiOjE4MDAwMDA5MDAsImp0aSI6Imp0aV8wMSJ9.BPEtTcinnarYTEQUsabluK7UAno6R-kfNMVHGHjI8pY\nsegments                          3\nheader                            {\"alg\":\"HS256\",\"typ\":\"JWT\",\"kid\":\"2026-08\"}\npayload                           {\"sub\":\"u_1\",\"https://vidu.com/role\":\"USER\",\"iss\":\"https://vidu.com\",\"aud\":\"vidu-api\",\"iat\":1800000000,\"exp\":1800000900,\"jti\":\"jti_01\"}\npadding or + or / present         false\nverify at iat                     ACCEPT sub=u_1\nverify one second before exp      ACCEPT sub=u_1\nverify at exp                     expired\n== a second token is not the first ==\nsame input, same token            false\njti differs                       jti_02\n== ttl the library refuses ==\nmint(..., \"15\")                   {\"error\":\"bad duration\"}\n== audit ==\n{\"sub\":\"u_1\",\"iss\":\"https://vidu.com\",\"aud\"...    clean\n{\"sub\":\"u_1\",\"exp\":1800000900000}                 exp-in-milliseconds\n{\"sub\":\"u_1\",\"iat\":1800000000}                    no-exp\n{\"sub\":\"u_1\",\"exp\":1800000900,\"email\":\"an@v...    private-claim:email private-claim:phone\n{\"sub\":\"u_1\",\"exp\":1800000900,\"role\":\"ADMIN...    unnamespaced:role unnamespaced:tenant\n{\"sub\":\"u_1\",\"exp\":1800000900,\"https://vidu...    clean\n{\"sub\":\"u_1\",\"exp\":1800000900,\"https://vidu...    too-big",
          sampleSolution: "function b64url(obj) {\n  return Buffer.from(JSON.stringify(obj), 'utf8').toString('base64url');\n}\n\nfunction seconds(duration) {\n  const m = /^(\\d+)(s|m|h|d)$/.exec(String(duration));\n  if (!m) return null;\n  const unit = { s: 1, m: 60, h: 3600, d: 86400 }[m[2]];\n  return Number(m[1]) * unit;\n}\n\nfunction mint(claims, ttl) {\n  const ttlSeconds = seconds(ttl);\n  if (ttlSeconds === null) return { error: 'bad duration' };\n  const header = { alg: 'HS256', typ: 'JWT', kid: KID };\n  const payload = Object.assign({}, claims, {\n    iss: ISS,\n    aud: AUD,\n    iat: IAT,\n    exp: IAT + ttlSeconds,\n    jti: nextJti(),\n  });\n  const signingInput = b64url(header) + '.' + b64url(payload);\n  const sig = crypto.createHmac('sha256', SECRET).update(signingInput).digest('base64url');\n  return { token: signingInput + '.' + sig };\n}\n\nfunction auditPayload(payload) {\n  const problems = [];\n  for (const name of PRIVATE_CLAIMS) {\n    if (Object.prototype.hasOwnProperty.call(payload, name)) problems.push('private-claim:' + name);\n  }\n  if (!Object.prototype.hasOwnProperty.call(payload, 'exp')) problems.push('no-exp');\n  else if (typeof payload.exp === 'number' && payload.exp > 1e11) problems.push('exp-in-milliseconds');\n  for (const name of Object.keys(payload)) {\n    if (REGISTERED.includes(name)) continue;\n    if (PRIVATE_CLAIMS.includes(name)) continue;\n    if (!name.includes('://')) problems.push('unnamespaced:' + name);\n  }\n  if (Buffer.byteLength(JSON.stringify(payload), 'utf8') > COOKIE_BUDGET) problems.push('too-big');\n  return problems;\n}\n",
        }),
      ],
    },
  ],
};
