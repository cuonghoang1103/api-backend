/**
 * Redis — Progress Test 1 (chương s00–s04).
 *
 * Đề tự soạn, bám sát giáo trình `content/courses/redis/s00…s04`. 30 câu trắc
 * nghiệm + 2 câu lập trình làm ngay trong phòng thi (chấm bằng AI theo rubric).
 *
 * ⚠️ MỌI transcript `redis-cli`, mọi giá trị trả về, mọi `OBJECT ENCODING` và
 * mọi `CONFIG GET` trong đề đều CHẠY THẬT trên một máy chủ nháp dựng bằng
 * `docker run -d --name redis-de-thi-pt -p 63799:6379 redis:7-alpine`,
 * báo `redis_version:7.4.9`, `redis_mode:standalone`, `os:Linux 6.12.76-linuxkit
 * aarch64`. Câu về nhân bản đo trên một replica thật (container thứ hai chạy
 * `--replicaof`, `master_link_status:up`, `connected_slaves:1`). Container đã
 * `docker rm -f` sau khi đo xong.
 *
 * ⚠️ NĂM CHỖ MÁY KHÁC GIÁO TRÌNH — đề lấy theo MÁY:
 *   • `hash-max-listpack-entries` trên ảnh chính thức 7.4.9 là **512**, không
 *     phải 128 như bài 0.3 nói. Đo: hash 129 trường vẫn `listpack`, 513 trường
 *     mới thành `hashtable`. (Ngưỡng GIÁ TRỊ 64 byte thì đúng: 64 → listpack,
 *     65 → hashtable.)
 *   • `list-max-listpack-size` mặc định là **-2** (giới hạn theo 8KB mỗi nút),
 *     không phải 128 như bài 4.1 nói. Đo: list 129 phần tử vẫn `listpack`,
 *     2000 phần tử mới thành `quicklist`.
 *   • Bài 4.5 in `OBJECT ENCODING vn` = `skiplist` cho một khoá geo **3 thành
 *     viên**. Máy trả `listpack` — đúng như chính bài 4.3 đã dạy (dưới 128 phần
 *     tử thì zset là listpack). Phải hơn 128 thành viên mới ra `skiplist`.
 *   • Ba con số geo của bài 4.5 đều lệch: `ZSCORE vn hanoi` máy trả
 *     `3973593206939046` (bài ghi 3981230787217013), `GEODIST vn hanoi hcmc km`
 *     trả `1145.2568` (bài ghi 1140.4899, đo lại 3 lượt đều 1145.2568), và
 *     `GEOSEARCH … BYRADIUS 400 km WITHDIST` trả `danang 237.5209` (bài ghi
 *     224.4431). Kiểm chéo bằng tay: 108,2208 − 106,0 = 2,2208° kinh độ ở vĩ độ
 *     16° ≈ 237,6 km ⇒ máy đúng, giáo trình sai.
 *   • Bài 1.1 bảo chạy `DEBUG SLEEP 3` để thấy máy chủ bị chặn. Từ Redis 7,
 *     `DEBUG` **bị tắt mặc định** (`ERR DEBUG command not allowed…`); phải khởi
 *     động lại với `--enable-debug-command yes` mới chạy được. Đã dựng riêng
 *     một container có cờ đó để đo (xem câu 4) rồi xoá.
 *
 * ⚠️ ĐỀ KHÔNG HỎI SỐ ĐO THỜI GIAN. Máy đo đang chạy nhiều việc song song nên
 * mọi con số mili-giây đều trôi; câu 4 chỉ hỏi CƠ CHẾ, không hỏi con số. Riêng
 * đợt hết hạn hàng loạt: bài 2.2 đo 8 giây để xoá hết 200.000 khoá, máy này chỉ
 * mất ~1 giây — khác máy, không phải khác cơ chế, nên câu 11 hỏi hiện tượng
 * (DBSIZE KHÔNG tụt về 0 ngay khi TTL trôi qua) chứ không hỏi mấy giây.
 *
 * Phân bố: s00 ×3 · s01 ×6 · s02 ×6 · s03 ×7 · s04 ×8 = 30 câu trắc nghiệm,
 * cộng 2 câu lập trình (SCAN an toàn — chương 2; giới hạn tần suất — chương 3).
 * Vị trí đáp án A/B/C/D = 7/8/8/7 (đếm bằng lệnh trong CLAUDE.md).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/REDIS-PT1.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/redis-exam-kit.mjs';

export default {
  course: { slug: 'redis' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Chapters 0–4 (setup, the execution model, keys and TTL, strings, collections)',
        'Kiểm tra tiến độ 1 — Chương 0–4 (cài đặt, mô hình thực thi, khoá và TTL, chuỗi, các cấu trúc tập hợp)',
      ),
      description: B(
        'The first third of the Redis course: what Redis is for and how to start one safely, the single thread and the RESP protocol, key naming, TTL and safe deletion, strings, counters, bitmaps and HyperLogLog, and lists, sets and sorted sets. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba đầu của khoá Redis: Redis dùng để làm gì và khởi động nó thế nào cho an toàn, một luồng và giao thức RESP, đặt tên khoá, TTL và xoá an toàn, chuỗi, bộ đếm, bitmap và HyperLogLog, rồi list, set và sorted set. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '0–4'),
      questions: [
        // ── Chương 0 — Redis giải quyết gì, và dựng nó ─────────────────
        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, on a key that has never had an expiry. Fill in the three missing replies.' + code(
              '> SET k v\n' +
              'OK\n' +
              '> TTL k\n' +
              '?\n' +
              '> TTL nosuchkey\n' +
              '?\n' +
              '> PERSIST k\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9, với một khoá chưa từng có hạn. Điền ba dòng trả lời còn thiếu.' + code(
              '> SET k v\n' +
              'OK\n' +
              '> TTL k\n' +
              '?\n' +
              '> TTL nosuchkey\n' +
              '?\n' +
              '> PERSIST k\n' +
              '?',
            ),
          ),
          options: [
            B('<code>0</code>, then <code>0</code>, then <code>(integer) 0</code>', '<code>0</code>, rồi <code>0</code>, rồi <code>(integer) 0</code>'),
            B('<code>(integer) -1</code>, then <code>(integer) -2</code>, then <code>(integer) 0</code>', '<code>(integer) -1</code>, rồi <code>(integer) -2</code>, rồi <code>(integer) 0</code>'),
            B('<code>(integer) -1</code>, then <code>(integer) -1</code>, then <code>(integer) 1</code>', '<code>(integer) -1</code>, rồi <code>(integer) -1</code>, rồi <code>(integer) 1</code>'),
            B('<code>(nil)</code>, then <code>(nil)</code>, then <code>(integer) 1</code>', '<code>(nil)</code>, rồi <code>(nil)</code>, rồi <code>(integer) 1</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Three return values worth memorising on day one. <code>TTL</code> gives <b>-1</b> for a key that exists with no expiry and <b>-2</b> for a key that does not exist at all — those two are completely different facts and application code constantly conflates them, because both are "falsy" and both mean "no number of seconds". <code>PERSIST</code> returns 1 only when it actually removed a TTL; here there was none, so it returns 0 without touching anything.',
            'Ba giá trị trả về đáng thuộc lòng ngay ngày đầu. <code>TTL</code> trả <b>-1</b> cho khoá CÓ TỒN TẠI nhưng không đặt hạn, và <b>-2</b> cho khoá KHÔNG tồn tại — hai sự thật hoàn toàn khác nhau, mà mã ứng dụng gộp nhầm chúng suốt, vì cả hai đều "giả" và đều nghĩa là "không có số giây nào". <code>PERSIST</code> chỉ trả 1 khi nó THẬT SỰ gỡ được một TTL; ở đây chẳng có TTL nào nên nó trả 0 và không đụng vào gì cả.',
          ),
        }),

        mcq({
          prompt: B(
            'A VPS has UFW configured to deny port 6379 from the outside. Redis is started with' + code(
              'docker run -d --name redis -p 6379:6379 redis:7.4-alpine',
            ) + 'and has no password. What is the actual exposure?',
            'Một VPS đã cấu hình UFW chặn cổng 6379 từ bên ngoài. Redis được khởi động bằng' + code(
              'docker run -d --name redis -p 6379:6379 redis:7.4-alpine',
            ) + 'và không đặt mật khẩu nào. Mức phơi bày thực tế là gì?',
          ),
          options: [
            B('Safe: UFW denies the port, and Docker publishes behind the host firewall like any other service', 'An toàn: UFW đã chặn cổng, và Docker công bố cổng nằm sau tường lửa của máy chủ như mọi dịch vụ khác'),
            B('Safe: with no password Redis refuses every connection that does not come from localhost', 'An toàn: không có mật khẩu thì Redis từ chối mọi kết nối không xuất phát từ localhost'),
            B('Exposed: Docker writes its own NAT rules that bypass UFW, so 6379 is open to the internet', 'Bị phơi ra: Docker tự ghi luật NAT riêng đi vòng qua UFW, nên cổng 6379 mở ra cả internet'),
            B('Exposed, but only to other containers on the same Docker bridge network, not to the internet', 'Bị phơi ra, nhưng chỉ với các container khác trên cùng mạng bridge của Docker, không ra internet'),
          ],
          correct: 2,
          explanation: EX(
            'Docker inserts its port-publishing rules into the <code>DOCKER</code> chain ahead of the chain UFW manages, so <code>-p 6379:6379</code> publishes on every interface regardless of what UFW says. Internet-wide scanners look for exactly this, and an open Redis is not just readable — it can be told to write its dump file into <code>~/.ssh/authorized_keys</code>, which turns a cache into a shell. The fix is one prefix: <code>-p 127.0.0.1:6379:6379</code>, plus a password anyway.',
            'Docker chèn luật công bố cổng của nó vào chuỗi <code>DOCKER</code>, đứng TRƯỚC chuỗi mà UFW quản, nên <code>-p 6379:6379</code> công bố trên mọi giao diện mạng bất kể UFW nói gì. Máy quét cả internet tìm đúng thứ này, và một Redis mở không chỉ bị đọc — nó còn có thể bị bảo ghi file dump vào <code>~/.ssh/authorized_keys</code>, biến một bộ đệm thành một cái shell. Cách chữa là thêm đúng một tiền tố: <code>-p 127.0.0.1:6379:6379</code>, và vẫn nên đặt mật khẩu.',
          ),
        }),

        mcq({
          prompt: B(
            'An engineer runs <code>CONFIG SET maxmemory 512mb</code> and confirms it with <code>CONFIG GET maxmemory</code>. The setting works for three weeks and then disappears after an unrelated restart, with nobody remembering it was ever set. What was missing?',
            'Một kỹ sư chạy <code>CONFIG SET maxmemory 512mb</code> và xác nhận lại bằng <code>CONFIG GET maxmemory</code>. Thiết lập chạy tốt ba tuần rồi biến mất sau một lần khởi động lại chẳng liên quan, và không ai còn nhớ nó từng được đặt. Thiếu bước nào?',
          ),
          options: [
            B('<code>CONFIG REWRITE</code>, which writes the running value back into the config file', '<code>CONFIG REWRITE</code>, lệnh ghi giá trị đang chạy ngược trở lại file cấu hình'),
            B('<code>BGSAVE</code>, because settings live in the RDB snapshot alongside the data', '<code>BGSAVE</code>, vì các thiết lập nằm trong ảnh chụp RDB cùng với dữ liệu'),
            B('<code>CONFIG SET maxmemory-policy</code>, without which the memory cap is discarded on restart', '<code>CONFIG SET maxmemory-policy</code>, thiếu nó thì trần bộ nhớ bị bỏ đi lúc khởi động lại'),
            B('<code>CLIENT NO-EVICT off</code>, which is what actually persists a memory limit across restarts', '<code>CLIENT NO-EVICT off</code>, đây mới là thứ thật sự giữ được trần bộ nhớ qua các lần khởi động lại'),
          ],
          correct: 0,
          explanation: EX(
            '<code>CONFIG SET</code> changes the <em>running</em> server and nothing else; <code>CONFIG REWRITE</code> persists it back into <code>redis.conf</code> so it survives a restart. Forgetting the second command is the standard way a setting quietly evaporates months later during unrelated maintenance. One useful side effect: if Redis was started without a config file, <code>CONFIG REWRITE</code> returns an error — which itself tells you how the instance was launched, and that no configuration you make by hand can survive.',
            '<code>CONFIG SET</code> chỉ đổi máy chủ ĐANG CHẠY, không gì hơn; <code>CONFIG REWRITE</code> mới ghi nó trở lại <code>redis.conf</code> để sống sót qua lần khởi động lại. Quên lệnh thứ hai là cách kinh điển khiến một thiết lập bốc hơi âm thầm nhiều tháng sau, trong một lần bảo trì chẳng dính dáng. Một tác dụng phụ có ích: nếu Redis khởi động mà không có file cấu hình thì <code>CONFIG REWRITE</code> trả về lỗi — và chính cái lỗi đó cho bạn biết instance được khởi động kiểu gì, và rằng không cấu hình tay nào sống nổi.',
          ),
        }),

        // ── Chương 1 — Mô hình thực thi ─────────────────────────────────
        mcq({
          prompt: B(
            'Measured on Redis 7.4.9 (started with <code>--enable-debug-command yes</code>, because DEBUG is disabled by default since Redis 7). One client ran <code>DEBUG SLEEP 3</code>. A second client sent <code>PING</code> 1006 ms later and got <code>PONG</code> back 2100 ms after that. What does the pair of numbers demonstrate?',
            'Đo thật trên Redis 7.4.9 (khởi động kèm <code>--enable-debug-command yes</code>, vì từ Redis 7 lệnh DEBUG bị tắt mặc định). Một client chạy <code>DEBUG SLEEP 3</code>. Một client khác gửi <code>PING</code> sau đó 1006 ms và nhận được <code>PONG</code> sau thêm 2100 ms nữa. Cặp số đó chứng minh điều gì?',
          ),
          options: [
            B('The PING was queued by the client library, which retries every two seconds after a failure', 'Lệnh PING bị chính thư viện client xếp hàng lại, và nó thử lại mỗi hai giây sau mỗi lần hỏng'),
            B('The two clients were served by different threads and the second thread was busy elsewhere', 'Hai client được hai luồng khác nhau phục vụ, và luồng thứ hai lúc ấy đang bận việc khác'),
            B('DEBUG SLEEP holds a lock on the keyspace, so reads are blocked while writes go through', 'DEBUG SLEEP giữ một khoá trên không gian khoá, nên phép đọc bị chặn còn phép ghi thì vẫn qua'),
            B('One thread executes commands, so the PING waited out exactly the remainder of the sleep', 'Chỉ một luồng thực thi lệnh, nên PING phải chờ đúng bằng phần còn lại của lệnh ngủ'),
          ],
          correct: 3,
          explanation: EX(
            '1006 + 2100 ≈ 3106 ms, which is the sleep. The <code>PING</code> did not fail, was not retried and was not slow — it simply could not be executed until the single thread was free, and that is the whole trade of the execution model: one slow command is not slow for one client, it is slow for <em>every</em> client, including your health check and your connection pool. This is why the complexity line in the command reference is an operational fact rather than trivia.',
            '1006 + 2100 ≈ 3106 ms, đúng bằng lệnh ngủ. <code>PING</code> không hề hỏng, không hề bị thử lại, cũng không hề chậm — nó chỉ đơn giản là không thể được thực thi cho tới khi cái luồng duy nhất rảnh ra, và đó là toàn bộ sự đánh đổi của mô hình thực thi: một lệnh chậm không chậm cho MỘT client, nó chậm cho MỌI client, kể cả health check và connection pool của bạn. Vì thế dòng ghi độ phức tạp trong tài liệu lệnh là một sự thật vận hành chứ không phải chuyện vặt.',
          ),
        }),

        mcq({
          prompt: B(
            'Redis really does have several threads (<code>ps</code> shows four). Which statement about them is correct?',
            'Redis thật sự có vài luồng (lệnh <code>ps</code> hiện ra bốn cái). Phát biểu nào về chúng là ĐÚNG?',
          ),
          options: [
            B('They are worker threads: each connected client is assigned one for the duration of its session', 'Chúng là luồng thợ: mỗi client kết nối vào được cấp một luồng trong suốt phiên làm việc của nó'),
            B('They exist only while a replica is attached; a standalone instance really is a single thread', 'Chúng chỉ tồn tại khi có một replica đang gắn vào; máy chủ đứng một mình thì đúng là chỉ một luồng'),
            B('They are the io-threads, which are enabled by default from Redis 6.0 and run commands in parallel', 'Chúng chính là io-threads, bật sẵn từ Redis 6.0 và thực thi các câu lệnh song song với nhau'),
            B('They handle AOF fsync, closing files and freeing large objects — none of them executes a command', 'Chúng lo fsync cho AOF, đóng file và giải phóng đối tượng lớn — không cái nào thực thi câu lệnh cả'),
          ],
          correct: 3,
          explanation: EX(
            'The background threads are <code>bio_aof_fsync</code> (flushing the append-only file), <code>bio_close_file</code> (a <code>close()</code> on a large old AOF can take milliseconds) and <code>bio_lazy_free</code> (which is what makes <code>UNLINK</code> cheap on a huge collection). Optional <code>io-threads</code> parallelise reading and writing <em>sockets</em> only, are off by default, and still never execute a command. Measured here: <code>CONFIG GET io-threads</code> returns 1. That is why adding CPU cores does not make Redis faster.',
            'Các luồng nền là <code>bio_aof_fsync</code> (đẩy file append-only xuống đĩa), <code>bio_close_file</code> (một lệnh <code>close()</code> trên file AOF cũ cỡ lớn có thể tốn vài mili giây) và <code>bio_lazy_free</code> (chính là thứ làm <code>UNLINK</code> rẻ trên một tập hợp khổng lồ). <code>io-threads</code> tuỳ chọn chỉ song song hoá việc đọc-ghi SOCKET, mặc định tắt, và vẫn không bao giờ thực thi câu lệnh. Đo tại chỗ: <code>CONFIG GET io-threads</code> trả về 1. Đó là lý do thêm nhân CPU không làm Redis nhanh hơn.',
          ),
        }),

        mcq({
          prompt: B(
            'Four commands were sent to a real server over a raw TCP socket, and the reply bytes were dumped with <code>cat -A</code> (so <code>$</code> marks each line ending):' + code(
              'GET greeting   ->  $5\n' +
              '                   hello\n' +
              'LLEN nolist    ->  :0\n' +
              'GET nokey      ->  $-1\n' +
              'SMEMBERS noset ->  *0',
            ) + 'What are the last two replies?',
            'Bốn lệnh được gửi tới một máy chủ thật qua socket TCP trần, và các byte trả lời được đổ ra bằng <code>cat -A</code> (nên <code>$</code> đánh dấu chỗ kết thúc dòng):' + code(
              'GET greeting   ->  $5\n' +
              '                   hello\n' +
              'LLEN nolist    ->  :0\n' +
              'GET nokey      ->  $-1\n' +
              'SMEMBERS noset ->  *0',
            ) + 'Hai dòng trả lời cuối cùng là gì?',
          ),
          options: [
            B('Both are errors: RESP has no way to encode "absent", so a missing key is reported as a failure', 'Cả hai đều là lỗi: RESP không có cách mã hoá "vắng mặt", nên khoá thiếu bị báo là một thất bại'),
            B('A nil bulk string (a missing key) and an empty array (a set with no members, or no key)', 'Một bulk string nil (khoá không tồn tại) và một mảng rỗng (set không có thành viên, hoặc không có khoá)'),
            B('An integer of value minus one, and an array whose declared element count is being omitted', 'Một số nguyên có giá trị âm một, và một mảng mà số phần tử khai báo đang bị lược đi'),
            B('A bulk string of length one holding the character <code>-</code>, and a nil array of unknown size', 'Một bulk string dài một byte chứa ký tự <code>-</code>, và một mảng nil chưa rõ kích thước'),
          ],
          correct: 1,
          explanation: EX(
            'A bulk string is a length prefix then exactly that many bytes, and the special length <code>-1</code> means nil — so <code>$-1</code> is how "this key does not exist" travels on the wire. An array is a count then that many elements, so <code>*0</code> is an empty array, which is what a collection command returns for a missing key: Redis makes no distinction between "an empty set" and "no set", because in Redis an empty collection is deleted. Your client library turns the first into <code>null</code> and the second into <code>[]</code>, and code that treats them the same eventually gets it wrong.',
            'Bulk string là một tiền tố độ dài rồi đúng chừng ấy byte, và độ dài đặc biệt <code>-1</code> nghĩa là nil — nên <code>$-1</code> chính là cách "khoá này không tồn tại" đi trên đường dây. Mảng là một số đếm rồi chừng ấy phần tử, nên <code>*0</code> là mảng rỗng, đúng thứ mà lệnh tập hợp trả về cho một khoá không có: Redis không phân biệt "set rỗng" với "không có set", vì trong Redis một tập hợp rỗng thì bị xoá luôn. Thư viện client của bạn biến cái thứ nhất thành <code>null</code> và cái thứ hai thành <code>[]</code>, và mã coi hai thứ đó như nhau sớm muộn cũng sai.',
          ),
        }),

        mcq({
          prompt: B(
            'A client wrapper checks errors like this:' + code(
              "if (err.message === 'WRONGTYPE Operation against a key holding the wrong kind of value') { … }\n" +
              'else throw err;',
            ) + 'Two problems with it. Which pair is correct?',
            'Một lớp bọc client kiểm tra lỗi như thế này:' + code(
              "if (err.message === 'WRONGTYPE Operation against a key holding the wrong kind of value') { … }\n" +
              'else throw err;',
            ) + 'Nó có hai vấn đề. Cặp nào ĐÚNG?',
          ),
          options: [
            B('Errors are not strings in RESP3, and WRONGTYPE is deprecated in favour of a numeric error code', 'Trong RESP3 lỗi không còn là chuỗi, và WRONGTYPE đã bị bỏ để thay bằng một mã lỗi dạng số'),
            B('Error messages are localised per client, and any comparison should be done on the key name instead', 'Thông điệp lỗi được dịch theo từng client, và phép so sánh lẽ ra phải làm trên tên khoá'),
            B('Only the first word of an error is stable, and LOADING and READONLY should be retried, not thrown', 'Chỉ từ ĐẦU TIÊN của lỗi là ổn định, và LOADING với READONLY phải được thử lại chứ không phải ném ra'),
            B('The comparison should use <code>startsWith</code>, and every error Redis returns is safe to retry once', 'Phép so sánh nên dùng <code>startsWith</code>, và mọi lỗi Redis trả về đều an toàn để thử lại một lần'),
          ],
          correct: 2,
          explanation: EX(
            'The first word of a Redis error is the machine-readable contract — <code>WRONGTYPE</code>, <code>NOSCRIPT</code>, <code>OOM</code>, <code>READONLY</code>, <code>MOVED</code>, <code>LOADING</code> — and only that word is stable across versions; the sentence after it is prose and gets reworded. The second half matters for uptime: <code>LOADING</code> means the server is still reading its dataset after a restart and <code>READONLY</code> means you sent a write to a replica after a failover. Both are temporary. A client that treats every error as fatal turns a routine restart into an outage.',
            'Từ đầu tiên của một lỗi Redis mới là phần hợp đồng máy đọc được — <code>WRONGTYPE</code>, <code>NOSCRIPT</code>, <code>OOM</code>, <code>READONLY</code>, <code>MOVED</code>, <code>LOADING</code> — và chỉ mỗi từ đó là ổn định qua các phiên bản; câu chữ đằng sau là văn xuôi và sẽ bị viết lại. Nửa sau mới quyết định thời gian sống: <code>LOADING</code> nghĩa là máy chủ còn đang nạp dữ liệu sau khi khởi động lại, còn <code>READONLY</code> nghĩa là bạn gửi lệnh ghi vào một replica sau một lần chuyển vai. Cả hai đều tạm thời. Client coi mọi lỗi là chí tử sẽ biến một lần khởi động lại bình thường thành một sự cố.',
          ),
        }),

        mcq({
          prompt: B(
            'A migration script must write one million keys. An engineer proposes one pipeline of 100,000 commands per batch instead of 200 batches of 500. Why is the large batch worse?',
            'Một script di trú phải ghi một triệu khoá. Một kỹ sư đề xuất mỗi lô là một pipeline 100.000 lệnh, thay vì 200 lô mỗi lô 500 lệnh. Vì sao lô lớn lại tệ hơn?',
          ),
          options: [
            B('Every queued reply sits in the server output buffer, and the batch blocks all other clients while it runs', 'Mọi phản hồi xếp hàng đều nằm trong bộ đệm ra của máy chủ, và cả lô chặn mọi client khác trong lúc nó chạy'),
            B('Redis refuses any pipeline above 65,535 commands and returns a protocol error for the whole batch', 'Redis từ chối mọi pipeline quá 65.535 lệnh và trả về một lỗi giao thức cho toàn bộ lô đó'),
            B('A large pipeline is executed out of order, so later writes can overwrite earlier ones unpredictably', 'Pipeline lớn được thực thi không theo thứ tự, nên lệnh ghi sau có thể đè lệnh trước một cách khó lường'),
            B('Each command in a pipeline is retried individually on failure, so a big batch multiplies retry traffic', 'Mỗi lệnh trong pipeline được thử lại riêng khi hỏng, nên lô lớn nhân lên lượng lưu lượng thử lại'),
          ],
          correct: 0,
          explanation: EX(
            'Pipelining removes the round trip, which is where nearly all the time goes — but the server still builds every reply in memory before the client reads any of them, and it still executes the whole batch as one uninterrupted run. So a 100,000-command pipeline is both a memory spike and 100,000 commands of blocking for everyone else. Going from 1 command to 100 removes 99% of the round trips; going from 100 to 100,000 removes another 0.99% and buys you both problems. 100–1000 per batch is the useful range, and it is exactly what <code>redis-cli --pipe</code> does internally.',
            'Pipeline gỡ bỏ vòng đi-về, chỗ ngốn gần hết thời gian — nhưng máy chủ vẫn dựng MỌI phản hồi trong bộ nhớ trước khi client đọc cái nào, và vẫn thực thi cả lô như một mạch liền không ngắt. Nên một pipeline 100.000 lệnh vừa là một cú vọt bộ nhớ, vừa là 100.000 lệnh chặn đường mọi người khác. Từ 1 lệnh lên 100 đã gỡ được 99% số vòng đi-về; từ 100 lên 100.000 gỡ thêm 0,99% nữa và mua về cả hai vấn đề trên. Khoảng hữu ích là 100–1000 lệnh mỗi lô, đúng thứ mà <code>redis-cli --pipe</code> tự làm bên trong.',
          ),
        }),

        mcq({
          prompt: B(
            'An application shares one Redis client across the process. An invalidation listener is added at startup and, from then on, every cache read in the process fails with <code>ERR Can&#39;t execute &#39;get&#39;: only (P)SUBSCRIBE …</code>. What happened, and what is the one-line fix?',
            'Một ứng dụng dùng chung một client Redis cho cả tiến trình. Một bộ lắng nghe vô hiệu hoá cache được thêm vào lúc khởi động, và từ đó mọi phép đọc cache trong tiến trình đều hỏng với lỗi <code>ERR Can&#39;t execute &#39;get&#39;: only (P)SUBSCRIBE …</code>. Chuyện gì đã xảy ra, và sửa bằng một dòng thế nào?',
          ),
          options: [
            B('The listener consumed the connection pool; raise the pool size above the number of subscriptions', 'Bộ lắng nghe đã ăn hết connection pool; hãy nâng kích thước pool lên cao hơn số lượng subscription'),
            B('SUBSCRIBE requires authentication to be repeated; call <code>AUTH</code> again after subscribing', 'SUBSCRIBE đòi phải xác thực lại; hãy gọi <code>AUTH</code> một lần nữa sau khi đăng ký kênh'),
            B('The server disabled string commands while a subscriber exists; set <code>protected-mode no</code>', 'Máy chủ tắt các lệnh chuỗi khi đang có subscriber; hãy đặt <code>protected-mode no</code>'),
            B('On RESP2 a subscribed connection accepts only subscribe commands; use <code>redis.duplicate()</code>', 'Trên RESP2 một kết nối đã đăng ký chỉ nhận lệnh liên quan tới subscribe; hãy dùng <code>redis.duplicate()</code>'),
          ],
          correct: 3,
          explanation: EX(
            'On RESP2 the connection enters subscribe mode and refuses everything else — so the moment your listener starts, the shared client stops being able to read. The diagnostic is <code>CLIENT LIST</code> and a look for <code>sub=1</code>, which points straight at the connection that was taken over. The fix is a second socket: <code>const sub = redis.duplicate()</code>. The same rule applies to every blocking consumer — <code>BLPOP</code>, <code>BLMOVE</code>, <code>XREAD BLOCK</code>, <code>WAIT</code> and <code>MONITOR</code> each hold their connection for the duration and need one of their own.',
            'Trên RESP2 kết nối chuyển sang chế độ subscribe và từ chối mọi thứ khác — nên ngay khi bộ lắng nghe khởi động, client dùng chung hết đọc được. Cách chẩn là chạy <code>CLIENT LIST</code> rồi tìm <code>sub=1</code>, nó chỉ thẳng vào kết nối đã bị chiếm. Cách chữa là một socket thứ hai: <code>const sub = redis.duplicate()</code>. Quy tắc ấy áp cho mọi lệnh chặn — <code>BLPOP</code>, <code>BLMOVE</code>, <code>XREAD BLOCK</code>, <code>WAIT</code> và <code>MONITOR</code> đều giữ kết nối suốt thời gian chạy và đều cần một kết nối riêng.',
          ),
        }),

        // ── Chương 2 — Khoá, TTL và hết hạn ─────────────────────────────
        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. Fill in the two missing replies.' + code(
              '> SET a v EX 100\n' +
              'OK\n' +
              '> APPEND a "!"\n' +
              '(integer) 2\n' +
              '> TTL a\n' +
              '?\n' +
              '> SET b v EX 100\n' +
              'OK\n' +
              '> GETSET b new\n' +
              '"v"\n' +
              '> TTL b\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9. Điền hai dòng trả lời còn thiếu.' + code(
              '> SET a v EX 100\n' +
              'OK\n' +
              '> APPEND a "!"\n' +
              '(integer) 2\n' +
              '> TTL a\n' +
              '?\n' +
              '> SET b v EX 100\n' +
              'OK\n' +
              '> GETSET b new\n' +
              '"v"\n' +
              '> TTL b\n' +
              '?',
            ),
          ),
          options: [
            B('<code>(integer) 100</code>, then <code>(integer) -1</code>', '<code>(integer) 100</code>, rồi <code>(integer) -1</code>'),
            B('<code>(integer) -1</code>, then <code>(integer) 100</code>', '<code>(integer) -1</code>, rồi <code>(integer) 100</code>'),
            B('<code>(integer) 100</code>, then <code>(integer) 100</code>', '<code>(integer) 100</code>, rồi <code>(integer) 100</code>'),
            B('<code>(integer) -1</code>, then <code>(integer) -1</code>', '<code>(integer) -1</code>, rồi <code>(integer) -1</code>'),
          ],
          correct: 0,
          explanation: EX(
            'The rule is whether the command <em>modifies the existing value</em> or <em>replaces the key</em>. <code>APPEND</code> modifies in place, so the TTL survives — and so do <code>INCR</code>, <code>SETRANGE</code>, <code>HSET</code>, <code>LPUSH</code> and <code>SADD</code>. <code>GETSET</code> replaces, so the TTL is gone, exactly like a plain <code>SET</code>. Also measured on the same server: <code>COPY</code> and <code>RENAME</code> keep the source TTL, because they move the object rather than replacing the value. This asymmetry is the mechanism behind the classic session-store leak.',
            'Quy tắc là lệnh đó SỬA GIÁ TRỊ ĐANG CÓ hay THAY THẾ CẢ CÁI KHOÁ. <code>APPEND</code> sửa tại chỗ nên TTL sống sót — <code>INCR</code>, <code>SETRANGE</code>, <code>HSET</code>, <code>LPUSH</code> và <code>SADD</code> cũng vậy. <code>GETSET</code> thay thế, nên TTL mất, y hệt một lệnh <code>SET</code> trơn. Cũng đo trên chính máy chủ ấy: <code>COPY</code> và <code>RENAME</code> giữ nguyên TTL của khoá nguồn, vì chúng di chuyển đối tượng chứ không thay giá trị. Chính sự bất đối xứng này là cơ chế của chỗ rò kinh điển ở kho phiên đăng nhập.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on Redis 7.4.9: 200,000 keys were written with <code>EX 5</code>. At the instant the five seconds elapsed, <code>DBSIZE</code> still reported 154,727 and <code>expired_keys</code> reported 45,955. Nothing was misconfigured. Why?',
            'Đo thật trên Redis 7.4.9: ghi 200.000 khoá với <code>EX 5</code>. Đúng thời điểm năm giây trôi qua, <code>DBSIZE</code> vẫn báo 154.727 còn <code>expired_keys</code> báo 45.955. Không có gì cấu hình sai. Vì sao?',
          ),
          options: [
            B('The keys were written with a pipeline, so their TTL clocks only start when the pipeline is flushed', 'Các khoá được ghi bằng pipeline, nên đồng hồ TTL của chúng chỉ bắt đầu chạy khi pipeline được đẩy đi'),
            B('DBSIZE is a cached statistic refreshed once a minute; the keys themselves were already removed', 'DBSIZE là một thống kê được nhớ đệm và làm mới mỗi phút; bản thân các khoá thì đã bị gỡ xong rồi'),
            B('A key becomes logically expired on time but is removed lazily on access or by a sampled job', 'Khoá hết hạn về mặt logic đúng giờ, nhưng chỉ bị gỡ khi có ai chạm vào, hoặc bởi một tác vụ lấy mẫu'),
            B('Redis rounds every TTL up to the next ten seconds, so the real deadline had not been reached yet', 'Redis làm tròn mọi TTL lên bội số mười giây gần nhất, nên hạn thật sự vẫn chưa tới lúc đó'),
          ],
          correct: 2,
          explanation: EX(
            'Expiration is not a scheduled sweep. A key is removed either when someone touches it (lazy) or when the active cycle — 20 random keys from the expires dictionary, ten times a second, repeating while more than 25% of the sample was expired — happens to pick it. The work is deliberately capped so that a mass expiry cannot monopolise the single thread. The operational consequence is that <code>DBSIZE</code> and <code>used_memory</code> lag a TTL wave, and a memory graph that stays flat for a few seconds afterwards is normal rather than alarming. Reading any of those keys still correctly returns nil.',
            'Hết hạn không phải một đợt quét theo lịch. Một khoá bị gỡ hoặc khi có người chạm vào nó (lười), hoặc khi chu kỳ chủ động — 20 khoá ngẫu nhiên lấy từ từ điển expires, mười lần mỗi giây, lặp lại chừng nào còn hơn 25% mẫu đã hết hạn — tình cờ bốc trúng. Lượng việc bị chặn trần có chủ đích để một đợt hết hạn hàng loạt không độc chiếm cái luồng duy nhất. Hệ quả vận hành là <code>DBSIZE</code> và <code>used_memory</code> đi chậm hơn đợt TTL, và biểu đồ bộ nhớ nằm ngang vài giây sau đó là bình thường chứ không đáng báo động. Đọc bất kỳ khoá nào trong số ấy vẫn trả về nil hoàn toàn đúng.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on a real primary and a real replica (Redis 7.4.9, <code>master_link_status:up</code>): 300,000 keys expired. The primary reported <code>expired_keys:500005</code>; the replica reported <code>expired_keys:0</code>, while a <code>GET</code> on the replica for one of those keys correctly returned <code>(nil)</code>. What is the mechanism?',
            'Đo thật trên một primary và một replica thật (Redis 7.4.9, <code>master_link_status:up</code>): 300.000 khoá hết hạn. Primary báo <code>expired_keys:500005</code>; replica báo <code>expired_keys:0</code>, trong khi lệnh <code>GET</code> trên replica cho một trong các khoá đó vẫn trả về đúng <code>(nil)</code>. Cơ chế là gì?',
          ),
          options: [
            B('Replication was lagging by exactly one full expiry cycle, so the counter had not caught up yet', 'Nhân bản đang trễ đúng một chu kỳ hết hạn trọn vẹn, nên bộ đếm chưa kịp đuổi theo'),
            B('A replica never expires keys itself: it hides them on read and waits for an explicit DEL', 'Replica không bao giờ tự hết hạn khoá: nó giấu chúng khi đọc và chờ một lệnh DEL tường minh'),
            B('The replica had TTLs stripped during the initial sync, so none of its keys had an expiry at all', 'Replica bị gỡ hết TTL trong lần đồng bộ đầu tiên, nên chẳng khoá nào của nó có hạn cả'),
            B('<code>expired_keys</code> is only incremented by the active cycle, which is disabled on replicas', '<code>expired_keys</code> chỉ tăng nhờ chu kỳ chủ động, mà chu kỳ ấy bị tắt trên các replica'),
          ],
          correct: 1,
          explanation: EX(
            'The replica keeps the key in its keyspace and its counter at zero, but it knows the TTL has elapsed and returns nil to any read — so a read on the primary and the same read on the replica never disagree. Deletion happens only when the primary sends an explicit <code>DEL</code> down the replication stream. That is why a replica <code>DBSIZE</code> can legitimately differ from the primary while nothing is wrong, and why <code>expired_keys</code> is a primary-side metric: alerting on it being zero on a replica is alerting on correct behaviour.',
            'Replica vẫn giữ khoá trong không gian khoá của nó và giữ bộ đếm ở không, nhưng nó BIẾT là TTL đã trôi qua và trả về nil cho mọi phép đọc — nên một phép đọc trên primary và cũng phép đọc ấy trên replica không bao giờ mâu thuẫn. Việc xoá chỉ xảy ra khi primary gửi một lệnh <code>DEL</code> tường minh xuống luồng nhân bản. Vì thế <code>DBSIZE</code> của replica có thể chênh với primary một cách hoàn toàn chính đáng, và <code>expired_keys</code> là chỉ số phía primary: đặt cảnh báo vì nó bằng 0 trên replica là đặt cảnh báo cho một hành vi đúng.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on Redis 7.4.9 with 20,001 keys, of which exactly one matches <code>lock:*</code>. A full <code>SCAN … MATCH &#39;lock:*&#39; COUNT 100</code> loop took <b>200 calls</b>, and <b>199 of them returned an empty batch</b> — including the very first one, which returned cursor 1152 and no keys. Which loop is correct?',
            'Đo thật trên Redis 7.4.9 với 20.001 khoá, trong đó đúng MỘT khoá khớp <code>lock:*</code>. Một vòng <code>SCAN … MATCH &#39;lock:*&#39; COUNT 100</code> chạy hết cần <b>200 lượt gọi</b>, và <b>199 lượt trả về lô rỗng</b> — kể cả lượt đầu tiên, vốn trả về con trỏ 1152 và không khoá nào. Vòng lặp nào là ĐÚNG?',
          ),
          options: [
            B('<code>while (keys.length) { … }</code> — stop as soon as a batch comes back with nothing in it', '<code>while (keys.length) { … }</code> — dừng ngay khi một lô trở về mà không có gì trong đó'),
            B('<code>for (let i = 0; i &lt; Math.ceil(dbsize / count); i++) { … }</code> — the cursor is an offset', '<code>for (let i = 0; i &lt; Math.ceil(dbsize / count); i++) { … }</code> — con trỏ chính là độ lệch'),
            B('<code>do { … } while (cursor !== &#39;0&#39;)</code> — the cursor, kept as a string, is the only stop signal', '<code>do { … } while (cursor !== &#39;0&#39;)</code> — con trỏ, giữ dạng chuỗi, là tín hiệu dừng duy nhất'),
            B('<code>while (cursor &lt; dbsize) { … }</code> — the cursor grows monotonically until it passes the key count', '<code>while (cursor &lt; dbsize) { … }</code> — con trỏ tăng đều cho tới khi vượt qua số lượng khoá'),
          ],
          correct: 2,
          explanation: EX(
            '<code>MATCH</code> filters <em>after</em> the batch is fetched, so an empty batch means "nothing in this slice of the hash table matched", not "we are finished" — 199 of the 200 calls here were empty while the scan was still marching through the keyspace, and a <code>while (keys.length)</code> loop would have exited on the very first call having deleted nothing. The cursor is also not an offset and does not increase monotonically: it is an internal position encoded so it survives rehashing, it is 64-bit, and in JavaScript it must be kept as an opaque <b>string</b> or large values lose precision. Terminate on <code>&quot;0&quot;</code> and nothing else.',
            '<code>MATCH</code> lọc SAU khi lô đã được lấy về, nên một lô rỗng nghĩa là "không có gì trong lát cắt này của bảng băm khớp cả", chứ không phải "xong rồi" — ở đây 199 trên 200 lượt gọi là rỗng trong khi phép quét vẫn đang đi giữa không gian khoá, và một vòng <code>while (keys.length)</code> hẳn đã thoát ngay lượt đầu tiên mà chưa xoá gì. Con trỏ cũng không phải độ lệch và không tăng đều: nó là một vị trí nội bộ được mã hoá để sống sót qua việc băm lại, nó dài 64 bit, và trong JavaScript phải giữ dạng CHUỖI mờ nếu không giá trị lớn sẽ mất độ chính xác. Chỉ dừng ở <code>&quot;0&quot;</code>, không gì khác.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. What are the two missing replies?' + code(
              '> SET user:1042 "a string"\n' +
              'OK\n' +
              '> HSET user:1042 name "Cường"\n' +
              '?\n' +
              '> TYPE user:1042\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9. Hai dòng trả lời còn thiếu là gì?' + code(
              '> SET user:1042 "a string"\n' +
              'OK\n' +
              '> HSET user:1042 name "Cường"\n' +
              '?\n' +
              '> TYPE user:1042\n' +
              '?',
            ),
          ),
          options: [
            B('<code>(integer) 1</code>, then <code>hash</code> — HSET replaces the string with a hash', '<code>(integer) 1</code>, rồi <code>hash</code> — HSET thay chuỗi bằng một hash'),
            B('<code>(error) WRONGTYPE …</code>, then <code>string</code> — the key is untouched', '<code>(error) WRONGTYPE …</code>, rồi <code>string</code> — cái khoá không bị đụng tới'),
            B('<code>(integer) 0</code>, then <code>none</code> — the conflicting key is deleted by the server', '<code>(integer) 0</code>, rồi <code>none</code> — khoá xung đột bị máy chủ xoá đi'),
            B('<code>(error) ERR wrong number of arguments</code>, then <code>string</code> — HSET needs a type flag', '<code>(error) ERR wrong number of arguments</code>, rồi <code>string</code> — HSET cần một cờ kiểu'),
          ],
          correct: 1,
          explanation: EX(
            'A key holds exactly one type, and a command for the wrong type fails without changing anything — the key is still the original string. In production this is almost never a typo: it is two features that both decided <code>user:1042</code> was a reasonable key, one storing JSON and one wanting a hash, and the error only appears when both code paths run. Defensive checks do not fix it; a naming convention does, where the shape is visible in the name or each feature owns its own namespace. Writing the key patterns down once in the README is the actual prevention.',
            'Một khoá chỉ giữ đúng MỘT kiểu, và lệnh dành cho kiểu khác sẽ hỏng mà không đổi gì cả — cái khoá vẫn là chuỗi ban đầu. Trên production đây gần như không bao giờ là gõ nhầm: đó là hai tính năng cùng thấy <code>user:1042</code> là một cái tên hợp lý, một bên lưu JSON, một bên muốn hash, và lỗi chỉ lộ ra khi cả hai nhánh mã cùng chạy. Kiểm tra phòng thủ không chữa được; một quy ước đặt tên mới chữa được, trong đó hình dạng hiện ngay trong tên khoá hoặc mỗi tính năng có vùng tên riêng. Viết bảng mẫu tên khoá vào README đúng một lần chính là cách phòng ngừa thật.',
          ),
        }),

        mcq({
          prompt: B(
            'A team uses numbered databases (<code>SELECT 3</code>) to separate two services on one instance. Measured on Redis 7.4.9: <code>redis-cli -n 0 SET shared &quot;in db0&quot;</code> then <code>redis-cli -n 3 GET shared</code> returns <code>(nil)</code>, and <code>INFO keyspace</code> lists <code>db0</code> and <code>db3</code> separately. Which criticism of this design is correct?',
            'Một nhóm dùng database đánh số (<code>SELECT 3</code>) để tách hai dịch vụ trên cùng một instance. Đo thật trên Redis 7.4.9: <code>redis-cli -n 0 SET shared &quot;in db0&quot;</code> rồi <code>redis-cli -n 3 GET shared</code> trả về <code>(nil)</code>, và <code>INFO keyspace</code> liệt kê <code>db0</code> với <code>db3</code> riêng biệt. Lời phê nào về thiết kế này là ĐÚNG?',
          ),
          options: [
            B('Nothing is isolated but the names: one thread, one memory limit, no Cluster, and SELECT leaks through a pooled client', 'Chẳng có gì bị cô lập ngoài tên khoá: một luồng, một trần bộ nhớ, không có trong Cluster, và SELECT rò qua client dùng chung'),
            B('The separation is real but capped at 16 databases; raise <code>databases</code> to 64 before you outgrow it', 'Sự tách biệt là có thật nhưng bị chặn ở 16 database; hãy nâng <code>databases</code> lên 64 trước khi dùng hết'),
            B('The two databases have separate keyspaces but share one TTL clock, so expiries in db3 fire against db0', 'Hai database có không gian khoá riêng nhưng chung một đồng hồ TTL, nên hạn ở db3 lại kích hoạt trên db0'),
            B('Numbered databases are fine on a single node and only become a problem once persistence is enabled', 'Database đánh số vẫn ổn trên một nút đơn và chỉ thành vấn đề khi bạn bật chế độ lưu lâu dài'),
          ],
          correct: 0,
          explanation: EX(
            'They share one process, one thread, one <code>maxmemory</code>, one AOF and one replication stream — a slow command in db3 blocks db0, and a runaway in db3 evicts keys in db0. Redis Cluster supports only database 0, so the day you outgrow one node every <code>SELECT</code> in the codebase becomes a migration. Worst of all, <code>SELECT</code> is per-connection state: with a pooled or shared client one stray <code>SELECT</code> leaves that connection pointing at the wrong database for every subsequent command, and the symptom is data appearing in the wrong place intermittently. Key prefixes give the separation you actually wanted.',
            'Chúng chung một tiến trình, một luồng, một <code>maxmemory</code>, một AOF và một luồng nhân bản — một lệnh chậm ở db3 chặn cả db0, và một thứ chạy loạn ở db3 đẩy khoá của db0 ra ngoài. Redis Cluster chỉ hỗ trợ database 0, nên ngày bạn vượt quá một nút thì mọi lệnh <code>SELECT</code> trong mã nguồn đều là một cuộc di trú. Tệ nhất là <code>SELECT</code> là trạng thái CỦA TỪNG KẾT NỐI: với client dùng chung hay có pool, một lệnh <code>SELECT</code> lạc chỗ khiến kết nối đó trỏ nhầm database cho mọi lệnh về sau, và triệu chứng là dữ liệu hiện ra sai chỗ một cách chập chờn. Tiền tố khoá cho bạn đúng sự tách biệt bạn muốn.',
          ),
        }),

        // ── Chương 3 — Chuỗi, bộ đếm, bitmap, HyperLogLog ───────────────
        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, where each value is exactly the length shown. Fill in the three encodings.' + code(
              '> SET a 42          -> OBJECT ENCODING a  = ?\n' +
              '> SET b <44 bytes>  -> OBJECT ENCODING b  = ?\n' +
              '> APPEND b "!"      -> OBJECT ENCODING b  = ?',
            ),
            'Chạy thật trên Redis 7.4.9, mỗi giá trị dài đúng như ghi chú. Điền ba cách mã hoá.' + code(
              '> SET a 42          -> OBJECT ENCODING a  = ?\n' +
              '> SET b <44 byte>   -> OBJECT ENCODING b  = ?\n' +
              '> APPEND b "!"      -> OBJECT ENCODING b  = ?',
            ),
          ),
          options: [
            B('<code>int</code>, then <code>embstr</code>, then <code>raw</code>', '<code>int</code>, rồi <code>embstr</code>, rồi <code>raw</code>'),
            B('<code>int</code>, then <code>embstr</code>, then <code>embstr</code>', '<code>int</code>, rồi <code>embstr</code>, rồi <code>embstr</code>'),
            B('<code>raw</code>, then <code>raw</code>, then <code>raw</code>', '<code>raw</code>, rồi <code>raw</code>, rồi <code>raw</code>'),
            B('<code>embstr</code>, then <code>raw</code>, then <code>raw</code>', '<code>embstr</code>, rồi <code>raw</code>, rồi <code>raw</code>'),
          ],
          correct: 0,
          explanation: EX(
            'A value that parses as a 64-bit integer is stored as one. Up to 44 bytes the object header and the string live in a single 64-byte allocation (<code>embstr</code>); 45 bytes tips it into two allocations (<code>raw</code>) — measured on this server: 44 gave <code>embstr</code> and 45 gave <code>raw</code>. And any modification promotes <code>embstr</code> to <code>raw</code> permanently, because an embedded string cannot be changed in place and Redis never spends time converting back. The 44 is allocator arithmetic: a 64-byte jemalloc size class minus a 16-byte object header, a 3-byte SDS header and a terminator.',
            'Giá trị đọc được thành số nguyên 64 bit thì được lưu đúng như một số nguyên. Tới 44 byte thì phần đầu đối tượng và chuỗi nằm chung trong MỘT khối 64 byte (<code>embstr</code>); 45 byte là đẩy sang hai lần cấp phát (<code>raw</code>) — đo trên chính máy chủ này: 44 ra <code>embstr</code>, 45 ra <code>raw</code>. Và mọi phép sửa đều thăng <code>embstr</code> lên <code>raw</code> vĩnh viễn, vì chuỗi nhúng không sửa tại chỗ được và Redis không bao giờ tốn thời gian hạ ngược. Con số 44 là số học của bộ cấp phát: lớp kích thước 64 byte của jemalloc trừ đi 16 byte đầu đối tượng, 3 byte đầu SDS và một ký tự kết thúc.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. Why do these two identical-looking keys report different refcounts?' + code(
              '> SET a 42\n' +
              '> OBJECT REFCOUNT a\n' +
              '(integer) 2147483647\n' +
              '> SET b 10000\n' +
              '> OBJECT REFCOUNT b\n' +
              '(integer) 1',
            ),
            'Chạy thật trên Redis 7.4.9. Vì sao hai khoá trông y hệt nhau lại báo refcount khác nhau?' + code(
              '> SET a 42\n' +
              '> OBJECT REFCOUNT a\n' +
              '(integer) 2147483647\n' +
              '> SET b 10000\n' +
              '> OBJECT REFCOUNT b\n' +
              '(integer) 1',
            ),
          ),
          options: [
            B('<code>a</code> was written first, so it accumulated references from the replication backlog buffer', '<code>a</code> được ghi trước nên nó gom thêm tham chiếu từ bộ đệm tồn đọng của nhân bản'),
            B('42 fits in one byte while 10000 needs two, and only single-byte values are reference counted', '42 vừa một byte còn 10000 cần hai byte, và chỉ giá trị một byte mới được đếm tham chiếu'),
            B('Redis preallocates the integers 0–9999 and shares them; the maximum refcount means never freed', 'Redis cấp phát sẵn các số nguyên 0–9999 và dùng chung; refcount cực đại nghĩa là không bao giờ giải phóng'),
            B('<code>b</code> exceeds the 9999 limit of the int encoding, so it is stored as an <code>embstr</code> string', '<code>b</code> vượt giới hạn 9999 của mã hoá int nên nó được lưu thành một chuỗi <code>embstr</code>'),
          ],
          correct: 2,
          explanation: EX(
            'Both keys are <code>int</code>-encoded — the difference is that the values 0 to 9999 are preallocated once at startup and shared by every key that holds them, so a million keys all storing 42 point at one allocation and cost nothing extra. <code>2147483647</code> is <code>INT_MAX</code> used as a sentinel meaning "shared object, never free this". 10000 is one past the shared range, so it gets its own object with a refcount of 1. Counters are consequently the cheapest thing in Redis, which is part of why per-minute buckets are practical.',
            'Cả hai khoá đều được mã hoá <code>int</code> — khác nhau ở chỗ các giá trị từ 0 tới 9999 được cấp phát sẵn một lần lúc khởi động và dùng chung cho mọi khoá giữ chúng, nên một triệu khoá cùng lưu số 42 đều trỏ vào MỘT vùng cấp phát và không tốn thêm gì. <code>2147483647</code> là <code>INT_MAX</code> dùng làm cờ hiệu nghĩa là "đối tượng dùng chung, đừng bao giờ giải phóng". Số 10000 vượt ra ngoài dải dùng chung đúng một đơn vị, nên nó có đối tượng riêng với refcount bằng 1. Nhờ vậy bộ đếm là thứ rẻ nhất trong Redis, và đó là một phần lý do các xô đếm theo phút là khả thi.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, where <code>miss</code> does not exist and <code>s</code> holds <code>"abc"</code>. Fill in the two missing replies.' + code(
              '> INCR miss\n' +
              '?\n' +
              '> INCR s\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9, với <code>miss</code> chưa tồn tại và <code>s</code> đang giữ <code>"abc"</code>. Điền hai dòng trả lời còn thiếu.' + code(
              '> INCR miss\n' +
              '?\n' +
              '> INCR s\n' +
              '?',
            ),
          ),
          options: [
            B('<code>(error) ERR no such key</code>, then <code>(integer) 1</code> — the string is reset to a counter', '<code>(error) ERR no such key</code>, rồi <code>(integer) 1</code> — chuỗi bị đặt lại thành một bộ đếm'),
            B('<code>(integer) 0</code>, then <code>(integer) 1</code> — a non-numeric string is treated as zero', '<code>(integer) 0</code>, rồi <code>(integer) 1</code> — chuỗi không phải số được coi như bằng không'),
            B('<code>(nil)</code>, then <code>(error) WRONGTYPE …</code> — the key is a string, not a counter', '<code>(nil)</code>, rồi <code>(error) WRONGTYPE …</code> — khoá đó là chuỗi chứ không phải bộ đếm'),
            B('<code>(integer) 1</code>, then <code>(error) ERR value is not an integer or out of range</code>', '<code>(integer) 1</code>, rồi <code>(error) ERR value is not an integer or out of range</code>'),
          ],
          correct: 3,
          explanation: EX(
            'A missing key counts as zero, so <code>INCR</code> creates it at 1 — that is what makes counters a one-liner with no initialisation step. A non-numeric string is an error, not a coercion: Redis never guesses, so this class of bug surfaces immediately instead of silently producing a plausible wrong number. Note the error is <code>ERR</code>, not <code>WRONGTYPE</code> — the key really is a string, which is the right type for <code>INCR</code>; it is the <em>contents</em> that are not a number. Overflow is also an error (measured: incrementing 9223372036854775807 returns <code>ERR increment or decrement would overflow</code>) rather than a wrap-around.',
            'Khoá không tồn tại được tính là không, nên <code>INCR</code> tạo nó ở giá trị 1 — chính điều đó làm bộ đếm chỉ tốn một dòng, không cần bước khởi tạo. Chuỗi không phải số thì là LỖI chứ không phải ép kiểu: Redis không bao giờ đoán, nên loại lỗi này lộ ra ngay thay vì âm thầm cho ra một con số sai mà nghe hợp lý. Chú ý mã lỗi là <code>ERR</code> chứ không phải <code>WRONGTYPE</code> — khoá đúng là một chuỗi, và chuỗi là kiểu hợp lệ cho <code>INCR</code>; chỉ có NỘI DUNG mới không phải số. Tràn số cũng là lỗi (đo thật: tăng 9223372036854775807 trả về <code>ERR increment or decrement would overflow</code>) chứ không quay vòng.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, on a key that did not exist. What are the two missing replies, and what is the danger?' + code(
              '> SETRANGE rec 10 "hello"\n' +
              '?\n' +
              '> STRLEN rec\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9, trên một khoá chưa tồn tại. Hai dòng trả lời còn thiếu là gì, và mối nguy nằm ở đâu?' + code(
              '> SETRANGE rec 10 "hello"\n' +
              '?\n' +
              '> STRLEN rec\n' +
              '?',
            ),
          ),
          options: [
            B('<code>(integer) 5</code> and <code>(integer) 5</code> — the offset is ignored on a new key', '<code>(integer) 5</code> và <code>(integer) 5</code> — độ lệch bị bỏ qua khi khoá còn mới'),
            B('<code>(integer) 15</code> and <code>(integer) 15</code> — the gap is zero-filled, and a user-supplied offset can allocate gigabytes', '<code>(integer) 15</code> và <code>(integer) 15</code> — khoảng trống được lấp bằng byte không, và một độ lệch do người dùng gửi lên có thể cấp phát hàng gigabyte'),
            B('<code>(error) ERR offset out of range</code> twice — a new key must be created with SET first', '<code>(error) ERR offset out of range</code> hai lần — khoá mới phải được tạo bằng SET trước đã'),
            B('<code>(integer) 15</code> and <code>(integer) 5</code> — STRLEN counts only the bytes you wrote', '<code>(integer) 15</code> và <code>(integer) 5</code> — STRLEN chỉ đếm những byte bạn thật sự ghi vào'),
          ],
          correct: 1,
          explanation: EX(
            'Both commands return 15, and reading the key back shows ten NUL bytes followed by <code>hello</code>. That zero-padding is occasionally exactly what you want — it is how you preallocate a bitmap — and it is a memory-exhaustion vector whenever the offset comes from outside: <code>SETRANGE k 100000000 "x"</code> allocates a 100MB value in one blocking allocation, and <code>SETBIT</code> has the same shape (a single <code>SETBIT k 4000000000 1</code> is 500MB). Bound the offset explicitly before you use it, so a bad input fails loudly instead of allocating half a gigabyte.',
            'Cả hai lệnh đều trả về 15, và đọc lại khoá sẽ thấy mười byte NUL rồi tới <code>hello</code>. Việc lấp byte không đó thỉnh thoảng đúng là thứ bạn muốn — nó là cách cấp phát trước một bitmap — và là một đường làm cạn bộ nhớ mỗi khi độ lệch đến từ bên ngoài: <code>SETRANGE k 100000000 "x"</code> cấp phát một giá trị 100MB trong một lần cấp phát chặn cả máy chủ, và <code>SETBIT</code> cũng cùng hình dạng ấy (chỉ một lệnh <code>SETBIT k 4000000000 1</code> là 500MB). Hãy chặn trần độ lệch một cách tường minh trước khi dùng, để một đầu vào xấu hỏng ầm ĩ thay vì cấp phát nửa gigabyte.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. Bits 3, 500 and 900 are set and nothing else. Why do these two lines disagree?' + code(
              '> BITCOUNT bm\n' +
              '(integer) 3\n' +
              '> BITCOUNT bm 0 99\n' +
              '(integer) 2\n' +
              '> BITCOUNT bm 0 99 BIT\n' +
              '(integer) 1',
            ),
            'Chạy thật trên Redis 7.4.9. Bit số 3, 500 và 900 được bật, ngoài ra không gì khác. Vì sao hai dòng này lệch nhau?' + code(
              '> BITCOUNT bm\n' +
              '(integer) 3\n' +
              '> BITCOUNT bm 0 99\n' +
              '(integer) 2\n' +
              '> BITCOUNT bm 0 99 BIT\n' +
              '(integer) 1',
            ),
          ),
          options: [
            B('Ranges are exclusive of the upper bound without <code>BIT</code> and inclusive with it, hence the difference', 'Không có <code>BIT</code> thì dải loại trừ cận trên, có <code>BIT</code> thì bao gồm, nên mới lệch nhau'),
            B('The first form counts only bits that are byte-aligned, which excludes bit 500 but includes bit 3', 'Dạng đầu chỉ đếm các bit thẳng hàng byte, nên loại bit 500 ra nhưng vẫn tính bit 3'),
            B('<code>BIT</code> switches to a sampled estimate, so the smaller number is an approximation of the larger', '<code>BIT</code> chuyển sang ước lượng theo mẫu, nên con số nhỏ hơn là xấp xỉ của con số lớn hơn'),
            B('A range without a unit counts BYTES 0–99, i.e. bits 0–799; <code>BIT</code> makes the range mean bits', 'Một dải không ghi đơn vị là đếm BYTE 0–99, tức bit 0–799; thêm <code>BIT</code> thì dải mới là bit'),
          ],
          correct: 3,
          explanation: EX(
            'This is a long-standing off-by-eight. <code>BITCOUNT k 0 99</code> means bytes 0–99, which covers bits 0 through 799 — so it catches bit 3 and bit 500 but not bit 900. Redis 7.0 added the explicit <code>BIT</code> suffix, and using it removes the ambiguity: bits 0–99 catches only bit 3. Negative indices work in both units, the same convention as <code>GETRANGE</code>. <code>BITCOUNT</code> itself is O(N) over the range but with a tiny constant because it uses a population-count instruction, so counting a million bits is microseconds.',
            'Đây là một cái bẫy lệch-tám lâu đời. <code>BITCOUNT k 0 99</code> nghĩa là BYTE 0–99, tức phủ bit 0 tới 799 — nên nó bắt được bit 3 và bit 500 nhưng không bắt bit 900. Redis 7.0 thêm hậu tố <code>BIT</code> tường minh, và dùng nó là hết mơ hồ: bit 0–99 chỉ bắt được bit 3. Chỉ số âm dùng được với cả hai đơn vị, cùng quy ước với <code>GETRANGE</code>. Bản thân <code>BITCOUNT</code> là O(N) trên dải nhưng hằng số cực nhỏ vì nó dùng lệnh đếm bit của CPU, nên đếm một triệu bit chỉ tốn vài micro giây.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. A HyperLogLog is supposed to cost a fixed 12KB. Explain the two lengths.' + code(
              '> PFADD h a b c\n' +
              '(integer) 1\n' +
              '> STRLEN h\n' +
              '(integer) 27\n' +
              '> ... 5000 more distinct items ...\n' +
              '> STRLEN h\n' +
              '(integer) 12304',
            ),
            'Chạy thật trên Redis 7.4.9. HyperLogLog được cho là tốn cố định 12KB. Hãy giải thích hai độ dài này.' + code(
              '> PFADD h a b c\n' +
              '(integer) 1\n' +
              '> STRLEN h\n' +
              '(integer) 27\n' +
              '> ... thêm 5000 phần tử khác nhau ...\n' +
              '> STRLEN h\n' +
              '(integer) 12304',
            ),
          ),
          options: [
            B('The first number is the sparse encoding; Redis converts to the dense 12,304-byte form past <code>hll-sparse-max-bytes</code>', 'Con số đầu là mã hoá thưa; Redis chuyển sang dạng đặc 12.304 byte khi vượt <code>hll-sparse-max-bytes</code>'),
            B('The first number is a placeholder; the real structure is allocated lazily on the first <code>PFCOUNT</code>', 'Con số đầu chỉ là chỗ giữ; cấu trúc thật được cấp phát muộn, vào lần <code>PFCOUNT</code> đầu tiên'),
            B('A HyperLogLog grows one byte per distinct item until it reaches the 12KB cap and then stops growing', 'HyperLogLog lớn thêm một byte cho mỗi phần tử khác nhau cho tới khi chạm trần 12KB rồi ngừng lớn'),
            B('<code>STRLEN</code> reports the compressed length; the allocation was 12,304 bytes in both cases', '<code>STRLEN</code> báo độ dài đã nén; vùng cấp phát thật là 12.304 byte trong cả hai trường hợp'),
          ],
          correct: 0,
          explanation: EX(
            'Redis starts a HyperLogLog in a sparse run-length encoding and converts to the dense 16,384-register form only once the sparse representation exceeds <code>hll-sparse-max-bytes</code> (measured default: 3000). So a million nearly-empty HyperLogLogs is not a million × 12KB, which is what makes per-page or per-article unique counters practical. Two properties that do not change with encoding: there is no <code>PFISMEMBER</code> and there never will be, because no members are stored, and there is no delete — which is why you use daily keys with a TTL and union them with <code>PFCOUNT k1 k2 …</code> rather than one long-lived key.',
            'Redis khởi tạo một HyperLogLog ở dạng mã hoá thưa theo độ dài chạy, và chỉ chuyển sang dạng đặc 16.384 thanh ghi khi bản thưa vượt quá <code>hll-sparse-max-bytes</code> (đo được mặc định: 3000). Nên một triệu HyperLogLog gần rỗng KHÔNG phải là một triệu × 12KB, và chính điều đó làm bộ đếm khách duy nhất theo từng trang hay từng bài viết trở nên khả thi. Hai tính chất không đổi theo cách mã hoá: không có <code>PFISMEMBER</code> và sẽ không bao giờ có, vì cấu trúc không lưu thành viên nào; và không có lệnh xoá — nên phải dùng khoá theo ngày kèm TTL rồi hợp chúng lại bằng <code>PFCOUNT k1 k2 …</code>, thay vì một khoá sống mãi.',
          ),
        }),

        mcq({
          prompt: B(
            'A limiter allows 100 requests per minute using one counter per minute bucket, incremented and compared atomically. There is no race in the code. A client still gets 200 requests through in about two seconds. How?',
            'Một bộ giới hạn cho phép 100 request mỗi phút bằng một bộ đếm cho mỗi xô một phút, tăng và so sánh một cách nguyên tử. Trong mã không có cuộc đua nào cả. Vậy mà một client vẫn đẩy được 200 request qua trong khoảng hai giây. Bằng cách nào?',
          ),
          options: [
            B('The counter key expired mid-window, so the second hundred started from zero in the same bucket', 'Khoá bộ đếm hết hạn giữa cửa sổ, nên một trăm request sau bắt đầu lại từ không trong cùng một xô'),
            B('100 land at the end of one fixed window and 100 at the start of the next — both are within their limit', '100 request rơi vào cuối một cửa sổ cố định và 100 vào đầu cửa sổ kế — cả hai đều nằm trong hạn mức'),
            B('<code>INCR</code> is not atomic across a key that is being created, so early increments were lost', '<code>INCR</code> không nguyên tử trên một khoá đang được tạo, nên vài lượt tăng đầu tiên bị mất'),
            B('The client opened two connections, and each connection gets its own counter in Redis', 'Client mở hai kết nối, và mỗi kết nối được cấp một bộ đếm riêng trong Redis'),
          ],
          correct: 1,
          explanation: EX(
            'This is the fixed-window boundary problem, and every fixed-window limiter has it: 100 requests at 11:59:59 and 100 at 12:00:01 are two different buckets, both compliant, and your backend just took twice the intended peak. Whether that matters depends on what you are protecting — for a generous API quota it is fine, for a login endpoint or an expensive AI call it is not. The practical fix costs one extra <code>GET</code> and a multiplication: weight the previous window by how much of it is still in view, so immediately after a rollover the old count still counts almost fully. An exact algorithm (a sorted-set log, or a token bucket) costs more and must live inside one Lua script.',
            'Đây là vấn đề ranh giới của cửa sổ cố định, và mọi bộ giới hạn cửa sổ cố định đều dính: 100 request lúc 11:59:59 và 100 request lúc 12:00:01 là hai xô khác nhau, cả hai đều hợp lệ, và backend của bạn vừa nhận gấp đôi đỉnh dự kiến. Chuyện đó có nghiêm trọng hay không tuỳ vào thứ bạn đang che chắn — với một hạn mức API rộng rãi thì không sao, với một endpoint đăng nhập hay một lời gọi AI đắt đỏ thì có. Cách chữa thực dụng tốn thêm một lệnh <code>GET</code> và một phép nhân: đánh trọng số cho cửa sổ trước theo phần còn nằm trong tầm nhìn, nên ngay sau lúc lật cửa sổ thì số đếm cũ vẫn tính gần như trọn vẹn. Thuật toán chính xác (nhật ký bằng sorted set, hay thùng token) tốn hơn và bắt buộc phải nằm trong MỘT script Lua.',
          ),
        }),

        // ── Chương 4 — List, Set, Sorted Set ────────────────────────────
        mcq({
          prompt: B(
            'A list holds five million elements. Which of these four commands is the one that stalls the whole server, and why?',
            'Một list chứa năm triệu phần tử. Lệnh nào trong bốn lệnh sau làm treo cả máy chủ, và vì sao?',
          ),
          options: [
            B('<code>LLEN big</code> — the length is recomputed by walking every node of the quicklist', '<code>LLEN big</code> — độ dài được tính lại bằng cách đi hết mọi nút của quicklist'),
            B('<code>RPOP big</code> — popping from the tail requires traversing the list to reach the tail', '<code>RPOP big</code> — lấy ra từ đuôi thì phải đi dọc cả list mới tới được đuôi'),
            B('<code>LPUSH big x</code> — every push reallocates the list to keep the elements contiguous', '<code>LPUSH big x</code> — mỗi lần đẩy vào là list phải cấp phát lại để các phần tử nằm liền nhau'),
            B('<code>LINDEX big 2500000</code> — anything not touching an end walks from the nearest end', '<code>LINDEX big 2500000</code> — thứ gì không chạm vào một đầu thì phải đi bộ từ đầu gần nhất'),
          ],
          correct: 3,
          explanation: EX(
            'A list is O(1) at both ends and O(N) everywhere else, so <code>LPUSH</code>, <code>RPUSH</code>, <code>LPOP</code>, <code>RPOP</code> and <code>LLEN</code> are all safe at any size and everything else is a latency risk on data you do not control. The same trap wears three other costumes: <code>LRANGE k 0 -1</code> and deep pagination (it is O(S+N), so page 500 walks ten thousand nodes to reach the window), <code>LREM</code> on a long list, and <code>LPOS</code> searching for a value near the far end. If you need "element number 40,000" or "is this in there", the list is the wrong structure — that is what a sorted set and a set are for.',
            'Một list là O(1) ở hai đầu và O(N) ở mọi chỗ khác, nên <code>LPUSH</code>, <code>RPUSH</code>, <code>LPOP</code>, <code>RPOP</code> và <code>LLEN</code> đều an toàn ở mọi kích cỡ, còn lại đều là rủi ro độ trễ trên dữ liệu bạn không kiểm soát được kích thước. Cùng cái bẫy ấy còn khoác ba bộ áo khác: <code>LRANGE k 0 -1</code> và phân trang sâu (nó là O(S+N), nên trang 500 phải đi qua mười nghìn nút mới tới cửa sổ cần lấy), <code>LREM</code> trên một list dài, và <code>LPOS</code> tìm một giá trị nằm gần đầu xa. Nếu bạn cần "phần tử thứ 40.000" hay "cái này có trong đây không" thì list là cấu trúc sai — đó là việc của sorted set và set.',
          ),
        }),

        mcq({
          prompt: B(
            'Twenty workers each call <code>BLPOP queue:jobs 0</code> and wait. Which statement is correct?',
            'Hai mươi worker cùng gọi <code>BLPOP queue:jobs 0</code> rồi chờ. Phát biểu nào ĐÚNG?',
          ),
          options: [
            B('Only those twenty connections wait; the server registers them against the key and serves everyone else', 'Chỉ hai mươi kết nối đó phải chờ; máy chủ ghi tên chúng vào cái khoá rồi vẫn phục vụ mọi người khác'),
            B('The whole server is blocked, because Redis is single-threaded and a blocking command holds the thread', 'Cả máy chủ bị chặn, vì Redis đơn luồng và một lệnh chặn thì giữ luôn cái luồng ấy'),
            B('Nothing is blocked: the client library polls the key every 100 ms and BLPOP is a client-side loop', 'Không gì bị chặn cả: thư viện client hỏi vòng cái khoá mỗi 100 ms và BLPOP chỉ là vòng lặp phía client'),
            B('The twenty connections are dropped after <code>timeout</code> seconds, because 0 means "do not wait"', 'Hai mươi kết nối bị ngắt sau <code>timeout</code> giây, vì số 0 nghĩa là "đừng chờ gì cả"'),
          ],
          correct: 0,
          explanation: EX(
            'Redis registers the blocked client against the key and returns to the event loop — no polling, no timer, no CPU — and when an <code>RPUSH</code> arrives the blocked client is woken and served before the pushing client even gets its reply. Wake order is FIFO, so the worker that blocked first wins. Three details worth carrying: a timeout of <code>0</code> means wait forever, which is a trap behind a proxy that kills idle connections; each blocking consumer needs its own connection, because that socket is unavailable until the pop returns; and inside <code>MULTI</code> the blocking variants do not block at all — they behave like <code>LPOP</code> and return nil immediately.',
            'Redis ghi tên client đang chờ vào cái khoá rồi quay lại vòng lặp sự kiện — không hỏi vòng, không hẹn giờ, không tốn CPU — và khi một lệnh <code>RPUSH</code> tới thì client đang chờ được đánh thức và phục vụ TRƯỚC cả khi client đẩy vào nhận được phản hồi của nó. Thứ tự đánh thức là FIFO, nên worker chờ trước thì thắng. Ba chi tiết đáng mang theo: timeout bằng <code>0</code> nghĩa là chờ mãi mãi, một cái bẫy khi có proxy giết các kết nối rảnh; mỗi consumer chặn cần một kết nối riêng, vì cái socket ấy không dùng được cho tới khi lệnh pop trả về; và bên trong <code>MULTI</code> thì các biến thể chặn KHÔNG chặn gì cả — chúng hành xử như <code>LPOP</code> và trả nil ngay lập tức.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. Explain the three encodings.' + code(
              '> SADD s1 1 2 3 42 1000   -> OBJECT ENCODING s1 = "intset"\n' +
              '> SADD s1 hello           -> OBJECT ENCODING s1 = "listpack"\n' +
              '> ... 600 members ...     -> OBJECT ENCODING s3 = "hashtable"\n' +
              '> ... remove down to 10 ... -> OBJECT ENCODING s3 = ?',
            ),
            'Chạy thật trên Redis 7.4.9. Hãy giải thích ba cách mã hoá.' + code(
              '> SADD s1 1 2 3 42 1000   -> OBJECT ENCODING s1 = "intset"\n' +
              '> SADD s1 hello           -> OBJECT ENCODING s1 = "listpack"\n' +
              '> ... 600 thành viên ...  -> OBJECT ENCODING s3 = "hashtable"\n' +
              '> ... xoá còn 10 ...      -> OBJECT ENCODING s3 = ?',
            ),
          ),
          options: [
            B('<code>listpack</code> — Redis re-evaluates the encoding after every removal and downgrades when it can', '<code>listpack</code> — Redis xét lại cách mã hoá sau mỗi lần xoá và hạ cấp ngay khi có thể'),
            B('<code>intset</code> — the ten surviving members happen to be integers, so the cheapest form is chosen', '<code>intset</code> — mười thành viên còn lại tình cờ đều là số nguyên nên dạng rẻ nhất được chọn'),
            B('<code>hashtable</code> — the conversion is one-way and permanent, so the overhead is paid forever', '<code>hashtable</code> — việc chuyển đổi là một chiều và vĩnh viễn, nên phần phí tổn phải trả mãi mãi'),
            B('<code>hashtable</code> until the next write, which triggers a rebuild into the smallest fitting encoding', '<code>hashtable</code> cho tới lần ghi kế tiếp, lần ghi ấy sẽ dựng lại thành cách mã hoá nhỏ nhất vừa đủ'),
          ],
          correct: 2,
          explanation: EX(
            'Measured: after removing 590 of 600 members the set still reports <code>hashtable</code>. Redis promotes an encoding when a threshold is crossed and never demotes, because checking on every removal would cost more than the memory it saves. That matters at scale: a million sets that each briefly held 200 members are paying roughly 60–90 bytes per member of hash-table overhead forever, where an <code>intset</code> costs about 8. The fix is not raising the thresholds — that makes lookups linear on big sets — it is <code>DEL</code> plus rebuild if a set genuinely shrank for good. Note also that adding one non-integer member to an <code>intset</code> converts it, but only as far as <code>listpack</code> while it is still small.',
            'Đo thật: sau khi xoá 590 trong 600 thành viên, cái set vẫn báo <code>hashtable</code>. Redis thăng cách mã hoá khi vượt ngưỡng và không bao giờ hạ, vì kiểm tra sau mỗi lần xoá còn tốn hơn chỗ bộ nhớ tiết kiệm được. Điều đó có sức nặng ở quy mô lớn: một triệu cái set mà mỗi cái từng có thoáng qua 200 thành viên sẽ phải trả khoảng 60–90 byte phí bảng băm cho mỗi thành viên, mãi mãi, trong khi <code>intset</code> chỉ tốn chừng 8 byte. Cách chữa không phải nâng ngưỡng lên — làm thế thì tra cứu trên set lớn thành tuyến tính — mà là <code>DEL</code> rồi dựng lại nếu cái set thật sự đã teo hẳn. Cũng lưu ý: thêm một thành viên không phải số nguyên vào <code>intset</code> sẽ chuyển đổi nó, nhưng chỉ tới mức <code>listpack</code> chừng nào nó còn nhỏ.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, on a set holding exactly four members <code>A K Q J</code>. Explain the two replies.' + code(
              '> SRANDMEMBER deck 5\n' +
              '1) "A"  2) "K"  3) "Q"  4) "J"\n' +
              '> SRANDMEMBER deck -5\n' +
              '1) "A"  2) "J"  3) "K"  4) "K"  5) "K"',
            ),
            'Chạy thật trên Redis 7.4.9, trên một set có đúng bốn thành viên <code>A K Q J</code>. Hãy giải thích hai dòng trả lời.' + code(
              '> SRANDMEMBER deck 5\n' +
              '1) "A"  2) "K"  3) "Q"  4) "J"\n' +
              '> SRANDMEMBER deck -5\n' +
              '1) "A"  2) "J"  3) "K"  4) "K"  5) "K"',
            ),
          ),
          options: [
            B('A negative count means "remove them from the set", which is why members repeat as it wraps around', 'Số đếm âm nghĩa là "xoá chúng khỏi set", nên các thành viên lặp lại khi nó chạy vòng lại từ đầu'),
            B('A negative count reverses the iteration order and pads the result up to the requested length', 'Số đếm âm đảo ngược thứ tự duyệt và đệm thêm cho kết quả đủ độ dài đã yêu cầu'),
            B('The two forms are identical; the repetition is a quirk of the listpack encoding on tiny sets', 'Hai dạng đó là một; chuyện lặp lại chỉ là nét lạ của mã hoá listpack trên các set rất nhỏ'),
            B('A negative count samples with replacement and always returns exactly that many; a positive count returns distinct members and may return fewer', 'Số đếm âm là lấy mẫu có hoàn lại và luôn trả về đúng chừng ấy; số đếm dương trả về các thành viên khác nhau và có thể trả về ít hơn'),
          ],
          correct: 3,
          explanation: EX(
            'The sign of the count changes the guarantee, not the direction. Positive means "give me up to N distinct members" — it caps at the set size, which is why asking for 5 from a 4-member set returned 4. Negative means "sample N times with replacement" — you can get the same member repeatedly and you can ask for more than the set contains. Positive is what you want for "show 3 random related posts"; negative is for weighted sampling. Neither modifies the set: <code>SPOP</code> is the destructive one, and because its removal and its read are a single atomic step it is how you hand out a one-time code or a raffle ticket exactly once.',
            'Dấu của số đếm đổi sự BẢO ĐẢM, chứ không đổi chiều duyệt. Dương nghĩa là "cho tôi TỐI ĐA N thành viên khác nhau" — nó bị chặn ở kích thước set, nên xin 5 từ một set 4 thành viên thì trả về 4. Âm nghĩa là "lấy mẫu N lần có hoàn lại" — bạn có thể nhận cùng một thành viên nhiều lần, và có thể xin nhiều hơn số thành viên đang có. Dương là thứ bạn muốn cho "hiện 3 bài liên quan ngẫu nhiên"; âm là cho lấy mẫu có trọng số. Cả hai đều không sửa set: <code>SPOP</code> mới là lệnh phá huỷ, và vì việc xoá với việc đọc của nó là MỘT bước nguyên tử nên nó là cách phát một mã dùng một lần hay một vé số đúng một lần duy nhất.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, where <code>alice</code> is already in the sorted set with score 1500. Fill in the four missing replies.' + code(
              '> ZADD board NX 9999 alice\n' +
              '?\n' +
              '> ZADD board XX GT CH 1600 alice\n' +
              '?\n' +
              '> ZADD board XX GT CH 1400 alice\n' +
              '?\n' +
              '> ZADD board NX INCR 50 alice\n' +
              '?',
            ),
            'Chạy thật trên Redis 7.4.9, với <code>alice</code> đã có trong sorted set ở điểm 1500. Điền bốn dòng trả lời còn thiếu.' + code(
              '> ZADD board NX 9999 alice\n' +
              '?\n' +
              '> ZADD board XX GT CH 1600 alice\n' +
              '?\n' +
              '> ZADD board XX GT CH 1400 alice\n' +
              '?\n' +
              '> ZADD board NX INCR 50 alice\n' +
              '?',
            ),
          ),
          options: [
            B('<code>(integer) 1</code>, <code>(integer) 1</code>, <code>(integer) 1</code>, <code>"1650"</code>', '<code>(integer) 1</code>, <code>(integer) 1</code>, <code>(integer) 1</code>, <code>"1650"</code>'),
            B('<code>(integer) 0</code>, <code>(integer) 1</code>, <code>(integer) 0</code>, <code>(nil)</code>', '<code>(integer) 0</code>, <code>(integer) 1</code>, <code>(integer) 0</code>, <code>(nil)</code>'),
            B('<code>(integer) 0</code>, <code>(integer) 0</code>, <code>(integer) 0</code>, <code>"9999"</code>', '<code>(integer) 0</code>, <code>(integer) 0</code>, <code>(integer) 0</code>, <code>"9999"</code>'),
            B('<code>(error) ERR NX and GT are mutually exclusive</code> on all four lines', '<code>(error) ERR NX and GT are mutually exclusive</code> ở cả bốn dòng'),
          ],
          correct: 1,
          explanation: EX(
            '<code>NX</code> only adds members that are absent, so the first line changes nothing and returns 0 — alice keeps 1500. <code>XX GT CH</code> updates only an existing member and only upward, and <code>CH</code> makes the reply mean "how many were added <em>or changed</em>", so 1600 returns 1 and 1400 returns 0. Without <code>CH</code> an update always returns 0 and you cannot tell success from no-op. <code>INCR</code> returns the new score as a string, but combined with <code>NX</code> on a member that already exists the update is refused and the reply is nil. <code>ZADD … GT</code> is the whole implementation of a race-free high score: no read, no compare in the application, no retry loop.',
            '<code>NX</code> chỉ thêm những thành viên còn vắng, nên dòng đầu không đổi gì và trả về 0 — alice giữ nguyên 1500. <code>XX GT CH</code> chỉ cập nhật thành viên đã có và chỉ theo chiều tăng, còn <code>CH</code> làm phản hồi mang nghĩa "bao nhiêu cái được thêm HOẶC ĐỔI", nên 1600 trả 1 và 1400 trả 0. Không có <code>CH</code> thì một lần cập nhật luôn trả 0 và bạn không phân biệt được thành công với không-làm-gì. <code>INCR</code> trả về điểm mới dưới dạng chuỗi, nhưng kết hợp với <code>NX</code> trên một thành viên đã tồn tại thì phép cập nhật bị từ chối và phản hồi là nil. <code>ZADD … GT</code> chính là toàn bộ phần cài đặt của một điểm cao nhất không có cuộc đua: không đọc trước, không so sánh trong ứng dụng, không vòng lặp thử lại.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. Nothing errored. What went wrong, and what is the rule?' + code(
              '> ZADD ids 9007199254740993 a\n' +
              '(integer) 1\n' +
              '> ZSCORE ids a\n' +
              '"9007199254740992"',
            ),
            'Chạy thật trên Redis 7.4.9. Không có lỗi nào cả. Vậy hỏng ở đâu, và quy tắc là gì?' + code(
              '> ZADD ids 9007199254740993 a\n' +
              '(integer) 1\n' +
              '> ZSCORE ids a\n' +
              '"9007199254740992"',
            ),
          ),
          options: [
            B('Scores are stored as 32-bit floats, so anything above about four billion is rounded to the nearest million', 'Điểm được lưu bằng float 32 bit, nên mọi giá trị trên khoảng bốn tỷ đều bị làm tròn tới triệu gần nhất'),
            B('<code>ZSCORE</code> truncates its reply to sixteen digits; the score stored internally is still exact', '<code>ZSCORE</code> cắt bớt phản hồi còn mười sáu chữ số; điểm lưu bên trong thì vẫn chính xác'),
            B('Scores are IEEE-754 doubles, exact only to 2^53 — millisecond timestamps are safe, snowflake IDs are not', 'Điểm là số thực IEEE-754, chỉ chính xác tới 2^53 — dấu thời gian mili giây thì an toàn, ID kiểu snowflake thì không'),
            B('The member name <code>a</code> is too short, so Redis packs the score into the member slot and loses a bit', 'Tên thành viên <code>a</code> quá ngắn nên Redis nhét điểm vào ô thành viên và mất mất một bit'),
          ],
          correct: 2,
          explanation: EX(
            '2^53 + 1 came back as 2^53, silently: nothing errored, nothing warned, and two different large IDs can collapse onto the same score. Millisecond timestamps stay exact until the year 287396, so use those and never nanoseconds; for large identifiers put the ID in the <em>member</em> and something smaller in the score. Money has the same edge from the other side — measured on the same server, <code>ZADD prices 19.99 book</code> followed by <code>ZINCRBY prices 0.01 book</code> prints <code>"20"</code>, which is friendly formatting over a value binary floating point cannot hold exactly. Store integer minor units. Note that <code>inf</code> and <code>-inf</code> are legal scores, while any operation producing NaN is rejected with an error rather than corrupting the set.',
            '2^53 + 1 quay về thành 2^53 một cách âm thầm: không lỗi, không cảnh báo, và hai ID lớn khác nhau có thể sập chung một điểm. Dấu thời gian mili giây còn chính xác tới tận năm 287396, nên hãy dùng nó và đừng bao giờ dùng nano giây; với định danh lớn thì hãy để ID vào phần THÀNH VIÊN và để thứ gì nhỏ hơn vào phần điểm. Tiền bạc dính đúng cái mép ấy từ phía kia — đo trên cùng máy chủ, <code>ZADD prices 19.99 book</code> rồi <code>ZINCRBY prices 0.01 book</code> in ra <code>"20"</code>, một cách định dạng thân thiện phủ lên một giá trị mà số thực nhị phân không giữ chính xác được. Hãy lưu đơn vị nhỏ nhất dạng số nguyên. Lưu ý <code>inf</code> và <code>-inf</code> là điểm hợp lệ, còn mọi phép tính cho ra NaN đều bị từ chối bằng một lỗi chứ không làm hỏng cấu trúc.',
          ),
        }),

        mcq({
          prompt: B(
            'An autocomplete uses a sorted set where every member scores 0, and <code>ZRANGE ac "[ha" "[ha\\xff" BYLEX</code> correctly returns <code>ha giang</code>, <code>hai phong</code>, <code>hanoi</code>. One entry is then added as <code>ZADD ac 1 "hai duong"</code>. Measured on Redis 7.4.9, what does the same prefix query return afterwards?',
            'Một bộ gợi ý gõ dùng sorted set với mọi thành viên đều mang điểm 0, và <code>ZRANGE ac "[ha" "[ha\\xff" BYLEX</code> trả về đúng <code>ha giang</code>, <code>hai phong</code>, <code>hanoi</code>. Sau đó thêm một mục bằng <code>ZADD ac 1 "hai duong"</code>. Đo thật trên Redis 7.4.9, cùng câu truy vấn tiền tố ấy trả về gì?',
          ),
          options: [
            B('An error, because a lexicographic range on a sorted set with mixed scores is rejected outright', 'Một lỗi, vì dải từ điển trên một sorted set có điểm lẫn lộn thì bị từ chối thẳng thừng'),
            B('The same three, plus <code>hai duong</code> at the end, because BYLEX ignores scores entirely', 'Vẫn ba cái đó, cộng thêm <code>hai duong</code> ở cuối, vì BYLEX bỏ qua điểm hoàn toàn'),
            B('The same three as before — <code>hai duong</code> is silently missing, with no error and no warning', 'Vẫn đúng ba cái như trước — <code>hai duong</code> âm thầm biến mất, không lỗi, không cảnh báo'),
            B('Only <code>hai duong</code>, because the highest-scored member wins the whole lexicographic range', 'Chỉ mỗi <code>hai duong</code>, vì thành viên có điểm cao nhất chiếm trọn cả dải từ điển'),
          ],
          correct: 2,
          explanation: EX(
            'The skip list is ordered by <em>(score, member)</em>, so a lexicographic range is only a contiguous slice when every score is equal. With one member scored 1 it sorts after every zero-scored member, falls outside the slice, and simply never appears — a plausible-looking wrong answer with nothing in any log. Two more details that bite: the upper bound of a prefix is the prefix plus <code>\\xff</code> (the highest byte), and comparison is byte-wise, so <code>Hanoi</code> and <code>hanoi</code> are far apart and Vietnamese diacritics sort after every ASCII letter. Normalise to lowercase, strip diacritics into the member, and keep the display form elsewhere.',
            'Skip list được sắp theo CẶP (điểm, thành viên), nên một dải từ điển chỉ là một lát cắt liền mạch khi mọi điểm bằng nhau. Có một thành viên mang điểm 1 thì nó nằm sau mọi thành viên điểm 0, rơi ra ngoài lát cắt, và đơn giản là không bao giờ xuất hiện — một câu trả lời sai mà nhìn rất hợp lý, không để lại gì trong log cả. Thêm hai chi tiết dễ cắn: cận trên của một tiền tố là tiền tố cộng <code>\\xff</code> (byte cao nhất), và phép so sánh là theo byte, nên <code>Hanoi</code> và <code>hanoi</code> cách nhau rất xa còn dấu tiếng Việt xếp sau mọi chữ cái ASCII. Hãy chuẩn hoá về chữ thường, bỏ dấu vào phần thành viên, và giữ bản hiển thị ở chỗ khác.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, on a geo key holding three cities. What do these replies tell you?' + code(
              '> TYPE vn\n' +
              'zset\n' +
              '> ZSCORE vn hanoi\n' +
              '"3973593206939046"\n' +
              '> ZCARD vn\n' +
              '(integer) 3',
            ),
            'Chạy thật trên Redis 7.4.9, trên một khoá geo chứa ba thành phố. Những dòng trả lời này cho bạn biết gì?' + code(
              '> TYPE vn\n' +
              'zset\n' +
              '> ZSCORE vn hanoi\n' +
              '"3973593206939046"\n' +
              '> ZCARD vn\n' +
              '(integer) 3',
            ),
          ),
          options: [
            B('<code>GEOADD</code> maintains a shadow sorted set for indexing; the geo data itself lives in a separate hidden key', '<code>GEOADD</code> duy trì một sorted set bóng để đánh chỉ mục; dữ liệu geo thật nằm trong một khoá ẩn riêng'),
            B('There is no geo type at all: a geo key IS a sorted set whose score is a 52-bit geohash of the coordinates', 'Không hề có kiểu geo: một khoá geo CHÍNH LÀ sorted set mà điểm số là một geohash 52 bit của toạ độ'),
            B('<code>TYPE</code> reports the nearest compatible type for unknown types; geo is a distinct type internally', '<code>TYPE</code> báo kiểu tương thích gần nhất cho các kiểu lạ; bên trong thì geo vẫn là một kiểu riêng biệt'),
            B('The score is a member counter, and geo coordinates are stored in the member string after a separator', 'Điểm số là một bộ đếm thành viên, còn toạ độ geo được lưu trong chuỗi thành viên sau một dấu phân cách'),
          ],
          correct: 1,
          explanation: EX(
            'Longitude and latitude are interleaved bit by bit into one 52-bit integer, so nearby places get nearby scores and a 2-D proximity search becomes a handful of 1-D range scans on a structure Redis already has. 52 bits fits inside the 2^53 double budget exactly, which is not a coincidence. Every Z-command therefore works: <code>ZCARD</code> counts your locations, <code>ZREM</code> deletes one, <code>ZRANGE</code> lists them — and every sorted-set pitfall applies, including that there is no per-member TTL, so a driver-tracking key accumulates every driver who ever logged in unless you sweep it yourself. Careful with the course text here: it prints <code>skiplist</code> for a three-member geo key, but a real 7.4.9 reports <code>listpack</code>, exactly as the sorted-set chapter says it should below 128 members.',
            'Kinh độ và vĩ độ được đan xen từng bit vào một số nguyên 52 bit, nên những nơi gần nhau có điểm gần nhau và một phép tìm lân cận hai chiều trở thành vài phép quét dải một chiều trên đúng cấu trúc Redis vốn đã có. 52 bit lọt gọn trong ngân sách 2^53 của số thực, và đó không phải trùng hợp. Nhờ vậy mọi lệnh Z đều dùng được: <code>ZCARD</code> đếm số địa điểm, <code>ZREM</code> xoá một cái, <code>ZRANGE</code> liệt kê chúng — và mọi cái bẫy của sorted set cũng áp dụng, kể cả chuyện không có TTL cho từng thành viên, nên một khoá theo dõi tài xế sẽ gom lại mọi tài xế từng đăng nhập trừ khi bạn tự quét dọn. Cẩn thận với chỗ này trong giáo trình: nó in <code>skiplist</code> cho một khoá geo ba thành viên, nhưng máy 7.4.9 thật trả <code>listpack</code>, đúng như chính chương sorted set đã nói với các tập dưới 128 phần tử.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — A SCAN loop that actually finishes (chapter 2).</b> The starter gives you a miniature keyspace split into buckets, exactly like a real hash table, and a <code>SCAN(cursor, pattern, count)</code> function that behaves like the real command: it walks <code>count</code> buckets, applies the pattern <b>after</b> fetching them, returns <code>[nextCursor, keys]</code> with the cursor as a <b>string</b>, and returns <code>&quot;0&quot;</code> only when the iteration is complete. One key deliberately lives in two buckets, so it can come back twice.</p>' +
            '<p>Implement <code>scanAll(pattern, count)</code>. It must:</p>' +
            '<ul>' +
            '<li>start at cursor <code>&quot;0&quot;</code> and stop <b>only</b> when <code>SCAN</code> returns <code>&quot;0&quot;</code> — never on an empty batch;</li>' +
            '<li>return <code>{ keys, calls, emptyBatches }</code> where <code>keys</code> is <b>de-duplicated</b> and in first-seen order, <code>calls</code> is how many times you called <code>SCAN</code>, and <code>emptyBatches</code> is how many of those returned no keys;</li>' +
            '<li>call <code>SCAN</code> exactly once per iteration.</li>' +
            '</ul>' +
            '<p>Then implement <code>unlinkAll(pattern, batchSize)</code>: scan with <code>count = 2</code>, delete the matching keys with the provided <code>UNLINK(...keys)</code> in batches of at most <code>batchSize</code> (never call it with an empty list), and return <code>{ deleted, unlinkCalls }</code>.</p>' +
            '<p>Keep the given data and the printing block exactly as they are, and do not require anything.</p>',

            '<p><b>Câu 31 — Một vòng SCAN thật sự chạy tới hết (chương 2).</b> Đề cho sẵn một không gian khoá tí hon chia thành các xô, y như bảng băm thật, và một hàm <code>SCAN(cursor, pattern, count)</code> hành xử như lệnh thật: nó đi qua <code>count</code> xô, áp mẫu lọc <b>SAU KHI</b> lấy chúng về, trả về <code>[conTroKe, danhSachKhoa]</code> với con trỏ là một <b>chuỗi</b>, và chỉ trả <code>&quot;0&quot;</code> khi đã duyệt xong. Có một khoá cố ý nằm ở hai xô nên nó có thể quay về hai lần.</p>' +
            '<p>Hãy cài đặt <code>scanAll(pattern, count)</code>. Nó phải:</p>' +
            '<ul>' +
            '<li>bắt đầu ở con trỏ <code>&quot;0&quot;</code> và chỉ dừng khi <code>SCAN</code> trả về <code>&quot;0&quot;</code> — <b>không bao giờ</b> dừng vì một lô rỗng;</li>' +
            '<li>trả về <code>{ keys, calls, emptyBatches }</code> với <code>keys</code> đã <b>loại trùng</b> và giữ thứ tự gặp lần đầu, <code>calls</code> là số lần bạn gọi <code>SCAN</code>, và <code>emptyBatches</code> là số lượt trong đó trả về không khoá nào;</li>' +
            '<li>gọi <code>SCAN</code> đúng một lần mỗi vòng.</li>' +
            '</ul>' +
            '<p>Sau đó cài <code>unlinkAll(pattern, batchSize)</code>: quét với <code>count = 2</code>, xoá các khoá khớp bằng hàm <code>UNLINK(...keys)</code> cho sẵn, theo từng lô tối đa <code>batchSize</code> khoá (không bao giờ gọi nó với danh sách rỗng), và trả về <code>{ deleted, unlinkCalls }</code>.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không được require gì cả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// Một "máy chủ" tí hon. Không gian khoá chia thành 12 xô như một bảng băm.\n' +
            "// Khoá 'lock:beta' cố ý nằm ở HAI xô — SCAN thật cũng trả trùng như vậy.\n" +
            'const BUCKETS = [\n' +
            "  ['cache:1', 'cache:2'],\n" +
            "  ['cache:3'],\n" +
            "  [],\n" +
            "  ['cache:4', 'lock:alpha'],\n" +
            "  ['cache:5'],\n" +
            "  [],\n" +
            "  ['cache:6', 'cache:7'],\n" +
            "  ['lock:beta'],\n" +
            "  [],\n" +
            "  ['cache:8'],\n" +
            "  ['lock:beta', 'cache:9'],\n" +
            "  ['cache:10'],\n" +
            '];\n' +
            'const DELETED = new Set();\n\n' +
            'const matches = (key, pattern) =>\n' +
            "  new RegExp('^' + pattern.split('*').map((p) => p.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')).join('.*') + '$').test(key);\n\n" +
            '// Giống lệnh thật: đi qua `count` xô, LỌC SAU KHI lấy về, con trỏ là chuỗi.\n' +
            'let scanCalls = 0;\n' +
            "function SCAN(cursor, pattern, count = 1) {\n" +
            '  scanCalls++;\n' +
            '  const start = Number(cursor);\n' +
            '  const end = Math.min(start + count, BUCKETS.length);\n' +
            '  const fetched = [];\n' +
            '  for (let i = start; i < end; i++) fetched.push(...BUCKETS[i]);\n' +
            '  const keys = fetched.filter((k) => !DELETED.has(k) && matches(k, pattern));\n' +
            "  return [end >= BUCKETS.length ? '0' : String(end), keys];\n" +
            '}\n\n' +
            'function UNLINK(...keys) {\n' +
            '  let n = 0;\n' +
            '  for (const k of keys) if (!DELETED.has(k)) { DELETED.add(k); n++; }\n' +
            '  return n;\n' +
            '}\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function scanAll(pattern, count) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function unlinkAll(pattern, batchSize) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const show = (label, v) => console.log(label + ' ' + JSON.stringify(v));\n" +
            "show('locks count=1 :', scanAll('lock:*', 1));\n" +
            "show('locks count=4 :', scanAll('lock:*', 4));\n" +
            "show('cache count=3 :', scanAll('cache:*', 3));\n" +
            "show('none  count=2 :', scanAll('ghost:*', 2));\n" +
            "show('all   count=5 :', scanAll('*', 5));\n" +
            "show('unlink cache  :', unlinkAll('cache:*', 4));\n" +
            "show('after unlink  :', scanAll('*', 12));\n" +
            "show('unlink again  :', unlinkAll('cache:*', 4));\n",
          expectedOutput:
            'locks count=1 : {"keys":["lock:alpha","lock:beta"],"calls":12,"emptyBatches":9}\n' +
            'locks count=4 : {"keys":["lock:alpha","lock:beta"],"calls":3,"emptyBatches":0}\n' +
            'cache count=3 : {"keys":["cache:1","cache:2","cache:3","cache:4","cache:5","cache:6","cache:7","cache:8","cache:9","cache:10"],"calls":4,"emptyBatches":0}\n' +
            'none  count=2 : {"keys":[],"calls":6,"emptyBatches":6}\n' +
            'all   count=5 : {"keys":["cache:1","cache:2","cache:3","cache:4","lock:alpha","cache:5","cache:6","cache:7","lock:beta","cache:8","cache:9","cache:10"],"calls":3,"emptyBatches":0}\n' +
            'unlink cache  : {"deleted":10,"unlinkCalls":3}\n' +
            'after unlink  : {"keys":["lock:alpha","lock:beta"],"calls":1,"emptyBatches":0}\n' +
            'unlink again  : {"deleted":0,"unlinkCalls":0}',
          sampleSolution:
            'function scanAll(pattern, count) {\n' +
            '  const seen = new Set();\n' +
            '  const keys = [];\n' +
            '  let calls = 0;\n' +
            '  let emptyBatches = 0;\n' +
            "  let cursor = '0';\n" +
            '  do {\n' +
            '    const [next, batch] = SCAN(cursor, pattern, count);\n' +
            '    calls++;\n' +
            '    if (batch.length === 0) emptyBatches++;\n' +
            '    for (const k of batch) {\n' +
            '      if (!seen.has(k)) { seen.add(k); keys.push(k); }\n' +
            '    }\n' +
            '    cursor = next;\n' +
            "  } while (cursor !== '0');   // ← con trỏ, và CHỈ con trỏ, mới kết thúc vòng lặp\n" +
            '  return { keys, calls, emptyBatches };\n' +
            '}\n\n' +
            'function unlinkAll(pattern, batchSize) {\n' +
            '  const { keys } = scanAll(pattern, 2);\n' +
            '  let deleted = 0;\n' +
            '  let unlinkCalls = 0;\n' +
            '  for (let i = 0; i < keys.length; i += batchSize) {\n' +
            '    const chunk = keys.slice(i, i + batchSize);\n' +
            '    if (chunk.length === 0) continue;\n' +
            '    deleted += UNLINK(...chunk);\n' +
            '    unlinkCalls++;\n' +
            '  }\n' +
            '  return { deleted, unlinkCalls };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Why a fixed window lets through twice the limit (chapter 3).</b> No Redis server is involved: you are re-deriving the two counting rules by hand, on a fixed list of request timestamps in milliseconds.</p>' +
            '<p><code>fixedWindow(times, limit, windowMs)</code> — for each timestamp in order, the bucket is <code>Math.floor(t / windowMs)</code>. Increment that bucket\'s counter, then <b>allow the request when the counter after incrementing is at most <code>limit</code></b>. Return <code>{ allowed, denied, firstDeniedAt }</code>, where <code>firstDeniedAt</code> is the timestamp of the first denied request or <code>null</code>.</p>' +
            '<p><code>slidingApprox(times, limit, windowMs)</code> — the same buckets, but the decision weights the previous bucket by how much of it is still in view:</p>' +
            code(
              'cur      = Math.floor(t / windowMs)\n' +
              'elapsed  = (t % windowMs) / windowMs        // 0.0 … 1.0\n' +
              'weighted = countOf(cur) + countOf(cur - 1) * (1 - elapsed)\n' +
              'allowed  = weighted <= limit',
            ) +
            '<p>Increment <code>cur</code> <b>before</b> computing <code>weighted</code>, exactly as above, and count the request in its bucket whether or not it is allowed. Return the same three fields, plus <code>maxWeighted</code> — the largest <code>weighted</code> value seen, <b>rounded to two decimals</b> with <code>Math.round(x * 100) / 100</code>.</p>' +
            '<p>Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 32 — Vì sao cửa sổ cố định cho lọt gấp đôi hạn mức (chương 3).</b> Không có máy chủ Redis nào tham gia: bạn đang dựng lại hai quy tắc đếm bằng tay, trên một danh sách dấu thời gian request cố định tính bằng mili giây.</p>' +
            '<p><code>fixedWindow(times, limit, windowMs)</code> — với từng dấu thời gian theo thứ tự, xô của nó là <code>Math.floor(t / windowMs)</code>. Tăng bộ đếm của xô ấy, rồi <b>cho phép request khi bộ đếm SAU KHI tăng không vượt quá <code>limit</code></b>. Trả về <code>{ allowed, denied, firstDeniedAt }</code>, trong đó <code>firstDeniedAt</code> là dấu thời gian của request bị từ chối đầu tiên, hoặc <code>null</code>.</p>' +
            '<p><code>slidingApprox(times, limit, windowMs)</code> — vẫn những xô đó, nhưng quyết định có đánh trọng số cho xô trước theo phần còn nằm trong tầm nhìn:</p>' +
            code(
              'cur      = Math.floor(t / windowMs)\n' +
              'elapsed  = (t % windowMs) / windowMs        // 0.0 … 1.0\n' +
              'weighted = soLuong(cur) + soLuong(cur - 1) * (1 - elapsed)\n' +
              'allowed  = weighted <= limit',
            ) +
            '<p>Hãy tăng xô <code>cur</code> <b>TRƯỚC</b> khi tính <code>weighted</code>, đúng như trên, và đếm request vào xô của nó bất kể nó có được cho phép hay không. Trả về đúng ba trường ấy, cộng thêm <code>maxWeighted</code> — giá trị <code>weighted</code> lớn nhất từng thấy, <b>làm tròn hai chữ số thập phân</b> bằng <code>Math.round(x * 100) / 100</code>.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// Cửa sổ 60_000 ms. Mốc 1_800_000 ms là RANH GIỚI giữa hai cửa sổ.\n' +
            'const WINDOW = 60_000;\n' +
            'const LIMIT = 100;\n\n' +
            '// 100 request dồn vào 2 giây CUỐI của cửa sổ trước…\n' +
            'const burstBefore = Array.from({ length: 100 }, (_, i) => 1_800_000 - 2_000 + i * 20);\n' +
            '// …rồi 100 request nữa trong 2 giây ĐẦU của cửa sổ sau.\n' +
            'const burstAfter = Array.from({ length: 100 }, (_, i) => 1_800_000 + 20 + i * 20);\n' +
            'const BOUNDARY = [...burstBefore, ...burstAfter];\n\n' +
            '// Một client hiền lành: 150 request rải đều suốt 60 giây của MỘT cửa sổ.\n' +
            'const STEADY = Array.from({ length: 150 }, (_, i) => 1_800_000 + i * 400);\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function fixedWindow(times, limit, windowMs) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function slidingApprox(times, limit, windowMs) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const show = (label, v) => console.log(label + ' ' + JSON.stringify(v));\n" +
            "show('boundary · fixed  :', fixedWindow(BOUNDARY, LIMIT, WINDOW));\n" +
            "show('boundary · sliding:', slidingApprox(BOUNDARY, LIMIT, WINDOW));\n" +
            "show('steady   · fixed  :', fixedWindow(STEADY, LIMIT, WINDOW));\n" +
            "show('steady   · sliding:', slidingApprox(STEADY, LIMIT, WINDOW));\n" +
            "show('empty    · fixed  :', fixedWindow([], LIMIT, WINDOW));\n" +
            "show('empty    · sliding:', slidingApprox([], LIMIT, WINDOW));\n" +
            "show('one req  · sliding:', slidingApprox([1_800_000], LIMIT, WINDOW));\n",
          expectedOutput:
            'boundary · fixed  : {"allowed":200,"denied":0,"firstDeniedAt":null}\n' +
            'boundary · sliding: {"allowed":100,"denied":100,"firstDeniedAt":1800020,"maxWeighted":196.67}\n' +
            'steady   · fixed  : {"allowed":100,"denied":50,"firstDeniedAt":1840000}\n' +
            'steady   · sliding: {"allowed":100,"denied":50,"firstDeniedAt":1840000,"maxWeighted":150}\n' +
            'empty    · fixed  : {"allowed":0,"denied":0,"firstDeniedAt":null}\n' +
            'empty    · sliding: {"allowed":0,"denied":0,"firstDeniedAt":null,"maxWeighted":0}\n' +
            'one req  · sliding: {"allowed":1,"denied":0,"firstDeniedAt":null,"maxWeighted":1}',
          sampleSolution:
            'function fixedWindow(times, limit, windowMs) {\n' +
            '  const buckets = new Map();\n' +
            '  let allowed = 0;\n' +
            '  let denied = 0;\n' +
            '  let firstDeniedAt = null;\n' +
            '  for (const t of times) {\n' +
            '    const cur = Math.floor(t / windowMs);\n' +
            '    const n = (buckets.get(cur) ?? 0) + 1;\n' +
            '    buckets.set(cur, n);\n' +
            '    if (n <= limit) allowed++;\n' +
            '    else { denied++; if (firstDeniedAt === null) firstDeniedAt = t; }\n' +
            '  }\n' +
            '  return { allowed, denied, firstDeniedAt };\n' +
            '}\n\n' +
            'function slidingApprox(times, limit, windowMs) {\n' +
            '  const buckets = new Map();\n' +
            '  let allowed = 0;\n' +
            '  let denied = 0;\n' +
            '  let firstDeniedAt = null;\n' +
            '  let maxWeighted = 0;\n' +
            '  for (const t of times) {\n' +
            '    const cur = Math.floor(t / windowMs);\n' +
            '    // Đếm TRƯỚC rồi mới quyết định — chính là "INCR rồi so", không phải "so rồi INCR".\n' +
            '    buckets.set(cur, (buckets.get(cur) ?? 0) + 1);\n' +
            '    const elapsed = (t % windowMs) / windowMs;\n' +
            '    const weighted = buckets.get(cur) + (buckets.get(cur - 1) ?? 0) * (1 - elapsed);\n' +
            '    if (weighted > maxWeighted) maxWeighted = weighted;\n' +
            '    if (weighted <= limit) allowed++;\n' +
            '    else { denied++; if (firstDeniedAt === null) firstDeniedAt = t; }\n' +
            '  }\n' +
            '  return { allowed, denied, firstDeniedAt, maxWeighted: Math.round(maxWeighted * 100) / 100 };\n' +
            '}\n',
        }),
      ],
    },
  ],
};
