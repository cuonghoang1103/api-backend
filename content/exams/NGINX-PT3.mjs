/**
 * Nginx — Progress Test 3 (chương s08–s11).
 *
 * Đề tự soạn, bám sát `content/courses/nginx/s08…s11`. 30 câu trắc nghiệm +
 * 2 câu lập trình làm ngay trong phòng thi (chấm bằng AI theo rubric).
 *
 * ⚠️ MỌI đoạn terminal trong đề đều CHẠY THẬT ngày 10/09/2026, trên
 *   **nginx/1.27.5** (ảnh `nginx:1.27-alpine`, linux/arm64) chạy trong Docker
 *   Engine 29.5.3 trên macOS 25.6.0 / Apple M1 Max, cùng ba upstream Node 22
 *   tự xưng tên (B1/B2/B3) và tự đếm số lần bị gọi. Mã trạng thái, header
 *   `Location`, dòng access log, dòng error log và chuỗi máy được chọn đều là
 *   nguyên văn máy in ra, không phải trí nhớ. Mọi container nháp đã
 *   `docker rm -f` sau khi đo.
 *
 * ⚠️ SÁU CHỖ MÁY KHÁC (hoặc SÂU HƠN) GIÁO TRÌNH, đã đo lại và ĐỀ THEO MÁY:
 *   • Giáo trình (8.4) nói `error_page` bắt được mã lỗi do `return` sinh ra.
 *     ĐO THẬT: chỉ đúng với `return 404;` KHÔNG kèm thân. `return 404
 *     "khong-thay\n";` đi thẳng ra dây, `error_page` không hề chạm tới —
 *     bốn dạng `error_page` khác nhau đều bị bỏ qua như nhau. Câu 7 dựng trên
 *     đúng cặp đo được ấy.
 *   • Giáo trình (8.4) không nói tới `error_page 404 =301 /noi-khac;`.
 *     ĐO THẬT: nó trả **301 mà KHÔNG có header `Location`** — một cú chuyển
 *     hướng không đích, hợp lệ với `nginx -t` và chết câm với mọi client.
 *     Câu 9 dùng đúng transcript đó.
 *   • Giáo trình (9.1) vẽ vòng tròn có trọng số như phát theo lô
 *     (`B1 B1 B1 B2`). ĐO THẬT với `weight=3/2/1`: **`B1 B2 B1 B3 B2 B1`** —
 *     thuật toán là vòng tròn MƯỢT (cộng dồn rồi trừ tổng), tỉ lệ đúng trọn
 *     chu kỳ nhưng máy nặng bị RẢI RA. Năm bộ trọng số đều đã đo, và câu 31
 *     bắt cài lại đúng thuật toán ấy.
 *   • Giáo trình (9.1) đo chuỗi phân phối mà không nói số worker. ĐO THẬT:
 *     cùng cấu hình, `worker_processes 1` cho `B1 B2 B3 B1 B2 B3 …` sạch sẽ,
 *     còn 3 worker cho `B1 B2 B3 B3 B2 B1 B3 B2 B1` — **mỗi worker giữ bộ đếm
 *     RIÊNG**. Câu 11 ra theo cặp đo đó; mọi phép đo phân phối khác trong đề
 *     này đều chạy với một worker.
 *   • Giáo trình (9.3) nói `proxy_read_timeout` là "trần chờ backend".
 *     ĐO THẬT: nó là trần cho MỖI LƯỢT THỬ. Với ba máy và trần 2s, một
 *     endpoint chậm thật làm client chờ **6,054 giây** rồi mới nhận 504, và
 *     error log có **ba** dòng cho **một** request. Câu 12 và câu 26 dùng số
 *     đo được.
 *   • Giáo trình (11.2) nói `nginx -t` xanh nghĩa là tệp bạn vừa sửa đã hợp
 *     lệ. ĐO THẬT trên bind-mount một TỆP ĐƠN: sửa bằng `sed -i` (ghi tệp tạm
 *     rồi đổi tên ⇒ inode MỚI) thì container vẫn đọc inode CŨ — `nginx -t`
 *     xanh, `reload` xanh, nội dung KHÔNG đổi. Ghi đè TẠI CHỖ thì đổi. Câu 30
 *     dựng trên đúng ba lượt đo ấy.
 *
 * ⚠️ HAI CÂU LẬP TRÌNH (31, 32) khai `language: 'javascript'` CHỨ KHÔNG PHẢI
 *   `'nginx'`: nhãn `nginx` nằm trong tập `KHONG_CHAY_DUOC` của
 *   `scripts/exam-check.mjs`, khai nó là bộ kiểm bỏ qua và đề mất hẳn phép
 *   kiểm quan trọng nhất. Học viên vì thế viết JavaScript HIỆN THỰC ĐÚNG LUẬT
 *   của Nginx trên cấu hình cho sẵn dạng dữ liệu, và lời giải tự chứa.
 *
 * ⚠️ CHỖ KHÔNG ĐO ĐƯỢC: `host.docker.internal` phân giải ra CẢ A lẫn AAAA, và
 *   một `server <tên>;` như thế cho chuỗi phân phối lệch hẳn so với lý thuyết.
 *   Không tách bạch được là nginx dựng hai peer hay là peer IPv6 hỏng rồi bị
 *   thử lại, nên đề KHÔNG có câu nào về chuyện đó; mọi phép đo cân bằng tải
 *   trong đề đều trỏ thẳng vào địa chỉ IPv4.
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 7 · B 8 · C 8 · D 7.
 *   node -e "import('./content/exams/NGINX-PT3.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NGINX-PT3.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/nginx-exam-kit.mjs';

export default {
  course: { slug: 'nginx' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 8–11 (rewrite and map, load balancing, logs, diagnosis)',
        'Kiểm tra tiến độ 3 — Chương 8–11 (viết lại và ánh xạ, cân bằng tải, log, chẩn đoán)',
      ),
      description: B(
        'The last third of the Nginx course: what a rewrite really does to a URI and which flag decides it, the lookup table that replaces every if, how one request is spread over several backends and what happens when one of them dies, the fields a default log format leaves out, and how to make Nginx tell you what it actually did. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba cuối của khoá Nginx: một cú rewrite thật sự làm gì với URI và cái cờ nào quyết định điều đó, cái bảng tra thay thế mọi câu if, một request được rải qua nhiều backend ra sao và chuyện gì xảy ra khi một cái trong đó chết, những trường mà định dạng log mặc định bỏ sót, và cách bắt Nginx khai ra nó ĐÃ làm gì. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '8–11'),
      questions: [

        /* ── Chương 8 — rewrite, map, return, error_page (9 câu) ───────── */

        // q1 · đáp án 2
        mcq({
          prompt: B(
            'Two rewrites that differ only in one word, measured on nginx/1.27.5.' + code(
              'location /r6/  { rewrite ^/r6/(.*)$ /dich/$1;      return 200 "R6 uri=$uri\\n"; }\n' +
              'location /r1/  { rewrite ^/r1/(.*)$ /dich/$1 last; return 200 "R1-KHONG-BAO-GIO\\n"; }\n' +
              'location /dich/ { return 200 "DICH uri=$uri req=$request_uri\\n"; }\n' +
              '\n' +
              '/r6/x  ->  200  R6 uri=/dich/x\n' +
              '/r1/x  ->  200  DICH uri=/dich/x req=/r1/x',
            ) + 'What does the pair prove about a rewrite written without a flag?',
            'Hai cú rewrite chỉ khác nhau đúng một chữ, đo trên nginx/1.27.5.' + code(
              'location /r6/  { rewrite ^/r6/(.*)$ /dich/$1;      return 200 "R6 uri=$uri\\n"; }\n' +
              'location /r1/  { rewrite ^/r1/(.*)$ /dich/$1 last; return 200 "R1-KHONG-BAO-GIO\\n"; }\n' +
              'location /dich/ { return 200 "DICH uri=$uri req=$request_uri\\n"; }\n' +
              '\n' +
              '/r6/x  ->  200  R6 uri=/dich/x\n' +
              '/r1/x  ->  200  DICH uri=/dich/x req=/r1/x',
            ) + 'Cặp này chứng minh điều gì về một cú rewrite viết KHÔNG kèm cờ?',
          ),
          options: [
            B(
              'A flagless rewrite is a no-op that Nginx keeps for backwards compatibility, which is why the block below it answered with a URI it had already changed once before',
              'Rewrite không cờ là một lệnh rỗng mà Nginx giữ lại cho tương thích ngược, và đó là lý do khối bên dưới nó trả lời bằng một URI vốn đã bị đổi từ trước',
            ),
            B(
              'A flagless rewrite behaves exactly like <code>last</code> but without printing a warning, so the two lines differ only because <code>/dich/</code> is declared after <code>/r6/</code> in the file',
              'Rewrite không cờ hành xử y hệt <code>last</code> chỉ khác là không in cảnh báo, nên hai dòng chỉ khác nhau vì <code>/dich/</code> được khai sau <code>/r6/</code> trong tệp',
            ),
            B(
              'Without a flag the rewrite only replaces <code>$uri</code> and the SAME block keeps running, so the <code>return</code> below it still fires; <code>last</code> restarts location matching with the new URI, which is why the <code>return</code> written after it can never run',
              'Không có cờ thì rewrite chỉ thay <code>$uri</code> rồi CHÍNH khối đó chạy tiếp, nên lệnh <code>return</code> bên dưới vẫn nổ; còn <code>last</code> khởi động lại việc chọn location với URI mới, và đó là lý do lệnh <code>return</code> viết sau nó không bao giờ chạy được',
            ),
            B(
              'Both forms restart location matching; the difference is that <code>last</code> also resets <code>$request_uri</code>, which is why one line shows the original path and the other does not',
              'Cả hai dạng đều khởi động lại việc chọn location; khác nhau ở chỗ <code>last</code> đặt lại luôn <code>$request_uri</code>, và đó là lý do một dòng hiện đường dẫn gốc còn dòng kia thì không',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The rewrite module runs inside a phase, and a flag says what to do with the REST of that phase. No flag: substitute and carry on with the directives that follow, in the block you are already in — the <code>return</code> sees the new <code>$uri</code>. <code>last</code>: stop, and go back to the location search with the new URI, so anything written after it in that block is dead code that <code>nginx -t</code> will not warn you about. Note the third value too: <code>$request_uri</code> is still <code>/r1/x</code> after the internal jump, because it is the raw request line the client sent and no internal rewrite can change it. That is exactly what makes it the right variable for an access log and the wrong one for <code>root</code>.',
            'Module rewrite chạy bên trong một PHA, và cái cờ nói cho nó biết phải làm gì với PHẦN CÒN LẠI của pha đó. Không cờ: thay xong rồi đi tiếp với các chỉ thị phía sau, ngay trong cái khối bạn đang đứng — lệnh <code>return</code> nhìn thấy <code>$uri</code> mới. Còn <code>last</code>: dừng lại, quay về khâu chọn location với URI mới, nên mọi thứ viết sau nó trong khối đó là mã chết mà <code>nginx -t</code> sẽ không cảnh báo gì. Cũng để ý giá trị thứ ba: <code>$request_uri</code> vẫn là <code>/r1/x</code> sau cú nhảy nội bộ, vì nó là dòng request THÔ mà client gửi lên và không cú rewrite nội bộ nào đổi được. Chính điều đó khiến nó là biến ĐÚNG cho access log và là biến SAI cho <code>root</code>.',
          ),
        }),

        // q2 · đáp án 0
        mcq({
          prompt: B(
            'Two rewrite targets that differ by one character at the very end, measured on nginx/1.27.5 against an upstream block that prints its variables.' + code(
              'location /r8/ { rewrite ^/r8/(.*)$ /dich/$1?them=1  last; }\n' +
              'location /r9/ { rewrite ^/r9/(.*)$ /dich/$1?them=1? last; }\n' +
              '\n' +
              '/r8/x?q=1  ->  DICH uri=/dich/x req=/r8/x?q=1 arg=them=1&q=1\n' +
              '/r9/x?q=1  ->  DICH uri=/dich/x req=/r9/x?q=1 arg=them=1',
            ) + 'What is the rule?',
            'Hai đích rewrite chỉ khác nhau đúng một ký tự ở tận cùng, đo trên nginx/1.27.5 với một khối in ra các biến của nó.' + code(
              'location /r8/ { rewrite ^/r8/(.*)$ /dich/$1?them=1  last; }\n' +
              'location /r9/ { rewrite ^/r9/(.*)$ /dich/$1?them=1? last; }\n' +
              '\n' +
              '/r8/x?q=1  ->  DICH uri=/dich/x req=/r8/x?q=1 arg=them=1&q=1\n' +
              '/r9/x?q=1  ->  DICH uri=/dich/x req=/r9/x?q=1 arg=them=1',
            ) + 'Luật ở đây là gì?',
          ),
          options: [
            B(
              'A query string in the replacement is PREPENDED to the client\'s own arguments, and a trailing <code>?</code> at the very end of the replacement throws the client\'s arguments away instead',
              'Một chuỗi truy vấn trong phần thay thế được ghép vào TRƯỚC các tham số của client, còn một dấu <code>?</code> ở tận cùng phần thay thế thì VỨT BỎ tham số của client đi',
            ),
            B(
              'The second form is a syntax error that Nginx silently tolerates, so the arguments were dropped by accident rather than on purpose',
              'Dạng thứ hai là một lỗi cú pháp mà Nginx âm thầm bỏ qua, nên tham số bị mất là do tai nạn chứ không phải chủ ý',
            ),
            B(
              'Arguments are never inherited across a rewrite, so <code>them=1&amp;q=1</code> must have come from the client sending both parameters in the first place',
              'Tham số không bao giờ được thừa hưởng qua một cú rewrite, nên <code>them=1&amp;q=1</code> chắc chắn là do client tự gửi cả hai tham số ngay từ đầu',
            ),
            B(
              'The difference is in the location, not the flag: <code>/r9/</code> matched a shorter prefix, and a shorter prefix always causes the original query string to be discarded',
              'Khác biệt nằm ở location chứ không ở cái cờ: <code>/r9/</code> khớp một tiền tố ngắn hơn, và tiền tố ngắn hơn thì luôn làm chuỗi truy vấn gốc bị vứt đi',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Adding parameters during a rewrite is additive by default: what you wrote goes first and whatever the client sent is appended after it, which is almost never what a migration wants. The lone <code>?</code> at the end of the replacement is the documented way to say "and nothing else" — it is easy to lose in a diff and it changes the meaning of the line completely. Watch the third value in both rows: <code>$request_uri</code> never changed, so a log or a metric keyed on it will show the OLD path with the OLD arguments long after the rewrite went live, and an engineer comparing the log with the application\'s own log will find two different URLs for one request.',
            'Thêm tham số trong lúc rewrite mặc định là CỘNG THÊM: thứ bạn viết đứng trước, còn thứ client gửi lên được nối vào sau, mà điều đó gần như không bao giờ là thứ một cuộc chuyển đổi URL mong muốn. Dấu <code>?</code> đứng trơ trọi ở cuối phần thay thế chính là cách viết có ghi trong tài liệu để nói "và không gì khác nữa" — nó rất dễ lọt mất trong một cái diff và nó đổi hoàn toàn ý nghĩa của dòng lệnh. Hãy để ý giá trị thứ ba ở cả hai dòng: <code>$request_uri</code> không hề đổi, nên một dòng log hay một số đo lấy theo nó sẽ hiện đường dẫn CŨ với tham số CŨ rất lâu sau khi cú rewrite đã lên, và một kỹ sư đem log ấy so với log của chính ứng dụng sẽ thấy HAI URL cho MỘT request.',
          ),
        }),

        // q3 · đáp án 1
        mcq({
          prompt: B(
            'Nginx listens on 8080 inside a container; the client reaches it through the published port 18082. Measured on nginx/1.27.5.' + code(
              'location /r4/ { rewrite ^/r4/(.*)$ /dich/$1 permanent; }\n' +
              '\n' +
              '$ curl -sI http://127.0.0.1:18082/r4/x\n' +
              'HTTP/1.1 301 Moved Permanently\n' +
              'Location: http://127.0.0.1:8080/dich/x        <- cong 8080, KHONG phai 18082',
            ) + 'What built that <code>Location</code>, and what does it mean in production?',
            'Nginx nghe cổng 8080 bên trong container; client tới qua cổng công bố 18082. Đo trên nginx/1.27.5.' + code(
              'location /r4/ { rewrite ^/r4/(.*)$ /dich/$1 permanent; }\n' +
              '\n' +
              '$ curl -sI http://127.0.0.1:18082/r4/x\n' +
              'HTTP/1.1 301 Moved Permanently\n' +
              'Location: http://127.0.0.1:8080/dich/x        <- cong 8080, KHONG phai 18082',
            ) + 'Cái gì đã dựng ra <code>Location</code> ấy, và trên production nó có nghĩa gì?',
          ),
          options: [
            B(
              'curl rewrote the header to the port it had resolved internally before printing it, so the byte stream on the wire carried the published port 18082 all along and every real client sees the right address',
              'curl đã viết lại header về cái cổng nó phân giải được ở bên trong trước khi in ra, nên luồng byte trên dây vẫn mang cổng công bố 18082 suốt từ đầu và mọi client thật đều thấy đúng địa chỉ',
            ),
            B(
              'Nginx builds an ABSOLUTE redirect from <code>$host</code> plus the port it is itself LISTENING on, so behind a published container port or a TLS terminator it advertises an address the client cannot use — <code>absolute_redirect off;</code> makes it relative, and <code>port_in_redirect off;</code> drops just the port',
              'Nginx dựng một cú chuyển hướng TUYỆT ĐỐI từ <code>$host</code> cộng với cổng mà chính NÓ đang NGHE, nên phía sau một cổng container đã công bố hay một chỗ kết thúc TLS thì nó quảng cáo một địa chỉ mà client không dùng được — <code>absolute_redirect off;</code> làm nó thành tương đối, còn <code>port_in_redirect off;</code> thì chỉ bỏ mỗi cái cổng',
            ),
            B(
              'The <code>permanent</code> flag always emits the internal listen address because a 301 is meant to be cached forever; <code>redirect</code> reads the port back off the connection instead, so switching that one word to a 302 fixes the whole thing',
              'Cờ <code>permanent</code> luôn phát ra địa chỉ nghe nội bộ vì một mã 301 vốn để được cache mãi mãi; còn <code>redirect</code> thì đọc lại cổng từ chính kết nối, nên đổi đúng một chữ ấy sang 302 là xong chuyện',
            ),
            B(
              'The port came straight out of the <code>Host</code> header, which curl had already normalised down to the origin port before sending it, so Nginx only echoed back a value the client itself had supplied',
              'Cái cổng lấy thẳng từ header <code>Host</code>, thứ mà curl đã chuẩn hoá về cổng gốc trước khi gửi đi, nên Nginx chỉ dội lại đúng một giá trị mà chính client đã cung cấp',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Every implicit redirect Nginx produces — a <code>rewrite … permanent</code>, the trailing-slash 301 on a directory, the one <code>try_files $uri/</code> emits — is assembled from the scheme it is speaking, <code>$host</code>, and its own listen port. Behind anything that changes the address between the client and Nginx, that port is wrong and sometimes the scheme is too: a TLS terminator in front turns a 301 into a downgrade to <code>http://</code> that the browser will follow. The two cures are one line each and they are not the same: <code>absolute_redirect off;</code> emits a relative <code>Location</code> and sidesteps host, scheme and port together, while <code>port_in_redirect off;</code> keeps the absolute form and only drops the port. Test it the way it was tested here, with <code>curl -sI</code> through the real public address, not from inside the container.',
            'Mọi cú chuyển hướng NGẦM mà Nginx sinh ra — một <code>rewrite … permanent</code>, cú 301 thêm dấu gạch chéo cuối cho một thư mục, cái mà <code>try_files $uri/</code> phát ra — đều được ráp từ giao thức nó đang nói, <code>$host</code>, và cổng nghe của chính nó. Phía sau bất cứ thứ gì làm đổi địa chỉ giữa client và Nginx thì cái cổng ấy sai, và đôi khi giao thức cũng sai luôn: một chỗ kết thúc TLS đứng trước biến cú 301 thành một cú hạ cấp về <code>http://</code> mà trình duyệt sẽ ngoan ngoãn đi theo. Hai cách chữa mỗi cách một dòng và chúng KHÁC nhau: <code>absolute_redirect off;</code> phát ra <code>Location</code> tương đối và né được cả tên máy, giao thức lẫn cổng; còn <code>port_in_redirect off;</code> giữ dạng tuyệt đối và chỉ bỏ mỗi cái cổng. Hãy kiểm đúng như người ta đã kiểm ở đây, bằng <code>curl -sI</code> qua địa chỉ công khai thật, đừng kiểm từ bên trong container.',
          ),
        }),

        // q4 · đáp án 3
        mcq({
          prompt: B(
            'One map, three requests, measured on nginx/1.27.5.' + code(
              'map $arg_v $ket {\n' +
              '  default        "MAC-DINH";\n' +
              '  "a"            "LA-A";\n' +
              '  "~^so(\\d+)$"   "REGEX-SO";\n' +
              '  ""             "RONG";\n' +
              '}\n' +
              '\n' +
              '/map/       ->  ket=RONG        <- KHONG co tham so v\n' +
              '/map/?v=    ->  ket=RONG        <- co tham so v, gia tri rong\n' +
              '/map/?v=b   ->  ket=MAC-DINH',
            ) + 'Which reading is right?',
            'Một cái map, ba request, đo trên nginx/1.27.5.' + code(
              'map $arg_v $ket {\n' +
              '  default        "MAC-DINH";\n' +
              '  "a"            "LA-A";\n' +
              '  "~^so(\\d+)$"   "REGEX-SO";\n' +
              '  ""             "RONG";\n' +
              '}\n' +
              '\n' +
              '/map/       ->  ket=RONG        <- KHONG co tham so v\n' +
              '/map/?v=    ->  ket=RONG        <- co tham so v, gia tri rong\n' +
              '/map/?v=b   ->  ket=MAC-DINH',
            ) + 'Cách đọc nào ĐÚNG?',
          ),
          options: [
            B(
              '<code>default</code> fires whenever the source variable is unset, and <code>""</code> is only reachable when the parameter is present but blank — the first two rows differ, and the transcript above must have been taken from two different builds',
              '<code>default</code> nổ mỗi khi biến nguồn không được đặt, còn <code>""</code> chỉ tới được khi tham số CÓ mà giá trị rỗng — hai dòng đầu là khác nhau, và transcript ở trên hẳn là lấy từ hai bản dựng khác nhau',
            ),
            B(
              'A map cannot contain an empty match value at all; <code>""</code> is parsed as a comment and the first two rows fell through to some other rule',
              'Một cái map hoàn toàn không được chứa giá trị khớp rỗng; <code>""</code> bị hiểu là chú thích và hai dòng đầu rơi xuống một luật nào khác',
            ),
            B(
              'Rows are tried top to bottom, so <code>default</code> being written first is what caught the third request; moving it to the bottom would make every request match <code>""</code>',
              'Các dòng được thử từ trên xuống, nên việc <code>default</code> viết đầu tiên mới là thứ bắt được request thứ ba; chuyển nó xuống cuối thì mọi request sẽ khớp <code>""</code>',
            ),
            B(
              '<code>""</code> is an ordinary match value meaning "the empty string", and a missing parameter also makes <code>$arg_v</code> empty — so a map on <code>$arg_v</code> CANNOT tell "absent" from "present but blank"; <code>default</code> only fires for a non-empty value that matched nothing',
              '<code>""</code> là một giá trị khớp bình thường nghĩa là "chuỗi rỗng", mà tham số VẮNG MẶT cũng làm <code>$arg_v</code> rỗng — nên một cái map trên <code>$arg_v</code> KHÔNG phân biệt được "không có" với "có mà để trống"; <code>default</code> chỉ nổ với một giá trị khác rỗng mà không khớp cái nào',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Nginx has no null: an unset variable and an empty one are the same empty string everywhere, and that is why the first two rows are identical. The consequence bites when the map is a feature flag or an authorisation decision — <code>?admin=</code> and no <code>admin</code> at all are indistinguishable, so "the parameter was left blank" cannot be treated as an error at this layer. Note also what <code>default</code> is NOT: it is not "first rule" and not "fallback for empty", it is the value used when nothing else matched, and an explicit <code>""</code> row will always beat it for an empty input. If you need to tell absent from blank, test <code>$request_uri</code> or do it in the application, where the difference exists.',
            'Nginx không có khái niệm null: một biến chưa đặt và một biến rỗng ở mọi nơi đều là cùng một chuỗi rỗng, và đó là lý do hai dòng đầu giống hệt nhau. Hệ quả cắn đau khi cái map là một cờ tính năng hay một quyết định phân quyền — <code>?admin=</code> và hoàn toàn không có <code>admin</code> là không phân biệt được, nên "tham số bị để trống" KHÔNG thể coi là lỗi ở tầng này. Cũng để ý <code>default</code> KHÔNG phải cái gì: nó không phải "luật đầu tiên" và cũng không phải "chỗ dự phòng cho giá trị rỗng", nó là giá trị dùng khi chẳng cái nào khớp, và một dòng <code>""</code> viết tường minh thì luôn thắng nó với đầu vào rỗng. Cần phân biệt vắng mặt với để trống thì hãy soi <code>$request_uri</code>, hoặc làm việc đó trong ứng dụng, nơi khác biệt ấy có tồn tại.',
          ),
        }),

        // q5 · đáp án 1
        mcq({
          prompt: B(
            'The same map with two regular expressions, measured on nginx/1.27.5.' + code(
              'map $arg_v $ket {\n' +
              '  default        "MAC-DINH";\n' +
              '  "a"            "LA-A";\n' +
              '  "~^so(\\d+)$"   "REGEX-SO";\n' +
              '  "~*^HOA"       "REGEX-KHONG-PHAN-BIET";\n' +
              '}\n' +
              '\n' +
              '/map/?v=so42     ->  ket=REGEX-SO\n' +
              '/map/?v=HOAxyz   ->  ket=REGEX-KHONG-PHAN-BIET\n' +
              '/map/?v=hoaxyz   ->  ket=REGEX-KHONG-PHAN-BIET     <- khong co chu HOA nao',
            ) + 'Which rule set explains all three?',
            'Cùng cái map ấy với hai biểu thức chính quy, đo trên nginx/1.27.5.' + code(
              'map $arg_v $ket {\n' +
              '  default        "MAC-DINH";\n' +
              '  "a"            "LA-A";\n' +
              '  "~^so(\\d+)$"   "REGEX-SO";\n' +
              '  "~*^HOA"       "REGEX-KHONG-PHAN-BIET";\n' +
              '}\n' +
              '\n' +
              '/map/?v=so42     ->  ket=REGEX-SO\n' +
              '/map/?v=HOAxyz   ->  ket=REGEX-KHONG-PHAN-BIET\n' +
              '/map/?v=hoaxyz   ->  ket=REGEX-KHONG-PHAN-BIET     <- khong co chu HOA nao',
            ) + 'Bộ luật nào giải thích được cả ba dòng?',
          ),
          options: [
            B(
              'All entries, literal and regular expression alike, are tried strictly in the order they are written, and matching is always case-insensitive because Nginx lowercases the source variable first',
              'Mọi mục, dù là chuỗi thường hay biểu thức chính quy, đều được thử đúng theo thứ tự viết ra, và phép khớp luôn không phân biệt hoa thường vì Nginx hạ chữ thường biến nguồn trước',
            ),
            B(
              'Literal strings are checked first no matter where they sit in the block; the regular expressions are then tried IN WRITTEN ORDER and the first hit wins; <code>~</code> is case-sensitive and <code>~*</code> is not, which is why a lowercase value matched a pattern spelled in capitals',
              'Chuỗi thường được xét TRƯỚC bất kể chúng nằm ở đâu trong khối; sau đó các biểu thức chính quy mới được thử THEO ĐÚNG THỨ TỰ VIẾT và cái trúng đầu tiên thắng; <code>~</code> phân biệt hoa thường còn <code>~*</code> thì không, và đó là lý do một giá trị viết thường lại khớp một mẫu gõ bằng chữ hoa',
            ),
            B(
              'A map may hold at most one regular expression; the second one was ignored and both uppercase rows fell through to <code>default</code>, which happens to carry that text',
              'Một cái map chỉ được chứa nhiều nhất một biểu thức chính quy; cái thứ hai bị bỏ qua và cả hai dòng chữ hoa rơi xuống <code>default</code>, thứ tình cờ mang đúng đoạn chữ đó',
            ),
            B(
              'Regular expressions are checked before literal strings, so <code>so42</code> could equally have matched <code>"a"</code> and the transcript only shows one of two possible outcomes',
              'Biểu thức chính quy được xét trước chuỗi thường, nên <code>so42</code> hoàn toàn có thể đã khớp <code>"a"</code> và transcript chỉ cho thấy một trong hai kết cục có thể xảy ra',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A map is a hash of the literal keys plus an ORDERED list of the regular expressions, and that difference is the whole behaviour: literals are free and order-independent, regexes cost a match attempt each and are tried in the order you wrote them, first hit wins. So a broad <code>~.</code> near the top quietly shadows every pattern below it, exactly the way a wildcard <code>server_name</code> shadows a regex one. The third row is the trap worth remembering: <code>~*</code> makes the PATTERN case-insensitive, so spelling it in capitals says nothing about what it matches. And because a map is evaluated lazily — only when the variable is first read — an expensive one costs nothing on the requests that never touch it.',
            'Một cái map là một bảng băm các khoá chuỗi thường CỘNG với một danh sách CÓ THỨ TỰ các biểu thức chính quy, và khác biệt đó chính là toàn bộ hành vi: chuỗi thường thì miễn phí và không phụ thuộc thứ tự, còn regex thì mỗi cái tốn một lượt thử khớp và được thử đúng theo thứ tự bạn viết, trúng đầu tiên là thắng. Nên một mẫu rộng như <code>~.</code> đặt gần đầu sẽ âm thầm che khuất mọi mẫu bên dưới nó, y hệt cách một <code>server_name</code> đại diện che một cái regex. Dòng thứ ba là cái bẫy đáng nhớ: <code>~*</code> làm cho MẪU không phân biệt hoa thường, nên việc gõ nó bằng chữ hoa chẳng nói lên điều gì về thứ nó khớp. Và vì map được tính LƯỜI — chỉ khi biến được đọc lần đầu — nên một cái map đắt đỏ không tốn gì trên những request không hề chạm tới nó.',
          ),
        }),

        // q6 · đáp án 2
        mcq({
          prompt: B(
            'One <code>if</code> used two ways in two locations, both measured on nginx/1.27.5.' + code(
              'location /if3/ { set $x "goc";\n' +
              '                 if ($arg_v = "a") { set $x "trong-if"; }\n' +
              '                 return 200 "x=$x\\n"; }\n' +
              'location /if2/ { add_header X-Server "S" always;\n' +
              '                 if ($arg_v = "a") { add_header X-Trong-If "T" always; }\n' +
              '                 return 200 "if2\\n"; }\n' +
              '\n' +
              '/if3/?v=a  ->  x=trong-if          /if2/?v=a  ->  X-Trong-If: T   (KHONG con X-Server)\n' +
              '/if3/?v=b  ->  x=goc               /if2/?v=b  ->  X-Server: S',
            ) + 'Which half of <code>if</code> is safe, and why?',
            'Cùng một câu <code>if</code> dùng theo hai kiểu ở hai location, cả hai đều đo trên nginx/1.27.5.' + code(
              'location /if3/ { set $x "goc";\n' +
              '                 if ($arg_v = "a") { set $x "trong-if"; }\n' +
              '                 return 200 "x=$x\\n"; }\n' +
              'location /if2/ { add_header X-Server "S" always;\n' +
              '                 if ($arg_v = "a") { add_header X-Trong-If "T" always; }\n' +
              '                 return 200 "if2\\n"; }\n' +
              '\n' +
              '/if3/?v=a  ->  x=trong-if          /if2/?v=a  ->  X-Trong-If: T   (KHONG con X-Server)\n' +
              '/if3/?v=b  ->  x=goc               /if2/?v=b  ->  X-Server: S',
            ) + 'Nửa nào của <code>if</code> là an toàn, và vì sao?',
          ),
          options: [
            B(
              'Neither is safe: the transcript shows both variables and headers being lost, and the only correct use of <code>if</code> is around a bare <code>return</code>',
              'Không nửa nào an toàn cả: transcript cho thấy mất cả biến lẫn header, và cách dùng <code>if</code> đúng duy nhất là bọc quanh một lệnh <code>return</code> trơ',
            ),
            B(
              'Both are safe here; the missing <code>X-Server</code> is only missing because <code>always</code> does not apply inside an <code>if</code>, and adding it a second time restores it',
              'Ở đây cả hai đều an toàn; <code>X-Server</code> mất đi chỉ vì <code>always</code> không có tác dụng bên trong một câu <code>if</code>, khai lại nó lần nữa là có ngay',
            ),
            B(
              'An <code>if</code> block is an implicit nested configuration level: a scalar directive such as <code>set</code> behaves as written, but every LIST-valued directive inherited into it — <code>add_header</code>, <code>proxy_set_header</code> — is REPLACED the moment the <code>if</code> declares one of its own',
              'Một khối <code>if</code> là một cấp cấu hình LỒNG ngầm: chỉ thị VÔ HƯỚNG như <code>set</code> hành xử đúng như viết, nhưng mọi chỉ thị dạng DANH SÁCH được thừa hưởng vào đó — <code>add_header</code>, <code>proxy_set_header</code> — đều bị THAY THẾ ngay khi câu <code>if</code> khai một cái của riêng nó',
            ),
            B(
              'The difference is the operator: <code>=</code> creates a nested level while <code>!=</code> and the regex forms do not, so rewriting the condition with <code>~</code> keeps both headers',
              'Khác biệt nằm ở toán tử: <code>=</code> tạo ra một cấp lồng còn <code>!=</code> và các dạng regex thì không, nên viết lại điều kiện bằng <code>~</code> là giữ được cả hai header',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is why the phrase "if is evil" exists, and it is more precise than the slogan: the danger is not the keyword, it is that an <code>if</code> creates a configuration level nobody thinks of as one. Scalar things — <code>set</code>, <code>return</code>, <code>rewrite</code> — do what they look like. List-valued things follow the same replacement rule a nested <code>location</code> follows, so one header added conditionally deletes every header the block had inherited, on exactly the requests where the condition is true. Nothing warns you and <code>nginx -t</code> is happy. The cure is not a cleverer <code>if</code>: put the decision in a <code>map</code> at the <code>http</code> level and use the resulting variable in a single unconditional <code>add_header</code>, so there is only ever one list.',
            'Đây chính là lý do có câu "if là quỷ dữ", và cách nói này chính xác hơn cái khẩu hiệu: nguy hiểm không nằm ở từ khoá, nó nằm ở chỗ một câu <code>if</code> tạo ra một CẤP cấu hình mà chẳng ai nghĩ nó là một cấp. Những thứ vô hướng — <code>set</code>, <code>return</code>, <code>rewrite</code> — làm đúng cái chúng trông như đang làm. Những thứ dạng danh sách thì theo đúng luật THAY THẾ mà một <code>location</code> lồng nhau vẫn theo, nên một cái header thêm vào có điều kiện sẽ XOÁ sạch mọi header khối đó thừa hưởng, đúng vào những request mà điều kiện đúng. Không có cảnh báo nào và <code>nginx -t</code> vẫn hài lòng. Cách chữa không phải một câu <code>if</code> khôn hơn: hãy đặt quyết định vào một <code>map</code> ở tầng <code>http</code> rồi dùng biến kết quả trong MỘT lệnh <code>add_header</code> không điều kiện, để lúc nào cũng chỉ có đúng một danh sách.',
          ),
        }),

        // q7 · đáp án 0
        mcq({
          prompt: B(
            'Two locations with the same <code>error_page</code> line, differing only in whether <code>return</code> carries a body. Measured on nginx/1.27.5.' + code(
              'location /e1/  { error_page 404 /loi/404.html; return 404 "khong-thay\\n"; }\n' +
              'location /f1/  { error_page 404 /loi/404.html; return 404; }\n' +
              'location /loi/ { return 200 "TRANG-LOI uri=$uri\\n"; }\n' +
              '\n' +
              '/e1/x  ->  404   khong-thay\n' +
              '/f1/x  ->  404   TRANG-LOI uri=/loi/404.html',
            ) + 'Why did the custom error page apply to only one of them?',
            'Hai location có cùng dòng <code>error_page</code>, chỉ khác nhau ở chỗ <code>return</code> có kèm thân hay không. Đo trên nginx/1.27.5.' + code(
              'location /e1/  { error_page 404 /loi/404.html; return 404 "khong-thay\\n"; }\n' +
              'location /f1/  { error_page 404 /loi/404.html; return 404; }\n' +
              'location /loi/ { return 200 "TRANG-LOI uri=$uri\\n"; }\n' +
              '\n' +
              '/e1/x  ->  404   khong-thay\n' +
              '/f1/x  ->  404   TRANG-LOI uri=/loi/404.html',
            ) + 'Vì sao trang lỗi tự soạn chỉ áp dụng cho đúng MỘT trong hai?',
          ),
          options: [
            B(
              '<code>error_page</code> intercepts an error Nginx GENERATES; <code>return 404 "…"</code> is not an error but a response you wrote, so it goes out as-is, while the bodyless <code>return 404;</code> does raise an internal error and gets intercepted',
              '<code>error_page</code> bắt lấy một lỗi do Nginx SINH RA; <code>return 404 "…"</code> không phải một lỗi mà là một phản hồi do bạn viết, nên nó đi thẳng ra dây, còn <code>return 404;</code> không kèm thân thì mới thật sự dấy lên một lỗi nội bộ và bị bắt',
            ),
            B(
              '<code>error_page</code> only applies to statuses produced by the content phase, and both <code>return</code> forms sit in the rewrite phase — the second row worked because <code>/loi/</code> happens to be declared later in the file',
              '<code>error_page</code> chỉ áp dụng cho mã trạng thái do pha nội dung sinh ra, mà cả hai dạng <code>return</code> đều nằm ở pha rewrite — dòng thứ hai chạy được là vì <code>/loi/</code> tình cờ được khai muộn hơn trong tệp',
            ),
            B(
              'The two rows are the same behaviour: the first location simply lacks a matching <code>location /loi/</code> in its own scope, and moving that block inside <code>/e1/</code> makes both rows identical',
              'Hai dòng là cùng một hành vi: khối đầu chỉ thiếu một <code>location /loi/</code> tương ứng trong phạm vi của chính nó, và chuyển khối đó vào trong <code>/e1/</code> là hai dòng giống hệt nhau',
            ),
            B(
              'A quoted body makes the response a 200 internally and Nginx only relabels it on the wire, so there was never a 404 for <code>error_page</code> to catch in the first place',
              'Một cái thân trong ngoặc kép biến phản hồi thành 200 ở bên trong rồi Nginx chỉ dán nhãn lại lúc ra dây, nên chưa từng có mã 404 nào để <code>error_page</code> bắt cả',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The distinction is one character wide and it silently disables custom error pages across a whole configuration. <code>return CODE;</code> asks Nginx for its standard error path, which is exactly where <code>error_page</code> is consulted. <code>return CODE "text";</code> says "this is the response", and there is nothing left to intercept. The practical symptom is a site where the branded 404 works on missing files and not on the API, because the API blocks all return a JSON body with the status. If you want both, return the body from the error handler instead: <code>return 404;</code> in the block and <code>error_page 404 /loi/404.json;</code> pointing at an <code>internal</code> location that writes the JSON. Verify it the way it was verified here, by curling both shapes.',
            'Khác biệt rộng đúng một ký tự và nó âm thầm vô hiệu hoá trang lỗi tự soạn trên cả một cấu hình. <code>return MÃ;</code> là nhờ Nginx đi con đường lỗi tiêu chuẩn của nó, mà đó chính là chỗ <code>error_page</code> được hỏi tới. Còn <code>return MÃ "chữ";</code> nói rằng "đây LÀ phản hồi", và chẳng còn gì để mà bắt nữa. Triệu chứng thực tế là một site có trang 404 mang thương hiệu chạy tốt với tệp thiếu nhưng không chạy với API, vì mọi khối API đều trả một thân JSON kèm mã trạng thái. Muốn có cả hai thì hãy trả cái thân ấy TỪ chính trình xử lý lỗi: viết <code>return 404;</code> trong khối và <code>error_page 404 /loi/404.json;</code> trỏ vào một location <code>internal</code> chuyên viết JSON. Hãy kiểm đúng như người ta đã kiểm ở đây, curl cả hai dạng.',
          ),
        }),

        // q8 · đáp án 3
        mcq({
          prompt: B(
            'Three spellings of <code>error_page</code> against the same bodyless <code>return 404;</code>, measured on nginx/1.27.5.' + code(
              'location /f2/ { error_page 404 =    /loi/ok.html;  return 404; }  -> 200  TRANG-LOI uri=/loi/ok.html\n' +
              'location /f3/ { error_page 404 =200 /loi/404.html; return 404; }  -> 200  TRANG-LOI uri=/loi/404.html\n' +
              'location /f4/ { error_page 404 @du-phong;          return 404; }  -> 404  DU-PHONG uri=/f4/x\n' +
              '\n' +
              'location /loi/     { return 200 "TRANG-LOI uri=$uri\\n"; }\n' +
              'location @du-phong { return 200 "DU-PHONG uri=$uri\\n"; }',
            ) + 'Which reading uses every row?',
            'Ba cách viết <code>error_page</code> trên cùng một lệnh <code>return 404;</code> không kèm thân, đo trên nginx/1.27.5.' + code(
              'location /f2/ { error_page 404 =    /loi/ok.html;  return 404; }  -> 200  TRANG-LOI uri=/loi/ok.html\n' +
              'location /f3/ { error_page 404 =200 /loi/404.html; return 404; }  -> 200  TRANG-LOI uri=/loi/404.html\n' +
              'location /f4/ { error_page 404 @du-phong;          return 404; }  -> 404  DU-PHONG uri=/f4/x\n' +
              '\n' +
              'location /loi/     { return 200 "TRANG-LOI uri=$uri\\n"; }\n' +
              'location @du-phong { return 200 "DU-PHONG uri=$uri\\n"; }',
            ) + 'Cách đọc nào dùng được MỌI dòng?',
          ),
          options: [
            B(
              'All three forms force a 200 and the third row only shows 404 because a named location cannot change the status of the response it is handling',
              'Cả ba dạng đều ép ra 200 và dòng thứ ba chỉ hiện 404 vì một location có tên không đổi được mã trạng thái của phản hồi nó đang xử lý',
            ),
            B(
              '<code>=</code> and <code>=200</code> are two spellings of one thing, and the third row differs because the <code>@</code> form is evaluated before the status is known',
              '<code>=</code> và <code>=200</code> là hai cách viết của cùng một thứ, còn dòng thứ ba khác đi vì dạng <code>@</code> được tính trước khi biết mã trạng thái',
            ),
            B(
              'The status always follows the handler: <code>/loi/</code> returns 200 so both of the first rows are 200, and <code>@du-phong</code> must therefore have returned 404 despite what its <code>return</code> line says',
              'Mã trạng thái luôn đi theo trình xử lý: <code>/loi/</code> trả 200 nên hai dòng đầu đều 200, và như vậy <code>@du-phong</code> hẳn đã trả 404 bất kể dòng <code>return</code> của nó viết gì',
            ),
            B(
              'Three separate knobs: a bare <code>=</code> adopts whatever status the handler returned, <code>=NNN</code> forces a fixed one, and no <code>=</code> at all keeps the original status no matter what the handler answers — and a NAMED handler keeps <code>$uri</code> as the ORIGINAL request instead of becoming the new URI',
              'Ba cái núm riêng biệt: một dấu <code>=</code> trơ thì LẤY mã mà trình xử lý trả về, <code>=NNN</code> thì ÉP một mã cố định, còn không có <code>=</code> nào thì GIỮ mã gốc bất kể trình xử lý trả lời gì — và một trình xử lý CÓ TÊN thì giữ <code>$uri</code> là request GỐC chứ không trở thành URI mới',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Row three is the one people get wrong, and it is the one that matters for diagnosis: a URI handler is an internal redirect, so <code>$uri</code> becomes the error page and the original path is only in <code>$request_uri</code>; a named location is not a redirect, so <code>$uri</code> is still what the client asked for and you can log it, count it, or build a fallback that depends on it. The status knob is the other half. Turning a 502 into a 200 with <code>error_page 502 = @fallback;</code> is a real technique for a maintenance page, and it is also how a broken deploy ends up reporting perfect health to every monitor you own — the response is a 200 whose body says the site is down. Choose the status deliberately, and keep the original one whenever anything is counting.',
            'Dòng thứ ba là dòng người ta hay hiểu sai, và nó cũng là dòng quan trọng cho việc chẩn đoán: một trình xử lý dạng URI là một cú chuyển hướng nội bộ, nên <code>$uri</code> trở thành trang lỗi còn đường dẫn gốc chỉ còn nằm ở <code>$request_uri</code>; còn một location CÓ TÊN thì không phải chuyển hướng, nên <code>$uri</code> vẫn là thứ client hỏi và bạn ghi log được, đếm được, hay dựng một chỗ dự phòng phụ thuộc vào nó. Cái núm mã trạng thái là nửa còn lại. Biến một mã 502 thành 200 bằng <code>error_page 502 = @fallback;</code> là một kỹ thuật có thật cho trang bảo trì, và nó cũng chính là cách một lần deploy hỏng đi báo cáo sức khoẻ hoàn hảo cho mọi hệ giám sát bạn có — phản hồi là một mã 200 mà thân của nó nói rằng site đang chết. Hãy chọn mã trạng thái một cách CÓ CHỦ Ý, và giữ nguyên mã gốc mỗi khi có thứ gì đó đang đếm.',
          ),
        }),

        // q9 · đáp án 2
        mcq({
          prompt: B(
            'Someone tries to redirect from an error page. Measured on nginx/1.27.5, <code>nginx -t</code> was clean.' + code(
              'location /f5/ { error_page 404 =301 /loi/di-noi-khac; return 404; }\n' +
              '\n' +
              '$ curl -si http://edge/f5/x\n' +
              'HTTP/1.1 301 Moved Permanently\n' +
              'Server: nginx/1.27.5\n' +
              'Content-Type: text/plain\n' +
              '                                  <- KHONG co header Location\n' +
              'TRANG-LOI uri=/loi/di-noi-khac',
            ) + 'What happened?',
            'Có người thử chuyển hướng từ một trang lỗi. Đo trên nginx/1.27.5, <code>nginx -t</code> hoàn toàn sạch.' + code(
              'location /f5/ { error_page 404 =301 /loi/di-noi-khac; return 404; }\n' +
              '\n' +
              '$ curl -si http://edge/f5/x\n' +
              'HTTP/1.1 301 Moved Permanently\n' +
              'Server: nginx/1.27.5\n' +
              'Content-Type: text/plain\n' +
              '                                  <- KHONG co header Location\n' +
              'TRANG-LOI uri=/loi/di-noi-khac',
            ) + 'Chuyện gì đã xảy ra?',
          ),
          options: [
            B(
              'curl stripped the <code>Location</code> header because the target was a relative path; a browser would have received it and followed the redirect normally',
              'curl đã cắt bỏ header <code>Location</code> vì đích là một đường dẫn tương đối; một trình duyệt thì vẫn nhận được và đi theo cú chuyển hướng bình thường',
            ),
            B(
              '<code>=301</code> is not a valid status override — only 2xx and 4xx may be forced — so Nginx fell back to serving the handler and stamped the requested code on it without acting on it',
              '<code>=301</code> không phải một cách ép mã hợp lệ — chỉ 2xx và 4xx mới ép được — nên Nginx quay về phục vụ trình xử lý rồi dán đại cái mã được yêu cầu lên mà không thi hành nó',
            ),
            B(
              '<code>=NNN</code> only overwrites the STATUS LINE. The body still comes from the internal handler and nothing ever builds a <code>Location</code>, so this is a 3xx with no destination — a dead end for every client, and <code>nginx -t</code> cannot see it',
              '<code>=NNN</code> chỉ ghi đè DÒNG TRẠNG THÁI. Cái thân vẫn tới từ trình xử lý nội bộ và chẳng có gì dựng ra một header <code>Location</code> cả, nên đây là một mã 3xx KHÔNG có đích — một ngõ cụt với mọi client, và <code>nginx -t</code> không thấy được',
            ),
            B(
              'The <code>Location</code> was sent but the location block that handled the error replaced the inherited header list, so it removed the redirect header Nginx had already added',
              'Header <code>Location</code> ĐÃ được gửi nhưng cái khối xử lý lỗi lại thay thế danh sách header thừa hưởng, nên nó gỡ mất chính cái header chuyển hướng mà Nginx vừa thêm vào',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A redirect is two things — a 3xx status AND a <code>Location</code> header — and <code>error_page … =NNN uri;</code> only ever produces the first. Nginx assembles the response from the internal handler and then relabels the status line, so the client is told "moved permanently" and given nowhere to move to. Browsers show a blank page, crawlers record the URL as broken, and a health check that only asserts <code>status &lt; 400</code> goes green. To redirect from an error, do it with a directive that actually emits a redirect: <code>error_page 404 /di-noi-khac;</code> where that internal location runs <code>return 301 https://…;</code>. The general lesson is the one this whole chapter keeps repeating: read the response with <code>curl -si</code>, headers included, instead of trusting the status code alone.',
            'Một cú chuyển hướng là HAI thứ — một mã 3xx VÀ một header <code>Location</code> — mà <code>error_page … =NNN uri;</code> thì chỉ bao giờ sinh ra thứ nhất. Nginx ráp phản hồi từ trình xử lý nội bộ rồi dán lại dòng trạng thái, nên client được bảo là "đã chuyển đi vĩnh viễn" mà không được cho biết chuyển đi đâu. Trình duyệt hiện trang trắng, bọ tìm kiếm ghi nhận URL đó là hỏng, còn một phép kiểm sức khoẻ chỉ khẳng định <code>mã &lt; 400</code> thì vẫn xanh. Muốn chuyển hướng từ một trang lỗi thì hãy làm bằng cái chỉ thị thật sự phát ra chuyển hướng: <code>error_page 404 /di-noi-khac;</code> với location nội bộ đó chạy <code>return 301 https://…;</code>. Bài học chung là thứ cả chương này cứ lặp đi lặp lại: hãy ĐỌC phản hồi bằng <code>curl -si</code>, kèm cả header, thay vì tin mỗi cái mã trạng thái.',
          ),
        }),

        /* ── Chương 9 — cân bằng tải (7 câu) ────────────────────────────── */

        // q10 · đáp án 1
        mcq({
          prompt: B(
            'One upstream group, twelve sequential requests, measured on nginx/1.27.5 with <code>worker_processes 1</code>.' + code(
              'upstream w321 {\n' +
              '  server 10.0.0.1:9201 weight=3;\n' +
              '  server 10.0.0.1:9202 weight=2;\n' +
              '  server 10.0.0.1:9203 weight=1;\n' +
              '}\n' +
              '\n' +
              'B1 B2 B1 B3 B2 B1   B1 B2 B1 B3 B2 B1\n' +
              '\n' +
              '# so lan: B1 = 6, B2 = 4, B3 = 2   (dung 3 : 2 : 1)',
            ) + 'Why is the heavy backend not served in a run of three?',
            'Một khối upstream, mười hai request tuần tự, đo trên nginx/1.27.5 với <code>worker_processes 1</code>.' + code(
              'upstream w321 {\n' +
              '  server 10.0.0.1:9201 weight=3;\n' +
              '  server 10.0.0.1:9202 weight=2;\n' +
              '  server 10.0.0.1:9203 weight=1;\n' +
              '}\n' +
              '\n' +
              'B1 B2 B1 B3 B2 B1   B1 B2 B1 B3 B2 B1\n' +
              '\n' +
              '# so lan: B1 = 6, B2 = 4, B3 = 2   (dung 3 : 2 : 1)',
            ) + 'Vì sao máy nặng KHÔNG được phục vụ ba lượt liền nhau?',
          ),
          options: [
            B(
              'The order is randomised on purpose so that a client cannot predict which backend it will reach; the counts match the weights only because twelve is a multiple of six',
              'Thứ tự được ngẫu nhiên hoá có chủ ý để một client không đoán được nó sẽ tới máy nào; số lần khớp trọng số chỉ vì mười hai chia hết cho sáu',
            ),
            B(
              'Nginx runs SMOOTH weighted round robin: every peer adds its weight to an accumulator, the largest accumulator serves, and only the winner has the total weight subtracted — so the ratio is exact over one six-request period while the heavy peer is SPREAD THROUGH it instead of batched',
              'Nginx chạy vòng tròn có trọng số kiểu MƯỢT: mỗi máy cộng trọng số của nó vào một bộ cộng dồn, bộ cộng dồn lớn nhất được phục vụ, và chỉ máy thắng mới bị trừ đi tổng trọng số — nên tỉ lệ chính xác trọn một chu kỳ sáu request trong khi máy nặng bị RẢI RA khắp chu kỳ thay vì đi theo lô',
            ),
            B(
              'The weights are advisory and Nginx corrects them from measured response times, which is why the sequence is not the batched one the weights would suggest',
              'Trọng số chỉ là gợi ý và Nginx tự hiệu chỉnh chúng theo thời gian phản hồi đo được, và đó là lý do chuỗi không phải cái chuỗi theo lô mà trọng số gợi ra',
            ),
            B(
              'A weight above 1 is implemented by listing the server that many times internally, so the order simply follows the order those copies were declared in',
              'Trọng số lớn hơn 1 được cài đặt bằng cách liệt kê máy đó bấy nhiêu lần ở bên trong, nên thứ tự chỉ đơn giản đi theo thứ tự các bản sao ấy được khai',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The naive implementation — repeat each server <code>weight</code> times and walk the list — gives the exact same long-run ratio and a much worse short-run shape: <code>B1 B1 B1 B2 B2 B3</code> sends three requests in a row to one machine, which is precisely the burst you were trying to avoid by weighting at all. The smooth algorithm is three lines and keeps both properties, and because the accumulators are integers the period is exactly the sum of the weights, so the sequence repeats forever with no drift. Two practical consequences: a weight change takes effect immediately without any warm-up, and reading nine or twelve requests off a graph is enough to verify the ratio when you have one worker — but only then, which is the next question.',
            'Cách cài đặt ngây thơ — lặp mỗi máy <code>weight</code> lần rồi duyệt danh sách — cho ra ĐÚNG cùng một tỉ lệ về dài hạn nhưng một hình dạng ngắn hạn tệ hơn hẳn: <code>B1 B1 B1 B2 B2 B3</code> bắn ba request liên tiếp vào một máy, mà đó chính là cái cụm dồn mà bạn đặt trọng số để tránh. Thuật toán mượt gọn trong ba dòng và giữ được cả hai tính chất, và vì các bộ cộng dồn đều là số nguyên nên chu kỳ đúng bằng TỔNG các trọng số, chuỗi lặp lại mãi mãi mà không trôi. Hai hệ quả thực tế: đổi trọng số có hiệu lực ngay không cần khởi động ấm, và đọc chín hay mười hai request trên đồ thị là đủ để kiểm tỉ lệ khi bạn có MỘT worker — nhưng chỉ khi đó thôi, và đó là câu hỏi kế tiếp.',
          ),
        }),

        // q11 · đáp án 3
        mcq({
          prompt: B(
            'The same three equal-weight backends, the same nine sequential requests, measured twice on nginx/1.27.5. Only one line of the configuration changed.' + code(
              'worker_processes 1;      ->  B1 B2 B3  B1 B2 B3  B1 B2 B3\n' +
              'worker_processes auto;   ->  B1 B2 B3  B3 B2 B1  B3 B2 B1\n' +
              '   (auto = 3 worker tren may nay)\n' +
              '\n' +
              '# ca hai deu ra 3 lan moi may tren 9 request',
            ) + 'What should you conclude?',
            'Vẫn ba backend cùng trọng số, vẫn chín request tuần tự, đo hai lượt trên nginx/1.27.5. Chỉ đúng một dòng cấu hình thay đổi.' + code(
              'worker_processes 1;      ->  B1 B2 B3  B1 B2 B3  B1 B2 B3\n' +
              'worker_processes auto;   ->  B1 B2 B3  B3 B2 B1  B3 B2 B1\n' +
              '   (auto = 3 worker tren may nay)\n' +
              '\n' +
              '# ca hai deu ra 3 lan moi may tren 9 request',
            ) + 'Bạn nên kết luận gì?',
          ),
          options: [
            B(
              'The second run hit a bug: with equal weights the sequence must be strictly cyclic, so that instance needs a reload to rebuild its peer list',
              'Lượt thứ hai dính lỗi: với trọng số bằng nhau thì chuỗi bắt buộc phải tuần hoàn chặt chẽ, nên phiên bản đó cần một cú reload để dựng lại danh sách máy',
            ),
            B(
              'More workers means more concurrency, so the second run overlapped requests; making the client strictly sequential would restore the clean cycle',
              'Nhiều worker hơn nghĩa là nhiều việc chạy song song hơn, nên lượt thứ hai đã cho các request chồng lên nhau; ép client chạy thật tuần tự là chuỗi sạch quay lại',
            ),
            B(
              'The order is decided by the kernel\'s connection queue, so the balancing method has no effect at all once there is more than one worker',
              'Thứ tự do hàng đợi kết nối của nhân quyết định, nên phương pháp cân bằng hoàn toàn mất tác dụng một khi có nhiều hơn một worker',
            ),
            B(
              'The round-robin state lives in the WORKER, not in the master: each worker keeps its own accumulators and the kernel gives a connection to whichever worker is free, so the SEQUENCE looks scrambled while the long-run totals still converge on the weights',
              'Trạng thái vòng tròn nằm trong WORKER chứ không nằm ở master: mỗi worker giữ bộ cộng dồn của riêng nó và nhân đưa kết nối cho worker nào đang rảnh, nên CHUỖI trông như bị xáo trong khi tổng dài hạn vẫn hội tụ về đúng trọng số',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Nothing is shared between workers unless it lives in a shared memory zone, and the upstream round-robin counters are not one of those — <code>limit_req</code> and <code>proxy_cache</code> have <code>zone=</code> parameters for exactly this reason, and the load balancer has none. So on a production box with eight workers the observed order is a shuffle of eight independent cycles, and reading nine requests off it proves nothing at all. Two working habits follow. When you MEASURE a balancing method, set <code>worker_processes 1</code> so the sequence is meaningful. When you VERIFY a live system, count totals per backend over thousands of requests and compare ratios, never sequences. The same reasoning explains why a per-worker rate limit is really N times the number you configured.',
            'Không có gì được chia sẻ giữa các worker trừ phi nó sống trong một vùng nhớ chung, và bộ đếm vòng tròn của upstream KHÔNG phải một trong số đó — <code>limit_req</code> và <code>proxy_cache</code> có tham số <code>zone=</code> chính vì lý do này, còn bộ cân bằng tải thì không có. Nên trên một máy production tám worker thì thứ tự quan sát được là một phép xáo trộn của tám chu kỳ độc lập, và đọc chín request từ đó chẳng chứng minh được gì. Hai thói quen làm việc rút ra từ đây. Khi ĐO một phương pháp cân bằng, hãy đặt <code>worker_processes 1</code> để cái chuỗi có ý nghĩa. Khi KIỂM CHỨNG một hệ thống đang chạy, hãy đếm TỔNG theo từng backend trên hàng nghìn request rồi so tỉ lệ, đừng bao giờ so chuỗi. Cũng chính lập luận đó giải thích vì sao một giới hạn tần suất theo worker thật ra là N lần con số bạn đã đặt.',
          ),
        }),

        // q12 · đáp án 0
        mcq({
          prompt: B(
            'A read timeout of two seconds in front of three backends, all healthy, against an endpoint that genuinely takes five seconds. Measured on nginx/1.27.5.' + code(
              'location /cham/ { proxy_read_timeout 2s; proxy_pass http://rr/; }   # rr co 3 may\n' +
              '\n' +
              "$ curl -o /dev/null -w '%{http_code} %{time_total}\\n' http://edge/cham/\n" +
              '504 6.054\n' +
              '\n' +
              '[error] upstream timed out (110) while reading response header, upstream: "http://10.0.0.1:9201/"\n' +
              '[error] upstream timed out (110) while reading response header, upstream: "http://10.0.0.1:9202/"\n' +
              '[error] upstream timed out (110) while reading response header, upstream: "http://10.0.0.1:9203/"',
            ) + 'Explain the six seconds.',
            'Một trần chờ đọc hai giây đặt trước ba backend đều khoẻ mạnh, gọi vào một endpoint thật sự tốn năm giây. Đo trên nginx/1.27.5.' + code(
              'location /cham/ { proxy_read_timeout 2s; proxy_pass http://rr/; }   # rr co 3 may\n' +
              '\n' +
              "$ curl -o /dev/null -w '%{http_code} %{time_total}\\n' http://edge/cham/\n" +
              '504 6.054\n' +
              '\n' +
              '[error] upstream timed out (110) while reading response header, upstream: "http://10.0.0.1:9201/"\n' +
              '[error] upstream timed out (110) while reading response header, upstream: "http://10.0.0.1:9202/"\n' +
              '[error] upstream timed out (110) while reading response header, upstream: "http://10.0.0.1:9203/"',
            ) + 'Hãy giải thích sáu giây đó.',
          ),
          options: [
            B(
              '<code>proxy_read_timeout</code> caps ONE attempt, and <code>proxy_next_upstream</code> includes <code>timeout</code> by default, so a genuinely slow endpoint is retried against EVERY peer and the client waits N times the timeout — while the same expensive request is now running on all three backends at once',
              '<code>proxy_read_timeout</code> là trần cho MỘT lượt thử, mà <code>proxy_next_upstream</code> mặc định có kèm <code>timeout</code>, nên một endpoint chậm thật sẽ bị thử lại trên MỌI máy và client chờ N lần cái trần — trong khi đúng cái request đắt đỏ ấy giờ đang chạy trên cả ba backend cùng lúc',
            ),
            B(
              'The timeout is measured from the moment the response BODY starts, so the two seconds only began after the backend had already spent four seconds thinking',
              'Trần chờ được tính từ lúc THÂN phản hồi bắt đầu chảy, nên hai giây kia chỉ khởi động sau khi backend đã tiêu bốn giây để nghĩ',
            ),
            B(
              'Three error-log lines mean three separate client requests; curl retried on its own after each timeout and only reported the total of all three',
              'Ba dòng error log nghĩa là ba request riêng biệt của client; curl tự thử lại sau mỗi lần hết giờ và chỉ báo cáo tổng của cả ba',
            ),
            B(
              '<code>proxy_read_timeout</code> is a lower bound rather than a cap: Nginx waits at least that long and then keeps waiting until the connection is closed by the peer',
              '<code>proxy_read_timeout</code> là cận DƯỚI chứ không phải trần: Nginx chờ ít nhất chừng ấy rồi tiếp tục chờ cho tới khi máy bên kia đóng kết nối',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Retrying is the right default for a peer that is DOWN and the wrong one for a request that is SLOW, and Nginx cannot tell the two apart from a timeout alone. So the number you wrote as "the longest a user will wait" is silently multiplied by the size of your upstream group, and the load on the backends is multiplied by the same factor at exactly the moment they are already struggling — the classic way a slow endpoint takes a whole fleet down. Two directives bound it: <code>proxy_next_upstream_tries 2;</code> caps the attempts and <code>proxy_next_upstream_timeout 3s;</code> caps the total wall time across all of them. Many teams also drop <code>timeout</code> from <code>proxy_next_upstream</code> entirely, keeping retries for <code>error</code> — a refused connection — where the request provably never ran.',
            'Thử lại là mặc định ĐÚNG với một máy đã CHẾT và là mặc định SAI với một request CHẬM, mà Nginx thì không phân biệt được hai thứ đó nếu chỉ nhìn vào một cú hết giờ. Nên con số bạn viết ra với ý "người dùng chờ lâu nhất bằng này" bị âm thầm nhân lên bằng số máy trong nhóm upstream, và tải trên các backend cũng bị nhân lên đúng bấy nhiêu lần vào đúng lúc chúng đang chật vật — đó là cách kinh điển để một endpoint chậm kéo sập cả một đội máy. Hai chỉ thị chặn nó lại: <code>proxy_next_upstream_tries 2;</code> chặn số lượt, còn <code>proxy_next_upstream_timeout 3s;</code> chặn tổng thời gian thật trên toàn bộ các lượt. Nhiều đội còn bỏ hẳn <code>timeout</code> khỏi <code>proxy_next_upstream</code>, chỉ giữ thử lại cho <code>error</code> — tức một kết nối bị từ chối — nơi có bằng chứng rằng request chưa từng chạy.',
          ),
        }),

        // q13 · đáp án 1
        mcq({
          prompt: B(
            'Two 502s from the same edge server on the same afternoon, taken from the access log. Measured on nginx/1.27.5.' + code(
              'A)  502  us=502  ua=10.0.0.1:9298  urt=0.000  rt=0.000\n' +
              'B)  502  us=502  ua=hai           urt=0.000  rt=0.000\n' +
              '\n' +
              '# "hai" la TEN cua khoi upstream, khong phai mot dia chi',
            ) + 'What is the difference between them?',
            'Hai mã 502 từ cùng một máy chủ biên trong cùng một buổi chiều, lấy từ access log. Đo trên nginx/1.27.5.' + code(
              'A)  502  us=502  ua=10.0.0.1:9298  urt=0.000  rt=0.000\n' +
              'B)  502  us=502  ua=hai           urt=0.000  rt=0.000\n' +
              '\n' +
              '# "hai" la TEN cua khoi upstream, khong phai mot dia chi',
            ) + 'Hai dòng đó khác nhau ở chỗ nào?',
          ),
          options: [
            B(
              'Row B was logged before name resolution finished, so it is the same failure as A recorded a few milliseconds earlier in the request',
              'Dòng B được ghi trước khi phân giải tên xong, nên nó là ĐÚNG cú hỏng của A chỉ ghi lại sớm hơn vài mili giây trong cùng request',
            ),
            B(
              'An <code>address:port</code> means Nginx did try that peer and the connection failed; the bare NAME of the upstream block means every peer was ALREADY marked down by earlier failures, so Nginx answered 502 without contacting anything — the same status, the opposite cause',
              'Một giá trị <code>địa chỉ:cổng</code> nghĩa là Nginx CÓ thử máy đó và kết nối hỏng; còn TÊN trơ của khối upstream nghĩa là mọi máy ĐÃ bị đánh dấu chết từ những cú hỏng trước, nên Nginx trả 502 mà không liên hệ với ai cả — cùng một mã, nguyên nhân ngược nhau',
            ),
            B(
              'Row B is a 502 generated by the backend itself and passed through unchanged, which is why no address appears — the application returned the status, not Nginx',
              'Dòng B là một mã 502 do chính backend sinh ra rồi được chuyển tiếp nguyên vẹn, và vì thế không có địa chỉ nào hiện ra — ứng dụng trả mã đó chứ không phải Nginx',
            ),
            B(
              'Both rows are the same event: <code>$upstream_addr</code> falls back to the group name whenever the peer is on the same host as Nginx, which is the case here',
              'Hai dòng là cùng một sự kiện: <code>$upstream_addr</code> lùi về tên nhóm mỗi khi máy đích nằm chung máy chủ với Nginx, đúng như trường hợp ở đây',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Grouping an incident by status code merges two different outages. Row A is "the backend refused a connection" — one process died, the retry will find a healthy peer, and if the group still has one the client never even sees this. Row B is "there is nothing left to try": every peer has hit <code>max_fails</code> inside <code>fail_timeout</code>, so Nginx short-circuits and the error log says <code>no live upstreams</code> rather than <code>connect() failed</code>. Both cost 0.000 seconds, which is itself the tell — a 502 that is instant was never a network problem. The field to alert on is <code>$upstream_addr</code>, not <code>$status</code>: an alert that fires when it stops containing a colon catches the moment your whole pool went dark, which is the one worth waking up for.',
            'Gộp sự cố theo mã trạng thái là trộn hai cú sập khác nhau làm một. Dòng A là "backend từ chối một kết nối" — một tiến trình chết, cú thử lại sẽ tìm ra một máy khoẻ, và nếu nhóm còn máy khoẻ thì client thậm chí không thấy gì. Dòng B là "chẳng còn gì để thử nữa": mọi máy đều đã chạm <code>max_fails</code> trong khoảng <code>fail_timeout</code>, nên Nginx đoản mạch luôn và error log ghi <code>no live upstreams</code> chứ không phải <code>connect() failed</code>. Cả hai đều tốn 0,000 giây, mà chính điều đó đã là dấu hiệu — một mã 502 tức khắc thì chưa bao giờ là chuyện của mạng. Trường đáng đặt cảnh báo là <code>$upstream_addr</code> chứ không phải <code>$status</code>: một cảnh báo nổ khi nó thôi chứa dấu hai chấm sẽ bắt đúng khoảnh khắc cả hồ máy của bạn tắt ngóm, và đó mới là thứ đáng để bị đánh thức lúc nửa đêm.',
          ),
        }),

        // q14 · đáp án 2
        mcq({
          prompt: B(
            'One access-log line for ONE request, measured on nginx/1.27.5.' + code(
              'GET /api/cham?slp=5000\n' +
              '  status=504\n' +
              '  upstream_status="504, 504"\n' +
              '  upstream_addr="10.0.0.1:9201, 10.0.0.1:9202"\n' +
              '  upstream_response_time="2.007, 2.010"\n' +
              '  request_time=4.017',
            ) + 'What do the comma-separated values mean for a dashboard?',
            'Một dòng access log cho MỘT request, đo trên nginx/1.27.5.' + code(
              'GET /api/cham?slp=5000\n' +
              '  status=504\n' +
              '  upstream_status="504, 504"\n' +
              '  upstream_addr="10.0.0.1:9201, 10.0.0.1:9202"\n' +
              '  upstream_response_time="2.007, 2.010"\n' +
              '  request_time=4.017',
            ) + 'Những giá trị ngăn nhau bằng dấu phẩy ấy có nghĩa gì với một bảng số liệu?',
          ),
          options: [
            B(
              'They are the values from the two workers that split the request between them and handled it in parallel, so a dashboard should average the entries rather than sum them',
              'Chúng là giá trị từ hai worker chia nhau request đó rồi xử lý song song, nên một bảng số liệu nên lấy TRUNG BÌNH các mục chứ đừng cộng lại',
            ),
            B(
              'The list traces the response as it passed through two proxy hops on the way back, so only the last entry describes your own backend and every earlier one can safely be dropped',
              'Danh sách này lần theo phản hồi khi nó đi qua hai chặng proxy trên đường về, nên chỉ mục CUỐI mới mô tả backend của chính bạn còn mọi mục trước đó thì bỏ đi được',
            ),
            B(
              'One entry per upstream ATTEMPT, in order; <code>$request_time</code> is the whole client-visible time and is roughly their sum, so a dashboard that parses <code>$upstream_response_time</code> as a number reads 2.0 or NaN and under-reports the real four-second wait by half',
              'Mỗi mục là MỘT LƯỢT THỬ lên upstream, theo thứ tự; <code>$request_time</code> là toàn bộ thời gian client nhìn thấy và xấp xỉ bằng tổng của chúng, nên một bảng số liệu đọc <code>$upstream_response_time</code> như một con số sẽ ra 2,0 hoặc NaN và báo thiếu MỘT NỬA cái bốn giây chờ thật',
            ),
            B(
              'They record the same single attempt measured at two different phases of it — connecting and then reading the header — which is exactly why the two numbers come out nearly equal',
              'Chúng ghi lại cùng MỘT lượt thử nhưng đo ở hai pha khác nhau của nó — lúc kết nối rồi lúc đọc header — và chính vì thế hai con số mới ra gần bằng nhau',
            ),
          ],
          correct: 2,
          explanation: EX(
            'These four variables are LISTS whenever a request touched more than one upstream, and every ingestion pipeline that treats them as scalars breaks quietly on exactly the requests you most want to see. Three habits fix it. Log them and parse them as lists, summing <code>$upstream_response_time</code> and keeping the count as its own metric. Alert on <code>$request_time</code>, because it is the only number the user actually experienced. And read the LENGTH of <code>$upstream_addr</code> as a retry counter — the day it goes from one to two on a large share of traffic is the day a peer died, and it shows up there long before it shows up in the error rate, because the retries are still succeeding.',
            'Bốn biến này là DANH SÁCH mỗi khi một request chạm tới nhiều hơn một upstream, và mọi đường ống thu thập coi chúng là số vô hướng đều vỡ trong im lặng đúng vào những request bạn cần nhìn nhất. Ba thói quen chữa được. Hãy ghi và phân tích chúng như danh sách, cộng dồn <code>$upstream_response_time</code> và giữ số phần tử thành một số đo riêng. Hãy đặt cảnh báo trên <code>$request_time</code>, vì đó là con số duy nhất người dùng thật sự trải qua. Và hãy đọc ĐỘ DÀI của <code>$upstream_addr</code> như một bộ đếm thử lại — cái ngày nó nhảy từ một lên hai trên một phần lớn lưu lượng chính là ngày một máy đã chết, và nó hiện ra ở đó rất lâu trước khi hiện ra ở tỉ lệ lỗi, bởi vì mấy cú thử lại vẫn còn đang thành công.',
          ),
        }),

        // q15 · đáp án 3
        mcq({
          prompt: B(
            'Someone benchmarks <code>least_conn</code> and reports that it does nothing. Measured on nginx/1.27.5 with <code>worker_processes 1</code>, one request at a time, against three backends that answer instantly.' + code(
              'upstream lc { least_conn; server b1; server b2; server b3; }\n' +
              '\n' +
              '9 request tuan tu  ->  B1 B2 B3  B1 B2 B3  B1 B2 B3\n' +
              '# giong het ket qua cua round robin thuong',
            ) + 'What does the measurement actually show?',
            'Có người đo <code>least_conn</code> rồi báo rằng nó chẳng làm gì cả. Đo trên nginx/1.27.5 với <code>worker_processes 1</code>, mỗi lần một request, trên ba backend trả lời tức khắc.' + code(
              'upstream lc { least_conn; server b1; server b2; server b3; }\n' +
              '\n' +
              '9 request tuan tu  ->  B1 B2 B3  B1 B2 B3  B1 B2 B3\n' +
              '# giong het ket qua cua round robin thuong',
            ) + 'Phép đo này thật ra cho thấy điều gì?',
          ),
          options: [
            B(
              '<code>least_conn</code> needs <code>zone=</code> to work at all, so without one the directive is ignored and the group silently falls back to round robin',
              '<code>least_conn</code> cần <code>zone=</code> mới chạy được, nên không có nó thì chỉ thị bị bỏ qua và cả nhóm âm thầm lùi về vòng tròn thường',
            ),
            B(
              'It shows <code>least_conn</code> working: it counts total requests rather than active connections, so with equal totals it always picks the next server in order',
              'Nó cho thấy <code>least_conn</code> đang chạy: nó đếm TỔNG số request chứ không đếm kết nối đang mở, nên khi tổng bằng nhau thì nó luôn chọn máy kế tiếp theo thứ tự',
            ),
            B(
              'It shows that three backends are too few for the method to differ; with five or more the sequence would stop being cyclic even under a sequential client',
              'Nó cho thấy ba backend là quá ít để phương pháp này khác đi; với năm máy trở lên thì chuỗi sẽ thôi tuần hoàn ngay cả với một client tuần tự',
            ),
            B(
              'It shows nothing about <code>least_conn</code>: with one request in flight at a time and instant responses, every peer always has ZERO active connections, so the method degenerates into round robin. It can only differ when responses take different amounts of time AND requests overlap',
              'Nó chẳng cho thấy gì về <code>least_conn</code> cả: với mỗi lúc đúng một request đang bay và phản hồi tức khắc, mọi máy luôn có KHÔNG kết nối nào đang mở, nên phương pháp này thoái hoá thành vòng tròn. Nó chỉ khác đi khi các phản hồi tốn thời gian khác nhau VÀ các request chồng lên nhau',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A benchmark that cannot produce the condition a feature exists for will always report that the feature does nothing, and this is the cleanest example of it in the whole course. <code>least_conn</code> exists for backends whose work is uneven — a report endpoint next to a health check, an image resize next to a cached lookup — because plain round robin will keep handing new work to a machine that is already holding four long requests. To measure it you need concurrency and a mix of durations: fire fifty parallel requests where one path sleeps a second and the rest are instant, and count how many slow ones each backend accumulates. Under that load round robin gives every peer the same number of slow requests and <code>least_conn</code> does not, which is the whole point.',
            'Một phép đo không dựng ra nổi cái điều kiện mà tính năng ấy sinh ra để giải quyết thì bao giờ cũng báo rằng tính năng đó chẳng làm gì, và đây là ví dụ sạch sẽ nhất của chuyện đó trong cả khoá học. <code>least_conn</code> sinh ra cho những backend có khối lượng việc không đều — một endpoint xuất báo cáo nằm cạnh một cú kiểm tra sức khoẻ, một lượt đổi cỡ ảnh nằm cạnh một lượt tra bộ đệm — vì vòng tròn thường sẽ cứ dúi việc mới vào một máy vốn đang ôm bốn request dài. Muốn đo nó thì bạn cần ĐỒNG THỜI và cần trộn nhiều độ dài: bắn năm mươi request song song trong đó một đường ngủ một giây còn lại thì tức khắc, rồi đếm xem mỗi backend gom về bao nhiêu request chậm. Dưới cái tải đó, vòng tròn thường phát cho mọi máy cùng một số request chậm còn <code>least_conn</code> thì không, và đó chính là toàn bộ ý nghĩa của nó.',
          ),
        }),

        // q16 · đáp án 0
        mcq({
          prompt: B(
            'One dead peer in a two-peer group, six requests, measured on nginx/1.27.5.' + code(
              'upstream chet {\n' +
              '  server 10.0.0.1:9298 max_fails=1 fail_timeout=10s;   # khong co gi nghe o day\n' +
              '  server 10.0.0.1:9201;                                 # B1, khoe\n' +
              '}\n' +
              '\n' +
              'access log:  200 200 200 200 200 200      (tat ca tu B1)\n' +
              'error log:   [error] connect() failed (111: Connection refused) ...\n' +
              '             upstream: "http://10.0.0.1:9298/"      <- DUNG MOT dong',
            ) + 'What does this pair of logs mean for monitoring?',
            'Một máy chết trong nhóm hai máy, sáu request, đo trên nginx/1.27.5.' + code(
              'upstream chet {\n' +
              '  server 10.0.0.1:9298 max_fails=1 fail_timeout=10s;   # khong co gi nghe o day\n' +
              '  server 10.0.0.1:9201;                                 # B1, khoe\n' +
              '}\n' +
              '\n' +
              'access log:  200 200 200 200 200 200      (tat ca tu B1)\n' +
              'error log:   [error] connect() failed (111: Connection refused) ...\n' +
              '             upstream: "http://10.0.0.1:9298/"      <- DUNG MOT dong',
            ) + 'Cặp log này có nghĩa gì với việc giám sát?',
          ),
          options: [
            B(
              'The first request paid a failed connect and was retried on the live peer, then the dead one was marked down for <code>fail_timeout</code> so the next five never touched it — which is why the access log is six clean 200s and the ERROR log holds the only evidence that half the fleet is gone',
              'Request đầu tiên trả giá bằng một cú kết nối hỏng rồi được thử lại trên máy còn sống, sau đó máy chết bị đánh dấu ngừng trong khoảng <code>fail_timeout</code> nên năm request sau không hề chạm tới nó — và đó là lý do access log là sáu mã 200 sạch bong còn ERROR log giữ bằng chứng DUY NHẤT rằng một nửa đội máy đã mất',
            ),
            B(
              'Nginx health-checks peers in the background, so the dead one was already excluded before the first request and nothing was ever retried',
              'Nginx tự kiểm tra sức khoẻ các máy ở nền, nên máy chết đã bị loại ra từ trước request đầu tiên và chẳng có gì bị thử lại cả',
            ),
            B(
              'Six requests over two peers should have produced three error-log lines; a single line means five of the six requests were served from a cache rather than from B1',
              'Sáu request qua hai máy lẽ ra phải sinh ra ba dòng error log; chỉ một dòng nghĩa là năm trên sáu request được phục vụ từ một bộ đệm chứ không phải từ B1',
            ),
            B(
              '<code>max_fails=1</code> removes the peer permanently, so the configuration must be reloaded before that address can ever be used again',
              '<code>max_fails=1</code> gỡ máy đó ra vĩnh viễn, nên phải nạp lại cấu hình thì địa chỉ ấy mới có thể được dùng lại',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the failure mode that makes redundancy dangerous rather than the one that makes it useful: the system is doing exactly what you paid it to do, and it is doing it silently. Availability graphs built on <code>$status</code> stay at 100% while capacity is halved, and the first thing anyone notices is a latency shift or the next machine falling over. Three things make it visible. Alert on error-log lines matching <code>connect() failed</code> and <code>no live upstreams</code>, because that is where the fact lives. Log <code>$upstream_addr</code> and alert when a backend stops appearing at all — absence is the signal. And remember there is no background health check here: open-source Nginx only discovers a peer is dead by failing a real user request on it, so <code>max_fails=1 fail_timeout=10s</code> means one unlucky user every ten seconds pays the connect timeout.',
            'Đây là kiểu hỏng khiến dự phòng trở nên NGUY HIỂM chứ không phải kiểu khiến nó hữu ích: hệ thống đang làm đúng cái việc bạn trả tiền cho nó làm, và nó làm trong im lặng. Đồ thị khả dụng dựng trên <code>$status</code> vẫn nằm ở 100% trong khi năng lực đã giảm một nửa, và thứ đầu tiên ai đó nhận ra là độ trễ dịch đi, hoặc là cái máy còn lại cũng ngã. Ba thứ làm cho nó hiện ra. Hãy đặt cảnh báo trên các dòng error log khớp <code>connect() failed</code> và <code>no live upstreams</code>, vì sự thật nằm ở đó. Hãy ghi <code>$upstream_addr</code> và cảnh báo khi một backend THÔI xuất hiện — sự VẮNG MẶT chính là tín hiệu. Và nhớ rằng ở đây không có phép kiểm sức khoẻ chạy nền nào cả: Nginx bản mở chỉ phát hiện một máy đã chết bằng cách làm hỏng một request THẬT của người dùng trên nó, nên <code>max_fails=1 fail_timeout=10s</code> nghĩa là cứ mười giây lại có một người dùng xui xẻo trả giá bằng cả cái trần chờ kết nối.',
          ),
        }),

        /* ── Chương 10 — log và quan sát (8 câu) ────────────────────────── */

        // q17 · đáp án 2
        mcq({
          prompt: B(
            'ONE request written by TWO <code>access_log</code> directives declared at the same level. Measured on nginx/1.27.5.' + code(
              '192.168.65.1 - - [10/Sep/2026:11:32:25 +0000] "GET /api/mot?x=1 HTTP/1.1" 200 19 "-" "curl/8.7.1"\n' +
              '\n' +
              'ct=200 rt=0.003 urt=0.002 ucs=- ua=10.0.0.1:9201 host=vidu.test uri=/api/mot bs=175 bbs=19',
            ) + 'What do the two lines tell you together?',
            'MỘT request được ghi bởi HAI chỉ thị <code>access_log</code> khai ở cùng một cấp. Đo trên nginx/1.27.5.' + code(
              '192.168.65.1 - - [10/Sep/2026:11:32:25 +0000] "GET /api/mot?x=1 HTTP/1.1" 200 19 "-" "curl/8.7.1"\n' +
              '\n' +
              'ct=200 rt=0.003 urt=0.002 ucs=- ua=10.0.0.1:9201 host=vidu.test uri=/api/mot bs=175 bbs=19',
            ) + 'Hai dòng ấy hợp lại nói cho bạn biết điều gì?',
          ),
          options: [
            B(
              'Two <code>access_log</code> directives at one level replace each other like <code>add_header</code> does, so the first line must have come from a parent block rather than from this one',
              'Hai chỉ thị <code>access_log</code> ở cùng một cấp thì thay thế lẫn nhau giống như <code>add_header</code>, nên dòng đầu hẳn phải tới từ một khối cha chứ không phải từ khối này',
            ),
            B(
              'They are two different requests: the second line is the retry that the first line\'s <code>$request_time</code> of 0.003 made necessary',
              'Đó là hai request khác nhau: dòng thứ hai là cú thử lại mà <code>$request_time</code> 0,003 của dòng đầu đã buộc phải có',
            ),
            B(
              'Both describe the SAME request, and the default <code>combined</code> format has no request time, no upstream time, no upstream address, no cache status and no <code>$host</code> — so on a multi-site proxy it cannot answer "which site", "who served it" or "where did the time go"',
              'Cả hai đều mô tả CÙNG một request, và định dạng <code>combined</code> mặc định không có thời gian request, không có thời gian upstream, không có địa chỉ upstream, không có trạng thái bộ đệm và không có <code>$host</code> — nên trên một proxy phục vụ nhiều site nó không trả lời nổi "site nào", "ai phục vụ" hay "thời gian đi đâu mất"',
            ),
            B(
              'The default format is a strict subset of the custom one, so keeping both is pure duplication and the first can always be deleted without losing anything',
              'Định dạng mặc định là một tập con chặt của định dạng tự soạn, nên giữ cả hai là trùng lặp thuần tuý và luôn có thể xoá cái đầu mà không mất gì',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The default format was designed for a web server serving files from disk in 1995, and every field a reverse proxy needs is missing from it. <code>$host</code> is the worst omission: on a box with forty server blocks the log cannot tell you which site a request belonged to, so you cannot even split the traffic before you start debugging. Then <code>$request_time</code> and <code>$upstream_response_time</code> together give you the one number that matters — how much of the wait was the backend and how much was you. And <code>$upstream_cache_status</code> is what turns "the cache is working" from an opinion into a ratio. Note the mechanism the transcript also demonstrates: two <code>access_log</code> directives at the same level BOTH write, so you can add a rich format beside the default one without breaking any tool that already parses the old file.',
            'Định dạng mặc định được thiết kế cho một máy chủ web phục vụ tệp từ đĩa hồi 1995, và mọi trường mà một reverse proxy cần đều VẮNG mặt trong đó. <code>$host</code> là chỗ thiếu tệ nhất: trên một máy có bốn mươi khối server thì log không nói được request đó thuộc site nào, nên bạn thậm chí không tách nổi lưu lượng ra trước khi bắt đầu gỡ lỗi. Rồi <code>$request_time</code> và <code>$upstream_response_time</code> đi cùng nhau cho bạn con số quan trọng nhất — bao nhiêu phần của cái chờ là do backend và bao nhiêu là do chính bạn. Còn <code>$upstream_cache_status</code> là thứ biến "bộ đệm đang chạy tốt" từ một ý kiến thành một TỈ LỆ. Cũng để ý cái cơ chế mà transcript này chứng minh luôn: hai chỉ thị <code>access_log</code> ở cùng một cấp thì CẢ HAI cùng ghi, nên bạn thêm được một định dạng giàu thông tin bên cạnh cái mặc định mà không làm hỏng công cụ nào đang phân tích tệp cũ.',
          ),
        }),

        // q18 · đáp án 1
        mcq({
          prompt: B(
            'Two requests, two byte counters, measured on nginx/1.27.5.' + code(
              '/tinh/co.txt      (tep 6 byte tren dia)   bbs=6     bs=241\n' +
              '/tinh/thieu.txt   (404 mac dinh)          bbs=153   bs=308\n' +
              '\n' +
              '# bbs = $body_bytes_sent    bs = $bytes_sent',
            ) + 'What is the gap, and when does it matter?',
            'Hai request, hai bộ đếm byte, đo trên nginx/1.27.5.' + code(
              '/tinh/co.txt      (tep 6 byte tren dia)   bbs=6     bs=241\n' +
              '/tinh/thieu.txt   (404 mac dinh)          bbs=153   bs=308\n' +
              '\n' +
              '# bbs = $body_bytes_sent    bs = $bytes_sent',
            ) + 'Khoảng chênh ấy là gì, và khi nào nó mới đáng kể?',
          ),
          options: [
            B(
              'The gap is compression overhead: <code>$bytes_sent</code> counts the uncompressed size and <code>$body_bytes_sent</code> the compressed one, so it disappears when <code>gzip</code> is off',
              'Khoảng chênh là phần phụ trội của nén: <code>$bytes_sent</code> đếm cỡ chưa nén còn <code>$body_bytes_sent</code> đếm cỡ đã nén, nên nó biến mất khi tắt <code>gzip</code>',
            ),
            B(
              '<code>$body_bytes_sent</code> counts the body only while <code>$bytes_sent</code> includes the status line and every response header — about 235 bytes here — so a bandwidth or billing figure built on body bytes under-reports by that much PER REQUEST, which dominates when the objects are small, and an error page is not free either',
              '<code>$body_bytes_sent</code> chỉ đếm phần thân còn <code>$bytes_sent</code> tính cả dòng trạng thái và mọi header phản hồi — ở đây khoảng 235 byte — nên một con số băng thông hay hoá đơn dựng trên body bytes sẽ báo thiếu đúng chừng ấy MỖI REQUEST, và phần thiếu đó lấn át khi các đối tượng đều nhỏ, còn một trang lỗi thì cũng chẳng miễn phí',
            ),
            B(
              'The gap is the request Nginx received, not the response it sent, so it grows with the size of the client\'s headers and cookies rather than with the response',
              'Khoảng chênh là phần request mà Nginx nhận được chứ không phải phản hồi nó gửi đi, nên nó lớn lên theo cỡ header và cookie của client chứ không theo phản hồi',
            ),
            B(
              'Only the 404 row has a gap that matters; on a 200 the two counters are defined to be equal and the 241 above is a rounding artefact of the log writer',
              'Chỉ dòng 404 mới có khoảng chênh đáng kể; với mã 200 thì hai bộ đếm được định nghĩa là bằng nhau và con số 241 ở trên là hệ quả làm tròn của bộ ghi log',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Two hundred and thirty-five bytes sounds negligible until you notice what a modern site actually serves: tracking pixels, tiny JSON polls, 304 responses that carry no body at all and still cost a full header block. At that traffic mix the headers are the majority of your egress, and the number the finance team is looking at is the wrong one. There is a second reading in the 404 row: a default error page is 153 bytes of body plus headers, so a crawler hammering missing URLs costs real bandwidth and real worker time — which is one of the arguments for answering unknown hosts with <code>return 444;</code>, the code that closes the connection and sends nothing at all.',
            'Hai trăm ba mươi lăm byte nghe như không đáng gì cho tới khi bạn để ý xem một site hiện đại thật sự phục vụ những gì: điểm ảnh theo dõi, những cú hỏi JSON tí hon, những phản hồi 304 hoàn toàn không có thân mà vẫn tốn nguyên một khối header. Với cái trộn lưu lượng đó thì HEADER mới là phần lớn lưu lượng đi ra của bạn, và con số mà bộ phận tài chính đang nhìn là con số sai. Dòng 404 còn có một cách đọc thứ hai: một trang lỗi mặc định là 153 byte thân cộng với header, nên một con bọ cứ nện vào các URL không tồn tại sẽ ngốn băng thông thật và thời gian worker thật — đó là một trong những lý lẽ cho việc trả lời các host lạ bằng <code>return 444;</code>, cái mã đóng kết nối và không gửi gì cả.',
          ),
        }),

        // q19 · đáp án 3
        mcq({
          prompt: B(
            'One access-log line, measured on nginx/1.27.5 after the client was killed one second into a four-second request.' + code(
              'GET /api/cham?slp=4000\n' +
              '  status=499\n' +
              '  body_bytes_sent=0   bytes_sent=0\n' +
              '  upstream_status=-\n' +
              '  upstream_addr=10.0.0.1:9202\n' +
              '  upstream_response_time=1.006\n' +
              '  request_time=1.005',
            ) + 'Which reading uses every field?',
            'Một dòng access log, đo trên nginx/1.27.5 sau khi client bị giết ở giây thứ nhất của một request dài bốn giây.' + code(
              'GET /api/cham?slp=4000\n' +
              '  status=499\n' +
              '  body_bytes_sent=0   bytes_sent=0\n' +
              '  upstream_status=-\n' +
              '  upstream_addr=10.0.0.1:9202\n' +
              '  upstream_response_time=1.006\n' +
              '  request_time=1.005',
            ) + 'Cách đọc nào dùng được MỌI trường?',
          ),
          options: [
            B(
              '499 is a status the backend produced and Nginx passed through unchanged, and the two zero byte counters simply mean the application answered with an empty body — a 204-style response wearing an unusual number',
              '499 là một mã trạng thái do backend sinh ra rồi được Nginx chuyển tiếp nguyên vẹn, và hai bộ đếm byte bằng 0 chỉ đơn giản nghĩa là ứng dụng trả lời bằng một thân rỗng — một phản hồi kiểu 204 khoác con số lạ',
            ),
            B(
              '499 means Nginx itself gave up on the upstream halfway through, which is why <code>$upstream_status</code> was never filled in; the fix is a longer <code>proxy_read_timeout</code> and a matching <code>proxy_send_timeout</code> on the same block',
              '499 nghĩa là chính Nginx đã bỏ cuộc với upstream ở giữa chừng, và vì thế <code>$upstream_status</code> chưa bao giờ được điền; cách sửa là nới <code>proxy_read_timeout</code> cùng với <code>proxy_send_timeout</code> tương ứng trên cùng khối đó',
            ),
            B(
              'The zero <code>$bytes_sent</code> proves the client never completed a connection at all, so the line records a port scan or a health probe that opened a socket and left, rather than a real user waiting for anything',
              '<code>$bytes_sent</code> bằng 0 chứng minh client chưa từng hoàn tất một kết nối nào, nên dòng này ghi lại một cú quét cổng hay một phép dò sức khoẻ mở socket rồi đi, chứ không phải một người dùng thật đang chờ đợi gì cả',
            ),
            B(
              '499 is Nginx\'s own code for "the client closed the connection before an answer was ready": zero bytes went out, <code>$upstream_status</code> is empty because the backend never finished — but <code>$upstream_addr</code> IS filled in, so the backend was working and is probably still working on a request nobody will read',
              '499 là mã riêng của Nginx cho "client đóng kết nối trước khi có câu trả lời": không byte nào đi ra, <code>$upstream_status</code> rỗng vì backend chưa hề xong — nhưng <code>$upstream_addr</code> thì CÓ giá trị, nên backend đã và có lẽ vẫn đang làm việc cho một request mà không ai sẽ đọc',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A wave of 499s is never a bug in Nginx and almost never a bug in the backend either — it is users leaving. The number to act on is <code>$upstream_response_time</code>: 1.006 seconds is how long this person waited before deciding not to. So a rising 499 rate with a rising upstream time is a latency problem your error-rate dashboard cannot see, because the request never got a status to count. There is a second cost hiding in the same line. Nginx closed its side, but by default the backend is not told; the work carries on to completion and is thrown away, so a slow endpoint under an impatient client can be doing several times the work its request count suggests. That is what <code>proxy_ignore_client_abort off;</code> — the default — actually means, and why an expensive handler should check for a closed connection itself.',
            'Một đợt 499 chưa bao giờ là lỗi của Nginx và cũng gần như không bao giờ là lỗi của backend — đó là người dùng BỎ ĐI. Con số đáng hành động là <code>$upstream_response_time</code>: 1,006 giây là khoảng thời gian người này đã chờ trước khi quyết định thôi. Nên tỉ lệ 499 tăng cùng với thời gian upstream tăng là một vấn đề độ trễ mà bảng tỉ lệ lỗi của bạn không nhìn thấy, bởi vì cái request đó chưa bao giờ có một mã trạng thái để mà đếm. Trong chính dòng ấy còn ẩn một cái giá thứ hai. Nginx đã đóng phía của nó, nhưng mặc định backend KHÔNG được báo; công việc cứ chạy tới lúc xong rồi bị vứt đi, nên một endpoint chậm dưới tay một client thiếu kiên nhẫn có thể đang làm gấp mấy lần khối lượng mà số request của nó gợi ra. Đó chính là ý nghĩa thật của <code>proxy_ignore_client_abort off;</code> — giá trị mặc định — và là lý do một trình xử lý đắt đỏ nên tự kiểm xem kết nối còn sống không.',
          ),
        }),

        // q20 · đáp án 0
        mcq({
          prompt: B(
            'An upload endpoint behind <code>client_max_body_size 1k;</code>, measured on nginx/1.27.5 with a 5.000-byte body.' + code(
              'POST /up/big\n' +
              '  status=413\n' +
              '  body_bytes_sent=183   bytes_sent=348\n' +
              '  upstream_status=-\n' +
              '  upstream_addr=-\n' +
              '  upstream_response_time=-\n' +
              '  request_time=0.003',
            ) + 'The application team says nothing appears in their logs. Why?',
            'Một endpoint tải lên nằm sau <code>client_max_body_size 1k;</code>, đo trên nginx/1.27.5 với một thân 5.000 byte.' + code(
              'POST /up/big\n' +
              '  status=413\n' +
              '  body_bytes_sent=183   bytes_sent=348\n' +
              '  upstream_status=-\n' +
              '  upstream_addr=-\n' +
              '  upstream_response_time=-\n' +
              '  request_time=0.003',
            ) + 'Đội ứng dụng nói log của họ không có gì cả. Vì sao?',
          ),
          options: [
            B(
              'Both <code>$upstream_status</code> and <code>$upstream_addr</code> are empty, so Nginx rejected the request ITSELF and never opened an upstream connection — the application cannot log a request it was never given, which is why "the upload fails silently and there is nothing in the app log" is almost always <code>client_max_body_size</code>',
              'Cả <code>$upstream_status</code> lẫn <code>$upstream_addr</code> đều rỗng, nên CHÍNH Nginx đã từ chối request và chưa hề mở một kết nối upstream nào — ứng dụng không thể ghi log một request mà nó chưa từng được nhận, và đó là lý do "tải lên hỏng câm mà log ứng dụng trống trơn" gần như luôn luôn là <code>client_max_body_size</code>',
            ),
            B(
              'The application did receive the request and returned the 413 itself; Nginx merely copied the status onto its own response, and the empty upstream fields are a long-standing logging quirk that affects POST bodies larger than the proxy buffer',
              'Ứng dụng CÓ nhận được request và tự trả về mã 413; Nginx chỉ chép lại mã trạng thái sang phản hồi của chính nó, còn mấy trường upstream rỗng là một tật ghi log đã có từ lâu, ảnh hưởng tới thân POST lớn hơn bộ đệm proxy',
            ),
            B(
              'The request was rejected during the TLS handshake, before any HTTP layer existed at all, which is why neither an upstream nor a usable request line was recorded and the byte counters describe only the alert Nginx sent back',
              'Request bị từ chối ngay trong lúc bắt tay TLS, trước khi có tầng HTTP nào tồn tại, và vì thế không upstream lẫn một dòng request dùng được nào được ghi lại, còn hai bộ đếm byte chỉ mô tả cái cảnh báo mà Nginx gửi trả',
            ),
            B(
              'The empty upstream fields mean the response came out of the proxy cache, so this 413 is a stored copy of an earlier rejection being replayed rather than a fresh decision, and clearing the cache would let the upload through',
              'Mấy trường upstream rỗng nghĩa là phản hồi tới từ bộ đệm proxy, nên mã 413 này là một bản sao đã cất của cú từ chối trước đó đang được phát lại chứ không phải một quyết định mới, và xoá bộ đệm là lượt tải lên sẽ qua',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The pair of empty upstream fields is the single most useful signature in a proxy access log: it says the request stopped at Nginx. The same signature appears on a static file, a <code>return</code>, a redirect and a rate-limit rejection, and it immediately tells you which side of the boundary to debug. For 413 specifically there are two more things worth knowing. The limit is checked against <code>Content-Length</code> before the body is read, so the rejection can arrive while the client is still uploading — a browser that has not finished sending often shows a connection error instead of your error page. And <code>client_max_body_size</code> is inherited and overridable per location, so the fix is one line in the upload block rather than a larger global limit that also lets every other endpoint be flooded.',
            'Cặp trường upstream cùng rỗng là dấu vân tay hữu ích nhất trong một access log của proxy: nó nói rằng request đã DỪNG ở Nginx. Cùng dấu vân tay đó xuất hiện với một tệp tĩnh, một lệnh <code>return</code>, một cú chuyển hướng và một cú từ chối vì giới hạn tần suất, và nó cho bạn biết ngay phải gỡ lỗi ở phía nào của ranh giới. Riêng với 413 thì còn hai điều đáng biết. Giới hạn được kiểm với <code>Content-Length</code> TRƯỚC khi thân được đọc, nên cú từ chối có thể tới trong lúc client vẫn đang tải lên — một trình duyệt chưa gửi xong thường hiện lỗi kết nối chứ không hiện trang lỗi của bạn. Và <code>client_max_body_size</code> thì thừa hưởng được và ghi đè được theo từng location, nên cách sửa là MỘT dòng trong khối tải lên chứ không phải nới giới hạn toàn cục để rồi mọi endpoint khác cũng bị dội bom theo.',
          ),
        }),

        // q21 · đáp án 1
        mcq({
          prompt: B(
            'The same URL requested twice through a caching location, measured on nginx/1.27.5.' + code(
              'lan 1:  200  us=200  ua=10.0.0.1:9201  urt=0.005  rt=0.005  ucs=MISS\n' +
              'lan 2:  200  us=-    ua=-              urt=-      rt=0.000  ucs=HIT',
            ) + 'A team graphs the p95 of <code>$upstream_response_time</code>. What is wrong with that graph?',
            'Cùng một URL gọi hai lần qua một location có bộ đệm, đo trên nginx/1.27.5.' + code(
              'lan 1:  200  us=200  ua=10.0.0.1:9201  urt=0.005  rt=0.005  ucs=MISS\n' +
              'lan 2:  200  us=-    ua=-              urt=-      rt=0.000  ucs=HIT',
            ) + 'Một đội vẽ đồ thị p95 của <code>$upstream_response_time</code>. Đồ thị ấy sai ở đâu?',
          ),
          options: [
            B(
              'Nothing is wrong: a HIT is logged as 0.000, which correctly pulls the p95 down in proportion to the hit ratio',
              'Chẳng sai gì cả: một cú HIT được ghi là 0,000 và điều đó kéo p95 xuống đúng theo tỉ lệ trúng đệm',
            ),
            B(
              'On a HIT nothing upstream is contacted so the field is EMPTY, not zero, and empty values are dropped — the graph therefore describes only the MISSES, so improving the hit ratio makes it look WORSE while users get faster',
              'Với một cú HIT thì không có upstream nào được liên hệ nên trường đó RỖNG chứ không phải bằng 0, mà giá trị rỗng thì bị loại bỏ — vì thế đồ thị chỉ mô tả những cú TRƯỢT, nên cải thiện tỉ lệ trúng đệm lại làm nó XẤU ĐI trong khi người dùng được phục vụ nhanh hơn',
            ),
            B(
              'The second line is not a real request: a cache hit is served without ever entering the log, so the graph is built from half the data by construction',
              'Dòng thứ hai không phải một request thật: một cú trúng đệm được phục vụ mà không hề vào log, nên đồ thị vốn dĩ đã dựng từ một nửa dữ liệu',
            ),
            B(
              'The problem is <code>$request_time</code> being 0.000 on the hit, which makes the two lines incomparable; <code>$upstream_response_time</code> itself is fine',
              'Vấn đề nằm ở chỗ <code>$request_time</code> bằng 0,000 trên cú trúng đệm khiến hai dòng không so được với nhau; còn bản thân <code>$upstream_response_time</code> thì không sao',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Two different questions get confused here, and a cache is what separates them. "How slow is my backend" is a question about MISSES and <code>$upstream_response_time</code> answers it correctly — but only for the requests it exists on. "How slow is my site" is a question about every request, and only <code>$request_time</code> answers that. Graph both, and graph the hit ratio next to them, or you will report a regression every time the cache gets better. The same shape appears anywhere a variable is unset rather than zero: <code>$upstream_addr</code> on a static file, <code>$http_referer</code> on a direct visit, <code>$args</code> on a bare path. Nginx writes a dash for all of them, and a pipeline that coerces a dash to 0 will quietly average it into your numbers.',
            'Hai câu hỏi khác nhau bị lẫn vào nhau ở đây, và cái tách chúng ra chính là bộ đệm. "Backend của tôi chậm cỡ nào" là câu hỏi về những cú TRƯỢT và <code>$upstream_response_time</code> trả lời đúng — nhưng chỉ đúng cho những request mà nó tồn tại. Còn "site của tôi chậm cỡ nào" là câu hỏi về MỌI request, và chỉ <code>$request_time</code> trả lời được. Hãy vẽ cả hai, và vẽ tỉ lệ trúng đệm ngay cạnh chúng, không thì bạn sẽ báo cáo một cú thụt lùi mỗi lần bộ đệm chạy tốt hơn. Cùng hình dạng ấy xuất hiện ở mọi chỗ mà một biến KHÔNG ĐƯỢC ĐẶT chứ không phải bằng không: <code>$upstream_addr</code> trên một tệp tĩnh, <code>$http_referer</code> khi khách vào thẳng, <code>$args</code> trên một đường dẫn trơ. Nginx ghi dấu gạch ngang cho tất cả, và một đường ống ép dấu gạch ngang thành số 0 sẽ âm thầm trộn nó vào con số của bạn.',
          ),
        }),

        // q22 · đáp án 3
        mcq({
          prompt: B(
            'Three requests, one line missing from the log. Measured on nginx/1.27.5.' + code(
              'access_log /var/log/nginx/access.log mac;      # o tang http\n' +
              '\n' +
              'location /mac/ { return 200 "mac\\n"; }\n' +
              'location /js/  { access_log /var/log/nginx/access.log js; return 200 "js\\n"; }\n' +
              'location /tat/ { access_log off;                          return 200 "tat\\n"; }\n' +
              '\n' +
              '3 request -> chi 2 dong xuat hien; /tat/a khong co dong nao',
            ) + 'What is <code>access_log off</code> good for, and what does it cost?',
            'Ba request, log thiếu mất một dòng. Đo trên nginx/1.27.5.' + code(
              'access_log /var/log/nginx/access.log mac;      # o tang http\n' +
              '\n' +
              'location /mac/ { return 200 "mac\\n"; }\n' +
              'location /js/  { access_log /var/log/nginx/access.log js; return 200 "js\\n"; }\n' +
              'location /tat/ { access_log off;                          return 200 "tat\\n"; }\n' +
              '\n' +
              '3 request -> chi 2 dong xuat hien; /tat/a khong co dong nao',
            ) + '<code>access_log off</code> tốt ở chỗ nào, và cái giá của nó là gì?',
          ),
          options: [
            B(
              'It only suppresses successful responses, so errors in that location are still recorded and the setting is safe to leave on permanently',
              'Nó chỉ chặn các phản hồi thành công, nên lỗi trong location đó vẫn được ghi lại và có thể để thiết lập ấy bật vĩnh viễn mà không sao',
            ),
            B(
              'It buffers the lines in memory and flushes them only when the disk is idle, so nothing is lost — the missing line will appear later',
              'Nó đệm các dòng trong bộ nhớ rồi chỉ xả ra khi đĩa rảnh, nên không mất gì cả — dòng thiếu sẽ xuất hiện sau',
            ),
            B(
              'It disables logging for the whole server block, not just the location, which is why only two of the three lines survived',
              'Nó tắt việc ghi log cho cả khối server chứ không riêng location, và đó là lý do chỉ hai trong ba dòng sống sót',
            ),
            B(
              'It silences that location ENTIRELY — which is what you want for a health check hit every second — but it silences it during an incident too; <code>access_log … if=$bien</code> fed by a <code>map</code> on <code>$status</code> keeps the errors while dropping the noise',
              'Nó làm câm HOÀN TOÀN location đó — đúng thứ bạn muốn cho một cú kiểm tra sức khoẻ mỗi giây một lần — nhưng nó cũng làm câm luôn trong lúc đang có sự cố; <code>access_log … if=$bien</code> lấy từ một <code>map</code> trên <code>$status</code> thì giữ được lỗi mà vẫn bỏ được tiếng ồn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A health check every second is 86.400 lines a day that describe nothing, and turning them off is a real and common win — the same reason favicons and static assets are often silenced on a busy edge. The cost only shows up on the day it matters: when the health check starts failing, that is precisely the location with no record of it, and you are left correlating a graph with an empty file. The conditional form keeps both properties: a <code>map $status $ghi { ~^[23] 0; default 1; }</code> at the <code>http</code> level plus <code>access_log /var/log/nginx/access.log js if=$ghi;</code> writes nothing while everything is fine and everything once it is not. Note also from the transcript that a location declaring its own <code>access_log</code> replaces the inherited one rather than adding to it — the same replacement rule as <code>add_header</code>.',
            'Một cú kiểm tra sức khoẻ mỗi giây là 86.400 dòng mỗi ngày chẳng mô tả điều gì, và tắt chúng đi là một cái lợi có thật và phổ biến — cũng chính lý do đó khiến favicon và tài nguyên tĩnh hay bị làm câm trên một máy biên bận rộn. Cái giá chỉ lộ ra vào đúng cái ngày nó quan trọng: khi phép kiểm sức khoẻ bắt đầu hỏng thì đó lại đúng là cái location không có lấy một dòng ghi nhận, và bạn còn lại mỗi việc đem một cái đồ thị đi đối chiếu với một tệp rỗng. Dạng có điều kiện giữ được cả hai: một <code>map $status $ghi { ~^[23] 0; default 1; }</code> ở tầng <code>http</code> cộng với <code>access_log /var/log/nginx/access.log js if=$ghi;</code> thì không ghi gì khi mọi thứ ổn và ghi tất cả ngay khi hết ổn. Cũng để ý từ transcript rằng một location khai <code>access_log</code> của riêng nó thì THAY THẾ cái thừa hưởng chứ không cộng thêm vào — đúng cái luật thay thế của <code>add_header</code>.',
          ),
        }),

        // q23 · đáp án 2
        mcq({
          prompt: B(
            'One <code>stub_status</code> reading from a quiet server, measured on nginx/1.27.5. All three requests were made by <code>curl</code>, one per invocation.' + code(
              'Active connections: 1\n' +
              'server accepts handled requests\n' +
              ' 4 4 4\n' +
              'Reading: 0 Writing: 1 Waiting: 0',
            ) + 'What do the numbers say?',
            'Một lần đọc <code>stub_status</code> trên một máy chủ vắng khách, đo trên nginx/1.27.5. Cả ba request đều do <code>curl</code> gọi, mỗi lần một cái.' + code(
              'Active connections: 1\n' +
              'server accepts handled requests\n' +
              ' 4 4 4\n' +
              'Reading: 0 Writing: 1 Waiting: 0',
            ) + 'Mấy con số ấy nói gì?',
          ),
          options: [
            B(
              'Three equal numbers mean the counters have not been initialised yet: <code>stub_status</code> seeds all three from the same value at worker start and they only begin to diverge after the first <code>reload</code>, so a reading taken this early carries no information at all and should simply be taken again later',
              'Ba con số bằng nhau nghĩa là các bộ đếm chưa được khởi tạo: <code>stub_status</code> gieo cả ba từ cùng một giá trị lúc worker khởi động và chúng chỉ bắt đầu tách ra sau lần <code>reload</code> đầu tiên, nên một lần đọc sớm thế này hoàn toàn không mang thông tin gì và chỉ nên đọc lại sau',
            ),
            B(
              '<code>accepts</code> counts requests while <code>requests</code> counts connections — the two column headings are printed in the opposite order to the numbers underneath them — so three equal values prove that connection reuse is working perfectly on this server and no tuning is needed',
              '<code>accepts</code> đếm request còn <code>requests</code> đếm kết nối — hai tiêu đề cột được in theo thứ tự NGƯỢC với hàng số bên dưới — nên ba giá trị bằng nhau chứng tỏ việc tái dùng kết nối đang chạy hoàn hảo trên máy này và không cần chỉnh gì thêm',
            ),
            B(
              '<code>accepts == handled</code> means no connection was dropped before being served — the number to alert on is the day they DIVERGE — and <code>requests == accepts</code> means every connection carried exactly one request, i.e. keepalive is not being used; <code>Waiting</code> is the idle keepalive count, which is what fills <code>worker_connections</code> on a server that looks quiet',
              '<code>accepts == handled</code> nghĩa là không kết nối nào bị rơi trước khi được phục vụ — con số đáng cảnh báo là cái ngày chúng LỆCH NHAU — còn <code>requests == accepts</code> nghĩa là mỗi kết nối chỉ chở đúng một request, tức là keepalive không được dùng; <code>Waiting</code> là số kết nối keepalive đang rảnh, mà chính nó mới làm đầy <code>worker_connections</code> trên một máy trông có vẻ vắng',
            ),
            B(
              '<code>Writing: 1</code> means one request is stuck in the middle of sending its response; on a healthy idle server every one of the last four numbers must read zero, so this reading is evidence of a hung worker and the process should be reloaded',
              '<code>Writing: 1</code> nghĩa là có một request đang kẹt giữa chừng lúc gửi phản hồi; trên một máy nhàn rỗi khoẻ mạnh thì cả bốn con số cuối đều phải bằng 0, nên lần đọc này là bằng chứng của một worker treo và nên nạp lại tiến trình',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Seven numbers, and the useful ones are the relationships rather than the values. <code>accepts</code> minus <code>handled</code> is the count of connections the process took from the kernel and then threw away — it is zero on a healthy box and grows only when a hard ceiling is hit, <code>worker_connections</code> or the open-file limit, which is exactly the failure that looks like "the site is randomly slow" and has no error page anywhere. <code>requests</code> divided by <code>accepts</code> is your requests-per-connection, and a browser-facing edge should be well above one; equal to one, as here, means every client paid a fresh handshake, which for HTTPS is the most expensive thing on the whole page. And <code>Writing: 1</code> is the <code>stub_status</code> request itself — a reading always observes itself, which is worth remembering before you chase it.',
            'Bảy con số, và những cái hữu ích là các QUAN HỆ chứ không phải bản thân giá trị. <code>accepts</code> trừ <code>handled</code> là số kết nối mà tiến trình đã nhận từ nhân rồi vứt đi — nó bằng 0 trên một máy khoẻ và chỉ lớn lên khi chạm một trần cứng, <code>worker_connections</code> hoặc giới hạn tệp mở, mà đó đúng là kiểu hỏng trông giống "site tự dưng chậm" và không có trang lỗi nào ở đâu cả. <code>requests</code> chia cho <code>accepts</code> là số request trên mỗi kết nối, và một máy biên phục vụ trình duyệt thì phải cao hơn 1 nhiều; bằng đúng 1 như ở đây nghĩa là mọi client đều phải trả một cú bắt tay mới, mà với HTTPS thì đó là thứ đắt nhất trên cả trang. Còn <code>Writing: 1</code> chính là cái request <code>stub_status</code> ấy — một lần đọc bao giờ cũng quan sát thấy chính nó, điều đáng nhớ trước khi bạn đi truy nó.',
          ),
        }),

        // q24 · đáp án 0
        mcq({
          prompt: B(
            'Three variables for one path, and the dash, measured on nginx/1.27.5.' + code(
              'GET /api/ok?x=1        ->  uri=/api/ok        request_uri=/api/ok?x=1   args=x=1\n' +
              'GET /tinh/co.txt       ->  uri=/tinh/co.txt   request_uri=/tinh/co.txt  args=-\n' +
              'GET /r1/x  (co rewrite ^/r1/(.*)$ /dich/$1 last)\n' +
              '                       ->  uri=/dich/x        request_uri=/r1/x         args=-',
            ) + 'Which variable belongs in which place?',
            'Ba biến cho một đường dẫn, và cái dấu gạch ngang, đo trên nginx/1.27.5.' + code(
              'GET /api/ok?x=1        ->  uri=/api/ok        request_uri=/api/ok?x=1   args=x=1\n' +
              'GET /tinh/co.txt       ->  uri=/tinh/co.txt   request_uri=/tinh/co.txt  args=-\n' +
              'GET /r1/x  (co rewrite ^/r1/(.*)$ /dich/$1 last)\n' +
              '                       ->  uri=/dich/x        request_uri=/r1/x         args=-',
            ) + 'Biến nào thuộc về chỗ nào?',
          ),
          options: [
            B(
              '<code>$uri</code> is the normalised and possibly REWRITTEN path with no query string; <code>$request_uri</code> is the raw original line the client sent; <code>$args</code> is a dash when empty because Nginx writes a dash for ANY unset variable. Group a dashboard by <code>$uri</code> and you hide the rewrite; group it by <code>$request_uri</code> and one endpoint explodes into a row per query string',
              '<code>$uri</code> là đường dẫn đã chuẩn hoá và có thể đã VIẾT LẠI, không kèm chuỗi truy vấn; <code>$request_uri</code> là dòng gốc thô mà client gửi lên; <code>$args</code> là dấu gạch ngang khi rỗng vì Nginx ghi dấu gạch ngang cho MỌI biến không được đặt. Gom bảng số liệu theo <code>$uri</code> thì bạn giấu mất cú rewrite; gom theo <code>$request_uri</code> thì một endpoint nổ tung thành mỗi chuỗi truy vấn một dòng',
            ),
            B(
              '<code>$uri</code> and <code>$request_uri</code> are the same value written with two different escaping rules — one percent-decoded and one raw — so either of them works for grouping a dashboard as long as the ingestion pipeline decodes percent-escapes before it compares them',
              '<code>$uri</code> và <code>$request_uri</code> là cùng một giá trị viết theo hai luật thoát ký tự khác nhau — một cái đã giải mã phần trăm và một cái còn thô — nên gom bảng số liệu theo cái nào cũng được, miễn là đường ống thu thập giải mã ký tự phần trăm trước khi đem so',
            ),
            B(
              'The dash in <code>$args</code> is the literal two-character value the client sent as its query string; a genuinely absent query string would instead make the whole field disappear from the line and shift every column after it by one',
              'Dấu gạch ngang ở <code>$args</code> chính là giá trị hai ký tự mà client gửi lên làm chuỗi truy vấn; còn một chuỗi truy vấn vắng mặt thật sự thì sẽ làm cả trường đó biến khỏi dòng log và dịch mọi cột phía sau nó đi một nhịp',
            ),
            B(
              '<code>$request_uri</code> is the one that follows an internal rewrite while <code>$uri</code> is frozen at what the client typed, which is exactly why the third row shows the original path in the middle column and the rewritten one on the left',
              '<code>$request_uri</code> mới là cái đi theo cú rewrite nội bộ còn <code>$uri</code> thì đóng băng ở thứ client gõ vào, và đó chính xác là lý do dòng thứ ba hiện đường dẫn gốc ở cột giữa và đường dẫn đã viết lại ở cột trái',
            ),
          ],
          correct: 0,
          explanation: EX(
            'These are three different questions and the third row makes the difference visible: after an internal rewrite the client and the server disagree about what the URL was, and each variable answers for one of them. Use <code>$request_uri</code> when you need to reproduce what the client did — replaying a bug, matching against a CDN log, or proving what someone actually requested. Use <code>$uri</code> when you need to group traffic by route, because it is post-rewrite and post-normalisation and therefore stable. Keep both in the log; they cost nothing and the day you need them you cannot go back and add them. And treat the dash as what it is: not a value but the absence of one, which no numeric pipeline should ever coerce to zero.',
            'Đây là BA câu hỏi khác nhau và dòng thứ ba làm cho khác biệt ấy hiện ra: sau một cú rewrite nội bộ thì client và máy chủ bất đồng về chuyện cái URL đó là gì, và mỗi biến trả lời cho một bên. Hãy dùng <code>$request_uri</code> khi bạn cần tái hiện lại thứ client đã làm — chạy lại một lỗi, đối chiếu với log của CDN, hay chứng minh ai đó đã thật sự hỏi cái gì. Hãy dùng <code>$uri</code> khi bạn cần gom lưu lượng theo tuyến, vì nó là bản sau rewrite và sau chuẩn hoá nên ổn định. Hãy giữ CẢ HAI trong log; chúng chẳng tốn gì và tới cái ngày bạn cần thì không thể quay ngược lại để thêm vào. Và hãy coi dấu gạch ngang đúng như bản chất của nó: không phải một giá trị mà là sự VẮNG MẶT của giá trị, thứ mà không đường ống số học nào được phép ép thành số 0.',
          ),
        }),

        /* ── Chương 11 — chẩn đoán (6 câu) ──────────────────────────────── */

        // q25 · đáp án 1
        mcq({
          prompt: B(
            'A configuration with a document root that does not exist. Measured on nginx/1.27.5.' + code(
              'server { listen 8080; root /khong-co-thu-muc-nay;\n' +
              '  location /a/ { }\n' +
              '  location /b/ { alias /www/t1/; }\n' +
              '}\n' +
              '\n' +
              '/a/x        -> 404\n' +
              '/b/co.txt   -> 200\n' +
              '\n' +
              '[error] open() "/khong-co-thu-muc-nay/a/x" failed (2: No such file or directory),\n' +
              '        client: 192.168.65.1, request: "GET /a/x HTTP/1.1", host: "127.0.0.1:18086"',
            ) + 'What makes that error-log line the fastest tool for a <code>root</code>/<code>alias</code> bug?',
            'Một cấu hình có thư mục gốc tài liệu không tồn tại. Đo trên nginx/1.27.5.' + code(
              'server { listen 8080; root /khong-co-thu-muc-nay;\n' +
              '  location /a/ { }\n' +
              '  location /b/ { alias /www/t1/; }\n' +
              '}\n' +
              '\n' +
              '/a/x        -> 404\n' +
              '/b/co.txt   -> 200\n' +
              '\n' +
              '[error] open() "/khong-co-thu-muc-nay/a/x" failed (2: No such file or directory),\n' +
              '        client: 192.168.65.1, request: "GET /a/x HTTP/1.1", host: "127.0.0.1:18086"',
            ) + 'Điều gì khiến dòng error log ấy là công cụ nhanh nhất cho một lỗi <code>root</code>/<code>alias</code>?',
          ),
          options: [
            B(
              'It names the directive that produced the path, so you can jump straight to the line number in the configuration file',
              'Nó gọi tên cái chỉ thị đã sinh ra đường dẫn, nên bạn nhảy thẳng được tới số dòng trong tệp cấu hình',
            ),
            B(
              'It prints the EXACT filesystem path Nginx assembled, which answers both halves of the question at once — which directive won, and how it concatenated the location prefix with the URI — so you compare that string with the disk instead of re-reading the config',
              'Nó in ra ĐÚNG cái đường dẫn hệ tệp mà Nginx đã ráp ra, và điều đó trả lời cả hai nửa câu hỏi cùng lúc — chỉ thị nào thắng, và nó nối tiền tố location với URI kiểu gì — nên bạn đem chuỗi ấy đi so với đĩa thay vì đọc lại cấu hình',
            ),
            B(
              'It proves the file is missing rather than unreadable, because a permissions problem would produce a 403 and never reach the error log at all',
              'Nó chứng minh tệp bị thiếu chứ không phải không đọc được, vì một vấn đề quyền truy cập sẽ cho ra 403 và không bao giờ tới được error log',
            ),
            B(
              'It is written at <code>notice</code> level, so it appears even on a production server where the error log is turned down and other diagnostics are suppressed',
              'Nó được ghi ở mức <code>notice</code>, nên nó xuất hiện ngay cả trên máy production nơi error log đã bị hạ mức và các chẩn đoán khác bị chặn',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Almost every <code>root</code> and <code>alias</code> bug is a string-concatenation bug, and this line hands you the result of the concatenation. Read it against three questions. Is the prefix right — does it start with the directory you meant? Is the location part present or absent — <code>root</code> appends the whole URI, <code>alias</code> replaces the matched prefix, and seeing <code>/a/</code> in the path when you used <code>alias</code> means the trailing slashes disagree. And does the tail look doubled or fused, which is the classic missing or extra slash. Two more practical notes: it is logged at <code>error</code>, so it survives a production log level, and it also tells you nothing when it is ABSENT — which is the next question.',
            'Gần như mọi lỗi <code>root</code> và <code>alias</code> đều là lỗi NỐI CHUỖI, và dòng này đưa thẳng cho bạn kết quả của phép nối ấy. Hãy đọc nó với ba câu hỏi. Phần đầu có đúng không — nó có bắt đầu bằng cái thư mục bạn định không? Phần location có mặt hay vắng mặt — <code>root</code> thì nối TOÀN BỘ URI vào, <code>alias</code> thì THAY tiền tố đã khớp, nên thấy <code>/a/</code> nằm trong đường dẫn trong khi bạn dùng <code>alias</code> nghĩa là mấy dấu gạch chéo cuối đang bất đồng. Và cái đuôi có bị nhân đôi hay dính liền không, đó chính là chuyện thiếu hay thừa một dấu gạch chéo kinh điển. Hai ghi chú thực tế nữa: nó được ghi ở mức <code>error</code> nên sống sót qua mức log của production, và nó cũng nói cho bạn một điều khi nó VẮNG MẶT — mà đó là câu hỏi kế tiếp.',
          ),
        }),

        // q26 · đáp án 2
        mcq({
          prompt: B(
            'Three 404s from three locations, and only ONE line in the error log. Measured on nginx/1.27.5.' + code(
              'location /tf/ { try_files $uri =404; }     /tf/thieu.txt  -> 404\n' +
              'location /rt/ { return 404; }              /rt/x          -> 404\n' +
              'location /f/  { }                          /f/thieu.txt   -> 404\n' +
              '\n' +
              'error log (toan bo):\n' +
              '[error] open() "/www/f/thieu.txt" failed (2: No such file or directory) ...',
            ) + 'What does a 404 with NO error-log line tell you?',
            'Ba mã 404 từ ba location, mà error log chỉ có ĐÚNG MỘT dòng. Đo trên nginx/1.27.5.' + code(
              'location /tf/ { try_files $uri =404; }     /tf/thieu.txt  -> 404\n' +
              'location /rt/ { return 404; }              /rt/x          -> 404\n' +
              'location /f/  { }                          /f/thieu.txt   -> 404\n' +
              '\n' +
              'error log (toan bo):\n' +
              '[error] open() "/www/f/thieu.txt" failed (2: No such file or directory) ...',
            ) + 'Một mã 404 mà KHÔNG có dòng error log nào nói cho bạn biết điều gì?',
          ),
          options: [
            B(
              'That the error log level is set too high for these two blocks; lowering it to <code>info</code> on the server would produce the two missing lines, at which point all three cases turn out to be identical after all',
              'Rằng mức error log đang đặt quá cao với hai khối đó; hạ nó xuống <code>info</code> ở tầng server sẽ sinh ra hai dòng còn thiếu, và tới lúc ấy hoá ra cả ba ca đều giống hệt nhau',
            ),
            B(
              'That the response was served out of the proxy cache, since a 404 that was cached earlier is replayed straight from the cache file without touching the document root or logging anything at all',
              'Rằng phản hồi được lấy ra từ bộ đệm proxy, vì một mã 404 đã được cache từ trước thì được phát lại thẳng từ tệp đệm mà không chạm tới thư mục gốc tài liệu và cũng không ghi log gì cả',
            ),
            B(
              'That the 404 was a DECISION, not a missing file: <code>open() failed</code> appears only when Nginx actually tried to open something, and both <code>try_files … =404</code> and <code>return 404;</code> answer without ever touching the disk — so the absence of the line tells you which block to go and read',
              'Rằng mã 404 đó là một QUYẾT ĐỊNH chứ không phải một tệp bị thiếu: <code>open() failed</code> chỉ hiện ra khi Nginx thật sự đã thử mở một cái gì đó, mà cả <code>try_files … =404</code> lẫn <code>return 404;</code> đều trả lời mà không hề chạm tới đĩa — nên chính sự VẮNG MẶT của dòng ấy chỉ cho bạn khối nào cần đi đọc',
            ),
            B(
              'That the request never reached a location block at all, so it was answered by the port\'s default server before location matching had even begun and no block in this file was involved',
              'Rằng request chưa hề tới được một khối location nào, nên nó được máy chủ mặc định của cổng đó trả lời trước cả khi khâu chọn location kịp bắt đầu và không khối nào trong tệp này dính dáng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Absence of evidence is evidence here, and it splits the 404s on your site into two piles that need completely different fixes. A 404 WITH an <code>open() failed</code> line is a path problem: the file, the <code>root</code> or the permissions. A 404 with NOTHING in the error log was chosen by a directive, so the file may well exist and the bug is in the routing — a <code>try_files</code> list that misses the case, a <code>return 404;</code> in a block you forgot, an <code>internal</code> location reached from outside. The fastest way to tell them apart on a live system is to make the two piles visible from the access log instead: <code>add_header X-Khoi "ten-khoi" always;</code> in each candidate block plus <code>$sent_http_x_khoi</code> in the log format, which is the next question.',
            'Ở đây sự VẮNG MẶT của bằng chứng chính là bằng chứng, và nó chia đám 404 trên site của bạn thành hai đống cần hai cách sửa hoàn toàn khác nhau. Một mã 404 CÓ kèm dòng <code>open() failed</code> là vấn đề ĐƯỜNG DẪN: tệp, <code>root</code>, hoặc quyền truy cập. Một mã 404 mà error log KHÔNG có gì thì đã được một chỉ thị CHỌN ra, nên tệp rất có thể vẫn tồn tại và lỗi nằm ở khâu định tuyến — một danh sách <code>try_files</code> bỏ sót ca đó, một lệnh <code>return 404;</code> trong cái khối bạn quên mất, một location <code>internal</code> bị với tới từ bên ngoài. Cách nhanh nhất để phân biệt chúng trên hệ thống đang chạy là làm cho hai đống ấy hiện ra ngay trong ACCESS log: <code>add_header X-Khoi "ten-khoi" always;</code> trong mỗi khối khả nghi cộng với <code>$sent_http_x_khoi</code> trong định dạng log, và đó là câu hỏi kế tiếp.',
          ),
        }),

        // q27 · đáp án 3
        mcq({
          prompt: B(
            'A probe that survives an error response, measured on nginx/1.27.5.' + code(
              "log_format d 'id=$request_id ma=$status uri=$uri khoi=$sent_http_x_khoi';\n" +
              '\n' +
              'location /tf/ { add_header X-Khoi "tf" always; try_files $uri =404; }\n' +
              'location /rt/ { add_header X-Khoi "rt" always; return 404; }\n' +
              '\n' +
              'id=656d3cd407e17445c766ffb95505b1cf ma=404 uri=/tf/thieu.txt khoi=tf\n' +
              'id=0ff3c79ec5d02c8c52e6862d8a20ff60 ma=404 uri=/rt/x         khoi=rt',
            ) + 'What makes this technique work, and where does it stop working?',
            'Một phép dò sống sót được qua phản hồi lỗi, đo trên nginx/1.27.5.' + code(
              "log_format d 'id=$request_id ma=$status uri=$uri khoi=$sent_http_x_khoi';\n" +
              '\n' +
              'location /tf/ { add_header X-Khoi "tf" always; try_files $uri =404; }\n' +
              'location /rt/ { add_header X-Khoi "rt" always; return 404; }\n' +
              '\n' +
              'id=656d3cd407e17445c766ffb95505b1cf ma=404 uri=/tf/thieu.txt khoi=tf\n' +
              'id=0ff3c79ec5d02c8c52e6862d8a20ff60 ma=404 uri=/rt/x         khoi=rt',
            ) + 'Điều gì làm kỹ thuật này chạy được, và nó thôi chạy ở đâu?',
          ),
          options: [
            B(
              'It works because <code>$sent_http_…</code> is evaluated before the response is assembled rather than after it, so the header never has to reach the client at all and the marker stays completely private to the server',
              'Nó chạy được vì <code>$sent_http_…</code> được tính TRƯỚC khi phản hồi được ráp lại chứ không phải sau, nên cái header đó không hề phải tới tay client và dấu vết ấy hoàn toàn riêng tư trong máy chủ',
            ),
            B(
              'It works for any status because <code>add_header</code> already applies to every response by default; the <code>always</code> keyword only changes the ORDER the headers are written in, which matters for proxies but not for this technique',
              'Nó chạy với mọi mã trạng thái vì <code>add_header</code> vốn đã áp dụng cho mọi phản hồi theo mặc định; từ khoá <code>always</code> chỉ đổi THỨ TỰ các header được ghi ra, thứ quan trọng với proxy chứ không quan trọng với kỹ thuật này',
            ),
            B(
              'It works only for errors: on a 200 the header is dropped again before the response leaves, which is why both sample lines above happen to be 404s and why a successful request would log an empty <code>khoi</code> field',
              'Nó chỉ chạy với lỗi: trên mã 200 thì header bị bỏ đi lần nữa trước khi phản hồi rời đi, và đó là lý do cả hai dòng mẫu ở trên đều tình cờ là 404, còn một request thành công thì sẽ ghi trường <code>khoi</code> rỗng',
            ),
            B(
              '<code>always</code> is what makes <code>add_header</code> apply to 4xx and 5xx as well, and <code>$sent_http_x_khoi</code> reads back a header the response actually carries — so every request records which block answered it. It stops working in any block that declares an <code>add_header</code> of its own, because that replaces the inherited list',
              'Chính <code>always</code> làm cho <code>add_header</code> áp dụng được cho cả 4xx và 5xx, còn <code>$sent_http_x_khoi</code> đọc ngược lại một header mà phản hồi THẬT SỰ mang theo — nên mỗi request đều ghi lại khối nào đã trả lời nó. Nó thôi chạy trong bất cứ khối nào khai một <code>add_header</code> của riêng nó, vì cái đó THAY THẾ danh sách thừa hưởng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is the cheapest possible answer to "which of my forty locations handled that request", and it costs one header and one log field. Two details make or break it. Without <code>always</code>, <code>add_header</code> is skipped on 4xx and 5xx — precisely the responses you are investigating. And because <code>add_header</code> is list-valued and inherited by replacement, a block that adds a security header of its own will silently lose the marker, so the technique needs an <code>include</code> of one snippet rather than a line copied around. The <code>$request_id</code> beside it is the other half: forward it upstream with <code>proxy_set_header X-Ma-Yeu-Cau $request_id;</code> and the same 32-character string appears in the Nginx log and in the application log, which turns "find the matching entry by timestamp" into an exact lookup.',
            'Đây là câu trả lời rẻ nhất có thể cho câu hỏi "trong bốn mươi cái location của tôi thì cái nào đã xử lý request đó", và nó tốn đúng một header với một trường log. Hai chi tiết quyết định sống chết. Không có <code>always</code> thì <code>add_header</code> bị bỏ qua trên 4xx và 5xx — đúng những phản hồi mà bạn đang đi điều tra. Và vì <code>add_header</code> là dạng danh sách và thừa hưởng theo kiểu thay thế, một khối có thêm header bảo mật của riêng nó sẽ âm thầm làm mất cái dấu vết ấy, nên kỹ thuật này cần một tệp snippet đem <code>include</code> vào chứ không phải một dòng chép đi chép lại. Còn <code>$request_id</code> đứng cạnh đó là nửa còn lại: hãy chuyển nó lên upstream bằng <code>proxy_set_header X-Ma-Yeu-Cau $request_id;</code> và cùng một chuỗi 32 ký tự sẽ xuất hiện trong log của Nginx lẫn log của ứng dụng, thứ biến việc "dò mục khớp theo dấu thời gian" thành một phép tra CHÍNH XÁC.',
          ),
        }),

        // q28 · đáp án 0
        mcq({
          prompt: B(
            'Two failures on a server whose <code>nginx -t</code> was clean and whose container had been up for hours. Measured on nginx/1.27.5.' + code(
              'server { listen 8080; root /khong-co-thu-muc-nay;\n' +
              '  location /a/ { }\n' +
              '  location /c/ { proxy_pass http://127.0.0.1:9298/; }   # khong co gi nghe o 9298\n' +
              '}\n' +
              '$ nginx -t   ->  syntax is ok / test is successful\n' +
              '/a/x  -> 404      /c/  -> 502\n' +
              '\n' +
              '# nhung doi location /c/ thanh proxy_pass http://ten-khong-phan-giai.test/ :\n' +
              '$ nginx -t   ->  [emerg] host not found in upstream "ten-khong-phan-giai.test"',
            ) + 'Where is the line that the test does and does not cross?',
            'Hai cú hỏng trên một máy chủ mà <code>nginx -t</code> hoàn toàn sạch và container đã chạy hàng giờ. Đo trên nginx/1.27.5.' + code(
              'server { listen 8080; root /khong-co-thu-muc-nay;\n' +
              '  location /a/ { }\n' +
              '  location /c/ { proxy_pass http://127.0.0.1:9298/; }   # khong co gi nghe o 9298\n' +
              '}\n' +
              '$ nginx -t   ->  syntax is ok / test is successful\n' +
              '/a/x  -> 404      /c/  -> 502\n' +
              '\n' +
              '# nhung doi location /c/ thanh proxy_pass http://ten-khong-phan-giai.test/ :\n' +
              '$ nginx -t   ->  [emerg] host not found in upstream "ten-khong-phan-giai.test"',
            ) + 'Cái ranh giới mà phép kiểm có vượt qua và không vượt qua nằm ở đâu?',
          ),
          options: [
            B(
              'The test opens everything the LOAD itself must open — it resolves upstream NAMES and reads certificates — and touches nothing a REQUEST would open, so a missing document root and a backend that is simply not listening both pass cleanly',
              'Phép kiểm mở mọi thứ mà bản thân việc NẠP phải mở — nó phân giải TÊN upstream và đọc chứng chỉ — và không chạm tới bất cứ thứ gì mà một REQUEST mới mở, nên một thư mục gốc không tồn tại lẫn một backend đơn giản là không nghe đều qua sạch sẽ',
            ),
            B(
              'The test only parses text: the name resolution failure came from the running process at reload time, not from <code>-t</code>, which never performs any I/O at all',
              'Phép kiểm chỉ phân tích văn bản: cú hỏng phân giải tên tới từ tiến trình đang chạy lúc reload chứ không phải từ <code>-t</code>, thứ hoàn toàn không làm một thao tác vào/ra nào',
            ),
            B(
              'The line is drawn at the network: anything requiring DNS or TCP is checked and anything on the local filesystem is not, which is why the root passed and the dead port did not',
              'Ranh giới nằm ở MẠNG: thứ gì cần DNS hay TCP thì được kiểm còn thứ gì nằm trên hệ tệp cục bộ thì không, và đó là lý do cái root qua được còn cái cổng chết thì không',
            ),
            B(
              'There is no line: <code>-t</code> checks everything, and the three results above differ only because the first two were run against an already-loaded configuration held in memory',
              'Không có ranh giới nào: <code>-t</code> kiểm mọi thứ, và ba kết quả ở trên khác nhau chỉ vì hai cái đầu chạy trên một cấu hình đã nạp sẵn trong bộ nhớ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The rule is worth memorising because it decides what a deploy pipeline can and cannot promise. Loading the configuration must resolve every name in a <code>server</code> line and open every certificate and key, so those failures are caught before anything is swapped — which is exactly why a backend container that starts a second later than the edge takes the edge down with it. Everything else is per-request: <code>root</code>, <code>alias</code>, <code>try_files</code> targets, the reachability of an IP-addressed backend, whether a rate limit does what you meant. So a green <code>nginx -t</code> is a syntax and load check, not a health check, and the only honest gate on a deploy is an HTTP probe of a real route afterwards — which is precisely what the smoke test in a deploy script is for.',
            'Cái luật này đáng thuộc lòng vì nó quyết định một đường ống deploy hứa được và không hứa được điều gì. Việc NẠP cấu hình bắt buộc phải phân giải mọi cái tên trong một dòng <code>server</code> và mở mọi chứng chỉ với khoá, nên những cú hỏng đó bị bắt trước khi có gì được tráo — và đó chính xác là lý do một container backend khởi động chậm hơn máy biên một giây sẽ kéo máy biên chết theo. Mọi thứ còn lại đều là chuyện TỪNG REQUEST: <code>root</code>, <code>alias</code>, đích của <code>try_files</code>, chuyện một backend khai bằng địa chỉ IP có với tới được không, chuyện một giới hạn tần suất có làm đúng ý bạn không. Nên một lệnh <code>nginx -t</code> xanh là một phép kiểm CÚ PHÁP và kiểm NẠP, không phải một phép kiểm SỨC KHOẺ, và cái cổng trung thực duy nhất của một lần deploy là một cú dò HTTP vào một tuyến thật ngay sau đó — mà đó đúng là công dụng của bước smoke-test trong một kịch bản deploy.',
          ),
        }),

        // q29 · đáp án 2
        mcq({
          prompt: B(
            'A configuration file is bind-mounted into the container as a SINGLE FILE. Three rounds, measured on nginx/1.27.5.' + code(
              'ban dau                          ->  V1\n' +
              '\n' +
              '# vong 1: ghi DE TAI CHO (mo tep, ghi, truncate) roi nginx -s reload\n' +
              'tep tren host: V2   ->  reload xanh   ->  curl tra ve  V2\n' +
              '\n' +
              '# vong 2: sua bang `sed -i` (ghi tep TAM roi DOI TEN) roi nginx -s reload\n' +
              'tep tren host: V3   ->  nginx -t xanh, reload xanh  ->  curl van tra ve  V2\n' +
              'docker exec ... grep V /etc/nginx/nginx.conf   ->  V2',
            ) + 'What happened in round 2?',
            'Một tệp cấu hình được bind-mount vào container dưới dạng MỘT TỆP ĐƠN. Ba vòng, đo trên nginx/1.27.5.' + code(
              'ban dau                          ->  V1\n' +
              '\n' +
              '# vong 1: ghi DE TAI CHO (mo tep, ghi, truncate) roi nginx -s reload\n' +
              'tep tren host: V2   ->  reload xanh   ->  curl tra ve  V2\n' +
              '\n' +
              '# vong 2: sua bang `sed -i` (ghi tep TAM roi DOI TEN) roi nginx -s reload\n' +
              'tep tren host: V3   ->  nginx -t xanh, reload xanh  ->  curl van tra ve  V2\n' +
              'docker exec ... grep V /etc/nginx/nginx.conf   ->  V2',
            ) + 'Vòng 2 đã xảy ra chuyện gì?',
          ),
          options: [
            B(
              '<code>reload</code> is asynchronous and the old workers were still draining their existing connections when the probe ran; waiting a few more seconds for them to exit would have shown V3 without any further action',
              '<code>reload</code> chạy bất đồng bộ và mấy worker cũ vẫn đang xả nốt các kết nối đang giữ vào lúc phép dò chạy; chờ thêm vài giây cho chúng thoát hẳn là sẽ thấy V3 mà không cần làm gì thêm',
            ),
            B(
              'The mount was created read-only, so the second write never reached the container filesystem at all and it is the host copy of the file that is really still sitting at V2 despite what the editor reported',
              'Điểm gắn kết được tạo ở chế độ chỉ-đọc, nên lượt ghi thứ hai chưa từng tới được hệ tệp của container, và chính bản trên host mới là thứ thật sự còn nằm ở V2 bất kể trình soạn thảo báo cáo gì',
            ),
            B(
              'A single-FILE bind mount is bound by INODE at container start. <code>sed -i</code> writes a temporary file and renames it, so the host PATH now points at a NEW inode while the container still reads the OLD one — <code>nginx -t</code> validated the old content, <code>reload</code> reloaded the old content, and every command reported success',
              'Một bind-mount TỆP ĐƠN được gắn theo INODE lúc container khởi động. <code>sed -i</code> ghi một tệp tạm rồi đổi tên, nên ĐƯỜNG DẪN trên host giờ trỏ vào một inode MỚI trong khi container vẫn đọc inode CŨ — <code>nginx -t</code> đã kiểm nội dung cũ, <code>reload</code> đã nạp lại nội dung cũ, và mọi câu lệnh đều báo thành công',
            ),
            B(
              'Nginx caches the parsed configuration in shared memory and only re-reads the file when its size or its modification time changes; V2 and V3 are exactly the same length, so the reload found nothing to do and kept the version it had',
              'Nginx cache lại cấu hình đã phân tích trong bộ nhớ chung và chỉ đọc lại tệp khi KÍCH THƯỚC hay thời điểm sửa đổi của nó thay đổi; V2 và V3 dài đúng bằng nhau, nên cú reload không thấy việc gì phải làm và giữ nguyên bản nó đang có',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Every command in round 2 told the truth about a file nobody was serving. This is the failure mode where a config change "deploys successfully" and has no effect, and it is silent by construction: <code>nginx -t</code> reads what the container can see, so it validates the OLD content and passes. Two habits defuse it. Write config files IN PLACE — <code>cat new &gt; conf</code>, never <code>mv</code>, <code>rsync</code>, <code>sed -i</code> or vim\'s <code>:w</code>, all of which rename — and prefer mounting the DIRECTORY over mounting a single file, since a directory mount follows the path. And verify from INSIDE: compare a <code>sha256sum</code> on the host with <code>docker exec … sha256sum /etc/nginx/nginx.conf</code>, or just <code>nginx -T</code> and read the first lines. "It was written" and "the process can see it" are two different claims, and only the second one matters.',
            'Mọi câu lệnh ở vòng 2 đều nói THẬT về một tệp mà không ai đang phục vụ. Đây là kiểu hỏng khiến một thay đổi cấu hình "deploy thành công" mà không có hiệu lực gì, và nó im lặng theo đúng cấu tạo: <code>nginx -t</code> đọc thứ mà CONTAINER nhìn thấy, nên nó kiểm nội dung CŨ rồi báo đạt. Hai thói quen gỡ được cái bẫy này. Hãy ghi tệp cấu hình ĐÈ TẠI CHỖ — <code>cat mới &gt; conf</code>, đừng bao giờ <code>mv</code>, <code>rsync</code>, <code>sed -i</code> hay lệnh <code>:w</code> của vim, tất cả đều đổi tên — và hãy ưu tiên gắn cả THƯ MỤC thay vì gắn một tệp đơn, vì gắn thư mục thì đi theo ĐƯỜNG DẪN. Và hãy kiểm từ BÊN TRONG: so <code>sha256sum</code> trên host với <code>docker exec … sha256sum /etc/nginx/nginx.conf</code>, hoặc đơn giản là <code>nginx -T</code> rồi đọc mấy dòng đầu. "Đã ghi xong" và "tiến trình nhìn thấy được" là hai lời khẳng định khác nhau, và chỉ cái thứ hai mới có giá trị.',
          ),
        }),

        // q30 · đáp án 1
        mcq({
          prompt: B(
            'You inherit an edge server and have five minutes before the incident call. All four commands were run on nginx/1.27.5.' + code(
              'A) nginx -t                      -> syntax is ok / test is successful\n' +
              'B) nginx -T                      -> in ra TOAN BO cau hinh hieu luc, moi include da bung ra\n' +
              'C) curl -si http://edge/duong-dan-that   -> dong trang thai + moi header\n' +
              'D) docker logs <container>       -> access log + error log',
            ) + 'Which one answers "is this box actually doing its job right now", and why?',
            'Bạn nhận bàn giao một máy chủ biên và có năm phút trước cuộc gọi xử lý sự cố. Cả bốn câu lệnh đều đã chạy trên nginx/1.27.5.' + code(
              'A) nginx -t                      -> syntax is ok / test is successful\n' +
              'B) nginx -T                      -> in ra TOAN BO cau hinh hieu luc, moi include da bung ra\n' +
              'C) curl -si http://edge/duong-dan-that   -> dong trang thai + moi header\n' +
              'D) docker logs <container>       -> access log + error log',
            ) + 'Câu lệnh nào trả lời được "cái máy này NGAY LÚC NÀY có đang làm đúng việc của nó không", và vì sao?',
          ),
          options: [
            B(
              'A, because a configuration that loads is by definition a configuration that behaves, and the other three only add detail to what it already proved',
              'A, vì một cấu hình nạp được thì theo định nghĩa là một cấu hình hành xử đúng, và ba cái kia chỉ thêm chi tiết cho điều nó đã chứng minh',
            ),
            B(
              'C, because it is the only one that observes a RESPONSE — the status line and the headers are what the client experiences, and everything upstream of them is a claim about intent rather than about behaviour; B tells you what the process read, D tells you what already happened, A tells you the file parses',
              'C, vì đó là cái duy nhất quan sát một PHẢN HỒI — dòng trạng thái và các header chính là thứ client trải qua, còn mọi thứ đứng trước chúng chỉ là lời khẳng định về Ý ĐỊNH chứ không phải về HÀNH VI; B cho biết tiến trình đã đọc gì, D cho biết chuyện gì đã xảy ra, A cho biết cái tệp phân tích được',
            ),
            B(
              'B, because the effective configuration is the ground truth: once you have read it you can predict every response without needing to send one',
              'B, vì cấu hình hiệu lực mới là sự thật gốc: đọc xong nó rồi thì bạn dự đoán được mọi phản hồi mà chẳng cần gửi cái nào',
            ),
            B(
              'D, because logs are the only source that cannot be wrong, so a live probe adds nothing that the last few minutes of traffic have not already recorded',
              'D, vì log là nguồn duy nhất không thể sai, nên một phép dò trực tiếp chẳng thêm được gì mà mấy phút lưu lượng vừa rồi chưa ghi lại',
            ),
          ],
          correct: 1,
          explanation: EX(
            'All four are worth running and they answer four different questions, which is the point. <code>nginx -t</code> answers "does this file load" — a syntax and load check that this whole chapter has shown can be green while the site is broken. <code>nginx -T</code> answers "what did the process actually read", which is the only honest way to read a configuration you did not write, and the first place to look when a change appears to have no effect. <code>docker logs</code> answers "what has already happened", which is where causes live: an <code>open() failed</code> path, a <code>connect() failed</code> peer, an <code>$upstream_addr</code> that stopped containing a colon. And <code>curl -si</code> against a real path is the only one that produces evidence about the present, which is why the smoke test at the end of a deploy is a curl and not a config check. Run C first, then D for the cause, then B to find the block, then A only when you are about to change something.',
            'Cả bốn đều đáng chạy và chúng trả lời BỐN câu hỏi khác nhau, mà đó chính là điều cần thấy. <code>nginx -t</code> trả lời "cái tệp này có nạp được không" — một phép kiểm cú pháp và kiểm nạp mà cả chương này đã cho thấy là có thể xanh trong khi site đang hỏng. <code>nginx -T</code> trả lời "tiến trình đã THẬT SỰ đọc cái gì", và đó là cách trung thực duy nhất để đọc một cấu hình không phải bạn viết, cũng là chỗ nhìn đầu tiên khi một thay đổi có vẻ không có hiệu lực. <code>docker logs</code> trả lời "chuyện gì ĐÃ xảy ra", và nguyên nhân sống ở đó: một đường dẫn <code>open() failed</code>, một máy <code>connect() failed</code>, một <code>$upstream_addr</code> thôi chứa dấu hai chấm. Còn <code>curl -si</code> vào một đường dẫn thật là cái duy nhất sinh ra bằng chứng về HIỆN TẠI, và đó là lý do bước smoke-test ở cuối một lần deploy là một lệnh curl chứ không phải một phép kiểm cấu hình. Hãy chạy C trước, rồi D để tìm nguyên nhân, rồi B để tìm ra khối, và A chỉ khi bạn sắp sửa đổi một thứ gì đó.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            "<p><b>Q31 — Implement the load balancer's choice, request by request (chapter 9).</b> Nginx does not hand out weighted traffic in batches: <code>weight=3</code> does not mean three in a row. It runs SMOOTH weighted round robin, which keeps the ratio exact over one period while spreading the heavy peer through it. Implement it, then reproduce five real sequences. Every expected line below was produced by the real nginx/1.27.5 with <code>worker_processes 1</code>, one upstream block per row, twelve sequential requests each.</p>" +
            "<p>Every peer carries a fixed <code>w</code> and a running accumulator, which starts at 0. For ONE request:</p>" +
            "<ul>" +
            "<li>Add each peer's <code>w</code> to its own accumulator — every peer, every time, in array order.</li>" +
            "<li>The peer with the LARGEST accumulator serves the request. On a tie the earlier peer in the array keeps it, so compare with a strict <code>&gt;</code> and never with <code>&gt;=</code>.</li>" +
            "<li>Subtract the sum of ALL the weights from the winner's accumulator, and only from the winner's.</li>" +
            "</ul>" +
            "<p><code>chuoi(ten, n)</code> returns an array of <code>n</code> peer names for the group named <code>ten</code>, starting from a fresh state every call. <code>dem(ten, n)</code> counts how many requests each peer took over those <code>n</code>, keys sorted alphabetically, in the form <code>\"B1=6 B2=4 B3=2\"</code>. <code>chuKy(ten)</code> returns the sequence of exactly one period — the sum of the weights — joined by single spaces.</p>" +
            "<p>Keep the given data and the printing block exactly as they are, and do not install anything.</p>",

            "<p><b>Câu 31 — Cài đặt phép chọn máy của bộ cân bằng tải, từng request một (chương 9).</b> Nginx KHÔNG phát lưu lượng có trọng số theo lô: <code>weight=3</code> không có nghĩa là ba cái liền nhau. Nó chạy vòng tròn có trọng số kiểu MƯỢT, thứ giữ đúng tỉ lệ trọn một chu kỳ trong khi rải máy nặng ra khắp chu kỳ ấy. Hãy cài đặt nó rồi tái hiện năm chuỗi có thật. Mọi dòng kết quả mong đợi bên dưới đều do chính nginx/1.27.5 thật sinh ra với <code>worker_processes 1</code>, mỗi dòng một khối upstream, mỗi khối mười hai request tuần tự.</p>" +
            "<p>Mỗi máy mang một <code>w</code> cố định và một bộ cộng dồn, khởi đầu bằng 0. Với MỘT request:</p>" +
            "<ul>" +
            "<li>Cộng <code>w</code> của từng máy vào bộ cộng dồn của chính nó — mọi máy, mọi lượt, theo thứ tự mảng.</li>" +
            "<li>Máy có bộ cộng dồn LỚN NHẤT phục vụ request. Hoà thì máy đứng trước trong mảng giữ lấy, nên hãy so bằng <code>&gt;</code> chặt và đừng bao giờ dùng <code>&gt;=</code>.</li>" +
            "<li>Trừ TỔNG mọi trọng số khỏi bộ cộng dồn của máy thắng, và chỉ của máy thắng.</li>" +
            "</ul>" +
            "<p><code>chuoi(ten, n)</code> trả về mảng <code>n</code> tên máy cho nhóm tên <code>ten</code>, mỗi lần gọi đều bắt đầu lại từ trạng thái trắng. <code>dem(ten, n)</code> đếm mỗi máy nhận bao nhiêu request trong <code>n</code> lượt đó, khoá xếp theo bảng chữ cái, dạng <code>\"B1=6 B2=4 B3=2\"</code>. <code>chuKy(ten)</code> trả về chuỗi của ĐÚNG một chu kỳ — bằng tổng các trọng số — nối bằng một dấu cách.</p>" +
            "<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không cài thêm thư viện nào.</p>",
          ),
          starterCode:
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "// Năm khối upstream đã chạy thật trên nginx/1.27.5 với worker_processes 1.\n" +
            "const NHOM = {\n" +
            "  w111: [{ ten: 'B1', w: 1 }, { ten: 'B2', w: 1 }, { ten: 'B3', w: 1 }],\n" +
            "  w41:  [{ ten: 'B1', w: 4 }, { ten: 'B2', w: 1 }],\n" +
            "  w51:  [{ ten: 'B1', w: 5 }, { ten: 'B2', w: 1 }],\n" +
            "  w321: [{ ten: 'B1', w: 3 }, { ten: 'B2', w: 2 }, { ten: 'B3', w: 1 }],\n" +
            "  w432: [{ ten: 'B1', w: 4 }, { ten: 'B2', w: 3 }, { ten: 'B3', w: 2 }],\n" +
            "};\n" +
            "const TEN_NHOM = ['w111', 'w41', 'w51', 'w321', 'w432'];\n" +
            "\n" +
            "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
            "\n" +
            "function chuoi(ten, n) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function dem(ten, n) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function chuKy(ten) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "for (const t of TEN_NHOM) {\n" +
            "  console.log(t.padEnd(5), chuoi(t, 12).join(' '));\n" +
            "}\n" +
            "for (const t of TEN_NHOM) {\n" +
            "  console.log(t.padEnd(5), 'chuky=[' + chuKy(t) + ']', dem(t, 12));\n" +
            "}",
          expectedOutput:
            "w111  B1 B2 B3 B1 B2 B3 B1 B2 B3 B1 B2 B3\n" +
            "w41   B1 B1 B2 B1 B1 B1 B1 B2 B1 B1 B1 B1\n" +
            "w51   B1 B1 B1 B2 B1 B1 B1 B1 B1 B2 B1 B1\n" +
            "w321  B1 B2 B1 B3 B2 B1 B1 B2 B1 B3 B2 B1\n" +
            "w432  B1 B2 B3 B1 B2 B1 B3 B2 B1 B1 B2 B3\n" +
            "w111  chuky=[B1 B2 B3] B1=4 B2=4 B3=4\n" +
            "w41   chuky=[B1 B1 B2 B1 B1] B1=10 B2=2\n" +
            "w51   chuky=[B1 B1 B1 B2 B1 B1] B1=10 B2=2\n" +
            "w321  chuky=[B1 B2 B1 B3 B2 B1] B1=6 B2=4 B3=2\n" +
            "w432  chuky=[B1 B2 B3 B1 B2 B1 B3 B2 B1] B1=5 B2=4 B3=3",
          sampleSolution:
            "function chuoi(ten, n) {\n" +
            "  const may = NHOM[ten].map((m) => ({ ten: m.ten, w: m.w, hien: 0 }));\n" +
            "  const tong = may.reduce((s, m) => s + m.w, 0);\n" +
            "  const ra = [];\n" +
            "  for (let i = 0; i < n; i++) {\n" +
            "    let chon = null;\n" +
            "    for (const m of may) {\n" +
            "      m.hien += m.w;\n" +
            "      if (!chon || m.hien > chon.hien) chon = m;\n" +
            "    }\n" +
            "    chon.hien -= tong;\n" +
            "    ra.push(chon.ten);\n" +
            "  }\n" +
            "  return ra;\n" +
            "}\n" +
            "\n" +
            "function dem(ten, n) {\n" +
            "  const d = {};\n" +
            "  for (const t of chuoi(ten, n)) d[t] = (d[t] || 0) + 1;\n" +
            "  return Object.keys(d).sort().map((k) => k + '=' + d[k]).join(' ');\n" +
            "}\n" +
            "\n" +
            "function chuKy(ten) {\n" +
            "  const tong = NHOM[ten].reduce((s, m) => s + m.w, 0);\n" +
            "  return chuoi(ten, tong).join(' ');\n" +
            "}",
          rubric: RUBRIC_CODE,
        }),
        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            "<p><b>Q32 — Turn access-log lines into causes (chapters 10 and 11).</b> A status code alone does not name a cause: two of the lines below are 502 and they mean opposite things, and one 200 never touched the backend at all. The upstream fields are what separate them. Implement the classifier. All twelve lines are verbatim output of the real nginx/1.27.5 log format printed above the data — nothing was edited.</p>" +
            "<p><code>doc(dong)</code> splits a line on <code>|</code>: the first six fields are method, <code>$uri</code>, <code>$request_uri</code>, status, <code>$body_bytes_sent</code>, <code>$bytes_sent</code>; every field after that is <code>name=value</code>. Nginx writes a bare <code>-</code> for any variable that is unset, so <code>-</code> means \"nothing happened\", not \"zero\".</p>" +
            "<p><code>soLanThu(d)</code> counts the upstream ATTEMPTS: <code>$upstream_addr</code> holds one comma-separated entry per attempt, so count the entries that contain a colon — a value with no colon is the NAME of the upstream block, which means no peer was contacted — and return 0 when the field is <code>-</code>.</p>" +
            "<p><code>nguyenNhan(d)</code> returns the first label that applies, in this order:</p>" +
            "<ul>" +
            "<li>413 → <code>'than-qua-lon'</code> · 499 → <code>'client-bo-di'</code> · 504 → <code>'upstream-cham'</code></li>" +
            "<li>502 → <code>'upstream-tu-choi'</code> when <code>$upstream_addr</code> contains a colon, otherwise <code>'khong-con-may-nao-song'</code></li>" +
            "<li><code>$upstream_cache_status</code> is <code>HIT</code> → <code>'bo-dem-tra'</code></li>" +
            "<li><code>$upstream_addr</code> is <code>-</code> → <code>'khong-co-tep'</code> for a 404 and <code>'nginx-tu-tra'</code> for anything else</li>" +
            "<li>otherwise → <code>'upstream-tra'</code></li>" +
            "</ul>" +
            "<p><code>phanLoai(dong)</code> returns <code>{ ma, thu, nn }</code>. <code>demNguyenNhan(ds)</code> returns one string counting the labels, keys sorted alphabetically, in the form <code>\"bo-dem-tra=1 client-bo-di=1\"</code>.</p>" +
            "<p>Keep the given data and the printing block exactly as they are, and do not install anything.</p>",

            "<p><b>Câu 32 — Biến dòng access log thành nguyên nhân (chương 10 và 11).</b> Riêng một mã trạng thái thì không gọi tên được nguyên nhân: hai trong số các dòng dưới đây đều là 502 mà ý nghĩa ngược nhau, và có một mã 200 chưa hề chạm tới backend. Chính mấy trường upstream mới phân biệt được chúng. Hãy cài đặt bộ phân loại. Cả mười hai dòng đều là đầu ra nguyên văn của nginx/1.27.5 thật với đúng định dạng log in ngay trên phần dữ liệu — không sửa một ký tự nào.</p>" +
            "<p><code>doc(dong)</code> tách một dòng theo dấu <code>|</code>: sáu trường đầu là phương thức, <code>$uri</code>, <code>$request_uri</code>, mã trạng thái, <code>$body_bytes_sent</code>, <code>$bytes_sent</code>; mọi trường sau đó có dạng <code>tên=giá trị</code>. Nginx ghi một dấu <code>-</code> trơ cho biến nào không được đặt, nên <code>-</code> nghĩa là \"không có chuyện đó xảy ra\", chứ không phải \"bằng không\".</p>" +
            "<p><code>soLanThu(d)</code> đếm số LƯỢT THỬ lên upstream: <code>$upstream_addr</code> giữ mỗi lượt thử một mục, ngăn nhau bằng dấu phẩy, nên hãy đếm những mục CÓ dấu hai chấm — một giá trị không có dấu hai chấm là TÊN của khối upstream, nghĩa là không máy nào được liên hệ cả — và trả về 0 khi trường đó là <code>-</code>.</p>" +
            "<p><code>nguyenNhan(d)</code> trả về nhãn đầu tiên khớp được, theo đúng thứ tự này:</p>" +
            "<ul>" +
            "<li>413 → <code>'than-qua-lon'</code> · 499 → <code>'client-bo-di'</code> · 504 → <code>'upstream-cham'</code></li>" +
            "<li>502 → <code>'upstream-tu-choi'</code> khi <code>$upstream_addr</code> có dấu hai chấm, còn lại là <code>'khong-con-may-nao-song'</code></li>" +
            "<li><code>$upstream_cache_status</code> là <code>HIT</code> → <code>'bo-dem-tra'</code></li>" +
            "<li><code>$upstream_addr</code> là <code>-</code> → <code>'khong-co-tep'</code> với mã 404 và <code>'nginx-tu-tra'</code> với mọi mã khác</li>" +
            "<li>còn lại → <code>'upstream-tra'</code></li>" +
            "</ul>" +
            "<p><code>phanLoai(dong)</code> trả về <code>{ ma, thu, nn }</code>. <code>demNguyenNhan(ds)</code> trả về MỘT chuỗi đếm các nhãn, khoá xếp theo bảng chữ cái, dạng <code>\"bo-dem-tra=1 client-bo-di=1\"</code>.</p>" +
            "<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không cài thêm thư viện nào.</p>",
          ),
          starterCode:
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "// Mười hai dòng access log THẬT, chép nguyên văn từ nginx/1.27.5. Định dạng:\n" +
            "// log_format do '$request_method|$uri|$request_uri|$status|$body_bytes_sent|$bytes_sent'\n" +
            "//               '|us=$upstream_status|ua=$upstream_addr|urt=$upstream_response_time'\n" +
            "//               '|rt=$request_time|ucs=$upstream_cache_status|q=$args|ref=$http_referer';\n" +
            "const DONG = [\n" +
            "  'GET|/tinh/co.txt|/tinh/co.txt|200|6|241|us=-|ua=-|urt=-|rt=0.000|ucs=-|q=-|ref=-',\n" +
            "  'GET|/tinh/thieu.txt|/tinh/thieu.txt|404|153|308|us=-|ua=-|urt=-|rt=0.000|ucs=-|q=-|ref=-',\n" +
            "  'GET|/api/ok|/api/ok?x=1|200|18|174|us=200|ua=192.168.65.254:9201|urt=0.001|rt=0.001|ucs=-|q=x=1|ref=-',\n" +
            "  'GET|/dead/|/dead/|502|157|314|us=502|ua=127.0.0.1:9298|urt=0.000|rt=0.000|ucs=-|q=-|ref=-',\n" +
            "  'GET|/api/cham|/api/cham?slp=5000|504|167|329|us=504, 504|ua=192.168.65.254:9201, 192.168.65.254:9202|urt=2.007, 2.010|rt=4.017|ucs=-|q=slp=5000|ref=-',\n" +
            "  'POST|/up/big|/up/big|413|183|348|us=-|ua=-|urt=-|rt=0.003|ucs=-|q=-|ref=-',\n" +
            "  'GET|/api/cham|/api/cham?slp=4000|502|157|314|us=502|ua=hai|urt=0.000|rt=0.000|ucs=-|q=slp=4000|ref=-',\n" +
            "  'GET|/rd/|/rd/|301|169|377|us=-|ua=-|urt=-|rt=0.000|ucs=-|q=-|ref=-',\n" +
            "  'GET|/api/cham|/api/cham?slp=4000&m=1789039430|499|0|0|us=-|ua=192.168.65.254:9202|urt=1.006|rt=1.005|ucs=-|q=slp=4000&m=1789039430|ref=-',\n" +
            "  'GET|/cache/t|/cache/t?m=1789039454|200|18|174|us=200|ua=192.168.65.254:9201|urt=0.005|rt=0.005|ucs=MISS|q=m=1789039454|ref=-',\n" +
            "  'GET|/cache/t|/cache/t?m=1789039454|200|18|174|us=-|ua=-|urt=-|rt=0.000|ucs=HIT|q=m=1789039454|ref=-',\n" +
            "  'GET|/tinh/co.txt|/tinh/co.txt|200|6|241|us=-|ua=-|urt=-|rt=0.000|ucs=-|q=-|ref=https://vidu.test/trang',\n" +
            "];\n" +
            "\n" +
            "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
            "\n" +
            "function doc(dong) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function soLanThu(d) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function nguyenNhan(d) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function phanLoai(dong) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function demNguyenNhan(ds) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "for (const l of DONG) {\n" +
            "  const r = phanLoai(l);\n" +
            "  console.log(String(r.ma).padEnd(4), 'thu=' + r.thu, r.nn);\n" +
            "}\n" +
            "console.log('demNguyenNhan:', demNguyenNhan(DONG));",
          expectedOutput:
            "200  thu=0 nginx-tu-tra\n" +
            "404  thu=0 khong-co-tep\n" +
            "200  thu=1 upstream-tra\n" +
            "502  thu=1 upstream-tu-choi\n" +
            "504  thu=2 upstream-cham\n" +
            "413  thu=0 than-qua-lon\n" +
            "502  thu=0 khong-con-may-nao-song\n" +
            "301  thu=0 nginx-tu-tra\n" +
            "499  thu=1 client-bo-di\n" +
            "200  thu=1 upstream-tra\n" +
            "200  thu=0 bo-dem-tra\n" +
            "200  thu=0 nginx-tu-tra\n" +
            "demNguyenNhan: bo-dem-tra=1 client-bo-di=1 khong-co-tep=1 khong-con-may-nao-song=1 nginx-tu-tra=3 than-qua-lon=1 upstream-cham=1 upstream-tra=2 upstream-tu-choi=1",
          sampleSolution:
            "function doc(dong) {\n" +
            "  const p = dong.split('|');\n" +
            "  const truong = {};\n" +
            "  for (const o of p.slice(6)) {\n" +
            "    const i = o.indexOf('=');\n" +
            "    truong[o.slice(0, i)] = o.slice(i + 1);\n" +
            "  }\n" +
            "  return {\n" +
            "    pt: p[0], uri: p[1], ru: p[2],\n" +
            "    ma: Number(p[3]), bbs: Number(p[4]), bs: Number(p[5]),\n" +
            "    us: truong.us, ua: truong.ua, urt: truong.urt, rt: Number(truong.rt), ucs: truong.ucs,\n" +
            "  };\n" +
            "}\n" +
            "\n" +
            "function soLanThu(d) {\n" +
            "  if (d.ua === '-') return 0;\n" +
            "  return d.ua.split(',').filter((x) => x.includes(':')).length;\n" +
            "}\n" +
            "\n" +
            "function nguyenNhan(d) {\n" +
            "  if (d.ma === 413) return 'than-qua-lon';\n" +
            "  if (d.ma === 499) return 'client-bo-di';\n" +
            "  if (d.ma === 504) return 'upstream-cham';\n" +
            "  if (d.ma === 502) return d.ua.includes(':') ? 'upstream-tu-choi' : 'khong-con-may-nao-song';\n" +
            "  if (d.ucs === 'HIT') return 'bo-dem-tra';\n" +
            "  if (d.ua === '-') return d.ma === 404 ? 'khong-co-tep' : 'nginx-tu-tra';\n" +
            "  return 'upstream-tra';\n" +
            "}\n" +
            "\n" +
            "function phanLoai(dong) {\n" +
            "  const d = doc(dong);\n" +
            "  return { ma: d.ma, thu: soLanThu(d), nn: nguyenNhan(d) };\n" +
            "}\n" +
            "\n" +
            "function demNguyenNhan(ds) {\n" +
            "  const d = {};\n" +
            "  for (const l of ds) { const k = phanLoai(l).nn; d[k] = (d[k] || 0) + 1; }\n" +
            "  return Object.keys(d).sort().map((k) => k + '=' + d[k]).join(' ');\n" +
            "}",
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
