/**
 * Object Storage — Progress Test 3 (Chương 8 → Chương 10).
 *
 * Đề tự soạn, bám sát `content/courses/object-storage/s08-migration.mjs`,
 * `s09-chan-doan.mjs` và `s10-on-thi.mjs`. 30 câu trắc nghiệm + 2 câu lập trình
 * làm ngay trong phòng thi.
 *
 * ⚠️ Mọi mã lỗi và mọi ETag trong đề này đều LẤY TỪ MỘT MÁY CHỦ S3-COMPATIBLE
 * SỐNG, dựng riêng cho đề bằng Docker:
 *
 *   MinIO           RELEASE.2025-09-07T16-13-09Z (go1.24.6, linux/arm64)
 *   @aws-sdk/client-s3            3.1071.0
 *   @aws-sdk/s3-request-presigner 3.1071.0
 *   Node v22.21.0, darwin-arm64, Docker Engine 29.5.3
 *   docker run -d --name ospt-minio -p 59300:9000 minio/minio server /data
 *
 * ⛔ KHÔNG chạm tới bucket R2 thật của dự án — không đọc `.env`, không dùng khoá
 * thật, không gọi một byte nào tới Cloudflare, không SSH vào đâu cả. Container
 * nháp đã `docker rm -f` sau khi đo xong.
 *
 * ⛔ KHÔNG câu nào trong đề dựa vào một phép đo THỜI GIAN hay THÔNG LƯỢNG do
 * tôi tự chạy: máy đang tải nặng nên mọi con số kiểu đó sẽ vô nghĩa. Các câu về
 * độ trễ (q22–q26) dùng đúng những con số GIÁO TRÌNH đã công bố và hỏi cách ĐỌC
 * chúng, không hỏi một phép đo mới nào.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️ MỘT CHỖ MÁY KHÁC GIÁO TRÌNH — ĐỀ THEO MÁY, VÀ ĐÂY LÀ CHỖ QUAN TRỌNG NHẤT
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  • Bài 9.1 xếp LỆCH ĐỒNG HỒ thành "CAUSE 1" nằm dưới nhánh
 *    `SignatureDoesNotMatch`, và câu quiz 9.3 Q1 nói thẳng: thấy
 *    `<Code>SignatureDoesNotMatch</Code>` thì bước đầu tiên là đi kiểm
 *    `date -u`. Đo thật thì lệch đồng hồ CÓ MÃ LỖI RIÊNG. Ký tay một request
 *    SigV4 dạng header với `x-amz-date` lệch dần:
 *
 *        lệch   0 phút  -> 200 OK
 *        lệch -10 phút  -> 200 OK
 *        lệch -20 phút  -> 403 RequestTimeTooSkewed
 *        lệch +20 phút  -> 403 RequestTimeTooSkewed
 *        lệch  -2 ngày  -> 403 RequestTimeTooSkewed
 *          message: The difference between the request time and the server's
 *                   time is too large.
 *
 *    Nghĩa là: (a) trong cửa sổ 15 phút thì lệch KHÔNG gây lỗi gì cả, (b) ngoài
 *    cửa sổ ấy thì máy chủ nói thẳng ra là lệch giờ chứ không nói
 *    `SignatureDoesNotMatch`. Đi kiểm NTP khi thấy `SignatureDoesNotMatch` là
 *    đi nhầm hướng — thứ nên kiểm là secret và những gì client đã sửa sau khi
 *    ký. Câu 15 hỏi đúng chỗ này.
 *
 *    Với presigned URL thì lệch đồng hồ lại hiện ra dưới dạng thứ ba, cũng đo
 *    thật: ký ở mốc 20 phút QUÁ KHỨ với `expiresIn: 600` cho
 *    `403 AccessDenied "Request has expired"`, còn ký ở mốc 20 phút TƯƠNG LAI
 *    cho `403 AccessDenied "Request is not valid yet"`. Ba triệu chứng, một
 *    nguyên nhân.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️ NHỮNG CHỖ CHỈ DỰA VÀO TÀI LIỆU, CHƯA ĐO ĐƯỢC
 * ─────────────────────────────────────────────────────────────────────────────
 *   – TOÀN BỘ chương 8 (câu 1–12): Super Slurper, Sippy, chính sách IAM của
 *     AWS, ba con số thông lượng migration, trần ~5.500 GET/s theo prefix của
 *     S3, và chuyện R2 không có versioning. Không có cách nào dựng lại một
 *     dịch vụ migration của Cloudflare trong một container nháp. Đề hỏi CƠ CHẾ
 *     và SỐ HỌC trên chính những con số giáo trình công bố.
 *   – Độ dài secret key (40 ký tự AWS, 64 ký tự R2 — câu 18): theo giáo trình.
 *   – Mọi con số độ trễ và thông lượng (câu 22–26): theo giáo trình, KHÔNG đo
 *     lại, vì máy dựng đề đang chạy nhiều việc khác.
 *   – Bảng giá R2/S3 (câu 5, 11, 29): giá công bố trong bài 2.1 và 7.1.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Phân bố câu theo chương:
 *   Chương 8 — migration S3 → R2           12 câu   (q1–q12)
 *   Chương 9 — sách công thức chẩn đoán    12 câu   (q13–q24)
 *   Chương 10 — cái sống qua đo lường       6 câu   (q25–q30)
 *                                          ─────
 *                                          30 câu trắc nghiệm + 2 câu lập trình
 *
 * Phân bố vị trí đáp án — A 8 · B 8 · C 8 · D 8, tổng 32 ô chứ không phải 30:
 * câu 24 và câu 29 là câu "chọn HAI" nên mỗi câu góp hai ô. Đếm lại bằng:
 *   node -e "import('./content/exams/OBJECT-STORAGE-PT3.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Hai câu lập trình chạy được bằng Node thuần, không cần mạng, không cần
 * `node_modules`. Bộ mã lỗi trong câu 31 và các ETag trong câu 32 đều là những
 * chuỗi ĐO THẬT ở trên, không có chuỗi nào bịa ra.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/OBJECT-STORAGE-PT3.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/objectstorage-exam-kit.mjs';

export default {
  course: { slug: 'object-storage' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 8 to 10 (migration, the diagnosis cookbook, what survived measurement)',
        'Kiểm tra tiến độ 3 — Chương 8 đến 10 (migration, sách công thức chẩn đoán, cái sống qua đo lường)',
      ),
      description: B(
        'The last third of the Object Storage course: moving a live bucket to another provider without downtime, proving the move actually worked, reading a 403 and a latency histogram for what they really say, and telling a rule apart from a measurement that happened to hold once. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba cuối của khoá Object Storage: chuyển một bucket đang sống sang nhà cung cấp khác mà không gián đoạn, chứng minh cuộc chuyển ấy thật sự thành công, đọc một cái 403 và một biểu đồ độ trễ đúng như chúng nói, và phân biệt một quy luật với một phép đo tình cờ đúng một lần. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '8–10'),
      questions: [
        // ── Chương 8 — migration S3 → R2 ────────────────────────────────
        mcq({
          prompt: B(
            'Three completed migrations from Lesson 8.1:' + code(
              'A)    47 GB,   220,000 objects (avg 210 KB) -> 1h 42m\n' +
              'B)   2.8 TB, 4,100,000 objects (avg 715 KB) -> 22h 18m\n' +
              'C)  14.6 TB,    61,000 objects (avg 240 MB) -> 3d 07h',
            ) + 'A new source bucket holds 900 GB in 6 million objects. Which estimate follows from these figures?',
            'Ba cuộc migration đã hoàn tất, lấy từ bài 8.1:' + code(
              'A)    47 GB,   220.000 object (TB 210 KB) -> 1h 42m\n' +
              'B)   2,8 TB, 4.100.000 object (TB 715 KB) -> 22h 18m\n' +
              'C)  14,6 TB,     61.000 object (TB 240 MB) -> 3d 07h',
            ) + 'Một bucket nguồn mới chứa 900 GB trong 6 triệu object. Ước lượng nào rút ra được từ các con số trên?',
          ),
          options: [
            B('Under two hours, by scaling case A: 900 GB is about nineteen times 47 GB, and case A finished in well under two hours at a rate of 460 GB a day', 'Dưới hai giờ, bằng cách nhân theo ca A: 900 GB gấp chừng mười chín lần 47 GB, mà ca A xong trong chưa tới hai giờ với tốc độ 460 GB một ngày'),
            B('About five hours, by scaling case C: 900 GB is a sixteenth of 14.6 TB, and case C sustained 4.4 TB a day', 'Khoảng năm giờ, bằng cách nhân theo ca C: 900 GB bằng một phần mười sáu của 14,6 TB, mà ca C giữ được 4,4 TB một ngày'),
            B('More than a day, because object count drives the ceiling rather than total bytes: 6 million objects is above case B\'s 4.1 million, and case B took 22 hours to move a third of these bytes', 'Hơn một ngày, vì trần bị quyết định bởi SỐ OBJECT chứ không phải tổng byte: 6 triệu object nhiều hơn 4,1 triệu của ca B, mà ca B mất 22 giờ để chuyển một phần ba số byte này'),
            B('Impossible to estimate from these three, since throughput depends entirely on the source region and none of the three cases names one', 'Không ước lượng nổi từ ba ca ấy, vì thông lượng phụ thuộc hoàn toàn vào vùng của nguồn mà không ca nào nêu vùng cả'),
          ],
          correct: 2,
          explanation: EX(
            'The three cases are chosen to make exactly this point: case C moved 310 times the bytes of case A but only a quarter of the objects, and it took two days longer per terabyte would suggest — because LIST and PUT overhead per object dominates. Ranking by objects per hour rather than TB per day makes it read straight: 130k, 184k and 780. So 6 million objects sits alongside case B, and case B took 22 hours. Lesson 8.1 also tells you to add 20-30% for whatever list rate limits the source account applies, so "more than a day" is the honest answer.',
            'Ba ca được chọn để làm nổi đúng ý này: ca C chuyển gấp 310 lần số byte của ca A nhưng chỉ bằng một phần tư số object, mà nó lại mất nhiều thời gian hơn hẳn con số mỗi terabyte gợi ra — vì chi phí LIST và PUT trên MỖI OBJECT mới là thứ chiếm chủ đạo. Xếp hạng theo số object mỗi giờ thay vì TB mỗi ngày là đọc ra ngay: 130 nghìn, 184 nghìn và 780. Vậy 6 triệu object nằm cùng hạng với ca B, mà ca B mất 22 giờ. Bài 8.1 còn bảo cộng thêm 20-30% cho những giới hạn tốc độ liệt kê mà tài khoản nguồn bị áp, nên "hơn một ngày" mới là câu trả lời thật thà.',
          ),
        }),

        mcq({
          prompt: B(
            'A managed copier reports "4,132,881 objects copied, 0 errors" against a bucket that used S3 versioning and had a bucket policy granting one prefix to a partner account. What did NOT travel?',
            'Một công cụ chép có quản lý báo "4.132.881 object copied, 0 errors" trên một bucket vốn bật versioning của S3 và có một bucket policy cấp quyền một tiền tố cho tài khoản đối tác. Cái gì KHÔNG đi theo?',
          ),
          options: [
            B('Nothing important: object metadata, ACLs and bucket policies all copy, and R2 stores prior versions under the same key with a version id', 'Không có gì quan trọng: metadata object, ACL và bucket policy đều được chép, còn R2 lưu các phiên bản cũ dưới cùng key kèm một version id'),
            B('The Cache-Control and Content-Type headers, which have to be reapplied afterwards with a copy-onto-itself pass, though the custom metadata does travel', 'Các header Cache-Control và Content-Type, phải áp lại sau bằng một lượt copy đè lên chính nó, còn metadata tuỳ biến thì có đi theo'),
            B('Only the versioning history, because access primitives are portable across S3-compatible providers and get recreated automatically from the source policy document', 'Chỉ có lịch sử phiên bản, vì các nguyên hàm về quyền truy cập di chuyển được giữa các nhà cung cấp S3-compatible và được dựng lại tự động từ tài liệu chính sách của nguồn'),
            B('The access primitives and the version history: ACLs, bucket policies and replication rules are not copied, and since R2 has no versioning only the latest version of each key lands', 'Các nguyên hàm về quyền và lịch sử phiên bản: ACL, bucket policy và quy tắc nhân bản đều không được chép, và vì R2 không có versioning nên chỉ bản mới nhất của mỗi key sang được'),
          ],
          correct: 3,
          explanation: EX(
            'Lesson 8.1 lists what does and does not travel, and the split is principled: bytes and per-object metadata copy (ETag, Content-Type, Content-Encoding, Cache-Control and <code>x-amz-meta-*</code> all come across), while anything that describes WHO MAY DO WHAT does not, because R2\'s access model is different — tokens with scopes rather than IAM principals and bucket policy documents. The versioning half is the one that loses data rather than configuration: prior versions are simply not represented at the destination, so if the source relied on versioning as its undo history, that history has to be exported separately before the source bucket is deleted.',
            'Bài 8.1 liệt kê thứ gì đi theo và thứ gì không, và ranh giới ấy có nguyên tắc: số byte và metadata theo từng object thì được chép (ETag, Content-Type, Content-Encoding, Cache-Control và <code>x-amz-meta-*</code> đều sang), còn mọi thứ mô tả AI ĐƯỢC LÀM GÌ thì không, vì mô hình quyền của R2 khác hẳn — token có phạm vi chứ không phải chủ thể IAM và tài liệu bucket policy. Nửa về versioning mới là nửa làm mất DỮ LIỆU chứ không phải mất cấu hình: các phiên bản cũ đơn giản là không được biểu diễn ở đích, nên nếu nguồn từng dựa vào versioning làm lịch sử hoàn tác thì phải xuất riêng lịch sử ấy ra trước khi xoá bucket nguồn.',
          ),
        }),

        mcq({
          prompt: B(
            'The copier offers two overwrite policies: <b>Skip if exists</b> and <b>Overwrite always</b>. A first run died halfway; the destination also holds a few hundred objects that the app\'s dual-write has been writing since the run began. Which policy for the re-run, and why?',
            'Công cụ chép cho hai lựa chọn ghi đè: <b>Skip if exists</b> và <b>Overwrite always</b>. Lượt chạy đầu chết giữa chừng; ở đích còn có vài trăm object mà lượt ghi kép của ứng dụng đã ghi vào kể từ lúc lượt chạy ấy bắt đầu. Chọn cái nào cho lượt chạy lại, và vì sao?',
          ),
          options: [
            B('Skip if exists, because the destination is not empty and skipping is always the safe choice when you cannot be sure which side is newer', 'Skip if exists, vì đích không rỗng và bỏ qua luôn là lựa chọn an toàn khi bạn không chắc bên nào mới hơn'),
            B('Skip if exists, because the dual-write objects are newer than anything the copier would bring and overwriting them would roll the destination backwards', 'Skip if exists, vì các object từ lượt ghi kép mới hơn mọi thứ công cụ chép mang sang, và ghi đè lên chúng là kéo đích lùi lại'),
            B('Neither: delete the destination bucket first, then re-run with Skip if exists, which is both the cheapest and the most predictable path', 'Không cái nào: xoá bucket đích trước đã, rồi chạy lại với Skip if exists, đó là con đường vừa rẻ nhất vừa dễ đoán nhất'),
            B('Overwrite always, and accept the extra Class A cost — with a non-empty destination, Skip may keep a stale copy of an object that was re-uploaded on the source, so only Overwrite guarantees the destination matches the source at the end of the run', 'Overwrite always, và chấp nhận phần chi phí Class A tăng thêm — với một đích không rỗng thì Skip có thể giữ lại một bản cũ của object đã được tải lại ở nguồn, nên chỉ Overwrite mới bảo đảm cuối lượt chạy thì đích khớp nguồn')
          ],
          correct: 3,
          explanation: EX(
            'Lesson 8.1 splits it on exactly this condition: with an empty destination the flag is irrelevant and Skip makes a resume free, while with a non-empty destination Skip is usually wrong. Option D states the one real risk of overwriting and it is the reason this is a judgement call, not a rule — but the copier\'s snapshot and the dual-write both derive from the same source object, so overwriting converges rather than regressing, whereas skipping can leave a genuinely stale copy that nothing will ever revisit. Option C is the trap the lesson names explicitly: delete-then-re-run opens a window during which readers get 404s, which is worse than paying for extra writes.',
            'Bài 8.1 chia đôi đúng theo điều kiện này: với đích rỗng thì cái cờ ấy không quan trọng và Skip làm cho việc chạy tiếp thành miễn phí, còn với đích không rỗng thì Skip thường là sai. Lựa chọn D nêu đúng rủi ro có thật của việc ghi đè, và đó là lý do đây là chuyện phải cân nhắc chứ không phải một quy tắc — nhưng ảnh chụp của công cụ chép và lượt ghi kép đều dẫn xuất từ cùng một object nguồn, nên ghi đè là hội tụ chứ không phải thụt lùi, trong khi bỏ qua có thể để lại một bản thật sự cũ mà không gì quay lại thăm nữa. Lựa chọn C là cái bẫy bài học gọi thẳng tên: xoá rồi chạy lại mở ra một khoảng thời gian mà người đọc nhận 404, tệ hơn hẳn việc trả tiền cho vài lượt ghi thêm.',
          ),
        }),

        mcq({
          prompt: B(
            'The IAM policy for the migration is being written. Which shape does Lesson 8.1 give, and why does the resource list have two entries?' + code(
              '"Action": ["s3:GetObject", "s3:ListBucket"],\n' +
              '"Resource": [\n' +
              '  "arn:aws:s3:::my-source-bucket",\n' +
              '  "arn:aws:s3:::my-source-bucket/*"\n' +
              ']',
            ),
            'Chính sách IAM cho cuộc migration đang được viết. Bài 8.1 cho hình dạng nào, và vì sao danh sách resource lại có hai mục?' + code(
              '"Action": ["s3:GetObject", "s3:ListBucket"],\n' +
              '"Resource": [\n' +
              '  "arn:aws:s3:::my-source-bucket",\n' +
              '  "arn:aws:s3:::my-source-bucket/*"\n' +
              ']',
            ),
          ),
          options: [
            B('The second entry is redundant defensive syntax; a single bucket ARN already covers every object inside it, and the wildcard form is kept only for older policy parsers', 'Mục thứ hai là cú pháp phòng thủ thừa; một ARN bucket đơn lẻ đã phủ mọi object bên trong nó, dạng có dấu sao chỉ được giữ lại cho những bộ phân tích chính sách đời cũ'),
            B('The two entries are two different resources: <code>ListBucket</code> acts on the BUCKET while <code>GetObject</code> acts on the OBJECTS, so a policy naming only one of them lets the copier enumerate but not read, or read but not enumerate', 'Hai mục là hai resource khác nhau: <code>ListBucket</code> tác động lên BUCKET còn <code>GetObject</code> tác động lên các OBJECT, nên một chính sách chỉ nêu một trong hai sẽ cho công cụ chép liệt kê mà không đọc được, hoặc đọc được mà không liệt kê được'),
            B('The first entry grants the copier the right to create the destination bucket, and the second grants it read access to the source objects', 'Mục đầu cấp cho công cụ chép quyền tạo bucket đích, còn mục sau cấp quyền đọc các object nguồn'),
            B('Both entries are needed because AWS evaluates the shorter one for GET and the longer one for HEAD, and the copier issues both request types', 'Cả hai mục đều cần vì AWS xét mục ngắn cho GET và mục dài cho HEAD, mà công cụ chép phát ra cả hai loại request'),
          ],
          correct: 1,
          explanation: EX(
            'This is a small, exact fact that costs an afternoon when you get it wrong, and it generalises past migration: bucket-level actions and object-level actions take different ARNs, so a policy is not "one resource with two spellings". The failure it produces is characteristic — the copier starts, lists nothing, and reports zero objects with no error, or lists everything and then fails on every read. The lesson pairs this with a second discipline worth keeping: generate a MIGRATION-SPECIFIC key rather than reusing the application\'s, so revoking it when the job finishes touches nothing else.',
            'Đây là một sự thật nhỏ và chính xác, sai nó thì mất cả buổi chiều, và nó tổng quát ra ngoài phạm vi migration: các hành động ở cấp bucket và ở cấp object nhận những ARN khác nhau, nên một chính sách không phải là "một resource viết theo hai kiểu". Kiểu hỏng nó sinh ra rất đặc trưng — công cụ chép khởi động, không liệt kê được gì, rồi báo không object nào mà chẳng có lỗi nào; hoặc liệt kê được hết rồi hỏng ở mọi lượt đọc. Bài học ghép chuyện này với một kỷ luật thứ hai đáng giữ: hãy sinh một khoá RIÊNG CHO MIGRATION chứ đừng dùng lại khoá của ứng dụng, để lúc job xong mà thu hồi nó thì không đụng tới thứ gì khác.',
          ),
        }),

        mcq({
          prompt: B(
            'A team budgets for moving 2.8 TB from S3 to R2. Using the published rates ($0.09/GB S3 egress, $0.0004 per thousand S3 GET requests, and no charge for the copier itself), which line items should appear in the plan?',
            'Một nhóm lập ngân sách để chuyển 2,8 TB từ S3 sang R2. Dùng bảng giá công bố (0,09 $/GB egress của S3, 0,0004 $ cho mỗi nghìn request GET của S3, và công cụ chép thì không tính tiền), kế hoạch nên có những dòng nào?',
          ),
          options: [
            B('Nothing at all: the copier is free and R2 does not charge for ingress, so a migration to R2 costs nothing beyond the storage you were going to pay for anyway', 'Không dòng nào cả: công cụ chép miễn phí và R2 không tính tiền chiều vào, nên chuyển sang R2 không tốn gì ngoài khoản lưu trữ vốn dĩ vẫn phải trả'),
            B('Double storage for the overlap period only, because transfer between two major clouds is settled by peering agreements rather than billed to customers', 'Chỉ tốn tiền lưu trữ gấp đôi trong giai đoạn chồng lấn, vì việc truyền dữ liệu giữa hai đám mây lớn được giải quyết bằng thoả thuận peering chứ không tính vào hoá đơn khách hàng'),
            B('A Cloudflare ingress charge of roughly $258, since the receiving side pays for a cross-provider transfer of this size', 'Một khoản phí chiều vào của Cloudflare chừng 258 $, vì bên nhận trả tiền cho một lượt chuyển liên nhà cung cấp cỡ này'),
            B('An AWS egress charge of roughly $258 one time, plus the Class B reads on the AWS side for the 4.1 million objects, plus the ongoing R2 storage — the copier being free does not make the migration free', 'Một khoản egress của AWS chừng 258 $ trả một lần, cộng phần đọc Class B phía AWS cho 4,1 triệu object, cộng khoản lưu trữ R2 về sau — công cụ chép miễn phí không làm cho cuộc migration thành miễn phí')
          ],
          correct: 3,
          explanation: EX(
            'The arithmetic Lesson 8.1 does: 2,867 GB × $0.09 = $258.03 to AWS, $0 to Cloudflare. Lesson 10.1 files "migrating S3 to R2 costs nothing" in Column C — always wrong — for precisely this reason: the copier is free, the DATA LEAVING AWS is not. The second half of the correct answer is the part people forget, and Lesson 8.1 flags it as a trap: reading 4.1 million objects is 4.1 million Class B requests on the source side, and they land on the AWS invoice for the month of the migration, in a line nobody was watching. The double-storage period is real too, but it is a consequence of running both buckets, not of the transfer.',
            'Phép tính bài 8.1 làm: 2.867 GB × 0,09 $ = 258,03 $ trả cho AWS, 0 $ cho Cloudflare. Bài 10.1 xếp câu "chuyển S3 sang R2 không tốn gì" vào Cột C — luôn luôn sai — đúng vì lý do này: công cụ chép miễn phí, còn DỮ LIỆU RỜI KHỎI AWS thì không. Nửa sau của đáp án đúng là phần người ta hay quên, và bài 8.1 đánh dấu nó là một cái bẫy: đọc 4,1 triệu object là 4,1 triệu request Class B phía nguồn, và chúng đáp xuống hoá đơn AWS của đúng tháng migration, ở một dòng không ai ngó tới. Giai đoạn tốn tiền lưu trữ gấp đôi cũng có thật, nhưng đó là hệ quả của việc chạy hai bucket cùng lúc chứ không phải của việc truyền dữ liệu.',
          ),
        }),

        mcq({
          prompt: B(
            'Midway through a large migration, the dashboard shows a subset of keys stuck in "retrying" and throughput drops to a fraction of the expected rate. Lesson 8.1 names the cause. What is it, and what can actually be done?',
            'Giữa chừng một cuộc migration lớn, bảng điều khiển cho thấy một phần các key kẹt ở trạng thái "retrying" và thông lượng tụt xuống một phần nhỏ so với mức mong đợi. Bài 8.1 gọi tên nguyên nhân. Đó là gì, và thật ra làm được gì?',
          ),
          options: [
            B('The destination is throttling ingest because a single R2 bucket has a fixed write ceiling, so splitting the destination into several buckets by prefix and re-pointing the copier at them restores the expected rate', 'Đích đang bóp chiều vào vì một bucket R2 đơn lẻ có trần ghi cố định, nên chia đích ra thành nhiều bucket theo tiền tố rồi chĩa công cụ chép sang chúng sẽ khôi phục được tốc độ mong đợi'),
            B('A transient network partition between the two providers, which the retry counter is faithfully reporting; pausing the migration for an hour and resuming it afterwards almost always clears the condition without any configuration change', 'Một sự cố chia cắt mạng tạm thời giữa hai nhà cung cấp, và bộ đếm thử lại đang phản ánh trung thực chuyện đó; dừng cuộc migration một tiếng rồi chạy tiếp sau đó gần như lúc nào cũng hết mà chẳng phải đổi cấu hình gì'),
            B('Rate-limit thrash on the SOURCE: S3 scales request capacity per prefix and a flat key space hits the per-prefix ceiling, so the copier backs off and retries — the tool is already respectful, and the lever is a support request to raise the source limits before the migration, not a setting in the copier', 'Bóp tốc độ ở phía NGUỒN: S3 mở rộng năng lực xử lý request theo từng tiền tố, và một không gian key phẳng sẽ chạm trần theo tiền tố ấy, nên công cụ chép lùi lại rồi thử lại — bản thân công cụ đã lịch sự rồi, và cần gạt là một yêu cầu hỗ trợ để nâng giới hạn phía nguồn TRƯỚC cuộc migration, chứ không phải một thiết lập trong công cụ'),
            B('The source objects are encrypted with a customer-managed key, so every read needs its own decrypt call before the bytes can be handed over, and the KMS request-per-second limit rather than the storage service is what the copier is actually queueing behind', 'Các object nguồn được mã hoá bằng một khoá do khách quản lý, nên mỗi lượt đọc cần một lời gọi giải mã riêng trước khi giao được số byte đi, và thứ mà công cụ chép thật sự đang xếp hàng chờ là giới hạn request mỗi giây của KMS chứ không phải dịch vụ lưu trữ')
          ],
          correct: 2,
          explanation: EX(
            'The lesson gives the number — around 5,500 GET/s per prefix on S3 — and the honest advice, which is that there is not much to do inside the tool. What is worth taking away is the asymmetry: the constraint lives on the source, so the fix has to be arranged with the source provider before you start, and on a bucket under 100k objects that finishes quickly you can simply ignore it. Option D describes a real and separate failure the same lesson lists: objects encrypted with a KMS key the copier\'s role cannot decrypt ERROR OUT and get skipped, appearing in the dashboard as failures rather than as slow retries. The symptom distinguishes them.',
            'Bài học cho con số — chừng 5.500 GET/s trên mỗi tiền tố ở S3 — và lời khuyên thật thà, rằng bên trong công cụ thì chẳng làm được mấy. Thứ đáng mang đi là sự bất đối xứng: ràng buộc nằm ở phía NGUỒN, nên cách gỡ phải thu xếp với nhà cung cấp nguồn trước khi bắt đầu, và với một bucket dưới 100 nghìn object chạy xong nhanh thì cứ mặc kệ nó. Lựa chọn D mô tả một kiểu hỏng có thật và tách bạch mà cùng bài học ấy liệt kê: object mã hoá bằng khoá KMS mà vai trò của công cụ chép không giải mã được sẽ BÁO LỖI rồi bị bỏ qua, hiện lên bảng điều khiển dưới dạng thất bại chứ không phải những lượt thử lại chậm chạp. Triệu chứng phân biệt được hai thứ.',
          ),
        }),

        mcq({
          prompt: B(
            'Halfway through a 22-hour migration someone rotates the AWS access key. Every object starts erroring with Access Denied. What is the correct recovery?',
            'Giữa một cuộc migration 22 tiếng, có người luân chuyển khoá truy cập AWS. Mọi object bắt đầu báo lỗi Access Denied. Cách khôi phục đúng là gì?',
          ),
          options: [
            B('Restore read permission for the migration user; the copier resumes from where it stopped on its own, and no restart is needed', 'Khôi phục quyền đọc cho người dùng migration; công cụ chép tự chạy tiếp từ chỗ nó dừng, không cần khởi động lại'),
            B('Restore the permission and restart the migration from the beginning, since a copier cannot resume a job whose credentials changed mid-run', 'Khôi phục quyền rồi chạy lại cuộc migration từ đầu, vì một công cụ chép không thể tiếp tục một job đã đổi thông tin xác thực giữa chừng'),
            B('Delete the destination bucket and start over, because the objects copied under the old key are attributed to a principal that no longer exists', 'Xoá bucket đích rồi làm lại, vì các object đã chép dưới khoá cũ đang được quy cho một chủ thể không còn tồn tại'),
            B('Nothing: the copier holds a session token issued at the start, so the errors are unrelated to the rotation and point at a bucket policy change instead', 'Không cần làm gì: công cụ chép giữ một token phiên cấp từ lúc bắt đầu, nên các lỗi ấy không liên quan tới việc luân chuyển và chỉ ra một thay đổi bucket policy'),
          ],
          correct: 0,
          explanation: EX(
            'This is the second failure mode in Lesson 8.1, and the reassuring part is the design: the copier keeps its own work queue, so restoring access lets it pick up rather than start over. Two things follow. First, the migration key must be one nobody else will touch — this failure comes from someone rotating a key on a schedule without knowing a job depended on it, which is an argument for a migration-specific key with its own TTL. Second, the errors are informative: <code>AccessDenied</code> on EVERY object at once is a credential or policy event, whereas errors on a scattered subset are the KMS or rate-limit cases.',
            'Đây là kiểu hỏng thứ hai ở bài 8.1, và phần yên tâm nằm ở thiết kế: công cụ chép giữ hàng đợi công việc của riêng nó, nên khôi phục quyền là nó đi tiếp chứ không làm lại từ đầu. Hai điều đi ra từ đó. Một, khoá dùng cho migration phải là khoá không ai khác đụng vào — kiểu hỏng này đến từ việc ai đó luân chuyển một khoá theo lịch mà không biết có một job đang phụ thuộc vào nó, và đó là lý lẽ cho một khoá riêng cho migration kèm TTL của chính nó. Hai, bản thân các lỗi ấy cũng nói lên điều gì đó: <code>AccessDenied</code> trên MỌI object cùng lúc là một sự kiện về thông tin xác thực hay chính sách, còn lỗi rải rác ở một phần nhỏ mới là ca KMS hoặc ca bị bóp tốc độ.',
          ),
        }),

        mcq({
          prompt: B(
            'In the three-phase cutover of Lesson 8.2, reads flip to the new bucket in Phase 2 while writes stay primary on the old one until Phase 3. Why that order?',
            'Trong cuộc chuyển đổi ba giai đoạn ở bài 8.2, việc ĐỌC chuyển sang bucket mới ở giai đoạn 2 còn việc GHI vẫn lấy bucket cũ làm chính cho tới giai đoạn 3. Vì sao lại theo thứ tự đó?',
          ),
          options: [
            B('Because reads are the higher-risk change — users notice a broken image within seconds, while a broken write is invisible until someone looks — so you test reads first while the old bucket is still authoritative and the rollback is one deploy', 'Vì đọc mới là thay đổi rủi ro hơn — người dùng nhận ra một tấm ảnh hỏng trong vài giây, còn một lượt ghi hỏng thì vô hình cho tới khi có người đi tìm — nên hãy kiểm việc đọc trước trong lúc bucket cũ vẫn là nguồn có thẩm quyền và việc quay lui chỉ là một lượt triển khai'),
            B('Because a write to the new bucket cannot succeed until every historical object has been copied, so writes are technically blocked until the backfill completes', 'Vì một lượt ghi vào bucket mới không thể thành công cho tới khi mọi object lịch sử đã được chép sang, nên về mặt kỹ thuật thì việc ghi bị chặn cho tới lúc lượt nạp nền xong'),
            B('Because reads are cheaper than writes, so an error during the read phase costs less money than the same error during the write phase', 'Vì đọc rẻ hơn ghi, nên một lỗi trong giai đoạn đọc tốn ít tiền hơn đúng lỗi đó trong giai đoạn ghi'),
            B('Because the read-fallback needs the old bucket to be the write primary in order to know which key to fall back to, and that dependency dissolves only in Phase 3', 'Vì lượt đọc dự phòng cần bucket cũ làm nơi ghi chính thì mới biết phải quay về key nào, và sự phụ thuộc ấy chỉ tan đi ở giai đoạn 3'),
          ],
          correct: 0,
          explanation: EX(
            'Lesson 8.2 puts it plainly — users notice broken reads faster than broken writes — and the phase ordering is built to keep the safety net in place while you take the visible risk. In Phase 2 reads go to R2 first and fall back to S3 on a miss, while S3 remains the authoritative write target, so a serious problem is one deploy away from being undone. Option B inverts the point of the read-fallback: writes to the new bucket have been happening since Phase 1 through the dual-write, and the whole reason the fallback exists is that the backfill is NOT complete. Option C compares the wrong quantity — the risk here is user-visible breakage, not the per-request rate.',
            'Bài 8.2 nói thẳng — người dùng nhận ra lượt đọc hỏng nhanh hơn lượt ghi hỏng — và thứ tự các giai đoạn được dựng lên để giữ tấm lưới an toàn còn nguyên trong lúc bạn nhận lấy rủi ro nhìn thấy được. Ở giai đoạn 2, việc đọc đi vào R2 trước rồi quay về S3 khi trượt, còn S3 vẫn là đích ghi có thẩm quyền, nên một vấn đề nghiêm trọng chỉ cách việc được gỡ bỏ đúng một lượt triển khai. Lựa chọn B lộn ngược ý nghĩa của lượt đọc dự phòng: việc ghi vào bucket mới đã diễn ra từ giai đoạn 1 qua lượt ghi kép, và toàn bộ lý do lượt dự phòng tồn tại chính là vì lượt nạp nền CHƯA xong. Lựa chọn C so nhầm đại lượng — rủi ro ở đây là chuyện hỏng mà người dùng nhìn thấy, không phải đơn giá mỗi request.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 8.2 works through this sequence during a dual-write:' + code(
              'Client A writes "photo.jpg" v1;  30 s later Client B writes v2.\n' +
              'A -> S3 put v1  (400 ms)\n' +
              'A -> R2 put v1  (fire-and-forget, completes at 600 ms)\n' +
              'B -> S3 put v2  (400 ms, completes at 800 ms)\n' +
              'B -> R2 put v2  (fire-and-forget, completes at 1000 ms)',
            ) + 'What is the hazard, and what is the only fix the lesson accepts?',
            'Bài 8.2 đi qua trình tự sau trong lúc ghi kép:' + code(
              'Client A ghi "photo.jpg" v1;  30 giay sau Client B ghi v2.\n' +
              'A -> S3 put v1  (400 ms)\n' +
              'A -> R2 put v1  (ban di quen, xong o moc 600 ms)\n' +
              'B -> S3 put v2  (400 ms, xong o moc 800 ms)\n' +
              'B -> R2 put v2  (ban di quen, xong o moc 1000 ms)',
            ) + 'Mối nguy là gì, và cách sửa duy nhất mà bài học chấp nhận?',
          ),
          options: [
            B('There is no hazard in this trace: the R2 writes complete in the same order as the S3 writes, so both buckets end on v2', 'Trong vệt này không có nguy cơ nào: các lượt ghi vào R2 hoàn tất cùng thứ tự với các lượt ghi vào S3, nên cả hai bucket đều dừng ở v2'),
            B('The hazard is the fire-and-forget pattern itself; awaiting both writes with <code>Promise.all</code> removes it and the extra latency is the price of correctness', 'Mối nguy nằm ở chính lối bắn đi quên; chờ cả hai lượt ghi bằng <code>Promise.all</code> là gỡ được, và độ trễ thêm ra là cái giá của sự đúng đắn'),
            B('Nothing enforces the order of the two secondary writes, so a fraction of concurrent overwrites leaves S3 on v2 and R2 on v1 — the buckets diverge silently, and only a reconciliation comparing ETags on recently-modified keys finds it', 'Không có gì bắt buộc thứ tự của hai lượt ghi phụ, nên một phần nhỏ trong các lượt ghi đè đồng thời sẽ để S3 ở v2 còn R2 ở v1 — hai bucket lệch nhau trong im lặng, và chỉ một lượt đối soát so ETag trên những key vừa sửa gần đây mới tìm ra'),
            B('The hazard is that R2 lags S3 by 200 ms, so a read arriving in that window sees stale content; adding a 500 ms delay before the read-fallback removes it', 'Mối nguy là R2 chậm hơn S3 200 ms, nên một lượt đọc rơi vào cửa sổ ấy sẽ thấy nội dung cũ; thêm một khoảng chờ 500 ms trước lượt đọc dự phòng là hết'),
          ],
          correct: 2,
          explanation: EX(
            'The trace in the question is the benign case — the lesson\'s point is that nothing guarantees it. Two independent fire-and-forget requests can complete in either order, so with enough concurrent overwrites some fraction ends with the two buckets holding different bytes for the same key, and nothing logs it. Option B is the fix the lesson explicitly rejects: <code>Promise.all</code> means a brief outage on the destination turns every upload in the app into a 500, which trades a rare silent divergence for a frequent loud failure. The accepted answer is to let it happen and then find it — a reconciliation pass over recently-modified keys, comparing ETags, after the backfill completes.',
            'Vệt trong đề chính là ca lành — ý của bài học là chẳng có gì bảo đảm nó xảy ra như vậy. Hai request bắn đi quên độc lập có thể hoàn tất theo thứ tự nào cũng được, nên với đủ nhiều lượt ghi đè đồng thời thì một phần trong số đó sẽ kết thúc với hai bucket giữ số byte khác nhau cho cùng một key, mà chẳng có gì ghi lại. Lựa chọn B là cách sửa mà bài học bác bỏ thẳng: <code>Promise.all</code> nghĩa là một sự cố ngắn ở phía đích sẽ biến mọi lượt tải lên của ứng dụng thành 500, tức là đánh đổi một sự lệch âm thầm hiếm gặp lấy một cú hỏng ồn ào thường xuyên. Đáp án được chấp nhận là cứ để nó xảy ra rồi đi tìm — một lượt đối soát trên những key vừa sửa gần đây, so ETag, sau khi lượt nạp nền hoàn tất.',
          ),
        }),

        mcq({
          prompt: B(
            'The Phase 2 read path is written like this:' + code(
              'try {\n' +
              '  return await readFrom(r2, key);\n' +
              '} catch (err) {\n' +
              "  if (err.name !== 'NoSuchKey') throw err;\n" +
              '  return await readFrom(s3, key);\n' +
              '}',
            ) + 'A reviewer proposes deleting the <code>if</code> so that ANY error falls back to S3, "to be safe". What breaks?',
            'Đường đọc ở giai đoạn 2 được viết như sau:' + code(
              'try {\n' +
              '  return await readFrom(r2, key);\n' +
              '} catch (err) {\n' +
              "  if (err.name !== 'NoSuchKey') throw err;\n" +
              '  return await readFrom(s3, key);\n' +
              '}',
            ) + 'Một người review đề xuất bỏ câu <code>if</code> đi để MỌI lỗi đều quay về S3, "cho chắc". Cái gì hỏng?',
          ),
          options: [
            B('Nothing breaks; falling back on every error is strictly safer, and the only cost is a few extra reads from S3 while the destination is unhealthy', 'Không gì hỏng cả; quay về ở mọi lỗi thì an toàn hơn hẳn, và cái giá duy nhất là vài lượt đọc thêm từ S3 trong lúc bên đích chưa khoẻ'),
            B('The fallback would start serving objects that were deliberately deleted from the destination, resurrecting content that a deletion request had removed', 'Lượt dự phòng sẽ bắt đầu phục vụ những object đã bị cố ý xoá khỏi đích, làm sống lại nội dung mà một yêu cầu xoá đã gỡ đi'),
            B('An expired token, a signature problem or a timeout on the destination would be swallowed as "not migrated yet": every read quietly succeeds from the old bucket, the miss metric climbs, and a broken destination looks exactly like an incomplete backfill until the day you delete the source', 'Một token hết hạn, một lỗi chữ ký hay một lượt hết thời gian chờ ở phía đích sẽ bị nuốt thành "chưa migrate": mọi lượt đọc lặng lẽ thành công từ bucket cũ, chỉ số trượt leo lên, và một cái đích đang hỏng trông y hệt một lượt nạp nền chưa xong — cho tới ngày bạn xoá nguồn'),
            B('The <code>NoSuchKey</code> check is what keeps the opportunistic backfill from re-uploading objects that already exist, so removing it doubles the write cost of Phase 2', 'Phép kiểm <code>NoSuchKey</code> chính là thứ ngăn lượt nạp nền cơ hội tải lại những object vốn đã có, nên bỏ nó đi là nhân đôi chi phí ghi của giai đoạn 2'),
          ],
          correct: 2,
          explanation: EX(
            'The narrow filter is what makes the miss metric mean something. Lesson 8.2 uses <code>storage.r2_miss</code> as the go/no-go signal for Phase 3 — you move on when it is stable under 0.01% for 48 hours — and that only works if a miss means "this key is not on the destination yet". Broaden the catch and the counter starts including "the destination is refusing us", which is a completely different problem with the same shape, and the fallback hides it perfectly because every user request still succeeds. This is the general form of a fallback hazard: a fallback that catches too much converts an outage into a metric nobody reads.',
            'Cái bộ lọc hẹp ấy chính là thứ làm cho chỉ số trượt có ý nghĩa. Bài 8.2 dùng <code>storage.r2_miss</code> làm tín hiệu đi hay dừng cho giai đoạn 3 — bạn đi tiếp khi nó ổn định dưới 0,01% suốt 48 giờ — và điều đó chỉ đúng nếu một lượt trượt nghĩa là "key này chưa có ở đích". Nới rộng câu catch ra thì bộ đếm bắt đầu gộp cả nghĩa "bên đích đang từ chối chúng ta", một vấn đề hoàn toàn khác nhưng cùng hình dạng, và lượt dự phòng che nó đi hoàn hảo vì mọi request của người dùng vẫn thành công. Đây là dạng tổng quát của mối nguy từ một lượt dự phòng: một lượt dự phòng bắt quá nhiều thứ sẽ biến một sự cố ngừng dịch vụ thành một chỉ số không ai đọc.',
          ),
        }),

        mcq({
          prompt: B(
            'The verification script in Lesson 8.3 compares ETags across 4.1 million keys by calling HeadObject on both sides. Someone objects that this is too expensive to run on every migration. Using the published rates, what does it actually cost, and why is that the design?',
            'Script kiểm chứng ở bài 8.3 so ETag trên 4,1 triệu key bằng cách gọi HeadObject ở cả hai phía. Có người phản đối rằng chạy cái này cho mọi cuộc migration thì quá tốn. Dùng bảng giá công bố, thật ra nó tốn bao nhiêu, và vì sao lại thiết kế như vậy?',
          ),
          options: [
            B('Around $5 in total — HeadObject is Class B on both sides and transfers no body — which is exactly why the check is run over 100% of keys rather than a sample', 'Tổng cộng khoảng 5 $ — HeadObject là Class B ở cả hai phía và không chuyển thân dữ liệu — và đó chính là lý do phép kiểm này chạy trên 100% số key chứ không chạy trên một mẫu'),
            B('Around $37 in total, because HeadObject is billed as a Class A operation on the destination side where the objects were just written', 'Tổng cộng khoảng 37 $, vì HeadObject bị tính là thao tác Class A ở phía đích, nơi các object vừa mới được ghi vào'),
            B('Around $370 plus egress, because reading an ETag requires fetching the object header block, which counts as a partial download', 'Khoảng 370 $ cộng egress, vì đọc một ETag đòi phải lấy về khối header của object, và nó được tính như một lượt tải về một phần'),
            B('Nothing, because HeadObject is free on both providers — which is why the same script can be scheduled hourly forever', 'Không tốn gì, vì HeadObject miễn phí trên cả hai nhà cung cấp — và vì thế cùng script ấy hẹn giờ chạy mỗi tiếng mãi mãi cũng được'),
          ],
          correct: 0,
          explanation: EX(
            'The lesson does the sum: 4.1 million Class B on each side is about $3.20 on R2 plus $1.60 on S3, under $5 for a definitive list of every key that did not match. The cheapness IS the argument — at that price there is no reason to sample, so Layer 1 covers everything and the expensive byte-comparison in Layer 2 can be a few hundred stratified objects. The distractor worth understanding is C: HeadObject returns the same headers as a GET with no body, so there is no transfer and no egress, which is also why it is the right way to ask "does this exist" anywhere in this course.',
            'Bài học làm phép cộng: 4,1 triệu lượt Class B mỗi phía là chừng 3,20 $ trên R2 cộng 1,60 $ trên S3, chưa tới 5 $ cho một danh sách dứt khoát mọi key không khớp. Chính sự rẻ ấy LÀ lý lẽ — với cái giá đó thì không có lý do gì để lấy mẫu, nên lớp 1 phủ hết mọi thứ và phần so từng byte tốn kém ở lớp 2 chỉ cần vài trăm object lấy theo tầng. Phương án nhiễu đáng hiểu là C: HeadObject trả về đúng những header như một lệnh GET nhưng không có thân, nên không có chuyển dữ liệu và không có egress — cũng là lý do nó là cách đúng để hỏi "cái này có tồn tại không" ở mọi chỗ trong khoá học này.',
          ),
        }),

        mcq({
          prompt: B(
            'Layer 2 of the verification is a byte-hash comparison on a SAMPLE. Lesson 8.3 insists the sample be stratified by object size rather than drawn uniformly at random. Why?',
            'Lớp 2 của lượt kiểm chứng là phép so mã băm từng byte trên một MẪU. Bài 8.3 nhất định đòi mẫu phải phân tầng theo kích thước object chứ không lấy ngẫu nhiên đều. Vì sao?',
          ),
          options: [
            B('Because hashing large objects is slow, so stratifying is a way of capping the runtime of the check while still touching every size band', 'Vì băm object lớn thì chậm, nên phân tầng là cách chặn thời gian chạy của phép kiểm mà vẫn chạm được vào mọi dải kích thước'),
            B('Because a uniform sample is dominated by the many small objects that most buckets hold, so it can miss a corruption that only affects large ones — which are exactly the multipart uploads where the copier had the most to get wrong', 'Vì một mẫu lấy đều sẽ bị chi phối bởi vô số object nhỏ mà đa số bucket đang chứa, nên nó có thể bỏ sót một lỗi hỏng chỉ xảy ra với những object lớn — đúng những lượt multipart mà công cụ chép có nhiều chỗ để làm sai nhất'),
            B('Because the destination charges by object size, so a stratified sample gives a more accurate estimate of the storage bill after the migration', 'Vì đích tính tiền theo kích thước object, nên một mẫu phân tầng cho ước lượng chính xác hơn về hoá đơn lưu trữ sau migration'),
            B('Because random sampling would repeatedly pick the same keys across runs, so stratifying is what makes two consecutive verification runs independent', 'Vì lấy mẫu ngẫu nhiên sẽ chọn đi chọn lại cùng những key qua các lượt chạy, nên phân tầng mới là thứ làm hai lượt kiểm chứng liên tiếp trở nên độc lập'),
          ],
          correct: 1,
          explanation: EX(
            'The reasoning is about where failures cluster, not about runtime. Object sizes in a real bucket span orders of magnitude with most of the count at the small end, so a uniform sample of 500 might contain no object over 50 MB at all — and the large objects are the multipart ones, which are the case with the most machinery between the source bytes and the destination bytes. The lesson\'s strata make the point concrete: 200 tiny, 200 small, 100 medium, 50 large. The same argument applies to prefixes as well as sizes, because failures cluster by upload path — the code that wrote a group of keys is what they have in common.',
            'Lý lẽ ở đây là về chỗ các lỗi tụ lại, không phải về thời gian chạy. Kích thước object trong một bucket thật trải qua nhiều bậc độ lớn với phần lớn số lượng nằm ở đầu nhỏ, nên một mẫu lấy đều 500 cái có thể không chứa nổi một object nào trên 50 MB — mà những object lớn chính là những object multipart, tức là ca có nhiều bộ máy nhất nằm giữa số byte ở nguồn và số byte ở đích. Các tầng của bài học làm ý này thành cụ thể: 200 rất nhỏ, 200 nhỏ, 100 vừa, 50 lớn. Lý lẽ ấy áp cho tiền tố cũng đúng như áp cho kích thước, vì lỗi tụ theo đường tải lên — đoạn mã đã ghi ra một nhóm key mới là thứ chúng có chung.',
          ),
        }),

        // ── Chương 9 — sách công thức chẩn đoán ─────────────────────────
        mcq({
          prompt: B(
            'A SigV4 request is signed by hand with the timestamp shifted, and sent to a live endpoint. Measured:' + code(
              'x-amz-date shifted   0 min  -> 200 OK\n' +
              'x-amz-date shifted -10 min  -> 200 OK\n' +
              'x-amz-date shifted -20 min  -> 403 RequestTimeTooSkewed\n' +
              'x-amz-date shifted +20 min  -> 403 RequestTimeTooSkewed\n' +
              '  message: The difference between the request time and the\n' +
              "           server's time is too large.",
            ) + 'A container is returning intermittent <code>SignatureDoesNotMatch</code>. What does this measurement say about checking the clock first?',
            'Một request SigV4 được ký tay với mốc thời gian dịch đi, rồi gửi tới một máy chủ đang sống. Đo thật:' + code(
              'x-amz-date dich   0 phut  -> 200 OK\n' +
              'x-amz-date dich -10 phut  -> 200 OK\n' +
              'x-amz-date dich -20 phut  -> 403 RequestTimeTooSkewed\n' +
              'x-amz-date dich +20 phut  -> 403 RequestTimeTooSkewed\n' +
              '  message: The difference between the request time and the\n' +
              "           server's time is too large.",
            ) + 'Một container đang trả <code>SignatureDoesNotMatch</code> lúc được lúc không. Phép đo này nói gì về việc đi kiểm đồng hồ trước tiên?',
          ),
          options: [
            B('That checking the clock is right: skew is the leading cause of intermittent signature failures, and the 403 above confirms the mechanism even if the code string differs by provider', 'Rằng kiểm đồng hồ là đúng: lệch giờ là nguyên nhân hàng đầu của các lỗi chữ ký chập chờn, và cái 403 ở trên xác nhận cơ chế ấy dù chuỗi mã lỗi có khác nhau theo nhà cung cấp'),
            B('That the measurement does not apply, because it used header signing while presigned URLs are what production uses, and presigned URLs have no timestamp check at all', 'Rằng phép đo này không áp dụng được, vì nó ký bằng header trong khi production dùng presigned URL, mà presigned URL thì không kiểm mốc thời gian gì cả'),
            B('That the window is 20 minutes rather than 15, so the documented figure is wrong and any skew under 20 minutes is harmless', 'Rằng cửa sổ là 20 phút chứ không phải 15, nên con số trong tài liệu là sai và mọi mức lệch dưới 20 phút đều vô hại'),
            B('That clock skew has its OWN error code, so a <code>SignatureDoesNotMatch</code> is NOT a skew symptom: inside the 15-minute window skew causes nothing at all, and outside it the server says so by name — look at the secret and at what the client changed after signing instead', 'Rằng lệch đồng hồ có mã lỗi RIÊNG, nên một cái <code>SignatureDoesNotMatch</code> KHÔNG phải triệu chứng của lệch giờ: trong cửa sổ 15 phút thì lệch chẳng gây ra gì cả, còn ngoài cửa sổ ấy thì máy chủ gọi thẳng tên nó ra — hãy đi soi cái secret và soi thứ client đã sửa sau khi ký')
          ],
          correct: 3,
          explanation: EX(
            'This measurement contradicts Lesson 9.1, which files clock skew as "CAUSE 1" under the <code>SignatureDoesNotMatch</code> branch, and the chapter quiz repeats it. The server distinguishes the two conditions itself: inside the tolerance a skewed clock produces no error at all, and outside it the response is <code>RequestTimeTooSkewed</code> with a message that names the problem. So the advice inverts — when you actually see <code>SignatureDoesNotMatch</code>, the productive checks are the secret (length and trailing whitespace) and whatever the client altered after the URL was signed. Option D is wrong on the facts and worth correcting: a presigned URL carries the timestamp in <code>X-Amz-Date</code>, and the same skew shows up as <code>AccessDenied</code> with either "Request has expired" or "Request is not valid yet" depending on direction — a third symptom of one cause.',
            'Phép đo này mâu thuẫn với bài 9.1, nơi xếp lệch đồng hồ thành "CAUSE 1" dưới nhánh <code>SignatureDoesNotMatch</code>, và bài kiểm tra của chương cũng lặp lại như vậy. Chính máy chủ phân biệt hai tình huống ấy: trong ngưỡng dung sai thì đồng hồ lệch không gây ra lỗi nào cả, còn ngoài ngưỡng thì phản hồi là <code>RequestTimeTooSkewed</code> kèm một câu gọi thẳng tên vấn đề. Nên lời khuyên bị lộn ngược — khi bạn thật sự nhìn thấy <code>SignatureDoesNotMatch</code> thì thứ đáng kiểm là cái secret (độ dài và khoảng trắng thừa ở cuối) cùng những gì client đã sửa sau khi URL được ký. Lựa chọn D sai về sự kiện và đáng đính chính: một presigned URL mang mốc thời gian trong <code>X-Amz-Date</code>, và cùng mức lệch ấy hiện ra thành <code>AccessDenied</code> kèm "Request has expired" hoặc "Request is not valid yet" tuỳ chiều — triệu chứng thứ ba của cùng một nguyên nhân.',
          ),
        }),

        mcq({
          prompt: B(
            'Two clients differ only in their credentials. Measured against the same object:' + code(
              'access key id that does not exist -> 403 InvalidAccessKeyId\n' +
              '  "The Access Key Id you provided does not exist in our records."\n\n' +
              'correct key id, wrong secret      -> 403 SignatureDoesNotMatch\n' +
              '  "The request signature we calculated does not match the\n' +
              '   signature you provided."',
            ) + 'Why is the distinction worth memorising?',
            'Hai client chỉ khác nhau ở thông tin xác thực. Đo thật trên cùng một object:' + code(
              'access key id khong ton tai -> 403 InvalidAccessKeyId\n' +
              '  "The Access Key Id you provided does not exist in our records."\n\n' +
              'key id dung, secret sai     -> 403 SignatureDoesNotMatch\n' +
              '  "The request signature we calculated does not match the\n' +
              '   signature you provided."',
            ) + 'Vì sao sự phân biệt này đáng thuộc lòng?',
          ),
          options: [
            B('Because they are the same failure and the two codes are historical accidents, so both should be handled by one retry-with-refreshed-credentials path', 'Vì đó là cùng một kiểu hỏng và hai mã lỗi chỉ là tai nạn lịch sử, nên cả hai nên được xử lý bằng một đường thử-lại-với-thông-tin-xác-thực-mới'),
            B('Because <code>InvalidAccessKeyId</code> means the credential is gone entirely — revoked, rotated or mistyped, so deploy a new one; while <code>SignatureDoesNotMatch</code> means the id is recognised and only the derived signature disagreed, so the secret half is wrong or truncated', 'Vì <code>InvalidAccessKeyId</code> nghĩa là thông tin xác thực ấy đã biến mất hẳn — bị thu hồi, bị luân chuyển hoặc gõ sai, nên hãy triển khai một cái mới; còn <code>SignatureDoesNotMatch</code> nghĩa là cái id được nhận ra và chỉ có chữ ký dẫn xuất là lệch, nên nửa secret đang sai hoặc bị cụt'),
            B('Because <code>InvalidAccessKeyId</code> is a client-side error thrown by the SDK before any request is sent, while <code>SignatureDoesNotMatch</code> comes from the server', 'Vì <code>InvalidAccessKeyId</code> là lỗi phía client do SDK ném ra trước khi có request nào được gửi, còn <code>SignatureDoesNotMatch</code> đến từ máy chủ'),
            B('Because only <code>SignatureDoesNotMatch</code> is retryable; <code>InvalidAccessKeyId</code> indicates a permanent bucket-level block that support has to lift', 'Vì chỉ <code>SignatureDoesNotMatch</code> mới thử lại được; <code>InvalidAccessKeyId</code> báo hiệu một lệnh chặn vĩnh viễn ở cấp bucket mà bộ phận hỗ trợ mới gỡ được'),
          ],
          correct: 1,
          explanation: EX(
            'Both were measured with the same client code and only the credentials swapped, so the two codes really do separate two different halves of the same secret pair. The practical value is that they point at different places: an id the server has never seen is a deployment question (which value did this container actually load, and was the token revoked?), while a signature mismatch on a recognised id is a value question — Lesson 9.1 suggests printing the LENGTH and first four characters, never the key, and notes that a real secret is 40 characters on AWS and 64 on R2, so an off-by-one length is the whole story. Neither is retryable in the sense option D means; a retry with the same wrong credential fails identically forever.',
            'Cả hai đều được đo bằng cùng đoạn mã client và chỉ đổi thông tin xác thực, nên hai mã lỗi ấy thật sự tách được hai nửa khác nhau của cùng một cặp bí mật. Giá trị thực tế là chúng chỉ vào hai chỗ khác nhau: một cái id mà máy chủ chưa từng thấy là câu hỏi về triển khai (container này thật ra đã nạp giá trị nào, và token có bị thu hồi không?), còn một cái chữ ký lệch trên một id được nhận ra là câu hỏi về giá trị — bài 9.1 gợi ý in ra ĐỘ DÀI và bốn ký tự đầu, tuyệt đối không in cả khoá, và ghi rằng một secret thật dài 40 ký tự trên AWS và 64 trên R2, nên lệch một ký tự độ dài là đã đủ cả câu chuyện. Không cái nào "thử lại được" theo nghĩa của lựa chọn D; thử lại với đúng cái thông tin xác thực sai ấy sẽ hỏng y hệt mãi mãi.',
          ),
        }),

        mcq({
          prompt: B(
            'Two 404s from the same client in the same minute. Measured:' + code(
              'GetObject Bucket="pt-lab" Key="khong-co.txt"\n' +
              '  -> 404 NoSuchKey "The specified key does not exist."\n\n' +
              'GetObject Bucket="khong-co-bucket-nay" Key="a"\n' +
              '  -> 404 NoSuchBucket "The specified bucket does not exist"',
            ) + 'Which pair of first moves matches the two codes?',
            'Hai cái 404 từ cùng một client trong cùng một phút. Đo thật:' + code(
              'GetObject Bucket="pt-lab" Key="khong-co.txt"\n' +
              '  -> 404 NoSuchKey "The specified key does not exist."\n\n' +
              'GetObject Bucket="khong-co-bucket-nay" Key="a"\n' +
              '  -> 404 NoSuchBucket "The specified bucket does not exist"',
            ) + 'Cặp hành động đầu tiên nào khớp với hai mã lỗi ấy?',
          ),
          options: [
            B('Both mean the same thing at different granularity, so a single handler that logs and returns 404 to the user is the correct response to either', 'Cả hai nói cùng một chuyện ở hai mức chi tiết khác nhau, nên một hàm xử lý duy nhất ghi log rồi trả 404 cho người dùng là phản ứng đúng cho cả hai'),
            B('<code>NoSuchKey</code> means look at your DATA — compare the key your database holds against what is really in the bucket; <code>NoSuchBucket</code> means look at your CONFIGURATION — the bucket name or the endpoint in the environment is wrong, and it will affect every request, not one', '<code>NoSuchKey</code> nghĩa là hãy soi DỮ LIỆU của bạn — đối chiếu cái key trong cơ sở dữ liệu với thứ thật sự nằm trong bucket; <code>NoSuchBucket</code> nghĩa là hãy soi CẤU HÌNH — tên bucket hoặc endpoint trong biến môi trường đang sai, và nó ảnh hưởng tới MỌI request chứ không phải một cái'),
            B('<code>NoSuchKey</code> means look at your configuration, since a wrong prefix in the environment produces a key nobody wrote; <code>NoSuchBucket</code> means look at your data, since a stale bucket name is stored per row', '<code>NoSuchKey</code> nghĩa là soi cấu hình, vì một tiền tố sai trong biến môi trường sẽ tạo ra một key không ai từng ghi; <code>NoSuchBucket</code> nghĩa là soi dữ liệu, vì tên bucket cũ được lưu theo từng hàng'),
            B('<code>NoSuchBucket</code> is usually a permissions problem in disguise, because a caller who cannot list a bucket is told it does not exist, so the first move for both is to widen the token scope', '<code>NoSuchBucket</code> thường là vấn đề quyền đội lốt, vì một người gọi không liệt kê được bucket sẽ bị nói là nó không tồn tại, nên hành động đầu tiên cho cả hai là nới phạm vi token'),
          ],
          correct: 1,
          explanation: EX(
            'The two codes differ in blast radius, which is what makes them worth separating. A missing key is one row out of sync between your database and the bucket, and Lesson 6.3 already named it — orphan B, the loud direction, one broken image. A missing bucket is every request from that process, so if you are seeing it at all, the deploy loaded the wrong environment or someone typed the endpoint by hand. Option D describes real behaviour on AWS S3 for CROSS-ACCOUNT access, where a deliberate design choice hides existence from callers with no permission — but it does not apply here, since these two responses came from a client that was fully authorised, and reaching for a wider token would be the wrong instinct in both cases.',
            'Hai mã lỗi khác nhau ở bán kính ảnh hưởng, và chính điều đó làm chúng đáng tách bạch. Một key thiếu là một hàng lệch nhịp giữa cơ sở dữ liệu và bucket, và bài 6.3 đã gọi tên rồi — mồ côi kiểu B, chiều ồn ào, một tấm ảnh hỏng. Một bucket thiếu là MỌI request từ tiến trình ấy, nên nếu bạn nhìn thấy nó thì lượt triển khai đã nạp nhầm bộ biến môi trường hoặc ai đó gõ tay cái endpoint. Lựa chọn D mô tả một hành vi có thật trên AWS S3 với truy cập CHÉO TÀI KHOẢN, nơi người ta cố ý giấu sự tồn tại khỏi những người gọi không có quyền — nhưng nó không áp vào đây, vì hai phản hồi này đến từ một client có đủ quyền, và với tay sang một token rộng hơn là bản năng sai ở cả hai ca.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 9.1 suggests this as a debugging step when a signature fails:' + code(
              "node -e 'console.log(process.env.R2_SECRET_ACCESS_KEY?.slice(0,4),\n" +
              "                     process.env.R2_SECRET_ACCESS_KEY?.length)'",
            ) + 'What two properties make this a good diagnostic, and what is the expected length?',
            'Bài 9.1 gợi ý bước gỡ lỗi sau khi một chữ ký hỏng:' + code(
              "node -e 'console.log(process.env.R2_SECRET_ACCESS_KEY?.slice(0,4),\n" +
              "                     process.env.R2_SECRET_ACCESS_KEY?.length)'",
            ) + 'Hai tính chất nào làm nó thành một phép chẩn đoán tốt, và độ dài mong đợi là bao nhiêu?',
          ),
          options: [
            B('It runs inside the container and prints the full value, which is the only way to be certain; the expected length is 40 characters for both AWS and R2', 'Nó chạy bên trong container và in ra đủ giá trị, đó là cách duy nhất để chắc chắn; độ dài mong đợi là 40 ký tự cho cả AWS lẫn R2'),
            B('It verifies the signature algorithm rather than the key, which is the more common failure; the length is irrelevant since SigV4 accepts a secret of any size', 'Nó kiểm thuật toán ký chứ không kiểm khoá, mà đó mới là kiểu hỏng phổ biến hơn; độ dài không liên quan vì SigV4 nhận secret dài ngắn thế nào cũng được'),
            B('It compares the running value against the one in the dashboard, which is what makes it conclusive; the expected length varies by token type and cannot be checked this way', 'Nó đối chiếu giá trị đang chạy với giá trị trên bảng điều khiển, và đó là thứ làm nó có tính kết luận; độ dài mong đợi thay đổi theo loại token nên không kiểm được bằng cách này'),
            B('It asks the process what it ACTUALLY loaded rather than what a file says, and it reveals a truncated or space-padded value without printing the secret; a real secret is 40 characters on AWS and 64 on R2, so any other length is the whole story', 'Nó hỏi chính tiến trình xem nó THẬT SỰ đã nạp cái gì chứ không hỏi một file nói gì, và nó lộ ra một giá trị bị cụt hay bị đệm dấu cách mà không in cả bí mật ra; một secret thật dài 40 ký tự trên AWS và 64 trên R2, nên độ dài khác đi là đã đủ cả câu chuyện')
          ],
          correct: 3,
          explanation: EX(
            'The first property is the transferable one and it recurs throughout this repo\'s history: reading a config FILE tells you what someone intended, while asking the process tells you what it got — after the deploy, the container image, the shell quoting and any layer in between have had their turn. The second is the discipline that makes it safe to run in a shared terminal. Lesson 9.1 gives the lengths (40 on AWS, 64 on R2) and its own comment is worth quoting: "Not 39. Not 41. Anything off-length is the whole story." A trailing newline picked up by a copy-paste is the classic cause, and it is invisible in every editor.',
            'Tính chất thứ nhất mới là thứ mang đi được và nó tái diễn suốt lịch sử của kho này: đọc một FILE cấu hình cho biết ai đó ĐỊNH làm gì, còn hỏi chính tiến trình thì biết nó NHẬN ĐƯỢC gì — sau khi lượt triển khai, ảnh container, cách shell bọc dấu nháy và mọi tầng nằm giữa đã lần lượt nhúng tay vào. Tính chất thứ hai là kỷ luật làm cho nó chạy được an toàn trong một terminal dùng chung. Bài 9.1 cho các con số độ dài (40 trên AWS, 64 trên R2) và chính lời chú của nó đáng trích: "Không phải 39. Không phải 41. Lệch độ dài là đã đủ cả câu chuyện." Một ký tự xuống dòng dính theo lúc chép dán là nguyên nhân kinh điển, và nó vô hình trong mọi trình soạn thảo.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 9.1\'s Layer A lists region mismatch as a cause of signature failure. A team migrating from S3 to R2 asks whether they still need to worry about it. What is the accurate answer?',
            'Lớp A của bài 9.1 liệt kê lệch region là một nguyên nhân gây hỏng chữ ký. Một nhóm đang chuyển từ S3 sang R2 hỏi họ còn phải lo về nó không. Câu trả lời chính xác là gì?',
          ),
          options: [
            B('Yes, more than before: R2 validates the region string strictly, so anything other than <code>auto</code> is rejected with a signature error', 'Có, còn hơn trước: R2 kiểm chuỗi region rất chặt, nên bất cứ giá trị nào khác <code>auto</code> đều bị từ chối bằng một lỗi chữ ký'),
            B('No, and for a reason worth understanding: SigV4 folds the region into the signing key, so on S3 a mismatch between the client\'s region and the bucket\'s produces a signature failure — R2 has one global namespace and the convention <code>auto</code>, so that whole branch of the flowchart does not apply', 'Không, và vì một lý do đáng hiểu: SigV4 nhét region vào khoá ký, nên trên S3 một sự lệch giữa region của client và region của bucket sẽ sinh ra lỗi chữ ký — còn R2 chỉ có một không gian tên toàn cục và quy ước <code>auto</code>, nên cả nhánh ấy của cây chẩn đoán không áp vào'),
            B('No, because the region field was removed from SigV4 in the version both providers now use, so it no longer participates in signing anywhere', 'Không, vì trường region đã bị bỏ khỏi SigV4 ở phiên bản mà cả hai nhà cung cấp đang dùng, nên nó không còn tham gia vào việc ký ở đâu nữa'),
            B('Yes, because the region also determines which endpoint the SDK resolves, so a wrong region on R2 sends the request to a bucket in another account', 'Có, vì region còn quyết định SDK phân giải ra endpoint nào, nên một region sai trên R2 sẽ gửi request tới một bucket ở tài khoản khác'),
          ],
          correct: 1,
          explanation: EX(
            'The region participates in the credential scope — the <code>&lt;date&gt;/&lt;region&gt;/s3/aws4_request</code> string that both sides derive the signing key from — so on S3 it is a real cause of a real signature failure, and Lesson 9.1 gives you <code>aws s3api get-bucket-location</code> to check it. On R2 there is nothing to mismatch: both sides use <code>auto</code>. Option D confuses two mechanisms: on R2 the endpoint is supplied explicitly in the client config, so the region never routes anything. And this is why an S3 client copied over with <code>region: &quot;us-east-1&quot;</code> keeps working against R2, which is confusing in its own way — the value is signed, agreed on by both sides, and simply means nothing.',
            'Region tham gia vào phạm vi thông tin xác thực — chuỗi <code>&lt;ngày&gt;/&lt;region&gt;/s3/aws4_request</code> mà cả hai phía dùng để dẫn xuất khoá ký — nên trên S3 nó là một nguyên nhân có thật của một lỗi chữ ký có thật, và bài 9.1 cho bạn lệnh <code>aws s3api get-bucket-location</code> để kiểm. Trên R2 thì chẳng có gì để lệch: cả hai phía đều dùng <code>auto</code>. Lựa chọn D nhầm lẫn hai cơ chế: trên R2 thì endpoint được khai tường minh trong cấu hình client, nên region không định tuyến gì cả. Và đó cũng là lý do một client S3 chép sang với <code>region: &quot;us-east-1&quot;</code> vẫn chạy được với R2, một chuyện gây bối rối theo kiểu riêng của nó — giá trị ấy được ký, được cả hai phía đồng ý, và đơn giản là không có nghĩa gì.',
          ),
        }),

        mcq({
          prompt: B(
            'A token\'s IAM policy allows <code>s3:GetObject</code> on <code>arn:aws:s3:::media/*</code>, and the caller still gets <code>403 AccessDenied</code> on <code>media/rieng-tu/x.pdf</code>. The signature verified. Where does Lesson 9.1 send you, and what rule decides it?',
            'Chính sách IAM của một token cho phép <code>s3:GetObject</code> trên <code>arn:aws:s3:::media/*</code>, mà người gọi vẫn nhận <code>403 AccessDenied</code> ở <code>media/rieng-tu/x.pdf</code>. Chữ ký thì hợp lệ. Bài 9.1 đưa bạn tới đâu, và quy tắc nào quyết định?',
          ),
          options: [
            B('To the client\'s retry logic: an AccessDenied with a valid signature is transient and clears on its own, so the fix is a backoff rather than a policy change', 'Tới phần logic thử lại của client: một cái AccessDenied kèm chữ ký hợp lệ là tạm thời và tự hết, nên cách sửa là một khoảng lùi chứ không phải đổi chính sách'),
            B('To the token\'s own scope only: an IAM Allow is the final word on S3-compatible services, so the policy shown must not be the one actually attached', 'Chỉ tới phạm vi của chính token: một lệnh Allow của IAM là lời cuối trên các dịch vụ S3-compatible, nên chính sách được đưa ra hẳn không phải chính sách đang thật sự gắn vào'),
            B('To the bucket policy, because an explicit Deny there overrides an IAM Allow — the signature verified, so the server knows who you are and is choosing to refuse, which is Layer B rather than Layer A', 'Tới bucket policy, vì một lệnh Deny tường minh ở đó đè lên một lệnh Allow của IAM — chữ ký đã hợp lệ nên máy chủ biết bạn là ai và đang chọn từ chối, đó là Lớp B chứ không phải Lớp A'),
            B('To the object ACL, since an object written by another principal keeps that principal as owner and no bucket-level policy can grant access to it', 'Tới ACL của object, vì một object do chủ thể khác ghi vẫn giữ chủ thể ấy làm chủ sở hữu và không bucket policy nào cấp quyền vào nó được'),
          ],
          correct: 2,
          explanation: EX(
            'The two-question triage in Lesson 9.1 splits on exactly this: a signature-family code (<code>SignatureDoesNotMatch</code>, <code>InvalidAccessKeyId</code>) is Layer A and about identity, while a plain <code>AccessDenied</code> is Layer B and about authorisation — the server agrees who you are. Within Layer B the deciding rule is that an explicit Deny beats any Allow, wherever the Allow came from, so a bucket policy with a <code>Deny</code> on a prefix silently overrides a permissive IAM policy and no amount of widening the token helps. The lesson gives <code>aws iam simulate-principal-policy</code> for the exact action and resource, which names the statement that decided it; on R2 the equivalent is reading the token\'s scope in the dashboard.',
            'Phép phân loại hai câu hỏi ở bài 9.1 chia đôi đúng chỗ này: một mã lỗi thuộc họ chữ ký (<code>SignatureDoesNotMatch</code>, <code>InvalidAccessKeyId</code>) là Lớp A và nói về danh tính, còn một cái <code>AccessDenied</code> trơn là Lớp B và nói về cấp quyền — máy chủ đồng ý bạn là ai. Trong Lớp B thì quy tắc quyết định là một lệnh Deny tường minh thắng mọi lệnh Allow, bất kể lệnh Allow ấy đến từ đâu, nên một bucket policy có <code>Deny</code> trên một tiền tố sẽ âm thầm đè lên một chính sách IAM rộng rãi và nới token bao nhiêu cũng vô ích. Bài học cho lệnh <code>aws iam simulate-principal-policy</code> với đúng hành động và đúng resource, nó gọi tên được cái mệnh đề đã quyết; trên R2 thì thứ tương đương là đọc phạm vi của token trên bảng điều khiển.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 9.1 lists three "not really 403" near-misses. Which set is right?',
            'Bài 9.1 liệt kê ba ca "suýt là 403". Bộ nào đúng?',
          ),
          options: [
            B('A 400 carrying a signature code from some SDK versions; a 200 whose object turns out not to be there on an eventually-consistent service; and a 404 NoSuchBucket that a browser console renders as "access denied"', 'Một cái 400 mang mã lỗi chữ ký ở vài phiên bản SDK; một cái 200 mà object hoá ra không có trên một dịch vụ nhất quán dần; và một cái 404 NoSuchBucket bị console của trình duyệt vẽ ra thành "access denied"'),
            B('A 401 returned when a read arrives with no signature at all; a 429 raised when the caller exceeds the per-prefix request rate; and a 500 emitted during a provider incident, all three of which the client should retry with backoff', 'Một cái 401 trả về khi một lượt đọc tới mà không mang chữ ký nào; một cái 429 bật lên khi người gọi vượt tốc độ request theo tiền tố; và một cái 500 phát ra trong lúc nhà cung cấp gặp sự cố, cả ba đều nên được client thử lại kèm khoảng lùi'),
            B('A 403 produced by the browser blocking a cross-origin request; a 403 injected by the CDN\'s bot protection before the bucket is reached; and a 403 raised by a network firewall rule between the client and the endpoint', 'Một cái 403 do trình duyệt chặn một request khác nguồn; một cái 403 do lớp chống bot của CDN chèn vào trước khi tới được bucket; và một cái 403 do một quy tắc tường lửa mạng nằm giữa client và endpoint dựng lên'),
            B('A 412 returned when an If-Match precondition fails against the stored ETag; a 416 returned when a Range header asks past the end of the object; and a 409 returned when two writers touch the same key at once', 'Một cái 412 trả về khi điều kiện If-Match không thoả so với ETag đã lưu; một cái 416 trả về khi header Range hỏi quá phần cuối của object; và một cái 409 trả về khi hai bên cùng ghi vào một key một lúc'),
          ],
          correct: 0,
          explanation: EX(
            'The three share one property: each one sends you down the 403 path while not being a 403, so the lesson groups them as traps rather than as a taxonomy. Two are worth expanding. The 200-that-did-not-store applies to eventually-consistent services and NOT to R2, which the lesson notes is strongly consistent — if you see it there, the object really is missing and the cause is elsewhere. And the browser-console case is the recurring theme of the whole chapter: Chrome prints a summary, the XML body holds the answer, and the two can disagree. A separate measurement in this exam file adds a fourth near-miss the lesson does not list — a presigned PUT URL used with GET returns <b>400</b> with <code>&lt;Code&gt;AccessDenied&lt;/Code&gt;</code>.',
            'Ba ca ấy có chung một tính chất: mỗi cái đều đẩy bạn vào đường xử lý 403 trong khi bản thân nó không phải 403, nên bài học gom chúng lại thành các cái bẫy chứ không phải một hệ phân loại. Hai ca đáng nói thêm. Ca "200 mà không lưu" áp cho các dịch vụ nhất quán dần và KHÔNG áp cho R2, thứ mà bài học ghi rõ là nhất quán mạnh — thấy nó ở đó thì object thật sự không có và nguyên nhân nằm chỗ khác. Còn ca console trình duyệt chính là chủ đề tái diễn của cả chương: Chrome in ra một bản tóm tắt, khối XML mới giữ câu trả lời, và hai thứ đó có thể mâu thuẫn nhau. Một phép đo riêng trong chính file đề này bổ sung một ca thứ tư mà bài học không liệt kê — một presigned PUT URL đem dùng bằng GET trả về <b>400</b> kèm <code>&lt;Code&gt;AccessDenied&lt;/Code&gt;</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 9.2 breaks a healthy GET into steps. Which step does connection reuse (keep-alive) remove, and which does it not touch?',
            'Bài 9.2 chia một lượt GET khoẻ mạnh thành các bước. Việc dùng lại kết nối (keep-alive) bỏ được bước nào, và không đụng được vào bước nào?',
          ),
          options: [
            B('It removes the server processing time, because a warm connection lets the storage layer keep the object metadata cached; the transfer time is unaffected', 'Nó bỏ được thời gian máy chủ xử lý, vì một kết nối đang nóng cho phép tầng lưu trữ giữ sẵn metadata của object trong cache; thời gian truyền thì không đổi'),
            B('It removes the signature computation, which is the largest client-side cost; the network steps are unaffected because they happen at the OS level', 'Nó bỏ được phần tính chữ ký, vốn là chi phí lớn nhất phía client; các bước mạng thì không đổi vì chúng diễn ra ở tầng hệ điều hành'),
            B('It removes the DNS lookup, the TCP handshake and the TLS handshake — the fixed per-connection cost — while server processing and the byte transfer stay, which is why a hot GET is roughly 20-50 ms instead of 40-100 ms', 'Nó bỏ được lượt tra DNS, bắt tay TCP và bắt tay TLS — phần chi phí cố định của mỗi kết nối — còn thời gian máy chủ xử lý và thời gian truyền byte thì vẫn còn, và đó là lý do một lượt GET nóng rơi vào chừng 20-50 ms thay vì 40-100 ms'),
            B('It removes nothing on its own — keep-alive only avoids the cost of closing the socket, and the saving appears solely under very high concurrency', 'Tự nó không bỏ được gì — keep-alive chỉ tránh được chi phí đóng socket, và khoản tiết kiệm chỉ hiện ra khi mức đồng thời rất cao')
          ],
          correct: 2,
          explanation: EX(
            'The lesson\'s breakdown gives DNS at 1-5 ms, TCP at 5-15, TLS at 20-40, signature computation at 1-3, and server processing at 10-40 — so the handshakes dominate the fixed cost and they are exactly what a reused connection skips. That is the whole reason Lesson 9.2 says to hoist the client to module scope: a new <code>S3Client</code> per request builds a new connection pool that is thrown away after one use. Option C names a real step but the wrong size — signing is a few HMAC operations, low milliseconds, and it happens per request whether or not the connection is reused. These figures are the course\'s published ones and are not re-measured here.',
            'Bảng chia của bài học cho DNS 1-5 ms, TCP 5-15, TLS 20-40, tính chữ ký 1-3, và máy chủ xử lý 10-40 — nên các lượt bắt tay chiếm phần lớn chi phí cố định, và chúng đúng là thứ mà một kết nối dùng lại bỏ qua. Đó chính là toàn bộ lý do bài 9.2 bảo hãy nâng client lên phạm vi module: một <code>S3Client</code> mới cho mỗi request sẽ dựng một bể kết nối mới rồi vứt đi sau đúng một lần dùng. Lựa chọn C gọi tên một bước có thật nhưng sai độ lớn — ký là vài phép HMAC, cỡ vài mili-giây, và nó diễn ra ở mỗi request bất kể kết nối có được dùng lại hay không. Các con số này là con số công bố của khoá học và không được đo lại ở đây.',
          ),
        }),

        mcq({
          prompt: B(
            'A video page is slow, and the Network tab shows the same video URL appearing more than 200 times. Lesson 9.2 gives two fixes. What is happening, and what are they?',
            'Một trang video chậm, và tab Network cho thấy cùng một URL video xuất hiện hơn 200 lần. Bài 9.2 cho hai cách sửa. Chuyện gì đang xảy ra, và hai cách ấy là gì?',
          ),
          options: [
            B('The player is retrying a failing request; the fixes are to raise the timeout and to add exponential backoff so the retries stop hammering the origin', 'Trình phát đang thử lại một request hỏng; hai cách sửa là nâng thời gian chờ và thêm khoảng lùi luỹ thừa để các lượt thử lại thôi nện vào gốc'),
            B('The browser is re-downloading the whole file for each seek because the object has no Cache-Control; the fixes are to set a long max-age and to enable immutable', 'Trình duyệt tải lại cả file cho mỗi lần tua vì object không có Cache-Control; hai cách sửa là đặt max-age dài và bật immutable'),
            B('The CDN is refusing to cache the video because it exceeds the maximum cacheable object size; the fixes are to split the file into segments or to buy a larger plan', 'CDN từ chối cache video vì nó vượt quá kích thước object tối đa cache được; hai cách sửa là cắt file thành các đoạn hoặc mua gói lớn hơn'),
            B('The player is fetching the file in small byte ranges, each one its own GET, so latency scales with the NUMBER of ranges rather than with total bytes; raise the player\'s chunk size, or put a CDN in front so ranges are served from cache instead of round-tripping to the bucket', 'Trình phát đang lấy file theo từng dải byte nhỏ, mỗi dải là một lệnh GET riêng, nên độ trễ tỉ lệ với SỐ DẢI chứ không tỉ lệ với tổng byte; hãy nâng cỡ khối của trình phát, hoặc đặt một CDN phía trước để các dải được phục vụ từ cache thay vì phải chạy về tới bucket')
          ],
          correct: 3,
          explanation: EX(
            'Range requests are how every video player works, and they are normally invisible; the failure appears when the chunk size is small (some default to 32 KB) and every chunk becomes an origin round trip. The shape of the evidence is what identifies it: one URL, hundreds of entries, each with a <code>206</code> and its own <code>Content-Range</code>. Option D describes a real and different problem — without caching, seeks refetch — but the symptom here is many small requests rather than a few large ones. It is worth connecting this back to Chapter 0: a ranged GET is served straight from storage, so every range is a real operation on the bucket, and hundreds per view is a Class B line as well as a latency problem.',
            'Request theo dải là cách mọi trình phát video hoạt động, và bình thường chúng vô hình; kiểu hỏng chỉ hiện ra khi cỡ khối nhỏ (vài trình phát mặc định 32 KB) và mỗi khối thành một lượt chạy về tới gốc. Hình dạng của bằng chứng chính là thứ nhận diện nó: một URL, hàng trăm dòng, mỗi dòng một mã <code>206</code> kèm <code>Content-Range</code> riêng. Lựa chọn D mô tả một vấn đề có thật và khác — không cache thì mỗi lần tua sẽ tải lại — nhưng triệu chứng ở đây là rất nhiều request nhỏ chứ không phải vài request lớn. Đáng nối chuyện này ngược về chương 0: một lệnh GET có Range được phục vụ thẳng từ kho, nên mỗi dải là một thao tác thật lên bucket, và hàng trăm dải mỗi lượt xem là một dòng Class B chứ không chỉ là chuyện độ trễ.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 9.2 lists a "hot prefix" as one of five latency causes. What is it, and how does it differ between S3 and R2?',
            'Bài 9.2 liệt kê "tiền tố nóng" là một trong năm nguyên nhân gây độ trễ. Nó là gì, và nó khác nhau ra sao giữa S3 và R2?',
          ),
          options: [
            B('A prefix whose objects are cached at the edge while others are not, so the difference is a CDN artefact and disappears once the cache is warm on both providers', 'Một tiền tố mà các object của nó được cache ở biên còn những cái khác thì không, nên khác biệt chỉ là hiệu ứng của CDN và biến mất khi cache đã nóng ở cả hai bên'),
            B('S3 scales request capacity per key prefix, so a sudden ramp on one prefix is throttled while the partition splits — spreading keys (by date, or historically by a hash prefix) is the fix; R2 is architected without per-prefix scaling, so the cause is much less common there', 'S3 mở rộng năng lực xử lý request theo từng tiền tố key, nên một cú tăng đột ngột trên một tiền tố sẽ bị bóp trong lúc phân vùng được tách ra — trải key ra (theo ngày, hoặc theo lối cũ là một tiền tố băm) là cách sửa; R2 được thiết kế không mở rộng theo tiền tố nên nguyên nhân này hiếm gặp hơn nhiều ở đó'),
            B('A prefix holding more objects than the listing limit, so requests to it must paginate internally and pay for extra round trips', 'Một tiền tố chứa nhiều object hơn giới hạn của lượt liệt kê, nên các request vào nó phải phân trang nội bộ và trả thêm các lượt đi về'),
            B('A prefix under a lifecycle rule, because the background sweep locks the range while it evaluates, which serialises reads on both providers equally', 'Một tiền tố đang chịu một lifecycle rule, vì lượt quét nền khoá dải ấy lại trong lúc đánh giá, khiến các lượt đọc bị tuần tự hoá như nhau ở cả hai bên'),
          ],
          correct: 1,
          explanation: EX(
            'The mechanism is partition splitting: S3 spreads a bucket across partitions by key prefix, and a prefix that suddenly gets ten times its usual traffic is throttled for the window it takes to split, which shows up as a few hundred milliseconds to a few seconds on that key range while everything else is fine. The distinguishing test in the lesson follows from that — try a completely different prefix; if it is fast, the prefix is the bottleneck. Two footnotes worth carrying. The old hash-prefix trick (<code>sha256(key).slice(0,4) + &quot;/&quot; + key</code>) is largely obsolete since S3 added auto-scaling, and it costs you the ability to list by a meaningful prefix. And R2 does not need it at all, which means a latency pattern that looks like a hot prefix on R2 is probably one of the other four causes.',
            'Cơ chế là chuyện tách phân vùng: S3 trải một bucket ra nhiều phân vùng theo tiền tố key, và một tiền tố đột ngột nhận gấp mười lần lưu lượng thường ngày sẽ bị bóp trong khoảng thời gian nó cần để tách ra, hiện lên thành vài trăm mili-giây tới vài giây trên đúng dải key ấy trong khi mọi thứ khác vẫn bình thường. Phép kiểm phân biệt trong bài học đi ra từ đó — thử một tiền tố hoàn toàn khác; nếu nó nhanh thì tiền tố chính là chỗ nghẽn. Hai chú thích đáng mang theo. Mẹo tiền tố băm ngày xưa (<code>sha256(key).slice(0,4) + &quot;/&quot; + key</code>) phần lớn đã lỗi thời từ khi S3 thêm tự mở rộng, và nó lấy đi của bạn khả năng liệt kê theo một tiền tố có nghĩa. Còn R2 thì hoàn toàn không cần tới nó, nghĩa là một hình thái độ trễ trông giống tiền tố nóng trên R2 nhiều khả năng là một trong bốn nguyên nhân còn lại.',
          ),
        }),

        mcq({
          prompt: B(
            'A bug report says "storage is slow: the first image after a quiet period takes over a second". The endpoint runs on a serverless function that has been idle for five minutes. Lesson 9.2 files this under a trap. Which, and what is the fix?',
            'Một phiếu báo lỗi ghi "kho lưu trữ chậm: tấm ảnh đầu tiên sau một quãng vắng mất hơn một giây". Endpoint chạy trên một hàm serverless đã nằm không năm phút. Bài 9.2 xếp chuyện này vào một cái bẫy. Bẫy nào, và cách sửa là gì?',
          ),
          options: [
            B('Blaming the storage service for function cold start: an idle runtime takes 200-800 ms to boot before it reaches the bucket at all, so the fix is provisioned concurrency on the function, not anything about the bucket', 'Đổ lỗi cho dịch vụ lưu trữ vì chuyện khởi động nguội của hàm: một runtime nằm không mất 200-800 ms để khởi động trước khi nó chạm được tới bucket, nên cách sửa là đặt mức đồng thời dành sẵn cho hàm chứ không phải làm gì với bucket'),
            B('A hot prefix, since the first request after a quiet period lands on a partition that has been scaled down; the fix is to spread the keys', 'Một tiền tố nóng, vì request đầu tiên sau quãng vắng rơi vào một phân vùng đã bị thu nhỏ lại; cách sửa là trải các key ra'),
            B('A cold CDN cache, since nothing has been requested for five minutes and the edge evicted the object; the fix is a longer max-age', 'Cache CDN nguội, vì suốt năm phút không có gì được yêu cầu nên biên đã đẩy object ra; cách sửa là một max-age dài hơn'),
            B('A DNS TTL expiry, since the resolver cache emptied during the quiet period; the fix is to pin the endpoint IP in the container', 'DNS TTL hết hạn, vì cache của bộ phân giải đã trống đi trong quãng vắng; cách sửa là ghim cứng IP của endpoint trong container'),
          ],
          correct: 0,
          explanation: EX(
            'The lesson names this trap directly, and the tell is the timescale: a cold GET including DNS, TCP and TLS is 40-100 ms, so a full second is an order of magnitude too slow to be connection setup and belongs to the runtime that had not started yet. The user experiences one number and attributes it to the last component they can name. The related-but-different cause is worth keeping separate: a new <code>S3Client</code> per invocation adds the handshake on every request even when the function is warm, and that one IS fixed in the storage code. A DNS lookup does re-resolve after a TTL, but at 1-5 ms it cannot explain a second either.',
            'Bài học gọi thẳng tên cái bẫy này, và dấu hiệu nhận biết là thang thời gian: một lượt GET nguội tính cả DNS, TCP và TLS là 40-100 ms, nên trọn một giây là chậm hơn cả một bậc độ lớn so với mức của việc dựng kết nối, và nó thuộc về cái runtime còn chưa kịp khởi động. Người dùng trải nghiệm một con số duy nhất rồi quy nó cho cái thành phần cuối cùng mà họ gọi được tên. Nguyên nhân họ hàng nhưng khác biệt thì đáng giữ riêng: một <code>S3Client</code> mới ở mỗi lượt gọi sẽ thêm lượt bắt tay vào mọi request kể cả khi hàm đang nóng, và cái đó thì ĐÚNG là sửa trong mã lưu trữ. Một lượt tra DNS có phân giải lại sau khi TTL hết, nhưng ở mức 1-5 ms thì nó cũng không giải thích nổi một giây.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO habits that Lesson 9.1 argues for when triaging a storage error.',
            'Chọn HAI thói quen mà bài 9.1 khuyến khích khi phân loại một lỗi lưu trữ.',
          ),
          options: [
            B('Read the XML body, not just the status line — the <code>Code</code> and <code>Message</code> fields carry the answer for most cases, and the browser console shows only a summary that can disagree with them', 'Đọc khối XML chứ không chỉ đọc dòng trạng thái — hai trường <code>Code</code> và <code>Message</code> mang câu trả lời cho phần lớn các ca, còn console của trình duyệt chỉ hiện một bản tóm tắt có thể mâu thuẫn với chúng'),
            B('Restart the process first, because most intermittent storage errors clear on a fresh connection pool and this costs less time than reading logs', 'Khởi động lại tiến trình trước đã, vì đa số lỗi lưu trữ chập chờn tự hết khi có một bể kết nối mới, và cách này tốn ít thời gian hơn đọc log'),
            B('Re-issue the failing request with <code>curl -v</code> and compare the server\'s <code>StringToSign</code> and <code>CanonicalRequest</code> against what the client signed — the first character that differs is the bug', 'Phát lại request đang hỏng bằng <code>curl -v</code> rồi đối chiếu <code>StringToSign</code> và <code>CanonicalRequest</code> của máy chủ với thứ client đã ký — ký tự đầu tiên khác nhau chính là chỗ lỗi'),
            B('Widen the token scope temporarily to confirm the problem is permissions; if the request then succeeds, leave the wider scope in place until the root cause is found', 'Nới tạm phạm vi token để xác nhận vấn đề là quyền; nếu request thành công thì cứ để nguyên phạm vi rộng ấy cho tới khi tìm ra nguyên nhân gốc'),
          ],
          correct: [0, 2],
          explanation: EX(
            'Both come from the lesson\'s "one line of curl that answers 80% of 403s" section. The first is the theme of the whole chapter: six distinct problems share one status code, and only the body separates them. The second is the strongest tool available for a signature failure, because a server that returns <code>StringToSign</code> and <code>CanonicalRequest</code> is showing you its own view of what it hashed — diff it against yours and the mismatch is right there, usually a header you did not sign or a path you encoded differently. Option B is the trap the lesson names about clock skew: restarting changes nothing when every container on the host has the same wrong time. Option D is a real diagnostic move ruined by its second half — a temporary widening left in place is how a bucket ends up permissive for a year.',
            'Cả hai đều lấy từ mục "một dòng curl trả lời 80% các cái 403" của bài học. Cái đầu là chủ đề của cả chương: sáu vấn đề riêng biệt dùng chung một mã trạng thái, và chỉ có phần thân mới tách được chúng. Cái sau là công cụ mạnh nhất có sẵn cho một lỗi chữ ký, vì một máy chủ trả về <code>StringToSign</code> và <code>CanonicalRequest</code> là đang cho bạn xem chính cái nhìn của nó về thứ nó đã băm — đem so với bản của bạn là chỗ lệch nằm ngay đó, thường là một header bạn không ký hoặc một đường dẫn bạn mã hoá khác đi. Lựa chọn B là cái bẫy bài học gọi tên khi nói về lệch đồng hồ: khởi động lại chẳng đổi được gì khi mọi container trên máy đều mang cùng một giờ sai. Lựa chọn D là một động tác chẩn đoán có thật nhưng bị nửa sau phá hỏng — một lần nới tạm rồi để nguyên chính là cách một bucket rộng cửa suốt cả năm.',
          ),
        }),

        // ── Chương 10 — cái sống qua đo lường ───────────────────────────
        mcq({
          prompt: B(
            'Lesson 10.1 sorts claims into three columns: A (always true), B (true only where measured) and C (an intuition measurement contradicts). Sort these three:' + code(
              '1. A presigned PUT signs only the host header unless you say otherwise\n' +
              '2. R2 is 46x cheaper than S3\n' +
              '3. The cheapest storage class wins',
            ),
            'Bài 10.1 xếp các khẳng định vào ba cột: A (luôn đúng), B (chỉ đúng ở nơi đã đo) và C (một trực giác bị phép đo bác bỏ). Hãy xếp ba khẳng định sau:' + code(
              '1. Mot presigned PUT chi ky header host tru khi ban noi khac di\n' +
              '2. R2 re hon S3 46 lan\n' +
              '3. Lop luu tru re nhat thi thang',
            ),
          ),
          options: [
            B('1 in A, 2 in B, 3 in C', '1 vào A, 2 vào B, 3 vào C'),
            B('1 in B, 2 in A, 3 in C', '1 vào B, 2 vào A, 3 vào C'),
            B('1 in A, 2 in C, 3 in B', '1 vào A, 2 vào C, 3 vào B'),
            B('1 in C, 2 in B, 3 in A', '1 vào C, 2 vào B, 3 vào A'),
          ],
          correct: 0,
          explanation: EX(
            'Claim 1 is a property of SigV4 and the SDK default, so it holds in every S3-compatible project — Column A, and Chapter 4 spent a whole lesson on why. Claim 2 is a real measurement with conditions attached: 1 TB stored against 10 TB of monthly egress, where egress dominates. Change the workload and the ratio changes, so it is Column B. Claim 3 is the intuition Lesson 2.1 contradicts for media apps, where egress rather than the storage rate decides the bill — Column C. The point of the sorting exercise is that Column B is where most storage advice on the internet lives, and where it does the most damage when quoted without its conditions.',
            'Khẳng định 1 là tính chất của SigV4 và của giá trị mặc định trong SDK, nên nó đúng ở mọi dự án S3-compatible — Cột A, và chương 4 đã dành hẳn một bài để nói vì sao. Khẳng định 2 là một phép đo thật có kèm điều kiện: lưu 1 TB đối chọi 10 TB egress mỗi tháng, nơi egress chiếm chủ đạo. Đổi tải công việc là tỉ lệ đổi, nên nó thuộc Cột B. Khẳng định 3 là trực giác mà bài 2.1 bác bỏ với các ứng dụng media, nơi egress chứ không phải đơn giá lưu trữ quyết định hoá đơn — Cột C. Ý nghĩa của bài tập phân loại này là: Cột B chính là nơi phần lớn lời khuyên về lưu trữ trên internet đang sống, và cũng là nơi chúng gây hại nhiều nhất khi bị trích dẫn mà bỏ mất điều kiện.',
          ),
        }),

        mcq({
          prompt: B(
            'A design document contains the sentence "multipart upload is faster". Lesson 10.1 would call that a Column B claim quoted as if it were Column A. What condition has been dropped, and what happens without it?',
            'Một tài liệu thiết kế có câu "multipart upload nhanh hơn". Bài 10.1 sẽ gọi đó là một khẳng định Cột B bị trích như thể nó là Cột A. Điều kiện nào đã bị đánh rơi, và không có nó thì chuyện gì xảy ra?',
          ),
          options: [
            B('The condition is a fast network; on a slow link multipart is slower because each part carries its own request overhead and the parts contend for bandwidth', 'Điều kiện là một đường mạng nhanh; trên đường chậm thì multipart chậm hơn vì mỗi phần mang theo phần chi phí request riêng và các phần tranh nhau băng thông'),
            B('The condition is a size threshold: below roughly 100 MB a single PUT wins because multipart costs three API calls instead of one, so the claim reverses on small files — which is most files in most buckets', 'Điều kiện là một ngưỡng kích thước: dưới chừng 100 MB thì một lệnh PUT đơn thắng vì multipart tốn ba lượt gọi API thay vì một, nên khẳng định ấy đảo chiều với file nhỏ — mà file nhỏ là đa số file trong đa số bucket'),
            B('The condition is that the destination supports parallel part uploads; some S3-compatible services serialise them internally and the speedup disappears', 'Điều kiện là bên đích hỗ trợ tải các phần song song; vài dịch vụ S3-compatible tuần tự hoá chúng ở bên trong và phần nhanh hơn ấy biến mất'),
            B('No condition has been dropped: multipart is faster at every size, and the only reason not to use it everywhere is the extra code', 'Không điều kiện nào bị đánh rơi cả: multipart nhanh hơn ở mọi kích thước, và lý do duy nhất để không dùng nó ở mọi nơi là phần mã phải viết thêm'),
          ],
          correct: 1,
          explanation: EX(
            'Lesson 1.3 states the threshold and the trap in the same breath: a single PUT below 100 MB, multipart at 100 MB and above, because three round trips for a 2 MB file is slower than one. The Chapter 10 point is about the SHAPE of the error rather than the number — a claim that holds above a threshold, quoted without the threshold, becomes advice that is wrong for the common case. The same shape produces "R2 is cheaper" (true when egress dominates) and "listing is cheap" (true for hundreds of keys). Carry the condition with the claim, or the claim quietly changes meaning.',
            'Bài 1.3 nêu ngưỡng và cái bẫy trong cùng một hơi: một lệnh PUT đơn cho dưới 100 MB, multipart cho từ 100 MB trở lên, vì ba lượt đi về cho một file 2 MB thì chậm hơn một lượt. Ý của chương 10 nằm ở HÌNH DẠNG của sai lầm chứ không nằm ở con số — một khẳng định chỉ đúng trên một ngưỡng, khi bị trích mà bỏ mất cái ngưỡng ấy, sẽ thành lời khuyên sai cho đúng trường hợp phổ biến. Cùng hình dạng ấy sinh ra "R2 rẻ hơn" (đúng khi egress chiếm chủ đạo) và "liệt kê thì rẻ" (đúng với vài trăm key). Hãy mang theo điều kiện cùng với khẳng định, không thì khẳng định lặng lẽ đổi nghĩa.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 10.1 puts "storage costs little next to egress" in Column C — always wrong. Under which workload does it fail hardest, and what replaces it?',
            'Bài 10.1 xếp câu "lưu trữ tốn không đáng gì so với egress" vào Cột C — luôn luôn sai. Nó sai nặng nhất với tải công việc nào, và thay bằng gì?',
          ),
          options: [
            B('A cold archive that is written once and read about once a year, where storage is effectively the only line on the invoice and the egress figure never grows large enough to appear next to it', 'Một kho lưu trữ lạnh ghi một lần rồi mỗi năm đọc chừng một lượt, nơi lưu trữ trên thực tế là dòng duy nhất của hoá đơn còn con số egress không bao giờ lớn tới mức hiện ra bên cạnh nó'),
            B('Any workload running on R2 at all, since R2 charges nothing for egress to the internet and therefore has no such line on the invoice, which makes the whole comparison meaningless on that provider rather than merely wrong', 'Mọi tải công việc chạy trên R2 nói chung, vì R2 không thu tiền egress ra internet nên hoá đơn không có dòng ấy, và điều đó làm cả phép so sánh trở nên vô nghĩa trên nhà cung cấp đó chứ không đơn thuần là sai'),
            B('A CDN-fronted media app, where the edge cache absorbs the overwhelming majority of reads so the egress figure is already close to zero before anyone optimises anything, leaving storage as the only line with any size to it', 'Một ứng dụng media có CDN phía trước, nơi cache biên hấp thụ áp đảo các lượt đọc nên con số egress vốn đã gần bằng không trước cả khi có ai tối ưu gì, để lại lưu trữ là dòng duy nhất còn có chút độ lớn'),
            B('A write-heavy workload, where Class A operations dominate — 10 million PUTs a month is about $45, while 100 GB of storage is $1.50 — so the replacement is to name which of the five line items your workload actually drives before optimising anything', 'Một tải công việc nặng về ghi, nơi các thao tác Class A chiếm chủ đạo — 10 triệu lệnh PUT một tháng là chừng 45 $, trong khi 100 GB lưu trữ là 1,50 $ — nên thứ thay thế là hãy gọi tên xem tải công việc của bạn thật sự đẩy dòng nào trong năm dòng trước khi tối ưu bất cứ thứ gì')
          ],
          correct: 3,
          explanation: EX(
            'The numbers are the course\'s own, from the final quiz of Lesson 10.2: 10 million PUTs a month is $45 while 100 GB of storage is $1.50, so a write-heavy application spends thirty times more on operations than on bytes, and optimising the storage figure is optimising the wrong thing. What makes it a Column C entry rather than a Column B one is that the sentence claims a general ordering between two line items, and the ordering is a property of the workload — the same claim is right for a video app and wrong for an ingestion pipeline. Option C describes a real situation the claim also fails in, but it fails less dramatically there, since neither line is large.',
            'Các con số là của chính khoá học, lấy từ bài kiểm tra cuối ở 10.2: 10 triệu lệnh PUT một tháng là 45 $ trong khi 100 GB lưu trữ là 1,50 $, nên một ứng dụng nặng về ghi tiêu cho thao tác gấp ba mươi lần tiêu cho số byte, và tối ưu con số lưu trữ là tối ưu nhầm thứ. Cái làm nó thành một mục Cột C chứ không phải Cột B là câu ấy khẳng định một thứ tự chung giữa hai dòng hoá đơn, mà thứ tự ấy lại là tính chất của tải công việc — cùng câu ấy đúng với một ứng dụng video và sai với một pipeline nạp dữ liệu. Lựa chọn C mô tả một tình huống có thật mà câu ấy cũng sai, nhưng ở đó nó sai kém ngoạn mục hơn, vì cả hai dòng đều không lớn.',
          ),
        }),

        mcq({
          prompt: B(
            'Two write-ups of the same verification run. Which is a usable claim, and why?' + code(
              'A: "The migration finished successfully."\n' +
              'B: "All 4,132,881 ETags were compared; 1,834 differ only by\n' +
              '    single-part versus multipart form, 412 keys were missing and\n' +
              '    171 had different bytes. The 583 real problems were re-copied.\n' +
              '    550 objects across four size bands were then byte-compared\n' +
              '    and all matched."',
            ),
            'Hai bản viết lại cùng một lượt kiểm chứng. Bản nào là một khẳng định dùng được, và vì sao?' + code(
              'A: "Cuoc migration da hoan tat thanh cong."\n' +
              'B: "Da so toan bo 4.132.881 ETag; 1.834 cai chi khac o cho mot ben\n' +
              '    la single-part con ben kia la multipart, 412 key thieu han va\n' +
              '    171 cai khac byte. 583 van de that su da duoc chep lai.\n' +
              '    Sau do 550 object trai bon dai kich thuoc duoc so tung byte va\n' +
              '    tat ca deu khop."',
            ),
          ),
          options: [
            B('A, because a summary is what a status report needs and the detail belongs in an appendix nobody reads', 'A, vì một bản tóm tắt là thứ một báo cáo trạng thái cần, còn phần chi tiết thuộc về một phụ lục không ai đọc'),
            B('B, because it states what was checked, how much of it, what was found and what was done — so a reader can tell what it does NOT prove, whereas A is a conclusion with no way to disagree with it', 'B, vì nó nói rõ đã kiểm cái gì, kiểm được bao nhiêu, tìm thấy gì và đã làm gì — nên người đọc biết được nó KHÔNG chứng minh cái gì, trong khi A là một kết luận mà không có cách nào để phản biện'),
            B('Neither: only the migration tool\'s own report can confirm a migration, since it alone saw every object it enumerated', 'Không bản nào: chỉ báo cáo của chính công cụ migration mới xác nhận được một cuộc migration, vì chỉ nó nhìn thấy mọi object nó đã liệt kê'),
            B('B, but only because it has larger numbers in it; a claim with figures is more credible than one without regardless of what the figures measure', 'B, nhưng chỉ vì nó có nhiều con số hơn; một khẳng định có số liệu thì đáng tin hơn một khẳng định không có, bất kể mấy con số ấy đo cái gì'),
          ],
          correct: 1,
          explanation: EX(
            'Lesson 8.3 ends with exactly this contrast — "All 412,000 ETags matched; 300 objects byte-compared across six size bands" is a claim, "the migration finished" is not — and Lesson 10.1 generalises it into the habit of carrying the conditions with the measurement. The test is whether a reader can work out the limits: B tells you the byte comparison covered 550 objects out of four million, so anyone can see what remains unproven, and can ask whether the strata were the right ones. A offers nothing to check. Option D is a real failure mode of the same instinct, and worth naming: numbers are only evidence when you know what was counted.',
            'Bài 8.3 kết thúc bằng đúng sự tương phản này — "Đã so 412.000 ETag và tất cả đều khớp; 300 object được so từng byte trải sáu dải kích thước" là một khẳng định, còn "cuộc migration đã xong" thì không — và bài 10.1 tổng quát nó thành thói quen mang theo điều kiện cùng với phép đo. Phép thử là người đọc có suy ra được giới hạn hay không: bản B cho biết phần so từng byte phủ 550 object trên bốn triệu, nên ai cũng thấy được phần nào còn chưa được chứng minh, và hỏi được rằng các tầng ấy đã chọn đúng chưa. Bản A không đưa ra gì để kiểm. Lựa chọn D là một kiểu hỏng có thật của cùng bản năng ấy, và đáng gọi tên: con số chỉ là bằng chứng khi bạn biết người ta đã đếm cái gì.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO figures from this course that Lesson 10.1 places in Column B — true where they were measured, and to be re-measured on your own system before you rely on them.',
            'Chọn HAI con số trong khoá này mà bài 10.1 xếp vào Cột B — đúng ở nơi chúng được đo, và phải đo lại trên hệ thống của chính bạn trước khi dựa vào chúng.',
          ),
          options: [
            B('The 46x gap between R2 and S3, which was computed for one workload of 1 TB stored and 10 TB of monthly egress', 'Khoảng cách 46 lần giữa R2 và S3, được tính cho đúng một tải công việc lưu 1 TB và 10 TB egress mỗi tháng'),
            B('That a browser blocks a cross-origin PUT before the request is sent unless the bucket returns CORS headers allowing it', 'Rằng trình duyệt chặn một lệnh PUT khác nguồn trước cả khi request được gửi đi, trừ khi bucket trả về các header CORS cho phép'),
            B('The roughly 95% cache hit ratio quoted for this repo\'s immutable assets', 'Tỉ lệ trúng cache chừng 95% được nêu cho các tài nguyên bất biến của kho này'),
            B('That an incomplete multipart upload keeps costing storage and is invisible to an object listing', 'Rằng một lượt multipart chưa hoàn tất vẫn tiếp tục tốn tiền lưu trữ và vô hình với một lượt liệt kê object'),
          ],
          correct: [0, 2],
          explanation: EX(
            'Options B and D are protocol facts — they follow from how CORS and multipart work, so they hold in any S3-compatible project and Lesson 10.1 lists both in Column A. The two correct answers are measurements of a particular system under particular conditions: the 46x ratio is dominated by egress and collapses toward 1.5x when there is none, and a cache hit ratio is a property of your traffic pattern, your Cache-Control headers and your URL scheme. Neither is wrong; both stop being true the moment they travel. The test the lesson offers is simple — ask whether the claim could be derived from the protocol, or whether somebody had to run something to find it out.',
            'Lựa chọn B và D là những sự thật của giao thức — chúng đi ra từ cách CORS và multipart vận hành, nên đúng ở mọi dự án S3-compatible, và bài 10.1 xếp cả hai vào Cột A. Hai đáp án đúng là những phép đo của một hệ thống cụ thể dưới những điều kiện cụ thể: tỉ lệ 46 lần bị egress chi phối và co lại về quanh 1,5 lần khi không có egress, còn tỉ lệ trúng cache là tính chất của hình thái lưu lượng, của các header Cache-Control và của cách bạn đặt URL. Không cái nào sai; cả hai thôi đúng ngay khi rời khỏi chỗ của chúng. Phép thử bài học đưa ra rất gọn — hãy hỏi xem khẳng định ấy có suy ra được từ giao thức không, hay phải có ai đó chạy một cái gì đó mới biết được.',
          ),
        }),

        mcq({
          prompt: B(
            'A new bucket is being created for a new product. Everything on this list can be added later:' + code(
              '- one API token per workload\n' +
              '- a lifecycle rule aborting incomplete multipart uploads\n' +
              '- a budget alert, a Class A rate alarm and request logging\n' +
              '- a CORS policy with explicit origins and MaxAgeSeconds\n' +
              '- Cache-Control set at upload time\n' +
              '- a key naming scheme, with keys tracked in the database',
            ) + 'Which one is the exception — cheap on day one and expensive to retrofit — and why?',
            'Một bucket mới đang được tạo cho một sản phẩm mới. Mọi thứ trong danh sách này đều thêm sau được:' + code(
              '- moi workload mot API token\n' +
              '- mot lifecycle rule huy cac luot multipart bo do\n' +
              '- mot canh bao ngan sach, mot canh bao toc do Class A va ghi log request\n' +
              '- mot chinh sach CORS voi origin tuong minh va MaxAgeSeconds\n' +
              '- Cache-Control dat ngay luc tai len\n' +
              '- mot lo dat ten key, va key duoc theo doi trong co so du lieu',
            ) + 'Cái nào là ngoại lệ — rẻ ở ngày đầu và đắt khi phải làm lại — và vì sao?',
          ),
          options: [
            B('The lifecycle rule, because storage already leaked during the period before it existed and those bytes cannot be recovered retroactively', 'Cái lifecycle rule, vì dung lượng đã rò trong quãng thời gian trước khi nó tồn tại và số byte ấy không thu hồi ngược lại được'),
            B('The per-workload tokens, because a token cannot be scoped after it has been issued and every workload would have to be redeployed simultaneously', 'Bộ token theo từng workload, vì một token không giới hạn phạm vi lại được sau khi đã cấp, và mọi workload sẽ phải triển khai lại cùng lúc'),
            B('The CORS policy, because browsers cache preflight responses indefinitely once a policy has been served, so a later correction never reaches existing users', 'Cái chính sách CORS, vì trình duyệt cache phản hồi preflight vô thời hạn khi một chính sách đã được phục vụ, nên một lượt sửa về sau không bao giờ tới được người dùng hiện có'),
            B('The key naming scheme, because a key cannot be renamed — changing the layout later means copying and deleting every object, and every stored URL, cached copy and external link breaks with it', 'Cái lối đặt tên key, vì một key không đổi tên được — thay cách bố trí về sau nghĩa là copy rồi xoá từng object, và mọi URL đã lưu, mọi bản cache cùng mọi liên kết bên ngoài đều gãy theo')
          ],
          correct: 3,
          explanation: EX(
            'This is Difference 1 from Lesson 0.1 arriving as a planning consequence: the namespace is flat and immutable per key, so "rename a folder" is copy plus delete of everything under it, and the cost scales with the data you have accumulated. Everything else on the list is a configuration change plus a deploy — a lifecycle rule added in month six still cleans up the parts already leaked, tokens can be reissued one workload at a time, and a CORS policy takes effect within minutes (browsers cap preflight caching at hours, not indefinitely). The practical form of getting it right on day one is the convention this repo uses — <code>&lt;resource&gt;/&lt;id&gt;/&lt;subtype&gt;/&lt;filename&gt;</code> — plus a database row per object so nothing ever has to be found by listing.',
            'Đây là Khác biệt 1 của bài 0.1 hiện ra dưới dạng một hệ quả về mặt lập kế hoạch: không gian tên là phẳng và bất biến theo từng key, nên "đổi tên một thư mục" là copy cộng xoá toàn bộ thứ nằm dưới, và chi phí ấy lớn dần theo lượng dữ liệu bạn đã tích lại. Mọi thứ còn lại trong danh sách chỉ là một thay đổi cấu hình cộng một lượt triển khai — một lifecycle rule thêm vào tháng thứ sáu vẫn dọn được những phần đã rò, token cấp lại được từng workload một, và một chính sách CORS có hiệu lực trong vài phút (trình duyệt chốt việc cache preflight ở mức vài giờ, không phải vô thời hạn). Hình thức thực tế của việc làm đúng ngay ngày đầu chính là quy ước kho này đang dùng — <code>&lt;tài nguyên&gt;/&lt;id&gt;/&lt;loại con&gt;/&lt;tên file&gt;</code> — cộng với một hàng trong cơ sở dữ liệu cho mỗi object, để không bao giờ phải đi tìm thứ gì bằng cách liệt kê.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Turn a storage error into a next action (chapter 9).</b> Eleven real responses, eleven different fixes. Implement <code>chanDoan(v)</code>, which takes <code>{ status, code, message, kyTruoc }</code> — <code>kyTruoc</code> is <code>true</code> when the request came from a presigned URL — and returns <code>[ma, viec]</code>: a cause code and one line of action.</p>' +
            '<p>The codes, and what separates each from its neighbour:</p>' +
            '<ul>' +
            '<li><code>HEAD_KHONG_THAN</code> — status 404 and <b>no</b> <code>code</code> at all. A HEAD response has no body, so there is nothing for the SDK to parse; trust <code>err.name</code> instead.</li>' +
            '<li><code>SAI_KEY</code> (<code>NoSuchKey</code>) versus <code>SAI_BUCKET</code> (<code>NoSuchBucket</code>) — one row out of sync, versus every request from this process.</li>' +
            '<li><code>KHOA_CHET</code> (<code>InvalidAccessKeyId</code>) — the id is unknown, so the credential is gone. Versus <code>SAI_BI_MAT</code> (<code>SignatureDoesNotMatch</code> on a NON-presigned request) — the id is fine and the secret half is wrong.</li>' +
            '<li><code>SUA_SAU_KHI_KY</code> — <code>SignatureDoesNotMatch</code> on a presigned request: something changed between signing and use.</li>' +
            '<li><code>LECH_DONG_HO</code> (<code>RequestTimeTooSkewed</code>) — the server names the clock itself.</li>' +
            '<li><code>HET_HAN</code> and <code>CHUA_HIEU_LUC</code> — both arrive as <code>AccessDenied</code>, and only the message separates them: <code>Request has expired</code> versus <code>Request is not valid yet</code>.</li>' +
            '<li><code>CHINH_SACH_TU_CHOI</code> — any other <code>AccessDenied</code>: authenticated, and refused.</li>' +
            '<li><code>URL_HONG</code> (<code>AuthorizationQueryParametersError</code>) — a signed query string was edited by hand.</li>' +
            '<li><code>KHONG_RO</code> — anything else.</li>' +
            '</ul>' +
            '<p>Order your checks so the specific cases are decided before the general ones; two of the eleven are <code>AccessDenied</code> that must NOT fall into the policy branch. Every code string above came from a live S3-compatible server. Keep the given data and the printing loop exactly as they are, and match the action lines byte for byte.</p>',

            '<p><b>Câu 31 — Biến một lỗi lưu trữ thành một hành động kế tiếp (chương 9).</b> Mười một phản hồi thật, mười một cách sửa khác nhau. Hãy cài đặt <code>chanDoan(v)</code>, nhận <code>{ status, code, message, kyTruoc }</code> — <code>kyTruoc</code> bằng <code>true</code> khi request đến từ một presigned URL — và trả về <code>[ma, viec]</code>: một mã nguyên nhân và một dòng việc phải làm.</p>' +
            '<p>Các mã, và cái phân biệt từng cái với cái bên cạnh:</p>' +
            '<ul>' +
            '<li><code>HEAD_KHONG_THAN</code> — status 404 và <b>không có</b> <code>code</code> nào cả. Một phản hồi HEAD không có thân nên SDK chẳng có gì để phân giải; hãy tin <code>err.name</code> thay vào đó.</li>' +
            '<li><code>SAI_KEY</code> (<code>NoSuchKey</code>) so với <code>SAI_BUCKET</code> (<code>NoSuchBucket</code>) — một hàng lệch nhịp, so với mọi request từ tiến trình này.</li>' +
            '<li><code>KHOA_CHET</code> (<code>InvalidAccessKeyId</code>) — cái id không được biết tới, tức thông tin xác thực đã biến mất. So với <code>SAI_BI_MAT</code> (<code>SignatureDoesNotMatch</code> trên một request KHÔNG ký sẵn) — id thì ổn còn nửa secret đang sai.</li>' +
            '<li><code>SUA_SAU_KHI_KY</code> — <code>SignatureDoesNotMatch</code> trên một request đã ký sẵn: có gì đó đổi giữa lúc ký và lúc dùng.</li>' +
            '<li><code>LECH_DONG_HO</code> (<code>RequestTimeTooSkewed</code>) — máy chủ tự gọi tên cái đồng hồ ra.</li>' +
            '<li><code>HET_HAN</code> và <code>CHUA_HIEU_LUC</code> — cả hai đều đến dưới dạng <code>AccessDenied</code>, và chỉ có message phân biệt: <code>Request has expired</code> so với <code>Request is not valid yet</code>.</li>' +
            '<li><code>CHINH_SACH_TU_CHOI</code> — mọi <code>AccessDenied</code> còn lại: đã xác thực, và bị từ chối.</li>' +
            '<li><code>URL_HONG</code> (<code>AuthorizationQueryParametersError</code>) — một chuỗi truy vấn đã ký bị sửa tay.</li>' +
            '<li><code>KHONG_RO</code> — mọi thứ khác.</li>' +
            '</ul>' +
            '<p>Hãy xếp thứ tự các phép kiểm sao cho ca cụ thể được quyết trước ca tổng quát; hai trong mười một ca là <code>AccessDenied</code> mà KHÔNG được rơi vào nhánh chính sách. Mọi chuỗi mã lỗi ở trên đều lấy từ một máy chủ S3-compatible đang sống. Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và khớp các dòng việc phải làm từng byte.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const VU = [\n' +
            "  { ten: 'A', status: 403, code: 'InvalidAccessKeyId',    message: 'The Access Key Id you provided does not exist in our records.', kyTruoc: false },\n" +
            "  { ten: 'B', status: 403, code: 'SignatureDoesNotMatch', message: 'The request signature we calculated does not match.', kyTruoc: false },\n" +
            "  { ten: 'C', status: 403, code: 'RequestTimeTooSkewed',  message: 'The difference between the request time and the server time is too large.', kyTruoc: false },\n" +
            "  { ten: 'D', status: 403, code: 'AccessDenied',          message: 'Request has expired', kyTruoc: true },\n" +
            "  { ten: 'E', status: 403, code: 'AccessDenied',          message: 'Request is not valid yet', kyTruoc: true },\n" +
            "  { ten: 'F', status: 403, code: 'SignatureDoesNotMatch', message: 'The request signature we calculated does not match.', kyTruoc: true },\n" +
            "  { ten: 'G', status: 403, code: 'AccessDenied',          message: 'Access Denied.', kyTruoc: false },\n" +
            "  { ten: 'H', status: 404, code: 'NoSuchKey',             message: 'The specified key does not exist.', kyTruoc: false },\n" +
            "  { ten: 'I', status: 404, code: 'NoSuchBucket',          message: 'The specified bucket does not exist', kyTruoc: false },\n" +
            "  { ten: 'J', status: 404, code: undefined,               message: 'UnknownError', kyTruoc: false },\n" +
            "  { ten: 'K', status: 400, code: 'AuthorizationQueryParametersError', message: 'X-Amz-Expires must be specified', kyTruoc: true },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function chanDoan(v) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const v of VU) {\n' +
            '  const [ma, viec] = chanDoan(v);\n' +
            "  console.log(v.ten + ' ' + v.status + ' ' + (v.code ?? '(khong co Code)') + ' -> ' + ma + ' :: ' + viec);\n" +
            '}\n',
          expectedOutput:
            'A 403 InvalidAccessKeyId -> KHOA_CHET :: Khoa da bi thu hoi hoac go sai, cap khoa moi va trien khai lai\n' +
            'B 403 SignatureDoesNotMatch -> SAI_BI_MAT :: Secret sai hoac thieu ky tu, in do dai secret roi so voi khoa that\n' +
            'C 403 RequestTimeTooSkewed -> LECH_DONG_HO :: Dong bo NTP tren may goi, SigV4 chi cho lech 15 phut\n' +
            'D 403 AccessDenied -> HET_HAN :: Cap URL moi ngay truoc khi dung, dung cache URL da ky\n' +
            'E 403 AccessDenied -> CHUA_HIEU_LUC :: Dong ho may KY chay nhanh hon may chu, dong bo NTP tren may cap URL\n' +
            'F 403 SignatureDoesNotMatch -> SUA_SAU_KHI_KY :: Client gui khac luc ky, gui dung header va tham so da ky\n' +
            'G 403 AccessDenied -> CHINH_SACH_TU_CHOI :: Da xac thuc nhung bi tu choi, soi bucket policy va pham vi token\n' +
            'H 404 NoSuchKey -> SAI_KEY :: Doi chieu key trong CSDL voi key thuc te trong bucket\n' +
            'I 404 NoSuchBucket -> SAI_BUCKET :: Kiem ten bucket va endpoint trong bien moi truong\n' +
            'J 404 (khong co Code) -> HEAD_KHONG_THAN :: Doi sang GetObject de doc truong Code, hoac tin err.name = NotFound\n' +
            'K 400 AuthorizationQueryParametersError -> URL_HONG :: URL da ky bi cat bot tham so, dung sua tay chuoi truy van',
          sampleSolution:
            'function chanDoan(v) {\n' +
            '  // HEAD không có thân ⇒ không có Code để đọc. Phải xét TRƯỚC mọi nhánh theo code.\n' +
            '  if (v.status === 404 && v.code === undefined) {\n' +
            "    return ['HEAD_KHONG_THAN', 'Doi sang GetObject de doc truong Code, hoac tin err.name = NotFound'];\n" +
            '  }\n' +
            "  if (v.code === 'NoSuchKey') {\n" +
            "    return ['SAI_KEY', 'Doi chieu key trong CSDL voi key thuc te trong bucket'];\n" +
            '  }\n' +
            "  if (v.code === 'NoSuchBucket') {\n" +
            "    return ['SAI_BUCKET', 'Kiem ten bucket va endpoint trong bien moi truong'];\n" +
            '  }\n' +
            "  if (v.code === 'InvalidAccessKeyId') {\n" +
            "    return ['KHOA_CHET', 'Khoa da bi thu hoi hoac go sai, cap khoa moi va trien khai lai'];\n" +
            '  }\n' +
            "  if (v.code === 'RequestTimeTooSkewed') {\n" +
            "    return ['LECH_DONG_HO', 'Dong bo NTP tren may goi, SigV4 chi cho lech 15 phut'];\n" +
            '  }\n' +
            "  if (v.code === 'AuthorizationQueryParametersError') {\n" +
            "    return ['URL_HONG', 'URL da ky bi cat bot tham so, dung sua tay chuoi truy van'];\n" +
            '  }\n' +
            "  if (v.code === 'SignatureDoesNotMatch') {\n" +
            '    return v.kyTruoc\n' +
            "      ? ['SUA_SAU_KHI_KY', 'Client gui khac luc ky, gui dung header va tham so da ky']\n" +
            "      : ['SAI_BI_MAT', 'Secret sai hoac thieu ky tu, in do dai secret roi so voi khoa that'];\n" +
            '  }\n' +
            "  if (v.code === 'AccessDenied') {\n" +
            '    // Hai ca này KHÔNG phải chuyện chính sách — chỉ message tách được chúng.\n' +
            "    if (v.message === 'Request has expired') {\n" +
            "      return ['HET_HAN', 'Cap URL moi ngay truoc khi dung, dung cache URL da ky'];\n" +
            '    }\n' +
            "    if (v.message === 'Request is not valid yet') {\n" +
            "      return ['CHUA_HIEU_LUC', 'Dong ho may KY chay nhanh hon may chu, dong bo NTP tren may cap URL'];\n" +
            '    }\n' +
            "    return ['CHINH_SACH_TU_CHOI', 'Da xac thuc nhung bi tu choi, soi bucket policy va pham vi token'];\n" +
            '  }\n' +
            "  return ['KHONG_RO', 'Ghi lai nguyen van than XML roi phan loai lai'];\n" +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Reconcile a migration and decide whether the source can be deleted (chapter 8).</b> Write <code>doiSoat</code>, <code>tongKet</code> and <code>xoaNguonDuoc</code> over two inventories.</p>' +
            '<p><code>doiSoat(nguon, dich, moc)</code> returns an array of <code>[key, loai]</code> pairs, sorted by key, classifying every key on either side:</p>' +
            '<ul>' +
            '<li><code>OK</code> — present on both with identical ETags.</li>' +
            '<li><code>MP-DIFF</code> — the ETags differ, exactly one of them carries a <code>-N</code> suffix, and the sizes are EQUAL. One side stored the bytes as multipart and the other as a single part, so the ETags cannot match by construction. Informational.</li>' +
            '<li><code>ETAG</code> — the ETags differ for any other reason, including a multipart-versus-single difference whose sizes do NOT agree. A real problem.</li>' +
            '<li><code>MISSING</code> — on the source, absent from the destination, and last modified at or before <code>moc</code>.</li>' +
            '<li><code>MOI_HON_MOC</code> — the same, but modified AFTER <code>moc</code>: the copier snapshotted the key list when it started, so anything written later was never in its work list. Not a copier defect, and still a reason not to delete anything.</li>' +
            '<li><code>EXTRA</code> — on the destination only.</li>' +
            '</ul>' +
            '<p><code>tongKet(ket)</code> returns a count per category as a plain object, in first-appearance order. <code>xoaNguonDuoc(ket)</code> returns <code>&quot;DUOC — ...&quot;</code> when no <code>MISSING</code>, <code>ETAG</code> or <code>MOI_HON_MOC</code> remains, otherwise <code>&quot;CHUA — con &lt;N&gt; key phai xu ly: &lt;keys, comma-separated&gt;&quot;</code>. <code>MP-DIFF</code> and <code>EXTRA</code> do not block.</p>' +
            '<p>Every ETag in the data was produced by a live S3-compatible server: <code>anh/1.jpg</code> really is the same 8 MiB uploaded two ways. Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 32 — Đối soát một cuộc migration và quyết xem có xoá nguồn được chưa (chương 8).</b> Hãy viết <code>doiSoat</code>, <code>tongKet</code> và <code>xoaNguonDuoc</code> trên hai bản kê.</p>' +
            '<p><code>doiSoat(nguon, dich, moc)</code> trả về một mảng các cặp <code>[key, loai]</code>, sắp theo key, phân loại mọi key ở cả hai phía:</p>' +
            '<ul>' +
            '<li><code>OK</code> — có ở cả hai với ETag y hệt.</li>' +
            '<li><code>MP-DIFF</code> — ETag khác nhau, đúng MỘT bên mang hậu tố <code>-N</code>, và kích thước BẰNG nhau. Một bên lưu số byte ấy dạng multipart còn bên kia dạng một phần, nên ETag không thể khớp theo đúng cách nó được dựng ra. Chỉ mang tính thông tin.</li>' +
            '<li><code>ETAG</code> — ETag khác nhau vì bất kỳ lý do nào khác, kể cả chuyện multipart so với một phần mà kích thước KHÔNG khớp. Đây là vấn đề thật.</li>' +
            '<li><code>MISSING</code> — có ở nguồn, vắng ở đích, và sửa lần cuối vào lúc bằng hoặc trước <code>moc</code>.</li>' +
            '<li><code>MOI_HON_MOC</code> — y như trên nhưng sửa SAU <code>moc</code>: công cụ chép chụp lại danh sách key lúc nó bắt đầu, nên thứ gì ghi sau đó chưa từng nằm trong hàng đợi của nó. Không phải lỗi của công cụ, mà vẫn là lý do đừng xoá gì cả.</li>' +
            '<li><code>EXTRA</code> — chỉ có ở đích.</li>' +
            '</ul>' +
            '<p><code>tongKet(ket)</code> trả về số lượng theo từng loại dưới dạng một object thường, theo thứ tự xuất hiện lần đầu. <code>xoaNguonDuoc(ket)</code> trả về <code>&quot;DUOC — ...&quot;</code> khi không còn <code>MISSING</code>, <code>ETAG</code> hay <code>MOI_HON_MOC</code> nào, không thì <code>&quot;CHUA — con &lt;N&gt; key phai xu ly: &lt;các key, ngăn bằng dấu phẩy&gt;&quot;</code>. <code>MP-DIFF</code> và <code>EXTRA</code> không chặn.</p>' +
            '<p>Mọi ETag trong phần dữ liệu đều do một máy chủ S3-compatible sống sinh ra: <code>anh/1.jpg</code> thật sự là cùng 8 MiB được tải lên theo hai cách. Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const MOC = '2026-09-01T00:00:00Z';\n" +
            'const NGUON = [\n' +
            "  { key: 'anh/1.jpg', etag: '\"61461f70bad6ef02b0419218f2b668e2\"',   size: 8388608,  doi: '2026-08-01T10:00:00Z' },\n" +
            "  { key: 'anh/2.jpg', etag: '\"eacd2737fa049d51213f10cdc5732ece-3\"', size: 12582912, doi: '2026-08-02T10:00:00Z' },\n" +
            "  { key: 'anh/3.jpg', etag: '\"816d87a2afb9612558a638b9d6f45da1\"',   size: 9,        doi: '2026-08-03T10:00:00Z' },\n" +
            "  { key: 'anh/4.jpg', etag: '\"bf23ea50d77ee96ece2b71f7d905bfe8\"',   size: 8,        doi: '2026-08-04T10:00:00Z' },\n" +
            "  { key: 'anh/5.jpg', etag: '\"d41d8cd98f00b204e9800998ecf8427e\"',   size: 0,        doi: '2026-08-05T10:00:00Z' },\n" +
            "  { key: 'anh/6.jpg', etag: '\"908bd5403409b52b81c97beaa3320dbf-2\"', size: 6291456,  doi: '2026-09-03T10:00:00Z' },\n" +
            '];\n' +
            'const DICH = [\n' +
            "  { key: 'anh/1.jpg',    etag: '\"7fed252542c616b849b9bad8e04e4d44-2\"', size: 8388608 },\n" +
            "  { key: 'anh/2.jpg',    etag: '\"eacd2737fa049d51213f10cdc5732ece-3\"', size: 12582912 },\n" +
            "  { key: 'anh/3.jpg',    etag: '\"62779858262432b238005e27d389b376-1\"', size: 2097152 },\n" +
            "  { key: 'anh/5.jpg',    etag: '\"d41d8cd98f00b204e9800998ecf8427e\"',   size: 0 },\n" +
            "  { key: 'cu/bo-di.bin', etag: '\"9dd4e461268c8034f5c8564e155c67a6\"',   size: 5 },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function doiSoat(nguon, dich, moc) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function tongKet(ket) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function xoaNguonDuoc(ket) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const ket = doiSoat(NGUON, DICH, MOC);\n' +
            "for (const [k, l] of ket) console.log(l + '\\t' + k);\n" +
            'console.log(JSON.stringify(tongKet(ket)));\n' +
            'console.log(xoaNguonDuoc(ket));\n',
          expectedOutput:
            'MP-DIFF\tanh/1.jpg\n' +
            'OK\tanh/2.jpg\n' +
            'ETAG\tanh/3.jpg\n' +
            'MISSING\tanh/4.jpg\n' +
            'OK\tanh/5.jpg\n' +
            'MOI_HON_MOC\tanh/6.jpg\n' +
            'EXTRA\tcu/bo-di.bin\n' +
            '{"MP-DIFF":1,"OK":2,"ETAG":1,"MISSING":1,"MOI_HON_MOC":1,"EXTRA":1}\n' +
            'CHUA — con 3 key phai xu ly: anh/3.jpg, anh/4.jpg, anh/6.jpg',
          sampleSolution:
            "const ghep = (o) => o.etag.includes('-');   // hậu tố -N ⇒ ghép từ nhiều phần\n\n" +
            'function doiSoat(nguon, dich, moc) {\n' +
            '  const bangDich = new Map(dich.map((o) => [o.key, o]));\n' +
            '  const ket = [];\n' +
            '  for (const s of nguon) {\n' +
            '    const d = bangDich.get(s.key);\n' +
            "    if (!d) { ket.push([s.key, s.doi > moc ? 'MOI_HON_MOC' : 'MISSING']); continue; }\n" +
            "    if (d.etag === s.etag) { ket.push([s.key, 'OK']); continue; }\n" +
            '    // Khác thuật toán ETag KHÔNG suy ra khác byte — nhưng chỉ khi kích thước khớp.\n' +
            '    if (ghep(s) !== ghep(d) && s.size === d.size) {\n' +
            "      ket.push([s.key, 'MP-DIFF']);\n" +
            '    } else {\n' +
            "      ket.push([s.key, 'ETAG']);\n" +
            '    }\n' +
            '  }\n' +
            '  const bangNguon = new Set(nguon.map((o) => o.key));\n' +
            "  for (const d of dich) if (!bangNguon.has(d.key)) ket.push([d.key, 'EXTRA']);\n" +
            '  ket.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));\n' +
            '  return ket;\n' +
            '}\n\n' +
            'function tongKet(ket) {\n' +
            '  const dem = {};\n' +
            '  for (const [, loai] of ket) dem[loai] = (dem[loai] ?? 0) + 1;\n' +
            '  return dem;\n' +
            '}\n\n' +
            'function xoaNguonDuoc(ket) {\n' +
            "  const chan = ket.filter(([, l]) => l === 'MISSING' || l === 'ETAG' || l === 'MOI_HON_MOC');\n" +
            '  return chan.length === 0\n' +
            "    ? 'DUOC — moi key deu khop hoac chi khac cach ghep'\n" +
            "    : 'CHUA — con ' + chan.length + ' key phai xu ly: ' + chan.map(([k]) => k).join(', ');\n" +
            '}\n',
        }),
      ],
    },
  ],
};
