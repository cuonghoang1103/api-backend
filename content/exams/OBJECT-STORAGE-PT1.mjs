/**
 * Object Storage — Progress Test 1 (Mục 0 → Chương 3).
 *
 * Đề tự soạn, bám sát `content/courses/object-storage/s00-intro.mjs` …
 * `s03-urls.mjs`. 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi.
 *
 * ⚠️ MỌI transcript, mọi mã lỗi, mọi ETag và mọi con số trong đề này đều LẤY TỪ
 * MỘT MÁY CHỦ S3-COMPATIBLE SỐNG, dựng riêng cho đề bằng Docker:
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
 * ⚠️ BA CHỖ MÁY KHÁC GIÁO TRÌNH — ĐỀ THEO MÁY
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  • Bài 0.2 nói key tối đa "1024 UTF-8 byte" như thể 1024 byte nào cũng được.
 *    Đo thật: key 1025 byte trả `400 KeyTooLongError "Your key is too long"`
 *    (đúng như giáo trình ngụ ý), NHƯNG một key 1024 byte gồm MỘT đoạn duy
 *    nhất cũng bị từ chối — `400 XMinioInvalidObjectName "Object name contains
 *    unsupported characters."` Chia thành các đoạn ≤ 200 byte ngăn bằng `/`
 *    thì đúng 1024 byte lại nhận. Trần 1024 là trần của CẢ key; MinIO còn có
 *    thêm trần cho từng ĐOẠN mà giáo trình không nhắc. Câu 5 chỉ hỏi mốc 1025
 *    — chỗ máy và giáo trình đồng ý.
 *
 *  • Bài 1.3 và bài 0.2 nói ETag multipart là `HASH-N` "với N = số part", ngầm
 *    hiểu multipart nghĩa là nhiều phần. Đo thật: một lượt multipart chỉ có
 *    ĐÚNG MỘT phần vẫn ra hậu tố `-1`, và giá trị ấy KHÁC md5 của chính phần
 *    đó — 2 MiB ký tự `C` cho phần có ETag `"bf52955b454974e73c3e2694bd7207c4"`
 *    nhưng object cuối là `"62779858262432b238005e27d389b376-1"`. Nghĩa là
 *    "ETag không có gạch ngang" KHÔNG suy ra được "tải một lượt", và một file
 *    nhỏ đi qua lớp `Upload` của SDK cũng mất tính chất ETag = MD5. Câu 14 hỏi
 *    đúng chỗ đó.
 *
 *  • Bài 3.1 nói phục vụ file công khai qua API endpoint thì browser "fail với
 *    401 (no SDK signature)". Đo thật trên máy chủ sống: một `GET` ẩn danh vào
 *    endpoint trả **403** kèm `<Code>AccessDenied</Code>`, không phải 401. Đề
 *    KHÔNG ra câu hỏi vào con số ấy (đề FE đã hỏi tình huống này rồi), nhưng
 *    ghi lại đây để không ai chép lại con số 401 từ giáo trình.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️ NHỮNG CHỖ CHỈ DỰA VÀO TÀI LIỆU, CHƯA ĐO ĐƯỢC
 * ─────────────────────────────────────────────────────────────────────────────
 * MinIO không phải R2. Những điều sau lấy từ giáo trình + tài liệu Cloudflare/
 * AWS, và đề trình bày chúng như KIẾN THỨC chứ không như phép đo:
 *   – bảng giá R2/S3 và cách chia Class A / Class B (câu 17, 18, 21): giá công
 *     bố; đề chỉ bắt làm số học trên chính bảng giá đề đưa ra.
 *   – R2 bỏ qua ÂM THẦM `StorageClass` khác STANDARD. Đề KHÔNG ra câu hỏi vào
 *     hành vi ấy, vì đo trên MinIO thì ngược lại: `StorageClass: 'GLACIER'` bị
 *     từ chối thẳng — `400 InvalidStorageClass "Invalid storage class."` Hai
 *     máy chủ xử lý khác nhau nên không thể trình bày cái nào như đã đo trên R2.
 *   – custom domain của R2 tự đi kèm CDN Cloudflare, purge qua API, free plan
 *     30 lượt purge/ngày (câu 22, 24, 29).
 *   – quy trình luân chuyển khoá 7 bước và cửa sổ chồng lấn 24 giờ (câu 19),
 *     và cách phân quyền token per-workload (câu 20).
 *   – khuôn mẫu "API kiểm quyền rồi trả về signed URL" (câu 30) và các mốc TTL
 *     5-10 phút / 1 giờ / 7 ngày: theo giáo trình. Trần 7 ngày là trần của
 *     SigV4 và của SDK chứ không phải của R2 — đo được ở phía SDK (nó ném ngay
 *     tại chỗ, trước khi có byte nào ra mạng) nhưng phía R2 thì không.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Phân bố câu theo chương:
 *   Mục 0 — object storage là gì            6 câu   (q1–q6)
 *   Chương 1 — S3 API                       9 câu   (q7–q15)
 *   Chương 2 — R2 specifics                 7 câu   (q16–q22)
 *   Chương 3 — URL và access                8 câu   (q23–q30)
 *                                          ─────
 *                                          30 câu trắc nghiệm + 2 câu lập trình
 *
 * Phân bố vị trí đáp án — A 8 · B 8 · C 8 · D 8, tổng 32 ô chứ không phải 30:
 * câu 6 và câu 18 là câu "chọn HAI" nên mỗi câu góp hai ô. Đếm lại bằng:
 *   node -e "import('./content/exams/OBJECT-STORAGE-PT1.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Hai câu lập trình đều CHẠY ĐƯỢC bằng Node thuần (chỉ `node:crypto`), không
 * cần mạng, không cần `node_modules`, và `scripts/exam-check.mjs` chạy thật cả
 * hai `sampleSolution` rồi so từng byte với `expectedOutput`. Mọi ETag trong
 * `expectedOutput` của câu 31 đều TRÙNG TỪNG BYTE với MinIO trên cùng dữ liệu.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/OBJECT-STORAGE-PT1.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/objectstorage-exam-kit.mjs';

export default {
  course: { slug: 'object-storage' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Section 0 to Chapter 3 (flat keys, the S3 API, R2 specifics, URLs)',
        'Kiểm tra tiến độ 1 — Mục 0 đến Chương 3 (key phẳng, S3 API, R2 specifics, URL)',
      ),
      description: B(
        'The first third of the Object Storage course: why a key is not a path, the four core operations plus multipart, what makes R2 different from S3, and the three URL types. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba đầu của khoá Object Storage: vì sao một key không phải một đường dẫn, bốn thao tác lõi cộng multipart, R2 khác S3 ở đâu, và ba loại URL. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '0–3'),
      questions: [
        // ── Mục 0 — object storage là gì ────────────────────────────────
        mcq({
          prompt: B(
            'A bucket contains exactly one object, and two HEAD calls are made against it. Real output from a live S3-compatible endpoint:' + code(
              'PutObject  Key="a/b/c.txt"  -> ETag "49f68a5c8493ec2c0bf489821c21fc3b"\n\n' +
              'HeadObject Key="a/"    -> err.name = NotFound, HTTP 404\n' +
              'HeadObject Key="a/b/"  -> err.name = NotFound, HTTP 404',
            ) + 'What does this prove?',
            'Một bucket chứa đúng một object, rồi hai lệnh HEAD được gọi vào nó. Output thật từ một máy chủ S3-compatible đang sống:' + code(
              'PutObject  Key="a/b/c.txt"  -> ETag "49f68a5c8493ec2c0bf489821c21fc3b"\n\n' +
              'HeadObject Key="a/"    -> err.name = NotFound, HTTP 404\n' +
              'HeadObject Key="a/b/"  -> err.name = NotFound, HTTP 404',
            ) + 'Điều này chứng minh cái gì?',
          ),
          options: [
            B('The upload only half-succeeded: the object landed but the two parent directories were not created, so a follow-up call is needed to register them', 'Lượt tải lên mới thành công một nửa: object đã vào nhưng hai thư mục cha chưa được tạo, nên cần gọi thêm một lệnh nữa để đăng ký chúng'),
            B('A prefix is not an entity: only the exact key <code>a/b/c.txt</code> exists, and the slashes inside it are ordinary characters, not directories you can ask about', 'Tiền tố không phải một thực thể: chỉ đúng key <code>a/b/c.txt</code> tồn tại, còn các dấu gạch chéo bên trong nó là ký tự thường, không phải thư mục để hỏi tới'),
            B('HEAD cannot be used on any path that ends with a slash, but GET on the very same two paths would have returned 200 with an empty body', 'Không được dùng HEAD với đường dẫn kết thúc bằng dấu gạch chéo, còn GET vào đúng hai đường dẫn ấy thì sẽ trả 200 với thân rỗng'),
            B('The bucket has directory listing disabled, and enabling it in the bucket settings would make both HEAD calls return 200', 'Bucket này đang tắt chế độ liệt kê thư mục, bật nó trong cấu hình bucket là cả hai lệnh HEAD sẽ trả 200'),
          ],
          correct: 1,
          explanation: EX(
            'Measured, not reasoned. The namespace is FLAT: <code>a/b/c.txt</code> is one string, and <code>a/</code> and <code>a/b/</code> were never created because there is nothing to create. Nothing in the protocol makes a directory out of a slash. Two consequences follow directly: renaming a "folder" is copy + delete of every key under it, and there is no cheap way to ask "how big is this folder" other than scanning every key with that prefix.',
            'Đo thật, không phải suy luận. Không gian tên là PHẲNG: <code>a/b/c.txt</code> là một chuỗi, còn <code>a/</code> và <code>a/b/</code> chưa từng được tạo vì không có gì để tạo cả. Không có gì trong giao thức biến một dấu gạch chéo thành một thư mục. Hai hệ quả đi ra ngay từ đó: đổi tên một "thư mục" là copy cộng delete từng key bên dưới, và không có cách rẻ nào để hỏi "thư mục này nặng bao nhiêu" ngoài quét hết mọi key mang tiền tố ấy.',
          ),
        }),

        mcq({
          prompt: B(
            'A 26-byte object holding the alphabet is read with a Range header, measured live:' + code(
              "GetObject Key='abc.txt' Range='bytes=5-9'\n" +
              '  HTTP 206\n' +
              '  Content-Range: bytes 5-9/26\n' +
              '  ContentLength: 5\n' +
              "  body: 'fghij'",
            ) + 'A developer concludes: "so I can also write bytes 5-9 in place". Is that right?',
            'Một object 26 byte chứa bảng chữ cái được đọc bằng header Range, đo thật:' + code(
              "GetObject Key='abc.txt' Range='bytes=5-9'\n" +
              '  HTTP 206\n' +
              '  Content-Range: bytes 5-9/26\n' +
              '  ContentLength: 5\n' +
              "  body: 'fghij'",
            ) + 'Một lập trình viên kết luận: "vậy tôi cũng ghi đè được byte 5-9 tại chỗ". Đúng không?',
          ),
          options: [
            B('Yes — Range works both ways; the same header on a PUT patches exactly those five bytes and leaves the other twenty-one untouched', 'Đúng — Range dùng được cả hai chiều; đúng header đó trên một lệnh PUT sẽ vá đúng năm byte ấy và để yên hai mươi mốt byte còn lại'),
            B('Yes, but only when the object is smaller than one part (5 MiB), because above that the service switches to multipart internally and refuses partial writes', 'Đúng, nhưng chỉ khi object nhỏ hơn một phần (5 MiB), vì trên mức đó máy chủ tự chuyển sang multipart nội bộ và từ chối ghi từng phần'),
            B('No — reading is partial-capable, writing is not: every write replaces the whole object, and the only way to change five bytes is to upload all 26 again', 'Không — đọc thì làm được từng phần, ghi thì không: mọi lượt ghi thay cả object, và cách duy nhất để đổi năm byte là tải lại đủ 26 byte'),
            B('No, and reading is not partial either: the 206 above is the CDN slicing a response it already had in cache, not the storage service reading part of the object', 'Không, mà đọc cũng chẳng phải từng phần: cái 206 ở trên là CDN cắt một phản hồi nó đã có sẵn trong cache chứ không phải máy chủ lưu trữ đọc một phần object'),
          ],
          correct: 2,
          explanation: EX(
            'The asymmetry is real and it is the second of the three differences in Lesson 0.1. A ranged GET is served straight from storage — <code>206</code> plus <code>Content-Range: bytes 5-9/26</code> is the server, not a cache. There is no ranged PUT: overwriting the same key with three bytes was measured to leave a three-byte object, ETag <code>"e65075d550f9b5bf9992fa1d71a131be"</code>, with the other 23 bytes simply gone. Multipart is the one exception and it still assembles a brand-new object at the end.',
            'Sự bất đối xứng này là thật, và nó là khác biệt thứ hai trong ba khác biệt ở bài 0.1. Một lệnh GET có Range được phục vụ thẳng từ kho — <code>206</code> kèm <code>Content-Range: bytes 5-9/26</code> là máy chủ trả, không phải cache. Không có PUT theo Range: đo thật, ghi đè cùng key bằng ba byte cho ra một object ba byte, ETag <code>"e65075d550f9b5bf9992fa1d71a131be"</code>, còn 23 byte kia mất hẳn. Multipart là ngoại lệ duy nhất, mà nó vẫn dựng ra một object hoàn toàn mới ở bước cuối.',
          ),
        }),

        mcq({
          prompt: B(
            'Custom metadata is written and then read back. Measured:' + code(
              "PutObject  Metadata: { 'Nguoi-Tai': '42', 'Nguon': 'app' }\n" +
              "HeadObject Metadata: { 'nguoi-tai': '42', 'nguon': 'app' }",
            ) + 'Code that later does <code>head.Metadata[&quot;Nguoi-Tai&quot;]</code> reads <code>undefined</code>. Why, and what is the right habit?',
            'Metadata tuỳ biến được ghi lên rồi đọc lại. Đo thật:' + code(
              "PutObject  Metadata: { 'Nguoi-Tai': '42', 'Nguon': 'app' }\n" +
              "HeadObject Metadata: { 'nguoi-tai': '42', 'nguon': 'app' }",
            ) + 'Đoạn mã sau đó đọc <code>head.Metadata[&quot;Nguoi-Tai&quot;]</code> ra <code>undefined</code>. Vì sao, và thói quen đúng là gì?',
          ),
          options: [
            B('The value was silently dropped because user metadata may only hold lowercase ASCII, so the fix is to base64-encode both the name and the value before sending them', 'Giá trị bị vứt âm thầm vì user metadata chỉ chứa được ASCII chữ thường, nên cách sửa là mã hoá base64 cả tên lẫn giá trị trước khi gửi'),
            B('HeadObject never returns user metadata at all — the object above only looks right because the values happen to be cached from the PutObject response', 'HeadObject không bao giờ trả user metadata — object ở trên trông có vẻ đúng chỉ vì các giá trị tình cờ được cache lại từ phản hồi của PutObject'),
            B('The SDK strips any metadata key containing a hyphen, so renaming it to <code>NguoiTai</code> would round-trip with its capitalisation intact', 'SDK cắt bỏ mọi khoá metadata có dấu gạch ngang, nên đổi tên thành <code>NguoiTai</code> là nó sẽ đi về nguyên vẹn cả kiểu hoa thường'),
            B('Metadata names travel as HTTP headers, which are case-insensitive and come back lowercased, so read them with a lowercase name — or keep the field in your database instead, which is what this repo does', 'Tên metadata đi trên dây dưới dạng header HTTP, mà header thì không phân biệt hoa thường và quay về ở dạng chữ thường, nên hãy đọc bằng tên viết thường — hoặc giữ hẳn trường ấy trong cơ sở dữ liệu, đúng như kho này đang làm')
          ],
          correct: 3,
          explanation: EX(
            'Measured on a live endpoint: the VALUES survive intact, the NAMES come back lowercased, because each one travels as an <code>x-amz-meta-&lt;name&gt;</code> HTTP header and HTTP header names are case-insensitive. Lesson 0.2 lists the limits (under 2 KB total) and says this repo does not use user metadata at all — it keeps <code>uploadedBy</code>, <code>size</code> and <code>mimeType</code> in the Postgres <code>MediaFile</code> row, which is queryable, joinable and does not cost a request to read.',
            'Đo thật trên máy chủ sống: GIÁ TRỊ đi về nguyên vẹn, còn TÊN quay về ở dạng chữ thường, vì mỗi cái đi trên dây dưới dạng một header HTTP <code>x-amz-meta-&lt;tên&gt;</code> mà tên header thì không phân biệt hoa thường. Bài 0.2 liệt kê các giới hạn (tổng dưới 2 KB) và nói kho này không dùng user metadata: nó giữ <code>uploadedBy</code>, <code>size</code> và <code>mimeType</code> trong hàng <code>MediaFile</code> ở Postgres — thứ truy vấn được, join được, và đọc không tốn một request nào.',
          ),
        }),

        mcq({
          prompt: B(
            'A zero-byte object is uploaded and read back. Measured:' + code(
              'PutObject  Key="rong.bin"  Body=<0 bytes>\n' +
              '  -> ETag "d41d8cd98f00b204e9800998ecf8427e"\n' +
              'HeadObject Key="rong.bin"\n' +
              '  -> ContentLength: 0, ETag "d41d8cd98f00b204e9800998ecf8427e"',
            ) + 'Which reading of this transcript is correct?',
            'Một object 0 byte được tải lên rồi đọc lại. Đo thật:' + code(
              'PutObject  Key="rong.bin"  Body=<0 byte>\n' +
              '  -> ETag "d41d8cd98f00b204e9800998ecf8427e"\n' +
              'HeadObject Key="rong.bin"\n' +
              '  -> ContentLength: 0, ETag "d41d8cd98f00b204e9800998ecf8427e"',
            ) + 'Cách đọc nào ĐÚNG với đoạn transcript này?',
          ),
          options: [
            B('An empty object is legal (size runs from 0 to 5 TB) and that hash is simply the MD5 of zero bytes, so seeing it means the upload wrote nothing at all', 'Object rỗng là hợp lệ (kích thước chạy từ 0 tới 5 TB) và cái mã băm ấy chỉ là MD5 của không byte nào, nên thấy nó nghĩa là lượt tải lên đã ghi vào con số không'),
            B('The upload failed and the service returned a placeholder ETag, which is why the object cannot be read back with GetObject afterwards', 'Lượt tải lên hỏng nên máy chủ trả về một ETag giữ chỗ, và đó là lý do sau đó không GetObject lại được object này'),
            B('Zero-byte objects are rejected by every S3-compatible service; the 200 here comes from MinIO being more permissive than R2 or S3', 'Object 0 byte bị mọi máy chủ S3-compatible từ chối; cái 200 ở đây là do MinIO dễ dãi hơn R2 hay S3'),
            B('That ETag is a per-bucket constant assigned to the first object ever written, so a second empty upload would receive a different one', 'ETag ấy là hằng số riêng của từng bucket, gán cho object đầu tiên từng được ghi, nên một lượt tải rỗng thứ hai sẽ nhận mã khác'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>d41d8cd98f00b204e9800998ecf8427e</code> is the MD5 of the empty string — you can reproduce it with <code>md5 &lt; /dev/null</code>. It is worth recognising on sight, because it is what a bucket full of truncated uploads looks like: 200 OK, an object exists, and it contains nothing. A reconciliation job that only checks "does the key exist" passes every one of them.',
            'Đã chạy thật. <code>d41d8cd98f00b204e9800998ecf8427e</code> là MD5 của chuỗi rỗng — bạn dựng lại được bằng <code>md5 &lt; /dev/null</code>. Đáng nhớ mặt nó, vì đây chính là hình dạng của một bucket đầy những lượt tải lên bị cụt: 200 OK, object có tồn tại, và bên trong không có gì. Một job đối soát chỉ hỏi "key này có không" sẽ cho qua sạch từng cái một.',
          ),
        }),

        mcq({
          prompt: B(
            'A migration renames keys by prepending a long tenant path. One key comes out 1025 bytes long. Measured:' + code(
              'PutObject Key=<1025 bytes>\n' +
              '  err.name : KeyTooLongError\n' +
              '  err.Code : KeyTooLongError\n' +
              '  HTTP     : 400\n' +
              '  message  : Your key is too long',
            ) + 'What is the limit, and what does it apply to?',
            'Một đợt migration đổi tên key bằng cách gắn thêm một đường dẫn tenant dài vào đầu. Một key hoá ra dài 1025 byte. Đo thật:' + code(
              'PutObject Key=<1025 byte>\n' +
              '  err.name : KeyTooLongError\n' +
              '  err.Code : KeyTooLongError\n' +
              '  HTTP     : 400\n' +
              '  message  : Your key is too long',
            ) + 'Giới hạn là bao nhiêu, và nó áp lên cái gì?',
          ),
          options: [
            B('1025 characters, and it applies to the visible characters of the key after the bucket name and any URL encoding have been stripped away', '1025 ký tự, và nó áp lên phần ký tự nhìn thấy được của key sau khi đã bỏ tên bucket và mọi phép mã hoá URL'),
            B('1024 bytes for the whole key, measured in UTF-8 bytes rather than characters — so accented Vietnamese and emoji eat the budget several times faster than ASCII does', '1024 byte cho cả key, đếm bằng byte UTF-8 chứ không bằng ký tự — nên chữ Việt có dấu và emoji ngốn ngân sách nhanh hơn ASCII vài lần'),
            B('1024 bytes per path segment between two slashes, so a key with five segments can safely reach 5120 bytes in total', '1024 byte cho mỗi đoạn nằm giữa hai dấu gạch chéo, nên một key năm đoạn có thể lên tới 5120 byte mà vẫn an toàn'),
            B('There is no protocol limit; 1024 is a soft quota per bucket that Cloudflare support can raise on request', 'Không có giới hạn nào ở tầng giao thức; 1024 chỉ là hạn mức mềm theo từng bucket mà bộ phận hỗ trợ Cloudflare nâng được khi có yêu cầu'),
          ],
          correct: 1,
          explanation: EX(
            'Lesson 0.2 gives the number and the transcript confirms the boundary: 1025 bytes is refused with <code>KeyTooLongError</code>. The word that matters is BYTES. <code>anh/nguoi-dung/hồ-sơ.jpg</code> costs more than its character count suggests, because every accented character is two or three UTF-8 bytes and every emoji is four. One warning from the same measurement: on this server a 1024-byte key made of a SINGLE segment was refused too, with a different error, so path length is not the only ceiling in play.',
            'Bài 0.2 cho con số và đoạn transcript xác nhận đúng mốc: 1025 byte bị từ chối với <code>KeyTooLongError</code>. Chữ quan trọng ở đây là BYTE. <code>anh/nguoi-dung/hồ-sơ.jpg</code> tốn nhiều hơn số ký tự của nó, vì mỗi chữ có dấu là hai đến ba byte UTF-8 còn mỗi emoji là bốn. Một cảnh báo lấy từ chính phép đo ấy: trên máy chủ này, một key 1024 byte gồm MỘT đoạn duy nhất cũng bị từ chối, với mã lỗi khác — nên độ dài cả key không phải trần duy nhất đang có hiệu lực.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO statements that are true of object storage but false of a POSIX filesystem.',
            'Chọn HAI phát biểu ĐÚNG với object storage nhưng SAI với một filesystem POSIX.',
          ),
          options: [
            B('Listing a "folder" is a prefix scan whose cost grows with the number of matching keys, so it is fine for hundreds and painful for millions', 'Liệt kê một "thư mục" là một lượt quét theo tiền tố, chi phí lớn dần theo số key khớp, nên ổn với hàng trăm và khổ sở với hàng triệu'),
            B('Permissions are set per object with an owner, a group and a mode, and a parent entry can revoke access to everything beneath it', 'Quyền được đặt cho từng object với chủ sở hữu, nhóm và chế độ, và một mục cha có thể thu hồi quyền truy cập vào mọi thứ bên dưới nó'),
            B('Changing one byte in the middle of a stored blob requires sending the whole new version, because there is no offset write', 'Đổi một byte ở giữa một blob đã lưu thì phải gửi lại cả bản mới, vì không có phép ghi theo độ lệch'),
            B('Moving an entry to a new name is a metadata-only operation that completes in constant time regardless of how much data sits under it', 'Chuyển một mục sang tên mới là thao tác chỉ đụng metadata, xong trong thời gian hằng số bất kể bên dưới có bao nhiêu dữ liệu'),
          ],
          correct: [0, 2],
          explanation: EX(
            'These are two of the three differences from Lesson 0.1. Option B describes POSIX <code>chmod</code>/<code>chown</code>, which object storage replaces with bucket policies and signed URLs. Option D describes a filesystem <code>mv</code>, which is exactly what object storage cannot do — a rename is COPY every object then DELETE every original, and its cost is proportional to the data underneath. The three differences produce three habits: keep keys in your database instead of listing, version by writing a new key instead of editing, and authorise with signed URLs instead of per-user permissions.',
            'Đây là hai trong ba khác biệt ở bài 0.1. Lựa chọn B mô tả <code>chmod</code>/<code>chown</code> của POSIX, thứ mà object storage thay bằng bucket policy và signed URL. Lựa chọn D mô tả lệnh <code>mv</code> của filesystem, đúng thứ object storage không làm được — đổi tên là COPY từng object rồi DELETE từng bản gốc, và chi phí tỉ lệ với lượng dữ liệu bên dưới. Ba khác biệt sinh ra ba thói quen: giữ key trong cơ sở dữ liệu thay vì liệt kê, đánh phiên bản bằng cách ghi key mới thay vì sửa, và cấp quyền bằng signed URL thay vì quyền theo từng người dùng.',
          ),
        }),

        // ── Chương 1 — S3 API ───────────────────────────────────────────
        mcq({
          prompt: B(
            'Somebody creates a zero-byte object whose key ends in a slash, to make a "folder" appear. Two listings, measured:' + code(
              'PutObject Key="thumuc/" Body=<0 bytes>  -> 200\n\n' +
              'ListObjectsV2 Prefix="thumuc"\n' +
              '  Contents:       [ { Key: "thumuc/", Size: 0 } ]\n' +
              '  CommonPrefixes: []\n\n' +
              'ListObjectsV2 Prefix="thumuc" Delimiter="/"\n' +
              '  Contents:       []\n' +
              '  CommonPrefixes: [ "thumuc/" ]',
            ) + 'Why does the object disappear from Contents in the second call?',
            'Có người tạo một object 0 byte với key kết thúc bằng dấu gạch chéo, để một "thư mục" hiện ra. Hai lượt liệt kê, đo thật:' + code(
              'PutObject Key="thumuc/" Body=<0 byte>  -> 200\n\n' +
              'ListObjectsV2 Prefix="thumuc"\n' +
              '  Contents:       [ { Key: "thumuc/", Size: 0 } ]\n' +
              '  CommonPrefixes: []\n\n' +
              'ListObjectsV2 Prefix="thumuc" Delimiter="/"\n' +
              '  Contents:       []\n' +
              '  CommonPrefixes: [ "thumuc/" ]',
            ) + 'Vì sao object ấy biến mất khỏi Contents ở lượt gọi thứ hai?',
          ),
          options: [
            B('The delimiter deleted it: asking for a grouped listing promotes the placeholder into a real folder entity and removes the underlying object', 'Delimiter đã xoá nó: xin một lượt liệt kê có gom nhóm sẽ nâng cái giữ chỗ thành một thư mục thật và bỏ object nằm dưới đi'),
            B('Zero-byte objects are hidden from Contents by default, and the delimiter merely turned on the grouped view that reveals them', 'Object 0 byte mặc định bị ẩn khỏi Contents, và delimiter chỉ bật lên chế độ xem gom nhóm để lộ chúng ra'),
            B('The delimiter groups every key whose remainder after the prefix contains a slash, and this key\'s remainder is exactly "/", so it is reported as a group name rather than as an object', 'Delimiter gom mọi key mà phần còn lại sau tiền tố có chứa dấu gạch chéo, và phần còn lại của key này đúng bằng "/", nên nó được báo dưới dạng tên nhóm chứ không phải một object'),
            B('The second call read a stale cache; running it again a few seconds later returns the object in Contents alongside the common prefix', 'Lượt gọi thứ hai đọc phải cache cũ; chạy lại vài giây sau sẽ thấy object nằm trong Contents cùng với common prefix'),
          ],
          correct: 2,
          explanation: EX(
            'The grouping rule is purely mechanical: take the key, cut off <code>Prefix</code>, look for the first <code>Delimiter</code> in what is left; if you find one, report everything up to and including it as a <code>CommonPrefixes</code> entry instead of listing the key. For <code>thumuc/</code> the remainder is <code>/</code>, so it is grouped — the object still exists and <code>HeadObject</code> still finds it. This is the practical reason placeholder "folder" objects are a bad idea: your own grouped listing hides them, and a cleanup script that walks CommonPrefixes never sees the bytes it should delete.',
            'Quy tắc gom nhóm hoàn toàn máy móc: lấy key, cắt bỏ <code>Prefix</code>, tìm <code>Delimiter</code> đầu tiên trong phần còn lại; tìm thấy thì báo cả đoạn tính tới dấu ấy dưới dạng một mục <code>CommonPrefixes</code> thay vì liệt kê key. Với <code>thumuc/</code> thì phần còn lại đúng bằng <code>/</code> nên nó bị gom — object vẫn tồn tại và <code>HeadObject</code> vẫn tìm ra. Đây chính là lý do thực tế để đừng tạo object "thư mục" giữ chỗ: chính lượt liệt kê có gom nhóm của bạn giấu chúng đi, và một script dọn dẹp đi theo CommonPrefixes sẽ không bao giờ nhìn thấy đống byte đáng lẽ phải xoá.',
          ),
        }),

        mcq({
          prompt: B(
            'To avoid writing a pagination loop, a developer raises MaxKeys. Measured against a bucket holding 1006 keys:' + code(
              'ListObjectsV2 MaxKeys=1500\n' +
              '  KeyCount    : 1000\n' +
              '  IsTruncated : true\n' +
              '  MaxKeys     : 1500          # dung vay, may chu vong lai con so ban XIN',
            ) + 'What happened, and what is the consequence for the code?',
            'Để khỏi phải viết vòng lặp phân trang, một lập trình viên nâng MaxKeys lên. Đo thật trên một bucket chứa 1006 key:' + code(
              'ListObjectsV2 MaxKeys=1500\n' +
              '  KeyCount    : 1000\n' +
              '  IsTruncated : true\n' +
              '  MaxKeys     : 1500          # dung vay, may chu vong lai con so ban XIN',
            ) + 'Chuyện gì đã xảy ra, và hệ quả với đoạn mã là gì?',
          ),
          options: [
            B('The bucket happens to hold exactly 1000 readable keys and the other six are in a state the listing skips, so raising MaxKeys further would return all 1006', 'Bucket tình cờ chỉ có đúng 1000 key đọc được, sáu cái còn lại đang ở trạng thái mà lượt liệt kê bỏ qua, nên nâng MaxKeys thêm nữa là đủ cả 1006'),
            B('The service caps a page at 1000 no matter what you ask for; it echoes your MaxKeys back but sets IsTruncated, so any code that trusts a single call silently loses everything past the first page', 'Máy chủ chốt mỗi trang ở 1000 dù bạn xin bao nhiêu; nó vọng lại MaxKeys của bạn nhưng bật IsTruncated, nên mọi đoạn mã tin vào một lượt gọi duy nhất đều âm thầm mất sạch phần sau trang đầu'),
            B('MaxKeys above 1000 is invalid and the request was rejected; KeyCount 1000 is a stale value left over from a previous successful call on the same client', 'MaxKeys lớn hơn 1000 là không hợp lệ nên request đã bị từ chối; KeyCount 1000 là giá trị cũ còn sót lại từ một lượt gọi thành công trước đó trên cùng client'),
            B('MaxKeys counts megabytes of response body rather than keys, so 1500 means "up to 1500 MB" and the 1000 keys already filled that budget', 'MaxKeys đếm megabyte thân phản hồi chứ không đếm key, nên 1500 nghĩa là "tối đa 1500 MB" và 1000 key đã lấp đầy ngân sách ấy'),
          ],
          correct: 1,
          explanation: EX(
            'Measured. 1000 is a hard server-side ceiling on one page, and the response politely echoes the 1500 you asked for, which is exactly how this bug hides in a code review. The only correct shape is the loop: keep calling with <code>ContinuationToken = NextContinuationToken</code> until it comes back undefined. On the same bucket, paging <code>Prefix="users/"</code> to exhaustion returned 1003 keys over 2 pages, while one unpaged call returned 1000 and looked complete.',
            'Đo thật. 1000 là trần cứng phía máy chủ cho một trang, và phản hồi lịch sự vọng lại đúng con số 1500 bạn xin — chính chỗ ấy làm lỗi này lọt qua review. Hình dạng đúng duy nhất là vòng lặp: gọi tiếp với <code>ContinuationToken = NextContinuationToken</code> cho tới khi nó trả về undefined. Trên cùng bucket ấy, đi hết trang với <code>Prefix="users/"</code> cho ra 1003 key qua 2 trang, còn một lượt gọi không phân trang trả 1000 key và trông như đã đủ.',
          ),
        }),

        mcq({
          prompt: B(
            'A grouped listing with a small page size, measured on a bucket whose keys live under <code>anh/</code>, <code>users/</code> and <code>users-cu/</code>:' + code(
              'ListObjectsV2 Delimiter="/" MaxKeys=2\n' +
              '  Contents       : []\n' +
              '  CommonPrefixes : [ "anh/", "users-cu/" ]\n' +
              '  KeyCount       : 2\n' +
              '  IsTruncated    : true',
            ) + 'What does KeyCount count here?',
            'Một lượt liệt kê có gom nhóm với trang nhỏ, đo trên một bucket có key nằm dưới <code>anh/</code>, <code>users/</code> và <code>users-cu/</code>:' + code(
              'ListObjectsV2 Delimiter="/" MaxKeys=2\n' +
              '  Contents       : []\n' +
              '  CommonPrefixes : [ "anh/", "users-cu/" ]\n' +
              '  KeyCount       : 2\n' +
              '  IsTruncated    : true',
            ) + 'Ở đây KeyCount đếm cái gì?',
          ),
          options: [
            B('Only the entries in Contents, which is why it should have been 0; the 2 shown is a quirk of this particular server and other services report 0', 'Chỉ đếm các mục trong Contents, nên đáng lẽ phải là 0; con số 2 ở đây là nét riêng của máy chủ này, dịch vụ khác báo 0'),
            B('The number of distinct buckets touched by the request, which is 2 because the delimiter split the scan across two internal partitions', 'Số bucket khác nhau mà request chạm vào, bằng 2 vì delimiter chia lượt quét ra hai phân vùng nội bộ'),
            B('Contents plus CommonPrefixes together, so a grouped listing can fill an entire page with group names and return not one object', 'Contents cộng CommonPrefixes lại, nên một lượt liệt kê có gom nhóm có thể lấp đầy cả một trang bằng tên nhóm mà không trả về nổi một object nào'),
            B('The number of keys the server had to read internally to build the answer, which is why it is larger than the two arrays combined would suggest', 'Số key máy chủ phải đọc bên trong để dựng ra câu trả lời, và vì thế nó lớn hơn con số mà hai mảng cộng lại gợi ra'),
          ],
          correct: 2,
          explanation: EX(
            'Measured: two common prefixes, zero objects, <code>KeyCount: 2</code>. Group names are charged against the page budget exactly like keys. That has a practical consequence for any "walk the whole bucket" loop: with a delimiter, a page can come back with an empty <code>Contents</code> and still be truncated, so a loop written as <code>while (res.Contents.length)</code> stops on the very first page and reports the bucket as empty. Drive the loop from <code>NextContinuationToken</code>, never from the length of one array.',
            'Đo thật: hai common prefix, không object nào, <code>KeyCount: 2</code>. Tên nhóm bị tính vào ngân sách trang y hệt key. Điều đó có hệ quả thực tế cho mọi vòng lặp kiểu "đi hết bucket": khi có delimiter, một trang có thể trả về <code>Contents</code> rỗng mà vẫn còn bị cắt, nên vòng lặp viết thành <code>while (res.Contents.length)</code> sẽ dừng ngay ở trang đầu và báo bucket rỗng. Hãy lái vòng lặp bằng <code>NextContinuationToken</code>, đừng bao giờ lái bằng độ dài của một mảng.',
          ),
        }),

        mcq({
          prompt: B(
            'A nightly scan over a million-key bucket crashes at key <code>users/0500.txt</code>. The operator does not want to start again from the top. Measured:' + code(
              'ListObjectsV2 Prefix="users/" StartAfter="users/0500.txt" MaxKeys=3\n' +
              '  Contents: [ "users/0501.txt", "users/0502.txt", "users/0503.txt" ]',
            ) + 'How does <code>StartAfter</code> differ from <code>ContinuationToken</code>, and when do you want each?',
            'Một lượt quét ban đêm trên bucket triệu key chết ở key <code>users/0500.txt</code>. Người vận hành không muốn quét lại từ đầu. Đo thật:' + code(
              'ListObjectsV2 Prefix="users/" StartAfter="users/0500.txt" MaxKeys=3\n' +
              '  Contents: [ "users/0501.txt", "users/0502.txt", "users/0503.txt" ]',
            ) + '<code>StartAfter</code> khác <code>ContinuationToken</code> chỗ nào, và khi nào thì dùng cái nào?',
          ),
          options: [
            B('They are the same field under two names kept for backwards compatibility, so either value can be passed to either parameter with identical results', 'Hai cái là cùng một trường mang hai tên, giữ lại để tương thích ngược, nên truyền giá trị nào vào tham số nào cũng cho kết quả y hệt'),
            B('<code>StartAfter</code> is a KEY you choose, so a crashed scan resumes from the last key it finished; <code>ContinuationToken</code> is an opaque value the server issues, valid only for continuing that exact listing', '<code>StartAfter</code> là một KEY do bạn chọn, nên một lượt quét chết có thể đi tiếp từ key cuối cùng nó xử lý xong; <code>ContinuationToken</code> là một giá trị mờ do máy chủ cấp, chỉ dùng được để đi tiếp đúng lượt liệt kê ấy'),
            B('<code>StartAfter</code> skips a number of keys given as a count, so passing a key name works only because the server parses it as a numeric offset', '<code>StartAfter</code> bỏ qua một số lượng key cho dưới dạng con số, nên truyền vào một tên key chỉ chạy được vì máy chủ diễn giải nó thành một độ lệch dạng số'),
            B('<code>StartAfter</code> is inclusive of the key you name while <code>ContinuationToken</code> is exclusive, which is why the transcript above starts at 0500 rather than 0501', '<code>StartAfter</code> bao gồm cả key bạn nêu tên còn <code>ContinuationToken</code> thì loại trừ, và đó là lý do đoạn transcript trên bắt đầu từ 0500 chứ không phải 0501'),
          ],
          correct: 1,
          explanation: EX(
            'Measured, and the transcript settles the inclusive question too: naming <code>users/0500.txt</code> returns 0501 onward, so it is exclusive. The practical difference is durability. A continuation token is a server-side bookmark for one listing and it is not something you want to write into a job row and reuse tomorrow. A key is yours: store "the last key I finished" in your database and any future run — a different process, a different day — can resume from it. That is the shape a reconciliation job wants, and it is also why splitting a big scan by date prefix beats holding one long-lived token.',
            'Đo thật, và đoạn transcript giải luôn câu hỏi bao gồm hay loại trừ: nêu <code>users/0500.txt</code> thì nhận về từ 0501 trở đi, vậy là loại trừ. Khác biệt thực tế nằm ở độ bền. Continuation token là một cái đánh dấu phía máy chủ cho đúng một lượt liệt kê, và nó không phải thứ bạn muốn ghi vào một hàng dữ liệu của job rồi mai dùng lại. Một cái key thì là của bạn: lưu "key cuối cùng tôi xử lý xong" vào cơ sở dữ liệu và mọi lượt chạy sau — tiến trình khác, ngày khác — đều đi tiếp được từ đó. Đó đúng là hình dạng mà một job đối soát cần, và cũng là lý do chia một lượt quét lớn theo tiền tố ngày tháng hơn hẳn việc ôm một token sống dai.',
          ),
        }),

        mcq({
          prompt: B(
            'A cleanup job hands its whole candidate list to one batch delete. Measured:' + code(
              'DeleteObjects with 1001 keys\n' +
              '  err.Code : MalformedXML   HTTP 400\n' +
              '  message  : The XML you provided was not well-formed or did not\n' +
              '             validate against our published schema\n\n' +
              'DeleteObjects with the first 1000 of the same keys\n' +
              '  -> 200',
            ) + 'What is the bug, and why is the error message so misleading?',
            'Một job dọn dẹp đưa cả danh sách ứng viên vào một lượt xoá theo lô. Đo thật:' + code(
              'DeleteObjects voi 1001 key\n' +
              '  err.Code : MalformedXML   HTTP 400\n' +
              '  message  : The XML you provided was not well-formed or did not\n' +
              '             validate against our published schema\n\n' +
              'DeleteObjects voi 1000 key dau tien trong cung danh sach\n' +
              '  -> 200',
            ) + 'Lỗi nằm ở đâu, và vì sao câu thông báo lại đánh lạc hướng đến thế?',
          ),
          options: [
            B('One of the extra key names contains a character the XML serialiser could not encode, so the fix is to escape key names before building the request body', 'Một trong các tên key dư có ký tự mà bộ tuần tự XML không mã hoá được, nên cách sửa là thoát các tên key trước khi dựng thân request'),
            B('The SDK version in use serialises arrays over 1000 entries incorrectly; upgrading the SDK removes the limit entirely', 'Phiên bản SDK đang dùng tuần tự hoá sai với mảng trên 1000 phần tử; nâng cấp SDK là hết giới hạn'),
            B('The request body exceeded the maximum size in bytes, which happens to fall near 1000 keys for these particular names; shorter key names would let the same call carry more', 'Thân request vượt quá kích thước tối đa tính bằng byte, mà mốc ấy tình cờ rơi vào quãng 1000 key với chính bộ tên này; tên key ngắn hơn thì cùng lượt gọi ấy chở được nhiều hơn'),
            B('The batch is capped at 1000 keys per call and going over is reported as a schema violation rather than a count error, so the fix is to chunk the array and send several calls', 'Một lượt gọi chỉ nhận tối đa 1000 key và vượt qua thì bị báo là vi phạm lược đồ chứ không phải lỗi số lượng, nên cách sửa là chia mảng thành từng lô và gửi nhiều lượt')
          ],
          correct: 3,
          explanation: EX(
            'Measured on both sides of the boundary. Lesson 1.2 gives the number — up to 1000 keys in one <code>DeleteObjects</code> — and the point of this question is what the violation LOOKS like: <code>MalformedXML</code> sends people hunting for an encoding bug in their key names, and they find one, because there is always a key with a space or an accent in it somewhere. Read the count first. The same trap shape appears whenever a protocol limit surfaces as a parse error rather than as its own code.',
            'Đã đo ở cả hai phía của cái mốc. Bài 1.2 cho con số — tối đa 1000 key trong một lệnh <code>DeleteObjects</code> — và ý của câu này là chuyện vi phạm ấy TRÔNG NHƯ THẾ NÀO: <code>MalformedXML</code> đẩy người ta đi săn một lỗi mã hoá trong tên key, và họ tìm ra thật, vì ở đâu đó bao giờ cũng có một cái key mang dấu cách hay chữ có dấu. Hãy đếm số lượng trước. Cùng hình dạng bẫy ấy xuất hiện mỗi khi một giới hạn của giao thức lộ ra dưới dạng lỗi phân tích cú pháp thay vì một mã lỗi của riêng nó.',
          ),
        }),

        mcq({
          prompt: B(
            'A resumable uploader collects part ETags into a map and completes the upload by iterating the map. Measured result:' + code(
              'CompleteMultipartUpload Parts=[ {PartNumber:2,...}, {PartNumber:1,...} ]\n' +
              '  err.Code : InvalidPartOrder   HTTP 400\n' +
              '  message  : The list of parts was not in ascending order.\n' +
              '             The parts list must be specified in order by part number.',
            ) + 'What is the fix?',
            'Một bộ tải lên có khả năng tiếp tục gom ETag của các phần vào một map rồi hoàn tất lượt tải bằng cách duyệt map đó. Kết quả đo được:' + code(
              'CompleteMultipartUpload Parts=[ {PartNumber:2,...}, {PartNumber:1,...} ]\n' +
              '  err.Code : InvalidPartOrder   HTTP 400\n' +
              '  message  : The list of parts was not in ascending order.\n' +
              '             The parts list must be specified in order by part number.',
            ) + 'Cách sửa là gì?',
          ),
          options: [
            B('Re-upload the parts in ascending order, because the server stores them in arrival order and the completion list must match the order they were written', 'Tải lại các phần theo thứ tự tăng dần, vì máy chủ lưu chúng theo thứ tự đến và danh sách hoàn tất phải khớp thứ tự chúng được ghi'),
            B('Sort the completion list by PartNumber before sending it; the parts themselves may be uploaded in any order and in parallel, only the final list has to be ascending', 'Sắp danh sách hoàn tất theo PartNumber trước khi gửi; bản thân các phần tải lên theo thứ tự nào, song song ra sao cũng được, chỉ danh sách cuối cùng mới phải tăng dần'),
            B('Drop the PartNumber field entirely and send only the ETags, letting the server infer the order from the hashes it already holds', 'Bỏ hẳn trường PartNumber và chỉ gửi các ETag, để máy chủ tự suy ra thứ tự từ những mã băm nó đang giữ'),
            B('Abort the upload and switch to a single PutObject, because a multipart upload cannot be completed once any part has been retried out of order', 'Huỷ lượt tải và chuyển sang một lệnh PutObject duy nhất, vì một lượt multipart không thể hoàn tất được nữa một khi có phần nào bị thử lại lệch thứ tự'),
          ],
          correct: 1,
          explanation: EX(
            'Measured. Parallel part uploads are the entire point of multipart, so the protocol cannot care what order the bytes arrived in — it cares that the manifest you send at the end is sorted. A <code>Map</code> in JavaScript preserves INSERTION order, which for a retrying uploader is the order parts finished, not the order they are numbered. One <code>.sort((a,b) =&gt; a.PartNumber - b.PartNumber)</code> before <code>CompleteMultipartUpload</code> is the whole fix, and it is the kind of bug that only appears under a slow network.',
            'Đo thật. Tải các phần song song chính là toàn bộ lý do multipart tồn tại, nên giao thức không thể quan tâm byte đến theo thứ tự nào — nó quan tâm bản kê bạn gửi ở bước cuối có được sắp hay không. Một <code>Map</code> trong JavaScript giữ thứ tự CHÈN VÀO, mà với một bộ tải lên có thử lại thì đó là thứ tự các phần xong, không phải thứ tự số hiệu của chúng. Một lệnh <code>.sort((a,b) =&gt; a.PartNumber - b.PartNumber)</code> trước <code>CompleteMultipartUpload</code> là toàn bộ cách sửa, và đây đúng kiểu lỗi chỉ lộ ra khi mạng chậm.',
          ),
        }),

        mcq({
          prompt: B(
            'An upload skips part numbers 2, 3 and 4 after they fail and are re-sent under fresh numbers. It completes successfully. Measured:' + code(
              'UploadPart PartNumber=1  (5 MiB)  -> 200\n' +
              'UploadPart PartNumber=5  (2 MiB)  -> 200\n' +
              'CompleteMultipartUpload Parts=[1, 5]\n' +
              '  -> ETag "caab69f313bed25c163d5c29d0b7f740-2"',
            ) + 'What does the number after the dash mean?',
            'Một lượt tải lên bỏ qua số hiệu phần 2, 3 và 4 sau khi chúng hỏng và được gửi lại dưới số hiệu mới. Nó hoàn tất thành công. Đo thật:' + code(
              'UploadPart PartNumber=1  (5 MiB)  -> 200\n' +
              'UploadPart PartNumber=5  (2 MiB)  -> 200\n' +
              'CompleteMultipartUpload Parts=[1, 5]\n' +
              '  -> ETag "caab69f313bed25c163d5c29d0b7f740-2"',
            ) + 'Con số sau dấu gạch ngang nghĩa là gì?',
          ),
          options: [

            B('How many parts the finished object was assembled from — two — regardless of which numbers those parts carried, and the gaps in numbering cost nothing', 'Object hoàn chỉnh được ghép từ mấy phần — ở đây là hai — bất kể các phần ấy mang số hiệu nào, và những khoảng trống trong dãy số không tốn gì cả'),
            B('The size of the largest part in MiB rounded down, which for the 2 MiB second part gives 2', 'Kích thước của phần lớn nhất tính theo MiB làm tròn xuống, với phần thứ hai 2 MiB thì ra 2'),            B('The highest part number used, which here would be 5; the 2 shown means the server renumbered the parts during completion', 'Số hiệu phần lớn nhất được dùng, ở đây là 5; con số 2 hiện ra nghĩa là máy chủ đã đánh số lại các phần lúc hoàn tất'),
            B('The number of retries the upload needed before it succeeded, recorded by the server so a verification pass can spot unreliable clients', 'Số lần lượt tải phải thử lại trước khi thành công, được máy chủ ghi lại để một lượt kiểm chứng có thể nhận ra client thiếu tin cậy')
          ],
          correct: 0,
          explanation: EX(
            'Measured, and reproduced by hand: <code>md5(md5(part1) ++ md5(part5))</code> in hex, plus <code>-2</code>, equals the ETag the server returned byte for byte. Part numbers only have to be in 1…10000 and ascending in the completion list; they need not be contiguous, and the suffix counts parts, not numbers. Practically this means a client is free to skip numbers after a failure, and it also means the suffix tells a verification script how the object was assembled — the basis of the MP-DIFF category in a migration audit.',
            'Đo thật, và dựng lại được bằng tay: <code>md5(md5(phần 1) ++ md5(phần 5))</code> ở dạng hex, cộng <code>-2</code>, ra đúng từng byte cái ETag máy chủ trả về. Số hiệu phần chỉ cần nằm trong 1…10000 và tăng dần trong danh sách hoàn tất; chúng không cần liên tục, và hậu tố đếm số PHẦN chứ không đếm số hiệu. Về mặt thực hành, điều này nghĩa là một client được phép bỏ số sau khi hỏng, và cũng nghĩa là cái hậu tố ấy nói cho một script kiểm chứng biết object được ghép ra sao — nền tảng của hạng mục MP-DIFF trong một lượt đối soát migration.',
          ),
        }),

        mcq({
          prompt: B(
            'A 2 MiB file goes through the SDK Upload helper, which chooses multipart. Measured:' + code(
              'UploadPart PartNumber=1 (2 MiB)\n' +
              '  -> part ETag  "bf52955b454974e73c3e2694bd7207c4"\n' +
              'CompleteMultipartUpload Parts=[1]\n' +
              '  -> object ETag "62779858262432b238005e27d389b376-1"\n\n' +
              'md5 of the same 2 MiB, computed locally: bf52955b454974e73c3e2694bd7207c4',
            ) + 'A dedup job keyed on "ETag equals the MD5 we computed" now misses this file. What is the correct lesson?',
            'Một file 2 MiB đi qua lớp Upload của SDK, và lớp này chọn multipart. Đo thật:' + code(
              'UploadPart PartNumber=1 (2 MiB)\n' +
              '  -> ETag cua phan  "bf52955b454974e73c3e2694bd7207c4"\n' +
              'CompleteMultipartUpload Parts=[1]\n' +
              '  -> ETag cua object "62779858262432b238005e27d389b376-1"\n\n' +
              'md5 cua dung 2 MiB do, tinh tai may: bf52955b454974e73c3e2694bd7207c4',
            ) + 'Một job khử trùng lặp dựa trên "ETag bằng MD5 ta tính được" giờ bỏ sót file này. Bài học đúng là gì?',
          ),
          options: [
            B('Even a single-part multipart upload gets the <code>-N</code> suffix and a hash-of-hashes, so "the object is small" never guarantees ETag equals MD5 — compute your own digest and store it', 'Ngay cả một lượt multipart chỉ có đúng một phần cũng nhận hậu tố <code>-N</code> và một mã băm của các mã băm, nên "object này nhỏ" không bao giờ bảo đảm ETag bằng MD5 — hãy tự tính mã tóm tắt của bạn và lưu lại'),
            B('The suffix appears only because the part was under 5 MiB; uploading the same bytes as a single 5 MiB-plus part through multipart would have produced a plain MD5', 'Hậu tố xuất hiện chỉ vì phần này dưới 5 MiB; tải đúng chỗ byte ấy thành một phần từ 5 MiB trở lên qua multipart thì sẽ ra một MD5 thuần'),
            B('The part ETag and the object ETag disagree because the SDK compressed the body on the wire, so disabling compression restores the equality', 'ETag của phần và ETag của object lệch nhau vì SDK nén thân dữ liệu trên đường truyền, tắt nén là hai cái bằng nhau trở lại'),
            B('The object ETag is a random identifier for multipart objects and carries no information at all, so a dedup job should compare Content-Length instead', 'ETag của object multipart là một mã định danh ngẫu nhiên, không mang thông tin gì, nên một job khử trùng lặp nên so Content-Length thay vào đó'),
          ],
          correct: 0,
          explanation: EX(
            'This is the measurement that contradicts a natural reading of Lessons 0.2 and 1.3. "Multipart ETag is HASH-N where N is the part count" is true, but N can be 1 — and the hash is <code>md5</code> of the concatenated binary part digests, not <code>md5</code> of the content. So <code>62779858…-1</code> and <code>bf52955b…</code> describe the same 2 MiB. Since the SDK helper decides on its own when to go multipart, you cannot predict from the file size which form you will get. The habit Lesson 0.2 asks for is the safe one: hash client-side, store the digest in your database, and never treat the ETag as a content hash.',
            'Đây là phép đo mâu thuẫn với cách đọc tự nhiên của bài 0.2 và 1.3. Câu "ETag multipart là HASH-N với N là số part" thì đúng, nhưng N có thể bằng 1 — và cái hash ấy là <code>md5</code> của chuỗi các mã tóm tắt nhị phân của từng phần nối lại, không phải <code>md5</code> của nội dung. Nên <code>62779858…-1</code> và <code>bf52955b…</code> cùng mô tả một khối 2 MiB. Vì lớp Upload của SDK tự quyết khi nào chuyển sang multipart, bạn không đoán được từ kích thước file rằng mình sẽ nhận dạng nào. Thói quen bài 0.2 yêu cầu mới là thứ an toàn: băm ở phía client, lưu mã tóm tắt vào cơ sở dữ liệu, và đừng bao giờ coi ETag là mã băm nội dung.',
          ),
        }),

        mcq({
          prompt: B(
            'An object is overwritten at the same key. Measured before and after:' + code(
              "before: ContentLength 26, ETag \"c3fcd3d76192e4007dfb496cca67e13b\", body 'abcdefghijklmnopqrstuvwxyz'\n" +
              "PutObject same Key, Body='XYZ'\n" +
              "after : ContentLength  3, ETag \"e65075d550f9b5bf9992fa1d71a131be\", body 'XYZ'",
            ) + 'What is the state of the bucket now, on a bucket with versioning off?',
            'Một object bị ghi đè tại cùng key. Đo trước và sau:' + code(
              "truoc: ContentLength 26, ETag \"c3fcd3d76192e4007dfb496cca67e13b\", body 'abcdefghijklmnopqrstuvwxyz'\n" +
              "PutObject cung Key, Body='XYZ'\n" +
              "sau  : ContentLength  3, ETag \"e65075d550f9b5bf9992fa1d71a131be\", body 'XYZ'",
            ) + 'Trạng thái của bucket bây giờ ra sao, với một bucket đã tắt versioning?',
          ),
          options: [
            B('The 26 bytes are still billed for 30 days as a soft-deleted previous version, and a support request can restore them within that window', '26 byte cũ vẫn bị tính tiền 30 ngày dưới dạng một phiên bản trước đã xoá mềm, và một yêu cầu hỗ trợ có thể khôi phục chúng trong khoảng đó'),
            B('The old bytes are gone: an overwrite is an atomic full replace with no history, which is why versioning by writing a NEW key is the pattern this repo uses', 'Số byte cũ mất hẳn: ghi đè là một lượt thay toàn phần nguyên tử không giữ lịch sử, và đó là lý do kho này đánh phiên bản bằng cách ghi một key MỚI'),
            B('The two versions coexist and the newest wins on read; the old one is reachable by passing an earlier timestamp to GetObject', 'Hai phiên bản cùng tồn tại và bản mới nhất thắng khi đọc; bản cũ vẫn lấy được bằng cách truyền một mốc thời gian trước đó vào GetObject'),
            B('The write was rejected as a shrinking update and the object still holds 26 bytes; the ETag changed only because the metadata was touched', 'Lượt ghi bị từ chối vì là một cập nhật làm nhỏ đi và object vẫn giữ 26 byte; ETag đổi chỉ vì metadata bị đụng tới'),
          ],
          correct: 1,
          explanation: EX(
            'Measured. With versioning off — which is how this repo runs, per Lesson 0.2 — an overwrite is destructive and instant, and both the ETag and the length change to describe the new content. Two consequences worth carrying: a bug that writes an empty buffer to an existing key destroys the original with a 200 OK, and any CDN in front is now serving stale bytes until the cache expires, which is the argument for a versioned key (<code>avatar-1234567890.jpg</code>) rather than a stable one.',
            'Đo thật. Với versioning tắt — đúng cách kho này đang chạy, theo bài 0.2 — ghi đè là thao tác phá huỷ và tức thì, và cả ETag lẫn độ dài đều đổi để mô tả nội dung mới. Hai hệ quả đáng mang theo: một lỗi ghi buffer rỗng vào key có sẵn sẽ phá bản gốc kèm một cái 200 OK, và CDN đứng trước đó giờ đang phục vụ byte cũ cho tới khi cache hết hạn — đúng lý lẽ để dùng key có phiên bản (<code>avatar-1234567890.jpg</code>) thay vì một key cố định.',
          ),
        }),

        // ── Chương 2 — R2 specifics ─────────────────────────────────────
        mcq({
          prompt: B(
            'This repo builds its client lazily. Which line in the snippet is the R2-specific one, and what does it do?' + code(
              'cachedClient = new S3Client({\n' +
              "  region: 'auto',\n" +
              '  endpoint: config.r2.endpoint,\n' +
              '  credentials: { accessKeyId, secretAccessKey },\n' +
              '  forcePathStyle: false,\n' +
              '});',
            ),
            'Kho này dựng client theo kiểu lười. Dòng nào trong đoạn mã là dòng riêng của R2, và nó làm gì?' + code(
              'cachedClient = new S3Client({\n' +
              "  region: 'auto',\n" +
              '  endpoint: config.r2.endpoint,\n' +
              '  credentials: { accessKeyId, secretAccessKey },\n' +
              '  forcePathStyle: false,\n' +
              '});',
            ),
          ),
          options: [
            B('<code>credentials</code> — R2 tokens are long-lived while S3 uses rotating STS credentials, so this field must be re-read from the environment on every single call', '<code>credentials</code> — token R2 sống lâu còn S3 dùng thông tin xác thực STS xoay vòng, nên trường này phải được đọc lại từ biến môi trường ở mỗi lượt gọi'),
            B('<code>endpoint</code> — setting it switches the SDK into R2 mode, which is what makes <code>region</code> optional and enables custom domains', '<code>endpoint</code> — đặt nó là chuyển SDK sang chế độ R2, và chính điều đó làm <code>region</code> thành tuỳ chọn và bật được custom domain'),
            B('<code>forcePathStyle: false</code> — it asks for virtual-hosted addressing (<code>bucket.endpoint/key</code> rather than <code>endpoint/bucket/key</code>), which is the form a custom domain can be mapped onto', '<code>forcePathStyle: false</code> — nó xin kiểu địa chỉ virtual-hosted (<code>bucket.endpoint/key</code> thay vì <code>endpoint/bucket/key</code>), đúng dạng mà một custom domain ánh xạ vào được'),
            B('<code>region: &quot;auto&quot;</code> — it makes the SDK skip signing entirely, which is why R2 does not need a region in the credential scope', '<code>region: &quot;auto&quot;</code> — nó làm SDK bỏ hẳn bước ký, và đó là lý do R2 không cần region trong phạm vi thông tin xác thực'),
          ],
          correct: 2,
          explanation: EX(
            'Lesson 2.2 names both quirks, and this question is about the second. Path style puts the bucket in the path (<code>endpoint/bucket/key</code>); virtual-hosted puts it in the hostname (<code>bucket.endpoint/key</code>), and only the hostname form can be replaced by <code>media.cuongthai.com</code>. <code>region: &quot;auto&quot;</code> is the other quirk, but it does not disable signing — the region string still goes into the SigV4 credential scope, which is precisely why an S3 client copied over with <code>us-east-1</code> keeps working against R2 and then confuses everyone.',
            'Bài 2.2 nêu cả hai nét riêng, và câu này hỏi cái thứ hai. Path style đặt bucket trong đường dẫn (<code>endpoint/bucket/key</code>); virtual-hosted đặt nó trong tên máy chủ (<code>bucket.endpoint/key</code>), và chỉ dạng tên máy chủ mới thay được bằng <code>media.cuongthai.com</code>. <code>region: &quot;auto&quot;</code> là nét riêng còn lại, nhưng nó không tắt bước ký — chuỗi region vẫn đi vào phạm vi thông tin xác thực của SigV4, và chính vì thế một client S3 chép sang với <code>us-east-1</code> vẫn chạy được với R2 rồi làm mọi người bối rối.',
          ),
        }),

        mcq({
          prompt: B(
            'A feed serves 240 million image reads a month through the custom domain. The Cloudflare cache hit ratio measured on that hostname is 95%. Using the published R2 rate of $0.36 per million Class B operations, what does the read side cost, and why?',
            'Một bảng tin phục vụ 240 triệu lượt đọc ảnh mỗi tháng qua custom domain. Tỉ lệ trúng cache Cloudflare đo trên tên miền ấy là 95%. Dùng đơn giá công bố của R2 là 0,36 $ mỗi triệu thao tác Class B, phía đọc tốn bao nhiêu, và vì sao?',
          ),
          options: [
            B('$86.40 — every read is a Class B operation regardless of caching, because the CDN still has to revalidate each object against the bucket before serving it', '86,40 $ — mọi lượt đọc đều là một thao tác Class B bất kể cache, vì CDN vẫn phải kiểm lại từng object với bucket trước khi phục vụ'),
            B('$0 — reads through a custom domain are served by the CDN and never billed as bucket operations, which is what "zero egress" means on R2', '0 $ — đọc qua custom domain do CDN phục vụ và không bao giờ bị tính như thao tác lên bucket, đó chính là nghĩa của "zero egress" trên R2'),
            B('$4.32 — only the 5% that miss the cache reach the bucket, so 12 million Class B operations are billed and the other 228 million never touch the origin', '4,32 $ — chỉ 5% trượt cache mới về tới bucket, nên 12 triệu thao tác Class B bị tính còn 228 triệu lượt kia không hề chạm tới gốc'),
            B('$86.40 plus egress on the 5% that miss, because a cache miss is billed as both a Class B read and a byte transfer out of the bucket', '86,40 $ cộng thêm egress cho 5% trượt cache, vì một lượt trượt cache bị tính cả một lượt đọc Class B lẫn một lượt chuyển byte ra khỏi bucket'),
          ],
          correct: 2,
          explanation: EX(
            'The arithmetic: 240M × 5% = 12M misses, 12 / 1 × $0.36 = $4.32, and Lesson 2.1 states the mechanism — "90% Class B via CDN cache HIT anyway = $0" — because a hit is answered at the edge and never becomes a bucket operation. Two of the wrong answers are worth naming. Option A assumes revalidation, which is exactly what <code>immutable</code> and a long <code>max-age</code> are for. Option B overshoots in the other direction: caching is not total, misses are real operations, and this is why the cache hit ratio is a cost metric and not just a latency metric.',
            'Phép tính: 240 triệu × 5% = 12 triệu lượt trượt, 12 / 1 × 0,36 $ = 4,32 $, và bài 2.1 nêu đúng cơ chế — "90% Class B qua CDN cache HIT anyway = 0 $" — vì một lượt trúng cache được trả lời ngay tại biên và không bao giờ thành một thao tác lên bucket. Hai đáp án sai đáng gọi tên. Lựa chọn A giả định có revalidate, mà đó đúng là thứ <code>immutable</code> và một <code>max-age</code> dài sinh ra để khỏi phải làm. Lựa chọn B thì bắn quá đà theo chiều ngược lại: cache không phủ hết, các lượt trượt là thao tác thật, và đó là lý do tỉ lệ trúng cache là một chỉ số CHI PHÍ chứ không chỉ là chỉ số độ trễ.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO things R2 still bills for even though egress to the internet is $0.',
            'Chọn HAI thứ R2 VẪN tính tiền dù egress ra internet là 0 $.',
          ),
          options: [
            B('Class A operations — every PutObject, CopyObject, ListObjectsV2 and UploadPart, at $4.50 per million', 'Thao tác Class A — mỗi PutObject, CopyObject, ListObjectsV2 và UploadPart, giá 4,50 $ mỗi triệu'),
            B('Bytes served to a browser through the custom domain, which are billed at a reduced CDN rate rather than the S3 egress rate', 'Số byte phục vụ ra trình duyệt qua custom domain, tính theo đơn giá CDN đã giảm chứ không theo đơn giá egress của S3'),
            B('Stored bytes per GB-month, including the parts of multipart uploads that were never completed', 'Số byte lưu trữ theo GB-tháng, kể cả các phần của những lượt multipart chưa bao giờ hoàn tất'),
            B('A per-bucket hourly fee for keeping a custom domain attached and its TLS certificate renewed', 'Một khoản phí theo giờ cho mỗi bucket để giữ custom domain gắn vào và gia hạn chứng chỉ TLS của nó'),
          ],
          correct: [0, 2],
          explanation: EX(
            'Lesson 7.1 lists five line items and R2 removes exactly one of them. Storage and both operation classes remain, which is why Lesson 2.1 warns against reading "R2 is free" out of "egress is free": a million reads of one avatar is cheap, a million writes is $4.50, and a listing loop over a large bucket is the request bill that surprises people. Option C also carries the Chapter 6 point — abandoned multipart parts are stored bytes and they are billed, even though <code>ListObjectsV2</code> does not show them.',
            'Bài 7.1 liệt kê năm dòng trên hoá đơn và R2 bỏ đi đúng một dòng. Lưu trữ và cả hai hạng thao tác vẫn còn, và đó là lý do bài 2.1 cảnh báo đừng đọc "R2 miễn phí" ra từ "egress miễn phí": một triệu lượt đọc một cái avatar thì rẻ, một triệu lượt ghi là 4,50 $, còn một vòng lặp liệt kê trên bucket lớn chính là hoá đơn request làm người ta ngã ngửa. Lựa chọn C còn mang theo ý của chương 6 — các phần multipart bỏ dở là byte đã lưu và chúng bị tính tiền, dù <code>ListObjectsV2</code> không hiện chúng ra.',
          ),
        }),

        mcq({
          prompt: B(
            'A leaked token has to be replaced. The rotation procedure in Lesson 2.3 creates the new token, deploys it, waits an hour, and only then revokes the old one. Why not revoke the old token first?',
            'Một token bị lộ cần được thay. Quy trình luân chuyển ở bài 2.3 tạo token mới, triển khai nó, chờ một giờ, rồi mới thu hồi token cũ. Vì sao không thu hồi token cũ trước?',
          ),
          options: [
            B('Because a revoked token cannot be recreated with the same permissions, so revoking first would force you to rebuild the permission scope by hand', 'Vì một token đã thu hồi thì không tạo lại được với cùng bộ quyền, nên thu hồi trước sẽ buộc bạn dựng lại phạm vi quyền bằng tay'),
            B('Because objects written with a token become unreadable once that token is revoked, so the old data must be re-uploaded under the new credentials first', 'Vì object được ghi bằng một token sẽ không đọc được nữa khi token ấy bị thu hồi, nên dữ liệu cũ phải được tải lại dưới thông tin xác thực mới trước'),
            B('Because Cloudflare enforces a mandatory 24-hour cooling period between revoking a token and issuing a replacement for the same bucket', 'Vì Cloudflare bắt buộc một khoảng nguội 24 giờ giữa lúc thu hồi một token và lúc cấp token thay thế cho cùng bucket'),
            B('Because the deploy is not instantaneous: old containers, in-flight uploads and any worker that has not restarted are still signing with the old token, and revoking first turns a security fix into an outage', 'Vì lượt triển khai không tức thì: container cũ, các lượt tải lên đang dở và mọi worker chưa khởi động lại vẫn đang ký bằng token cũ, và thu hồi trước là biến một lượt vá bảo mật thành một sự cố ngừng dịch vụ')
          ],
          correct: 3,
          explanation: EX(
            'The overlap window exists because deployment is a process, not an instant. Lesson 2.3 spells the sequence out: create, add alongside the old value, deploy, verify an upload and a download work, wait, revoke, then clean the old entries out of the environment. The one case that overrides this is a confirmed active compromise — then you revoke immediately and accept the downtime, because an attacker with a valid write token is worse than a broken upload button. Note also what a token does NOT do: it authenticates the caller, it has nothing to do with reading objects that were written earlier.',
            'Cửa sổ chồng lấn tồn tại vì triển khai là một quá trình, không phải một khoảnh khắc. Bài 2.3 viết rõ trình tự: tạo, đặt cạnh giá trị cũ, triển khai, kiểm chứng một lượt tải lên và một lượt tải về chạy được, chờ, thu hồi, rồi mới dọn các mục cũ khỏi biến môi trường. Trường hợp duy nhất phá lệ này là khi đã xác nhận có kẻ đang lợi dụng — lúc ấy thu hồi ngay và chấp nhận gián đoạn, vì một kẻ tấn công cầm token ghi hợp lệ còn tệ hơn một nút tải lên hỏng. Cũng để ý thứ mà token KHÔNG làm: nó xác thực người gọi, chứ chẳng liên quan gì tới việc đọc những object đã được ghi trước đó.',
          ),
        }),

        mcq({
          prompt: B(
            'A one-off migration script needs full read and write access to one bucket for about six hours. Which token configuration follows Lesson 2.3?',
            'Một script migration chạy một lần cần toàn quyền đọc ghi trên một bucket trong khoảng sáu giờ. Cấu hình token nào bám đúng bài 2.3?',
          ),
          options: [
            B('Re-use the backend token, since it already has write access to that bucket and creating another token means another secret to store and forget about', 'Dùng lại token của backend, vì nó vốn đã có quyền ghi lên bucket ấy và tạo thêm một token nghĩa là thêm một bí mật phải lưu rồi bỏ quên'),
            B('No token at all — run the script from a machine whose IP is on the bucket allow list, which removes the secret from the problem entirely', 'Không cần token nào — chạy script từ một máy có IP nằm trong danh sách cho phép của bucket, cách này loại hẳn cái bí mật ra khỏi bài toán'),
            B('An Admin Read + Write token applying to all buckets with no TTL, because a migration may need to create the destination bucket and TTLs break long-running jobs', 'Một token Admin Read + Write áp lên mọi bucket, không TTL, vì migration có thể cần tạo bucket đích và TTL làm hỏng các job chạy dài'),
            B('A dedicated token, scoped to that one bucket, with a TTL that expires shortly after the job, so it dies on its own even if nobody remembers to revoke it', 'Một token riêng, giới hạn đúng bucket ấy, kèm TTL hết hạn ngay sau khi job xong, để nó tự chết kể cả khi không ai nhớ thu hồi')
          ],
          correct: 3,
          explanation: EX(
            'Lesson 2.3 names exactly this token in its example set: <code>admin-migration</code>, Admin R+W, TTL 24h, used only while migrating. Two properties do the work. Scoping to one bucket bounds what a leak can touch; the TTL means the credential expires whether or not anyone follows up, which matters because the follow-up is the step people skip. Re-using the backend token is the opposite trade — one leak now takes down production because you have to rotate the credential your live service is holding.',
            'Bài 2.3 gọi tên đúng token này trong bộ ví dụ của nó: <code>admin-migration</code>, Admin R+W, TTL 24 giờ, chỉ dùng trong lúc migrate. Hai tính chất làm nên việc. Giới hạn vào một bucket khoanh vùng thứ mà một vụ lộ có thể chạm tới; còn TTL nghĩa là thông tin xác thực ấy hết hạn bất kể có ai theo dõi tiếp hay không — điều này quan trọng vì bước theo dõi tiếp chính là bước người ta hay bỏ. Dùng lại token của backend là đánh đổi ngược lại: một vụ lộ bây giờ kéo sập cả production, vì bạn buộc phải luân chuyển đúng cái thông tin xác thực mà dịch vụ đang chạy đang cầm.',
          ),
        }),

        mcq({
          prompt: B(
            'A team runs an internal analytics pipeline: 4 TB stored, a few hundred thousand requests a month, and every byte read stays inside the same cloud — nothing is served to a browser. Using Lesson 7.1\'s published rates, what should they expect from a move to R2?',
            'Một nhóm chạy một pipeline phân tích nội bộ: lưu 4 TB, vài trăm nghìn request mỗi tháng, và mọi byte đọc ra đều nằm trong cùng một đám mây — không có gì phục vụ ra trình duyệt. Dùng bảng giá công bố ở bài 7.1, họ nên chờ đợi gì khi chuyển sang R2?',
          ),
          options: [
            B('The same 46× saving the course quotes, because that ratio is a property of R2 versus S3 rather than of any particular workload', 'Vẫn khoản tiết kiệm 46 lần mà khoá học nêu, vì tỉ lệ ấy là tính chất của R2 so với S3 chứ không phải của một tải công việc cụ thể nào'),
            B('A modest saving driven by the storage rate alone ($0.015 versus $0.023 per GB-month), because the egress line — the thing that makes R2 dramatic — is already zero for them', 'Một khoản tiết kiệm khiêm tốn, do một mình đơn giá lưu trữ tạo ra (0,015 $ so với 0,023 $ mỗi GB-tháng), vì dòng egress — thứ làm R2 thành ngoạn mục — với họ vốn đã bằng không'),
            B('A significant increase, because R2 charges an internal-transfer fee that S3 waives for traffic that never leaves the provider network', 'Một khoản tăng đáng kể, vì R2 thu phí truyền nội bộ mà S3 miễn cho lưu lượng không rời khỏi mạng của nhà cung cấp'),
            B('No change at all, because storage is priced identically on the two services and only egress and request rates differ', 'Không đổi gì cả, vì lưu trữ có giá y hệt nhau trên hai dịch vụ và chỉ egress với đơn giá request là khác'),
          ],
          correct: 1,
          explanation: EX(
            'Do the arithmetic on the numbers the course publishes: 4000 GB × $0.023 = $92.00 on S3 against 4000 × $0.015 = $60.00 on R2, plus a few dollars of requests on either side. That is real money and it is a ratio of about 1.5, not 46. Lesson 10.1 files the 46× figure in Column B — true where it was measured, at 10 TB of monthly egress — and the trap it names is quoting a Column B number as if it were a law. Take egress out of a workload and R2\'s advantage shrinks to the storage delta; add a heavy Class A pattern and the two can end up level.',
            'Hãy làm phép tính trên chính những con số khoá học công bố: 4000 GB × 0,023 $ = 92,00 $ trên S3 so với 4000 × 0,015 $ = 60,00 $ trên R2, cộng thêm vài đô request mỗi bên. Đó là tiền thật và là tỉ lệ khoảng 1,5 lần, không phải 46. Bài 10.1 xếp con số 46 lần vào Cột B — đúng ở nơi nó được đo, tại mức 10 TB egress mỗi tháng — và cái bẫy nó nêu tên chính là trích một con số Cột B như thể đó là quy luật. Bỏ egress ra khỏi một tải công việc thì lợi thế của R2 co lại còn đúng chênh lệch lưu trữ; thêm vào một hình thái Class A nặng thì hai bên có thể ngang nhau.',
          ),
        }),

        mcq({
          prompt: B(
            'What does attaching a custom domain to an R2 bucket give you, according to Lesson 2.2?',
            'Gắn một custom domain vào một bucket R2 cho bạn cái gì, theo bài 2.2?',
          ),
          options: [
            B('A CNAME that proxies to the API endpoint, so requests still need a SigV4 signature but no longer expose the account id in the hostname', 'Một bản ghi CNAME trỏ tới API endpoint, nên request vẫn cần chữ ký SigV4 nhưng không còn lộ mã tài khoản trong tên máy chủ'),
            B('A second, independent copy of the bucket at the edge, which is what makes reads through the domain faster than reads through the endpoint', 'Một bản sao thứ hai, độc lập, của bucket đặt tại biên mạng, và đó là thứ làm việc đọc qua tên miền nhanh hơn đọc qua endpoint'),
            B('Automatic per-object cache invalidation whenever a key is overwritten, which removes the need to think about Cache-Control at upload time', 'Tự động vô hiệu cache theo từng object mỗi khi một key bị ghi đè, nhờ đó khỏi phải nghĩ tới Cache-Control lúc tải lên'),
            B('The Cloudflare CDN in front of the bucket with no separate CDN service to configure — global edge caching, and egress that stays at zero', 'CDN của Cloudflare đứng trước bucket mà không phải cấu hình thêm dịch vụ CDN nào — cache biên toàn cầu, và egress vẫn bằng không')
          ],
          correct: 3,
          explanation: EX(
            'The custom domain IS the CDN — that is the point of Lesson 2.2, and it is why this repo returns <code>media.cuongthai.com/&lt;key&gt;</code> from <code>buildPublicUrl</code> and never the endpoint. Two things it does NOT give you. Caching is not automatic in the sense option C describes: the TTL comes from the <code>Cache-Control</code> you set on the object at upload time, and an overwrite does not purge anything — you either purge through the Cloudflare API (30 a day on the free plan) or, better, write a versioned key. And the edge holds a cache, not a copy: a miss still reaches the bucket.',
            'Custom domain CHÍNH LÀ cái CDN — đó là ý của bài 2.2, và đó là lý do kho này trả về <code>media.cuongthai.com/&lt;key&gt;</code> từ <code>buildPublicUrl</code> chứ không bao giờ trả endpoint. Hai thứ nó KHÔNG cho bạn. Cache không tự động theo nghĩa lựa chọn C mô tả: TTL đến từ <code>Cache-Control</code> bạn đặt lên object lúc tải lên, và một lượt ghi đè không xoá cache nào cả — bạn hoặc purge qua API của Cloudflare (30 lượt mỗi ngày ở gói miễn phí), hoặc tốt hơn là ghi một key có phiên bản. Còn biên mạng giữ một cái cache, không phải một bản sao: trượt cache thì vẫn phải về tới bucket.',
          ),
        }),

        // ── Chương 3 — URL và access ────────────────────────────────────
        mcq({
          prompt: B(
            'Three jobs, three URLs. Which mapping matches Lesson 3.1?' + code(
              '1. Backend uploads a freshly resized avatar\n' +
              '2. A browser renders that avatar in a feed, a thousand times a minute\n' +
              '3. An enrolled student downloads a paid-course PDF',
            ),
            'Ba việc, ba URL. Ánh xạ nào khớp với bài 3.1?' + code(
              '1. Backend tai len mot anh dai dien vua resize\n' +
              '2. Trinh duyet ve anh dai dien do trong bang tin, mot nghin lan moi phut\n' +
              '3. Mot hoc vien da ghi danh tai ve PDF cua khoa hoc tra phi',
            ),
          ),
          options: [
            B('1 API endpoint · 2 custom domain · 3 signed URL — upload is authenticated and uncached, public reads want the CDN, private reads want a short-lived signature', '1 API endpoint · 2 custom domain · 3 signed URL — tải lên thì có xác thực và không cache, đọc công khai thì cần CDN, đọc riêng tư thì cần một chữ ký sống ngắn'),
            B('1 signed URL · 2 API endpoint · 3 custom domain — signing protects the write, the endpoint is the fast path for reads, and the domain hides the PDF behind a friendly name', '1 signed URL · 2 API endpoint · 3 custom domain — chữ ký bảo vệ lượt ghi, endpoint là đường nhanh để đọc, còn tên miền giấu PDF sau một cái tên dễ nhìn'),
            B('1 custom domain · 2 custom domain · 3 custom domain — one URL shape everywhere is simpler, and access control belongs in the application rather than in the URL', '1 custom domain · 2 custom domain · 3 custom domain — một dạng URL cho tất cả thì đơn giản hơn, và kiểm soát truy cập thuộc về tầng ứng dụng chứ không thuộc về URL'),
            B('1 API endpoint · 2 signed URL · 3 custom domain — signing every feed read is what keeps hotlinking down, and the PDF is safe because its key is unguessable', '1 API endpoint · 2 signed URL · 3 custom domain — ký từng lượt đọc bảng tin mới chặn được hotlink, còn PDF an toàn vì key của nó không đoán được'),
          ],
          correct: 0,
          explanation: EX(
            'The use-case table in Lesson 3.1 gives exactly this. Two of the wrong answers are expensive rather than merely wrong. Serving a feed through signed URLs (option D) defeats the CDN entirely, because the signature makes every URL unique and nothing caches — a thousand reads a minute all reach the origin. And putting a paid PDF on the public domain (options C and D) leaves it readable to anyone who learns the key, which is the definition of security by obscurity: keys leak through logs, referrers and screenshots.',
            'Bảng tình huống ở bài 3.1 cho đúng như vậy. Hai trong số các đáp án sai không chỉ sai mà còn tốn kém. Phục vụ bảng tin bằng signed URL (lựa chọn D) triệt tiêu hoàn toàn CDN, vì chữ ký làm mỗi URL thành duy nhất nên không gì cache được — một nghìn lượt đọc mỗi phút đều về tới gốc. Còn đặt một PDF trả phí lên tên miền công khai (lựa chọn C và D) khiến nó đọc được với bất kỳ ai biết được cái key, đúng định nghĩa của an toàn nhờ giấu giếm: key rò ra qua log, qua referrer và qua ảnh chụp màn hình.',
          ),
        }),

        mcq({
          prompt: B(
            'A team shortens the image cache policy from one year to one minute by editing CACHE_POLICIES in the upload code and deploying. Old images keep serving the one-year header. A fix is attempted, and measured:' + code(
              'CopyObject Bucket=B Key="anh.jpg" CopySource="/B/anh.jpg"\n' +
              "           CacheControl='public, max-age=60'\n" +
              '  err.Code : InvalidRequest   HTTP 400\n' +
              '  message  : This copy request is illegal because it is trying to copy\n' +
              '             an object to itself without changing the object\'s metadata...\n\n' +
              'CopyObject ... same, plus MetadataDirective="REPLACE"\n' +
              "  -> 200. HeadObject: CacheControl 'public, max-age=60', ETag UNCHANGED",
            ) + 'What is the lesson?',
            'Một nhóm rút chính sách cache của ảnh từ một năm xuống một phút bằng cách sửa CACHE_POLICIES trong mã tải lên rồi triển khai. Ảnh cũ vẫn phục vụ header một năm. Họ thử sửa, và đo được:' + code(
              'CopyObject Bucket=B Key="anh.jpg" CopySource="/B/anh.jpg"\n' +
              "           CacheControl='public, max-age=60'\n" +
              '  err.Code : InvalidRequest   HTTP 400\n' +
              '  message  : This copy request is illegal because it is trying to copy\n' +
              '             an object to itself without changing the object\'s metadata...\n\n' +
              'CopyObject ... y het, them MetadataDirective="REPLACE"\n' +
              "  -> 200. HeadObject: CacheControl 'public, max-age=60', ETag KHONG DOI",
            ) + 'Bài học ở đây là gì?',
          ),
          options: [
            B('Cache-Control is a property of the CDN configuration, so the deploy did take effect and the old header seen in the browser is a stale preflight cache', 'Cache-Control là thuộc tính của cấu hình CDN, nên lượt triển khai đã có hiệu lực và cái header cũ nhìn thấy trên trình duyệt chỉ là cache preflight cũ'),
            B('Cache-Control is stored ON the object at upload time, so changing the code only affects future uploads; rewriting the header on existing objects needs a copy-onto-itself with MetadataDirective REPLACE', 'Cache-Control được lưu TRÊN object ngay lúc tải lên, nên sửa mã chỉ ảnh hưởng những lượt tải sau; muốn ghi lại header cho object cũ thì phải copy đè lên chính nó với MetadataDirective REPLACE'),
            B('The first call failed because a bucket cannot be both source and destination; the fix is to copy to a temporary key and back, and MetadataDirective is unrelated', 'Lượt gọi đầu hỏng vì một bucket không thể vừa là nguồn vừa là đích; cách sửa là copy sang một key tạm rồi copy về, còn MetadataDirective không liên quan'),
            B('Existing objects cannot have their headers changed at all; the only way is to re-upload the bytes, and the 200 above merely updated an internal index', 'Object có sẵn thì không đổi header được; cách duy nhất là tải lại số byte, và cái 200 ở trên chỉ cập nhật một chỉ mục nội bộ'),
          ],
          correct: 1,
          explanation: EX(
            'Both halves were measured. The header lives on the object, written when the object was written, which is why Lesson 3.2 tells you to get it right at upload time. Two details in the transcript are worth keeping. The default <code>MetadataDirective</code> is <code>COPY</code>, so a self-copy that only supplies new headers changes nothing and the server rejects it as pointless — the error text names the reason precisely. And with <code>REPLACE</code> the ETag came back unchanged, because the bytes never moved; only the metadata was rewritten. Anything you do not restate in a REPLACE copy is dropped, so pass <code>ContentType</code> again too.',
            'Cả hai nửa đều đo thật. Header nằm trên object, được ghi vào lúc object được ghi, và đó là lý do bài 3.2 bảo bạn đặt cho đúng ngay lúc tải lên. Hai chi tiết trong đoạn transcript đáng giữ lại. Mặc định của <code>MetadataDirective</code> là <code>COPY</code>, nên một lượt tự copy chỉ đưa vào header mới sẽ không đổi gì và máy chủ từ chối vì vô nghĩa — câu lỗi nói đúng lý do. Còn với <code>REPLACE</code> thì ETag trả về không đổi, vì số byte chưa hề dịch chuyển; chỉ metadata được ghi lại. Thứ gì bạn không khai lại trong lượt copy REPLACE thì mất, nên nhớ truyền lại cả <code>ContentType</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A presigned GET URL is generated with <code>expiresIn: 1</code> and fetched twice. Measured:' + code(
              'fetch immediately     -> 200\n' +
              'fetch 2.2 s later     -> 403\n' +
              '  <Code>AccessDenied</Code>\n' +
              '  <Message>Request has expired</Message>',
            ) + 'Why does this matter when triaging a 403?',
            'Một presigned GET URL được sinh với <code>expiresIn: 1</code> rồi fetch hai lần. Đo thật:' + code(
              'fetch ngay lap tuc     -> 200\n' +
              'fetch sau 2,2 giay     -> 403\n' +
              '  <Code>AccessDenied</Code>\n' +
              '  <Message>Request has expired</Message>',
            ) + 'Vì sao điều này quan trọng khi phân loại một cái 403?',
          ),
          options: [
            B('Because an expired URL reports <code>SignatureDoesNotMatch</code>, so seeing <code>AccessDenied</code> instead rules expiry out and points at the bucket policy', 'Vì một URL hết hạn báo <code>SignatureDoesNotMatch</code>, nên thấy <code>AccessDenied</code> thay vào đó là loại được khả năng hết hạn và chỉ thẳng vào bucket policy'),
            B('Because the first fetch consumed the URL: a presigned URL is single-use, and the second 403 is replay protection rather than expiry', 'Vì lượt fetch đầu đã tiêu thụ URL: presigned URL chỉ dùng được một lần, và cái 403 thứ hai là chống phát lại chứ không phải hết hạn'),
            B('Because an expired presigned URL returns 404 rather than 403, so the 403 here proves the object was deleted between the two fetches', 'Vì một presigned URL hết hạn trả 404 chứ không phải 403, nên cái 403 ở đây chứng minh object bị xoá giữa hai lượt fetch'),
            B('Because expiry reports the code <code>AccessDenied</code> — the same code a policy denial uses — and only the Message distinguishes them, so reading the status code alone sends you to the wrong layer', 'Vì hết hạn báo mã <code>AccessDenied</code> — đúng mã mà một lượt từ chối theo chính sách dùng — và chỉ có trường Message phân biệt được hai thứ, nên chỉ đọc mã trạng thái là đi nhầm tầng')
          ],
          correct: 3,
          explanation: EX(
            'Measured. The Chapter 9 flowchart splits 403s into a signature layer and a policy layer, and this is the case that straddles them: the <code>Code</code> field says <code>AccessDenied</code>, which normally means "we know who you are and we are refusing", but the <code>Message</code> says <code>Request has expired</code>, which is a completely different fix. Two corollaries from the same measurement session. A URL signed 20 minutes in the future comes back <code>Request is not valid yet</code> — the signing machine\'s clock is fast. And a presigned URL is NOT single-use: the same URL fetched repeatedly inside its window returns 200 every time.',
            'Đo thật. Cây chẩn đoán ở chương 9 chia 403 thành tầng chữ ký và tầng chính sách, và đây là ca nằm vắt qua hai tầng: trường <code>Code</code> ghi <code>AccessDenied</code>, thứ bình thường có nghĩa "chúng tôi biết bạn là ai và chúng tôi từ chối", nhưng trường <code>Message</code> lại ghi <code>Request has expired</code>, một cách sửa hoàn toàn khác. Hai hệ quả từ chính buổi đo ấy. Một URL ký ở mốc 20 phút tương lai trả về <code>Request is not valid yet</code> — đồng hồ máy ký đang chạy nhanh. Và một presigned URL KHÔNG phải dùng một lần: cùng URL ấy fetch lặp lại trong cửa sổ hiệu lực đều trả 200.',
          ),
        }),

        mcq({
          prompt: B(
            'Three fetches of presigned GET URLs against the same bucket, measured:' + code(
              'A: URL signed for "anh.jpg", the key edited to "abc.txt" before fetching\n' +
              '   -> 403  <Code>SignatureDoesNotMatch</Code>\n\n' +
              'B: URL signed for "khong-co-dau.txt", a key that does not exist\n' +
              '   -> 404  <Code>NoSuchKey</Code>\n\n' +
              'C: URL signed correctly, then "&X-Amz-Expires=600" removed from the query\n' +
              '   -> 400  <Code>AuthorizationQueryParametersError</Code>',
            ) + 'What do these three together establish?',
            'Ba lượt fetch presigned GET URL vào cùng một bucket, đo thật:' + code(
              'A: URL ky cho "anh.jpg", key bi sua thanh "abc.txt" truoc khi fetch\n' +
              '   -> 403  <Code>SignatureDoesNotMatch</Code>\n\n' +
              'B: URL ky cho "khong-co-dau.txt", mot key khong ton tai\n' +
              '   -> 404  <Code>NoSuchKey</Code>\n\n' +
              'C: URL ky dung, roi xoa "&X-Amz-Expires=600" khoi chuoi truy van\n' +
              '   -> 400  <Code>AuthorizationQueryParametersError</Code>',
            ) + 'Ba lượt này gộp lại xác lập điều gì?',
          ),
          options: [
            B('That the signature is checked before existence and covers the key and the query parameters — so a 404 from a signed URL means the signature was fine and the object is genuinely absent', 'Rằng chữ ký được kiểm trước sự tồn tại và nó bao trùm cả key lẫn các tham số truy vấn — nên một cái 404 từ một URL đã ký nghĩa là chữ ký không sao và object thật sự không có'),
            B('That existence is checked first, which is why B returned 404 — had the key existed, B would have failed on the signature just like A did', 'Rằng sự tồn tại được kiểm trước, và đó là lý do B trả 404 — nếu key ấy có thật thì B đã hỏng ở chữ ký y như A'),
            B('That the query string is not part of the signature, since removing a parameter in C produced a parameter error rather than a signature error', 'Rằng chuỗi truy vấn không nằm trong chữ ký, vì bỏ đi một tham số ở C cho ra lỗi tham số chứ không phải lỗi chữ ký'),
            B('That all three are the same failure reported inconsistently, and the status codes carry no diagnostic value on a presigned URL', 'Rằng cả ba là cùng một lỗi được báo không nhất quán, và mã trạng thái không mang giá trị chẩn đoán nào trên một presigned URL'),
          ],
          correct: 0,
          explanation: EX(
            'Measured. A shows the path is inside the canonical request — swap the key and the recomputed signature no longer matches, which is also why a signed URL cannot be repointed at a different customer\'s object. B shows the order: the signature verified, so the server went on to look for the key and reported honestly that it is missing. C is the third piece — the query parameters are signed as a set, so deleting one leaves the request malformed. The same session measured the other direction of C: changing <code>X-Amz-Expires=600</code> to <code>6000</code> keeps the URL well-formed and returns <code>403 SignatureDoesNotMatch</code>, because the value is part of what was signed. You cannot lengthen your own link.',
            'Đo thật. A cho thấy đường dẫn nằm trong canonical request — đổi key là chữ ký tính lại không còn khớp, và đó cũng là lý do một URL đã ký không thể chĩa sang object của khách khác. B cho thấy thứ tự: chữ ký hợp lệ nên máy chủ đi tiếp tìm key và báo thật rằng nó không có. C là mảnh thứ ba — các tham số truy vấn được ký thành một bộ, nên xoá một cái là request thành dị dạng. Cũng buổi đo ấy đã đo chiều ngược lại của C: đổi <code>X-Amz-Expires=600</code> thành <code>6000</code> giữ cho URL đúng dạng và trả về <code>403 SignatureDoesNotMatch</code>, vì giá trị ấy nằm trong phần đã ký. Bạn không tự nới hạn cho link của mình được.',
          ),
        }),

        mcq({
          prompt: B(
            'A presigned GET URL is issued, then the object at that key is overwritten twice. Measured:' + code(
              'getSignedUrl(GET "ghide.txt", expiresIn 600)   # ky truoc, object CHUA ton tai\n' +
              "PutObject 'ban 1'   -> fetch URL -> 200, body 'ban 1'\n" +
              "PutObject 'ban 2 dai hon' -> fetch SAME URL -> 200, body 'ban 2 dai hon'",
            ) + 'What does a presigned GET URL actually grant?',
            'Một presigned GET URL được cấp, rồi object tại key đó bị ghi đè hai lần. Đo thật:' + code(
              'getSignedUrl(GET "ghide.txt", expiresIn 600)   # ky truoc, object CHUA ton tai\n' +
              "PutObject 'ban 1'   -> fetch URL -> 200, body 'ban 1'\n" +
              "PutObject 'ban 2 dai hon' -> fetch SAME URL -> 200, body 'ban 2 dai hon'",
            ) + 'Một presigned GET URL thật sự cấp cái gì?',
          ),
          options: [

            B('Permission to read the object once, after which the URL is bound to the returned ETag and any change invalidates it', 'Quyền đọc object một lần, sau đó URL bị ràng vào ETag đã trả về và mọi thay đổi đều làm nó vô hiệu'),
            B('Permission to read the exact bytes present at signing time, snapshotted by the ETag embedded in the signature, so the second fetch should have failed', 'Quyền đọc đúng số byte có mặt lúc ký, được chốt lại bằng ETag nhúng trong chữ ký, nên lượt fetch thứ hai đáng lẽ phải hỏng'),            B('Permission to read whatever lives at that path for the life of the signature — it binds the path, not the bytes, and it can be signed before the object exists', 'Quyền đọc bất cứ thứ gì nằm ở đường dẫn ấy trong suốt thời gian chữ ký còn hiệu lực — nó ràng buộc đường dẫn, không ràng buộc số byte, và ký được cả khi object chưa tồn tại'),
            B('Nothing until the object exists — the 200 on the first fetch shows the signature was silently re-issued by the server at read time', 'Không gì cả cho tới khi object tồn tại — cái 200 ở lượt fetch đầu cho thấy chữ ký đã được máy chủ âm thầm cấp lại lúc đọc')
          ],
          correct: 2,
          explanation: EX(
            'Measured, including the part that surprises people: the URL was signed while the key held nothing, and it still worked once content appeared. SigV4 signs a REQUEST — method, path, query, the listed headers — and the request says "GET this path". It knows nothing about content. Two practical consequences. A leaked link keeps working until it expires, no matter how many times you replace the object, so the answer to a leak is a short TTL and a new key rather than a re-upload. And the reverse is the design that Lesson 3.3 recommends: sign an upload URL for a key that does not exist yet, which is exactly what a presigned PUT is.',
            'Đo thật, kể cả phần làm người ta bất ngờ: URL được ký lúc key chưa chứa gì, mà nó vẫn chạy khi nội dung xuất hiện. SigV4 ký một REQUEST — phương thức, đường dẫn, chuỗi truy vấn, các header được liệt kê — và request ấy nói "GET đường dẫn này". Nó không biết gì về nội dung. Hai hệ quả thực tế. Một link bị lộ vẫn chạy tới lúc hết hạn, bất kể bạn thay object bao nhiêu lần, nên cách xử một vụ lộ là TTL ngắn cộng một key mới chứ không phải tải lại. Và chiều ngược lại chính là thiết kế bài 3.3 khuyến nghị: ký một URL tải lên cho một key còn chưa tồn tại — đúng định nghĩa của một presigned PUT.',
          ),
        }),

        mcq({
          prompt: B(
            'A paid invoice is stored at <code>rieng-tu/hoa-don.pdf</code> with <code>ContentType: application/pdf</code>. Product wants the browser to save it as <code>hoa-don-thang-8.pdf</code> instead of opening it inline, without re-uploading anything. Measured:' + code(
              'getSignedUrl(GetObjectCommand({\n' +
              '  Bucket, Key,\n' +
              "  ResponseContentDisposition: 'attachment; filename=\"hoa-don.jpg\"',\n" +
              "  ResponseContentType: 'application/octet-stream',\n" +
              '}), { expiresIn: 600 })\n\n' +
              'fetch -> 200\n' +
              '  content-disposition: attachment; filename="hoa-don.jpg"\n' +
              '  content-type: application/octet-stream',
            ) + 'What is happening?',
            'Một hoá đơn trả phí nằm ở <code>rieng-tu/hoa-don.pdf</code> với <code>ContentType: application/pdf</code>. Bên sản phẩm muốn trình duyệt lưu nó thành <code>hoa-don-thang-8.pdf</code> thay vì mở ngay trong tab, mà không phải tải lại gì. Đo thật:' + code(
              'getSignedUrl(GetObjectCommand({\n' +
              '  Bucket, Key,\n' +
              "  ResponseContentDisposition: 'attachment; filename=\"hoa-don.jpg\"',\n" +
              "  ResponseContentType: 'application/octet-stream',\n" +
              '}), { expiresIn: 600 })\n\n' +
              'fetch -> 200\n' +
              '  content-disposition: attachment; filename="hoa-don.jpg"\n' +
              '  content-type: application/octet-stream',
            ) + 'Chuyện gì đang diễn ra?',
          ),
          options: [
            B('The stored object was rewritten by the signing call, so every future reader — including the CDN — now sees the new content type', 'Object đã lưu bị lượt gọi ký ghi lại, nên mọi người đọc về sau — kể cả CDN — giờ đều thấy content type mới'),
            B('This only works because the object is private; on a public object the CDN would strip both headers and serve the stored content type', 'Cách này chỉ chạy được vì object là riêng tư; với một object công khai thì CDN sẽ gỡ cả hai header và phục vụ content type đã lưu'),
            B('The browser, not the server, chose those headers based on the file extension in the filename parameter; the server sent the stored values', 'Trình duyệt, chứ không phải máy chủ, đã chọn những header ấy dựa trên phần mở rộng trong tham số filename; máy chủ vẫn gửi các giá trị đã lưu'),
            B('The <code>Response*</code> parameters are response-header overrides carried in the signed query string: they change what this one URL returns without touching the object', 'Các tham số <code>Response*</code> là những phép ghi đè header phản hồi mang trong chuỗi truy vấn đã ký: chúng đổi thứ mà riêng URL này trả về mà không đụng tới object')
          ],
          correct: 3,
          explanation: EX(
            'Measured. The override lives in the signed query string, so it is per-URL, tamper-proof (change it and the signature fails) and leaves the object untouched — the same key fetched through a plain presigned URL in the same session still returned <code>content-type: image/jpeg</code> and its stored <code>cache-control</code>. That makes this the right tool for "download with a friendly filename" and the wrong tool for "fix the content type of 4000 objects": for that you want the copy-onto-itself with <code>MetadataDirective: REPLACE</code>. One caution — the filename in a Content-Disposition header is attacker-influencable if you build it from user input, so sanitise it.',
            'Đo thật. Phép ghi đè nằm trong chuỗi truy vấn đã ký, nên nó theo từng URL, chống sửa (đổi nó là chữ ký hỏng) và không đụng tới object — cùng key ấy fetch qua một presigned URL thường trong cùng buổi đo vẫn trả về <code>content-type: image/jpeg</code> và <code>cache-control</code> đã lưu của nó. Điều đó làm nó thành công cụ đúng cho việc "tải về với tên file dễ nhìn" và là công cụ sai cho việc "sửa content type của 4000 object": việc ấy cần lượt copy đè lên chính nó với <code>MetadataDirective: REPLACE</code>. Một lưu ý — phần filename trong header Content-Disposition chịu ảnh hưởng của kẻ tấn công nếu bạn dựng nó từ dữ liệu người dùng nhập, nên nhớ làm sạch.',
          ),
        }),

        mcq({
          prompt: B(
            'Four assets, four cache policies. Which pairing follows Lesson 3.2?' + code(
              '1. thumbnail-<hash>.webp   (URL changes when the image changes)\n' +
              '2. avatar-user-42.jpg      (stable URL, replaced when the user edits it)\n' +
              '3. a signed URL for a paid PDF\n' +
              '4. an audio stream',
            ),
            'Bốn loại tài nguyên, bốn chính sách cache. Cặp ghép nào bám đúng bài 3.2?' + code(
              '1. thumbnail-<hash>.webp   (URL doi khi anh doi)\n' +
              '2. avatar-user-42.jpg      (URL co dinh, bi thay khi nguoi dung sua)\n' +
              '3. mot signed URL cho PDF tra phi\n' +
              '4. mot luong audio',
            ),
          ),
          options: [
            B('1 <code>public, max-age=31536000, immutable</code> · 2 <code>public, max-age=86400</code> · 3 nothing worth setting, the signature keeps it out of shared caches anyway · 4 <code>public, max-age=3600</code>', '1 <code>public, max-age=31536000, immutable</code> · 2 <code>public, max-age=86400</code> · 3 không cần đặt gì, chữ ký vốn đã giữ nó ngoài các cache dùng chung · 4 <code>public, max-age=3600</code>'),
            B('1 <code>no-store</code> · 2 <code>public, max-age=31536000, immutable</code> · 3 <code>public, max-age=604800</code> · 4 <code>private, max-age=0</code>', '1 <code>no-store</code> · 2 <code>public, max-age=31536000, immutable</code> · 3 <code>public, max-age=604800</code> · 4 <code>private, max-age=0</code>'),
            B('All four get <code>public, max-age=31536000, immutable</code>, because a long TTL is always cheaper and the CDN purge API handles the exceptions', 'Cả bốn đều nhận <code>public, max-age=31536000, immutable</code>, vì TTL dài luôn rẻ hơn và API purge của CDN lo phần ngoại lệ'),
            B('All four get <code>no-cache</code>, because any cached copy of user content is a privacy risk and origin reads are cheap on R2', 'Cả bốn đều nhận <code>no-cache</code>, vì mọi bản cache của nội dung người dùng đều là rủi ro riêng tư và đọc từ gốc thì rẻ trên R2'),
          ],
          correct: 0,
          explanation: EX(
            'Lesson 3.2 sets the policy from one question: can the bytes at this URL ever change? A content-hashed thumbnail cannot, so it earns the year plus <code>immutable</code>, which tells the browser not even to revalidate. A stable avatar URL can change, so it gets a day — and the lesson\'s real advice is to stop having that problem by putting a version in the key. A signed URL is unique per issue, so no shared cache will hold it regardless of the header. Option C is the trap the lesson names: a year on mutable content means a user sees their old avatar for a year, and the Cloudflare free plan gives you 30 purges a day to dig out with.',
            'Bài 3.2 đặt chính sách từ đúng một câu hỏi: số byte ở URL này có bao giờ đổi không? Một thumbnail đặt tên theo mã băm nội dung thì không, nên nó xứng đáng một năm cộng <code>immutable</code>, thứ bảo trình duyệt đừng cả revalidate. Một URL avatar cố định thì có thể đổi, nên nó được một ngày — và lời khuyên thật của bài là hãy thôi có vấn đề đó bằng cách đưa số phiên bản vào key. Một signed URL là duy nhất mỗi lần cấp, nên không cache dùng chung nào giữ nó, bất kể header. Lựa chọn C chính là cái bẫy bài học gọi tên: một năm áp lên nội dung có thể đổi nghĩa là người dùng nhìn cái avatar cũ suốt một năm, và gói miễn phí của Cloudflare cho bạn 30 lượt purge mỗi ngày để đào ra.',
          ),
        }),

        mcq({
          prompt: B(
            'A paid-course PDF must be downloadable only by enrolled students. Lesson 3.3 gives this repo\'s pattern:' + code(
              'GET /api/v1/courses/:c/lessons/:l/download   (auth cookie)\n' +
              '  1. verify the caller is enrolled\n' +
              '  2. read lesson.fileKey from the database\n' +
              '  3. res.json({ url: await getSignedDownloadUrl(fileKey, 600) })\n' +
              '  4. the browser fetches that URL directly from the bucket',
            ) + 'Why hand back a URL instead of streaming the bytes through step 3?',
            'Một file PDF của khoá học trả phí chỉ được tải bởi học viên đã ghi danh. Bài 3.3 cho khuôn mẫu của kho này:' + code(
              'GET /api/v1/courses/:c/lessons/:l/download   (co cookie dang nhap)\n' +
              '  1. kiem nguoi goi da ghi danh chua\n' +
              '  2. doc lesson.fileKey tu co so du lieu\n' +
              '  3. res.json({ url: await getSignedDownloadUrl(fileKey, 600) })\n' +
              '  4. trinh duyet fetch thang URL do tu bucket',
            ) + 'Vì sao trả về một URL thay vì đẩy dòng byte qua chính bước 3?',
          ),
          options: [
            B('Because streaming through the API would expose the bucket key to the client, and the whole purpose of the signed URL is to keep the key secret from the browser', 'Vì đẩy dòng byte qua API sẽ để lộ key của bucket cho client, và toàn bộ mục đích của signed URL là giấu cái key ấy khỏi trình duyệt'),
            B('Because the entitlement check has to happen on the storage side, and only a signed URL can carry the caller\'s identity from your API through to the bucket for that check', 'Vì phép kiểm quyền phải diễn ra ở phía kho lưu trữ, và chỉ một signed URL mới mang được danh tính người gọi từ API của bạn sang tới bucket cho phép kiểm ấy'),
            B('Because a streamed response cannot be resumed, whereas a signed URL supports Range requests, which is the only way a large PDF can be downloaded reliably', 'Vì một phản hồi dạng dòng thì không tiếp tục được khi đứt, còn signed URL hỗ trợ request theo Range, và đó là cách duy nhất để tải một file PDF lớn một cách đáng tin cậy'),
            B('Because your server would otherwise carry every byte of every download — the check is cheap and stays on your API, while the transfer moves to the bucket, which also removes the proxy body limit and the memory pressure', 'Vì nếu không thì máy chủ của bạn phải cõng từng byte của từng lượt tải — phép kiểm thì rẻ và vẫn nằm ở API của bạn, còn phần truyền dữ liệu chuyển sang bucket, và điều đó cũng gỡ luôn trần dung lượng của proxy lẫn áp lực bộ nhớ')
          ],
          correct: 3,
          explanation: EX(
            'The split is the point: authorisation is a database question your API answers in milliseconds, and delivery is a bandwidth question the bucket answers for free. Proxying the bytes puts your server back in the data path for every download, which is the same argument Chapter 4 makes for uploads. Option B inverts how this works — the signature carries no user identity at all; it authorises one method on one path for a window of time, and your API is the only thing that ever checks enrolment. Option A misplaces the secret: the key is not sensitive, ACCESS to it is, and the signed URL is visible in the response body anyway.',
            'Ý nằm ở chỗ tách đôi: cấp quyền là câu hỏi của cơ sở dữ liệu mà API của bạn trả lời trong vài mili-giây, còn giao hàng là câu hỏi về băng thông mà bucket trả lời miễn phí. Đẩy byte qua proxy là đặt máy chủ của bạn trở lại đường đi của dữ liệu ở mọi lượt tải, đúng lý lẽ mà chương 4 nêu cho chiều tải lên. Lựa chọn B lộn ngược cách nó vận hành — chữ ký không mang theo danh tính người dùng nào cả; nó cấp một phương thức trên một đường dẫn trong một cửa sổ thời gian, và API của bạn là thứ duy nhất từng kiểm chuyện ghi danh. Lựa chọn A đặt nhầm chỗ cái bí mật: bản thân cái key không nhạy cảm, thứ nhạy cảm là QUYỀN TRUY CẬP vào nó, mà signed URL thì dù sao cũng hiện ra trong thân phản hồi.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Rebuild the ETag a server would return (chapters 0 and 1).</b> A verification script has to decide, without downloading anything, whether an object on the destination matches the source. That means being able to compute both kinds of ETag yourself. Write four functions.</p>' +
            '<ul>' +
            '<li><code>etagDon(duLieu)</code> — the ETag of a single-shot PutObject: the hex MD5 of the bytes, <b>wrapped in double quotes</b>, exactly as the API returns it.</li>' +
            '<li><code>etagGhep(cacPhan)</code> — the ETag of a completed multipart upload. Take the <b>binary</b> MD5 digest of each part, concatenate those digests, MD5 the result, and append <code>-</code> plus the <b>number of parts</b>. Quotes here too.</li>' +
            '<li><code>kiemTraKichThuoc(cacPhan)</code> — return the string <code>&quot;EntityTooSmall&quot;</code> if any part <b>other than the last</b> is under 5 MiB, <code>&quot;InvalidRequest&quot;</code> for an empty list, otherwise <code>null</code>. The last part may be any size.</li>' +
            '<li><code>tongKet(cacPhan)</code> — if <code>kiemTraKichThuoc</code> returns an error, return that string. Otherwise return the multipart ETag, a single space, and the total byte count.</li>' +
            '</ul>' +
            '<p>Two details decide the whole question. The digests are concatenated as <b>raw bytes</b>, not as hex text — hashing the hex strings gives a plausible-looking answer that matches nothing. And the count in the suffix is the number of parts, so a multipart upload of one part still ends in <code>-1</code>.</p>' +
            '<p>Every expected value was produced by a live S3-compatible server on the same bytes. Use <code>node:crypto</code> only; keep the given data and the printing loop exactly as they are.</p>',

            '<p><b>Câu 31 — Dựng lại cái ETag mà máy chủ sẽ trả về (chương 0 và 1).</b> Một script kiểm chứng phải quyết định, mà không tải về một byte nào, rằng object bên đích có khớp bên nguồn không. Nghĩa là bạn phải tự tính được cả hai kiểu ETag. Hãy viết bốn hàm.</p>' +
            '<ul>' +
            '<li><code>etagDon(duLieu)</code> — ETag của một lượt PutObject một phát: MD5 dạng hex của số byte, <b>bọc trong hai dấu nháy kép</b>, đúng như API trả về.</li>' +
            '<li><code>etagGhep(cacPhan)</code> — ETag của một lượt multipart đã hoàn tất. Lấy mã tóm tắt MD5 <b>dạng nhị phân</b> của từng phần, nối chúng lại, MD5 kết quả ấy, rồi gắn thêm <code>-</code> và <b>số phần</b>. Cũng có nháy kép.</li>' +
            '<li><code>kiemTraKichThuoc(cacPhan)</code> — trả chuỗi <code>&quot;EntityTooSmall&quot;</code> nếu có phần nào <b>không phải phần cuối</b> mà nhỏ hơn 5 MiB, trả <code>&quot;InvalidRequest&quot;</code> với danh sách rỗng, còn lại trả <code>null</code>. Phần cuối to nhỏ tuỳ ý.</li>' +
            '<li><code>tongKet(cacPhan)</code> — nếu <code>kiemTraKichThuoc</code> trả về lỗi thì trả đúng chuỗi ấy. Không thì trả ETag multipart, một dấu cách, rồi tổng số byte.</li>' +
            '</ul>' +
            '<p>Hai chi tiết quyết định cả câu. Các mã tóm tắt được nối ở dạng <b>byte thô</b>, không phải dạng chữ hex — băm chuỗi hex cho ra một đáp án trông rất hợp lý mà chẳng khớp với cái gì. Và con số ở hậu tố là SỐ PHẦN, nên một lượt multipart chỉ có một phần vẫn kết thúc bằng <code>-1</code>.</p>' +
            '<p>Mọi giá trị kỳ vọng đều do một máy chủ S3-compatible sống sinh ra trên đúng số byte đó. Chỉ dùng <code>node:crypto</code>; giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const crypto = require('node:crypto');\n" +
            'const MiB = 1024 * 1024;\n' +
            'const phan = (soMiB, kyTu) => Buffer.alloc(soMiB * MiB, kyTu);\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function etagDon(duLieu) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function etagGhep(cacPhan) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function kiemTraKichThuoc(cacPhan) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function tongKet(cacPhan) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const CA = [\n' +
            "  ['A5+B5+C2',   [phan(5, 'A'), phan(5, 'B'), phan(2, 'C')]],\n" +
            "  ['C2 mot phan', [phan(2, 'C')]],\n" +
            "  ['A5+C2',      [phan(5, 'A'), phan(2, 'C')]],\n" +
            "  ['Z8 chia 5+3', [phan(5, 'Z'), phan(3, 'Z')]],\n" +
            "  ['Z6 chia 5+1', [phan(5, 'Z'), phan(1, 'A')]],\n" +
            "  ['Z8 chia 4+4', [phan(4, 'Z'), phan(4, 'Z')]],\n" +
            "  ['Z12 chia 1x12', Array.from({ length: 12 }, () => phan(1, 'Z'))],\n" +
            "  ['rong', []],\n" +
            '];\n' +
            "for (const [ten, cacPhan] of CA) console.log(ten + ' -> ' + tongKet(cacPhan));\n" +
            "console.log('PUT mot luot Z8 -> ' + etagDon(phan(8, 'Z')));\n" +
            "console.log('PUT mot luot rong -> ' + etagDon(Buffer.alloc(0)));\n",
          expectedOutput:
            'A5+B5+C2 -> "eacd2737fa049d51213f10cdc5732ece-3" 12582912\n' +
            'C2 mot phan -> "62779858262432b238005e27d389b376-1" 2097152\n' +
            'A5+C2 -> "caab69f313bed25c163d5c29d0b7f740-2" 7340032\n' +
            'Z8 chia 5+3 -> "7fed252542c616b849b9bad8e04e4d44-2" 8388608\n' +
            'Z6 chia 5+1 -> "908bd5403409b52b81c97beaa3320dbf-2" 6291456\n' +
            'Z8 chia 4+4 -> EntityTooSmall\n' +
            'Z12 chia 1x12 -> EntityTooSmall\n' +
            'rong -> InvalidRequest\n' +
            'PUT mot luot Z8 -> "61461f70bad6ef02b0419218f2b668e2"\n' +
            'PUT mot luot rong -> "d41d8cd98f00b204e9800998ecf8427e"',
          sampleSolution:
            "const md5 = (b) => crypto.createHash('md5').update(b).digest();\n\n" +
            'function etagDon(duLieu) {\n' +
            "  return '\"' + md5(duLieu).toString('hex') + '\"';\n" +
            '}\n\n' +
            'function etagGhep(cacPhan) {\n' +
            '  // Nối các mã tóm tắt ở dạng NHỊ PHÂN, không phải dạng chữ hex.\n' +
            '  const noiLai = Buffer.concat(cacPhan.map((p) => md5(p)));\n' +
            "  return '\"' + md5(noiLai).toString('hex') + '-' + cacPhan.length + '\"';\n" +
            '}\n\n' +
            'function kiemTraKichThuoc(cacPhan) {\n' +
            "  if (cacPhan.length === 0) return 'InvalidRequest';\n" +
            '  for (let i = 0; i < cacPhan.length - 1; i++) {\n' +
            "    if (cacPhan[i].length < 5 * MiB) return 'EntityTooSmall';\n" +
            '  }\n' +
            '  return null;   // phần CUỐI to nhỏ tuỳ ý\n' +
            '}\n\n' +
            'function tongKet(cacPhan) {\n' +
            '  const loi = kiemTraKichThuoc(cacPhan);\n' +
            '  if (loi) return loi;\n' +
            '  const soByte = cacPhan.reduce((s, p) => s + p.length, 0);\n' +
            "  return etagGhep(cacPhan) + ' ' + soByte;\n" +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Implement ListObjectsV2, including the parts people get wrong (chapters 0, 1 and 3).</b> Write <code>liet(kho, tuyChon)</code> against a flat array of keys, then <code>demHet</code> on top of it.</p>' +
            '<p><code>tuyChon</code> may carry <code>prefix</code> (default <code>&quot;&quot;</code>), <code>delimiter</code> (default <code>&quot;&quot;</code> = no grouping), <code>maxKeys</code> (default 1000) and <code>continuationToken</code> (default null). Return <code>{ Contents, CommonPrefixes, KeyCount, IsTruncated, NextContinuationToken }</code>.</p>' +
            '<ul>' +
            '<li><b>Prefix is a plain string match.</b> <code>&quot;users&quot;</code> matches <code>users-cu/a.txt</code> as well as <code>users/1.txt</code>. Do not treat it as a folder.</li>' +
            '<li><b>Grouping.</b> With a delimiter, take the key, strip the prefix, and look for the first delimiter in what is left. Found: report <code>prefix + everything up to and including that delimiter</code> as one <code>CommonPrefixes</code> entry, once, and do not list the key. Not found: the key goes in <code>Contents</code>.</li>' +
            '<li><b>One page, one budget.</b> Sort every entry — objects and group names together — by plain <code>&lt;</code> / <code>&gt;</code> string comparison, then take at most <code>maxKeys</code>. <b>The server caps a page at 1000 however much you ask for.</b> <code>KeyCount</code> counts objects plus group names.</li>' +
            '<li><b>Continuing.</b> <code>NextContinuationToken</code> is the name of the last entry on this page when more remain, otherwise <code>null</code>; a call carrying one resumes at the first entry strictly greater than it. (A real service returns an opaque token — this exercise fixes the shape so the output is checkable.)</li>' +
            '</ul>' +
            '<p><code>demHet(kho, tuyChon)</code> pages through with that token until it comes back null, and returns <code>&quot;&lt;N&gt; key trong &lt;M&gt; trang&quot;</code>.</p>' +
            '<p>Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 32 — Cài đặt ListObjectsV2, kể cả những chỗ người ta hay làm sai (chương 0, 1 và 3).</b> Viết <code>liet(kho, tuyChon)</code> trên một mảng key phẳng, rồi <code>demHet</code> dựng trên nó.</p>' +
            '<p><code>tuyChon</code> có thể mang <code>prefix</code> (mặc định <code>&quot;&quot;</code>), <code>delimiter</code> (mặc định <code>&quot;&quot;</code> = không gom nhóm), <code>maxKeys</code> (mặc định 1000) và <code>continuationToken</code> (mặc định null). Trả về <code>{ Contents, CommonPrefixes, KeyCount, IsTruncated, NextContinuationToken }</code>.</p>' +
            '<ul>' +
            '<li><b>Tiền tố là phép so khớp chuỗi thuần.</b> <code>&quot;users&quot;</code> khớp cả <code>users-cu/a.txt</code> lẫn <code>users/1.txt</code>. Đừng coi nó là thư mục.</li>' +
            '<li><b>Gom nhóm.</b> Có delimiter thì lấy key, cắt bỏ tiền tố, tìm delimiter đầu tiên trong phần còn lại. Tìm thấy: báo <code>tiền tố + cả đoạn tính tới và gồm cả dấu ấy</code> thành một mục <code>CommonPrefixes</code>, đúng một lần, và không liệt kê key. Không thấy: key vào <code>Contents</code>.</li>' +
            '<li><b>Một trang, một ngân sách.</b> Sắp mọi mục — object và tên nhóm chung với nhau — bằng phép so chuỗi <code>&lt;</code> / <code>&gt;</code> thuần, rồi lấy tối đa <code>maxKeys</code> mục. <b>Máy chủ chốt mỗi trang ở 1000 dù bạn xin bao nhiêu.</b> <code>KeyCount</code> đếm cả object lẫn tên nhóm.</li>' +
            '<li><b>Đi tiếp.</b> <code>NextContinuationToken</code> là tên của mục cuối trang này khi còn mục nữa, không thì <code>null</code>; một lượt gọi mang token sẽ tiếp tục từ mục đầu tiên lớn hơn hẳn nó. (Dịch vụ thật trả một token mờ — bài này chốt hình dạng ấy lại để kết quả kiểm được.)</li>' +
            '</ul>' +
            '<p><code>demHet(kho, tuyChon)</code> đi hết các trang bằng token đó tới khi nó trả về null, rồi trả <code>&quot;&lt;N&gt; key trong &lt;M&gt; trang&quot;</code>.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const KHO = [\n' +
            "  'anh/1.jpg',\n" +
            "  'thumuc/',\n" +
            "  'users-cu/a.txt',\n" +
            "  'users-cu/b.txt',\n" +
            "  'users/42/avatar.jpg',\n" +
            "  'users/42/anh/1.jpg',\n" +
            "  'users/7/avatar.jpg',\n" +
            '];\n' +
            "for (let i = 0; i < 1200; i++) KHO.push('log/' + String(i).padStart(4, '0') + '.txt');\n\n" +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function liet(kho, tuyChon = {}) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function demHet(kho, tuyChon) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const gon = (r) => JSON.stringify({\n' +
            "  C: r.Contents.length > 3 ? [r.Contents[0], '…', r.Contents[r.Contents.length - 1]] : r.Contents,\n" +
            '  P: r.CommonPrefixes, n: r.KeyCount, cat: r.IsTruncated, tiep: r.NextContinuationToken,\n' +
            '});\n' +
            "console.log('1 ' + gon(liet(KHO, { delimiter: '/' })));\n" +
            "console.log('2 ' + gon(liet(KHO, { delimiter: '/', maxKeys: 2 })));\n" +
            "console.log('3 ' + gon(liet(KHO, { prefix: 'users/', delimiter: '/' })));\n" +
            "console.log('4 ' + gon(liet(KHO, { prefix: 'users/' })));\n" +
            "console.log('5 ' + gon(liet(KHO, { prefix: 'users' })));\n" +
            "console.log('6 ' + gon(liet(KHO, { prefix: 'thumuc' })));\n" +
            "console.log('7 ' + gon(liet(KHO, { prefix: 'thumuc', delimiter: '/' })));\n" +
            "console.log('8 ' + gon(liet(KHO, { maxKeys: 1500 })));\n" +
            "console.log('9 ' + demHet(KHO, { prefix: 'log/' }));\n" +
            "console.log('10 ' + demHet(KHO, { delimiter: '/' }));\n",
          expectedOutput:
            '1 {"C":[],"P":["anh/","log/","thumuc/","users-cu/","users/"],"n":5,"cat":false,"tiep":null}\n' +
            '2 {"C":[],"P":["anh/","log/"],"n":2,"cat":true,"tiep":"log/"}\n' +
            '3 {"C":[],"P":["users/42/","users/7/"],"n":2,"cat":false,"tiep":null}\n' +
            '4 {"C":["users/42/anh/1.jpg","users/42/avatar.jpg","users/7/avatar.jpg"],"P":[],"n":3,"cat":false,"tiep":null}\n' +
            '5 {"C":["users-cu/a.txt","…","users/7/avatar.jpg"],"P":[],"n":5,"cat":false,"tiep":null}\n' +
            '6 {"C":["thumuc/"],"P":[],"n":1,"cat":false,"tiep":null}\n' +
            '7 {"C":[],"P":["thumuc/"],"n":1,"cat":false,"tiep":null}\n' +
            '8 {"C":["anh/1.jpg","…","log/0998.txt"],"P":[],"n":1000,"cat":true,"tiep":"log/0998.txt"}\n' +
            '9 1200 key trong 2 trang\n' +
            '10 5 key trong 1 trang',
          sampleSolution:
            'function liet(kho, tuyChon = {}) {\n' +
            "  const prefix = tuyChon.prefix ?? '';\n" +
            "  const delimiter = tuyChon.delimiter ?? '';\n" +
            '  const xin = tuyChon.maxKeys ?? 1000;\n' +
            '  const maxKeys = Math.min(1000, Math.max(1, xin));   // trần cứng của máy chủ\n' +
            '  const token = tuyChon.continuationToken ?? null;\n\n' +
            '  const khop = kho.filter((k) => k.startsWith(prefix));\n\n' +
            '  const muc = [];\n' +
            '  const daCo = new Set();\n' +
            '  for (const k of khop) {\n' +
            '    if (delimiter) {\n' +
            '      const con = k.slice(prefix.length);\n' +
            '      const vt = con.indexOf(delimiter);\n' +
            '      if (vt >= 0) {\n' +
            '        const cp = prefix + con.slice(0, vt + delimiter.length);\n' +
            '        if (!daCo.has(cp)) { daCo.add(cp); muc.push({ ten: cp, nhom: true }); }\n' +
            '        continue;\n' +
            '      }\n' +
            '    }\n' +
            '    muc.push({ ten: k, nhom: false });\n' +
            '  }\n' +
            '  muc.sort((a, b) => (a.ten < b.ten ? -1 : a.ten > b.ten ? 1 : 0));\n\n' +
            '  const batDau = token ? muc.findIndex((m) => m.ten > token) : 0;\n' +
            '  const lat = batDau < 0 ? [] : muc.slice(batDau, batDau + maxKeys);\n' +
            '  const conNua = batDau >= 0 && batDau + maxKeys < muc.length;\n\n' +
            '  return {\n' +
            '    Contents: lat.filter((m) => !m.nhom).map((m) => m.ten),\n' +
            '    CommonPrefixes: lat.filter((m) => m.nhom).map((m) => m.ten),\n' +
            '    KeyCount: lat.length,                       // object CỘNG tên nhóm\n' +
            '    IsTruncated: conNua,\n' +
            '    NextContinuationToken: conNua ? lat[lat.length - 1].ten : null,\n' +
            '  };\n' +
            '}\n\n' +
            'function demHet(kho, tuyChon) {\n' +
            '  let token = null, tong = 0, trang = 0;\n' +
            '  do {\n' +
            '    const r = liet(kho, { ...tuyChon, continuationToken: token });\n' +
            '    tong += r.KeyCount; trang++; token = r.NextContinuationToken;\n' +
            '  } while (token);\n' +
            "  return tong + ' key trong ' + trang + ' trang';\n" +
            '}\n',
        }),
      ],
    },
  ],
};
