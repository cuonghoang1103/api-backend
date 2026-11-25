/**
 * 8.6 — Kiểm tra Chương 8 (soạn 24/11/2026). 10 câu; đáp án dựa trên output chạy thật của bài 8.1–8.5
 * (Node 22 + Prisma 6.19, Spring Boot 4.1.1, JDK 25, Docker, nginx, Redis 7, PostgreSQL 16). Phân bố đáp án: A3 B2 C2 D3.
 */
export default {
  title: '8.6 — Chapter 8 quiz|||8.6 — Kiểm tra Chương 8',
  slug: 'dbg-8-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: test tuần tự không bắt được đặt trùng, race trong Node qua await, UNIQUE mà không bắt P2002 ⇒ 500, khoá lạc quan trên dòng nóng, synchronized + @Transactional, đọc thread dump, toISOString().slice(0,10) ở UTC+7, YYYY cuối năm, container chạy ảnh cũ sau compose build, exit 137 OOMKilled không có log.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, all taken from runs in this chapter. Read the explanation after submitting.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can turn "it happens sometimes" into "x out of 100 rounds" with a parallel script.</li>
<li>I know which database tool fixes check-then-act, lost updates and overlapping ranges.</li>
<li>I can reproduce a time bug under several <code>TZ</code> values and test it with a fake clock.</li>
<li>Before debugging a "still broken" fix I prove which version and which cache answered.</li>
<li>I can tell a leak from normal GC, compare two heap snapshots, and explain exit 137.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, đều lấy từ các lần chạy trong chương này. Đọc phần giải thích sau khi nộp.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi biến được "thỉnh thoảng bị" thành "x trên 100 vòng" bằng một script song song.</li>
<li>Tôi biết công cụ nào của cơ sở dữ liệu sửa được kiểm-rồi-làm, mất cập nhật và khoảng giờ chồng nhau.</li>
<li>Tôi tái hiện được lỗi thời gian dưới nhiều giá trị <code>TZ</code> và test nó bằng đồng hồ giả.</li>
<li>Trước khi gỡ một bản sửa "vẫn hỏng", tôi chứng minh phiên bản nào và cache nào đã trả lời.</li>
<li>Tôi phân biệt được rò rỉ với GC bình thường, so sánh được hai heap snapshot, và giải thích được mã thoát 137.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'The booking endpoint does findFirst (is the slot taken?) then create. QA booked the same slot 20 times in a row and always got one 201 and nineteen 409. In production two students got the same slot. What is the best next step?|||Endpoint đặt lịch làm findFirst (ca đã có ai chưa?) rồi create. QA đặt cùng một ca 20 lần liên tiếp và lần nào cũng được một 201 và mười chín 409. Trên production hai sinh viên cùng giữ được một ca. Bước tiếp theo tốt nhất là gì?',
        options: [
          'Close the ticket: the manual test proves the logic is correct|||Đóng ticket: test tay đã chứng minh logic đúng',
          'Add more logging and wait for it to happen again|||Thêm log rồi chờ nó xảy ra lần nữa',
          'Fire the requests concurrently with a script, count rows in the database over many rounds, then fix with a UNIQUE constraint|||Bắn các request đồng thời bằng script, đếm dòng trong cơ sở dữ liệu qua nhiều vòng, rồi sửa bằng ràng buộc UNIQUE',
          'Increase the database connection pool|||Tăng kích thước pool kết nối cơ sở dữ liệu',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Sequential requests never overlap, so they cannot expose check-then-act (lesson 8.1: 20 sequential ⇒ 1 booking; 20 concurrent ⇒ 10–19; two people ⇒ 100/100 rounds duplicated). Reproduce concurrently, measure "x/100", fix in the database, show 0/100.|||VI: Request tuần tự không bao giờ chồng nhau nên không lộ được kiểm-rồi-làm (bài 8.1: 20 lần lượt ⇒ 1 lượt đặt; 20 đồng thời ⇒ 10–19; hai người ⇒ 100/100 vòng trùng). Tái hiện đồng thời, đo "x/100", sửa trong cơ sở dữ liệu, cho thấy 0/100.',
      },
      {
        question: 'A one-time coupon is stored in a Map in a single Node process. The handler checks daDung, then awaits a user check, then sets daDung = true. Under 20 simultaneous requests the coupon was used 2–5 times. Why?|||Một phiếu giảm giá dùng một lần được giữ trong Map của một tiến trình Node duy nhất. Handler kiểm daDung, rồi await một bước kiểm người dùng, rồi mới gán daDung = true. Với 20 request đồng thời, phiếu bị dùng 2–5 lần. Vì sao?',
        options: [
          'Each await lets other requests run their check before the coupon is marked|||Mỗi await cho các request khác chạy bước kiểm của chúng trước khi phiếu được đánh dấu',
          'Node runs each request on a separate CPU thread|||Node chạy mỗi request trên một luồng CPU riêng',
          'Map is not safe in JavaScript; use an object instead|||Map không an toàn trong JavaScript; nên dùng object',
          'The garbage collector removed the daDung flag|||Bộ thu gom rác đã xoá cờ daDung',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: JavaScript is single-threaded but not "single-request": every await yields to the event loop. Keep check and mark in one synchronous block (mark first, undo on failure) — lesson 8.1, SUA=phieu: 1 use in every run.|||VI: JavaScript đơn luồng nhưng không "đơn request": mỗi await nhường cho vòng lặp sự kiện. Giữ kiểm và đánh dấu trong cùng một khối đồng bộ (đánh dấu trước, hoàn lại nếu thất bại) — bài 8.1, SUA=phieu: 1 lần dùng ở mọi lần chạy.',
      },
      {
        question: 'You added UNIQUE (phongId, ngay, ca). The database now holds exactly one booking per slot, but 19 of 20 concurrent users get HTTP 500 and the log shows P2002. What is missing?|||Bạn đã thêm UNIQUE (phongId, ngay, ca). Cơ sở dữ liệu giờ chỉ có đúng một lượt đặt cho mỗi ca, nhưng 19 trên 20 người dùng đồng thời nhận HTTP 500 và log có P2002. Còn thiếu gì?',
        options: [
          'A second check with findFirst after the create|||Một lần kiểm thứ hai bằng findFirst sau create',
          'Catch the unique violation (P2002 / 23505) and return 409 with a clear message|||Bắt lỗi vi phạm UNIQUE (P2002 / 23505) và trả 409 kèm thông báo rõ ràng',
          'Remove the constraint; it causes the errors|||Gỡ ràng buộc đi; chính nó gây ra lỗi',
          'Wrap the create in a SERIALIZABLE transaction|||Bọc create trong transaction SERIALIZABLE',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: The constraint is the referee; the losers must get a business answer, not a crash (lesson 8.1: 201×1 500×19 before mapping, 201×1 409×19 after).|||VI: Ràng buộc là trọng tài; người thua phải nhận câu trả lời nghiệp vụ, không phải một lần sập (bài 8.1: 201×1 500×19 trước khi ánh xạ, 201×1 409×19 sau đó).',
      },
      {
        question: 'Fifty students borrow from 10 kits at the same moment. The version with a version column (optimistic locking, retry up to 10 times) gave correct stock but 368 retries and eight 503 "too busy" responses. What is the better fix for this counter?|||Năm mươi sinh viên cùng lúc mượn từ 10 bộ kit. Bản có cột version (khoá lạc quan, thử lại tối đa 10 lần) cho tồn kho đúng nhưng 368 lần thử lại và tám phản hồi 503 "đông quá". Cách sửa tốt hơn cho bộ đếm này là gì?',
        options: [
          'Raise the retry limit to 100|||Tăng giới hạn thử lại lên 100',
          'Add synchronized to the handler|||Thêm synchronized vào handler',
          'Cache the stock in Redis|||Cache tồn kho trong Redis',
          'One atomic conditional UPDATE: SET conLai = conLai - 1 WHERE id = ? AND conLai > 0, and 409 when 0 rows change|||Một câu UPDATE nguyên tử có điều kiện: SET conLai = conLai - 1 WHERE id = ? AND conLai > 0, và 409 khi 0 dòng thay đổi',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Optimistic locking fits rare conflicts; on a hot row everyone collides and retries. An atomic conditional update lets the database serialise the decrements: exactly 10 × 201 and 40 × 409 (lesson 8.1).|||VI: Khoá lạc quan hợp với xung đột hiếm; trên một dòng nóng ai cũng va chạm và thử lại. UPDATE nguyên tử có điều kiện để cơ sở dữ liệu xếp hàng các lần trừ: đúng 10 × 201 và 40 × 409 (bài 8.1).',
      },
      {
        question: 'A Spring service method is annotated @Transactional and declared synchronized. It reads a Kit entity, decrements conLai and returns. Under 50 parallel requests on ONE instance it still lent 50 kits from a box of 10. Why?|||Một hàm service Spring có @Transactional và được khai báo synchronized. Nó đọc entity Kit, trừ conLai rồi return. Với 50 request song song trên MỘT instance, nó vẫn cho mượn 50 kit từ hộp 10 bộ. Vì sao?',
        options: [
          'synchronized does not work on Spring beans|||synchronized không có tác dụng trên bean của Spring',
          'Hibernate ignores entity changes inside synchronized methods|||Hibernate bỏ qua thay đổi entity trong hàm synchronized',
          'The lock is released when the method returns, but the proxy commits the UPDATE after that, so the next thread reads the uncommitted-old value|||Khoá được nhả khi hàm return, nhưng proxy commit UPDATE sau đó, nên luồng kế tiếp đọc giá trị cũ chưa được commit',
          'Tomcat runs each request in a separate JVM|||Tomcat chạy mỗi request trong một JVM riêng',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: The transactional proxy wraps the call: begin → method (lock held) → return (lock released) → commit. With dirty checking the UPDATE is only flushed at commit (lesson 8.1, cach=sync). And synchronized never protects across instances.|||VI: Proxy transaction bọc quanh lời gọi: begin → hàm (giữ khoá) → return (nhả khoá) → commit. Với dirty checking, UPDATE chỉ được gửi lúc commit (bài 8.1, cach=sync). Và synchronized không bao giờ bảo vệ được giữa các instance.',
      },
      {
        question: 'A thread dump shows nine http-nio threads "BLOCKED (on object monitor)" with "waiting to lock <0x…5b0>". What do you search for next?|||Một thread dump cho thấy chín luồng http-nio "BLOCKED (on object monitor)" với "waiting to lock <0x…5b0>". Bạn tìm gì tiếp theo?',
        options: [
          'The thread whose stack contains "- locked <0x…5b0>" — it holds the monitor; see what it is doing|||Luồng có dòng "- locked <0x…5b0>" trong stack — nó đang giữ monitor; xem nó đang làm gì',
          'The number of CPU cores of the server|||Số nhân CPU của server',
          'The TIMED_WAITING (parking) threads, because they are the problem|||Các luồng TIMED_WAITING (parking), vì chúng là vấn đề',
          'Nothing; BLOCKED threads are normal under load|||Không gì cả; luồng BLOCKED là bình thường khi tải cao',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Same address = same lock. The holder (here exec-27, sleeping inside muonLoi0) explains the queue. Parking threads are idle workers (lesson 8.1). Take two or three dumps a few seconds apart.|||VI: Cùng địa chỉ = cùng một khoá. Luồng đang giữ (ở đây exec-27, đang ngủ trong muonLoi0) giải thích hàng đợi. Luồng parking là worker đang rảnh (bài 8.1). Lấy hai ba bản dump cách nhau vài giây.',
      },
      {
        question: 'A user in Việt Nam picks 1 December in a date input. The front-end sends new Date(value + "T00:00").toISOString().slice(0, 10). What does the API receive?|||Một người dùng ở Việt Nam chọn ngày 1/12 trong ô ngày. Giao diện gửi new Date(value + "T00:00").toISOString().slice(0, 10). API nhận được gì?',
        options: [
          '"2026-12-01"|||"2026-12-01"',
          '"2026-11-30", because toISOString gives the UTC date and local midnight in UTC+7 is 17:00 the day before|||"2026-11-30", vì toISOString cho ngày theo UTC và nửa đêm giờ địa phương ở UTC+7 là 17:00 hôm trước',
          '"2026-12-02"|||"2026-12-02"',
          'It depends on the server TZ|||Tuỳ TZ của server',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 8.2: in Asia/Ho_Chi_Minh and Asia/Tokyo the result is "2026-11-30"; in New York and UTC it is "2026-12-01" — so only some customers are affected. Send the date string as-is, or an instant with offset.|||VI: Bài 8.2: ở Asia/Ho_Chi_Minh và Asia/Tokyo kết quả là "2026-11-30"; ở New York và UTC là "2026-12-01" — nên chỉ một số khách bị. Hãy gửi nguyên chuỗi ngày, hoặc một thời điểm kèm độ lệch.',
      },
      {
        question: 'Invoices dated 28 December 2026 show "2027-12-28". The code uses new SimpleDateFormat("YYYY-MM-dd"). Every test written in June passed. What is wrong?|||Hoá đơn ngày 28/12/2026 in ra "2027-12-28". Mã dùng new SimpleDateFormat("YYYY-MM-dd"). Mọi test viết vào tháng Sáu đều qua. Sai ở đâu?',
        options: [
          'The server clock is one year ahead|||Đồng hồ server nhanh một năm',
          'The database stored the wrong year|||Cơ sở dữ liệu lưu sai năm',
          'SimpleDateFormat is not thread-safe|||SimpleDateFormat không an toàn đa luồng',
          'YYYY is the week-based year; from 27 to 31 December 2026 it is already 2027 — use yyyy|||YYYY là năm theo tuần; từ 27 tới 31/12/2026 nó đã là 2027 — dùng yyyy',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 8.2 printed 26/12→2026 but 27/12…31/12→2027 with "YYYY". SimpleDateFormat is indeed not thread-safe, but that is not this bug. Test date code at year boundaries.|||VI: Bài 8.2 in ra 26/12→2026 nhưng 27/12…31/12→2027 với "YYYY". SimpleDateFormat đúng là không an toàn đa luồng, nhưng đó không phải lỗi này. Hãy test mã ngày tháng ở ranh giới năm.',
      },
      {
        question: 'You fixed a route, ran "docker compose build", and the route still returns 404. /health reports the old commit. What explains it best?|||Bạn sửa một route, chạy "docker compose build", và route vẫn trả 404. /health báo commit cũ. Điều gì giải thích hợp lý nhất?',
        options: [
          'The new image was built but the running container was created from the old image; recreate it with up -d --build|||Ảnh mới đã được build nhưng container đang chạy được tạo từ ảnh cũ; tạo lại bằng up -d --build',
          'Docker caches HTTP responses|||Docker cache phản hồi HTTP',
          'The route needs a database migration|||Route cần một migration cơ sở dữ liệu',
          'Compose build always fails silently|||Compose build luôn thất bại âm thầm',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 8.3: the tag :latest moved to d533636… while the container kept 8587e3a…. A container keeps the image it was created from; compare docker inspect -f {{.Image}} with the tag\'s id.|||VI: Bài 8.3: tag :latest đã chuyển sang d533636… trong khi container vẫn giữ 8587e3a…. Container giữ ảnh mà nó được tạo ra từ đó; so docker inspect -f {{.Image}} với id của tag.',
      },
      {
        question: 'A Node service in a container limited to 128 MB restarts with exit code 137, OOMKilled=true, and no error in its logs. What is the most likely explanation?|||Một dịch vụ Node trong container giới hạn 128 MB khởi động lại với mã thoát 137, OOMKilled=true, và không có lỗi nào trong log. Giải thích khả dĩ nhất là gì?',
        options: [
          'V8 threw "JavaScript heap out of memory"|||V8 ném "JavaScript heap out of memory"',
          'Someone ran docker stop|||Có người chạy docker stop',
          'A segmentation fault in Node|||Lỗi segmentation fault trong Node',
          'Memory grew past the container limit before V8 reached its own heap limit (259 MB here), so the kernel killed the process|||Bộ nhớ vượt giới hạn container trước khi V8 chạm trần heap của chính nó (ở đây 259 MB), nên nhân Linux giết tiến trình',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: 137 = 128 + SIGKILL, and OOMKilled=true means the cgroup limit. V8\'s own OOM prints FATAL ERROR (lesson 8.4). Set --max-old-space-size below the container limit and look for the leak with heap snapshots.|||VI: 137 = 128 + SIGKILL, và OOMKilled=true nghĩa là giới hạn cgroup. OOM của chính V8 sẽ in FATAL ERROR (bài 8.4). Đặt --max-old-space-size thấp hơn giới hạn container và tìm rò rỉ bằng heap snapshot.',
      },
    ],
  },
};
