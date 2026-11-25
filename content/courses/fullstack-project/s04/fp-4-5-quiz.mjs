/**
 * 4.5 — Kiểm tra Chương 4 (soạn 24/11/2026, agent fsp). BÀI THÊM (không có trong khung), slug mới fp-4-5-quiz.
 * 10 câu; đáp án dựa trên output chạy thật của bài 4.1–4.4 (Prisma 7.10.1, @aws-sdk 3.1176.0, MinIO RELEASE.2026-11-16, sharp 0.35.5).
 * Phân bố đáp án: A3 B2 C2 D3.
 */
export default {
  title: '4.5 — Chapter 4 quiz|||4.5 — Kiểm tra Chương 4',
  slug: 'fp-4-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: bản sửa bài ngây thơ (IDOR), 404 hay 403 với bài nháp, mass assignment, id sai kiểu thành 500, SDK không ký Content-Type, chữ ký không kiểm byte, tệp lai và bom giải nén, EXIF/GPS, thứ tự xoá dòng và ảnh, phép kiểm không thể trượt.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations taken from what actually happened while building ChiaSe's posts and images. Read every explanation, including for the questions you got right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can show, with two users, why ownership must be checked on every object access.</li>
<li>I can draw the upload flow: ticket → PUT to storage → attach → gate → public.</li>
<li>I can read <code>X-Amz-SignedHeaders</code> and say what a presigned URL enforces.</li>
<li>I can explain what my image gate removes from a phone photo, and why.</li>
<li>My Checkpoint 4 passes 23/23 on a clean clone.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ chính những gì đã xảy ra khi dựng phần bài viết và ảnh của ChiaSe. Đọc mọi phần giải thích, kể cả câu bạn làm đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chỉ ra được, bằng hai người dùng, vì sao phải kiểm quyền sở hữu ở mọi lần truy cập đối tượng.</li>
<li>Tôi vẽ được luồng tải ảnh: vé → PUT lên kho → gắn bài → cánh cổng → công khai.</li>
<li>Tôi đọc được <code>X-Amz-SignedHeaders</code> và nói được presigned URL ép những gì.</li>
<li>Tôi giải thích được cánh cổng ảnh của mình xoá gì khỏi một tấm ảnh điện thoại, và vì sao.</li>
<li>Checkpoint 4 của tôi đạt 23/23 trên bản clone sạch.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'The first version of suaBai was prisma.post.update({ where: { id }, data }), behind requireAuth. Bình (logged in) sends PATCH to An\'s published post. What happened?|||Bản đầu của suaBai là prisma.post.update({ where: { id }, data }), đứng sau requireAuth. Bình (đã đăng nhập) gửi PATCH vào bài đã đăng của An. Chuyện gì xảy ra?',
        options: [
          '401 — requireAuth refuses users who are not the author|||401 — requireAuth từ chối người không phải tác giả',
          '200 — An\'s post now contains Bình\'s text (IDOR: authenticated, but nobody checked ownership)|||200 — bài của An giờ mang nội dung Bình viết (IDOR: đã xác thực, nhưng không ai kiểm quyền sở hữu)',
          '403 — Prisma checks the author automatically|||403 — Prisma tự kiểm tác giả',
          '404 — the post is hidden from Bình|||404 — bài bị ẩn với Bình',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Measured: 200. requireAuth only answers "who are you". Ownership must be checked for every object — ChiaSe puts it in the write itself: where { id, authorId }.|||VI: Đã đo: 200. requireAuth chỉ trả lời "bạn là ai". Quyền sở hữu phải được kiểm cho từng đối tượng — ChiaSe đặt nó ngay trong câu ghi: where { id, authorId }.',
      },
      {
        question: 'Bình requests An\'s DRAFT (GET and PATCH). Why does ChiaSe answer 404 instead of 403?|||Bình gọi bài NHÁP của An (GET và PATCH). Vì sao ChiaSe trả 404 thay vì 403?',
        options: [
          'Because 403 is only for admins|||Vì 403 chỉ dành cho quản trị viên',
          'Because Prisma returns P2025|||Vì Prisma trả P2025',
          'It is a bug; it should be 403|||Đó là bug; đúng ra phải là 403',
          'A 403 would confirm that a private post with this id exists; for published posts existence is public, so 403 is used there|||403 sẽ xác nhận có một bài riêng tư mang id này; với bài đã đăng, sự tồn tại vốn công khai nên ở đó dùng 403',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Status codes leak information. Drafts are invisible (404) to everyone but the author; published posts are visible, so a write by someone else is honestly 403.|||VI: Mã trạng thái cũng làm lộ thông tin. Bài nháp vô hình (404) với mọi người trừ tác giả; bài đã đăng thì ai cũng thấy, nên người khác sửa thì trả lời thật là 403.',
      },
      {
        question: 'POST /api/posts with body {"title":"…","body":"…","authorId":"<someone else>"}. What does ChiaSe do, and why?|||POST /api/posts với body {"title":"…","body":"…","authorId":"<người khác>"}. ChiaSe làm gì, và vì sao?',
        options: [
          '400 DU_LIEU_SAI — z.strictObject refuses unknown keys; the author always comes from the token (no mass assignment)|||400 DU_LIEU_SAI — z.strictObject từ chối khoá lạ; tác giả luôn lấy từ token (chặn mass assignment)',
          '201, the post is created under the other user\'s name|||201, bài được tạo dưới tên người kia',
          '201, authorId is silently ignored|||201, authorId bị lặng lẽ bỏ qua',
          '403, because the token belongs to someone else|||403, vì token thuộc về người khác',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Measured: 400 "Unrecognized key: authorId". A plain z.object would silently drop it (also safe); strict makes frontend bugs visible. Passing req.body straight to prisma.create would have been the vulnerability.|||VI: Đã đo: 400 "Unrecognized key: authorId". z.object thường sẽ lặng lẽ bỏ trường đó (cũng an toàn); strict làm bug frontend lộ ra. Đưa thẳng req.body vào prisma.create mới là lỗ hổng.',
      },
      {
        question: 'Before validateIdParam existed, GET /api/posts/abc returned…|||Trước khi có validateIdParam, GET /api/posts/abc trả về…',
        options: [
          '404, because no post has id "abc"|||404, vì không bài nào có id "abc"',
          '400 from Zod|||400 từ Zod',
          '500 — PostgreSQL refused "abc" for a uuid column (Prisma P2007) and the error middleware turned the unknown error into 500|||500 — PostgreSQL từ chối "abc" cho cột uuid (Prisma P2007) và middleware lỗi biến lỗi lạ thành 500',
          '200 with an empty object|||200 với một đối tượng rỗng',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Measured: 500, with "invalid input syntax for type uuid" in the log. A typed URL must never produce a 500; validate parameters before querying.|||VI: Đã đo: 500, log có "invalid input syntax for type uuid". URL gõ tay không bao giờ được sinh ra 500; kiểm tham số trước khi truy vấn.',
      },
      {
        question: 'You presign a PUT with PutObjectCommand({ ContentType: "image/jpeg", ContentLength }) using AWS SDK v3 defaults. What does X-Amz-SignedHeaders contain, and what follows?|||Bạn ký PUT bằng PutObjectCommand({ ContentType: "image/jpeg", ContentLength }) với mặc định của AWS SDK v3. X-Amz-SignedHeaders chứa gì, và hệ quả là gì?',
        options: [
          'content-type;host — a different size is accepted|||content-type;host — khác kích thước vẫn được nhận',
          'content-length;content-type;host — everything is enforced|||content-length;content-type;host — mọi thứ đều bị ép',
          'Only host — nothing is enforced|||Chỉ host — không ép gì cả',
          'content-length;host — a different Content-Type (even text/html) is accepted and stored as sent; you need signableHeaders|||content-length;host — Content-Type khác (kể cả text/html) vẫn được nhận và lưu y như gửi; cần signableHeaders',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Measured with SDK 3.1176.0: content-length;host. HTML sent as text/html → 200, and the storage kept ContentType = text/html. With signableHeaders including content-type, a different type gives 403 SignatureDoesNotMatch. Always read the URL, not only the docs.|||VI: Đo với SDK 3.1176.0: content-length;host. HTML gửi dạng text/html → 200, và kho lưu ContentType = text/html. Có signableHeaders gồm content-type thì khác loại ra 403 SignatureDoesNotMatch. Luôn đọc chính URL, không chỉ đọc tài liệu.',
      },
      {
        question: 'Content-Type IS signed as image/jpeg. An attacker uploads HTML bytes and sends the header "content-type: image/jpeg". What does the storage do?|||Content-Type ĐÃ được ký là image/jpeg. Kẻ tấn công tải lên byte HTML và gửi header "content-type: image/jpeg". Kho làm gì?',
        options: [
          'Accepts it (200): a signature checks the header equals what was declared, not what the bytes are — so the API must inspect the bytes before publishing|||Nhận (200): chữ ký kiểm header bằng giá trị đã khai, không kiểm byte thật là gì — nên API phải soi byte trước khi công khai',
          'Rejects it with 403, because the bytes are not a JPEG|||Từ chối 403, vì byte không phải JPEG',
          'Converts it to a JPEG|||Chuyển nó thành JPEG',
          'Deletes the bucket|||Xoá bucket',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Measured: 200. That is why uploads land in a private tmp/ area and duyetAnh checks magic bytes and decodes the image for real; Checkpoint 4 asserts this file is refused with ANH_SAI_DINH_DANG.|||VI: Đã đo: 200. Vì thế ảnh rơi vào vùng riêng tư tmp/ và duyetAnh kiểm magic bytes rồi giải mã thật; Checkpoint 4 khẳng định tệp này bị từ chối với ANH_SAI_DINH_DANG.',
      },
      {
        question: 'A file starts with FF D8 FF E0 and then contains <html><script>…. Which step of duyetAnh stops it?|||Một tệp mở đầu bằng FF D8 FF E0 rồi chứa <html><script>…. Bước nào của duyetAnh chặn nó?',
        options: [
          'The magic-bytes check|||Bước kiểm magic bytes',
          'The real decode by sharp/libvips — it passes the magic bytes but contains no JPEG image data (ANH_HONG)|||Bước giải mã thật bằng sharp/libvips — nó qua được magic bytes nhưng không có dữ liệu ảnh JPEG (ANH_HONG)',
          'The HEAD request|||Request HEAD',
          'Nothing; it is published|||Không bước nào; nó được công khai',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: A hybrid file defeats a header-only check. Decoding and re-encoding is the real proof. Note the fix in 4.3: the response says "Tệp không phải ảnh đọc được" — the libvips message stays in the server log.|||VI: Tệp lai đánh bại phép kiểm chỉ nhìn phần đầu. Giải mã và mã hoá lại mới là bằng chứng thật. Nhớ bản sửa ở 4.3: response chỉ nói "Tệp không phải ảnh đọc được" — thông báo của libvips nằm lại trong log máy chủ.',
      },
      {
        question: 'Which 10000×10000 test file was the real decompression bomb in our measurement (no pixel limit)?|||Trong phép đo của ta (không giới hạn điểm ảnh), tệp thử 10000×10000 nào là quả bom giải nén thật?',
        options: [
          'The plain PNG: 32 KB ⇒ 4 GB of RAM|||PNG thường: 32 KB ⇒ 4 GB RAM',
          'The JPEG with Orientation=6: it had to be rotated in memory, 2 GB|||JPEG có Orientation=6: phải xoay trong bộ nhớ, 2 GB',
          'The interlaced PNG: 45,584 bytes ⇒ 203 MB peak and 1.27 s, because it cannot be decoded line by line|||PNG xen kẽ: 45.584 byte ⇒ đỉnh 203 MB và 1,27 s, vì không giải mã được từng dòng',
          'None — libvips used under 20 MB for all three|||Không tệp nào — libvips dùng dưới 20 MB cho cả ba',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Plain PNG ≈112 MB peak/0.36 s and JPEG ≈103 MB/0.25 s (streamed); the interlaced PNG ≈203 MB/1.27 s. Twenty at once would exceed a 2 GB VPS. ChiaSe sets limitInputPixels to 40 million.|||VI: PNG thường ≈ đỉnh 112 MB/0,36 s và JPEG ≈103 MB/0,25 s (xử lý theo luồng); PNG xen kẽ ≈203 MB/1,27 s. Hai mươi tệp cùng lúc sẽ vượt một VPS 2 GB. ChiaSe đặt limitInputPixels 40 triệu.',
      },
      {
        question: 'Deleting a post: why does ChiaSe delete the database row FIRST and the image SECOND?|||Xoá bài: vì sao ChiaSe xoá dòng CSDL TRƯỚC và xoá ảnh SAU?',
        options: [
          'If the storage fails, the worst case is an unused file (logged as ANH_CAN_DON and removed by kho:don); the other order could leave a post pointing at a missing image|||Nếu kho lỗi, tệ nhất là một tệp thừa (log ANH_CAN_DON và kho:don dọn); thứ tự ngược lại có thể để bài trỏ vào ảnh đã mất',
          'Because Prisma cannot delete rows that have images|||Vì Prisma không xoá được dòng có ảnh',
          'Because the storage is faster than the database|||Vì kho nhanh hơn CSDL',
          'Order does not matter|||Thứ tự không quan trọng',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Measured with MinIO stopped: 204 in 57 ms, post gone, one ANH_CAN_DON line in the log (code ECONNREFUSED), and kho:don --cu-hon=0 --xoa removed the orphan.|||VI: Đo khi tắt MinIO: 204 sau 57 ms, bài đã mất, một dòng ANH_CAN_DON trong log (mã ECONNREFUSED), và kho:don --cu-hon=0 --xoa đã dọn ảnh mồ côi.',
      },
      {
        question: 'The first version of Checkpoint 4 verified "tmp/ original deleted" by an anonymous GET expecting "not 200". What was wrong?|||Bản đầu của Checkpoint 4 kiểm "bản gốc tmp/ đã xoá" bằng một GET ẩn danh, chờ "không phải 200". Sai ở đâu?',
        options: [
          'Nothing; it is correct|||Không sai gì',
          'Anonymous GET is too slow|||GET ẩn danh quá chậm',
          'It should expect 200|||Đúng ra phải chờ 200',
          'tmp/ is private, so an anonymous read returns 403 whether the file exists or not — the check could never fail; it now uses an authenticated HEAD and requires NotFound|||tmp/ là riêng tư nên đọc ẩn danh trả 403 dù tệp còn hay mất — phép kiểm không bao giờ trượt; giờ nó dùng HEAD có khoá và đòi NotFound',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: A vacuous check is worse than none — it gives false confidence. Break the code once on purpose and watch every new check turn red.|||VI: Phép kiểm rỗng còn tệ hơn không có — nó cho cảm giác yên tâm giả. Cố ý làm hỏng mã một lần và nhìn mọi phép kiểm mới chuyển đỏ.',
      },
    ],
  },
};
