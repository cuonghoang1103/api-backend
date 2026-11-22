/**
 * 2.7 — Kiểm tra Chương 2 (soạn 22/11/2026). 10 câu; đáp án dựa trên output chạy thật của bài 2.1–2.6
 * (spring1.txt, DonHang.java, mini-tien, Express 4.22.2, tsc 5.9.3 + --enable-source-maps, Python 3.15). Phân bố đáp án: A2 B3 C3 D2.
 */
export default {
  title: '2.7 — Chapter 2 quiz|||2.7 — Kiểm tra Chương 2',
  slug: 'dbg-2-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: tìm gốc trong chuỗi Caused by, "... n more", <local1> trong NPE, frame trên cùng nằm trong thư viện, lỗi async của Express 4, source map, đọc traceback Python, "During handling", chọn chuỗi để tra cứu, stack trace lộ ra client.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, all taken from traces you produced in this chapter. Read the explanation after submitting.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can find my own frames in a trace and tell "exploded here" from "caused here".</li>
<li>I read Java chains from the last Caused by, and Python chains from the first block.</li>
<li>I can explain <code>... 14 more</code> and <code>&lt;local1&gt;</code>.</li>
<li>I know why an Express 4 async error can kill the server, and how to fix it.</li>
<li>I can make a TypeScript trace point to the <code>.ts</code> file.</li>
<li>I clean an error before searching it, and I know how stack traces leak to clients.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, đều lấy từ các trace bạn đã tạo ra trong chương này. Đọc phần giải thích sau khi nộp.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi tìm được frame của mình trong trace và phân biệt "nổ ở đây" với "sinh ra ở đây".</li>
<li>Tôi đọc chuỗi Java từ Caused by cuối, chuỗi Python từ khối đầu.</li>
<li>Tôi giải thích được <code>... 14 more</code> và <code>&lt;local1&gt;</code>.</li>
<li>Tôi biết vì sao lỗi async trong Express 4 có thể giết server, và cách sửa.</li>
<li>Tôi làm được cho trace TypeScript trỏ về tệp <code>.ts</code>.</li>
<li>Tôi làm sạch lỗi trước khi tra, và biết stack trace lộ ra client thế nào.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A Spring app fails to start: BeanCreationException → Caused by: BeanInstantiationException → Caused by: NumberFormatException: For input string: "30 chỗ". Which is the root cause?|||Ứng dụng Spring không khởi động: BeanCreationException → Caused by: BeanInstantiationException → Caused by: NumberFormatException: For input string: "30 chỗ". Đâu là nguyên nhân gốc?',
        options: [
          'BeanCreationException — it is the first line|||BeanCreationException — vì nó là dòng đầu',
          'BeanInstantiationException — it is in the middle|||BeanInstantiationException — vì nó nằm giữa',
          'NumberFormatException for "30 chỗ" — the last Caused by|||NumberFormatException với "30 chỗ" — Caused by cuối cùng',
          'The frame UngDung.main(UngDung.java:11)|||Frame UngDung.main(UngDung.java:11)',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: In Java chains each Caused by is one more "because"; the last one is the root. Your first frame inside it (CauHinhPhong.java:11) is the line to fix. The first line names the wrapper, and UngDung.java:11 only shows that it happened during start-up.|||VI: Trong chuỗi Java, mỗi Caused by là thêm một chữ "vì"; cái cuối là gốc. Frame đầu tiên của bạn trong đó (CauHinhPhong.java:11) là dòng cần sửa. Dòng đầu chỉ gọi tên lớp bọc, còn UngDung.java:11 chỉ cho biết lỗi xảy ra lúc khởi động.',
      },
      {
        question: 'A Caused by block ends with "... 14 more". What does it mean?|||Một khối Caused by kết thúc bằng "... 14 more". Nghĩa là gì?',
        options: [
          'Its remaining 14 frames are identical to the enclosing trace’s last 14 frames, so they are not repeated|||14 frame còn lại của nó giống hệt 14 frame cuối của trace bao ngoài, nên không in lại',
          '14 more exceptions were thrown and hidden|||Còn 14 ngoại lệ nữa bị ném ra và bị giấu',
          'The JVM ran out of memory for the trace|||JVM hết bộ nhớ để in trace',
          'You must enable debug logging to see 14 hidden lines|||Phải bật log debug mới thấy 14 dòng bị giấu',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Throwable.printStackTrace folds frames shared with the enclosing exception. Nothing is lost — scroll up. It is not a count of other exceptions.|||VI: Throwable.printStackTrace gộp các frame chung với ngoại lệ bao ngoài. Không mất gì — kéo lên trên là thấy. Nó không phải số lượng ngoại lệ khác.',
      },
      {
        question: 'java DonHang.java prints: Cannot invoke "String.toUpperCase()" because "<local1>.khach.diaChi" is null. Why <local1> and not a variable name?|||java DonHang.java in: Cannot invoke "String.toUpperCase()" because "<local1>.khach.diaChi" is null. Vì sao là <local1> mà không phải tên biến?',
        options: [
          'The variable was declared with var|||Biến được khai báo bằng var',
          'Helpful NPE only works for fields, never for locals|||Helpful NPE chỉ chạy với trường, không bao giờ với biến cục bộ',
          'The JVM hides names for security|||JVM giấu tên vì lý do bảo mật',
          'The class was compiled without debug information (-g), so local variable names are unknown|||Lớp được biên dịch không có thông tin debug (-g), nên JVM không biết tên biến cục bộ',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Running a source file directly compiles it without -g. Compiled with javac -g, the same program printed "don.khach.diaChi". Maven/Gradle include debug info by default, so real projects show names.|||VI: Chạy thẳng tệp nguồn là biên dịch không có -g. Biên dịch bằng javac -g, cùng chương trình in "don.khach.diaChi". Maven/Gradle mặc định có thông tin debug, nên dự án thật hiện tên.',
      },
      {
        question: 'The top frame of a Node trace is inside node_modules/mini-tien/index.js. What do you do next?|||Frame trên cùng của một trace Node nằm trong node_modules/mini-tien/index.js. Bạn làm gì tiếp?',
        options: [
          'Edit the library file to add a null check|||Sửa tệp thư viện, thêm kiểm tra null',
          'Go to your first frame below it and check what value your code passed in|||Xuống frame đầu tiên của bạn bên dưới nó và kiểm code mình đã truyền giá trị gì vào',
          'Reinstall node_modules|||Cài lại node_modules',
          'Open an issue on the library’s GitHub|||Mở issue trên GitHub của thư viện',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: The top frame is where it exploded. In lesson 2.1 the library received undefined because app.js used giaTien instead of gia. Edit your code, not node_modules (your edit would vanish on the next install anyway).|||VI: Frame trên cùng là nơi nổ. Ở bài 2.1 thư viện nhận undefined vì app.js dùng giaTien thay vì gia. Sửa code của bạn, không sửa node_modules (đằng nào lần cài sau cũng mất).',
      },
      {
        question: 'Express 4: an async route throws. curl gets "empty reply" (exit 52), the [error handler] log line never appears, and the server process is gone. Why?|||Express 4: một route async ném lỗi. curl nhận "empty reply" (mã 52), dòng log [error handler] không bao giờ xuất hiện, và tiến trình server mất. Vì sao?',
        options: [
          'The error handler has a bug in its JSON response|||Error handler có lỗi trong phản hồi JSON',
          'curl does not support HTTP 500|||curl không hỗ trợ HTTP 500',
          'Express 4 ignores the rejected promise, so it becomes an unhandled rejection and Node exits|||Express 4 bỏ qua promise bị từ chối, nên nó thành unhandled rejection và Node thoát',
          'The port was already in use|||Cổng đã bị dùng',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: The handler was never reached — a missing expected log line means "not reached". Fix with try/catch + next(err), or Express 5, which forwards rejected promises itself. EADDRINUSE would fail at start-up, not per request.|||VI: Error handler chưa từng được gọi — thiếu một dòng log đáng lẽ phải có nghĩa là "không chạy tới". Sửa bằng try/catch + next(err), hoặc Express 5 vốn tự chuyển promise bị từ chối. EADDRINUSE thì hỏng lúc khởi động, không phải theo từng request.',
      },
      {
        question: 'Your TypeScript service crashes with a trace pointing to dist/tinh-diem.js:5:17. tsconfig already has "sourceMap": true. How do you make the trace point to the .ts file?|||Service TypeScript sập với trace trỏ vào dist/tinh-diem.js:5:17. tsconfig đã có "sourceMap": true. Làm sao để trace trỏ về tệp .ts?',
        options: [
          'Rename dist/tinh-diem.js to .ts|||Đổi tên dist/tinh-diem.js thành .ts',
          'Run node --enable-source-maps dist/tinh-diem.js|||Chạy node --enable-source-maps dist/tinh-diem.js',
          'Add "strict": false|||Thêm "strict": false',
          'Increase --stack-trace-limit|||Tăng --stack-trace-limit',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Plain node ignores .map files. With --enable-source-maps the same crash pointed to src/tinh-diem.ts:7:15. A higher stack limit shows more frames, not original lines.|||VI: node trần bỏ qua tệp .map. Với --enable-source-maps, cùng lần sập đó trỏ về src/tinh-diem.ts:7:15. Tăng giới hạn stack chỉ cho thêm frame, không cho dòng gốc.',
      },
      {
        question: 'In a single (not chained) Python traceback, where are the exception type and message?|||Trong một traceback Python đơn (không lồng nhau), loại ngoại lệ và thông điệp nằm ở đâu?',
        options: [
          'On the first line, after "Traceback"|||Ở dòng đầu, sau chữ "Traceback"',
          'In the middle, next to <module>|||Ở giữa, cạnh <module>',
          'They are not printed; you must use a debugger|||Không được in; phải dùng debugger',
          'On the last line|||Ở dòng cuối',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Python prints "most recent call last": the frames oldest first, then the type and message on the final line (e.g. KeyError: ‘SE1899’). The frame just above it is where it exploded.|||VI: Python in "most recent call last": frame cũ nhất trước, rồi loại và thông điệp ở dòng cuối (vd KeyError: ‘SE1899’). Frame ngay trên đó là nơi nổ.',
      },
      {
        question: 'A Python output shows two tracebacks joined by "During handling of the above exception, another exception occurred". What does it tell you?|||Output Python có hai traceback nối bằng "During handling of the above exception, another exception occurred". Nó cho biết gì?',
        options: [
          'The code that handled the first error crashed itself — an accidental second bug, and both need attention|||Chính đoạn xử lý lỗi thứ nhất bị sập — một lỗi thứ hai ngoài ý muốn, cả hai đều cần xem',
          'The developer wrapped the error on purpose with raise … from|||Lập trình viên cố ý bọc lỗi bằng raise … from',
          'Python retried the operation and succeeded|||Python đã thử lại và thành công',
          'Only the second traceback matters|||Chỉ traceback thứ hai mới quan trọng',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: "During handling…" means implicit chaining: in lesson 2.4 the except block for FileNotFoundError hit NameError: MAC_DINH. Deliberate wrapping prints "The above exception was the direct cause of the following exception".|||VI: "During handling…" là chuỗi ngầm: ở bài 2.4 khối except cho FileNotFoundError gặp NameError: MAC_DINH. Bọc có chủ đích thì in "The above exception was the direct cause of the following exception".',
      },
      {
        question: 'Which text is the best to paste into a search engine?|||Đoạn nào tốt nhất để dán vào máy tìm kiếm?',
        options: [
          'The whole log line, including time, request id and user email|||Nguyên dòng log, kèm giờ, mã request và email người dùng',
          'Only the absolute path /home/an/projects/ctw-booking/src/service/datLich.js:19:55|||Chỉ đường dẫn tuyệt đối /home/an/projects/ctw-booking/src/service/datLich.js:19:55',
          '"toISOString is not a function" node|||"toISOString is not a function" node',
          'The word "TypeError"|||Chữ "TypeError"',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Search the stable, specific part plus the technology. Times, ids, emails and your paths exist only on your machine (and leak data); "TypeError" alone is far too general.|||VI: Tra phần ổn định và cụ thể, cộng tên công nghệ. Giờ, id, email và đường dẫn chỉ có trên máy bạn (lại còn lộ dữ liệu); chỉ "TypeError" thì quá chung chung.',
      },
      {
        question: 'An Express 4 API started without NODE_ENV returns an HTML page with the full stack trace to any client that triggers an error. What is the right fix?|||Một API Express 4 chạy mà không đặt NODE_ENV trả về trang HTML kèm nguyên stack trace cho bất kỳ client nào gây ra lỗi. Cách sửa đúng là gì?',
        options: [
          'Nothing — attackers cannot use file paths|||Không cần — kẻ tấn công không dùng được đường dẫn tệp',
          'Set NODE_ENV=production and use your own error handler that logs details on the server and returns a generic message + reference id|||Đặt NODE_ENV=production và dùng error handler riêng ghi chi tiết ở server, trả thông điệp chung + mã tham chiếu',
          'Wrap the whole app in try/catch and return err.stack as JSON|||Bọc cả app trong try/catch và trả err.stack dạng JSON',
          'Turn off logging so the stack is never written anywhere|||Tắt log để stack không bao giờ được ghi ở đâu',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: In lesson 2.5 the same app returned only "Internal Server Error" with NODE_ENV=production. Paths, framework and versions are reconnaissance for an attacker. Returning err.stack as JSON is the same leak; turning off logs removes your own evidence.|||VI: Ở bài 2.5, cùng ứng dụng đó chỉ trả "Internal Server Error" khi có NODE_ENV=production. Đường dẫn, framework và phiên bản là tài liệu trinh sát cho kẻ tấn công. Trả err.stack dạng JSON vẫn là lộ y như vậy; tắt log là xoá bằng chứng của chính bạn.',
      },
    ],
  },
};
