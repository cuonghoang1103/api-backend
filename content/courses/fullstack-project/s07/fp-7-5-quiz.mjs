/**
 * 7.5 — Kiểm tra Chương 7 (soạn 24/11/2026, agent fsp). BÀI THÊM (không có trong khung), slug mới fp-7-5-quiz.
 * 10 câu; đáp án dựa trên output chạy thật của bài 7.1–7.4 (Chrome 150, Socket.IO 4.8.4, Vite 8.3.8, Redis 8.12).
 * Phân bố đáp án: A3 B2 C2 D3.
 */
export default {
  title: '7.5 — Chapter 7 quiz|||7.5 — Kiểm tra Chương 7',
  slug: 'fp-7-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: polling tốn gì và trễ bao nhiêu, proxy thiếu ws, server.close() treo, hợp đồng sự kiện kéo cả API vào tsc của web, lũ phòng, WebSocket và CORS, số lượt thích đi ngược, bình luận bị đếm hai lần, bình luận mất sau khi API khởi động lại, token hết hạn lúc nối lại, và hai instance không adapter.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations taken from what actually happened when ChiaSe got live comments and likes. Read every explanation, including for the questions you got right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can show a <code>2probe</code> frame in DevTools and explain what it means.</li>
<li>I can restart my API while a tab is open, post during the gap, and the tab still shows the comment.</li>
<li>I can open my API from a page on another origin and show it being refused.</li>
<li>I can explain why my like counter never goes backwards.</li>
<li>My Checkpoint 7 passes 16/16 on a clean clone.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ chính những gì đã xảy ra khi ChiaSe có bình luận và lượt thích tức thời. Đọc mọi phần giải thích, kể cả câu bạn làm đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chỉ ra được khung <code>2probe</code> trong DevTools và giải thích nó nghĩa là gì.</li>
<li>Tôi khởi động lại API khi đang mở tab, đăng bài trong khe hở, và tab vẫn hiện bình luận đó.</li>
<li>Tôi mở API từ một trang ở origin khác và cho thấy nó bị từ chối.</li>
<li>Tôi giải thích được vì sao bộ đếm lượt thích của mình không bao giờ đi ngược.</li>
<li>Checkpoint 7 của tôi đạt 16/16 trên clone sạch.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'The post page polls the comments every 3 seconds. Eight comments are posted at random moments. What did the measurement show?|||Trang bài viết hỏi lại bình luận mỗi 3 giây. Tám bình luận được đăng vào lúc ngẫu nhiên. Phép đo cho thấy gì?',
        options: [
          'Delays between 177 ms and 3,317 ms (median ≈ 2.8 s) and 20 requests per minute from one tab even when nothing changed|||Trễ từ 177 ms tới 3.317 ms (trung vị ≈ 2,8 s) và 20 request mỗi phút từ một tab kể cả khi không có gì thay đổi',
          'Always exactly 3 seconds, because the interval is fixed|||Luôn đúng 3 giây, vì chu kỳ cố định',
          'Under 100 ms every time, because the 304 responses skip the database|||Luôn dưới 100 ms, vì phản hồi 304 bỏ qua CSDL',
          'No requests when nothing changed, thanks to the ETag|||Không có request nào khi không đổi gì, nhờ ETag',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Delay is random between 0 and the interval (plus request and render time): 177 ms … 3,317 ms. Express answered 7 of 17 polls with 304 thanks to the ETag, but it still ran the queries to build the body before comparing. 200 such tabs cost 4,008 requests/min.|||VI: Trễ ngẫu nhiên từ 0 tới chu kỳ (cộng thời gian request và vẽ): 177 ms … 3.317 ms. Express trả 7/17 lần bằng 304 nhờ ETag, nhưng vẫn chạy truy vấn để dựng thân rồi mới so. 200 tab như vậy tốn 4.008 request/phút.',
      },
      {
        question: "Vite's proxy has '/socket.io': { target } but no ws: true. Comments still appear within ~50 ms. What is actually happening?|||Proxy của Vite có '/socket.io': { target } nhưng thiếu ws: true. Bình luận vẫn hiện sau ~50 ms. Thực ra chuyện gì đang xảy ra?",
        options: [
          'The proxy silently converts WebSocket to SSE|||Proxy lặng lẽ đổi WebSocket thành SSE',
          'Everything is fine; ws: true only matters in production|||Mọi thứ ổn; ws: true chỉ cần ở production',
          'The browser falls back to polling every 3 seconds|||Trình duyệt lùi về polling mỗi 3 giây',
          'The upgrade never completes, so the connection stays on long-polling: each event releases a held GET and a new one is sent|||Cú nâng cấp không bao giờ xong, nên kết nối ở lại long-polling: mỗi sự kiện nhả một GET đang bị giữ rồi gửi GET mới',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Measured: a WS was opened but never received a frame; the API log showed "nối (polling)" and no upgrade. Long-polling is fast but costs a request per event and needs sticky sessions with several instances. With ws: true the 2probe/3probe exchange appears and frames arrive over WebSocket.|||VI: Đã đo: một WS được mở nhưng không bao giờ nhận khung nào; log API ghi "nối (polling)" và không có nâng cấp. Long-polling nhanh nhưng tốn một request mỗi sự kiện và cần sticky session khi có nhiều instance. Có ws: true thì thấy trao đổi 2probe/3probe và khung tới qua WebSocket.',
      },
      {
        question: 'With one tab open, the API receives SIGTERM. The shutdown handler from Chapter 2 calls server.close(). What happens?|||Đang mở một tab, API nhận SIGTERM. Hàm tắt từ Chương 2 gọi server.close(). Chuyện gì xảy ra?',
        options: [
          'The process exits immediately; WebSockets are not HTTP connections|||Tiến trình thoát ngay; WebSocket không phải kết nối HTTP',
          'The process keeps running until the WebSocket closes by itself — in Docker it would be killed after the stop timeout|||Tiến trình vẫn chạy cho tới khi WebSocket tự đóng — trong Docker nó sẽ bị giết sau thời gian chờ của lệnh stop',
          'Node throws ERR_SERVER_NOT_RUNNING|||Node ném ERR_SERVER_NOT_RUNNING',
          'The tab is disconnected with "io server disconnect" and reconnects to the new process|||Tab bị ngắt với "io server disconnect" và nối sang tiến trình mới',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Measured: 15 s later the process was still alive; it exited only when the client left (~18 s). server.close() waits for existing connections. io.close() disconnects every socket and then closes the HTTP server: both tabs were disconnected and the process exited at once.|||VI: Đã đo: 15 s sau tiến trình vẫn sống; chỉ thoát khi client tự đi (~18 s). server.close() chờ các kết nối đang có. io.close() ngắt mọi socket rồi đóng máy chủ HTTP: hai tab bị ngắt và tiến trình thoát ngay.',
      },
      {
        question: "The shared contract hop-dong.ts first did `import type { BinhLuanDto } from '../services/comment.service.js'`. Why did the WEB type check fail?|||Hợp đồng dùng chung hop-dong.ts lúc đầu `import type { BinhLuanDto } from '../services/comment.service.js'`. Vì sao kiểm kiểu của WEB thất bại?",
        options: [
          'import type is not allowed across workspaces|||Không được dùng import type giữa các workspace',
          'Socket.IO cannot send TypeScript types|||Socket.IO không gửi được kiểu TypeScript',
          'The checker still reads the imported file and everything it imports (Prisma, http-error.ts with erasableSyntaxOnly errors), and the Prisma type said Date where the wire carries a string|||Bộ kiểm vẫn đọc tệp được import và mọi thứ nó import (Prisma, http-error.ts với lỗi erasableSyntaxOnly), và kiểu Prisma ghi Date trong khi trên dây là chuỗi',
          'The web bundle would include Prisma|||Bundle của web sẽ chứa Prisma',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: import type is erased from the bundle, but type checking follows the import graph. tsc printed TS1294 in ../api/src/lib/http-error.ts and "Date is not assignable to string". A shared contract imports nothing and describes JSON on the wire.|||VI: import type bị xoá khỏi bundle, nhưng kiểm kiểu đi theo đồ thị import. tsc in TS1294 ở ../api/src/lib/http-error.ts và "Date is not assignable to string". Hợp đồng dùng chung không import gì và mô tả JSON trên dây.',
      },
      {
        question: "A guest socket sends 'bai:xem' with 1,000,000 random ids to the first room handler (join whatever is asked). Result?|||Một socket khách gửi 'bai:xem' với 1.000.000 id ngẫu nhiên tới hàm vào phòng bản đầu (xin phòng nào cho vào phòng đó). Kết quả?",
        options: [
          'All 1,000,000 joins succeed in about 16 s and the API grows by about 345 MB|||Cả 1.000.000 lần vào phòng đều thành công trong khoảng 16 s và API phình thêm khoảng 345 MB',
          'Socket.IO limits each socket to 100 rooms by default|||Socket.IO mặc định giới hạn mỗi socket 100 phòng',
          'maxHttpBufferSize drops the messages|||maxHttpBufferSize bỏ các tin nhắn',
          'The socket is disconnected after the first invalid id|||Socket bị ngắt sau id không hợp lệ đầu tiên',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Measured: 1,000,000 joins in 15.9 s, RSS 219 → 564 MB, socket still connected. A room cap alone then allowed 50,000 database lookups (random ids never join), so the final handler validates, rate-limits per socket, caps, then authorizes.|||VI: Đã đo: 1.000.000 lần vào phòng trong 15,9 s, RSS 219 → 564 MB, socket vẫn nối. Chỉ giới hạn số phòng thì vẫn để 50.000 lần tra CSDL (id ngẫu nhiên không bao giờ vào được phòng), nên hàm cuối kiểm kiểu, giới hạn tốc độ theo socket, giới hạn số phòng, rồi mới phân quyền.',
      },
      {
        question: 'A page on http://127.0.0.1:41818 runs `new WebSocket("ws://localhost:41815/socket.io/?EIO=4&transport=websocket")`. Before the Origin check, what happened?|||Một trang ở http://127.0.0.1:41818 chạy `new WebSocket("ws://localhost:41815/socket.io/?EIO=4&transport=websocket")`. Trước khi có kiểm Origin, chuyện gì đã xảy ra?',
        options: [
          'CORS blocked it, as it blocked the fetch|||CORS chặn nó, như đã chặn fetch',
          'The handshake failed because no token was sent|||Bắt tay thất bại vì không gửi token',
          'It connected but the server ignored every event|||Nối được nhưng máy chủ bỏ qua mọi sự kiện',
          'The polling fetch was blocked by CORS, but the WebSocket connected and joined a room (430[{"ok":true}])|||Fetch polling bị CORS chặn, nhưng WebSocket nối được và vào được phòng (430[{"ok":true}])',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: CORS does not apply to WebSocket handshakes. Harmless here only because identity comes from a token the foreign page lacks; with cookie auth it would be Cross-Site WebSocket Hijacking (Gitpod, CVE-2023-0957). allowRequest now refuses foreign Origins: 400 on the upgrade, 403 on polling.|||VI: CORS không áp cho cú bắt tay WebSocket. Vô hại ở đây chỉ vì danh tính đến từ token mà trang lạ không có; nếu xác thực bằng cookie thì đó là Cross-Site WebSocket Hijacking (Gitpod, CVE-2023-0957). allowRequest giờ từ chối Origin lạ: 400 khi nâng cấp, 403 khi polling.',
      },
      {
        question: '40 users press Like at the same moment; the service counts and emits right after each write. What did the listener record?|||40 người bấm Thích cùng lúc; service đếm và phát ngay sau mỗi lần ghi. Socket nghe ghi lại được gì?',
        options: [
          'Exactly one event with 40|||Đúng một sự kiện với số 40',
          '40 events whose values sometimes went backwards (… 40 40 35 40 …), although the last one was right|||40 sự kiện mà giá trị có lúc đi ngược (… 40 40 35 40 …), dù sự kiện cuối đúng',
          '40 events 1, 2, 3, …, 40 in order|||40 sự kiện 1, 2, 3, …, 40 theo thứ tự',
          'A unique-constraint error for most users|||Lỗi trùng khoá cho đa số người dùng',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Counts finish in one order and emits go out in another. Coalescing per post (one count-and-emit per 100 ms, never two counts in flight) produced one event with the right number. Absolute counts, never +1, so a missed event is corrected by the next.|||VI: Phép đếm xong theo một thứ tự, sự kiện đi ra theo thứ tự khác. Gộp theo bài (mỗi 100 ms một lần đếm-và-phát, không bao giờ hai lần đếm chồng nhau) cho ra một sự kiện với số đúng. Số tuyệt đối, không bao giờ +1, để sự kiện bị lỡ được sự kiện sau sửa.',
      },
      {
        question: "An comments three times on a post that had 23 comments. An's page shows \"Comments (29)\", Bình's shows 26. Why?|||An bình luận ba lần vào bài đang có 23 bình luận. Trang của An hiện \"Bình luận (29)\", trang Bình hiện 26. Vì sao?",
        options: [
          'The server emitted each event twice|||Máy chủ phát mỗi sự kiện hai lần',
          "Bình's socket missed three events|||Socket của Bình lỡ ba sự kiện",
          "On the sender's page both the HTTP response and the room event incremented the counter|||Ở trang người gửi, cả phản hồi HTTP lẫn sự kiện của phòng đều cộng vào bộ đếm",
          'React StrictMode ran the handler twice|||StrictMode của React chạy hàm xử lý hai lần',
        ],
        correctIndex: 2, points: 1,
        explanation: "EN: The room includes the sender's own tab. The list was de-duplicated by id, the counter was not. One function, themBinhLuan, accepts each id once whichever path arrives first. Excluding the sender on the server would break the same user's other tabs.|||VI: Phòng có cả tab của người gửi. Danh sách đã gộp theo id, bộ đếm thì chưa. Một hàm duy nhất, themBinhLuan, nhận mỗi id một lần, đường nào tới trước thì tính. Loại người gửi ở máy chủ thì các tab khác của chính người đó sẽ hỏng.",
      },
      {
        question: 'The API restarts (a deploy). As soon as /health answers, An posts a comment. Bình\'s tab reconnects a few seconds later and rejoins the room. Before the fix, what did Bình see?|||API khởi động lại (deploy). Ngay khi /health trả lời, An đăng một bình luận. Tab của Bình nối lại vài giây sau và vào lại phòng. Trước khi sửa, Bình thấy gì?',
        options: [
          'The comment, replayed by Socket.IO after reconnecting|||Bình luận đó, được Socket.IO phát lại sau khi nối lại',
          'An error toast|||Một thông báo lỗi',
          'The comment twice|||Bình luận đó hai lần',
          'Nothing — 3 of 3 runs lost the comment; Socket.IO delivers at most once|||Không gì cả — 3/3 lần mất bình luận; Socket.IO giao tối đa một lần',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: The event was emitted into an empty room. The fix: after re-joining (and only after the ack), ask the database — refresh the post counts and catch up from the last cursor. 3 of 3 recovered, 2.3–4.3 s after the restart. Connection state recovery would not survive a restart.|||VI: Sự kiện được phát vào một phòng trống. Cách sửa: sau khi vào lại phòng (và chỉ sau ack), hỏi CSDL — lấy lại số đếm của bài và bắt kịp từ cursor cuối. Hồi phục 3/3, 2,3–4,3 s sau khi khởi động lại. Connection state recovery không sống qua được lần khởi động lại.',
      },
      {
        question: 'Two API instances share the database but have no adapter. Tab X is connected to instance 1, tab Y to instance 2. An comments through instance 1. Who receives the event?|||Hai instance API dùng chung CSDL nhưng không có adapter. Tab X nối instance 1, tab Y nối instance 2. An bình luận qua instance 1. Ai nhận sự kiện?',
        options: [
          'Only tab X — rooms live in the memory of each process|||Chỉ tab X — phòng nằm trong bộ nhớ từng tiến trình',
          'Both, because they joined the same room name|||Cả hai, vì cùng tên phòng',
          'Neither, until sticky sessions are enabled|||Không ai, cho tới khi bật sticky session',
          'Both, but with a 25-second delay for tab Y|||Cả hai, nhưng tab Y trễ 25 giây',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Measured: X received only "gửi qua 41815", Y only "gửi qua 41819". The Redis adapter publishes room emits to every instance (both tabs then got both). Sticky sessions solve a different problem — polling requests reaching another instance get "Session ID unknown".|||VI: Đã đo: X chỉ nhận "gửi qua 41815", Y chỉ nhận "gửi qua 41819". Redis adapter publish lệnh phát vào phòng tới mọi instance (khi đó cả hai tab nhận cả hai). Sticky session giải bài toán khác — request polling tới nhầm instance bị trả "Session ID unknown".',
      },
    ],
  },
};
