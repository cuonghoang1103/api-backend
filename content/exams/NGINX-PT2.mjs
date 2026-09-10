/**
 * Nginx — Progress Test 2 (chương s04–s07).
 *
 * Đề tự soạn, bám sát `content/courses/nginx/s04…s07`. 30 câu trắc nghiệm +
 * 2 câu lập trình làm ngay trong phòng thi (chấm bằng AI theo rubric).
 *
 * ⚠️ MỌI đoạn terminal trong đề đều CHẠY THẬT ngày 10/09/2026, trên
 *   **nginx/1.27.5** (ảnh `nginx:1.27-alpine`, linux/arm64, OpenSSL 3.3.3)
 *   chạy trong Docker Engine 29.5.3 trên macOS 25.6.0 / Apple M1 Max, kèm một
 *   upstream Node 22 tự ĐẾM số lần nó bị gọi. Mã trạng thái, header, dòng
 *   error log, số byte đã gửi lên và số bộ mã bắt tay được đều là nguyên văn
 *   máy in ra. Container nháp đã `docker rm -f` sau khi đo.
 *
 * ⚠️ BỐN CHỖ MÁY KHÁC GIÁO TRÌNH, đã đo lại và ĐỀ THEO MÁY:
 *   • Giáo trình (6.2) nói khối TLS mặc định nhận **21** bộ mã, trong đó **12**
 *     không có ECDHE. ĐO THẬT trên OpenSSL 3.3.3 của ảnh alpine: **25/158**
 *     được nhận, **14** trong số đó không có ECDHE (thêm ARIA và CAMELLIA).
 *     Con số phụ thuộc bản dựng OpenSSL, nên câu 22 hỏi Ý NGHĨA của việc thiếu
 *     ECDHE chứ không hỏi con số.
 *   • Giáo trình (4.3) nói `gzip_static` cho tệp NHỎ HƠN nén tại chỗ 3,1%.
 *     ĐO THẬT trên một tệp 5.406 byte: nén tại chỗ mức 5 ra 4.172 byte,
 *     `gzip -9` dựng sẵn ra 4.143 byte — nhỏ hơn 0,7%. Hướng thì đúng, độ lớn
 *     thì tuỳ nội dung, nên câu 6 hỏi CƠ CHẾ.
 *   • Giáo trình (7.1) nói `location /a/ { limit_req zone=z; return 200 …; }`
 *     đo được 200 rồi chín cú 503. ĐO THẬT: với `return` thì `limit_req`
 *     **KHÔNG hề chạy** — 10/10 đều 200, vì `return` thuộc pha rewrite còn
 *     `limit_req` thuộc pha preaccess đứng SAU nó. Phải thay bằng một handler
 *     nội dung thật (tệp tĩnh hoặc `proxy_pass`) thì ba chế độ burst mới hiện
 *     ra đúng như giáo trình. Mọi phép đo giới hạn trong đề này đều dùng
 *     handler thật.
 *   • Giáo trình (7.4) đo 25MB dạng chunked thì đẩy được 23,7MB lên dây trước
 *     khi ăn 413. ĐO THẬT: **25.003.061 byte** — tức là gần như TOÀN BỘ thân
 *     request đi qua, chứ không dừng đúng ở ngưỡng. Câu 30 dùng con số đo
 *     được.
 *
 * ⚠️ HAI CÂU LẬP TRÌNH (31, 32) khai `language: 'javascript'` CHỨ KHÔNG PHẢI
 *   `'nginx'`: nhãn `nginx` nằm trong tập `KHONG_CHAY_DUOC` của
 *   `scripts/exam-check.mjs`, khai nó là bộ kiểm bỏ qua và đề mất hẳn phép
 *   kiểm quan trọng nhất. Học viên vì thế viết JavaScript HIỆN THỰC ĐÚNG LUẬT
 *   của Nginx trên cấu hình cho sẵn dạng dữ liệu, và lời giải tự chứa — chấm
 *   được mà không cần một tiến trình nginx sống.
 *
 * ⚠️ NĂM CHỖ NỮA ĐO ĐƯỢC KHI DỰNG HAI CÂU LẬP TRÌNH (10/09/2026, cùng ảnh):
 *   • `try_files $uri $uri/index.html /t4/macdinh.html =403;` — cái `=403`
 *     KHÔNG BAO GIỜ chạy. Phần tử URI đứng trước nó luôn chuyển hướng nội bộ,
 *     nên mọi phần tử sau một URI dự phòng là mã chết, mà `nginx -t` vẫn xanh.
 *   • Khoá bộ đệm mặc định dựng từ `$request_uri` — thứ CLIENT hỏi. Đo thật:
 *     upstream nhận `/x` còn khoá là `httpup/c/x`. Đổi `proxy_pass` không đổi
 *     khoá, và hai URI chỉ khác thứ tự tham số là HAI khoá khác nhau.
 *   • Một request mang `Authorization` VẪN được nginx cất vào bộ đệm dùng
 *     chung (đo: MISS rồi HIT). Bộ đệm chia sẻ theo RFC thì không; nginx thì
 *     có, cho tới khi bạn tự khai `proxy_no_cache $http_authorization`.
 *   • `POST` không hề chạm tới bộ đệm và `$upstream_cache_status` để RỖNG —
 *     không phải `BYPASS`. Một dashboard đếm BYPASS sẽ không thấy nó.
 *   • `X-Accel-Expires: 120` THẮNG `Cache-Control: no-store` (đo: HIT), còn
 *     `X-Accel-Expires: 0` thì chặn cả một `proxy_cache_valid` đang mở.
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 7 · B 8 · C 8 · D 7.
 *   node -e "import('./content/exams/NGINX-PT2.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NGINX-PT2.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/nginx-exam-kit.mjs';

export default {
  course: { slug: 'nginx' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 4–7 (static files, caching, TLS and HTTP/2, limits)',
        'Kiểm tra tiến độ 2 — Chương 4–7 (tệp tĩnh, bộ đệm, TLS và HTTP/2, giới hạn)',
      ),
      description: B(
        'The middle third of the Nginx course: how a file becomes bytes and what its validators are made of, what a shared cache stores and who it hands it to, the certificate chain and what a handshake really costs, and four limits that each protect a different resource. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba giữa của khoá Nginx: một tệp biến thành byte ra sao và các validator của nó làm bằng gì, một bộ đệm dùng chung cất giữ cái gì và đem phát cho ai, chuỗi chứng chỉ và cái giá thật của một cú bắt tay, cùng bốn giới hạn mà mỗi cái bảo vệ một tài nguyên khác nhau. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '4–7'),
      questions: [
        /* ── Chương 4 — tệp tĩnh (8 câu) ────────────────────────────────── */

        // q1 · đáp án 2
        mcq({
          prompt: B(
            'Five files served from one root, measured on nginx/1.27.5 with no <code>default_type</code> declared.' + code(
              'trang.html   -> Content-Type: text/html\n' +
              'nho.txt      -> Content-Type: text/plain\n' +
              'lon.bin      -> Content-Type: application/octet-stream\n' +
              'khongduoi    -> Content-Type: text/plain      <- KHONG co phan duoi\n' +
              'la.xyz123    -> Content-Type: text/plain      <- duoi la, khong co trong bang',
            ) + 'How was each of these decided?',
            'Năm tệp phục vụ từ cùng một thư mục gốc, đo trên nginx/1.27.5 khi KHÔNG khai <code>default_type</code>.' + code(
              'trang.html   -> Content-Type: text/html\n' +
              'nho.txt      -> Content-Type: text/plain\n' +
              'lon.bin      -> Content-Type: application/octet-stream\n' +
              'khongduoi    -> Content-Type: text/plain      <- KHONG co phan duoi\n' +
              'la.xyz123    -> Content-Type: text/plain      <- duoi la, khong co trong bang',
            ) + 'Mỗi dòng được quyết định thế nào?',
          ),
          options: [
            B(
              'Nginx reads the first bytes of each file and sniffs the type, which is why the binary one differs from the text ones',
              'Nginx đọc mấy byte đầu của từng tệp rồi đánh hơi ra kiểu, và đó là lý do tệp nhị phân khác hai tệp văn bản',
            ),
            B(
              'The filesystem stores a MIME type per file, and Nginx reports whatever the extended attribute says',
              'Hệ tệp lưu một kiểu MIME cho mỗi tệp, và Nginx báo lại đúng cái mà thuộc tính mở rộng ghi',
            ),
            B(
              'The EXTENSION alone is looked up in <code>mime.types</code>; no extension and an unknown extension both fall to <code>default_type</code>, which defaults to <code>text/plain</code>',
              'CHỈ phần đuôi được tra trong <code>mime.types</code>; không có đuôi và đuôi lạ đều rơi về <code>default_type</code>, mà giá trị mặc định của nó là <code>text/plain</code>',
            ),
            B(
              'Nginx guesses from the file size: anything above a threshold is announced as binary and the rest as text',
              'Nginx đoán theo kích thước tệp: cái nào vượt ngưỡng thì khai là nhị phân, còn lại khai là văn bản',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A plain lookup table, included from <code>nginx.conf</code>, and nothing else — no sniffing, no reading the file. <code>.bin</code> is in that table, which is why it came back binary; the last two rows are the fallback. And <code>text/plain</code> is the wrong fallback anywhere users can upload: a file with no extension containing HTML is announced as text, and a browser will happily render attacker markup on your origin. Two lines fix it — <code>default_type application/octet-stream;</code> so unknown types download rather than render, and <code>add_header X-Content-Type-Options "nosniff" always;</code> so the browser does not second-guess you.',
            'Một bảng tra thuần tuý, được include từ <code>nginx.conf</code>, và không có gì khác — không đánh hơi, không đọc nội dung tệp. <code>.bin</code> CÓ trong bảng đó nên nó ra kiểu nhị phân; hai dòng cuối mới là đường lui. Và <code>text/plain</code> là đường lui SAI ở bất cứ chỗ nào người dùng tải tệp lên được: một tệp không đuôi chứa HTML sẽ được khai là văn bản, rồi trình duyệt vui vẻ dựng cái đánh dấu của kẻ tấn công ngay trên gốc của bạn. Hai dòng vá được — <code>default_type application/octet-stream;</code> để kiểu lạ bị TẢI VỀ thay vì dựng ra, và <code>add_header X-Content-Type-Options "nosniff" always;</code> để trình duyệt không tự đoán lại.',
          ),
        }),

        // q2 · đáp án 1
        mcq({
          prompt: B(
            'An uploads location, measured on nginx/1.27.5. The file on disk contains <code>&lt;script&gt;alert(1)&lt;/script&gt;</code>.' + code(
              'location /tai-len/ {\n' +
              '  types { }\n' +
              '  default_type application/octet-stream;\n' +
              '  add_header Content-Disposition "attachment" always;\n' +
              '  add_header X-Content-Type-Options "nosniff" always;\n' +
              '  try_files $uri =404;\n' +
              '}\n' +
              '\n' +
              '$ curl -sI http://edge/tai-len/anh-gia\n' +
              'HTTP/1.1 200 OK\n' +
              'Content-Type: application/octet-stream\n' +
              'Content-Disposition: attachment\n' +
              'X-Content-Type-Options: nosniff',
            ) + 'Why are there two mechanisms rather than one?',
            'Một khối phục vụ tệp người dùng tải lên, đo trên nginx/1.27.5. Tệp trên đĩa chứa <code>&lt;script&gt;alert(1)&lt;/script&gt;</code>.' + code(
              'location /tai-len/ {\n' +
              '  types { }\n' +
              '  default_type application/octet-stream;\n' +
              '  add_header Content-Disposition "attachment" always;\n' +
              '  add_header X-Content-Type-Options "nosniff" always;\n' +
              '  try_files $uri =404;\n' +
              '}\n' +
              '\n' +
              '$ curl -sI http://edge/tai-len/anh-gia\n' +
              'HTTP/1.1 200 OK\n' +
              'Content-Type: application/octet-stream\n' +
              'Content-Disposition: attachment\n' +
              'X-Content-Type-Options: nosniff',
            ) + 'Vì sao lại có HAI cơ chế chứ không phải một?',
          ),
          options: [
            B(
              'They are two spellings of one alternative kept around for old browsers, and either one on its own is exactly as safe as both of them together, so a modern site may drop whichever it prefers',
              'Chúng là hai cách viết của cùng một lựa chọn giữ lại cho trình duyệt cũ, và mỗi cái đứng một mình cũng an toàn y hệt cả hai cộng lại, nên một site hiện đại thích bỏ cái nào cũng được',
            ),
            B(
              'They fail differently: emptying <code>types</code> stops the type ever being announced as renderable, while <code>Content-Disposition: attachment</code> tells the browser to download even a type it would render — and the real fix is a separate origin',
              'Chúng hỏng theo hai kiểu khác nhau: làm rỗng bảng <code>types</code> khiến kiểu đó không bao giờ được khai là dựng được, còn <code>Content-Disposition: attachment</code> bảo trình duyệt TẢI VỀ ngay cả với kiểu nó vốn dựng ra — và cách sửa thật sự là một origin RIÊNG',
            ),
            B(
              '<code>types { }</code> only affects the <code>$sent_http_content_type</code> written into the access log, not the response itself, so the <code>Content-Disposition</code> header is what does every bit of the actual work here',
              '<code>types { }</code> chỉ ảnh hưởng tới biến <code>$sent_http_content_type</code> ghi vào access log chứ không đụng gì tới phản hồi, nên header <code>Content-Disposition</code> mới là thứ làm toàn bộ phần việc thật ở đây',
            ),
            B(
              'Nginx scans the body of every uploaded file for markup such as <code>&lt;script&gt;</code> and refuses to serve the ones that contain it, and the two directives above merely document that built-in behaviour for the next reader',
              'Nginx quét thân MỌI tệp tải lên tìm mã đánh dấu kiểu <code>&lt;script&gt;</code> rồi từ chối phục vụ những tệp có chứa nó, còn hai chỉ thị ở trên chỉ để ghi chú lại hành vi có sẵn ấy cho người đọc sau',
            ),
          ],
          correct: 1,
          explanation: EX(
            '<code>types { }</code> empties the MIME table for that location, so combined with <code>default_type application/octet-stream</code> every uploaded file is announced as binary regardless of its extension — an uploaded <code>.html</code> or <code>.svg</code> then cannot be rendered as a document on your origin, which is what turns an upload feature into stored XSS. <code>Content-Disposition: attachment</code> is the second lock and works even where the first is bypassed. Belt and braces, because the two fail differently and uploads are the one place you want both. Serving uploads from <code>files.vidu.com</code> rather than <code>vidu.com/tai-len/</code> is the real fix: even a rendered document then cannot touch your cookies or your DOM.',
            '<code>types { }</code> làm RỖNG bảng MIME cho khối đó, nên cộng với <code>default_type application/octet-stream</code> thì mọi tệp tải lên đều được khai là nhị phân bất kể phần đuôi — một tệp <code>.html</code> hay <code>.svg</code> tải lên khi ấy không thể được dựng thành tài liệu trên gốc của bạn, mà chính điều đó mới biến một tính năng tải lên thành XSS lưu trữ. <code>Content-Disposition: attachment</code> là ổ khoá thứ hai và ăn cả ở chỗ ổ thứ nhất bị lách. Thắt lưng cộng dây đeo quần, vì hai cái hỏng theo hai kiểu, và tệp tải lên là chỗ duy nhất bạn muốn có cả hai. Phục vụ tệp tải lên từ <code>files.vidu.com</code> thay vì <code>vidu.com/tai-len/</code> mới là cách sửa THẬT: khi đó dù có dựng ra tài liệu thì nó cũng không chạm được vào cookie hay DOM của bạn.',
          ),
        }),

        // q3 · đáp án 3
        mcq({
          prompt: B(
            'Measured on nginx/1.27.5, with the file untouched between the two requests except for one command.' + code(
              '$ curl -sI /trang.html   ->  ETag: "6aa20570-12"   Content-Length: 18\n' +
              '$ stat -c "%Y %s" trang.html   ->  1789003120 18\n' +
              '$ printf "%x-%x" 1789003120 18  ->  6aa20570-12       <- KHOP tung ky tu\n' +
              '\n' +
              '$ md5sum trang.html  -> 73216367f24654814d1d8c30a9535461\n' +
              '$ touch trang.html\n' +
              '$ md5sum trang.html  -> 73216367f24654814d1d8c30a9535461   Y HET\n' +
              '$ curl -sI /trang.html   ->  ETag: "6aa2057c-12"   DA DOI',
            ) + 'What does a deploy that re-creates files do to returning visitors?',
            'Đo trên nginx/1.27.5, giữa hai lần gọi tệp không bị đụng gì ngoài đúng một câu lệnh.' + code(
              '$ curl -sI /trang.html   ->  ETag: "6aa20570-12"   Content-Length: 18\n' +
              '$ stat -c "%Y %s" trang.html   ->  1789003120 18\n' +
              '$ printf "%x-%x" 1789003120 18  ->  6aa20570-12       <- KHOP tung ky tu\n' +
              '\n' +
              '$ md5sum trang.html  -> 73216367f24654814d1d8c30a9535461\n' +
              '$ touch trang.html\n' +
              '$ md5sum trang.html  -> 73216367f24654814d1d8c30a9535461   Y HET\n' +
              '$ curl -sI /trang.html   ->  ETag: "6aa2057c-12"   DA DOI',
            ) + 'Một lần deploy tạo lại tệp thì gây ra gì cho khách quay lại?',
          ),
          options: [
            B(
              'Nothing at all: the browser sends <code>If-Modified-Since</code> alongside <code>If-None-Match</code>, and Nginx answers 304 as soon as EITHER validator still agrees, so a rebuild that only moves the mtime is invisible',
              'Không gì cả: trình duyệt gửi kèm <code>If-Modified-Since</code> bên cạnh <code>If-None-Match</code>, và Nginx trả 304 ngay khi MỘT trong hai validator còn khớp, nên một lượt dựng lại chỉ đổi mtime là vô hình',
            ),
            B(
              'Only the HTML documents are refetched: for anything whose name already carries a content hash, Nginx notices the hash and computes that asset\'s ETag from the file contents instead of from its metadata',
              'Chỉ các tài liệu HTML là bị lấy lại: với thứ nào mà tên đã mang sẵn một mã băm nội dung, Nginx nhận ra cái băm ấy và tính ETag của tài nguyên đó từ NỘI DUNG tệp thay vì từ siêu dữ liệu',
            ),
            B(
              'They keep getting 304 responses exactly as before, because a changed ETag only forces a full re-download when the <code>Content-Length</code> changed as well; matching sizes let Nginx treat the two versions as one',
              'Họ vẫn nhận 304 y như trước, vì ETag đổi chỉ ép tải lại toàn bộ khi <code>Content-Length</code> cũng đổi theo; kích thước bằng nhau thì Nginx coi hai phiên bản là một',
            ),
            B(
              'Every cached asset is re-downloaded in full: the ETag is <code>hex(mtime)-hex(size)</code> and a <code>git clone</code>, a <code>COPY</code> or an <code>rsync</code> without <code>-t</code> stamps a new mtime on bytes that never changed',
              'Mọi tài nguyên đã cache đều bị tải lại TOÀN BỘ: ETag là <code>hex(mtime)-hex(size)</code> mà một cú <code>git clone</code>, một lệnh <code>COPY</code> hay <code>rsync</code> thiếu <code>-t</code> đều đóng dấu mtime mới lên những byte chưa từng đổi',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Nothing about the contents is read, which is what makes the validator cheap — and it means the ETag answers "is this the same inode as before", not "is this the same content as before". Worse, behind a load balancer two servers deployed a few seconds apart produce different ETags for the same bytes, so a client bouncing between them re-downloads on every alternation, forever, with nothing in your metrics saying why. Two fixes: content-hashed filenames (<code>app.4f9a2c.js</code>), so the URL changes when the content does and the ETag stops mattering; or preserve mtimes across deploys with <code>rsync -a</code> or a build that writes a stable timestamp. The first is better because it also lets you cache for a year.',
            'Không có gì thuộc về NỘI DUNG được đọc tới, và chính điều đó làm validator này rẻ — nhưng nó cũng có nghĩa ETag trả lời câu "có còn là cùng một inode như trước không", chứ không phải "có còn là cùng một nội dung như trước không". Tệ hơn, phía sau một bộ cân bằng tải, hai máy chủ deploy lệch nhau vài giây sẽ cho hai ETag khác nhau cho CÙNG một mớ byte, nên một client nhảy qua nhảy lại giữa chúng sẽ tải lại ở mỗi lần đổi, mãi mãi, mà chẳng có số đo nào của bạn nói vì sao. Hai cách sửa: đặt tên tệp kèm băm nội dung (<code>app.4f9a2c.js</code>) để URL đổi khi nội dung đổi và ETag hết còn quan trọng; hoặc giữ nguyên mtime qua các lần deploy bằng <code>rsync -a</code> hay một bản dựng ghi dấu thời gian cố định. Cách đầu hay hơn vì nó còn cho phép bạn cache cả một năm.',
          ),
        }),

        // q4 · đáp án 0
        mcq({
          prompt: B(
            'One location, two directives, measured on nginx/1.27.5.' + code(
              'location /hai/ {\n' +
              '  expires 1y;\n' +
              '  add_header Cache-Control "public, max-age=31536000, immutable" always;\n' +
              '}\n' +
              '\n' +
              '$ curl -sI http://edge/hai/a.js\n' +
              'Expires: Fri, 10 Sep 2027 01:19:09 GMT\n' +
              'Cache-Control: max-age=31536000\n' +
              'Cache-Control: public, max-age=31536000, immutable',
            ) + 'What happened, and what should be written instead?',
            'Một khối location, hai chỉ thị, đo trên nginx/1.27.5.' + code(
              'location /hai/ {\n' +
              '  expires 1y;\n' +
              '  add_header Cache-Control "public, max-age=31536000, immutable" always;\n' +
              '}\n' +
              '\n' +
              '$ curl -sI http://edge/hai/a.js\n' +
              'Expires: Fri, 10 Sep 2027 01:19:09 GMT\n' +
              'Cache-Control: max-age=31536000\n' +
              'Cache-Control: public, max-age=31536000, immutable',
            ) + 'Chuyện gì đã xảy ra, và đáng lẽ phải viết thế nào?',
          ),
          options: [
            B(
              'TWO Cache-Control headers went out — they come from different modules and do not merge; keep only the <code>add_header</code>, because <code>immutable</code> is the part that matters and <code>expires</code> cannot express it',
              'HAI dòng Cache-Control cùng đi ra — chúng tới từ hai module khác nhau và KHÔNG hợp nhất; hãy giữ lại đúng dòng <code>add_header</code>, vì <code>immutable</code> mới là phần quan trọng mà <code>expires</code> không diễn đạt nổi',
            ),
            B(
              'Nginx merged the two values into one header and printed it twice for readability in the <code>curl -I</code> output only',
              'Nginx đã hợp nhất hai giá trị thành một header rồi in ra hai lần chỉ để dễ đọc trong kết quả <code>curl -I</code>',
            ),
            B(
              'The <code>always</code> keyword duplicated the header, and removing it leaves exactly one Cache-Control line',
              'Từ khoá <code>always</code> làm nhân đôi header, bỏ nó đi là còn đúng một dòng Cache-Control',
            ),
            B(
              'This is the documented way to serve both an HTTP/1.0 and an HTTP/1.1 cache directive, and clients read the one matching their version',
              'Đây là cách chính thống để gửi cùng lúc một chỉ thị cache cho HTTP/1.0 và một cho HTTP/1.1, client đọc cái khớp với phiên bản của nó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two modules, neither aware of the other: <code>expires</code> writes <code>Expires</code> plus its own <code>Cache-Control</code>, and <code>add_header</code> writes another. Clients pick one, and which one is not something you want to depend on. Use <code>expires</code> alone, or drop it and write the header yourself — never both. For hashed assets the second is correct, because <code>immutable</code> is what turns a 304 round trip into no request at all, and on a page with forty assets that is the difference you can feel. And HTML gets the opposite treatment: <code>no-cache</code>, so a visitor never keeps loading an old page that points at old asset URLs.',
            'Hai module, chẳng cái nào biết cái kia: <code>expires</code> ghi ra <code>Expires</code> cộng một <code>Cache-Control</code> của riêng nó, còn <code>add_header</code> ghi ra một cái nữa. Client tự chọn một, và bạn không nên phụ thuộc vào chuyện nó chọn cái nào. Hãy dùng MỘT MÌNH <code>expires</code>, hoặc bỏ nó đi và tự viết header — đừng bao giờ dùng cả hai. Với tài nguyên có băm tên thì cách thứ hai mới đúng, vì <code>immutable</code> là thứ biến một vòng đi-về 304 thành KHÔNG có request nào cả, và trên một trang có bốn mươi tài nguyên thì đó là khác biệt cảm nhận được. Còn HTML thì ngược lại hoàn toàn: <code>no-cache</code>, để khách không cứ nạp mãi một trang cũ trỏ vào những URL tài nguyên cũ.',
          ),
        }),

        // q5 · đáp án 2
        mcq({
          prompt: B(
            'The same header written two ways, probed on a path that exists and one that does not. Measured on nginx/1.27.5.' + code(
              '# khoi A:  add_header Cache-Control "public, max-age=31536000, immutable" always;\n' +
              '  200 -> Cache-Control: public, max-age=31536000, immutable\n' +
              '  404 -> Cache-Control: public, max-age=31536000, immutable\n' +
              '\n' +
              '# khoi B:  add_header Cache-Control "public, max-age=31536000, immutable";\n' +
              '  200 -> Cache-Control: public, max-age=31536000, immutable\n' +
              '  404 -> (khong co dong Cache-Control nao)',
            ) + 'Which block is the bug, and what does it cost?',
            'Cùng một header viết theo hai cách, dò trên một đường dẫn CÓ thật và một đường dẫn KHÔNG có. Đo trên nginx/1.27.5.' + code(
              '# khoi A:  add_header Cache-Control "public, max-age=31536000, immutable" always;\n' +
              '  200 -> Cache-Control: public, max-age=31536000, immutable\n' +
              '  404 -> Cache-Control: public, max-age=31536000, immutable\n' +
              '\n' +
              '# khoi B:  add_header Cache-Control "public, max-age=31536000, immutable";\n' +
              '  200 -> Cache-Control: public, max-age=31536000, immutable\n' +
              '  404 -> (khong co dong Cache-Control nao)',
            ) + 'Khối nào là con lỗi, và nó tốn cái gì?',
          ),
          options: [
            B(
              'Block B — without <code>always</code> the header is unreliable, and a missing Cache-Control makes browsers cache by heuristic for even longer',
              'Khối B — thiếu <code>always</code> thì header không đáng tin, và không có Cache-Control lại làm trình duyệt tự suy đoán rồi cache còn lâu hơn',
            ),
            B(
              'Neither: a 404 body is never cached by a browser, so the header on it has no effect at all',
              'Không khối nào cả: thân của một cú 404 thì trình duyệt không bao giờ cache, nên header trên đó chẳng có tác dụng gì',
            ),
            B(
              'Block A — <code>always</code> means "on every response including errors", so a browser that requests a hashed asset during a partial deploy caches the 404 for a year and no later deploy can fix it',
              'Khối A — <code>always</code> nghĩa là "trên MỌI phản hồi, kể cả lỗi", nên một trình duyệt xin một tài nguyên có băm tên ngay giữa lúc deploy dở sẽ cache cú 404 đó suốt một năm và không lần deploy nào sau đó chữa được',
            ),
            B(
              'Block A — <code>always</code> is invalid on <code>Cache-Control</code> and makes <code>nginx -t</code> emit a warning that is easy to miss',
              'Khối A — <code>always</code> không hợp lệ với <code>Cache-Control</code> và làm <code>nginx -t</code> phát một cảnh báo rất dễ bỏ sót',
            ),
          ],
          correct: 2,
          explanation: EX(
            'That user\'s site stays broken until they clear their cache, and no deploy can reach them because the browser will not ask again. The rule is short: <code>always</code> belongs on SECURITY headers — HSTS, <code>X-Content-Type-Options</code>, <code>X-Frame-Options</code> — which must apply to error pages too, and it must NOT be on <code>Cache-Control</code>, where it caches your failures. The general habit behind it is worth more than the rule: when you review a static config, request one path that does not exist in each location and read the headers. Anything cached, anything leaking, anything with the wrong status is easier to see on the failure path than on the happy one.',
            'Site của người dùng đó hỏng cho tới khi họ tự xoá bộ đệm, và không lần deploy nào với tới họ được vì trình duyệt sẽ không hỏi lại nữa. Luật thì ngắn: <code>always</code> thuộc về các header BẢO MẬT — HSTS, <code>X-Content-Type-Options</code>, <code>X-Frame-Options</code> — những thứ phải áp cả lên trang lỗi, và nó KHÔNG được đặt trên <code>Cache-Control</code>, chỗ mà nó đi cache luôn cái hỏng của bạn. Cái thói quen đằng sau còn đáng giá hơn cái luật: khi rà một cấu hình tĩnh, hãy gọi thử MỘT đường dẫn KHÔNG tồn tại trong từng khối location rồi đọc header. Thứ gì bị cache, thứ gì rò ra, thứ gì sai mã trạng thái — nhìn ở nhánh HỎNG dễ thấy hơn nhìn ở nhánh chạy tốt.',
          ),
        }),

        // q6 · đáp án 1
        mcq({
          prompt: B(
            'The same 5.406-byte file served three ways on nginx/1.27.5, with a <code>.gz</code> built by <code>gzip -9</code> sitting beside it.' + code(
              'khong nen              Content-Length: 5406   ETag: "6aa20570-151e"\n' +
              'gzip TAI CHO (muc 5)   (khong co Content-Length)\n' +
              '                       ETag: W/"6aa20570-151e"   Content-Encoding: gzip\n' +
              '                       than tra ve: 4172 byte\n' +
              'gzip_static (tep .gz)  Content-Length: 4143   ETag: "6aa20570-102f"\n' +
              '                       Content-Encoding: gzip',
            ) + 'What explains the three differences?',
            'Cùng một tệp 5.406 byte phục vụ theo ba cách trên nginx/1.27.5, có sẵn một tệp <code>.gz</code> dựng bằng <code>gzip -9</code> nằm bên cạnh.' + code(
              'khong nen              Content-Length: 5406   ETag: "6aa20570-151e"\n' +
              'gzip TAI CHO (muc 5)   (khong co Content-Length)\n' +
              '                       ETag: W/"6aa20570-151e"   Content-Encoding: gzip\n' +
              '                       than tra ve: 4172 byte\n' +
              'gzip_static (tep .gz)  Content-Length: 4143   ETag: "6aa20570-102f"\n' +
              '                       Content-Encoding: gzip',
            ) + 'Cái gì giải thích được cả ba khác biệt?',
          ),
          options: [
            B(
              'On-the-fly gzip uses a different hash function for the ETag, and the pre-built file happens to compress better because gzip is deterministic',
              'Nén tại chỗ dùng một hàm băm khác cho ETag, còn tệp dựng sẵn nén tốt hơn vì gzip có tính tất định',
            ),
            B(
              'On-the-fly compression cannot know the size until it finishes, so the response is chunked and the ETag is marked WEAK; <code>gzip_static</code> is just an ordinary file, so it keeps a real length and a strong ETag computed from the <code>.gz</code> inode — and it is smaller because a build had time for level 9',
              'Nén tại chỗ không biết được kích thước cho tới lúc nén xong, nên phản hồi đi dạng chunked và ETag bị đánh dấu YẾU; còn <code>gzip_static</code> chỉ là một tệp bình thường nên giữ được độ dài thật và một ETag MẠNH tính từ inode của chính tệp <code>.gz</code> — và nó nhỏ hơn vì lượt dựng có thời gian để nén mức 9',
            ),
            B(
              'The weak ETag means the response was truncated, and <code>Content-Length</code> is omitted because the body no longer matches the file on disk',
              'ETag yếu nghĩa là phản hồi bị cắt cụt, và <code>Content-Length</code> bị bỏ đi vì thân trả về không còn khớp tệp trên đĩa',
            ),
            B(
              '<code>gzip_static</code> disables compression and simply serves the smaller of the two files, which is why its headers look like an uncompressed response',
              '<code>gzip_static</code> tắt nén rồi phục vụ tệp nào nhỏ hơn trong hai tệp, nên header của nó trông như một phản hồi chưa nén',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Three separate consequences of the same fact. A weak validator (<code>W/</code>) still works for a 304 but cannot be used for range requests, which is one reason ranges and on-the-fly gzip do not combine. A missing <code>Content-Length</code> means no progress bar and no length for any intermediary that wanted one. And the size difference goes the pleasant way: the pre-built file was compressed at level 9 by a tool with time to spare, so you get better compression AND lower per-request cost — Nginx is doing one more <code>open()</code> instead of running a compressor. Do not compress what is already compressed, though: JPEG, PNG, MP4, WebP and WOFF2 come out very slightly larger, which is why they are absent from the default <code>gzip_types</code>.',
            'Ba hệ quả riêng biệt của cùng một sự thật. Một validator YẾU (<code>W/</code>) vẫn dùng được cho 304 nhưng không dùng được cho request theo dải, và đó là một lý do khiến dải byte với gzip tại chỗ không đi cùng nhau. Thiếu <code>Content-Length</code> nghĩa là không có thanh tiến trình và không có độ dài cho bất kỳ trung gian nào cần tới. Còn khác biệt kích thước thì nghiêng về phía dễ chịu: tệp dựng sẵn được nén mức 9 bởi một công cụ dư thời gian, nên bạn vừa được nén tốt hơn VỪA rẻ hơn ở mỗi request — Nginx chỉ tốn thêm một lệnh <code>open()</code> thay vì chạy cả một bộ nén. Nhưng đừng nén thứ đã nén rồi: JPEG, PNG, MP4, WebP và WOFF2 nén ra còn to hơn một chút, và đó là lý do chúng vắng mặt trong <code>gzip_types</code> mặc định.',
          ),
        }),

        // q7 · đáp án 3
        mcq({
          prompt: B(
            'A deploy deletes a leaked document from disk and reports success, but the file keeps being served for another twenty seconds. <code>open_file_cache_valid 30s;</code> is set. What is happening?',
            'Một lần deploy xoá khỏi đĩa một tài liệu bị rò rỉ và báo thành công, nhưng tệp đó vẫn được phục vụ thêm hai mươi giây nữa. Cấu hình có <code>open_file_cache_valid 30s;</code>. Chuyện gì đang xảy ra?',
          ),
          options: [
            B(
              'The response was served from <code>proxy_cache</code>, which is unaffected by a file deletion and must be purged separately',
              'Phản hồi được phục vụ từ <code>proxy_cache</code>, thứ không bị ảnh hưởng bởi việc xoá tệp và phải được xoá riêng',
            ),
            B(
              '<code>open_file_cache</code> keeps the file CONTENTS in shared memory, so the bytes survive the deletion until the entry is evicted',
              '<code>open_file_cache</code> giữ NỘI DUNG tệp trong bộ nhớ dùng chung, nên mớ byte đó sống sót qua lệnh xoá cho tới khi mục cache bị đẩy đi',
            ),
            B(
              'The deletion did not take effect because the worker holds a write lock on the file, and the unlink is deferred by the kernel',
              'Lệnh xoá chưa có hiệu lực vì worker đang giữ khoá ghi trên tệp, và nhân hệ điều hành hoãn thao tác unlink lại',
            ),
            B(
              '<code>open_file_cache</code> caches the open DESCRIPTOR and the stat result; on Unix a descriptor stays valid after <code>unlink</code>, so the data is still readable until the entry is revalidated — reload after an urgent deletion',
              '<code>open_file_cache</code> cache cái DESCRIPTOR đang mở và kết quả stat; trên Unix một descriptor vẫn hợp lệ sau lệnh <code>unlink</code>, nên dữ liệu vẫn đọc được cho tới khi mục cache được kiểm lại — hãy reload sau một lần xoá khẩn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'What it caches is the per-request bookkeeping, not the bytes: the descriptor, the stat result, and the fact that a path does or does not exist. The data itself still comes from the kernel page cache, which was already handling that. Where it pays is many requests for many small files — a page pulling forty assets does forty opens and forty stats per visitor without it, and syscalls are where a static server\'s time actually goes. The cost is exactly this staleness window, which is also why a deploy that replaces files can briefly serve the old ones. A reload replaces the workers and their caches with them, which is why the standard deploy script does one.',
            'Thứ nó cache là phần sổ sách của mỗi request, không phải mớ byte: cái descriptor, kết quả stat, và cái sự thật rằng một đường dẫn có tồn tại hay không. Bản thân dữ liệu vẫn tới từ page cache của nhân, thứ vốn đã lo việc đó rồi. Chỗ nó đáng tiền là khi có nhiều request tới nhiều tệp nhỏ — một trang kéo bốn mươi tài nguyên thì tốn bốn mươi lần mở và bốn mươi lần stat cho mỗi khách nếu không có nó, mà syscall mới là chỗ thời gian của một máy chủ tĩnh thật sự trôi vào. Cái giá đúng là cửa sổ cũ kỹ này, và nó cũng là lý do một lần deploy thay tệp có thể phục vụ bản cũ trong chốc lát. Một lệnh reload thay luôn đám worker cùng bộ nhớ đệm của chúng, và đó là lý do script deploy chuẩn luôn có một lệnh như vậy.',
          ),
        }),

        // q8 · đáp án 0
        mcq({
          prompt: B(
            'Two range requests against the same 200.000-byte file, measured on nginx/1.27.5.' + code(
              '$ curl -sI -H "Range: bytes=0-99" /lon.bin\n' +
              'HTTP/1.1 206 Partial Content\n' +
              'Content-Length: 100\n' +
              'Content-Range: bytes 0-99/200000\n' +
              '\n' +
              '$ curl -sI -H "Range: bytes=0-99" -H "Accept-Encoding: gzip" /lon.bin   # gzip DANG BAT\n' +
              'HTTP/1.1 206 Partial Content\n' +
              'Content-Range: bytes 0-99/200000\n' +
              '(KHONG co Content-Encoding: gzip)',
            ) + 'What does the second row show?',
            'Hai request theo dải vào cùng một tệp 200.000 byte, đo trên nginx/1.27.5.' + code(
              '$ curl -sI -H "Range: bytes=0-99" /lon.bin\n' +
              'HTTP/1.1 206 Partial Content\n' +
              'Content-Length: 100\n' +
              'Content-Range: bytes 0-99/200000\n' +
              '\n' +
              '$ curl -sI -H "Range: bytes=0-99" -H "Accept-Encoding: gzip" /lon.bin   # gzip DANG BAT\n' +
              'HTTP/1.1 206 Partial Content\n' +
              'Content-Range: bytes 0-99/200000\n' +
              '(KHONG co Content-Encoding: gzip)',
            ) + 'Dòng thứ hai cho thấy điều gì?',
          ),
          options: [
            B(
              'Ranges and on-the-fly compression do not combine: a gzipped body has no stable mapping from byte offsets to original content, so Nginx served the range uncompressed',
              'Dải byte và nén tại chỗ KHÔNG đi cùng nhau: một thân đã gzip thì không có ánh xạ ổn định từ vị trí byte về nội dung gốc, nên Nginx phục vụ dải đó ở dạng chưa nén',
            ),
            B(
              'The client forgot to send <code>Accept-Ranges</code>, which is what actually enables compression on a partial response',
              'Client quên gửi <code>Accept-Ranges</code>, mà chính header đó mới là thứ bật nén trên một phản hồi từng phần',
            ),
            B(
              'The 100-byte slice fell below <code>gzip_min_length</code>, and raising that threshold would make both rows carry <code>Content-Encoding</code>',
              'Lát cắt 100 byte rơi xuống dưới <code>gzip_min_length</code>, và hạ ngưỡng đó xuống là cả hai dòng đều có <code>Content-Encoding</code>',
            ),
            B(
              '<code>.bin</code> is not in <code>gzip_types</code>, so compression was never going to apply and the range is irrelevant to the result',
              '<code>.bin</code> không nằm trong <code>gzip_types</code> nên nén vốn dĩ không áp dụng, và chuyện dải byte chẳng liên quan gì tới kết quả',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Ranges are what make video seeking and resumable downloads work at all: a browser scrubbing a video asks for the segment it needs instead of downloading a 200 MB file from the start every time. Nginx advertises the capability with <code>Accept-Ranges: bytes</code> on ordinary static responses and it is on by default. It is also one more quiet argument for <code>gzip_static</code>: a pre-compressed file is still just a file, so it keeps a real length, a strong ETag and range support, while on-the-fly compression gives up all three. Large media is served uncompressed anyway, because it is already compressed.',
            'Dải byte chính là thứ làm cho việc tua video và tải tiếp sau khi đứt kết nối chạy được: một trình duyệt kéo thanh tua sẽ xin đúng đoạn nó cần thay vì tải một tệp 200 MB từ đầu mỗi lần. Nginx quảng cáo khả năng đó bằng <code>Accept-Ranges: bytes</code> trên các phản hồi tĩnh thông thường và nó bật sẵn. Đây cũng là thêm một lý lẽ lặng lẽ cho <code>gzip_static</code>: một tệp nén sẵn thì vẫn chỉ là một cái tệp, nên nó giữ được độ dài thật, ETag mạnh và hỗ trợ dải byte, trong khi nén tại chỗ vứt bỏ cả ba. Dù sao thì media lớn cũng luôn phục vụ ở dạng chưa nén, vì bản thân nó đã nén rồi.',
          ),
        }),

        /* ── Chương 5 — bộ đệm trước ứng dụng (8 câu) ───────────────────── */

        // q9 · đáp án 1
        mcq({
          prompt: B(
            'A cache store is declared like this. Which line does what?' + code(
              'proxy_cache_path /var/cache/nginx\n' +
              '  levels=1:2\n' +
              '  keys_zone=kho:10m\n' +
              '  max_size=10g\n' +
              '  inactive=60m;',
            ),
            'Một kho bộ đệm được khai như sau. Dòng nào làm việc gì?' + code(
              'proxy_cache_path /var/cache/nginx\n' +
              '  levels=1:2\n' +
              '  keys_zone=kho:10m\n' +
              '  max_size=10g\n' +
              '  inactive=60m;',
            ),
          ),
          options: [
            B(
              '<code>keys_zone</code> is the disk budget and <code>max_size</code> is the memory budget; <code>inactive</code> is the freshness lifetime for every entry',
              '<code>keys_zone</code> là hạn mức ĐĨA còn <code>max_size</code> là hạn mức BỘ NHỚ; <code>inactive</code> là thời hạn tươi của mọi mục',
            ),
            B(
              '<code>keys_zone</code> is shared MEMORY holding the key index, <code>max_size</code> is the DISK cap for the bodies, and <code>inactive</code> means "delete if nobody asked for this in that long" — which is not a TTL',
              '<code>keys_zone</code> là BỘ NHỚ dùng chung giữ chỉ mục khoá, <code>max_size</code> là trần ĐĨA cho phần thân, còn <code>inactive</code> nghĩa là "xoá nếu suốt chừng ấy không ai hỏi tới" — chứ không phải một TTL',
            ),
            B(
              '<code>levels=1:2</code> sets how many times a stale entry may be revalidated before it is dropped from the store',
              '<code>levels=1:2</code> đặt số lần một mục đã cũ được kiểm lại trước khi bị loại khỏi kho',
            ),
            B(
              'All four are optional tuning knobs; only the path matters, and Nginx sizes the rest from the available disk at startup',
              'Cả bốn đều là nút chỉnh tuỳ chọn; chỉ có đường dẫn là quan trọng, còn lại Nginx tự tính theo dung lượng đĩa lúc khởi động',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The zone holds the key index and metadata in shared memory — roughly 8.000 keys per megabyte — while the bodies live on disk under <code>max_size</code>. Running out of ZONE evicts entries even when there is disk to spare, so size the zone for your number of distinct URLs rather than for your content size. <code>inactive</code> is independent of freshness: an entry can be stale and still present because it is popular, or fresh and deleted because nobody wanted it. Freshness is <code>proxy_cache_valid</code>. And <code>levels=</code> exists purely because of the filesystem: without it every cached body lands in one directory, and a directory with a million entries is slow for everything, including the cleanup process.',
            'Vùng zone giữ chỉ mục khoá và siêu dữ liệu trong bộ nhớ dùng chung — cỡ 8.000 khoá mỗi megabyte — còn phần thân nằm trên đĩa dưới trần <code>max_size</code>. Hết ZONE thì các mục bị đẩy đi kể cả khi đĩa còn thừa, nên hãy tính vùng zone theo SỐ URL khác nhau chứ đừng tính theo dung lượng nội dung. <code>inactive</code> độc lập với chuyện tươi hay cũ: một mục có thể đã cũ mà vẫn còn đó vì nó đắt khách, hoặc còn tươi mà bị xoá vì chẳng ai thèm. Tươi hay cũ là chuyện của <code>proxy_cache_valid</code>. Còn <code>levels=</code> tồn tại thuần vì hệ tệp: không có nó thì mọi thân phản hồi rơi vào MỘT thư mục, mà một thư mục cả triệu mục thì chậm với mọi thao tác, kể cả tiến trình dọn dẹp.',
          ),
        }),

        // q10 · đáp án 2
        mcq({
          prompt: B(
            'Four upstream behaviours against one cached location, measured with an upstream that counts its own calls. <code>proxy_cache_valid 200 10s;</code> and nothing else.' + code(
              'upstream tra Set-Cookie          lan 1 MISS   lan 2 MISS\n' +
              'upstream tra Cache-Control: private  lan 1 MISS   lan 2 MISS\n' +
              'upstream tra 500                 lan 1 MISS   lan 2 MISS\n' +
              'GET binh thuong                  lan 1 MISS   lan 2 HIT\n' +
              'HEAD cung URL do                 HIT\n' +
              'POST cung URL do                 (bien $upstream_cache_status KHONG duoc dat)',
            ) + 'Which reading is correct?',
            'Bốn kiểu hành xử của upstream trên cùng một khối có bộ đệm, đo bằng một upstream tự đếm số lần bị gọi. Chỉ có <code>proxy_cache_valid 200 10s;</code> và không gì khác.' + code(
              'upstream tra Set-Cookie          lan 1 MISS   lan 2 MISS\n' +
              'upstream tra Cache-Control: private  lan 1 MISS   lan 2 MISS\n' +
              'upstream tra 500                 lan 1 MISS   lan 2 MISS\n' +
              'GET binh thuong                  lan 1 MISS   lan 2 HIT\n' +
              'HEAD cung URL do                 HIT\n' +
              'POST cung URL do                 (bien $upstream_cache_status KHONG duoc dat)',
            ) + 'Cách đọc nào ĐÚNG?',
          ),
          options: [
            B(
              'Those first three were cached but immediately evicted, which is why the second request shows MISS rather than HIT',
              'Ba ca đầu CÓ được cache nhưng bị đẩy đi ngay, nên request thứ hai hiện MISS chứ không hiện HIT',
            ),
            B(
              'Only the method matters: Nginx caches GET and refuses everything else, and the three upstream headers are irrelevant to the decision',
              'Chỉ có PHƯƠNG THỨC là quan trọng: Nginx cache GET và từ chối mọi thứ khác, ba cái header của upstream không liên quan tới quyết định đó',
            ),
            B(
              'Nginx refuses to store a response carrying <code>Set-Cookie</code> or <code>Cache-Control: private</code>, stores only the statuses named in <code>proxy_cache_valid</code>, and caches only GET and HEAD — HEAD reusing the GET entry',
              'Nginx từ chối cất một phản hồi mang <code>Set-Cookie</code> hoặc <code>Cache-Control: private</code>, chỉ cất những mã trạng thái được nêu tên trong <code>proxy_cache_valid</code>, và chỉ cache GET với HEAD — trong đó HEAD dùng lại chính mục của GET',
            ),
            B(
              'The 500 row proves errors are never cacheable in Nginx, and the other three rows are all consequences of that same rule',
              'Dòng 500 chứng minh Nginx không bao giờ cache được lỗi, còn ba dòng kia đều là hệ quả của cùng luật ấy',
            ),
          ],
          correct: 2,
          explanation: EX(
            'These defaults do a lot of quiet work: the <code>Set-Cookie</code> rule is why a login endpoint you forgot to exclude does not become a disaster, and <code>Cache-Control: private</code> is the mechanism your application SHOULD be using — one header on the responses that carry personal data. Caching errors briefly (<code>proxy_cache_valid 500 502 503 504 1s;</code>) is a real technique for shielding a struggling backend, but it has to be deliberate. And note the POST row: the variable is not even set, so a log format printing <code>$upstream_cache_status</code> shows an empty field rather than a word — worth knowing before you write an awk over it.',
            'Những giá trị mặc định này làm rất nhiều việc trong im lặng: luật <code>Set-Cookie</code> chính là lý do một endpoint đăng nhập mà bạn quên loại trừ lại không thành thảm hoạ, còn <code>Cache-Control: private</code> mới là cơ chế mà ứng dụng của bạn NÊN dùng — một header trên những phản hồi mang dữ liệu cá nhân. Cache lỗi trong thời gian ngắn (<code>proxy_cache_valid 500 502 503 504 1s;</code>) là một kỹ thuật thật để che chắn một backend đang đuối, nhưng phải làm có chủ ý. Và để ý dòng POST: biến đó thậm chí không được đặt, nên một khuôn log in <code>$upstream_cache_status</code> sẽ hiện một ô RỖNG chứ không hiện chữ nào — đáng biết trước khi bạn viết awk lên nó.',
          ),
        }),

        // q11 · đáp án 3
        mcq({
          prompt: B(
            'One URL, one cached location, three requests in a row. The upstream returns per-user content and sets no <code>Cache-Control</code>. Measured on nginx/1.27.5.' + code(
              '1. nguoi dung A (co token)  MISS  HO SO CUA: Bearer TOKEN-CUA-A (upstream thu 12)\n' +
              '2. khach VANG LAI           HIT   HO SO CUA: Bearer TOKEN-CUA-A (upstream thu 12)\n' +
              '3. nguoi dung B (token khac) HIT  HO SO CUA: Bearer TOKEN-CUA-A (upstream thu 12)',
            ) + 'Why did this happen?',
            'Một URL, một khối có bộ đệm, ba request liên tiếp. Upstream trả về nội dung riêng của từng người và KHÔNG đặt <code>Cache-Control</code>. Đo trên nginx/1.27.5.' + code(
              '1. nguoi dung A (co token)  MISS  HO SO CUA: Bearer TOKEN-CUA-A (upstream thu 12)\n' +
              '2. khach VANG LAI           HIT   HO SO CUA: Bearer TOKEN-CUA-A (upstream thu 12)\n' +
              '3. nguoi dung B (token khac) HIT  HO SO CUA: Bearer TOKEN-CUA-A (upstream thu 12)',
            ) + 'Vì sao lại như vậy?',
          ),
          options: [
            B(
              'The token was part of the cache key, and rows 2 and 3 collided with row 1 because the hash of an absent token is the same as any other',
              'Cái token có nằm trong khoá bộ đệm, và dòng 2 với dòng 3 đụng độ với dòng 1 vì băm của một token vắng mặt trùng với băm của mọi token khác',
            ),
            B(
              'Nginx cached the response because the request was a GET, and a GET is by definition public regardless of what headers it carried',
              'Nginx cache phản hồi đó vì request là GET, mà GET thì theo định nghĩa là công khai bất kể nó mang header gì',
            ),
            B(
              'The upstream was at fault only: with correct code the same three requests would have produced three MISSes and three different bodies',
              'Chỉ upstream có lỗi: nếu mã đúng thì đúng ba request đó đã cho ra ba cú MISS và ba thân phản hồi khác nhau',
            ),
            B(
              '<code>Authorization</code> is neither part of the default cache key nor a reason to skip caching, so a personal response with no <code>Cache-Control</code> was stored and then handed to everybody',
              '<code>Authorization</code> vừa KHÔNG nằm trong khoá bộ đệm mặc định vừa KHÔNG phải lý do để bỏ qua việc cache, nên một phản hồi cá nhân không có <code>Cache-Control</code> đã bị cất rồi đem phát cho tất cả mọi người',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Nothing errored, nothing was logged as unusual, and the application returned correct data every time it was asked — it just stopped being asked. The failure is a collaboration: the application omitted <code>Cache-Control: private</code>, and the proxy had no way to know the response was personal. Fix it on both sides. In the application, every response carrying user data gets <code>Cache-Control: private, no-store</code>. In Nginx, add a belt. And the general rule that covers all of it: Nginx caches a response when nothing told it not to — silence is consent, and by default the cache takes it. Which is also why you cache by ALLOW-list on specific public locations, never at server level with exclusions.',
            'Không có lỗi nào, không có gì được ghi log là bất thường, và ứng dụng trả về dữ liệu đúng mỗi lần nó được hỏi — chỉ là nó thôi không còn được hỏi nữa. Cú hỏng này là một sự HỢP TÁC: ứng dụng quên <code>Cache-Control: private</code>, còn proxy thì không có cách nào biết phản hồi ấy là riêng tư. Hãy vá cả hai phía. Ở ứng dụng, mọi phản hồi mang dữ liệu người dùng đều phải có <code>Cache-Control: private, no-store</code>. Ở Nginx, thêm một cái đai an toàn. Và luật chung phủ hết mọi thứ: Nginx cache một phản hồi khi KHÔNG có gì bảo nó đừng — im lặng là đồng ý, và mặc định thì bộ đệm nhận lấy sự đồng ý đó. Cũng vì thế mà bạn nên cache theo danh sách CHO PHÉP trên đúng những khối công khai, đừng bao giờ bật ở tầng server rồi đi loại trừ.',
          ),
        }),

        // q12 · đáp án 0
        mcq({
          prompt: B(
            'The same URL after adding two directives, measured on nginx/1.27.5.' + code(
              'location /khoa/ {\n' +
              '  proxy_no_cache      $http_authorization;\n' +
              '  proxy_cache_bypass  $http_authorization;\n' +
              '}\n' +
              '\n' +
              '1. nguoi dung A (token A)  BYPASS  HO SO CUA: Bearer TOKEN-CUA-A\n' +
              '2. khach VANG LAI          MISS    HO SO CUA: KHACH\n' +
              '3. nguoi dung B (token B)  BYPASS  HO SO CUA: Bearer TOKEN-CUA-B\n' +
              '4. khach VANG LAI lan nua  HIT     HO SO CUA: KHACH',
            ) + 'Why are TWO directives needed?',
            'Vẫn URL đó sau khi thêm hai chỉ thị, đo trên nginx/1.27.5.' + code(
              'location /khoa/ {\n' +
              '  proxy_no_cache      $http_authorization;\n' +
              '  proxy_cache_bypass  $http_authorization;\n' +
              '}\n' +
              '\n' +
              '1. nguoi dung A (token A)  BYPASS  HO SO CUA: Bearer TOKEN-CUA-A\n' +
              '2. khach VANG LAI          MISS    HO SO CUA: KHACH\n' +
              '3. nguoi dung B (token B)  BYPASS  HO SO CUA: Bearer TOKEN-CUA-B\n' +
              '4. khach VANG LAI lan nua  HIT     HO SO CUA: KHACH',
            ) + 'Vì sao lại cần HAI chỉ thị?',
          ),
          options: [
            B(
              'They cover different halves: <code>proxy_no_cache</code> stops STORING, <code>proxy_cache_bypass</code> stops SERVING — with only the first, an authenticated user would still receive the anonymous copy sitting in the cache',
              'Chúng lo hai nửa khác nhau: <code>proxy_no_cache</code> chặn việc CẤT, <code>proxy_cache_bypass</code> chặn việc PHÁT — chỉ có cái đầu thì một người dùng đã đăng nhập vẫn nhận được bản vô danh đang nằm sẵn trong bộ đệm',
            ),
            B(
              'One applies to GET and the other to HEAD, and both are required because HEAD reuses the GET entry',
              'Một cái áp cho GET, cái kia áp cho HEAD, và cần cả hai vì HEAD dùng lại chính mục của GET',
            ),
            B(
              'The second is a deprecated alias of the first, kept for configs written before nginx 1.20 and harmless to omit',
              'Cái thứ hai là tên gọi cũ đã lỗi thời của cái thứ nhất, giữ lại cho các cấu hình viết trước nginx 1.20 và bỏ đi cũng vô hại',
            ),
            B(
              'Neither is needed once the application sends <code>Cache-Control: private</code>, and both exist only for backends nobody can change',
              'Chẳng cái nào cần thiết một khi ứng dụng đã gửi <code>Cache-Control: private</code>, và cả hai chỉ tồn tại cho những backend không ai sửa được',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Row 4 is the proof that the pair does the right thing rather than simply disabling the cache: the anonymous copy stored in row 2 was still there and still served. Both directives fire when ANY argument is non-empty and not the string <code>"0"</code>, so listing several variables means "if any of these is set" — and a missing header is an empty string, which is why <code>$http_authorization</code> works directly with no comparison. One more measured surprise worth carrying: a client CANNOT bust this cache. A request with <code>Cache-Control: no-cache</code> or <code>Pragma: no-cache</code> still came back HIT, because Nginx ignores client cache directives by default. A user pressing hard-refresh does not reach your application, which is usually right and is worth knowing when someone insists they cleared their cache.',
            'Dòng 4 là bằng chứng rằng cặp chỉ thị này làm ĐÚNG việc chứ không phải tắt béng bộ đệm đi: bản vô danh cất ở dòng 2 vẫn còn đó và vẫn được phát ra. Cả hai chỉ thị kích hoạt khi BẤT KỲ tham số nào khác rỗng và khác chuỗi <code>"0"</code>, nên liệt kê nhiều biến nghĩa là "nếu có bất kỳ cái nào được đặt" — và một header vắng mặt là chuỗi rỗng, đó là lý do <code>$http_authorization</code> dùng thẳng được, khỏi so sánh gì. Thêm một điều bất ngờ đã đo được đáng mang theo: client KHÔNG phá được bộ đệm này. Một request kèm <code>Cache-Control: no-cache</code> hay <code>Pragma: no-cache</code> vẫn trả về HIT, vì Nginx mặc định BỎ QUA các chỉ thị cache của client. Người dùng bấm tải lại thật mạnh cũng không chạm tới ứng dụng của bạn — chuyện đó thường là đúng, và đáng biết khi có ai một mực bảo họ đã xoá cache rồi.',
          ),
        }),

        // q13 · đáp án 1
        mcq({
          prompt: B(
            'Four timings against one cached URL, checked once a second until the status changed. Measured on nginx/1.27.5.' + code(
              'A) upstream im lang, proxy_cache_valid 200 10s\n' +
              '   t=0s MISS   t=3s HIT   t=6s HIT\n' +
              'B) upstream khai Cache-Control: max-age=2, cau hinh van 60s\n' +
              '   t=0s MISS   t=1s HIT   t=3s EXPIRED\n' +
              'C) nhu B, nhung them proxy_ignore_headers Cache-Control (cau hinh 10s)\n' +
              '   t=0s MISS   t=1s HIT   t=3s HIT   t=7s HIT\n' +
              'D) upstream khai X-Accel-Expires: 2 VA Cache-Control: max-age=600\n' +
              '   t=0s MISS   t=1s HIT   t=3s EXPIRED\n' +
              '   client co thay X-Accel-Expires? KHONG — Nginx lot no ra.',
            ) + 'What is the precedence order?',
            'Bốn phép bấm giờ trên cùng một URL đã cache, gọi lại mỗi giây cho tới khi trạng thái đổi. Đo trên nginx/1.27.5.' + code(
              'A) upstream im lang, proxy_cache_valid 200 10s\n' +
              '   t=0s MISS   t=3s HIT   t=6s HIT\n' +
              'B) upstream khai Cache-Control: max-age=2, cau hinh van 60s\n' +
              '   t=0s MISS   t=1s HIT   t=3s EXPIRED\n' +
              'C) nhu B, nhung them proxy_ignore_headers Cache-Control (cau hinh 10s)\n' +
              '   t=0s MISS   t=1s HIT   t=3s HIT   t=7s HIT\n' +
              'D) upstream khai X-Accel-Expires: 2 VA Cache-Control: max-age=600\n' +
              '   t=0s MISS   t=1s HIT   t=3s EXPIRED\n' +
              '   client co thay X-Accel-Expires? KHONG — Nginx lot no ra.',
            ) + 'Thứ tự ưu tiên là gì?',
          ),
          options: [
            B(
              '<code>proxy_cache_valid</code> always wins, and rows B and D are the upstream shortening an already-expired entry',
              '<code>proxy_cache_valid</code> luôn thắng, còn dòng B với D là upstream rút ngắn một mục vốn đã hết hạn',
            ),
            B(
              '<code>X-Accel-Expires</code>, then the upstream\'s <code>Cache-Control</code>/<code>Expires</code>, then <code>proxy_cache_valid</code> — and <code>proxy_ignore_headers</code> deletes whichever of those you name from the chain',
              '<code>X-Accel-Expires</code>, rồi tới <code>Cache-Control</code>/<code>Expires</code> của upstream, rồi mới tới <code>proxy_cache_valid</code> — và <code>proxy_ignore_headers</code> xoá khỏi chuỗi đúng cái mà bạn nêu tên',
            ),
            B(
              'Whichever value is SMALLER wins, which is why row D expired at 2 seconds rather than at 600',
              'Giá trị nào NHỎ hơn thì thắng, và đó là lý do dòng D hết hạn ở 2 giây chứ không phải 600',
            ),
            B(
              'The upstream headers only apply to the browser; Nginx always uses <code>proxy_cache_valid</code>, and rows B and D differ because of the status code',
              'Header của upstream chỉ áp cho trình duyệt; Nginx luôn dùng <code>proxy_cache_valid</code>, còn dòng B với D khác nhau là do mã trạng thái',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Row A is the default case: think of <code>proxy_cache_valid</code> as the fallback for backends that say nothing, not as "the setting". Row B is the right default — the service that produced the data knows how long it is good for. Row D shows the private channel from the application to Nginx: <code>X-Accel-Expires</code> takes seconds, or <code>@</code> for an absolute time, or <code>0</code> to refuse caching, and Nginx strips it so the browser never sees it. That is the cleanest way to say "shared cache yes, private cache no": send <code>X-Accel-Expires: 600</code> alongside <code>Cache-Control: no-cache</code> and each layer obeys the one meant for it.',
            'Dòng A là ca mặc định: hãy coi <code>proxy_cache_valid</code> là đường LUI dành cho những backend chẳng nói gì, chứ đừng coi nó là "cái thiết lập". Dòng B là mặc định ĐÚNG — cái dịch vụ sinh ra dữ liệu thì biết dữ liệu đó dùng được bao lâu. Dòng D cho thấy cái kênh riêng từ ứng dụng tới Nginx: <code>X-Accel-Expires</code> nhận số giây, hoặc <code>@</code> cho một mốc tuyệt đối, hoặc <code>0</code> để từ chối cache, và Nginx LỘT nó ra nên trình duyệt không bao giờ thấy. Đó là cách gọn nhất để nói "bộ đệm dùng chung thì có, bộ đệm riêng thì không": gửi <code>X-Accel-Expires: 600</code> kèm <code>Cache-Control: no-cache</code>, rồi mỗi tầng tuân theo đúng cái dành cho nó.',
          ),
        }),

        // q14 · đáp án 2
        mcq({
          prompt: B(
            'The same directive from row C, pointed at an endpoint whose upstream sends <code>Cache-Control: private</code>. Measured on nginx/1.27.5.' + code(
              'location /bqua/ {\n' +
              '  proxy_cache kho;\n' +
              '  proxy_cache_valid 200 10s;\n' +
              '  proxy_ignore_headers Cache-Control;\n' +
              '}\n' +
              '\n' +
              'upstream tra Cache-Control: private\n' +
              '  lan 1 MISS\n' +
              '  lan 2 HIT      <- da bi CACHE',
            ) + 'What is the lesson?',
            'Vẫn chỉ thị ở dòng C, lần này trỏ vào một endpoint mà upstream gửi <code>Cache-Control: private</code>. Đo trên nginx/1.27.5.' + code(
              'location /bqua/ {\n' +
              '  proxy_cache kho;\n' +
              '  proxy_cache_valid 200 10s;\n' +
              '  proxy_ignore_headers Cache-Control;\n' +
              '}\n' +
              '\n' +
              'upstream tra Cache-Control: private\n' +
              '  lan 1 MISS\n' +
              '  lan 2 HIT      <- da bi CACHE',
            ) + 'Bài học ở đây là gì?',
          ),
          options: [
            B(
              '<code>private</code> was never a caching directive for a proxy, so nothing was lost and the second row is the expected behaviour',
              '<code>private</code> vốn chưa bao giờ là một chỉ thị cache dành cho proxy, nên chẳng mất gì và dòng thứ hai là hành vi đúng như trông đợi',
            ),
            B(
              'The endpoint would have been cached anyway; <code>proxy_ignore_headers</code> only changes the lifetime, never the decision to store',
              'Endpoint đó dù sao cũng sẽ bị cache; <code>proxy_ignore_headers</code> chỉ đổi THỜI HẠN chứ không bao giờ đổi quyết định có cất hay không',
            ),
            B(
              'It does not only ignore the LIFETIME: it ignores <code>private</code>, <code>no-store</code> and <code>no-cache</code> as well, so the directive people reach for to force caching removes the protection that stops a personalised response being stored',
              'Nó không chỉ bỏ qua THỜI HẠN: nó bỏ qua luôn cả <code>private</code>, <code>no-store</code> và <code>no-cache</code>, nên đúng cái chỉ thị mà người ta với tay lấy để ép cache lại gỡ mất lớp bảo vệ vốn ngăn một phản hồi cá nhân hoá bị cất giữ',
            ),
            B(
              'The measurement is an artefact of a short TTL; with <code>proxy_cache_valid 200 1h</code> the second request would have been a MISS again',
              'Phép đo này là hiện tượng phụ của TTL ngắn; với <code>proxy_cache_valid 200 1h</code> thì request thứ hai đã lại là MISS',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the same leak as the <code>Authorization</code> one, arriving through a directive that looks like a tuning knob. If you must use it — a legacy backend that sends <code>no-cache</code> on everything and cannot be changed — put it on the SPECIFIC location that serves public content and never at <code>server</code> or <code>http</code> level, and pair it with <code>proxy_no_cache $http_authorization $cookie_phien;</code> so a credentialed request cannot be stored regardless. Listing <code>Set-Cookie</code> in <code>proxy_ignore_headers</code> deserves exactly the same care and for exactly the same reason.',
            'Đây vẫn là đúng cái rò rỉ của <code>Authorization</code>, nhưng đi vào qua một chỉ thị trông như một nút chỉnh tinh. Nếu buộc phải dùng — một backend cũ gửi <code>no-cache</code> lên mọi thứ và không sửa được — thì hãy đặt nó vào ĐÚNG cái location phục vụ nội dung công khai, đừng bao giờ đặt ở tầng <code>server</code> hay <code>http</code>, và kèm theo <code>proxy_no_cache $http_authorization $cookie_phien;</code> để một request có mang thông tin đăng nhập không thể bị cất trong mọi trường hợp. Đưa <code>Set-Cookie</code> vào <code>proxy_ignore_headers</code> cũng đòi đúng mức cẩn thận ấy, vì đúng cái lý do ấy.',
          ),
        }),

        // q15 · đáp án 3
        mcq({
          prompt: B(
            'Twenty simultaneous requests to one uncached URL whose upstream takes a second, measured twice on nginx/1.27.5.' + code(
              'KHONG co proxy_cache_lock  ->  20 MISS\n' +
              'CO      proxy_cache_lock  ->   1 MISS  +  19 HIT',
            ) + 'What does the second row buy, and what does it cost?',
            'Hai mươi request đồng thời tới một URL chưa có trong bộ đệm mà upstream mất một giây, đo hai lần trên nginx/1.27.5.' + code(
              'KHONG co proxy_cache_lock  ->  20 MISS\n' +
              'CO      proxy_cache_lock  ->   1 MISS  +  19 HIT',
            ) + 'Dòng thứ hai mua được gì, và tốn gì?',
          ),
          options: [
            B(
              'It buys nothing measurable; the two rows describe the same number of upstream calls reported under different status names',
              'Nó chẳng mua được gì đo được; hai dòng chỉ mô tả cùng một số lần gọi upstream dưới hai cái tên trạng thái khác nhau',
            ),
            B(
              'It buys a shorter TTL and costs nothing, which is why the lock should simply be on everywhere by default',
              'Nó mua được một TTL ngắn hơn mà chẳng tốn gì, nên khoá đó cứ bật sẵn ở mọi nơi là xong',
            ),
            B(
              'It buys fresher data at the cost of memory, because each waiting request keeps its own copy of the response while it waits',
              'Nó mua được dữ liệu tươi hơn với cái giá là bộ nhớ, vì mỗi request đang chờ đều giữ một bản sao phản hồi của riêng nó',
            ),
            B(
              'Your backend receives ONE query instead of twenty; the cost is that the waiting requests poll for the entry rather than being woken, so a follower can finish noticeably later than the leader — <code>proxy_cache_lock_timeout</code> bounds that wait',
              'Backend của bạn nhận MỘT truy vấn thay vì hai mươi; cái giá là các request đang chờ phải DÒ tìm mục cache chứ không được đánh thức, nên một kẻ theo sau có thể xong muộn hơn hẳn kẻ dẫn đầu — <code>proxy_cache_lock_timeout</code> chặn trần cho cái chờ đó',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Without the lock, Nginx has no notion that twenty requests want the same thing: each one misses and each one opens an upstream connection. The stampede scales with traffic AND with how slow the endpoint is, so the endpoint you most wanted to cache is the one that suffers most without this — which is the wrong way round for a protection mechanism. Three ways to blunt it, in order of preference: serve stale while one request refreshes (<code>proxy_cache_use_stale updating</code> with <code>proxy_cache_background_update on</code>) so nobody waits at all; the lock when serving stale is genuinely wrong — a price, a stock level, a balance; and a longer TTL, which is the only option with no downside, because a stampede happens once per expiry.',
            'Không có khoá thì Nginx chẳng có khái niệm gì về chuyện hai mươi request cùng muốn một thứ: cái nào cũng trượt, cái nào cũng mở một kết nối lên upstream. Cơn giẫm đạp lớn lên theo lưu lượng VÀ theo mức chậm của endpoint, nên cái endpoint bạn muốn cache nhất lại là cái khổ nhất khi thiếu thứ này — ngược đời với một cơ chế bảo vệ. Ba cách làm cùn nó đi, theo thứ tự nên chọn: phục vụ bản CŨ trong lúc một request đi làm mới (<code>proxy_cache_use_stale updating</code> kèm <code>proxy_cache_background_update on</code>) để chẳng ai phải chờ; dùng khoá khi phục vụ bản cũ thật sự là sai — một cái giá tiền, một mức tồn kho, một số dư; và kéo dài TTL, lựa chọn duy nhất không có mặt trái, vì mỗi lần hết hạn mới có một cơn giẫm đạp.',
          ),
        }),

        // q16 · đáp án 0
        mcq({
          prompt: B(
            'A team turns on <code>proxy_cache_use_stale error timeout http_502 http_503 http_504;</code> with <code>proxy_cache_background_update on;</code>. What must be added at the same time, and why?',
            'Một nhóm bật <code>proxy_cache_use_stale error timeout http_502 http_503 http_504;</code> kèm <code>proxy_cache_background_update on;</code>. Phải thêm gì NGAY CÙNG LÚC, và vì sao?',
          ),
          options: [
            B(
              'An alert on the rate of <code>STALE</code> in the access log, or on the upstream\'s own health endpoint — because edge status codes have just stopped being a health check: a total backend outage now shows as 200s',
              'Một cảnh báo dựa trên tần suất <code>STALE</code> trong access log, hoặc dựa trên chính endpoint sức khoẻ của upstream — vì mã trạng thái ở rìa vừa thôi không còn là một phép kiểm sức khoẻ: một cú chết hẳn của backend giờ hiện ra thành toàn 200',
            ),
            B(
              'A longer <code>proxy_cache_valid</code>, because stale-serving cannot work on entries whose TTL is under a minute',
              'Một <code>proxy_cache_valid</code> dài hơn, vì việc phục vụ bản cũ không chạy được với những mục có TTL dưới một phút',
            ),
            B(
              '<code>http_403</code> and <code>http_404</code> in the same list, so that a missing page also falls back to the last good copy',
              'Thêm <code>http_403</code> và <code>http_404</code> vào cùng danh sách đó, để một trang không tìm thấy cũng lui về bản tốt gần nhất',
            ),
            B(
              'Nothing — the directive is self-contained, and adding monitoring is a separate concern that can wait for the first incident',
              'Không cần gì cả — chỉ thị đó tự đủ, còn thêm giám sát là chuyện riêng, để tới sự cố đầu tiên rồi tính',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The feature is right — a degraded site beats a broken one, and with the upstream killed outright this directive is the difference between a 200 carrying real content and a 502 for the same URL at the same instant. But it turns a LOUD failure into a silent one. Before: the backend dies, users see 502, someone is paged within a minute. After: users see slightly old pages, nothing alerts, and you find out hours later when the data is visibly wrong. Note also what it cannot do: a URL nobody had requested before is still a 502, because stale-serving covers your popular paths and is not a substitute for the backend being up. And <code>http_403</code>/<code>http_404</code> in that list is almost always wrong — those are ANSWERS, not failures.',
            'Tính năng này là đúng — một site suy giảm còn hơn một site hỏng, và với upstream bị giết hẳn thì chỉ thị này là khác biệt giữa một cú 200 mang nội dung thật và một cú 502, cho cùng URL ở cùng thời điểm. Nhưng nó biến một cú hỏng ỒN ÀO thành một cú hỏng im lặng. Trước: backend chết, người dùng thấy 502, có người bị gọi dậy trong một phút. Sau: người dùng thấy trang hơi cũ, chẳng cảnh báo nào kêu, và bạn biết chuyện sau mấy tiếng khi dữ liệu đã sai lộ liễu. Cũng để ý thứ nó KHÔNG làm được: một URL chưa ai từng gọi thì vẫn là 502, vì phục vụ bản cũ chỉ phủ những đường phổ biến chứ không thay thế được việc backend phải sống. Còn <code>http_403</code>/<code>http_404</code> nằm trong danh sách đó thì gần như luôn sai — chúng là CÂU TRẢ LỜI, không phải cú hỏng.',
          ),
        }),

        /* ── Chương 6 — TLS và HTTP/2 (7 câu) ───────────────────────────── */

        // q17 · đáp án 1
        mcq({
          prompt: B(
            'A three-level chain (ROOT signs INTERMEDIATE signs the leaf) served two ways, measured on nginx/1.27.5 with OpenSSL 3.3.3.' + code(
              '# ssl_certificate /tls/fullchain.crt   (la + trung gian)\n' +
              ' 0 s:CN=vd.test\n' +
              ' 1 s:CN=TRUNG GIAN NHAP\n' +
              'Verify return code: 0 (ok)\n' +
              '\n' +
              '# ssl_certificate /tls/la.crt          (CHI mot minh chung chi cua ban)\n' +
              ' 0 s:CN=vd.test\n' +
              'Verify return code: 21 (unable to verify the first certificate)',
            ) + 'Why does the second form still show a padlock in the developer\'s browser?',
            'Một chuỗi ba tầng (GỐC ký TRUNG GIAN, trung gian ký lá) phục vụ theo hai cách, đo trên nginx/1.27.5 với OpenSSL 3.3.3.' + code(
              '# ssl_certificate /tls/fullchain.crt   (la + trung gian)\n' +
              ' 0 s:CN=vd.test\n' +
              ' 1 s:CN=TRUNG GIAN NHAP\n' +
              'Verify return code: 0 (ok)\n' +
              '\n' +
              '# ssl_certificate /tls/la.crt          (CHI mot minh chung chi cua ban)\n' +
              ' 0 s:CN=vd.test\n' +
              'Verify return code: 21 (unable to verify the first certificate)',
            ) + 'Vì sao cách viết thứ hai vẫn hiện ổ khoá xanh trên trình duyệt của lập trình viên?',
          ),
          options: [
            B(
              'The browser skips chain validation entirely for a hostname it has visited before and pins the result in its TLS session cache, so only the very first visit from a cold profile would ever have failed',
              'Trình duyệt bỏ hẳn khâu kiểm chuỗi với một tên miền nó từng vào và ghim kết quả vào bộ đệm phiên TLS, nên chỉ lần vào ĐẦU TIÊN từ một hồ sơ trắng mới có thể hỏng',
            ),
            B(
              'Browsers cache intermediates they have seen before and some fetch a missing one over the network, while <code>curl</code>, a fresh mobile browser, an Android app and a payment gateway all fail — the client only has the ROOT, so the intermediate can only come from you',
              'Trình duyệt CACHE các chứng chỉ trung gian nó từng thấy và có loại còn tự tải cái thiếu về qua mạng, trong khi <code>curl</code>, một trình duyệt di động mới tinh, một ứng dụng Android và một cổng thanh toán đều hỏng — client chỉ có chứng chỉ GỐC, nên chứng chỉ trung gian chỉ có thể tới từ bạn',
            ),
            B(
              'A leaf certificate is self-sufficient once it carries a Subject Alternative Name; verify code 21 is a warning about the permissions on the private key file that <code>ssl_certificate_key</code> points at, not about the chain at all',
              'Chứng chỉ lá là tự đủ một khi nó mang Subject Alternative Name; mã kiểm chứng 21 là cảnh báo về quyền của tệp khoá riêng mà <code>ssl_certificate_key</code> trỏ tới, hoàn toàn không liên quan tới chuỗi',
            ),
            B(
              'The developer\'s machine trusts the intermediate directly, because an intermediate generated on that same machine lands in the system trust store next to the root, and that shortcut simply never exists on production hardware',
              'Máy của lập trình viên tin THẲNG chứng chỉ trung gian, vì một chứng chỉ trung gian sinh ra ngay trên máy đó thì nằm luôn trong kho tin cậy của hệ thống cạnh chứng chỉ gốc, và lối tắt ấy đơn giản là không tồn tại trên máy production',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is the single most common way to break TLS in a way that works on your laptop and fails for a large fraction of real clients — and the error says the certificate is untrusted, which sends everyone hunting for a problem with the certificate itself. The diagnosis is the measurement above: COUNT the certificates the server sends. One means the intermediate is missing; two or three means the chain is complete. <code>openssl s_client -connect host:443 -servername host &lt;/dev/null | grep -c "^ [0-9] s:"</code> answers it in one command, and it is worth running after every renewal rather than only the first time — <code>ssl_certificate</code> wants <code>fullchain.pem</code>, never <code>cert.pem</code>.',
            'Đây là cách phổ biến số một để làm hỏng TLS theo kiểu chạy ngon trên máy bạn và hỏng với một phần lớn client thật — mà thông báo lỗi lại nói chứng chỉ không đáng tin, khiến ai cũng đi lùng một vấn đề ở bản thân cái chứng chỉ. Cách chẩn chính là phép đo ở trên: ĐẾM số chứng chỉ máy chủ gửi ra. Một cái nghĩa là thiếu trung gian; hai hoặc ba cái nghĩa là chuỗi đầy đủ. <code>openssl s_client -connect host:443 -servername host &lt;/dev/null | grep -c "^ [0-9] s:"</code> trả lời trong một lệnh, và đáng chạy sau MỖI lần gia hạn chứ không chỉ lần đầu — <code>ssl_certificate</code> cần <code>fullchain.pem</code>, không bao giờ là <code>cert.pem</code>.',
          ),
        }),

        // q18 · đáp án 2
        mcq({
          prompt: B(
            'You test a server hosting several sites with <code>openssl s_client -connect vidu.com:443</code> and get a certificate for a completely different hostname. What went wrong, and what actually decides where a certificate is valid?',
            'Bạn kiểm một máy chủ đang chứa nhiều site bằng <code>openssl s_client -connect vidu.com:443</code> và nhận về chứng chỉ của một tên miền hoàn toàn khác. Sai ở đâu, và cái gì mới THẬT SỰ quyết định một chứng chỉ dùng được ở đâu?',
          ),
          options: [
            B(
              'The certificate expired and the server fell back to a spare one; renew it and the right certificate returns',
              'Chứng chỉ đã hết hạn nên máy chủ lui về một cái dự phòng; gia hạn xong là chứng chỉ đúng quay lại',
            ),
            B(
              'Nothing went wrong: a server presents one certificate per IP address, and the Common Name of that certificate is what browsers match against',
              'Chẳng có gì sai: một máy chủ chỉ trình một chứng chỉ cho mỗi địa chỉ IP, và Common Name của chứng chỉ đó là thứ trình duyệt đem ra so',
            ),
            B(
              'Without <code>-servername</code> no SNI is sent, so Chapter 1\'s server selection handed you the DEFAULT block\'s certificate — and validity comes from the Subject Alternative Name list, not from the Common Name',
              'Thiếu <code>-servername</code> thì không có SNI nào được gửi, nên phép chọn khối server ở Chương 1 đưa cho bạn chứng chỉ của khối MẶC ĐỊNH — và tính hợp lệ đến từ danh sách Subject Alternative Name chứ không phải từ Common Name',
            ),
            B(
              'The private key is shared between blocks, so any block can present any certificate; add a separate key per site to fix it',
              'Khoá riêng bị dùng chung giữa các khối nên khối nào cũng trình được chứng chỉ nào; thêm mỗi site một khoá riêng là xong',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The certificate comes from whichever server block matched, and matching needs a name — TLS is negotiated before any HTTP header exists, so SNI is the only thing that can carry it. Test with the name you actually mean or you will conclude the wrong thing about a healthy server. Browsers stopped honouring the Common Name years ago: a certificate is valid for exactly the names in its SAN list, which is why a certificate for <code>vidu.com</code> that omits <code>www.vidu.com</code> breaks the www redirect you set up in Chapter 1. Read the list with <code>openssl x509 -noout -text | grep -A1 "Subject Alternative Name"</code>, and keep a daily cron printing days-remaining so expiry is a number you see rather than an alert from users.',
            'Chứng chỉ tới từ khối server nào khớp, mà muốn khớp thì phải có TÊN — TLS được thoả thuận TRƯỚC khi tồn tại bất kỳ header HTTP nào, nên SNI là thứ duy nhất mang được cái tên ấy. Hãy kiểm bằng đúng cái tên bạn định nói tới, nếu không bạn sẽ kết luận sai về một máy chủ hoàn toàn khoẻ mạnh. Trình duyệt đã thôi tôn trọng Common Name từ nhiều năm trước: một chứng chỉ chỉ hợp lệ với đúng những tên trong danh sách SAN của nó, và đó là lý do một chứng chỉ cho <code>vidu.com</code> mà bỏ sót <code>www.vidu.com</code> sẽ làm hỏng cú chuyển hướng www bạn dựng ở Chương 1. Đọc danh sách đó bằng <code>openssl x509 -noout -text | grep -A1 "Subject Alternative Name"</code>, và giữ một cron hằng ngày in ra số ngày còn lại để chuyện hết hạn là một CON SỐ bạn nhìn thấy chứ không phải một cảnh báo từ người dùng.',
          ),
        }),

        // q19 · đáp án 3
        mcq({
          prompt: B(
            'Every cipher suite the local OpenSSL knows was offered one at a time to two server blocks, measured on nginx/1.27.5 with OpenSSL 3.3.3.' + code(
              'Khoi KHONG khai ssl_ciphers  -> chap nhan 25 / 158\n' +
              '  trong 25 do, 14 cai KHONG co ECDHE:\n' +
              '  AES128-GCM-SHA256  AES256-GCM-SHA384  AES128-CCM  AES256-CCM\n' +
              '  ARIA128-GCM-SHA256 ARIA256-GCM-SHA384 AES128-SHA256 AES256-SHA256\n' +
              '  CAMELLIA128-SHA256 CAMELLIA256-SHA256 AES128-SHA AES256-SHA ...\n' +
              '\n' +
              'Khoi CO khai ssl_ciphers (6 muc ECDHE) -> chap nhan 3 / 158, ca ba deu ECDHE',
            ) + 'Why do the fourteen matter, even though their encryption is strong?',
            'Từng bộ mã mà OpenSSL trên máy biết được lần lượt chào vào hai khối server, đo trên nginx/1.27.5 với OpenSSL 3.3.3.' + code(
              'Khoi KHONG khai ssl_ciphers  -> chap nhan 25 / 158\n' +
              '  trong 25 do, 14 cai KHONG co ECDHE:\n' +
              '  AES128-GCM-SHA256  AES256-GCM-SHA384  AES128-CCM  AES256-CCM\n' +
              '  ARIA128-GCM-SHA256 ARIA256-GCM-SHA384 AES128-SHA256 AES256-SHA256\n' +
              '  CAMELLIA128-SHA256 CAMELLIA256-SHA256 AES128-SHA AES256-SHA ...\n' +
              '\n' +
              'Khoi CO khai ssl_ciphers (6 muc ECDHE) -> chap nhan 3 / 158, ca ba deu ECDHE',
            ) + 'Vì sao mười bốn cái kia lại đáng lo, dù bản thân phép mã hoá của chúng vẫn mạnh?',
          ),
          options: [
            B(
              'They are slower, so a client that picks one makes every request on that connection measurably more expensive',
              'Chúng chậm hơn, nên một client chọn trúng một cái sẽ làm mọi request trên kết nối đó đắt lên rõ rệt',
            ),
            B(
              'They are only offered to TLS 1.3 clients, and TLS 1.3 has no way to express a preference between them',
              'Chúng chỉ được chào cho client TLS 1.3, mà TLS 1.3 lại không có cách nào bày tỏ ưu tiên giữa chúng',
            ),
            B(
              'They are broken by known attacks, so any connection using one is readable in real time by anyone on the path',
              'Chúng đã bị các đòn tấn công đã biết bẻ gãy, nên mọi kết nối dùng chúng đều bị đọc theo thời gian thực bởi bất kỳ ai trên đường truyền',
            ),
            B(
              'No forward secrecy: they use static RSA key exchange, so the session key is encrypted to the server key — anyone who records the traffic today can decrypt every recorded session if that key leaks later',
              'Không có forward secrecy: chúng dùng trao đổi khoá RSA tĩnh, nên khoá phiên được mã hoá bằng khoá của máy chủ — ai ghi lại lưu lượng hôm nay đều giải mã được MỌI phiên đã ghi nếu khoá đó bị lộ về sau',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A breach, a stolen backup or a seized disk turns yesterday\'s recorded traffic into plaintext. With ECDHE both sides derive the session key from ephemeral values that are discarded afterwards, so the private key only proves identity and losing it later exposes nothing already recorded — which is the whole reason the modern list contains nothing else. TLS 1.3 removed the choice entirely: all five of its suites are forward-secret and AEAD, so <code>ssl_ciphers</code> does not apply to 1.3 at all and the list you write only matters for the TLS 1.2 clients you still support. Keep <code>ChaCha20</code> in it and set <code>ssl_prefer_server_ciphers off</code>, so a phone without AES hardware can pick the algorithm that is several times faster for it. And never paste a list from an undated article: unknown suite names are silently not offered, so a config listing ten can be doing the work of three.',
            'Một vụ xâm nhập, một bản sao lưu bị lấy cắp hay một cái đĩa bị tịch thu sẽ biến lưu lượng ghi lại hôm qua thành bản rõ. Với ECDHE, hai bên cùng dẫn xuất khoá phiên từ những giá trị phù du rồi vứt đi, nên khoá riêng chỉ còn dùng để chứng minh danh tính và việc mất nó về sau không phơi ra thứ gì đã ghi — đó chính là lý do danh sách hiện đại không chứa gì khác. TLS 1.3 đã xoá bỏ hẳn cái lựa chọn này: cả năm bộ mã của nó đều forward-secret và AEAD, nên <code>ssl_ciphers</code> hoàn toàn không áp cho 1.3, và cái danh sách bạn viết chỉ còn ý nghĩa với đám client TLS 1.2 mà bạn vẫn hỗ trợ. Hãy giữ <code>ChaCha20</code> trong đó và đặt <code>ssl_prefer_server_ciphers off</code>, để một cái điện thoại không có phần cứng AES tự chọn được thuật toán nhanh gấp mấy lần với nó. Và đừng bao giờ dán một danh sách từ một bài viết không ghi ngày: tên bộ mã lạ bị âm thầm không chào ra, nên một cấu hình liệt kê mười cái có thể đang làm đúng việc của ba cái.',
          ),
        }),

        // q20 · đáp án 0
        mcq({
          prompt: B(
            'Two measurements from the course, on the same machine and the same URL.' + code(
              'Bat tay TLS, tach rieng (appconnect - connect) : trung vi 4,23 ms\n' +
              '\n' +
              '100 request qua MOT ket noi   :   30 ms tong  =  0,30 ms/request\n' +
              '100 request qua 100 ket noi   : 1066 ms tong  = 10,66 ms/request',
            ) + 'What should you change first?',
            'Hai phép đo trong giáo trình, trên cùng một máy và cùng một URL.' + code(
              'Bat tay TLS, tach rieng (appconnect - connect) : trung vi 4,23 ms\n' +
              '\n' +
              '100 request qua MOT ket noi   :   30 ms tong  =  0,30 ms/request\n' +
              '100 request qua 100 ket noi   : 1066 ms tong  = 10,66 ms/request',
            ) + 'Bạn nên đổi cái gì TRƯỚC?',
          ),
          options: [
            B(
              'Anything that keeps connections open — <code>keepalive_timeout</code> at its default, HTTP/2 actually on, session resumption, and upstream keepalive — because a handshake is per CONNECTION, not per request',
              'Bất cứ thứ gì giữ kết nối MỞ — <code>keepalive_timeout</code> để nguyên mặc định, HTTP/2 bật thật, nối lại phiên, và keepalive lên upstream — vì một cú bắt tay tính theo KẾT NỐI chứ không theo request',
            ),
            B(
              'The cipher list, because 4,23 ms of handshake is the dominant term and a cheaper suite reduces it directly',
              'Danh sách bộ mã, vì 4,23 ms bắt tay là số hạng lớn nhất và một bộ mã rẻ hơn sẽ giảm thẳng nó',
            ),
            B(
              'Turn TLS off for static assets, since they carry no secrets and the handshake is pure overhead for them',
              'Tắt TLS cho tài nguyên tĩnh, vì chúng không mang bí mật gì và cú bắt tay với chúng là chi phí thuần',
            ),
            B(
              'Lower <code>keepalive_timeout</code> to free file descriptors, then compare the two rows again with the memory saved',
              'Hạ <code>keepalive_timeout</code> xuống để giải phóng file descriptor, rồi so lại hai dòng đó với phần bộ nhớ tiết kiệm được',
            ),
          ],
          correct: 0,
          explanation: EX(
            'A 35× gap between reusing a connection and not, and nothing in <code>ssl_ciphers</code> is going to touch it. A page pulling forty assets over one connection pays for ONE handshake; over forty connections it pays forty times. So <code>keepalive_timeout 75s;</code> — the default — is doing more for your TLS costs than any cipher choice, and lowering it to save descriptors trades a cheap resource for an expensive one. Two more cheap levers in the same direction: <code>ssl_session_cache shared:SSL:10m;</code>, which defaults to NONE, so without it every reconnect is a full handshake; and an ECDSA certificate alongside the RSA one, since RSA signing at 2048 bits is the expensive part of the server\'s side. Log <code>$ssl_session_reused</code> to see whether resumption is actually working.',
            'Chênh lệch 35 lần giữa có tái dùng kết nối và không, và chẳng thứ gì trong <code>ssl_ciphers</code> chạm được vào đó. Một trang kéo bốn mươi tài nguyên qua MỘT kết nối chỉ trả tiền cho MỘT cú bắt tay; qua bốn mươi kết nối thì trả bốn mươi lần. Nên <code>keepalive_timeout 75s;</code> — đúng giá trị mặc định — đang làm nhiều cho chi phí TLS của bạn hơn mọi lựa chọn bộ mã, và hạ nó xuống để tiết kiệm file descriptor là đem một tài nguyên rẻ đi đổi lấy một tài nguyên đắt. Thêm hai cái cần gạt rẻ tiền cùng hướng: <code>ssl_session_cache shared:SSL:10m;</code>, thứ mặc định là KHÔNG CÓ, nên thiếu nó thì mỗi lần nối lại là một cú bắt tay đầy đủ; và một chứng chỉ ECDSA đặt cạnh cái RSA, vì ký RSA 2048 bit mới là phần đắt đỏ ở phía máy chủ. Hãy log <code>$ssl_session_reused</code> để xem việc nối lại phiên có thật sự chạy hay không.',
          ),
        }),

        // q21 · đáp án 1
        mcq({
          prompt: B(
            'Two TLS server blocks measured on nginx/1.27.5. Only one has <code>http2 on;</code>.' + code(
              'cong 8343 (khong khai http2) -> ALPN=http/1.1   curl bao HTTP/1.1\n' +
              'cong 8344 (co http2 on)      -> ALPN=h2         curl bao HTTP/2',
            ) + 'What does the first row tell you?',
            'Hai khối server TLS đo trên nginx/1.27.5. Chỉ một khối có <code>http2 on;</code>.' + code(
              'cong 8343 (khong khai http2) -> ALPN=http/1.1   curl bao HTTP/1.1\n' +
              'cong 8344 (co http2 on)      -> ALPN=h2         curl bao HTTP/2',
            ) + 'Dòng đầu tiên nói lên điều gì?',
          ),
          options: [
            B(
              'Port 8343 is misconfigured: any block with <code>ssl</code> negotiates HTTP/2 automatically unless something blocks it',
              'Cổng 8343 bị cấu hình sai: khối nào có <code>ssl</code> cũng tự thoả thuận HTTP/2 trừ khi có thứ gì chặn lại',
            ),
            B(
              'HTTP/2 is NOT on by default — adding <code>ssl</code> to a listen line gives you HTTPS over HTTP/1.1 and nothing more — and ALPN, negotiated inside the TLS handshake, is the definitive way to confirm it',
              'HTTP/2 KHÔNG bật sẵn — thêm <code>ssl</code> vào dòng listen chỉ cho bạn HTTPS chạy trên HTTP/1.1 chứ không hơn — và ALPN, thoả thuận ngay bên trong cú bắt tay TLS, mới là cách chốt hạ để xác nhận',
            ),
            B(
              'The client on that port did not support HTTP/2; the server offered it and was declined',
              'Client ở cổng đó không hỗ trợ HTTP/2; máy chủ có chào ra và bị từ chối',
            ),
            B(
              'HTTP/2 requires <code>http2_max_concurrent_streams</code> to be declared as well, which is what port 8344 has and port 8343 lacks',
              'HTTP/2 còn đòi phải khai <code>http2_max_concurrent_streams</code> nữa, và đó là thứ cổng 8344 có còn cổng 8343 thiếu',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Port 8343 is a complete, working TLS server that negotiates <code>http/1.1</code> because nobody asked for anything else. Confirm it from outside, once — it is easy to add the directive to the wrong server block and keep believing otherwise. Two version notes: the syntax was <code>listen 443 ssl http2;</code> up to nginx 1.25.0 and became its own <code>http2 on;</code> directive from 1.25.1, so getting it wrong on an old build is an <code>unknown directive</code> and a config that will not load. What it buys is one connection instead of the browser\'s six, no head-of-line blocking at the HTTP layer, and HPACK compressing repeated cookies — which also means concatenating, spriting and domain sharding stop helping and start hurting.',
            'Cổng 8343 là một máy chủ TLS đầy đủ, chạy tốt, và nó thoả thuận ra <code>http/1.1</code> đơn giản vì chẳng ai hỏi tới thứ gì khác. Hãy xác nhận từ BÊN NGOÀI, một lần — rất dễ thêm chỉ thị đó vào nhầm khối server rồi cứ tin là đã bật. Hai lưu ý về phiên bản: cú pháp là <code>listen 443 ssl http2;</code> cho tới nginx 1.25.0 và trở thành một chỉ thị riêng <code>http2 on;</code> từ 1.25.1, nên viết sai trên một bản dựng cũ sẽ ra <code>unknown directive</code> và cấu hình không nạp được. Cái nó mua được là MỘT kết nối thay cho sáu kết nối của trình duyệt, không còn chặn đầu hàng ở tầng HTTP, và HPACK nén những cookie lặp đi lặp lại — điều đó cũng có nghĩa là gộp tệp, ghép sprite và chia nhỏ tên miền thôi có ích và bắt đầu gây hại.',
          ),
        }),

        // q22 · đáp án 2
        mcq({
          prompt: B(
            'Someone benchmarks HTTP/2 on their laptop and reports these two numbers as evidence that it is not worth enabling.' + code(
              '50 tai nguyen nho, mot lenh curl, cung mot may:\n' +
              '  HTTP/2   : 28 ms\n' +
              '  HTTP/1.1 : 27 ms\n' +
              '\n' +
              'Kich thuoc header gui di (curl bao cao), cookie 1,5KB, 20 request:\n' +
              '  HTTP/2   : tong 31.951 byte\n' +
              '  HTTP/1.1 : tong 31.991 byte',
            ) + 'What is the honest conclusion?',
            'Có người bấm giờ HTTP/2 trên máy mình rồi đưa hai con số này ra làm bằng chứng rằng không đáng bật nó.' + code(
              '50 tai nguyen nho, mot lenh curl, cung mot may:\n' +
              '  HTTP/2   : 28 ms\n' +
              '  HTTP/1.1 : 27 ms\n' +
              '\n' +
              'Kich thuoc header gui di (curl bao cao), cookie 1,5KB, 20 request:\n' +
              '  HTTP/2   : tong 31.951 byte\n' +
              '  HTTP/1.1 : tong 31.991 byte',
            ) + 'Kết luận TRUNG THỰC là gì?',
          ),
          options: [
            B(
              'HTTP/2 has no measurable benefit on modern hardware, and both rows independently confirm it',
              'HTTP/2 không có lợi ích nào đo được trên phần cứng hiện đại, và cả hai dòng đều xác nhận điều đó một cách độc lập',
            ),
            B(
              'The first row is meaningless but the second is sound evidence that HPACK does not compress in practice',
              'Dòng đầu thì vô nghĩa nhưng dòng sau là bằng chứng vững chắc rằng trên thực tế HPACK không nén gì cả',
            ),
            B(
              'Neither number can observe the mechanism: multiplexing only saves round trips, and loopback has none; and curl reports the headers it composed BEFORE HPACK, so a pre-compression size cannot measure a compression feature',
              'Không con số nào quan sát được cơ chế cả: ghép kênh chỉ tiết kiệm được các vòng đi-về, mà loopback thì chẳng có vòng nào; còn curl báo kích thước header nó soạn ra TRƯỚC khi HPACK nén, nên một con số trước-nén không thể đo được một tính năng nén',
            ),
            B(
              'The test needed more resources: at 500 files instead of 50 the same laptop would have shown the real difference',
              'Phép thử cần nhiều tài nguyên hơn: với 500 tệp thay vì 50 thì chính cái máy đó đã cho thấy khác biệt thật',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Both measurements are correct and both are useless, for different reasons — and publishing the header row as "HPACK saved nothing" would have been a fabrication dressed as data. The general trap is worth carrying out of this chapter: a benchmark that cannot observe the mechanism will always report that the mechanism does not matter. Measure it where the conditions exist — a real client, a real network, DevTools throttled, a page with several dozen subresources — or accept the structural argument instead: one connection rather than six, and the previous question already measured what a handshake costs. The same reasoning applies in the other direction too, which is why the course kept a syscall count for <code>sendfile</code> and discarded the wall-clock number that showed nothing.',
            'Cả hai phép đo đều ĐÚNG và cả hai đều VÔ DỤNG, vì hai lý do khác nhau — và đem dòng header ra công bố thành "HPACK chẳng tiết kiệm được gì" thì đó là bịa đặt khoác áo dữ liệu. Cái bẫy tổng quát đáng mang ra khỏi chương này: một phép đo không quan sát được cơ chế thì sẽ LUÔN báo rằng cơ chế đó không quan trọng. Hãy đo ở nơi có đủ điều kiện — một client thật, một mạng thật, DevTools bóp băng thông, một trang có vài chục tài nguyên con — hoặc chấp nhận lý lẽ về cấu trúc: một kết nối thay vì sáu, và câu trước đã đo sẵn cái giá của một cú bắt tay. Lối suy luận ấy cũng đúng theo chiều ngược lại, và đó là lý do giáo trình giữ lại phép ĐẾM SYSCALL cho <code>sendfile</code> và vứt đi con số đồng hồ vốn chẳng thấy gì.',
          ),
        }),

        // q23 · đáp án 0
        mcq({
          prompt: B(
            'HSTS measured on nginx/1.27.5 across three blocks.' + code(
              'cong 8343 (khong khai)  -> khong co Strict-Transport-Security\n' +
              'cong 8344 (co khai)     -> strict-transport-security: max-age=63072000; includeSubDomains\n' +
              'cong 80  (chuyen huong) -> khong co, va DUNG RA la the',
            ) + 'Which set of statements about HSTS is correct?',
            'HSTS đo trên nginx/1.27.5 ở ba khối.' + code(
              'cong 8343 (khong khai)  -> khong co Strict-Transport-Security\n' +
              'cong 8344 (co khai)     -> strict-transport-security: max-age=63072000; includeSubDomains\n' +
              'cong 80  (chuyen huong) -> khong co, va DUNG RA la the',
            ) + 'Bộ phát biểu nào về HSTS là ĐÚNG?',
          ),
          options: [
            B(
              'It needs <code>always</code> so it also reaches error responses; it is ignored over plain HTTP by design; and <code>max-age</code> should start small because HSTS is not revocable',
              'Nó cần <code>always</code> để với tới được cả các phản hồi lỗi; nó bị bỏ qua trên HTTP thuần một cách CÓ CHỦ Ý; và <code>max-age</code> nên bắt đầu nhỏ vì HSTS không thu hồi được',
            ),
            B(
              'It belongs on port 80 as well, since that is the request an attacker can intercept and the header is what stops them',
              'Nó cũng phải đặt trên cổng 80, vì đó chính là request mà kẻ tấn công chặn được và cái header là thứ ngăn họ lại',
            ),
            B(
              'It should be set as high as possible from day one, with <code>preload</code>, because a short value gives an attacker a window',
              'Nên đặt cao nhất có thể ngay từ ngày đầu, kèm <code>preload</code>, vì một giá trị ngắn là để hở một cửa sổ cho kẻ tấn công',
            ),
            B(
              'It replaces the port-80 redirect entirely, so once it is set the plain-HTTP server block can be deleted',
              'Nó thay thế hẳn cú chuyển hướng ở cổng 80, nên khi đã đặt rồi thì xoá luôn khối server HTTP thuần đi được',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Each clause matters separately. Without <code>always</code>, a user whose FIRST request hits a 404 or a 502 never receives the header — and this is one of the cases where <code>always</code> is right, unlike <code>Cache-Control</code> where it caches your failures for a year. Being ignored over HTTP is deliberate: otherwise an attacker who can modify plain HTTP could inject HSTS for a domain they do not control and deny service to it. And once a browser has stored two years it will refuse plain HTTP for two years whatever you do to the server, so run <code>max-age=300</code> for a week first. <code>includeSubDomains</code> covers every subdomain including the internal one on plain HTTP you forgot about, and <code>preload</code> ships your domain inside browsers with removal taking months — both are correct for a mature site and dangerous as a first step. And a redirect is still needed, because HSTS only removes the FIRST insecure request after a browser has seen the header once.',
            'Từng vế đều quan trọng riêng. Thiếu <code>always</code> thì một người dùng có request ĐẦU TIÊN rơi trúng 404 hay 502 sẽ không bao giờ nhận được header — và đây là một trong những ca mà <code>always</code> là ĐÚNG, khác hẳn <code>Cache-Control</code>, nơi nó đi cache cái hỏng của bạn suốt một năm. Việc bị bỏ qua trên HTTP là có chủ ý: nếu không, một kẻ sửa được HTTP thuần có thể chèn HSTS cho một tên miền họ không sở hữu và làm tên miền đó chết. Và một khi trình duyệt đã lưu hai năm thì nó sẽ từ chối HTTP thuần suốt hai năm bất kể bạn làm gì với máy chủ, nên hãy chạy <code>max-age=300</code> một tuần trước đã. <code>includeSubDomains</code> phủ mọi tên miền con kể cả cái nội bộ chạy HTTP thuần mà bạn quên mất, còn <code>preload</code> nhét tên miền của bạn vào bên trong trình duyệt và gỡ ra mất hàng tháng — cả hai đều đúng với một site đã chín và nguy hiểm khi làm bước đầu. Và cú chuyển hướng vẫn cần, vì HSTS chỉ gỡ được request KHÔNG an toàn ĐẦU TIÊN sau khi trình duyệt đã thấy header ít nhất một lần.',
          ),
        }),

        /* ── Chương 7 — giới hạn (7 câu) ────────────────────────────────── */

        // q24 · đáp án 1
        mcq({
          prompt: B(
            'A rate limit at <code>rate=2r/s</code> keyed on the client address. Five different users all arrive through the same corporate proxy, then an attacker is let loose on a config that reads the forwarded header directly. Measured on nginx/1.27.5.' + code(
              'A) khoa = $binary_remote_addr, nam nguoi dung SAU cung mot proxy\n' +
              '   A:200  B:200  C:200  D:429  E:429\n' +
              '\n' +
              'B) khoa = mot header do client gui, ke tan cong DOI header moi request\n' +
              '   200 200 200 200 200 200 200 200      <- TAM tren TAM',
            ) + 'What do the two rows show together?',
            'Một giới hạn tần suất <code>rate=2r/s</code> khoá theo địa chỉ client. Năm người dùng khác nhau cùng đi qua một proxy công ty, rồi một kẻ tấn công được thả vào một cấu hình đọc thẳng header chuyển tiếp. Đo trên nginx/1.27.5.' + code(
              'A) khoa = $binary_remote_addr, nam nguoi dung SAU cung mot proxy\n' +
              '   A:200  B:200  C:200  D:429  E:429\n' +
              '\n' +
              'B) khoa = mot header do client gui, ke tan cong DOI header moi request\n' +
              '   200 200 200 200 200 200 200 200      <- TAM tren TAM',
            ) + 'Hai dòng đó gộp lại cho thấy điều gì?',
          ),
          options: [
            B(
              'Row A is a bug in Nginx\'s counter and row B is correct behaviour, so reading the forwarded header is the fix',
              'Dòng A là lỗi của bộ đếm trong Nginx còn dòng B mới là hành vi đúng, nên đọc header chuyển tiếp chính là cách sửa',
            ),
            B(
              'Both obvious keys fail, in OPPOSITE directions: the TCP peer groups everyone behind a proxy into one bucket, and a client-supplied value gives every request a fresh bucket — the fix is <code>real_ip</code>, which rewrites <code>$remote_addr</code> itself',
              'Cả hai cách khoá hiển nhiên đều HỎNG, theo hai hướng NGƯỢC NHAU: địa chỉ TCP gộp mọi người sau một proxy vào chung một cái xô, còn một giá trị do client cung cấp thì cho mỗi request một cái xô mới toanh — cách sửa là <code>real_ip</code>, thứ viết lại chính <code>$remote_addr</code>',
            ),
            B(
              'Row B passed because eight requests is below any sensible burst, and with <code>burst=0</code> the same test would have failed at request two',
              'Dòng B qua được vì tám request là dưới mọi mức burst hợp lý, và với <code>burst=0</code> thì đúng phép thử đó đã hỏng ngay ở request thứ hai',
            ),
            B(
              'Both rows are the same failure: the zone was too small, so entries were evicted between requests and every lookup missed',
              'Cả hai dòng là cùng một cú hỏng: vùng zone quá nhỏ nên các mục bị đẩy đi giữa các request và mọi lần tra đều trượt',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Row A is the failure that looks like "our rate limit is too strict" and is actually the wrong key — every user of a corporate network, a mobile carrier NAT or your own CDN shares one bucket, and the busiest of them exhausts it for the rest. Row B is worse: the limit is not weakened, it is GONE, and the config still looks like it has one. <code>set_real_ip_from</code> with the addresses of proxies you actually operate, plus <code>real_ip_header X-Forwarded-For;</code>, makes <code>$remote_addr</code> the real client, so <code>$binary_remote_addr</code> is both correct and unforgeable and every limit keyed on it is too. Before trusting any limit, ask one question about its key — can the client change this value? If yes with no validation behind it, the limit is decorative. Build in that order: identity first, then the limits.',
            'Dòng A là cú hỏng trông như "giới hạn của bọn mình chặt quá" mà thật ra là SAI KHOÁ — mọi người dùng của một mạng công ty, một NAT nhà mạng di động hay chính CDN của bạn đều dùng chung một cái xô, và kẻ bận rộn nhất trong đám vét cạn nó cho phần còn lại. Dòng B còn tệ hơn: giới hạn không bị YẾU đi, nó BIẾN MẤT, mà cấu hình thì vẫn trông như đang có một cái. <code>set_real_ip_from</code> với đúng địa chỉ những proxy DO BẠN vận hành, cộng <code>real_ip_header X-Forwarded-For;</code>, biến <code>$remote_addr</code> thành client thật, nên <code>$binary_remote_addr</code> vừa đúng vừa không giả mạo được, và mọi giới hạn khoá theo nó cũng vậy. Trước khi tin bất kỳ giới hạn nào, hãy hỏi một câu về cái KHOÁ của nó — client có đổi được giá trị này không? Nếu có mà phía sau chẳng ai kiểm chứng thì giới hạn đó chỉ để trang trí. Hãy dựng theo đúng thứ tự: danh tính trước, giới hạn sau.',
          ),
        }),

        // q25 · đáp án 2
        mcq({
          prompt: B(
            'The same zone at <code>rate=2r/s</code>, keyed on <code>$uri</code> instead. Two different paths, four rapid requests each. Measured on nginx/1.27.5.' + code(
              '/nho.txt    x4 : 200 429 429 429\n' +
              '/trang.html x4 : 200 429 429 429',
            ) + 'When is this key the right choice?',
            'Vẫn zone đó ở <code>rate=2r/s</code> nhưng khoá theo <code>$uri</code>. Hai đường dẫn khác nhau, mỗi cái bốn request nhanh. Đo trên nginx/1.27.5.' + code(
              '/nho.txt    x4 : 200 429 429 429\n' +
              '/trang.html x4 : 200 429 429 429',
            ) + 'Khi nào cách khoá này là lựa chọn ĐÚNG?',
          ),
          options: [
            B(
              'Never — a key that ignores the client cannot limit anybody, so this configuration has no effect in production',
              'Không bao giờ — một cái khoá bỏ qua client thì không giới hạn được ai, nên cấu hình này vô tác dụng trên production',
            ),
            B(
              'Whenever you want a per-user limit that survives a client changing IP address, since the path is stable across a user\'s session',
              'Bất cứ khi nào bạn muốn một giới hạn theo người dùng mà vẫn đứng vững khi client đổi địa chỉ IP, vì đường dẫn thì ổn định suốt phiên của một người',
            ),
            B(
              'When the thing you are protecting is a BACKEND RESOURCE rather than a user — a search index, a report generator — and you want a global ceiling on it no matter who asks',
              'Khi thứ bạn đang bảo vệ là một TÀI NGUYÊN CỦA BACKEND chứ không phải một người dùng — một chỉ mục tìm kiếm, một bộ sinh báo cáo — và bạn muốn một trần TOÀN CỤC cho nó bất kể ai hỏi',
            ),
            B(
              'Only on static files, because <code>$uri</code> is not defined for proxied requests and the zone would key everything to an empty string',
              'Chỉ với tệp tĩnh, vì <code>$uri</code> không được định nghĩa cho request đi qua proxy và vùng zone sẽ khoá tất cả vào một chuỗi rỗng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The two rows show the property: the two paths do not share a budget, so a ceiling on one cannot be exhausted by traffic to the other. That is what you want when the resource is global rather than per-user. Two more keys are worth knowing. For an authenticated API, <code>limit_req_zone $http_x_api_key ...</code> gives each customer their own quota regardless of where they connect from — but only if the key is validated somewhere, since an unvalidated header is the forged-key failure with a different header name. And an EMPTY key disables the limit for that request, which is the idiom for exempting traffic (<code>map $http_x_api_key $gioi_han { default $binary_remote_addr; "khoa-noi-bo" ""; }</code>) and also a way to accidentally exempt everyone if the variable is usually empty.',
            'Hai dòng đó cho thấy đúng cái tính chất cần: hai đường dẫn KHÔNG dùng chung ngân sách, nên một cái trần đặt cho đường này không thể bị lưu lượng của đường kia vét cạn. Đó chính là thứ bạn muốn khi tài nguyên là toàn cục chứ không thuộc về từng người. Còn hai cách khoá nữa đáng biết. Với một API có xác thực, <code>limit_req_zone $http_x_api_key ...</code> cho mỗi khách hàng một hạn mức riêng bất kể họ kết nối từ đâu — nhưng chỉ đúng nếu cái khoá ấy được kiểm chứng ở đâu đó, vì một header không kiểm chứng chính là cú hỏng "khoá giả mạo được" đội một cái tên header khác. Và một khoá RỖNG sẽ TẮT giới hạn cho request đó, đây là lối viết quen để miễn trừ lưu lượng (<code>map $http_x_api_key $gioi_han { default $binary_remote_addr; "khoa-noi-bo" ""; }</code>) và cũng là cách vô tình miễn trừ cho tất cả mọi người nếu cái biến ấy thường xuyên rỗng.',
          ),
        }),

        // q26 · đáp án 3
        mcq({
          prompt: B(
            'Two probes against the same block, measured on nginx/1.27.5.' + code(
              'limit_conn ket 2;\n' +
              '\n' +
              'A) 6 request DONG THOI toi mot duong dan cham 1 giay\n' +
              '   -> 2 x 200,  4 x 429\n' +
              '   error.log: limiting connections by zone "ket"\n' +
              '\n' +
              'B) 20 ket noi kieu slowloris (gui mot header moi 0,5 giay, KHONG BAO GIO\n' +
              '   ket thuc phan header)\n' +
              '   client_header_timeout 60s (mac dinh), CO limit_conn 2\n' +
              '     sau 8s: con song 20, bi dong 0\n' +
              '   client_header_timeout 2s\n' +
              '     sau 8s: con song 0, bi dong 20',
            ) + 'Why did the limit stop six requests and not one of the twenty?',
            'Hai phép dò vào cùng một khối, đo trên nginx/1.27.5.' + code(
              'limit_conn ket 2;\n' +
              '\n' +
              'A) 6 request DONG THOI toi mot duong dan cham 1 giay\n' +
              '   -> 2 x 200,  4 x 429\n' +
              '   error.log: limiting connections by zone "ket"\n' +
              '\n' +
              'B) 20 ket noi kieu slowloris (gui mot header moi 0,5 giay, KHONG BAO GIO\n' +
              '   ket thuc phan header)\n' +
              '   client_header_timeout 60s (mac dinh), CO limit_conn 2\n' +
              '     sau 8s: con song 20, bi dong 0\n' +
              '   client_header_timeout 2s\n' +
              '     sau 8s: con song 0, bi dong 20',
            ) + 'Vì sao giới hạn chặn được sáu request mà không chặn nổi một trong hai mươi kia?',
          ),
          options: [
            B(
              'The twenty were spread over eight seconds rather than simultaneous, so the concurrent count never reached three',
              'Hai mươi cái kia trải ra trong tám giây chứ không đồng thời, nên số đếm đồng thời không bao giờ chạm tới ba',
            ),
            B(
              '<code>limit_conn</code> only counts connections that carry a request body, and a slowloris connection sends none',
              '<code>limit_conn</code> chỉ đếm những kết nối có mang thân request, mà kết nối slowloris thì chẳng gửi thân nào',
            ),
            B(
              'The zone filled up and started evicting entries, so the twenty each looked like a first connection to the counter',
              'Vùng zone bị đầy rồi bắt đầu đẩy các mục đi, nên với bộ đếm thì hai mươi cái kia đều trông như kết nối đầu tiên',
            ),
            B(
              '<code>limit_conn</code> counts connections that have FINISHED reading their request headers, and a slowloris connection never finishes — so from Nginx\'s point of view no request has started; only <code>client_header_timeout</code> reaches them',
              '<code>limit_conn</code> đếm những kết nối ĐÃ ĐỌC XONG phần header của request, mà một kết nối slowloris thì không bao giờ đọc xong — nên dưới góc nhìn của Nginx chưa có request nào bắt đầu cả; chỉ <code>client_header_timeout</code> mới với tới chúng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'So the directive people reach for to stop connection exhaustion is precisely the wrong one for the best-known connection-exhaustion attack. Four directives, four different resources, and no overlap between them — but they all get described as "protecting Nginx", so people set one and assume they are covered. <code>limit_req</code> counts FREQUENCY and does nothing about one slow request. <code>limit_conn</code> counts CONCURRENCY and does nothing about connections that never complete a request. <code>client_header_timeout</code>/<code>client_body_timeout</code>/<code>send_timeout</code> bound the DURATION OF INCOMPLETENESS and are the only slowloris defence. <code>client_max_body_size</code> bounds SIZE. Before trusting any limit, write down what resource it counts, then ask whether the thing you are worried about consumes that resource.',
            'Nên đúng cái chỉ thị mà người ta với tay lấy để chống cạn kiệt kết nối lại là cái SAI cho chính đòn cạn kiệt kết nối nổi tiếng nhất. Bốn chỉ thị, bốn tài nguyên khác nhau, và giữa chúng không có chỗ nào chồng lấn — nhưng cả bốn đều được mô tả là "bảo vệ Nginx", nên người ta đặt một cái rồi tưởng là đã được che. <code>limit_req</code> đếm TẦN SUẤT và không làm gì được một request chậm. <code>limit_conn</code> đếm ĐỒNG THỜI và không làm gì được những kết nối chẳng bao giờ hoàn tất một request. <code>client_header_timeout</code>/<code>client_body_timeout</code>/<code>send_timeout</code> chặn trần THỜI GIAN DANG DỞ và là lá chắn slowloris duy nhất. <code>client_max_body_size</code> chặn KÍCH THƯỚC. Trước khi tin bất kỳ giới hạn nào, hãy viết ra nó ĐẾM tài nguyên gì, rồi hỏi xem thứ bạn đang lo có tiêu thụ đúng tài nguyên ấy không.',
          ),
        }),

        // q27 · đáp án 0
        mcq({
          prompt: B(
            'A 20 MB upload limit, probed two ways on nginx/1.27.5.' + code(
              'client_max_body_size 20m;\n' +
              '\n' +
              '25MB, co Content-Length  -> 413, da GUI LEN          0 byte,  0,0003s\n' +
              '19MB, co Content-Length  -> 200, da gui len 19.000.000 byte\n' +
              '25MB, CHUNKED (khong khai do dai)\n' +
              '                         -> 413, da GUI LEN 25.003.061 byte',
            ) + 'What does the third row mean for the value of this limit?',
            'Một giới hạn tải lên 20 MB, dò theo hai cách trên nginx/1.27.5.' + code(
              'client_max_body_size 20m;\n' +
              '\n' +
              '25MB, co Content-Length  -> 413, da GUI LEN          0 byte,  0,0003s\n' +
              '19MB, co Content-Length  -> 200, da gui len 19.000.000 byte\n' +
              '25MB, CHUNKED (khong khai do dai)\n' +
              '                         -> 413, da GUI LEN 25.003.061 byte',
            ) + 'Dòng thứ ba nói lên điều gì về giá trị của cái giới hạn này?',
          ),
          options: [
            B(
              'The limit protects the BACKEND always — nothing oversized ever reaches your application — but it protects BANDWIDTH only when the client declares a length, and an attacker who wants to waste your transfer simply omits it',
              'Giới hạn này LUÔN bảo vệ BACKEND — không có thứ quá cỡ nào tới được ứng dụng của bạn — nhưng nó chỉ bảo vệ BĂNG THÔNG khi client có khai độ dài, còn kẻ muốn đốt băng thông của bạn thì chỉ việc bỏ header đó đi',
            ),
            B(
              'Chunked bodies bypass the limit entirely, so the application must repeat the size check or an oversized upload will be written to disk',
              'Thân dạng chunked lách được giới hạn hoàn toàn, nên ứng dụng phải kiểm lại kích thước, không thì một tệp quá cỡ sẽ được ghi xuống đĩa',
            ),
            B(
              'The third row is a client bug: <code>curl</code> should have stopped sending as soon as it saw the 413, and a correct client transfers nothing',
              'Dòng thứ ba là lỗi của client: <code>curl</code> lẽ ra phải ngừng gửi ngay khi thấy mã 413, và một client đúng đắn thì không truyền gì cả',
            ),
            B(
              'It means <code>client_max_body_size</code> is measured after decompression, so a chunked body is counted twice and the byte figure is not comparable',
              'Nó có nghĩa <code>client_max_body_size</code> được đo SAU khi giải nén, nên một thân chunked bị đếm hai lần và con số byte đó không đem so được',
            ),
          ],
          correct: 0,
          explanation: EX(
            'With a declared length Nginx compares it to the limit before accepting a single byte of body and the client\'s own upload is cancelled by the response. Without one there is nothing to compare, so it reads until the running total crosses the limit — and here that was essentially the whole 25 MB. If wasted transfer matters, the defence is upstream of Nginx: a CDN or a firewall rule, not this directive. Two more things about it. A 413 never reaches your application, so it never appears in your application\'s logs and your error tracking will not know it happened — log <code>$status</code> at the Nginx level and add <code>error_page 413 = @qua-lon;</code> returning JSON, because the default 413 is an HTML page a JSON client reports as a parsing error. And the default is 1 MB, which is right for an API receiving JSON and wrong for uploads, so loosen it on ONE location rather than at <code>http</code> level.',
            'Có khai độ dài thì Nginx đem so với giới hạn TRƯỚC khi nhận lấy một byte thân nào, và chính phản hồi ấy huỷ luôn lượt tải lên của client. Không khai thì chẳng có gì để so, nên nó cứ đọc cho tới khi tổng chạy vượt ngưỡng — mà ở đây gần như trọn vẹn 25 MB đã đi qua. Nếu chuyện đốt băng thông là quan trọng thì lá chắn nằm ở PHÍA TRƯỚC Nginx: một CDN hay một luật tường lửa, không phải chỉ thị này. Thêm hai điều nữa. Một cú 413 KHÔNG bao giờ tới được ứng dụng, nên nó không hiện trong log ứng dụng và hệ theo dõi lỗi của bạn sẽ không biết là nó đã xảy ra — hãy log <code>$status</code> ở tầng Nginx và thêm <code>error_page 413 = @qua-lon;</code> trả về JSON, vì trang 413 mặc định là HTML và một client JSON sẽ báo nó thành lỗi phân tích cú pháp. Và mặc định là 1 MB, đúng cho một API nhận JSON và sai cho việc tải tệp, nên hãy nới nó ở ĐÚNG MỘT location chứ đừng nới ở tầng <code>http</code>.',
          ),
        }),

        // q28 · đáp án 1
        mcq({
          prompt: B(
            'A protection layer was assembled and every route probed. Four routes behaved as designed; this is the fifth. Measured on nginx/1.27.5.' + code(
              'location /api/ { limit_req zone=dungchung burst=10 nodelay; ... }\n' +
              'location /len/ { limit_req zone=dungchung burst=5;          ... }\n' +
              '\n' +
              '30 request nhanh vao /api/   -> 11 x 200, 19 x 429\n' +
              'NGAY SAU DO, mot lan tai len HOP LE toi /len/  -> 429\n' +
              '  error.log: limiting requests, excess: 10.950 by zone "dungchung",\n' +
              '             request: "GET /len/x"\n' +
              'Nghi 10 giay cho xo rot lai, gui LAI dung request do  -> 200',
            ) + 'What is the bug and the fix?',
            'Một lớp phòng thủ được ghép lại và mọi tuyến đều được dò. Bốn tuyến chạy đúng thiết kế; đây là tuyến thứ năm. Đo trên nginx/1.27.5.' + code(
              'location /api/ { limit_req zone=dungchung burst=10 nodelay; ... }\n' +
              'location /len/ { limit_req zone=dungchung burst=5;          ... }\n' +
              '\n' +
              '30 request nhanh vao /api/   -> 11 x 200, 19 x 429\n' +
              'NGAY SAU DO, mot lan tai len HOP LE toi /len/  -> 429\n' +
              '  error.log: limiting requests, excess: 10.950 by zone "dungchung",\n' +
              '             request: "GET /len/x"\n' +
              'Nghi 10 giay cho xo rot lai, gui LAI dung request do  -> 200',
            ) + 'Con lỗi là gì và sửa thế nào?',
          ),
          options: [
            B(
              'The <code>nodelay</code> on the first block leaked into the second through inheritance; remove it and both blocks behave independently',
              'Chữ <code>nodelay</code> ở khối đầu rò sang khối thứ hai qua cơ chế thừa hưởng; bỏ nó đi là hai khối hành xử độc lập',
            ),
            B(
              'A zone is a SHARED BUDGET: two locations naming the same one draw from one bucket, so API traffic exhausted the upload route — the fix is one word, a separate zone per purpose',
              'Một zone là một NGÂN SÁCH DÙNG CHUNG: hai location cùng gọi tên một zone thì rút từ MỘT cái xô, nên lưu lượng API vét cạn tuyến tải lên — cách sửa gọn trong một chữ, mỗi mục đích một zone riêng',
            ),
            B(
              'The zone was undersized at 10m, so entries for the two paths collided in the hash; raising it to 64m separates them',
              'Vùng zone quá nhỏ ở mức 10m nên các mục của hai đường dẫn đụng độ trong bảng băm; nâng lên 64m là tách được chúng',
            ),
            B(
              'The upload used GET where the config expects POST, and <code>limit_req</code> applies a stricter budget to methods it does not recognise',
              'Lượt tải lên dùng GET trong khi cấu hình trông đợi POST, và <code>limit_req</code> áp một ngân sách chặt hơn cho những phương thức nó không nhận ra',
            ),
          ],
          correct: 1,
          explanation: EX(
            'In production this is a user whose upload fails because the page they were on made a lot of API requests — a bug report filed as "uploads are flaky" that will not reproduce when tested alone. The error log names it precisely: rejected "by zone dungchung" with an excess accumulated entirely by API calls. The general rule is that a zone is a shared budget, so two things should only share one when you actively WANT them to compete. This is also the argument for probing rather than reviewing: five probes found four correct behaviours and one wrong one, and the shared-zone bug was fully visible in the config file with nobody noticing it. Build in this order — identity (<code>real_ip</code>) first, then sizes and timeouts, then rate limits with numbers taken from your own access log, then probe every route including the failures.',
            'Trên production thì đây là một người dùng có lượt tải lên hỏng vì cái trang họ đang mở vừa bắn ra một mớ lời gọi API — một báo lỗi sẽ được ghi là "tải lên chập chờn" và sẽ không tái hiện được khi thử riêng. Error log gọi tên nó chính xác: bị từ chối "by zone dungchung" với phần vượt ngưỡng do lời gọi API tích lại toàn bộ. Luật chung là: một zone là một ngân sách dùng chung, nên hai thứ chỉ nên dùng chung một zone khi bạn CHỦ ĐỘNG muốn chúng cạnh tranh nhau. Đây cũng là lý lẽ cho việc ĐI DÒ thay vì ĐỌC RÀ: năm phép dò tìm ra bốn hành vi đúng và một hành vi sai, mà con lỗi zone dùng chung thì nằm sờ sờ trong tệp cấu hình chẳng ai để ý. Hãy dựng theo thứ tự này — danh tính (<code>real_ip</code>) trước, rồi kích thước và timeout, rồi giới hạn tần suất với những con số lấy từ chính access log của bạn, rồi dò MỌI tuyến kể cả các nhánh hỏng.',
          ),
        }),

        // q29 · đáp án 2
        mcq({
          prompt: B(
            'Three Nginx instances sit behind a load balancer, each with <code>limit_req_zone ... rate=10r/s;</code> and <code>worker_processes 4;</code>. What rate does one client actually face?',
            'Ba máy Nginx nằm sau một bộ cân bằng tải, mỗi máy có <code>limit_req_zone ... rate=10r/s;</code> và <code>worker_processes 4;</code>. Một client THẬT SỰ chịu mức nào?',
          ),
          options: [
            B(
              '120 requests per second: each of the four workers on each of the three instances keeps its own counter',
              '120 request mỗi giây: mỗi worker trong bốn worker của từng máy trong ba máy đều giữ bộ đếm riêng',
            ),
            B(
              '10 requests per second: the zone lives in shared memory, and shared memory is shared across the whole cluster',
              '10 request mỗi giây: vùng zone nằm trong bộ nhớ dùng chung, mà bộ nhớ dùng chung thì dùng chung cho cả cụm máy',
            ),
            B(
              'Up to 30 per second: the zone IS shared across workers of one instance, but each instance enforces its own copy — divide the configured value by the number of instances, or move the limit to a store both can see',
              'Tới 30 mỗi giây: vùng zone CÓ dùng chung giữa các worker của MỘT máy, nhưng mỗi máy áp một bản riêng của nó — hãy chia giá trị cấu hình cho số máy, hoặc chuyển giới hạn sang một kho mà cả hai cùng nhìn thấy',
            ),
            B(
              'Between 10 and 120, unpredictably, because Nginx synchronises zones opportunistically when instances are idle',
              'Nằm đâu đó giữa 10 và 120 một cách không đoán trước, vì Nginx đồng bộ các zone một cách cơ hội khi các máy rảnh',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The zone being shared BETWEEN WORKERS is what makes the limit a real limit at all — a per-worker counter with four workers would be four times looser than the number you wrote, and that is the same shared-memory mechanism as <code>ssl_session_cache</code> and the <code>proxy_cache</code> keys zone. But it stops at the process boundary of one machine. If the limit exists to protect a shared backend, that multiplication matters and the arithmetic is yours to do. This is also the first of three things this whole layer does NOT do: it cannot stop a DISTRIBUTED attack, since ten thousand addresses each making one request per second are individually within every limit; it does not know what a request MEANS, so "five failed logins then lock the account" belongs in the application; and it does not protect what it does not see, so bind application servers to localhost and check with <code>ss -ltn</code> that nothing is listening on a public interface.',
            'Chuyện vùng zone được dùng chung GIỮA CÁC WORKER mới là thứ làm cho giới hạn này là một giới hạn thật — một bộ đếm riêng cho từng worker với bốn worker sẽ lỏng gấp bốn lần con số bạn viết ra, và đó cũng chính là cơ chế bộ nhớ dùng chung của <code>ssl_session_cache</code> và vùng khoá của <code>proxy_cache</code>. Nhưng nó dừng lại ở ranh giới tiến trình của MỘT máy. Nếu giới hạn ấy sinh ra để bảo vệ một backend dùng chung thì phép nhân kia là quan trọng, và phần tính toán là việc của bạn. Đây cũng là điều đầu tiên trong ba điều mà cả lớp phòng thủ này KHÔNG làm được: nó không chặn nổi một đòn PHÂN TÁN, vì mười nghìn địa chỉ mỗi cái một request mỗi giây thì xét riêng lẻ đều nằm trong mọi giới hạn; nó không biết một request có NGHĨA gì, nên "sai năm lần mật khẩu thì khoá tài khoản" thuộc về ứng dụng; và nó không bảo vệ được thứ nó không nhìn thấy, nên hãy buộc các máy chủ ứng dụng vào localhost rồi kiểm bằng <code>ss -ltn</code> xem có gì đang nghe trên giao diện công khai không.',
          ),
        }),

        // q30 · đáp án 3
        mcq({
          prompt: B(
            'Ten rapid requests through three spellings of the same <code>rate=2r/s</code>, measured on nginx/1.27.5 against a real content handler.' + code(
              'A) limit_req zone=z;                 200 503 503 503 503 503 503 503 503 503\n' +
              'B) limit_req zone=z burst=5;         200 200 200 200 200 200 200 200 200 200\n' +
              '   (moi request sau cai dau tien cach nhau ~0,5s)\n' +
              'C) limit_req zone=z burst=5 nodelay; 200 200 200 200 200 503 503 503 503 503',
            ) + 'Which reading is correct?',
            'Mười request nhanh qua ba cách viết của cùng mức <code>rate=2r/s</code>, đo trên nginx/1.27.5 với một handler nội dung thật.' + code(
              'A) limit_req zone=z;                 200 503 503 503 503 503 503 503 503 503\n' +
              'B) limit_req zone=z burst=5;         200 200 200 200 200 200 200 200 200 200\n' +
              '   (moi request sau cai dau tien cach nhau ~0,5s)\n' +
              'C) limit_req zone=z burst=5 nodelay; 200 200 200 200 200 503 503 503 503 503',
            ) + 'Cách đọc nào ĐÚNG?',
          ),
          options: [
            B(
              'B lets more requests through in total than C, so B enforces a looser average rate than the other two',
              'B cho tổng cộng nhiều request đi qua hơn C, nên B áp một mức trung bình lỏng hơn hai cái kia',
            ),
            B(
              'C disables the rate limit for the first five requests, which is why <code>nodelay</code> should not be used on anything that must be protected',
              'C tắt hẳn giới hạn cho năm request đầu, và đó là lý do không nên dùng <code>nodelay</code> cho thứ gì cần được bảo vệ',
            ),
            B(
              'A is the correct default because it enforces the rate exactly; the other two are convenience settings that weaken it',
              'A là mặc định đúng vì nó áp đúng chính xác mức tần suất; hai cái kia là thiết lập cho tiện và làm yếu nó đi',
            ),
            B(
              'The long-run average is 2r/s in all three; what changes is what happens to the excess — refused, DELAYED until the bucket refills, or served instantly from the bucket and then refused. The default rejection status 503 is also the wrong thing to tell a client',
              'Trung bình dài hạn của cả ba đều là 2r/s; cái thay đổi là số phận của phần VƯỢT — bị từ chối, bị BẮT CHỜ cho tới lúc xô rót lại, hay được phục vụ ngay từ xô rồi mới bị từ chối. Và mã từ chối mặc định 503 cũng là điều SAI để nói với client',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Row A refused nine of ten requests from one ordinary client — almost no real client arrives 500 ms apart, which is why that form rejects legitimate users and fits only where a second request within half a second is definitionally abuse, like a password-reset email. <code>nodelay</code> is right for interactive traffic: a page firing six API calls on load should not have five of them queued. Queueing is right for expensive backends — a report, an image resize, an LLM call — because the client still gets its answer and the backend is never asked to do more than it can. And <code>503 Service Unavailable</code> means "the server is having trouble": monitoring counts it as an error, well-behaved clients back off as if you are down, and a CDN may treat it as an origin failure. What you meant is <code>429</code>. Set <code>limit_req_status 429;</code> and <code>limit_conn_status 429;</code>, and add <code>Retry-After</code> so a client can retry sensibly instead of immediately forever.',
            'Dòng A từ chối chín trên mười request từ MỘT client bình thường — gần như chẳng client thật nào tới cách nhau đúng 500 ms, và đó là lý do cách viết ấy đá nhầm người dùng hợp lệ, chỉ hợp ở những chỗ mà một request thứ hai trong nửa giây đã là lạm dụng theo định nghĩa, như gửi email đặt lại mật khẩu. <code>nodelay</code> đúng cho lưu lượng tương tác: một trang bắn sáu lời gọi API lúc nạp thì không nên có năm cái bị xếp hàng. Xếp hàng thì đúng cho backend đắt đỏ — một bản báo cáo, một lượt đổi cỡ ảnh, một lời gọi LLM — vì client vẫn nhận được câu trả lời và backend không bao giờ bị bắt làm quá sức. Còn <code>503 Service Unavailable</code> nghĩa là "máy chủ đang trục trặc": hệ giám sát đếm nó là LỖI, những client tử tế lùi lại như thể bạn đang chết, và một CDN có thể coi đó là gốc hỏng. Thứ bạn muốn nói là <code>429</code>. Hãy đặt <code>limit_req_status 429;</code> và <code>limit_conn_status 429;</code>, kèm <code>Retry-After</code> để client thử lại một cách có ý tứ thay vì thử lại tức khắc mãi mãi.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            "<p><b>Q31 — Implement <code>try_files</code>, element by element (chapter 4).</b> A single <code>try_files</code> line decides between a file, a directory, a redirect, a fallback URI, a named location and a bare status code — and the element that decides is very often not the one people expect. Implement the rule, then run it over a list of URIs. Every expected line below was produced by the real nginx/1.27.5 against exactly this file tree and these six blocks.</p>" +
            "<p><code>thu(uri)</code> first picks the block whose <code>tienTo</code> is the LONGEST prefix of the URI, then walks that block's <code>ds</code> list from left to right and returns <code>{ ma, pt, nguon }</code> — the status, the 1-based position of the element that decided, and what was served:</p>" +
            "<ul>" +
            "<li><code>'$uri'</code> — substitute the URI and test it as a FILE. A file gives 200 and <code>nguon</code> is that path; anything else moves on to the next element.</li>" +
            "<li><code>'$uri/'</code> — test the URI with a trailing slash as a DIRECTORY. Not a directory: move on. A directory, and the request did NOT end in a slash: 301, <code>nguon</code> is <code>'-'</code>. A directory whose <code>index.html</code> exists: 200 on that index file. A directory with no index: 403 and <code>nguon</code> is <code>'-'</code> (autoindex is off).</li>" +
            "<li>Any other written-out path, e.g. <code>'$uri/index.html'</code> or <code>'/t4/macdinh.html'</code> — substitute <code>$uri</code> if present, then test as a file.</li>" +
            "<li>The LAST element is not a test, it is what happens when everything before it failed. <code>'=404'</code> returns that status with <code>nguon</code> <code>'-'</code>. <code>'@app'</code> returns 200 with <code>nguon</code> <code>'@app uri=' + uri</code> — the named location sees the ORIGINAL URI. Anything else is an internal redirect to that URI: 200 on the file if it exists, 404 if it does not.</li>" +
            "<li>Nothing matched at all: <code>{ ma: 404, pt: 0, nguon: '-' }</code>.</li>" +
            "</ul>" +
            "<p><code>demMa(uris)</code> returns one string counting how many URIs ended on each status, keys ascending, in the form <code>\"200=11 404=2\"</code>.</p>" +
            "<p>Keep the given data and the printing block exactly as they are, and do not install anything.</p>",

            "<p><b>Câu 31 — Cài đặt <code>try_files</code>, từng phần tử một (chương 4).</b> Một dòng <code>try_files</code> duy nhất phân xử giữa một tệp, một thư mục, một cú chuyển hướng, một URI dự phòng, một location có tên và một mã trạng thái trơ — và cái phần tử quyết định thường KHÔNG phải cái người ta nghĩ. Hãy cài đặt đúng luật ấy rồi cho chạy trên một loạt URI. Mọi dòng kết quả mong đợi bên dưới đều do chính nginx/1.27.5 thật sinh ra với đúng cây tệp này và đúng sáu khối này.</p>" +
            "<p><code>thu(uri)</code> trước hết chọn khối có <code>tienTo</code> là tiền tố DÀI NHẤT của URI, rồi duyệt danh sách <code>ds</code> của khối đó từ trái sang phải và trả về <code>{ ma, pt, nguon }</code> — mã trạng thái, vị trí (đếm từ 1) của phần tử đã quyết định, và thứ đã được phục vụ:</p>" +
            "<ul>" +
            "<li><code>'$uri'</code> — thay URI vào rồi thử như một TỆP. Là tệp thì 200 và <code>nguon</code> là đường dẫn đó; còn lại thì đi tiếp sang phần tử sau.</li>" +
            "<li><code>'$uri/'</code> — thử URI kèm dấu gạch chéo cuối như một THƯ MỤC. Không phải thư mục: đi tiếp. Là thư mục mà request KHÔNG kết thúc bằng dấu gạch chéo: 301, <code>nguon</code> là <code>'-'</code>. Là thư mục và có <code>index.html</code>: 200 trên chính tệp index đó. Là thư mục mà không có index: 403 và <code>nguon</code> là <code>'-'</code> (autoindex đang tắt).</li>" +
            "<li>Mọi đường dẫn viết thẳng ra khác, ví dụ <code>'$uri/index.html'</code> hay <code>'/t4/macdinh.html'</code> — thay <code>$uri</code> nếu có rồi thử như một tệp.</li>" +
            "<li>Phần tử CUỐI không phải một phép thử, nó là điều xảy ra khi mọi thứ trước nó đều trượt. <code>'=404'</code> trả về đúng mã đó với <code>nguon</code> là <code>'-'</code>. <code>'@app'</code> trả về 200 với <code>nguon</code> là <code>'@app uri=' + uri</code> — location có tên nhìn thấy URI GỐC. Còn lại là một cú chuyển hướng nội bộ tới URI ấy: 200 trên tệp đó nếu nó tồn tại, 404 nếu không.</li>" +
            "<li>Không có gì khớp cả: <code>{ ma: 404, pt: 0, nguon: '-' }</code>.</li>" +
            "</ul>" +
            "<p><code>demMa(uris)</code> trả về MỘT chuỗi đếm xem mỗi mã trạng thái kết thúc bao nhiêu URI, khoá tăng dần, dạng <code>\"200=11 404=2\"</code>.</p>" +
            "<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không cài thêm thư viện nào.</p>",
          ),
          starterCode:
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "// Cây tệp thật trên đĩa lúc đo. 'tep' = tệp thường, 'thu-muc' = thư mục.\n" +
            "const DIA = {\n" +
            "  '/t1/co.txt': 'tep',\n" +
            "  '/t1/thumuc/': 'thu-muc',\n" +
            "  '/t1/thumuc/index.html': 'tep',\n" +
            "  '/t1/rong/': 'thu-muc',\n" +
            "  '/t2/co.txt': 'tep',\n" +
            "  '/t3/co.txt': 'tep',\n" +
            "  '/t4/co.txt': 'tep',\n" +
            "  '/t4/macdinh.html': 'tep',\n" +
            "  '/t5/co.txt': 'tep',\n" +
            "  '/t6/thumuc/': 'thu-muc',\n" +
            "  '/t6/thumuc/index.html': 'tep',\n" +
            "  '/duphong.html': 'tep',\n" +
            "};\n" +
            "\n" +
            "// Sáu khối location, mỗi khối một dòng try_files, đúng như đã nạp vào nginx.\n" +
            "const KHOI = [\n" +
            "  { tienTo: '/t1/', ds: ['$uri', '$uri/', '=404'] },\n" +
            "  { tienTo: '/t2/', ds: ['$uri', '/duphong.html'] },\n" +
            "  { tienTo: '/t3/', ds: ['$uri', '@app'] },\n" +
            "  { tienTo: '/t4/', ds: ['$uri', '$uri/index.html', '/t4/macdinh.html', '=403'] },\n" +
            "  { tienTo: '/t5/', ds: ['$uri', '/khong-ton-tai.html'] },\n" +
            "  { tienTo: '/t6/', ds: ['$uri', '$uri/', '/t1/co.txt'] },\n" +
            "];\n" +
            "\n" +
            "const URIS = [\n" +
            "  '/t1/co.txt', '/t1/thieu.txt', '/t1/thumuc', '/t1/thumuc/', '/t1/rong/',\n" +
            "  '/t2/co.txt', '/t2/thieu.txt',\n" +
            "  '/t3/co.txt', '/t3/thieu.txt',\n" +
            "  '/t4/co.txt', '/t4/thieu.txt',\n" +
            "  '/t5/co.txt', '/t5/thieu.txt',\n" +
            "  '/t6/thumuc/', '/t6/thieu.txt',\n" +
            "];\n" +
            "\n" +
            "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
            "\n" +
            "function thu(uri) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function demMa(uris) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "for (const u of URIS) {\n" +
            "  const r = thu(u);\n" +
            "  console.log(u.padEnd(15), r.ma, 'pt=' + r.pt, r.nguon);\n" +
            "}\n" +
            "console.log('demMa:', demMa(URIS));",
          expectedOutput:
            "/t1/co.txt      200 pt=1 /t1/co.txt\n" +
            "/t1/thieu.txt   404 pt=3 -\n" +
            "/t1/thumuc      301 pt=2 -\n" +
            "/t1/thumuc/     200 pt=2 /t1/thumuc/index.html\n" +
            "/t1/rong/       403 pt=2 -\n" +
            "/t2/co.txt      200 pt=1 /t2/co.txt\n" +
            "/t2/thieu.txt   200 pt=2 /duphong.html\n" +
            "/t3/co.txt      200 pt=1 /t3/co.txt\n" +
            "/t3/thieu.txt   200 pt=2 @app uri=/t3/thieu.txt\n" +
            "/t4/co.txt      200 pt=1 /t4/co.txt\n" +
            "/t4/thieu.txt   200 pt=3 /t4/macdinh.html\n" +
            "/t5/co.txt      200 pt=1 /t5/co.txt\n" +
            "/t5/thieu.txt   404 pt=2 -\n" +
            "/t6/thumuc/     200 pt=2 /t6/thumuc/index.html\n" +
            "/t6/thieu.txt   200 pt=3 /t1/co.txt\n" +
            "demMa: 200=11 301=1 403=1 404=2",
          sampleSolution:
            "function chonKhoi(uri) {\n" +
            "  let nho = null;\n" +
            "  for (const k of KHOI) {\n" +
            "    if (!uri.startsWith(k.tienTo)) continue;\n" +
            "    if (!nho || k.tienTo.length > nho.tienTo.length) nho = k;\n" +
            "  }\n" +
            "  return nho;\n" +
            "}\n" +
            "\n" +
            "function laTep(p) { return DIA[p] === 'tep'; }\n" +
            "function laThuMuc(p) { return DIA[p] === 'thu-muc'; }\n" +
            "\n" +
            "function thu(uri) {\n" +
            "  const khoi = chonKhoi(uri);\n" +
            "  if (!khoi) return { ma: 404, pt: 0, nguon: '-' };\n" +
            "  const n = khoi.ds.length;\n" +
            "\n" +
            "  for (let i = 0; i < n; i++) {\n" +
            "    const pt = khoi.ds[i];\n" +
            "    const cuoi = i === n - 1;\n" +
            "\n" +
            "    if (cuoi && pt.startsWith('=')) return { ma: Number(pt.slice(1)), pt: i + 1, nguon: '-' };\n" +
            "    if (cuoi && pt.startsWith('@')) return { ma: 200, pt: i + 1, nguon: pt + ' uri=' + uri };\n" +
            "\n" +
            "    if (pt === '$uri/') {\n" +
            "      const d = uri.endsWith('/') ? uri : uri + '/';\n" +
            "      if (!laThuMuc(d)) continue;\n" +
            "      if (!uri.endsWith('/')) return { ma: 301, pt: i + 1, nguon: '-' };\n" +
            "      if (laTep(d + 'index.html')) return { ma: 200, pt: i + 1, nguon: d + 'index.html' };\n" +
            "      return { ma: 403, pt: i + 1, nguon: '-' };\n" +
            "    }\n" +
            "\n" +
            "    const duong = pt.replace('$uri', uri);\n" +
            "    if (!cuoi) {\n" +
            "      if (laTep(duong)) return { ma: 200, pt: i + 1, nguon: duong };\n" +
            "      continue;\n" +
            "    }\n" +
            "    // Phần tử CUỐI là một URI: chuyển hướng nội bộ, chạy lại từ đầu.\n" +
            "    return laTep(duong)\n" +
            "      ? { ma: 200, pt: i + 1, nguon: duong }\n" +
            "      : { ma: 404, pt: i + 1, nguon: '-' };\n" +
            "  }\n" +
            "  return { ma: 404, pt: 0, nguon: '-' };\n" +
            "}\n" +
            "\n" +
            "function demMa(uris) {\n" +
            "  const d = {};\n" +
            "  for (const u of uris) { const m = thu(u).ma; d[m] = (d[m] || 0) + 1; }\n" +
            "  return Object.keys(d).map(Number).sort((a, b) => a - b).map((k) => k + '=' + d[k]).join(' ');\n" +
            "}",
          rubric: RUBRIC_CODE,
        }),
        codeQ({
          points: 5,
          language: 'javascript',
          prompt: B(
            "<p><b>Q32 — Decide what the cache stores, and under which key (chapter 5).</b> A caching proxy makes two separate decisions on every response: what string identifies it, and whether it may be kept at all. Both are decided by rules that override each other in a fixed order, and one of them ignores the header you were counting on. Implement <code>quyetDinh(ca)</code>. Every expected line below was measured on nginx/1.27.5 by sending each request TWICE and reading <code>$upstream_cache_status</code> off the second one.</p>" +
            "<p>Return <code>{ khoa, luu, lyDo, lan2 }</code>:</p>" +
            "<ul>" +
            "<li><code>khoa</code> is the default cache key <code>$scheme$proxy_host$request_uri</code>, i.e. the literal string <code>'http' + PROXY_HOST + ca.ru</code>. It is byte-exact: it is built from what the CLIENT asked for, not from the path the upstream received, and nothing about it is normalised.</li>" +
            "<li>A method other than <code>GET</code> or <code>HEAD</code> never reaches the cache at all: <code>luu</code> is <code>'khong'</code>, <code>lyDo</code> is <code>'phuong-thuc'</code> and <code>lan2</code> is the EMPTY string — the variable is unset, which is not the same as <code>BYPASS</code>.</li>" +
            "<li>Otherwise walk the precedence chain and stop at the first rule that speaks. <b>1)</b> <code>X-Accel-Expires</code> present: store when its number is above zero, do not when it is zero; <code>lyDo</code> is <code>'x-accel-expires'</code>. This wins over everything below it, including <code>no-store</code>. <b>2)</b> <code>Cache-Control</code> containing <code>no-store</code>, <code>no-cache</code>, <code>private</code> or <code>max-age=0</code>: do not store; <code>'cache-control'</code>. <b>3)</b> A <code>Set-Cookie</code> header: do not store; <code>'set-cookie'</code>. <b>4)</b> An <code>Expires</code> header: store when it is <code>'tuong-lai'</code>, do not when it is <code>'qua-khu'</code>; <code>'expires'</code>. <b>5)</b> <code>Cache-Control: max-age=N</code> with N above zero: store; <code>'cache-control'</code>. <b>6)</b> The status is in <code>MA_LUU_DUOC</code>: store; <code>'proxy-cache-valid'</code>. <b>7)</b> Otherwise do not store; <code>'ma-khong-khai'</code>.</li>" +
            "<li><code>lan2</code> is <code>'HIT'</code> when it was stored and <code>'MISS'</code> when it was not.</li>" +
            "</ul>" +
            "<p><code>demLan2(list)</code> returns one string counting the second-request statuses, keys sorted alphabetically, with the empty one counted as <code>RONG</code>, in the form <code>\"HIT=7 MISS=8 RONG=1\"</code>.</p>" +
            "<p>Keep the given data and the printing block exactly as they are, and do not install anything.</p>",

            "<p><b>Câu 32 — Quyết định bộ đệm cất giữ cái gì, và cất dưới khoá nào (chương 5).</b> Một proxy có bộ đệm ra HAI quyết định riêng biệt trên mỗi phản hồi: chuỗi nào định danh nó, và nó có được phép giữ lại hay không. Cả hai đều do những luật đè lên nhau theo một thứ tự cố định quyết định, và có một luật phớt lờ đúng cái header bạn đang trông cậy. Hãy cài đặt <code>quyetDinh(ca)</code>. Mọi dòng kết quả mong đợi bên dưới đều đo trên nginx/1.27.5 bằng cách gửi mỗi request HAI lần rồi đọc <code>$upstream_cache_status</code> ở lần thứ hai.</p>" +
            "<p>Trả về <code>{ khoa, luu, lyDo, lan2 }</code>:</p>" +
            "<ul>" +
            "<li><code>khoa</code> là khoá bộ đệm mặc định <code>$scheme$proxy_host$request_uri</code>, tức đúng chuỗi <code>'http' + PROXY_HOST + ca.ru</code>. Nó chính xác tới từng byte: nó dựng từ thứ CLIENT hỏi, không phải từ đường dẫn mà upstream nhận được, và không có gì trong đó được chuẩn hoá cả.</li>" +
            "<li>Một phương thức khác <code>GET</code> hay <code>HEAD</code> thì không hề chạm tới bộ đệm: <code>luu</code> là <code>'khong'</code>, <code>lyDo</code> là <code>'phuong-thuc'</code> và <code>lan2</code> là chuỗi RỖNG — biến đó không được đặt, và đó không giống <code>BYPASS</code>.</li>" +
            "<li>Còn lại thì đi dọc chuỗi ưu tiên và DỪNG ở luật đầu tiên lên tiếng. <b>1)</b> Có <code>X-Accel-Expires</code>: cất khi số của nó lớn hơn 0, không cất khi bằng 0; <code>lyDo</code> là <code>'x-accel-expires'</code>. Luật này thắng mọi luật dưới nó, kể cả <code>no-store</code>. <b>2)</b> <code>Cache-Control</code> có chứa <code>no-store</code>, <code>no-cache</code>, <code>private</code> hay <code>max-age=0</code>: không cất; <code>'cache-control'</code>. <b>3)</b> Có header <code>Set-Cookie</code>: không cất; <code>'set-cookie'</code>. <b>4)</b> Có header <code>Expires</code>: cất khi nó là <code>'tuong-lai'</code>, không cất khi nó là <code>'qua-khu'</code>; <code>'expires'</code>. <b>5)</b> <code>Cache-Control: max-age=N</code> với N lớn hơn 0: cất; <code>'cache-control'</code>. <b>6)</b> Mã trạng thái nằm trong <code>MA_LUU_DUOC</code>: cất; <code>'proxy-cache-valid'</code>. <b>7)</b> Còn lại thì không cất; <code>'ma-khong-khai'</code>.</li>" +
            "<li><code>lan2</code> là <code>'HIT'</code> khi đã cất và <code>'MISS'</code> khi không.</li>" +
            "</ul>" +
            "<p><code>demLan2(list)</code> trả về MỘT chuỗi đếm trạng thái của lần gọi thứ hai, khoá xếp theo bảng chữ cái, cái rỗng đếm vào tên <code>RONG</code>, dạng <code>\"HIT=7 MISS=8 RONG=1\"</code>.</p>" +
            "<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không cài thêm thư viện nào.</p>",
          ),
          starterCode:
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "// Khối đo: proxy_cache_valid 200 302 10m;  proxy_cache_valid 404 1m;\n" +
            "// proxy_pass http://up/;  (không khai proxy_cache_key ⇒ dùng khoá mặc định)\n" +
            "const MA_LUU_DUOC = [200, 302, 404];\n" +
            "const PROXY_HOST = 'up';\n" +
            "\n" +
            "// Mười sáu lượt đã chạy thật. `duoi` là thứ upstream trả về.\n" +
            "const CAC_CA = [\n" +
            "  { ten: 'a1',  pt: 'GET',  ru: '/c/a1',                     duoi: { ma: 200, h: {} } },\n" +
            "  { ten: 'a2',  pt: 'GET',  ru: '/c/a2?cc=max-age%3D60',     duoi: { ma: 200, h: { 'Cache-Control': 'max-age=60' } } },\n" +
            "  { ten: 'a3',  pt: 'GET',  ru: '/c/a3?cc=no-store',         duoi: { ma: 200, h: { 'Cache-Control': 'no-store' } } },\n" +
            "  { ten: 'a4',  pt: 'GET',  ru: '/c/a4?cc=no-cache',         duoi: { ma: 200, h: { 'Cache-Control': 'no-cache' } } },\n" +
            "  { ten: 'a5',  pt: 'GET',  ru: '/c/a5?cc=private',          duoi: { ma: 200, h: { 'Cache-Control': 'private' } } },\n" +
            "  { ten: 'a6',  pt: 'GET',  ru: '/c/a6?cc=max-age%3D0',      duoi: { ma: 200, h: { 'Cache-Control': 'max-age=0' } } },\n" +
            "  { ten: 'a7',  pt: 'GET',  ru: '/c/a7?sc=sid%3Dabc',        duoi: { ma: 200, h: { 'Set-Cookie': 'sid=abc' } } },\n" +
            "  { ten: 'a9',  pt: 'GET',  ru: '/c/a9?st=404',              duoi: { ma: 404, h: {} } },\n" +
            "  { ten: 'a10', pt: 'GET',  ru: '/c/a10?st=500',             duoi: { ma: 500, h: {} } },\n" +
            "  { ten: 'a11', pt: 'GET',  ru: '/c/a11?st=302',             duoi: { ma: 302, h: {} } },\n" +
            "  { ten: 'a12', pt: 'GET',  ru: '/c/a12?xa=120&cc=no-store', duoi: { ma: 200, h: { 'X-Accel-Expires': '120', 'Cache-Control': 'no-store' } } },\n" +
            "  { ten: 'b1',  pt: 'GET',  ru: '/c/b1?ex=cu',                duoi: { ma: 200, h: { 'Expires': 'qua-khu' } } },\n" +
            "  { ten: 'b2',  pt: 'GET',  ru: '/c/b2?ex=moi',               duoi: { ma: 200, h: { 'Expires': 'tuong-lai' } } },\n" +
            "  { ten: 'a14', pt: 'GET',  ru: '/c/a14?xa=0',               duoi: { ma: 200, h: { 'X-Accel-Expires': '0' } } },\n" +
            "  { ten: 'p1',  pt: 'POST', ru: '/c/p1',                     duoi: { ma: 200, h: {} } },\n" +
            "  { ten: 'p2',  pt: 'GET',  ru: '/c/p2',                     duoi: { ma: 200, h: {} }, xacThuc: true },\n" +
            "];\n" +
            "\n" +
            "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
            "\n" +
            "function quyetDinh(ca) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function demLan2(list) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "for (const ca of CAC_CA) {\n" +
            "  const r = quyetDinh(ca);\n" +
            "  console.log(ca.ten.padEnd(4), r.luu.padEnd(6), (r.lan2 || '-').padEnd(5), r.lyDo.padEnd(18), r.khoa);\n" +
            "}\n" +
            "console.log('demLan2:', demLan2(CAC_CA));",
          expectedOutput:
            "a1   co     HIT   proxy-cache-valid  httpup/c/a1\n" +
            "a2   co     HIT   cache-control      httpup/c/a2?cc=max-age%3D60\n" +
            "a3   khong  MISS  cache-control      httpup/c/a3?cc=no-store\n" +
            "a4   khong  MISS  cache-control      httpup/c/a4?cc=no-cache\n" +
            "a5   khong  MISS  cache-control      httpup/c/a5?cc=private\n" +
            "a6   khong  MISS  cache-control      httpup/c/a6?cc=max-age%3D0\n" +
            "a7   khong  MISS  set-cookie         httpup/c/a7?sc=sid%3Dabc\n" +
            "a9   co     HIT   proxy-cache-valid  httpup/c/a9?st=404\n" +
            "a10  khong  MISS  ma-khong-khai      httpup/c/a10?st=500\n" +
            "a11  co     HIT   proxy-cache-valid  httpup/c/a11?st=302\n" +
            "a12  co     HIT   x-accel-expires    httpup/c/a12?xa=120&cc=no-store\n" +
            "b1   khong  MISS  expires            httpup/c/b1?ex=cu\n" +
            "b2   co     HIT   expires            httpup/c/b2?ex=moi\n" +
            "a14  khong  MISS  x-accel-expires    httpup/c/a14?xa=0\n" +
            "p1   khong  -     phuong-thuc        httpup/c/p1\n" +
            "p2   co     HIT   proxy-cache-valid  httpup/c/p2\n" +
            "demLan2: HIT=7 MISS=8 RONG=1",
          sampleSolution:
            "function dungKhoa(ca) { return 'http' + PROXY_HOST + ca.ru; }\n" +
            "\n" +
            "function quyetDinh(ca) {\n" +
            "  const khoa = dungKhoa(ca);\n" +
            "  if (ca.pt !== 'GET' && ca.pt !== 'HEAD') {\n" +
            "    return { khoa, luu: 'khong', lyDo: 'phuong-thuc', lan2: '' };\n" +
            "  }\n" +
            "  const h = ca.duoi.h || {};\n" +
            "  const xa = h['X-Accel-Expires'];\n" +
            "  const cc = h['Cache-Control'] || '';\n" +
            "  let luu, lyDo;\n" +
            "\n" +
            "  if (xa !== undefined) {\n" +
            "    luu = Number(xa) > 0 ? 'co' : 'khong';\n" +
            "    lyDo = 'x-accel-expires';\n" +
            "  } else if (/no-store|no-cache|private|max-age=0/.test(cc)) {\n" +
            "    luu = 'khong'; lyDo = 'cache-control';\n" +
            "  } else if (h['Set-Cookie'] !== undefined) {\n" +
            "    luu = 'khong'; lyDo = 'set-cookie';\n" +
            "  } else if (h['Expires'] !== undefined) {\n" +
            "    luu = h['Expires'] === 'tuong-lai' ? 'co' : 'khong';\n" +
            "    lyDo = 'expires';\n" +
            "  } else if (/max-age=(\\d+)/.test(cc)) {\n" +
            "    luu = 'co'; lyDo = 'cache-control';\n" +
            "  } else if (MA_LUU_DUOC.includes(ca.duoi.ma)) {\n" +
            "    luu = 'co'; lyDo = 'proxy-cache-valid';\n" +
            "  } else {\n" +
            "    luu = 'khong'; lyDo = 'ma-khong-khai';\n" +
            "  }\n" +
            "  return { khoa, luu, lyDo, lan2: luu === 'co' ? 'HIT' : 'MISS' };\n" +
            "}\n" +
            "\n" +
            "function demLan2(list) {\n" +
            "  const d = {};\n" +
            "  for (const ca of list) {\n" +
            "    const k = quyetDinh(ca).lan2 || 'RONG';\n" +
            "    d[k] = (d[k] || 0) + 1;\n" +
            "  }\n" +
            "  return Object.keys(d).sort().map((k) => k + '=' + d[k]).join(' ');\n" +
            "}",
          rubric: RUBRIC_CODE,
        }),
      ],
    },
  ],
};
