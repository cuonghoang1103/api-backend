/**
 * Authentication — Progress Test 2 (Chương 5 → Chương 8).
 *
 * Đề tự soạn, bám sát `content/courses/authentication/s05-refresh.mjs` …
 * `s08-oauth-oidc.mjs`. 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong
 * phòng thi.
 *
 * ⚠️ MỌI con số, mọi độ dài chuỗi, mọi kết quả phân tích URL và mọi phép tính
 * xác suất trong đề này đều được ĐO THẬT trên **Node.js v22.21.0** (macOS,
 * darwin arm64, 10/09/2026), chỉ bằng `node:crypto` và `node:url` — không gói
 * ngoài nào, không gọi ra Internet, không đọc `.env`, không đụng cơ sở dữ
 * liệu. Mọi token, mã phiên và bí mật trong đề đều là giá trị GIẢ sinh tại chỗ
 * và có ghi rõ là giả; không có khối khoá riêng tư nào được in ra.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ BỐN CHỖ MÁY KHÁC (HOẶC CHÍNH XÁC HƠN) GIÁO TRÌNH — đề THEO MÁY
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. Bài 7.3 nói mười lần đoán mỗi giờ, với ba bước TOTP hợp lệ tại mỗi thời
 *    điểm, cho "khoảng một phần ba mươi tám nghìn mỗi giờ". Tính thật:
 *        1 − (1 − 3/10^6)^10 = 3,0000 × 10^-5  →  1 trên **33.334**
 *    Lệch khoảng 14%. Câu 20 hỏi CƠ CHẾ (vì sao sáu chữ số là đủ khi có giới
 *    hạn tần suất), không hỏi con số.
 *
 * 2. Bài 7.3 mô tả bảng chữ của mã khôi phục là "base32 bỏ I, O, 0 và 1" rồi
 *    tính 32^10 = 1,126e15 = 50 bit. Hai vế ấy chỉ khớp nhau nếu bảng chữ có
 *    ĐÚNG 32 ký tự. Đo trên chính mười mã mẫu bài in ra, tập ký tự thật là
 *        23456789ABCDEFGHJKLMNPQRSTUVWXYZ   → đúng 32 ký tự
 *    tức chữ số 2–9 cộng A–Z bỏ I và O (kiểu Crockford), KHÔNG phải "base32
 *    bỏ bốn ký tự" (bảng base32 chuẩn A–Z2–7 bỏ I, O còn 30 ⇒ 49,07 bit).
 *    Con số 50 bit là ĐÚNG; chỉ phần mô tả bảng chữ là lỏng lẻo.
 *
 * 3. Bài 8.3 in bảng bảy dòng redirect_uri. Đo lại bằng `new URL()`: cả bảy
 *    dòng đều khớp bài học, kể cả hai dòng `@` mà host thật là
 *    `ke-tan-cong.com`. NHƯNG bảng ấy không nói một nửa còn lại: khớp CHÍNH
 *    XÁC từng byte cũng TỪ CHỐI hai dạng vốn đồng nghĩa với địa chỉ đã đăng ký
 *        https://cuongthai.com:443/oauth/quay-ve
 *        https://CUONGTHAI.COM/oauth/quay-ve
 *    — cả hai đều chuẩn hoá về đúng `href` đã đăng ký, và cả hai đều trượt
 *    phép so chuỗi. Đó là lý do phải gửi ĐÚNG chuỗi đã đăng ký chứ không phải
 *    "một chuỗi tương đương". Câu 27 và câu 31 dùng đúng phép đo này.
 *
 * 4. Bài 6.1 in dãy `430 64 6d 69 6e` làm "mã điểm của admin" với chữ a Kirin.
 *    Trộn hai đơn vị trong một dòng: `430` là MÃ ĐIỂM (U+0430) còn bốn số sau
 *    là BYTE. Đo thật, UTF-8 của chuỗi đó là `d0b0 64 6d 69 6e` (6 byte), còn
 *    chuỗi Latin là `61 64 6d 69 6e` (5 byte). Ý của bài vẫn đúng nguyên vẹn:
 *    `normalize('NFKC')` KHÔNG gộp а Kirin thành a Latin — đo thật, hai chuỗi
 *    sau chuẩn hoá vẫn khác nhau. Câu 10 hỏi đúng chỗ đó.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh dưới đây):
 *     { '0': 7, '1': 8, '2': 8, '3': 7 }   → A 7 · B 8 · C 8 · D 7
 *
 *   node -e "import('./content/exams/AUTHENTICATION-PT2.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Hai câu lập trình đều CHẠY THẬT và khớp `expectedOutput` từng dòng; cả hai
 * đã chạy ba lượt rồi diff để chắc kết quả không phụ thuộc thời gian hay số
 * cổng — chúng nhận đồng hồ và nguồn ngẫu nhiên từ khối "ĐỀ CHO SẴN".
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/AUTHENTICATION-PT2.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/authentication-exam-kit.mjs';

export default {
  course: { slug: 'authentication' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 5 to 8 (refresh, the account lifecycle, MFA, OAuth)',
        'Kiểm tra tiến độ 2 — Chương 5 đến 8 (refresh, vòng đời tài khoản, MFA, OAuth)',
      ),
      description: B(
        'The middle third of the Authentication course: two tokens and the rotation that gives a thief away, registration and reset and the flows attackers actually use, the second factor and passkeys, and OAuth 2.1 with OpenID Connect. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba giữa của khoá Authentication: hai token và cú xoay vòng tố giác kẻ cắp, đăng ký và đặt lại mật khẩu cùng những luồng mà kẻ tấn công thật sự đi vào, yếu tố thứ hai và passkey, rồi OAuth 2.1 với OpenID Connect. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '5–8'),
      questions: [
        // ── Chương 5 — Refresh, xoay vòng, thu hồi ──────────────────────
        mcq({
          prompt: B(
            'A refresh token is issued in a cookie and the API also accepts it as ' + c('Authorization: Bearer <refresh>') + ' "so mobile clients can use one code path". What has that decision cost?',
            'Một refresh token được phát trong cookie, và API cũng nhận nó dưới dạng ' + c('Authorization: Bearer <refresh>') + ' "để client di động dùng chung một đường mã". Quyết định đó phải trả giá gì?',
          ),
          options: [
            B(
              'Nothing, as long as the token is still stored as a hash and still rotated on every exchange',
              'Chẳng mất gì, miễn là token vẫn cất dạng băm và vẫn xoay vòng ở mỗi lượt đổi',
            ),
            B(
              'The entire point of the split: a stolen refresh token is now a thirty-day access token, so the fifteen-minute revocation window protects nothing',
              'Đúng toàn bộ ý nghĩa của việc tách đôi: một refresh token bị cắp giờ là một access token ba mươi ngày, nên cửa sổ thu hồi mười lăm phút chẳng bảo vệ được gì',
            ),
            B(
              'Only performance: every request now performs the refresh-token database lookup instead of verifying a signature',
              'Chỉ tốn hiệu năng: giờ mỗi request đều phải tra cơ sở dữ liệu tìm refresh token thay vì kiểm một chữ ký',
            ),
            B(
              'CSRF protection, because a token in the <code>Authorization</code> header is attached automatically by the browser',
              'Khả năng chống CSRF, vì token nằm trong header <code>Authorization</code> được trình duyệt tự động đính vào',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The two token types exist because they answer different halves of one requirement: a short access token buys fast stateless verification, and a long refresh token buys revocation — but only while it is confined to one endpoint. Accept it anywhere and its long lifetime becomes the system\'s real lifetime. Hashing and rotation do not help, because the thief presents the token itself and the API never rotates anything. One endpoint, one cookie, <code>SameSite=Strict</code> because your own front end is the only caller, and no middleware anywhere that treats that cookie as an authentication credential. Note that the CSRF answer has it backwards: the browser attaches cookies automatically, not <code>Authorization</code> headers, which is precisely why a bearer header is immune to CSRF.',
            'Hai loại token tồn tại vì chúng trả lời hai nửa khác nhau của cùng một yêu cầu: access token ngắn mua được phép kiểm nhanh không cần trạng thái, còn refresh token dài mua được khả năng thu hồi — nhưng chỉ khi nó bị nhốt ở đúng một endpoint. Nhận nó ở mọi nơi là biến vòng đời dài của nó thành vòng đời thật của cả hệ thống. Băm và xoay vòng không cứu được, vì kẻ cắp trình ra chính cái token đó và API thì có xoay vòng gì đâu. Một endpoint, một cookie, <code>SameSite=Strict</code> vì chỉ front end của bạn gọi tới, và tuyệt đối không middleware nào coi cookie ấy là tín vật xác thực. Để ý phương án nói về CSRF thì nói ngược: trình duyệt tự đính COOKIE chứ không tự đính header <code>Authorization</code> — đó chính là lý do một header mang tín vật miễn nhiễm CSRF.',
          ),
        }),

        mcq({
          prompt: B(
            'Rotation is implemented, but each new refresh token is created with <code>expiresAt: new Date(Date.now() + 30 days)</code> instead of inheriting the value from the token it replaces. What has that turned rotation into?',
            'Cơ chế xoay vòng đã có, nhưng mỗi refresh token mới được tạo với <code>expiresAt: new Date(Date.now() + 30 ngày)</code> thay vì kế thừa giá trị từ cái nó thay thế. Việc đó biến cơ chế xoay vòng thành cái gì?',
          ),
          options: [
            B(
              'Sliding expiry: an active family never ends, so a stolen lineage kept warm is valid forever — the absolute ceiling exists exactly to prevent that',
              'Hạn trôi: một họ token còn hoạt động thì không bao giờ kết thúc, nên một dòng token bị cắp mà cứ được hâm nóng sẽ sống mãi — cái trần tuyệt đối sinh ra đúng để ngăn điều đó',
            ),
            B(
              'Nothing meaningful, because reuse detection ends the family the moment a copy is used a second time',
              'Chẳng thành cái gì đáng kể, vì phép phát hiện tái dùng sẽ kết thúc cả họ ngay khi một bản sao bị dùng lần thứ hai',
            ),
            B(
              'A performance problem: the index on <code>expiresAt</code> is rewritten on every refresh instead of staying stable',
              'Một vấn đề hiệu năng: chỉ mục trên <code>expiresAt</code> bị viết lại ở mỗi lượt refresh thay vì đứng yên',
            ),
            B(
              'A correctness problem only for users who never sign out, since everyone else re-authenticates and resets the clock anyway',
              'Một lỗi đúng đắn chỉ với người không bao giờ đăng xuất, vì ai khác cũng đăng nhập lại và đặt lại đồng hồ rồi',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Each successor must inherit <code>expiresAt</code> from the row it replaces, so the ceiling set at login never moves. Extending it on every exchange is Lesson 3.1\'s trap arriving through a different door: an attacker who refreshes once every fifteen minutes keeps a family alive indefinitely, and the "thirty-day maximum" written in the design document is never reached by anybody. Reuse detection does not rescue it either — detection fires when a token is presented <em>twice</em>, and a thief who has the only live copy, because the victim stopped using the account, never triggers it. The two mechanisms cover different failures and you need both.',
            'Mỗi cái kế nhiệm phải KẾ THỪA <code>expiresAt</code> từ hàng nó thay thế, để cái trần đặt lúc đăng nhập không bao giờ xê dịch. Kéo dài nó ở mỗi lượt đổi là cái bẫy ở bài 3.1 đi vào bằng một cửa khác: kẻ tấn công cứ mười lăm phút refresh một lần là giữ được cả họ sống vô hạn, và con số "tối đa ba mươi ngày" ghi trong tài liệu thiết kế thì chẳng ai chạm tới. Phát hiện tái dùng cũng không cứu nổi — nó chỉ nổ khi một token bị trình ra HAI lần, còn một kẻ cắp đang giữ bản sống DUY NHẤT, vì nạn nhân đã thôi dùng tài khoản, thì không bao giờ kích hoạt nó. Hai cơ chế che hai kiểu hỏng khác nhau, và bạn cần cả hai.',
          ),
        }),

        mcq({
          prompt: B(
            'On rotation, a team deletes the old refresh-token row instead of marking it <code>usedAt</code>, reasoning that a deleted row cannot be replayed. What does that break?',
            'Khi xoay vòng, một nhóm XOÁ hàng refresh token cũ thay vì đóng dấu <code>usedAt</code>, với lý lẽ rằng hàng đã xoá thì không phát lại được. Việc đó làm hỏng cái gì?',
          ),
          options: [
            B(
              'The absolute ceiling, because the successor has no row to inherit <code>expiresAt</code> from',
              'Cái trần tuyệt đối, vì cái kế nhiệm không còn hàng nào để kế thừa <code>expiresAt</code>',
            ),
            B(
              'Nothing — a deleted row is strictly safer than a row marked used, and the family id still ties the lineage together',
              'Chẳng hỏng gì — một hàng đã xoá thì an toàn hơn hẳn một hàng đóng dấu đã dùng, và mã họ vẫn buộc cả dòng lại với nhau',
            ),
            B(
              'The detector: a replayed copy now looks like "token not found", which is indistinguishable from an expired session, so the reuse alarm never fires and the family is never revoked',
              'Chính cái cảm biến: một bản sao phát lại giờ trông y như "không tìm thấy token", thứ không phân biệt được với một phiên đã hết hạn, nên chuông báo tái dùng không bao giờ kêu và cả họ không bao giờ bị thu hồi',
            ),
            B(
              'The device list, because "last active" is read from the deleted row rather than from the live one',
              'Danh sách thiết bị, vì mốc "hoạt động lần cuối" được đọc từ hàng đã xoá chứ không phải từ hàng đang sống',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The used row <em>is</em> the detector. When a copy of RT1 arrives after RT1 was exchanged, the row marked <code>usedAt</code> is what lets you say "this token was already spent, therefore two parties hold it" and revoke the whole family. Delete it and the same request returns a plain 401 that looks exactly like a session that expired last week — no alarm, no log line, no revocation, and the thief simply tries again with whatever they have. The successor inherits the ceiling from the row in memory before the write, and the device list reads the live link (the one with <code>usedAt: null</code>), so neither of those breaks. Keep used rows for about a week, then let the cleanup job take them.',
            'Chính cái hàng đã-dùng LÀ cảm biến. Khi một bản sao của RT1 tới sau lúc RT1 đã đổi, cái hàng mang dấu <code>usedAt</code> mới là thứ cho phép bạn nói "token này tiêu rồi, vậy có hai bên đang cùng cầm nó" rồi thu hồi cả họ. Xoá nó đi thì đúng cái request ấy trả về một mã 401 trơn, trông y hệt một phiên hết hạn từ tuần trước — không chuông, không dòng log, không thu hồi, và kẻ cắp cứ thế thử tiếp bằng thứ nó đang có. Cái kế nhiệm kế thừa trần từ hàng đã nằm trong bộ nhớ trước lúc ghi, còn danh sách thiết bị thì đọc mắt xích đang sống (cái có <code>usedAt: null</code>), nên cả hai thứ đó không hỏng. Hãy giữ các hàng đã dùng chừng một tuần rồi để việc dọn dẹp mang đi.',
          ),
        }),

        mcq({
          prompt: B(
            'An admin lowers a user from ADMIN to MEMBER at 09:00. Access tokens live fifteen minutes and the refresh endpoint re-reads the user row on every exchange. When does the demotion take effect, and what would make it immediate?',
            'Lúc 09:00 quản trị viên hạ một người dùng từ ADMIN xuống MEMBER. Access token sống mười lăm phút, và endpoint refresh đọc lại hàng người dùng ở mỗi lượt đổi. Việc hạ quyền có hiệu lực khi nào, và làm sao để nó có hiệu lực ngay?',
          ),
          options: [
            B(
              'At 09:00, because the role is read from the database on every request and the token only carries the subject id',
              'Lúc 09:00, vì vai trò được đọc từ cơ sở dữ liệu ở mọi request còn token chỉ mang mã chủ thể',
            ),
            B(
              'At the next sign-in, because a role change is only applied when a completely new token family is created',
              'Ở lần đăng nhập kế tiếp, vì thay đổi vai trò chỉ được áp dụng khi một họ token hoàn toàn mới được tạo ra',
            ),
            B(
              'Never for the current token family, since a refresh copies the claims of the token it replaces',
              'Không bao giờ, với họ token hiện tại, vì một lượt refresh chép lại các claim của token nó thay thế',
            ),
            B(
              'At the next refresh, so within fifteen minutes — a small denylist keyed by user with a TTL equal to the access lifetime makes it immediate',
              'Ở lượt refresh kế tiếp, tức trong vòng mười lăm phút — một danh sách chặn nhỏ khoá theo người dùng với TTL bằng đúng vòng đời access token sẽ làm nó có hiệu lực ngay',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Freshness in this design comes from one place: the refresh endpoint re-reads the user row and mints the next access token from the <em>current</em> values — role, disabled flag, permissions. So a demotion lands at the next exchange, and the fifteen-minute number is the honest statement of the design rather than a flaw in it. The in-flight token still says ADMIN, because a signed claim cannot be un-issued. For the two events that cannot wait — an account disabled, a privilege removed — write one Redis key per affected user with a TTL equal to the access lifetime and check it in the middleware <em>after</em> the signature already verified. The list stays tiny by construction, and it may fail open on a cache outage: the account is still blocked at the refresh path, so the window degrades back to fifteen minutes instead of the API going down.',
            'Tính tươi mới trong thiết kế này chảy ra từ đúng một chỗ: endpoint refresh đọc lại hàng người dùng rồi đúc access token kế tiếp từ các giá trị HIỆN TẠI — vai trò, cờ khoá, danh sách quyền. Vậy nên việc hạ quyền rơi vào lượt đổi kế tiếp, và con số mười lăm phút là lời khai trung thực của thiết kế chứ không phải một khiếm khuyết của nó. Cái token đang bay vẫn nói ADMIN, vì một claim đã ký thì không rút lại được. Với hai sự kiện không chờ được — khoá tài khoản, gỡ đặc quyền — hãy ghi một khoá Redis cho mỗi người bị ảnh hưởng với TTL bằng đúng vòng đời access token, và kiểm nó trong middleware SAU khi chữ ký đã kiểm xong. Danh sách ấy tự nó bé tí, và nó được phép hỏng theo hướng MỞ khi cache chết: tài khoản vẫn bị chặn ở đường refresh, nên cửa sổ chỉ tụt về mười lăm phút chứ không phải cả API sập.',
          ),
        }),

        mcq({
          prompt: B(
            'A device list is built from the refresh-token table. Rotation adds a row every fifteen minutes, so a user who has been signed in all day has dozens. Which filter produces one row per logged-in device, and what is "last active"?',
            'Danh sách thiết bị được dựng từ bảng refresh token. Cứ mười lăm phút xoay vòng lại thêm một hàng, nên một người đăng nhập cả ngày sẽ có hàng chục hàng. Bộ lọc nào cho ra ĐÚNG một hàng cho mỗi thiết bị đang đăng nhập, và "hoạt động lần cuối" là gì?',
          ),
          options: [
            B(
              'Group by <code>hoId</code> and take <code>max(createdAt)</code>; last active is that maximum, which needs a window function on every render',
              'Gom nhóm theo <code>hoId</code> rồi lấy <code>max(createdAt)</code>; hoạt động lần cuối là cái giá trị lớn nhất đó, và mỗi lần dựng danh sách phải chạy một hàm cửa sổ',
            ),
            B(
              'Keep only rows whose <code>revokedAt</code> is null and deduplicate by user agent, since one device produces one user-agent string',
              'Chỉ giữ các hàng có <code>revokedAt</code> rỗng rồi khử trùng lặp theo user agent, vì mỗi thiết bị sinh ra đúng một chuỗi user agent',
            ),
            B(
              'Filter on the newest row per user and add an <code>activeAt</code> column updated on every API request',
              'Lọc lấy hàng mới nhất của mỗi người dùng và thêm một cột <code>activeAt</code> cập nhật ở mọi request API',
            ),
            B(
              'Filter on <code>usedAt: null</code> — exactly one live link per family — and last active is that row\'s <code>createdAt</code>, because it was created at the most recent refresh',
              'Lọc theo <code>usedAt: null</code> — đúng một mắt xích đang sống cho mỗi họ — và hoạt động lần cuối chính là <code>createdAt</code> của hàng đó, vì nó được tạo ra ở lượt refresh gần nhất',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Rotation gives you the timestamp for free. Every exchange marks the old row used and creates a new one, so the single row with <code>usedAt: null</code> in each family is the live credential, and its <code>createdAt</code> is by definition the moment of the last refresh — accurate to the access-token lifetime, with no extra column and no per-request write. A window function would compute the same thing at a cost, and an <code>activeAt</code> column reintroduces exactly the write-per-request that Chapter 3 worked to avoid. Deduplicating by user agent is worse than useless: the string is frozen by modern browsers, rewritten by privacy tools and trivially copied by an attacker, so two devices routinely share one and the row a user most needs to see — the one they do not recognise — is the one that gets merged away. Use it as a human-readable label, never as a key and never as a security check.',
            'Chính cơ chế xoay vòng tặng bạn cái dấu thời gian đó. Mỗi lượt đổi đóng dấu hàng cũ là đã dùng rồi tạo một hàng mới, nên hàng DUY NHẤT có <code>usedAt: null</code> trong mỗi họ chính là tín vật đang sống, và <code>createdAt</code> của nó, theo định nghĩa, là thời điểm refresh gần nhất — chính xác tới cỡ vòng đời access token, không cần cột thêm, không cần ghi ở mỗi request. Một hàm cửa sổ cũng tính ra đúng thứ ấy nhưng phải trả tiền, còn thêm cột <code>activeAt</code> là kéo về đúng cái ghi-mỗi-request mà chương 3 đã cố tránh. Khử trùng lặp theo user agent thì tệ hơn cả vô ích: chuỗi ấy bị trình duyệt hiện đại đóng băng, bị công cụ riêng tư viết lại, và kẻ tấn công chép lại dễ như bỡn, nên hai thiết bị thường xuyên dùng chung một chuỗi và đúng cái hàng người dùng cần thấy nhất — cái họ KHÔNG nhận ra — lại là cái bị gộp mất. Hãy dùng nó làm nhãn cho người đọc, đừng bao giờ làm khoá và đừng bao giờ làm phép kiểm bảo mật.',
          ),
        }),

        mcq({
          prompt: B(
            'The server keeps a thirty-second record of "what each rotated token was exchanged for", so a repeated presentation inside that window is answered with the same successor instead of revoking the family. Why thirty seconds and not five minutes?',
            'Máy chủ giữ trong ba mươi giây một bản ghi "mỗi token vừa xoay đã đổi được cái gì", để một lượt trình lại trong cửa sổ đó được trả về đúng cái kế nhiệm cũ thay vì thu hồi cả họ. Vì sao là ba mươi giây chứ không phải năm phút?',
          ),
          options: [
            B(
              'Because Redis keys shorter than a minute are stored in memory while longer ones are written to disk, which would slow the refresh path',
              'Vì khoá Redis dưới một phút thì nằm trong bộ nhớ còn dài hơn thì bị ghi xuống đĩa, làm chậm đường refresh',
            ),
            B(
              'Because the successor is stored in plaintext, and a five-minute window would exceed the access token lifetime',
              'Vì cái kế nhiệm được cất ở dạng trần, mà cửa sổ năm phút thì vượt quá vòng đời của access token',
            ),
            B(
              'Because during that window a real thief also receives a working session with no alarm, so the window is a deliberate weakening sized to the longest legitimate race and no longer',
              'Vì trong đúng cửa sổ đó một kẻ cắp thật cũng nhận được một phiên chạy được mà không có chuông nào, nên cửa sổ này là một chỗ tự làm yếu có chủ đích, đo vừa đúng cuộc đua hợp lệ dài nhất và không dài hơn',
            ),
            B(
              'Because clock skew between application servers is bounded at thirty seconds, so a longer window could not be compared reliably',
              'Vì độ lệch đồng hồ giữa các máy chủ ứng dụng bị chặn ở ba mươi giây, nên một cửa sổ dài hơn sẽ không so sánh đáng tin được',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The grace window exists for the race the client genuinely cannot fix — a refresh whose response never arrived, an app resuming from the background — and it works by handing the same successor back rather than concluding theft. The cost is exact: for those seconds, an attacker presenting the same used token is also handed a working session, and nothing is logged. Thirty seconds covers every legitimate case in the lesson and is far too short to build an attack on; five minutes would be comfortable for clients and would hand a thief a five-minute hole on every single rotation. Do not tune it for convenience — fix the client instead, with one in-flight refresh promise per tab and a proactive refresh before expiry, and keep a counter on grace hits so you can tell whether the client is still broken.',
            'Cửa sổ ân hạn tồn tại vì cuộc đua mà client thật sự không sửa nổi — một lượt refresh có phản hồi không bao giờ về tới, một ứng dụng vừa tỉnh dậy từ nền — và nó làm việc bằng cách TRẢ LẠI đúng cái kế nhiệm cũ thay vì kết luận là trộm. Cái giá thì rõ ràng: trong đúng chừng ấy giây, một kẻ tấn công trình ra cùng cái token đã dùng cũng được trao một phiên chạy được, và không có gì được ghi lại. Ba mươi giây phủ hết mọi ca hợp lệ trong bài học và ngắn tới mức không xây được cú tấn công nào lên nó; năm phút thì thoải mái cho client và tặng kẻ cắp một cái lỗ năm phút ở MỖI lượt xoay vòng. Đừng chỉnh nó cho tiện — hãy sửa client, mỗi tab một promise refresh đang bay và một lượt refresh chủ động trước khi hết hạn, rồi đếm số lần chạm cửa sổ ân hạn để biết client còn hỏng hay không.',
          ),
        }),

        mcq({
          prompt: B(
            'A client refreshes proactively at 80% of the access token lifetime with <code>setTimeout</code>. A reviewer says the per-call check <code>if (Date.now() > expiresAt - 30_000) await refresh()</code> is now redundant. Who is right?',
            'Một client refresh chủ động ở mốc 80% vòng đời access token bằng <code>setTimeout</code>. Người review bảo rằng phép kiểm ở mỗi lời gọi <code>if (Date.now() > expiresAt - 30_000) await refresh()</code> giờ là thừa. Ai đúng?',
          ),
          options: [
            B(
              'The reviewer: once a timer is scheduled the token can never expire unnoticed, so the check only adds a comparison to every call',
              'Người review đúng: đã hẹn giờ rồi thì token không bao giờ hết hạn mà không ai biết, nên phép kiểm chỉ thêm một lần so sánh vào mọi lời gọi',
            ),
            B(
              'The author: browsers throttle or suspend <code>setTimeout</code> in a backgrounded tab and a sleeping phone runs nothing at all, so the timer is the optimisation and the per-call check is the guarantee',
              'Tác giả đúng: trình duyệt bóp hoặc treo hẳn <code>setTimeout</code> trong tab chạy nền và một cái điện thoại đang ngủ thì chẳng chạy gì, nên cái hẹn giờ là phần tối ưu còn phép kiểm ở mỗi lời gọi mới là phần bảo đảm',
            ),
            B(
              'The reviewer, provided the timer is rescheduled inside the refresh response handler rather than at call time',
              'Người review đúng, miễn là cái hẹn giờ được đặt lại bên trong chỗ xử lý phản hồi refresh chứ không phải lúc gọi',
            ),
            B(
              'Neither: proactive refresh should be removed entirely, because refreshing before a 401 doubles the number of refresh calls',
              'Không ai đúng: nên bỏ hẳn refresh chủ động, vì refresh trước khi có 401 làm số lời gọi refresh tăng gấp đôi',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Proactive refresh is worth having — it removes the cause of the storm rather than handling the symptom, because ten simultaneous requests carrying a valid token are just ten normal requests, and the refresh happened minutes earlier with nothing racing it. It does not double anything: the token is exchanged once per period either way. What it cannot promise is that it ran. Timers are throttled in inactive tabs and stopped entirely on a sleeping device, so a phone coming back from the background wakes up with an access token that expired an hour ago and a timer that never fired. The per-call fence is what catches that, and the 401 path stays too, because clocks drift and a session can be revoked between two requests.',
            'Refresh chủ động là thứ đáng có — nó xoá NGUYÊN NHÂN của cơn bão thay vì chữa triệu chứng, vì mười request đồng thời mang một token còn hiệu lực thì chỉ là mười request bình thường, và lượt refresh đã xảy ra từ mấy phút trước, một mình, không có gì đua với nó. Nó cũng không làm tăng gấp đôi gì cả: mỗi chu kỳ token vẫn chỉ đổi một lần. Thứ nó KHÔNG hứa được là nó đã chạy. Hẹn giờ bị bóp trong tab không hoạt động và bị dừng hẳn trên thiết bị đang ngủ, nên một cái điện thoại vừa quay lại từ nền sẽ tỉnh dậy với access token hết hạn từ một tiếng trước và một cái hẹn giờ chưa hề nổ. Cái chốt ở mỗi lời gọi mới bắt được chuyện đó, và đường xử lý 401 vẫn phải giữ, vì đồng hồ có trôi và một phiên có thể bị thu hồi giữa hai request.',
          ),
        }),

        mcq({
          prompt: B(
            'Sign-out is implemented as <code>res.clearCookie(\'__Host-refresh\', { path: \'/\', secure: true, httpOnly: true, sameSite: \'strict\' })</code> and a 204. The attributes match exactly. What is still missing?',
            'Chức năng đăng xuất được cài thành <code>res.clearCookie(\'__Host-refresh\', { path: \'/\', secure: true, httpOnly: true, sameSite: \'strict\' })</code> rồi trả 204. Các thuộc tính khớp chính xác. Vẫn còn thiếu gì?',
          ),
          options: [
            B(
              'The <code>Max-Age=0</code> attribute, which <code>clearCookie</code> does not set on a <code>__Host-</code> cookie',
              'Thuộc tính <code>Max-Age=0</code>, thứ mà <code>clearCookie</code> không đặt cho cookie <code>__Host-</code>',
            ),
            B(
              'The <code>UPDATE</code> that revokes the row: anyone who captured that token from a log, a shared machine or a proxy can still use it for thirty days',
              'Lệnh <code>UPDATE</code> thu hồi hàng dữ liệu: ai đã kịp chộp được token đó từ một dòng log, một máy dùng chung hay một proxy thì vẫn dùng tiếp được ba mươi ngày',
            ),
            B(
              'A redirect to the login page, without which the browser re-sends the cleared cookie on the next navigation',
              'Một lệnh chuyển hướng về trang đăng nhập, thiếu nó thì trình duyệt sẽ gửi lại cookie vừa xoá ở lượt điều hướng kế tiếp',
            ),
            B(
              'Nothing: clearing the cookie with matching attributes is a complete sign-out, and the row expires on its own schedule',
              'Chẳng thiếu gì: xoá cookie với đúng bộ thuộc tính là một lượt đăng xuất trọn vẹn, còn hàng dữ liệu thì tự hết hạn theo lịch của nó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Matching the attributes is necessary — a cookie is keyed by name, domain and path, so a mismatched clear leaves the live cookie in place — and it is only the browser half. Logging out is a database write: <code>updateMany</code> setting <code>revokedAt</code> on that token, so the credential itself stops working no matter who holds a copy. That is the whole reason someone presses sign-out on a shared machine, and a logout endpoint that only clears cookies is one of the most common findings in an authentication review. Sign out everywhere is the same statement without the token filter, and a password change is the same statement excluding the current family.',
            'Khớp bộ thuộc tính là điều BẮT BUỘC — một cookie được định danh bằng tên, domain và path, nên xoá sai bộ thuộc tính là để nguyên cái cookie đang sống — nhưng đó mới là nửa phía trình duyệt. Đăng xuất là một lệnh GHI vào cơ sở dữ liệu: <code>updateMany</code> đặt <code>revokedAt</code> lên đúng token đó, để bản thân tín vật thôi hoạt động dù ai đang cầm bản sao. Đó chính là toàn bộ lý do người ta bấm đăng xuất trên một cái máy dùng chung, và một endpoint đăng xuất chỉ biết xoá cookie là một trong những phát hiện phổ biến nhất khi soát lại phần xác thực. "Thoát khỏi mọi thiết bị" là đúng câu lệnh ấy bỏ bộ lọc token đi, còn đổi mật khẩu là đúng câu lệnh ấy loại trừ họ token hiện tại.',
          ),
        }),

        // ── Chương 6 — Vòng đời tài khoản ───────────────────────────────
        mcq({
          prompt: B(
            'A user table keeps <code>email</code> exactly as typed and <code>normalizedEmail</code> folded to lower case, with the unique index on the second column. Why keep both?',
            'Bảng người dùng giữ <code>email</code> đúng như người ta gõ và <code>normalizedEmail</code> đã hạ về chữ thường, với chỉ mục duy nhất đặt trên cột thứ hai. Vì sao phải giữ cả hai?',
          ),
          options: [
            B(
              'Send to the typed form, because a handful of providers really do distinguish case in the local part; look up and enforce uniqueness on the normalised one, always',
              'Gửi thư tới dạng người ta gõ, vì có một số ít nhà cung cấp thật sự phân biệt hoa thường ở phần trước dấu @; còn tra cứu và bảo đảm tính duy nhất thì luôn dùng cột đã chuẩn hoá',
            ),
            B(
              'The typed form is the primary key for foreign keys, and the normalised one exists only to make the index smaller',
              'Dạng người ta gõ là khoá chính cho các khoá ngoại, còn dạng chuẩn hoá chỉ tồn tại để chỉ mục nhỏ lại',
            ),
            B(
              'PostgreSQL cannot build a unique index on a case-insensitive comparison, so the second column is a workaround with no other purpose',
              'PostgreSQL không dựng được chỉ mục duy nhất trên một phép so không phân biệt hoa thường, nên cột thứ hai chỉ là cách đi vòng, không có mục đích nào khác',
            ),
            B(
              'The normalised column is what appears on invoices and in the profile page, so the typed one can be discarded once the address is verified',
              'Cột chuẩn hoá là thứ xuất hiện trên hoá đơn và trong trang hồ sơ, nên dạng người ta gõ có thể bỏ đi khi địa chỉ đã được xác minh',
            ),
          ],
          correct: 0,
          explanation: EX(
            'RFC 5321 leaves the local part to the receiving server and permits case sensitivity there; in practice every mainstream provider folds it, and users type their own address differently every time — so you fold it too, and write down that you did. Keeping the original means the verification mail reaches the mailbox even in the minority case, and it means the user sees their address spelled their way. Every lookup — login, reset, the uniqueness check — normalises the input and matches the indexed column; querying the display column is how "I definitely have an account" tickets are born. One index, on one column, is the entire uniqueness policy, and changing the rule later is a migration with judgement in it: fold case tomorrow and any pair of rows that now collide has to be merged or locked out, which is a product decision rather than a schema change.',
            'RFC 5321 giao phần trước dấu @ cho máy chủ nhận và cho phép nó phân biệt hoa thường; trên thực tế mọi nhà cung cấp phổ thông đều gộp lại, còn người dùng thì lần nào cũng gõ địa chỉ của chính mình một kiểu — nên bạn cũng gộp, và ghi lại là mình đã gộp. Giữ dạng gốc nghĩa là thư xác minh vẫn tới được hộp thư ngay cả ở ca thiểu số ấy, và người dùng nhìn thấy địa chỉ của mình viết theo cách của họ. Mọi lượt tra cứu — đăng nhập, đặt lại mật khẩu, kiểm trùng — đều chuẩn hoá đầu vào rồi khớp với cột có chỉ mục; đi truy vấn cột hiển thị chính là nơi những phiếu hỗ trợ "tôi CÓ tài khoản mà" ra đời. Một chỉ mục, trên một cột, là toàn bộ chính sách duy nhất, và đổi luật về sau là một cuộc chuyển đổi có phán đoán bên trong: mai gộp hoa thường thì mọi cặp hàng đụng nhau đều phải gộp lại hoặc khoá bớt một cái — đó là quyết định sản phẩm chứ không phải một thay đổi lược đồ.',
          ),
        }),

        mcq({
          prompt: B(
            'A registration form receives ' + c('аdmin@cuongthai.com') + ' where the first letter is Cyrillic а (U+0430). Measured on Node 22: the UTF-8 bytes are <code>d0b0 64 6d 69 6e</code> against <code>61 64 6d 69 6e</code> for Latin "admin", and after <code>normalize(\'NFKC\')</code> the two strings still compare unequal. What follows?',
            'Biểu mẫu đăng ký nhận được ' + c('аdmin@cuongthai.com') + ' với chữ cái đầu là а Kirin (U+0430). Đo thật trên Node 22: byte UTF-8 là <code>d0b0 64 6d 69 6e</code> so với <code>61 64 6d 69 6e</code> của "admin" Latin, và sau <code>normalize(\'NFKC\')</code> hai chuỗi vẫn so ra KHÁC nhau. Suy ra điều gì?',
          ),
          options: [
            B(
              'Normalisation is misconfigured: NFKC is defined to fold visually identical characters, so NFKD should be used instead',
              'Phần chuẩn hoá bị cấu hình sai: NFKC vốn được định nghĩa để gộp các ký tự trông giống hệt nhau, nên phải dùng NFKD mới đúng',
            ),
            B(
              'Unicode normalisation does not touch confusables — they are genuinely different letters — so the defence is a conservative character set for domains you control plus a mixed-script marker wherever an operator reads an address',
              'Chuẩn hoá Unicode không đụng tới các ký tự nhìn giống nhau — chúng là những chữ cái thật sự khác nhau — nên lá chắn là một tập ký tự dè dặt cho các tên miền bạn kiểm soát, cộng thêm một dấu hiệu cảnh báo trộn hệ chữ ở mọi chỗ có người vận hành đọc địa chỉ',
            ),
            B(
              'The unique index will reject the second registration anyway, because PostgreSQL compares text after Unicode folding',
              'Chỉ mục duy nhất sẽ từ chối lượt đăng ký thứ hai, vì PostgreSQL so sánh văn bản sau khi gộp Unicode',
            ),
            B(
              'The address is invalid and the loose validation regex from the lesson already rejects it, since it is not ASCII',
              'Địa chỉ đó không hợp lệ và cái regex kiểm tra lỏng lẻo của bài học đã loại nó rồi, vì nó không phải ASCII',
            ),
          ],
          correct: 1,
          explanation: EX(
            'NFKC exists to unify different <em>encodings</em> of the same character — one code point against a base plus a combining accent, or a full-width form against its ASCII equivalent. Cyrillic а and Latin a are not two encodings of one letter; they are two letters that happen to render identically in nearly every font, so no normalisation form folds them and none should. PostgreSQL compares bytes under a normal collation, so the unique index sees two different strings and accepts both. The regex accepts it too, and correctly — international addresses are real. What closes it is a decision about scope: for a domain you operate, restrict the local part to a conservative set; everywhere an operator makes a judgement from an address on screen — a support ticket, an admin list — flag mixed scripts so the difference is visible. Full confusable detection is a library, not a regex.',
            'NFKC sinh ra để hợp nhất các CÁCH MÃ HOÁ khác nhau của cùng một ký tự — một mã điểm so với một chữ nền cộng dấu ghép, hay dạng rộng so với dạng ASCII tương đương. а Kirin và a Latin không phải hai cách mã hoá của một chữ cái; chúng là HAI chữ cái tình cờ hiện lên giống hệt nhau trong gần như mọi phông chữ, nên không dạng chuẩn hoá nào gộp chúng, mà cũng không nên gộp. PostgreSQL so sánh byte với một collation bình thường, nên chỉ mục duy nhất thấy hai chuỗi khác nhau và nhận cả hai. Regex cũng nhận, và nhận là đúng — địa chỉ quốc tế là chuyện có thật. Thứ bịt được lỗ này là một quyết định về phạm vi: với tên miền do bạn vận hành, hãy giới hạn phần trước dấu @ trong một tập ký tự dè dặt; còn ở mọi chỗ có người vận hành nhìn địa chỉ trên màn hình để ra quyết định — một phiếu hỗ trợ, một danh sách quản trị — hãy đánh dấu các chuỗi trộn hệ chữ để khác biệt ấy nhìn thấy được. Dò ký tự nhìn giống nhau cho đủ là việc của một thư viện, không phải của một regex.',
          ),
        }),

        mcq({
          prompt: B(
            'Registration does a <code>findUnique</code> on the normalised address, throws if a row exists, and otherwise inserts. Two sign-ups for the same address arrive four milliseconds apart. What happens, and what is the fix?',
            'Bước đăng ký chạy <code>findUnique</code> trên địa chỉ đã chuẩn hoá, thấy có hàng thì ném lỗi, không thì chèn. Hai lượt đăng ký cùng một địa chỉ tới cách nhau bốn mili-giây. Chuyện gì xảy ra, và sửa thế nào?',
          ),
          options: [
            B(
              'Both are rejected, because the second transaction blocks on the row lock taken by the first and then sees it',
              'Cả hai đều bị từ chối, vì giao dịch thứ hai bị chặn ở cái khoá hàng mà giao dịch thứ nhất đang giữ rồi mới nhìn thấy nó',
            ),
            B(
              'Nothing goes wrong at <code>SERIALIZABLE</code>, so raising the isolation level for this one transaction is the correct fix',
              'Chẳng có gì sai ở mức <code>SERIALIZABLE</code>, nên nâng mức cô lập cho riêng giao dịch này là cách sửa đúng',
            ),
            B(
              'The second insert silently overwrites the first, because an upsert on a unique column is the default behaviour of the driver',
              'Lệnh chèn thứ hai âm thầm ghi đè lên cái thứ nhất, vì chèn-hoặc-cập-nhật trên một cột duy nhất là hành vi mặc định của driver',
            ),
            B(
              'Both see "not taken" and both insert; only the database\'s unique constraint stops the second, so drop the SELECT and catch <code>P2002</code> instead',
              'Cả hai đều thấy "chưa có ai dùng" và cùng chèn; chỉ ràng buộc duy nhất của CƠ SỞ DỮ LIỆU chặn được cái thứ hai, nên hãy bỏ hẳn lệnh SELECT và bắt lỗi <code>P2002</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'There is an <code>await</code> between the check and the insert, so the check is a snapshot of the past. A row that does not exist yet has no lock to take, so nothing blocks and both branches proceed. The unique index is enforced by the database under concurrency, at every isolation level and across every application process, so the shortest correct code is to insert and handle the violation: Prisma reports <code>P2002</code> and PostgreSQL reports <code>23505</code>, and both codes are stable while the message text is not. One more thing belongs in that catch — the duplicate branch must return the same 202 and the same body as the success branch, and put the difference in which mail gets sent, because the sender of the request is not necessarily the owner of the mailbox.',
            'Giữa phép kiểm và lệnh chèn có một chữ <code>await</code>, nên phép kiểm chỉ là một tấm ảnh của quá khứ. Một hàng chưa tồn tại thì làm gì có khoá nào để giữ, nên chẳng ai bị chặn và cả hai nhánh cùng đi tiếp. Chỉ mục duy nhất được CƠ SỞ DỮ LIỆU thi hành dưới điều kiện đồng thời, ở mọi mức cô lập và xuyên mọi tiến trình ứng dụng, nên đoạn mã đúng ngắn nhất là cứ chèn rồi xử lý lỗi vi phạm: Prisma báo <code>P2002</code> còn PostgreSQL báo <code>23505</code>, và cả hai mã đều ổn định, trong khi phần chữ của thông báo thì không. Có thêm một thứ phải nằm trong khối catch đó — nhánh trùng lặp phải trả về đúng mã 202 và đúng thân phản hồi như nhánh thành công, và đặt khác biệt vào chỗ THƯ NÀO được gửi, vì người gửi request chưa chắc là chủ của hộp thư.',
          ),
        }),

        mcq({
          prompt: B(
            'Somebody registers with an address they mistyped by one letter — which happens to be a real stranger\'s address. The row now holds an address nobody can verify, and the real owner cannot sign up because the unique index says it is taken. Which pair of mechanisms releases it?',
            'Có người đăng ký bằng một địa chỉ gõ nhầm một chữ cái — và địa chỉ đó tình cờ là địa chỉ thật của một người lạ. Hàng dữ liệu giờ mang một địa chỉ không ai xác minh được, còn chủ thật thì không đăng ký được vì chỉ mục duy nhất bảo địa chỉ ấy đã có người dùng. Cặp cơ chế nào giải phóng được nó?',
          ),
          options: [
            B(
              'Send the verification mail to the address and, if it bounces, mark the row invalid and free the address automatically',
              'Gửi thư xác minh tới địa chỉ đó và nếu thư dội lại thì đánh dấu hàng đó là không hợp lệ rồi tự động giải phóng địa chỉ',
            ),
            B(
              'Let the real owner claim the address by proving mailbox access, which transfers the existing row to them',
              'Cho chủ thật giành lại địa chỉ bằng cách chứng minh họ đọc được hộp thư, và chuyển luôn hàng dữ liệu đang có sang cho họ',
            ),
            B(
              'Move the unique index onto the pair <code>(normalizedEmail, emailVerifiedAt IS NOT NULL)</code> so unverified rows never block a registration',
              'Chuyển chỉ mục duy nhất sang cặp <code>(normalizedEmail, emailVerifiedAt IS NOT NULL)</code> để hàng chưa xác minh không bao giờ chặn một lượt đăng ký',
            ),
            B(
              'Let an unverified account change its address freely, and delete unverified accounts with no activity after thirty days',
              'Cho một tài khoản chưa xác minh đổi địa chỉ thoải mái, và xoá các tài khoản chưa xác minh không hoạt động sau ba mươi ngày',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Nothing has been proven about an unverified account, so nothing is lost by letting it change its address — and thirty days of silence is a reasonable definition of abandoned. Together they mean a typo costs a month at worst instead of burning an address permanently, and they remove the free squatting move where anybody reserves a stranger\'s identifier by typing it into a signup form. Transferring an existing row to a new claimant hands them whatever the first person already did in that account. Letting unverified rows share an address multiplies the same problem: the mailbox owner now has to work out which of four pending accounts is theirs. And bounce handling does not arrive for a mistyped address that happens to be real — the mail is delivered, to the wrong person, which is exactly the case that made this a problem.',
            'Với một tài khoản chưa xác minh thì chưa có gì được chứng minh cả, nên cho nó đổi địa chỉ cũng chẳng mất gì — còn ba mươi ngày im lặng là một định nghĩa hợp lý của "bỏ hoang". Hai thứ cộng lại nghĩa là một cú gõ nhầm tệ nhất tốn một tháng thay vì đốt vĩnh viễn một địa chỉ, và chúng dập luôn nước cờ chiếm chỗ miễn phí, nơi ai cũng có thể giữ chỗ định danh của người lạ chỉ bằng cách gõ nó vào một biểu mẫu đăng ký. Chuyển hàng dữ liệu đang có sang người mới đòi là trao cho họ mọi thứ mà người trước đã làm trong tài khoản đó. Cho các hàng chưa xác minh dùng chung một địa chỉ thì nhân vấn đề lên: chủ hộp thư giờ phải tự đoán trong bốn tài khoản đang chờ thì cái nào là của mình. Còn xử lý thư dội lại thì không tới, vì một địa chỉ gõ nhầm mà lại có thật thì thư ĐƯỢC GIAO — cho nhầm người — và đó đúng là cái ca đã tạo ra vấn đề này.',
          ),
        }),

        mcq({
          prompt: B(
            'Product asks that the verification link sign the user straight in, "because the funnel improves measurably". What has that changed about the security model?',
            'Bên sản phẩm đề nghị đường dẫn xác minh đăng nhập luôn cho người dùng, "vì phễu chuyển đổi cải thiện thấy rõ". Điều đó đổi cái gì trong mô hình an toàn?',
          ),
          options: [
            B(
              'Nothing, because the token was single-use and 256 bits, so possession of it already proves as much as a password would',
              'Chẳng đổi gì, vì token đó dùng một lần và dài 256 bit, nên cầm được nó đã chứng minh được đúng bằng mức một mật khẩu chứng minh',
            ),
            B(
              'It weakens only the first session, because the account still has a password that must be typed on every later device',
              'Nó chỉ làm yếu đúng phiên đầu tiên, vì tài khoản vẫn có mật khẩu phải gõ ở mọi thiết bị về sau',
            ),
            B(
              'It breaks the scanner defence, because a mail gateway that fetches the link would now be signed in as the user',
              'Nó phá lá chắn chống máy quét, vì một cổng bảo mật thư mà tải đường dẫn đó thì giờ sẽ được đăng nhập với tư cách người dùng',
            ),
            B(
              'It makes the mailbox a login credential — the magic-link design — so a forwarding rule, a shared team inbox or an old mail archive signs somebody else in',
              'Nó biến hộp thư thành một tín vật đăng nhập — đúng thiết kế đường dẫn thần kỳ — nên một quy tắc chuyển tiếp, một hộp thư dùng chung của cả nhóm hay một kho thư cũ là đủ để đăng nhập cho một người khác',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Auto-login on a verification link is a magic link, whether or not anyone calls it that, and it carries the same consequence: whoever can read the mailbox can enter the account, for as long as the link lives. Auto-forward rules set up years ago, shared team inboxes and a mail archive on an old laptop all qualify, and none of them is an attack. It is not limited to the first session either — the same reasoning applies every time you send such a link. The scanner is a separate issue and is already handled by putting the side effect behind a POST, which a gateway will not submit. If you do it anyway, treat the resulting session as low-trust: short-lived, and required to re-enter the password before anything sensitive. The simpler answer is to land the user on the login page with a success banner and let them type their password — one extra step for a stranger\'s takeover to fail on.',
            'Đăng nhập tự động từ đường dẫn xác minh chính là một đường dẫn thần kỳ, dù có ai gọi nó bằng cái tên đó hay không, và nó mang đúng hệ quả ấy: ai đọc được hộp thư thì vào được tài khoản, suốt thời gian đường dẫn còn sống. Một quy tắc chuyển tiếp đặt từ mấy năm trước, một hộp thư chung của cả nhóm, một kho thư nằm trên cái laptop cũ — đều đủ điều kiện, và không cái nào là một cú tấn công cả. Nó cũng không giới hạn ở phiên đầu tiên: cùng lối lập luận ấy áp cho mọi lần bạn gửi một đường dẫn như vậy. Chuyện máy quét là vấn đề riêng và đã được xử lý bằng cách đẩy tác dụng phụ ra sau một lệnh POST, thứ mà cổng bảo mật sẽ không gửi. Nếu vẫn làm, hãy coi phiên sinh ra từ đó là phiên ÍT TIN CẬY: sống ngắn, và bắt nhập lại mật khẩu trước bất cứ việc nhạy cảm nào. Câu trả lời đơn giản hơn là đưa người dùng về trang đăng nhập kèm một dải báo thành công rồi để họ gõ mật khẩu — thêm đúng một bước để một cú chiếm tài khoản của người lạ vấp phải.',
          ),
        }),

        mcq({
          prompt: B(
            'A reset token row stores the account\'s credential version at the moment it was issued, and redemption compares it with the account\'s current version. Which attack does that close?' + code(
              'if (r.materializedVersion !== r.user.materializedVersion) return res.status(410).json(…);',
            ),
            'Hàng token đặt lại mật khẩu lưu lại số phiên bản tín vật của tài khoản tại thời điểm phát, và lúc dùng thì so nó với số phiên bản hiện tại. Phép so đó chặn cú tấn công nào?' + code(
              'if (r.materializedVersion !== r.user.materializedVersion) return res.status(410).json(…);',
            ),
          ),
          options: [
            B(
              'A replay of the same link twice, which the <code>usedAt</code> column cannot detect on its own',
              'Việc phát lại chính đường dẫn đó hai lần, thứ mà cột <code>usedAt</code> tự nó không phát hiện nổi',
            ),
            B(
              'The saved link: an attacker requests a reset for a victim today and redeems it weeks later, after the victim has already changed their password or enrolled a factor',
              'Cái đường dẫn để dành: kẻ tấn công xin một lượt đặt lại cho nạn nhân hôm nay rồi mấy tuần sau mới dùng, sau khi nạn nhân đã đổi mật khẩu hoặc đã đăng ký một yếu tố thứ hai',
            ),
            B(
              'Host header poisoning, because the version is derived from the configured public URL',
              'Cú đầu độc header Host, vì số phiên bản được suy ra từ địa chỉ công khai đã cấu hình',
            ),
            B(
              'Enumeration, because a version mismatch and an unknown token both return 410 with the same body',
              'Việc dò tài khoản, vì lệch phiên bản và token lạ đều trả về 410 với cùng một thân phản hồi',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Any credential change anywhere — a password change, an MFA enrolment, an admin lock — increments the counter, and every token issued before that moment dies at once. That covers the case a thirty-minute expiry does not: the user who received a reset mail they did not ask for, ignored it, and then changed something themselves. Replay of one link is what <code>usedAt</code> is for, and the two mechanisms are separate. The Host header is a different bug entirely, fixed by building the URL from configuration and rejecting unknown hosts at the edge. Uniform 410 responses are worth having, but they are a property of the error handling rather than of the version column. Note the user\'s own escape hatch that falls out of the same design: someone who sees a reset mail they did not request can request one themselves, and the new row invalidates whatever the attacker was holding.',
            'Bất kỳ thay đổi tín vật nào ở bất kỳ đâu — đổi mật khẩu, đăng ký MFA, quản trị viên khoá tài khoản — đều tăng bộ đếm, và mọi token phát ra trước thời điểm đó chết cùng một lúc. Nó phủ đúng cái ca mà hạn ba mươi phút không phủ: người dùng nhận một thư đặt lại mà mình không hề xin, bỏ qua nó, rồi tự tay đổi một thứ gì đó. Chuyện phát lại MỘT đường dẫn là việc của <code>usedAt</code>, và hai cơ chế này là hai thứ riêng biệt. Header Host là một con lỗi hoàn toàn khác, sửa bằng cách dựng URL từ cấu hình và chặn host lạ ngay ở rìa. Trả 410 đồng nhất là thứ đáng có, nhưng đó là tính chất của phần xử lý lỗi chứ không phải của cột phiên bản. Để ý cái lối thoát mà chính người dùng có được từ cùng thiết kế này: ai thấy một thư đặt lại mình không xin thì cứ tự xin một cái, và hàng mới sẽ vô hiệu hoá thứ kẻ tấn công đang cầm.',
          ),
        }),

        mcq({
          prompt: B(
            'The reset page renders correctly and the token is stored as a hash. Three more precautions are recommended for that one route. Which set is right?',
            'Trang đặt lại mật khẩu hiện đúng và token thì cất dạng băm. Vẫn còn ba biện pháp nữa được khuyến nghị cho riêng route đó. Bộ nào đúng?',
          ),
          options: [
            B(
              'Send <code>Referrer-Policy: no-referrer</code>, drop the query string with <code>history.replaceState</code>, and redact that route in the access log',
              'Gửi <code>Referrer-Policy: no-referrer</code>, bỏ query string đi bằng <code>history.replaceState</code>, và che route đó trong log truy cập',
            ),
            B(
              'Send <code>Cache-Control: no-store</code>, set <code>SameSite=None</code> so the link works from a mail client, and disable CSRF on the POST',
              'Gửi <code>Cache-Control: no-store</code>, đặt <code>SameSite=None</code> để đường dẫn chạy được từ ứng dụng thư, và tắt CSRF ở lệnh POST',
            ),
            B(
              'Serve the page over HTTP/2, put the token in a fragment instead of a query parameter, and add a CAPTCHA to the form',
              'Phục vụ trang qua HTTP/2, đặt token vào phần fragment thay vì tham số truy vấn, và thêm CAPTCHA vào biểu mẫu',
            ),
            B(
              'Set a long <code>Cache-Control: max-age</code> so a reload does not re-request the token, and log the full URL for support',
              'Đặt <code>Cache-Control: max-age</code> thật dài để tải lại trang không phải xin token lần nữa, và ghi log toàn bộ URL để hỗ trợ tra cứu',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The URL of that page carries a credential, so the work is keeping the URL from spreading. Without <code>no-referrer</code>, every third-party asset on the page — a font, an analytics pixel, a chat widget — receives the full URL, token included, in the <code>Referer</code> header; better still, load nothing third-party there at all. <code>replaceState</code> after the form renders keeps it out of browser history, out of a screen share and out of a copied link. And access logs, APM traces and error reporters all capture full URLs by default, which puts a live reset token into a log index that everyone with a dashboard login can search. Caching it for longer is the opposite of what you want, disabling CSRF on the POST removes a check that costs nothing, and moving the token to a fragment breaks the server-side render that the whole flow depends on.',
            'URL của trang đó đang mang một tín vật, nên việc phải làm là ngăn cái URL ấy lan ra. Thiếu <code>no-referrer</code> thì mọi tài nguyên bên thứ ba trên trang — một bộ phông, một điểm ảnh thống kê, một khung chat — đều nhận trọn URL, kèm token, trong header <code>Referer</code>; tốt hơn nữa là đừng nạp thứ gì của bên thứ ba ở đó cả. Gọi <code>replaceState</code> sau khi biểu mẫu hiện xong sẽ giữ nó khỏi lịch sử trình duyệt, khỏi một buổi chia sẻ màn hình và khỏi một đường dẫn bị chép lại. Còn log truy cập, vết đo hiệu năng và bộ báo lỗi thì mặc định đều bắt trọn URL, tức là ném một token đặt lại còn sống vào một kho log mà ai có tài khoản bảng điều khiển cũng tìm kiếm được. Cache lâu hơn là ngược hẳn với thứ bạn muốn, tắt CSRF ở lệnh POST là bỏ đi một phép kiểm chẳng tốn gì, còn chuyển token sang phần fragment thì phá luôn phần dựng trang phía máy chủ mà cả luồng này dựa vào.',
          ),
        }),

        mcq({
          prompt: B(
            'A team unifies the login wording, unifies the status code, and adds a dummy Argon2id hash so both branches take the same time. Enumeration still works in one request. Where is the leak?',
            'Một nhóm đã đồng nhất câu chữ ở màn đăng nhập, đồng nhất mã trạng thái, và thêm một chuỗi băm Argon2id giả để hai nhánh tốn thời gian như nhau. Việc dò tài khoản vẫn thành công trong đúng một request. Chỗ rò nằm ở đâu?',
          ),
          options: [
            B(
              'In the response body length, which differs because the dummy hash produces a different error object',
              'Ở độ dài thân phản hồi, thứ khác nhau vì chuỗi băm giả sinh ra một object lỗi khác',
            ),
            B(
              'In the <code>WWW-Authenticate</code> header, which Express only sends when a user row was found',
              'Ở header <code>WWW-Authenticate</code>, thứ mà Express chỉ gửi khi tìm thấy hàng người dùng',
            ),
            B(
              'In the per-account rate limiter, which answers 429 only for addresses it recognises — a perfect oracle needing no timing at all',
              'Ở bộ giới hạn tần suất theo tài khoản, thứ chỉ trả 429 với những địa chỉ nó nhận ra — một cỗ máy đoán hoàn hảo, chẳng cần đo thời gian gì cả',
            ),
            B(
              'In the Argon2 parameters, which differ between old and new rows and therefore identify accounts created before the last upgrade',
              'Ở các tham số Argon2, thứ khác nhau giữa hàng cũ và hàng mới nên chỉ ra được tài khoản nào tạo trước lần nâng cấp gần nhất',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A limiter that counts only against accounts it can find reports existence perfectly, on the first request, with no statistics required — and it is the leak that survives every careful fix upstream, because the limiter is usually written by someone else and reviewed as a performance feature. Count against the submitted address whether or not an account exists. The parameter difference is real and is the grain of truth in the answer about Argon2 parameters, but it distinguishes <em>old accounts from new ones</em> rather than existing from non-existing; if that matters to you, rehash on login and finish the migration. And remember the fourth leak from the lesson: registration, resend and password reset are three more doors that must answer identically, or fixing the login was decorative.',
            'Một bộ giới hạn chỉ đếm cho những tài khoản nó tìm thấy sẽ khai báo sự tồn tại một cách hoàn hảo, ngay ở request đầu tiên, không cần thống kê gì — và đó là chỗ rò sống sót qua mọi lần vá cẩn thận ở phía trên, vì bộ giới hạn thường do người khác viết và được review như một tính năng hiệu năng. Hãy đếm theo địa chỉ được gửi lên, bất kể có tài khoản hay không. Khác biệt tham số là chuyện có thật và là hạt nhân đúng của phương án nói về tham số Argon2, nhưng nó phân biệt TÀI KHOẢN CŨ với TÀI KHOẢN MỚI chứ không phân biệt có với không; nếu điều đó quan trọng với bạn thì hãy băm lại lúc đăng nhập và hoàn tất cuộc chuyển đổi. Và nhớ chỗ rò thứ tư của bài học: đăng ký, gửi lại thư xác minh và đặt lại mật khẩu là ba cánh cửa nữa phải trả lời y hệt nhau, không thì việc sửa màn đăng nhập chỉ là trang trí.',
          ),
        }),

        // ── Chương 7 — Yếu tố thứ hai và passkey ────────────────────────
        mcq({
          prompt: B(
            'An account can be reset through its email address. The team adds a one-time code, also sent to that address, as a second factor at login. What have they built?',
            'Một tài khoản có thể đặt lại mật khẩu qua địa chỉ email của nó. Nhóm thêm một mã dùng một lần, cũng gửi tới đúng địa chỉ ấy, làm yếu tố thứ hai lúc đăng nhập. Họ vừa dựng ra cái gì?',
          ),
          options: [
            B(
              'Two factors, weakly: the password is something you know and the code is something you have, so the categories are still different',
              'Hai yếu tố, tuy yếu: mật khẩu là thứ bạn BIẾT còn mã là thứ bạn CÓ, nên hai loại vẫn khác nhau',
            ),
            B(
              'A phishing-resistant login, because the code is bound to the address it was sent to and cannot be relayed',
              'Một cú đăng nhập chống lừa đảo, vì mã được buộc vào chính địa chỉ đã gửi tới nó và không chuyển tiếp được',
            ),
            B(
              'A working second factor against credential stuffing only, and no defence at all against a stolen password',
              'Một yếu tố thứ hai chỉ có tác dụng với nhồi tín vật, và hoàn toàn vô dụng trước một mật khẩu bị lộ',
            ),
            B(
              'One factor counted twice: one compromised mailbox still yields the account, because the mailbox can already reset the password',
              'Một yếu tố đếm hai lần: một hộp thư bị chiếm vẫn cho ra cả tài khoản, vì hộp thư đó vốn đã đặt lại được mật khẩu',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A factor is a category, and the point of two of them is that the attacker must break two different things. Here both paths end at the same mailbox, so an attacker who reads it can either take the code or skip the login entirely and reset the password — the second control adds work for legitimate users and none for the attacker. The general rule is the one from the recovery ladder: enumerate every path that ends in "the user is now signed in" and check that each one requires the factor, because attackers do not attack the factor, they attack the reset. Note also that a mailed code is not phishing-resistant: a relay proxy forwards it within seconds, and only an origin-bound credential — a passkey — refuses to be relayed.',
            'Một YẾU TỐ là một loại, và ý nghĩa của việc có hai cái là kẻ tấn công phải phá hai thứ KHÁC nhau. Ở đây hai đường đều kết thúc ở cùng một hộp thư, nên kẻ đọc được nó thì hoặc lấy cái mã, hoặc bỏ qua luôn màn đăng nhập mà đi đặt lại mật khẩu — lớp thứ hai chỉ thêm việc cho người dùng thật và không thêm gì cho kẻ tấn công. Luật chung là luật của cái thang khôi phục: hãy kể ra MỌI con đường kết thúc bằng "người dùng đã đăng nhập" rồi kiểm rằng đường nào cũng đòi yếu tố thứ hai, vì kẻ tấn công không đánh vào yếu tố, họ đánh vào đường khôi phục. Cũng lưu ý một mã gửi qua thư thì không chống được lừa đảo: một proxy chuyển tiếp nó trong vài giây, và chỉ một tín vật buộc vào origin — tức passkey — mới từ chối bị chuyển tiếp.',
          ),
        }),

        mcq({
          prompt: B(
            'A team demands the second factor on every single login "because that is what MFA means". What does the lesson say goes wrong, and where does the real value sit?',
            'Một nhóm bắt nhập yếu tố thứ hai ở MỌI lần đăng nhập, "vì MFA nghĩa là như vậy". Bài học nói điều gì sẽ hỏng, và giá trị thật nằm ở đâu?',
          ),
          options: [
            B(
              'Nothing goes wrong; asking every time is strictly safer, and the only cost is a few seconds per session',
              'Chẳng có gì hỏng cả; hỏi mỗi lần là an toàn hơn hẳn, và cái giá duy nhất là vài giây mỗi phiên',
            ),
            B(
              'Codes get reused across sessions, so the <code>lastStep</code> check starts rejecting legitimate logins',
              'Mã bị dùng lại giữa các phiên, nên phép kiểm <code>lastStep</code> bắt đầu từ chối cả những lượt đăng nhập hợp lệ',
            ),
            B(
              'Users switch it off or pick the weakest option, and the value is in step-up before sensitive actions — the only control that still bites once an attacker is already inside a session',
              'Người dùng tắt nó đi hoặc chọn lựa chọn yếu nhất, còn giá trị thật nằm ở việc xác thực lại trước các hành động nhạy cảm — lớp duy nhất còn cắn được khi kẻ tấn công đã ở BÊN TRONG một phiên',
            ),
            B(
              'The rate limiter starts blocking real users, so the ten-attempts-per-hour cap has to be raised for everyone',
              'Bộ giới hạn tần suất bắt đầu chặn người dùng thật, nên phải nâng trần mười lần mỗi giờ cho tất cả mọi người',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A factor demanded on every login gets turned off, or the user picks whatever is quickest to satisfy — which is why remembering the browser for thirty days with its own signed cookie is not a weakness but the thing that keeps MFA switched on. Re-ask when that expires, when the device is new, and when the risk score rises. Meanwhile login MFA only helps against somebody who has the password; Chapters 3 to 6 all end with the attacker already holding a live session — a stolen cookie, an unlocked laptop, an XSS — and step-up before changing the recovery address, deleting the account or moving money is the only control that still applies there. Enrolling, changing or removing a factor is itself a sensitive action and needs the same gate, or an attacker with a session simply enrols their own.',
            'Một yếu tố bị đòi ở mọi lần đăng nhập rồi sẽ bị tắt, hoặc người dùng sẽ chọn thứ nào nhanh nhất cho xong — nên nhớ trình duyệt trong ba mươi ngày bằng một cookie đã ký riêng KHÔNG phải chỗ yếu mà chính là thứ giữ cho MFA còn được bật. Hỏi lại khi cái đó hết hạn, khi thiết bị lạ, và khi điểm rủi ro lên cao. Trong khi đó, MFA ở màn đăng nhập chỉ giúp chống kẻ đang có mật khẩu; các chương 3 tới 6 đều kết thúc ở chỗ kẻ tấn công ĐÃ cầm một phiên còn sống — một cookie bị cắp, một cái laptop chưa khoá, một lỗ XSS — và xác thực lại trước khi đổi địa chỉ khôi phục, xoá tài khoản hay chuyển tiền là lớp duy nhất còn áp được ở đó. Đăng ký, đổi hay gỡ một yếu tố tự nó là hành động nhạy cảm và cần đúng cái cổng ấy, nếu không thì kẻ tấn công đang cầm phiên chỉ việc đăng ký yếu tố của chính họ.',
          ),
        }),

        mcq({
          prompt: B(
            'Password hashes are stored with Argon2id. A reviewer asks why the TOTP shared secret is <b>encrypted</b> rather than hashed. What is the answer?',
            'Chuỗi băm mật khẩu được cất bằng Argon2id. Người review hỏi vì sao bí mật chung của TOTP lại được <b>mã hoá</b> chứ không băm. Câu trả lời là gì?',
          ),
          options: [
            B(
              'Because the secret is only 160 bits, which is below the minimum input length Argon2id accepts',
              'Vì bí mật đó chỉ dài 160 bit, dưới độ dài đầu vào tối thiểu mà Argon2id chấp nhận',
            ),
            B(
              'Because hashing it would break the base32 encoding the authenticator app expects to read back',
              'Vì băm nó sẽ phá mất phần mã hoá base32 mà ứng dụng xác thực cần đọc lại',
            ),
            B(
              'Because the server must recompute the expected code from the original bytes on every verification, so it needs a reversible form; encryption keeps a database dump alone from handing over every second factor',
              'Vì máy chủ phải tính lại mã mong đợi từ chính những byte gốc ở mỗi lượt kiểm, nên nó cần một dạng đảo ngược được; mã hoá giữ cho một bản dump cơ sở dữ liệu, tự nó, không trao ra mọi yếu tố thứ hai',
            ),
            B(
              'Because RFC 6238 forbids storing a derived form of the shared secret, in order to keep implementations interoperable',
              'Vì RFC 6238 cấm lưu một dạng dẫn xuất của bí mật chung, để các bản cài đặt còn tương thích được với nhau',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A password is verified by hashing the submitted value and comparing digests, so the server never needs the original. TOTP is the opposite shape: the server computes <code>HMAC-SHA1(secret, counter)</code> itself and compares the resulting digits, which is impossible without the secret bytes. So it is encrypted at rest with a key from your secrets manager, and the boundary it draws is the same one the pepper drew in Chapter 2 — a leaked database is not a leaked set of factors, while a fully compromised application server is. Note the same reasoning gives the opposite answer for recovery codes: those are fifty bits of pure randomness that the server only ever compares, so they are hashed, and a fast hash is right because there is nothing to brute-force.',
            'Một mật khẩu được xác minh bằng cách băm giá trị gửi lên rồi so hai digest, nên máy chủ không bao giờ cần bản gốc. TOTP thì ngược hình dạng: máy chủ tự tính <code>HMAC-SHA1(bí mật, bộ đếm)</code> rồi so mấy chữ số ra được, và điều đó không thể làm nếu thiếu chính những byte bí mật. Nên nó được MÃ HOÁ khi nằm im, bằng khoá lấy từ kho bí mật, và cái ranh giới nó vẽ ra đúng là cái ranh giới mà hạt tiêu vẽ ở chương 2 — một cơ sở dữ liệu rò ra không phải là một mớ yếu tố thứ hai rò ra, còn một máy chủ ứng dụng bị chiếm trọn thì có. Để ý cùng lối lập luận ấy cho ra câu trả lời NGƯỢC LẠI với mã khôi phục: chúng là năm mươi bit ngẫu nhiên thuần mà máy chủ chỉ việc SO SÁNH, nên chúng được băm, và một hàm băm nhanh là đúng vì chẳng có gì để dò cạn.',
          ),
        }),

        mcq({
          prompt: B(
            'An enrolment screen shows a QR code and turns TOTP on at the same moment, so the user is protected immediately. What goes wrong, and what is the correct order?',
            'Một màn hình đăng ký hiện mã QR và bật TOTP ngay cùng lúc, để người dùng được bảo vệ ngay lập tức. Chuyện gì hỏng, và thứ tự đúng là gì?',
          ),
          options: [
            B(
              'Nothing is wrong as long as recovery codes are shown on the following screen, which restores access if the app was never added',
              'Chẳng có gì sai, miễn là mã khôi phục hiện ở màn hình kế tiếp, thứ khôi phục được quyền truy cập nếu ứng dụng chưa từng được thêm vào',
            ),
            B(
              'A user whose camera failed, whose app crashed, or who simply closed the tab is now locked out of the account they were trying to protect: store the secret disabled with a short expiry, enable it only after one code verifies, and issue the recovery codes in that same response',
              'Người dùng bị hỏng camera, ứng dụng sập, hay đơn giản là đóng tab, giờ bị khoá ra khỏi chính cái tài khoản họ đang cố bảo vệ: hãy cất bí mật ở trạng thái CHƯA BẬT kèm một hạn ngắn, chỉ bật khi một mã kiểm qua, và phát mã khôi phục ngay trong đúng phản hồi đó',
            ),
            B(
              'The QR code contains the secret, so rendering it before enabling means the secret exists in a page that was never authenticated, and any browser extension on that page can read it out of the DOM',
              'Mã QR chứa chính cái bí mật, nên hiện nó ra trước khi bật nghĩa là bí mật tồn tại trong một trang chưa hề được xác thực, và mọi tiện ích mở rộng trên trang đó đều đọc được nó ra từ DOM',
            ),
            B(
              'The <code>lastStep</code> column starts at zero, so the first legitimate code is rejected as a replay and the user has to wait a full thirty-second step before the enrolment can succeed at all',
              'Cột <code>lastStep</code> bắt đầu từ 0, nên mã hợp lệ đầu tiên bị từ chối vì tưởng là phát lại, và người dùng phải chờ trọn một bước ba mươi giây thì lượt đăng ký mới thành công được',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Proving that one code works is the whole reason the confirm step exists: it is the only evidence that the user actually has a working authenticator, and turning the factor on without it produces a lockout for somebody in the middle of improving their security. The recovery codes belong in that same response, not behind a later click, because this is the only moment their plaintext exists — put them on another screen and most users never see them, and then lose the phone. The QR is rendered from a URI you generated over an authenticated, re-authenticated request, so there is nothing anomalous about showing it; and <code>lastStep</code> is set from the confirming code, so the first real code is exactly what enables the factor. Removing a factor must cost the same ceremony — re-authentication plus a mail to the account — or an attacker with a session simply switches it off.',
            'Chứng minh rằng MỘT cái mã chạy được chính là toàn bộ lý do bước xác nhận tồn tại: đó là bằng chứng duy nhất rằng người dùng thật sự có một cái ứng dụng xác thực chạy được, và bật yếu tố lên mà thiếu nó là tạo ra một cú khoá cửa cho đúng người đang giữa chừng nâng cấp an toàn cho mình. Mã khôi phục thuộc về đúng phản hồi ấy chứ không phải sau một cú bấm nữa, vì đây là khoảnh khắc DUY NHẤT bản rõ của chúng tồn tại — đẩy sang màn hình khác thì phần lớn người dùng không bao giờ nhìn thấy, rồi mất điện thoại. Mã QR được dựng từ một URI do chính bạn sinh ra trong một request đã xác thực và đã xác thực lại, nên chẳng có gì bất thường khi hiện nó; còn <code>lastStep</code> thì được đặt từ chính cái mã xác nhận, nên mã thật đầu tiên đúng là thứ bật yếu tố lên. Gỡ một yếu tố phải tốn đúng chừng ấy nghi thức — xác thực lại cộng một lá thư gửi về tài khoản — nếu không thì kẻ tấn công đang cầm phiên chỉ việc tắt nó đi.',
          ),
        }),

        mcq({
          prompt: B(
            'Six digits is a million possibilities, and a ±1 step window makes three of them valid at any moment. Which rate-limit design turns that into an acceptable number, and which mistake does the lesson warn about?',
            'Sáu chữ số là một triệu khả năng, và cửa sổ trôi ±1 bước làm cho ba trong số đó hợp lệ tại mỗi thời điểm. Thiết kế giới hạn tần suất nào biến con số ấy thành chấp nhận được, và bài học cảnh báo sai lầm nào?',
          ),
          options: [
            B(
              'Count failures per account in a rolling hourly window and throttle; do not lock the account permanently, because that hands an attacker a denial of service against any account whose password they know',
              'Đếm số lần sai theo TÀI KHOẢN trong một cửa sổ trượt một giờ rồi bóp lại; đừng khoá vĩnh viễn, vì làm vậy là trao cho kẻ tấn công một cú từ chối dịch vụ nhắm vào bất kỳ tài khoản nào mà chúng biết mật khẩu',
            ),
            B(
              'Count failures per IP address, because an attacker guessing codes has to come from somewhere and the address is the cheapest key to store',
              'Đếm số lần sai theo địa chỉ IP, vì kẻ đoán mã thì phải xuất phát từ đâu đó, mà địa chỉ lại là khoá rẻ nhất để lưu',
            ),
            B(
              'Widen the drift window to ±5 so users with wrong clocks stop failing, which removes most of the attempts the limiter has to count',
              'Nới cửa sổ trôi lên ±5 để người dùng có đồng hồ sai thôi bị trượt, nhờ đó bớt hẳn số lượt mà bộ giới hạn phải đếm',
            ),
            B(
              'Lock the account after three failures and require a support ticket, since somebody guessing codes has already proven malicious intent',
              'Khoá tài khoản sau ba lần sai và bắt mở phiếu hỗ trợ, vì kẻ đang đoán mã thì đã chứng minh ý đồ xấu rồi',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The attacker already has the password, so they know exactly which account they are attacking and can rotate addresses for pennies — an IP-keyed limiter measures the one thing they control. Ten attempts per account per hour makes a blind guess hopeless (three valid steps in a million, ten tries: measured, about one chance in 33,334 per hour of trying, where the lesson\'s text says one in thirty-eight thousand) and leaves a very loud trail. Permanent lockout inverts the protection into an attack: anybody who knows a password can lock its owner out on purpose, and a rolling window recovers on its own with no support ticket. Widening the drift window to ±5 accepts five and a half minutes of skew and multiplies the guessing surface; fix the clock instead. And apply the same limiter to recovery codes, which are a complete bypass of the factor they replace.',
            'Kẻ tấn công vốn đã có mật khẩu, nên chúng biết chính xác đang đánh vào tài khoản nào và đổi địa chỉ IP thì rẻ như bèo — một bộ giới hạn khoá theo IP là đang đo đúng thứ chúng kiểm soát được. Mười lần thử mỗi tài khoản mỗi giờ làm cho việc đoán mù trở nên vô vọng (ba bước hợp lệ trong một triệu, mười lượt: đo thật, khoảng một phần 33.334 cho mỗi giờ ngồi thử, trong khi phần chữ của bài học ghi một phần ba mươi tám nghìn) và để lại một vệt rất ồn ào. Khoá vĩnh viễn thì lật ngược lớp bảo vệ thành một cú tấn công: ai biết một mật khẩu là khoá được chủ của nó ra ngoài một cách có chủ đích, còn cửa sổ trượt thì tự hồi phục mà không cần phiếu hỗ trợ nào. Nới cửa sổ trôi lên ±5 là chấp nhận năm phút rưỡi lệch giờ và nhân bề mặt đoán mò lên; hãy đi sửa đồng hồ. Và hãy áp đúng bộ giới hạn ấy lên mã khôi phục, thứ vốn là một cú vượt mặt trọn vẹn cái yếu tố mà nó thay thế.',
          ),
        }),

        mcq({
          prompt: B(
            'A team ships passkeys for <code>app.cuongthai.com</code> and registers credentials with <code>rpId: "app.cuongthai.com"</code>. Next year the product moves to <code>cuongthai.com</code>. What happens, and what should they have done?',
            'Một nhóm đưa passkey lên <code>app.cuongthai.com</code> và đăng ký tín vật với <code>rpId: "app.cuongthai.com"</code>. Sang năm sau sản phẩm chuyển về <code>cuongthai.com</code>. Chuyện gì xảy ra, và đáng lẽ họ phải làm gì?',
          ),
          options: [
            B(
              'Nothing breaks: an RP ID may always be widened to a registrable parent, so credentials keep working at the shorter domain',
              'Chẳng hỏng gì: một RP ID luôn có thể nới rộng lên tên miền cha đăng ký được, nên tín vật vẫn chạy ở tên miền ngắn hơn',
            ),
            B(
              'Only the discoverable credentials break, because the user handle is scoped to the subdomain while the key pair is not',
              'Chỉ các tín vật tự khám phá được là hỏng, vì mã người dùng bị giới hạn theo tên miền con còn cặp khoá thì không',
            ),
            B(
              'The credentials keep working but user verification is downgraded, so every login needs a second factor again',
              'Tín vật vẫn chạy nhưng phần kiểm chứng người dùng bị hạ cấp, nên mọi lượt đăng nhập lại cần thêm một yếu tố thứ hai',
            ),
            B(
              'Every existing passkey stops working, because credentials are permanently bound to the RP ID chosen at registration; pick the broadest domain you will ever legitimately serve from, and write down why',
              'Mọi passkey đang có ngừng hoạt động, vì tín vật bị buộc VĨNH VIỄN vào cái RP ID đã chọn lúc đăng ký; hãy chọn tên miền RỘNG NHẤT mà bạn sẽ còn phục vụ hợp pháp từ đó, và ghi lại lý do',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The relationship only runs one way. A page on <code>app.cuongthai.com</code> may register a credential under the RP ID <code>cuongthai.com</code>, because that is a registrable parent of the page\'s own domain — but a page on <code>cuongthai.com</code> can never use a credential bound to <code>app.cuongthai.com</code>, and there is no migration for it. Keep the two concepts apart while you are here: the origin is <code>https://app.cuongthai.com</code>, scheme and host and port, and it is what the browser writes into the signed client data; the RP ID is the bare domain, and its SHA-256 is what appears in <code>authenticatorData</code>. Verification checks both, and both are what make a relayed signature from a phishing page fail.',
            'Quan hệ này chỉ chạy một chiều. Một trang ở <code>app.cuongthai.com</code> ĐƯỢC phép đăng ký tín vật dưới RP ID <code>cuongthai.com</code>, vì đó là tên miền cha đăng ký được của chính tên miền trang đó — nhưng một trang ở <code>cuongthai.com</code> thì KHÔNG bao giờ dùng được một tín vật buộc vào <code>app.cuongthai.com</code>, và cũng chẳng có đường chuyển đổi nào. Tiện đây hãy tách hẳn hai khái niệm: ORIGIN là <code>https://app.cuongthai.com</code>, gồm giao thức, host và cổng, và đó là thứ trình duyệt tự ghi vào khối dữ liệu client được ký; còn RP ID là tên miền trần, và SHA-256 của nó là thứ xuất hiện trong <code>authenticatorData</code>. Phép kiểm soát cả hai, và cả hai là thứ làm cho một chữ ký bị chuyển tiếp từ trang lừa đảo phải trượt.',
          ),
        }),

        mcq({
          prompt: B(
            'A login page adds conditional UI so a passkey appears in the browser\'s own autofill. The call runs, no error appears in the console, and no passkey is ever offered. What is the most likely cause?',
            'Một trang đăng nhập thêm giao diện có điều kiện để passkey hiện ra ngay trong ô tự điền của trình duyệt. Lời gọi có chạy, console không báo lỗi gì, và không bao giờ có passkey nào được mời. Nguyên nhân khả dĩ nhất là gì?',
          ),
          options: [
            B(
              'The <code>challenge</code> was reused from the previous page load, and the browser silently refuses a challenge it has already seen',
              'Giá trị <code>challenge</code> bị dùng lại từ lượt tải trang trước, và trình duyệt âm thầm từ chối một thử thách nó đã thấy rồi',
            ),
            B(
              'The credential was registered with <code>residentKey: \'preferred\'</code> rather than <code>\'required\'</code>, which makes it invisible to any autofill flow',
              'Tín vật được đăng ký với <code>residentKey: \'preferred\'</code> chứ không phải <code>\'required\'</code>, khiến nó vô hình với mọi luồng tự điền',
            ),
            B(
              'The input is missing <code>webauthn</code> in its <code>autocomplete</code> attribute, without which conditional mediation does nothing at all and reports no error',
              'Ô nhập thiếu chữ <code>webauthn</code> trong thuộc tính <code>autocomplete</code>, thiếu nó thì phần điều phối có điều kiện KHÔNG làm gì cả và cũng không báo lỗi nào',
            ),
            B(
              'Conditional mediation requires <code>attestation: \'direct\'</code>, and the registration used <code>\'none\'</code>',
              'Điều phối có điều kiện đòi <code>attestation: \'direct\'</code>, mà lúc đăng ký lại dùng <code>\'none\'</code>',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The field must be marked <code>autocomplete="username webauthn"</code>; without that token the browser has nowhere to attach the offer, and because the whole design fails silently on purpose — a user with no passkey must see an ordinary login form and never know the call happened — there is no error to read. That silence is the feature and the debugging trap at once. Attestation is about proving what kind of device the authenticator is and is unrelated; <code>\'none\'</code> is the right default. A fresh server-issued challenge is required for every ceremony, but reusing one produces a verification failure later rather than an empty autofill. And <code>residentKey: \'preferred\'</code> does produce discoverable credentials on every current platform authenticator.',
            'Ô nhập phải được đánh dấu <code>autocomplete="username webauthn"</code>; thiếu chữ đó thì trình duyệt chẳng có chỗ nào để gắn lời mời vào, và vì cả thiết kế này CỐ Ý hỏng trong im lặng — một người không có passkey phải thấy một biểu mẫu đăng nhập bình thường và không bao giờ biết lời gọi kia đã chạy — nên chẳng có lỗi nào để đọc. Chính sự im lặng ấy vừa là tính năng vừa là cái bẫy khi đi tìm lỗi. Attestation là chuyện chứng minh thiết bị xác thực thuộc loại nào, không liên quan; <code>\'none\'</code> là mặc định đúng. Mỗi nghi thức đều cần một thử thách mới do máy chủ phát, nhưng dùng lại một cái sẽ gây trượt ở bước kiểm về sau chứ không làm ô tự điền trống trơn. Còn <code>residentKey: \'preferred\'</code> thì vẫn cho ra tín vật tự khám phá được trên mọi bộ xác thực nền tảng hiện nay.',
          ),
        }),

        // ── Chương 8 — OAuth 2.1 và OpenID Connect ──────────────────────
        mcq({
          prompt: B(
            'Measured today: ' + c('GET https://accounts.google.com/.well-known/openid-configuration') + ' answers 200 and names the authorization, token, userinfo and JWKS endpoints, the supported PKCE methods and the ID token signing algorithms. ' + c('GitHub') + ' answers 403 and has no such document. What does that difference mean in practice?',
            'Đo hôm nay: ' + c('GET https://accounts.google.com/.well-known/openid-configuration') + ' trả 200 và nêu ra các endpoint authorization, token, userinfo và JWKS, các phương thức PKCE hỗ trợ và thuật toán ký ID token. ' + c('GitHub') + ' trả 403 và không có tài liệu nào như vậy. Khác biệt đó có nghĩa gì trên thực tế?',
          ),
          options: [
            B(
              'GitHub is plain OAuth 2.0 and issues no ID token, so identity has to come from an API call and the verified address needs a separate request',
              'GitHub là OAuth 2.0 thuần và không phát ID token, nên danh tính phải lấy bằng một lời gọi API và địa chỉ đã xác minh thì phải xin bằng một request riêng',
            ),
            B(
              'GitHub requires authentication before serving discovery, so the same document is available once a client id is presented',
              'GitHub bắt xác thực trước khi phục vụ tài liệu discovery, nên vẫn lấy được đúng tài liệu ấy khi đã trình client id',
            ),
            B(
              'GitHub publishes discovery under a different path, so the integration only needs the correct URL',
              'GitHub công bố tài liệu discovery ở một đường dẫn khác, nên phần tích hợp chỉ cần đúng URL là xong',
            ),
            B(
              'The document is optional metadata, so both providers behave identically and the ID token arrives either way',
              'Tài liệu đó chỉ là siêu dữ liệu không bắt buộc, nên hai nhà cung cấp hành xử y hệt nhau và ID token vẫn tới ở cả hai đường',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The discovery document is what makes an OIDC provider self-describing: one URL gives you every endpoint, the JWKS location for key rotation, and the algorithms you should pin. GitHub never joined that layer — it is OAuth 2.0 for delegation, with no <code>id_token</code> at all — so a "sign in with GitHub" integration reads identity from an API call and must request the verified email addresses separately, because the profile endpoint may return none. Microsoft is a third shape worth knowing: it does publish discovery, but its issuer contains a tenant id, so a naive string comparison against a hard-coded issuer breaks the moment a second tenant signs in. Read each provider\'s own documentation on top of the specification, write an integration test per provider, and keep the deviations in a comment next to the code.',
            'Tài liệu discovery chính là thứ làm cho một nhà cung cấp OIDC tự mô tả được: một URL cho bạn mọi endpoint, chỗ đặt JWKS để xoay khoá, và các thuật toán cần ghim. GitHub chưa bao giờ tham gia tầng đó — nó là OAuth 2.0 để uỷ quyền, không có <code>id_token</code> nào — nên một tích hợp "đăng nhập bằng GitHub" phải đọc danh tính từ một lời gọi API và phải xin RIÊNG danh sách địa chỉ đã xác minh, vì endpoint hồ sơ có thể chẳng trả về cái nào. Microsoft là hình dạng thứ ba đáng biết: nó CÓ công bố discovery, nhưng issuer của nó chứa mã tenant, nên một phép so chuỗi ngây thơ với một issuer viết cứng sẽ vỡ ngay khi có tenant thứ hai đăng nhập. Hãy đọc tài liệu của từng nhà cung cấp CHỒNG LÊN đặc tả, viết một bài kiểm tích hợp cho mỗi nhà cung cấp, và giữ các chỗ lệch chuẩn trong một khối chú thích ngay cạnh mã.',
          ),
        }),

        mcq({
          prompt: B(
            'A tutorial found online uses <code>response_type=token</code> for a single-page app and, on another page, posts the user\'s provider password to the token endpoint. Both examples still work against some providers. What does current guidance say?',
            'Một hướng dẫn tìm thấy trên mạng dùng <code>response_type=token</code> cho ứng dụng một trang, và ở một trang khác thì POST thẳng mật khẩu nhà cung cấp của người dùng tới endpoint token. Cả hai ví dụ vẫn chạy được với vài nhà cung cấp. Hướng dẫn hiện hành nói gì?',
          ),
          options: [
            B(
              'Both are still permitted for public clients that cannot hold a secret, which is exactly what a single-page app is',
              'Cả hai vẫn được phép với các client công khai không giữ nổi bí mật, mà ứng dụng một trang thì đúng là như vậy',
            ),
            B(
              'The implicit flow is fine over HTTPS; only the password grant was removed, because it cannot support MFA',
              'Luồng implicit thì không sao khi chạy trên HTTPS; chỉ có phần trao đổi bằng mật khẩu bị bỏ, vì nó không hỗ trợ nổi MFA',
            ),
            B(
              'OAuth 2.1 removes both — the implicit flow puts a token in the URL fragment, and the password grant recreates the very problem OAuth existed to remove — and it requires PKCE for every client, with exact redirect URI matching',
              'OAuth 2.1 bỏ cả hai — luồng implicit đặt token vào phần fragment của URL, còn trao đổi bằng mật khẩu thì dựng lại đúng cái vấn đề mà OAuth sinh ra để xoá bỏ — và nó bắt buộc PKCE với MỌI client, kèm khớp redirect URI chính xác',
            ),
            B(
              'Both were replaced by the device code flow, which is now the single flow for every client type',
              'Cả hai được thay bằng luồng device code, thứ nay là luồng duy nhất cho mọi loại client',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A token in the fragment lands in browser history, in the <code>Referer</code> and in reach of every script on the page, and no amount of TLS changes that — the transport was never the weakness. The password grant hands a third party the user\'s provider credentials, which is precisely what OAuth was invented to stop, and it cannot carry MFA or a passkey. One flow now covers every client: authorization code with PKCE, with the verifier held server-side. The device code flow is real and useful, but it is for input-constrained devices such as a television, not a replacement for everything. If a guide tells you to use <code>response_type=token</code> or to post a password to a token endpoint, it is describing 2012.',
            'Một token nằm trong fragment sẽ rơi vào lịch sử trình duyệt, vào header <code>Referer</code> và vào tầm với của mọi script trên trang, và TLS nhiều đến mấy cũng không đổi được điều đó — chỗ yếu chưa bao giờ nằm ở đường truyền. Trao đổi bằng mật khẩu là đưa tín vật nhà cung cấp của người dùng cho một bên thứ ba, đúng thứ mà OAuth được phát minh ra để chặn, và nó cũng không cõng nổi MFA hay passkey. Giờ chỉ còn một luồng cho mọi client: authorization code kèm PKCE, với verifier giữ ở phía máy chủ. Luồng device code là có thật và hữu ích, nhưng nó dành cho thiết bị khó nhập liệu như cái tivi, không phải thứ thay thế cho tất cả. Nếu một bài hướng dẫn bảo bạn dùng <code>response_type=token</code> hay POST mật khẩu tới endpoint token, thì nó đang mô tả năm 2012.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on Node 22: a 32-byte verifier is 43 base64url characters, and its S256 challenge is also 43. A provider accepts both <code>S256</code> and <code>plain</code>. Why must the client never send <code>plain</code>?',
            'Đo thật trên Node 22: một verifier 32 byte dài 43 ký tự base64url, và challenge S256 của nó cũng 43 ký tự. Một nhà cung cấp nhận cả <code>S256</code> lẫn <code>plain</code>. Vì sao client tuyệt đối không được gửi <code>plain</code>?',
          ),
          options: [
            B(
              'Because <code>plain</code> sends the verifier itself as the challenge, so anyone who sees the authorization request can replay it — the binding disappears entirely',
              'Vì <code>plain</code> gửi chính cái verifier làm challenge, nên ai nhìn thấy request authorization là phát lại được — mối buộc biến mất hoàn toàn',
            ),
            B(
              'Because <code>plain</code> is limited to 43 characters while <code>S256</code> allows up to 128, so long verifiers are silently truncated',
              'Vì <code>plain</code> bị giới hạn 43 ký tự còn <code>S256</code> cho tới 128, nên các verifier dài bị cắt cụt trong im lặng',
            ),
            B(
              'Because <code>plain</code> uses standard base64, whose <code>+</code> and <code>/</code> characters break the authorization URL',
              'Vì <code>plain</code> dùng base64 chuẩn, mà các ký tự <code>+</code> và <code>/</code> của nó làm hỏng URL authorization',
            ),
            B(
              'Because <code>plain</code> requires the client secret at the exchange, which a single-page app does not have',
              'Vì <code>plain</code> đòi client secret ở bước đổi mã, thứ mà ứng dụng một trang không có',
            ),
          ],
          correct: 0,
          explanation: EX(
            'PKCE works because the front channel carries only a value derived from a secret, and the back channel carries the secret itself. With <code>S256</code> the authorization request reveals <code>sha256(verifier)</code>, which nobody can invert, so an intercepted authorization code cannot be exchanged without the value that never left your server. With <code>plain</code> the challenge <em>is</em> the verifier, so the front channel now carries the secret and anybody who reads that URL — a mobile app registering the same custom scheme, a proxy log, browser history — has everything. The verifier lives server-side keyed by session, for the same reason the WebAuthn challenge does: a verifier in <code>sessionStorage</code> is readable by any script on the page, and one round-tripped through a URL is not a secret at all.',
            'PKCE hoạt động được vì kênh trước chỉ mang một giá trị DẪN XUẤT từ một bí mật, còn kênh sau mới mang chính cái bí mật. Với <code>S256</code>, request authorization lộ ra <code>sha256(verifier)</code>, thứ không ai đảo ngược được, nên một mã authorization bị chặn cũng không đổi được nếu thiếu cái giá trị chưa từng rời máy chủ của bạn. Với <code>plain</code> thì challenge CHÍNH LÀ verifier, nên kênh trước giờ mang luôn bí mật, và ai đọc được cái URL ấy — một ứng dụng di động đăng ký cùng một lược đồ URL tự chế, một dòng log của proxy, lịch sử trình duyệt — là có đủ mọi thứ. Verifier sống ở phía máy chủ, khoá theo phiên, cùng lý do với thử thách của WebAuthn: một verifier nằm trong <code>sessionStorage</code> thì mọi script trên trang đọc được, còn một cái đi vòng qua URL rồi quay lại thì chẳng còn là bí mật nữa.',
          ),
        }),

        mcq({
          prompt: B(
            'A callback handler exchanges the authorization code and it works — except in development, where it intermittently fails with <code>invalid_grant</code> and sometimes the provider revokes the whole grant. What is the usual cause?',
            'Một handler ở đường quay về đổi mã authorization và nó chạy được — trừ lúc phát triển, nơi nó thỉnh thoảng trượt với <code>invalid_grant</code> và đôi khi nhà cung cấp thu hồi luôn cả quyền đã cấp. Nguyên nhân thường gặp là gì?',
          ),
          options: [
            B(
              'Clock skew: the development machine is ahead of the provider, so the code appears to be issued in the future',
              'Lệch đồng hồ: máy phát triển chạy nhanh hơn nhà cung cấp, nên cái mã trông như được phát ra ở tương lai',
            ),
            B(
              'The code is single use, and the handler ran twice — a page refresh, a link prefetcher, or a client-side router mounting the component twice in development',
              'Cái mã chỉ dùng được một lần, và handler đã chạy HAI lượt — do tải lại trang, do một bộ tải trước đường dẫn, hoặc do bộ định tuyến phía client gắn component hai lần ở chế độ phát triển',
            ),
            B(
              'The development client id is missing the <code>offline_access</code> scope, without which a code cannot be exchanged at all',
              'Client id ở môi trường phát triển thiếu scope <code>offline_access</code>, thiếu nó thì không đổi mã được',
            ),
            B(
              'PKCE is enabled in production and disabled locally, and a provider that expects a verifier rejects a request without one',
              'PKCE bật ở production và tắt ở máy local, mà một nhà cung cấp đang chờ verifier thì từ chối request không có nó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Providers invalidate a code the moment it is redeemed, and several treat a second attempt as evidence of theft and revoke the entire grant — the same reuse-detection logic as refresh tokens in Chapter 5, which is why the symptom is so alarming for such an ordinary cause. In development the extra run is almost always a framework being helpful: a router that mounts an effect twice, or a dev-time strict mode that deliberately double-invokes. Three habits fix it: redirect away from the callback URL as soon as it is handled, make the handler idempotent for a session that is already authenticated, and never retry a failed exchange with the same code. Clock skew produces a different error, and a missing scope or a missing verifier fails on the first attempt rather than intermittently.',
            'Nhà cung cấp vô hiệu hoá một cái mã ngay khoảnh khắc nó được dùng, và vài nơi coi lần thử thứ hai là bằng chứng của trộm cắp rồi thu hồi trọn quyền đã cấp — đúng lối phát hiện tái dùng của refresh token ở chương 5, và đó là lý do một nguyên nhân tầm thường lại cho ra một triệu chứng đáng sợ như vậy. Ở môi trường phát triển, lượt chạy dư gần như luôn là một khung phần mềm đang "giúp": một bộ định tuyến gắn hiệu ứng hai lần, hay một chế độ nghiêm ngặt lúc phát triển cố tình gọi kép. Ba thói quen chữa được: chuyển hướng khỏi URL quay về ngay khi xử lý xong, làm cho handler bất biến khi phiên đã xác thực rồi, và không bao giờ thử lại một lượt đổi mã đã trượt bằng chính cái mã cũ. Lệch đồng hồ cho ra một lỗi khác, còn thiếu scope hay thiếu verifier thì trượt ngay từ lần đầu chứ không chập chờn.',
          ),
        }),

        mcq({
          prompt: B(
            'The registered redirect URI is matched exactly and the callback route is correct. The page it renders then does <code>302 /bang-dieu-khien?next=https://evil.example</code> and the dashboard forwards the browser onward. Why is that an OAuth vulnerability?',
            'Địa chỉ redirect đã đăng ký được khớp CHÍNH XÁC và route quay về cũng đúng. Trang nó dựng ra sau đó chạy <code>302 /bang-dieu-khien?next=https://evil.example</code> và trang bảng điều khiển đẩy trình duyệt đi tiếp. Vì sao đó lại là một lỗ hổng OAuth?',
          ),
          options: [
            B(
              'It is not one: the code was already exchanged by the callback, so anything after that point is an ordinary open redirect with no OAuth consequence',
              'Không phải: cái mã đã được callback đổi xong rồi, nên mọi thứ sau điểm đó chỉ là một cú chuyển hướng mở bình thường, không dính dáng gì tới OAuth',
            ),
            B(
              'The authorization code rides along in the <code>Referer</code> when the browser leaves your domain, so an open redirect anywhere on the site hands it to the attacker',
              'Mã authorization đi theo trong header <code>Referer</code> lúc trình duyệt rời khỏi tên miền của bạn, nên một cú chuyển hướng mở ở BẤT KỲ đâu trên trang là trao nó cho kẻ tấn công',
            ),
            B(
              'The provider validates the final landing page as well as the registered URI, so the flow is rejected on the next attempt',
              'Nhà cung cấp kiểm cả trang đích cuối cùng chứ không chỉ địa chỉ đã đăng ký, nên luồng sẽ bị từ chối ở lần thử kế tiếp',
            ),
            B(
              'The <code>state</code> parameter is consumed by the first redirect, so the second one arrives without it and the CSRF check silently passes',
              'Tham số <code>state</code> bị lượt chuyển hướng đầu tiên tiêu thụ mất, nên lượt thứ hai tới mà không có nó và phép kiểm CSRF âm thầm cho qua',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The registered URI is honoured, your own server then forwards the browser outward, and the URL it is leaving still carries <code>?code=…</code> — which arrives at the attacker in the <code>Referer</code> header of that outbound request, and lands in their access log. Whether the code has already been redeemed is a race you do not control, and with PKCE the code alone is less useful, which is a mitigation rather than a fix. So the audit is wider than the auth module: every <code>next</code>, <code>return_to</code> and <code>continue</code> parameter in the whole product is part of the OAuth attack surface. Keep the return path server-side alongside the state, validate it against an allow-list of internal paths, and set <code>Referrer-Policy: no-referrer</code> on the callback route — the same reasoning as the reset link in Chapter 6.',
            'Địa chỉ đã đăng ký được tôn trọng, rồi chính máy chủ của bạn đẩy trình duyệt ra ngoài, và cái URL nó vừa rời đi vẫn còn mang <code>?code=…</code> — thứ tới tay kẻ tấn công trong header <code>Referer</code> của đúng request đi ra ấy, rồi nằm lại trong log truy cập của họ. Chuyện cái mã đã kịp bị tiêu hay chưa là một cuộc đua bạn không kiểm soát, còn PKCE thì làm cho riêng cái mã bớt hữu dụng — đó là giảm nhẹ chứ không phải cách sửa. Vậy nên phạm vi phải rà rộng hơn mô-đun xác thực: mọi tham số <code>next</code>, <code>return_to</code>, <code>continue</code> trong cả sản phẩm đều là một phần bề mặt tấn công của OAuth. Hãy giữ đường quay về ở phía máy chủ, ngay cạnh state, đối chiếu nó với một danh sách CHO PHÉP các đường dẫn nội bộ, và đặt <code>Referrer-Policy: no-referrer</code> cho route quay về — đúng lối lập luận của đường dẫn đặt lại mật khẩu ở chương 6.',
          ),
        }),

        mcq({
          prompt: B(
            'A provider-link table is keyed on the verified email address, on the grounds that a verified address uniquely identifies a person. Two support tickets arrive: a user renamed their Workspace address, and a departed employee\'s mailbox was reassigned. What was the correct key?',
            'Bảng liên kết nhà cung cấp khoá theo địa chỉ email đã xác minh, với lý lẽ rằng một địa chỉ đã xác minh thì định danh duy nhất một con người. Hai phiếu hỗ trợ tới: một người vừa đổi tên địa chỉ Workspace của mình, và hộp thư của một nhân viên đã nghỉ được cấp lại cho người khác. Khoá đúng đáng lẽ phải là gì?',
          ),
          options: [
            B(
              'The pair <code>(provider, sub)</code>, because <code>sub</code> is stable for the lifetime of that provider account and is only unique within one provider; the address is a display attribute kept as a snapshot',
              'Cặp <code>(provider, sub)</code>, vì <code>sub</code> ổn định suốt vòng đời của tài khoản ở nhà cung cấp đó và chỉ duy nhất TRONG PHẠM VI một nhà cung cấp; địa chỉ chỉ là thuộc tính hiển thị, giữ lại làm ảnh chụp',
            ),
            B(
              'The <code>sub</code> claim alone, which is a globally unique identifier issued from one namespace shared by all OIDC providers',
              'Riêng claim <code>sub</code>, vốn là một định danh duy nhất toàn cầu phát ra từ một không gian tên dùng chung cho mọi nhà cung cấp OIDC',
            ),
            B(
              'The pair <code>(provider, email)</code>, which resolves the reassignment case because the provider name disambiguates it',
              'Cặp <code>(provider, email)</code>, thứ giải quyết được ca cấp lại hộp thư vì tên nhà cung cấp đã phân biệt giúp rồi',
            ),
            B(
              'The <code>email_verified</code> claim combined with the address, since a re-verification at the provider would have produced a new value',
              'Claim <code>email_verified</code> ghép với địa chỉ, vì một lượt xác minh lại ở nhà cung cấp sẽ sinh ra một giá trị mới',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Both tickets are the same bug seen from two directions: an address is a mutable attribute of a provider account, not the identity of one. Rename it and the user looks like a stranger; reassign it and a stranger looks like the user — and the second case is an account takeover your own code performed. The <code>sub</code> claim is what stays fixed, and it is unique only within one issuer, so two providers can hand out the same string to different people; the unique constraint must cover the pair and every lookup must name the provider. Keep the address you saw on the link row anyway, purely for humans: when a ticket says "Google sign-in stopped working", the answer is usually that <code>sub</code> is unchanged and the address moved, and having both written down turns a mystery into a sentence.',
            'Hai cái phiếu ấy là cùng một con lỗi nhìn từ hai phía: một địa chỉ là THUỘC TÍNH thay đổi được của một tài khoản nhà cung cấp, không phải DANH TÍNH của nó. Đổi tên nó thì người dùng trông như người lạ; cấp lại nó thì người lạ trông như người dùng — và ca thứ hai là một cú chiếm tài khoản do chính mã của bạn thực hiện. Claim <code>sub</code> mới là thứ đứng yên, và nó chỉ duy nhất trong phạm vi MỘT nơi phát hành, nên hai nhà cung cấp hoàn toàn có thể phát cùng một chuỗi cho hai người khác nhau; ràng buộc duy nhất phải phủ cả CẶP và mọi lượt tra cứu đều phải nêu tên nhà cung cấp. Dù vậy vẫn hãy giữ địa chỉ bạn đã thấy trên hàng liên kết, thuần tuý cho con người đọc: khi một phiếu nói "đăng nhập Google hỏng rồi", câu trả lời thường là <code>sub</code> vẫn thế còn địa chỉ đã dời đi, và có sẵn cả hai thứ ghi lại thì một điều bí ẩn biến thành một câu nói.',
          ),
        }),

        mcq({
          prompt: B(
            'A "sign in with Google" callback finds no provider link, but the verified address matches an existing account that has a password and a passkey. Which behaviour is correct?',
            'Một lượt quay về từ "đăng nhập bằng Google" không tìm thấy liên kết nhà cung cấp nào, nhưng địa chỉ đã xác minh lại khớp một tài khoản đang có sẵn mật khẩu và một passkey. Hành vi nào là đúng?',
          ),
          options: [
            B(
              'Sign them in and create the link, because the provider verified the address and therefore the person owns that mailbox',
              'Đăng nhập cho họ và tạo liên kết, vì nhà cung cấp đã xác minh địa chỉ nên người này sở hữu hộp thư đó',
            ),
            B(
              'Refuse the login entirely and tell the user to disable their password before using a provider',
              'Từ chối hẳn lượt đăng nhập và bảo người dùng gỡ mật khẩu đi trước khi dùng nhà cung cấp',
            ),
            B(
              'Store a pending link request and ask the side that can already prove ownership to authenticate — automatic linking is only safe when the existing account has no other way in',
              'Lưu một yêu cầu liên kết đang chờ và bắt phía vốn đã chứng minh được quyền sở hữu xác thực trước — nối tự động chỉ an toàn khi tài khoản đang có KHÔNG còn đường nào khác để vào',
            ),
            B(
              'Create a second account for the provider identity and offer to merge them later from the settings page',
              'Tạo một tài khoản thứ hai cho danh tính từ nhà cung cấp rồi mời họ gộp lại sau từ trang cài đặt',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Owning the mailbox today is not the same as being the person who created your account, and automatic linking silently makes the weakest provider you accept the security level of every account: corporate addresses get reassigned, domains change hands, and provider accounts get taken over — in each case linking hands over an account with a password the attacker never learned. When the existing account has no password and no other factor, nobody owns it in any provable sense and linking straight away is safe. Otherwise store the pending request and ask for the password or the passkey, and mail the account either way, because a new sign-in method is a new key to the house. Never create a duplicate and never merge automatically: merging destroys data and is nearly impossible to undo correctly, so it must be an explicit, confirmed and logged operation.',
            'Sở hữu hộp thư HÔM NAY không đồng nghĩa với việc là người đã tạo ra tài khoản của bạn, và nối tự động sẽ âm thầm biến nhà cung cấp yếu nhất mà bạn chấp nhận thành mức an toàn của MỌI tài khoản: địa chỉ công ty bị cấp lại, tên miền đổi chủ, tài khoản nhà cung cấp bị chiếm — ca nào cũng vậy, nối tự động là trao đi một tài khoản kèm cái mật khẩu mà kẻ tấn công chưa từng biết. Khi tài khoản đang có không có mật khẩu và không có yếu tố nào khác thì chẳng ai sở hữu nó theo nghĩa chứng minh được, và nối thẳng là an toàn. Còn lại thì hãy lưu yêu cầu đang chờ rồi hỏi mật khẩu hoặc passkey, và gửi thư về tài khoản trong cả hai trường hợp, vì một cách đăng nhập mới là một chiếc chìa khoá mới của căn nhà. Đừng bao giờ tạo bản trùng và đừng bao giờ gộp tự động: gộp làm hỏng dữ liệu và gần như không thể hoàn tác cho đúng, nên nó phải là một thao tác tường minh, có xác nhận và có ghi nhật ký.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            "<p><b>Q31 — Starting an OAuth flow, and surviving the callback (chapter 8).</b> The starter block gives you a deterministic byte source, a clock in seconds, the client id, one registered redirect URI, an allow-list of internal return paths and a server-side <code>FLOWS</code> map. Write three functions.</p><ul><li><code>startFlow(sessionId, returnPath)</code> — generate a <code>code_verifier</code>, derive the <code>code_challenge</code> as base64url of its SHA-256, generate a <code>state</code> and a <code>nonce</code> of 22 characters each, store all four plus the return path and an expiry of <code>NOW + FLOW_TTL</code> against the session, and return the authorization URL. Put <code>client_id</code>, <code>redirect_uri</code>, <code>response_type=code</code>, <code>scope</code>, <code>state</code>, <code>nonce</code>, <code>code_challenge</code> and <code>code_challenge_method=S256</code> in it. The verifier is the one thing that must <b>not</b> appear in that URL. The return path is taken from <code>RETURN_PATHS</code> or falls back to <code>/</code> — never from anything the callback sends.</li><li><code>isRegisteredRedirect(candidate)</code> — exact match against the registered string. No prefix, no wildcard, no normalisation.</li><li><code>handleCallback(sessionId, query)</code> — return <code>{ ok: true, verifier, nonce, returnPath }</code> or <code>{ ok: false, reason }</code> with one of <code>no flow</code>, <code>flow expired</code>, <code>state missing</code>, <code>state mismatch</code>, <code>code missing</code>. Compare the state with <code>crypto.timingSafeEqual</code> after settling the length, and delete the flow record as soon as the state matches, so a replayed callback finds nothing.</li></ul><p>Keep the fixtures and the harness exactly as they are, and do not install anything. Read the redirect table the harness prints: the <code>host</code> column is what <code>new URL()</code> really parses, and it is the reason prefix matching loses.</p>",
            "<p><b>Câu 31 — Mở một luồng OAuth, và sống sót ở đường quay về (chương 8).</b> Khối đề cho sẵn một nguồn byte tất định, một đồng hồ tính bằng giây, client id, một địa chỉ redirect đã đăng ký, một danh sách cho phép các đường dẫn nội bộ và bảng <code>FLOWS</code> nằm phía máy chủ. Hãy viết ba hàm.</p><ul><li><code>startFlow(sessionId, returnPath)</code> — sinh <code>code_verifier</code>, dẫn ra <code>code_challenge</code> là base64url của SHA-256 của nó, sinh <code>state</code> và <code>nonce</code> mỗi cái 22 ký tự, cất cả bốn thứ cùng đường quay về và hạn <code>NOW + FLOW_TTL</code> theo mã phiên, rồi trả về URL authorization. Trong URL phải có <code>client_id</code>, <code>redirect_uri</code>, <code>response_type=code</code>, <code>scope</code>, <code>state</code>, <code>nonce</code>, <code>code_challenge</code> và <code>code_challenge_method=S256</code>. Verifier là thứ DUY NHẤT không được xuất hiện trong URL đó. Đường quay về lấy từ <code>RETURN_PATHS</code> hoặc lùi về <code>/</code> — không bao giờ lấy từ thứ mà đường quay về gửi lên.</li><li><code>isRegisteredRedirect(candidate)</code> — khớp CHÍNH XÁC với chuỗi đã đăng ký. Không tiền tố, không ký tự đại diện, không chuẩn hoá.</li><li><code>handleCallback(sessionId, query)</code> — trả về <code>{ ok: true, verifier, nonce, returnPath }</code> hoặc <code>{ ok: false, reason }</code> với một trong các lý do <code>no flow</code>, <code>flow expired</code>, <code>state missing</code>, <code>state mismatch</code>, <code>code missing</code>. So state bằng <code>crypto.timingSafeEqual</code> sau khi đã giải quyết xong chuyện độ dài, và xoá bản ghi luồng NGAY khi state khớp, để một lượt quay về phát lại chẳng còn tìm thấy gì.</li></ul><p>Giữ nguyên phần dữ liệu cho sẵn và phần khung chạy, và không cài thêm thư viện nào. Hãy đọc kỹ bảng redirect mà khung chạy in ra: cột <code>host</code> là thứ <code>new URL()</code> thật sự phân tích ra, và đó chính là lý do khớp theo tiền tố luôn thua.</p>",
          ),
          language: 'javascript',
          starterCode: "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n'use strict';\nconst crypto = require('node:crypto');\n\n// Nguồn ngẫu nhiên TẤT ĐỊNH. Trên production: crypto.randomBytes(32).\nlet n = 0;\nconst nextBytes = () => crypto.createHash('sha256').update('DE-THI-GIA-' + (++n)).digest();\n\n// Đồng hồ giả, tính bằng giây.\nlet NOW = 1_800_000_000;\nconst FLOW_TTL = 600;                       // một luồng OAuth sống 10 phút\n\nconst CLIENT_ID = '1234.apps.googleusercontent.com';\nconst REGISTERED_REDIRECT = 'https://cuongthai.com/oauth/google/quay-ve';\nconst RETURN_PATHS = new Set(['/bang-dieu-khien', '/ho-so', '/']);\n\n// Kho phía MÁY CHỦ, khoá theo mã phiên trình duyệt. Không gì trong đây\n// từng đi qua trình duyệt.\nconst FLOWS = new Map();\n\n// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n\nfunction startFlow(sessionId, returnPath) {\n  // TODO\n}\n\nfunction isRegisteredRedirect(candidate) {\n  // TODO\n}\n\nfunction handleCallback(sessionId, query) {\n  // TODO\n}\n\n// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\nconst P = (label, v) => console.log(String(label).padEnd(40) + v);\nconst param = (url, k) => new URL(url).searchParams.get(k);\n\nconsole.log('== the authorisation request ==');\nconst url = startFlow('sess_an', '/bang-dieu-khien');\nP('challenge method', param(url, 'code_challenge_method'));\nP('challenge length', param(url, 'code_challenge').length);\nP('state length', param(url, 'state').length);\nP('the verifier is in the URL', url.includes(FLOWS.get('sess_an').verifier));\nP('S256(verifier) === challenge',\n  crypto.createHash('sha256').update(FLOWS.get('sess_an').verifier).digest('base64url') === param(url, 'code_challenge'));\nP('redirect_uri sent', decodeURIComponent(param(url, 'redirect_uri')));\n\nconsole.log('== redirect_uri matching, with the real host ==');\nconst CANDIDATES = [\n  'https://cuongthai.com/oauth/google/quay-ve',\n  'https://cuongthai.com/oauth/google/quay-ve/../../ra-ngoai',\n  'https://cuongthai.com/oauth/google/quay-ve?next=https://evil.example',\n  'https://cuongthai.com/oauth/google/quay-ve#@evil.example',\n  'https://cuongthai.com.evil.example/oauth/google/quay-ve',\n  'https://cuongthai.com@evil.example/oauth/google/quay-ve',\n  'https://cuongthai.com:443/oauth/google/quay-ve',\n];\nfor (const c of CANDIDATES) {\n  const prefix = c.startsWith(REGISTERED_REDIRECT) ? 'prefix:ALLOW' : 'prefix:block';\n  const exact = isRegisteredRedirect(c) ? 'exact:ALLOW' : 'exact:block';\n  let host = 'unparseable';\n  try { host = new URL(c).host; } catch { /* keep */ }\n  console.log(prefix + '  ' + exact.padEnd(12) + 'host=' + host.padEnd(28) + c);\n}\n\nconsole.log('== the callback ==');\nconst good = FLOWS.get('sess_an') ?? null;\nconst state = param(url, 'state');\nP('wrong state', JSON.stringify(handleCallback('sess_an', { code: 'c1', state: 'WRONG' })));\nP('state missing', JSON.stringify(handleCallback('sess_an', { code: 'c1' })));\nP('another session', JSON.stringify(handleCallback('sess_khac', { code: 'c1', state })));\nconst ok = handleCallback('sess_an', { code: 'c1', state });\nP('correct', JSON.stringify({ ok: ok.ok, returnPath: ok.returnPath, sameVerifier: ok.verifier === good.verifier }));\nP('replayed after success', JSON.stringify(handleCallback('sess_an', { code: 'c1', state })));\n\nconsole.log('== the return path is never taken from the callback ==');\nconst url2 = startFlow('sess_binh', 'https://evil.example/steal');\nconst r2 = handleCallback('sess_binh', { code: 'c2', state: param(url2, 'state'), next: 'https://evil.example/steal' });\nP('returnPath', r2.returnPath);\n\nconsole.log('== a flow that timed out ==');\nconst url3 = startFlow('sess_chi', '/ho-so');\nNOW += FLOW_TTL + 1;\nP('after 601 seconds', JSON.stringify(handleCallback('sess_chi', { code: 'c3', state: param(url3, 'state') })));\n",
          expectedOutput: "== the authorisation request ==\nchallenge method                        S256\nchallenge length                        43\nstate length                            22\nthe verifier is in the URL              false\nS256(verifier) === challenge            true\nredirect_uri sent                       https://cuongthai.com/oauth/google/quay-ve\n== redirect_uri matching, with the real host ==\nprefix:ALLOW  exact:ALLOW host=cuongthai.com               https://cuongthai.com/oauth/google/quay-ve\nprefix:ALLOW  exact:block host=cuongthai.com               https://cuongthai.com/oauth/google/quay-ve/../../ra-ngoai\nprefix:ALLOW  exact:block host=cuongthai.com               https://cuongthai.com/oauth/google/quay-ve?next=https://evil.example\nprefix:ALLOW  exact:block host=cuongthai.com               https://cuongthai.com/oauth/google/quay-ve#@evil.example\nprefix:block  exact:block host=cuongthai.com.evil.example  https://cuongthai.com.evil.example/oauth/google/quay-ve\nprefix:block  exact:block host=evil.example                https://cuongthai.com@evil.example/oauth/google/quay-ve\nprefix:block  exact:block host=cuongthai.com               https://cuongthai.com:443/oauth/google/quay-ve\n== the callback ==\nwrong state                             {\"ok\":false,\"reason\":\"state mismatch\"}\nstate missing                           {\"ok\":false,\"reason\":\"state missing\"}\nanother session                         {\"ok\":false,\"reason\":\"no flow\"}\ncorrect                                 {\"ok\":true,\"returnPath\":\"/bang-dieu-khien\",\"sameVerifier\":true}\nreplayed after success                  {\"ok\":false,\"reason\":\"no flow\"}\n== the return path is never taken from the callback ==\nreturnPath                              /\n== a flow that timed out ==\nafter 601 seconds                       {\"ok\":false,\"reason\":\"flow expired\"}",
          sampleSolution: "function startFlow(sessionId, returnPath) {\n  const verifier = nextBytes().toString('base64url');\n  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');\n  const state = nextBytes().toString('base64url').slice(0, 22);\n  const nonce = nextBytes().toString('base64url').slice(0, 22);\n  FLOWS.set(sessionId, {\n    verifier, state, nonce,\n    returnPath: RETURN_PATHS.has(returnPath) ? returnPath : '/',\n    expiresAt: NOW + FLOW_TTL,\n  });\n  const url = 'https://accounts.google.com/o/oauth2/v2/auth'\n    + '?client_id=' + encodeURIComponent(CLIENT_ID)\n    + '&redirect_uri=' + encodeURIComponent(REGISTERED_REDIRECT)\n    + '&response_type=code'\n    + '&scope=' + encodeURIComponent('openid email profile')\n    + '&state=' + state\n    + '&nonce=' + nonce\n    + '&code_challenge=' + challenge\n    + '&code_challenge_method=S256';\n  return url;\n}\n\nfunction isRegisteredRedirect(candidate) {\n  return candidate === REGISTERED_REDIRECT;\n}\n\nfunction handleCallback(sessionId, query) {\n  const flow = FLOWS.get(sessionId);\n  if (!flow) return { ok: false, reason: 'no flow' };\n  if (NOW >= flow.expiresAt) { FLOWS.delete(sessionId); return { ok: false, reason: 'flow expired' }; }\n  if (typeof query.state !== 'string' || query.state === '') return { ok: false, reason: 'state missing' };\n\n  const a = Buffer.from(query.state);\n  const b = Buffer.from(flow.state);\n  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { ok: false, reason: 'state mismatch' };\n\n  // state đúng ⇒ luồng này tiêu thụ xong, dùng một lần\n  FLOWS.delete(sessionId);\n\n  if (typeof query.code !== 'string' || query.code === '') return { ok: false, reason: 'code missing' };\n  return { ok: true, verifier: flow.verifier, nonce: flow.nonce, returnPath: flow.returnPath };\n}\n",
        }),

        codeQ({
          points: 5,
          prompt: B(
            "<p><b>Q32 — Registration and verification that leak nothing (chapters 6).</b> The starter block gives you a deterministic token source, a clock in milliseconds, a <code>USERS</code> map keyed by normalised address, a <code>VERIFY</code> map keyed by <b>sha256 of the token</b>, a <code>MAILBOX</code> array that records every message sent, and the two fixed answers <code>ANSWER_202</code> and <code>ANSWER_400</code>. Write six functions.</p><ul><li><code>normalizeEmail(raw)</code> — trim, split at the <b>last</b> <code>@</code>, lower-case the domain, apply <code>normalize('NFKC')</code>, then lower-case the whole thing. Return <code>null</code> for anything without exactly one usable <code>@</code>, without a dot in the domain, containing whitespace, or longer than 254 characters. Do <b>not</b> strip dots and do <b>not</b> strip a <code>+</code> tag: those are Gmail rules, not email rules, and at most other providers they name different mailboxes.</li><li><code>register(rawEmail)</code> — an invalid address gets <code>ANSWER_400</code>. Everything else gets <code>ANSWER_202</code>, byte for byte the same object, whether or not the address is already taken. The difference goes into the mailbox: <code>verify-your-address</code> for a new account, <code>account-already-exists</code> for a duplicate. Store the typed form in <code>email</code> and the normalised form in <code>normalizedEmail</code>.</li><li><code>issueVerifyToken(userId)</code> — delete any outstanding token for that user first, then store <code>{ userId, expiresAt: NOW + DAY }</code> under the hash and return the raw token.</li><li><code>verifyGet(token)</code> — <code>'form'</code> or <code>'invalid'</code>, and it must <b>consume nothing</b>: a mail security gateway fetches this before the human ever opens the message.</li><li><code>verifyPost(token)</code> — <code>'ok'</code> or <code>'invalid'</code>; on success set <code>emailVerifiedAt</code> and delete the row.</li><li><code>resend(rawEmail)</code> — the same <code>ANSWER_202</code> for an unknown address, an already-verified one and one awaiting verification. Only the last case actually issues a token and sends mail.</li></ul><p>Keep the fixtures and the harness exactly as they are, and do not install anything. The harness prints the mail sent after each call, which is the whole point: the answers are identical and the mailbox is where the truth goes.</p>",
            "<p><b>Câu 32 — Đăng ký và xác minh mà không rò rỉ gì (chương 6).</b> Khối đề cho sẵn một nguồn token tất định, một đồng hồ tính bằng mili-giây, bảng <code>USERS</code> khoá theo địa chỉ đã chuẩn hoá, bảng <code>VERIFY</code> khoá theo <b>sha256 của token</b>, mảng <code>MAILBOX</code> ghi lại mọi thư gửi đi, và hai câu trả lời cố định <code>ANSWER_202</code> với <code>ANSWER_400</code>. Hãy viết sáu hàm.</p><ul><li><code>normalizeEmail(raw)</code> — cắt khoảng trắng, tách ở dấu <code>@</code> CUỐI CÙNG, hạ phần tên miền về chữ thường, gọi <code>normalize('NFKC')</code>, rồi hạ cả chuỗi về chữ thường. Trả <code>null</code> với mọi thứ không có đúng một dấu <code>@</code> dùng được, tên miền không có dấu chấm, có khoảng trắng, hoặc dài quá 254 ký tự. TUYỆT ĐỐI không bỏ dấu chấm và không bỏ phần <code>+</code>: đó là luật của Gmail chứ không phải luật của email, và ở phần lớn nhà cung cấp khác chúng là hai hộp thư khác nhau.</li><li><code>register(rawEmail)</code> — địa chỉ không hợp lệ nhận <code>ANSWER_400</code>. Mọi thứ còn lại nhận <code>ANSWER_202</code>, y hệt từng byte, bất kể địa chỉ đã có người dùng hay chưa. Khác biệt đi vào hộp thư: <code>verify-your-address</code> cho tài khoản mới, <code>account-already-exists</code> cho trường hợp trùng. Cất dạng người ta gõ vào <code>email</code> và dạng chuẩn hoá vào <code>normalizedEmail</code>.</li><li><code>issueVerifyToken(userId)</code> — xoá mọi token còn treo của người đó trước, rồi cất <code>{ userId, expiresAt: NOW + DAY }</code> dưới khoá là chuỗi băm và trả về token thô.</li><li><code>verifyGet(token)</code> — trả <code>'form'</code> hoặc <code>'invalid'</code>, và nó KHÔNG được tiêu thụ gì cả: một cổng bảo mật thư sẽ tải đường dẫn này trước cả khi con người kịp mở thư.</li><li><code>verifyPost(token)</code> — trả <code>'ok'</code> hoặc <code>'invalid'</code>; thành công thì đặt <code>emailVerifiedAt</code> và xoá hàng dữ liệu.</li><li><code>resend(rawEmail)</code> — cùng một <code>ANSWER_202</code> cho địa chỉ lạ, cho địa chỉ đã xác minh và cho địa chỉ đang chờ xác minh. Chỉ trường hợp cuối mới thật sự phát token và gửi thư.</li></ul><p>Giữ nguyên phần dữ liệu cho sẵn và phần khung chạy, và không cài thêm thư viện nào. Khung chạy in ra thư đã gửi sau mỗi lời gọi, và đó mới là điểm mấu chốt: câu trả lời giống hệt nhau, còn sự thật thì đi vào hộp thư.</p>",
          ),
          language: 'javascript',
          starterCode: "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n'use strict';\nconst crypto = require('node:crypto');\n\n// Nguồn token TẤT ĐỊNH. Trên production: crypto.randomBytes(32).\nlet n = 0;\nconst nextToken = () => 'vt_' + String(++n).padStart(2, '0') + '_KHONG_PHAI_TOKEN_THAT';\n\nlet NOW = 1_800_000_000_000;                 // đồng hồ giả, mili-giây\nconst DAY = 24 * 60 * 60 * 1000;\n\nconst USERS = new Map();                     // normalizedEmail -> hàng dữ liệu\nconst VERIFY = new Map();                    // sha256(token)   -> hàng dữ liệu\nconst MAILBOX = [];                          // mọi thư gửi đi, để chấm bài\n\nlet nextUserId = 0;\nconst sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');\nconst send = (to, kind) => MAILBOX.push({ to, kind });\n\nconst ANSWER_202 = { status: 202, message: 'Kiem tra hop thu cua ban.' };\nconst ANSWER_400 = { status: 400, message: 'Dia chi khong hop le.' };\n\n// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n\nfunction normalizeEmail(raw) {\n  // TODO\n}\n\nfunction register(rawEmail) {\n  // TODO\n}\n\nfunction issueVerifyToken(userId) {\n  // TODO\n}\n\nfunction verifyGet(token) {\n  // TODO\n}\n\nfunction verifyPost(token) {\n  // TODO\n}\n\nfunction resend(rawEmail) {\n  // TODO\n}\n\n// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\nconst P = (label, v) => console.log(String(label).padEnd(42) + v);\nconst mailSince = (i) => MAILBOX.slice(i).map((m) => m.kind).join(', ') || '(none)';\n\nconsole.log('== normalisation ==');\nfor (const e of ['  Nguyen.Van.A@Gmail.COM  ', 'cuong+github@fastmail.com',\n                 'cuong.thai@fastmail.com', 'CUONG@CUONGTHAI.COM',\n                 'a@b', 'no-at-sign', 'two @ signs@x.com', '']) {\n  P(JSON.stringify(e), JSON.stringify(normalizeEmail(e)));\n}\n\nconsole.log('== registration answers the same either way ==');\nlet m = MAILBOX.length;\nP('first time', JSON.stringify(register('An@Vidu.com')) + '  mail: ' + mailSince(m));\nm = MAILBOX.length;\nP('same address, different case', JSON.stringify(register('  AN@vidu.COM ')) + '  mail: ' + mailSince(m));\nm = MAILBOX.length;\nP('invalid address', JSON.stringify(register('khong-co-a-cong')) + '  mail: ' + mailSince(m));\nP('rows in the user table', USERS.size);\nP('stored display form', USERS.get('an@vidu.com').email);\n\nconsole.log('== plus and dot are NOT aliases ==');\nregister('cuong+github@fastmail.com');\nregister('cuong.thai@fastmail.com');\nregister('cuongthai@fastmail.com');\nP('separate accounts', USERS.size);\n\nconsole.log('== the scanner clicks first ==');\nconst token = issueVerifyToken('u_1');\nP('scanner GET', verifyGet(token));\nP('user still unverified', USERS.get('an@vidu.com').emailVerifiedAt === null);\nP('human POST', verifyPost(token));\nP('verified now', USERS.get('an@vidu.com').emailVerifiedAt === NOW);\nP('same link POSTed again', verifyPost(token));\nP('rows left in the token table', VERIFY.size);\n\nconsole.log('== one live token per user ==');\nconst t1 = issueVerifyToken('u_2');\nconst t2 = issueVerifyToken('u_2');\nP('the older link', verifyGet(t1));\nP('the newer link', verifyGet(t2));\n\nconsole.log('== expiry ==');\nNOW += DAY + 1;\nP('after 24h and one millisecond', verifyGet(t2));\n\nconsole.log('== resend leaks nothing ==');\nm = MAILBOX.length;\nP('address with no account', JSON.stringify(resend('nguoi-la@vidu.com')) + '  mail: ' + mailSince(m));\nm = MAILBOX.length;\nP('address already verified', JSON.stringify(resend('an@vidu.com')) + '  mail: ' + mailSince(m));\nm = MAILBOX.length;\nP('address awaiting verification', JSON.stringify(resend('cuong.thai@fastmail.com')) + '  mail: ' + mailSince(m));\n\nconsole.log('== nothing readable in the token table ==');\nP('any raw token stored', [...VERIFY.keys()].some((k) => k.startsWith('vt_')));\n",
          expectedOutput: "== normalisation ==\n\"  Nguyen.Van.A@Gmail.COM  \"              \"nguyen.van.a@gmail.com\"\n\"cuong+github@fastmail.com\"               \"cuong+github@fastmail.com\"\n\"cuong.thai@fastmail.com\"                 \"cuong.thai@fastmail.com\"\n\"CUONG@CUONGTHAI.COM\"                     \"cuong@cuongthai.com\"\n\"a@b\"                                     null\n\"no-at-sign\"                              null\n\"two @ signs@x.com\"                       null\n\"\"                                        null\n== registration answers the same either way ==\nfirst time                                {\"status\":202,\"message\":\"Kiem tra hop thu cua ban.\"}  mail: verify-your-address\nsame address, different case              {\"status\":202,\"message\":\"Kiem tra hop thu cua ban.\"}  mail: account-already-exists\ninvalid address                           {\"status\":400,\"message\":\"Dia chi khong hop le.\"}  mail: (none)\nrows in the user table                    1\nstored display form                       An@Vidu.com\n== plus and dot are NOT aliases ==\nseparate accounts                         4\n== the scanner clicks first ==\nscanner GET                               form\nuser still unverified                     true\nhuman POST                                ok\nverified now                              true\nsame link POSTed again                    invalid\nrows left in the token table              3\n== one live token per user ==\nthe older link                            invalid\nthe newer link                            form\n== expiry ==\nafter 24h and one millisecond             invalid\n== resend leaks nothing ==\naddress with no account                   {\"status\":202,\"message\":\"Kiem tra hop thu cua ban.\"}  mail: (none)\naddress already verified                  {\"status\":202,\"message\":\"Kiem tra hop thu cua ban.\"}  mail: (none)\naddress awaiting verification             {\"status\":202,\"message\":\"Kiem tra hop thu cua ban.\"}  mail: verify-your-address\n== nothing readable in the token table ==\nany raw token stored                      false",
          sampleSolution: "function normalizeEmail(raw) {\n  if (typeof raw !== 'string') return null;\n  const t = raw.trim();\n  const i = t.lastIndexOf('@');\n  if (i <= 0 || i === t.length - 1) return null;\n  if (/\\s/.test(t) || t.length > 254) return null;\n  const domain = t.slice(i + 1);\n  if (!domain.includes('.') || domain.includes('@')) return null;\n  return (t.slice(0, i) + '@' + domain.toLowerCase()).normalize('NFKC').toLowerCase();\n}\n\nfunction register(rawEmail) {\n  const key = normalizeEmail(rawEmail);\n  if (key === null) return ANSWER_400;\n\n  if (USERS.has(key)) {\n    send(key, 'account-already-exists');\n    return ANSWER_202;\n  }\n  const u = {\n    id: 'u_' + (++nextUserId),\n    email: String(rawEmail).trim(),\n    normalizedEmail: key,\n    emailVerifiedAt: null,\n  };\n  USERS.set(key, u);\n  issueVerifyToken(u.id);\n  send(key, 'verify-your-address');\n  return ANSWER_202;\n}\n\nfunction issueVerifyToken(userId) {\n  for (const [h, row] of VERIFY) if (row.userId === userId) VERIFY.delete(h);\n  const token = nextToken();\n  VERIFY.set(sha256(token), { userId, expiresAt: NOW + DAY });\n  return token;\n}\n\nfunction findLiveToken(token) {\n  if (typeof token !== 'string' || token === '') return null;\n  const row = VERIFY.get(sha256(token));\n  if (!row) return null;\n  if (NOW >= row.expiresAt) return null;\n  return row;\n}\n\nfunction verifyGet(token) {\n  return findLiveToken(token) ? 'form' : 'invalid';\n}\n\nfunction verifyPost(token) {\n  const row = findLiveToken(token);\n  if (!row) return 'invalid';\n  for (const u of USERS.values()) {\n    if (u.id === row.userId) { u.emailVerifiedAt = NOW; break; }\n  }\n  VERIFY.delete(sha256(token));\n  return 'ok';\n}\n\nfunction resend(rawEmail) {\n  const key = normalizeEmail(rawEmail);\n  if (key === null) return ANSWER_400;\n  const u = USERS.get(key);\n  if (u && u.emailVerifiedAt === null) {\n    issueVerifyToken(u.id);\n    send(key, 'verify-your-address');\n  }\n  return ANSWER_202;\n}\n",
        }),
      ],
    },
  ],
};
