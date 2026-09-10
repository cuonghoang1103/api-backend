/**
 * Redis — Progress Test 2 (chương s05–s08).
 *
 * Đề tự soạn, bám sát giáo trình `content/courses/redis/s05…s08`. 30 câu trắc
 * nghiệm + 2 câu lập trình làm ngay trong phòng thi (chấm bằng AI theo rubric).
 *
 * ⚠️ MỌI transcript `redis-cli`, mọi giá trị trả về, mọi `OBJECT ENCODING`,
 * mọi phép kiểm MULTI/WATCH và mọi số đo về Stream trong đề đều CHẠY THẬT trên
 * một máy chủ nháp dựng bằng
 * `docker run -d --name redis-de-thi-pt -p 63799:6379 redis:7-alpine`,
 * báo `redis_version:7.4.9`, `redis_mode:standalone`. Các phép kiểm WATCH cần
 * giữ MỘT kết nối sống qua nhiều bước nên chạy bằng socket TCP trần (Node
 * `net`), không phải `redis-cli` (mỗi dòng `redis-cli` là một kết nối mới, và
 * WATCH là trạng thái CỦA KẾT NỐI — đo bằng redis-cli sẽ ra kết quả sai).
 * Container đã `docker rm -f` sau khi đo xong.
 *
 * ⚠️ BỐN CHỖ MÁY KHÁC GIÁO TRÌNH — đề lấy theo MÁY:
 *   • Bài 5.2 in `hash-max-listpack-entries` = **128**. Ảnh chính thức 7.4.9
 *     trả về **512**. Đo lại bằng dữ liệu thật: hash 129 trường vẫn `listpack`,
 *     phải tới 513 trường mới thành `hashtable`. (Ngưỡng GIÁ TRỊ thì đúng như
 *     bài viết: 64 byte → `listpack`, 65 byte → `hashtable`.)
 *   • Bài 5.4 in `HEXPIRE nosuchkey 60 FIELDS 1 f` → `(error) ERR no such key`.
 *     Máy 7.4.9 trả về một MẢNG chứa `-2`, giống hệt trường-không-tồn-tại. Đo
 *     bằng RESP trần cho chắc: `*1\r\n:-2\r\n`. Nghĩa là cái "bất đối xứng"
 *     mà bài học nhấn mạnh (trường thiếu thì im lặng, khoá thiếu thì lỗi cứng)
 *     KHÔNG còn đúng ở bản này.
 *   • Bài 7.2 nói "Natural expiry does not count. Since Redis 6.0.9, a watched
 *     key expiring on its own does not abort EXEC." Đo thật, 3 lượt liên tiếp:
 *     khoá được WATCH rồi hết hạn **SAU ĐÓ** thì EXEC **VẪN HUỶ** (trả `*-1`).
 *     Điều bản vá 6.0.9 sửa là ca hẹp hơn nhiều: khoá đã hết hạn **TRƯỚC** lúc
 *     gọi WATCH thì mới không huỷ — ca đó đo được EXEC chạy bình thường.
 *     Câu 17 hỏi đúng cặp đối chứng này.
 *   • Bài 8.2 mô tả `MAXLEN ~ 1000` là "khoảng 1000, không bao giờ ít hơn".
 *     Đo thật trên stream 100.000 mục: MỘT lượt `XTRIM s MAXLEN ~ 1000` chỉ xoá
 *     **10.000** mục và để lại 90.000. Lý do là cái trần ngầm: khi có `~` mà
 *     không ghi `LIMIT`, Redis tự đặt LIMIT = 100 × `stream-node-max-entries`
 *     (đo được = 100) = 10.000. Chạy `LIMIT 0` thì nó cắt hết trong một lượt.
 *
 * ⚠️ ĐỀ KHÔNG HỎI SỐ ĐO THỜI GIAN (máy đo đang chạy nhiều việc song song). Các
 * số bộ nhớ được dùng là số ĐO ĐƯỢC trên chính máy này và chỉ dùng để so SÁNH
 * hai trạng thái của cùng một khoá, không dùng làm hằng số phải nhớ.
 *
 * Phân bố: s05 ×7 · s06 ×7 · s07 ×8 · s08 ×8 = 30 câu trắc nghiệm, cộng 2 câu
 * lập trình (bộ đệm chống giẫm đạp — chương 6; Pub/Sub so với Stream khi
 * consumer mất kết nối — chương 8).
 * Vị trí đáp án A/B/C/D = 7/8/8/7 (đếm bằng lệnh trong CLAUDE.md).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/REDIS-PT2.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/redis-exam-kit.mjs';

export default {
  course: { slug: 'redis' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 5–8 (hashes, caching, atomicity, Pub/Sub and Streams)',
        'Kiểm tra tiến độ 2 — Chương 5–8 (hash, làm bộ đệm, tính nguyên tử, Pub/Sub và Stream)',
      ),
      description: B(
        'The middle third of the Redis course: modelling an object with a hash and per-field TTL, caching properly — invalidation, stampedes, consistency and measurement — atomicity with MULTI, WATCH, Lua and Functions, and moving messages with Pub/Sub and Streams. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba giữa của khoá Redis: mô hình hoá đối tượng bằng hash và TTL theo từng trường, làm bộ đệm cho đúng — vô hiệu hoá, giẫm đạp, nhất quán và đo lường — tính nguyên tử với MULTI, WATCH, Lua và Functions, rồi chuyển thông điệp bằng Pub/Sub và Stream. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '5–8'),
      questions: [
        // ── Chương 5 — Hash ─────────────────────────────────────────────
        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, in this order on a key that did not exist. Fill in the four missing replies.' + code(
              '> HSET user:1042 name Cuong email c@ex.com plan free logins 0\n' +
              '(integer) 4\n' +
              '> HSET user:1042 plan pro city HN\n' +
              '?\n' +
              '> HSETNX user:1042 plan enterprise\n' +
              '?\n' +
              '> HDEL user:1042 email\n' +
              '?\n' +
              '> HDEL user:1042 email\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9, theo đúng thứ tự này, trên một khoá chưa tồn tại. Điền bốn dòng trả lời còn thiếu.' + code(
              '> HSET user:1042 name Cuong email c@ex.com plan free logins 0\n' +
              '(integer) 4\n' +
              '> HSET user:1042 plan pro city HN\n' +
              '?\n' +
              '> HSETNX user:1042 plan enterprise\n' +
              '?\n' +
              '> HDEL user:1042 email\n' +
              '?\n' +
              '> HDEL user:1042 email\n' +
              '?',
            ),
          ),
          options: [
            B('<code>2</code>, <code>1</code>, <code>1</code>, <code>1</code>', '<code>2</code>, <code>1</code>, <code>1</code>, <code>1</code>'),
            B('<code>1</code>, <code>0</code>, <code>1</code>, <code>0</code>', '<code>1</code>, <code>0</code>, <code>1</code>, <code>0</code>'),
            B('<code>2</code>, <code>0</code>, <code>1</code>, <code>0</code>', '<code>2</code>, <code>0</code>, <code>1</code>, <code>0</code>'),
            B('<code>1</code>, <code>1</code>, <code>0</code>, <code>0</code>', '<code>1</code>, <code>1</code>, <code>0</code>, <code>0</code>'),
          ],
          correct: 1,
          explanation: EX(
            '<code>HSET</code> reports how many fields were <b>new</b>, not how many you sent: <code>plan</code> already existed and was overwritten, <code>city</code> was new, so the reply is 1. <code>HSETNX</code> refuses to touch an existing field and returns 0 — a one-command "initialise if nobody has yet" with no read and no race. <code>HDEL</code> reports how many fields it actually removed, so the second call returns 0. Every one of these return values is a free existence check; code that ignores them usually ends up doing an extra <code>HEXISTS</code> round trip to learn something it was already told.',
            '<code>HSET</code> báo có bao nhiêu trường là MỚI, chứ không phải bạn gửi bao nhiêu: <code>plan</code> đã có sẵn và bị ghi đè, <code>city</code> là mới, nên trả về 1. <code>HSETNX</code> từ chối đụng vào trường đã tồn tại và trả 0 — một lệnh duy nhất làm việc "khởi tạo nếu chưa ai đặt", không cần đọc trước, không có cuộc đua. <code>HDEL</code> báo nó thật sự gỡ được bao nhiêu trường, nên lần gọi thứ hai trả 0. Mỗi giá trị trả về ấy đều là một phép kiểm tồn tại miễn phí; mã bỏ qua chúng thường phải đi thêm một vòng <code>HEXISTS</code> để biết đúng cái điều vừa được nói cho nghe.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on the official <code>redis:7-alpine</code> image (7.4.9), building hashes with short values:' + code(
              'hash with 129 fields  -> OBJECT ENCODING = "listpack"\n' +
              'hash with 513 fields  -> OBJECT ENCODING = "hashtable"\n' +
              'hash with 1 field, value 64 bytes -> "listpack"\n' +
              'hash with 1 field, value 65 bytes -> "hashtable"',
            ) + 'Which reading of this is correct?',
            'Đo thật trên ảnh chính thức <code>redis:7-alpine</code> (7.4.9), dựng hash bằng các giá trị ngắn:' + code(
              'hash 129 trường  -> OBJECT ENCODING = "listpack"\n' +
              'hash 513 trường  -> OBJECT ENCODING = "hashtable"\n' +
              'hash 1 trường, giá trị 64 byte -> "listpack"\n' +
              'hash 1 trường, giá trị 65 byte -> "hashtable"',
            ) + 'Cách đọc nào là ĐÚNG?',
          ),
          options: [
            B('Either threshold flips it, and on this build the entry threshold is 512 — check it, do not memorise it', 'Ngưỡng nào vượt cũng lật, và trên bản dựng này ngưỡng số trường là 512 — hãy kiểm, đừng học thuộc'),
            B('Only the field count matters; the 65-byte case converted because 65 fields had been added earlier', 'Chỉ số lượng trường mới quan trọng; ca 65 byte chuyển đổi là vì trước đó đã thêm 65 trường'),
            B('The entry threshold is always 128 and this instance was started with a non-default config file', 'Ngưỡng số trường luôn là 128 và instance này đã được khởi động bằng một file cấu hình khác mặc định'),
            B('Encoding depends only on total hash size in bytes; the field count is never consulted at all', 'Cách mã hoá chỉ phụ thuộc tổng kích thước hash tính bằng byte; số lượng trường không hề được xét tới'),
          ],
          correct: 0,
          explanation: EX(
            'Two independent thresholds flip a hash from <code>listpack</code> to <code>hashtable</code>: more than <code>hash-max-listpack-entries</code> fields, or any single field name or value longer than <code>hash-max-listpack-value</code> (64). On this image <code>CONFIG GET hash-max-listpack-entries</code> returns <b>512</b>, not the 128 you will see quoted almost everywhere — which is exactly why the habit is to ask the server rather than to trust a number in a document. It matters because the conversion is one-way and costs roughly 60–100 bytes of overhead per field forever: if you are bucketing many small objects into one hash to save memory, the bucket size must be chosen from the threshold your own server reports, with headroom.',
            'Có HAI ngưỡng độc lập lật một hash từ <code>listpack</code> sang <code>hashtable</code>: nhiều hơn <code>hash-max-listpack-entries</code> trường, hoặc bất kỳ tên trường hay giá trị nào dài hơn <code>hash-max-listpack-value</code> (64). Trên ảnh này <code>CONFIG GET hash-max-listpack-entries</code> trả về <b>512</b>, chứ không phải con số 128 mà gần như ở đâu cũng thấy trích dẫn — và đó chính là lý do phải tập thói quen HỎI MÁY CHỦ thay vì tin một con số trong tài liệu. Chuyện này quan trọng vì phép chuyển đổi là một chiều và tốn khoảng 60–100 byte phí tổn cho mỗi trường, mãi mãi: nếu bạn đang gom nhiều đối tượng nhỏ vào một hash để tiết kiệm bộ nhớ thì kích thước xô phải chọn theo ngưỡng mà chính máy chủ của bạn báo, và phải chừa dư.',
          ),
        }),

        mcq({
          prompt: B(
            'A background job updates <code>last_seen</code> while a request updates <code>bio</code> on the same user, at the same moment. The user is stored as a JSON string. What goes wrong, and why does a hash not have the problem?',
            'Một việc chạy nền cập nhật <code>last_seen</code> trong lúc một request cập nhật <code>bio</code> trên cùng một người dùng, ở cùng khoảnh khắc. Người dùng được lưu dưới dạng một chuỗi JSON. Hỏng ở đâu, và vì sao hash không dính?',
          ),
          options: [
            B('Nothing goes wrong: Redis serialises every write, so the two SET commands are applied one after the other', 'Không hỏng gì: Redis xếp mọi lệnh ghi theo thứ tự, nên hai lệnh SET được áp lần lượt cái này rồi cái kia'),
            B('The JSON string is corrupted, because two writers interleave bytes inside the same value buffer', 'Chuỗi JSON bị hỏng, vì hai bên ghi đan xen từng byte vào trong cùng một vùng đệm giá trị'),
            B('Both read the whole object, change their own field and write it back; the second write erases the first field', 'Cả hai đọc nguyên đối tượng, sửa trường của mình rồi ghi lại; lượt ghi sau xoá mất trường của lượt trước'),
            B('Redis rejects the second write with a WRONGTYPE error, so the losing writer at least finds out it lost', 'Redis từ chối lượt ghi thứ hai bằng lỗi WRONGTYPE, nên ít nhất bên thua cũng biết là mình đã thua'),
          ],
          correct: 2,
          explanation: EX(
            'Both <code>SET</code> commands succeed and both are atomic — the lost update happens in the gap between each side\'s <code>GET</code> and its <code>SET</code>, which Redis knows nothing about. Whoever writes second is holding a copy that never contained the other field\'s new value, and it overwrites it silently with no error and no log line. <code>HSET user:1042 bio …</code> touches one field, so two writers on two fields cannot collide at all — that atomic-per-field property is the reason to reach for a hash, and it is not something a JSON string can be given without a <code>WATCH</code> retry loop or a Lua script. It also sends twenty bytes instead of moving the whole object across the network twice.',
            'Cả hai lệnh <code>SET</code> đều thành công và đều nguyên tử — chỗ mất cập nhật nằm ở khoảng trống giữa lệnh <code>GET</code> và lệnh <code>SET</code> của mỗi bên, khoảng mà Redis không hề hay biết. Bên ghi sau đang cầm một bản sao chưa từng chứa giá trị mới của trường bên kia, và nó ghi đè lên một cách âm thầm, không lỗi, không một dòng log. <code>HSET user:1042 bio …</code> chỉ đụng vào MỘT trường, nên hai bên ghi vào hai trường không thể va nhau — tính nguyên tử theo từng trường ấy chính là lý do chọn hash, và đó là thứ không thể ban cho một chuỗi JSON nếu không kèm vòng lặp thử lại bằng <code>WATCH</code> hoặc một script Lua. Nó còn gửi hai mươi byte thay vì kéo cả đối tượng qua mạng hai lượt.',
          ),
        }),

        mcq({
          prompt: B(
            'A stats hash has a fixed dimension list and a dashboard reads it with <code>HGETALL</code> every ten seconds. A new dimension <code>path:&lt;url&gt;</code> is added on a site with user-generated URLs. What breaks, and when?',
            'Một hash thống kê có danh sách chiều cố định, và một bảng điều khiển đọc nó bằng <code>HGETALL</code> mỗi mười giây. Người ta thêm một chiều mới <code>path:&lt;url&gt;</code> trên một trang có URL do người dùng tạo. Cái gì vỡ, và vỡ lúc nào?',
          ),
          options: [
            B('Nothing breaks: Redis caps a hash at 512 fields and rejects further HINCRBY calls with an error', 'Không vỡ gì: Redis chặn hash ở 512 trường và từ chối các lệnh HINCRBY tiếp theo bằng một lỗi'),
            B('It breaks at the next deploy, because a hash that grew past its encoding threshold cannot be loaded from RDB', 'Nó vỡ vào lần deploy kế tiếp, vì hash đã vượt ngưỡng mã hoá thì không nạp lại được từ file RDB'),
            B('The dashboard breaks first: HGETALL starts returning fields in a non-deterministic order once encoding flips', 'Bảng điều khiển vỡ trước: HGETALL bắt đầu trả các trường theo thứ tự bất định khi cách mã hoá đổi'),
            B('The hash now grows with traffic, so within hours the "safe" HGETALL is an O(N) command blocking the server', 'Cái hash giờ lớn theo lưu lượng, nên chỉ vài giờ là lệnh HGETALL "an toàn" thành một lệnh O(N) chặn máy chủ'),
          ],
          correct: 3,
          explanation: EX(
            'The only thing that made that <code>HGETALL</code> safe was that <em>you</em> wrote the dimension list, so its field count was bounded by your feature set rather than by traffic. A user-supplied dimension removes the bound: the hash crosses its encoding threshold within an hour, converts to a hashtable, and keeps growing — and the dashboard\'s "cheap" read becomes an O(400,000) command that blocks the single thread every ten seconds. None of it shows up in testing, because test data has six paths. Before adding a dimension, ask what its cardinality is at a million requests; if the answer is "unbounded", the right structure is a sorted set trimmed to the top 100 with <code>ZREMRANGEBYRANK</code>, not another hash field.',
            'Thứ duy nhất làm lệnh <code>HGETALL</code> ấy an toàn là danh sách chiều do CHÍNH BẠN viết ra, nên số trường bị chặn bởi tập tính năng chứ không bởi lưu lượng. Một chiều lấy từ người dùng gỡ mất cái chặn đó: cái hash vượt ngưỡng mã hoá trong vòng một giờ, chuyển sang hashtable, và cứ thế lớn thêm — còn phép đọc "rẻ" của bảng điều khiển thành một lệnh O(400.000) chặn cái luồng duy nhất, cứ mười giây một lần. Không gì trong số đó lộ ra lúc kiểm thử, vì dữ liệu thử chỉ có sáu đường dẫn. Trước khi thêm một chiều, hãy hỏi lực lượng bản số của nó ở mức một triệu request; nếu câu trả lời là "không chặn được" thì cấu trúc đúng là một sorted set cắt còn top 100 bằng <code>ZREMRANGEBYRANK</code>, chứ không phải thêm một trường hash nữa.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. A "remove one" button is pressed more times than there are items.' + code(
              '> HINCRBY cart:1042 sku:1 2\n' +
              '(integer) 2\n' +
              '> HINCRBY cart:1042 sku:1 -5\n' +
              '(integer) -3',
            ) + 'Why can this not be fixed with a check before the increment, nor with MULTI?',
            'Chạy thật trên Redis 7.4.9. Nút "bớt một" bị bấm nhiều lần hơn số món đang có.' + code(
              '> HINCRBY cart:1042 sku:1 2\n' +
              '(integer) 2\n' +
              '> HINCRBY cart:1042 sku:1 -5\n' +
              '(integer) -3',
            ) + 'Vì sao chuyện này không sửa được bằng một phép kiểm trước khi tăng, cũng không sửa được bằng MULTI?',
          ),
          options: [
            B('Reading then writing is a race between two tabs, and MULTI cannot branch on a value it has not run yet', 'Đọc rồi ghi là một cuộc đua giữa hai tab, còn MULTI không thể rẽ nhánh theo một giá trị nó chưa chạy'),
            B('HINCRBY is not atomic on a negative argument, so the two commands must be combined into one HSET', 'HINCRBY không nguyên tử khi tham số âm, nên hai lệnh phải được gộp lại thành một lệnh HSET'),
            B('MULTI would work, but only if both commands touch the same field; here they touch the same key', 'MULTI vẫn được, nhưng chỉ khi hai lệnh đụng cùng một trường; ở đây chúng đụng cùng một khoá'),
            B('It can be fixed with <code>HSETNX</code>, which refuses any write that would make a field negative', 'Sửa được bằng <code>HSETNX</code>, lệnh này từ chối mọi phép ghi làm một trường trở thành số âm'),
          ],
          correct: 0,
          explanation: EX(
            'Redis has no constraints — no <code>CHECK (qty &gt; 0)</code>, no triggers — so <code>HINCRBY</code> happily takes a quantity below zero and the checkout page will cheerfully price it. Validating first is a read-then-write race: two tabs both read 1, both decide they are allowed to decrement, both proceed. And <code>MULTI</code> cannot help because every command is <em>queued</em> before any of them runs, so there is no point at which your application can see the new value and decide whether to delete the field. This is the first problem in the course that genuinely needs Lua: five lines that <code>HINCRBY</code>, compare and <code>HDEL</code> inside the server, as one uninterruptible step.',
            'Redis không có ràng buộc nào — không <code>CHECK (qty &gt; 0)</code>, không trigger — nên <code>HINCRBY</code> vui vẻ nhận số lượng dưới không, và trang thanh toán sẽ hồn nhiên tính tiền cho nó. Kiểm trước là một cuộc đua đọc-rồi-ghi: hai tab cùng đọc ra 1, cùng kết luận là được phép trừ, cùng đi tiếp. Còn <code>MULTI</code> không cứu được vì mọi lệnh đều được XẾP HÀNG trước khi có lệnh nào chạy, nên chẳng có thời điểm nào để ứng dụng nhìn thấy giá trị mới rồi quyết định có xoá trường hay không. Đây là bài toán đầu tiên trong khoá thật sự cần tới Lua: năm dòng làm <code>HINCRBY</code>, so sánh rồi <code>HDEL</code> ngay trong máy chủ, như một bước không thể ngắt.',
          ),
        }),

        mcq({
          prompt: B(
            'A million tiny objects are stored two ways: a million top-level keys, versus ten thousand hashes of 100 fields each. The bucketed version uses a fraction of the memory. What does that trade cost you?',
            'Một triệu đối tượng nhỏ được lưu theo hai cách: một triệu khoá cấp cao nhất, so với mười nghìn hash mỗi hash 100 trường. Bản gom xô tốn ít bộ nhớ hơn hẳn. Sự đánh đổi ấy khiến bạn mất gì?',
          ),
          options: [
            B('Nothing measurable: a listpack lookup is also O(1), and every per-key command works unchanged on a field', 'Không mất gì đáng kể: tra cứu trong listpack cũng là O(1), và mọi lệnh theo khoá vẫn chạy y hệt trên một trường'),
            B('Durability: hashes are excluded from RDB snapshots, so bucketed objects are lost on every restart', 'Độ bền: hash không nằm trong ảnh chụp RDB, nên các đối tượng gom xô mất sạch sau mỗi lần khởi động lại'),
            B('Lookups become a linear scan of the bucket, and you lose per-object SCAN, MEMORY USAGE and (before 7.4) TTL', 'Tra cứu thành quét tuyến tính trong xô, và bạn mất SCAN, MEMORY USAGE theo từng đối tượng, và (trước 7.4) mất cả TTL'),
            B('Atomicity: two writers updating two different fields of the same bucket can lose one of the two writes', 'Tính nguyên tử: hai bên ghi vào hai trường khác nhau của cùng một xô có thể làm mất một trong hai lượt ghi'),
          ],
          correct: 2,
          explanation: EX(
            'The saving is real and it comes from not paying top-level key overhead a million times — a key costs a dict entry, an object header, an SDS header, an expires slot and allocator rounding before your value, while a field inside a listpack costs a length prefix. What you give up: a listpack is scanned linearly, so a lookup is O(bucket) rather than a hash probe (microseconds, but a trade); there is no <code>SCAN MATCH obj:12345</code>, no per-object <code>MEMORY USAGE</code>, no per-object <code>OBJECT ENCODING</code>; and before Redis 7.4 the whole bucket had to expire together, which is the single constraint that ruled the trick out for caches until <code>HEXPIRE</code> arrived. Atomicity is <em>not</em> lost — that is the one thing a hash keeps.',
            'Phần tiết kiệm là có thật, và nó đến từ việc không phải trả phí khoá cấp cao nhất một triệu lần — một cái khoá tốn một mục từ điển, một phần đầu đối tượng, một phần đầu SDS, một ô trong từ điển expires và phần làm tròn của bộ cấp phát, trước cả giá trị của bạn; còn một trường trong listpack chỉ tốn một tiền tố độ dài. Cái phải trả: listpack được quét tuyến tính nên tra cứu là O(kích thước xô) chứ không phải một phép dò băm (vẫn tính bằng micro giây, nhưng là một đánh đổi); không còn <code>SCAN MATCH obj:12345</code>, không còn <code>MEMORY USAGE</code> hay <code>OBJECT ENCODING</code> theo từng đối tượng; và trước Redis 7.4 thì cả xô phải hết hạn cùng lúc — đúng cái ràng buộc đã loại mẹo này khỏi các bộ đệm cho tới khi có <code>HEXPIRE</code>. Tính nguyên tử thì KHÔNG mất — đó là thứ hash vẫn giữ.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. <code>sess</code> holds fields <code>token</code> (with a TTL) and <code>theme</code>; <code>ghost</code> does not exist at all. Fill in the three missing replies.' + code(
              '> HEXPIRE sess 60 FIELDS 1 nosuchfield\n' +
              '?\n' +
              '> HEXPIRE ghost 60 FIELDS 1 f\n' +
              '?\n' +
              '> HEXPIRE sess 0 FIELDS 1 theme\n' +
              '?\n' +
              '> HEXISTS sess theme\n' +
              '(integer) 0',
            ),
            'Chạy thật trên Redis 7.4.9. <code>sess</code> có trường <code>token</code> (đã đặt TTL) và <code>theme</code>; còn <code>ghost</code> thì hoàn toàn không tồn tại. Điền ba dòng trả lời còn thiếu.' + code(
              '> HEXPIRE sess 60 FIELDS 1 nosuchfield\n' +
              '?\n' +
              '> HEXPIRE ghost 60 FIELDS 1 f\n' +
              '?\n' +
              '> HEXPIRE sess 0 FIELDS 1 theme\n' +
              '?\n' +
              '> HEXISTS sess theme\n' +
              '(integer) 0',
            ),
          ),
          options: [
            B('<code>1) (integer) -2</code>, then <code>(error) ERR no such key</code>, then <code>1) (integer) 1</code>', '<code>1) (integer) -2</code>, rồi <code>(error) ERR no such key</code>, rồi <code>1) (integer) 1</code>'),
            B('<code>1) (integer) 0</code>, then <code>1) (integer) 0</code>, then <code>1) (integer) 0</code>', '<code>1) (integer) 0</code>, rồi <code>1) (integer) 0</code>, rồi <code>1) (integer) 0</code>'),
            B('<code>1) (integer) -1</code>, then <code>1) (integer) -1</code>, then <code>1) (integer) 1</code>', '<code>1) (integer) -1</code>, rồi <code>1) (integer) -1</code>, rồi <code>1) (integer) 1</code>'),
            B('<code>1) (integer) -2</code>, then <code>1) (integer) -2</code>, then <code>1) (integer) 2</code>', '<code>1) (integer) -2</code>, rồi <code>1) (integer) -2</code>, rồi <code>1) (integer) 2</code>'),
          ],
          correct: 3,
          explanation: EX(
            'The return codes are the API: <b>-2</b> no such field, <b>-1</b> the field exists with no TTL, <b>0</b> your NX/XX/GT/LT condition refused the change, <b>1</b> the TTL was set, <b>2</b> the deadline was zero or already past so the field was <em>deleted on the spot</em> — which is why <code>HEXISTS</code> then returns 0. On this build a missing <b>key</b> also comes back as an array containing -2 rather than as a hard error, verified over a raw socket (<code>*1</code> then <code>:-2</code>); several write-ups still describe the older behaviour where it was <code>ERR no such key</code>, so check your own server rather than trusting the asymmetry. And note that <b>0</b> is not a failure — it is your guard working, and code that ignores it believes it set a TTL it did not set.',
            'Các mã trả về CHÍNH LÀ giao diện lập trình: <b>-2</b> không có trường ấy, <b>-1</b> trường có tồn tại nhưng không có TTL, <b>0</b> điều kiện NX/XX/GT/LT của bạn đã từ chối thay đổi, <b>1</b> đã đặt được TTL, <b>2</b> hạn bằng không hoặc đã trôi qua nên trường bị XOÁ NGAY LẬP TỨC — vì thế <code>HEXISTS</code> sau đó trả 0. Trên bản dựng này, KHOÁ không tồn tại cũng trả về một mảng chứa -2 chứ không phải một lỗi cứng, đã kiểm bằng socket trần (<code>*1</code> rồi <code>:-2</code>); nhiều tài liệu vẫn mô tả hành vi cũ là <code>ERR no such key</code>, nên hãy hỏi chính máy chủ của bạn thay vì tin vào sự bất đối xứng đó. Và nhớ rằng <b>0</b> không phải thất bại — đó là cái chốt của bạn đang làm việc, và mã bỏ qua nó sẽ đinh ninh là đã đặt một TTL mà thực ra chưa đặt.',
          ),
        }),

        // ── Chương 6 — Bộ đệm ───────────────────────────────────────────
        mcq({
          prompt: B(
            'Cache-aside is described as "degrades safely when Redis is down". Under what condition is that actually true?',
            'Cache-aside được mô tả là "suy giảm an toàn khi Redis chết". Điều đó thật sự đúng với điều kiện nào?',
          ),
          options: [
            B('Always: mainstream Redis clients return null rather than throwing when the server is unreachable', 'Luôn đúng: các thư viện client Redis phổ biến trả về null chứ không ném lỗi khi không với tới máy chủ'),
            B('Only if you catch the error and treat it as a miss — otherwise a Redis blip becomes a 500', 'Chỉ khi bạn bắt lỗi và coi nó như một lần trượt bộ đệm — nếu không thì một cú chớp của Redis thành lỗi 500'),
            B('Only while the TTL has not elapsed, because an expired key and an unreachable server behave alike', 'Chỉ khi TTL chưa trôi qua, vì một khoá hết hạn và một máy chủ không với tới được thì hành xử như nhau'),
            B('Only with a replica configured, so that the client library fails over to it without the caller noticing', 'Chỉ khi đã cấu hình một replica, để thư viện client tự chuyển sang nó mà bên gọi không hay biết'),
          ],
          correct: 1,
          explanation: EX(
            'The safe degradation is a property of your error handling, not of the pattern. A <code>GET</code> that throws and is not caught propagates out of the handler, and you have turned a performance optimisation into a hard dependency — the exact outage shape where "the cache went down and took the site with it". Two details go with it: the cache <em>write</em> should not be awaited and its failure should be swallowed, because the value is already computed and being returned, so a failed write costs one future miss and nothing else; and on a cache a short client timeout that falls through to the database beats a five-second wait. Decide that timeout deliberately rather than inheriting the default.',
            'Việc suy giảm an toàn là tính chất của phần XỬ LÝ LỖI của bạn, chứ không phải của khuôn mẫu. Một lệnh <code>GET</code> ném lỗi mà không được bắt sẽ lan ra khỏi hàm xử lý, và bạn vừa biến một phép tối ưu hiệu năng thành một phụ thuộc cứng — đúng cái hình dạng sự cố "bộ đệm chết và kéo cả web đi theo". Kèm theo là hai chi tiết: lệnh GHI vào bộ đệm không nên await và lỗi của nó nên được nuốt đi, vì giá trị đã tính xong và đang trên đường trả về, nên một lượt ghi hỏng chỉ tốn thêm một lần trượt trong tương lai chứ không gì khác; và với một bộ đệm thì một hạn chờ ngắn phía client rồi rơi thẳng xuống cơ sở dữ liệu tốt hơn là chờ năm giây. Hãy quyết cái hạn chờ ấy có chủ đích, đừng thừa hưởng giá trị mặc định.',
          ),
        }),

        mcq({
          prompt: B(
            'On a write, why should you DELETE the cache key rather than write the new value into it?',
            'Khi có lượt ghi, vì sao nên XOÁ khoá bộ đệm thay vì ghi giá trị mới vào đó?',
          ),
          options: [
            B('Because a SET on an existing cache key is rejected unless you also re-specify the original TTL', 'Vì lệnh SET lên một khoá bộ đệm đang có sẽ bị từ chối nếu bạn không ghi lại đúng TTL ban đầu'),
            B('Because deleting frees memory immediately while writing a value leaves the old allocation behind', 'Vì xoá thì trả lại bộ nhớ ngay, còn ghi một giá trị mới thì để lại vùng cấp phát cũ nằm đó'),
            B('Because writing a value races: two writers can interleave so the OLDER value lands last', 'Vì ghi giá trị là một cuộc đua: hai bên ghi có thể đan xen khiến giá trị CŨ HƠN lại đáp xuống sau cùng'),
            B('Because a cached value written by the application is not counted in <code>keyspace_hits</code> afterwards', 'Vì giá trị do ứng dụng ghi vào sẽ không được tính vào <code>keyspace_hits</code> sau đó nữa'),
          ],
          correct: 2,
          explanation: EX(
            'A writes DB(1), B writes DB(2), B writes cache(2), A writes cache(1) — the database says 2 and the cache says 1 for a full TTL, with no error anywhere. Deleting is idempotent, so concurrent writers cannot order themselves wrongly: whoever reads next reloads the committed truth. Two habits go with it. Prefer <code>UNLINK</code> to <code>DEL</code>, so a large key is freed on a background thread instead of blocking the single thread. And write the database <em>first</em>, delete <em>second</em> — deleting first opens a wide window in which a concurrent reader misses, reads the pre-write row and caches it for a full TTL.',
            'A ghi DB(1), B ghi DB(2), B ghi cache(2), A ghi cache(1) — cơ sở dữ liệu nói 2 còn bộ đệm nói 1, suốt trọn một TTL, và chẳng đâu có lỗi nào cả. Xoá thì lũy đẳng, nên hai bên ghi đồng thời không thể tự xếp sai thứ tự: ai đọc kế tiếp sẽ nạp lại đúng sự thật đã commit. Kèm theo là hai thói quen. Ưu tiên <code>UNLINK</code> hơn <code>DEL</code>, để một khoá lớn được giải phóng ở luồng nền thay vì chặn cái luồng duy nhất. Và ghi cơ sở dữ liệu TRƯỚC, xoá bộ đệm SAU — xoá trước sẽ mở toang một cửa sổ để một người đọc song song trượt bộ đệm, đọc trúng hàng dữ liệu trước khi ghi, rồi nhét nó vào bộ đệm trọn một TTL.',
          ),
        }),

        mcq({
          prompt: B(
            'A team adds TTL jitter (<code>EX 300 + random(0,60)</code>) everywhere. The homepage cache key still causes a burst of two hundred identical database queries every few minutes. Why did jitter not help?',
            'Một nhóm thêm nhiễu TTL (<code>EX 300 + random(0,60)</code>) ở khắp nơi. Khoá bộ đệm của trang chủ vẫn gây ra một cụm hai trăm truy vấn cơ sở dữ liệu y hệt nhau, cứ vài phút một lần. Vì sao nhiễu TTL không giúp được?',
          ),
          options: [
            B('Redis rounds every TTL to whole seconds, which cancels the randomisation for values under a minute', 'Redis làm tròn mọi TTL về số giây nguyên, việc đó triệt tiêu phần ngẫu nhiên với các giá trị dưới một phút'),
            B('The jitter range is too small; 20% of the base TTL is the minimum that has any measurable effect', 'Khoảng nhiễu quá nhỏ; 20% của TTL gốc mới là mức tối thiểu tạo ra được hiệu ứng đo lường được'),
            B('Jitter is applied at read time, not at write time, so a key written once never receives any jitter', 'Nhiễu được áp lúc đọc chứ không phải lúc ghi, nên một khoá chỉ ghi một lần thì không bao giờ nhận được nhiễu'),
            B('Jitter spreads deadlines across many keys; one hot key has one deadline no matter how you randomise it', 'Nhiễu TTL rải hạn ra trên NHIỀU khoá; một khoá nóng thì chỉ có MỘT cái hạn, ngẫu nhiên hoá kiểu gì cũng vậy'),
          ],
          correct: 3,
          explanation: EX(
            'Three different problems share the name "stampede" and they need three different fixes. Jitter fixes exactly one: <em>synchronised expiry</em>, where a deploy or a bulk import wrote ten thousand keys in the same second with the same TTL. It does nothing for a single hot key, where two hundred requests were simply in flight at the moment that one key expired and all of them dutifully queried the database — which is what cache-aside tells them to do. That needs single-flight: one caller takes a short-lived lock and recomputes while the others wait briefly and re-read, or probabilistic early refresh, or serving the stale value while one worker refreshes behind it. The third cause, a cold cache after a restart or a flush, needs warming and no per-key trick helps at all.',
            'Có BA vấn đề khác nhau cùng mang tên "giẫm đạp", và chúng cần ba cách chữa khác nhau. Nhiễu TTL chữa đúng một cái: HẾT HẠN ĐỒNG LOẠT, khi một lần deploy hay một đợt nạp hàng loạt ghi mười nghìn khoá trong cùng một giây với cùng một TTL. Nó chẳng làm được gì cho một khoá nóng đơn lẻ, nơi hai trăm request đơn giản là đang bay giữa đường đúng lúc cái khoá ấy hết hạn, và cả hai trăm đều ngoan ngoãn đi hỏi cơ sở dữ liệu — đúng thứ mà cache-aside bảo chúng làm. Ca đó cần "một chuyến bay": một bên nhận một cái khoá ngắn hạn rồi tính lại trong khi những bên khác chờ một nhịp ngắn rồi đọc lại, hoặc làm mới sớm theo xác suất, hoặc phục vụ giá trị cũ trong lúc một thợ làm mới ở phía sau. Nguyên nhân thứ ba, bộ đệm nguội sau một lần khởi động lại hay một lần xoá sạch, cần hâm nóng trước và không mẹo theo-từng-khoá nào cứu được.',
          ),
        }),

        mcq({
          prompt: B(
            'A single-flight lock is taken with <code>SET lock:k token NX EX 10</code> and released in a <code>finally</code> block with a plain <code>DEL lock:k</code>. The loader occasionally takes twelve seconds. What goes wrong?',
            'Một cái khoá "một chuyến bay" được lấy bằng <code>SET lock:k token NX EX 10</code> và được nhả trong khối <code>finally</code> bằng một lệnh <code>DEL lock:k</code> trơn. Thỉnh thoảng hàm nạp dữ liệu chạy mất mười hai giây. Chuyện gì hỏng?',
          ),
          options: [
            B('<code>DEL</code> on an already-expired key returns an error, which propagates out of the finally block', '<code>DEL</code> trên một khoá đã hết hạn trả về lỗi, và lỗi đó lan ra khỏi khối finally'),
            B('The <code>EX 10</code> is ignored because <code>NX</code> was given, so the lock never expires and deadlocks', '<code>EX 10</code> bị bỏ qua vì đã có <code>NX</code>, nên cái khoá không bao giờ hết hạn và gây kẹt cứng'),
            B('The lock expires mid-work, a second worker acquires it, and the finally deletes the second worker\'s lock', 'Khoá hết hạn giữa chừng, một thợ thứ hai lấy được nó, rồi khối finally xoá mất cái khoá của thợ thứ hai'),
            B('Nothing: <code>SET … NX EX</code> renews itself on every command sent by the connection that holds it', 'Không sao cả: <code>SET … NX EX</code> tự gia hạn theo mỗi lệnh mà kết nối đang giữ nó gửi lên'),
          ],
          correct: 2,
          explanation: EX(
            'Now two workers are inside the critical section and you have a lock that does not lock. The token exists precisely so the release can say "delete this only if it is still mine", and that check-then-delete has to be one atomic step, which means a tiny Lua script: <code>if redis.call(&#39;GET&#39;, KEYS[1]) == ARGV[1] then return redis.call(&#39;DEL&#39;, KEYS[1]) else return 0 end</code>. Two more rules from the same family: the <code>EX</code> is mandatory, because without it a process that dies while holding the lock blocks every future reader forever; and the TTL should be sized from the loader\'s measured p99 with a wide margin, not from its average.',
            'Giờ có HAI thợ cùng nằm trong vùng tới hạn, và bạn đang cầm một cái khoá không khoá được gì. Cái token tồn tại đúng để lệnh nhả có thể nói "chỉ xoá nếu nó vẫn là của tôi", và phép kiểm-rồi-xoá ấy phải là MỘT bước nguyên tử, nghĩa là một script Lua tí hon: <code>if redis.call(&#39;GET&#39;, KEYS[1]) == ARGV[1] then return redis.call(&#39;DEL&#39;, KEYS[1]) else return 0 end</code>. Thêm hai quy tắc cùng họ: <code>EX</code> là bắt buộc, vì thiếu nó thì một tiến trình chết trong lúc đang giữ khoá sẽ chặn mọi người đọc về sau, vĩnh viễn; và TTL phải chọn theo p99 ĐO ĐƯỢC của hàm nạp cộng một biên rộng, chứ không phải theo giá trị trung bình.',
          ),
        }),

        mcq({
          prompt: B(
            'A deploy changed a cached serialisation format and every cached value must become unreachable at once. The instance also holds sessions, rate-limit counters and a job queue. What is the correct move?',
            'Một lần deploy đổi định dạng tuần tự hoá của bộ đệm, và mọi giá trị đã đệm phải trở nên không truy cập được ngay lập tức. Instance đó còn giữ cả phiên đăng nhập, bộ đếm giới hạn tần suất và một hàng đợi việc. Nước đi ĐÚNG là gì?',
          ),
          options: [
            B('<code>FLUSHDB ASYNC</code>, which is safe because the memory is reclaimed on a background thread', '<code>FLUSHDB ASYNC</code>, an toàn vì bộ nhớ được thu hồi ở một luồng nền'),
            B('<code>KEYS &quot;cache:*&quot;</code> piped into <code>DEL</code>, which touches only the cache prefix', '<code>KEYS &quot;cache:*&quot;</code> đưa vào <code>DEL</code>, cách này chỉ đụng tới tiền tố cache'),
            B('Lower <code>maxmemory</code> briefly so the eviction policy discards the cache entries for you', 'Hạ <code>maxmemory</code> xuống một lát để chính sách đẩy khoá tự vứt các mục bộ đệm giúp bạn'),
            B('<code>INCR cache:gen</code>, with the generation number inside every cache key', '<code>INCR cache:gen</code>, với số thế hệ nằm trong mọi khoá bộ đệm'),
          ],
          correct: 3,
          explanation: EX(
            'One <code>INCR</code> makes every existing cached value unreachable in O(1) — no scan, no blocking, and critically without touching the sessions, rate limits and queues that share the instance. The old generation ages out on its own TTL, or you sweep it with <code>SCAN</code> during a quiet hour. Compare with the two commands people actually reach for at 2am: <code>FLUSHDB</code> also logs out every user and empties the queue, and <code>ASYNC</code> only removes the freeze, not the data loss; and <code>KEYS</code> walks the whole keyspace in one uninterruptible operation, which on a large instance is a multi-second outage before the <code>DEL</code> has even started. The same idea at a finer grain gives you per-tenant or per-category invalidation for one command and no bookkeeping.',
            'Một lệnh <code>INCR</code> làm mọi giá trị đã đệm trở nên không với tới được trong O(1) — không quét, không chặn, và quan trọng nhất là không đụng tới phiên đăng nhập, giới hạn tần suất và hàng đợi đang ở chung instance. Thế hệ cũ tự già đi theo TTL của nó, hoặc bạn quét dọn bằng <code>SCAN</code> vào một giờ vắng. So với hai lệnh mà người ta thật sự với tay lấy lúc 2 giờ sáng: <code>FLUSHDB</code> đồng thời đăng xuất mọi người dùng và dọn sạch hàng đợi, còn <code>ASYNC</code> chỉ bỏ được cú đơ chứ không bỏ được chuyện mất dữ liệu; còn <code>KEYS</code> đi bộ khắp không gian khoá trong một thao tác không ngắt được, mà trên một instance lớn thì đó là một sự cố dài vài giây, trước cả khi lệnh <code>DEL</code> kịp bắt đầu. Cùng ý tưởng ấy áp ở mức nhỏ hơn sẽ cho bạn phép vô hiệu hoá theo từng khách thuê hay từng danh mục, chỉ tốn một lệnh và không phải ghi sổ gì.',
          ),
        }),

        mcq({
          prompt: B(
            '<code>INFO stats</code> shows <code>keyspace_hits:8412903</code> and <code>keyspace_misses:391208</code> — a 95.6% hit ratio. The product cache is nevertheless performing badly. What are the two limitations of those numbers?',
            '<code>INFO stats</code> hiện <code>keyspace_hits:8412903</code> và <code>keyspace_misses:391208</code> — tỷ lệ trúng 95,6%. Vậy mà bộ đệm sản phẩm vẫn chạy tệ. Hai hạn chế của cặp số đó là gì?',
          ),
          options: [
            B('They are cumulative since startup and instance-wide, so sessions can hide a product cache at 20%', 'Chúng cộng dồn từ lúc khởi động và tính cho cả instance, nên phiên đăng nhập có thể che một bộ đệm sản phẩm chỉ 20%'),
            B('They count only string commands, and they are reset by every <code>BGSAVE</code>', 'Chúng chỉ đếm các lệnh trên chuỗi, và chúng bị đặt lại sau mỗi lần <code>BGSAVE</code>'),
            B('They exclude keys with a TTL, and they are sampled rather than counted exactly', 'Chúng loại trừ các khoá có TTL, và chúng được lấy mẫu chứ không đếm chính xác'),
            B('They are per-connection, and they are only updated while <code>MONITOR</code> is running', 'Chúng tính theo từng kết nối, và chỉ được cập nhật khi <code>MONITOR</code> đang chạy'),
          ],
          correct: 0,
          explanation: EX(
            'Both counters run since the server started, so one reading is a lifetime average rather than what is happening now — sample twice and subtract. And they cannot distinguish your product cache from your session store from your rate limiter, and sessions almost always hit, so a healthy-looking instance-wide ratio routinely hides one cache that is doing nothing useful. Redis cannot break this down for you; two counters and two histograms tagged by cache name in your own wrapper can. And once you have per-cache numbers, stop optimising the ratio: it has no units and is trivially gameable — lengthen the TTL and it rises along with staleness; stop caching rarely-requested things and it rises because you removed misses. The number that supports a decision is work avoided: hits multiplied by the real cost of a miss.',
            'Cả hai bộ đếm chạy từ lúc máy chủ khởi động, nên một lần đọc là trung bình cả đời chứ không phải chuyện đang xảy ra — hãy lấy mẫu hai lần rồi trừ. Và chúng không phân biệt nổi bộ đệm sản phẩm với kho phiên đăng nhập với bộ giới hạn tần suất, mà phiên đăng nhập thì gần như luôn trúng, nên một tỷ lệ toàn-instance trông khoẻ mạnh thường xuyên che giấu một bộ đệm chẳng làm được việc gì. Redis không bóc tách hộ bạn được; hai bộ đếm và hai biểu đồ phân bố gắn nhãn theo tên bộ đệm trong lớp bọc của chính bạn thì làm được. Và khi đã có số theo từng bộ đệm rồi thì hãy thôi tối ưu cái tỷ lệ: nó không mang đơn vị và cực dễ lách — kéo dài TTL thì nó tăng cùng với độ cũ của dữ liệu; ngừng đệm những thứ ít được hỏi thì nó cũng tăng, vì bạn bỏ đi các lần trượt chứ không thêm lần trúng nào. Con số đỡ được một quyết định là CÔNG SỨC TRÁNH ĐƯỢC: số lần trúng nhân với giá thật của một lần trượt.',
          ),
        }),

        mcq({
          prompt: B(
            'A user edits their bio. The write goes to the primary database, the cache key is deleted correctly, and the very next page load still shows the old bio — for the full TTL. The invalidation code is correct. What is the cause?',
            'Một người dùng sửa tiểu sử của mình. Lượt ghi đi vào cơ sở dữ liệu chính, khoá bộ đệm được xoá đúng cách, vậy mà ngay lần tải trang kế tiếp vẫn hiện tiểu sử cũ — suốt trọn một TTL. Mã vô hiệu hoá bộ đệm không hề sai. Nguyên nhân là gì?',
          ),
          options: [
            B('<code>UNLINK</code> only removes the key from the keyspace after the background thread finishes freeing it', '<code>UNLINK</code> chỉ gỡ khoá khỏi không gian khoá sau khi luồng nền giải phóng xong bộ nhớ'),
            B('The read after the invalidation missed, queried a lagging read replica, and cached the pre-write row', 'Lượt đọc sau khi vô hiệu hoá đã trượt, đi hỏi một replica đọc đang trễ, rồi đệm lại hàng dữ liệu trước khi ghi'),
            B('Deleting a key does not clear the client-side RESP3 tracking cache, which keeps serving the old value', 'Xoá một khoá không dọn được bộ đệm phía client của RESP3, và nó cứ tiếp tục phục vụ giá trị cũ'),
            B('The TTL was refreshed by the delete, so the key was recreated with a full lifetime by the same command', 'TTL được làm mới bởi chính lệnh xoá, nên khoá bị tạo lại với một vòng đời đầy đủ bởi cùng lệnh đó'),
          ],
          correct: 1,
          explanation: EX(
            'Every step behaved correctly and the outcome is wrong for five minutes: write to the primary, delete the key, the next read misses, it queries a replica that is 40 ms behind, it gets the pre-write row, and it caches that. This is the single most common "the cache is broken" report on any system with read replicas, and the invalidation code is never the culprit. Two fixes, both cheap: pin a user\'s reads to the primary for a few seconds after their own write (a short-lived <code>pin:&lt;userId&gt;</code> key is enough), or return replica reads without caching them at all. Note that Redis replicas have the same property, so read-scaling Redis itself reintroduces the problem one layer up.',
            'Mọi bước đều hành xử đúng và kết quả thì sai suốt năm phút: ghi vào máy chính, xoá khoá, lượt đọc kế tiếp trượt, nó hỏi một replica đang chậm 40 ms, nó nhận về hàng dữ liệu TRƯỚC khi ghi, rồi nó đệm đúng cái đó lại. Đây là báo cáo "bộ đệm hỏng rồi" phổ biến số một trên mọi hệ thống có replica đọc, và thủ phạm không bao giờ là mã vô hiệu hoá. Hai cách chữa, đều rẻ: ghim các lượt đọc của một người dùng vào máy chính trong vài giây sau chính lượt ghi của họ (một khoá <code>pin:&lt;userId&gt;</code> sống ngắn là đủ), hoặc trả về dữ liệu đọc từ replica mà tuyệt đối không đệm nó. Lưu ý replica của Redis cũng có đúng tính chất ấy, nên việc nhân bản Redis để chia tải đọc sẽ mang vấn đề này quay lại ở một tầng cao hơn.',
          ),
        }),

        // ── Chương 7 — Tính nguyên tử ───────────────────────────────────
        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, on an empty list, over one connection. What is the reply to <code>EXEC</code>, and how long does it take?' + code(
              '> DEL emptyq\n' +
              '(integer) 0\n' +
              '> MULTI\n' +
              'OK\n' +
              '> BLPOP emptyq 5\n' +
              'QUEUED\n' +
              '> EXEC\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9, trên một list rỗng, qua một kết nối duy nhất. <code>EXEC</code> trả về gì, và mất bao lâu?' + code(
              '> DEL emptyq\n' +
              '(integer) 0\n' +
              '> MULTI\n' +
              'OK\n' +
              '> BLPOP emptyq 5\n' +
              'QUEUED\n' +
              '> EXEC\n' +
              '?',
            ),
          ),
          options: [
            B('An array containing <code>(nil)</code>, returned immediately — blocking commands do not block inside MULTI', 'Một mảng chứa <code>(nil)</code>, trả về ngay lập tức — lệnh chặn không hề chặn khi ở trong MULTI'),
            B('An array containing <code>(nil)</code>, returned after the full five seconds the timeout asked for', 'Một mảng chứa <code>(nil)</code>, trả về sau trọn năm giây đúng như hạn chờ đã yêu cầu'),
            B('<code>(error) ERR BLPOP is not allowed in transactions</code>, returned immediately', '<code>(error) ERR BLPOP is not allowed in transactions</code>, trả về ngay lập tức'),
            B('<code>(nil)</code> — the whole transaction is aborted because one command could not complete', '<code>(nil)</code> — cả giao dịch bị huỷ vì có một lệnh không hoàn tất được'),
          ],
          correct: 0,
          explanation: EX(
            'Verified over a raw socket: <code>EXEC</code> answers <code>*1</code> then <code>*-1</code>, with no wait at all. Inside a transaction the blocking variants behave like their non-blocking counterparts, and the reason is structural rather than a special case: <code>EXEC</code> runs the whole queue as one uninterrupted unit on the single thread, so there is nothing that could push an element while the block is running — waiting would be waiting for something that cannot happen. Take the general lesson too: <code>MULTI</code> buys exactly one thing, which is that no other client\'s command interleaves with your block. It does not buy rollback, and it does not buy the ability to look at a value and branch on it.',
            'Đã kiểm bằng socket trần: <code>EXEC</code> trả về <code>*1</code> rồi <code>*-1</code>, hoàn toàn không chờ giây nào. Bên trong một giao dịch, các biến thể chặn hành xử y như bản không chặn của chúng, và lý do là cấu trúc chứ không phải một ngoại lệ đặc cách: <code>EXEC</code> chạy trọn hàng đợi như một mạch liền không ngắt trên cái luồng duy nhất, nên không có gì có thể đẩy một phần tử vào trong lúc khối đang chạy — chờ ở đây là chờ một điều không thể xảy ra. Hãy lấy luôn bài học chung: <code>MULTI</code> mua về đúng MỘT thứ, là không lệnh nào của client khác chen vào giữa khối của bạn. Nó không mua được phép quay lui, và cũng không mua được khả năng nhìn một giá trị rồi rẽ nhánh theo nó.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9 over one connection. Note that the interfering write comes from the SAME client and writes the SAME value. What does <code>EXEC</code> return?' + code(
              '> SET k same\n' +
              'OK\n' +
              '> WATCH k\n' +
              'OK\n' +
              '> SET k same\n' +
              'OK\n' +
              '> MULTI\n' +
              'OK\n' +
              '> GET k\n' +
              'QUEUED\n' +
              '> EXEC\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9 qua một kết nối duy nhất. Lưu ý lượt ghi gây nhiễu đến từ CHÍNH client đó và ghi ĐÚNG giá trị cũ. <code>EXEC</code> trả về gì?' + code(
              '> SET k same\n' +
              'OK\n' +
              '> WATCH k\n' +
              'OK\n' +
              '> SET k same\n' +
              'OK\n' +
              '> MULTI\n' +
              'OK\n' +
              '> GET k\n' +
              'QUEUED\n' +
              '> EXEC\n' +
              '?',
            ),
          ),
          options: [
            B('An array containing <code>"same"</code> — the value did not change, so nothing invalidated the watch', 'Một mảng chứa <code>"same"</code> — giá trị không đổi nên chẳng có gì làm mất hiệu lực phép canh'),
            B('An array containing <code>"same"</code> — a watch only reacts to writes from OTHER connections', 'Một mảng chứa <code>"same"</code> — phép canh chỉ phản ứng với lượt ghi từ các kết nối KHÁC'),
            B('<code>(nil)</code> — Redis tracks that the key was modified, not whether its value differs', '<code>(nil)</code> — Redis theo dõi việc khoá BỊ SỬA, chứ không theo dõi giá trị có khác đi hay không'),
            B('<code>(error) EXECABORT …</code> — a write to a watched key is a queue-time error', '<code>(error) EXECABORT …</code> — ghi vào một khoá đang được canh là một lỗi ở thời điểm xếp hàng'),
          ],
          correct: 2,
          explanation: EX(
            'A nil reply from <code>EXEC</code> — distinct from an empty array — is the whole feature: one of the keys you were watching was touched, so nothing ran and nothing was written. Note two things this transcript shows. Redis tracks <em>modification</em>, not difference, so even a no-op rewrite aborts, which produces surprising failures when something rewrites a key on a timer. And the interfering write came from the same connection, so this is not "another client interfered" — a watch is armed against the key, full stop. The retry loop that goes with it is: <code>WATCH</code>, read, decide, <code>MULTI</code>, <code>EXEC</code>, and on nil go back to the top and <code>WATCH</code> again, because <code>EXEC</code> and <code>DISCARD</code> always clear every watch.',
            'Phản hồi nil từ <code>EXEC</code> — khác hẳn một mảng rỗng — chính là toàn bộ tính năng: một trong các khoá bạn đang canh đã bị đụng tới, nên không gì chạy và không gì được ghi. Chú ý hai điều transcript này cho thấy. Redis theo dõi việc BỊ SỬA chứ không theo dõi sự khác biệt, nên ngay cả một lượt ghi lại y nguyên cũng huỷ giao dịch, và điều đó gây ra những thất bại rất khó hiểu khi có thứ gì đó ghi lại một cái khoá theo định kỳ. Và lượt ghi gây nhiễu đến từ chính kết nối ấy, nên đây không phải chuyện "client khác chen ngang" — phép canh đặt lên CÁI KHOÁ, chấm hết. Vòng lặp thử lại đi kèm là: <code>WATCH</code>, đọc, quyết định, <code>MULTI</code>, <code>EXEC</code>, và khi gặp nil thì quay lại từ đầu và <code>WATCH</code> LẠI, vì <code>EXEC</code> và <code>DISCARD</code> luôn xoá sạch mọi phép canh.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on Redis 7.4.9 over a raw socket, three runs each, with no other client involved:' + code(
              'A: SET k v PX 250 -> WATCH k -> (wait 1.2s, key expires) -> MULTI -> SET r 1 -> EXEC\n' +
              '   EXEC = (nil)  in all three runs\n' +
              'B: SET k v PX 200 -> (wait 1.2s, key expires) -> WATCH k -> MULTI -> SET r 1 -> EXEC\n' +
              '   EXEC = 1) OK',
            ) + 'What is the correct statement about expiry and WATCH?',
            'Đo thật trên Redis 7.4.9 qua socket trần, mỗi ca ba lượt, không có client nào khác tham gia:' + code(
              'A: SET k v PX 250 -> WATCH k -> (chờ 1,2s, khoá hết hạn) -> MULTI -> SET r 1 -> EXEC\n' +
              '   EXEC = (nil)  ở cả ba lượt\n' +
              'B: SET k v PX 200 -> (chờ 1,2s, khoá hết hạn) -> WATCH k -> MULTI -> SET r 1 -> EXEC\n' +
              '   EXEC = 1) OK',
            ) + 'Phát biểu ĐÚNG về chuyện hết hạn và WATCH là gì?',
          ),
          options: [
            B('A key expiring AFTER you watch it still aborts; only a key already expired BEFORE the WATCH is ignored', 'Khoá hết hạn SAU khi bạn canh nó thì vẫn huỷ giao dịch; chỉ khoá đã hết hạn TRƯỚC lúc WATCH mới được bỏ qua'),
            B('Expiry never aborts a transaction; case A aborted because <code>SET r 1</code> also touches a watched key', 'Hết hạn không bao giờ huỷ giao dịch; ca A huỷ là vì <code>SET r 1</code> cũng đụng vào một khoá đang được canh'),
            B('Expiry always aborts; case B ran because <code>WATCH</code> on a missing key is silently ignored entirely', 'Hết hạn luôn huỷ giao dịch; ca B chạy được là vì <code>WATCH</code> lên một khoá không tồn tại bị bỏ qua hoàn toàn'),
            B('The difference is timing luck: with a longer wait case A would also have run', 'Khác nhau chỉ là may rủi thời điểm: chờ lâu hơn nữa thì ca A cũng sẽ chạy được'),
          ],
          correct: 0,
          explanation: EX(
            'This is worth being precise about, because the shorthand "natural expiry does not abort a WATCH" is repeated widely and is wrong as stated. What Redis 6.0.9 changed is narrow: if the key was <em>already logically expired at the moment you called WATCH</em>, its later removal does not invalidate the watch — otherwise every transaction that watched a TTL\'d key would abort at random. A key that is alive when you watch it and expires afterwards is a modification like any other, and it aborts, reproducibly. The practical consequence: a <code>WATCH</code> retry loop over keys with short TTLs will see aborts that no other client caused, so bound the retries and back off with jitter rather than assuming a nil means someone interfered.',
            'Chỗ này đáng nói cho chính xác, vì câu tóm tắt "hết hạn tự nhiên không huỷ WATCH" được nhắc lại khắp nơi và SAI như cách nó được phát biểu. Thứ mà Redis 6.0.9 sửa hẹp hơn nhiều: nếu cái khoá ĐÃ hết hạn về mặt logic ngay lúc bạn gọi WATCH thì việc nó bị gỡ sau đó không làm mất hiệu lực phép canh — nếu không thì mọi giao dịch canh một khoá có TTL đều sẽ huỷ một cách ngẫu nhiên. Còn một cái khoá đang sống lúc bạn canh rồi hết hạn sau đó thì là một lượt sửa như mọi lượt sửa khác, và nó huỷ giao dịch, lặp lại được. Hệ quả thực dụng: một vòng lặp thử lại bằng <code>WATCH</code> trên các khoá có TTL ngắn sẽ gặp những lần huỷ mà không client nào gây ra cả, nên hãy chặn số lần thử lại và lùi có nhiễu, thay vì đinh ninh rằng một phản hồi nil nghĩa là có ai đó chen ngang.',
          ),
        }),

        mcq({
          prompt: B(
            'A handler calls <code>WATCH balance</code>, reads it, decides the balance is too low, returns early — and does not call <code>UNWATCH</code>. The Redis client uses a connection pool. What is the consequence?',
            'Một hàm xử lý gọi <code>WATCH balance</code>, đọc nó, kết luận số dư quá thấp, trả về sớm — và không gọi <code>UNWATCH</code>. Thư viện Redis đang dùng một connection pool. Hậu quả là gì?',
          ),
          options: [
            B('None: an unused watch is discarded when the handler\'s promise settles and the request finishes', 'Không sao: một phép canh không dùng tới sẽ bị bỏ đi khi promise của hàm xử lý kết thúc và request xong'),
            B('The key is locked until the connection closes, so other clients writing to <code>balance</code> get an error', 'Khoá đó bị khoá lại cho tới khi kết nối đóng, nên client khác ghi vào <code>balance</code> sẽ nhận về lỗi'),
            B('Redis leaks memory proportional to the number of abandoned watches and eventually refuses new ones', 'Redis rò bộ nhớ tỷ lệ với số phép canh bị bỏ rơi và cuối cùng sẽ từ chối nhận thêm phép canh mới'),
            B('The watch survives on that connection, so an unrelated transaction on it later aborts mysteriously', 'Phép canh sống sót trên kết nối đó, nên một giao dịch chẳng liên quan chạy sau trên nó sẽ huỷ một cách khó hiểu'),
          ],
          correct: 3,
          explanation: EX(
            'A watch lives on the <em>connection</em> until <code>EXEC</code>, <code>DISCARD</code> or <code>UNWATCH</code> clears it — it is not per client object and not per request. With a pool, an abandoned watch travels to whoever borrows that connection next, and their completely unrelated transaction returns nil because a key they have never heard of was written by somebody else. That failure is intermittent, depends on which connection served the request, and is close to impossible to reproduce. Two habits remove it: call <code>UNWATCH</code> on every path that decides not to write, and remember that a watch is not a lock — it never blocks anyone, it only makes <em>your</em> <code>EXEC</code> refuse to run.',
            'Một phép canh sống trên KẾT NỐI cho tới khi <code>EXEC</code>, <code>DISCARD</code> hoặc <code>UNWATCH</code> dọn nó đi — nó không thuộc về đối tượng client, cũng không thuộc về một request. Với một pool, phép canh bị bỏ rơi sẽ đi theo kết nối tới tay người mượn tiếp theo, và giao dịch hoàn toàn chẳng liên quan của họ trả về nil vì một cái khoá họ chưa từng nghe tên đã bị người khác ghi vào. Thất bại đó chập chờn, phụ thuộc vào kết nối nào phục vụ request, và gần như không thể tái hiện. Hai thói quen gỡ được nó: gọi <code>UNWATCH</code> trên mọi nhánh quyết định không ghi, và nhớ rằng phép canh KHÔNG phải cái khoá — nó chẳng chặn ai cả, nó chỉ làm cho <code>EXEC</code> CỦA BẠN từ chối chạy.',
          ),
        }),

        mcq({
          prompt: B(
            'A Lua script builds the key it needs from an argument:' + code(
              "redis.call('GET', 'user:' .. ARGV[1])",
            ) + 'It passes review and works perfectly on a single instance. What are the two problems?',
            'Một script Lua tự dựng cái khoá nó cần từ một tham số:' + code(
              "redis.call('GET', 'user:' .. ARGV[1])",
            ) + 'Nó qua review và chạy hoàn hảo trên một instance đơn. Hai vấn đề của nó là gì?',
          ),
          options: [
            B('Concatenation is not supported inside a script, and ARGV values are always numbers, never strings', 'Phép nối chuỗi không được hỗ trợ trong script, và giá trị ARGV luôn là số chứ không bao giờ là chuỗi'),
            B('The script cannot be cached by SHA, and it will be re-parsed on every call at real CPU cost', 'Script này không thể lưu đệm theo SHA, và nó sẽ bị phân tích lại mỗi lần gọi, tốn CPU thật sự'),
            B('Cluster routes the script from its declared KEYS, and building the body from input is injection', 'Cluster định tuyến script theo các KEYS đã khai, và dựng thân script từ đầu vào là một lỗ hổng tiêm mã'),
            B('<code>redis.call</code> may not be used on a key that was not written earlier in the same script', 'Không được dùng <code>redis.call</code> lên một khoá chưa được ghi ở phần trước của cùng script đó'),
          ],
          correct: 2,
          explanation: EX(
            'Declaring every key the script touches in <code>KEYS</code> is not a style rule — it is how Redis decides which node runs the script in Cluster. A key smuggled in through <code>ARGV</code> and used in a <code>redis.call</code> is looked up on whichever node happened to be chosen, so the script works on one instance and breaks silently, in production, months later, on the day you shard. The second half is the closely related rule about the script <em>body</em>: it should be a constant, and everything variable should go through <code>KEYS</code> and <code>ARGV</code>. Building the body by string-concatenating user input is injection in exactly the same shape as SQL injection, with the same consequences.',
            'Khai báo mọi khoá mà script đụng tới vào <code>KEYS</code> không phải quy ước hình thức — đó là cách Redis quyết định nút nào chạy script trong Cluster. Một cái khoá lén đi vào qua <code>ARGV</code> rồi được dùng trong <code>redis.call</code> sẽ bị tra trên bất kỳ nút nào tình cờ được chọn, nên script chạy tốt trên một instance rồi hỏng âm thầm, trên production, nhiều tháng sau, đúng vào ngày bạn chia mảnh. Nửa còn lại là quy tắc anh em rất gần: THÂN script phải là một hằng, và mọi thứ biến thiên phải đi qua <code>KEYS</code> và <code>ARGV</code>. Dựng thân script bằng cách nối chuỗi đầu vào người dùng là tiêm mã, đúng y hình dạng của SQL injection, với hậu quả y như vậy.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. All four lines come from the same server. What single rule explains them?' + code(
              "> EVAL \"return type(ARGV[1])\" 0 5          -> \"string\"\n" +
              "> EVAL \"return tostring('10' < '9')\" 0     -> \"true\"\n" +
              '> EVAL "return 3.7" 0                      -> (integer) 3\n' +
              "> EVAL \"return tostring(3.7)\" 0            -> \"3.7\"",
            ),
            'Chạy thật trên Redis 7.4.9. Cả bốn dòng đều từ cùng một máy chủ. MỘT quy tắc nào giải thích được chúng?' + code(
              "> EVAL \"return type(ARGV[1])\" 0 5          -> \"string\"\n" +
              "> EVAL \"return tostring('10' < '9')\" 0     -> \"true\"\n" +
              '> EVAL "return 3.7" 0                      -> (integer) 3\n' +
              "> EVAL \"return tostring(3.7)\" 0            -> \"3.7\"",
            ),
          ),
          options: [
            B('Lua uses base-36 numerals, so <code>&quot;10&quot;</code> parses as 36 and the comparison is numeric after all', 'Lua dùng hệ cơ số 36, nên <code>&quot;10&quot;</code> đọc ra thành 36 và phép so sánh rốt cuộc vẫn là so sánh số'),
            B('Everything crossing the boundary is a string, and every returned number is truncated to an integer', 'Mọi thứ đi qua ranh giới đều là chuỗi, và mọi con số trả về đều bị cắt cụt thành số nguyên'),
            B('<code>EVAL</code> with <code>0</code> keys runs in a restricted mode where numeric types are unavailable', '<code>EVAL</code> với <code>0</code> khoá chạy ở một chế độ hạn chế, trong đó các kiểu số không dùng được'),
            B('<code>tostring</code> switches the script to RESP3, which is the only protocol carrying real doubles', '<code>tostring</code> chuyển script sang RESP3, giao thức duy nhất chở được số thực đúng nghĩa'),
          ],
          correct: 1,
          explanation: EX(
            '<code>ARGV[1]</code> arrives as <code>"5"</code>, not 5, so you must call <code>tonumber()</code> before comparing or doing arithmetic — and <code>"10" &lt; "9"</code> is <code>true</code> in a string comparison, which is exactly the bug that ships. On the way back, Lua numbers are doubles but the protocol integer type is not, so <code>return 3.7</code> silently becomes 3; any script computing a price, a ratio or an average must <code>return tostring(x)</code> and let the caller parse it. Two more conversions from the same family are worth carrying: <code>false</code> becomes nil and is therefore indistinguishable from "returned nothing" (return 1 and 0 for booleans), and a missing key read with <code>redis.call(&#39;GET&#39;, k)</code> comes back as Lua <code>false</code>, which is why <code>tonumber(redis.call(&#39;GET&#39;, k) or 0)</code> is the idiom.',
            '<code>ARGV[1]</code> tới nơi dưới dạng <code>"5"</code>, không phải 5, nên phải gọi <code>tonumber()</code> trước khi so sánh hay làm số học — và <code>"10" &lt; "9"</code> là <code>true</code> trong phép so chuỗi, đúng cái lỗi vẫn được ship ra production. Ở chiều về, số trong Lua là số thực nhưng kiểu số nguyên của giao thức thì không, nên <code>return 3.7</code> âm thầm thành 3; mọi script tính giá tiền, tỷ lệ hay trung bình đều phải <code>return tostring(x)</code> rồi để bên gọi tự đọc. Thêm hai phép chuyển đổi cùng họ đáng mang theo: <code>false</code> biến thành nil nên không phân biệt được với "không trả về gì" (hãy trả 1 và 0 cho giá trị luận lý), và một khoá không tồn tại đọc bằng <code>redis.call(&#39;GET&#39;, k)</code> quay về thành <code>false</code> của Lua — vì thế mới có thành ngữ <code>tonumber(redis.call(&#39;GET&#39;, k) or 0)</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. A script was loaded and called by SHA, then the cache was flushed.' + code(
              '> SCRIPT LOAD "return redis.call(&#39;GET&#39;, KEYS[1])"\n' +
              '"d3c21d0c2b9ca22f82737626a27bcaf5d288f99f"\n' +
              '> EVALSHA d3c21d... 1 mykey\n' +
              '"myvalue"\n' +
              '> SCRIPT FLUSH\n' +
              'OK\n' +
              '> EVALSHA d3c21d... 1 mykey\n' +
              '(error) NOSCRIPT No matching script. Please use EVAL.',
            ) + 'What does this imply about production, and what removes the problem?',
            'Chạy thật trên Redis 7.4.9. Một script được nạp và gọi theo SHA, rồi vùng đệm script bị xoá.' + code(
              '> SCRIPT LOAD "return redis.call(&#39;GET&#39;, KEYS[1])"\n' +
              '"d3c21d0c2b9ca22f82737626a27bcaf5d288f99f"\n' +
              '> EVALSHA d3c21d... 1 mykey\n' +
              '"myvalue"\n' +
              '> SCRIPT FLUSH\n' +
              'OK\n' +
              '> EVALSHA d3c21d... 1 mykey\n' +
              '(error) NOSCRIPT No matching script. Please use EVAL.',
            ) + 'Điều đó hàm ý gì cho production, và cái gì gỡ được vấn đề?',
          ),
          options: [
            B('The cache is in memory, so a restart or failover empties it — Functions persist in the RDB instead', 'Vùng đệm nằm trong bộ nhớ nên khởi động lại hay chuyển vai là mất sạch — Functions thì nằm trong RDB nên còn'),
            B('The SHA is derived from the dataset, so it changes whenever any key changes — pin it with <code>SCRIPT LOAD</code> per call', 'SHA được suy ra từ dữ liệu nên nó đổi mỗi khi có khoá nào đổi — hãy ghim nó bằng <code>SCRIPT LOAD</code> mỗi lượt gọi'),
            B('<code>EVALSHA</code> is deprecated in Redis 7 and the replacement is <code>EVAL_RO</code> with a body', '<code>EVALSHA</code> đã bị bỏ trong Redis 7 và thứ thay thế là <code>EVAL_RO</code> kèm theo phần thân script'),
            B('Only scripts under 40 bytes are cached; longer ones must be re-sent, which is what happened here', 'Chỉ script dưới 40 byte được đệm; script dài hơn phải gửi lại, và đó là điều đã xảy ra ở đây'),
          ],
          correct: 0,
          explanation: EX(
            'The script cache is memory and is emptied by a restart, a failover or <code>SCRIPT FLUSH</code>, which is why every <code>EVALSHA</code> path needs a <code>NOSCRIPT</code> fallback that re-sends the body with <code>EVAL</code> — good client libraries do this for you, and it is worth confirming that yours does. Redis Functions change the lifecycle: a named library loaded with <code>FUNCTION LOAD</code> lives in the dataset, travels to replicas and survives restarts and failovers, so the application just calls <code>FCALL reserve …</code> with no SHA to manage. The cost is a deploy step you must not forget — including in your restore runbook, since an instance restored from a backup taken before the library existed comes up without it.',
            'Vùng đệm script nằm trong bộ nhớ và bị dọn sạch bởi một lần khởi động lại, một lần chuyển vai, hay lệnh <code>SCRIPT FLUSH</code> — vì thế mọi nhánh dùng <code>EVALSHA</code> đều cần một đường lùi khi gặp <code>NOSCRIPT</code>, gửi lại phần thân bằng <code>EVAL</code>; thư viện client tốt làm hộ bạn, và đáng bỏ công xác nhận thư viện của bạn có làm hay không. Redis Functions đổi hẳn vòng đời: một thư viện có tên nạp bằng <code>FUNCTION LOAD</code> sống trong chính bộ dữ liệu, đi theo sang các replica, sống sót qua khởi động lại và chuyển vai, nên ứng dụng chỉ việc gọi <code>FCALL reserve …</code> mà không phải quản cái SHA nào. Cái giá là một bước deploy bạn không được quên — kể cả trong quy trình khôi phục, vì một instance phục hồi từ bản sao lưu chụp trước khi thư viện tồn tại sẽ lên mà không có nó.',
          ),
        }),

        mcq({
          prompt: B(
            'A worker holds <code>SET lock:x tokenA NX PX 10000</code>, then suffers a twelve-second stop-the-world pause. Which conclusion is correct?',
            'Một worker đang giữ <code>SET lock:x tokenA NX PX 10000</code> thì dính một cú dừng toàn cục mười hai giây. Kết luận nào ĐÚNG?',
          ),
          options: [
            B('Raising the TTL to 60 seconds removes the problem, because no realistic pause exceeds a minute', 'Nâng TTL lên 60 giây là hết vấn đề, vì không có cú dừng thực tế nào vượt quá một phút'),
            B('A TTL-based lock is a lease; get correctness from fencing tokens, unique constraints or idempotency', 'Khoá dựa trên TTL chỉ là một hợp đồng thuê; hãy lấy tính đúng đắn từ thẻ rào, ràng buộc duy nhất hoặc tính lũy đẳng'),
            B('Redlock across five independent masters closes this hole, which is what the algorithm was designed for', 'Redlock trên năm máy chính độc lập bịt được lỗ hổng này, đó chính là thứ thuật toán ấy được thiết kế để làm'),
            B('The pause is harmless because Redis refuses any command from a connection that was idle for that long', 'Cú dừng đó vô hại vì Redis từ chối mọi lệnh đến từ một kết nối đã rảnh lâu như thế'),
          ],
          correct: 1,
          explanation: EX(
            'A lock with a timeout assumes the holder notices time passing, and a process paused by a stop-the-world collection, a suspended VM, a container throttled to zero CPU or a machine that swapped notices nothing at all — it wakes up believing it still holds a lock that expired seconds ago. No TTL and no configuration prevents that, and Redlock does not either: it fixes a different hole (losing the lock when a single instance restarts or fails over), while still handing out a lease bounded by wall-clock time. The real fix lives in the protected resource: a monotonic fencing token beside the lock plus a <code>WHERE fence &lt; ?</code> on the write, a unique constraint, or an idempotency key. Then the lock goes back to what it is genuinely good at — stopping two workers from doing the same expensive job — and correctness no longer depends on anyone noticing time pass.',
            'Một cái khoá có hạn giờ giả định rằng người giữ nó nhận ra thời gian đang trôi, còn một tiến trình bị dừng bởi một đợt thu gom rác toàn cục, một máy ảo bị treo, một container bị bóp xuống không CPU, hay một máy phải tráo bộ nhớ ra đĩa thì chẳng nhận ra gì cả — nó tỉnh dậy và tin rằng mình vẫn giữ một cái khoá đã hết hạn từ mấy giây trước. Không TTL nào và không cấu hình nào ngăn được, và Redlock cũng không: nó bịt một lỗ khác (mất khoá khi một instance đơn khởi động lại hoặc chuyển vai), trong khi vẫn phát ra một hợp đồng thuê bị chặn bởi đồng hồ treo tường. Cách chữa thật nằm ở TÀI NGUYÊN ĐƯỢC BẢO VỆ: một thẻ rào tăng đơn điệu đặt cạnh cái khoá cộng với một mệnh đề <code>WHERE fence &lt; ?</code> lúc ghi, hoặc một ràng buộc duy nhất, hoặc một khoá lũy đẳng. Khi đó cái khoá quay về đúng việc nó giỏi — ngăn hai thợ cùng làm một việc đắt đỏ — và tính đúng đắn không còn phụ thuộc vào chuyện có ai nhận ra thời gian trôi hay không.',
          ),
        }),

        // ── Chương 8 — Pub/Sub và Stream ────────────────────────────────
        mcq({
          prompt: B(
            'A team builds a job queue on Pub/Sub: the API publishes a job, three worker processes subscribe. Which set of failures does that design have?',
            'Một nhóm dựng hàng đợi việc trên Pub/Sub: API phát một việc, ba tiến trình worker đăng ký nghe. Thiết kế đó mắc tập lỗi nào?',
          ),
          options: [
            B('Only ordering: messages can arrive out of order across workers, but every job still runs exactly once', 'Chỉ sai thứ tự: thông điệp có thể tới không đúng thứ tự giữa các worker, nhưng mỗi việc vẫn chạy đúng một lần'),
            B('Every worker runs every job, a deploying worker misses jobs permanently, and there is no ack or backlog', 'Mọi worker chạy mọi việc, worker đang deploy mất luôn việc, và không có xác nhận cũng không có tồn đọng'),
            B('Only capacity: Pub/Sub buffers up to 32 MB per subscriber, so it works until that buffer overflows', 'Chỉ là sức chứa: Pub/Sub đệm tới 32 MB cho mỗi bên đăng ký, nên nó chạy được cho tới khi bộ đệm ấy tràn'),
            B('Only durability: jobs are lost on a restart of Redis, but survive a restart of any single worker', 'Chỉ là độ bền: việc bị mất khi Redis khởi động lại, nhưng vẫn sống sót khi một worker bất kỳ khởi động lại'),
          ],
          correct: 1,
          explanation: EX(
            'There is no competing-consumer semantics anywhere in Pub/Sub: every subscriber receives every message, so three workers means the job runs three times. Nothing is stored, so a worker that is deploying, restarting or briefly disconnected loses the jobs published during that window, permanently and silently — and <code>PUBLISH</code> returning a subscriber count is the only feedback the protocol gives you, so a return of 0 means the message is simply gone. There is no acknowledgement, so nothing detects a worker that received a job and crashed before finishing it, and there is no backlog: if publishing outpaces consumption the messages are dropped when the output buffer limit is reached (default 32mb hard, 8mb soft for 60s). Streams give you competing consumers, acknowledgement, a pending list and replay, natively.',
            'Trong Pub/Sub không hề có ngữ nghĩa "nhiều bên tranh nhau tiêu thụ": mọi bên đăng ký đều nhận mọi thông điệp, nên ba worker nghĩa là việc chạy ba lần. Không gì được lưu, nên một worker đang deploy, đang khởi động lại hay mất kết nối một thoáng sẽ mất luôn những việc phát ra trong cửa sổ đó, vĩnh viễn và im lặng — và số bên đăng ký mà <code>PUBLISH</code> trả về là phản hồi DUY NHẤT giao thức cho bạn, nên trả về 0 nghĩa là thông điệp đơn giản đã mất. Không có xác nhận, nên chẳng gì phát hiện được một worker đã nhận việc rồi chết trước khi làm xong; và không có tồn đọng: nếu phát nhanh hơn tiêu thụ thì thông điệp bị vứt khi chạm trần bộ đệm ra (mặc định cứng 32mb, mềm 8mb trong 60 giây). Stream cho bạn nhiều bên tranh tiêu thụ, xác nhận, danh sách chờ xử lý và phát lại, một cách tự nhiên.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9 over one raw connection. Explain the four replies.' + code(
              '> SUBSCRIBE ch      -> 1) "subscribe" 2) "ch" 3) (integer) 1\n' +
              '> GET somekey       -> (error) ERR Can&#39;t execute &#39;get&#39;: only …\n' +
              '> PING              -> 1) "pong" 2) ""\n' +
              '> UNSUBSCRIBE ch    -> 1) "unsubscribe" 2) "ch" 3) (integer) 0\n' +
              '> GET somekey       -> (nil)',
            ),
            'Chạy thật trên Redis 7.4.9 qua một kết nối trần duy nhất. Hãy giải thích bốn dòng trả lời.' + code(
              '> SUBSCRIBE ch      -> 1) "subscribe" 2) "ch" 3) (integer) 1\n' +
              '> GET somekey       -> (error) ERR Can&#39;t execute &#39;get&#39;: only …\n' +
              '> PING              -> 1) "pong" 2) ""\n' +
              '> UNSUBSCRIBE ch    -> 1) "unsubscribe" 2) "ch" 3) (integer) 0\n' +
              '> GET somekey       -> (nil)',
            ),
          ),
          options: [
            B('Subscribing puts the whole client into a read-only mode; <code>PING</code> is exempt because it reads nothing', 'Đăng ký kênh đẩy cả client vào chế độ chỉ-đọc; <code>PING</code> được miễn vì nó không đọc gì cả'),
            B('On RESP2 a subscribed CONNECTION accepts only the subscribe family plus PING, QUIT and RESET', 'Trên RESP2, một KẾT NỐI đã đăng ký chỉ nhận nhóm lệnh subscribe cộng PING, QUIT và RESET'),
            B('Channels are keys, so <code>GET somekey</code> collides with the subscription until it is released', 'Kênh cũng là khoá, nên <code>GET somekey</code> va chạm với phép đăng ký cho tới khi nó được nhả ra'),
            B('The error is a rate limit: a connection may not mix Pub/Sub and data commands within one second', 'Lỗi đó là một giới hạn tần suất: một kết nối không được trộn Pub/Sub với lệnh dữ liệu trong vòng một giây'),
          ],
          correct: 1,
          explanation: EX(
            'The restriction is on the connection, not the client object, and it lifts the moment the subscription count reaches zero — which is exactly what the last two lines show. This is the number-one Pub/Sub bug: call <code>subscribe()</code> on the client you also use for data, and every <code>GET</code> elsewhere in the process starts throwing, usually in a completely unrelated request handler and usually only under a code path you exercise later. The fix is one line, <code>const sub = redis.duplicate()</code>, and the diagnostic is <code>CLIENT LIST</code> filtered for <code>sub=1</code>. RESP3 lifts the restriction because push messages are a distinct protocol type there, but do not rely on that unless you have explicitly enabled RESP3 and checked your client supports it.',
            'Hạn chế nằm ở KẾT NỐI chứ không phải ở đối tượng client, và nó được gỡ ngay khi số kênh đăng ký về không — đúng điều hai dòng cuối cho thấy. Đây là lỗi Pub/Sub số một: gọi <code>subscribe()</code> lên chính client bạn cũng dùng cho dữ liệu, và mọi lệnh <code>GET</code> ở chỗ khác trong tiến trình bắt đầu ném lỗi, thường là trong một hàm xử lý chẳng liên quan gì và thường chỉ ở một nhánh mã bạn chạy tới sau. Cách chữa gói trong một dòng, <code>const sub = redis.duplicate()</code>, và cách chẩn là <code>CLIENT LIST</code> lọc theo <code>sub=1</code>. RESP3 gỡ bỏ hạn chế này vì ở đó thông điệp đẩy là một kiểu giao thức riêng, nhưng đừng dựa vào điều đó trừ khi bạn đã bật RESP3 tường minh và đã kiểm tra client có hỗ trợ.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. <code>s2</code> is empty at the start. Fill in the four missing replies.' + code(
              '> XADD s2 100-1 a 1\n' +
              '?\n' +
              '> XADD s2 100-1 a 2\n' +
              '?\n' +
              '> XADD s2 "100-*" a 3\n' +
              '?\n' +
              '> XADD s2 99-9 a 4\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9. Ban đầu <code>s2</code> rỗng. Điền bốn dòng trả lời còn thiếu.' + code(
              '> XADD s2 100-1 a 1\n' +
              '?\n' +
              '> XADD s2 100-1 a 2\n' +
              '?\n' +
              '> XADD s2 "100-*" a 3\n' +
              '?\n' +
              '> XADD s2 99-9 a 4\n' +
              '?',
            ),
          ),
          options: [
            B('<code>"100-1"</code>, an error, <code>"100-2"</code>, an error — an explicit ID must exceed the top item', '<code>"100-1"</code>, một lỗi, <code>"100-2"</code>, một lỗi — ID tường minh phải lớn hơn mục trên cùng'),
            B('<code>"100-1"</code>, <code>"100-2"</code>, <code>"100-3"</code>, <code>"99-9"</code> — Redis re-sorts the log on read', '<code>"100-1"</code>, <code>"100-2"</code>, <code>"100-3"</code>, <code>"99-9"</code> — Redis sắp xếp lại nhật ký lúc đọc'),
            B('<code>"100-1"</code>, <code>"100-1"</code>, <code>"100-1"</code>, <code>"99-9"</code> — duplicate IDs simply overwrite', '<code>"100-1"</code>, <code>"100-1"</code>, <code>"100-1"</code>, <code>"99-9"</code> — ID trùng thì đơn giản là ghi đè'),
            B('An error on all four, because an explicit ID is only legal with <code>NOMKSTREAM</code>', 'Cả bốn dòng đều lỗi, vì ID tường minh chỉ hợp lệ khi đi kèm <code>NOMKSTREAM</code>'),
          ],
          correct: 0,
          explanation: EX(
            'A stream ID is <code>milliseconds-sequence</code> and it must be <b>strictly increasing</b>: reusing <code>100-1</code> and going backwards to <code>99-9</code> both fail with <code>ERR The ID specified in XADD is equal or smaller than the target stream top item</code>. The middle case is the useful one: <code>100-*</code> keeps the millisecond you chose and lets Redis pick the next sequence number, so it produced <code>100-2</code>. In live traffic you always pass <code>*</code> and let the server generate both halves; explicit IDs are for importing existing data with known timestamps. That strictly-increasing property is what makes "everything after ID X" a cheap, meaningful query, and it is the reason a restarted consumer can resume instead of losing a window.',
            'ID của stream là <code>mili giây-số thứ tự</code> và nó phải TĂNG NGHIÊM NGẶT: dùng lại <code>100-1</code> hay lùi về <code>99-9</code> đều hỏng với lỗi <code>ERR The ID specified in XADD is equal or smaller than the target stream top item</code>. Ca ở giữa mới là ca hữu ích: <code>100-*</code> giữ nguyên phần mili giây bạn chọn và để Redis chọn số thứ tự kế tiếp, nên nó cho ra <code>100-2</code>. Với lưu lượng thật thì luôn truyền <code>*</code> và để máy chủ sinh cả hai nửa; ID tường minh dành cho việc nhập dữ liệu cũ đã có dấu thời gian. Chính tính tăng nghiêm ngặt ấy làm cho câu hỏi "mọi thứ sau ID X" trở thành một truy vấn rẻ và có nghĩa, và đó là lý do một consumer khởi động lại có thể đi tiếp thay vì mất một khoảng.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. Three entries exist and the group starts empty. Explain the third reply.' + code(
              "> XREADGROUP GROUP billing w1 COUNT 2 STREAMS orders '>'\n" +
              '   → entries 1 and 2\n' +
              "> XREADGROUP GROUP billing w2 COUNT 2 STREAMS orders '>'\n" +
              '   → entry 3\n' +
              "> XREADGROUP GROUP billing w2 COUNT 2 STREAMS orders '>'\n" +
              '   → ?',
            ),
            'Chạy thật trên Redis 7.4.9. Có ba mục và nhóm bắt đầu từ rỗng. Hãy giải thích dòng trả lời thứ ba.' + code(
              "> XREADGROUP GROUP billing w1 COUNT 2 STREAMS orders '>'\n" +
              '   → mục 1 và 2\n' +
              "> XREADGROUP GROUP billing w2 COUNT 2 STREAMS orders '>'\n" +
              '   → mục 3\n' +
              "> XREADGROUP GROUP billing w2 COUNT 2 STREAMS orders '>'\n" +
              '   → ?',
            ),
          ),
          options: [
            B('Entry 3 again, because it is still unacknowledged and <code>&gt;</code> re-delivers pending entries', 'Lại mục 3, vì nó chưa được xác nhận và <code>&gt;</code> giao lại các mục đang chờ xử lý'),
            B('Entries 1 and 2, because a group hands every entry to every one of its consumers in turn', 'Mục 1 và 2, vì một nhóm lần lượt trao mọi mục cho từng consumer của nó'),
            B('<code>(nil)</code> — <code>&gt;</code> means "entries never delivered to anyone", and there are none left', '<code>(nil)</code> — <code>&gt;</code> nghĩa là "các mục chưa từng giao cho ai", và chẳng còn mục nào'),
            B('An error, because a consumer may not call <code>XREADGROUP</code> twice before acknowledging', 'Một lỗi, vì một consumer không được gọi <code>XREADGROUP</code> hai lần trước khi xác nhận'),
          ],
          correct: 2,
          explanation: EX(
            'Within a group, entries are <b>split</b> between consumers, not copied — that is what makes it a work queue. <code>&gt;</code> means "entries never delivered to anyone", so once all three have been handed out there is nothing left to give and the reply is nil. Two related facts from the same session: <code>XGROUP CREATE</code> on an existing group returns <code>BUSYGROUP Consumer Group name already exists</code>, which is the error your startup code should swallow; and an <b>explicit</b> ID instead of <code>&gt;</code> — normally <code>0</code> — re-reads this consumer\'s own still-pending entries, which is the recovery path a worker should run once on startup before it starts looping on <code>&gt;</code>. Separate groups on the same stream each get everything: split within a group, fan out across groups.',
            'Bên trong một nhóm, các mục được CHIA giữa các consumer chứ không nhân bản — chính điều đó biến nó thành một hàng đợi việc. <code>&gt;</code> nghĩa là "các mục chưa từng giao cho ai", nên khi cả ba đã được phát đi rồi thì không còn gì để trao và phản hồi là nil. Hai sự thật liên quan từ cùng phiên đo: <code>XGROUP CREATE</code> trên một nhóm đã tồn tại trả về <code>BUSYGROUP Consumer Group name already exists</code>, đúng cái lỗi mà mã khởi động của bạn nên nuốt đi; và một ID TƯỜNG MINH thay cho <code>&gt;</code> — thường là <code>0</code> — sẽ đọc lại các mục còn chờ xử lý CỦA CHÍNH consumer đó, đó là đường phục hồi mà một worker nên chạy một lần lúc khởi động, trước khi bước vào vòng lặp trên <code>&gt;</code>. Các nhóm khác nhau trên cùng một stream thì mỗi nhóm nhận đủ mọi mục: chia bên trong nhóm, toả ra giữa các nhóm.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on Redis 7.4.9, on a stream of 100,000 entries. 2,000 entries were removed with <code>XDEL</code>.' + code(
              'before  XLEN 100000   MEMORY USAGE 2926899\n' +
              'after   XLEN  98000   MEMORY USAGE 2969004',
            ) + 'Memory did not fall — it rose. Why, and what should be used instead?',
            'Đo thật trên Redis 7.4.9, trên một stream 100.000 mục. Xoá 2.000 mục bằng <code>XDEL</code>.' + code(
              'trước  XLEN 100000   MEMORY USAGE 2926899\n' +
              'sau    XLEN  98000   MEMORY USAGE 2969004',
            ) + 'Bộ nhớ không giảm — nó còn tăng. Vì sao, và nên dùng gì thay thế?',
          ),
          options: [
            B('<code>XDEL</code> moved the entries into the consumer group\'s pending list, which is counted separately', '<code>XDEL</code> đã chuyển các mục vào danh sách chờ xử lý của nhóm consumer, và chỗ đó được tính riêng'),
            B('The measurement is sampled; add <code>SAMPLES 0</code> and the memory will show the expected drop', 'Phép đo được lấy mẫu; thêm <code>SAMPLES 0</code> là bộ nhớ sẽ hiện đúng mức giảm như kỳ vọng'),
            B('Memory is freed asynchronously by the lazy-free thread; it drops a few seconds after the command', 'Bộ nhớ được luồng lazy-free giải phóng bất đồng bộ; nó sẽ tụt xuống vài giây sau khi lệnh chạy'),
            B('<code>XDEL</code> tombstones an entry inside a packed node; bound the stream with <code>MAXLEN</code> or <code>MINID</code> on every <code>XADD</code>', '<code>XDEL</code> chỉ đánh dấu mộ cho mục nằm trong một nút đã đóng gói; hãy chặn trần bằng <code>MAXLEN</code> hoặc <code>MINID</code> ngay trên mỗi <code>XADD</code>'),
          ],
          correct: 3,
          explanation: EX(
            'A stream is a radix tree of macro nodes, each packing many entries into one contiguous block — which is why 100,000 entries fit in about 2.9 MB. <code>XDEL</code> cannot rewrite the middle of a packed node, so it marks the entry deleted and leaves the bytes in place; the tombstone itself costs a little, which is why the measured total went <em>up</em>. Memory returns only when every entry in a node is gone and the whole node is freed. So a delete-as-you-go pattern produces a stream whose <code>XLEN</code> falls steadily while <code>MEMORY USAGE</code> does not move — exactly the shape of an incident where a queue looks empty and the instance is still at 90% memory. Trim from the head with <code>MAXLEN</code> or <code>MINID</code> on every <code>XADD</code>, and keep <code>XDEL</code> for the rare case of erasing one specific entry.',
            'Một stream là cây radix gồm các nút lớn, mỗi nút đóng gói nhiều mục vào một khối liền mạch — vì thế 100.000 mục mới lọt trong khoảng 2,9 MB. <code>XDEL</code> không viết lại được phần giữa của một nút đã đóng gói, nên nó đánh dấu mục ấy là đã xoá và để nguyên các byte tại chỗ; bản thân cái dấu mộ cũng tốn một chút, và đó là lý do tổng số đo được lại TĂNG. Bộ nhớ chỉ quay về khi mọi mục trong một nút đều biến mất và cả nút được giải phóng. Nên kiểu "xoá dần khi đi" tạo ra một stream mà <code>XLEN</code> tụt đều trong khi <code>MEMORY USAGE</code> đứng yên — đúng hình dạng của một sự cố mà hàng đợi trông thì rỗng còn instance vẫn ở 90% bộ nhớ. Hãy cắt từ đầu bằng <code>MAXLEN</code> hoặc <code>MINID</code> ngay trên mỗi <code>XADD</code>, và để dành <code>XDEL</code> cho ca hiếm là phải xoá đúng một mục cụ thể.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on Redis 7.4.9, on a stream of 100,000 entries with <code>stream-node-max-entries</code> at its default of 100:' + code(
              'XTRIM s MAXLEN ~ 1000        -> removed 10000, XLEN now 90000\n' +
              'XTRIM s MAXLEN ~ 1000        -> removed 10000, XLEN now 80000\n' +
              '… five calls later                            XLEN now 48000\n' +
              'XTRIM s MAXLEN 1000          -> removed 47000, XLEN now  1000',
            ) + 'Why did the approximate form leave 48,000 entries?',
            'Đo thật trên Redis 7.4.9, trên một stream 100.000 mục với <code>stream-node-max-entries</code> ở mặc định 100:' + code(
              'XTRIM s MAXLEN ~ 1000        -> xoá 10000, XLEN còn 90000\n' +
              'XTRIM s MAXLEN ~ 1000        -> xoá 10000, XLEN còn 80000\n' +
              '… năm lượt sau                            XLEN còn 48000\n' +
              'XTRIM s MAXLEN 1000          -> xoá 47000, XLEN còn  1000',
            ) + 'Vì sao dạng xấp xỉ lại để lại 48.000 mục?',
          ),
          options: [
            B('The tilde makes <code>MAXLEN</code> a lower bound, so Redis keeps at least ten times the number you asked for', 'Dấu ngã biến <code>MAXLEN</code> thành cận DƯỚI, nên Redis giữ lại ít nhất gấp mười lần con số bạn xin'),
            B('Approximate trimming skips any node holding an entry that is still in a consumer group pending list', 'Cắt xấp xỉ bỏ qua mọi nút còn chứa một mục đang nằm trong danh sách chờ xử lý của một nhóm consumer'),
            B('With <code>~</code> and no <code>LIMIT</code>, Redis caps the work per call at 100 × <code>stream-node-max-entries</code>', 'Có <code>~</code> mà không ghi <code>LIMIT</code> thì Redis chặn khối lượng việc mỗi lượt ở 100 × <code>stream-node-max-entries</code>'),
            B('<code>~</code> only trims entries older than the oldest unacknowledged one, which had not moved here', '<code>~</code> chỉ cắt các mục cũ hơn mục chưa xác nhận cũ nhất, mà mục đó ở đây thì không hề nhích'),
          ],
          correct: 2,
          explanation: EX(
            '<code>~</code> tells Redis to trim to a whole radix-node boundary so it removes a batch cheaply instead of walking to an exact count — but on top of that, an implicit <code>LIMIT</code> of 100 × <code>stream-node-max-entries</code> caps how much one call may remove, which is exactly the 10,000 measured here. That is a deliberate latency guard, and it means "approximately 1000" can mean 90,000 on a stream that got far over its bound. Two consequences worth carrying: trim on every <code>XADD</code> (<code>XADD s MAXLEN ~ 10000 * …</code>) so the bound is applied continuously and each call removes almost nothing, and if you must shrink a stream that already got out of hand, either loop the approximate form or pass <code>LIMIT 0</code> to lift the cap — verified here to cut 29,000 entries in one call. The exact form has no cap and is O(N), so it is a blocking operation on a stream far over the limit.',
            '<code>~</code> bảo Redis cắt tới ranh giới của cả một nút radix, để nó gỡ một lô cho rẻ thay vì đi bộ tới đúng con số — nhưng chồng lên đó còn một <code>LIMIT</code> NGẦM bằng 100 × <code>stream-node-max-entries</code> chặn khối lượng việc mỗi lượt gọi, đúng bằng con số 10.000 đo được ở đây. Đó là một chốt chặn độ trễ có chủ đích, và nó nghĩa là "khoảng 1000" có thể là 90.000 trên một stream đã vượt trần từ lâu. Hai hệ quả đáng mang theo: hãy cắt ngay trên mỗi <code>XADD</code> (<code>XADD s MAXLEN ~ 10000 * …</code>) để cái trần được áp liên tục và mỗi lượt gọi gần như không phải gỡ gì; còn nếu buộc phải thu nhỏ một stream đã vượt quá xa thì hoặc lặp lại dạng xấp xỉ, hoặc truyền <code>LIMIT 0</code> để bỏ trần — đã kiểm ở đây, nó cắt 29.000 mục trong một lượt. Dạng chính xác thì không có trần và là O(N), nên nó là một thao tác chặn máy chủ trên một stream vượt trần nhiều.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, on one entry pending with <code>worker-3</code>. Explain the delivery counter (the fourth column).' + code(
              'XPENDING q g - + 10          -> id  worker-3  2112ms  1\n' +
              'XAUTOCLAIM q g w1 1000 0     -> claimed the entry\n' +
              'XPENDING q g - + 10          -> id  w1        83ms    2\n' +
              'XCLAIM q g w2 0 <id> JUSTID  -> id\n' +
              'XPENDING q g - + 10          -> id  w2        73ms    2',
            ),
            'Chạy thật trên Redis 7.4.9, với một mục đang chờ xử lý ở <code>worker-3</code>. Hãy giải thích bộ đếm lượt giao (cột thứ tư).' + code(
              'XPENDING q g - + 10          -> id  worker-3  2112ms  1\n' +
              'XAUTOCLAIM q g w1 1000 0     -> đã giành được mục\n' +
              'XPENDING q g - + 10          -> id  w1        83ms    2\n' +
              'XCLAIM q g w2 0 <id> JUSTID  -> id\n' +
              'XPENDING q g - + 10          -> id  w2        73ms    2',
            ),
          ),
          options: [
            B('The counter only counts acknowledgements, so it stayed at 2 because neither claim acknowledged anything', 'Bộ đếm chỉ đếm số lần xác nhận, nên nó đứng ở 2 vì không lần giành nào có xác nhận cả'),
            B('The counter is the number of distinct consumers that have owned the entry, which was 2 from the start', 'Bộ đếm là số consumer khác nhau đã từng sở hữu mục đó, và con số ấy vốn đã là 2 ngay từ đầu'),
            B('The counter is reset by every claim; the 2 is a coincidence of the idle time crossing one second', 'Bộ đếm bị đặt lại sau mỗi lần giành; con số 2 chỉ là trùng hợp khi thời gian rảnh vượt qua một giây'),
            B('A claim that hands you the payload bumps the counter; <code>JUSTID</code> changes the owner without bumping it', 'Lần giành có trao lại nội dung thì tăng bộ đếm; <code>JUSTID</code> đổi chủ sở hữu mà không tăng nó'),
          ],
          correct: 3,
          explanation: EX(
            'The fourth column of an <code>XPENDING</code> row is how many times the entry has been handed to a consumer, and it is the only thing that distinguishes a transient failure from a poison entry whose handler always throws. <code>JUSTID</code> claims ownership without returning the payload and without incrementing the counter, which is what you want when a supervisor is reassigning work rather than processing it — but it also means an entry repeatedly claimed that way never trips a max-retries check. Note the third column too: idle time is measured since delivery, not since the worker was last alive, so a consumer happily processing a slow job looks identical to one that died. That is why <code>min-idle-time</code> must exceed your slowest legitimate handler by a wide margin, and why genuinely long jobs should heartbeat with <code>XCLAIM … JUSTID</code> on their own entry.',
            'Cột thứ tư của một dòng <code>XPENDING</code> là số lần mục ấy đã được trao cho một consumer, và nó là thứ DUY NHẤT phân biệt một thất bại nhất thời với một mục độc mà hàm xử lý luôn ném lỗi. <code>JUSTID</code> giành quyền sở hữu mà không trả về nội dung và không tăng bộ đếm, đúng thứ bạn muốn khi một tiến trình giám sát đang phân công lại việc chứ không phải đang xử lý — nhưng nó cũng nghĩa là một mục cứ bị giành theo kiểu ấy sẽ không bao giờ chạm ngưỡng số lần thử lại tối đa. Chú ý cả cột thứ ba: thời gian rảnh được tính từ lúc GIAO, không phải từ lúc worker còn sống lần cuối, nên một consumer đang vui vẻ xử lý một việc chậm trông y hệt một consumer đã chết. Vì thế <code>min-idle-time</code> phải vượt xa hàm xử lý chậm nhất của bạn, và những việc thật sự dài phải tự đập nhịp tim bằng <code>XCLAIM … JUSTID</code> lên chính mục của nó.',
          ),
        }),

        mcq({
          prompt: B(
            'A team wants seven days of order events in a Redis stream. A measurement shows the stream costs about 87 bytes per entry, and the service produces 5,000 events a second. What should they conclude?',
            'Một nhóm muốn giữ bảy ngày sự kiện đơn hàng trong một Redis stream. Phép đo cho thấy stream tốn khoảng 87 byte mỗi mục, và dịch vụ sinh ra 5.000 sự kiện mỗi giây. Họ nên kết luận gì?',
          ),
          options: [
            B('Enable AOF with <code>appendfsync always</code>, which lets the stream spill to disk and removes the RAM limit', 'Bật AOF với <code>appendfsync always</code>, cách đó cho stream tràn xuống đĩa và gỡ bỏ giới hạn RAM'),
            B('Seven days is roughly 260 GB of RAM — keep a short retention in Redis and archive older entries elsewhere', 'Bảy ngày là khoảng 260 GB RAM — hãy giữ thời hạn ngắn trong Redis và lưu trữ các mục cũ ở nơi khác'),
            B('Set <code>maxmemory-policy allkeys-lru</code> so Redis evicts the oldest stream entries automatically', 'Đặt <code>maxmemory-policy allkeys-lru</code> để Redis tự đẩy các mục stream cũ nhất ra ngoài'),
            B('Use <code>XDEL</code> on a nightly cron, which keeps the working set small enough to fit in a few gigabytes', 'Dùng <code>XDEL</code> trong một cron chạy đêm, cách đó giữ tập làm việc đủ nhỏ để vừa vài gigabyte'),
          ],
          correct: 1,
          explanation: EX(
            '5000 × 86400 × 7 × 87 bytes ≈ 260 GB. A stream lives in RAM, so retention is bounded by what you are willing to pay for, and that one calculation — with <em>your</em> measured entry size, from <code>MEMORY USAGE</code> divided by <code>XLEN</code> — is the input that reliably decides Redis Streams versus Kafka, and the one people skip. The middle option is usually the right one: keep an hour or a day live in Redis for consumption and run one extra consumer whose only job is to batch older entries out to object storage or a warehouse. Note why the other answers are traps: eviction does not know a stream is a queue, so <code>allkeys-lru</code> can delete the whole key; AOF is a durability setting and does not move data off the heap; and <code>XDEL</code> gives no memory back at all.',
            '5000 × 86400 × 7 × 87 byte ≈ 260 GB. Một stream sống trong RAM, nên thời hạn lưu bị chặn bởi số tiền bạn chịu trả, và đúng một phép tính ấy — với kích thước mục ĐO ĐƯỢC CỦA BẠN, lấy <code>MEMORY USAGE</code> chia <code>XLEN</code> — mới là đầu vào quyết định đáng tin giữa Redis Streams và Kafka, và là thứ người ta hay bỏ qua. Phương án ở giữa thường là phương án đúng: giữ một giờ hoặc một ngày sống trong Redis để tiêu thụ, rồi chạy thêm một consumer mà việc duy nhất của nó là gom các mục cũ hơn đẩy ra kho đối tượng hoặc kho dữ liệu. Chú ý vì sao các đáp án kia là bẫy: cơ chế đẩy khoá không biết một stream là hàng đợi, nên <code>allkeys-lru</code> có thể xoá nguyên cái khoá; AOF là thiết lập độ bền chứ không chuyển dữ liệu ra khỏi bộ nhớ; còn <code>XDEL</code> thì không trả lại chút bộ nhớ nào.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — The four things the five-line cache-aside is missing (chapter 6).</b> No Redis server is involved: the starter gives you a fake clock, a fake database that counts its own calls, a cache with real expiry, and a deterministic pseudo-random generator. Implement <code>serveBatch(ids, now)</code>, which serves a batch of requests that all arrive at the <b>same instant</b>.</p>' +
            '<p>For each id, in the order given, using the key <code>&quot;product:&quot; + id</code>:</p>' +
            '<ul>' +
            '<li><b>Hit.</b> If <code>cacheGet(key, now)</code> returns a value: that value is the answer, except that the sentinel <code>NULL_SENTINEL</code> means <code>null</code>.</li>' +
            '<li><b>Single-flight.</b> On a miss, call <code>dbFind(id)</code> <b>at most once per distinct id in the batch</b> — a second request for the same missing id in the same batch must reuse the first result, not query again.</li>' +
            '<li><b>Negative caching.</b> If the row does not exist, cache <code>NULL_SENTINEL</code> for <b>30</b> seconds and answer <code>null</code>.</li>' +
            '<li><b>TTL with jitter.</b> If the row exists, cache it for <code>300 + Math.floor(rand() * 60)</code> seconds — call <code>rand()</code> <b>exactly once per cache write</b>, and only for rows that exist.</li>' +
            '</ul>' +
            '<p>Return <code>{ values, dbCalls }</code>, where <code>values</code> is the answers in the same order as <code>ids</code>, and <code>dbCalls</code> is how many times <code>dbFind</code> was called <b>during this batch</b>.</p>' +
            '<p>Keep the given data and the printing block exactly as they are, and do not require anything.</p>',

            '<p><b>Câu 31 — Bốn thứ mà bản cache-aside năm dòng còn thiếu (chương 6).</b> Không có máy chủ Redis nào tham gia: đề cho sẵn một đồng hồ giả, một cơ sở dữ liệu giả tự đếm số lần bị gọi, một bộ đệm có hạn dùng thật, và một bộ sinh số giả ngẫu nhiên tất định. Hãy cài đặt <code>serveBatch(ids, now)</code>, phục vụ một lô request cùng đến ở <b>một khoảnh khắc</b>.</p>' +
            '<p>Với từng id, theo đúng thứ tự đã cho, dùng khoá <code>&quot;product:&quot; + id</code>:</p>' +
            '<ul>' +
            '<li><b>Trúng.</b> Nếu <code>cacheGet(key, now)</code> trả về một giá trị thì đó là câu trả lời, trừ khi giá trị ấy là cờ hiệu <code>NULL_SENTINEL</code>, nghĩa là <code>null</code>.</li>' +
            '<li><b>Một chuyến bay.</b> Khi trượt, gọi <code>dbFind(id)</code> <b>tối đa một lần cho mỗi id khác nhau trong lô</b> — request thứ hai hỏi cùng một id đang thiếu trong cùng lô phải dùng lại kết quả lần đầu, không được hỏi lại.</li>' +
            '<li><b>Đệm cả kết quả rỗng.</b> Nếu hàng dữ liệu không tồn tại, hãy đệm <code>NULL_SENTINEL</code> trong <b>30</b> giây và trả lời <code>null</code>.</li>' +
            '<li><b>TTL có nhiễu.</b> Nếu hàng dữ liệu tồn tại, hãy đệm nó <code>300 + Math.floor(rand() * 60)</code> giây — gọi <code>rand()</code> <b>đúng một lần cho mỗi lượt ghi đệm</b>, và chỉ với những hàng có tồn tại.</li>' +
            '</ul>' +
            '<p>Trả về <code>{ values, dbCalls }</code>, với <code>values</code> là các câu trả lời theo đúng thứ tự của <code>ids</code>, và <code>dbCalls</code> là số lần <code>dbFind</code> được gọi <b>trong lô này</b>.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không được require gì cả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const DB_ROWS = new Map([[1, 'Bàn phím'], [2, 'Chuột'], [3, 'Màn hình']]);\n" +
            'let dbCalls = 0;\n' +
            'function dbFind(id) { dbCalls++; return DB_ROWS.has(id) ? DB_ROWS.get(id) : null; }\n\n' +
            "const NULL_SENTINEL = '__null__';\n" +
            'const cache = new Map();          // key -> { value, expiresAt }\n' +
            'function cacheGet(key, now) {\n' +
            '  const e = cache.get(key);\n' +
            '  if (!e) return undefined;\n' +
            '  if (e.expiresAt <= now) { cache.delete(key); return undefined; }\n' +
            '  return e.value;\n' +
            '}\n' +
            'function cacheSet(key, value, ttlSec, now) {\n' +
            '  cache.set(key, { value, expiresAt: now + ttlSec * 1000 });\n' +
            '}\n\n' +
            '// Bộ sinh số giả ngẫu nhiên TẤT ĐỊNH — cùng hạt giống thì cùng dãy số.\n' +
            'let seed = 12345;\n' +
            'function rand() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function serveBatch(ids, now) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const show = (label, v) => console.log(label + ' ' + JSON.stringify(v));\n" +
            'const T0 = 1_000_000;\n' +
            "show('t0   5 lượt cùng lúc, id=1   :', serveBatch(Array(5).fill(1), T0));\n" +
            "show('t0   id 1,2,3 lẫn 1 lặp lại :', serveBatch([1, 2, 3, 1], T0));\n" +
            "show('t0   id 99 không tồn tại    :', serveBatch([99, 99, 99], T0));\n" +
            "show('t0+10s vẫn còn đệm âm       :', serveBatch([99], T0 + 10_000));\n" +
            "show('t0+31s đệm âm đã hết hạn    :', serveBatch([99], T0 + 31_000));\n" +
            "show('t0+299s vẫn trúng           :', serveBatch([1, 2], T0 + 299_000));\n" +
            "show('t0+360s đã hết hạn hết      :', serveBatch([1, 2], T0 + 360_000));\n" +
            "show('lô rỗng                     :', serveBatch([], T0 + 400_000));\n",
          expectedOutput:
            't0   5 lượt cùng lúc, id=1   : {"values":["Bàn phím","Bàn phím","Bàn phím","Bàn phím","Bàn phím"],"dbCalls":1}\n' +
            't0   id 1,2,3 lẫn 1 lặp lại : {"values":["Bàn phím","Chuột","Màn hình","Bàn phím"],"dbCalls":2}\n' +
            't0   id 99 không tồn tại    : {"values":[null,null,null],"dbCalls":1}\n' +
            't0+10s vẫn còn đệm âm       : {"values":[null],"dbCalls":0}\n' +
            't0+31s đệm âm đã hết hạn    : {"values":[null],"dbCalls":1}\n' +
            't0+299s vẫn trúng           : {"values":["Bàn phím","Chuột"],"dbCalls":0}\n' +
            't0+360s đã hết hạn hết      : {"values":["Bàn phím","Chuột"],"dbCalls":2}\n' +
            'lô rỗng                     : {"values":[],"dbCalls":0}',
          sampleSolution:
            'function serveBatch(ids, now) {\n' +
            '  const before = dbCalls;\n' +
            '  const values = [];\n' +
            '  // "Một chuyến bay": trong CÙNG một lô, mỗi id chỉ được xuống DB đúng một lần.\n' +
            '  const inFlight = new Map();\n\n' +
            '  for (const id of ids) {\n' +
            "    const key = 'product:' + id;\n" +
            '\n' +
            '    const hit = cacheGet(key, now);\n' +
            '    if (hit !== undefined) {\n' +
            '      values.push(hit === NULL_SENTINEL ? null : hit);\n' +
            '      continue;\n' +
            '    }\n' +
            '    if (inFlight.has(id)) {\n' +
            '      values.push(inFlight.get(id));\n' +
            '      continue;\n' +
            '    }\n' +
            '\n' +
            '    const row = dbFind(id);\n' +
            '    if (row === null) {\n' +
            '      // Đệm cả kết quả RỖNG, TTL ngắn: hàng chưa có hôm nay có thể có ngày mai.\n' +
            '      cacheSet(key, NULL_SENTINEL, 30, now);\n' +
            '    } else {\n' +
            '      // Nhiễu TTL: gọi rand() ĐÚNG một lần cho mỗi lượt ghi đệm.\n' +
            '      cacheSet(key, row, 300 + Math.floor(rand() * 60), now);\n' +
            '    }\n' +
            '    inFlight.set(id, row);\n' +
            '    values.push(row);\n' +
            '  }\n' +
            '\n' +
            '  return { values, dbCalls: dbCalls - before };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — What a consumer loses when it disconnects (chapter 8).</b> One scripted timeline, replayed through two transports, so the difference between at-most-once and a log you can resume is a number rather than a claim. No Redis server is involved.</p>' +
            '<p>The timeline is a list of events in order, each with a <code>t</code>. Every consumer starts <b>disconnected</b>.</p>' +
            '<p><code>deliverPubSub(timeline, names)</code> — a published message is written only to the consumers connected <b>at that instant</b>. Nothing is stored, so a message published while a consumer is away is gone for that consumer forever.</p>' +
            '<p><code>deliverStream(timeline, names)</code> — every message is appended to a log with a sequential id starting at <b>1</b>. Each consumer keeps a cursor, starting at <b>0</b>. While connected, an appended message is delivered immediately and the cursor advances. On <code>connect</code>, the consumer first replays everything in the log with an id greater than its cursor, in order, then continues live.</p>' +
            '<p>Both return <code>{ received, lost }</code>: <code>received</code> maps each name to the array of message bodies it got, in order; <code>lost</code> maps each name to how many of the published messages it never received. For the stream, count what is still unreceived <b>at the end of the timeline</b> — a consumer that is disconnected when the timeline ends has not replayed yet.</p>' +
            '<p>Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 32 — Một consumer mất gì khi rớt kết nối (chương 8).</b> Một dòng thời gian có kịch bản, phát lại qua hai cách vận chuyển, để cái khác biệt giữa "nhiều nhất một lần" và "một nhật ký đọc tiếp được" trở thành một CON SỐ chứ không phải một lời khẳng định. Không có máy chủ Redis nào tham gia.</p>' +
            '<p>Dòng thời gian là danh sách sự kiện theo thứ tự, mỗi sự kiện có một mốc <code>t</code>. Mọi consumer đều bắt đầu ở trạng thái <b>chưa kết nối</b>.</p>' +
            '<p><code>deliverPubSub(timeline, names)</code> — một thông điệp phát ra chỉ được ghi cho những consumer đang kết nối <b>đúng khoảnh khắc ấy</b>. Không gì được lưu lại, nên thông điệp phát ra lúc một consumer đang vắng thì mất vĩnh viễn với consumer đó.</p>' +
            '<p><code>deliverStream(timeline, names)</code> — mọi thông điệp đều được ghi thêm vào một nhật ký với id tuần tự bắt đầu từ <b>1</b>. Mỗi consumer giữ một con trỏ, khởi đầu bằng <b>0</b>. Khi đang kết nối, thông điệp vừa ghi thêm được giao ngay và con trỏ tiến lên. Khi <code>connect</code>, consumer phát lại trước tiên mọi mục trong nhật ký có id lớn hơn con trỏ của nó, theo thứ tự, rồi mới đi tiếp trực tiếp.</p>' +
            '<p>Cả hai trả về <code>{ received, lost }</code>: <code>received</code> ánh xạ mỗi tên tới mảng nội dung thông điệp nó nhận được, theo thứ tự; <code>lost</code> ánh xạ mỗi tên tới số thông điệp đã phát mà nó không bao giờ nhận được. Với stream, hãy đếm phần vẫn chưa nhận <b>ở thời điểm dòng thời gian kết thúc</b> — một consumer đang mất kết nối lúc dòng thời gian kết thúc thì chưa kịp phát lại.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "// w2 rớt kết nối bốn giây (một lần deploy) rồi quay lại. w3 không bao giờ về.\n" +
            'const TIMELINE = [\n' +
            "  { t: 0,  type: 'connect',    who: 'w1' },\n" +
            "  { t: 0,  type: 'connect',    who: 'w2' },\n" +
            "  { t: 0,  type: 'connect',    who: 'w3' },\n" +
            "  { t: 1,  type: 'publish',    body: 'order:1' },\n" +
            "  { t: 2,  type: 'publish',    body: 'order:2' },\n" +
            "  { t: 3,  type: 'disconnect', who: 'w2' },\n" +
            "  { t: 3,  type: 'disconnect', who: 'w3' },\n" +
            "  { t: 4,  type: 'publish',    body: 'order:3' },\n" +
            "  { t: 5,  type: 'publish',    body: 'order:4' },\n" +
            "  { t: 6,  type: 'publish',    body: 'order:5' },\n" +
            "  { t: 7,  type: 'connect',    who: 'w2' },\n" +
            "  { t: 8,  type: 'publish',    body: 'order:6' },\n" +
            '];\n\n' +
            "const NAMES = ['w1', 'w2', 'w3'];\n\n" +
            '// Không ai nghe cả — cùng dòng thời gian, bỏ hết các sự kiện kết nối.\n' +
            "const NOBODY = TIMELINE.filter((e) => e.type === 'publish');\n\n" +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function deliverPubSub(timeline, names) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function deliverStream(timeline, names) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const show = (label, v) => console.log(label + ' ' + JSON.stringify(v));\n" +
            "show('pubsub          :', deliverPubSub(TIMELINE, NAMES));\n" +
            "show('stream          :', deliverStream(TIMELINE, NAMES));\n" +
            "show('pubsub · vắng   :', deliverPubSub(NOBODY, NAMES));\n" +
            "show('stream · vắng   :', deliverStream(NOBODY, NAMES));\n" +
            "show('pubsub · rỗng   :', deliverPubSub([], NAMES));\n" +
            "show('stream · rỗng   :', deliverStream([], NAMES));\n",
          expectedOutput:
            'pubsub          : {"received":{"w1":["order:1","order:2","order:3","order:4","order:5","order:6"],"w2":["order:1","order:2","order:6"],"w3":["order:1","order:2"]},"lost":{"w1":0,"w2":3,"w3":4}}\n' +
            'stream          : {"received":{"w1":["order:1","order:2","order:3","order:4","order:5","order:6"],"w2":["order:1","order:2","order:3","order:4","order:5","order:6"],"w3":["order:1","order:2"]},"lost":{"w1":0,"w2":0,"w3":4}}\n' +
            'pubsub · vắng   : {"received":{"w1":[],"w2":[],"w3":[]},"lost":{"w1":6,"w2":6,"w3":6}}\n' +
            'stream · vắng   : {"received":{"w1":[],"w2":[],"w3":[]},"lost":{"w1":6,"w2":6,"w3":6}}\n' +
            'pubsub · rỗng   : {"received":{"w1":[],"w2":[],"w3":[]},"lost":{"w1":0,"w2":0,"w3":0}}\n' +
            'stream · rỗng   : {"received":{"w1":[],"w2":[],"w3":[]},"lost":{"w1":0,"w2":0,"w3":0}}',
          sampleSolution:
            'function deliverPubSub(timeline, names) {\n' +
            '  const received = {};\n' +
            '  const connected = new Set();\n' +
            '  let published = 0;\n' +
            '  for (const n of names) received[n] = [];\n\n' +
            '  for (const ev of timeline) {\n' +
            "    if (ev.type === 'connect') { connected.add(ev.who); continue; }\n" +
            "    if (ev.type === 'disconnect') { connected.delete(ev.who); continue; }\n" +
            '    published++;\n' +
            '    // Không lưu gì cả: chỉ ghi cho những ai đang nối vào ĐÚNG lúc này.\n' +
            '    for (const n of names) if (connected.has(n)) received[n].push(ev.body);\n' +
            '  }\n\n' +
            '  const lost = {};\n' +
            '  for (const n of names) lost[n] = published - received[n].length;\n' +
            '  return { received, lost };\n' +
            '}\n\n' +
            'function deliverStream(timeline, names) {\n' +
            '  const received = {};\n' +
            '  const cursor = {};\n' +
            '  const connected = new Set();\n' +
            '  const log = [];               // [{ id, body }] — đọc KHÔNG làm mất mục\n' +
            '  for (const n of names) { received[n] = []; cursor[n] = 0; }\n\n' +
            '  const replay = (n) => {\n' +
            '    for (const entry of log) {\n' +
            '      if (entry.id > cursor[n]) { received[n].push(entry.body); cursor[n] = entry.id; }\n' +
            '    }\n' +
            '  };\n\n' +
            '  for (const ev of timeline) {\n' +
            "    if (ev.type === 'connect') { connected.add(ev.who); replay(ev.who); continue; }\n" +
            "    if (ev.type === 'disconnect') { connected.delete(ev.who); continue; }\n" +
            '    const entry = { id: log.length + 1, body: ev.body };\n' +
            '    log.push(entry);\n' +
            '    for (const n of names) {\n' +
            '      if (connected.has(n)) { received[n].push(entry.body); cursor[n] = entry.id; }\n' +
            '    }\n' +
            '  }\n\n' +
            '  const lost = {};\n' +
            '  for (const n of names) lost[n] = log.length - cursor[n];\n' +
            '  return { received, lost };\n' +
            '}\n',
        }),
      ],
    },
  ],
};
