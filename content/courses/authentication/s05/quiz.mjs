/**
 * Authentication · Chương 5 · Quiz (10 câu tình huống trên LabFlow ID v0.5, số đo của chương). Slug giữ: auth-5-6-quiz.
 * Đáp án rải: A ×3 (câu 1, 3, 8) · B ×2 (câu 6, 10) · C ×2 (câu 4, 7) · D ×3 (câu 2, 5, 9).
 */
export default {
  title: '5.6 — Quiz: refresh, rotation and revocation|||5.6 — Quiz: refresh, xoay vòng và thu hồi',
  slug: 'auth-5-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống trên LabFlow ID v0.5 về Chương 5: hai token, nơi cất refresh, xoay vòng + phát hiện tái dùng (thu hồi họ), vì sao đăng xuất cả người thật, năm sự kiện kết thúc phiên, đổi mật khẩu thu hồi mọi họ, danh sách thiết bị + IDOR, cuộc đua refresh và cửa sổ ân hạn, cửa sổ access token — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Check</span>
<h2>Chapter 5 check</h2>
<p class="lead">Ten scenarios from LabFlow ID v0.5, with the numbers you measured in this chapter. Every explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say what each of the two tokens is for and where it is stored.</li>
<li>I can rotate a refresh token and revoke the family on reuse.</li>
<li>I can list the five events that end a session.</li>
<li>I can build a devices page and revoke one device, scoped to its owner.</li>
<li>I can tolerate the refresh race without logging the real user out.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Kiểm tra Chương 5</h2>
<p class="lead">Mười tình huống từ LabFlow ID v0.5, dùng đúng những con số bạn đã đo trong chương. Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được việc của mỗi token trong hai cái và nơi cất nó.</li>
<li>Tôi xoay được một refresh token và thu hồi họ khi tái dùng.</li>
<li>Tôi liệt kê được năm sự kiện kết thúc một phiên.</li>
<li>Tôi dựng được một trang thiết bị và thu hồi một thiết bị, giới hạn theo chủ.</li>
<li>Tôi chịu được cuộc đua refresh mà không đăng xuất người thật.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'LabFlow ID issues a 15-minute access token and a 30-day refresh token. Why not just one 30-day JWT?|||LabFlow ID phát một access token 15 phút và một refresh token 30 ngày. Vì sao không chỉ một JWT 30 ngày?',
        options: [
          'A 30-day JWT cannot be revoked (lesson 4.3), so a stolen one works for 30 days; a short access token plus a revocable refresh token fixes both ends|||Một JWT 30 ngày không thu hồi được (bài 4.3), nên một cái bị trộm chạy 30 ngày; một access token ngắn cộng một refresh token thu hồi được sửa cả hai đầu',
          'A 30-day JWT is too large to send on every request|||Một JWT 30 ngày quá lớn để gửi mỗi request',
          'JWTs expire the moment the browser closes|||JWT hết hạn ngay khi trình duyệt đóng',
          'A refresh token is faster to verify than a JWT|||Một refresh token kiểm nhanh hơn một JWT',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The access token stays short so a stolen one dies fast and needs no DB lookup; the refresh token is long but revocable, so a login survives without a 30-day un-revocable JWT (5.1). VI: Access token giữ ngắn để một cái bị trộm chết nhanh và không cần tra DB; refresh token dài nhưng thu hồi được, nên một lần đăng nhập sống mà không cần một JWT 30 ngày không-thu-hồi (5.1).',
      },
      {
        question: 'Where should the refresh token be kept in the browser?|||Refresh token nên được cất ở đâu trong trình duyệt?',
        options: [
          'In localStorage, so the SPA can attach it|||Trong localStorage, để SPA gắn nó',
          'In the URL, so it survives a refresh of the page|||Trong URL, để nó sống qua một lần tải lại trang',
          'In a readable cookie, so the client can inspect it|||Trong một cookie đọc được, để client xem nó',
          'In an HttpOnly cookie scoped to the refresh route — it is the long-lived token and must be the hardest to steal|||Trong một cookie HttpOnly giới hạn ở tuyến refresh — nó là token dài hạn và phải là cái khó trộm nhất',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: The refresh token lives 30 days, so an XSS that reads it is far worse than one that reads a 15-minute access token. HttpOnly keeps it off the JavaScript table (4.5, 5.1). VI: Refresh token sống 30 ngày, nên một XSS đọc được nó tệ hơn nhiều một cái đọc access token 15 phút. HttpOnly gạt nó khỏi bàn của JavaScript (4.5, 5.1).',
      },
      {
        question: 'An’s refresh family is r0 → r1 → r2 (r2 is live). A thief replays r0 long after it was rotated. What happens?|||Họ refresh của An là r0 → r1 → r2 (r2 sống). Một kẻ cắp phát lại r0 lâu sau khi nó bị xoay. Chuyện gì xảy ra?',
        options: [
          'The whole family is revoked (REUSE_DETECTED) — including the live r2, so An is signed out too|||Cả họ bị thu hồi (REUSE_DETECTED) — kể cả r2 sống, nên An cũng bị đăng xuất',
          'Only r0 is rejected; r2 keeps working|||Chỉ r0 bị từ chối; r2 vẫn chạy',
          'The thief gets a new token and r2 is revoked|||Kẻ cắp nhận một token mới và r2 bị thu hồi',
          'Nothing — r0 was already rotated, so replaying it is harmless|||Không gì — r0 đã bị xoay, nên phát lại nó vô hại',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: A rotated token coming back means a copy exists; you cannot tell the user’s from the thief’s, so you revoke the whole family — the live r2 included (5.2). An re-authenticates; the thief cannot. VI: Một token đã xoay quay lại nghĩa là có một bản; không phân biệt được bản của người dùng với kẻ cắp, nên thu hồi cả họ — kể cả r2 sống (5.2). An xác thực lại; kẻ cắp không.',
      },
      {
        question: 'Why revoke the whole family on reuse, instead of just rejecting the replayed token?|||Vì sao thu hồi cả họ khi tái dùng, thay vì chỉ từ chối token bị phát lại?',
        options: [
          'Because the database cannot reject a single token|||Vì cơ sở dữ liệu không từ chối được một token riêng',
          'Because the family id is easier to index than a token id|||Vì family id dễ đánh chỉ mục hơn một token id',
          'Because a reuse means two copies of a token exist and you cannot tell which is the thief; ending the family forces both to re-authenticate|||Vì một lần tái dùng nghĩa là có hai bản của một token và bạn không biết cái nào là kẻ cắp; kết thúc họ buộc cả hai xác thực lại',
          'Because the access token is still valid for 15 minutes|||Vì access token vẫn hợp lệ 15 phút',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: If you only reject the replayed one, the other copy — which might be the thief’s live token — keeps working. Revoking the family is the only response that is safe whichever copy is the attacker (5.2). VI: Nếu chỉ từ chối cái bị phát lại, bản kia — có thể là token sống của kẻ cắp — vẫn chạy. Thu hồi họ là phản ứng duy nhất an toàn bất kể bản nào là kẻ tấn công (5.2).',
      },
      {
        question: 'In demo5/five-events.mjs, four events end with REVOKED and one with EXPIRED. Which event gives EXPIRED, and why is that not a bug?|||Trong demo5/five-events.mjs, bốn sự kiện kết thúc bằng REVOKED và một bằng EXPIRED. Sự kiện nào cho EXPIRED, và vì sao đó không phải lỗi?',
        options: [
          'Sign-out — clearing the cookie makes the token expire|||Đăng xuất — xoá cookie làm token hết hạn',
          'Reuse detection — a stolen token is marked expired|||Phát hiện tái dùng — một token bị trộm bị đánh dấu hết hạn',
          'Device-page revoke — revoking expires the token|||Thu hồi từ trang thiết bị — thu hồi làm token hết hạn',
          'Absolute expiry — no one revoked anything; the family’s 30 days simply passed, so EXPIRED is correct|||Hết hạn tuyệt đối — không ai thu hồi gì; 30 ngày của họ đơn giản trôi qua, nên EXPIRED là đúng',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Four events actively revoke the family (REVOKED); expiry is passive — the row’s expires_at passed with no action, so EXPIRED is the right, different code (5.3). VI: Bốn sự kiện chủ động thu hồi họ (REVOKED); hết hạn là thụ động — expires_at của dòng qua mà không có hành động, nên EXPIRED là mã đúng, khác (5.3).',
      },
      {
        question: 'An changes her password on her laptop. What happens to her phone, which was signed in?|||An đổi mật khẩu trên laptop. Điện thoại của cô, vốn đã đăng nhập, ra sao?',
        options: [
          'The phone keeps working — a password change only affects the device that made it|||Điện thoại vẫn chạy — đổi mật khẩu chỉ ảnh hưởng thiết bị thực hiện nó',
          'The phone’s next refresh returns REVOKED — a password change revokes every family of the user|||Lần refresh kế của điện thoại trả về REVOKED — đổi mật khẩu thu hồi mọi họ của người đó',
          'The phone must enter the new password to keep its session|||Điện thoại phải nhập mật khẩu mới để giữ phiên',
          'Only the access token on the phone is revoked; the refresh token survives|||Chỉ access token trên điện thoại bị thu hồi; refresh token sống sót',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A credential change must end sessions everywhere, or a leaked password leaves old sessions alive. /me/password calls revokeAll, so every family but the fresh one on the laptop is revoked (5.3). VI: Đổi thông tin xác thực phải kết thúc phiên mọi nơi, không thì một mật khẩu bị lộ để các phiên cũ sống. /me/password gọi revokeAll, nên mọi họ trừ cái mới trên laptop bị thu hồi (5.3).',
      },
      {
        question: 'On the devices page, An revokes a family id that is not hers (she guesses one). What does the server do?|||Trên trang thiết bị, An thu hồi một family id không phải của cô (cô đoán một cái). Máy chủ làm gì?',
        options: [
          'Revokes that family — any signed-in user can revoke any family|||Thu hồi họ đó — người dùng đã đăng nhập nào cũng thu hồi được họ nào',
          'Returns an error that leaks whether the family exists|||Trả một lỗi rò rằng họ có tồn tại không',
          'Revokes nothing (revoked: 0) — the revoke is scoped to her user id, so a family that is not hers matches nothing|||Không thu hồi gì (revoked: 0) — lệnh thu hồi giới hạn theo user id của cô, nên một họ không phải của cô khớp không gì',
          'Signs An out for attempting an unauthorized action|||Đăng xuất An vì cố một hành động trái phép',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: revokeFamilyForUser(userId, familyId) only touches families belonging to the caller, so a guessed id does nothing — the IDOR/BOLA defence from Mục 0 on a device id (5.4). VI: revokeFamilyForUser(userId, familyId) chỉ đụng các họ thuộc về người gọi, nên một id đoán chẳng làm gì — phòng IDOR/BOLA từ Mục 0 trên một device id (5.4).',
      },
      {
        question: 'Two tabs of An’s browser both refresh with the same cookie at once. With LabFlow ID’s 10-second grace window, what happens?|||Hai tab trình duyệt của An cùng refresh với một cookie một lúc. Với cửa sổ ân hạn 10 giây của LabFlow ID, chuyện gì xảy ra?',
        options: [
          'Both tabs get the same new token (the second is served from the grace window), so both stay signed in|||Cả hai tab nhận cùng một token mới (cái thứ hai được phục vụ từ cửa sổ ân hạn), nên cả hai vẫn đăng nhập',
          'The second tab triggers REUSE_DETECTED and An is logged out|||Tab thứ hai kích hoạt REUSE_DETECTED và An bị đăng xuất',
          'Both tabs get different tokens and the family is revoked|||Cả hai tab nhận token khác nhau và họ bị thu hồi',
          'The second request is queued until the first token expires|||Request thứ hai bị xếp hàng tới khi token đầu hết hạn',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Within the grace window, a second use of the just-rotated token returns the first request’s new child instead of flagging reuse — so a legitimate race is not mistaken for theft (5.5). VI: Trong cửa sổ ân hạn, một lần dùng thứ hai của token vừa xoay trả về cái con của request đầu thay vì báo tái dùng — nên một cuộc đua hợp lệ không bị nhầm là trộm (5.5).',
      },
      {
        question: 'A teammate suggests making the grace window 10 minutes “to be safe” against races. Why is that dangerous?|||Một đồng đội đề xuất làm cửa sổ ân hạn 10 phút "cho chắc" trước các cuộc đua. Vì sao nguy hiểm?',
        options: [
          'It makes refresh too slow|||Nó làm refresh quá chậm',
          'It breaks the devices page|||Nó làm hỏng trang thiết bị',
          'It uses too much memory|||Nó tốn quá nhiều bộ nhớ',
          'It becomes a 10-minute window in which a stolen, already-rotated token still works — re-opening the hole reuse detection closed|||Nó thành một cửa sổ 10 phút mà một token bị trộm, đã xoay, vẫn chạy — mở lại cái lỗ mà phát hiện tái dùng đã đóng',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: A real browser race is over in milliseconds; a long grace window only helps an attacker whose replay now falls inside it. Keep it to seconds (5.5). VI: Một cuộc đua trình duyệt thật xong trong mili giây; một cửa sổ ân hạn dài chỉ giúp một kẻ tấn công mà cú phát lại giờ rơi vào trong nó. Giữ nó vài giây (5.5).',
      },
      {
        question: 'An clicks “sign out”. Ten seconds later, an API call made with her still-unexpired access token succeeds. Is this a bug?|||An bấm "đăng xuất". Mười giây sau, một lời gọi API bằng access token chưa hết hạn của cô thành công. Đây có phải lỗi không?',
        options: [
          'Yes — sign-out must block the access token immediately|||Có — đăng xuất phải chặn access token ngay',
          'No — the access token is stateless and works until it expires (≤ 15 min); only the refresh token is revoked instantly. Shorten the access token to shrink the window|||Không — access token là không trạng thái và chạy tới khi hết hạn (≤ 15 phút); chỉ refresh token bị thu hồi tức thì. Rút ngắn access token để thu cửa sổ',
          'Yes — the family was revoked, so no token should work|||Có — họ đã bị thu hồi, nên không token nào được chạy',
          'No — the API call was cached from before sign-out|||Không — lời gọi API được cache từ trước khi đăng xuất',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Revoking the refresh family stops NEW access tokens; an access token already out there is verified by signature with no lookup, so it lingers up to 15 minutes — the price of a stateless token (4.3, 5.3). VI: Thu hồi họ refresh ngừng access token MỚI; một access token đã ở ngoài kia được kiểm bằng chữ ký không tra, nên nó nán tới 15 phút — cái giá của một token không trạng thái (4.3, 5.3).',
      },
    ],
  },
};
