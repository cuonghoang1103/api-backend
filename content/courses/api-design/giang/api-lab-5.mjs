/** Giảng theo slide — Lab 5 "Báo hỏng sống sót dưới tầng hầm" (deck api-lab-5, 6 slide). EN = dịch sát ý VI. */
import { walkApi } from '../_slides.mjs';

export default walkApi('api-lab-5', "Lab 5 — Reporting that survives the basement", "Lab 5 — Báo hỏng sống sót dưới tầng hầm", [
  [1, "Cover",
    `<p>Lab 5: the basement has the worst Wi-Fi and the most broken devices, and two managers resolve at once.</p>`,
    `<p>Lab 5: tầng hầm có Wi-Fi tệ nhất và nhiều thiết bị hỏng nhất, và hai quản lý xử lý cùng lúc.</p>`],
  [2, "The request",
    `<p>Exactly one issue per tap however often the app retries, at most three reports per minute with the remaining count, a visible conflict when two managers resolve, and free re-reads — everything from Chapter 5 in one feature.</p>`,
    `<p>Mỗi lần bấm đúng một báo hỏng dù app thử lại bao nhiêu, tối đa ba báo hỏng mỗi phút kèm số lượt còn lại, xung đột hiện rõ khi hai quản lý cùng xử lý, và đọc lại miễn phí — mọi thứ của Chương 5 trong một tính năng.</p>`],
  [3, "Part A and B",
    `<p>Design the middleware order and why a replay costs no token, the headers of the third and fourth report, the ETags before and after resolving, and the client’s retry rules. Then build: idempotency on create, the report limit, ETag and If-Match on resolve, and report.mjs with fetchWithRetry — reusing the modules of 5.1 to 5.4.</p>`,
    `<p>Thiết kế thứ tự middleware và vì sao lần phát lại không tốn token, header của báo hỏng thứ ba và thứ tư, ETag trước và sau khi xử lý, và luật thử lại của client. Rồi xây: idempotency khi tạo, giới hạn báo hỏng, ETag và If-Match khi xử lý, và report.mjs dùng fetchWithRetry — dùng lại các module của 5.1 tới 5.4.</p>`],
  [4, "Reference solution",
    `<p>The report route runs authentication, idempotency, the limit of three per minute, then the old 404-before-400 order. Resolve checks If-Match before anything else and bumps the version. The client generates one key per tap and retries with a two-second timeout.</p>`,
    `<p>Route báo hỏng chạy xác thực, idempotency, giới hạn ba lần mỗi phút, rồi tới thứ tự 404 trước 400 như cũ. Xử lý kiểm If-Match trước mọi thứ và tăng version. Client tạo một khoá mỗi lần bấm và thử lại với timeout hai giây.</p>`],
  [5, "Part C",
    `<p>The first attempt fails with a network error, the retry gets iss_1 as a replay, and the list shows one issue. Three more reports give two 201s and a 429, because the first report used a token while its replay was free. Resolve with v1 succeeds, again with v1 gets 412, and If-None-Match v2 gets 304.</p>`,
    `<p>Lần đầu hỏng vì lỗi mạng, lần thử lại nhận iss_1 dưới dạng phát lại, và danh sách có một báo hỏng. Ba báo hỏng nữa cho hai lần 201 và một 429, vì báo hỏng đầu đã dùng một token còn lần phát lại thì miễn phí. Xử lý với v1 thành công, lần nữa với v1 nhận 412, và If-None-Match v2 nhận 304.</p>`],
  [6, "Rubric",
    `<p>Ten points, pass at seven: three for exactly one issue, two for the limit and headers, two for ETag and 412, one for 304, one for the client and one for an honest transcript. Stretch goals: shared storage for keys and buckets, and a client that reads RateLimit.</p>`,
    `<p>Mười điểm, đạt ở bảy: ba cho đúng một báo hỏng, hai cho giới hạn và header, hai cho ETag và 412, một cho 304, một cho client và một cho transcript trung thực. Nâng cao: nơi lưu dùng chung cho khoá và xô, và client đọc RateLimit.</p>`],
]);
