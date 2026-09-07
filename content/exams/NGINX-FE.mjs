/**
 * Nginx — Final Exam (FE): 50 câu trắc nghiệm phủ cả 12 mục (s00–s11).
 *
 * Đề tự soạn, bám sát `content/courses/nginx/s00…s11`. Có cả câu lý thuyết lẫn
 * câu đọc terminal; MỌI đoạn output, mã trạng thái, dòng error log và số đo
 * thời gian trong đề đều CHẠY THẬT trên **nginx 1.27.5 (nginx:1.27-alpine,
 * linux/arm64, Docker Engine 29.5.3)**, một vài chỗ đối chiếu thêm với
 * **nginx 1.24.0 (nginx:1.24-alpine)** — chính là bản mà giáo trình dùng.
 *
 * ⚠️ BỐN CHỖ MÁY KHÁC (hoặc BỔ SUNG) GIÁO TRÌNH, đã đo lại và ĐỀ THEO MÁY:
 *
 *   • Giáo trình viết `listen 443 ssl http2;` ở vài chỗ và `http2 on;` ở vài
 *     chỗ khác. Trên **1.27.5** dạng cũ vẫn chạy nhưng `nginx -t` in
 *     `[warn] the "listen ... http2" directive is deprecated, use the "http2"
 *     directive instead`; trên **1.24.0** thì im lặng. Quan trọng hơn: đo thật
 *     hai bản cho thấy chúng KHÁC NHAU VỀ HÀNH VI, không chỉ về cú pháp — với
 *     `listen ... http2` trên 1.24, một server block thứ hai trên cùng cổng
 *     KHÔNG khai http2 vẫn được phục vụ bằng HTTP/2 (đo: `ver=2`), còn với
 *     `http2 on;` trên 1.27 thì server thứ hai ở lại HTTP/1.1 (đo: `ver=1.1`).
 *     Đề hỏi đúng khác biệt đo được đó, và dùng cú pháp mới.
 *
 *   • Giáo trình không nói `limit_req` có thể KHÔNG BAO GIỜ chạy. Đo thật:
 *     `location /x { limit_req zone=z; return 200 "ok"; }` với rate=1r/m cho
 *     ra 4/4 lần 200 — vì `return` thuộc module rewrite và chạy ở pha TRƯỚC
 *     pha preaccess nơi `limit_req` sống. Đổi content handler thành một tệp
 *     tĩnh, cùng zone đó lập tức ra `200 503 503 503`. Đề có một câu về đúng
 *     chỗ này (câu 31) vì đây là cái bẫy tự-kiểm-tra kinh điển.
 *
 *   • Giáo trình (0.2) nói cây tiến trình là một master nhiều worker. Đúng,
 *     nhưng con số thì theo máy: `worker_processes auto` trên máy đo cho **6**
 *     worker, master chạy `root` còn worker chạy user `nginx`. Đề chỉ hỏi VAI
 *     TRÒ và QUYỀN, không hỏi con số.
 *
 *   • `worker_processes` mặc định trong ảnh chính thức đã là `auto`, nên
 *     trạng thái round-robin của một khối `upstream` KHÔNG dùng chung giữa các
 *     worker: đo 6 request tuần tự qua 6 worker cho ra `b1 b1 b1 b1 b1 b1`.
 *     Ép `worker_processes 1;` mới ra `b1 b2 b3 b1 b2 b3`. Đề dùng bản một
 *     worker cho các câu cân bằng tải và nói rõ điều đó trong đề bài.
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 12 · B 13 · C 13 · D 12.
 *   node -e "import('./content/exams/NGINX-FE.mjs').then(m=>{const d={};m.default.exams[0].questions.forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Số câu mỗi chương: Mục 0 → 3 · Ch1 → 4 · Ch2 → 5 · Ch3 → 5 · Ch4 → 4 ·
 * Ch5 → 4 · Ch6 → 4 · Ch7 → 4 · Ch8 → 4 · Ch9 → 4 · Ch10 → 4 · Ch11 → 5.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NGINX-FE.mjs --apply
 */
