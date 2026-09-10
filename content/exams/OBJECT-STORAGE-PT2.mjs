/**
 * Object Storage — Progress Test 2 (Chương 4 → Chương 7).
 *
 * Đề tự soạn, bám sát `content/courses/object-storage/s04-presign.mjs` …
 * `s07-cost.mjs`. 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi.
 *
 * ⚠️ Mọi transcript về presigned URL và lifecycle trong đề này đều LẤY TỪ MỘT
 * MÁY CHỦ S3-COMPATIBLE SỐNG, dựng riêng cho đề bằng Docker:
 *
 *   MinIO           RELEASE.2025-09-07T16-13-09Z (go1.24.6, linux/arm64)
 *   @aws-sdk/client-s3            3.1071.0
 *   @aws-sdk/s3-request-presigner 3.1071.0
 *   Node v22.21.0, darwin-arm64, Docker Engine 29.5.3
 *   docker run -d --name ospt-minio -p 59300:9000 minio/minio server /data
 *
 * ⛔ KHÔNG chạm tới bucket R2 thật của dự án — không đọc `.env`, không dùng khoá
 * thật, không gọi một byte nào tới Cloudflare. Container nháp đã `docker rm -f`
 * sau khi đo xong.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️ HAI CHỖ MÁY KHÁC GIÁO TRÌNH — ĐỀ THEO MÁY
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  • Bài 6.2 viết "Do not run `Expiration.Days: 0` — Zero means delete
 *    immediately", tức là coi 0 như một giá trị hợp lệ nhưng nguy hiểm. Đo
 *    thật: máy chủ TỪ CHỐI thẳng, `400 InvalidArgument "Days must be positive
 *    integer when used with Expiration"`. Tài liệu AWS cũng đòi số nguyên
 *    dương. Nên cái bẫy thật KHÔNG phải "rule 0 ngày xoá sạch bucket của bạn"
 *    mà là "rule 0 ngày không bao giờ được nạp lên, và nếu bạn không đọc mã
 *    trả về thì bucket đang chạy KHÔNG có rule nào". Câu 15 hỏi theo máy.
 *
 *  • Bài 9.1 dựng cây chẩn đoán 403 với sáu nhánh, và mọi nhánh đều là 403.
 *    Đo thật một presigned PUT URL đem dùng bằng phương thức GET: máy chủ trả
 *    **400**, kèm `<Code>AccessDenied</Code>` và câu
 *    "There were headers present in the request which were not signed" — một
 *    mã 400 mang mã lỗi của nhánh 403, thứ cây chẩn đoán không có ô để đặt
 *    vào. Câu 2 hỏi đúng transcript ấy.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️ NHỮNG CHỖ CHỈ DỰA VÀO TÀI LIỆU, CHƯA ĐO ĐƯỢC
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  • TOÀN BỘ hành vi CHÍNH SÁCH CORS (câu 7–14). MinIO không cài đặt CORS theo
 *    bucket, và đo lại lần này cho con số cụ thể hơn ghi chú của đề FE:
 *    `PutBucketCors` trả **501 NotImplemented**, còn `GetBucketCors` trả
 *    **404 NoSuchCORSConfiguration** (đề FE ghi 501 cho cả hai). Quan trọng
 *    hơn: preflight của nó VỌNG LẠI mọi thứ được hỏi —
 *      OPTIONS, Origin: https://ke-tan-cong.example, Request-Method: DELETE
 *        -> 204, Allow-Origin: https://ke-tan-cong.example,
 *           Allow-Methods: DELETE, Allow-Headers: content-type,x-la-hoac,
 *           Allow-Credentials: true, KHÔNG có Max-Age, KHÔNG có Expose-Headers
 *    Một máy chủ vọng lại mọi thứ thì không phân biệt được chính sách đúng với
 *    KHÔNG CÓ chính sách nào. Nên tám câu CORS của đề này hỏi CƠ CHẾ của
 *    trình duyệt và của giao thức (theo MDN + giáo trình), tuyệt đối không
 *    trình bày một con số CORS nào như thể đã đo trên R2.
 *  • Trần MaxAgeSeconds theo từng trình duyệt (Chrome 7200, Firefox 86400,
 *    Safari 600 — câu 10): theo tài liệu MDN và giáo trình. `curl` không có
 *    bộ nhớ đệm preflight nên không có cách nào đo từ dòng lệnh.
 *  • Nhịp quét lifecycle của R2 (khoảng một ngày một lần): theo tài liệu.
 *  • MỌI con số giá (câu 8, 23–30 và câu 32): bảng giá công bố trong bài 7.1.
 *    Đề chỉ bắt làm SỐ HỌC trên chính bảng giá đề đưa ra.
 *  • Chi phí và giới hạn của việc tải lên trực tiếp (câu 4, 6): trần 100 MB
 *    của proxy Cloudflare là theo tài liệu Cloudflare, không đo được ở đây.
 *  • Đã biết từ trước và KHÔNG hỏi lại: MinIO từ chối một lifecycle rule chỉ
 *    có `AbortIncompleteMultipartUpload` (`400 InvalidArgument`) trong khi tài
 *    liệu AWS/Cloudflare nói dạng ấy hợp lệ. Đề chỉ hỏi CƠ CHẾ của rule abort
 *    (câu 18), không hỏi khối JSON nào được máy chủ nào chấp nhận.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Phân bố câu theo chương:
 *   Chương 4 — bảo mật presigned upload     6 câu   (q1–q6)
 *   Chương 5 — CORS cho browser upload      8 câu   (q7–q14)
 *   Chương 6 — lifecycle và cleanup         8 câu   (q15–q22)
 *   Chương 7 — quản lý chi phí              8 câu   (q23–q30)
 *                                          ─────
 *                                          30 câu trắc nghiệm + 2 câu lập trình
 *
 * Phân bố vị trí đáp án — A 8 · B 8 · C 8 · D 8, tổng 32 ô chứ không phải 30:
 * câu 14 và câu 30 là câu "chọn HAI" nên mỗi câu góp hai ô. Đếm lại bằng:
 *   node -e "import('./content/exams/OBJECT-STORAGE-PT2.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Hai câu lập trình chạy được bằng Node thuần, không cần mạng, không cần
 * `node_modules`, và `scripts/exam-check.mjs` chạy thật cả hai `sampleSolution`
 * rồi so từng byte với `expectedOutput`.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/OBJECT-STORAGE-PT2.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/objectstorage-exam-kit.mjs';

export default {
  course: { slug: 'object-storage' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 4 to 7 (presigned uploads, CORS, lifecycle, cost)',
        'Kiểm tra tiến độ 2 — Chương 4 đến 7 (presigned upload, CORS, lifecycle, chi phí)',
      ),
      description: B(
        'The middle third of the Object Storage course: what a signature actually binds on a browser upload, why the browser blocks the request before it is sent, what a lifecycle rule can and cannot see, and which of the five line items is really driving the bill. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba giữa của khoá Object Storage: một chữ ký thật sự ràng buộc cái gì khi tải lên từ trình duyệt, vì sao trình duyệt chặn request trước cả khi gửi, một lifecycle rule nhìn thấy và không nhìn thấy cái gì, và trong năm dòng của hoá đơn thì dòng nào mới đang đẩy chi phí. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '4–7'),
      questions: [
        // ── Chương 4 — bảo mật presigned upload ─────────────────────────
        mcq({
          prompt: B(
            'One presigned PUT URL, signed with <code>signableHeaders: new Set([&quot;host&quot;, &quot;content-type&quot;])</code> for <code>image/jpeg</code>, used four ways. Measured:' + code(
              'PUT, Content-Type: image/jpeg                    -> 200, ETag returned\n' +
              'PUT, Content-Type: text/html                     -> 403 SignatureDoesNotMatch\n' +
              'PUT, no Content-Type header at all               -> 403 SignatureDoesNotMatch\n' +
              'PUT, Content-Type: image/jpeg + x-request-id: ab -> 200',
            ) + 'What rule explains all four lines at once?',
            'Một presigned PUT URL, ký với <code>signableHeaders: new Set([&quot;host&quot;, &quot;content-type&quot;])</code> cho <code>image/jpeg</code>, đem dùng bốn kiểu. Đo thật:' + code(
              'PUT, Content-Type: image/jpeg                    -> 200, co ETag tra ve\n' +
              'PUT, Content-Type: text/html                     -> 403 SignatureDoesNotMatch\n' +
              'PUT, khong gui header Content-Type nao ca        -> 403 SignatureDoesNotMatch\n' +
              'PUT, Content-Type: image/jpeg + x-request-id: ab -> 200',
            ) + 'Quy tắc nào giải thích được cả bốn dòng cùng lúc?',
          ),
          options: [
            B('The server keeps a whitelist of headers a presigned request may carry, so unknown ones like <code>x-request-id</code> are stripped before the signature is recomputed', 'Máy chủ giữ một danh sách trắng các header mà một request đã ký được phép mang, nên những cái lạ như <code>x-request-id</code> bị gỡ đi trước khi chữ ký được tính lại'),
            B('The signature is recomputed from exactly the headers named in <code>X-Amz-SignedHeaders</code>: each one must be present and byte-identical, and any header NOT on that list is free to add, change or omit', 'Chữ ký được tính lại từ đúng những header có tên trong <code>X-Amz-SignedHeaders</code>: mỗi cái phải có mặt và giống nhau từng byte, còn header nào KHÔNG nằm trong danh sách ấy thì tuỳ ý thêm, đổi hay bỏ'),
            B('The signature covers every header the client sends, and line 4 passed only because <code>x-request-id</code> sorts after <code>host</code> in the canonical request', 'Chữ ký bao trùm mọi header mà client gửi, và dòng 4 lọt được chỉ vì <code>x-request-id</code> đứng sau <code>host</code> khi sắp xếp trong canonical request'),
            B('Only the value of Content-Type matters, not its presence — line 3 failed because an absent header defaults to <code>application/octet-stream</code>, which is a different string from the signed one', 'Chỉ giá trị của Content-Type mới quan trọng chứ không phải sự có mặt của nó — dòng 3 hỏng vì header vắng mặt sẽ mặc định thành <code>application/octet-stream</code>, một chuỗi khác với chuỗi đã ký'),
          ],
          correct: 1,
          explanation: EX(
            'All four lines were measured on the same URL. <code>X-Amz-SignedHeaders</code> is the contract, and it is exhaustive in both directions: a signed header is mandatory and exact (line 3 fails not because of a default value but because the header the server needs to hash is simply missing), while an unsigned header is outside the contract entirely (line 4). That second half is what people find surprising, and it is why Lesson 4.2 says to pin <code>content-length</code> as well if you want to bound the size — a limit you do not sign is a limit the uploader ignores.',
            'Cả bốn dòng đều đo trên cùng một URL. <code>X-Amz-SignedHeaders</code> chính là bản hợp đồng, và nó vét cạn theo cả hai chiều: một header đã ký thì bắt buộc phải có và phải đúng từng byte (dòng 3 hỏng không phải vì một giá trị mặc định nào mà vì cái header máy chủ cần đem đi băm đơn giản là không có), còn một header không ký thì nằm hoàn toàn ngoài hợp đồng (dòng 4). Nửa sau mới là chỗ người ta thấy bất ngờ, và đó là lý do bài 4.2 bảo hãy ký luôn <code>content-length</code> nếu bạn muốn chặn kích thước — một giới hạn bạn không ký là một giới hạn người tải lên bỏ qua.',
          ),
        }),

        mcq({
          prompt: B(
            'A frontend bug sends a presigned PUT URL through <code>fetch(url)</code> with no options, so the method defaults to GET. Measured:' + code(
              'HTTP 400\n' +
              '<Error>\n' +
              '  <Code>AccessDenied</Code>\n' +
              '  <Message>There were headers present in the request which were not signed</Message>\n' +
              '</Error>',
            ) + 'Two things about this response are worth naming. Which pair?',
            'Một lỗi frontend đem presigned PUT URL đi qua <code>fetch(url)</code> không kèm tuỳ chọn nào, nên phương thức mặc định thành GET. Đo thật:' + code(
              'HTTP 400\n' +
              '<Error>\n' +
              '  <Code>AccessDenied</Code>\n' +
              '  <Message>There were headers present in the request which were not signed</Message>\n' +
              '</Error>',
            ) + 'Có hai điều đáng gọi tên ở phản hồi này. Cặp nào?',
          ),
          options: [
            B('That a presigned URL works for any method, and that the 400 comes from the missing request body rather than from the method', 'Rằng một presigned URL dùng được với mọi phương thức, và cái 400 đến từ việc thiếu thân request chứ không phải từ phương thức'),
            B('That GET is always allowed on a bucket that permits PUT, and that the message is about the Origin header the browser added automatically', 'Rằng GET luôn được phép trên một bucket đã cho PUT, và câu thông báo nói về header Origin mà trình duyệt tự thêm vào'),
            B('That the HTTP method is part of the canonical request, so a PUT URL simply is not a GET URL; and that the status is 400 while the Code is AccessDenied, a combination the 403 flowchart has no slot for', 'Rằng phương thức HTTP nằm trong canonical request, nên một URL để PUT đơn giản không phải một URL để GET; và rằng mã trạng thái là 400 trong khi Code lại là AccessDenied, một tổ hợp mà cây chẩn đoán 403 không có ô để đặt vào'),
            B('That the signature expired between issuing and use, and that AccessDenied is the standard code for expiry on every S3-compatible service', 'Rằng chữ ký đã hết hạn giữa lúc cấp và lúc dùng, và rằng AccessDenied là mã tiêu chuẩn cho việc hết hạn trên mọi dịch vụ S3-compatible'),
          ],
          correct: 2,
          explanation: EX(
            'Measured, and it is the reason Lesson 9.1 tells you to read the BODY rather than the status line. The method is the first line of the canonical request, so changing it invalidates the signature as surely as changing the key does — a presigned URL grants one method on one path. The status code is the second lesson: a 400 here, not a 403, and the <code>Code</code> field still says <code>AccessDenied</code>. Any triage that branches on <code>status === 403</code> misses this case entirely, which is exactly how a one-line frontend bug turns into an afternoon of reading bucket policies.',
            'Đo thật, và đây chính là lý do bài 9.1 bảo bạn đọc phần THÂN chứ không đọc dòng trạng thái. Phương thức là dòng đầu tiên của canonical request, nên đổi nó là làm hỏng chữ ký chắc chắn y như đổi key — một presigned URL cấp một phương thức trên một đường dẫn. Mã trạng thái là bài học thứ hai: ở đây là 400 chứ không phải 403, mà trường <code>Code</code> vẫn ghi <code>AccessDenied</code>. Mọi lượt phân loại rẽ nhánh theo <code>status === 403</code> đều bỏ sót hẳn ca này, và đó đúng là cách một lỗi frontend một dòng biến thành một buổi chiều đọc bucket policy.',
          ),
        }),

        mcq({
          prompt: B(
            'The presign endpoint is hardened further. Beyond <code>host</code> and <code>content-type</code>, which addition to <code>signableHeaders</code> actually buys something, and what does it buy?',
            'Endpoint cấp presign được siết thêm. Ngoài <code>host</code> và <code>content-type</code>, thêm cái gì vào <code>signableHeaders</code> mới thật sự có tác dụng, và tác dụng ấy là gì?',
          ),
          options: [
            B('<code>user-agent</code> — it ties the URL to the browser that requested it, so a leaked link cannot be replayed from curl or from another device', '<code>user-agent</code> — nó buộc URL vào đúng trình duyệt đã xin nó, nên một link bị lộ không thể phát lại bằng curl hay từ máy khác'),
            B('<code>authorization</code> — it forces the uploader to present your application session as well as the signature, giving two independent checks on one request', '<code>authorization</code> — nó buộc người tải lên phải trình cả phiên đăng nhập của ứng dụng lẫn chữ ký, cho hai lớp kiểm độc lập trên cùng một request'),
            B('<code>content-length</code> — the size becomes part of the contract, so a URL signed for a 5 MB avatar cannot be used to push a 5 GB file into your bucket', '<code>content-length</code> — kích thước trở thành một phần của hợp đồng, nên một URL ký cho ảnh đại diện 5 MB không dùng được để nhét một file 5 GB vào bucket của bạn'),
            B('<code>x-amz-date</code> — signing it prevents an attacker from extending the expiry window by rewriting the timestamp in the query string', '<code>x-amz-date</code> — ký nó chặn kẻ tấn công nới cửa sổ hiệu lực bằng cách sửa lại mốc thời gian trong chuỗi truy vấn'),
          ],
          correct: 2,
          explanation: EX(
            'Lesson 4.2 lists exactly this set, and the reasoning is the same every time: whatever you want to constrain, you have to sign. Size is the second-most-useful constraint after type, because an unbounded presigned PUT is a free write endpoint for anyone who obtains one. The distractors fail for concrete reasons. <code>user-agent</code> is trivially forged and would break every legitimate retry from a different context. <code>authorization</code> is where the SigV4 signature itself lives on a header-signed request, so it is not yours to pin. And <code>x-amz-date</code> and <code>X-Amz-Expires</code> are already inside the signature as query parameters — measured on a live endpoint, rewriting <code>X-Amz-Expires=600</code> to <code>6000</code> yields <code>403 SignatureDoesNotMatch</code>.',
            'Bài 4.2 liệt kê đúng bộ này, và lý lẽ lần nào cũng vậy: muốn ràng buộc cái gì thì phải ký cái đó. Kích thước là ràng buộc hữu ích thứ hai sau kiểu file, vì một presigned PUT không chặn dung lượng là một endpoint ghi miễn phí cho bất cứ ai lấy được nó. Các phương án nhiễu hỏng vì những lý do rất cụ thể. <code>user-agent</code> giả mạo dễ như bỡn và sẽ làm hỏng mọi lượt thử lại hợp lệ từ một ngữ cảnh khác. <code>authorization</code> chính là chỗ chữ ký SigV4 nằm trong một request ký bằng header, nên nó không phải thứ của bạn để đem ký. Còn <code>x-amz-date</code> và <code>X-Amz-Expires</code> vốn đã nằm trong chữ ký dưới dạng tham số truy vấn — đo trên máy chủ sống, sửa <code>X-Amz-Expires=600</code> thành <code>6000</code> cho ra <code>403 SignatureDoesNotMatch</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'The direct-upload flow in Lesson 4.1 has four steps.' + code(
              '1. POST /api/v1/files/presign-r2   { filename, contentType }\n' +
              '2. backend -> { key, uploadUrl }\n' +
              '3. client PUTs the bytes straight to the bucket\n' +
              '4. POST /api/v1/files/complete     { key, size }',
            ) + 'Which check belongs on step 4, and why can it not be skipped?',
            'Luồng tải lên trực tiếp ở bài 4.1 có bốn bước.' + code(
              '1. POST /api/v1/files/presign-r2   { filename, contentType }\n' +
              '2. backend -> { key, uploadUrl }\n' +
              '3. client PUT thang so byte len bucket\n' +
              '4. POST /api/v1/files/complete     { key, size }',
            ) + 'Bước 4 phải kiểm cái gì, và vì sao không bỏ qua được?',
          ),
          options: [
            B('Nothing — the presigned URL already authorised the write, so step 4 is bookkeeping and the client-supplied size can be trusted as-is', 'Không cần kiểm gì — presigned URL đã cho phép lượt ghi rồi, nên bước 4 chỉ là ghi sổ và con số kích thước do client gửi lên tin được luôn'),
            B('Re-download the object and re-encode it, because that is the only way to know the bytes are really an image and not a renamed executable', 'Tải object về rồi mã hoá lại, vì đó là cách duy nhất biết chắc số byte ấy thật sự là một tấm ảnh chứ không phải một file thực thi bị đổi tên'),
            B('That the key belongs to the caller and that the object really exists — a HeadObject gives the true size and content type, since step 3 happened without the backend seeing it', 'Rằng cái key ấy thuộc về chính người gọi và rằng object thật sự tồn tại — một lệnh HeadObject cho biết kích thước và content type thật, vì bước 3 đã diễn ra mà backend không nhìn thấy'),
            B('That the client waited for the CDN to warm, otherwise the row will point at a URL that returns 404 for the first few minutes', 'Rằng client đã chờ CDN nóng lên, không thì hàng dữ liệu sẽ trỏ vào một URL trả 404 trong vài phút đầu'),
          ],
          correct: 2,
          explanation: EX(
            'The whole design of direct upload is that your server never sees the bytes, and step 4 is where that becomes a problem: the client is reporting on work your server did not witness. Two facts have to come from the storage service rather than the request body. A <code>HeadObject</code> answers both — it returns the real <code>ContentLength</code> and <code>ContentType</code>, and its absence tells you the upload never landed, which stops a database row from pointing at nothing. The ownership check matters for a different reason: step 4 is an ordinary authenticated endpoint, and nothing stops a caller from posting somebody else\'s key unless you verify the key matches the prefix you minted for them in step 2.',
            'Toàn bộ thiết kế của tải lên trực tiếp là máy chủ của bạn không bao giờ nhìn thấy số byte, và bước 4 chính là chỗ điều đó thành vấn đề: client đang báo cáo về một công việc mà máy chủ của bạn không chứng kiến. Hai sự thật buộc phải đến từ dịch vụ lưu trữ chứ không từ thân request. Một lệnh <code>HeadObject</code> trả lời cả hai — nó cho <code>ContentLength</code> và <code>ContentType</code> thật, và việc nó không tìm thấy gì nói cho bạn biết lượt tải chưa hề tới nơi, nhờ đó chặn được một hàng dữ liệu trỏ vào hư không. Phép kiểm quyền sở hữu quan trọng vì một lý do khác: bước 4 là một endpoint có xác thực bình thường, và không có gì ngăn một người gọi gửi lên key của người khác trừ khi bạn đối chiếu key ấy với tiền tố bạn đã đúc cho họ ở bước 2.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 4.2 ends with a trap: "testing presigned upload only on the happy path". A regression test is added so the fix can never silently revert. What must it assert?',
            'Bài 4.2 kết bằng một cái bẫy: "chỉ kiểm presigned upload trên đường đi thuận lợi". Một phép kiểm hồi quy được thêm vào để bản vá không bao giờ âm thầm bị lật lại. Nó phải khẳng định điều gì?',
          ),
          options: [
            B('That a valid upload returns 200 and the object appears in the bucket, run on every content type the product supports', 'Rằng một lượt tải lên hợp lệ trả 200 và object xuất hiện trong bucket, chạy trên mọi content type mà sản phẩm hỗ trợ'),
            B('That the generated URL contains the string <code>content-type</code>, which is cheap, fast, and enough to prove the header was signed', 'Rằng URL sinh ra có chứa chuỗi <code>content-type</code>, cách này rẻ, nhanh, và đủ để chứng minh header ấy đã được ký'),
            B('That the presign endpoint rejects a request whose declared content type is not on the product\'s allow list, before any URL is issued at all', 'Rằng endpoint cấp presign từ chối một request khai content type không nằm trong danh sách cho phép của sản phẩm, trước khi có URL nào được cấp'),
            B('That a PUT of <code>text/html</code> to a URL signed for <code>image/jpeg</code> comes back 403 — the negative case, because the vulnerable version passes every positive test', 'Rằng một lượt PUT <code>text/html</code> lên một URL ký cho <code>image/jpeg</code> trả về 403 — ca phủ định, vì bản có lỗ hổng vượt qua mọi phép kiểm khẳng định'),
          ],
          correct: 3,
          explanation: EX(
            'This is the property that makes the bug survive review: the vulnerable code and the fixed code behave identically on every correct upload. Only the wrong content type separates them — measured, <code>host</code>-only signing returns 200 and stores <code>content-type: text/html</code>, while the pinned version returns 403. So the assertion has to be the negative one. Option C is a good idea and a different control: it stops your own endpoint from minting a URL for a dangerous type, but it does nothing about an attacker who asks for <code>image/jpeg</code> and then uploads HTML, which is the attack. Option B is the weakest of all — it tests the string, not the behaviour, and a change that signs the header under a different name still passes.',
            'Đây chính là tính chất làm cho lỗi này sống sót qua review: mã có lỗ hổng và mã đã vá hành xử y hệt nhau trên mọi lượt tải lên đúng đắn. Chỉ có content type sai mới tách được hai bản — đo thật, ký chỉ với <code>host</code> trả 200 và lưu <code>content-type: text/html</code>, còn bản có ghim trả 403. Nên lời khẳng định buộc phải là ca phủ định. Lựa chọn C là một ý hay và là một biện pháp khác: nó chặn chính endpoint của bạn đúc ra URL cho một kiểu file nguy hiểm, nhưng nó chẳng làm gì được kẻ tấn công xin <code>image/jpeg</code> rồi tải HTML lên — mà đó mới là đòn tấn công. Lựa chọn B yếu nhất — nó kiểm cái chuỗi chứ không kiểm hành vi, và một thay đổi ký header ấy dưới một cái tên khác vẫn qua được.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 4.1 lists three costs of moving to direct browser upload. Which one is a real, permanent trade rather than a one-off implementation task?',
            'Bài 4.1 liệt kê ba cái giá phải trả khi chuyển sang tải lên trực tiếp từ trình duyệt. Cái nào là đánh đổi thật và lâu dài, chứ không phải một việc cài đặt làm một lần là xong?',
          ),
          options: [
            B('Retry moves to the client: a network drop mid-PUT is now the browser\'s problem, because your server is no longer in the data path and the SDK is not there to retry', 'Việc thử lại chuyển sang phía client: mạng đứt giữa chừng một lượt PUT giờ là việc của trình duyệt, vì máy chủ của bạn không còn nằm trên đường đi của dữ liệu và cũng không có SDK ở đó để thử lại'),
            B('Bandwidth cost rises, because the bytes now travel from the browser to the bucket instead of over your server\'s cheaper internal link', 'Chi phí băng thông tăng, vì số byte giờ đi từ trình duyệt tới bucket thay vì đi qua đường nội bộ rẻ hơn của máy chủ bạn'),
            B('The bucket has to be made public, since a browser cannot authenticate to it the way a backend can', 'Bucket phải được mở công khai, vì một trình duyệt không xác thực được với nó theo cách một backend làm được'),
            B('Uploads become slower, because the presign round trip adds a full request before the file can start moving', 'Tải lên chậm đi, vì lượt gọi xin presign thêm một request đầy đủ trước khi file bắt đầu chuyển động'),
          ],
          correct: 0,
          explanation: EX(
            'The lesson\'s own list is: client code gets more complex, security gets subtler, and retry gets harder — and the third is the one that never goes away. A raw <code>fetch</code> PUT of 500 MB that dies at 400 MB starts again from zero, and the answer is multipart, which is resumable by construction. The distractors invert the actual facts. Direct upload REMOVES a hop rather than adding bandwidth cost, the bucket stays private (the signature is the authentication), and the presign round trip is a few tens of milliseconds against an upload measured in minutes.',
            'Danh sách của chính bài học là: mã client phức tạp hơn, bảo mật tinh vi hơn, và thử lại khó hơn — cái thứ ba mới là cái không bao giờ mất đi. Một lệnh <code>fetch</code> PUT thô 500 MB chết ở mốc 400 MB thì bắt đầu lại từ số không, và câu trả lời là multipart, thứ vốn đã tiếp tục được theo thiết kế. Các phương án nhiễu lật ngược sự thật. Tải lên trực tiếp BỎ BỚT một chặng chứ không làm tăng chi phí băng thông, bucket vẫn riêng tư (chữ ký chính là phép xác thực), còn lượt gọi xin presign tốn vài chục mili-giây so với một lượt tải lên tính bằng phút.',
          ),
        }),

        // ── Chương 5 — CORS ─────────────────────────────────────────────
        mcq({
          prompt: B(
            'Two cross-origin requests from the same page to the same bucket hostname. One triggers a preflight and one does not:' + code(
              'A: <img src="https://media.example.com/anh.jpg">\n' +
              "B: fetch(uploadUrl, { method: 'PUT',\n" +
              "     headers: { 'Content-Type': 'image/jpeg' }, body: file })",
            ) + 'Why the difference?',
            'Hai request khác nguồn từ cùng một trang tới cùng một tên máy chủ bucket. Một cái kích hoạt preflight, một cái thì không:' + code(
              'A: <img src="https://media.example.com/anh.jpg">\n' +
              "B: fetch(uploadUrl, { method: 'PUT',\n" +
              "     headers: { 'Content-Type': 'image/jpeg' }, body: file })",
            ) + 'Vì sao lại khác nhau?',
          ),
          options: [
            B('Because A is a GET and B is a PUT, and preflight is decided purely by the method — a GET issued from <code>fetch</code> would behave exactly like A', 'Vì A là GET còn B là PUT, và preflight quyết định thuần theo phương thức — một lệnh GET phát ra từ <code>fetch</code> sẽ hành xử y hệt A'),
            B('Because B goes to a signed URL, and the query string makes it a non-simple request; the same PUT to an unsigned URL would skip the preflight', 'Vì B đi tới một URL đã ký, và chuỗi truy vấn làm nó thành một request không đơn giản; đúng lệnh PUT ấy tới một URL chưa ký thì sẽ bỏ qua preflight'),
            B('Because B carries a body, and the browser preflights any request with a body so the server can reject it before the bytes are uploaded', 'Vì B có thân dữ liệu, và trình duyệt gửi preflight cho mọi request có thân để máy chủ từ chối được trước khi số byte được tải lên'),
            B('Because A is not a scripted request at all, and B fails all three simple-request conditions at once: it is neither GET/HEAD/POST, its content type is outside the three form-ish values, and it is issued from script', 'Vì A không phải một request do script phát ra, còn B thì trượt cả ba điều kiện của request "đơn giản" cùng lúc: nó không phải GET/HEAD/POST, content type của nó nằm ngoài ba giá trị kiểu form, và nó do script phát ra')
          ],
          correct: 3,
          explanation: EX(
            'Lesson 5.2 gives the simple-request conditions: method in GET/HEAD/POST, a content type among <code>text/plain</code>, <code>application/x-www-form-urlencoded</code> and <code>multipart/form-data</code>, and no custom headers beyond a short safelist. An <code>&lt;img&gt;</code> tag is not covered by CORS in the first place — the browser renders the image and simply refuses to let script read its pixels. Option A is the tempting near-miss: the method matters, but so does the content type, which is why <code>fetch</code> with <code>Content-Type: application/json</code> preflights even as a POST. The practical conclusion of the lesson is that a browser upload ALWAYS preflights, so the useful question is never "how do I avoid it" but "how long does the browser cache it".',
            'Bài 5.2 nêu các điều kiện của một request "đơn giản": phương thức nằm trong GET/HEAD/POST, content type nằm trong ba giá trị <code>text/plain</code>, <code>application/x-www-form-urlencoded</code> và <code>multipart/form-data</code>, và không có header tuỳ biến nào ngoài một danh sách an toàn ngắn. Một thẻ <code>&lt;img&gt;</code> thì ngay từ đầu đã không nằm trong phạm vi CORS — trình duyệt vẽ tấm ảnh ra và chỉ từ chối cho script đọc điểm ảnh của nó. Lựa chọn A là cái suýt đúng đầy cám dỗ: phương thức có vai trò, nhưng content type cũng vậy, và đó là lý do <code>fetch</code> với <code>Content-Type: application/json</code> vẫn preflight dù là POST. Kết luận thực tế của bài học là một lượt tải lên từ trình duyệt LUÔN LUÔN preflight, nên câu hỏi có ích không bao giờ là "làm sao tránh nó" mà là "trình duyệt cache nó được bao lâu".',
          ),
        }),

        mcq({
          prompt: B(
            'An app does 100,000 browser uploads a day. Its bucket CORS policy has no <code>MaxAgeSeconds</code>. Using the published R2 rate of $4.50 per million Class A operations, what is the cost of that omission, and what fixes it?',
            'Một ứng dụng có 100.000 lượt tải lên từ trình duyệt mỗi ngày. Chính sách CORS của bucket không có <code>MaxAgeSeconds</code>. Dùng đơn giá công bố của R2 là 4,50 $ mỗi triệu thao tác Class A, việc bỏ sót ấy tốn bao nhiêu, và cái gì sửa được?',
          ),
          options: [
            B('Nothing measurable — an OPTIONS request carries no body and is not billed as an operation, so preflight caching is a latency optimisation only', 'Không tốn gì đáng kể — một request OPTIONS không mang thân dữ liệu và không bị tính là một thao tác, nên cache preflight chỉ là tối ưu độ trễ'),
            B('Roughly double the Class A cost of uploading, because every PUT is preceded by its own OPTIONS: 200k operations a day instead of 100k, about $27 a month instead of $13.50', 'Khoảng gấp đôi chi phí Class A của việc tải lên, vì mỗi lệnh PUT đều có một lệnh OPTIONS đi trước: 200 nghìn thao tác mỗi ngày thay vì 100 nghìn, khoảng 27 $ một tháng thay vì 13,50 $'),
            B('About 10× the Class A cost, since browsers retry a preflight up to ten times before giving up when no cache directive is present', 'Khoảng 10 lần chi phí Class A, vì trình duyệt thử lại một lượt preflight tới mười lần trước khi bỏ cuộc nếu không có chỉ thị cache nào'),
            B('Nothing on R2 but roughly $27 a month on S3, because Cloudflare absorbs preflight requests at the edge and never forwards them to the bucket', 'Không tốn gì trên R2 nhưng khoảng 27 $ một tháng trên S3, vì Cloudflare hấp thụ các request preflight ngay tại biên và không bao giờ chuyển tiếp chúng tới bucket'),
          ],
          correct: 1,
          explanation: EX(
            'The arithmetic is Lesson 5.2\'s: 200,000 operations a day is 6 million a month, and 6 × $4.50 = $27; with a one-hour <code>MaxAgeSeconds</code> and users who upload more than once an hour, the preflight count collapses to around 10,000 a day and the total lands near $14.85. It is not a large sum, and it is the cleanest example in the course of a cost driver that is invisible in code: nobody wrote the OPTIONS request, no log line in your application mentions it, and it doubles one line of your bill. Note what the fix is NOT — you cannot make the browser skip a preflight for a PUT, you can only make it reuse the answer.',
            'Phép tính là của bài 5.2: 200.000 thao tác mỗi ngày là 6 triệu mỗi tháng, và 6 × 4,50 $ = 27 $; với <code>MaxAgeSeconds</code> một giờ và những người dùng tải lên nhiều hơn một lần mỗi giờ, số lượt preflight co lại còn khoảng 10.000 mỗi ngày và tổng rơi về quanh 14,85 $. Đây không phải một khoản lớn, và nó là ví dụ sạch sẽ nhất trong khoá về một tác nhân chi phí vô hình trong mã: không ai viết ra cái request OPTIONS ấy, không dòng log nào của ứng dụng bạn nhắc tới nó, mà nó nhân đôi một dòng trên hoá đơn. Để ý cách sửa KHÔNG phải là gì — bạn không làm cho trình duyệt bỏ qua preflight của một lệnh PUT được, bạn chỉ làm cho nó dùng lại câu trả lời.',
          ),
        }),

        mcq({
          prompt: B(
            'A CORS policy is left with <code>&quot;AllowedHeaders&quot;: [&quot;*&quot;]</code> after debugging. Lesson 5.2 says to replace it with an explicit list. What does the wildcard actually cost?',
            'Một chính sách CORS bị bỏ lại với <code>&quot;AllowedHeaders&quot;: [&quot;*&quot;]</code> sau khi gỡ lỗi xong. Bài 5.2 bảo hãy thay nó bằng một danh sách tường minh. Cái dấu sao ấy thật ra tốn gì?',
          ),
          options: [
            B('It disables the browser\'s preflight cache, because a wildcard answer does not commit to a specific header set, so every upload preflights again even with MaxAgeSeconds set', 'Nó vô hiệu bộ nhớ đệm preflight của trình duyệt, vì một câu trả lời dấu sao không cam kết với một bộ header cụ thể nào, nên mọi lượt tải lên đều preflight lại kể cả khi đã đặt MaxAgeSeconds'),
            B('It lets any website read the response headers of your uploads, which is a data leak rather than a cost problem', 'Nó cho phép mọi website đọc được các header phản hồi của những lượt tải lên của bạn, đây là rò rỉ dữ liệu chứ không phải vấn đề chi phí'),
            B('It makes the server compute the allowed set on every request instead of reading a cached policy, which shows up as extra latency on the preflight', 'Nó bắt máy chủ tính lại bộ header cho phép ở mỗi request thay vì đọc một chính sách đã cache, và điều đó hiện ra thành độ trễ tăng thêm ở lượt preflight'),
            B('Nothing at all in practice — the wildcard is equivalent to listing every header, and the advice to enumerate them is style rather than substance', 'Trên thực tế chẳng tốn gì — dấu sao tương đương với việc liệt kê mọi header, và lời khuyên kể tên chúng ra là chuyện thẩm mỹ chứ không phải bản chất'),
          ],
          correct: 0,
          explanation: EX(
            'It costs you the caching, which means it costs you exactly the money the previous question counted. The mechanism in Lesson 5.2: the browser\'s preflight cache is keyed on the specific question it asked, and a <code>*</code> reply does not answer that question in a form it can store, so the next PUT asks again. Option B misreads the field — <code>AllowedHeaders</code> governs what the REQUEST may send, while what script may READ is <code>ExposeHeaders</code>; and neither of them controls which origins are allowed, which is <code>AllowedOrigins</code>. The fix is unglamorous: list the five or six headers an S3 upload actually sends and move on.',
            'Nó lấy đi của bạn khả năng cache, nghĩa là nó lấy đúng khoản tiền mà câu trước vừa đếm. Cơ chế nằm ở bài 5.2: bộ nhớ đệm preflight của trình duyệt được khoá theo đúng câu hỏi nó đã hỏi, và một câu trả lời <code>*</code> không trả lời câu hỏi ấy dưới dạng lưu lại được, nên lệnh PUT kế tiếp lại hỏi. Lựa chọn B đọc nhầm trường — <code>AllowedHeaders</code> chi phối thứ mà REQUEST được phép gửi, còn thứ mà script được phép ĐỌC là <code>ExposeHeaders</code>; và không cái nào trong hai cái ấy quyết định nguồn nào được phép, đó là việc của <code>AllowedOrigins</code>. Cách sửa chẳng hào nhoáng gì: liệt kê năm sáu cái header mà một lượt tải lên S3 thật sự gửi, rồi đi tiếp.',
          ),
        }),

        mcq({
          prompt: B(
            'A team sets <code>&quot;MaxAgeSeconds&quot;: 604800</code> (seven days) and confirms it with:' + code(
              "curl -X OPTIONS -H 'Origin: https://cuongthai.com' \\\n" +
              "     -H 'Access-Control-Request-Method: PUT' -I <endpoint>/<bucket>/<key>\n" +
              '  Access-Control-Max-Age: 604800',
            ) + 'Two weeks later the Class A bill has not moved. What went wrong?',
            'Một nhóm đặt <code>&quot;MaxAgeSeconds&quot;: 604800</code> (bảy ngày) rồi xác nhận bằng:' + code(
              "curl -X OPTIONS -H 'Origin: https://cuongthai.com' \\\n" +
              "     -H 'Access-Control-Request-Method: PUT' -I <endpoint>/<bucket>/<key>\n" +
              '  Access-Control-Max-Age: 604800',
            ) + 'Hai tuần sau hoá đơn Class A không nhúc nhích. Hỏng ở đâu?',
          ),
          options: [
            B('The value is too large to be valid, so the browser discards the whole preflight response and treats the upload as unauthorised', 'Giá trị ấy quá lớn nên không hợp lệ, thế là trình duyệt vứt cả phản hồi preflight và coi lượt tải lên là chưa được phép'),
            B('The check proved the wrong thing twice over: browsers clamp the value to their own maximum (Chrome about two hours), and curl has no preflight cache at all, so the command can only show the header was sent, never that anything cached it', 'Phép kiểm ấy chứng minh nhầm tới hai lần: trình duyệt kẹp giá trị về mức tối đa của riêng nó (Chrome khoảng hai giờ), và curl thì hoàn toàn không có bộ nhớ đệm preflight, nên câu lệnh chỉ cho thấy header đã được gửi chứ không bao giờ cho thấy có gì cache lại'),
            B('MaxAgeSeconds only applies to GET preflights; a PUT preflight is never cached by any browser, which is why the number had no effect', 'MaxAgeSeconds chỉ áp cho preflight của GET; preflight của PUT thì không trình duyệt nào cache, và đó là lý do con số ấy không có tác dụng'),
            B('The header has to be set on the PUT response rather than on the OPTIONS response, so the policy was applied in the wrong place', 'Header ấy phải được đặt trên phản hồi của PUT chứ không phải trên phản hồi của OPTIONS, nên chính sách đã được áp sai chỗ'),
          ],
          correct: 1,
          explanation: EX(
            'Both halves are traps Lesson 5.2 names. The clamp is real and per-browser — the lesson gives Chrome at 7200 seconds, Firefox at 86400 and Safari at 600 as of 2026 — so seven days is simply ignored and the practical advice is to set 3600 and stop optimising. The second half is the more transferable lesson, and it is the same one the course repeats about CORS testing generally: you have to check the checker. <code>curl</code> can show you a header; only a browser has the cache the header is talking to. Verify in DevTools by watching for the ABSENCE of an OPTIONS before the second and third PUT.',
            'Cả hai nửa đều là bẫy mà bài 5.2 gọi tên. Chuyện bị kẹp là có thật và khác nhau theo từng trình duyệt — bài học cho Chrome 7200 giây, Firefox 86400 và Safari 600 tính tới 2026 — nên bảy ngày đơn giản là bị bỏ qua, và lời khuyên thực tế là đặt 3600 rồi thôi tối ưu. Nửa sau mới là bài học mang đi được, và nó cũng chính là điều khoá học lặp lại về việc kiểm thử CORS nói chung: phải kiểm cái bộ kiểm trước. <code>curl</code> cho bạn thấy một cái header; chỉ có trình duyệt mới có cái bộ nhớ đệm mà header ấy đang nói chuyện. Hãy kiểm trong DevTools bằng cách nhìn xem có VẮNG MẶT một lệnh OPTIONS trước lệnh PUT thứ hai và thứ ba hay không.',
          ),
        }),

        mcq({
          prompt: B(
            'A preflight fails with this console message and response:' + code(
              'Console: Method PUT is not allowed by Access-Control-Allow-Methods.\n' +
              'Response: Access-Control-Allow-Methods: GET, HEAD',
            ) + 'Which archetype is this, and what is notable about the evidence?',
            'Một lượt preflight hỏng với thông báo console và phản hồi như sau:' + code(
              'Console: Method PUT is not allowed by Access-Control-Allow-Methods.\n' +
              'Response: Access-Control-Allow-Methods: GET, HEAD',
            ) + 'Đây là dạng nào trong bốn dạng, và bằng chứng có gì đáng chú ý?',
          ),
          options: [
            B('Origin mismatch — the method list is a red herring, and the real fix is adding the www variant of the origin to AllowedOrigins', 'Lệch nguồn — danh sách phương thức chỉ là cá trích đỏ, và cách sửa thật là thêm biến thể www của nguồn vào AllowedOrigins'),
            B('Not a CORS problem at all — a 405 from the bucket surfaced in the console as a CORS message, so the endpoint URL is wrong', 'Không phải chuyện CORS — một mã 405 từ bucket hiện ra ở console dưới dạng thông báo CORS, nên URL endpoint bị sai'),
            B('Response header invisible — the browser can see the methods but your JavaScript cannot, so the header must be added to ExposeHeaders', 'Header phản hồi bị giấu — trình duyệt nhìn thấy các phương thức nhưng JavaScript của bạn thì không, nên phải thêm header ấy vào ExposeHeaders'),
            B('Method not allowed — and unusually for CORS, the response itself names the complete allow list, so the diagnosis needs no guessing: add PUT to AllowedMethods', 'Phương thức không được phép — và khác thường so với CORS nói chung, chính phản hồi liệt kê đủ danh sách cho phép, nên chẩn đoán khỏi phải đoán: thêm PUT vào AllowedMethods')
          ],
          correct: 3,
          explanation: EX(
            'This is archetype 2 of the four in Lesson 5.3, and it is the easiest of the four precisely because the response is explicit: the allow list is printed, PUT is not on it, done. Compare that with archetype 1, where the response either omits <code>Access-Control-Allow-Origin</code> entirely or shows a value that differs from your Origin by a <code>www.</code> you have to notice yourself. The five-second checklist in the same lesson is the general form of this: put the request headers and the response headers side by side and find the item present in one and missing from the other. For most apps <code>GET, HEAD, PUT</code> is the right list, and DELETE belongs on your backend rather than in a browser.',
            'Đây là dạng thứ hai trong bốn dạng ở bài 5.3, và nó là dạng dễ nhất đúng vì phản hồi nói thẳng: danh sách cho phép được in ra, PUT không có trong đó, xong. So với dạng 1, nơi phản hồi hoặc bỏ hẳn <code>Access-Control-Allow-Origin</code> hoặc hiện một giá trị lệch với Origin của bạn đúng một chữ <code>www.</code> mà bạn phải tự nhìn ra. Danh sách kiểm năm giây ở cùng bài học chính là dạng tổng quát của việc này: đặt header của request và header của phản hồi cạnh nhau rồi tìm cái mục có ở bên này mà thiếu ở bên kia. Với đa số ứng dụng thì <code>GET, HEAD, PUT</code> là danh sách đúng, còn DELETE thuộc về backend của bạn chứ không thuộc về trình duyệt.',
          ),
        }),

        mcq({
          prompt: B(
            'Browser uploads fail with:' + code(
              "The value of the 'Access-Control-Allow-Credentials' header in the\n" +
              "response is '' which must be 'true' when the request's credentials\n" +
              'mode is \'include\'',
            ) + 'The upload goes to a presigned URL. What is the right fix?',
            'Tải lên từ trình duyệt hỏng với:' + code(
              "The value of the 'Access-Control-Allow-Credentials' header in the\n" +
              "response is '' which must be 'true' when the request's credentials\n" +
              'mode is \'include\'',
            ) + 'Lượt tải lên đi tới một presigned URL. Cách sửa đúng là gì?',
          ),
          options: [
            B('Add <code>&quot;AllowCredentials&quot;: true</code> to the bucket CORS policy, the field that exists precisely for this case', 'Thêm <code>&quot;AllowCredentials&quot;: true</code> vào chính sách CORS của bucket, đúng cái trường sinh ra cho ca này'),
            B('Switch <code>AllowedOrigins</code> to <code>[&quot;*&quot;]</code>, since a wildcard satisfies any origin and therefore any credentials mode', 'Chuyển <code>AllowedOrigins</code> sang <code>[&quot;*&quot;]</code>, vì một dấu sao thoả mãn mọi nguồn và do đó thoả mãn mọi chế độ credentials'),
            B('Drop <code>credentials: &quot;include&quot;</code> from the upload call — a presigned URL authenticates with its signature, so sending cookies to the bucket is pointless and is almost always a copied-in bug', 'Bỏ <code>credentials: &quot;include&quot;</code> khỏi lượt gọi tải lên — một presigned URL xác thực bằng chính chữ ký của nó, nên gửi cookie sang bucket là vô nghĩa và gần như luôn luôn là một lỗi chép nhầm vào'),
            B('Move the upload behind your own API so the cookie is consumed by your server, which is the only way to satisfy the credentials requirement', 'Chuyển lượt tải lên ra sau API của chính bạn để cookie được máy chủ của bạn tiêu thụ, đó là cách duy nhất thoả mãn yêu cầu về credentials'),
          ],
          correct: 2,
          explanation: EX(
            'Lesson 5.2 is blunt about this: <code>credentials: &quot;include&quot;</code> on a browser upload path is almost always a bug, usually inherited from an axios instance configured for your own API. The bucket has no session with the user; the signature in the query string is the entire authorisation. Option A names a field that does not exist in the R2 or S3 CORS schema — both send <code>Allow-Credentials: true</code> as a consequence of listing an explicit origin, not as a setting. Option B makes it worse: the spec forbids pairing a wildcard origin with credentials, so that combination fails by definition. And option D throws away Chapter 4 — it puts your server back in the data path and reinstates the 100 MB proxy limit.',
            'Bài 5.2 nói thẳng: <code>credentials: &quot;include&quot;</code> trên đường tải lên từ trình duyệt gần như luôn là một lỗi, thường thừa hưởng từ một thực thể axios được cấu hình cho API của chính bạn. Bucket không có phiên nào với người dùng cả; chữ ký trong chuỗi truy vấn chính là toàn bộ phần cấp quyền. Lựa chọn A gọi tên một trường không tồn tại trong lược đồ CORS của R2 lẫn S3 — cả hai gửi <code>Allow-Credentials: true</code> như một hệ quả của việc liệt kê nguồn tường minh, chứ không phải như một thiết lập. Lựa chọn B làm mọi thứ tệ hơn: đặc tả cấm ghép nguồn dấu sao với credentials, nên tổ hợp ấy hỏng theo định nghĩa. Còn lựa chọn D vứt bỏ cả chương 4 — nó đặt máy chủ của bạn trở lại đường đi của dữ liệu và dựng lại cái trần 100 MB của proxy.',
          ),
        }),

        mcq({
          prompt: B(
            'An upload fails and the report says "CORS error". The DevTools Network tab shows:' + code(
              'Console:   fetch failed: net::ERR_FAILED\n' +
              'Network:   no OPTIONS entry, no PUT entry — nothing at all',
            ) + 'What does the evidence actually say?',
            'Một lượt tải lên hỏng và báo cáo ghi "lỗi CORS". Tab Network của DevTools cho thấy:' + code(
              'Console:   fetch failed: net::ERR_FAILED\n' +
              'Network:   khong co dong OPTIONS, khong co dong PUT — khong co gi ca',
            ) + 'Bằng chứng thật sự nói gì?',
          ),
          options: [
            B('That the CORS policy is so restrictive the browser suppressed even the preflight, which happens when the origin is absent from AllowedOrigins entirely', 'Rằng chính sách CORS chặt tới mức trình duyệt nén luôn cả lượt preflight, chuyện xảy ra khi nguồn hoàn toàn vắng mặt khỏi AllowedOrigins'),
            B('That this is not CORS: a blocked preflight appears in Network with status <code>(blocked:cors)</code>, whereas nothing at all means DNS, TCP, a firewall or a malformed URL — reproduce it with <code>curl -v</code>', 'Rằng đây không phải CORS: một lượt preflight bị chặn vẫn hiện trong Network với trạng thái <code>(blocked:cors)</code>, còn không có gì cả nghĩa là DNS, TCP, tường lửa hay một URL dị dạng — hãy dựng lại bằng <code>curl -v</code>'),
            B('That the preflight succeeded and the PUT was rejected silently by the bucket, which is what an expired signature looks like from the browser', 'Rằng preflight đã thành công và lượt PUT bị bucket từ chối trong im lặng, đó là hình dạng của một chữ ký hết hạn khi nhìn từ trình duyệt'),
            B('That the browser cached a failed preflight from an earlier attempt, so no new request is made until MaxAgeSeconds expires', 'Rằng trình duyệt đã cache một lượt preflight hỏng từ lần thử trước, nên không request mới nào được gửi cho tới khi MaxAgeSeconds hết hạn'),
          ],
          correct: 1,
          explanation: EX(
            'Lesson 5.3 keeps a section for this exact case, under the heading "the one CORS bug your CORS policy cannot fix". The distinguishing evidence is the shape of the Network tab, not the wording in the console: a CORS block is a request the browser MADE and then refused to use, so it is listed; <code>net::ERR_FAILED</code> with an empty Network tab is a request that never got out. Option D is worth naming as a real thing that does not apply here — browsers do not cache failed preflights, only successful ones. And the reason this matters is time: the CORS explanation sends you to the bucket dashboard, while the truth is usually a typo in the endpoint or a corporate proxy, and <code>curl -v</code> separates the two in ten seconds.',
            'Bài 5.3 dành hẳn một mục cho đúng ca này, dưới tiêu đề "cái lỗi CORS mà chính sách CORS của bạn không sửa được". Bằng chứng phân biệt nằm ở hình dạng của tab Network, không nằm ở câu chữ trong console: một lượt bị CORS chặn là một request mà trình duyệt ĐÃ GỬI rồi từ chối dùng, nên nó vẫn được liệt kê; còn <code>net::ERR_FAILED</code> với tab Network trống là một request chưa bao giờ ra khỏi máy. Lựa chọn D đáng gọi tên vì nó là một chuyện có thật nhưng không áp vào đây — trình duyệt không cache preflight hỏng, chỉ cache preflight thành công. Và lý do điều này quan trọng là thời gian: lời giải thích CORS đẩy bạn tới bảng điều khiển bucket, trong khi sự thật thường là một lỗi gõ trong endpoint hoặc một proxy của công ty, và <code>curl -v</code> tách hai thứ ấy ra trong mười giây.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO statements about CORS that are true.',
            'Chọn HAI phát biểu ĐÚNG về CORS.',
          ),
          options: [
            B('Header names in the policy are case-insensitive, so <code>X-Amz-Content-Sha256</code> and <code>x-amz-content-sha256</code> behave identically and are not worth arguing about', 'Tên header trong chính sách không phân biệt hoa thường, nên <code>X-Amz-Content-Sha256</code> và <code>x-amz-content-sha256</code> hành xử y hệt nhau và không đáng để tranh cãi'),
            B('CORS hides the response body and the status code from cross-origin script, which is why a blocked upload cannot be distinguished from a failed one', 'CORS giấu thân phản hồi và mã trạng thái khỏi script khác nguồn, và đó là lý do một lượt tải lên bị chặn không phân biệt được với một lượt tải lên hỏng'),
            B('A CORS policy on the bucket protects the bucket from unauthorised writes, which is why a wildcard origin is a security hole even when signatures are required', 'Một chính sách CORS trên bucket bảo vệ bucket khỏi những lượt ghi trái phép, và đó là lý do nguồn dấu sao là một lỗ hổng bảo mật kể cả khi vẫn bắt buộc có chữ ký'),
            B('An origin is compared as an exact scheme-plus-host-plus-port string, so <code>https://a.com</code>, <code>https://www.a.com</code> and <code>http://a.com</code> are three different origins', 'Một origin được so như một chuỗi lược đồ cộng máy chủ cộng cổng khớp chính xác, nên <code>https://a.com</code>, <code>https://www.a.com</code> và <code>http://a.com</code> là ba origin khác nhau'),
          ],
          correct: [0, 3],
          explanation: EX(
            'Both true statements come from Lesson 5.3, and both save real time: the capitalisation debate is empty because HTTP lowercases header names internally, and the exact-string origin comparison is why one missing hostname blocks 100% of one group of users while everyone else is fine. Option B is half right in a way that misleads — CORS hides response HEADERS from script, but the body and status come through, which is exactly why the fourth archetype is so confusing (the upload returns 200, the code reads <code>headers.get(&quot;etag&quot;)</code> as null, and concludes failure). Option C mistakes CORS for authorisation: it is a browser-side rule, it does not touch curl, a server, or a mobile app, and the thing that actually protects the bucket is the signature.',
            'Cả hai phát biểu đúng đều lấy từ bài 5.3, và cả hai đều tiết kiệm thời gian thật: cuộc tranh cãi về viết hoa là rỗng vì HTTP tự hạ chữ thường tên header ở bên trong, còn phép so origin khớp chuỗi chính xác chính là lý do một tên máy chủ thiếu sót chặn 100% một nhóm người dùng trong khi mọi người khác vẫn bình thường. Lựa chọn B đúng một nửa theo kiểu gây hiểu lầm — CORS giấu HEADER của phản hồi khỏi script, nhưng thân và mã trạng thái vẫn tới nơi, và đó đúng là lý do dạng bẫy thứ tư khó chịu đến vậy (lượt tải lên trả 200, đoạn mã đọc <code>headers.get(&quot;etag&quot;)</code> ra null, rồi kết luận là hỏng). Lựa chọn C nhầm CORS với cấp quyền: nó là quy tắc phía trình duyệt, nó không đụng gì tới curl, tới một máy chủ, hay một ứng dụng di động, và thứ thật sự bảo vệ bucket là chữ ký.',
          ),
        }),

        // ── Chương 6 — lifecycle và cleanup ─────────────────────────────
        mcq({
          prompt: B(
            'A one-off cleanup is attempted with a burst rule. Measured against a live endpoint:' + code(
              'PutBucketLifecycleConfiguration Rules=[\n' +
              '  { ID: "z", Status: "Enabled", Filter: { Prefix: "x/" },\n' +
              '    Expiration: { Days: 0 } } ]\n\n' +
              '  err.Code : InvalidArgument   HTTP 400\n' +
              '  message  : Days must be positive integer when used with Expiration',
            ) + 'The lesson describes <code>Days: 0</code> as "delete immediately". What is the real risk here?',
            'Một lượt dọn dẹp một lần được thử bằng một rule quét sạch. Đo thật trên một máy chủ sống:' + code(
              'PutBucketLifecycleConfiguration Rules=[\n' +
              '  { ID: "z", Status: "Enabled", Filter: { Prefix: "x/" },\n' +
              '    Expiration: { Days: 0 } } ]\n\n' +
              '  err.Code : InvalidArgument   HTTP 400\n' +
              '  message  : Days must be positive integer when used with Expiration',
            ) + 'Bài học mô tả <code>Days: 0</code> là "xoá ngay lập tức". Rủi ro thật ở đây là gì?',
          ),
          options: [
            B('That the rule deletes every matching object on the next sweep, so the whole prefix is gone before anyone reviews the change', 'Rằng rule ấy xoá sạch mọi object khớp ở lượt quét kế tiếp, nên cả tiền tố biến mất trước khi có ai kịp xem lại thay đổi'),
            B('That the whole configuration was refused, so if the caller ignored the error the bucket is now running with NO lifecycle rules at all — including the abort rule that was in the same request', 'Rằng cả bộ cấu hình bị từ chối, nên nếu người gọi bỏ qua lỗi thì bucket bây giờ đang chạy mà KHÔNG có lifecycle rule nào — kể cả cái rule abort nằm chung trong request ấy'),
            B('That <code>Days: 0</code> is interpreted as "no expiry", so the objects live forever and the cleanup silently never happens', 'Rằng <code>Days: 0</code> được hiểu là "không hết hạn", nên các object sống mãi và lượt dọn dẹp âm thầm không bao giờ xảy ra'),
            B('That the error is advisory only and the rule is stored anyway, so the behaviour depends on which provider you deployed to', 'Rằng lỗi ấy chỉ mang tính khuyến cáo còn rule vẫn được lưu, nên hành vi phụ thuộc vào nhà cung cấp bạn triển khai tới'),
          ],
          correct: 1,
          explanation: EX(
            'Measured, and it contradicts the natural reading of Lesson 6.2: the server does not accept zero at all, and the AWS documentation likewise requires a positive integer. So the danger is not a runaway deletion — it is the shape of this API. <code>PutBucketLifecycleConfiguration</code> replaces the ENTIRE rule set in one call, and it is all-or-nothing, so one invalid rule in an array of four rejects all four. A deploy script that logs the error and continues leaves a bucket with no abort rule and no expiry rules, and nothing will fail for months. Read the configuration back with <code>GetBucketLifecycleConfiguration</code> after every write — that is the check, not the status code you did not look at.',
            'Đo thật, và nó mâu thuẫn với cách đọc tự nhiên của bài 6.2: máy chủ không chấp nhận số không, và tài liệu AWS cũng đòi một số nguyên dương. Vậy mối nguy không phải một lượt xoá mất kiểm soát — nó nằm ở hình dạng của cái API này. <code>PutBucketLifecycleConfiguration</code> THAY THẾ toàn bộ tập rule trong một lượt gọi, và nó được ăn cả ngã về không, nên một rule sai trong một mảng bốn rule làm cả bốn bị từ chối. Một script triển khai ghi log lỗi rồi đi tiếp sẽ để lại một bucket không có rule abort và không có rule hết hạn, và sẽ chẳng có gì hỏng suốt nhiều tháng. Hãy đọc lại cấu hình bằng <code>GetBucketLifecycleConfiguration</code> sau mỗi lượt ghi — đó mới là phép kiểm, chứ không phải cái mã trạng thái bạn không thèm nhìn.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 6.2 lists classes of object that were never meant to be permanent:' + code(
              'export/report downloads       user downloads once, never again\n' +
              'video transcoding staging     kept only until the final output exists\n' +
              'log/audit archives            compliance says "at least N days"\n' +
              'password reset attachments    should not survive the request\n' +
              'thumbnails of deleted posts   the app forgot to clean them up',
            ) + 'A README says "everything under tmp/ is temporary". What does Lesson 6.2 say about that?',
            'Bài 6.2 liệt kê các loại object vốn không bao giờ được định là vĩnh viễn:' + code(
              'file xuat / bao cao       nguoi dung tai mot lan roi thoi\n' +
              'noi trung chuyen transcode video  chi giu toi khi co ban cuoi\n' +
              'kho log / kiem toan       tuan thu doi "it nhat N ngay"\n' +
              'file dinh kem dat lai mat khau   khong nen song qua request\n' +
              'thumbnail cua bai da xoa  ung dung quen don',
            ) + 'Một file README ghi "mọi thứ dưới tmp/ đều là tạm". Bài 6.2 nói gì về chuyện đó?',
          ),
          options: [

            B('"Temporary" only means something if a rule enforces it: without one, those objects are billed forever, and the last two classes in the list are exactly the ones no rule can help with unless the prefixes were designed for it', '"Tạm" chỉ có nghĩa khi có một rule thi hành nó: không có rule thì đống object ấy bị tính tiền mãi mãi, và hai loại cuối trong danh sách đúng là hai loại mà không rule nào giúp được trừ khi các tiền tố đã được thiết kế cho việc đó'),
            B('It is worse than nothing, because a prefix named tmp/ makes readers assume a rule exists and stops them from asking; the correct move is to remove the README line and rely on the lifecycle configuration alone as the single source of truth', 'Nó tệ hơn là không có gì, vì một tiền tố tên tmp/ làm người đọc tưởng đã có rule và thôi không hỏi nữa; động tác đúng là xoá dòng README ấy đi và chỉ dựa vào cấu hình lifecycle làm nguồn sự thật duy nhất'),            B('It is sufficient documentation, provided the team reviews the bucket quarterly and deletes what the README says is disposable — a written convention plus a human process is what most teams actually run on', 'Đó là tài liệu đủ dùng, miễn là nhóm rà bucket mỗi quý và xoá đi thứ mà README nói là vứt được — một quy ước viết ra cộng một quy trình do người làm chính là thứ đa số nhóm đang vận hành'),
            B('The README is the right place for it, because a lifecycle rule cannot distinguish an export a user already downloaded from one they have not, so the decision has to stay with a human', 'README đúng là chỗ dành cho việc ấy, vì một lifecycle rule không phân biệt được một file xuất mà người dùng đã tải với một file họ chưa tải, nên quyết định phải để cho con người')
          ],
          correct: 0,
          explanation: EX(
            'The lesson puts it in one sentence — a comment saying a folder is temporary costs you money forever — and the table is there to show how many kinds of object fall into it. Two entries are worth separating out. Password reset attachments are the easy case: a fixed one-day rule on <code>auth/reset/</code> and the problem is closed. Thumbnails of deleted posts are the hard one, and Chapter 6.3 explains why: "is this key still referenced" is a fact in your database, and lifecycle can only see age, prefix and size — so that class needs a reconciliation job, not a rule. Option B is right that an unenforced convention is misleading, and wrong about the fix: delete the objects with a rule, not the sentence.',
            'Bài học gói gọn trong một câu — một dòng chú thích nói thư mục này là tạm sẽ tốn tiền của bạn mãi mãi — và cái bảng ở đó để cho thấy có bao nhiêu loại object rơi vào đó. Hai mục đáng tách riêng. File đính kèm đặt lại mật khẩu là ca dễ: một rule một ngày cố định trên <code>auth/reset/</code> là xong chuyện. Thumbnail của bài đã xoá mới là ca khó, và bài 6.3 giải thích vì sao: "key này còn được tham chiếu không" là một sự thật nằm trong cơ sở dữ liệu của bạn, còn lifecycle chỉ nhìn thấy tuổi, tiền tố và kích thước — nên loại ấy cần một job đối soát chứ không cần một rule. Lựa chọn B đúng ở chỗ một quy ước không được thi hành thì gây hiểu lầm, và sai ở cách sửa: hãy xoá đống object bằng một rule, chứ đừng xoá cái câu văn.',
          ),
        }),

        mcq({
          prompt: B(
            'Two rules are saved together and the server accepts both. Measured:' + code(
              'Rules = [\n' +
              '  { ID: "a", Status: "Enabled", Filter: { Prefix: "exports/" },\n' +
              '    Expiration: { Days: 30 } },\n' +
              '  { ID: "b", Status: "Enabled", Filter: { Prefix: "exports/" },\n' +
              '    Expiration: { Days: 7 } } ]\n' +
              '  -> HTTP 200, both rules read back',
            ) + 'What happens to a 10-day-old object under <code>exports/</code>?',
            'Hai rule được lưu cùng nhau và máy chủ nhận cả hai. Đo thật:' + code(
              'Rules = [\n' +
              '  { ID: "a", Status: "Enabled", Filter: { Prefix: "exports/" },\n' +
              '    Expiration: { Days: 30 } },\n' +
              '  { ID: "b", Status: "Enabled", Filter: { Prefix: "exports/" },\n' +
              '    Expiration: { Days: 7 } } ]\n' +
              '  -> HTTP 200, doc lai thay ca hai rule',
            ) + 'Một object 10 ngày tuổi nằm dưới <code>exports/</code> sẽ ra sao?',
          ),
          options: [
            B('It survives: when two rules disagree the provider refuses to act on either and leaves the object alone until the conflict is resolved', 'Nó sống: khi hai rule mâu thuẫn thì nhà cung cấp từ chối hành động theo cả hai và để yên object cho tới khi mâu thuẫn được gỡ'),
            B('It survives until day 37, because when several rules match the provider sums their retention windows', 'Nó sống tới ngày thứ 37, vì khi nhiều rule cùng khớp thì nhà cung cấp cộng dồn các khoảng lưu giữ của chúng'),
            B('It survives until day 30, because rules are applied in array order and the first match wins', 'Nó sống tới ngày thứ 30, vì các rule được áp theo thứ tự trong mảng và cái khớp đầu tiên thắng'),
            B('It is deleted, because rules do not stack — the object matches both and the EARLIEST expiration wins, so the 7-day rule decides even though the 30-day rule was declared first', 'Nó bị xoá, vì các rule không cộng dồn — object khớp cả hai và cái HẾT HẠN SỚM NHẤT thắng, nên rule 7 ngày quyết định dù rule 30 ngày được khai trước')
          ],
          correct: 3,
          explanation: EX(
            'Lesson 6.2 states the semantics: "an object matches every rule whose prefix matches it, and the earliest expiration wins". The measurement adds the part that makes it dangerous — the server takes both rules without a word of complaint, so a contradiction is not a deploy-time error, it is a data-loss surprise that shows up whenever the shorter window elapses. This is why the lesson\'s advice about prefix design matters more than the rule syntax: overlapping prefixes make the outcome something you have to derive rather than read. Design prefixes so at most one rule can match, and if two must overlap, write the effective retention in a comment next to them.',
            'Bài 6.2 nêu ngữ nghĩa: "một object khớp với mọi rule có tiền tố khớp nó, và cái hết hạn sớm nhất thắng". Phép đo bổ sung đúng phần làm điều này thành nguy hiểm — máy chủ nhận cả hai rule mà không kêu một tiếng, nên một mâu thuẫn không phải lỗi lúc triển khai, nó là một cú mất dữ liệu bất ngờ, xuất hiện đúng lúc cái khoảng ngắn hơn trôi qua. Đó là lý do lời khuyên về thiết kế tiền tố của bài học còn quan trọng hơn cú pháp của rule: các tiền tố chồng lấn khiến kết quả thành thứ bạn phải suy ra chứ không đọc ra. Hãy thiết kế tiền tố sao cho nhiều nhất một rule khớp được, và nếu buộc phải chồng nhau thì ghi luôn thời hạn thực tế vào một dòng chú thích bên cạnh.',
          ),
        }),

        mcq({
          prompt: B(
            'A team is choosing <code>AbortIncompleteMultipartUpload.DaysAfterInitiation</code> for a bucket that accepts 1 GB video uploads from consumer connections. Someone proposes 1 day, to reclaim the wasted storage fast. What is the argument against, and what does the clock actually measure?',
            'Một nhóm đang chọn <code>AbortIncompleteMultipartUpload.DaysAfterInitiation</code> cho một bucket nhận video 1 GB tải lên từ đường truyền của người dùng phổ thông. Có người đề xuất 1 ngày, để thu hồi dung lượng lãng phí thật nhanh. Lý lẽ phản đối là gì, và cái đồng hồ ấy thật ra đo cái gì?',
          ),
          options: [
            B('One day is fine because the clock restarts on every UploadPart, so an upload that is still making progress can never be aborted by the rule', 'Một ngày là ổn vì đồng hồ chạy lại từ đầu ở mỗi lệnh UploadPart, nên một lượt tải lên vẫn đang tiến triển thì rule không bao giờ huỷ được'),
            B('One day is fine because aborting only removes the parts, and the client\'s next UploadPart transparently recreates the upload with the same UploadId', 'Một ngày là ổn vì huỷ chỉ gỡ bỏ các phần đã tải, còn lệnh UploadPart kế tiếp của client sẽ tự dựng lại lượt tải với đúng UploadId cũ'),
            B('One day is too short because the clock runs from CreateMultipartUpload, so a slow or resumable upload still in progress gets killed; 7 days is the common default and the number should cover your slowest legitimate upload', 'Một ngày là quá ngắn vì đồng hồ chạy từ lệnh CreateMultipartUpload, nên một lượt tải chậm hoặc đang chờ tiếp tục vẫn còn dở sẽ bị giết; 7 ngày là mặc định phổ biến và con số ấy phải phủ được lượt tải hợp lệ chậm nhất của bạn'),
            B('One day is too short because the provider only sweeps weekly, so anything under 7 days rounds up and the setting has no effect at all', 'Một ngày là quá ngắn vì nhà cung cấp chỉ quét mỗi tuần một lần, nên mọi giá trị dưới 7 ngày đều bị làm tròn lên và thiết lập ấy hoàn toàn vô tác dụng'),
          ],
          correct: 2,
          explanation: EX(
            'Lesson 6.1 does the arithmetic that settles it: a 1 GB file over a 200 kbps link is about eleven hours before you count retries or a laptop lid closing overnight, so a one-day window kills real uploads. The word in the field name is the whole answer — <code>DaysAfterInitiation</code>, measured from <code>CreateMultipartUpload</code>, not from the last part that arrived. Option A is the intuitive and wrong reading, and it is why people pick aggressive values. The other half of the lesson is the ceiling: 30 days on a bucket leaking 100 GB a day is 3 TB of invisible storage by the time the rule fires, so 7 days is the compromise, and an app with a resume feature should use its resume window plus one.',
            'Bài 6.1 làm phép tính chốt lại chuyện này: một file 1 GB qua đường 200 kbps mất khoảng mười một giờ, chưa tính thử lại hay chuyện gập máy để qua đêm, nên cửa sổ một ngày sẽ giết những lượt tải lên có thật. Chữ nằm trong tên trường chính là cả câu trả lời — <code>DaysAfterInitiation</code>, tính từ <code>CreateMultipartUpload</code>, không tính từ phần cuối cùng vừa tới. Lựa chọn A là cách đọc theo trực giác và sai, và đó là lý do người ta chọn những giá trị quyết liệt. Nửa còn lại của bài học là cái trần: 30 ngày trên một bucket rò 100 GB mỗi ngày là 3 TB dung lượng vô hình tính tới lúc rule chạy, nên 7 ngày là điểm dung hoà, còn ứng dụng có tính năng tiếp tục tải nên lấy đúng cửa sổ tiếp tục của nó cộng thêm một.',
          ),
        }),

        mcq({
          prompt: B(
            'A reconciliation job scans the bucket and asks the database about each key it finds:' + code(
              'for (const o of page.Contents) {\n' +
              '  const row = await prisma.attachment.findUnique({ where: { r2Key: o.Key } });\n' +
              '  if (!row) orphans.push(o.Key);\n' +
              '}',
            ) + 'On a 1.2 million-object bucket this is a problem before it is a bug. Why, and what is the shape Lesson 6.3 asks for?',
            'Một job đối soát quét bucket rồi hỏi cơ sở dữ liệu về từng key nó tìm thấy:' + code(
              'for (const o of page.Contents) {\n' +
              '  const row = await prisma.attachment.findUnique({ where: { r2Key: o.Key } });\n' +
              '  if (!row) orphans.push(o.Key);\n' +
              '}',
            ) + 'Trên một bucket 1,2 triệu object thì đây là một vấn đề trước khi kịp là một lỗi. Vì sao, và bài 6.3 đòi hình dạng nào?',
          ),
          options: [
            B('It costs a Class A operation per object, so the reconciliation is more expensive than the storage it reclaims; batch the LISTING instead by raising MaxKeys above 1000', 'Nó tốn một thao tác Class A cho mỗi object, nên lượt đối soát đắt hơn cả dung lượng nó thu hồi; hãy gộp lượt LIỆT KÊ lại bằng cách nâng MaxKeys lên trên 1000'),
            B('It opens one database transaction per object and exhausts the connection pool, so the fix is to wrap the whole page in a single transaction', 'Nó mở một giao dịch cơ sở dữ liệu cho mỗi object và làm cạn bể kết nối, nên cách sửa là bọc cả trang vào một giao dịch duy nhất'),
            B('It issues one query per object — a million queries — so the reconciliation becomes the incident; ask once per page with <code>where: { r2Key: { in: keys } }</code> over the 1000 keys the listing already returned', 'Nó bắn một truy vấn cho mỗi object — một triệu truy vấn — nên chính lượt đối soát thành sự cố; hãy hỏi một lần cho mỗi trang bằng <code>where: { r2Key: { in: keys } }</code> trên đúng 1000 key mà lượt liệt kê vừa trả về'),
            B('It reads the keys in listing order rather than in index order, so every query is a sequential scan; adding an index on <code>r2Key</code> is the whole fix', 'Nó đọc các key theo thứ tự liệt kê chứ không theo thứ tự chỉ mục, nên mọi truy vấn đều là một lượt quét tuần tự; thêm chỉ mục lên <code>r2Key</code> là toàn bộ cách sửa'),
          ],
          correct: 2,
          explanation: EX(
            'Lesson 6.3 says it in one line — "one query per object is a million queries per million objects, and the reconciliation itself becomes the incident" — and points out that the 1000-key page size of <code>ListObjectsV2</code> lines up neatly with a batched <code>IN</code> query. Option A gets the wrong lever: the listing already costs one Class A per page, and you cannot raise <code>MaxKeys</code> past 1000 anyway, since the server caps it. Option D is worth thinking about separately — an index on the key column is genuinely necessary, and with it each of those million queries is fast, which is exactly what makes this failure sneaky: nothing is slow, there are just a million of them.',
            'Bài 6.3 nói gọn một dòng — "một truy vấn cho mỗi object là một triệu truy vấn cho một triệu object, và chính lượt đối soát trở thành sự cố" — và chỉ ra rằng cỡ trang 1000 key của <code>ListObjectsV2</code> khớp gọn với một truy vấn <code>IN</code> theo lô. Lựa chọn A cầm nhầm cần gạt: lượt liệt kê vốn đã tốn một Class A cho mỗi trang, mà bạn cũng không nâng <code>MaxKeys</code> quá 1000 được vì máy chủ chốt nó lại. Lựa chọn D đáng nghĩ riêng — một chỉ mục trên cột key thật sự là cần thiết, và có nó thì từng truy vấn trong một triệu truy vấn ấy đều nhanh, mà đó đúng là thứ làm kiểu hỏng này ranh mãnh: không có gì chậm cả, chỉ là có một triệu cái.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 6.3 describes two directions of orphan. Users are filing tickets about broken images. Which direction is that, how do you detect it, and why does it feel more urgent than the other?',
            'Bài 6.3 mô tả hai chiều của object mồ côi. Người dùng đang gửi phiếu than phiền ảnh hỏng. Đó là chiều nào, phát hiện ra sao, và vì sao nó có vẻ gấp hơn chiều kia?',
          ),
          options: [
            B('Row without object — walk the unverified rows and <code>HeadObject</code> each key, treating <code>err.name === &quot;NotFound&quot;</code> as missing; it feels urgent because every instance is a user staring at a broken image, while the other direction is only money', 'Hàng không có object — duyệt các hàng chưa xác minh và <code>HeadObject</code> từng key, coi <code>err.name === &quot;NotFound&quot;</code> là thiếu; nó có vẻ gấp vì mỗi ca là một người dùng đang nhìn một tấm ảnh hỏng, còn chiều kia chỉ là tiền'),
            B('Object without row — list the bucket and ask the database; it feels urgent because those objects are billed every month and the count grows without bound', 'Object không có hàng — liệt kê bucket rồi hỏi cơ sở dữ liệu; nó có vẻ gấp vì những object ấy bị tính tiền hàng tháng và số lượng tăng không giới hạn'),
            B('Row without object — detect it with a lifecycle rule that expires rows whose object has disappeared, which is the one case lifecycle can handle', 'Hàng không có object — phát hiện bằng một lifecycle rule cho hết hạn những hàng mà object đã biến mất, đây là ca duy nhất lifecycle xử lý được'),
            B('Both at once — the two directions are the same mismatch seen from two ends, so one scan comparing the full listing to the full table finds and fixes both', 'Cả hai cùng lúc — hai chiều chỉ là một sự lệch nhìn từ hai đầu, nên một lượt quét so cả danh sách với cả bảng là tìm ra và sửa được cả hai'),
          ],
          correct: 0,
          explanation: EX(
            'Orphan B is the loud one, and Lesson 6.3 gives the real proportions from a measured cleanup: 142,551 objects with no row against 218 rows with no object. The rare direction is the one that generates support tickets, and the common one just quietly costs $0.62 a month. Note the detection asymmetry that follows: orphan A is found by listing the bucket in pages and batching the database question, while orphan B is found by walking rows and calling <code>HeadObject</code> per row — there is no batch HEAD, so parallelism (about 20 at a time) is the only lever. Option C is the chapter\'s central impossibility: lifecycle sees age, prefix, size and storage class, and never your database.',
            'Mồ côi kiểu B là kiểu ồn ào, và bài 6.3 cho tỉ lệ thật từ một lượt dọn dẹp đã đo: 142.551 object không có hàng so với 218 hàng không có object. Chiều hiếm gặp lại là chiều sinh ra phiếu hỗ trợ, còn chiều phổ biến thì chỉ lặng lẽ tốn 0,62 $ mỗi tháng. Để ý sự bất đối xứng trong cách phát hiện đi kèm: mồ côi A tìm bằng cách liệt kê bucket theo trang rồi gộp câu hỏi cơ sở dữ liệu, còn mồ côi B tìm bằng cách duyệt từng hàng và gọi <code>HeadObject</code> cho mỗi hàng — không có lệnh HEAD theo lô, nên chạy song song (chừng 20 cái một lúc) là cần gạt duy nhất. Lựa chọn C chính là điều bất khả trung tâm của chương: lifecycle nhìn thấy tuổi, tiền tố, kích thước và lớp lưu trữ, và không bao giờ nhìn thấy cơ sở dữ liệu của bạn.',
          ),
        }),

        mcq({
          prompt: B(
            'A bucket stores a monthly CSV export a user downloads once, and a permanent annual report, both under <code>reports/</code>. Lesson 6.2 calls this a prefix-design problem rather than a rule problem. What is the fix, and what does it buy beyond correctness?',
            'Một bucket lưu một file CSV xuất theo tháng mà người dùng tải đúng một lần, và một báo cáo thường niên lưu vĩnh viễn, cả hai đều nằm dưới <code>reports/</code>. Bài 6.2 gọi đây là vấn đề thiết kế tiền tố chứ không phải vấn đề của rule. Cách sửa là gì, và ngoài chuyện đúng đắn thì nó còn được gì?',
          ),
          options: [
            B('Give the temporary export its own prefix that names the retention — <code>reports/tmp-30d/</code> — so the rule can target it precisely, and so anyone reading the bucket knows what will disappear without opening the lifecycle config', 'Cho file xuất tạm một tiền tố riêng mang luôn thời hạn — <code>reports/tmp-30d/</code> — để rule nhắm trúng nó, và để bất cứ ai nhìn vào bucket đều biết cái gì sẽ biến mất mà không phải mở cấu hình lifecycle'),
            B('Tag the temporary objects with <code>x-amz-meta-retention: 30d</code> and let the lifecycle rule filter on that metadata, which keeps the key layout clean', 'Gắn thẻ cho các object tạm bằng <code>x-amz-meta-retention: 30d</code> rồi để lifecycle rule lọc theo metadata ấy, cách này giữ cho cách bố trí key sạch sẽ'),
            B('Keep one prefix and give the permanent report a much later <code>LastModified</code> by re-uploading it monthly, so the age-based rule never reaches it', 'Giữ nguyên một tiền tố và cho báo cáo vĩnh viễn một <code>LastModified</code> muộn hơn hẳn bằng cách tải lại nó mỗi tháng, để rule theo tuổi không bao giờ chạm tới nó'),
            B('Move the permanent report to a second bucket, since a single bucket cannot hold objects with two different retention policies', 'Chuyển báo cáo vĩnh viễn sang một bucket thứ hai, vì một bucket không thể chứa các object có hai chính sách lưu giữ khác nhau'),
          ],
          correct: 0,
          explanation: EX(
            'The lesson\'s three points are all here: keep disposable and permanent apart, bake the retention into the path so a new developer reads the intent off the key, and let the rule be boring. Option B fails on a fact worth knowing — lifecycle filters take a prefix, a tag on some providers, and object size; custom <code>x-amz-meta-*</code> metadata is NOT a filterable dimension. Option C is the antipattern in its purest form: it works, and it makes the permanent report depend on a monthly cron nobody will remember, so the day the cron breaks the report is deleted. Option D overshoots — one bucket holds as many retention policies as you have prefixes.',
            'Ba ý của bài học đều nằm ở đây: tách thứ vứt được khỏi thứ giữ lại, nướng luôn thời hạn vào đường dẫn để một người mới đọc được ý định ngay trên cái key, và để cho cái rule nhàm chán đi. Lựa chọn B hỏng ở một sự thật đáng biết — bộ lọc của lifecycle nhận một tiền tố, một thẻ tag ở vài nhà cung cấp, và kích thước object; metadata tuỳ biến <code>x-amz-meta-*</code> KHÔNG phải một chiều lọc được. Lựa chọn C là phản mẫu ở dạng thuần khiết nhất: nó chạy được, và nó làm cho báo cáo vĩnh viễn phụ thuộc vào một cron hàng tháng mà không ai nhớ, nên đúng ngày cái cron hỏng là báo cáo bị xoá. Lựa chọn D thì quá đà — một bucket chứa được bao nhiêu chính sách lưu giữ tuỳ theo bạn có bao nhiêu tiền tố.',
          ),
        }),

        mcq({
          prompt: B(
            'Three months after a lifecycle rule ships, the security team asks why <code>exports/user-42/2026-05-18-tax.csv</code> disappeared on 2026-06-18. What does Lesson 6.2 say a team needs in order to answer, and why is the bucket setting alone not enough?',
            'Ba tháng sau khi một lifecycle rule được đưa lên, bộ phận bảo mật hỏi vì sao <code>exports/user-42/2026-05-18-tax.csv</code> biến mất ngày 18/06/2026. Bài 6.2 nói một nhóm cần gì để trả lời được, và vì sao chỉ mỗi thiết lập trên bucket là chưa đủ?',
          ),
          options: [
            B('The provider\'s deletion audit log, which records every lifecycle deletion with the rule that caused it and is retained for a year by default', 'Nhật ký kiểm toán xoá của nhà cung cấp, thứ ghi lại mọi lượt xoá do lifecycle kèm rule đã gây ra nó và mặc định giữ trong một năm'),
            B('Nothing beyond the console: the rule is visible in the dashboard and its ID explains the deletion, so the answer is a screenshot', 'Không cần gì ngoài bảng điều khiển: rule hiện trên đó và cái ID của nó giải thích được lượt xoá, nên câu trả lời là một ảnh chụp màn hình'),
            B('The lifecycle policy JSON committed to the repository alongside the migrations, so the answer names the rule, the retention and the date the policy was adopted — the bucket setting is current state with no history of when it changed or who changed it', 'Khối JSON của chính sách lifecycle được commit vào kho mã cạnh các migration, để câu trả lời gọi được tên rule, thời hạn và ngày chính sách bắt đầu áp dụng — thiết lập trên bucket chỉ là trạng thái hiện tại, không có lịch sử ai đổi lúc nào'),
            B('A soft-delete prefix: instead of expiring objects, move them to <code>deleted/</code> so nothing is ever really gone and every question can be answered by looking', 'Một tiền tố xoá mềm: thay vì cho object hết hạn thì chuyển chúng sang <code>deleted/</code> để không gì mất hẳn và mọi câu hỏi đều trả lời được bằng cách nhìn'),
          ],
          correct: 2,
          explanation: EX(
            'The lesson frames it as a compliance problem rather than a storage problem, and the fix is version control: the bucket is the source of truth for what is enforced NOW, and the repository is the paper trail for when it changed and why. That distinction is the transferable part — every setting that lives only in a cloud console has the same gap. Option D is a real technique with a real cost that the lesson would push back on: a soft-delete prefix that nothing ever expires is just the original storage bill with an extra copy, and it defeats the reason the rule exists. Option A overstates what these providers give you by default; request logging exists (Lesson 7.3) but you have to turn it on and pay to keep it.',
            'Bài học đóng khung đây là vấn đề tuân thủ chứ không phải vấn đề lưu trữ, và cách sửa là quản lý phiên bản: bucket là nguồn sự thật cho thứ đang được thi hành BÂY GIỜ, còn kho mã là dấu vết giấy tờ cho chuyện nó đổi khi nào và vì sao. Sự phân biệt ấy mới là phần mang đi được — mọi thiết lập chỉ sống trong một bảng điều khiển đám mây đều có đúng lỗ hổng này. Lựa chọn D là một kỹ thuật có thật với một cái giá có thật mà bài học sẽ phản đối: một tiền tố xoá mềm mà không có gì cho hết hạn thì chỉ là hoá đơn lưu trữ ban đầu cộng thêm một bản sao, và nó triệt tiêu chính lý do cái rule tồn tại. Lựa chọn A nói quá về thứ các nhà cung cấp này cho sẵn; ghi log request thì có (bài 7.3) nhưng bạn phải bật lên và phải trả tiền để giữ.',
          ),
        }),

        // ── Chương 7 — quản lý chi phí ──────────────────────────────────
        mcq({
          prompt: B(
            'Lesson 7.1 prints the two free monthly tiers side by side:' + code(
              'R2: 10 GB storage, 1M Class A, 10M Class B, zero egress\n' +
              'S3:  5 GB storage, 2k Class A, 20k Class B, first 100 GB egress',
            ) + 'A hobby project stores 3 GB and serves 40,000 image reads a month with almost no writes. What do the two free tiers say?',
            'Bài 7.1 in hai gói miễn phí hằng tháng cạnh nhau:' + code(
              'R2: 10 GB luu tru, 1M Class A, 10M Class B, egress bang 0\n' +
              'S3:  5 GB luu tru, 2k Class A, 20k Class B, 100 GB egress dau tien',
            ) + 'Một dự án nghiệp dư lưu 3 GB và phục vụ 40.000 lượt đọc ảnh mỗi tháng, gần như không ghi. Hai gói miễn phí nói gì?',
          ),
          options: [
            B('Both cover it comfortably, since 3 GB and 40,000 reads are far below every threshold on both lists', 'Cả hai đều phủ thoải mái, vì 3 GB và 40.000 lượt đọc thấp hơn hẳn mọi ngưỡng ở cả hai danh sách'),
            B('R2 covers it entirely, while on S3 the 40,000 reads are double the 20,000 Class B allowance — so the free tier is where S3 stops being free first, and it is the request line rather than the storage line that does it', 'R2 phủ trọn, còn trên S3 thì 40.000 lượt đọc gấp đôi hạn mức 20.000 Class B — nên gói miễn phí chính là chỗ S3 hết miễn phí trước, và thứ làm điều đó là dòng request chứ không phải dòng lưu trữ'),
            B('S3 covers it and R2 does not, because R2 has no free egress allowance and every read leaves the network', 'S3 phủ được còn R2 thì không, vì R2 không có hạn mức egress miễn phí và mọi lượt đọc đều rời khỏi mạng'),
            B('Neither covers it: 3 GB exceeds the S3 storage allowance and 40,000 reads exceed the R2 Class B allowance', 'Không cái nào phủ được: 3 GB vượt hạn mức lưu trữ của S3 và 40.000 lượt đọc vượt hạn mức Class B của R2'),
          ],
          correct: 1,
          explanation: EX(
            'Read the two lists against the workload: 3 GB fits under both storage figures (10 GB and 5 GB), and 40,000 reads fit easily inside R2\'s 10 million Class B but are twice S3\'s 20,000. So the operation allowances are two and a half orders of magnitude apart, and that is the number that decides a small project, not the storage. It is also a small illustration of the chapter\'s main point — people compare the figure they understand (gigabytes) and get surprised by the one they do not (requests). Note that R2\'s zero egress is not an allowance that runs out, which is why option C inverts the situation.',
            'Đọc hai danh sách ấy đối chiếu với tải công việc: 3 GB lọt dưới cả hai con số lưu trữ (10 GB và 5 GB), còn 40.000 lượt đọc lọt thoải mái trong 10 triệu Class B của R2 nhưng gấp đôi con số 20.000 của S3. Vậy hạn mức thao tác của hai bên cách nhau hai bậc rưỡi độ lớn, và chính con số ấy quyết định một dự án nhỏ chứ không phải dung lượng. Đây cũng là một minh hoạ nhỏ cho ý chính của chương — người ta so con số họ hiểu (gigabyte) rồi ngã ngửa vì con số họ không để ý (số request). Để ý rằng egress bằng 0 của R2 không phải một hạn mức có thể cạn, và đó là chỗ lựa chọn C lộn ngược tình hình.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 7.2 measures the same 200,000 photos under three read patterns:' + code(
              'read once per photo per month      : 200,000 GET   = 0.2M Class B\n' +
              'each photo in 40 feeds/day         : 200,000x40x30 = 240M Class B\n' +
              'the same, with a 3-variant srcset  : 240M x 3      = 720M Class B',
            ) + 'What does this table establish about cost estimates?',
            'Bài 7.2 đo đúng 200.000 tấm ảnh ấy dưới ba hình thái đọc:' + code(
              'doc mot lan moi anh moi thang      : 200.000 GET   = 0,2M Class B\n' +
              'moi anh trong 40 bang tin/ngay     : 200.000x40x30 = 240M Class B\n' +
              'van vay, kem srcset 3 bien the     : 240M x 3      = 720M Class B',
            ) + 'Bảng này xác lập điều gì về việc ước lượng chi phí?',
          ),
          options: [
            B('That an estimate must start from the number of objects and their total size, since those are the only two figures a provider bills on and the read pattern is downstream of them', 'Rằng một ước lượng phải bắt đầu từ số lượng object và tổng dung lượng của chúng, vì đó là hai con số duy nhất nhà cung cấp tính tiền còn hình thái đọc chỉ là hệ quả đi sau'),
            B('That read cost scales with storage, since a library three times larger produces three times the reads — which is why the srcset line is exactly 3x the line above it', 'Rằng chi phí đọc tỉ lệ với dung lượng, vì một thư viện lớn gấp ba sinh ra số lượt đọc gấp ba — và đó là lý do dòng srcset đúng bằng 3 lần dòng trên nó'),
            B('That responsive images should be abandoned, since the srcset line is three times the feed line and the bandwidth saved does not appear on the bill at all', 'Rằng nên bỏ hẳn ảnh đáp ứng, vì dòng srcset gấp ba dòng bảng tin còn khoản băng thông tiết kiệm được thì không hiện lên hoá đơn'),
            B('That the same library spans three orders of magnitude on the read line depending only on how the app uses it, so an estimate built from object count and storage size alone is worth nothing without a reads-per-object figure', 'Rằng cùng một thư viện ảnh trải ba bậc độ lớn trên dòng đọc chỉ tuỳ theo cách ứng dụng dùng nó, nên một ước lượng dựng từ mỗi số lượng object và dung lượng là vô giá trị nếu không có con số lượt đọc trên mỗi object')
          ],
          correct: 3,
          explanation: EX(
            'The three lines describe ONE library of 200,000 photos, and the read figure moves from 0.2 million to 720 million — a factor of 3,600 — while the object count and the stored bytes never change. That is the point: reads per object is an independent variable, and it is the one nobody writes down. Option D inverts the causation the table refutes; the srcset line is 3x because each page view fetches three variants, not because anything got bigger. Option C reaches a real conclusion from the wrong ledger — on R2 the bytes are free and the requests are not, so dropping srcset trades a large bandwidth win for a small request win, and the lesson recommends fewer VARIANTS at upload time instead, not fewer sizes at render time.',
            'Ba dòng ấy mô tả MỘT thư viện 200.000 tấm ảnh, và con số lượt đọc chạy từ 0,2 triệu lên 720 triệu — hệ số 3.600 — trong khi số object và số byte đã lưu không hề đổi. Đó chính là ý: số lượt đọc trên mỗi object là một biến độc lập, và nó là cái không ai chịu ghi ra. Lựa chọn D lộn ngược đúng cái quan hệ nhân quả mà bảng này bác bỏ; dòng srcset gấp 3 vì mỗi lượt xem trang lấy về ba biến thể, chứ không phải vì cái gì to ra. Lựa chọn C rút một kết luận có thật từ nhầm sổ sách — trên R2 thì số byte miễn phí còn số request thì không, nên bỏ srcset là đánh đổi một khoản băng thông lớn lấy một khoản request nhỏ, và bài học khuyến nghị giảm số BIẾN THỂ lúc tải lên chứ không phải giảm số cỡ lúc hiển thị.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 7.2 puts pre-generated variants and on-demand generation side by side and calls on-demand "the modern default". For which workload does pre-generation still win, and why?',
            'Bài 7.2 đặt biến thể sinh sẵn cạnh biến thể sinh theo yêu cầu và gọi cách sinh theo yêu cầu là "mặc định hiện đại". Với tải công việc nào thì sinh sẵn vẫn thắng, và vì sao?',
          ),
          options: [
            B('A consumer photo app, because users expect the first view to be instant and 200-500 ms of generation latency is unacceptable on a feed', 'Một ứng dụng ảnh cho người dùng phổ thông, vì người dùng mong lượt xem đầu tiên phải tức thì và 200-500 ms độ trễ sinh ảnh là không chấp nhận được trên một bảng tin'),
            B('A batch pipeline such as video encoding or print production, where essentially every variant IS used, so there is no waste to avoid and on-demand only adds compute per generation', 'Một pipeline chạy theo lô như mã hoá video hay chế bản in, nơi gần như MỌI biến thể đều được dùng, nên chẳng có lãng phí nào để tránh mà sinh theo yêu cầu chỉ thêm phần tính toán cho mỗi lượt sinh'),
            B('Any workload above ten million objects, because on-demand generation cannot be cached at that scale', 'Mọi tải công việc trên mười triệu object, vì sinh theo yêu cầu không cache được ở quy mô ấy'),
            B('Any workload on S3 rather than R2, because on-demand generation requires a Cloudflare Worker and has no equivalent on AWS', 'Mọi tải công việc chạy trên S3 chứ không phải R2, vì sinh theo yêu cầu cần một Cloudflare Worker mà AWS không có thứ tương đương'),
          ],
          correct: 1,
          explanation: EX(
            'The lesson\'s tradeoff table turns on one row: "cost when 90% of photos are never viewed" versus "cost when 100% of variants are used every day". On-demand wins the first case decisively, because a photo nobody opens generates nothing and stores nothing; pre-generation wins the second, because you pay the compute once instead of on each first request, and there is no waste to avoid. Option A is the argument people reach for and the lesson answers it directly: the 200-500 ms is paid once per variant and every later request is a cache hit at ~50 ms. Option D is wrong on the facts — Vercel Image Optimization and CloudFront plus Lambda@Edge are the AWS-side equivalents.',
            'Bảng đánh đổi của bài học xoay quanh đúng một hàng: "chi phí khi 90% ảnh không bao giờ được xem" so với "chi phí khi 100% biến thể đều được dùng mỗi ngày". Sinh theo yêu cầu thắng ca đầu một cách dứt khoát, vì một tấm ảnh không ai mở thì không sinh gì và không lưu gì; sinh sẵn thắng ca sau, vì bạn trả phần tính toán đúng một lần thay vì trả ở mỗi lượt yêu cầu đầu tiên, mà lại chẳng có lãng phí nào để tránh. Lựa chọn A là lý lẽ người ta hay với tới, và bài học trả lời thẳng: 200-500 ms ấy trả đúng một lần cho mỗi biến thể còn mọi lượt sau đều là trúng cache ở mức ~50 ms. Lựa chọn D sai về sự kiện — Vercel Image Optimization và CloudFront cộng Lambda@Edge chính là thứ tương đương ở phía AWS.',
          ),
        }),

        mcq({
          prompt: B(
            'A thumbnail pipeline writes its variants without a <code>Cache-Control</code> header. The objects are content-hashed, so their URLs never change. Lesson 7.2 calls this a trap. Which line of the bill does it hit, and by how much?',
            'Một pipeline thumbnail ghi các biến thể mà không kèm header <code>Cache-Control</code>. Các object được đặt tên theo mã băm nội dung nên URL của chúng không bao giờ đổi. Bài 7.2 gọi đây là một cái bẫy. Nó đánh vào dòng nào của hoá đơn, và nặng cỡ nào?',
          ),
          options: [
            B('Storage, because objects without a cache header are kept in a redundant tier that costs more per GB-month', 'Lưu trữ, vì object không có header cache bị giữ ở một tầng dự phòng có giá cao hơn mỗi GB-tháng'),
            B('Class A, because each cache miss re-runs the pipeline and rewrites the variant, doubling the write count on a hot feed', 'Class A, vì mỗi lượt trượt cache lại chạy lại pipeline và ghi lại biến thể, làm gấp đôi số lượt ghi trên một bảng tin nóng'),
            B('Class B, because without a long TTL every viewer refetches from the origin instead of from cache — the lesson\'s figure is a $1 asset turning into a $20 one on a hot feed', 'Class B, vì không có TTL dài thì mọi người xem đều tải lại từ gốc thay vì từ cache — con số bài học đưa ra là một tài nguyên 1 $ biến thành 20 $ trên một bảng tin nóng'),
            B('Egress, because uncached responses are billed at the internet rate even on R2, and only cached responses qualify for the zero-egress pricing', 'Egress, vì phản hồi không được cache bị tính theo đơn giá internet ngay cả trên R2, và chỉ phản hồi từ cache mới được hưởng giá egress bằng 0'),
          ],
          correct: 2,
          explanation: EX(
            'Every extra origin fetch is a Class B read, so the cost of a missing header is measured in requests. The detail that makes it pure waste is in the question: the objects are content-addressed, so <code>public, max-age=31536000, immutable</code> is not merely safe, it is exactly true — a URL whose name is the hash of its content can never serve different bytes. Option D is worth killing explicitly: R2 egress is zero whether or not a response was cached, so the money is entirely in the request line. And option B inverts the direction — a cache miss re-READS the object, it does not re-run your pipeline.',
            'Mỗi lượt phải về tới gốc thêm một lần là một lượt đọc Class B, nên cái giá của một header thiếu được đo bằng số request. Chi tiết làm cho nó thành lãng phí thuần tuý nằm ngay trong đề: các object được đặt tên theo nội dung, nên <code>public, max-age=31536000, immutable</code> không chỉ an toàn mà còn đúng chính xác — một URL mà tên của nó là mã băm nội dung thì không bao giờ phục vụ được số byte khác. Lựa chọn D đáng phải bác thẳng: egress của R2 bằng 0 bất kể phản hồi có được cache hay không, nên tiền nằm trọn ở dòng request. Còn lựa chọn B thì lộn chiều — một lượt trượt cache ĐỌC LẠI object chứ không chạy lại pipeline của bạn.',
          ),
        }),

        mcq({
          prompt: B(
            'Request logging is being turned on. Lesson 7.3 warns against one particular destination. Which, and what goes wrong?',
            'Ghi log request đang được bật. Bài 7.3 cảnh báo về một đích đến cụ thể. Đích nào, và hỏng ra sao?',
          ),
          options: [
            B('A bucket in a different account, because cross-account writes need a role the log delivery service cannot assume', 'Một bucket ở tài khoản khác, vì ghi chéo tài khoản cần một vai trò mà dịch vụ giao log không đóng được'),
            B('A bucket behind a custom domain, because log delivery goes through the CDN and the cached copies diverge from the originals', 'Một bucket nằm sau custom domain, vì việc giao log đi qua CDN và các bản cache lệch với bản gốc'),
            B('Any bucket with a lifecycle rule, because expiring a log file breaks the audit chain and the provider refuses to deliver into such a bucket', 'Bất kỳ bucket nào có lifecycle rule, vì cho một file log hết hạn là phá vỡ chuỗi kiểm toán và nhà cung cấp từ chối giao log vào một bucket như thế'),
            B('The bucket being logged, because the log writes are themselves operations that get logged, which produces more writes — a small self-amplifying loop; log into a separate bucket and exclude it from its own logging', 'Chính cái bucket đang được ghi log, vì các lượt ghi log bản thân chúng là những thao tác lại bị ghi log, sinh ra thêm lượt ghi — một vòng tự khuếch đại nhỏ; hãy ghi log sang một bucket riêng và loại nó ra khỏi cấu hình log của chính nó')
          ],
          correct: 3,
          explanation: EX(
            'The lesson states it plainly, and the loop is real if unspectacular — each batch of log events lands as an object, that write is an event, and so on. The reason to care is not runaway cost but signal: your logs fill with your own logging, and the token-by-count query that is supposed to find the runaway script now has a permanent top entry that is you. The rest of the lesson puts the cost in perspective: about 50 GB and 200k Class A a month on a busy bucket, roughly $1.65, against the $300 incident it explains. The other three options describe things that are either normal practice (a lifecycle rule on the log bucket is exactly right, since 30 days is the retention the lesson recommends) or not how log delivery works.',
            'Bài học nói thẳng, và cái vòng ấy có thật dù không ngoạn mục — mỗi lô sự kiện log đáp xuống thành một object, lượt ghi đó là một sự kiện, cứ thế. Lý do phải bận tâm không phải chi phí mất kiểm soát mà là tín hiệu: log của bạn đầy lên bằng chính việc ghi log của bạn, và cái truy vấn đếm theo token vốn để tìm ra script chạy loạn giờ có một mục đứng đầu vĩnh viễn, và mục ấy là bạn. Phần còn lại của bài học đặt chi phí vào đúng tỉ lệ: khoảng 50 GB và 200 nghìn Class A mỗi tháng trên một bucket bận, chừng 1,65 $, so với cái sự cố 300 $ mà nó giải thích được. Ba lựa chọn kia mô tả những thứ hoặc là thực hành bình thường (một lifecycle rule trên bucket chứa log là hoàn toàn đúng, vì 30 ngày chính là thời hạn bài học khuyến nghị) hoặc là không phải cách việc giao log vận hành.',
          ),
        }),

        mcq({
          prompt: B(
            'An incident is over. The rate alarm was set at 20,000 Class A ops/min and fired at 03:40; reading the metrics afterwards, the runaway was already clearly above baseline at 8,000 ops/min from 01:10. Lesson 7.3 gives a one-line action. What is it?',
            'Một sự cố đã kết thúc. Cảnh báo theo tốc độ đặt ở mức 20.000 thao tác Class A mỗi phút và nó kêu lúc 03:40; đọc lại số liệu sau đó thì thấy cái script chạy loạn đã vượt hẳn mức nền ở 8.000 thao tác/phút từ 01:10. Bài 7.3 đưa ra một hành động gọn một dòng. Đó là gì?',
          ),
          options: [
            B('Lower the alarm threshold to below where the runaway was actually visible, so the next one is caught at the earlier warning instead of at the emergency', 'Hạ ngưỡng cảnh báo xuống dưới mức mà script chạy loạn thật sự đã lộ ra, để lần sau bắt được ở cảnh báo sớm thay vì ở lúc khẩn cấp'),
            B('Raise the budget alert, since the incident showed the current ceiling was set unrealistically low for this workload', 'Nâng ngưỡng cảnh báo ngân sách lên, vì sự cố cho thấy cái trần hiện tại đặt thấp phi thực tế so với tải công việc này'),
            B('Replace the rate alarm with a budget alert, because the rate alarm fired too late to be useful and the budget alert at least names the amount', 'Thay cảnh báo theo tốc độ bằng cảnh báo ngân sách, vì cảnh báo theo tốc độ kêu quá muộn nên vô dụng, còn cảnh báo ngân sách ít ra cũng gọi được ra con số'),
            B('Revoke the token that caused it and consider the matter closed, since the same script cannot run again without credentials', 'Thu hồi cái token đã gây ra chuyện và coi như xong, vì cùng script ấy không chạy lại được nếu không có thông tin xác thực'),
          ],
          correct: 0,
          explanation: EX(
            'The lesson\'s runbook step is exactly this: "after incident: raise a rate alarm one baseline below what fired". The rate alarm is the only one of the three defences that can catch a script WHILE it is running — two and a half hours of headroom, in this case — so tuning it is what converts a post-mortem into prevention. Option C throws away the wrong layer: budget alerts are trailing by construction, since they report money already spent. Option D is a necessary immediate action and a poor conclusion, because the next runaway will come from a different token; the alarm is what generalises.',
            'Bước trong sổ tay vận hành của bài học đúng là như vậy: "sau sự cố: hạ cảnh báo tốc độ xuống một mức nền so với mức đã kêu". Cảnh báo theo tốc độ là cái duy nhất trong ba lớp phòng thủ bắt được một script TRONG LÚC nó đang chạy — ở ca này là hai tiếng rưỡi dư địa — nên chỉnh nó lại chính là thứ biến một buổi mổ xẻ thành sự phòng ngừa. Lựa chọn C vứt nhầm lớp: cảnh báo ngân sách bám đuôi theo thiết kế, vì nó báo về khoản tiền đã tiêu rồi. Lựa chọn D là một hành động tức thời cần thiết và là một kết luận kém, vì lần chạy loạn tới sẽ đến từ một token khác; cái cảnh báo mới là thứ tổng quát hoá được.',
          ),
        }),

        mcq({
          prompt: B(
            'A photo product keeps the untouched original of every upload forever, alongside four widths in three formats. Lesson 7.2 suggests questioning that. What is the actual argument, and what is the counter-argument that decides it?',
            'Một sản phẩm ảnh giữ mãi mãi bản gốc chưa đụng tới của mọi lượt tải lên, bên cạnh bốn chiều rộng ở ba định dạng. Bài 7.2 gợi ý hãy đặt câu hỏi về việc đó. Lý lẽ thật là gì, và lý lẽ ngược lại nào quyết định chuyện này?',
          ),
          options: [
            B('Keep the original always: without it a pipeline change cannot regenerate variants, and regeneration from a variant compounds compression loss — the storage is a small price for that option', 'Luôn giữ bản gốc: không có nó thì một thay đổi pipeline không sinh lại được các biến thể, mà sinh lại từ một biến thể sẽ dồn thêm mất mát do nén — dung lượng là cái giá nhỏ cho khả năng ấy'),
            B('Delete the original always: the largest variant is visually indistinguishable, and no product has ever needed the original bytes back', 'Luôn xoá bản gốc: biến thể lớn nhất nhìn không phân biệt được, và chưa sản phẩm nào từng cần lấy lại số byte gốc'),
            B('Keep it only for paying customers, because storage cost should follow revenue and free users cannot justify the extra gigabytes', 'Chỉ giữ cho khách trả tiền, vì chi phí lưu trữ nên đi theo doanh thu và người dùng miễn phí không biện minh nổi cho số gigabyte thêm ra'),
            B('It depends on whether you will regenerate: the original is usually the single largest object in the set, so it roughly doubles storage — keep it if your pipeline still changes, drop it and promote the biggest variant to source of truth if it does not', 'Tuỳ vào việc bạn có sinh lại nữa hay không: bản gốc thường là object lớn nhất trong cả bộ nên nó gần như nhân đôi dung lượng — giữ nếu pipeline của bạn còn thay đổi, bỏ đi và đưa biến thể lớn nhất lên làm nguồn sự thật nếu nó không còn đổi'),
          ],
          correct: 3,
          explanation: EX(
            'The lesson\'s own numbers make the size point concrete: the 5.24 MB original against 2.14 MB for all thirteen derived objects put together, so the original is about 70% of the storage for that upload. And the lesson\'s framing is a question rather than a rule — "many discover they never opened it in three years" — which is why the answer has to name the condition that decides it. Option A states the strongest reason to keep it and stops there; the trade only tips that way while the pipeline is still moving. Option C is worth rejecting for a non-cost reason: two retention policies for the same content type means a support ticket you cannot answer when a free user upgrades.',
            'Chính những con số của bài học làm cho ý về kích thước thành cụ thể: bản gốc 5,24 MB so với 2,14 MB cho cả mười ba object dẫn xuất cộng lại, nên bản gốc chiếm chừng 70% dung lượng của lượt tải ấy. Và cách bài học đóng khung là một câu hỏi chứ không phải một quy tắc — "nhiều nơi phát hiện ra suốt ba năm chưa từng mở nó" — nên câu trả lời buộc phải gọi tên cái điều kiện quyết định. Lựa chọn A nêu lý do mạnh nhất để giữ rồi dừng lại ở đó; sự đánh đổi chỉ nghiêng về phía ấy khi pipeline còn đang động. Lựa chọn C đáng bác vì một lý do không liên quan chi phí: hai chính sách lưu giữ cho cùng một loại nội dung nghĩa là một phiếu hỗ trợ bạn không trả lời nổi khi một người dùng miễn phí nâng cấp.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO true statements about the five billing line items in Lesson 7.1.',
            'Chọn HAI phát biểu ĐÚNG về năm dòng hoá đơn ở bài 7.1.',
          ),
          options: [
            B('On a browser- or CDN-facing app on S3, egress is usually the largest single line — in the worked example it is $73.80 of an $82.26 bill', 'Với một ứng dụng phục vụ trình duyệt hoặc CDN chạy trên S3, egress thường là dòng lớn nhất — trong ví dụ đã tính thì nó là 73,80 $ trong hoá đơn 82,26 $'),
            B('Class A is priced at roughly ten times Class B on both providers, which is why a listing used where a HeadObject would do is the classic silent cost', 'Class A có giá cỡ mười lần Class B trên cả hai nhà cung cấp, và đó là lý do dùng một lượt liệt kê ở chỗ đáng lẽ chỉ cần HeadObject là khoản chi phí âm thầm kinh điển'),
            B('Infrastructure fees such as cross-region replication and VPC endpoint hours are always included in the storage rate and never appear separately', 'Các khoản phí hạ tầng như nhân bản chéo vùng hay giờ chạy VPC endpoint luôn được gộp vào đơn giá lưu trữ và không bao giờ hiện ra riêng'),
            B('Storage is the line that most often explains a sudden 3× jump in a monthly bill, which is why it should be the first thing checked after a spike', 'Lưu trữ là dòng hay giải thích nhất cho một cú nhảy gấp 3 lần đột ngột trên hoá đơn tháng, và vì thế nó nên là thứ đầu tiên cần kiểm sau một đợt tăng vọt'),
          ],
          correct: [0, 1],
          explanation: EX(
            'Both come straight from the lesson: the worked example puts 90% of an S3 bill in egress, and the rate table gives $4.50 against $0.36 on R2 and $5.00 against $0.40 on S3 — a factor of about twelve and a half, close enough to the lesson\'s "roughly ten times". Option D inverts the chapter\'s central advice: storage moves slowly and predictably, while Class A from a runaway listing or a mass regeneration is what actually triples a bill overnight, so it is the first place to look after a spike. Option C is the fifth line item denied — replication, KMS operations, VPC endpoint hours and log delivery are separate charges, and the lesson calls them "often invisible until enabled".',
            'Cả hai đều lấy thẳng từ bài học: ví dụ đã tính đặt 90% hoá đơn S3 vào egress, còn bảng đơn giá cho 4,50 $ so với 0,36 $ trên R2 và 5,00 $ so với 0,40 $ trên S3 — hệ số chừng mười hai lần rưỡi, đủ gần với chữ "cỡ mười lần" của bài học. Lựa chọn D lộn ngược lời khuyên trung tâm của chương: lưu trữ nhích chậm và đoán được, còn Class A từ một lượt liệt kê chạy loạn hay một đợt sinh lại hàng loạt mới là thứ thật sự nhân ba hoá đơn qua một đêm, nên đó mới là chỗ nhìn đầu tiên sau một đợt tăng vọt. Lựa chọn C là sự chối bỏ dòng thứ năm — nhân bản, thao tác KMS, giờ chạy VPC endpoint và việc giao log đều là những khoản riêng, và bài học gọi chúng là "thường vô hình cho tới khi được bật lên".',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Work out what a lifecycle configuration will actually do (chapter 6).</b> Reading a rule set and predicting its effect is the review step that catches the deletions nobody intended. Implement it.</p>' +
            '<ul>' +
            '<li><code>quyTacThang(quyTac, key)</code> — of all the rules that apply to <code>key</code>, return the one that decides it, or <code>null</code>. A rule applies when its <code>Status</code> is <code>&quot;Enabled&quot;</code>, it has a <code>Days</code> field, and the key <b>starts with</b> its <code>Prefix</code> (a plain string test — no path semantics). <b>Rules do not stack: the smallest Days wins.</b></li>' +
            '<li><code>xuLyObject(quyTac, o)</code> — with <code>o = { key, tuoi }</code> where <code>tuoi</code> is the age in days, return one line:<br>no rule → <code>&quot;&lt;key&gt; -&gt; GIU LAI&quot;</code>; age at or past the limit → <code>&quot;&lt;key&gt; -&gt; XOA (&lt;ID&gt;, &lt;Days&gt; ngay)&quot;</code>; otherwise <code>&quot;&lt;key&gt; -&gt; con &lt;N&gt; ngay (&lt;ID&gt;)&quot;</code> where N is the days remaining.</li>' +
            '<li><code>xuLyDangDo(quyTac, u)</code> — the same for an incomplete multipart upload, matched only against rules that carry <code>AbortDays</code>, with <code>&quot;-&gt; HUY (&lt;ID&gt;)&quot;</code> in place of XOA and the same <code>&quot;-&gt; con &lt;N&gt; ngay (&lt;ID&gt;)&quot;</code> otherwise. An upload is a different kind of thing from an object: an expiry rule must not touch it, and an abort rule must not touch an object.</li>' +
            '</ul>' +
            '<p>Three of the eight objects in the data exist to catch a specific mistake, and one of the rules is there because somebody forgot a trailing slash. Keep the given data and the printing loop exactly as they are.</p>',

            '<p><b>Câu 31 — Suy ra một bộ cấu hình lifecycle THẬT SỰ sẽ làm gì (chương 6).</b> Đọc một tập rule rồi đoán trước hiệu lực của nó chính là bước review bắt được những lượt xoá không ai định làm. Hãy cài đặt nó.</p>' +
            '<ul>' +
            '<li><code>quyTacThang(quyTac, key)</code> — trong tất cả các rule áp được vào <code>key</code>, trả về cái quyết định, hoặc <code>null</code>. Một rule áp được khi <code>Status</code> của nó là <code>&quot;Enabled&quot;</code>, nó có trường <code>Days</code>, và key <b>bắt đầu bằng</b> <code>Prefix</code> của nó (phép so chuỗi thuần — không có ngữ nghĩa đường dẫn). <b>Các rule không cộng dồn: Days nhỏ nhất thắng.</b></li>' +
            '<li><code>xuLyObject(quyTac, o)</code> — với <code>o = { key, tuoi }</code> trong đó <code>tuoi</code> là số ngày tuổi, trả về một dòng:<br>không rule nào → <code>&quot;&lt;key&gt; -&gt; GIU LAI&quot;</code>; tuổi bằng hoặc quá hạn → <code>&quot;&lt;key&gt; -&gt; XOA (&lt;ID&gt;, &lt;Days&gt; ngay)&quot;</code>; còn lại <code>&quot;&lt;key&gt; -&gt; con &lt;N&gt; ngay (&lt;ID&gt;)&quot;</code> với N là số ngày còn lại.</li>' +
            '<li><code>xuLyDangDo(quyTac, u)</code> — y như vậy cho một lượt multipart chưa hoàn tất, chỉ đối chiếu với những rule có <code>AbortDays</code>, dùng <code>&quot;-&gt; HUY (&lt;ID&gt;)&quot;</code> thay cho XOA và vẫn <code>&quot;-&gt; con &lt;N&gt; ngay (&lt;ID&gt;)&quot;</code> ở trường hợp còn lại. Một lượt tải lên là một loại thứ khác với một object: rule hết hạn không được đụng vào nó, và rule abort không được đụng vào một object.</li>' +
            '</ul>' +
            '<p>Ba trong tám object của phần dữ liệu có mặt để bắt một lỗi cụ thể, và một trong các rule nằm đó vì có người quên một dấu gạch chéo cuối. Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const QUY_TAC = [\n' +
            "  { ID: 'abort-mpu',  Status: 'Enabled',  Prefix: '',            AbortDays: 7 },\n" +
            "  { ID: 'bao-cao',    Status: 'Enabled',  Prefix: 'bao-cao/',    Days: 30 },\n" +
            "  { ID: 'thieu-gach', Status: 'Enabled',  Prefix: 'bao-cao',     Days: 90 },\n" +
            "  { ID: 'tmp',        Status: 'Enabled',  Prefix: 'tmp-24h/',    Days: 1 },\n" +
            "  { ID: 'logs-cu',    Status: 'Disabled', Prefix: 'logs/',       Days: 14 },\n" +
            "  { ID: 'dat-lai-mk', Status: 'Enabled',  Prefix: 'auth/reset/', Days: 1 },\n" +
            '];\n' +
            'const KHO = [\n' +
            "  { key: 'bao-cao/thang-5.csv',      tuoi: 45 },\n" +
            "  { key: 'bao-cao/hom-nay.csv',      tuoi: 2 },\n" +
            "  { key: 'bao-cao-nam/tong-hop.csv', tuoi: 500 },\n" +
            "  { key: 'bao-cao.csv',              tuoi: 100 },\n" +
            "  { key: 'tmp-24h/xem-truoc.png',    tuoi: 3 },\n" +
            "  { key: 'logs/2026-01.jsonl',       tuoi: 200 },\n" +
            "  { key: 'auth/reset/abc.pdf',       tuoi: 1 },\n" +
            "  { key: 'users/42/avatar.jpg',      tuoi: 900 },\n" +
            '];\n' +
            'const DANG_DO = [\n' +
            "  { key: 'users/42/phim.mp4', tuoi: 9 },\n" +
            "  { key: 'users/7/phim.mp4',  tuoi: 2 },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function quyTacThang(quyTac, key) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function xuLyObject(quyTac, o) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function xuLyDangDo(quyTac, u) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const o of KHO) console.log(xuLyObject(QUY_TAC, o));\n' +
            "for (const u of DANG_DO) console.log('[dang do] ' + xuLyDangDo(QUY_TAC, u));\n",
          expectedOutput:
            'bao-cao/thang-5.csv -> XOA (bao-cao, 30 ngay)\n' +
            'bao-cao/hom-nay.csv -> con 28 ngay (bao-cao)\n' +
            'bao-cao-nam/tong-hop.csv -> XOA (thieu-gach, 90 ngay)\n' +
            'bao-cao.csv -> XOA (thieu-gach, 90 ngay)\n' +
            'tmp-24h/xem-truoc.png -> XOA (tmp, 1 ngay)\n' +
            'logs/2026-01.jsonl -> GIU LAI\n' +
            'auth/reset/abc.pdf -> XOA (dat-lai-mk, 1 ngay)\n' +
            'users/42/avatar.jpg -> GIU LAI\n' +
            '[dang do] users/42/phim.mp4 -> HUY (abort-mpu)\n' +
            '[dang do] users/7/phim.mp4 -> con 5 ngay (abort-mpu)',
          sampleSolution:
            'function quyTacThang(quyTac, key) {\n' +
            '  const khop = quyTac.filter((r) =>\n' +
            "    r.Status === 'Enabled' && r.Days !== undefined && key.startsWith(r.Prefix));\n" +
            '  if (khop.length === 0) return null;\n' +
            '  // Không cộng dồn: hạn NGẮN NHẤT thắng, không phải rule khai trước.\n' +
            '  return khop.reduce((a, b) => (b.Days < a.Days ? b : a));\n' +
            '}\n\n' +
            'function xuLyObject(quyTac, o) {\n' +
            '  const r = quyTacThang(quyTac, o.key);\n' +
            "  if (!r) return o.key + ' -> GIU LAI';\n" +
            "  if (o.tuoi >= r.Days) return o.key + ' -> XOA (' + r.ID + ', ' + r.Days + ' ngay)';\n" +
            "  return o.key + ' -> con ' + (r.Days - o.tuoi) + ' ngay (' + r.ID + ')';\n" +
            '}\n\n' +
            'function xuLyDangDo(quyTac, u) {\n' +
            '  const r = quyTac.find((x) =>\n' +
            "    x.Status === 'Enabled' && x.AbortDays !== undefined && u.key.startsWith(x.Prefix));\n" +
            "  if (!r) return u.key + ' -> GIU LAI';\n" +
            "  if (u.tuoi >= r.AbortDays) return u.key + ' -> HUY (' + r.ID + ')';\n" +
            "  return u.key + ' -> con ' + (r.AbortDays - u.tuoi) + ' ngay (' + r.ID + ')';\n" +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Turn a usage record into a bill, and say which line is driving it (chapter 7).</b> "Which provider is cheaper" is not a property of the provider, it is a property of the workload. Compute it.</p>' +
            '<ul>' +
            '<li><code>hoaDon(gia, d)</code> — return <code>{ luuTru, classA, classB, egress, tong, chuDao }</code>. Storage is <code>gb × gia.luuTru</code>; the two operation lines are <b>per million</b>, so divide the counts by 1,000,000 first; egress is <code>egressGb × gia.egress</code>. Round the four line items and the total with the given <code>lam()</code>, but <b>compute <code>tong</code> from the unrounded values</b>. <code>chuDao</code> is the name of the largest line: <code>&quot;luuTru&quot;</code>, <code>&quot;classA&quot;</code>, <code>&quot;classB&quot;</code> or <code>&quot;egress&quot;</code> — on a tie, the one that comes first in that order.</li>' +
            '<li><code>soSanh(d)</code> — return <code>{ r2, s3, tiSo, khuyenNghi }</code>. <code>tiSo</code> is the S3 total divided by the R2 total, rounded, or <code>null</code> if the R2 total is 0. <code>khuyenNghi</code> is <code>&quot;R2&quot;</code> when <code>tiSo</code> is at least 1.3, otherwise <code>&quot;HOA&quot;</code> — because a difference under 30% does not justify a migration.</li>' +
            '<li><code>listTrongVongLap(soFile)</code> — the cost on R2 of answering "does this key exist" once per file, two ways: <code>{ list, head, lang }</code>, where <code>list</code> charges a Class A per file, <code>head</code> charges a Class B, and <code>lang</code> is how many times more the listing costs.</li>' +
            '</ul>' +
            '<p>The four workloads are chosen so the dominant line is different in each, and one of them is a case where the two providers are close enough that moving is not worth it. Keep the given data and the printing loop exactly as they are.</p>',

            '<p><b>Câu 32 — Biến một bản ghi sử dụng thành một hoá đơn, và nói xem dòng nào đang đẩy nó (chương 7).</b> "Nhà cung cấp nào rẻ hơn" không phải tính chất của nhà cung cấp, nó là tính chất của tải công việc. Hãy tính ra.</p>' +
            '<ul>' +
            '<li><code>hoaDon(gia, d)</code> — trả về <code>{ luuTru, classA, classB, egress, tong, chuDao }</code>. Lưu trữ là <code>gb × gia.luuTru</code>; hai dòng thao tác tính <b>theo triệu</b> nên chia số lượng cho 1.000.000 trước; egress là <code>egressGb × gia.egress</code>. Làm tròn bốn dòng và cả tổng bằng hàm <code>lam()</code> cho sẵn, nhưng <b>tính <code>tong</code> từ các giá trị CHƯA làm tròn</b>. <code>chuDao</code> là tên dòng lớn nhất: <code>&quot;luuTru&quot;</code>, <code>&quot;classA&quot;</code>, <code>&quot;classB&quot;</code> hoặc <code>&quot;egress&quot;</code> — bằng nhau thì lấy cái đứng trước trong thứ tự ấy.</li>' +
            '<li><code>soSanh(d)</code> — trả về <code>{ r2, s3, tiSo, khuyenNghi }</code>. <code>tiSo</code> là tổng của S3 chia tổng của R2, đã làm tròn, hoặc <code>null</code> nếu tổng R2 bằng 0. <code>khuyenNghi</code> là <code>&quot;R2&quot;</code> khi <code>tiSo</code> từ 1,3 trở lên, không thì <code>&quot;HOA&quot;</code> — vì chênh lệch dưới 30% không biện minh nổi cho một cuộc migration.</li>' +
            '<li><code>listTrongVongLap(soFile)</code> — chi phí trên R2 để trả lời "key này có tồn tại không" một lần cho mỗi file, theo hai cách: <code>{ list, head, lang }</code>, trong đó <code>list</code> tính một Class A mỗi file, <code>head</code> tính một Class B, và <code>lang</code> là lượt liệt kê đắt gấp mấy lần.</li>' +
            '</ul>' +
            '<p>Bốn tải công việc được chọn sao cho dòng chủ đạo mỗi cái một khác, và một trong số đó là ca mà hai nhà cung cấp gần nhau tới mức chuyển đi không đáng. Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const BANG_GIA = {\n' +
            '  R2: { luuTru: 0.015, classA: 4.50, classB: 0.36, egress: 0.00 },\n' +
            '  S3: { luuTru: 0.023, classA: 5.00, classB: 0.40, egress: 0.09 },\n' +
            '};\n' +
            'const CA = [\n' +
            "  { ten: 'app nho',   gb: 250,  classA: 45000,   classB: 6200000,   egressGb: 820 },\n" +
            "  { ten: 'kho anh',   gb: 1000, classA: 2800000, classB: 240000000, egressGb: 10000 },\n" +
            "  { ten: 'noi bo',    gb: 4000, classA: 120000,  classB: 900000,    egressGb: 0 },\n" +
            "  { ten: 'ghi nhieu', gb: 20,   classA: 9000000, classB: 50000,     egressGb: 5 },\n" +
            '];\n' +
            'const lam = (x) => Math.round(x * 100) / 100;\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function hoaDon(gia, d) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function soSanh(d) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function listTrongVongLap(soFile) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const d of CA) {\n' +
            '  const k = soSanh(d);\n' +
            "  console.log(d.ten + ' | R2 ' + k.r2.tong + ' (' + k.r2.chuDao + ')'\n" +
            "    + ' | S3 ' + k.s3.tong + ' (' + k.s3.chuDao + ')'\n" +
            "    + ' | ti so ' + k.tiSo + ' -> ' + k.khuyenNghi);\n" +
            '}\n' +
            'console.log(JSON.stringify(hoaDon(BANG_GIA.S3, CA[0])));\n' +
            'console.log(JSON.stringify(hoaDon(BANG_GIA.R2, CA[0])));\n' +
            'console.log(JSON.stringify(listTrongVongLap(50000)));\n',
          expectedOutput:
            'app nho | R2 6.18 (luuTru) | S3 82.26 (egress) | ti so 13.31 -> R2\n' +
            'kho anh | R2 114 (classB) | S3 1033 (egress) | ti so 9.06 -> R2\n' +
            'noi bo | R2 60.86 (luuTru) | S3 92.96 (luuTru) | ti so 1.53 -> R2\n' +
            'ghi nhieu | R2 40.82 (classA) | S3 45.93 (classA) | ti so 1.13 -> HOA\n' +
            '{"luuTru":5.75,"classA":0.22,"classB":2.48,"egress":73.8,"tong":82.26,"chuDao":"egress"}\n' +
            '{"luuTru":3.75,"classA":0.2,"classB":2.23,"egress":0,"tong":6.18,"chuDao":"luuTru"}\n' +
            '{"list":0.23,"head":0.02,"lang":12.5}',
          sampleSolution:
            'function hoaDon(gia, d) {\n' +
            '  const dong = {\n' +
            '    luuTru: d.gb * gia.luuTru,\n' +
            '    classA: (d.classA / 1e6) * gia.classA,\n' +
            '    classB: (d.classB / 1e6) * gia.classB,\n' +
            '    egress: d.egressGb * gia.egress,\n' +
            '  };\n' +
            '  // Tổng tính TRƯỚC khi làm tròn, nếu không bốn lần làm tròn sẽ trôi.\n' +
            '  const tong = dong.luuTru + dong.classA + dong.classB + dong.egress;\n' +
            "  let chuDao = 'luuTru';\n" +
            '  for (const k of Object.keys(dong)) if (dong[k] > dong[chuDao]) chuDao = k;\n' +
            '  return {\n' +
            '    luuTru: lam(dong.luuTru), classA: lam(dong.classA),\n' +
            '    classB: lam(dong.classB), egress: lam(dong.egress),\n' +
            '    tong: lam(tong), chuDao,\n' +
            '  };\n' +
            '}\n\n' +
            'function soSanh(d) {\n' +
            '  const r2 = hoaDon(BANG_GIA.R2, d);\n' +
            '  const s3 = hoaDon(BANG_GIA.S3, d);\n' +
            '  const tiSo = r2.tong === 0 ? null : lam(s3.tong / r2.tong);\n' +
            '  return {\n' +
            '    r2, s3, tiSo,\n' +
            "    khuyenNghi: tiSo !== null && tiSo >= 1.3 ? 'R2' : 'HOA',\n" +
            '  };\n' +
            '}\n\n' +
            'function listTrongVongLap(soFile) {\n' +
            '  const a = (soFile / 1e6) * BANG_GIA.R2.classA;   // LIST = Class A\n' +
            '  const b = (soFile / 1e6) * BANG_GIA.R2.classB;   // HEAD = Class B\n' +
            '  return { list: lam(a), head: lam(b), lang: lam(a / b) };\n' +
            '}\n',
        }),
      ],
    },
  ],
};
