/**
 * Redis — Final Exam (FE): 50 câu trắc nghiệm phủ cả 13 chương (s00–s12).
 *
 * Đề tự soạn, bám sát `content/courses/redis/s00…s12`. Có cả câu lý thuyết lẫn
 * câu đọc transcript; MỌI câu hỏi "lệnh này trả về gì", "TTL còn bao nhiêu",
 * "thứ tự ra sao", "PEL còn những gì" đều đã CHẠY THẬT trên một máy chủ Redis
 * dựng bằng `docker run --rm -d --name redis-de -p 56379:6379 redis:7`, báo
 * `redis_version:7.4.9` — transcript trong đề và đáp án là nguyên văn máy in
 * ra, không phải trí nhớ.
 *
 * ⚠️ Hai chỗ máy THẮNG dự đoán, và đề lấy theo máy:
 *   • `EXPIRE key n GT` trên khoá KHÔNG có TTL trả về 0 và không đặt gì, còn
 *     `EXPIRE key n LT` trên đúng khoá ấy trả về 1 — khoá không hạn được coi
 *     là hạn VÔ HẠN. Trực giác "GT nghĩa là lớn hơn nên đặt được" là sai.
 *   • `SINTERSTORE dest a b` khi giao rỗng không chỉ trả 0 mà còn XOÁ LUÔN
 *     khoá đích đang có sẵn.
 *
 * ⚠️ Vài số trong đề là của bản 7.4 chạy trong ảnh Docker chính thức; những
 * câu hỏi về mặc định (`save`, `appendfsync`, `maxclients`, `slowlog-*`,
 * `maxmemory-policy`) đều đã đối chiếu bằng `CONFIG GET` trên chính máy chủ ấy.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/REDIS-FE.mjs --apply
 */
