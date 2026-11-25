/**
 * 3.7 — Kiểm tra Chương 3 (soạn 24/11/2026). 10 câu; đáp án dựa trên output chạy thật của bài 3.1–3.6
 * (Node v22.22.2, VS Code 1.129 / js-debug 1.117, Prisma 6.19.3, Vite 8.3.8, React 19.3.1, Next.js 16.4.6). Phân bố đáp án: A3 B2 C3 D2.
 */
export default {
  title: '3.7 — Chapter 3 quiz|||3.7 — Kiểm tra Chương 3',
  slug: 'dbg-3-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: launch hay attach, NODE_OPTIONS với npm script, breakpoint .ts xám, điều kiện vs đếm lượt, logpoint, ngoại lệ caught, skipFiles, Restart Frame với async, attach trong Docker (remoteRoot), bảo mật cổng 9229, setState cùng mảng.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, all taken from sessions you ran in this chapter. Read the explanation after submitting.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can choose launch or attach and write the launch.json for dist + source maps, npm scripts and nodemon.</li>
<li>I pick the breakpoint kind from the question: condition, hit count, logpoint, caught/uncaught exception.</li>
<li>I step over by default and keep library code out with skipFiles.</li>
<li>I can attach to a running process and to a container, and I never expose 9229.</li>
<li>I know when a React click does not re-render, and which side of Next.js a line runs on.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, đều lấy từ các phiên bạn đã chạy trong chương này. Đọc phần giải thích sau khi nộp.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chọn được launch hay attach và viết được launch.json cho dist + source map, npm script và nodemon.</li>
<li>Tôi chọn loại breakpoint theo câu hỏi: điều kiện, đếm lượt, logpoint, ngoại lệ caught/uncaught.</li>
<li>Tôi mặc định step over và loại code thư viện bằng skipFiles.</li>
<li>Tôi gắn được vào tiến trình đang chạy và vào container, và không bao giờ để lộ 9229.</li>
<li>Tôi biết khi nào bấm nút React mà không render lại, và một dòng Next.js chạy ở phía nào.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'You run NODE_OPTIONS="--inspect=127.0.0.1:9229" npm run dev (npm → tsx watch → your app). The terminal shows "Debugger listening…" once, then twice "Starting inspector … failed: address already in use". You attach to 9229; breakpoints never hit. Why?|||Bạn chạy NODE_OPTIONS="--inspect=127.0.0.1:9229" npm run dev (npm → tsx watch → ứng dụng). Terminal in "Debugger listening…" một lần, rồi hai lần "Starting inspector … failed: address already in use". Bạn attach vào 9229; breakpoint không bao giờ dừng. Vì sao?',
        options: [
          'NODE_OPTIONS applies to every Node process; npm itself took the port, so you attached to npm|||NODE_OPTIONS áp cho mọi tiến trình Node; chính npm chiếm cổng, nên bạn đã gắn vào npm',
          'tsx does not support debugging|||tsx không hỗ trợ debug',
          'Port 9229 is blocked by the firewall|||Cổng 9229 bị tường lửa chặn',
          'Breakpoints only work with --inspect-brk|||Breakpoint chỉ chạy với --inspect-brk',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: npm, tsx watch and the app are all Node processes and all read NODE_OPTIONS. The first one (npm) opens 9229; the others fail. Use the JavaScript Debug Terminal (its bootloader gives each process its own port) or pass --inspect only to the last process.|||VI: npm, tsx watch và ứng dụng đều là tiến trình Node và đều đọc NODE_OPTIONS. Cái đầu (npm) mở 9229; các cái sau thất bại. Dùng JavaScript Debug Terminal (bootloader của nó cho mỗi tiến trình một cổng riêng) hoặc chỉ truyền --inspect cho tiến trình cuối.',
      },
      {
        question: 'Your breakpoint in src/services/gioSuDung.ts stays grey ("unbound") when you launch dist/app.js. Which is the most likely cause?|||Breakpoint trong src/services/gioSuDung.ts cứ xám ("unbound") khi bạn launch dist/app.js. Nguyên nhân khả dĩ nhất?',
        options: [
          'TypeScript files cannot be debugged|||Tệp TypeScript không debug được',
          'The process was started with --inspect instead of --inspect-brk|||Tiến trình chạy với --inspect thay vì --inspect-brk',
          'There are no .js.map files (sourceMap off) or outFiles does not match dist|||Không có tệp .js.map (tắt sourceMap) hoặc outFiles không khớp dist',
          'skipFiles contains <node_internals>/**|||skipFiles có <node_internals>/**',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: V8 runs only dist/*.js. VS Code needs the source map to translate gioSuDung.ts:8 to gioSuDung.js:10; without .map files (or with outFiles pointing elsewhere) it cannot place the breakpoint. Also check that dist is not stale.|||VI: V8 chỉ chạy dist/*.js. VS Code cần source map để đổi gioSuDung.ts:8 thành gioSuDung.js:10; thiếu tệp .map (hoặc outFiles trỏ chỗ khác) thì không đặt được breakpoint. Kiểm thêm dist có bị cũ không.',
      },
      {
        question: 'In a loop over 1000 rows, row 500 makes the total NaN. You do not know in advance which row is bad. Which breakpoint finds it fastest and keeps working if the bad row moves?|||Trong vòng lặp 1000 dòng, dòng 500 làm tổng thành NaN. Bạn không biết trước dòng nào hỏng. Breakpoint nào tìm nhanh nhất và vẫn đúng nếu dòng hỏng đổi chỗ?',
        options: [
          'Hit count 500|||Đếm lượt 500',
          'A conditional breakpoint on the symptom: Number.isNaN(Number(p.sucChua))|||Breakpoint điều kiện theo triệu chứng: Number.isNaN(Number(p.sucChua))',
          'A plain breakpoint and pressing F5 until it happens|||Breakpoint thường rồi bấm F5 tới khi gặp',
          'Uncaught exception breakpoint|||Breakpoint ngoại lệ uncaught',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: The symptom condition stops on whichever row produces NaN, here [499, "30 chỗ"]. Hit count only works if you already know the position, and it is counted by VS Code (slower in hot loops). NaN does not throw, so exception breakpoints never stop.|||VI: Điều kiện theo triệu chứng dừng ở bất kỳ dòng nào sinh NaN, ở đây [499, "30 chỗ"]. Đếm lượt chỉ dùng được khi đã biết vị trí, và do VS Code đếm (chậm trong vòng lặp nóng). NaN không ném lỗi nên breakpoint ngoại lệ không bao giờ dừng.',
      },
      {
        question: 'Which statement about logpoints in VS Code is correct?|||Câu nào đúng về logpoint trong VS Code?',
        options: [
          'They are written into your source file and must be removed before committing|||Chúng được ghi vào tệp nguồn và phải xoá trước khi commit',
          'They pause briefly, then continue automatically|||Chúng dừng một chút rồi tự chạy tiếp',
          'They only work in the browser, not in Node|||Chúng chỉ chạy trong trình duyệt, không chạy trong Node',
          'They print a message with {expressions} each time the line runs, without pausing or editing the code|||Chúng in một thông điệp có {biểu thức} mỗi lần dòng chạy, không dừng và không sửa code',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: A logpoint is stored in VS Code, not in the file. Underneath it is a conditional breakpoint whose condition prints and returns false, so V8 never pauses — ideal for timing-sensitive code or a value over time.|||VI: Logpoint lưu trong VS Code, không nằm trong tệp. Bên dưới nó là breakpoint điều kiện mà điều kiện vừa in vừa trả false, nên V8 không bao giờ dừng — hợp cho code nhạy thời gian hay theo dõi một giá trị theo thời gian.',
      },
      {
        question: 'dat-phong.js rejects a valid booking using fallback config values; nothing is printed. With only "Uncaught Exceptions" ticked the debugger never stops. What do you do next?|||dat-phong.js từ chối một lượt đặt hợp lệ dựa trên cấu hình dự phòng; không có gì được in ra. Chỉ tích "Uncaught Exceptions" thì debugger không bao giờ dừng. Bạn làm gì tiếp?',
        options: [
          'Tick "Caught Exceptions" too: the error is thrown and swallowed by a try/catch|||Tích thêm "Caught Exceptions": lỗi bị ném ra rồi bị try/catch nuốt',
          'Conclude there is no error and the config file is ignored by design|||Kết luận không có lỗi và tệp cấu hình bị bỏ qua có chủ đích',
          'Restart Frame on docCauHinh|||Restart Frame ở docCauHinh',
          'Add skipFiles for the config file|||Thêm skipFiles cho tệp cấu hình',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Uncaught only stops when nothing catches. "Caught" stops at JSON.parse with "SyntaxError: Expected double-quoted property name … (line 5 column 1)" — the trailing comma. Root fix: fail loudly instead of silently using a fallback.|||VI: Uncaught chỉ dừng khi không ai bắt. "Caught" dừng ở JSON.parse với "SyntaxError: Expected double-quoted property name … (line 5 column 1)" — dấu phẩy thừa. Sửa gốc: báo lỗi rõ thay vì lặng lẽ dùng cấu hình dự phòng.',
      },
      {
        question: 'You press F11 on "return prisma.datLich.findMany(…)" and land in node_modules/@prisma/client/runtime/library.js, line 29 (16,591 characters long). What is the right move?|||Bạn bấm F11 ở "return prisma.datLich.findMany(…)" và rơi vào node_modules/@prisma/client/runtime/library.js, dòng 29 (dài 16.591 ký tự). Nên làm gì?',
        options: [
          'Keep pressing F11 until you understand Prisma|||Cứ bấm F11 tới khi hiểu Prisma',
          'Delete node_modules and reinstall|||Xoá node_modules và cài lại',
          'Add "${workspaceFolder}/node_modules/**" to skipFiles and inspect the arguments you pass instead|||Thêm "${workspaceFolder}/node_modules/**" vào skipFiles và soi các đối số mình truyền vào',
          'Switch to console.log inside library.js|||Chuyển sang console.log trong library.js',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: The bug is almost always in what you pass to a popular library. skipFiles (CDP setBlackboxPatterns) makes F11 skip library frames; here it showed tuLuc and denLuc are the same instant — an empty range.|||VI: Lỗi gần như luôn nằm ở thứ bạn truyền cho thư viện phổ biến. skipFiles (CDP setBlackboxPatterns) làm F11 bỏ qua khung thư viện; ở đây nó cho thấy tuLuc và denLuc là cùng một thời điểm — khoảng rỗng.',
      },
      {
        question: 'Paused inside lichTrongNgay (an async function), you choose Restart Frame and get "Restarting frame failed". Why?|||Đang dừng trong lichTrongNgay (hàm async), bạn chọn Restart Frame và nhận "Restarting frame failed". Vì sao?',
        options: [
          'Restart Frame needs --inspect-brk|||Restart Frame cần --inspect-brk',
          'V8 cannot rewind an async function; it works on synchronous functions such as tongChoNgoi|||V8 không tua lại được hàm async; nó chạy với hàm đồng bộ như tongChoNgoi',
          'skipFiles blocks it|||skipFiles chặn nó',
          'TypeScript functions cannot be restarted|||Hàm TypeScript không khởi động lại được',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: The state of an async function lives in a suspended promise; V8 refuses to restart it. In the chapter the same command on the sync tongChoNgoi returned to "let tong = 0". For async code: set the breakpoint earlier and send the request again.|||VI: Trạng thái của hàm async nằm trong một promise đang treo; V8 từ chối khởi động lại nó. Trong chương, cùng lệnh đó với hàm đồng bộ tongChoNgoi quay về "let tong = 0". Với code async: đặt breakpoint sớm hơn rồi gửi lại request.',
      },
      {
        question: 'You attach VS Code to Node in a container (code mounted at /app). The debugger shows /app/server.js, but breakpoints you set in your editor never bind. What is missing?|||Bạn gắn VS Code vào Node trong container (code mount ở /app). Debugger hiện /app/server.js nhưng breakpoint đặt trong editor không gắn được. Thiếu gì?',
        options: [
          'The container must run as root|||Container phải chạy bằng root',
          'Publish the port on 0.0.0.0 instead of 127.0.0.1|||Publish cổng trên 0.0.0.0 thay vì 127.0.0.1',
          'Use --inspect-brk inside the container|||Dùng --inspect-brk trong container',
          'localRoot/remoteRoot mapping your folder to /app|||Ánh xạ localRoot/remoteRoot từ thư mục của bạn sang /app',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: VS Code asks for the file by your local path, which does not exist in the container. remoteRoot "/app" + localRoot "${workspaceFolder}/…" tells it the two are the same folder. Never widen the port to 0.0.0.0.|||VI: VS Code hỏi tệp theo đường dẫn trên máy bạn, vốn không tồn tại trong container. remoteRoot "/app" + localRoot "${workspaceFolder}/…" nói cho nó biết hai cái là một thư mục. Đừng bao giờ mở cổng ra 0.0.0.0.',
      },
      {
        question: 'A teammate runs docker run -p 9229:9229 … node --inspect=0.0.0.0:9229 app.js on a shared test server "so everyone can debug". What is the real risk?|||Đồng nghiệp chạy docker run -p 9229:9229 … node --inspect=0.0.0.0:9229 app.js trên máy test dùng chung "cho mọi người cùng debug". Rủi ro thật là gì?',
        options: [
          'Anyone who can reach the port can run arbitrary code in the app (no password), e.g. read env secrets|||Ai với tới cổng là chạy được mã tuỳ ý trong ứng dụng (không mật khẩu), ví dụ đọc bí mật trong env',
          'The app becomes slower by about 5%|||Ứng dụng chậm đi khoảng 5%',
          'Only the logs become visible to others|||Chỉ có log bị người khác thấy',
          'None, because Docker isolates the container|||Không có, vì Docker cô lập container',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: In the chapter 12 lines of CDP (Runtime.evaluate) ran id inside the container: uid=0(root). -p 9229:9229 publishes on all interfaces. Use 127.0.0.1 and an SSH tunnel. CVE-2018-7160 showed even localhost inspectors could be reached via DNS rebinding.|||VI: Trong chương, 12 dòng CDP (Runtime.evaluate) đã chạy id trong container: uid=0(root). -p 9229:9229 publish trên mọi giao diện mạng. Dùng 127.0.0.1 và đường hầm SSH. CVE-2018-7160 cho thấy cả inspector ở localhost cũng bị với tới qua DNS rebinding.',
      },
      {
        question: 'In a React component, a click handler does ds.push(item); setDs(ds). Paused on setDs, ds.length is 2, but the page keeps showing 1 item. Why?|||Trong component React, hàm bấm nút làm ds.push(item); setDs(ds). Dừng ở setDs, ds.length là 2 nhưng trang vẫn hiện 1 mục. Vì sao?',
        options: [
          'Strict Mode cancels the second render|||Strict Mode huỷ lần render thứ hai',
          'The breakpoint stopped the render|||Breakpoint đã chặn lần render',
          'setDs received the same array object; React compares with Object.is, sees no change and skips the re-render|||setDs nhận cùng một object mảng; React so bằng Object.is, thấy không đổi nên bỏ qua render lại',
          'Vite did not reload the module|||Vite chưa tải lại module',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Mutating in place keeps the reference, so Object.is(old, new) is true. setDs([...ds, item]) creates a new array; the real run then showed "2 lượt đặt" and 2 <li>.|||VI: Sửa tại chỗ giữ nguyên tham chiếu, nên Object.is(cũ, mới) là true. setDs([...ds, item]) tạo mảng mới; lần chạy thật khi đó hiện "2 lượt đặt" và 2 <li>.',
      },
    ],
  },
};
