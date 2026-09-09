/**
 * Object Storage — Final Exam (FE): 50 câu trắc nghiệm phủ cả 11 chương (s00–s10).
 *
 * Đề tự soạn, bám sát `content/courses/object-storage/s00…s10`. Có cả câu lý
 * thuyết lẫn câu đọc transcript; MỌI đoạn output, mã lỗi, header HTTP và ETag
 * trong đề đều CHẠY THẬT trên một MinIO cục bộ dựng bằng Docker:
 *
 *   MinIO           RELEASE.2025-09-07T16-13-09Z (go1.24.6, linux/arm64)
 *   @aws-sdk/client-s3            3.1071.0
 *   @aws-sdk/s3-request-presigner 3.1071.0
 *   Node v22.21.0, darwin-arm64, Docker Engine 29.5.3
 *   docker run -d -p 19000:9000 minio/minio server /data
 *
 * ⛔ KHÔNG chạm tới bucket R2 thật của dự án — không đọc, không ghi, không dùng
 * khoá trong `.env`. Container MinIO đã `docker rm -f` sau khi đo xong.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️ BỐN CHỖ MÁY KHÁC GIÁO TRÌNH, đã đo lại và ĐỀ THEO MÁY
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  • Giáo trình (3.3) nói "R2 max là 7 ngày" cho TTL của signed URL, như thể đó
 *    là giới hạn của R2. Đo thật: `getSignedUrl(..., { expiresIn: 8*24*3600 })`
 *    NÉM NGAY TẠI CHỖ, trước khi có một byte nào ra mạng —
 *    `Signature version 4 presigned URLs must have an expiration date less than
 *    one week in the future`. Đó là giới hạn của SigV4 / của chính SDK, không
 *    phải của R2; nó xảy ra y hệt khi đích là MinIO. Câu 18 hỏi theo MÁY.
 *
 *  • Giáo trình (1.2, 9.1) dạy "đọc khối XML để biết Code". Đúng với GET
 *    (`<Error><Code>NoSuchKey</Code>…`) nhưng SAI với HEAD: một phản hồi HEAD
 *    KHÔNG CÓ THÂN, nên SDK không có gì để phân giải. Đo thật trên
 *    `HeadObjectCommand` với key không tồn tại: `err.name === 'NotFound'`,
 *    `err.Code === undefined`, `err.message === 'UnknownError'`, HTTP 404.
 *    Câu 5 hỏi đúng cái khác biệt đó.
 *
 *  • Giáo trình (5.2) in một phản hồi preflight `HTTP/1.1 200 OK` kèm
 *    `Access-Control-Max-Age: 3600` và `Access-Control-Expose-Headers: ETag`.
 *    MinIO trả **204 No Content** và KHÔNG có hai header đó (nó cũng không thi
 *    hành CORS policy của bucket — `GetBucketCors` trả 501 NotImplemented).
 *    Nên đề KHÔNG hỏi giá trị header của R2/S3 như thể đã đo; câu 26 dùng đúng
 *    transcript MinIO đo được và hỏi cái transcript ấy CHỨNG MINH được gì.
 *
 *  • Giáo trình (6.1) cho một lifecycle rule chỉ có `AbortIncompleteMultipartUpload`
 *    với `Filter: { "Prefix": "" }`. MinIO TỪ CHỐI dạng đó —
 *    `InvalidArgument: The XML you provided was not well-formed or did not
 *    validate against our published schema` — và chỉ nhận khi rule đi kèm một
 *    `Expiration`. Theo tài liệu AWS/Cloudflare thì rule chỉ-abort là hợp lệ,
 *    nên đề CHỈ hỏi CƠ CHẾ của rule abort (câu 31, 34), không hỏi khối JSON nào
 *    được máy chủ nhận.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️ NHỮNG CHỖ CHỈ DỰA VÀO TÀI LIỆU, CHƯA ĐO ĐƯỢC
 * ─────────────────────────────────────────────────────────────────────────────
 * MinIO không phải R2. Những điều sau lấy từ giáo trình + tài liệu Cloudflare/
 * AWS và đề trình bày chúng như KIẾN THỨC, không như phép đo:
 *   – giá tiền và tỷ lệ R2 vs S3 (câu 13, 36, 38): bảng giá công bố, không đo;
 *     đề chỉ hỏi CƠ CHẾ và số học trên chính bảng giá đề đưa ra.
 *   – R2 bỏ qua âm thầm storage class / SSE-KMS / requester-pays (câu 11).
 *   – trần 100 MB của proxy Cloudflare (câu 23).
 *   – Super Slurper, Sippy, throughput migration (câu 41–45).
 *   – nhịp quét lifecycle 24–48 giờ của R2 (câu 34).
 *   – cap MaxAgeSeconds theo từng trình duyệt (câu 26 KHÔNG hỏi con số này).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Phân bố câu theo chương:
 *   Mục 0 — object storage là gì            3 câu   (q1–q3)
 *   Chương 1 — S3 API                       6 câu   (q4–q9)
 *   Chương 2 — R2 specifics                 4 câu   (q10–q13)
 *   Chương 3 — URL và access                5 câu   (q14–q18)
 *   Chương 4 — presigned upload security    6 câu   (q19–q24)
 *   Chương 5 — CORS                         6 câu   (q25–q30)
 *   Chương 6 — lifecycle và cleanup         5 câu   (q31–q35)
 *   Chương 7 — quản lý chi phí              5 câu   (q36–q40)
 *   Chương 8 — migration S3 → R2            5 câu   (q41–q45)
 *   Chương 9 — sách công thức chẩn đoán     4 câu   (q46–q49)
 *   Chương 10 — cái sống qua đo lường       1 câu   (q50)
 *                                          ─────
 *                                          50 câu
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 12 · B 13 · C 13 · D 12.
 *   node -e "import('./content/exams/OBJECT-STORAGE-FE.mjs').then(m=>{const d={};m.default.exams[0].questions.forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/OBJECT-STORAGE-FE.mjs --apply
 */
import { B, EX, code, c, mcq } from './_lib/objectstorage-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all eleven chapters, from "a slash in a key is just a character" to "a claim without its conditions is how bad advice is born". Many questions show a real terminal transcript or a real XML error body and ask you to explain it; every one of those outputs came from actually running the command against a live S3-compatible server, so read the transcript rather than the intuition.</p>' +
  '<p>Four habits pay off here. First, separate the <em>status code</em> from the <em>Code inside the XML body</em>: a 403 is six different problems, and only the body tells you which. Second, remember what a signature actually binds — <code>X-Amz-SignedHeaders</code> is the whole security story of a presigned upload. Third, read an ETag carefully: a dash and a number after the hash means the object was assembled from parts, and it is no longer an MD5 of anything you can compute in one pass. Fourth, when a question gives you numbers, do the arithmetic; several answers turn on which of the five billing line items dominates.</p>' +
  '<p>You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả mười một chương, từ "dấu gạch chéo trong một key chỉ là một ký tự" tới "một khẳng định tách khỏi điều kiện của nó chính là cách lời khuyên tồi ra đời". Nhiều câu cho sẵn một đoạn terminal thật hoặc một khối XML lỗi thật rồi hỏi bạn giải thích nó; mọi đoạn output loại đó đều lấy từ việc chạy thật câu lệnh lên một máy chủ S3-compatible đang sống, nên hãy đọc đoạn transcript thay vì đoán theo cảm tính.</p>' +
  '<p>Bốn thói quen giúp ích ở đây. Một, tách bạch <em>mã trạng thái</em> với <em>trường Code nằm trong khối XML</em>: một cái 403 là sáu vấn đề khác nhau, và chỉ khối thân mới nói cho bạn biết là cái nào. Hai, nhớ rằng một chữ ký thật sự RÀNG BUỘC những gì — <code>X-Amz-SignedHeaders</code> là toàn bộ câu chuyện bảo mật của một lượt tải lên đã ký sẵn. Ba, hãy đọc ETag cho kỹ: một dấu gạch ngang cộng một con số ở sau phần băm nghĩa là object được ghép lại từ nhiều phần, và nó không còn là MD5 của bất cứ thứ gì bạn tính được trong một lượt. Bốn, khi một câu đưa cho bạn các con số thì hãy làm phép tính; vài đáp án ăn thua ở chỗ dòng nào trong năm dòng của hoá đơn chiếm chủ đạo.</p>' +
  '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'object-storage' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 4,
      title: B(
        'Final Exam — the whole Object Storage course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá Object Storage (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all eleven chapters: what object storage actually is, the four core S3 operations and multipart uploads, what makes R2 different from S3, the three kinds of URL, the SigV4 signableHeaders vulnerability, CORS and preflight, lifecycle rules and orphan reconciliation, the five things a storage bill is made of, migrating a bucket without downtime, a diagnosis cookbook for 403s and latency spikes, and how to carry a measured number without losing its conditions.',
        'Năm mươi câu trắc nghiệm phủ cả mười một chương: object storage thật sự là gì, bốn thao tác cốt lõi của S3 và multipart upload, R2 khác S3 ở chỗ nào, ba loại URL, lỗ hổng signableHeaders của SigV4, CORS và preflight, lifecycle rule và việc đối soát object mồ côi, năm thứ làm nên một hoá đơn lưu trữ, migrate một bucket mà không có downtime, sách công thức chẩn đoán 403 và spike độ trễ, và cách mang một con số đã đo mà không đánh rơi điều kiện của nó.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [

        /* ── Mục 0 — object storage thật sự là gì (3 câu) ─────────────── */

        // q1 · đáp án 2
        mcq({
          prompt: B(
            'A bucket holds <code>users/42/a.jpg</code>. You want it to become <code>users/2026/a.jpg</code>. This transcript is what really happened:' +
            code('$ node doi-ten.mjs\n' +
              'CopyObject  Bucket=de-thi Key=users/2026/a.jpg CopySource=/de-thi/users/42/a.jpg\n' +
              'DeleteObject Bucket=de-thi Key=users/42/a.jpg\n' +
              '\n' +
              'ListObjectsV2 Prefix=users/\n' +
              '  users/2026/a.jpg\n' +
              '  users/42/anh.jpg\n' +
              '  users/42/b.jpg\n' +
              '  users/7/c.jpg') +
            'What does this show about renaming in object storage?',

            'Một bucket đang giữ <code>users/42/a.jpg</code>. Bạn muốn nó thành <code>users/2026/a.jpg</code>. Đây là đoạn ghi lại việc thật sự đã xảy ra:' +
            code('$ node doi-ten.mjs\n' +
              'CopyObject  Bucket=de-thi Key=users/2026/a.jpg CopySource=/de-thi/users/42/a.jpg\n' +
              'DeleteObject Bucket=de-thi Key=users/42/a.jpg\n' +
              '\n' +
              'ListObjectsV2 Prefix=users/\n' +
              '  users/2026/a.jpg\n' +
              '  users/42/anh.jpg\n' +
              '  users/42/b.jpg\n' +
              '  users/7/c.jpg') +
            'Đoạn này cho thấy điều gì về việc đổi tên trong object storage?',
          ),
          options: [
            B(
              'The copy moved one object and the service rewrote every other key under <code>users/42/</code> to keep the tree consistent, which is why the two remaining files stayed where they were rather than following the rename',
              'Phép copy đã dời một object và dịch vụ tự viết lại mọi key còn lại dưới <code>users/42/</code> để giữ cây nhất quán, và đó là lý do hai file còn lại đứng nguyên chỗ cũ thay vì đi theo lượt đổi tên',
            ),
            B(
              'A rename is a metadata-only operation on the key string, so it costs nothing and no bytes move; the copy in the transcript is an unnecessary extra step the SDK inserted for durability',
              'Đổi tên là một thao tác chỉ đụng siêu dữ liệu trên chuỗi key, nên nó không tốn gì và không byte nào di chuyển; phép copy trong đoạn ghi là một bước thừa mà SDK chèn vào cho chắc chắn',
            ),
            B(
              'There is no rename: the only way is to COPY the object to the new key and DELETE the old one, per object, because <code>users/42/</code> is not an entity — it is just a shared prefix of some key strings',
              'Không có phép đổi tên nào cả: cách duy nhất là COPY object sang key mới rồi DELETE key cũ, cho từng object một, vì <code>users/42/</code> không phải một thực thể — nó chỉ là phần tiền tố dùng chung của vài chuỗi key',
            ),
            B(
              'Renaming works but only within one prefix level; moving between two different second-level prefixes requires the copy-then-delete pair shown, while a rename inside the same folder is a single API call',
              'Đổi tên có hoạt động nhưng chỉ trong một tầng tiền tố; di chuyển giữa hai tiền tố tầng hai khác nhau mới cần cặp copy-rồi-delete như trên, còn đổi tên trong cùng một thư mục thì chỉ là một lời gọi API',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the first and deepest difference between object storage and a filesystem. There is no directory entity anywhere: <code>users/42/a.jpg</code> is one flat string, and the <code>/</code> characters inside it carry no more meaning to the service than a hyphen would. Nothing named <code>users/42/</code> exists to be renamed. So the "rename" you want is spelled COPY-then-DELETE, once per matching object, and the transcript proves it — after moving one object the other three keys under the same visual "folder" are untouched, because they were never children of anything. Two consequences follow immediately. Moving a million objects is two million billed operations, not one. And a "folder rename" is not atomic: between the copy and the delete, both keys exist, and if the process dies in between you are left with a duplicate. Option 1 invents a consistency mechanism the service does not have. Option 2 gets the cost model exactly backwards — ' + c('CopyObject') + ' is a Class A write that moves the full object bytes server-side. Option 4 invents a level-based distinction that no S3 API has.',
            'Đây là khác biệt đầu tiên và sâu nhất giữa object storage và một hệ thống file. Không có thực thể thư mục nào tồn tại ở đâu cả: <code>users/42/a.jpg</code> là MỘT chuỗi phẳng, và các ký tự <code>/</code> bên trong nó không mang thêm ý nghĩa nào với dịch vụ hơn một dấu gạch ngang. Chẳng có thứ nào tên <code>users/42/</code> tồn tại để mà đổi tên. Vậy nên cái "đổi tên" bạn muốn được đánh vần là COPY-rồi-DELETE, mỗi object một lần, và đoạn ghi chứng minh điều đó — sau khi dời một object thì ba key còn lại dưới cùng một "thư mục" nhìn-thấy-được vẫn nguyên vẹn, vì chúng chưa bao giờ là con của cái gì. Hai hệ quả theo ngay sau đó. Dời một triệu object là hai triệu thao tác bị tính tiền, không phải một. Và một lượt "đổi tên thư mục" thì KHÔNG nguyên tử: giữa lúc copy và lúc delete, cả hai key cùng tồn tại, và nếu tiến trình chết ở khoảng giữa thì bạn còn lại một bản trùng. Phương án 1 bịa ra một cơ chế nhất quán mà dịch vụ không có. Phương án 2 hiểu ngược hẳn mô hình chi phí — ' + c('CopyObject') + ' là một phép ghi Class A và nó chuyển trọn các byte của object ở phía máy chủ. Phương án 4 bịa ra một phân biệt theo tầng mà không API S3 nào có.',
          ),
        }),

        // q2 · đáp án 0
        mcq({
          prompt: B(
            'A bucket contains <code>users/42/a.jpg</code>, <code>users/42/b.jpg</code>, <code>users/7/c.jpg</code> and <code>users-cu/d.jpg</code>. Three real calls:' +
            code('ListObjectsV2 Prefix="users/" Delimiter="/"\n' +
              '  Contents:       []\n' +
              '  CommonPrefixes: [ "users/42/", "users/7/" ]\n' +
              '\n' +
              'ListObjectsV2 Prefix="users"\n' +
              '  users-cu/d.jpg\n' +
              '  users/42/a.jpg\n' +
              '  users/42/b.jpg\n' +
              '  users/7/c.jpg\n' +
              '\n' +
              'HeadObject Key="users/42/"\n' +
              '  --> NotFound (HTTP 404)') +
            'Which reading of these three results is correct?',

            'Một bucket chứa <code>users/42/a.jpg</code>, <code>users/42/b.jpg</code>, <code>users/7/c.jpg</code> và <code>users-cu/d.jpg</code>. Ba lời gọi thật:' +
            code('ListObjectsV2 Prefix="users/" Delimiter="/"\n' +
              '  Contents:       []\n' +
              '  CommonPrefixes: [ "users/42/", "users/7/" ]\n' +
              '\n' +
              'ListObjectsV2 Prefix="users"\n' +
              '  users-cu/d.jpg\n' +
              '  users/42/a.jpg\n' +
              '  users/42/b.jpg\n' +
              '  users/7/c.jpg\n' +
              '\n' +
              'HeadObject Key="users/42/"\n' +
              '  --> NotFound (HTTP 404)') +
            'Cách đọc nào cho ba kết quả này là đúng?',
          ),
          options: [
            B(
              '<code>CommonPrefixes</code> is computed on the fly by grouping matching keys at the delimiter, so the folder-like listing is a presentation trick; <code>Prefix</code> is a plain string match, which is why the missing slash swept in <code>users-cu/</code>; and <code>HeadObject</code> 404s because no object with that exact key exists',
              '<code>CommonPrefixes</code> được tính tại chỗ bằng cách gom các key khớp ở chỗ dấu phân cách, nên danh sách trông-như-thư-mục chỉ là một mẹo trình bày; <code>Prefix</code> là phép so chuỗi thuần, nên thiếu dấu gạch chéo là quét luôn cả <code>users-cu/</code>; còn <code>HeadObject</code> trả 404 vì không có object nào mang đúng key đó',
            ),
            B(
              'The delimiter listing returns empty <code>Contents</code> because the two subfolders must be listed before their files become visible; a second call with <code>Prefix="users/42/"</code> would then return the objects, which is how a directory walk is meant to work',
              'Lượt liệt kê có delimiter trả <code>Contents</code> rỗng vì hai thư mục con phải được liệt kê trước thì file bên trong mới hiện ra; một lời gọi thứ hai với <code>Prefix="users/42/"</code> khi đó mới trả về các object, và đó là cách một lượt duyệt thư mục vốn phải hoạt động',
            ),
            B(
              '<code>users-cu/d.jpg</code> appearing in the second listing is a bug in the pagination layer: the server matched on the normalised form of the prefix, and the correct behaviour would have been to return only the three keys under <code>users/</code>',
              'Việc <code>users-cu/d.jpg</code> lọt vào lượt liệt kê thứ hai là một lỗi ở tầng phân trang: máy chủ đã so khớp trên dạng chuẩn hoá của tiền tố, còn hành vi đúng lẽ ra phải là chỉ trả về ba key nằm dưới <code>users/</code>',
            ),
            B(
              'The 404 on <code>HeadObject Key="users/42/"</code> means the two objects under it were deleted between the listing and the head call; a directory that still has children always answers a head request with its child count',
              'Cái 404 ở <code>HeadObject Key="users/42/"</code> nghĩa là hai object bên dưới nó đã bị xoá trong khoảng giữa lượt liệt kê và lời gọi head; một thư mục còn con thì luôn trả lời một request head bằng số lượng con của nó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Three measurements, one lesson: the folder is an illusion the client draws, and the server never had one. <b>Delimiter</b> asks the server to roll up everything after the next occurrence of that character into a synthetic group; <code>Contents</code> comes back empty precisely because no key sits <em>directly</em> under <code>users/</code> — every one of them has another slash further along, so all of them rolled up. <b>Prefix</b> is byte-for-byte string matching with no path semantics at all, which is why <code>"users"</code> without the trailing slash also matched <code>users-cu/d.jpg</code>; this is exactly the shape that makes a lifecycle rule delete more than its author intended. <b>HeadObject</b> on <code>users/42/</code> 404s because that string is not a key any object was stored under; there is nothing there to describe. Option 2 describes a filesystem walk that the API does not implement — one listing with no delimiter returns every descendant at once. Option 3 calls the correct, documented behaviour a bug. Option 4 invents a directory object that the transcript itself disproves, since the two children are still listed.',
            'Ba phép đo, một bài học: cái thư mục là ảo giác do phía client vẽ ra, còn máy chủ thì chưa bao giờ có cái nào. <b>Delimiter</b> bảo máy chủ gom mọi thứ nằm sau lần xuất hiện kế tiếp của ký tự đó thành một nhóm nhân tạo; <code>Contents</code> trở về rỗng chính vì không key nào nằm TRỰC TIẾP dưới <code>users/</code> — key nào cũng còn một dấu gạch chéo nữa ở phía sau, nên tất cả đều bị gom lên. <b>Prefix</b> là phép so chuỗi từng byte, không có ngữ nghĩa đường dẫn nào cả, và đó là lý do <code>"users"</code> thiếu dấu gạch chéo cuối đã khớp luôn cả <code>users-cu/d.jpg</code>; đây đúng là hình dạng khiến một lifecycle rule xoá nhiều hơn ý định của người viết. <b>HeadObject</b> lên <code>users/42/</code> trả 404 vì chuỗi đó không phải một key mà object nào từng được lưu dưới; chẳng có gì ở đó để mô tả. Phương án 2 mô tả một lượt duyệt thư mục mà API không cài đặt — một lượt liệt kê không có delimiter trả về mọi hậu duệ cùng lúc. Phương án 3 gọi hành vi đúng và có tài liệu là một lỗi. Phương án 4 bịa ra một object thư mục mà chính đoạn ghi bác bỏ, vì hai đứa con vẫn còn được liệt kê.',
          ),
        }),

        // q3 · đáp án 1
        mcq({
          prompt: B(
            'Two uploads of the same bucket, measured:' +
            code('# A — one PutObject of 20 bytes\n' +
              'ETag returned : "498a21f31e67af6755b5d0c37da35079"\n' +
              'md5 computed locally on the same bytes:\n' +
              '                "498a21f31e67af6755b5d0c37da35079"\n' +
              '\n' +
              '# B — multipart upload, two parts of 5 MiB each\n' +
              'part 1 ETag   : "79b281060d337b9b2b84ccf390adcf74"\n' +
              'part 2 ETag   : "74843a3ab193a389bced899402d99d5f"\n' +
              'final  ETag   : "f65590340fd7a9f7c0643548071050c7-2"') +
            'You want to deduplicate uploads by content hash. What is the correct conclusion?',

            'Hai lượt tải lên cùng một bucket, đã đo:' +
            code('# A — một PutObject 20 byte\n' +
              'ETag tra ve   : "498a21f31e67af6755b5d0c37da35079"\n' +
              'md5 tinh tai cho tren cung so byte do:\n' +
              '                "498a21f31e67af6755b5d0c37da35079"\n' +
              '\n' +
              '# B — multipart upload, hai part moi part 5 MiB\n' +
              'part 1 ETag   : "79b281060d337b9b2b84ccf390adcf74"\n' +
              'part 2 ETag   : "74843a3ab193a389bced899402d99d5f"\n' +
              'final  ETag   : "f65590340fd7a9f7c0643548071050c7-2"') +
            'Bạn muốn khử trùng lặp các lượt tải lên theo băm nội dung. Kết luận đúng là gì?',
          ),
          options: [
            B(
              'Use the ETag as the dedup key but strip the <code>-2</code> suffix first, since the part count is transport metadata and the hash before the dash is still the MD5 of the assembled object',
              'Cứ dùng ETag làm khoá khử trùng lặp nhưng cắt bỏ hậu tố <code>-2</code> trước đã, vì số phần chỉ là siêu dữ liệu vận chuyển còn phần băm trước dấu gạch vẫn là MD5 của object đã ghép xong',
            ),
            B(
              'Do not use the ETag: it equals the MD5 only for a single-part upload, and the multipart form is a hash of the concatenated part hashes plus the part count, so the same bytes uploaded with a different part size produce a different ETag — compute your own hash client-side and store it',
              'Đừng dùng ETag: nó chỉ bằng MD5 với lượt tải lên một phần, còn dạng multipart là băm của các băm-từng-phần nối lại cộng thêm số phần, nên cùng một khối byte tải lên với kích thước phần khác nhau sẽ ra ETag khác — hãy tự tính băm ở phía client rồi lưu lại',
            ),
            B(
              'Use the ETag directly for single-part uploads and call <code>HeadObject</code> for multipart ones, because HEAD returns the true content MD5 in a separate field while the ETag field carries the assembly hash',
              'Dùng thẳng ETag cho lượt một phần và gọi <code>HeadObject</code> cho lượt multipart, vì HEAD trả về MD5 nội dung thật trong một trường riêng còn trường ETag chỉ mang băm ghép nối',
            ),
            B(
              'Force every upload through <code>PutObject</code> so the ETag is always an MD5; the 5 GB single-request ceiling is high enough that multipart is never actually needed for user content',
              'Ép mọi lượt tải lên đi qua <code>PutObject</code> để ETag luôn là một MD5; trần 5 GB cho một request là đủ cao nên multipart thật ra không bao giờ cần thiết với nội dung của người dùng',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measurement A confirms the comfortable half of the story: a simple ' + c('PutObject') + ' returns the MD5 of the body, quoted, and it matches a local <code>md5</code> exactly. Measurement B destroys the assumption you were about to build on it. The final ETag <code>f65590…-2</code> is not the MD5 of the 10 MiB object; it is <code>md5( md5_binary(part1) ++ md5_binary(part2) )</code> with <code>-2</code> appended — a value that was reproduced by hand from the two part ETags and matched byte for byte. The consequence for deduplication is fatal: upload the identical file with 5 MiB parts and with 10 MiB parts and you get two different ETags for identical content, so equality of ETags is not equality of bytes and inequality is not inequality of bytes. Server-side encryption breaks it further. Option 1 fails on exactly this — the prefix before the dash is a hash of hashes, not a content MD5, so stripping the suffix gives you a value that still depends on the part size. Option 3 invents a field: HEAD returns the same ETag and no separate MD5. Option 4 gives up multipart, which is what makes resumable and parallel uploads possible in the first place, and would not help anyway once encryption is in play. Compute SHA-256 yourself before uploading and store it in your database next to the key.',
            'Phép đo A xác nhận nửa dễ chịu của câu chuyện: một lệnh ' + c('PutObject') + ' đơn giản trả về MD5 của phần thân, đặt trong dấu nháy, và nó khớp CHÍNH XÁC với một lệnh <code>md5</code> chạy tại chỗ. Phép đo B đập tan cái giả định mà bạn sắp xây lên trên đó. ETag cuối cùng <code>f65590…-2</code> KHÔNG phải MD5 của object 10 MiB; nó là <code>md5( md5_nhị_phân(part1) ++ md5_nhị_phân(part2) )</code> rồi nối thêm <code>-2</code> — một giá trị đã được dựng lại bằng tay từ hai ETag của hai phần và khớp từng byte. Hệ quả cho việc khử trùng lặp là chí mạng: tải lên cùng một file với phần 5 MiB và với phần 10 MiB thì bạn được hai ETag khác nhau cho nội dung y hệt, nên ETag bằng nhau không có nghĩa là byte bằng nhau, và khác nhau cũng không có nghĩa là byte khác nhau. Mã hoá phía máy chủ còn phá thêm một nấc nữa. Phương án 1 chết đúng ở chỗ này — phần đứng trước dấu gạch là một băm-của-các-băm, không phải MD5 nội dung, nên cắt hậu tố đi thì bạn vẫn còn một giá trị phụ thuộc vào kích thước phần. Phương án 3 bịa ra một trường: HEAD trả về cùng cái ETag đó và không có MD5 riêng nào. Phương án 4 vứt bỏ multipart, thứ vốn làm cho việc tải lên nối tiếp được và song song được trở nên khả thi, mà cũng chẳng cứu được gì một khi có mã hoá. Hãy tự tính SHA-256 trước khi tải lên rồi lưu nó trong cơ sở dữ liệu bên cạnh cái key.',
          ),
        }),

        /* ── Chương 1 — S3 API (6 câu) ─────────────────────────────────── */

        // q4 · đáp án 3
        mcq({
          prompt: B(
            'Two uploads, then <code>HeadObject</code> on each. Real output:' +
            code('PutObject Key="no-ct.bin" Body=<3 bytes>          # khong dat ContentType\n' +
              '  HEAD -> ContentType: application/octet-stream\n' +
              '         CacheControl: undefined\n' +
              '\n' +
              'PutObject Key="co-ct.jpg" ContentType="image/jpeg"\n' +
              '          CacheControl="public, max-age=31536000, immutable"\n' +
              '  HEAD -> ContentType: image/jpeg\n' +
              '         CacheControl: public, max-age=31536000, immutable\n' +
              '  GET  -> content-type: image/jpeg\n' +
              '         cache-control: public, max-age=31536000, immutable') +
            'What breaks in the browser when the first form is used for a user avatar?',

            'Hai lượt tải lên, rồi <code>HeadObject</code> lên từng cái. Output thật:' +
            code('PutObject Key="no-ct.bin" Body=<3 byte>           # khong dat ContentType\n' +
              '  HEAD -> ContentType: application/octet-stream\n' +
              '         CacheControl: undefined\n' +
              '\n' +
              'PutObject Key="co-ct.jpg" ContentType="image/jpeg"\n' +
              '          CacheControl="public, max-age=31536000, immutable"\n' +
              '  HEAD -> ContentType: image/jpeg\n' +
              '         CacheControl: public, max-age=31536000, immutable\n' +
              '  GET  -> content-type: image/jpeg\n' +
              '         cache-control: public, max-age=31536000, immutable') +
            'Dùng dạng thứ nhất cho ảnh đại diện của người dùng thì cái gì hỏng trên trình duyệt?',
          ),
          options: [
            B(
              'Nothing visible: browsers sniff the leading bytes of the response and correct the type themselves, so the image renders and only the cache behaviour differs between the two uploads',
              'Không có gì thấy được: trình duyệt tự ngửi vài byte đầu của phản hồi rồi sửa lại kiểu, nên ảnh vẫn hiện và chỉ hành vi bộ nhớ đệm là khác nhau giữa hai lượt tải lên',
            ),
            B(
              'The upload itself is rejected later at read time with a 415 Unsupported Media Type, because the service validates the stored type against the file extension when the object is first requested',
              'Chính lượt tải lên bị từ chối về sau lúc đọc bằng một mã 415 Unsupported Media Type, vì dịch vụ đối chiếu kiểu đã lưu với phần mở rộng của tên file ở lần đầu object được yêu cầu',
            ),
            B(
              'The object is stored with no type at all, so the CDN refuses to cache it and every view reaches the origin; the tag still renders because the type only matters to intermediaries',
              'Object được lưu mà hoàn toàn không có kiểu, nên CDN từ chối lưu đệm nó và mỗi lượt xem đều chạm tới gốc; thẻ vẫn hiển thị được vì kiểu chỉ có ý nghĩa với các bên trung gian',
            ),
            B(
              'The stored type becomes <code>application/octet-stream</code>, so the browser offers a download instead of displaying the image, and <code>&lt;img&gt;</code>, <code>&lt;audio&gt;</code> and <code>&lt;video&gt;</code> refuse it; with no <code>Cache-Control</code> either, every viewer refetches it constantly',
              'Kiểu được lưu thành <code>application/octet-stream</code>, nên trình duyệt mời tải xuống thay vì hiển thị ảnh, và các thẻ <code>&lt;img&gt;</code>, <code>&lt;audio&gt;</code>, <code>&lt;video&gt;</code> từ chối nó; lại còn không có <code>Cache-Control</code> nào, nên mọi người xem cứ tải đi tải lại liên tục',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Both headers are decided once, at upload time, and the object carries them for the rest of its life — the measurement shows them round-tripping unchanged through HEAD and through the actual GET response. Omitting ' + c('ContentType') + ' does not leave the field empty; the service fills in <code>application/octet-stream</code>, which is the MIME type that means "unknown binary", and browsers treat it as a download. Media elements are stricter than <code>&lt;img&gt;</code>: an <code>&lt;audio&gt;</code> or <code>&lt;video&gt;</code> source with the wrong type is rejected outright rather than sniffed. The second omission compounds it: with no <code>Cache-Control</code>, neither the browser nor the CDN has a TTL to work from, so a hot asset that should have been served from cache forever instead generates a read request per view — the Class B line item on the bill grows for no reason. Option 1 leans on content sniffing, which browsers deliberately restrict and which never applies to media elements. Option 2 invents a validation step; the service never compares the type to the file extension, and there is no read-time rejection. Option 3 has it backwards: the object does have a type, and a CDN caches <code>application/octet-stream</code> quite happily — what stops it caching is the missing <code>Cache-Control</code>.',
            'Cả hai header đều được quyết đúng một lần, ngay lúc tải lên, và object mang chúng theo suốt phần đời còn lại — phép đo cho thấy chúng đi về nguyên vẹn qua HEAD và qua chính phản hồi GET. Bỏ trống ' + c('ContentType') + ' không để lại một trường rỗng; dịch vụ điền vào <code>application/octet-stream</code>, đúng cái kiểu MIME mang nghĩa "nhị phân không rõ", và trình duyệt xử nó như một lượt tải xuống. Các phần tử media còn khắt khe hơn <code>&lt;img&gt;</code>: một nguồn <code>&lt;audio&gt;</code> hay <code>&lt;video&gt;</code> sai kiểu thì bị từ chối thẳng chứ không được ngửi. Chỗ bỏ sót thứ hai cộng dồn vào: không có <code>Cache-Control</code> thì cả trình duyệt lẫn CDN đều không có TTL nào để dựa vào, nên một tài nguyên nóng đáng lẽ được phục vụ từ bộ đệm mãi mãi lại sinh ra một request đọc cho mỗi lượt xem — dòng Class B trên hoá đơn phình lên vô cớ. Phương án 1 tựa vào việc ngửi nội dung, thứ mà trình duyệt cố ý hạn chế và không bao giờ áp dụng cho phần tử media. Phương án 2 bịa ra một bước kiểm tra; dịch vụ không bao giờ đối chiếu kiểu với phần mở rộng tên file, và không có lượt từ chối nào lúc đọc. Phương án 3 nói ngược: object CÓ kiểu, và một CDN lưu đệm <code>application/octet-stream</code> rất vui vẻ — thứ ngăn nó lưu đệm là cái <code>Cache-Control</code> bị thiếu.',
          ),
        }),

        // q5 · đáp án 0
        mcq({
          prompt: B(
            'The same missing key, asked two ways. Real output from the SDK:' +
            code('GetObjectCommand  Key="a/khong-co.txt"\n' +
              '  err.name    : NoSuchKey\n' +
              '  err.Code    : NoSuchKey\n' +
              '  err.message : The specified key does not exist.\n' +
              '  http        : 404\n' +
              '  body        : <Error><Code>NoSuchKey</Code>\n' +
              '                <Message>The specified key does not exist.</Message>…\n' +
              '\n' +
              'HeadObjectCommand Key="a/khong-co.txt"\n' +
              '  err.name    : NotFound\n' +
              '  err.Code    : undefined\n' +
              '  err.message : "UnknownError"\n' +
              '  http        : 404') +
            'Your existence check is <code>catch (e) { if (e.Code === \'NoSuchKey\') return false; throw e; }</code> and it is used with <code>HeadObject</code>. What happens, and why?',

            'Cùng một key không tồn tại, hỏi theo hai cách. Output thật từ SDK:' +
            code('GetObjectCommand  Key="a/khong-co.txt"\n' +
              '  err.name    : NoSuchKey\n' +
              '  err.Code    : NoSuchKey\n' +
              '  err.message : The specified key does not exist.\n' +
              '  http        : 404\n' +
              '  body        : <Error><Code>NoSuchKey</Code>\n' +
              '                <Message>The specified key does not exist.</Message>…\n' +
              '\n' +
              'HeadObjectCommand Key="a/khong-co.txt"\n' +
              '  err.name    : NotFound\n' +
              '  err.Code    : undefined\n' +
              '  err.message : "UnknownError"\n' +
              '  http        : 404') +
            'Phép kiểm tồn tại của bạn là <code>catch (e) { if (e.Code === \'NoSuchKey\') return false; throw e; }</code> và nó được dùng với <code>HeadObject</code>. Chuyện gì xảy ra, và vì sao?',
          ),
          options: [
            B(
              'It rethrows on every missing object: a HEAD response has no body, so the SDK has no XML <code>Code</code> to parse and fills in <code>name: \'NotFound\'</code> instead — branch on <code>e.name === \'NotFound\'</code> (or on the 404 status) when you use HEAD, and keep <code>Code</code> for verbs that return a body',
              'Nó ném lại lỗi với MỌI object không tồn tại: một phản hồi HEAD không có thân, nên SDK chẳng có <code>Code</code> XML nào để phân giải và điền vào <code>name: \'NotFound\'</code> thay thế — hãy rẽ nhánh theo <code>e.name === \'NotFound\'</code> (hoặc theo mã 404) khi dùng HEAD, và để dành <code>Code</code> cho những động từ có trả về thân',
            ),
            B(
              'It works correctly: the SDK normalises both shapes to the same error class before your catch runs, so <code>e.Code</code> is populated from the status code whenever the body is absent, and the check returns <code>false</code> as intended',
              'Nó chạy đúng: SDK chuẩn hoá cả hai dạng về cùng một lớp lỗi trước khi khối catch của bạn chạy, nên <code>e.Code</code> được điền từ mã trạng thái mỗi khi thiếu thân, và phép kiểm trả về <code>false</code> như ý định',
            ),
            B(
              'It returns <code>true</code> for every key, because an error whose <code>Code</code> is <code>undefined</code> never matches the comparison and the function falls through to its success path instead of throwing',
              'Nó trả về <code>true</code> cho mọi key, vì một lỗi có <code>Code</code> là <code>undefined</code> thì không bao giờ khớp phép so sánh và hàm rơi xuống nhánh thành công thay vì ném lỗi',
            ),
            B(
              'It works, but only because both calls return HTTP 404; had the object been forbidden rather than absent the check would have swallowed a 403 as "does not exist", which is the real bug in this code',
              'Nó chạy được, nhưng chỉ vì cả hai lời gọi đều trả HTTP 404; nếu object bị cấm chứ không phải vắng mặt thì phép kiểm đã nuốt một cái 403 thành "không tồn tại", và đó mới là lỗi thật của đoạn mã này',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The two errors look like one problem and are shaped completely differently, and the reason is HTTP, not the SDK. <b>HEAD returns headers only — there is no response body by definition</b>, so there is no <code>&lt;Error&gt;&lt;Code&gt;</code> XML for the SDK to parse. The measurement shows exactly what is left: <code>err.Code</code> is <code>undefined</code> and <code>err.message</code> is the placeholder string <code>"UnknownError"</code>, while the only usable signal is <code>err.name === \'NotFound\'</code> and the 404 status. A catch that branches on <code>e.Code</code> therefore never matches, and the <code>throw e</code> on the next line runs for every single missing object — the failure surfaces far from here, as an unhandled rejection in whatever called your existence check. This is also the one place the course\'s otherwise excellent advice ("read the XML body, not the status code") does not apply: for HEAD there is no body to read. Option 2 describes a normalisation the SDK does not perform, and the measured <code>undefined</code> disproves it directly. Option 3 gets JavaScript wrong: the comparison being false means the <code>throw</code> executes, not that the function returns. Option 4 raises a real concern about 403-versus-404 but misreads this transcript, where both responses are 404 and the code still misbehaves.',
            'Hai cái lỗi trông như một vấn đề mà hình dạng khác hẳn nhau, và lý do nằm ở HTTP chứ không ở SDK. <b>HEAD chỉ trả header — theo định nghĩa là KHÔNG CÓ thân phản hồi</b>, nên chẳng có khối XML <code>&lt;Error&gt;&lt;Code&gt;</code> nào để SDK phân giải. Phép đo cho thấy chính xác cái còn lại: <code>err.Code</code> là <code>undefined</code> còn <code>err.message</code> là chuỗi giữ chỗ <code>"UnknownError"</code>, trong khi tín hiệu dùng được duy nhất là <code>err.name === \'NotFound\'</code> và mã 404. Một khối catch rẽ nhánh theo <code>e.Code</code> vì thế không bao giờ khớp, và dòng <code>throw e</code> ngay sau đó chạy với TỪNG object không tồn tại — cú hỏng lộ ra ở rất xa chỗ này, dưới dạng một promise bị từ chối mà không ai bắt, ở bất cứ nơi nào đã gọi phép kiểm tồn tại của bạn. Đây cũng đúng là chỗ duy nhất mà lời khuyên vốn rất hay của giáo trình ("đọc khối XML chứ đừng đọc mã trạng thái") KHÔNG áp dụng được: với HEAD thì không có thân nào để đọc. Phương án 2 mô tả một phép chuẩn hoá mà SDK không làm, và cái <code>undefined</code> đo được bác bỏ nó thẳng thừng. Phương án 3 hiểu sai JavaScript: phép so sánh sai nghĩa là câu <code>throw</code> chạy, chứ không phải hàm trả về. Phương án 4 nêu một lo ngại có thật về 403-so-với-404 nhưng đọc sai đoạn ghi này, nơi cả hai phản hồi đều là 404 mà đoạn mã vẫn hành xử sai.',
          ),
        }),

        // q6 · đáp án 2
        mcq({
          prompt: B(
            'A cleanup job deletes three keys; only one of them exists. Real output:' +
            code('DeleteObjectsCommand Delete.Objects =\n' +
              '  [ { Key: "a/hello.txt" },   # ton tai\n' +
              '    { Key: "khong-1" },       # khong ton tai\n' +
              '    { Key: "khong-2" } ]      # khong ton tai\n' +
              '\n' +
              'Deleted: [{"Key":"a/hello.txt"},{"Key":"khong-1"},{"Key":"khong-2"}]\n' +
              'Errors : undefined') +
            'The job logs <code>Deleted.length</code> as "objects removed". What is wrong with that, and what should it check instead?',

            'Một job dọn dẹp xoá ba key; chỉ một trong số đó tồn tại. Output thật:' +
            code('DeleteObjectsCommand Delete.Objects =\n' +
              '  [ { Key: "a/hello.txt" },   # ton tai\n' +
              '    { Key: "khong-1" },       # khong ton tai\n' +
              '    { Key: "khong-2" } ]      # khong ton tai\n' +
              '\n' +
              'Deleted: [{"Key":"a/hello.txt"},{"Key":"khong-1"},{"Key":"khong-2"}]\n' +
              'Errors : undefined') +
            'Việc job ghi log <code>Deleted.length</code> thành "số object đã xoá" sai ở chỗ nào, và nó nên kiểm cái gì thay thế?',
          ),
          options: [
            B(
              'Nothing is wrong: the response is authoritative, so three really were removed — the two "missing" keys existed as zero-byte placeholder objects created when their prefixes were first written to',
              'Chẳng có gì sai: phản hồi là nguồn có thẩm quyền, nên đúng là đã có ba cái bị xoá — hai key "không tồn tại" vốn tồn tại dưới dạng object rỗng 0 byte được tạo ra khi tiền tố của chúng được ghi lần đầu',
            ),
            B(
              'The count is inflated because the batch was only partially applied and the service optimistically lists every requested key; re-issuing the same batch until <code>Deleted</code> comes back empty is the standard way to confirm the deletes actually landed',
              'Con số bị thổi phồng vì lô lệnh mới chỉ áp dụng một phần và dịch vụ lạc quan liệt kê mọi key được yêu cầu; phát lại đúng lô đó cho tới khi <code>Deleted</code> trở về rỗng là cách chuẩn để xác nhận các lượt xoá đã thật sự có hiệu lực',
            ),
            B(
              'Delete is idempotent — removing a key that was never there is a success, so <code>Deleted</code> echoes back every key you asked about and its length only counts requests, not removals; if the job needs a real count it must know what existed beforehand, and <code>Errors</code> is the field that reports genuine per-key failures such as a permission denial',
              'Xoá là thao tác luỹ đẳng — bỏ đi một key chưa từng có ở đó vẫn là thành công, nên <code>Deleted</code> vọng lại mọi key bạn hỏi và độ dài của nó chỉ đếm số yêu cầu chứ không đếm số lần xoá thật; nếu job cần một con số thật thì nó phải biết trước cái gì đã tồn tại, còn <code>Errors</code> mới là trường báo những cú hỏng thật theo từng key, chẳng hạn một lượt từ chối quyền',
            ),
            B(
              'The log is wrong because <code>Deleted</code> excludes objects removed by an overlapping lifecycle rule; the accurate count comes from subtracting the <code>Errors</code> length from the number of keys submitted in the batch',
              'Dòng log sai vì <code>Deleted</code> loại trừ những object đã bị một lifecycle rule chồng lấn xoá mất; con số chính xác có được bằng cách lấy số key gửi trong lô trừ đi độ dài của <code>Errors</code>',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Delete in S3 is defined as idempotent, in exactly the sense that <code>rm -f</code> is: the postcondition "this key does not exist" is already satisfied, so the operation succeeds and reports success. The measurement makes the consequence concrete — all three keys appear in <code>Deleted</code> although only one was ever there, and <code>Errors</code> is <code>undefined</code> rather than an empty array. A cleanup job that logs "removed 3 objects" is therefore reporting how many keys it <em>asked about</em>, and a reconciliation script built on that number will happily conclude a bucket was cleaned when it deleted nothing at all. Two practical rules follow. If you need a true count, get it from the state you knew before the call — the rows in your database, or a listing — because the API will not give it to you. And do read <code>Errors</code>: it is where per-key failures such as <code>AccessDenied</code> land, and a batch can be half-successful, so a 200 on the batch as a whole proves nothing about any individual key. Option 1 invents placeholder objects; there are none, and the whole course rests on prefixes not being entities. Option 2 invents a partial-application protocol and a retry loop that would run forever, since the response never changes. Option 4 inverts the arithmetic and adds a lifecycle interaction that plays no part here.',
            'Xoá trong S3 được định nghĩa là luỹ đẳng, đúng theo cái nghĩa mà <code>rm -f</code> luỹ đẳng: hậu điều kiện "key này không tồn tại" vốn đã được thoả, nên thao tác thành công và báo là thành công. Phép đo làm hệ quả trở nên cụ thể — cả ba key đều xuất hiện trong <code>Deleted</code> dù chỉ có một cái từng ở đó, và <code>Errors</code> là <code>undefined</code> chứ không phải một mảng rỗng. Một job dọn dẹp ghi log "đã xoá 3 object" vì thế đang báo cáo số key mà nó ĐÃ HỎI, và một script đối soát dựng trên con số đó sẽ vui vẻ kết luận rằng một bucket đã được dọn trong khi nó chẳng xoá gì cả. Hai quy tắc thực dụng theo sau. Nếu cần một con số thật thì hãy lấy nó từ trạng thái bạn biết TRƯỚC lời gọi — các dòng trong cơ sở dữ liệu, hoặc một lượt liệt kê — vì API sẽ không đưa nó cho bạn. Và hãy thật sự đọc <code>Errors</code>: đó là nơi những cú hỏng theo từng key như <code>AccessDenied</code> rơi vào, và một lô có thể thành công một nửa, nên một cái 200 cho cả lô chẳng chứng minh được gì về bất kỳ key riêng lẻ nào. Phương án 1 bịa ra object giữ chỗ; chẳng có cái nào, và cả khoá học đứng trên việc tiền tố không phải thực thể. Phương án 2 bịa ra một giao thức áp-dụng-một-phần và một vòng thử lại sẽ chạy mãi mãi, vì phản hồi không bao giờ đổi. Phương án 4 làm ngược phép tính và thêm vào một tương tác lifecycle chẳng đóng vai trò gì ở đây.',
          ),
        }),

        // q7 · đáp án 1
        mcq({
          prompt: B(
            'A 10 MiB object uploaded in two 5 MiB parts, measured end to end:' +
            code('CreateMultipartUpload -> UploadId (124 ky tu)\n' +
              'UploadPart 1 -> ETag "79b281060d337b9b2b84ccf390adcf74"\n' +
              'UploadPart 2 -> ETag "74843a3ab193a389bced899402d99d5f"\n' +
              'CompleteMultipartUpload Parts=[{1,etag1},{2,etag2}]\n' +
              '  -> ETag "f65590340fd7a9f7c0643548071050c7-2"\n' +
              '\n' +
              'HeadObject -> ContentLength: 10485760\n' +
              '              ETag         : "f65590340fd7a9f7c0643548071050c7-2"') +
            'What does <code>CompleteMultipartUpload</code> actually do here?',

            'Một object 10 MiB tải lên bằng hai phần 5 MiB, đo từ đầu tới cuối:' +
            code('CreateMultipartUpload -> UploadId (124 ky tu)\n' +
              'UploadPart 1 -> ETag "79b281060d337b9b2b84ccf390adcf74"\n' +
              'UploadPart 2 -> ETag "74843a3ab193a389bced899402d99d5f"\n' +
              'CompleteMultipartUpload Parts=[{1,etag1},{2,etag2}]\n' +
              '  -> ETag "f65590340fd7a9f7c0643548071050c7-2"\n' +
              '\n' +
              'HeadObject -> ContentLength: 10485760\n' +
              '              ETag         : "f65590340fd7a9f7c0643548071050c7-2"') +
            'Ở đây <code>CompleteMultipartUpload</code> thật sự làm gì?',
          ),
          options: [
            B(
              'It uploads the parts: <code>UploadPart</code> only reserves a slot and returns the ETag the part will have, and the bytes are transferred during the completion call, which is why completion is the slow step',
              'Nó mới tải các phần lên: <code>UploadPart</code> chỉ giữ chỗ và trả về cái ETag mà phần đó sẽ có, còn các byte được chuyển đi trong lời gọi hoàn tất, và đó là lý do bước hoàn tất là bước chậm',
            ),
            B(
              'It takes the list of part numbers and ETags you send, assembles the already-uploaded parts into one object in that order, and publishes it atomically — until that call returns, no object exists at the key and a reader gets a 404',
              'Nó nhận danh sách số thứ tự phần và ETag mà bạn gửi, ghép các phần đã tải lên sẵn thành một object theo đúng thứ tự đó, rồi công bố nó một cách nguyên tử — cho tới khi lời gọi đó trả về thì chưa có object nào ở key ấy và người đọc nhận 404',
            ),
            B(
              'It verifies the parts against the checksum you declared at <code>CreateMultipartUpload</code> and rejects the upload if any part changed, which is the guarantee that makes the three-step handshake safe to retry',
              'Nó đối chiếu các phần với giá trị băm bạn đã khai ở <code>CreateMultipartUpload</code> và từ chối lượt tải lên nếu bất kỳ phần nào đổi, và chính bảo đảm đó khiến cái bắt tay ba bước an toàn để thử lại',
            ),
            B(
              'It marks the upload finished but leaves assembly to a background task, so the object appears at the key some seconds later and the ETag is only computable once that task has run',
              'Nó đánh dấu lượt tải lên là xong nhưng để việc ghép cho một tác vụ chạy nền, nên object xuất hiện ở key đó sau vài giây và chỉ tính được ETag khi tác vụ ấy đã chạy',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The three-step handshake divides responsibilities cleanly. <code>CreateMultipartUpload</code> mints an <code>UploadId</code> — a 124-character token in this measurement — which is the only handle tying the parts together; it moves no bytes. <code>UploadPart</code> transfers the actual data and returns each part\'s own ETag, which is the plain MD5 of that part (verified here: the local <code>md5</code> of the 5 MiB buffer matches part 1 exactly). <code>CompleteMultipartUpload</code> is the cheap step that carries the manifest: you hand back the part numbers and ETags, the service concatenates the stored parts in <em>the order of the part numbers you supplied</em>, and the object becomes visible at the key in one atomic publish. That atomicity is the property worth remembering: a reader either sees the whole 10 MiB object or sees nothing, never a half-written file — which is exactly why an interrupted upload leaves no object behind but does leave billable parts. Option 1 inverts which call moves the bytes, and would make a resumable upload impossible. Option 3 invents an up-front checksum that <code>CreateMultipartUpload</code> does not take; the ETags in the manifest are what pin the parts. Option 4 contradicts the transcript, where the final ETag comes back in the completion response itself and <code>HeadObject</code> immediately agrees.',
            'Cái bắt tay ba bước chia trách nhiệm rất rành mạch. <code>CreateMultipartUpload</code> đúc ra một <code>UploadId</code> — một token 124 ký tự trong phép đo này — và đó là cái tay cầm duy nhất buộc các phần lại với nhau; nó không chuyển một byte nào. <code>UploadPart</code> mới chuyển dữ liệu thật và trả về ETag riêng của từng phần, chính là MD5 thuần của phần đó (đã kiểm ở đây: lệnh <code>md5</code> chạy tại chỗ trên bộ đệm 5 MiB khớp CHÍNH XÁC với phần 1). <code>CompleteMultipartUpload</code> là bước rẻ mang theo bản kê: bạn trả lại các số thứ tự phần và các ETag, dịch vụ nối các phần đã lưu theo ĐÚNG THỨ TỰ CÁC SỐ PHẦN BẠN CUNG CẤP, rồi object trở nên nhìn thấy được ở key ấy trong một lượt công bố nguyên tử. Tính nguyên tử ấy là thứ đáng nhớ: người đọc hoặc thấy trọn object 10 MiB hoặc chẳng thấy gì, không bao giờ thấy một file ghi dở — và đó chính là lý do một lượt tải lên bị đứt không để lại object nào nhưng lại để lại các phần vẫn bị tính tiền. Phương án 1 đảo ngược xem lời gọi nào chuyển byte, và như thế thì một lượt tải lên nối tiếp được là bất khả. Phương án 3 bịa ra một giá trị băm khai trước mà <code>CreateMultipartUpload</code> không nhận; chính các ETag trong bản kê mới là thứ ghim các phần lại. Phương án 4 mâu thuẫn với đoạn ghi, nơi ETag cuối cùng trở về ngay trong phản hồi của lời gọi hoàn tất và <code>HeadObject</code> đồng ý ngay lập tức.',
          ),
        }),

        // q8 · đáp án 3
        mcq({
          prompt: B(
            'A multipart upload of a 1 MiB part followed by a 1 KiB part. Real output:' +
            code('UploadPart 1 (1 MiB) -> 200 OK\n' +
              'UploadPart 2 (1 KiB) -> 200 OK\n' +
              'CompleteMultipartUpload\n' +
              '  err.name : EntityTooSmall\n' +
              '  err.Code : EntityTooSmall\n' +
              '  http     : 400\n' +
              '  message  : Your proposed upload is smaller than the minimum\n' +
              '             allowed object size.') +
            'Both parts uploaded fine and the failure came only at completion. Why is that the correct place for the check?',

            'Một lượt multipart với phần đầu 1 MiB rồi phần sau 1 KiB. Output thật:' +
            code('UploadPart 1 (1 MiB) -> 200 OK\n' +
              'UploadPart 2 (1 KiB) -> 200 OK\n' +
              'CompleteMultipartUpload\n' +
              '  err.name : EntityTooSmall\n' +
              '  err.Code : EntityTooSmall\n' +
              '  http     : 400\n' +
              '  message  : Your proposed upload is smaller than the minimum\n' +
              '             allowed object size.') +
            'Cả hai phần đều tải lên êm và chỉ tới lúc hoàn tất mới hỏng. Vì sao đó là chỗ ĐÚNG để đặt phép kiểm?',
          ),
          options: [
            B(
              'Because the minimum applies to the whole object rather than to any part: a 1 MiB + 1 KiB assembly is below the floor, and splitting a file that small into parts at all is what the error is objecting to',
              'Vì mức tối thiểu áp cho cả object chứ không cho phần nào: một tổ hợp 1 MiB + 1 KiB nằm dưới sàn, và chính việc chia nhỏ một file bé đến thế thành nhiều phần mới là điều lỗi này phản đối',
            ),
            B(
              'Because part sizes are only known once the transfer finishes; the service streams each part without buffering it, so the length is not available to validate at <code>UploadPart</code> time and must be deferred',
              'Vì kích thước từng phần chỉ biết được khi việc truyền kết thúc; dịch vụ đọc dòng từng phần mà không đệm lại, nên độ dài không có sẵn để kiểm ngay lúc <code>UploadPart</code> và phải hoãn lại',
            ),
            B(
              'Because the check is about ordering, not size: part 2 being smaller than part 1 tells the service the parts were assembled out of order, and completion is the first moment the full ordering is visible',
              'Vì phép kiểm là về thứ tự chứ không phải kích thước: việc phần 2 nhỏ hơn phần 1 nói cho dịch vụ biết các phần đã được ghép sai thứ tự, và lúc hoàn tất mới là khoảnh khắc đầu tiên thấy được toàn bộ thứ tự',
            ),
            B(
              'Because every part except the last must be at least 5 MiB, and only the manifest sent at completion says which part is last — a part uploaded on its own could still legitimately turn out to be the final one, so the constraint is unenforceable until then',
              'Vì mọi phần TRỪ phần cuối phải ít nhất 5 MiB, mà chỉ bản kê gửi lúc hoàn tất mới nói phần nào là phần cuối — một phần tải lên riêng lẻ vẫn hoàn toàn có thể hoá ra là phần cuối cùng, nên ràng buộc ấy không thi hành được trước lúc đó',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The rule is "every part except the last must be at least 5 MiB", and the interesting half is the exception. When <code>UploadPart 1</code> arrives carrying 1 MiB, the service genuinely cannot know whether more parts are coming — a single-part multipart upload is legal, and in that case 1 MiB is perfectly fine. The information that part 1 is <em>not</em> last only exists in the manifest sent to <code>CompleteMultipartUpload</code>, which is why both uploads returned 200 and the 400 arrived at the end. The practical consequence is worth internalising: a resumable uploader must not choose a part size below 5 MiB, because the mistake is invisible for the entire duration of the transfer and only surfaces after every byte has been sent and paid for. Note also the status code — <code>EntityTooSmall</code> is a <b>400</b>, a client error about the request you composed, not a 403 about permission and not a 5xx about the service. Option 1 misreads the constraint as a floor on total object size; there is none, and a zero-byte object is perfectly legal via ' + c('PutObject') + '. Option 2 invents a streaming limitation — the service knows each part\'s length and returns its ETag, so it has clearly buffered and hashed it. Option 3 turns a size rule into an ordering rule; parts may legitimately vary in size and are assembled by part number, not by arrival.',
            'Quy tắc là "mọi phần trừ phần cuối phải ít nhất 5 MiB", và nửa thú vị nằm ở cái ngoại lệ. Khi <code>UploadPart 1</code> tới mang theo 1 MiB, dịch vụ thật sự KHÔNG THỂ biết còn phần nào tới nữa hay không — một lượt multipart chỉ có một phần là hợp lệ, và trong trường hợp đó thì 1 MiB hoàn toàn ổn. Thông tin rằng phần 1 KHÔNG phải phần cuối chỉ tồn tại trong bản kê gửi cho <code>CompleteMultipartUpload</code>, và đó là lý do cả hai lượt tải lên đều trả 200 còn cái 400 thì tới ở cuối. Hệ quả thực dụng đáng khắc vào đầu: một bộ tải lên nối tiếp được thì tuyệt đối không được chọn kích thước phần dưới 5 MiB, vì sai lầm ấy vô hình suốt cả quá trình truyền và chỉ lộ ra sau khi từng byte đã được gửi đi và đã bị tính tiền. Cũng để ý mã trạng thái — <code>EntityTooSmall</code> là một cái <b>400</b>, một lỗi phía client về chính cái request bạn soạn ra, không phải 403 về quyền và không phải 5xx về dịch vụ. Phương án 1 đọc nhầm ràng buộc thành một sàn cho tổng kích thước object; không có sàn nào cả, và một object 0 byte hoàn toàn hợp lệ qua ' + c('PutObject') + '. Phương án 2 bịa ra một hạn chế về đọc dòng — dịch vụ biết độ dài từng phần và trả về ETag của phần đó, nên rõ ràng nó đã đệm lại và băm rồi. Phương án 3 biến một quy tắc kích thước thành quy tắc thứ tự; các phần hoàn toàn có quyền khác kích thước nhau và được ghép theo SỐ THỨ TỰ PHẦN chứ không theo thứ tự tới nơi.',
          ),
        }),

        // q9 · đáp án 0
        mcq({
          prompt: B(
            'This repo builds its S3 client like this, and a contributor asks why it is not just a module-level <code>const</code>:' +
            code("let cachedClient: S3Client | null = null;\n" +
              '\n' +
              'export function getR2Client(): S3Client {\n' +
              '  if (cachedClient) return cachedClient;\n' +
              '  if (!config.r2.endpoint || !config.r2.accessKeyId) {\n' +
              "    throw new Error('Cloudflare R2 is not configured. Set R2_BUCKET_NAME, …');\n" +
              '  }\n' +
              "  cachedClient = new S3Client({ region: 'auto', endpoint: config.r2.endpoint, … });\n" +
              '  return cachedClient;\n' +
              '}') +
            'What does this shape buy, and what would break if the client were constructed at import time instead?',

            'Kho này dựng client S3 như sau, và một người đóng góp hỏi vì sao không để nó là một <code>const</code> ở cấp module cho xong:' +
            code("let cachedClient: S3Client | null = null;\n" +
              '\n' +
              'export function getR2Client(): S3Client {\n' +
              '  if (cachedClient) return cachedClient;\n' +
              '  if (!config.r2.endpoint || !config.r2.accessKeyId) {\n' +
              "    throw new Error('Cloudflare R2 is not configured. Set R2_BUCKET_NAME, …');\n" +
              '  }\n' +
              "  cachedClient = new S3Client({ region: 'auto', endpoint: config.r2.endpoint, … });\n" +
              '  return cachedClient;\n' +
              '}') +
            'Hình dạng này mua được gì, và cái gì sẽ hỏng nếu client được dựng ngay lúc import?',
          ),
          options: [
            B(
              'It keeps both properties at once: the client is still created exactly once and its connection pool is reused across every request, but the missing-credentials error is deferred to the first caller — so a contributor with no R2 keys can clone the repo and run the test suite, and only code paths that actually touch storage fail',
              'Nó giữ được cả hai tính chất cùng lúc: client vẫn chỉ được tạo đúng một lần và pool kết nối của nó vẫn được dùng lại qua mọi request, nhưng lỗi thiếu khoá thì được hoãn tới người gọi đầu tiên — nhờ vậy một người đóng góp không có khoá R2 vẫn clone kho về và chạy được bộ kiểm thử, và chỉ những nhánh mã thật sự chạm tới lưu trữ mới hỏng',
            ),
            B(
              'It makes each request cheaper by avoiding a shared connection pool: constructing on demand gives every caller a fresh set of sockets, which prevents one slow upload from blocking unrelated reads behind it',
              'Nó làm mỗi request rẻ hơn nhờ tránh được một pool kết nối dùng chung: dựng theo yêu cầu cho mỗi người gọi một bộ socket mới toanh, nhờ đó một lượt tải lên chậm không chặn được những lượt đọc chẳng liên quan xếp sau nó',
            ),
            B(
              'It exists so credentials can be rotated without a restart: because the client is rebuilt on each call, a new access key written to the environment takes effect on the very next request instead of waiting for a redeploy',
              'Nó tồn tại để xoay khoá mà không phải khởi động lại: vì client được dựng lại ở mỗi lời gọi, một access key mới ghi vào môi trường có hiệu lực ngay ở request kế tiếp thay vì phải chờ một lượt triển khai lại',
            ),
            B(
              'It is required by the SDK: <code>S3Client</code> reads <code>process.env</code> during construction, and at module-evaluation time the environment has not been populated yet, so an import-time client would always be created with empty credentials',
              'Đó là yêu cầu của SDK: <code>S3Client</code> đọc <code>process.env</code> lúc dựng, mà ở thời điểm module được đánh giá thì môi trường chưa được nạp, nên một client dựng lúc import sẽ luôn ra đời với thông tin xác thực rỗng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Read the code for what it actually does: the <code>cachedClient</code> guard on the first line means the client is created <b>once</b> and every later call returns the same instance. So this is not "a new client per request" — it keeps the connection-pool reuse that makes warm requests fast, which is the single biggest latency win available (a fresh client pays DNS plus a TLS handshake before doing any work). What it changes is <em>when the failure happens</em>. Constructing at import time means the throw fires during module evaluation, which takes down the whole process: a contributor who clones the repo with no R2 keys cannot start the app or run a single unrelated test. Deferring it means the app boots, the test suite runs, and only a code path that genuinely needs storage gets the error — and it gets a good one, naming the four environment variables. Option 2 argues for the opposite pattern and misstates the trade: a shared keep-alive pool is what you want, and separate pools multiply handshakes rather than isolating slow requests. Option 3 describes what the code would do <em>without</em> the cache line; with it, a rotated key is not picked up until the process restarts. Option 4 invents an SDK requirement — credentials are passed explicitly here, not read from the environment by the SDK at all.',
            'Hãy đọc đoạn mã theo đúng thứ nó làm: cái chốt <code>cachedClient</code> ở dòng đầu nghĩa là client được tạo ĐÚNG MỘT LẦN và mọi lời gọi sau đều trả về cùng một thể hiện. Vậy nên đây KHÔNG phải "mỗi request một client mới" — nó vẫn giữ được việc dùng lại pool kết nối, thứ làm cho các request nóng chạy nhanh, và đó là khoản thắng độ trễ lớn nhất có thể có (một client mới toanh phải trả tiền DNS cộng một lần bắt tay TLS trước khi làm được việc gì). Cái nó thay đổi là THỜI ĐIỂM CÚ HỎNG XẢY RA. Dựng lúc import nghĩa là câu ném lỗi nổ ngay trong lúc module được đánh giá, và điều đó hạ cả tiến trình: một người đóng góp clone kho về mà không có khoá R2 thì không khởi động nổi ứng dụng, cũng không chạy nổi một bài kiểm thử chẳng liên quan nào. Hoãn nó lại nghĩa là ứng dụng khởi động được, bộ kiểm thử chạy được, và chỉ một nhánh mã thật sự cần lưu trữ mới nhận lỗi — mà lại nhận một lỗi tử tế, nêu đích danh bốn biến môi trường. Phương án 2 bênh vực đúng cái mẫu ngược lại và nói sai về đánh đổi: một pool keep-alive dùng chung mới là thứ bạn muốn, còn các pool tách rời thì nhân số lần bắt tay lên chứ không cô lập được request chậm. Phương án 3 mô tả cái mà đoạn mã sẽ làm nếu KHÔNG có dòng cache; có nó rồi thì một khoá vừa xoay sẽ không được nhận cho tới khi tiến trình khởi động lại. Phương án 4 bịa ra một yêu cầu của SDK — ở đây thông tin xác thực được truyền vào tường minh, SDK không hề đọc từ môi trường.',
          ),
        }),

        /* ── Chương 2 — R2 specifics (4 câu) ───────────────────────────── */

        // q10 · đáp án 1
        mcq({
          prompt: B(
            'A developer moving code from S3 to R2 writes <code>new S3Client({ region: \'us-east-1\', endpoint: R2_ENDPOINT, … })</code> because that is what the old S3 config said. What happens?',
            'Một lập trình viên chuyển mã từ S3 sang R2 viết <code>new S3Client({ region: \'us-east-1\', endpoint: R2_ENDPOINT, … })</code> vì cấu hình S3 cũ ghi như vậy. Chuyện gì xảy ra?',
          ),
          options: [
            B(
              'The request fails with an <code>AuthorizationHeaderMalformed</code> error naming the expected region, because R2 validates the region in the credential scope and reports the mismatch the way S3 does when a bucket lives elsewhere',
              'Request hỏng với một lỗi <code>AuthorizationHeaderMalformed</code> nêu tên vùng được mong đợi, vì R2 kiểm vùng trong phạm vi credential và báo lại chỗ lệch đúng như cách S3 làm khi một bucket nằm ở nơi khác',
            ),
            B(
              'It works, because R2 does not use regions at all — a single global namespace, so any region string signs and verifies fine; the convention is <code>\'auto\'</code> only because the SDK requires the field to be a non-empty string and <code>\'auto\'</code> documents the fact that the value is meaningless',
              'Nó vẫn chạy, vì R2 hoàn toàn không dùng vùng — một không gian tên toàn cầu duy nhất, nên chuỗi vùng nào cũng ký và xác minh được; quy ước <code>\'auto\'</code> tồn tại chỉ vì SDK bắt trường đó phải là chuỗi khác rỗng, và <code>\'auto\'</code> ghi lại đúng cái sự thật rằng giá trị ấy vô nghĩa',
            ),
            B(
              'The bucket is silently created or resolved in Cloudflare\'s North American region group, which adds cross-region latency for European users until the bucket is recreated with the right value',
              'Bucket được âm thầm tạo ra hoặc phân giải trong nhóm vùng Bắc Mỹ của Cloudflare, và điều đó thêm độ trễ liên vùng cho người dùng châu Âu cho tới khi bucket được tạo lại với giá trị đúng',
            ),
            B(
              'Reads succeed but writes fail, because R2 only verifies the region on mutating operations; the symptom is a bucket that appears healthy in every dashboard check while every upload returns 403',
              'Đọc thì được nhưng ghi thì hỏng, vì R2 chỉ kiểm vùng ở các thao tác thay đổi dữ liệu; triệu chứng là một bucket trông khoẻ mạnh trong mọi lượt kiểm trên bảng điều khiển trong khi mọi lượt tải lên trả về 403',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The region field is a piece of SigV4 protocol machinery, not a routing instruction. It appears in the credential scope (<code>&lt;key&gt;/&lt;date&gt;/&lt;region&gt;/s3/aws4_request</code>) and in the signing key derivation, so both sides simply have to agree on the same string — which they do, because the client puts the region into the URL it signs and the server reads it back from there. R2 stores data in one global namespace, so there is nothing for the value to select and any string works. <code>\'auto\'</code> is a convention that carries information to the next reader: it says "this field is required by the SDK and ignored by the service", where <code>\'us-east-1\'</code> falsely implies a real region was chosen. On S3 the same field is genuinely load-bearing — a mismatched region there is one of the classic causes of <code>SignatureDoesNotMatch</code>, which is why copying an S3 config across without thinking is a habit worth breaking even when it happens to work. Option 1 describes real S3 behaviour transplanted onto R2. Option 3 invents region groups R2 does not have. Option 4 invents an asymmetry between reads and writes that no part of SigV4 could produce, since both are signed identically.',
            'Trường region là một mảnh máy móc của giao thức SigV4, không phải một chỉ dẫn định tuyến. Nó xuất hiện trong phạm vi credential (<code>&lt;key&gt;/&lt;ngày&gt;/&lt;region&gt;/s3/aws4_request</code>) và trong việc dẫn xuất khoá ký, nên hai bên chỉ cần thống nhất cùng một chuỗi — mà chúng thống nhất thật, vì client đặt region vào chính cái URL nó ký còn máy chủ đọc lại từ đó ra. R2 lưu dữ liệu trong một không gian tên toàn cầu duy nhất, nên chẳng có gì để giá trị ấy chọn cả và chuỗi nào cũng chạy. <code>\'auto\'</code> là một quy ước mang thông tin cho người đọc sau: nó nói "trường này do SDK bắt buộc và bị dịch vụ bỏ qua", còn <code>\'us-east-1\'</code> thì ám chỉ sai rằng một vùng thật đã được chọn. Trên S3 thì đúng cái trường đó lại thật sự gánh việc — một vùng lệch ở đó là một trong những nguyên nhân kinh điển của <code>SignatureDoesNotMatch</code>, và đó là lý do thói quen chép cấu hình S3 sang mà không nghĩ thì đáng bỏ ngay cả khi nó tình cờ chạy được. Phương án 1 mô tả hành vi có thật của S3 rồi ghép sang R2. Phương án 3 bịa ra những nhóm vùng mà R2 không có. Phương án 4 bịa ra một sự bất đối xứng giữa đọc và ghi mà không phần nào của SigV4 sinh ra nổi, vì cả hai đều được ký y hệt nhau.',
          ),
        }),

        // q11 · đáp án 2
        mcq({
          prompt: B(
            'Code migrated from S3 to R2 still sends <code>StorageClass: \'GLACIER\'</code> on archive uploads and <code>ServerSideEncryption: \'aws:kms\'</code> with a key ARN. The deploy is green, uploads return 200, and the archive costs on the R2 invoice are the same as everything else. What is going on?',
            'Đoạn mã chuyển từ S3 sang R2 vẫn gửi <code>StorageClass: \'GLACIER\'</code> ở các lượt tải lên lưu trữ và <code>ServerSideEncryption: \'aws:kms\'</code> kèm một ARN khoá. Lượt triển khai xanh, tải lên trả 200, và chi phí lưu trữ trên hoá đơn R2 giống hệt mọi thứ khác. Chuyện gì đang xảy ra?',
          ),
          options: [
            B(
              'R2 is applying both settings but does not itemise them separately on the invoice; the archive class is billed at the same headline rate and only shows a discount after ninety days of continuous storage',
              'R2 đang áp dụng cả hai thiết lập nhưng không tách chúng thành dòng riêng trên hoá đơn; lớp lưu trữ được tính ở cùng mức giá công bố và chỉ hiện phần giảm giá sau chín mươi ngày lưu liên tục',
            ),
            B(
              'The uploads are silently failing over to a default path: R2 returns 200 for the request but stores nothing under the requested key, which is why a later read of any archive object returns <code>NoSuchKey</code>',
              'Các lượt tải lên đang âm thầm rơi về một nhánh mặc định: R2 trả 200 cho request nhưng không lưu gì dưới key được yêu cầu, và đó là lý do một lượt đọc về sau lên bất kỳ object lưu trữ nào cũng trả <code>NoSuchKey</code>',
            ),
            B(
              'R2 accepts and ignores both headers: it has only one storage class and always encrypts at rest with its own key, so there is no cheaper tier to move into and no customer-managed key in play — the 200 means the request was valid, not that the request did what you meant',
              'R2 nhận rồi bỏ qua cả hai header: nó chỉ có đúng một lớp lưu trữ và luôn tự mã hoá khi lưu bằng khoá của chính nó, nên không có bậc rẻ hơn nào để chuyển vào và cũng không có khoá do khách quản lý nào tham gia — cái 200 nghĩa là request hợp lệ, chứ không nghĩa là request đã làm điều bạn muốn',
            ),
            B(
              'The headers are being stripped by the SDK rather than by R2, because <code>region: \'auto\'</code> puts the client into a compatibility mode that removes any parameter AWS marks as region-specific before signing',
              'Các header bị chính SDK cắt bỏ chứ không phải R2, vì <code>region: \'auto\'</code> đẩy client vào một chế độ tương thích, và chế độ đó gỡ mọi tham số mà AWS đánh dấu là phụ thuộc vùng trước khi ký',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the failure mode that makes "S3-compatible" a phrase to read carefully. R2 implements roughly ninety percent of the S3 API, and the missing pieces mostly do not announce themselves: an unsupported header is accepted, the request succeeds, and the semantics you asked for simply do not happen. R2 has a single storage class, so there is no <code>GLACIER</code> to move into; it encrypts every object at rest with its own key and offers no SSE-KMS or SSE-C, so a customer-managed key ARN has nothing to bind to. The invoice is the honest signal here — the archive objects cost the same as everything else because they <em>are</em> the same as everything else. The general lesson is the same one the whole course keeps returning to: a green response proves the request was well-formed, never that it had the effect you intended, and the only way to find out is to read back what was stored (<code>HeadObject</code>) or read the bill. Related silent no-ops on R2 include requester-pays and object lock. Option 1 invents a delayed discount. Option 2 invents data loss that would be far louder than this; the objects are there and readable. Option 4 blames the SDK, which signs and sends exactly the parameters you pass — the ignoring happens server-side.',
            'Đây đúng là kiểu hỏng khiến cụm "S3-compatible" trở thành một cụm phải đọc cho kỹ. R2 cài đặt khoảng chín mươi phần trăm API của S3, và những mảnh còn thiếu phần lớn không tự lên tiếng: một header không được hỗ trợ vẫn được nhận, request vẫn thành công, và cái ngữ nghĩa bạn xin thì đơn giản là không xảy ra. R2 chỉ có một lớp lưu trữ, nên không có <code>GLACIER</code> nào để chuyển vào; nó mã hoá mọi object khi lưu bằng khoá của chính nó và không cung cấp SSE-KMS hay SSE-C, nên một ARN khoá do khách quản lý chẳng có gì để bám vào. Ở đây hoá đơn mới là tín hiệu trung thực — các object lưu trữ tốn đúng bằng mọi thứ khác vì chúng ĐÚNG LÀ giống mọi thứ khác. Bài học tổng quát vẫn là cái mà cả khoá học cứ quay lại: một phản hồi xanh chứng minh rằng request được soạn đúng khuôn, chứ không bao giờ chứng minh nó có tác dụng như bạn định, và cách duy nhất để biết là đọc lại thứ đã lưu (<code>HeadObject</code>) hoặc đọc hoá đơn. Những thao tác âm thầm-không-làm-gì tương tự trên R2 còn có requester-pays và object lock. Phương án 1 bịa ra một khoản giảm giá trễ. Phương án 2 bịa ra một vụ mất dữ liệu mà nếu có thật thì đã ồn ào hơn thế nhiều; các object vẫn ở đó và đọc được. Phương án 4 đổ lỗi cho SDK, thứ vốn ký và gửi đi đúng những tham số bạn truyền vào — việc bỏ qua diễn ra ở phía máy chủ.',
          ),
        }),

        // q12 · đáp án 3
        mcq({
          prompt: B(
            'One R2 API token with Admin Read + Write on all buckets is shared by the backend, a nightly analytics worker and an admin migration script. A grep of a public CI log finds the secret. What is the shape of the incident, and what design would have contained it?',
            'Một token API của R2 với quyền Admin Read + Write trên mọi bucket đang được dùng chung bởi backend, một worker phân tích chạy đêm và một script migration của quản trị. Một lượt grep vào log CI công khai tìm thấy phần bí mật. Sự cố có hình dạng thế nào, và thiết kế nào lẽ ra đã khoanh vùng được nó?',
          ),
          options: [
            B(
              'The exposure is limited because R2 tokens are bound to the account that created them and cannot be used from another network, so the practical fix is to add an IP allow-list to the existing token and leave the three workloads sharing it',
              'Mức phơi nhiễm là hạn chế vì token R2 gắn với tài khoản đã tạo ra nó và không dùng được từ mạng khác, nên cách chữa thực dụng là thêm một danh sách IP cho phép vào token hiện có rồi cứ để ba khối công việc dùng chung',
            ),
            B(
              'Rotate the token on the next quarterly cycle: R2 tokens are short-lived by design and the leaked one expires on its own, so the urgent work is auditing which objects were read rather than revoking anything',
              'Hãy xoay token ở chu kỳ hàng quý kế tiếp: token R2 vốn thiết kế là ngắn hạn và cái bị lộ sẽ tự hết hạn, nên việc gấp là kiểm xem những object nào đã bị đọc chứ không phải thu hồi cái gì',
            ),
            B(
              'Revoking it is safe and cheap because Cloudflare keeps the previous token valid for a grace period after a new one is issued, so the three workloads can be migrated to fresh tokens one at a time with no coordinated deploy',
              'Thu hồi nó thì an toàn và rẻ vì Cloudflare giữ token cũ còn hiệu lực trong một khoảng ân hạn sau khi cấp token mới, nên ba khối công việc có thể lần lượt chuyển sang token mới mà không cần một lượt triển khai đồng bộ',
            ),
            B(
              'Any holder of that secret can read, write and delete every object in every bucket, and revoking it breaks all three workloads at once — one token per workload, each scoped to the least permission and the fewest buckets it needs, turns the same leak into "revoke one token, redeploy one service"',
              'Bất kỳ ai giữ phần bí mật đó đều đọc, ghi và xoá được mọi object trong mọi bucket, và thu hồi nó thì làm chết cả ba khối công việc cùng lúc — mỗi khối một token riêng, mỗi cái thu hẹp về mức quyền tối thiểu và số bucket ít nhất mà nó cần, sẽ biến đúng vụ rò rỉ ấy thành "thu hồi một token, triển khai lại một dịch vụ"',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Two things make this bad, and they are separate. The first is the <b>blast radius</b>: Admin Read + Write on all buckets is the maximum grant, so the leak is not "someone can read some images" but "someone can delete the bucket". The second is the <b>revocation cost</b>, and it is the one people underestimate — because three unrelated systems authenticate with the same string, killing it is an outage across all three, which is exactly the pressure that leads teams to delay revoking a known-leaked credential. Per-workload tokens fix both at once: the analytics worker gets read-only on one bucket, the backend gets read-write on the media bucket, the migration script gets a short-TTL admin token that is deleted when the job finishes. A leak then costs one revoke and one deploy, and you can act in minutes rather than scheduling it. Note also that R2 tokens are long-lived by design — they do not rotate themselves the way IAM STS credentials do, so nothing expires on its own. Option 1 invents a network binding tokens do not have, and an IP allow-list is a useful extra layer but does not shrink a grant. Option 2 is wrong on the facts and dangerous in practice: waiting a quarter with a leaked admin credential is not an audit strategy. Option 3 invents a grace period; a revoked token stops working immediately, which is the entire point of revoking it.',
            'Có hai thứ làm vụ này tệ, và chúng tách biệt nhau. Thứ nhất là <b>bán kính vụ nổ</b>: Admin Read + Write trên mọi bucket là mức cấp tối đa, nên vụ rò rỉ không phải "ai đó đọc được vài cái ảnh" mà là "ai đó xoá sạch được bucket". Thứ hai là <b>giá của việc thu hồi</b>, và đây mới là thứ người ta hay đánh giá thấp — vì ba hệ thống chẳng liên quan gì nhau lại xác thực bằng cùng một chuỗi, nên giết nó là gây sự cố cho cả ba, và chính áp lực đó khiến các đội trì hoãn việc thu hồi một credential đã biết chắc là bị lộ. Token theo từng khối công việc chữa cả hai cùng lúc: worker phân tích được quyền chỉ-đọc trên một bucket, backend được đọc-ghi trên bucket media, script migration được một token quản trị TTL ngắn và bị xoá khi job xong. Khi đó một vụ rò rỉ tốn đúng một lượt thu hồi và một lượt triển khai, và bạn hành động được trong vài phút thay vì phải xếp lịch. Cũng lưu ý rằng token R2 vốn thiết kế là dài hạn — chúng KHÔNG tự xoay như credential IAM STS, nên chẳng có gì tự hết hạn cả. Phương án 1 bịa ra một ràng buộc mạng mà token không có, và một danh sách IP cho phép là lớp bổ sung hữu ích nhưng không thu nhỏ được mức quyền đã cấp. Phương án 2 sai về sự kiện và nguy hiểm trong thực hành: chờ một quý với một credential quản trị đã bị lộ thì không phải một chiến lược kiểm toán. Phương án 3 bịa ra một khoảng ân hạn; một token bị thu hồi là ngừng hoạt động ngay lập tức, và đó chính là toàn bộ mục đích của việc thu hồi.',
          ),
        }),

        // q13 · đáp án 1
        mcq({
          prompt: B(
            'Using the published list prices in the course (storage: R2 $0.015, S3 $0.023 per GB-month; egress to internet: R2 $0, S3 $0.09/GB; Class A: R2 $4.50, S3 $5.00 per million; Class B: R2 $0.36, S3 $0.40 per million), consider two workloads of identical size: (A) a public media site serving 820 GB/month to browsers, and (B) an internal analytics pipeline that reads the same 250 GB entirely from inside the same cloud region and writes 8 million objects a month. Which statement about R2-versus-S3 holds for both?',
            'Dùng bảng giá công bố trong giáo trình (lưu trữ: R2 $0.015, S3 $0.023 mỗi GB-tháng; truyền ra internet: R2 $0, S3 $0.09/GB; Class A: R2 $4.50, S3 $5.00 mỗi triệu; Class B: R2 $0.36, S3 $0.40 mỗi triệu), xét hai khối công việc cùng kích thước: (A) một trang media công khai phục vụ 820 GB/tháng cho trình duyệt, và (B) một đường ống phân tích nội bộ đọc đúng 250 GB đó hoàn toàn từ bên trong cùng một vùng của cloud và ghi 8 triệu object mỗi tháng. Phát biểu nào về R2-so-với-S3 đúng cho cả hai?',
          ),
          options: [
            B(
              'R2 wins by roughly the same order of magnitude in both cases, because the storage rate is 35% lower and that discount applies to the whole dataset regardless of how the data is read',
              'R2 thắng với cùng một bậc độ lớn ở cả hai trường hợp, vì mức giá lưu trữ thấp hơn 35% và khoản giảm đó áp cho toàn bộ tập dữ liệu bất kể dữ liệu được đọc theo cách nào',
            ),
            B(
              'R2 wins enormously on (A) because egress is the dominant line there and R2 charges nothing for it, but on (B) the two are within a few tens of percent — with no egress, the bill is storage plus operations, and R2 is only about 10% cheaper on each of those',
              'R2 thắng áp đảo ở (A) vì truyền ra là dòng chiếm chủ đạo ở đó và R2 không tính tiền cho nó, nhưng ở (B) thì hai bên chỉ chênh nhau vài chục phần trăm — không có truyền ra thì hoá đơn chỉ còn lưu trữ cộng thao tác, và R2 chỉ rẻ hơn khoảng 10% ở mỗi khoản đó',
            ),
            B(
              'S3 wins on (B) because eight million writes a month is a Class A volume where the per-million rates invert, and AWS applies a volume discount above five million operations that Cloudflare does not offer',
              'S3 thắng ở (B) vì tám triệu lượt ghi mỗi tháng là mức Class A mà ở đó giá mỗi triệu đảo chiều, và AWS áp một khoản chiết khấu theo sản lượng trên năm triệu thao tác mà Cloudflare không có',
            ),
            B(
              'R2 wins on (B) by more than on (A), because operations are the only cost left once egress is removed and R2\'s Class A rate is where its largest proportional discount sits',
              'R2 thắng ở (B) nhiều hơn ở (A), vì thao tác là chi phí duy nhất còn lại khi đã bỏ truyền ra đi và mức giá Class A của R2 chính là chỗ có khoản chiết khấu theo tỷ lệ lớn nhất của nó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Do the arithmetic rather than repeating the headline. For (A): S3 is 250 × 0.023 = $5.75 storage plus 820 × 0.09 = $73.80 egress, about $80 before operations; R2 is 250 × 0.015 = $3.75 storage plus $0 egress. Egress is roughly ninety percent of the S3 bill, and removing it is what produces the order-of-magnitude gap the marketing pages quote. For (B) that term is gone entirely — internal reads inside the cloud do not egress — so what remains is storage ($5.75 versus $3.75) and operations (8 million Class A: $40.00 versus $36.00). Total S3 ≈ $45.75, total R2 ≈ $39.75: R2 still ahead, by around 13%, not by 13×. This is the single most important thing to carry out of the pricing chapters, and it is a Column B claim in disguise: "R2 is 46× cheaper" is true <em>where egress dominates</em>, and quoting it without that condition is how the number becomes wrong. Option 1 attributes the whole gap to the storage discount, which is the smallest of the three differences. Option 3 invents an AWS volume discount and an inversion that the given table contradicts — S3 is more expensive per million on both classes. Option 4 gets the direction backwards: the Class A gap is 10%, the smallest proportional lever of all, so removing egress narrows R2\'s advantage rather than widening it.',
            'Hãy làm phép tính thay vì nhắc lại câu tít. Với (A): S3 là 250 × 0,023 = 5,75 $ lưu trữ cộng 820 × 0,09 = 73,80 $ truyền ra, khoảng 80 $ trước khi tính thao tác; R2 là 250 × 0,015 = 3,75 $ lưu trữ cộng 0 $ truyền ra. Truyền ra chiếm chừng chín mươi phần trăm hoá đơn S3, và bỏ nó đi mới là thứ tạo ra khoảng cách một bậc độ lớn mà các trang quảng cáo trích dẫn. Với (B) thì cái số hạng đó biến mất hẳn — đọc nội bộ bên trong cloud thì không truyền ra — nên còn lại là lưu trữ (5,75 $ so với 3,75 $) và thao tác (8 triệu Class A: 40,00 $ so với 36,00 $). Tổng S3 ≈ 45,75 $, tổng R2 ≈ 39,75 $: R2 vẫn dẫn, khoảng 13%, chứ không phải 13 LẦN. Đây là điều quan trọng nhất cần mang ra khỏi các chương về giá, và nó là một khẳng định Cột B đội lốt: "R2 rẻ hơn 46 lần" đúng Ở NƠI TRUYỀN RA CHIẾM CHỦ ĐẠO, và trích nó mà bỏ điều kiện ấy chính là cách con số trở thành sai. Phương án 1 gán cả khoảng cách cho khoản giảm giá lưu trữ, vốn là cái nhỏ nhất trong ba khác biệt. Phương án 3 bịa ra một chiết khấu theo sản lượng của AWS và một sự đảo chiều mà chính bảng giá đề cho đã bác bỏ — S3 đắt hơn trên mỗi triệu ở cả hai lớp. Phương án 4 nói ngược chiều: khoảng cách Class A là 10%, đòn bẩy theo tỷ lệ nhỏ nhất trong tất cả, nên bỏ truyền ra đi là THU HẸP lợi thế của R2 chứ không nới rộng nó.',
          ),
        }),

        /* ── Chương 3 — URL và access (5 câu) ──────────────────────────── */

        // q14 · đáp án 2
        mcq({
          prompt: B(
            'An avatar URL is returned to the frontend as <code>https://&lt;account&gt;.r2.cloudflarestorage.com/media/users/42/a.jpg</code>. Reproduced against a real S3-compatible endpoint, an unauthenticated fetch of exactly that shape gives:' +
            code('$ curl -i http://127.0.0.1:19000/de-thi/co-ct.jpg\n' +
              'HTTP/1.1 403 Forbidden\n' +
              '\n' +
              '<?xml version="1.0" encoding="UTF-8"?>\n' +
              '<Error><Code>AccessDenied</Code><Message>Access Denied.</Message>\n' +
              '<Key>co-ct.jpg</Key><BucketName>de-thi</BucketName>…</Error>') +
            'What is the fix, and why is it not "make the bucket public"?',

            'Một URL ảnh đại diện được trả về cho frontend dưới dạng <code>https://&lt;account&gt;.r2.cloudflarestorage.com/media/users/42/a.jpg</code>. Dựng lại trên một endpoint S3-compatible thật, một lượt fetch không xác thực với đúng hình dạng đó cho ra:' +
            code('$ curl -i http://127.0.0.1:19000/de-thi/co-ct.jpg\n' +
              'HTTP/1.1 403 Forbidden\n' +
              '\n' +
              '<?xml version="1.0" encoding="UTF-8"?>\n' +
              '<Error><Code>AccessDenied</Code><Message>Access Denied.</Message>\n' +
              '<Key>co-ct.jpg</Key><BucketName>de-thi</BucketName>…</Error>') +
            'Cách chữa là gì, và vì sao nó không phải là "cho bucket thành công khai"?',
          ),
          options: [
            B(
              'Have the frontend attach the access key as a query parameter so the browser request is authenticated the way the SDK is; the API endpoint is the canonical address of the object and every other URL is a redirect to it',
              'Cho frontend gắn access key vào chuỗi truy vấn để request của trình duyệt được xác thực giống như SDK; endpoint API mới là địa chỉ chính danh của object và mọi URL khác chỉ là một lượt chuyển hướng tới nó',
            ),
            B(
              'Return a presigned GET URL for every avatar: it is the only address a browser can fetch without credentials, and its short expiry is what keeps the media private',
              'Trả về một URL GET đã ký sẵn cho mỗi ảnh đại diện: đó là địa chỉ duy nhất mà trình duyệt lấy được mà không cần thông tin xác thực, và hạn ngắn của nó chính là thứ giữ cho media riêng tư',
            ),
            B(
              'Return the custom-domain URL instead — the API endpoint requires a SigV4 signature that a plain <code>&lt;img&gt;</code> tag cannot produce, while the custom domain is the CDN-fronted, cacheable, zero-egress path built for exactly this; "make the bucket public" is a different and much larger decision, because a public bucket exposes every key, not just the avatars',
              'Hãy trả về URL của tên miền tuỳ chỉnh — endpoint API đòi một chữ ký SigV4 mà một thẻ <code>&lt;img&gt;</code> trơn không tạo nổi, còn tên miền tuỳ chỉnh mới là đường đi qua CDN, lưu đệm được, không mất phí truyền ra, và nó sinh ra đúng cho việc này; "cho bucket thành công khai" lại là một quyết định khác và lớn hơn nhiều, vì một bucket công khai phơi ra MỌI key chứ không riêng các ảnh đại diện',
            ),
            B(
              'Proxy the object through your own API: the backend already holds the credentials, so a route that streams the bytes to the browser removes the signature problem and gives you per-user authorisation for free',
              'Hãy cho object đi vòng qua chính API của bạn: backend vốn đã giữ thông tin xác thực, nên một tuyến chảy các byte về trình duyệt vừa gỡ được vấn đề chữ ký vừa cho bạn phân quyền theo từng người dùng miễn phí',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The measured 403 is the whole diagnosis: the API endpoint answers only to signed requests, and a browser rendering <code>&lt;img src&gt;</code> sends nothing but the plain GET. Note the <code>Code</code> too — <code>AccessDenied</code>, not <code>NoSuchKey</code>: the object is right there, the request simply has no identity attached. The custom domain exists precisely to be the browser-facing address: no signature, cached at the edge so most reads never reach the origin at all, and zero egress. That is three wins at once, and it is why <code>buildPublicUrl(key)</code> should be the only function the API layer ever calls when handing a URL to a client. The distractor worth taking seriously is the last one, because proxying does work — it is just the expensive way: every byte now crosses your server twice, you pay the bandwidth, you lose the CDN, and a 500 MB video download occupies a Node process. Proxying is the right answer only when you need per-request authorisation, and then the standard shape is to authorise and hand back a presigned URL rather than stream the body. Option 1 puts a long-lived secret in the browser, the exact mistake the GIF-picker incident in this repo was made of. Option 2 confuses the two access models: presigned URLs are for genuinely private objects, are not cacheable (the signature makes every URL unique), and regenerating one per avatar per page load is a lot of work to serve a public image.',
            'Cái 403 đo được chính là toàn bộ chẩn đoán: endpoint API chỉ trả lời những request đã ký, còn một trình duyệt đang dựng <code>&lt;img src&gt;</code> thì chẳng gửi gì ngoài một lệnh GET trơn. Cũng để ý trường <code>Code</code> — <code>AccessDenied</code> chứ không phải <code>NoSuchKey</code>: object nằm ngay đó, chỉ là request không mang theo danh tính nào. Tên miền tuỳ chỉnh tồn tại chính là để làm địa chỉ hướng-về-trình-duyệt: không cần chữ ký, được lưu đệm ở biên nên phần lớn lượt đọc chẳng bao giờ chạm tới gốc, và không mất phí truyền ra. Đó là ba khoản thắng cùng lúc, và đó là lý do <code>buildPublicUrl(key)</code> phải là hàm DUY NHẤT mà tầng API gọi khi trao một URL cho client. Phương án nhiễu đáng xem xét nghiêm túc là cái cuối, vì cho đi vòng qua server thì CÓ chạy được — chỉ là nó là cách đắt đỏ: giờ mỗi byte băng qua máy chủ của bạn hai lần, bạn trả tiền băng thông, bạn mất CDN, và một lượt tải video 500 MB chiếm luôn một tiến trình Node. Cho đi vòng chỉ là đáp án đúng khi bạn cần phân quyền theo từng request, và khi đó hình dạng chuẩn là phân quyền rồi trao lại một URL đã ký sẵn chứ không phải chảy phần thân về. Phương án 1 đặt một bí mật dài hạn vào trình duyệt, đúng cái sai lầm làm nên sự cố bộ chọn GIF trong chính kho này. Phương án 2 lẫn lộn hai mô hình truy cập: URL đã ký sẵn dành cho những object riêng tư thật sự, không lưu đệm được (chữ ký làm mọi URL trở nên khác nhau), và sinh lại một cái cho mỗi ảnh đại diện ở mỗi lượt tải trang là quá nhiều công sức để phục vụ một tấm ảnh công khai.',
          ),
        }),

        // q15 · đáp án 0
        mcq({
          prompt: B(
            'The <code>MediaFile</code> table stores a full <code>url</code> column: <code>https://media.cuongthai.com/users/42/a.jpg</code>. Six months later the custom domain changes and the CDN in front of the bucket is replaced. What is the cost of that schema decision, and what should it have been?',
            'Bảng <code>MediaFile</code> lưu nguyên một cột <code>url</code>: <code>https://media.cuongthai.com/users/42/a.jpg</code>. Sáu tháng sau tên miền tuỳ chỉnh đổi và CDN đứng trước bucket bị thay. Quyết định lược đồ ấy tốn cái gì, và lẽ ra nó phải là gì?',
          ),
          options: [
            B(
              'Every stored URL is now wrong and must be rewritten by a migration over the whole table, and any URL already copied into a post body, an email or a cached page stays broken; store only the <code>key</code> and build the URL at read time from configuration, so a domain change is a redeploy rather than a data migration',
              'Mọi URL đã lưu giờ đều sai và phải viết lại bằng một lượt migration trên toàn bảng, còn bất kỳ URL nào đã bị chép vào thân một bài viết, một email hay một trang đã lưu đệm thì vẫn hỏng; hãy chỉ lưu <code>key</code> và dựng URL lúc đọc từ cấu hình, để một lượt đổi tên miền là một lượt triển khai lại chứ không phải một lượt migration dữ liệu',
            ),
            B(
              'There is no real cost as long as the old domain keeps resolving: point a CNAME from the old host to the new one and every stored URL keeps working indefinitely, which is why storing the full URL is the more robust choice',
              'Chẳng có phí tổn thật nào miễn là tên miền cũ còn phân giải được: trỏ một CNAME từ host cũ sang host mới là mọi URL đã lưu vẫn chạy vô thời hạn, và đó là lý do lưu nguyên URL mới là lựa chọn bền hơn',
            ),
            B(
              'The cost is only in storage size — a URL column is roughly four times the bytes of a key column across millions of rows — so the fix is to compress the prefix, not to change what the column means',
              'Phí tổn chỉ nằm ở kích thước lưu trữ — một cột URL nặng khoảng gấp bốn lần một cột key khi trải trên hàng triệu dòng — nên cách chữa là nén phần tiền tố lại chứ không phải đổi ý nghĩa của cột',
            ),
            B(
              'The URLs keep working because the object itself is addressed by key on the storage side; only the CDN cache is invalidated by the change, so the migration needed is a cache purge rather than a schema change',
              'Các URL vẫn chạy được vì bản thân object được định địa chỉ theo key ở phía lưu trữ; thay đổi ấy chỉ làm mất hiệu lực bộ đệm CDN, nên thứ cần làm là một lượt xoá đệm chứ không phải đổi lược đồ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The rule is about which facts are stable. The <b>key</b> is an intrinsic property of the object — it is what the storage service was told to call those bytes, and it does not change when your infrastructure does. Everything to the left of the key is deployment configuration: which domain fronts the bucket, which CDN sits in front of it, whether you are on staging or production. Freezing a piece of configuration into a million database rows means every future infrastructure change becomes a data migration, run under a lock, with a rollback plan, on a table your application is reading. Building the URL at read time — one <code>buildPublicUrl(key)</code> function reading one environment variable — makes the same change a config edit. There is a second, sharper cost the option names: URLs escape. Once <code>https://media.cuongthai.com/...</code> has been pasted into a post body, mailed to a user, or stored in someone else\'s cache, no migration of your table can reach it, which is an argument for keeping the public domain stable regardless. Option 2 is a real mitigation, not a design: it works until the old domain is not renewed, and it does not help when the path shape changes rather than the host. Option 3 measures the trivial cost and misses the structural one. Option 4 is simply wrong about what changed — the host in the stored string no longer resolves to anything serving that bucket.',
            'Quy tắc ở đây là về việc sự kiện nào thì ổn định. <b>Key</b> là thuộc tính nội tại của object — nó là cái tên mà bạn đã bảo dịch vụ lưu trữ gọi chỗ byte đó, và nó không đổi khi hạ tầng của bạn đổi. Mọi thứ nằm bên trái cái key đều là cấu hình triển khai: tên miền nào đứng trước bucket, CDN nào ngồi phía trước nó, bạn đang ở staging hay production. Đóng băng một mảnh cấu hình vào một triệu dòng cơ sở dữ liệu nghĩa là mọi thay đổi hạ tầng trong tương lai đều trở thành một lượt migration dữ liệu, chạy dưới khoá, kèm kế hoạch quay lui, trên một cái bảng mà ứng dụng của bạn đang đọc. Dựng URL lúc đọc — một hàm <code>buildPublicUrl(key)</code> đọc một biến môi trường — biến đúng thay đổi đó thành một lượt sửa cấu hình. Còn một phí tổn thứ hai sắc hơn mà phương án nêu ra: URL thì trốn thoát được. Một khi <code>https://media.cuongthai.com/...</code> đã bị dán vào thân một bài viết, gửi qua email cho người dùng, hay nằm trong bộ đệm của người khác thì không lượt migration nào trên bảng của bạn với tới được nó, và đó là một lý lẽ để giữ tên miền công khai cho ổn định bất kể thế nào. Phương án 2 là một biện pháp giảm nhẹ có thật chứ không phải một thiết kế: nó chạy được cho tới khi tên miền cũ không được gia hạn, và nó chẳng giúp gì khi hình dạng đường dẫn đổi chứ không phải host đổi. Phương án 3 đo cái phí tổn tầm thường mà bỏ sót cái phí tổn cấu trúc. Phương án 4 đơn giản là sai về việc cái gì đã đổi — cái host nằm trong chuỗi đã lưu không còn phân giải được tới thứ gì đang phục vụ bucket đó nữa.',
          ),
        }),

        // q16 · đáp án 1
        mcq({
          prompt: B(
            'Avatars are uploaded to a stable key and served with <code>Cache-Control: public, max-age=86400</code>. Users complain that a new avatar takes a day to appear. Two proposals are on the table: (i) drop the TTL to 60 seconds, or (ii) keep <code>max-age=31536000, immutable</code> but write each new avatar to a new key such as <code>users/42/avatar-1789234567.jpg</code> and update the database. Which is right, and why?',
            'Ảnh đại diện được tải lên một key cố định và phục vụ kèm <code>Cache-Control: public, max-age=86400</code>. Người dùng than rằng ảnh mới mất một ngày mới hiện. Có hai đề xuất: (i) hạ TTL xuống 60 giây, hoặc (ii) giữ <code>max-age=31536000, immutable</code> nhưng ghi mỗi ảnh mới vào một key mới kiểu <code>users/42/avatar-1789234567.jpg</code> rồi cập nhật cơ sở dữ liệu. Cái nào đúng, và vì sao?',
          ),
          options: [
            B(
              '(i), because a one-minute TTL is the only proposal that fixes the stale copies already sitting in every visitor\'s browser; (ii) changes what future uploads look like but leaves today\'s cached avatars stale for the rest of their original day',
              '(i), vì TTL một phút là đề xuất duy nhất chữa được những bản cũ đang nằm sẵn trong trình duyệt của mọi khách; (ii) chỉ đổi hình dạng của các lượt tải lên tương lai còn để mặc những ảnh đại diện đã lưu đệm hôm nay cũ đi hết phần ngày còn lại của chúng',
            ),
            B(
              '(ii), because it removes the conflict instead of tuning it: if the URL changes whenever the content changes, then any URL can be cached forever and there is nothing to invalidate — the page simply points at a different address, which is instant for every viewer',
              '(ii), vì nó GỠ BỎ mâu thuẫn thay vì tinh chỉnh mâu thuẫn: nếu URL đổi mỗi khi nội dung đổi thì mọi URL đều lưu đệm được vĩnh viễn và chẳng có gì để phải xoá hiệu lực — trang chỉ đơn giản trỏ vào một địa chỉ khác, và điều đó là tức thì với mọi người xem',
            ),
            B(
              '(i), because <code>immutable</code> is advisory and browsers revalidate an image anyway when the page that references it is reloaded, so (ii) buys nothing over a short TTL while adding a key-management burden',
              '(i), vì <code>immutable</code> chỉ mang tính khuyến nghị và trình duyệt dù sao cũng xác thực lại một tấm ảnh khi trang tham chiếu nó được tải lại, nên (ii) chẳng mua thêm gì so với một TTL ngắn mà lại thêm gánh nặng quản lý key',
            ),
            B(
              'Neither: the correct fix is to purge the CDN on every avatar upload, which is instant, applies to visitors who already have the old copy, and avoids both the extra origin traffic of (i) and the orphaned keys of (ii)',
              'Không cái nào: cách chữa đúng là xoá đệm CDN ở mỗi lượt tải ảnh đại diện, thứ vừa tức thì, vừa áp được cho những khách đã có bản cũ, vừa tránh được cả lưu lượng gốc dư thừa của (i) lẫn các key mồ côi của (ii)',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Caching is a bet that a URL and its bytes stay married. Tuning the TTL is negotiating how long you are willing to be wrong; changing the URL when the bytes change means you are never wrong. That is why versioned keys plus <code>max-age=31536000, immutable</code> is the pattern every static-asset pipeline converged on — the hash or timestamp in the filename <em>is</em> the cache invalidation. Under (ii) the new avatar is at an address nobody has ever cached, so it appears immediately for every viewer, including those holding the old copy, while the CDN still serves both at full efficiency. Under (i) you have merely shortened the wrong window from a day to a minute, and you have done it by paying for a revalidation on every image, on every page, forever. Option 1 raises a genuine transition concern — copies already cached under the old key do stay stale for their remaining lifetime — but that is a one-time cost that any fix shares, and it argues for shortening the TTL <em>now</em> and moving to versioned keys, not for living on a short TTL permanently. Option 3 is wrong on the mechanics: <code>immutable</code> exists precisely to suppress the revalidation that a normal reload triggers. Option 4 describes a real tool with real limits — purging is per-URL, rate-limited (Cloudflare\'s free plan allows 30 a day), asynchronous, and useless for a browser that already holds the object; it is the fallback for when you cannot version a URL, not the design.',
            'Lưu đệm là một canh bạc rằng một URL và chỗ byte của nó còn ở với nhau. Tinh chỉnh TTL là mặc cả xem bạn chịu SAI trong bao lâu; đổi URL khi byte đổi nghĩa là bạn không bao giờ sai. Đó là lý do key có phiên bản cộng <code>max-age=31536000, immutable</code> là cái mẫu mà mọi đường ống tài nguyên tĩnh đều hội tụ về — chính cái băm hay cái dấu thời gian trong tên file LÀ phép xoá hiệu lực bộ đệm. Với (ii), ảnh đại diện mới nằm ở một địa chỉ chưa ai từng lưu đệm, nên nó hiện ra NGAY LẬP TỨC với mọi người xem, kể cả những người đang giữ bản cũ, trong khi CDN vẫn phục vụ cả hai với hiệu suất tối đa. Với (i), bạn chỉ mới rút ngắn cái cửa sổ sai từ một ngày xuống một phút, và bạn làm được thế bằng cách trả tiền cho một lượt xác thực lại trên mọi tấm ảnh, ở mọi trang, mãi mãi. Phương án 1 nêu một lo ngại chuyển tiếp có thật — những bản đã lưu đệm dưới key cũ ĐÚNG LÀ vẫn cũ cho tới hết đời của chúng — nhưng đó là phí tổn một lần mà cách chữa nào cũng phải chịu, và nó là lý lẽ để rút TTL xuống NGAY BÂY GIỜ rồi chuyển sang key có phiên bản, chứ không phải để sống với TTL ngắn vĩnh viễn. Phương án 3 sai về cơ chế: <code>immutable</code> tồn tại chính là để chặn cái lượt xác thực lại mà một lần tải lại trang bình thường kích hoạt. Phương án 4 mô tả một công cụ có thật với những giới hạn có thật — xoá đệm là theo từng URL, bị giới hạn tần suất (gói miễn phí của Cloudflare cho 30 lượt mỗi ngày), chạy bất đồng bộ, và vô dụng với một trình duyệt vốn đã giữ sẵn object; nó là phương án lùi cho khi bạn không đánh phiên bản được URL, chứ không phải cái thiết kế.',
          ),
        }),

        // q17 · đáp án 3
        mcq({
          prompt: B(
            'To save work, an endpoint generates a presigned GET URL with <code>expiresIn: 600</code> for each paid-course PDF and caches it in the <code>Lesson</code> row so later requests can return it without re-signing. What goes wrong?',
            'Để đỡ việc, một endpoint sinh một URL GET đã ký sẵn với <code>expiresIn: 600</code> cho mỗi PDF của khoá học trả phí rồi lưu nó vào dòng <code>Lesson</code> để những request sau trả về luôn mà khỏi ký lại. Cái gì hỏng?',
          ),
          options: [
            B(
              'The cached URL keeps working but bypasses the entitlement check, so a user who unenrols still downloads the file; the fix is to re-verify enrolment on every request while continuing to reuse the stored URL',
              'URL đã lưu vẫn chạy nhưng nó đi vòng qua phép kiểm quyền học, nên một người đã huỷ ghi danh vẫn tải được file; cách chữa là kiểm lại quyền ghi danh ở mỗi request trong khi vẫn dùng lại cái URL đã lưu',
            ),
            B(
              'The signature is bound to the requesting client, so the second user to be handed the cached URL gets a <code>SignatureDoesNotMatch</code> while the first keeps working — a bug that only appears once two people open the same lesson',
              'Chữ ký gắn với chính client đã yêu cầu, nên người thứ hai được trao cái URL đã lưu sẽ nhận <code>SignatureDoesNotMatch</code> trong khi người thứ nhất vẫn dùng được — một lỗi chỉ lộ ra khi có hai người cùng mở một bài học',
            ),
            B(
              'Nothing, provided the cache TTL is shorter than <code>expiresIn</code>: storing it for under ten minutes is a legitimate optimisation, and the real mistake would be caching it for hours',
              'Chẳng có gì, miễn là TTL của bộ đệm ngắn hơn <code>expiresIn</code>: lưu nó dưới mười phút là một tối ưu chính đáng, còn sai lầm thật thì phải là lưu nó hàng giờ',
            ),
            B(
              'The URL expires ten minutes after it was <em>signed</em>, not after it was handed out, so from the eleventh minute onwards every user gets a 403 whose body reads <code>Request has expired</code> — and the URL is a bearer token, so anyone who obtains the cached string downloads the paid file without ever authenticating',
              'URL hết hạn sau mười phút kể từ lúc nó được KÝ, không phải kể từ lúc nó được trao đi, nên từ phút thứ mười một trở đi mọi người dùng đều nhận một cái 403 có thân ghi <code>Request has expired</code> — và cái URL ấy là một token dạng bearer, nên bất kỳ ai lấy được chuỗi đã lưu đều tải được file trả phí mà không cần xác thực gì cả',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Two separate failures, and the second is worse than the first. The <b>timing</b> failure is that <code>X-Amz-Date</code> and <code>X-Amz-Expires</code> are baked into the URL at signing time; the clock starts then, not when the client receives it. Cache the string and you are serving a credential that is already partly spent, and after ten minutes it is spent entirely — the exact response measured for an over-age presigned URL is <b>403</b> with <code>&lt;Code&gt;AccessDenied&lt;/Code&gt;&lt;Message&gt;Request has expired&lt;/Message&gt;</code>. The <b>security</b> failure is structural: a presigned URL carries its own authorisation. It is a bearer token in a query string, and storing it in a shared row means anyone who can read that row — a log line, a support tool, a leaky API serialiser — holds the file. Signing is cheap: it is an HMAC over a few hundred bytes, entirely local, with no network call, so there is nothing to optimise away. Verify entitlement, sign, return, forget. Option 1 spots a real requirement (re-check entitlement) but keeps the cached URL, which leaves both defects. Option 2 invents a client binding; SigV4 signs the request, not the requester, which is exactly why the URL is transferable and therefore dangerous. Option 3 treats it as a tuning question and misses that a URL signed at minute 0 and served at minute 9 leaves the user sixty seconds.',
            'Hai cú hỏng tách biệt, và cái thứ hai tệ hơn cái thứ nhất. Cú hỏng về <b>thời gian</b> là <code>X-Amz-Date</code> và <code>X-Amz-Expires</code> được nướng cứng vào URL ngay lúc ký; đồng hồ bắt đầu chạy từ lúc đó, không phải từ lúc client nhận được. Lưu cái chuỗi ấy lại là bạn đang phục vụ một credential đã tiêu mất một phần, và sau mười phút thì tiêu sạch — phản hồi chính xác đo được cho một URL đã ký sẵn quá tuổi là <b>403</b> với <code>&lt;Code&gt;AccessDenied&lt;/Code&gt;&lt;Message&gt;Request has expired&lt;/Message&gt;</code>. Cú hỏng về <b>bảo mật</b> thì mang tính cấu trúc: một URL đã ký sẵn tự mang theo quyền của chính nó. Nó là một token dạng bearer nằm trong chuỗi truy vấn, và lưu nó vào một dòng dùng chung nghĩa là bất kỳ ai đọc được dòng đó — một dòng log, một công cụ hỗ trợ, một bộ tuần tự hoá API hở — đều đang giữ cái file. Việc ký thì rẻ: nó là một phép HMAC trên vài trăm byte, hoàn toàn cục bộ, không có lời gọi mạng nào, nên chẳng có gì để mà tối ưu bỏ đi cả. Kiểm quyền, ký, trả về, quên đi. Phương án 1 nhìn ra một yêu cầu có thật (kiểm lại quyền) nhưng vẫn giữ cái URL đã lưu, tức là để nguyên cả hai khiếm khuyết. Phương án 2 bịa ra một ràng buộc với client; SigV4 ký cái REQUEST chứ không ký người yêu cầu, và đó chính xác là lý do cái URL chuyển nhượng được và vì thế mà nguy hiểm. Phương án 3 coi đây là một câu chuyện tinh chỉnh và bỏ sót rằng một URL ký ở phút 0 rồi phục vụ ở phút 9 thì chỉ còn để lại cho người dùng sáu mươi giây.',
          ),
        }),

        // q18 · đáp án 2
        mcq({
          prompt: B(
            'A feature needs a "share this file until next month" link, so a developer writes <code>getSignedUrl(client, cmd, { expiresIn: 30 * 24 * 3600 })</code>. Measured result, with the endpoint being a local S3-compatible server that never received a request:' +
            code('$ node share.mjs\n' +
              'Error: Signature version 4 presigned URLs must have an\n' +
              '       expiration date less than one week in the future') +
            'What does this transcript establish?',

            'Một tính năng cần một liên kết "chia sẻ file này tới tháng sau", nên một lập trình viên viết <code>getSignedUrl(client, cmd, { expiresIn: 30 * 24 * 3600 })</code>. Kết quả đo được, với đích là một máy chủ S3-compatible cục bộ mà chưa hề nhận một request nào:' +
            code('$ node share.mjs\n' +
              'Error: Signature version 4 presigned URLs must have an\n' +
              '       expiration date less than one week in the future') +
            'Đoạn ghi này xác lập điều gì?',
          ),
          options: [
            B(
              'That the destination rejected the request: the ceiling is enforced by the storage service, so the same call against a provider with a longer maximum would have produced a working URL',
              'Rằng phía đích đã từ chối request: cái trần do dịch vụ lưu trữ thi hành, nên đúng lời gọi đó nhắm vào một nhà cung cấp có mức tối đa dài hơn sẽ cho ra một URL chạy được',
            ),
            B(
              'That the seven-day ceiling is a limitation of this particular SDK version, which a hand-rolled signer would not have — the protocol allows any expiry as long as both sides agree on the value in <code>X-Amz-Expires</code>',
              'Rằng cái trần bảy ngày là hạn chế của riêng phiên bản SDK này, thứ mà một bộ ký tự viết tay sẽ không có — giao thức cho phép hạn bất kỳ miễn là hai bên thống nhất giá trị trong <code>X-Amz-Expires</code>',
            ),
            B(
              'That the seven-day ceiling belongs to SigV4 presigning itself, not to any one provider: the error is thrown locally before a single byte reaches the network, so a long-lived share link must be built from your own token plus a redirect, not from a longer <code>expiresIn</code>',
              'Rằng cái trần bảy ngày thuộc về chính cơ chế ký sẵn của SigV4 chứ không thuộc về một nhà cung cấp nào: lỗi được ném ra tại chỗ trước khi một byte nào ra tới mạng, nên một liên kết chia sẻ dài hạn phải được dựng từ token của chính bạn cộng một lượt chuyển hướng, chứ không phải từ một <code>expiresIn</code> dài hơn',
            ),
            B(
              'That the value overflowed: <code>30 * 24 * 3600</code> exceeds the signed 32-bit range the <code>X-Amz-Expires</code> field is serialised into, and the SDK is reporting the overflow with a misleading message about one week',
              'Rằng giá trị đã tràn: <code>30 * 24 * 3600</code> vượt quá dải 32-bit có dấu mà trường <code>X-Amz-Expires</code> được tuần tự hoá vào, và SDK đang báo cáo cú tràn đó bằng một thông điệp gây hiểu nhầm về một tuần',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The most informative detail is <em>where</em> the error came from: the call threw locally, with no request in flight, against an endpoint that never heard about it. That rules out "the provider said no" — this is a rule the signing algorithm enforces on itself, and it holds identically on AWS S3, on R2, and on the local server used for this measurement. The course phrases the limit as "R2 max is 7 days", which reads as a provider-specific quirk; the measurement says otherwise, and it is worth knowing because it means no amount of provider-shopping will move it. The practical consequence shapes the feature: a link that must survive a month cannot be a presigned URL. Build it as your own opaque token, stored in your database with an expiry you control, behind a route that authorises the token and then issues a short-lived presigned URL and redirects to it. You get arbitrary lifetimes, revocation, and an audit trail — none of which a presigned URL can give you, since it cannot be revoked once handed out. Option 1 is contradicted by the transcript, where nothing was sent. Option 2 mistakes a protocol rule for an SDK opinion; a hand-rolled signer that emitted a 30-day <code>X-Amz-Expires</code> would simply be rejected by the server instead. Option 4 invents an overflow: 2,592,000 is nowhere near a 32-bit limit, and the message is precise, not misleading.',
            'Chi tiết nhiều thông tin nhất là chỗ lỗi ĐẾN TỪ ĐÂU: lời gọi ném ngay tại chỗ, không có request nào đang bay, nhắm vào một endpoint chưa hề nghe nói tới nó. Điều đó loại trừ khả năng "nhà cung cấp nói không" — đây là một quy tắc mà chính thuật toán ký tự áp lên mình, và nó đúng y hệt trên AWS S3, trên R2, và trên máy chủ cục bộ dùng cho phép đo này. Giáo trình diễn đạt giới hạn ấy là "R2 max là 7 ngày", nghe như một nét riêng của nhà cung cấp; phép đo nói khác, và điều đó đáng biết vì nó nghĩa là có đi tìm nhà cung cấp khác cũng chẳng dịch được cái trần. Hệ quả thực dụng định hình luôn cả tính năng: một liên kết phải sống một tháng thì không thể là một URL đã ký sẵn. Hãy dựng nó thành token mờ của riêng bạn, lưu trong cơ sở dữ liệu với một hạn do bạn kiểm soát, đặt sau một tuyến làm nhiệm vụ xác thực token rồi mới cấp một URL đã ký sẵn ngắn hạn và chuyển hướng tới đó. Bạn được thời hạn tuỳ ý, được quyền thu hồi, và được một dấu vết kiểm toán — không thứ nào trong đó mà một URL đã ký sẵn cho bạn được, vì nó không thể bị thu hồi một khi đã trao đi. Phương án 1 bị chính đoạn ghi bác bỏ, nơi chẳng có gì được gửi đi cả. Phương án 2 nhầm một quy tắc giao thức thành một ý kiến của SDK; một bộ ký tự viết tay mà phát ra <code>X-Amz-Expires</code> 30 ngày thì đơn giản là sẽ bị chính máy chủ từ chối. Phương án 4 bịa ra một cú tràn: 2.592.000 còn xa mới tới giới hạn 32-bit, và thông điệp thì chính xác chứ không gây hiểu nhầm.',
          ),
        }),

        /* ── Chương 4 — bảo mật presigned upload (6 câu) ───────────────── */

        // q19 · đáp án 0
        mcq({
          prompt: B(
            'A backend signs an upload URL for a video. This is the whole exchange, measured:' +
            code('# backend\n' +
              "getSignedUrl(client, new PutObjectCommand({\n" +
              "  Bucket, Key: 'a/x.mp4', ContentType: 'video/mp4',\n" +
              '}), { expiresIn: 600 })\n' +
              '\n' +
              '# URL sinh ra chua:  …&X-Amz-SignedHeaders=host&…\n' +
              '\n' +
              '# client, gui MOT kieu KHAC han\n' +
              "fetch(url, { method: 'PUT',\n" +
              "  headers: { 'Content-Type': 'text/html' },\n" +
              '  body: "<script>alert(1)</script>" })\n' +
              '  --> 200 OK\n' +
              '\n' +
              "HeadObject Key='a/x.mp4' -> ContentType: text/html") +
            'Why did the server accept a type the backend never authorised?',

            'Một backend ký một URL tải lên cho một video. Đây là toàn bộ cuộc trao đổi, đã đo:' +
            code('# backend\n' +
              "getSignedUrl(client, new PutObjectCommand({\n" +
              "  Bucket, Key: 'a/x.mp4', ContentType: 'video/mp4',\n" +
              '}), { expiresIn: 600 })\n' +
              '\n' +
              '# URL sinh ra chua:  …&X-Amz-SignedHeaders=host&…\n' +
              '\n' +
              '# client, gui MOT kieu KHAC han\n' +
              "fetch(url, { method: 'PUT',\n" +
              "  headers: { 'Content-Type': 'text/html' },\n" +
              '  body: "<script>alert(1)</script>" })\n' +
              '  --> 200 OK\n' +
              '\n' +
              "HeadObject Key='a/x.mp4' -> ContentType: text/html") +
            'Vì sao máy chủ nhận một kiểu mà backend chưa bao giờ cho phép?',
          ),
          options: [
            B(
              'Because <code>X-Amz-SignedHeaders=host</code> says the signature covers only the <code>host</code> header: the <code>ContentType</code> passed to <code>PutObjectCommand</code> became a mere default for the stored object, and any header the signature does not cover can be replaced by the uploader without invalidating it',
              'Vì <code>X-Amz-SignedHeaders=host</code> nói rằng chữ ký chỉ phủ mỗi header <code>host</code>: cái <code>ContentType</code> truyền vào <code>PutObjectCommand</code> đã trở thành một giá trị mặc định cho object được lưu, và bất kỳ header nào chữ ký không phủ đều bị bên tải lên thay thế được mà chữ ký vẫn hợp lệ',
            ),
            B(
              'Because the signature covers the request body rather than the headers, and the body the client sent was small enough to fall under the <code>UNSIGNED-PAYLOAD</code> threshold where content checks are skipped entirely',
              'Vì chữ ký phủ phần thân request chứ không phủ các header, và phần thân mà client gửi đủ nhỏ để rơi xuống dưới ngưỡng <code>UNSIGNED-PAYLOAD</code>, nơi mọi phép kiểm nội dung bị bỏ qua hoàn toàn',
            ),
            B(
              'Because a presigned PUT authorises the key rather than the content, by design: content type is metadata the uploader owns, and the intended defence is to validate the type server-side after the upload completes',
              'Vì một lệnh PUT đã ký sẵn, theo thiết kế, cho phép cái KEY chứ không cho phép nội dung: kiểu nội dung là siêu dữ liệu thuộc về bên tải lên, và phòng tuyến đúng là kiểm kiểu ở phía máy chủ sau khi lượt tải lên hoàn tất',
            ),
            B(
              'Because <code>fetch</code> lowercases header names before sending while the SDK signs them capitalised, so the two spellings never match and the check silently passes; using <code>XMLHttpRequest</code> instead would have produced the 403',
              'Vì <code>fetch</code> hạ tên header về chữ thường trước khi gửi trong khi SDK ký chúng ở dạng viết hoa, nên hai lối viết không bao giờ khớp và phép kiểm âm thầm lọt; dùng <code>XMLHttpRequest</code> thay thế thì đã ra 403',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Read <code>X-Amz-SignedHeaders</code> as the security contract, because that is exactly what it is: it enumerates which headers the signature commits to, and by default the presigner commits to <code>host</code> and nothing else. Everything else on the request is unsigned and therefore free for the uploader to choose. The <code>ContentType</code> you passed to <code>PutObjectCommand</code> did not vanish — it set a default for the object — but it was never turned into a constraint, so a client that sends a different one is not tampering with anything the server is checking. The measurement shows the full consequence: 200 OK, and the object now sits under a key your app believes is a video while carrying <code>text/html</code>. Serve that key from a domain and a visitor executes the attacker\'s script on your origin — stored XSS, from a bucket, with no code of yours involved. The fix is one line and it is the subject of the next question. Option 2 misreads <code>UNSIGNED-PAYLOAD</code>: it means the body hash is deliberately excluded from the signature at any size, which is a separate weakening and not a size threshold. Option 3 states the current behaviour as if it were intended policy; post-hoc validation is a fine second layer but it leaves a window during which the object is live and dangerous. Option 4 invents a case-sensitivity bug — HTTP header names are case-insensitive and SigV4 lowercases them before signing.',
            'Hãy đọc <code>X-Amz-SignedHeaders</code> như một bản hợp đồng bảo mật, vì nó đúng là như vậy: nó liệt kê những header nào mà chữ ký cam kết, và mặc định thì bộ ký sẵn chỉ cam kết <code>host</code> chứ không cam kết gì khác. Mọi thứ còn lại trên request đều không được ký và vì thế bên tải lên tự do chọn. Cái <code>ContentType</code> bạn truyền vào <code>PutObjectCommand</code> không biến mất — nó đặt một giá trị mặc định cho object — nhưng nó chưa bao giờ được biến thành một RÀNG BUỘC, nên một client gửi một kiểu khác thì chẳng hề can thiệp vào thứ gì mà máy chủ đang kiểm. Phép đo cho thấy trọn vẹn hệ quả: 200 OK, và giờ object nằm dưới một key mà ứng dụng của bạn tin là video trong khi nó mang <code>text/html</code>. Phục vụ cái key đó từ một tên miền là một người khách chạy luôn script của kẻ tấn công trên chính origin của bạn — stored XSS, xuất phát từ một bucket, không có dòng mã nào của bạn tham gia. Cách chữa dài một dòng và là chủ đề của câu tiếp theo. Phương án 2 đọc sai <code>UNSIGNED-PAYLOAD</code>: nó nghĩa là băm phần thân bị CỐ Ý loại khỏi chữ ký ở mọi kích thước, đó là một chỗ yếu riêng chứ không phải một ngưỡng kích thước. Phương án 3 phát biểu hành vi hiện tại như thể đó là chính sách có chủ đích; kiểm tra sau khi tải lên là một lớp thứ hai tốt nhưng nó để lại một cửa sổ thời gian mà object đang sống và đang nguy hiểm. Phương án 4 bịa ra một lỗi phân biệt hoa thường — tên header HTTP không phân biệt hoa thường và SigV4 hạ chúng về chữ thường trước khi ký.',
          ),
        }),

        // q20 · đáp án 3
        mcq({
          prompt: B(
            'The same upload path after the fix, measured against a live S3-compatible endpoint:' +
            code("getSignedUrl(client, cmd, {\n" +
              '  expiresIn: 600,\n' +
              "  signableHeaders: new Set(['host', 'content-type']),\n" +
              '})\n' +
              '# URL: …&X-Amz-SignedHeaders=content-type%3Bhost&…\n' +
              '\n' +
              "PUT voi Content-Type: text/html  -> 403\n" +
              '<?xml version="1.0" encoding="UTF-8"?>\n' +
              '<Error><Code>SignatureDoesNotMatch</Code><Message>The request\n' +
              'signature we calculated does not match the signature you\n' +
              'provided. Check your key and signing method.</Message>…</Error>\n' +
              '\n' +
              "PUT voi Content-Type: video/mp4  -> 200 OK\n" +
              '  ETag: "a908874e147ecadf944a9b524ab69b34"') +
            'How does adding one header name to a set produce a 403?',

            'Cùng đường tải lên đó sau khi vá, đo trên một endpoint S3-compatible đang sống:' +
            code("getSignedUrl(client, cmd, {\n" +
              '  expiresIn: 600,\n' +
              "  signableHeaders: new Set(['host', 'content-type']),\n" +
              '})\n' +
              '# URL: …&X-Amz-SignedHeaders=content-type%3Bhost&…\n' +
              '\n' +
              "PUT voi Content-Type: text/html  -> 403\n" +
              '<?xml version="1.0" encoding="UTF-8"?>\n' +
              '<Error><Code>SignatureDoesNotMatch</Code><Message>The request\n' +
              'signature we calculated does not match the signature you\n' +
              'provided. Check your key and signing method.</Message>…</Error>\n' +
              '\n' +
              "PUT voi Content-Type: video/mp4  -> 200 OK\n" +
              '  ETag: "a908874e147ecadf944a9b524ab69b34"') +
            'Thêm một cái tên header vào một tập hợp thì sinh ra 403 bằng cách nào?',
          ),
          options: [
            B(
              'The server now compares the uploaded <code>Content-Type</code> against an allow-list attached to the URL and rejects anything outside it; the signature itself is unchanged, and the same effect could be had by validating the type in a bucket policy condition',
              'Máy chủ giờ đối chiếu <code>Content-Type</code> được tải lên với một danh sách cho phép gắn kèm URL rồi từ chối bất cứ thứ gì nằm ngoài; bản thân chữ ký không đổi, và cũng tác dụng ấy có thể đạt được bằng cách kiểm kiểu trong một điều kiện của bucket policy',
            ),
            B(
              'The SDK now sends the content type twice — once in the query string and once as a header — and the server refuses the request when the two disagree, which is why an identical pair passes and a mismatched pair fails',
              'SDK giờ gửi kiểu nội dung hai lần — một lần trong chuỗi truy vấn và một lần dưới dạng header — và máy chủ từ chối request khi hai chỗ đó bất đồng, nên một cặp giống nhau thì lọt còn một cặp lệch nhau thì hỏng',
            ),
            B(
              'Adding the header switches the presigner from <code>UNSIGNED-PAYLOAD</code> to a body hash, so the 403 is really about the body bytes differing from what was signed rather than about the header at all',
              'Thêm cái header đó làm bộ ký sẵn chuyển từ <code>UNSIGNED-PAYLOAD</code> sang băm phần thân, nên cái 403 thật ra là về việc các byte thân khác với thứ đã được ký chứ hoàn toàn không phải về cái header',
            ),
            B(
              'The header is now part of the canonical request the signature is computed over, so the server recomputes the signature from the <code>Content-Type</code> it actually received; a different value yields a different signature, it does not match the one in the URL, and the request is refused before any object is written',
              'Header đó giờ là một phần của canonical request mà chữ ký được tính trên đó, nên máy chủ tính lại chữ ký từ chính cái <code>Content-Type</code> nó THẬT SỰ nhận được; một giá trị khác cho ra một chữ ký khác, nó không khớp cái nằm trong URL, và request bị từ chối trước khi có object nào được ghi',
            ),
          ],
          correct: 3,
          explanation: EX(
            'SigV4 is a commitment scheme, and <code>signableHeaders</code> chooses what is committed. Adding <code>content-type</code> puts the line <code>content-type:video/mp4</code> into the canonical request, which is hashed into the string-to-sign, which is HMAC-ed into the signature that travels in <code>X-Amz-Signature</code>. The server does not "check" the header against anything; it rebuilds the same canonical request from the request it actually received and recomputes the signature. Send <code>text/html</code> and the canonical request differs by nine characters, so the hash differs, so the signature differs, so nothing matches — hence <code>SignatureDoesNotMatch</code>, a 403, and no object written. That is the crucial property: this is not validation after the fact, it is refusal before the write. Two things follow for the client. It must send <b>exactly</b> the content type the backend signed — this repo\'s frontend passes the same <code>file.type</code> to <code>/presign-r2</code> and to <code>setRequestHeader</code> for precisely this reason — and adding any other signed header later (<code>content-length</code> to pin the size, <code>x-amz-meta-*</code> to pin metadata) works the same way. Option 1 invents an allow-list feature; the URL carries a signature, not a policy. Option 2 invents a duplicate transmission; the content type appears only as a header, and only its name appears in the query string. Option 3 confuses two independent knobs — the payload stays <code>UNSIGNED-PAYLOAD</code>, and the measurement shows the same body failing and succeeding depending only on the header.',
            'SigV4 là một lược đồ cam kết, và <code>signableHeaders</code> chọn xem cái gì được cam kết. Thêm <code>content-type</code> là đưa dòng <code>content-type:video/mp4</code> vào canonical request, thứ được băm vào string-to-sign, thứ được HMAC thành cái chữ ký đi trong <code>X-Amz-Signature</code>. Máy chủ không "kiểm" cái header đó với thứ gì cả; nó DỰNG LẠI đúng canonical request ấy từ chính request nó nhận được rồi TÍNH LẠI chữ ký. Gửi <code>text/html</code> thì canonical request khác đi chín ký tự, nên băm khác, nên chữ ký khác, nên chẳng khớp gì — do đó là <code>SignatureDoesNotMatch</code>, một cái 403, và không object nào được ghi. Đó mới là tính chất then chốt: đây không phải kiểm tra sau khi việc đã rồi, đây là từ chối TRƯỚC khi ghi. Hai điều theo sau cho phía client. Nó phải gửi CHÍNH XÁC cái kiểu nội dung mà backend đã ký — frontend của kho này truyền cùng một <code>file.type</code> vào <code>/presign-r2</code> và vào <code>setRequestHeader</code> đúng vì lý do đó — và việc thêm bất kỳ header được ký nào khác về sau (<code>content-length</code> để ghim kích thước, <code>x-amz-meta-*</code> để ghim siêu dữ liệu) cũng hoạt động theo đúng cách ấy. Phương án 1 bịa ra một tính năng danh sách cho phép; cái URL mang theo một chữ ký chứ không mang một chính sách. Phương án 2 bịa ra một lượt truyền trùng lặp; kiểu nội dung chỉ xuất hiện dưới dạng header, còn trong chuỗi truy vấn chỉ có TÊN của nó. Phương án 3 lẫn hai cái núm độc lập — phần thân vẫn là <code>UNSIGNED-PAYLOAD</code>, và phép đo cho thấy cùng một phần thân lúc hỏng lúc được, khác nhau duy nhất ở cái header.',
          ),
        }),

        // q21 · đáp án 1
        mcq({
          prompt: B(
            'Two presigned URLs from the same code, differing only in options. Their query strings contain, respectively:' +
            code('A:  X-Amz-SignedHeaders=host\n' +
              'B:  X-Amz-SignedHeaders=content-type%3Bhost') +
            'A reviewer asks what the second value tells them, and whether the order and casing matter.',

            'Hai URL đã ký sẵn từ cùng một đoạn mã, chỉ khác nhau ở phần tuỳ chọn. Chuỗi truy vấn của chúng lần lượt chứa:' +
            code('A:  X-Amz-SignedHeaders=host\n' +
              'B:  X-Amz-SignedHeaders=content-type%3Bhost') +
            'Một người review hỏi giá trị thứ hai nói cho họ điều gì, và thứ tự với cách viết hoa có quan trọng không.',
          ),
          options: [
            B(
              'It lists the headers the server will echo back on the response, in the order it will emit them; the value is informational, so a reviewer can read it but neither its content nor its order affects whether a request is accepted',
              'Nó liệt kê những header mà máy chủ sẽ vọng lại trên phản hồi, theo đúng thứ tự nó sẽ phát ra; giá trị này mang tính thông tin, nên người review đọc được nó nhưng cả nội dung lẫn thứ tự đều không ảnh hưởng tới việc request có được nhận hay không',
            ),
            B(
              'It is the exact list of headers folded into the signature — <code>%3B</code> is a percent-encoded semicolon, and SigV4 requires the names lowercased and sorted, which is why <code>content-type</code> precedes <code>host</code>; B is the secure form because a client cannot change a listed header without invalidating the signature',
              'Đó là danh sách chính xác những header được gộp vào chữ ký — <code>%3B</code> là dấu chấm phẩy đã mã hoá phần trăm, và SigV4 bắt các tên phải viết thường và sắp xếp, nên <code>content-type</code> đứng trước <code>host</code>; B là dạng an toàn vì client không đổi được một header đã liệt kê mà chữ ký còn hợp lệ',
            ),
            B(
              'It names the headers the client is <em>required</em> to send: B therefore fails if the client omits <code>Content-Type</code> but succeeds with any value it does send, since the list constrains presence rather than content',
              'Nó nêu tên những header mà client BẮT BUỘC phải gửi: vì thế B sẽ hỏng nếu client bỏ sót <code>Content-Type</code> nhưng lại thành công với bất kỳ giá trị nào nó gửi, vì danh sách ràng buộc sự CÓ MẶT chứ không ràng buộc nội dung',
            ),
            B(
              'It records which headers the SDK stripped before signing, so B means <code>content-type</code> was removed from the request; the secure form is actually A, where only <code>host</code> was stripped and the content type survived into the signature',
              'Nó ghi lại những header mà SDK đã cắt bỏ trước khi ký, nên B nghĩa là <code>content-type</code> đã bị gỡ khỏi request; dạng an toàn thật ra là A, nơi chỉ có <code>host</code> bị gỡ còn kiểu nội dung sống sót vào trong chữ ký',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This one field is the fastest security review you can do on a presigned upload, so it is worth being able to read it fluently. The separator is a semicolon, percent-encoded as <code>%3B</code> because it appears inside a query-string value. The names are lowercased and sorted lexicographically, which is not cosmetic — the server rebuilds the canonical request using exactly this list, in exactly this order, so any other spelling would produce a different hash and a different signature. <code>content-type</code> sorts before <code>host</code>, hence the order you see. Reading A tells you at a glance that only the host is committed and every other header is the uploader\'s to choose; reading B tells you the content type is pinned. When you audit an upload endpoint, this is the field to grep for. Option 1 confuses it with response headers, which are governed by <code>Access-Control-Expose-Headers</code> on the CORS side and by nothing at all on the signing side. Option 3 gets closer but stops one step short: the list constrains the exact <em>value</em>, not merely presence — that is why the same URL accepts <code>video/mp4</code> and refuses <code>text/html</code>. Option 4 inverts the meaning entirely; nothing is stripped, and A is the vulnerable form.',
            'Riêng cái trường này là lượt review bảo mật nhanh nhất bạn có thể làm với một lượt tải lên đã ký sẵn, nên đáng để đọc nó cho trôi chảy. Dấu phân cách là dấu chấm phẩy, mã hoá phần trăm thành <code>%3B</code> vì nó nằm bên trong một giá trị của chuỗi truy vấn. Các tên được viết thường và sắp xếp theo từ điển, và điều đó không phải để cho đẹp — máy chủ dựng lại canonical request bằng ĐÚNG danh sách này, theo ĐÚNG thứ tự này, nên bất kỳ lối viết nào khác cũng cho ra một băm khác và một chữ ký khác. <code>content-type</code> sắp trước <code>host</code>, nên bạn thấy thứ tự như vậy. Đọc A là biết ngay chỉ mỗi host được cam kết còn mọi header khác thuộc quyền chọn của bên tải lên; đọc B là biết kiểu nội dung đã bị ghim. Khi bạn rà một endpoint tải lên thì đây chính là cái trường cần grep. Phương án 1 lẫn nó với header của phản hồi, thứ do <code>Access-Control-Expose-Headers</code> quản ở phía CORS và chẳng do gì quản ở phía ký. Phương án 3 đến gần hơn nhưng dừng sớm một bước: danh sách ràng buộc chính cái GIÁ TRỊ chứ không chỉ ràng buộc sự có mặt — và đó là lý do cùng một URL nhận <code>video/mp4</code> mà từ chối <code>text/html</code>. Phương án 4 đảo ngược hoàn toàn ý nghĩa; chẳng có gì bị cắt bỏ cả, và A mới là dạng có lỗ hổng.',
          ),
        }),

        // q22 · đáp án 2
        mcq({
          prompt: B(
            'After the <code>signableHeaders</code> fix ships, uploads start failing for one group of users with 403 <code>SignatureDoesNotMatch</code>. The frontend does:' +
            code("// 1) xin URL\n" +
              "const { uploadUrl } = await api.post('/files/presign-r2', {\n" +
              "  contentType: file.type,\n" +
              '});\n' +
              '\n' +
              "// 2) tai len\n" +
              "await axios.put(uploadUrl, file);   // khong dat header nao") +
            'The failing files are all <code>.heic</code> photos taken on iPhone. What is happening?',

            'Sau khi bản vá <code>signableHeaders</code> lên production, các lượt tải lên bắt đầu hỏng với một nhóm người dùng, trả 403 <code>SignatureDoesNotMatch</code>. Frontend làm thế này:' +
            code("// 1) xin URL\n" +
              "const { uploadUrl } = await api.post('/files/presign-r2', {\n" +
              "  contentType: file.type,\n" +
              '});\n' +
              '\n' +
              "// 2) tai len\n" +
              "await axios.put(uploadUrl, file);   // khong dat header nao") +
            'Các file hỏng đều là ảnh <code>.heic</code> chụp trên iPhone. Chuyện gì đang xảy ra?',
          ),
          options: [
            B(
              'HEIC is not in the list of types the storage service accepts, so the signature is computed over a type the server rejects at validation time; registering the MIME type on the bucket resolves it',
              'HEIC không nằm trong danh sách kiểu mà dịch vụ lưu trữ chấp nhận, nên chữ ký được tính trên một kiểu mà máy chủ từ chối ở bước kiểm; đăng ký kiểu MIME đó trên bucket là xong',
            ),
            B(
              'The presigned URL expired between the two calls because HEIC files are large and the browser spends time reading them; raising <code>expiresIn</code> for image uploads fixes the group that is failing',
              'URL đã ký sẵn hết hạn ở khoảng giữa hai lời gọi vì file HEIC nặng và trình duyệt mất thời gian đọc chúng; nâng <code>expiresIn</code> cho các lượt tải ảnh lên là chữa được nhóm đang hỏng',
            ),
            B(
              'The two <code>Content-Type</code> values no longer agree: browsers commonly report an empty <code>file.type</code> for <code>.heic</code>, so the backend signs the empty string while <code>axios</code> infers and sends something else — send the exact same string in both places, and pick an explicit fallback when <code>file.type</code> is empty',
              'Hai giá trị <code>Content-Type</code> không còn khớp nhau: trình duyệt thường báo <code>file.type</code> RỖNG cho <code>.heic</code>, nên backend ký chuỗi rỗng trong khi <code>axios</code> tự suy ra rồi gửi một thứ khác — hãy gửi ĐÚNG cùng một chuỗi ở cả hai chỗ, và chọn một giá trị lùi tường minh khi <code>file.type</code> rỗng',
            ),
            B(
              'Signing an empty content type is invalid under SigV4, so the backend produces a malformed URL for those files; the presigner should refuse to sign when <code>contentType</code> is falsy, which turns the 403 into a clear 400 at request time',
              'Ký một kiểu nội dung rỗng là không hợp lệ theo SigV4, nên backend tạo ra một URL méo cho những file đó; bộ ký sẵn nên từ chối ký khi <code>contentType</code> là giá trị rỗng, và như thế cái 403 sẽ thành một cái 400 rõ ràng ngay lúc gửi request',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Pinning the content type turns a piece of metadata into part of the contract, and a contract has two sides. The backend signed whatever string arrived in <code>contentType</code>; for <code>.heic</code> on several browsers that string is <code>""</code>, because the browser has no MIME mapping for the extension. Then <code>axios.put(url, file)</code> sets its own <code>Content-Type</code> — it will not send an empty one — so the request carries a value the signature was not computed over. Different canonical request, different signature, 403. Nothing is wrong with HEIC, the URL, or the fix; the two halves simply stopped agreeing, and they only started disagreeing for files where the browser volunteers nothing. The correct shape is to compute one value and use it twice: <code>const ct = file.type || \'application/octet-stream\'</code>, send <code>ct</code> to the presign endpoint, and set <code>ct</code> as the request header. Option 1 invents a per-bucket MIME registry that does not exist — a bucket stores any string as a content type. Option 2 is a plausible-sounding timing story but the transcript is a signature failure, and an expired URL has a different body: <code>AccessDenied</code> / <code>Request has expired</code>. Option 4 is wrong on the protocol — an empty header value signs perfectly well — though its instinct to fail loudly and early is right, and choosing a fallback is the better version of that instinct.',
            'Ghim kiểu nội dung là biến một mảnh siêu dữ liệu thành một phần của hợp đồng, mà hợp đồng thì có hai bên. Backend đã ký bất kỳ chuỗi nào tới trong <code>contentType</code>; với <code>.heic</code> trên vài trình duyệt thì chuỗi đó là <code>""</code>, vì trình duyệt không có ánh xạ MIME nào cho phần mở rộng ấy. Rồi <code>axios.put(url, file)</code> tự đặt <code>Content-Type</code> của nó — nó sẽ không gửi một giá trị rỗng — nên request mang theo một giá trị mà chữ ký không hề được tính trên đó. Canonical request khác, chữ ký khác, 403. Chẳng có gì sai với HEIC, với cái URL, hay với bản vá; đơn giản là hai nửa thôi không còn khớp nhau nữa, và chúng chỉ bắt đầu lệch ở đúng những file mà trình duyệt không tự nguyện khai gì. Hình dạng đúng là tính MỘT giá trị rồi dùng nó hai lần: <code>const ct = file.type || \'application/octet-stream\'</code>, gửi <code>ct</code> tới endpoint ký sẵn, và đặt <code>ct</code> làm header của request. Phương án 1 bịa ra một sổ đăng ký MIME theo bucket không hề tồn tại — một bucket lưu bất kỳ chuỗi nào làm kiểu nội dung. Phương án 2 là một câu chuyện thời gian nghe hợp lý nhưng đoạn ghi là một cú hỏng chữ ký, còn một URL hết hạn thì có thân khác hẳn: <code>AccessDenied</code> / <code>Request has expired</code>. Phương án 4 sai về giao thức — một giá trị header rỗng ký được hoàn toàn bình thường — dù bản năng "hỏng cho to và hỏng sớm" của nó là đúng, và chọn một giá trị lùi chính là phiên bản tốt hơn của bản năng ấy.',
          ),
        }),

        // q23 · đáp án 0
        mcq({
          prompt: B(
            'A 500 MB video upload consistently fails, while a 20 MB one succeeds, on a stack where the client POSTs the file to <code>/api/v1/files</code> and the Express backend forwards it to the bucket. The site is behind Cloudflare on the free plan. What is the shape of the problem and the standard fix?',
            'Một lượt tải video 500 MB lúc nào cũng hỏng, còn một lượt 20 MB thì được, trên một hệ mà client POST file lên <code>/api/v1/files</code> rồi backend Express chuyển tiếp nó sang bucket. Trang web đứng sau Cloudflare gói miễn phí. Vấn đề có hình dạng thế nào và cách chữa chuẩn là gì?',
          ),
          options: [
            B(
              'The request body is capped by the proxy in front of your server (100 MB on the free and pro plans) and the backend also has to hold the file, so the fix is not to raise a limit but to remove your server from the data path: presign a PUT and have the browser upload straight to the bucket, then have it tell your API the key when it finishes',
              'Phần thân request bị chặn trần bởi chính cái proxy đứng trước máy chủ của bạn (100 MB ở gói miễn phí và gói pro), mà backend lại còn phải giữ cả file, nên cách chữa không phải là nâng một giới hạn lên mà là GỠ máy chủ của bạn ra khỏi đường dữ liệu: ký sẵn một lệnh PUT rồi để trình duyệt tải thẳng lên bucket, xong thì cho nó báo key về cho API của bạn',
            ),
            B(
              'The bucket rejects single objects above a few hundred megabytes, so the file must be split client-side into multipart chunks before it is sent; the proxy in front is not involved because it streams request bodies without buffering them',
              'Bucket từ chối những object đơn lẻ trên vài trăm megabyte, nên file phải được chia thành các phần multipart ở phía client trước khi gửi đi; cái proxy đứng trước không liên quan vì nó chảy phần thân request qua mà không đệm lại',
            ),
            B(
              'The upload is timing out rather than being rejected: 500 MB over a typical connection exceeds the default socket timeout, so raising it on both the proxy and the Express server lets the same architecture work unchanged',
              'Lượt tải lên đang quá hạn chờ chứ không phải bị từ chối: 500 MB qua một đường truyền thông thường vượt quá hạn chờ socket mặc định, nên nâng nó lên ở cả proxy lẫn máy chủ Express là kiến trúc hiện tại chạy được nguyên si',
            ),
            B(
              'The backend runs out of memory because Express buffers the body, so switching the route to a streaming parser that pipes directly to the bucket solves it without changing the client at all',
              'Backend hết bộ nhớ vì Express đệm cả phần thân, nên chuyển tuyến đó sang một bộ phân giải theo dòng chảy thẳng vào bucket là xong mà không phải đổi gì ở phía client',
            ),
          ],
          correct: 0,
          explanation: EX(
            'There are two independent ceilings on this path and the fix has to clear both. The first is the proxy: Cloudflare caps request bodies at 100 MB on free and pro plans, and it does so before your server sees anything, so no Express configuration can help. The second is your own process, which is holding a large file while it forwards it. Raising limits attacks the symptom and leaves the architecture — every byte still travels twice (client to you, you to the bucket), you pay for the bandwidth, and one upload occupies a worker. The presigned direct upload deletes the whole problem: the backend authenticates the user and signs a URL, the browser sends the bytes straight to the bucket in a single hop, and the backend hears about it again only in a small "here is the key" call. Two things come with it — the bucket needs a CORS policy allowing PUT from your origin, and the signature must pin the content type — which is what the rest of this chapter is about. Option 2 invents a bucket limit; single-request PUT tops out around 5 GB, well above 500 MB. Option 3 misreads a hard rejection as a timeout; the proxy answers with a 413 and does not wait. Option 4 fixes the real but secondary memory problem and leaves the 100 MB cap fully intact, so the 500 MB upload still fails.',
            'Trên đường đi này có hai cái trần độc lập và cách chữa phải dọn được cả hai. Cái thứ nhất là proxy: Cloudflare chặn phần thân request ở 100 MB với gói miễn phí và gói pro, và nó làm việc đó TRƯỚC khi máy chủ của bạn thấy được gì, nên không cấu hình Express nào cứu được. Cái thứ hai là chính tiến trình của bạn, đang phải ôm một file lớn trong lúc chuyển tiếp nó. Nâng giới hạn là đánh vào triệu chứng và để nguyên kiến trúc — mỗi byte vẫn đi hai lượt (client tới bạn, bạn tới bucket), bạn vẫn trả tiền băng thông, và một lượt tải lên vẫn chiếm một worker. Lượt tải lên trực tiếp bằng URL ký sẵn xoá luôn cả vấn đề: backend xác thực người dùng rồi ký một URL, trình duyệt gửi các byte thẳng tới bucket trong một chặng duy nhất, và backend chỉ nghe lại về nó trong một lời gọi nhỏ kiểu "đây là cái key". Kèm theo đó là hai thứ — bucket cần một CORS policy cho phép PUT từ origin của bạn, và chữ ký phải ghim kiểu nội dung — và đó là nội dung của phần còn lại trong chương này. Phương án 2 bịa ra một giới hạn của bucket; một lệnh PUT trong một request có trần khoảng 5 GB, cao hơn 500 MB rất nhiều. Phương án 3 đọc nhầm một lượt từ chối dứt khoát thành một lượt quá hạn chờ; proxy trả lời bằng một cái 413 chứ không ngồi đợi. Phương án 4 chữa cái vấn đề bộ nhớ có thật nhưng chỉ là thứ yếu, còn cái trần 100 MB thì vẫn nguyên vẹn, nên lượt tải 500 MB vẫn hỏng.',
          ),
        }),

        // q24 · đáp án 1
        mcq({
          prompt: B(
            'A reviewer argues: "we already pass <code>ContentType</code> to <code>PutObjectCommand</code>, so the type is set by the server and the client cannot influence it — <code>signableHeaders</code> is belt-and-braces." What is the precise reason this is wrong?',
            'Một người review lập luận: "chúng ta đã truyền <code>ContentType</code> vào <code>PutObjectCommand</code> rồi, nên kiểu là do máy chủ đặt và client không tác động được — <code>signableHeaders</code> chỉ là thắt lưng thêm dây đeo." Lý do chính xác khiến lập luận này sai là gì?',
          ),
          options: [
            B(
              'Because <code>PutObjectCommand</code> is a client-side builder whose fields are never transmitted when presigning: only the URL crosses the wire, so nothing you set on the command reaches the server and the stored type is always whatever the uploader sends',
              'Vì <code>PutObjectCommand</code> là một bộ dựng ở phía client mà các trường của nó không bao giờ được truyền đi khi ký sẵn: chỉ có cái URL băng qua đường dây, nên chẳng thứ gì bạn đặt trên command tới được máy chủ và kiểu được lưu luôn là thứ bên tải lên gửi',
            ),
            B(
              'Because presigning splits the command into two parts: what goes into the signature and what becomes a default. Without <code>content-type</code> in <code>signableHeaders</code> the field is only a default the uploader\'s own header overrides, and a measured PUT of <code>text/html</code> against such a URL returns 200 with the object stored as <code>text/html</code>',
              'Vì việc ký sẵn xẻ cái command làm hai phần: phần đi vào chữ ký và phần trở thành giá trị mặc định. Không có <code>content-type</code> trong <code>signableHeaders</code> thì trường ấy chỉ là một giá trị mặc định mà header của chính bên tải lên ghi đè lên, và một lượt PUT đã đo với <code>text/html</code> lên đúng loại URL đó trả về 200 với object được lưu là <code>text/html</code>',
            ),
            B(
              'Because the field is honoured only on a direct <code>client.send()</code> call and presigning drops it entirely, so the object is stored with <code>application/octet-stream</code> regardless of what either side asked for',
              'Vì trường đó chỉ được tôn trọng ở một lời gọi <code>client.send()</code> trực tiếp còn việc ký sẵn thì bỏ nó đi hoàn toàn, nên object được lưu với <code>application/octet-stream</code> bất kể hai bên có xin gì đi nữa',
            ),
            B(
              'Because the server takes the type from the object\'s extension when the two disagree, so a <code>.mp4</code> key is stored as video no matter what header arrives — which is safe here but fails as soon as keys are UUIDs with no extension',
              'Vì máy chủ lấy kiểu từ phần mở rộng của object khi hai bên bất đồng, nên một key <code>.mp4</code> được lưu là video bất kể header nào tới — điều đó an toàn ở đây nhưng hỏng ngay khi các key là UUID không có phần mở rộng',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The reviewer\'s mental model is that the command describes the write. It does — but presigning cuts that description in two. Fields that end up in the canonical request are <em>enforced</em>: change them and the signature breaks. Fields that do not are merely <em>defaults</em>: they apply if the uploader stays silent and are overridden the moment the uploader speaks. <code>ContentType</code> lands in the second category unless you ask for it in <code>signableHeaders</code>, and that is not a theoretical distinction — it was measured: with only <code>host</code> signed, a PUT carrying <code>Content-Type: text/html</code> was accepted with 200 and <code>HeadObject</code> afterwards reported <code>ContentType: text/html</code>. So the field is neither ignored nor enforced, which is the most dangerous of the three possibilities, because the code reads as though it is safe. This is also why "we set it on the command" is a review comment that should always be answered by grepping the generated URL for <code>X-Amz-SignedHeaders</code> — the URL, not the code, is where the contract is written. Option 1 overshoots: the field does reach the server, as the default it becomes. Option 3 contradicts the measurement, which shows the type stored as sent, not as octet-stream. Option 4 invents extension sniffing that no S3-compatible service performs; the key is an opaque string.',
            'Mô hình trong đầu người review là "cái command mô tả phép ghi". Đúng là thế — nhưng việc ký sẵn xẻ đôi cái mô tả ấy. Những trường rơi vào canonical request thì được THI HÀNH: đổi chúng là vỡ chữ ký. Những trường không rơi vào đó thì chỉ là GIÁ TRỊ MẶC ĐỊNH: chúng có tác dụng nếu bên tải lên im lặng, và bị ghi đè ngay khoảnh khắc bên tải lên lên tiếng. <code>ContentType</code> rơi vào loại thứ hai trừ khi bạn xin nó trong <code>signableHeaders</code>, và đó không phải một phân biệt lý thuyết — nó đã được đo: khi chỉ ký mỗi <code>host</code>, một lệnh PUT mang <code>Content-Type: text/html</code> được nhận với 200 và <code>HeadObject</code> sau đó báo <code>ContentType: text/html</code>. Vậy nên cái trường ấy không bị bỏ qua mà cũng không được thi hành, và đó là khả năng nguy hiểm nhất trong ba khả năng, bởi vì đoạn mã ĐỌC LÊN như thể nó an toàn. Đây cũng là lý do "chúng ta có đặt nó trên command rồi" là một dòng review luôn nên được trả lời bằng cách grep cái URL sinh ra để tìm <code>X-Amz-SignedHeaders</code> — hợp đồng nằm ở cái URL, không nằm ở đoạn mã. Phương án 1 đi quá đà: cái trường đó CÓ tới được máy chủ, dưới dạng giá trị mặc định mà nó trở thành. Phương án 3 mâu thuẫn với phép đo, thứ cho thấy kiểu được lưu đúng như đã gửi chứ không phải octet-stream. Phương án 4 bịa ra việc ngửi phần mở rộng mà không dịch vụ S3-compatible nào làm; cái key chỉ là một chuỗi mờ.',
          ),
        }),

        /* ── Chương 5 — CORS (6 câu) ───────────────────────────────────── */

        // q25 · đáp án 3
        mcq({
          prompt: B(
            'A browser upload to a bucket fails. The console shows a CORS error, and the storage provider\'s request log for that minute contains no PUT at all — not even a rejected one. A colleague concludes the log is broken. What actually happened?',
            'Một lượt tải lên từ trình duyệt vào bucket bị hỏng. Console hiện lỗi CORS, và log request của nhà cung cấp lưu trữ ở phút đó không có lệnh PUT nào cả — kể cả một lệnh bị từ chối. Một đồng nghiệp kết luận rằng log bị hỏng. Chuyện gì thật sự đã xảy ra?',
          ),
          options: [
            B(
              'The PUT was sent and rejected, but a request refused on CORS grounds is dropped before the logging layer sees it, so an absent entry is the normal signature of a CORS rejection on the server side',
              'Lệnh PUT đã được gửi và đã bị từ chối, nhưng một request bị chối vì lý do CORS thì bị vứt trước khi tầng ghi log nhìn thấy nó, nên một mục vắng mặt chính là dấu hiệu bình thường của một lượt từ chối CORS ở phía máy chủ',
            ),
            B(
              'The PUT was sent with the browser stripping its <code>Origin</code> header, so the provider logged it under an anonymous bucket-level entry that the per-key log query did not match',
              'Lệnh PUT đã được gửi với việc trình duyệt cắt bỏ header <code>Origin</code> của nó, nên nhà cung cấp ghi nó vào một mục ẩn danh ở cấp bucket mà truy vấn log theo từng key không khớp tới',
            ),
            B(
              'The upload never reached the network because the SDK validates the bucket\'s CORS configuration locally before issuing a cross-origin request, and refuses when the origin is not listed',
              'Lượt tải lên chưa bao giờ ra tới mạng vì SDK tự kiểm cấu hình CORS của bucket ngay tại chỗ trước khi phát một request khác origin, và nó từ chối khi origin không nằm trong danh sách',
            ),
            B(
              'The browser sent a preflight <code>OPTIONS</code>, did not get an acceptable answer, and therefore never issued the PUT at all — the log is correct, and the request to diagnose is the OPTIONS, not the PUT',
              'Trình duyệt đã gửi một lượt preflight <code>OPTIONS</code>, không nhận được câu trả lời chấp nhận được, và vì thế chưa bao giờ phát lệnh PUT ra cả — log là đúng, và cái request cần chẩn đoán là lệnh OPTIONS chứ không phải lệnh PUT',
            ),
          ],
          correct: 3,
          explanation: EX(
            'CORS is enforced by the browser, on behalf of the user, and for a non-simple request it is enforced <em>in advance</em>. A PUT carrying <code>Content-Type: image/jpeg</code> is not a simple request, so the browser first sends an <code>OPTIONS</code> asking permission, naming the method it intends in <code>Access-Control-Request-Method</code> and the headers in <code>Access-Control-Request-Headers</code>. If the answer does not allow both, the browser stops there. The PUT is never composed, never sent, and never seen by anyone — so an empty server log is the correct observation, not a broken one. Two practical consequences follow. First, look at the OPTIONS in the Network tab, not the PUT you expected: comparing the request\'s <code>Origin</code> / <code>Access-Control-Request-Method</code> / <code>Access-Control-Request-Headers</code> against the response\'s <code>Access-Control-Allow-*</code> is a three-way diff that names the problem in seconds. Second, <code>curl</code> ignores CORS entirely, so "it works in curl" tells you the bucket and credentials are fine and says nothing about the browser path. Option 1 invents a logging order; providers log what arrives, and nothing arrived. Option 2 invents header stripping — <code>Origin</code> is added by the browser, not removed. Option 3 gives the SDK a capability it does not have: nothing client-side reads the bucket\'s CORS policy, which is why the check has to be the preflight.',
            'CORS do TRÌNH DUYỆT thi hành, thay mặt người dùng, và với một request không-đơn-giản thì nó thi hành TỪ TRƯỚC. Một lệnh PUT mang <code>Content-Type: image/jpeg</code> không phải request đơn giản, nên trình duyệt gửi trước một lệnh <code>OPTIONS</code> để xin phép, nêu tên phương thức nó định dùng trong <code>Access-Control-Request-Method</code> và các header trong <code>Access-Control-Request-Headers</code>. Nếu câu trả lời không cho phép cả hai thì trình duyệt dừng ngay tại đó. Lệnh PUT không bao giờ được soạn ra, không bao giờ được gửi đi, và không ai nhìn thấy nó — nên một cái log rỗng là quan sát ĐÚNG chứ không phải một cái log hỏng. Hai hệ quả thực dụng theo sau. Một, hãy nhìn vào lệnh OPTIONS trong tab Network chứ đừng nhìn lệnh PUT bạn đang mong: so <code>Origin</code> / <code>Access-Control-Request-Method</code> / <code>Access-Control-Request-Headers</code> của request với các <code>Access-Control-Allow-*</code> của phản hồi là một phép so ba chiều gọi tên được vấn đề trong vài giây. Hai, <code>curl</code> hoàn toàn phớt lờ CORS, nên "chạy được bằng curl" chỉ nói cho bạn biết bucket và thông tin xác thực đều ổn, và chẳng nói gì về đường đi của trình duyệt. Phương án 1 bịa ra một thứ tự ghi log; nhà cung cấp ghi lại thứ TỚI NƠI, mà chẳng có gì tới nơi cả. Phương án 2 bịa ra việc cắt header — <code>Origin</code> là do trình duyệt THÊM VÀO chứ không phải gỡ đi. Phương án 3 trao cho SDK một khả năng nó không có: chẳng có gì ở phía client đọc được CORS policy của bucket, và đó chính là lý do phép kiểm buộc phải là lượt preflight.',
          ),
        }),

        // q26 · đáp án 2
        mcq({
          prompt: B(
            'A real preflight against a live S3-compatible endpoint, copied verbatim:' +
            code("$ curl -i -X OPTIONS \\\n" +
              "    -H 'Origin: https://cuongthai.com' \\\n" +
              "    -H 'Access-Control-Request-Method: PUT' \\\n" +
              "    -H 'Access-Control-Request-Headers: content-type' \\\n" +
              '    http://127.0.0.1:19000/de-thi/a/y.mp4\n' +
              '\n' +
              'HTTP/1.1 204 No Content\n' +
              'Access-Control-Allow-Credentials: true\n' +
              'Access-Control-Allow-Headers: content-type\n' +
              'Access-Control-Allow-Methods: PUT\n' +
              'Access-Control-Allow-Origin: https://cuongthai.com\n' +
              'Vary: Origin, Access-Control-Request-Method, Access-Control-Request-Headers\n' +
              'Date: Wed, 09 Sep 2026 20:15:03 GMT') +
            'Uploads work, but every single PUT is preceded by its own OPTIONS. What in this response explains that, and what would change it?',

            'Một lượt preflight thật lên một endpoint S3-compatible đang sống, chép nguyên văn:' +
            code("$ curl -i -X OPTIONS \\\n" +
              "    -H 'Origin: https://cuongthai.com' \\\n" +
              "    -H 'Access-Control-Request-Method: PUT' \\\n" +
              "    -H 'Access-Control-Request-Headers: content-type' \\\n" +
              '    http://127.0.0.1:19000/de-thi/a/y.mp4\n' +
              '\n' +
              'HTTP/1.1 204 No Content\n' +
              'Access-Control-Allow-Credentials: true\n' +
              'Access-Control-Allow-Headers: content-type\n' +
              'Access-Control-Allow-Methods: PUT\n' +
              'Access-Control-Allow-Origin: https://cuongthai.com\n' +
              'Vary: Origin, Access-Control-Request-Method, Access-Control-Request-Headers\n' +
              'Date: Wed, 09 Sep 2026 20:15:03 GMT') +
            'Các lượt tải lên vẫn chạy, nhưng MỖI lệnh PUT đều có một lệnh OPTIONS đi trước. Cái gì trong phản hồi này giải thích điều đó, và cái gì sẽ thay đổi nó?',
          ),
          options: [
            B(
              'The <code>204 No Content</code> status: a preflight must answer <code>200 OK</code> with a body for the browser to consider it cacheable, so configuring the bucket to return 200 is what enables reuse',
              'Cái mã <code>204 No Content</code>: một lượt preflight phải trả lời <code>200 OK</code> kèm một phần thân thì trình duyệt mới coi là lưu đệm được, nên cấu hình cho bucket trả 200 mới là thứ bật được việc dùng lại',
            ),
            B(
              'The <code>Vary</code> header: by listing the two <code>Access-Control-Request-*</code> headers it makes every preflight a distinct cache entry, so removing those two names from <code>Vary</code> collapses them into one reusable entry',
              'Cái header <code>Vary</code>: bằng cách liệt kê hai header <code>Access-Control-Request-*</code>, nó khiến mỗi lượt preflight thành một mục đệm riêng biệt, nên bỏ hai cái tên đó khỏi <code>Vary</code> là gộp chúng lại thành một mục dùng lại được',
            ),
            B(
              'The absence of <code>Access-Control-Max-Age</code>: with no TTL the browser falls back to its own very small default, so the permission expires almost immediately and each upload pays a second round trip — set <code>MaxAgeSeconds</code> in the bucket CORS policy, and list <code>AllowedHeaders</code> explicitly instead of <code>*</code> so the cached entry can actually match the next request',
              'Việc THIẾU <code>Access-Control-Max-Age</code>: không có TTL thì trình duyệt rơi về giá trị mặc định rất nhỏ của chính nó, nên quyền hết hạn gần như tức thì và mỗi lượt tải lên phải trả thêm một lượt đi về — hãy đặt <code>MaxAgeSeconds</code> trong CORS policy của bucket, và liệt kê <code>AllowedHeaders</code> tường minh thay cho <code>*</code> để cái mục đã lưu đệm thật sự khớp được request kế tiếp',
            ),
            B(
              'The <code>Access-Control-Allow-Credentials: true</code> line: a credentialed preflight is never cached by any browser, so dropping credentials from the fetch is the only way to stop the repeated OPTIONS',
              'Cái dòng <code>Access-Control-Allow-Credentials: true</code>: một lượt preflight có kèm thông tin xác thực thì không trình duyệt nào lưu đệm cả, nên bỏ credentials khỏi lệnh fetch là cách duy nhất để chấm dứt việc OPTIONS lặp đi lặp lại',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Read the response for what is <em>missing</em>. <code>Access-Control-Max-Age</code> is the only directive that tells a browser how long it may reuse a preflight answer; with no such header, browsers fall back to their own default, which is a handful of seconds. The result is exactly the symptom described: a preflight before every upload, doubling the request count on the busiest write path in the app. Setting <code>MaxAgeSeconds</code> in the bucket\'s CORS policy is the fix, and it pairs with a second, less obvious one — an explicit <code>AllowedHeaders</code> list rather than <code>*</code>, because the cached entry is keyed on the exact header set the browser asked about, and a wildcard answer does not commit to a set that the next request can match. Both together turn "preflight + PUT, forever" into "one preflight per session". A caution about this particular transcript, which is why it is worth reading rather than trusting: the server that produced it does not implement bucket CORS configuration at all (a request for the bucket\'s CORS returns <code>501 NotImplemented</code>), so its permissive answer reflects a built-in default, not a policy. Option 1 invents a status-code rule: 204 is a perfectly normal preflight response and caching depends on <code>Max-Age</code>, not on the status. Option 2 misreads <code>Vary</code>, which is correct and necessary here — it tells shared caches that the answer depends on those request headers, which is true. Option 4 invents a rule about credentialed preflights; they are cacheable, and the <code>Allow-Credentials</code> line is unrelated to the TTL.',
            'Hãy đọc phản hồi để tìm cái ĐANG THIẾU. <code>Access-Control-Max-Age</code> là chỉ thị DUY NHẤT nói cho trình duyệt biết nó được dùng lại một câu trả lời preflight trong bao lâu; không có header đó thì trình duyệt rơi về giá trị mặc định của chính nó, vốn chỉ vài giây. Kết quả đúng là cái triệu chứng đã mô tả: một lượt preflight trước mỗi lượt tải lên, nhân đôi số request trên chính con đường ghi bận nhất của ứng dụng. Đặt <code>MaxAgeSeconds</code> trong CORS policy của bucket là cách chữa, và nó đi cặp với một cách chữa thứ hai ít hiển nhiên hơn — một danh sách <code>AllowedHeaders</code> tường minh thay vì <code>*</code>, bởi vì mục đã lưu đệm được đánh khoá theo ĐÚNG bộ header mà trình duyệt đã hỏi, còn một câu trả lời hình sao thì không cam kết một bộ nào để request kế tiếp khớp vào. Cả hai cùng lúc biến "preflight + PUT, mãi mãi" thành "một lượt preflight cho cả phiên". Một lời dè chừng về chính đoạn ghi này, và đó là lý do nó đáng ĐỌC chứ không đáng TIN: cái máy chủ tạo ra nó hoàn toàn không cài đặt việc cấu hình CORS theo bucket (hỏi CORS của bucket thì nó trả <code>501 NotImplemented</code>), nên câu trả lời dễ dãi của nó phản ánh một mặc định dựng sẵn chứ không phản ánh một chính sách nào. Phương án 1 bịa ra một quy tắc về mã trạng thái: 204 là một phản hồi preflight hoàn toàn bình thường và việc lưu đệm phụ thuộc <code>Max-Age</code> chứ không phụ thuộc mã trạng thái. Phương án 2 đọc sai <code>Vary</code>, thứ ở đây là đúng và cần thiết — nó nói với các bộ đệm dùng chung rằng câu trả lời phụ thuộc vào những header request đó, và điều ấy là sự thật. Phương án 4 bịa ra một quy tắc về preflight có credentials; chúng lưu đệm được, và dòng <code>Allow-Credentials</code> chẳng liên quan gì tới TTL.',
          ),
        }),

        // q27 · đáp án 0
        mcq({
          prompt: B(
            'Direct browser uploads succeed — 200 in the Network tab, the object appears in the bucket — but the client-side code below thinks they failed and retries, producing duplicate objects:' +
            code("const res = await fetch(uploadUrl, { method: 'PUT', body: file });\n" +
              'console.log(res.status);                 // 200\n' +
              "console.log(res.headers.get('etag'));    // null\n" +
              "if (!res.headers.get('etag')) throw new Error('upload failed');") +
            'DevTools shows <code>ETag: "a908…"</code> in the response headers panel for that very request. What is going on?',

            'Các lượt tải lên trực tiếp từ trình duyệt đều thành công — 200 trong tab Network, object xuất hiện trong bucket — nhưng đoạn mã phía client dưới đây lại tưởng chúng hỏng rồi thử lại, sinh ra các object trùng:' +
            code("const res = await fetch(uploadUrl, { method: 'PUT', body: file });\n" +
              'console.log(res.status);                 // 200\n' +
              "console.log(res.headers.get('etag'));    // null\n" +
              "if (!res.headers.get('etag')) throw new Error('upload failed');") +
            'DevTools lại hiện <code>ETag: "a908…"</code> trong bảng header phản hồi của đúng cái request đó. Chuyện gì đang xảy ra?',
          ),
          options: [
            B(
              'Cross-origin JavaScript can read only a handful of safelisted response headers; everything else — <code>ETag</code> included — is hidden from script even though it arrived, and it becomes readable only when the bucket\'s CORS policy names it in <code>ExposeHeaders</code>',
              'JavaScript khác origin chỉ đọc được một nhúm header phản hồi nằm trong danh sách an toàn; mọi thứ khác — kể cả <code>ETag</code> — bị giấu khỏi script dù nó đã tới nơi, và chỉ đọc được khi CORS policy của bucket nêu tên nó trong <code>ExposeHeaders</code>',
            ),
            B(
              'The header is present but <code>fetch</code> normalises quoted values away and returns <code>null</code> for any header whose value begins with a double quote; reading it via <code>res.headers.entries()</code> returns the raw string and works around it',
              'Header có mặt nhưng <code>fetch</code> chuẩn hoá bỏ các giá trị nằm trong dấu nháy và trả <code>null</code> cho bất kỳ header nào có giá trị bắt đầu bằng dấu nháy kép; đọc nó qua <code>res.headers.entries()</code> sẽ trả về chuỗi thô và lách được',
            ),
            B(
              'The response was served from the browser cache rather than the network, and a cached response carries no headers, which is why DevTools shows the original ones while the script sees none',
              'Phản hồi được phục vụ từ bộ đệm của trình duyệt chứ không từ mạng, và một phản hồi lấy từ đệm thì không mang header nào, nên DevTools hiện các header gốc còn script thì chẳng thấy cái nào',
            ),
            B(
              'A PUT response body is empty, so <code>fetch</code> resolves before the headers have been parsed; awaiting <code>res.text()</code> first forces the parse and makes <code>ETag</code> available on the next read',
              'Phản hồi của một lệnh PUT có thân rỗng, nên <code>fetch</code> hoàn tất trước khi các header được phân giải xong; await <code>res.text()</code> trước sẽ ép phân giải và làm <code>ETag</code> có sẵn ở lượt đọc kế tiếp',
            ),
          ],
          correct: 0,
          explanation: EX(
            'CORS restricts two different things and people usually remember only the first. It gates whether a cross-origin request may be <em>made</em>, which is the preflight story. It also gates which response headers the calling script may <em>read</em>, and that second gate is on by default: script can see only the safelisted set (<code>Cache-Control</code>, <code>Content-Language</code>, <code>Content-Length</code>, <code>Content-Type</code>, <code>Expires</code>, <code>Last-Modified</code>, <code>Pragma</code>) and everything else reads as <code>null</code>. DevTools is not subject to that gate — it shows what came over the wire — which is exactly why this bug is so confusing: the header is visibly there and the script cannot have it. The fix is one line in the bucket CORS policy, <code>"ExposeHeaders": ["ETag"]</code>, plus <code>x-amz-version-id</code> or <code>x-amz-request-id</code> if you need those. The cost of missing it is not a broken upload but a <em>duplicated</em> one, since the client\'s retry logic misfires on a success. Option 2 invents a quoting behaviour; <code>Headers.get</code> returns the raw value including its quotes. Option 3 invents cache semantics — a cached response carries its headers, and a PUT is not cacheable anyway. Option 4 invents an ordering problem; by the time <code>fetch</code> resolves, the headers are fully parsed and reading the body changes nothing.',
            'CORS hạn chế hai thứ khác nhau và người ta thường chỉ nhớ cái thứ nhất. Nó chốt xem một request khác origin có được PHÁT ĐI hay không, và đó là câu chuyện preflight. Nó còn chốt xem script gọi được ĐỌC những header phản hồi nào, và cái chốt thứ hai này mặc định là BẬT: script chỉ thấy được bộ nằm trong danh sách an toàn (<code>Cache-Control</code>, <code>Content-Language</code>, <code>Content-Length</code>, <code>Content-Type</code>, <code>Expires</code>, <code>Last-Modified</code>, <code>Pragma</code>) còn mọi thứ khác đọc ra <code>null</code>. DevTools thì không chịu cái chốt đó — nó hiện thứ đã đi qua đường dây — và đó chính là lý do lỗi này gây bối rối đến vậy: cái header nhìn thấy rành rành mà script thì không lấy được. Cách chữa là một dòng trong CORS policy của bucket, <code>"ExposeHeaders": ["ETag"]</code>, cộng thêm <code>x-amz-version-id</code> hay <code>x-amz-request-id</code> nếu bạn cần chúng. Cái giá của việc bỏ sót nó không phải một lượt tải lên hỏng mà là một lượt tải lên TRÙNG, vì logic thử lại của client bắn nhầm vào một lượt đã thành công. Phương án 2 bịa ra một hành vi về dấu nháy; <code>Headers.get</code> trả về giá trị thô kèm cả dấu nháy. Phương án 3 bịa ra ngữ nghĩa lưu đệm — một phản hồi lấy từ đệm vẫn mang header của nó, mà dù sao một lệnh PUT cũng không lưu đệm được. Phương án 4 bịa ra một vấn đề thứ tự; tới lúc <code>fetch</code> hoàn tất thì các header đã được phân giải xong xuôi và đọc phần thân chẳng thay đổi gì.',
          ),
        }),

        // q28 · đáp án 1
        mcq({
          prompt: B(
            'Uploads work for most users and fail for a minority. The failing preflight shows:' +
            code('Request  Origin: https://www.cuongthai.com\n' +
              'Response Access-Control-Allow-Origin: https://cuongthai.com') +
            'Which reading of this is correct?',

            'Các lượt tải lên chạy được với đa số người dùng và hỏng với một thiểu số. Lượt preflight hỏng cho thấy:' +
            code('Request  Origin: https://www.cuongthai.com\n' +
              'Response Access-Control-Allow-Origin: https://cuongthai.com') +
            'Cách đọc nào là đúng?',
          ),
          options: [
            B(
              'The origins match under the browser\'s host-normalisation rules, so this is not the cause; the real failure must be in <code>Access-Control-Allow-Methods</code> or <code>Allow-Headers</code>, and the two lines above are a red herring',
              'Hai origin khớp nhau theo quy tắc chuẩn hoá host của trình duyệt, nên đây không phải nguyên nhân; cú hỏng thật phải nằm ở <code>Access-Control-Allow-Methods</code> hoặc <code>Allow-Headers</code>, còn hai dòng trên chỉ là cá trích đỏ đánh lạc hướng',
            ),
            B(
              'An origin is scheme + host + port compared as an exact string, so <code>www.</code> makes it a different origin and the browser refuses; every hostname the app is actually served from — bare, <code>www</code>, staging, the local dev port — has to be listed in <code>AllowedOrigins</code>',
              'Một origin là scheme + host + port và được so như một chuỗi CHÍNH XÁC, nên <code>www.</code> làm nó thành một origin khác và trình duyệt từ chối; mọi tên máy chủ mà ứng dụng thật sự được phục vụ từ đó — dạng trần, dạng <code>www</code>, staging, cổng dev cục bộ — đều phải được liệt kê trong <code>AllowedOrigins</code>',
            ),
            B(
              'The mismatch is cosmetic because the response echoes the configured value rather than the requested one; the failure is that the response is missing <code>Vary: Origin</code>, so a shared cache served one user the other user\'s preflight answer',
              'Chỗ lệch chỉ là hình thức vì phản hồi vọng lại giá trị đã cấu hình chứ không vọng lại giá trị được yêu cầu; cú hỏng nằm ở chỗ phản hồi thiếu <code>Vary: Origin</code>, nên một bộ đệm dùng chung đã phục vụ cho người này câu trả lời preflight của người kia',
            ),
            B(
              'Listing the bare domain implicitly covers its subdomains, so this configuration is already correct; the minority failing are users on HTTP rather than HTTPS, which is a different origin for the same host',
              'Liệt kê tên miền trần là ngầm bao luôn các tên miền con của nó, nên cấu hình này vốn đã đúng; nhóm thiểu số bị hỏng là những người dùng đang ở HTTP thay vì HTTPS, và đó là một origin khác cho cùng một host',
            ),
          ],
          correct: 1,
          explanation: EX(
            'An origin is a triple — scheme, host, port — compared literally, with no notion of a domain hierarchy. <code>https://www.cuongthai.com</code> and <code>https://cuongthai.com</code> are two origins that happen to look related to humans, and the browser treats them as it would treat two unrelated sites. The transcript is the whole diagnosis: the browser announced one origin, the server answered with a different one, and the browser blocked. This archetype has a characteristic signature that is worth recognising in a bug report — <em>it works for most people</em> — because it splits the user base along whichever hostname they happened to land on. The same family covers <code>http</code> versus <code>https</code>, <code>localhost:3000</code> versus <code>localhost:5173</code>, and a mobile web view with its own custom origin. The fix is to enumerate every scheme+host+port combination the app is actually served from; the discipline is to compare the request\'s <code>Origin</code> against the response\'s <code>Allow-Origin</code> before theorising about anything else. Option 1 invents a normalisation the specification explicitly does not have. Option 3 correctly names a real hazard — a preflight cached without <code>Vary: Origin</code> can be served to the wrong origin — but that is a different bug, and here the two values plainly differ. Option 4 invents subdomain inheritance; a wildcard in <code>AllowedOrigins</code> is all-or-nothing, not a subdomain pattern.',
            'Một origin là một bộ ba — scheme, host, port — và được so theo nghĩa đen, không có khái niệm cây phân cấp tên miền nào. <code>https://www.cuongthai.com</code> và <code>https://cuongthai.com</code> là hai origin tình cờ trông có họ hàng với mắt người, còn trình duyệt thì xử chúng y như xử hai trang web chẳng liên quan gì nhau. Đoạn ghi chính là toàn bộ chẩn đoán: trình duyệt khai một origin, máy chủ trả lời bằng một origin khác, và trình duyệt chặn. Kiểu lỗi này có một dấu hiệu đặc trưng đáng nhận ra trong một báo cáo lỗi — NÓ CHẠY ĐƯỢC VỚI PHẦN LỚN MỌI NGƯỜI — vì nó chia tập người dùng theo cái tên máy chủ mà họ tình cờ rơi vào. Cùng họ với nó còn có <code>http</code> so với <code>https</code>, <code>localhost:3000</code> so với <code>localhost:5173</code>, và một web view di động với origin tuỳ chỉnh riêng của nó. Cách chữa là liệt kê mọi tổ hợp scheme+host+port mà ứng dụng thật sự được phục vụ từ đó; còn kỷ luật là so <code>Origin</code> của request với <code>Allow-Origin</code> của phản hồi TRƯỚC khi đặt giả thuyết về bất cứ thứ gì khác. Phương án 1 bịa ra một phép chuẩn hoá mà đặc tả nói rõ là không có. Phương án 3 gọi đúng tên một mối nguy có thật — một lượt preflight lưu đệm mà thiếu <code>Vary: Origin</code> thì có thể bị phục vụ cho sai origin — nhưng đó là một lỗi khác, và ở đây hai giá trị rành rành là khác nhau. Phương án 4 bịa ra việc thừa kế tên miền con; một dấu sao trong <code>AllowedOrigins</code> là được-tất-hoặc-không-gì, chứ không phải một mẫu tên miền con.',
          ),
        }),

        // q29 · đáp án 2
        mcq({
          prompt: B(
            'Browser uploads worked yesterday and fail today for everyone. Nothing in the storage configuration changed. The only deploy touched an unrelated module and added a global axios interceptor that stamps <code>x-request-id</code> on every outgoing request. The preflight now shows:' +
            code('Request  Access-Control-Request-Headers:\n' +
              '           content-type, x-request-id\n' +
              'Response Access-Control-Allow-Headers:\n' +
              '           content-type, x-amz-content-sha256, x-amz-date') +
            'What is the diagnosis, and which fix is preferable?',

            'Các lượt tải lên từ trình duyệt hôm qua còn chạy, hôm nay hỏng với tất cả mọi người. Không có gì trong cấu hình lưu trữ thay đổi. Lượt triển khai duy nhất chỉ đụng một module chẳng liên quan và thêm một axios interceptor toàn cục đóng dấu <code>x-request-id</code> lên mọi request đi ra. Lượt preflight giờ cho thấy:' +
            code('Request  Access-Control-Request-Headers:\n' +
              '           content-type, x-request-id\n' +
              'Response Access-Control-Allow-Headers:\n' +
              '           content-type, x-amz-content-sha256, x-amz-date') +
            'Chẩn đoán là gì, và cách chữa nào đáng chọn hơn?',
          ),
          options: [
            B(
              'The custom header broke the SigV4 signature, because any header present on the request must be covered by <code>X-Amz-SignedHeaders</code>; the fix is to add <code>x-request-id</code> to <code>signableHeaders</code> on the server so the two sides agree again',
              'Cái header tự đặt đã làm vỡ chữ ký SigV4, vì bất kỳ header nào có mặt trên request đều phải được <code>X-Amz-SignedHeaders</code> phủ; cách chữa là thêm <code>x-request-id</code> vào <code>signableHeaders</code> ở phía máy chủ để hai bên khớp lại',
            ),
            B(
              'The interceptor is overwriting the <code>Content-Type</code> that <code>axios</code> would otherwise set, so the upload fails for the reason it always does; removing the interceptor restores the correct type and the CORS lists are a coincidence',
              'Cái interceptor đang ghi đè lên <code>Content-Type</code> mà <code>axios</code> lẽ ra sẽ đặt, nên lượt tải lên hỏng vì đúng cái lý do muôn thuở; gỡ interceptor đi là kiểu đúng được khôi phục còn hai danh sách CORS chỉ là trùng hợp',
            ),
            B(
              'Adding any header to a cross-origin request changes what the preflight asks for, and a header the response does not allow blocks the whole request; the better fix is to add <code>x-request-id</code> to the bucket\'s <code>AllowedHeaders</code>, with a scoped axios instance without the interceptor as the fallback when you do not control the bucket',
              'Thêm bất kỳ header nào vào một request khác origin là đổi luôn thứ mà lượt preflight đi hỏi, và một header mà phản hồi không cho phép sẽ chặn cả request; cách chữa tốt hơn là thêm <code>x-request-id</code> vào <code>AllowedHeaders</code> của bucket, còn phương án lùi là một thể hiện axios riêng không gắn interceptor cho những khi bạn không kiểm soát được bucket',
            ),
            B(
              'The response list is simply out of date and the browser is comparing against a stale cached preflight; hard-refreshing to bust the preflight cache resolves it without any configuration change',
              'Danh sách phía phản hồi chỉ là đã cũ và trình duyệt đang so với một lượt preflight lưu đệm đã ôi; tải lại cứng để phá bộ đệm preflight là xong mà không cần đổi cấu hình gì',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the archetype that makes CORS feel like sabotage, because the change that broke it is in a file nobody associates with uploads. The mechanism is mechanical: the browser enumerates every non-safelisted header it is about to send into <code>Access-Control-Request-Headers</code>, and if the response\'s <code>Allow-Headers</code> does not cover all of them, the request is blocked before it is sent. Comparing the two lines above answers it in seconds — <code>x-request-id</code> is in the ask and not in the allow. Two fixes, and the preference is worth reasoning about rather than memorising. Adding the header to <code>AllowedHeaders</code> keeps the tracing feature that someone deliberately added and costs one line of configuration. Excluding the header from storage requests — a scoped axios instance for bucket calls, with no global interceptor — is the fallback for when the bucket is not yours to configure, and it has a second virtue: a request ID means nothing to the storage service anyway. Note also the failure signature: <em>everything broke at once, and the diff does not mention storage</em>. That is the cue to look at what is now attached to every outgoing request. Option 1 confuses two layers: the signature covers only the headers named in <code>X-Amz-SignedHeaders</code>, and an unsigned extra header does not invalidate it — this failure happens in the browser, before any signature is checked. Option 2 invents an overwrite that an interceptor adding one header does not perform. Option 4 blames a stale cache, but the response shown is the live one and it genuinely lacks the header.',
            'Đây là kiểu lỗi khiến CORS có cảm giác như bị phá hoại, vì cái thay đổi làm hỏng nó nằm trong một file mà chẳng ai liên hệ với việc tải lên. Cơ chế thì máy móc: trình duyệt liệt kê mọi header ngoài danh sách an toàn mà nó sắp gửi vào <code>Access-Control-Request-Headers</code>, và nếu <code>Allow-Headers</code> của phản hồi không phủ hết chúng thì request bị chặn trước khi được gửi. So hai dòng trên là trả lời được trong vài giây — <code>x-request-id</code> nằm trong phần hỏi mà không nằm trong phần cho phép. Có hai cách chữa, và cái thứ tự ưu tiên thì đáng lập luận chứ không đáng học thuộc. Thêm header đó vào <code>AllowedHeaders</code> giữ lại được tính năng truy vết mà ai đó đã cố ý thêm vào và tốn đúng một dòng cấu hình. Loại header đó ra khỏi các request tới lưu trữ — một thể hiện axios riêng cho các lời gọi bucket, không gắn interceptor toàn cục — là phương án lùi cho khi bucket không thuộc quyền cấu hình của bạn, và nó có thêm một cái hay: dù sao thì một mã request cũng chẳng có ý nghĩa gì với dịch vụ lưu trữ. Cũng để ý dấu hiệu của cú hỏng: MỌI THỨ HỎNG CÙNG LÚC, VÀ BẢN DIFF KHÔNG NHẮC GÌ TỚI LƯU TRỮ. Đó là gợi ý để đi xem cái gì vừa được gắn vào mọi request đi ra. Phương án 1 lẫn hai tầng: chữ ký chỉ phủ những header được nêu tên trong <code>X-Amz-SignedHeaders</code>, và một header thừa không được ký thì không làm nó vô hiệu — cú hỏng này xảy ra Ở TRÌNH DUYỆT, trước khi có chữ ký nào được kiểm. Phương án 2 bịa ra một phép ghi đè mà một interceptor chỉ thêm một header không hề thực hiện. Phương án 4 đổ lỗi cho bộ đệm ôi, nhưng phản hồi đang hiện là phản hồi sống và nó THẬT SỰ thiếu cái header đó.',
          ),
        }),

        // q30 · đáp án 3
        mcq({
          prompt: B(
            'To prove a bucket\'s CORS policy is correct, an engineer runs the preflight twice against the endpoint and gets:' +
            code("# origin CO trong AllowedOrigins\n" +
              "-H 'Origin: https://cuongthai.com'      -> 204\n" +
              '   Access-Control-Allow-Origin: https://cuongthai.com\n' +
              '   Access-Control-Allow-Methods: PUT\n' +
              '\n' +
              '# origin KHONG co trong AllowedOrigins\n' +
              "-H 'Origin: https://www.cuongthai.com'  -> 204\n" +
              '   Access-Control-Allow-Origin: https://www.cuongthai.com\n' +
              '   Access-Control-Allow-Methods: PUT\n' +
              '\n' +
              '# method KHONG co trong AllowedMethods\n' +
              "-H 'Access-Control-Request-Method: DELETE' -> 204\n" +
              '   Access-Control-Allow-Methods: DELETE') +
            'They conclude "CORS is configured and working". What should they conclude?',

            'Để chứng minh CORS policy của một bucket là đúng, một kỹ sư chạy lượt preflight hai lần lên endpoint và nhận được:' +
            code("# origin CO trong AllowedOrigins\n" +
              "-H 'Origin: https://cuongthai.com'      -> 204\n" +
              '   Access-Control-Allow-Origin: https://cuongthai.com\n' +
              '   Access-Control-Allow-Methods: PUT\n' +
              '\n' +
              '# origin KHONG co trong AllowedOrigins\n' +
              "-H 'Origin: https://www.cuongthai.com'  -> 204\n" +
              '   Access-Control-Allow-Origin: https://www.cuongthai.com\n' +
              '   Access-Control-Allow-Methods: PUT\n' +
              '\n' +
              '# method KHONG co trong AllowedMethods\n' +
              "-H 'Access-Control-Request-Method: DELETE' -> 204\n" +
              '   Access-Control-Allow-Methods: DELETE') +
            'Họ kết luận "CORS đã cấu hình xong và đang chạy". Lẽ ra họ phải kết luận gì?',
          ),
          options: [
            B(
              'That the policy is correct and unusually permissive: it evidently lists both hostnames and all methods, so the remaining work is to tighten <code>AllowedOrigins</code> and <code>AllowedMethods</code> down to what production actually needs',
              'Rằng chính sách là đúng và dễ dãi một cách bất thường: rõ ràng nó có liệt kê cả hai tên máy chủ và mọi phương thức, nên việc còn lại là siết <code>AllowedOrigins</code> và <code>AllowedMethods</code> về đúng thứ production thật sự cần',
            ),
            B(
              'That the test was run against the wrong address: preflights must be sent to the custom domain rather than the API endpoint, and the CDN in front of the custom domain is the component that enforces the bucket policy',
              'Rằng phép thử đã chạy vào sai địa chỉ: preflight phải được gửi tới tên miền tuỳ chỉnh chứ không phải endpoint API, và cái CDN đứng trước tên miền tuỳ chỉnh mới là thành phần thi hành chính sách của bucket',
            ),
            B(
              'That the policy has not propagated yet — CORS changes take minutes to take effect — so the responses reflect the previous, wildcard configuration and the test should be repeated later',
              'Rằng chính sách chưa lan tới nơi — thay đổi CORS mất vài phút mới có hiệu lực — nên các phản hồi đang phản ánh cấu hình hình sao trước đó, và phép thử nên được lặp lại sau',
            ),
            B(
              'That this endpoint is echoing whatever the request asked for instead of consulting a policy, so the test cannot distinguish a correct policy from no policy at all — the checker has to be checked first, for example by confirming the server can even return the bucket\'s CORS configuration, and the real verification has to happen against the environment that will actually serve users',
              'Rằng endpoint này đang VỌNG LẠI bất cứ thứ gì request hỏi thay vì tra một chính sách nào, nên phép thử không phân biệt nổi một chính sách đúng với việc chẳng có chính sách nào — phải kiểm CHÍNH BỘ KIỂM trước đã, chẳng hạn bằng cách xác nhận máy chủ có trả về nổi cấu hình CORS của bucket hay không, và phép kiểm chứng thật thì phải chạy trên chính môi trường sẽ phục vụ người dùng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The second and third probes are the interesting ones. An origin that is <em>not</em> in the allow-list came back allowed, and a method that is <em>not</em> in the allow-list came back allowed — under a real policy at least one of those must have been refused. A response that says yes to everything you ask is not evidence of a correct policy; it is evidence that nothing is consulting a policy. In this case the endpoint was a local S3-compatible server that does not implement bucket CORS at all, which the same session confirmed independently: asking it for the bucket\'s CORS configuration returns <code>501 NotImplemented</code>. The general habit is the one worth carrying: <b>verify the checker before you trust what it reports</b>, and the cheapest way to do that is to feed it an input that must fail. If your "CORS is working" test cannot produce a failure, it cannot produce a pass either. It also matters where you test — a local stand-in is fine for exercising the upload flow and useless for validating a policy that only the real provider enforces. Option 1 reads the permissive answers as configuration, which is exactly the inference the third probe rules out. Option 2 invents a division of labour; the bucket endpoint answers preflights for direct uploads, and that is the path being tested. Option 3 names a real phenomenon — CORS edits can take a minute to propagate — but propagation would not explain a response that mirrors whatever it is asked, including a method nobody ever configured.',
            'Hai phép dò thứ hai và thứ ba mới là chỗ thú vị. Một origin KHÔNG nằm trong danh sách cho phép lại trở về là được phép, và một phương thức KHÔNG nằm trong danh sách cho phép cũng trở về là được phép — dưới một chính sách thật thì ít nhất một trong hai cái đó phải bị từ chối. Một phản hồi nói CÓ với mọi thứ bạn hỏi không phải bằng chứng của một chính sách đúng; nó là bằng chứng rằng chẳng có gì đang tra một chính sách nào cả. Trong trường hợp này endpoint là một máy chủ S3-compatible cục bộ hoàn toàn không cài đặt CORS theo bucket, và chính phiên đo đó đã xác nhận độc lập: hỏi nó cấu hình CORS của bucket thì nó trả <code>501 NotImplemented</code>. Thói quen tổng quát mới là thứ đáng mang theo: <b>hãy kiểm chính bộ kiểm trước khi tin thứ nó báo</b>, và cách rẻ nhất để làm việc đó là đút cho nó một đầu vào BẮT BUỘC phải hỏng. Nếu phép thử "CORS đang chạy" của bạn không tạo ra nổi một lượt hỏng thì nó cũng không tạo ra nổi một lượt đạt. Chỗ bạn thử cũng quan trọng — một bản thay thế cục bộ thì tốt để tập dượt luồng tải lên và vô dụng để kiểm chứng một chính sách mà chỉ nhà cung cấp thật mới thi hành. Phương án 1 đọc những câu trả lời dễ dãi thành cấu hình, đúng cái suy luận mà phép dò thứ ba đã loại trừ. Phương án 2 bịa ra một sự phân công; chính endpoint của bucket mới trả lời preflight cho các lượt tải lên trực tiếp, và đó là con đường đang được thử. Phương án 3 gọi tên một hiện tượng có thật — sửa CORS có thể mất một phút mới lan tới nơi — nhưng chuyện lan truyền không giải thích nổi một phản hồi cứ phản chiếu đúng thứ nó được hỏi, kể cả một phương thức chưa ai từng cấu hình.',
          ),
        }),

        /* ── Chương 6 — lifecycle và cleanup (5 câu) ───────────────────── */

        // q31 · đáp án 0
        mcq({
          prompt: B(
            'The invoice bills 84 GB of storage. Summing <code>ListObjectsV2</code> over the whole bucket gives 61 GB. A measurement on a scratch bucket reproduces the shape:' +
            code('# sau khi bo do dang hai lan multipart\n' +
              'ListObjectsV2 Prefix="mp/"\n' +
              '  mp/big.bin (10485760 B)      # da Complete\n' +
              '  KeyCount: 1\n' +
              '\n' +
              'ListMultipartUploads\n' +
              '  mp/small.bin\n' +
              '  mp/bo-do-dang.bin            # ca hai deu KHONG hien o tren') +
            'Where are the missing 23 GB, and what removes them?',

            'Hoá đơn tính tiền 84 GB lưu trữ. Cộng <code>ListObjectsV2</code> trên cả bucket thì ra 61 GB. Một phép đo trên một bucket nháp dựng lại đúng hình dạng đó:' +
            code('# sau khi bo do dang hai lan multipart\n' +
              'ListObjectsV2 Prefix="mp/"\n' +
              '  mp/big.bin (10485760 B)      # da Complete\n' +
              '  KeyCount: 1\n' +
              '\n' +
              'ListMultipartUploads\n' +
              '  mp/small.bin\n' +
              '  mp/bo-do-dang.bin            # ca hai deu KHONG hien o tren') +
            '23 GB thiếu đang nằm ở đâu, và cái gì dọn được chúng?',
          ),
          options: [
            B(
              'In parts of multipart uploads that were started and never completed: they are real stored bytes but they are not objects yet, so no object listing can see them — <code>ListMultipartUploads</code> is the only way to observe them, and a lifecycle rule with <code>AbortIncompleteMultipartUpload</code> is what deletes them',
              'Nằm trong các phần của những lượt multipart đã khởi tạo mà chưa bao giờ hoàn tất: chúng là byte thật đã lưu nhưng chưa phải object, nên không lượt liệt kê object nào thấy được chúng — <code>ListMultipartUploads</code> là cách duy nhất quan sát chúng, và một lifecycle rule với <code>AbortIncompleteMultipartUpload</code> mới là thứ xoá chúng',
            ),
            B(
              'In objects deleted within the last thirty days, which continue to be billed during a minimum-retention window; they disappear from the invoice on their own once the window elapses, so no action is needed',
              'Nằm trong những object đã xoá trong ba mươi ngày qua, thứ tiếp tục bị tính tiền trong một cửa sổ lưu giữ tối thiểu; chúng tự biến khỏi hoá đơn khi cửa sổ đó trôi qua, nên không cần làm gì cả',
            ),
            B(
              'In a listing that stopped early: <code>ListObjectsV2</code> returns at most 1000 keys per call, so a sum that ignores <code>NextContinuationToken</code> undercounts a large bucket — paginating to the end reconciles the two numbers',
              'Nằm ở một lượt liệt kê dừng sớm: <code>ListObjectsV2</code> trả về tối đa 1000 key mỗi lời gọi, nên một phép cộng bỏ qua <code>NextContinuationToken</code> sẽ đếm thiếu một bucket lớn — phân trang tới hết là hai con số khớp lại',
            ),
            B(
              'In per-object metadata and index overhead, which is charged as storage but not reported as object size; the ratio is roughly a third on buckets with many small objects and cannot be reduced except by using fewer, larger objects',
              'Nằm ở siêu dữ liệu theo từng object và phần chi phí chỉ mục, thứ bị tính là lưu trữ nhưng không được báo cáo trong kích thước object; tỷ lệ vào khoảng một phần ba với các bucket có nhiều object nhỏ và không giảm được trừ khi dùng ít object hơn nhưng lớn hơn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The measurement is the argument. Two multipart uploads were started and left unfinished; a listing of the same prefix afterwards shows only the one object that was completed, while <code>ListMultipartUploads</code> names both abandoned ones. Parts live in a separate namespace until <code>CompleteMultipartUpload</code> promotes them, so they are invisible to every object-listing tool — and completely visible to the billing system, because they are bytes on disk. That is the whole discrepancy: the invoice counts storage, the object listing counts objects, and an interrupted upload is storage that is not an object. The leak accumulates in the most ordinary way imaginable — a browser tab closed at part 47 of 100, a laptop lid shut, a mobile connection dropping — so any application with browser uploads generates it continuously, and nothing expires on its own. The only cure is a lifecycle rule carrying <code>AbortIncompleteMultipartUpload.DaysAfterInitiation</code>, where the number has to exceed your slowest legitimate upload (7 days is the common choice; 1 day will kill real uploads in flight). Option 2 invents a minimum-retention charge that neither S3 Standard nor R2 has. Option 3 names a real and common bug — forgetting to paginate — but it does not fit this transcript, where the missing bytes appear in a different API rather than on a later page. Option 4 invents an overhead ratio; metadata is negligible and would not amount to 23 GB.',
            'Phép đo chính là lập luận. Hai lượt multipart đã được khởi tạo rồi bỏ dở; một lượt liệt kê cùng tiền tố sau đó chỉ hiện đúng cái object đã hoàn tất, trong khi <code>ListMultipartUploads</code> gọi tên cả hai cái bị bỏ. Các phần sống trong một không gian tên RIÊNG cho tới khi <code>CompleteMultipartUpload</code> thăng chức chúng, nên chúng vô hình với mọi công cụ liệt kê object — và hoàn toàn hữu hình với hệ thống tính tiền, vì chúng là byte nằm trên đĩa. Đó là toàn bộ chỗ lệch: hoá đơn đếm DUNG LƯỢNG, lượt liệt kê đếm OBJECT, và một lượt tải lên bị đứt là dung lượng mà không phải object. Chỗ rò tích tụ theo cách bình thường nhất có thể tưởng tượng — một tab trình duyệt đóng ở phần 47 trên 100, một cái nắp laptop gập xuống, một đường mạng di động rớt — nên bất kỳ ứng dụng nào có tải lên từ trình duyệt cũng sinh ra nó liên tục, và chẳng có gì tự hết hạn. Thuốc chữa duy nhất là một lifecycle rule mang <code>AbortIncompleteMultipartUpload.DaysAfterInitiation</code>, mà con số ngày phải lớn hơn lượt tải lên chính đáng chậm nhất của bạn (7 ngày là lựa chọn phổ biến; 1 ngày sẽ giết những lượt tải lên thật đang bay). Phương án 2 bịa ra một khoản phí lưu giữ tối thiểu mà cả S3 Standard lẫn R2 đều không có. Phương án 3 gọi tên một lỗi có thật và rất phổ biến — quên phân trang — nhưng nó không khớp đoạn ghi này, nơi các byte thiếu xuất hiện ở một API KHÁC chứ không phải ở một trang sau. Phương án 4 bịa ra một tỷ lệ chi phí phụ; siêu dữ liệu là không đáng kể và không thể lên tới 23 GB.',
          ),
        }),

        // q32 · đáp án 1
        mcq({
          prompt: B(
            'A cleanup rule is written with <code>"Filter": { "Prefix": "users" }</code> and <code>"Expiration": { "Days": 30 }</code>. A listing with the same prefix, measured on a bucket that holds a live archive under <code>users-cu/</code>:' +
            code('ListObjectsV2 Prefix="users"\n' +
              '  users-cu/d.jpg        <-- kho luu tru, phai giu\n' +
              '  users/42/a.jpg\n' +
              '  users/42/b.jpg\n' +
              '  users/7/c.jpg') +
            'What will the rule do, and what is the discipline that prevents it?',

            'Một rule dọn dẹp được viết với <code>"Filter": { "Prefix": "users" }</code> và <code>"Expiration": { "Days": 30 }</code>. Một lượt liệt kê cùng tiền tố, đo trên một bucket đang giữ một kho lưu trữ đang dùng dưới <code>users-cu/</code>:' +
            code('ListObjectsV2 Prefix="users"\n' +
              '  users-cu/d.jpg        <-- kho luu tru, phai giu\n' +
              '  users/42/a.jpg\n' +
              '  users/42/b.jpg\n' +
              '  users/7/c.jpg') +
            'Rule đó sẽ làm gì, và kỷ luật nào ngăn được điều đó?',
          ),
          options: [
            B(
              'Nothing unexpected: lifecycle filters are matched against path segments rather than raw strings, so <code>users</code> matches the <code>users/</code> segment only, and the listing above differs because <code>ListObjectsV2</code> uses looser matching than the lifecycle engine',
              'Không có gì bất ngờ: bộ lọc lifecycle so khớp theo các đoạn đường dẫn chứ không theo chuỗi thô, nên <code>users</code> chỉ khớp đoạn <code>users/</code>, và lượt liệt kê ở trên khác đi là vì <code>ListObjectsV2</code> dùng phép so lỏng hơn bộ máy lifecycle',
            ),
            B(
              'It will expire <code>users-cu/d.jpg</code> too, because a prefix is a literal string comparison with no path semantics — end filter prefixes with <code>/</code> unless a bare-string scan is genuinely intended, and separate what is disposable from what is permanent at the top of the key rather than relying on the rule to be careful',
              'Nó sẽ cho <code>users-cu/d.jpg</code> hết hạn theo, vì một tiền tố là phép so chuỗi NGUYÊN VĂN không có ngữ nghĩa đường dẫn nào — hãy kết thúc tiền tố của bộ lọc bằng <code>/</code> trừ khi bạn thật sự chủ ý quét theo chuỗi trần, và hãy tách thứ vứt được khỏi thứ giữ mãi ngay ở đầu cái key thay vì trông chờ rule tự cẩn thận',
            ),
            B(
              'It will expire only <code>users/42/a.jpg</code> and its siblings, because expiration applies to leaf objects and skips any key whose prefix segment differs from the filter; the archive is safe but the rule should still be tightened for readability',
              'Nó sẽ chỉ cho <code>users/42/a.jpg</code> và các anh em của nó hết hạn, vì expiration áp cho các object lá và bỏ qua bất kỳ key nào có đoạn tiền tố khác với bộ lọc; kho lưu trữ vẫn an toàn nhưng rule vẫn nên được siết lại cho dễ đọc',
            ),
            B(
              'It will do nothing at all until a trailing wildcard is added: a filter prefix without <code>*</code> matches an exact key rather than a set, so the rule as written expires only an object literally named <code>users</code>',
              'Nó sẽ hoàn toàn không làm gì cho tới khi thêm một dấu sao ở cuối: một tiền tố lọc không có <code>*</code> thì khớp một key CHÍNH XÁC chứ không khớp một tập, nên rule viết như vậy chỉ cho hết hạn một object tên đúng là <code>users</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A prefix filter is <code>key.startsWith(prefix)</code> and nothing more — the same string matching the listing API uses, which is why the transcript is a faithful preview of what the rule will select. <code>users-cu/d.jpg</code> starts with <code>users</code>, so it matches, and thirty days later a live archive is deleted by a rule whose author was thinking about <code>users/</code>. The immediate fix is the trailing slash. The deeper discipline is that a deletion policy should be legible from the key itself: put disposability at the front of the path, so <code>tmp-24h/</code>, <code>exports/</code> and <code>archive/</code> announce their fate to anyone reading a listing, instead of encoding the policy only in a JSON document nobody opens. Two related hazards are worth carrying: rules do not stack — an object matched by several rules takes the earliest expiration — and <code>Expiration.Days: 0</code> means "delete at the next sweep", which quietly kills every future upload under that prefix. And because the deletion is asynchronous and irreversible, the way to test a new rule is to run the equivalent listing first and read what comes back. Option 1 invents segment-aware matching and then explains away the contradicting evidence. Option 3 invents a leaf-versus-prefix distinction; every key is a leaf, since prefixes are not entities. Option 4 invents wildcard syntax that lifecycle filters do not have, and would make prefix rules useless.',
            'Một bộ lọc tiền tố là <code>key.startsWith(prefix)</code> chứ không hơn — đúng cái phép so chuỗi mà API liệt kê dùng, và đó là lý do đoạn ghi là một bản xem trước trung thực của thứ mà rule sẽ chọn. <code>users-cu/d.jpg</code> bắt đầu bằng <code>users</code>, nên nó khớp, và ba mươi ngày sau một kho lưu trữ đang dùng bị xoá bởi một rule mà người viết chỉ đang nghĩ tới <code>users/</code>. Cách chữa tức thời là dấu gạch chéo ở cuối. Kỷ luật sâu hơn là: một chính sách xoá nên ĐỌC ĐƯỢC ngay từ chính cái key. Hãy đặt tính vứt-được lên đầu đường dẫn, để <code>tmp-24h/</code>, <code>exports/</code> và <code>archive/</code> tự khai số phận của chúng với bất kỳ ai đọc một lượt liệt kê, thay vì mã hoá chính sách vào duy nhất một tài liệu JSON mà chẳng ai mở. Hai mối nguy liên quan cũng đáng mang theo: các rule KHÔNG cộng dồn — một object khớp nhiều rule thì lấy hạn sớm nhất — và <code>Expiration.Days: 0</code> nghĩa là "xoá ở lượt quét kế tiếp", thứ lặng lẽ giết mọi lượt tải lên tương lai dưới tiền tố đó. Và vì việc xoá là bất đồng bộ và không đảo ngược được, cách để thử một rule mới là chạy lượt liệt kê tương đương TRƯỚC rồi đọc xem cái gì trở về. Phương án 1 bịa ra phép so khớp có nhận biết đoạn đường dẫn rồi giải thích cho trôi cái bằng chứng đang mâu thuẫn với nó. Phương án 3 bịa ra một phân biệt lá-với-tiền-tố; mọi key đều là lá, vì tiền tố không phải thực thể. Phương án 4 bịa ra cú pháp dấu sao mà bộ lọc lifecycle không có, và nếu đúng thế thì các rule theo tiền tố sẽ vô dụng.',
          ),
        }),

        // q33 · đáp án 2
        mcq({
          prompt: B(
            'A reconciliation job lists the bucket, asks the database which keys it knows, and finds 142,551 objects with no matching row. A junior engineer proposes deleting all of them in one pass tonight. What is the safe procedure, and what specifically does it protect against?',
            'Một job đối soát liệt kê bucket, hỏi cơ sở dữ liệu xem nó biết những key nào, rồi tìm ra 142.551 object không có dòng nào khớp. Một kỹ sư mới đề xuất xoá hết chúng trong một lượt ngay tối nay. Quy trình an toàn là gì, và nó phòng cụ thể điều gì?',
          ),
          options: [
            B(
              'Delete them but keep a manifest of the keys so anything deleted in error can be restored from it; the manifest is what makes a single pass safe, and it costs one text file',
              'Cứ xoá nhưng giữ lại một bản kê các key để bất cứ thứ gì xoá nhầm đều khôi phục lại được từ đó; chính bản kê mới là thứ làm cho một lượt duy nhất trở nên an toàn, và nó tốn đúng một file văn bản',
            ),
            B(
              'Move them to a <code>deleted/</code> prefix instead of deleting, then expire that prefix after thirty days; this is safe in one pass because a move is reversible whereas a delete is not',
              'Hãy chuyển chúng sang một tiền tố <code>deleted/</code> thay vì xoá, rồi cho tiền tố đó hết hạn sau ba mươi ngày; cách này an toàn trong một lượt vì một phép chuyển thì đảo ngược được còn một phép xoá thì không',
            ),
            B(
              'Log candidates on the first pass without deleting, ignore anything modified within the last day or two, and on a second pass a day later delete only the keys that were candidates <em>both</em> times — the window and the two passes both exist to exclude an object that is in the bucket while its database row is still being written',
              'Hãy ghi log các ứng viên ở lượt đầu mà không xoá, bỏ qua bất cứ thứ gì vừa sửa đổi trong một hai ngày qua, và ở lượt thứ hai một ngày sau chỉ xoá những key là ứng viên ở CẢ HAI lượt — cả cửa sổ thời gian lẫn hai lượt đều tồn tại để loại trừ một object đang nằm trong bucket trong khi dòng cơ sở dữ liệu của nó còn đang được ghi',
            ),
            B(
              'Run the deletion inside the same database transaction that reads the rows, so a key cannot be inserted between the read and the delete; the transaction is what makes a single pass correct without any waiting period',
              'Hãy chạy lượt xoá bên trong đúng cái giao dịch cơ sở dữ liệu đã đọc các dòng, để không key nào chèn được vào giữa lượt đọc và lượt xoá; chính giao dịch đó mới là thứ làm cho một lượt duy nhất trở nên đúng mà không cần chờ đợi gì',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The whole hazard is that "object exists, row does not" has two causes that look identical from outside. One is a genuine orphan — a user account deleted, a background job that died after writing the object. The other is an upload that is <em>in progress right now</em>: the bytes have landed and the row is milliseconds from being committed. Deleting the second kind destroys a file the user is actively uploading, and the user sees a successful upload that later 404s. The age window handles the ordinary version of this race, and the two-pass rule handles the slow version — a resumable upload that took hours, a queued job that had not run yet. A key that is still unreferenced a day later, having already been unreferenced yesterday, is an orphan with high confidence. There is a second reason for the first pass: it lets a human look at what the job would have deleted, and a rule with a bug tends to be obvious in a list of candidates and invisible in a deletion count. Option 1 misunderstands what a manifest gives you: the keys are recoverable, the <em>bytes</em> are not — a deleted object is gone. Option 4 is the sharpest distractor and fails on the boundary: your transaction covers your database, not the bucket, and the upload it is racing against is a separate process writing to a separate system.',
            'Toàn bộ mối nguy nằm ở chỗ "object có, dòng thì không" có hai nguyên nhân mà nhìn từ bên ngoài thì giống hệt nhau. Một là mồ côi thật — một tài khoản người dùng đã bị xoá, một job chạy nền chết sau khi đã ghi object. Cái kia là một lượt tải lên ĐANG DIỄN RA NGAY LÚC NÀY: các byte đã rơi xuống và cái dòng chỉ còn cách vài mili giây nữa là được commit. Xoá loại thứ hai là huỷ mất một file mà người dùng đang tích cực tải lên, và người dùng thấy một lượt tải lên thành công rồi về sau nó trả 404. Cửa sổ theo tuổi xử lý được phiên bản thông thường của cuộc đua này, còn quy tắc hai lượt xử lý được phiên bản chậm — một lượt tải lên nối tiếp kéo dài hàng giờ, một job xếp hàng chưa tới lượt chạy. Một key vẫn còn vô chủ sau một ngày, mà hôm qua cũng đã vô chủ rồi, thì là mồ côi với độ tin cậy cao. Còn một lý do thứ hai cho lượt đầu: nó cho một con người NHÌN xem job định xoá cái gì, và một rule có lỗi thì thường hiện rõ mồn một trong một danh sách ứng viên và vô hình trong một con số đếm lượt xoá. Phương án 1 hiểu sai thứ mà một bản kê cho bạn: các KEY thì khôi phục được, còn các BYTE thì không — một object đã xoá là đi mất. Phương án 4 là phương án nhiễu sắc nhất và chết ở chỗ ranh giới: giao dịch của bạn phủ cơ sở dữ liệu của bạn chứ không phủ cái bucket, và lượt tải lên mà nó đang đua là một tiến trình riêng đang ghi vào một hệ thống riêng.',
          ),
        }),

        // q34 · đáp án 3
        mcq({
          prompt: B(
            'A lifecycle configuration is saved at 09:00 on Monday: expire everything under <code>exports/</code> after 30 days. At 09:05 a listing shows the same 4,712 objects, including many far older than 30 days. Three hypotheses are on the table. Which reasoning is right?',
            'Một cấu hình lifecycle được lưu lúc 09:00 thứ Hai: cho mọi thứ dưới <code>exports/</code> hết hạn sau 30 ngày. Lúc 09:05 một lượt liệt kê vẫn hiện đủ 4.712 object, trong đó nhiều cái cũ hơn 30 ngày rất nhiều. Có ba giả thuyết trên bàn. Lập luận nào đúng?',
          ),
          options: [
            B(
              'The rule applies only to objects uploaded after it was created, which is why the old exports survive; to remove existing ones you need a one-off deletion script and the rule then keeps the prefix clean going forward',
              'Rule chỉ áp cho những object tải lên SAU khi nó được tạo, và đó là lý do các bản export cũ sống sót; muốn xoá những cái đã có thì cần một script xoá một lần, rồi sau đó rule sẽ giữ cho tiền tố sạch về sau',
            ),
            B(
              'Expiration is evaluated lazily on access, so an object is deleted the first time something requests it after it has aged out; a listing does not count as access, which is why the count has not moved',
              'Việc hết hạn được đánh giá lười theo lượt truy cập, nên một object bị xoá ở lần đầu tiên có thứ gì đó yêu cầu nó sau khi nó đã quá tuổi; một lượt liệt kê không tính là truy cập, và đó là lý do con số chưa nhúc nhích',
            ),
            B(
              'The configuration silently failed to save because a rule needs a non-empty <code>ID</code> and a <code>Status</code>, and a tool-generated document omits them; reading the configuration back would return an empty rule set',
              'Cấu hình đã âm thầm không lưu được vì một rule cần một <code>ID</code> khác rỗng và một <code>Status</code>, mà tài liệu do công cụ sinh ra thì bỏ sót chúng; đọc lại cấu hình sẽ trả về một tập rule rỗng',
            ),
            B(
              'Lifecycle runs as an asynchronous background sweep on the provider\'s own schedule, typically about once a day, so five minutes proves nothing — read the configuration back to confirm each rule\'s <code>Status</code> is <code>Enabled</code>, then measure again a day or a week later',
              'Lifecycle chạy dưới dạng một lượt quét nền bất đồng bộ theo lịch của chính nhà cung cấp, thường khoảng một lần mỗi ngày, nên năm phút chẳng chứng minh được gì — hãy đọc lại cấu hình để xác nhận <code>Status</code> của từng rule là <code>Enabled</code>, rồi đo lại sau một ngày hoặc một tuần',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Lifecycle is a promise about eventual state, not an operation you invoke. The provider sweeps buckets on its own schedule — roughly daily — and applies the rules it finds; saving a configuration schedules nothing and triggers nothing. So the correct expectation after saving a rule is "the first pass usually completes within a day or two", and a measurement at five minutes is simply too early to distinguish a working rule from a broken one. There is a second, cheaper check to run immediately, and it catches the failure this question is really testing for: read the configuration back and look at each rule\'s <code>Status</code>. A rule saved as <code>"Disabled"</code> — the default some generators emit — sits in the console looking configured and does nothing forever, and it will still be doing nothing next month when someone concludes lifecycle is unreliable. So: verify the configuration now, verify the effect later, and never conclude from the gap in between. Option 1 invents a "new objects only" semantics; expiration is computed from each object\'s own age. Option 2 invents lazy evaluation on access, which would mean an object nobody reads is never deleted — the opposite of the point. Option 3 names two fields that do matter for a valid rule, but a document missing them is rejected at save time with an explicit error rather than saved silently.',
            'Lifecycle là một lời hứa về trạng thái rốt cuộc, không phải một thao tác bạn gọi. Nhà cung cấp quét các bucket theo lịch của chính họ — cỡ hằng ngày — rồi áp những rule nó tìm thấy; việc lưu một cấu hình không lên lịch gì và không kích hoạt gì. Vậy nên kỳ vọng đúng sau khi lưu một rule là "lượt quét đầu tiên thường xong trong một hai ngày", và một phép đo ở phút thứ năm thì đơn giản là quá sớm để phân biệt một rule đang chạy với một rule đã hỏng. Có một phép kiểm thứ hai rẻ hơn nên chạy ngay lập tức, và nó bắt đúng cái cú hỏng mà câu này thật sự nhắm tới: hãy ĐỌC LẠI cấu hình và nhìn <code>Status</code> của từng rule. Một rule lưu ở dạng <code>"Disabled"</code> — mặc định mà vài công cụ sinh ra — thì ngồi trong bảng điều khiển trông như đã cấu hình xong và chẳng làm gì mãi mãi, và tháng sau nó vẫn sẽ đang chẳng làm gì lúc ai đó kết luận rằng lifecycle không đáng tin. Vậy nên: kiểm cấu hình NGAY, kiểm hiệu quả SAU, và đừng bao giờ kết luận từ cái khoảng ở giữa. Phương án 1 bịa ra ngữ nghĩa "chỉ object mới"; hạn được tính từ tuổi của chính từng object. Phương án 2 bịa ra việc đánh giá lười theo lượt truy cập, mà như thế thì một object không ai đọc sẽ không bao giờ bị xoá — ngược hẳn với mục đích. Phương án 3 nêu tên hai trường thật sự quan trọng để một rule hợp lệ, nhưng một tài liệu thiếu chúng thì bị TỪ CHỐI ngay lúc lưu kèm một lỗi tường minh chứ không được lưu âm thầm.',
          ),
        }),

        // q35 · đáp án 0
        mcq({
          prompt: B(
            'A user deletes their account. The application removes their rows but a bug skips the bucket deletion, leaving ~89,000 objects under <code>users/&lt;id&gt;/</code> that nothing references. A proposal: "add a lifecycle rule that deletes objects belonging to deleted users." Why can that rule not be written?',
            'Một người dùng xoá tài khoản. Ứng dụng gỡ các dòng của họ nhưng một lỗi làm bỏ qua bước xoá trên bucket, để lại khoảng 89.000 object dưới <code>users/&lt;id&gt;/</code> mà không gì tham chiếu tới. Có một đề xuất: "thêm một lifecycle rule xoá các object thuộc về người dùng đã bị xoá." Vì sao rule đó không viết được?',
          ),
          options: [
            B(
              'Because a lifecycle rule can only see per-object facts the storage service itself holds — age, key prefix, size, storage class — and "is this key still referenced" is a fact that lives in your database, which lifecycle has no access to; that class of cleanup needs a reconciliation job that reads both sides',
              'Vì một lifecycle rule chỉ nhìn thấy những sự kiện theo từng object mà bản thân dịch vụ lưu trữ nắm — tuổi, tiền tố key, kích thước, lớp lưu trữ — còn "key này còn được tham chiếu không" là một sự kiện sống trong cơ sở dữ liệu của bạn, thứ mà lifecycle không có đường truy cập; lớp việc dọn dẹp đó cần một job đối soát đọc cả hai phía',
            ),
            B(
              'Because lifecycle rules are limited to a small number per bucket, so one rule per deleted user exhausts the quota immediately; the workaround is to move each deleted user\'s objects under a shared prefix and expire that prefix instead',
              'Vì mỗi bucket chỉ được một số lượng nhỏ lifecycle rule, nên mỗi người dùng bị xoá một rule là cạn hạn mức ngay lập tức; cách lách là chuyển object của từng người dùng đã xoá về một tiền tố dùng chung rồi cho tiền tố đó hết hạn',
            ),
            B(
              'Because expiration is computed from the object\'s creation time, and these objects were created long before the account was deleted, so any age-based rule would delete the accounts that are still active first',
              'Vì hạn được tính từ thời điểm tạo object, mà những object này được tạo từ rất lâu trước khi tài khoản bị xoá, nên bất kỳ rule theo tuổi nào cũng sẽ xoá trước những tài khoản vẫn đang hoạt động',
            ),
            B(
              'Because the objects have no tags identifying their owner: lifecycle can filter on object tags, so the rule becomes writable as soon as every upload is tagged with its user id, and back-filling those tags is the actual task',
              'Vì các object không có nhãn nào cho biết chủ của chúng: lifecycle lọc được theo nhãn object, nên rule sẽ viết được ngay khi mọi lượt tải lên đều được gắn nhãn kèm id người dùng, và việc thật sự cần làm là nạp bù các nhãn đó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Lifecycle rules are evaluated by the storage service using only what the storage service knows about an object. That set is small and entirely local: how old it is, what its key starts with, how big it is, which storage class it is in. "Is this key still referenced by a row in Postgres" is not in that set and cannot be put into it, because the service has no view of your application at all. So the two cleanup problems are genuinely different in kind. <b>Time-based</b> cleanup — abandoned multipart parts, temporary exports, reset-token attachments — is exactly what lifecycle is for, and a rule handles it forever with no code. <b>Reference-based</b> cleanup — deleted accounts, deleted posts, superseded avatars — requires reading both systems and comparing, which is a job you write and schedule. Recognising which kind you are looking at is the useful skill, because trying to express a reference problem as an age rule produces either a rule that deletes live data or a rule that deletes nothing. Option 2 invents a per-user rule design that would be wrong even if the quota were infinite, though the shared-prefix idea it lands on is a real technique — move-then-expire is a legitimate way to convert a reference problem into a time problem. Option 3 describes a real reason age-based rules are the wrong tool here, but states it as an arithmetic problem rather than the structural one. Option 4 is the strongest distractor: S3 lifecycle really can filter on object tags, and tagging uploads with an owner would let a rule select them — but a tag is a static label, and the rule still could not know that the owner has since been deleted, so the tag has to be rewritten by a job, which is the reconciliation job again.',
            'Các lifecycle rule được chính dịch vụ lưu trữ đánh giá, chỉ bằng những gì dịch vụ lưu trữ biết về một object. Tập đó nhỏ và hoàn toàn cục bộ: nó bao nhiêu tuổi, key của nó bắt đầu bằng gì, nó nặng bao nhiêu, nó ở lớp lưu trữ nào. "Key này còn được một dòng trong Postgres tham chiếu không" thì KHÔNG nằm trong tập đó và cũng không nhét vào được, vì dịch vụ hoàn toàn không có tầm nhìn nào vào ứng dụng của bạn. Vậy nên hai bài toán dọn dẹp thật sự khác nhau về BẢN CHẤT. Dọn dẹp <b>theo thời gian</b> — các phần multipart bị bỏ, các bản export tạm, các tệp đính kèm token đặt lại mật khẩu — đúng là thứ lifecycle sinh ra để làm, và một rule lo nó mãi mãi mà không cần dòng mã nào. Dọn dẹp <b>theo tham chiếu</b> — tài khoản đã xoá, bài viết đã xoá, ảnh đại diện đã bị thay — đòi phải đọc cả hai hệ thống rồi so, và đó là một job bạn phải viết và xếp lịch. Nhận ra mình đang nhìn loại nào mới là kỹ năng có ích, bởi vì cố diễn đạt một bài toán tham chiếu thành một rule theo tuổi thì hoặc ra một rule xoá mất dữ liệu sống, hoặc ra một rule chẳng xoá gì. Phương án 2 bịa ra một thiết kế mỗi-người-dùng-một-rule vốn sẽ sai kể cả khi hạn mức là vô hạn, dù cái ý tiền-tố-dùng-chung mà nó rơi vào lại là một kỹ thuật có thật — chuyển-rồi-cho-hết-hạn là một cách chính đáng để biến một bài toán tham chiếu thành một bài toán thời gian. Phương án 3 mô tả một lý do có thật khiến rule theo tuổi là công cụ sai ở đây, nhưng lại phát biểu nó như một bài toán số học chứ không phải bài toán cấu trúc. Phương án 4 là phương án nhiễu mạnh nhất: lifecycle của S3 THẬT SỰ lọc được theo nhãn object, và gắn nhãn chủ sở hữu vào các lượt tải lên sẽ cho một rule chọn được chúng — nhưng một cái nhãn là một mẩu dán tĩnh, và rule vẫn không thể biết rằng chủ sở hữu từ đó đã bị xoá, nên cái nhãn phải được một job ghi lại, và đó lại chính là job đối soát.',
          ),
        }),

        /* ── Chương 7 — quản lý chi phí (5 câu) ────────────────────────── */

        // q36 · đáp án 1
        mcq({
          prompt: B(
            'A bucket holds 10 million objects. A sync job runs hourly and starts by listing the whole bucket to build an index. Using the course\'s published rates (Class A: R2 $4.50, S3 $5.00 per million; Class B: R2 $0.36, S3 $0.40 per million; storage R2 $0.015/GB-month) and a page size of 1000 keys, what dominates the bill and why?',
            'Một bucket giữ 10 triệu object. Một job đồng bộ chạy mỗi giờ và bắt đầu bằng việc liệt kê cả bucket để dựng một chỉ mục. Dùng bảng giá công bố trong giáo trình (Class A: R2 4,50 $, S3 5,00 $ mỗi triệu; Class B: R2 0,36 $, S3 0,40 $ mỗi triệu; lưu trữ R2 0,015 $/GB-tháng) và kích thước trang 1000 key, cái gì chiếm chủ đạo trên hoá đơn và vì sao?',
          ),
          options: [
            B(
              'Class B, because each listing page also reads the metadata of the thousand keys it returns, and reads are what a listing fundamentally is even though they are billed per page',
              'Class B, vì mỗi trang liệt kê còn đọc luôn siêu dữ liệu của một nghìn key nó trả về, và về bản chất một lượt liệt kê chính là các phép đọc dù nó được tính tiền theo trang',
            ),
            B(
              'Class A, because a listing is billed as a write-class operation once per page: 10,000 pages per run × 24 runs × 30 days = 7.2 million Class A operations a month, about $32 on R2 and $36 on S3 — for a job that moved no bytes at all',
              'Class A, vì một lượt liệt kê được tính là thao tác lớp-ghi, mỗi trang một lần: 10.000 trang mỗi lượt × 24 lượt × 30 ngày = 7,2 triệu thao tác Class A mỗi tháng, khoảng 32 $ trên R2 và 36 $ trên S3 — cho một job không hề dịch chuyển một byte nào',
            ),
            B(
              'Storage, because an index of 10 million keys has to be written back to the bucket on every run, and 720 index objects a month accumulate faster than the listing costs',
              'Lưu trữ, vì một chỉ mục 10 triệu key phải được ghi ngược lại vào bucket ở mỗi lượt chạy, và 720 object chỉ mục mỗi tháng tích tụ nhanh hơn chi phí liệt kê',
            ),
            B(
              'Egress, because listing responses are XML documents of several hundred kilobytes each and 7.2 million of them leaving the provider network is the largest byte volume in the job',
              'Truyền ra, vì các phản hồi liệt kê là những tài liệu XML nặng vài trăm kilobyte mỗi cái, và 7,2 triệu cái rời khỏi mạng của nhà cung cấp là khối lượng byte lớn nhất trong job này',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The arithmetic is the answer, and the surprising part is which line it lands on. <code>ListObjectsV2</code> returns at most 1000 keys per call, so 10 million objects is 10,000 calls per run; hourly for thirty days is 10,000 × 24 × 30 = 7.2 million calls. Listing is billed as <b>Class A</b> — the same class as <code>PutObject</code>, roughly ten times the price of a read — so that is 7.2 × $4.50 ≈ $32 a month on R2 and 7.2 × $5.00 = $36 on S3. Nothing was uploaded, nothing was downloaded, no object was even opened. The general shape is worth memorising because it recurs: <b>listing is a write-priced operation, and it scales with object count rather than with data volume</b>, so the cheapest-looking line of a job can be its most expensive. Two habits follow. Use <code>HeadObject</code> — Class B, ten times cheaper — when the question is "does this key exist", instead of listing a prefix to find out. And when a bill jumps overnight, look at Class A before anything else; a runaway listing loop is the single most common cause, and it never shows up in the storage figure people check first. Option 1 gets the billing class wrong and invents a per-key charge on top of the per-page one. Option 3 mistakes an in-memory index for stored objects; even if it were written back, 720 objects is negligible. Option 4 confuses request volume with byte volume — 7.2 million small XML responses are a rounding error next to a single video download.',
            'Phép tính chính là đáp án, và phần bất ngờ nằm ở chỗ nó rơi vào DÒNG NÀO. <code>ListObjectsV2</code> trả về tối đa 1000 key mỗi lời gọi, nên 10 triệu object là 10.000 lời gọi mỗi lượt chạy; mỗi giờ một lượt trong ba mươi ngày là 10.000 × 24 × 30 = 7,2 triệu lời gọi. Việc liệt kê được tính là <b>Class A</b> — cùng lớp với <code>PutObject</code>, đắt gấp cỡ mười lần một phép đọc — nên ra 7,2 × 4,50 $ ≈ 32 $ mỗi tháng trên R2 và 7,2 × 5,00 $ = 36 $ trên S3. Chẳng có gì được tải lên, chẳng có gì được tải xuống, chẳng object nào thậm chí được mở ra. Cái hình dạng tổng quát này đáng thuộc lòng vì nó cứ lặp lại: <b>liệt kê là một thao tác tính giá kiểu ghi, và nó phình theo SỐ LƯỢNG OBJECT chứ không theo khối lượng dữ liệu</b>, nên cái dòng trông rẻ nhất của một job lại có thể là dòng đắt nhất. Hai thói quen theo sau. Hãy dùng <code>HeadObject</code> — Class B, rẻ hơn mười lần — khi câu hỏi là "key này có tồn tại không", thay vì liệt kê cả một tiền tố để tìm hiểu. Và khi một hoá đơn nhảy vọt qua đêm, hãy nhìn Class A trước mọi thứ khác; một vòng lặp liệt kê chạy trốn là nguyên nhân phổ biến nhất, và nó không bao giờ hiện ra ở con số lưu trữ mà người ta hay kiểm đầu tiên. Phương án 1 nhầm lớp tính tiền và bịa thêm một khoản phí theo từng key chồng lên khoản phí theo từng trang. Phương án 3 nhầm một chỉ mục trong bộ nhớ thành các object đã lưu; mà kể cả có ghi ngược lại thì 720 object cũng là không đáng kể. Phương án 4 lẫn khối lượng REQUEST với khối lượng BYTE — 7,2 triệu phản hồi XML nhỏ là một sai số làm tròn bên cạnh một lượt tải một video.',
          ),
        }),

        // q37 · đáp án 2
        mcq({
          prompt: B(
            'A sync routine checks whether each of 50,000 files has already been uploaded:' +
            code("for (const f of files) {\n" +
              '  const r = await s3.send(new ListObjectsV2Command({\n' +
              '    Bucket, Prefix: f.key, MaxKeys: 1,\n' +
              '  }));\n' +
              '  if (!r.KeyCount) await upload(f);\n' +
              '}\n' +
              '# ket qua lan chay: 400 file thuc su duoc tai len') +
            'It works and the code looks harmless. What is wrong with it?',

            'Một thủ tục đồng bộ kiểm xem từng file trong 50.000 file đã được tải lên chưa:' +
            code("for (const f of files) {\n" +
              '  const r = await s3.send(new ListObjectsV2Command({\n' +
              '    Bucket, Prefix: f.key, MaxKeys: 1,\n' +
              '  }));\n' +
              '  if (!r.KeyCount) await upload(f);\n' +
              '}\n' +
              '# ket qua lan chay: 400 file thuc su duoc tai len') +
            'Nó chạy được và đoạn mã trông vô hại. Nó sai ở chỗ nào?',
          ),
          options: [
            B(
              'It is correct but slow: 50,000 sequential round trips take hours, and the fix is purely a concurrency one — run the checks in batches with <code>Promise.all</code> and the cost stays the same',
              'Nó đúng nhưng chậm: 50.000 lượt đi về tuần tự mất hàng giờ, và cách chữa thuần tuý là chuyện chạy song song — cho các lượt kiểm chạy theo lô bằng <code>Promise.all</code> là chi phí vẫn y nguyên',
            ),
            B(
              'It can miss files, because <code>MaxKeys: 1</code> returns the first key in sorted order under that prefix rather than an exact match; a key that sorts after a sibling reports as present when it is not, and the fix is to compare <code>r.Contents[0].Key</code> to <code>f.key</code>',
              'Nó có thể bỏ sót file, vì <code>MaxKeys: 1</code> trả về key ĐẦU TIÊN theo thứ tự sắp xếp dưới tiền tố đó chứ không phải một cái khớp chính xác; một key sắp sau một anh em của nó sẽ bị báo là đã có trong khi thật ra không có, và cách chữa là so <code>r.Contents[0].Key</code> với <code>f.key</code>',
            ),
            B(
              'It uses a Class A operation to answer an existence question: 50,000 listings cost roughly ten times what 50,000 <code>HeadObject</code> calls would, so the request line on the bill can exceed the storage line for a job whose real work was uploading 400 files',
              'Nó dùng một thao tác Class A để trả lời một câu hỏi về sự tồn tại: 50.000 lượt liệt kê tốn cỡ mười lần so với 50.000 lời gọi <code>HeadObject</code>, nên dòng phí request trên hoá đơn có thể vượt cả dòng phí lưu trữ, cho một job mà phần việc thật chỉ là tải lên 400 file',
            ),
            B(
              'It leaks memory: each <code>ListObjectsV2Command</code> holds a continuation token that is never released because the loop discards the response, so a run over 50,000 files exhausts the heap before it finishes',
              'Nó rò bộ nhớ: mỗi <code>ListObjectsV2Command</code> giữ một continuation token không bao giờ được giải phóng vì vòng lặp vứt bỏ phản hồi, nên một lượt chạy trên 50.000 file làm cạn heap trước khi xong',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Nothing in this loop <em>looks</em> expensive, which is exactly the trap. A listing is a Class A operation — the same billing class as a write, about ten times a read — and this code issues 50,000 of them to answer a question <code>HeadObject</code> answers for a tenth of the price. Worse, the job\'s actual work was 400 uploads, so the vast majority of the spend went on checking rather than doing. That inversion is the signature of the mistake: <b>the request line on the invoice exceeds the storage line, for a job that barely moved any data</b>. The rewrite is small and has two levels. The direct one is <code>HeadObject</code> per file: same semantics, Class B pricing, and a cleaner failure mode (<code>err.name === \'NotFound\'</code>). The better one is to stop asking per file at all — list the prefix <em>once</em>, put the keys in a <code>Set</code>, and check membership in memory, which turns 50,000 requests into a few dozen pages. Option 1 addresses latency, which is real, but concurrency multiplies the request rate without reducing the request count, so the bill is unchanged. Option 2 identifies a genuine correctness bug in prefix-as-existence-check — the returned key really is a prefix match, not an exact one — but it is the smaller of the two problems here and does not explain the cost. Option 4 invents a leak; the responses are ordinary objects and are garbage-collected.',
            'Chẳng có gì trong vòng lặp này TRÔNG đắt, và đó chính xác là cái bẫy. Một lượt liệt kê là thao tác Class A — cùng lớp tính tiền với một phép ghi, cỡ mười lần một phép đọc — và đoạn mã này phát ra 50.000 cái trong số đó để trả lời một câu hỏi mà <code>HeadObject</code> trả lời với một phần mười giá. Tệ hơn, phần việc thật của job chỉ là 400 lượt tải lên, nên đại đa số tiền tiêu vào việc KIỂM chứ không vào việc LÀM. Cái sự đảo ngược đó là dấu hiệu của sai lầm này: <b>dòng phí request trên hoá đơn vượt cả dòng phí lưu trữ, cho một job gần như không dịch chuyển dữ liệu nào</b>. Bản viết lại thì nhỏ và có hai mức. Mức trực tiếp là <code>HeadObject</code> cho mỗi file: cùng ngữ nghĩa, giá Class B, và một kiểu hỏng sạch hơn (<code>err.name === \'NotFound\'</code>). Mức tốt hơn là thôi hẳn việc hỏi theo từng file — liệt kê tiền tố ĐÚNG MỘT LẦN, đổ các key vào một <code>Set</code>, rồi kiểm thành viên ngay trong bộ nhớ, và như thế 50.000 request biến thành vài chục trang. Phương án 1 nhắm vào độ trễ, thứ có thật, nhưng chạy song song chỉ nhân tốc độ phát request lên chứ không giảm SỐ LƯỢNG request, nên hoá đơn không đổi. Phương án 2 chỉ ra một lỗi đúng-sai có thật trong việc dùng tiền tố làm phép kiểm tồn tại — cái key trả về đúng là một lượt khớp tiền tố chứ không phải khớp chính xác — nhưng nó là vấn đề nhỏ hơn trong hai vấn đề ở đây và không giải thích được chi phí. Phương án 4 bịa ra một chỗ rò; các phản hồi là những object bình thường và được thu gom rác.',
          ),
        }),

        // q38 · đáp án 3
        mcq({
          prompt: B(
            'An image pipeline produces 14 objects per upload (four widths × three formats, plus the original and a blur placeholder). A designer asks for one more width. A script regenerates the whole library of 200,000 photos. Using the course\'s published rate of $4.50 per million Class A operations on R2, what is the cost and where does it appear?',
            'Một đường ống ảnh sinh ra 14 object cho mỗi lượt tải lên (bốn chiều rộng × ba định dạng, cộng bản gốc và một ảnh mờ giữ chỗ). Một nhà thiết kế xin thêm một chiều rộng nữa. Một script sinh lại toàn bộ thư viện 200.000 tấm ảnh. Dùng mức giá công bố trong giáo trình là 4,50 $ mỗi triệu thao tác Class A trên R2, chi phí là bao nhiêu và nó hiện ra ở đâu?',
          ),
          options: [
            B(
              'About $12.60 in Class A, but it appears immediately as a spend alert rather than on the invoice, because regeneration writes are metered in real time and a single burst of that size trips any reasonable budget threshold',
              'Khoảng 12,60 $ tiền Class A, nhưng nó hiện ra ngay lập tức dưới dạng một cảnh báo chi tiêu chứ không hiện trên hoá đơn, vì các lượt ghi khi sinh lại được đo theo thời gian thực và một đợt bùng phát cỡ đó làm nổ mọi ngưỡng ngân sách hợp lý',
            ),
            B(
              'Nothing measurable, because regenerating an object that already exists is an overwrite rather than a new write, and overwrites are billed at the read rate since no additional storage is allocated',
              'Không có gì đo được, vì sinh lại một object đã tồn tại là một lượt ghi đè chứ không phải một lượt ghi mới, và ghi đè được tính ở mức giá của phép đọc vì không có dung lượng nào được cấp thêm',
            ),
            B(
              'About $126, because the regeneration also has to read each original before writing the variants, and the reads are the dominant term at this object count',
              'Khoảng 126 $, vì lượt sinh lại còn phải ĐỌC từng bản gốc trước khi ghi các biến thể, và các phép đọc mới là số hạng chiếm chủ đạo ở mức số lượng object này',
            ),
            B(
              'About $12.60 — 200,000 × 14 = 2.8 million writes at $4.50 per million — and it lands as a Class A line on next month\'s invoice with nothing to attribute it to, which is why variant additions should apply to new uploads only and existing photos should regenerate lazily on first view',
              'Khoảng 12,60 $ — 200.000 × 14 = 2,8 triệu lượt ghi, mức 4,50 $ mỗi triệu — và nó rơi xuống thành một dòng Class A trên hoá đơn tháng sau mà chẳng có gì để quy trách nhiệm, và đó là lý do việc thêm biến thể chỉ nên áp cho các lượt tải lên mới còn ảnh đã có thì nên sinh lại một cách lười ở lần xem đầu tiên',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Two numbers matter and one of them is not on the invoice. The arithmetic: 200,000 photos × 14 variants = 2.8 million <code>PutObject</code> calls, each a Class A operation, at $4.50 per million ≈ $12.60. That is small in isolation — which is precisely why nobody flags it in review — and it is a full month of normal upload volume, spent in an afternoon, by a script somebody ran once. Run the same script weekly and it becomes a real line item; run it after every pipeline tweak and it becomes a mystery on the invoice, because the charge appears a month later under "Class A" with no connection to the pull request that caused it. This is the value of the third defence from the cost chapter: request logs grouped by token turn "why did Class A triple in August" into "the migration token issued 2.8 million writes on the 14th". The design fix is to stop regenerating: add new variants for new uploads only, and let existing photos produce the new size on first request through an on-demand transform that caches at the edge — photos nobody opens then cost nothing at all, which for a typical library is most of them. Option 1 assumes a real-time alert that no budget system provides; billing alerts trail actual spend by hours to days. Option 2 invents overwrite pricing — an overwrite is a full Class A write. Option 3 adds a plausible read term but gets the magnitude backwards: reads are Class B at a tenth the price, so they are the smaller half, not the dominant one.',
            'Có hai con số quan trọng và một trong hai không nằm trên hoá đơn. Phép tính: 200.000 ảnh × 14 biến thể = 2,8 triệu lời gọi <code>PutObject</code>, mỗi cái là một thao tác Class A, ở mức 4,50 $ mỗi triệu ≈ 12,60 $. Con số đó nhỏ khi đứng một mình — và chính vì thế mà chẳng ai gắn cờ nó lúc review — nhưng nó bằng trọn một tháng khối lượng tải lên bình thường, tiêu hết trong một buổi chiều, bởi một script ai đó chạy đúng một lần. Chạy đúng script ấy hằng tuần thì nó thành một dòng chi phí thật; chạy nó sau mỗi lần tinh chỉnh đường ống thì nó thành một điều bí ẩn trên hoá đơn, vì khoản phí xuất hiện một tháng sau dưới mục "Class A" mà chẳng có mối liên hệ nào với cái pull request đã gây ra nó. Đây chính là giá trị của lớp phòng thủ thứ ba trong chương chi phí: log request gom theo token biến "vì sao Class A tăng gấp ba hồi tháng Tám" thành "token migration đã phát 2,8 triệu lượt ghi vào ngày 14". Cách chữa về thiết kế là THÔI SINH LẠI: thêm biến thể mới chỉ cho các lượt tải lên mới, và để ảnh đã có tự sinh ra kích thước mới ở lần yêu cầu đầu tiên qua một phép biến đổi theo yêu cầu có lưu đệm ở biên — khi đó những tấm ảnh không ai mở chẳng tốn gì cả, mà với một thư viện điển hình thì đó là đa số. Phương án 1 giả định một cảnh báo thời gian thực mà không hệ thống ngân sách nào cung cấp; cảnh báo hoá đơn đi sau chi tiêu thật vài giờ tới vài ngày. Phương án 2 bịa ra giá cho ghi đè — một lượt ghi đè là một lượt ghi Class A đầy đủ. Phương án 3 thêm vào một số hạng đọc nghe hợp lý nhưng nhầm độ lớn: các phép đọc là Class B với một phần mười giá, nên chúng là nửa NHỎ hơn chứ không phải nửa chiếm chủ đạo.',
          ),
        }),

        // q39 · đáp án 0
        mcq({
          prompt: B(
            'A debugging script left running over a weekend lists a 100-million-object bucket in a loop. Monday\'s invoice carries an unexplained Class A charge. Three defences were available: a budget alert on monthly spend, a rate alarm on Class A operations per minute, and request logging to a separate bucket. What does each one give you, and which would have stopped this?',
            'Một script gỡ lỗi bị bỏ chạy suốt cuối tuần cứ liệt kê một bucket 100 triệu object trong một vòng lặp. Hoá đơn sáng thứ Hai mang một khoản Class A không giải thích được. Có ba lớp phòng thủ khả dụng: một cảnh báo ngân sách theo chi tiêu tháng, một cảnh báo tốc độ theo số thao tác Class A mỗi phút, và log request đổ sang một bucket riêng. Mỗi cái cho bạn thứ gì, và cái nào đã ngăn được vụ này?',
          ),
          options: [
            B(
              'The budget alert names the outcome after the money is spent, the rate alarm is the only one that fires while the script is still running and can be killed, and the logs answer "which token did this" afterwards — so the rate alarm would have stopped it, and the other two are for confirming and attributing',
              'Cảnh báo ngân sách gọi tên KẾT QUẢ sau khi tiền đã tiêu, cảnh báo tốc độ là cái DUY NHẤT nổ trong lúc script còn đang chạy và còn giết được, còn log thì trả lời "token nào đã làm việc này" về sau — nên cảnh báo tốc độ mới là thứ đã ngăn được, còn hai cái kia dùng để xác nhận và quy trách nhiệm',
            ),
            B(
              'The budget alert would have stopped it, because a spend threshold is evaluated continuously against accrued cost and pauses new requests once the ceiling is crossed; the other two are diagnostic only and cannot intervene',
              'Cảnh báo ngân sách đã ngăn được, vì một ngưỡng chi tiêu được đánh giá liên tục dựa trên chi phí đã phát sinh và nó tạm dừng các request mới khi trần bị vượt; hai cái kia chỉ để chẩn đoán và không can thiệp được',
            ),
            B(
              'Request logging would have stopped it, because a log sink with a volume cap rejects further requests from the offending token once the cap is reached, which is why logging is configured before any alarm',
              'Log request đã ngăn được, vì một bể chứa log có trần khối lượng sẽ từ chối các request tiếp theo từ cái token gây chuyện khi trần bị chạm, và đó là lý do log được cấu hình trước mọi cảnh báo',
            ),
            B(
              'None of the three could have stopped it, since all are observational; the only real defence is to scope every token so tightly that a debugging script cannot list a large bucket in the first place',
              'Không cái nào trong ba cái ngăn được, vì cả ba đều chỉ quan sát; phòng tuyến thật duy nhất là thu hẹp mọi token chặt tới mức một script gỡ lỗi không thể liệt kê nổi một bucket lớn ngay từ đầu',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The three defences answer three different questions and are not interchangeable. A <b>budget alert</b> answers "did I spend too much" — it trails actual spend by hours or days, so it tells you an incident happened and is worth having as a backstop, but by the time it fires the weekend is over. A <b>rate alarm</b> answers "is something happening right now" — set at a small multiple of your steady state and evaluated per minute, it fires within the first fifteen minutes of a runaway, which is the only window in which killing the script saves money. A <b>request log</b> answers "who did it" — grouped by token and sorted by count, it turns a mystery charge into a name, and without it you never find out, because the invoice has no attribution. So the ordering is: the rate alarm prevents, the budget alert confirms, the logs attribute; and after any incident you lower the rate threshold to whatever level the runaway was already visible at. Option 2 gives a budget alert an enforcement power it does not have — it notifies, it does not throttle, and forecast-based thresholds can miss a sudden spike entirely, which is why they should always be paired with an actual-spend threshold. Option 3 invents a log-sink quota that would, if it existed, drop the evidence rather than the traffic. Option 4 is half right about observation but wrong about the conclusion: tight token scoping is genuinely good practice and would have limited the blast radius, but a legitimate token still needs to list, so an alarm remains the thing that catches a loop.',
            'Ba lớp phòng thủ trả lời ba câu hỏi khác nhau và không thay thế cho nhau được. Một <b>cảnh báo ngân sách</b> trả lời "tôi có tiêu quá không" — nó đi sau chi tiêu thật vài giờ tới vài ngày, nên nó nói cho bạn biết một sự cố ĐÃ xảy ra và đáng có làm lớp chặn cuối, nhưng tới lúc nó nổ thì cuối tuần đã trôi qua rồi. Một <b>cảnh báo tốc độ</b> trả lời "có gì đó đang xảy ra ngay lúc này không" — đặt ở một bội số nhỏ của mức nền và đánh giá theo từng phút, nó nổ trong mười lăm phút đầu của một cú chạy trốn, và đó là cửa sổ DUY NHẤT mà việc giết script còn cứu được tiền. Một <b>log request</b> trả lời "ai đã làm" — gom theo token và sắp theo số lượng, nó biến một khoản phí bí ẩn thành một cái tên, và không có nó thì bạn không bao giờ tìm ra, vì hoá đơn không quy trách nhiệm cho ai cả. Vậy thứ tự là: cảnh báo tốc độ NGĂN, cảnh báo ngân sách XÁC NHẬN, log QUY TRÁCH NHIỆM; và sau mỗi sự cố thì bạn hạ ngưỡng tốc độ xuống đúng cái mức mà cú chạy trốn vốn đã nhìn thấy được. Phương án 2 trao cho cảnh báo ngân sách một quyền cưỡng chế mà nó không có — nó THÔNG BÁO chứ không bóp lưu lượng, và các ngưỡng dựa trên dự báo hoàn toàn có thể bỏ sót một cú tăng đột ngột, và đó là lý do chúng luôn nên đi cặp với một ngưỡng theo chi tiêu THẬT. Phương án 3 bịa ra một hạn mức cho bể chứa log mà nếu có thật thì nó sẽ vứt bỏ BẰNG CHỨNG chứ không vứt lưu lượng. Phương án 4 đúng một nửa về chuyện quan sát nhưng sai ở kết luận: thu hẹp phạm vi token đúng là thực hành tốt và sẽ hạn chế được bán kính vụ nổ, nhưng một token chính đáng thì vẫn cần liệt kê, nên cái bắt được một vòng lặp vẫn cứ là một cảnh báo.',
          ),
        }),

        // q40 · đáp án 1
        mcq({
          prompt: B(
            'A team configures one budget alert: "notify when <em>forecast</em> monthly spend exceeds $200". Two months later a Saturday-night incident burns $340 in eleven hours and no notification is sent until the following week. What is the flaw, and what is the correct configuration?',
            'Một đội cấu hình đúng một cảnh báo ngân sách: "báo khi chi tiêu tháng DỰ BÁO vượt 200 $". Hai tháng sau, một sự cố đêm thứ Bảy đốt 340 $ trong mười một giờ và không có thông báo nào được gửi cho tới tuần sau. Khiếm khuyết là gì, và cấu hình đúng là gì?',
          ),
          options: [
            B(
              'The threshold was too high for the account\'s baseline: a $200 ceiling on a bucket that normally spends $40 leaves five times the headroom, and lowering it to about 1.5× the steady state is what makes a forecast alarm fire in time',
              'Ngưỡng quá cao so với mức nền của tài khoản: một cái trần 200 $ trên một bucket thường tiêu 40 $ để lại khoảng trống gấp năm lần, và hạ nó xuống khoảng 1,5 lần mức nền mới là thứ làm một cảnh báo dự báo nổ kịp lúc',
            ),
            B(
              'A forecast is an extrapolation from the trend so far, so a spike concentrated in a few hours can finish before the projection moves — pair the forecast threshold with an <em>actual</em>-spend threshold that fires the moment the ceiling is crossed, and add a rate alarm on operations per minute for anything that has to be caught while it is still running',
              'Một dự báo là phép ngoại suy từ xu hướng tính tới lúc đó, nên một cú bùng phát dồn trong vài giờ có thể kết thúc trước khi con số dự phóng nhúc nhích — hãy ghép ngưỡng dự báo với một ngưỡng theo chi tiêu THẬT, thứ nổ ngay khoảnh khắc cái trần bị vượt, và thêm một cảnh báo tốc độ theo số thao tác mỗi phút cho bất cứ thứ gì cần bắt được lúc còn đang chạy',
            ),
            B(
              'Forecast alerts are evaluated only on the provider\'s monthly billing boundary, so an incident inside the month can never trigger one; switching the same alert from forecast to actual moves the evaluation to daily and is the whole fix',
              'Cảnh báo dự báo chỉ được đánh giá ở ranh giới tính tiền theo tháng của nhà cung cấp, nên một sự cố nằm trong tháng thì không bao giờ kích hoạt được nó; chuyển chính cảnh báo đó từ dự báo sang thật là đưa việc đánh giá về hằng ngày và đó là toàn bộ cách chữa',
            ),
            B(
              'The alert fired correctly but was suppressed by the provider\'s weekend quiet-hours policy, which batches non-critical notifications until the next business day; marking the alert as critical delivers it immediately',
              'Cảnh báo đã nổ đúng nhưng bị chính sách giờ yên lặng cuối tuần của nhà cung cấp chặn lại, thứ gom các thông báo không khẩn cấp lại tới ngày làm việc kế tiếp; đánh dấu cảnh báo là khẩn cấp sẽ gửi nó đi ngay',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A forecast is a model, and models lag. It projects the month\'s total from the trend observed so far, which works well for a gradual drift and works badly for exactly the case you most want to catch: a burst that starts and finishes inside a few hours. By the time enough hours have elapsed for the projection to move, the script has stopped and the money is gone. The fix is not a better forecast but a second, dumber signal: an <b>actual</b>-spend threshold, which fires the moment accrued cost crosses a number and cannot be argued with. Keep the forecast alarm too — it is genuinely useful for the slow version, where spend creeps up over three weeks and you want warning before month end — but never rely on it alone. And for anything you want to interrupt rather than merely learn about, neither is fast enough: that is what the per-minute rate alarm on Class A operations is for, since it fires within the first quarter hour of a runaway. Three signals, three latencies: minutes, hours, days. Option 1 identifies a real tuning issue and it is worth fixing, but a threshold at 1.5× the baseline would still have been reached only after the extrapolation caught up, so the timing problem survives. Option 3 invents a monthly-only evaluation; forecasts are recomputed continuously, they are just slow to react to a spike. Option 4 invents a quiet-hours policy that no billing system applies to spend alerts.',
            'Một dự báo là một mô hình, mà mô hình thì trễ. Nó chiếu tổng chi của tháng từ xu hướng quan sát được tính tới lúc đó, và nó hoạt động tốt với một sự trôi dần còn hoạt động tệ với đúng cái trường hợp bạn muốn bắt nhất: một cú bùng phát bắt đầu và kết thúc trong vài giờ. Tới lúc đủ số giờ trôi qua để con số dự phóng nhúc nhích thì script đã dừng và tiền đã đi. Cách chữa không phải một dự báo tốt hơn mà là một tín hiệu thứ hai, ngu hơn: một ngưỡng theo chi tiêu <b>THẬT</b>, thứ nổ ngay khoảnh khắc chi phí phát sinh vượt qua một con số và chẳng có gì để mà tranh luận. Cứ giữ cả cảnh báo dự báo — nó thật sự hữu ích với phiên bản chậm, khi chi tiêu bò lên trong ba tuần và bạn muốn được cảnh báo trước khi hết tháng — nhưng đừng bao giờ chỉ dựa vào nó. Còn với bất cứ thứ gì bạn muốn NGẮT chứ không chỉ muốn biết thì cả hai đều không đủ nhanh: đó mới là việc của cảnh báo tốc độ theo phút trên các thao tác Class A, vì nó nổ trong mười lăm phút đầu của một cú chạy trốn. Ba tín hiệu, ba độ trễ: phút, giờ, ngày. Phương án 1 chỉ ra một vấn đề tinh chỉnh có thật và đáng sửa, nhưng một ngưỡng ở mức 1,5 lần mức nền thì vẫn chỉ chạm tới sau khi phép ngoại suy kịp bắt nhịp, nên bài toán thời điểm vẫn còn nguyên. Phương án 3 bịa ra việc chỉ đánh giá theo tháng; các dự báo được tính lại liên tục, chỉ là chúng phản ứng chậm với một cú tăng vọt. Phương án 4 bịa ra một chính sách giờ yên lặng mà không hệ thống tính tiền nào áp cho cảnh báo chi tiêu.',
          ),
        }),

        /* ── Chương 8 — migration S3 → R2 (5 câu) ──────────────────────── */

        // q41 · đáp án 2
        mcq({
          prompt: B(
            'A managed one-shot copier finishes on Monday: "4,132,881 objects copied, 0 errors". On Tuesday users upload 300 new photos through the app, which still writes to S3. On Wednesday the team flips reads to R2 and 300 images 404. Why?',
            'Một bộ sao chép một-lượt do nhà cung cấp vận hành xong việc vào thứ Hai: "4.132.881 object đã copy, 0 lỗi". Thứ Ba người dùng tải lên 300 tấm ảnh mới qua ứng dụng, thứ vẫn đang ghi vào S3. Thứ Tư đội chuyển các lượt đọc sang R2 và 300 tấm ảnh trả 404. Vì sao?',
          ),
          options: [
            B(
              'The copier skipped them deliberately: objects newer than 24 hours are excluded to avoid copying a file that is still uploading, and a second run after the exclusion window closes picks them up',
              'Bộ sao chép cố ý bỏ qua chúng: các object mới hơn 24 giờ bị loại trừ để tránh copy một file còn đang tải lên, và một lượt chạy thứ hai sau khi cửa sổ loại trừ đóng lại sẽ nhặt chúng về',
            ),
            B(
              'The copier reported success on objects it could enumerate but not read, so the 300 are present as zero-byte placeholders in R2 rather than absent; a re-run with "overwrite always" repairs them',
              'Bộ sao chép báo thành công với những object nó liệt kê được nhưng đọc không được, nên 300 cái đó CÓ mặt trong R2 dưới dạng bản giữ chỗ 0 byte chứ không phải vắng mặt; một lượt chạy lại với "luôn ghi đè" sẽ sửa chúng',
            ),
            B(
              'The copy is a point-in-time snapshot: the tool enumerated the source once, at the moment it started, and anything written after that instant was never in its work list — a one-shot copier cannot see the future, so it has to be paired with a dual-write during the migration or followed by another run',
              'Lượt copy là một ảnh chụp tại một thời điểm: công cụ liệt kê nguồn ĐÚNG MỘT LẦN, vào lúc nó bắt đầu, và bất cứ thứ gì ghi sau khoảnh khắc đó thì chưa bao giờ nằm trong danh sách việc của nó — một bộ sao chép một-lượt không nhìn thấy tương lai, nên nó phải được ghép với một lượt ghi-đôi trong suốt quá trình migrate, hoặc phải có thêm một lượt chạy nữa theo sau',
            ),
            B(
              'The flip happened before the destination became consistent: a bucket that has just received four million writes serves stale listings for a period, and the objects appear once the index catches up',
              'Lượt chuyển diễn ra trước khi phía đích trở nên nhất quán: một bucket vừa nhận bốn triệu lượt ghi thì phục vụ các lượt liệt kê cũ trong một khoảng thời gian, và các object sẽ hiện ra khi chỉ mục bắt kịp',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The tool did exactly what it promised and the plan asked for something else. A one-shot copier begins by listing the source, and that listing <em>is</em> its definition of the job — a fixed set of keys, decided at the instant it started. Objects written afterwards are not "missed"; they were never candidates. So "0 errors" is a true statement about a set that no longer describes the source bucket, and the gap grows for as long as the application keeps writing to S3. There are two ways to close it, and the choice is about downtime. Freeze writes for the duration and run once — simple, and usually unacceptable. Or run a <b>dual-write</b> during the migration: the app writes every new object to both buckets (S3 primary, R2 best-effort), so the copier handles history while the app handles the present, and the two meet. A read-fallback then covers the seam — read R2 first, fall back to S3 on a miss, and copy the object across opportunistically so the working set migrates itself through ordinary traffic. The discipline worth carrying is smaller and more general: <b>write down the timestamp when the copy starts</b>, because everything after it is your responsibility, not the tool\'s. Option 1 invents an exclusion window; the tool copies what it listed, and a 24-hour rule would leave the same gap anyway. Option 2 invents zero-byte placeholders — the objects are absent, which is why the reads 404. Option 4 invents an eventual-consistency delay measured in days; R2 is strongly consistent, and a day-old write is not a consistency question.',
            'Công cụ đã làm đúng thứ nó hứa và kế hoạch thì đòi một thứ khác. Một bộ sao chép một-lượt bắt đầu bằng việc liệt kê nguồn, và cái lượt liệt kê đó CHÍNH LÀ định nghĩa công việc của nó — một tập key cố định, chốt ở khoảnh khắc nó khởi động. Những object ghi sau đó không phải bị "bỏ sót"; chúng chưa bao giờ là ứng viên. Vậy nên "0 lỗi" là một phát biểu ĐÚNG về một tập không còn mô tả cái bucket nguồn nữa, và khoảng hở cứ lớn dần chừng nào ứng dụng còn ghi vào S3. Có hai cách khép nó lại, và lựa chọn là chuyện downtime. Đóng băng các lượt ghi trong suốt thời gian đó rồi chạy một lần — đơn giản, và thường là không chấp nhận được. Hoặc chạy một lượt <b>ghi-đôi</b> trong suốt quá trình migrate: ứng dụng ghi mọi object mới vào cả hai bucket (S3 là chính, R2 là cố-gắng-hết-sức), nhờ đó bộ sao chép lo phần quá khứ còn ứng dụng lo phần hiện tại, và hai bên gặp nhau. Một lượt đọc-có-phương-án-lùi khi đó che được đường nối — đọc R2 trước, hụt thì lùi về S3, rồi tiện thể copy object sang, nhờ vậy tập dữ liệu nóng tự migrate qua chính lưu lượng bình thường. Kỷ luật đáng mang theo thì nhỏ hơn và tổng quát hơn: <b>hãy ghi lại dấu thời gian lúc lượt copy bắt đầu</b>, vì mọi thứ sau nó là trách nhiệm của bạn chứ không phải của công cụ. Phương án 1 bịa ra một cửa sổ loại trừ; công cụ copy thứ nó đã liệt kê, mà một quy tắc 24 giờ thì dù sao cũng để lại đúng cái khoảng hở ấy. Phương án 2 bịa ra các bản giữ chỗ 0 byte — các object VẮNG MẶT, và đó là lý do các lượt đọc trả 404. Phương án 4 bịa ra một độ trễ nhất quán rốt cuộc tính bằng ngày; R2 nhất quán mạnh, và một lượt ghi từ hôm trước không phải một câu chuyện nhất quán.',
          ),
        }),

        // q42 · đáp án 3
        mcq({
          prompt: B(
            'The dual-write during a migration is implemented like this:' +
            code("export async function put(key, body, contentType) {\n" +
              '  await Promise.all([\n' +
              '    s3.send(new PutObjectCommand({ Bucket: S3B, Key: key, Body: body, ContentType: contentType })),\n' +
              '    r2.send(new PutObjectCommand({ Bucket: R2B, Key: key, Body: body, ContentType: contentType })),\n' +
              '  ]);\n' +
              '}') +
            'What is the problem, and what is the correct shape?',

            'Lượt ghi-đôi trong một cuộc migration được cài đặt như sau:' +
            code("export async function put(key, body, contentType) {\n" +
              '  await Promise.all([\n' +
              '    s3.send(new PutObjectCommand({ Bucket: S3B, Key: key, Body: body, ContentType: contentType })),\n' +
              '    r2.send(new PutObjectCommand({ Bucket: R2B, Key: key, Body: body, ContentType: contentType })),\n' +
              '  ]);\n' +
              '}') +
            'Vấn đề là gì, và hình dạng đúng là gì?',
          ),
          options: [
            B(
              'It writes the two copies concurrently, so an interleaved overwrite can leave the buckets holding different versions; serialising the two writes with <code>await</code> one after the other removes the race and is the correct shape',
              'Nó ghi hai bản song song, nên một lượt ghi đè xen kẽ có thể để hai bucket giữ hai phiên bản khác nhau; tuần tự hoá hai lượt ghi bằng <code>await</code> lần lượt là gỡ được cuộc đua và đó là hình dạng đúng',
            ),
            B(
              'It doubles write latency because the caller waits for the slower of the two; wrapping the R2 write in a queue and returning as soon as it is enqueued keeps latency flat while preserving the guarantee that both writes happen',
              'Nó nhân đôi độ trễ ghi vì bên gọi phải chờ cái chậm hơn trong hai cái; bọc lượt ghi R2 vào một hàng đợi rồi trả về ngay khi nó được xếp hàng sẽ giữ độ trễ phẳng mà vẫn bảo toàn bảo đảm rằng cả hai lượt ghi đều xảy ra',
            ),
            B(
              'It sends the same <code>body</code> buffer to two clients, and once one of them has consumed it the other writes an empty object; the fix is to clone the buffer per destination',
              'Nó gửi cùng một bộ đệm <code>body</code> cho hai client, và khi một trong hai đã tiêu thụ nó thì cái kia ghi ra một object rỗng; cách chữa là nhân bản bộ đệm cho từng đích',
            ),
            B(
              '<code>Promise.all</code> rejects as soon as either write fails, so a brief outage on the destination bucket turns every upload in the app into a 500 — the secondary write must be fire-and-forget with a warning log (<code>await cmd(s3); cmd(r2).catch(warn)</code>), so its failure is invisible to users, and a reconciliation job catches the drift afterwards',
              '<code>Promise.all</code> từ chối ngay khi một trong hai lượt ghi hỏng, nên một sự cố ngắn ở bucket đích biến MỌI lượt tải lên trong ứng dụng thành 500 — lượt ghi phụ phải là kiểu bắn-rồi-quên kèm một dòng log cảnh báo (<code>await cmd(s3); cmd(r2).catch(warn)</code>), để cú hỏng của nó vô hình với người dùng, và một job đối soát sẽ nhặt chỗ lệch về sau',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A dual-write has an asymmetry that this code erases. One bucket is <b>primary</b>: it holds the truth, the application reads from it, and if the write there fails the request genuinely failed. The other is <b>secondary</b>: a rehearsal for a system you have not cut over to yet, whose contents nobody is serving. <code>Promise.all</code> treats them as equals and rejects on the first failure, which means a five-minute blip on a bucket you are not even reading from takes down every upload in the app — you have made your availability the product of two services in order to prepare for using one of them. The correct shape awaits the primary and lets the secondary fail quietly with a log line, and it accepts the consequence honestly: the two buckets will drift, a small fraction of writes will land on one side only, and that is what the reconciliation pass before the cutover exists to find. Note also the ordering hazard the option does not have to mention: because the secondary write is asynchronous, two rapid overwrites of the same key can complete out of order on R2, so "no errors in the log" is not proof the buckets agree — only comparing them is. Option 1 identifies that real ordering race but prescribes serialising, which makes latency worse and still leaves <code>Promise.all</code>-style coupling of the failure. Option 2 is the strongest distractor: a queue is a legitimate production design, but a durable one is a whole component to build and an in-memory one loses writes on restart, so it is a heavier answer than the problem needs. Option 3 invents a consumed-buffer bug; a <code>Buffer</code> is not a stream and can be sent twice.',
            'Một lượt ghi-đôi có một sự bất đối xứng mà đoạn mã này xoá mất. Một bucket là <b>chính</b>: nó giữ sự thật, ứng dụng đọc từ nó, và nếu lượt ghi ở đó hỏng thì request thật sự đã hỏng. Cái kia là <b>phụ</b>: một buổi tổng duyệt cho một hệ thống bạn còn chưa chuyển sang, mà nội dung của nó thì chẳng ai đang phục vụ. <code>Promise.all</code> đối xử với chúng như nhau và từ chối ngay ở cú hỏng đầu tiên, nghĩa là một cú trục trặc năm phút trên một bucket bạn thậm chí còn không đọc lại hạ gục mọi lượt tải lên trong ứng dụng — bạn vừa biến độ khả dụng của mình thành TÍCH của hai dịch vụ, chỉ để chuẩn bị cho việc dùng một trong hai. Hình dạng đúng là await cái chính rồi để cái phụ hỏng lặng lẽ kèm một dòng log, và nó chấp nhận hệ quả một cách trung thực: hai bucket SẼ lệch nhau, một phần nhỏ các lượt ghi sẽ chỉ rơi xuống một phía, và đó chính là thứ mà lượt đối soát trước khi chuyển đổi sinh ra để tìm. Cũng để ý mối nguy về thứ tự mà phương án không cần nhắc tới: vì lượt ghi phụ là bất đồng bộ, hai lượt ghi đè liên tiếp lên cùng một key có thể hoàn tất SAI THỨ TỰ trên R2, nên "không có lỗi nào trong log" không phải bằng chứng rằng hai bucket khớp nhau — chỉ có việc SO chúng mới là bằng chứng. Phương án 1 chỉ ra đúng cuộc đua thứ tự có thật đó nhưng lại kê đơn tuần tự hoá, thứ làm độ trễ tệ hơn mà vẫn để nguyên kiểu buộc-chặt-cú-hỏng của <code>Promise.all</code>. Phương án 2 là phương án nhiễu mạnh nhất: một hàng đợi là thiết kế production chính đáng, nhưng một hàng đợi bền là cả một thành phần phải xây còn một hàng đợi trong bộ nhớ thì mất lượt ghi khi khởi động lại, nên nó là một câu trả lời nặng hơn mức bài toán cần. Phương án 3 bịa ra lỗi bộ đệm bị tiêu thụ; một <code>Buffer</code> không phải một luồng và gửi hai lần được.',
          ),
        }),

        // q43 · đáp án 0
        mcq({
          prompt: B(
            'During the middle phase of a cutover, reads try the new bucket first and fall back to the old one:' +
            code("try {\n" +
              '  return await readFrom(r2, key);\n' +
              '} catch (err) {\n' +
              "  if (err.name !== 'NoSuchKey') throw err;\n" +
              "  metrics.increment('storage.r2_miss');\n" +
              '  const body = await readFrom(s3, key);\n' +
              '  r2.send(new PutObjectCommand({ Bucket: R2B, Key: key, Body: body }))\n' +
              "     .catch(e => console.warn('backfill failed', key, e.message));\n" +
              '  return body;\n' +
              '}') +
            'The <code>r2_miss</code> rate is 0.2% in the first hour, 0.02% after a day, and 0.005% after a week. What is this pattern telling you, and what is the write inside the catch block for?',

            'Trong giai đoạn giữa của một cuộc chuyển đổi, các lượt đọc thử bucket mới trước rồi mới lùi về bucket cũ:' +
            code("try {\n" +
              '  return await readFrom(r2, key);\n' +
              '} catch (err) {\n' +
              "  if (err.name !== 'NoSuchKey') throw err;\n" +
              "  metrics.increment('storage.r2_miss');\n" +
              '  const body = await readFrom(s3, key);\n' +
              '  r2.send(new PutObjectCommand({ Bucket: R2B, Key: key, Body: body }))\n' +
              "     .catch(e => console.warn('backfill failed', key, e.message));\n" +
              '  return body;\n' +
              '}') +
            'Tỷ lệ <code>r2_miss</code> là 0,2% trong giờ đầu, 0,02% sau một ngày, và 0,005% sau một tuần. Mẫu hình này nói gì với bạn, và cái lượt ghi bên trong khối catch để làm gì?',
          ),
          options: [
            B(
              'The write copies the object across on the way past, so every miss repairs itself and the hot working set migrates through ordinary user traffic — which is exactly why the rate decays; the metric is therefore the go/no-go signal for dropping the fallback, and you move to the final phase once it is stable at a very low level for a couple of days',
              'Lượt ghi đó copy object sang trên đường đi qua, nên mỗi lượt hụt tự sửa lấy mình và tập dữ liệu nóng tự migrate qua chính lưu lượng người dùng bình thường — và đó chính xác là lý do tỷ lệ suy giảm; vì thế cái chỉ số này là tín hiệu đi-hay-không-đi cho việc bỏ phương án lùi, và bạn chuyển sang giai đoạn cuối khi nó ổn định ở mức rất thấp trong vài ngày',
            ),
            B(
              'The write is a cache warm-up and the decay comes from the copier catching up in the background; the metric measures the copier\'s progress rather than anything about the fallback, so it should be read against the tool\'s own progress dashboard',
              'Lượt ghi đó là một lượt hâm nóng bộ đệm còn sự suy giảm đến từ việc bộ sao chép đang bắt kịp ở nền; chỉ số này đo tiến độ của bộ sao chép chứ không đo gì về phương án lùi, nên nên đọc nó đối chiếu với chính bảng tiến độ của công cụ',
            ),
            B(
              'The decay shows the fallback path is being exercised less because users are re-uploading the affected files; the write inside the catch is a defensive duplicate that should be removed, since it can overwrite a newer version that already reached the new bucket',
              'Sự suy giảm cho thấy đường lùi ít được dùng đi vì người dùng đang tải lại các file bị ảnh hưởng; lượt ghi trong khối catch là một bản trùng phòng thủ nên gỡ đi, vì nó có thể ghi đè lên một phiên bản mới hơn vốn đã tới bucket mới',
            ),
            B(
              'The pattern indicates the metric is wrong: a correctly migrated bucket gives zero misses, so a rate that merely decays means the counter is also incremented on unrelated errors and the <code>err.name</code> guard is not narrow enough',
              'Mẫu hình này cho thấy chỉ số bị sai: một bucket đã migrate đúng thì cho ra không lượt hụt nào, nên một tỷ lệ chỉ suy giảm nghĩa là bộ đếm còn tăng cả với những lỗi chẳng liên quan và cái chốt <code>err.name</code> chưa đủ hẹp',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The write inside the catch is the clever part of the pattern, and it changes the metric\'s meaning. On a miss the handler has just fetched the bytes from the old bucket anyway, so copying them into the new one costs one extra write and permanently removes that key from the miss set. The consequence is that user traffic performs the migration: the objects people actually read get copied first, in popularity order, for free. That is why the rate decays instead of sitting flat — 0.2% in the first hour is the seam plus a race, 0.02% after a day is the long tail, and 0.005% after a week is cold objects nobody has opened since the copy. It also makes the metric the decision instrument for the whole cutover: when misses are rare and stable, the new bucket demonstrably holds everything anyone reads, and the fallback can be removed. Do not expect zero — a bucket with millions of cold objects will always have some — so the rule is "stable and small for 48 hours", not "none". Note the narrow catch as well: only <code>NoSuchKey</code> triggers a fallback, so a permission failure or a network error still surfaces instead of being silently papered over by a read from the old system. Option 2 gets the causality backwards; the copier finished before this phase began. Option 3 raises a real ordering concern in general but misreads this code, where the backfill writes exactly the bytes it just read for a key the new bucket did not have. Option 4 demands an unrealistic zero and misdiagnoses a healthy decay curve as instrumentation error.',
            'Lượt ghi bên trong khối catch mới là phần khôn ngoan của cái mẫu này, và nó làm thay đổi luôn ý nghĩa của chỉ số. Khi hụt, bộ xử lý dù sao cũng vừa lấy các byte từ bucket cũ về rồi, nên copy chúng sang bucket mới chỉ tốn thêm một lượt ghi và loại vĩnh viễn cái key đó khỏi tập hụt. Hệ quả là chính LƯU LƯỢNG NGƯỜI DÙNG thực hiện cuộc migration: những object mà người ta thật sự đọc thì được copy trước, theo thứ tự phổ biến, miễn phí. Đó là lý do tỷ lệ SUY GIẢM chứ không nằm phẳng — 0,2% trong giờ đầu là đường nối cộng một cuộc đua, 0,02% sau một ngày là cái đuôi dài, và 0,005% sau một tuần là những object nguội mà chưa ai mở kể từ lượt copy. Nó cũng biến chỉ số này thành công cụ ra quyết định cho cả cuộc chuyển đổi: khi các lượt hụt vừa hiếm vừa ổn định thì bucket mới chứng minh được là nó đang giữ mọi thứ mà bất kỳ ai đọc tới, và phương án lùi có thể gỡ đi. Đừng mong con số không — một bucket với hàng triệu object nguội thì luôn có một ít — nên quy tắc là "ổn định và nhỏ trong 48 giờ", không phải "không có cái nào". Cũng để ý cái khối catch hẹp: chỉ <code>NoSuchKey</code> mới kích hoạt lượt lùi, nên một cú hỏng về quyền hay một lỗi mạng vẫn lộ ra chứ không bị một lượt đọc từ hệ thống cũ âm thầm dán đè lên. Phương án 2 nói ngược quan hệ nhân quả; bộ sao chép đã xong trước khi giai đoạn này bắt đầu. Phương án 3 nêu một lo ngại về thứ tự có thật ở mức tổng quát nhưng đọc sai đoạn mã này, nơi lượt nạp bù ghi đúng những byte nó vừa đọc, cho một key mà bucket mới không hề có. Phương án 4 đòi một con số không phi thực tế và chẩn nhầm một đường cong suy giảm khoẻ mạnh thành lỗi đo đạc.',
          ),
        }),

        // q44 · đáp án 1
        mcq({
          prompt: B(
            'A verification script compares <code>HeadObject</code> ETags on both sides of a migration for all 4.1 million keys and reports:' +
            code('MP-DIFF   1,834   # mot ben co hau to "-N", ben kia khong\n' +
              'MISSING     412   # dich khong co key nay\n' +
              'ETAG        171   # ca hai deu don-phan, ETag khac nhau') +
            'For context, a measured multipart ETag looks like <code>"f65590340fd7a9f7c0643548071050c7-2"</code> and was reproduced by hand as <code>md5(md5_bin(part1) ++ md5_bin(part2))</code> with the part count appended. How should each category be treated?',

            'Một script kiểm chứng so ETag qua <code>HeadObject</code> ở cả hai phía của một cuộc migration cho toàn bộ 4,1 triệu key và báo:' +
            code('MP-DIFF   1.834   # mot ben co hau to "-N", ben kia khong\n' +
              'MISSING     412   # dich khong co key nay\n' +
              'ETAG        171   # ca hai deu don-phan, ETag khac nhau') +
            'Để có bối cảnh, một ETag multipart đo được trông như <code>"f65590340fd7a9f7c0643548071050c7-2"</code> và đã được dựng lại bằng tay bằng <code>md5(md5_bin(part1) ++ md5_bin(part2))</code> rồi nối số phần vào. Nên xử lý từng nhóm thế nào?',
          ),
          options: [
            B(
              'All 2,417 are defects of the same kind — the destination differs from the source — so the only safe action is to re-copy every listed key with "overwrite always" and re-run the comparison until it reports zero',
              'Cả 2.417 cái đều là khiếm khuyết cùng loại — phía đích khác phía nguồn — nên hành động an toàn duy nhất là copy lại mọi key được liệt kê với chế độ "luôn ghi đè" rồi chạy lại phép so cho tới khi nó báo không còn cái nào',
            ),
            B(
              'MP-DIFF is expected and not a defect: an ETag computed from part hashes cannot equal a single-part MD5 of the same bytes, so the two sides can be byte-identical and still differ here — check those with a size comparison or a byte-hash sample. MISSING and ETAG are real and need re-copying',
              'MP-DIFF là chuyện dự đoán được và không phải khiếm khuyết: một ETag tính từ các băm-từng-phần thì không thể bằng một MD5 đơn-phần của cùng khối byte, nên hai phía hoàn toàn có thể giống hệt nhau từng byte mà vẫn khác nhau ở đây — hãy kiểm chúng bằng phép so kích thước hoặc một mẫu băm theo byte. MISSING và ETAG là thật và cần copy lại',
            ),
            B(
              'MP-DIFF and ETAG are both benign because ETag comparison is only meaningful within one provider; MISSING is the only real category, and it is fixed by re-running the copier with "skip if exists"',
              'MP-DIFF và ETAG đều lành tính vì phép so ETag chỉ có ý nghĩa trong phạm vi một nhà cung cấp; MISSING là nhóm thật duy nhất, và nó được sửa bằng cách chạy lại bộ sao chép với chế độ "bỏ qua nếu đã có"',
            ),
            B(
              'MP-DIFF is the serious category because a suffix mismatch means the destination stored the object without its parts, so those 1,834 objects are truncated; MISSING and ETAG are transient and resolve when the destination finishes indexing',
              'MP-DIFF mới là nhóm nghiêm trọng vì hậu tố lệch nhau nghĩa là phía đích đã lưu object mà không có các phần của nó, nên 1.834 object đó bị cắt cụt; MISSING và ETAG chỉ là nhất thời và sẽ tự hết khi phía đích đánh chỉ mục xong',
            ),
          ],
          correct: 1,
          explanation: EX(
            'ETag comparison is the cheapest verification available — headers only, no bytes transferred, a few dollars for four million keys — but it is only sound where both sides used the same algorithm, and that is what MP-DIFF flags. A single-part upload yields the MD5 of the body. A multipart upload yields <code>md5(concatenated part MD5s)</code> plus <code>-N</code>, a value that depends on how the object was split; the measurement confirms it, and it also implies the same bytes uploaded with different part sizes produce different ETags. So when a copier re-assembles a multipart source as a single-part object at the destination, the ETags legitimately differ while the content is identical. Treat that category as "not comparable by this method" and settle it another way — compare <code>ContentLength</code>, or byte-hash a stratified sample. The other two are genuine: <b>MISSING</b> means the destination has no such key, and <b>ETAG</b> means both sides are single-part with different content, which usually indicates the source object was rewritten after the copy snapshot. Both need an individual re-copy. The broader point of the whole exercise is that the migration tool\'s own report ("0 errors") describes what the tool believes it did; an independent program reading the destination and comparing it to the source is the only thing that can find a failure the tool was structurally unable to notice. Option 1 wastes effort on 1,834 non-defects and, worse, teaches the team to distrust a clean verification. Option 3 dismisses ETAG, the category most likely to indicate genuinely wrong content. Option 4 inverts the severity entirely and invents an indexing delay.',
            'So ETag là phép kiểm chứng rẻ nhất hiện có — chỉ header, không chuyển byte nào, vài đô cho bốn triệu key — nhưng nó chỉ vững ở chỗ cả hai phía dùng CÙNG một thuật toán, và đó chính là thứ MP-DIFF gắn cờ. Một lượt tải lên đơn-phần cho ra MD5 của phần thân. Một lượt multipart cho ra <code>md5(các MD5 từng phần nối lại)</code> cộng <code>-N</code>, một giá trị phụ thuộc vào cách object bị chia; phép đo xác nhận điều đó, và nó cũng kéo theo rằng cùng khối byte tải lên với kích thước phần khác nhau sẽ ra ETag khác nhau. Vậy nên khi một bộ sao chép ghép lại một nguồn multipart thành một object đơn-phần ở phía đích thì hai ETag khác nhau một cách CHÍNH ĐÁNG trong khi nội dung y hệt. Hãy coi nhóm đó là "không so được bằng cách này" rồi giải quyết bằng cách khác — so <code>ContentLength</code>, hoặc băm theo byte một mẫu phân tầng. Hai nhóm còn lại là thật: <b>MISSING</b> nghĩa là phía đích không có key đó, còn <b>ETAG</b> nghĩa là cả hai phía đều đơn-phần mà nội dung khác nhau, thường là dấu hiệu object nguồn đã bị ghi lại SAU ảnh chụp của lượt copy. Cả hai đều cần copy lại từng cái. Ý lớn hơn của cả bài tập này là: bản báo cáo của chính công cụ migration ("0 lỗi") mô tả thứ mà công cụ TIN rằng nó đã làm; một chương trình độc lập đọc phía đích rồi so với phía nguồn mới là thứ duy nhất tìm được một cú hỏng mà công cụ, về mặt cấu trúc, không có khả năng nhận ra. Phương án 1 lãng phí công vào 1.834 thứ không phải khiếm khuyết và, tệ hơn, dạy cho đội thói không tin một lượt kiểm chứng sạch. Phương án 3 gạt bỏ ETAG, đúng cái nhóm nhiều khả năng chỉ ra nội dung sai thật. Phương án 4 đảo ngược hoàn toàn mức nghiêm trọng và bịa ra một độ trễ đánh chỉ mục.',
          ),
        }),

        // q45 · đáp án 2
        mcq({
          prompt: B(
            'A team wants to delete the source bucket the day after the copier reports "4,132,881 objects copied, 0 errors". Which argument for waiting is the strongest?',
            'Một đội muốn xoá bucket nguồn ngay hôm sau khi bộ sao chép báo "4.132.881 object đã copy, 0 lỗi". Lý lẽ nào để chờ thêm là mạnh nhất?',
          ),
          options: [
            B(
              'Deleting four million objects is itself a large billed operation, so it is cheaper to let a lifecycle rule expire the source bucket gradually than to issue the deletes directly',
              'Xoá bốn triệu object bản thân nó đã là một thao tác lớn bị tính tiền, nên để một lifecycle rule cho bucket nguồn hết hạn dần thì rẻ hơn là phát các lệnh xoá trực tiếp',
            ),
            B(
              'The destination has not been read under production load yet, and a bucket only reveals its real latency profile after a week of traffic; keeping the source lets you flip back if the new bucket turns out to be slower',
              'Phía đích chưa được đọc dưới tải production, và một bucket chỉ bộc lộ hồ sơ độ trễ thật của nó sau một tuần lưu lượng; giữ lại nguồn cho bạn quay về được nếu bucket mới hoá ra chậm hơn',
            ),
            B(
              'The tool can only report on what it enumerated and on requests that returned 200 — it cannot report a key it never listed, an object written with zero bytes, or one stored with the wrong content type, all of which look like success — so an independent verification has to run against the destination first, and the source is the only copy that can repair what that verification finds',
              'Công cụ chỉ báo cáo được về những gì nó đã liệt kê và những request trả về 200 — nó không báo cáo nổi một key nó chưa bao giờ liệt kê, một object ghi ra 0 byte, hay một object lưu sai kiểu nội dung, mà cả ba thứ đó đều TRÔNG như thành công — nên phải chạy một lượt kiểm chứng độc lập lên phía đích trước đã, và nguồn là bản sao duy nhất sửa được thứ mà lượt kiểm chứng ấy tìm ra',
            ),
            B(
              'Object counts are not comparable across providers because the destination stores multipart objects as several entries, so the reported total will not match a listing of the new bucket until the parts are consolidated',
              'Số lượng object không so được giữa hai nhà cung cấp vì phía đích lưu các object multipart thành nhiều mục, nên tổng số được báo sẽ không khớp với một lượt liệt kê bucket mới cho tới khi các phần được hợp nhất',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A success report is a statement about the requests a tool issued, not about the state of the destination. The gap between those two is where every migration failure lives, and it has a specific shape: the tool cannot report a key it never enumerated, because a paginated listing that ended early leaves no trace; it cannot report an object that was written with zero bytes, because that write returned 200; it cannot report an object stored with the wrong content type, because that also returned 200. Every one of those is a success from inside the tool and a defect from outside it. Only an independent program — reading the destination, comparing against the source, and reporting on what it finds rather than on what it did — can see them, and the ETag scan plus a stratified byte-hash sample is the cheap version of exactly that. This is why the source bucket has to outlive the verification and not the copy: once it is gone, every defect the verification would have found becomes permanent data loss, and there is nothing left to re-copy from. A reasonable policy keeps the source read-only for thirty to ninety days after the cutover. Option 1 is true arithmetic about deletion cost but a weak reason — deletes are cheap or free, and cost is not what is at stake. Option 2 names a genuine benefit of a rollback path, and keeping the source does give you one, but latency is measurable in a day and is not the risk that makes deletion irreversible. Option 4 invents a storage model; a completed multipart upload is one object with one key on either side.',
            'Một báo cáo thành công là phát biểu về những REQUEST mà công cụ đã phát ra, không phải về TRẠNG THÁI của phía đích. Khoảng hở giữa hai thứ đó là nơi mọi cú hỏng migration cư trú, và nó có một hình dạng cụ thể: công cụ không báo cáo nổi một key nó chưa bao giờ liệt kê, vì một lượt liệt kê phân trang kết thúc sớm chẳng để lại dấu vết nào; nó không báo cáo nổi một object đã ghi ra 0 byte, vì lượt ghi đó trả về 200; nó không báo cáo nổi một object lưu sai kiểu nội dung, vì cái đó cũng trả về 200. Mỗi thứ trong số ấy đều là thành công khi nhìn từ BÊN TRONG công cụ và là khiếm khuyết khi nhìn từ BÊN NGOÀI. Chỉ một chương trình độc lập — đọc phía đích, so với phía nguồn, và báo cáo về thứ nó TÌM THẤY chứ không phải về thứ nó ĐÃ LÀM — mới nhìn ra chúng, và lượt quét ETag cộng một mẫu băm theo byte phân tầng chính là phiên bản rẻ tiền của đúng việc đó. Đây là lý do bucket nguồn phải sống lâu hơn LƯỢT KIỂM CHỨNG chứ không phải lâu hơn LƯỢT COPY: một khi nó đi rồi thì mọi khiếm khuyết mà lượt kiểm chứng lẽ ra sẽ tìm ra đều trở thành mất dữ liệu vĩnh viễn, và chẳng còn gì để copy lại từ đó. Một chính sách hợp lý giữ nguồn ở chế độ chỉ-đọc trong ba mươi tới chín mươi ngày sau khi chuyển đổi. Phương án 1 đúng về số học chi phí xoá nhưng là một lý lẽ yếu — các lượt xoá thì rẻ hoặc miễn phí, và chi phí không phải thứ đang bị đe doạ. Phương án 2 gọi tên một lợi ích có thật của một đường quay lui, và giữ nguồn ĐÚNG LÀ cho bạn một đường như thế, nhưng độ trễ thì đo được trong một ngày và không phải cái rủi ro khiến việc xoá trở nên không đảo ngược được. Phương án 4 bịa ra một mô hình lưu trữ; một lượt multipart đã hoàn tất là MỘT object với MỘT key ở cả hai phía.',
          ),
        }),

        /* ── Chương 9 — sách công thức chẩn đoán (4 câu) ───────────────── */

        // q46 · đáp án 3
        mcq({
          prompt: B(
            'Downloads of a paid PDF fail for some users. The measured response body:' +
            code('HTTP 403\n' +
              '<?xml version="1.0" encoding="UTF-8"?>\n' +
              '<Error><Code>AccessDenied</Code><Message>Request has expired</Message>\n' +
              '<Key>mp/big.bin</Key><BucketName>de-thi</BucketName>…</Error>') +
            'Which layer of the 403 flowchart is this, and what is the fix?',

            'Các lượt tải một file PDF trả phí hỏng với một số người dùng. Thân phản hồi đo được:' +
            code('HTTP 403\n' +
              '<?xml version="1.0" encoding="UTF-8"?>\n' +
              '<Error><Code>AccessDenied</Code><Message>Request has expired</Message>\n' +
              '<Key>mp/big.bin</Key><BucketName>de-thi</BucketName>…</Error>') +
            'Đây là lớp nào trong cây chẩn đoán 403, và cách chữa là gì?',
          ),
          options: [
            B(
              'Layer A, credentials: <code>AccessDenied</code> on a signed request means the access key was revoked, and the message is the service\'s way of saying the key\'s validity window has ended — issue a new token and redeploy',
              'Lớp A, thông tin xác thực: <code>AccessDenied</code> trên một request đã ký nghĩa là access key đã bị thu hồi, và thông điệp là cách dịch vụ nói rằng cửa sổ hiệu lực của khoá đã kết thúc — hãy cấp một token mới rồi triển khai lại',
            ),
            B(
              'Layer B, authorisation: the bucket policy carries an explicit Deny with a date condition, so the object is refused to everyone after that date regardless of who asks — remove the condition from the policy',
              'Lớp B, phân quyền: bucket policy mang một câu Deny tường minh kèm điều kiện ngày tháng, nên object bị từ chối với tất cả mọi người sau ngày đó bất kể ai hỏi — hãy gỡ điều kiện đó khỏi chính sách',
            ),
            B(
              'Layer A, clock skew: a signing timestamp more than fifteen minutes from the server\'s clock produces exactly this message, so the fix is to sync NTP on the host that generated the URL',
              'Lớp A, lệch đồng hồ: một dấu thời gian ký lệch quá mười lăm phút so với đồng hồ máy chủ sẽ sinh ra chính xác thông điệp này, nên cách chữa là đồng bộ NTP trên máy đã sinh ra cái URL',
            ),
            B(
              'Layer C, presigned URL: the signature verified but <code>X-Amz-Date + X-Amz-Expires</code> is now in the past, so the URL was generated too long before it was used — regenerate it per request instead of caching it, and size <code>expiresIn</code> to the gap between issuing the link and the user clicking it',
              'Lớp C, URL đã ký sẵn: chữ ký xác minh được nhưng <code>X-Amz-Date + X-Amz-Expires</code> giờ đã nằm ở quá khứ, nên URL được sinh ra quá lâu trước khi được dùng — hãy sinh lại nó ở mỗi request thay vì lưu đệm, và chọn <code>expiresIn</code> theo đúng khoảng cách giữa lúc phát liên kết và lúc người dùng bấm vào',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The status code is the least informative part of this response and the <code>Message</code> field is the whole diagnosis. Six different problems produce a 403, and reading only the number sends you to the wrong room. <code>Request has expired</code> tells you something precise and reassuring: the signature <em>verified</em>. The server successfully recomputed it, agreed on who you are, and then checked the clock — so the credentials are fine, the bucket policy is fine, and nothing about IAM is involved. What failed is the time window baked into the URL at signing. That puts it in Layer C, presigned-URL problems, whose other member is <code>SignatureDoesNotMatch</code> on a presigned URL — meaning something changed between signing and use, usually a header the client added. The fix is about the lifecycle of the link rather than about permissions: sign per request, never cache a signed URL in a database or a page that might be reloaded later, and choose <code>expiresIn</code> from how long the user realistically takes to act. Note how the wrong branches waste time: rotating a key (Option 1) or editing a bucket policy (Option 2) touches production configuration to fix something that was never broken. Option 3 names the single most common cause of intermittent signature failures — clock skew is worth checking first on any flaky <code>SignatureDoesNotMatch</code> — but skew produces a signature mismatch, not this message, and here the signature was accepted.',
            'Mã trạng thái là phần ít thông tin nhất của phản hồi này còn trường <code>Message</code> mới là toàn bộ chẩn đoán. Sáu vấn đề khác nhau đều sinh ra một cái 403, và chỉ đọc con số là bị đưa vào nhầm phòng. <code>Request has expired</code> nói cho bạn một điều chính xác và đáng yên tâm: chữ ký ĐÃ XÁC MINH ĐƯỢC. Máy chủ đã tính lại nó thành công, đã đồng ý bạn là ai, rồi mới đi xem đồng hồ — nên thông tin xác thực ổn, bucket policy ổn, và chẳng có gì liên quan tới IAM. Thứ hỏng là cái cửa sổ thời gian đã nướng cứng vào URL lúc ký. Điều đó đặt nó vào Lớp C, nhóm vấn đề của URL đã ký sẵn, mà thành viên còn lại là <code>SignatureDoesNotMatch</code> trên một URL đã ký sẵn — nghĩa là có gì đó đã thay đổi giữa lúc ký và lúc dùng, thường là một header do client thêm vào. Cách chữa là về VÒNG ĐỜI CỦA LIÊN KẾT chứ không phải về quyền: ký ở mỗi request, đừng bao giờ lưu đệm một URL đã ký vào cơ sở dữ liệu hay vào một trang có thể được tải lại sau, và chọn <code>expiresIn</code> theo khoảng thời gian thực tế mà người dùng cần để hành động. Hãy để ý những nhánh sai lãng phí thời gian ra sao: xoay một cái khoá (phương án 1) hay sửa một bucket policy (phương án 2) là đụng vào cấu hình production để chữa một thứ chưa bao giờ hỏng. Phương án 3 gọi tên nguyên nhân phổ biến nhất của các cú hỏng chữ ký chập chờn — lệch đồng hồ đáng kiểm đầu tiên với bất kỳ cái <code>SignatureDoesNotMatch</code> chập chờn nào — nhưng lệch đồng hồ sinh ra một cú lệch CHỮ KÝ chứ không sinh ra thông điệp này, mà ở đây chữ ký đã được chấp nhận.',
          ),
        }),

        // q47 · đáp án 0
        mcq({
          prompt: B(
            'Two 403s from the same bucket in the same hour, with these bodies:' +
            code('A:  <Code>SignatureDoesNotMatch</Code>\n' +
              '    <Message>The request signature we calculated does not match\n' +
              '    the signature you provided. Check your key and signing\n' +
              '    method.</Message>\n' +
              '\n' +
              'B:  <Code>AccessDenied</Code>\n' +
              '    <Message>Access Denied.</Message>') +
            'What is the first thing each one tells you, and why must they be investigated separately?',

            'Hai cái 403 từ cùng một bucket trong cùng một giờ, với hai thân phản hồi này:' +
            code('A:  <Code>SignatureDoesNotMatch</Code>\n' +
              '    <Message>The request signature we calculated does not match\n' +
              '    the signature you provided. Check your key and signing\n' +
              '    method.</Message>\n' +
              '\n' +
              'B:  <Code>AccessDenied</Code>\n' +
              '    <Message>Access Denied.</Message>') +
            'Mỗi cái nói cho bạn biết điều gì đầu tiên, và vì sao chúng phải được điều tra riêng?',
          ),
          options: [
            B(
              'A means the server could not agree on <em>who you are</em> — the client and server computed different signatures, so look at clock skew, the region string and the secret itself. B means the server knows exactly who you are and is refusing <em>what you asked</em> — so look at the token\'s permission scope and at any explicit Deny in the bucket policy. They are different layers, and every fix for one is useless for the other',
              'A nghĩa là máy chủ không thống nhất được BẠN LÀ AI — client và máy chủ tính ra hai chữ ký khác nhau, nên hãy nhìn vào lệch đồng hồ, chuỗi region và chính phần bí mật. B nghĩa là máy chủ biết chính xác bạn là ai và đang từ chối THỨ BẠN XIN LÀM — nên hãy nhìn vào phạm vi quyền của token và vào bất kỳ câu Deny tường minh nào trong bucket policy. Chúng là hai lớp khác nhau, và mọi cách chữa cho cái này đều vô dụng với cái kia',
            ),
            B(
              'Both indicate the same underlying condition reported at different stages of the request pipeline, so the practical procedure is identical: rotate the credential, redeploy, and confirm the error disappears in both cases',
              'Cả hai đều chỉ ra cùng một tình trạng nền được báo ở hai giai đoạn khác nhau của đường ống xử lý request, nên quy trình thực dụng là như nhau: xoay credential, triển khai lại, rồi xác nhận lỗi biến mất ở cả hai',
            ),
            B(
              'A is the more serious because a signature mismatch can only come from a compromised or corrupted key, whereas B is routine and usually resolves itself once the caller retries against a warm connection',
              'A nghiêm trọng hơn vì một cú lệch chữ ký chỉ có thể đến từ một cái khoá bị xâm phạm hoặc bị hỏng, còn B là chuyện thường ngày và thường tự hết khi bên gọi thử lại trên một kết nối đã ấm',
            ),
            B(
              'B is the one that names a permission problem, and A is a transport-level error: a signature mismatch is what a proxy produces when it rewrites a request in flight, so A should be investigated as a network issue rather than a credential one',
              'B mới là cái gọi tên một vấn đề về quyền, còn A là lỗi ở tầng vận chuyển: một cú lệch chữ ký là thứ mà một proxy tạo ra khi nó viết lại một request đang bay, nên A nên được điều tra như một vấn đề mạng chứ không phải vấn đề credential',
            ),
          ],
          correct: 0,
          explanation: EX(
            'These two codes sit on opposite sides of the authentication/authorisation boundary, and the whole value of reading the body is that it tells you which side you are on before you touch anything. <b>SignatureDoesNotMatch</b> means the server rebuilt the canonical request from what arrived, computed a signature, and got a different value from the one you sent. Nothing about permissions has been consulted yet — the server does not know who you are. The three causes, in order of how often they actually occur: clock skew beyond the fifteen-minute tolerance (a container with a wrong clock, a CI runner that drifted), a region string that does not match what the endpoint expects, and a secret that is wrong, truncated on a copy-paste, or has a trailing space. <b>AccessDenied</b> with no further detail means the opposite: authentication succeeded, the server knows the identity, and the policy said no. Now permissions are the whole question — what scope the token has, which buckets and prefixes it covers, and whether a bucket policy carries an explicit Deny, which overrides any Allow. The practical value is negative as much as positive: on an <code>AccessDenied</code> there is no point syncing clocks, and on a <code>SignatureDoesNotMatch</code> there is no point editing a bucket policy. Option 2 collapses the distinction the body exists to draw, and rotating a credential to fix a policy problem changes production for nothing. Option 3 misdiagnoses a signature mismatch as compromise — the usual cause is a clock — and dismisses a permission refusal as transient. Option 4 inverts A: a proxy rewriting a signed request is a real and rare cause, but the first three suspects are local.',
            'Hai mã này nằm ở hai phía đối diện của ranh giới xác thực/phân quyền, và toàn bộ giá trị của việc đọc phần thân là nó nói cho bạn biết bạn đang ở phía nào TRƯỚC khi bạn đụng vào bất cứ thứ gì. <b>SignatureDoesNotMatch</b> nghĩa là máy chủ đã dựng lại canonical request từ thứ tới nơi, tính ra một chữ ký, và được một giá trị khác với cái bạn gửi. Chưa có gì về quyền được tra cứu cả — máy chủ chưa biết bạn là ai. Ba nguyên nhân, theo thứ tự tần suất thật: lệch đồng hồ vượt quá dung sai mười lăm phút (một container sai giờ, một CI runner bị trôi), một chuỗi region không khớp thứ endpoint mong đợi, và một phần bí mật bị sai, bị cắt cụt khi chép dán, hoặc có một dấu cách thừa ở cuối. <b>AccessDenied</b> mà không có chi tiết gì thêm thì nghĩa ngược lại: xác thực đã thành công, máy chủ biết danh tính, và chính sách nói không. Bây giờ quyền mới là toàn bộ câu hỏi — token có phạm vi gì, nó phủ những bucket và tiền tố nào, và bucket policy có mang một câu Deny tường minh không, thứ ghi đè lên mọi câu Allow. Giá trị thực dụng nằm ở cả chiều phủ định lẫn chiều khẳng định: với một cái <code>AccessDenied</code> thì đồng bộ đồng hồ là vô ích, còn với một cái <code>SignatureDoesNotMatch</code> thì sửa bucket policy là vô ích. Phương án 2 xoá đi đúng cái phân biệt mà phần thân sinh ra để vạch, và xoay một credential để chữa một vấn đề chính sách là đổi production mà chẳng được gì. Phương án 3 chẩn nhầm một cú lệch chữ ký thành bị xâm phạm — nguyên nhân thường gặp là cái đồng hồ — và gạt một lượt từ chối quyền thành chuyện nhất thời. Phương án 4 đảo ngược A: một proxy viết lại một request đã ký là nguyên nhân có thật nhưng hiếm, còn ba nghi phạm đầu tiên đều nằm ở phía cục bộ.',
          ),
        }),

        // q48 · đáp án 1
        mcq({
          prompt: B(
            'A bucket serves a public logo and private invoices. Measured, with a bucket policy allowing anonymous <code>s3:GetObject</code> on <code>arn:aws:s3:::de-thi-public/cong-khai/*</code> only:' +
            code('$ curl -o /dev/null -w "%{http_code}"  .../de-thi-public/cong-khai/logo.png\n' +
              '200          content-type: image/png\n' +
              '\n' +
              '$ curl .../de-thi-public/rieng-tu/hoa-don.pdf\n' +
              '403  <Code>AccessDenied</Code><Message>Access Denied.</Message>\n' +
              '\n' +
              '$ curl ".../de-thi-public?list-type=2"\n' +
              '403  <Code>AccessDenied</Code><Message>Access Denied.</Message>') +
            'What do these three results together demonstrate about the policy?',

            'Một bucket phục vụ một logo công khai và các hoá đơn riêng tư. Đã đo, với một bucket policy chỉ cho phép <code>s3:GetObject</code> ẩn danh trên <code>arn:aws:s3:::de-thi-public/cong-khai/*</code>:' +
            code('$ curl -o /dev/null -w "%{http_code}"  .../de-thi-public/cong-khai/logo.png\n' +
              '200          content-type: image/png\n' +
              '\n' +
              '$ curl .../de-thi-public/rieng-tu/hoa-don.pdf\n' +
              '403  <Code>AccessDenied</Code><Message>Access Denied.</Message>\n' +
              '\n' +
              '$ curl ".../de-thi-public?list-type=2"\n' +
              '403  <Code>AccessDenied</Code><Message>Access Denied.</Message>') +
            'Ba kết quả này gộp lại chứng minh điều gì về chính sách?',
          ),
          options: [
            B(
              'That the bucket is effectively public and the second and third refusals come from the objects\' own ACLs rather than the policy, so the policy is doing nothing and the private files are protected only by their per-object settings',
              'Rằng bucket trên thực tế là công khai và hai lượt từ chối sau đến từ ACL của chính các object chứ không từ chính sách, nên chính sách chẳng làm gì và các file riêng tư chỉ được bảo vệ bởi thiết lập theo từng object của chúng',
            ),
            B(
              'That access is granted per action and per resource, not per bucket: one prefix is readable anonymously, a sibling prefix is not, and because <code>s3:ListBucket</code> was never granted, nobody can enumerate the keys — so a private object is not discoverable even though it lives in the same bucket as a public one',
              'Rằng quyền được cấp theo từng HÀNH ĐỘNG và từng TÀI NGUYÊN chứ không theo từng bucket: một tiền tố đọc được ẩn danh, một tiền tố anh em thì không, và vì <code>s3:ListBucket</code> chưa bao giờ được cấp nên chẳng ai liệt kê nổi các key — nên một object riêng tư thậm chí không tìm ra được dù nó sống trong cùng bucket với một object công khai',
            ),
            B(
              'That the third refusal is a misconfiguration: <code>s3:GetObject</code> on a prefix implies the ability to list that prefix, so listing should have returned the public key and the 403 indicates the policy failed to apply',
              'Rằng lượt từ chối thứ ba là một chỗ cấu hình sai: <code>s3:GetObject</code> trên một tiền tố ngầm kéo theo khả năng liệt kê tiền tố đó, nên lượt liệt kê lẽ ra phải trả về cái key công khai và cái 403 cho thấy chính sách đã không được áp',
            ),
            B(
              'That anonymous access is all-or-nothing and the 200 proves the bucket is public; the two 403s are rate-limiting responses that a signed request would not have received, so the test needs to be repeated with credentials to say anything about the policy',
              'Rằng truy cập ẩn danh là được-tất-hoặc-không-gì và cái 200 chứng minh bucket là công khai; hai cái 403 là phản hồi giới hạn tần suất mà một request đã ký sẽ không gặp, nên phép thử cần được lặp lại kèm thông tin xác thực thì mới nói được gì về chính sách',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Three probes, three facts, and together they describe least privilege working exactly as intended. The <b>200</b> shows the grant is real: an unauthenticated request read an object because the policy allowed <code>s3:GetObject</code> on that resource pattern. The <b>first 403</b> shows the grant is scoped: <code>rieng-tu/hoa-don.pdf</code> does not match <code>cong-khai/*</code>, so nothing allows it and the default denial stands — being in the same bucket as a public object grants nothing. The <b>second 403</b> is the one people forget to check and it is the most valuable: <code>s3:ListBucket</code> is a separate action on a separate resource (the bucket, not the objects), and it was never granted, so an anonymous caller cannot enumerate what is in there. That closes the discovery hole — without it, a public bucket hands an attacker the complete key list and "private" reduces to "not linked from anywhere". This is also the right way to test a policy: probe something that must succeed and something that must fail, because a test with no negative case cannot distinguish a correct policy from an absent one. Option 1 attributes the refusals to per-object ACLs, which are deprecated in modern S3 and are not what produced these results. Option 3 invents an implication between actions; <code>GetObject</code> and <code>ListBucket</code> are independent, and their separateness is the whole point. Option 4 misreads two policy refusals as rate limiting and would conclude the bucket is fully public, which the second probe directly disproves.',
            'Ba phép dò, ba sự kiện, và gộp lại chúng mô tả nguyên tắc đặc quyền tối thiểu đang chạy đúng như ý định. Cái <b>200</b> cho thấy quyền được cấp là có thật: một request không xác thực đã đọc được một object vì chính sách cho phép <code>s3:GetObject</code> trên mẫu tài nguyên đó. Cái <b>403 thứ nhất</b> cho thấy quyền ấy có phạm vi: <code>rieng-tu/hoa-don.pdf</code> không khớp <code>cong-khai/*</code>, nên chẳng có gì cho phép nó và lượt từ chối mặc định đứng vững — nằm cùng bucket với một object công khai không cấp cho bạn thứ gì. Cái <b>403 thứ hai</b> mới là cái người ta quên kiểm và nó có giá trị nhất: <code>s3:ListBucket</code> là một HÀNH ĐỘNG riêng trên một TÀI NGUYÊN riêng (cái bucket, không phải các object), và nó chưa bao giờ được cấp, nên một bên gọi ẩn danh không liệt kê nổi cái gì đang ở trong đó. Điều ấy bịt luôn lỗ hổng khám phá — không có nó thì một bucket công khai trao cho kẻ tấn công trọn danh sách key, và "riêng tư" tụt xuống thành "không được liên kết từ đâu cả". Đây cũng là cách đúng để thử một chính sách: hãy dò một thứ BẮT BUỘC phải thành công và một thứ BẮT BUỘC phải hỏng, vì một phép thử không có ca phủ định thì không phân biệt nổi một chính sách đúng với việc chẳng có chính sách nào. Phương án 1 quy hai lượt từ chối cho ACL theo từng object, thứ đã lỗi thời trong S3 hiện đại và không phải thứ tạo ra các kết quả này. Phương án 3 bịa ra một quan hệ kéo theo giữa các hành động; <code>GetObject</code> và <code>ListBucket</code> độc lập với nhau, và chính sự tách rời ấy mới là mấu chốt. Phương án 4 đọc nhầm hai lượt từ chối do chính sách thành giới hạn tần suất và sẽ kết luận rằng bucket hoàn toàn công khai, điều mà phép dò thứ hai bác bỏ thẳng.',
          ),
        }),

        // q49 · đáp án 2
        mcq({
          prompt: B(
            'A download endpoint reports p50 = 40 ms and p99 = 4 s. Ten <code>curl -w</code> runs against the same object:' +
            code('connect=0.030s tls=0.087s ttfb=0.121s total=0.135s\n' +
              'connect=0.028s tls=0.083s ttfb=0.118s total=0.132s\n' +
              'connect=0.031s tls=0.089s ttfb=3.847s total=3.892s   <-- cai nay\n' +
              'connect=0.029s tls=0.084s ttfb=0.119s total=0.133s\n' +
              'connect=0.030s tls=0.086s ttfb=0.117s total=0.132s') +
            'Separately, a serverless handler that constructs <code>new S3Client(...)</code> inside the function shows "first request 200 ms, later ones 30 ms". What does each measurement point at?',

            'Một endpoint tải xuống báo p50 = 40 ms và p99 = 4 s. Mười lượt <code>curl -w</code> lên cùng một object:' +
            code('connect=0.030s tls=0.087s ttfb=0.121s total=0.135s\n' +
              'connect=0.028s tls=0.083s ttfb=0.118s total=0.132s\n' +
              'connect=0.031s tls=0.089s ttfb=3.847s total=3.892s   <-- cai nay\n' +
              'connect=0.029s tls=0.084s ttfb=0.119s total=0.133s\n' +
              'connect=0.030s tls=0.086s ttfb=0.117s total=0.132s') +
            'Riêng ra, một handler serverless dựng <code>new S3Client(...)</code> BÊN TRONG hàm thì cho thấy "request đầu 200 ms, các lượt sau 30 ms". Mỗi phép đo chỉ vào cái gì?',
          ),
          options: [
            B(
              'Both point at the same cause: the outlier is a connection that had to be re-established, which is also what the serverless pattern shows, so hoisting the client to module scope fixes the p99 as well as the cold-start figure',
              'Cả hai chỉ vào cùng một nguyên nhân: cái ngoại lai là một kết nối phải dựng lại, và đó cũng chính là thứ mẫu serverless cho thấy, nên đưa client lên phạm vi module là chữa được cả p99 lẫn con số khởi động nguội',
            ),
            B(
              'Both point at the network: <code>ttfb</code> includes the round trip, so a 3.8 s value means a routing problem between the client and the region, and the serverless case is the same problem measured on a colder path',
              'Cả hai chỉ vào mạng: <code>ttfb</code> bao gồm cả lượt đi về, nên một giá trị 3,8 s nghĩa là có vấn đề định tuyến giữa client và vùng máy chủ, còn ca serverless là đúng vấn đề đó đo trên một đường nguội hơn',
            ),
            B(
              'They point at different layers: <code>connect</code> and <code>tls</code> stayed flat while only <code>ttfb</code> ballooned, so the client and the network were healthy and the storage layer was slow on that one request — whereas the serverless pattern is textbook connection setup, fixed by hoisting the client so DNS and the TLS handshake are paid once instead of per invocation',
              'Chúng chỉ vào hai tầng khác nhau: <code>connect</code> và <code>tls</code> giữ phẳng trong khi chỉ <code>ttfb</code> phình lên, nên client và mạng đều khoẻ và chính tầng lưu trữ mới chậm ở đúng request đó — còn mẫu serverless thì đúng sách giáo khoa về việc dựng kết nối, chữa bằng cách đưa client lên phạm vi module để DNS và bắt tay TLS chỉ phải trả một lần thay vì mỗi lượt gọi',
            ),
            B(
              'Neither is diagnostic: a single outlier in ten samples is noise, and a serverless cold start is a property of the runtime, so the only meaningful next step is to collect a larger sample before forming any hypothesis',
              'Không cái nào có tính chẩn đoán: một điểm ngoại lai trong mười mẫu là nhiễu, còn khởi động nguội của serverless là tính chất của môi trường chạy, nên bước tiếp theo có ý nghĩa duy nhất là thu thập một mẫu lớn hơn trước khi đặt bất kỳ giả thuyết nào',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The value of <code>curl -w</code> is that it splits one number into four, and the split is the diagnosis. In the transcript, <code>connect</code> (TCP) and <code>tls</code> (handshake) are stable to within three milliseconds across every run including the slow one — so DNS, routing, and the handshake were all fine at the moment of the outlier. The entire 3.8 s appeared in <code>ttfb</code>, the gap between finishing the request and receiving the first byte, which is time spent <em>inside the service</em> locating the object. That is a server-side event: a hot prefix serialising requests on one partition (mostly an S3 concern) or a genuine transient blip. The distinguishing follow-up is whether it recurs on the same key — if it does, spread the prefix; if it scatters, check the status page. The serverless case is a completely different layer and has a one-line fix: constructing the client inside the handler creates a fresh connection pool that is discarded after one use, so every invocation pays DNS plus a TLS handshake before doing any work. Hoisting it to module scope lets warm invocations reuse the connection, and the 200 ms first call becomes 30 ms. The habit worth keeping is to look at which component of the timing moved before deciding what to fix. Option 1 applies the connection-reuse fix to both, but the transcript rules it out — reuse cannot help when <code>connect</code> and <code>tls</code> never grew. Option 2 blames the network against direct evidence that the network was healthy. Option 4 is right that one sample is thin, but the split already excludes three of the five candidate causes, and refusing to read available evidence is not rigour.',
            'Giá trị của <code>curl -w</code> là nó xẻ MỘT con số thành BỐN, và chính chỗ xẻ đó là chẩn đoán. Trong đoạn ghi, <code>connect</code> (TCP) và <code>tls</code> (bắt tay) ổn định trong vòng ba mili giây qua mọi lượt chạy, kể cả lượt chậm — nên DNS, định tuyến và bắt tay đều ổn ngay tại khoảnh khắc có điểm ngoại lai. Toàn bộ 3,8 s xuất hiện ở <code>ttfb</code>, tức khoảng giữa lúc gửi xong request và lúc nhận được byte đầu tiên, và đó là thời gian tiêu BÊN TRONG dịch vụ để định vị object. Đó là một sự kiện phía máy chủ: một tiền tố nóng làm các request xếp hàng trên một phân vùng (chủ yếu là chuyện của S3) hoặc một cú trục trặc nhất thời có thật. Bước theo dõi để phân biệt là xem nó có tái diễn trên CÙNG một key không — nếu có thì trải tiền tố ra; nếu nó rải rác thì đi xem trang trạng thái. Ca serverless nằm ở một tầng hoàn toàn khác và có một cách chữa dài một dòng: dựng client bên trong handler là tạo ra một pool kết nối mới toanh rồi vứt đi sau một lần dùng, nên mỗi lượt gọi đều trả tiền DNS cộng một lần bắt tay TLS trước khi làm được việc gì. Đưa nó lên phạm vi module là các lượt gọi ấm dùng lại được kết nối, và lời gọi đầu 200 ms thành 30 ms. Thói quen đáng giữ là nhìn xem THÀNH PHẦN NÀO của phép đo thời gian đã dịch chuyển trước khi quyết chữa cái gì. Phương án 1 áp cách chữa dùng-lại-kết-nối cho cả hai, nhưng đoạn ghi loại trừ nó — dùng lại kết nối chẳng giúp gì khi <code>connect</code> và <code>tls</code> chưa hề phình. Phương án 2 đổ lỗi cho mạng, ngược với bằng chứng trực tiếp rằng mạng vẫn khoẻ. Phương án 4 đúng ở chỗ một mẫu thì mỏng, nhưng chỗ xẻ đã loại trừ được ba trong năm nguyên nhân ứng viên rồi, và từ chối đọc bằng chứng sẵn có thì không phải là sự chặt chẽ.',
          ),
        }),

        /* ── Chương 10 — cái sống qua đo lường (1 câu) ─────────────────── */

        // q50 · đáp án 3
        mcq({
          prompt: B(
            'A design document justifies a storage choice with one line: <em>"R2 is 46× cheaper than S3."</em> The number is real — it comes from a worked example of 1 TB stored and 10 TB/month of egress to browsers. The system being designed is an internal analytics pipeline that never egresses and writes tens of millions of objects a month. What is wrong with the sentence, and what is the general rule?',
            'Một tài liệu thiết kế biện minh cho một lựa chọn lưu trữ bằng đúng một dòng: <em>"R2 rẻ hơn S3 46 lần."</em> Con số là thật — nó đến từ một ví dụ tính toán với 1 TB lưu trữ và 10 TB/tháng truyền ra cho trình duyệt. Hệ thống đang được thiết kế lại là một đường ống phân tích nội bộ không bao giờ truyền ra và ghi hàng chục triệu object mỗi tháng. Câu đó sai ở chỗ nào, và quy tắc tổng quát là gì?',
          ),
          options: [
            B(
              'The number is stale rather than misapplied: published rates move, so the rule is to re-read both providers\' pricing pages before quoting a ratio, and the same comparison redone today would give a smaller but still large figure for this workload',
              'Con số đã cũ chứ không phải bị áp sai chỗ: bảng giá công bố có thay đổi, nên quy tắc là đọc lại trang giá của cả hai nhà cung cấp trước khi trích một tỷ số, và cũng phép so đó làm lại hôm nay sẽ ra một con số nhỏ hơn nhưng vẫn lớn cho khối công việc này',
            ),
            B(
              'The sentence is fine as a summary and the error is only in precision: quoting "an order of magnitude" instead of "46×" would have been accurate for any workload, since the direction of the comparison never changes',
              'Câu đó ổn với tư cách một bản tóm tắt và sai lầm chỉ nằm ở độ chính xác: trích "một bậc độ lớn" thay vì "46 lần" sẽ chính xác với mọi khối công việc, vì chiều của phép so thì không bao giờ đổi',
            ),
            B(
              'The problem is the source rather than the claim: a ratio taken from a vendor\'s own worked example should never enter a design document, and the rule is to quote only figures produced by your own measurement of your own workload',
              'Vấn đề nằm ở nguồn chứ không ở khẳng định: một tỷ số lấy từ ví dụ tính toán của chính nhà cung cấp thì không bao giờ nên vào một tài liệu thiết kế, và quy tắc là chỉ trích những con số do chính bạn đo trên chính khối công việc của bạn',
            ),
            B(
              'The number was true under conditions this system does not share — it is a ratio dominated by egress, and this workload has none — so the claim silently changes meaning when the conditions are dropped; carry the sentence that says where a measurement was taken along with the measurement, because a figure separated from its conditions is how a correct observation becomes wrong advice',
              'Con số ấy đúng dưới những điều kiện mà hệ thống này không có — nó là một tỷ số bị chi phối bởi phí truyền ra, còn khối công việc này thì không có khoản đó — nên khẳng định ấy âm thầm đổi nghĩa khi các điều kiện bị bỏ rơi; hãy mang theo cả cái câu nói rõ phép đo được lấy ở đâu cùng với chính phép đo, vì một con số tách khỏi điều kiện của nó chính là cách một quan sát ĐÚNG biến thành một lời khuyên SAI',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is the closing habit of the whole course, and it is what separates a number you can act on from a number that will mislead someone in six months. The 46× figure is not wrong — it was computed correctly from real published rates, for a workload whose bill is roughly ninety percent egress. Strip the egress away, as this pipeline does, and the same two providers land within a few tens of percent of each other, because what remains is storage (a 35% difference) and operations (about 10%). The claim did not become false; it became a claim about a different system. That is the failure mode the last chapter is built around: a statement that holds <em>where it was measured</em> gets repeated as though it holds everywhere, and each retelling drops another condition until it is simply folklore. The discipline is small and mechanical — write "46× at 10 TB/month of egress to browsers" rather than "46×" — and it survives being quoted by someone who was not there. The same shape recurs throughout: "multipart is faster" holds above a size threshold and reverses below it; "the ETag is the MD5" holds for single-part uploads without encryption; "R2 ignores the region" holds on R2 and is a signature failure on S3. Option 1 substitutes a real but different concern; the rates here are current, and staleness would not explain a reversal by workload. Option 2 preserves the error while rounding it, and the direction can genuinely reverse once Class A operations dominate. Option 3 sets a standard that would forbid using published pricing at all — the vendor\'s example is fine to cite, provided its conditions travel with it.',
            'Đây là thói quen kết của cả khoá học, và nó là thứ phân biệt một con số bạn hành động được với một con số sẽ dẫn ai đó đi lạc sau sáu tháng. Con số 46 lần không sai — nó được tính đúng từ bảng giá công bố có thật, cho một khối công việc mà hoá đơn khoảng chín mươi phần trăm là phí truyền ra. Bỏ phần truyền ra đi, đúng như đường ống này, thì cùng hai nhà cung cấp ấy rơi vào khoảng vài chục phần trăm quanh nhau, vì thứ còn lại chỉ là lưu trữ (chênh 35%) và thao tác (khoảng 10%). Khẳng định ấy không trở thành SAI; nó trở thành một khẳng định về MỘT HỆ THỐNG KHÁC. Đó là kiểu hỏng mà chương cuối được dựng lên quanh nó: một phát biểu đúng Ở NƠI NÓ ĐƯỢC ĐO bị nhắc lại như thể nó đúng ở mọi nơi, và mỗi lần kể lại thì rơi mất thêm một điều kiện cho tới khi nó chỉ còn là lời truyền miệng. Kỷ luật thì nhỏ và máy móc — viết "46 lần ở mức 10 TB/tháng truyền ra cho trình duyệt" chứ đừng viết "46 lần" — và nó sống sót được khi bị trích lại bởi một người không có mặt lúc đo. Cùng hình dạng ấy lặp lại suốt khoá: "multipart nhanh hơn" đúng trên một ngưỡng kích thước và đảo chiều ở dưới ngưỡng; "ETag là MD5" đúng với lượt tải lên đơn-phần không mã hoá; "R2 bỏ qua region" đúng trên R2 và là một cú hỏng chữ ký trên S3. Phương án 1 thay bằng một lo ngại có thật nhưng khác chuyện; bảng giá ở đây là hiện hành, và chuyện cũ đi thì không giải thích nổi một cú đảo chiều theo khối công việc. Phương án 2 giữ nguyên sai lầm mà chỉ làm tròn nó lại, còn chiều so sánh thì thật sự có thể đảo một khi các thao tác Class A chiếm chủ đạo. Phương án 3 dựng một tiêu chuẩn sẽ cấm luôn cả việc dùng bảng giá công bố — ví dụ của nhà cung cấp trích được bình thường, miễn là các điều kiện của nó đi theo cùng.',
          ),
        }),
      ],
    },
  ],
};
