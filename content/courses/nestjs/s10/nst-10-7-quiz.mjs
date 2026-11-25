/**
 * 10.7 — Kiểm tra Chương 10 (khoá nestjs, soạn 24/11/2026). 10 câu; đáp án đối chiếu output chạy thật (scratchpad/nst/lab/c10/o):
 * câu 1 101-loi, câu 2 104-do + 104-ba-lan, câu 3 102-guard-lop, câu 4 102-vao-cua-conn, câu 5 102-origin, câu 6 102-cum,
 * câu 7 103-co-ban, câu 8 103-redis-hai-ban, câu 9 103-lai, câu 10 moc10-debug. Phân bố đáp án: A3 B3 C2 D2.
 */
export default {
  title: '10.7 — Chapter 10 quiz|||10.7 — Kiểm tra Chương 10',
  slug: 'nst-10-7-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống về Chương 10: lỗi trong handler và ack, khi nào tách dịch vụ, guard không chạy lúc kết nối, kiểm JWT trong handleConnection, cors không chặn transport websocket, hai bản không có adapter, send() không subscribe, transport Redis với hai bản, pipe toàn cục của ứng dụng lai, và APP_GUARD viết cho HTTP chạy trên socket.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, each checked against real output from this chapter (Nest 12.6, @nestjs/websockets + platform-socket.io 12.6, Socket.IO 4.8, @socket.io/redis-adapter 8.3, @nestjs/microservices 12.6, Redis 7.4). Real-time and messaging code rarely throws where you can see it — it hangs, it delivers to the wrong people, or it delivers twice — so every question asks what really happens.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write a gateway, return acks, and emit to a room from an HTTP controller.</li>
<li>I know where to authenticate a socket and why not in a guard or handleConnection.</li>
<li>I can explain CSWSH and what actually stops it.</li>
<li>I know what send/emit do when the other service is slow, down, or running twice.</li>
<li>I can argue for a modular monolith with a measurement, not a slogan.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, câu nào cũng đã đối chiếu với output chạy thật trong chương (Nest 12.6, @nestjs/websockets + platform-socket.io 12.6, Socket.IO 4.8, @socket.io/redis-adapter 8.3, @nestjs/microservices 12.6, Redis 7.4). Mã thời gian thực và nhắn tin hiếm khi ném lỗi ở chỗ bạn thấy — nó treo, gửi nhầm người, hoặc gửi hai lần — nên câu nào cũng hỏi chuyện gì thật sự xảy ra.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được gateway, trả ack, và phát cho một phòng từ controller HTTP.</li>
<li>Tôi biết xác thực socket ở đâu, và vì sao không ở guard hay handleConnection.</li>
<li>Tôi giải thích được CSWSH và thứ gì thật sự chặn nó.</li>
<li>Tôi biết send/emit làm gì khi dịch vụ bên kia chậm, tắt, hoặc chạy hai bản.</li>
<li>Tôi bảo vệ được modular monolith bằng một phép đo, không phải khẩu hiệu.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A gateway handler throws new Error("db down"). The client called await socket.emitWithAck("loi", x) with no timeout. What does the client get?|||Handler của gateway ném new Error("db down"). Client gọi await socket.emitWithAck("loi", x) không đặt timeout. Client nhận gì?',
        options: [
          'An ack containing { error: "db down" }|||Một ack chứa { error: "db down" }',
          'An ack containing { status: "error", message: "Internal server error" }|||Một ack chứa { status: "error", message: "Internal server error" }',
          'An "exception" event with "Internal server error" — and the awaited ack never arrives, so the await hangs|||Sự kiện "exception" mang "Internal server error" — còn ack không bao giờ tới, nên await treo mãi',
          'The socket is disconnected by the server|||Server ngắt socket',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 10.1, section 2: exception event with "Internal server error", stack only in the server log, and "hết giờ chờ ack" for emitWithAck. Use socket.timeout(ms) and return business errors inside the ack.|||VI: Bài 10.1, mục 2: sự kiện exception mang "Internal server error", stack chỉ ở log server, và emitWithAck báo "hết giờ chờ ack". Dùng socket.timeout(ms) và trả lỗi nghiệp vụ trong ack.',
      },
      {
        question: 'A 4-developer team wants to move the rooms module into a TCP microservice "for clean architecture". Measured on one machine: 0.3 µs per call in process, 57–107 µs p50 over localhost TCP. What is the best advice?|||Đội 4 người muốn chuyển module phòng thành microservice TCP "cho kiến trúc sạch". Đo trên một máy: 0,3 µs mỗi lời gọi trong tiến trình, p50 57–107 µs qua TCP localhost. Lời khuyên tốt nhất?',
        options: [
          'Keep it a module that exports only an abstract contract; split later by swapping one provider if a measured need appears|||Giữ là module chỉ export một hợp đồng trừu tượng; tách sau bằng cách đổi một provider nếu xuất hiện nhu cầu đo được',
          'Split now — 100 µs is negligible, so there is no cost|||Tách ngay — 100 µs không đáng kể nên chẳng tốn gì',
          'Split, but use Redis transport so two replicas share the load|||Tách, nhưng dùng transport Redis để hai bản chia tải',
          'Merge rooms into the bookings module so there is no boundary to maintain|||Gộp phòng vào module đặt lịch để khỏi phải giữ ranh giới',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 10.4: the cost is not only latency — stopping the service made 5000/5000 calls fail; Redis transport makes two replicas handle every message (10.3). The boundary is the module + exported PhongApi; TACH=1 swapped one useClass.|||VI: Bài 10.4: chi phí không chỉ là độ trễ — tắt dịch vụ là 5000/5000 lời gọi hỏng; transport Redis khiến hai bản xử lý mọi message (10.3). Ranh giới là module + PhongApi được export; TACH=1 chỉ đổi một useClass.',
      },
      {
        question: '@UseGuards(WsDaDangNhap) is placed on the whole gateway class. A client with no token connects; the server then calls server.emit("thong-bao", …) three times. What does the client experience?|||@UseGuards(WsDaDangNhap) gắn lên cả lớp gateway. Một client không token nối vào; sau đó server gọi server.emit("thong-bao", …) ba lần. Client thấy gì?',
        options: [
          'connect_error — class-level guards run on the handshake|||connect_error — guard gắn ở lớp chạy lúc bắt tay',
          'It connects but receives nothing until it sends a valid message|||Nối được nhưng không nhận gì cho tới khi gửi một tin hợp lệ',
          'It connects, then is disconnected by the guard after the first broadcast|||Nối được, rồi bị guard ngắt sau tin phát đầu tiên',
          'It connects and receives all three broadcasts; only its own messages are rejected|||Nối được và nhận đủ ba tin phát; chỉ tin nó gửi đi mới bị chặn',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 10.2, section 1 (b102g): "đã nhận 3 thông báo phát cho mọi người", then exception "Chưa đăng nhập" for its message. Guards run per message, never on connect.|||VI: Bài 10.2, mục 1 (b102g): "đã nhận 3 thông báo phát cho mọi người", rồi exception "Chưa đăng nhập" cho tin nó gửi. Guard chạy theo từng tin, không bao giờ lúc kết nối.',
      },
      {
        question: 'JWT verification plus a 100 ms "is the account locked?" DB lookup runs inside handleConnection; on failure it calls client.disconnect(true). The server broadcasts every 5 ms. A locked user with a valid token connects. What happens?|||Kiểm JWT cộng 100 ms tra DB "tài khoản bị khoá chưa?" chạy trong handleConnection; sai thì gọi client.disconnect(true). Server phát tin mỗi 5 ms. Một người bị khoá nhưng token còn hợp lệ nối vào. Chuyện gì xảy ra?',
        options: [
          'connect_error immediately, nothing received|||connect_error ngay, không nhận gì',
          'The client sees connect, receives broadcasts for about 100 ms (21 in the lab), then is disconnected|||Client thấy connect, nhận tin phát khoảng 100 ms (21 tin trong lab), rồi bị ngắt',
          'The client is connected but Socket.IO buffers broadcasts until handleConnection returns|||Client đã nối nhưng Socket.IO giữ tin phát lại cho tới khi handleConnection xong',
          'The server crashes because disconnect is called inside a lifecycle hook|||Server sập vì disconnect được gọi trong lifecycle hook',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 10.2, section 2: "SV 9 bị khoá nhận 21". server.use() in afterInit runs before acceptance ⇒ connect_error, 0 messages.|||VI: Bài 10.2, mục 2: "SV 9 bị khoá nhận 21". server.use() trong afterInit chạy trước khi nhận ⇒ connect_error, 0 tin.',
      },
      {
        question: 'A gateway has cors: { origin: ["http://localhost:5173"] } and nothing else about origins. A client sends Origin: http://evil.example with transports: ["websocket"]. Result?|||Gateway có cors: { origin: ["http://localhost:5173"] } và không gì khác về origin. Một client gửi Origin: http://evil.example với transports: ["websocket"]. Kết quả?',
        options: [
          'Rejected with a CORS error during the upgrade|||Bị từ chối với lỗi CORS lúc nâng cấp kết nối',
          'It connects — CORS does not apply to the websocket transport; allowRequest must check Origin|||Nối được — CORS không áp cho transport websocket; phải kiểm Origin trong allowRequest',
          'It connects, but the server drops every message from it|||Nối được, nhưng server bỏ mọi tin từ nó',
          'Rejected only if the client also sends cookies|||Chỉ bị từ chối nếu client gửi kèm cookie',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 10.2, hacker corner: all three clients connected with cors only; with allowRequest the foreign origin got "websocket error" / "xhr poll error". The Gitpod CVE-2023-0957 (2023) handshake accepted Origin: evil.com.|||VI: Bài 10.2, góc hacker: chỉ có cors thì cả ba client đều nối được; thêm allowRequest thì origin lạ nhận "websocket error" / "xhr poll error". Bắt tay của Gitpod (CVE-2023-0957, 2023) chấp nhận Origin: evil.com.',
      },
      {
        question: 'Two app instances, default IoAdapter. SV 7 (instance 1) and the admin (instance 2) both joined room lich:1. An HTTP request on instance 1 calls server.to("lich:1").emit(...). What happens?|||Hai bản ứng dụng, IoAdapter mặc định. SV 7 (bản 1) và admin (bản 2) đều đã vào phòng lich:1. Một request HTTP ở bản 1 gọi server.to("lich:1").emit(...). Chuyện gì xảy ra?',
        options: [
          'SV 7 receives it; the admin receives nothing, and no error is logged anywhere|||SV 7 nhận; admin không nhận gì, và không nơi nào ghi lỗi',
          'Both receive it — rooms are stored in the socket handshake|||Cả hai nhận — room lưu trong handshake của socket',
          'Instance 1 throws "room has members on another node"|||Bản 1 ném "room has members on another node"',
          'Nobody receives it until sticky sessions are enabled|||Không ai nhận cho tới khi bật sticky session',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Lesson 10.2, section 5: without the adapter fetchSockets counts 1 and only SV 7 gets lich-doi; with RedisIoAdapter toanCum = 2 and both receive.|||VI: Bài 10.2, mục 5: không adapter thì fetchSockets đếm 1 và chỉ SV 7 nhận lich-doi; có RedisIoAdapter thì toanCum = 2 và cả hai nhận.',
      },
      {
        question: 'An HTTP handler calls this.phong.send("phong.lay", id) and returns { daGoi: true } without awaiting or subscribing. What does the microservice do?|||Handler HTTP gọi this.phong.send("phong.lay", id) rồi trả { daGoi: true }, không await cũng không subscribe. Microservice làm gì?',
        options: [
          'Handles it; the reply is discarded|||Xử lý; câu trả lời bị bỏ',
          'Handles it twice because the client retries|||Xử lý hai lần vì client thử lại',
          'Logs "no subscriber" and ignores it|||Ghi "no subscriber" rồi bỏ qua',
          'Nothing — send() returns a cold Observable; no message is sent until someone subscribes|||Không gì cả — send() trả Observable lạnh; chưa ai subscribe thì không có message nào được gửi',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Lesson 10.3, section 1: /phong-quen/L2 returned daGoi:true but the service log has no "phong.lay L2". emit() by contrast is hot: lich.da-duyet 7 ran.|||VI: Bài 10.3, mục 1: /phong-quen/L2 trả daGoi:true nhưng log dịch vụ không có "phong.lay L2". Ngược lại emit() là nóng: lich.da-duyet 7 có chạy.',
      },
      {
        question: 'A room service uses Transport.REDIS and runs as two replicas. The API calls send("phong.lay", "L1") once. How many times does the handler run?|||Dịch vụ phòng dùng Transport.REDIS và chạy hai bản. API gọi send("phong.lay", "L1") một lần. Handler chạy mấy lần?',
        options: [
          'Once — Redis load-balances between subscribers|||Một — Redis chia tải giữa các subscriber',
          'Once on each replica in turn (round robin)|||Mỗi lần một bản, luân phiên',
          'Twice — both replicas receive every message; the client takes the first reply|||Hai — cả hai bản nhận mọi message; client lấy câu trả lời đầu',
          'Zero — the second replica fails with EADDRINUSE|||Không lần nào — bản thứ hai lỗi EADDRINUSE',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Lesson 10.3, section 5: both logs show "phong.lay L1" and "lich.da-duyet 7". EADDRINUSE is the TCP case. For competing consumers use NATS queue groups, RabbitMQ or Kafka.|||VI: Bài 10.3, mục 5: cả hai log đều có "phong.lay L1" và "lich.da-duyet 7". EADDRINUSE là ca TCP. Muốn consumer cạnh tranh thì dùng nhóm queue của NATS, RabbitMQ hoặc Kafka.',
      },
      {
        question: 'A hybrid app calls app.useGlobalPipes(new ValidationPipe({ transform: true })) and app.connectMicroservice(T) with default options. A message handler receives { soCho: "3" } for a DTO with @IsInt(). What happens?|||Ứng dụng lai gọi app.useGlobalPipes(new ValidationPipe({ transform: true })) và app.connectMicroservice(T) với tuỳ chọn mặc định. Handler message nhận { soCho: "3" } cho DTO có @IsInt(). Chuyện gì xảy ra?',
        options: [
          'Rejected with a 400-style RpcException|||Bị từ chối bằng RpcException kiểu 400',
          'Accepted as the string "3" — global pipes do not apply to microservice handlers unless inheritAppConfig: true|||Được nhận dưới dạng chuỗi "3" — pipe toàn cục không áp cho handler microservice trừ khi inheritAppConfig: true',
          'Converted to the number 3 by transform|||Được transform đổi thành số 3',
          'The app refuses to start: global pipes conflict with microservices|||Ứng dụng không chịu khởi động: pipe toàn cục xung đột với microservice',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Lesson 10.3, section 6: {"daGiu":"3","kieu":"string"} without inheritAppConfig; with it, every message passed the global pipe (and its HTTP exception became "Internal server error").|||VI: Bài 10.3, mục 6: {"daGiu":"3","kieu":"string"} khi không có inheritAppConfig; có nó thì mọi message qua pipe toàn cục (và exception HTTP của pipe thành "Internal server error").',
      },
      {
        question: 'An app registers JwtAuthGuard (written for HTTP: reads req.headers.authorization) with APP_GUARD, then adds a gateway that authenticates in handshake middleware. A logged-in socket sends watch-room. What happens?|||Ứng dụng đăng ký JwtAuthGuard (viết cho HTTP: đọc req.headers.authorization) bằng APP_GUARD, rồi thêm một gateway xác thực ở middleware bắt tay. Một socket đã đăng nhập gửi watch-room. Chuyện gì xảy ra?',
        options: [
          'The global guard also runs for the WebSocket handler, crashes on undefined headers, and the client gets "Internal server error" with no ack — fix with ctx.getType() !== "http"|||Guard toàn cục cũng chạy cho handler WebSocket, sập vì headers undefined, client nhận "Internal server error" và không có ack — sửa bằng ctx.getType() !== "http"',
          'Nothing special — APP_GUARD applies to controllers only|||Không có gì đặc biệt — APP_GUARD chỉ áp cho controller',
          'The guard reads the token from handshake.auth automatically|||Guard tự đọc token từ handshake.auth',
          'Nest refuses to start: an HTTP guard cannot be global when a gateway exists|||Nest không khởi động: guard HTTP không được toàn cục khi có gateway',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Milestone 10.6, step 4: "TypeError: Cannot read properties of undefined (reading \'authorization\') at JwtAuthGuard.canActivate", 4/5 tests timed out. The global ThrottlerGuard had a second surprise: one bucket keyed undefined for all sockets.|||VI: Mốc 10.6, bước 4: "TypeError: Cannot read properties of undefined (reading \'authorization\') at JwtAuthGuard.canActivate", 4/5 test hết giờ. ThrottlerGuard toàn cục còn một bất ngờ thứ hai: một xô khoá undefined cho mọi socket.',
      },
    ],
  },
};
