/**
 * Nginx — Progress Test 1 (chương s00–s03).
 *
 * Đề tự soạn, bám sát `content/courses/nginx/s00…s03`. 30 câu trắc nghiệm +
 * 2 câu lập trình làm ngay trong phòng thi (chấm bằng AI theo rubric).
 *
 * ⚠️ MỌI đoạn terminal trong đề đều CHẠY THẬT ngày 10/09/2026, trên
 *   **nginx/1.27.5** (ảnh `nginx:1.27-alpine`, linux/arm64) chạy trong Docker
 *   Engine 29.5.3 trên macOS 25.6.0 / Apple M1 Max, cùng một upstream Node 22
 *   in lại nguyên văn đường dẫn và header nó nhận được. Mã trạng thái, thông
 *   báo lỗi, dòng error log và đường dẫn `$request_filename` đều là nguyên văn
 *   máy in ra, không phải trí nhớ. Container nháp đã `docker rm -f` sau khi đo.
 *
 * ⚠️ BỐN CHỖ MÁY KHÁC GIÁO TRÌNH, đã đo lại và ĐỀ THEO MÁY:
 *   • Giáo trình (1.2) nói `server_name www.*.com;` — dấu sao ở GIỮA — bị
 *     "Nginx từ chối lúc khởi động". ĐO THẬT: chỉ đúng khi cổng đó có TỪ HAI
 *     khối server trở lên. Với đúng MỘT khối trên cổng ấy, `nginx -t` báo
 *     **test is successful** và tiến trình khởi động bình thường — bảng băm
 *     tên chỉ được dựng (và tên chỉ được kiểm) khi có nhiều máy chủ ảo cùng
 *     cổng. Đề vì thế KHÔNG có câu nào dựa vào lời khẳng định "luôn bị từ
 *     chối".
 *   • Giáo trình (0.3) nói `default_server` là "cờ của socket". ĐO THẬT nó
 *     chặt hơn thế: viết `default_server;` thành một dòng riêng trong khối
 *     server cho ra `unknown directive "default_server"` — nó KHÔNG phải một
 *     directive, mà là tham số của chính dòng `listen`. Câu 11 ra theo đoạn
 *     terminal đó.
 *   • Giáo trình (3.1) chỉ đo bốn dạng `proxy_pass`. ĐO THẬT thêm ba dạng lệch
 *     dấu gạch chéo: `location /p4` + `proxy_pass http://up/;` cho upstream
 *     nhận `//nguoi/1` (gạch đôi), còn `location /p6/` + `proxy_pass
 *     http://up/moi;` cho `/moinguoi/1` (dính liền). Câu 32 dựng đúng bảy dòng
 *     đo được ấy.
 *   • Giáo trình (2.4) nói dấu gạch chéo cuối của `alias` là chuyện sống chết.
 *     ĐO THẬT: `location /a2` + `alias /www/kho/;` cho
 *     `$request_filename=/www/kho//ok.txt` — gạch ĐÔI, mà hệ tệp vẫn mở được
 *     nên request **200**. Chỉ dạng ngược lại (`location /a3/` +
 *     `alias /www/kho;` → `/www/khook.txt`) mới hỏng. Câu 21 phân biệt đúng
 *     hai ca đó thay vì nói chung chung là "thiếu dấu / thì hỏng".
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 7 · B 8 · C 8 · D 7.
 *   node -e "import('./content/exams/NGINX-PT1.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NGINX-PT1.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/nginx-exam-kit.mjs';

export default {
  course: { slug: 'nginx' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Chapters 0–3 (process model, server blocks, locations, reverse proxy)',
        'Kiểm tra tiến độ 1 — Chương 0–3 (mô hình tiến trình, khối server, location, reverse proxy)',
      ),
      description: B(
        'The first third of the Nginx course: what the master and workers each do, how a request finds a server block, the five-step location algorithm, and what actually reaches your application through a proxy_pass. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba đầu của khoá Nginx: master và worker mỗi bên làm gì, một request tìm ra khối server bằng cách nào, thuật toán năm bước chọn location, và cái gì THỰC SỰ tới được ứng dụng qua một proxy_pass. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '0–3'),
      questions: [

        /* ── Chương 0 — bài toán, tiến trình, cấu hình đầu tiên (6 câu) ── */

        // q1 · đáp án 2
        mcq({
          prompt: B(
            'You put Nginx in front of an API that used to be reached directly. What happens to the latency of ONE ordinary API request?',
            'Bạn đặt Nginx trước một API vốn được gọi thẳng. Độ trễ của MỘT lời gọi API bình thường thay đổi thế nào?',
          ),
          options: [
            B(
              'It drops, because Nginx is written in C and answers faster than the application would',
              'Giảm xuống, vì Nginx viết bằng C nên trả lời nhanh hơn ứng dụng',
            ),
            B(
              'It is unchanged: Nginx forwards the bytes without adding any measurable time to the request',
              'Không đổi: Nginx chỉ chuyển tiếp byte chứ không thêm chút thời gian đo được nào',
            ),
            B(
              'It goes up slightly — there is one more hop — and the win is elsewhere: slow connections, TLS and static files stop competing with the application',
              'Tăng lên một chút — có thêm một chặng — và cái được nằm ở chỗ khác: kết nối chậm, TLS và tệp tĩnh thôi giành giật với ứng dụng',
            ),
            B(
              'It drops only when proxy caching is switched on, and is otherwise identical',
              'Chỉ giảm khi bật bộ đệm proxy, còn lại thì y hệt',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A proxied request is always slower than a direct one — the extra hop is real and measurable. What you buy is that the process running your business logic stops holding thousands of slow sockets, stops terminating TLS and stops reading files off disk. The course measurement makes the same point from the other side: sequentially Nginx and Node were 364 ms against 474 ms, but at fifty concurrent clients the gap roughly doubled, and Nginx did it in 8.7 MB of memory against 169 MB.',
            'Một request đi qua proxy thì LUÔN chậm hơn đi thẳng — cái chặng thêm vào là có thật và đo được. Cái bạn mua được là: tiến trình đang chạy logic nghiệp vụ của bạn thôi phải giữ hàng nghìn socket chậm, thôi phải kết thúc TLS và thôi phải đọc tệp từ đĩa. Phép đo trong giáo trình nói đúng điều đó từ phía ngược lại: chạy tuần tự thì Nginx và Node là 364 ms so với 474 ms, nhưng ở năm mươi client đồng thời khoảng cách rộng ra gần gấp đôi, và Nginx làm việc đó trong 8,7 MB bộ nhớ so với 169 MB.',
          ),
        }),

        // q2 · đáp án 1
        mcq({
          prompt: B(
            'A site serves files from <code>/home/cuong/www</code>. The error log says <code>13: Permission denied</code>, yet <code>cat</code> on the file as root works. What is the most likely cause?',
            'Một site phục vụ tệp từ <code>/home/cuong/www</code>. Error log ghi <code>13: Permission denied</code>, trong khi <code>cat</code> tệp đó bằng root vẫn được. Nguyên nhân khả dĩ nhất là gì?',
          ),
          options: [
            B(
              'The file is corrupt and Nginx reports corruption as a permission error',
              'Tệp bị hỏng và Nginx báo lỗi hỏng dưới dạng lỗi quyền truy cập',
            ),
            B(
              'The worker runs as an unprivileged user; it needs read on the file AND execute on every parent directory along the path',
              'Worker chạy bằng người dùng không đặc quyền; nó cần quyền đọc tệp VÀ quyền thực thi trên MỌI thư mục cha dọc đường dẫn',
            ),
            B(
              'The master process could not bind the port, so it never opened the document root at all',
              'Tiến trình master không chiếm được cổng nên chưa từng mở thư mục gốc tài liệu',
            ),
            B(
              'SELinux is the only thing that produces error 13, so the file mode is irrelevant here',
              'Chỉ SELinux mới sinh ra lỗi 13, nên quyền của tệp ở đây không liên quan',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The master runs as root and can read anything, but it serves nothing. Every file is opened by a worker running as <code>nginx</code>, <code>www-data</code> or <code>nobody</code>, and the check is not only on the file: the worker needs the execute bit on <code>/home</code>, on <code>/home/cuong</code> and on <code>/home/cuong/www</code> as well. That is why document roots under a home directory fail so often while the same tree under <code>/srv</code> works. Test it as the worker user, not as yourself.',
            'Master chạy bằng root và đọc được mọi thứ, nhưng nó không phục vụ gì cả. Mọi tệp đều do một worker chạy bằng <code>nginx</code>, <code>www-data</code> hay <code>nobody</code> mở, và phép kiểm không chỉ nằm ở bản thân tệp: worker còn cần bit thực thi trên <code>/home</code>, trên <code>/home/cuong</code> và trên <code>/home/cuong/www</code> nữa. Đó là lý do thư mục gốc tài liệu đặt dưới thư mục nhà hay hỏng đến thế, còn cùng cây đó đặt dưới <code>/srv</code> thì chạy. Hãy thử bằng chính người dùng worker, đừng thử bằng chính bạn.',
          ),
        }),

        // q3 · đáp án 3
        mcq({
          prompt: B(
            'Log rotation renames <code>access.log</code> to <code>access.log.1</code> every night. A week later there is no log data at all, although the site works. What is missing?',
            'Kịch bản xoay log đổi tên <code>access.log</code> thành <code>access.log.1</code> mỗi đêm. Một tuần sau không còn dữ liệu log nào cả, dù site vẫn chạy. Thiếu cái gì?',
          ),
          options: [
            B(
              'A <code>systemctl restart nginx</code> after every rotation, because the log path is read at startup',
              'Một lệnh <code>systemctl restart nginx</code> sau mỗi lần xoay, vì đường dẫn log chỉ đọc lúc khởi động',
            ),
            B(
              'An <code>access_log</code> directive — renaming the file switches logging off until it is redeclared',
              'Một chỉ thị <code>access_log</code> — đổi tên tệp làm tắt việc ghi log cho tới khi khai lại',
            ),
            B(
              'Nothing is missing: Nginx recreates the file automatically within a minute of it disappearing',
              'Không thiếu gì cả: Nginx tự tạo lại tệp trong vòng một phút sau khi nó biến mất',
            ),
            B(
              'The <code>nginx -s reopen</code> signal — Nginx keeps writing into the renamed inode until it is told to reopen its files',
              'Tín hiệu <code>nginx -s reopen</code> — Nginx cứ ghi vào cái inode đã đổi tên cho tới khi được bảo mở lại tệp',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A rename does not close a file descriptor. Nginx holds the log open, so after the rename it goes on writing into <code>access.log.1</code> — and once that file is compressed or deleted, the writes go nowhere at all. <code>nginx -s reopen</code> makes it close and reopen every log by path, which is exactly why every distribution\'s logrotate snippet for Nginx ends with that signal. A full <code>restart</code> would also work and costs you every in-flight connection, which is why nobody does it.',
            'Đổi tên KHÔNG đóng một file descriptor. Nginx vẫn giữ tệp log đang mở nên sau khi đổi tên nó tiếp tục ghi vào <code>access.log.1</code> — và khi tệp đó bị nén hoặc bị xoá thì các lệnh ghi rơi vào hư không. <code>nginx -s reopen</code> bảo nó đóng rồi mở lại mọi tệp log theo ĐƯỜNG DẪN, và đó chính là lý do đoạn logrotate cho Nginx của mọi bản phân phối đều kết thúc bằng tín hiệu đó. Một lệnh <code>restart</code> đầy đủ cũng chạy được, đổi lại bạn mất mọi kết nối đang bay, nên chẳng ai làm thế.',
          ),
        }),

        // q4 · đáp án 2
        mcq({
          prompt: B(
            'A production server has a dozen files under <code>sites-enabled</code> and you need to know which file a setting is really coming from. Which command answers that?',
            'Một máy chủ production có cả chục tệp dưới <code>sites-enabled</code> và bạn cần biết một thiết lập THẬT SỰ tới từ tệp nào. Câu lệnh nào trả lời được?',
          ),
          options: [
            B('<code>nginx -v</code> — it prints the build and the active configuration path', '<code>nginx -v</code> — nó in ra bản dựng và đường dẫn cấu hình đang dùng'),
            B('<code>nginx -t</code> — the test output lists every file it parsed, in order', '<code>nginx -t</code> — kết quả kiểm liệt kê mọi tệp nó đã phân tích, theo thứ tự'),
            B('<code>nginx -s dump</code> — it writes the merged configuration to the error log, one file per include', '<code>nginx -s dump</code> — nó ghi cấu hình đã gộp vào error log, mỗi include một tệp'),
            B('<code>nginx -T</code> — capital T prints the whole effective configuration with every include expanded', '<code>nginx -T</code> — chữ T HOA in ra toàn bộ cấu hình hiệu lực với mọi include đã bung ra'),
          ],
          correct: 3,
          explanation: EX(
            'Lower-case <code>-t</code> tests and prints two lines; upper-case <code>-T</code> tests AND dumps the fully assembled configuration to standard output, each included file announced by a <code># configuration file …</code> comment. That is the only honest answer to "what is actually running", and it is the first command to run on a machine whose config you did not write. <code>nginx -v</code> prints the version; <code>-s</code> only takes <code>stop</code>, <code>quit</code>, <code>reload</code> and <code>reopen</code>.',
            'Chữ <code>-t</code> thường thì kiểm và in ra hai dòng; chữ <code>-T</code> HOA thì vừa kiểm VỪA đổ toàn bộ cấu hình đã ghép ra đầu ra chuẩn, mỗi tệp được include đều có một dòng chú thích <code># configuration file …</code> báo tên. Đó là câu trả lời trung thực duy nhất cho "cái gì đang thật sự chạy", và là câu lệnh đầu tiên nên gõ trên một máy có cấu hình không phải bạn viết. <code>nginx -v</code> in phiên bản; còn <code>-s</code> chỉ nhận <code>stop</code>, <code>quit</code>, <code>reload</code> và <code>reopen</code>.',
          ),
        }),

        // q5 · đáp án 0
        mcq({
          prompt: B(
            'Three URLs on one server block, measured on nginx/1.27.5. Which rule produces all three lines?' + code(
              'server {\n' +
              '  listen 8085;\n' +
              '  add_header X-Server   "S"       always;\n' +
              '  add_header X-Bao-Mat  "nosniff" always;\n' +
              '  location /thua  { return 200 "thua"; }\n' +
              '  location /ghide { add_header X-Rieng "R" always; return 200 "ghide"; }\n' +
              '  location /anh   { expires 7d; return 200 "anh"; }\n' +
              '}\n\n' +
              '--- /thua ---            --- /ghide ---       --- /anh ---\n' +
              'X-Server: S              X-Rieng: R           Expires: Thu, 17 Sep 2026 ...\n' +
              'X-Bao-Mat: nosniff                            Cache-Control: max-age=604800\n' +
              '                                              X-Server: S\n' +
              '                                              X-Bao-Mat: nosniff',
            ),
            'Ba URL trên cùng một khối server, đo trên nginx/1.27.5. Luật nào sinh ra cả ba dòng?' + code(
              'server {\n' +
              '  listen 8085;\n' +
              '  add_header X-Server   "S"       always;\n' +
              '  add_header X-Bao-Mat  "nosniff" always;\n' +
              '  location /thua  { return 200 "thua"; }\n' +
              '  location /ghide { add_header X-Rieng "R" always; return 200 "ghide"; }\n' +
              '  location /anh   { expires 7d; return 200 "anh"; }\n' +
              '}\n\n' +
              '--- /thua ---            --- /ghide ---       --- /anh ---\n' +
              'X-Server: S              X-Rieng: R           Expires: Thu, 17 Sep 2026 ...\n' +
              'X-Bao-Mat: nosniff                            Cache-Control: max-age=604800\n' +
              '                                              X-Server: S\n' +
              '                                              X-Bao-Mat: nosniff',
            ),
          ),
          options: [
            B(
              'A list-valued directive is inherited only while the child declares none of its own; one entry in the child REPLACES the whole inherited list',
              'Chỉ thị dạng DANH SÁCH chỉ được thừa hưởng khi khối con không khai cái nào của riêng nó; một mục ở khối con là THAY THẾ cả danh sách thừa hưởng',
            ),
            B(
              'Headers are merged, and <code>/ghide</code> lost two of them because <code>always</code> only applies at the server level',
              'Các header được gộp lại, và <code>/ghide</code> mất hai cái vì <code>always</code> chỉ có tác dụng ở tầng server',
            ),
            B(
              'Only the last <code>add_header</code> written anywhere in the file takes effect for the whole server',
              'Chỉ chỉ thị <code>add_header</code> viết cuối cùng ở bất kỳ đâu trong tệp mới có tác dụng, cho cả server',
            ),
            B(
              '<code>return</code> discards inherited headers, which is why <code>/anh</code> — the only block without one — kept them',
              '<code>return</code> vứt bỏ header thừa hưởng, nên <code>/anh</code> — khối duy nhất không có nó — mới giữ được chúng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the inheritance rule that explains most of "I set it and it does nothing". Scalar directives such as <code>root</code> behave as expected — the nearest one wins. List-valued ones (<code>add_header</code>, <code>proxy_set_header</code>, <code>fastcgi_param</code>) are inherited by REPLACEMENT: <code>/ghide</code> declared one header and lost both server-level ones, while <code>/anh</code> declared none and kept them (the two cache headers there come from <code>expires</code>, not from an <code>add_header</code>). Nothing warns you, and <code>nginx -t</code> is perfectly happy. The fix is a snippet file you <code>include</code> in every block that adds a header of its own.',
            'Đây chính là luật thừa hưởng giải thích phần lớn những lần "tôi đặt rồi mà nó chẳng có tác dụng gì". Chỉ thị vô hướng như <code>root</code> thì hành xử đúng như trông đợi — cái gần nhất thắng. Còn chỉ thị dạng danh sách (<code>add_header</code>, <code>proxy_set_header</code>, <code>fastcgi_param</code>) thì thừa hưởng theo kiểu THAY THẾ: <code>/ghide</code> khai một header và mất cả hai cái ở tầng server, còn <code>/anh</code> không khai cái nào nên giữ được (hai header cache ở đó là do <code>expires</code> sinh ra chứ không phải <code>add_header</code>). Không có cảnh báo nào, và <code>nginx -t</code> hoàn toàn hài lòng. Cách sửa là một tệp snippet rồi <code>include</code> vào mọi khối có add_header của riêng nó.',
          ),
        }),

        // q6 · đáp án 1
        mcq({
          prompt: B(
            'A missing semicolon, measured on nginx/1.27.5. Line 1 is <code>events{} http{</code>, line 2 is <code>server_name a.com;</code>. What does the message tell you?' + code(
              'server { listen 80        <- dong 1, THIEU dau cham phay\n' +
              '  server_name a.com;      <- dong 2\n' +
              '\n' +
              '$ nginx -t -c /tmp/t.conf\n' +
              'nginx: [emerg] invalid parameter "server_name" in /tmp/t.conf:2\n' +
              'nginx: configuration file /tmp/t.conf test failed',
            ),
            'Một dấu chấm phẩy bị thiếu, đo trên nginx/1.27.5. Dòng 1 là <code>events{} http{</code>, dòng 2 là <code>server_name a.com;</code>. Thông báo này nói lên điều gì?' + code(
              'server { listen 80        <- dong 1, THIEU dau cham phay\n' +
              '  server_name a.com;      <- dong 2\n' +
              '\n' +
              '$ nginx -t -c /tmp/t.conf\n' +
              'nginx: [emerg] invalid parameter "server_name" in /tmp/t.conf:2\n' +
              'nginx: configuration file /tmp/t.conf test failed',
            ),
          ),
          options: [
            B(
              '<code>server_name</code> is genuinely invalid inside a <code>server</code> block, and the fix is to move it out to <code>http</code>',
              '<code>server_name</code> quả thật không hợp lệ bên trong khối <code>server</code>, và cách sửa là chuyển nó ra tầng <code>http</code>',
            ),
            B(
              'The reported line is the line AFTER the real mistake: the parser was still reading <code>listen</code>, so it saw <code>server_name</code> as a parameter of it',
              'Dòng bị báo là dòng SAU chỗ sai thật: bộ phân tích vẫn đang đọc <code>listen</code> nên nó thấy <code>server_name</code> như một tham số của chỉ thị đó',
            ),
            B(
              'The domain <code>a.com</code> is rejected because it does not resolve in DNS at test time',
              'Tên miền <code>a.com</code> bị từ chối vì lúc kiểm nó không phân giải được trong DNS',
            ),
            B(
              'Nginx numbers lines from zero, so line 2 in the message means the first physical line of the file',
              'Nginx đánh số dòng từ 0, nên "dòng 2" trong thông báo chính là dòng vật lý đầu tiên của tệp',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A directive ends at its semicolon, so without one the parser keeps consuming tokens as arguments of the previous directive. It only notices something is wrong when it reaches a token that cannot be a parameter — which is on the NEXT line. This is the single most confusing message Nginx produces: when the line named in the error looks perfectly correct, read the line above it. The same shape appears with a missing closing brace, where the error is reported at the end of the file.',
            'Một chỉ thị kết thúc ở dấu chấm phẩy của nó, nên khi thiếu dấu đó thì bộ phân tích cứ nuốt tiếp các từ như tham số của chỉ thị trước. Nó chỉ nhận ra có gì sai khi gặp một từ không thể là tham số — mà từ đó nằm ở dòng SAU. Đây là thông báo dễ gây rối nhất mà Nginx sinh ra: khi cái dòng bị nêu tên trong lỗi trông hoàn toàn đúng thì hãy đọc dòng NGAY TRÊN nó. Hình dạng y hệt cũng xuất hiện khi thiếu dấu ngoặc nhọn đóng, lúc đó lỗi bị báo ở cuối tệp.',
          ),
        }),

        /* ── Chương 1 — request tìm ra khối server (8 câu) ─────────────── */

        // q7 · đáp án 2
        mcq({
          prompt: B(
            'One block says <code>listen 8080;</code> and another says <code>listen 127.0.0.1:8080;</code>. A connection arrives on <code>127.0.0.1:8080</code>. What happens first?',
            'Một khối viết <code>listen 8080;</code> và khối kia viết <code>listen 127.0.0.1:8080;</code>. Một kết nối tới trên <code>127.0.0.1:8080</code>. Chuyện gì xảy ra TRƯỚC?',
          ),
          options: [
            B(
              'The <code>Host</code> header is compared against both blocks, and whichever name matches decides',
              'Header <code>Host</code> được so với cả hai khối, và tên nào khớp thì khối đó quyết định',
            ),
            B(
              'The block written first in the file wins, because listen groups are resolved in file order',
              'Khối viết trước trong tệp thắng, vì các nhóm listen được giải quyết theo thứ tự tệp',
            ),
            B(
              'The specific address wins the group: only <code>127.0.0.1:8080</code> blocks are candidates, and the wildcard block is never considered',
              'Địa chỉ CỤ THỂ thắng ở khâu chọn nhóm: chỉ những khối <code>127.0.0.1:8080</code> mới là ứng viên, khối đại diện không hề được xét tới',
            ),
            B(
              'Nginx refuses to start: two blocks may not listen on overlapping addresses',
              'Nginx từ chối khởi động: hai khối không được nghe trên các địa chỉ chồng lấn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Server selection has two stages and almost every explanation skips the first. Stage one is the SOCKET: the address and port the connection was accepted on select a group of candidate blocks, and a specific address beats the wildcard for that port. Only inside that group does stage two compare <code>Host</code> against <code>server_name</code>. So a request landing on the wrong site is very often a request that never reached the right <code>listen</code> at all — which is why you read a configuration by port (<code>nginx -T | grep -E "listen|server_name"</code>) rather than by file.',
            'Việc chọn khối server có HAI khâu và gần như mọi lời giải thích đều bỏ qua khâu đầu. Khâu một là SOCKET: địa chỉ và cổng mà kết nối được nhận vào sẽ chọn ra một NHÓM khối ứng viên, và địa chỉ cụ thể thắng địa chỉ đại diện trên cùng cổng đó. Chỉ BÊN TRONG nhóm ấy khâu hai mới đem <code>Host</code> so với <code>server_name</code>. Nên một request rơi nhầm site rất thường là một request chưa từng chạm tới đúng dòng <code>listen</code> — và đó là lý do bạn đọc cấu hình theo CỔNG (<code>nginx -T | grep -E "listen|server_name"</code>) chứ không đọc theo tệp.',
          ),
        }),

        // q8 · đáp án 1
        mcq({
          prompt: B(
            'Five blocks on port 8087, measured on nginx/1.27.5. Explain the <code>may42.vd.com</code> row.' + code(
              'server { listen 8087;                server_name mot.vd.com;              -> 1 EXACT }\n' +
              'server { listen 8087;                server_name *.vd.com;                -> 2 WILD-DAU }\n' +
              'server { listen 8087;                server_name www.vd.*;                -> 3 WILD-CUOI }\n' +
              'server { listen 8087;                server_name ~^may(\\d+)\\.vd\\.com$;    -> 4 REGEX }\n' +
              'server { listen 8087 default_server; server_name khac.vd.org;             -> 5 MAC DINH }\n' +
              '\n' +
              'Host: mot.vd.com      -> 1 EXACT\n' +
              'Host: batky.vd.com    -> 2 WILD-DAU\n' +
              'Host: www.vd.net      -> 3 WILD-CUOI\n' +
              'Host: may42.vd.com    -> 2 WILD-DAU        <- KHONG phai khoi regex\n' +
              'Host: khong-khop.com  -> 5 MAC DINH',
            ),
            'Năm khối trên cổng 8087, đo trên nginx/1.27.5. Hãy giải thích dòng <code>may42.vd.com</code>.' + code(
              'server { listen 8087;                server_name mot.vd.com;              -> 1 EXACT }\n' +
              'server { listen 8087;                server_name *.vd.com;                -> 2 WILD-DAU }\n' +
              'server { listen 8087;                server_name www.vd.*;                -> 3 WILD-CUOI }\n' +
              'server { listen 8087;                server_name ~^may(\\d+)\\.vd\\.com$;    -> 4 REGEX }\n' +
              'server { listen 8087 default_server; server_name khac.vd.org;             -> 5 MAC DINH }\n' +
              '\n' +
              'Host: mot.vd.com      -> 1 EXACT\n' +
              'Host: batky.vd.com    -> 2 WILD-DAU\n' +
              'Host: www.vd.net      -> 3 WILD-CUOI\n' +
              'Host: may42.vd.com    -> 2 WILD-DAU        <- KHONG phai khoi regex\n' +
              'Host: khong-khop.com  -> 5 MAC DINH',
            ),
          ),
          options: [
            B(
              'The regex is wrong — it would have won if the capture group had been named',
              'Cái regex viết sai — nó đã thắng nếu nhóm bắt được đặt tên',
            ),
            B(
              'Nginx ranks by KIND, not by how specific a pattern looks: leading wildcards are level 2 and regexes are level 4, so the wildcard shadows the regex block entirely',
              'Nginx xếp hạng theo LOẠI chứ không theo việc mẫu trông cụ thể tới đâu: đại diện ở đầu là mức 2 còn regex là mức 4, nên khối đại diện che khuất hẳn khối regex',
            ),
            B(
              'The wildcard block was written earlier in the file, and among matching blocks the first one always wins',
              'Khối đại diện được viết trước trong tệp, và giữa các khối cùng khớp thì cái đầu tiên luôn thắng',
            ),
            B(
              'Regex blocks are only consulted when the <code>Host</code> header is absent',
              'Khối regex chỉ được xét tới khi header <code>Host</code> vắng mặt',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Four levels, checked in sequence, first hit ends the search: exact name, then leading wildcard <code>*.vd.com</code>, then trailing wildcard <code>www.vd.*</code>, then regular expressions. People expect the "more precise" pattern to win, and Nginx simply does not rank that way. The practical consequence is that a catch-all <code>*.example.com</code> silently swallows every regex block for that domain — the block is right there in the file and never runs. If a regex must win, remove the wildcard that shadows it. Note the last row too: an unmatched Host is not an error, it goes to the port\'s default server.',
            'Bốn mức, xét lần lượt, hễ trúng là dừng: tên chính xác, rồi đại diện ở ĐẦU <code>*.vd.com</code>, rồi đại diện ở CUỐI <code>www.vd.*</code>, rồi mới tới biểu thức chính quy. Người ta trông đợi mẫu "chính xác hơn" sẽ thắng, còn Nginx đơn giản là không xếp hạng theo kiểu đó. Hệ quả thực tế: một khối bắt-tất <code>*.example.com</code> âm thầm nuốt trọn mọi khối regex của tên miền ấy — khối đó nằm sờ sờ trong tệp mà không bao giờ chạy. Muốn regex thắng thì phải bỏ cái đại diện đang che nó. Cũng để ý dòng cuối: một Host không khớp KHÔNG phải lỗi, nó đi tới máy chủ mặc định của cổng đó.',
          ),
        }),

        // q9 · đáp án 3
        mcq({
          prompt: B(
            'Same five blocks. Two more hosts were sent, and both are worth a second look.' + code(
              'Host: vd.com          -> 5 MAC DINH\n' +
              'Host: MOT.VD.COM      -> 1 EXACT\n' +
              'Host: mot.vd.com.     -> 1 EXACT',
            ) + 'Which reading is correct?',
            'Vẫn năm khối đó. Thêm hai cái Host nữa được gửi lên, và cả hai đều đáng nhìn kỹ.' + code(
              'Host: vd.com          -> 5 MAC DINH\n' +
              'Host: MOT.VD.COM      -> 1 EXACT\n' +
              'Host: mot.vd.com.     -> 1 EXACT',
            ) + 'Cách đọc nào ĐÚNG?',
          ),
          options: [
            B(
              '<code>vd.com</code> reached the default because wildcards are disabled once a regex block exists on the same port',
              '<code>vd.com</code> rơi vào mặc định vì ký tự đại diện bị vô hiệu khi cổng đó có một khối regex',
            ),
            B(
              'The uppercase and trailing-dot rows prove Nginx compares the raw header byte for byte, so those two matched by luck',
              'Hai dòng chữ hoa và dấu chấm cuối chứng tỏ Nginx so header thô theo từng byte, nên hai cái đó khớp là do may',
            ),
            B(
              'All three rows show the same thing: only an exactly-typed name can ever match a <code>server_name</code>',
              'Cả ba dòng cho thấy cùng một điều: chỉ tên gõ chính xác từng ký tự mới khớp được một <code>server_name</code>',
            ),
            B(
              '<code>*.vd.com</code> covers exactly one label in front, so it does not match the bare apex; and Nginx lowercases the Host and drops a fully-qualified trailing dot before comparing',
              '<code>*.vd.com</code> phủ đúng MỘT nhãn phía trước nên không khớp chính tên gốc; còn Nginx thì hạ chữ thường và bỏ dấu chấm cuối của tên đầy đủ trước khi so',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Two separate rules, both measured. A leading wildcard covers exactly one label and the star never spans a dot, so <code>*.vd.com</code> matches <code>a.vd.com</code> and not <code>vd.com</code> — a site that needs both writes <code>server_name vd.com *.vd.com;</code>, and forgetting that is why an apex domain sometimes lands on the default server. Separately, Nginx normalises the Host before comparing: it lowercases it, strips the port, and drops the trailing dot of a fully-qualified name. That is why you never list case variants, and why a hand-written comparison against <code>$http_host</code> is worse than letting <code>server_name</code> do the matching.',
            'Hai luật riêng biệt, cả hai đều đã đo. Đại diện ở đầu phủ đúng MỘT nhãn và dấu sao không bao giờ vượt qua dấu chấm, nên <code>*.vd.com</code> khớp <code>a.vd.com</code> chứ không khớp <code>vd.com</code> — một site cần cả hai thì viết <code>server_name vd.com *.vd.com;</code>, và quên điều đó chính là lý do tên miền gốc thỉnh thoảng rơi vào máy chủ mặc định. Riêng chuyện thứ hai: Nginx chuẩn hoá Host trước khi so — hạ chữ thường, cắt cổng, và bỏ dấu chấm cuối của tên đầy đủ. Vì thế bạn không bao giờ phải liệt kê các biến thể hoa thường, và vì thế một phép so tự viết với <code>$http_host</code> luôn tệ hơn là để <code>server_name</code> làm việc đó.',
          ),
        }),

        // q10 · đáp án 0
        mcq({
          prompt: B(
            'This block was written to be the catch-all for port 80. Measured on nginx/1.27.5, it does not start. Why?' + code(
              'server {\n' +
              '  listen 80;\n' +
              '  default_server;\n' +
              '  server_name _;\n' +
              '  return 444;\n' +
              '}\n' +
              '\n' +
              '$ nginx -t -c /tmp/t.conf\n' +
              'nginx: [emerg] unknown directive "default_server" in /tmp/t.conf:74',
            ),
            'Khối này được viết để làm khối bắt-tất cho cổng 80. Đo trên nginx/1.27.5, nó không khởi động được. Vì sao?' + code(
              'server {\n' +
              '  listen 80;\n' +
              '  default_server;\n' +
              '  server_name _;\n' +
              '  return 444;\n' +
              '}\n' +
              '\n' +
              '$ nginx -t -c /tmp/t.conf\n' +
              'nginx: [emerg] unknown directive "default_server" in /tmp/t.conf:74',
            ),
          ),
          options: [
            B(
              '<code>default_server</code> is not a directive at all — it is a parameter of <code>listen</code>, so the line must read <code>listen 80 default_server;</code>',
              '<code>default_server</code> hoàn toàn không phải một chỉ thị — nó là THAM SỐ của <code>listen</code>, nên dòng đó phải viết là <code>listen 80 default_server;</code>',
            ),
            B(
              'The directive exists but requires the <code>ngx_http_default_module</code>, which this build was compiled without',
              'Chỉ thị đó có tồn tại nhưng cần module <code>ngx_http_default_module</code>, mà bản dựng này không biên dịch vào',
            ),
            B(
              'It must be declared before <code>listen</code>; directives inside a server block are order-sensitive',
              'Nó phải khai TRƯỚC <code>listen</code>; các chỉ thị trong một khối server nhạy với thứ tự',
            ),
            B(
              '<code>server_name _;</code> conflicts with it, and removing the underscore line makes the config valid',
              '<code>server_name _;</code> xung đột với nó, và bỏ dòng gạch dưới đi là cấu hình hợp lệ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The flag belongs to the listening SOCKET, not to the block, which is why it is written on the <code>listen</code> line — and the same is true of <code>ssl</code>, <code>http2</code> and <code>reuseport</code>. Two consequences follow. Only ONE block per <code>address:port</code> may carry it, and a second one is a startup error (<code>a duplicate default server for 0.0.0.0:80</code>). And a dual-stack server needs it on both the IPv4 and the IPv6 <code>listen</code> lines of the same block. Note also that <code>server_name _;</code> is not special syntax — it is simply a name no real Host can equal, so the block is only ever reached through the flag.',
            'Cái cờ này thuộc về SOCKET đang nghe chứ không thuộc về khối, nên nó được viết ngay trên dòng <code>listen</code> — và <code>ssl</code>, <code>http2</code>, <code>reuseport</code> cũng vậy. Hai hệ quả đi kèm. CHỈ MỘT khối cho mỗi cặp <code>địa chỉ:cổng</code> được mang nó, cái thứ hai là lỗi khởi động (<code>a duplicate default server for 0.0.0.0:80</code>). Và một máy chủ hai ngăn xếp cần cờ đó trên CẢ dòng <code>listen</code> IPv4 lẫn dòng IPv6 của cùng khối. Cũng để ý <code>server_name _;</code> không phải cú pháp đặc biệt gì — nó chỉ là một cái tên mà không Host thật nào bằng được, nên khối đó chỉ tới được qua cái cờ kia.',
          ),
        }),

        // q11 · đáp án 2
        mcq({
          prompt: B(
            'A layout has one file per site under <code>sites-enabled</code>, loaded by <code>include .../*.conf</code>. The catch-all block in <code>00-default.conf</code> has no <code>default_server</code> flag but returns 444, and unknown hosts are refused. Someone renames the file to <code>99-default.conf</code> during a tidy-up. What changes?',
            'Một bố cục có mỗi site một tệp dưới <code>sites-enabled</code>, nạp bằng <code>include .../*.conf</code>. Khối bắt-tất trong <code>00-default.conf</code> không mang cờ <code>default_server</code> nhưng trả về 444, và các host lạ bị từ chối. Ai đó đổi tên tệp thành <code>99-default.conf</code> trong một lần dọn dẹp. Điều gì thay đổi?',
          ),
          options: [
            B(
              'Nothing — the glob sorts blocks by <code>server_name</code>, not by filename',
              'Không gì cả — lệnh glob xếp các khối theo <code>server_name</code> chứ không theo tên tệp',
            ),
            B(
              'Nginx refuses to reload, because a catch-all block must sort first',
              'Nginx từ chối nạp lại, vì khối bắt-tất bắt buộc phải xếp đầu',
            ),
            B(
              'The default for that port becomes whichever block now loads FIRST, so unknown hosts stop being refused and start being served by a real site',
              'Máy chủ mặc định của cổng đó trở thành khối nào GIỜ được nạp đầu tiên, nên host lạ thôi bị từ chối và bắt đầu được một site thật phục vụ',
            ),
            B(
              'Unknown hosts start getting 404 from Nginx, because no block claims them any more',
              'Host lạ bắt đầu nhận 404 từ Nginx, vì không còn khối nào nhận chúng nữa',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Every port always has a default server — you only choose whether it is deliberate. Without the flag, the default is the block that loads first, and <code>include</code> with a glob loads in sorted order, so the default is decided by alphabetical accident. Renaming one file makes another site the fallback: an unknown or forged Host stops being refused and starts being answered — often with a redirect to your apex, which quietly makes your site answer for names you never registered. No directive changed, no error appeared, and <code>nginx -t</code> was happy, because the configuration was fine; it just did something else. Declare <code>default_server</code> explicitly on every listen group.',
            'Mọi cổng LUÔN có một máy chủ mặc định — bạn chỉ chọn được nó có phải chủ ý hay không. Không có cờ thì mặc định là khối được nạp ĐẦU TIÊN, mà <code>include</code> với glob thì nạp theo thứ tự đã sắp, nên máy chủ mặc định được quyết bởi một tai nạn bảng chữ cái. Đổi tên một tệp là một site khác thành nơi dự phòng: một Host lạ hoặc giả mạo thôi bị từ chối và bắt đầu được trả lời — thường là bằng một cú chuyển hướng về trang gốc, khiến site của bạn âm thầm trả lời thay cho những cái tên bạn chưa từng đăng ký. Không chỉ thị nào đổi, không lỗi nào hiện ra, và <code>nginx -t</code> vẫn hài lòng vì cấu hình đúng thật; chỉ là nó làm một việc khác. Hãy khai <code>default_server</code> tường minh cho MỖI nhóm listen.',
          ),
        }),

        // q12 · đáp án 1
        mcq({
          prompt: B(
            'One request, one block with no <code>server_name</code> of its own, measured on nginx/1.27.5.' + code(
              "$ curl -H 'Host: KE-GIA.com:9999' 'http://127.0.0.1:8091/bien/x?a=1'\n" +
              'host=[ke-gia.com]  http_host=[KE-GIA.com:9999]  server_name=[]\n' +
              'scheme=[http]      uri=[/bien/x]                req=[/bien/x?a=1]',
            ) + 'Which variable may safely be put into a <code>Location</code> header you send back?',
            'Một request, một khối không có <code>server_name</code> của riêng nó, đo trên nginx/1.27.5.' + code(
              "$ curl -H 'Host: KE-GIA.com:9999' 'http://127.0.0.1:8091/bien/x?a=1'\n" +
              'host=[ke-gia.com]  http_host=[KE-GIA.com:9999]  server_name=[]\n' +
              'scheme=[http]      uri=[/bien/x]                req=[/bien/x?a=1]',
            ) + 'Biến nào có thể AN TOÀN đặt vào một header <code>Location</code> mà bạn gửi trả lại?',
          ),
          options: [
            B('<code>$host</code>, because Nginx has already validated it against <code>server_name</code>', '<code>$host</code>, vì Nginx đã kiểm chứng nó với <code>server_name</code> rồi'),
            B('None of them — a redirect target must be a literal you wrote in the configuration', 'Không cái nào cả — đích của một cú chuyển hướng phải là hằng số do bạn viết trong cấu hình'),
            B('<code>$http_host</code>, because it is the exact value the browser is already using', '<code>$http_host</code>, vì nó đúng là giá trị mà trình duyệt đang dùng'),
            B('<code>$uri</code>, because normalisation has removed every dangerous character from it', '<code>$uri</code>, vì phép chuẩn hoá đã gỡ hết ký tự nguy hiểm khỏi nó'),
          ],
          correct: 1,
          explanation: EX(
            'Three of those four values came from the request. <code>$host</code> is tidied — lowercased, port stripped — but it is still the string the client typed, and here it kept the attacker\'s name even though the block matched. <code>$server_name</code> is the one value a client cannot influence, and it is empty in this block because none was declared. Sort every use into two piles: anything you only LOOK at (logs, routing, a captured subdomain) may come from the request, because a wrong value affects one request; anything you send BACK — a <code>Location</code>, a link in a page, a cookie domain, a cache key — must be built from your configuration.',
            'Ba trong bốn giá trị đó tới TỪ request. <code>$host</code> có được dọn dẹp — hạ chữ thường, cắt cổng — nhưng nó vẫn là chuỗi do client gõ, và ở đây nó giữ nguyên cái tên của kẻ tấn công dù khối vẫn khớp. <code>$server_name</code> là giá trị DUY NHẤT client không tác động được, và nó rỗng trong khối này vì chẳng ai khai. Hãy chia mọi chỗ dùng thành hai đống: thứ bạn chỉ NHÌN (log, quyết định định tuyến, tên miền con bắt được) thì lấy từ request được, vì giá trị sai chỉ ảnh hưởng đúng một request; còn thứ bạn GỬI TRẢ — một <code>Location</code>, một liên kết trong trang, miền của cookie, khoá bộ đệm — thì phải dựng từ cấu hình của bạn.',
          ),
        }),

        // q13 · đáp án 3
        mcq({
          prompt: B(
            'The configuration below contains no <code>$host</code> anywhere, yet this was measured on nginx/1.27.5.' + code(
              "$ curl -sI -H 'Host: KE-GIA.com' http://127.0.0.1:8091/thu-muc\n" +
              'HTTP/1.1 301 Moved Permanently\n' +
              'Location: http://ke-gia.com:8091/thu-muc/\n' +
              '\n' +
              '# cung request, tren mot khoi co them: absolute_redirect off;\n' +
              'HTTP/1.1 301 Moved Permanently\n' +
              'Location: /thu-muc/',
            ) + 'What produced the first redirect?',
            'Cấu hình bên dưới không hề có <code>$host</code> ở đâu cả, vậy mà đây là kết quả đo trên nginx/1.27.5.' + code(
              "$ curl -sI -H 'Host: KE-GIA.com' http://127.0.0.1:8091/thu-muc\n" +
              'HTTP/1.1 301 Moved Permanently\n' +
              'Location: http://ke-gia.com:8091/thu-muc/\n' +
              '\n' +
              '# cung request, tren mot khoi co them: absolute_redirect off;\n' +
              'HTTP/1.1 301 Moved Permanently\n' +
              'Location: /thu-muc/',
            ),
          ),
          options: [
            B(
              'The client library added the redirect; Nginx only sent a 200 and curl rewrote it',
              'Thư viện client tự thêm cú chuyển hướng; Nginx chỉ gửi 200 rồi curl viết lại',
            ),
            B(
              'A <code>rewrite</code> rule inherited from the <code>http</code> level, which is invisible in the server block',
              'Một luật <code>rewrite</code> thừa hưởng từ tầng <code>http</code>, thứ không nhìn thấy được trong khối server',
            ),
            B(
              'The directory has an <code>index.html</code>, and serving an index always emits a 301 first',
              'Thư mục đó có <code>index.html</code>, và việc phục vụ trang index thì luôn phát ra một cú 301 trước',
            ),
            B(
              'Nginx issues its OWN 301 to add the missing trailing slash on a directory, and it builds that absolute <code>Location</code> from the client-controlled Host',
              'Nginx tự phát ra một cú 301 của CHÍNH NÓ để thêm dấu gạch chéo cuối còn thiếu cho một thư mục, và nó dựng cái <code>Location</code> tuyệt đối đó từ Host do client điều khiển',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is the case that catches careful people, because you did not write the redirect. When a request names a directory without a trailing slash, Nginx redirects to add one — and the absolute form of that <code>Location</code> is built from <code>$host</code>. So a security review that greps the config for <code>$host</code> finds nothing and the hole is still there. The same applies to the automatic redirect from a <code>rewrite</code> and to <code>try_files</code> falling through to a directory. Two directives fix it at the source, at the <code>http</code> level: <code>absolute_redirect off;</code> makes the header relative, and <code>server_name_in_redirect on;</code> uses the configured name instead of the header.',
            'Đây là ca hạ gục cả những người cẩn thận, vì cú chuyển hướng ấy không phải bạn viết. Khi một request gọi tên một thư mục mà thiếu dấu gạch chéo cuối, Nginx tự chuyển hướng để thêm vào — và dạng tuyệt đối của cái <code>Location</code> ấy được dựng từ <code>$host</code>. Nên một cuộc rà bảo mật đi grep chữ <code>$host</code> trong cấu hình sẽ chẳng thấy gì mà lỗ hổng vẫn còn nguyên. Chuyện y hệt xảy ra với cú chuyển hướng tự động của <code>rewrite</code> và với <code>try_files</code> rơi vào một thư mục. Hai chỉ thị vá tận gốc, đặt ở tầng <code>http</code>: <code>absolute_redirect off;</code> làm header thành tương đối, và <code>server_name_in_redirect on;</code> dùng cái tên trong cấu hình thay cho header.',
          ),
        }),

        // q14 · đáp án 0
        mcq({
          prompt: B(
            'A machine serves the public site on 80 and 443, plus an internal admin panel bound to <code>127.0.0.1:8081</code>. The admin block has <code>server_name admin.vd.com;</code> and is the only block on that address. How many refusing default blocks does the machine need, and what does the admin block actually answer?',
            'Một máy phục vụ site công khai trên 80 và 443, cộng một bảng quản trị nội bộ gắn vào <code>127.0.0.1:8081</code>. Khối quản trị có <code>server_name admin.vd.com;</code> và là khối DUY NHẤT trên địa chỉ đó. Máy này cần bao nhiêu khối mặc định từ chối, và khối quản trị thật ra trả lời cái gì?',
          ),
          options: [
            B(
              'Three — one per listen group — and the admin block answers EVERY Host on 8081, because with no other block there its <code>server_name</code> line is decoration',
              'Ba — mỗi nhóm listen một cái — và khối quản trị trả lời MỌI Host trên 8081, vì không có khối nào khác ở đó nên dòng <code>server_name</code> của nó chỉ là trang trí',
            ),
            B(
              'One — a default block covers the whole machine — and the admin block answers only <code>admin.vd.com</code>',
              'Một — một khối mặc định phủ cả máy — và khối quản trị chỉ trả lời <code>admin.vd.com</code>',
            ),
            B(
              'Two — 80 and 443 — because a loopback-bound port cannot have a default server',
              'Hai — cho 80 và 443 — vì một cổng gắn vào loopback thì không thể có máy chủ mặc định',
            ),
            B(
              'None, as long as every real site declares a <code>server_name</code>; unmatched hosts then get 404',
              'Không cần cái nào, miễn là mọi site thật đều khai <code>server_name</code>; host không khớp khi đó nhận 404',
            ),
          ],
          correct: 0,
          explanation: EX(
            'A default server exists per listen group — per <code>address:port</code> — not per machine, so three groups need three. And the second half is the part people miss: when a port has exactly one block, that block IS the default for it, so it answers every Host that arrives, including forged ones. The <code>server_name</code> line never gets to reject anything. Here it is survivable only because the socket is bound to <code>127.0.0.1</code>, which is a real security control: nothing off-box can connect at all. Every new port you open starts a fresh group that needs its own refusing default — and 444 is the right code there, since it closes the connection without sending a byte for a scanner to fingerprint.',
            'Máy chủ mặc định tồn tại theo NHÓM LISTEN — theo cặp <code>địa chỉ:cổng</code> — chứ không theo máy, nên ba nhóm cần ba cái. Còn nửa sau mới là chỗ người ta hay bỏ sót: khi một cổng chỉ có đúng một khối thì khối đó CHÍNH LÀ mặc định của cổng ấy, nên nó trả lời mọi Host tới, kể cả Host giả mạo. Dòng <code>server_name</code> không bao giờ có cơ hội từ chối gì. Ở đây còn sống được là nhờ socket gắn vào <code>127.0.0.1</code> — và đó là một chốt bảo mật thật: không thứ gì ngoài máy kết nối tới được. Mỗi cổng mới bạn mở ra là một nhóm mới cần khối mặc định từ chối của riêng nó — và 444 là mã đúng ở đó, vì nó đóng kết nối mà không gửi lấy một byte cho kẻ dò nhận dạng.',
          ),
        }),

        /* ── Chương 2 — location nào thắng (8 câu) ─────────────────────── */

        // q15 · đáp án 1
        mcq({
          prompt: B(
            'Seven overlapping blocks on port 8081, and thirteen URIs run through them on nginx/1.27.5. Explain the last two rows.' + code(
              'location = /k              { return 200 "1 EXACT"; }\n' +
              'location ^~ /k/ao          { return 200 "2 CARET"; }\n' +
              'location ~ \\.txt           { return 200 "3 REGEX"; }\n' +
              'location ~* \\.(png|gif)$   { return 200 "4 REGEXI"; }\n' +
              'location /k/ao/sau         { return 200 "5 PREFIX-SAU"; }\n' +
              'location /k                { return 200 "6 PREFIX-K"; }\n' +
              'location /                 { return 200 "7 PREFIX-GOC"; }\n' +
              '\n' +
              '/k              -> 1 EXACT           /k/ao/anh.png -> 2 CARET\n' +
              '/k/             -> 6 PREFIX-K        /k/ao/sau/y   -> 5 PREFIX-SAU\n' +
              '/k/ao           -> 2 CARET           /k/x.txt      -> 3 REGEX\n' +
              '/k/ao/x         -> 2 CARET           /k/x.TXT      -> 6 PREFIX-K',
            ),
            'Bảy khối chồng lấn trên cổng 8081, và mười ba URI chạy qua chúng trên nginx/1.27.5. Hãy giải thích hai dòng cuối.' + code(
              'location = /k              { return 200 "1 EXACT"; }\n' +
              'location ^~ /k/ao          { return 200 "2 CARET"; }\n' +
              'location ~ \\.txt           { return 200 "3 REGEX"; }\n' +
              'location ~* \\.(png|gif)$   { return 200 "4 REGEXI"; }\n' +
              'location /k/ao/sau         { return 200 "5 PREFIX-SAU"; }\n' +
              'location /k                { return 200 "6 PREFIX-K"; }\n' +
              'location /                 { return 200 "7 PREFIX-GOC"; }\n' +
              '\n' +
              '/k              -> 1 EXACT           /k/ao/anh.png -> 2 CARET\n' +
              '/k/             -> 6 PREFIX-K        /k/ao/sau/y   -> 5 PREFIX-SAU\n' +
              '/k/ao           -> 2 CARET           /k/x.txt      -> 3 REGEX\n' +
              '/k/ao/x         -> 2 CARET           /k/x.TXT      -> 6 PREFIX-K',
            ),
          ),
          options: [
            B(
              'The regex block only handles lowercase paths because <code>location</code> matching lowercases the URI first',
              'Khối regex chỉ xử lý đường dẫn chữ thường vì phép khớp <code>location</code> hạ chữ URI trước',
            ),
            B(
              'The longest matching prefix for both is the plain <code>/k</code>, so the regexes run; <code>~ \\.txt</code> is case-SENSITIVE, so <code>.TXT</code> misses and the remembered prefix is used instead',
              'Tiền tố khớp dài nhất của cả hai đều là <code>/k</code> loại thường, nên đám regex được chạy; <code>~ \\.txt</code> PHÂN BIỆT hoa thường nên <code>.TXT</code> trượt và tiền tố đã nhớ được dùng thay',
            ),
            B(
              '<code>/k/x.TXT</code> fell to <code>/k</code> because the file does not exist on disk, and Nginx retries with the next block',
              '<code>/k/x.TXT</code> rơi về <code>/k</code> vì tệp đó không có trên đĩa, và Nginx thử lại với khối kế tiếp',
            ),
            B(
              'Regex blocks are tried before prefix blocks, so <code>.txt</code> won and <code>.TXT</code> reached the catch-all <code>location /</code>',
              'Khối regex được thử trước khối tiền tố, nên <code>.txt</code> thắng còn <code>.TXT</code> rơi vào khối bắt-tất <code>location /</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Five steps, run in this order. (1) An exact <code>=</code> match ends everything — which is why <code>/k</code> stops at block 1 and <code>/k/</code>, one character longer, does not. (2) Remember the LONGEST matching prefix among the plain and <code>^~</code> blocks; length decides, file position never does. (3) If that longest prefix carried <code>^~</code>, commit to it and skip the regexes entirely. (4) Otherwise try the regexes in FILE order and the first hit wins outright. (5) No regex matched, so the remembered prefix handles it. <code>.TXT</code> is step 5: the pattern is case-sensitive, so use <code>~*</code> for extensions unless you mean otherwise — a case-sensitive handler is a bypass waiting for a case-insensitive filesystem.',
            'Năm bước, chạy theo đúng thứ tự này. (1) Một khớp chính xác <code>=</code> là kết thúc mọi thứ — nên <code>/k</code> dừng ở khối 1 còn <code>/k/</code>, dài hơn đúng một ký tự, thì không. (2) NHỚ lấy tiền tố khớp DÀI NHẤT trong đám khối thường và khối <code>^~</code>; độ dài quyết định, vị trí trong tệp thì không bao giờ. (3) Nếu tiền tố dài nhất ấy mang <code>^~</code> thì chốt luôn và BỎ QUA hẳn đám regex. (4) Nếu không thì thử các regex theo thứ tự TỆP và cái khớp đầu tiên thắng dứt điểm. (5) Không regex nào khớp thì tiền tố đã nhớ đứng ra xử lý. Dòng <code>.TXT</code> chính là bước 5: mẫu đó phân biệt hoa thường, nên hãy dùng <code>~*</code> cho phần mở rộng trừ khi bạn cố ý — một handler phân biệt hoa thường là một lối lách đang chờ một hệ tệp không phân biệt hoa thường.',
          ),
        }),

        // q16 · đáp án 2
        mcq({
          prompt: B(
            'Same seven blocks, three more URIs measured. What single rule explains all three?' + code(
              '/kx        -> 6 PREFIX-K\n' +
              '/kao       -> 6 PREFIX-K\n' +
              '/k/ao.txt  -> 2 CARET      <- KHONG phai khoi regex .txt',
            ),
            'Vẫn bảy khối đó, thêm ba URI được đo. Một luật DUY NHẤT nào giải thích được cả ba?' + code(
              '/kx        -> 6 PREFIX-K\n' +
              '/kao       -> 6 PREFIX-K\n' +
              '/k/ao.txt  -> 2 CARET      <- KHONG phai khoi regex .txt',
            ),
          ),
          options: [
            B(
              'Nginx treats a missing file extension as a directory request and routes it to the nearest prefix block',
              'Nginx coi việc thiếu phần mở rộng là một request thư mục và định tuyến nó tới khối tiền tố gần nhất',
            ),
            B(
              'Prefix blocks are only consulted after every regex has failed, so these three had no regex to catch them',
              'Khối tiền tố chỉ được xét sau khi mọi regex đã trượt, nên ba cái này không có regex nào bắt lấy',
            ),
            B(
              'A prefix location means "the URI STARTS WITH these characters" — it does not stop at a path separator, so <code>/k</code> catches <code>/kx</code> and <code>^~ /k/ao</code> catches <code>/k/ao.txt</code>',
              'Một location tiền tố nghĩa là "URI BẮT ĐẦU BẰNG những ký tự này" — nó KHÔNG dừng ở dấu phân cách đường dẫn, nên <code>/k</code> bắt luôn <code>/kx</code> và <code>^~ /k/ao</code> bắt luôn <code>/k/ao.txt</code>',
            ),
            B(
              'The three URIs are all shorter than the regex patterns, and Nginx prefers the shortest matching block',
              'Cả ba URI đều ngắn hơn các mẫu regex, và Nginx ưu tiên khối khớp NGẮN nhất',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the most common surprise in the whole chapter, and it is one character wide. <code>location /api</code> also catches <code>/apiary</code>, <code>/api-docs</code> and <code>/apifoo</code>; <code>location /admin</code> quietly starts catching <code>/administrators-public-list</code>. The third row stacks the same rule on top of <code>^~</code>: <code>/k/ao</code> is a prefix of <code>/k/ao.txt</code>, so the caret block was the longest match and the regexes never ran. Write the trailing slash when you mean a directory — <code>location /api/</code> — and add <code>location = /api</code> beside it if the bare path must work too.',
            'Đây là chỗ bất ngờ phổ biến nhất trong cả chương, và nó rộng đúng một ký tự. <code>location /api</code> bắt luôn <code>/apiary</code>, <code>/api-docs</code> và <code>/apifoo</code>; <code>location /admin</code> âm thầm bắt luôn <code>/administrators-public-list</code>. Dòng thứ ba chồng đúng luật đó lên trên <code>^~</code>: <code>/k/ao</code> là tiền tố của <code>/k/ao.txt</code> nên khối caret là cái khớp dài nhất và đám regex không hề được chạy. Hãy viết dấu gạch chéo cuối khi bạn muốn nói tới một thư mục — <code>location /api/</code> — và thêm <code>location = /api</code> bên cạnh nếu đường dẫn trần cũng phải chạy được.',
          ),
        }),

        // q17 · đáp án 3
        mcq({
          prompt: B(
            'You have <code>location ^~ /tinh/</code> to keep a subtree away from a PHP regex. A colleague adds a plain <code>location /tinh/anh/</code> for one sub-path. What happens to <code>/tinh/anh/x.php</code>, and what is the general rule?',
            'Bạn có <code>location ^~ /tinh/</code> để giữ một cây con tránh xa cái regex PHP. Đồng nghiệp thêm một khối thường <code>location /tinh/anh/</code> cho một nhánh con. Chuyện gì xảy ra với <code>/tinh/anh/x.php</code>, và luật chung là gì?',
          ),
          options: [
            B(
              'Nothing changes: <code>^~</code> on a parent protects the entire subtree beneath it',
              'Không có gì đổi: <code>^~</code> ở khối cha bảo vệ toàn bộ cây con bên dưới',
            ),
            B(
              'Nginx refuses to start, because a plain prefix may not be nested inside a <code>^~</code> one',
              'Nginx từ chối khởi động, vì một tiền tố thường không được lồng bên trong một tiền tố <code>^~</code>',
            ),
            B(
              'The request now gets 404, because two prefix blocks match and Nginx cannot choose between them',
              'Request giờ nhận 404, vì hai khối tiền tố cùng khớp và Nginx không chọn được giữa chúng',
            ),
            B(
              'The longest matching prefix is now the plain block, so step 3 no longer fires and the PHP regex runs and wins — <code>^~</code> only protects while it IS the longest match',
              'Tiền tố khớp dài nhất giờ là khối thường, nên bước 3 không còn kích hoạt và cái regex PHP chạy rồi thắng — <code>^~</code> chỉ bảo vệ chừng nào nó CÒN LÀ cái khớp dài nhất',
            ),
          ],
          correct: 3,
          explanation: EX(
            '<code>^~</code> is not "a stronger prefix". It does not help a block beat a longer prefix — step 2 still picks purely by length — it only decides whether step 4 happens at all. So adding one ordinary block for a sub-path silently re-opens regex handling for that entire subtree, and nothing in the configuration says so. Two ways to keep it true over time: put <code>^~</code> on every prefix block inside the protected subtree, or simply never add plain prefix blocks under a <code>^~</code> one. The second is easier to hold to during a hurried change.',
            '<code>^~</code> KHÔNG phải "một tiền tố mạnh hơn". Nó không giúp một khối thắng được một tiền tố dài hơn — bước 2 vẫn chọn thuần theo độ dài — nó chỉ quyết định bước 4 có xảy ra hay không. Nên thêm một khối thường cho một nhánh con là âm thầm mở lại việc xử lý regex cho cả cây con ấy, mà chẳng có dòng nào trong cấu hình nói ra. Hai cách giữ cho điều đó đúng lâu dài: đặt <code>^~</code> lên MỌI khối tiền tố nằm trong cây con được bảo vệ, hoặc đơn giản là không bao giờ thêm khối tiền tố thường dưới một khối <code>^~</code>. Cách thứ hai dễ giữ hơn trong một lần sửa vội.',
          ),
        }),

        // q18 · đáp án 0
        mcq({
          prompt: B(
            'You move blocks around in a config file. Which statement matches how Nginx actually behaves?',
            'Bạn di chuyển các khối trong một tệp cấu hình. Phát biểu nào khớp với cách Nginx THẬT SỰ hành xử?',
          ),
          options: [
            B(
              'Moving a PREFIX block changes nothing — prefixes compete on length; moving a REGEX block can change everything, because the first matching regex in file order wins',
              'Di chuyển một khối TIỀN TỐ thì chẳng đổi gì — tiền tố đua nhau bằng ĐỘ DÀI; di chuyển một khối REGEX thì có thể đổi tất cả, vì regex khớp đầu tiên theo thứ tự tệp sẽ thắng',
            ),
            B(
              'Both kinds are order-sensitive: within each kind, the block written first is tried first',
              'Cả hai loại đều nhạy với thứ tự: trong từng loại, khối viết trước được thử trước',
            ),
            B(
              'Neither kind is order-sensitive; Nginx sorts every block by pattern length before matching',
              'Không loại nào nhạy với thứ tự; Nginx sắp mọi khối theo độ dài mẫu trước khi khớp',
            ),
            B(
              'Moving a prefix block matters and moving a regex block does not, because regexes are compiled into one combined pattern',
              'Di chuyển khối tiền tố thì có ảnh hưởng còn khối regex thì không, vì các regex được biên dịch gộp thành một mẫu chung',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two different tiebreakers live in one algorithm, and mixing them up is the usual cause of "I moved the block and nothing changed". Prefixes: longest wins, position irrelevant. Regexes: first wins, length irrelevant — so a broad pattern written above a narrow one permanently shadows the narrow one, however precise it looks. Put narrow regex patterns above broad ones, and remember that a regex block cannot become "more specific" by being written later.',
            'Hai cách phá thế hoà khác nhau cùng nằm trong MỘT thuật toán, và lẫn lộn chúng chính là nguyên nhân thường gặp của câu "tôi kéo khối đó đi mà chẳng thấy gì đổi". Tiền tố: DÀI NHẤT thắng, vị trí không liên quan. Regex: ĐẦU TIÊN thắng, độ dài không liên quan — nên một mẫu rộng viết phía trên một mẫu hẹp sẽ che vĩnh viễn cái hẹp, dù cái hẹp trông chính xác tới đâu. Hãy đặt mẫu regex hẹp lên trên mẫu rộng, và nhớ rằng một khối regex không "cụ thể hơn" lên được nhờ viết muộn hơn.',
          ),
        }),

        // q19 · đáp án 2
        mcq({
          prompt: B(
            'Eight spellings of one path, run with <code>curl --path-as-is</code> against three blocks on nginx/1.27.5.' + code(
              'location /rieng  { return 200 "RIENG uri=[$uri]"; }\n' +
              'location /       { return 200 "CHUNG uri=[$uri]"; }\n' +
              '\n' +
              '/rieng                -> RIENG  uri=[/rieng]\n' +
              '/%72ieng              -> RIENG  uri=[/rieng]\n' +
              '//rieng               -> RIENG  uri=[/rieng]\n' +
              '/./rieng              -> RIENG  uri=[/rieng]\n' +
              '/chung/../rieng       -> RIENG  uri=[/rieng]\n' +
              '/rieng/../chung       -> CHUNG  uri=[/chung]\n' +
              '/RIENG                -> CHUNG  uri=[/RIENG]',
            ) + 'What do the last three rows prove?',
            'Tám cách viết của cùng một đường dẫn, chạy bằng <code>curl --path-as-is</code> vào ba khối trên nginx/1.27.5.' + code(
              'location /rieng  { return 200 "RIENG uri=[$uri]"; }\n' +
              'location /       { return 200 "CHUNG uri=[$uri]"; }\n' +
              '\n' +
              '/rieng                -> RIENG  uri=[/rieng]\n' +
              '/%72ieng              -> RIENG  uri=[/rieng]\n' +
              '//rieng               -> RIENG  uri=[/rieng]\n' +
              '/./rieng              -> RIENG  uri=[/rieng]\n' +
              '/chung/../rieng       -> RIENG  uri=[/rieng]\n' +
              '/rieng/../chung       -> CHUNG  uri=[/chung]\n' +
              '/RIENG                -> CHUNG  uri=[/RIENG]',
            ),
          ),
          options: [
            B(
              'Nginx rejects traversal outright, so <code>../</code> can never appear in a matched URI',
              'Nginx chặn thẳng thừng mọi phép đi ngược, nên <code>../</code> không bao giờ xuất hiện trong một URI đã khớp',
            ),
            B(
              'Percent-encoding is left alone so that applications behind the proxy can decode it themselves',
              'Phần trăm-mã hoá được giữ nguyên để các ứng dụng phía sau proxy tự giải mã lấy',
            ),
            B(
              'Normalisation resolves encoding, doubled slashes and <code>../</code> BEFORE matching but never folds case — so a location name is a router, not a jail, and <code>/RIENG</code> escapes its handler',
              'Phép chuẩn hoá giải quyết mã hoá, gạch chéo lặp và <code>../</code> TRƯỚC khi khớp nhưng không bao giờ đụng tới hoa thường — nên một cái tên location là một BỘ ĐỊNH TUYẾN chứ không phải một cái ngục, và <code>/RIENG</code> thoát khỏi handler của nó',
            ),
            B(
              'The last three rows show three separate bugs in the normaliser, each fixed by a different directive',
              'Ba dòng cuối cho thấy ba lỗi riêng biệt của bộ chuẩn hoá, mỗi lỗi vá bằng một chỉ thị khác nhau',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The reassuring half is rows one to five: you cannot smuggle a request past a <code>location</code> by re-spelling the path, because decoding, slash collapsing and <code>../</code> resolution all happen before a block is chosen. The uncomfortable half is row six: because the traversal is resolved first, a block written to serve only <code>/rieng</code> is never even asked about <code>/rieng/../chung</code> — confinement is the job of <code>root</code>/<code>alias</code> plus filesystem permissions, never of the location name. And row seven is the one that bites: prefix matching is case-SENSITIVE and normalisation does not fold case, so only <code>~*</code> ignores it. (A literal <code>%00</code> is refused with 400 before any block is chosen at all.)',
            'Nửa đáng yên tâm là các dòng một tới năm: bạn KHÔNG lách được một request qua mặt một <code>location</code> bằng cách viết lại đường dẫn, vì giải mã, gộp gạch chéo và rút gọn <code>../</code> đều xảy ra TRƯỚC khi chọn khối. Nửa khó chịu là dòng sáu: vì phép đi ngược được rút gọn trước, một khối viết ra để chỉ phục vụ <code>/rieng</code> thậm chí không hề được hỏi tới với <code>/rieng/../chung</code> — việc GIAM GIỮ là việc của <code>root</code>/<code>alias</code> cộng quyền hệ tệp, không bao giờ là việc của cái tên location. Còn dòng bảy mới là chỗ cắn: khớp tiền tố PHÂN BIỆT hoa thường và phép chuẩn hoá không đụng tới hoa thường, chỉ <code>~*</code> mới bỏ qua. (Một byte <code>%00</code> thật thì bị đá 400 trước cả khi chọn khối.)',
          ),
        }),

        // q20 · đáp án 1
        mcq({
          prompt: B(
            'Four blocks, one file each, measured on nginx/1.27.5. Which line is the broken one, and why?' + code(
              'location /r1/ { root  /www;      }   /r1/anh/a.txt -> file=[/www/r1/anh/a.txt]\n' +
              'location /a1/ { alias /www/kho/; }   /a1/ok.txt    -> file=[/www/kho/ok.txt]\n' +
              'location /a2  { alias /www/kho/; }   /a2/ok.txt    -> file=[/www/kho//ok.txt]\n' +
              'location /a3/ { alias /www/kho;  }   /a3/ok.txt    -> file=[/www/khook.txt]',
            ),
            'Bốn khối, mỗi khối một dòng đo, trên nginx/1.27.5. Dòng nào là dòng HỎNG, và vì sao?' + code(
              'location /r1/ { root  /www;      }   /r1/anh/a.txt -> file=[/www/r1/anh/a.txt]\n' +
              'location /a1/ { alias /www/kho/; }   /a1/ok.txt    -> file=[/www/kho/ok.txt]\n' +
              'location /a2  { alias /www/kho/; }   /a2/ok.txt    -> file=[/www/kho//ok.txt]\n' +
              'location /a3/ { alias /www/kho;  }   /a3/ok.txt    -> file=[/www/khook.txt]',
            ),
          ),
          options: [
            B(
              '<code>/r1/</code>, because <code>root</code> should have produced <code>/www/anh/a.txt</code> and left the location name out',
              '<code>/r1/</code>, vì <code>root</code> lẽ ra phải cho ra <code>/www/anh/a.txt</code> và bỏ tên location đi',
            ),
            B(
              '<code>/a3/</code> — <code>alias</code> is a literal cut-and-paste, so the missing trailing slash glued two path fragments into a directory name that does not exist; the doubled slash on <code>/a2</code> is untidy but the filesystem still opens it',
              '<code>/a3/</code> — <code>alias</code> là một phép cắt-dán nguyên văn, nên dấu gạch chéo cuối bị thiếu đã dán liền hai mẩu đường dẫn thành một tên thư mục không tồn tại; còn gạch chéo đôi ở <code>/a2</code> chỉ xấu chứ hệ tệp vẫn mở được',
            ),
            B(
              '<code>/a2</code>, because a doubled slash always produces 404 and a glued path is resolved by the kernel',
              '<code>/a2</code>, vì gạch chéo đôi thì luôn cho ra 404 còn đường dẫn dán liền thì được nhân xử lý giúp',
            ),
            B(
              'None of them — all four paths exist, and the differences are only in how <code>$request_filename</code> is printed',
              'Không dòng nào cả — cả bốn đường dẫn đều tồn tại, khác nhau chỉ ở cách in <code>$request_filename</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            '<code>root</code> APPENDS the whole URI to the path, so the location name stays part of the path on disk and there is nothing to line up. <code>alias</code> SUBSTITUTES: it removes the part the location matched and prepends the alias, which is a literal string operation and therefore sensitive to a single character. The rule that never bites: when a location is paired with an <code>alias</code>, either both end in <code>/</code> or neither does. And the mixed spelling is not only untidy — <code>location /tep</code> with <code>alias /srv/public/</code> also matches <code>/tep../secret</code>, which <code>alias</code> turns into <code>/srv/public/../secret</code>, reading a file above the published directory. When you can use <code>root</code>, use <code>root</code>.',
            '<code>root</code> NỐI THÊM toàn bộ URI vào đường dẫn, nên tên location vẫn là một phần của đường dẫn trên đĩa và chẳng có gì phải khớp cho nhau. <code>alias</code> thì THAY THẾ: nó cắt bỏ phần mà location đã khớp rồi ghép tiền tố alias vào — đó là một thao tác chuỗi nguyên văn, nên nhạy với đúng một ký tự. Luật không bao giờ cắn: khi một location đi kèm <code>alias</code> thì hoặc CẢ HAI cùng kết thúc bằng <code>/</code>, hoặc CẢ HAI cùng không. Và cách viết lệch không chỉ xấu — <code>location /tep</code> với <code>alias /srv/public/</code> còn khớp luôn <code>/tep../bi-mat</code>, thứ mà <code>alias</code> biến thành <code>/srv/public/../bi-mat</code>, đọc được một tệp NGOÀI thư mục công khai. Khi nào dùng được <code>root</code> thì hãy dùng <code>root</code>.',
          ),
        }),

        // q21 · đáp án 2
        mcq({
          prompt: B(
            'Measured on nginx/1.27.5 with a real file missing from disk.' + code(
              'location /spa/        { try_files $uri /trang-chu; }\n' +
              'location = /trang-chu { return 200 "TRANG CHU uri=[$uri] req=[$request_uri]"; }\n' +
              '\n' +
              '$ curl --path-as-is http://127.0.0.1:8084/spa/khong-co\n' +
              'TRANG CHU uri=[/trang-chu] req=[/spa/khong-co]',
            ) + 'What did the browser see, and what changed inside Nginx?',
            'Đo trên nginx/1.27.5 với một tệp thật sự không có trên đĩa.' + code(
              'location /spa/        { try_files $uri /trang-chu; }\n' +
              'location = /trang-chu { return 200 "TRANG CHU uri=[$uri] req=[$request_uri]"; }\n' +
              '\n' +
              '$ curl --path-as-is http://127.0.0.1:8084/spa/khong-co\n' +
              'TRANG CHU uri=[/trang-chu] req=[/spa/khong-co]',
            ),
          ),
          options: [
            B(
              'A 302 to <code>/trang-chu</code>, which the browser followed; the second request is what produced this body',
              'Một cú 302 tới <code>/trang-chu</code> mà trình duyệt đi theo; chính request thứ hai đã sinh ra thân này',
            ),
            B(
              'Nothing changed inside Nginx: <code>try_files</code> only opened a different file, and <code>$uri</code> reflects the file name',
              'Bên trong Nginx chẳng có gì đổi: <code>try_files</code> chỉ mở một tệp khác, và <code>$uri</code> phản ánh tên tệp đó',
            ),
            B(
              'One request and no 3xx: the last argument triggered an INTERNAL redirect that reset <code>$uri</code> and re-ran location matching, so a different block answered — while <code>$request_uri</code> kept what the client sent',
              'Một request duy nhất và không có 3xx: tham số cuối đã kích một cú chuyển hướng NỘI BỘ, đặt lại <code>$uri</code> rồi chạy lại phép khớp location, nên một khối KHÁC trả lời — còn <code>$request_uri</code> giữ nguyên cái client gửi lên',
            ),
            B(
              'Nginx served <code>/trang-chu</code> from cache; without a cache the request would have been a 404',
              'Nginx phục vụ <code>/trang-chu</code> từ bộ đệm; không có bộ đệm thì request đó đã là 404',
            ),
          ],
          correct: 2,
          explanation: EX(
            '<code>try_files</code> walks its arguments left to right and tests each as a filesystem path; the LAST one is not tested, it is used. If it looks like <code>=404</code> the request ends there; if it looks like a URI, Nginx performs an internal redirect — no <code>Location</code> header, no second round trip, nothing in the browser network tab. The whole five-step algorithm runs again against the new <code>$uri</code>, so a different block wins, with a different <code>root</code>, different headers and a different handler. <code>index</code> and <code>error_page</code> do the same thing. Log both <code>"$request_uri" -&gt; "$uri"</code> or an internal redirect is invisible and you will argue with someone about what was requested.',
            '<code>try_files</code> duyệt các tham số từ trái sang phải và thử từng cái như một đường dẫn hệ tệp; tham số CUỐI thì không được thử, nó được DÙNG. Nếu nó trông như <code>=404</code> thì request kết thúc ngay tại đó; nếu nó trông như một URI thì Nginx thực hiện một cú chuyển hướng NỘI BỘ — không header <code>Location</code>, không có vòng đi lại thứ hai, không có gì trong tab Network của trình duyệt. Toàn bộ thuật toán năm bước chạy lại với <code>$uri</code> mới, nên một khối khác thắng, với <code>root</code> khác, header khác và handler khác. <code>index</code> và <code>error_page</code> cũng làm y hệt. Hãy log cả <code>"$request_uri" -&gt; "$uri"</code>, nếu không thì một cú chuyển hướng nội bộ là vô hình và bạn sẽ cãi nhau với ai đó về chuyện thật ra cái gì đã được yêu cầu.',
          ),
        }),

        // q22 · đáp án 0
        mcq({
          prompt: B(
            'A directory holds <code>index.html</code>. Measured on nginx/1.27.5 with a deliberately placed exact block:' + code(
              'location = /thu-muc/index.html { return 200 "KHOI = index.html uri=[$uri] req=[$request_uri]"; }\n' +
              '\n' +
              '$ curl http://127.0.0.1:8091/thu-muc/\n' +
              'KHOI = index.html uri=[/thu-muc/index.html] req=[/thu-muc/]',
            ) + 'What does this prove about <code>index</code>?',
            'Một thư mục có <code>index.html</code>. Đo trên nginx/1.27.5 với một khối chính xác đặt vào có chủ đích:' + code(
              'location = /thu-muc/index.html { return 200 "KHOI = index.html uri=[$uri] req=[$request_uri]"; }\n' +
              '\n' +
              '$ curl http://127.0.0.1:8091/thu-muc/\n' +
              'KHOI = index.html uri=[/thu-muc/index.html] req=[/thu-muc/]',
            ),
          ),
          options: [
            B(
              'It does not merely open a file: it rewrites <code>$uri</code> to the index path and re-runs location matching, so blocks elsewhere in the config can catch directory requests',
              'Nó không chỉ mở một tệp: nó VIẾT LẠI <code>$uri</code> thành đường dẫn của trang index rồi chạy lại phép khớp location, nên các khối ở chỗ khác trong cấu hình có thể bắt luôn request thư mục',
            ),
            B(
              'The exact block was chosen first, and <code>index</code> then simply confirmed the file exists',
              'Khối chính xác được chọn trước, rồi <code>index</code> chỉ xác nhận là tệp có tồn tại',
            ),
            B(
              '<code>index</code> issued a 301 to the index file and curl followed it silently',
              '<code>index</code> phát ra một cú 301 tới tệp index và curl lẳng lặng đi theo',
            ),
            B(
              '<code>$uri</code> always shows the file on disk rather than the request path, in every block',
              '<code>$uri</code> thì luôn hiện tệp trên đĩa chứ không hiện đường dẫn request, ở mọi khối',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Three ordinary directives can rewrite <code>$uri</code> mid-request and send matching back to step one: <code>try_files</code>, <code>index</code> and <code>error_page</code>. Here a dedicated <code>= /thu-muc/index.html</code> block fired, which it could only do if matching had run again — so a <code>location ~ \\.html$</code> written elsewhere in your config will also catch every directory request, which surprises people who never asked for that. A related detail on the third of the trio: <code>error_page</code> re-matches too but PRESERVES the status that triggered it, so a handler ending in <code>return 200</code> still answers 404 unless you write <code>error_page 404 =200 /trang-loi;</code> — and that equals sign is the difference between an honest 404 and a soft-404 that search engines index.',
            'Ba chỉ thị bình thường có thể viết lại <code>$uri</code> giữa chừng và đẩy phép khớp về lại bước một: <code>try_files</code>, <code>index</code> và <code>error_page</code>. Ở đây một khối <code>= /thu-muc/index.html</code> chuyên biệt đã chạy, mà nó chỉ chạy được nếu phép khớp đã chạy LẠI — nên một <code>location ~ \\.html$</code> viết ở chỗ khác trong cấu hình của bạn cũng sẽ bắt luôn mọi request thư mục, điều làm bất ngờ những người chưa từng yêu cầu như vậy. Một chi tiết liên quan ở cái thứ ba trong bộ ba: <code>error_page</code> cũng khớp lại nhưng GIỮ NGUYÊN mã trạng thái đã kích hoạt nó, nên một handler kết thúc bằng <code>return 200</code> vẫn trả về 404 trừ khi bạn viết <code>error_page 404 =200 /trang-loi;</code> — và cái dấu bằng đó là khác biệt giữa một cú 404 trung thực và một cú 404-mềm bị máy tìm kiếm đánh chỉ mục.',
          ),
        }),

        /* ── Chương 3 — reverse proxy (8 câu) ──────────────────────────── */

        // q23 · đáp án 3
        mcq({
          prompt: B(
            'Three <code>proxy_pass</code> spellings against an upstream that prints the path it received, measured on nginx/1.27.5.' + code(
              'location /p3/ { proxy_pass http://up:9101/;     }  /p3/nguoi/1 -> /nguoi/1\n' +
              'location /p4  { proxy_pass http://up:9101/;     }  /p4/nguoi/1 -> //nguoi/1\n' +
              'location /p6/ { proxy_pass http://up:9101/moi;  }  /p6/nguoi/1 -> /moinguoi/1',
            ) + 'What single rule produces all three?',
            'Ba cách viết <code>proxy_pass</code> vào một upstream in lại đường dẫn nó nhận được, đo trên nginx/1.27.5.' + code(
              'location /p3/ { proxy_pass http://up:9101/;     }  /p3/nguoi/1 -> /nguoi/1\n' +
              'location /p4  { proxy_pass http://up:9101/;     }  /p4/nguoi/1 -> //nguoi/1\n' +
              'location /p6/ { proxy_pass http://up:9101/moi;  }  /p6/nguoi/1 -> /moinguoi/1',
            ),
          ),
          options: [
            B(
              'Nginx normalises the upstream path the same way it normalises <code>$uri</code>, so the doubled slash in row two is cosmetic',
              'Nginx chuẩn hoá đường dẫn gửi lên upstream y như cách nó chuẩn hoá <code>$uri</code>, nên gạch chéo đôi ở dòng hai chỉ là hình thức',
            ),
            B(
              'The upstream is at fault: it should collapse repeated slashes and Nginx sent the same path in all three rows',
              'Lỗi ở upstream: nó phải gộp các gạch chéo lặp, còn Nginx thì gửi đi cùng một đường dẫn ở cả ba dòng',
            ),
            B(
              'Rows two and three are configuration errors that <code>nginx -t</code> rejects; only row one is valid',
              'Dòng hai và ba là lỗi cấu hình mà <code>nginx -t</code> từ chối; chỉ dòng một là hợp lệ',
            ),
            B(
              'With a path in the URL, the MATCHED PREFIX is cut off and the <code>proxy_pass</code> path is pasted in its place — a literal splice, so both sides must agree on the trailing slash',
              'Khi URL có phần đường dẫn, TIỀN TỐ ĐÃ KHỚP bị cắt đi và đường dẫn của <code>proxy_pass</code> được dán vào chỗ đó — một phép nối nguyên văn, nên hai phía phải thống nhất về dấu gạch chéo cuối',
            ),
          ],
          correct: 3,
          explanation: EX(
            'It is the same cut-and-paste as <code>alias</code>: <code>proxy_pass</code> without a path behaves like <code>root</code> and forwards <code>$uri</code> unchanged, while <code>proxy_pass</code> with ANY path — even a bare <code>/</code> — substitutes it for the matched prefix. Row two removed <code>/p4</code> from <code>/p4/nguoi/1</code>, leaving <code>/nguoi/1</code>, and pasted <code>/</code> in front of it. Row three removed <code>/p6/</code>, leaving <code>nguoi/1</code>, and pasted <code>/moi</code> in front with nothing between. Many frameworks treat <code>//nguoi/1</code> as a different route and some reject it, and <code>/moinguoi/1</code> matches nothing at all — so the 404 comes from your own application, which is a confusing place for the blame to land. Write both with a trailing slash, or write neither.',
            'Vẫn đúng phép cắt-dán như <code>alias</code>: <code>proxy_pass</code> KHÔNG có đường dẫn thì hành xử như <code>root</code> và chuyển tiếp <code>$uri</code> nguyên vẹn, còn <code>proxy_pass</code> có BẤT KỲ đường dẫn nào — kể cả một dấu <code>/</code> trơ trọi — thì thay nó vào chỗ tiền tố đã khớp. Dòng hai cắt <code>/p4</code> khỏi <code>/p4/nguoi/1</code>, còn lại <code>/nguoi/1</code>, rồi dán <code>/</code> lên đầu. Dòng ba cắt <code>/p6/</code>, còn lại <code>nguoi/1</code>, rồi dán <code>/moi</code> lên đầu mà không có gì ở giữa. Nhiều framework coi <code>//nguoi/1</code> là một tuyến KHÁC và có cái từ chối luôn, còn <code>/moinguoi/1</code> thì chẳng khớp tuyến nào — nên cú 404 tới từ chính ứng dụng của bạn, một chỗ rất dễ đổ oan. Hãy viết cả hai có gạch chéo cuối, hoặc cả hai đều không.',
          ),
        }),

        // q24 · đáp án 1
        mcq({
          prompt: B(
            'An application reads <code>req.headers.host</code> to build absolute links. Behind this block, measured on nginx/1.27.5, what does it receive?' + code(
              'location /b/ { proxy_pass http://ngpt-echo:9101/; }\n' +
              '\n' +
              "$ curl -H 'Host: vd.com' http://edge/b/x\n" +
              '{"url":"/x","httpVersion":"1.0","headers":{\n' +
              '  "host":"ngpt-echo:9101","connection":"close",\n' +
              '  "user-agent":"curl/8.12.1","accept":"*/*"}}',
            ),
            'Một ứng dụng đọc <code>req.headers.host</code> để dựng liên kết tuyệt đối. Sau khối này, đo trên nginx/1.27.5, nó nhận được gì?' + code(
              'location /b/ { proxy_pass http://ngpt-echo:9101/; }\n' +
              '\n' +
              "$ curl -H 'Host: vd.com' http://edge/b/x\n" +
              '{"url":"/x","httpVersion":"1.0","headers":{\n' +
              '  "host":"ngpt-echo:9101","connection":"close",\n' +
              '  "user-agent":"curl/8.12.1","accept":"*/*"}}',
            ),
          ),
          options: [
            B(
              '<code>vd.com</code>, because a proxy forwards the Host header by definition',
              '<code>vd.com</code>, vì theo định nghĩa thì proxy chuyển tiếp header Host',
            ),
            B(
              'The upstream\'s own address — Nginx REPLACES Host with the proxy_pass target unless you add <code>proxy_set_header Host $host;</code>',
              'Chính địa chỉ của upstream — Nginx THAY Host bằng đích của proxy_pass trừ khi bạn thêm <code>proxy_set_header Host $host;</code>',
            ),
            B(
              'An empty string, because Nginx strips Host and lets the application choose its own',
              'Một chuỗi rỗng, vì Nginx gỡ Host đi và để ứng dụng tự chọn lấy',
            ),
            B(
              'The value of <code>X-Forwarded-Host</code>, which Nginx sets automatically on every proxied request',
              'Giá trị của <code>X-Forwarded-Host</code>, thứ Nginx tự đặt trên mọi request đi qua proxy',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A proxy does not forward your request — it makes a NEW one, and the defaults that decide what goes into it predate most of what you will put behind Nginx. Three of them are visible in this transcript: Host becomes the upstream address, the version is HTTP/1.0, and <code>Connection: close</code> rides along. Anything the application builds from Host — absolute links, cookie domains, multi-tenant routing, password-reset URLs — is wrong until you add <code>proxy_set_header Host $host;</code>. And the moment you do, the untrusted string from Lesson 1.4 becomes your application\'s problem too, which is why the refusing default server and the proxy block belong together.',
            'Một proxy KHÔNG chuyển tiếp request của bạn — nó tạo ra một request MỚI, và những giá trị mặc định quyết định cái gì đi vào đó đều có trước phần lớn những thứ bạn sẽ đặt sau Nginx. Ba cái nhìn thấy ngay trong đoạn này: Host thành địa chỉ upstream, phiên bản là HTTP/1.0, và <code>Connection: close</code> đi kèm. Mọi thứ ứng dụng dựng từ Host — liên kết tuyệt đối, miền cookie, định tuyến đa khách hàng, URL đặt lại mật khẩu — đều SAI cho tới khi bạn thêm <code>proxy_set_header Host $host;</code>. Và ngay khi bạn thêm, cái chuỗi không đáng tin ở Bài 1.4 trở thành vấn đề của cả ứng dụng nữa — đó là lý do khối mặc định từ chối và khối proxy thuộc về nhau.',
          ),
        }),

        // q25 · đáp án 2
        mcq({
          prompt: B(
            'Same transcript. The upstream reported <code>httpVersion 1.0</code> and <code>connection: close</code>. What does that cost, and what removes it?',
            'Vẫn đoạn đo đó. Upstream báo <code>httpVersion 1.0</code> và <code>connection: close</code>. Cái đó tốn gì, và cái gì gỡ được nó?',
          ),
          options: [
            B(
              'Nothing measurable: the version on the upstream hop is an implementation detail, and the kernel keeps the socket alive underneath whatever the header happens to say',
              'Chẳng tốn gì đo được: phiên bản ở chặng upstream chỉ là chi tiết cài đặt, và nhân hệ điều hành vẫn giữ socket sống bên dưới bất kể cái header kia nói gì',
            ),
            B(
              'It costs a full TLS handshake to the backend on every single request, and the fix is <code>proxy_ssl_session_reuse on;</code> together with a longer <code>proxy_ssl_session_cache</code>',
              'Nó tốn trọn một cú bắt tay TLS tới backend cho MỖI request, và cách sửa là <code>proxy_ssl_session_reuse on;</code> kèm một <code>proxy_ssl_session_cache</code> dài hơn',
            ),
            B(
              'A fresh TCP connection per proxied request — and it also blocks WebSockets and chunked request bodies; the fix is <code>proxy_http_version 1.1;</code> plus <code>proxy_set_header Connection "";</code> and a <code>keepalive</code> in the upstream block',
              'Một kết nối TCP mới cho MỖI request đi qua proxy — và nó cũng chặn luôn WebSocket lẫn thân request dạng chunked; cách sửa là <code>proxy_http_version 1.1;</code> cộng <code>proxy_set_header Connection "";</code> và một dòng <code>keepalive</code> trong khối upstream',
            ),
            B(
              'It forces every response through a temporary file on disk before the client sees a byte, which is fixed by raising <code>proxy_buffers</code> until whole responses fit in memory',
              'Nó ép mọi phản hồi phải đi qua một tệp tạm trên đĩa trước khi client thấy một byte nào, và sửa bằng cách nâng <code>proxy_buffers</code> cho tới khi cả phản hồi lọt vào bộ nhớ',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The default is <code>proxy_http_version 1.0</code>, and <code>Connection: close</code> is a consequence of it. At any real traffic level a handshake per request is measurable overhead and a genuine source of ephemeral-port exhaustion on a busy edge. All three lines are needed together: the version, the empty <code>Connection</code> header so the connection may be held, and <code>upstream api { server api:4000; keepalive 32; }</code> to give the worker a pool to reuse — <code>keepalive</code> is per worker process, so multiply it by <code>worker_processes</code> before comparing it to your backend\'s connection limit. HTTP/1.0 is also why a WebSocket cannot work until this is fixed: <code>Upgrade</code> does not exist in 1.0.',
            'Mặc định là <code>proxy_http_version 1.0</code>, và <code>Connection: close</code> là hệ quả của nó. Ở bất kỳ mức lưu lượng thật nào, một cú bắt tay cho mỗi request là chi phí đo được và là nguồn cạn cổng tạm thời thật sự trên một máy biên bận rộn. Cả ba dòng phải đi cùng nhau: phiên bản, header <code>Connection</code> rỗng để kết nối được giữ lại, và <code>upstream api { server api:4000; keepalive 32; }</code> để worker có một bể dùng lại — <code>keepalive</code> tính theo TỪNG tiến trình worker, nên hãy nhân với <code>worker_processes</code> trước khi so với giới hạn kết nối của backend. HTTP/1.0 cũng chính là lý do WebSocket không thể chạy cho tới khi sửa chỗ này: <code>Upgrade</code> không tồn tại trong 1.0.',
          ),
        }),

        // q26 · đáp án 0
        mcq({
          prompt: B(
            'Two headers were sent, one with a hyphen and one with an underscore. Measured on nginx/1.27.5, through the proxy:' + code(
              "$ curl -H 'X-Co_Gach: co' -H 'X-Co-Gach: co' http://edge/b/x\n" +
              '"headers":{"host":"ngpt-echo:9101","connection":"close",\n' +
              '           "user-agent":"curl/8.12.1","accept":"*/*",\n' +
              '           "x-co-gach":"co"}\n' +
              '                     ^ chi con MOT. Cai co gach duoi da bien mat.',
            ),
            'Hai header được gửi lên, một cái dùng gạch nối và một cái dùng gạch dưới. Đo trên nginx/1.27.5, đi qua proxy:' + code(
              "$ curl -H 'X-Co_Gach: co' -H 'X-Co-Gach: co' http://edge/b/x\n" +
              '"headers":{"host":"ngpt-echo:9101","connection":"close",\n' +
              '           "user-agent":"curl/8.12.1","accept":"*/*",\n' +
              '           "x-co-gach":"co"}\n' +
              '                     ^ chi con MOT. Cai co gach duoi da bien mat.',
            ),
          ),
          options: [
            B(
              '<code>underscores_in_headers</code> defaults to off, so Nginx drops the header silently — nothing is logged, which is what makes it cost hours',
              '<code>underscores_in_headers</code> mặc định là off, nên Nginx VỨT header đó trong im lặng — không ghi log gì, và chính điều đó làm nó tốn hàng giờ',
            ),
            B(
              'curl refuses to send header names containing an underscore, so it never left the client',
              'curl từ chối gửi tên header có gạch dưới, nên nó chưa từng rời khỏi client',
            ),
            B(
              'The two names collide after normalisation and the second one overwrote the first',
              'Hai cái tên đó trùng nhau sau khi chuẩn hoá và cái thứ hai ghi đè lên cái thứ nhất',
            ),
            B(
              'Underscored headers are forwarded but the Node upstream hides them from <code>req.headers</code>',
              'Header có gạch dưới vẫn được chuyển tiếp nhưng upstream Node giấu chúng khỏi <code>req.headers</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is the hardest of the proxy defaults to diagnose, because nothing anywhere reports it: the application says the header is missing, the client swears it sent it, and <code>curl</code> straight to the backend proves the client right. The default was written when underscores in header names were a CGI hazard. Two ways out: rename the header to use hyphens, which is what the standard prefers anyway and is the fix you should choose because the NEXT proxy in the chain may have the same default; or set <code>underscores_in_headers on;</code> — and note it is valid only at <code>http</code> or <code>server</code> level, never inside a <code>location</code>, which is itself a common lost half-hour.',
            'Đây là giá trị mặc định khó chẩn nhất của proxy, vì chẳng nơi nào báo cáo nó: ứng dụng bảo thiếu header, client thề là đã gửi, và <code>curl</code> thẳng vào backend chứng minh client nói đúng. Mặc định này được viết ra từ thời gạch dưới trong tên header là một mối nguy của CGI. Hai lối ra: ĐỔI TÊN header sang dùng gạch nối — cũng chính là thứ chuẩn HTTP ưa dùng, và là cách bạn NÊN chọn vì cái proxy TIẾP THEO trong chuỗi có thể cũng có đúng mặc định ấy; hoặc đặt <code>underscores_in_headers on;</code> — và nhớ nó chỉ hợp lệ ở tầng <code>http</code> hoặc <code>server</code>, không bao giờ bên trong một <code>location</code>, thứ tự nó đã ngốn của nhiều người nửa tiếng.',
          ),
        }),

        // q27 · đáp án 1
        mcq({
          prompt: B(
            'Nginx is the first thing the internet reaches. A rate limiter and an audit log both need "the client". Which value should they key on, and what is the one way to lose it?',
            'Nginx là thứ đầu tiên Internet chạm tới. Một bộ giới hạn tần suất và một nhật ký kiểm toán đều cần "địa chỉ client". Chúng nên khoá theo giá trị nào, và có đúng MỘT cách nào để đánh mất nó?',
          ),
          options: [
            B(
              'The leftmost entry of <code>X-Forwarded-For</code>, since that is by definition the original client',
              'Mục ngoài cùng trái của <code>X-Forwarded-For</code>, vì theo định nghĩa đó là client gốc',
            ),
            B(
              '<code>$remote_addr</code> — at the edge it is the TCP peer and cannot be forged over TCP; declaring too wide a <code>set_real_ip_from</code> hands even that value to the caller',
              '<code>$remote_addr</code> — ở rìa mạng nó là địa chỉ TCP đối tác và không giả mạo được qua TCP; nhưng khai <code>set_real_ip_from</code> quá rộng là trao luôn cả giá trị đó cho người gọi',
            ),
            B(
              '<code>$http_x_real_ip</code>, because Nginx validates that header before passing it on',
              '<code>$http_x_real_ip</code>, vì Nginx kiểm chứng header đó trước khi chuyển tiếp',
            ),
            B(
              'The rightmost entry of <code>X-Forwarded-For</code>, which only a proxy can write',
              'Mục ngoài cùng phải của <code>X-Forwarded-For</code>, thứ chỉ một proxy mới ghi được',
            ),
          ],
          correct: 1,
          explanation: EX(
            '<code>$proxy_add_x_forwarded_for</code> is defined as "the incoming header, a comma, then <code>$remote_addr</code>" — correct behaviour for a proxy chain, and it means the LEFTMOST entry was written by whoever called you. At the edge that is the client, so <code>xff.split(",")[0]</code> reads exactly the value an attacker chose. <code>$remote_addr</code> is the TCP peer address and is not forgeable over TCP. The trap is <code>set_real_ip_from</code>: it tells Nginx to REWRITE <code>$remote_addr</code> from the forwarded header for connections coming from the listed addresses, so listing a whole private range "to be safe" hands the attacker the last honest value you had. Trust exactly the addresses of proxies you operate, and nothing else.',
            '<code>$proxy_add_x_forwarded_for</code> được định nghĩa là "header đi vào, một dấu phẩy, rồi <code>$remote_addr</code>" — đó là hành vi ĐÚNG cho một chuỗi proxy, và nó có nghĩa mục TRÁI NHẤT do chính người gọi bạn viết ra. Ở rìa mạng thì người gọi là client, nên <code>xff.split(",")[0]</code> đọc đúng cái giá trị mà kẻ tấn công đã chọn. <code>$remote_addr</code> là địa chỉ TCP đối tác, không giả mạo được qua TCP. Cái bẫy nằm ở <code>set_real_ip_from</code>: nó bảo Nginx VIẾT LẠI <code>$remote_addr</code> từ header chuyển tiếp đối với các kết nối tới từ những địa chỉ được liệt kê, nên khai cả một dải mạng riêng "cho chắc" là trao cho kẻ tấn công cái giá trị trung thực cuối cùng bạn còn. Hãy tin đúng những địa chỉ proxy DO BẠN vận hành, và không tin gì thêm.',
          ),
        }),

        // q28 · đáp án 2
        mcq({
          prompt: B(
            'A server-sent-events endpoint delivers everything in one burst at the end instead of streaming. Six configurations were timed at the socket in the course. What is the actual culprit?',
            'Một endpoint server-sent-events nhả hết mọi thứ trong một cú ở cuối thay vì chảy dần. Giáo trình đã bấm giờ sáu cấu hình ngay ở tầng socket. Thủ phạm THẬT là gì?',
          ),
          options: [
            B(
              '<code>proxy_buffering on</code> — it holds the whole response until the upstream finishes, which is why every guide says to turn it off',
              '<code>proxy_buffering on</code> — nó giữ lại toàn bộ phản hồi cho tới khi upstream xong, và đó là lý do mọi hướng dẫn đều bảo tắt nó đi',
            ),
            B(
              '<code>proxy_read_timeout</code> being too short, which batches the chunks into a single flush',
              '<code>proxy_read_timeout</code> đặt quá ngắn, khiến các mẩu bị gom lại thành một cú xả duy nhất',
            ),
            B(
              'gzip — a compressor needs input before it can emit output, so it holds the stream back; buffering on and off timed identically',
              'gzip — bộ nén cần có dữ liệu vào rồi mới nhả ra được nên nó giữ luồng lại; còn bật hay tắt buffering thì bấm giờ ra y hệt nhau',
            ),
            B(
              'HTTP/1.0 upstream: chunked responses are impossible in 1.0, so Nginx must collect the whole body first',
              'Upstream HTTP/1.0: phản hồi dạng chunked không tồn tại trong 1.0 nên Nginx buộc phải gom cả thân trước',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The folklore aims at the wrong directive. Measured with a probe reading raw bytes off the socket, a direct call, a proxied call with buffering ON and a proxied call with buffering OFF all delivered the four chunks at 0.40 / 0.80 / 1.20 / 1.60 s — identical. Only the row with gzip compressing the response collapsed into one packet at 1.60 s. Turning off <code>proxy_buffering</code> does fix it, but by accident, and it costs the slow-client protection that buffering exists for: with buffering on, Nginx drains the upstream at full speed and releases your application worker in milliseconds instead of holding it for the length of a slow mobile download. Fix it at the route (<code>gzip off;</code> in that location, or keep <code>text/event-stream</code> out of <code>gzip_types</code>), or let the application send <code>X-Accel-Buffering: no</code> per response.',
            'Lời truyền miệng nhắm vào nhầm chỉ thị. Đo bằng một đầu dò đọc byte thô ngay ở socket: gọi thẳng, gọi qua proxy với buffering BẬT, và gọi qua proxy với buffering TẮT — cả ba đều nhả bốn mẩu ở 0,40 / 0,80 / 1,20 / 1,60 s, y hệt nhau. Chỉ có dòng bật gzip nén phản hồi mới co lại thành MỘT gói duy nhất ở 1,60 s. Tắt <code>proxy_buffering</code> quả thật chữa được triệu chứng, nhưng chữa một cách tình cờ, và cái giá là mất lớp che chắn trước client chậm — thứ mà buffering sinh ra để làm: khi bật, Nginx hút cạn upstream với tốc độ tối đa và thả worker của ứng dụng ra sau vài mili giây thay vì giữ nó suốt một lượt tải chậm trên di động. Hãy sửa NGAY TẠI TUYẾN (<code>gzip off;</code> trong đúng location đó, hoặc đừng đưa <code>text/event-stream</code> vào <code>gzip_types</code>), hoặc để ứng dụng gửi <code>X-Accel-Buffering: no</code> theo từng phản hồi.',
          ),
        }),

        // q29 · đáp án 0
        mcq({
          prompt: B(
            'Three upstream failures against the same block, measured on nginx/1.27.5.' + code(
              '/cham  (upstream im lang, proxy_read_timeout 2s) -> 504 sau 2.017s\n' +
              '   error.log: upstream timed out (110) while reading response header from upstream\n' +
              '/chet  (cong 9999 khong ai nghe)                 -> 502 sau 0.0004s\n' +
              '   error.log: connect() failed (111: Connection refused) while connecting to upstream\n' +
              '/dut   (upstream dong socket giua chung)          -> 502 sau 0.0009s\n' +
              '   error.log: upstream prematurely closed connection while reading response header',
            ) + 'Which reading is correct?',
            'Ba kiểu hỏng của upstream trên cùng một khối, đo trên nginx/1.27.5.' + code(
              '/cham  (upstream im lang, proxy_read_timeout 2s) -> 504 sau 2.017s\n' +
              '   error.log: upstream timed out (110) while reading response header from upstream\n' +
              '/chet  (cong 9999 khong ai nghe)                 -> 502 sau 0.0004s\n' +
              '   error.log: connect() failed (111: Connection refused) while connecting to upstream\n' +
              '/dut   (upstream dong socket giua chung)          -> 502 sau 0.0009s\n' +
              '   error.log: upstream prematurely closed connection while reading response header',
            ),
          ),
          options: [
            B(
              '504 means Nginx reached the backend and waited too long — look at the application; 502 means it never got a usable connection or response — look at the process and the port. And <code>proxy_connect_timeout</code> did nothing in row two because a refusal is instant',
              '504 nghĩa là Nginx CÓ tới được backend rồi chờ quá lâu — hãy soi ứng dụng; 502 nghĩa là nó không lấy được một kết nối hay phản hồi dùng được nào — hãy soi tiến trình và cái cổng. Và <code>proxy_connect_timeout</code> chẳng làm gì ở dòng hai vì lời từ chối tới ngay tức khắc',
            ),
            B(
              'All three rows are timeouts of one kind or another, and which status the client receives is decided entirely by the <code>proxy_next_upstream</code> list rather than by the phase the failure happened in',
              'Cả ba dòng đều là timeout kiểu này hay kiểu khác, và client nhận mã nào là hoàn toàn do danh sách <code>proxy_next_upstream</code> quyết định chứ không do cái pha mà sự cố xảy ra',
            ),
            B(
              '502 always means the upstream answered with a 5xx status of its own that Nginx passed through, and 504 always means a firewall silently dropped the packets somewhere between the two hosts',
              '502 luôn có nghĩa là upstream tự trả về một mã 5xx và Nginx chuyển tiếp nó, còn 504 luôn có nghĩa là một tường lửa đã âm thầm vứt gói tin ở đâu đó giữa hai máy',
            ),
            B(
              'Rows two and three would both turn into 504 if <code>proxy_connect_timeout</code> were lowered to one second, because a shorter connect timeout promotes a connection failure into a gateway timeout',
              'Dòng hai và ba đều sẽ thành 504 nếu hạ <code>proxy_connect_timeout</code> xuống một giây, vì timeout kết nối ngắn hơn sẽ nâng một cú hỏng kết nối thành một cú hết giờ cổng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Memorise the split and you halve the search. Row two also shows why <code>proxy_connect_timeout</code> so often appears to do nothing: a closed port sends an immediate TCP refusal, so the answer arrives in under a millisecond and no timer ever runs. That directive only bites when packets are silently DROPPED — a firewall, a dead host, a wrong security group. Read the error-log phrase rather than the status, because it names the phase: <code>connect()</code>, <code>while reading response header from upstream</code>, or <code>while reading upstream</code>. That last one is the dangerous case: once the response headers are on the wire Nginx can no longer choose an error, so a backend that goes quiet mid-body produces a 200 with a truncated body, which every dashboard above it will call a success.',
            'Thuộc cái ranh giới này là bạn cắt đôi phạm vi tìm kiếm. Dòng hai còn cho thấy vì sao <code>proxy_connect_timeout</code> hay có vẻ vô dụng: một cổng đóng thì gửi lời TỪ CHỐI TCP ngay lập tức, nên câu trả lời về trong chưa tới một mili giây và chẳng đồng hồ nào kịp chạy. Chỉ thị đó chỉ cắn khi gói tin bị VỨT trong im lặng — một tường lửa, một máy chết, một nhóm bảo mật sai. Hãy đọc CÂU CHỮ trong error log thay vì đọc mã trạng thái, vì nó gọi tên cái PHA: <code>connect()</code>, <code>while reading response header from upstream</code>, hay <code>while reading upstream</code>. Cái cuối mới là ca nguy hiểm: một khi header phản hồi đã lên dây thì Nginx không còn chọn được một mã lỗi nữa, nên một backend im bặt giữa thân phản hồi sẽ cho ra một cú 200 với thân bị cụt — thứ mà mọi bảng điều khiển bên trên đều gọi là THÀNH CÔNG.',
          ),
        }),

        // q30 · đáp án 3
        mcq({
          prompt: B(
            'A working WebSocket server behind a plain <code>proxy_pass</code> block never connects. The browser reports "connection closed before the handshake completed", and there is no error in the Nginx log, none in the upstream log, and no failed request anywhere. What is the state of things, and what one probe settles it?',
            'Một máy chủ WebSocket hoạt động tốt nằm sau một khối <code>proxy_pass</code> bình thường thì không bao giờ kết nối được. Trình duyệt báo "connection closed before the handshake completed", còn log Nginx không có lỗi, log upstream cũng không, và chẳng đâu có request nào hỏng. Tình trạng thật là gì, và MỘT phép dò nào chốt được chuyện đó?',
          ),
          options: [
            B(
              'TLS termination is eating the upgrade, because an ALPN-negotiated HTTP/2 connection cannot carry one; probe with <code>openssl s_client -alpn</code> and compare the protocol list on both hops',
              'Việc kết thúc TLS đang nuốt mất cú nâng cấp, vì một kết nối HTTP/2 thoả thuận qua ALPN thì không mang nổi nó; hãy dò bằng <code>openssl s_client -alpn</code> rồi so danh sách giao thức ở cả hai chặng',
            ),
            B(
              'The upstream process crashes on the handshake and its supervisor restarts it before anything is written down; probe by tailing the container stderr and the restart count while you connect',
              'Tiến trình upstream sập ngay ở cú bắt tay và trình giám sát khởi động lại nó trước khi kịp ghi gì xuống; hãy dò bằng cách theo dõi stderr của container và số lần khởi động lại trong lúc bạn kết nối',
            ),
            B(
              'A stateful firewall drops the long-lived socket a few seconds after the upgrade succeeds, so the handshake really did complete; probe with a packet capture at both ends and match the RST against the idle timer',
              'Một tường lửa có trạng thái vứt bỏ socket sống lâu vài giây sau khi nâng cấp thành công, nghĩa là cú bắt tay đã hoàn tất thật; hãy dò bằng cách bắt gói ở cả hai đầu rồi khớp gói RST với đồng hồ nhàn rỗi',
            ),
            B(
              'Nginx must strip the hop-by-hop <code>Upgrade</code> and <code>Connection</code> headers, so the upstream saw a plain GET and answered 200 instead of 101 — send the raw handshake yourself and read the status line',
              'Nginx BẮT BUỘC phải gỡ hai header từng-chặng <code>Upgrade</code> và <code>Connection</code>, nên upstream chỉ thấy một GET bình thường và trả lời 200 thay vì 101 — hãy tự gửi cú bắt tay thô rồi đọc dòng trạng thái',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is not a bug and not a missing module: <code>Upgrade</code>, <code>Connection</code>, <code>Keep-Alive</code>, <code>Transfer-Encoding</code> and <code>TE</code> describe ONE hop, not the whole journey, so a proxy is required to remove them. Your upstream therefore receives an ordinary GET and answers it like one — which is why the failure is a 200 and nothing looks broken anywhere. Four directives put them back for the hop Nginx itself is making: <code>proxy_http_version 1.1;</code>, <code>proxy_set_header Upgrade $http_upgrade;</code>, <code>proxy_set_header Connection $connection_upgrade;</code> fed by a <code>map</code> at the <code>http</code> level, and a long <code>proxy_read_timeout</code> so an idle socket is not killed after 60 seconds. The map matters: a hard-coded <code>Connection "upgrade"</code> lies on every ordinary request. And the one honest probe is the status line — 101 means the proxy is fine, 200 means it is this.',
            'Đây không phải lỗi và cũng không phải thiếu module: <code>Upgrade</code>, <code>Connection</code>, <code>Keep-Alive</code>, <code>Transfer-Encoding</code> và <code>TE</code> mô tả MỘT chặng chứ không mô tả cả hành trình, nên một proxy BẮT BUỘC phải gỡ chúng. Vì thế upstream của bạn nhận được một GET bình thường và trả lời như với một GET bình thường — và đó là lý do cú hỏng này là một mã 200 và chẳng chỗ nào trông có vẻ hỏng cả. Bốn chỉ thị đặt chúng trở lại cho cái chặng mà chính Nginx đang đi: <code>proxy_http_version 1.1;</code>, <code>proxy_set_header Upgrade $http_upgrade;</code>, <code>proxy_set_header Connection $connection_upgrade;</code> lấy từ một <code>map</code> ở tầng <code>http</code>, và một <code>proxy_read_timeout</code> đủ dài để một socket rảnh rỗi không bị giết sau 60 giây. Cái map là quan trọng: viết cứng <code>Connection "upgrade"</code> là nói dối trên mọi request bình thường. Còn phép dò trung thực duy nhất là DÒNG TRẠNG THÁI — 101 nghĩa là proxy ổn, 200 nghĩa là chính chỗ này.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q31 — Implement the location-matching algorithm (chapter 2).</b> Nginx does NOT read <code>location</code> blocks top to bottom and take the first match. Implement the algorithm it really runs, then run it over a list of URIs. Every expected line below was produced by the real nginx/1.27.5 with exactly these seven blocks.</p>' +
            '<p><code>chon(uri)</code> returns <code>{ khoi, buoc }</code> where <code>khoi</code> is the <code>ten</code> of the winning location and <code>buoc</code> is the step number that decided it:</p>' +
            '<ul>' +
            '<li><b>Step 1</b> — an <code>exact</code> location whose <code>mau</code> EQUALS the URI wins immediately; nothing else is examined.</li>' +
            '<li><b>Step 2</b> — among <code>prefix</code> and <code>caret</code> locations, remember the LONGEST <code>mau</code> that the URI starts with. Length decides; array position never does. This is not yet a decision.</li>' +
            '<li><b>Step 3</b> — if that remembered candidate is a <code>caret</code>, commit to it now and skip step 4. Report <code>buoc: 3</code>.</li>' +
            '<li><b>Step 4</b> — otherwise test the <code>regex</code> locations in ARRAY ORDER and the first whose <code>mau.test(uri)</code> is true wins outright, beating the remembered prefix. Report <code>buoc: 4</code>.</li>' +
            '<li><b>Step 5</b> — no regex matched, so the remembered prefix handles it. Report <code>buoc: 5</code> (and <code>buoc: 1</code> for a step-1 win).</li>' +
            '<li>If nothing at all matched, return <code>{ khoi: null, buoc: 0 }</code>.</li>' +
            '</ul>' +
            '<p><code>demBuoc(uris)</code> returns one string counting how many URIs were decided at each step, keys ascending, in the form <code>"1=2 3=1 5=4"</code>. Steps with a count of zero are omitted.</p>' +
            '<p>Keep the given data and the printing block exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 31 — Cài đặt thuật toán chọn location (chương 2).</b> Nginx KHÔNG đọc các khối <code>location</code> từ trên xuống rồi lấy cái khớp đầu tiên. Hãy cài đặt đúng thuật toán mà nó thật sự chạy, rồi cho chạy trên một loạt URI. Mọi dòng kết quả mong đợi bên dưới đều do chính nginx/1.27.5 thật sinh ra với đúng bảy khối này.</p>' +
            '<p><code>chon(uri)</code> trả về <code>{ khoi, buoc }</code> với <code>khoi</code> là <code>ten</code> của location thắng cuộc và <code>buoc</code> là số hiệu bước đã quyết định:</p>' +
            '<ul>' +
            '<li><b>Bước 1</b> — một location loại <code>exact</code> có <code>mau</code> BẰNG ĐÚNG URI thì thắng ngay lập tức; không xét gì thêm.</li>' +
            '<li><b>Bước 2</b> — trong các location <code>prefix</code> và <code>caret</code>, NHỚ lấy <code>mau</code> DÀI NHẤT mà URI bắt đầu bằng nó. Độ dài quyết định; vị trí trong mảng thì không bao giờ. Đây chưa phải một quyết định.</li>' +
            '<li><b>Bước 3</b> — nếu ứng viên vừa nhớ là loại <code>caret</code> thì chốt luôn và BỎ QUA bước 4. Báo <code>buoc: 3</code>.</li>' +
            '<li><b>Bước 4</b> — nếu không thì thử các location <code>regex</code> theo ĐÚNG THỨ TỰ MẢNG và cái đầu tiên có <code>mau.test(uri)</code> đúng sẽ thắng dứt điểm, thắng cả tiền tố đã nhớ. Báo <code>buoc: 4</code>.</li>' +
            '<li><b>Bước 5</b> — không regex nào khớp nên tiền tố đã nhớ đứng ra xử lý. Báo <code>buoc: 5</code> (và <code>buoc: 1</code> cho ca thắng ở bước 1).</li>' +
            '<li>Nếu chẳng có gì khớp thì trả về <code>{ khoi: null, buoc: 0 }</code>.</li>' +
            '</ul>' +
            '<p><code>demBuoc(uris)</code> trả về MỘT chuỗi đếm xem mỗi bước quyết định bao nhiêu URI, khoá tăng dần, dạng <code>"1=2 3=1 5=4"</code>. Bước nào đếm được 0 thì bỏ đi.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không cài thêm thư viện nào.</p>',
          ),
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// Đúng bảy khối location đã chạy thật trên nginx/1.27.5.\n' +
            'const LOCATIONS = [\n' +
            "  { ten: '= /k',             loai: 'exact',  mau: '/k' },\n" +
            "  { ten: '^~ /k/ao',         loai: 'caret',  mau: '/k/ao' },\n" +
            "  { ten: '~ .txt',           loai: 'regex',  mau: /\\.txt/ },\n" +
            "  { ten: '~* .png .gif',     loai: 'regex',  mau: /\\.(png|gif)$/i },\n" +
            "  { ten: '/k/ao/sau',        loai: 'prefix', mau: '/k/ao/sau' },\n" +
            "  { ten: '/k',               loai: 'prefix', mau: '/k' },\n" +
            "  { ten: '/',                loai: 'prefix', mau: '/' },\n" +
            '];\n\n' +
            'const URIS = [\n' +
            "  '/k', '/k/', '/kx', '/khac', '/kao',\n" +
            "  '/k/ao', '/k/ao.txt', '/k/ao/x', '/k/ao/anh.png',\n" +
            "  '/k/ao/sau/y', '/k/ao/sau/x.txt', '/k/ao/sau/anh.png',\n" +
            "  '/k/x.txt', '/k/x.TXT', '/k/anh.PNG', '/k.txt',\n" +
            "  '/K/X.PNG', '/K', '/',\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function chon(uri) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function demBuoc(uris) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const u of URIS) {\n' +
            '  const r = chon(u);\n' +
            "  console.log(u.padEnd(18), 'buoc=' + r.buoc, r.khoi);\n" +
            '}\n' +
            "console.log('demBuoc:', demBuoc(URIS));\n",
          expectedOutput:
            '/k                 buoc=1 = /k\n' +
            '/k/                buoc=5 /k\n' +
            '/kx                buoc=5 /k\n' +
            '/khac              buoc=5 /k\n' +
            '/kao               buoc=5 /k\n' +
            '/k/ao              buoc=3 ^~ /k/ao\n' +
            '/k/ao.txt          buoc=3 ^~ /k/ao\n' +
            '/k/ao/x            buoc=3 ^~ /k/ao\n' +
            '/k/ao/anh.png      buoc=3 ^~ /k/ao\n' +
            '/k/ao/sau/y        buoc=5 /k/ao/sau\n' +
            '/k/ao/sau/x.txt    buoc=4 ~ .txt\n' +
            '/k/ao/sau/anh.png  buoc=4 ~* .png .gif\n' +
            '/k/x.txt           buoc=4 ~ .txt\n' +
            '/k/x.TXT           buoc=5 /k\n' +
            '/k/anh.PNG         buoc=4 ~* .png .gif\n' +
            '/k.txt             buoc=4 ~ .txt\n' +
            '/K/X.PNG           buoc=4 ~* .png .gif\n' +
            '/K                 buoc=5 /\n' +
            '/                  buoc=5 /\n' +
            'demBuoc: 1=1 3=4 4=6 5=8',
          sampleSolution:
            'function chon(uri) {\n' +
            '  // Bước 1 — khớp chính xác là đoản mạch, không xét gì thêm.\n' +
            "  for (const l of LOCATIONS) {\n" +
            "    if (l.loai === 'exact' && l.mau === uri) return { khoi: l.ten, buoc: 1 };\n" +
            '  }\n\n' +
            '  // Bước 2 — nhớ tiền tố DÀI NHẤT; độ dài quyết định, vị trí thì không.\n' +
            '  let nho = null;\n' +
            '  for (const l of LOCATIONS) {\n' +
            "    if (l.loai !== 'prefix' && l.loai !== 'caret') continue;\n" +
            '    if (!uri.startsWith(l.mau)) continue;\n' +
            '    if (!nho || l.mau.length > nho.mau.length) nho = l;\n' +
            '  }\n\n' +
            '  // Bước 3 — tiền tố dài nhất mang ^~ thì chốt luôn, BỎ QUA đám regex.\n' +
            "  if (nho && nho.loai === 'caret') return { khoi: nho.ten, buoc: 3 };\n\n" +
            '  // Bước 4 — regex theo ĐÚNG thứ tự mảng, cái đầu tiên khớp là thắng.\n' +
            '  for (const l of LOCATIONS) {\n' +
            "    if (l.loai === 'regex' && l.mau.test(uri)) return { khoi: l.ten, buoc: 4 };\n" +
            '  }\n\n' +
            '  // Bước 5 — quay về tiền tố đã nhớ.\n' +
            '  if (nho) return { khoi: nho.ten, buoc: 5 };\n' +
            '  return { khoi: null, buoc: 0 };\n' +
            '}\n\n' +
            'function demBuoc(uris) {\n' +
            '  const d = {};\n' +
            '  for (const u of uris) {\n' +
            '    const b = chon(u).buoc;\n' +
            '    d[b] = (d[b] || 0) + 1;\n' +
            '  }\n' +
            '  return Object.keys(d)\n' +
            '    .map(Number)\n' +
            '    .sort((a, b) => a - b)\n' +
            "    .map((k) => k + '=' + d[k])\n" +
            "    .join(' ');\n" +
            '}\n',
          rubric: RUBRIC_CODE,
        }),

        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            '<p><b>Q32 — Rebuild the upstream URL from <code>proxy_pass</code> (chapter 3).</b> One character in <code>proxy_pass</code> decides whether your application receives <code>/api/nguoi/1</code> or <code>/nguoi/1</code> — or something broken that neither of you wrote. Implement <code>dungUrl(cau)</code>, which reproduces the rule exactly. Every expected line below was produced by the real nginx/1.27.5 against an upstream that prints the path it received.</p>' +
            '<p>Return <code>{ url, dang, canhBao }</code>:</p>' +
            '<ul>' +
            '<li>Split <code>pass</code> into an ORIGIN (<code>http://host:port</code>) and a PATH (everything from the first <code>/</code> after the origin). No path at all means the pass-through form.</li>' +
            '<li><b>Pass-through</b> (no path): the upstream path is <code>uri</code> unchanged. <code>dang</code> is <code>"chuyen-tiep"</code>.</li>' +
            '<li><b>Substituting</b> (any path, a bare <code>/</code> included): cut <code>loc</code> off the FRONT of <code>uri</code> and paste the pass path in its place — a literal splice, with no tidying of the join. <code>dang</code> is <code>"thay-the"</code>.</li>' +
            '<li>Append <code>"?" + args</code> when <code>args</code> is a non-empty string, in both forms.</li>' +
            '<li><code>url</code> is <code>origin + path + query</code>.</li>' +
            '<li><code>canhBao</code> reports a trailing-slash MISMATCH in the substituting form only. If <code>loc</code> and the pass path disagree about ending in <code>/</code>: it is <code>"gach-doi"</code> when the pass path ends in <code>/</code>, and <code>"dinh-lien"</code> when <code>loc</code> ends in <code>/</code>. Otherwise it is the empty string.</li>' +
            '</ul>' +
            '<p><code>demCanhBao(list)</code> returns one string counting the non-empty warnings, keys sorted alphabetically, in the form <code>"dinh-lien=1 gach-doi=2"</code>.</p>' +
            '<p>Keep the given data and the printing block exactly as they are, and do not install anything.</p>',

            '<p><b>Câu 32 — Dựng lại URL upstream từ <code>proxy_pass</code> (chương 3).</b> MỘT ký tự trong <code>proxy_pass</code> quyết định ứng dụng của bạn nhận được <code>/api/nguoi/1</code> hay <code>/nguoi/1</code> — hoặc một thứ hỏng mà cả hai bên đều không viết ra. Hãy cài đặt <code>dungUrl(cau)</code> tái hiện đúng cái luật ấy. Mọi dòng kết quả mong đợi bên dưới đều do chính nginx/1.27.5 thật sinh ra, với một upstream in lại đường dẫn nó nhận được.</p>' +
            '<p>Trả về <code>{ url, dang, canhBao }</code>:</p>' +
            '<ul>' +
            '<li>Tách <code>pass</code> thành phần GỐC (<code>http://host:port</code>) và phần ĐƯỜNG DẪN (mọi thứ kể từ dấu <code>/</code> đầu tiên sau phần gốc). Không có đường dẫn nào nghĩa là dạng chuyển tiếp.</li>' +
            '<li><b>Chuyển tiếp</b> (không đường dẫn): đường dẫn gửi lên upstream là <code>uri</code> nguyên vẹn. <code>dang</code> là <code>"chuyen-tiep"</code>.</li>' +
            '<li><b>Thay thế</b> (có đường dẫn, kể cả một dấu <code>/</code> trơ trọi): cắt <code>loc</code> khỏi ĐẦU <code>uri</code> rồi dán đường dẫn của pass vào chỗ đó — một phép nối NGUYÊN VĂN, không dọn dẹp gì ở mối nối. <code>dang</code> là <code>"thay-the"</code>.</li>' +
            '<li>Nối thêm <code>"?" + args</code> khi <code>args</code> là chuỗi khác rỗng, ở cả hai dạng.</li>' +
            '<li><code>url</code> là <code>gốc + đường dẫn + phần truy vấn</code>.</li>' +
            '<li><code>canhBao</code> báo LỆCH dấu gạch chéo cuối, chỉ ở dạng thay thế. Nếu <code>loc</code> và đường dẫn của pass bất đồng về chuyện có kết thúc bằng <code>/</code> hay không: là <code>"gach-doi"</code> khi đường dẫn của pass kết thúc bằng <code>/</code>, và là <code>"dinh-lien"</code> khi <code>loc</code> kết thúc bằng <code>/</code>. Còn lại là chuỗi rỗng.</li>' +
            '</ul>' +
            '<p><code>demCanhBao(list)</code> trả về MỘT chuỗi đếm các cảnh báo khác rỗng, khoá xếp theo bảng chữ cái, dạng <code>"dinh-lien=1 gach-doi=2"</code>.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không cài thêm thư viện nào.</p>',
          ),
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// Mười ca đã chạy thật trên nginx/1.27.5 với upstream in lai duong dan.\n' +
            'const CAC_CA = [\n' +
            "  { loc: '/p1/',  pass: 'http://up:9101',      uri: '/p1/nguoi/1', args: 'q=2' },\n" +
            "  { loc: '/p2',   pass: 'http://up:9101',      uri: '/p2/nguoi/1', args: 'q=2' },\n" +
            "  { loc: '/p3/',  pass: 'http://up:9101/',     uri: '/p3/nguoi/1', args: 'q=2' },\n" +
            "  { loc: '/p4',   pass: 'http://up:9101/',     uri: '/p4/nguoi/1', args: 'q=2' },\n" +
            "  { loc: '/p5/',  pass: 'http://up:9101/moi/', uri: '/p5/nguoi/1', args: 'q=2' },\n" +
            "  { loc: '/p6/',  pass: 'http://up:9101/moi',  uri: '/p6/nguoi/1', args: 'q=2' },\n" +
            "  { loc: '/p7',   pass: 'http://up:9101/moi/', uri: '/p7/nguoi/1', args: 'q=2' },\n" +
            "  { loc: '/x',    pass: 'http://up:9101',      uri: '/xyz',        args: '' },\n" +
            "  { loc: '/api/', pass: 'http://up:9101/v1',   uri: '/api/nguoi',  args: '' },\n" +
            "  { loc: '/q/',   pass: 'http://up:9101/v2/',  uri: '/q/a/b',      args: '' },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function dungUrl(cau) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function demCanhBao(list) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const c of CAC_CA) {\n' +
            '  const r = dungUrl(c);\n' +
            "  console.log(c.loc.padEnd(6), r.dang.padEnd(12), r.url, r.canhBao || '-');\n" +
            '}\n' +
            "console.log('demCanhBao:', demCanhBao(CAC_CA));\n",
          expectedOutput:
            '/p1/   chuyen-tiep  http://up:9101/p1/nguoi/1?q=2 -\n' +
            '/p2    chuyen-tiep  http://up:9101/p2/nguoi/1?q=2 -\n' +
            '/p3/   thay-the     http://up:9101/nguoi/1?q=2 -\n' +
            '/p4    thay-the     http://up:9101//nguoi/1?q=2 gach-doi\n' +
            '/p5/   thay-the     http://up:9101/moi/nguoi/1?q=2 -\n' +
            '/p6/   thay-the     http://up:9101/moinguoi/1?q=2 dinh-lien\n' +
            '/p7    thay-the     http://up:9101/moi//nguoi/1?q=2 gach-doi\n' +
            '/x     chuyen-tiep  http://up:9101/xyz -\n' +
            '/api/  thay-the     http://up:9101/v1nguoi dinh-lien\n' +
            '/q/    thay-the     http://up:9101/v2/a/b -\n' +
            'demCanhBao: dinh-lien=2 gach-doi=2',
          sampleSolution:
            'function dungUrl(cau) {\n' +
            '  const { loc, pass, uri, args } = cau;\n\n' +
            '  // Tách gốc và đường dẫn: dấu / đầu tiên SAU "scheme://" mở đầu đường dẫn.\n' +
            "  const sauScheme = pass.indexOf('://') + 3;\n" +
            "  const cheo = pass.indexOf('/', sauScheme);\n" +
            '  const goc = cheo === -1 ? pass : pass.slice(0, cheo);\n' +
            "  const duongDanPass = cheo === -1 ? '' : pass.slice(cheo);\n\n" +
            "  const truyVan = args ? '?' + args : '';\n\n" +
            "  if (duongDanPass === '') {\n" +
            '    // Không có đường dẫn: URI đi NGUYÊN VẸN, y như root.\n' +
            "    return { url: goc + uri + truyVan, dang: 'chuyen-tiep', canhBao: '' };\n" +
            '  }\n\n' +
            '  // Có đường dẫn: cắt tiền tố đã khớp, dán đường dẫn của pass vào — nguyên văn.\n' +
            '  const conLai = uri.startsWith(loc) ? uri.slice(loc.length) : uri;\n' +
            '  const duongDan = duongDanPass + conLai;\n\n' +
            "  const locCoCheo = loc.endsWith('/');\n" +
            "  const passCoCheo = duongDanPass.endsWith('/');\n" +
            "  let canhBao = '';\n" +
            "  if (locCoCheo !== passCoCheo) canhBao = passCoCheo ? 'gach-doi' : 'dinh-lien';\n\n" +
            "  return { url: goc + duongDan + truyVan, dang: 'thay-the', canhBao };\n" +
            '}\n\n' +
            'function demCanhBao(list) {\n' +
            '  const d = {};\n' +
            '  for (const c of list) {\n' +
            '    const w = dungUrl(c).canhBao;\n' +
            '    if (!w) continue;\n' +
            '    d[w] = (d[w] || 0) + 1;\n' +
            '  }\n' +
            "  return Object.keys(d).sort().map((k) => k + '=' + d[k]).join(' ');\n" +
            '}\n',
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