import { B, EX, code, c, mcq } from './_lib/nginx-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all twelve chapters, from "what a worker process actually is" to "a clean <code>nginx -t</code> is not a working site". Many questions show a real terminal transcript and ask you to explain it; every one of those outputs came from actually running the command against nginx 1.27.5, so read the transcript rather than the intuition.</p>' +
  '<p>Three habits pay off here. First, ask which block won, not which block you meant: prefix locations compete on length, <code>^~</code> stops the regex round, and a regex beats a longer plain prefix. Second, watch the trailing slash — on <code>alias</code> and on <code>proxy_pass</code> it decides whether a path is passed through or rewritten, and one missing slash is a directory traversal. Third, remember that Nginx list directives such as <code>add_header</code> and <code>proxy_set_header</code> are <em>replaced</em> by a child block, never merged with it.</p>' +
  '<p>You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả mười hai mục, từ "một tiến trình thợ thật ra là cái gì" tới "một lệnh <code>nginx -t</code> sạch không có nghĩa là trang web chạy được". Nhiều câu cho sẵn một đoạn terminal thật rồi hỏi bạn giải thích nó; mọi đoạn output loại đó đều lấy từ việc chạy thật câu lệnh trên nginx 1.27.5, nên hãy đọc đoạn terminal thay vì đoán theo cảm tính.</p>' +
  '<p>Ba thói quen giúp ích ở đây. Một, hãy hỏi khối nào ĐÃ THẮNG chứ không phải khối nào bạn ĐỊNH cho thắng: location tiền tố đua nhau bằng ĐỘ DÀI, <code>^~</code> chặn luôn vòng regex, và một regex thắng cả một tiền tố dài hơn. Hai, để mắt tới dấu gạch chéo cuối — ở <code>alias</code> và ở <code>proxy_pass</code> nó quyết định đường dẫn được đưa nguyên si hay bị viết lại, và thiếu đúng một dấu là thành một lỗ đi ngược thư mục. Ba, nhớ rằng các chỉ thị dạng danh sách như <code>add_header</code> và <code>proxy_set_header</code> bị khối con THAY THẾ, chứ không bao giờ được gộp thêm.</p>' +
  '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'nginx' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Final Exam — the whole Nginx course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá Nginx (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all twelve chapters: the process model and the first working config, how a request finds a server block, which location wins, reverse proxying and the headers that reach your application, static files and compression, caching in front of the app, TLS and HTTP/2, rate and size limits, rewriting and mapping, load balancing, logs and observability, and a method for diagnosing a configuration that lies to you.',
        'Năm mươi câu trắc nghiệm phủ cả mười hai mục: mô hình tiến trình và tệp cấu hình đầu tiên chạy được, một request tìm ra khối server bằng cách nào, location nào thắng, proxy ngược và những header thật sự tới được ứng dụng, tệp tĩnh và nén, bộ đệm đặt trước ứng dụng, TLS và HTTP/2, giới hạn tần suất và kích thước, viết lại và ánh xạ, cân bằng tải, log và quan sát, và một phương pháp chẩn đoán khi cấu hình nói dối bạn.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [

        /* ── Mục 0 — bài toán, cài đặt, cấu hình đầu tiên (3 câu) ────────── */

        // q1 · đáp án 0
        mcq({
          prompt: B(
            'A running Nginx shows this process tree. Which line describes the split correctly?' + code(
              '$ ps -o pid,ppid,user,args\n' +
              'PID   PPID  USER     COMMAND\n' +
              '    1     0 root     nginx: master process nginx -g daemon off;\n' +
              '   21     1 nginx    nginx: worker process\n' +
              '   22     1 nginx    nginx: worker process\n' +
              '   ...  (six workers in total)',
            ),
            'Một Nginx đang chạy cho ra cây tiến trình này. Dòng nào mô tả ĐÚNG sự phân vai?' + code(
              '$ ps -o pid,ppid,user,args\n' +
              'PID   PPID  USER     COMMAND\n' +
              '    1     0 root     nginx: master process nginx -g daemon off;\n' +
              '   21     1 nginx    nginx: worker process\n' +
              '   22     1 nginx    nginx: worker process\n' +
              '   ...  (tổng cộng sáu worker)',
            ),
          ),
          options: [
            B(
              'The master runs as root only to bind privileged ports and read keys, then hands every request to unprivileged workers; the six comes from <code>worker_processes auto</code> matching the CPU count',
              'Master chạy quyền root chỉ để chiếm cổng đặc quyền và đọc khoá, rồi giao mọi request cho các worker không đặc quyền; con số sáu tới từ <code>worker_processes auto</code> khớp số CPU',
            ),
            B(
              'The master handles the requests and the workers only watch it, restarting it if it dies; six is a fixed default that Nginx ships with regardless of the machine',
              'Master xử lý request còn worker chỉ canh chừng nó, khởi động lại nếu nó chết; sáu là con số mặc định cố định Nginx phát hành bất kể máy nào',
            ),
            B(
              'Each worker serves exactly one connection at a time, so six workers means a ceiling of six concurrent clients on this machine',
              'Mỗi worker phục vụ đúng một kết nối tại một thời điểm, nên sáu worker nghĩa là trần sáu client đồng thời trên máy này',
            ),
            B(
              'The workers run as <code>nginx</code> because the config said so; without a <code>user</code> directive they would inherit root, which is the normal production setup',
              'Các worker chạy dưới <code>nginx</code> vì cấu hình khai như vậy; không có chỉ thị <code>user</code> thì chúng thừa hưởng root, và đó mới là bố cục production bình thường',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The split is the whole security story of Nginx. Only the master needs root, and only for two things: binding ports below 1024 and opening private key files at startup. Every byte a client sends is then handled by a worker running as an unprivileged user, so a bug in request parsing does not become a root compromise. The count comes from ' + c('worker_processes auto') + ', which resolves to the number of CPUs the process can see — six on the machine this exam was measured on. Option 2 inverts the roles: the master accepts no requests at all. Option 3 confuses processes with threads — the entire point of the event loop is that one worker holds thousands of connections at once, bounded by ' + c('worker_connections') + ' (1024 by default), not by one. Option 4 gets the direction backwards: dropping privileges is the safe default, and the official image sets ' + c('user nginx;') + ' precisely so no worker keeps root.',
            'Sự phân vai này chính là toàn bộ câu chuyện an toàn của Nginx. Chỉ master cần quyền root, và chỉ cần cho hai việc: chiếm các cổng dưới 1024 và mở tệp khoá riêng lúc khởi động. Sau đó mọi byte client gửi lên đều do một worker chạy dưới người dùng KHÔNG đặc quyền xử lý, nên một lỗi trong khâu phân tích request không biến thành một cú chiếm quyền root. Con số worker tới từ ' + c('worker_processes auto') + ', nó phân giải thành số CPU mà tiến trình nhìn thấy — bằng sáu trên máy đo đề này. Phương án 2 đảo ngược vai trò: master không nhận request nào cả. Phương án 3 lẫn tiến trình với luồng — điểm mấu chốt của vòng lặp sự kiện đúng là một worker giữ hàng nghìn kết nối cùng lúc, bị chặn bởi ' + c('worker_connections') + ' (mặc định 1024) chứ không phải bởi con số một. Phương án 4 hiểu ngược chiều: hạ đặc quyền mới là mặc định an toàn, và ảnh chính thức đặt ' + c('user nginx;') + ' đúng để không worker nào còn giữ root.',
          ),
        }),

        // q2 · đáp án 2
        mcq({
          prompt: B(
            'You edit the config and run <code>nginx -s reload</code> while the site is under load. What happens to a request that is already halfway through being served?',
            'Bạn sửa cấu hình rồi chạy <code>nginx -s reload</code> trong lúc site đang có tải. Chuyện gì xảy ra với một request đang phục vụ dở?',
          ),
          options: [
            B(
              'It is aborted with a 499; a reload is a restart, so clients in flight always lose their connection and must retry',
              'Nó bị huỷ với mã 499; nạp lại là khởi động lại, nên client đang dở luôn mất kết nối và phải thử lại',
            ),
            B(
              'It is served with the NEW configuration, because the reload swaps the running config inside each worker before the response is finished',
              'Nó được phục vụ bằng cấu hình MỚI, vì lượt nạp lại tráo cấu hình đang chạy ngay bên trong từng worker trước khi response kết thúc',
            ),
            B(
              'It finishes on the OLD configuration: the master starts new workers with the new config and tells the old ones to stop accepting, then to exit once their in-flight requests are done',
              'Nó chạy hết trên cấu hình CŨ: master dựng worker mới với cấu hình mới rồi bảo worker cũ ngừng nhận, và thoát khi các request đang dở đã xong',
            ),
            B(
              'Nothing happens at all until the next restart, because <code>-s reload</code> only validates the file and writes the result to the error log',
              'Chẳng có gì xảy ra cho tới lần khởi động lại kế tiếp, vì <code>-s reload</code> chỉ kiểm tệp rồi ghi kết quả vào error log',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A reload is a handover, not a restart, and that is why it is safe to run on a live edge server. The master re-reads the configuration, and if it parses, forks a fresh set of workers using it. The old workers are told to stop accepting new connections; they keep serving what they already have and exit when the last one drains. So a request that started before the reload finishes under the old rules, and the request after it uses the new ones — nobody sees a 499 and nobody sees a half-applied config. The two failure modes worth knowing: if the new config does <em>not</em> parse, the master logs the error and keeps the old workers, so the site stays up on the old config (which is why a "successful" reload command still deserves a <code>curl</code> check); and a long-lived connection such as a WebSocket can keep an old worker alive for hours, which is what <code>worker_shutdown_timeout</code> bounds. Options 1 and 2 both assume the config can change under a request, which never happens.',
            'Nạp lại là một cuộc BÀN GIAO, không phải một lần khởi động lại, và đó là lý do chạy nó trên máy chủ biên đang sống vẫn an toàn. Master đọc lại cấu hình, nếu phân tích được thì tách ra một bộ worker mới dùng cấu hình đó. Các worker cũ được bảo ngừng nhận kết nối mới; chúng vẫn phục vụ nốt những gì đang cầm và thoát khi cái cuối cùng chảy hết. Vậy nên một request bắt đầu TRƯỚC lượt nạp lại sẽ kết thúc theo luật CŨ, còn request sau nó dùng luật mới — không ai thấy 499 và không ai thấy một cấu hình áp dụng nửa vời. Hai kiểu hỏng đáng nhớ: nếu cấu hình mới KHÔNG phân tích được, master ghi lỗi và GIỮ NGUYÊN worker cũ, nên site vẫn sống trên cấu hình cũ (chính vì thế một lệnh nạp lại "thành công" vẫn đáng phải kiểm lại bằng <code>curl</code>); và một kết nối sống lâu như WebSocket có thể giữ một worker cũ sống hàng giờ, và đó là thứ mà <code>worker_shutdown_timeout</code> chặn lại. Phương án 1 và 2 đều giả định cấu hình có thể đổi NGAY GIỮA một request, chuyện không bao giờ xảy ra.',
          ),
        }),

        // q3 · đáp án 1
        mcq({
          prompt: B(
            'Why does one Nginx worker hold ten thousand idle connections comfortably, while a thread-per-connection server on the same box falls over?',
            'Vì sao MỘT worker của Nginx ôm mười nghìn kết nối rảnh một cách thong dong, trong khi một máy chủ mỗi-kết-nối-một-luồng trên cùng cái máy thì sập?',
          ),
          options: [
            B(
              'Nginx compresses idle connections in memory and only expands them when a byte arrives, so an idle connection costs almost nothing',
              'Nginx nén các kết nối rảnh trong bộ nhớ và chỉ bung ra khi có byte tới, nên một kết nối rảnh gần như không tốn gì',
            ),
            B(
              'An idle connection in Nginx is a small struct in one event loop, not a stack and a scheduler entry; the cost of waiting is paid once per worker instead of once per connection',
              'Một kết nối rảnh trong Nginx là một struct nhỏ trong một vòng lặp sự kiện, không phải một ngăn xếp và một suất trong bộ lập lịch; cái giá của việc CHỜ trả một lần cho mỗi worker thay vì một lần cho mỗi kết nối',
            ),
            B(
              'Nginx runs the workers at a higher scheduling priority, so the kernel gives them more time slices than the threads of the other server',
              'Nginx chạy worker ở mức ưu tiên lập lịch cao hơn, nên nhân cấp cho chúng nhiều lát thời gian hơn các luồng của máy chủ kia',
            ),
            B(
              'Nginx keeps no state for an idle connection at all — it closes the socket and reopens it from the client cookie when the next request arrives',
              'Nginx không giữ trạng thái nào cho kết nối rảnh — nó đóng socket rồi mở lại từ cookie của client khi request kế tiếp tới',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The saving is structural, not clever. A thread-per-connection server pays for every waiting client twice: a stack (megabytes of virtual memory, and real pages once touched) and a runnable entry the kernel scheduler has to consider. Ten thousand idle clients therefore cost ten thousand stacks and ten thousand context-switch candidates. Nginx instead keeps one small structure per connection in a single event loop, and asks the kernel <em>once</em> — through epoll or kqueue — which of those descriptors became readable. Waiting is free; only work costs. The consequence you must respect is the flip side of the same design: because one thread drives thousands of connections, <b>anything that blocks that thread blocks all of them</b>. That is why disk reads that could block are handed to a thread pool via <code>aio threads</code>, and why a third-party module doing synchronous I/O in a worker is a production hazard. Option 1 invents a compression mechanism. Option 3 confuses priority with concurrency model. Option 4 describes a protocol that does not exist.',
            'Cái tiết kiệm ở đây thuộc về CẤU TRÚC, không phải mẹo vặt. Một máy chủ mỗi-kết-nối-một-luồng trả giá hai lần cho từng client đang chờ: một ngăn xếp (hàng megabyte bộ nhớ ảo, và trang thật ngay khi bị chạm) và một suất chạy được mà bộ lập lịch của nhân phải cân nhắc. Mười nghìn client rảnh vì thế tốn mười nghìn ngăn xếp và mười nghìn ứng viên chuyển ngữ cảnh. Nginx thay vào đó giữ MỘT cấu trúc nhỏ cho mỗi kết nối trong một vòng lặp sự kiện duy nhất, và hỏi nhân MỘT LẦN — qua epoll hoặc kqueue — xem trong đám mô tả tệp đó cái nào vừa đọc được. Chờ thì miễn phí; chỉ có LÀM VIỆC mới tốn. Hệ quả bạn buộc phải tôn trọng là mặt kia của cùng một thiết kế: vì một luồng lái hàng nghìn kết nối, <b>bất cứ thứ gì chặn cái luồng đó là chặn tất cả chúng</b>. Đó là lý do những lượt đọc đĩa có thể chặn được giao cho một hồ luồng qua <code>aio threads</code>, và là lý do một module bên thứ ba làm vào-ra đồng bộ ngay trong worker là một mối nguy production. Phương án 1 bịa ra một cơ chế nén. Phương án 3 lẫn mức ưu tiên với mô hình đồng thời. Phương án 4 mô tả một giao thức không tồn tại.',
          ),
        }),

        /* ── Chương 1 — request tìm ra khối server (4 câu) ───────────────── */

        // q4 · đáp án 3
        mcq({
          prompt: B(
            'Four server blocks listen on :80 with these names. A request arrives with <code>Host: abc.example.com</code>. Which block serves it?' + code(
              'server { server_name www.example.com;         }   # A\n' +
              'server { server_name *.example.com;           }   # B\n' +
              'server { server_name www.example.*;           }   # C\n' +
              'server { server_name ~^a.+\\.example\\.com$;    }   # D',
            ),
            'Bốn khối server cùng nghe :80 với những cái tên này. Một request tới với <code>Host: abc.example.com</code>. Khối nào phục vụ nó?' + code(
              'server { server_name www.example.com;         }   # A\n' +
              'server { server_name *.example.com;           }   # B\n' +
              'server { server_name www.example.*;           }   # C\n' +
              'server { server_name ~^a.+\\.example\\.com$;    }   # D',
            ),
          ),
          options: [
            B(
              'D — a regular expression is the most specific form of name, so it is tried before any wildcard can claim the request',
              'D — biểu thức chính quy là dạng tên cụ thể nhất, nên nó được thử trước khi bất kỳ ký tự đại diện nào giành được request',
            ),
            B(
              'C — a trailing wildcard is checked before a leading one because the hostname is compared from the right',
              'C — ký tự đại diện đuôi được xét trước cái đầu, vì tên máy được so từ bên phải',
            ),
            B(
              'D, because it appears last in the file and later blocks override earlier ones for the same address and port',
              'D, vì nó nằm cuối tệp và khối sau ghi đè khối trước cho cùng địa chỉ và cổng',
            ),
            B(
              'B — the order is exact name, then leading wildcard, then trailing wildcard, then regex, and B matches at the second step, so D is never reached',
              'B — thứ tự là tên chính xác, rồi đại diện ĐẦU, rồi đại diện ĐUÔI, rồi regex, và B khớp ngay ở bước hai nên D không bao giờ được tới',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The four levels are fixed and have nothing to do with file order: an exact name first, then a leading wildcard such as ' + c('*.example.com') + ', then a trailing wildcard such as ' + c('www.example.*') + ', and only then the regular expressions, which are tried in the order they appear. ' + c('abc.example.com') + ' has no exact match, so the search moves to leading wildcards and B wins at the second step — the regex in D is never even evaluated, although it would have matched. Running exactly this config confirms it: the response comes from B. The practical lesson is that a regex ' + c('server_name') + ' is a weak claim, easy to shadow with a wildcard someone adds later, so it belongs to genuinely dynamic hostnames and not to "the specific one". Options 1 and 2 invert two of the levels; option 3 imports override-by-position from other config languages, which Nginx does not do — the only thing file order decides among server blocks is which one is the default for an address and port when no ' + c('default_server') + ' is marked.',
            'Bốn mức là cố định và không liên quan gì tới thứ tự trong tệp: tên CHÍNH XÁC trước, rồi đại diện ĐẦU kiểu ' + c('*.example.com') + ', rồi đại diện ĐUÔI kiểu ' + c('www.example.*') + ', và chỉ tới lúc đó mới tới các biểu thức chính quy, được thử theo thứ tự xuất hiện. ' + c('abc.example.com') + ' không có tên khớp chính xác, nên cuộc tìm chuyển sang đại diện đầu và B thắng ngay ở bước hai — cái regex ở D thậm chí không được đem ra tính, dù nó vốn cũng khớp. Chạy thật đúng cấu hình này xác nhận điều đó: câu trả lời tới từ B. Bài học thực dụng là một ' + c('server_name') + ' dạng regex là một tuyên bố YẾU, dễ bị che bởi một ký tự đại diện ai đó thêm vào sau, nên nó dành cho những tên máy thật sự động chứ không dành cho "cái cụ thể". Phương án 1 và 2 đảo hai mức; phương án 3 bê quy tắc ghi-đè-theo-vị-trí từ những ngôn ngữ cấu hình khác vào, thứ Nginx không làm — điều duy nhất thứ tự tệp quyết định giữa các khối server là khối nào làm mặc định cho một cặp địa chỉ và cổng khi không có ' + c('default_server') + ' nào được đánh dấu.',
          ),
        }),

        // q5 · đáp án 1
        mcq({
          prompt: B(
            'This config was measured with two probes. Explain both lines.' + code(
              'server { listen 80 default_server; server_name catchall; ... }\n' +
              'server { listen 80; server_name ""; ... }\n' +
              '\n' +
              '$ curl -s -H \'Host: nope.test\' http://edge/\n' +
              'DEFAULT host=nope.test\n' +
              '$ printf \'GET / HTTP/1.0\\r\\n\\r\\n\' | nc edge 80 | tail -1\n' +
              'EMPTY-SERVER-NAME',
            ),
            'Cấu hình này đã được đo bằng hai phép thử. Hãy giải thích cả hai dòng.' + code(
              'server { listen 80 default_server; server_name catchall; ... }\n' +
              'server { listen 80; server_name ""; ... }\n' +
              '\n' +
              '$ curl -s -H \'Host: nope.test\' http://edge/\n' +
              'DEFAULT host=nope.test\n' +
              '$ printf \'GET / HTTP/1.0\\r\\n\\r\\n\' | nc edge 80 | tail -1\n' +
              'EMPTY-SERVER-NAME',
            ),
          ),
          options: [
            B(
              'The second probe reached the empty-name block only because it used HTTP/1.0; on HTTP/1.1 both probes would land on the default server',
              'Phép thử thứ hai tới được khối tên rỗng chỉ vì nó dùng HTTP/1.0; với HTTP/1.1 thì cả hai phép thử đều rơi vào máy chủ mặc định',
            ),
            B(
              'An unmatched Host falls to the block marked <code>default_server</code>, while <code>server_name ""</code> matches requests that carry no Host header at all — two different misses, two different blocks',
              'Một Host không khớp rơi vào khối được đánh dấu <code>default_server</code>, còn <code>server_name ""</code> khớp những request KHÔNG mang header Host nào cả — hai kiểu trượt khác nhau, hai khối khác nhau',
            ),
            B(
              'Both probes hit the default server; the second output differs only because <code>$host</code> is empty and the block prints a different string for it',
              'Cả hai phép thử đều trúng máy chủ mặc định; output thứ hai khác chỉ vì <code>$host</code> rỗng nên khối in ra một chuỗi khác',
            ),
            B(
              '<code>server_name ""</code> is a syntax error that Nginx silently ignores, so that block is unreachable and the second line must come from somewhere else',
              '<code>server_name ""</code> là lỗi cú pháp mà Nginx lặng lẽ bỏ qua, nên khối đó không với tới được và dòng thứ hai phải tới từ chỗ khác',
            ),
          ],
          correct: 1,
          explanation: EX(
            'There are two distinct kinds of miss and Nginx routes them to two distinct blocks. A request whose Host matches no ' + c('server_name') + ' goes to whichever block is marked ' + c('default_server') + ' for that address and port — if nobody is marked, the first block for that address and port becomes the default by position. A request with <em>no</em> Host header is a different case: the empty name ' + c('server_name ""') + ' exists exactly for it, and it wins over the default server. Both were measured against the config shown. Why this matters in production: the default server is what an IP scanner reaches when it connects by address with a random or absent Host, so leaving your real application as the default silently publishes it under every name that resolves to the box. The safe pattern is a deliberate default block that answers ' + c('return 444') + ' or a bare 404, and named blocks for everything you actually serve. Option 1 confuses the protocol version with the presence of the header; option 3 assumes one block answered both probes when the transcript shows two different bodies; option 4 is simply false — the empty name is valid and documented.',
            'Có HAI kiểu trượt khác nhau và Nginx định tuyến chúng tới hai khối khác nhau. Một request có Host không khớp ' + c('server_name') + ' nào sẽ đi tới khối được đánh dấu ' + c('default_server') + ' cho cặp địa chỉ và cổng đó — nếu không ai được đánh dấu thì khối ĐẦU TIÊN của cặp đó thành mặc định theo vị trí. Một request KHÔNG có header Host lại là chuyện khác: cái tên rỗng ' + c('server_name ""') + ' tồn tại đúng cho nó, và nó thắng cả máy chủ mặc định. Cả hai đều đã được đo trên đúng cấu hình đưa ra. Vì sao điều này quan trọng trên production: máy chủ mặc định chính là thứ mà một con quét IP chạm tới khi nó kết nối bằng địa chỉ với Host tuỳ tiện hoặc không có, nên để ứng dụng thật của bạn làm mặc định là âm thầm công bố nó dưới MỌI cái tên trỏ về cái máy đó. Khuôn an toàn là một khối mặc định CÓ CHỦ ĐÍCH trả ' + c('return 444') + ' hoặc một 404 trơ, và các khối có tên cho mọi thứ bạn thật sự phục vụ. Phương án 1 lẫn phiên bản giao thức với sự CÓ MẶT của header; phương án 3 giả định một khối đã trả lời cả hai phép thử trong khi bản ghi cho thấy hai thân khác nhau; phương án 4 đơn giản là sai — tên rỗng hợp lệ và có ghi trong tài liệu.',
          ),
        }),

        // q6 · đáp án 0
        mcq({
          prompt: B(
            'This exchange was captured against a server with blocks for <code>www.example.com</code> and a default. What does it prove about <code>$host</code>?' + code(
              '$ printf \'GET http://www.example.com/ HTTP/1.1\\r\\n\'\\\n' +
              '         \'Host: nope.test\\r\\nConnection: close\\r\\n\\r\\n\' | nc edge 80\n' +
              '...\n' +
              'EXACT www',
            ),
            'Đoạn trao đổi này được bắt trên một máy chủ có khối cho <code>www.example.com</code> và một khối mặc định. Nó chứng minh điều gì về <code>$host</code>?' + code(
              '$ printf \'GET http://www.example.com/ HTTP/1.1\\r\\n\'\\\n' +
              '         \'Host: nope.test\\r\\nConnection: close\\r\\n\\r\\n\' | nc edge 80\n' +
              '...\n' +
              'EXACT www',
            ),
          ),
          options: [
            B(
              'The host in an absolute-form request line outranks the Host header, so the name Nginx routed on is attacker-controlled in two independent places',
              'Tên máy trong dòng request dạng tuyệt đối được ưu tiên HƠN header Host, nên cái tên Nginx định tuyến theo do kẻ tấn công điều khiển ở HAI chỗ độc lập',
            ),
            B(
              'Nginx rejected the ambiguous request and fell back to the first server block, which happens to be the one for <code>www.example.com</code>',
              'Nginx đã từ chối request nhập nhằng đó rồi lùi về khối server đầu tiên, mà khối đó tình cờ là khối của <code>www.example.com</code>',
            ),
            B(
              'The Host header is authoritative and <code>nope.test</code> matched <code>www.example.com</code> because Nginx compares names case-insensitively after stripping the port',
              'Header Host mới là thứ có thẩm quyền, và <code>nope.test</code> khớp <code>www.example.com</code> vì Nginx so tên không phân biệt hoa thường sau khi bỏ cổng',
            ),
            B(
              'Absolute-form request lines are HTTP/1.0 only; on HTTP/1.1 Nginx ignores the URI host entirely and this output must come from a caching layer',
              'Dòng request dạng tuyệt đối chỉ có ở HTTP/1.0; với HTTP/1.1 Nginx bỏ qua hẳn phần tên máy trong URI nên output này phải tới từ một tầng đệm nào đó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'HTTP allows the request line itself to carry an absolute URI, and when it does, RFC 7230 says that host wins over the Host header — Nginx implements exactly that, which is what the transcript shows: routing followed ' + c('www.example.com') + ' from the request line even though the Host header said something else. Both sources are client input, which is the entire point of the chapter: ' + c('$host') + ' is not a fact about your infrastructure, it is a string a stranger typed. Treat it accordingly — never build a security decision, a cache key or a database lookup on it unmodified, and if the value must be trustworthy, pin it with ' + c('proxy_set_header Host <literal>;') + ' or validate it against a ' + c('map') + ' of names you actually serve. The safe defaults follow from that too: a deliberate default server that answers nothing useful, and ' + c('$host') + ' rather than ' + c('$http_host') + ' when you do pass it on, because ' + c('$host') + ' is at least normalised to lower case with the port stripped. Options 2 and 4 invent behaviour, and option 3 has the precedence backwards while also claiming a match that never happened.',
            'HTTP cho phép chính dòng request mang một URI tuyệt đối, và khi nó mang, RFC 7230 nói rằng cái tên máy đó THẮNG header Host — Nginx cài đặt đúng như vậy, và đó là điều bản ghi cho thấy: việc định tuyến đi theo ' + c('www.example.com') + ' lấy từ dòng request dù header Host nói khác. Cả hai nguồn đều là ĐẦU VÀO CỦA CLIENT, và đó chính là toàn bộ ý của chương này: ' + c('$host') + ' không phải một sự thật về hạ tầng của bạn, nó là một chuỗi do người lạ gõ vào. Hãy đối xử với nó tương xứng — đừng bao giờ dựng một quyết định bảo mật, một khoá bộ đệm hay một truy vấn cơ sở dữ liệu trên nó khi chưa xử lý, và nếu giá trị đó buộc phải đáng tin thì ghim cứng bằng ' + c('proxy_set_header Host <tên literal>;') + ' hoặc kiểm nó với một ' + c('map') + ' các tên bạn thật sự phục vụ. Các mặc định an toàn cũng suy ra từ đó: một máy chủ mặc định có chủ đích không trả gì hữu ích, và dùng ' + c('$host') + ' thay vì ' + c('$http_host') + ' khi phải chuyển tiếp, vì ' + c('$host') + ' ít nhất đã được chuẩn hoá về chữ thường và bỏ phần cổng. Phương án 2 và 4 bịa ra hành vi, còn phương án 3 vừa hiểu ngược thứ tự ưu tiên vừa khẳng định một phép khớp chưa từng xảy ra.',
          ),
        }),

        // q7 · đáp án 2
        mcq({
          prompt: B(
            'Two configs, two runs of <code>nginx -t</code>. Why does one fail and the other only warn?' + code(
              '# config A\n' +
              'server { listen 80 default_server; server_name a; }\n' +
              'server { listen 80 default_server; server_name b; }\n' +
              '  -> [emerg] a duplicate default server for 0.0.0.0:80 ... test failed\n' +
              '\n' +
              '# config B\n' +
              'server { listen 80; server_name dup.test; }\n' +
              'server { listen 80; server_name dup.test; }\n' +
              '  -> [warn] conflicting server name "dup.test" on 0.0.0.0:80, ignored\n' +
              '  -> test is successful',
            ),
            'Hai cấu hình, hai lượt <code>nginx -t</code>. Vì sao một cái hỏng còn cái kia chỉ cảnh báo?' + code(
              '# cấu hình A\n' +
              'server { listen 80 default_server; server_name a; }\n' +
              'server { listen 80 default_server; server_name b; }\n' +
              '  -> [emerg] a duplicate default server for 0.0.0.0:80 ... test failed\n' +
              '\n' +
              '# cấu hình B\n' +
              'server { listen 80; server_name dup.test; }\n' +
              'server { listen 80; server_name dup.test; }\n' +
              '  -> [warn] conflicting server name "dup.test" on 0.0.0.0:80, ignored\n' +
              '  -> test is successful',
            ),
          ),
          options: [
            B(
              'Config B is also fatal, but only at run time; <code>nginx -t</code> cannot see it because the name table is built after the test finishes',
              'Cấu hình B cũng chí mạng, chỉ là tới lúc chạy mới lộ; <code>nginx -t</code> không thấy được vì bảng tên chỉ dựng sau khi phép kiểm kết thúc',
            ),
            B(
              'Config A is fatal because two blocks cannot listen on the same port; the <code>default_server</code> flag itself is irrelevant to the error',
              'Cấu hình A chí mạng vì hai khối không thể cùng nghe một cổng; bản thân cờ <code>default_server</code> không liên quan gì tới lỗi đó',
            ),
            B(
              'A default server is a single slot per address and port so two claimants is unresolvable, whereas a duplicate name is resolvable by rule — the first block keeps it and the later one is dropped',
              'Máy chủ mặc định là MỘT suất duy nhất cho mỗi cặp địa chỉ và cổng nên hai kẻ tranh nhau là bất khả phân giải, còn tên trùng thì phân giải được bằng luật — khối đầu giữ tên, khối sau bị bỏ',
            ),
            B(
              'The difference is the log level configured in the two files: A sets <code>error_log ... emerg</code> and B leaves the default, so the same problem is merely reported differently',
              'Khác nhau nằm ở mức log khai trong hai tệp: A đặt <code>error_log ... emerg</code> còn B để mặc định, nên cùng một vấn đề chỉ được báo theo hai kiểu',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Nginx refuses only what it cannot decide. The default server is one slot per listening address and port; with two blocks claiming it there is no rule that picks a winner, so the load aborts and the site keeps running on the previous configuration. A duplicate ' + c('server_name') + ' <em>is</em> decidable: the first block that claimed the name keeps it, the later one is dropped from the name table, and Nginx says so at ' + c('warn') + ' level and carries on. That is why config B is the more dangerous of the two in practice — the test passes, the reload succeeds, and a whole server block that someone wrote and deployed is silently never reached. This is the general shape to remember when reading <code>nginx -t</code> output: read the <em>warnings</em>, because "test is successful" only promises that the file parses and that every ambiguity had a documented tie-breaker, not that the tie-breaker chose what you wanted. Option 2 misreads the error — many blocks may share a port, that is the whole point of name-based virtual hosting. Options 1 and 4 invent mechanisms that the two transcripts contradict.',
            'Nginx chỉ từ chối những gì nó KHÔNG QUYẾT ĐỊNH ĐƯỢC. Máy chủ mặc định là MỘT suất cho mỗi cặp địa chỉ nghe và cổng; có hai khối cùng giành thì không có luật nào chọn ra kẻ thắng, nên lượt nạp bị huỷ và site tiếp tục chạy trên cấu hình trước đó. Một ' + c('server_name') + ' trùng thì LẠI quyết định được: khối nào giành tên trước thì giữ, khối sau bị loại khỏi bảng tên, và Nginx nói ra điều đó ở mức ' + c('warn') + ' rồi đi tiếp. Chính vì thế trên thực tế cấu hình B mới là cái nguy hiểm hơn — phép kiểm qua, lượt nạp lại thành công, và cả một khối server mà ai đó đã viết và đã deploy thì lặng lẽ không bao giờ được tới. Đây là hình dạng chung cần nhớ khi đọc output của <code>nginx -t</code>: hãy đọc phần CẢNH BÁO, vì "test is successful" chỉ hứa rằng tệp phân tích được và mọi chỗ nhập nhằng đều có một luật gỡ hoà có ghi trong tài liệu, chứ không hứa rằng luật gỡ hoà ấy chọn đúng thứ bạn muốn. Phương án 2 đọc sai thông báo lỗi — nhiều khối hoàn toàn có thể dùng chung một cổng, đó chính là ý nghĩa của virtual host theo tên. Phương án 1 và 4 bịa ra những cơ chế mà hai bản ghi kia bác bỏ.',
          ),
        }),

        /* ── Chương 2 — location nào thắng (5 câu) ───────────────────────── */

        // q8 · đáp án 3
        mcq({
          prompt: B(
            'Every line below was measured against this exact block set. Explain the two <code>/images/</code> results.' + code(
              'location ^~ /images/       { return 200 "CARET"; }\n' +
              'location /images/deep/     { return 200 "PREFIX-DEEP"; }\n' +
              'location ~ \\.gif$          { return 200 "REGEX-GIF"; }\n' +
              '\n' +
              '/images/x.gif        -> CARET\n' +
              '/images/deep/x.gif   -> REGEX-GIF',
            ),
            'Mọi dòng dưới đây đều đo thật trên đúng bộ khối này. Hãy giải thích hai kết quả <code>/images/</code>.' + code(
              'location ^~ /images/       { return 200 "CARET"; }\n' +
              'location /images/deep/     { return 200 "PREFIX-DEEP"; }\n' +
              'location ~ \\.gif$          { return 200 "REGEX-GIF"; }\n' +
              '\n' +
              '/images/x.gif        -> CARET\n' +
              '/images/deep/x.gif   -> REGEX-GIF',
            ),
          ),
          options: [
            B(
              'The second URI is deeper than the first, and <code>^~</code> only protects one path segment below the prefix it names',
              'URI thứ hai sâu hơn cái thứ nhất, mà <code>^~</code> chỉ che được một đoạn đường dẫn ngay dưới cái tiền tố nó nêu',
            ),
            B(
              'Regexes are tried before prefixes, so <code>REGEX-GIF</code> is the normal outcome and the first line is the exception, caused by <code>^~</code> being declared earlier in the file',
              'Regex được thử trước tiền tố, nên <code>REGEX-GIF</code> mới là kết quả bình thường và dòng đầu mới là ngoại lệ, do <code>^~</code> được khai sớm hơn trong tệp',
            ),
            B(
              'The <code>PREFIX-DEEP</code> block shadows the <code>^~</code> block for both URIs; the first line differs only because <code>x.gif</code> sits directly in <code>/images/</code>',
              'Khối <code>PREFIX-DEEP</code> che khối <code>^~</code> cho cả hai URI; dòng đầu khác chỉ vì <code>x.gif</code> nằm ngay trong <code>/images/</code>',
            ),
            B(
              'Only the LONGEST matching prefix decides whether the regex round runs: it is the <code>^~</code> block for the first URI so regexes are skipped, and the plain <code>/images/deep/</code> block for the second, so they are not',
              'Chỉ TIỀN TỐ KHỚP DÀI NHẤT mới quyết định vòng regex có chạy hay không: với URI đầu nó là khối <code>^~</code> nên regex bị bỏ qua, với URI sau nó là khối thường <code>/images/deep/</code> nên regex vẫn chạy',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Nginx runs one algorithm, and the trap is that ' + c('^~') + ' is not a property of a subtree — it is a property of a single block, and it only takes effect if that block is the <em>winner</em> of the prefix round. The order is: exact ' + c('= /path') + ' first and stop; otherwise remember the longest matching prefix; if that longest one carries ' + c('^~') + ', use it and skip regexes entirely; otherwise try regexes in file order and take the first hit; if none matches, fall back to the remembered prefix. For ' + c('/images/x.gif') + ' the longest prefix is the ' + c('^~') + ' block, so the ' + c('.gif') + ' regex never runs. For ' + c('/images/deep/x.gif') + ' the longest prefix is the plain ' + c('/images/deep/') + ' block, the ' + c('^~') + ' is not the winner, so the regex round runs and takes it. That is the real-world failure this chapter exists for: adding an innocuous ' + c('location /images/deep/') + ' silently removed protection someone else had put on the subtree, without touching the line that provided it. Options 1 and 3 invent subtree semantics; option 2 has the two rounds in the wrong order.',
            'Nginx chạy MỘT thuật toán duy nhất, và cái bẫy là ' + c('^~') + ' không phải thuộc tính của một NHÁNH — nó là thuộc tính của MỘT KHỐI, và chỉ có hiệu lực nếu khối đó THẮNG vòng tiền tố. Thứ tự là: khớp chính xác ' + c('= /path') + ' trước rồi dừng; nếu không thì ghi nhớ tiền tố khớp DÀI NHẤT; nếu cái dài nhất ấy mang ' + c('^~') + ' thì dùng nó và bỏ qua hẳn regex; nếu không thì thử các regex theo thứ tự trong tệp và lấy cái khớp đầu tiên; không cái nào khớp thì quay về cái tiền tố đã nhớ. Với ' + c('/images/x.gif') + ' thì tiền tố dài nhất là khối ' + c('^~') + ', nên regex ' + c('.gif') + ' không bao giờ chạy. Với ' + c('/images/deep/x.gif') + ' thì tiền tố dài nhất là khối thường ' + c('/images/deep/') + ', ' + c('^~') + ' không phải kẻ thắng, nên vòng regex chạy và nó giành lấy. Đó đúng là cú hỏng ngoài đời mà chương này tồn tại vì nó: thêm một ' + c('location /images/deep/') + ' trông vô hại đã âm thầm gỡ mất lớp bảo vệ ai đó đặt lên nhánh, mà không đụng một chữ nào vào cái dòng tạo ra lớp bảo vệ ấy. Phương án 1 và 3 bịa ra ngữ nghĩa theo nhánh; phương án 2 xếp sai thứ tự hai vòng.',
          ),
        }),

        // q9 · đáp án 1
        mcq({
          prompt: B(
            'Three requests, one <code>location /echo</code> that prints both variables. What rule do the three lines share?' + code(
              'GET /echo?q=1&z=2        -> uri=/echo       raw=/echo?q=1&z=2\n' +
              'GET /ec%68o              -> uri=/echo       raw=/ec%68o\n' +
              'GET /echo//x/./../y      -> uri=/echo/y     raw=/echo//x/./../y',
            ),
            'Ba request, một <code>location /echo</code> in ra cả hai biến. Ba dòng này chung một luật gì?' + code(
              'GET /echo?q=1&z=2        -> uri=/echo       raw=/echo?q=1&z=2\n' +
              'GET /ec%68o              -> uri=/echo       raw=/ec%68o\n' +
              'GET /echo//x/./../y      -> uri=/echo/y     raw=/echo//x/./../y',
            ),
          ),
          options: [
            B(
              '<code>$uri</code> is the value after the query string is removed; percent-decoding and dot-segment collapsing happen later, inside the file-system handler',
              '<code>$uri</code> là giá trị sau khi cắt chuỗi truy vấn; việc giải mã phần trăm và rút gọn đoạn chấm xảy ra sau đó, bên trong bộ xử lý hệ thống tệp',
            ),
            B(
              '<code>$uri</code> is the normalised path Nginx matches locations against — query stripped, escapes decoded, duplicate and dot segments collapsed — while <code>$request_uri</code> is the untouched original',
              '<code>$uri</code> là đường dẫn ĐÃ CHUẨN HOÁ mà Nginx đem đi khớp location — bỏ chuỗi truy vấn, giải mã escape, rút gọn đoạn trùng và đoạn chấm — còn <code>$request_uri</code> là bản gốc chưa đụng vào',
            ),
            B(
              'The two variables are the same value; <code>$request_uri</code> merely re-appends the query string that <code>$uri</code> had dropped for display',
              'Hai biến là cùng một giá trị; <code>$request_uri</code> chỉ nối lại chuỗi truy vấn mà <code>$uri</code> đã bỏ đi, cho dễ nhìn',
            ),
            B(
              '<code>$uri</code> is whatever the last <code>rewrite</code> produced, so all three lines show a rewrite firing and none of them shows normalisation',
              '<code>$uri</code> là kết quả của lần <code>rewrite</code> gần nhất, nên cả ba dòng đều là một cú rewrite chạy chứ không dòng nào cho thấy sự chuẩn hoá',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Location matching never sees what the client typed. Nginx first builds the normalised path in ' + c('$uri') + ': it splits off the query string, percent-decodes the remainder (' + c('%68') + ' becomes ' + c('h') + '), collapses repeated slashes and resolves ' + c('.') + ' and ' + c('..') + ' segments. Only then does it choose a location. ' + c('$request_uri') + ' keeps the original bytes and is what you log or forward when you need to know what was actually sent. Two consequences follow directly. First, a location prefix confines nothing: ' + c('/public/../admin') + ' matches ' + c('location /admin') + ', so writing a location name is not an access-control mechanism — for that you want ' + c('internal') + ', ' + c('deny') + ', or real authentication. Second, a rule written against the raw string can be defeated by an encoding the client chooses, so security checks belong on ' + c('$uri') + ' after normalisation, while audit logs belong on ' + c('$request_uri') + '. Option 1 puts the decoding too late; option 3 contradicts lines two and three of the transcript; option 4 blames a rewrite where none exists.',
            'Việc khớp location KHÔNG BAO GIỜ nhìn thấy thứ client gõ. Nginx trước hết dựng đường dẫn đã chuẩn hoá trong ' + c('$uri') + ': nó tách chuỗi truy vấn ra, giải mã phần trăm phần còn lại (' + c('%68') + ' thành ' + c('h') + '), rút gọn các dấu gạch chéo lặp và giải quyết các đoạn ' + c('.') + ' với ' + c('..') + '. Chỉ tới lúc đó nó mới chọn location. ' + c('$request_uri') + ' giữ nguyên byte gốc, và đó là thứ bạn ghi log hay chuyển tiếp khi cần biết cái gì thật sự đã được gửi lên. Hai hệ quả suy ra ngay. Một, một tiền tố location KHÔNG giam giữ được gì: ' + c('/public/../admin') + ' khớp ' + c('location /admin') + ', nên viết tên một location không phải một cơ chế kiểm soát truy cập — muốn thế thì cần ' + c('internal') + ', ' + c('deny') + ', hoặc xác thực thật. Hai, một luật viết theo chuỗi thô có thể bị vô hiệu bằng một kiểu mã hoá do client chọn, nên phép kiểm bảo mật phải đặt trên ' + c('$uri') + ' sau chuẩn hoá, còn log kiểm toán thì đặt trên ' + c('$request_uri') + '. Phương án 1 đặt bước giải mã quá muộn; phương án 3 mâu thuẫn với dòng hai và dòng ba của bản ghi; phương án 4 đổ cho một cú rewrite không hề tồn tại.',
          ),
        }),

        // q10 · đáp án 2
        mcq({
          prompt: B(
            'Both blocks serve the same file on disk. What is the rule that produces both results?' + code(
              'location /static/ { root  /srv/www; }          # /static/a.txt -> /srv/www/static/a.txt\n' +
              'location /files/  { alias /srv/www/assets/; }  # /files/b.txt  -> /srv/www/assets/b.txt',
            ),
            'Cả hai khối đều phục vụ tệp có thật trên đĩa. Luật nào tạo ra cả hai kết quả?' + code(
              'location /static/ { root  /srv/www; }          # /static/a.txt -> /srv/www/static/a.txt\n' +
              'location /files/  { alias /srv/www/assets/; }  # /files/b.txt  -> /srv/www/assets/b.txt',
            ),
          ),
          options: [
            B(
              '<code>root</code> and <code>alias</code> are synonyms; the paths differ only because one config names the parent directory and the other names the child',
              '<code>root</code> và <code>alias</code> là hai tên của cùng một thứ; đường dẫn khác nhau chỉ vì một cấu hình nêu thư mục cha còn cái kia nêu thư mục con',
            ),
            B(
              '<code>alias</code> appends the URI just like <code>root</code>, but strips the leading slash first, which is why the <code>/files/</code> segment disappears from the result',
              '<code>alias</code> nối URI vào y như <code>root</code>, chỉ khác là nó cắt dấu gạch chéo đầu trước, và vì thế đoạn <code>/files/</code> biến mất khỏi kết quả',
            ),
            B(
              '<code>root</code> gives a base that the WHOLE URI is appended to, while <code>alias</code> REPLACES the matched location prefix, so only the remainder after it is appended',
              '<code>root</code> cho một gốc mà TOÀN BỘ URI được nối vào, còn <code>alias</code> THAY THẾ đúng cái tiền tố location đã khớp, nên chỉ phần còn lại sau nó được nối vào',
            ),
            B(
              '<code>alias</code> resolves symbolic links while <code>root</code> does not, and the two results are simply two different files that happen to have the same content',
              '<code>alias</code> đi theo liên kết mềm còn <code>root</code> thì không, và hai kết quả đơn giản là hai tệp khác nhau tình cờ trùng nội dung',
            ),
          ],
          correct: 2,
          explanation: EX(
            'One word decides whether the location name survives into the path on disk. With ' + c('root /srv/www') + ' the whole URI is appended, so ' + c('/static/a.txt') + ' becomes ' + c('/srv/www/static/a.txt') + ' — the directory ' + c('static') + ' must genuinely exist under the root. With ' + c('alias /srv/www/assets/') + ' the matched prefix is cut off and replaced, so ' + c('/files/b.txt') + ' becomes ' + c('/srv/www/assets/b.txt') + ' and there is no ' + c('files') + ' directory anywhere. Both were measured returning the file. Two habits keep this from biting: prefer ' + c('root') + ' whenever the URL layout can mirror the disk layout, because it composes and cannot be half-written; and if you do use ' + c('alias') + ', make the location and the alias both end in a slash — the mismatched-slash form is a directory traversal, not a style preference. One more trap: inside a location matched by a regular expression, ' + c('alias') + ' must spell out the captures itself, because there is no literal prefix to strip. Options 1 and 2 both erase the difference the transcript is showing; option 4 invents a symlink rule that neither directive has.',
            'Một chữ quyết định cái tên location có sống sót vào đường dẫn trên đĩa hay không. Với ' + c('root /srv/www') + ' thì TOÀN BỘ URI được nối vào, nên ' + c('/static/a.txt') + ' thành ' + c('/srv/www/static/a.txt') + ' — thư mục ' + c('static') + ' phải tồn tại thật dưới cái gốc. Với ' + c('alias /srv/www/assets/') + ' thì tiền tố đã khớp bị cắt đi và thay thế, nên ' + c('/files/b.txt') + ' thành ' + c('/srv/www/assets/b.txt') + ' và chẳng có thư mục ' + c('files') + ' nào ở đâu cả. Cả hai đều đã đo thật và đều trả về tệp. Hai thói quen giúp bạn khỏi dính: ưu tiên ' + c('root') + ' mỗi khi bố cục URL có thể phản chiếu bố cục đĩa, vì nó ghép được và không thể viết nửa vời; còn nếu phải dùng ' + c('alias') + ' thì hãy để cả location lẫn alias cùng kết thúc bằng dấu gạch chéo — dạng lệch dấu gạch chéo là một lỗ đi ngược thư mục, không phải một sở thích trình bày. Thêm một bẫy nữa: bên trong một location khớp bằng biểu thức chính quy, ' + c('alias') + ' phải tự viết ra các nhóm bắt được, vì không có tiền tố nguyên văn nào để cắt. Phương án 1 và 2 đều xoá mất chính cái khác biệt mà bản ghi đang phơi ra; phương án 4 bịa ra một luật liên kết mềm mà không chỉ thị nào có.',
          ),
        }),

        // q11 · đáp án 0
        mcq({
          prompt: B(
            'This was run against a live server. The file is outside the aliased directory. What made it readable?' + code(
              'location /i { alias /srv/www/assets/; }\n' +
              '\n' +
              '$ curl -s --path-as-is http://edge/i../private/app.env\n' +
              'PRIVATE-KEY-DATA',
            ),
            'Đoạn này chạy thật trên một máy chủ sống. Tệp đó nằm NGOÀI thư mục được alias. Cái gì làm nó đọc được?' + code(
              'location /i { alias /srv/www/assets/; }\n' +
              '\n' +
              '$ curl -s --path-as-is http://edge/i../private/app.env\n' +
              'PRIVATE-KEY-DATA',
            ),
          ),
          options: [
            B(
              'The location has no trailing slash, so <code>/i</code> matches and is replaced by the alias, leaving <code>/srv/www/assets/../private/app.env</code> — a path the file system resolves into the parent',
              'Location không có dấu gạch chéo cuối, nên <code>/i</code> khớp rồi bị thay bằng alias, để lại <code>/srv/www/assets/../private/app.env</code> — một đường dẫn mà hệ thống tệp giải quyết ra ngoài thư mục cha',
            ),
            B(
              'Nginx decoded <code>..</code> after choosing the location, so the normalised <code>$uri</code> still contained the dot segment when the alias was applied',
              'Nginx giải mã <code>..</code> SAU khi chọn location, nên <code>$uri</code> đã chuẩn hoá vẫn còn đoạn chấm vào lúc alias được áp dụng',
            ),
            B(
              'The <code>--path-as-is</code> flag makes curl send a request Nginx cannot parse, and an unparsable path falls through to a raw file read',
              'Cờ <code>--path-as-is</code> khiến curl gửi một request mà Nginx không phân tích nổi, và một đường dẫn không phân tích được thì rơi thẳng xuống một lượt đọc tệp thô',
            ),
            B(
              'The alias ends in a slash, and a trailing slash on <code>alias</code> disables the directory containment check that Nginx otherwise performs',
              'Alias kết thúc bằng dấu gạch chéo, và dấu gạch chéo cuối trên <code>alias</code> tắt mất phép kiểm giam-trong-thư-mục mà bình thường Nginx vẫn làm',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The leak is pure string concatenation, and it is why the mismatched slash is a security bug rather than a style nit. The normalised ' + c('$uri') + ' here is ' + c('/i../private/app.env') + ' — Nginx collapses ' + c('..') + ' segments only when they follow a slash, so ' + c('i..') + ' survives normalisation as one path segment. It matches the prefix ' + c('/i') + ', the alias replaces exactly those two characters, and the result handed to ' + c('open()') + ' is ' + c('/srv/www/assets/../private/app.env') + '. The kernel resolves that to ' + c('/srv/www/private/app.env') + ' and serves it. The same request against ' + c('location /j/ { alias /srv/www/assets/; }') + ' does not match the location at all and falls through harmlessly — measured. So the rule is mechanical: <b>location and alias either both end in a slash or you have a traversal</b>. Nginx performs no containment check of its own, which rules option 4 out. Option 2 has the ordering right but the mechanism wrong — nothing decoded late here. Option 3 mistakes a curl flag that merely stops curl from normalising for a parser failure in the server.',
            'Chỗ rò rỉ này thuần tuý là phép NỐI CHUỖI, và đó là lý do dấu gạch chéo lệch là một lỗi bảo mật chứ không phải một tiểu tiết trình bày. ' + c('$uri') + ' đã chuẩn hoá ở đây là ' + c('/i../private/app.env') + ' — Nginx chỉ rút gọn đoạn ' + c('..') + ' khi nó đi ngay sau một dấu gạch chéo, nên ' + c('i..') + ' sống sót qua chuẩn hoá như MỘT đoạn đường dẫn. Nó khớp tiền tố ' + c('/i') + ', alias thay đúng hai ký tự ấy, và thứ đưa cho ' + c('open()') + ' là ' + c('/srv/www/assets/../private/app.env') + '. Nhân giải nó ra thành ' + c('/srv/www/private/app.env') + ' rồi phục vụ. Cũng request đó nện vào ' + c('location /j/ { alias /srv/www/assets/; }') + ' thì không khớp location nào cả và rơi xuống một cách vô hại — đã đo. Nên cái luật là máy móc: <b>location và alias hoặc cùng kết thúc bằng dấu gạch chéo, hoặc bạn có một lỗ đi ngược thư mục</b>. Nginx không tự làm phép kiểm giam-trong-thư-mục nào, nên phương án 4 bị loại. Phương án 2 đúng về thứ tự nhưng sai về cơ chế — chẳng có gì được giải mã muộn ở đây. Phương án 3 nhầm một cờ của curl vốn chỉ ngăn curl tự chuẩn hoá thành một cú hỏng bộ phân tích của máy chủ.',
          ),
        }),

        // q12 · đáp án 3
        mcq({
          prompt: B(
            'A single-page app is deployed but <code>index.html</code> was not built. Every unknown path now returns this. What is happening?' + code(
              'location / { try_files $uri /index.html; }\n' +
              '\n' +
              '$ curl -o /dev/null -w \'%{http_code}\\n\' http://edge/missing\n' +
              '500\n' +
              '[error] rewrite or internal redirection cycle while internally\n' +
              '        redirecting to "/index.html"',
            ),
            'Một ứng dụng một trang đã deploy nhưng <code>index.html</code> không được dựng ra. Giờ mọi đường dẫn lạ đều trả về thế này. Chuyện gì đang xảy ra?' + code(
              'location / { try_files $uri /index.html; }\n' +
              '\n' +
              '$ curl -o /dev/null -w \'%{http_code}\\n\' http://edge/missing\n' +
              '500\n' +
              '[error] rewrite or internal redirection cycle while internally\n' +
              '        redirecting to "/index.html"',
            ),
          ),
          options: [
            B(
              'The 500 comes from the missing file itself: <code>try_files</code> reports an unreadable last element as a server error rather than a 404',
              'Cú 500 tới từ chính cái tệp thiếu: <code>try_files</code> báo phần tử cuối không đọc được thành lỗi máy chủ chứ không phải 404',
            ),
            B(
              'Two workers raced on the same internal redirect and Nginx aborted the request; restarting with one worker would turn it back into a 404',
              'Hai worker đã tranh nhau cùng một cú chuyển hướng nội bộ và Nginx huỷ request; chạy lại với một worker sẽ biến nó về thành 404',
            ),
            B(
              'The client followed the redirect back to the same URL ten times, so this is a browser redirect loop that happens to be logged by Nginx',
              'Client đã đi theo cú chuyển hướng về đúng URL đó mười lần, nên đây là một vòng lặp chuyển hướng phía trình duyệt tình cờ được Nginx ghi lại',
            ),
            B(
              'The last <code>try_files</code> element is a URI, so it restarts location matching; the same block matches again, the same fallback fires again, and Nginx stops the loop at its internal-redirect limit',
              'Phần tử cuối của <code>try_files</code> là một URI nên nó khởi động lại việc khớp location; đúng khối đó khớp lại, đúng cú lùi đó chạy lại, và Nginx chặn vòng lặp ở hạn mức chuyển hướng nội bộ của nó',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The last element of ' + c('try_files') + ' is special: everything before it is tested as a file path, but the final one is an <em>internal redirect</em> to a URI, which throws the request back to the start of location matching. Here that URI is ' + c('/index.html') + ', which matches ' + c('location /') + ' again, so ' + c('try_files') + ' runs again, finds no file again, and redirects again. Nginx counts these and aborts at ten with a 500 and the cycle message — never a 404, which is why the status is so confusing when you first meet it. Two ways out. Make the fallback terminate: ' + c('try_files $uri /index.html =404') + ' cannot loop because ' + c('=404') + ' is a status, not a URI. Or give the fallback its own block that cannot re-enter, which is what ' + c('try_files $uri @app') + ' plus a named ' + c('location @app') + ' does. The general lesson for reading the log: "internal redirection cycle" always means a URI you produced landed back in the block that produced it, so look for the loop rather than for the missing file. Options 1 and 3 misread who is looping; option 2 blames concurrency for a deterministic, single-request result.',
            'Phần tử CUỐI của ' + c('try_files') + ' là đặc biệt: mọi thứ trước nó được thử như một đường dẫn tệp, còn cái cuối cùng là một CHUYỂN HƯỚNG NỘI BỘ tới một URI, tức là ném request về lại đầu quá trình khớp location. Ở đây URI đó là ' + c('/index.html') + ', nó lại khớp ' + c('location /') + ', nên ' + c('try_files') + ' chạy lại, lại không thấy tệp, và lại chuyển hướng. Nginx đếm những lượt này và huỷ ở lần thứ mười với một cú 500 kèm thông báo vòng lặp — không bao giờ là 404, và chính vì thế mã trạng thái này gây rối tới vậy khi lần đầu gặp. Có hai lối ra. Hoặc làm cho cú lùi KẾT THÚC được: ' + c('try_files $uri /index.html =404') + ' không thể lặp vì ' + c('=404') + ' là một mã trạng thái chứ không phải URI. Hoặc cho cú lùi một khối riêng không thể quay vào lại, tức là ' + c('try_files $uri @app') + ' cộng với một ' + c('location @app') + ' có tên. Bài học chung khi đọc log: "internal redirection cycle" luôn có nghĩa là một URI do bạn tạo ra đã rơi trở lại đúng cái khối đã tạo ra nó, nên hãy đi tìm cái VÒNG chứ đừng đi tìm cái tệp thiếu. Phương án 1 và 3 đọc nhầm ai đang lặp; phương án 2 đổ cho tính đồng thời một kết quả tất định chỉ trong một request.',
          ),
        }),

        /* ── Chương 3 — proxy ngược (5 câu) ──────────────────────────────── */

        // q13 · đáp án 0
        mcq({
          prompt: B(
            'Four locations, one request path each, and the path the application actually received. What rule explains all four?' + code(
              'upstream appx { server app:8080; }\n' +
              '\n' +
              'location /api/  { proxy_pass http://app:8080;     }  /api/users/7  -> /api/users/7\n' +
              'location /api2/ { proxy_pass http://app:8080/;    }  /api2/users/7 -> /users/7\n' +
              'location /api3/ { proxy_pass http://app:8080/v9/; }  /api3/users/7 -> /v9/users/7\n' +
              'location /api4/ { proxy_pass http://appx;         }  /api4/users/7 -> /api4/users/7',
            ),
            'Bốn location, mỗi cái một đường dẫn request, và đường dẫn mà ứng dụng THẬT SỰ nhận được. Luật nào giải thích cả bốn?' + code(
              'upstream appx { server app:8080; }\n' +
              '\n' +
              'location /api/  { proxy_pass http://app:8080;     }  /api/users/7  -> /api/users/7\n' +
              'location /api2/ { proxy_pass http://app:8080/;    }  /api2/users/7 -> /users/7\n' +
              'location /api3/ { proxy_pass http://app:8080/v9/; }  /api3/users/7 -> /v9/users/7\n' +
              'location /api4/ { proxy_pass http://appx;         }  /api4/users/7 -> /api4/users/7',
            ),
          ),
          options: [
            B(
              'If <code>proxy_pass</code> carries a URI part the matched prefix is replaced by it; if it carries none the request path goes upstream untouched, and an upstream group name can never carry one',
              'Nếu <code>proxy_pass</code> có mang một phần URI thì tiền tố đã khớp bị thay bằng nó; nếu không mang gì thì đường dẫn đi lên upstream nguyên vẹn, và một tên nhóm upstream thì không bao giờ mang được phần URI',
            ),
            B(
              'The trailing slash only strips the location prefix when the location itself ends in a slash; <code>/api4/</code> keeps its prefix because <code>appx</code> resolves to a name, not a host and port',
              'Dấu gạch chéo cuối chỉ cắt tiền tố location khi chính location kết thúc bằng dấu gạch chéo; <code>/api4/</code> giữ tiền tố vì <code>appx</code> phân giải ra một cái tên chứ không phải cặp máy và cổng',
            ),
            B(
              'Nginx always forwards <code>$request_uri</code>; the differences come from the upstream application rewriting its own routes, not from the proxy',
              'Nginx luôn chuyển tiếp <code>$request_uri</code>; những khác biệt kia tới từ việc ứng dụng upstream tự viết lại tuyến của nó, chứ không phải từ proxy',
            ),
            B(
              'A URI part on <code>proxy_pass</code> is prepended to the full request path, which is why <code>/api3/</code> shows <code>/v9/</code> in front of it',
              'Một phần URI trên <code>proxy_pass</code> được ghép vào TRƯỚC đường dẫn request đầy đủ, và vì thế <code>/api3/</code> hiện ra <code>/v9/</code> đứng trước nó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'There are only two modes and one character decides which. Without a URI part — ' + c('proxy_pass http://app:8080;') + ' — Nginx sends the request path as it stands, so the application sees ' + c('/api/users/7') + ' and its routes must include the prefix. With a URI part, even the single slash in ' + c('proxy_pass http://app:8080/;') + ', the matched location prefix is cut off and replaced, so the application sees ' + c('/users/7') + '. A longer URI part substitutes correspondingly: ' + c('/v9/') + ' replaces ' + c('/api3/') + ', giving ' + c('/v9/users/7') + ' — it is a substitution, not a prefix, which rules option 4 out. The fourth line is the one people get wrong: an upstream group name cannot take a URI part, so ' + c('proxy_pass http://appx;') + ' is always pass-through. Two consequences worth carrying: whichever mode you choose, be consistent, because half your routes silently gaining or losing a prefix is a 404 that looks like an application bug; and remember that the same slash also changes ' + c('$proxy_host') + ', which is what the default ' + c('Host') + ' header is built from — with the group form the upstream sees ' + c('Host: appx') + ', a name that resolves nowhere.',
            'Chỉ có HAI chế độ và một ký tự quyết định chế độ nào. Không có phần URI — ' + c('proxy_pass http://app:8080;') + ' — Nginx gửi đường dẫn request y nguyên, nên ứng dụng thấy ' + c('/api/users/7') + ' và các tuyến của nó phải chứa cả cái tiền tố. Có phần URI, dù chỉ là mỗi dấu gạch chéo trong ' + c('proxy_pass http://app:8080/;') + ', thì tiền tố location đã khớp bị cắt và thay đi, nên ứng dụng thấy ' + c('/users/7') + '. Một phần URI dài hơn thì thay tương ứng: ' + c('/v9/') + ' thay cho ' + c('/api3/') + ', ra ' + c('/v9/users/7') + ' — đó là phép THAY THẾ, không phải phép ghép đầu, và điều đó loại phương án 4. Dòng thứ tư mới là chỗ người ta hay sai: một tên NHÓM upstream không nhận được phần URI, nên ' + c('proxy_pass http://appx;') + ' luôn là chuyển nguyên si. Hai hệ quả đáng mang theo: chọn chế độ nào cũng được nhưng phải NHẤT QUÁN, vì một nửa số tuyến của bạn âm thầm mọc thêm hay rụng mất một tiền tố là một cú 404 trông y như lỗi ứng dụng; và nhớ rằng cũng chính dấu gạch chéo ấy đổi luôn ' + c('$proxy_host') + ', thứ mà header ' + c('Host') + ' mặc định được dựng từ đó — với dạng nhóm thì upstream nhận ' + c('Host: appx') + ', một cái tên chẳng phân giải ra đâu cả.',
          ),
        }),

        // q14 · đáp án 1
        mcq({
          prompt: B(
            'A bare <code>proxy_pass</code> with no <code>proxy_set_header</code> at all. The client sent an <code>Upgrade</code> header and a forged <code>X-Forwarded-For</code>. This is what the application received:' + code(
              '{"host":"app:8080","xff":"9.9.9.9","xfp":"",\n' +
              ' "conn":"close","upgrade":""}',
            ),
            'Một <code>proxy_pass</code> trần, không có <code>proxy_set_header</code> nào. Client đã gửi một header <code>Upgrade</code> và một <code>X-Forwarded-For</code> giả mạo. Đây là thứ ứng dụng nhận được:' + code(
              '{"host":"app:8080","xff":"9.9.9.9","xfp":"",\n' +
              ' "conn":"close","upgrade":""}',
            ),
          ),
          options: [
            B(
              'Nginx forwards nothing it was not told to forward, so all four values are Nginx defaults and the <code>9.9.9.9</code> must have been added by a load balancer in front',
              'Nginx không chuyển tiếp thứ gì mà nó không được bảo, nên cả bốn giá trị đều là mặc định của Nginx và cái <code>9.9.9.9</code> chắc chắn do một bộ cân bằng tải phía trước thêm vào',
            ),
            B(
              'Nginx rewrites <code>Host</code> to <code>$proxy_host</code>, sets <code>Connection: close</code> and drops hop-by-hop headers such as <code>Upgrade</code> — but it passes every other client header through, including a forged <code>X-Forwarded-For</code>',
              'Nginx viết lại <code>Host</code> thành <code>$proxy_host</code>, đặt <code>Connection: close</code> và vứt các header từng-chặng như <code>Upgrade</code> — nhưng nó chuyển tiếp MỌI header khác của client, kể cả một <code>X-Forwarded-For</code> giả mạo',
            ),
            B(
              'The empty <code>xfp</code> proves Nginx stripped <code>X-Forwarded-Proto</code>; it strips every <code>X-Forwarded-*</code> header for safety and expects you to re-add the ones you trust',
              'Cái <code>xfp</code> rỗng chứng minh Nginx đã gỡ <code>X-Forwarded-Proto</code>; nó gỡ mọi header <code>X-Forwarded-*</code> cho an toàn và chờ bạn tự thêm lại những cái bạn tin',
            ),
            B(
              '<code>Host</code> became <code>app:8080</code> because the client sent that value; a reverse proxy never changes <code>Host</code>, which is why the four surprises are all on the client side',
              '<code>Host</code> thành <code>app:8080</code> vì client đã gửi đúng giá trị đó; một proxy ngược không bao giờ đổi <code>Host</code>, và vì vậy cả bốn điều bất ngờ đều nằm ở phía client',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Four defaults, and each one bites a different feature. ' + c('Host') + ' is replaced with ' + c('$proxy_host') + ', so the application generates absolute URLs and cookie domains for the upstream address instead of the public name. ' + c('Connection') + ' is set to ' + c('close') + ' because the proxy speaks HTTP/1.0 upstream by default, which is also why upstream keep-alive needs ' + c('proxy_http_version 1.1') + '. Hop-by-hop headers, ' + c('Upgrade') + ' among them, are removed by definition — a WebSocket therefore never negotiates until you put it back. And ' + c('X-Forwarded-Proto') + ' is absent because nothing generates it, so an application behind TLS termination believes it is on plain HTTP and builds ' + c('http://') + ' links or refuses to set a Secure cookie. The fourth value is the one that turns a config detail into a vulnerability: every other client header is forwarded verbatim, so a client-supplied ' + c('X-Forwarded-For') + ' arrives looking exactly like a real one. The fix is the same four lines everywhere — set ' + c('Host $host') + ', ' + c('X-Real-IP $remote_addr') + ', ' + c('X-Forwarded-Proto $scheme') + ', and either ' + c('X-Forwarded-For $proxy_add_x_forwarded_for') + ' when you have trusted proxies in front, or ' + c('$remote_addr') + ' when you do not and want the chain to start here. Options 1, 3 and 4 each contradict a value printed in the transcript.',
            'Bốn mặc định, và mỗi cái cắn một tính năng khác nhau. ' + c('Host') + ' bị thay bằng ' + c('$proxy_host') + ', nên ứng dụng sinh URL tuyệt đối và miền cookie theo địa chỉ upstream thay vì theo tên công khai. ' + c('Connection') + ' bị đặt thành ' + c('close') + ' vì proxy mặc định nói HTTP/1.0 với upstream, và đó cũng là lý do keep-alive lên upstream cần ' + c('proxy_http_version 1.1') + '. Các header từng-chặng, trong đó có ' + c('Upgrade') + ', bị gỡ theo đúng định nghĩa — nên một WebSocket không bao giờ thương lượng nổi cho tới khi bạn đặt nó trở lại. Và ' + c('X-Forwarded-Proto') + ' vắng mặt vì chẳng có gì sinh ra nó, nên một ứng dụng nằm sau lớp kết thúc TLS tưởng mình đang chạy HTTP trần rồi dựng link ' + c('http://') + ' hoặc từ chối đặt cookie Secure. Giá trị thứ tư mới là cái biến một chi tiết cấu hình thành một lỗ hổng: MỌI header khác của client đều được chuyển tiếp nguyên văn, nên một ' + c('X-Forwarded-For') + ' do client tự gắn tới nơi trông y hệt một cái thật. Cách chữa là đúng bốn dòng ấy ở mọi nơi — đặt ' + c('Host $host') + ', ' + c('X-Real-IP $remote_addr') + ', ' + c('X-Forwarded-Proto $scheme') + ', và hoặc ' + c('X-Forwarded-For $proxy_add_x_forwarded_for') + ' khi bạn có proxy đáng tin ở phía trước, hoặc ' + c('$remote_addr') + ' khi không có và muốn chuỗi bắt đầu từ đây. Phương án 1, 3 và 4 mỗi cái đều mâu thuẫn với một giá trị đã in ra trong bản ghi.',
          ),
        }),

        // q15 · đáp án 0
        mcq({
          prompt: B(
            'The server block sets three proxy headers. One location adds a fourth. Compare what the application received from each location.' + code(
              'server {\n' +
              '  proxy_set_header Host              $host;\n' +
              '  proxy_set_header X-Forwarded-Proto $scheme;\n' +
              '  proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;\n' +
              '  location /keepall { proxy_pass http://app:8080; }\n' +
              '  location /wipe    { proxy_set_header X-Extra "one";\n' +
              '                      proxy_pass http://app:8080; }\n' +
              '}\n' +
              '\n' +
              '/keepall -> {"host":"edge","xff":"172.19.0.3","xfp":"http"}\n' +
              '/wipe    -> {"host":"app:8080","xff":"","xfp":""}',
            ),
            'Khối server đặt ba header proxy. Một location thêm cái thứ tư. Hãy so sánh thứ ứng dụng nhận được từ mỗi location.' + code(
              'server {\n' +
              '  proxy_set_header Host              $host;\n' +
              '  proxy_set_header X-Forwarded-Proto $scheme;\n' +
              '  proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;\n' +
              '  location /keepall { proxy_pass http://app:8080; }\n' +
              '  location /wipe    { proxy_set_header X-Extra "one";\n' +
              '                      proxy_pass http://app:8080; }\n' +
              '}\n' +
              '\n' +
              '/keepall -> {"host":"edge","xff":"172.19.0.3","xfp":"http"}\n' +
              '/wipe    -> {"host":"app:8080","xff":"","xfp":""}',
            ),
          ),
          options: [
            B(
              '<code>proxy_set_header</code> is an array directive: a child block that declares any of them REPLACES the whole inherited list, so <code>/wipe</code> now sends only <code>X-Extra</code> and everything falls back to defaults',
              '<code>proxy_set_header</code> là một chỉ thị dạng MẢNG: khối con nào khai dù chỉ một cái cũng THAY THẾ toàn bộ danh sách kế thừa, nên <code>/wipe</code> giờ chỉ gửi <code>X-Extra</code> còn mọi thứ khác rơi về mặc định',
            ),
            B(
              'Header inheritance stops at the first location in the file, so <code>/keepall</code> got the three only because it is declared before <code>/wipe</code>',
              'Việc kế thừa header dừng ở location đầu tiên trong tệp, nên <code>/keepall</code> có được ba cái chỉ vì nó được khai trước <code>/wipe</code>',
            ),
            B(
              'Setting <code>X-Extra</code> to a literal string switches the block to literal mode, so the three variable-valued headers can no longer be evaluated and are skipped',
              'Đặt <code>X-Extra</code> bằng một chuỗi nguyên văn chuyển khối đó sang chế độ nguyên văn, nên ba header có giá trị là biến không còn tính được nữa và bị bỏ qua',
            ),
            B(
              'The two locations behave identically and the difference shown is the application caching its first response, so the second request never reached the proxy',
              'Hai location hành xử y hệt nhau và khác biệt hiện ra là do ứng dụng đã đệm response đầu tiên, nên request thứ hai chưa từng tới được proxy',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the single most expensive rule in Nginx, and it applies to every list-valued directive: ' + c('proxy_set_header') + ', ' + c('add_header') + ', ' + c('fastcgi_param') + ', ' + c('limit_req') + '. Values are inherited from the enclosing level <b>only while the inner level declares none of its own</b>. The moment ' + c('/wipe') + ' writes one ' + c('proxy_set_header') + ', the three from the server block stop existing for that location — measured: ' + c('Host') + ' reverted to ' + c('$proxy_host') + ', and both forwarded headers vanished. Nothing warns you. ' + c('nginx -t') + ' is clean, the reload succeeds, and the breakage appears as an application that has suddenly lost the client IP or started issuing ' + c('http://') + ' links. Two defences: put the shared headers in a small snippet file and ' + c('include') + ' it in <em>every</em> block that proxies, so adding one header cannot silently subtract three; and when a proxy behaviour disappears after an unrelated edit, grep for a new list directive in the block before suspecting the application. Option 2 invents a position rule; options 3 and 4 invent mechanisms that the two measured lines contradict.',
            'Đây là cái luật đắt giá nhất của Nginx, và nó áp cho MỌI chỉ thị có giá trị dạng danh sách: ' + c('proxy_set_header') + ', ' + c('add_header') + ', ' + c('fastcgi_param') + ', ' + c('limit_req') + '. Giá trị được kế thừa từ cấp bao ngoài <b>chỉ trong lúc cấp bên trong chưa khai cái nào của riêng nó</b>. Ngay khoảnh khắc ' + c('/wipe') + ' viết một dòng ' + c('proxy_set_header') + ', ba dòng của khối server NGỪNG TỒN TẠI với location đó — đã đo: ' + c('Host') + ' quay về ' + c('$proxy_host') + ', và cả hai header forwarded đều biến mất. Không có gì cảnh báo bạn. ' + c('nginx -t') + ' sạch, lượt nạp lại thành công, và cú hỏng chỉ lộ ra dưới dạng một ứng dụng bỗng dưng mất IP client hoặc bắt đầu phát ra link ' + c('http://') + '. Hai cách phòng: để các header dùng chung vào một tệp mẩu nhỏ rồi ' + c('include') + ' nó vào MỌI khối có proxy, để việc thêm một header không thể âm thầm trừ đi ba; và khi một hành vi proxy biến mất sau một lần sửa chẳng liên quan, hãy grep tìm một chỉ thị danh sách mới trong khối đó TRƯỚC khi nghi ngờ ứng dụng. Phương án 2 bịa ra một luật theo vị trí; phương án 3 và 4 bịa ra những cơ chế mà hai dòng đo được kia bác bỏ.',
          ),
        }),

        // q16 · đáp án 3
        mcq({
          prompt: B(
            'A WebSocket endpoint behind a plain <code>proxy_pass</code> never upgrades — the browser reports a failed handshake and the application logs an ordinary GET. Which set of directives fixes it, and why is a <code>map</code> involved?',
            'Một endpoint WebSocket nằm sau một <code>proxy_pass</code> trần không bao giờ nâng cấp được — trình duyệt báo bắt tay thất bại còn ứng dụng ghi log một lượt GET bình thường. Bộ chỉ thị nào chữa được, và vì sao lại dính tới <code>map</code>?',
          ),
          options: [
            B(
              '<code>proxy_buffering off;</code> alone — the handshake fails because Nginx buffers the 101 response and the browser times out waiting for it',
              'Chỉ cần <code>proxy_buffering off;</code> — cú bắt tay hỏng vì Nginx đệm lại response 101 và trình duyệt hết giờ chờ nó',
            ),
            B(
              '<code>proxy_set_header Upgrade $http_upgrade;</code> alone; the connection header is hop-by-hop and Nginx regenerates it correctly once <code>Upgrade</code> is present',
              'Chỉ cần <code>proxy_set_header Upgrade $http_upgrade;</code>; header connection là loại từng-chặng và Nginx tự sinh lại nó cho đúng một khi đã có <code>Upgrade</code>',
            ),
            B(
              '<code>proxy_read_timeout 3600s;</code> alone — the upgrade does happen, but the idle socket is closed after 60 seconds and the browser reports that as a handshake failure',
              'Chỉ cần <code>proxy_read_timeout 3600s;</code> — cú nâng cấp có xảy ra, chỉ là socket rảnh bị đóng sau 60 giây và trình duyệt báo cái đó thành lỗi bắt tay',
            ),
            B(
              '<code>proxy_http_version 1.1;</code> plus <code>Upgrade $http_upgrade</code> plus <code>Connection $connection_upgrade</code>, where the map yields <code>upgrade</code> when the client asked and <code>close</code> when it did not',
              '<code>proxy_http_version 1.1;</code> cộng <code>Upgrade $http_upgrade</code> cộng <code>Connection $connection_upgrade</code>, với map cho ra <code>upgrade</code> khi client có hỏi và <code>close</code> khi không',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Three things are wrong at once and all three must be fixed. The protocol upgrade only exists in HTTP/1.1, and Nginx talks HTTP/1.0 upstream by default, so ' + c('proxy_http_version 1.1;') + ' comes first. ' + c('Upgrade') + ' and ' + c('Connection') + ' are hop-by-hop headers, which a proxy is required to consume rather than forward — measured against a bare ' + c('proxy_pass') + ', the application saw ' + c('upgrade:""') + ' and ' + c('conn:"close"') + ' even though the client had sent both — so both have to be re-created deliberately. The ' + c('map') + ' exists because hard-coding ' + c('Connection "upgrade"') + ' would be wrong for ordinary requests through the same block: it would tell the upstream to upgrade a connection nobody asked to upgrade, and it also destroys upstream keep-alive for the other 99% of traffic. ' + c('map $http_upgrade $connection_upgrade { default upgrade; "" close; }') + ' makes the value follow the request. One more directive belongs with them in practice: WebSocket connections sit idle for long stretches, and ' + c('proxy_read_timeout') + ' defaults to 60 seconds, so a long-lived socket needs it raised — but raising it alone, as option 3 suggests, cannot fix a handshake that never happened.',
            'Có BA thứ sai cùng lúc và cả ba đều phải chữa. Cú nâng cấp giao thức chỉ tồn tại trong HTTP/1.1, mà Nginx mặc định nói HTTP/1.0 với upstream, nên ' + c('proxy_http_version 1.1;') + ' phải có trước. ' + c('Upgrade') + ' và ' + c('Connection') + ' là header từng-chặng, thứ mà một proxy buộc phải TIÊU THỤ chứ không chuyển tiếp — đo thật trên một ' + c('proxy_pass') + ' trần, ứng dụng thấy ' + c('upgrade:""') + ' và ' + c('conn:"close"') + ' dù client đã gửi cả hai — nên cả hai phải được tạo lại một cách có chủ đích. Cái ' + c('map') + ' tồn tại vì gán cứng ' + c('Connection "upgrade"') + ' sẽ sai với các request thường đi qua cùng khối đó: nó bảo upstream nâng cấp một kết nối chẳng ai xin nâng cấp, và nó cũng phá luôn keep-alive lên upstream cho 99% lưu lượng còn lại. ' + c('map $http_upgrade $connection_upgrade { default upgrade; "" close; }') + ' làm cho giá trị đi theo từng request. Trên thực tế còn một chỉ thị nữa thuộc về bộ này: kết nối WebSocket nằm rảnh hàng dài, mà ' + c('proxy_read_timeout') + ' mặc định 60 giây, nên một socket sống lâu cần nâng nó lên — nhưng chỉ nâng mỗi nó, như phương án 3 gợi ý, thì không thể chữa được một cú bắt tay chưa từng xảy ra.',
          ),
        }),

        // q17 · đáp án 2
        mcq({
          prompt: B(
            'Same upstream, which takes three seconds before it sends any response header. Two locations, two timeouts, two measured results.' + code(
              'location /t2/ { proxy_read_timeout 2s; proxy_pass http://slow:8080/; }\n' +
              'location /t9/ { proxy_read_timeout 9s; proxy_pass http://slow:8080/; }\n' +
              '\n' +
              '/t2/slowhead  -> 504 in 2.008s\n' +
              '/t9/slowhead  -> 200 in 3.011s\n' +
              '[error] upstream timed out (110: Operation timed out) while\n' +
              '        reading response header from upstream',
            ),
            'Cùng một upstream, nó mất ba giây mới gửi header response đầu tiên. Hai location, hai mức timeout, hai kết quả đo được.' + code(
              'location /t2/ { proxy_read_timeout 2s; proxy_pass http://slow:8080/; }\n' +
              'location /t9/ { proxy_read_timeout 9s; proxy_pass http://slow:8080/; }\n' +
              '\n' +
              '/t2/slowhead  -> 504 in 2.008s\n' +
              '/t9/slowhead  -> 200 in 3.011s\n' +
              '[error] upstream timed out (110: Operation timed out) while\n' +
              '        reading response header from upstream',
            ),
          ),
          options: [
            B(
              '<code>proxy_read_timeout</code> caps the total time a proxied request may take, so raising it to 9s simply allowed the whole three-second response to finish',
              '<code>proxy_read_timeout</code> chặn TỔNG thời gian một request qua proxy được phép chạy, nên nâng lên 9s chỉ đơn giản là cho cả response ba giây kịp xong',
            ),
            B(
              'The 504 came from <code>proxy_connect_timeout</code>, which defaults to 2s; <code>proxy_read_timeout</code> was never reached and the second line proves the connection was simply slower to establish',
              'Cú 504 tới từ <code>proxy_connect_timeout</code>, vốn mặc định 2s; <code>proxy_read_timeout</code> chưa từng bị chạm tới và dòng thứ hai chứng minh kết nối chỉ là lâu thiết lập hơn',
            ),
            B(
              'It caps the gap between two successive reads from the upstream, and the first such gap is the wait for the response header — so a slow first byte is what tripped it, not a slow total',
              'Nó chặn KHOẢNG CÁCH giữa hai lượt đọc liên tiếp từ upstream, và khoảng cách đầu tiên chính là lúc chờ header response — nên thứ làm nó nổ là byte đầu chậm, chứ không phải tổng thời gian lâu',
            ),
            B(
              'A 504 always means the upstream returned 504 itself; Nginx passed it through unchanged and the timing is a coincidence of the test harness',
              'Một cú 504 luôn có nghĩa là chính upstream đã trả về 504; Nginx chỉ chuyển nguyên nó qua và con số thời gian chỉ là ngẫu nhiên của bộ đo',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Read the timeout as a gap, not a budget. ' + c('proxy_read_timeout') + ' (60s by default) is reset every time something arrives from the upstream, so it bounds the silence between two reads. The first silence is the wait for the response header, which is why a backend that thinks for three seconds trips a 2s limit at exactly 2.008s and the error log names the phase: <em>while reading response header from upstream</em>. Its siblings measure different silences — ' + c('proxy_connect_timeout') + ' bounds only the TCP handshake and cannot exceed 75s, and ' + c('proxy_send_timeout') + ' bounds writing the request. None of them is a total-time budget, which is why a streaming response can legitimately run for hours under a 60s read timeout: every chunk resets it. The corollary that catches people out is the reverse case — a request that legitimately takes four minutes will be cut at 60s no matter how healthy everything is, and the client sees a 504 that no application log explains, because the application is still happily computing. Option 1 confuses gap with total; option 2 misattributes the phase the error log names; option 4 mistakes a gateway status Nginx generates for one it forwarded.',
            'Hãy đọc timeout này như một KHOẢNG LẶNG, không phải một ngân sách. ' + c('proxy_read_timeout') + ' (mặc định 60s) được đặt lại mỗi lần có gì đó tới từ upstream, nên nó chặn khoảng im lặng giữa hai lượt đọc. Khoảng im lặng ĐẦU TIÊN chính là lúc chờ header response, và vì thế một backend nghĩ ba giây làm nổ giới hạn 2s đúng ở mốc 2,008s, còn error log gọi tên đúng cái pha đó: <em>while reading response header from upstream</em>. Các anh em của nó đo những khoảng lặng khác — ' + c('proxy_connect_timeout') + ' chỉ chặn cú bắt tay TCP và không vượt quá 75s được, còn ' + c('proxy_send_timeout') + ' chặn lúc ghi request lên. Không cái nào là ngân sách tổng thời gian, và đó là lý do một response dạng luồng hoàn toàn có thể chạy hàng giờ dưới một read timeout 60s: mỗi mẩu tới lại đặt lại đồng hồ. Hệ quả hay làm người ta ngã là chiều ngược lại — một request chính đáng mất bốn phút sẽ bị cắt ở giây thứ 60 dù mọi thứ đều khoẻ, và client nhận một cú 504 mà không log ứng dụng nào giải thích được, vì ứng dụng vẫn đang tính toán vui vẻ. Phương án 1 lẫn khoảng lặng với tổng; phương án 2 gán sai cái pha mà error log đã gọi tên; phương án 4 nhầm một mã cổng do Nginx tự sinh với một mã nó chuyển tiếp.',
          ),
        }),

        /* ── Chương 4 — tệp tĩnh (4 câu) ─────────────────────────────────── */

        // q18 · đáp án 1
        mcq({
          prompt: B(
            'A nine-byte file, and the ETag Nginx generated for it. What are the two halves?' + code(
              '$ curl -sI http://edge/top.txt | grep -iE \'etag|length\'\n' +
              'Content-Length: 9\n' +
              'ETag: "6a9f22c3-9"\n' +
              '$ stat -c \'%s %Y\' /srv/www/top.txt\n' +
              '9 1788814019          # 1788814019 == 0x6a9f22c3',
            ),
            'Một tệp chín byte, và cái ETag Nginx sinh ra cho nó. Hai nửa đó là gì?' + code(
              '$ curl -sI http://edge/top.txt | grep -iE \'etag|length\'\n' +
              'Content-Length: 9\n' +
              'ETag: "6a9f22c3-9"\n' +
              '$ stat -c \'%s %Y\' /srv/www/top.txt\n' +
              '9 1788814019          # 1788814019 == 0x6a9f22c3',
            ),
          ),
          options: [
            B(
              'A hash of the file contents and its length, so two servers holding identical bytes always produce the same ETag',
              'Một mã băm của nội dung tệp và độ dài của nó, nên hai máy chủ giữ những byte y hệt luôn sinh ra cùng một ETag',
            ),
            B(
              'Modification time in hex, then size in hex — so a deploy that rewrites files with identical contents changes every ETag and invalidates every cached asset',
              'Thời điểm sửa đổi ở hệ mười sáu, rồi kích thước ở hệ mười sáu — nên một lần deploy ghi lại các tệp có nội dung y hệt vẫn làm đổi MỌI ETag và huỷ hiệu lực mọi tài nguyên đã cache',
            ),
            B(
              'The inode number and the size; the ETag therefore survives a rewrite in place but changes when a file is replaced with a new one',
              'Số inode và kích thước; ETag vì thế sống sót qua một lượt ghi tại chỗ nhưng đổi khi tệp bị thay bằng một tệp mới',
            ),
            B(
              'A per-worker counter and the size, which is why the same file can hand out different ETags to two clients served by different workers',
              'Một bộ đếm theo worker và kích thước, và vì thế cùng một tệp có thể phát ra hai ETag khác nhau cho hai client do hai worker phục vụ',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The arithmetic in the transcript is the whole answer: ' + c('0x6a9f22c3') + ' is the file mtime as a Unix timestamp and ' + c('0x9') + ' is its length in bytes. Nginx never reads the contents to build an ETag, because doing so would mean hashing every file on every request. That choice is cheap and correct for a normal server, and it is a trap for a normal deploy pipeline. Anything that recreates files — ' + c('git clone') + ' into a fresh directory, an image build, a container that unpacks a tarball, ' + c('rsync') + ' without ' + c('--times') + ' — gives every file a new mtime, so every ETag changes and every returning visitor re-downloads assets whose bytes never moved. The two ways out are both cheap. Preserve mtimes at deploy time (' + c('rsync -a') + ' does, ' + c('cp -p') + ' does) so unchanged files keep their validators. Or stop relying on validators for assets that can be immutable: put a content hash in the filename, serve those with ' + c('expires 1y') + ' and ' + c('immutable') + ', and let only the HTML entry point revalidate. Option 1 describes what people assume; option 3 names a field Nginx does not use; option 4 would make ETags useless and is contradicted by any second request.',
            'Phép tính trong bản ghi chính là toàn bộ câu trả lời: ' + c('0x6a9f22c3') + ' là mtime của tệp dưới dạng dấu thời gian Unix, còn ' + c('0x9') + ' là độ dài của nó tính theo byte. Nginx KHÔNG BAO GIỜ đọc nội dung để dựng ETag, vì làm thế nghĩa là băm mọi tệp trong mọi request. Lựa chọn đó vừa rẻ vừa đúng với một máy chủ bình thường, và nó là cái bẫy với một đường ống deploy bình thường. Bất cứ thứ gì TẠO LẠI tệp — ' + c('git clone') + ' vào một thư mục mới, một lượt dựng ảnh, một container bung tarball, ' + c('rsync') + ' không kèm ' + c('--times') + ' — đều cấp cho mọi tệp một mtime mới, nên mọi ETag đổi và mọi khách quay lại phải tải lại những tài nguyên mà từng byte chưa hề nhúc nhích. Hai lối ra đều rẻ. Giữ nguyên mtime lúc deploy (' + c('rsync -a') + ' có giữ, ' + c('cp -p') + ' có giữ) để tệp không đổi giữ được bộ xác thực của nó. Hoặc thôi dựa vào bộ xác thực với những tài nguyên vốn có thể bất biến: nhét một mã băm nội dung vào tên tệp, phục vụ chúng với ' + c('expires 1y') + ' kèm ' + c('immutable') + ', và chỉ để mỗi trang HTML đầu vào đi xác thực lại. Phương án 1 mô tả thứ người ta VẪN TƯỞNG; phương án 3 gọi tên một trường Nginx không dùng; phương án 4 sẽ làm ETag thành vô dụng và bị bác ngay bởi bất kỳ request thứ hai nào.',
          ),
        }),

        // q19 · đáp án 3
        mcq({
          prompt: B(
            'The same CSS file, served twice: once small enough to fall under <code>gzip_min_length</code>, once large enough to be compressed. Why do three response headers differ?' + code(
              'uncompressed: ETag: "6a9f23cf-4"      Content-Length: 4\n' +
              '              Accept-Ranges: bytes\n' +
              'compressed:   ETag: W/"6a9f23cf-1900"  Content-Encoding: gzip\n' +
              '              (no Content-Length, no Accept-Ranges)',
            ),
            'Cùng một tệp CSS, phục vụ hai lần: một lần đủ nhỏ để rơi dưới <code>gzip_min_length</code>, một lần đủ lớn để được nén. Vì sao ba header response khác nhau?' + code(
              'không nén: ETag: "6a9f23cf-4"      Content-Length: 4\n' +
              '           Accept-Ranges: bytes\n' +
              'có nén:    ETag: W/"6a9f23cf-1900"  Content-Encoding: gzip\n' +
              '           (không Content-Length, không Accept-Ranges)',
            ),
          ),
          options: [
            B(
              'Compression replaces the ETag with a hash of the compressed bytes, and the <code>W/</code> prefix marks it as generated rather than read from disk',
              'Việc nén thay ETag bằng mã băm của các byte đã nén, và tiền tố <code>W/</code> đánh dấu rằng nó được sinh ra chứ không phải đọc từ đĩa',
            ),
            B(
              'The compressed response is smaller than <code>Content-Length</code> would allow Nginx to state honestly, so it omits the header and disables ranges as a side effect',
              'Response đã nén nhỏ hơn mức mà <code>Content-Length</code> cho phép Nginx khai một cách trung thực, nên nó bỏ header đó và tắt luôn range như một hệ quả phụ',
            ),
            B(
              'Ranges are disabled for every text type regardless of compression, and the missing <code>Content-Length</code> is a separate bug in the gzip filter',
              'Range bị tắt với mọi kiểu văn bản bất kể có nén hay không, còn <code>Content-Length</code> thiếu là một lỗi riêng của bộ lọc gzip',
            ),
            B(
              'The body is transformed after its length is known, so Nginx switches to chunked transfer, cannot offer byte ranges over a body the client never sees raw, and weakens the ETag because the entity is no longer byte-identical',
              'Thân response bị biến đổi SAU khi đã biết độ dài, nên Nginx chuyển sang truyền theo mẩu, không thể chào range byte trên một thân mà client không bao giờ thấy dạng thô, và làm YẾU cái ETag vì thực thể không còn giống hệt từng byte nữa',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Compression is a filter that runs after the static handler has already decided what it is sending, and all three differences follow from that ordering. The length of the compressed body is not known when the headers must go out, so ' + c('Content-Length') + ' is dropped and the response becomes chunked. Byte ranges refer to positions in the entity the client will receive, and Nginx cannot map a client range onto a body it compresses on the fly, so ' + c('Accept-Ranges') + ' disappears — which is exactly why a large file that must support resumable downloads should not be gzipped. And the ETag gains a ' + c('W/') + ' prefix: the resource is semantically the same but no longer octet-identical, so it is only valid for weak comparison, which conditional GETs use and range requests do not. Two practical consequences. First, the ETag stays derived from mtime and size — ' + c('W/"6a9f23cf-1900"') + ' is the same file, weakened, not a hash of the gzip output, which rules option 1 out. Second, the whole cost can be avoided for static assets by pre-compressing at build time and serving the ' + c('.gz') + ' with ' + c('gzip_static on') + ', which keeps a strong ETag and a real length. Options 2 and 3 invent limits and bugs that the transcript does not support.',
            'Nén là một bộ LỌC chạy sau khi bộ xử lý tệp tĩnh đã quyết xong nó sẽ gửi cái gì, và cả ba khác biệt đều suy ra từ thứ tự đó. Độ dài của thân đã nén chưa biết được vào lúc header buộc phải đi ra, nên ' + c('Content-Length') + ' bị bỏ và response chuyển sang truyền theo mẩu. Range byte nói tới vị trí trong thực thể mà client sẽ NHẬN, mà Nginx không ánh xạ nổi một range của client lên một thân nó nén ngay tại chỗ, nên ' + c('Accept-Ranges') + ' biến mất — và đó đúng là lý do một tệp lớn cần hỗ trợ tải tiếp thì không nên gzip. Còn ETag thì mọc thêm tiền tố ' + c('W/') + ': tài nguyên vẫn là nó về mặt ngữ nghĩa nhưng không còn giống hệt từng byte, nên nó chỉ hợp lệ cho phép so YẾU, thứ mà GET có điều kiện dùng còn request theo range thì không. Hai hệ quả thực dụng. Một, ETag vẫn dẫn xuất từ mtime và kích thước — ' + c('W/"6a9f23cf-1900"') + ' vẫn là cùng tệp đó, chỉ bị làm yếu đi, chứ không phải mã băm của output gzip, và điều đó loại phương án 1. Hai, toàn bộ cái giá này né được với tài nguyên tĩnh bằng cách nén sẵn lúc dựng rồi phục vụ tệp ' + c('.gz') + ' bằng ' + c('gzip_static on') + ', cách đó giữ được ETag mạnh và một độ dài thật. Phương án 2 và 3 bịa ra những giới hạn và lỗi mà bản ghi không hề ủng hộ.',
          ),
        }),

        // q20 · đáp án 0
        mcq({
          prompt: B(
            'A server has <code>gzip on;</code> and nothing else about gzip. Two files are requested with <code>Accept-Encoding: gzip</code>, both far above <code>gzip_min_length</code>.' + code(
              'page.html -> Content-Encoding: gzip   (no Vary header)\n' +
              'big.css   -> (not compressed)         (no Vary header)',
            ),
            'Một máy chủ có <code>gzip on;</code> và không có gì khác về gzip. Hai tệp được yêu cầu kèm <code>Accept-Encoding: gzip</code>, cả hai đều lớn hơn hẳn <code>gzip_min_length</code>.' + code(
              'page.html -> Content-Encoding: gzip   (không có header Vary)\n' +
              'big.css   -> (không được nén)          (không có header Vary)',
            ),
          ),
          options: [
            B(
              '<code>gzip_types</code> defaults to <code>text/html</code> only, so CSS needs adding explicitly; and <code>gzip_vary</code> defaults to off, so a shared cache in front can serve a gzipped body to a client that never asked for one',
              '<code>gzip_types</code> mặc định chỉ có <code>text/html</code>, nên CSS phải được thêm vào tường minh; còn <code>gzip_vary</code> mặc định TẮT, nên một bộ đệm dùng chung ở phía trước có thể phục vụ một thân đã gzip cho client chưa từng xin nó',
            ),
            B(
              'CSS is skipped because Nginx will not compress a file it can serve with <code>sendfile</code>; adding <code>sendfile off;</code> in that location is what enables compression for it',
              'CSS bị bỏ qua vì Nginx không nén tệp nào nó phục vụ được bằng <code>sendfile</code>; thêm <code>sendfile off;</code> vào location đó mới là thứ bật nén cho nó',
            ),
            B(
              'Both files should have been compressed; the CSS was skipped because its <code>Content-Type</code> was <code>application/octet-stream</code>, which means <code>mime.types</code> was not included',
              'Cả hai tệp lẽ ra đều được nén; CSS bị bỏ qua vì <code>Content-Type</code> của nó là <code>application/octet-stream</code>, tức là <code>mime.types</code> chưa được include',
            ),
            B(
              '<code>Vary</code> is missing because Nginx only emits it when more than one encoding is possible, and it will appear automatically once <code>gzip_types</code> lists a second type',
              '<code>Vary</code> vắng mặt vì Nginx chỉ phát nó ra khi có nhiều hơn một kiểu mã hoá khả dĩ, và nó sẽ tự hiện ra khi <code>gzip_types</code> liệt kê kiểu thứ hai',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Both surprises are defaults, and both were measured on a server whose only gzip line was ' + c('gzip on;') + '. The default ' + c('gzip_types') + ' is ' + c('text/html') + ' and nothing else — HTML is always compressed and cannot be removed from the list — so CSS, JavaScript, JSON and SVG stay uncompressed until you name them. And ' + c('gzip_vary') + ' is off, so responses go out with no ' + c('Vary: Accept-Encoding') + '. On a single origin that is harmless, because the client that gets the gzipped body is the one that asked. Put any shared cache in front — a CDN, another Nginx with ' + c('proxy_cache') + ', a corporate proxy — and it becomes a correctness bug: the cache stores one entry for the URL and hands the compressed body to the next client, whose ' + c('Accept-Encoding') + ' said nothing. So the minimal honest static block is three lines, not one: ' + c('gzip on') + ', a ' + c('gzip_types') + ' list, and ' + c('gzip_vary on') + '. Leave already-compressed formats out of that list — JPEG, PNG, WOFF2, MP4 — because re-compressing them burns CPU to make the file slightly larger. Options 2 and 3 invent mechanisms; option 4 invents a conditional emission rule that ' + c('gzip_vary') + ' does not have.',
            'Cả hai điều bất ngờ đều là MẶC ĐỊNH, và cả hai đều đo trên một máy chủ mà dòng gzip duy nhất là ' + c('gzip on;') + '. ' + c('gzip_types') + ' mặc định là ' + c('text/html') + ' và không gì khác — HTML luôn được nén và không gỡ khỏi danh sách được — nên CSS, JavaScript, JSON và SVG cứ nằm im không nén cho tới khi bạn gọi tên chúng. Còn ' + c('gzip_vary') + ' thì TẮT, nên response đi ra không kèm ' + c('Vary: Accept-Encoding') + '. Trên một origin đơn độc thì vô hại, vì client nhận thân đã nén chính là client đã xin. Nhưng đặt bất kỳ bộ đệm DÙNG CHUNG nào ở phía trước — một CDN, một Nginx khác có ' + c('proxy_cache') + ', một proxy công ty — thì nó thành lỗi tính đúng đắn: bộ đệm lưu MỘT mục cho cái URL rồi trao thân đã nén cho client kế tiếp, người mà ' + c('Accept-Encoding') + ' chẳng nói gì. Nên một khối tĩnh trung thực tối thiểu là BA dòng chứ không phải một: ' + c('gzip on') + ', một danh sách ' + c('gzip_types') + ', và ' + c('gzip_vary on') + '. Hãy để những định dạng vốn đã nén ra ngoài danh sách đó — JPEG, PNG, WOFF2, MP4 — vì nén lại chúng là đốt CPU để làm tệp to ra một tí. Phương án 2 và 3 bịa ra cơ chế; phương án 4 bịa ra một luật phát-có-điều-kiện mà ' + c('gzip_vary') + ' không hề có.',
          ),
        }),

        // q21 · đáp án 2
        mcq({
          prompt: B(
            'One directory on disk, three requests, three different statuses. <code>autoindex</code> is off and the directory holds no index file.' + code(
              'GET /noidx    -> 301  Location: http://edge/noidx/\n' +
              'GET /noidx/   -> 403\n' +
              'GET /nope.txt -> 404',
            ),
            'Một thư mục trên đĩa, ba request, ba mã trạng thái khác nhau. <code>autoindex</code> đang tắt và thư mục không có tệp index nào.' + code(
              'GET /noidx    -> 301  Location: http://edge/noidx/\n' +
              'GET /noidx/   -> 403\n' +
              'GET /nope.txt -> 404',
            ),
          ),
          options: [
            B(
              'The 403 is a permissions problem on the directory; with the right ownership all three would be 404 or 200',
              'Cú 403 là vấn đề quyền trên thư mục; chỉnh đúng chủ sở hữu thì cả ba sẽ thành 404 hoặc 200',
            ),
            B(
              'The 301 is Nginx refusing the request; a directory URL without a trailing slash is invalid HTTP and the redirect is how Nginx reports that',
              'Cú 301 là Nginx từ chối request; một URL thư mục thiếu dấu gạch chéo cuối là HTTP không hợp lệ và cú chuyển hướng là cách Nginx báo điều đó',
            ),
            B(
              'Nginx redirects to the canonical slashed form so relative links resolve, then refuses to list a directory it may not describe — and 403 rather than 404 confirms to a stranger that the directory exists',
              'Nginx chuyển hướng về dạng chuẩn có dấu gạch chéo để link tương đối phân giải đúng, rồi từ chối liệt kê một thư mục nó không được phép mô tả — và 403 thay vì 404 xác nhận với người lạ rằng thư mục đó CÓ THẬT',
            ),
            B(
              'All three statuses come from <code>try_files</code>: it returns 301 for a directory, 403 for an empty one and 404 for a missing file, in that fixed order',
              'Cả ba mã đều tới từ <code>try_files</code>: nó trả 301 cho thư mục, 403 cho thư mục rỗng và 404 cho tệp thiếu, đúng theo thứ tự cố định đó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Three different answers to three different questions. The 301 exists because ' + c('/noidx') + ' and ' + c('/noidx/') + ' are different base URLs for relative links: without it, ' + c('<img src="a.png">') + ' inside the index page would resolve against the parent. Nginx builds that redirect from ' + c('$host') + ' and the port it thinks it is on, which is why a proxied setup that never sets ' + c('Host') + ' can produce a redirect to the internal name — the classic symptom of a missing ' + c('proxy_set_header Host $host') + ', fixable at the edge with ' + c('absolute_redirect off') + '. The 403 is the interesting one: the path resolves to a real directory, ' + c('index') + ' finds nothing to serve and ' + c('autoindex') + ' is off, so Nginx has a resource it may not describe. It says forbidden rather than not-found, and in doing so it tells a stranger that the directory is there. If that distinction matters for a given tree, collapse it deliberately — ' + c('error_page 403 = 404 /404.html') + ' or a ' + c('return 404') + ' in that location. Option 1 blames permissions, which would show as a different error-log line entirely; option 2 misreads a canonicalisation as a rejection; option 4 credits ' + c('try_files') + ', which is not even present in this config.',
            'Ba câu trả lời khác nhau cho ba câu hỏi khác nhau. Cú 301 tồn tại vì ' + c('/noidx') + ' và ' + c('/noidx/') + ' là hai URL CƠ SỞ khác nhau cho link tương đối: không có nó thì ' + c('<img src="a.png">') + ' trong trang index sẽ phân giải theo thư mục cha. Nginx dựng cú chuyển hướng ấy từ ' + c('$host') + ' và cái cổng nó tưởng mình đang ở, và đó là lý do một bố cục có proxy mà không đặt ' + c('Host') + ' có thể đẻ ra một cú chuyển hướng về tên nội bộ — triệu chứng kinh điển của việc thiếu ' + c('proxy_set_header Host $host') + ', chữa được ở lớp biên bằng ' + c('absolute_redirect off') + '. Cú 403 mới là cái thú vị: đường dẫn phân giải ra một thư mục CÓ THẬT, ' + c('index') + ' không tìm được gì để phục vụ và ' + c('autoindex') + ' đang tắt, nên Nginx đang cầm một tài nguyên mà nó không được phép mô tả. Nó nói CẤM chứ không nói KHÔNG CÓ, và khi làm vậy nó khai với người lạ rằng thư mục đó nằm ở đó. Nếu sự phân biệt đó có ý nghĩa với một nhánh cụ thể thì hãy xoá nó đi một cách có chủ đích — ' + c('error_page 403 = 404 /404.html') + ' hoặc một ' + c('return 404') + ' trong location ấy. Phương án 1 đổ cho quyền, thứ sẽ hiện ra bằng một dòng error log hoàn toàn khác; phương án 2 đọc một cú chuẩn hoá thành một cú từ chối; phương án 4 quy công cho ' + c('try_files') + ', thứ thậm chí không có mặt trong cấu hình này.',
          ),
        }),

        /* ── Chương 5 — bộ đệm proxy (4 câu) ─────────────────────────────── */

        // q22 · đáp án 1
        mcq({
          prompt: B(
            'A cache is configured with <code>proxy_cache_valid 200 5m;</code>. Two endpoints, two requests each, <code>$upstream_cache_status</code> logged.' + code(
              '/plain   (upstream sends no cache headers)   -> MISS, HIT\n' +
              '/cookie  (upstream sends Set-Cookie)         -> MISS, MISS',
            ),
            'Một bộ đệm cấu hình với <code>proxy_cache_valid 200 5m;</code>. Hai endpoint, mỗi cái hai request, ghi lại <code>$upstream_cache_status</code>.' + code(
              '/plain   (upstream không gửi header cache nào) -> MISS, HIT\n' +
              '/cookie  (upstream có gửi Set-Cookie)          -> MISS, MISS',
            ),
          ),
          options: [
            B(
              'The <code>Set-Cookie</code> response was cached but revalidated every time, so the second request was a HIT that Nginx reported as MISS for accounting reasons',
              'Response có <code>Set-Cookie</code> vẫn được cache nhưng bị xác thực lại mỗi lần, nên request thứ hai thật ra là HIT mà Nginx báo thành MISS vì lý do hạch toán',
            ),
            B(
              'Nginx refuses to store a response carrying <code>Set-Cookie</code>, because one user\'s session would then be served to everyone; <code>proxy_cache_valid</code> cannot override that on its own',
              'Nginx TỪ CHỐI lưu một response mang <code>Set-Cookie</code>, vì phiên của một người dùng khi đó sẽ được phục vụ cho tất cả mọi người; riêng <code>proxy_cache_valid</code> không ghi đè được điều đó',
            ),
            B(
              'Cookies make the cache key unique per client, so every request is a MISS for its own key and the entries simply never collide',
              'Cookie làm khoá bộ đệm thành duy nhất cho từng client, nên mọi request đều MISS trên khoá của riêng nó và các mục đơn giản là không bao giờ đụng nhau',
            ),
            B(
              'The second endpoint was never cached because <code>proxy_cache_valid</code> only applies to responses that already carry an explicit <code>Cache-Control</code>',
              'Endpoint thứ hai không bao giờ được cache vì <code>proxy_cache_valid</code> chỉ áp cho những response vốn đã mang sẵn một <code>Cache-Control</code> tường minh',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A shared cache stores one copy per key and serves it to everyone, so a response that identifies a person must never enter it. Nginx enforces that automatically: ' + c('Set-Cookie') + ' in the upstream response makes the response uncacheable, as do ' + c('Cache-Control: no-store') + ', ' + c('no-cache') + ' and ' + c('private') + ' — all measured returning MISS twice. ' + c('proxy_cache_valid') + ' does not overrule them; it only supplies a lifetime for responses that were cacheable in the first place. There is a way to overrule them, and it is where real leaks come from: ' + c('proxy_ignore_headers Set-Cookie') + ' tells Nginx to store the response anyway, which is correct for an endpoint that sets a harmless analytics cookie and catastrophic for one that sets a session. If you use it, pair it with ' + c('proxy_hide_header Set-Cookie') + ' so the stored copy cannot hand someone else\'s cookie to the next visitor, and scope it to the exact location rather than the server block. Option 3 is the dangerous misconception — the default key contains no cookie at all, so one cached entry is shared by every client; options 1 and 4 both invent conditions the transcript rules out.',
            'Một bộ đệm DÙNG CHUNG lưu một bản cho mỗi khoá rồi phục vụ nó cho tất cả mọi người, nên một response nhận diện một CON NGƯỜI thì tuyệt đối không được vào đó. Nginx tự áp điều đó: ' + c('Set-Cookie') + ' trong response của upstream làm response không cache được, ' + c('Cache-Control: no-store') + ', ' + c('no-cache') + ' và ' + c('private') + ' cũng vậy — cả ba đều đã đo và đều ra MISS hai lần. ' + c('proxy_cache_valid') + ' không phủ quyết được chúng; nó chỉ cấp thời hạn cho những response vốn đã cache được. Có một cách phủ quyết, và đó chính là nơi các vụ rò rỉ thật sinh ra: ' + c('proxy_ignore_headers Set-Cookie') + ' bảo Nginx cứ lưu bất chấp, đúng với một endpoint chỉ đặt một cookie thống kê vô hại và thảm hoạ với một endpoint đặt phiên đăng nhập. Nếu dùng nó, hãy đi kèm ' + c('proxy_hide_header Set-Cookie') + ' để bản đã lưu không thể trao cookie của người này cho khách kế tiếp, và giới hạn nó đúng vào location đó chứ đừng đặt ở khối server. Phương án 3 chính là ngộ nhận nguy hiểm — khoá mặc định KHÔNG chứa cookie nào cả, nên một mục đã cache được dùng chung bởi mọi client; phương án 1 và 4 đều bịa ra những điều kiện mà bản ghi bác bỏ.',
          ),
        }),

        // q23 · đáp án 3
        mcq({
          prompt: B(
            'No <code>proxy_cache_key</code> is set, so the default applies. Three requests were measured:' + code(
              'proxy_cache_key  $scheme$proxy_host$request_uri     # the default\n' +
              '\n' +
              'GET /plain?v=1   -> MISS\n' +
              'GET /plain?v=1   -> HIT\n' +
              'GET /plain?v=2   -> MISS',
            ),
            'Không đặt <code>proxy_cache_key</code> nào nên mặc định có hiệu lực. Ba request đã được đo:' + code(
              'proxy_cache_key  $scheme$proxy_host$request_uri     # bản mặc định\n' +
              '\n' +
              'GET /plain?v=1   -> MISS\n' +
              'GET /plain?v=1   -> HIT\n' +
              'GET /plain?v=2   -> MISS',
            ),
          ),
          options: [
            B(
              'The key includes the client <code>Host</code>, so two hostnames pointing at the same backend get separate entries automatically',
              'Khoá có chứa <code>Host</code> của client, nên hai tên máy cùng trỏ về một backend tự động có hai mục riêng',
            ),
            B(
              'The query string is excluded from the default key; the third line is a MISS only because the five-minute lifetime had expired between requests',
              'Chuỗi truy vấn KHÔNG nằm trong khoá mặc định; dòng thứ ba là MISS chỉ vì thời hạn năm phút đã hết giữa các request',
            ),
            B(
              '<code>$request_uri</code> is normalised before it enters the key, so <code>?v=1</code> and <code>?v=2</code> collapse and the third MISS must come from eviction',
              '<code>$request_uri</code> được chuẩn hoá trước khi vào khoá, nên <code>?v=1</code> và <code>?v=2</code> gộp lại làm một và cú MISS thứ ba phải do bị trục xuất',
            ),
            B(
              'The query string is part of the key because <code>$request_uri</code> is the raw path plus query — but <code>$proxy_host</code> is the upstream, not the client Host, so two public hostnames share one entry',
              'Chuỗi truy vấn NẰM TRONG khoá vì <code>$request_uri</code> là đường dẫn thô cộng chuỗi truy vấn — nhưng <code>$proxy_host</code> là UPSTREAM chứ không phải Host của client, nên hai tên máy công khai dùng chung MỘT mục',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Read the default key one variable at a time and both its behaviours fall out. ' + c('$request_uri') + ' is the raw path <em>and</em> query string, so ' + c('?v=1') + ' and ' + c('?v=2') + ' are different entries — measured — and any URL where a tracking parameter varies per visitor will shred your hit rate unless you normalise it into the key yourself. ' + c('$proxy_host') + ' is the name from the ' + c('proxy_pass') + ' line, not the client Host, so if one Nginx serves ' + c('a.example.com') + ' and ' + c('b.example.com') + ' from the same upstream, both share a single cache entry and whichever site is requested first wins — a genuine cross-site content leak that no error will announce. The fix is to say what you mean: ' + c('proxy_cache_key $scheme$host$request_uri;') + ' when the tenant matters, and add a normalised variable rather than the whole query when only some parameters do. The same reasoning covers the <code>Vary</code> problem: if the upstream varies on a header, that header belongs in the key too, or the cache will answer with the wrong variant. Options 1, 2 and 3 each contradict one of the three measured lines.',
            'Hãy đọc khoá mặc định từng biến một và cả hai hành vi của nó lộ ra. ' + c('$request_uri') + ' là đường dẫn THÔ CỘNG chuỗi truy vấn, nên ' + c('?v=1') + ' và ' + c('?v=2') + ' là hai mục khác nhau — đã đo — và bất kỳ URL nào có một tham số theo dõi thay đổi theo từng khách sẽ băm nát tỉ lệ trúng của bạn trừ khi bạn tự chuẩn hoá nó vào khoá. ' + c('$proxy_host') + ' là cái tên lấy từ dòng ' + c('proxy_pass') + ', KHÔNG phải Host của client, nên nếu một Nginx phục vụ ' + c('a.example.com') + ' và ' + c('b.example.com') + ' từ cùng một upstream thì cả hai dùng chung MỘT mục và site nào được yêu cầu trước thì site đó thắng — một vụ rò rỉ nội dung chéo site có thật mà không lỗi nào báo. Cách chữa là nói đúng thứ bạn muốn: ' + c('proxy_cache_key $scheme$host$request_uri;') + ' khi bên thuê quan trọng, và thêm một biến đã chuẩn hoá thay vì cả chuỗi truy vấn khi chỉ vài tham số là quan trọng. Cùng lý lẽ đó phủ luôn vấn đề <code>Vary</code>: nếu upstream thay đổi theo một header thì header đó cũng thuộc về khoá, không thì bộ đệm sẽ trả lời bằng đúng biến thể sai. Phương án 1, 2 và 3 mỗi cái đều mâu thuẫn với một trong ba dòng đo được.',
          ),
        }),

        // q24 · đáp án 0
        mcq({
          prompt: B(
            'The block sets <code>add_header X-Cache $upstream_cache_status always;</code>. A GET carries the header; a POST to the same URL carries no such header at all. Why?',
            'Khối này đặt <code>add_header X-Cache $upstream_cache_status always;</code>. Một lượt GET có mang header đó; một lượt POST tới cùng URL thì không mang header nào như thế cả. Vì sao?',
          ),
          options: [
            B(
              '<code>proxy_cache_methods</code> defaults to GET and HEAD, so the POST never entered the cache module and the variable stayed empty — and Nginx omits a header whose value is an empty string',
              '<code>proxy_cache_methods</code> mặc định là GET và HEAD, nên lượt POST chưa từng đi vào module cache và biến đó ở lại rỗng — mà Nginx BỎ HẲN một header có giá trị là chuỗi rỗng',
            ),
            B(
              '<code>always</code> only applies to safe methods; for POST you need <code>add_header ... always always</code> or the header is dropped at the filter stage',
              '<code>always</code> chỉ áp cho các phương thức an toàn; với POST thì bạn cần <code>add_header ... always always</code> nếu không header bị bỏ ở khâu lọc',
            ),
            B(
              'The POST returned a 201 rather than a 200, and <code>add_header</code> without an explicit status list covers only 200 and 204',
              'Lượt POST trả về 201 chứ không phải 200, và <code>add_header</code> không kèm danh sách mã trạng thái thì chỉ phủ 200 và 204',
            ),
            B(
              'The header was sent with the literal value <code>BYPASS</code>, and the tool used to inspect the response hides headers whose value is a known cache status',
              'Header đó ĐÃ được gửi với giá trị nguyên văn <code>BYPASS</code>, và công cụ dùng để soi response ẩn đi những header có giá trị là một trạng thái cache đã biết',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two independent rules combine into one confusing symptom. First, the proxy cache only considers the methods listed in ' + c('proxy_cache_methods') + ', which defaults to ' + c('GET HEAD') + ' — a POST is passed straight through and ' + c('$upstream_cache_status') + ' is never assigned, so it evaluates to the empty string. Second, and this is the part worth generalising far beyond caching: <b>' + c('add_header') + ' with an empty value emits nothing at all</b>. Not an empty header, not a blank line — the header simply does not appear. That is why a debug header wired to a variable is a lie detector with two readings: a value means the module ran, and <em>no header at all</em> means the variable was empty, which usually means the module never ran on this request. When you want the difference to be visible, give the variable a floor: ' + c('map $upstream_cache_status $cache_dbg { default $upstream_cache_status; "" "NONE"; }') + '. Options 2 and 3 invent rules about ' + c('always') + ' and status lists that do not exist — ' + c('always') + ' exists precisely so error and non-2xx responses keep the header — and option 4 blames the tool for a header the server never sent.',
            'Hai luật độc lập gộp lại thành một triệu chứng gây rối. Một, bộ đệm proxy chỉ xét những phương thức liệt kê trong ' + c('proxy_cache_methods') + ', mặc định là ' + c('GET HEAD') + ' — một lượt POST đi thẳng qua và ' + c('$upstream_cache_status') + ' không bao giờ được gán, nên nó tính ra chuỗi rỗng. Hai, và đây mới là phần đáng khái quát ra xa khỏi chuyện bộ đệm: <b>' + c('add_header') + ' với giá trị rỗng thì KHÔNG PHÁT RA GÌ CẢ</b>. Không phải một header rỗng, không phải một dòng trắng — cái header đó đơn giản là không xuất hiện. Chính vì thế một header gỡ rối nối vào một biến là một máy dò nói dối có HAI cách đọc: có giá trị nghĩa là module đã chạy, còn KHÔNG CÓ HEADER NÀO nghĩa là biến rỗng, mà thường là module chưa từng chạy trên request này. Khi bạn muốn sự khác biệt ấy nhìn thấy được thì hãy cho biến một cái sàn: ' + c('map $upstream_cache_status $cache_dbg { default $upstream_cache_status; "" "NONE"; }') + '. Phương án 2 và 3 bịa ra những luật về ' + c('always') + ' và danh sách mã trạng thái vốn không tồn tại — ' + c('always') + ' sinh ra đúng để response lỗi và không phải 2xx vẫn giữ được header — còn phương án 4 đổ lỗi cho công cụ về một header mà máy chủ chưa từng gửi.',
          ),
        }),

        // q25 · đáp án 2
        mcq({
          prompt: B(
            'A five-step measurement against one cached URL. The backend was stopped between step 2 and step 3, and started again before step 5.' + code(
              'proxy_cache_valid 200 2s;\n' +
              'proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;\n' +
              'proxy_cache_background_update on;\n' +
              '\n' +
              '1 MISS   2 HIT   3 STALE   4 UPDATING   5 HIT',
            ),
            'Một phép đo năm bước trên một URL đã cache. Backend bị DỪNG giữa bước 2 và bước 3, rồi bật lại trước bước 5.' + code(
              'proxy_cache_valid 200 2s;\n' +
              'proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;\n' +
              'proxy_cache_background_update on;\n' +
              '\n' +
              '1 MISS   2 HIT   3 STALE   4 UPDATING   5 HIT',
            ),
          ),
          options: [
            B(
              'STALE and UPDATING both mean the client waited for the backend and got a 504 body from the cache; only steps 2 and 5 were real responses',
              'STALE và UPDATING đều nghĩa là client đã CHỜ backend rồi nhận một thân 504 lấy từ bộ đệm; chỉ bước 2 và bước 5 mới là response thật',
            ),
            B(
              'The entry expired after two seconds, so steps 3 and 4 were served from the backend; the labels merely record that the old copy was deleted first',
              'Mục đó hết hạn sau hai giây nên bước 3 và 4 được phục vụ từ backend; các nhãn kia chỉ ghi lại rằng bản cũ đã bị xoá trước',
            ),
            B(
              'The copy was expired but usable: <code>use_stale</code> served it while the backend was down, and <code>background_update</code> let a later request be answered from the stale copy while a refresh ran behind it',
              'Bản đó đã hết hạn nhưng vẫn DÙNG ĐƯỢC: <code>use_stale</code> phục vụ nó trong lúc backend chết, và <code>background_update</code> cho một request sau đó được trả lời bằng bản cũ trong khi một lượt làm mới chạy phía sau',
            ),
            B(
              'STALE is impossible with a two-second validity; the measurement must have used a second cache zone that was still holding an older entry',
              'STALE là bất khả với thời hạn hai giây; phép đo hẳn đã dùng một vùng đệm thứ hai vẫn còn giữ một mục cũ hơn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Expired is not the same as useless, and this pair of directives is what turns that distinction into uptime. After two seconds the entry is stale; without ' + c('proxy_cache_use_stale') + ' the next request would go to a backend that is down and the client would get a 502. With it, Nginx answers from the stale copy and logs STALE — the site stays up on content that is a few seconds old, which for most pages is a far better failure than an error page. UPDATING is the neighbouring case: a refresh is already in flight, and rather than queue behind it (or pile on more upstream calls) this request is answered from the old copy too. ' + c('proxy_cache_background_update on') + ' is what makes that refresh happen off the request path instead of making one unlucky visitor wait for it. The third member of the family is ' + c('proxy_cache_lock on') + ', which handles the cold-cache stampede: when twenty requests miss the same key at once, one goes upstream and the rest wait for it rather than turning a traffic spike into twenty identical backend calls. Options 1 and 2 both misread the labels as failures or as fresh fetches; option 4 denies a state that was measured.',
            'HẾT HẠN không đồng nghĩa với VÔ DỤNG, và cặp chỉ thị này chính là thứ biến sự phân biệt ấy thành thời gian sống của hệ thống. Sau hai giây thì mục đó cũ; không có ' + c('proxy_cache_use_stale') + ' thì request kế tiếp sẽ đi tới một backend đã chết và client nhận một cú 502. Có nó, Nginx trả lời bằng bản cũ và ghi log STALE — trang web đứng vững trên một nội dung già vài giây, mà với hầu hết các trang thì đó là kiểu hỏng tốt hơn hẳn một trang lỗi. UPDATING là ca hàng xóm: một lượt làm mới đang bay, và thay vì xếp hàng chờ nó (hay chồng thêm lời gọi lên upstream), request này cũng được trả lời từ bản cũ. ' + c('proxy_cache_background_update on') + ' chính là thứ khiến lượt làm mới ấy diễn ra NGOÀI đường đi của request, thay vì bắt một vị khách xui xẻo ngồi chờ nó. Thành viên thứ ba của gia đình này là ' + c('proxy_cache_lock on') + ', lo vụ giẫm đạp lúc bộ đệm nguội: khi hai mươi request cùng trượt một khoá một lúc, một cái đi lên upstream còn phần còn lại chờ nó, thay vì biến một cơn tăng lưu lượng thành hai mươi lời gọi backend y hệt nhau. Phương án 1 và 2 đều đọc các nhãn kia thành lỗi hoặc thành lượt lấy mới; phương án 4 phủ nhận một trạng thái đã đo được.',
          ),
        }),

        /* ── Chương 6 — TLS và HTTP/2 (4 câu) ────────────────────────────── */

        // q26 · đáp án 3
        mcq({
          prompt: B(
            'The same two virtual hosts, written two ways, measured on two versions. What changed between them?' + code(
              '# nginx 1.24.0    server a: listen 443 ssl http2;   server b: listen 443 ssl;\n' +
              '  a.test -> HTTP/2      b.test -> HTTP/2\n' +
              '\n' +
              '# nginx 1.27.5    server a: listen 443 ssl; http2 on;   server b: listen 443 ssl;\n' +
              '  a.test -> HTTP/2      b.test -> HTTP/1.1',
            ),
            'Cùng hai virtual host, viết theo hai cách, đo trên hai phiên bản. Cái gì đã đổi giữa chúng?' + code(
              '# nginx 1.24.0    server a: listen 443 ssl http2;   server b: listen 443 ssl;\n' +
              '  a.test -> HTTP/2      b.test -> HTTP/2\n' +
              '\n' +
              '# nginx 1.27.5    server a: listen 443 ssl; http2 on;   server b: listen 443 ssl;\n' +
              '  a.test -> HTTP/2      b.test -> HTTP/1.1',
            ),
          ),
          options: [
            B(
              'Nothing changed in behaviour; 1.27 simply refuses HTTP/2 for a host whose certificate does not advertise it through ALPN, and <code>b.test</code> uses a different certificate',
              'Hành vi không đổi gì; 1.27 chỉ đơn giản từ chối HTTP/2 với một host mà chứng chỉ không quảng bá nó qua ALPN, và <code>b.test</code> dùng một chứng chỉ khác',
            ),
            B(
              '1.27 disabled HTTP/2 by default for security reasons, so <code>http2 on</code> is now required in every block and <code>b.test</code> shows the new default',
              '1.27 đã tắt HTTP/2 theo mặc định vì lý do bảo mật, nên giờ mọi khối đều phải có <code>http2 on</code>, và <code>b.test</code> cho thấy mặc định mới',
            ),
            B(
              'Both forms are per-server; the 1.24 result is a measurement error caused by curl reusing a connection it had already upgraded for <code>a.test</code>',
              'Cả hai dạng đều theo từng server; kết quả 1.24 là lỗi đo do curl dùng lại một kết nối nó đã nâng cấp sẵn cho <code>a.test</code>',
            ),
            B(
              '<code>listen ... http2</code> is a property of the listening socket, so it enabled HTTP/2 for every host on that port, while <code>http2 on</code> is a per-server directive that only affects the block it is written in',
              '<code>listen ... http2</code> là thuộc tính của SOCKET NGHE, nên nó bật HTTP/2 cho mọi host trên cổng đó, còn <code>http2 on</code> là chỉ thị theo TỪNG SERVER, chỉ tác động lên khối nó được viết vào',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The old parameter attached to the socket, not to the virtual host, and the measurement makes that concrete: on 1.24 the block for ' + c('b.test') + ' never mentioned HTTP/2 and was served over HTTP/2 anyway, purely because a neighbouring block on the same ' + c('listen 443') + ' had asked for it. That was surprising in both directions — you could not enable it for one host only, and you could accidentally enable it for a host that was not ready. Nginx 1.25.1 introduced the ' + c('http2') + ' directive, which lives in the ' + c('http') + ' or ' + c('server') + ' context and applies per virtual server; on 1.27.5 with the new form, ' + c('b.test') + ' stays on HTTP/1.1. The old parameter still works but ' + c('nginx -t') + ' prints <em>the "listen ... http2" directive is deprecated, use the "http2" directive instead</em>, which is a warning worth acting on rather than scrolling past. One thing did not change: HTTP/2 is negotiated through ALPN during the TLS handshake, so a client that does not offer h2 simply gets HTTP/1.1 on the same port — no separate listener and no fallback logic to write. Option 1 blames the certificate, option 2 invents a default flip, option 3 dismisses a result that reproduces every time.',
            'Tham số cũ gắn vào SOCKET chứ không gắn vào virtual host, và phép đo làm điều đó thành cụ thể: trên 1.24 cái khối của ' + c('b.test') + ' không hề nhắc tới HTTP/2 mà vẫn được phục vụ bằng HTTP/2, thuần tuý vì một khối hàng xóm trên cùng ' + c('listen 443') + ' đã xin nó. Điều đó gây bất ngờ theo cả hai chiều — bạn không thể bật riêng cho một host, và bạn có thể vô tình bật cho một host chưa sẵn sàng. Nginx 1.25.1 đưa ra chỉ thị ' + c('http2') + ', nó sống trong ngữ cảnh ' + c('http') + ' hoặc ' + c('server') + ' và áp theo từng virtual server; trên 1.27.5 với dạng mới, ' + c('b.test') + ' ở lại HTTP/1.1. Tham số cũ vẫn chạy nhưng ' + c('nginx -t') + ' in ra <em>the "listen ... http2" directive is deprecated, use the "http2" directive instead</em>, một cảnh báo đáng để hành động chứ không đáng cuộn qua. Có một thứ KHÔNG đổi: HTTP/2 được thương lượng qua ALPN ngay trong cú bắt tay TLS, nên một client không chào h2 thì đơn giản nhận HTTP/1.1 trên cùng cổng đó — không cần listener riêng và không phải viết logic lùi nào. Phương án 1 đổ cho chứng chỉ, phương án 2 bịa ra một cú lật mặc định, phương án 3 gạt bỏ một kết quả tái hiện được mọi lần.',
          ),
        }),

        // q27 · đáp án 1
        mcq({
          prompt: B(
            'A deploy script health-checks the site and gets this. The TLS block itself is healthy and <code>https://edge/</code> answers 200.' + code(
              '$ curl -s http://edge:443/\n' +
              '&lt;html&gt;\n' +
              '&lt;head&gt;&lt;title&gt;400 The plain HTTP request was sent to HTTPS port&lt;/title&gt;',
            ),
            'Một script deploy chốt kiểm site và nhận về thế này. Bản thân khối TLS vẫn khoẻ và <code>https://edge/</code> trả 200.' + code(
              '$ curl -s http://edge:443/\n' +
              '&lt;html&gt;\n' +
              '&lt;head&gt;&lt;title&gt;400 The plain HTTP request was sent to HTTPS port&lt;/title&gt;',
            ),
          ),
          options: [
            B(
              'The certificate chain is incomplete, and Nginx reports a broken chain as a 400 on the first request of a new connection',
              'Chuỗi chứng chỉ bị thiếu, và Nginx báo một chuỗi hỏng thành cú 400 ở request đầu tiên của một kết nối mới',
            ),
            B(
              'The probe spoke cleartext HTTP to a listener expecting a TLS handshake; Nginx recognised the plaintext request line and answered in plaintext so the mistake is visible instead of silent',
              'Phép thử nói HTTP trần với một listener đang chờ một cú bắt tay TLS; Nginx nhận ra dòng request dạng chữ thường rồi trả lời cũng bằng chữ thường để cái nhầm lẫn ấy hiện ra chứ không im lặng',
            ),
            B(
              'Port 443 is being served by the HTTP block because <code>ssl</code> was omitted from the <code>listen</code> line, and 400 is what an HTTP block returns for a request it cannot decrypt',
              'Cổng 443 đang do khối HTTP phục vụ vì thiếu chữ <code>ssl</code> trên dòng <code>listen</code>, và 400 là thứ một khối HTTP trả về cho request nó không giải mã được',
            ),
            B(
              'Nginx redirects HTTP to HTTPS by default, and 400 is what happens when the redirect target is the same port the request arrived on',
              'Nginx mặc định chuyển hướng HTTP sang HTTPS, và 400 là thứ xảy ra khi đích chuyển hướng trùng đúng cổng mà request vừa tới',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Nothing is wrong with the server. A TLS listener expects the first bytes of a connection to be a ClientHello; here they were the ASCII of ' + c('GET / HTTP/1.1') + '. Nginx detects that specific mistake and, instead of dropping the connection or emitting a TLS alert nobody can read, replies with a plaintext 400 whose title says exactly what happened — one of the most useful error messages it produces, because it names the confusion rather than the symptom. The lesson is about health checks more than about TLS: a probe must be told the scheme, and ' + c('curl http://host:443') + ' is a probe that lies about its own protocol. The mirror-image mistake is worth knowing too, because it is silent: sending TLS to a plain HTTP port produces no HTTP response at all, just a connection that closes or a parse error in the access log with a garbage request line. Options 1 and 3 both invent statuses for conditions that would fail elsewhere — an incomplete chain fails during the handshake, and a missing ' + c('ssl') + ' parameter would make ' + c('https://') + ' fail rather than ' + c('http://') + ' — and option 4 credits Nginx with a redirect it never performs on its own.',
            'Máy chủ không có gì sai cả. Một listener TLS chờ những byte đầu tiên của kết nối là một ClientHello; ở đây chúng lại là mã ASCII của ' + c('GET / HTTP/1.1') + '. Nginx phát hiện đúng cái nhầm lẫn đó và, thay vì cắt kết nối hay phát ra một cảnh báo TLS chẳng ai đọc nổi, nó trả lời bằng một cú 400 dạng chữ thường mà tiêu đề nói chính xác chuyện gì đã xảy ra — một trong những thông báo lỗi hữu ích nhất nó sinh ra, vì nó gọi tên sự NHẦM LẪN chứ không phải triệu chứng. Bài học ở đây thuộc về chốt kiểm sức khoẻ hơn là thuộc về TLS: một phép thử phải được cho biết giao thức, và ' + c('curl http://host:443') + ' là một phép thử nói dối về chính giao thức của nó. Cái nhầm đối xứng cũng đáng biết, vì nó IM LẶNG: gửi TLS vào một cổng HTTP trần thì không có response HTTP nào cả, chỉ có một kết nối bị đóng hoặc một lỗi phân tích trong access log với một dòng request toàn rác. Phương án 1 và 3 đều bịa ra mã trạng thái cho những tình huống vốn hỏng ở chỗ khác — một chuỗi thiếu thì hỏng ngay trong cú bắt tay, còn thiếu tham số ' + c('ssl') + ' thì sẽ làm ' + c('https://') + ' hỏng chứ không phải ' + c('http://') + ' — còn phương án 4 gán cho Nginx một cú chuyển hướng nó không bao giờ tự làm.',
          ),
        }),

        // q28 · đáp án 0
        mcq({
          prompt: B(
            'A site enforces HTTPS everywhere. Ninety days later the certificate renewal fails, although nothing was changed. Which config is responsible, and why did it work at first?' + code(
              'server {\n' +
              '    listen 80;\n' +
              '    server_name example.com;\n' +
              '    return 301 https://$host$request_uri;\n' +
              '}',
            ),
            'Một site ép HTTPS ở mọi nơi. Chín mươi ngày sau việc gia hạn chứng chỉ thất bại, dù không có gì bị đổi. Cấu hình nào chịu trách nhiệm, và vì sao ban đầu nó vẫn chạy?' + code(
              'server {\n' +
              '    listen 80;\n' +
              '    server_name example.com;\n' +
              '    return 301 https://$host$request_uri;\n' +
              '}',
            ),
          ),
          options: [
            B(
              'The blanket redirect also catches <code>/.well-known/acme-challenge/</code>, so the ACME validator is bounced to HTTPS; the first issuance worked because it ran before this block existed, or over a different challenge type',
              'Cú chuyển hướng vơ đũa cả nắm bắt luôn <code>/.well-known/acme-challenge/</code>, nên bộ kiểm ACME bị đá sang HTTPS; lần cấp đầu tiên chạy được vì nó diễn ra trước khi khối này tồn tại, hoặc qua một loại thử thách khác',
            ),
            B(
              '<code>$host</code> is empty for the ACME validator, so the redirect points at <code>https:///</code>; using <code>$http_host</code> instead is the standard fix',
              '<code>$host</code> rỗng với bộ kiểm ACME, nên cú chuyển hướng trỏ tới <code>https:///</code>; đổi sang dùng <code>$http_host</code> là cách chữa tiêu chuẩn',
            ),
            B(
              'A 301 is cached by the validator for the certificate lifetime, so the second attempt never reaches the server at all and times out client-side',
              'Một cú 301 bị bộ kiểm cache suốt vòng đời chứng chỉ, nên lần thử thứ hai không bao giờ tới được máy chủ và hết giờ ở phía client',
            ),
            B(
              'The block is missing <code>default_server</code>, so the validator, which connects by IP address without a Host header, reaches a different block entirely',
              'Khối này thiếu <code>default_server</code>, nên bộ kiểm — vốn kết nối bằng địa chỉ IP mà không có header Host — lại tới một khối hoàn toàn khác',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The redirect is right and the exception is missing. An HTTP-01 challenge is a plain HTTP request to ' + c('http://example.com/.well-known/acme-challenge/<token>') + ', and the validating server follows redirects only to other HTTP or HTTPS URLs it can actually verify — a redirect into HTTPS whose certificate is the one being renewed is exactly the circularity that fails. It works the first time because the first issuance typically happens before the redirect exists, or through a standalone server, or over DNS-01; then ninety days pass and the renewal cron fails at 3am against a config nobody touched. The fix is one location above the redirect, and it must come first because ' + c('return') + ' in the enclosing block would otherwise run: ' + c('location /.well-known/acme-challenge/ { root /var/www/certbot; }') + ' and only then ' + c('location / { return 301 https://$host$request_uri; }') + '. Two neighbours deserve the same care. HSTS should be added after renewal is proven, because ' + c('includeSubDomains') + ' with a long ' + c('max-age') + ' commits every subdomain to working TLS in browsers that already saw the header. And ' + c('preload') + ' is close to irreversible, so do not set it until the whole estate is ready. Options 2, 3 and 4 each invent a mechanism that a single ' + c('curl') + ' against the challenge path disproves.',
            'Cú chuyển hướng thì đúng, cái THIẾU là ngoại lệ. Một thử thách HTTP-01 là một request HTTP trần tới ' + c('http://example.com/.well-known/acme-challenge/<token>') + ', và máy chủ đi kiểm chỉ theo chuyển hướng tới những URL HTTP hay HTTPS mà nó thật sự kiểm chứng được — một cú chuyển hướng vào HTTPS mà chứng chỉ của nó chính là cái đang cần gia hạn thì đúng là cái vòng luẩn quẩn gây hỏng. Nó chạy được lần đầu vì lần cấp đầu tiên thường diễn ra TRƯỚC khi cú chuyển hướng tồn tại, hoặc qua một máy chủ độc lập, hoặc qua DNS-01; rồi chín mươi ngày trôi qua và lượt cron gia hạn hỏng lúc ba giờ sáng trên một cấu hình chẳng ai đụng vào. Cách chữa là một location đặt TRƯỚC cú chuyển hướng, và nó phải đứng trước vì nếu không thì ' + c('return') + ' của khối bao ngoài sẽ chạy: ' + c('location /.well-known/acme-challenge/ { root /var/www/certbot; }') + ' rồi mới tới ' + c('location / { return 301 https://$host$request_uri; }') + '. Hai người hàng xóm cũng đáng được cẩn thận như vậy. HSTS nên thêm SAU khi đã chứng minh gia hạn chạy được, vì ' + c('includeSubDomains') + ' với một ' + c('max-age') + ' dài là cam kết mọi tên miền con phải có TLS hoạt động, trong những trình duyệt đã trót thấy cái header đó. Và ' + c('preload') + ' thì gần như không đảo ngược được, nên đừng đặt nó cho tới khi cả cơ ngơi đã sẵn sàng. Phương án 2, 3 và 4 mỗi cái đều bịa ra một cơ chế mà chỉ một lệnh ' + c('curl') + ' vào đường dẫn thử thách là bác bỏ được.',
          ),
        }),

        // q29 · đáp án 2
        mcq({
          prompt: B(
            'One server with <code>ssl_protocols TLSv1.2 TLSv1.3;</code> and no <code>ssl_ciphers</code> line. Two clients, two results.' + code(
              'default client            -> TLSv1.3  TLS_AES_256_GCM_SHA384\n' +
              'client capped at TLS 1.2  -> TLSv1.2  ECDHE-RSA-AES256-GCM-SHA384',
            ),
            'Một máy chủ với <code>ssl_protocols TLSv1.2 TLSv1.3;</code> và không có dòng <code>ssl_ciphers</code> nào. Hai client, hai kết quả.' + code(
              'client mặc định            -> TLSv1.3  TLS_AES_256_GCM_SHA384\n' +
              'client bị chặn ở TLS 1.2   -> TLSv1.2  ECDHE-RSA-AES256-GCM-SHA384',
            ),
          ),
          options: [
            B(
              'The server picked TLS 1.3 for the first client because it was listed last in <code>ssl_protocols</code>; reordering the list would make TLS 1.2 the preferred version',
              'Máy chủ chọn TLS 1.3 cho client đầu vì nó được liệt kê SAU CÙNG trong <code>ssl_protocols</code>; đảo thứ tự danh sách sẽ làm TLS 1.2 thành phiên bản được ưu tiên',
            ),
            B(
              'Two different cipher families prove the two clients reached two different server blocks, since one <code>ssl_ciphers</code> setting cannot produce both names',
              'Hai họ bộ mã khác nhau chứng minh hai client đã tới hai khối server khác nhau, vì một thiết lập <code>ssl_ciphers</code> không thể đẻ ra cả hai cái tên',
            ),
            B(
              '<code>ssl_protocols</code> is a set of permitted versions and the handshake settles on the highest both sides support; the cipher names differ because TLS 1.3 defines its own suites rather than reusing the 1.2 ones',
              '<code>ssl_protocols</code> là một TẬP các phiên bản được phép và cú bắt tay chốt ở phiên bản CAO NHẤT mà cả hai bên hỗ trợ; tên bộ mã khác nhau vì TLS 1.3 định nghĩa bộ riêng của nó chứ không dùng lại bộ của 1.2',
            ),
            B(
              'Omitting <code>ssl_ciphers</code> disables cipher negotiation, so Nginx falls back to a single hard-coded suite per version and the two names are those two constants',
              'Bỏ <code>ssl_ciphers</code> là tắt việc thương lượng bộ mã, nên Nginx lùi về một bộ gán cứng cho mỗi phiên bản và hai cái tên kia chính là hai hằng số đó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A version list is a permission set, not a preference order: the handshake always lands on the highest version both ends allow, so listing ' + c('TLSv1.2 TLSv1.3') + ' means modern clients get 1.3 and older ones still work at 1.2. The cipher names differ because TLS 1.3 replaced the suite space entirely — ' + c('TLS_AES_256_GCM_SHA384') + ' names only the AEAD and hash, since key exchange and authentication are no longer part of the suite, while the 1.2 name ' + c('ECDHE-RSA-AES256-GCM-SHA384') + ' still spells all four out. That is also why ' + c('ssl_ciphers') + ' does not control TLS 1.3 at all; its suites are configured separately and are safe by default, which is why omitting the directive is a reasonable choice rather than a gap. Two settings actually worth writing down: ' + c('ssl_prefer_server_ciphers off') + ' for TLS 1.3 (the client usually knows better which of the AEADs its hardware accelerates), and ' + c('ssl_session_cache shared:SSL:10m') + ' plus a sensible ' + c('keepalive_timeout') + ', because the handshake is the expensive part and connection reuse is what actually removes it. Option 1 turns a permission set into a priority list; option 2 reads a version difference as two server blocks; option 4 invents a fallback that would break every browser that is not on that one suite.',
            'Một danh sách phiên bản là TẬP QUYỀN, không phải thứ tự ưu tiên: cú bắt tay luôn hạ cánh xuống phiên bản CAO NHẤT mà cả hai đầu cho phép, nên liệt kê ' + c('TLSv1.2 TLSv1.3') + ' nghĩa là client hiện đại được 1.3 còn client cũ vẫn chạy được ở 1.2. Tên bộ mã khác nhau vì TLS 1.3 thay hẳn không gian bộ mã — ' + c('TLS_AES_256_GCM_SHA384') + ' chỉ gọi tên phần AEAD và hàm băm, vì trao đổi khoá và xác thực không còn nằm trong bộ nữa, còn cái tên của 1.2 là ' + c('ECDHE-RSA-AES256-GCM-SHA384') + ' thì vẫn viết ra đủ bốn phần. Đó cũng là lý do ' + c('ssl_ciphers') + ' hoàn toàn KHÔNG điều khiển TLS 1.3; các bộ của nó được cấu hình riêng và mặc định đã an toàn, nên bỏ hẳn chỉ thị ấy là một lựa chọn hợp lý chứ không phải một lỗ hổng. Hai thiết lập thật sự đáng ghi ra: ' + c('ssl_prefer_server_ciphers off') + ' cho TLS 1.3 (client thường biết rõ hơn phần cứng của nó tăng tốc cho AEAD nào), và ' + c('ssl_session_cache shared:SSL:10m') + ' cộng một ' + c('keepalive_timeout') + ' hợp lý, vì cú bắt tay mới là phần đắt và việc tái dùng kết nối mới là thứ thật sự xoá được nó. Phương án 1 biến một tập quyền thành một danh sách ưu tiên; phương án 2 đọc một khác biệt phiên bản thành hai khối server; phương án 4 bịa ra một cú lùi sẽ làm hỏng mọi trình duyệt không nằm trên đúng cái bộ đó.',
          ),
        }),

        /* ── Chương 7 — giới hạn (4 câu) ─────────────────────────────────── */

        // q30 · đáp án 1
        mcq({
          prompt: B(
            'One zone at <code>rate=2r/s</code>, three locations, eight sequential requests each. All measured.' + code(
              'limit_req zone=z1;                 200 503 503 503 503 503 503 503   in  124 ms\n' +
              'limit_req zone=z2 burst=5;         200 200 200 200 200 200 200 200   in 3619 ms\n' +
              'limit_req zone=z3 burst=5 nodelay; 200 200 200 200 200 200 503 503   in  136 ms',
            ),
            'Một zone ở <code>rate=2r/s</code>, ba location, mỗi cái tám request tuần tự. Đều đo thật.' + code(
              'limit_req zone=z1;                 200 503 503 503 503 503 503 503   trong  124 ms\n' +
              'limit_req zone=z2 burst=5;         200 200 200 200 200 200 200 200   trong 3619 ms\n' +
              'limit_req zone=z3 burst=5 nodelay; 200 200 200 200 200 200 503 503   trong  136 ms',
            ),
          ),
          options: [
            B(
              '<code>burst</code> raises the rate to 5r/s for the first second and <code>nodelay</code> raises it further, which is why the third line lets six through',
              '<code>burst</code> nâng tần suất lên 5r/s trong giây đầu và <code>nodelay</code> nâng thêm nữa, và vì thế dòng thứ ba cho sáu cái qua',
            ),
            B(
              '<code>burst</code> is a queue: without it excess requests are rejected, with it they are delayed to the configured rate, and <code>nodelay</code> serves the queued ones immediately while still consuming their slots',
              '<code>burst</code> là một HÀNG ĐỢI: không có nó thì request thừa bị từ chối, có nó thì chúng bị làm chậm về đúng tần suất đã đặt, còn <code>nodelay</code> phục vụ những cái đang xếp hàng ngay lập tức nhưng vẫn TIÊU cái suất của chúng',
            ),
            B(
              'The second line took 3.6 seconds because the eight requests queued behind one slow upstream call; <code>burst</code> itself adds no delay and the timing is unrelated to the rate',
              'Dòng thứ hai mất 3,6 giây vì tám request xếp hàng sau một lời gọi upstream chậm; bản thân <code>burst</code> không thêm độ trễ nào và con số thời gian không liên quan tới tần suất',
            ),
            B(
              '<code>nodelay</code> disables the limit entirely for the burst window, so the two 503s on the third line come from the zone running out of shared memory',
              '<code>nodelay</code> tắt hẳn giới hạn trong cửa sổ burst, nên hai cú 503 ở dòng ba tới từ việc zone hết bộ nhớ chia sẻ',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The rate never changes; only what happens to the excess does. ' + c('rate=2r/s') + ' means one slot opens every 500ms — Nginx works in milliseconds, so ' + c('2r/s') + ' is not a per-second bucket that refills all at once. Line one has nowhere to put the excess, so seven requests are rejected in 124ms: correct for an API, brutal for a browser that fires six parallel asset requests. Line two adds a queue of five, and the timing tells the whole story — 3619ms for eight requests is exactly the 2r/s drain rate, so nothing was rejected and everything was slowed. Line three keeps the same queue but serves its occupants at once: six responses in 136ms, then 503 once the queue is full. That third shape is what a normal web page wants, because a burst of parallel requests from one visitor is not abuse; the first shape is what a login endpoint wants, because there a delay is a favour to the attacker. Option 1 misreads a queue as a variable rate; option 3 ignores that the measured 3.6s equals the drain time exactly; option 4 claims ' + c('nodelay') + ' disables the limit, which the two 503s on that very line disprove.',
            'Tần suất không bao giờ đổi; chỉ có số phận của phần THỪA là đổi. ' + c('rate=2r/s') + ' nghĩa là cứ 500ms mở ra một suất — Nginx làm việc theo mili giây, nên ' + c('2r/s') + ' không phải một cái xô mỗi giây đổ đầy lại một lượt. Dòng một không có chỗ nào để chứa phần thừa, nên bảy request bị từ chối trong 124ms: đúng đắn với một API, tàn bạo với một trình duyệt bắn sáu request tài nguyên song song. Dòng hai thêm một hàng đợi năm chỗ, và con số thời gian kể toàn bộ câu chuyện — 3619ms cho tám request đúng bằng tốc độ rút 2r/s, nên không cái nào bị từ chối và tất cả đều bị làm chậm. Dòng ba giữ nguyên hàng đợi đó nhưng phục vụ những kẻ trong hàng NGAY: sáu response trong 136ms, rồi 503 khi hàng đầy. Hình dạng thứ ba mới là thứ một trang web bình thường cần, vì một cụm request song song từ MỘT vị khách không phải hành vi lạm dụng; còn hình dạng thứ nhất là thứ một endpoint đăng nhập cần, vì ở đó làm chậm chỉ là một ân huệ dành cho kẻ tấn công. Phương án 1 đọc một hàng đợi thành một tần suất biến thiên; phương án 3 phớt lờ việc 3,6s đo được đúng bằng thời gian rút; phương án 4 nói ' + c('nodelay') + ' tắt giới hạn, thứ mà hai cú 503 trên chính dòng đó bác bỏ.',
          ),
        }),

        // q31 · đáp án 3
        mcq({
          prompt: B(
            'Someone tests a new rate limit and reports that it does not work. Both locations use the same zone at <code>rate=1r/m</code>; four rapid requests each.' + code(
              'location /viareturn { limit_req zone=r1; return 200 "ok\\n"; }\n' +
              'location /viafile   { limit_req zone=r2; alias /srv/www/top.txt; }\n' +
              '\n' +
              '/viareturn -> 200 200 200 200\n' +
              '/viafile   -> 200 503 503 503',
            ),
            'Có người thử một giới hạn tần suất mới rồi báo rằng nó không chạy. Cả hai location dùng cùng loại zone ở <code>rate=1r/m</code>; mỗi cái bốn request dồn dập.' + code(
              'location /viareturn { limit_req zone=r1; return 200 "ok\\n"; }\n' +
              'location /viafile   { limit_req zone=r2; alias /srv/www/top.txt; }\n' +
              '\n' +
              '/viareturn -> 200 200 200 200\n' +
              '/viafile   -> 200 503 503 503',
            ),
          ),
          options: [
            B(
              'Two zones were declared, and a zone is only enforced once it has seen traffic in another worker; <code>r1</code> would start limiting after the shared memory warms up',
              'Có hai zone được khai, và một zone chỉ được áp khi nó đã thấy lưu lượng ở một worker khác; ' + c('r1') + ' sẽ bắt đầu giới hạn sau khi bộ nhớ chia sẻ nóng lên',
            ),
            B(
              '<code>limit_req</code> ignores responses generated by Nginx itself, because they cost no upstream capacity and the limiter exists to protect the backend',
              '<code>limit_req</code> bỏ qua những response do chính Nginx sinh ra, vì chúng không tốn dung lượng upstream nào mà bộ giới hạn thì sinh ra để bảo vệ backend',
            ),
            B(
              'The two zones have different names, so they are different buckets; putting both locations on one zone name would make both lines identical',
              'Hai zone có tên khác nhau nên chúng là hai cái xô khác nhau; cho cả hai location dùng chung một tên zone sẽ làm hai dòng giống hệt nhau',
            ),
            B(
              '<code>return</code> belongs to the rewrite module and runs in an earlier phase than the preaccess phase where <code>limit_req</code> lives, so the response is produced before the limiter is ever consulted',
              '<code>return</code> thuộc module rewrite và chạy ở một PHA SỚM HƠN cái pha preaccess nơi <code>limit_req</code> sống, nên response được sinh ra trước khi bộ giới hạn kịp được hỏi tới',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Nginx processes a request through an ordered list of phases, and a directive only runs if the request is still travelling when its phase comes round. ' + c('return') + ' is part of the rewrite module and fires in the rewrite phase, which is <em>before</em> the preaccess phase where ' + c('limit_req') + ' and ' + c('limit_conn') + ' live. So the response is finished and sent before the limiter is consulted, and the limit appears to do nothing — measured: four out of four requests answered 200 against a one-per-minute zone. Change the content handler to something that runs in the content phase, such as a static file or a ' + c('proxy_pass') + ', and the identical zone produces ' + c('200 503 503 503') + ' plus a ' + c('limiting requests, excess:') + ' line in the error log. This is why testing a limit with a convenient ' + c('return 200') + ' stub is a trap: the stub does not merely simplify the test, it removes the thing being tested. The same phase reasoning explains a family of "it did nothing" reports — ' + c('auth_request') + ' and ' + c('deny') + ' are also skipped by an early ' + c('return') + ', and a ' + c('rewrite') + ' in a server block runs before location matching. Options 1 and 3 attribute the difference to zone naming or warm-up, both of which are ruled out by the fact that the second line limits immediately on its very first excess request.',
            'Nginx đưa một request đi qua một danh sách PHA có thứ tự, và một chỉ thị chỉ chạy nếu request vẫn còn đang đi khi tới lượt pha của nó. ' + c('return') + ' thuộc module rewrite và nổ ở pha rewrite, tức là TRƯỚC pha preaccess nơi ' + c('limit_req') + ' và ' + c('limit_conn') + ' sống. Nên response đã xong và đã gửi đi trước khi bộ giới hạn kịp được hỏi, và cái giới hạn trông như chẳng làm gì — đo thật: bốn trên bốn request đều trả 200 trên một zone một-lần-mỗi-phút. Đổi content handler sang thứ chạy ở pha content, ví dụ một tệp tĩnh hay một ' + c('proxy_pass') + ', thì đúng cái zone ấy cho ra ' + c('200 503 503 503') + ' kèm một dòng ' + c('limiting requests, excess:') + ' trong error log. Đó là lý do thử một giới hạn bằng một mẩu ' + c('return 200') + ' cho tiện là một cái bẫy: cái mẩu ấy không chỉ đơn giản hoá phép thử, nó GỠ BỎ luôn thứ đang được thử. Cùng lối lập luận theo pha ấy giải thích cả một họ báo cáo "nó chẳng làm gì" — ' + c('auth_request') + ' và ' + c('deny') + ' cũng bị một ' + c('return') + ' sớm nhảy qua, còn một ' + c('rewrite') + ' đặt trong khối server thì chạy trước cả việc khớp location. Phương án 1 và 3 quy khác biệt cho tên zone hay chuyện làm nóng, cả hai đều bị loại bởi chính việc dòng thứ hai giới hạn NGAY ở request thừa đầu tiên của nó.',
          ),
        }),

        // q32 · đáp án 2
        mcq({
          prompt: B(
            'Two locations on the same zone. Only the second adds one directive. Explain both the status change and the log line.' + code(
              'location /a { limit_req zone=z;                       ... }  -> 200 503 503\n' +
              'location /b { limit_req zone=z; limit_req_status 429; ... }  -> 200 429 429\n' +
              '\n' +
              '[error] limiting requests, excess: 1.000 by zone "z",\n' +
              '        client: 172.19.0.3, request: "GET /a HTTP/1.1"',
            ),
            'Hai location trên cùng một zone. Chỉ cái thứ hai thêm một chỉ thị. Hãy giải thích cả cú đổi mã trạng thái lẫn dòng log.' + code(
              'location /a { limit_req zone=z;                       ... }  -> 200 503 503\n' +
              'location /b { limit_req zone=z; limit_req_status 429; ... }  -> 200 429 429\n' +
              '\n' +
              '[error] limiting requests, excess: 1.000 by zone "z",\n' +
              '        client: 172.19.0.3, request: "GET /a HTTP/1.1"',
            ),
          ),
          options: [
            B(
              '429 is the only correct status for a rate limit, so <code>/a</code> is misconfigured; 503 means the shared memory zone was exhausted rather than the rate exceeded',
              '429 là mã trạng thái ĐÚNG duy nhất cho một giới hạn tần suất, nên <code>/a</code> đang cấu hình sai; 503 nghĩa là vùng nhớ chia sẻ đã cạn chứ không phải vượt tần suất',
            ),
            B(
              '<code>limit_req_status</code> also changes the log level, which is why only the <code>/a</code> rejection produced an error line while the 429s were logged at info',
              '<code>limit_req_status</code> còn đổi cả mức log, và vì thế chỉ cú từ chối của <code>/a</code> mới sinh ra dòng error còn các cú 429 thì ghi ở mức info',
            ),
            B(
              '503 is the default rejection status and <code>limit_req_status</code> overrides it; either way the rejection is logged to the ERROR log at <code>error</code> level, which is what makes an aggressive limit look like an outage',
              '503 là mã từ chối MẶC ĐỊNH và <code>limit_req_status</code> ghi đè nó; đằng nào thì cú từ chối cũng được ghi vào ERROR log ở mức <code>error</code>, và chính điều đó khiến một giới hạn quá tay trông y như một sự cố',
            ),
            B(
              'The status differs because 429 is cacheable and 503 is not, so <code>/b</code> is answered from the cache after the first rejection and never re-enters the limiter',
              'Mã khác nhau vì 429 thì cache được còn 503 thì không, nên <code>/b</code> được trả lời từ bộ đệm sau cú từ chối đầu tiên và không bao giờ vào lại bộ giới hạn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Nginx rejects with 503 by default, which is a defensible choice — it tells an intermediary the service is temporarily unavailable — but it is the same status a dying backend produces, so on a dashboard a working rate limit and a real outage look identical. ' + c('limit_req_status 429') + ' separates them, and 429 is what a well-behaved client library reads as "slow down and retry" rather than "this service is broken". Pair it with a ' + c('Retry-After') + ' header if clients are yours to influence. The second half of the transcript is the part that surprises people at 3am: every rejection is written to the <b>error</b> log at ' + c('error') + ' level, one line per request. A limit that is slightly too tight therefore fills the error log with thousands of lines an hour, which both hides real errors and, on a single-disk server, is a way to run out of space. If a limit is expected to fire routinely, lower the noise deliberately — ' + c('limit_req_log_level warn') + ' or ' + c('notice') + ' — rather than raising the limit until the log goes quiet. Option 1 confuses a default with a misconfiguration; option 2 invents a coupling between status and log level; option 4 invents caching that no line in the transcript supports.',
            'Nginx mặc định từ chối bằng 503, một lựa chọn có thể biện hộ được — nó nói với bên trung gian rằng dịch vụ tạm thời không dùng được — nhưng nó cũng đúng là cái mã mà một backend đang hấp hối sinh ra, nên trên một bảng theo dõi thì một giới hạn tần suất ĐANG CHẠY TỐT và một sự cố THẬT trông y hệt nhau. ' + c('limit_req_status 429') + ' tách chúng ra, và 429 là thứ mà một thư viện client tử tế đọc thành "chậm lại rồi thử lại" chứ không phải "dịch vụ này hỏng rồi". Hãy đi kèm một header ' + c('Retry-After') + ' nếu client là thứ bạn ảnh hưởng được. Nửa sau của bản ghi mới là phần làm người ta bất ngờ lúc ba giờ sáng: MỌI cú từ chối đều được ghi vào <b>error</b> log ở mức ' + c('error') + ', mỗi request một dòng. Một giới hạn hơi chặt quá vì thế nhồi vào error log hàng nghìn dòng mỗi giờ, vừa che mất lỗi thật vừa, trên một máy chủ một đĩa, là một cách để hết chỗ. Nếu một giới hạn được dự tính là sẽ nổ thường xuyên thì hãy hạ tiếng ồn một cách có chủ đích — ' + c('limit_req_log_level warn') + ' hoặc ' + c('notice') + ' — chứ đừng nới giới hạn cho tới khi log im. Phương án 1 lẫn một MẶC ĐỊNH với một cấu hình sai; phương án 2 bịa ra mối buộc giữa mã trạng thái và mức log; phương án 4 bịa ra chuyện cache mà không dòng nào trong bản ghi ủng hộ.',
          ),
        }),

        // q33 · đáp án 0
        mcq({
          prompt: B(
            'An upload endpoint sits behind <code>client_max_body_size 1k;</code>. A 2000-byte body is rejected with 413 and a 500-byte body succeeds. Where in the exchange is the rejection decided?',
            'Một endpoint tải lên nằm sau <code>client_max_body_size 1k;</code>. Một thân 2000 byte bị từ chối với 413 còn một thân 500 byte thì thành công. Cú từ chối được quyết ở CHỖ NÀO trong cuộc trao đổi?',
          ),
          options: [
            B(
              'At the request headers: Nginx reads <code>Content-Length</code> and answers 413 before accepting the body, which is why an over-limit upload can fail long before it finishes sending',
              'Ở phần header request: Nginx đọc <code>Content-Length</code> rồi trả 413 TRƯỚC khi nhận thân, và vì thế một lượt tải lên vượt hạn có thể hỏng từ lâu trước khi gửi xong',
            ),
            B(
              'After the whole body is buffered to disk, since Nginx must know the real size and <code>Content-Length</code> cannot be trusted',
              'Sau khi cả thân đã được đệm xuống đĩa, vì Nginx phải biết kích thước THẬT và <code>Content-Length</code> thì không đáng tin',
            ),
            B(
              'At the upstream: Nginx forwards everything and turns the application\'s own rejection into a 413 so the limit is enforced in one place',
              'Ở phía upstream: Nginx chuyển tiếp mọi thứ rồi biến cú từ chối của chính ứng dụng thành một mã 413 để giới hạn được áp ở một chỗ duy nhất',
            ),
            B(
              'In the TLS layer, because the limit is measured on encrypted record sizes and therefore applies before HTTP parsing begins',
              'Ở tầng TLS, vì giới hạn này đo trên kích thước bản ghi đã mã hoá nên nó áp trước cả khi việc phân tích HTTP bắt đầu',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Nginx checks ' + c('Content-Length') + ' as soon as it has the request headers, so an over-limit upload is refused before a single byte of the body is accepted. That is the efficient behaviour — no bandwidth or disk is spent on a request that cannot succeed — and it is also the reason the failure looks so strange in a browser: the client is still uploading a large file when the server answers and closes, and some clients report a network error rather than the 413, because they never read the response they were sent. A chunked upload with no ' + c('Content-Length') + ' is caught later, while the body streams, and the same 413 comes back. Three practical notes. The default is ' + c('1m') + ', which is small enough that a first photo upload usually discovers it. The value belongs on the narrowest scope that needs it — one ' + c('location /upload/') + ', not the whole ' + c('http') + ' block — because raising it globally lets any endpoint absorb huge bodies. And ' + c('client_max_body_size 0') + ' disables the check entirely, which should be a deliberate, scoped decision rather than a way to make an error go away. Options 2 and 3 place the decision after work Nginx deliberately avoids doing; option 4 puts an HTTP limit in the wrong layer.',
            'Nginx kiểm ' + c('Content-Length') + ' ngay khi vừa có header request, nên một lượt tải lên vượt hạn bị từ chối trước khi một byte nào của thân được nhận. Đó là hành vi hiệu quả — không tốn băng thông lẫn đĩa cho một request không thể thành công — và cũng chính là lý do cú hỏng nhìn từ trình duyệt lại kỳ quặc tới vậy: client vẫn đang tải một tệp lớn lên thì máy chủ đã trả lời và đóng, và một số client báo thành lỗi mạng chứ không phải 413, vì chúng chưa từng đọc cái response đã được gửi cho mình. Một lượt tải theo mẩu không có ' + c('Content-Length') + ' thì bị bắt muộn hơn, trong lúc thân đang chảy, và cũng đúng cú 413 ấy quay ra. Ba ghi chú thực dụng. Mặc định là ' + c('1m') + ', đủ nhỏ để lần tải ảnh đầu tiên thường là lúc người ta phát hiện ra nó. Giá trị này thuộc về PHẠM VI HẸP NHẤT cần tới nó — một ' + c('location /upload/') + ', không phải cả khối ' + c('http') + ' — vì nâng nó lên toàn cục là cho phép mọi endpoint hút vào những cái thân khổng lồ. Và ' + c('client_max_body_size 0') + ' tắt hẳn phép kiểm, thứ nên là một quyết định có chủ đích và có phạm vi, chứ không phải một cách làm cho một thông báo lỗi biến mất. Phương án 2 và 3 đặt quyết định ấy sau những công việc mà Nginx cố ý tránh làm; phương án 4 đặt một giới hạn HTTP vào sai tầng.',
          ),
        }),

        /* ── Chương 8 — rewrite, if, map, return (4 câu) ─────────────────── */

        // q34 · đáp án 1
        mcq({
          prompt: B(
            'Two blocks differing only in the rewrite flag. Both were measured; <code>/store/</code> exists and prints its variables.' + code(
              'location /shop/ { rewrite ^/shop/(.*)$ /store/$1 last;  }\n' +
              'location /brk/  { rewrite ^/brk/(.*)$  /store/$1 break;\n' +
              '                  return 200 "BRK-AFTER\\n"; }\n' +
              '\n' +
              '/shop/x -> 200  STORE uri=/store/x raw=/shop/x\n' +
              '/brk/x  -> 404',
            ),
            'Hai khối chỉ khác nhau ở cái cờ rewrite. Cả hai đều đã đo; <code>/store/</code> có thật và in ra các biến của nó.' + code(
              'location /shop/ { rewrite ^/shop/(.*)$ /store/$1 last;  }\n' +
              'location /brk/  { rewrite ^/brk/(.*)$  /store/$1 break;\n' +
              '                  return 200 "BRK-AFTER\\n"; }\n' +
              '\n' +
              '/shop/x -> 200  STORE uri=/store/x raw=/shop/x\n' +
              '/brk/x  -> 404',
            ),
          ),
          options: [
            B(
              '<code>break</code> is a syntax error inside a location, so the whole block was skipped at load time and the 404 came from the fallback location',
              '<code>break</code> là lỗi cú pháp bên trong một location nên cả khối bị bỏ qua lúc nạp, và cú 404 tới từ location dự phòng',
            ),
            B(
              '<code>last</code> restarts location matching with the new URI, so <code>/store/</code> handles it; <code>break</code> stops the rewrite module in this block, so the <code>return</code> after it never runs and the request falls through to a file lookup that fails',
              '<code>last</code> khởi động lại việc khớp location với URI mới nên <code>/store/</code> xử lý nó; <code>break</code> DỪNG module rewrite trong khối này nên cái <code>return</code> nằm sau nó không bao giờ chạy, và request rơi xuống một lượt tìm tệp và trượt',
            ),
            B(
              'Both flags restart location matching; the second returns 404 only because <code>/store/x</code> does not exist as a file and <code>last</code> happens to fall back to a directory index',
              'Cả hai cờ đều khởi động lại việc khớp location; cái thứ hai trả 404 chỉ vì <code>/store/x</code> không tồn tại dưới dạng tệp, còn <code>last</code> tình cờ lùi về một trang index của thư mục',
            ),
            B(
              '<code>break</code> emits an external redirect that the test client did not follow, so the 404 is the client reporting an unfollowed 302 rather than a server response',
              '<code>break</code> phát ra một cú chuyển hướng ra ngoài mà client thử nghiệm không đi theo, nên 404 là client báo một cú 302 chưa đi theo chứ không phải một response của máy chủ',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The four flags do two different jobs and the transcript shows both. ' + c('last') + ' means "the URI is now this; start location matching over", so the request lands in ' + c('location /store/') + ' — note that ' + c('$uri') + ' became ' + c('/store/x') + ' while ' + c('$request_uri') + ' still reports what the client sent, which is exactly the pair you want when logging a rewritten request. ' + c('break') + ' means "stop the rewrite module here and continue in this same block with the new URI"; crucially, stopping the rewrite module also stops the ' + c('return') + ' that follows, because ' + c('return') + ' is a rewrite-module directive. So that block has no content handler left, the static handler tries to open a file for ' + c('/store/x') + ' under the default root, and the answer is 404. The other two flags leave the server entirely: ' + c('redirect') + ' sends 302 and ' + c('permanent') + ' sends 301, both with an absolute URL built from ' + c('$host') + '. The general habit worth taking away is that directives inside a block run in order and can shadow each other, so a ' + c('return') + ' written under a ' + c('rewrite ... break') + ' is dead code that no test will flag. Options 1, 3 and 4 each contradict a measured line.',
            'Bốn cái cờ làm hai việc khác nhau và bản ghi cho thấy cả hai. ' + c('last') + ' nghĩa là "URI giờ là cái này; bắt đầu lại việc khớp location", nên request hạ cánh vào ' + c('location /store/') + ' — để ý rằng ' + c('$uri') + ' đã thành ' + c('/store/x') + ' trong khi ' + c('$request_uri') + ' vẫn báo đúng thứ client gửi, và đó chính là cặp biến bạn muốn khi ghi log một request đã bị viết lại. ' + c('break') + ' nghĩa là "dừng module rewrite ở đây và đi tiếp trong CHÍNH khối này với URI mới"; điều then chốt là dừng module rewrite cũng dừng luôn cái ' + c('return') + ' đứng sau, vì ' + c('return') + ' là một chỉ thị của module rewrite. Thế nên khối đó không còn content handler nào, bộ xử lý tĩnh đi mở tệp cho ' + c('/store/x') + ' dưới root mặc định, và câu trả lời là 404. Hai cờ còn lại thì rời hẳn máy chủ: ' + c('redirect') + ' gửi 302 và ' + c('permanent') + ' gửi 301, cả hai kèm một URL tuyệt đối dựng từ ' + c('$host') + '. Thói quen chung đáng mang về là các chỉ thị trong một khối chạy THEO THỨ TỰ và có thể che nhau, nên một ' + c('return') + ' viết dưới một ' + c('rewrite ... break') + ' là mã chết mà không phép kiểm nào đánh dấu. Phương án 1, 3 và 4 mỗi cái đều mâu thuẫn với một dòng đo được.',
          ),
        }),

        // q35 · đáp án 3
        mcq({
          prompt: B(
            'A URL migration goes live and one path starts returning 500. Nothing else changed.' + code(
              'location /loop/ { rewrite ^/loop/(.*)$ /loop/$1 last; }\n' +
              '\n' +
              '$ curl -o /dev/null -w \'%{http_code}\\n\' http://edge/loop/x\n' +
              '500\n' +
              '[error] rewrite or internal redirection cycle while processing "/loop/x"',
            ),
            'Một cuộc chuyển đổi URL lên production và một đường dẫn bắt đầu trả 500. Không có gì khác bị đổi.' + code(
              'location /loop/ { rewrite ^/loop/(.*)$ /loop/$1 last; }\n' +
              '\n' +
              '$ curl -o /dev/null -w \'%{http_code}\\n\' http://edge/loop/x\n' +
              '500\n' +
              '[error] rewrite or internal redirection cycle while processing "/loop/x"',
            ),
          ),
          options: [
            B(
              'The 500 is the upstream application failing; the cycle message is a secondary symptom logged after the proxy gave up on it',
              'Cú 500 là ứng dụng upstream hỏng; thông báo về vòng lặp chỉ là triệu chứng thứ cấp được ghi lại sau khi proxy bỏ cuộc với nó',
            ),
            B(
              'The client followed the rewrite as a redirect and looped in the browser; Nginx logged what it saw and returned 500 on the eleventh request',
              'Client đã đi theo cú rewrite như một chuyển hướng và lặp ở trình duyệt; Nginx ghi lại thứ nó thấy rồi trả 500 ở request thứ mười một',
            ),
            B(
              'A rewrite whose result equals its input is rejected at config load, so this config never took effect and the 500 is Nginx running with no valid server block',
              'Một rewrite mà kết quả bằng đúng đầu vào thì bị từ chối ngay lúc nạp cấu hình, nên cấu hình này chưa từng có hiệu lực và cú 500 là Nginx chạy mà không có khối server hợp lệ nào',
            ),
            B(
              'The rewritten URI matches the same location, which rewrites it again; Nginx counts internal redirects and aborts the request with 500 once the limit is hit',
              'URI sau khi viết lại khớp đúng cái location đó, và nó lại viết lại lần nữa; Nginx đếm số lần chuyển hướng nội bộ rồi huỷ request với 500 khi chạm hạn mức',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The rewrite produces a URI that matches the block that produced it, so ' + c('last') + ' sends the request back into the same location, which rewrites it again. Nginx bounds this at ten internal redirects and then aborts with a 500 and the ' + c('rewrite or internal redirection cycle') + ' line, which names the URI it was looping on — the single most useful field in the message, because it points at the block rather than at the symptom. Recognising this shape matters because the 500 tells you nothing on its own and the application logs are empty; the request never left Nginx. The same cycle appears with ' + c('try_files') + ' whose fallback re-enters its own block, and with an ' + c('error_page') + ' that points at a URI which errors the same way. Three habits keep it away: make a rewrite target land somewhere structurally different from its source, prefer a plain ' + c('return 301') + ' when the mapping is one-to-one and needs no capture, and use ' + c('map') + ' for a table of URL changes rather than a stack of rewrites that can feed each other. Option 3 expects a load-time check Nginx does not perform — the loop is only visible at request time. Options 1 and 2 put the loop in the upstream or the browser, but the log line and the single ' + c('curl') + ' invocation both place it inside Nginx.',
            'Cú rewrite sinh ra một URI khớp đúng cái khối đã sinh ra nó, nên ' + c('last') + ' ném request quay lại chính location ấy, và nó lại viết lại lần nữa. Nginx chặn việc này ở mười lần chuyển hướng nội bộ rồi huỷ với một cú 500 kèm dòng ' + c('rewrite or internal redirection cycle') + ', trong đó có gọi tên cái URI nó đang lặp — trường hữu ích nhất của thông báo ấy, vì nó chỉ thẳng vào cái KHỐI chứ không chỉ vào triệu chứng. Nhận ra hình dạng này là quan trọng vì bản thân cú 500 chẳng nói với bạn điều gì và log ứng dụng thì trống trơn; request chưa từng rời khỏi Nginx. Cũng cái vòng ấy xuất hiện với ' + c('try_files') + ' có cú lùi quay lại chính khối của nó, và với một ' + c('error_page') + ' trỏ tới một URI hỏng theo đúng kiểu đó. Ba thói quen giữ nó ở xa: làm cho đích của một rewrite hạ cánh ở chỗ khác về cấu trúc so với nguồn của nó, ưu tiên một ' + c('return 301') + ' trơn khi ánh xạ là một-đối-một và không cần bắt nhóm, và dùng ' + c('map') + ' cho một BẢNG thay đổi URL thay vì một chồng rewrite có thể nuôi lẫn nhau. Phương án 3 trông chờ một phép kiểm lúc nạp mà Nginx không làm — cái vòng chỉ hiện ra vào lúc chạy request. Phương án 1 và 2 đặt cái vòng vào upstream hay trình duyệt, nhưng dòng log lẫn việc chỉ gọi ' + c('curl') + ' đúng một lần đều đặt nó bên trong Nginx.',
          ),
        }),

        // q36 · đáp án 2
        mcq({
          prompt: B(
            'The location sets a header, and an <code>if</code> inside it sets another. Both responses were captured.' + code(
              'location /ifhdr {\n' +
              '    add_header X-Outside "yes" always;\n' +
              '    if ($arg_x = "1") { add_header X-Inside "yes" always; }\n' +
              '    return 200 "ifhdr\\n";\n' +
              '}\n' +
              '\n' +
              'GET /ifhdr       -> X-Outside: yes\n' +
              'GET /ifhdr?x=1   -> X-Inside: yes          (X-Outside is GONE)',
            ),
            'Location đặt một header, và một <code>if</code> bên trong nó đặt một cái nữa. Cả hai response đều đã bắt lại.' + code(
              'location /ifhdr {\n' +
              '    add_header X-Outside "yes" always;\n' +
              '    if ($arg_x = "1") { add_header X-Inside "yes" always; }\n' +
              '    return 200 "ifhdr\\n";\n' +
              '}\n' +
              '\n' +
              'GET /ifhdr       -> X-Outside: yes\n' +
              'GET /ifhdr?x=1   -> X-Inside: yes          (X-Outside BIẾN MẤT)',
            ),
          ),
          options: [
            B(
              'The <code>if</code> matched and short-circuited the block, so directives written above it were rolled back; moving <code>add_header X-Outside</code> below the <code>if</code> would keep both',
              'Cái <code>if</code> khớp và cắt ngắn khối, nên các chỉ thị viết PHÍA TRÊN nó bị hoàn tác; chuyển <code>add_header X-Outside</code> xuống dưới cái <code>if</code> sẽ giữ được cả hai',
            ),
            B(
              'Only one <code>add_header</code> may carry <code>always</code> in a block; the second declaration silently replaces the first at load time',
              'Trong một khối chỉ được một <code>add_header</code> mang <code>always</code>; khai báo thứ hai âm thầm thay cái thứ nhất ngay lúc nạp',
            ),
            B(
              'An <code>if</code> block is an implicit nested configuration level, so its <code>add_header</code> replaces the inherited list exactly as a nested location would',
              'Một khối <code>if</code> là một CẤP CẤU HÌNH LỒNG ngầm, nên <code>add_header</code> của nó thay thế danh sách kế thừa y hệt như một location lồng nhau sẽ làm',
            ),
            B(
              'The two headers were both sent, but <code>X-Outside</code> was stripped by the response filter because a query string makes the response uncacheable',
              'Cả hai header đều đã được gửi, chỉ là <code>X-Outside</code> bị bộ lọc response gỡ đi vì có chuỗi truy vấn thì response không cache được',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the concrete meaning of "if is evil". An ' + c('if') + ' is not a conditional statement — it creates an anonymous nested configuration level, and that level inherits list directives under the usual rule: it keeps them only while it declares none of its own. The moment the ' + c('if') + ' body contains one ' + c('add_header') + ', the surrounding block\'s headers stop applying to any request that enters it. Measured: with ' + c('?x=1') + ' the response carries ' + c('X-Inside') + ' and has lost ' + c('X-Outside') + ' entirely. Now scale that to a real server whose ' + c('server') + ' block sets four security headers and whose ' + c('if') + ' adds a single ' + c('X-Debug') + ': every request that matches the condition silently ships without HSTS, without ' + c('X-Content-Type-Options') + ', without a CSP — and no test fails, because the condition is usually rare. The replacements are boring and reliable: ' + c('map') + ' to turn a request property into a variable and then use the variable, ' + c('try_files') + ' for file existence, and a ' + c('return') + ' in a properly matched location for a redirect. The one place ' + c('if') + ' is genuinely safe is with ' + c('return') + ' or ' + c('rewrite') + ' as its only content, where no inherited list is involved. Options 1, 2 and 4 each invent a rule that the two captured responses rule out.',
            'Đây chính là ý nghĩa cụ thể của câu "if là quỷ dữ". Một ' + c('if') + ' không phải một câu lệnh điều kiện — nó TẠO RA một cấp cấu hình lồng vô danh, và cái cấp đó kế thừa các chỉ thị dạng danh sách theo đúng luật thường lệ: nó giữ chúng chỉ trong lúc chưa khai cái nào của riêng mình. Ngay khoảnh khắc thân của ' + c('if') + ' chứa một ' + c('add_header') + ', các header của khối bao ngoài ngừng áp cho mọi request đi vào đó. Đã đo: với ' + c('?x=1') + ' thì response mang ' + c('X-Inside') + ' và mất hẳn ' + c('X-Outside') + '. Giờ hãy nhân điều đó lên một máy chủ thật mà khối ' + c('server') + ' đặt bốn header bảo mật còn cái ' + c('if') + ' chỉ thêm mỗi một ' + c('X-Debug') + ': mọi request khớp điều kiện đó đều lặng lẽ đi ra không có HSTS, không có ' + c('X-Content-Type-Options') + ', không có CSP — và không phép kiểm nào đỏ, vì cái điều kiện ấy thường hiếm khi xảy ra. Những thứ thay thế thì buồn tẻ nhưng đáng tin: ' + c('map') + ' để biến một thuộc tính của request thành một biến rồi dùng biến đó, ' + c('try_files') + ' cho việc tệp có tồn tại hay không, và một ' + c('return') + ' trong một location khớp đúng cho việc chuyển hướng. Chỗ duy nhất mà ' + c('if') + ' thật sự an toàn là khi nội dung DUY NHẤT của nó là ' + c('return') + ' hoặc ' + c('rewrite') + ', vì ở đó không có danh sách kế thừa nào dính vào. Phương án 1, 2 và 4 mỗi cái đều bịa ra một luật mà hai response đã bắt được kia bác bỏ.',
          ),
        }),

        // q37 · đáp án 0
        mcq({
          prompt: B(
            'Two error pages, two handlers, two very different statuses on the wire.' + code(
              'error_page 404 /nf.html;\n' +
              'location = /nf.html { internal; return 200 "CUSTOM-404\\n"; }\n' +
              '\n' +
              'error_page 502 = @fb;\n' +
              'location @fb { return 200 "FALLBACK-200\\n"; }\n' +
              '\n' +
              'GET /nothing-here  -> 404  CUSTOM-404\n' +
              'GET /down          -> 200  FALLBACK-200      (upstream refused the connection)',
            ),
            'Hai trang lỗi, hai bộ xử lý, hai mã trạng thái rất khác nhau trên đường truyền.' + code(
              'error_page 404 /nf.html;\n' +
              'location = /nf.html { internal; return 200 "CUSTOM-404\\n"; }\n' +
              '\n' +
              'error_page 502 = @fb;\n' +
              'location @fb { return 200 "FALLBACK-200\\n"; }\n' +
              '\n' +
              'GET /nothing-here  -> 404  CUSTOM-404\n' +
              'GET /down          -> 200  FALLBACK-200      (upstream từ chối kết nối)',
            ),
          ),
          options: [
            B(
              'Without <code>=</code> the original status is preserved no matter what the handler returns; the bare <code>=</code> tells Nginx to adopt the handler\'s status instead, which is how a 502 becomes a 200',
              'Không có dấu <code>=</code> thì mã gốc được GIỮ NGUYÊN bất kể bộ xử lý trả về gì; một dấu <code>=</code> trơ bảo Nginx lấy mã của bộ xử lý thay vào, và đó là cách một cú 502 thành 200',
            ),
            B(
              'A named location always overrides the status while a file path never can, so the difference comes from <code>@fb</code> versus <code>/nf.html</code> rather than from the <code>=</code>',
              'Một location có tên thì luôn ghi đè mã trạng thái còn một đường dẫn tệp thì không bao giờ, nên khác biệt tới từ <code>@fb</code> đối lại <code>/nf.html</code> chứ không phải từ dấu <code>=</code>',
            ),
            B(
              'The <code>internal</code> directive is what freezes the status; removing it from <code>/nf.html</code> would let the 200 through as well',
              'Chỉ thị <code>internal</code> mới là thứ đóng băng mã trạng thái; gỡ nó khỏi <code>/nf.html</code> thì cú 200 cũng sẽ lọt ra được',
            ),
            B(
              'Nginx never lets an error page change a 4xx but always lets it change a 5xx, since a 5xx is generated by Nginx itself and is therefore not authoritative',
              'Nginx không bao giờ để một trang lỗi đổi một mã 4xx nhưng luôn để nó đổi một mã 5xx, vì 5xx do chính Nginx sinh ra nên không có tính thẩm quyền',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The equals sign is the whole switch. ' + c('error_page 404 /nf.html;') + ' says "when a 404 happens, render this URI" — the body comes from the handler and the status stays 404, which is what you want for a branded error page that must not tell a crawler the page exists. Adding a bare ' + c('=') + ' as in ' + c('error_page 502 = @fb;') + ' says "and take the handler\'s status too", so a fallback that returns 200 turns an upstream outage into a normal response — useful for serving a cached or static placeholder, and dangerous if you do it without meaning to, because monitoring will see a healthy site. There is a third form, ' + c('error_page 404 =200 /nf.html;') + ', which pins a specific status regardless of what the handler returns. Two neighbours are worth remembering. ' + c('internal') + ' marks a location reachable only by internal redirect — measured, a direct request to it returns 404 — which is what stops a visitor from browsing to your error page or your ' + c('X-Accel-Redirect') + ' target. And ' + c('proxy_intercept_errors on') + ' is what makes ' + c('error_page') + ' apply to statuses the <em>upstream</em> produced, rather than only those Nginx generated. Options 2, 3 and 4 each attribute the effect to something other than the ' + c('=') + '.',
            'Dấu bằng chính là toàn bộ cái công tắc. ' + c('error_page 404 /nf.html;') + ' nói "khi có 404 thì kết xuất URI này" — phần thân tới từ bộ xử lý còn mã trạng thái ở lại 404, và đó là thứ bạn muốn cho một trang lỗi có thương hiệu nhưng không được phép nói với con bọ tìm kiếm rằng trang đó tồn tại. Thêm một dấu ' + c('=') + ' trơ như trong ' + c('error_page 502 = @fb;') + ' là nói "và lấy luôn mã của bộ xử lý", nên một cú lùi trả về 200 biến một sự cố upstream thành một response bình thường — hữu ích khi phục vụ một bản đệm hay một trang tĩnh thay thế, và nguy hiểm nếu bạn làm mà không cố ý, vì hệ theo dõi sẽ thấy một site khoẻ mạnh. Còn một dạng thứ ba, ' + c('error_page 404 =200 /nf.html;') + ', ghim một mã cụ thể bất kể bộ xử lý trả về gì. Hai người hàng xóm cũng đáng nhớ. ' + c('internal') + ' đánh dấu một location chỉ với tới được bằng chuyển hướng nội bộ — đã đo, một request trực tiếp vào nó trả 404 — và đó là thứ chặn một vị khách gõ thẳng vào trang lỗi hay vào đích ' + c('X-Accel-Redirect') + ' của bạn. Và ' + c('proxy_intercept_errors on') + ' mới là thứ khiến ' + c('error_page') + ' áp được cho những mã do UPSTREAM sinh ra, chứ không chỉ những mã Nginx tự tạo. Phương án 2, 3 và 4 mỗi cái đều quy hiệu ứng này cho một thứ khác chứ không phải dấu ' + c('=') + '.',
          ),
        }),

        /* ── Chương 9 — cân bằng tải (4 câu) ─────────────────────────────── */

        // q38 · đáp án 1
        mcq({
          prompt: B(
            'Six upstream groups over the same three backends, eight sequential requests each, measured with <code>worker_processes 1</code>. Which reading is right?' + code(
              'rr  { b1; b2; b3; }              -> b1 b2 b3 b1 b2 b3 b1 b2\n' +
              'wt  { b1 weight=3; b2; }         -> b1 b1 b2 b1 b1 b1 b2 b1\n' +
              'lc  { least_conn; b1; b2; }      -> b1 b2 b1 b2 b1 b2 b1 b2\n' +
              'iph { ip_hash; b1; b2; b3; }     -> b3 b3 b3 b3 b3 b3 b3 b3\n' +
              'bk  { b1; b2 backup; }           -> b1 b1 b1 b1 b1 b1 b1 b1\n' +
              'dn  { b1 down; b2; }             -> b2 b2 b2 b2 b2 b2 b2 b2',
            ),
            'Sáu nhóm upstream trên cùng ba backend, mỗi nhóm tám request tuần tự, đo với <code>worker_processes 1</code>. Cách đọc nào đúng?' + code(
              'rr  { b1; b2; b3; }              -> b1 b2 b3 b1 b2 b3 b1 b2\n' +
              'wt  { b1 weight=3; b2; }         -> b1 b1 b2 b1 b1 b1 b2 b1\n' +
              'lc  { least_conn; b1; b2; }      -> b1 b2 b1 b2 b1 b2 b1 b2\n' +
              'iph { ip_hash; b1; b2; b3; }     -> b3 b3 b3 b3 b3 b3 b3 b3\n' +
              'bk  { b1; b2 backup; }           -> b1 b1 b1 b1 b1 b1 b1 b1\n' +
              'dn  { b1 down; b2; }             -> b2 b2 b2 b2 b2 b2 b2 b2',
            ),
          ),
          options: [
            B(
              '<code>ip_hash</code> is broken here because one client should still be spread across three backends; the constant <code>b3</code> shows the hash was computed over the request path instead',
              '<code>ip_hash</code> đang hỏng ở đây vì một client lẽ ra vẫn phải trải đều trên ba backend; việc luôn ra <code>b3</code> cho thấy mã băm được tính trên đường dẫn request thay vì địa chỉ',
            ),
            B(
              'Each line is that method working as designed: weighted round robin interleaves rather than batching, <code>ip_hash</code> pins one client to one backend, a <code>backup</code> server is idle while a primary is up, and <code>down</code> removes a server without deleting its line',
              'Mỗi dòng là đúng phương pháp đó chạy như thiết kế: round robin có trọng số ĐAN XEN chứ không dồn cục, <code>ip_hash</code> ghim một client vào một backend, một máy <code>backup</code> nằm không trong lúc máy chính còn sống, và <code>down</code> gỡ một máy ra mà không phải xoá dòng của nó',
            ),
            B(
              '<code>least_conn</code> and plain round robin cannot produce the same alternating pattern, so the <code>lc</code> line proves the directive was ignored at load time',
              '<code>least_conn</code> và round robin thường không thể cho ra cùng một kiểu luân phiên, nên dòng <code>lc</code> chứng minh chỉ thị đó bị bỏ qua lúc nạp cấu hình',
            ),
            B(
              'The <code>bk</code> line means the backup server failed its health check; a healthy backup takes an equal share of traffic alongside the primary',
              'Dòng <code>bk</code> nghĩa là máy dự phòng đã trượt phép kiểm sức khoẻ; một máy dự phòng khoẻ mạnh sẽ nhận phần lưu lượng ngang với máy chính',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Every line is the documented behaviour, and two of them look wrong until you read them properly. Weighted round robin is <em>smooth</em>: with ' + c('weight=3') + ' the pattern interleaves as b1 b1 b2 b1 b1 b1 b2 b1 rather than sending three in a row, which keeps the instantaneous load balanced as well as the average. ' + c('least_conn') + ' looks identical to round robin here because the backends answer instantly, so their connection counts are always zero — the difference only appears when responses have unequal durations, which is exactly when it earns its place. ' + c('ip_hash') + ' pinning one client to ' + c('b3') + ' forever is the point of it, and also its cost: it distributes by client address, so one busy corporate NAT lands entirely on one backend. ' + c('backup') + ' is idle by design and takes over only when every primary is unavailable, and ' + c('down') + ' removes a server while leaving the line in place, which is how you drain one for maintenance without editing the group. One measurement detail worth carrying: this was run with a single worker on purpose. With the default ' + c('worker_processes auto') + ' the round-robin state is per worker and not shared, so six sequential requests through six workers all chose b1 — add ' + c('zone') + ' to the upstream block if you need the state shared.',
            'Mọi dòng đều là hành vi có ghi trong tài liệu, và có hai dòng trông như sai cho tới khi bạn đọc chúng cho đúng. Round robin có trọng số là loại "MƯỢT": với ' + c('weight=3') + ' thì khuôn đan xen thành b1 b1 b2 b1 b1 b1 b2 b1 chứ không gửi ba cái liền một lúc, và như thế thì tải TỨC THỜI cũng cân chứ không chỉ cân về trung bình. ' + c('least_conn') + ' trông y hệt round robin ở đây vì các backend trả lời tức thì nên số kết nối của chúng luôn bằng không — khác biệt chỉ hiện ra khi các response có thời lượng chênh nhau, mà đó đúng là lúc nó xứng đáng có mặt. ' + c('ip_hash') + ' ghim một client vào ' + c('b3') + ' mãi mãi chính là điểm mấu chốt của nó, và cũng là cái giá của nó: nó phân bổ theo ĐỊA CHỈ CLIENT, nên một cái NAT công ty đông người sẽ đổ trọn vào một backend. ' + c('backup') + ' nằm không là theo thiết kế và chỉ nhận việc khi mọi máy chính đều không dùng được, còn ' + c('down') + ' gỡ một máy ra mà vẫn để nguyên cái dòng, và đó là cách bạn rút cạn một máy để bảo trì mà không phải sửa cả nhóm. Một chi tiết đo đạc đáng mang theo: lượt này chạy với MỘT worker là có chủ đích. Với mặc định ' + c('worker_processes auto') + ' thì trạng thái round robin là của riêng từng worker và không dùng chung, nên sáu request tuần tự đi qua sáu worker đều chọn b1 — hãy thêm ' + c('zone') + ' vào khối upstream nếu bạn cần trạng thái ấy được chia sẻ.',
          ),
        }),

        // q39 · đáp án 2
        mcq({
          prompt: B(
            'The same three-backend group, measured twice. First b1 was stopped; then, with everything healthy, a path was requested that makes the chosen backend return 500.' + code(
              'b1 stopped, 9 requests:  200/b3 200/b2 200/b3 200/b2 ...  (zero client errors)\n' +
              '[error] connect() failed (113: Host is unreachable) while\n' +
              '        connecting to upstream, upstream: "http://172.19.0.9:8080/"\n' +
              '\n' +
              'all healthy, backend answers 500:  500 500 500',
            ),
            'Cùng nhóm ba backend, đo hai lần. Lần đầu b1 bị dừng; lần sau, khi mọi thứ đều khoẻ, gọi một đường dẫn khiến backend được chọn trả về 500.' + code(
              'b1 đã dừng, 9 request:  200/b3 200/b2 200/b3 200/b2 ...  (không lỗi nào tới client)\n' +
              '[error] connect() failed (113: Host is unreachable) while\n' +
              '        connecting to upstream, upstream: "http://172.19.0.9:8080/"\n' +
              '\n' +
              'tất cả đều khoẻ, backend trả 500:  500 500 500',
            ),
          ),
          options: [
            B(
              'Nginx retried the 500 on the other backends too and all three returned 500; with only one bad backend the client would have seen a 200',
              'Nginx đã thử lại cú 500 trên cả các backend khác và cả ba đều trả 500; nếu chỉ một backend hỏng thì client đã thấy 200',
            ),
            B(
              'The first result required <code>max_fails</code> to be raised above its default; with the default of 1 the dead backend would have kept receiving every third request',
              'Kết quả đầu đòi phải nâng <code>max_fails</code> lên trên mặc định; với mặc định là 1 thì backend chết vẫn tiếp tục nhận cứ ba request một lần',
            ),
            B(
              'A connection-level failure makes Nginx retry the next server transparently and mark the dead one down for <code>fail_timeout</code>, but a 500 is a valid HTTP response, so it is passed straight to the client',
              'Một cú hỏng ở mức KẾT NỐI khiến Nginx thử máy kế tiếp một cách trong suốt và đánh dấu máy chết trong khoảng <code>fail_timeout</code>, nhưng một cú 500 là một response HTTP HỢP LỆ nên nó được chuyển thẳng tới client',
            ),
            B(
              'Both results are proxy failures; the 500 reached the client only because <code>proxy_next_upstream</code> was explicitly set to <code>off</code> in that location',
              'Cả hai kết quả đều là hỏng ở proxy; cú 500 tới được client chỉ vì <code>proxy_next_upstream</code> đã bị đặt tường minh thành <code>off</code> trong location đó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Nginx distinguishes a backend that cannot be reached from one that answered badly, and only the first is its business. When ' + c('connect()') + ' fails, times out, or the response headers are unparsable, the request is retried on the next server in the group — the client sees a normal 200 and the only trace is an error-log line naming the upstream address. The failed server is counted against ' + c('max_fails') + ' (default 1) and taken out of rotation for ' + c('fail_timeout') + ' (default 10s), after which one probe request decides whether it is back; measured, b1 rejoined the rotation once it was restarted and the timeout elapsed. A 500, by contrast, is a complete, valid HTTP response, and Nginx has no way to know whether retrying it would be safe — the request may already have charged a card. So it is forwarded unchanged, and the ' + c('proxy_next_upstream') + ' default of ' + c('error timeout') + ' deliberately does not list ' + c('http_500') + '. You can add it, and for genuinely idempotent read endpoints that is reasonable, but adding it to a group that handles POSTs is how one order becomes three. Options 1 and 4 both assume a retry that the default forbids; option 2 has ' + c('max_fails') + ' backwards — the default of 1 is precisely what removes the server after its first failure.',
            'Nginx phân biệt một backend KHÔNG VỚI TỚI ĐƯỢC với một backend TRẢ LỜI TỆ, và chỉ cái thứ nhất mới là việc của nó. Khi ' + c('connect()') + ' hỏng, hết giờ, hoặc header response không phân tích nổi, request được thử lại trên máy kế tiếp trong nhóm — client thấy một cú 200 bình thường và dấu vết duy nhất là một dòng error log gọi tên địa chỉ upstream. Máy hỏng bị đếm vào ' + c('max_fails') + ' (mặc định 1) và bị rút khỏi vòng quay trong ' + c('fail_timeout') + ' (mặc định 10s), sau đó một request thăm dò sẽ quyết định nó đã về hay chưa; đo thật, b1 quay lại vòng quay ngay khi được bật lại và hết khoảng chờ. Ngược lại, một cú 500 là một response HTTP đầy đủ và hợp lệ, và Nginx không có cách nào biết thử lại có an toàn không — request đó có thể đã trừ tiền một cái thẻ rồi. Nên nó được chuyển tiếp nguyên vẹn, và mặc định ' + c('error timeout') + ' của ' + c('proxy_next_upstream') + ' cố ý KHÔNG liệt kê ' + c('http_500') + '. Bạn thêm được, và với những endpoint đọc thật sự bất biến thì thêm là hợp lý, nhưng thêm nó vào một nhóm xử lý POST là cách một đơn hàng thành ba. Phương án 1 và 4 đều giả định một lượt thử lại mà mặc định cấm; phương án 2 hiểu ngược ' + c('max_fails') + ' — mặc định bằng 1 chính là thứ gỡ máy đó ra ngay sau cú hỏng đầu tiên.',
          ),
        }),

        // q40 · đáp án 3
        mcq({
          prompt: B(
            'An upstream declares <code>keepalive 16;</code>. Two locations proxy to it; the backend prints what it received.' + code(
              'location /kabad { proxy_pass http://ka;  }\n' +
              '  -> b1 proto=HTTP/1.0 conn=close\n' +
              '\n' +
              'location /kaok  { proxy_http_version 1.1;\n' +
              '                  proxy_set_header Connection "";\n' +
              '                  proxy_pass http://ka2; }\n' +
              '  -> b1 proto=HTTP/1.1 conn=',
            ),
            'Một upstream khai <code>keepalive 16;</code>. Hai location cùng proxy tới nó; backend in ra thứ nó nhận được.' + code(
              'location /kabad { proxy_pass http://ka;  }\n' +
              '  -> b1 proto=HTTP/1.0 conn=close\n' +
              '\n' +
              'location /kaok  { proxy_http_version 1.1;\n' +
              '                  proxy_set_header Connection "";\n' +
              '                  proxy_pass http://ka2; }\n' +
              '  -> b1 proto=HTTP/1.1 conn=',
            ),
          ),
          options: [
            B(
              '<code>keepalive 16</code> only sizes the pool; the first location does reuse connections and the <code>Connection: close</code> the backend printed is a display artefact of HTTP/1.0',
              '<code>keepalive 16</code> chỉ định cỡ cái hồ; location đầu tiên VẪN tái dùng kết nối, và cái <code>Connection: close</code> mà backend in ra chỉ là hiện tượng hiển thị của HTTP/1.0',
            ),
            B(
              'The empty <code>Connection</code> header on the second location disables keep-alive, and the first location is the one that reuses connections correctly',
              'Cái header <code>Connection</code> rỗng ở location thứ hai TẮT keep-alive, và location đầu tiên mới là cái tái dùng kết nối đúng cách',
            ),
            B(
              'Both locations reuse connections; only the printed protocol version differs, because <code>proxy_http_version</code> changes how the request line is written and nothing else',
              'Cả hai location đều tái dùng kết nối; chỉ khác nhau ở phiên bản giao thức in ra, vì <code>proxy_http_version</code> chỉ đổi cách viết dòng request chứ không đổi gì khác',
            ),
            B(
              'The pool is unusable from the first location: Nginx speaks HTTP/1.0 upstream by default and sends <code>Connection: close</code>, so every request opens and closes a socket no matter how large <code>keepalive</code> is',
              'Cái hồ đó KHÔNG DÙNG ĐƯỢC từ location đầu: Nginx mặc định nói HTTP/1.0 với upstream và gửi <code>Connection: close</code>, nên mỗi request đều mở rồi đóng một socket bất kể <code>keepalive</code> lớn cỡ nào',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Declaring ' + c('keepalive 16') + ' allocates a pool of idle upstream connections, but two defaults stop anything from ever using it. Nginx proxies with HTTP/1.0 unless told otherwise, and persistent connections are an HTTP/1.1 feature; and it sets ' + c('Connection: close') + ' on the upstream request, which explicitly asks the backend to hang up. The measurement shows both: the plain location made the backend report ' + c('proto=HTTP/1.0 conn=close') + ', so every single request paid for a full TCP handshake — and on a TLS upstream, a full TLS handshake as well. The fix is the two lines together, and clearing ' + c('Connection') + ' to the empty string is not "disabling keep-alive" but removing the header Nginx would otherwise add, which is what lets HTTP/1.1\'s persistent default apply. Sizing is worth a thought too: ' + c('keepalive') + ' is the number of idle connections kept <em>per worker</em>, so the real ceiling is that number times ' + c('worker_processes') + ', and setting it far above what the backend can hold open is a way to exhaust the backend rather than to go faster. Options 1 and 3 dismiss a header the backend actually printed; option 2 reads the empty value as a disable, when it is the opposite.',
            'Khai ' + c('keepalive 16') + ' là cấp phát một hồ các kết nối upstream đang rảnh, nhưng có HAI mặc định ngăn không cho bất cứ thứ gì dùng tới nó. Nginx proxy bằng HTTP/1.0 trừ khi được bảo khác, mà kết nối bền vững là tính năng của HTTP/1.1; và nó đặt ' + c('Connection: close') + ' lên request đi upstream, tức là tường minh yêu cầu backend cúp máy. Phép đo cho thấy cả hai: location trơn làm backend báo ' + c('proto=HTTP/1.0 conn=close') + ', nên từng request một đều phải trả giá một cú bắt tay TCP đầy đủ — và với một upstream có TLS thì thêm một cú bắt tay TLS đầy đủ nữa. Cách chữa là hai dòng đi cùng nhau, và việc xoá ' + c('Connection') + ' về chuỗi rỗng KHÔNG phải "tắt keep-alive" mà là gỡ đi cái header Nginx vốn sẽ thêm vào, và đó chính là thứ cho mặc định bền vững của HTTP/1.1 được áp dụng. Chuyện định cỡ cũng đáng nghĩ: ' + c('keepalive') + ' là số kết nối rảnh giữ lại TRÊN MỖI WORKER, nên trần thật là con số đó nhân với ' + c('worker_processes') + ', và đặt nó cao vượt xa mức backend giữ mở nổi là một cách làm cạn backend chứ không phải một cách chạy nhanh hơn. Phương án 1 và 3 gạt bỏ một header mà backend thật sự đã in ra; phương án 2 đọc giá trị rỗng thành một cú tắt, trong khi nó là điều ngược lại.',
          ),
        }),

        // q41 · đáp án 0
        mcq({
          prompt: B(
            'A deploy brings the edge up before the application container. Nginx refuses to start with this. What does it tell you about name resolution?' + code(
              '2026/09/07 [emerg] 1#1: host not found in upstream "ngapp"\n' +
              '                        in /etc/nginx/conf.d/default.conf:9\n' +
              'nginx: [emerg] host not found in upstream "ngapp" ...',
            ),
            'Một lượt deploy dựng lớp biên lên trước container ứng dụng. Nginx từ chối khởi động với thông báo này. Nó nói gì với bạn về việc phân giải tên?' + code(
              '2026/09/07 [emerg] 1#1: host not found in upstream "ngapp"\n' +
              '                        in /etc/nginx/conf.d/default.conf:9\n' +
              'nginx: [emerg] host not found in upstream "ngapp" ...',
            ),
          ),
          options: [
            B(
              'Names in <code>proxy_pass</code> and <code>upstream</code> are resolved once, at configuration load, and the result is frozen — so a name that is unresolvable at start is fatal, and one whose address changes later is never re-resolved',
              'Tên trong <code>proxy_pass</code> và <code>upstream</code> được phân giải MỘT LẦN, lúc nạp cấu hình, và kết quả bị đóng băng — nên một cái tên không phân giải được lúc khởi động là chí mạng, còn một cái tên đổi địa chỉ về sau thì không bao giờ được phân giải lại',
            ),
            B(
              'Nginx resolves upstream names on every request, so this error means DNS was unreachable at that exact moment and a retry would have started cleanly',
              'Nginx phân giải tên upstream ở mỗi request, nên lỗi này nghĩa là DNS không với tới được đúng khoảnh khắc đó và thử lại thì đã khởi động sạch sẽ',
            ),
            B(
              'The error comes from the <code>upstream</code> block only; a bare <code>proxy_pass http://ngapp:8080;</code> would have started fine and failed later with a 502',
              'Lỗi này chỉ tới từ khối <code>upstream</code>; một dòng <code>proxy_pass http://ngapp:8080;</code> trơ thì đã khởi động bình thường rồi mới hỏng sau bằng một cú 502',
            ),
            B(
              'Adding a <code>resolver</code> line makes Nginx defer all name resolution to request time, which is why <code>resolver</code> is required in every proxying configuration',
              'Thêm một dòng <code>resolver</code> làm Nginx hoãn MỌI việc phân giải tên tới lúc chạy request, và đó là lý do <code>resolver</code> là bắt buộc trong mọi cấu hình có proxy',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Nginx resolves upstream host names while parsing the configuration, and a name it cannot resolve is a fatal ' + c('[emerg]') + ' that aborts the load. On a reload that is merciful — the old workers keep serving — but on a cold start, as in a container that came up before its backend, the process simply exits and the edge is down. The second half of the same rule is quieter and bites later: the address is resolved once and cached for the life of the process, so a backend that changes IP (a redeployed container, a rescheduled pod, an autoscaled instance) keeps receiving traffic at an address that no longer answers, and the fix is a reload rather than anything the DNS TTL will do for you. Two standard ways out. Declare a ' + c('resolver') + ' and put the name in a <em>variable</em> — ' + c('set $up http://app:8080; proxy_pass $up;') + ' — which defers resolution to request time and respects the record TTL, at the cost of a lookup in the request path. Or accept the static behaviour and make the platform reload Nginx when addresses change. Option 2 inverts the timing; option 3 is wrong because a literal name in ' + c('proxy_pass') + ' is resolved at load time too; option 4 overstates ' + c('resolver') + ', which changes nothing unless a variable is involved.',
            'Nginx phân giải tên máy của upstream ngay trong lúc phân tích cấu hình, và một cái tên nó không phân giải nổi là một lỗi ' + c('[emerg]') + ' chí mạng, huỷ luôn lượt nạp. Với một lượt nạp lại thì điều đó còn nhân từ — các worker cũ vẫn phục vụ — nhưng với một lần khởi động nguội, như một container lên trước backend của nó, thì tiến trình đơn giản là thoát và lớp biên chết. Nửa sau của cùng cái luật đó thì im ắng hơn và cắn muộn hơn: địa chỉ được phân giải MỘT LẦN rồi nhớ suốt vòng đời tiến trình, nên một backend đổi IP (một container deploy lại, một pod bị xếp lịch lại, một máy do tự co giãn sinh ra) vẫn tiếp tục nhận lưu lượng ở một địa chỉ không còn trả lời, và cách chữa là NẠP LẠI chứ không phải thứ gì mà TTL của DNS sẽ làm hộ bạn. Có hai lối ra tiêu chuẩn. Khai một ' + c('resolver') + ' rồi đặt cái tên vào một BIẾN — ' + c('set $up http://app:8080; proxy_pass $up;') + ' — cách này hoãn việc phân giải tới lúc chạy request và tôn trọng TTL của bản ghi, đổi lại là một lượt tra cứu nằm trên đường đi của request. Hoặc chấp nhận hành vi tĩnh rồi bắt nền tảng nạp lại Nginx mỗi khi địa chỉ đổi. Phương án 2 đảo ngược thời điểm; phương án 3 sai vì một cái tên nguyên văn trong ' + c('proxy_pass') + ' cũng được phân giải lúc nạp; phương án 4 nói quá về ' + c('resolver') + ', thứ chẳng đổi gì nếu không có một biến dính vào.',
          ),
        }),

        /* ── Chương 10 — log và quan sát (4 câu) ─────────────────────────── */

        // q42 · đáp án 2
        mcq({
          prompt: B(
            'The same request logged by two formats whose text is byte-identical apart from one parameter. The user agent contained a quote, a backslash and a tab.' + code(
              'log_format a           \'{"ua":"$http_user_agent"}\';\n' +
              'log_format b escape=json \'{"ua":"$http_user_agent"}\';\n' +
              '\n' +
              'a -> {"ua":"Mozilla \\x22quoted\\x22 \\x5Cback/ tab\\x09end"}\n' +
              'b -> {"ua":"Mozilla \\"quoted\\" \\\\back/ tab\\tend"}',
            ),
            'Cùng một request được ghi bởi hai định dạng có nội dung giống hệt từng byte, chỉ khác một tham số. User agent chứa một dấu nháy kép, một dấu gạch chéo ngược và một dấu tab.' + code(
              'log_format a           \'{"ua":"$http_user_agent"}\';\n' +
              'log_format b escape=json \'{"ua":"$http_user_agent"}\';\n' +
              '\n' +
              'a -> {"ua":"Mozilla \\x22quoted\\x22 \\x5Cback/ tab\\x09end"}\n' +
              'b -> {"ua":"Mozilla \\"quoted\\" \\\\back/ tab\\tend"}',
            ),
          ),
          options: [
            B(
              'Both lines are valid JSON; <code>escape=json</code> only shortens the escapes so the log file is smaller, and either format can be shipped to a log collector unchanged',
              'Cả hai dòng đều là JSON hợp lệ; <code>escape=json</code> chỉ rút ngắn các dấu escape cho tệp log nhỏ đi, và cả hai định dạng đều nạp thẳng vào bộ thu log được',
            ),
            B(
              'The first line is safer because <code>\\x22</code> cannot be confused with a real quote; the second risks a log-injection attack through a crafted user agent',
              'Dòng đầu an toàn hơn vì <code>\\x22</code> không thể bị nhầm với một dấu nháy thật; dòng thứ hai có nguy cơ bị tấn công tiêm log qua một user agent dàn dựng',
            ),
            B(
              'The default escaping emits <code>\\xNN</code>, which JSON does not define, so line one is not valid JSON at all — <code>escape=json</code> is what makes a JSON access log actually parseable',
              'Kiểu escape mặc định phát ra <code>\\xNN</code>, thứ mà JSON không định nghĩa, nên dòng một hoàn toàn KHÔNG phải JSON hợp lệ — <code>escape=json</code> mới là thứ làm cho một access log dạng JSON thật sự phân tích được',
            ),
            B(
              'Neither line is JSON because the numeric fields would need quoting too; the parameter only affects how the log file is compressed on rotation',
              'Không dòng nào là JSON cả vì các trường số cũng phải được đặt trong nháy; tham số kia chỉ ảnh hưởng tới cách tệp log được nén lúc xoay vòng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'JSON defines exactly nine escape sequences and ' + c('\\xNN') + ' is not among them — its only numeric form is ' + c('\\uNNNN') + '. So the first line, which looks like JSON and was written by a format that spells JSON out character by character, is rejected by every strict parser the moment a user agent contains a quote. The failure mode is the worst kind: the pipeline works for months, then one crafted or merely unusual request produces a line the collector drops, and the records you most want to look at are exactly the ones missing. ' + c('escape=json') + ' switches the escaping to the JSON rules, and the second line parses. Two neighbours belong to the same decision. ' + c('escape=none') + ' exists for formats that do their own quoting and should be used with care, because a header can then contain a newline and forge a whole log record. And numeric fields such as ' + c('$status') + ' and ' + c('$request_time') + ' should be written without surrounding quotes so they arrive as numbers rather than strings — but never do that for ' + c('$upstream_response_time') + ', which is empty when there was no upstream and would produce a bare, invalid value. Option 1 asserts the first line is valid JSON; option 2 inverts which escaping is safe; option 4 invents a compression role the parameter does not have.',
            'JSON định nghĩa đúng chín chuỗi escape và ' + c('\\xNN') + ' không nằm trong số đó — dạng theo số duy nhất của nó là ' + c('\\uNNNN') + '. Nên dòng đầu tiên, thứ TRÔNG như JSON và được viết bởi một định dạng đánh vần JSON ra từng ký tự, sẽ bị mọi bộ phân tích nghiêm ngặt từ chối ngay khoảnh khắc một user agent có chứa dấu nháy. Kiểu hỏng này là kiểu tệ nhất: đường ống chạy êm hàng tháng, rồi một request được dàn dựng — hoặc chỉ đơn giản là bất thường — đẻ ra một dòng mà bộ thu vứt đi, và đúng những bản ghi bạn muốn xem nhất lại là những cái bị thiếu. ' + c('escape=json') + ' chuyển cách escape sang luật của JSON, và dòng thứ hai phân tích được. Hai người hàng xóm cũng thuộc về cùng quyết định này. ' + c('escape=none') + ' tồn tại cho những định dạng tự lo phần đặt nháy và phải dùng thật cẩn thận, vì khi đó một header có thể chứa ký tự xuống dòng và GIẢ MẠO nguyên một bản ghi log. Còn các trường số như ' + c('$status') + ' và ' + c('$request_time') + ' nên viết KHÔNG kèm nháy để chúng tới nơi dưới dạng số chứ không phải chuỗi — nhưng tuyệt đối đừng làm thế với ' + c('$upstream_response_time') + ', thứ RỖNG khi không có upstream nào và sẽ đẻ ra một giá trị trần trụi, không hợp lệ. Phương án 1 khẳng định dòng đầu là JSON hợp lệ; phương án 2 đảo ngược xem kiểu escape nào an toàn; phương án 4 bịa ra một vai trò về nén mà tham số đó không có.',
          ),
        }),

        // q43 · đáp án 1
        mcq({
          prompt: B(
            'A busy edge writes only some requests to the access log. Four requests were made; one line appeared.' + code(
              'map $status $loggable { ~^[23] 0; default 1; }\n' +
              'location /quiet  { access_log /dev/stdout j if=$loggable; return 200; }\n' +
              'location /loud   { access_log /dev/stdout j if=$loggable; return 404; }\n' +
              'location /off    { access_log off;                        return 200; }\n' +
              '\n' +
              'logged: only the request to /loud',
            ),
            'Một lớp biên bận rộn chỉ ghi một số request vào access log. Đã gửi bốn request; chỉ một dòng hiện ra.' + code(
              'map $status $loggable { ~^[23] 0; default 1; }\n' +
              'location /quiet  { access_log /dev/stdout j if=$loggable; return 200; }\n' +
              'location /loud   { access_log /dev/stdout j if=$loggable; return 404; }\n' +
              'location /off    { access_log off;                        return 200; }\n' +
              '\n' +
              'chỉ ghi: request tới /loud',
            ),
          ),
          options: [
            B(
              '<code>if=</code> is evaluated before the request is handled, so <code>$status</code> is always empty there and the map fell through to <code>default 1</code> — the /loud line was logged by coincidence',
              '<code>if=</code> được tính TRƯỚC khi request được xử lý, nên <code>$status</code> ở đó luôn rỗng và map rơi xuống <code>default 1</code> — dòng /loud được ghi chỉ là trùng hợp',
            ),
            B(
              '<code>if=</code> skips the line when the variable is <code>0</code> or the empty string, and the map is evaluated at log time, when <code>$status</code> is already known',
              '<code>if=</code> bỏ qua dòng đó khi biến bằng <code>0</code> hoặc chuỗi rỗng, và cái map được tính vào LÚC GHI LOG, khi <code>$status</code> đã biết',
            ),
            B(
              'The condition tests truthiness like a shell, so <code>0</code> means true and the two 200s were dropped for a different reason: <code>/dev/stdout</code> buffers them',
              'Điều kiện xét tính đúng-sai kiểu shell nên <code>0</code> nghĩa là ĐÚNG, và hai cú 200 bị rơi vì lý do khác: <code>/dev/stdout</code> đã đệm chúng lại',
            ),
            B(
              '<code>access_log off</code> in one location disables logging for the whole server, so the single line came from a different server block entirely',
              '<code>access_log off</code> trong một location tắt việc ghi log cho cả máy chủ, nên dòng duy nhất kia tới từ một khối server hoàn toàn khác',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Access logging happens at the end of a request, so every variable in the format — and in the ' + c('if=') + ' condition — has its final value, ' + c('$status') + ' included. The rule for the condition is narrow and worth memorising exactly: the line is <b>skipped</b> when the variable evaluates to ' + c('0') + ' or to the empty string, and written otherwise. So a map that yields ' + c('0') + ' for successful statuses and ' + c('1') + ' for everything else logs only the interesting requests — measured, three 2xx responses vanished and the 404 was kept. This is the tool for an endpoint that is polled every second by a health check and would otherwise be 90% of your log volume. Two related settings finish the picture: ' + c('access_log off') + ' in a location silences that location completely, and ' + c('buffer=64k flush=5s') + ' on the log path batches writes so a high-traffic server is not doing one ' + c('write()') + ' per request. What none of them changes is the error log, which is separate and where a rate-limit rejection or an upstream failure will still be recorded. Option 1 puts the evaluation too early, option 3 inverts the truth rule, and option 4 invents a scope that ' + c('access_log off') + ' does not have.',
            'Việc ghi access log diễn ra ở CUỐI một request, nên mọi biến trong định dạng — và trong điều kiện ' + c('if=') + ' — đều đã có giá trị cuối cùng, kể cả ' + c('$status') + '. Luật của điều kiện này hẹp và đáng thuộc lòng cho chính xác: dòng đó bị <b>BỎ QUA</b> khi biến tính ra ' + c('0') + ' hoặc chuỗi rỗng, và được ghi trong mọi trường hợp còn lại. Nên một map cho ra ' + c('0') + ' với các mã thành công và ' + c('1') + ' với mọi thứ khác sẽ chỉ ghi lại những request đáng chú ý — đã đo, ba response 2xx biến mất và cú 404 được giữ. Đây chính là công cụ cho một endpoint bị một bộ kiểm sức khoẻ hỏi mỗi giây, thứ mà nếu không có nó sẽ chiếm 90% khối lượng log của bạn. Hai thiết lập liên quan hoàn thiện bức tranh: ' + c('access_log off') + ' trong một location làm câm hẳn location đó, và ' + c('buffer=64k flush=5s') + ' trên đường dẫn log gom các lượt ghi lại thành mẻ để một máy chủ lưu lượng cao khỏi phải làm một lệnh ' + c('write()') + ' cho mỗi request. Thứ mà không cái nào trong số đó đụng tới là ERROR log, vốn nằm riêng và là nơi một cú từ chối vì giới hạn tần suất hay một cú hỏng upstream vẫn sẽ được ghi lại. Phương án 1 đặt phép tính quá sớm, phương án 3 đảo ngược luật đúng-sai, còn phương án 4 bịa ra một phạm vi mà ' + c('access_log off') + ' không hề có.',
          ),
        }),

        // q44 · đáp án 3
        mcq({
          prompt: B(
            'Two <code>stub_status</code> readings, taken ten minutes apart on a server under load. What should you conclude?' + code(
              '# reading 1            # reading 2\n' +
              'Active connections: 1  Active connections: 812\n' +
              'server accepts handled requests\n' +
              ' 7 7 7                  41883 41205 96140\n' +
              'Reading: 0 Writing: 1 Waiting: 0',
            ),
            'Hai lượt đọc <code>stub_status</code>, cách nhau mười phút, trên một máy chủ đang có tải. Bạn nên kết luận gì?' + code(
              '# lượt 1               # lượt 2\n' +
              'Active connections: 1  Active connections: 812\n' +
              'server accepts handled requests\n' +
              ' 7 7 7                  41883 41205 96140\n' +
              'Reading: 0 Writing: 1 Waiting: 0',
            ),
          ),
          options: [
            B(
              'Requests far exceeding handled connections means 678 requests failed; the ratio of the third number to the second is the error rate',
              'Số request vượt xa số kết nối đã xử lý nghĩa là 678 request đã hỏng; tỉ số giữa con số thứ ba và con số thứ hai chính là tỉ lệ lỗi',
            ),
            B(
              'Nothing is wrong: <code>accepts</code> and <code>handled</code> always differ under load because a connection is counted as accepted before the handshake completes',
              'Không có gì sai cả: <code>accepts</code> và <code>handled</code> luôn khác nhau khi có tải vì một kết nối được tính là đã nhận từ trước khi cú bắt tay hoàn tất',
            ),
            B(
              '812 active connections against 1024 <code>worker_connections</code> is the alarm; the accepts and handled counters are cumulative and carry no signal',
              '812 kết nối đang hoạt động so với 1024 <code>worker_connections</code> mới là chỗ báo động; hai bộ đếm accepts và handled là tích luỹ nên không mang tín hiệu gì',
            ),
            B(
              '678 connections were accepted and then dropped without being served, which points at a resource ceiling — <code>worker_connections</code> or the open-file limit — while the third number is requests, higher than connections because of keep-alive',
              '678 kết nối đã được nhận rồi bị RƠI mà chưa được phục vụ, chỉ tới một trần tài nguyên — <code>worker_connections</code> hoặc hạn mức tệp mở — còn con số thứ ba là số REQUEST, cao hơn số kết nối là nhờ keep-alive',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Seven numbers, and one comparison carries almost all the value: ' + c('accepts') + ' against ' + c('handled') + '. They are equal on a healthy server — the first reading shows ' + c('7 7 7') + ' — and any gap means connections that Nginx accepted from the kernel and then closed without serving. That is not an application error and nothing in the access log records it; the usual causes are ' + c('worker_connections') + ' being reached or the process running out of file descriptors, both of which are configuration ceilings rather than traffic problems. The third number is requests, and it is legitimately larger than connections because keep-alive carries many requests over one socket — the ratio is a rough measure of how well connection reuse is working. The last line splits the active connections by state: ' + c('Reading') + ' is receiving a request, ' + c('Writing') + ' is sending a response, and ' + c('Waiting') + ' is idle keep-alive, which is normally the largest of the three and is cheap. Because the counters are cumulative, the useful practice is to scrape them periodically and alert on the <em>rate</em> of the accepts-minus-handled difference, not on its absolute value. Option 1 misreads requests as failures; option 2 asserts a gap is normal, which it is not; option 3 dismisses the one comparison that matters.',
            'Bảy con số, và một phép so sánh mang gần như toàn bộ giá trị: ' + c('accepts') + ' đối lại ' + c('handled') + '. Chúng BẰNG NHAU trên một máy chủ khoẻ — lượt đọc đầu cho ' + c('7 7 7') + ' — và bất kỳ khoảng chênh nào cũng có nghĩa là những kết nối mà Nginx đã nhận từ nhân rồi đóng lại mà chưa phục vụ. Đó không phải lỗi ứng dụng và không có gì trong access log ghi lại nó; nguyên nhân thường gặp là chạm trần ' + c('worker_connections') + ' hoặc tiến trình hết mô tả tệp, cả hai đều là trần CẤU HÌNH chứ không phải vấn đề lưu lượng. Con số thứ ba là số REQUEST, và nó lớn hơn số kết nối một cách chính đáng vì keep-alive chở nhiều request trên một socket — tỉ lệ giữa hai cái là một thước đo thô về việc tái dùng kết nối đang chạy tốt tới đâu. Dòng cuối tách số kết nối đang hoạt động theo trạng thái: ' + c('Reading') + ' là đang nhận request, ' + c('Writing') + ' là đang gửi response, còn ' + c('Waiting') + ' là keep-alive đang rảnh, thường là cái lớn nhất trong ba và rất rẻ. Vì các bộ đếm là tích luỹ nên cách dùng hữu ích là quét chúng theo chu kỳ rồi cảnh báo theo TỐC ĐỘ TĂNG của hiệu accepts trừ handled, chứ không theo giá trị tuyệt đối của nó. Phương án 1 đọc nhầm số request thành số lỗi; phương án 2 khẳng định chênh lệch là bình thường, điều không đúng; phương án 3 gạt bỏ đúng cái phép so sánh quan trọng nhất.',
          ),
        }),

        // q45 · đáp án 1
        mcq({
          prompt: B(
            'Two log lines from the same JSON format. One request was served by Nginx itself, the other was proxied.' + code(
              '{"uri":"/esc","rt":0.000,"urt":"","cache":""}\n' +
              '{"uri":"/up", "rt":0.000,"urt":"0.000","cache":""}',
            ),
            'Hai dòng log từ cùng một định dạng JSON. Một request do chính Nginx phục vụ, cái kia đi qua proxy.' + code(
              '{"uri":"/esc","rt":0.000,"urt":"","cache":""}\n' +
              '{"uri":"/up", "rt":0.000,"urt":"0.000","cache":""}',
            ),
          ),
          options: [
            B(
              'The empty <code>urt</code> means the upstream answered in under a millisecond, which Nginx logs as an empty string rather than as zero',
              '<code>urt</code> rỗng nghĩa là upstream trả lời trong chưa tới một mili giây, và Nginx ghi cái đó thành chuỗi rỗng chứ không ghi số không',
            ),
            B(
              '<code>$upstream_response_time</code> is unset when no upstream was contacted, so an empty value distinguishes "Nginx answered this itself" from "the backend was instant" — and <code>$request_time</code> measures the whole client-facing request instead',
              '<code>$upstream_response_time</code> KHÔNG được gán khi không có upstream nào được liên hệ, nên một giá trị rỗng phân biệt "Nginx tự trả lời" với "backend nhanh tức thì" — còn <code>$request_time</code> thì đo cả request tính từ phía client',
            ),
            B(
              'The two variables always agree; the difference here is that the first request was served from the proxy cache, which the <code>cache</code> field failed to record',
              'Hai biến này luôn khớp nhau; khác biệt ở đây là request đầu được phục vụ từ bộ đệm proxy, thứ mà trường <code>cache</code> đã không ghi lại được',
            ),
            B(
              '<code>$request_time</code> excludes time spent waiting for the upstream, so the two values can never be compared and the empty one is simply not applicable',
              '<code>$request_time</code> loại trừ thời gian chờ upstream, nên hai giá trị này không bao giờ so sánh được và cái rỗng đơn giản là không áp dụng',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The empty string is information, not a missing value: ' + c('$upstream_response_time') + ' only exists when a request actually contacted an upstream, so an empty field says Nginx answered it alone — a static file, a ' + c('return') + ', a redirect, or a cache hit. That distinction is what makes the pair useful together. ' + c('$request_time') + ' is measured from the first byte read from the client to the last byte written to it, so it includes the time the client spent uploading a body and the time it spent accepting the response on a slow network. Subtract one from the other and the remainder is the time your own infrastructure is responsible for. That is how a "the backend is slow" report gets settled in one query: if ' + c('urt') + ' is small and ' + c('rt') + ' is large, the delay is in the network or the client, and no amount of backend profiling will find it. Two neighbours belong in the same format: ' + c('$upstream_connect_time') + ' separates a slow connect from a slow response, and ' + c('$upstream_addr') + ' names which backend served it, which is the only way to spot that one member of a pool is responsible for the tail latency. Options 1, 3 and 4 each collapse a distinction the two lines are drawing.',
            'Chuỗi rỗng ở đây là THÔNG TIN, không phải một giá trị bị thiếu: ' + c('$upstream_response_time') + ' chỉ tồn tại khi một request thật sự có liên hệ với một upstream, nên một trường rỗng nói rằng Nginx đã tự trả lời một mình — một tệp tĩnh, một ' + c('return') + ', một cú chuyển hướng, hay một cú trúng bộ đệm. Chính sự phân biệt đó khiến cặp biến này hữu ích khi đi cùng nhau. ' + c('$request_time') + ' được đo từ byte đầu tiên đọc được từ client tới byte cuối cùng ghi ra cho client, nên nó BAO GỒM cả thời gian client tải một cái thân lên và thời gian nó nhận response trên một đường mạng chậm. Lấy cái này trừ cái kia thì phần dư chính là khoảng thời gian mà hạ tầng của bạn phải chịu trách nhiệm. Đó là cách một báo cáo "backend chậm" được phân xử chỉ bằng một truy vấn: nếu ' + c('urt') + ' nhỏ mà ' + c('rt') + ' lớn thì độ trễ nằm ở mạng hoặc ở client, và có mổ xẻ backend bao nhiêu cũng không tìm ra. Hai người hàng xóm cũng thuộc về cùng định dạng ấy: ' + c('$upstream_connect_time') + ' tách một cú kết nối chậm khỏi một response chậm, còn ' + c('$upstream_addr') + ' gọi tên backend nào đã phục vụ, và đó là cách duy nhất để phát hiện rằng một thành viên trong hồ đang chịu trách nhiệm cho phần đuôi độ trễ. Phương án 1, 3 và 4 mỗi cái đều xoá mất một sự phân biệt mà hai dòng log kia đang vạch ra.',
          ),
        }),

        /* ── Chương 11 — chẩn đoán (5 câu) ───────────────────────────────── */

        // q46 · đáp án 0
        mcq({
          prompt: B(
            'Two broken configs, two runs of <code>nginx -t</code>. What does the pair tell you about what the test covers?' + code(
              'server { listen 80; root /does/not/exist; location / { } }\n' +
              '  -> syntax is ok ... test is successful\n' +
              '\n' +
              'server { listen 443 ssl; ssl_certificate /etc/nginx/nope.crt; ... }\n' +
              '  -> [emerg] cannot load certificate "/etc/nginx/nope.crt":\n' +
              '     BIO_new_file() failed ... test failed',
            ),
            'Hai cấu hình hỏng, hai lượt <code>nginx -t</code>. Cặp này nói gì với bạn về phạm vi mà phép kiểm phủ được?' + code(
              'server { listen 80; root /does/not/exist; location / { } }\n' +
              '  -> syntax is ok ... test is successful\n' +
              '\n' +
              'server { listen 443 ssl; ssl_certificate /etc/nginx/nope.crt; ... }\n' +
              '  -> [emerg] cannot load certificate "/etc/nginx/nope.crt":\n' +
              '     BIO_new_file() failed ... test failed',
            ),
          ),
          options: [
            B(
              'It checks syntax and everything the load itself must open — certificates and keys are read at startup, but a <code>root</code> is only touched per request, so a missing document root passes cleanly',
              'Nó kiểm cú pháp và mọi thứ mà chính lượt NẠP phải mở — chứng chỉ và khoá được đọc lúc khởi động, còn một <code>root</code> chỉ bị chạm tới ở mỗi request, nên một thư mục gốc không tồn tại vẫn qua sạch sẽ',
            ),
            B(
              'It checks only syntax; the certificate error came from the running server, not from the test, and would not have appeared without a live process',
              'Nó chỉ kiểm cú pháp; lỗi chứng chỉ tới từ máy chủ đang chạy chứ không phải từ phép kiểm, và sẽ không hiện ra nếu không có một tiến trình sống',
            ),
            B(
              'It validates every file path in the configuration, and the first config passed because Nginx creates a missing <code>root</code> directory at load time',
              'Nó kiểm mọi đường dẫn tệp trong cấu hình, và cấu hình đầu qua được vì Nginx TỰ TẠO thư mục <code>root</code> còn thiếu ngay lúc nạp',
            ),
            B(
              'The difference is the port: Nginx validates TLS blocks strictly and plain HTTP blocks loosely, because an error on 443 is more expensive',
              'Khác biệt nằm ở cổng: Nginx kiểm khối TLS thật chặt còn khối HTTP trần thì lỏng, vì một lỗi trên cổng 443 thì đắt hơn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The boundary is precise and worth internalising: ' + c('nginx -t') + ' performs a real configuration load, so anything the load itself must do is verified — the file parses, directives are valid in their contexts, referenced ' + c('include') + ' files exist, upstream host names resolve, and certificates and keys are opened and parsed. Anything that only happens per request is not verified: a ' + c('root') + ' that does not exist, a ' + c('proxy_pass') + ' target that is refusing connections, a ' + c('try_files') + ' chain that loops, a location that will never be reached because a regex above it wins. So a successful test means "this config will load", never "this site will work". The habit that follows is mechanical and cheap: after every reload, ' + c('curl') + ' one representative URL per feature and check the status, exactly as a deploy smoke test does. Two supporting tools belong here. ' + c('nginx -T') + ' prints the fully assembled configuration with every ' + c('include') + ' expanded, which is the only reliable way to see what is actually in effect on a server with a ' + c('conf.d') + ' directory. And reading the warnings matters as much as the verdict, because a conflicting server name or a deprecated directive still ends in "test is successful". Options 2, 3 and 4 each misplace the line the two transcripts draw.',
            'Cái ranh giới ở đây rất chính xác và đáng thấm: ' + c('nginx -t') + ' thực hiện một lượt NẠP CẤU HÌNH THẬT, nên mọi thứ mà bản thân lượt nạp phải làm đều được kiểm chứng — tệp phân tích được, các chỉ thị hợp lệ trong ngữ cảnh của chúng, các tệp ' + c('include') + ' được tham chiếu có tồn tại, tên máy upstream phân giải được, và chứng chỉ cùng khoá được mở ra và phân tích. Còn mọi thứ chỉ xảy ra ở mỗi request thì KHÔNG được kiểm: một ' + c('root') + ' không tồn tại, một đích ' + c('proxy_pass') + ' đang từ chối kết nối, một chuỗi ' + c('try_files') + ' bị lặp, một location sẽ chẳng bao giờ được tới vì một regex nằm trên nó thắng. Nên một phép kiểm thành công nghĩa là "cấu hình này sẽ nạp được", không bao giờ có nghĩa "trang web này sẽ chạy". Thói quen suy ra từ đó thì máy móc và rẻ: sau mỗi lượt nạp lại, hãy ' + c('curl') + ' một URL đại diện cho mỗi tính năng rồi kiểm mã trạng thái, đúng như một chốt kiểm sau deploy vẫn làm. Hai công cụ hỗ trợ cũng thuộc về đây. ' + c('nginx -T') + ' in ra cấu hình đã ráp đầy đủ với mọi ' + c('include') + ' đã bung, và đó là cách đáng tin duy nhất để thấy cái gì THẬT SỰ đang có hiệu lực trên một máy chủ có thư mục ' + c('conf.d') + '. Và đọc phần cảnh báo quan trọng ngang với đọc phán quyết, vì một tên server xung đột hay một chỉ thị đã lỗi thời vẫn kết thúc bằng "test is successful". Phương án 2, 3 và 4 mỗi cái đều đặt sai cái ranh giới mà hai bản ghi kia vạch ra.',
          ),
        }),

        // q47 · đáp án 3
        mcq({
          prompt: B(
            'One error-log line from production. Which reading uses every field it gives you?' + code(
              '2026/09/07 21:01:29 [error] 20#20: *1 upstream timed out\n' +
              '  (110: Operation timed out) while reading response header from\n' +
              '  upstream, client: 172.19.0.3, server: , request: "GET /t2/slowhead\n' +
              '  HTTP/1.1", upstream: "http://172.19.0.14:8080/slowhead", host: "edge"',
            ),
            'Một dòng error log từ production. Cách đọc nào dùng được HẾT các trường mà nó cho bạn?' + code(
              '2026/09/07 21:01:29 [error] 20#20: *1 upstream timed out\n' +
              '  (110: Operation timed out) while reading response header from\n' +
              '  upstream, client: 172.19.0.3, server: , request: "GET /t2/slowhead\n' +
              '  HTTP/1.1", upstream: "http://172.19.0.14:8080/slowhead", host: "edge"',
            ),
          ),
          options: [
            B(
              '<code>20#20</code> is the connection number and <code>*1</code> is the worker PID; the empty <code>server:</code> means no server block matched and the request was handled by the default',
              '<code>20#20</code> là số hiệu kết nối còn <code>*1</code> là PID của worker; <code>server:</code> rỗng nghĩa là không khối server nào khớp và request do khối mặc định xử lý',
            ),
            B(
              'The upstream URI equals the request URI, so no rewriting happened; therefore the location must have used <code>proxy_pass</code> without a URI part',
              'URI của upstream bằng URI của request nên không có việc viết lại nào; vì vậy location đó hẳn đã dùng <code>proxy_pass</code> không kèm phần URI',
            ),
            B(
              '<code>[error]</code> is the highest severity Nginx emits, so this line alone justifies paging someone; anything more serious would have stopped the process',
              '<code>[error]</code> là mức nghiêm trọng cao nhất Nginx phát ra, nên riêng dòng này đã đủ để gọi người trực dậy; thứ gì nghiêm trọng hơn đã làm tiến trình dừng rồi',
            ),
            B(
              '<code>*1</code> is the connection id that ties this line to other lines from the same connection, the phase names which timeout fired, <code>upstream:</code> gives the resolved backend and the rewritten path, and the empty <code>server:</code> is just an unnamed server block',
              '<code>*1</code> là số hiệu kết nối để nối dòng này với các dòng khác của cùng kết nối, cái pha nói rõ timeout nào đã nổ, <code>upstream:</code> cho biết backend đã phân giải và đường dẫn sau khi viết lại, còn <code>server:</code> rỗng chỉ là một khối server không đặt tên',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Every field earns its place. The timestamp is in the container\'s timezone, which is usually UTC while your shell is not — a mismatch that has wasted plenty of incident time. ' + c('[error]') + ' is a level in the middle of the scale (' + c('debug info notice warn error crit alert emerg') + '), so it is not the ceiling: ' + c('crit') + ' and above are the ones that mean the process is in trouble. ' + c('20#20') + ' is process and thread id, while ' + c('*1') + ' is the <b>connection id</b>, which is the field that lets you ' + c('grep') + ' every line belonging to one client conversation — the single most useful trick when several things go wrong at once. The phase clause is the diagnosis: <em>while reading response header from upstream</em> means the backend accepted the connection and then went quiet, which is ' + c('proxy_read_timeout') + ', not ' + c('proxy_connect_timeout') + '. And ' + c('upstream:') + ' shows the address after name resolution and the path after any rewrite, so comparing it with ' + c('request:') + ' tells you what the proxy actually asked for. The empty ' + c('server:') + ' simply means the matched block had no ' + c('server_name') + '. Options 1 and 3 mislabel fields and severity; option 2 draws a conclusion the two paths do not support — they differ, since the request was ' + c('/t2/slowhead') + ' and the upstream got ' + c('/slowhead') + '.',
            'Từng trường đều xứng đáng có mặt. Dấu thời gian nằm theo múi giờ của CONTAINER, thường là UTC trong khi shell của bạn thì không — một chỗ lệch đã ngốn khá nhiều thời gian xử lý sự cố. ' + c('[error]') + ' là một mức nằm giữa thang (' + c('debug info notice warn error crit alert emerg') + '), nên nó KHÔNG phải trần: ' + c('crit') + ' trở lên mới là những mức nói rằng tiến trình đang gặp chuyện. ' + c('20#20') + ' là mã tiến trình và luồng, còn ' + c('*1') + ' là <b>mã kết nối</b>, và đó chính là trường cho phép bạn ' + c('grep') + ' ra mọi dòng thuộc về một cuộc trao đổi của một client — mẹo hữu ích nhất khi nhiều thứ cùng hỏng một lúc. Mệnh đề về PHA chính là chẩn đoán: <em>while reading response header from upstream</em> nghĩa là backend đã nhận kết nối rồi im bặt, tức là ' + c('proxy_read_timeout') + ' chứ không phải ' + c('proxy_connect_timeout') + '. Và ' + c('upstream:') + ' cho thấy địa chỉ SAU khi phân giải tên và đường dẫn SAU khi viết lại, nên đem nó so với ' + c('request:') + ' là biết proxy thật sự đã hỏi cái gì. ' + c('server:') + ' rỗng chỉ đơn giản nghĩa là khối đã khớp không đặt ' + c('server_name') + '. Phương án 1 và 3 gán sai tên trường và sai mức nghiêm trọng; phương án 2 rút ra một kết luận mà hai đường dẫn không ủng hộ — chúng KHÁC nhau, vì request là ' + c('/t2/slowhead') + ' còn upstream nhận ' + c('/slowhead') + '.',
          ),
        }),

        // q48 · đáp án 2
        mcq({
          prompt: B(
            'Four statuses collected from one edge server in one afternoon. Which mapping to causes is right?' + code(
              '400  "The plain HTTP request was sent to HTTPS port"\n' +
              '413  on one upload endpoint only\n' +
              '500  with "rewrite or internal redirection cycle" in the error log\n' +
              '504  with "while connecting to upstream" in the error log',
            ),
            'Bốn mã trạng thái thu được từ một máy chủ biên trong một buổi chiều. Ánh xạ nào tới nguyên nhân là đúng?' + code(
              '400  "The plain HTTP request was sent to HTTPS port"\n' +
              '413  chỉ trên một endpoint tải lên\n' +
              '500  kèm "rewrite or internal redirection cycle" trong error log\n' +
              '504  kèm "while connecting to upstream" trong error log',
            ),
          ),
          options: [
            B(
              'All four come from the upstream application, and the error-log lines are Nginx echoing what the backend told it',
              'Cả bốn đều tới từ ứng dụng upstream, và các dòng error log là Nginx nhại lại thứ backend đã nói với nó',
            ),
            B(
              'The 500 and the 504 are both upstream failures; the 400 and the 413 are both client errors, so neither needs any configuration change',
              'Cú 500 và cú 504 đều là hỏng ở upstream; cú 400 và cú 413 đều là lỗi client nên không cái nào cần đổi cấu hình',
            ),
            B(
              'All four were generated by Nginx before or instead of reaching the application: a protocol mismatch, a <code>client_max_body_size</code> rejection, a config loop, and an upstream that never accepted the connection',
              'Cả bốn đều do Nginx sinh ra TRƯỚC hoặc THAY VÌ tới được ứng dụng: một cú lệch giao thức, một cú từ chối vì <code>client_max_body_size</code>, một vòng lặp cấu hình, và một upstream chưa từng chấp nhận kết nối',
            ),
            B(
              'The 504 means the upstream answered slowly and the 500 means it answered with an error; both are application problems, while 400 and 413 are Nginx defaults that should be raised',
              'Cú 504 nghĩa là upstream trả lời chậm còn cú 500 nghĩa là nó trả lời kèm lỗi; cả hai đều là vấn đề của ứng dụng, còn 400 và 413 là mặc định của Nginx và nên được nới lên',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The single most useful triage question is not "what is the status" but <b>"who generated it"</b>, and here the answer is Nginx in all four cases — which is why searching the application logs would find nothing. The 400 is a listener receiving cleartext where it expected a TLS ClientHello. The 413 is ' + c('client_max_body_size') + ' refusing a body on the strength of its ' + c('Content-Length') + ', before a byte of it is read. The 500 is an internal redirect loop, aborted after ten hops, with the looping URI named in the log — the request never left the server. The 504 is a gateway timeout that Nginx produced itself, and the phase clause narrows it further: <em>while connecting</em> is ' + c('proxy_connect_timeout') + ' and points at the network, a firewall, or a backend that is not listening, whereas <em>while reading response header</em> would be ' + c('proxy_read_timeout') + ' and point at an application that is thinking too long. The general method is to pair the status with the error-log phase before forming a theory, because the status alone is ambiguous and the phase almost never is. Option 1 credits the upstream with lines Nginx wrote about itself; option 2 misassigns the 500; option 4 both misreads the 500 and suggests raising limits that are doing their job.',
            'Câu hỏi phân loại hữu ích nhất không phải "mã trạng thái là gì" mà là <b>"AI đã sinh ra nó"</b>, và ở đây câu trả lời là Nginx trong cả bốn trường hợp — chính vì thế lục log ứng dụng sẽ chẳng thấy gì. Cú 400 là một listener nhận chữ thường ở chỗ nó chờ một ClientHello của TLS. Cú 413 là ' + c('client_max_body_size') + ' từ chối một cái thân dựa trên ' + c('Content-Length') + ' của nó, trước khi đọc một byte nào. Cú 500 là một vòng lặp chuyển hướng nội bộ, bị huỷ sau mười chặng, với cái URI đang lặp được gọi tên trong log — request chưa từng rời khỏi máy chủ. Cú 504 là một timeout cổng do chính Nginx tạo ra, và mệnh đề về pha còn thu hẹp thêm: <em>while connecting</em> là ' + c('proxy_connect_timeout') + ' và chỉ vào mạng, một tường lửa, hay một backend không nghe, trong khi <em>while reading response header</em> sẽ là ' + c('proxy_read_timeout') + ' và chỉ vào một ứng dụng nghĩ quá lâu. Phương pháp chung là ghép mã trạng thái với cái PHA trong error log TRƯỚC khi dựng một giả thuyết, vì riêng mã trạng thái thì nhập nhằng còn cái pha thì gần như không bao giờ nhập nhằng. Phương án 1 quy cho upstream những dòng mà Nginx viết về chính nó; phương án 2 gán sai cú 500; phương án 4 vừa đọc sai cú 500 vừa đề nghị nới những giới hạn đang làm đúng việc của chúng.',
          ),
        }),

        // q49 · đáp án 1
        mcq({
          prompt: B(
            'You inherit a config with forty locations and a static file 404s. Which probe answers "which block handled it, and what path did it build" in one request?' + code(
              'location /echo { return 200 "uri=$uri docroot=$document_root\\n'
              + '                             file=$request_filename\\n"; }\n' +
              '\n' +
              '-> uri=/echo docroot=/etc/nginx/html file=/etc/nginx/html/echo',
            ),
            'Bạn tiếp quản một cấu hình có bốn mươi location và một tệp tĩnh trả 404. Phép thử nào trả lời được "khối nào đã xử lý, và nó dựng ra đường dẫn nào" chỉ trong một request?' + code(
              'location /echo { return 200 "uri=$uri docroot=$document_root\\n'
              + '                             file=$request_filename\\n"; }\n' +
              '\n' +
              '-> uri=/echo docroot=/etc/nginx/html file=/etc/nginx/html/echo',
            ),
          ),
          options: [
            B(
              'Read the config top to bottom and find the first location whose prefix matches the URL; that is the block Nginx will choose',
              'Đọc cấu hình từ trên xuống rồi tìm location ĐẦU TIÊN có tiền tố khớp URL; đó chính là khối Nginx sẽ chọn',
            ),
            B(
              'Add a debug header or an echo block exposing <code>$request_filename</code> and <code>$document_root</code>, because they show the path Nginx actually built from <code>root</code> or <code>alias</code> — which is exactly what the 404 is about',
              'Thêm một header gỡ rối hoặc một khối echo phơi ra <code>$request_filename</code> và <code>$document_root</code>, vì chúng cho thấy đường dẫn mà Nginx THẬT SỰ dựng ra từ <code>root</code> hay <code>alias</code> — đúng cái mà cú 404 nói về',
            ),
            B(
              'Enable <code>debug_connection</code> for your own IP and read the debug log; it is the only source that names the chosen location, and no variable exposes it',
              'Bật <code>debug_connection</code> cho IP của chính bạn rồi đọc debug log; đó là nguồn duy nhất gọi tên location đã chọn, và không biến nào phơi ra được nó',
            ),
            B(
              'Compare <code>$uri</code> with <code>$request_uri</code>: if they differ a rewrite fired, and if they match the file must exist, so the 404 must come from permissions',
              'So <code>$uri</code> với <code>$request_uri</code>: nếu chúng khác nhau thì có rewrite chạy, còn nếu chúng giống nhau thì tệp phải tồn tại, nên cú 404 chắc chắn tới từ quyền truy cập',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A static 404 is almost always a disagreement between the path you imagine and the path Nginx built, and ' + c('$request_filename') + ' ends the argument in one line: it is the exact string handed to ' + c('open()') + ', already resolved through whichever ' + c('root') + ' or ' + c('alias') + ' won. Print it — through a temporary ' + c('add_header X-Debug-File $request_filename always;') + ' or an echo location — and compare it with what is on disk; the mismatch is usually a missing or extra path segment caused by ' + c('alias') + ' replacing a prefix you thought it would keep. ' + c('$document_root') + ' shows which base was in effect, which identifies the block. Two upgrades to the same technique: add a literal marker per block, such as ' + c('add_header X-Block "static-assets" always;') + ', so a single ' + c('curl -I') + ' names the winner among forty candidates; and remember the error log already contains ' + c('open() "..." failed (2: No such file or directory)') + ' with the same path, which is the zero-config version of this probe. Option 1 is the reasoning that causes the bug — prefix locations compete on length, not position. Option 3 overstates the debug log, which is invaluable but requires a build with ' + c('--with-debug') + ' and is not the only source. Option 4 draws a conclusion about permissions that neither variable supports.',
            'Một cú 404 trên tệp tĩnh gần như luôn là sự bất đồng giữa đường dẫn bạn TƯỞNG TƯỢNG và đường dẫn Nginx DỰNG RA, và ' + c('$request_filename') + ' kết thúc cuộc tranh cãi ấy chỉ trong một dòng: nó là đúng cái chuỗi được đưa cho ' + c('open()') + ', đã giải quyết xong qua bất kỳ ' + c('root') + ' hay ' + c('alias') + ' nào thắng. Hãy in nó ra — bằng một ' + c('add_header X-Debug-File $request_filename always;') + ' tạm thời hoặc một location echo — rồi đem so với thứ có trên đĩa; chỗ lệch thường là một đoạn đường dẫn thiếu hoặc thừa do ' + c('alias') + ' thay mất một tiền tố mà bạn tưởng nó sẽ giữ. ' + c('$document_root') + ' cho thấy cái gốc nào đang có hiệu lực, và điều đó nhận diện luôn cái khối. Hai bản nâng cấp của cùng kỹ thuật này: thêm một dấu mốc nguyên văn cho từng khối, kiểu ' + c('add_header X-Block "static-assets" always;') + ', để chỉ một lệnh ' + c('curl -I') + ' là gọi tên được kẻ thắng giữa bốn mươi ứng viên; và nhớ rằng error log vốn đã chứa sẵn ' + c('open() "..." failed (2: No such file or directory)') + ' với đúng đường dẫn đó, tức là phiên bản không-cần-cấu-hình của chính phép thử này. Phương án 1 chính là lối suy nghĩ gây ra lỗi — location tiền tố đua nhau bằng ĐỘ DÀI chứ không phải vị trí. Phương án 3 nói quá về debug log, thứ vô cùng quý nhưng đòi một bản dựng có ' + c('--with-debug') + ' và không phải nguồn duy nhất. Phương án 4 rút ra một kết luận về quyền truy cập mà không biến nào ủng hộ.',
          ),
        }),

        // q50 · đáp án 2
        mcq({
          prompt: B(
            'A deploy edits <code>nginx.conf</code>, runs <code>nginx -t</code>, reloads, and reports success. Nothing about the site changed. What does the green run actually prove?',
            'Một lượt deploy sửa <code>nginx.conf</code>, chạy <code>nginx -t</code>, nạp lại, và báo thành công. Không có gì trên trang web đổi cả. Lượt chạy xanh đó THẬT SỰ chứng minh điều gì?',
          ),
          options: [
            B(
              'That the new configuration is live, since a reload cannot report success unless the master finished swapping in the new workers',
              'Rằng cấu hình mới đã sống, vì một lượt nạp lại không thể báo thành công trừ khi master đã tráo xong sang các worker mới',
            ),
            B(
              'That the site behaves as intended, because <code>nginx -t</code> loads the same configuration the workers will use and would have failed otherwise',
              'Rằng trang web hành xử đúng ý, vì <code>nginx -t</code> nạp đúng cái cấu hình mà các worker sẽ dùng và lẽ ra đã hỏng nếu không đúng',
            ),
            B(
              'Only that the file Nginx read parses and loads — not that it is the file you edited, and not that any header, route or limit in it now has the effect you wanted',
              'Chỉ chứng minh rằng cái tệp Nginx ĐỌC ĐƯỢC thì phân tích và nạp được — không chứng minh rằng đó là cái tệp bạn đã sửa, và cũng không chứng minh rằng bất kỳ header, tuyến hay giới hạn nào trong đó giờ có tác dụng như bạn muốn',
            ),
            B(
              'That the previous configuration was invalid, since a reload with an unchanged config is a no-op that would not have been reported at all',
              'Rằng cấu hình trước đó không hợp lệ, vì nạp lại với một cấu hình không đổi là một thao tác rỗng và sẽ chẳng được báo cáo gì cả',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the closing rule of the course, and it has the same shape as every expensive failure in it: green at test, green at reload, unchanged in production. ' + c('nginx -t') + ' proves the file it opened parses and loads. It does not prove that file is the one you edited — a bind-mounted single file is attached by inode, so replacing it with ' + c('mv') + ' or an editor that writes-then-renames leaves the process reading the old inode, and both the test and the reload then validate and re-apply the <em>old</em> content while reporting success. It does not prove your directive has an effect either: a header can be silently dropped by a child block that declares one of its own, a limit can sit in a location whose ' + c('return') + ' runs before the limiter, a location can be shadowed by a regex above it, and a proxy header can be reverted to its default by an unrelated edit. Every one of those was measured in this exam, and every one leaves ' + c('nginx -t') + ' clean. So the verification is never the test — it is the observation: ' + c('curl -I') + ' for the header, a status code for the route, a burst of requests for the limit, and ' + c('docker exec ... sha256sum') + ' or ' + c('nginx -T') + ' to confirm the process is reading the bytes you wrote. Options 1, 2 and 4 each grant the test an authority it does not have.',
            'Đây là luật kết của cả khoá học, và nó mang đúng hình dạng của mọi cú hỏng đắt tiền trong khoá: xanh lúc kiểm, xanh lúc nạp lại, production không đổi. ' + c('nginx -t') + ' chứng minh rằng cái tệp NÓ MỞ RA thì phân tích và nạp được. Nó KHÔNG chứng minh cái tệp đó là cái bạn đã sửa — một tệp đơn được bind-mount thì gắn theo INODE, nên thay nó bằng ' + c('mv') + ' hay bằng một trình soạn thảo ghi-rồi-đổi-tên sẽ để tiến trình đọc inode CŨ, và khi đó cả phép kiểm lẫn lượt nạp lại đều xác nhận rồi áp lại nội dung CŨ trong khi vẫn báo thành công. Nó cũng không chứng minh chỉ thị của bạn có TÁC DỤNG: một header có thể bị một khối con khai header riêng xoá âm thầm, một giới hạn có thể nằm trong một location mà cái ' + c('return') + ' chạy trước bộ giới hạn, một location có thể bị một regex nằm trên nó che, và một header proxy có thể bị một lần sửa chẳng liên quan đưa về mặc định. Từng cái một trong số đó đều đã được đo trong đề này, và từng cái một đều để ' + c('nginx -t') + ' sạch trơn. Nên phép kiểm chứng không bao giờ là cái TEST — nó là sự QUAN SÁT: ' + c('curl -I') + ' cho cái header, một mã trạng thái cho cái tuyến, một cụm request cho cái giới hạn, và ' + c('docker exec ... sha256sum') + ' hoặc ' + c('nginx -T') + ' để xác nhận rằng tiến trình đang đọc đúng những byte bạn đã viết. Phương án 1, 2 và 4 mỗi cái đều trao cho phép kiểm một thẩm quyền mà nó không hề có.',
          ),
        }),

      ],
    },
  ],
};
