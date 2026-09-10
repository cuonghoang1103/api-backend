/**
 * Socket.IO — Progress Test 1 (chương s00–s03).
 *
 * Đề tự soạn, bám sát `content/courses/socket-io/s00-intro`, `s01-vong-doi`,
 * `s02-transport`, `s03-room`. 30 câu trắc nghiệm + 2 câu lập trình làm ngay
 * trong phòng thi (chấm bằng AI theo rubric). PT là đề GIỮA KỲ — dễ hơn FE
 * một bậc, và không trùng câu nào với SOCKET-IO-FE.mjs / SOCKET-IO-PE.mjs.
 *
 * ⚠️ MỌI packet, mọi chuỗi reason, mọi mã lỗi HTTP và cả hai lời giải mẫu
 * đều được ĐO THẬT bằng cách dựng máy chủ socket.io nháp trên cổng ngẫu
 * nhiên rồi bắt frame — không suy đoán, không chép từ tài liệu.
 *
 * Phiên bản đã dùng để đo (08–10/09/2026):
 *   socket.io 4.8.3 · socket.io-client 4.8.3 · engine.io 6.6.8
 *   engine.io-client 6.6.5 · engine.io-parser 5.2.3 · socket.io-parser 4.2.7
 *   ws 8.x · Node v22.21.0 · darwin arm64
 *
 * ────────────────────────────────────────────────────────────────────────
 * ⛔ GIÁO TRÌNH SAI — ĐỀ NÀY THEO MÁY, KHÔNG THEO BÀI HỌC
 * ────────────────────────────────────────────────────────────────────────
 * 1. `io.to(A).to(B)` là **UNION, KHÔNG phải INTERSECTION**.
 *    Bài 3.1 (s03) và cả cột A#5 của bài 11.1 khẳng định "intersection —
 *    phải ở CẢ A VÀ B". Đo thật với A∈r1, B∈r1+r2, C∈r2:
 *      io.to('r1').to('r2').emit('m')  ->  A, B, C   (B nhận ĐÚNG 1 gói)
 *      io.to(['r1','r2']).emit('m')    ->  A, B, C   (y hệt)
 *    Hai cách viết cho ra CÙNG một tập người nhận. Câu 24 hỏi đúng chỗ này.
 *
 * 2. Mảng `transports` của CLIENT **CHÍNH LÀ thứ tự thử**.
 *    Bài 0.2 và cột A#2 của 11.1 nói "client LUÔN bắt đầu bằng polling,
 *    mảng chỉ là danh sách được phép". Đo thật:
 *      transports:['websocket','polling'] -> transport lúc mở = websocket
 *      transports:['polling','websocket'] -> transport lúc mở = polling
 *    Câu nói của bài chỉ đúng cho tuỳ chọn PHÍA SERVER. Câu 16.
 *
 * 3. `io.close()` KHÔNG cho client chuỗi `"io server disconnect"`.
 *    Bài 5.4 (s05, checklist scale) khẳng định vậy. Đo thật:
 *      io.close()  ->  server: "server shutting down" · client: "transport close"
 *    (client.active vẫn true ⇒ nó TỰ nối lại). Muốn client thấy
 *    "io server disconnect" thì phải gọi `socket.disconnect()`. Câu 13.
 *
 * 4. CONNECT_ERROR trên dây là một OBJECT, không phải chuỗi trần.
 *    Bài 2.4 (s02) in ra `44"unauthorized"`. Đo thật:
 *      44{"message":"unauthorized","data":{"code":401}}
 *    Câu 3.
 *
 * 5. Binary trên polling KHÔNG có dạng `4b1{...}`.
 *    Bài 2.5 (s02) viết vậy. Đo thật (một lượt poll, ngăn bằng \x1e):
 *      451-["bin",{"_placeholder":true,"num":0},{"meta":1}]  \x1e  bAQID
 *    Tức `45` + số attachment + `-` + JSON, rồi attachment là `b`+base64. Câu 7.
 *
 * 6. Danh sách "reserved event name" của bài 3.5 quá rộng.
 *    Bài liệt kê cả `ping` `pong` `reconnect` `reconnect_attempt` `error`.
 *    Đo thật trên Socket phía server, chỉ 6 tên NÉM lỗi
 *    `"X" is reserved event name`: connect · connection · disconnect ·
 *    disconnecting · newListener · removeListener (+ connect_error phía client).
 *    `socket.emit('ping')`, `socket.emit('error')` chạy bình thường.
 *
 * 7. Thứ tự kiểm tra tham số handshake của engine.io KHÔNG như trực giác.
 *    Đo thật, ưu tiên từ trên xuống:
 *      transport lạ              -> 400 {"code":0,"message":"Transport unknown"}
 *      có sid nhưng worker không biết -> 400 {"code":1,"message":"Session ID unknown"}
 *      KHÔNG có sid và EIO != 4  -> 400 {"code":5,"message":"Unsupported protocol version"}
 *    Hệ quả bất ngờ: `EIO=3` kèm một sid HỢP LỆ vẫn trả **200** — phiên bản
 *    giao thức chỉ được kiểm ở lượt bắt tay ĐẦU TIÊN. Câu 20 + câu 32.
 *
 * 8. `socket.disconnect(false)` và `socket.disconnect(true)` cho CÙNG một
 *    chuỗi reason ("server namespace disconnect" / "io server disconnect").
 *    Tham số chỉ quyết định có đóng luôn kết nối tầng dưới hay không. Câu 11.
 *
 * KHÔNG ĐO ĐƯỢC (nên không ra đề dạng con số):
 *   - Mọi số đo thời gian/độ trễ/thông lượng: máy đang chạy nhiều agent
 *     song song, ba lượt đo cho ba kết quả khác nhau. Đề chỉ hỏi CƠ CHẾ
 *     (ví dụ cửa sổ phát hiện = pingInterval + pingTimeout) chứ không hỏi
 *     "mất bao nhiêu mili giây".
 *   - Hành vi cụm nhiều worker thật (cần Redis + nhiều tiến trình) — để PT2.
 *
 * Phân bố đáp án (đếm bằng lệnh trong CLAUDE.md): { 0: 8, 1: 8, 2: 8, 3: 8 }
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SOCKET-IO-PT1.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/socketio-exam-kit.mjs';

export default {
  course: { slug: 'socket-io' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Chapters 0–3 (the four layers, one connection, transports, rooms)',
        'Kiểm tra tiến độ 1 — Chương 0–3 (bốn tầng, một connection, transport, room)',
      ),
      description: B(
        'First third of the Socket.IO course: what Socket.IO is made of, the wire format, the lifecycle of one connection, transports and the upgrade, rooms and namespaces. 30 multiple-choice questions plus 2 coding questions you write here in the exam room. Every packet in this paper was captured from a real socket.io 4.8.3 server.',
        'Một phần ba đầu của khoá Socket.IO: Socket.IO được làm từ gì, định dạng trên dây, vòng đời một connection, transport và cú upgrade, room và namespace. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi. Mọi packet trong đề đều bắt từ một máy chủ socket.io 4.8.3 thật.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '0–3'),
      questions: [
        // ── Chương 0 — Socket.IO thật sự là gì ──────────────────────────
        mcq({
          prompt: B(
            'The course splits Socket.IO into four layers: the wire, engine.io, socket.io, and your code. Which layer owns <b>rooms</b>, and which layer owns the <b>heartbeat</b>?',
            'Giáo trình chia Socket.IO thành bốn tầng: dây, engine.io, socket.io, mã của bạn. Tầng nào sở hữu <b>room</b>, và tầng nào sở hữu <b>nhịp tim</b>?',
          ),
          options: [
            B('Rooms belong to socket.io (layer 3); the heartbeat belongs to engine.io (layer 2)', 'Room thuộc socket.io (tầng 3); nhịp tim thuộc engine.io (tầng 2)'),
            B('Both belong to engine.io — it manages the whole connection', 'Cả hai thuộc engine.io — nó quản lý toàn bộ connection'),
            B('Rooms belong to engine.io; the heartbeat is something you write at layer 4', 'Room thuộc engine.io; nhịp tim là thứ bạn tự viết ở tầng 4'),
            B('Both belong to socket.io — engine.io only picks the transport', 'Cả hai thuộc socket.io — engine.io chỉ chọn transport'),
          ],
          correct: 0,
          explanation: EX(
            'Rooms are a layer-3 idea: engine.io has never heard of them, which is exactly why a second worker with its own engine.io knows nothing about a room on the first one. The heartbeat is layer 2 — engine.io sends the ping and closes the socket when the pong does not come back, and that is why you must never write your own ping at layer 4.',
            'Room là khái niệm của tầng 3: engine.io chưa từng nghe tới nó, và đó chính là lý do một worker thứ hai với engine.io riêng của nó không biết gì về room bên worker thứ nhất. Nhịp tim thuộc tầng 2 — engine.io gửi ping và đóng socket khi pong không về, nên đừng bao giờ tự viết ping ở tầng 4.',
          ),
        }),

        mcq({
          prompt: B(
            'A capture from a real server shows these two frames arriving in this order on one fresh connection:' + code(
              '0{"sid":"WnhdM7PpFlisw8SAAAAA","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}\n' +
              '40{"sid":"Kd73JRgkTPwtO41FAAAB"}',
            ) + 'What made the SECOND frame appear?',
            'Một bản bắt gói từ máy chủ thật cho thấy hai frame này về theo đúng thứ tự trên một connection vừa mở:' + code(
              '0{"sid":"WnhdM7PpFlisw8SAAAAA","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}\n' +
              '40{"sid":"Kd73JRgkTPwtO41FAAAB"}',
            ) + 'Điều gì làm frame THỨ HAI xuất hiện?',
          ),
          options: [
            B('The server sends it automatically 25000 ms after the handshake', 'Máy chủ tự gửi nó 25000 ms sau khi bắt tay'),
            B('The client sent <code>40</code> to join a namespace, and this is the server answering', 'Client đã gửi <code>40</code> để tham gia một namespace, và đây là máy chủ trả lời'),
            B('The transport finished upgrading from polling to WebSocket', 'Transport vừa nâng cấp xong từ polling lên WebSocket'),
            B('The first frame was too long, so engine.io split it into two', 'Frame thứ nhất quá dài nên engine.io cắt nó làm hai'),
          ],
          correct: 1,
          explanation: EX(
            'Measured by driving the protocol by hand: after the <code>0{…}</code> OPEN frame nothing else arrives until the client sends <code>40</code> (engine.io MESSAGE + socket.io CONNECT). Only then does the server answer <code>40{"sid":…}</code>. That is also why the two sids differ — the first is the engine.io session, the second is the socket.io socket inside it. Sending <code>420["hello",{}]</code> next produced <code>430[…]</code> back, still on the same engine.io session.',
            'Đo bằng cách tự tay điều khiển giao thức: sau frame OPEN <code>0{…}</code> thì không có gì về nữa cho tới khi client gửi <code>40</code> (engine.io MESSAGE + socket.io CONNECT). Lúc đó máy chủ mới trả <code>40{"sid":…}</code>. Đó cũng là lý do hai sid khác nhau — cái đầu là phiên engine.io, cái sau là socket của socket.io nằm bên trong. Gửi tiếp <code>420["hello",{}]</code> thì nhận về <code>430[…]</code>, vẫn trên cùng phiên engine.io ấy.',
          ),
        }),

        mcq({
          prompt: B(
            'An auth middleware calls <code>next(err)</code> where <code>err.message</code> is <code>"unauthorized"</code> and <code>err.data</code> is <code>{ code: 401 }</code>. What does the client receive on the wire?',
            'Một middleware xác thực gọi <code>next(err)</code> với <code>err.message</code> là <code>"unauthorized"</code> và <code>err.data</code> là <code>{ code: 401 }</code>. Client nhận được gì trên dây?',
          ),
          options: [
            B('<code>44"unauthorized"</code> — the message as a bare JSON string', '<code>44"unauthorized"</code> — thông điệp dạng chuỗi JSON trần'),
            B('HTTP <code>401 Unauthorized</code>, because auth happens before the socket exists', 'HTTP <code>401 Unauthorized</code>, vì xác thực xảy ra trước khi có socket'),
            B('<code>44{"message":"unauthorized","data":{"code":401}}</code>', '<code>44{"message":"unauthorized","data":{"code":401}}</code>'),
            B('<code>41{"reason":"unauthorized"}</code> — a DISCONNECT packet carrying the reason', '<code>41{"reason":"unauthorized"}</code> — một packet DISCONNECT mang theo lý do'),
          ],
          correct: 2,
          explanation: EX(
            'Captured verbatim from a raw WebSocket client that sent <code>40{"token":"sai"}</code>: the answer is <code>44{"message":"unauthorized","data":{"code":401}}</code>. <code>4</code> is engine.io MESSAGE, the second <code>4</code> is socket.io CONNECT_ERROR, and the payload is an OBJECT — which is how <code>err.data</code> survives the trip and reaches the client as <code>err.data</code> inside the <code>connect_error</code> handler. Note the handshake itself already answered 200: the middleware only runs when the CONNECT packet arrives.',
            'Bắt nguyên văn từ một client WebSocket thô đã gửi <code>40{"token":"sai"}</code>: câu trả lời là <code>44{"message":"unauthorized","data":{"code":401}}</code>. <code>4</code> là engine.io MESSAGE, <code>4</code> thứ hai là socket.io CONNECT_ERROR, và payload là một OBJECT — nhờ vậy <code>err.data</code> sống sót qua đường truyền và tới client dưới dạng <code>err.data</code> trong handler <code>connect_error</code>. Lưu ý bản thân cú bắt tay đã trả 200 từ trước: middleware chỉ chạy khi packet CONNECT tới.',
          ),
        }),

        mcq({
          prompt: B(
            'In a DevTools WS tab you see a frame that is exactly the single character <code>3</code>, and later a frame that begins <code>43</code>. What are they?',
            'Trong tab WS của DevTools bạn thấy một frame đúng bằng một ký tự <code>3</code>, và sau đó một frame bắt đầu bằng <code>43</code>. Chúng là gì?',
          ),
          options: [
            B('A lone <code>3</code> is a socket.io ACK; <code>43</code> is an ACK carrying binary', 'Một mình <code>3</code> là ACK của socket.io; <code>43</code> là ACK có kèm binary'),
            B('Both are engine.io PONG — the second one just carries a payload', 'Cả hai đều là PONG của engine.io — cái sau chỉ là có thêm payload'),
            B('A lone <code>3</code> is engine.io PONG; <code>43</code> is engine.io MESSAGE carrying a socket.io ACK', 'Một mình <code>3</code> là PONG của engine.io; <code>43</code> là engine.io MESSAGE mang một ACK của socket.io'),
            B('A lone <code>3</code> is a malformed frame; <code>43</code> is the retransmission of it', 'Một mình <code>3</code> là frame hỏng; <code>43</code> là lần gửi lại của nó'),
          ],
          correct: 2,
          explanation: EX(
            'Same digit, different layer — the trap the course warns about. A frame with ONE character is read at layer 2 only: <code>2</code> is PING, <code>3</code> is PONG. A frame starting with <code>4</code> is engine.io MESSAGE, and then the NEXT digit is the socket.io type, where <code>3</code> means ACK. Measured: the server sent <code>2</code> and the client answered <code>3</code>; separately an <code>emit</code> with a callback produced <code>420[…]</code> out and <code>430[…]</code> back.',
            'Cùng con số, khác tầng — đúng cái bẫy bài học cảnh báo. Frame chỉ có MỘT ký tự thì đọc ở tầng 2: <code>2</code> là PING, <code>3</code> là PONG. Frame bắt đầu bằng <code>4</code> là engine.io MESSAGE, và chữ số TIẾP THEO mới là kiểu của socket.io, trong đó <code>3</code> nghĩa là ACK. Đo thật: máy chủ gửi <code>2</code> và client trả <code>3</code>; ở phép đo khác, một <code>emit</code> có callback sinh ra <code>420[…]</code> đi và <code>430[…]</code> về.',
          ),
        }),

        mcq({
          prompt: B(
            'A client is configured with <code>transports: ["websocket"]</code> and connects successfully. The handshake frame comes back as:' + code(
              '0{"sid":"udnmynTOxfUiaM7mAAAA","upgrades":[],"pingInterval":300,"pingTimeout":300,"maxPayload":1000000}',
            ) + 'Why is <code>upgrades</code> an empty array?',
            'Một client cấu hình <code>transports: ["websocket"]</code> và kết nối thành công. Frame bắt tay về như sau:' + code(
              '0{"sid":"udnmynTOxfUiaM7mAAAA","upgrades":[],"pingInterval":300,"pingTimeout":300,"maxPayload":1000000}',
            ) + 'Vì sao <code>upgrades</code> là mảng rỗng?',
          ),
          options: [
            B('The server has WebSocket disabled, so there is nothing to upgrade to', 'Máy chủ đã tắt WebSocket nên không còn gì để nâng cấp lên'),
            B('The array is only filled in after the first ping/pong round completes', 'Mảng chỉ được điền sau khi vòng ping/pong đầu tiên hoàn tất'),
            B('The nginx in front stripped the <code>Upgrade</code> header', 'nginx đứng trước đã cắt mất header <code>Upgrade</code>'),
            B('It is already ON WebSocket — there is no better transport left to move to', 'Nó đã ĐANG ở trên WebSocket — không còn transport nào tốt hơn để chuyển sang'),
          ],
          correct: 3,
          explanation: EX(
            'Measured both ways on the same server: a handshake requested with <code>transport=polling</code> answers <code>"upgrades":["websocket"]</code>, and one requested with <code>transport=websocket</code> answers <code>"upgrades":[]</code>. The field lists transports BETTER than the current one, so it is empty when you are already on the best. That matters for diagnosis: an empty <code>upgrades</code> on a POLLING handshake is the proxy problem the course describes — on a WebSocket handshake it is normal.',
            'Đo cả hai chiều trên cùng một máy chủ: cú bắt tay xin bằng <code>transport=polling</code> trả về <code>"upgrades":["websocket"]</code>, còn xin bằng <code>transport=websocket</code> trả về <code>"upgrades":[]</code>. Trường này liệt kê những transport TỐT HƠN cái đang dùng, nên nó rỗng khi bạn đã ở cái tốt nhất. Điều đó quan trọng khi chẩn đoán: <code>upgrades</code> rỗng trên một cú bắt tay POLLING mới là lỗi proxy mà bài học mô tả — trên cú bắt tay WebSocket thì đó là bình thường.',
          ),
        }),

        mcq({
          prompt: B(
            'Choose TWO things Socket.IO does NOT give you, according to chapter 0.',
            'Chọn HAI thứ Socket.IO KHÔNG cho bạn, theo chương 0.',
          ),
          options: [
            B('A topic hierarchy with wildcards and QoS levels the way MQTT has', 'Cây chủ đề có ký tự đại diện và các mức QoS như MQTT có'),
            B('Binary payloads — a <code>Buffer</code> must be base64-encoded by you first', 'Payload binary — <code>Buffer</code> phải do bạn tự mã hoá base64 trước'),
            B('Automatic reconnection with exponential backoff on the client', 'Tự động nối lại với backoff hàm mũ ở phía client'),
            B('A delivery guarantee: by default an <code>emit</code> is at-most-once', 'Bảo đảm giao hàng: mặc định một <code>emit</code> là at-most-once'),
          ],
          correct: [0, 3],
          explanation: EX(
            'Socket.IO gives you flat event names plus rooms, not an MQTT-style topic tree, and it has no retained messages and no QoS. It also promises nothing about delivery — chapter 6 builds at-least-once on top with acks. It DOES handle binary natively (a <code>Buffer</code> goes out as a real binary frame on WebSocket) and it DOES reconnect on its own with backoff.',
            'Socket.IO cho bạn tên sự kiện phẳng cộng room, không phải cây chủ đề kiểu MQTT, và nó không có retained message lẫn QoS. Nó cũng không hứa gì về việc giao hàng — chương 6 mới dựng at-least-once bên trên bằng ack. Ngược lại nó CÓ xử lý binary nguyên bản (một <code>Buffer</code> đi ra thành khung binary thật trên WebSocket) và nó CÓ tự nối lại kèm backoff.',
          ),
        }),

        mcq({
          prompt: B(
            'A server does <code>socket.emit("bin", Buffer.from([1,2,3]), { meta: 1 })</code> to a client that is still on POLLING. One poll response comes back containing this, with <code>\\x1e</code> as the separator:' + code(
              '40{"sid":"wEnB_QhkHeOiCJ3SAAAD"}\n' +
              '451-["bin",{"_placeholder":true,"num":0},{"meta":1}]\n' +
              'bAQID',
            ) + 'What is the third piece?',
            'Máy chủ chạy <code>socket.emit("bin", Buffer.from([1,2,3]), { meta: 1 })</code> tới một client vẫn đang ở POLLING. Một lượt poll trả về nội dung sau, với <code>\\x1e</code> làm dấu ngăn:' + code(
              '40{"sid":"wEnB_QhkHeOiCJ3SAAAD"}\n' +
              '451-["bin",{"_placeholder":true,"num":0},{"meta":1}]\n' +
              'bAQID',
            ) + 'Mảnh thứ ba là gì?',
          ),
          options: [
            B('An engine.io PING with a payload, sent to keep the poll alive', 'Một PING của engine.io có payload, gửi để giữ lượt poll còn sống'),
            B('The attachment itself: <code>b</code> plus the base64 of the three bytes', 'Chính cái attachment: <code>b</code> cộng base64 của ba byte'),
            B('A checksum engine.io appends to every binary event', 'Một mã kiểm tra engine.io gắn thêm vào mọi sự kiện binary'),
            B('The acknowledgement id the client must echo back', 'Mã ack mà client phải gửi lại'),
          ],
          correct: 1,
          explanation: EX(
            'Captured byte for byte. On polling there is no binary frame, so socket.io splits the event in two: a BINARY_EVENT header <code>45</code> + the attachment count + <code>-</code> + the JSON with a <code>_placeholder</code> where the buffer was, then the attachment as a separate packet prefixed <code>b</code> and base64-encoded (<code>AQID</code> decodes to the bytes 1, 2, 3). The whole poll body is one string with <code>\\x1e</code> between packets. On WebSocket the same emit produces a text frame plus a real binary frame instead.',
            'Bắt nguyên xi từng byte. Trên polling không có khung binary, nên socket.io tách sự kiện làm hai: phần đầu BINARY_EVENT <code>45</code> + số attachment + <code>-</code> + JSON có <code>_placeholder</code> ở chỗ buffer, rồi attachment là một packet riêng mang tiền tố <code>b</code> và mã base64 (<code>AQID</code> giải ra ba byte 1, 2, 3). Cả thân lượt poll là một chuỗi với <code>\\x1e</code> ngăn giữa các packet. Trên WebSocket cùng lệnh emit đó lại sinh ra một khung text cộng một khung binary thật.',
          ),
        }),

        // ── Chương 1 — Vòng đời một connection ──────────────────────────
        mcq({
          prompt: B(
            'A server registers <code>io.use(mw)</code> and <code>io.on("connection", h)</code>. A client connects. In what order do these run, and what is guaranteed by the time <code>h</code> starts?',
            'Máy chủ đăng ký <code>io.use(mw)</code> và <code>io.on("connection", h)</code>. Một client kết nối. Chúng chạy theo thứ tự nào, và tới lúc <code>h</code> bắt đầu thì điều gì được bảo đảm?',
          ),
          options: [
            B('<code>h</code> first, then <code>mw</code> — the middleware filters events after the socket exists', '<code>h</code> trước, rồi <code>mw</code> — middleware lọc sự kiện sau khi socket đã tồn tại'),
            B('They run in parallel; you must guard against <code>socket.data</code> being empty', 'Chúng chạy song song; bạn phải tự phòng trường hợp <code>socket.data</code> còn rỗng'),
            B('<code>mw</code> first; when <code>h</code> runs, whatever <code>mw</code> put on <code>socket.data</code> is already there', '<code>mw</code> trước; khi <code>h</code> chạy thì thứ <code>mw</code> đặt vào <code>socket.data</code> đã có sẵn'),
            B('<code>mw</code> runs once at server start, not per connection', '<code>mw</code> chạy một lần lúc máy chủ khởi động, không phải mỗi connection'),
          ],
          correct: 2,
          explanation: EX(
            'Measured with logs on both: the middleware line always printed before the connection line, and <code>socket.data.userId</code> set inside the middleware was readable in the handler with no null check. If the middleware calls <code>next(err)</code> the connection handler never runs at all — the client gets <code>connect_error</code> instead, and no <code>disconnect</code> event ever fires, because that socket never connected.',
            'Đo bằng log ở cả hai chỗ: dòng của middleware luôn in trước dòng của connection, và <code>socket.data.userId</code> đặt trong middleware đọc được ngay trong handler mà không cần kiểm null. Nếu middleware gọi <code>next(err)</code> thì handler connection không bao giờ chạy — client nhận <code>connect_error</code> thay vào đó, và không có sự kiện <code>disconnect</code> nào nổ ra cả, vì socket đó chưa từng kết nối.',
          ),
        }),

        mcq({
          prompt: B(
            'A logging line inside the connection handler reads:' + code(
              "io.on('connection', (s) => {\n" +
              "  console.log('client on', s.conn.transport.name);\n" +
              "  s.conn.on('upgrade', (t) => console.log('now on', t.name));\n" +
              '});',
            ) + 'A normal browser client connects. What is printed?',
            'Một dòng log trong handler connection như sau:' + code(
              "io.on('connection', (s) => {\n" +
              "  console.log('client on', s.conn.transport.name);\n" +
              "  s.conn.on('upgrade', (t) => console.log('now on', t.name));\n" +
              '});',
            ) + 'Một client trình duyệt bình thường kết nối. In ra gì?',
          ),
          options: [
            B('<code>client on polling</code> then <code>now on websocket</code>', '<code>client on polling</code> rồi <code>now on websocket</code>'),
            B('<code>client on websocket</code> and nothing else', '<code>client on websocket</code> và không gì nữa'),
            B('<code>now on websocket</code> then <code>client on websocket</code>', '<code>now on websocket</code> rồi <code>client on websocket</code>'),
            B('<code>client on polling</code> only — the upgrade event fires on <code>io</code>, not on <code>socket.conn</code>', 'Chỉ <code>client on polling</code> — sự kiện upgrade nổ ở <code>io</code>, không phải ở <code>socket.conn</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Measured: the connection handler runs the moment the CONNECT packet arrives, and with the default client that is still on polling, so a log line that says "WebSocket client connected" is wrong for every single connection at that instant. The upgrade lands afterwards and <code>socket.conn</code> emits <code>upgrade</code>. Read the transport in the <code>upgrade</code> handler, or later, if you actually want to know.',
            'Đo thật: handler connection chạy ngay khi packet CONNECT tới, mà với client mặc định lúc đó vẫn đang ở polling, nên một dòng log ghi "WebSocket client connected" là sai với mọi connection tại đúng khoảnh khắc ấy. Cú upgrade tới sau và <code>socket.conn</code> phát sự kiện <code>upgrade</code>. Muốn biết thật thì đọc transport trong handler <code>upgrade</code>, hoặc đọc muộn hơn.',
          ),
        }),

        mcq({
          prompt: B(
            'The client calls <code>socket.disconnect()</code>. Two logs are captured, one on each side. Which pair is correct?',
            'Client gọi <code>socket.disconnect()</code>. Hai dòng log được ghi lại, mỗi phía một dòng. Cặp nào ĐÚNG?',
          ),
          options: [
            B('server <code>"transport close"</code> · client <code>"forced close"</code>', 'server <code>"transport close"</code> · client <code>"forced close"</code>'),
            B('server <code>"client namespace disconnect"</code> · client <code>"io client disconnect"</code>', 'server <code>"client namespace disconnect"</code> · client <code>"io client disconnect"</code>'),
            B('server <code>"io client disconnect"</code> · client <code>"client namespace disconnect"</code>', 'server <code>"io client disconnect"</code> · client <code>"client namespace disconnect"</code>'),
            B('Both sides report <code>"client namespace disconnect"</code>', 'Cả hai phía đều báo <code>"client namespace disconnect"</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Measured. The two sides never use the same vocabulary: the server names the NAMESPACE event it saw, the client names WHO decided. The rule that matters operationally is what <code>client.active</code> became — <code>false</code> here, so the client will not reconnect on its own and your server may clean up presence immediately instead of debouncing.',
            'Đo thật. Hai phía không bao giờ dùng chung một bộ từ: máy chủ gọi tên sự kiện NAMESPACE mà nó thấy, client gọi tên AI đã quyết định. Điều thực sự đáng quan tâm khi vận hành là <code>client.active</code> thành gì — ở đây là <code>false</code>, nên client sẽ không tự nối lại và máy chủ có thể dọn presence ngay thay vì debounce.',
          ),
        }),

        mcq({
          prompt: B(
            'What is the difference between <code>socket.disconnect(true)</code> and <code>socket.disconnect(false)</code> on the server?',
            'Khác nhau giữa <code>socket.disconnect(true)</code> và <code>socket.disconnect(false)</code> ở phía máy chủ là gì?',
          ),
          options: [
            B('<code>true</code> gives the client <code>"io server disconnect"</code>; <code>false</code> gives it <code>"transport close"</code>, so it reconnects', '<code>true</code> cho client <code>"io server disconnect"</code>; <code>false</code> cho <code>"transport close"</code> nên nó nối lại'),
            B('<code>false</code> is a soft disconnect: the client keeps the namespace and only the transport is recycled', '<code>false</code> là ngắt mềm: client giữ nguyên namespace, chỉ transport được tái tạo'),
            B('The reason strings are identical; the flag only decides whether the underlying connection is closed too', 'Chuỗi reason giống hệt nhau; tham số chỉ quyết định có đóng luôn kết nối tầng dưới hay không'),
            B('There is no difference at all — the parameter was removed in v4 and is ignored', 'Không khác gì cả — tham số đã bị bỏ ở v4 và bị phớt lờ'),
          ],
          correct: 2,
          explanation: EX(
            'Measured side by side: both produce <code>"server namespace disconnect"</code> on the server and <code>"io server disconnect"</code> on the client, and in both cases <code>client.active</code> becomes <code>false</code> so the client stays down until your code calls <code>connect()</code>. The flag decides whether the engine.io connection underneath is torn down as well — which matters when the same connection also carries another namespace.',
            'Đo song song: cả hai đều cho <code>"server namespace disconnect"</code> ở máy chủ và <code>"io server disconnect"</code> ở client, và trong cả hai trường hợp <code>client.active</code> thành <code>false</code> nên client nằm im cho tới khi mã của bạn gọi <code>connect()</code>. Tham số quyết định có phá luôn kết nối engine.io bên dưới hay không — điều này có ý nghĩa khi cùng kết nối đó còn đang chở một namespace khác.',
          ),
        }),

        mcq({
          prompt: B(
            'A server is started with <code>{ pingInterval: 300, pingTimeout: 300 }</code>. A raw WebSocket client connects and then deliberately never answers a ping. Measured from connect, the server logged <code>disconnect "ping timeout"</code> after roughly 600 ms. Which formula explains it?',
            'Một máy chủ khởi động với <code>{ pingInterval: 300, pingTimeout: 300 }</code>. Một client WebSocket thô kết nối rồi cố ý không bao giờ trả lời ping. Tính từ lúc kết nối, máy chủ ghi <code>disconnect "ping timeout"</code> sau khoảng 600 ms. Công thức nào giải thích điều đó?',
          ),
          options: [
            B('<code>pingInterval &times; pingTimeout / 1000</code>', '<code>pingInterval &times; pingTimeout / 1000</code>'),
            B('<code>pingTimeout &times; 2</code> — two missed pongs are required before closing', '<code>pingTimeout &times; 2</code> — phải trượt hai lần pong mới đóng'),
            B('<code>maxPayload / pingInterval</code>, capped at one second', '<code>maxPayload / pingInterval</code>, chặn trên ở một giây'),
            B('<code>pingInterval + pingTimeout</code> — wait for the next ping slot, then wait for the pong', '<code>pingInterval + pingTimeout</code> — chờ tới lượt ping kế, rồi chờ pong'),
          ],
          correct: 3,
          explanation: EX(
            'The capture shows the shape exactly: the ping frame <code>2</code> went out at about one interval after connect, and the close came about one timeout after that. So the worst case for noticing a client that vanished without a TCP FIN is the sum of the two numbers, and both of them are printed in the handshake frame — which means you can read a production server\'s real detection window with one <code>curl</code>. Do not memorise the milliseconds measured here; memorise the sum.',
            'Bản bắt gói cho thấy đúng hình dạng: khung ping <code>2</code> đi ra sau chừng một interval kể từ lúc kết nối, và cú đóng đến sau đó chừng một timeout. Nên trường hợp xấu nhất để nhận ra một client biến mất mà không có FIN của TCP là tổng hai con số, và cả hai đều in sẵn trong frame bắt tay — nghĩa là bạn đọc được cửa sổ phát hiện thật của máy chủ production bằng một lệnh <code>curl</code>. Đừng học thuộc số mili giây đo ở đây; hãy nhớ phép cộng.',
          ),
        }),

        mcq({
          prompt: B(
            'A graceful shutdown calls <code>io.close()</code>. What do the two sides see, and does the client come back on its own?',
            'Một cú tắt máy êm gọi <code>io.close()</code>. Hai phía thấy gì, và client có tự quay lại không?',
          ),
          options: [
            B('server <code>"server shutting down"</code> · client <code>"io server disconnect"</code> · it does NOT come back', 'server <code>"server shutting down"</code> · client <code>"io server disconnect"</code> · nó KHÔNG quay lại'),
            B('server <code>"forced close"</code> · client <code>"forced close"</code> · it does NOT come back', 'server <code>"forced close"</code> · client <code>"forced close"</code> · nó KHÔNG quay lại'),
            B('Both sides see <code>"ping timeout"</code> after the heartbeat expires · it comes back', 'Cả hai phía thấy <code>"ping timeout"</code> sau khi nhịp tim hết hạn · nó quay lại'),
            B('server <code>"server shutting down"</code> · client <code>"transport close"</code> · it DOES come back', 'server <code>"server shutting down"</code> · client <code>"transport close"</code> · nó CÓ quay lại'),
          ],
          correct: 3,
          explanation: EX(
            'Measured, and it contradicts what chapter 5 says: <code>io.close()</code> tears the transport down, so the client reports <code>"transport close"</code> like any network drop and <code>client.active</code> stays <code>true</code>, meaning it will retry with backoff. That is usually what you WANT during a rolling restart. If you genuinely need the client to stay down you have to call <code>socket.disconnect()</code> on each socket first, which is what actually produces <code>"io server disconnect"</code>.',
            'Đo thật, và nó trái với điều chương 5 nói: <code>io.close()</code> phá transport, nên client báo <code>"transport close"</code> y như mọi lần rớt mạng và <code>client.active</code> vẫn là <code>true</code>, nghĩa là nó sẽ thử lại kèm backoff. Đó thường là thứ bạn MUỐN trong một lượt khởi động lại cuốn chiếu. Nếu thật sự cần client nằm im thì phải gọi <code>socket.disconnect()</code> trên từng socket trước, đó mới là thứ sinh ra <code>"io server disconnect"</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A client connects to <code>http://api/khongcothat</code>, a namespace the server never declared. What happens?',
            'Một client kết nối tới <code>http://api/khongcothat</code>, một namespace máy chủ chưa hề khai báo. Chuyện gì xảy ra?',
          ),
          options: [
            B('<code>connect_error</code> with message <code>"Invalid namespace"</code>, and the client does not retry', '<code>connect_error</code> với thông điệp <code>"Invalid namespace"</code>, và client không thử lại'),
            B('The server silently creates the namespace on demand and the client connects', 'Máy chủ âm thầm tạo namespace theo yêu cầu và client kết nối được'),
            B('HTTP 404 on the handshake, so the socket never opens at all', 'HTTP 404 ngay ở cú bắt tay, nên socket không hề mở ra'),
            B('The client is quietly routed to <code>/</code> instead', 'Client bị lặng lẽ chuyển sang <code>/</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Measured: the engine.io handshake succeeds normally — the transport does not care about namespaces — and the refusal arrives one layer up as a CONNECT_ERROR whose message is <code>"Invalid namespace"</code>, with <code>client.active === false</code>. That last part is the operational bite: a typo in the namespace looks exactly like an auth failure from the outside, and neither one reconnects, so the tab just sits there dead.',
            'Đo thật: cú bắt tay engine.io vẫn thành công bình thường — transport không quan tâm tới namespace — và lời từ chối tới ở tầng trên dưới dạng CONNECT_ERROR với thông điệp <code>"Invalid namespace"</code>, kèm <code>client.active === false</code>. Vế cuối mới là chỗ đau khi vận hành: gõ nhầm tên namespace nhìn từ bên ngoài giống hệt hỏng xác thực, và cả hai đều không nối lại, nên cái tab cứ nằm chết ở đó.',
          ),
        }),

        mcq({
          prompt: B(
            'A gateway keeps <code>const draftBySid = new Map()</code> and writes into it in the connection handler. A user rides a lift, drops with <code>transport close</code> and reconnects five seconds later. Choose TWO true statements.',
            'Một gateway giữ <code>const draftBySid = new Map()</code> và ghi vào đó trong handler connection. Một người dùng đi thang máy, rớt với <code>transport close</code> rồi nối lại năm giây sau. Chọn HAI phát biểu ĐÚNG.',
          ),
          options: [
            B('The new socket has a different <code>socket.id</code>, so the old entry can never be found again', 'Socket mới có <code>socket.id</code> khác, nên mục cũ không bao giờ tìm lại được'),
            B('The old entry stays in the Map forever unless the disconnect handler deletes it', 'Mục cũ nằm lại trong Map mãi mãi trừ khi handler disconnect xoá nó'),
            B('Socket.IO restores <code>socket.id</code> on reconnect so the Map keeps working', 'Socket.IO khôi phục <code>socket.id</code> khi nối lại nên Map vẫn chạy đúng'),
            B('The rooms the old socket had joined are re-joined automatically by the adapter', 'Các room socket cũ đã join được adapter tự động join lại'),
          ],
          correct: [0, 1],
          explanation: EX(
            'Measured: after a drop and reconnect the id changed, the new socket was in no room except its own private one, and <code>socket.data</code> was empty. Anything keyed by <code>socket.id</code> therefore leaks AND misses at the same time — the lookup silently returns <code>undefined</code> while the old entry stays resident. Key by <code>userId</code>, and rebuild room membership in the connection handler.',
            'Đo thật: sau một lần rớt rồi nối lại thì id đã đổi, socket mới không thuộc room nào ngoài room riêng của chính nó, và <code>socket.data</code> rỗng. Bất cứ thứ gì khoá theo <code>socket.id</code> vì thế vừa rò rỉ vừa tra trượt cùng lúc — phép tra âm thầm trả về <code>undefined</code> trong khi mục cũ vẫn nằm lại. Hãy khoá theo <code>userId</code>, và dựng lại danh sách room trong handler connection.',
          ),
        }),

        // ── Chương 2 — Transport và cú upgrade ──────────────────────────
        mcq({
          prompt: B(
            'Two clients are configured differently and the transport is read the moment the engine opens:' + code(
              "io(url, { transports: ['websocket', 'polling'] })   // client 1\n" +
              "io(url, { transports: ['polling', 'websocket'] })   // client 2",
            ) + 'Measured, what is each one on at that moment?',
            'Hai client cấu hình khác nhau và transport được đọc ngay khoảnh khắc engine mở:' + code(
              "io(url, { transports: ['websocket', 'polling'] })   // client 1\n" +
              "io(url, { transports: ['polling', 'websocket'] })   // client 2",
            ) + 'Đo thật, mỗi cái đang ở transport nào tại khoảnh khắc đó?',
          ),
          options: [
            B('Both start on polling — the client always starts there and the array is only a permission list', 'Cả hai bắt đầu ở polling — client luôn bắt đầu ở đó và mảng chỉ là danh sách được phép'),
            B('Client 1 starts on websocket, client 2 starts on polling — the array IS the order', 'Client 1 bắt đầu ở websocket, client 2 bắt đầu ở polling — mảng CHÍNH LÀ thứ tự'),
            B('Both start on websocket — polling is only used if the first attempt fails', 'Cả hai bắt đầu ở websocket — polling chỉ dùng khi lần đầu thất bại'),
            B('Client 1 fails to connect: websocket cannot be the first transport', 'Client 1 không kết nối được: websocket không thể là transport đầu tiên'),
          ],
          correct: 1,
          explanation: EX(
            'Measured on the same server: reading <code>engine.transport.name</code> at the <code>open</code> event gave <code>websocket</code> for the first client and <code>polling</code> for the second, and both ended on websocket a moment later. The course statement "the array is only a permission list, the client always begins on polling" is true only of the SERVER-side option of the same name. On the client, order is order — which also means <code>["websocket"]</code> alone skips the upgrade dance entirely and simply fails behind a proxy that strips <code>Upgrade</code>.',
            'Đo trên cùng một máy chủ: đọc <code>engine.transport.name</code> tại sự kiện <code>open</code> cho ra <code>websocket</code> ở client thứ nhất và <code>polling</code> ở client thứ hai, rồi cả hai đều kết thúc ở websocket một lát sau. Câu của bài học "mảng chỉ là danh sách được phép, client luôn bắt đầu bằng polling" chỉ đúng với tuỳ chọn cùng tên ở PHÍA SERVER. Ở phía client thì thứ tự là thứ tự — nghĩa là ghi mỗi <code>["websocket"]</code> sẽ bỏ hẳn màn upgrade và đơn giản là hỏng khi đứng sau một proxy cắt <code>Upgrade</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A raw capture of the upgrade from polling to WebSocket shows exactly these four frames in order. Fill in the last one.' + code(
              'client -> "2probe"\n' +
              'server -> "3probe"\n' +
              'client -> ???\n' +
              '(from here on everything travels over the WebSocket)',
            ),
            'Bản bắt gói thô của cú upgrade từ polling lên WebSocket cho thấy đúng bốn frame theo thứ tự. Hãy điền cái cuối.' + code(
              'client -> "2probe"\n' +
              'server -> "3probe"\n' +
              'client -> ???\n' +
              '(từ đây trở đi mọi thứ đi qua WebSocket)',
            ),
          ),
          options: [
            B('<code>"6"</code> — NOOP, telling the pending poll to return empty', '<code>"6"</code> — NOOP, bảo lượt poll đang treo trả về rỗng'),
            B('<code>"1"</code> — CLOSE, shutting the polling transport down', '<code>"1"</code> — CLOSE, tắt transport polling đi'),
            B('<code>"40"</code> — the CONNECT packet, re-sent on the new transport', '<code>"40"</code> — packet CONNECT, gửi lại trên transport mới'),
            B('<code>"5"</code> — UPGRADE, the client committing to the new transport', '<code>"5"</code> — UPGRADE, client chốt chuyển sang transport mới'),
          ],
          correct: 3,
          explanation: EX(
            'Captured by hand-driving the protocol: after the handshake on polling, opening a WebSocket to the same <code>sid</code> and sending <code>2probe</code> gets <code>3probe</code> back, and the client then sends <code>5</code> (UPGRADE). Only after that does the server switch the socket over and the <code>upgrade</code> event fire. Note that <code>6</code> (NOOP) is real, but it is what the server sends to release the pending long-poll — it is not the client\'s commit.',
            'Bắt được bằng cách tự tay điều khiển giao thức: sau cú bắt tay trên polling, mở một WebSocket tới đúng <code>sid</code> đó và gửi <code>2probe</code> thì nhận về <code>3probe</code>, rồi client gửi <code>5</code> (UPGRADE). Chỉ sau đó máy chủ mới chuyển socket sang và sự kiện <code>upgrade</code> mới nổ. Lưu ý <code>6</code> (NOOP) là có thật, nhưng đó là thứ máy chủ gửi để giải phóng lượt long-poll đang treo — không phải cú chốt của client.',
          ),
        }),

        mcq({
          prompt: B(
            'In Engine.IO v4, which side sends the PING and which side answers?',
            'Trong Engine.IO v4, phía nào gửi PING và phía nào trả lời?',
          ),
          options: [
            B('The client pings every <code>pingInterval</code>; the server pongs — that is why the client can detect a dead server', 'Client ping mỗi <code>pingInterval</code>; server pong — nhờ vậy client phát hiện được server chết'),
            B('Neither — the TCP keepalive does the job and engine.io has no heartbeat', 'Không phía nào — TCP keepalive lo việc đó và engine.io không có nhịp tim'),
            B('Both sides ping each other independently on the same timer', 'Cả hai phía cùng ping lẫn nhau, độc lập trên cùng một bộ đếm'),
            B('The server pings every <code>pingInterval</code>; the client pongs', 'Server ping mỗi <code>pingInterval</code>; client pong'),
          ],
          correct: 3,
          explanation: EX(
            'Measured on the packet stream: the client engine logged <code>IN ping</code> followed by <code>OUT pong</code>, three times in a row, and a hand-built WebSocket client received the single character <code>2</code> and answered <code>3</code>. This flipped in v4 — in Engine.IO v3 the client was the one pinging — which is why an old blog post about heartbeats will describe the opposite direction and why your own client-side "is the server alive" timer is redundant.',
            'Đo trên dòng packet: engine phía client ghi <code>IN ping</code> rồi <code>OUT pong</code>, ba lần liên tiếp, và một client WebSocket tự dựng nhận ký tự <code>2</code> rồi trả <code>3</code>. Chiều này đã lật ở v4 — ở Engine.IO v3 client mới là bên ping — nên một bài blog cũ về nhịp tim sẽ mô tả chiều ngược lại, và bộ đếm "máy chủ còn sống không" bạn tự viết ở phía client là thừa.',
          ),
        }),

        mcq({
          prompt: B(
            'Four workers sit behind a load balancer with no stickiness. A polling client handshakes on worker 0 and its next poll lands on worker 1. What comes back?',
            'Bốn worker đứng sau một bộ cân bằng tải không có sticky. Một client polling bắt tay ở worker 0 và lượt poll kế của nó rơi vào worker 1. Nó nhận được gì?',
          ),
          options: [
            B('<code>200</code> with an empty body — worker 1 waits for worker 0 to hand the session over', '<code>200</code> với thân rỗng — worker 1 chờ worker 0 bàn giao phiên'),
            B('<code>503 Service Unavailable</code>, and the balancer retries on another worker', '<code>503 Service Unavailable</code>, và bộ cân bằng thử lại ở worker khác'),
            B('<code>400</code> with body <code>{"code":1,"message":"Session ID unknown"}</code>', '<code>400</code> với thân <code>{"code":1,"message":"Session ID unknown"}</code>'),
            B('<code>200</code> with a fresh handshake frame, so the client silently gets a new session', '<code>200</code> kèm một frame bắt tay mới, nên client âm thầm nhận một phiên mới'),
          ],
          correct: 2,
          explanation: EX(
            'Measured directly by asking a live server for a sid it never issued. The session lives in the RAM of one worker, so the answer is a hard 400 with a machine-readable code, not a redirect and not a silent re-handshake. The Redis adapter does not help here at all: it shares BROADCASTS between workers, not engine.io sessions. The fix is stickiness at the proxy.',
            'Đo trực tiếp bằng cách hỏi một máy chủ đang sống về một sid mà nó chưa từng cấp. Phiên nằm trong RAM của một worker, nên câu trả lời là một cú 400 dứt khoát kèm mã máy đọc được, không phải chuyển hướng và cũng không phải âm thầm bắt tay lại. Redis adapter không giúp gì ở đây: nó chia sẻ BROADCAST giữa các worker, không chia sẻ phiên engine.io. Cách sửa là bật sticky ở proxy.',
          ),
        }),

        mcq({
          prompt: B(
            'Three probes are fired at a live server. Match them to the answers.' + code(
              'A  GET /socket.io/?EIO=3&transport=polling                (no sid)\n' +
              'B  GET /socket.io/?EIO=3&transport=polling&sid=<a valid sid>\n' +
              'C  GET /socket.io/?EIO=4&transport=bogus&sid=ZZZ',
            ),
            'Ba phép thử được bắn vào một máy chủ đang chạy. Hãy ghép chúng với câu trả lời.' + code(
              'A  GET /socket.io/?EIO=3&transport=polling                (không có sid)\n' +
              'B  GET /socket.io/?EIO=3&transport=polling&sid=<một sid hợp lệ>\n' +
              'C  GET /socket.io/?EIO=4&transport=bogus&sid=ZZZ',
            ),
          ),
          options: [
            B('A → 400 code 5 · B → <b>200</b> · C → 400 code 0', 'A → 400 code 5 · B → <b>200</b> · C → 400 code 0'),
            B('A → 400 code 5 · B → 400 code 5 · C → 400 code 1', 'A → 400 code 5 · B → 400 code 5 · C → 400 code 1'),
            B('A → 200 · B → 400 code 1 · C → 400 code 5', 'A → 200 · B → 400 code 1 · C → 400 code 5'),
            B('All three answer 400 with code 5, because the version check runs first', 'Cả ba trả 400 với code 5, vì phép kiểm phiên bản chạy trước'),
          ],
          correct: 0,
          explanation: EX(
            'Measured one by one, and the surprise is B. The protocol version is only checked when there is NO sid, i.e. on the very first handshake — once a session exists, <code>EIO=3</code> on a valid sid answers 200 as if nothing were wrong. An unknown transport is rejected before anything else with code 0 <code>"Transport unknown"</code>, and an unknown sid gives code 1 <code>"Session ID unknown"</code>. Question 32 asks you to implement exactly this precedence.',
            'Đo từng cái một, và bất ngờ nằm ở B. Phiên bản giao thức chỉ được kiểm khi KHÔNG có sid, tức là ở đúng cú bắt tay đầu tiên — một khi phiên đã tồn tại thì <code>EIO=3</code> trên một sid hợp lệ trả 200 như thể chẳng có gì sai. Transport lạ bị từ chối trước mọi thứ khác với code 0 <code>"Transport unknown"</code>, còn sid lạ cho code 1 <code>"Session ID unknown"</code>. Câu 32 yêu cầu bạn cài đặt đúng thứ tự ưu tiên này.',
          ),
        }),

        mcq({
          prompt: B(
            'You changed <code>pingTimeout</code> in the code and deployed. Which single shell command proves the running production server picked the change up?',
            'Bạn đã đổi <code>pingTimeout</code> trong mã và deploy. Lệnh shell nào chứng minh máy chủ production đang chạy đã nhận thay đổi đó?',
          ),
          options: [
            B('<code>docker logs backend | grep pingTimeout</code>', '<code>docker logs backend | grep pingTimeout</code>'),
            B('<code>curl -I https://api/socket.io/</code> and read the response headers', '<code>curl -I https://api/socket.io/</code> rồi đọc header phản hồi'),
            B('<code>curl -s "https://api/socket.io/?EIO=4&amp;transport=polling"</code> and read the handshake JSON', '<code>curl -s "https://api/socket.io/?EIO=4&amp;transport=polling"</code> rồi đọc JSON bắt tay'),
            B('You cannot: the ping settings are private to engine.io and never leave the server', 'Không thể: cấu hình ping là riêng của engine.io và không bao giờ rời khỏi máy chủ'),
          ],
          correct: 2,
          explanation: EX(
            'The handshake frame is the server telling you its own configuration, and it needs no auth and no browser. A real response looks like <code>0{"sid":…,"upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}</code>. If the numbers are the defaults while your code says otherwise, the image running in production is not the image you built — check the tag before you touch the code.',
            'Frame bắt tay chính là máy chủ tự khai cấu hình của nó, và nó không cần xác thực lẫn trình duyệt. Một phản hồi thật trông như <code>0{"sid":…,"upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}</code>. Nếu các con số vẫn là mặc định trong khi mã của bạn nói khác, thì ảnh đang chạy trên production không phải ảnh bạn vừa dựng — hãy kiểm tra tag trước khi sửa mã.',
          ),
        }),

        mcq({
          prompt: B(
            'A team fixes their cluster with <code>upstream backend { hash $cookie_io; ... }</code> in nginx and nothing changes. Why?',
            'Một nhóm sửa cụm của họ bằng <code>upstream backend { hash $cookie_io; ... }</code> trong nginx và không có gì thay đổi. Vì sao?',
          ),
          options: [
            B('<code>hash</code> only works on <code>$remote_addr</code>; cookies need the commercial <code>sticky</code> directive', '<code>hash</code> chỉ chạy với <code>$remote_addr</code>; cookie cần chỉ thị <code>sticky</code> bản thương mại'),
            B('The <code>io</code> cookie is off by default in v4, so the variable is empty and every request hashes the same', 'Cookie <code>io</code> mặc định TẮT ở v4, nên biến đó rỗng và mọi request băm ra cùng một giá trị'),
            B('nginx cannot read cookies on a WebSocket upgrade request', 'nginx không đọc được cookie trên một request nâng cấp WebSocket'),
            B('The cookie is set by the client library, so it only exists after the first successful poll', 'Cookie do thư viện client đặt, nên nó chỉ tồn tại sau lượt poll thành công đầu tiên'),
          ],
          correct: 1,
          explanation: EX(
            'The <code>io</code> cookie is issued by the engine.io SERVER, and since v3 the <code>cookie</code> option defaults to <code>false</code> — no cookie is sent at all. So <code>$cookie_io</code> is the empty string, the hash is constant, and every client piles onto one upstream, which looks like "sticky is working" right up until that worker is the only one with any load. Either turn the cookie back on server-side or hash on something that actually exists.',
            'Cookie <code>io</code> do SERVER engine.io phát, và từ v3 thì tuỳ chọn <code>cookie</code> mặc định là <code>false</code> — không có cookie nào được gửi cả. Nên <code>$cookie_io</code> là chuỗi rỗng, giá trị băm là hằng số, và mọi client dồn hết vào một upstream, nhìn thì giống "sticky đang chạy" cho tới khi phát hiện đúng worker đó gánh toàn bộ tải. Hoặc bật lại cookie ở phía server, hoặc băm theo một thứ thực sự tồn tại.',
          ),
        }),

        mcq({
          prompt: B(
            'Which statement about the Redis adapter and sticky sessions is correct?',
            'Phát biểu nào về Redis adapter và sticky session là ĐÚNG?',
          ),
          options: [
            B('Sticky sessions make the Redis adapter unnecessary, because every client stays on one worker', 'Sticky session làm Redis adapter thành thừa, vì mọi client đều ở lại một worker'),
            B('Neither is needed if you set <code>transports: ["websocket"]</code> on the server', 'Không cần cái nào nếu bạn đặt <code>transports: ["websocket"]</code> ở phía server'),
            B('The Redis adapter replaces sticky sessions by sharing engine.io session state across workers', 'Redis adapter thay được sticky session bằng cách chia sẻ trạng thái phiên engine.io giữa các worker'),
            B('They solve different problems and a polling cluster needs both', 'Chúng giải hai vấn đề khác nhau và một cụm có polling cần cả hai'),
          ],
          correct: 3,
          explanation: EX(
            'The adapter carries BROADCASTS between workers so a message emitted on worker 0 reaches a socket living on worker 3. Stickiness makes the several HTTP requests of one polling session land on the same worker, because the engine.io session is plain RAM there. Turning polling off on the server does not save you either: the browser client still opens with polling unless the client is also configured otherwise, and then you have simply broken everyone behind a proxy that strips <code>Upgrade</code>.',
            'Adapter chở BROADCAST giữa các worker để một thông điệp phát ở worker 0 tới được một socket đang sống ở worker 3. Sticky làm cho nhiều request HTTP của cùng một phiên polling rơi vào cùng một worker, vì phiên engine.io chỉ là RAM ở đó. Tắt polling ở phía server cũng không cứu được: client trình duyệt vẫn mở bằng polling trừ khi client cũng được cấu hình khác đi, và khi đó bạn chỉ vừa làm hỏng mọi người đứng sau proxy cắt <code>Upgrade</code>.',
          ),
        }),

        // ── Chương 3 — Room và namespace ────────────────────────────────
        mcq({
          prompt: B(
            'Three sockets: A is in <code>r1</code> only, B is in <code>r1</code> and <code>r2</code>, C is in <code>r2</code> only. Compare these two lines:' + code(
              "io.to('r1').to('r2').emit('m');\n" +
              "io.to(['r1', 'r2']).emit('m');",
            ) + 'Measured, how do they differ?',
            'Ba socket: A chỉ ở <code>r1</code>, B ở cả <code>r1</code> và <code>r2</code>, C chỉ ở <code>r2</code>. So sánh hai dòng sau:' + code(
              "io.to('r1').to('r2').emit('m');\n" +
              "io.to(['r1', 'r2']).emit('m');",
            ) + 'Đo thật, chúng khác nhau chỗ nào?',
          ),
          options: [
            B('The chained form is an intersection (B only); the array form is a union (A, B, C)', 'Dạng nối chuỗi là giao (chỉ B); dạng mảng là hợp (A, B, C)'),
            B('They do not differ: both are a union and reach A, B and C, and B gets exactly one packet', 'Chúng không khác nhau: cả hai đều là hợp, tới A, B và C, và B nhận đúng một gói'),
            B('They do not differ: both are an intersection and reach only B', 'Chúng không khác nhau: cả hai đều là giao và chỉ tới B'),
            B('The chained form reaches A, B and C but delivers TWO packets to B', 'Dạng nối chuỗi tới A, B và C nhưng giao HAI gói cho B'),
          ],
          correct: 1,
          explanation: EX(
            'Measured with three real clients counting what arrived: both lines reached A, B and C, and B received exactly one copy — chaining <code>.to()</code> ADDS a room to the target set and the adapter deduplicates by socket id. This contradicts the course, which calls the chained form an intersection in chapter 3.1 and repeats it in the chapter 11 summary. If you actually want "in r1 AND in r2", express it as <code>io.to("r1").except(…)</code> over a set you computed yourself, or check <code>socket.rooms</code> in the handler.',
            'Đo bằng ba client thật cùng đếm thứ đã tới: cả hai dòng đều tới A, B và C, và B nhận đúng một bản — nối thêm <code>.to()</code> là THÊM một room vào tập đích và adapter khử trùng theo id socket. Điều này trái với giáo trình, vốn gọi dạng nối chuỗi là phép giao ở bài 3.1 và nhắc lại trong phần tổng kết chương 11. Nếu bạn thật sự muốn "ở r1 VÀ ở r2" thì hãy diễn đạt bằng <code>io.to("r1").except(…)</code> trên một tập bạn tự tính, hoặc kiểm <code>socket.rooms</code> ngay trong handler.',
          ),
        }),

        mcq({
          prompt: B(
            'Inside A\'s own handler the server runs <code>socket.to(socket.id).emit("m")</code>. Who receives it?',
            'Ngay trong handler của chính A, máy chủ chạy <code>socket.to(socket.id).emit("m")</code>. Ai nhận được?',
          ),
          options: [
            B('A, because every socket is automatically in a private room named after its own id', 'A, vì mọi socket đều tự động ở trong một room riêng mang tên id của chính nó'),
            B('Every socket except A — the id room is treated as a wildcard', 'Mọi socket trừ A — room mang id được coi như ký tự đại diện'),
            B('Nobody', 'Không ai cả'),
            B('It throws: you may not target your own id from <code>socket.to()</code>', 'Nó ném lỗi: không được nhắm vào id của chính mình từ <code>socket.to()</code>'),
          ],
          correct: 2,
          explanation: EX(
            'Measured, and it catches people out. The private room really exists — <code>io.to(A.id).emit("m")</code> did reach A — but <code>socket.to(...)</code> means "this set of rooms, MINUS me", and the exclusion is applied last. So the only member of the target set is removed and the packet goes nowhere, with no error and no log line. To answer the sender, use <code>socket.emit()</code>.',
            'Đo thật, và nó làm nhiều người sập bẫy. Room riêng có tồn tại thật — <code>io.to(A.id).emit("m")</code> có tới được A — nhưng <code>socket.to(...)</code> nghĩa là "tập room này, TRỪ tôi ra", và phép loại trừ được áp cuối cùng. Nên thành viên duy nhất của tập đích bị gỡ đi và gói tin không đi đâu cả, không lỗi, không một dòng log. Muốn trả lời chính người gửi thì dùng <code>socket.emit()</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Four sockets: A in <code>r1</code>, B in <code>r1</code> and <code>r2</code>, C in <code>r2</code>, and D in NO room at all. The server runs <code>io.except("r2").emit("m")</code>. Who receives it?',
            'Bốn socket: A ở <code>r1</code>, B ở <code>r1</code> và <code>r2</code>, C ở <code>r2</code>, và D KHÔNG ở room nào. Máy chủ chạy <code>io.except("r2").emit("m")</code>. Ai nhận được?',
          ),
          options: [
            B('A only — <code>except</code> without a <code>to</code> narrows the target set to the named rooms', 'Chỉ A — <code>except</code> mà không có <code>to</code> thu hẹp tập đích về đúng các room được nêu'),
            B('Nobody — <code>except</code> requires a preceding <code>to()</code> and is a no-op otherwise', 'Không ai — <code>except</code> đòi phải có <code>to()</code> đứng trước, không thì nó vô tác dụng'),
            B('A and D', 'A và D'),
            B('A, C and D — only B is skipped because it is the one in two rooms', 'A, C và D — chỉ B bị bỏ qua vì nó là kẻ ở hai room'),
          ],
          correct: 2,
          explanation: EX(
            'Measured. With no <code>to()</code> the starting set is EVERY socket, including D who has joined nothing, and <code>except</code> then subtracts the members of <code>r2</code>, which removes B and C. This is the shape you want for "announce to everyone except the muted", and it is also the shape that surprises people who assume a socket in no room is somehow not addressable.',
            'Đo thật. Không có <code>to()</code> thì tập xuất phát là MỌI socket, kể cả D vốn chưa join gì, rồi <code>except</code> trừ đi các thành viên của <code>r2</code>, tức gỡ B và C. Đây đúng là hình dạng bạn muốn cho "thông báo cho tất cả trừ những người đã tắt tiếng", và cũng là hình dạng làm bất ngờ những ai tưởng một socket không ở room nào thì không thể nhắm tới được.',
          ),
        }),

        mcq({
          prompt: B(
            'A socket connects and joins two rooms. What is <code>socket.rooms</code>, and what is the safe way to ask "has this socket joined anything of mine?"',
            'Một socket kết nối rồi join hai room. <code>socket.rooms</code> là gì, và cách an toàn để hỏi "socket này đã join thứ gì của tôi chưa?" là gì?',
          ),
          options: [
            B('It is a Set of size 2; test <code>socket.rooms.size === 0</code> to detect "no rooms"', 'Nó là một Set kích thước 2; kiểm <code>socket.rooms.size === 0</code> để phát hiện "không room nào"'),
            B('It is a Set of size 3 — the two rooms plus a private one named after <code>socket.id</code>', 'Nó là một Set kích thước 3 — hai room cộng một room riêng mang tên <code>socket.id</code>'),
            B('It is an Array of size 2 and the private id room lives in <code>socket.conn.rooms</code>', 'Nó là một Array kích thước 2 và room riêng mang id nằm ở <code>socket.conn.rooms</code>'),
            B('It is a Set that is empty until the first broadcast actually targets one of the rooms', 'Nó là một Set rỗng cho tới khi có broadcast đầu tiên thật sự nhắm vào một trong các room'),
          ],
          correct: 1,
          explanation: EX(
            'Measured on a socket that had joined two rooms: <code>[...socket.rooms]</code> came back as the socket\'s own id followed by the two names, and <code>io.of("/").adapter.rooms</code> likewise listed one key per socket id alongside the real rooms. So <code>size</code> is never 0 for a connected socket — the correct test is <code>socket.rooms.size > 1</code>, or better, check for the specific room name you care about.',
            'Đo trên một socket đã join hai room: <code>[...socket.rooms]</code> trả về id của chính socket rồi tới hai cái tên, và <code>io.of("/").adapter.rooms</code> cũng liệt kê một khoá cho mỗi id socket bên cạnh các room thật. Nên <code>size</code> không bao giờ bằng 0 với một socket đang kết nối — phép kiểm đúng là <code>socket.rooms.size > 1</code>, hoặc tốt hơn nữa là kiểm đúng tên room mà bạn quan tâm.',
          ),
        }),

        mcq({
          prompt: B(
            'A server writes an auth guard with <code>io.use(...)</code> and then serves a second namespace with <code>io.of("/chat")</code>. A client connects to <code>/chat</code> with no token at all. What happens?',
            'Một máy chủ viết chốt xác thực bằng <code>io.use(...)</code> rồi phục vụ namespace thứ hai bằng <code>io.of("/chat")</code>. Một client kết nối tới <code>/chat</code> mà không có token nào. Chuyện gì xảy ra?',
          ),
          options: [
            B('It connects: <code>io.use()</code> only guards <code>/</code>, so <code>/chat</code> is wide open', 'Nó kết nối được: <code>io.use()</code> chỉ canh <code>/</code>, nên <code>/chat</code> mở toang'),
            B('It is rejected: <code>io.use()</code> is a server-wide middleware and covers every namespace', 'Nó bị từ chối: <code>io.use()</code> là middleware toàn máy chủ và phủ mọi namespace'),
            B('It connects but every event it emits is dropped until it authenticates', 'Nó kết nối được nhưng mọi sự kiện nó phát đều bị bỏ cho tới khi xác thực'),
            B('The server refuses to start: a namespace without its own middleware is a configuration error', 'Máy chủ không khởi động được: một namespace không có middleware riêng là lỗi cấu hình'),
          ],
          correct: 0,
          explanation: EX(
            'Measured with logs on both middlewares: connecting to <code>/</code> printed the <code>io.use</code> line, connecting to <code>/chat</code> printed only the <code>/chat</code> line. <code>io.use()</code> is shorthand for <code>io.of("/").use()</code> — nothing more. Every namespace you add needs its own <code>.use()</code>, and forgetting is silent, because the new namespace works perfectly for the developer who is already logged in.',
            'Đo bằng log ở cả hai middleware: kết nối vào <code>/</code> in ra dòng của <code>io.use</code>, kết nối vào <code>/chat</code> chỉ in dòng của <code>/chat</code>. <code>io.use()</code> chỉ là cách viết tắt của <code>io.of("/").use()</code> — không hơn. Mỗi namespace bạn thêm đều cần <code>.use()</code> riêng, và quên thì im lặng, vì namespace mới chạy hoàn hảo với chính lập trình viên vốn đã đăng nhập sẵn.',
          ),
        }),

        mcq({
          prompt: B(
            'Sockets in <code>/</code> and sockets in <code>/chat</code> all join a room called <code>"phong"</code>. The server then runs <code>io.of("/").to("phong").emit("X")</code>. Who receives it?',
            'Các socket ở <code>/</code> và các socket ở <code>/chat</code> đều join một room tên <code>"phong"</code>. Máy chủ chạy <code>io.of("/").to("phong").emit("X")</code>. Ai nhận được?',
          ),
          options: [
            B('Everyone in <code>"phong"</code> in both namespaces — room names are global', 'Mọi người trong <code>"phong"</code> ở cả hai namespace — tên room là toàn cục'),
            B('Everyone in <code>/</code> plus one socket picked at random from <code>/chat</code>', 'Mọi người ở <code>/</code> cộng một socket lấy ngẫu nhiên từ <code>/chat</code>'),
            B('Nobody: joining the same room name from two namespaces makes it ambiguous and the emit is dropped', 'Không ai: join cùng tên room từ hai namespace làm nó nhập nhằng và lệnh emit bị bỏ'),
            B('Only the sockets in <code>/</code>; <code>/chat</code> has its own adapter and its own <code>"phong"</code>', 'Chỉ các socket ở <code>/</code>; <code>/chat</code> có adapter riêng và <code>"phong"</code> riêng của nó'),
          ],
          correct: 3,
          explanation: EX(
            'Measured with clients on both namespaces counting arrivals: the two sockets in <code>/</code> got it and the one in <code>/chat</code> got nothing, even though <code>adapter.rooms.has("phong")</code> was true on BOTH adapters and <code>io.of("/").adapter !== io.of("/chat").adapter</code>. That is the real isolation guarantee a namespace buys you, and it is the reason multi-tenant systems reach for namespaces rather than a room prefix.',
            'Đo bằng client ở cả hai namespace cùng đếm: hai socket ở <code>/</code> nhận được và cái ở <code>/chat</code> không nhận gì, dù <code>adapter.rooms.has("phong")</code> đều là true ở CẢ HAI adapter và <code>io.of("/").adapter !== io.of("/chat").adapter</code>. Đó chính là bảo đảm cách ly thật mà namespace mang lại, và là lý do các hệ thống nhiều khách hàng chọn namespace thay vì tiền tố tên room.',
          ),
        }),

        mcq({
          prompt: B(
            'A listen-together feature does <code>socket.join("listen:" + id)</code> and stores <code>hostBySid.set("listen:" + id, socket.id)</code>. The host closes the tab. Which statement is correct?',
            'Một tính năng nghe chung chạy <code>socket.join("listen:" + id)</code> và lưu <code>hostBySid.set("listen:" + id, socket.id)</code>. Chủ phòng đóng tab. Phát biểu nào ĐÚNG?',
          ),
          options: [
            B('The adapter drops the room when the last member leaves, but <code>hostBySid</code> keeps its entry forever', 'Adapter xoá room khi thành viên cuối rời đi, nhưng <code>hostBySid</code> giữ mục của nó mãi mãi'),
            B('The adapter fires a <code>"room:deleted"</code> event you can subscribe to for cleanup', 'Adapter phát một sự kiện <code>"room:deleted"</code> mà bạn có thể lắng nghe để dọn dẹp'),
            B('Both the room and the Map entry are cleaned up, because the Map is keyed by a room name', 'Cả room lẫn mục trong Map đều được dọn, vì Map khoá theo tên room'),
            B('The room survives with size 0 until the server restarts, so <code>hostBySid</code> stays consistent with it', 'Room sống sót với size 0 cho tới khi máy chủ khởi động lại, nên <code>hostBySid</code> vẫn nhất quán với nó'),
          ],
          correct: 0,
          explanation: EX(
            'Measured on a per-user room: with two tabs open the room had size 2, with one tab left it had size 1, and after the last one closed <code>adapter.rooms.has(...)</code> returned <code>false</code> — the key is gone, not left at zero. There is no deletion event to hook, so any Map of your own keyed by room or by sid must be swept in the <code>disconnect</code> handler by hand, or it grows one dead entry per session forever.',
            'Đo trên một room theo người dùng: mở hai tab thì room có size 2, còn một tab thì size 1, và sau khi tab cuối đóng thì <code>adapter.rooms.has(...)</code> trả về <code>false</code> — khoá biến mất chứ không nằm lại ở 0. Không có sự kiện xoá nào để móc vào, nên mọi Map của riêng bạn khoá theo room hay theo sid đều phải tự quét trong handler <code>disconnect</code>, nếu không nó phình thêm một mục chết cho mỗi phiên, mãi mãi.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — The room router (chapter 3).</b> Implement <code>nguoiNhan(sockets, call)</code>: given the sockets and one emit call, return the list of socket <b>names</b> that actually receive the packet, in the order the sockets are declared.</p>' +
            '<p>Every socket is implicitly a member of a private room named after its own <code>id</code>, on top of the rooms listed in <code>rooms</code>.</p>' +
            '<p>A call is <code>{ nguoiGui, to, except, chiMinh }</code>:</p>' +
            '<ul>' +
            '<li><code>nguoiGui</code> is <code>null</code> for a server-level call (<code>io.…</code>) and a socket name for a socket-level call (<code>socket.to(…)</code>, <code>socket.broadcast</code>).</li>' +
            '<li><code>chiMinh: true</code> means plain <code>socket.emit()</code> — only the sender.</li>' +
            '<li><code>to</code> empty means "start from every socket"; otherwise start from the <b>union</b> of those rooms.</li>' +
            '<li>Then subtract every member of every room in <code>except</code>.</li>' +
            '<li>Then, if <code>nguoiGui</code> is not <code>null</code>, remove the sender — <b>last</b>, after everything else.</li>' +
            '<li>A room nobody joined contributes nobody, and is not an error.</li>' +
            '</ul>' +
            '<p>Every expected line below was verified against a real socket.io 4.8.3 server with four connected clients. Keep the given data and the printing loop exactly as they are, and do not require any module.</p>',

            '<p><b>Câu 31 — Bộ định tuyến room (chương 3).</b> Cài đặt <code>nguoiNhan(sockets, call)</code>: cho danh sách socket và một lời gọi emit, trả về danh sách <b>tên</b> các socket thật sự nhận được gói tin, theo đúng thứ tự socket được khai báo.</p>' +
            '<p>Mọi socket đều mặc nhiên là thành viên của một room riêng mang tên <code>id</code> của chính nó, bên cạnh những room ghi trong <code>rooms</code>.</p>' +
            '<p>Một lời gọi có dạng <code>{ nguoiGui, to, except, chiMinh }</code>:</p>' +
            '<ul>' +
            '<li><code>nguoiGui</code> là <code>null</code> với lời gọi cấp máy chủ (<code>io.…</code>) và là tên một socket với lời gọi cấp socket (<code>socket.to(…)</code>, <code>socket.broadcast</code>).</li>' +
            '<li><code>chiMinh: true</code> nghĩa là <code>socket.emit()</code> trần — chỉ chính người gửi.</li>' +
            '<li><code>to</code> rỗng nghĩa là "xuất phát từ mọi socket"; ngược lại xuất phát từ <b>hợp</b> của các room đó.</li>' +
            '<li>Sau đó trừ đi mọi thành viên của mọi room trong <code>except</code>.</li>' +
            '<li>Rồi, nếu <code>nguoiGui</code> khác <code>null</code>, gỡ người gửi ra — <b>sau cùng</b>, sau tất cả các bước trên.</li>' +
            '<li>Một room không ai join thì không đóng góp ai, và đó không phải lỗi.</li>' +
            '</ul>' +
            '<p>Mọi dòng kết quả mong đợi bên dưới đều đã được đối chiếu với một máy chủ socket.io 4.8.3 thật có bốn client đang kết nối. Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và không được require thư viện nào.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const SOCKETS = [\n' +
            "  { ten: 'A', id: 'sA', rooms: ['r1'] },\n" +
            "  { ten: 'B', id: 'sB', rooms: ['r1', 'r2'] },\n" +
            "  { ten: 'C', id: 'sC', rooms: ['r2'] },\n" +
            "  { ten: 'D', id: 'sD', rooms: [] },\n" +
            '];\n' +
            'const CALLS = [\n' +
            "  { nhan: 'io.emit(e)',                          nguoiGui: null, to: [], except: [] },\n" +
            "  { nhan: 'io.to(\"r1\").emit(e)',                 nguoiGui: null, to: ['r1'], except: [] },\n" +
            "  { nhan: 'socket(A).to(\"r1\").emit(e)',          nguoiGui: 'A',  to: ['r1'], except: [] },\n" +
            "  { nhan: 'socket(A).broadcast.emit(e)',         nguoiGui: 'A',  to: [], except: [] },\n" +
            "  { nhan: 'socket(A).emit(e)',                   nguoiGui: 'A',  chiMinh: true },\n" +
            "  { nhan: 'socket(A).broadcast.to(\"r2\").emit(e)',nguoiGui: 'A',  to: ['r2'], except: [] },\n" +
            "  { nhan: 'io.except(\"r2\").emit(e)',             nguoiGui: null, to: [], except: ['r2'] },\n" +
            "  { nhan: 'io.to(\"r1\").except(\"r2\").emit(e)',    nguoiGui: null, to: ['r1'], except: ['r2'] },\n" +
            "  { nhan: 'io.to(\"r1\").to(\"r2\").emit(e)',        nguoiGui: null, to: ['r1', 'r2'], except: [] },\n" +
            "  { nhan: 'io.to([\"r1\",\"r2\"]).emit(e)',          nguoiGui: null, to: ['r1', 'r2'], except: [] },\n" +
            "  { nhan: 'io.to(\"sA\").emit(e)',                 nguoiGui: null, to: ['sA'], except: [] },\n" +
            "  { nhan: 'socket(A).to(\"sA\").emit(e)',          nguoiGui: 'A',  to: ['sA'], except: [] },\n" +
            "  { nhan: 'io.to(\"khongcothat\").emit(e)',        nguoiGui: null, to: ['khongcothat'], except: [] },\n" +
            "  { nhan: 'socket(B).to(\"r1\").to(\"r2\").emit(e)', nguoiGui: 'B',  to: ['r1', 'r2'], except: [] },\n" +
            "  { nhan: 'io.to(\"r1\").except(\"r1\").emit(e)',    nguoiGui: null, to: ['r1'], except: ['r1'] },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function nguoiNhan(sockets, call) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'let tong = 0;\n' +
            'for (const call of CALLS) {\n' +
            '  const ds = nguoiNhan(SOCKETS, call);\n' +
            '  tong += ds.length;\n' +
            "  console.log(call.nhan.padEnd(31) + ' -> ' + (ds.length ? ds.join(',') : '(khong ai)'));\n" +
            '}\n' +
            "console.log('tong so goi da giao = ' + tong);\n",
          expectedOutput:
            'io.emit(e)                      -> A,B,C,D\n' +
            'io.to("r1").emit(e)             -> A,B\n' +
            'socket(A).to("r1").emit(e)      -> B\n' +
            'socket(A).broadcast.emit(e)     -> B,C,D\n' +
            'socket(A).emit(e)               -> A\n' +
            'socket(A).broadcast.to("r2").emit(e) -> B,C\n' +
            'io.except("r2").emit(e)         -> A,D\n' +
            'io.to("r1").except("r2").emit(e) -> A\n' +
            'io.to("r1").to("r2").emit(e)    -> A,B,C\n' +
            'io.to(["r1","r2"]).emit(e)      -> A,B,C\n' +
            'io.to("sA").emit(e)             -> A\n' +
            'socket(A).to("sA").emit(e)      -> (khong ai)\n' +
            'io.to("khongcothat").emit(e)    -> (khong ai)\n' +
            'socket(B).to("r1").to("r2").emit(e) -> A,C\n' +
            'io.to("r1").except("r1").emit(e) -> (khong ai)\n' +
            'tong so goi da giao = 25',
          sampleSolution:
            'function nguoiNhan(sockets, call) {\n' +
            '  // Dựng bản đồ room -> tên socket. Room RIÊNG mang chính id của socket\n' +
            '  // luôn có, đúng như adapter.rooms của socket.io thật.\n' +
            '  const phong = new Map();\n' +
            '  for (const s of sockets) {\n' +
            '    for (const r of [s.id, ...s.rooms]) {\n' +
            '      if (!phong.has(r)) phong.set(r, new Set());\n' +
            '      phong.get(r).add(s.ten);\n' +
            '    }\n' +
            '  }\n' +
            '  const guiBoi = call.nguoiGui;\n' +
            '  if (call.chiMinh) return [guiBoi];\n\n' +
            '  let tap;\n' +
            '  if (!call.to || call.to.length === 0) tap = new Set(sockets.map((s) => s.ten));\n' +
            '  else {\n' +
            '    tap = new Set();                       // HỢP, không phải giao\n' +
            '    for (const r of call.to) for (const t of phong.get(r) ?? []) tap.add(t);\n' +
            '  }\n' +
            '  for (const r of call.except ?? []) for (const t of phong.get(r) ?? []) tap.delete(t);\n' +
            '  // Loại người gửi SAU CÙNG — đó là lý do socket.to(chính-id-mình) không tới ai.\n' +
            '  if (guiBoi !== null) tap.delete(guiBoi);\n' +
            '  return sockets.map((s) => s.ten).filter((t) => tap.has(t));\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — The handshake gatekeeper (chapters 0 and 2).</b> Two functions.</p>' +
            '<p><code>docHandshake(body)</code> — <code>body</code> is a real engine.io OPEN frame, i.e. the character <code>0</code> followed by JSON. Return <code>{ sid, nangCapDuoc, cuaSoPhatHien }</code> where <code>nangCapDuoc</code> is true when <code>upgrades</code> is a non-empty array, and <code>cuaSoPhatHien</code> is the worst-case time in ms before the server notices a client that vanished without a TCP FIN.</p>' +
            '<p><code>phanTich(handshakes, requests)</code> — a session belongs to the worker that issued it. For each request return one string, applying the checks in <b>exactly this order</b>:</p>' +
            '<ul>' +
            '<li>the transport is not <code>"polling"</code> and not <code>"websocket"</code> → <code>400 code=0 Transport unknown</code></li>' +
            '<li>otherwise, a <code>sid</code> is present → <code>200 ok</code> if this worker issued it, else <code>400 code=1 Session ID unknown</code>. <b>The protocol version is not checked at all in this branch.</b></li>' +
            '<li>otherwise (no <code>sid</code>) → <code>400 code=5 Unsupported protocol version</code> unless <code>EIO</code> is exactly the string <code>"4"</code></li>' +
            '<li>otherwise → <code>200 handshake moi</code></li>' +
            '</ul>' +
            '<p>Return <code>{ phien, ketQua, sticky }</code>. <code>phien</code> is one entry per handshake in order, each <code>{ worker, sid, nangCapDuoc, cuaSoPhatHien }</code>; <code>ketQua</code> is one <code>{ req, ma }</code> per request in order; <code>sticky</code> is <code>false</code> as soon as any answer is a code 1.</p>' +
            '<p>Every rule above was measured against a real socket.io 4.8.3 server, including the counter-intuitive one: an old <code>EIO</code> on a valid sid answers 200. Keep the given data and the printing block exactly as they are, and do not require any module.</p>',

            '<p><b>Câu 32 — Người gác cổng bắt tay (chương 0 và 2).</b> Hai hàm.</p>' +
            '<p><code>docHandshake(body)</code> — <code>body</code> là một frame OPEN engine.io thật, tức ký tự <code>0</code> rồi tới JSON. Trả về <code>{ sid, nangCapDuoc, cuaSoPhatHien }</code>, trong đó <code>nangCapDuoc</code> đúng khi <code>upgrades</code> là mảng khác rỗng, và <code>cuaSoPhatHien</code> là thời gian tệ nhất tính bằng ms để máy chủ nhận ra một client biến mất mà không có FIN của TCP.</p>' +
            '<p><code>phanTich(handshakes, requests)</code> — một phiên thuộc về worker đã cấp nó. Với mỗi request trả về một chuỗi, áp các phép kiểm theo <b>đúng thứ tự này</b>:</p>' +
            '<ul>' +
            '<li>transport không phải <code>"polling"</code> và không phải <code>"websocket"</code> → <code>400 code=0 Transport unknown</code></li>' +
            '<li>ngược lại, có <code>sid</code> → <code>200 ok</code> nếu chính worker này đã cấp nó, không thì <code>400 code=1 Session ID unknown</code>. <b>Ở nhánh này phiên bản giao thức KHÔNG được kiểm.</b></li>' +
            '<li>ngược lại (không có <code>sid</code>) → <code>400 code=5 Unsupported protocol version</code> trừ khi <code>EIO</code> đúng bằng chuỗi <code>"4"</code></li>' +
            '<li>ngược lại → <code>200 handshake moi</code></li>' +
            '</ul>' +
            '<p>Trả về <code>{ phien, ketQua, sticky }</code>. <code>phien</code> là một mục cho mỗi handshake theo thứ tự, mỗi mục <code>{ worker, sid, nangCapDuoc, cuaSoPhatHien }</code>; <code>ketQua</code> là một <code>{ req, ma }</code> cho mỗi request theo thứ tự; <code>sticky</code> là <code>false</code> ngay khi có một câu trả lời nào là code 1.</p>' +
            '<p>Mọi quy tắc trên đều đo thật trên một máy chủ socket.io 4.8.3, kể cả quy tắc trái trực giác: một <code>EIO</code> cũ đi kèm sid hợp lệ vẫn trả 200. Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không được require thư viện nào.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const HANDSHAKES = [\n' +
            '  { worker: \'w0\', body: \'0{"sid":"AAA","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}\' },\n' +
            '  { worker: \'w1\', body: \'0{"sid":"BBB","upgrades":[],"pingInterval":25000,"pingTimeout":60000,"maxPayload":1000000}\' },\n' +
            '  { worker: \'w0\', body: \'0{"sid":"CCC","upgrades":["websocket"],"pingInterval":5000,"pingTimeout":10000,"maxPayload":100000}\' },\n' +
            '];\n' +
            'const REQUESTS = [\n' +
            "  { worker: 'w0', EIO: '4',  transport: 'polling',   sid: 'AAA' },\n" +
            "  { worker: 'w1', EIO: '4',  transport: 'polling',   sid: 'AAA' },\n" +
            "  { worker: 'w1', EIO: '4',  transport: 'websocket', sid: 'BBB' },\n" +
            "  { worker: 'w0', EIO: '3',  transport: 'polling',   sid: 'AAA' },\n" +
            "  { worker: 'w0', EIO: '4',  transport: 'polling',   sid: null  },\n" +
            "  { worker: 'w0', EIO: '3',  transport: 'polling',   sid: null  },\n" +
            "  { worker: 'w1', EIO: null, transport: 'polling',   sid: null  },\n" +
            "  { worker: 'w1', EIO: '3',  transport: 'polling',   sid: 'ZZZ' },\n" +
            "  { worker: 'w0', EIO: '4',  transport: 'bogus',     sid: 'ZZZ' },\n" +
            "  { worker: 'w1', EIO: '4',  transport: 'polling',   sid: 'CCC' },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function docHandshake(body) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function phanTich(handshakes, requests) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const out = phanTich(HANDSHAKES, REQUESTS);\n' +
            'for (const p of out.phien) {\n' +
            "  console.log('phien ' + p.sid + ' @' + p.worker +\n" +
            "    ' | nang cap duoc=' + p.nangCapDuoc +\n" +
            "    ' | cua so phat hien=' + p.cuaSoPhatHien + 'ms');\n" +
            '}\n' +
            'for (const k of out.ketQua) {\n' +
            "  console.log('req ' + k.req.worker +\n" +
            "    ' EIO=' + (k.req.EIO ?? '-') +\n" +
            "    ' transport=' + k.req.transport +\n" +
            "    ' sid=' + (k.req.sid ?? '-') + ' -> ' + k.ma);\n" +
            '}\n' +
            "console.log('sticky=' + out.sticky);\n",
          expectedOutput:
            'phien AAA @w0 | nang cap duoc=true | cua so phat hien=45000ms\n' +
            'phien BBB @w1 | nang cap duoc=false | cua so phat hien=85000ms\n' +
            'phien CCC @w0 | nang cap duoc=true | cua so phat hien=15000ms\n' +
            'req w0 EIO=4 transport=polling sid=AAA -> 200 ok\n' +
            'req w1 EIO=4 transport=polling sid=AAA -> 400 code=1 Session ID unknown\n' +
            'req w1 EIO=4 transport=websocket sid=BBB -> 200 ok\n' +
            'req w0 EIO=3 transport=polling sid=AAA -> 200 ok\n' +
            'req w0 EIO=4 transport=polling sid=- -> 200 handshake moi\n' +
            'req w0 EIO=3 transport=polling sid=- -> 400 code=5 Unsupported protocol version\n' +
            'req w1 EIO=- transport=polling sid=- -> 400 code=5 Unsupported protocol version\n' +
            'req w1 EIO=3 transport=polling sid=ZZZ -> 400 code=1 Session ID unknown\n' +
            'req w0 EIO=4 transport=bogus sid=ZZZ -> 400 code=0 Transport unknown\n' +
            'req w1 EIO=4 transport=polling sid=CCC -> 400 code=1 Session ID unknown\n' +
            'sticky=false',
          sampleSolution:
            'function docHandshake(body) {\n' +
            '  const o = JSON.parse(body.slice(1));      // bỏ ký tự "0" của engine.io OPEN\n' +
            '  return {\n' +
            '    sid: o.sid,\n' +
            '    nangCapDuoc: Array.isArray(o.upgrades) && o.upgrades.length > 0,\n' +
            '    cuaSoPhatHien: o.pingInterval + o.pingTimeout,\n' +
            '  };\n' +
            '}\n\n' +
            'function traLoi(req, soHuu) {\n' +
            "  if (req.transport !== 'polling' && req.transport !== 'websocket') {\n" +
            "    return '400 code=0 Transport unknown';\n" +
            '  }\n' +
            '  if (req.sid !== null) {\n' +
            '    // Có sid thì KHÔNG kiểm EIO nữa — đo thật: EIO=3 + sid hợp lệ vẫn 200.\n' +
            "    return soHuu.get(req.sid) === req.worker ? '200 ok' : '400 code=1 Session ID unknown';\n" +
            '  }\n' +
            "  if (req.EIO !== '4') return '400 code=5 Unsupported protocol version';\n" +
            "  return '200 handshake moi';\n" +
            '}\n\n' +
            'function phanTich(handshakes, requests) {\n' +
            '  const soHuu = new Map();\n' +
            '  const phien = [];\n' +
            '  for (const h of handshakes) {\n' +
            '    const d = docHandshake(h.body);\n' +
            '    soHuu.set(d.sid, h.worker);\n' +
            '    phien.push({ worker: h.worker, ...d });\n' +
            '  }\n' +
            '  const ketQua = requests.map((r) => ({ req: r, ma: traLoi(r, soHuu) }));\n' +
            "  return { phien, ketQua, sticky: !ketQua.some((k) => k.ma.startsWith('400 code=1')) };\n" +
            '}\n',
        }),
      ],
    },
  ],
};