import { B, EX, code, c, mcq } from './_lib/redis-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all 13 chapters, from "one thread, and why that is fast" to "Redis is fine; the design around it is not". Many questions show a <code>redis-cli</code> transcript and ask what the next line prints; every one of those answers came from running the commands against a real Redis 7.4 server, so read the transcript rather than the intuition.</p>' +
  '<p>Two habits pay off here. First, separate <em>what a command does</em> from <em>what it returns</em>: several questions turn entirely on a return value — 0 versus 1, nil versus an empty array, -1 versus -2. Second, keep asking whether two commands are really one indivisible step; half of the atomicity questions are decided by that alone.</p>' +
  '<p>You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả 13 chương, từ "một luồng, và vì sao thế là nhanh" tới "Redis vẫn ổn; cái thiết kế quanh nó thì không". Nhiều câu cho sẵn một transcript <code>redis-cli</code> rồi hỏi dòng kế tiếp in ra gì; mọi đáp án loại đó đều lấy từ việc chạy thật những lệnh ấy trên một máy chủ Redis 7.4, nên hãy đọc transcript thay vì đoán theo cảm tính.</p>' +
  '<p>Hai thói quen giúp ích ở đây. Một là tách bạch <em>lệnh làm gì</em> với <em>lệnh trả về gì</em>: nhiều câu ăn thua hoàn toàn ở giá trị trả về — 0 hay 1, nil hay mảng rỗng, -1 hay -2. Hai là luôn tự hỏi hai lệnh có thật sự là một bước không thể chia cắt hay không; một nửa số câu về tính nguyên tử chỉ quyết định bằng đúng điều đó.</p>' +
  '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'redis' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Final Exam — the whole Redis course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá Redis (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all thirteen chapters: the single-threaded execution model and RESP, keys and expiration, strings, counters, bitmaps and HyperLogLog, lists, sets and sorted sets, hashes and object modelling, caching and stampedes, MULTI, WATCH, Lua and locks, Pub/Sub and Streams, memory, eviction and persistence, configuration, security and ACLs, replication, Sentinel and Cluster, and diagnosing an incident.',
        'Năm mươi câu trắc nghiệm phủ cả mười ba chương: mô hình thực thi một luồng và giao thức RESP, khoá và hết hạn, chuỗi, bộ đếm, bitmap và HyperLogLog, list, set và sorted set, hash và cách mô hình hoá đối tượng, làm bộ đệm và chuyện giẫm đạp, MULTI, WATCH, Lua và khoá phân tán, Pub/Sub và Stream, bộ nhớ, đẩy khoá và lưu lâu dài, cấu hình, bảo mật và ACL, nhân bản, Sentinel và Cluster, và chẩn đoán một sự cố.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        // ── Mục 0 — Redis giải quyết gì, và cài đặt ─────────────────────
        mcq({
          prompt: B(
            'This ran on a live server. What does the last line print?' + code(
              '> SET s hello\n' +
              'OK\n' +
              '> EXISTS s s nope\n' +
              '?',
            ),
            'Đoạn này chạy trên máy chủ thật. Dòng cuối in ra gì?' + code(
              '> SET s hello\n' +
              'OK\n' +
              '> EXISTS s s nope\n' +
              '?',
            ),
          ),
          options: [
            B('<code>(integer) 1</code> — the key <code>s</code> exists once', '<code>(integer) 1</code> — khoá <code>s</code> tồn tại, đếm một lần'),
            B('<code>(error) ERR wrong number of arguments</code>', '<code>(error) ERR wrong number of arguments</code>'),
            B('<code>(integer) 2</code>', '<code>(integer) 2</code>'),
            B('<code>(integer) 3</code> — one per argument, present or not', '<code>(integer) 3</code> — mỗi đối số một lần, dù có hay không'),
          ],
          correct: 2,
          explanation: EX(
            'Verified on Redis 7.4.9. <code>EXISTS</code> takes many keys and returns <b>how many of the arguments named an existing key, counting duplicates separately</b> — <code>s</code> is counted twice and <code>nope</code> is not counted at all, so the answer is 2. This is not a set-cardinality question and it is not a yes/no question; the variadic form exists so you can check a batch in one round trip, and the count is the sum of individual hits. Option 1 is the pre-3.0.3 single-key behaviour; option 4 confuses "number of arguments" with "number of hits".',
            'Đã kiểm trên Redis 7.4.9. <code>EXISTS</code> nhận nhiều khoá và trả về <b>bao nhiêu ĐỐI SỐ trỏ tới một khoá đang tồn tại, đếm cả phần trùng lặp</b> — <code>s</code> được đếm hai lần còn <code>nope</code> không được đếm, nên đáp án là 2. Đây không phải câu hỏi về lực lượng của một tập hợp, cũng không phải câu hỏi có/không; dạng nhận nhiều đối số tồn tại để bạn kiểm cả lô trong một lượt đi về, và con số trả về là tổng số lần trúng. Phương án 1 là hành vi của bản trước 3.0.3 khi chỉ nhận một khoá; phương án 4 nhầm "số đối số" với "số lần trúng".',
          ),
        }),

        mcq({
          prompt: B(
            'A million-key production instance freezes for several seconds whenever an admin script runs <code>KEYS *</code>. What is the mechanism?',
            'Một máy chủ production có một triệu khoá đứng hình vài giây mỗi khi một script quản trị chạy <code>KEYS *</code>. Cơ chế của chuyện đó là gì?',
          ),
          options: [
            B('Redis executes commands on one thread, and <code>KEYS</code> walks the whole keyspace in a single uninterruptible operation, so every other client waits behind it', 'Redis chạy lệnh trên một luồng, và <code>KEYS</code> duyệt cả keyspace trong một thao tác không thể ngắt, nên mọi client khác phải xếp hàng chờ phía sau'),
            B('<code>KEYS</code> takes a global lock that <code>GET</code> and <code>SET</code> also need', '<code>KEYS</code> giữ một khoá toàn cục mà <code>GET</code> và <code>SET</code> cũng cần'),
            B('The reply is large enough to exceed <code>proto-max-bulk-len</code> and the server retries it', 'Kết quả trả về lớn tới mức vượt <code>proto-max-bulk-len</code> nên máy chủ phải thử lại'),
            B('The keyspace is paged to disk and <code>KEYS</code> forces it back into memory', 'Keyspace bị đẩy ra đĩa và <code>KEYS</code> buộc nó phải nạp lại vào bộ nhớ'),
          ],
          correct: 0,
          explanation: EX(
            'One thread executes every command, so "slow for one client" and "slow for everyone" are the same sentence. <code>KEYS</code> is O(N) on the <em>keyspace</em>, not on a collection, and it does not yield partway through. The replacement is <code>SCAN</code>, which returns a cursor and a small batch, letting other commands run between iterations — the same reason <code>redis-cli --scan</code> is safe on production while <code>KEYS</code> is not. Option 2 invents a lock Redis does not have (it does not need one — there is only one thread). Option 3 is a real error but for oversized <em>requests</em>. Option 4 describes swap, which is a separate emergency: <code>used_memory_rss</code> dropping below <code>used_memory</code>.',
            'Chỉ một luồng chạy mọi lệnh, nên "chậm với một client" và "chậm với tất cả" là cùng một câu. <code>KEYS</code> có độ phức tạp O(N) trên <em>keyspace</em>, không phải trên một collection, và nó không nhường lượt giữa chừng. Thứ thay thế là <code>SCAN</code>: nó trả về một con trỏ và một lô nhỏ, cho phép lệnh khác chạy xen giữa các vòng — cũng chính là lý do <code>redis-cli --scan</code> an toàn trên production còn <code>KEYS</code> thì không. Phương án 2 bịa ra một cái khoá mà Redis không có (nó không cần — chỉ có một luồng). Phương án 3 là lỗi thật nhưng dành cho <em>yêu cầu</em> gửi lên quá lớn. Phương án 4 mô tả swap, một tình trạng khẩn cấp khác: <code>used_memory_rss</code> tụt xuống dưới <code>used_memory</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A <code>GET</code> against a Redis on the same machine measures p50 = 0.311 ms, while <code>redis-benchmark</code> reports over 70,000 ops/s. Where is almost all of that 0.311 ms going?',
            'Một lệnh <code>GET</code> tới Redis chạy cùng máy đo được p50 = 0,311 ms, trong khi <code>redis-benchmark</code> báo hơn 70.000 thao tác mỗi giây. Gần như toàn bộ 0,311 ms ấy đi đâu?',
          ),
          options: [
            B('Into hashing the key and looking it up in the keyspace dictionary', 'Vào việc băm tên khoá và tra nó trong từ điển keyspace'),
            B('Into serialising the value into RESP', 'Vào việc tuần tự hoá giá trị thành RESP'),
            B('Into the periodic active-expiration cycle running between commands', 'Vào chu kỳ hết hạn chủ động chạy xen giữa các lệnh'),
            B('Into the round trip — syscalls, the TCP stack and the scheduler — not into Redis&#x27;s own work', 'Vào lượt đi về — syscall, tầng TCP và bộ lập lịch — chứ không phải vào phần việc của chính Redis'),
          ],
          correct: 3,
          explanation: EX(
            'The two numbers are the proof: 70,000 ops/s means the server spends roughly 14 microseconds per command, so of the 311 microseconds you measured, about 297 were spent getting there and back. That is why <b>pipelining is the single biggest speedup available</b> — it removes round trips, not work — and why "Redis is slow" is so often a network or a client-library story. It is also why moving Redis to a bigger machine changes almost nothing while moving it into the same data centre changes a lot. Options 1 and 2 are real work but measured in nanoseconds and microseconds; option 3 runs 10 times a second on a sample of 20 keys and does not sit inside your command.',
            'Chính hai con số ấy là bằng chứng: 70.000 thao tác/giây nghĩa là máy chủ tốn khoảng 14 micro giây cho mỗi lệnh, nên trong 311 micro giây bạn đo được, khoảng 297 là để đi tới và quay về. Đó là lý do <b>gộp lệnh (pipelining) là phép tăng tốc lớn nhất bạn có</b> — nó bỏ bớt lượt đi về, chứ không bớt phần việc — và cũng là lý do "Redis chậm" rất hay là câu chuyện của mạng hoặc của thư viện client. Nó cũng giải thích vì sao dời Redis sang máy to hơn gần như không đổi gì, còn dời nó vào cùng một trung tâm dữ liệu thì đổi rất nhiều. Phương án 1 và 2 là việc thật nhưng đo bằng nano giây và micro giây; phương án 3 chạy 10 lần mỗi giây trên một mẫu 20 khoá và không nằm bên trong lệnh của bạn.',
          ),
        }),

        // ── Chương 1 — Mô hình thực thi ─────────────────────────────────
        mcq({
          prompt: B(
            'A client sends <code>SET user:1 "Cường"</code>. On the wire the value arrives as <code>$7</code>, and <code>STRLEN user:1</code> later returns 7. Why 7?',
            'Một client gửi <code>SET user:1 "Cường"</code>. Trên đường truyền, giá trị tới dưới dạng <code>$7</code>, và về sau <code>STRLEN user:1</code> trả về 7. Vì sao lại là 7?',
          ),
          options: [
            B('RESP adds a two-byte <code>\\r\\n</code> terminator to the five characters', 'RESP thêm hai byte <code>\\r\\n</code> vào sau năm ký tự'),
            B('The RESP bulk-string prefix counts <b>bytes</b>, and "Cường" is 5 characters but 7 bytes in UTF-8', 'Tiền tố bulk string của RESP đếm <b>byte</b>, mà "Cường" là 5 ký tự nhưng 7 byte trong UTF-8'),
            B('Redis stores strings as UTF-16, so five characters take more space', 'Redis lưu chuỗi dưới dạng UTF-16 nên năm ký tự chiếm nhiều chỗ hơn'),
            B('The quotation marks are stored as part of the value', 'Hai dấu nháy được lưu như một phần của giá trị'),
          ],
          correct: 1,
          explanation: EX(
            'Redis stores <b>bytes</b> and knows nothing about character encodings. In UTF-8, <code>ư</code> and <code>ờ</code> take two and three bytes respectively, so "Cường" is C(1) + ư(2) + ờ... in total 7 bytes, and the bulk-string header <code>$7</code> announces exactly that. The practical consequences are everywhere in this course: <code>STRLEN</code>, <code>GETRANGE</code>, <code>SETRANGE</code> and <code>BITCOUNT</code> all work in bytes, so slicing a Vietnamese string by character index will cut a character in half. Option 1 is wrong because the <code>\\r\\n</code> follows the payload and is not counted in the length. Option 3 invents a storage format. Option 4 is a shell-quoting artefact that never reaches the server.',
            'Redis lưu <b>byte</b> và không biết gì về bảng mã ký tự. Trong UTF-8, <code>ư</code> và <code>ờ</code> lần lượt chiếm hai và ba byte, nên "Cường" tổng cộng là 7 byte, và phần đầu bulk string <code>$7</code> khai báo đúng con số ấy. Hệ quả thực tế trải khắp khoá học này: <code>STRLEN</code>, <code>GETRANGE</code>, <code>SETRANGE</code> và <code>BITCOUNT</code> đều làm việc theo byte, nên cắt một chuỗi tiếng Việt theo chỉ số ký tự sẽ chặt đôi một chữ. Phương án 1 sai vì <code>\\r\\n</code> nằm SAU phần dữ liệu và không được tính vào độ dài. Phương án 3 bịa ra một định dạng lưu trữ. Phương án 4 là dấu nháy của shell, nó không bao giờ tới được máy chủ.',
          ),
        }),

        mcq({
          prompt: B(
            'A thousand <code>SET</code> commands sent one at a time took 8.412 s; the same thousand sent through <code>redis-cli --pipe</code> took 0.164 s. What did the 8.2 seconds buy?',
            'Một nghìn lệnh <code>SET</code> gửi lần lượt từng cái mất 8,412 giây; cũng một nghìn lệnh ấy đẩy qua <code>redis-cli --pipe</code> mất 0,164 giây. Tám giây hai kia mua được cái gì?',
          ),
          options: [
            B('Nothing — the pipelined version skipped the durability guarantees the sequential one had', 'Chẳng được gì — bản gộp lệnh đã bỏ qua những bảo đảm về độ bền mà bản tuần tự có'),
            B('A thousand network round trips, one per command, each waiting for the previous reply', 'Một nghìn lượt đi về trên mạng, mỗi lệnh một lượt, và lượt sau phải chờ kết quả của lượt trước'),
            B('A thousand separate TCP connections being opened and closed', 'Một nghìn kết nối TCP riêng lẻ được mở ra rồi đóng lại'),
            B('The server parsing each command individually instead of in a batch', 'Máy chủ phải phân tích từng lệnh một thay vì phân tích cả lô'),
          ],
          correct: 1,
          explanation: EX(
            'Pipelining changes exactly one thing: it stops waiting for reply N before sending command N+1. The server still parses and executes all thousand commands individually — it is the same work — but the thousand latencies are no longer serialised. The rule of thumb from the chapter follows directly: <b>batching 1 to 100 removes 99% of the round trips; going from 100 to 10,000 removes 0.99% more</b>, so batches of 100 to 1,000 capture nearly all of the win while keeping the reply buffer small. Option 1 is a common but wrong instinct: a pipeline changes no persistence semantics whatsoever. Option 3 is wrong because a single connection was reused. Option 4 describes work that is identical in both runs.',
            'Gộp lệnh chỉ đổi đúng một điều: nó thôi không chờ kết quả thứ N trước khi gửi lệnh thứ N+1. Máy chủ vẫn phân tích và thực thi cả nghìn lệnh từng cái một — vẫn ngần ấy việc — nhưng nghìn khoảng trễ ấy không còn nối đuôi nhau nữa. Từ đó suy ra thẳng cái quy tắc của chương: <b>gộp từ 1 lên 100 bỏ đi 99% số lượt đi về; từ 100 lên 10.000 chỉ bỏ thêm 0,99% nữa</b>, nên lô cỡ 100 đến 1.000 đã gom gần hết phần lợi mà vẫn giữ bộ đệm kết quả nhỏ. Phương án 1 là phản xạ phổ biến nhưng sai: gộp lệnh không đổi một chút nào ngữ nghĩa lưu lâu dài. Phương án 3 sai vì cả hai lần đều dùng lại một kết nối. Phương án 4 mô tả phần việc y hệt nhau ở cả hai lần chạy.',
          ),
        }),

        mcq({
          prompt: B(
            'What is the difference between sending five commands in a pipeline and sending the same five inside <code>MULTI</code> … <code>EXEC</code>?',
            'Khác nhau ra sao giữa gửi năm lệnh trong một pipeline và gửi đúng năm lệnh ấy bên trong <code>MULTI</code> … <code>EXEC</code>?',
          ),
          options: [
            B('None — a pipeline is just the shorthand syntax for a transaction', 'Không khác gì — pipeline chỉ là cách viết tắt của một giao dịch'),
            B('A pipeline is atomic; <code>MULTI</code> merely groups commands for readability', 'Pipeline mới là nguyên tử; <code>MULTI</code> chỉ gom lệnh lại cho dễ đọc'),
            B('A pipeline rolls back on error; <code>MULTI</code> does not', 'Pipeline sẽ quay lui khi có lỗi; <code>MULTI</code> thì không'),
            B('In a pipeline another client&#x27;s commands can run between yours; inside <code>MULTI</code>…<code>EXEC</code> nothing can', 'Trong một pipeline, lệnh của client khác có thể chạy xen giữa các lệnh của bạn; bên trong <code>MULTI</code>…<code>EXEC</code> thì không gì chen vào được'),
          ],
          correct: 3,
          explanation: EX(
            'Pipelining is a <b>network optimisation</b>; <code>MULTI</code> is an <b>isolation guarantee</b>. Your five pipelined commands are executed in order, but the single thread is free to serve another client between command two and command three — which is exactly the window a read-then-write pair must not have. <code>EXEC</code> runs the queued block with nothing interleaved. Note what neither gives you: <b>rollback</b>. Redis has none, so option 3 is wrong twice over. Option 2 has the two backwards. Option 1 is the confusion this question exists to break — and the naming makes it worse, because node-redis&#x27;s <code>client.multi()</code> is a transaction by default while ioredis keeps <code>pipeline()</code> and <code>multi()</code> separate.',
            'Gộp lệnh là một <b>phép tối ưu mạng</b>; <code>MULTI</code> là một <b>bảo đảm cô lập</b>. Năm lệnh gộp của bạn vẫn chạy đúng thứ tự, nhưng luồng duy nhất ấy hoàn toàn có quyền phục vụ một client khác giữa lệnh thứ hai và lệnh thứ ba — đúng cái cửa sổ mà một cặp đọc-rồi-ghi không được phép có. <code>EXEC</code> chạy cả khối đã xếp hàng mà không có gì chen vào. Để ý thứ mà CẢ HAI đều không cho: <b>quay lui</b>. Redis không có, nên phương án 3 sai tới hai lần. Phương án 2 đảo ngược hai khái niệm. Phương án 1 chính là sự nhầm lẫn mà câu này sinh ra để phá — và cách đặt tên còn làm nó tệ hơn, vì <code>client.multi()</code> của node-redis mặc định là một giao dịch, còn ioredis thì tách riêng <code>pipeline()</code> và <code>multi()</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Your client sends <code>SET order:9001 confirmed</code> and receives <code>+OK</code>. What has that <code>OK</code> actually guaranteed?',
            'Client của bạn gửi <code>SET order:9001 confirmed</code> và nhận về <code>+OK</code>. Chữ <code>OK</code> đó thật ra bảo đảm được điều gì?',
          ),
          options: [
            B('That the write is applied in the primary&#x27;s memory — not that it is on disk, and not that any replica has it', 'Rằng phép ghi đã áp dụng trong bộ nhớ của máy chính — chứ không phải nó đã nằm trên đĩa, cũng không phải bản sao nào đã nhận được nó'),
            B('That the write is in memory and in the AOF file on disk', 'Rằng phép ghi đã nằm trong bộ nhớ và trong tệp AOF trên đĩa'),
            B('That the write is in memory, on disk, and acknowledged by every connected replica', 'Rằng phép ghi đã nằm trong bộ nhớ, trên đĩa, và đã được mọi bản sao đang kết nối xác nhận'),
            B('That the write survives a restart, because Redis fsyncs before replying', 'Rằng phép ghi sống sót qua một lần khởi động lại, vì Redis fsync trước khi trả lời'),
          ],
          correct: 0,
          explanation: EX(
            'The reply is sent as soon as the command has been applied to the in-memory dataset. Two windows remain open behind it. First, <b>persistence</b>: with the default <code>appendfsync everysec</code> up to one second of the AOF buffer can be lost, and with RDB alone the loss is everything since the last snapshot. Second, <b>replication</b>: it is asynchronous, so a primary that dies after replying may be replaced by a replica that never saw the write. <code>WAIT numreplicas timeout</code> narrows the second window and reports how many replicas confirmed — it does not close it, because the write already happened before <code>WAIT</code> ran. <code>WAITAOF</code> (7.0) is the strongest thing on offer and costs a disk round trip per call.',
            'Kết quả được gửi ngay khi lệnh đã áp dụng vào tập dữ liệu trong bộ nhớ. Sau lưng nó còn hai cửa sổ mở. Thứ nhất là <b>lưu lâu dài</b>: với mặc định <code>appendfsync everysec</code>, có thể mất tới một giây đệm AOF, còn nếu chỉ có RDB thì mất tất cả những gì sau bản chụp gần nhất. Thứ hai là <b>nhân bản</b>: nó bất đồng bộ, nên một máy chính chết sau khi đã trả lời có thể bị thay bằng một bản sao chưa từng thấy phép ghi ấy. <code>WAIT numreplicas timeout</code> thu hẹp cửa sổ thứ hai và báo có mấy bản sao đã xác nhận — nó không đóng được cửa sổ, vì phép ghi đã xảy ra TRƯỚC khi <code>WAIT</code> chạy. <code>WAITAOF</code> (7.0) là thứ mạnh nhất hiện có, và cái giá là một lượt đi về tới đĩa cho mỗi lời gọi.',
          ),
        }),

        // ── Chương 2 — Khoá, TTL và hết hạn ─────────────────────────────
        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. What does the last line print?' + code(
              '> SET a hello EX 100\n' +
              'OK\n' +
              '> TTL a\n' +
              '(integer) 100\n' +
              '> SET a world\n' +
              'OK\n' +
              '> TTL a\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9. Dòng cuối in ra gì?' + code(
              '> SET a hello EX 100\n' +
              'OK\n' +
              '> TTL a\n' +
              '(integer) 100\n' +
              '> SET a world\n' +
              'OK\n' +
              '> TTL a\n' +
              '?',
            ),
          ),
          options: [
            B('<code>(integer) 100</code> — a plain <code>SET</code> replaces the value and leaves the deadline alone', '<code>(integer) 100</code> — một lệnh <code>SET</code> trơn thay giá trị và để nguyên hạn'),
            B('<code>(integer) 99</code> or thereabouts — the countdown simply continues', '<code>(integer) 99</code> hoặc quanh đó — đồng hồ đếm ngược cứ thế chạy tiếp'),
            B('<code>(integer) -1</code>', '<code>(integer) -1</code>'),
            B('<code>(integer) -2</code>', '<code>(integer) -2</code>'),
          ],
          correct: 2,
          explanation: EX(
            'Verified by running it. A plain <code>SET</code> <b>replaces the key entirely</b>, deadline included, so the TTL is gone and <code>TTL</code> reports <code>-1</code> — "this key exists and has no expiry". This is the leak the whole chapter is built around: the key is now immortal, nothing logs it, and the only visible symptom is <code>keys</code> drifting away from <code>expires</code> in <code>INFO keyspace</code>. <code>SET a world KEEPTTL</code> is the fix, and it is also worth remembering which commands do <em>not</em> reset the deadline: <code>APPEND</code>, <code>INCR</code>, <code>HSET</code>, <code>LPUSH</code> and every other in-place modification preserve it. Option 4, <code>-2</code>, is what <code>TTL</code> returns for a key that does not exist at all.',
            'Đã chạy thật. Một lệnh <code>SET</code> trơn <b>thay thế trọn vẹn cái khoá</b>, kể cả cái hạn của nó, nên TTL biến mất và <code>TTL</code> báo <code>-1</code> — "khoá này có tồn tại và không có hạn". Đây đúng là chỗ rò rỉ mà cả chương xoay quanh: khoá giờ bất tử, không có gì ghi lại chuyện đó, và triệu chứng duy nhất nhìn thấy được là số <code>keys</code> ngày càng lệch khỏi số <code>expires</code> trong <code>INFO keyspace</code>. Cách vá là <code>SET a world KEEPTTL</code>, và cũng nên nhớ những lệnh KHÔNG đặt lại hạn: <code>APPEND</code>, <code>INCR</code>, <code>HSET</code>, <code>LPUSH</code> và mọi phép sửa tại chỗ khác đều giữ nguyên nó. Phương án 4, <code>-2</code>, là thứ <code>TTL</code> trả về cho một khoá hoàn toàn không tồn tại.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. Fill in the two missing replies.' + code(
              '> SET n 5\n' +
              'OK\n' +
              '> EXPIRE n 30 GT\n' +
              '?\n' +
              '> EXPIRE n 30 LT\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9. Điền hai kết quả còn thiếu.' + code(
              '> SET n 5\n' +
              'OK\n' +
              '> EXPIRE n 30 GT\n' +
              '?\n' +
              '> EXPIRE n 30 LT\n' +
              '?',
            ),
          ),
          options: [
            B('<code>0</code> then <code>1</code> — a key with no TTL counts as having an infinite one', '<code>0</code> rồi <code>1</code> — khoá không có TTL được coi là có hạn vô hạn'),
            B('<code>1</code> then <code>0</code> — the first call sets the TTL, so the second has nothing lower to set', '<code>1</code> rồi <code>0</code> — lời gọi đầu đặt TTL nên lời gọi sau không còn gì thấp hơn để đặt'),
            B('<code>1</code> then <code>1</code> — with no existing TTL both conditions are vacuously true', '<code>1</code> rồi <code>1</code> — chưa có TTL nào thì cả hai điều kiện đều đúng một cách hiển nhiên'),
            B('<code>0</code> then <code>0</code> — <code>GT</code> and <code>LT</code> both require an existing TTL to compare against', '<code>0</code> rồi <code>0</code> — cả <code>GT</code> lẫn <code>LT</code> đều cần một TTL sẵn có để mà so'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it, and it is the answer most people get backwards. Redis treats <b>"no TTL" as an infinitely distant deadline</b>. <code>GT</code> means "only if the new expiry is greater than the current one", and 30 seconds is not greater than infinity, so it returns 0 and sets nothing. <code>LT</code> means "only if it is less", and 30 seconds certainly is, so it returns 1 and the key now expires. That asymmetry is the useful part in practice: <code>EXPIRE key 3600 GT</code> is the idiom for "extend a session, never shorten it", and it is safe precisely because it will not accidentally give an unexpiring key a deadline. Option 4 describes <code>XX</code>, which is the flag that genuinely requires an existing TTL.',
            'Đã chạy thật, và đây là câu mà phần lớn người học nhớ ngược. Redis coi <b>"không có TTL" là một cái hạn xa vô cùng</b>. <code>GT</code> nghĩa là "chỉ đặt nếu hạn mới LỚN HƠN hạn hiện tại", mà 30 giây thì không lớn hơn vô cực, nên nó trả về 0 và không đặt gì. <code>LT</code> nghĩa là "chỉ đặt nếu NHỎ HƠN", và 30 giây thì chắc chắn nhỏ hơn, nên nó trả về 1 và khoá bắt đầu có hạn. Chính sự bất đối xứng ấy mới là phần hữu dụng trong thực tế: <code>EXPIRE key 3600 GT</code> là thành ngữ cho "gia hạn một phiên, không bao giờ rút ngắn", và nó an toàn đúng vì nó sẽ không lỡ tay gán hạn cho một khoá vốn không hạn. Phương án 4 mô tả cờ <code>XX</code>, mới là cờ thật sự đòi phải có sẵn một TTL.',
          ),
        }),

        mcq({
          prompt: B(
            'This cleanup loop runs against a live instance and stops far too early, leaving most matching keys behind. What is wrong?' + code(
              "let cursor = '0';\n" +
              'let keys = [];\n' +
              'do {\n' +
              "  [cursor, keys] = await redis.scan(cursor, 'MATCH', 'cache:v2:*', 'COUNT', 500);\n" +
              '  if (keys.length) await redis.unlink(...keys);\n' +
              '} while (keys.length);',
            ),
            'Vòng dọn dẹp này chạy trên một máy chủ thật và dừng quá sớm, bỏ sót phần lớn các khoá khớp mẫu. Sai ở đâu?' + code(
              "let cursor = '0';\n" +
              'let keys = [];\n' +
              'do {\n' +
              "  [cursor, keys] = await redis.scan(cursor, 'MATCH', 'cache:v2:*', 'COUNT', 500);\n" +
              '  if (keys.length) await redis.unlink(...keys);\n' +
              '} while (keys.length);',
            ),
          ),
          options: [
            B('<code>COUNT 500</code> is too large; <code>SCAN</code> silently truncates the iteration above 100', '<code>COUNT 500</code> quá lớn; <code>SCAN</code> âm thầm cắt ngắn vòng lặp khi vượt quá 100'),
            B('<code>UNLINK</code> deletes keys asynchronously, which invalidates the cursor', '<code>UNLINK</code> xoá khoá bất đồng bộ nên nó làm hỏng con trỏ'),
            B('The loop ends on an empty batch, but <code>MATCH</code> filters <i>after</i> fetching, so a batch can legitimately be empty mid-scan — only a cursor of <code>0</code> means finished', 'Vòng lặp dừng khi gặp một lô rỗng, nhưng <code>MATCH</code> lọc SAU khi đã lấy dữ liệu, nên một lô hoàn toàn có thể rỗng giữa chừng — chỉ con trỏ bằng <code>0</code> mới nghĩa là đã xong'),
            B('The cursor must be reset to <code>&#x27;0&#x27;</code> at the start of every iteration', 'Con trỏ phải được đặt lại về <code>&#x27;0&#x27;</code> ở đầu mỗi vòng lặp'),
          ],
          correct: 2,
          explanation: EX(
            '<code>SCAN</code> walks a fixed amount of the hash table per call and <em>then</em> applies <code>MATCH</code> to what it found, so a slice of the keyspace containing no matching keys returns an empty array with a perfectly valid non-zero cursor. The loop condition must be <code>while (cursor !== &#x27;0&#x27;)</code>. Two more things worth carrying out of this: the cursor is a 64-bit value and must be kept as an <b>opaque string</b> in JavaScript rather than parsed into a Number, and <code>SCAN</code> guarantees only that keys present for the whole iteration are returned <em>at least</em> once — duplicates are normal, so your handler must tolerate them. Option 4 would loop forever over the first batch.',
            '<code>SCAN</code> duyệt một lượng cố định của bảng băm mỗi lời gọi rồi MỚI áp <code>MATCH</code> lên những gì tìm được, nên một lát keyspace không chứa khoá nào khớp sẽ trả về mảng rỗng kèm một con trỏ khác 0 hoàn toàn hợp lệ. Điều kiện vòng lặp phải là <code>while (cursor !== &#x27;0&#x27;)</code>. Hai điều nữa đáng mang theo: con trỏ là một giá trị 64 bit và phải được giữ dưới dạng <b>chuỗi mờ</b> trong JavaScript chứ đừng ép sang Number, và <code>SCAN</code> chỉ bảo đảm rằng khoá có mặt suốt cả vòng duyệt sẽ được trả về <em>ít nhất</em> một lần — trùng lặp là bình thường, nên hàm xử lý của bạn phải chịu được. Phương án 4 sẽ lặp mãi trên lô đầu tiên.',
          ),
        }),

        mcq({
          prompt: B(
            'Deleting a set with five million members took 0.412 s with <code>DEL</code> and 0.002 s with <code>UNLINK</code>. What is the difference, and what does it cost?',
            'Xoá một set năm triệu thành viên mất 0,412 giây với <code>DEL</code> và 0,002 giây với <code>UNLINK</code>. Khác nhau ở đâu, và cái giá là gì?',
          ),
          options: [
            B('<code>UNLINK</code> only removes the key name and leaves the value to be overwritten later, so the memory is never actually returned', '<code>UNLINK</code> chỉ gỡ tên khoá và để cái giá trị đó bị ghi đè sau này, nên bộ nhớ không bao giờ thật sự được trả lại'),
            B('<code>UNLINK</code> unlinks the key from the keyspace immediately and frees the memory on a background thread, so the 412 ms of freeing still happens — just not on the thread that serves your other clients', '<code>UNLINK</code> gỡ khoá khỏi keyspace ngay lập tức rồi giải phóng bộ nhớ trên một luồng nền, nên 412 mili giây giải phóng ấy vẫn xảy ra — chỉ là không nằm trên luồng đang phục vụ các client khác'),
            B('<code>UNLINK</code> is faster because it skips the keyspace notification that <code>DEL</code> emits', '<code>UNLINK</code> nhanh hơn vì nó bỏ qua thông báo keyspace mà <code>DEL</code> phát ra'),
            B('<code>DEL</code> was slower only because the set was on disk; both are O(1) once it is in memory', '<code>DEL</code> chậm hơn chỉ vì cái set nằm trên đĩa; cả hai đều O(1) một khi nó đã ở trong bộ nhớ'),
          ],
          correct: 1,
          explanation: EX(
            'Freeing five million allocations is real work, and <code>DEL</code> does it inline on the single command thread — 412 ms during which nobody else is served. <code>UNLINK</code> removes the key from the keyspace dictionary at once (so it is invisible immediately, which is all your application cares about) and hands the deallocation to a background thread. The memory does come back, just not instantly, which is why <code>used_memory</code> can lag after a large <code>UNLINK</code> or a <code>FLUSHDB ASYNC</code>. Make <code>UNLINK</code> your default; for small keys the two are identical. The same mechanism is available for expiry and eviction through <code>lazyfree-lazy-expire</code> and friends — all four of which default to <code>no</code>.',
            'Giải phóng năm triệu vùng cấp phát là việc thật, và <code>DEL</code> làm việc ấy ngay trên luồng lệnh duy nhất — 412 mili giây không ai khác được phục vụ. <code>UNLINK</code> gỡ khoá khỏi từ điển keyspace ngay tức khắc (nên nó tàng hình lập tức, và đó là tất cả những gì ứng dụng của bạn quan tâm) rồi giao việc thu hồi bộ nhớ cho một luồng nền. Bộ nhớ vẫn về, chỉ là không tức thì, và đó là lý do <code>used_memory</code> có thể tụt chậm sau một lệnh <code>UNLINK</code> lớn hay một <code>FLUSHDB ASYNC</code>. Hãy lấy <code>UNLINK</code> làm mặc định; với khoá nhỏ thì hai lệnh y hệt nhau. Cơ chế ấy cũng có cho phần hết hạn và đẩy khoá, qua <code>lazyfree-lazy-expire</code> và các anh em của nó — cả bốn đều mặc định là <code>no</code>.',
          ),
        }),

        // ── Chương 3 — Chuỗi, bộ đếm, bitmap, HyperLogLog ───────────────
        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, on a key that did not exist. Fill in the three missing replies.' + code(
              '> SET g v1 NX GET\n' +
              '?\n' +
              '> SET g v2 NX GET\n' +
              '?\n' +
              '> GET g\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9, với một khoá chưa tồn tại. Điền ba kết quả còn thiếu.' + code(
              '> SET g v1 NX GET\n' +
              '?\n' +
              '> SET g v2 NX GET\n' +
              '?\n' +
              '> GET g\n' +
              '?',
            ),
          ),
          options: [
            B('<code>OK</code>, then <code>(nil)</code>, then <code>"v1"</code>', '<code>OK</code>, rồi <code>(nil)</code>, rồi <code>"v1"</code>'),
            B('<code>(nil)</code>, then <code>"v1"</code>, then <code>"v2"</code>', '<code>(nil)</code>, rồi <code>"v1"</code>, rồi <code>"v2"</code>'),
            B('<code>(error)</code> both times — <code>NX</code> and <code>GET</code> cannot be combined', '<code>(error)</code> cả hai lần — không thể dùng chung <code>NX</code> với <code>GET</code>'),
            B('<code>(nil)</code>, then <code>"v1"</code>, then <code>"v1"</code>', '<code>(nil)</code>, rồi <code>"v1"</code>, rồi <code>"v1"</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Verified by running it. The <code>GET</code> option (added in 6.2) makes <code>SET</code> return the <b>old</b> value instead of a status, and it composes with <code>NX</code>. First call: no old value, so <code>(nil)</code> — and the write succeeds. Second call: <code>NX</code> refuses because the key now exists, so nothing is written, but <code>GET</code> still reports what is there — <code>"v1"</code>. So the final <code>GET</code> is <code>"v1"</code>, not <code>"v2"</code>. This is a genuinely useful pair: one round trip that tells you both whether you won the race and what the current value is, which is exactly what a "claim this or tell me who holds it" lock wants. Option 2 makes the classic mistake of assuming a reply means the write happened.',
            'Đã chạy thật. Tuỳ chọn <code>GET</code> (có từ 6.2) khiến <code>SET</code> trả về giá trị <b>CŨ</b> thay vì một dòng trạng thái, và nó ghép được với <code>NX</code>. Lời gọi thứ nhất: chưa có giá trị cũ nên trả <code>(nil)</code> — và phép ghi thành công. Lời gọi thứ hai: <code>NX</code> từ chối vì khoá đã tồn tại, nên không ghi gì, nhưng <code>GET</code> vẫn báo cái đang có — <code>"v1"</code>. Vậy nên lệnh <code>GET</code> cuối cùng ra <code>"v1"</code>, không phải <code>"v2"</code>. Đây là một cặp thật sự hữu dụng: một lượt đi về cho bạn biết cả chuyện bạn có thắng cuộc đua hay không lẫn giá trị hiện tại là gì — đúng thứ mà một cái khoá kiểu "giành lấy hoặc cho tôi biết ai đang giữ" cần. Phương án 2 mắc đúng lỗi kinh điển: tưởng có kết quả trả về nghĩa là phép ghi đã xảy ra.',
          ),
        }),

        mcq({
          prompt: B(
            'A colleague tracks daily active users in a bitmap and, to support a new partner whose user IDs are large, runs <code>SETBIT active:2026-09-08 4000000000 1</code>. What happens?',
            'Một đồng nghiệp theo dõi người dùng hoạt động hằng ngày bằng bitmap và, để đỡ một đối tác mới có ID người dùng rất lớn, chạy <code>SETBIT active:2026-09-08 4000000000 1</code>. Chuyện gì xảy ra?',
          ),
          options: [
            B('Nothing costly — a bitmap is sparse, so only the one set bit is stored', 'Chẳng tốn gì — bitmap là thưa, nên chỉ một bit được bật là được lưu'),
            B('The command is rejected because bitmap offsets are capped at 2^32 − 1', 'Lệnh bị từ chối vì độ lệch của bitmap bị giới hạn ở 2^32 − 1'),
            B('The key grows to about 4 million bytes, one per thousand offsets', 'Khoá phình lên khoảng 4 triệu byte, mỗi nghìn độ lệch một byte'),
            B('Redis allocates a 500 MB string in one blocking operation', 'Redis cấp phát một chuỗi 500 MB trong MỘT thao tác chặn'),
          ],
          correct: 3,
          explanation: EX(
            'A Redis bitmap is just a string, and bit N lives in byte ⌊N/8⌋, so writing bit 4,000,000,000 requires the string to be 500,000,000 bytes long — allocated and zero-filled in a single command, on the one thread. That is a multi-hundred-millisecond stall and half a gigabyte of memory for one user. The rule to carry away: <b>bitmaps are only economical for dense, small, contiguous integer IDs</b>. A million dense users cost 125 KB against 42 MB for a set — a factor of 335 — but the moment IDs become sparse, or are UUIDs, or come from a partner&#x27;s numbering scheme, the model collapses. Map external IDs onto your own dense sequence, or use a set or HyperLogLog instead.',
            'Một bitmap của Redis chỉ là một chuỗi, và bit thứ N nằm trong byte thứ ⌊N/8⌋, nên ghi bit thứ 4.000.000.000 buộc chuỗi phải dài 500.000.000 byte — được cấp phát và điền số không trong MỘT câu lệnh, trên đúng cái luồng duy nhất. Đó là một cú đứng hình hàng trăm mili giây và nửa gigabyte bộ nhớ cho một người dùng. Quy tắc cần nhớ: <b>bitmap chỉ kinh tế với những ID nguyên dày, nhỏ và liền mạch</b>. Một triệu người dùng dày tốn 125 KB so với 42 MB nếu dùng set — gấp 335 lần — nhưng ngay khi ID trở nên thưa, hoặc là UUID, hoặc đến từ hệ đánh số của một đối tác, thì mô hình sụp đổ. Hãy ánh xạ ID bên ngoài vào một dãy dày của riêng bạn, hoặc dùng set hay HyperLogLog thay thế.',
          ),
        }),

        mcq({
          prompt: B(
            'A thousand distinct visitor IDs were added with <code>PFADD</code>; <code>PFCOUNT</code> returned <code>992</code>. Which statement about this structure is correct?',
            'Một nghìn ID khách khác nhau được thêm bằng <code>PFADD</code>; <code>PFCOUNT</code> trả về <code>992</code>. Phát biểu nào về cấu trúc này là đúng?',
          ),
          options: [
            B('The count will converge to the exact value once the sparse encoding is promoted to dense', 'Con số sẽ hội tụ về giá trị đúng khi bản mã hoá thưa được nâng lên bản dày'),
            B('It costs about 12 KB no matter how many uniques it holds, with roughly 0.81% standard error, and it can never tell you whether a specific ID is in it', 'Nó tốn khoảng 12 KB bất kể chứa bao nhiêu giá trị khác nhau, sai số chuẩn khoảng 0,81%, và nó không bao giờ cho bạn biết một ID cụ thể có nằm trong đó hay không'),
            B('The 8 missing IDs can be recovered with <code>PFDEBUG GETREG</code> and re-added', 'Tám ID bị thiếu có thể lấy lại bằng <code>PFDEBUG GETREG</code> rồi thêm lại'),
            B('The error is random, so running the same <code>PFCOUNT</code> again may return 1004', 'Sai số là ngẫu nhiên, nên chạy lại đúng lệnh <code>PFCOUNT</code> ấy có thể ra 1004'),
          ],
          correct: 1,
          explanation: EX(
            'A HyperLogLog is 16,384 six-bit registers — about 12 KB when dense — and it estimates cardinality from the longest run of leading zeros it has seen. Its standard error is ~0.81%, and 992 against 1000 is 0.8% low, exactly in range. Two limits decide whether you may use it: <b>there is no membership test</b> (no <code>PFISMEMBER</code>, and there never will be, because individual items are not stored) and <b>nothing can be removed</b>. So it is right for "unique visitors this month" and wrong for anything a human will compare against an enumerable list. Option 4 is a common misreading: the estimate is <b>deterministic</b> — the same set of items always yields the same number. Approximate does not mean random.',
            'Một HyperLogLog là 16.384 thanh ghi sáu bit — khoảng 12 KB khi ở dạng dày — và nó ước lượng lực lượng từ chuỗi số 0 dẫn đầu dài nhất nó từng thấy. Sai số chuẩn khoảng 0,81%, và 992 so với 1000 là thấp 0,8%, đúng trong khoảng. Hai giới hạn quyết định bạn có được dùng nó hay không: <b>không có phép kiểm thành viên</b> (không có <code>PFISMEMBER</code>, và sẽ không bao giờ có, vì từng phần tử không hề được lưu) và <b>không xoá được gì</b>. Nên nó đúng cho "số khách khác nhau trong tháng" và sai cho bất cứ thứ gì một con người sẽ đem đối chiếu với một danh sách đếm được. Phương án 4 là một cách hiểu sai phổ biến: ước lượng ấy <b>tất định</b> — cùng một tập phần tử luôn cho ra cùng một con số. Xấp xỉ không có nghĩa là ngẫu nhiên.',
          ),
        }),

        mcq({
          prompt: B(
            'A rate limiter allows 100 requests per minute. Under load with fifty concurrent workers it lets roughly 140 through. The code reads the counter, compares it to the limit, and increments if it is under. What is the fix?',
            'Một bộ giới hạn tần suất cho phép 100 yêu cầu mỗi phút. Dưới tải với năm mươi worker chạy song song, nó cho lọt khoảng 140. Mã hiện tại đọc bộ đếm, so với hạn mức, rồi tăng nếu còn dưới hạn. Sửa thế nào?',
          ),
          options: [
            B('Shorten the window to ten seconds so fewer requests can accumulate inside it', 'Rút cửa sổ xuống mười giây để ít yêu cầu tích lại bên trong nó hơn'),
            B('Wrap the read and the increment in <code>MULTI</code> … <code>EXEC</code>', 'Bọc phép đọc và phép tăng vào <code>MULTI</code> … <code>EXEC</code>'),
            B('Make the increment <i>be</i> the check: <code>INCR</code> first and compare the value it returns, or put the whole sequence in one Lua script', 'Biến phép tăng THÀNH phép kiểm: <code>INCR</code> trước rồi so chính giá trị nó trả về, hoặc đưa cả chuỗi thao tác vào một kịch bản Lua'),
            B('Add a distributed lock around the check so only one worker evaluates the limit at a time', 'Thêm một khoá phân tán quanh phép kiểm để mỗi lúc chỉ một worker xét hạn mức'),
          ],
          correct: 2,
          explanation: EX(
            'The bug is a read-then-write race: fifty workers can all read 99 in the same millisecond, all conclude they are allowed, and all increment. The elegant fix is to notice that <code>INCR</code> already returns the new value atomically, so incrementing <em>is</em> the check — <code>if (await redis.incr(key) &gt; limit) reject()</code> has no window at all, and over-counting a rejected request is harmless. Option 2 fails for a specific and important reason: <b><code>MULTI</code> cannot express a conditional</b>, because every command is queued before any of them runs, so there is no point at which your code can see the count and decide. Option 4 works but is a lock where an atomic command was available — chapter 7&#x27;s first rule. Option 1 makes the burst smaller, not the race rarer.',
            'Con bug là một cuộc đua đọc-rồi-ghi: năm mươi worker có thể cùng đọc ra 99 trong cùng một mili giây, cùng kết luận là được phép, và cùng tăng lên. Cách sửa đẹp là nhận ra rằng <code>INCR</code> vốn đã trả về giá trị mới một cách nguyên tử, nên phép tăng CHÍNH LÀ phép kiểm — <code>if (await redis.incr(key) &gt; limit) reject()</code> không có cửa sổ nào cả, và việc đếm dư một yêu cầu đã bị từ chối thì vô hại. Phương án 2 hỏng vì một lý do cụ thể và quan trọng: <b><code>MULTI</code> không diễn đạt được một điều kiện</b>, bởi mọi lệnh đều bị xếp hàng trước khi có lệnh nào chạy, nên không có thời điểm nào để mã của bạn nhìn thấy con số rồi quyết định. Phương án 4 chạy được nhưng là dùng khoá ở chỗ đã có sẵn một lệnh nguyên tử — đúng điều luật đầu tiên của chương 7. Phương án 1 làm đợt dồn nhỏ đi, chứ không làm cuộc đua hiếm đi.',
          ),
        }),

        // ── Chương 4 — List, Set và Sorted Set ──────────────────────────
        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. What does <code>ZREVRANGE</code> print?' + code(
              '> ZADD board 10 alice 10 bob 5 carol 10 aaron\n' +
              '(integer) 4\n' +
              '> ZREVRANGE board 0 -1\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9. Lệnh <code>ZREVRANGE</code> in ra gì?' + code(
              '> ZADD board 10 alice 10 bob 5 carol 10 aaron\n' +
              '(integer) 4\n' +
              '> ZREVRANGE board 0 -1\n' +
              '?',
            ),
          ),
          options: [
            B('<code>bob</code>, <code>alice</code>, <code>aaron</code>, <code>carol</code>', '<code>bob</code>, <code>alice</code>, <code>aaron</code>, <code>carol</code>'),
            B('<code>aaron</code>, <code>alice</code>, <code>bob</code>, <code>carol</code> — score descending, then name ascending', '<code>aaron</code>, <code>alice</code>, <code>bob</code>, <code>carol</code> — điểm giảm dần, rồi tên tăng dần'),
            B('<code>alice</code>, <code>bob</code>, <code>aaron</code>, <code>carol</code> — ties keep insertion order, reversed', '<code>alice</code>, <code>bob</code>, <code>aaron</code>, <code>carol</code> — chỗ bằng điểm giữ thứ tự chèn, đảo ngược lại'),
            B('The order among the three 10s is unspecified and may differ between calls', 'Thứ tự giữa ba thành viên 10 điểm là không xác định và có thể khác nhau giữa các lần gọi'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. A sorted set is ordered by the pair <b>(score, member)</b>: score ascending, and members with equal scores compared byte for byte, also ascending. So the forward order is <code>carol(5), aaron(10), alice(10), bob(10)</code>, and <code>ZREVRANGE</code> <b>reverses that whole list</b> — which is why <code>bob</code> comes first and <code>carol</code> last. Option 2 is the trap: "descending by score but still ascending by name" is not a thing; reversal applies to the complete ordering. The practical consequence is that a leaderboard with many tied scores is ranked alphabetically, backwards, which is rarely what a product wants — the fix is to fold a tiebreaker into the score itself, such as <code>score * 10^10 + (10^10 - timestamp)</code>, staying inside the 2^53 budget a double can represent exactly.',
            'Đã kiểm bằng cách chạy thật. Một sorted set sắp theo cặp <b>(điểm, tên)</b>: điểm tăng dần, và những thành viên cùng điểm thì so từng byte của tên, cũng tăng dần. Vậy thứ tự xuôi là <code>carol(5), aaron(10), alice(10), bob(10)</code>, và <code>ZREVRANGE</code> <b>đảo ngược NGUYÊN danh sách ấy</b> — nên <code>bob</code> đứng đầu còn <code>carol</code> đứng cuối. Phương án 2 là cái bẫy: "điểm giảm dần nhưng tên vẫn tăng dần" không tồn tại; phép đảo áp lên toàn bộ thứ tự. Hệ quả thực tế là một bảng xếp hạng có nhiều điểm bằng nhau sẽ được xếp theo bảng chữ cái, theo chiều ngược — hiếm khi là thứ sản phẩm muốn. Cách sửa là gói luôn một tiêu chí phụ vào chính điểm số, chẳng hạn <code>score * 10^10 + (10^10 - timestamp)</code>, và giữ trong ngưỡng 2^53 mà một số double biểu diễn chính xác được.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. What does the last line print?' + code(
              '> SADD A 1 2 3\n' +
              '(integer) 3\n' +
              '> SADD A 1 2 9\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9. Dòng cuối in ra gì?' + code(
              '> SADD A 1 2 3\n' +
              '(integer) 3\n' +
              '> SADD A 1 2 9\n' +
              '?',
            ),
          ),
          options: [
            B('<code>(integer) 3</code> — the number of arguments accepted', '<code>(integer) 3</code> — số đối số được nhận'),
            B('<code>(integer) 4</code> — the new cardinality of the set', '<code>(integer) 4</code> — lực lượng mới của tập hợp'),
            B('<code>(integer) 1</code>', '<code>(integer) 1</code>'),
            B('<code>(integer) 0</code> — the set already existed, so nothing counts as added', '<code>(integer) 0</code> — tập hợp đã tồn tại nên không có gì được tính là thêm mới'),
          ],
          correct: 2,
          explanation: EX(
            'Verified by running it. <code>SADD</code> returns <b>how many members were actually new</b>, so <code>1</code> and <code>2</code> contribute nothing and only <code>9</code> counts. That return value is more useful than it looks: it is a free deduplication check, and the idiom <code>if (await redis.sadd(&#x27;seen:webhooks&#x27;, eventId)) process(event)</code> gives you exactly-once processing in one round trip with no lock. The matching warning from the chapter is that this set is bounded only by time — <code>seen:*</code> accumulating every event ID ever seen is how instances reach fifty million members. Prefer per-event keys with a TTL, <code>SET seen:evt_8f2a 1 NX EX 604800</code>, which is the same idempotency check with an expiry attached.',
            'Đã kiểm bằng cách chạy thật. <code>SADD</code> trả về <b>bao nhiêu thành viên thật sự là mới</b>, nên <code>1</code> và <code>2</code> không đóng góp gì, chỉ <code>9</code> được tính. Giá trị trả về ấy hữu dụng hơn vẻ ngoài của nó: đó là một phép khử trùng miễn phí, và thành ngữ <code>if (await redis.sadd(&#x27;seen:webhooks&#x27;, eventId)) process(event)</code> cho bạn xử-lý-đúng-một-lần trong một lượt đi về mà không cần khoá. Lời cảnh báo đi kèm của chương là cái tập ấy chỉ bị giới hạn bởi thời gian — một khoá <code>seen:*</code> gom mọi ID sự kiện từng thấy chính là cách các máy chủ chạm mốc năm mươi triệu thành viên. Hãy ưu tiên khoá riêng cho từng sự kiện kèm TTL, <code>SET seen:evt_8f2a 1 NX EX 604800</code>, vẫn là phép kiểm trùng ấy nhưng có gắn hạn.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, where <code>A</code> and <code>B</code> have no members in common and <code>D</code> already holds a string. Fill in the two replies.' + code(
              '> SET D keepme\n' +
              'OK\n' +
              '> SINTERSTORE D A B\n' +
              '?\n' +
              '> EXISTS D\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9, với <code>A</code> và <code>B</code> không có thành viên chung, còn <code>D</code> đang giữ một chuỗi. Điền hai kết quả.' + code(
              '> SET D keepme\n' +
              'OK\n' +
              '> SINTERSTORE D A B\n' +
              '?\n' +
              '> EXISTS D\n' +
              '?',
            ),
          ),
          options: [
            B('<code>0</code> then <code>1</code> — <code>D</code> is replaced by an empty set', '<code>0</code> rồi <code>1</code> — <code>D</code> bị thay bằng một tập rỗng'),
            B('<code>0</code> then <code>1</code> — an empty result leaves the destination untouched, so <code>"keepme"</code> survives', '<code>0</code> rồi <code>1</code> — kết quả rỗng thì để nguyên khoá đích, nên <code>"keepme"</code> còn nguyên'),
            B('<code>(error) WRONGTYPE</code> — the destination holds a string', '<code>(error) WRONGTYPE</code> — khoá đích đang giữ một chuỗi'),
            B('<code>0</code> then <code>0</code>', '<code>0</code> rồi <code>0</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Verified by running it, and it surprises most people. The <code>…STORE</code> commands overwrite the destination whatever its previous type was — so no <code>WRONGTYPE</code> — and because <b>an empty set cannot exist in Redis</b>, storing an empty result <b>deletes the destination key</b>. <code>"keepme"</code> is gone. Two lessons: never point a <code>…STORE</code> at a key you still need, and remember the general rule behind it — a collection that loses its last element loses its key, which is equally true of <code>ZREM</code>, <code>SREM</code>, <code>HDEL</code> and <code>LPOP</code>. The other thing worth knowing about <code>…STORE</code> destinations is that they carry <b>no TTL</b>, so a nightly aggregation job that forgets to expire its output is a slow memory leak.',
            'Đã kiểm bằng cách chạy thật, và nó làm hầu hết mọi người bất ngờ. Các lệnh <code>…STORE</code> ghi đè khoá đích bất kể trước đó nó thuộc kiểu gì — nên không có <code>WRONGTYPE</code> — và bởi <b>một tập rỗng không thể tồn tại trong Redis</b>, việc cất một kết quả rỗng sẽ <b>XOÁ LUÔN khoá đích</b>. <code>"keepme"</code> biến mất. Hai bài học: đừng bao giờ trỏ một lệnh <code>…STORE</code> vào một khoá bạn còn cần, và nhớ cái quy tắc chung đứng sau nó — một collection mất phần tử cuối cùng thì mất luôn khoá, điều này đúng y hệt với <code>ZREM</code>, <code>SREM</code>, <code>HDEL</code> và <code>LPOP</code>. Thứ nữa đáng biết về khoá đích của <code>…STORE</code> là chúng <b>không có TTL</b>, nên một job tổng hợp chạy đêm mà quên đặt hạn cho kết quả chính là một chỗ rò bộ nhớ chậm rãi.',
          ),
        }),

        mcq({
          prompt: B(
            'A leaderboard must only ever record a player&#x27;s best score, never a worse one. Two workers may submit for the same player at the same moment. Which single command does it, and why is it better than read-compare-write?',
            'Một bảng xếp hạng chỉ được ghi nhận điểm CAO NHẤT của người chơi, không bao giờ ghi điểm thấp hơn. Hai worker có thể nộp cho cùng một người chơi trong cùng một khoảnh khắc. Lệnh đơn nào làm được, và vì sao nó hơn cách đọc-so-ghi?',
          ),
          options: [
            B('<code>ZADD board GT score member</code> — the comparison happens inside the server, so two concurrent submissions cannot both read the old score and both win', '<code>ZADD board GT score member</code> — phép so sánh xảy ra bên trong máy chủ, nên hai lượt nộp đồng thời không thể cùng đọc điểm cũ rồi cùng thắng'),
            B('<code>ZADD board NX score member</code> — <code>NX</code> refuses to lower an existing score', '<code>ZADD board NX score member</code> — <code>NX</code> từ chối hạ điểm của một thành viên đã có'),
            B('<code>ZINCRBY board score member</code> — incrementing can only ever move the score up', '<code>ZINCRBY board score member</code> — phép cộng dồn chỉ có thể đẩy điểm đi lên'),
            B('<code>ZADD board CH score member</code> — <code>CH</code> makes the write conditional on a change', '<code>ZADD board CH score member</code> — <code>CH</code> làm phép ghi trở thành có điều kiện'),
          ],
          correct: 0,
          explanation: EX(
            '<code>GT</code> (6.2+) tells the server "update only if the new score is greater than the current one", which removes the client-side read entirely — and with it the window where two workers both read 400, both decide they are higher, and the lower one lands last. Measured on 7.4.9: with <code>alice</code> at 10, <code>ZADD board GT CH 3 alice</code> returns <code>0</code> and leaves the score at 10, while <code>ZADD board GT CH 30 alice</code> returns <code>1</code> and sets 30. Option 2 is wrong because <code>NX</code> refuses to touch an existing member at <em>any</em> score, so a player&#x27;s first submission would be their only one. Option 3 sums submissions instead of taking the maximum. Option 4 only changes what the return value counts; it makes no write conditional.',
            'Cờ <code>GT</code> (từ 6.2) bảo máy chủ "chỉ cập nhật nếu điểm mới lớn hơn điểm hiện tại", nhờ đó bỏ hẳn phép đọc phía client — và bỏ theo luôn cái cửa sổ nơi hai worker cùng đọc ra 400, cùng kết luận mình cao hơn, rồi cái thấp hơn lại ghi sau cùng. Đo thật trên 7.4.9: với <code>alice</code> đang 10 điểm, <code>ZADD board GT CH 3 alice</code> trả về <code>0</code> và giữ nguyên 10, còn <code>ZADD board GT CH 30 alice</code> trả về <code>1</code> và đặt 30. Phương án 2 sai vì <code>NX</code> từ chối đụng vào một thành viên đã có ở <em>bất kỳ</em> mức điểm nào, nên lượt nộp đầu tiên của người chơi sẽ là lượt duy nhất. Phương án 3 cộng dồn các lượt nộp thay vì lấy giá trị lớn nhất. Phương án 4 chỉ đổi cách đếm của giá trị trả về; nó không làm phép ghi nào có điều kiện cả.',
          ),
        }),

        mcq({
          prompt: B(
            'The same 50,000 members were stored three ways and measured: list 568,424 bytes, set 2,884,152 bytes, sorted set 5,320,248 bytes. In staging with 80 members all three looked identical. Why?',
            'Cùng 50.000 thành viên được lưu theo ba cách và đem đo: list 568.424 byte, set 2.884.152 byte, sorted set 5.320.248 byte. Trên môi trường thử với 80 thành viên thì cả ba trông y hệt nhau. Vì sao?',
          ),
          options: [
            B('Staging had a smaller <code>maxmemory</code>, so Redis compressed the values', 'Môi trường thử có <code>maxmemory</code> nhỏ hơn nên Redis đã nén các giá trị lại'),
            B('Below the listpack thresholds all three are one flat listpack; each converts to its real structure only after crossing a limit', 'Dưới ngưỡng listpack thì cả ba đều là một listpack phẳng; mỗi loại chỉ chuyển sang cấu trúc thật sau khi vượt một ngưỡng'),
            B('<code>MEMORY USAGE</code> samples nested values, so small collections are reported inaccurately', '<code>MEMORY USAGE</code> lấy mẫu các giá trị lồng nhau, nên collection nhỏ bị báo sai'),
            B('Sorted sets only allocate their skip list when a range query is first issued against them', 'Sorted set chỉ cấp phát skip list của nó khi lần đầu có một truy vấn theo khoảng chạy trên nó'),
          ],
          correct: 1,
          explanation: EX(
            'This is why "it was fine in staging" is such a common sentence. Under <code>list-max-listpack-size</code>, <code>set-max-listpack-entries</code> (128) / <code>set-max-intset-entries</code> (512) and <code>zset-max-listpack-entries</code> (128) — and with every value under 64 bytes — all three types are a compact contiguous listpack costing roughly the size of your data. Cross either kind of threshold and the collection is rebuilt into its real structure, at roughly 11, 58 and 106 bytes per element respectively: a ratio near <b>1 : 5 : 9</b>. Two details carry the marks in practice: <b>the conversion is one-way</b> — delete back down to three members and it stays a hashtable — and the fix is never to raise the thresholds to 10,000, which trades a memory problem you can see for a latency problem you cannot.',
            'Đây chính là lý do câu "trên môi trường thử vẫn ổn mà" phổ biến đến thế. Dưới các ngưỡng <code>list-max-listpack-size</code>, <code>set-max-listpack-entries</code> (128) / <code>set-max-intset-entries</code> (512) và <code>zset-max-listpack-entries</code> (128) — và mọi giá trị đều dưới 64 byte — cả ba kiểu đều là một listpack liền mạch gọn gàng, tốn xấp xỉ đúng kích thước dữ liệu của bạn. Vượt bất kỳ ngưỡng nào thì collection được dựng lại thành cấu trúc thật, tốn khoảng 11, 58 và 106 byte mỗi phần tử — tỉ lệ gần <b>1 : 5 : 9</b>. Hai chi tiết ăn điểm trong thực tế: <b>phép chuyển đổi là một chiều</b> — xoá xuống còn ba thành viên thì nó vẫn là hashtable — và cách sửa không bao giờ là nâng ngưỡng lên 10.000, bởi làm thế là đánh đổi một vấn đề bộ nhớ nhìn thấy được lấy một vấn đề độ trễ không nhìn thấy được.',
          ),
        }),

        // ── Chương 5 — Hash và mô hình hoá đối tượng ────────────────────
        mcq({
          prompt: B(
            'A hash holds exactly one field whose value is a 100-byte string. <code>OBJECT ENCODING</code> reports <code>hashtable</code>, not <code>listpack</code>. Why?',
            'Một hash chỉ có đúng một trường, giá trị của nó là chuỗi dài 100 byte. <code>OBJECT ENCODING</code> báo <code>hashtable</code> chứ không phải <code>listpack</code>. Vì sao?',
          ),
          options: [
            B('Because <code>HSET</code> always creates a hashtable and only a rewrite can compact it', 'Vì <code>HSET</code> luôn tạo ra hashtable, và chỉ một lần ghi lại mới nén nó xuống được'),
            B('Because <b>either</b> threshold flips it, and the value exceeds <code>hash-max-listpack-value</code> (64 bytes)', 'Vì <b>một trong hai</b> ngưỡng đủ để lật nó, và giá trị này vượt <code>hash-max-listpack-value</code> (64 byte)'),
            B('Because a listpack can only hold integer values', 'Vì listpack chỉ chứa được giá trị kiểu số nguyên'),
            B('Because the hash was created before <code>hash-max-listpack-entries</code> was configured', 'Vì cái hash này được tạo trước khi <code>hash-max-listpack-entries</code> được cấu hình'),
          ],
          correct: 1,
          explanation: EX(
            'There are two thresholds and they are an OR, not an AND: <code>hash-max-listpack-entries</code> (128 fields) and <code>hash-max-listpack-value</code> (64 bytes for any single value). Crossing either one rebuilds the hash as a hashtable, and — as everywhere else in Redis — <b>the conversion never reverses</b>: shorten the value back to 10 bytes and the encoding stays <code>hashtable</code>. The cost is real, roughly 60 to 100 bytes of overhead per field before your data, which is why the same 1,000,000 objects cost 89 MB as top-level keys and 26 MB bucketed 100-per-hash. It is also why <code>OBJECT ENCODING</code> is the fastest memory diagnosis you have: one command tells you whether a key is paying the compact price or the dictionary price.',
            'Có hai ngưỡng và chúng là quan hệ HOẶC, không phải VÀ: <code>hash-max-listpack-entries</code> (128 trường) và <code>hash-max-listpack-value</code> (64 byte cho bất kỳ một giá trị nào). Vượt một trong hai là cái hash được dựng lại thành hashtable, và — như mọi chỗ khác trong Redis — <b>phép chuyển đổi không bao giờ đảo ngược</b>: rút giá trị xuống còn 10 byte thì cách mã hoá vẫn là <code>hashtable</code>. Cái giá là thật, khoảng 60 đến 100 byte phụ trội cho mỗi trường trước cả phần dữ liệu của bạn, và đó là lý do cùng 1.000.000 đối tượng tốn 89 MB khi làm khoá cấp cao nhất và chỉ 26 MB khi gom 100 cái vào một hash. Nó cũng là lý do <code>OBJECT ENCODING</code> là phép chẩn đoán bộ nhớ nhanh nhất bạn có: một câu lệnh cho biết một khoá đang trả giá gọn hay giá từ điển.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, where <code>u</code> already has fields <code>name</code> and <code>age</code>. What does the last line print?' + code(
              '> HSET u age 31 city HN\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9, với <code>u</code> đã có sẵn hai trường <code>name</code> và <code>age</code>. Dòng cuối in ra gì?' + code(
              '> HSET u age 31 city HN\n' +
              '?',
            ),
          ),
          options: [
            B('<code>(integer) 1</code>', '<code>(integer) 1</code>'),
            B('<code>(integer) 2</code> — both field-value pairs were written', '<code>(integer) 2</code> — cả hai cặp trường-giá trị đều đã được ghi'),
            B('<code>(integer) 3</code> — the resulting number of fields in the hash', '<code>(integer) 3</code> — số trường của hash sau lệnh này'),
            B('<code>OK</code> — <code>HSET</code> returns a status, like <code>SET</code>', '<code>OK</code> — <code>HSET</code> trả về một dòng trạng thái, giống <code>SET</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. <code>HSET</code> returns <b>the number of fields that did not exist before</b>, so updating <code>age</code> counts for nothing and only the new <code>city</code> is counted: 1. Both writes did happen — the return value is a report on novelty, not on success, exactly like <code>SADD</code>. That distinction matters when the return value is used as a decision: <code>HSETNX</code> is the command that actually refuses to overwrite. And the deeper reason to reach for a hash here rather than a serialised JSON string is in this very command — two requests changing two different fields both succeed, whereas read-modify-write on a JSON blob silently loses one of the two changes.',
            'Đã kiểm bằng cách chạy thật. <code>HSET</code> trả về <b>số trường trước đó chưa tồn tại</b>, nên việc cập nhật <code>age</code> không được tính, chỉ trường mới <code>city</code> được đếm: 1. Cả hai phép ghi đều đã xảy ra — giá trị trả về là báo cáo về tính MỚI, không phải về thành công, y hệt <code>SADD</code>. Sự phân biệt ấy quan trọng khi giá trị trả về được dùng để ra quyết định: <code>HSETNX</code> mới là lệnh thật sự từ chối ghi đè. Và lý do sâu hơn để chọn hash ở đây thay vì một chuỗi JSON đã tuần tự hoá nằm ngay trong câu lệnh này: hai yêu cầu sửa hai trường khác nhau đều thành công, trong khi đọc-sửa-ghi trên một khối JSON sẽ âm thầm đánh mất một trong hai thay đổi.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. <code>HEXPIRE</code> was applied to <code>name</code> only. What do the last two lines print?' + code(
              '> HEXPIRE u 100 FIELDS 1 name\n' +
              '1) (integer) 1\n' +
              '> HTTL u FIELDS 1 age\n' +
              '?\n' +
              '> HTTL u FIELDS 1 zzz\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9. <code>HEXPIRE</code> chỉ được áp cho trường <code>name</code>. Hai dòng cuối in ra gì?' + code(
              '> HEXPIRE u 100 FIELDS 1 name\n' +
              '1) (integer) 1\n' +
              '> HTTL u FIELDS 1 age\n' +
              '?\n' +
              '> HTTL u FIELDS 1 zzz\n' +
              '?',
            ),
          ),
          options: [
            B('<code>0</code> then <code>0</code> — neither field has a TTL', '<code>0</code> rồi <code>0</code> — cả hai trường đều không có TTL'),
            B('<code>-1</code> then <code>-1</code> — a missing field is reported the same way as a field with no TTL', '<code>-1</code> rồi <code>-1</code> — trường không tồn tại được báo giống hệt trường không có TTL'),
            B('<code>-1</code> then <code>(error) ERR no such field</code>', '<code>-1</code> rồi <code>(error) ERR no such field</code>'),
            B('<code>-1</code> then <code>-2</code>', '<code>-1</code> rồi <code>-2</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Verified by running it. The hash-field TTL family (7.4) mirrors the key-level codes exactly: a positive number is the seconds remaining, <b><code>-1</code> means the field exists with no TTL</b>, and <b><code>-2</code> means there is no such field</b>. The distinction between the two is the whole reason <code>HTTL</code> is useful — it is also a membership test. One asymmetry to remember: a missing <em>field</em> is a quiet <code>-2</code> inside the array, but a missing <em>key</em> is a hard <code>ERR no such key</code>. And before shipping any of these commands, check the server version: on 7.2 <code>HEXPIRE</code> is <code>ERR unknown command</code> at runtime, and because the <code>HSET</code> before it succeeded you are left with a field that lives forever and nothing that says so.',
            'Đã kiểm bằng cách chạy thật. Nhóm lệnh TTL theo trường của hash (bản 7.4) phản chiếu chính xác bộ mã ở cấp khoá: số dương là số giây còn lại, <b><code>-1</code> nghĩa là trường có tồn tại nhưng không có TTL</b>, và <b><code>-2</code> nghĩa là không có trường đó</b>. Chính sự phân biệt giữa hai giá trị ấy làm nên công dụng của <code>HTTL</code> — nó đồng thời là một phép kiểm tra thành viên. Một chỗ bất đối xứng cần nhớ: thiếu một <em>trường</em> chỉ là một con <code>-2</code> lặng lẽ trong mảng, nhưng thiếu cả <em>khoá</em> thì là lỗi cứng <code>ERR no such key</code>. Và trước khi đưa bất kỳ lệnh nào trong nhóm này lên chạy, hãy kiểm phiên bản máy chủ: trên 7.2, <code>HEXPIRE</code> trả <code>ERR unknown command</code> lúc chạy, mà vì lệnh <code>HSET</code> trước đó đã thành công, bạn còn lại một trường sống mãi mãi và không có gì báo cho biết.',
          ),
        }),

        mcq({
          prompt: B(
            'A feature flag is stored with <code>HSET config:app signupsOpen false</code> and read back with <code>if (flags.signupsOpen) { … }</code>. Signups stay open. Why?',
            'Một cờ tính năng được lưu bằng <code>HSET config:app signupsOpen false</code> rồi đọc lại bằng <code>if (flags.signupsOpen) { … }</code>. Đăng ký vẫn mở. Vì sao?',
          ),
          options: [
            B('<code>HGETALL</code> returns fields in an unspecified order, so the value was matched to the wrong field', '<code>HGETALL</code> trả về các trường theo thứ tự không xác định nên giá trị đã bị ghép nhầm trường'),
            B('The write silently failed because <code>false</code> is not a valid hash value', 'Phép ghi thất bại âm thầm vì <code>false</code> không phải một giá trị hash hợp lệ'),
            B('Redis stores only bytes, so the field comes back as the <b>string</b> <code>"false"</code>, which is truthy in JavaScript — the value must be coerced explicitly', 'Redis chỉ lưu byte, nên trường ấy trở về dưới dạng <b>chuỗi</b> <code>"false"</code>, mà chuỗi đó là truthy trong JavaScript — giá trị phải được ép kiểu tường minh'),
            B('The flag needed <code>HSETNX</code>; <code>HSET</code> does not overwrite an existing field', 'Cờ này cần dùng <code>HSETNX</code>; <code>HSET</code> không ghi đè một trường đã có'),
          ],
          correct: 2,
          explanation: EX(
            'Every hash value is a byte string, and <code>"false"</code>, <code>"0"</code> and <code>"null"</code> are all non-empty strings, therefore all truthy. Store <code>1</code> and <code>0</code> and coerce at the boundary — <code>signupsOpen: raw.signupsOpen === &#x27;1&#x27;</code> — with the default living in your code (<code>?? 25</code>), not in Redis. Two neighbouring traps in the same lesson: <b>an empty field exists</b> (<code>HEXISTS</code> returns 1) while reading as falsy, so "unset" and "set to empty" need different representations; and <code>HINCRBY</code> on a field holding <code>"true"</code> fails at runtime with <code>ERR hash value is not an integer</code>. Option 4 is wrong in a way worth naming: <code>HSET</code> overwrites happily — <code>HSETNX</code> is the one that refuses.',
            'Mọi giá trị trong hash đều là chuỗi byte, và <code>"false"</code>, <code>"0"</code> hay <code>"null"</code> đều là chuỗi khác rỗng, nên đều truthy. Hãy lưu <code>1</code> và <code>0</code> rồi ép kiểu tại biên — <code>signupsOpen: raw.signupsOpen === &#x27;1&#x27;</code> — và để giá trị mặc định nằm trong mã của bạn (<code>?? 25</code>), không nằm trong Redis. Hai cái bẫy hàng xóm trong cùng bài học: <b>một trường rỗng vẫn tồn tại</b> (<code>HEXISTS</code> trả 1) nhưng đọc ra lại falsy, nên "chưa đặt" và "đặt bằng rỗng" cần hai cách biểu diễn khác nhau; và <code>HINCRBY</code> trên một trường đang giữ <code>"true"</code> sẽ hỏng lúc chạy với <code>ERR hash value is not an integer</code>. Phương án 4 sai theo một kiểu đáng gọi tên: <code>HSET</code> ghi đè rất vui vẻ — <code>HSETNX</code> mới là lệnh từ chối.',
          ),
        }),

        // ── Chương 6 — Làm bộ đệm cho đúng ──────────────────────────────
        mcq({
          prompt: B(
            'Which ordering of the database write and the cache operation is correct, and why?',
            'Thứ tự nào giữa phép ghi cơ sở dữ liệu và thao tác bộ đệm là đúng, và vì sao?',
          ),
          options: [
            B('Commit the database transaction, <b>then delete</b> the cache key — deleting is idempotent and self-correcting, and the TTL is the backstop if the delete fails', 'Commit giao dịch cơ sở dữ liệu, <b>rồi XOÁ</b> khoá bộ đệm — phép xoá là luỹ đẳng và tự sửa được, còn TTL là lưới đỡ nếu phép xoá thất bại'),
            B('Delete the cache key first, then commit the database transaction, so no reader can see the old value', 'Xoá khoá bộ đệm trước, rồi mới commit giao dịch cơ sở dữ liệu, để không người đọc nào thấy được giá trị cũ'),
            B('Commit the database transaction, then <b>write the new value into</b> the cache, saving the next reader a database round trip', 'Commit giao dịch cơ sở dữ liệu, rồi <b>GHI giá trị mới vào</b> bộ đệm, tiết kiệm cho người đọc kế tiếp một lượt đi về cơ sở dữ liệu'),
            B('Wrap both in <code>MULTI</code> … <code>EXEC</code> so the cache and the database change together', 'Bọc cả hai vào <code>MULTI</code> … <code>EXEC</code> để bộ đệm và cơ sở dữ liệu đổi cùng nhau'),
          ],
          correct: 0,
          explanation: EX(
            'Delete rather than update, and commit before you delete. <b>Deleting is idempotent</b>: two concurrent writers deleting the same key both leave it absent, and the next reader repopulates from the committed truth. Option 3 is the lost-update race in cache form — writer A commits 1, writer B commits 2, B writes cache 2, A writes cache 1, and the cache serves 1 for a full TTL. Option 2 feels natural ("clear it first!") and is the one that reliably bites: between the delete and the commit a reader misses, reads the <em>old</em> row and writes it back with a fresh TTL. Option 4 misunderstands what a Redis transaction is: it makes Redis commands atomic with each other and knows nothing about your database. A narrow race survives even the correct ordering, and the honest answers are a short post-write TTL, a delayed second delete, or a version guard in Lua.',
            'Hãy XOÁ chứ đừng cập nhật, và commit trước rồi mới xoá. <b>Phép xoá là luỹ đẳng</b>: hai người ghi đồng thời cùng xoá một khoá thì đều để nó vắng mặt, và người đọc kế tiếp nạp lại từ sự thật đã commit. Phương án 3 chính là cuộc đua mất-cập-nhật ở dạng bộ đệm — người ghi A commit 1, người ghi B commit 2, B ghi bộ đệm 2, A ghi bộ đệm 1, và bộ đệm phục vụ giá trị 1 trong trọn một vòng TTL. Phương án 2 nghe rất tự nhiên ("dọn trước đã!") và lại đúng là phương án cắn người đều đặn nhất: giữa lúc xoá và lúc commit, một người đọc trượt bộ đệm, đọc ra hàng <em>cũ</em> rồi ghi ngược nó vào với một TTL mới toanh. Phương án 4 hiểu sai giao dịch của Redis là gì: nó làm các lệnh Redis nguyên tử VỚI NHAU và không biết gì về cơ sở dữ liệu của bạn. Vẫn còn một cuộc đua hẹp sống sót ngay cả với thứ tự đúng, và những câu trả lời thành thật là: đặt TTL ngắn sau khi ghi, xoá lần hai có trễ, hoặc một chốt kiểm phiên bản viết bằng Lua.',
          ),
        }),

        mcq({
          prompt: B(
            'One very popular product key expires, and 200 requests for it arrive in the same second. Every one of them misses and queries the database. TTL jitter is already in place. What actually fixes this?',
            'Một khoá sản phẩm rất hot hết hạn, và 200 yêu cầu cho đúng nó ập tới trong cùng một giây. Cả 200 đều trượt bộ đệm và đi truy vấn cơ sở dữ liệu. Nhiễu TTL thì đã có sẵn. Thứ gì mới thật sự sửa được chuyện này?',
          ),
          options: [
            B('More jitter — spreading the expiry over a wider window', 'Thêm nhiễu nữa — trải thời điểm hết hạn ra một cửa sổ rộng hơn'),
            B('A shorter TTL, so the key is refreshed before the traffic peak', 'Một TTL ngắn hơn, để khoá được làm mới trước khi lưu lượng lên đỉnh'),
            B('Raising <code>maxmemory</code> so the key is never evicted', 'Nâng <code>maxmemory</code> để khoá không bao giờ bị đẩy đi'),
            B('Single-flight: one miss takes <code>SET lock:key token NX EX 10</code> and recomputes; the rest wait and re-read', 'Gộp lượt: một lượt trượt giành <code>SET lock:key token NX EX 10</code> rồi tính lại; số còn lại chờ rồi đọc lại'),
          ],
          correct: 3,
          explanation: EX(
            'There are three different problems all called "stampede", and jitter only solves one of them. <b>Jitter fixes synchronised expiry of MANY keys</b> — the herd that appears because a thousand keys were all filled in the same second and all expire in the same second. It does nothing here, because there is only one key and its single expiry moment is exactly the problem. What removes 199 of the 200 database queries is <b>single-flight</b>: one requester wins a short lock and recomputes, the rest sleep briefly, re-read and fall through rather than hang. Option 2 makes it worse — a 10-second TTL on a hot key hits the database six times a minute forever; short TTLs make the herd more frequent, not smaller. Option 3 addresses eviction, which is a different cause with a different symptom (<code>evicted_keys</code> climbing).',
            'Có tới ba vấn đề khác nhau cùng mang tên "giẫm đạp", và nhiễu TTL chỉ giải quyết được một trong ba. <b>Nhiễu chữa được chuyện NHIỀU khoá cùng hết hạn một nhịp</b> — đám đông xuất hiện vì cả nghìn khoá được nạp trong cùng một giây rồi cùng hết hạn trong cùng một giây. Ở đây nó chẳng làm được gì, bởi chỉ có MỘT khoá và chính cái khoảnh khắc hết hạn duy nhất ấy mới là vấn đề. Thứ bỏ đi 199 trong 200 truy vấn là <b>gộp lượt</b>: một người giành được cái khoá ngắn hạn rồi đi tính lại, số còn lại ngủ một nhịp, đọc lại, và đi tiếp chứ không treo. Phương án 2 còn làm mọi thứ tệ hơn — một TTL 10 giây trên khoá hot nghĩa là đập vào cơ sở dữ liệu sáu lần mỗi phút, mãi mãi; TTL ngắn làm đàn đông kéo tới THƯỜNG XUYÊN hơn chứ không nhỏ đi. Phương án 3 nhắm vào chuyện đẩy khoá, vốn là nguyên nhân khác với triệu chứng khác (số <code>evicted_keys</code> tăng lên).',
          ),
        }),

        mcq({
          prompt: B(
            'Cache A serves a 0.4 ms query at a 99% hit ratio and one million hits a day. Cache B serves a 900 ms aggregate at a 60% hit ratio and 600,000 hits a day. Which is doing more for you?',
            'Bộ đệm A phục vụ một truy vấn 0,4 ms với tỉ lệ trúng 99% và một triệu lượt trúng mỗi ngày. Bộ đệm B phục vụ một phép tổng hợp 900 ms với tỉ lệ trúng 60% và 600.000 lượt trúng mỗi ngày. Cái nào đang làm được nhiều hơn cho bạn?',
          ),
          options: [
            B('Cache A — a 99% hit ratio is the healthier cache by any standard', 'Bộ đệm A — tỉ lệ trúng 99% là bộ đệm khoẻ hơn theo mọi tiêu chuẩn'),
            B('They are equivalent; hit ratio is the only comparable measure across caches', 'Hai cái tương đương; tỉ lệ trúng là thước đo duy nhất so sánh được giữa các bộ đệm'),
            B('Cache B — work avoided is hits × cost per miss, so B saves about 150 hours a day against A&#x27;s 400 seconds', 'Bộ đệm B — công sức tiết kiệm được bằng số lượt trúng nhân chi phí một lượt trượt, nên B tiết kiệm khoảng 150 giờ mỗi ngày so với 400 giây của A'),
            B('Cache A — B&#x27;s 40% miss rate means it is actively harming latency', 'Bộ đệm A — tỉ lệ trượt 40% của B nghĩa là nó đang làm hại độ trễ'),
          ],
          correct: 2,
          explanation: EX(
            'A ratio has no units, so it cannot tell you what a cache is worth. The number that can is <b>work avoided = hits × cost per miss</b>: A saves 1,000,000 × 0.4 ms ≈ 400 seconds a day, B saves 600,000 × 900 ms ≈ 150 hours a day. A is a rounding error with a beautiful dashboard; B is the reason the site is up. This is Goodhart&#x27;s law in miniature — the hit ratio is a denominator you control, and you can raise it by lengthening TTLs or by simply not caching rare things, neither of which helps a user. The two numbers worth alerting on instead are work avoided and the latency your users actually see; and if a miss rate does <em>not</em> fall as traffic rises, that is cache penetration, not a cold cache.',
            'Một tỉ lệ thì không có đơn vị, nên nó không cho bạn biết một bộ đệm đáng giá bao nhiêu. Con số làm được điều đó là <b>công sức tiết kiệm = số lượt trúng × chi phí một lượt trượt</b>: A tiết kiệm 1.000.000 × 0,4 ms ≈ 400 giây mỗi ngày, B tiết kiệm 600.000 × 900 ms ≈ 150 giờ mỗi ngày. A là một sai số làm tròn kèm một cái bảng điều khiển đẹp đẽ; B mới là lý do trang web còn sống. Đây là định luật Goodhart thu nhỏ — tỉ lệ trúng là một cái mẫu số do chính bạn điều khiển, và bạn có thể nâng nó bằng cách kéo dài TTL hoặc đơn giản là thôi đệm những thứ ít được hỏi, mà cả hai đều chẳng giúp gì cho người dùng. Hai con số đáng đặt cảnh báo thay vào đó là công sức tiết kiệm được và độ trễ mà người dùng thật sự cảm thấy; còn nếu tỉ lệ trượt KHÔNG giảm khi lưu lượng tăng thì đó là cache penetration, không phải một bộ đệm nguội.',
          ),
        }),

        mcq({
          prompt: B(
            'A product page cache shows a miss rate that stays flat at 40% no matter how much traffic grows. Most of the misses are for IDs that do not exist in the database. What is happening, and what is the fix?',
            'Bộ đệm trang sản phẩm có tỉ lệ trượt đứng yên ở 40% dù lưu lượng tăng bao nhiêu. Phần lớn các lượt trượt là cho những ID không hề tồn tại trong cơ sở dữ liệu. Chuyện gì đang xảy ra, và sửa thế nào?',
          ),
          options: [
            B('A cold cache that has not warmed up; increase the TTL and wait', 'Một bộ đệm nguội chưa kịp ấm lên; hãy tăng TTL rồi chờ'),
            B('Cache penetration — nothing ever caches "not found", so cache that answer too, as a short-TTL sentinel', 'Cache penetration — chẳng có gì đi đệm cái "không có", nên hãy đệm cả câu trả lời ấy bằng một chuỗi mốc TTL ngắn'),
            B('Eviction under memory pressure; raise <code>maxmemory</code>', 'Bị đẩy khoá do sức ép bộ nhớ; hãy nâng <code>maxmemory</code>'),
            B('A stampede caused by synchronised expiry; adding jitter to the TTLs will spread the herd out', 'Giẫm đạp do các khoá cùng hết hạn một nhịp; thêm nhiễu vào các TTL sẽ trải đám đông ra'),
          ],
          correct: 1,
          explanation: EX(
            'The diagnostic is in the shape of the curve: a miss rate that <b>falls</b> as traffic rises is a healthy cold start, a <b>flat</b> one means the working set exceeds memory or the TTLs are too short, and a miss rate that stays put or <b>rises</b> with traffic is penetration — requests for values that will never be cached because nothing ever caches "nothing". The fix is negative caching: <code>SET product:999999 "__null__" EX 30</code>, with a <b>short</b> TTL so a row that appears later is not hidden for long, and a <b>sentinel your code recognises</b> so an empty string is not confused with a missing key. For adversarial traffic across a huge ID space a Bloom filter in front is the next step. Option 3 has a different signature entirely — <code>evicted_keys</code> climbing in <code>INFO stats</code>.',
            'Dấu hiệu chẩn đoán nằm ở hình dáng đường cong: tỉ lệ trượt <b>giảm</b> khi lưu lượng tăng là một khởi động nguội lành mạnh, tỉ lệ trượt <b>phẳng</b> nghĩa là tập làm việc vượt quá bộ nhớ hoặc TTL quá ngắn, còn tỉ lệ trượt giữ nguyên hay <b>tăng</b> theo lưu lượng thì là penetration — những yêu cầu hỏi các giá trị sẽ không bao giờ được đệm, bởi chẳng có gì đi đệm cái "không có". Cách sửa là đệm phủ định: <code>SET product:999999 "__null__" EX 30</code>, với TTL <b>ngắn</b> để một hàng xuất hiện muộn không bị che quá lâu, và một <b>chuỗi mốc mà mã của bạn nhận ra được</b> để chuỗi rỗng không bị lẫn với khoá không tồn tại. Với lưu lượng có ý đồ xấu trải trên một không gian ID khổng lồ thì bước tiếp theo là đặt một Bloom filter phía trước. Phương án 3 có dấu hiệu hoàn toàn khác — số <code>evicted_keys</code> tăng lên trong <code>INFO stats</code>.',
          ),
        }),

        // ── Chương 7 — Tính nguyên tử ───────────────────────────────────
        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, where <code>str</code> holds <code>"hello"</code>. What are the values of <code>good</code>, <code>after</code> and <code>str</code> afterwards?' + code(
              '> MULTI\n' +
              'OK\n' +
              '> SET good 1\n' +
              'QUEUED\n' +
              '> INCR str\n' +
              'QUEUED\n' +
              '> SET after 2\n' +
              'QUEUED\n' +
              '> EXEC\n' +
              '1) OK\n' +
              '2) (error) ERR value is not an integer or out of range\n' +
              '3) OK',
            ),
            'Chạy thật trên Redis 7.4.9, với <code>str</code> đang giữ <code>"hello"</code>. Sau đoạn này, giá trị của <code>good</code>, <code>after</code> và <code>str</code> là gì?' + code(
              '> MULTI\n' +
              'OK\n' +
              '> SET good 1\n' +
              'QUEUED\n' +
              '> INCR str\n' +
              'QUEUED\n' +
              '> SET after 2\n' +
              'QUEUED\n' +
              '> EXEC\n' +
              '1) OK\n' +
              '2) (error) ERR value is not an integer or out of range\n' +
              '3) OK',
            ),
          ),
          options: [
            B('All three are unchanged — the error rolled the transaction back', 'Cả ba đều không đổi — lỗi đã làm giao dịch quay lui'),
            B('<code>good</code> is <code>1</code>, <code>after</code> does not exist, <code>str</code> is <code>"hello"</code> — execution stopped at the error', '<code>good</code> là <code>1</code>, <code>after</code> không tồn tại, <code>str</code> là <code>"hello"</code> — việc thực thi dừng ở chỗ lỗi'),
            B('<code>good</code> is <code>1</code>, <code>after</code> is <code>2</code>, <code>str</code> is <code>1</code>', '<code>good</code> là <code>1</code>, <code>after</code> là <code>2</code>, <code>str</code> là <code>1</code>'),
            B('<code>good</code> is <code>1</code>, <code>after</code> is <code>2</code>, <code>str</code> is still <code>"hello"</code>', '<code>good</code> là <code>1</code>, <code>after</code> là <code>2</code>, còn <code>str</code> vẫn là <code>"hello"</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Verified by running it. <b>Redis has no rollback — none, not partial, not optional.</b> A runtime error fails <em>that command</em> and every other queued command still runs, which is why <code>after</code> was written even though the command before it failed. The official position is that these are programming bugs to be caught in testing, not conditions to handle at runtime. What makes this dangerous in practice is the client library: many return the array and only throw on <code>EXECABORT</code>, so a runtime error at index 2 becomes an <code>Error</code> object sitting quietly inside the array your code is mapping over. <b>Check every element of the <code>EXEC</code> reply</b>, not just whether it threw.',
            'Đã kiểm bằng cách chạy thật. <b>Redis KHÔNG có quay lui — không hề, không quay lui một phần, cũng không phải tuỳ chọn.</b> Một lỗi lúc chạy làm hỏng <em>chính lệnh đó</em> còn mọi lệnh đã xếp hàng khác vẫn chạy, và đó là lý do <code>after</code> vẫn được ghi dù lệnh ngay trước nó đã hỏng. Quan điểm chính thức là những lỗi loại này là bug lập trình phải bắt lúc kiểm thử, chứ không phải tình huống để xử lý lúc chạy. Thứ làm nó nguy hiểm trong thực tế là thư viện client: nhiều thư viện trả về mảng kết quả và chỉ ném ngoại lệ khi gặp <code>EXECABORT</code>, nên một lỗi lúc chạy ở vị trí thứ hai biến thành một object <code>Error</code> nằm im lìm bên trong cái mảng mà mã của bạn đang duyệt. <b>Hãy kiểm TỪNG phần tử của kết quả <code>EXEC</code></b>, đừng chỉ xem nó có ném lỗi hay không.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. What does the final <code>GET a</code> return?' + code(
              '> MULTI\n' +
              'OK\n' +
              '> SET a 1\n' +
              'QUEUED\n' +
              "> NOSUCHCMD x\n" +
              "(error) ERR unknown command 'NOSUCHCMD', with args beginning with: 'x'\n" +
              '> EXEC\n' +
              '(error) EXECABORT Transaction discarded because of previous errors.\n' +
              '> GET a\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9. Lệnh <code>GET a</code> cuối cùng trả về gì?' + code(
              '> MULTI\n' +
              'OK\n' +
              '> SET a 1\n' +
              'QUEUED\n' +
              "> NOSUCHCMD x\n" +
              "(error) ERR unknown command 'NOSUCHCMD', with args beginning with: 'x'\n" +
              '> EXEC\n' +
              '(error) EXECABORT Transaction discarded because of previous errors.\n' +
              '> GET a\n' +
              '?',
            ),
          ),
          options: [
            B('<code>"1"</code> — the <code>SET</code> was queued successfully, so it ran', '<code>"1"</code> — lệnh <code>SET</code> đã xếp hàng thành công nên nó vẫn chạy'),
            B('<code>(error) EXECABORT</code> again, because the connection is still in <code>MULTI</code> state', 'Lại <code>(error) EXECABORT</code>, vì kết nối vẫn đang ở trạng thái <code>MULTI</code>'),
            B('<code>(nil)</code>', '<code>(nil)</code>'),
            B('<code>"x"</code>', '<code>"x"</code>'),
          ],
          correct: 2,
          explanation: EX(
            'Verified by running it. This is the <b>other</b> kind of transaction error, and it behaves in the opposite way to the runtime error in the previous question. An unknown command — or wrong arity, which since 7.0 is also checked at queue time — is detected while queuing, Redis flags the transaction, and <code>EXEC</code> refuses to run <b>anything</b>. Nothing was written, so <code>a</code> does not exist and <code>GET</code> returns <code>(nil)</code>. Worth holding the two side by side: a <b>queue-time</b> error is the safe failure — all or nothing — while a <b>runtime</b> error is the dangerous one, because the rest of the block still executes. The connection leaves <code>MULTI</code> state after <code>EXEC</code> regardless, which is why option 2 is wrong.',
            'Đã kiểm bằng cách chạy thật. Đây là loại lỗi giao dịch <b>còn lại</b>, và nó hành xử ngược hẳn với lỗi lúc chạy ở câu trước. Một lệnh không tồn tại — hoặc sai số lượng đối số, thứ mà từ bản 7.0 cũng được kiểm ngay lúc xếp hàng — bị phát hiện trong lúc xếp hàng, Redis đánh dấu giao dịch, và <code>EXEC</code> từ chối chạy <b>bất cứ thứ gì</b>. Không có gì được ghi, nên <code>a</code> không tồn tại và <code>GET</code> trả về <code>(nil)</code>. Đáng đặt hai thứ cạnh nhau mà nhớ: lỗi <b>lúc xếp hàng</b> là kiểu hỏng AN TOÀN — được tất cả hoặc không gì cả — còn lỗi <b>lúc chạy</b> mới là kiểu nguy hiểm, vì phần còn lại của khối vẫn thực thi. Kết nối rời khỏi trạng thái <code>MULTI</code> sau <code>EXEC</code> trong mọi trường hợp, nên phương án 2 sai.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9 against a key that does not exist. What are the three replies?' + code(
              '> EVAL "return 3.7" 0\n' +
              '?\n' +
              '> EVAL "return false" 0\n' +
              '?\n' +
              "> EVAL \"local v = redis.call('GET', KEYS[1]); if v == false then return 'MISSING' end return v\" 1 nokey\n" +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9 với một khoá không tồn tại. Ba kết quả là gì?' + code(
              '> EVAL "return 3.7" 0\n' +
              '?\n' +
              '> EVAL "return false" 0\n' +
              '?\n' +
              "> EVAL \"local v = redis.call('GET', KEYS[1]); if v == false then return 'MISSING' end return v\" 1 nokey\n" +
              '?',
            ),
          ),
          options: [
            B('<code>"3.7"</code>, <code>(integer) 0</code>, <code>(nil)</code>', '<code>"3.7"</code>, <code>(integer) 0</code>, <code>(nil)</code>'),
            B('<code>(integer) 3</code>, <code>(nil)</code>, <code>"MISSING"</code>', '<code>(integer) 3</code>, <code>(nil)</code>, <code>"MISSING"</code>'),
            B('<code>(integer) 4</code>, <code>(integer) 0</code>, <code>"MISSING"</code>', '<code>(integer) 4</code>, <code>(integer) 0</code>, <code>"MISSING"</code>'),
            B('<code>"3.7"</code>, <code>(nil)</code>, <code>(nil)</code>', '<code>"3.7"</code>, <code>(nil)</code>, <code>(nil)</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Verified by running all three. The Lua-to-Redis conversion rules are lossy in ways that bite: a Lua number is <b>truncated</b> to an integer (3.7 becomes 3 — not rounded, truncated, which is how a token-bucket script quietly turns 4.8 tokens into 4), Lua <code>false</code> becomes <b>nil</b> while <code>true</code> becomes <code>1</code>, and a table stops at the first <code>nil</code> element. The third line shows the mirror-image rule going the other way: <code>redis.call(&#x27;GET&#x27;, …)</code> on a missing key returns Lua <b><code>false</code></b>, not <code>nil</code> — which is why the idiom is <code>tonumber(redis.call(&#x27;GET&#x27;, k) or 0)</code>. The fix for the first line is <code>return tostring(3.7)</code>; if you need a boolean out of a script, return <code>1</code> or <code>0</code>.',
            'Đã chạy thật cả ba. Luật chuyển đổi Lua sang Redis mất mát theo những kiểu rất dễ cắn người: một số Lua bị <b>cắt cụt</b> thành số nguyên (3,7 thành 3 — không phải làm tròn, mà cắt cụt, và đó chính là cách một kịch bản token bucket âm thầm biến 4,8 token thành 4), <code>false</code> của Lua thành <b>nil</b> còn <code>true</code> thành <code>1</code>, và một bảng bị dừng ở phần tử <code>nil</code> đầu tiên. Dòng thứ ba cho thấy luật phản chiếu theo chiều ngược: <code>redis.call(&#x27;GET&#x27;, …)</code> trên một khoá không tồn tại trả về <b><code>false</code></b> của Lua chứ không phải <code>nil</code> — và đó là lý do thành ngữ luôn là <code>tonumber(redis.call(&#x27;GET&#x27;, k) or 0)</code>. Cách vá dòng đầu là <code>return tostring(3.7)</code>; còn nếu cần một giá trị đúng/sai từ kịch bản thì hãy trả <code>1</code> hoặc <code>0</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'This retry loop passes review and protects nothing under load. Which line is the bug?' + code(
              'const balance = Number(await redis.get(key));\n' +
              'await redis.watch(key);\n' +
              'if (balance < amount) { await redis.unwatch(); return false; }\n' +
              'const res = await redis.multi().decrby(key, amount).exec();\n' +
              'return res !== null;',
            ),
            'Vòng thử lại này qua được vòng review mà chẳng bảo vệ được gì dưới tải. Dòng nào là con bug?' + code(
              'const balance = Number(await redis.get(key));\n' +
              'await redis.watch(key);\n' +
              'if (balance < amount) { await redis.unwatch(); return false; }\n' +
              'const res = await redis.multi().decrby(key, amount).exec();\n' +
              'return res !== null;',
            ),
          ),
          options: [
            B('The <code>GET</code> happens <b>before</b> the <code>WATCH</code>, so a change in that window is never detected and <code>EXEC</code> happily commits a decision made on a stale value', 'Lệnh <code>GET</code> chạy <b>TRƯỚC</b> <code>WATCH</code>, nên một thay đổi rơi vào cửa sổ đó không bao giờ bị phát hiện, và <code>EXEC</code> vui vẻ commit một quyết định dựa trên giá trị đã cũ'),
            B('<code>UNWATCH</code> should not be called on the early-out path; <code>EXEC</code> would have cleared the watch anyway', 'Không nên gọi <code>UNWATCH</code> ở nhánh thoát sớm; đằng nào <code>EXEC</code> cũng đã xoá phép canh rồi'),
            B('<code>DECRBY</code> cannot be queued inside <code>MULTI</code> when the key is watched', 'Không thể xếp <code>DECRBY</code> vào trong <code>MULTI</code> khi khoá đang bị canh'),
            B('<code>res !== null</code> is wrong; an aborted <code>EXEC</code> returns an empty array', '<code>res !== null</code> là sai; một <code>EXEC</code> bị huỷ sẽ trả về mảng rỗng'),
          ],
          correct: 0,
          explanation: EX(
            '<code>WATCH</code> starts monitoring from the moment it is issued, so anything that happened between the read and the watch is invisible to it. Read first and watch afterwards and the loop looks textbook while behaving exactly like no protection at all — the rule is <b>WATCH before you read</b>. Option 2 is wrong and worth correcting: <code>UNWATCH</code> on the early-out path is <em>mandatory</em>, because a watch lives on the connection until <code>EXEC</code>, <code>DISCARD</code> or <code>UNWATCH</code>, and an abandoned one travels to whoever borrows that pooled connection next and makes their unrelated transaction fail for no visible reason. Option 4 has the two replies backwards: <b>nil means aborted, an empty array means it ran and nothing was queued</b> — treating "aborted" as "succeeded with no results" is a silent data-loss bug.',
            '<code>WATCH</code> bắt đầu theo dõi từ đúng khoảnh khắc nó được gửi, nên mọi chuyện xảy ra giữa lúc đọc và lúc canh đều vô hình với nó. Đọc trước rồi canh sau thì vòng lặp trông như sách giáo khoa mà hành xử y hệt như không có bảo vệ nào — luật là <b>WATCH TRƯỚC KHI đọc</b>. Phương án 2 sai và đáng được đính chính: gọi <code>UNWATCH</code> ở nhánh thoát sớm là <em>bắt buộc</em>, vì một phép canh sống trên kết nối cho tới khi có <code>EXEC</code>, <code>DISCARD</code> hoặc <code>UNWATCH</code>, và một phép canh bị bỏ quên sẽ đi theo kết nối ấy tới tay người mượn tiếp theo trong pool rồi làm hỏng giao dịch chẳng liên quan gì của họ mà không để lại lý do nào nhìn thấy được. Phương án 4 đảo ngược hai kết quả: <b>nil nghĩa là bị huỷ, còn mảng rỗng nghĩa là đã chạy và không có lệnh nào được xếp hàng</b> — coi "bị huỷ" là "thành công nhưng không có kết quả" là một con bug mất dữ liệu trong im lặng.',
          ),
        }),

        mcq({
          prompt: B(
            'A worker takes <code>SET lock:x tokenA NX PX 10000</code>, then suffers a 12-second stop-the-world GC pause. Meanwhile the lock expires and worker B acquires it. Worker A resumes and continues its critical section. What is the correct conclusion?',
            'Một worker giành <code>SET lock:x tokenA NX PX 10000</code>, rồi dính một cú dừng-cả-thế-giới của bộ dọn rác dài 12 giây. Trong lúc ấy khoá hết hạn và worker B giành được nó. Worker A tỉnh lại và chạy tiếp phần găng của mình. Kết luận đúng là gì?',
          ),
          options: [
            B('Redis lost the lock; enabling AOF with <code>appendfsync always</code> would have prevented it', 'Redis đã làm mất cái khoá; bật AOF với <code>appendfsync always</code> thì đã ngăn được'),
            B('The TTL was too short; setting <code>PX 60000</code> makes the lock correct', 'TTL quá ngắn; đặt <code>PX 60000</code> là cái khoá trở nên đúng'),
            B('This is inherent — a lock with a TTL is a <b>lease</b>; correctness must come from fencing tokens or an idempotent operation', 'Đây là chuyện cố hữu — một cái khoá có TTL là một hợp đồng thuê CÓ HẠN; tính đúng đắn phải đến từ token hàng rào hoặc một thao tác luỹ đẳng'),
            B('Redlock across five independent masters removes the problem', 'Redlock trên năm máy chính độc lập sẽ xoá bỏ vấn đề này'),
          ],
          correct: 2,
          explanation: EX(
            'The <code>PX</code> is not optional — without it a crashed holder deadlocks the resource forever — and it is simultaneously the source of every problem here. A process can be suspended at any point, by GC, by the scheduler, by a hypervisor, and it has no way to know that its lease expired while it was away. That is not a Redis bug and no configuration fixes it. Option 2 only widens the window it takes to hit. Option 4 is the one worth being precise about: <b>Redlock fixes a different failure</b> — losing a lock because one instance restarted or failed over — and <em>still</em> hands out a lease bounded by wall-clock time, so it does not help here either. The real fix is a monotonically increasing fencing token that the <b>protected system</b> checks, at which point you barely need the lock. The chapter&#x27;s rule: locks for efficiency, idempotency and constraints for correctness.',
            'Chữ <code>PX</code> không phải tuỳ chọn — thiếu nó thì một người giữ khoá bị sập sẽ khoá chết tài nguyên vĩnh viễn — và đồng thời nó là nguồn gốc của mọi vấn đề ở đây. Một tiến trình có thể bị treo ở bất kỳ điểm nào, bởi bộ dọn rác, bởi bộ lập lịch, bởi trình ảo hoá, và nó không có cách nào biết rằng hợp đồng thuê của mình đã hết hạn trong lúc nó vắng mặt. Đó không phải bug của Redis và không cấu hình nào sửa được. Phương án 2 chỉ nới rộng cái cửa sổ cần trúng. Phương án 4 là chỗ đáng nói cho chính xác: <b>Redlock sửa một kiểu hỏng khác</b> — mất khoá vì một máy chủ khởi động lại hoặc chuyển đổi dự phòng — và nó <em>vẫn</em> phát ra một hợp đồng thuê bị chặn bởi đồng hồ treo tường, nên ở đây nó cũng không giúp được gì. Cách sửa thật sự là một token hàng rào tăng đơn điệu mà <b>chính hệ thống được bảo vệ</b> đem ra kiểm — và tới lúc đó thì bạn gần như chẳng cần cái khoá nữa. Luật của chương: khoá là để hiệu quả, còn tính luỹ đẳng và các ràng buộc mới là để đúng đắn.',
          ),
        }),

        // ── Chương 8 — Pub/Sub và Stream ────────────────────────────────
        mcq({
          prompt: B(
            'A cache-invalidation publisher logs its return values and sees <code>PUBLISH cache:invalidate product:4201</code> returning <code>(integer) 0</code>. What does that mean?',
            'Một chỗ phát thông báo xoá bộ đệm ghi lại giá trị trả về và thấy <code>PUBLISH cache:invalidate product:4201</code> trả về <code>(integer) 0</code>. Nghĩa là gì?',
          ),
          options: [
            B('The message was queued and will be delivered when a subscriber connects', 'Thông điệp đã được xếp hàng và sẽ được giao khi có một subscriber kết nối'),
            B('No connection was subscribed to that channel, so the message was written to nobody and is gone permanently', 'Không kết nối nào đang đăng ký kênh đó, nên thông điệp không được ghi tới ai cả và mất vĩnh viễn'),
            B('The publish failed and should be retried', 'Phép phát đã thất bại và cần được thử lại'),
            B('Zero <b>new</b> subscribers received it; existing ones still did', 'Không có subscriber <b>MỚI</b> nào nhận được nó; những subscriber đang có thì vẫn nhận'),
          ],
          correct: 1,
          explanation: EX(
            'The return value is the number of connections the message was <b>written to</b> — not a delivery confirmation, and certainly not a promise for the future. Pub/Sub stores nothing, ever: no buffer, no backlog, no replay. A subscriber that connects one millisecond later gets nothing, and a subscriber that was mid-deploy has permanently missed everything published while it was down. That is why every Pub/Sub use in this course is framed as <b>a hint, not an instruction</b> — an invalidation message that is lost is survivable because the TTL is the backstop, whereas a job that is lost is not. The second silent loss path is worth knowing too: <code>client-output-buffer-limit pubsub 32mb 8mb 60</code> disconnects a subscriber that cannot keep up, which is the most common cause of "Pub/Sub lost my message".',
            'Giá trị trả về là số kết nối mà thông điệp đã được <b>GHI TỚI</b> — không phải xác nhận đã giao, và càng không phải một lời hứa cho tương lai. Pub/Sub không lưu gì cả, không bao giờ: không bộ đệm, không tồn đọng, không phát lại. Một subscriber kết nối muộn một mili giây là không nhận được gì, và một subscriber đang trong lúc deploy thì đã mất vĩnh viễn mọi thứ được phát trong lúc nó nằm xuống. Đó là lý do mọi cách dùng Pub/Sub trong khoá này đều được đóng khung là <b>một lời gợi ý, không phải một mệnh lệnh</b> — mất một thông điệp xoá bộ đệm thì sống được vì TTL là lưới đỡ, còn mất một công việc thì không. Đường mất mát im lặng thứ hai cũng đáng biết: <code>client-output-buffer-limit pubsub 32mb 8mb 60</code> sẽ ngắt một subscriber theo không kịp, và đó là nguyên nhân phổ biến nhất của câu "Pub/Sub làm mất thông điệp của tôi".',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. Three entries exist; <code>w1</code> took <code>1-1</code> and <code>2-1</code>, <code>w2</code> took <code>3-1</code>, and <code>1-1</code> has been acknowledged. What does the last line return?' + code(
              '> XREADGROUP GROUP billing w1 COUNT 5 STREAMS orders 0\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9. Có ba mục; <code>w1</code> đã lấy <code>1-1</code> và <code>2-1</code>, <code>w2</code> lấy <code>3-1</code>, và <code>1-1</code> đã được ack. Dòng cuối trả về gì?' + code(
              '> XREADGROUP GROUP billing w1 COUNT 5 STREAMS orders 0\n' +
              '?',
            ),
          ),
          options: [
            B('Only <code>2-1</code>', 'Chỉ <code>2-1</code>'),
            B('<code>2-1</code> and <code>3-1</code> — every entry still pending in the group', '<code>2-1</code> và <code>3-1</code> — mọi mục còn đang chờ trong nhóm'),
            B('All three entries, replayed from the start of the stream', 'Cả ba mục, phát lại từ đầu stream'),
            B('<code>(nil)</code> — an explicit id only works before the group has consumed anything', '<code>(nil)</code> — ID tường minh chỉ dùng được trước khi nhóm tiêu thụ bất cứ thứ gì'),
          ],
          correct: 0,
          explanation: EX(
            'Verified by running it. The last argument decides which question you are asking. <b><code>&gt;</code> means "entries never delivered to anyone in this group"</b> — the steady-state path, which advances the group&#x27;s last-delivered id and splits work between consumers. <b>An explicit id such as <code>0</code> means "this consumer&#x27;s own still-pending entries"</b> — the recovery path a worker runs on startup to pick up what it was holding when it died. It never returns another consumer&#x27;s pending entries; that is what <code>XCLAIM</code> and <code>XAUTOCLAIM</code> are for. So <code>w1</code> sees <code>2-1</code> (still pending, still hers) and not <code>3-1</code> (pending, but <code>w2</code>&#x27;s) and not <code>1-1</code> (acknowledged, therefore out of the pending list).',
            'Đã kiểm bằng cách chạy thật. Đối số cuối cùng quyết định bạn đang hỏi câu nào. <b><code>&gt;</code> nghĩa là "những mục chưa từng giao cho bất kỳ ai trong nhóm này"</b> — đường chạy thường ngày, nó đẩy mốc đã-giao-cuối của nhóm tiến lên và chia việc giữa các consumer. <b>Một ID tường minh như <code>0</code> nghĩa là "những mục còn đang chờ CỦA CHÍNH consumer này"</b> — đường phục hồi mà một worker chạy lúc khởi động để nhặt lại thứ nó đang cầm khi ngã xuống. Nó không bao giờ trả về mục đang chờ của consumer khác; đó là việc của <code>XCLAIM</code> và <code>XAUTOCLAIM</code>. Vậy nên <code>w1</code> thấy <code>2-1</code> (vẫn đang chờ, vẫn của nó) chứ không thấy <code>3-1</code> (đang chờ, nhưng của <code>w2</code>) và cũng không thấy <code>1-1</code> (đã ack nên đã ra khỏi danh sách chờ).',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, on an entry that is currently pending. What are the two replies?' + code(
              '> XACK orders billing 1-1\n' +
              '?\n' +
              '> XACK orders billing 1-1\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9, với một mục đang nằm chờ. Hai kết quả là gì?' + code(
              '> XACK orders billing 1-1\n' +
              '?\n' +
              '> XACK orders billing 1-1\n' +
              '?',
            ),
          ),
          options: [
            B('<code>1</code> then <code>1</code> — acknowledging is idempotent and always reports success', '<code>1</code> rồi <code>1</code> — ack là luỹ đẳng nên luôn báo thành công'),
            B('<code>1</code> then <code>(error)</code> — the entry is no longer pending', '<code>1</code> rồi <code>(error)</code> — mục đó không còn nằm chờ nữa'),
            B('<code>1</code> then <code>1</code>, and the entry is deleted from the stream on the second call', '<code>1</code> rồi <code>1</code>, và mục đó bị xoá khỏi stream ở lời gọi thứ hai'),
            B('<code>1</code> then <code>0</code>', '<code>1</code> rồi <code>0</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Verified by running it. <code>XACK</code> returns <b>how many of the given ids it actually removed from the pending list</b>, so the second call finds nothing to remove and returns 0. That return value is how a sweeper distinguishes "I just finished this" from "somebody already handled it", which matters when several workers may claim the same abandoned entry. Note what <code>XACK</code> does <em>not</em> do — it does not delete the entry from the stream; the entry stays until trimming removes it, which is exactly what makes replay by a second consumer group possible. And the discipline that matters most: <b>acknowledge after the work succeeds, never in a <code>finally</code> block</b>, because acking a failed handler removes the entry from the pending list and the job is silently dropped forever.',
            'Đã kiểm bằng cách chạy thật. <code>XACK</code> trả về <b>bao nhiêu ID trong số đã cho mà nó THẬT SỰ gỡ được khỏi danh sách chờ</b>, nên lời gọi thứ hai không tìm thấy gì để gỡ và trả về 0. Chính giá trị trả về ấy giúp một sweeper phân biệt "tôi vừa làm xong cái này" với "ai đó đã xử lý rồi", điều rất quan trọng khi nhiều worker cùng có thể giành một mục bị bỏ rơi. Để ý thứ <code>XACK</code> KHÔNG làm — nó không xoá mục khỏi stream; mục ấy còn nguyên cho tới khi bị cắt tỉa, và đó chính là thứ khiến một nhóm tiêu thụ thứ hai có thể phát lại được. Và kỷ luật quan trọng nhất: <b>hãy ack SAU khi công việc thành công, đừng bao giờ ack trong khối <code>finally</code></b>, vì ack một handler đã hỏng sẽ gỡ mục khỏi danh sách chờ và công việc bị âm thầm vứt đi vĩnh viễn.',
          ),
        }),

        mcq({
          prompt: B(
            'A stream is used as a work queue. Workers <code>XDEL</code> each entry after acknowledging it, expecting the memory to come back. <code>XLEN</code> falls but <code>MEMORY USAGE</code> does not move at all. Why, and what should they do instead?',
            'Một stream được dùng làm hàng đợi công việc. Các worker gọi <code>XDEL</code> cho từng mục sau khi ack, mong bộ nhớ được trả lại. <code>XLEN</code> giảm nhưng <code>MEMORY USAGE</code> không nhúc nhích. Vì sao, và họ nên làm gì thay vào đó?',
          ),
          options: [
            B('<code>XDEL</code> is asynchronous; the memory returns on the next background cycle', '<code>XDEL</code> là bất đồng bộ; bộ nhớ sẽ về ở chu kỳ nền kế tiếp'),
            B('A stream packs entries into macro nodes, so <code>XDEL</code> only marks one deleted; bound it at write time with <code>MAXLEN ~</code> or <code>MINID</code>', 'Stream gói các mục vào những nút lớn nên <code>XDEL</code> chỉ đánh dấu là đã xoá; hãy chặn ngay lúc ghi bằng <code>MAXLEN ~</code> hoặc <code>MINID</code>'),
            B('<code>MEMORY USAGE</code> samples nested values and is simply inaccurate for streams', '<code>MEMORY USAGE</code> lấy mẫu các giá trị lồng nhau nên với stream thì nó đơn giản là không chính xác'),
            B('The consumer group&#x27;s pending list still references the entries, so they cannot be freed', 'Danh sách chờ của nhóm tiêu thụ vẫn còn tham chiếu tới các mục đó nên chúng không thể được giải phóng'),
          ],
          correct: 1,
          explanation: EX(
            'Measured in the course: 200,000 entries at 17,441,216 bytes; after one <code>XDEL</code>, <code>XLEN</code> drops to 199,999 and <code>MEMORY USAGE</code> stays at 17,441,216. Entries are packed contiguously into macro nodes, and Redis will not rewrite the middle of a packed node, so it flags the entry and moves on; the bytes come back only when every entry in that node has gone. The symptom is a queue that <em>looks</em> empty while the instance sits at 90% memory. Retention belongs on the write path: <code>MAXLEN ~ 1000</code> trims to a node boundary in O(1) amortised (exact <code>MAXLEN</code> is O(N) and blocks), and <code>MINID</code> trims by age. <b>Trim on <code>XADD</code>, not on a cron</b> — a nightly trim job means the stream is unbounded for 23 hours a day. Reserve <code>XDEL</code> for erasing one specific entry.',
            'Đo trong khoá học: 200.000 mục nặng 17.441.216 byte; sau một lệnh <code>XDEL</code>, <code>XLEN</code> tụt xuống 199.999 còn <code>MEMORY USAGE</code> vẫn đứng nguyên 17.441.216. Các mục được gói liền nhau vào những nút lớn, và Redis không viết lại phần giữa của một nút đã gói, nên nó chỉ gắn cờ cho mục ấy rồi đi tiếp; số byte chỉ quay về khi mọi mục trong nút đó đều đã đi. Triệu chứng là một hàng đợi <em>trông</em> thì rỗng trong khi máy chủ ngồi ở mức 90% bộ nhớ. Việc giữ-bao-nhiêu thuộc về đường ghi: <code>MAXLEN ~ 1000</code> cắt tới ranh giới một nút với chi phí O(1) khấu hao (còn <code>MAXLEN</code> chính xác là O(N) và gây chặn), và <code>MINID</code> cắt theo tuổi. <b>Hãy cắt tỉa ngay trong <code>XADD</code>, đừng để cho một cron</b> — một job cắt tỉa chạy đêm nghĩa là stream không có trần trong 23 giờ mỗi ngày. Hãy để dành <code>XDEL</code> cho việc xoá đúng một mục cụ thể.',
          ),
        }),

        mcq({
          prompt: B(
            'A sweeper runs <code>XAUTOCLAIM orders billing sweeper 30000 0-0</code> every 30 seconds. The slowest handler in this group takes 45 seconds at p99. What goes wrong?',
            'Một sweeper chạy <code>XAUTOCLAIM orders billing sweeper 30000 0-0</code> mỗi 30 giây. Handler chậm nhất trong nhóm này mất 45 giây ở mức p99. Chuyện gì hỏng?',
          ),
          options: [
            B('Nothing — <code>XAUTOCLAIM</code> checks whether the owning consumer is still connected before taking anything', 'Không sao cả — <code>XAUTOCLAIM</code> có kiểm xem consumer đang giữ còn kết nối hay không trước khi lấy đi thứ gì'),
            B('The sweeper will keep returning an empty list, because a consumer that is still working resets the idle clock on every command it sends', 'Sweeper sẽ liên tục trả về danh sách rỗng, vì một consumer còn đang làm việc sẽ đặt lại đồng hồ chờ mỗi lần nó gửi một lệnh'),
            B('It claims work from consumers that are still doing it, so the job runs twice concurrently — and because the second run also takes 45 seconds, the problem amplifies itself', 'Nó giành việc từ những consumer vẫn đang làm dở, nên công việc chạy hai lần cùng lúc — và vì lần chạy thứ hai cũng mất 45 giây, vấn đề tự khuếch đại lên'),
            B('The claim is rejected with <code>BUSYGROUP</code> until the original consumer acknowledges', 'Phép giành bị từ chối với lỗi <code>BUSYGROUP</code> cho tới khi consumer gốc ack'),
          ],
          correct: 2,
          explanation: EX(
            'The critical detail is what <code>min-idle-time</code> measures: <b>time since delivery, not time since the worker was last alive</b>. A consumer that has been chewing on an entry for 40 seconds is indistinguishable from one that died 40 seconds ago. Set the threshold below your slowest handler and the sweeper starts stealing live work, producing duplicate charges, duplicate emails, duplicate inventory decrements — and each duplicate is itself slow, so more entries cross the threshold. Size <code>min-idle-time</code> from the measured p99 with a wide margin, five to ten times rather than 1.5. For genuinely long jobs, heartbeat by calling <code>XCLAIM … JUSTID</code> on your own entry every few seconds to reset the idle clock — the same shape as the lock watchdog in chapter 7. Option 1 is the tempting wrong answer: Redis tracks delivery times, not worker liveness.',
            'Chi tiết then chốt là <code>min-idle-time</code> đo cái gì: <b>thời gian kể từ lúc GIAO, không phải thời gian kể từ lúc worker còn sống</b>. Một consumer đã gặm một mục suốt 40 giây thì không phân biệt được với một consumer đã chết 40 giây trước. Đặt ngưỡng thấp hơn handler chậm nhất là sweeper bắt đầu cướp việc đang chạy, sinh ra hai lần tính tiền, hai lần gửi thư, hai lần trừ tồn kho — và mỗi bản sao lại tự nó chậm, nên càng nhiều mục vượt ngưỡng. Hãy chọn <code>min-idle-time</code> từ p99 đo được với biên rất rộng, gấp năm tới mười lần chứ không phải 1,5 lần. Với những việc dài thật sự, hãy đập nhịp bằng cách gọi <code>XCLAIM … JUSTID</code> lên chính mục của mình vài giây một lần để đặt lại đồng hồ chờ — cùng một hình dáng với con chó canh khoá ở chương 7. Phương án 1 là câu trả lời sai đầy hấp dẫn: Redis theo dõi thời điểm giao hàng, chứ không theo dõi worker còn sống hay không.',
          ),
        }),

        // ── Chương 9 — Bộ nhớ, đẩy khoá và lưu lâu dài ──────────────────
        mcq({
          prompt: B(
            'Measured on Redis 7.4.9 with <code>maxmemory</code> set and the default policy, after the instance filled up: reads keep working perfectly while a bulk load reports <code>errors: 38104</code>. What is the error, and what is the policy?',
            'Đo trên Redis 7.4.9 với <code>maxmemory</code> đã đặt và chính sách mặc định, sau khi máy chủ đầy: các lệnh đọc vẫn chạy hoàn hảo trong khi một đợt nạp hàng loạt báo <code>errors: 38104</code>. Lỗi đó là gì, và chính sách là gì?',
          ),
          options: [
            B('<code>MISCONF</code> under <code>allkeys-lru</code> — evictions could not keep up', '<code>MISCONF</code> dưới chính sách <code>allkeys-lru</code> — việc đẩy khoá không theo kịp'),
            B('<code>NOREPLICAS</code> under <code>volatile-ttl</code>', '<code>NOREPLICAS</code> dưới chính sách <code>volatile-ttl</code>'),
            B('<code>READONLY</code> — the instance demoted itself to a replica to protect the data', '<code>READONLY</code> — máy chủ tự hạ mình thành bản sao để bảo vệ dữ liệu'),
            B('<code>OOM command not allowed when used memory &gt; &#x27;maxmemory&#x27;.</code> under <code>noeviction</code>, which is the default', '<code>OOM command not allowed when used memory &gt; &#x27;maxmemory&#x27;.</code> dưới chính sách <code>noeviction</code>, vốn là mặc định'),
          ],
          correct: 3,
          explanation: EX(
            'Verified: <code>CONFIG GET maxmemory-policy</code> on a stock <code>redis:7</code> returns <code>noeviction</code>, and once <code>used_memory</code> passes <code>maxmemory</code> every write is refused with that exact message while <code>GET</code> keeps serving. <b>That asymmetry is what makes it confusing in an incident</b> — the site half-works, the dashboards look busy, and only the write paths are broken. <code>noeviction</code> is right for Redis-as-a-database and wrong for Redis-as-a-cache; switching to <code>allkeys-lru</code> makes writes succeed and starts <code>evicted_keys</code> climbing. Two neighbouring facts: the three errors that mean "writes are refused but reads are fine" are <code>OOM</code>, <code>MISCONF</code> (a save is failing) and <code>NOREPLICAS</code> — the error text is the diagnosis; and <b>every <code>volatile-*</code> policy behaves exactly like <code>noeviction</code> when no key has a TTL</b>.',
            'Đã kiểm: <code>CONFIG GET maxmemory-policy</code> trên ảnh <code>redis:7</code> nguyên bản trả về <code>noeviction</code>, và một khi <code>used_memory</code> vượt <code>maxmemory</code> thì mọi phép ghi bị từ chối với đúng thông báo ấy trong khi <code>GET</code> vẫn phục vụ bình thường. <b>Chính sự bất đối xứng đó làm người ta rối khi có sự cố</b> — trang web chạy được một nửa, bảng điều khiển trông vẫn bận rộn, và chỉ những đường ghi là hỏng. <code>noeviction</code> đúng cho Redis-như-một-cơ-sở-dữ-liệu và sai cho Redis-như-một-bộ-đệm; chuyển sang <code>allkeys-lru</code> thì phép ghi thành công và số <code>evicted_keys</code> bắt đầu leo. Hai sự thật hàng xóm: ba lỗi có nghĩa "ghi bị từ chối nhưng đọc vẫn ổn" là <code>OOM</code>, <code>MISCONF</code> (một lần lưu đang hỏng) và <code>NOREPLICAS</code> — chính chữ trong lỗi là lời chẩn đoán; và <b>mọi chính sách <code>volatile-*</code> đều hành xử y hệt <code>noeviction</code> khi không khoá nào có TTL</b>.',
          ),
        }),

        mcq({
          prompt: B(
            'One instance holds the product cache, an order queue built on a Stream, user sessions and a distributed lock. The policy is <code>allkeys-lru</code>. What is the specific danger?',
            'Một máy chủ duy nhất chứa bộ đệm sản phẩm, một hàng đợi đơn hàng dựng trên Stream, phiên đăng nhập của người dùng và một khoá phân tán. Chính sách là <code>allkeys-lru</code>. Nguy hiểm cụ thể ở đây là gì?',
          ),
          options: [
            B('Eviction does not know what a key is <b>for</b>, so it can silently delete the order stream, a live session or a held lock', 'Việc đẩy khoá không biết một khoá <b>dùng để làm gì</b>, nên nó có thể âm thầm xoá stream đơn hàng, một phiên đang sống hay một khoá đang được giữ'),
            B('Nothing serious — Redis will not evict a Stream or a key without a TTL', 'Không có gì nghiêm trọng — Redis sẽ không đẩy một Stream hay một khoá không có TTL'),
            B('Eviction will fail with <code>OOM</code> once it reaches a key type it cannot evict', 'Việc đẩy khoá sẽ hỏng với lỗi <code>OOM</code> khi nó chạm tới một kiểu khoá mà nó không đẩy được'),
            B('The LRU approximation samples only five keys, so it will evict the cache first by construction', 'Phép xấp xỉ LRU chỉ lấy mẫu năm khoá, nên theo thiết kế nó sẽ đẩy bộ đệm đi trước'),
          ],
          correct: 0,
          explanation: EX(
            '<code>allkeys-lru</code> means <em>all keys</em>, and a Stream is a normal key: <code>allkeys-lru</code> does not know it is a queue. The eviction is silent — no error, no log line — and the keys it prefers are the idle ones, which is exactly the profile of a held lock (written once, then untouched until release) and of a pending job (written once, read later). There are two honest ways out. Separate instances is the clean one: the cache instance runs <code>allkeys-lru</code> and is allowed to lose data; the data instance runs <code>noeviction</code> and is sized so it never gets there. Or run <code>volatile-lru</code> with discipline, giving TTLs only to genuinely disposable keys, plus a check that alerts when a non-cache prefix acquires a TTL or a cache key loses one. Option 4 misreads <code>maxmemory-samples</code>, which is about approximation quality, not about which kind of key is chosen.',
            '<code>allkeys-lru</code> nghĩa là <em>MỌI khoá</em>, và một Stream là một khoá bình thường: <code>allkeys-lru</code> không biết nó là một hàng đợi. Việc đẩy khoá diễn ra trong im lặng — không lỗi, không một dòng log — và những khoá nó ưu tiên là những khoá nhàn rỗi, đúng là chân dung của một cái khoá đang được giữ (ghi một lần rồi không ai đụng tới cho tới lúc nhả) và của một công việc đang chờ (ghi một lần, đọc về sau). Có hai lối ra thành thật. Tách máy chủ là lối sạch sẽ: máy chứa bộ đệm chạy <code>allkeys-lru</code> và được phép mất dữ liệu; máy chứa dữ liệu chạy <code>noeviction</code> và được cấp đủ chỗ để không bao giờ chạm trần. Hoặc chạy <code>volatile-lru</code> có kỷ luật, chỉ gán TTL cho những khoá thật sự vứt đi được, kèm một phép kiểm cảnh báo khi một tiền tố không-phải-bộ-đệm bỗng có TTL hoặc một khoá bộ đệm bỗng mất TTL. Phương án 4 hiểu sai <code>maxmemory-samples</code>, vốn nói về chất lượng phép xấp xỉ chứ không nói về việc chọn loại khoá nào.',
          ),
        }),

        mcq({
          prompt: B(
            'An instance holding 1.2 GB shows RSS climbing to 2.28 GB for two seconds during every <code>BGSAVE</code>, while <code>used_memory</code> never moves. On a fresh host the same save causes latency spikes of hundreds of milliseconds. What are the two things going on?',
            'Một máy chủ giữ 1,2 GB có RSS leo lên 2,28 GB trong hai giây mỗi lần <code>BGSAVE</code>, trong khi <code>used_memory</code> không hề nhúc nhích. Trên một máy chủ mới dựng, cũng lần lưu ấy gây ra những cú vọt độ trễ hàng trăm mili giây. Hai chuyện đang xảy ra là gì?',
          ),
          options: [
            B('Copy-on-write during the fork, which <code>used_memory</code> cannot see, plus Transparent Huge Pages making each copy 2 MB', 'Sao-khi-ghi trong lúc fork, thứ mà <code>used_memory</code> không nhìn thấy, cộng với Transparent Huge Pages làm mỗi lần sao chép tốn 2 MB'),
            B('Memory fragmentation, which <code>activedefrag yes</code> would remove', 'Phân mảnh bộ nhớ, thứ mà <code>activedefrag yes</code> sẽ dọn được'),
            B('The RDB file being buffered in memory before being written, and slow disk I/O', 'Tệp RDB được đệm trong bộ nhớ trước khi ghi ra, cộng với đĩa vào-ra chậm'),
            B('The replication backlog being allocated for the duration of the save', 'Vùng đệm nhân bản được cấp phát trong suốt thời gian lưu'),
          ],
          correct: 0,
          explanation: EX(
            '<code>BGSAVE</code> forks, and the fork duplicates the page table rather than the memory — roughly a millisecond per gigabyte, which is why <code>latest_fork_usec</code> around 1 ms/GB is the health baseline. From then on every page the parent <em>writes</em> must be copied, so the extra RSS is proportional to how much changes <b>during</b> the save, typically 30–50% transient. <code>used_memory</code> stays flat because from Redis&#x27;s point of view nothing was allocated. THP turns each of those copies from a 4 KB page into a 2 MB huge page — <b>512× the work per modified page</b> — and it is the single most common cause of "Redis is randomly slow" on a fresh Linux host. Set <code>/sys/kernel/mm/transparent_hugepage/enabled</code> to <code>never</code> and <code>vm.overcommit_memory=1</code>, <b>on the host</b>, since both are kernel-wide and no container flag fixes them.',
            '<code>BGSAVE</code> fork ra một tiến trình con, và phép fork nhân đôi BẢNG TRANG chứ không nhân đôi bộ nhớ — khoảng một mili giây cho mỗi gigabyte, và đó là lý do <code>latest_fork_usec</code> quanh mức 1 ms/GB là mốc khoẻ mạnh. Từ đó trở đi, mỗi trang mà tiến trình cha <em>GHI</em> đều phải được sao lại, nên phần RSS dôi ra tỉ lệ với lượng thay đổi <b>TRONG LÚC</b> lưu, thường là 30–50% và chỉ thoáng qua. <code>used_memory</code> đứng yên vì dưới góc nhìn của Redis thì chẳng có gì được cấp phát. THP biến mỗi lần sao chép ấy từ một trang 4 KB thành một trang khổng lồ 2 MB — <b>gấp 512 lần công việc cho mỗi trang bị sửa</b> — và đó là nguyên nhân phổ biến nhất của câu "Redis thỉnh thoảng chậm không rõ lý do" trên một máy Linux mới dựng. Hãy đặt <code>/sys/kernel/mm/transparent_hugepage/enabled</code> thành <code>never</code> và <code>vm.overcommit_memory=1</code>, <b>ở cấp máy chủ vật lý</b>, vì cả hai đều ở tầm nhân hệ điều hành và không cờ container nào sửa được.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on Redis 7.4.9: <code>CONFIG GET save</code> returns <code>3600 1 300 100 60 10000</code>. On a busy instance with only RDB persistence, how much can a hard crash lose?',
            'Đo trên Redis 7.4.9: <code>CONFIG GET save</code> trả về <code>3600 1 300 100 60 10000</code>. Trên một máy chủ bận rộn chỉ có RDB, một cú sập đột ngột có thể làm mất bao nhiêu?',
          ),
          options: [
            B('At most one second, because the last rule saves every 60 seconds regardless of load', 'Nhiều nhất một giây, vì luật cuối cùng lưu mỗi 60 giây bất kể tải'),
            B('Up to about a minute — the three rules are ORed, and on a busy instance "10,000 changes in 60 s" is the one that fires', 'Tới khoảng một phút — ba luật là quan hệ HOẶC, và trên máy bận thì luật "10.000 thay đổi trong 60 giây" mới là luật nổ'),
            B('Nothing — <code>BGSAVE</code> runs after every write once the first rule is satisfied', 'Không mất gì — <code>BGSAVE</code> chạy sau mỗi phép ghi một khi luật đầu tiên được thoả'),
            B('Up to an hour, because the first rule is the only one that applies to a single change', 'Tới một giờ, vì luật đầu tiên là luật duy nhất áp cho một thay đổi đơn lẻ'),
          ],
          correct: 1,
          explanation: EX(
            'Each pair is <code>&lt;seconds&gt; &lt;changes&gt;</code> and they are ORed: save if 3600 s have passed with at least 1 change, or 300 s with 100, or 60 s with 10,000. A busy instance crosses 10,000 changes constantly, so the effective interval is 60 seconds and a crash costs up to a minute. That is a deliberate posture, not an accident, and the alternatives sit next to it: AOF with the default <code>appendfsync everysec</code> loses up to one second, and <code>appendfsync always</code> loses nothing and pays a disk round trip on every write. Option 3 confuses <code>save</code> with synchronous persistence — and note the related trap: <code>SAVE</code> (no BG) blocks the single thread and has no legitimate use on a live instance, while <b>a fork happens even with <code>save ""</code> whenever a replica connects</b>, because RDB is also the replication mechanism.',
            'Mỗi cặp là <code>&lt;số giây&gt; &lt;số thay đổi&gt;</code> và chúng là quan hệ HOẶC: lưu nếu đã qua 3600 giây với ít nhất 1 thay đổi, hoặc 300 giây với 100 thay đổi, hoặc 60 giây với 10.000 thay đổi. Một máy bận vượt mốc 10.000 thay đổi liên tục, nên chu kỳ thực tế là 60 giây và một cú sập tốn tới một phút dữ liệu. Đó là một lập trường có chủ ý, không phải một tai nạn, và các lựa chọn khác nằm ngay cạnh: AOF với mặc định <code>appendfsync everysec</code> mất tối đa một giây, còn <code>appendfsync always</code> thì không mất gì và trả giá bằng một lượt đi về tới đĩa cho mỗi phép ghi. Phương án 3 nhầm <code>save</code> với lưu đồng bộ — và để ý cái bẫy liên quan: <code>SAVE</code> (không có BG) chặn cái luồng duy nhất và không có lý do chính đáng nào để chạy trên một máy đang sống, trong khi <b>một lần fork vẫn xảy ra ngay cả với <code>save ""</code> mỗi khi có một bản sao kết nối vào</b>, bởi RDB đồng thời là cơ chế nhân bản.',
          ),
        }),

        // ── Chương 10 — Vận hành, bảo mật và ACL ────────────────────────
        mcq({
          prompt: B(
            'A team runs the official image with <code>docker run -d -p 6379:6379 -v ./redis.conf:/usr/local/etc/redis/redis.conf redis:7.4-alpine</code>. Their <code>requirepass</code>, <code>maxmemory</code> and <code>bind</code> settings all appear to be ignored, and the instance is reachable from the internet despite UFW. What went wrong?',
            'Một nhóm chạy ảnh chính thức bằng <code>docker run -d -p 6379:6379 -v ./redis.conf:/usr/local/etc/redis/redis.conf redis:7.4-alpine</code>. Các thiết lập <code>requirepass</code>, <code>maxmemory</code> và <code>bind</code> của họ đều như bị bỏ qua, và máy chủ vẫn với tới được từ Internet dù đã có UFW. Sai ở đâu?',
          ),
          options: [
            B('The config must be mounted read-write so Redis can rewrite it at startup', 'Tệp cấu hình phải được gắn ở chế độ ghi được để Redis viết lại nó lúc khởi động'),
            B('<code>protected-mode</code> overrides a mounted config file and must be disabled first', '<code>protected-mode</code> ghi đè lên tệp cấu hình được gắn vào và phải bị tắt trước'),
            B('Two independent problems: the image ignores a mounted config unless you pass its path, and <code>-p 6379:6379</code> publishes past UFW', 'Hai vấn đề độc lập: ảnh bỏ qua tệp cấu hình được gắn vào trừ khi bạn truyền đường dẫn, và <code>-p 6379:6379</code> công bố cổng vượt qua UFW'),
            B('Alpine images ship without the config parser, so all directives are silently skipped', 'Ảnh nền Alpine không kèm bộ phân tích cấu hình nên mọi chỉ thị đều bị bỏ qua âm thầm'),
          ],
          correct: 2,
          explanation: EX(
            'Both halves have to be fixed and they are unrelated. The container needs <code>command: ["redis-server", "/usr/local/etc/redis/redis.conf"]</code> — mounting a file does not make anything read it, and this silently discards every setting in the chapter. Separately, Docker&#x27;s published ports are implemented as DNAT rules in the <code>nat</code> table that are evaluated before UFW&#x27;s filter rules, so a firewall that looks correct is bypassed entirely; the fix is to bind the publication to the loopback interface, <code>-p 127.0.0.1:6379:6379</code>. The consequence of getting this wrong is not theoretical: an unauthenticated Redis can be told through <code>CONFIG SET dir</code> and <code>dbfilename</code> to write its dump into <code>~/.ssh/authorized_keys</code>, which turns a cache into a shell. Instances left open are compromised within hours.',
            'Cả hai nửa đều phải sửa và chúng không liên quan gì đến nhau. Container cần <code>command: ["redis-server", "/usr/local/etc/redis/redis.conf"]</code> — gắn một tệp vào không làm cho ai đó đi đọc nó, và chuyện này âm thầm vứt bỏ mọi thiết lập trong cả chương. Tách biệt với nó, các cổng công bố của Docker được cài đặt bằng luật DNAT trong bảng <code>nat</code>, vốn được xét TRƯỚC các luật lọc của UFW, nên một tường lửa nhìn thì đúng lại bị đi vòng hoàn toàn; cách sửa là buộc phần công bố vào giao diện loopback, <code>-p 127.0.0.1:6379:6379</code>. Hậu quả của việc làm sai chỗ này không hề lý thuyết: một Redis không xác thực có thể bị bảo, qua <code>CONFIG SET dir</code> và <code>dbfilename</code>, ghi tệp dump của nó vào <code>~/.ssh/authorized_keys</code>, biến một bộ đệm thành một cái shell. Những máy chủ bị bỏ ngỏ bị chiếm trong vòng vài giờ.',
          ),
        }),

        mcq({
          prompt: B(
            'An instance sets <code>requirepass</code> to a long random string and nothing else. An application connects with that password. What can that connection do?',
            'Một máy chủ đặt <code>requirepass</code> bằng một chuỗi ngẫu nhiên dài và không làm gì thêm. Một ứng dụng kết nối bằng mật khẩu ấy. Kết nối đó làm được những gì?',
          ),
          options: [
            B('Only read and write keys; administrative commands need a separate ACL user', 'Chỉ đọc và ghi khoá; các lệnh quản trị cần một người dùng ACL riêng'),
            B('Read and write, plus <code>CONFIG GET</code>, but not <code>CONFIG SET</code> or <code>FLUSHALL</code>', 'Đọc và ghi, cộng thêm <code>CONFIG GET</code>, nhưng không được <code>CONFIG SET</code> hay <code>FLUSHALL</code>'),
            B('Whatever the <code>redis.conf</code> <code>rename-command</code> directives leave available', 'Bất cứ thứ gì mà các chỉ thị <code>rename-command</code> trong <code>redis.conf</code> còn để lại'),
            B('Everything — <code>requirepass</code> only adds a password to the <code>default</code> user, which keeps <code>+@all ~* &amp;*</code>', 'Mọi thứ — <code>requirepass</code> chỉ thêm mật khẩu cho người dùng <code>default</code>, mà người dùng ấy vẫn giữ <code>+@all ~* &amp;*</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Verified: <code>ACL LIST</code> on a stock instance shows <code>user default on nopass sanitize-payload ~* &amp;* +@all</code>, and setting <code>requirepass</code> changes only the <code>nopass</code> part. A password is authentication, not authorisation — every application, every developer laptop and every leaked connection string gets full administrative power over the instance, including the ability to reconfigure persistence, promote it to a replica of an attacker&#x27;s server, or empty it. ACLs are the answer: give each service its own user with the categories and key patterns it needs (<code>ACL SETUSER webapp on &gt;pw ~cache:* +@read +@write -@dangerous</code>), and when a call is unexpectedly denied read <code>ACL LOG</code> rather than guessing. Option 3 describes <code>rename-command</code>, which is a blunt global instrument superseded by ACLs and applies to everyone at once.',
            'Đã kiểm: <code>ACL LIST</code> trên một máy nguyên bản cho ra <code>user default on nopass sanitize-payload ~* &amp;* +@all</code>, và đặt <code>requirepass</code> chỉ đổi mỗi phần <code>nopass</code>. Mật khẩu là XÁC THỰC, không phải PHÂN QUYỀN — mọi ứng dụng, mọi máy tính của lập trình viên và mọi chuỗi kết nối bị lộ đều có trọn quyền quản trị trên máy chủ, kể cả quyền cấu hình lại phần lưu lâu dài, biến nó thành bản sao của máy chủ kẻ tấn công, hay dọn sạch nó. ACL mới là câu trả lời: cấp cho mỗi dịch vụ một người dùng riêng với đúng nhóm lệnh và mẫu khoá nó cần (<code>ACL SETUSER webapp on &gt;pw ~cache:* +@read +@write -@dangerous</code>), và khi một lời gọi bất ngờ bị từ chối thì hãy đọc <code>ACL LOG</code> thay vì ngồi đoán. Phương án 3 mô tả <code>rename-command</code>, một công cụ toàn cục thô sơ đã bị ACL thay thế và áp lên tất cả mọi người cùng lúc.',
          ),
        }),

        mcq({
          prompt: B(
            'An instance is configured with <code>maxclients 10000</code> but starts refusing connections at around 990, and <code>rejected_connections</code> climbs. What is the most likely cause?',
            'Một máy chủ được cấu hình <code>maxclients 10000</code> nhưng bắt đầu từ chối kết nối ở khoảng 990, và <code>rejected_connections</code> tăng dần. Nguyên nhân khả dĩ nhất là gì?',
          ),
          options: [
            B('<code>tcp-backlog</code> defaults to 511 and caps the number of established connections', '<code>tcp-backlog</code> mặc định là 511 và nó chặn số kết nối đã thiết lập'),
            B('<code>timeout 0</code> means idle connections are never closed, so the pool exhausts itself', '<code>timeout 0</code> nghĩa là kết nối nhàn rỗi không bao giờ bị đóng, nên pool tự làm cạn chính nó'),
            B('<code>maxmemory-clients</code> is evicting client connections before the limit is reached', '<code>maxmemory-clients</code> đang đẩy các kết nối client đi trước khi chạm hạn mức'),
            B('The process file-descriptor limit is 1024, and Redis silently lowers <code>maxclients</code> to fit — it logs the reduction at startup', 'Giới hạn số file descriptor của tiến trình là 1024, và Redis âm thầm hạ <code>maxclients</code> xuống cho vừa — nó có ghi log lần hạ ấy lúc khởi động'),
          ],
          correct: 3,
          explanation: EX(
            'Three limits have to agree and the smallest wins: <code>maxclients</code> (10000 by default), the process <code>ulimit -n</code>, and <code>tcp-backlog</code>. Every client connection is a file descriptor, and Redis reserves a handful for itself, so a limit of 1024 yields roughly 990 usable clients. It says so at startup — <code>You requested maxclients of 10000 requiring at least 10032 max file descriptors</code> — which is exactly the line nobody reads. Fix it with <code>LimitNOFILE=65535</code> in the systemd unit or the equivalent <code>ulimits</code> in Docker. Option 1 confuses the <em>accept queue</em> with the connection count; a small backlog shows up as connection <em>timeouts</em> during a burst, not a steady ceiling. The sizing arithmetic worth remembering is <code>pool × processes × replicas</code> — 50 × 8 × 40 is 16,000 against a limit of 10,000, and it fails on the next scale-up rather than during the rollout.',
            'Ba giới hạn phải khớp nhau và cái nhỏ nhất thắng: <code>maxclients</code> (mặc định 10000), giới hạn <code>ulimit -n</code> của tiến trình, và <code>tcp-backlog</code>. Mỗi kết nối client là một file descriptor, và Redis tự giữ lại vài cái cho mình, nên giới hạn 1024 cho ra khoảng 990 client dùng được. Nó có nói ngay lúc khởi động — <code>You requested maxclients of 10000 requiring at least 10032 max file descriptors</code> — đúng cái dòng chẳng ai đọc. Hãy sửa bằng <code>LimitNOFILE=65535</code> trong unit của systemd hoặc mục <code>ulimits</code> tương đương trong Docker. Phương án 1 nhầm <em>hàng đợi chấp nhận kết nối</em> với số kết nối; một backlog nhỏ biểu hiện thành <em>hết giờ</em> khi có đợt dồn, chứ không phải một cái trần đứng yên. Phép tính cỡ đáng nhớ là <code>số kết nối trong pool × số tiến trình × số bản sao</code> — 50 × 8 × 40 là 16.000 so với hạn mức 10.000, và nó sẽ hỏng ở lần mở rộng TIẾP THEO chứ không phải trong lúc triển khai.',
          ),
        }),

        // ── Chương 11 — Mở rộng: nhân bản, Sentinel và Cluster ──────────
        mcq({
          prompt: B(
            'A client writes <code>SET order:9001 confirmed</code>, receives <code>+OK</code>, and one second later the primary&#x27;s host dies. A replica is promoted. What can you say about that order?',
            'Một client ghi <code>SET order:9001 confirmed</code>, nhận về <code>+OK</code>, và một giây sau thì máy chứa bản chính chết. Một bản sao được đề bạt lên. Bạn nói gì được về đơn hàng đó?',
          ),
          options: [
            B('It may be gone — replication is asynchronous, so the reply was sent before any replica had the write', 'Nó có thể đã mất — nhân bản là bất đồng bộ, nên kết quả trả về đã được gửi trước khi bất kỳ bản sao nào có được phép ghi ấy'),
            B('It is safe — a primary does not acknowledge a write until at least one replica has it', 'Nó an toàn — bản chính không xác nhận một phép ghi cho tới khi ít nhất một bản sao đã nhận'),
            B('It is safe if <code>appendfsync everysec</code> is enabled, because the AOF is replicated', 'Nó an toàn nếu bật <code>appendfsync everysec</code>, vì tệp AOF được nhân bản'),
            B('It is safe as long as <code>min-replicas-to-write 1</code> is set, which makes the write synchronous', 'Nó an toàn miễn là có đặt <code>min-replicas-to-write 1</code>, vì thiết lập đó làm phép ghi trở thành đồng bộ'),
          ],
          correct: 0,
          explanation: EX(
            'Redis replication is asynchronous by deliberate design: the primary applies the write, replies, and streams it to replicas afterwards. On a healthy LAN the exposure is sub-millisecond, but it is never zero, and a promotion during that window loses the write. The tools that narrow it are worth knowing precisely. <code>WAIT n timeout</code> blocks until <code>n</code> replicas confirm and <b>returns how many actually did</b> — it is a report, not a guarantee, and the write already happened before it ran; code that ignores the return value has bought latency and nothing else. <code>WAITAOF</code> (7.0) additionally waits for fsyncs. And option 4 needs correcting on its own terms: <code>min-replicas-to-write</code> only guarantees that replicas <em>existed and were recent</em> when the write was accepted — lag is measured by <code>REPLCONF ACK</code> pings once a second, so a replica that is connected but hopelessly behind on data still counts as good.',
            'Nhân bản của Redis bất đồng bộ theo thiết kế có chủ ý: bản chính áp dụng phép ghi, trả lời, rồi mới đẩy nó sang các bản sao. Trên một mạng LAN khoẻ thì khe hở dưới một mili giây, nhưng nó không bao giờ bằng không, và một lần đề bạt rơi vào đúng khe ấy sẽ làm mất phép ghi. Những công cụ thu hẹp khe hở đó đáng được nhớ cho chính xác. <code>WAIT n timeout</code> chặn cho tới khi <code>n</code> bản sao xác nhận và <b>trả về số bản sao thật sự đã xác nhận</b> — nó là một BÁO CÁO, không phải một bảo đảm, và phép ghi thì đã xảy ra trước khi nó chạy; mã nào bỏ qua giá trị trả về là đã mua thêm độ trễ mà chẳng được gì. <code>WAITAOF</code> (7.0) chờ thêm cả các lần fsync. Còn phương án 4 cần được đính chính theo đúng cách nói của nó: <code>min-replicas-to-write</code> chỉ bảo đảm rằng các bản sao <em>đã tồn tại và còn mới</em> vào lúc phép ghi được nhận — độ trễ được đo bằng nhịp <code>REPLCONF ACK</code> mỗi giây, nên một bản sao đang kết nối mà tụt hậu thảm hại về dữ liệu vẫn được tính là tốt.',
          ),
        }),

        mcq({
          prompt: B(
            'Three Sentinels monitor one primary with <code>sentinel monitor mymaster 10.0.1.5 6379 1</code>. A network blip makes one Sentinel see the primary as down. Does a failover happen?',
            'Ba Sentinel giám sát một bản chính với dòng <code>sentinel monitor mymaster 10.0.1.5 6379 1</code>. Một cú chớp mạng khiến một Sentinel thấy bản chính là đã chết. Có xảy ra chuyển đổi dự phòng không?',
          ),
          options: [
            B('Yes — <code>quorum 1</code> means a single Sentinel is authorised to fail over alone', 'Có — <code>quorum 1</code> nghĩa là một Sentinel đơn lẻ được phép tự chuyển đổi dự phòng'),
            B('No — the quorum only declares the primary objectively down; the failover itself still needs a <b>majority</b>, 2 of 3', 'Không — quorum chỉ tuyên bản chính là chết khách quan; bản thân phép chuyển đổi vẫn cần <b>đa số</b>, tức 2 trong 3'),
            B('No — a failover requires all three Sentinels to agree', 'Không — chuyển đổi dự phòng đòi cả ba Sentinel phải đồng ý'),
            B('Yes, but only after <code>failover-timeout</code> has elapsed twice', 'Có, nhưng chỉ sau khi <code>failover-timeout</code> đã trôi qua hai lần'),
          ],
          correct: 1,
          explanation: EX(
            'There are two separate numbers and conflating them is the classic Sentinel mistake. <b>SDOWN</b> is one Sentinel&#x27;s private opinion after <code>down-after-milliseconds</code>. <b>ODOWN</b> is reached when <code>quorum</code> Sentinels report SDOWN, and it starts a failover <em>attempt</em>. But electing the Sentinel that will perform it requires a majority of the entire set — 2 of 3, 3 of 5 — and that rule is what prevents two primaries appearing on either side of a network partition. So <code>quorum 1</code> lowers the bar for <em>declaring</em> the primary down while leaving the authorisation bar exactly where it was. This is also why three Sentinels on three separate hosts is the minimum real deployment. Rehearse it with <code>SENTINEL failover mymaster</code>, which performs a real failover with no vote needed because you are the authority.',
            'Có hai con số riêng biệt và lẫn lộn chúng là lỗi Sentinel kinh điển. <b>SDOWN</b> là ý kiến riêng của một Sentinel sau khoảng <code>down-after-milliseconds</code>. <b>ODOWN</b> đạt được khi có đủ <code>quorum</code> Sentinel cùng báo SDOWN, và nó khởi động một <em>nỗ lực</em> chuyển đổi. Nhưng để bầu ra Sentinel sẽ đứng ra thực hiện thì cần ĐA SỐ của cả tập — 2 trong 3, 3 trong 5 — và chính luật đó ngăn hai bản chính cùng xuất hiện ở hai phía một vết chia mạng. Vậy nên <code>quorum 1</code> hạ thấp cái ngưỡng để <em>TUYÊN BỐ</em> bản chính đã chết mà để nguyên cái ngưỡng cấp phép ở đúng chỗ cũ. Đây cũng là lý do ba Sentinel trên ba máy riêng biệt là mức triển khai thật tối thiểu. Hãy diễn tập bằng <code>SENTINEL failover mymaster</code>, lệnh này thực hiện một lần chuyển đổi thật mà không cần bỏ phiếu, vì lúc đó chính bạn là người có thẩm quyền.',
          ),
        }),

        mcq({
          prompt: B(
            'After moving to Redis Cluster, <code>MSET user:1 a user:2 b</code> starts returning <code>(error) CROSSSLOT Keys in request don&#x27;t hash to the same slot</code>. What is the fix, and what does it cost?',
            'Sau khi chuyển sang Redis Cluster, lệnh <code>MSET user:1 a user:2 b</code> bắt đầu trả về <code>(error) CROSSSLOT Keys in request don&#x27;t hash to the same slot</code>. Sửa thế nào, và cái giá là gì?',
          ),
          options: [
            B('Enable <code>cluster-require-full-coverage no</code>, which lets multi-key commands span slots', 'Bật <code>cluster-require-full-coverage no</code> để các lệnh nhiều khoá được trải qua nhiều slot'),
            B('Send the commands through <code>redis-cli -c</code>, which follows the redirects and reassembles the reply', 'Gửi lệnh qua <code>redis-cli -c</code>, nó sẽ đi theo các chỉ dẫn chuyển hướng rồi ráp lại kết quả'),
            B('Give the keys a hash tag like <code>{u1042}:profile</code> — only the first braces are hashed; the cost is that every key with that tag lives on one node', 'Đặt cho khoá một nhãn băm như <code>{u1042}:profile</code> — chỉ cặp ngoặc đầu tiên được băm; cái giá là mọi khoá mang nhãn ấy đều nằm trên một nút'),
            B('Wrap the writes in <code>MULTI</code> … <code>EXEC</code>, which routes the whole block to one node', 'Bọc các phép ghi vào <code>MULTI</code> … <code>EXEC</code>, cả khối sẽ được định tuyến về một nút'),
          ],
          correct: 2,
          explanation: EX(
            'A key&#x27;s slot is <code>CRC16(key) mod 16384</code>, and any command touching several keys requires them all to be in one slot — that covers <code>MGET</code>, <code>MSET</code>, <code>SINTER</code>, <code>ZUNIONSTORE</code>, <code>SMOVE</code>, <code>LMOVE</code>, <code>RENAME</code>, a <code>MULTI</code> block spanning keys, and any Lua script declaring several keys, so option 4 is wrong for the same reason the original command is. Hash tags let you force co-location by hashing only what is inside the first <code>{…}</code>: <code>{u1042}:profile</code> and <code>{u1042}:sessions</code> land on the same node. Tag by something genuinely small and self-contained — one user, one tenant, one document — because <code>{global}</code> is a working hash tag that undoes the entire cluster. Option 1 changes what happens when a slot is uncovered, not how keys are routed.',
            'Slot của một khoá là <code>CRC16(khoá) mod 16384</code>, và bất kỳ lệnh nào chạm tới nhiều khoá đều đòi tất cả chúng nằm chung một slot — điều đó bao gồm <code>MGET</code>, <code>MSET</code>, <code>SINTER</code>, <code>ZUNIONSTORE</code>, <code>SMOVE</code>, <code>LMOVE</code>, <code>RENAME</code>, một khối <code>MULTI</code> trải qua nhiều khoá, và mọi kịch bản Lua khai báo nhiều khoá — nên phương án 4 sai vì đúng cái lý do làm lệnh ban đầu sai. Nhãn băm cho phép bạn ép các khoá về chung một chỗ bằng cách chỉ băm phần nằm trong cặp <code>{…}</code> đầu tiên: <code>{u1042}:profile</code> và <code>{u1042}:sessions</code> rơi vào cùng một nút. Hãy gắn nhãn theo một thứ thật sự nhỏ và tự chứa — một người dùng, một khách thuê, một tài liệu — bởi <code>{global}</code> là một nhãn băm hoạt động hoàn hảo và nó phá bỏ toàn bộ ý nghĩa của cụm. Phương án 1 đổi chuyện xảy ra khi có slot không được phủ, chứ không đổi cách các khoá được định tuyến.',
          ),
        }),

        // ── Chương 12 — Chẩn đoán ───────────────────────────────────────
        mcq({
          prompt: B(
            'During an incident, <code>redis-cli --latency</code> shows an average of 88 ms with a max of 1204 ms, while <code>instantaneous_ops_per_sec</code> has <b>dropped</b> from its usual few thousand to 412. What does that combination point at?',
            'Trong một sự cố, <code>redis-cli --latency</code> cho thấy trung bình 88 ms với đỉnh 1204 ms, trong khi <code>instantaneous_ops_per_sec</code> đã <b>TỤT</b> từ mức vài nghìn thường ngày xuống còn 412. Tổ hợp đó chỉ vào cái gì?',
          ),
          options: [
            B('Genuine overload — the instance is saturated and needs more capacity', 'Quá tải thật sự — máy chủ đã bão hoà và cần thêm năng lực'),
            B('A network problem between the client and the server', 'Một vấn đề mạng giữa client và máy chủ'),
            B('One slow O(N) command blocking the single thread — <b>falling</b> throughput with rising latency is the fingerprint', 'Một lệnh O(N) chậm đang chặn cái luồng duy nhất — thông lượng <b>TỤT</b> mà độ trễ tăng chính là dấu vân tay'),
            B('Memory pressure — evictions are consuming the command thread', 'Sức ép bộ nhớ — việc đẩy khoá đang ngốn hết luồng lệnh'),
          ],
          correct: 2,
          explanation: EX(
            'This is the single most useful pairing on a Redis dashboard, which is why the two should be graphed together: <b>the combination is the diagnosis</b>. High latency <em>with</em> high ops/s is real load. High latency with <em>falling</em> ops/s means the thread is stuck inside one command and everyone else is queued behind it — the classic offenders being <code>KEYS</code>, <code>SMEMBERS</code>, <code>HGETALL</code>, <code>LRANGE 0 -1</code>, an exact <code>XTRIM</code> or a looping Lua script. Confirm with <code>SLOWLOG GET 5</code> (microseconds — 214882 is 215 ms) and with <code>INFO commandstats</code>, where <code>usec_per_call</code> names the guilty command outright. If the slowlog is <em>empty</em> during multi-second stalls, suspect a fork instead and check <code>latest_fork_usec</code> and <code>LATENCY LATEST</code> — no command was slow, the whole process was stopped.',
            'Đây là cặp số hữu dụng nhất trên một bảng điều khiển Redis, và đó là lý do nên vẽ hai đường ấy cạnh nhau: <b>chính tổ hợp mới là lời chẩn đoán</b>. Độ trễ cao ĐI KÈM thông lượng cao là tải thật. Độ trễ cao đi kèm thông lượng ĐANG TỤT nghĩa là cái luồng đang kẹt bên trong một câu lệnh và mọi người khác xếp hàng phía sau — những thủ phạm kinh điển là <code>KEYS</code>, <code>SMEMBERS</code>, <code>HGETALL</code>, <code>LRANGE 0 -1</code>, một lệnh <code>XTRIM</code> chính xác, hoặc một kịch bản Lua lặp vô tận. Hãy xác nhận bằng <code>SLOWLOG GET 5</code> (đơn vị micro giây — 214882 là 215 ms) và bằng <code>INFO commandstats</code>, nơi cột <code>usec_per_call</code> chỉ thẳng vào câu lệnh có tội. Nếu slowlog RỖNG trong lúc có những cú đứng hình nhiều giây thì hãy nghi một lần fork và đi xem <code>latest_fork_usec</code> cùng <code>LATENCY LATEST</code> — không câu lệnh nào chậm cả, cả tiến trình đã bị dừng.',
          ),
        }),

        mcq({
          prompt: B(
            'Your team disagrees about whether a latency problem is Redis or the machine it runs on. Which measurement settles it, and where must it be run?',
            'Nhóm của bạn tranh cãi xem một vấn đề độ trễ là do Redis hay do cái máy nó đang chạy trên đó. Phép đo nào phân xử được, và phải chạy nó ở đâu?',
          ),
          options: [
            B('<code>redis-cli --latency-history -i 10</code> from your laptop, compared against the production graph', '<code>redis-cli --latency-history -i 10</code> chạy từ máy tính của bạn, đem so với đồ thị trên production'),
            B('<code>redis-cli --intrinsic-latency 30</code>, run <b>on the Redis host</b> — it measures the machine&#x27;s own scheduling floor, with no Redis involved', '<code>redis-cli --intrinsic-latency 30</code>, chạy <b>TRÊN CHÍNH MÁY CHỦ REDIS</b> — nó đo cái sàn lập lịch của bản thân cái máy, không dính gì tới Redis'),
            B('<code>MONITOR</code> piped through <code>grep</code>, to see which commands arrive during the spikes', '<code>MONITOR</code> đẩy qua <code>grep</code>, để xem những lệnh nào tới trong lúc có cú vọt'),
            B('<code>MEMORY DOCTOR</code>, which reports whether the host is under memory pressure', '<code>MEMORY DOCTOR</code>, nó báo xem máy có đang chịu sức ép bộ nhớ hay không'),
          ],
          correct: 1,
          explanation: EX(
            '<code>--intrinsic-latency</code> does not talk to Redis at all — it busy-loops and measures how long the kernel takes to give the CPU back, which is the machine&#x27;s own floor. Run on the Redis host it answers the only question that matters at that moment: is the server slow, or is the server <em>on</em> something slow? A noisy neighbour, an oversubscribed hypervisor or THP will show up here, and no amount of Redis tuning fixes any of them. Running it from your laptop, as option 1 does, measures your laptop. Option 3 is actively harmful during an incident: the Redis documentation puts <code>MONITOR</code>&#x27;s throughput cost at roughly 50%, its output buffer counts toward <code>maxmemory</code>, and it prints every key and value including session tokens — prefer <code>INFO commandstats</code> sampled twice and diffed, which answers "what is this instance actually doing" better and costs nothing.',
            '<code>--intrinsic-latency</code> hoàn toàn không nói chuyện với Redis — nó chạy một vòng lặp bận rồi đo xem nhân hệ điều hành mất bao lâu để trả CPU lại, tức là cái sàn của chính cái máy. Chạy trên máy chủ Redis, nó trả lời đúng câu hỏi duy nhất có ý nghĩa lúc đó: máy chủ chậm, hay máy chủ đang nằm TRÊN một thứ chậm? Một hàng xóm ồn ào, một trình ảo hoá bị bán quá chỗ, hay THP đều sẽ hiện ra ở đây, và không phép tinh chỉnh Redis nào sửa được bất kỳ thứ nào trong số đó. Chạy nó từ máy tính của bạn, như phương án 1, là đo cái máy tính của bạn. Phương án 3 còn gây hại chủ động trong lúc có sự cố: tài liệu Redis ước tính <code>MONITOR</code> lấy đi khoảng 50% thông lượng, bộ đệm đầu ra của nó tính vào <code>maxmemory</code>, và nó in ra mọi khoá cùng mọi giá trị kể cả token phiên — hãy ưu tiên <code>INFO commandstats</code> lấy mẫu hai lần rồi trừ nhau, cách ấy trả lời câu "máy chủ này thật ra đang làm gì" tốt hơn và không tốn gì.',
          ),
        }),
      ],
    },
  ],
};
