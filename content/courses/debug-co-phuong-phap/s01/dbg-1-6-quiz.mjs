/**
 * 1.6 — Kiểm tra Chương 1 (soạn 22/11/2026). 10 câu tình huống; đáp án kiểm bằng chạy thật trong /tmp/dbg-lab/ch1:
 * câu 2 (diem-tb-sua-bua.js in 6), câu 4 (thu-nho.js trên 1.000 dòng: 10 bước), câu 7 (EADDRINUSE), câu 8 (MODULE_NOT_FOUND),
 * câu 10 (node -e "[9, 10, 7, 25].sort()" ⇒ [ 10, 25, 7, 9 ]). Phân bố đáp án: A2 B3 C3 D2.
 */
export default {
  title: '1.6 — Chapter 1 quiz|||1.6 — Kiểm tra Chương 1',
  slug: 'dbg-1-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống về vòng lặp gỡ lỗi: bước đầu tiên, nhận ra sửa triệu chứng, lỗi "thỉnh thoảng", chia đôi dữ liệu, bẫy JSON.stringify, khoanh theo tầng bằng curl, đọc EADDRINUSE và MODULE_NOT_FOUND, mỗi lần đổi một thứ, sort mặc định.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real work. Every answer was checked by running the code from this chapter. Read the explanation after submitting — especially for the ones you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can name the six steps and the question each one answers.</li>
<li>I can tell a symptom fix from a root-cause fix, and say the cause in one sentence.</li>
<li>I can turn a "sometimes" bug into a script that fails every time.</li>
<li>I can shrink a failing input by halving and know roughly how many steps it takes.</li>
<li>I can place fences at layer boundaries and print types, not only values.</li>
<li>I read the whole error message before forming a hypothesis.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ việc thật. Đáp án câu nào cũng đã được kiểm bằng cách chạy code của chương này. Đọc phần giải thích sau khi nộp — nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi kể được sáu bước và câu hỏi mỗi bước trả lời.</li>
<li>Tôi phân biệt được sửa triệu chứng với sửa nguyên nhân gốc, và nói được nguyên nhân trong một câu.</li>
<li>Tôi biến được lỗi "thỉnh thoảng" thành một script lần nào cũng hỏng.</li>
<li>Tôi thu nhỏ được đầu vào lỗi bằng chia đôi và ước được cần khoảng bao nhiêu bước.</li>
<li>Tôi đặt được rào ở ranh giới tầng và in cả kiểu, không chỉ giá trị.</li>
<li>Tôi đọc hết thông báo lỗi trước khi đặt giả thuyết.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A tester reports: "the order total is wrong with a discount code". What is your FIRST step?|||Tester báo: "tổng đơn bị sai khi dùng mã giảm giá". Bước ĐẦU TIÊN của bạn là gì?',
        options: [
          'Open the discount function and fix the line that looks suspicious|||Mở hàm giảm giá và sửa dòng trông đáng ngờ',
          'Make it happen on demand: a command or fixed steps with the actual vs expected total|||Làm lỗi xảy ra theo ý: một lệnh hoặc các bước cố định, kèm tổng thực tế và mong đợi',
          'Search the tester’s sentence on Stack Overflow|||Tìm câu của tester trên Stack Overflow',
          'Restart the server and ask the tester to try again|||Khởi động lại server và nhờ tester thử lại',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Reproduce first: every later step (testing a hypothesis, proving the fix) needs a bug you can trigger. In lesson 1.1, running three inputs that vary one thing at a time already showed the bug needs both several items and a code. Editing a "suspicious" line is guessing; restarting tells you nothing about the cause.|||VI: Tái hiện trước: mọi bước sau (kiểm giả thuyết, chứng minh bản sửa) đều cần một lỗi bật ra được. Ở bài 1.1, chạy ba đầu vào mỗi lần đổi một thứ đã cho thấy lỗi cần cả nhiều món lẫn có mã. Sửa dòng "đáng ngờ" là đoán; khởi động lại chẳng nói gì về nguyên nhân.',
      },
      {
        question: 'An average function printed NaN. A teammate changed tong += diem[i] to tong += diem[i] || 0 and now it prints 6 for the scores [8, 7, 9]. What happened?|||Hàm điểm trung bình in NaN. Bạn cùng nhóm đổi tong += diem[i] thành tong += diem[i] || 0 và giờ nó in 6 với điểm [8, 7, 9]. Chuyện gì đã xảy ra?',
        options: [
          'The bug is fixed; 6 is the correct average|||Lỗi đã sửa xong; 6 là trung bình đúng',
          'The scores array is corrupted somewhere else|||Mảng điểm bị hỏng ở chỗ khác',
          'A loud bug became a silent wrong result: the loop still runs one step too far and divides by 4|||Một lỗi ồn ào thành kết quả sai câm lặng: vòng lặp vẫn chạy quá một bước và chia cho 4',
          'NaN was caused by JavaScript’s integer division|||NaN do phép chia số nguyên của JavaScript gây ra',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: The real average is 8. With i <= length the loop reads diem[3] (undefined); || 0 hides that, so the sum is 24 and the count is 4: 24 / 4 = 6 — run in lesson 0.9. The error disappeared, the bug did not. JavaScript has no integer division, so the last option is wrong.|||VI: Trung bình đúng là 8. Với i <= length, vòng lặp đọc diem[3] (undefined); || 0 che điều đó, nên tổng 24 và số lượt 4: 24 / 4 = 6 — đã chạy ở bài 0.9. Lỗi đỏ biến mất, bug thì không. JavaScript không có phép chia số nguyên, nên phương án cuối sai.',
      },
      {
        question: 'Support says some customers "sometimes" cannot log in; it works when you try. What is the most useful next step?|||Bộ phận hỗ trợ nói một số khách "thỉnh thoảng" không đăng nhập được; bạn thử thì chạy. Bước tiếp theo hữu ích nhất là gì?',
        options: [
          'Collect the failed attempts with their conditions (device, input exactly as typed) and compare them with successful ones|||Gom các lần hỏng kèm điều kiện (thiết bị, nguyên văn chuỗi đã nhập) và so với các lần thành công',
          'Close the ticket as "cannot reproduce"|||Đóng ticket với lý do "không tái hiện được"',
          'Increase the session timeout for everyone|||Tăng thời gian hết hạn phiên cho mọi người',
          'Rewrite the login page with a new library|||Viết lại trang đăng nhập bằng thư viện mới',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: "Sometimes" means "under conditions not yet written down". In lesson 1.2, filtering to failures and printing emails with JSON.stringify exposed "An@…" from iPhones and a trailing space. The other options either give up or change things without a hypothesis.|||VI: "Thỉnh thoảng" nghĩa là "trong điều kiện chưa ghi ra". Ở bài 1.2, lọc riêng lần hỏng và in email bằng JSON.stringify đã lộ ra "An@…" từ iPhone và một dấu cách thừa. Các phương án khác hoặc bỏ cuộc, hoặc thay đổi khi chưa có giả thuyết.',
      },
      {
        question: 'A 1,000-line CSV makes the total NaN, caused by one bad line. With the "keep the half that still fails" script, about how many halving steps until one line is left?|||Một CSV 1.000 dòng làm tổng ra NaN, do đúng một dòng hỏng. Với script "giữ nửa vẫn còn lỗi", cần khoảng bao nhiêu bước chia đôi để còn một dòng?',
        options: ['About 1,000|||Khoảng 1.000', 'About 500|||Khoảng 500', 'About 100|||Khoảng 100', 'About 10|||Khoảng 10'],
        correctIndex: 3, points: 1,
        explanation: 'EN: Halving takes about log2(n) steps: log2(1000) ≈ 10. Running thu-nho.js on a 1,000-line file printed exactly 10 steps. Reading line by line is what takes up to 1,000.|||VI: Chia đôi cần khoảng log2(n) bước: log2(1000) ≈ 10. Chạy thu-nho.js trên tệp 1.000 dòng in đúng 10 bước. Đọc từng dòng mới là cách tốn tới 1.000 lần.',
      },
      {
        question: 'A fence prints JSON.stringify(row) for a good row and a failing row; both show "batDau":"2026-11-23T…". What should the fence also print?|||Một hàng rào in JSON.stringify(row) cho một bản ghi tốt và một bản ghi lỗi; cả hai đều hiện "batDau":"2026-11-23T…". Hàng rào nên in thêm gì?',
        options: [
          'The row’s length in bytes|||Độ dài bản ghi tính bằng byte',
          'typeof row.batDau — JSON.stringify turns a Date into the same kind of text as a string|||typeof row.batDau — JSON.stringify biến Date thành chữ y như một chuỗi',
          'The current time on the server|||Giờ hiện tại trên server',
          'Nothing more; the rows are identical|||Không cần thêm; hai bản ghi giống hệt nhau',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: In lesson 1.3 the JSON of id 2 (a Date) and id 3 (a string) looked the same; only typeof showed object vs string, which explained "toISOString is not a function". Print types, not only values.|||VI: Ở bài 1.3, JSON của id 2 (một Date) và id 3 (một chuỗi) trông như nhau; chỉ typeof cho thấy object và string, giải thích được "toISOString is not a function". In cả kiểu, không chỉ giá trị.',
      },
      {
        question: 'The booking page shows an error. curl -i to the same API URL also returns HTTP 500. What has this ruled out?|||Trang đặt lịch báo lỗi. Gọi curl -i tới đúng URL API đó cũng trả HTTP 500. Điều này đã loại trừ được gì?',
        options: [
          'The browser, the front-end code and CORS — the problem is inside the server|||Trình duyệt, code front-end và CORS — vấn đề nằm trong server',
          'The database — it must be the route|||Cơ sở dữ liệu — chắc chắn là route',
          'Nothing; curl and browsers behave the same|||Không loại được gì; curl và trình duyệt chạy y như nhau',
          'The server — 500 means the network failed|||Server — 500 nghĩa là mạng hỏng',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: curl bypasses the browser, so a 500 from curl means the server received the request and failed internally. It does not yet tell you which server layer — that is what fences are for. A network failure would give no HTTP status at all.|||VI: curl đi vòng qua trình duyệt, nên 500 từ curl nghĩa là server đã nhận request và hỏng bên trong. Nó chưa cho biết tầng nào trong server — rào dùng để trả lời việc đó. Hỏng mạng thì đã chẳng có mã HTTP nào.',
      },
      {
        question: 'Starting your API prints "Error: listen EADDRINUSE: address already in use 127.0.0.1:18130". Best hypothesis and check?|||Chạy API in ra "Error: listen EADDRINUSE: address already in use 127.0.0.1:18130". Giả thuyết và cách kiểm tốt nhất?',
        options: [
          'Node is corrupted; reinstall Node.js|||Node bị hỏng; cài lại Node.js',
          'The route regex is wrong; fix the URL pattern|||Regex của route sai; sửa mẫu URL',
          'Another process already listens on 18130; check with lsof -t -iTCP:18130 -sTCP:LISTEN|||Tiến trình khác đang nghe ở 18130; kiểm bằng lsof -t -iTCP:18130 -sTCP:LISTEN',
          'The firewall blocks the port; disable the firewall|||Tường lửa chặn cổng; tắt tường lửa',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: The code, the syscall (listen) and the address are all in the message. In lesson 1.4 lsof returned the PID of a forgotten "node server.js". No code line in the stack was ours, so editing code could not help; turning a firewall off is risky and unrelated.|||VI: Mã lỗi, lời gọi hệ thống (listen) và địa chỉ đều có trong thông báo. Ở bài 1.4, lsof trả về PID của một "node server.js" bị quên. Không dòng stack nào là code của mình, nên sửa code không thể giúp; tắt tường lửa vừa rủi ro vừa không liên quan.',
      },
      {
        question: 'node src/app.js fails with "Cannot find module ‘./cau-hinh’" and "Require stack: - …/src/app.js". What do you do first?|||node src/app.js hỏng với "Cannot find module ‘./cau-hinh’" và "Require stack: - …/src/app.js". Bạn làm gì trước?',
        options: [
          'Run npm install|||Chạy npm install',
          'Delete node_modules and package-lock.json|||Xoá node_modules và package-lock.json',
          'Upgrade Node to the newest version|||Nâng Node lên bản mới nhất',
          'Compare the name in require with the real file names next to src/app.js|||So tên trong require với tên tệp thật nằm cạnh src/app.js',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: A name starting with ./ is your own file, relative to the requiring file — npm has nothing to do with it. In lesson 1.4, ls src showed cauHinh.js, not cau-hinh.js. Remember also that Linux is case-sensitive while macOS/Windows usually are not.|||VI: Tên bắt đầu bằng ./ là tệp của chính bạn, tính từ tệp gọi require — npm không liên quan. Ở bài 1.4, ls src cho thấy cauHinh.js, không phải cau-hinh.js. Nhớ thêm: Linux phân biệt hoa thường, còn macOS/Windows thường thì không.',
      },
      {
        question: 'After two hours you changed the loop, a library version and a config value together, and the bug is gone. What is the best move now?|||Sau hai tiếng bạn đã đổi cùng lúc vòng lặp, phiên bản một thư viện và một giá trị cấu hình, và lỗi biến mất. Nên làm gì bây giờ?',
        options: [
          'Commit everything quickly before it breaks again|||Commit hết ngay trước khi nó hỏng lại',
          'Undo, then re-apply one change at a time and test after each to learn which one fixed it|||Hoàn tác, rồi áp lại từng thay đổi một và kiểm sau mỗi cái để biết cái nào sửa được',
          'Keep all three changes and add a comment "do not touch"|||Giữ cả ba và thêm chú thích "đừng đụng vào"',
          'Ask a teammate to review only the loop change|||Nhờ bạn cùng nhóm review riêng thay đổi vòng lặp',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: With three changes you cannot say which one removed the cause, and the other two may have broken something else. Re-applying one at a time (git stash / git restore make it cheap) turns the accident into knowledge and a one-sentence cause.|||VI: Ba thay đổi cùng lúc thì không nói được cái nào gỡ nguyên nhân, và hai cái kia có thể đã làm hỏng chỗ khác. Áp lại từng cái (git stash / git restore làm việc này rẻ) biến may mắn thành hiểu biết và một câu nguyên nhân.',
      },
      {
        question: 'What does node -e "console.log([9, 10, 7, 25].sort())" print?|||node -e "console.log([9, 10, 7, 25].sort())" in ra gì?',
        options: ['[ 7, 9, 10, 25 ]', '[ 25, 10, 9, 7 ]', '[ 10, 25, 7, 9 ]', '[ 9, 10, 7, 25 ]'],
        correctIndex: 2, points: 1,
        explanation: 'EN: Without a compare function, sort() converts elements to strings and compares them: "10" < "25" < "7" < "9". Run it yourself — this is lab bug 2. Use sort((a, b) => a - b) for numbers.|||VI: Không có hàm so sánh, sort() đổi phần tử thành chuỗi rồi so: "10" < "25" < "7" < "9". Tự chạy thử — đây là lỗi 2 của lab. Với số, dùng sort((a, b) => a - b).',
      },
    ],
  },
};
