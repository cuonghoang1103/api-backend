/**
 * 4.7 — Kiểm tra Chương 4 (soạn 24/11/2026). 10 câu; đáp án dựa trên output chạy thật của bài 4.1–4.6
 * (JDK 25 + Temurin 21.0.13.1, Spring Boot 4.1.1, Spring Security 7, Hibernate 7, jdb/JDI). Phân bố đáp án: A2 B3 C3 D2.
 */
export default {
  title: '4.7 — Chapter 4 quiz|||4.7 — Kiểm tra Chương 4',
  slug: 'dbg-4-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: Evaluate có tác dụng phụ, Set Value trong transaction, Suspend All vs Thread, giá của breakpoint điều kiện và method breakpoint, field watchpoint và Hibernate, breakpoint trên dòng có lambda, HotSwap làm được gì, 403 do CsrfFilter, address=5005 trong container, an toàn JDWP.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, all taken from sessions you ran in this chapter. Read the explanation after submitting.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can start a Spring Boot app or a Tomcat in debug mode and find my frames among a hundred.</li>
<li>I evaluate sub-expressions and know that Evaluate and Set Value have real side effects.</li>
<li>I choose suspend policy, condition, log-only, watchpoint or exception breakpoint from the question.</li>
<li>I can stop inside a lambda, HotSwap a method body and Reset Frame, and Force Return to simulate failures.</li>
<li>I find the Spring component that refused a request, and I attach to a container without ever exposing 5005.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, đều lấy từ các phiên bạn đã chạy trong chương này. Đọc phần giải thích sau khi nộp.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chạy được Spring Boot hoặc Tomcat ở chế độ debug và tìm ra frame của mình giữa cả trăm frame.</li>
<li>Tôi evaluate biểu thức con và biết Evaluate, Set Value có tác dụng phụ thật.</li>
<li>Tôi chọn suspend policy, điều kiện, chỉ ghi log, watchpoint hay exception breakpoint theo câu hỏi cần trả lời.</li>
<li>Tôi dừng được trong lambda, HotSwap thân hàm rồi Reset Frame, và Force Return để giả lập lỗi.</li>
<li>Tôi tìm ra thành phần Spring đã từ chối request, và gắn vào container mà không bao giờ để lộ 5005.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'Paused in a @Transactional service method, you use Set Value to change the soPhut field of a managed DatCho entity from 90 to 120 "just to try", then resume. What happens?|||Đang dừng trong một hàm service @Transactional, bạn dùng Set Value đổi trường soPhut của một entity DatCho đang được quản lý từ 90 thành 120 "để thử", rồi cho chạy tiếp. Chuyện gì xảy ra?',
        options: [
          'Nothing persists: debugger changes are always memory-only|||Không gì được lưu: thay đổi từ debugger luôn chỉ nằm trong bộ nhớ',
          'Hibernate\'s dirty checking will very likely write 120 to the database at commit|||Dirty checking của Hibernate rất có thể sẽ ghi 120 xuống database khi commit',
          'The JVM rejects Set Value on entity fields|||JVM từ chối Set Value trên trường của entity',
          'The transaction is rolled back automatically|||Transaction tự động rollback',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: In lesson 4.1 the GET ran outside a write transaction, so nothing was flushed. Inside a read-write transaction, a changed field of a managed entity is detected at flush and saved. Know which situation you are in before trying values.|||VI: Ở bài 4.1, request GET chạy ngoài transaction ghi nên không có gì được flush. Trong transaction đọc-ghi, trường bị đổi của entity đang quản lý được phát hiện khi flush và được lưu. Biết mình đang ở tình huống nào trước khi thử giá trị.',
      },
      {
        question: 'You debug on the shared DEV server with a breakpoint in a controller (default settings). Colleagues report the whole API, even /actuator/health, stopped answering. What fixes it?|||Bạn debug trên server DEV dùng chung với một breakpoint trong controller (thiết lập mặc định). Đồng nghiệp báo cả API, kể cả /actuator/health, không trả lời. Sửa thế nào?',
        options: [
          'Increase Tomcat\'s thread pool|||Tăng số luồng của Tomcat',
          'Use a method breakpoint instead|||Dùng method breakpoint thay thế',
          'Set the breakpoint\'s Suspend policy to Thread|||Đặt Suspend policy của breakpoint thành Thread',
          'Restart the server with suspend=y|||Khởi động lại server với suspend=y',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: The default Suspend All froze every JVM thread (health timed out after 3 s with HTTP 000). With Suspend Thread, health answered in 4.6 ms while only the paused request waited.|||VI: Mặc định Suspend All làm đứng mọi luồng của JVM (health hết giờ sau 3 s, HTTP 000). Với Suspend Thread, health trả lời trong 4,6 ms, chỉ request đang dừng phải chờ.',
      },
      {
        question: 'In the measurement of lesson 4.2, 300 requests took 1.90 s without a debugger client. Which breakpoint made them take 22.89 s?|||Trong phép đo bài 4.2, 300 request mất 1,90 s khi không có debugger. Breakpoint nào làm chúng mất 22,89 s?',
        options: [
          'A conditional line breakpoint d.getId() == 5|||Breakpoint dòng có điều kiện d.getId() == 5',
          'A log-only breakpoint|||Breakpoint chỉ ghi log',
          'An exception breakpoint for NullPointerException|||Exception breakpoint cho NullPointerException',
          'A method breakpoint on HoaDonService.tinh|||Method breakpoint trên HoaDonService.tinh',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Method breakpoints use method entry events, which make the JVM check every method call — 12× slower although only one method matched. The conditional breakpoint cost about 1.3 ms per hit (2.29 s). Prefer a line breakpoint on the method\'s first line ("Emulated").|||VI: Method breakpoint dùng sự kiện vào hàm, buộc JVM kiểm mọi lời gọi hàm — chậm 12× dù chỉ khớp một hàm. Breakpoint điều kiện tốn khoảng 1,3 ms mỗi lượt (2,29 s). Hãy dùng breakpoint dòng ở dòng đầu hàm ("Emulated").',
      },
      {
        question: 'Why does a conditional breakpoint still slow a hot loop even when its condition is almost never true?|||Vì sao breakpoint điều kiện vẫn làm chậm vòng lặp nóng dù điều kiện gần như không bao giờ đúng?',
        options: [
          'The JVM stops at every hit and the debugger evaluates the condition before resuming|||JVM dừng ở mọi lượt và debugger tính điều kiện rồi mới cho chạy tiếp',
          'The condition is compiled into the class file|||Điều kiện được biên dịch vào tệp class',
          'Conditions disable the JIT for the whole JVM|||Điều kiện tắt JIT của cả JVM',
          'It does not; conditions are free|||Không đúng; điều kiện không tốn gì',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Our JDI client received 301 breakpoint events for 1 match: each false hit is a stop, an event over JDWP, an evaluation and a resume.|||VI: Client JDI của chúng ta nhận 301 sự kiện breakpoint cho 1 lần khớp: mỗi lượt sai là một lần dừng, một sự kiện qua JDWP, một lần tính và một lần cho chạy tiếp.',
      },
      {
        question: 'A field watchpoint on DatCho.trangThai stops in the constructor and in setTrangThai(), but not when Hibernate loads DA_DUYET from the database. Why?|||Field watchpoint trên DatCho.trangThai dừng ở constructor và trong setTrangThai(), nhưng không dừng khi Hibernate nạp DA_DUYET từ database. Vì sao?',
        options: [
          'Hibernate loads the value lazily after the request|||Hibernate nạp giá trị kiểu lazy sau request',
          'Watchpoints are triggered by bytecode putfield/JNI; Hibernate sets fields by reflection/method handles|||Watchpoint được kích bởi putfield trong bytecode/JNI; Hibernate gán trường bằng reflection/method handle',
          'Enum fields cannot be watched|||Không theo dõi được trường kiểu enum',
          'The watchpoint was set to "access" instead of "modification"|||Watchpoint đặt kiểu "access" thay vì "modification"',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Observed for real: the value changed from id 15627 to 15650 between the two stops with no event. A watchpoint answers "which of my code changed it", not "what did the ORM load" — for that, read the SQL log.|||VI: Quan sát thật: giá trị đổi từ id 15627 sang 15650 giữa hai lần dừng mà không có sự kiện nào. Watchpoint trả lời "code nào của tôi đã đổi nó", không trả lời "ORM đã nạp gì" — muốn biết thì đọc log SQL.',
      },
      {
        question: 'A line breakpoint on .map(d -> new DongLich(...)) stops once, and evaluating d fails with "Name unknown". What is going on?|||Breakpoint dòng trên .map(d -> new DongLich(...)) dừng một lần, và evaluate d báo "Name unknown". Chuyện gì đang xảy ra?',
        options: [
          'The stream is empty|||Stream rỗng',
          'Source and class are out of sync|||Mã nguồn và class lệch nhau',
          'It stopped while building the pipeline; to see each element, stop inside the lambda (λ / lambda$lichTuan$1)|||Nó dừng lúc dựng pipeline; muốn thấy từng phần tử phải dừng trong lambda (λ / lambda$lichTuan$1)',
          'Lambdas cannot be debugged|||Lambda không debug được',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: A line with a lambda has two stop points. Stopping in lambda$lichTuan$1 showed 7 elements entering map while 6 came out — distinct() merged two students.|||VI: Dòng có lambda có hai điểm dừng. Dừng trong lambda$lichTuan$1 cho thấy 7 phần tử vào map trong khi ra 6 — distinct() đã gộp hai sinh viên.',
      },
      {
        question: 'While paused, you fix a method body, recompile and HotSwap. Then you also add a private helper method and try again. What happens?|||Đang dừng, bạn sửa thân một hàm, biên dịch lại và HotSwap. Rồi bạn thêm một hàm phụ private và thử lại. Kết quả?',
        options: [
          'Both swaps succeed and the paused frame runs the new code immediately|||Cả hai lần đều thành công và frame đang dừng chạy code mới ngay',
          'The first swap succeeds but the paused frame still runs the old method until Reset Frame; the second fails ("add method not implemented")|||Lần đầu thành công nhưng frame đang dừng vẫn chạy hàm cũ cho tới khi Reset Frame; lần hai thất bại ("add method not implemented")',
          'Both fail: HotSwap needs suspend=y|||Cả hai thất bại: HotSwap cần suspend=y',
          'The second succeeds only if the method is private|||Lần hai thành công nếu hàm là private',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Real output: after redefine, the old frame\'s locals were gone ("Name unknown"); reenter (Reset Frame) ran the new body (67,500). Adding a method gave UnsupportedOperationException: add method not implemented.|||VI: Output thật: sau redefine, biến của frame cũ biến mất ("Name unknown"); reenter (Reset Frame) chạy thân hàm mới (67.500). Thêm hàm thì báo UnsupportedOperationException: add method not implemented.',
      },
      {
        question: 'POST /api/sinh-vien/SE1801/nap-luot returns 403 and no breakpoint in SinhVienController is ever hit. What is the fastest way to know why?|||POST /api/sinh-vien/SE1801/nap-luot trả 403 và breakpoint trong SinhVienController không bao giờ dừng. Cách nhanh nhất để biết vì sao?',
        options: [
          'Add @PermitAll on the controller|||Thêm @PermitAll lên controller',
          'Disable Spring Security|||Tắt Spring Security',
          'Turn on logging.level.org.springframework.security=TRACE and read which filter decided|||Bật logging.level.org.springframework.security=TRACE và đọc filter nào đã quyết định',
          'Change the method to GET|||Đổi phương thức thành GET',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: The TRACE log showed CsrfFilter (5/12) finding no token and "Responding with 403". The fix is a security decision: stateless API → ignore CSRF for /api/**; cookie session → keep CSRF and send the token.|||VI: Log TRACE cho thấy CsrfFilter (5/12) không tìm thấy token và "Responding with 403". Sửa là một quyết định bảo mật: API stateless → bỏ CSRF cho /api/**; xác thực bằng cookie session → giữ CSRF và gửi token.',
      },
      {
        question: 'A container runs java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 with -p 127.0.0.1:45006:5005. jdb -attach 127.0.0.1:45006 gets "Connection reset". Why?|||Một container chạy java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 với -p 127.0.0.1:45006:5005. jdb -attach 127.0.0.1:45006 báo "Connection reset". Vì sao?',
        options: [
          'Since JDK 9, address=5005 listens on localhost only — the container\'s own loopback|||Từ JDK 9, address=5005 chỉ nghe localhost — tức loopback của chính container',
          'JDWP does not work in Docker|||JDWP không chạy trong Docker',
          'The host firewall blocks 45006|||Tường lửa máy chủ chặn 45006',
          'suspend must be y for attach|||Phải có suspend=y mới attach được',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: /proc/net/tcp in the container showed 0100007F:138D (127.0.0.1:5005). Use address=*:5005 inside, and publish only on the host\'s 127.0.0.1.|||VI: /proc/net/tcp trong container hiện 0100007F:138D (127.0.0.1:5005). Dùng address=*:5005 bên trong, và chỉ publish trên 127.0.0.1 của máy chủ.',
      },
      {
        question: 'Which statement about JDWP security is correct?|||Phát biểu nào về bảo mật JDWP là đúng?',
        options: [
          'JDWP asks for the JVM user\'s password before attaching|||JDWP hỏi mật khẩu người dùng JVM trước khi cho attach',
          'An open JDWP port only lets attackers read variables, not run commands|||Cổng JDWP mở chỉ cho kẻ tấn công đọc biến, không chạy lệnh được',
          'It is safe on production if suspend=n|||Trên production vẫn an toàn nếu suspend=n',
          'Anyone reaching the port can evaluate Runtime.exec; exposed JDWP was exploited within hours (Wiz, 2025)|||Ai với tới cổng đều evaluate được Runtime.exec; JDWP lộ ra đã bị khai thác trong vài giờ (Wiz, 2025)',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: JDWP has no authentication or encryption. In lesson 4.5, print Runtime.getRuntime().exec("id") returned uid=0(root). Wiz\'s 2025 honeypot was turned into a cryptominer within hours. Loopback + SSH tunnel; never production.|||VI: JDWP không có xác thực hay mã hoá. Ở bài 4.5, print Runtime.getRuntime().exec("id") trả về uid=0(root). Honeypot của Wiz năm 2025 bị biến thành máy đào tiền ảo trong vài giờ. Loopback + đường hầm SSH; không bao giờ trên production.',
      },
    ],
  },
};
